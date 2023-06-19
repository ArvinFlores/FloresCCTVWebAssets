export function uuid (len = 10): string {
  const arr = new Uint8Array(len);
  crypto.getRandomValues(arr);
  return Array.from(
    arr,
    dec => dec.toString(16).padStart(2, '0')
  ).join('').slice(0, len);
}
