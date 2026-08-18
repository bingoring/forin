// UI sounds.
//
// The app had none, which is what made it feel flat. The set is deliberately
// small (6) and generated rather than sourced — see scripts/gen-sfx.py for why
// chiptune blips fit a pixel-art app and why they are built instead of licensed.
//
// Two rules the wiring follows:
//  1. `tap` is the quietest and fires most; everything else marks a moment.
//     A sound on every element makes scrolling sound like a machine.
//  2. Sound never blocks. Every call is fire-and-forget and swallows errors: a
//     missing player or an audio-session conflict must not break a tap.
import { createAudioPlayer, type AudioPlayer } from 'expo-audio';
import * as SecureStore from 'expo-secure-store';

export type SfxName = 'tap' | 'confirm' | 'back' | 'success' | 'wrong' | 'reward';

// require() rather than a dynamic path: Metro resolves assets statically, so a
// computed path would not be bundled.
const SOURCES: Record<SfxName, number> = {
  tap: require('../../assets/sfx/tap.wav'),
  confirm: require('../../assets/sfx/confirm.wav'),
  back: require('../../assets/sfx/back.wav'),
  success: require('../../assets/sfx/success.wav'),
  wrong: require('../../assets/sfx/wrong.wav'),
  reward: require('../../assets/sfx/reward.wav'),
};

const MUTE_KEY = 'forin.sfx.muted';

let muted = false;
const players: Partial<Record<SfxName, AudioPlayer>> = {};

/** Read the saved preference. Call once at startup; safe to call again. */
export async function loadSfxPreference(): Promise<void> {
  try {
    muted = (await SecureStore.getItemAsync(MUTE_KEY)) === '1';
  } catch {
    muted = false; // no stored preference is "sound on", not an error
  }
}

export function isSfxMuted(): boolean {
  return muted;
}

export async function setSfxMuted(next: boolean): Promise<void> {
  muted = next;
  try {
    await SecureStore.setItemAsync(MUTE_KEY, next ? '1' : '0');
  } catch {
    /* the in-memory flag still applies for this session */
  }
}

/**
 * Play a sound. Fire-and-forget by design — callers are tap handlers.
 *
 * Players are created once and reused: creating one per tap leaks native audio
 * objects, and `seekTo(0)` before `play()` is what lets the same short blip
 * retrigger while it is still ringing (otherwise a fast double-tap is silent).
 */
export function playSfx(name: SfxName): void {
  if (muted) return;
  try {
    let p = players[name];
    if (!p) {
      p = createAudioPlayer(SOURCES[name]);
      players[name] = p;
    }
    // seekTo() is async but is deliberately not awaited: awaiting it would put a
    // round-trip between the finger and the blip, and a late tap sound reads as
    // lag. If the seek lands after play() has started, the clip restarts from 0 —
    // audible either way, which is all this needs to be. The rejection is caught
    // so a failed seek cannot surface as an unhandled promise.
    void p.seekTo(0).catch(() => {});
    p.play();
  } catch {
    /* audio is decoration; never let it surface as a failure */
  }
}
