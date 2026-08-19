// Read hair and skin colour out of a photo, and snap them onto the avatar palette.
//
// What this is and is not: it is NOT a likeness. A pixel portrait resembling someone
// needs a model this app has no business shipping. What a photo can honestly give is
// a starting point for two of the four avatar values, after which you adjust by hand
// — which is most of the tedium of a colour picker removed, and no promise broken.
//
// The photo never leaves the device and is never stored: the camera writes a temp
// file, this reads a 24×24 copy of it, and both are deleted (see FaceScanSheet).
//
// Deliberately no native pixel-reading dependency (Skia, GL). The image is resized to
// 24×24 first, so decoding a few hundred bytes of baseline JPEG in JavaScript is
// instantaneous — and it keeps this file a pure function that a test can drive with a
// synthetic image instead of a camera.
import { decode } from 'jpeg-js';
import { HAIR_COLORS, SKIN_TONES } from './avatar';

export type SampledFace = { hair: string; skin: string };

/** Where a face sits in a photo taken through the sheet's oval guide, 0..1. */
const HAIR_BAND = { x0: 0.35, x1: 0.65, y0: 0.06, y1: 0.2 };
// Two cheek patches rather than one centre patch: the centre is nose and nostril
// shadow, and a single patch on one side picks up whichever way the light came from.
const SKIN_PATCHES = [
  { x0: 0.22, x1: 0.36, y0: 0.52, y1: 0.68 },
  { x0: 0.64, x1: 0.78, y0: 0.52, y1: 0.68 },
];

/**
 * Sample `jpegBase64` (a small, square, face-centred JPEG) and return the nearest
 * palette entries, or null when the image cannot plausibly be a face.
 */
export function sampleFace(jpegBase64: string): SampledFace | null {
  let img: { width: number; height: number; data: Uint8Array };
  try {
    img = decode(base64ToBytes(jpegBase64), { useTArray: true });
  } catch {
    return null; // not a decodable baseline JPEG — the caller retries or falls back
  }
  if (img.width < 8 || img.height < 8) return null;

  const hairRGB = medianOf(img, [HAIR_BAND]);
  const skinRGB = medianOf(img, SKIN_PATCHES);
  if (!hairRGB || !skinRGB) return null;

  // A covered lens, a wall, or a photo of nothing gives two nearly identical samples.
  // Guessing from that produces a confidently wrong face, so refuse instead.
  if (distance(hairRGB, skinRGB) < 12 ** 2) return null;

  return {
    hair: nearest(hairRGB, HAIR_COLORS),
    skin: nearest(skinRGB, SKIN_TONES),
  };
}

type RGB = [number, number, number];

/**
 * The median-luminance pixel across the given regions.
 *
 * A median, not a mean: averaging blends a stray highlight or a dark frame edge into
 * the result and can land on a colour that appears nowhere in the photo. The median is
 * an actual observed pixel.
 */
function medianOf(
  img: { width: number; height: number; data: Uint8Array },
  regions: { x0: number; x1: number; y0: number; y1: number }[],
): RGB | null {
  const px: { rgb: RGB; lum: number }[] = [];
  for (const r of regions) {
    const x0 = Math.floor(r.x0 * img.width);
    const x1 = Math.ceil(r.x1 * img.width);
    const y0 = Math.floor(r.y0 * img.height);
    const y1 = Math.ceil(r.y1 * img.height);
    for (let y = y0; y < y1; y++) {
      for (let x = x0; x < x1; x++) {
        const i = (y * img.width + x) * 4;
        const rgb: RGB = [img.data[i], img.data[i + 1], img.data[i + 2]];
        px.push({ rgb, lum: 0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2] });
      }
    }
  }
  if (px.length === 0) return null;
  px.sort((a, b) => a.lum - b.lum);
  return px[Math.floor(px.length / 2)].rgb;
}

/** Nearest palette entry by weighted RGB distance. */
function nearest(rgb: RGB, palette: string[]): string {
  let best = palette[0];
  let bestD = Infinity;
  for (const hex of palette) {
    const d = distance(rgb, hexToRGB(hex));
    if (d < bestD) {
      bestD = d;
      best = hex;
    }
  }
  return best;
}

// Weighted so the comparison tracks perception rather than raw channel deltas: the eye
// is most sensitive to green and least to blue. Plain Euclidean RGB puts a warm mid
// skin tone closer to grey than to the tone beside it.
function distance(a: RGB, b: RGB): number {
  const dr = a[0] - b[0];
  const dg = a[1] - b[1];
  const db = a[2] - b[2];
  return 2 * dr * dr + 4 * dg * dg + 3 * db * db;
}

function hexToRGB(hex: string): RGB {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

/**
 * base64 → bytes, written out rather than relying on atob or Buffer.
 *
 * Hermes exposes atob in recent releases and Node's Buffer exists in tests, but this
 * file has to behave identically in both, and a 24×24 JPEG is under a kilobyte — the
 * loop costs nothing and removes a difference between environments.
 */
function base64ToBytes(b64: string): Uint8Array {
  const clean = b64.replace(/[^A-Za-z0-9+/]/g, '');
  const out = new Uint8Array(Math.floor((clean.length * 3) / 4));
  let o = 0;
  for (let i = 0; i < clean.length; i += 4) {
    const n =
      (B64.indexOf(clean[i]) << 18) |
      (B64.indexOf(clean[i + 1]) << 12) |
      (B64.indexOf(clean[i + 2] ?? 'A') << 6) |
      B64.indexOf(clean[i + 3] ?? 'A');
    out[o++] = (n >> 16) & 255;
    if (o < out.length) out[o++] = (n >> 8) & 255;
    if (o < out.length) out[o++] = n & 255;
  }
  return out;
}
