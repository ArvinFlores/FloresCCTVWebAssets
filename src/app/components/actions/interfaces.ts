export interface ActionProps {
  videoMuted: boolean;
  showMenu: boolean;
  recording: boolean;
  canGoBack: boolean;
  onVolumeClick: () => void;
  onMenuClick: () => void;
  onGoBackMenuClick: () => void;
}
