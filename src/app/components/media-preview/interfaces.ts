export interface MediaPreviewProps {
  previewSrc: string;
  muteVideo: boolean;
  scaled: boolean;
  label?: string;
  onVideoLoading?: () => void;
  onVideoLoaded?: () => void;
}
