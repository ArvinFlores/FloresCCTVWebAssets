import './sticky-header-list.css';

import {
  useEffect,
  useRef
} from 'react';
import { debounce } from 'src/util/debounce';
import type { StickyHeaderListProps } from './interfaces';

export function StickyHeaderList ({
  items,
  preContent,
  postContent,
  onEndReachedThreshold = 100,
  onEndReached
}: StickyHeaderListProps): JSX.Element {
  const root = useRef<HTMLDivElement>(null);
  const handleOnScroll = debounce(() => {
    const {
      scrollHeight,
      scrollTop,
      clientHeight
    } = root.current as HTMLDivElement;
    const scrollPos = Math.abs(scrollHeight - scrollTop - clientHeight);

    if (scrollPos < onEndReachedThreshold) {
      onEndReached?.();
    }
  }, 500);

  useEffect(
    () => {
      const node = root.current;

      if (!onEndReached) {
        return;
      }

      node?.addEventListener('scroll', handleOnScroll);

      return () => {
        node?.removeEventListener('scroll', handleOnScroll);
      };
    },
    [handleOnScroll]
  );

  return (
    <div
      ref={root}
      className="sticky-header-list"
    >
      {preContent}
      {
        items.map(({ header, children }, idx) => (
          <div
            key={idx}
            className="sticky-header-list__section"
          >
            <div className="sticky-header-list__header">{header}</div>
            {
              children.map((child, i) => (
                <div
                  key={i}
                  className="sticky-header-list__item"
                >
                  {child}
                </div>
              ))
            }
          </div>
        ))
      }
      {postContent}
    </div>
  );
}
