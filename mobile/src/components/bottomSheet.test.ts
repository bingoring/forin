import { readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';

const SRC = readFileSync(join(__dirname, 'BottomSheet.tsx'), 'utf8');

// The drag handlers used to sit on the sheet's own Animated.View, so any vertical
// movement inside it was claimed as a sheet drag once it passed 6px — scrolling a long
// list dragged the sheet along with it. The gesture belongs to the handle and nothing
// else, and that is a structural property worth pinning: it is invisible in a diff and
// only shows up as a sheet that fights the scroll.
//
// A source check. It is not the whole story — bottomSheet.render.test.tsx mounts the
// component and drives the real gesture, which is what proves the drag WORKS. This file
// pins WHERE the drag lives, which a render test cannot distinguish once it passes.
test('the pan handlers are attached to exactly one element', () => {
  const attachments = SRC.match(/\{\.\.\.pan\.panHandlers\}/g) ?? [];
  expect(attachments).toHaveLength(1);
});

test('and that element is the grabber, not the sheet body', () => {
  // The grabber View is the one that renders the bar; the sheet body is the one that
  // carries maxHeight/transform. Find which block the handlers sit in by looking at
  // what follows them before the next JSX element closes.
  const at = SRC.indexOf('{...pan.panHandlers}');
  expect(at).toBeGreaterThan(-1);
  const after = SRC.slice(at, at + 400);
  // The handle's own markers: it centres its content and draws the 5px bar.
  expect(after).toMatch(/alignItems: 'center'/);
  expect(after).toMatch(/height: 5/);
  // And it must NOT be the sheet body, which is identified by these.
  expect(after).not.toMatch(/maxHeight/);
  expect(after).not.toMatch(/transform: \[\{ translateY/);
});

// A fling has to work on velocity alone. Requiring distance means a fast, small flick
// springs back, which reads as the sheet refusing to obey.
test('release reacts to velocity as well as distance, in both directions', () => {
  expect(SRC).toMatch(/g\.dy > CLOSE_THRESHOLD \|\| g\.vy > FLICK/);
  expect(SRC).toMatch(/g\.dy < -CLOSE_THRESHOLD \/ 2 \|\| g\.vy < -FLICK/);
});

// The handlers close over the first render's values because the responder is built in a
// useRef. Reading them through a ref that is refreshed each render is what keeps the
// close animation travelling the right distance once the keyboard is up.
test('the release handler reads live values, not the first render', () => {
  expect(SRC).toMatch(/live\.current = \{ restH, kbH, canExpand, onClose \}/);
  expect(SRC).toMatch(/const \{ restH: rh, kbH: kb, canExpand: grow, onClose: done \} = live\.current/);
});


// Every sheet in the app goes through this component.
//
// InfoSheet did not. It was its own Modal that drew a 44x5 bar at the top of itself —
// pixel-identical to the grabber here, with no gesture behind it. Grabbing it did
// nothing at all, and that is worse than having no handle: the bar is a promise that
// the sheet can be dragged. The rule is structural because the failure is invisible
// in a diff and invisible in a screenshot; it only shows up under a thumb.
test('every sheet component is built on this one', () => {
  const root = join(__dirname, '..');
  const sheets: string[] = [];
  const walk = (dir: string) => {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name);
      if (statSync(p).isDirectory()) walk(p);
      else if (/Sheet\.tsx$/.test(name)) sheets.push(p);
    }
  };
  walk(root);
  // Sanity: if the glob ever stops matching, this test must fail loudly rather than
  // pass over an empty list.
  expect(sheets.length).toBeGreaterThanOrEqual(5);

  const offenders = sheets
    .filter((p) => !p.endsWith(join('components', 'BottomSheet.tsx')))
    .filter((p) => !readFileSync(p, 'utf8').includes("from '@/components/BottomSheet'"));
  expect(offenders).toEqual([]);
});
