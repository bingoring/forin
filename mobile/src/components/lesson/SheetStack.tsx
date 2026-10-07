// 낱장 묶음(제본) — STEP 1 단어장(WordStudyLive)과 STEP 2 문장장(SentStudyLive)이 함께 쓴다.
//
// 정본(R1): design-handoff_v46/reference/forin-notebook-lesson-words-live.jsx
//   L156–163  낱장(Sheet): 종이·테두리·그림자 `0 4px 10px rgba(62,54,43,.16)`(dim이면 없음, opacity .85)·
//             padding 22/18/16·minHeight 300·top 13 점선 절취선·헤더(태그 -1° + 유형 라벨 nowrap + n / N)
//   L168      앰버 원 58·2px·`${amber}22`·-4°·아이콘 32   (sent-live L117: listen이면 파란 스피커 버튼)
//   L274      스크롤 영역 absolute left/right 24 · top 172 · bottom 182 · pt 12 pb 8 · 스크롤바 숨김
//   L275–288  묶음: relative minHeight 360 · 스프링 링 9 · 뒷장 2겹 · 절취 조각 · 아래 다음 장 · 현재 장(rise, shake) ·
//             뜯기는 장 복사본(zIndex 6, tear-l/r)
//   L290      완료 낱장: padding 28/18/20 · 같은 그림자 · 가운데 · rise
//   sent-live L107–113 · L200–216은 같은 마크업이다.
//
// 이 부품은 묶음과 연출만 안다. 장의 내용(프롬프트·해설)과 문구는 화면이 `renderSheet`로 준다 —
// 그래서 한국어 문구가 여기 없다(i18n 규칙). 핸드오프는 같은 Sheet를 세 번 그린다: 현재 장(답할 수
// 있음), 그 아래 다음 장(dim), 뜯기는 동안의 복사본(결과가 남은 채). `renderSheet(index, mode)`의
// mode가 그 셋이다.
//
// 뜯김의 순서(WL L251–255 `tearNext`): 복사본을 그 방향으로 620ms 날린다 → 끝나면 화면이 다음 장으로
// (onAdvance) → 새 현재 장이 key 'cur'+i로 다시 마운트되며 떠오르고(rise), 절취 조각이 key 'stub'+i로
// 다시 나타난다(stub). 핸드오프의 setTimeout(620) 대신 모션의 끝 콜백을 쓴다 — 모션 줄이기면 즉시.
import { forwardRef, useId, useImperativeHandle, useRef, useState, type ReactNode } from 'react';
import { Animated, Platform, Pressable, ScrollView, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { ClipPath, Defs, G, Line, Path, Rect } from 'react-native-svg';
import { NbIcon, type NbIconName } from '@/components/nb/NbIcon';
import { NbTag, nbText } from '@/components/nb/NbUI';
import { NbEnter, useNbShake, useNbTear, type TearDir } from '@/components/nb/nbMotion';
import { nb, nbFonts, sheetShadow } from '@/theme/nb';

/** 묶음의 숫자들 — 참조 줄 그대로. */
export const SHEET = {
  /** WL L274 */
  area: { side: 24, top: 172, bottom: 182, padTop: 12, padBottom: 8 },
  /** WL L275 */
  minHeight: 360,
  /** WL L276–278 */
  rings: { count: 9, inset: 14, top: -9, w: 12, h: 18, border: 2, radius: 6 },
  /** WL L279–280 */
  back: [
    { left: 4, right: -4, top: 8, bottom: 0, bg: '#F7F1E1' },
    { left: 2, right: -2, top: 4, bottom: 4, bg: '#FBF6E8' },
  ],
  edge: '#E0D6C0',
  /** WL L281 */
  stub: { h: 13, dash: 1.5, dashColor: 'rgba(62,54,43,.35)' },
  /** WL L156–157 */
  leaf: { padTop: 22, padX: 18, padBottom: 16, minHeight: 300, dimOpacity: 0.85, perfTop: 13, perf: 1.5, perfColor: 'rgba(62,54,43,.3)' },
  /** WL L290 */
  done: { padTop: 28, padX: 18, padBottom: 20 },
  /**
   * CSS `dashed` as an SVG dash pattern. CSS leaves the pattern to the browser; Chromium draws
   * a thin dashed border as dashes and gaps of three times the line width, which is what the
   * handoff was drawn and captured in.
   */
  dash: (w: number) => [w * 3, w * 3],
} as const;

/** WL L281: the stub's `clip-path: polygon(...)`, as [x%, y%]. */
export const STUB_POINTS: [number, number][] = [
  [0, 0], [100, 0], [100, 70], [94, 100], [88, 70], [80, 100], [72, 68], [64, 100],
  [55, 72], [47, 100], [40, 70], [31, 100], [23, 72], [15, 100], [8, 68], [0, 100],
];

// Android draws by elevation before zIndex: a sheet's shadow (elevation 4) would lift it over
// the rings and the stub, which the handoff stacks ABOVE it. These lift them back, casting
// nothing (transparent shadow colour).
const lift = (e: number): ViewStyle => (Platform.OS === 'android' ? { elevation: e, shadowColor: 'transparent' } : {});

export type SheetMode = 'current' | 'next' | 'tearing';

export type SheetStackHandle = {
  /** 현재 장을 그 방향으로 뜯는다. 끝나면 `onTorn` → `onAdvance`. 뜯는 중이면 무시. */
  tear: (dir: TearDir, onTorn?: () => void) => void;
  /** 오답 — 현재 장을 흔든다(nb-shake). */
  shake: () => void;
  isTearing: () => boolean;
};

export const SheetStack = forwardRef<SheetStackHandle, {
  /** 지금 장(0부터). */
  index: number;
  total: number;
  /** 다 끝났으면 완료 낱장(renderDone)을 그린다. */
  done?: boolean;
  renderSheet: (index: number, mode: SheetMode) => ReactNode;
  renderDone?: () => ReactNode;
  /** 뜯김이 끝났을 때 — 화면이 index를 하나 올린다. */
  onAdvance?: () => void;
  /** 스크롤 영역의 위·아래. 핸드오프 기준(874 프레임) 172 · 182 — 화면이 안전 영역에 맞춰 옮길 수 있다. */
  top?: number;
  bottom?: number;
}>(function SheetStack({ index, total, done, renderSheet, renderDone, onAdvance, top = SHEET.area.top, bottom = SHEET.area.bottom }, ref) {
  const [tearing, setTearing] = useState<{ index: number; dir: TearDir } | null>(null);
  const tearingRef = useRef(false);
  const tornRef = useRef<(() => void) | undefined>(undefined);
  const advanceRef = useRef(onAdvance);
  advanceRef.current = onAdvance;
  const shake = useNbShake();

  useImperativeHandle(ref, () => ({
    tear: (dir, onTorn) => {
      if (tearingRef.current || done) return;
      tearingRef.current = true;
      tornRef.current = onTorn;
      setTearing({ index, dir });
    },
    shake: () => shake.shake(),
    isTearing: () => tearingRef.current,
  }));

  const onTornAway = () => {
    tearingRef.current = false;
    const cb = tornRef.current;
    tornRef.current = undefined;
    setTearing(null);
    cb?.();
    advanceRef.current?.();
  };

  const hasNext = !done && index + 1 < total;
  return (
    <ScrollView
      style={{ position: 'absolute', left: SHEET.area.side, right: SHEET.area.side, top, bottom }}
      contentContainerStyle={{ paddingTop: SHEET.area.padTop, paddingBottom: SHEET.area.padBottom }}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
    >
      <View testID="sheet-stack" style={{ position: 'relative', minHeight: SHEET.minHeight }}>
        <Rings />
        {SHEET.back.map((b, k) => (
          <View
            key={k}
            pointerEvents="none"
            style={{ position: 'absolute', left: b.left, right: b.right, top: b.top, bottom: b.bottom, backgroundColor: b.bg, borderWidth: 1, borderColor: SHEET.edge }}
          />
        ))}
        {index > 0 && <Stub key={`stub${index}`} />}
        {hasNext && (
          <View testID="sheet-next-layer" pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: 0 }}>
            {renderSheet(index + 1, 'next')}
          </View>
        )}
        {!done && !tearing && (
          <Animated.View testID="sheet-current-layer" style={[{ position: 'relative', zIndex: 3 }, shake.style]}>
            <NbEnter key={`cur${index}`} testID="sheet-current-rise" kind="rise">
              {renderSheet(index, 'current')}
            </NbEnter>
          </Animated.View>
        )}
        {tearing && (
          <TearingLayer key={`tear${tearing.index}`} dir={tearing.dir} onEnd={onTornAway}>
            {renderSheet(tearing.index, 'tearing')}
          </TearingLayer>
        )}
        {done && (
          <NbEnter
            testID="sheet-done"
            kind="rise"
            style={[{
              position: 'relative', zIndex: 3, backgroundColor: nb.paper, borderWidth: 1, borderColor: nb.paperEdge,
              paddingTop: SHEET.done.padTop, paddingHorizontal: SHEET.done.padX, paddingBottom: SHEET.done.padBottom,
              alignItems: 'center',
            }, sheetShadow]}
          >
            {renderDone?.()}
          </NbEnter>
        )}
      </View>
    </ScrollView>
  );
});

