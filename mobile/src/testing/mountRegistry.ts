// Tear down every tree a test file mounted.
//
// A tree left mounted keeps whatever it scheduled alive past the end of the test —
// these screens carry timers, Animated loops and requestAnimationFrames — and when
// those fire jest has already torn the module registry down. The crash then lands on
// whichever UNRELATED suite happens to be running, as `Cannot read properties of
// undefined (reading 'spring')` or a 5-second timeout in a file that does none of this.
//
// It has bitten this repo four times, each in a different suite, and each time it was
// diagnosed from scratch because the failure never names the file that caused it. So
// the cleanup is one import rather than a paragraph of comment per test file.
//
//   const mount = trackMounts();      // at module scope — registers its own afterEach
//   const tree = mount(create(<Thing />));
import { act, type create } from 'react-test-renderer';

type Tree = ReturnType<typeof create>;

/**
 * Registers an `afterEach` that unmounts everything passed through the returned
 * function. Call it once at module scope.
 */
export function trackMounts(): (tree: Tree) => Tree {
  const trees: Tree[] = [];
  afterEach(() => {
    for (const tree of trees.splice(0)) {
      // Inside act: unmounting runs effects' cleanups, which is where the timers and
      // frames are cancelled.
      act(() => { tree.unmount(); });
    }
  });
  return (tree: Tree) => {
    trees.push(tree);
    return tree;
  };
}
