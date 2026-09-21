import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { deptCodeOf, deptNbIcon } from './campus';

test('deptCodeOf pulls the bank out of a content id', () => {
  expect(deptCodeOf('SCN-WARD-00101')).toBe('WARD');
  expect(deptCodeOf('QZ-ER-00002')).toBe('ER');
  expect(deptCodeOf('nonsense')).toBeUndefined();
  expect(deptCodeOf(undefined)).toBeUndefined();
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
