// DeptBinder — 일터 탭 부서 간지 (journey-binder-v42 Task E, build-spec-index.md §5·§8).
// 시각 참조: inputs/design-handoff_v42/reference/forin-notebook-journey2.jsx의
// `TopicBinder()`(160~234행) — 그 코드는 웹 프로토타입이라 옮겨 적지 않고 모양만 가져온다.
// `react-native-svg`는 쓰지 않는다(제약) — 전부 `View`의 테두리·배경으로 그린다.
//
// ThemeList.tsx가 하던 "부서 코어/부서 심화 두 묶음의 목록" 자리를 대신하지만, 이 파일은
// 그 목록을 차트 바인더 은유로 다시 그린다: 맨 위에 부서 표지(주제·상황·우표 합계)와
// 주제 하나당 칸 하나인 진행 격자, 그 아래로 바인더 링과 색 인덱스 탭이 붙은 간지(주제
// 카드) 목록. `groupByTrack`은 ThemeList.tsx에서 그대로 옮겨왔다(K3은 계속 유효하다) —
// 코어가 아니면 심화로 떨어지는 이분법과 그 주석은 그 파일에 있던 것과 같다.
//
// 부서 진행은 주제 하나당 칸 하나가 아니라 한 줄 3구간 게이지다(핸드오프 v43). 그
// 판단의 근거는 §2 주석에 있다.
//
// locked·다음·미리보기·앞 주제 완료 시 열림·추천 순서를 만들지 않는 이유: 참조 코드
// (TopicBinder)는 그것들을 그리지만, 우리 콘텐츠에서 주제는 잠기지 않는다(스펙 X2,
// J1·J3 — 잠기는 것은 주제 안의 난이도 계단뿐이다, J2). 권유는 서버가 트랙당 0개 또는
// 1개로 보장하는 `resume` 하나뿐이다(K2). 그래서 상태는 세 가지뿐이다 — 완료·진행중·
// (아무 표시 없음) — 그 외의 어떤 문구도 지어내지 않는다.
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { NbButton, NbInkStamp, NbPaper, NbTag, nbText } from '@/components/nb/NbUI';
import { nb, nbFonts } from '@/theme/nb';
import { useT } from '@/i18n';
import type { JourneyCurriculum } from './JourneyMap';

/** 서버가 주는 `track` 문자열로 두 묶음을 가른다(K3). 'core'만 코어, 나머지는 전부
 *  심화 — 'depth'는 물론, 아직 콘텐츠가 없는 'collab'이나 빈 문자열도 심화로 떨어진다.
 *  세 번째 묶음을 만들지 않는 것이 이 함수의 핵심 결정이다. ThemeList.tsx에서 그대로
 *  옮겨왔다 — 판단은 바뀌지 않았다. */
export function groupByTrack(curricula: JourneyCurriculum[]): {
  core: JourneyCurriculum[];
  depth: JourneyCurriculum[];
} {
  const core: JourneyCurriculum[] = [];
  const depth: JourneyCurriculum[] = [];
  for (const c of curricula) {
    if (c.track === 'core') core.push(c); else depth.push(c);
  }
  return { core, depth };
}

function SectionLabel({ children }: { children: string }) {
  return (
    <Text style={[nbText.hand(15, nb.soft), { marginTop: 18, marginBottom: 8 }]}>
      {children}
    </Text>
  );
}

// ── 1. 부서 표지 — 격자 위 ───────────────────────────────────────────────────

function BinderSummary({ curricula }: { curricula: JourneyCurriculum[] }) {
  const t = useT();
  const themes = curricula.length;
  const situations = curricula.reduce((a, c) => a + (c.total ?? 0), 0);
  const stamps = curricula.reduce((a, c) => a + (c.done ?? 0), 0);
  return (
    <Text style={[nbText.body(11, nb.soft), { marginBottom: 10 }]}>
      {t('journey.binderSummary', { themes, situations, stamps })}
    </Text>
  );
}

// ── 2. 부서 진행 게이지 ──────────────────────────────────────────────────────
//
// 핸드오프 v43이 이 자리를 다시 설계했다. v42는 주제 하나당 칸 하나였고 이 파일도 그렇게
// 그렸는데(한 줄 12칸, 35개면 세 줄), 그 모양은 주제가 늘수록 읽을 것이 늘기만 한다 —
// 35개를 세어 봐야 "얼마나 왔나"는 안 나온다. v43은 칸을 버리고 **한 줄 3구간**으로 간다:
// 끝낸 만큼 초록, 손댄 만큼 빗금 친 호박색, 남은 만큼 빈칸. 그 아래 범례가 숫자로 받는다.
//
// 눈금은 5주제마다 하나다. 게이지만 있으면 "3분의 1쯤"까지밖에 안 읽히는데, 눈금이 있으면
// 거기서 몇 번째 칸인지가 보인다.

