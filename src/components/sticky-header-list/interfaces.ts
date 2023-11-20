interface Item {
  header: React.ReactNode;
  children: React.ReactNode[];
}

export interface StickyHeaderListProps {
  items: Item[];
}
