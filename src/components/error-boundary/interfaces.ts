export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback: JSX.Element | ((error: Error) => JSX.Element);
}

export interface ErrorBoundaryState {
  error: Error | null;
}
