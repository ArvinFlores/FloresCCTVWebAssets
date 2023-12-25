import './sticky-header-list.css';

import {
  useEffect,
  useRef
} from 'react';
import { debounce } from 'src/util/debounce';
import type { StickyHeaderListProps } from './interfaces';

export function StickyHeaderList ({
  items,
  scrollTop,
  height = '100%',
  preContent,
  postContent,
  onEndReachedThreshold = 100,
  onEndReached,
  onScroll
}: StickyHeaderListProps): JSX.Element {
  const root = useRef<HTMLDivElement>(null);
  const handleOnEndReached = debounce(() => {
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
  const handleOnScroll = (): void => {
    const { scrollTop } = root.current as HTMLDivElement;
    onScroll?.({ scrollTop });
  };

  useEffect(
    () => {
      const node = root.current;

      if (!onEndReached) {
        return;
      }

      node?.addEventListener('scroll', handleOnEndReached);

      return () => {
        node?.removeEventListener('scroll', handleOnEndReached);
      };
    },
    [handleOnEndReached]
  );

  useEffect(
    () => {
      const node = root.current;

      if (!onScroll) {
        return;
      }

      node?.addEventListener('scroll', handleOnScroll);

      return () => {
        node?.removeEventListener('scroll', handleOnScroll);
      };
    },
    [handleOnScroll]
  );

  useEffect(
    () => {
      if (root.current && scrollTop != null) {
        root.current.scrollTop = scrollTop;
      }
    },
    [scrollTop]
  );

  return (
    <div
      ref={root}
      className="sticky-header-list"
      style={{ height }}
    >
      {preContent}
      {
        items.map(({ header, children }, idx) => (
          <div
            key={idx}
            className="sticky-header-list__section"
          >
            <div className="sticky-header-list__header util-z-2000">{header}</div>
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
