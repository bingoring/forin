// 수첩 모션 — 핸드오프 v46의 CSS keyframes를 RN Animated로.
//
// 정본(R1):
//   WL = docs/dlc/projects/forin/inputs/design-handoff_v46/reference/forin-notebook-lesson-words-live.jsx L12–33
//        (nb-tear-r/l · nb-rise · nb-stub · nb-shake · nb-ok · nb-reveal)
//   NU = 같은 폴더 forin-notebook-lesson-nuance.jsx L13–25 (nb-swipe-out · nb-swipe-in · nb-reveal · nb-ok)
//   LS = 같은 폴더 forin-notebook-lesson.jsx L10–16 (nbl-pop)
//   UI = 같은 폴더 forin-notebook-ui.jsx L17–20 (.nb-press · .nb-chip)
//   진행 바 색: WL L268 · SL(forin-notebook-lesson-sent-live.jsx) L195 · NU L74 `transition: background .3s`
//
// 옮길 때 지킨 세 가지 — 셋 다 화면에서는 "움직이긴 하는데 다르다"로만 드러나서 테스트로 묶었다:
//
//  1. CSS는 키프레임 구간마다 이징을 다시 건다. 그래서 여러 단계 keyframes는 구간마다
//     Animated.timing을 두고 sequence로 잇는다(data/keyframes.ts의 keyframeSegments).
//  2. CSS는 속성마다 키프레임을 따로 센다. 어떤 키프레임에 이름이 없는 속성은 그 키프레임을
//     지나치지 않는다 — nb-tear의 opacity는 100%에만 있어 18%에서 꺾이지 않고 620ms 한 구간,
//     nbl-pop의 opacity는 0%·100%에만 있어 350ms 한 구간이다. 그래서 속성(트랙)마다 자기 시계를
//     가진다. 이름이 없는 끝 키프레임은 요소 자신의 값(투명도 1, 변형 없음)이다.
//  3. transform은 쓴 순서대로 합성된다. `rotate(22deg) translate(300px,-80px)`는 돌린 좌표계에서
//     민다 — 트랙 배열의 순서가 곧 CSS 함수 순서다.
//
// 모든 트랙은 transform·opacity라 useNativeDriver: true(수첩 관례: NbStampNode·PageCurl).
// 색 전환(진행 바)만 네이티브로 못 돌려 JS 드라이버의 별도 값으로 둔다.
//
// 모션 줄이기: 저장소 관례(StationTrack·useBinderCoverFlight)대로 AccessibilityInfo를 읽되,
// 구독은 앱 전체에 하나만 두고 훅이 그 값을 나눠 읽는다. 켜져 있으면 모든 모션이 즉시 최종 상태로
// 가고, 끝 콜백(뜯김 뒤 다음 장 등)은 바로 불린다.
import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import { AccessibilityInfo, Animated, Easing, type EasingFunction, type LayoutChangeEvent, type StyleProp, type ViewStyle } from 'react-native';
import { keyframeInputRange, keyframeSegments } from '@/data/keyframes';

// ── 이징 — CSS 키워드의 정의값 그대로 ──────────────────────────────────────

/** CSS Easing Level 1의 키워드 정의. `Easing.ease`(RN)는 이 곡선이 아니라 근사라 쓰지 않는다. */
export const CSS_EASE = {
  ease: Easing.bezier(0.25, 0.1, 0.25, 1),
  easeOut: Easing.bezier(0, 0, 0.58, 1),
  easeInOut: Easing.bezier(0.42, 0, 0.58, 1),
} as const;

// ── 명세 ──────────────────────────────────────────────────────────────────

export type MotionProp = 'opacity' | 'translateX' | 'translateY' | 'scale' | 'scaleY' | 'rotate';

/** 속성 하나의 키프레임. `stops`는 CSS의 0%…100%를 0..1로, `values`는 그 자리의 값. */
export type MotionTrack = { prop: MotionProp; stops: number[]; values: (number | string)[] };

export type MotionSpec = {
  /** ms */
  duration: number;
  easing: EasingFunction;
  /** transform-origin. RN 0.85 `transformOrigin` 문법(`'0% 0%'`). */
  origin?: string;
  /** transform 트랙은 CSS 함수 순서대로. opacity는 어디에 있어도 된다. */
  tracks: MotionTrack[];
};

