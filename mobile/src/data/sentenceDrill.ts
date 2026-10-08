// STEP 2 문장의 규칙 — lesson-fidelity-v46 (Build Spec §D·§R3·§R4·§L).
//
// 정본(R1): design-handoff_v46/reference/forin-notebook-lesson-sent-live.jsx (SL)
//   SL:12-19   SENTS — 장마다 type·tag·icon·why와 유형별 재료(opts · chunks/pool · before/answer/after/opts · lines/shuffled)
//   SL:160-168 정답 판정 — listen: 뜻 같음 · build: 이은 문자열 == en · blank: 답 같음 · order: 적힌 순서
//
// STEP 2는 화면 여럿이다(결정 2): 릴(C0) → 문장장(이 파일의 buildSheets) → C5 → C6 → 완료(C').
// 문장장의 장 수는 상황의 문장 수(+순서 배열 카드 1)이고(결정 9, V6), 유형은 핸드오프 순서
// listen·build·blank·listen·order·build를 주기로 돌린다. 그 문장에 그 유형의 재료가 없으면 다음
// 유형으로(R4). 저작 필드가 없으면 같은 상황의 다른 문장에서 재료를 만든다(R3) — 지어낸 문구는 없다.
import type { LessonBlank, LessonDetail, LessonNuance, LessonOrder, LessonSentence, LessonWord } from '@/api/client';
import { stableShuffle } from './recall';

export type SheetType = 'listen' | 'build' | 'blank' | 'order';

/** One sheet of the sentence pad, with everything its prompt shows worked out up front. */
export type SheetCard =
  | { kind: 'sentence'; type: 'listen'; sentence: LessonSentence; options: string[] }
  | { kind: 'sentence'; type: 'build'; sentence: LessonSentence; pool: string[] }
  | {
    kind: 'sentence'; type: 'blank'; sentence: LessonSentence;
    before: string; answer: string; after: string;
    /** `icon` only when authored (SL:15); the runtime blank is text-only (R3). */
    options: { en: string; icon?: string }[];
  }
  | { kind: 'order'; order: LessonOrder; shuffled: number[] };

/** listen: the picked meaning · build: pool indices in order · blank: the picked option · order: line indices in order. */
export type SheetAnswer = string | number[];

/** SL:13-18 — the handoff's six sheets, in order. */
const CYCLE: SheetType[] = ['listen', 'build', 'blank', 'listen', 'order', 'build'];
const PUNCT = /^([.,?!]+)\s*(.*)$/;
const TRAIL = /[.,?!]+$/;
const escapeRe = (x: string) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const unique = (xs: string[]) => [...new Set(xs)];
const norm = (s: string) => s.replace(/\s+/g, ' ').trim();

/**
 * The pieces a learner places. The content keeps punctuation as its own chunk or at the
 * head of the next one (", how would you rate"); the handoff glues it to the end of the
 * piece before ("for your safety,", "I forgot." — SL:14), so the pieces joined with single
 * spaces ARE the sentence and the check is a plain string compare (SL:164).
 */
export function pieces(s: LessonSentence): string[] {
  const out: string[] = [];
  for (const raw of s.chunks) {
    const c = raw.trim();
    const m = PUNCT.exec(c);
    if (m && out.length > 0) {
      out[out.length - 1] += m[1];
      if (m[2]) out.push(m[2]);
    } else if (c) out.push(c);
  }
  return out;
}

/** A piece of another sentence, as a wrong option: its trailing punctuation would give it away. */
const bare = (p: string) => p.replace(TRAIL, '');

function othersPieces(s: LessonSentence, all: LessonSentence[]): string[] {
  const own = new Set(pieces(s).map(bare));
  return unique(all.filter((o) => o.en !== s.en).flatMap(pieces).map(bare).filter((p) => p && !own.has(p)));
}

function listenOptions(s: LessonSentence, all: LessonSentence[]): string[] | null {
  let wrong = (s.distractorsKo ?? []).filter((k) => k && k !== s.ko);
  if (wrong.length < 2) {
    const others = stableShuffle(all.filter((o) => o.ko !== s.ko).map((o) => o.ko), `${s.en}|listen`);
    wrong = unique([...wrong, ...others]).slice(0, 2);
  }
  if (wrong.length < 2) return null;
  return stableShuffle([s.ko, ...wrong.slice(0, 2)], `${s.en}|listenopts`);
}

