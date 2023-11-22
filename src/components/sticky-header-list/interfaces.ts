export interface StickyHeaderListItem {
  header: React.ReactNode;
  children: React.ReactNode[];
}

export interface StickyHeaderListProps {
  items: StickyHeaderListItem[];
}
