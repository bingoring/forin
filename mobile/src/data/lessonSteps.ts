// The hub's step rules (lesson-four-steps-v44 G). The server decides each step's state
// (GET /me/lesson); the only thing the client adds is `그래도 할래요` — opting into a step
// the learner's level skips — which lives on the screen until that step is finished and
// the server records it.
import type { Href } from 'expo-router';
import type { LessonStepKind, LessonStepView } from '@/api/client';

/** Steps the learner will do here: not skipped for their level, not unwritten. */
const countable = (s: LessonStepView) => s.state !== 'skip' && s.state !== 'empty';

/** Gauge numerator and denominator — both count only the steps that remain for this learner. */
export function gauge(steps: LessonStepView[]): { done: number; total: number } {
  const c = steps.filter(countable);
  return { done: c.filter((s) => s.state === 'done').length, total: c.length };
}

/**
 * Opens the skipped steps the learner opted into, then re-lays now/lock the way the
 * server does: the first step not done is now, the rest lock. Empty steps stay empty —
 * there is nothing to open.
 */
export function applyOptIn(steps: LessonStepView[], optIn: ReadonlySet<LessonStepKind>): LessonStepView[] {
  if (!steps.some((s) => s.state === 'skip' && optIn.has(s.kind))) return steps;
  let nowGiven = false;
  return steps.map((s) => {
    const open = s.state === 'skip' && optIn.has(s.kind);
    if (!open && (s.state === 'done' || s.state === 'skip' || s.state === 'empty')) return s;
    if (nowGiven) return { ...s, state: 'lock' };
    nowGiven = true;
    return { ...s, state: 'now' };
  });
}

/** The step the CTA opens; undefined when everything left is done. */
export function nextStep(steps: LessonStepView[]): LessonStepView | undefined {
  return steps.find((s) => s.state === 'now');
}

/** Where a step lives. The dialogue steps carry their own rung. */
export function stepHref(scenarioId: string, kind: LessonStepKind): Href {
  switch (kind) {
    case 'words': return `/scenario/${scenarioId}/words`;
    case 'sentences': return `/scenario/${scenarioId}/sentences`;
    case 'guided': return `/dialogue/${scenarioId}?guide=guided`;
    case 'free': return `/dialogue/${scenarioId}?guide=free`;
  }
}
