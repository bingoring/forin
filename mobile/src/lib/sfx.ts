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

export type SfxName =
  | 'tap' | 'confirm' | 'back' | 'success' | 'wrong' | 'reward'
  | 'whoosh' | 'rim' | 'gameover';

// require() rather than a dynamic path: Metro resolves assets statically, so a
// computed path would not be bundled.
const SOURCES: Record<SfxName, number> = {
  tap: require('../../assets/sfx/tap.wav'),
  confirm: require('../../assets/sfx/confirm.wav'),
  back: require('../../assets/sfx/back.wav'),
  success: require('../../assets/sfx/success.wav'),
  wrong: require('../../assets/sfx/wrong.wav'),
  reward: require('../../assets/sfx/reward.wav'),
  whoosh: require('../../assets/sfx/whoosh.wav'),
  rim: require('../../assets/sfx/rim.wav'),
  gameover: require('../../assets/sfx/gameover.wav'),
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
 * Create every player up front.
 *
 * `createAudioPlayer` starts loading asynchronously and `play()` on a player that has
 * not finished loading is DROPPED — which is why the first tap on each sound was
 * silent. Creating them at startup means the asset is loaded long before a finger
 * arrives. Six short blips, created once.
 *
 * Safe to call more than once: existing players are kept.
 */
export function primeSfx(): void {
  for (const name of Object.keys(SOURCES) as SfxName[]) {
    if (players[name]) continue;
    try {
      players[name] = createAudioPlayer(SOURCES[name]);
    } catch {
      /* one unavailable sound must not stop the rest */
    }
  }
}

/**
 * Play a sound. Fire-and-forget by design — callers are tap handlers.
 *
 * Players are created once and reused: creating one per tap leaks native audio
 * objects.
 *
 * The rewind is AWAITED, and that is the fix for "only every second tap makes a
 * sound". `play()` at the end of a clip does nothing, so a replay has to rewind
 * first — and `seekTo` is a Promise because `currentTime` is read-only on the native
 * side. The old code fired the seek without awaiting, so `play()` ran at the old
 * end-of-clip position and was dropped; the seek then landed a moment later and left
 * the player at 0, which is exactly why the NEXT tap worked. Every second tap.
 *
 * The latency this was avoiding is a fraction of a frame, and only on a REPLAY: a
 * player already at the start skips the seek entirely. A few milliseconds is not
 * something a finger can feel. Silence is.
 */
export function playSfx(name: SfxName): void {
  if (muted) return;
  try {
    let p = players[name];
    if (!p) {
      p = createAudioPlayer(SOURCES[name]);
      players[name] = p;
    }
    // At the start already (a fresh player, or one rewound by a previous call):
    // play immediately, no round trip.
    if (p.currentTime <= 0) {
      p.play();
      return;
    }
    const player = p;
    void player
      .seekTo(0)
      .then(() => player.play())
      // A failed seek still gets a play attempt: at worst it is the silence we
      // already had, at best the clip had finished and resets itself.
      .catch(() => { try { player.play(); } catch { /* decoration */ } });
  } catch {
    /* audio is decoration; never let it surface as a failure */
  }
}
