// The portrait system (핸드오프 v32).
//
// Four things here can break silently, and every one of them ships a wrong face:
//
//  · A layer that draws nothing. react-native-svg defaults `fill` to BLACK, so an
//    outline missing `fill: none` is a blob and an absent layer is invisible — the
//    tree is the only place to see which one happened.
//  · A stored key that no longer exists resetting the WHOLE portrait instead of the
//    one axis that went away.
//  · The seeded face drifting, which changes somebody's avatar under them.
//  · Layer ORDER. The face circle over the hair, or hair over a hat, still renders.
import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { NbAvatar } from '@/components/nb/NbAvatar';
import {
  ACC_KEYS, AVATAR_AXES, BG_KEYS, DEFAULT_AVATAR_SPEC, EYE_KEYS, HAIR_COLOR_KEYS, HAIR_KEYS,
  HAT_KEYS, MOUTH_KEYS, OUTFIT_COLOR_KEYS, OUTFIT_KEYS, SKIN_KEYS,
  avatarSpecFromSeed, normalizeAvatarSpec, randomAvatarSpec, type AvatarSpec,
} from '@/data/nbAvatar';

/**
 * Every svg primitive in the tree, in document order, with the props as AUTHORED.
 *
 * The composites, not the host nodes: react-native-svg renders each shape three deep
 * (`Circle` → `RNSVGCircle` → host), and by the host node `fill: '#fff'` has become
 * `{type: 0, payload: 4294967295}`. `String(n.type)` is no good either — a composite
 * stringifies to its whole function source, so a filter on that finds nothing and
 * every assertion below would have passed against an empty list.
 */
const PRIMITIVES = new Set(['Path', 'Circle', 'Ellipse', 'Rect', 'Line']);

function shapes(root: ReactTestInstance): { type: string; props: Record<string, unknown> }[] {
  return root
    .findAll((n) => {
      if (typeof n.type === 'string') return false;
      const name = (n.type as { displayName?: string; name?: string });
      return PRIMITIVES.has(name.displayName ?? name.name ?? '');
    }, { deep: true })
    .map((n) => {
      const name = n.type as { displayName?: string; name?: string };
      return { type: name.displayName ?? name.name ?? '', props: n.props as Record<string, unknown> };
    });
}

const draw = (spec: Partial<AvatarSpec>) => {
  // Inside act, and torn down after reading: 12 axes × every key mounts hundreds of
  // trees in this file, and a tree left alive keeps its renderer registered.
  let tree!: ReturnType<typeof create>;
  act(() => { tree = create(<NbAvatar spec={spec} size={64} />); });
  const out = shapes(tree.root);
  act(() => { tree.unmount(); });
  return out;
};

test('every key on every axis changes the drawing', () => {
  // A blank cell in the picker is the failure this catches: 19 hairstyles is a claim,
  // and one of them silently drawing nothing (or falling back to another key) makes
  // it 18 while the picker still offers 19.
  //
  // Compared against the DEFAULT face rather than counted: `eyes: happy` draws both
  // eyes in one path where `dot` uses two circles, so a shape COUNT goes down for a
  // key that draws perfectly well. What has to hold is that the output differs.
  const base = JSON.stringify(draw(DEFAULT_AVATAR_SPEC));

  for (const axis of AVATAR_AXES) {
    for (const key of axis.options) {
      const out = draw({ ...DEFAULT_AVATAR_SPEC, [axis.key]: key });
      expect(out.length).toBeGreaterThan(0);
      if (key === (DEFAULT_AVATAR_SPEC as Record<string, string>)[axis.key]) continue;
      expect(JSON.stringify(out)).not.toBe(base);
    }
  }
});

