// Typing raises the conversation over the portrait, and lowers it again.
//
// A messenger lifts its list and input above the keyboard because the list is the whole
// screen. Here the top third is the NPC portrait, so lifting only the bottom left the
// thread squeezed into a few lines. The fix moves the thread's TOP edge up into the space
// the portrait vacates — which means three things have to hold together, and each is a
// separate way to get it wrong:
//   · the top is animated (a fixed top cannot move)
//   · `top` is a LAYOUT prop, so that animation cannot use the native driver
//   · the chrome it slides over is not just faded but unhittable
import { readFileSync } from 'fs';
import { join } from 'path';

// Outside src/app on purpose — expo-router bundles every file under the app root
// as a route (see routeHygiene.test.ts).
const SRC = readFileSync(join(__dirname, '..', 'app', 'dialogue', '[id].tsx'), 'utf8');

test('the thread column has an animated top, not a fixed one', () => {
  expect(SRC).toMatch(/top:\s*threadTopStyle/);
  // The resting position is still the dock's offset; the raised one is under the status bar.
  expect(SRC).toMatch(/const restingTop = winH \* 0\.41 \+ 34;/);
  expect(SRC).toMatch(/const raisedTop = 96;/);
  expect(SRC).toMatch(/outputRange: \[restingTop, raisedTop\]/);
});

test('the top animation is JS-driven and the fade is native', () => {
  // Mixing these up is the classic RN failure: `top` on the native driver throws
  // "Attempting to run JS driven animation..." or silently does nothing.
  expect(SRC).toMatch(/timing\(chromeOpacity, \{ toValue: up \? 0 : 1, duration, useNativeDriver: true \}\)/);
  expect(SRC).toMatch(/timing\(threadTop, \{ toValue: up \? 1 : 0, duration, useNativeDriver: false \}\)/);
});

test('both keyboard directions are wired, per platform', () => {
  // iOS gets will*, so the motion rides the system animation; Android has no will*.
  expect(SRC).toMatch(/keyboardWillShow.*keyboardDidShow/s);
  expect(SRC).toMatch(/keyboardWillHide.*keyboardDidHide/s);
  // Hiding must animate back — a one-way lift leaves the portrait gone for good.
  expect(SRC).toMatch(/addListener\(hideEvt, \(e\) => animate\(false/);
  expect(SRC).toMatch(/addListener\(showEvt, \(e\) => animate\(true/);
});

test('the covered chrome stops taking taps', () => {
  // Faded-but-hittable means a tap aimed at the thread opens a QUICK INFO tool, or
  // toggles the NPC's voice, from behind it.
  const hits = SRC.match(/pointerEvents=\{typing \? 'none' : 'auto'\}/g) ?? [];
  expect(hits.length).toBe(2); // the portrait and the QUICK INFO dock
});

test('the listeners are removed on unmount', () => {
  expect(SRC).toMatch(/return \(\) => \{ show\.remove\(\); hide\.remove\(\); \};/);
});
