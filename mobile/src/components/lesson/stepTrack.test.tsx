// StepTrack — lesson-four-steps-v44 Task F. The four-step header every STEP screen
// wears: icon circles, connectors, a green badge on a finished step, and a hatched,
// struck-through circle on a step the learner's level skips.
import { act, create } from 'react-test-renderer';
import { Text } from 'react-native';
import { StepTrack } from './StepTrack';
import type { LessonStepView } from '@/api/client';
import { trackMounts } from '../../testing/mountRegistry';
import { nb } from '@/theme/nb';

const track = trackMounts();

function mount(steps: LessonStepView[]) {
  let tree!: ReturnType<typeof create>;
  act(() => { tree = track(create(<StepTrack steps={steps} />)); });
  return tree;
}

const S = (w: LessonStepView['state'], s: LessonStepView['state'], g: LessonStepView['state'], f: LessonStepView['state']): LessonStepView[] => [
  { kind: 'words', state: w }, { kind: 'sentences', state: s }, { kind: 'guided', state: g }, { kind: 'free', state: f },
];

const hatches = (tree: ReturnType<typeof create>) => tree.root.findAllByProps({ testID: 'steptrack-hatch' }).filter((n) => typeof n.type !== 'string');
const strikes = (tree: ReturnType<typeof create>) => tree.root.findAllByProps({ testID: 'steptrack-strike' }).filter((n) => typeof n.type !== 'string');
const link = (tree: ReturnType<typeof create>, i: number) => tree.root.findByProps({ testID: `steptrack-link-${i}` });
const badges = (tree: ReturnType<typeof create>) => tree.root.findAllByProps({ testID: 'steptrack-done' }).filter((n) => typeof n.type !== 'string');

describe('StepTrack — 건너뛴 단계', () => {
  it('hatches and strikes exactly the skipped steps', () => {
    const tree = mount(S('skip', 'skip', 'now', 'lock'));
    expect(hatches(tree)).toHaveLength(2);
    expect(strikes(tree)).toHaveLength(2);
  });

  it('draws no hatching at all when nothing is skipped', () => {
    const tree = mount(S('now', 'lock', 'lock', 'lock'));
    expect(hatches(tree)).toHaveLength(0);
    expect(strikes(tree)).toHaveLength(0);
  });

  it('strikes through the label of a skipped step only', () => {
    const tree = mount(S('skip', 'now', 'lock', 'lock'));
    const labels = tree.root.findAllByType(Text).filter((t) => t.props.testID?.startsWith('steptrack-label-'));
    const struck = labels.filter((t) => [t.props.style].flat().some((s: any) => s?.textDecorationLine === 'line-through'));
    expect(struck.map((t) => t.props.testID)).toEqual(['steptrack-label-words']);
  });
});

// Content not written yet (spec §6 결정 3) is not a skip — hatching would say "your
// level skips this", and the hub would offer to open an empty screen.
describe('StepTrack — 준비 중(empty)', () => {
  it('draws an empty step without hatching or a strike', () => {
    const tree = mount(S('empty', 'empty', 'now', 'lock'));
    expect(hatches(tree)).toHaveLength(0);
    expect(strikes(tree)).toHaveLength(0);
  });
});

describe('StepTrack — 연결선', () => {
  // A solid segment is a green bar; a dashed one is a row of dashes (no one-sided
  // borders — iOS draws neither a clipped nor a one-sided dashed border).
  const solid = (tree: ReturnType<typeof create>, i: number) => {
    const l = link(tree, i);
    const green = [l.props.style].flat().some((s: any) => s?.backgroundColor === nb.green);
    const dashes = l.findAll((n) => n.props?.testID === 'steptrack-dash').length;
    return green && dashes === 0;
  };

  it('follows the number of finished steps', () => {
    const tree = mount(S('done', 'done', 'now', 'lock'));
    expect([0, 1, 2].map((i) => solid(tree, i))).toEqual([true, true, false]);
  });

  // lesson-fidelity-v46 T6 (audit hub #87): lesson.jsx L43 `i < done` — the line after a
  // step is solid only when that step was actually finished. A skipped or not-yet-written
  // step was not done, so the line after it stays dashed.
  it('is solid only after a step actually finished — not after a skipped or empty one', () => {
    const tree = mount(S('skip', 'now', 'lock', 'lock'));
    expect([0, 1, 2].map((i) => solid(tree, i))).toEqual([false, false, false]);
    const empty = mount(S('empty', 'empty', 'done', 'now'));
    expect([0, 1, 2].map((i) => solid(empty, i))).toEqual([false, false, true]);
    const skipDone = mount(S('skip', 'done', 'done', 'now'));
    expect([0, 1, 2].map((i) => solid(skipDone, i))).toEqual([false, true, true]);
  });

  it('follows the step itself, not the ones before it', () => {
    const tree = mount(S('now', 'lock', 'done', 'done'));
    expect([0, 1, 2].map((i) => solid(tree, i))).toEqual([false, false, true]);
  });
});

describe('StepTrack — 완료 배지', () => {
  it('puts a green badge on each done step', () => {
    const tree = mount(S('done', 'skip', 'done', 'now'));
    expect(badges(tree)).toHaveLength(2);
  });
});

// Audit hub #81: lesson.jsx L36 `repeating-linear-gradient(-45deg, rgba(62,54,43,.07) 0 3px,
// transparent 3px 7px)` — 3 of every 7 measured across the stripes, so lines 3 thick, 7·√2
// apart along a row.
describe('StepTrack — 건너뜀 빗금', () => {
  it('spaces the stripes 7·√2 apart, 3 thick', () => {
    const tree = mount(S('skip', 'now', 'lock', 'lock'));
    const lines = hatches(tree)[0].findAll((n) => n.props?.stroke === 'rgba(62,54,43,.07)' && n.props?.x1 !== undefined && typeof n.props.x1 === 'number');
    expect(lines.length).toBeGreaterThan(2);
    expect(lines[0].props.strokeWidth).toBe(3);
    expect(Math.abs(lines[0].props.x1 - lines[1].props.x1)).toBeCloseTo(7 * Math.SQRT2, 5);
  });
});

// Audit hub #86: L41 `fontWeight: 700` on the step in progress — Gaegu's own bold cut, not a
// synthesised weight on the regular face.
describe('StepTrack — 진행 중 라벨', () => {
  it('sets the step in progress in Gaegu Bold', () => {
    const tree = mount(S('done', 'now', 'lock', 'lock'));
    const style = (k: string) => Object.assign({}, ...[tree.root.findByProps({ testID: `steptrack-label-${k}` }).props.style].flat(3).filter(Boolean));
    expect(style('sentences').fontFamily).toBe('Gaegu-Bold');
    expect(style('words').fontFamily).toBe('Gaegu');
  });
});
