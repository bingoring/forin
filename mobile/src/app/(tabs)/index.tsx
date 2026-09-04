// 홈 — the 근무 수첩 line (v29).
//
// The nurse's own notebook, opened to today: a taped page for the one task, a red-pen note
// for the call that has a deadline, cut-out cards for the wards, and the day's sentence
// under a highlighter. The streak is a rubber stamp in the corner rather than a row of
// boxes — the boxes were a chart of your own emptiness on a quiet week.
//
// The DATA and the routing are unchanged from the pixel version: same /home read, same
// cold-start retry, same "the server is waking" wait, same rule that a call is ACCEPTED on
// the server before the app navigates. Only the drawing is new.
//
// Two things worth knowing about the layout:
//
//  · The handoff's home is five modules (오늘의 할 일 · 호출 쪽지 · 과별 출근 카드 ·
//    오늘의 문장 · 연속출근 도장). Those are the top of the screen, in that order. The
//    modules the design does not list but the server still serves — the mentor's note, the
//    review peek, colleagues — are kept below it, restyled. Dropping them would be a
//    product change the handoff does not ask for.
//  · The live ward is back (v37), redrawn in the notebook line: LiveWardNb walks
//    NbCharacter figures — the 2-head notebook walker built from each learner's AvatarSpec,
//    not pixel sprites — so it belongs on a paper page. It sits at the very top, above the
//    one task: the ward, then the work. Phase 1 walks only the learner; the roster of
//    people currently studying wires in behind it (see components/home/LiveWardNb).
import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { NbIcon, type NbIconName } from '@/components/nb/NbIcon';
import { NbButton, NbCheck, NbGrabber, NbMark, NbMemo, NbPaper, NbStamp, NbTag, nbText } from '@/components/nb/NbUI';
import { LiveWardNb } from '@/components/home/LiveWardNb';
import { setHomeActive, setWardVisible, useWardRoster } from '@/lib/wardPresence';
import { markPhrasePracticed, usePhrasePracticed } from '@/lib/dailyBrief';
import { RULE_COLOR, RULE_H, TOP_INSET, nb, nbFonts } from '@/theme/nb';
import { SHIFT_LABEL, moodAt } from '@/data/wardMood';
import { api, type Home, type HomePage } from '@/api/client';
import { useLocale, useT } from '@/i18n';

/** How many times the home read is retried before it is called a failure. Cloud Run
 *  scales to zero, so the first request after an idle period is a WAIT, not an error. */
const HOME_RETRIES = 3;

/** The wards a learner can clock into from here, in the order the handoff draws them.
 *  `code` is the interior deep link the 일터 tab already uses (INT-<code>-00001), so this
 *  is a shortcut into the existing flow rather than a parallel one. */
const WARDS: { code: string; icon: NbIconName; labelKey: string; rot: number }[] = [
  { code: 'ER', icon: 'siren', labelKey: 'dept.er', rot: -1.5 },
  { code: 'OR', icon: 'scalpel', labelKey: 'dept.or', rot: 1 },
  { code: 'PEDS', icon: 'baby', labelKey: 'dept.peds', rot: -0.5 },
  { code: 'ICU', icon: 'monitor', labelKey: 'dept.icu', rot: 1.5 },
  { code: 'PHARMA', icon: 'pill', labelKey: 'dept.pharma', rot: -1 },
  { code: 'SURGWARD', icon: 'bandage', labelKey: 'dept.surgward', rot: 0.7 },
];

