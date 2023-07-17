import './video-thumbnail.css';

import { Video } from 'src/components/media';
import { classnames } from 'src/util/classnames';
import type { VideoThumbnailProps } from './interfaces';

export function VideoThumbnail ({
  label,
  srcObject
}: VideoThumbnailProps): JSX.Element {
  return (
    <div
      className={classnames({
        'video-thumbnail': true,
        'video-thumbnail--overlay': label !== undefined
      })}
    >
      <Video
        className="util-fullscreen"
        muted={true}
        autoPlay={true}
        srcObject={srcObject}
      />
      {(label ?? '') && <span className="video-thumbnail__label">{label}</span>}
    </div>
  );
}
