import './alert.css';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretUp, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { classnames } from 'src/util/classnames';
import type { AlertProps } from './interfaces';

export function Alert ({
  type,
  children,
  expandableLabel,
  expandableContent
}: AlertProps): JSX.Element {
  const [expanded, setExpanded] = useState(false);
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
            className="alert__expandable-btn"
            onClick={toggleExpand}
          >
            <FontAwesomeIcon
              className="alert__expandable-btn-icon"
              icon={expanded ? faCaretUp : faCaretRight}
            />
            {expandableLabel}
          </button>
        )
      }
      {expanded && expandableContent}
    </div>
  );
}
