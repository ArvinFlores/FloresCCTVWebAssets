import type { MediaPreviewProps } from './interfaces';

export function MediaPreview ({ previewSrc }: MediaPreviewProps): JSX.Element {
  return (
    <>
      {
        previewSrc.startsWith('data:') && (
          <img
            className="util-fullscreen util-fullscreen--high-priority"
            src={previewSrc}
          />
        )
      }
      {
        previewSrc.startsWith('blob:') && (
          <video
            className="util-fullscreen util-fullscreen--high-priority"
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