/** 한 주제의 상태. 게이지의 세 구간이 이 셋과 1:1이다. */
export type TopicPhase = 'done' | 'active' | 'rest';

export function topicPhase(c: JourneyCurriculum): TopicPhase {
  const total = c.total ?? 0;
  const done = c.done ?? 0;
  if (total > 0 && done >= total) return 'done';
  // 손을 댔으면 진행 중이다. total이 0인 주제(아직 상황이 없는 주제)는 done도 0이라
  // 자연히 '남음'으로 떨어진다 — 끝낸 것으로도, 하던 것으로도 세지 않는다.
  return done > 0 ? 'active' : 'rest';
}

export function countPhases(curricula: JourneyCurriculum[]): { done: number; active: number; rest: number } {
  const out = { done: 0, active: 0, rest: 0 };
  for (const c of curricula) out[topicPhase(c)] += 1;
  return out;
}

/** 진행 중 구간의 호박색. `nb.marker`는 형광펜 노랑이라 빗금으로 쓰면 번져 보인다.
 *  서가의 목표 부서 테와 같은 값이다. */
const GAUGE_ACTIVE = '#C77E2E';

const GAUGE_H = 9;
/** 눈금 간격(주제 수). */
const TICK_EVERY = 5;

/** 빗금. RN에는 되풀이되는 사선 무늬가 없어서, 기울인 띠를 잘라 넣어 만든다.
 *  띠 하나는 4px, 사이도 4px — 핸드오프의 `repeating-linear-gradient(-45deg, … 0 4px, … 4px 8px)`
 *  와 같은 굵기다. */
function Hatch({ color }: { color: string }) {
  // 45도로 기울면 가로로 필요한 길이가 높이만큼 늘어난다. 넉넉히 덮고 넘치는 부분은
  // 바깥의 `overflow: 'hidden'`이 자른다.
  const band = 4;
  const span = 400;
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: -GAUGE_H, top: 0, bottom: 0, right: -GAUGE_H, opacity: 0.85 }}>
      {Array.from({ length: Math.ceil(span / (band * 2)) }).map((_, i) => (
        <View
          key={i}
          style={{
            position: 'absolute', top: -GAUGE_H, bottom: -GAUGE_H,
            left: i * band * 2, width: band,
            backgroundColor: color,
            transform: [{ rotate: '-45deg' }],
          }}
        />
      ))}
    </View>
  );
}

function LegendDot({ color }: { color: string }) {
  return <View style={{ width: 9, height: 9, backgroundColor: color, marginRight: 4 }} />;
}

function ProgressGauge({ curricula }: { curricula: JourneyCurriculum[] }) {
  const t = useT();
  const total = curricula.length;
  const { done, active, rest } = countPhases(curricula);
  // 0으로 나누지 않는다 — 주제가 없는 부서는 빈 게이지를 그린다.
  const pct = (n: number): `${number}%` => (total > 0 ? `${(n / total) * 100}%` : '0%');
  const ticks = total > 0 ? Math.max(0, Math.ceil(total / TICK_EVERY) - 1) : 0;

  return (
    <View testID="dept-binder-gauge" style={{ marginBottom: 14 }}>
      <View style={{
        height: GAUGE_H, borderWidth: 1.4, borderColor: nb.ink, borderRadius: 3,
        overflow: 'hidden', flexDirection: 'row', backgroundColor: nb.paper,
      }}>
        <View testID="gauge-done" style={{ width: pct(done), backgroundColor: nb.green }} />
        <View testID="gauge-active" style={{ width: pct(active), overflow: 'hidden' }}>
          <Hatch color={GAUGE_ACTIVE} />
        </View>
        {/* 눈금 — 5주제마다. 구간 위에 얹으므로 절대 위치다. */}
        {Array.from({ length: ticks }).map((_, i) => (
          <View
            key={i}
            testID="gauge-tick"
            pointerEvents="none"
            style={{
              position: 'absolute', top: 0, bottom: 0, width: 1,
              left: pct((i + 1) * TICK_EVERY), backgroundColor: 'rgba(62,54,43,.25)',
            }}
          />
        ))}
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 5 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <LegendDot color={nb.green} />
          <Text style={nbText.hand(12.5, nb.soft)}>
            {t('journey.gaugeDone')} <Text style={nbText.hand(12.5)}>{done}</Text>
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <LegendDot color={GAUGE_ACTIVE} />
          <Text style={nbText.hand(12.5, nb.soft)}>
            {t('journey.gaugeActive')} <Text style={nbText.hand(12.5)}>{active}</Text>
          </Text>
        </View>
        <Text style={nbText.hand(12.5, nb.soft)}>{t('journey.gaugeRest', { n: rest })}</Text>
        <View style={{ flex: 1 }} />
        <Text style={nbText.mono(11, nb.ink)}>
          {done}
          <Text style={{ color: nb.soft }}>{`/${total} ${t('journey.gaugeUnit')}`}</Text>
        </Text>
      </View>
    </View>
  );
}

