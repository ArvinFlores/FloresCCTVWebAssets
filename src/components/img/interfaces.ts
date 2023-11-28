import type { ImgHTMLAttributes } from 'react';

export interface ImgProps extends ImgHTMLAttributes<HTMLImageElement> {
  /**
   * If string, img.src will be used, otherwise react node will be rendered in place of img
   */
  errorFallback?: React.ReactNode;
}
