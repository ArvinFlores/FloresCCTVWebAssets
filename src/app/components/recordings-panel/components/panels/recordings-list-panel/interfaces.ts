import type { FileStorage } from 'florescctvwebservice-types';

export interface RecordingsListPanelProps {
  onItemClick: (file: FileStorage.File) => void;
}

export interface ICreateStickyHeaderItem {
  header: string;
  children: FileStorage.File[];
}