// ── 3. 간지 목록 — 바인더 링 · 색 인덱스 탭 · 간지 한 장 ────────────────────

/** 세로로 늘어선 바인더 링. 개수는 목록 높이에 맞춰 정한다 — 링이 실제 종이 두께를
 *  흉내내려는 장식이지 목록 항목 수를 세는 값이 아니라서, 이 컴포넌트는 `curricula`를
 *  전혀 읽지 않는다. */
function BinderRings({ height }: { height: number }) {
  const count = Math.max(1, Math.ceil(height / 42));
  return (
    <View testID="dept-binder-rings" pointerEvents="none" style={{ position: 'absolute', left: 6, top: 14 }}>
      {Array.from({ length: count }).map((_, i) => (
        <View
          key={i}
          style={{
            width: 8, height: 8, borderRadius: 4, borderWidth: 1.5,
            borderColor: nb.ink, backgroundColor: nb.cream, marginBottom: 34,
          }}
        />
      ))}
    </View>
  );
}

// 인덱스 탭 색. 네 번째가 `nb.marker`였는데, 그 값은 형광펜 노랑이라 흰 번호를 얹으면
// 읽히지 않는다 — 실기에서 `04` 탭의 번호가 사라져 보였다. 같은 자리에 쓰는 호박색으로
// 바꾼다(서가의 목표 부서 테, 게이지의 진행 구간과 같은 값이다).
const TAB_AMBER = '#C77E2E';
const TAB_COLORS = [nb.green, nb.blue, nb.red, TAB_AMBER];
const TAB_W = 20;
const TAB_H = 42;

// 탭이 간지마다 조금씩 내려앉아 계단을 이루되, 그 내림은 주기를 돈다. 참조 코드의
// `14 + i * 4`는 주제가 5개라는 전제에서 나온 값이라 그대로 쓸 수 없다 — 주제가 35개면
// 마지막 탭이 top 150 근처에 놓이는데 간지 한 장의 높이는 100여 픽셀이라, 열네 번째
// 주제부터 탭이 종이 아래로 흘러내린다(V6: 핸드오프의 개수를 그대로 믿지 않는다).
// 주기를 두면 계단은 그대로 보이면서 탭은 언제나 종이 안에 머문다.
const TAB_TOP_BASE = 14;
const TAB_TOP_STEP = 6;
const TAB_TOP_CYCLE = 5;

export function indexTabTop(index: number): number {
  return TAB_TOP_BASE + (index % TAB_TOP_CYCLE) * TAB_TOP_STEP;
}

/** 색 인덱스 탭. `index`는 묶음 안의 순서가 아니라 화면 전체(코어 다음 심화)의
 *  순서다(과제 지시서) — 번호도 색도 그 하나의 인덱스로 정해진다. */
function IndexTab({ index }: { index: number }) {
  const color = TAB_COLORS[index % TAB_COLORS.length];
  return (
    <View
      testID="dept-binder-index-tab"
      pointerEvents="none"
      style={{
        position: 'absolute', right: -8, top: indexTabTop(index), zIndex: 1,
        width: TAB_W, height: TAB_H, backgroundColor: color,
        borderWidth: 1.4, borderColor: nb.ink, borderLeftWidth: 0,
        borderTopLeftRadius: 0, borderBottomLeftRadius: 0,
        borderTopRightRadius: 5, borderBottomRightRadius: 5,
        alignItems: 'center', justifyContent: 'center',
      }}
    >
      <Text style={{ fontFamily: nbFonts.monoBold, fontSize: 9, color: '#fff' }}>
        {String(index + 1).padStart(2, '0')}
      </Text>
    </View>
  );
}

