// STEP 2 문장장의 낱장 하나 — 정본(R1) design-handoff_v46/reference/forin-notebook-lesson-sent-live.jsx (SL).
//
//   SL:116-122  머리 — 앰버 원 58(-4°, 문장 아이콘) + 형광펜 한국어 뜻 18.5 · ✎ 단서 13.5.
//               listen이면 같은 원이 파란 스피커 버튼(누르면 재생), 머리는 "이 문장의 뜻은?" 21.
//   SL:26-44    listen — 파형 18막대 + "탭해서 다시 듣기 · 2회"(실제로 두 번, 결정 9) · A/B/C 원 선택지 3
//   SL:46-62    build  — 형광 조립 줄(아래 2px, 결과색) · 빈 상태 "첫단어 _ _ _ _ _" · 조각마다 빼기 ·
//               흰 종이 칩(하드 그림자) · 쓴 칩은 빗금 + 점선
//   SL:64-81    blank  — 폭 110 빈칸(아래 2.5px 파랑 → 결과색, 틀리면 정답을 빨강으로) · 2×2 아이콘 카드
//   SL:82-103   order  — 번호 원 26 · 점선→실선 줄 상자 · 줄 아이콘 17 · 다시 누르면 그 번호 취소 · 결과색
//   SL:124-142  해설   — 점선 구분 · GOOD/RETRY 이중선 도장(nb-ok, -10°) · 정답 문장 + 스피커 · 뜻 ·
//               "왜?" 파란 좌측 바 · 노란 "따라 말하기" 필
//   SL:215-226  DONE 장 — 파란 이중선 도장 96 · 바로 맞힘/틀림 집계 · 안내
//   SL:239-256  판정 버튼 — 아직 헷갈려요(앰버, 왼쪽 뜯김) / 외웠어요·이제 알겠어요(초록, 오른쪽 뜯김)
//
// 글리프(✎ ✓ ✕)는 NbIcon으로 그린다(결정 4). 문구는 화면이 넘긴 번역(i18n)이다.
import { useEffect, useRef } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { NbIcon } from '@/components/nb/NbIcon';
import { NbInline } from '@/components/nb/NbInline';
import { NbDoubleRing, NbMark, NbPaper, nbText } from '@/components/nb/NbUI';
import { NbEnter, useReduceMotion } from '@/components/nb/nbMotion';
import { SheetIconCircle } from '@/components/lesson/SheetStack';
import { BAD_BG, ChipShadow, DashRule, FAINT, Hatch, OK_BG, Step2Stamp } from '@/components/lesson/SentParts';
import { sheetKo, sheetLine, sheetWhy, type SheetAnswer, type SheetCard } from '@/data/sentenceDrill';
import { useT } from '@/i18n';
import { usePronunciationEnabled } from '@/data/pronunciationFlag';
import { nb, nbFonts } from '@/theme/nb';

type Result = 'right' | 'wrong' | null;

/** SL:29 — the waveform's bar heights. The handoff paints the first 11 blue as if 61% played; the bars are one
 *  colour here — the motion shows the voice, a fixed half-way mark looked stuck (사용자 결정 2026-10-09). */
export const WAVE = [6, 12, 18, 24, 14, 20, 10, 22, 16, 8, 18, 12, 6, 16, 10, 20, 12, 8];
/** 결정 9: "다시 듣기 · 2회" is a real limit — the first listen, then two more. */
export const REPLAYS = 2;

const ABC = ['A', 'B', 'C', 'D'];

/** What the voice is doing while a sheet's sentence is read out (expo-speech callbacks). */
export type Voice = { speaking: boolean; beat: number };
const SILENT: Voice = { speaking: false, beat: 0 };

