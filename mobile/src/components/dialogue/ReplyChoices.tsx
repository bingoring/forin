// Three ways to answer, for the guided pass of a curriculum step.
//
// Testers froze on the first turn: a patient, an empty text box, and no idea what to
// say. These are what stands in that box's place the first time through a conversation.
//
// Four things here are the result of watching it in use:
//
//  1. It is CAPPED and collapsible. At full height three cards covered the conversation
//     they were answers to, which is the one thing on screen you need in order to choose.
//  2. Each card PRESSES, like every other control in the app. Without it there was no
//     sign a tap had landed.
//  3. The mic is its OWN zone on the right, and a deliberately large one. Picking a
//     reply used to force the pronunciation screen on everybody; speaking is the point
//     of the app but it is not a toll gate, and someone on a bus should be able to
//     choose and send.
//  4. The ranking is NOT printed on the cards. Labelling them 가장 좋은 답 / 꽤 괜찮은
//     답 / 괜찮은 답 answered the question for the learner — they would read the badges
//     and never the sentences. The reason arrives AFTER the choice, where it is feedback
//     instead of an answer key, and the order is shuffled so position gives nothing away.
import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import type { ReplyChoice } from '@/api/client';
import { DisclosureChevron } from '@/components/Collapsible';
import { FIcon } from '@/components/FIcon';
import { colors, fonts, fs } from '@/theme/tokens';
import { playSfx } from '@/lib/sfx';
import { useT } from '@/i18n';

const C = colors.ink;
/** How far a card's cap travels on press — PixelButton's mechanic at a card's scale. */
const PRESS = 3;
/** The mic's own zone. Wide enough to aim at without looking, which is the difference
 *  between "there is a mic somewhere on this card" and a target. */
const MIC_W = 52;

export function ReplyChoices({ choices, loading, selectedText, onPick, onSpeak, onWriteMyOwn, maxHeight }: {
  choices: ReplyChoice[];
  loading: boolean;
  /** The card currently chosen, if any — its reason is shown once it is. */
  selectedText?: string;
  /** Chose this reply. Fills the box; does not leave the screen. */
  onPick: (choice: ReplyChoice) => void;
  /** Asked to practise saying it. The mic zone, and only the mic zone. */
  onSpeak: (choice: ReplyChoice) => void;
  onWriteMyOwn: () => void;
  /** Ceiling for the list, so it cannot grow over the conversation. */
  maxHeight: number;
}) {
  const t = useT();
  const [open, setOpen] = useState(true);
  const [down, setDown] = useState<string | null>(null);

  // Shuffled, stably for this set. Best-first was a second answer key: the top card
  // would be picked every time without anyone reading the other two.
  const shown = useMemo(() => {
    const seed = choices.map((c) => c.text).join('|').length;
    return choices
      .map((c, i) => ({ c, k: (i * 7 + seed) % Math.max(1, choices.length) }))
      .sort((a, b) => a.k - b.k)
      .map((x) => x.c);
  }, [choices]);

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
    <View testID="reply-choices" style={{ gap: 6 }}>
      {/* The header is the collapse control. Three cards at full height covered the
          conversation they were answers to. */}
      <Pressable onPress={() => setOpen((v) => !v)} hitSlop={6} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Text style={{ flex: 1, fontFamily: fonts.heading, fontSize: fs(10), color: colors.textSoft }}>
          {t('choice.prompt')}
        </Text>
        <Text style={{ fontFamily: fonts.heading, fontSize: fs(9.5), color: colors.textSoft }}>
          {t(open ? 'choice.collapse' : 'choice.expand')}
        </Text>
        <DisclosureChevron open={open} color={colors.textSoft} size={12} />
      </Pressable>

      {open && (
        <ScrollView style={{ maxHeight }} showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 7, paddingBottom: 2 }}>
          {shown.map((c, i) => {
            const isDown = down === c.text;
            const dx = isDown ? PRESS : 0;
            const picked = !!selectedText && selectedText === c.text;
            return (
              <View key={i}>
                <View style={{ position: 'absolute', left: PRESS, top: PRESS, right: -PRESS, bottom: -PRESS, backgroundColor: C }} />
                <View
                  style={{
                    flexDirection: 'row',
                    backgroundColor: picked ? colors.mint : '#fff',
                    borderWidth: 2.5,
                    borderColor: C,
                    transform: [{ translateX: dx }, { translateY: dx }],
                  }}
                >
                  {/* Choosing. The whole card except the mic. */}
                  <Pressable
                    onPressIn={() => setDown(c.text)}
                    onPressOut={() => setDown(null)}
                    onPress={() => { playSfx('tap'); onPick(c); }}
                    style={{ flex: 1, paddingVertical: 9, paddingHorizontal: 11, gap: 5 }}
                  >
                    <Text style={{ fontFamily: fonts.body, fontSize: fs(13), color: C, lineHeight: 18 }}>{c.text}</Text>
                    {/* The reason, AFTER the choice. Before it, it is an answer key. */}
                    {picked && !!c.why && (
                      <Text style={{ fontFamily: fonts.body, fontSize: fs(10), color: colors.text, opacity: 0.85, lineHeight: 14 }}>
                        {c.why}
                      </Text>
                    )}
                  </Pressable>

                  {/* Speaking. Its own zone, its own edge, its own size — so nobody is
                      sent to the pronunciation screen by tapping a sentence. */}
                  <Pressable
                    onPress={() => { playSfx('tap'); onSpeak(c); }}
                    style={{
                      width: MIC_W,
                      borderLeftWidth: 2.5,
                      borderLeftColor: C,
                      backgroundColor: colors.yellow,
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 2,
                    }}
                  >
                    <FIcon name="mic" size={16} />
                    <Text style={{ fontFamily: fonts.heading, fontSize: fs(8), color: C }}>{t('choice.speak')}</Text>
                  </Pressable>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}

      <Pressable onPress={onWriteMyOwn} hitSlop={6} style={{ alignSelf: 'center', paddingVertical: 4 }}>
        <Text style={{ fontFamily: fonts.heading, fontSize: fs(10.5), color: colors.textSoft, textDecorationLine: 'underline' }}>
          {t('choice.writeMyOwn')}
        </Text>
      </Pressable>
    </View>
  );
}
