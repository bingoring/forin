// Android: capture raw PCM16 with expo-audio's AudioStream (AudioRecord under the hood)
// and wrap it in a RIFF/WAVE header on stop (cross-review I1). See wav.ts.
//
// Returns a shim with the AudioRecorder surface the screens use, so their flows
// (permission → prepareToRecordAsync → record → stop → recorder.uri → delete, R7) stay
// the same. The shim writes the WAV to the cache dir on stop(); callers read it and
// delete it exactly as they do for iOS.
//
// Not verified on a real Android device (none available when this was written).
import { useMemo, useRef } from 'react';
import { useAudioStream, type AudioRecorder, type RecordingOptions } from 'expo-audio';
import { cacheDirectory, writeAsStringAsync, EncodingType } from 'expo-file-system/legacy';
import { bytesToBase64, pcm16Db, pcm16ToWav, resamplePcm16, WAV_RATE } from './wav';

// 1MB is the server's cap (~32s at 16kHz); stop buffering a runaway hold-to-talk before that.
const MAX_SECONDS = 30;

type Chunk = Int16Array;

export function useWavRecorder(_options: RecordingOptions): AudioRecorder {
  const state = useRef({
    chunks: [] as Chunk[],
    samples: 0,
    rate: WAV_RATE,
    collecting: false,
    recording: false,
    metering: -160,
    uri: null as string | null,
  }).current;

  const { stream } = useAudioStream({
    sampleRate: WAV_RATE,
    channels: 1,
    encoding: 'int16',
    onBuffer: (b) => {
      if (!state.collecting) return;
      const pcm = new Int16Array(b.data.slice(0, b.data.byteLength - (b.data.byteLength % 2)));
      state.rate = b.sampleRate;
      state.metering = pcm16Db(pcm);
      if (state.samples / b.sampleRate >= MAX_SECONDS) return;
      state.chunks.push(pcm);
      state.samples += pcm.length;
    },
  });

  return useMemo(() => {
    const durationMillis = () => Math.round((state.samples / state.rate) * 1000);
    const shim = {
      get id() { return stream.id; },
      get uri() { return state.uri; },
      async prepareToRecordAsync() {
        // A new take must never see the previous take's file or samples.
        state.chunks = [];
        state.samples = 0;
        state.rate = WAV_RATE;
        state.metering = -160;
        state.uri = null;
        state.collecting = false;
        // Opening the mic here (not in record()) lets a failure reach the caller's catch.
        await stream.start();
        state.recording = true;
      },
      record() { state.collecting = true; },
      async stop() {
        if (!state.recording) return;
        state.recording = false;
        stream.stop();
        // Buffers already read natively are delivered to JS asynchronously; let them land.
        await new Promise<void>((r) => setTimeout(r, 60));
        state.collecting = false;
        if (state.samples === 0) return;
        const all = new Int16Array(state.samples);
        let o = 0;
        for (const c of state.chunks) { all.set(c, o); o += c.length; }
        state.chunks = [];
        const pcm = resamplePcm16(all, state.rate, WAV_RATE); // no-op when the mic gave 16kHz
        const wav = pcm16ToWav(new Uint8Array(pcm.buffer, pcm.byteOffset, pcm.byteLength), WAV_RATE, 1);
        const uri = `${cacheDirectory}forin-rec-${Date.now()}.wav`;
        await writeAsStringAsync(uri, bytesToBase64(wav), { encoding: EncodingType.Base64 });
        state.uri = uri;
      },
      getStatus() {
        return {
          canRecord: true,
          isRecording: state.recording && state.collecting,
          durationMillis: durationMillis(),
          mediaServicesDidReset: false,
          metering: state.metering,
          url: state.uri,
        };
      },
    };
    // The screens only touch the members above; the rest of AudioRecorder is native-only.
    return shim as unknown as AudioRecorder;
  }, [stream, state]);
}
