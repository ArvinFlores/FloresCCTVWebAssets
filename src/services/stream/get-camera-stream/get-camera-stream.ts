import { WebSocketConnection } from 'src/services/websocket-connection';
import { getSenderTracks } from './helpers';
import { createRecordingHelpers } from '../helpers';
import type { SingleStreamI, SingleStreamValue } from '../interfaces';

/**
 * Gets the camera stream directly from the raspberry pi
 */
export function getCameraStream ({
  wsUrl,
  onStreamChange,
  onError,
  onVideoRecorded,
  onWSConnectionChange
}: SingleStreamI): SingleStreamValue {
  const ws = new WebSocketConnection(wsUrl, [], { maxReconnectAttempts: 8 });
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
  let remoteDesc = false;
  const {
    startRecording,
    stopRecording
  } = createRecordingHelpers();

  function createPeerConnection (): void {
    pc = new RTCPeerConnection(pcConfig);
    pc.ontrack = (ev) => {
      onStreamChange?.(ev.streams[0]);
    };
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
    pc.onnegotiationneeded = async () => {
      await pc?.setLocalDescription(await pc.createOffer());
      ws.send(JSON.stringify({
        what: 'offer',
        data: pc?.localDescription
      }));
    };
  }

  function addIceCandidates (): void {
    iceCandidates.forEach(candidate => {
      pc?.addIceCandidate(candidate)
        .catch(err => {
          onError?.({
            message: 'The peer connection failed to add the ICE candidate',
            code: 'PC_ADD_ICE_CAND',
            details: err.message ?? ''
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
                      details: err.message ?? ''
                    });
                  });
              })
              .catch(err => {
                onError?.({
                  message: 'The peer connection failed to create an answer',
                  code: 'PC_CREATE_ANSWER',
                  details: err.message ?? ''
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
              details: err.message ?? ''
            });
          });
        break;
      case 'message':
        if (data && typeof data === 'string' && data.toLowerCase().startsWith('sorry')) {
          onError?.({
            message: data,
            code: 'STREAM_BUSY'
          });
          ws.close();
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
    if ('detail' in evt) {
      pc?.close();
      pc = null;
      onError?.(evt.detail);
    }
  };
  ws.onclose = () => {
    pc?.close();
    pc = null;
  };
  ws.onconnectionstatechange = (ev) => onWSConnectionChange?.(ev);

  return {
    hasLocalStream () {
      return getSenderTracks(pc).length > 0;
    },
    addLocalStream (stream) {
      stream.getTracks().forEach(track => pc?.addTrack(track, stream));
    },
    toggleLocalAudio () {
      const tracks = getSenderTracks(pc);
      const audioTracks = tracks.filter(track => track?.kind === 'audio');
      const audioTrack = audioTracks[0];

      if (audioTrack == null) return false;

      audioTrack.enabled = !audioTrack.enabled;

      return audioTrack.enabled;
    },
    startVideoRecording () {
      startRecording(
        pc?.getReceivers().map(rc => rc.track) ?? [],
        onVideoRecorded
      );
    },
    stopVideoRecording: stopRecording
  };
}
