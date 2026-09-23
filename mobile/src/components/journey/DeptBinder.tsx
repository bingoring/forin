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
// 진행 격자 칸 너비를 상황 수에 비례시키지 않는 이유(과제 지시서): 부서당 주제는
// 15~35개, 주제당 상황 수는 20~23개로 서로 거의 같다(V6) — 비례로 얻는 정보가 거의
// 없는데, 35칸을 한 줄에 비례 배분하면 칸이 획 하나보다 얇아진다(V5·V6가 막으려는
// 바로 그 실패). 그래서 칸은 전부 같은 폭이고, 한 줄에 12개를 채우면 다음 줄로 접는다
// (진짜 flexWrap이 아니라 12개씩 자른 행을 명시적으로 그린다 — 그래야 마지막 줄이
// 남은 칸 수만큼 넓어지며 "칸 크기가 줄었다"는 착시가 생기지 않는다).
//
// locked·다음·미리보기·앞 주제 완료 시 열림·추천 순서를 만들지 않는 이유: 참조 코드
// (TopicBinder)는 그것들을 그리지만, 우리 콘텐츠에서 주제는 잠기지 않는다(스펙 X2,
// J1·J3 — 잠기는 것은 주제 안의 난이도 계단뿐이다, J2). 권유는 서버가 트랙당 0개 또는
// 1개로 보장하는 `resume` 하나뿐이다(K2). 그래서 상태는 세 가지뿐이다 — 완료·진행중·
// (아무 표시 없음) — 그 외의 어떤 문구도 지어내지 않는다.
import { useState } from 'react';
import { Pressable, Text, View, useWindowDimensions } from 'react-native';
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

// ── 2. 부서 진행 격자 ────────────────────────────────────────────────────────

const GRID_COLS = 12;
const GRID_GAP = 3;
const GRID_CELL_H = 10;
// journey.tsx의 ScrollView가 좌우 20씩 여백을 이미 두므로(paddingHorizontal: 20), 이
// 격자가 실제로 쓸 수 있는 폭은 화면 폭에서 그 40을 뺀 값이다.
const SCREEN_PAD = 40;

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function ProgressGrid({ curricula }: { curricula: JourneyCurriculum[] }) {
  const { width } = useWindowDimensions();
  const avail = Math.max(0, width - SCREEN_PAD);
  const cellW = Math.max(4, (avail - (GRID_COLS - 1) * GRID_GAP) / GRID_COLS);
  const rows = chunk(curricula, GRID_COLS);
  return (
    <View testID="dept-binder-progress-grid" style={{ marginBottom: 14 }}>
      {rows.map((row, ri) => (
        <View
          key={ri}
          testID="dept-binder-progress-row"
          style={{ flexDirection: 'row', gap: GRID_GAP, marginBottom: ri < rows.length - 1 ? GRID_GAP : 0 }}
        >
          {row.map((c, ci) => {
            const total = c.total ?? 0;
            const done = c.done ?? 0;
            // 0으로 나누지 않는다 — total이 0인 주제는 빈 칸으로 그린다.
            const pct = total > 0 ? Math.min(100, Math.max(0, (done / total) * 100)) : 0;
            const isCellDone = total > 0 && done >= total;
            const fillColor = isCellDone ? nb.green : nb.marker;
            return (
              <View
                key={c.themeKey || `cell-${ri}-${ci}`}
                testID="dept-binder-progress-cell"
                style={{
                  width: cellW,
                  height: GRID_CELL_H,
                  borderWidth: 1.2,
                  borderColor: nb.ink,
                  borderRadius: 2,
                  overflow: 'hidden',
                  backgroundColor: nb.paper,
                }}
              >
                {pct > 0 && (
                  <View
                    style={{
                      position: 'absolute', left: 0, top: 0, bottom: 0,
                      width: `${pct}%`, backgroundColor: fillColor,
                    }}
                  />
                )}
              </View>
            );
          })}
        </View>
      ))}
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

const TAB_COLORS = [nb.green, nb.blue, nb.red, nb.marker];
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
                <NbTag color={nb.marker}>{t('journey.resumeLabel')}</NbTag>
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
      <ProgressGrid curricula={curricula} />
      <BinderList curricula={curricula} onPress={onPress} />
    </View>
  );
}
