export function takeScreenshot (video: HTMLVideoElement, imageType = 'image/jpeg'): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const { videoHeight, videoWidth } = video;

  canvas.width = videoWidth;
  canvas.height = videoHeight;
  ctx?.drawImage(video, 0, 0, videoWidth, videoHeight);

  return canvas.toDataURL(imageType);
}
