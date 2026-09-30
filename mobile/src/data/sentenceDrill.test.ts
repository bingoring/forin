import { blankOf, buildDrillDeck, chunkPool, isDrillRight, listenOptions, orderAnswer } from './sentenceDrill';
import type { LessonNuance, LessonSentence, LessonWord } from '@/api/client';

const S = (en: string, chunks: string[], words: string[], goal: number, review = false): LessonSentence => ({
  en, ko: `${en}-뜻`, chunks, words, goal, review,
});
const sentences: LessonSentence[] = [
  S('Let me check your wristband.', ['Let me check', 'your wristband', '.'], ['w-band'], 1),
  S('It is for your safety.', ['It is', 'for your safety', '.'], ['w-safe'], 2),
  S('Can you tell me your name?', ['Can you tell me', 'your name', '?'], ['w-name'], 1, true),
  S('Thank you for waiting.', ['Thank you', 'for waiting', '.'], ['w-wait'], 3),
  S('I will be right back.', ['I will be', 'right back', '.'], ['w-back'], 4),
];
const words: LessonWord[] = [
  { id: 'w-band', en: 'wristband', ko: '손목 밴드' }, { id: 'w-safe', en: 'safety', ko: '안전' },
  { id: 'w-name', en: 'name', ko: '이름' }, { id: 'w-wait', en: 'waiting', ko: '기다리다' }, { id: 'w-back', en: 'back', ko: '돌아오다' },
];

describe('buildDrillDeck', () => {
  const nuance: LessonNuance[] = [
    { kind: 'slider', words: ['w-band'] }, // STEP 1 — not here
    { kind: 'context', words: ['w-safe'], scenes: [] },
    { kind: 'reel', words: ['w-band'], word: 'wristband', scenes: [] },
    { kind: 'swap', words: ['w-name'] },
  ];
  const deck = buildDrillDeck(sentences, nuance);
  const kinds = deck.map((c) => (c.kind === 'sentence' ? `${c.type}:${c.sentence.en.slice(0, 5)}` : c.kind));

  it('opens with the reel warm-up', () => expect(kinds[0]).toBe('reel'));
  it('brings a review sentence (a word missed in STEP 1) to the front of the sentences', () => {
    expect(kinds[1]).toMatch(/:Can y/);
  });
  it('rotates listen → chunks → blank over the sentences, and has one order card', () => {
    const sents = deck.filter((c) => c.kind === 'sentence');
    expect(sents).toHaveLength(5);
    expect(sents.slice(0, 3).map((c) => c.kind === 'sentence' && c.type)).toEqual(['listen', 'chunks', 'blank']);
    expect(deck.filter((c) => c.kind === 'order')).toHaveLength(1);
  });
  it('ends with the STEP 2 nuance drills, STEP 1 kinds left out', () => {
    expect(kinds.slice(-2)).toEqual(['context', 'swap']);
    expect(kinds).not.toContain('slider');
  });
  it('skips the order card when there are fewer than 3 goal steps to order', () => {
    const flat = sentences.map((s) => ({ ...s, goal: 1 }));
    expect(buildDrillDeck(flat, []).filter((c) => c.kind === 'order')).toHaveLength(0);
  });
});

describe('chunks — 오답 조각이 섞인 풀, 이으면 en', () => {
  it('holds every chunk of the sentence plus decoys from other sentences', () => {
    const pool = chunkPool(sentences[0], sentences);
    for (const c of sentences[0].chunks.filter((c) => !/^[.,?!]$/.test(c))) expect(pool).toContain(c);
    expect(pool.length).toBeGreaterThan(sentences[0].chunks.filter((c) => !/^[.,?!]$/.test(c)).length);
  });
  it('is right only when the picked chunks join to the sentence', () => {
    const card = { kind: 'sentence' as const, type: 'chunks' as const, sentence: sentences[0] };
    expect(isDrillRight(card, ['Let me check', 'your wristband'])).toBe(true);
    expect(isDrillRight(card, ['your wristband', 'Let me check'])).toBe(false);
  });
});

describe('blank — 가르치는 단어가 든 청크 하나, 정답은 하나', () => {
  it('blanks the chunk that holds the taught word', () => {
    const b = blankOf(sentences[1], sentences, words)!;
    expect(b.answer).toBe('for your safety');
    expect(b.options).toContain('for your safety');
    expect(new Set(b.options).size).toBe(b.options.length);
    expect(b.options.length).toBeGreaterThanOrEqual(3);
  });
});

describe('listen — 들은 문장의 뜻', () => {
  it('offers the sentence meaning and two other meanings from the lesson', () => {
    const opts = listenOptions(sentences[0], sentences);
    expect(opts).toContain(sentences[0].ko);
    expect(opts).toHaveLength(3);
  });
});

describe('order — goal 순서', () => {
  it('puts the chosen sentences in goal order', () => {
    const ans = orderAnswer(sentences);
    const goals = ans.map((en) => sentences.find((s) => s.en === en)!.goal);
    expect([...goals]).toEqual([...goals].sort((a, b) => a - b));
    expect(new Set(goals).size).toBe(goals.length);
  });
});
