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
// WHERE the handlers sit is asserted against the rendered node in
// bottomSheet.render.test.tsx, which reads the real style off the real element. The
// version of this check that lived here sliced a fixed window of source text after the
// spread and matched inside it — so adding a comment to the grabber broke it, which is
// a test measuring the wrong thing. Only the count stays here, because a second
// attachment somewhere else in the file is a text-level property.
test('the pan handlers are attached to exactly one element', () => {
  const attachments = SRC.match(/\{\.\.\.pan\.panHandlers\}/g) ?? [];
  expect(attachments).toHaveLength(1);
});

// The grabber owns the touch from the moment it lands. Claiming only on move means the
// drag depends on winning a negotiation against everything above it, for no benefit on a
// strip that has nothing else to do with a touch.
test('the grabber claims the gesture on touch start', () => {
  expect(SRC).toMatch(/onStartShouldSetPanResponder: \(\) => true/);
});

// Release semantics — which gesture dismisses, which is slack, which detent it lands on
// — are asserted by driving real gestures in bottomSheet.render.test.tsx. They used to be
// matched as source patterns here, which pinned the spelling of a condition rather than
// its behaviour: the patterns broke the moment the thresholds gained a travel gate, while
// saying nothing about whether the gate worked.

// The handlers close over the first render's values because the responder is built in a
// useRef. Reading them through a ref that is refreshed each render is what keeps the
// close animation travelling the right distance once the keyboard is up.
test('the release handler reads live values, not the first render', () => {
  expect(SRC).toMatch(/live\.current = \{ restH, kbH, canExpand, onClose, expanded \}/);
  expect(SRC).toMatch(/= live\.current;/);
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
