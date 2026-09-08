import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { deptCodeOf, deptNbIcon, floorDeptCode, floorPlace, INTERIOR_DEPTS } from './campus';

test('floorPlace strips the building/floor prefix and any leftover separator', () => {
  // Korean, space-separated → clean place.
  expect(floorPlace({ floor: '8F', where: '본관 8F 일반 내과 병동', curricula: [{ where: '본관 8F 일반 내과 병동' }] })).toBe('일반 내과 병동');
  // English headings use a middot separator; the leading "· " must not survive.
  expect(floorPlace({ floor: '1F', where: 'Main 1F · Emergency Centre', curricula: [{ where: 'Main 1F · Emergency Centre' }] })).toBe('Emergency Centre');
  // 본관's authored floors carry the middot in Korean too.
  expect(floorPlace({ floor: '1F', where: '본관 1F · 응급의료센터', curricula: [{ where: '본관 1F · 응급의료센터' }] })).toBe('응급의료센터');
});

test('deptCodeOf pulls the bank out of a content id', () => {
  expect(deptCodeOf('SCN-WARD-00101')).toBe('WARD');
  expect(deptCodeOf('QZ-ER-00002')).toBe('ER');
  expect(deptCodeOf('nonsense')).toBeUndefined();
  expect(deptCodeOf(undefined)).toBeUndefined();
});

// The bug this exists for: 본관 1F opens with the authored orientation scenarios, so
// reading the FIRST step's code answered "ORIENT" — a bank that does not exist — and
// the floor's situation list came back empty while all 23 other floors worked. Nobody
// noticed because the other 23 happen to start with their own department.
test('a floor whose first steps are orientation still resolves to its department', () => {
  const floor = [
    { steps: [{ scenarioId: 'SCN-ORIENT-00001' }, { scenarioId: 'SCN-ORIENT-00002' }, { scenarioId: 'SCN-ORIENT-00003' }] },
    { steps: [{ scenarioId: 'SCN-ER-00002' }, { scenarioId: 'QZ-ER-00002' }, { scenarioId: 'SCN-ER-00010' }, { scenarioId: 'SCN-ER-00013' }, { scenarioId: 'SCN-ER-00001' }] },
    { steps: [{ scenarioId: 'SCN-ER-00006' }, { scenarioId: 'SCN-ER-00005' }, { scenarioId: 'SCN-ER-00014' }] },
  ];
  expect(floorDeptCode(floor)).toBe('ER');
  // And the resolved code must be one the app can actually walk into, or the sheet's
  // walk button points at a route that can only error.
  expect(INTERIOR_DEPTS.has(floorDeptCode(floor)!)).toBe(true);
});

test('a single-department floor resolves to it', () => {
  expect(floorDeptCode([{ steps: [{ scenarioId: 'SCN-WARD-00101' }, { scenarioId: 'QZ-WARD-00104' }] }])).toBe('WARD');
});

// Two-department floors exist (별관 1 3F is 분만실 + 신생아실). Whichever wins, it must
// win consistently — a code that flips between renders would swap the situation list
// under the reader.
test('a two-department floor answers the same way every time', () => {
  const floor = [
    { steps: [{ scenarioId: 'SCN-LD-00108' }, { scenarioId: 'SCN-LD-00103' }] },
    { steps: [{ scenarioId: 'SCN-NURSERY-00101' }, { scenarioId: 'SCN-NURSERY-00108' }] },
  ];
  const first = floorDeptCode(floor);
  expect(first).toBeDefined();
  for (let i = 0; i < 5; i++) expect(floorDeptCode(floor)).toBe(first);
});

test('a floor with no steps resolves to nothing rather than a wrong guess', () => {
  expect(floorDeptCode([])).toBeUndefined();
  expect(floorDeptCode([{ steps: [] }, { }])).toBeUndefined();
});

// The 모범답안 목록 (design-handoff v40 · 리뷰랩 C) leads each row with the
// department's doodle. These four anchors are what the handoff draws, so they are
// pinned: a remap that quietly sent the ER to the pill icon would still pass "it
// resolves".
test('deptNbIcon draws the handoff’s department doodles', () => {
  expect(deptNbIcon('SCN-ER-00101')).toBe('siren');
  expect(deptNbIcon('SCN-ICU-00001')).toBe('monitor');
  expect(deptNbIcon('SCN-LD-00108')).toBe('baby');
  expect(deptNbIcon('SCN-PHARMA-00101')).toBe('pill');
});

// A missing or malformed id must land on the stethoscope, never a blank slot: the row
// still belongs to the learner even when the scenario left the served content set.
test('deptNbIcon falls back to the stethoscope, not an empty icon', () => {
  expect(deptNbIcon('nonsense')).toBe('stetho');
  expect(deptNbIcon(undefined)).toBe('stetho');
  expect(deptNbIcon('SCN-MADEUPDEPT-00001')).toBe('stetho');
});

// Every department that actually ships scenarios must resolve to a doodle. A new bank
// added to the content set without a mapping is exactly what this catches — it lands on
// the stethoscope by design, but the scan proves the call is total (never throws, never
// blank) across the whole real dept vocabulary.
test('every department in the content set resolves to a doodle', () => {
  const dir = join(__dirname, '..', '..', '..', 'server', 'content', 'nurse', 'scenarios');
  const codes = new Set<string>();
  for (const f of readdirSync(dir)) {
    if (!f.endsWith('.yaml') && !f.endsWith('.yml')) continue;
    for (const m of readFileSync(join(dir, f), 'utf8').matchAll(/id:\s*(SCN-[A-Z0-9]+-\d+)/g)) {
      const code = deptCodeOf(m[1]);
      if (code) codes.add(code);
    }
  }
  expect(codes.size).toBeGreaterThan(10);
  for (const code of codes) {
    const icon = deptNbIcon(`SCN-${code}-00001`);
    expect(typeof icon).toBe('string');
    expect(icon.length).toBeGreaterThan(0);
  }
});
