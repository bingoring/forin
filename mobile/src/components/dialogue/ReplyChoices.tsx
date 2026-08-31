// Three ways to answer, for the guided pass of a curriculum step.
//
// Testers said it plainly: facing a patient and an empty text box, they did not know
// what to say. This is what stands in that box's place the first time through a
// conversation — the character speaks, and three real replies appear under it.
//
// None of the three is wrong. A wrong option would make this a quiz, and nobody picks
// the wrong one anyway, so the choice would be theatre. What is actually being chosen
// between is three ways of being competent — and that difference is invisible unless it
// is written down, which is why every choice carries one line of `why` in the learner's
// own language. The `why` is the lesson; the sentences are just how it is delivered.
//
// Ranked, and drawn as ranked: the best one first, in the app's strongest colour. A
// learner who always picks the top one has still read three sentences and one reason
// each — which is more clinical English than the empty box was giving them.
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import type { ReplyChoice } from '@/api/client';
import { FIcon } from '@/components/FIcon';
import { colors, fonts, fs } from '@/theme/tokens';
import { playSfx } from '@/lib/sfx';
import { useT } from '@/i18n';

const C = colors.ink;

/** Per-tier face. Best is the app's action colour; the other two step down without ever
 *  looking like mistakes — they are alternatives, not wrong answers. */
const TIER: Record<ReplyChoice['tier'], { bg: string; labelKey: string }> = {
  best: { bg: colors.mint, labelKey: 'choice.best' },
  strong: { bg: colors.blue, labelKey: 'choice.strong' },
  fair: { bg: colors.cream, labelKey: 'choice.fair' },
};

export function ReplyChoices({ choices, loading, onPick, onWriteMyOwn }: {
  choices: ReplyChoice[];
  loading: boolean;
  /** Picking one takes it to pronunciation practice — the point is to SAY it. */
  onPick: (choice: ReplyChoice) => void;
  /** The way out of the scaffold, always available. A learner who knows what to say
   *  must never have to pick from a list to say it. */
  onWriteMyOwn: () => void;
}) {
  const t = useT();

  if (loading) {
    return (
      <View testID="reply-choices" style={{ paddingVertical: 18, alignItems: 'center', gap: 8 }}>
        <ActivityIndicator color={C} />
        <Text style={{ fontFamily: fonts.body, fontSize: fs(10.5), color: colors.textSoft }}>
          {t('choice.thinking')}
        </Text>
      </View>
    );
  }

  // Nothing usable came back. The text box returns, which is the app working as it
  // always did — a scaffold that fails should leave the learner standing.
  if (choices.length === 0) return null;

  return (
    <View testID="reply-choices" style={{ gap: 7 }}>
      <Text style={{ fontFamily: fonts.heading, fontSize: fs(10), color: colors.textSoft }}>
        {t('choice.prompt')}
      </Text>

      {choices.map((c, i) => {
        const face = TIER[c.tier];
        return (
          <Pressable key={i} onPress={() => { playSfx('tap'); onPick(c); }}>
            <View style={{ position: 'absolute', left: 3, top: 3, right: -3, bottom: -3, backgroundColor: C }} />
            <View style={{ backgroundColor: face.bg, borderWidth: 2.5, borderColor: C, paddingVertical: 9, paddingHorizontal: 11, gap: 5 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <View style={{ backgroundColor: C, paddingVertical: 1, paddingHorizontal: 5 }}>
                  <Text style={{ fontFamily: fonts.heading, fontSize: fs(8.5), color: colors.cream }}>{t(face.labelKey)}</Text>
                </View>
                <View style={{ flex: 1 }} />
                {/* Says what happens next: this is practice at SAYING it, not at
                    recognising it. */}
                <FIcon name="mic" size={12} />
              </View>
              <Text style={{ fontFamily: fonts.body, fontSize: fs(13), color: C, lineHeight: 18 }}>{c.text}</Text>
              {!!c.why && (
                <Text style={{ fontFamily: fonts.body, fontSize: fs(10), color: colors.text, opacity: 0.85, lineHeight: 14 }}>
                  {c.why}
                </Text>
              )}
            </View>
          </Pressable>
        );
      })}

      <Pressable onPress={onWriteMyOwn} hitSlop={6} style={{ alignSelf: 'center', paddingVertical: 6 }}>
        <Text style={{ fontFamily: fonts.heading, fontSize: fs(10.5), color: colors.textSoft, textDecorationLine: 'underline' }}>
          {t('choice.writeMyOwn')}
        </Text>
      </Pressable>
    </View>
  );
}
