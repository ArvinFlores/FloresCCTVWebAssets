import type { ErrorCodes } from './interfaces';

export function getRemoteStream ({
  wsUrl,
  onStream,
  onError
}: {
  /**
   * The websocket url of the websocket server running on the rPi device
   */
  wsUrl: string;
  /**
   * Success callback when the stream has been retrieved
   */
  onStream?: (ev: RTCTrackEvent) => void;
  /**
   * Error callback with details about the error
   */
  onError?: (err: {
    message: string;
    code: ErrorCodes;
    details?: object;
  }) => void;
}): void {
  const ws = new WebSocket(wsUrl);
  const pcConfig = {
    iceServers: [
      {
        urls: [
          'stun:stun.l.google.com:19302',
          `stun:${new URL(wsUrl).hostname}:3478`
        ]
      }
    ]
  };
  let iceCandidates: RTCIceCandidate[] = [];
  let pc: RTCPeerConnection | null;
  let remoteDesc = false;

  function createPeerConnection (): void {
    pc = new RTCPeerConnection(pcConfig);
    pc.ontrack = onStream ?? null;
    pc.onicecandidate = (evt) => {
      if (evt.candidate) {
        const {
          sdpMLineIndex,
          sdpMid,
          candidate
        } = evt.candidate;
        const request = {
          what: 'addIceCandidate',
          data: JSON.stringify({ sdpMLineIndex, sdpMid, candidate })
        };

        ws.send(JSON.stringify(request));
      }
    };
    pc.onconnectionstatechange = () => {
      switch (pc?.connectionState) {
        case 'disconnected':
        case 'closed':
        case 'failed':
          onError?.({
            message: 'The peer connection was interrupted',
            code: 'PC_CONN_ERR'
          });
      }
    };
  }

  function addIceCandidates (): void {
    iceCandidates.forEach(candidate => {
      pc?.addIceCandidate(candidate)
        .catch(err => {
          onError?.({
            message: 'The peer connection failed to add the ICE candidate',
            code: 'PC_ADD_ICE_CAND',
            details: err
          });
        });
    });
    iceCandidates = [];
  }

  ws.onopen = () => {
    iceCandidates = [];
    remoteDesc = false;
    createPeerConnection();
    ws.send(JSON.stringify({
      what: 'call',
      options: {
        force_hw_vcodec: false,
        vformat: 60,
        trickle_ice: true
      }
    }));
  };
  ws.onmessage = (evt) => {
    const { what, data } = JSON.parse(evt.data) as { what: string; data: string; };

    switch (what) {
      case 'offer':
        pc?.setRemoteDescription(new RTCSessionDescription(JSON.parse(data)))
          .then(() => {
            remoteDesc = true;
            addIceCandidates();
            pc?.createAnswer()
              .then(answer => {
                pc?.setLocalDescription(answer)
                  .then(() => {
                    ws.send(JSON.stringify({
                      what: 'answer',
                      data: JSON.stringify(answer)
                    }));
                  })
                  .catch((err) => {
                    onError?.({
                      message: 'The peer connection failed to set the local description',
                      code: 'PC_SET_LOCAL_DESC',
                      details: err
                    });
                  });
              })
              .catch(err => {
                onError?.({
                  message: 'The peer connection failed to create an answer',
                  code: 'PC_CREATE_ANSWER',
                  details: err
                });
              });
          })
          .catch((err) => {
            onError?.({
              message: [
                'The peer connection failed to set the session description,',
                'perhaps an unsupported codec on this browser'
              ].join(' '),
              code: 'PC_SET_REMOTE_DESC',
              details: err
            });
          });
        break;
      case 'message':
        if (data && typeof data === 'string' && data.toLowerCase().startsWith('sorry')) {
          onError?.({
            message: data,
            code: 'STREAM_BUSY'
          });
        }
        break;
      case 'iceCandidate':
        if (data) {
          const { sdpMLineIndex, candidate } = JSON.parse(data);
          iceCandidates.push(new RTCIceCandidate({ sdpMLineIndex, candidate }));
          if (remoteDesc) addIceCandidates();
        }
        break;
    }
  };
  ws.onerror = (evt) => {
    onError?.({
      message: 'The connection with the websocket has been closed due to an error',
      code: 'WS_ERR',
      details: evt
    });
  };
  ws.onclose = (evt) => {
    pc?.close();
    pc = null;
  };
}
