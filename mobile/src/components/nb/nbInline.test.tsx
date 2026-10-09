// 문장 중간 형광펜은 글자 상자의 아래 45%만(nuance.jsx L71 · ui.jsx L94–96), 칠한 구간 안의 빈칸도 칠하고
// 끝에서는 2 넓힌다. 취소선은 그린 선.
import { Text } from 'react-native';
import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { NbInline, markParts } from './NbInline';
import { trackMounts } from '../../testing/mountRegistry';

const track = trackMounts();
const ts = { fontSize: 17, lineHeight: 27 };

function mount(el: React.ReactElement) {
  let tree!: ReturnType<typeof create>;
  act(() => { tree = track(create(el)); });
  return tree;
}
const flat = (n: ReactTestInstance) => Object.assign({}, ...[n.props.style].flat(5).filter(Boolean)) as Record<string, unknown>;
const ids = (root: ReactTestInstance, id: string) => root.findAll((n) => n.props?.testID === id && typeof n.type === 'string');
const words = (root: ReactTestInstance) => root.findAll((n) => n.type === Text).map((n) => n.props.children).filter((c) => c !== ' ');

test('markParts reads *…* as the highlighted run', () => {
  expect(markParts('외우지 말고 *다섯 장면*에서 그냥').map((p) => ('text' in p ? [p.text, p.mark] : null))).toEqual([
    ['외우지 말고 ', false], ['다섯 장면', true], ['에서 그냥', false],
  ]);
});

test('a marked word gets a band over the lower 45% of its line box only', () => {
  const tree = mount(<NbInline textStyle={ts} parts={[{ text: 'She started to ' }, { text: 'deteriorate', mark: true }, { text: ' en route.' }]} />);
  expect(words(tree.root)).toEqual(['She', 'started', 'to', 'deteriorate', 'en', 'route.']);
  const bands = ids(tree.root, 'nb-inline-mark');
  expect(bands).toHaveLength(1);
  expect(flat(bands[0])).toMatchObject({ top: '55%', bottom: 0, left: -2, right: -2, backgroundColor: '#F9E37B' });
  // the space after it is not marked — the run ends there
  expect(ids(tree.root, 'nb-inline-mark-gap')).toHaveLength(0);
});

test('inside a marked run the spaces are marked too, and only the ends are widened', () => {
  const tree = mount(<NbInline textStyle={ts} parts={markParts('뜻을 보고 *문장을 만들어*보세요')} />);
  const bands = ids(tree.root, 'nb-inline-mark').map(flat);
  expect(bands).toHaveLength(2);
  expect(bands[0]).toMatchObject({ left: -2, right: 0 });
  expect(bands[1]).toMatchObject({ left: 0, right: -2 });
  expect(ids(tree.root, 'nb-inline-mark-gap')).toHaveLength(1);
});

test('a struck run draws its own line, through the spaces between struck words', () => {
  const tree = mount(<NbInline textStyle={ts} parts={[{ text: 'Your mother deteriorated.', strike: { color: '#C75146', width: 2 } }]} />);
  const lines = ids(tree.root, 'nb-inline-strike').map(flat);
  expect(lines).toHaveLength(5); // 3 words + 2 gaps
  expect(lines[0]).toMatchObject({ height: 2, backgroundColor: '#C75146' });
});
