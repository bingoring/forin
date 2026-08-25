// 리뷰랩 (review lab) tab — the "speak-like-a-local" oops-note. Shows the SM-2
// cards due today (GET /me/review), each an AI correction: the original phrasing
// struck through, the natural correction highlighted, and a why-note. The learner
// self-rates recall (다시/어려움/알맞음/쉬움 → POST /me/review/{id}/grade), which
// advances the spaced-repetition schedule; graded cards leave today's queue.
// A speaker button reads the corrected line (expo-speech). 1:1 in spirit with v17 ScreenReviewLab.
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { PixelButton } from '@/components/PixelButton';
import { api, type ModelAnswerSummary, type ReviewCard, type ReviewGrade, type SpeakSummary, type SpokenSentence } from '@/api/client';
import { PixelIcon, type IconName } from '@/components/PixelIcon';
import { FIcon } from '@/components/FIcon';
import { SpeakSummaryBlock } from '@/components/speak/SpeakSummaryBlock';
import { ModelAnswerBlock } from '@/components/model/ModelAnswerBlock';
import { faceOf } from '@/data/reviewCardFace';
import { Collapsible, DisclosureChevron } from '@/components/Collapsible';
import { colors, fonts, space, type as typeScale, fs } from '@/theme/tokens';
import { t, type Translate, useLocale, useT } from '@/i18n';

const C = colors.ink;
// Keys, not t(...): evaluated once at import (see i18n/module-scope.test.ts).
const GRADES: { g: ReviewGrade; labelKey: string; bg: string; blurbKey: string; guideKey: string }[] = [
  { g: 'again', labelKey: 'lab.again', bg: '#FCA5A5', blurbKey: 'lab.againSub', guideKey: 'lab.againBody' },
  { g: 'hard', labelKey: 'lab.hard', bg: colors.peach, blurbKey: 'lab.hardSub', guideKey: 'lab.hardBody' },
  { g: 'good', labelKey: 'lab.good', bg: colors.mint, blurbKey: 'lab.goodSub', guideKey: 'lab.goodBody' },
  { g: 'easy', labelKey: 'lab.easy', bg: colors.yellow, blurbKey: 'lab.easySub', guideKey: 'lab.easyBody' },
];
// humanize the SM-2 next-interval into a friendly "next review" label.
function nextLabel(t: Translate, days: number): string {
  if (days <= 1) return t('lab.tomorrow');
  if (days < 14) return t('lab.inDays', { n: days });
  if (days < 60) return t('lab.inWeeks', { n: Math.round(days / 7) });
  return t('lab.inMonths', { n: Math.round(days / 30) });
}
// Per-topic tone for the card header strip (v17 uses a per-dept tone background).
const TONES = [colors.mint, colors.peach, colors.blue, colors.lilac, colors.yellow];
const toneOf = (tag: string) => TONES[[...tag].reduce((s, ch) => s + ch.charCodeAt(0), 0) % TONES.length];
// A topicTag like "ER · 통증 사정" → { dept: "ER", tag: "통증 사정" }.
function splitTag(t: Translate, topicTag: string): { dept: string; tag: string } {
  const parts = (topicTag || '').split('·').map((s) => s.trim());
  if (parts.length >= 2) return { dept: parts[0], tag: parts.slice(1).join(' · ') };
  return { dept: topicTag || t('lab.correctionNote'), tag: '' };
}

// The 말하기 chip's id. A sentinel rather than a real filter value — see where
// `cats` is built for why this chip navigates instead of filtering.
const SPEAK_CHIP = '__SPEAK__';
// Same sentinel treatment for 모범답안: it is in the handoff's chip row but its
// items are scenario groups, not PhraseCards, so filtering the card list to them
// would always show nothing. The chip opens the list screen instead.
const MODEL_CHIP = '__MODEL__';

