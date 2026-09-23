// StationTrack — 2단계(주제 화면)의 그림. journey-binder-v42 Task H,
// .superpowers/sdd/journey-binder-v42/task-H-brief.md (정본, §1~§8) ·
// docs/dlc/projects/forin/inputs/design-handoff_v42/reference/forin-notebook-journey2.jsx
// `Stamp()`/`Yarn()`/`StampTrail()`.
//
// Task H는 이 화면의 그림만 바꾼다 — 정거장 지그재그 지도를 불규칙 우표 산책길로. 아래는
// 이 파일이 이미 쥐고 있던 규칙(K4~K7)이고, 그림을 바꾸는 동안 그대로 살아남아야 한다
// (task-H-brief.md §1):
//
//  - K5 잠긴 스텝은 걷지도 이동하지도 않는다 — `pressStep`의 `if (step.state === 'lock') return;`
//  - K6 누르는 즉시 라우팅하고 걷기는 겹쳐 시작한다 — 걷기를 끝내고 라우팅하지 않는다
//  - K7 모션 줄이기 — `AccessibilityInfo.isReduceMotionEnabled()` + `reduceMotionChanged`
//    구독, `null`(아직 모름) 동안 도입 걷기를 기다린다
//  - 첫 진입은 화면 왼쪽 밖에서 걸어 들어온다, 거리에 따라 속도가 다르되 상한이 있다
//  - 끝의 `boss` 스텝은 정거장(우표)이 아니라 깃발이다(`splitBossStep`, `bossMilestoneState`)
//  - 스텝을 전부 그린다(V7) — 줄이거나 묶지 않는다
//  - 키는 위치로 만든다 — 한 대화가 두 회차로 와서 `scenarioId`와 `name`을 공유하기 때문이다
//
// 서버가 이제 스텝마다 `difficulty`를 싣는다(커밋 8b72475) — 구간 경계는 그 값에서 나온다.
// 우리 주제는 41~47스텝에 계단 구성이 제각각이라(V6) 12개씩 끊지 않는다.
import { useEffect, useMemo, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, Platform, Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import Svg, { Circle, G, Line, Path, Text as SvgText } from 'react-native-svg';
import type { JourneyStep } from '@/api/client';
import { useMyAvatar } from '@/hooks/useMyAvatar';
import { NbAvatar } from '@/components/nb/NbAvatar';
import { NbIcon, type NbIconName } from '@/components/nb/NbIcon';
import { NbButton, NbPaper, nbText } from '@/components/nb/NbUI';
import { NbStampNode, type NbStampState } from '@/components/nb/NbStampNode';
import { NbYarn, type YarnPoint } from '@/components/nb/NbYarn';
import { STEP_META, type StepKind } from '@/data/campus';
import { useT, type Translate } from '@/i18n';
import { MILESTONE_FLAG_HEIGHT, MILESTONE_FLAG_WIDTH, MilestoneFlag, type MilestoneState } from './MilestoneFlag';
import type { Point } from './PathSegment';
import { PathSegment } from './PathSegment';
import { nb, nbFonts, RULE_COLOR, RULE_H } from '@/theme/nb';

// ── 상태 매핑 (state, kind→우표/깃발 어휘) ─────────────────────────────────

export type StationState = 'done' | 'here' | 'next' | 'far';

/**
 * 서버의 넷(done/now/lock/optional)을 이 화면이 아는 넷(done/here/next/far)으로 옮긴다.
 * `now`가 `here`인 것은 작업 지시가 못박은 값(브리프 §6)이고, 나머지 셋은 이 파일이
 * 정한다:
 *
 *  - `done` → `done`: 그대로.
 *  - `lock` → `far`: 진짜로 잠긴다(J2)는 사실은 여기서 그리지 않는다 — 우표는 어떤
 *    상태에서도 자물쇠를 그리지 않는다(잠긴 우표에 lock 아이콘을 그리는 것과는 다른
 *    얘기다: 실제 게이팅은 이 컴포넌트가 아니라 `pressStep`(K5)이 한다).
 *  - `optional` → `next`: "언제든 풀 수 있는 보너스, 아무것도 잠그지 않는다" —
 *    `far`(=우표의 `locked`)로 그리면 잠긴 것처럼 보여 그 정의와 모순된다.
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

/** `stepStationState`가 낸 넷(브리프 §6이 못박은 값)을 우표의 넷(NbStampNode.state)으로
 *  옮긴다 — 이름만 다를 뿐 `far`→`locked` 하나 말고는 항등이다. */
export function stampStateOf(state: StationState): NbStampState {
  return state === 'far' ? 'locked' : state;
}

/**
 * 끝의 `boss` 스텝은 정거장(우표)이 아니라 구간 시험 깃발이다(브리프 §1) — `scenarioId`가
 * 없는 것도 그 근거지만, 쪼개는 기준은 `kind`다: MilestoneFlag가 이미 그 개념을 쥐고 있고,
 * `kind`가 서버가 실제로 보내는 필드이기 때문이다.
 */
export function splitBossStep(steps: JourneyStep[]): { stations: JourneyStep[]; boss?: JourneyStep } {
  if (steps.length > 0 && steps[steps.length - 1].kind === 'boss') {
    return { stations: steps.slice(0, -1), boss: steps[steps.length - 1] };
  }
  return { stations: steps };
}

/** boss 스텝의 state(done/now/lock)를 MilestoneFlag의 셋(passed/open/closed)으로 옮긴다.
 *  알 수 없는 값은 안전하게 closed로 — 서버가 안 보낸 것을 open으로 지어내지 않는다. */
export function bossMilestoneState(state?: string): MilestoneState {
  if (state === 'done') return 'passed';
  if (state === 'now') return 'open';
  return 'closed';
}

/** 학습자가 지금 서 있을 자리. `now` 스텝이 있으면 그 인덱스, 없으면(트랙 전부 통과)
 *  깃발이 있는 트랙에서는 깃발 앞(=stations.length, 정거장 다음 가상 인덱스), 깃발도
 *  없으면 마지막 정거장 — "마지막으로 진행한 스텝에 서 있는다"의 그대로다. */
export function standIndexOf(stations: JourneyStep[], hasBoss: boolean): number {
  const hereIdx = stations.findIndex((s) => s.state === 'now');
  if (hereIdx >= 0) return hereIdx;
  if (hasBoss) return stations.length;
  return Math.max(0, stations.length - 1);
}

// ── 구간 경계(§5-3) ──────────────────────────────────────────────────────

/** 난이도가 바뀌는 자리마다(그리고 항상 맨 앞에) 경계를 하나 둔다. 12개마다 끊지
 *  않는다(V6) — 핸드오프의 12는 "주제가 36스텝"이라는, 우리에게는 없는 전제에서 나온
 *  값이다. `difficulty`가 내내 같으면(또는 서버가 아직 안 보내면, 즉 내내 `undefined`면)
 *  경계는 맨 앞 하나뿐이다. */
export function sectionBoundaries(stations: JourneyStep[]): number[] {
  const bounds: number[] = [];
  let prev: number | undefined;
  stations.forEach((s, i) => {
    if (i === 0 || s.difficulty !== prev) bounds.push(i);
    prev = s.difficulty;
  });
  return bounds;
}

/** 1·2·3만 이름이 있다(기초·실전·심화, 새 i18n 키 `journey.tier.1/.2/.3`). 그 밖의 값
 *  (비었거나 4 이상)은 이름을 지어내지 않고 잔선만 긋는다(브리프 §5-3). */
export function tierLabelKey(difficulty: number | undefined): string | null {
  if (difficulty === 1 || difficulty === 2 || difficulty === 3) return `journey.tier.${difficulty}`;
  return null;
}

// ── 배치 — 불규칙 우표 산책길(§2) ───────────────────────────────────────

// 기준 패턴 10점, 디자인 뷰포트 폭 402 기준(브리프 §2 그대로).
const STAMP_BASE10: Point[] = [
  { x: 70, y: 80 }, { x: 200, y: 130 }, { x: 318, y: 92 }, { x: 300, y: 232 }, { x: 160, y: 262 },
  { x: 64, y: 372 }, { x: 212, y: 400 }, { x: 330, y: 372 }, { x: 250, y: 520 }, { x: 96, y: 540 },
];
const STAMP_CYCLE_Y = 600;
const DESIGN_WIDTH = 402;

/** i번째 우표의 좌표. 10점 주기를 600px마다 되풀이하고, 주기가 바뀔 때마다 좌우로
 *  살짝 흔든다(홀수 주기 +8, 짝수 주기 -6) — 손으로 흩뿌린 듯한 불규칙함을 유한한
 *  패턴으로 낸다. x는 흔들림을 더한 뒤에 화면 폭(width/402)으로 비례 스케일한다 —
 *  402를 그대로 쓰면 좁은 기기에서 오른쪽 우표가 잘리고 넓은 기기에서 왼쪽에 몰린다.
 *  y는 스케일하지 않는다(세로는 스크롤이라 잘릴 일이 없다). */
export function stampPoint(i: number, width: number): Point {
  const base = STAMP_BASE10[i % 10];
  const cycle = Math.floor(i / 10);
  const jitter = cycle % 2 ? 8 : -6;
  return { x: ((base.x + jitter) * width) / DESIGN_WIDTH, y: base.y + cycle * STAMP_CYCLE_Y };
}

function scaleX(x: number, width: number): number {
  return (x * width) / DESIGN_WIDTH;
}

// ── 이동 시간 ────────────────────────────────────────────────────────────

// 한 칸(우표 하나) 걷는 데 걸리는 기준 페이스. 220ms는 "누른 순간 바로 도착"처럼
// 보이지 않을 최소치이면서(그래야 K5의 "안 걷는다"와 눈으로 구별된다), 한 칸짜리
// 이동을 굼뜨게 만들 만큼 길지도 않다.
export const STEP_MS = 220;
// 주제가 47스텝까지 간다 — STEP_MS를 거리에 곱하기만 하면 40칸 이동이 8.8초가 되어
// "견딜 수 없이 길다". 상한을 두어 먼 이동은 페이스 자체가 빨라지게 한다.
export const MAX_WALK_MS = 900;

/** distance는 우표 칸수(정수, 음수 없음). 1칸=STEP_MS, 그 이상은 비례하되 MAX_WALK_MS
 *  에서 묶인다. */
export function walkDurationMs(distance: number): number {
  const d = Math.max(0, Math.round(distance));
  if (d === 0) return 0;
  return Math.min(d * STEP_MS, MAX_WALK_MS);
}

// ── 레이아웃 상수 ────────────────────────────────────────────────────────

const STAMP_SIZE = 62;
const AVATAR_SIZE = 40;
const AVATAR_H = (AVATAR_SIZE * 70) / 64;
// 우표 위에 겹치지 않게 우표 왼쪽에 선다(브리프 §5-7) — 우표 중심에서 이만큼 왼쪽으로.
const AVATAR_LEFT_OFFSET = 31 + AVATAR_SIZE / 2 + 4;
// 화면 왼쪽 밖 — 첫 걸음이 여기서 들어온다(읽는 방향과 같다).
const OFFSCREEN_X = -160;

// 깃발 한 칸이 트랙 끝에 붙을 때 더 필요한 세로 자리 — MilestoneFlag.tsx가 쥔
// MILESTONE_FLAG_HEIGHT(34)에 위아래 거터(20)를 더한 값. 예전 JourneyMap.tsx가
// 내주던 MILESTONE_GAP/MILESTONE_ALLOWANCE와 같은 계산이지만, 이제 이 화면만 쓰므로
// 그 파일에서 빌려 오지 않고 여기 직접 둔다.
const FLAG_GAP = 20;
const FLAG_ALLOWANCE = FLAG_GAP + MILESTONE_FLAG_HEIGHT;

// 고정 바(현재 우표 카드)에 가리지 않는 스크롤 하단 여백. 카드 자체가 bottom 20(+
// 안전영역)에 떠 있고 대략 60~70px 높이이므로, 90~100px 정도면 여유가 있다 — 예전
// JourneyMap.tsx의 BOTTOM_PAD(120)와 같은 자리, 같은 여유를 둔다.
export const BOTTOM_PAD = 120;

// 이름표가 우표 박스(62)보다 넓어도 되는 이유 — Station.tsx가 쥐고 있던 것과 같은
// 판단이다: 라벨을 우표 폭에 묶으면 중간 길이 이름도 잘린다. 140은 그 폭을 그대로
// 옮긴 값이다(두 줄이 아니라 한 줄 + numberOfLines=1이라 여기서는 잘림 자체가
// 최종 방어선이지만, 폭을 넓혀 두면 잘리는 빈도가 준다).
const NAME_LABEL_WIDTH = 140;

// 우표 아래 이름표를 '· · ·'로 접는 기준 — 현재 위치보다 이보다 많이 뒤에 있는
// "locked" 우표는 이름 대신 이걸 보여 이름이 글자 벽이 되는 것을 막는다(브리프 §5-5).
const DIM_NAME_DISTANCE = 6;

// 두들/우표 등장 딜레이가 참조하는 회전각 순환(브리프 §3 "기울임").
const STAMP_ROTS = [-5, 4, -2, 6, -4, 3, -6, 2, 5, -3, 4, -5] as const;
const STAMP_WASHES = ['rgba(95,141,90,.16)', 'rgba(74,111,165,.16)', 'rgba(233,150,100,.18)'] as const;

// 하단 안전 영역(홈 인디케이터). 이 화면 계열(nb 디자인 라인)은 어디서도
// `useSafeAreaInsets`를 쓰지 않는다(dialogue/[id].tsx의 "20 is the resting gap above
// the home indicator" 주석이 같은 자리에서 같은 선택을 한다) — 실측 대신 iOS의 홈
// 인디케이터 통상값(34)을 더해 두는 정도로 족하고, 그러면 이 화면의 테스트가
// SafeAreaProvider를 새로 몰라도 된다.
const BOTTOM_SAFE_PAD = Platform.OS === 'ios' ? 34 : 0;

function stepLabel(t: Translate, step: JourneyStep): string {
  return step.name ?? t(STEP_META[(step.kind ?? 'dlg') as StepKind]?.labelKey ?? 'step.kind.dlg');
}

function stepSub(t: Translate, step: JourneyStep): string | undefined {
  const meta = STEP_META[(step.kind ?? 'dlg') as StepKind] ?? STEP_META.dlg;
  if (step.passes && step.passes > 1) return `${t(meta.labelKey)} · ${step.pass ?? 1}/${step.passes}`;
  return t(meta.labelKey);
}

/** 스텝의 kind로 아이콘을 고른다 — 핸드오프처럼 12개를 순환시키지 않는다(브리프 §5-5):
 *  아이콘이 내용과 무관하게 돌면 거짓말이 된다. */
function iconForStep(step: JourneyStep): NbIconName {
  if (step.kind === 'quiz') return 'board';
  if (step.kind === 'event') return 'bell';
  return 'speech';
}

// ── 배경 두들 — 600px 주기마다 반복(§5-2) ──────────────────────────────

function CloudDoodle({ x, y, width }: { x: number; y: number; width: number }) {
  const sx = scaleX(x, width);
  return <Path d={`M${sx} ${y} q6 -10 14 -2 q8 -8 14 2 q8 2 2 8 h-28 q-6 -4 -2 -8`} fill="none" stroke="rgba(62,54,43,.2)" strokeWidth={1.3} />;
}
function StarDoodle({ x, y, width }: { x: number; y: number; width: number }) {
  const sx = scaleX(x, width);
  const sx2 = scaleX(x + 4, width);
  return <Path d={`M${sx} ${y} l4 -8 l4 8 M${sx2} ${y - 8} v-5`} fill="none" stroke="rgba(62,54,43,.2)" strokeWidth={1.3} strokeLinecap="round" />;
}
function CircleDoodle({ x, y, width }: { x: number; y: number; width: number }) {
  const sx = scaleX(x, width);
  const sx2 = scaleX(x + 12, width);
  return (
    <G fill="none" stroke="rgba(62,54,43,.2)" strokeWidth={1.3}>
      <Circle cx={sx} cy={y} r={3} />
      <Circle cx={sx2} cy={y - 7} r={1.6} />
    </G>
  );
}

/** 한 주기(600px) 분량의 두들 — 위치는 브리프 §5-2가 못박은 값 그대로다. */
function DoodleCycle({ width }: { width: number }) {
  const cx = (x: number) => scaleX(x, width);
  return (
    <>
      <CloudDoodle x={330} y={30} width={width} />
      <CloudDoodle x={22} y={200} width={width} />
      <StarDoodle x={355} y={470} width={width} />
      <CircleDoodle x={372} y={300} width={width} />
      <StarDoodle x={250} y={330} width={width} />
      {/* 작은 십자 둘 — 나머지 두들보다 살짝 진하다(.22, 나머지는 .2, 브리프 §5-2). */}
      <Path d={`M${cx(40)} 470 h10 M${cx(45)} 465 v10`} stroke="rgba(62,54,43,.22)" strokeWidth={1.3} strokeLinecap="round" />
      <Path d={`M${cx(120)} 560 h8 M${cx(124)} 556 v8`} stroke="rgba(62,54,43,.22)" strokeWidth={1.3} strokeLinecap="round" />
    </>
  );
}

/** 지나온 구간과 다른 흔들림으로 미래 구간을 잇는 연필 점선(§5-4) — `NbYarn`과 같은
 *  Q-베지어 조립 방식이지만 제어점 흔들림이 다르고(+10/-10, y는 중점 그대로), 애니메이션도
 *  없다(핀으로 고정된 실이 아니라 아직 걷지 않은 길이라 정적이다). */
function futurePathD(pts: Point[]): string {
  if (pts.length < 2) return '';
  let d = `M${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const p0 = pts[i - 1];
    const p1 = pts[i];
    const mx = (p0.x + p1.x) / 2 + (i % 2 ? 10 : -10);
    const my = (p0.y + p1.y) / 2;
    d += ` Q${mx} ${my} ${p1.x} ${p1.y}`;
  }
  return d;
}

export function StationTrack({ steps, onStepPress }: {
  steps: JourneyStep[];
  onStepPress(step: JourneyStep): void;
}) {
  const t = useT();
  const { width, height: winHeight } = useWindowDimensions();
  const avatarSpec = useMyAvatar();
  const scrollRef = useRef<ScrollView>(null);

  const { stations, boss } = useMemo(() => splitBossStep(steps), [steps]);
  const hasBoss = !!boss;
  const hasContent = stations.length > 0 || hasBoss;
  const N = stations.length;

  const states = useMemo(() => stations.map(stepStationState), [stations]);
  const points = useMemo(() => stations.map((_, i) => stampPoint(i, width)), [stations, width]);
  const standIndex = useMemo(() => standIndexOf(stations, hasBoss), [stations, hasBoss]);
  const bounds = useMemo(() => sectionBoundaries(stations), [stations]);

  const baseHeight = N === 0 ? 0 : points[N - 1].y + 130;
  const mapHeight = hasBoss ? baseHeight + FLAG_ALLOWANCE : baseHeight;
  const flagPoint: Point | null = hasBoss
    ? { x: width / 2, y: baseHeight + FLAG_GAP + MILESTONE_FLAG_HEIGHT / 2 }
    : null;

  // ── 모션 줄이기 (K7) ─────────────────────────────────────────────────────
  const [reduceMotion, setReduceMotion] = useState<boolean | null>(null);
  useEffect(() => {
    let alive = true;
    AccessibilityInfo.isReduceMotionEnabled().then((v) => { if (alive) setReduceMotion(v); });
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', (v: boolean) => setReduceMotion(v));
    return () => { alive = false; sub.remove(); };
  }, []);
  // 아직 모르는 동안(null)은 켜져 있다고 가정한다 — 도입 애니메이션이 잠깐 돌았다가
  // 꺼지는 깜빡임보다, 알고 나서 뒤늦게 켜지는 쪽이 눈에 덜 띈다.
  const motionOn = reduceMotion === false;

  // 아바타의 "논리적" 위치(정수 인덱스, -1=화면 밖) — 지금 몇 칸 이동인지 잴 기준.
  const posRef = useRef(-1);
  // 아바타의 "그려지는" 위치 — 이 값을 애니메이션한다.
  const t$ = useRef(new Animated.Value(-1)).current;
  const enteredRef = useRef(false);

  // 아래 네 헬퍼는 전부 화살표 함수(const)로 둔다 — `function` 선언으로 두면
  // i18n/useT.test.ts의 검사기가 "이 함수가 다음 `function` 선언 전까지의 소스를 자기
  // 몸통으로 갖는다"고 (정규식으로, 중첩을 모른 채) 잘못 가정해, 컴포넌트 본문 끝의
  // JSX(그 안의 진짜 `t(...)` 호출들)를 이 중 마지막 헬퍼 탓으로 돌린다 — 실제로 그
  // 오탐이 `withinInitialView`에서 한 번 났었다(이 함수들은 어차피 컴포넌트 밖에서
  // 독립적으로 재사용될 이름도 아니라 화살표로 바꿔도 잃는 것이 없다).
  const walkTo = (target: number) => {
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
  };

  // 첫 진입 — 화면 왼쪽 밖에서 마지막으로 진행한 자리까지. reduceMotion을 아직
  // 모르면(null) 기다린다.
  useEffect(() => {
    if (reduceMotion === null || !hasContent || enteredRef.current) return;
    enteredRef.current = true;
    walkTo(standIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion, hasContent, standIndex]);

  const pressStep = (i: number, step: JourneyStep) => {
    // K5 — 잠긴 스텝은 짧게 거절한다: 여기서 "거절"은 아무 일도 일어나지 않는 것이다.
    if (step.state === 'lock') return;
    // K6 — 라우팅은 누르는 즉시. 걷기는 그 뒤가 아니라 같은 순간 겹쳐 시작한다.
    onStepPress(step);
    walkTo(i);
  };

  /** 우표 좌표(순수) → 아바타가 서는 좌표(우표 왼쪽으로 옮긴 것). i<0은 화면 밖,
   *  i>=N은 깃발 옆. */
  const avatarPointAt = (i: number): Point => {
    if (i < 0) return { x: OFFSCREEN_X, y: points[0]?.y ?? 56 };
    if (i < N) return { x: points[i].x - AVATAR_LEFT_OFFSET, y: points[i].y };
    const fp = flagPoint ?? points[N - 1] ?? { x: width / 2, y: 56 };
    return { x: fp.x - AVATAR_LEFT_OFFSET, y: fp.y };
  };

  const indices = useMemo(() => {
    const arr = [-1, ...Array.from({ length: N }, (_, i) => i)];
    if (hasBoss) arr.push(N);
    return arr;
  }, [N, hasBoss]);
  const animX = hasContent
    ? t$.interpolate({ inputRange: indices, outputRange: indices.map((i) => avatarPointAt(i).x) })
    : t$;
  const animY = hasContent
    ? t$.interpolate({ inputRange: indices, outputRange: indices.map((i) => avatarPointAt(i).y) })
    : t$;

  const milestoneState = bossMilestoneState(boss?.state);
  const lastToFlagDone = N > 0 && states[N - 1] === 'done' && milestoneState === 'passed';

  // ── 길(§5-4) — 지나온 구간은 실, 앞 구간은 연필 점선. "현재"가 없으면(전부 통과)
  // 실이 끝까지 간다. ─────────────────────────────────────────────────────
  const hasNow = stations.some((s) => s.state === 'now');
  const doneUpTo = N === 0 ? -1 : hasNow ? standIndex : N - 1;
  const yarnPts: YarnPoint[] = points.slice(0, doneUpTo + 1);
  const futurePts: Point[] = points.slice(Math.max(doneUpTo, 0));
  const futureD = futurePathD(futurePts);

  // ── 들어오면 현재 위치 근처로 스크롤한다(§2) ─────────────────────────────
  const initialScrollY = hasContent ? Math.max(0, avatarPointAt(standIndex).y - 300) : 0;
  const didScrollRef = useRef(false);
  useEffect(() => {
    if (didScrollRef.current || !hasContent) return;
    didScrollRef.current = true;
    scrollRef.current?.scrollTo({ y: initialScrollY, animated: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasContent]);

  // ── 우표 등장(pop) — 처음 화면에 보이는 범위만 애니메이션한다(§7). 41~47개가
  // 한 화면에 있으므로, 인덱스 거리만으로는 "몇 개가 동시에 도는지"를 못 줄인다 —
  // 불규칙 산책길이라 인덱스 몇 칸 안에 몰린 우표가 화면 밖일 수도, 화면 안일 수도
  // 있어서다. 그래서 실제로 스크롤이 처음 앉는 픽셀 구간(initialScrollY 위아래
  // 한 화면 + 여유 80px)에 들어오는 우표만 켠다 — 나머지는 곧바로 제자리(최종
  // 포즈)로 그린다. ───────────────────────────────────────────────────────
  const withinInitialView = (y: number): boolean => {
    return y >= initialScrollY - 80 && y <= initialScrollY + winHeight + 80;
  };

  return (
    // 카드가 화면 아래 고정이어야 한다(§5-6) — ScrollView 안에 두면 스크롤을 따라
    // 같이 흘러가 버린다(브리프가 말하는 "고정"과 반대). 그래서 Fragment로 갈라
    // ScrollView와 형제로 두고, 카드는 그 바깥에서 화면 자체(NbSheet가 채우는
    // flex:1 박스) 기준으로 절대 위치를 잡는다 — 예전 CurrentStationBar와 같은 자리.
    <>
      <ScrollView ref={scrollRef} testID="station-track-scroll" contentContainerStyle={{ paddingBottom: BOTTOM_PAD }}>
        <View testID="station-track" style={{ height: mapHeight }}>
          {/* 5-1 배경 — 줄 노트. 산책길 전체 높이를 따라간다(화면 높이가 아니다) —
              이 View 자체가 스크롤 콘텐츠 안에 있어서 그대로 함께 스크롤된다. */}
          <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, overflow: 'hidden' }}>
            {Array.from({ length: Math.ceil(mapHeight / RULE_H) }).map((_, i) => (
              <View key={i} style={{ position: 'absolute', left: 0, right: 0, top: (i + 1) * RULE_H, height: 1, backgroundColor: RULE_COLOR }} />
            ))}
          </View>

          <Svg width={width} height={mapHeight} style={{ position: 'absolute', left: 0, top: 0 }}>
            {/* 5-2 두들 — 600px 주기마다 반복. */}
            {Array.from({ length: Math.max(1, Math.ceil(mapHeight / STAMP_CYCLE_Y)) }).map((_, k) => (
              <G key={k} y={k * STAMP_CYCLE_Y}>
                <DoodleCycle width={width} />
              </G>
            ))}

            {/* 5-3 구간 경계 — difficulty가 바뀌는 자리(12개마다가 아니다, V6). */}
            {bounds.map((k, j) => {
              const end = j + 1 < bounds.length ? bounds[j + 1] - 1 : N - 1;
              const y = points[k].y - 62;
              const x1 = scaleX(18, width);
              const x2 = scaleX(384, width);
              const labelKey = tierLabelKey(stations[k].difficulty);
              return (
                <G key={k}>
                  <Line x1={x1} x2={x2} y1={y} y2={y} stroke="rgba(62,54,43,.18)" strokeWidth={1} strokeDasharray="2 4" />
                  {labelKey && (
                    <SvgHandLabel x={x1} y={y - 6} text={`— ${t(labelKey)} ${k + 1}~${end + 1}`} />
                  )}
                </G>
              );
            })}

            {/* 5-4 길 — 앞 구간(연필 점선)을 먼저, 지나온 구간(실)을 그 위에. */}
            <Path testID="future-path" d={futureD} fill="none" stroke="rgba(62,54,43,.28)" strokeWidth={1.5} strokeDasharray="4 5" />
            <NbYarn pts={yarnPts} reduceMotion={!motionOn} />

            {hasBoss && N > 0 && flagPoint && (
              <PathSegment from={points[N - 1]} to={{ x: flagPoint.x, y: flagPoint.y - MILESTONE_FLAG_HEIGHT / 2 }} done={lastToFlagDone} />
            )}
          </Svg>

          {/* 5-5 우표와 이름표. */}
          {stations.map((step, i) => {
            const state = states[i];
            const stampState = stampStateOf(state);
            const p = points[i];
            // 위치가 키다 — 한 대화가 두 회차로 오면 scenarioId·name을 공유해서다.
            const key = `${i}:${step.scenarioId ?? step.name ?? ''}`;
            const dimName = stampState === 'locked' && i > standIndex + DIM_NAME_DISTANCE;
            const label = dimName ? '· · ·' : stepLabel(t, step);
            const animate = motionOn && withinInitialView(p.y);
            return (
              <Pressable
                key={key}
                testID="station-press"
                onPress={() => pressStep(i, step)}
                accessibilityRole="button"
                accessibilityLabel={stepLabel(t, step)}
                style={{ position: 'absolute', left: p.x - 31, top: p.y - 31 }}
              >
                <NbStampNode
                  state={stampState}
                  icon={iconForStep(step)}
                  n={i + 1}
                  wash={STAMP_WASHES[i % 3]}
                  rot={STAMP_ROTS[i % 12]}
                  delay={Math.min(Math.abs(i - standIndex), 6) * 0.06}
                  animate={animate}
                />
                <View
                  pointerEvents="none"
                  style={{ position: 'absolute', top: 66, left: (STAMP_SIZE - NAME_LABEL_WIDTH) / 2, width: NAME_LABEL_WIDTH, alignItems: 'center' }}
                >
                  <Text
                    testID="station-label"
                    numberOfLines={1}
                    style={{
                      fontFamily: nbFonts.hand,
                      fontSize: 12.5,
                      color: stampState === 'locked' ? nb.soft : nb.ink,
                      backgroundColor: 'rgba(241,235,221,.85)',
                      paddingHorizontal: 4,
                      opacity: dimName ? 0.55 : 1,
                    }}
                  >
                    {label}
                  </Text>
                </View>
              </Pressable>
            );
          })}

          {hasBoss && (
            <View
              testID="milestone-flag-slot"
              style={{ position: 'absolute', left: width / 2 - MILESTONE_FLAG_WIDTH / 2, top: baseHeight + FLAG_GAP }}
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

      {/* 5-6 현재 우표 카드 — 화면 아래 고정. 현재 스텝이 없으면(전부 통과) 그리지
          않는다(지어내지 않는다). ScrollView 밖(위 주석 참고)이라 스크롤과 무관하게
          같은 자리에 떠 있는다. */}
      {hasNow && (() => {
        const nowIndex = stations.findIndex((s) => s.state === 'now');
        const nowStep = stations[nowIndex];
        const sub = stepSub(t, nowStep);
        return (
          <View
            testID="stamp-current-card"
            style={{ position: 'absolute', left: 16, right: 16, bottom: 20 + BOTTOM_SAFE_PAD }}
          >
            <NbPaper rot={-0.4} tape tapeLeft={120} style={{ paddingVertical: 10, paddingHorizontal: 13, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={{ width: 40, height: 40, backgroundColor: 'rgba(233,196,90,.28)', borderWidth: 1.6, borderColor: nb.marker, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-4deg' }] }}>
                <NbIcon name={iconForStep(nowStep)} size={22} />
              </View>
              <View style={{ minWidth: 0, flex: 1 }}>
                <Text numberOfLines={1} style={nbText.hand(16)}>{`${nowIndex + 1} · ${stepLabel(t, nowStep)}`}</Text>
                {!!sub && <Text numberOfLines={1} style={[nbText.body(10.5, nb.soft), { marginTop: 2 }]}>{sub}</Text>}
              </View>
              <NbButton variant="ink" size="sm" icon="pencil" onPress={() => pressStep(nowIndex, nowStep)}>
                {t('common.start')}
              </NbButton>
            </NbPaper>
          </View>
        );
      })()}
    </>
  );
}

/** 구간 경계 라벨 — RN Text가 아니라 SVG Text를 쓴다: 이 라벨이 배경 SVG(두들·잔선)와
 *  같은 좌표계에 있어야 해서다(폭 비례 스케일이 이미 SVG 좌표로 계산돼 있다). */
function SvgHandLabel({ x, y, text }: { x: number; y: number; text: string }) {
  return (
    <SvgText x={x} y={y} fontFamily={nbFonts.hand} fontSize={12.5} fill={nb.soft}>
      {text}
    </SvgText>
  );
}
