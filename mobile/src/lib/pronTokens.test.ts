import { splitTargetTokens, syllableBand, matchPhonemesToSyllables } from './pronTokens';

// ── splitTargetTokens — verbatim from task-7-brief.md Step 1 ──────────────
describe('splitTargetTokens', () => {
  test('숫자+단위를 하나의 num 토큰으로 묶는다', () => {
    const t = splitTargetTokens("I'm giving you 650 milligrams now.", ['acetaminophen']);
    expect(t.find((x) => x.hi === 'num')?.w).toBe('650 milligrams');
  });

  test('약물명은 drug 로 표시된다', () => {
    const t = splitTargetTokens('Give acetaminophen now.', ['acetaminophen']);
    expect(t.find((x) => x.hi === 'drug')?.w).toBe('acetaminophen');
  });

  // 하이라이트가 하나도 없는 평문도 정상 — 빈 배열이 아니라 통짜 토큰 하나.
  test('매칭이 없으면 평문 한 덩어리', () => {
    const t = splitTargetTokens('Please sit up.', []);
    expect(t).toHaveLength(1);
    expect(t[0].hi).toBeUndefined();
  });

  test('약물명과 숫자 하이라이트가 한 문장에 같이 있어도 각각 잡힌다', () => {
    const t = splitTargetTokens("I'm giving you acetaminophen 650 milligrams now.", ['acetaminophen']);
    expect(t.find((x) => x.hi === 'drug')?.w).toBe('acetaminophen');
    expect(t.find((x) => x.hi === 'num')?.w).toBe('650 milligrams');
  });
});

// ── syllableBand — business-rules R1: 80/60 boundaries belong to the upper band.
describe('syllableBand', () => {
  test('80 이상은 ok, 경계값 80 포함', () => {
    expect(syllableBand(80)).toBe('ok');
    expect(syllableBand(100)).toBe('ok');
  });

  test('60~79는 weak, 경계값 60 포함', () => {
    expect(syllableBand(60)).toBe('weak');
    expect(syllableBand(79)).toBe('weak');
  });

  test('60 미만은 bad', () => {
    expect(syllableBand(59)).toBe('bad');
    expect(syllableBand(0)).toBe('bad');
  });
});

// ── matchPhonemesToSyllables — T6's time-window join, with the defenses the
// task calls out explicitly: Azure ships Syllables[]/Phonemes[] as two flat
// sibling arrays with no shared index, joined only by [offset, offset+duration).
// Whether that offset/duration actually arrives non-zero over REST is
// unverified, so this must degrade loudly, not silently mislabel everything.
describe('matchPhonemesToSyllables', () => {
  test('정상 정렬: 각 음소가 자신을 담은 음절 창에 매칭된다', () => {
    const syllables = [
      { offset: 0, duration: 10 },
      { offset: 10, duration: 15 },
    ];
    const phonemes = [{ offset: 2 }, { offset: 12 }, { offset: 20 }];
    const { matches, suspectAllZero } = matchPhonemesToSyllables(phonemes, syllables);
    expect(matches).toEqual([0, 1, 1]);
    expect(suspectAllZero).toBe(false);
  });

  test('전부 0: 매칭은 전부 실패하고 이상 신호(suspectAllZero)가 선다', () => {
    const syllables = [
      { offset: 0, duration: 0 },
      { offset: 0, duration: 0 },
    ];
    const phonemes = [{ offset: 0 }, { offset: 0 }];
    const { matches, suspectAllZero } = matchPhonemesToSyllables(phonemes, syllables);
    expect(matches).toEqual([null, null]);
    expect(suspectAllZero).toBe(true);
  });

  test('창 밖: 정상적인 타이밍이지만 어떤 음절 창에도 안 들어가면 null (첫 음절로 떨어지지 않는다)', () => {
    const syllables = [
      { offset: 0, duration: 10 },
      { offset: 10, duration: 15 },
    ];
    const phonemes = [{ offset: 999 }];
    const { matches, suspectAllZero } = matchPhonemesToSyllables(phonemes, syllables);
    expect(matches).toEqual([null]);
    expect(suspectAllZero).toBe(false); // 타이밍 자체는 정상 수치라 이상 신호는 아니다
  });

  test('빈 배열: 음소나 음절이 없으면 빈 결과, 이상 신호는 서지 않는다', () => {
    expect(matchPhonemesToSyllables([], [])).toEqual({ matches: [], suspectAllZero: false });
    expect(matchPhonemesToSyllables([{ offset: 5 }], [])).toEqual({ matches: [null], suspectAllZero: false });
    expect(matchPhonemesToSyllables([], [{ offset: 0, duration: 10 }])).toEqual({ matches: [], suspectAllZero: false });
  });
});
