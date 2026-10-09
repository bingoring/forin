import { pcm16ToWav, resamplePcm16, bytesToBase64, pcm16Db, WAV_HEADER_BYTES } from './wav';

const u32 = (b: Uint8Array, o: number) => new DataView(b.buffer, b.byteOffset).getUint32(o, true);
const u16 = (b: Uint8Array, o: number) => new DataView(b.buffer, b.byteOffset).getUint16(o, true);
const ascii = (b: Uint8Array, o: number, n: number) => String.fromCharCode(...b.slice(o, o + n));

// server/internal/domain/speech/duration.go — DurationMS is dataLen*1000 / (rate*ch*2).
const serverDurationMs = (wav: Uint8Array) =>
  Math.floor((u32(wav, 40) * 1000) / (u32(wav, 24) * u16(wav, 22) * 2));

describe('pcm16ToWav', () => {
  const pcm = new Uint8Array([1, 0, 2, 0, 3, 0, 4, 0]); // 4 samples

  it('writes the canonical 44-byte RIFF/WAVE PCM16 16kHz mono header', () => {
    const wav = pcm16ToWav(pcm);
    expect(wav.length).toBe(WAV_HEADER_BYTES + pcm.length);
    expect(ascii(wav, 0, 4)).toBe('RIFF');
    expect(u32(wav, 4)).toBe(36 + pcm.length);
    expect(ascii(wav, 8, 4)).toBe('WAVE');
    expect(ascii(wav, 12, 4)).toBe('fmt ');
    expect(u32(wav, 16)).toBe(16);
    expect(u16(wav, 20)).toBe(1); // PCM
    expect(u16(wav, 22)).toBe(1); // mono
    expect(u32(wav, 24)).toBe(16000);
    expect(u32(wav, 28)).toBe(32000); // byte rate
    expect(u16(wav, 32)).toBe(2); // block align
    expect(u16(wav, 34)).toBe(16);
    expect(ascii(wav, 36, 4)).toBe('data');
    expect(u32(wav, 40)).toBe(pcm.length);
    expect(Array.from(wav.slice(44))).toEqual(Array.from(pcm));
  });

  it('1 second of audio is 32000 data bytes and reads as 1000 ms to the server formula', () => {
    const wav = pcm16ToWav(new Uint8Array(32000));
    expect(u32(wav, 40)).toBe(32000);
    expect(serverDurationMs(wav)).toBe(1000);
  });

  it('honors a non-default rate/channel layout in the header', () => {
    const wav = pcm16ToWav(new Uint8Array(8), 48000, 2);
    expect(u16(wav, 22)).toBe(2);
    expect(u32(wav, 24)).toBe(48000);
    expect(u32(wav, 28)).toBe(192000);
    expect(u16(wav, 32)).toBe(4);
  });

  it('rejects an odd byte count (a torn sample)', () => {
    expect(() => pcm16ToWav(new Uint8Array(3))).toThrow();
  });
});

describe('resamplePcm16', () => {
  it('is the identity at the same rate', () => {
    const s = Int16Array.from([1, 2, 3]);
    expect(Array.from(resamplePcm16(s, 16000, 16000))).toEqual([1, 2, 3]);
  });
  it('48k -> 16k keeps a third of the samples and the duration', () => {
    const s = new Int16Array(4800).map((_, i) => i);
    const out = resamplePcm16(s, 48000, 16000);
    expect(out.length).toBe(1600);
    expect(out[0]).toBe(0);
    expect(out[10]).toBe(30);
  });
  it('44.1k -> 16k lands on the right length', () => {
    expect(resamplePcm16(new Int16Array(44100), 44100, 16000).length).toBe(16000);
  });
});

describe('bytesToBase64', () => {
  it.each([0, 1, 2, 3, 4, 5, 255, 1000])('matches Node Buffer for %i bytes', (n) => {
    const b = Uint8Array.from({ length: n }, (_, i) => (i * 37 + 11) & 255);
    expect(bytesToBase64(b)).toBe(Buffer.from(b).toString('base64'));
  });
});

describe('pcm16Db', () => {
  it('is -160 for silence and ~0 for full scale', () => {
    expect(pcm16Db(new Int16Array(100))).toBe(-160);
    expect(pcm16Db(new Int16Array(100).fill(32767))).toBeGreaterThan(-0.1);
  });
  it('half scale is about -6 dB', () => {
    expect(pcm16Db(new Int16Array(100).fill(16384))).toBeCloseTo(-6.02, 1);
  });
});
