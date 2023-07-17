import Janus, { type JanusJS } from 'janus-gateway';

import type { MultiStreamValue } from '../interfaces';
import { createRecordingHelpers } from '../helpers';
import {
  plugin,
  iceServers
} from './constants';
import {
  createRemoteFeed,
  createPublisherStreams,
  toMultiStreamItems
} from './helpers';
import type {
  JanusVideoroomStreamI,
  JanusRemoteTrack,
  JanusVideoroomMessage
} from './interfaces';

/**
 * Gets a stream from a Janus room
 */
export function getJanusVideoroomStream ({
  wsUrl,
  room,
  onStreamChange,
  onVideoRecorded
}: JanusVideoroomStreamI): MultiStreamValue {
  let localHandle: JanusJS.PluginHandle | undefined;
  const remoteTracks = new Map<number, JanusRemoteTrack>();
  const {
    startRecording,
    stopRecording
  } = createRecordingHelpers();

  Janus.init({
    debug: true,
    // eslint-disable-next-line react-hooks/rules-of-hooks
    dependencies: Janus.useDefaultDependencies(),
    callback: () => {
      const janus = new Janus({
        server: wsUrl,
        iceServers,
        success: () => {
          janus.attach({
            plugin,
            success: (handle) => {
              localHandle = handle;
              localHandle.send({
                message: {
                  request: 'join',
                  room,
                  ptype: 'publisher'
                }
              });
            },
            onmessage: (message: JanusVideoroomMessage, jsep) => {
              const {
                videoroom: event,
                publishers,
                leaving
              } = message;

              if (!event) return;

              if (event === 'joined') {
                if (Array.isArray(publishers)) {
                  publishers.forEach(publisher => {
                    createRemoteFeed({
                      streams: createPublisherStreams(publisher),
                      room,
                      janus,
                      onRemoteTrack: (track) => {
                        if (!track.muted) {
                          const stream = remoteTracks.get(publisher.id)?.stream ?? new MediaStream();
                          stream.addTrack(track);
                          remoteTracks.set(
                            publisher.id,
                            { stream, label: publisher.display ?? '' }
                          );
                        }

                        onStreamChange?.(toMultiStreamItems(remoteTracks));
                      }
                    });
                  });
                }
              } else if (event === 'event') {
                if (Array.isArray(publishers)) {
                  publishers.forEach(publisher => {
                    createRemoteFeed({
                      streams: createPublisherStreams(publisher),
                      room,
                      janus,
                      onRemoteTrack: (track) => {
                        if (!track.muted) {
                          const stream = remoteTracks.get(publisher.id)?.stream ?? new MediaStream();
                          stream.addTrack(track);
                          remoteTracks.set(
                            publisher.id,
                            { stream, label: publisher.display ?? '' }
                          );
                        }

                        onStreamChange?.(toMultiStreamItems(remoteTracks));
                      }
                    });
                  });
                } else if (leaving) {
                  remoteTracks.delete(leaving);
                  onStreamChange?.(toMultiStreamItems(remoteTracks));
                }
              }

              if (jsep) {
                localHandle?.handleRemoteJsep({ jsep });
              }
            }
          });
        }
      });
    }
  });

  return {
    hasLocalStream () {
      const tracks = localHandle?.getLocalTracks() ?? [];

      return tracks.length > 0;
    },
    addLocalStream (stream) {
      localHandle?.createOffer({
        // @ts-expect-error janus typings have not been updated by the author
        tracks: stream.getTracks().map(track => ({
          type: track.kind,
          capture: track
        })),
        success: (jsep) => {
          localHandle?.send({
            jsep,
            message: {
              request: 'configure',
              audio: true,
              video: false
            }
          });
        }
      });
    },
    toggleLocalAudio () {
      if (!localHandle) return false;

      const muted = localHandle.isAudioMuted();

      if (muted) localHandle.unmuteAudio();
      else localHandle.muteAudio();

      return !muted;
    },
    startVideoRecording (item) {
      const remoteTrack = remoteTracks.get(item.id);

      if (!remoteTrack) return;

      startRecording(
        remoteTrack.stream,
        onVideoRecorded
      );
    },
    stopVideoRecording: stopRecording
  };
}
