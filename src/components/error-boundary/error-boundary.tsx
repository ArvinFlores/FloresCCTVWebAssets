import { Component } from 'react';

import type { ErrorBoundaryProps, ErrorBoundaryState } from './interfaces';

export class ErrorBoundary extends Component<
ErrorBoundaryProps,
ErrorBoundaryState
> {
  constructor (props: ErrorBoundaryProps) {
    super(props);

    this.state = { error: null };
  }

  static getDerivedStateFromError (error: Error): ErrorBoundaryState {
    return { error };
  }

  render (): React.ReactNode {
    const { error } = this.state;
    const { fallback, children } = this.props;

    if (error !== null) {
      return typeof fallback === 'function' ? fallback(error) : fallback;
    }

    return children;
  }
}
