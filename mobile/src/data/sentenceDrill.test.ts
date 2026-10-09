// STEP 2 문장장 — lesson-fidelity-v46 §R3·R4, 핸드오프 forin-notebook-lesson-sent-live.jsx SENTS.
import {
  buildSheets, hasSheetAnswer, isSheetRight, pieces, sheetLine, shortTitle, step2Drills, subjectBatchim,
  type SheetCard,
} from './sentenceDrill';
import type { LessonNuance, LessonOrder, LessonSentence, LessonWord } from '@/api/client';

const S = (en: string, chunks: string[], words: string[], goal: number, review = false): LessonSentence => ({
  en, ko: `${en}-뜻`, chunks, words, goal, review,
});
const sentences: LessonSentence[] = [
  S('Let me check your wristband.', ['Let me check', 'your wristband', '.'], ['w-band'], 1),
  S('It is for your safety.', ['It is', 'for your safety', '.'], ['w-safe'], 2),
  S('Can you tell me your name?', ['Can you tell me', 'your name', '?'], ['w-name'], 1, true),
  S('Thank you for waiting.', ['Thank you', 'for waiting', '.'], ['w-wait'], 3),
  S('I will be right back.', ['I will be', 'right back', '.'], ['w-back'], 4),
  S('Is it sharp, dull, or burning?', ['Is it sharp', ', dull', ', or burning', '?'], [], 4),
];
const words: LessonWord[] = [
  { id: 'w-band', en: 'wristband', ko: '손목 밴드' }, { id: 'w-safe', en: 'safety', ko: '안전' },
  { id: 'w-name', en: 'name', ko: '이름' }, { id: 'w-wait', en: 'waiting', ko: '기다리다' }, { id: 'w-back', en: 'back', ko: '돌아오다' },
];
const order: LessonOrder = {
  ko: '불만 환자 응대 4문장 순서', why: '공감이 먼저.',
  lines: [
    { en: 'I know it feels repetitive.', icon: 'faceWorried' }, { en: "It's for your safety.", icon: 'shield' },
    { en: 'Can you tell me your name?', icon: 'board' }, { en: 'Thank you.', icon: 'star' },
  ],
};
const kinds = (deck: SheetCard[]) => deck.map((c) => (c.kind === 'order' ? 'order' : c.type));

describe('pieces — 구두점은 앞 조각에 붙는다 (SL:14 "for your safety,", "I forgot.")', () => {
  it('glues a punctuation chunk and a leading comma onto the piece before', () => {
    expect(pieces(sentences[5])).toEqual(['Is it sharp,', 'dull,', 'or burning?']);
    expect(pieces(sentences[0])).toEqual(['Let me check', 'your wristband.']);
  });
  it('joined with spaces, the pieces are the sentence', () => {
    for (const s of sentences) expect(pieces(s).join(' ')).toBe(s.en);
  });
});

describe('buildSheets — 장 수는 문장 수(+순서 배열 1), 유형은 listen·build·blank·listen·order·build 주기 (R4)', () => {
  it('cycles the handoff order, with the order card in its slot', () => {
    const deck = buildSheets(sentences, words, order);
    expect(deck).toHaveLength(sentences.length + 1);
    expect(kinds(deck)).toEqual(['listen', 'build', 'blank', 'listen', 'order', 'build', 'listen']);
  });
  it('brings a review sentence (a word missed in STEP 1) first', () => {
    const deck = buildSheets(sentences, words, order);
    expect(deck[0].kind === 'sentence' && deck[0].sentence.en).toBe('Can you tell me your name?');
  });
  it('without an order card, the order slot falls to the next type (R3)', () => {
    const deck = buildSheets(sentences, words, undefined);
    expect(deck).toHaveLength(sentences.length);
    expect(kinds(deck)).toEqual(['listen', 'build', 'blank', 'listen', 'build', 'listen']);
  });
  it('a sentence without the data for its type gets the next type', () => {
    const one = S('Hello there?', ['Hello there', '?'], [], 1);
    const deck = buildSheets([sentences[0], one, sentences[1]], words, undefined);
    // slot 1 is build, but a one-piece sentence has nothing to build — and no blank: listen.
    expect(kinds(deck)).toEqual(['listen', 'listen', 'build']);
  });
  it('places an order card the cycle never reached at the end', () => {
    const deck = buildSheets(sentences.slice(0, 3), words, order);
    expect(kinds(deck)).toEqual(['listen', 'build', 'blank', 'order']);
  });
});

