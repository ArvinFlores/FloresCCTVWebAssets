import type { FileStorage } from 'florescctvwebservice-types';
import type { StickyHeaderListProps } from 'src/components/sticky-header-list/interfaces';

export type RecordingsListPanelProps = Required<
Pick<
StickyHeaderListProps,
'scrollTop' |
'onScroll'
>
>;

export interface ICreateStickyHeaderItem {
  header: string;
  children: FileStorage.File[];
}
