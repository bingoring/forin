// StationTrack — 2단계(주제 화면)의 정거장 뷰. curriculum-v3-journey-ia/build-spec-index.md
// §6~§7, K4~K7.
//
// 1단계(JourneyMap)와 이 화면은 같은 그림 언어(Station·PathSegment·MilestoneFlag)를 쓰지만
// 서버가 주는 상태 어휘가 다르다 — 1단계는 CurriculumState.state(passed/here/open)를 쓰고
// JourneyMap.stationStates가 "처음 만나는 open만 next"라는 규칙으로 그것을 넷으로 옮긴다.
// 여기서는 서버가 StepState.state(done/now/lock/optional)를 주고, 진짜 잠금(J2)이 있는
// 자리라 그 규칙이 맞지 않는다 — 그래서 JourneyMap 컴포넌트 자체가 아니라 Station·
// PathSegment·MilestoneFlag와 JourneyMap이 이미 쥔 위치·여백 상수(stationPoint,
// LABEL_ALLOWANCE, BOTTOM_PAD, MILESTONE_GAP, MILESTONE_ALLOWANCE)만 가져다 쓰고, 상태
// 매핑과 레이아웃 조립은 이 파일이 새로 한다.
import { useEffect, useMemo, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, ScrollView, View, useWindowDimensions } from 'react-native';
import Svg from 'react-native-svg';
import type { JourneyStep } from '@/api/client';
import { useMyAvatar } from '@/hooks/useMyAvatar';
import { NbAvatar } from '@/components/nb/NbAvatar';
import { STEP_META, type StepKind } from '@/data/campus';
import { useT, type Translate } from '@/i18n';
import { BOTTOM_PAD, LABEL_ALLOWANCE, MILESTONE_ALLOWANCE, MILESTONE_GAP, stationPoint } from './JourneyMap';
import { MILESTONE_FLAG_HEIGHT, MILESTONE_FLAG_WIDTH, MilestoneFlag, type MilestoneState } from './MilestoneFlag';
import type { Point } from './PathSegment';
import { PathSegment } from './PathSegment';
import { RADIUS, Station, type StationState } from './Station';

// ── 상태 매핑 (state, kind→Station/MilestoneFlag 어휘) ─────────────────────

/**
 * 서버의 넷(done/now/lock/optional)을 Station이 아는 넷(done/here/next/far)으로 옮긴다.
 * `now`가 `here`인 것은 작업 지시가 못박은 값(브리프 §6)이고, 나머지 셋은 이 파일이
 * 정한다:
 *
 *  - `done` → `done`: 그대로.
 *  - `lock` → `far`: 진짜로 잠긴다(J2)는 사실은 여기서 그리지 않는다 — Station.tsx는
 *    어떤 상태에서도 자물쇠를 그리지 않는다(J3와 같은 그림 문법). 실제 게이팅은 이
 *    컴포넌트가 아니라 `pressStep`(K5)이 한다. `far`의 점선·흐림이 "아직 못 가 본
 *    곳"을 이미 말하고 있어, 여기서 새 그림을 하나 더 만들 이유가 없다.
 *  - `optional` → `next`: "언제든 풀 수 있는 보너스, 아무것도 잠그지 않는다"
 *    (StationSheet.tsx의 같은 주석 참고) — `far`로 그리면 잠긴 것처럼 보여 그 정의와
 *    모순된다. `next`(실선, 흐리지 않음)가 "지금도 열려 있다"를 그림으로 옮긴다.
 */
export function stepStationState(step: JourneyStep): StationState {
  switch (step.state) {
    case 'done': return 'done';
    case 'now': return 'here';
    case 'optional': return 'next';
    case 'lock':
    default:
      return 'far';
  }
}

/**
 * 끝의 `boss` 스텝은 정거장이 아니라 구간 시험 깃발이다(브리프 §6) — `scenarioId`가 없는
 * 것도 그 근거지만, 쪼개는 기준은 `kind`다: MilestoneFlag가 이미 그 개념을 쥐고 있고,
 * `kind`가 서버가 실제로 보내는 필드이기 때문이다(`scenarioId` 부재는 결과이지 판정
 * 기준이 아니다). 깃발을 정거장으로도 한 번 더 그리면 같은 것이 두 번 나온다.
 */
