export interface StickyHeaderListItem {
  header: React.ReactNode;
  children: React.ReactNode[];
}

export interface StickyHeaderListProps {
  items: StickyHeaderListItem[];
  height?: string;
  preContent?: React.ReactNode;
  postContent?: React.ReactNode;
  onEndReachedThreshold?: number;
  onEndReached?: () => void;
}
