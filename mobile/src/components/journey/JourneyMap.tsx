// JourneyMap — lays the track's stations out along a zigzag path and links them with
// PathSegment curves. 핸드오프 v41 08_JOURNEY_RESOURCES.md §3, frontend-components.md §2.
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
import { PathSegment, type Point } from './PathSegment';
import { RADIUS, Station, type StationState } from './Station';

/** 트랙 하나의 정거장 하나 — `JourneyView['track']['curricula']`의 원소. */
export type JourneyCurriculum = NonNullable<NonNullable<JourneyView['track']>['curricula']>[number];

const ROW = 108; // 정거장 사이 세로 간격
const SWING = 0.28; // 지그재그 진폭(화면 폭 대비)
export const BOTTOM_PAD = 96; // 고정 바에 가리지 않는 최소값(핸드오프 §5)

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
  const states = useMemo(() => stationStates(curricula), [curricula]);
  const points = useMemo(
    () => curricula.map((_, i) => stationPoint(i, width)),
    [curricula, width],
  );
  const mapHeight = points.length === 0
    ? 0
    : points[points.length - 1].y + RADIUS[states[states.length - 1]] + 40;

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
      </View>
    </ScrollView>
  );
}
