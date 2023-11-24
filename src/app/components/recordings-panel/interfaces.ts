import type { FileStorage } from 'florescctvwebservice-types';

export interface RecordingsPanelProps {
  onClose: () => void;
  onItemClick: (file: FileStorage.File) => void;
}

export interface ICreateStickyHeaderItem {
  header: string;
  children: FileStorage.File[];
}
