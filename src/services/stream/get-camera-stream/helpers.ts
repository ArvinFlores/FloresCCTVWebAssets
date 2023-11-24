export function getSenderTracks (pc: RTCPeerConnection | null): Array<MediaStreamTrack | null> {
  return pc?.getSenders().map((sender) => sender.track).filter(Boolean) ?? [];
}

export function getLocalAudioTrack (pc: RTCPeerConnection | null): MediaStreamTrack | null {
  const tracks = getSenderTracks(pc);
  const audioTracks = tracks.filter((track) => track?.kind === 'audio');

  return audioTracks[0];
}
