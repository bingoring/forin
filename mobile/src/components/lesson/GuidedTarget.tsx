// STEP 3 가이드 대화의 목표 카드 (lesson-four-steps-v44 J; handoff v45 DialogueOptions).
//
// It replaced the three reply choices: one Korean target sentence, highlighted, which
// the learner then says (or types) in the target language with the dialogue's own
// input below. The sentence's chunks are the hints — the first shows, the rest are
// hatched until `힌트 더` opens the next one. The hints reset with each new sentence
// (the parent keys this card on it).
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import * as Speech from 'expo-speech';
import { NbIcon } from '@/components/nb/NbIcon';
import { NbMark, NbPaper, nbText } from '@/components/nb/NbUI';
import type { LessonSentence } from '@/api/client';
import { useT } from '@/i18n';
import { nb, nbFonts } from '@/theme/nb';

const PUNCT = /^[.,?!]$/;

export function GuidedTarget({ sentence }: { sentence: LessonSentence }) {
  const t = useT();
  const hints = sentence.chunks.filter((c) => !PUNCT.test(c));
  const [shown, setShown] = useState(1);
  return (
    <View testID="guided-target" style={{ marginTop: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <NbIcon name="speech" size={16} />
        <Text style={nbText.hand(15.5)}>{t('guided.sayThis')}</Text>
        <View style={{ flex: 1 }} />
        <Text style={[nbText.hand(12.5, nb.soft), { borderWidth: 1.3, borderColor: nb.soft, paddingHorizontal: 6 }]}>{t('guided.stepTag')}</Text>
      </View>
      <NbPaper rot={-0.5} tape tapeLeft={120} style={{ marginTop: 9, paddingTop: 13, paddingHorizontal: 14, paddingBottom: 11 }}>
        <NbMark textStyle={[nbText.hand(20), { lineHeight: 27 }]}>{sentence.ko}</NbMark>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10, alignItems: 'center' }}>
          {hints.map((h, i) => {
            const open = i < shown;
            return (
              <View key={`${h}-${i}`} testID={open ? 'guided-hint-open' : 'guided-hint-closed'} style={{
                borderWidth: 1.3, borderStyle: open ? 'solid' : 'dashed', borderColor: nb.blue, borderRadius: 3,
                paddingVertical: 3, paddingHorizontal: 8, backgroundColor: open ? `${nb.blue}18` : 'rgba(62,54,43,.06)',
                transform: [{ rotate: `${i % 2 ? 0.8 : -0.8}deg` }],
              }}>
                <Text style={{ fontFamily: nbFonts.monoBold, fontSize: 11.5, color: open ? nb.ink : 'transparent' }}>{h}</Text>
              </View>
            );
          })}
          {shown < hints.length && (
            <Pressable testID="guided-hint-more" onPress={() => setShown((n) => n + 1)} hitSlop={8} style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
              <NbIcon name="bulb" size={13} />
              <Text style={[nbText.hand(12.5, nb.blue), { textDecorationLine: 'underline' }]}>{t('guided.hintMore')}</Text>
            </Pressable>
          )}
          <View style={{ flex: 1 }} />
          <Pressable testID="guided-listen" onPress={() => Speech.speak(sentence.en, { language: 'en-US', rate: 0.9 })} hitSlop={8}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <NbIcon name="speaker" size={15} />
            <Text style={nbText.hand(13)}>{t('guided.listen')}</Text>
          </Pressable>
        </View>
      </NbPaper>
    </View>
  );
}
