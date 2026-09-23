// 서가 바인더의 짧은 부서 라벨 (journey-binder-v42 Task G).
//
// `dept.*`는 '응급실 ER'처럼 이름과 영문을 함께 담아 최대 28자까지 간다. 서가는 한 줄에
// 바인더 4개를 두므로 안쪽 폭이 56px 남짓이고, 그 라벨은 두 줄로도 잘린다. 그래서
// `dept.short.*`를 따로 둔다.
//
// 이 라벨을 기존 값에서 자동으로 잘라내려던 시도는 기각했다 — 영어 'Operating room OR'는
// 'Operating'이 되어 수술실이 수술이 되고, 독일어 'Frauen- und Kinderambulanz'는
// 'Frauen-'이라는 조각만 남으며, 'General ward'와 'General'이 둘 다 'General'이 되어
// 서로 다른 두 부서가 같은 이름을 갖는다. 그래서 언어마다 손으로 쓴다. 이 파일은 손으로
// 쓴 값이 지켜야 할 성질을 잠근다.
import { CATALOGS, type Locale } from './locales';

const LOCALES = Object.keys(CATALOGS) as Locale[];
const DEPT_CODES = Object.keys(CATALOGS.ko)
  .filter((k) => /^dept\.[A-Z_]+$/.test(k))
  .map((k) => k.slice('dept.'.length));

/** CJK 한 글자는 라틴 한 글자의 두 배 가까운 폭을 차지하므로, 폭 상한을 글자 수가
 *  아니라 "라틴 글자 환산 폭"으로 잰다. 바인더 안쪽 56px에 `hand(12)` 두 줄이면
 *  라틴 환산 약 18칸이 한계다. */
function width(s: string): number {
  let w = 0;
  for (const ch of s) w += /[　-鿿가-힯＀-￯]/.test(ch) ? 2 : 1;
  return w;
}

const MAX_WIDTH = 16;

describe('dept.short.* — 서가 바인더 라벨', () => {
  it('부서가 29개 넘게 있다 (표본이 비어서 통과하는 일이 없도록)', () => {
    expect(DEPT_CODES.length).toBeGreaterThanOrEqual(29);
  });

  it.each(LOCALES)('%s 카탈로그가 모든 부서의 짧은 라벨을 갖는다', (loc) => {
    const missing = DEPT_CODES.filter((d) => !CATALOGS[loc][`dept.short.${d}`]);
    expect(missing).toEqual([]);
  });

  it.each(LOCALES)('%s 짧은 라벨이 바인더 폭에 들어간다', (loc) => {
    const tooWide = DEPT_CODES
      .map((d) => [d, CATALOGS[loc][`dept.short.${d}`]] as const)
      .filter(([, v]) => width(v) > MAX_WIDTH);
    expect(tooWide).toEqual([]);
  });

  it.each(LOCALES)('%s 서로 다른 부서가 같은 짧은 라벨을 갖지 않는다', (loc) => {
    const seen = new Map<string, string>();
    const clashes: string[][] = [];
    for (const d of DEPT_CODES) {
      const v = CATALOGS[loc][`dept.short.${d}`];
      const prev = seen.get(v);
      if (prev) clashes.push([prev, d, v]);
      else seen.set(v, d);
    }
    expect(clashes).toEqual([]);
  });

  it.each(LOCALES)('%s 짧은 라벨이 조각으로 끝나지 않는다', (loc) => {
    // 'Frauen-'·'Labor &'처럼 잘린 티가 나는 꼬리. 자동 추출이 남기던 자국이다.
    const ragged = DEPT_CODES
      .map((d) => [d, CATALOGS[loc][`dept.short.${d}`]] as const)
      .filter(([, v]) => /[-&·,]$/.test(v.trim()));
    expect(ragged).toEqual([]);
  });
});

describe('dept.* — 기존 전체 라벨', () => {
  // 일본어 중앙공급실이 '中央materials SPD'였다. 단어 안에 라틴 문자가 끼어든 깨짐으로,
  // 번역이 덜 된 자리가 그대로 배포된 흔적이다. 같은 일이 다시 나지 않게 잠근다.
  it.each(['ko', 'ja'] as const)('%s 라벨의 이름 안에 번역되지 않은 영단어가 남지 않는다', (loc) => {
    const mixed = DEPT_CODES
      .map((d) => [d, CATALOGS[loc][`dept.${d}`]] as const)
      // 뒤에 붙는 영문 코드('… ER', '… NICU')는 의도된 것이라 앞 토막만 본다. 그 앞
      // 토막 안의 대문자 약어도 정상이다 — 일본어 '新生児ICU'는 현장에서 쓰는 표기다.
      // 남는 것은 소문자로 시작하는 영단어뿐이고, 그것은 번역이 덜 된 자리다.
      .filter(([, v]) => /[a-z]/.test(v.split(' ')[0]));
    expect(mixed).toEqual([]);
  });
});