const T = (prop: MotionProp, stops: number[], values: (number | string)[]): MotionTrack => ({ prop, stops, values });

/** WL L15 · L17: `nb-tear-r .62s cubic-bezier(.3,.6,.4,1) both; transform-origin: top left`
 *  0% rotate(0) translate(0,0) → 18% rotate(-3deg) translate(3px,-6px) → 100% rotate(22deg) translate(300px,-80px); opacity:0 */
const TEAR_R: MotionSpec = {
  duration: 620,
  easing: Easing.bezier(0.3, 0.6, 0.4, 1),
  origin: '0% 0%',
  tracks: [
    T('rotate', [0, 0.18, 1], ['0deg', '-3deg', '22deg']),
    T('translateX', [0, 0.18, 1], [0, 3, 300]),
    T('translateY', [0, 0.18, 1], [0, -6, -80]),
    // opacity는 100%에만 있다 — 0%는 요소의 값(1), 18%는 opacity의 키프레임이 아니다.
    T('opacity', [0, 1], [1, 0]),
  ],
};

/** WL L16 · L18: `nb-tear-l`, transform-origin: top right. */
const TEAR_L: MotionSpec = {
  ...TEAR_R,
  origin: '100% 0%',
  tracks: [
    T('rotate', [0, 0.18, 1], ['0deg', '3deg', '-22deg']),
    T('translateX', [0, 0.18, 1], [0, -3, -300]),
    T('translateY', [0, 0.18, 1], [0, -6, -80]),
    T('opacity', [0, 1], [1, 0]),
  ],
};

/** 모든 모션의 명세 — 값은 참조 CSS 그대로(위 파일:줄). 테스트가 이 표를 참조 값과 대조한다. */
export const NB_MOTION = {
  /** WL L19–20: `nb-rise .4s ease-out both` 0% translateY(6px) scale(.985) → 100% none */
  rise: {
    duration: 400, easing: CSS_EASE.easeOut,
    tracks: [T('translateY', [0, 1], [6, 0]), T('scale', [0, 1], [0.985, 1])],
  },
  /** WL L21–22: `nb-stub .3s ease-out both; transform-origin: top` 0% opacity 0 scaleY(.4) → 100% opacity 1 none */
  stub: {
    duration: 300, easing: CSS_EASE.easeOut, origin: '50% 0%',
    tracks: [T('opacity', [0, 1], [0, 1]), T('scaleY', [0, 1], [0.4, 1])],
  },
  /** WL L25–26: `nb-shake .3s ease both` 0%,100% translateX(0) · 25% -5px · 75% 5px */
  shake: {
    duration: 300, easing: CSS_EASE.ease,
    tracks: [T('translateX', [0, 0.25, 0.75, 1], [0, -5, 5, 0])],
  },
  /** WL L29–30 · NU L22–23: `nb-ok .35s ease-out both`
   *  0% scale(.6) rotate(-20deg) opacity 0 → 70% scale(1.08) rotate(-10deg) opacity 1 → 100% scale(1) rotate(-10deg) */
  ok: {
    duration: 350, easing: CSS_EASE.easeOut,
    tracks: [
      T('scale', [0, 0.7, 1], [0.6, 1.08, 1]),
      T('rotate', [0, 0.7, 1], ['-20deg', '-10deg', '-10deg']),
      // 100%에 opacity가 없다 → 요소의 값 1. 70%에는 있으니 구간은 0–70–100.
      T('opacity', [0, 0.7, 1], [0, 1, 1]),
    ],
  },
  /** WL L31–32 · NU L20–21: `nb-reveal .3s ease-out both` 0% opacity 0 translateY(-6px) → 100% opacity 1 none */
  reveal: {
    duration: 300, easing: CSS_EASE.easeOut,
    tracks: [T('opacity', [0, 1], [0, 1]), T('translateY', [0, 1], [-6, 0])],
  },
  /** NU L18–19: `nb-swipe-in .3s ease-out both` 0% translateX(30px) scale(.96) opacity 0 → 100% none opacity 1 */
  swipeIn: {
    duration: 300, easing: CSS_EASE.easeOut,
    tracks: [T('translateX', [0, 1], [30, 0]), T('scale', [0, 1], [0.96, 1]), T('opacity', [0, 1], [0, 1])],
  },
  /** LS L14–15: `nbl-pop .35s cubic-bezier(.3,.7,.4,1.2) both`
   *  0% scale(.6) opacity 0 → 70% scale(1.08) → 100% scale(1) opacity 1 */
  pop: {
    duration: 350, easing: Easing.bezier(0.3, 0.7, 0.4, 1.2),
    tracks: [
      T('scale', [0, 0.7, 1], [0.6, 1.08, 1]),
      // 70%에 opacity가 없다 → 0%에서 100%까지 한 구간.
      T('opacity', [0, 1], [0, 1]),
    ],
  },
  tearRight: TEAR_R,
  tearLeft: TEAR_L,
} satisfies Record<string, MotionSpec>;