/** WL L276–278: nine spring rings, left/right 14 in, 9 above the stack, spread edge to edge. */
function Rings() {
  const r = SHEET.rings;
  return (
    <View
      testID="sheet-rings"
      pointerEvents="none"
      style={[{ position: 'absolute', left: r.inset, right: r.inset, top: r.top, flexDirection: 'row', justifyContent: 'space-between', zIndex: 5 }, lift(7)]}
    >
      {Array.from({ length: r.count }).map((_, k) => (
        <View key={k} style={{ width: r.w, height: r.h, borderWidth: r.border, borderColor: nb.ink, borderRadius: r.radius, backgroundColor: nb.cream }} />
      ))}
    </View>
  );
}

/**
 * WL L281: what is left at the top of the binder once a sheet has been torn off — a paper
 * strip 13 tall, its sides edged, its bottom a dashed line, the whole cut to a zigzag.
 *
 * CSS clips the strip (borders included) with `clip-path: polygon(...)`; a View has no clip
 * path, so it is drawn in SVG at its measured width: the paper, the two side edges and the
 * dashed bottom inside one clip. Only the tips of the teeth reach the bottom line, which is
 * what the CSS shows too. It re-mounts each time the index changes (key 'stub'+i) so it
 * fades in again (nb-stub).
 */
