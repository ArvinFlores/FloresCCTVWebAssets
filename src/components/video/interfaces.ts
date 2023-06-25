import type { VideoHTMLAttributes } from 'react';

export type VideoProps = VideoHTMLAttributes<HTMLVideoElement> & {
  srcObject?: MediaStream | null;
};
