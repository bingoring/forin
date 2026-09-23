// JourneyMap — lays the track's stations out along a zigzag path and links them with
// PathSegment curves. 핸드오프 v41 08_JOURNEY_RESOURCES.md §3, frontend-components.md §2.
//
// P3-C(curriculum-v3-journey-ia/build-spec-index.md) 이후로 이 파일의 `JourneyMap`
// 컴포넌트 자체는 어느 화면도 렌더하지 않는다 — 1단계는 `ThemeList`(길을 그리지
// 않는 목록, K1)가, 2단계는 `StationTrack`(진짜 잠금이 있는 자리라 상태 어휘가
// 다름, 파일 상단 주석 참고)이 대신 맡았다. 지우지 않고 둔 것은 이 컴포넌트가 아니라
// 이 파일이 내보내는 것들이 여전히 쓰이기 때문이다: `stationPoint`/`BOTTOM_PAD`/
// `LABEL_ALLOWANCE`/`MILESTONE_ALLOWANCE`/`MILESTONE_GAP`(StationTrack.tsx)과
// `JourneyCurriculum` 타입(ThemeList.tsx 외). 아래 `CurrentStationBar` 관련 계산
// 코멘트는 그 컴포넌트가 있던 시절 기록이다 — `CurrentStationBar`는 같은 P3-C에서
// 은퇴했고(1단계가 목록이 되며 고정 바가 설 자리가 없어졌다), `BOTTOM_PAD` 자체는
// StationTrack이 자신의 스크롤 여백으로 그대로 재사용한다.
//
// 정거장 좌표는 서버가 모른다(J10): CurriculumState는 순서만 준다. `stationPoint`가 그 순서를
// 화면 위 x/y로 바꾸는 유일한 곳이고, 인덱스와 화면 폭 말고는 아무것도 읽지 않는다.
//
// `track`/`curricula`의 필드는 생성된 계약 타입이라 전부 optional이다(실제로는 서버가 항상
// 채우지만, openapi-typescript는 그것을 모른다) — 그래서 아래는 존재를 가정하지 않고 `?.`와
// 기본값을 쓴다.
import { useMemo } from 'react';
import { ScrollView, View, useWindowDimensions } from 'react-native';
import Svg from 'react-native-svg';
import type { JourneyView } from '@/api/client';
import { MILESTONE_FLAG_HEIGHT, MILESTONE_FLAG_WIDTH, MilestoneFlag, type MilestoneState } from './MilestoneFlag';
import { PathSegment, type Point } from './PathSegment';
import { RADIUS, Station, type StationState } from './Station';

/** 트랙 하나의 정거장 하나 — `JourneyView['track']['curricula']`의 원소. */
export type JourneyCurriculum = NonNullable<NonNullable<JourneyView['track']>['curricula']>[number];

/** 트랙 하나의 마일스톤 — `JourneyView['track']['milestone']`. 서버가 안 보내면(트랙에
 *  구간 시험이 없거나 그릴 수 없으면) `undefined`고, 그때 지도는 깃발을 지어내지 않는다. */
export type JourneyMilestone = NonNullable<NonNullable<JourneyView['track']>['milestone']>;

const ROW = 108; // 정거장 사이 세로 간격
const SWING = 0.28; // 지그재그 진폭(화면 폭 대비)

