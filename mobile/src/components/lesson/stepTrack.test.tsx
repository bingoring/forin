// StepTrack — lesson-four-steps-v44 Task F. The four-step header every STEP screen
// wears: icon circles, connectors, a green badge on a finished step, and a hatched,
// struck-through circle on a step the learner's level skips.
import { act, create } from 'react-test-renderer';
import { Text } from 'react-native';
import { StepTrack } from './StepTrack';
import type { LessonStepView } from '@/api/client';
import { trackMounts } from '../../testing/mountRegistry';

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
  const solid = (tree: ReturnType<typeof create>, i: number) => [link(tree, i).props.style].flat().find((s: any) => s?.borderStyle)?.borderStyle === 'solid';

  it('follows the number of finished steps', () => {
    const tree = mount(S('done', 'done', 'now', 'lock'));
    expect([0, 1, 2].map((i) => solid(tree, i))).toEqual([true, true, false]);
  });

  it('treats a skipped or empty step as passed — it does not hold the line back', () => {
    const tree = mount(S('skip', 'now', 'lock', 'lock'));
    expect([0, 1, 2].map((i) => solid(tree, i))).toEqual([true, false, false]);
    const empty = mount(S('empty', 'empty', 'done', 'now'));
    expect([0, 1, 2].map((i) => solid(empty, i))).toEqual([true, true, true]);
  });

  it('stays dashed past a step that is not finished, even if a later one is', () => {
    const tree = mount(S('now', 'lock', 'done', 'done'));
    expect([0, 1, 2].map((i) => solid(tree, i))).toEqual([false, false, false]);
  });
});

describe('StepTrack — 완료 배지', () => {
  it('puts a green badge on each done step', () => {
    const tree = mount(S('done', 'skip', 'done', 'now'));
    expect(badges(tree)).toHaveLength(2);
  });
});
