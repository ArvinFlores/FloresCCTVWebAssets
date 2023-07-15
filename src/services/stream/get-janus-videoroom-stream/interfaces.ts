import type { MultiStreamI } from '../interfaces';

export interface JanusVideoroomStreamI extends MultiStreamI {
  room: number;
}

export interface JanusRemoteTrack {
  label: string;
  stream: MediaStream;
}

export interface JanusPublisherStream {
  type: 'audio' | 'video' | 'data';
  mindex: number;
  mid: string;
}

export interface JanusPublisher {
  id: number;
  streams: JanusPublisherStream[];
  display?: string;
}

export interface JanusVideoroomMessage {
  videoroom: 'joined' | 'event';
  publishers: JanusPublisher[];
  leaving: number;
}
