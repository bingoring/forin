// Bottom-nav line icons — hand-drawn in the app's ink-outline SVG vocabulary
// (same style as the map/quiz art), so they stay self-contained and license-free.
// Black stroke, no fill; the tab bar passes `color` (ink when active, faint when not).
import Svg, { Circle, Path, Rect } from 'react-native-svg';

type Props = { color: string; size?: number };
const base = (size = 22) => ({
  width: size, height: size, viewBox: '0 0 24 24',
  fill: 'none' as const, strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const,
});

// 캠퍼스 — hospital (building + medical cross + door)
export function CampusIcon({ color, size }: Props) {
  return (
    <Svg {...base(size)} stroke={color}>
      <Rect x={4} y={7} width={16} height={14} rx={1} />
      <Path d="M12 10.3 v3 M10.5 11.8 h3" />
      <Path d="M10 21 v-4 h4 v4" />
    </Svg>
  );
}

// 상황판 — clipboard (board + top clip + lines)
export function BoardIcon({ color, size }: Props) {
  return (
    <Svg {...base(size)} stroke={color}>
      <Rect x={5} y={4} width={14} height={17} rx={1.5} />
      <Path d="M9 4 V3 a1 1 0 0 1 1-1 h4 a1 1 0 0 1 1 1 v1" />
      <Path d="M8.5 10 h7 M8.5 13.5 h7 M8.5 17 h4" />
    </Svg>
  );
}

// 리뷰랩 — notebook (cover + binding + lines)
export function LabIcon({ color, size }: Props) {
  return (
    <Svg {...base(size)} stroke={color}>
      <Rect x={5} y={3.5} width={14} height={17} rx={1.5} />
      <Path d="M9 3.5 V20.5" />
      <Path d="M12 8.5 h4 M12 12.5 h4" />
    </Svg>
  );
}

// 나 — person (head + shoulders)
export function MeIcon({ color, size }: Props) {
  return (
    <Svg {...base(size)} stroke={color}>
      <Circle cx={12} cy={8} r={3.6} />
      <Path d="M5.5 20.5 a6.5 6.5 0 0 1 13 0" />
    </Svg>
  );
}
