import { Button } from 'src/components/button';
import type { ErrorMessageProps } from './interfaces';

export function ErrorMessage ({
  message,
  onRetry
}: ErrorMessageProps): JSX.Element {
  return (
    <div className="util-ta-c">
      <p>{message}</p>
      <Button
        variant="primary"
        onClick={onRetry}
      >
        Retry
      </Button>
    </div>
  );
}
