// The intents the learner could aim for this turn — the guided pass, redesigned.
//
// It used to hand over three ready-made target-language sentences to pick from. Now it
// hands over three GOALS, each in the learner's own language ("ask where exactly the pain
// is"), and picking one opens the mic below so they say it in the target language
// themselves. The card is the goal, not the words — producing the sentence is the practice.
//
// Three things carried over from the old picker, for the same reasons:
//
//  1. It is CAPPED and collapsible. At full height the cards covered the conversation they
//     answer, which is the one thing on screen you need in order to choose.
//  2. Each card PRESSES, like every other control in the app.
//  3. The ranking is NOT printed on the cards. Labelling them 가장 좋은 답 / 괜찮은 답
//     answered the question for the learner. The reason (`why`) arrives AFTER the choice,
//     where it is feedback rather than an answer key, and the order is shuffled so
//     position gives nothing away.
import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import type { ReplyChoice } from '@/api/client';
import { NbIcon } from '@/components/nb/NbIcon';
import { NbPaper, nbText } from '@/components/nb/NbUI';
import { nb } from '@/theme/nb';
import { playSfx } from '@/lib/sfx';
import { useT } from '@/i18n';

export function ReplyChoices({ choices, loading, onPick, onWriteMyOwn, maxHeight }: {
  choices: ReplyChoice[];
  loading: boolean;
  /** Picked this intent — reveals the mic so they say it themselves. */
  onPick: (choice: ReplyChoice) => void;
  /** The no-microphone fallback: type instead. */
  onWriteMyOwn?: () => void;
  /** Ceiling for the list, so it cannot grow over the conversation. */
  maxHeight: number;
}) {
  const t = useT();
  const [open, setOpen] = useState(true);

  // Shuffled, stably for this set. Best-first was a second answer key: the top card would
  // be picked every time without anyone reading the other two.
  const shown = useMemo(() => {
    const seed = choices.map((c) => c.intent).join('|').length;
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

  // Nothing usable came back. The text box returns, which is the app working as it always
  // did — a scaffold that fails should leave the learner standing.
  if (choices.length === 0) return null;

  return (
    <View testID="reply-choices" style={{ gap: 6 }}>
      {/* The header is the collapse control. Cards at full height covered the conversation. */}
      <Pressable onPress={() => setOpen((v) => !v)} hitSlop={6} style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
        <Text style={[nbText.hand(15.5), { flex: 1, minWidth: 0 }]}>{t('choice.pickIntent')}</Text>
        <Text style={nbText.hand(14, nb.soft)}>{t(open ? 'choice.collapse' : 'choice.expand')}</Text>
        <NbIcon name={open ? 'chevronUp' : 'chevronDown'} size={14} color={nb.soft} />
      </Pressable>

      {open && (
        <ScrollView style={{ maxHeight }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 2 }}>
          {shown.map((c, i) => (
            <Pressable
              key={i}
              onPress={() => { playSfx('tap'); onPick(c); }}
              // Sinks like every other control in the kit — the sign a tap has landed.
              style={({ pressed }) => ({ marginTop: 9, transform: pressed ? [{ translateX: 1.5 }, { translateY: 2 }] : [] })}
            >
              <NbPaper
                rot={i % 2 ? 0.4 : -0.4}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 11, paddingHorizontal: 13 }}
              >
                {/* The goal, in the learner's own language — what to convey, not the words. */}
                <Text style={[nbText.hand(15.5), { flex: 1, minWidth: 0 }]}>{c.intent}</Text>
                <NbIcon name="mic" size={16} color={nb.soft} />
              </NbPaper>
            </Pressable>
          ))}
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
