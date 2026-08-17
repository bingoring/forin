// Amplitude bars. SoT screen-pronunciation.jsx L57-66: width 5, gap 3,
// height max(3, v*h), 1.5px ink border. Values are 0..1.
//
// `live` marks the recording view's bars. It carries no animation of its own —
// the caller re-renders with fresh amplitudes as they arrive, because RN has no
// CSS keyframes and a real waveform has to follow the mic anyway.
import { StyleSheet, View } from 'react-native';
import { colors } from '@/theme/tokens';

type Props = {
  bars: number[];
  color: string;
  height?: number;
  live?: boolean;
};

export function Wave({ bars, color, height = 46 }: Props) {
  return (
    <View style={[styles.row, { height }]}>
      {bars.map((v, i) => (
        <View
          key={i}
          style={[styles.bar, { height: Math.max(3, v * height), backgroundColor: color }]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 3 },
  bar: { width: 5, borderWidth: 1.5, borderColor: colors.ink },
});
