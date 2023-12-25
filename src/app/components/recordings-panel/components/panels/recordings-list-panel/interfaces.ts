import type { FileStorage } from 'florescctvwebservice-types';
import type { StickyHeaderListProps } from 'src/components/sticky-header-list/interfaces';

export interface RecordingsListPanelProps extends Required<
Pick<
StickyHeaderListProps,
'scrollTop' |
'onScroll'
>
> {
  onItemClick: (file: FileStorage.File) => void;
}

export interface ICreateStickyHeaderItem {
  header: string;
  children: FileStorage.File[];
}
