export interface MediaPreviewProps {
  previewSrc: string;
  muteVideo: boolean;
  onVideoLoading?: () => void;
  onVideoLoaded?: () => void;
}
