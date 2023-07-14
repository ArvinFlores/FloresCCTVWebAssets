import { isMobile } from 'src/util/is-mobile';

function createRecorderOptions (): MediaRecorderOptions {
  let options = { mimeType: 'video/webm;codecs=vp9' };

  if (!MediaRecorder.isTypeSupported(options.mimeType)) {
    options = { mimeType: 'video/webm;codecs=vp8' };
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      options = { mimeType: 'video/webm;codecs=h264' };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options = { mimeType: 'video/webm' };
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          options = { mimeType: '' };
        }
      }
    }
  }

  return options;
}

export function createRecordingHelpers (): {
  startRecording: (stream: MediaStream, onVideoRecorded?: (blob: Blob) => void) => void;
  stopRecording: () => void;
} {
  let recorder: MediaRecorder | null = null;
  let recordedBlobs: Blob[] = [];

  return {
    startRecording (
      stream: MediaStream,
      onVideoRecorded?: (blob: Blob) => void
    ) {
      const tracks = stream.getTracks();

      if (!tracks.length || recorder?.state === 'recording') return;

      try {
        recorder = new MediaRecorder(
          stream,
          createRecorderOptions()
        );
      } catch (e) {
        throw Error(e);
      }

      recorder.onstop = () => {
        onVideoRecorded?.(new Blob(
          recordedBlobs,
          { type: isMobile() ? 'video/mp4' : 'video/webm' }
        ));

        recordedBlobs = [];
        recorder = null;
      };
      recorder.ondataavailable = (evt) => {
        if (evt.data.size > 0) {
          recordedBlobs.push(evt.data);
        }
      };

      recorder.start();
    },
    stopRecording () {
      recorder?.stop();
      recorder = null;
    }
  };
}