/** NU L16–17: `nb-swipe-out .38s cubic-bezier(.4,.05,.6,1) both`
 *  0% translateX(0) rotate(0) → 100% translateX(-120%) rotate(-8deg) opacity 0.
 *  RN transform은 %를 못 받으니 카드 폭을 재서 -1.2 × 폭. */
export function swipeOutSpec(width: number): MotionSpec {
  return {
    duration: 380,
    easing: Easing.bezier(0.4, 0.05, 0.6, 1),
    tracks: [
      T('translateX', [0, 1], [0, -1.2 * width]),
      T('rotate', [0, 1], ['0deg', '-8deg']),
      T('opacity', [0, 1], [1, 0]),
    ],
  };
}

/** WL L268 · SL L195 · NU L74: 진행 칸 `transition: background .3s` — 시간 함수 미지정이라 `ease`. */
export const NB_BAR_TRANSITION = { duration: 300, easing: CSS_EASE.ease } as const;

/** UI L17–18: `.nb-press{transition: transform .06s ease, box-shadow .06s ease}`
 *  `:active{transform: translate(1.5px,2px) rotate(0deg); box-shadow: none}` */
export const NB_PRESS = { duration: 60, easing: CSS_EASE.ease, dx: 1.5, dy: 2 } as const;

/** UI L19–20: `.nb-chip{transition: transform .06s ease}` `:active{transform: scale(.94)}` */
export const NB_CHIP_PRESS = { duration: 60, easing: CSS_EASE.ease, scale: 0.94 } as const;

// ── 모션 줄이기 ─────────────────────────────────────────────────────────────

let reduceMotion: boolean | null = null;
let subscribed = false;
const listeners = new Set<() => void>();

function setReduceMotion(v: boolean) {
  if (reduceMotion === v) return;
  reduceMotion = v;
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  if (!subscribed) {
    subscribed = true;
    AccessibilityInfo.isReduceMotionEnabled?.()
      .then((v) => setReduceMotion(!!v))
      .catch(() => setReduceMotion(false));
    AccessibilityInfo.addEventListener?.('reduceMotionChanged', (v: boolean) => setReduceMotion(!!v));
  }
  return () => { listeners.delete(l); };
}

/** 모션 줄이기가 켜져 있는가. 첫 응답 전에는 false(움직임을 켠 쪽)로 읽는다 — 꺼져 있다는 응답이
 *  와도 값이 바뀌지 않으니 다시 그리지 않는다. */
export function useReduceMotion(): boolean {
  return useSyncExternalStore(subscribe, () => reduceMotion === true, () => reduceMotion === true);
}

// ── 엔진 ──────────────────────────────────────────────────────────────────

type Driven = {
  /** 이 모션의 Animated 스타일(transform·opacity·transformOrigin). */
  style: Animated.WithAnimatedObject<ViewStyle>;
  /** 처음(0%)부터 다시 재생. 끝까지 가면 `onEnd`. 모션 줄이기면 즉시 100%와 `onEnd`. */
  play: (onEnd?: () => void) => void;
  /** 트랙별 값(테스트·합성용). 0 = 0%, 1 = 100%. */
  values: Animated.Value[];
};

