interface ScrollParams {
  scrollTop: number;
}

export interface StickyHeaderListItem {
  header: React.ReactNode;
  children: React.ReactNode[];
}

export interface StickyHeaderListProps {
  items: StickyHeaderListItem[];
  scrollTop?: number;
  height?: string;
  preContent?: React.ReactNode;
  postContent?: React.ReactNode;
  onEndReachedThreshold?: number;
  onEndReached?: () => void;
  onScroll?: (params: ScrollParams) => void;
}
