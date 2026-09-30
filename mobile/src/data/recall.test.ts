import { buildDeck, isRight, optionsFor, promptType } from './recall';
import type { LessonNuance, LessonWord } from '@/api/client';

const v45 = (id: string, en: string, chips: string[][]): LessonWord => ({
  id, en, ko: `${en}-뜻`, cue: '단서', exKo: '번역', tag: '분류',
  distractorsEn: [`${en}x`, `${en}y`], distractorsKo: ['뜻1', '뜻2'], chips, decoyChips: ['zz'],
});
const v44 = (id: string, en: string): LessonWord => ({ id, en, ko: `${en}-뜻` });

describe('promptType — 유형은 저작하지 않고 돌린다 (결정 8)', () => {
  const w = v45('w-a', 'hypotensive', [['hypo', 'tens', 'ive']]);
  it('rotates pick → fill → listen by position', () => {
    expect([0, 1, 2, 3].map((i) => promptType(w, i))).toEqual(['pick', 'fill', 'listen', 'pick']);
  });
  it('skips fill when there is only one fragment to place', () => {
    expect(promptType(v45('w-g', 'GCS', [['GCS']]), 1)).toBe('listen');
  });
  it('a v44 word (not backfilled) never gets fill — it has no chips', () => {
    expect(promptType(v44('w-b', 'pain'), 1)).toBe('listen');
    expect(promptType(v44('w-b', 'pain'), 0)).toBe('pick');
  });
});

describe('optionsFor — 정답 1 + 오답 2, 순서는 단어마다 고정', () => {
  const pool = [v44('w-1', 'alpha'), v44('w-2', 'beta'), v44('w-3', 'gamma')];
  it('uses the authored look-alikes when there are any', () => {
    const w = v45('w-a', 'hypotensive', [['hypo', 'tens', 'ive']]);
    const opts = optionsFor(w, 'pick', pool);
    expect([...opts].sort()).toEqual(['hypotensive', 'hypotensivex', 'hypotensivey'].sort());
    expect(optionsFor(w, 'listen', pool).sort()).toEqual(['hypotensive-뜻', '뜻1', '뜻2'].sort());
  });
  it('falls back to other words of the lesson for v44 content', () => {
    const opts = optionsFor(v44('w-1', 'alpha'), 'pick', pool);
    expect(opts).toHaveLength(3);
    expect(opts).toContain('alpha');
    expect(new Set(opts).size).toBe(3);
  });
  it('is stable — the same word always shows the same order', () => {
    const w = v45('w-a', 'hypotensive', [['hypo', 'tens', 'ive']]);
    expect(optionsFor(w, 'pick', pool)).toEqual(optionsFor(w, 'pick', pool));
  });
});

describe('isRight', () => {
  const w = v45('w-a', 'en route', [['en'], ['route']]);
  it('fill: the fragments in order, spacing supplied by the app', () => {
    expect(isRight({ kind: 'word', word: w, type: 'fill' }, ['en', 'route'])).toBe(true);
    expect(isRight({ kind: 'word', word: w, type: 'fill' }, ['route', 'en'])).toBe(false);
    expect(isRight({ kind: 'word', word: w, type: 'fill' }, ['en', 'zz'])).toBe(false);
  });
  it('pick / listen', () => {
    expect(isRight({ kind: 'word', word: w, type: 'pick' }, 'en route')).toBe(true);
    expect(isRight({ kind: 'word', word: w, type: 'pick' }, 'en routex')).toBe(false);
    expect(isRight({ kind: 'word', word: w, type: 'listen' }, 'en route-뜻')).toBe(true);
  });
  it('slider and pair', () => {
    const slider: LessonNuance = { kind: 'slider', words: [], scale: ['a', 'b', 'c'], answerAt: 0 };
    expect(isRight({ kind: 'nuance', item: slider }, 0)).toBe(true);
    expect(isRight({ kind: 'nuance', item: slider }, 2)).toBe(false);
    const pair: LessonNuance = { kind: 'pair', words: [], pairs: [['a', 'b'], ['c', 'd']], decoys: ['e'] };
    expect(isRight({ kind: 'nuance', item: pair }, { a: 'b', c: 'd' })).toBe(true);
    expect(isRight({ kind: 'nuance', item: pair }, { a: 'd', c: 'b' })).toBe(false);
  });
});

describe('buildDeck — 단어 뒤에 STEP 1 뉘앙스', () => {
  it('puts the words first, then slider/pair, and leaves STEP 2 kinds out', () => {
    const words = [v45('w-a', 'aa', [['a', 'a']]), v44('w-b', 'bb')];
    const nuance: LessonNuance[] = [
      { kind: 'swap', words: ['w-a'] },
      { kind: 'pair', words: ['w-a'], pairs: [['a', 'b'], ['c', 'd']], decoys: ['e'] },
      { kind: 'slider', words: ['w-b'], scale: ['x', 'y', 'z'], answerAt: 1 },
      { kind: 'reel', words: ['w-a'] },
    ];
    const deck = buildDeck(words, nuance);
    expect(deck.map((c) => (c.kind === 'word' ? c.word.id : c.item.kind))).toEqual(['w-a', 'w-b', 'pair', 'slider']);
  });
});