function buildPool(s: LessonSentence, all: LessonSentence[]): string[] | null {
  const own = pieces(s);
  if (own.length < 2) return null;
  const decoy = s.decoy?.trim() || stableShuffle(othersPieces(s, all), `${s.en}|decoy`)[0];
  if (!decoy) return null;
  return stableShuffle([...own, decoy], `${s.en}|pool`);
}

function authoredBlank(s: LessonSentence, b: LessonBlank) {
  const m = new RegExp(`\\b${escapeRe(b.answer)}\\b`).exec(s.en);
  if (!m || b.options.length !== 4) return null;
  return {
    before: s.en.slice(0, m.index), answer: b.answer, after: s.en.slice(m.index + b.answer.length),
    options: b.options.map((o) => ({ en: o.en, icon: o.icon })),
  };
}

/**
 * The runtime blank (R3): the piece holding a word the sentence teaches (on a word
 * boundary — "IV" is not in "give"), or the last piece; the wrong options are three
 * pieces of other sentences. Positions come from the pieces, not a search of `en` — the
 * same text can occur earlier.
 */
function runtimeBlank(s: LessonSentence, all: LessonSentence[], words: LessonWord[]) {
  const ps = pieces(s);
  if (ps.length < 2) return null;
  const taught = words.filter((w) => s.words.includes(w.id)).map((w) => new RegExp(`\\b${escapeRe(w.en)}`, 'i'));
  let k = ps.findIndex((p) => taught.some((re) => re.test(p)));
  if (k < 0) k = ps.length - 1;
  const answer = bare(ps[k]);
  const before = ps.slice(0, k).map((p) => `${p} `).join('');
  const after = ps[k].slice(answer.length) + ps.slice(k + 1).map((p) => ` ${p}`).join('');
  const wrong = stableShuffle(othersPieces(s, all).filter((p) => p !== answer), `${s.en}|blank`).slice(0, 3);
  if (wrong.length < 3) return null;
  return { before, answer, after, options: stableShuffle([answer, ...wrong], `${s.en}|blankopts`).map((en) => ({ en })) };
}

function sheetFor(type: Exclude<SheetType, 'order'>, s: LessonSentence, all: LessonSentence[], words: LessonWord[]): SheetCard | null {
  if (type === 'listen') {
    const options = listenOptions(s, all);
    return options && { kind: 'sentence', type, sentence: s, options };
  }
  if (type === 'build') {
    const pool = buildPool(s, all);
    return pool && { kind: 'sentence', type, sentence: s, pool };
  }
  const b = (s.blank && authoredBlank(s, s.blank)) || runtimeBlank(s, all, words);
  return b && { kind: 'sentence', type, sentence: s, ...b };
}

/** Never the written order itself — a shuffle that changed nothing would be no prompt. */
function shuffleLines(o: LessonOrder): number[] {
  const idx = o.lines.map((_, i) => i);
  const sh = stableShuffle(idx, `${o.ko}|order`);
  return sh.every((v, i) => v === i) ? [...sh.slice(1), sh[0]] : sh;
}

export function buildSheets(sentences: LessonSentence[], words: LessonWord[], order: LessonOrder | undefined): SheetCard[] {
  const ordered = [...sentences.filter((s) => s.review), ...sentences.filter((s) => !s.review)];
  const deck: SheetCard[] = [];
  const hasOrder = !!order && order.lines.length === 4;
  let placed = false;
  let pos = 0;
  for (const s of ordered) {
    let card: SheetCard | null = null;
    for (let tries = 0; tries < CYCLE.length * 2 && !card; tries++) {
      const t = CYCLE[pos++ % CYCLE.length];
      if (t === 'order') {
        if (hasOrder && !placed) {
          deck.push({ kind: 'order', order: order!, shuffled: shuffleLines(order!) });
          placed = true;
        }
        continue;
      }
      card = sheetFor(t, s, sentences, words);
    }
    // A lesson of one sentence has no wrong meanings to offer; it is still a sheet.
    deck.push(card ?? { kind: 'sentence', type: 'listen', sentence: s, options: [s.ko] });
  }
  if (hasOrder && !placed) deck.push({ kind: 'order', order: order!, shuffled: shuffleLines(order!) });
  return deck;
}

