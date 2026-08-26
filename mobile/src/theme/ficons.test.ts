// The generated icon table must stay identical to the handoff's own file.
//
// This is the guard that makes "1:1 port" a checkable claim rather than a promise:
// it re-parses design-handoff_v25/reference/forin-pixel-icons.jsx and compares
// every rect. A hand-edit to the generated file, or a handoff bump that nobody
// regenerated for, fails here — which is the only way either would be noticed,
// since a wrong coordinate still renders a plausible-looking icon.
import { execFileSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { FEMOJI, FICONS } from './ficons';

const REF = join(
  __dirname, '..', '..', '..', 'docs', 'dlc', 'projects', 'forin', 'inputs',
  'design-handoff_v25', 'reference', 'forin-pixel-icons.jsx',
);

// The handoff lives in the `docs/dlc` git submodule, which points at a PRIVATE repo.
// CI checks out the app without it, so these files are simply absent there — and this
// suite crashed on every push for eight commits before anyone looked at the runs.
//
// Skipping when it is absent is right, but only because the comparison is not the only
// guard: the generated table is committed, and the app renders from that. What the
// comparison catches is a hand-edit or a missed regeneration, which is a thing that
// happens on a developer's machine — where the submodule IS checked out. So the check
// runs exactly where it can catch something.
//
// Deliberately NOT a silent skip: an absent submodule prints why, so a local run that
// quietly stopped comparing does not look like a passing comparison.
const REF_PRESENT = existsSync(REF);
if (!REF_PRESENT) {
  console.warn(
    '[ficons] docs/dlc submodule not checked out — skipping the 1:1 parity comparison.\n' +
    '         Run `git submodule update --init docs/dlc` to enable it locally.',
  );
}
const itWithHandoff = REF_PRESENT ? test : test.skip;

/** Re-extracts the tables from the reference by running the generator's own
 *  method in a throwaway node process, so the comparison is against the source
 *  of truth rather than against another copy of our own output. */
function fromHandoff(): { icons: Record<string, number[][]>; emoji: Record<string, string> } {
  const script = `
    const { readFileSync } = require('fs');
    const vm = require('vm');
    const source = readFileSync(${JSON.stringify(REF)}, 'utf8');
    const win = {};
    const noop = () => {};
    const sandbox = {
      window: win,
      document: { createTreeWalker: () => ({ nextNode: () => null }), addEventListener: noop, readyState: 'complete', body: null },
      MutationObserver: class { observe() {} disconnect() {} },
      setTimeout: noop, React: { createElement: () => null }, console,
    };
    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);
    const cut = source.indexOf('function FIcon(');
    vm.runInContext(source.slice(0, cut) + '\\n Object.assign(window,{FICONS:ICONS,FEMOJI:EMOJI_MAP});\\n})();\\n', sandbox);
    const RECT = /<rect x="([-\\d.]+)" y="([-\\d.]+)" width="([-\\d.]+)" height="([-\\d.]+)" fill="([^"]+)"\\/>/g;
    const icons = {};
    for (const [name, svg] of Object.entries(win.FICONS)) {
      icons[name] = [...svg.matchAll(RECT)].map((m) => [Number(m[1]), Number(m[2]), Number(m[3]), Number(m[4]), m[5]]);
    }
    process.stdout.write(JSON.stringify({ icons, emoji: win.FEMOJI }));
  `;
  return JSON.parse(execFileSync('node', ['-e', script], { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 }));
}

const handoff = REF_PRESENT ? fromHandoff() : { icons: {}, emoji: {} };

itWithHandoff('the reference file is still readable and carries the whole set', () => {
  // If the handoff's internal layout changes, everything below would compare two
  // empty objects and pass. This is the assertion that stops that.
  expect(Object.keys(handoff.icons).length).toBe(88); // v25 added ivbag
  expect(Object.keys(handoff.emoji).length).toBeGreaterThan(100);
});

itWithHandoff('every icon in the handoff exists here, and nothing extra was invented', () => {
  expect(Object.keys(FICONS).sort()).toEqual(Object.keys(handoff.icons).sort());
});

itWithHandoff('every rect matches the handoff exactly', () => {
  for (const name of Object.keys(handoff.icons)) {
    expect(FICONS[name].map((r) => [...r])).toEqual(handoff.icons[name]);
  }
});

itWithHandoff('the emoji map matches the handoff exactly', () => {
  expect(FEMOJI).toEqual(handoff.emoji);
});

// The handoff's fallback: an unknown name draws the reward gem, so a missing icon
// looks like a mistake rather than like nothing.
test('xp exists, because it is the fallback every unknown name lands on', () => {
  expect(FICONS.xp?.length).toBeGreaterThan(0);
});

// Expression emoji are deliberately unmapped in the handoff — they are faces, not
// icons — and must stay unmapped, or a smiling nurse becomes a gem.
test('face emoji are not mapped', () => {
  for (const face of ['😄', '😊', '😢', '😰', '🙂']) {
    expect(FEMOJI[face]).toBeUndefined();
  }
});

// The generated file says it is generated. If someone edits it by hand the header
// is the only warning the next reader gets.
test('the generated file warns that it is generated', () => {
  const src = readFileSync(join(__dirname, 'ficons.ts'), 'utf8');
  expect(src).toMatch(/GENERATED by scripts\/gen-ficons\.mjs/);
});