export default function Lab() {
  const t = useT();
  const router = useRouter();
  const [cards, setCards] = useState<ReviewCard[]>([]);
  const [state, setState] = useState<'loading' | 'error' | 'ok'>('loading');
  const [filter, setFilter] = useState('ALL');
  const [guideOpen, setGuideOpen] = useState(false);
  const [toast, setToast] = useState<{ label: string; bg: string; blurb: string; next: string } | null>(null);
  // The 🎙 직접 말하기 연습 summary. null while unknown or unavailable — the block
  // is simply absent then, rather than drawing an empty distribution that reads
  // as "you scored nothing".
  const [speak, setSpeak] = useState<SpeakSummary | null>(null);
  // The 📄 시나리오 모범답안 summary. Same rule as `speak`: null means unknown or
  // unavailable, and the block is absent rather than drawn empty.
  const [models, setModels] = useState<ModelAnswerSummary | null>(null);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      api.reviewDue()
        .then((c) => { if (alive) { setCards(c); setState('ok'); } })
        .catch(() => { if (alive) setState('error'); });
      // Separate from the card read and deliberately not awaited with it: the
      // speaking summary failing must not turn the whole tab into the error state.
      api.speakSummary()
        .then((sum) => { if (alive) setSpeak(sum); })
        .catch(() => { /* block stays absent */ });
      api.modelAnswerSummary()
        .then((sum) => { if (alive) setModels(sum); })
        .catch(() => { /* block stays absent */ });
      return () => { alive = false; };
    }, []),
  );

  const openChip = (id: string) => {
    if (id === SPEAK_CHIP) { router.push('/speak?sort=weak'); return; }
    if (id === MODEL_CHIP) { router.push('/model-answers'); return; }
    setFilter(id);
  };

  const practiseSentence = (s: SpokenSentence) => {
    // One single template literal — expo-router's typed-routes generator matches
    // statically against one backtick expression.
    router.push(
      `/pronunciation/${encodeURIComponent(s.referenceText.slice(0, 40))}?referenceText=${encodeURIComponent(s.referenceText)}&origin=review&scenarioId=${encodeURIComponent(s.scenarioId ?? '')}`
    );
  };

  const grade = async (id: string, g: ReviewGrade) => {
    const meta = GRADES.find((x) => x.g === g)!;
    setCards((prev) => prev.filter((c) => c.id !== id)); // optimistic: leave today's queue
    let interval = 1;
    try { const r = await api.gradeReview(id, g); interval = r.intervalDays; } catch { /* best-effort; refreshes on next focus */ }
    // Confirm the grade so the card doesn't just silently disappear.
    setToast({ label: t(meta.labelKey), bg: meta.bg, blurb: t(meta.blurbKey), next: nextLabel(t, interval) });
    setTimeout(() => setToast(null), 1600);
  };

  // Category filter tabs derived from card topicTags (handoff has a FilterTab row).
  const cats = useMemo(() => {
    const counts = new Map<string, number>();
    for (const c of cards) { const d = splitTag(t, c.topicTag).dept; counts.set(d, (counts.get(d) ?? 0) + 1); }
    return [
      { id: 'ALL', label: t('board.all'), count: cards.length },
      ...Array.from(counts, ([id, count]) => ({ id, label: id, count })),
      // 말하기 is in the handoff's chip row, but unlike the others it is not a
      // filter over the card list: spoken sentences are not PhraseCards, so
      // filtering to them would always show an empty list. Tapping it opens the
      // list screen the handoff says 100+ items must live on.
      ...(speak && speak.total > 0 ? [{ id: SPEAK_CHIP, label: t('speak.blockTitle'), count: speak.total }] : []),
      ...(models && models.total > 0 ? [{ id: MODEL_CHIP, label: t('model.blockTitle'), count: models.total }] : []),
    ];
  }, [cards, speak, models]);
  const shown = filter === 'ALL' ? cards : cards.filter((c) => splitTag(t, c.topicTag).dept === filter);

  if (state !== 'ok') {
    return (
      <View style={{ flex: 1, backgroundColor: colors.paper, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 }}>
        {state === 'loading' ? <ActivityIndicator color={C} /> : <Text style={{ fontFamily: fonts.body, fontSize: typeScale.body, color: colors.textSoft, textAlign: 'center' }}>리뷰 카드를 불러오지 못했어요. (로그인·서버 확인)</Text>}
      </View>
    );
  }

  const mastered = cards.filter((c) => c.masteryPips >= 3).length;

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <ScrollView contentContainerStyle={{ padding: space.lg, paddingTop: 56, paddingBottom: 40, gap: space.md }}>
        <Text style={{ fontFamily: fonts.heading, fontSize: typeScale.screenHeading, color: C }}>리뷰랩 · 오답노트</Text>

        {/* hero */}
        <Shadowed offset={4}>
          <View style={{ backgroundColor: colors.lilac, borderWidth: 3, borderColor: C, padding: 14 }}>
            <Text style={{ fontFamily: fonts.heading, fontSize: fs(10), color: C, opacity: 0.7 }}>오늘의 복습</Text>
            {cards.length > 0 ? (
              <Text style={{ fontFamily: fonts.heading, fontSize: fs(18), color: C, marginTop: 6, lineHeight: 25 }}>
                <Text style={{ backgroundColor: '#fff' }}> {cards.length}개 카드 </Text> 복습할 시간이에요
              </Text>
            ) : (
              <Text style={{ fontFamily: fonts.heading, fontSize: fs(18), color: C, marginTop: 6, lineHeight: 25 }}>오늘 복습할 카드가 없어요</Text>
            )}
            <Text style={{ fontFamily: fonts.body, fontSize: fs(11), color: colors.text, marginTop: 8, lineHeight: 16 }}>
              AI가 교정한 문장을 <Text style={{ fontFamily: fonts.heading }}>t('lab.likeALocal')</Text> 카드로 바꿨어요. 기억이 흐려지기 전에 한 번 더 말해볼까요?
            </Text>
            {cards.length > 0 && (
              <View style={{ marginTop: 12 }}>
                <PixelButton icon="play" label={t('lab.startReview', { n: cards.length })} bg={colors.yellow} shadowColor={colors.yellowShadow} full onPress={() => router.push('/review')} />
              </View>
            )}
            <View style={{ position: 'absolute', top: -10, right: -4, transform: [{ rotate: '10deg' }] }}>
              <FIcon name="doc" size={26} />
            </View>
          </View>
        </Shadowed>

        {/* 복습 등급 안내 — explains 다시/어려움/알맞음/쉬움 (collapsible reference) */}
        <Shadowed offset={3}>
          <View style={{ backgroundColor: '#fff', borderWidth: 2.5, borderColor: C }}>
            <Pressable onPress={() => setGuideOpen((v) => !v)} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10, paddingHorizontal: 12 }}>
              <Text style={{ flex: 1, fontFamily: fonts.heading, fontSize: fs(12), color: C }}>복습 등급이 뭔가요?</Text>
              <DisclosureChevron open={guideOpen} color={colors.textSoft} size={14} sw={1.8} />
            </Pressable>
            <Collapsible open={guideOpen} style={{ borderTopWidth: guideOpen ? 2 : 0, borderTopColor: C }}>
              <View style={{ paddingHorizontal: 12, paddingBottom: 12, gap: 8 }}>
                <Text style={{ fontFamily: fonts.body, fontSize: fs(11), color: colors.text, lineHeight: 16, marginTop: 10 }}>
                  카드를 확인한 뒤 <Text style={{ fontFamily: fonts.heading }}>얼마나 잘 기억했는지</Text> 스스로 평가하면, 그 결과에 따라 <Text style={{ fontFamily: fonts.heading }}>다음 복습 시점</Text>이 자동으로 정해져요. 잘 외운 카드일수록 뜸하게, 어려운 카드일수록 자주 나타납니다.
                </Text>
                {GRADES.map(({ g, labelKey, bg, guideKey }) => (
                  <View key={g} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
                    <View style={{ backgroundColor: bg, borderWidth: 1.5, borderColor: C, paddingVertical: 2, paddingHorizontal: 7, minWidth: 52, alignItems: 'center' }}>
                      <Text style={{ fontFamily: fonts.heading, fontSize: fs(10), color: C }}>{t(labelKey)}</Text>
                    </View>
                    <Text style={{ flex: 1, fontFamily: fonts.body, fontSize: fs(10.5), color: colors.text, lineHeight: 15 }}>{t(guideKey)}</Text>
                  </View>
                ))}
                <Text style={{ fontFamily: fonts.body, fontSize: fs(10), color: colors.textSoft, lineHeight: 15, marginTop: 2 }}>
                  {t('lab.pipsHelp', { mastered: t('lab.mastered') })}
                </Text>
              </View>
            </Collapsible>
          </View>
        </Shadowed>

        {/* mini stats */}
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <MiniStat label={t('lab.savedCards')} value={cards.length} color={colors.mint} />
          <MiniStat label={t('lab.mastered')} value={mastered} color={colors.yellow} />
          <MiniStat label={t('lab.dueCards')} value={cards.length} color="#FCA5A5" />
        </View>

        {/* 🎙 직접 말하기 연습 — the summary half of the handoff's pair of blocks.
            Shown only once the player has actually spoken something. */}
        {/* Rendered as soon as the summary is KNOWN, empty or not — the handoff has
            these two blocks on the page, and hiding them until the player has already
            spoken meant a new user never learned the feature existed. `null` still
            means unknown (the read failed), and then the block stays absent. */}
        {speak && (
          <SpeakSummaryBlock
            summary={speak}
            onOpenAll={(sort: 'weak' | 'recent') => router.push(sort === 'weak' ? '/speak?sort=weak' : '/speak?sort=recent')}
            onPractise={practiseSentence}
          />
        )}

        {/* 📄 시나리오 모범답안 — the other half of the handoff's pair of blocks. */}
        {models && (
          <ModelAnswerBlock summary={models} onOpenAll={() => router.push('/model-answers')} />
        )}

        {/* category filter */}
        {cats.length > 1 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6, paddingVertical: 2 }}>
            {cats.map((c) => {
              const active = filter === c.id;
              const catColor = c.id === 'ALL' ? C : toneOf(c.id);
              return (
                <Pressable key={c.id} onPress={() => openChip(c.id)}>
                  <Shadowed offset={active ? 2 : 1.5} shadowColor={active ? C : C + '66'}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: active ? catColor : '#fff', borderWidth: 2.5, borderColor: C, paddingVertical: 5, paddingHorizontal: 9 }}>
                      <Text style={{ fontFamily: fonts.heading, fontSize: fs(11), color: active ? C : C }}>{c.label}</Text>
                      <View style={{ backgroundColor: active ? '#fff' : catColor, borderWidth: 1.5, borderColor: C, paddingHorizontal: 4, minWidth: 14, alignItems: 'center' }}>
                        <Text style={{ fontFamily: fonts.heading, fontSize: fs(9), color: C }}>{c.count}</Text>
                      </View>
                    </View>
                  </Shadowed>
                </Pressable>
              );
            })}
          </ScrollView>
        )}

        {/* cards */}
        {shown.length === 0 ? (
          <View style={{ alignItems: 'center', paddingVertical: 40, gap: 8 }}>
            <PixelIcon name="note" color={colors.textFaint} size={40} sw={1.5} />
            <Text style={{ fontFamily: fonts.body, fontSize: fs(12), color: colors.textSoft, textAlign: 'center', lineHeight: 18 }}>모든 복습을 마쳤어요!{'\n'}시나리오 대화에서 새 교정 카드가 쌓입니다.</Text>
          </View>
        ) : (
          shown.map((c) => <PhraseCard key={c.id} card={c} onGrade={grade} />)
        )}
      </ScrollView>

      {/* grade confirmation — so cards don't just silently disappear from the list */}
      {toast && (
        <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, bottom: 24, alignItems: 'center', paddingHorizontal: 18 }}>
          <Shadowed offset={3}>
            <View style={{ backgroundColor: '#fff', borderWidth: 2.5, borderColor: C, paddingVertical: 11, paddingHorizontal: 16, minWidth: 250, alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={{ backgroundColor: toast.bg, borderWidth: 2, borderColor: C, paddingVertical: 2, paddingHorizontal: 8 }}>
                  <Text style={{ fontFamily: fonts.heading, fontSize: fs(12), color: C }}>{toast.label}</Text>
                </View>
                <Text style={{ fontFamily: fonts.heading, fontSize: fs(13), color: C }}>{toast.next}</Text>
              </View>
              <Text style={{ fontFamily: fonts.body, fontSize: fs(11), color: colors.textSoft, marginTop: 6, textAlign: 'center' }}>{toast.blurb}</Text>
            </View>
          </Shadowed>
        </View>
      )}
    </View>
  );
}

