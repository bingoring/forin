import { regionAt, RegionLike } from './regions';

const regions: RegionLike[] = [
  { id: 'triage', name: '트리아지', bounds: { x: 1, y: 1, w: 10, h: 8 } },
  { id: 'trauma', name: '트라우마 룸', bounds: { x: 12, y: 1, w: 11, h: 8 } },
];

describe('regionAt', () => {
  test('returns the region containing the coordinate', () => {
    expect(regionAt({ x: 4, y: 4 }, regions)?.id).toBe('triage');
    expect(regionAt({ x: 17, y: 4 }, regions)?.id).toBe('trauma');
  });

  test('returns null in the gap / corridor', () => {
    expect(regionAt({ x: 11, y: 4 }, regions)).toBeNull(); // between the two
    expect(regionAt({ x: 12, y: 15 }, regions)).toBeNull(); // below the rooms
  });
});
