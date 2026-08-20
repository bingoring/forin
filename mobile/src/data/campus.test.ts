import { deptCodeOf, floorDeptCode, INTERIOR_DEPTS } from './campus';

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
