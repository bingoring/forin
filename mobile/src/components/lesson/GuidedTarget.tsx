// STEP 3 가이드 대화의 목표 카드 (lesson-four-steps-v44 J; handoff v46 dialogue.jsx
// DialogueOptions L130–149, matched 1:1 in lesson-fidelity-v46 T7).
//
// It replaced the three reply choices: one Korean target sentence, highlighted, which
// the learner then says (or types) in the target language with the input below it. The
// sentence's chunks are the hints — the first shows, the rest are hatched until `힌트 더`
// opens the next one. The hints reset with each new sentence (the parent keys this card on
// it). 듣기 is the rail's (L180), not the card's.
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import { NbIcon } from '@/components/nb/NbIcon';
import { NbMark, NbPaper, nbText } from '@/components/nb/NbUI';
import type { LessonSentence } from '@/api/client';
import { useT } from '@/i18n';
import { nb, nbFonts } from '@/theme/nb';

const PUNCT = /^[.,?!]$/;

/** The sentence's word chunks — the hints, and what the typing card's chips come from. */
export function hintChunks(sentence: LessonSentence): string[] {
  return sentence.chunks.map((c) => c.replace(/^[\s.,?!]+|[\s.,?!]+$/g, '')).filter((c) => c && !PUNCT.test(c));
}

export function GuidedTarget({ sentence }: { sentence: LessonSentence }) {
  const t = useT();
  const hints = sentence.chunks.filter((c) => !PUNCT.test(c));
  const [shown, setShown] = useState(1);
  return (
    <View testID="guided-target">
      {/* L131–136 */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <NbIcon name="speech" size={16} />
        <Text style={nbText.hand(15.5)}>{t('guided.sayThis')}</Text>
        <View style={{ flex: 1 }} />
        <Text numberOfLines={1} style={[nbText.hand(12.5, nb.soft), { borderWidth: 1.3, borderColor: nb.soft, borderRadius: 2, paddingHorizontal: 6 }]}>{t('guided.stepTag')}</Text>
      </View>
      {/* L137 paper(-0.5), marginTop 9, padding 13/14/11. */}
      <NbPaper rot={-0.5} style={{ marginTop: 9, paddingTop: 13, paddingHorizontal: 14, paddingBottom: 11 }}>
        {/* L138: its own strip — 70 wide and without the tape shadow other cards carry. */}
        <View testID="guided-tape" pointerEvents="none" style={{ position: 'absolute', top: -10, left: 120, width: 70, height: 20, backgroundColor: nb.tape, transform: [{ rotate: '-4deg' }] }} />
        {/* L139–140 Gaegu 20, lineHeight 1.35, marker from 55%, padding 0 2. */}
        <NbMark textStyle={[nbText.hand(20), { lineHeight: 27 }]}>{sentence.ko}</NbMark>
        {/* L143 wrap, gap 6, marginTop 10. */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
          {hints.map((h, i) => {
            const open = i < shown;
            return (
              // L145 MONO 11.5 700, blue+18 / hatched, 1.3 solid|dashed blue, radius 3, 3/8, ±0.8°.
              <View key={`${h}-${i}`} testID={open ? 'guided-hint-open' : 'guided-hint-closed'} style={{
                borderWidth: 1.3, borderStyle: open ? 'solid' : 'dashed', borderColor: nb.blue, borderRadius: 3,
                paddingVertical: 3, paddingHorizontal: 8, overflow: 'hidden',
                ...(open ? { backgroundColor: `${nb.blue}18` } : null),
                transform: [{ rotate: `${i % 2 ? 0.8 : -0.8}deg` }],
              }}>
                {!open && <Hatch />}
                <Text style={{ fontFamily: nbFonts.monoBold, fontSize: 11.5, color: open ? nb.ink : 'transparent' }}>{h}</Text>
              </View>
            );
          })}
          {/* L147 bulb 13 + Gaegu 12.5 blue underlined, centred, always on the card. */}
          <Pressable
            testID="guided-hint-more"
            onPress={() => setShown((n) => Math.min(hints.length, n + 1))}
            hitSlop={8}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 3, alignSelf: 'center' }}
          >
            <NbIcon name="bulb" size={13} />
            <Text style={[nbText.hand(12.5, nb.blue), { textDecorationLine: 'underline' }]}>{t('guided.hintMore')}</Text>
          </Pressable>
        </View>
      </NbPaper>
    </View>
  );
}

/** `repeating-linear-gradient(-45deg, rgba(62,54,43,.12) 0 3px, transparent 3px 6px)` —
 *  3pt bands every 6pt measured across them, so 6·√2 apart along a row. */
function Hatch() {
  const step = 6 * Math.SQRT2;
  const h = 40;
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Svg width="100%" height="100%">
        {Array.from({ length: 40 }).map((_, k) => {
          const x = k * step;
          return <Line key={k} x1={x - h} y1={h} x2={x} y2={0} stroke="rgba(62,54,43,.12)" strokeWidth={3} />;
        })}
      </Svg>
    </View>
  );
}
