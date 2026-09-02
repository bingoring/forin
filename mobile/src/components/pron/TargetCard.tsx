// The sentence to say, on the notebook's own paper (v29).
//
// Highlight colours carry meaning, not decoration: drug names and dose amounts are the
// two spans where a mishearing becomes a medication error, so both are marked — with the
// highlighter, which is what a nurse actually does to a line she must not get wrong.
// They differ in pen weight rather than in hue: a second highlighter colour at this size
// reads as "two kinds of pretty" instead of "two kinds of danger".
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NbIcon } from '@/components/nb/NbIcon';
import { NbPaper, nbText } from '@/components/nb/NbUI';
import { nb, nbFonts } from '@/theme/nb';
import { useT } from '@/i18n';
import type { TargetToken } from '@/lib/pronTokens';

type Props = {
  tokens: TargetToken[];
  /** Canonical IPA for the whole line. Omitted when the server could not derive
   *  a reference — the row is then not rendered at all rather than faked. */
  ipa?: string;
  /** e.g. "3회 중 1회차" */
  hint: string;
  onPlayNative(): void;
  /** False when no reference audio exists; the playback chip goes flat. */
  nativeAvailable: boolean;
};

export function TargetCard({ tokens, ipa, hint, onPlayNative, nativeAvailable }: Props) {
  const t = useT();
  return (
    <NbPaper rot={-0.5} style={styles.card}>
      {/* An ink label stuck over the card's own edge — the instruction is not part of
          the sentence, and inside the card it would read as one. */}
      <View style={styles.tag}>
        <Text style={styles.tagText}>{t('pron.repeatAfterMe')}</Text>
      </View>

      <Text style={styles.line}>
        {tokens.map((tk, i) =>
          tk.hi ? (
            <Text key={i} style={[styles.hi, tk.hi === 'drug' && styles.hiDrug]}>{tk.w}</Text>
          ) : (
            <Text key={i}>{tk.w}</Text>
          )
        )}
      </Text>

      {/* Printed, not written: IPA in a handwriting face loses the difference between ɪ
          and i, which is the whole reason it is on the page. */}
      {ipa ? <Text style={styles.ipa}>{ipa}</Text> : null}

      <View style={styles.actions}>
        <Pressable onPress={onPlayNative} disabled={!nativeAvailable} hitSlop={8}>
          <NbPaper rot={0.5} bg="rgba(143,199,232,.3)" style={[styles.playChip, !nativeAvailable && styles.flat]}>
            <NbIcon name="speaker" size={15} />
            <Text style={nbText.hand(14.5)}>{t('pron.native')}</Text>
          </NbPaper>
        </Pressable>
        <View style={styles.spacer} />
        <Text numberOfLines={1} style={nbText.hand(14, nb.soft)}>{hint}</Text>
      </View>
    </NbPaper>
  );
}

const styles = StyleSheet.create({
  card: { paddingTop: 15, paddingBottom: 13, paddingHorizontal: 16 },
  tag: {
    position: 'absolute', top: -11, left: 14,
    backgroundColor: nb.ink, paddingVertical: 1, paddingHorizontal: 9,
    transform: [{ rotate: '-1.5deg' }],
  },
  tagText: { fontFamily: nbFonts.hand, fontSize: 13, color: nb.paper },
  line: { fontFamily: nbFonts.bodyBold, fontSize: 19, color: nb.ink, lineHeight: 29, marginTop: 4 },
  /** The highlighter, drawn as a full band rather than the text's bottom 45%: an inline
   *  Text cannot host a positioned child, so a partial band is not available here. */
  hi: { backgroundColor: nb.marker },
  hiDrug: { textDecorationLine: 'underline' },
  ipa: { fontFamily: nbFonts.mono, fontSize: 11, color: nb.soft, marginTop: 8, lineHeight: 18 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 12 },
  playChip: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 6, paddingHorizontal: 12 },
  flat: { opacity: 0.4 },
  spacer: { flex: 1 },
});
