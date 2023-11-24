import { Video } from 'src/components/media';
import type { MediaPreviewProps } from './interfaces';

export function MediaPreview ({
  previewSrc,
  muteVideo
}: MediaPreviewProps): JSX.Element {
  const isVideo = previewSrc.startsWith('blob:') || previewSrc.startsWith('http');

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
        isVideo && (
          <Video
            className="util-fullscreen util-z-1"
            src={previewSrc}
            autoPlay={true}
            muted={muteVideo}
            loop={true}
            playsInline={true}
          />
        )
      }
    </>
  );
}
