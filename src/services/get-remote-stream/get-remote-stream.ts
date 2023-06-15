import { createRecorderOptions } from './helpers';
import type { GetRemoteStreamI, GetRemoteStreamValue } from './interfaces';

export function getRemoteStream ({
  wsUrl,
  onStream,
  onError,
  onVideoRecorded
}: GetRemoteStreamI): GetRemoteStreamValue {
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
  let pc: RTCPeerConnection | null = null;
  let recorder: MediaRecorder | null = null;
  let recordedBlobs: Blob[] = [];
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

  return {
    startVideoRecording () {
      const tracks = pc?.getReceivers().map(rc => rc.track);

      if (!tracks || !tracks.length || recorder?.state === 'recording') return;

      try {
        recorder = new MediaRecorder(
          new MediaStream(tracks),
          createRecorderOptions()
        );
      } catch (e) {
        return onError?.({
          message: 'Your browser does not support recording media',
          code: 'MEDIA_REC_UNSUPPORTED',
          details: e
        });
      }

      recorder.onstop = () => {
        onVideoRecorded?.(new Blob(recordedBlobs, { type: 'video/webm' }));

        recordedBlobs = [];
        recorder = null;
      };
      recorder.ondataavailable = (evt) => {
        if (evt.data.size > 0) {
          recordedBlobs.push(evt.data);
        }
      };

      recorder.start();
    },
    stopVideoRecording () {
      recorder?.stop();
    }
  };
}
