import type { MultiStreamItem } from 'src/services/stream';

export interface StreamsPreviewProps {
  streams: MultiStreamItem[];
  audioMuted: boolean;
  onVideoPreviewClick?: (video: MultiStreamItem) => void;
}
