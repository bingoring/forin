// Campus hub content (v19 handoff screen-campus-hub). Chapters + buildings/floors
// + per-floor department detail. Authored/bundled like the prototype; CTAs carry
// optional scenario ids so "이어하기 / 시작" enter real gameplay where content
// exists. Structured so it can become server-driven later without UI changes.
import { colors } from '@/theme/tokens';

export type StepKind = 'dlg' | 'quiz' | 'event' | 'boss';
export const STEP_META: Record<StepKind, { icon: string; label: string; bg: string }> = {
  dlg: { icon: '💬', label: '대화', bg: colors.blue },
  quiz: { icon: '📝', label: '퀴즈', bg: colors.yellow },
  event: { icon: '⚡', label: '돌발 이벤트', bg: colors.peach },
  boss: { icon: '🏁', label: '챕터 시험', bg: colors.pink },
};

export type ChapterStep = { k: StepKind; n: string; s: 'done' | 'now' | 'lock'; scn?: string };
export type Chapter = {
  ch: number; name: string; dept: string; done: number; total: number;
  state: 'done' | 'now' | 'lock'; next?: string; scn?: string; steps?: ChapterStep[];
};

export const CURRICULUM: Chapter[] = [
  { ch: 1, name: '입사 첫 주 · 기본 소통', dept: '본관 1F 로비 · ER', done: 5, total: 5, state: 'done' },
  {
    ch: 2, name: '응급실 트리아지', dept: '본관 1F 응급의료센터', done: 4, total: 6, state: 'now',
    next: '보호자에게 대기 안내', scn: 'SCN-ER-00002',
    steps: [
      { k: 'dlg', n: '접수 · 주호소 청취', s: 'done' },
      { k: 'quiz', n: '통증 사정 표현', s: 'done' },
      { k: 'dlg', n: 'KTAS 분류 설명', s: 'done' },
      { k: 'event', n: '돌발 · 구급차 2대 동시 도착', s: 'done' },
      { k: 'dlg', n: '보호자에게 대기 안내', s: 'now', scn: 'SCN-ER-00002' },
      { k: 'boss', n: 'SBAR 인계 (챕터 시험)', s: 'lock' },
    ],
  },
  { ch: 3, name: '병동 인계와 투약', dept: '본관 5F 내과 병동', done: 0, total: 7, state: 'lock' },
  { ch: 4, name: '수술 전후 케어', dept: '본관 3F 수술실 · PACU', done: 0, total: 6, state: 'lock' },
  { ch: 5, name: '중환자실 집중 감시', dept: '본관 4F ICU', done: 0, total: 8, state: 'lock' },
];

// `dept` = the primary scenario id prefix (SCN-<dept>-*) for a floor's live
// situations; `cur` = the server curriculum chapter that lives there. Floors with
// no seeded content (e.g. general wards) omit `dept` and read "준비 중".
export type Floor = { f: string; d: string; n: number; hot?: boolean; cur?: number; dept?: string };
export type Building = { id: string; name: string; sub: string; accent: string; icon: string; open?: boolean; floors: Floor[] };

