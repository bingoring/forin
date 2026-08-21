// Finding a ward by name, instead of walking the building to it.
//
// The career tab opened on a "이어하기" card that the home tab already carries, and the
// only way to reach a specific ward was: pick a building, scroll its floors, tap. With 24
// floors across 5 buildings that is a lot of walking to reach the one place you actually
// work.
//
// Coverage was the other candidate for this space — floors touched, curricula done — and
// it is the wrong shape for this product: a progress bar implies the goal is to fill it,
// and nobody needs the curriculum for a ward they will never be assigned to. Search
// carries the same value whichever ward that is.
import { floorDeptCode, floorPlace } from '@/data/campus';
import type { CurriculumBuilding } from '@/api/client';

export type CampusHit = {
  building: string;
  floor: string;
  place: string;
  where: string;
  code?: string;
  /** Set when the match was a curriculum's name rather than the floor's. */
  curriculum?: string;
};

export type CampusSearch = { hits: CampusHit[]; truncated: number };

const LIMIT = 20;

/** Case- and space-insensitive: "중환자 실" and "ICU" should both find 중환자실. */
function norm(s: string): string {
  return s.toLowerCase().replace(/\s+/g, '');
}

export function searchCampus(buildings: CurriculumBuilding[], query: string): CampusSearch {
  const q = norm(query);
  if (q.length === 0) return { hits: [], truncated: 0 };

  const floorHits: { hit: CampusHit; exact: boolean }[] = [];
  const curriculumHits: CampusHit[] = [];

  for (const b of buildings) {
    for (const f of b.floors) {
      const place = floorPlace(f);
      const code = floorDeptCode(f.curricula);
      const base: CampusHit = { building: b.building, floor: f.floor, place, where: f.curricula[0]?.where ?? f.where, code };

      // The floor itself: its place name, its department code, its building, its number.
      const fields = [place, code ?? '', b.building, f.floor];
      const matched = fields.some((v) => v && norm(v).includes(q));
      if (matched) {
        // A hit whose name STARTS with the query is what the person meant more often than
        // one that merely contains it, so it goes first.
        floorHits.push({ hit: base, exact: norm(place).startsWith(q) || norm(code ?? '') === q });
        continue;
      }

      // Otherwise the curricula on it, one hit each: someone searching 투약 wants the
      // 투약 curricula wherever they are, not the floors that happen to hold them.
      for (const c of f.curricula) {
        if (norm(c.name).includes(q)) curriculumHits.push({ ...base, curriculum: c.name });
      }
    }
  }

  floorHits.sort((a, b) => Number(b.exact) - Number(a.exact));
  const all = [...floorHits.map((x) => x.hit), ...curriculumHits];
  // Capped, and the caller is told by how much — a list that silently stops looks like
  // the search found nothing more.
  return { hits: all.slice(0, LIMIT), truncated: Math.max(0, all.length - LIMIT) };
}
