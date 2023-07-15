import type { JanusJS } from 'janus-gateway';

import type { MultiStreamItem } from '../interfaces';
import type {
  JanusRemoteTrack,
  JanusVideoroomMessage,
  JanusPublisher
} from './interfaces';
import { plugin } from './constants';

export function createRemoteFeed ({
  streams,
  janus,
  room,
  onRemoteTrack
}: {
  streams: JanusJS.TrackDesc[];
  janus: JanusJS.Janus;
  room: number;
  onRemoteTrack: JanusJS.PluginCallbacks['onremotetrack'];
}): void {
  let remoteHandle: JanusJS.PluginHandle | undefined;

  janus.attach({
    plugin,
    success: (handle) => {
      remoteHandle = handle;
      remoteHandle.send({
        message: {
          request: 'join',
          room,
          ptype: 'subscriber',
          streams: streams.map(({ id, mid }) => ({ feed: id, mid }))
        }
      });
    },
    onmessage: (message: JanusVideoroomMessage, jsep) => {
      const { videoroom: event } = message;

      if (!event) return;

      if (jsep) {
        // @ts-expect-error janus typings have not been updated by the author
        remoteHandle?.createAnswer({
          jsep,
          success: (jsep) => {
            remoteHandle?.send({
              jsep,
              message: {
                request: 'start',
                room
              }
            });
          }
        });
      }
    },
    onremotetrack: onRemoteTrack
  });
}

export function createPublisherStreams (publisher: JanusPublisher): Array<Record<string, number | string>> {
  return publisher.streams.map(stream => ({
    ...stream,
    id: publisher.id,
    display: publisher.display ?? ''
  }));
}

export function toMultiStreamItems (tracks: Map<number, JanusRemoteTrack>): MultiStreamItem[] {
  return Array.from(tracks.entries()).map(([id, { label, stream }]) => ({
    id,
    label,
    stream
  }));
}
