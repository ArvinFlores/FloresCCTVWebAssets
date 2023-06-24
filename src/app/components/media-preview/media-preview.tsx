import type { MediaPreviewProps } from './interfaces';

export function MediaPreview ({ previewSrc }: MediaPreviewProps): JSX.Element {
  return (
    <>
      {
        previewSrc.startsWith('data:') && (
          <img
            className="app__media-preview app__media-preview--high-priority"
            src={previewSrc}
          />
        )
      }
      {
        previewSrc.startsWith('blob:') && (
          <video
            className="app__media-preview app__media-preview--high-priority"
            src={previewSrc}
            autoPlay={true}
            muted={true}
            loop={true}
          />
        )
      }
    </>
  );
}
