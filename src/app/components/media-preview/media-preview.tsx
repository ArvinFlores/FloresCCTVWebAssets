import { useRef, useEffect } from 'react';
import { Video } from 'src/components/media';
import type { MediaPreviewProps } from './interfaces';

export function MediaPreview ({
  previewSrc,
  muteVideo,
  onVideoLoading,
  onVideoLoaded
}: MediaPreviewProps): JSX.Element {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const isVideo = previewSrc.startsWith('blob:') || previewSrc.startsWith('http');
  const handleVideoLoading = (): void => {
    if (isVideo) {
      onVideoLoading?.();
    }
  };
  const handleVideoLoaded = (): void => {
    if (isVideo) {
      onVideoLoaded?.();
    }
  };

  useEffect(
    () => {
      const video = videoRef.current;
      video?.addEventListener('loadstart', handleVideoLoading);
      video?.addEventListener('play', handleVideoLoaded);

      return () => {
        video?.removeEventListener('loadstart', handleVideoLoading);
        video?.removeEventListener('play', handleVideoLoaded);
      };
    },
    [previewSrc]
  );

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
            ref={videoRef}
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
