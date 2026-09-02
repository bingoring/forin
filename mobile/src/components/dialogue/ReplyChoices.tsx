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
import { NbIcon } from '@/components/nb/NbIcon';
import { NbPaper, nbText } from '@/components/nb/NbUI';
import { nb, nbFonts } from '@/theme/nb';
import { playSfx } from '@/lib/sfx';
import { useT } from '@/i18n';

/** The mic's own zone. Wide enough to aim at without looking, which is the difference
 *  between "there is a mic somewhere on this card" and a target. */
const MIC_W = 56;

export function ReplyChoices({ choices, loading, selectedText, onPick, onSpeak, onWriteMyOwn, maxHeight }: {
  choices: ReplyChoice[];
  loading: boolean;
  /** The card currently chosen, if any — its reason is shown once it is. */
  selectedText?: string;
  /** Chose this reply. Fills the box; does not leave the screen. */
  onPick: (choice: ReplyChoice) => void;
  /** Asked to practise saying it. The mic zone, and only the mic zone. */
  onSpeak: (choice: ReplyChoice) => void;
  /** Undefined on an authored conversation: there is nothing to escape to, and the
   *  learner writes it themselves in the NEXT curriculum step, not from a link here. */
  onWriteMyOwn?: () => void;
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
        <ActivityIndicator color={nb.ink} />
        <Text style={nbText.hand(15, nb.soft)}>{t('choice.thinking')}</Text>
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
      <Pressable onPress={() => setOpen((v) => !v)} hitSlop={6} style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
        <Text style={[nbText.hand(15.5), { flex: 1, minWidth: 0 }]}>{t('choice.prompt')}</Text>
        <Text style={nbText.hand(14, nb.soft)}>{t(open ? 'choice.collapse' : 'choice.expand')}</Text>
        <NbIcon name={open ? 'chevronUp' : 'chevronDown'} size={14} color={nb.soft} />
      </Pressable>

      {open && (
        <ScrollView style={{ maxHeight }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 2 }}>
          {shown.map((c, i) => {
            const picked = !!selectedText && selectedText === c.text;
            return (
              <NbPaper
                key={i}
                rot={i % 2 ? 0.4 : -0.4}
                // Picked: the marker's own yellow, so the card that was chosen is the one
                // with highlighter on it — the same device the rest of the notebook uses
                // for "this one".
                bg={picked ? 'rgba(249,227,123,.45)' : undefined}
                style={{ marginTop: 9, flexDirection: 'row', alignItems: 'stretch', overflow: 'hidden' }}
              >
                {/* Choosing. The whole card except the mic. */}
                <Pressable
                  onPress={() => { playSfx('tap'); onPick(c); }}
                  style={({ pressed }) => ({
                    flex: 1, paddingVertical: 10, paddingHorizontal: 12, gap: 5,
                    // Sinks like every other control in the kit. Without it there was no
                    // sign a tap had landed.
                    transform: pressed ? [{ translateX: 1.5 }, { translateY: 2 }] : [],
                  })}
                >
                  <Text style={nbText.body(13.5)}>{c.text}</Text>
                  {/* The reason, AFTER the choice. Before it, it is an answer key. */}
                  {picked && !!c.why && (
                    <Text style={nbText.hand(14, nb.soft)}>{c.why}</Text>
                  )}
                </Pressable>

                {/* Speaking. Its own zone, its own edge, its own size — so nobody is sent
                    to the pronunciation screen by tapping a sentence. */}
                <Pressable
                  onPress={() => { playSfx('tap'); onSpeak(c); }}
                  style={{
                    width: MIC_W, backgroundColor: 'rgba(249,227,123,.55)',
                    borderLeftWidth: 1.5, borderLeftColor: nb.paperEdge,
                    alignItems: 'center', justifyContent: 'center', gap: 2, flexShrink: 0,
                  }}
                >
                  <NbIcon name="mic" size={16} />
                  <Text style={nbText.hand(12.5)}>{t('choice.speak')}</Text>
                </Pressable>
              </NbPaper>
            );
          })}
        </ScrollView>
      )}

      {!!onWriteMyOwn && (
        <Pressable onPress={onWriteMyOwn} hitSlop={6} style={{ alignSelf: 'center', paddingVertical: 6 }}>
          <Text style={[nbText.hand(14.5, nb.blue), { textDecorationLine: 'underline' }]}>
            {t('choice.writeMyOwn')}
          </Text>
        </Pressable>
      )}
    </View>
  );
}