describe('listen — 들은 문장의 뜻 3지', () => {
  it('uses the authored wrong meanings (distractorsKo)', () => {
    const s = { ...sentences[0], distractorsKo: ['지금 약을 드릴게요', '차트에 기록했어요'] };
    const c = buildSheets([s, sentences[1]], words, undefined)[0];
    expect(c.kind === 'sentence' && c.type === 'listen' && [...c.options].sort()).toEqual([s.ko, ...s.distractorsKo].sort());
  });
  it('falls back to two other meanings from the lesson (R3)', () => {
    const c = buildSheets(sentences, words, undefined).find((x) => x.kind === 'sentence' && x.type === 'listen')!;
    expect(c.kind === 'sentence' && c.options).toHaveLength(3);
    expect(c.kind === 'sentence' && c.options).toContain(c.kind === 'sentence' && c.sentence.ko);
  });
  it('is right on the sentence meaning', () => {
    const c = buildSheets(sentences, words, undefined)[0];
    expect(isSheetRight(c, c.kind === 'sentence' ? c.sentence.ko : null)).toBe(true);
    expect(isSheetRight(c, 'x')).toBe(false);
  });
});

describe('build — 조각 + 디코이 1개, 이으면 en (SL:164)', () => {
  const deck = buildSheets(sentences, words, undefined);
  const c = deck.find((x) => x.kind === 'sentence' && x.type === 'build')!;
  if (c.kind !== 'sentence' || c.type !== 'build') throw new Error('no build');
  it('the pool is the pieces plus exactly one decoy', () => {
    expect(c.pool).toHaveLength(pieces(c.sentence).length + 1);
    for (const p of pieces(c.sentence)) expect(c.pool).toContain(p);
  });
  it('uses the authored decoy when there is one', () => {
    const s = { ...sentences[1], decoy: 'for the doctor' };
    const d = buildSheets([sentences[0], s], words, undefined)[1];
    expect(d.kind === 'sentence' && d.type === 'build' && d.pool).toContain('for the doctor');
  });
  it('is right when the picked pieces (pool indices) join to the sentence', () => {
    const idx = pieces(c.sentence).map((p) => c.pool.indexOf(p));
    expect(isSheetRight(c, idx)).toBe(true);
    expect(isSheetRight(c, [...idx].reverse())).toBe(false);
    expect(hasSheetAnswer(c, [])).toBe(false);
    expect(hasSheetAnswer(c, [idx[0]])).toBe(true);
  });
});

