// Small shared pieces of the career tab. Extracted when campus.tsx was split, so
// the three surfaces (floor list, step sheet, dept sheet) draw the same bar and
// the same drop shadow rather than three near-copies.
import { Text, View } from 'react-native';
import { colors, fonts, fs } from '@/theme/tokens';

const C = colors.ink;

export function Shadowed({ children, offset = 4, shadowColor = C, style }: {
  children: React.ReactNode; offset?: number; shadowColor?: string; style?: object;
}) {
  return (
    <View style={style}>
      <View style={{ position: 'absolute', left: offset, top: offset, right: -offset, bottom: -offset, backgroundColor: shadowColor }} />
      {children}
    </View>
  );
}

export function ProgressBar({ done, total }: { done: number; total: number }) {
  const pct = total > 0 ? Math.max(0, Math.min(100, (done / total) * 100)) : 0;
  return (
    <View style={{ height: 12, backgroundColor: '#fff', borderWidth: 2, borderColor: C, justifyContent: 'center' }}>
      <View style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${pct}%`, backgroundColor: colors.mintShadow }} />
      <Text style={{ position: 'absolute', right: 4, fontFamily: fonts.heading, fontSize: fs(8.5), color: C }}>{done}/{total}</Text>
    </View>
  );
}

export function Chip({ label, bg, color }: { label: string; bg: string; color: string }) {
  return (
    <View style={{ backgroundColor: bg, borderWidth: 1.5, borderColor: C, paddingVertical: 1, paddingHorizontal: 4 }}>
      <Text style={{ fontFamily: fonts.heading, fontSize: fs(8), color }}>{label}</Text>
    </View>
  );
}

/**
 * Three dots summarising a floor: one per curriculum, filled by state.
 *
 * There is no locked state to draw — every floor and curriculum is open, and the
 * sequence lives inside a curriculum. A padlock here would contradict that.
 */
export function CurriculumDots({ states }: { states: ('done' | 'doing' | 'todo')[] }) {
  return (
    <View style={{ flexDirection: 'row', gap: 3 }}>
      {states.map((st, i) => (
        <View
          key={i}
          style={{
            width: 9, height: 9, borderWidth: 1.5, borderColor: C,
            backgroundColor: st === 'done' ? colors.mintShadow : st === 'doing' ? colors.yellow : '#fff',
          }}
        />
      ))}
    </View>
  );
}
