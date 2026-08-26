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

// 다음 시나리오 must go INTO the next briefing, not to the career tab.
//
// It used to `replace('/campus')` — the learner finished something and was handed a
// building list to find what follows in. That is the button failing at its one job.
test('the next-scenario button opens the next briefing', () => {
  expect(SRC).toMatch(/router\.replace\(nextScenario \? `\/scenario\/\$\{nextScenario\}` : '\/campus'\)/);
});

test('a missing next falls back to the career tab rather than a dead route', () => {
  // The server omits nextScenarioId when there is nothing left; pushing
  // `/scenario/undefined` would be a route that can only error.
  expect(SRC).toMatch(/nextScenario \? .* : '\/campus'/);
});

test('the target comes from the server, not from the client walking the curriculum', () => {
  // Two screens computing "what's next" separately is how they end up disagreeing —
  // the home tab and the career tab already read the server's own resolution.
  expect(SRC).toMatch(/setNextScenario\(res\.nextScenarioId\)/);
});

test('a failed run offers a retry instead of pretending to advance', () => {
  // The server hands back the same scenario when the run did not pass, because the
  // step after it is locked precisely because of that.
  expect(SRC).toMatch(/nextScenario === id \? 'result\.retryScenario' : 'result\.nextScenario'/);
});

test('it replaces rather than pushes', () => {
  // The result screen is not somewhere to come back to: leaving it on the stack puts
  // a completed scenario behind the next one's back gesture.
  const btn = SRC.slice(SRC.indexOf('result.retryScenario'), SRC.indexOf('result.retryScenario') + 500);
  expect(btn).toMatch(/router\.replace\(/);
  expect(btn).not.toMatch(/router\.push\(/);
});