export default function HomeTab() {
  const t = useT();
  const locale = useLocale();
  const router = useRouter();
  const [home, setHome] = useState<Home | null>(null);
  const [name, setName] = useState('');
  const [state, setState] = useState<'loading' | 'error' | 'ok'>('loading');
  const [flipped, setFlipped] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const wardRoster = useWardRoster();
  const phraseDone = usePhrasePracticed(home?.date ?? '');

  // The ward roster polls only while home is on screen — being here is what turns it on.
  useFocusEffect(
    useCallback(() => {
      setHomeActive(true);
      return () => setHomeActive(false);
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      let timer: ReturnType<typeof setTimeout> | undefined;
      const load = async (n: number) => {
        try {
          // In parallel: the name is for the heading, and it must never delay the page.
          // A failed /me leaves the notebook titled without one, which is what a learner
          // who has not set a name sees anyway.
          const [h, me, prefs] = await Promise.all([
            api.home(),
            api.me().catch(() => null),
            api.colleaguePrefs().catch(() => null),
          ]);
          if (!alive) return;
          setHome(h);
          setName(
            (me as { profile?: { displayName?: string } } | null)?.profile?.displayName || '',
          );
          // So a learner who opted out sees their figure gone even on a fresh launch, before
          // ever opening the 나 tab.
          if (prefs) setWardVisible(prefs.shareWard);
          setState('ok');
          setAttempt(0);
        } catch {
          if (!alive) return;
          if (n < HOME_RETRIES) {
            setAttempt(n + 1);
            // Growing gaps: a cold start is seconds, and hammering it does not help.
            timer = setTimeout(() => load(n + 1), 1_500 * (n + 1));
            return;
          }
          setState('error');
        }
      };
      setState((cur) => (cur === 'ok' ? cur : 'loading'));
      void load(0);
      return () => { alive = false; if (timer) clearTimeout(timer); };
    }, []),
  );

  const retry = () => {
    setState('loading');
    setAttempt(0);
    void api.home().then((h) => { setHome(h); setState('ok'); }).catch(() => setState('error'));
  };

  if (state !== 'ok' || !home) {
    return (
      <Sheet>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 14 }}>
          {state === 'loading' ? (
            <>
              <ActivityIndicator color={nb.ink} />
              <Text style={[nbText.hand(16, nb.soft), { textAlign: 'center' }]}>
                {attempt > 0 ? t('home.waking') : ''}
              </Text>
            </>
          ) : (
            <>
              <Text style={[nbText.hand(17), { textAlign: 'center' }]}>{t('home.loadFailed')}</Text>
              <NbButton variant="ink" onPress={retry} icon="pencil" iconColor={nb.paper}>
                {t('common.retry')}
              </NbButton>
            </>
          )}
        </View>
      </Sheet>
    );
  }

  const startToday = () => {
    const id = home.todayOne?.scenarioId;
    if (!id) return;
    // Same routing rule the 일터 tab uses — the home task is a shortcut into the existing
    // curriculum flow, not a parallel one.
    router.push(id.startsWith('QZ-') ? `/quiz/${id}` : `/scenario/${id}`);
  };

  /** Answer today's 호출, then enter the scenario it points at.
   *
   *  The server is asked FIRST and the navigation follows its answer: it decides whether
   *  the bonus is payable (once) and whether the window is still open. Entering the
   *  scenario before hearing back would let an expired call still be played. */
  const answerPage = async () => {
    try {
      const { scenarioId } = await api.acceptPage();
      const id = scenarioId || home.page?.scenarioId;
      if (!id) return;
      // ACCEPTED, not answered. The bonus is the server's to grant, on the next home read,
      // once it can see the scenario was actually started.
      setHome({ ...home, page: { ...home.page!, accepted: true } });
      router.push(id.startsWith('QZ-') ? `/quiz/${id}` : `/scenario/${id}`);
    } catch {
      // Expired or gone: the next home load drops the card on its own.
    }
  };

  const shift = SHIFT_LABEL[moodAt(new Date())];

  return (
    <Sheet>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingTop: TOP_INSET, paddingBottom: 30 }}>
        {/* The heading, and the streak stamped in the corner. */}
        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={[nbText.hand(30), { lineHeight: 33 }]}>
              {name ? t('home.nbTitle', { name }) : t('home.nbTitleAnon')}
            </Text>
            {/* The shift's NAME comes from the device clock; its DEPARTMENT comes from
                the server, because the department is the current curriculum step's and the
                phone cannot know it. The server's own shift field was a hash of
                (userID, day) — a dice roll with no room for NIGHT — so only the dept is
                taken from it. */}
            <Text style={[nbText.hand(16, nb.soft), { marginTop: 2 }]}>
              {home.shift
                ? t('home.nbSubDept', { date: home.date, shift, dept: home.shift.deptLabel })
                : t('home.nbSubShift', { date: home.date, shift })}
            </Text>
          </View>
          {/* Only once there is a streak to stamp. A "0일" stamp is a stamp saying you have
              not been here — the row of empty boxes this replaced, in one shape. */}
          {home.streak > 0 && (
            <NbStamp
              color={nb.red}
              rot={9}
              size={72}
              top={t('home.streakStamp')}
              bottom={t('home.streakDays', { n: home.streak })}
            />
          )}
        </View>

        {/* 라이브 병동 — 지금 학습 중인 사람들이 순회하는, 홈 최상단의 살아 있는 병동. */}
        <LiveWardNb roster={wardRoster} />

        {/* 오늘의 근무 브리핑 — 하루 세 가지: 복습·커리큘럼 이어서·오늘의 문장. */}
        <TodayBrief
          home={home}
          phraseDone={phraseDone}
          onReview={() => router.push('/lab')}
          onContinue={startToday}
          onPhrase={() => {
            if (!home.phrase) return;
            markPhrasePracticed(home.date);
            router.push({
              pathname: '/pronunciation/[sentenceKey]',
              params: { sentenceKey: home.phrase.en.slice(0, 40), referenceText: home.phrase.en, origin: 'home' },
            });
          }}
        />

        {/* 이어서 하기 — resume the curriculum where the last attempt left off. It leads
            with WHERE (the chapter/coordinate), the step as subtitle, and a real progress
            bar, so it reads as "carry on" rather than "here is an in-progress list". */}
        {home.todayOne ? (
          <NbPaper rot={-0.7} tape tapeLeft={120} style={{ marginTop: 16, paddingTop: 18, paddingBottom: 14, paddingHorizontal: 16 }}>
            <Text style={{ fontFamily: nbFonts.bodyBold, fontSize: 11, color: nb.blue, letterSpacing: 1 }}>
              {t('home.resumeLabel')}
            </Text>
            <Text style={[nbText.hand(21), { marginTop: 7, lineHeight: 27 }]}>{home.todayOne.chapter}</Text>
            <Text style={[nbText.body(10.5, nb.soft), { marginTop: 3 }]}>
              {t('home.nextUp', { title: home.todayOne.title })}
            </Text>
            {/* Progress through the chapter's required steps (runs), from the server. Absent
                on an older payload — the card then simply shows no bar. */}
            {!!home.todayOne.progress && home.todayOne.progress.total > 0 && (
              <View style={{ marginTop: 11 }}>
                <Text style={[nbText.body(9.5, nb.soft), { marginBottom: 4 }]}>
                  {home.todayOne.progress.done} / {home.todayOne.progress.total}
                </Text>
                <View style={{ height: 8, borderWidth: 1.5, borderColor: nb.ink, backgroundColor: nb.paper, overflow: 'hidden' }}>
                  <View style={{ width: `${Math.round((100 * home.todayOne.progress.done) / home.todayOne.progress.total)}%`, height: '100%', backgroundColor: nb.green }} />
                </View>
              </View>
            )}
            <View style={{ flexDirection: 'row', gap: 9, marginTop: 12 }}>
              <NbButton variant="ink" icon="pencil" iconColor={nb.paper} onPress={startToday}>
                {t('home.resumeCta')}
              </NbButton>
              {/* Practises the DAY'S SENTENCE, which is the only sentence this screen
                  actually has — the task is a scenario, and its lines do not exist yet.
                  Hidden when there is no phrase rather than routed nowhere. */}
              {!!home.phrase && (
                <NbButton
                  variant="dashed"
                  icon="mic"
                  size="sm"
                  onPress={() => {
                    markPhrasePracticed(home.date);
                    router.push({
                      pathname: '/pronunciation/[sentenceKey]',
                      params: { sentenceKey: home.phrase!.en.slice(0, 40), referenceText: home.phrase!.en, origin: 'home' },
                    });
                  }}
                >
                  {t('home.pronPractice')}
                </NbButton>
              )}
            </View>
          </NbPaper>
        ) : (
          <NbPaper rot={-0.5} tape tapeLeft={90} style={{ marginTop: 16, paddingVertical: 16, paddingHorizontal: 16 }}>
            <Text style={[nbText.hand(20)]}>{t('home.restToday')}</Text>
            <Text style={[nbText.body(11, nb.soft), { marginTop: 4 }]}>
              {t('home.restSub', { n: home.streak + 1 })}
            </Text>
          </NbPaper>
        )}

        {/* 호출 쪽지 — the one module with a deadline, so it sits above everything that
            will still be here tomorrow. */}
        {/* An EXPIRED call is not drawn — see PageNote. */}
        {!!home.page && <PageNote page={home.page} onAnswer={answerPage} />}

        {/* ✂ 과별 출근 카드 */}
        <Text style={[nbText.hand(19), { marginTop: 18 }]}>{t('home.deptCards')}</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 11, marginTop: 9 }}>
          {WARDS.map((w) => (
            <Pressable
              key={w.code}
              onPress={() => router.push(`/interior/INT-${w.code}-00001`)}
              style={{ width: '30.5%' }}
            >
              <NbPaper rot={w.rot} style={{ paddingTop: 13, paddingBottom: 10, alignItems: 'center' }}>
                <NbIcon name={w.icon} size={23} />
                <Text numberOfLines={1} style={[nbText.hand(15), { marginTop: 3 }]}>{t(w.labelKey)}</Text>
              </NbPaper>
            </Pressable>
          ))}
        </View>

        {/* 오늘의 문장 — highlighted, and it turns over to the learner's own language. */}
        {!!home.phrase && (
          <Pressable onPress={() => setFlipped((f) => !f)}>
            <NbPaper rot={-0.5} tape tapeLeft={30} style={{ marginTop: 17, paddingVertical: 14, paddingHorizontal: 16 }}>
              <Text style={{ fontFamily: nbFonts.bodyBold, fontSize: 11, color: nb.green, letterSpacing: 1 }}>
                {t('home.phraseToday')}
              </Text>
              <View style={{ marginTop: 7 }}>
                <NbMark textStyle={{ fontFamily: nbFonts.bodyMid, fontSize: 15, lineHeight: 23 }}>
                  {home.phrase.en}
                </NbMark>
              </View>
              {/* The translation is the back of the card: shown on a tap, so the sentence
                  is read first in the language being learned. */}
              {flipped && (
                <Text style={[nbText.hand(15, nb.soft), { marginTop: 5 }]}>{home.phrase.ko}</Text>
              )}
            </NbPaper>
          </Pressable>
        )}

        {/* ── kept from the pixel home: served by the API, not drawn by the handoff ── */}

        {!!home.mentorNote && (
          <NbMemo color={nb.blue} rot={0.4} style={{ marginTop: 17 }}>
            <Text style={{ fontFamily: nbFonts.bodyBold, fontSize: 11, color: nb.blue }}>
              {home.mentorNote.npc.name} · {home.mentorNote.npc.dept}
            </Text>
            <Text style={[nbText.hand(15), { marginTop: 3 }]}>{home.mentorNote.text}</Text>
          </NbMemo>
        )}

        {!!home.review && (
          <Pressable onPress={() => router.push('/lab')}>
            <NbPaper rot={0.6} style={{ marginTop: 15, paddingVertical: 12, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <NbIcon name="pencil" size={20} />
              <Text numberOfLines={2} style={[nbText.hand(15), { flex: 1, minWidth: 0 }]}>{home.review.front}</Text>
              <NbIcon name="chevronRight" size={15} />
            </NbPaper>
          </Pressable>
        )}

        <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
          <View style={{ flex: 1 }}>
            <NbButton variant="paper" full icon="hospital" onPress={() => router.push('/campus')}>
              {t('tab.career')}
            </NbButton>
          </View>
          <View style={{ flex: 1 }}>
            <NbButton variant="paper" full icon="speech" onPress={() => router.push('/board')}>
              {t('tab.board')}
            </NbButton>
          </View>
        </View>

        {(home.colleagueTotal > 0 || home.pendingRequests > 0) && (
          <Pressable onPress={() => router.push('/colleagues')}>
            <NbPaper rot={-0.4} pinned={150} pinColor={nb.green} style={{ marginTop: 18, paddingVertical: 12, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <NbIcon name="handshake2" size={22} />
              <Text style={[nbText.hand(15), { flex: 1, minWidth: 0 }]} numberOfLines={1}>
                {t('home.colleagues', { n: home.colleagueTotal })}
              </Text>
              {home.pendingRequests > 0 && <NbTag color={nb.red} fill>{home.pendingRequests}</NbTag>}
            </NbPaper>
          </Pressable>
        )}

        <NbGrabber style={{ marginTop: 22, opacity: 0.5 }} />
      </ScrollView>
    </Sheet>
  );
}

/** The ruled page everything sits on. Local to this screen so the rule count can follow
 *  the screen height rather than a guess. */
function Sheet({ children }: { children: React.ReactNode }) {
  const [h, setH] = useState(900);
  return (
    <View
      style={{ flex: 1, backgroundColor: nb.cream }}
      onLayout={(e) => setH(e.nativeEvent.layout.height)}
    >
      <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, overflow: 'hidden' }}>
        {Array.from({ length: Math.ceil(h / RULE_H) }).map((_, i) => (
          <View key={i} style={{ position: 'absolute', left: 0, right: 0, top: (i + 1) * RULE_H, height: 1, backgroundColor: RULE_COLOR }} />
        ))}
      </View>
      {children}
    </View>
  );
}

