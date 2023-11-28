import './media-preview.css';

import { useRef, useEffect } from 'react';
import { Video } from 'src/components/media';
import { classnames } from 'src/util/classnames';
import type { MediaPreviewProps } from './interfaces';

export function MediaPreview ({
  previewSrc,
  muteVideo,
  label,
  scaled,
  onVideoLoading,
  onVideoLoaded
}: MediaPreviewProps): JSX.Element {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const isVideo = previewSrc.startsWith('blob:') || previewSrc.startsWith('http');
  const classes = classnames({
    'util-fullscreen': true,
    'util-fullscreen--cover': scaled,
    'util-fullscreen--contain': !isVideo && !scaled,
    'util-z-1': true
  });
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
        label != null && label.length > 0 && (
          <div className="media-preview__label util-z-2000">
            {label}
          </div>
        )
      }
      {
        previewSrc.startsWith('data:') && (
          <img
            className={classes}
            src={previewSrc}
          />
        )
      }
      {
        isVideo && (
          <Video
            ref={videoRef}
            className={classes}
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
