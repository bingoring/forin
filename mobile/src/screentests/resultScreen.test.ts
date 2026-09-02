// 근무 완료 — the result screen's routing contract, read from the source.
//
// The screen itself is asserted on its RENDERED output in resultScreen.render.test.tsx;
// what is left here is where its two buttons go, which is a fact about intent that a
// render test would need the whole award sequence mocked to see.
//
// Three tests were DELETED with v30 rather than left failing, and the reason belongs in
// the file that used to hold them: the confetti (and the tap-anywhere-for-more that fed
// it, and the burst anchored to the 칭찬 스티커) is gone. The stamp is the celebration
// now — an authority's mark on a completed shift, the same gesture the passport's
// departure page uses. Confetti also had nowhere to be on a sheet of paper: it is a
// screen effect, and this screen is a document.
import { readFileSync } from 'fs';
import { join } from 'path';

const SRC = readFileSync(join(__dirname, '..', 'app', 'result', '[id].tsx'), 'utf8');

test('the content column scrolls, with room at the bottom', () => {
  // The column grows — the grade card, a level-up note, one row per new title, the
  // spoken-sentence review, the ledger, the footer — and the footer holds 다음 근무.
  expect(SRC).toMatch(/<ScrollView/);
  expect(SRC).toMatch(/scroll: \{ paddingHorizontal: 20, paddingTop: 14, paddingBottom: 44 \}/);
});

// 다음 근무 must go INTO the next briefing, not to the career tab.
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

test('it replaces rather than pushes into a scenario', () => {
  // The result screen is not somewhere to come back to: leaving it on the stack puts a
  // completed scenario behind the next one's back gesture. (The one `router.push` in the
  // file goes to the pronunciation screen, which IS somewhere you come back from.)
  expect(SRC).not.toMatch(/router\.push\(\s*`\/scenario\//);
  expect(SRC).toMatch(/router\.push\(\s*`\/pronunciation\//);
});
