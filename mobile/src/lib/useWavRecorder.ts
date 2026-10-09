// Recorder for the pronunciation / dialogue mic — iOS (and web) implementation.
//
// This is the plain expo-audio recorder with the caller's options, exactly as the
// screens used it before. Android has its own file, useWavRecorder.android.ts, because
// MediaRecorder cannot produce a WAV (cross-review I1). Metro picks the platform file;
// both export the same signature, and both return something with expo-audio's
// AudioRecorder surface (prepareToRecordAsync / record / stop / uri / getStatus / id)
// so useAudioRecorderState and the screens' flows work unchanged.
import { useAudioRecorder, type AudioRecorder, type RecordingOptions } from 'expo-audio';

export function useWavRecorder(options: RecordingOptions): AudioRecorder {
  return useAudioRecorder(options);
}
