// STEP 1 단어 — 회상형 단어장 (lesson-four-steps-v44 §11, H'), drawn 1:1 to handoff v46.
//
// 정본(R1): design-handoff_v46/reference/forin-notebook-lesson-words-live.jsx (WL) WordStudyLive
//   L259–271  page: ruled 28 · header (‹ 나가기 · green STEP 1 tag) · progress (±.7°, colour .3s) · headline
//   L273–305  the binder (SheetStack) at left/right 24 · top 172 · bottom 182
//   L307–335  the buttons: check / judge (handoff bottom 98 → 34, 사용자 결정), "STEP 2 · 문장 학습으로 ›" at 34 once done
// Audit: lesson-fidelity-v46/audit/audit-step1-words.md (every row). Build Spec §3: no StepTrack on a
// STEP screen (결정 1); glyphs are NbIcons (결정 4).
//
// Not "look and memorise" but recall: the front shows the meaning and a clue, the learner
// answers (pick the English · build it from fragments · listen and pick the meaning — rotated,
// not authored: 결정 8), checks, and the explanation opens under the prompt on the same sheet.
// Then the sheet is torn off: `아직 헷갈려요` to the left (files the word into the review notes)
// or `외웠어요` to the right, and the next one rises. The situation's STEP 1 nuance cards (scale,
// collocations) follow the words. The last card shows the tally; the CTA records STEP 1 with the
// words missed — STEP 2 brings their sentences back first — and goes on to STEP 2.
import { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Pressable, Text, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { RecallPrompt, RecallReveal, InlineIcon } from '@/components/lesson/RecallPrompt';
import { LessonSheet, SHEET, SheetIconCircle, SheetStack, type SheetMode, type SheetStackHandle } from '@/components/lesson/SheetStack';
import { MarkedText, parseMarked, type MarkPart } from '@/components/lesson/MarkedText';
import { NbIcon, type NbIconName } from '@/components/nb/NbIcon';
import { NbButton, NbDoubleRing, NbMark, NbPaper, NbSheet, NbTag, nbText } from '@/components/nb/NbUI';
import { useNbColorTransition } from '@/components/nb/nbMotion';
import { api, type LessonDetail } from '@/api/client';
import { buildDeck, cardWordIds, hasAnswer, isRight, type RecallAnswer, type RecallCard } from '@/data/recall';
import { TOP_INSET, nb, nbFonts } from '@/theme/nb';
import { useT } from '@/i18n';
import { TASK_SCREEN } from '@/theme/transitions';

type Outcome = 'right' | 'wrong';

/** The handoff frame's fake status bar (WL L260). Its 172 / 182 are measured from a frame with
 *  a 44 status bar; the app's notebook screens start at TOP_INSET instead. */
const HANDOFF_STATUS = 44;
const AREA_TOP = TOP_INSET - HANDOFF_STATUS + SHEET.area.top;
/** WL L308 · L333 */
// 핸드오프는 확인/판정 버튼을 bottom 98에, "STEP 2 · 문장 학습으로 ›"를 34에 늘(진행 중엔 점선 .5) 둔다. 사용자 결정
// (2026-10-09): 문장장과 같게 다음 단계 버튼은 다 끝났을 때만 보이고, 확인/판정 버튼은 맨 아래(34)로 내린다.
// 묶음 아래 끝도 같이 내린다(핸드오프 182 = 98 + 버튼 52 + 32 → 34 + 52 + 32 = 118).
const ACTIONS_BOTTOM = 34;
const STEP2_BOTTOM = 34;
const AREA_BOTTOM = ACTIONS_BOTTOM + 84;

/** One progress segment — WL L268: 5 tall, r2, tilted ±.7°, `transition: background .3s`. */
function Segment({ k, color }: { k: number; color: string }) {
  const bg = useNbColorTransition(color);
  return (
    <Animated.View testID="recall-segment" style={{ flex: 1, height: 5, borderRadius: 2, backgroundColor: bg, transform: [{ rotate: `${k % 2 ? 0.7 : -0.7}deg` }] }} />
  );
}

export default function LessonWordsRoute() {
  const t = useT();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState<RecallAnswer | null>(null);
  const [result, setResult] = useState<Outcome | null>(null);
  const [outcomes, setOutcomes] = useState<Outcome[]>([]);
  const [headBottom, setHeadBottom] = useState(0);
  // Words not yet solid: answered wrong, or marked 아직 헷갈려요. STEP 2 brings them back.
  const missed = useRef(new Set<string>());
  // A guard, not state — disabled buttons draw at 45% and read as blinking (H fix).
  const finishing = useRef(false);
  const stack = useRef<SheetStackHandle>(null);

  useEffect(() => {
    let alive = true;
    api.lesson(id).then((l) => { if (alive) setLesson(l); }).catch(() => {});
    return () => { alive = false; };
  }, [id]);

  const deck = useMemo<RecallCard[]>(() => (lesson ? buildDeck(lesson.words, lesson.nuance ?? []) : []), [lesson]);
  const done = deck.length > 0 && idx >= deck.length;
  const card = deck[idx];

  const check = () => {
    if (!card || result || !hasAnswer(card, answer) || stack.current?.isTearing()) return;
    const r: Outcome = isRight(card, answer) ? 'right' : 'wrong';
    if (r === 'wrong') {
      cardWordIds(card).forEach((w) => missed.current.add(w));
      stack.current?.shake();
    }
    setResult(r);
  };

  // WL L251–255: the judge buttons tear the sheet off — left for 헷갈려요, right for 외웠어요 —
  // and only when it is gone does the deck move on (the tally colours in, the next sheet rises).
  // The torn copy keeps this sheet's answer and explanation, so they are cleared then, not now.
  const judge = (fuzzy: boolean) => {
    if (!card || !result || stack.current?.isTearing()) return;
    if (fuzzy) {
      cardWordIds(card).forEach((w) => missed.current.add(w));
      // Filed in the background: the next card must not wait on the review notes.
      if (card.kind === 'word') void api.confusedWord(id, card.word.id).catch(() => {});
    }
    stack.current?.tear(fuzzy ? 'left' : 'right');
  };
  const advance = () => {
    if (result) setOutcomes((o) => [...o, result]);
    setIdx((n) => n + 1);
    setAnswer(null);
    setResult(null);
  };

  // Only on success: a failed save would otherwise drop the missed words (STEP 2 would
  // lose its review sentences) and leave STEP 1 undone on the hub, with nothing said.
  const [saveFailed, setSaveFailed] = useState(false);
  const finish = async () => {
    if (finishing.current) return;
    finishing.current = true;
    setSaveFailed(false);
    try {
      await api.clearLessonStep(id, 'words', [...missed.current]);
      router.replace(`/scenario/${id}/sentences`);
    } catch {
      setSaveFailed(true);
    } finally {
      finishing.current = false;
    }
  };

  const right = outcomes.filter((o) => o === 'right').length;
  const wrong = outcomes.length - right;

  // WL L270: the words headline (situation — 뜻을 보고 [영어를 떠올려]보세요) on the words and on the
  // last card; the nuance one while a nuance card is up.
  const headline: MarkPart[] = card?.kind === 'nuance' && !done
    ? parseMarked(t('recall.headNuance'))
    : [{ text: `${lesson?.situation.title ?? ''} — ` }, ...parseMarked(t('recall.headWords'))];

  const renderSheet = (k: number, mode: SheetMode) => {
    const c = deck[k];
    const cur = mode === 'current';
    // The sheet underneath is fresh; the torn copy keeps what was answered (WL L288).
    const a = mode === 'next' ? null : answer;
    const r = mode === 'next' ? null : result;
    const tag = c.kind === 'word' ? c.word.tag || lesson!.situation.title : t(`recall.tag.${c.item.kind}`);
    const label = t(`recall.type.${c.kind === 'word' ? c.type : c.item.kind}`);
    const icon: NbIconName | string = c.kind === 'word' ? c.word.icon ?? 'pencil' : c.item.icon ?? (c.item.kind === 'pair' ? 'handshake2' : 'chartup');
    const title = c.kind === 'word'
      ? (c.type === 'listen' ? t('recall.listenAsk') : c.word.ko)
      : c.item.ko || (c.item.kind === 'slider' ? t('recall.sliderAsk') : t('recall.pairAsk'));
    const cue = c.kind === 'word' ? c.word.cue : c.item.cue;
    return (
      <LessonSheet testID={cur ? 'recall-sheet' : undefined} dim={mode === 'next'} tag={tag} typeLabel={r ? `${label} · ${t('recall.reveal')}` : label} n={k + 1} total={deck.length}>
        {/* WL L167–173 */}
        <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center', marginTop: 14 }}>
          <SheetIconCircle icon={icon} />
          <View style={{ minWidth: 0, flexShrink: 1 }}>
            <NbMark textStyle={[nbText.hand(23), { lineHeight: 23 * 1.15 }]}>{title}</NbMark>
            {!!cue && (
              <Text style={[nbText.hand(13.5, nb.soft), { marginTop: 4, lineHeight: 13.5 * 1.35 }]}>
                {/* "✎ " — drawn (결정 4) */}
                <InlineIcon dy={2}><NbIcon name="pencil" size={13} color={nb.soft} /></InlineIcon>
                {` ${cue}`}
              </Text>
            )}
          </View>
        </View>
        <RecallPrompt card={c} pool={lesson!.words} answer={a} onAnswer={setAnswer} result={r} inert={!cur} />
        {!!r && <RecallReveal card={c} result={r} answer={a} inert={!cur} />}
      </LessonSheet>
    );
  };

  // WL L290–301: the DONE sheet.
  const renderDone = () => (
    <View testID="recall-done" style={{ alignItems: 'center', alignSelf: 'stretch' }}>
      <View testID="recall-done-stamp" style={{ width: 96, height: 96, borderRadius: 48, borderWidth: 1, borderColor: nb.green, alignItems: 'center', transform: [{ rotate: '-10deg' }] }}>
        <NbDoubleRing color={nb.green} radius={48} />
        {/* `3px double` + DONE `margin-top: 24`: 27 from the outer edge; the box's own border here is 1. */}
        <Text style={{ fontFamily: nbFonts.bodyBold, fontSize: 9, letterSpacing: 2, color: nb.green, marginTop: 26 }}>DONE</Text>
        <Text style={[nbText.hand(22, nb.green), { lineHeight: 22 }]}>{t('recall.done')}</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 12, marginTop: 18 }}>
        <View style={{ alignItems: 'center' }}>
          <Text testID="recall-right-count" style={nbText.hand(24, nb.green)}>{String(right)}</Text>
          <Text style={nbText.body(10.5, nb.soft)}>{t('recall.right')}</Text>
        </View>
        <View style={{ width: 1, backgroundColor: 'rgba(62,54,43,.2)' }} />
        <View style={{ alignItems: 'center' }}>
          <Text testID="recall-wrong-count" style={nbText.hand(24, nb.red)}>{String(wrong)}</Text>
          <Text style={nbText.body(10.5, nb.soft)}>{t('recall.wrong')}</Text>
        </View>
      </View>
      {/* WL L300: only when something was answered wrong (`fuzzy` there is the wrong answers). */}
      {wrong > 0 && (
        <Text testID="recall-missed-note" style={[nbText.hand(13.5, nb.soft), { marginTop: 10, textAlign: 'center' }]}>
          {`${t('recall.missedNote')} `}
          <InlineIcon dy={2}><NbIcon name="pencil" size={13} color={nb.soft} /></InlineIcon>
        </Text>
      )}
    </View>
  );

  return (
    <NbSheet>
      <Stack.Screen options={TASK_SCREEN} />
      {/* WL L261–271 — `padding: 6px 24px 0` under the status bar. */}
      <View onLayout={(e) => setHeadBottom(e.nativeEvent.layout.y + e.nativeEvent.layout.height)} style={{ paddingTop: TOP_INSET + 6, paddingHorizontal: 24 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {/* "‹ 나가기": HW 15 ink, 1.5 ink border, r3, padding 1/8, -1° — the ‹ drawn (결정 4). */}
          <Pressable testID="recall-exit" onPress={() => router.back()} hitSlop={10} accessibilityRole="button">
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2, borderWidth: 1.5, borderColor: nb.ink, borderRadius: 3, paddingVertical: 1, paddingHorizontal: 8, transform: [{ rotate: '-1deg' }] }}>
              <NbIcon name="chevronLeft" size={13} />
              <Text numberOfLines={1} style={nbText.hand(15)}>{t('recall.exit')}</Text>
            </View>
          </Pressable>
          <View style={{ flex: 1 }} />
          <NbTag color={nb.green} rot={1}>{t('lesson.words.title')}</NbTag>
        </View>
        {deck.length > 0 && (
          <>
            {/* One segment per card: ink = right, red = wrong, blue = nuance still ahead. */}
            <View style={{ flexDirection: 'row', gap: 4, marginTop: 10 }}>
              {deck.map((c, k) => (
                <Segment key={k} k={k} color={k < outcomes.length ? (outcomes[k] === 'wrong' ? nb.red : nb.ink)
                  : c.kind === 'nuance' ? 'rgba(74,111,165,.25)' : 'rgba(62,54,43,.15)'} />
              ))}
            </View>
            <MarkedText testID="recall-headline" parts={headline} textStyle={[nbText.hand(21), { lineHeight: 21 * 1.25 }]} style={{ marginTop: 12 }} />
          </>
        )}
      </View>

      {!lesson ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color={nb.ink} /></View>
      ) : deck.length === 0 ? (
        <Text style={[nbText.hand(16, nb.soft), { textAlign: 'center', marginTop: 40 }]}>{t('lesson.hub.emptyNote')}</Text>
      ) : (
        <>
          <SheetStack
            ref={stack}
            index={idx}
            total={deck.length}
            done={done}
            renderSheet={renderSheet}
            renderDone={renderDone}
            onAdvance={advance}
            top={Math.max(AREA_TOP, headBottom)}
            bottom={AREA_BOTTOM}
          />

          <View testID="recall-actions" style={{ position: 'absolute', left: 24, right: 24, bottom: ACTIONS_BOTTOM }}>
            {!done && card && !result && (
              <View testID="recall-check" style={{ opacity: hasAnswer(card, answer) ? 1 : 0.4 }}>
                <NbButton variant="ink" size="lg" full icon="pencil" iconColor={nb.paper} onPress={check}>{t('recall.check')}</NbButton>
              </View>
            )}
            {!done && !!result && (
              <View style={{ flexDirection: 'row', gap: 12 }}>
                {([
                  { testID: 'recall-fuzzy', fuzzy: true, col: nb.amber, icon: 'bulb', label: t('recall.fuzzy'), sub: t('recall.fuzzySub'), rot: -0.8 },
                  { testID: 'recall-known', fuzzy: false, col: nb.green, icon: 'check', label: result === 'right' ? t('recall.known') : t('recall.knownAfterWrong'), sub: t('recall.knownSub'), rot: 0.8 },
                ] as const).map((b) => (
                  <Pressable key={b.testID} testID={b.testID} onPress={() => judge(b.fuzzy)} style={{ flex: 1 }}>
                    <NbPaper rot={b.rot} style={{ paddingVertical: 11, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1.8, borderColor: b.col, backgroundColor: `${b.col}14` }}>
                      <NbIcon name={b.icon} size={30} />
                      <View style={{ flex: 1, minWidth: 0 }}>
                        <Text numberOfLines={1} style={[nbText.hand(17, b.col), { lineHeight: 17 }]}>{b.label}</Text>
                        <Text numberOfLines={1} style={[nbText.body(10.5, nb.soft), { marginTop: 4 }]}>{b.sub}</Text>
                      </View>
                    </NbPaper>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          {/* WL L333–334 draws it always (dashed .5 until done); here only once the deck is done (see ACTIONS_BOTTOM). */}
          {(done || saveFailed) && <View testID="recall-step2-slot" style={{ position: 'absolute', left: 24, right: 24, bottom: STEP2_BOTTOM }}>
            {saveFailed && <Text testID="lesson-save-failed" style={[nbText.hand(14, nb.red), { textAlign: 'center', marginBottom: 8 }]}>{t('lesson.saveFailed')}</Text>}
            <View testID="recall-to-step2">
              <NbButton
                variant={done ? 'ink' : 'dashed'} size="lg" full icon="speech" iconRight="chevronRight"
                iconColor={done ? nb.paper : undefined} style={done ? undefined : { opacity: 0.5 }}
                onPress={done ? finish : undefined}
              >
                {t('recall.toStep2')}
              </NbButton>
            </View>
          </View>}
        </>
      )}
    </NbSheet>
  );
}
