export interface ControlsProps {
  previewingMedia: boolean;
  micEnabled: boolean;
  recording: boolean;
  onToggleMic?: () => void;
  onCancelMediaPreview?: () => void;
  onDownloadMediaPreview?: () => void;
  onTakeScreenshot?: () => void;
  onRecord?: () => void;
}
