// The body of one STEP 1 recall card — the prompt the learner answers, and the reveal
// that opens under it on the same sheet once they check (v45 handoff
// forin-notebook-lesson-words-live.jsx Sheet). No flip: the answer is read against the
// prompt it came from, with the chosen option left marked right or wrong.
import { Pressable, Text, View } from 'react-native';
import * as Speech from 'expo-speech';
import { NbIcon } from '@/components/nb/NbIcon';
import { nbText } from '@/components/nb/NbUI';
import type { LessonWord } from '@/api/client';
import { assembled, fragmentPool, optionsFor, stableShuffle, type RecallAnswer, type RecallCard } from '@/data/recall';
import { useT } from '@/i18n';
import { nb, nbFonts } from '@/theme/nb';

const faint = 'rgba(62,54,43,.3)';
/** Collocation pair colours, fixed by the left word's position (handoff: ① blue ② orange ③ purple). */
const PAIR_COL = ['#4A6FA5', '#D9822B', '#8B5CB8', '#5F8D5A', '#C75146'];

type Result = 'right' | 'wrong' | null;

function optionBorder(on: boolean, ok: boolean, bad: boolean) {
  return ok ? nb.green : bad ? nb.red : on ? nb.ink : faint;
}
function optionFill(ok: boolean, bad: boolean) {
  return ok ? 'rgba(95,141,90,.12)' : bad ? 'rgba(199,81,70,.1)' : nb.paper;
}