function BinderCard({ c, index, onPress }: { c: JourneyCurriculum; index: number; onPress(): void }) {
  const t = useT();
  const themeKey = c.themeKey ?? '';
  const name = c.name ?? themeKey;
  const done = c.done ?? 0;
  const total = c.total ?? 0;
  const isDone = total > 0 && done >= total;
  const isResume = !!c.resume;
  const tabColor = TAB_COLORS[index % TAB_COLORS.length];

  return (
    <View style={{ position: 'relative', marginBottom: 12 }}>
      <IndexTab index={index} />
      <Pressable
        testID={`theme-card-${themeKey}`}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={name}
      >
        <NbPaper rot={index % 2 ? 0.4 : -0.4} tape={isResume} style={{ padding: 12 }}>
          {/* 윗줄: 주제 이름 + 상태 표시. 상태는 세 가지뿐이다(§4) — 잠금은 없다. */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text numberOfLines={2} style={[nbText.hand(isResume ? 18 : 16.5), { flex: 1, minWidth: 0 }]}>
              {name}
            </Text>
            {isDone ? (
              <View testID="theme-done-stamp" style={{ transform: [{ rotate: '-12deg' }] }}>
                <NbInkStamp>{t('journey.themeDone')}</NbInkStamp>
              </View>
            ) : isResume ? (
              <View testID="theme-resume-badge">
                {/* 태그는 상태를, 버튼은 동작을 말한다. 둘 다 '이어하기'·'이어서'로
                    두었더니 같은 말이 한 카드에 두 번 나왔다 — 실기에서 확인했다. */}
                <NbTag color={TAB_AMBER}>{t('journey.resumeLabel')}</NbTag>
              </View>
            ) : null}
          </View>

          {/* 우표 미니 격자: 상황 수(total)만큼. total이 0이면 그리지 않는다. */}
          {total > 0 && (
            <View testID="theme-stamp-grid" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 3, marginTop: 9 }}>
              {Array.from({ length: total }).map((_, k) => (
                <View
                  key={k}
                  style={{
                    width: 9, height: 9, borderRadius: 1.5, borderWidth: 1,
                    borderColor: k < done ? tabColor : 'rgba(62,54,43,.3)',
                    backgroundColor: k < done ? tabColor : 'transparent',
                  }}
                />
              ))}
            </View>
          )}

          {/* 아랫줄: done/total + 진행 중이면 이어서 버튼. */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
            <Text style={nbText.mono(11, nb.ink)}>
              {done}
              <Text style={{ color: nb.soft }}>{` / ${total}`}</Text>
            </Text>
            <View style={{ flex: 1 }} />
            {isResume && (
              <NbButton variant="ink" size="sm" onPress={onPress}>
                {t('journey.resumeAction')}
              </NbButton>
            )}
          </View>
        </NbPaper>
      </Pressable>
    </View>
  );
}

function BinderList({ curricula, onPress }: {
  curricula: JourneyCurriculum[];
  onPress(themeKey: string): void;
}) {
  const t = useT();
  const { core, depth } = groupByTrack(curricula);
  // 화면 전체의 순서(코어 먼저, 심화 다음)로 번호·색을 매긴다 — 참조로 원본 객체를
  // 찾으므로 `themeKey`가 비어 있어도(빈 문자열이 여럿이어도) 안전하다.
  const ordered = [...core, ...depth];
  // 목록 높이에 맞춰 링 개수를 정한다(과제 지시서) — 아직 한 번도 onLayout이 오지
  // 않았을 때는 900을 기본값으로 둔다. journey.tsx의 Sheet가 같은 관례를 쓴다.
  const [listHeight, setListHeight] = useState(900);
  return (
    <View
      testID="dept-binder-list"
      onLayout={(e) => setListHeight(e.nativeEvent.layout.height)}
      style={{ paddingLeft: 22, position: 'relative' }}
    >
      <BinderRings height={listHeight} />
      {core.length > 0 && (
        <>
          <SectionLabel>{t('journey.track.core')}</SectionLabel>
          {core.map((c, i) => (
            <BinderCard
              key={c.themeKey || `core-${i}`}
              c={c}
              index={ordered.indexOf(c)}
              onPress={() => onPress(c.themeKey ?? '')}
            />
          ))}
        </>
      )}
      {depth.length > 0 && (
        <>
          <SectionLabel>{t('journey.track.depth')}</SectionLabel>
          {depth.map((c, i) => (
            <BinderCard
              key={c.themeKey || `depth-${i}`}
              c={c}
              index={ordered.indexOf(c)}
              onPress={() => onPress(c.themeKey ?? '')}
            />
          ))}
        </>
      )}
    </View>
  );
}

// ── 조립 ─────────────────────────────────────────────────────────────────

export function DeptBinder({ curricula, onPress }: {
  curricula: JourneyCurriculum[];
  onPress(themeKey: string): void;
}) {
  return (
    <View testID="dept-binder">
      <BinderSummary curricula={curricula} />
      <ProgressGauge curricula={curricula} />
      <BinderList curricula={curricula} onPress={onPress} />
    </View>
  );
}