// Task 13에서 계산으로 확인한 두 여백. 마지막 정거장의 Svg 바로 아래로는 라벨(최대 2줄,
// hand13, marginTop 2)과 진행률(1줄, body9.5, marginTop 1)이 더 있는데, `mapHeight`는
// 그 두 텍스트 블록의 높이를 넣지 않고 있었다. DeptSheet.tsx가 같은 hand 폰트의 2줄 라벨에
// 잡아 둔 lineHeight(hand17 → 19, 비율 ≈1.12)를 인용해 hand13 두 줄을 대략 29px로 추정했었지만,
// 그 19는 그 화면이 기본 줄간격을 **좁히려고** 명시적으로 덮어쓴 값이다 — 즉 하한이지 실측
// 기본값이 아니다. 기본 줄간격이 흔한 값인 1.3배라면 hand13 두 줄은 34px, 여기에 진행률
// 줄(14.7)과 두 marginTop(3)을 더하면 라벨 블록 전체가 약 52px. 기존 `+ 40`이 이미 흡수한
// 12px(RADIUS+28을 넘는 몫)을 빼면 부족분은 약 40px — `LABEL_ALLOWANCE`로 그만큼 더한다.
// (Review 2차: 40→45로 상향, 아래 하한 단정 참고.)
//
// 이 부족분을 그대로 두면 두 번째 항목과 겹친다: `CurrentStationBar`는 padding 13×2 +
// 손글씨 16.5 한 줄 + 진행률 줄로 대략 65~70px 높이이고 `bottom: 16`만큼 화면 아래에서
// 떠 있어, 화면 맨 아래에서 그 바 윗변까지는 약 81~86px다. `BOTTOM_PAD`가 96이면 라벨
// 부족분을 셈에 넣기 전에는 여유가 10~20px뿐이었고(항목 2), 넣고 나면 마이너스 — 즉 스크롤을
// 끝까지 내리면 마지막 정거장의 라벨·진행률 줄이 고정 바 밑에 실제로 가려진다. 그래서 라벨
// 부족분은 `mapHeight` 쪽에서(원인을 고치고), `BOTTOM_PAD`는 96→120으로 올려(여유를
// 안전하게 남겨) 둘 다 손을 봤다 — 120 - (16+70) ≈ 34px가 남는다.
//
// 두 상수 모두 JourneyMap.test.tsx가 하한을 직접 단정한다 — `mapHeight`가 `LABEL_ALLOWANCE`를
// 다시 읽어 기대값을 계산하는 회귀 테스트만으로는, 이 상수를 0으로 낮춰도 그 테스트는 여전히
// 통과한다(기대값도 같이 0을 셈에 넣기 때문). 값 자체에 별도 하한을 걸어야 막히지 않는다.
export const LABEL_ALLOWANCE = 45; // 라벨 2줄 + marginTop + 진행률 줄 + marginTop, 반올림 여유 포함
export const BOTTOM_PAD = 120; // 고정 바에 가리지 않는 최소값(핸드오프 §5) — 96에서 상향

// Task 19: 트랙 끝에 MilestoneFlag가 하나 더 붙는다(서버가 마일스톤을 보낸 트랙에서만 —
// 지어내지 않는다). 위 두 상수의 계산은 "마지막 정거장의 라벨+진행률 줄까지"만 셈에 넣고
// 있었으므로, 깃발 한 칸만큼 그 아래로 더 필요하다. BOTTOM_PAD는 손대지 않는다 — 그 값은
// CurrentStationBar(고정 바)가 화면 맨 아래에서 차지하는 몫이고, 깃발은 고정 바가 아니라
// 스크롤되는 지도 콘텐츠 안에 들어가므로 `mapHeight` 쪽에서만 키우면 된다(BOTTOM_PAD가
// 지키던 "스크롤을 끝까지 내려도 고정 바 밑에 깔리지 않는다"는 관계는 콘텐츠 총 길이가
// 아니라 화면 맨 아래로부터의 여백이라 콘텐츠가 길어져도 그대로 유지된다).
//
// MILESTONE_GAP(20)은 새 단위가 아니라 이 화면이 이미 쓰는 가로 거터를 세로로 재사용한
// 것이다(NbScreen의 `paddingHorizontal: 20`) — 진행률 줄에 세 번째 줄처럼 달라붙지 않고
// 깃발이 독립된 요소로 읽히기에 충분한 간격이다.
// MILESTONE_FLAG_HEIGHT(34)는 MilestoneFlag.tsx가 소유한 값을 그대로 읽는다 — Station.tsx의
// RADIUS를 JourneyMap이 다시 읽는 것과 같은 이유로, 두 파일이 각자 34를 들고 있다가
// 벌어지는 사고를 막는다.
export const MILESTONE_GAP = 20;
export const MILESTONE_ALLOWANCE = MILESTONE_GAP + MILESTONE_FLAG_HEIGHT; // 20 + 34 = 54

/** 인덱스 하나가 좌표 하나다 — 홀수 줄은 오른쪽, 짝수 줄은 왼쪽으로 스윙한다. 서버는 좌표를
 *  모른다(J10): 이 함수가 읽는 것은 인덱스와 폭뿐이다. */
