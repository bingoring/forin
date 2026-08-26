// Building lists draw a SYMBOL, never a building.
//
// v25 02_COMPONENTS: "건물·층 목록에서는 건물 외형이 아니라 그 건물을 대표하는
// 상징물(물건) 아이콘을 쓴다. 건물형 아이콘(tower/women/onco/clinic/admin/dx)은
// FICONS에 보존되어 있으나 목록에서는 미사용."
//
// The reason is legibility: five near-identical building silhouettes at 16px tell
// the reader nothing, while a stethoscope, a baby, an IV bag, a magnifier and a
// gear each say what happens inside. The building-shaped icons still exist for
// other uses (the campus tab's own tab icon is one), so nothing stops someone
// putting them back here — hence this test.
import { BUILDING_STYLE, DEFAULT_BUILDING_STYLE } from './campus';
import { FICONS } from '@/theme/ficons';

/** The icons v25 keeps but bars from lists. */
const BUILDING_SHAPES = ['tower', 'women', 'onco', 'clinic', 'admin', 'dx', 'home'];

test('every building icon exists in the icon set', () => {
  const styles = [...Object.values(BUILDING_STYLE), DEFAULT_BUILDING_STYLE];
  expect(styles.length).toBeGreaterThan(5);
  expect(styles.filter((s) => !FICONS[s.icon]).map((s) => s.icon)).toEqual([]);
});

test('no building icon is a building', () => {
  const offenders = Object.entries(BUILDING_STYLE)
    .filter(([, s]) => BUILDING_SHAPES.includes(s.icon))
    .map(([name, s]) => `${name} → ${s.icon}`);
  expect(offenders).toEqual([]);
  expect(BUILDING_SHAPES).not.toContain(DEFAULT_BUILDING_STYLE.icon);
});

test('each building carries the symbol v25 assigns it', () => {
  // Spelled out, because "not a building" alone would pass with all five identical.
  expect(BUILDING_STYLE['본관'].icon).toBe('stetho');       // 청진기
  expect(BUILDING_STYLE['별관 1'].icon).toBe('baby');        // 여성소아 — 아기 얼굴
  expect(BUILDING_STYLE['별관 2'].icon).toBe('ivbag');       // 암센터·재활 — 수액백 (리본 폐기)
  expect(BUILDING_STYLE['별관 3'].icon).toBe('magnify');     // 외래·진단 — 원형 렌즈
  expect(BUILDING_STYLE['지원동'].icon).toBe('gear');        // 행정·백스테이지 — 8치 톱니
});

test('the five symbols are all different', () => {
  const icons = Object.values(BUILDING_STYLE).map((s) => s.icon);
  expect(new Set(icons).size).toBe(icons.length);
});
