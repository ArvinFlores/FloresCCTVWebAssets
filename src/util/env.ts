export function isDebugMode (): boolean {
  const q = window.location.search;
  return q.includes('debug=1') || q.includes('debug=true');
}
