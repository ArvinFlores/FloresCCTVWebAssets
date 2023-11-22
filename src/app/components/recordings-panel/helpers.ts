import { createElement } from 'react';
import type { FileStorage } from 'florescctvwebservice-types';
import type { StickyHeaderListItem } from 'src/components/sticky-header-list/interfaces';
import { RecordingItem } from './components/recording-item';

export function createStickyHeaderItems (files: FileStorage.File[]): StickyHeaderListItem[] {
  return files.reduce<StickyHeaderListItem[]>(
    (acc, item) => {
      const last = acc[acc.length - 1] as StickyHeaderListItem | undefined;
      const lastDate = last ? (last.header as string).split('T')[0] : '';
      const currDate = item.created_at.split('T')[0];
      const el = createElement(
        RecordingItem,
        {
          thumbnail: item.thumbnail,
          label: item.created_at
        }
      );

      if (!last || lastDate !== currDate) {
        return [
          ...acc,
          {
            header: item.created_at,
            children: [el]
          }
        ];
      }

      last.children.push(el);

      return acc;
    },
    []
  );
}
