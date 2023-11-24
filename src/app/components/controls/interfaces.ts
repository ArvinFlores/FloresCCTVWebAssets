export interface ControlsProps {
  previewingMedia: boolean;
  micEnabled: boolean;
  micActive: boolean;
  recordingEnabled: boolean;
  recording: boolean;
  onToggleMic?: () => void;
  onCancelMediaPreview?: () => void;
  onDownloadMediaPreview?: () => void;
  onDelete?: () => void;
  onTakeScreenshot?: () => void;
  onRecord?: () => void;
}