/**
 * 호출 쪽지 — the call, as a red-pen note on peach paper.
 *
 * Three states, as the pixel version had: open (answerable), accepted (the learner took it
 * and can carry on), answered (done). The distinction exists because "answered" used to be
 * set on the tap, and walking straight out of the scenario still reported +40 XP.
 *
 * A call whose window RAN OUT is not drawn at all. A note offering an action that cannot be
 * taken is worse than no note — the server omits the field once a call has expired
 * unanswered, so this covers the case where the countdown ran out with the screen open.
 * An ACCEPTED call outlives its countdown on purpose: the window is for deciding, and
 * dropping the note at 00:00 would strand somebody mid-conversation with no way back.
 *
 * The pixel pager this replaced also had a 무시 button. It is gone: that card occupied the
 * top of the screen and had to be dismissible, and this is one taped line in a page that
 * scrolls past it.
 */
/** 오늘의 근무 브리핑 — the day's three tasks, each a checkable door. Review and curriculum
 *  are checked from the server; the phrase task is checked from the device (lib/dailyBrief).
 *  n/3 counter, struck through when done, a line of praise at 3/3. */
function TodayBrief({ home, phraseDone, onReview, onContinue, onPhrase }: {
  home: Home;
  phraseDone: boolean;
  onReview: () => void;
  onContinue: () => void;
  onPhrase: () => void;
}) {
  const t = useT();
  const b = home.brief;
  const items = [
    { key: 'review', label: t('home.briefReview', { n: b?.reviewCount ?? 0, target: b?.reviewTarget ?? 5 }), done: !!b?.reviewDone, onPress: onReview },
    { key: 'curriculum', label: t('home.briefCurriculum'), done: !!b?.curriculumDone, onPress: onContinue, hidden: !home.todayOne },
    { key: 'phrase', label: t('home.briefPhrase'), done: phraseDone, onPress: onPhrase, hidden: !home.phrase },
  ].filter((it) => !it.hidden);
  const doneCount = items.filter((it) => it.done).length;
  const allDone = items.length > 0 && doneCount === items.length;
  return (
    <NbPaper rot={0.4} style={{ marginTop: 16, paddingVertical: 13, paddingHorizontal: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={{ fontFamily: nbFonts.bodyBold, fontSize: 11, color: nb.blue, letterSpacing: 1 }}>{t('home.briefTitle')}</Text>
        <Text style={nbText.hand(15, nb.soft)}>{doneCount}/{items.length}</Text>
      </View>
      <View style={{ marginTop: 6 }}>
        {items.map((it) => (
          <Pressable key={it.key} onPress={it.onPress} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 7 }}>
            <NbCheck done={it.done} size={18} />
            <Text style={[nbText.hand(16), { flex: 1, minWidth: 0, textDecorationLine: it.done ? 'line-through' : 'none', color: it.done ? nb.soft : nb.ink }]}>{it.label}</Text>
            {!it.done && <NbIcon name="chevronRight" size={13} color={nb.soft} />}
          </Pressable>
        ))}
      </View>
      {allDone && <Text style={[nbText.hand(14, nb.green), { marginTop: 5 }]}>{t('home.briefAllDone')}</Text>}
    </NbPaper>
  );
}

