// One correction point, on its own slip of paper.
//
// Two things this card does NOT source from the phoneme tip:
//   `syllable` — the left label is the SYLLABLE the bad phoneme sits in (SoT's
//   "min"/"li"), found by the caller via the time-window join in lib/pronTokens. A
//   phoneme with no matching syllable has no card at all.
//   `ipa` — likewise the SYLLABLE's IPA (`/ˈmɪn/`), not the server tip's single-phoneme
//   IPA. The caller assembles it.
//
// `message` is the server tip's short card copy (Tip.Message, ~25 chars). The long form
// (Tip.Detail) belongs to the drill screen, which is not built yet.
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NbIcon } from '@/components/nb/NbIcon';
import { NbPaper, nbText } from '@/components/nb/NbUI';
import { nb, nbFonts } from '@/theme/nb';
import { BAND } from './nbPron';

type Props = {
  syllable: string;
  ipa: string;
  message: string;
  /** Pink label for a failing phoneme, yellow for a shaky one. */
  severe: boolean;
  onPlay(): void;
  rot?: number;
};

export function CorrectionCard({ syllable, ipa, message, severe, onPlay, rot = -0.4 }: Props) {
  return (
    <NbPaper rot={rot} style={styles.card}>
      {/* The syllable, stamped. The IPA under it is the same fragment written out — one
          is what to look for in the sentence, the other is how to make it. */}
      <View style={[styles.label, { backgroundColor: severe ? BAND.bad : BAND.weak }]}>
        <Text style={styles.labelText}>{syllable}</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.ipa}>{ipa}</Text>
        <Text style={[nbText.hand(15.5), styles.message]}>{message}</Text>
      </View>
      <Pressable onPress={onPlay} hitSlop={8}>
        <NbPaper rot={1.5} bg="rgba(143,199,232,.3)" style={styles.play}>
          <NbIcon name="speaker" size={16} />
        </NbPaper>
      </Pressable>
    </NbPaper>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: 11, paddingVertical: 11, paddingHorizontal: 13 },
  label: {
    flexShrink: 0, borderWidth: 1.4, borderColor: nb.ink, borderRadius: 2,
    paddingVertical: 5, paddingHorizontal: 8, transform: [{ rotate: '-2deg' }],
  },
  labelText: { fontFamily: nbFonts.monoBold, fontSize: 12, color: nb.ink },
  body: { flex: 1, minWidth: 0 },
  ipa: { fontFamily: nbFonts.mono, fontSize: 10, color: nb.soft },
  message: { marginTop: 1, lineHeight: 19 },
  play: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
});
