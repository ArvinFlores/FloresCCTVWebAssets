import './sticky-header-list.css';

import type { StickyHeaderListProps } from './interfaces';

export function StickyHeaderList ({ items }: StickyHeaderListProps): JSX.Element {
  return (
    <div className="sticky-header-list">
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
    </div>
  );
}