/** The prompt half of a sheet: its head and the answer widget. */
export function SentSheetBody({ card, icon, answer, onAnswer, result, plays, onPlay, interactive, voice = SILENT }: {
  card: SheetCard;
  /** The amber circle's icon (R3: the sentence's, else the department's). */
  icon: string;
  answer: SheetAnswer | null;
  onAnswer: (a: SheetAnswer) => void;
  result: Result;
  /** listen: how many times it has been played on this sheet. */
  plays: number;
  onPlay: () => void;
  /** false on the dim sheet underneath and the torn copy. */
  interactive: boolean;
  /** listen: the waveform moves while the sentence is spoken. */
  voice?: Voice;
}) {
  const t = useT();
  const listen = card.kind === 'sentence' && card.type === 'listen';
  const locked = !interactive || result != null;
  const canPlay = interactive && plays <= REPLAYS;
  return (
    <>
      <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center', marginTop: 14 }}>
        <SheetIconCircle icon={icon} tone={listen ? 'listen' : 'amber'} onPress={canPlay ? onPlay : undefined} accessibilityLabel={t('sent.listenClue')} />
        <View style={{ minWidth: 0, flexShrink: 1 }}>
          <NbMark textStyle={listen ? [nbText.hand(21), { lineHeight: 26.25 }] : [nbText.hand(18.5), { lineHeight: 23.1 }]}>
            {listen ? t('sent.listenHead') : sheetKo(card)}
          </NbMark>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 4, marginTop: 4 }}>
            <View style={{ marginTop: 2 }}><NbIcon name="pencil" size={13} color={nb.soft} /></View>
            <Text style={[nbText.hand(13.5, nb.soft), { lineHeight: 18.2, flexShrink: 1 }]}>{listen ? t('sent.listenClue') : t('sent.makeClue')}</Text>
          </View>
        </View>
      </View>
      {card.kind === 'order'
        ? <OrderPrompt card={card} seq={(answer as number[] | null) ?? []} onAnswer={onAnswer} result={result} locked={locked} />
        : card.type === 'listen'
          ? <ListenPrompt card={card} answer={answer as string | null} onAnswer={onAnswer} result={result} locked={locked} plays={plays} onPlay={canPlay ? onPlay : undefined} voice={voice} />
          : card.type === 'build'
            ? <BuildPrompt card={card} built={(answer as number[] | null) ?? []} onAnswer={onAnswer} result={result} locked={locked} />
            : <BlankPrompt card={card} answer={answer as string | null} onAnswer={onAnswer} result={result} locked={locked} />}
    </>
  );
}

const statusColor = (ok: boolean, bad: boolean, on: boolean, idle = FAINT) => (ok ? nb.green : bad ? nb.red : on ? nb.ink : idle);
const statusBg = (ok: boolean, bad: boolean, on: boolean, idle: string = nb.paper) => (ok ? OK_BG : bad ? BAD_BG : on ? nb.paper : idle);

// 파형 — 핸드오프(SL:29)는 높이가 고정된 막대 18개. 사용자 결정(2026-10-09): 소리가 나는 동안 움직인다. 소리는 기기 TTS라
// 음량을 읽을 수 없어서, 말하는 동안 막대가 출렁이고 iOS가 알려 주는 단어 경계(onBoundary)마다 크게 튄다. 끝나면 원래 높이로.
// 높이는 scaleY로(네이티브 드라이버) — 막대 상자는 24, 정지 높이 h는 h/24 배율이다. 색은 파랑 하나(진행도처럼 보이던 회색 7개를 없앰).
const WAVE_BOX = 24;
export function Wave({ voice }: { voice: Voice }) {
  const reduce = useReduceMotion();
  const vals = useRef(WAVE.map((h) => new Animated.Value(h / WAVE_BOX))).current;
  useEffect(() => {
    const to = (heights: number[], ms: number) =>
      Animated.parallel(vals.map((v, i) => Animated.timing(v, { toValue: heights[i] / WAVE_BOX, duration: ms, useNativeDriver: true }))).start();
    if (!voice.speaking || reduce) {
      to(WAVE, 180);
      return undefined;
    }
    const kick = (big: boolean) => to(WAVE.map(() => 4 + Math.random() * (big ? 20 : 12)), big ? 90 : 140);
    kick(true);
    const id = setInterval(() => kick(false), 140);
    return () => clearInterval(id);
  }, [voice.speaking, voice.beat, reduce, vals]);
  return (
    <>
      {WAVE.map((h, i) => (
        <Animated.View key={i} testID="sent-wave-bar" style={{
          width: 4, height: WAVE_BOX, borderRadius: 2, backgroundColor: nb.blue,
          transform: [{ scaleY: vals[i] }],
        }} />
      ))}
    </>
  );
}

