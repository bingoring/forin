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

  // 토큰을 이어붙이면 원문이 그대로 나와야 한다. 이게 깨지면 문장이 화면에서
  // 조용히 잘리거나 한 조각이 두 번 그려진다.
  test.each([
    ["I'm giving you acetaminophen 650 milligrams now.", ['acetaminophen']],
    // 복합제는 단일 성분명을 부분문자열로 포함한다 — 겹침을 걸러내지 않으면
    // clavulanate가 두 번 그려진다.
    ['give amoxicillin clavulanate now', ['amoxicillin clavulanate', 'clavulanate']],
    ['Take 5 mL and 2.5 mg together.', []],
    ['Please sit up.', []],
    ['', []],
  ])('토큰을 이어붙이면 원문과 같다: %s', (text, drugs) => {
    expect(
      splitTargetTokens(text, drugs as string[])
        .map((t) => t.w)
        .join('')
    ).toBe(text);
  });

  test('복합제와 성분명이 함께 주어져도 긴 쪽 하나만 하이라이트된다', () => {
    const t = splitTargetTokens('give amoxicillin clavulanate now', [
      'clavulanate',
      'amoxicillin clavulanate',
    ]);
    expect(t.filter((x) => x.hi === 'drug').map((x) => x.w)).toEqual(['amoxicillin clavulanate']);
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

  // 가장 위험한 경우. 음절은 정상 타이밍인데 음소만 offset을 잃으면, 첫 음절
  // 창이 보통 0에서 시작하므로 전 음소가 그럴듯하게 첫 음절로 매칭되고 아무
  // 경고도 없이 라벨이 전부 틀린다. 실제 발화의 구간은 시간순이라 둘 이상이
  // 모두 0일 수는 없으므로, 그걸 신호로 삼는다.
  test('음소만 offset을 잃으면(음절은 정상) 첫 음절로 몰리지 않고 이상 신호가 선다', () => {
    const syllables = [
      { offset: 0, duration: 10 },
      { offset: 10, duration: 15 },
    ];
    const phonemes = [{ offset: 0 }, { offset: 0 }, { offset: 0 }];
    const { matches, suspectAllZero } = matchPhonemesToSyllables(phonemes, syllables);
    expect(suspectAllZero).toBe(true);
    expect(matches).toEqual([null, null, null]);
  });

  // 반대 방향도 마찬가지다.
  test('음절만 offset을 잃으면 이상 신호가 선다', () => {
    const syllables = [
      { offset: 0, duration: 0 },
      { offset: 0, duration: 0 },
    ];
    const phonemes = [{ offset: 3 }, { offset: 7 }];
    expect(matchPhonemesToSyllables(phonemes, syllables).suspectAllZero).toBe(true);
  });

  // 음소가 하나뿐이고 그것이 정말 0에서 시작하는 것은 정상이다 — 신호가 서면
  // 짧은 문장마다 거짓 경보가 난다.
  test('음소가 하나뿐이고 offset 0인 것은 정상이다', () => {
    const { matches, suspectAllZero } = matchPhonemesToSyllables(
      [{ offset: 0 }],
      [{ offset: 0, duration: 10 }]
    );
    expect(suspectAllZero).toBe(false);
    expect(matches).toEqual([0]);
  });

  // offset은 정상인데 duration만 전부 0이면 어떤 창도 아무것도 담지 못해
  // 결과가 똑같이 비는데, offset만 보는 규칙으로는 신호가 서지 않았다.
  test('duration만 전부 0이어도 이상 신호가 선다', () => {
    const syllables = [
      { offset: 0, duration: 0 },
      { offset: 10, duration: 0 },
    ];
    const phonemes = [{ offset: 2 }, { offset: 12 }];
    const { matches, suspectAllZero } = matchPhonemesToSyllables(phonemes, syllables);
    expect(suspectAllZero).toBe(true);
    expect(matches).toEqual([null, null]);
  });

  test('빈 배열: 음소나 음절이 없으면 빈 결과, 이상 신호는 서지 않는다', () => {
    expect(matchPhonemesToSyllables([], [])).toEqual({ matches: [], suspectAllZero: false });
    expect(matchPhonemesToSyllables([{ offset: 5 }], [])).toEqual({ matches: [null], suspectAllZero: false });
    expect(matchPhonemesToSyllables([], [{ offset: 0, duration: 10 }])).toEqual({ matches: [], suspectAllZero: false });
  });
});