function PageNote({ page, onAnswer }: { page: HomePage; onAnswer: () => void }) {
  const t = useT();
  const expired = page.secondsLeft <= 0 && !page.accepted && !page.answered;
  if (expired) return null;
  const mins = Math.max(0, Math.round(page.secondsLeft / 60));
  const left = t('home.pageMinutes', { n: mins });
  return (
    <NbPaper
      rot={0.9}
      tape
      tapeLeft={200}
      bg="#FFF3EE"
      style={{ marginTop: 17, paddingVertical: 13, paddingHorizontal: 15, borderColor: '#EBCDBD' }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Text style={[nbText.hand(24, nb.red), { flexShrink: 0 }]}>!!</Text>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={{ fontFamily: nbFonts.bodyBold, fontSize: 13, color: nb.red }}>
            {page.answered ? t('home.pageDone') : t('home.pageNote', { left })}
          </Text>
          <Text style={[nbText.hand(16), { marginTop: 2 }]} numberOfLines={2}>
            {page.line}
            <Text style={nbText.hand(13, nb.soft)}> (+{page.bonusXp} XP)</Text>
          </Text>
        </View>
        {!page.answered && (
          <NbButton variant="danger" size="sm" rot={2} onPress={onAnswer}>
            {page.accepted ? t('home.pageResume') : t('home.pageAnswer')}
          </NbButton>
        )}
      </View>
    </NbPaper>
  );
}