function PhraseCard({ card, onGrade }: { card: ReviewCard; onGrade: (id: string, g: ReviewGrade) => void }) {
  const t = useT();
  const router = useRouter();
  const speak = () => Speech.speak(card.back, { language: 'en-US', rate: 0.92 });
  // Task 10 fix: SoT 04_SCREENS.md:397 describes THIS card (the review-lab
  // list's PhraseCard) as carrying "🎤 따라 말하기" — Task 9 wired a mic action
  // onto review.tsx's ContextCard instead (a different screen: the one-card-
  // at-a-time SM-2 grading session), which left the literal PhraseCard named
  // in the spec with only its 🔊 button. Same pattern as review.tsx's
  // practicePronunciation: referenceText is the CORRECTED line (card.back),
  // origin=review + reviewCardId links the attempt back to this card, and
  // Speech.stop() first so TTS doesn't keep playing under the new screen.
  const practicePronunciation = () => {
    Speech.stop();
    router.push(
      `/pronunciation/${encodeURIComponent(card.back.slice(0, 40))}?referenceText=${encodeURIComponent(card.back)}&origin=review&reviewCardId=${encodeURIComponent(card.id)}&ctx=${encodeURIComponent(card.context?.title || card.topicTag || '')}&step=${encodeURIComponent(t('lab.likeALocal'))}`
    );
  };
  const { dept, tag } = splitTag(t, card.topicTag);
  const face = faceOf(card.source);
  const [showCtx, setShowCtx] = useState(false);
  const ctx = card.context;
  const hasCtx = !!ctx && (!!ctx.title || !!ctx.situation || !!ctx.npc);
  return (
    <Shadowed offset={4}>
      <View style={{ backgroundColor: '#fff', borderWidth: 3, borderColor: C }}>
        {/* header: per-topic tone + dept label + 복습 badge + tag chip */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 7, paddingHorizontal: 10, backgroundColor: toneOf(card.topicTag), borderBottomWidth: 2.5, borderBottomColor: C }}>
          <Text style={{ flex: 1, fontFamily: fonts.heading, fontSize: fs(10), color: C }}>{dept}</Text>
          <View style={{ backgroundColor: '#EF4444', borderWidth: 1.5, borderColor: C, paddingHorizontal: 5 }}>
            <Text style={{ fontFamily: fonts.heading, fontSize: fs(8), color: '#fff' }}>복습</Text>
          </View>
          {!!tag && (
            <View style={{ backgroundColor: '#fff', borderWidth: 1.5, borderColor: C, paddingHorizontal: 5 }}>
              <Text style={{ fontFamily: fonts.heading, fontSize: fs(8), color: C }}>{tag}</Text>
            </View>
          )}
        </View>

        <View style={{ paddingVertical: 10, paddingHorizontal: 12 }}>
          {/* the front — struck out only when it is something that WAS said. See
              data/reviewCardFace: a graded scenario also files "you could have said this",
              and drawing one of those behind a red ✕ claims the learner said a sentence
              they never said. */}
          <View style={{ flexDirection: 'row', gap: 6, alignItems: 'flex-start' }}>
            {/* Ink for both, so both badges resolve to the v23 artwork. The red used
                to be passed in; FIcon's `cross` is already drawn red and `hint` yellow,
                so the colour prop was duplicating what the artwork encodes — and while
                it was there, a correction badge drew the line icon and a suggestion
                badge the pixel one, side by side in the same list. */}
            <Badge icon={face.badgeIcon} bg={face.correction ? '#FEE2E2' : colors.yellow} color={C} />
            <Text
              style={{
                flex: 1,
                fontFamily: fonts.body,
                fontSize: fs(12),
                color: face.correction ? colors.textFaint : C,
                textDecorationLine: face.strike ? 'line-through' : 'none',
                lineHeight: 17,
              }}
            >
              {card.front}
            </Text>
          </View>
          {/* good */}
          <View style={{ flexDirection: 'row', gap: 6, alignItems: 'flex-start', marginTop: 8 }}>
            <Badge text="✓" bg={colors.mint} color={C} />
            <Text style={{ flex: 1, fontFamily: fonts.body, fontSize: fs(13), color: C, lineHeight: 18 }}><Text style={{ backgroundColor: colors.mint }}>{card.back}</Text></Text>
            <Pressable onPress={speak} hitSlop={8}><FIcon name="speaker" size={16} /></Pressable>
            <Pressable onPress={practicePronunciation} hitSlop={8}><FIcon name="mic" size={16} /></Pressable>
          </View>

          {/* note */}
          {!!card.note && (
            <View style={{ marginTop: 10, backgroundColor: colors.paper, borderWidth: 1.5, borderColor: '#2A252255', borderStyle: 'dashed', paddingVertical: 6, paddingHorizontal: 8 }}>
              <Text style={{ fontFamily: fonts.body, fontSize: fs(10), color: colors.text, lineHeight: 15 }}><Text style={{ fontFamily: fonts.heading, color: C }}>왜? </Text>{card.note}</Text>
            </View>
          )}

          {/* 맥락: which situation / dialogue this correction came from (collapsible) */}
          {hasCtx && (
            <View style={{ marginTop: 10 }}>
              <Pressable onPress={() => setShowCtx((v) => !v)} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <View style={{ backgroundColor: colors.lilac, borderWidth: 1.5, borderColor: C, paddingVertical: 2, paddingHorizontal: 6 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                    <Text style={{ fontFamily: fonts.heading, fontSize: fs(9), color: C }}>맥락</Text>
                    <DisclosureChevron open={showCtx} color={C} size={11} sw={1.8} />
                  </View>
                </View>
                {!showCtx && !!ctx?.title && (
                  <Text numberOfLines={1} style={{ flex: 1, fontFamily: fonts.body, fontSize: fs(10), color: colors.textSoft }}>{ctx.title}</Text>
                )}
              </Pressable>
              <Collapsible open={showCtx}>
                <View style={{ marginTop: 8, backgroundColor: colors.paper, borderWidth: 1.5, borderColor: '#2A252255', borderStyle: 'dashed', paddingVertical: 8, paddingHorizontal: 10 }}>
                  {!!ctx?.title && <Text style={{ fontFamily: fonts.heading, fontSize: fs(11), color: C, marginBottom: 4 }}>{ctx.title}</Text>}
                  {!!ctx?.situation && <Text style={{ fontFamily: fonts.body, fontSize: fs(10), color: colors.text, lineHeight: 15 }}>{ctx.situation}</Text>}
                  {!!ctx?.npc && (
                    <View style={{ marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#2A252233' }}>
                      <Text style={{ fontFamily: fonts.heading, fontSize: fs(8), color: colors.textSoft, marginBottom: 2 }}>상대가 이렇게 말했고</Text>
                      <Text style={{ fontFamily: fonts.body, fontSize: fs(11), color: colors.text, lineHeight: 16 }}>{ctx.npc}</Text>
                      <Text style={{ fontFamily: fonts.body, fontSize: fs(10), color: colors.textSoft, lineHeight: 15, marginTop: 3 }}>→ 여기에 답하며 한 말이에요.</Text>
                    </View>
                  )}
                </View>
              </Collapsible>
            </View>
          )}

          {/* mastery pips */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 10 }}>
            <Text style={{ fontFamily: fonts.heading, fontSize: fs(9), color: colors.textSoft, marginRight: 2 }}>숙련</Text>
            {[0, 1, 2].map((i) => (
              <View key={i} style={{ width: 9, height: 9, borderWidth: 1.5, borderColor: C, backgroundColor: i < card.masteryPips ? colors.mint : '#fff' }} />
            ))}
          </View>

          {/* grade buttons */}
          <View style={{ flexDirection: 'row', gap: 6, marginTop: 12 }}>
            {GRADES.map(({ g, labelKey, bg }) => (
              <View key={g} style={{ flex: 1 }}>
                <PixelButton label={t(labelKey)} bg={bg} shadowColor={C} offset={2} fontSize={11} borderWidth={2} paddingV={7} onPress={() => onGrade(card.id, g)} full />
              </View>
            ))}
          </View>
        </View>
      </View>
    </Shadowed>
  );
}

function Badge({ text, icon, bg, color }: { text?: string; icon?: IconName; bg: string; color: string }) {
  return (
    <View style={{ backgroundColor: bg, borderWidth: 1.5, borderColor: C, paddingHorizontal: 4, paddingVertical: icon ? 2 : 0, marginTop: 1 }}>
      {icon ? <PixelIcon name={icon} color={color} size={10} sw={2} /> : <Text style={{ fontFamily: fonts.heading, fontSize: fs(9), color }}>{text}</Text>}
    </View>
  );
}

function MiniStat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <Shadowed offset={2} shadowColor={C + '66'} style={{ flex: 1 }}>
      <View style={{ backgroundColor: '#fff', borderWidth: 2.5, borderColor: C, paddingVertical: 10, alignItems: 'center' }}>
        <View style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 4, backgroundColor: color }} />
        <Text style={{ fontFamily: fonts.heading, fontSize: fs(22), color: C }}>{value}</Text>
        <Text style={{ fontFamily: fonts.body, fontSize: fs(9), color: colors.textSoft, marginTop: 2 }}>{label}</Text>
      </View>
    </Shadowed>
  );
}

function Shadowed({ children, offset = 4, shadowColor = C, style }: { children: React.ReactNode; offset?: number; shadowColor?: string; style?: object }) {
  return (
    <View style={style}>
      <View style={{ position: 'absolute', left: offset, top: offset, right: -offset, bottom: -offset, backgroundColor: shadowColor }} />
      {children}
    </View>
  );
}
