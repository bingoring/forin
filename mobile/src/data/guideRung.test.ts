import { isGuidedRung, GUIDED } from './guideRung';

// 사다리의 가이드 회차는 2026-09-30에 `choices` 에서 `guided` 로 이름이 바뀌었다.
// 서버는 이제 `guided` 를 보내는데, 이 앱은 여기저기서 `=== 'choices'` 로 견주고
// 있었다. 그 비교를 그대로 두면 **가이드 회차가 자유 회차로 그려진다** — 보기도
// 힌트도 없이 빈 칸만 나오고, 학습자는 건너뛴 적 없는 단계를 건너뛴 셈이 된다.
//
// 그리고 옛 이름은 아직 살아 있다. 딥링크(`?guide=choices`)가 남의 기록과 알림에
// 박혀 있고, 그 링크로 들어온 사람도 같은 회차로 가야 한다.
describe('guideRung', () => {
  test('새 이름과 딥링크에 남은 옛 이름이 같은 회차로 풀린다', () => {
    expect(isGuidedRung('guided')).toBe(true);
    expect(isGuidedRung('choices')).toBe(true);
  });

  test('나머지는 전부 자유 회차다', () => {
    for (const v of ['free', '', undefined, null, 'GUIDED', 'choice']) {
      expect(isGuidedRung(v as never)).toBe(false);
    }
  });

  test('보낼 때는 새 이름만 쓴다', () => {
    expect(GUIDED).toBe('guided');
  });
});
