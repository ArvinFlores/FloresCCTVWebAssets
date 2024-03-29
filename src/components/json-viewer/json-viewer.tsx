import './json-viewer.css';

import type { JSONViewerProps } from './interfaces';

export function JSONViewer ({
  children,
  className = '',
  spaces = 2
}: JSONViewerProps): JSX.Element {
  return (
    <code className={`json-viewer ${className}`.trim()}>
      {JSON.stringify(children, null, spaces)}
    </code>
  );
}
