import type { FileStorage } from 'florescctvwebservice-types';

export interface RecordingsPanelProps {
  onClose: () => void;
}

export interface ICreateStickyHeaderItem {
  header: string;
  children: FileStorage.File[];
}
