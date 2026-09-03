// 근무 완료 — the scenario result, in the 근무 수첩 line (v30).
//
// The shift report a nurse would have written on her way out: a stamp saying the shift
// was completed, four numbers summarising it, the mission checklist ticked, and what the
// red pen caught — already filed in the review notes.
//
// The MACHINERY is unchanged. On mount it records the attempt (POST /attempts or
// /sessions/:id/complete), which awards XP and advances the daily streak, then celebrates
// the ACTUAL result: an XP count-up to the new total, the level gauge, a level-up note
// when the level ticks over, new titles, and the current streak. It falls back to the
// scenario's authored briefing rewards when the progress API is unavailable (offline /
// not authed).
//
// Two things the pixel version had are GONE, and both were replaced rather than dropped:
//   · The confetti (and tap-anywhere-for-more) and the 칭찬 스티커 square. v30 makes the
//     STAMP the celebration, which is the honest one here: a stamp is what an authority
//     puts on a completed shift, and it is the same gesture the passport's 출국 page uses.
//     Confetti on a sheet of paper also has nowhere to be — it is a screen effect, and
//     this screen is a document.
//   · The 4-stat summary is new, and every number in it is real: grade.turns, the count
//     of corrections filed, the run's average pronunciation, and the XP actually awarded.
//     A stat the run cannot know (no session → no grade) prints '—' rather than 0.
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Easing, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { NbIcon } from '@/components/nb/NbIcon';
import { NbButton, NbCheck, NbGauge, NbMark, NbPaper, NbPolaroid, NbStamp, NbTag, nbText } from '@/components/nb/NbUI';
import { RULE_COLOR, RULE_H, nb, nbFonts } from '@/theme/nb';
import { api, type Progress, type ScenarioDetail, type ScenarioGrade, type SessionSpeechReview, type SpokenSentence } from '@/api/client';
import { newlyEarnedTitles, type GrowthInput, type TitleDef } from '@/data/titles';
import { ECON } from '@/data/economy';

import { EmojiIcon } from '@/components/EmojiIcon';
import { SessionSpeechReviewCard } from '@/components/speak/SessionSpeechReviewCard';
import { playSfx } from '@/lib/sfx';
import { t, type Translate, useLocale, useT } from '@/i18n';
import { AnimatedFace } from '@engine';
import { useAvatar } from '@/hooks/useAvatar';
import { TASK_SCREEN } from '@/theme/transitions';
import { shareSource } from '@/data/loungeShare';


/**
 * Titles that arrived with this clear.
 *
 * The clear screen has two progress snapshots but no growth stats, so the day/week
 * signals the light-hearted titles read are absent here — those turn up on the
 * profile instead, which is where the collection lives. `delta` is how many
 * scenarios this run added (1 on a pass), making the "before" total exact rather
 * than assumed.
 */
function earnedBetween(before: Progress, after: Progress, totalAfter: number, delta: number): TitleDef[] {
  const asInput = (p: Progress, total: number): GrowthInput => ({
    level: p.level, xp: p.xp, streakLongest: p.streakLongest, streakCurrent: p.streakCurrent,
    rep: Object.fromEntries((p.reputation ?? []).map((r) => [r.key, r.value])),
    scenariosTotal: total,
  });
  return newlyEarnedTitles(
    asInput(before, Math.max(0, totalAfter - delta)),
    asInput(after, totalAfter),
    // hiddenFound is a server fact this screen does not fetch; treating it as 0 means
    // 숨은 영웅 is celebrated on the profile, not here — it cannot be earned BY a clear.
    { hiddenFound: 0 },
  );
}

// Parse the scenario's authored XP reward ("+ 120 XP" → 120); default 100.
function baseXpOf(t: Translate, s: ScenarioDetail | null): number {
  const r = s?.briefing?.rewards?.find((x) => x.label.includes(t('result.xp')) || /xp/i.test(x.value));
  const n = r ? parseInt(r.value.replace(/[^0-9]/g, ''), 10) : NaN;
  return Number.isFinite(n) && n > 0 ? n : ECON.scenarioBaseXP;
}

