// The amplitude trace. Values are 0..1, one per bar, and the caller re-renders with fresh
// amplitudes as they arrive — RN has no CSS keyframes and a real waveform has to follow
// the mic anyway.
//
// v29 dropped the ink border the pixel line drew around every bar: at 3.5pt wide a 1.5pt
// border on both sides IS the bar, so twenty of them read as a picket fence rather than a
// signal. The beat now comes from lighting every fourth bar instead.
import { StyleSheet, View } from 'react-native';
import { AUDIO } from './nbPron';

type Props = {
  bars: number[];
  color?: string;
  /** Every fourth bar. */
  accent?: string;
  height?: number;
  /** Marks the recording view's bars. Carries no animation of its own. */
  live?: boolean;
};

export function Wave({ bars, color = AUDIO.wave, accent = AUDIO.waveLit, height = 46 }: Props) {
  return (
    <View style={[styles.row, { height }]}>
      {bars.map((v, i) => (
        <View
          key={i}
          style={[styles.bar, { height: Math.max(3, v * height), backgroundColor: i % 4 === 0 ? accent : color }]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: 3 },
  bar: { width: 3.5, borderRadius: 1 },
});
