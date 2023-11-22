export function debounce (fn: (...args: any[]) => void, delay: number): (...args: any[]) => void {
  let timeoutID: NodeJS.Timeout | null = null;

  return function (...args): void {
    if (timeoutID) {
      clearTimeout(timeoutID);
    }
    timeoutID = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}
