export function downloadLocalFile (url: string, filename?: string): void {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename ?? new Date().toLocaleString().replace(/[,\s+//]/gi, '_');

  link.click();
}