export default function ResultRoute() {
  const t = useT();
  const { id, session } = useLocalSearchParams<{ id: string; session?: string }>();
  const router = useRouter();
  const [scenario, setScenario] = useState<ScenarioDetail | null>(null);
  const [before, setBefore] = useState<Progress | null>(null);
  const [after, setAfter] = useState<Progress | null>(null);
  const [grade, setGrade] = useState<ScenarioGrade | null>(null);
  const [stickerTotal, setStickerTotal] = useState<number | null>(null);
  const [newTitles, setNewTitles] = useState<TitleDef[]>([]);
  const [failed, setFailed] = useState(false);
  // Where 다음 시나리오 goes, from the server (see CompleteResult.nextScenarioId).
  // Undefined means the button falls back to the career tab, which is where it always
  // went — a missing "next" must not produce a dead button.
  const [nextScenario, setNextScenario] = useState<string | undefined>(undefined);
  // What the player said out loud this run. null until the read-back lands (or
  // if it fails) — the card is simply absent rather than showing a stub, since a
  // celebration screen must never wait on a secondary read.
  const [speech, setSpeech] = useState<SessionSpeechReview | null>(null);
  const recorded = useRef(false);
  // Whether this run was AI-graded (had a session) and whether it passed (완료).
  const graded = !!grade;
  const passed = grade ? grade.passed : true; // legacy/deep-link path is a plain clear

  // Its own effect, not folded into the award effect above: this read is
  // independent of grading and must not be able to fail it (that effect's catch
  // sets `failed`, which swaps the whole screen for the offline fallback).
  useEffect(() => {
    if (!session) return;
    let alive = true;
    api.sessionSpeechReview(session)
      .then((r) => { if (alive) setSpeech(r); })
      .catch(() => { /* no read-back — the card stays absent */ });
    return () => { alive = false; };
  }, [session]);

  useEffect(() => {
    let alive = true;
    (async () => {
      const s = await api.scenario(id).catch(() => null);
      if (alive) setScenario(s);
      if (recorded.current) return;
      recorded.current = true; // guard StrictMode double-invoke / re-award
      try {
        const b = await api.progress();
        if (!alive) return;
        setBefore(b);
        if (session) {
          // AI-graded completion: award scaled XP, judge clear/attempt, get feedback.
          const res = await api.completeScenario(session);
          if (!alive) return;
          setGrade(res.grade);
          setNextScenario(res.nextScenarioId);
          setAfter(res.progress);
          // Praise sticker only when it counts as a clear (완료). The same call gives
          // the scenario total the title predicates need — and since a clear adds
          // exactly one, `total - 1` is the honest "before" rather than a guess.
          if (res.grade.passed) {
            api.growthStats().then((st) => {
              if (!alive) return;
              setStickerTotal(st.scenariosTotal);
              setNewTitles(earnedBetween(b, res.progress, st.scenariosTotal, 1));
            }).catch(() => { if (alive) setNewTitles(earnedBetween(b, res.progress, 0, 0)); });
          } else {
            setNewTitles(earnedBetween(b, res.progress, 0, 0));
          }
        } else {
          // Legacy / deep-link path (no dialogue session): a plain clear.
          const a = await api.recordAttempt(id, baseXpOf(t, s));
          if (!alive) return;
          setAfter(a);
          api.growthStats().then((st) => {
            if (!alive) return;
            setStickerTotal(st.scenariosTotal);
            setNewTitles(earnedBetween(b, a, st.scenariosTotal, 1));
          }).catch(() => { if (alive) setNewTitles(earnedBetween(b, a, 0, 0)); });
        }
      } catch {
        if (alive) setFailed(true); // not authed / offline → static fallback
      }
    })();
    return () => { alive = false; };
  }, [id, session]);

  const awardedXp = grade ? grade.xpAwarded : baseXpOf(t, scenario);
  const baseXp = baseXpOf(t, scenario);
  const subtitle = scenario?.briefing?.dept || scenario?.title || '';
  const leveledUp = !!before && !!after && after.level > before.level;
  // Two distinct moments, two sounds. The clear fanfare fires once the server has
  // judged the run (`after` is what proves the attempt landed), and only for a
  // pass — a failed attempt still awards XP, so celebrating it would lie. A new
  // badge or a level-up is a second, rarer beat and gets the reward arpeggio;
  // when both happen the fanfare plays first and the reward lands on top of its
  // tail rather than cutting it off.
  const avatar = useAvatar();
  const sounded = useRef(false);
  useEffect(() => {
    if (!after || sounded.current) return;
    sounded.current = true;
    if (passed) playSfx('success');
    if (newTitles.length > 0 || leveledUp) playSfx('reward');
  }, [after, passed, newTitles, leveledUp]);

  // Read once, on mount: module state, so deriving it in render would be computed a
  // single time per instance anyway — and this screen is where the conversation that
  // just ended is still available to quote.
  const [canShareConversation] = useState(() => !!shareSource());

  const onShare = () => {
    const lv = after ? ` (Lv.${after.level}${after.streakCurrent > 1 ? ` · ${after.streakCurrent}일 연속` : ''})` : '';
    const verb = passed ? t('result.verbCleared') : t('result.verbPracticed');
    Share.share({ message: t('result.shareBody', { title: scenario?.title || t('result.aScenario'), verb, xp: awardedXp, lv }) }).catch(() => {});
  };

  // Practising the weakest sentences starts with the worst one. The rest are not
  // queued: the pronunciation screen owns its own next-sentence flow, and
  // inventing a second queue here would compete with it.
  const practiseWeakest = (sentences: SpokenSentence[]) => {
    const worst = sentences[0];
    if (!worst) return;
    // One single template literal — expo-router's typed-routes generator matches
    // statically against one backtick expression (see dialogue's openPronunciation).
    router.push(
      `/pronunciation/${encodeURIComponent(worst.referenceText.slice(0, 40))}?referenceText=${encodeURIComponent(worst.referenceText)}&origin=review&scenarioId=${encodeURIComponent(id)}`
    );
  };

  const dept = scenario?.briefing?.dept?.split('·')[0].trim() || '';
  const avg = speech && speech.sentences.length > 0 ? Math.round(speech.average) : null;

  return (
    <Sheet>
      <Stack.Screen options={TASK_SCREEN} />

      <View style={styles.topbar}>
        <Pressable onPress={() => router.replace('/campus')} hitSlop={10}>
          <NbPaper rot={-1} style={styles.chip}><NbIcon name="chevronLeft" size={16} /></NbPaper>
        </Pressable>
        <View style={{ flex: 1 }} />
        <NbButton variant="paper" size="sm" icon="handshake2" onPress={onShare}>{t('result.share')}</NbButton>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* The stamp is the celebration. It lands on the page the way an authority stamps
            a finished shift — the same gesture the passport's departure page uses. */}
        <View style={{ alignItems: 'center' }}>
          <NbStamp
            color={passed ? nb.green : nb.red}
            size={118}
            rot={-11}
            top={passed ? 'PASSED' : 'RETRY'}
            bottom={passed ? t('result.shiftDone') : t('result.shiftRetry')}
          />
          <Text numberOfLines={1} style={[nbText.mono(10), styles.stampDate]}>
            {[stampDate(), dept].filter(Boolean).join(' · ')}
          </Text>
          <Text style={[nbText.hand(25), styles.headline]}>
            {passed
              ? t('result.doneWell', { title: scenario?.title || t('result.aScenario') })
              : t('result.almostThere', { title: scenario?.title || t('result.aScenario') })}
          </Text>

          {/* The learner's own avatar reacting — kept from the pixel screen, where the
              clear sound and this motion are one beat. Inside a polaroid because a
              sprite cannot sit directly on paper. Keyed on `after` so it fires once the
              server has actually judged the run: reacting sooner would celebrate a
              result nobody has yet. */}
          {after && (
            <View style={{ marginTop: 14 }}>
              <NbPolaroid size={86} rot={-2.5}>
                <AnimatedFace
                  size={92}
                  avatar={avatar}
                  expression={passed ? 'happy' : 'sad'}
                  reaction={passed ? 'cheer' : 'slump'}
                />
              </NbPolaroid>
            </View>
          )}
        </View>

        {/* 오늘 근무 요약. Four numbers, dashed apart — a stat this run cannot know
            prints '—', because 0 turns and "we did not measure turns" are different
            facts and one of them is an accusation. */}
        <NbPaper rot={-0.5} tape tapeLeft={128} style={styles.summary}>
          <Stat label={t('result.statTurns')} value={grade ? String(grade.turns) : '—'} first />
          <Stat label={t('result.statPhrases')} value={grade ? String(grade.tips?.length ?? 0) : '—'} />
          <Stat label={t('result.statPron')} value={avg != null ? String(avg) : '—'} />
          <Stat label="XP" value={`+${awardedXp}`} accent={nb.green} />
        </NbPaper>

        {/* 미션 결과 — the same goals the briefing showed as a checklist, now ticked. */}
        {graded && grade!.goals?.length > 0 && (
          <NbPaper rot={0.5} style={styles.card}>
            <Text style={styles.cardLabel}>{t('result.missionResult')}</Text>
            {grade!.goals.map((g, i) => (
              <View key={i} style={styles.goalRow}>
                <NbCheck done={g.met} size={18} />
                <Text style={[nbText.hand(16.5), { flex: 1, minWidth: 0, color: g.met ? nb.ink : nb.soft }]}>{g.goal}</Text>
                {!g.met && <NbTag color={nb.red} rot={-2}>{t('result.nextTime')}</NbTag>}
              </View>
            ))}
          </NbPaper>
        )}

        {/* The grade's own words: a score, a headline, the feedback. Not a second card
            per field — the learner reads this once, top to bottom. */}
        {graded && (!!grade!.headline || !!grade!.feedback) && (
          <NbPaper rot={-0.4} bg={passed ? 'rgba(168,217,151,.3)' : '#FFF3EE'} style={styles.card}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={styles.score}>
                <Text style={styles.scoreNum}>{grade!.score}</Text>
                <Text style={styles.scoreMax}>/ 100</Text>
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                {!!grade!.headline && <Text style={nbText.hand(18)}>{grade!.headline}</Text>}
                {!!grade!.feedback && (
                  <Text style={[nbText.body(11.5, nb.soft), { marginTop: 3 }]}>{grade!.feedback}</Text>
                )}
              </View>
            </View>
          </NbPaper>
        )}

        {/* 빨간펜 → 복습 노트.
            The v30 artboard strikes through the learner's own line above each correction.
            These `tips` are not that: the server sends the phrase to use, with a Korean
            gloss, and not the line it replaces — so nothing is struck through here rather
            than striking through a sentence the learner may never have said. */}
        {graded && grade!.tips?.length > 0 && (
          <NbPaper rot={0.4} style={styles.card}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text numberOfLines={2} style={[styles.cardLabel, { color: nb.red, flex: 1, minWidth: 0 }]}>
                {t('result.filedToNotes', { n: grade!.tips.length })}
              </Text>
              <Pressable onPress={() => router.replace('/lab')} hitSlop={8}>
                <Text numberOfLines={1} style={[nbText.hand(14, nb.blue), { textDecorationLine: 'underline' }]}>
                  {t('result.seeAll')}
                </Text>
              </Pressable>
            </View>
            {grade!.tips.map((tip, i) => (
              <View key={i} style={styles.tipRow}>
                <NbMark textStyle={styles.tipEn}>{tip.en}</NbMark>
                {!!tip.ko && <Text style={[nbText.hand(14.5, nb.soft), { marginTop: 3 }]}>{tip.ko}</Text>}
              </View>
            ))}
          </NbPaper>
        )}

        {/* What the learner said out loud. Absent until the read-back lands and only when
            the run actually recorded something: a fully-typed run has nothing to review,
            and an empty card on a completion screen reads as a failure. */}
        {speech && speech.sentences.length > 0 && (
          <SessionSpeechReviewCard review={speech} onPractise={practiseWeakest} />
        )}

        {/* 레벨 업 — a note in the margin, not a banner: it is a fact about the number
            below it. */}
        {leveledUp && (
          <NbPaper rot={-0.4} bg="rgba(249,227,123,.5)" style={styles.levelUp}>
            <NbIcon name="star" size={18} color="#C99A1E" />
            <Text numberOfLines={1} style={[nbText.hand(17), { flex: 1, minWidth: 0 }]}>
              {t('result.leveledUp', { from: before!.level, to: after!.level })}
            </Text>
          </NbPaper>
        )}

        {newTitles.map((b) => (
          <NbPaper key={b.id} rot={0.4} style={styles.titleRow}>
            <NbIcon name={b.hidden ? 'bulb' : 'trophy'} size={20} />
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text numberOfLines={1} style={nbText.body(10.5, nb.soft)}>{t('result.newTitle')}</Text>
              <Text numberOfLines={1} style={nbText.hand(17)}>{t(b.nameKey)}</Text>
            </View>
          </NbPaper>
        ))}

        {/* XP, level and streak — the ledger. */}
        <NbPaper rot={-0.5} style={styles.card}>
          {after ? (
            <XpCard baseXp={awardedXp} before={before} after={after} stickerTotal={passed ? stickerTotal : null} showSticker={passed} />
          ) : failed ? (
            <StaticRewards scenario={scenario} baseXp={baseXp} />
          ) : (
            <View style={{ paddingVertical: 18, alignItems: 'center', gap: 8 }}>
              <ActivityIndicator color={nb.ink} />
              <Text style={nbText.hand(15, nb.soft)}>{t('result.awarding')}</Text>
            </View>
          )}
        </NbPaper>

        {/* 라운지에 대화 공유. Here rather than in the lounge's 글쓰기 because this is the
            only screen that still holds the turns — the server has no transcript of a
            finished session to fetch them back from. */}
        {canShareConversation && (
          <View style={{ marginTop: 14 }}>
            <NbButton variant="paper" full icon="pushpin" onPress={() => router.push('/lounge/compose?kind=share')}>
              {t('result.shareToLounge')}
            </NbButton>
          </View>
        )}

        <View style={styles.footer}>
          <View style={{ flex: 1 }}>
            <NbButton variant="paper" full icon="lab" onPress={() => router.replace('/lab')}>{t('result.openNotes')}</NbButton>
          </View>
          <View style={{ flex: 1 }}>
            {/* Into the next briefing, not the career tab. The learner just finished
                something; making them navigate to find what follows is the button failing
                at its one job.
                `replace`, not `push`: the result screen is not somewhere to come back to,
                and leaving it on the stack would put a completed scenario behind the back
                gesture of the next one.
                When the server hands back the scenario just finished, the run did not pass
                and the next step is locked behind it — so the button says 다시 도전 rather
                than pretending to advance. */}
            <NbButton
              variant="ink"
              full
              iconRight="chevronRight"
              iconColor={nb.paper}
              onPress={() => router.replace(nextScenario ? `/scenario/${nextScenario}` : '/campus')}
            >
              {t(nextScenario === id ? 'result.retryScenario' : 'result.nextScenario')}
            </NbButton>
          </View>
        </View>
      </ScrollView>
    </Sheet>
  );
}

