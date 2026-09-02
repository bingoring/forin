// The audio slab the waveform lives on. See nbPron.ts for why this one surface is not
// paper: a waveform is a readout from a machine, and the notebook has no pen that draws
// your own voice.
import { type ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { AUDIO } from './nbPron';

export function DarkPanel({ style, children }: { style?: StyleProp<ViewStyle>; children?: ReactNode }) {
  return (
    <View style={[{ backgroundColor: AUDIO.bg, borderWidth: 1.5, borderColor: AUDIO.edge, borderRadius: 4 }, style]}>
      {children}
    </View>
  );
}
