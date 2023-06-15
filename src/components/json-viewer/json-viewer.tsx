import './json-viewer.css';

import type { JSONViewerProps } from './interfaces';

export function JSONViewer ({
  children,
  spaces = 2
}: JSONViewerProps): JSX.Element {
  return <pre className="json-viewer">{JSON.stringify(children, null, spaces)}</pre>;
}
