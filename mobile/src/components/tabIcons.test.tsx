// The five bottom-nav icons must be the v23+ artwork, in both tab states.
//
// This is the test that was missing. The adoption pass scanned <PixelIcon> call
// sites and reported the tab bar as converted because ONE tab used PixelIcon; the
// other four drew their own SVG in this file, which no scan looked at. The most-seen
// icons in the app were the last ones still on the retired set, and the audit said
// otherwise.
import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { readFileSync } from 'fs';
import { join } from 'path';
import { BoardIcon, CampusIcon, HomeIcon, LabIcon, MeIcon } from './TabIcons';
import { colors } from '@/theme/tokens';
import { trackMounts } from '../testing/mountRegistry';

/** Unmounts every tree this file mounts — see mountRegistry for why. */
const track = trackMounts();

function draw(node: React.ReactElement): ReactTestInstance {
  let tree!: ReturnType<typeof create>;
  act(() => { tree = track(create(node)); });
  return tree.root;
}

/** FIcon draws <Rect>s; the retired line set drew <Path>/<Circle>. */
function isFIcon(root: ReactTestInstance): boolean {
  const rects = root.findAll((n) => String(n.type) === 'RNSVGRect', { deep: true }).length;
  const paths = root.findAll((n) => ['RNSVGPath', 'RNSVGCircle'].includes(String(n.type)), { deep: true }).length;
  return rects > 0 && paths === 0;
}

function opacityOf(root: ReactTestInstance): number {
  for (const v of root.findAll((n) => String(n.type) === 'View', { deep: true })) {
    const style = [v.props.style].flat(Infinity).filter(Boolean) as Record<string, number>[];
    const o = style.map((s) => s.opacity).find((x) => typeof x === 'number');
    if (o !== undefined) return o;
  }
  return 1;
}

const TABS = { HomeIcon, CampusIcon, BoardIcon, LabIcon, MeIcon };

describe('every tab draws the FIcon artwork', () => {
  for (const [name, Icon] of Object.entries(TABS)) {
    test(`${name} — active`, () => {
      expect(isFIcon(draw(<Icon color={colors.ink} size={22} />))).toBe(true);
    });
    test(`${name} — inactive is the same artwork, dimmed`, () => {
      const t = draw(<Icon color={colors.textFaint} size={22} />);
      expect(isFIcon(t)).toBe(true);
      expect(opacityOf(t)).toBeLessThan(1);
    });
  }
});

test('the tab bar draws all five tabs from ONE icon set', () => {
  // A tab reverting to its own SVG, or to a PixelIcon, is exactly how this broke the first
  // time — so the layout is checked for it.
  //
  // The set itself changed with v29: the bar is the 근무 수첩 line now, so the icons are
  // NbIcon doodles rather than the FIcon pixels this file's components wrap. What has to
  // hold is unchanged — five tabs, one set, no hand-drawn one-offs.
  const src = readFileSync(join(__dirname, '..', 'app', '(tabs)', '_layout.tsx'), 'utf8');
  const named: string[] = [];
  for (const route of ['index', 'campus', 'board', 'lab', 'me']) {
    expect(src).toContain(`tabIcon('${route}')`);
    const m = src.match(new RegExp(`${route}: '([a-z2]+)'`));
    expect(m).toBeTruthy();
    named.push(m![1]);
  }
  // Five DIFFERENT icons. Checking only that each route names one let a copy-paste give
  // the whole bar the same drawing, which is a bar you cannot read at a glance.
  expect(new Set(named).size).toBe(5);
  expect(src).not.toMatch(/<PixelIcon/);
  expect(src).not.toMatch(/from 'react-native-svg'/);
});

test('this file no longer hand-draws icons', () => {
  const src = readFileSync(join(__dirname, 'TabIcons.tsx'), 'utf8');
  expect(src).not.toMatch(/from 'react-native-svg'/);
  expect(src).toMatch(/from '\.\/FIcon'/);
});
