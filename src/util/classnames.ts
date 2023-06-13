export function classnames (classes: Record<string, boolean | undefined>): string {
  return Object.keys(classes).reduce(
    (acc, className) => {
      return (classes[className] ?? false) ? `${acc} ${className}` : acc;
    },
    ''
  ).trim();
}
