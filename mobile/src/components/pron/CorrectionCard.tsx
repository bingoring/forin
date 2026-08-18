// One correction point. SoT screen-pronunciation.jsx L197-210.
//
// Two things this card does NOT source from the phoneme tip:
//   `syllable` — the left label is the SYLLABLE the bad phoneme sits in
//   (SoT's "min"/"li"), found by the caller via the time-window join in
//   lib/pronTokens. A phoneme with no matching syllable has no card at all.
//   `ipa` — likewise the SYLLABLE's IPA (`/ˈmɪn/`), not the server tip's
//   single-phoneme IPA. The caller assembles it.
//
// `message` is the server tip's short card copy (Tip.Message, ~25 chars). The
// long form (Tip.Detail) belongs to the drill screen, which is not built yet.
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '@/theme/tokens';
import { PixelIcon } from '@/components/PixelIcon';
import { PronCard } from './PronCard';

type Props = {
  syllable: string;
  ipa: string;
  message: string;
  /** Red label for a failing phoneme, yellow for a shaky one. */
  severe: boolean;
  onPlay(): void;
};

export function CorrectionCard({ syllable, ipa, message, severe, onPlay }: Props) {
  return (
    <PronCard style={styles.card}>
      <View style={[styles.label, { backgroundColor: severe ? colors.red : colors.yellow }]}>
        <Text style={styles.labelText}>{syllable}</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.ipa}>{ipa}</Text>
        <Text style={styles.message}>{message}</Text>
      </View>
      {/* SoT draws 🔊 here; the app renders no emoji on screen (762bb6a). */}
      <Pressable onPress={onPlay} hitSlop={8} style={styles.play}>
        <PixelIcon name="volume" color={colors.ink} size={14} sw={1.8} />
      </Pressable>
    </PronCard>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 11,
  },
  label: {
    width: 42,
    flexShrink: 0,
    borderWidth: 2,
    borderColor: colors.ink,
    paddingVertical: 5,
    alignItems: 'center',
  },
  labelText: { fontFamily: fonts.heading, fontSize: 11, color: colors.ink },
  body: { flex: 1, minWidth: 0 },
  ipa: { fontFamily: fonts.heading, fontSize: 9.5, color: colors.textSoft },
  message: { fontFamily: fonts.body, fontSize: 11, color: colors.ink, marginTop: 3, lineHeight: 15 },
  play: {
    backgroundColor: colors.blue,
    borderWidth: 2,
    borderColor: colors.ink,
    paddingVertical: 5,
    paddingHorizontal: 7,
    flexShrink: 0,
  },
  playText: { fontFamily: fonts.heading, fontSize: 11, color: colors.ink },
});