test('the layers are drawn in the handoff’s order', () => {
  const out = draw({ ...DEFAULT_AVATAR_SPEC, hair: 'bob', hat: 'nurseCap', acc: 'glassesRound', bg: 'washSky' });
  // The face is the r=14 circle at 32,32; the hair curtain is a Path before it and the
  // fringe a Path after it. Order is what makes a fringe a fringe rather than a hat.
  const faceAt = out.findIndex((s) => s.type === 'Circle' && s.props.r === '14');
  expect(faceAt).toBeGreaterThan(0);
  const bg = out.findIndex((s) => s.type === 'Rect' && s.props.fill === '#DCEAF2');
  expect(bg).toBeLessThan(faceAt);        // background behind the face
  // The collar goes UNDER the chin: the torso drawn over the face is a decapitation,
  // and it renders perfectly happily.
  const torso = out.findIndex((s) => s.type === 'Path' && String(s.props.d ?? '').startsWith('M14 70'));
  expect(torso).toBeGreaterThan(bg);
  expect(torso).toBeLessThan(faceAt);
  // The nurse cap's white crown comes after the face, and the glasses after the cap.
  const cap = out.findIndex((s) => s.props.fill === '#fff' && String(s.props.d ?? '').startsWith('M22 13'));
  expect(cap).toBeGreaterThan(faceAt);
  const lens = out.findIndex((s) => s.type === 'Circle' && s.props.r === '4.5');
  expect(lens).toBeGreaterThan(cap);
});

test('a bald head draws no hair at all, front or back', () => {
  // The absence lives in the layer maps (both return null for 'bald'), which is the
  // only place it can be observed — a second `if (bald)` in the component would be a
  // rule in two places with one of them untestable.
  const bald = draw({ ...DEFAULT_AVATAR_SPEC, hair: 'bald', hairColor: 'red' });
  // '#A85638' is red hair. A bald head that still paints a fringe is the bug.
  expect(bald.some((s) => s.props.fill === '#A85638')).toBe(false);
  // …and the face itself is still there.
  expect(bald.some((s) => s.type === 'Circle' && s.props.r === '14')).toBe(true);
});

test('long hair is one curtain, not two tails', () => {
  // The handoff's rule: a gap down the middle of longStraight reads as pigtails. The
  // curtain is a single filled path that reaches the nape (y≈59+).
  const long = draw({ ...DEFAULT_AVATAR_SPEC, hair: 'longStraight' });
  const curtain = long.filter((s) => s.type === 'Path' && /L49 59/.test(String(s.props.d ?? '')));
  expect(curtain).toHaveLength(1);

  // Actual pigtails ARE two paths, held clear of the face circle.
  const twin = draw({ ...DEFAULT_AVATAR_SPEC, hair: 'twintails' });
  expect(twin.filter((s) => s.type === 'Path' && /Q7 29|Q57 29/.test(String(s.props.d ?? '')))).toHaveLength(2);
});

test('no outline comes out as a filled blob', () => {
  // fill defaults to BLACK in react-native-svg, so a stroked shape that encloses area
  // and forgets `fill` is a black lump where a line drawing should be — the same trap
  // NbIcon documents. Shapes with no area (a Line, or a path that is only H/V/L moves)
  // are exempt: a default fill there covers nothing.
  const encloses = (s: { type: string; props: Record<string, unknown> }) => {
    if (s.type === 'Line') return false;
    if (s.type !== 'Path') return true; // Circle / Ellipse / Rect always have area
    const d = String(s.props.d ?? '');
    return /[QCAZqcaz]/.test(d);
  };

  const offenders: string[] = [];
  for (const axis of AVATAR_AXES) {
    for (const key of axis.options) {
      for (const s of draw({ ...DEFAULT_AVATAR_SPEC, [axis.key]: key })) {
        if (s.props.stroke === undefined || !encloses(s)) continue;
        if (s.props.fill === undefined) offenders.push(`${axis.key}:${key} ${s.type} ${String(s.props.d ?? '').slice(0, 24)}`);
      }
    }
  }
  expect(offenders).toEqual([]);
});

