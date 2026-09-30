// The body of one STEP 2 card (lesson-four-steps-v44 I). Every type is answered on the
// card, checked, and explained under it on the same sheet — the recall sheet's pattern.
import { Pressable, Text, View } from 'react-native';
import * as Speech from 'expo-speech';
import { NbIcon } from '@/components/nb/NbIcon';
import { NbMark, nbText } from '@/components/nb/NbUI';
import type { LessonSentence, LessonWord } from '@/api/client';
import {
  assembledSentence, blankOf, chunkPool, contextAnswer, listenOptions, type DrillAnswer, type DrillCard,
} from '@/data/sentenceDrill';
import { stableShuffle } from '@/data/recall';
import { useT } from '@/i18n';
import { nb, nbFonts } from '@/theme/nb';

const faint = 'rgba(62,54,43,.3)';
type Result = 'right' | 'wrong' | null;

const say = (en: string) => Speech.speak(en, { language: 'en-US', rate: 0.9 });

function Option({ testID, label, on, ok, bad, disabled, onPress, mono }: {
  testID: string; label: string; on: boolean; ok: boolean; bad: boolean; disabled: boolean; onPress: () => void; mono?: boolean;
}) {
  return (
    <Pressable testID={testID} disabled={disabled} onPress={onPress} style={{
      marginTop: 8, paddingVertical: 11, paddingHorizontal: 12, borderWidth: 1.6,
      borderColor: ok ? nb.green : bad ? nb.red : on ? nb.ink : faint,
      backgroundColor: ok ? 'rgba(95,141,90,.12)' : bad ? 'rgba(199,81,70,.1)' : nb.paper,
      flexDirection: 'row', alignItems: 'center', gap: 8,
    }}>
      {ok && <NbIcon name="check" size={14} color={nb.green} />}
      {bad && <NbIcon name="cross" size={12} color={nb.red} />}
      <Text style={mono ? { fontFamily: nbFonts.monoBold, fontSize: 13.5, color: nb.ink, flexShrink: 1 } : [nbText.hand(16), { flexShrink: 1 }]}>{label}</Text>
    </Pressable>
  );
}

