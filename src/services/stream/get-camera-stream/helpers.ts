export function getSenderTracks (pc: RTCPeerConnection | null): Array<MediaStreamTrack | null> {
  return pc?.getSenders().map((sender) => sender.track).filter(Boolean) ?? [];
}