/** The ruled page. */
function Sheet({ children }: { children: React.ReactNode }) {
  const [h, setH] = useState(900);
  return (
    <View style={{ flex: 1, backgroundColor: nb.cream }} onLayout={(e) => setH(e.nativeEvent.layout.height)}>
      <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, overflow: 'hidden' }}>
        {Array.from({ length: Math.ceil(h / RULE_H) }).map((_, i) => (
          <View key={i} style={{ position: 'absolute', left: 0, right: 0, top: (i + 1) * RULE_H, height: 1, backgroundColor: RULE_COLOR }} />
        ))}
      </View>
      {children}
    </View>
  );
}

/** The stamp's date, printed the way a stamp prints it. */
function stampDate(): string {
  const d = new Date();
  const mon = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'][d.getMonth()];
  return `${mon} ${String(d.getDate()).padStart(2, '0')}`;
}

/** One of the four summary numbers. */
function Stat({ label, value, accent, first }: { label: string; value: string; accent?: string; first?: boolean }) {
  return (
    <View style={[styles.stat, !first && styles.statDivider]}>
      <Text numberOfLines={1} style={nbText.body(10, nb.soft)}>{label}</Text>
      <Text numberOfLines={1} style={[nbText.hand(21, accent ?? nb.ink), { marginTop: 2 }]}>{value}</Text>
    </View>
  );
}

