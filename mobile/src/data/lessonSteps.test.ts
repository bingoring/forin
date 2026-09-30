import { applyOptIn, gauge, nextStep, stepHref } from './lessonSteps';
import type { LessonStepView } from '@/api/client';

const S = (...st: LessonStepView['state'][]): LessonStepView[] =>
  (['words', 'sentences', 'guided', 'free'] as const).map((kind, i) => ({ kind, state: st[i], count: 3 }));

describe('gauge — 분모는 남은 단계 기준', () => {
  it('level a counts all four', () => expect(gauge(S('now', 'lock', 'lock', 'lock'))).toEqual({ done: 0, total: 4 }));
  it('level b counts three', () => expect(gauge(S('skip', 'now', 'lock', 'lock'))).toEqual({ done: 0, total: 3 }));
  it('level c counts two', () => expect(gauge(S('skip', 'skip', 'done', 'now'))).toEqual({ done: 1, total: 2 }));
  it('empty steps are not counted either', () => expect(gauge(S('empty', 'empty', 'now', 'lock'))).toEqual({ done: 0, total: 2 }));
});

describe('applyOptIn — 그래도 할래요', () => {
  it('opens the opted-in skipped step and makes it the one to do now', () => {
    const out = applyOptIn(S('skip', 'now', 'lock', 'lock'), new Set(['words']));
    expect(out.map((s) => s.state)).toEqual(['now', 'lock', 'lock', 'lock']);
  });

  it('raises the gauge denominator by one', () => {
    const steps = S('skip', 'skip', 'now', 'lock');
    expect(gauge(steps).total).toBe(2);
    expect(gauge(applyOptIn(steps, new Set(['sentences']))).total).toBe(3);
  });

  it('never opens an empty step', () => {
    const out = applyOptIn(S('empty', 'empty', 'now', 'lock'), new Set(['words', 'sentences']));
    expect(out.map((s) => s.state)).toEqual(['empty', 'empty', 'now', 'lock']);
  });

  it('leaves the server states alone when nothing is opted into', () => {
    const steps = S('skip', 'now', 'lock', 'lock');
    expect(applyOptIn(steps, new Set())).toEqual(steps);
  });
});

describe('nextStep / stepHref', () => {
  it('is the step marked now', () => expect(nextStep(S('done', 'now', 'lock', 'lock'))?.kind).toBe('sentences'));
  it('is undefined when every countable step is done', () => expect(nextStep(S('skip', 'done', 'done', 'done'))).toBeUndefined());

  // The rung comes from the step, not from whatever row was tapped to get here — the hub
  // is where the learner now chooses, and it shows which rung is next.
  it('sends each dialogue step with its own rung', () => {
    expect(stepHref('SCN-1', 'guided')).toBe('/dialogue/SCN-1?guide=guided');
    expect(stepHref('SCN-1', 'free')).toBe('/dialogue/SCN-1?guide=free');
    expect(stepHref('SCN-1', 'words')).toBe('/scenario/SCN-1/words');
    expect(stepHref('SCN-1', 'sentences')).toBe('/scenario/SCN-1/sentences');
  });
});
