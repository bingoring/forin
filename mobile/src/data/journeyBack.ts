// The one way any screen in the journey tab stack (dept, theme, pick-dept) leaves when
// there might be nothing underneath it to leave TO — journey-binder-v42 Task J,
// task-J-brief.md §5.
//
// All three screens are reached normally by pushing on top of the shelf
// ((tabs)/journey/index.tsx), where `router.back()` always has that shelf to land on.
// All three are ALSO reachable directly — a deep link, or the OS restoring a route after
// the app was killed — where the screen is the only entry in its stack and `back()` is a
// no-op: a screen with no way out, because nothing is listening for a pop that never
// happens. `canGoBack()` is how to tell the two cases apart.
//
// `replace`, not `push`, for the case with nothing to go back to: there is nowhere to
// pop FROM, so pushing the shelf on top would just grow the stack by one for no reason —
// the learner would then have to back out of the shelf too, to a stack entry that was
// never really there.
import type { useRouter } from 'expo-router';

type Router = ReturnType<typeof useRouter>;

export function goBackToShelf(router: Router): void {
  if (router.canGoBack()) router.back();
  else router.replace('/journey');
}
