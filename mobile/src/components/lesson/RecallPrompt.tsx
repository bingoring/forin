// The body of one STEP 1 recall card — the prompt the learner answers, and the reveal that
// opens under it on the same sheet once they check. No flip: the answer is read against the
// prompt it came from, with the chosen option left marked right or wrong.
//
// 정본(R1): design-handoff_v46/reference/forin-notebook-lesson-words-live.jsx (WL)
//   L56–67   pick     · L68–81 listen · L82–104 slider · L105–134 pair · L135–152 fill
//   L176–194 reveal (nb-reveal · GOOD/RETRY stamp nb-ok · answer · IPA · 뉘앙스 · example · 내 답)
// Audit rows: audit/audit-step1-words.md §2-D … §2-I.
//
// The handoff draws one Sheet three times (current · dim next underneath · the torn copy);
// `inert` is for the two that are not the one being answered: no handlers, no test ids.
import { useEffect, useState, type ReactNode } from 'react';
import { Animated, Platform, Pressable, Text, View } from 'react-native';
import Svg, { Defs, Line, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import * as Speech from 'expo-speech';
import { NbIcon } from '@/components/nb/NbIcon';
import { NbDoubleRing, nbText } from '@/components/nb/NbUI';
import { CSS_EASE, NbEnter, useNbColorTransition, useReduceMotion } from '@/components/nb/nbMotion';
import { SHEET } from '@/components/lesson/SheetStack';
import type { LessonWord } from '@/api/client';
import { fragmentPool, optionsFor, stableShuffle, type RecallAnswer, type RecallCard } from '@/data/recall';
import { useT } from '@/i18n';
import { hardShadow, nb, nbFonts } from '@/theme/nb';

const faint = 'rgba(62,54,43,.3)';
/** WL L111: the collocation colours, fixed by the left word's position (blue · orange · purple);
 *  past three, ink (`|| c.ink`). */
const PAIR_COL = ['#4A6FA5', '#D9822B', '#8B5CB8'];

type Result = 'right' | 'wrong' | null;

function optionBorder(on: boolean, ok: boolean, bad: boolean) {
  return ok ? nb.green : bad ? nb.red : on ? nb.ink : faint;
}
function optionFill(ok: boolean, bad: boolean) {
  return ok ? 'rgba(95,141,90,.12)' : bad ? 'rgba(199,81,70,.1)' : nb.paper;
}
const speak = (s: string) => Speech.speak(s, { language: 'en-US', rate: 0.9 });

export function RecallPrompt({ card, pool, answer, onAnswer, result, inert }: {
  card: RecallCard;
  /** The lesson's other words — the option fallback for v44 content. */
  pool: LessonWord[];
  answer: RecallAnswer | null;
  onAnswer: (a: RecallAnswer) => void;
  result: Result;
  /** The dim sheet underneath or the torn copy: drawn, not answered. */
  inert?: boolean;
}) {
  const t = useT();
  const locked = result != null || !!inert;
  const id = (s: string) => (inert ? undefined : s);

  if (card.kind === 'word' && card.type === 'pick') {
    // WL L56–67: three English options, stacked, tilted ±.4°, A/B/C in a ring.
    const w = card.word;
    const opts = optionsFor(w, 'pick', pool);
    return (
      <View style={{ marginTop: 14 }}>
        {opts.map((o, i) => {
          const on = answer === o;
          const ok = result != null && o === w.en;
          const bad = result != null && on && !ok;
          return (
            <Pressable key={`${i}-${o}`} testID={id(`recall-opt-${i}`)} disabled={locked} onPress={() => onAnswer(o)} style={{
              marginTop: i ? 8 : 0, paddingVertical: 10, paddingHorizontal: 12,
              borderWidth: 1.6, borderColor: optionBorder(on, ok, bad), backgroundColor: optionFill(ok, bad),
              flexDirection: 'row', alignItems: 'center', gap: 8,
              transform: [{ rotate: `${i % 2 ? 0.4 : -0.4}deg` }],
            }}>
              <View style={{ width: 18, height: 18, borderRadius: 9, borderWidth: 1.5, borderColor: ok ? nb.green : bad ? nb.red : nb.soft, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {/* ✓ / ✕ (HW 12) drawn — 결정 4. */}
                {ok ? <NbIcon name="check" size={12} color={nb.green} /> : bad ? <NbIcon name="cross" size={11} color={nb.red} />
                  : <Text style={nbText.hand(12, nb.soft)}>{String.fromCharCode(65 + i)}</Text>}
              </View>
              <Text style={[nbText.monoBold(14, nb.ink), { flexShrink: 1 }]}>{o}</Text>
            </Pressable>
          );
        })}
      </View>
    );
  }

  if (card.kind === 'word' && card.type === 'listen') {
    // WL L68–81: the speaker, the IPA, three meanings in a row tilted ±.6°.
    const w = card.word;
    const opts = optionsFor(w, 'listen', pool);
    return (
      <View style={{ marginTop: 12 }}>
        <View style={{ alignItems: 'center' }}>
          <Pressable testID={id('recall-listen')} disabled={!!inert} onPress={() => speak(w.en)} style={{
            width: 62, height: 62, borderRadius: 31, borderWidth: 2, borderColor: nb.blue, backgroundColor: 'rgba(74,111,165,.1)',
            alignItems: 'center', justifyContent: 'center',
            // `0 2px 5px rgba(62,54,43,.15)`
            shadowColor: '#3E362B', shadowOpacity: 0.15, shadowRadius: 5, shadowOffset: { width: 0, height: 2 }, elevation: 2,
          }}>
            <NbIcon name="speaker" size={30} />
          </Pressable>
        </View>
        {!!w.ipa && <Text style={[nbText.monoBold(11.5, nb.soft), { marginTop: 6, textAlign: 'center' }]}>{w.ipa}</Text>}
        <View style={{ flexDirection: 'row', gap: 6, marginTop: 12 }}>
          {opts.map((o, i) => {
            const on = answer === o;
            const ok = result != null && o === w.ko;
            const bad = result != null && on && !ok;
            return (
              <Pressable key={`${i}-${o}`} testID={id(`recall-opt-${i}`)} disabled={locked} onPress={() => onAnswer(o)} style={{
                flex: 1, paddingVertical: 9, paddingHorizontal: 4, justifyContent: 'center',
                borderWidth: 1.6, borderColor: optionBorder(on, ok, bad), backgroundColor: optionFill(ok, bad),
                transform: [{ rotate: `${i % 2 ? 0.6 : -0.6}deg` }],
              }}>
                <Text style={[nbText.hand(14), { textAlign: 'center', lineHeight: 14 * 1.2 }]}>{o}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    );
  }

  if (card.kind === 'word') {
    // WL L135–152: fragments tapped in order onto a highlighted line; each piece taps out.
    const w = card.word;
    const picked = (answer as string[] | null) ?? [];
    const chips = fragmentPool(w);
    const left = picked.slice();
    const multiword = (w.chips ?? []).length > 1;
    return (
      <View style={{ marginTop: 12 }}>
        <View testID={id('recall-built')} style={{
          minHeight: 42, borderBottomWidth: 2, borderColor: result ? (result === 'wrong' ? nb.red : nb.green) : 'rgba(62,54,43,.5)',
          flexDirection: 'row', alignItems: 'flex-end', flexWrap: 'wrap', gap: 4, paddingHorizontal: 2, paddingBottom: 6,
        }}>
          {picked.length === 0 && <Text style={nbText.hand(15, nb.placeholder)}>{`${w.en[0]}${'_ '.repeat(Math.min(w.en.length - 1, 9))}`}</Text>}
          {picked.map((b, i) => (
            <Pressable key={i} testID={id(`recall-piece-${i}`)} disabled={locked} onPress={() => onAnswer(picked.filter((_, j) => j !== i))}
              style={{ backgroundColor: 'rgba(249,227,123,.55)', paddingHorizontal: 5, paddingVertical: 1 }}>
              <Text style={nbText.monoBold(17, nb.ink)}>{b}</Text>
            </Pressable>
          ))}
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginTop: 12 }}>
          {chips.map((ch, i) => {
            // A fragment that appears twice is used up one copy at a time.
            const k = left.indexOf(ch);
            const used = k >= 0;
            if (used) left.splice(k, 1);
            return (
              <Chip key={`${ch}-${i}`} testID={id(`recall-chip-${ch}`)} used={used} rot={i % 2 ? 1 : -1}
                disabled={locked || used} onPress={() => onAnswer([...picked, ch])}>{ch}</Chip>
            );
          })}
        </View>
        <Text style={[nbText.hand(12.5, nb.soft), { marginTop: 8 }]}>
          {multiword ? `${t('recall.fillHint')} · ${t('recall.fillAutoSpace')}` : t('recall.fillHint')}
        </Text>
      </View>
    );
  }

  const n = card.item;
  if (n.kind === 'slider') return <Slider scale={n.scale ?? []} answerAt={n.answerAt ?? 0} answer={answer as number | null} result={result} locked={locked} inert={inert} onAnswer={onAnswer} />;

  // WL L105–134: tap a left word, then its partner on the right.
  const pairs = n.pairs ?? [];
  const links = ((answer as Record<string, string> | null) ?? {}) as Record<string, string>;
  const selected = links.__left;
  const rights = stableShuffle([...pairs.map((p) => p[1]), ...(n.decoys ?? [])], `${n.words.join(',')}|pair`);
  const colOf = (l: string) => PAIR_COL[pairs.findIndex((p) => p[0] === l)] ?? nb.ink;
  const isOk = (l: string, r: string) => pairs.some((p) => p[0] === l && p[1] === r);
  return (
    <View style={{ marginTop: 14, flexDirection: 'row', gap: 10 }}>
      <View style={{ flex: 1, gap: 8 }}>
        {pairs.map(([l], i) => {
          const r = links[l];
          const on = selected === l;
          const ok = result != null && !!r && isOk(l, r);
          const bad = result != null && !!r && !isOk(l, r);
          const pc = colOf(l);
          const bw = on || r ? 2.2 : 1.6;
          return (
            <Pressable key={l} testID={id(`recall-left-${i}`)} disabled={locked} onPress={() => {
              const next = { ...links };
              if (on) delete next.__left; else next.__left = l;
              onAnswer(next);
            }}>
              <View testID={id(`recall-left-${i}-face`)} style={{
                paddingVertical: 9, paddingHorizontal: 10, borderWidth: bw,
                borderColor: ok ? nb.green : bad ? nb.red : on || r ? pc : faint, backgroundColor: on ? `${pc}14` : nb.paper,
                flexDirection: 'row', alignItems: 'center', gap: 6, transform: [{ rotate: '-0.4deg' }],
              }}>
                {/* `box-shadow: 0 0 0 3px ${pc}33` — a 3pt ring outside the border box. */}
                {on && <View testID={id('recall-left-glow')} pointerEvents="none" style={{ position: 'absolute', left: -bw - 3, top: -bw - 3, right: -bw - 3, bottom: -bw - 3, borderWidth: 3, borderColor: `${pc}33` }} />}
                <Badge color={pc} n={i + 1} />
                <Text style={[nbText.monoBold(12.5, nb.ink), { flexShrink: 1 }]}>{l}</Text>
                <View style={{ flex: 1 }} />
                {!!r && <LinkArrow size={13} color={ok ? nb.green : bad ? nb.red : pc} />}
              </View>
            </Pressable>
          );
        })}
      </View>
      <View style={{ flex: 1, gap: 8 }}>
        {rights.map((r, i) => {
          const usedBy = pairs.map((p) => p[0]).find((l) => links[l] === r);
          const ok = result != null && !!usedBy && isOk(usedBy, r);
          const bad = result != null && !!usedBy && !isOk(usedBy, r);
          const pc = usedBy ? colOf(usedBy) : selected ? colOf(selected) : null;
          return (
            <Pressable key={r} testID={id(`recall-right-${i}`)} disabled={locked || !selected} onPress={() => {
              const next: Record<string, string> = {};
              for (const [k, v] of Object.entries(links)) if (k !== '__left' && v !== r) next[k] = v;
              next[selected!] = r;
              onAnswer(next);
            }}>
              <View testID={id(`recall-right-${i}-face`)} style={{
                paddingVertical: 9, paddingHorizontal: 10, borderWidth: usedBy ? 2.2 : 1.6, borderStyle: usedBy ? 'solid' : 'dashed',
                // While a left word is picked, the free ones preview its colour at 60% (`pc + '99'`).
                borderColor: ok ? nb.green : bad ? nb.red : usedBy ? pc! : selected ? `${pc}99` : 'rgba(62,54,43,.35)',
                backgroundColor: usedBy ? `${pc}14` : 'transparent',
                flexDirection: 'row', alignItems: 'center', gap: 6, transform: [{ rotate: '0.4deg' }],
              }}>
                {!!usedBy && <Badge color={ok ? nb.green : bad ? nb.red : pc!} n={pairs.findIndex((p) => p[0] === usedBy) + 1} />}
                <Text style={[nbText.monoBold(12.5, nb.ink), { flexShrink: 1 }]}>{r}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

/**
 * The collocation link's "→" (WL L121, HW 13 in the pair colour) — drawn, not typed (결정 4,
 * glyphs.test). Drawn here rather than added to NbIcon: an NbIcon name is a content icon too
 * (the content verifiers read the union), and an arrow is not one.
 */
function LinkArrow({ size, color }: { size: number; color: string }) {
  return (
    <View testID="recall-link-arrow">
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path d="M4.5 12 H18.5 M13.5 7 L18.5 12 L13.5 17" stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </Svg>
    </View>
  );
}

function Badge({ color, n }: { color: string; n: number }) {
  return (
    <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: color, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Text style={nbText.hand(11, '#fff')}>{String(n)}</Text>
    </View>
  );
}

/**
 * A fragment chip — WL L147. Unused: paper, a 1.4 ink border, tilted ±1°, and a hard
 * `1px 2px 0 rgba(62,54,43,.2)` shadow. Used: its letters gone, a dashed faint border and a
 * -45° hatch (`repeating-linear-gradient(-45deg, rgba(62,54,43,.1) 0 3px, transparent 3px 6px)`).
 *
 * A plain div in the handoff — no `.nb-press` — so the shadow is drawn still (the strips
 * outside the face, as NbHardShadow does), not through NbPressable's press sink.
 */
function Chip({ used, rot, disabled, onPress, testID, children }: {
  used: boolean; rot: number; disabled: boolean; onPress: () => void; testID?: string; children: string;
}) {
  const [box, setBox] = useState({ w: 0, h: 0 });
  const s = hardShadow.chip;
  return (
    <Pressable testID={testID} disabled={disabled} onPress={onPress}>
      <View onLayout={(e) => setBox({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })} style={{ transform: [{ rotate: `${rot}deg` }] }}>
        {used ? <Hatch testID={testID && 'recall-chip-hatch'} w={box.w} h={box.h} /> : (
          <>
            <View testID={testID && 'recall-chip-shadow'} pointerEvents="none" style={{ position: 'absolute', left: '100%', top: s.dy, bottom: 0, width: s.dx, backgroundColor: s.color }} />
            <View testID={testID && 'recall-chip-shadow'} pointerEvents="none" style={{ position: 'absolute', top: '100%', left: s.dx, right: -s.dx, height: s.dy, backgroundColor: s.color }} />
          </>
        )}
        <View style={{
          paddingVertical: 6, paddingHorizontal: 11, borderWidth: 1.4, borderStyle: used ? 'dashed' : 'solid',
          borderColor: used ? faint : nb.ink, backgroundColor: used ? 'transparent' : nb.paper,
        }}>
          <Text style={nbText.monoBold(13.5, used ? 'transparent' : nb.ink)}>{children}</Text>
        </View>
      </View>
    </Pressable>
  );
}

/** `repeating-linear-gradient(-45deg, c 0 3px, transparent 3px 6px)`: stripes running "/" ,
 *  3 wide every 6, counted from the bottom-right corner (where a -45° gradient starts). */
function Hatch({ w, h, testID }: { w: number; h: number; testID?: string }) {
  const lines: number[] = [];
  for (let k = 0; ; k++) {
    const c = w + h - Math.SQRT2 * (1.5 + 6 * k);
    if (c <= 0) break;
    lines.push(c);
  }
  return (
    <View testID={testID} pointerEvents="none" style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, overflow: 'hidden' }}>
      {w > 0 && (
        <Svg width={w} height={h}>
          {lines.map((c, k) => (
            // the line x + y = c, run past both edges (the Svg clips it)
            <Line key={k} x1={c + h} y1={-h} x2={c - w - h} y2={w + h} stroke="rgba(62,54,43,.1)" strokeWidth={3} />
          ))}
        </Svg>
      )}
    </View>
  );
}

/**
 * The nuance scale — WL L82–104. A 62-tall track: one gradient axis 36 in from each side
 * (`linear-gradient(90deg, #7A9E7E, #C77E2E, #C75146)`, 4 tall, r2, at top 20), the stops at
 * `36 + (w − 72) · x`, each a 72-wide column with its dot and a 96-wide label under it, then the
 * two ends and the one-line guide.
 */
function Slider({ scale, answerAt, answer, result, locked, inert, onAnswer }: {
  scale: string[]; answerAt: number; answer: number | null; result: Result; locked: boolean; inert?: boolean;
  onAnswer: (a: RecallAnswer) => void;
}) {
  const t = useT();
  const [w, setW] = useState(0);
  const n = scale.length;
  return (
    <View style={{ marginTop: 18 }}>
      <View onLayout={(e) => setW(e.nativeEvent.layout.width)} style={{ position: 'relative', height: 62 }}>
        <View testID={inert ? undefined : 'recall-scale-axis'} pointerEvents="none" style={{ position: 'absolute', left: 36, right: 36, top: 20, height: 4, borderRadius: 2, overflow: 'hidden' }}>
          {w > 72 && (
            <Svg width={w - 72} height={4}>
              <Defs>
                <LinearGradient id="recall-axis" x1="0" y1="0" x2="1" y2="0">
                  <Stop offset="0" stopColor="#7A9E7E" />
                  <Stop offset="0.5" stopColor="#C77E2E" />
                  <Stop offset="1" stopColor="#C75146" />
                </LinearGradient>
              </Defs>
              <Rect x={0} y={0} width={w - 72} height={4} fill="url(#recall-axis)" />
            </Svg>
          )}
        </View>
        {scale.map((s, i) => {
          const x = n > 1 ? i / (n - 1) : 0;
          const on = answer === i;
          const ok = result != null && i === answerAt;
          const bad = result != null && on && !ok;
          const tone = ok ? nb.green : bad ? nb.red : on ? nb.ink : null;
          return (
            // `left: calc(36px + (100% - 72px) * x)` with `translateX(-50%)` of a 72-wide column.
            <Pressable key={s} testID={inert ? undefined : `recall-scale-${i}`} disabled={locked} onPress={() => onAnswer(i)}
              style={{ position: 'absolute', top: 0, left: (w - 72) * x, width: 72, alignItems: 'center' }}>
              <SliderDot big={on || ok} border={tone ?? 'rgba(62,54,43,.45)'} fill={tone ?? nb.paper} />
              <Text style={[nbText.monoBold(11.5, tone ?? nb.soft), { marginTop: 6, lineHeight: 11.5 * 1.15, width: 96, textAlign: 'center' }]}>{s}</Text>
            </Pressable>
          );
        })}
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, paddingHorizontal: 4 }}>
        <Text style={nbText.hand(12, nb.soft)}>{t('recall.sliderWeak')}</Text>
        <Text style={nbText.hand(12, nb.soft)}>{t('recall.sliderStrong')}</Text>
      </View>
      <Text style={[nbText.hand(13, nb.soft), { marginTop: 8 }]}>{t('recall.sliderGuide')}</Text>
    </View>
  );
}

/** WL L94: 18 → 26 (margin-top 13 → 9, so the centre stays on the axis at 22), its border and
 *  fill, and a `0 2px 5px rgba(62,54,43,.3)` shadow when big — `transition: all .15s` (ease). */
export const DOT_TRANSITION = { duration: 150, easing: CSS_EASE.ease } as const;

export function SliderDot({ big, border, fill }: { big: boolean; border: string; fill: string }) {
  const rm = useReduceMotion();
  const [v] = useState(() => new Animated.Value(big ? 1 : 0));
  useEffect(() => {
    if (rm) { v.setValue(big ? 1 : 0); return; }
    const a = Animated.timing(v, { toValue: big ? 1 : 0, ...DOT_TRANSITION, useNativeDriver: false });
    a.start();
    return () => a.stop();
  }, [big, rm, v]);
  const bc = useNbColorTransition(border, DOT_TRANSITION);
  const bg = useNbColorTransition(fill, DOT_TRANSITION);
  const size = v.interpolate({ inputRange: [0, 1], outputRange: [18, 26] });
  return (
    <Animated.View testID="recall-scale-dot" style={{
      width: size, height: size, marginTop: v.interpolate({ inputRange: [0, 1], outputRange: [13, 9] }),
      borderRadius: v.interpolate({ inputRange: [0, 1], outputRange: [9, 13] }),
      borderWidth: 2, borderColor: bc, backgroundColor: bg,
      shadowColor: '#3E362B', shadowOffset: { width: 0, height: 2 }, shadowRadius: 5,
      shadowOpacity: v.interpolate({ inputRange: [0, 1], outputRange: [0, 0.3] }),
      ...(Platform.OS === 'android' && big ? { elevation: 3 } : null),
    }} />
  );
}

/** A one-sided dashed rule, drawn (iOS draws a one-sided dashed border solid) — the reveal's
 *  `borderTop: 1.5px dashed rgba(62,54,43,.3)` (WL L177). */
function DashedRule() {
  const w = 1.5;
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: 0, height: w }}>
      <Svg width="100%" height={w}>
        <Line x1="0" x2="100%" y1={w / 2} y2={w / 2} stroke={faint} strokeWidth={w} strokeDasharray={SHEET.dash(w)} />
      </Svg>
    </View>
  );
}

/** An icon sitting in a line of text (the handoff's inline `<span>` glyphs). */
export function InlineIcon({ children, dy = 0, ml = 0 }: { children: ReactNode; dy?: number; ml?: number }) {
  return <View style={{ marginLeft: ml, transform: [{ translateY: dy }] }}>{children}</View>;
}

/** The headline of the reveal: the word, or for a nuance card the whole scale / the left words
 *  (WL L46–47 `w`). */
export function revealHeadline(card: RecallCard): string {
  if (card.kind === 'word') return card.word.en;
  if (card.item.kind === 'slider') return (card.item.scale ?? []).join(' · ');
  return (card.item.pairs ?? []).map((p) => p[0]).join(' · ');
}

/** The reveal that opens under the prompt: the answer, how it sounds, and one example. */
export function RecallReveal({ card, result, answer, inert }: {
  card: RecallCard;
  result: 'right' | 'wrong';
  answer?: RecallAnswer | null;
  inert?: boolean;
}) {
  const t = useT();
  const wrong = result === 'wrong';
  const tone = wrong ? nb.red : nb.green;
  const id = (s: string) => (inert ? undefined : s);
  const headline = revealHeadline(card);
  const ipa = card.kind === 'word' ? card.word.ipa : undefined;
  const why = card.kind === 'nuance' ? card.item.why : undefined;
  const ex = card.kind === 'word' ? card.word.example : card.item.example;
  const exKo = card.kind === 'word' ? card.word.exKo : card.item.exKo;
  const mine = wrong && card.kind === 'word' && card.type === 'fill' && Array.isArray(answer) && answer.length > 0 ? answer.join(' ') : null;
  return (
    <NbEnter kind="reveal" testID={id('recall-reveal')} style={{ marginTop: 14, paddingTop: 12, position: 'relative' }}>
      <DashedRule />
      {/* nb-ok on the wrapper (-20° → -10°) over the stamp's own -10°: lands at -20° (WL L178–179). */}
      <NbEnter kind="ok" testID={id('recall-stamp-enter')} style={{ position: 'absolute', right: 0, top: 6, zIndex: 2 }}>
        <View testID={id(wrong ? 'recall-stamp-retry' : 'recall-stamp-good')} style={{
          width: 56, height: 56, borderRadius: 28, borderWidth: 1, borderColor: tone,
          alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-10deg' }], backgroundColor: nb.paper,
        }}>
          <NbDoubleRing color={tone} radius={28} />
          <Text style={{ fontFamily: nbFonts.bodyBold, fontSize: 7.5, letterSpacing: 1, color: tone }}>{wrong ? 'RETRY' : 'GOOD'}</Text>
          <Text style={[nbText.hand(15, tone), { lineHeight: 15 }]}>{wrong ? t('recall.retry') : t('recall.good')}</Text>
        </View>
      </NbEnter>
      <View style={{ paddingRight: 64 }}>
        <Pressable disabled={!!inert} onPress={() => speak(headline.split(' · ').join(', '))}>
          <Text style={[nbText.monoBold(19, nb.ink), { lineHeight: 19 * 1.15 }]}>
            {`${headline} `}
            <InlineIcon ml={4} dy={2}><NbIcon name="speaker" size={15} /></InlineIcon>
          </Text>
        </Pressable>
        {!!ipa && <Text style={[nbText.monoBold(11, nb.soft), { marginTop: 3 }]}>{ipa}</Text>}
      </View>
      {!!why && (
        <View style={{ marginTop: 8, paddingVertical: 6, paddingHorizontal: 9, borderWidth: 1.3, borderStyle: 'dashed', borderColor: nb.blue, backgroundColor: 'rgba(74,111,165,.05)' }}>
          <Text style={[nbText.hand(13.5), { lineHeight: 13.5 * 1.45 }]}>
            <Text style={{ color: nb.blue, fontFamily: nbFonts.handBold }}>{t('recall.nuance')}</Text>{` ${why}`}
          </Text>
        </View>
      )}
      {!!ex && (
        <View style={{ marginTop: 9, paddingVertical: 8, paddingHorizontal: 10, borderLeftWidth: 2.5, borderColor: nb.blue, backgroundColor: 'rgba(74,111,165,.06)' }}>
          <Text style={{ fontFamily: nbFonts.bodyMid, fontSize: 13, color: nb.ink, lineHeight: 13 * 1.5 }}>{ex}</Text>
          {!!exKo && <Text style={[nbText.hand(13, nb.soft), { marginTop: 2 }]}>{exKo}</Text>}
        </View>
      )}
      {mine != null && (
        <Text testID={id('recall-my-answer')} style={[nbText.hand(13, nb.red), { marginTop: 7 }]}>
          {`${t('recall.myAnswer')}: `}
          <Text style={{ textDecorationLine: 'line-through' }}>{mine}</Text>
        </Text>
      )}
    </NbEnter>
  );
}