// ── the ledger: XP, level, streak ─────────────────────────────────────
function XpCard({ baseXp, before, after, stickerTotal, showSticker = true }: {
  baseXp: number; before: Progress | null; after: Progress; stickerTotal: number | null; showSticker?: boolean;
}) {
  const t = useT();
  const startXp = before?.xp ?? Math.max(0, after.xp - baseXp);
  const inLevel = after.xp % ECON.xpPerLevel;
  const toNext = ECON.xpPerLevel - inLevel;
  const best = after.streakCurrent >= after.streakLongest && after.streakCurrent > 1;
  return (
    <View>
      <View style={styles.ledgerRow}>
        <NbIcon name="star" size={17} color="#C99A1E" />
        <Text numberOfLines={1} style={[nbText.hand(16.5), { flex: 1, minWidth: 0 }]}>{t('result.xpGained')}</Text>
        <Text numberOfLines={1} style={styles.ledgerValue}>+{baseXp} XP</Text>
      </View>

      {/* The praise count is a running total, so it is a fact rather than a sticker to
          look at — the sticker board it used to feed was deleted with the growth report
          (v29 07: 삭제 확정). */}
      {showSticker && stickerTotal != null && (
        <View style={styles.ledgerRow}>
          <NbIcon name="trophy" size={17} />
          <Text numberOfLines={1} style={[nbText.hand(16.5), { flex: 1, minWidth: 0 }]}>{t('result.clearedTotal')}</Text>
          <Text numberOfLines={1} style={styles.ledgerValue}>{stickerTotal}</Text>
        </View>
      )}

      <View style={styles.levelHead}>
        <Text numberOfLines={1} style={nbText.hand(16.5)}>{t('common.level', { level: after.level })}</Text>
        <View style={{ flex: 1 }} />
        <CountUp from={startXp} to={after.xp} suffix=" XP" style={styles.ledgerCount} />
      </View>
      {/* Pencil hatching, filled to the level — the same gauge as the profile's, so a
          learner comparing the two screens is reading one instrument. */}
      <NbGauge value={(inLevel / ECON.xpPerLevel) * 100} height={11} />
      <Text numberOfLines={1} style={[nbText.hand(13.5, nb.soft), { marginTop: 5, textAlign: 'right' }]}>
        {t('result.toNextLevel', { xp: toNext })}
      </Text>

      <View style={styles.streakRow}>
        <NbStamp color={nb.red} size={46} rot={-7} top={best ? 'BEST' : 'STREAK'} bottom={String(after.streakCurrent)} />
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text numberOfLines={1} style={nbText.hand(16.5)}>{t('result.streakLabel')}</Text>
          <Text numberOfLines={1} style={nbText.body(10.5, nb.soft)}>
            {t('common.streakDays', { n: after.streakCurrent })}{best ? t('result.best') : ''}
          </Text>
        </View>
      </View>
    </View>
  );
}

