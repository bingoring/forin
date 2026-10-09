// RIFF/WAVE helpers for Android recording (cross-review I1).
//
// expo-audio's Android recorder is MediaRecorder, which cannot emit PCM/WAV — the
// file it writes as ".wav" is really 3GP/AMR and the server's ValidateWAV
// (server/internal/domain/speech/validate.go) rejects it with 400 invalid_audio.
// On Android we instead capture raw PCM16 through expo-audio's AudioStream and
// wrap it in the 44-byte header here. Pure functions, no native imports.

export const WAV_RATE = 16000;
export const WAV_HEADER_BYTES = 44;

/** PCM16 little-endian bytes -> a complete RIFF/WAVE file (default: 16kHz mono, what ValidateWAV demands). */
export function pcm16ToWav(pcm: Uint8Array, sampleRate = WAV_RATE, channels = 1): Uint8Array {
  if (pcm.length % 2 !== 0) throw new Error('pcm16ToWav: odd byte count');
  const out = new Uint8Array(WAV_HEADER_BYTES + pcm.length);
  const v = new DataView(out.buffer);
  const tag = (o: number, s: string) => { for (let i = 0; i < 4; i++) out[o + i] = s.charCodeAt(i); };
  tag(0, 'RIFF');
  v.setUint32(4, 36 + pcm.length, true);
  tag(8, 'WAVE');
  tag(12, 'fmt ');
  v.setUint32(16, 16, true);
  v.setUint16(20, 1, true); // PCM
  v.setUint16(22, channels, true);
  v.setUint32(24, sampleRate, true);
  v.setUint32(28, sampleRate * channels * 2, true);
  v.setUint16(32, channels * 2, true);
  v.setUint16(34, 16, true);
  tag(36, 'data');
  v.setUint32(40, pcm.length, true);
  out.set(pcm, WAV_HEADER_BYTES);
  return out;
}

/** Linear-interpolation resampler — only a fallback for devices whose mic cannot deliver 16kHz. */
export function resamplePcm16(src: Int16Array, from: number, to: number): Int16Array {
  if (from === to || src.length === 0) return src;
  const n = Math.floor((src.length * to) / from);
  const out = new Int16Array(n);
  const step = from / to;
  for (let i = 0; i < n; i++) {
    const pos = i * step;
    const i0 = Math.floor(pos);
    const i1 = Math.min(i0 + 1, src.length - 1);
    const f = pos - i0;
    out[i] = Math.round(src[i0] * (1 - f) + src[i1] * f);
  }
  return out;
}

const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

export function bytesToBase64(b: Uint8Array): string {
  let s = '';
  for (let i = 0; i < b.length; i += 3) {
    const n = (b[i] << 16) | ((b[i + 1] ?? 0) << 8) | (b[i + 2] ?? 0);
    s += B64[(n >> 18) & 63] + B64[(n >> 12) & 63];
    s += i + 1 < b.length ? B64[(n >> 6) & 63] : '=';
    s += i + 2 < b.length ? B64[n & 63] : '=';
  }
  return s;
}

/** RMS level in dBFS (-160 = silence), the same scale expo-audio's metering uses. */
export function pcm16Db(s: Int16Array): number {
  if (s.length === 0) return -160;
  let sum = 0;
  for (let i = 0; i < s.length; i++) sum += s[i] * s[i];
  const rms = Math.sqrt(sum / s.length) / 32768;
  return rms <= 0 ? -160 : Math.max(-160, 20 * Math.log10(rms));
}