export function splitBossStep(steps: JourneyStep[]): { stations: JourneyStep[]; boss?: JourneyStep } {
  if (steps.length > 0 && steps[steps.length - 1].kind === 'boss') {
    return { stations: steps.slice(0, -1), boss: steps[steps.length - 1] };
  }
  return { stations: steps };
}

/** boss 스텝의 state(done/now/lock)를 MilestoneFlag의 셋(passed/open/closed)으로 옮긴다.
 *  알 수 없는 값은 안전하게 closed로 — 서버가 안 보낸 것을 open으로 지어내지 않는다
 *  (J6/J7과 같은 원칙). */
export function bossMilestoneState(state?: string): MilestoneState {
  if (state === 'done') return 'passed';
  if (state === 'now') return 'open';
  return 'closed';
}

/** 학습자가 지금 서 있을 자리. `now` 스텝이 있으면 그 인덱스, 없으면(트랙 전부 통과)
 *  깃발이 있는 트랙에서는 깃발 앞(=stations.length, 정거장 다음 가상 인덱스), 깃발도
 *  없으면 마지막 정거장 — "마지막으로 진행한 스텝에 서 있는다"(브리프 §7)의 그대로다. */
export function standIndexOf(stations: JourneyStep[], hasBoss: boolean): number {
  const hereIdx = stations.findIndex((s) => s.state === 'now');
  if (hereIdx >= 0) return hereIdx;
  if (hasBoss) return stations.length;
  return Math.max(0, stations.length - 1);
}

// ── 이동 시간 ────────────────────────────────────────────────────────────

// 한 칸(정거장 하나) 걷는 데 걸리는 기준 페이스. 220ms는 "누른 순간 바로 도착"처럼
// 보이지 않을 최소치이면서(그래야 K5의 "안 걷는다"와 눈으로 구별된다), 한 칸짜리
// 이동을 굼뜨게 만들 만큼 길지도 않다.
export const STEP_MS = 220;
// 주제가 47스텝까지 간다(브리프 §"반드시 알아야 할 데이터 모양") — STEP_MS를 거리에
// 곱하기만 하면 40칸 이동이 8.8초(40*220ms)가 되어 "견딜 수 없이 길다"(브리프 §7).
// 상한을 두어 먼 이동은 페이스 자체가 빨라지게 한다: 총 시간은 늘어나되 900ms에서
// 묶인다 — 도입부(처음 진입할 때 이미 반쯤 끝난 주제라 먼 정거장까지 걸어 들어오는
// 경우)와 다시 먼 곳으로 돌아가는 경우 모두 이 상한을 그대로 쓴다.
export const MAX_WALK_MS = 900;

/** distance는 정거장 칸수(정수, 음수 없음). 1칸=STEP_MS, 그 이상은 비례하되 MAX_WALK_MS
 *  에서 묶인다 — 1칸과 40칸의 시간이 다르면서도 40칸이 무한정 길어지지 않는 이유. */
export function walkDurationMs(distance: number): number {
  const d = Math.max(0, Math.round(distance));
  if (d === 0) return 0;
  return Math.min(d * STEP_MS, MAX_WALK_MS);
}

// ── 레이아웃 ────────────────────────────────────────────────────────────

const AVATAR_SIZE = 40;
const AVATAR_H = (AVATAR_SIZE * 70) / 64;
// 화면 왼쪽 밖 — 첫 걸음이 여기서 들어온다(브리프 §7, 읽는 방향과 같다).
const OFFSCREEN_X = -160;

// `t`가 첫 인자다 — i18n/useT.test.ts가 정확히 이 자리를 검사한다: 렌더 중에 불리는
// 헬퍼가 모듈 스코프의 번역 함수를 몰래 쓰면 React Compiler가 그 문자열을 인스턴스당
// 한 번만 계산하고 언어가 바뀌어도 그대로 캐시해 버린다(같은 규칙이 이미 여러 번 잡은
// 버그).
function stepLabel(t: Translate, step: JourneyStep): string {
  return step.name ?? t(STEP_META[(step.kind ?? 'dlg') as StepKind]?.labelKey ?? 'step.kind.dlg');
}