export const BLD: Building[] = [
  {
    id: 'tower', name: '메인 메디컬 타워', sub: '본관 · 9개 과', accent: '#D14B3D', icon: '🏢', open: true,
    floors: [
      { f: '1F', d: '응급의료센터 · 중앙약국', n: 3, hot: true, cur: 2, dept: 'ER' },
      { f: '2F', d: '피부과 센터', n: 1 },
      { f: '3F', d: '수술실 · PACU', n: 2, cur: 4, dept: 'OR' },
      { f: '4F', d: '중앙 중환자실 ICU', n: 2, hot: true, cur: 5, dept: 'ICU' },
      { f: '5-8F', d: '내과 · 외과 · 정형외과 병동', n: 4, cur: 3 },
    ],
  },
  {
    id: 'women', name: '여성소아 센터', sub: '별관 1 · 6개 과', accent: '#C2487E', icon: '🏥',
    floors: [{ f: '1F', d: '소아·산부인과 외래', n: 2, dept: 'WOMENKIDS' }, { f: '3F', d: '분만실 · 산후 · 신생아실', n: 3, dept: 'LD' }, { f: '4-6F', d: 'NICU · PICU', n: 2, dept: 'NICU' }],
  },
  {
    id: 'onco', name: '암센터 · 특수 재활관', sub: '별관 2 · 6개 과', accent: '#1E8A5B', icon: '🌿',
    floors: [{ f: '1F', d: '재활치료실 PT/OT', n: 2, dept: 'REHAB' }, { f: '2F', d: '정신과 폐쇄병동', n: 1, dept: 'PSYCH' }, { f: '3F', d: '종양 · BMT', n: 2, dept: 'ONCO' }, { f: '4F', d: '호스피스 · 노인병동', n: 2, dept: 'HOSPICE' }],
  },
  {
    id: 'dx', name: '외래 · 진단 지원동', sub: '별관 3 · 6개 과', accent: '#0E7490', icon: '🔬',
    floors: [{ f: '1F', d: '영상의학 · 진단검사', n: 2, dept: 'RAD' }, { f: '3F', d: '인공신장실 · 주사센터', n: 2, dept: 'DIAL' }, { f: '4F', d: '내시경 · Cath · IR', n: 1, dept: 'ENDO' }],
  },
  {
    id: 'admin', name: '행정 · 백스테이지 윙', sub: '지원동 · 4개 부서', accent: '#6E6354', icon: '📦',
    floors: [{ f: 'B1', d: '영안실 · 부검실', n: 1, dept: 'MORGUE' }, { f: '1F', d: '중앙공급실 · 영양팀', n: 1, dept: 'SPD' }, { f: '2F', d: '락커 · 휴게실', n: 1, dept: 'LOUNGE' }, { f: '3F', d: '간호부 · 시뮬랩', n: 2, dept: 'SIM' }],
  },
];

export type Situation = { urg: number; name: string; lv: string; min: number; tag: string; room: string; scn?: string };
export type DeptDetail = {
  name: string; en: string; where: string; accent: string; icon: string; lv: string;
  cleared: number; totalSit: number;
  chapterCh?: number; // links to a server curriculum chapter (GET /me/curriculum) by ch number
  deptCode?: string; // scenario id prefix for live situations (GET /me/situations?dept=)
  sits: Situation[]; // bundled fallback when deptCode is unset/offline
};

// The ER department — the fully-authored showcase (v19 prototype DEPT).
const ER_DEPT: DeptDetail = {
  name: '응급의료센터', en: 'Emergency Medical Center', where: '메인 메디컬 타워 · 1F',
  accent: '#D14B3D', icon: '🚨', lv: 'B1', cleared: 7, totalSit: 12,
  chapterCh: 2, // 응급실 트리아지 (server curriculum)
  deptCode: 'ER', // live situations from GET /me/situations?dept=ER
  sits: [
    { urg: 1, name: '흉통 환자 트리아지', lv: 'B1', min: 6, tag: '긴급', room: '분류소', scn: 'SCN-ER-00002' },
    { urg: 0, name: '주취 환자 진정 · 보안 협조', lv: 'B2', min: 7, tag: '신규', room: '소생실', scn: 'SCN-ER-00003' },
    { urg: 0, name: '소아 열경련 부모 안내', lv: 'A2', min: 5, tag: '신규', room: '패스트트랙', scn: 'SCN-ER-00004' },
    { urg: 0, name: '음압 격리실 인계', lv: 'B1', min: 6, tag: '완료', room: '격리실', scn: 'SCN-ER-00005' },
  ],
};

// deptFor resolves a floor tap into a department sheet. The ER floor is fully
// authored; other floors get a light sheet from their floor data (honest 준비 중
// until their content is written) — matching the "one row, one dept" extensibility.
export function deptFor(building: Building, floor: Floor): DeptDetail {
  if (building.id === 'tower' && floor.f === '1F') return ER_DEPT;
  return {
    name: floor.d, en: '', where: `${building.name} · ${floor.f}`,
    accent: building.accent, icon: building.icon, lv: '—',
    cleared: 0, totalSit: floor.n, chapterCh: floor.cur, deptCode: floor.dept, sits: [],
  };
}