export function RecallPrompt({ card, pool, answer, onAnswer, result }: {
  card: RecallCard;
  /** The lesson's other words — the option fallback for v44 content. */
  pool: LessonWord[];
  answer: RecallAnswer | null;
  onAnswer: (a: RecallAnswer) => void;
  result: Result;
}) {
  const t = useT();
  const locked = result != null;

  if (card.kind === 'word' && (card.type === 'pick' || card.type === 'listen')) {
    const w = card.word;
    const correct = card.type === 'pick' ? w.en : w.ko;
    const opts = optionsFor(w, card.type, pool);
    const row = card.type === 'listen';
    return (
      <View style={{ marginTop: 12 }}>
        {row && (
          <View style={{ alignItems: 'center' }}>
            <Pressable testID="recall-listen" onPress={() => Speech.speak(w.en, { language: 'en-US', rate: 0.9 })} style={{
              width: 62, height: 62, borderRadius: 31, borderWidth: 2, borderColor: nb.blue, backgroundColor: 'rgba(74,111,165,.1)',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <NbIcon name="speaker" size={30} />
            </Pressable>
            {!!w.ipa && <Text style={[nbText.mono(11.5), { marginTop: 6 }]}>{w.ipa}</Text>}
          </View>
        )}
        <View style={{ flexDirection: row ? 'row' : 'column', gap: row ? 6 : 8, marginTop: row ? 12 : 0 }}>
          {opts.map((o, i) => {
            const on = answer === o;
            const ok = locked && o === correct;
            const bad = locked && on && !ok;
            return (
              <Pressable key={`${i}-${o}`} testID={`recall-opt-${i}`} disabled={locked} onPress={() => onAnswer(o)} style={{
                flex: row ? 1 : undefined, paddingVertical: row ? 9 : 10, paddingHorizontal: row ? 4 : 12,
                borderWidth: 1.6, borderColor: optionBorder(on, ok, bad), backgroundColor: optionFill(ok, bad),
                flexDirection: 'row', alignItems: 'center', justifyContent: row ? 'center' : 'flex-start', gap: 8,
                transform: [{ rotate: `${i % 2 ? 0.4 : -0.4}deg` }],
              }}>
                {!row && (
                  <View style={{ width: 18, height: 18, borderRadius: 9, borderWidth: 1.5, borderColor: ok ? nb.green : bad ? nb.red : nb.soft, alignItems: 'center', justifyContent: 'center' }}>
                    {ok ? <NbIcon name="check" size={11} color={nb.green} /> : bad ? <NbIcon name="cross" size={10} color={nb.red} />
                      : <Text style={nbText.hand(12, nb.soft)}>{String.fromCharCode(65 + i)}</Text>}
                  </View>
                )}
                <Text style={row ? [nbText.hand(14), { textAlign: 'center' }] : { fontFamily: nbFonts.monoBold, fontSize: 14, color: nb.ink }}>{o}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    );
  }

  if (card.kind === 'word') {
    // fill — fragments tapped in order; the app puts in the spaces.
    const w = card.word;
    const picked = (answer as string[] | null) ?? [];
    const pool2 = fragmentPool(w);
    const used = picked.slice();
    return (
      <View style={{ marginTop: 12 }}>
        <View testID="recall-built" style={{
          minHeight: 42, borderBottomWidth: 2, borderColor: locked ? (result === 'wrong' ? nb.red : nb.green) : 'rgba(62,54,43,.5)',
          flexDirection: 'row', alignItems: 'flex-end', flexWrap: 'wrap', gap: 4, paddingBottom: 6,
        }}>
          {picked.length === 0
            ? <Text style={nbText.hand(15, nb.placeholder)}>{`${w.en[0]}${'_ '.repeat(Math.min(w.en.length - 1, 9))}`}</Text>
            : <Pressable disabled={locked} onPress={() => onAnswer(picked.slice(0, -1))}>
                <Text style={{ fontFamily: nbFonts.monoBold, fontSize: 17, color: nb.ink, backgroundColor: 'rgba(249,227,123,.55)', paddingHorizontal: 5 }}>
                  {assembled(w, picked)}
                </Text>
              </Pressable>}
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginTop: 12 }}>
          {pool2.map((ch, i) => {
            const k = used.indexOf(ch);
            const isUsed = k >= 0;
            if (isUsed) used.splice(k, 1);
            return (
              <Pressable key={`${ch}-${i}`} testID={`recall-chip-${ch}`} disabled={locked || isUsed} onPress={() => onAnswer([...picked, ch])} style={{
                paddingVertical: 6, paddingHorizontal: 11, borderWidth: 1.4, borderStyle: isUsed ? 'dashed' : 'solid',
                borderColor: isUsed ? faint : nb.ink, backgroundColor: isUsed ? 'transparent' : nb.paper,
                transform: [{ rotate: `${i % 2 ? 1 : -1}deg` }],
              }}>
                <Text style={{ fontFamily: nbFonts.monoBold, fontSize: 13.5, color: isUsed ? 'transparent' : nb.ink }}>{ch}</Text>
              </Pressable>
            );
          })}
        </View>
        <Text style={[nbText.hand(12.5, nb.soft), { marginTop: 8 }]}>{t('recall.fillHint')}</Text>
      </View>
    );
  }

  const n = card.item;
  if (n.kind === 'slider') {
    const scale = n.scale ?? [];
    return (
      <View style={{ marginTop: 18 }}>
        <View style={{ flexDirection: 'row', marginHorizontal: 8 }}>
          {scale.map((s, i) => {
            const on = answer === i;
            const ok = locked && i === n.answerAt;
            const bad = locked && on && !ok;
            const big = on || ok;
            return (
              <Pressable key={s} testID={`recall-scale-${i}`} disabled={locked} onPress={() => onAnswer(i)} style={{ flex: 1, alignItems: 'center' }}>
                <View style={{ height: 30, justifyContent: 'center', alignSelf: 'stretch', alignItems: 'center' }}>
                  <View style={{ position: 'absolute', left: i === 0 ? '50%' : 0, right: i === scale.length - 1 ? '50%' : 0, height: 4,
                    backgroundColor: ['#7A9E7E', nb.amber, nb.red][Math.min(2, Math.round((i / Math.max(1, scale.length - 1)) * 2))] }} />
                  <View style={{ width: big ? 26 : 18, height: big ? 26 : 18, borderRadius: 13, borderWidth: 2,
                    borderColor: ok ? nb.green : bad ? nb.red : on ? nb.ink : 'rgba(62,54,43,.45)',
                    backgroundColor: ok ? nb.green : bad ? nb.red : on ? nb.ink : nb.paper }} />
                </View>
                <Text style={{ fontFamily: nbFonts.monoBold, fontSize: 11.5, marginTop: 6, textAlign: 'center',
                  color: ok ? nb.green : bad ? nb.red : on ? nb.ink : nb.soft }}>{s}</Text>
              </Pressable>
            );
          })}
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
          <Text style={nbText.hand(12, nb.soft)}>{t('recall.sliderWeak')}</Text>
          <Text style={nbText.hand(12, nb.soft)}>{t('recall.sliderStrong')}</Text>
        </View>
      </View>
    );
  }

  // pair — tap a left word, then its partner on the right.
  const pairs = n.pairs ?? [];
  const links = ((answer as Record<string, string> | null) ?? {}) as Record<string, string>;
  const selected = links.__left;
  const rights = stableShuffle([...pairs.map((p) => p[1]), ...(n.decoys ?? [])], `${n.words.join(',')}|pair`);
  const colOf = (l: string) => PAIR_COL[Math.max(0, pairs.findIndex((p) => p[0] === l)) % PAIR_COL.length];
  const isOk = (l: string, r: string) => pairs.some((p) => p[0] === l && p[1] === r);
  const set = (next: Record<string, string>) => onAnswer(next);
  return (
    <View style={{ marginTop: 14, flexDirection: 'row', gap: 10 }}>
      <View style={{ flex: 1, gap: 8 }}>
        {pairs.map(([l], i) => {
          const r = links[l];
          const on = selected === l;
          const ok = locked && !!r && isOk(l, r);
          const bad = locked && !!r && !isOk(l, r);
          const pc = colOf(l);
          return (
            <Pressable key={l} testID={`recall-left-${i}`} disabled={locked} onPress={() => {
              const next = { ...links };
              if (on) delete next.__left; else next.__left = l;
              set(next);
            }} style={{
              paddingVertical: 9, paddingHorizontal: 10, borderWidth: on || r ? 2.2 : 1.6,
              borderColor: ok ? nb.green : bad ? nb.red : on || r ? pc : faint, backgroundColor: on ? `${pc}14` : nb.paper,
              flexDirection: 'row', alignItems: 'center', gap: 6,
            }}>
              <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: pc, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={nbText.hand(11, '#fff')}>{String(i + 1)}</Text>
              </View>
              <Text style={{ fontFamily: nbFonts.monoBold, fontSize: 12.5, color: nb.ink, flexShrink: 1 }}>{l}</Text>
            </Pressable>
          );
        })}
      </View>
      <View style={{ flex: 1, gap: 8 }}>
        {rights.map((r, i) => {
          const usedBy = pairs.map((p) => p[0]).find((l) => links[l] === r);
          const ok = locked && !!usedBy && isOk(usedBy, r);
          const bad = locked && !!usedBy && !isOk(usedBy, r);
          const pc = usedBy ? colOf(usedBy) : selected ? colOf(selected) : null;
          return (
            <Pressable key={r} testID={`recall-right-${i}`} disabled={locked || !selected} onPress={() => {
              const next: Record<string, string> = {};
              for (const [k, v] of Object.entries(links)) if (k !== '__left' && v !== r) next[k] = v;
              next[selected!] = r;
              set(next);
            }} style={{
              paddingVertical: 9, paddingHorizontal: 10, borderWidth: usedBy ? 2.2 : 1.6, borderStyle: usedBy ? 'solid' : 'dashed',
              borderColor: ok ? nb.green : bad ? nb.red : pc ?? 'rgba(62,54,43,.35)', backgroundColor: usedBy && pc ? `${pc}14` : 'transparent',
              flexDirection: 'row', alignItems: 'center', gap: 6,
            }}>
              {!!usedBy && (
                <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: ok ? nb.green : bad ? nb.red : pc!, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={nbText.hand(11, '#fff')}>{String(pairs.findIndex((p) => p[0] === usedBy) + 1)}</Text>
                </View>
              )}
              <Text style={{ fontFamily: nbFonts.monoBold, fontSize: 12.5, color: nb.ink, flexShrink: 1 }}>{r}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

/** The reveal that opens under the prompt: the answer, how it sounds, and one example. */
export function RecallReveal({ card, result }: { card: RecallCard; result: 'right' | 'wrong' }) {
  const t = useT();
  const wrong = result === 'wrong';
  const headline = card.kind === 'word' ? card.word.en
    : card.item.kind === 'slider' ? (card.item.scale ?? [])[card.item.answerAt ?? 0]
      : (card.item.pairs ?? []).map((p) => `${p[0]} + ${p[1]}`).join(' · ');
  const ipa = card.kind === 'word' ? card.word.ipa : undefined;
  const why = card.kind === 'nuance' ? card.item.why : undefined;
  const ex = card.kind === 'word' ? card.word.example : card.item.example;
  const exKo = card.kind === 'word' ? card.word.exKo : card.item.exKo;
  return (
    <View testID="recall-reveal" style={{ marginTop: 14, paddingTop: 12, borderTopWidth: 1.5, borderStyle: 'dashed', borderColor: faint }}>
      <View testID={wrong ? 'recall-stamp-retry' : 'recall-stamp-good'} style={{
        position: 'absolute', right: 0, top: 6, width: 56, height: 56, borderRadius: 28, borderWidth: 3,
        borderColor: wrong ? nb.red : nb.green, alignItems: 'center', justifyContent: 'center',
        transform: [{ rotate: '-10deg' }], backgroundColor: nb.paper,
      }}>
        <Text style={{ fontFamily: nbFonts.bodyBold, fontSize: 7.5, letterSpacing: 1, color: wrong ? nb.red : nb.green }}>{wrong ? 'RETRY' : 'GOOD'}</Text>
        <Text style={nbText.hand(15, wrong ? nb.red : nb.green)}>{wrong ? t('recall.retry') : t('recall.good')}</Text>
      </View>
      <View style={{ paddingRight: 64 }}>
        <Pressable onPress={() => card.kind === 'word' && Speech.speak(card.word.en, { language: 'en-US', rate: 0.9 })} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text style={{ fontFamily: nbFonts.monoBold, fontSize: 19, color: nb.ink, flexShrink: 1 }}>{headline}</Text>
          {card.kind === 'word' && <NbIcon name="speaker" size={15} />}
        </Pressable>
        {!!ipa && <Text style={[nbText.mono(11), { marginTop: 3 }]}>{ipa}</Text>}
      </View>
      {!!why && (
        <View style={{ marginTop: 8, paddingVertical: 6, paddingHorizontal: 9, borderWidth: 1.3, borderStyle: 'dashed', borderColor: nb.blue, backgroundColor: 'rgba(74,111,165,.05)' }}>
          <Text style={[nbText.hand(13.5), { lineHeight: 19 }]}>
            <Text style={{ color: nb.blue, fontFamily: nbFonts.handBold }}>{`${t('recall.nuance')} `}</Text>{why}
          </Text>
        </View>
      )}
      {!!ex && (
        <View style={{ marginTop: 9, paddingVertical: 8, paddingHorizontal: 10, borderLeftWidth: 2.5, borderColor: nb.blue, backgroundColor: 'rgba(74,111,165,.06)' }}>
          <Text style={[nbText.body(13), { fontFamily: nbFonts.bodyBold }]}>{ex}</Text>
          {!!exKo && <Text style={[nbText.hand(13, nb.soft), { marginTop: 2 }]}>{exKo}</Text>}
        </View>
      )}
    </View>
  );
}