function CountUp({ from, to, suffix = '', style }: { from: number; to: number; suffix?: string; style?: object }) {
  const [n, setN] = useState(from);
  const v = useRef(new Animated.Value(from)).current;
  useEffect(() => {
    const sub = v.addListener(({ value }) => setN(Math.round(value)));
    Animated.timing(v, { toValue: to, duration: 1100, delay: 250, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
    return () => v.removeListener(sub);
  }, [v, to]);
  return <Text style={style}>{n.toLocaleString()}{suffix}</Text>;
}

// ── static fallback (offline / not authed) ────────────────────────────
function StaticRewards({ scenario, baseXp }: { scenario: ScenarioDetail | null; baseXp: number }) {
  const t = useT();
  const rewards = scenario?.briefing?.rewards ?? [{ icon: '⭐', label: t('result.xp'), value: `+ ${baseXp} XP` }];
  return (
    <View>
      <Text style={styles.cardLabel}>{t('result.authoredRewards')}</Text>
      {rewards.map((r, i) => (
        <View key={i} style={[styles.ledgerRow, i === 0 && { marginTop: 6 }]}>
          <EmojiIcon emoji={r.icon} size={16} />
          <Text numberOfLines={1} style={[nbText.hand(16), { flex: 1, minWidth: 0 }]}>{r.label}</Text>
          <Text numberOfLines={1} style={styles.ledgerValue}>{r.value}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  topbar: { paddingTop: 52, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', gap: 10 },
  chip: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  scroll: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 44 },

  stampDate: { marginTop: 10 },
  headline: { marginTop: 8, textAlign: 'center', lineHeight: 30 },

  summary: { marginTop: 20, paddingVertical: 13, paddingHorizontal: 15, flexDirection: 'row' },
  stat: { flex: 1, alignItems: 'center' },
  statDivider: { borderLeftWidth: 1.3, borderStyle: 'dashed', borderLeftColor: 'rgba(62,54,43,.2)' },

  card: { marginTop: 13, paddingVertical: 13, paddingHorizontal: 15 },
  /** Section labels are PRINTED and small — they name a block rather than speaking. */
  cardLabel: { fontFamily: nbFonts.bodyBold, fontSize: 11, color: nb.blue, letterSpacing: 1 },
  goalRow: { flexDirection: 'row', alignItems: 'center', gap: 9, marginTop: 9 },

  score: {
    alignItems: 'center', flexShrink: 0, paddingRight: 13,
    borderRightWidth: 1.5, borderStyle: 'dashed', borderRightColor: 'rgba(62,54,43,.3)',
  },
  scoreNum: { fontFamily: nbFonts.handBold, fontSize: 34, lineHeight: 36, color: nb.ink },
  scoreMax: { fontFamily: nbFonts.monoBold, fontSize: 9.5, color: nb.soft },

  tipRow: { marginTop: 10, paddingTop: 9, borderTopWidth: 1.3, borderStyle: 'dashed', borderTopColor: 'rgba(62,54,43,.15)' },
  tipEn: { fontFamily: nbFonts.bodyBold, fontSize: 13, color: nb.ink, lineHeight: 19 },

  levelUp: { marginTop: 13, paddingVertical: 10, paddingHorizontal: 13, flexDirection: 'row', alignItems: 'center', gap: 9 },
  titleRow: { marginTop: 10, paddingVertical: 10, paddingHorizontal: 13, flexDirection: 'row', alignItems: 'center', gap: 10 },

  ledgerRow: { flexDirection: 'row', alignItems: 'center', gap: 9, paddingVertical: 5 },
  /** Amounts are printed: they are numbers to be compared, not words. */
  ledgerValue: { fontFamily: nbFonts.monoBold, fontSize: 13, color: nb.green },
  ledgerCount: { fontFamily: nbFonts.mono, fontSize: 12, color: nb.soft },
  levelHead: {
    flexDirection: 'row', alignItems: 'center', marginTop: 11, marginBottom: 6,
    paddingTop: 11, borderTopWidth: 1.3, borderStyle: 'dashed', borderTopColor: 'rgba(62,54,43,.15)',
  },
  streakRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 13,
    paddingTop: 12, borderTopWidth: 1.3, borderStyle: 'dashed', borderTopColor: 'rgba(62,54,43,.15)',
  },

  footer: { flexDirection: 'row', gap: 9, marginTop: 18 },
});