/**
 * 명세 하나를 Animated 값으로. 트랙마다 자기 값과 자기 구간을 가진다(머리말 2).
 *
 * `auto`면 마운트하면서 재생한다(CSS 클래스가 붙은 채 마운트되는 rise·stub·reveal·ok·swipe-in·pop).
 * 다시 재생하고 싶으면 핸드오프처럼 key를 바꿔 다시 마운트한다(`'cur'+i`, `'stub'+i`).
 * 시작 값은 0%다 — `both` 채움이라 첫 프레임부터 0% 값이어야 깜빡이지 않는다.
 */
export function useNbMotion(spec: MotionSpec, opts: { auto?: boolean; onEnd?: () => void } = {}): Driven {
  const rm = useReduceMotion();
  const [values] = useState(() => spec.tracks.map(() => new Animated.Value(opts.auto && reduceMotion ? 1 : 0)));
  const running = useRef<Animated.CompositeAnimation | null>(null);
  const endRef = useRef(opts.onEnd);
  endRef.current = opts.onEnd;
  const specRef = useRef(spec);
  specRef.current = spec;

  const play = (onEnd?: () => void) => {
    running.current?.stop();
    const s = specRef.current;
    if (reduceMotion) {
      values.forEach((v) => v.setValue(1));
      onEnd?.();
      return;
    }
    values.forEach((v) => v.setValue(0));
    const anim = Animated.parallel(
      s.tracks.map((t, i) => Animated.sequence(
        keyframeSegments(s.duration, t.stops).map((seg) => Animated.timing(values[i], {
          toValue: seg.toValue,
          duration: seg.duration,
          easing: s.easing,
          useNativeDriver: true,
        })),
      )),
    );
    running.current = anim;
    anim.start(({ finished }) => {
      if (running.current === anim) running.current = null;
      if (finished) onEnd?.();
    });
  };

  // 마운트 재생.
  useEffect(() => {
    if (opts.auto) play(() => endRef.current?.());
    return () => { running.current?.stop(); running.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 재생 중에 모션 줄이기가 켜지면(첫 응답이 늦게 온 경우 포함) 그 자리에서 끝낸다.
  useEffect(() => {
    if (rm && running.current) {
      running.current.stop();
      running.current = null;
      values.forEach((v) => v.setValue(1));
      endRef.current?.();
    }
  }, [rm, values]);

  const key = JSON.stringify(spec.tracks) + (spec.origin ?? '');
  const style = useMemo(() => motionStyle(spec, values), // eslint-disable-next-line react-hooks/exhaustive-deps
    [key, values]);
  return { style, play, values };
}

/** 트랙 값들을 스타일로 — transform은 트랙 순서대로(머리말 3). */
export function motionStyle(spec: MotionSpec, values: Animated.Value[]): Animated.WithAnimatedObject<ViewStyle> {
  const transform: Record<string, Animated.AnimatedInterpolation<number | string>>[] = [];
  const out: Record<string, unknown> = {};
  spec.tracks.forEach((t, i) => {
    const v = values[i].interpolate({ inputRange: keyframeInputRange(t.values), outputRange: t.values as number[] });
    if (t.prop === 'opacity') out.opacity = v;
    else transform.push({ [t.prop]: v });
  });
  if (transform.length) out.transform = transform;
  if (spec.origin) out.transformOrigin = spec.origin;
  return out as Animated.WithAnimatedObject<ViewStyle>;
}

// ── 이름 붙은 훅 ───────────────────────────────────────────────────────────

export type NbEnterKind = 'rise' | 'stub' | 'reveal' | 'ok' | 'swipeIn' | 'pop';

/** 마운트하면서 한 번 — rise·stub·reveal·ok·swipe-in·pop. 다시 보려면 key를 바꿔 다시 마운트. */
export function useNbEnter(kind: NbEnterKind, onEnd?: () => void) {
  return useNbMotion(NB_MOTION[kind], { auto: true, onEnd }).style;
}

/** 마운트하면서 들어오는 Animated.View. `<NbEnter kind="reveal">…</NbEnter>` */
export function NbEnter({ kind, onEnd, style, pointerEvents, testID, children }: {
  kind: NbEnterKind;
  onEnd?: () => void;
  style?: StyleProp<ViewStyle>;
  pointerEvents?: 'auto' | 'none' | 'box-none' | 'box-only';
  testID?: string;
  children?: ReactNode;
}) {
  const motion = useNbEnter(kind, onEnd);
  return <Animated.View testID={testID} pointerEvents={pointerEvents} style={[style, motion]}>{children}</Animated.View>;
}

/** 오답 흔들림 — `shake()`를 부를 때마다 처음부터(WL L247: 오답 확인 때 클래스를 걸었다 320ms 뒤 해제). */
export function useNbShake() {
  const m = useNbMotion(NB_MOTION.shake);
  return { style: m.style, shake: (onEnd?: () => void) => m.play(onEnd) };
}

export type TearDir = 'left' | 'right';

/** 뜯김 — 마운트하면서 그 방향으로 날아가고 끝나면 `onEnd`(뜯기는 장의 복사본이 쓴다). */
export function useNbTear(dir: TearDir, onEnd?: () => void) {
  return useNbMotion(dir === 'left' ? NB_MOTION.tearLeft : NB_MOTION.tearRight, { auto: true, onEnd }).style;
}

/** 릴 장면 카드가 왼쪽으로 쓸려 나감. 폭은 `onLayout`으로 잰다(-120%). */
export function useNbSwipeOut() {
  const [width, setWidth] = useState(0);
  const m = useNbMotion(swipeOutSpec(width));
  return {
    style: m.style,
    onLayout: (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width),
    swipe: (onEnd?: () => void) => m.play(onEnd),
  };
}

/**
 * 색 전환 — 진행 칸의 `transition: background .3s`.
 *
 * 색은 네이티브 드라이버가 못 돌리므로 JS 드라이버의 별도 값(transform·opacity 값과 섞지 않는다).
 * 색이 바뀌면 지금 보이는 색에서 새 색으로 간다.
 */
export function useNbColorTransition(color: string, timing: { duration: number; easing: EasingFunction } = NB_BAR_TRANSITION) {
  const rm = useReduceMotion();
  const [st, setSt] = useState(() => ({ from: color, to: color, v: new Animated.Value(1) }));
  let cur = st;
  if (st.to !== color) {
    // Decided HERE, not in the effect: between this render's commit and its effect the style
    // would read the old value against the new pair and paint the target colour for a frame.
    // A fresh value at 0 rather than `setValue(0)` on the one the view is bound to — that would
    // update the mounted Animated view in the middle of this render (React warns, T3).
    cur = { from: st.to, to: color, v: new Animated.Value(0) };
    setSt(cur);
  }
  useEffect(() => {
    if (st.from === st.to) return;
    if (rm) { st.v.setValue(1); return; }
    const a = Animated.timing(st.v, { toValue: 1, duration: timing.duration, easing: timing.easing, useNativeDriver: false });
    a.start();
    return () => a.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [st]);
  return cur.v.interpolate({ inputRange: [0, 1], outputRange: [cur.from, cur.to] });
}

/**
 * 누름 — `.nb-press`의 0.06s 전환.
 *
 * `p` 하나(0 = 놓임, 1 = 눌림)가 얼굴의 transform과 그림자 투명도를 함께 끈다. CSS가 두 속성에 같은
 * 시간·곡선을 주니 한 값이면 된다. 놓을 때도 같은 전환으로 돌아온다(transition은 양방향).
 */
export function useNbPress() {
  const [p] = useState(() => new Animated.Value(0));
  const to = (toValue: number) => {
    if (reduceMotion) { p.setValue(toValue); return; }
    Animated.timing(p, { toValue, duration: NB_PRESS.duration, easing: NB_PRESS.easing, useNativeDriver: true }).start();
  };
  return { p, onPressIn: () => to(1), onPressOut: () => to(0) };
}

/** 눌림 정도 `p`를 transform으로: 놓임 rotate(rot) → 눌림 translate(1.5px,2px) rotate(0). */
export function nbPressTransform(p: Animated.Value, rot: number) {
  return [
    { translateX: p.interpolate({ inputRange: [0, 1], outputRange: [0, NB_PRESS.dx] }) },
    { translateY: p.interpolate({ inputRange: [0, 1], outputRange: [0, NB_PRESS.dy] }) },
    { rotate: p.interpolate({ inputRange: [0, 1], outputRange: [`${rot}deg`, '0deg'] }) },
  ];
}
