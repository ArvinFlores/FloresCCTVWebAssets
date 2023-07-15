export const plugin = 'janus.plugin.videoroom';
export const iceServers = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: `stun:${CAMERA_IP}:3478` }
];
