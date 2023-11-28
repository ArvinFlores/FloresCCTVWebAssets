import type { FileStorage } from 'florescctvwebservice-types';

export interface RecordingsPanelProps {
  onClose: () => void;
  onRecordingItemClick: (file: FileStorage.File) => void;
}
