// The result screen scrolls, and tapping it still throws confetti.
//
// Two things that broke each other. The column was a plain View and grew past the
// fold — the AI grade detail, a level-up banner, one row per new badge, the spoken
// sentence review, the REWARDS card, the footer — so the footer was cut off, and the
// footer holds 다음 시나리오.
//
// Making it a ScrollView fixed that and silently killed the confetti: the scroller
// fills the screen, so it covers the background Pressable that spawns a burst
// wherever you tap (04_SCREENS: "bursts again wherever the user taps"). A feature
// that stops working because another one was fixed is exactly what nobody notices.
import { readFileSync } from 'fs';
import { join } from 'path';

const SRC = readFileSync(join(__dirname, '..', 'app', 'result', '[id].tsx'), 'utf8');

test('the content column scrolls', () => {
  expect(SRC).toMatch(/<ScrollView/);
  // Padding at the bottom, or the last row sits flush against the screen edge.
  expect(SRC).toMatch(/paddingBottom: 48/);
  // And it is the CONTENT column, not some inner list: the column's own padding
  // moved onto contentContainerStyle.
  expect(SRC).toMatch(/contentContainerStyle=\{\{ paddingHorizontal: 22, paddingTop: 80/);
});

test('tapping the scrolled area still spawns a burst', () => {
  expect(SRC).toMatch(/onTouchEnd=\{\(e\) => spawnBurst\(/);
  // The background Pressable stays for the areas the scroller does not cover.
  expect(SRC).toMatch(/<Pressable onPress=\{onBgTap\}/);
});

test('the sticker burst on mount is untouched', () => {
  // It measures in window coordinates, which the scroll offset does not change at
  // mount — but if this ever moves inside the scroller it would need rethinking.
  expect(SRC).toMatch(/measureInWindow\(\(x, y, w, h\) => spawnBurst/);
});
