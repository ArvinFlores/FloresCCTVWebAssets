import type { MediaPreviewProps } from './interfaces';

export function MediaPreview ({ previewSrc }: MediaPreviewProps): JSX.Element {
  return (
    <>
      {
        previewSrc.startsWith('data:') && (
          <img
            className="util-fullscreen util-z-1"
            src={previewSrc}
          />
        )
      }
      {
        previewSrc.startsWith('blob:') && (
          <video
            className="util-fullscreen util-z-1"
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