function ListenPrompt({ card, answer, onAnswer, result, locked, plays, onPlay, voice }: {
  card: Extract<SheetCard, { type: 'listen' }>; answer: string | null; onAnswer: (a: string) => void; result: Result; locked: boolean;
  plays: number; onPlay?: () => void; voice: Voice;
}) {
  const t = useT();
  const left = Math.max(0, REPLAYS - Math.max(0, plays - 1));
  return (
    <View style={{ marginTop: 12 }}>
      <Pressable testID="sent-replay" onPress={onPlay} disabled={!onPlay} style={{ flexDirection: 'row', alignItems: 'center', gap: 3, height: 26, paddingHorizontal: 6 }}>
        <Wave voice={voice} />
        <View style={{ flex: 1 }} />
        <Text testID="sent-replay-left" numberOfLines={1} style={[nbText.hand(12, nb.soft), { flexShrink: 0 }]}>{t('sent.replay', { n: left })}</Text>
      </Pressable>
      <View style={{ marginTop: 12 }}>
        {card.options.map((o, i) => {
          const on = answer === o;
          const ok = !!result && o === card.sentence.ko;
          const bad = !!result && on && !ok;
          return (
            <Pressable key={`${i}-${o}`} testID={`sent-opt-${i}`} disabled={locked} onPress={() => onAnswer(o)}
              accessibilityRole="button" accessibilityState={{ selected: on }}
              style={{
                marginTop: i ? 8 : 0, paddingVertical: 10, paddingHorizontal: 12, borderWidth: 1.6,
                borderColor: statusColor(ok, bad, on), backgroundColor: statusBg(ok, bad, on),
                flexDirection: 'row', alignItems: 'center', gap: 8, transform: [{ rotate: `${i % 2 ? 0.4 : -0.4}deg` }],
              }}>
              <View testID="sent-opt-abc" style={{
                width: 18, height: 18, borderRadius: 9, borderWidth: 1.5, borderColor: ok ? nb.green : bad ? nb.red : nb.soft,
                alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                {ok ? <NbIcon name="check" size={11} color={nb.green} />
                  : bad ? <NbIcon name="cross" size={9} color={nb.red} />
                    : <Text style={[nbText.hand(12, nb.soft), { lineHeight: 14 }]}>{ABC[i]}</Text>}
              </View>
              <Text style={[nbText.hand(15.5), { lineHeight: 19.4, flex: 1 }]}>{o}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function BuildPrompt({ card, built, onAnswer, result, locked }: {
  card: Extract<SheetCard, { type: 'build' }>; built: number[]; onAnswer: (a: number[]) => void; result: Result; locked: boolean;
}) {
  const t = useT();
  const line = result ? (result === 'wrong' ? nb.red : nb.green) : 'rgba(62,54,43,.5)';
  return (
    <View style={{ marginTop: 12 }}>
      <View testID="sent-build-line" style={{
        minHeight: 42, borderBottomWidth: 2, borderColor: line, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-end',
        gap: 4, paddingHorizontal: 2, paddingBottom: 6,
      }}>
        {built.length === 0 && (
          <Text testID="sent-build-empty" style={{ fontFamily: nbFonts.hand, fontSize: 15, color: '#B4A88F' }}>{`${card.sentence.en.split(' ')[0]} _ _ _ _ _`}</Text>
        )}
        {built.map((pi, i) => (
          <Pressable key={`${i}-${pi}`} testID={`sent-built-${i}`} disabled={locked} onPress={() => onAnswer(built.filter((_, j) => j !== i))}
            style={{ backgroundColor: 'rgba(249,227,123,.55)', paddingVertical: 1, paddingHorizontal: 5 }}>
            <Text style={{ fontFamily: nbFonts.monoBold, fontSize: 15, color: nb.ink }}>{card.pool[pi]}</Text>
          </Pressable>
        ))}
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginTop: 12 }}>
        {card.pool.map((p, i) => {
          const used = built.includes(i);
          return (
            <Pressable key={`${i}-${p}`} testID={`sent-chunk-${i}`} disabled={locked || used} onPress={() => onAnswer([...built, i])}
              accessibilityState={{ disabled: used }}
              style={{ transform: [{ rotate: `${i % 2 ? 1 : -1}deg` }] }}>
              {!used && <ChipShadow />}
              <View style={{
                backgroundColor: used ? 'transparent' : nb.paper, borderWidth: 1.4, borderStyle: used ? 'dashed' : 'solid',
                borderColor: used ? FAINT : nb.ink, paddingVertical: 6, paddingHorizontal: 11,
              }}>
                {used && <Hatch />}
                <Text style={{ fontFamily: nbFonts.monoBold, fontSize: 13.5, color: used ? 'transparent' : nb.ink }}>{p}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>
      <Text style={[nbText.hand(12.5, nb.soft), { marginTop: 8 }]}>{t('sent.buildHint')}</Text>
    </View>
  );
}

function BlankPrompt({ card, answer, onAnswer, result, locked }: {
  card: Extract<SheetCard, { type: 'blank' }>; answer: string | null; onAnswer: (a: string) => void; result: Result; locked: boolean;
}) {
  const wrong = result === 'wrong';
  const tone = result ? (wrong ? nb.red : nb.green) : nb.blue;
  const shown = result && wrong ? card.answer : answer;
  const ts = { fontFamily: nbFonts.bodyBold, fontSize: 17, color: nb.ink, lineHeight: 32.3 };
  // SL:67: inline-block, at least 110 wide, a 2.5 underline, centred; "?" in hand 19 until picked, then MONO 16.
  const slot = (
    <View testID="sent-blank-slot" style={{ minWidth: 110, borderBottomWidth: 2.5, borderColor: tone, paddingHorizontal: 6, alignItems: 'center', justifyContent: 'flex-end', height: 27 }}>
      <Text testID="sent-blank-text" style={shown ? { fontFamily: nbFonts.monoBold, fontSize: 16, color: tone } : { fontFamily: nbFonts.hand, fontSize: 19, color: tone, lineHeight: 22 }}>
        {shown ?? '?'}
      </Text>
    </View>
  );
  return (
    <View style={{ marginTop: 12 }}>
      <NbInline testID="sent-blank-line" textStyle={ts} parts={[
        ...(card.before ? [{ text: card.before }] : []),
        { node: slot, key: 'slot' },
        ...(card.after ? [{ text: card.after }] : []),
      ]} />
      {/* 핸드오프는 선택지마다 아이콘을 얹은 2×2 카드(SL:69-77)지만, 문장이 있는데 아이콘은 군더더기이고 낱말에 맞는 아이콘도
          드물다 — 사용자 결정(T8, §7)으로 STEP 1 고르기(WL:56-67)와 같은 세로 줄: A–D 고리 · mono 14 · ±.4° · 결과 ✓/✕. */}
      <View style={{ marginTop: 12 }}>
        {card.options.map((o, i) => {
          const on = answer === o.en;
          const ok = !!result && o.en === card.answer;
          const bad = !!result && on && !ok;
          return (
            <Pressable key={o.en} testID={`sent-opt-${i}`} disabled={locked} onPress={() => onAnswer(o.en)}
              accessibilityRole="button" accessibilityState={{ selected: on }}
              style={{
                marginTop: i ? 8 : 0, paddingVertical: 10, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 8,
                borderWidth: 1.6, borderColor: statusColor(ok, bad, on), backgroundColor: statusBg(ok, bad, on),
                transform: [{ rotate: `${i % 2 ? 0.4 : -0.4}deg` }],
              }}>
              <View style={{ width: 18, height: 18, borderRadius: 9, borderWidth: 1.5, borderColor: ok ? nb.green : bad ? nb.red : nb.soft, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {ok ? <NbIcon name="check" size={12} color={nb.green} /> : bad ? <NbIcon name="cross" size={11} color={nb.red} />
                  : <Text style={nbText.hand(12, nb.soft)}>{String.fromCharCode(65 + i)}</Text>}
              </View>
              <Text style={[nbText.monoBold(14, nb.ink), { flexShrink: 1 }]}>{o.en}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function OrderPrompt({ card, seq, onAnswer, result, locked }: {
  card: Extract<SheetCard, { kind: 'order' }>; seq: number[]; onAnswer: (a: number[]) => void; result: Result; locked: boolean;
}) {
  const t = useT();
  return (
    <View style={{ marginTop: 12 }}>
      <Text style={nbText.hand(13, nb.soft)}>{t('sent.orderHint')}</Text>
      {card.shuffled.map((li, i) => {
        const l = card.order.lines[li];
        const pos = seq.indexOf(li);
        const picked = pos >= 0;
        const ok = !!result && picked && pos === li;
        const bad = !!result && picked && pos !== li;
        const line = statusColor(ok, bad, picked, 'rgba(62,54,43,.35)');
        return (
          <Pressable key={li} testID={`sent-order-${i}`} disabled={locked}
            onPress={() => onAnswer(picked ? seq.filter((x) => x !== li) : [...seq, li])}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 9, marginTop: 8 }}>
            <View testID="sent-order-num" style={{
              width: 26, height: 26, borderRadius: 13, borderWidth: 1.8, borderColor: line,
              backgroundColor: picked ? statusBg(ok, bad, true) : 'transparent', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Text style={[nbText.hand(14, ok ? nb.green : bad ? nb.red : picked ? nb.ink : nb.soft), { lineHeight: 17 }]}>{picked ? String(pos + 1) : '?'}</Text>
            </View>
            <View style={{
              flex: 1, paddingVertical: 8, paddingHorizontal: 10, borderWidth: 1.5, borderStyle: picked ? 'solid' : 'dashed', borderColor: line,
              backgroundColor: picked ? nb.paper : 'transparent', flexDirection: 'row', alignItems: 'center', gap: 8,
              transform: [{ rotate: `${i % 2 ? 0.4 : -0.4}deg` }],
            }}>
              <NbIcon name={l.icon} size={17} />
              <Text style={{ fontFamily: nbFonts.bodyMid, fontSize: 12.5, lineHeight: 16.9, color: picked ? nb.ink : nb.soft, flex: 1, minWidth: 0 }}>{l.en}</Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

/** SL:124-142 — the explanation under the prompt, on the same sheet. */
export function SentReveal({ card, result, onSay, onRepeat }: {
  card: SheetCard; result: 'right' | 'wrong'; onSay: () => void; onRepeat: () => void;
}) {
  const t = useT();
  const pronOn = usePronunciationEnabled();
  const wrong = result === 'wrong';
  const why = sheetWhy(card);
  const speaker = (
    <Pressable testID="sent-say" onPress={onSay} hitSlop={8} style={{ marginLeft: 2, marginTop: 2 }}>
      <NbIcon name="speaker" size={15} />
    </Pressable>
  );
  return (
    <NbEnter kind="reveal" testID="sent-reveal" style={{ marginTop: 14, paddingTop: 12, position: 'relative' }}>
      <DashRule />
      <Step2Stamp ok={!wrong} good={t('recall.good')} retry={t('recall.retry')} tilt={-10} style={{ position: 'absolute', right: 0, top: 6, zIndex: 2 }} />
      <View style={{ paddingRight: 64 }}>
        <NbInline testID="sent-reveal-line" textStyle={{ fontFamily: nbFonts.bodyBold, fontSize: 15, color: nb.ink, lineHeight: 22.5 }}
          parts={[{ text: `${sheetLine(card)} ` }, { node: speaker, key: 'say' }]} />
        <Text style={[nbText.hand(13.5, nb.soft), { marginTop: 3 }]}>{sheetKo(card)}</Text>
      </View>
      {!!why && (
        <View testID="sent-why" style={{ marginTop: 9, paddingVertical: 8, paddingHorizontal: 10, borderLeftWidth: 2.5, borderColor: nb.blue, backgroundColor: 'rgba(74,111,165,.06)' }}>
          <Text style={[nbText.hand(13.5), { lineHeight: 19.6 }]}>
            <Text style={{ fontFamily: nbFonts.handBold, color: nb.blue }}>{t('sent.why')}</Text>
            {' '}{why}
          </Text>
        </View>
      )}
      {pronOn && (
        <View style={{ marginTop: 10, alignItems: 'center' }}>
          <Pressable testID="sent-repeat" onPress={onRepeat} accessibilityRole="button" style={{
            flexDirection: 'row', alignItems: 'center', gap: 7, paddingVertical: 7, paddingHorizontal: 16,
            borderWidth: 1.6, borderColor: nb.ink, borderRadius: 99, backgroundColor: 'rgba(249,227,123,.45)',
          }}>
            <NbIcon name="mic" size={17} />
            <Text style={nbText.hand(14.5)}>{t('sent.repeat')}</Text>
          </Pressable>
        </View>
      )}
    </NbEnter>
  );
}

/** SL:239-256 — the two ways off a checked sheet. Left tears it off leftwards and files it; right, rightwards. */
export function JudgeButtons({ result, onFuzzy, onKnown }: { result: 'right' | 'wrong'; onFuzzy: () => void; onKnown: () => void }) {
  const t = useT();
  const btns = [
    { id: 'sent-fuzzy', col: nb.amber, icon: 'bulb', label: t('sent.fuzzy'), sub: t('sent.fuzzySub'), rot: -0.8, on: onFuzzy },
    { id: 'sent-known', col: nb.green, icon: 'check', label: result === 'right' ? t('sent.known') : t('sent.knownAfterWrong'), sub: t('sent.knownSub'), rot: 0.8, on: onKnown },
  ];
  return (
    <View style={{ flexDirection: 'row', gap: 12 }}>
      {btns.map((b) => (
        <Pressable key={b.id} testID={b.id} onPress={b.on} accessibilityRole="button" style={{ flex: 1 }}>
          <NbPaper rot={b.rot} style={{
            paddingVertical: 11, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', gap: 10,
            borderWidth: 1.8, borderColor: b.col, backgroundColor: `${b.col}14`,
          }}>
            <NbIcon name={b.icon} size={30} />
            <View style={{ minWidth: 0, flexShrink: 1 }}>
              <Text numberOfLines={1} style={[nbText.hand(17, b.col), { lineHeight: 17 }]}>{b.label}</Text>
              <Text numberOfLines={1} style={[nbText.body(10.5, nb.soft), { marginTop: 4, lineHeight: 13 }]}>{b.sub}</Text>
            </View>
          </NbPaper>
        </Pressable>
      ))}
    </View>
  );
}

/** SL:216-226 — the last sheet: the blue DONE stamp and the tally. */
export function SentDoneSheet({ known, fuzzy }: { known: number; fuzzy: number }) {
  const t = useT();
  return (
    <View testID="sent-done-sheet" style={{ alignItems: 'center', alignSelf: 'stretch' }}>
      <View style={{ width: 96, height: 96, borderRadius: 48, borderWidth: 1, borderColor: nb.blue, transform: [{ rotate: '-10deg' }], alignItems: 'center' }}>
        <NbDoubleRing color={nb.blue} radius={48} />
        <Text style={{ fontFamily: nbFonts.bodyBold, fontSize: 9, letterSpacing: 2, color: nb.blue, marginTop: 26 }}>DONE</Text>
        <Text numberOfLines={1} style={[nbText.hand(22, nb.blue), { lineHeight: 22 }]}>{t('sent.done')}</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 12, marginTop: 18 }}>
        <View style={{ alignItems: 'center' }}>
          <Text testID="sent-done-right" style={nbText.hand(24, nb.green)}>{String(known)}</Text>
          <Text style={nbText.body(10.5, nb.soft)}>{t('sent.right')}</Text>
        </View>
        <View style={{ width: 1, backgroundColor: 'rgba(62,54,43,.2)' }} />
        <View style={{ alignItems: 'center' }}>
          <Text testID="sent-done-wrong" style={nbText.hand(24, nb.red)}>{String(fuzzy)}</Text>
          <Text style={nbText.body(10.5, nb.soft)}>{t('sent.wrong')}</Text>
        </View>
      </View>
      <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center', gap: 4, justifyContent: 'center' }}>
        <Text style={[nbText.hand(13.5, nb.soft), { textAlign: 'center', flexShrink: 1 }]}>{t('sent.doneNote')}</Text>
        <NbIcon name="pencil" size={13} color={nb.soft} />
      </View>
    </View>
  );
}