test('an unknown value loses its own axis and nothing else', () => {
  const spec = normalizeAvatarSpec({
    skin: 'olive', hair: 'sombrero', hairColor: 'mint', eyes: 'wink',
    mouth: 'smirk', outfit: 'labCoat', outfitColor: 'lilac', hat: 'crown', bg: 'grid', acc: 'monocle',
  });
  // The three unknown axes fall back; the seven the learner chose survive. Dropping
  // the whole spec would silently reset a portrait somebody built.
  expect(spec.hair).toBe(DEFAULT_AVATAR_SPEC.hair);
  expect(spec.hat).toBe(DEFAULT_AVATAR_SPEC.hat);
  expect(spec.acc).toBe(DEFAULT_AVATAR_SPEC.acc);
  expect(spec.skin).toBe('olive');
  expect(spec.hairColor).toBe('mint');
  expect(spec.eyes).toBe('wink');
  expect(spec.outfit).toBe('labCoat');
  expect(spec.bg).toBe('grid');
});

test('nothing at all still normalizes to a drawable face', () => {
  for (const raw of [null, undefined, {}, 'nonsense', 42, []]) {
    expect(normalizeAvatarSpec(raw)).toEqual(DEFAULT_AVATAR_SPEC);
  }
});

test('the seeded face is stable, and different seeds differ', () => {
  const id = '11111111-2222-3333-4444-555555555555';
  // Stability is the whole point: this is what a learner who never opened the picker
  // sees, on every device, and what colleagues see of them.
  expect(avatarSpecFromSeed(id)).toEqual(avatarSpecFromSeed(id));

  const faces = new Set(
    Array.from({ length: 200 }, (_, i) => JSON.stringify(avatarSpecFromSeed(`user-${i}`))),
  );
  // Not a collision test with a hard number — but 200 ids collapsing to a handful of
  // faces would mean the seed is barely being used.
  expect(faces.size).toBeGreaterThan(180);
});

test('anagram ids do not share a face', () => {
  // A char-code sum would give these the same portrait; djb2 does not.
  expect(avatarSpecFromSeed('ab')).not.toEqual(avatarSpecFromSeed('ba'));
});

test('every seeded and random face is made of real keys', () => {
  const lists: Record<keyof AvatarSpec, readonly string[]> = {
    skin: SKIN_KEYS, hair: HAIR_KEYS, hairColor: HAIR_COLOR_KEYS, eyes: EYE_KEYS,
    mouth: MOUTH_KEYS, outfit: OUTFIT_KEYS, outfitColor: OUTFIT_COLOR_KEYS,
    hat: HAT_KEYS, bg: BG_KEYS, acc: ACC_KEYS,
  };
  for (let i = 0; i < 100; i++) {
    for (const spec of [avatarSpecFromSeed(`s${i}`), randomAvatarSpec()]) {
      for (const axis of Object.keys(lists) as (keyof AvatarSpec)[]) {
        expect(lists[axis]).toContain(spec[axis]);
      }
    }
  }
});

test('most starting faces wear no hat and no accessory', () => {
  // A random party hat on a staff pass reads as a bug rather than as a choice, so the
  // starting face skews plain — but not always, or the axes would look broken.
  const specs = Array.from({ length: 300 }, (_, i) => avatarSpecFromSeed(`hat-${i}`));
  const hatless = specs.filter((s) => s.hat === 'none').length;
  const bare = specs.filter((s) => s.acc === 'none').length;
  expect(hatless).toBeGreaterThan(150);
  expect(hatless).toBeLessThan(300);
  expect(bare).toBeGreaterThan(120);
  expect(bare).toBeLessThan(300);
});

test('the axis list covers every axis of the spec exactly once', () => {
  // The picker is generated from AVATAR_AXES: an axis missing here is an axis nobody
  // can change, and a duplicate is a row that fights itself.
  const keys = AVATAR_AXES.map((a) => a.key);
  expect(new Set(keys).size).toBe(keys.length);
  expect([...keys].sort()).toEqual(Object.keys(DEFAULT_AVATAR_SPEC).sort());
});