describe('blank — 빈칸 하나와 2×2', () => {
  it('uses the authored blank: en split around the answer, four options with icons', () => {
    const s = {
      ...sentences[2], review: false, en: 'I know it feels repetitive.',
      blank: { answer: 'repetitive', options: [
        { en: 'repetitive', icon: 'compass' }, { en: 'important', icon: 'star' }, { en: 'annoying', icon: 'faceAngry' }, { en: 'quick', icon: 'chartup' }] },
    };
    const c = buildSheets([sentences[0], sentences[1], s], words, undefined)[2];
    if (c.kind !== 'sentence' || c.type !== 'blank') throw new Error('not blank');
    expect([c.before, c.answer, c.after]).toEqual(['I know it feels ', 'repetitive', '.']);
    expect(c.options.map((o) => o.icon)).toEqual(['compass', 'star', 'faceAngry', 'chartup']);
    expect(isSheetRight(c, 'repetitive')).toBe(true);
    expect(isSheetRight(c, 'quick')).toBe(false);
  });
  it('falls back to the runtime blank: the piece holding the taught word, text-only options (R3)', () => {
    const c = buildSheets(sentences, words, undefined)[2];
    if (c.kind !== 'sentence' || c.type !== 'blank') throw new Error('not blank');
    expect(c.before + c.answer + c.after).toBe(c.sentence.en);
    expect(c.options).toHaveLength(4);
    expect(c.options.every((o) => o.icon === undefined)).toBe(true);
    expect(new Set(c.options.map((o) => o.en)).size).toBe(4);
    expect(c.options.map((o) => o.en)).toContain(c.answer);
  });
  it('matches a taught word on a word boundary — "IV" is not in "give"', () => {
    const s = S('I will give the IV now.', ['I will give', 'the IV', 'now', '.'], ['w-iv'], 1);
    const all = [sentences[0], sentences[1], s, sentences[3], sentences[4]];
    const c = buildSheets(all, [{ id: 'w-iv', en: 'IV', ko: '정맥주사' }], undefined)[2];
    expect(c.kind === 'sentence' && c.type === 'blank' && c.answer).toBe('the IV');
  });
});

describe('order — 저작된 4줄, 섞어서 보여 주고 적힌 순서가 정답', () => {
  const c = buildSheets(sentences, words, order).find((x) => x.kind === 'order')!;
  if (c.kind !== 'order') throw new Error('no order');
  it('shows every line once, shuffled (stable)', () => {
    expect([...c.shuffled].sort()).toEqual([0, 1, 2, 3]);
    expect(c.shuffled).not.toEqual([0, 1, 2, 3]);
  });
  it('needs all four, and is right only in the written order', () => {
    expect(hasSheetAnswer(c, [0, 1, 2])).toBe(false);
    expect(isSheetRight(c, [0, 1, 2, 3])).toBe(true);
    expect(isSheetRight(c, [1, 0, 2, 3])).toBe(false);
  });
  it('its explained line is the four lines run together (SL:133)', () => {
    expect(sheetLine(c)).toBe(order.lines.map((l) => l.en).join(' '));
  });
});

describe('step2Drills — 문장장 밖의 STEP 2 화면', () => {
  const nuance: LessonNuance[] = [
    { kind: 'slider', words: [] }, { kind: 'context', words: [], scenes: [{ who: 'a', en: 'x', ok: false }] },
    { kind: 'reel', words: [], word: 'pain', scenes: [{ who: 'a', en: 'pain' }] }, { kind: 'swap', words: [], before: ['a', 'b', 'c'], options: ['b'], answer: 'b' },
    { kind: 'context', words: [], scenes: [] },
  ];
  it('splits reel, context and swap; leaves STEP 1 kinds and empty items out (R3)', () => {
    const d = step2Drills(nuance);
    expect(d.reel?.word).toBe('pain');
    expect(d.context).toHaveLength(1);
    expect(d.swap).toHaveLength(1);
  });
});

describe('shortTitle — 상황 제목의 짧은 이름 (R3 tag 대체)', () => {
  it('drops the persona after the middle dot', () => {
    expect(shortTitle('통증 척도 초기 사정 · Marcus Bell')).toBe('통증 척도 초기 사정');
    expect(shortTitle('반복 신원확인')).toBe('반복 신원확인');
  });
});

describe('subjectBatchim — 영어 낱말 뒤 조사(가/이)', () => {
  it('reads a final m/n/l/ng as a batchim, a vowel-ending sound as none', () => {
    expect(subjectBatchim('pain')).toBe(true);
    expect(subjectBatchim('deteriorate')).toBe(false);
    expect(subjectBatchim('worse')).toBe(false);
    expect(subjectBatchim('swelling')).toBe(true);
  });
});