function Stub() {
  const [w, setW] = useState(0);
  const id = `stub-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const h = SHEET.stub.h;
  const num = (v: number) => String(Math.round(v * 100) / 100);
  const d = STUB_POINTS.map(([x, y], k) => `${k === 0 ? 'M' : 'L'}${num((x / 100) * w)} ${num((y / 100) * h)}`).join(' ') + ' Z';
  return (
    // NbEnter forwards no onLayout, so the View inside measures.
    <NbEnter
      kind="stub"
      testID="sheet-stub"
      pointerEvents="none"
      style={[{ position: 'absolute', left: 0, right: 0, top: 0, height: h, zIndex: 4 }, lift(5)]}
    >
      <View testID="sheet-stub-measure" style={{ flex: 1 }} onLayout={(e) => setW(e.nativeEvent.layout.width)}>
        {w > 0 && (
          <Svg width={w} height={h}>
            <Defs>
              <ClipPath id={id}><Path d={d} /></ClipPath>
            </Defs>
            <G clipPath={`url(#${id})`}>
              <Rect x={0} y={0} width={w} height={h} fill={nb.paper} />
              <Rect x={0} y={0} width={1} height={h} fill={SHEET.edge} />
              <Rect x={w - 1} y={0} width={1} height={h} fill={SHEET.edge} />
              <Line
                x1={0} x2={w} y1={h - SHEET.stub.dash / 2} y2={h - SHEET.stub.dash / 2}
                stroke={SHEET.stub.dashColor} strokeWidth={SHEET.stub.dash} strokeDasharray={SHEET.dash(SHEET.stub.dash)}
              />
            </G>
          </Svg>
        )}
      </View>
    </NbEnter>
  );
}

/** The torn sheet's copy, flying off (nb-tear-l/r) above everything, untouchable. */
function TearingLayer({ dir, onEnd, children }: { dir: TearDir; onEnd: () => void; children?: ReactNode }) {
  const motion = useNbTear(dir, onEnd);
  return (
    <Animated.View
      testID="sheet-tearing-layer"
      pointerEvents="none"
      style={[{ position: 'absolute', left: 0, right: 0, top: 0, zIndex: 6 }, lift(8), motion]}
    >
      {children}
    </Animated.View>
  );
}

