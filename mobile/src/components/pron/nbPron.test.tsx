// The pronunciation cards, in the 근무 수첩 line.
//
// Every rule checked here is a way for the screen to lie about how the learner did, and
// all of them still render:
//
//  · a try that has not happened yet drawn as a zero,
//  · a "you improved" line on a try that went backwards,
//  · an unscored prosody drawn as 0 (Azure only scores it on some locales, so the server
//    sends prosodyAvailable alongside the number),
//  · an empty syllable grid under its legend, which reads as "every syllable was fine",
//  · a playback chip that looks live when there is no reference audio to play.
jest.mock('expo-secure-store', () => ({
  getItemAsync: async () => null, setItemAsync: async () => {}, deleteItemAsync: async () => {},
}));

import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { AttemptHistory } from './AttemptHistory';
import { ScoreBars } from './ScoreBars';
import { SyllableGrid } from './SyllableGrid';
import { TargetCard } from './TargetCard';
import { BAND } from './nbPron';
import { trackMounts } from '../../testing/mountRegistry';

const track = trackMounts();

function draw(node: React.ReactElement): ReactTestInstance {
  let tree!: ReturnType<typeof create>;
  act(() => { tree = track(create(node)); });
  return tree.root;
}

/** RN style props NEST: a component that takes `style` and puts it last in its own array
 *  produces [base, [mine]]. A one-level flatten copies the inner array's INDICES as keys
 *  and loses every property in it. */
function flatten(st: unknown): Record<string, unknown> {
  if (!st) return {};
  if (Array.isArray(st)) return Object.assign({}, ...st.map(flatten));
  return st as Record<string, unknown>;
}

function texts(root: ReactTestInstance): string[] {
  return root
    .findAll((n) => String(n.type) === 'Text', { deep: true })
    .flatMap((n) => n.children.filter((c): c is string => typeof c === 'string'));
}

/** Every HOST node whose style matches. Host only: RN's View wraps a host view and both
 *  carry the style, so counting composites doubles every result. */
function styled(root: ReactTestInstance, pred: (s: Record<string, unknown>) => boolean) {
  return root.findAll(
    (n) => typeof n.type === 'string' && !!n.props?.style && pred(flatten(n.props.style)),
    { deep: true },
  );
}

/** Each gauge's filled fraction, in order. NbGauge draws a percentage-width clip over a
 *  hatch, so the width IS the value. Views only: the hatch is an <Svg width="100%">, which
 *  also lands in the style and would report every gauge as full. */
function gauges(root: ReactTestInstance): string[] {
  return root
    .findAll((n) => String(n.type) === 'View' && typeof flatten(n.props?.style).width === 'string', { deep: true })
    .map((n) => String(flatten(n.props.style).width));
}

test('a try that has not happened is blank, not zero', () => {
  // Not-yet-attempted and scored-zero are different facts. Drawing the third row as 0
  // tells somebody who has two tries left that they already failed the third.
  const root = draw(<AttemptHistory attempts={[{ no: 1, score: 62 }, { no: 2, score: 74 }, { no: 3, score: null }]} />);
  expect(texts(root)).toContain('—');
  expect(gauges(root)).toEqual(['62%', '74%', '0%']);
});

test('the rise line appears only when the score actually rose', () => {
  const up = draw(<AttemptHistory attempts={[{ no: 1, score: 62 }, { no: 2, score: 89 }]} />);
  expect(texts(up).join(' ')).toContain('27점 올랐어요');

  // Went backwards: a green "올랐어요" would be a lie and a red "내려갔어요" would be the
  // app telling somebody who just practised that they got worse. It says nothing.
  const down = draw(<AttemptHistory attempts={[{ no: 1, score: 89 }, { no: 2, score: 62 }]} />);
  expect(down.findAll((n) => String(n.type) === 'Text', { deep: true })
    .flatMap((n) => n.children).join(' ')).not.toContain('올랐어요');
});

test('an unscored prosody has no row at all', () => {
  const off = draw(<ScoreBars accuracy={72} fluency={81} prosody={0} prosodyAvailable={false} />);
  expect(texts(off)).not.toContain('억양');
  expect(gauges(off)).toEqual(['72%', '81%']);

  const on = draw(<ScoreBars accuracy={72} fluency={81} prosody={84} prosodyAvailable />);
  expect(texts(on)).toContain('억양');
  expect(gauges(on)).toEqual(['72%', '81%', '84%']);
});

test('no syllables means no grid — not a legend over an empty row', () => {
  const empty = draw(<SyllableGrid syllables={[]} />);
  expect(texts(empty)).toEqual([]);
});

test('the three bands are three different colours, and the chips are printed', () => {
  // At chip size the band IS the result. Two bands sharing a fill would report a syllable
  // the learner has to redo as one they got right.
  const root = draw(<SyllableGrid syllables={[
    { label: 'aɪm', band: 'ok' }, { label: 'ə', band: 'weak' }, { label: 'ˌsiː', band: 'bad' },
  ]} />);
  const fills = [BAND.ok, BAND.weak, BAND.bad];
  expect(new Set(fills).size).toBe(3);
  for (const fill of fills) {
    expect(styled(root, (s) => s.backgroundColor === fill).length).toBeGreaterThan(0);
  }
  // IPA is machine-printed in the fiction and unreadable in a handwriting face: Gaegu at
  // 11pt does not distinguish ə from a.
  const chip = root.findAll(
    (n) => String(n.type) === 'Text' && n.children.some((c) => c === 'ˌsiː'),
    { deep: true },
  )[0];
  expect(String(flatten(chip.props.style).fontFamily)).toMatch(/^IBMPlexMono/);
});

test('with no reference audio the 원어민 chip goes flat and dead', () => {
  // A live-looking chip that plays nothing is the learner tapping the one thing that
  // would tell them what the line should sound like, twice, and concluding the app broke.
  const dead = draw(
    <TargetCard tokens={[{ w: 'Hello' }]} ipa="/həˈloʊ/" hint="3회 중 1회차" nativeAvailable={false} onPlayNative={() => {}} />,
  );
  const press = dead.findAll((n) => typeof n.props?.onPress === 'function' && n.props?.disabled !== undefined, { deep: true });
  expect(press.length).toBeGreaterThan(0);
  expect(press.every((n) => n.props.disabled === true)).toBe(true);
  expect(styled(dead, (s) => s.opacity === 0.4).length).toBeGreaterThan(0);

  const live = draw(
    <TargetCard tokens={[{ w: 'Hello' }]} ipa="/həˈloʊ/" hint="3회 중 1회차" nativeAvailable onPlayNative={() => {}} />,
  );
  expect(styled(live, (s) => s.opacity === 0.4).length).toBe(0);
});

test('the dose and the drug name are both marked, and told apart by pen', () => {
  // These are the two spans where a mishearing becomes a medication error. A second
  // highlighter colour at this size reads as decoration, so the drug name is underlined.
  const root = draw(
    <TargetCard
      tokens={[{ w: 'Take ' }, { w: 'acetaminophen', hi: 'drug' }, { w: ' ' }, { w: '650mg', hi: 'num' }]}
      hint="1회차"
      nativeAvailable
      onPlayNative={() => {}}
    />,
  );
  const marked = root.findAll(
    (n) => String(n.type) === 'Text' && flatten(n.props?.style).backgroundColor === '#F9E37B',
    { deep: true },
  );
  expect(marked.map((n) => n.children[0])).toEqual(['acetaminophen', '650mg']);
  expect(flatten(marked[0].props.style).textDecorationLine).toBe('underline');
  expect(flatten(marked[1].props.style).textDecorationLine).toBeUndefined();
});
