import './alert.css';

import { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretUp, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { classnames } from 'src/util/classnames';
import { uuid } from 'src/util/uuid';
import type { AlertProps } from './interfaces';

export function Alert ({
  type,
  children,
  expandableLabel,
  expandableContent
}: AlertProps): JSX.Element {
  const [expanded, setExpanded] = useState(false);
  const randId = useRef<string>(uuid());
  const ariaExpandedContentId = `alert__expandable-content-${randId.current}`;
  const toggleExpand = (): void => {
    setExpanded(val => !val);
  };

  return (
    <div
      className={classnames({
        alert: true,
        'alert--info': type === 'info',
        'alert--danger': type === 'danger'
      })}
    >
      <div>
        {children}
      </div>
      {
        (expandableLabel ?? '') && (
          <button
            aria-expanded={expanded}
            aria-controls={ariaExpandedContentId}
            className="alert__expandable-btn"
            onClick={toggleExpand}
          >
            <FontAwesomeIcon
              className="alert__expandable-btn-icon"
              icon={expanded ? faCaretUp : faCaretRight}
            />
            <span>{expandableLabel}</span>
          </button>
        )
      }
      {
        expanded && (
          <div id={ariaExpandedContentId}>
            {expandableContent}
          </div>
        )
      }
    </div>
  );
}
