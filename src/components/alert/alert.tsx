import './alert.css';

import { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretUp } from '@fortawesome/free-solid-svg-icons/faCaretUp';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons/faCaretRight';
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark';
import { classnames } from 'src/util/classnames';
import { uuid } from 'src/util/uuid';
import type { AlertProps } from './interfaces';

export function Alert ({
  type,
  children,
  expandableLabel,
  expandableContent,
  onDismiss
}: AlertProps): JSX.Element {
  const [expanded, setExpanded] = useState(false);
  const randId = useRef<string>(uuid());
  const ariaExpandedContentId = `alert__expandable-content-${randId.current}`;
  const toggleExpand = (): void => {
    setExpanded((val) => !val);
  };

  return (
    <div
      className={classnames({
        alert: true,
        'alert--info': type === 'info',
        'alert--danger': type === 'danger'
      })}
    >
      {
        onDismiss && (
          <button
            className="alert__close-btn"
            onClick={onDismiss}
          >
            <FontAwesomeIcon
              icon={faXmark}
              size="2x"
            />
          </button>
        )
      }
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