/**
 * One loose leaf. WL L156–163: paper, its cut edge, the leaf shadow (none when it is the dim
 * sheet underneath, which is also at .85), padding 22/18/16, at least 300 tall, a dashed
 * perforation 13 from the top, and the header row — the blue tag at -1°, the prompt type
 * (never wraps) and n / N pushed right in bold mono.
 *
 * `tag` is optional (spec R3: the screen supplies the fallback); the label and the tag are
 * the screen's translated strings.
 */
export function LessonSheet({ dim, tag, typeLabel, n, total, testID, style, children }: {
  dim?: boolean;
  tag?: string;
  typeLabel: string;
  /** 1-based. */
  n: number;
  total: number;
  testID?: string;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}) {
  const L = SHEET.leaf;
  return (
    <View
      testID={testID}
      style={[
        {
          backgroundColor: nb.paper, borderWidth: 1, borderColor: nb.paperEdge,
          paddingTop: L.padTop, paddingHorizontal: L.padX, paddingBottom: L.padBottom, minHeight: L.minHeight,
          opacity: dim ? L.dimOpacity : 1,
        },
        dim ? null : sheetShadow,
        style,
      ]}
    >
      <Perforation />
      <View testID="sheet-header" style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
        {!!tag && <NbTag color={nb.blue} rot={-1}>{tag}</NbTag>}
        {/* `white-space: nowrap` — one line, never shortened (no shrink, no ellipsis). */}
        <Text numberOfLines={1} style={{ fontFamily: nbFonts.hand, fontSize: 12.5, color: nb.soft, flexShrink: 0 }}>{typeLabel}</Text>
        <View style={{ flex: 1 }} />
        <Text numberOfLines={1} style={[nbText.monoBold(11, nb.soft), { flexShrink: 0 }]}>{`${n} / ${total}`}</Text>
      </View>
      {children}
    </View>
  );
}

/** WL L157: `borderTop: 1.5px dashed rgba(62,54,43,.3)` at top 13, edge to edge. An SVG line:
 *  iOS draws a one-sided dashed border solid. */
function Perforation() {
  const L = SHEET.leaf;
  return (
    <View testID="sheet-perforation" pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: L.perfTop, height: L.perf }}>
      <Svg width="100%" height={L.perf}>
        <Line x1="0" x2="100%" y1={L.perf / 2} y2={L.perf / 2} stroke={L.perfColor} strokeWidth={L.perf} strokeDasharray={SHEET.dash(L.perf)} />
      </Svg>
    </View>
  );
}

/**
 * The amber circle at the head of a prompt — WL L168: 58 round, `${amber}22` wash, 2pt amber
 * ring, tilted -4°, the icon at 32. sent-live L117: on a listen sheet the same circle is the
 * speaker button — blue ring on `rgba(74,111,165,.1)`, a `0 2px 5px rgba(62,54,43,.15)`
 * shadow, and pressing it plays.
 */
export function SheetIconCircle({ icon = 'star', tone = 'amber', onPress, accessibilityLabel }: {
  icon?: NbIconName | string;
  tone?: 'amber' | 'listen';
  onPress?: () => void;
  accessibilityLabel?: string;
}) {
  const listen = tone === 'listen';
  const face: ViewStyle = {
    width: 58, height: 58, borderRadius: 29, borderWidth: 2,
    borderColor: listen ? nb.blue : nb.amber,
    backgroundColor: listen ? 'rgba(74,111,165,.1)' : `${nb.amber}22`,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    transform: [{ rotate: '-4deg' }],
    ...(listen ? { shadowColor: '#3E362B', shadowOpacity: 0.15, shadowRadius: 5, shadowOffset: { width: 0, height: 2 }, elevation: 2 } : null),
  };
  const glyph = <NbIcon name={listen ? 'speaker' : icon} size={32} />;
  if (!listen) return <View testID="sheet-icon" style={face}>{glyph}</View>;
  return (
    <Pressable testID="sheet-icon-press" onPress={onPress} accessibilityRole="button" accessibilityLabel={accessibilityLabel}>
      <View testID="sheet-icon" style={face}>{glyph}</View>
    </Pressable>
  );
}