export function hasSheetAnswer(card: SheetCard, answer: SheetAnswer | null): boolean {
  if (answer == null) return false;
  if (card.kind === 'order') return Array.isArray(answer) && answer.length === card.order.lines.length;
  return Array.isArray(answer) ? answer.length > 0 : true;
}

export function isSheetRight(card: SheetCard, answer: SheetAnswer | null): boolean {
  if (answer == null) return false;
  if (card.kind === 'order') return Array.isArray(answer) && answer.length === card.order.lines.length && answer.every((v, k) => v === k);
  switch (card.type) {
    case 'listen': return answer === card.sentence.ko;
    case 'blank': return answer === card.answer;
    case 'build': return Array.isArray(answer) && norm(answer.map((i) => card.pool[i]).join(' ')) === norm(card.sentence.en);
  }
}

/** The line the explanation shows and reads aloud (SL:133): the sentence, or the order card's lines run together. */
export const sheetLine = (card: SheetCard) => (card.kind === 'order' ? card.order.lines.map((l) => l.en).join(' ') : card.sentence.en);
/** The meaning under it (SL:134). */
export const sheetKo = (card: SheetCard) => (card.kind === 'order' ? card.order.ko : card.sentence.ko);
/** The "왜?" note (SL:137) — absent → no box (R3). */
export const sheetWhy = (card: SheetCard) => (card.kind === 'order' ? card.order.why : card.sentence.why);

/** The STEP 2 screens outside the sheet pad, in the order they run (§L). Items with nothing to
 *  show are left out — their screen is skipped (R3). */
export function step2Drills(nuance: LessonNuance[]): { reel?: LessonNuance; context: LessonNuance[]; swap: LessonNuance[] } {
  const reel = nuance.find((n) => n.kind === 'reel' && (n.scenes ?? []).length > 0);
  return {
    reel,
    context: nuance.filter((n) => n.kind === 'context' && (n.scenes ?? []).some((s) => s.ok === false)),
    swap: nuance.filter((n) => n.kind === 'swap' && (n.before ?? []).length === 3 && (n.options ?? []).length > 0 && !!n.answer),
  };
}

export type Step2Phase =
  | { kind: 'reel'; item: LessonNuance }
  | { kind: 'sheets' }
  | { kind: 'context'; item: LessonNuance; k: number }
  | { kind: 'swap'; item: LessonNuance; k: number }
  | { kind: 'done' };

/** §L: the screens this situation has, in artboard order. */
export function step2Phases(lesson: LessonDetail): Step2Phase[] {
  const d = step2Drills(lesson.nuance ?? []);
  const drills = [...d.context.map((item) => ({ kind: 'context' as const, item })), ...d.swap.map((item) => ({ kind: 'swap' as const, item }))];
  return [
    ...(d.reel ? [{ kind: 'reel' as const, item: d.reel }] : []),
    ...(lesson.sentences.length ? [{ kind: 'sheets' as const }] : []),
    ...drills.map((x, k) => ({ ...x, k })),
    { kind: 'done' as const },
  ];
}

/** The context scene that does not fit (ok: false). */
export const contextAnswer = (n: LessonNuance) => (n.scenes ?? []).findIndex((sc) => sc.ok === false);

/** R3: the tag fallback — the situation's name without the persona ("통증 척도 초기 사정 · Marcus Bell"). */
export const shortTitle = (title: string) => title.split(' · ')[0].trim();

/**
 * Whether an English word, read in Korean, ends on a 받침 — which picks the subject particle
 * after it in the C5 title ("deteriorate가", "pain이"). English spelling is a rough guide:
 * a final m, n, l or ng is read as one; anything else ends on a vowel (worse 워스, check 체크).
 */
export function subjectBatchim(word: string): boolean {
  const w = word.trim().toLowerCase().replace(/[^a-z]+$/, '');
  return /ng$/.test(w) || /[mnl]$/.test(w);
}