/** Tap-to-place pieces: a row of placed pieces over a pool; tap a placed one to take it back. */
function Assemble({ testIDPrefix, pool, picked, onChange, locked, render }: {
  testIDPrefix: string; pool: string[]; picked: string[]; onChange: (p: string[]) => void; locked: boolean; render: (p: string[]) => string;
}) {
  const left = picked.slice();
  return (
    <View>
      <Pressable testID={`${testIDPrefix}-built`} disabled={locked || picked.length === 0} onPress={() => onChange(picked.slice(0, -1))} style={{
        minHeight: 64, marginTop: 8, padding: 12, borderWidth: 1.6, borderStyle: 'dashed', borderColor: faint, backgroundColor: nb.paper,
      }}>
        <Text style={{ fontFamily: nbFonts.monoBold, fontSize: 15, color: nb.ink, lineHeight: 22 }}>{render(picked)}</Text>
      </Pressable>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
        {pool.map((p, i) => {
          const k = left.indexOf(p);
          const used = k >= 0;
          if (used) left.splice(k, 1);
          return (
            <Pressable key={`${p}-${i}`} testID={`${testIDPrefix}-${i}`} disabled={locked || used} onPress={() => onChange([...picked, p])} style={{
              paddingVertical: 8, paddingHorizontal: 12, borderWidth: 1.4, borderStyle: used ? 'dashed' : 'solid',
              borderColor: used ? faint : nb.ink, backgroundColor: used ? 'transparent' : nb.paper,
              transform: [{ rotate: `${i % 2 ? 1 : -1}deg` }],
            }}>
              <Text style={{ fontFamily: nbFonts.monoBold, fontSize: 13.5, color: used ? 'transparent' : nb.ink }}>{p}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export function SentPrompt({ card, all, words, answer, onAnswer, result, reelAt, onReelNext }: {
  card: DrillCard; all: LessonSentence[]; words: LessonWord[];
  answer: DrillAnswer | null; onAnswer: (a: DrillAnswer) => void; result: Result;
  reelAt: number; onReelNext: () => void;
}) {
  const t = useT();
  const locked = result != null;

  if (card.kind === 'reel') {
    const scenes = card.item.scenes ?? [];
    const sc = scenes[Math.min(reelAt, scenes.length - 1)];
    const word = card.item.word ?? '';
    const parts = sc ? sc.en.split(new RegExp(`(${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\w*)`, 'i')) : [];
    return (
      <View style={{ marginTop: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={{ fontFamily: nbFonts.monoBold, fontSize: 22, color: nb.ink }}>{word}</Text>
          <Pressable onPress={() => say(word)} hitSlop={8}><NbIcon name="speaker" size={16} /></Pressable>
          <View style={{ flex: 1 }} />
          <Text style={nbText.mono(11)}>{`${Math.min(reelAt + 1, scenes.length)} / ${scenes.length}`}</Text>
        </View>
        {!!sc && (
          <Pressable testID="sent-reel-card" onPress={onReelNext} style={{
            marginTop: 12, padding: 16, minHeight: 180, backgroundColor: nb.paper, borderWidth: sc.swap ? 1.5 : 1,
            borderStyle: sc.swap ? 'dashed' : 'solid', borderColor: sc.swap ? nb.amber : nb.paperEdge,
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={[nbText.hand(13, sc.swap ? nb.amber : nb.blue), { borderWidth: 1.3, borderColor: sc.swap ? nb.amber : nb.blue, paddingHorizontal: 6 }]}>{sc.who}</Text>
              <View style={{ flex: 1 }} />
              {!!sc.tone && <Text style={[nbText.hand(12.5, nb.soft), { borderWidth: 1.3, borderColor: faint, paddingHorizontal: 6 }]}>{sc.tone}</Text>}
            </View>
            <Text style={[nbText.body(16), { fontFamily: nbFonts.bodyBold, marginTop: 14, lineHeight: 25 }]}>
              {parts.map((p, k) => (k % 2 ? <Text key={k} style={{ backgroundColor: 'rgba(249,227,123,.7)' }}>{p}</Text> : p))}
            </Text>
            {!!sc.ko && <Text style={[nbText.hand(14.5, nb.soft), { marginTop: 10 }]}>{sc.ko}</Text>}
            {reelAt < scenes.length - 1 && <Text style={[nbText.hand(12.5, nb.soft), { marginTop: 12, textAlign: 'right' }]}>{t('sent.reelNext')}</Text>}
          </Pressable>
        )}
      </View>
    );
  }

  if (card.kind === 'order') {
    const pool = stableShuffle(card.sentences.map((s) => s.en), `${card.sentences[0]?.en}|order`);
    const picked = (answer as string[] | null) ?? [];
    return (
      <View style={{ marginTop: 10 }}>
        <Assemble testIDPrefix="sent-order" pool={pool} picked={picked} onChange={onAnswer} locked={locked}
          render={(p) => p.map((en, i) => `${i + 1}. ${en}`).join('\n')} />
      </View>
    );
  }

  if (card.kind === 'context') {
    const scenes = card.item.scenes ?? [];
    const wrong = contextAnswer(card.item);
    return (
      <View style={{ marginTop: 6 }}>
        {scenes.map((sc, i) => {
          const on = answer === i;
          const ok = locked && i === wrong;
          const bad = locked && on && !ok;
          return (
            <Pressable key={i} testID={`sent-scene-${i}`} disabled={locked} onPress={() => onAnswer(i)} style={{
              marginTop: 8, padding: 11, borderWidth: 1.6, borderColor: ok ? nb.red : bad ? nb.ink : on ? nb.ink : faint,
              backgroundColor: ok ? 'rgba(199,81,70,.08)' : nb.paper,
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                {!!sc.icon && <NbIcon name={sc.icon} size={15} />}
                <Text style={nbText.hand(13, nb.blue)}>{sc.who}</Text>
              </View>
              <Text style={[nbText.body(13.5), { marginTop: 4, textDecorationLine: ok ? 'line-through' : 'none' }]}>{sc.en}</Text>
              {ok && !!sc.fix && (
                <Text style={[nbText.body(13.5), { marginTop: 4, backgroundColor: 'rgba(249,227,123,.55)', fontFamily: nbFonts.bodyBold }]}>{sc.fix}</Text>
              )}
            </Pressable>
          );
        })}
      </View>
    );
  }

  if (card.kind === 'swap') {
    const n = card.item;
    const [before, target, after] = n.before ?? ['', '', ''];
    const chosen = typeof answer === 'string' ? answer : null;
    return (
      <View style={{ marginTop: 10 }}>
        {!!n.who && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            {!!n.icon && <NbIcon name={n.icon} size={15} />}
            <Text style={nbText.hand(13, nb.blue)}>{n.who}</Text>
          </View>
        )}
        <Text style={[nbText.body(16), { marginTop: 8, lineHeight: 26 }]}>
          {before}
          {chosen
            ? <Text style={{ fontFamily: nbFonts.handBold, color: nb.blue }}>{chosen}</Text>
            : <Text style={{ textDecorationLine: 'underline', fontFamily: nbFonts.bodyBold }}>{target}</Text>}
          {after}
        </Text>
        {(n.options ?? []).map((o, i) => (
          <View key={o}>
            <Option testID={`sent-opt-${i}`} label={o} mono on={chosen === o} ok={locked && o === n.answer} bad={locked && chosen === o && o !== n.answer}
              disabled={locked} onPress={() => onAnswer(o)} />
            {locked && !!n.notes?.[o] && <Text style={[nbText.hand(13, nb.soft), { marginTop: 3, marginLeft: 4 }]}>{n.notes[o]}</Text>}
          </View>
        ))}
      </View>
    );
  }

  // sentence cards
  const s = card.sentence;
  if (card.type === 'listen') {
    const opts = listenOptions(s, all);
    return (
      <View style={{ marginTop: 10, alignItems: 'stretch' }}>
        <Pressable testID="sent-play" onPress={() => say(s.en)} style={{
          alignSelf: 'center', width: 86, height: 86, borderRadius: 43, borderWidth: 2.5, borderColor: nb.blue,
          backgroundColor: `${nb.blue}18`, alignItems: 'center', justifyContent: 'center',
        }}>
          <NbIcon name="speaker" size={42} />
        </Pressable>
        {opts.map((o, i) => (
          <Option key={o} testID={`sent-opt-${i}`} label={o} on={answer === o} ok={locked && o === s.ko} bad={locked && answer === o && o !== s.ko}
            disabled={locked} onPress={() => onAnswer(o)} />
        ))}
      </View>
    );
  }
  if (card.type === 'chunks') {
    return (
      <View style={{ marginTop: 6 }}>
        <Assemble testIDPrefix="sent-chunk" pool={chunkPool(s, all)} picked={(answer as string[] | null) ?? []} onChange={onAnswer} locked={locked}
          render={(p) => assembledSentence(s, p)} />
        <View style={{ marginTop: 12, paddingVertical: 7, paddingHorizontal: 10, borderLeftWidth: 2.5, borderColor: nb.blue, backgroundColor: 'rgba(74,111,165,.06)' }}>
          <Text style={nbText.hand(14.5)}>{s.ko}</Text>
        </View>
      </View>
    );
  }
  // blank
  const b = blankOf(s, all, words);
  const chosen = typeof answer === 'string' ? answer : null;
  const [pre, post] = b ? [s.en.slice(0, s.en.indexOf(b.answer)), s.en.slice(s.en.indexOf(b.answer) + b.answer.length)] : [s.en, ''];
  return (
    <View style={{ marginTop: 8 }}>
      <Text style={[nbText.body(17), { fontFamily: nbFonts.bodyBold, lineHeight: 30 }]}>
        {pre}
        <Text style={{ color: nb.blue, textDecorationLine: 'underline' }}>{chosen ?? ' ______ '}</Text>
        {post}
      </Text>
      <Text style={[nbText.hand(14.5, nb.soft), { marginTop: 6 }]}>{s.ko}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6 }}>
        {(b?.options ?? []).map((o, i) => (
          <View key={o} style={{ width: '48%' }}>
            <Option testID={`sent-opt-${i}`} label={o} mono on={chosen === o} ok={locked && o === b!.answer} bad={locked && chosen === o && o !== b!.answer}
              disabled={locked} onPress={() => onAnswer(o)} />
          </View>
        ))}
      </View>
    </View>
  );
}

/** Under the card once checked: the line itself, its meaning, and — for nuance — why. */
export function SentReveal({ card, result }: { card: DrillCard; result: 'right' | 'wrong' }) {
  const t = useT();
  const wrong = result === 'wrong';
  const line = card.kind === 'sentence' ? card.sentence.en
    : card.kind === 'order' ? card.sentences.map((s, i) => `${i + 1}. ${s.en}`).join('\n')
      : card.kind === 'context' ? ((card.item.scenes ?? [])[contextAnswer(card.item)]?.fix ?? '')
        : card.kind === 'swap' ? `${(card.item.before ?? [])[0] ?? ''}${card.item.answer ?? ''}${(card.item.before ?? [])[2] ?? ''}` : '';
  const ko = card.kind === 'sentence' ? card.sentence.ko : undefined;
  const why = card.kind === 'context' || card.kind === 'swap' ? card.item.why : undefined;
  return (
    <View testID="sent-reveal" style={{ marginTop: 14, paddingTop: 12, borderTopWidth: 1.5, borderStyle: 'dashed', borderColor: faint }}>
      <View testID={wrong ? 'sent-stamp-retry' : 'sent-stamp-good'} style={{
        position: 'absolute', right: 0, top: 6, width: 56, height: 56, borderRadius: 28, borderWidth: 3,
        borderColor: wrong ? nb.red : nb.green, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-10deg' }], backgroundColor: nb.paper,
      }}>
        <Text style={{ fontFamily: nbFonts.bodyBold, fontSize: 7.5, letterSpacing: 1, color: wrong ? nb.red : nb.green }}>{wrong ? 'RETRY' : 'GOOD'}</Text>
        <Text style={nbText.hand(15, wrong ? nb.red : nb.green)}>{wrong ? t('recall.retry') : t('recall.good')}</Text>
      </View>
      {card.kind === 'context' && <Text style={nbText.hand(13, nb.soft)}>{t('sent.fix')}</Text>}
      <Pressable onPress={() => line && say(line)} style={{ paddingRight: 64, flexDirection: 'row', gap: 6, alignItems: 'flex-start' }}>
        <Text style={[nbText.body(14.5), { fontFamily: nbFonts.bodyBold, flexShrink: 1 }]}>{line}</Text>
        <NbIcon name="speaker" size={15} />
      </Pressable>
      {!!ko && <Text style={[nbText.hand(13.5, nb.soft), { marginTop: 4 }]}>{ko}</Text>}
      {!!why && (
        <View style={{ marginTop: 8, paddingVertical: 6, paddingHorizontal: 9, borderWidth: 1.3, borderStyle: 'dashed', borderColor: nb.blue, backgroundColor: 'rgba(74,111,165,.05)' }}>
          <NbMark textStyle={nbText.hand(13.5)}>{t('recall.nuance')}</NbMark>
          <Text style={[nbText.hand(13.5), { lineHeight: 19, marginTop: 2 }]}>{why}</Text>
        </View>
      )}
    </View>
  );
}
