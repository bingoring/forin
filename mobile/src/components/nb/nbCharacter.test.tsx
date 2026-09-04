// NbCharacter — the notebook line's walking figure (핸드오프 v37 §07).
//
// Two things it must not get wrong: the face has to be the LEARNER's (its colours come
// from the AvatarSpec, the same one NbAvatar draws), and the walk direction flips the
// WHOLE drawing rather than leaving it facing one way. Motion itself is not asserted here
// — it runs on the native driver and never reaches the tree — only that the parts are
// present and coloured, and that flip mirrors.
import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { NbCharacter } from '@/components/nb/NbCharacter';
import { OUTC, SKINS } from '@/components/nb/NbAvatar';

// The composites, not the host nodes: react-native-svg turns `fill: '#F6DCC0'` into a
// packed int by the host node, so the authored colour is only readable on the Path/Circle
// composite (the same reason nbAvatar.test reads it there).
const PRIMITIVES = new Set(['Path', 'Circle', 'Ellipse', 'Rect', 'Line']);
function fills(root: ReactTestInstance): string[] {
  return root
    .findAll((n) => {
      if (typeof n.type === 'string') return false;
      const name = n.type as { displayName?: string; name?: string };
      return PRIMITIVES.has(name.displayName ?? name.name ?? '');
    }, { deep: true })
    .map((n) => String((n.props as { fill?: unknown }).fill ?? '').toUpperCase())
    .filter(Boolean);
}

test('얼굴과 몸이 학습자의 스펙 색으로 그려진다', () => {
  // Their face, their uniform: the head skin and the outfit colour are the ones the
  // AvatarSpec names, not a hard-coded pair.
  let tree!: ReturnType<typeof create>;
  act(() => { tree = create(<NbCharacter spec={{ skin: 'beige', outfitColor: 'sage' }} walking />); });
  const drawn = fills(tree.root);
  act(() => { tree.unmount(); });
  expect(drawn).toContain(SKINS.beige.toUpperCase()); // head + hands + neck
  expect(drawn).toContain(OUTC.sage.toUpperCase()); // torso + arms + legs
});

test('flip=true 는 그림 전체를 좌우 반전한다', () => {
  let tree!: ReturnType<typeof create>;
  act(() => { tree = create(<NbCharacter flip />); });
  const flipped = tree.root.findAll((n) => {
    const style = n.props?.style;
    const flat = Array.isArray(style) ? Object.assign({}, ...style) : (style ?? {});
    return Array.isArray((flat as { transform?: unknown }).transform)
      && (flat as { transform: Record<string, unknown>[] }).transform.some((tr) => tr.scaleX === -1);
  }, { deep: true });
  act(() => { tree.unmount(); });
  expect(flipped.length).toBeGreaterThan(0);
});
