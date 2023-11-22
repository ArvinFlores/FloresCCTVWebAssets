import type { FileStorage } from 'florescctvwebservice-types';
import { daysBetween } from 'src/util/datetime';
import type { ICreateStickyHeaderItem } from './interfaces';

export function createStickyHeaderItems (files: FileStorage.File[]): ICreateStickyHeaderItem[] {
  return files.reduce(
    (acc, item) => {
      const last = acc[acc.length - 1] as ICreateStickyHeaderItem | undefined;
      const lastDate = last ? new Date(last.header) : null;
      const currDate = new Date(item.created_at);
      const sameDay = lastDate && daysBetween(lastDate, currDate) === 0;

      if (!last || !sameDay) {
        return [
          ...acc,
          {
            header: item.created_at,
            children: [item]
          }
        ];
      }

      last.children.push(item);

      return acc;
    },
    []
  );
}
