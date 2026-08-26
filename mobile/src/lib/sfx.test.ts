// Every tap must make a sound.
//
// Reported as "the first tap is silent, and then only every second tap plays". Both
// halves are real and they have different causes, so the fake below models the two
// pieces of real AudioPlayer semantics that produced them:
//
//  1. `createAudioPlayer` starts loading asynchronously, and `play()` on a player
//     that has not finished loading is dropped. → the first tap of each sound.
//  2. `play()` at the END of a clip does nothing; the position has to be rewound
//     first, and `seekTo` is a Promise. The old code called it without awaiting, so
//     `play()` ran at the old position — and the seek that landed a moment later
//     left the player at 0, which is why the NEXT tap worked. → the alternation.
type FakePlayer = {
  currentTime: number;
  playing: boolean;
  isLoaded: boolean;
  plays: number;
  play(): void;
  pause(): void;
  seekTo(s: number): Promise<void>;
  remove(): void;
};

// `mock`-prefixed so jest's hoisting rule allows the factory to reach them: the
// mock is hoisted above these declarations, and only names starting with `mock` are
// permitted through.
const mockCreated: FakePlayer[] = [];
const CLIP = 0.2; // seconds

function mockMakeFake(): FakePlayer {
  const p: FakePlayer = {
    currentTime: 0,
    playing: false,
    // Loading is async in the real module. Tests flip this on to model "loaded".
    isLoaded: false,
    plays: 0,
    play() {
      if (!this.isLoaded) return;          // (1) dropped while loading
      if (this.currentTime >= CLIP) return; // (2) already at the end: silence
      this.plays++;
      this.playing = true;
      this.currentTime = CLIP;             // short blip: finishes immediately
      this.playing = false;
    },
    pause() { this.playing = false; },
    // The assignment is DEFERRED, because the real seekTo crosses the native bridge:
    // its effect lands after the caller's synchronous code has finished. An `async`
    // function whose body has no await would run synchronously and hide the exact
    // race this file exists to catch — the un-awaited seek that made every second
    // tap silent would pass.
    seekTo(sec: number) {
      return new Promise<void>((resolve) => {
        setTimeout(() => { this.currentTime = sec; resolve(); }, 0);
      });
    },
    remove() {},
  };
  mockCreated.push(p);
  return p;
}

jest.mock('expo-audio', () => ({ createAudioPlayer: () => mockMakeFake() }));
jest.mock('expo-secure-store', () => ({
  getItemAsync: async () => null,
  setItemAsync: async () => {},
}));

import { readFileSync } from 'fs';
import { join } from 'path';
import { playSfx, primeSfx, setSfxMuted } from './sfx';

/** Lets the awaited seek settle, the way a real frame boundary would. */
const settle = () => new Promise<void>((r) => setTimeout(r, 0));

/** Total plays across every player. Tests measure the DELTA rather than resetting:
 *  the module keeps its players for the process, so clearing this list would just
 *  hide them from the test while primeSfx() saw them as already created. */
const totalPlays = () => mockCreated.reduce((n, p) => n + p.plays, 0);

beforeAll(() => {
  primeSfx();
  // The real module loads asynchronously; flip the fakes to loaded.
  mockCreated.forEach((p) => { p.isLoaded = true; });
});

beforeEach(async () => {
  await setSfxMuted(false);
});

test('the very first tap makes a sound', async () => {
  // Preloading is what makes this true: play() on a player that has not finished
  // loading is dropped, and every sound's first tap used to hit that.
  expect(mockCreated.length).toBe(6);
  const before = totalPlays();
  playSfx('tap');
  await settle();
  expect(totalPlays() - before).toBe(1);
});

test('ten taps in a row make ten sounds', async () => {
  const before = totalPlays();
  for (let i = 0; i < 10; i++) {
    playSfx('tap');
    await settle(); // the rewind is awaited, so a tap waits a frame at most
  }
  // The bug this exists for: 5 instead of 10 — every other tap silent.
  expect(totalPlays() - before).toBe(10);
});

test('a tap while the clip is still ringing retriggers it', async () => {
  const p = mockCreated.find((x) => x.plays > 0)!;
  p.currentTime = CLIP / 2; // mid-clip rather than finished
  const before = totalPlays();
  playSfx('tap');
  await settle();
  expect(totalPlays() - before).toBe(1);
});

test('muting silences everything, unmuting restores it', async () => {
  await setSfxMuted(true);
  let before = totalPlays();
  playSfx('tap');
  await settle();
  expect(totalPlays() - before).toBe(0);

  await setSfxMuted(false);
  before = totalPlays();
  playSfx('tap');
  await settle();
  expect(totalPlays() - before).toBe(1);
});

test('players are reused, not created per tap', async () => {
  const count = mockCreated.length;
  for (let i = 0; i < 5; i++) { playSfx('tap'); await settle(); }
  // One native audio object per sound, however many taps — creating one per tap
  // leaks them.
  expect(mockCreated.length).toBe(count);
});

test('each sound has its own player, so two different sounds do not cut each other off', async () => {
  const before = totalPlays();
  playSfx('tap');
  playSfx('confirm');
  await settle();
  expect(totalPlays() - before).toBe(2);
});

// primeSfx has to be CALLED at startup, or the preload is a function nobody runs and
// every sound's first tap is silent again.
test('the app primes the players at startup', () => {
  const layout = readFileSync(join(__dirname, '..', 'app', '_layout.tsx'), 'utf8');
  expect(layout).toMatch(/primeSfx\(\)/);
  expect(layout).toMatch(/import \{[^}]*primeSfx[^}]*\} from '@\/lib\/sfx'/);
});
