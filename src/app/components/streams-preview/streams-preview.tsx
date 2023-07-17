import { Audio } from 'src/components/media';
import { VideoThumbnail } from './components/video-thumbnail';
import type { StreamsPreviewProps } from './interfaces';

export function StreamsPreview ({
  streams,
  audioMuted,
  onVideoPreviewClick
}: StreamsPreviewProps): JSX.Element {
  return (
    <ul className="util-list util-list--inline util-list--inline-scroll">
      {
        streams.map((item) => {
          const { id, label, stream } = item;
          const content = stream.getVideoTracks().length > 0 ?
            (
              <a
                aria-label={`Watch ${label ?? 'camera'} video stream`}
                href="#"
                onClick={() => onVideoPreviewClick?.(item)}
              >
                <VideoThumbnail
                  label={label}
                  srcObject={stream}
                />
              </a>
            ) :
            (
              <Audio
                className="util-hidden"
                srcObject={stream}
                autoPlay={true}
                controls={true}
                muted={audioMuted}
              />
            );

          return (
            <li key={id}>
              {content}
            </li>
          );
        })
      }
    </ul>
  );
}
