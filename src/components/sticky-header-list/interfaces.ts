export interface StickyHeaderListItem {
  header: React.ReactNode;
  children: React.ReactNode[];
}

export interface StickyHeaderListProps {
  items: StickyHeaderListItem[];
  preContent?: React.ReactNode;
  postContent?: React.ReactNode;
  onEndReachedThreshold?: number;
  onEndReached?: () => void;
}
