import type { MultiStreamItem } from 'src/services/stream';

export function without (
  item: MultiStreamItem | null,
  items: MultiStreamItem[]
): MultiStreamItem[] {
  if (item === null) return items;
  const keys = Object.keys(item);
  return items.filter(i => {
    const isItem = keys.every(
      key => item[key] === i[key]
    ) && keys.length === Object.keys(i).length;
    return !isItem;
  });
}
