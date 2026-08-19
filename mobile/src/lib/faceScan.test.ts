import { encode } from 'jpeg-js';
import { sampleFace } from './faceScan';
import { HAIR_COLORS, SKIN_TONES } from './avatar';

// Synthetic photos, encoded as real JPEGs and decoded by the real decoder. No mock of
// the thing under test: a mocked decoder would prove the sampler reads whatever the
// mock returns, which is what it does by construction.
function photo(hairHex: string, skinHex: string, size = 48): string {
  const hair = rgb(hairHex);
  const skin = rgb(skinHex);
  const bg = [40, 60, 90]; // a wall behind the head, deliberately unlike either
  const data = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const fy = y / size;
      const fx = x / size;
      const inHair = fy >= 0.04 && fy <= 0.22 && fx >= 0.3 && fx <= 0.7;
      const inFace = fy > 0.22 && fy <= 0.85 && fx >= 0.18 && fx <= 0.82;
      const c = inHair ? hair : inFace ? skin : bg;
      const i = (y * size + x) * 4;
      data[i] = c[0];
      data[i + 1] = c[1];
      data[i + 2] = c[2];
      data[i + 3] = 255;
    }
  }
  // Quality 100 so JPEG's chroma subsampling does not shift the very colours the test
  // is asserting on; the app resizes to 24×24 at 0.9, which is close enough that a
  // pass here means the geometry is right.
  return toBase64(encode({ data, width: size, height: size }, 100).data);
}

function rgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
function toBase64(bytes: Uint8Array): string {
  let out = '';
  for (let i = 0; i < bytes.length; i += 3) {
    const n = (bytes[i] << 16) | ((bytes[i + 1] ?? 0) << 8) | (bytes[i + 2] ?? 0);
    out += B64[(n >> 18) & 63] + B64[(n >> 12) & 63];
    out += i + 1 < bytes.length ? B64[(n >> 6) & 63] : '=';
    out += i + 2 < bytes.length ? B64[n & 63] : '=';
  }
  return out;
}

test('reads dark hair and light skin', () => {
  const got = sampleFace(photo('#1B1B1B', '#FBE3C8'));
  expect(got).toEqual({ hair: '#1B1B1B', skin: '#FBE3C8' });
});

test('reads light hair and dark skin', () => {
  const got = sampleFace(photo('#E8E4DC', '#5C3317'));
  expect(got).toEqual({ hair: '#E8E4DC', skin: '#5C3317' });
});

// The whole point of snapping is that a real photo never holds a palette colour
// exactly. Nudge every channel and the answer must not move.
test('snaps an off-palette photo to the nearest entries', () => {
  const got = sampleFace(photo('#6E4D33', '#C98A47'));
  expect(got).not.toBeNull();
  expect(HAIR_COLORS).toContain(got!.hair);
  expect(SKIN_TONES).toContain(got!.skin);
  expect(got!.hair).toBe('#6B4A2F');
  expect(got!.skin).toBe('#C68642');
});

// A covered lens or a photo of a wall gives two samples that agree. Guessing from that
// yields a confidently wrong face, so refusing is the correct answer.
test('refuses an image with no contrast between the bands', () => {
  expect(sampleFace(photo('#F8D7B2', '#F8D7B2'))).toBeNull();
});

test('refuses input that is not a jpeg', () => {
  expect(sampleFace('not-base64-at-all')).toBeNull();
  expect(sampleFace('')).toBeNull();
});

// Every returned value has to be renderable by the avatar, or the sheet would set a
// colour the Face plates do not draw.
test('only ever returns palette values', () => {
  for (const hair of HAIR_COLORS) {
    for (const skin of SKIN_TONES) {
      const got = sampleFace(photo(hair, skin));
      if (got === null) continue; // low-contrast pairs are legitimately refused
      expect(HAIR_COLORS).toContain(got.hair);
      expect(SKIN_TONES).toContain(got.skin);
    }
  }
});
