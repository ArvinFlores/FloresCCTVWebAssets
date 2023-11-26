export interface MediaPreviewProps {
  previewSrc: string;
  muteVideo: boolean;
  label?: string;
  onVideoLoading?: () => void;
  onVideoLoaded?: () => void;
}
