import './recording-item.css';

import type { RecordingItemProps } from './interfaces';

export function RecordingItem ({
  thumbnail,
  label
}: RecordingItemProps): JSX.Element {
  return (
    <div className="recording-item util-list--inline">
      <img
        className="recording-item__img"
        src={thumbnail}
      />
      <p className="recording-item__label util-ml-2">{label}</p>
    </div>
  );
}