export function stationPoint(i: number, width: number): Point {
  return { x: width / 2 + (i % 2 === 0 ? -1 : 1) * width * SWING, y: 56 + i * ROW };
}

/** 서버의 정거장 상태(passed/here/open)를 지도의 넷으로 옮긴다. 처음 만나는 open만 next이고
 *  그 뒤는 흐린 점선(far)이다 — 경로가 어디까지 왔는지 한눈에 읽히게 하려는 것이다. `here`는
 *  서버가 준 것을 그대로 옮길 뿐, 여기서 지어내지 않는다 — 트랙 안에 정확히 하나이거나 없다. */
export function stationStates(curricula: JourneyCurriculum[]): StationState[] {
  // `here` does NOT consume the "next" slot — it marks where the learner is, not where
  // they're going next. The first `open` still becomes `next` even after a `here`.
  let nextUsed = false;
  return curricula.map((c) => {
    if (c.state === 'passed') return 'done';
    if (c.state === 'here') return 'here';
    if (!nextUsed) { nextUsed = true; return 'next'; }
    return 'far';
  });
}

export function JourneyMap({ track, onStationPress }: {
  track: JourneyView['track'];
  onStationPress(themeKey: string): void;
}) {
  const { width } = useWindowDimensions();
  const curricula = useMemo(() => track?.curricula ?? [], [track]);
  const milestone: JourneyMilestone | undefined = track?.milestone;
  const states = useMemo(() => stationStates(curricula), [curricula]);
  const points = useMemo(
    () => curricula.map((_, i) => stationPoint(i, width)),
    [curricula, width],
  );
  const baseHeight = points.length === 0
    ? 0
    // + 40 clears the SVG box itself (Station.tsx centres the circle in a box of
    // half-height RADIUS+28, so + 40 already reaches 12px past that edge).
    // + LABEL_ALLOWANCE covers what sits BELOW the SVG — the (up to 2-line) label and the
    // progress line — which the old "+ 40" alone did not account for (see
    // LABEL_ALLOWANCE above for the estimate).
    : points[points.length - 1].y + RADIUS[states[states.length - 1]] + 40 + LABEL_ALLOWANCE;
  // The flag only takes its row when there is actually one to draw (see MILESTONE_ALLOWANCE
  // above) — a track with no milestone keeps exactly the height it had before Task 19.
  const mapHeight = milestone ? baseHeight + MILESTONE_ALLOWANCE : baseHeight;

  return (
    <ScrollView testID="journey-map-scroll" contentContainerStyle={{ paddingBottom: BOTTOM_PAD }}>
      <View testID="journey-map" style={{ height: mapHeight }}>
        <Svg width={width} height={mapHeight} style={{ position: 'absolute', left: 0, top: 0 }}>
          {points.slice(0, -1).map((from, i) => (
            <PathSegment
              key={i}
              from={from}
              to={points[i + 1]}
              done={states[i] === 'done' && states[i + 1] === 'done'}
            />
          ))}
        </Svg>
        {curricula.map((c, i) => {
          const state = states[i];
          const p = points[i];
          const offset = RADIUS[state] + 28; // Station centres its Svg circle at (r+28, r+28)
          const themeKey = c.themeKey ?? '';
          return (
            <View
              key={themeKey || i}
              style={{ position: 'absolute', left: p.x - offset, top: p.y - offset }}
            >
              <Station
                state={state}
                label={c.name ?? themeKey}
                sub={c.total !== undefined ? `${c.done ?? 0}/${c.total}` : undefined}
                collab={c.collabWith}
                onPress={() => onStationPress(themeKey)}
              />
            </View>
          );
        })}
        {/* 트랙당 하나(frontend-components.md §6) — 서버가 마일스톤을 안 보내면 그리지
            않는다. 위치는 정거장 레인(지그재그)을 따르지 않고 화면 중앙에 고정한다 —
            이 트랙의 결승선이지 어느 한 정거장의 부속물이 아니기 때문이다. */}
        {milestone && (
          <View
            testID="milestone-flag-slot"
            style={{ position: 'absolute', left: width / 2 - MILESTONE_FLAG_WIDTH / 2, top: baseHeight + MILESTONE_GAP }}
          >
            <MilestoneFlag
              title={milestone.name ?? ''}
              state={(milestone.state as MilestoneState | undefined) ?? 'closed'}
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
}