function stepSub(t: Translate, step: JourneyStep): string | undefined {
  const meta = STEP_META[(step.kind ?? 'dlg') as StepKind] ?? STEP_META.dlg;
  if (step.passes && step.passes > 1) return `${t(meta.labelKey)} · ${step.pass ?? 1}/${step.passes}`;
  return t(meta.labelKey);
}

export function StationTrack({ steps, onStepPress }: {
  steps: JourneyStep[];
  onStepPress(step: JourneyStep): void;
}) {
  const t = useT();
  const { width } = useWindowDimensions();
  const avatarSpec = useMyAvatar();

  const { stations, boss } = useMemo(() => splitBossStep(steps), [steps]);
  const hasBoss = !!boss;
  const hasContent = stations.length > 0 || hasBoss;
  const N = stations.length;

  const states = useMemo(() => stations.map(stepStationState), [stations]);
  const points = useMemo(() => stations.map((_, i) => stationPoint(i, width)), [stations, width]);
  const standIndex = useMemo(() => standIndexOf(stations, hasBoss), [stations, hasBoss]);

  const baseHeight = N === 0
    ? 0
    : points[N - 1].y + RADIUS[states[N - 1]] + 40 + LABEL_ALLOWANCE;
  const mapHeight = hasBoss ? baseHeight + MILESTONE_ALLOWANCE : baseHeight;
  const flagPoint: Point | null = hasBoss
    ? { x: width / 2, y: baseHeight + MILESTONE_GAP + MILESTONE_FLAG_HEIGHT / 2 }
    : null;

  // ── 모션 줄이기 (K7) — AnimatedFace.tsx와 같은 패턴: 초기값을 한 번 읽고, 바뀌면
  // 구독으로 따라간다. null은 "아직 모른다"로 남겨 둔다 — 도입 걷기가 그 답을 기다렸다가
  // 시작하게 하기 위해서다(모르는 채로 걷기 시작했다가 켜져 있었다고 뒤늦게 멈추면
  // 오히려 한 번 더 눈에 띈다).
  const [reduceMotion, setReduceMotion] = useState<boolean | null>(null);
  useEffect(() => {
    let alive = true;
    AccessibilityInfo.isReduceMotionEnabled().then((v) => { if (alive) setReduceMotion(v); });
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', (v: boolean) => setReduceMotion(v));
    return () => { alive = false; sub.remove(); };
  }, []);

  // 아바타의 "논리적" 위치(정수 인덱스, -1=화면 밖) — 지금 몇 칸 이동인지 잴 기준.
  const posRef = useRef(-1);
  // 아바타의 "그려지는" 위치 — 이 값을 애니메이션한다.
  const t$ = useRef(new Animated.Value(-1)).current;
  const enteredRef = useRef(false);

  function walkTo(target: number) {
    const distance = Math.abs(target - posRef.current);
    posRef.current = target;
    if (reduceMotion) {
      // K7 — 걷지 않고 즉시 이동.
      t$.setValue(target);
      return;
    }
    Animated.timing(t$, {
      toValue: target,
      duration: walkDurationMs(distance),
      easing: Easing.out(Easing.quad),
      useNativeDriver: false, // left/top은 네이티브 드라이버가 못 다룬다.
    }).start();
  }

  // 첫 진입 — 화면 왼쪽 밖에서 마지막으로 진행한 자리까지(브리프 §7). reduceMotion을
  // 아직 모르면(null) 기다린다.
  useEffect(() => {
    if (reduceMotion === null || !hasContent || enteredRef.current) return;
    enteredRef.current = true;
    walkTo(standIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion, hasContent, standIndex]);

  function pressStep(i: number, step: JourneyStep) {
    // K5 — 잠긴 스텝은 짧게 거절한다: 여기서 "거절"은 아무 일도 일어나지 않는 것이다.
    // far(점선·흐림)가 이미 "아직 못 간다"고 그리고 있어 걷지도, 라우팅하지도 않는 것
    // 자체가 그 거절이다 — 갈 수 없는 곳으로 걸어가는 연출은 잠금을 부정한다.
    if (step.state === 'lock') return;
    // K6 — 라우팅은 누르는 즉시. 걷기는 그 뒤가 아니라 같은 순간 겹쳐 시작한다(걷기를
    // 끝내고 나서 라우팅하면 지연이 더해지기만 한다).
    onStepPress(step);
    walkTo(i);
  }

  function pointAt(i: number): Point {
    if (i < 0) return { x: OFFSCREEN_X, y: points[0]?.y ?? 56 };
    if (i < N) return points[i];
    return flagPoint ?? points[N - 1] ?? { x: width / 2, y: 56 };
  }

  // hasContent가 참이면 항상 최소 두 원소([-1, 0])다 — 정거장이 하나도 없어도 깃발이
  // 있으면 [-1, 0]이 된다(N=0, hasBoss). interpolate는 최소 두 지점이 있어야 하므로,
  // 이 계산 자체를 hasContent가 거짓일 때는 하지 않는다(아바타를 그리지 않을 때라
  // 값도 안 쓴다).
  const indices = useMemo(() => {
    const arr = [-1, ...Array.from({ length: N }, (_, i) => i)];
    if (hasBoss) arr.push(N);
    return arr;
  }, [N, hasBoss]);
  const animX = hasContent
    ? t$.interpolate({ inputRange: indices, outputRange: indices.map((i) => pointAt(i).x) })
    : t$;
  const animY = hasContent
    ? t$.interpolate({ inputRange: indices, outputRange: indices.map((i) => pointAt(i).y) })
    : t$;

  const milestoneState = bossMilestoneState(boss?.state);
  // 마지막 정거장에서 깃발로 이어지는 구간도 "양쪽 다 끝났을 때만" 이어진 것으로 그린다
  // (JourneyMap.tsx의 같은 원칙 — 한쪽만 끝난 구간은 여전히 갈 길이다).
  const lastToFlagDone = N > 0 && states[N - 1] === 'done' && milestoneState === 'passed';

  return (
    <ScrollView testID="station-track-scroll" contentContainerStyle={{ paddingBottom: BOTTOM_PAD }}>
      <View testID="station-track" style={{ height: mapHeight }}>
        <Svg width={width} height={mapHeight} style={{ position: 'absolute', left: 0, top: 0 }}>
          {points.slice(0, -1).map((from, i) => (
            <PathSegment key={i} from={from} to={points[i + 1]} done={states[i] === 'done' && states[i + 1] === 'done'} />
          ))}
          {hasBoss && N > 0 && flagPoint && (
            <PathSegment from={points[N - 1]} to={{ x: flagPoint.x, y: flagPoint.y - MILESTONE_FLAG_HEIGHT / 2 }} done={lastToFlagDone} />
          )}
        </Svg>

        {stations.map((step, i) => {
          const state = states[i];
          const p = points[i];
          const offset = RADIUS[state] + 28; // Station이 (r+28, r+28)에 원을 그린다.
          const key = step.scenarioId ?? step.name ?? String(i);
          return (
            <View key={key} style={{ position: 'absolute', left: p.x - offset, top: p.y - offset }}>
              <Station
                state={state}
                label={stepLabel(t, step)}
                sub={stepSub(t, step)}
                onPress={() => pressStep(i, step)}
              />
            </View>
          );
        })}

        {hasBoss && (
          <View
            testID="milestone-flag-slot"
            style={{ position: 'absolute', left: width / 2 - MILESTONE_FLAG_WIDTH / 2, top: baseHeight + MILESTONE_GAP }}
          >
            <MilestoneFlag title={boss?.name ?? ''} state={milestoneState} />
          </View>
        )}

        {hasContent && (
          <Animated.View
            testID="station-avatar"
            pointerEvents="none"
            style={{ position: 'absolute', left: animX, top: animY, marginLeft: -AVATAR_SIZE / 2, marginTop: -AVATAR_H / 2 }}
          >
            <NbAvatar spec={avatarSpec ?? undefined} size={AVATAR_SIZE} />
          </Animated.View>
        )}
      </View>
    </ScrollView>
  );
}
