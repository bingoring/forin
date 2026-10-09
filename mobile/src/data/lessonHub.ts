// The situation hub's words, built from GET /me/lesson (lesson-fidelity-v46 T6; handoff
// forin-notebook-lesson.jsx LessonHub).
import type { LessonCourse, ScenarioReward } from '@/api/client';

/** L110 — `ER · 투약 안전 · 오류 예방 · 3/34`: the theme's department, the theme, and where this
 *  situation sits in it. Without a coordinate (a situation in no theme), the briefing's
 *  department line, as before. */
export function hubSubtitle(course: LessonCourse | undefined, dept: string | undefined): string {
  if (!course) return dept ?? '';
  return [course.dept, course.theme, `${course.index}/${course.total}`].filter(Boolean).join(' · ');
}

/** L131 — `+60 XP`. Content writes the reward as `+ 120 XP`, `+60XP`, …; the chip writes it
 *  one way: the sign against the number, one space, XP. */
export function xpLabel(rewards: ScenarioReward[] | undefined): string {
  const v = rewards?.find((r) => /xp/i.test(r.value))?.value;
  const n = v?.match(/([+-]?)\s*(\d+)/);
  return n ? `${n[1] || '+'}${n[2]} XP` : '';
}

/** L126 — briefing.line carries one `[[highlighted]]` span (server content/hubline.go). Null
 *  when there is no line or it is not exactly one non-blank span; the hub then writes the
 *  brief unmarked (§R3). */
export function hubLine(line: string | undefined): { before: string; mark: string; after: string } | null {
  if (!line) return null;
  const m = /^([^[\]]*)\[\[([^[\]]+)\]\]([^[\]]*)$/.exec(line);
  if (!m || !m[2].trim()) return null;
  return { before: m[1], mark: m[2], after: m[3] };
}
