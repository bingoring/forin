// Station — 정거장 노드. 핸드오프 v41 08_JOURNEY_RESOURCES.md §3의 4상태를 그대로 옮긴 것이다.
//
// `far`는 핸드오프에서 `locked`라 불렸지만 잠기지 않는다(J3): 우리 주제는 대체로 병렬이라
// 앞 정거장을 지나지 않아도 배움에 구멍이 나지 않고, 다음 달에 그 부서로 배치되는 학습자가
// 기다려야 할 이유가 없다. 흐린 점선은 "아직 가지 않은 곳"의 표현이지 자물쇠가 아니다 — 그래서
// 이 컴포넌트는 어떤 상태에서도 잠금 아이콘을 그리지 않는다.
import { Pressable, Text } from 'react-native';
import Svg, { Circle, G, Line, Polygon, Text as SvgText } from 'react-native-svg';
import { nbText } from '@/components/nb/NbUI';
import { nb, nbFonts } from '@/theme/nb';

export type StationState = 'done' | 'here' | 'next' | 'far';

// 손글씨 4자가 들어가는 최소치. 줄이지 말 것(핸드오프 §5) — Station.test.tsx가 이 값을 고정한다.
export const RADIUS = { here: 30, next: 26, far: 25, done: 24 } as const;

// 앰버는 `nb` 팔레트에 토큰이 없다 — 이 저장소가 이미 하는 방식대로(app/review.tsx,
// app/(tabs)/lab.tsx의 '어려움' 단계 색과 같은 값) 로컬 상수로 둔다. INK·GREEN·BLUE는
// `nb.ink`·`nb.green`·`nb.blue`와 값이 같아 토큰을 그대로 쓴다.
const AMBER = '#C77E2E';

// The label's own box — deliberately NOT `r * 2 + 56` (the Pressable's width, which the
// SVG circle also uses). Tying the label to the circle's box is the bug: at `far`'s 25px
// radius that box is 106px wide, and even a MEDIAN-length English theme name ("Core
// communication and language", 32 chars — the exact string that showed up truncated as
// "Core communication an...") does not fit two 13pt hand-font lines at that width.
// RADIUS is pinned (핸드오프 §5, see above) and stays out of this entirely — the label
// is free to be wider than the circle beneath it, and `Text` overflowing its Pressable
// parent is fine here (the parent sets no `overflow: hidden`; RN centres an
// oversized child on its parent's centre same as it would a same-size one, so the label
// just spills past the circle's box symmetrically rather than being clipped or shifted).
//
// 140 is a ceiling, not a fit-everything number — measured against the actual theme-name
// catalogs (955 entries, `server/internal/i18n/theme_{en,de}.go`, 2026-09):
//   en: p50=32 chars, p75=40, p90=47, max=70
//   de: p50=34 chars, p75=42, p90=53, max=90 (German compounds run longest)
// A hand-font line at this width holds roughly 19-20 Latin characters, so two lines
// comfortably cover the median and most of p75 in both languages without truncating.
// Beyond that — including German's p90+ tail and its 90-char outlier — two lines of any
// reasonable width still ellipsize; there is no width that fits "Sturzprävention,
// sichere Mobilisation, Patientenidentifikation und Medikamentensicherheit" on a map
// node, so the line is drawn here rather than chased further.
//
// The other bound is the screen, not the font: stations zig-zag at `SWING` (0.28) of the
// screen width from centre (JourneyMap.tsx), so a station's centre can sit up to 0.28w
// off-centre. At the narrowest width this app assumes (360, common Android) that is
// 100.8px, and half of 140 is 70 — 100.8 + 70 = 170.8, under half the screen (180), so
// even the far column's label stays on-screen with ~9px to spare. Widening much past 140
// starts eating that margin.
const LABEL_WIDTH = 140;

export function Station({ state, label, sub, collab, onPress }: {
  state: StationState;
  label: string;
  sub?: string;
  collab?: string;
  onPress(): void;
}) {
  const r = RADIUS[state];
  const size = r * 2 + 56;
  return (
    <Pressable
      testID="station-press"
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={{ width: size, alignItems: 'center' }}
    >
      <Svg width={size} height={size}>
        <G x={r + 28} y={r + 28}>
          {/* 협업 링 — 콘텐츠 0건(frontend-components.md §6)이라 자리만 만든다. */}
          {!!collab && (
            <Circle r={state === 'here' ? 36 : 32} stroke={nb.blue} strokeDasharray="3 3" fill="none" />
          )}

          {state === 'done' && (
            <G rotation={-12}>
              <Circle r={24} stroke={nb.green} strokeWidth={2} fill="none" />
              <Circle r={19} stroke={nb.green} strokeWidth={1} fill="none" />
              <SvgText y={3} fontSize={6.5} fontFamily={nbFonts.mono} fill={nb.green} textAnchor="middle">
                PASSED
              </SvgText>
            </G>
          )}

          {state === 'here' && (
            <>
              <Circle r={30} stroke={nb.ink} strokeWidth={2} fill="none" />
              <Circle r={34} stroke={AMBER} strokeWidth={1.6} strokeDasharray="5 4" fill="none" />
              <G testID="station-flag" x={12} y={-48}>
                <Line x1={0} y1={0} x2={0} y2={26} stroke={nb.ink} strokeWidth={2} />
                <Polygon points="0,0 16,6 0,12" fill={nb.red} />
              </G>
            </>
          )}

          {state === 'next' && <Circle r={26} stroke={nb.ink} strokeWidth={1.8} fill="none" />}

          {/* far: 점선 + 옅음. 자물쇠는 그리지 않는다(J3) — 이곳은 누를 수 있는 곳이다. */}
          {state === 'far' && (
            <Circle r={25} stroke={nb.ink} strokeWidth={1.6} strokeDasharray="4 3" fill="none" opacity={0.45} />
          )}
        </G>
      </Svg>
      <Text numberOfLines={2} style={[nbText.hand(13), { width: LABEL_WIDTH, textAlign: 'center', marginTop: 2 }]}>
        {label}
      </Text>
      {!!sub && (
        <Text numberOfLines={1} style={[nbText.body(9.5, nb.soft), { textAlign: 'center', marginTop: 1 }]}>
          {sub}
        </Text>
      )}
    </Pressable>
  );
}
