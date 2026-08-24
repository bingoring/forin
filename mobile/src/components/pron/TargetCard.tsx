// The sentence to say. SoT screen-pronunciation.jsx L36-55.
//
// Highlight colours carry meaning, not decoration: drug names are lilac and
// dose amounts yellow because those are the two spans where a mishearing
// becomes a medication error (L83 of the same file spells that out).
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, fs } from '@/theme/tokens';
import type { TargetToken } from '@/lib/pronTokens';
import { PixelIcon } from '@/components/PixelIcon';
import { PronCard } from './PronCard';

type Props = {
  tokens: TargetToken[];
  /** Canonical IPA for the whole line. Omitted when the server could not derive
   *  a reference — the row is then not rendered at all rather than faked. */
  ipa?: string;
  /** e.g. "3회 중 1회차" */
  hint: string;
  onPlayNative(): void;
  /** False when no reference audio exists; both playback chips go flat. */
  nativeAvailable: boolean;
};

export function TargetCard({ tokens, ipa, hint, onPlayNative, nativeAvailable }: Props) {
  return (
    <PronCard offset={4} style={styles.card}>
      <View style={styles.tag}>
        <Text style={styles.tagText}>따라 말해보세요</Text>
      </View>

      <Text style={styles.line}>
        {tokens.map((tk, i) =>
          tk.hi ? (
            <Text
              key={i}
              style={[styles.hi, { backgroundColor: tk.hi === 'drug' ? colors.lilac : colors.yellow }]}
            >
              {tk.w}
            </Text>
          ) : (
            <Text key={i}>{tk.w}</Text>
          )
        )}
      </Text>

      {ipa ? <Text style={styles.ipa}>{ipa}</Text> : null}

      <View style={styles.actions}>
        {/* SoT labels this 🔊 원어민; the app draws no emoji on screen (762bb6a). */}
        <Pressable
          onPress={onPlayNative}
          disabled={!nativeAvailable}
          hitSlop={8}
          style={[styles.playChip, !nativeAvailable && styles.flat]}
        >
          <PixelIcon name="volume" color={colors.ink} size={13} sw={1.8} />
          <Text style={styles.chipText}>원어민</Text>
        </Pressable>
        <View style={styles.spacer} />
        <Text style={styles.hint}>{hint}</Text>
      </View>
    </PronCard>
  );
}

const styles = StyleSheet.create({
  card: { paddingVertical: 15, paddingHorizontal: 13 },
  tag: {
    position: 'absolute',
    top: -9,
    left: 12,
    backgroundColor: colors.ink,
    paddingVertical: 2,
    paddingHorizontal: 7,
  },
  tagText: { fontFamily: fonts.heading, fontSize: fs(9), color: colors.cream },
  line: { fontFamily: fonts.body, fontSize: fs(16), color: colors.ink, lineHeight: 30, marginTop: 4 },
  hi: {
    fontFamily: fonts.heading,
    fontSize: fs(15),
    borderWidth: 2,
    borderColor: colors.ink,
    paddingHorizontal: 5,
    paddingVertical: 1,
    marginHorizontal: 1, // SoT L43 `margin: '0 1px'` — keeps chips off adjacent words
  },
  ipa: {
    fontFamily: fonts.heading,
    fontSize: fs(10.5),
    color: colors.textSoft,
    marginTop: 9,
    letterSpacing: 0.3,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 11,
    paddingTop: 10,
    borderTopWidth: 2,
    borderStyle: 'dotted',
    borderTopColor: colors.ink + '22',
  },
  playChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.blue,
    borderWidth: 2,
    borderColor: colors.ink,
    paddingVertical: 5,
    paddingHorizontal: 9,
  },
  flat: { opacity: 0.4 },
  chipText: { fontFamily: fonts.heading, fontSize: fs(11), color: colors.ink },
  spacer: { flex: 1 },
  hint: { fontFamily: fonts.body, fontSize: fs(9.5), color: colors.textSoft },
});
