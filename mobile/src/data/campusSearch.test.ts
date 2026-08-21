import { searchCampus } from '@/data/campusSearch';
import type { CurriculumBuilding } from '@/api/client';

const cur = (name: string, where: string, ids: string[]) => ({
  key: name, name, building: where.split(' ')[0], floor: where.split(' ')[1], where,
  done: 0, total: ids.length, state: 'todo' as const,
  steps: ids.map((id) => ({ scenarioId: id, name: id, state: 'todo' as const, kind: 'dlg' as const })),
});

const BUILDINGS = [
  {
    building: '본관',
    floors: [
      { floor: '1F', where: '본관 1F 응급의료센터', curricula: [cur('첫 출근 · 인계받기', '본관 1F 응급의료센터', ['SCN-ORIENT-00001', 'SCN-ER-00001', 'SCN-ER-00002'])] },
      { floor: '5F', where: '본관 5F 중환자실', curricula: [cur('중환자 투약', '본관 5F 중환자실', ['SCN-ICU-00001', 'SCN-ICU-00002'])] },
    ],
  },
  {
    building: '여성의료',
    floors: [
      { floor: '3F', where: '여성의료 3F 분만실', curricula: [cur('분만 투약', '여성의료 3F 분만실', ['SCN-LD-00001'])] },
    ],
  },
] as unknown as CurriculumBuilding[];

test('an empty query searches for nothing rather than everything', () => {
  // A results list that appears fully populated before anything is typed hides the tab.
  expect(searchCampus(BUILDINGS, '')).toEqual({ hits: [], truncated: 0 });
  expect(searchCampus(BUILDINGS, '   ').hits).toEqual([]);
});

test('finds a ward by its Korean name, ignoring spaces', () => {
  expect(searchCampus(BUILDINGS, '중환자').hits.map((h) => h.place)).toEqual(['중환자실']);
  expect(searchCampus(BUILDINGS, '중환자 실').hits.map((h) => h.place)).toEqual(['중환자실']);
});

test('finds a ward by its department code, in either case', () => {
  // The code comes from the floor's own steps, so ICU is findable without the server
  // sending a department name at all.
  expect(searchCampus(BUILDINGS, 'ICU').hits.map((h) => h.place)).toEqual(['중환자실']);
  expect(searchCampus(BUILDINGS, 'icu').hits.map((h) => h.place)).toEqual(['중환자실']);
});

test('a floor whose first step is an outlier is still found by its real department', () => {
  // 본관 1F opens with the orientation scenarios; its department is ER, which is where
  // most of its steps come from. Searching ORIENT must not be what finds it.
  expect(searchCampus(BUILDINGS, 'ER').hits.map((h) => h.place)).toEqual(['응급의료센터']);
  expect(searchCampus(BUILDINGS, 'ORIENT').hits).toEqual([]);
});

test('curriculum names match across floors, one hit each', () => {
  const hits = searchCampus(BUILDINGS, '투약').hits;
  expect(hits.map((h) => `${h.place}/${h.curriculum}`)).toEqual(['중환자실/중환자 투약', '분만실/분만 투약']);
});

test('a floor match wins over its own curricula', () => {
  // Searching 분만 must return the floor once, not the floor AND the curriculum on it.
  expect(searchCampus(BUILDINGS, '분만').hits).toHaveLength(1);
  expect(searchCampus(BUILDINGS, '분만').hits[0].curriculum).toBeUndefined();
});

test('names that start with the query come before names that merely contain it', () => {
  const wide = [
    { building: '본관', floors: [
      { floor: '2F', where: '본관 2F 소아중환자실', curricula: [cur('a', '본관 2F 소아중환자실', ['SCN-PICU-00001'])] },
      { floor: '5F', where: '본관 5F 중환자실', curricula: [cur('b', '본관 5F 중환자실', ['SCN-ICU-00001'])] },
    ] },
  ] as unknown as CurriculumBuilding[];
  expect(searchCampus(wide, '중환자').hits.map((h) => h.place)).toEqual(['중환자실', '소아중환자실']);
});

test('reports how much it dropped instead of stopping silently', () => {
  const many = [
    {
      building: '본관',
      floors: Array.from({ length: 25 }, (_, i) => ({
        floor: `${i + 1}F`,
        where: `본관 ${i + 1}F 병동${i}`,
        curricula: [cur('c', `본관 ${i + 1}F 병동${i}`, ['SCN-X-00001'])],
      })),
    },
  ] as unknown as CurriculumBuilding[];
  const r = searchCampus(many, '병동');
  expect(r.hits).toHaveLength(20);
  expect(r.truncated).toBe(5);
});
