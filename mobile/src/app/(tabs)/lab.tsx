// 리뷰랩 (review lab) tab — the "speak-like-a-local" oops-note. Shows the SM-2
// cards due today (GET /me/review), each an AI correction: the original phrasing
// struck through, the natural correction highlighted, and a why-note. The learner
// self-rates recall (다시/어려움/알맞음/쉬움 → POST /me/review/{id}/grade), which
// advances the spaced-repetition schedule; graded cards leave today's queue.
// A speaker button reads the corrected line (expo-speech). 1:1 in spirit with v17 ScreenReviewLab.
// v49 (handoff v48-lab): the screen speaks in the shared signal kit — GoBar hero, Pill counts,
// Chev-folded context, stamped mastery pips, faces for the four grades, NewDot on the shelf.
import { useCallback, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Animated, FlatList, Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { api, type ModelAnswerSummary, type ReviewCard, type ReviewGrade, type SpeakSummary, type SpokenSentence } from '@/api/client';
import { FIcon, type FIconName } from '@/components/FIcon';
import { SpeakList } from '@/components/speak/SpeakList';
import { ModelAnswerList } from '@/components/model/ModelAnswerList';
import { faceOf } from '@/data/reviewCardFace';
import { playSfx } from '@/lib/sfx';
import { NbIcon } from '@/components/nb/NbIcon';
import { NbChip, NbDoubleRing, NbIndexTabs, NbMark, NbMemo, NbPaper, NbTag, nbText } from '@/components/nb/NbUI';
import { Chev, GoBar, Pill, V48Pop } from '@/components/nb/V48';
import { CSS_EASE, stampSpec, useNbMotion, useReduceMotion, useV48Press } from '@/components/nb/nbMotion';
import { GradeRow } from '@/components/lab/GradeRow';
import { MaterialShelf } from '@/components/lab/MaterialShelf';
import { RULE_COLOR, RULE_H, TOP_INSET, nb, nbFonts } from '@/theme/nb';
import { space, type as typeScale } from '@/theme/tokens';
import { t, type Translate, useLocale, useT } from '@/i18n';
import { usePronunciationEnabled } from '@/data/pronunciationFlag';

const C = nb.ink;
// Keys, not t(...): evaluated once at import (see i18n/module-scope.test.ts).
// Only the toast's label + tint live here now; the four buttons themselves (a face + the
// interval, no words) are components/lab/GradeRow, shared with the review session.
const GRADES: { g: ReviewGrade; labelKey: string; bg: string }[] = [
  { g: 'again', labelKey: 'lab.again', bg: '#FCA5A5' },
  { g: 'hard', labelKey: 'lab.hard', bg: '#FFF3EE' },
  { g: 'good', labelKey: 'lab.good', bg: 'rgba(168,217,151,.4)' },
  { g: 'easy', labelKey: 'lab.easy', bg: 'rgba(249,227,123,.5)' },
];
// humanize the SM-2 next-interval into a friendly "next review" label.
function nextLabel(t: Translate, days: number): string {
  if (days <= 1) return t('lab.tomorrow');
  if (days < 14) return t('lab.inDays', { n: days });
  if (days < 60) return t('lab.inWeeks', { n: Math.round(days / 7) });
  return t('lab.inMonths', { n: Math.round(days / 30) });
}
// Per-topic tone for the card header strip (v17 uses a per-dept tone background).
const TONES = ['rgba(168,217,151,.4)', '#FFF3EE', nb.blue, 'rgba(195,177,232,.35)', 'rgba(249,227,123,.5)'];
const toneOf = (tag: string) => TONES[[...tag].reduce((s, ch) => s + ch.charCodeAt(0), 0) % TONES.length];
// A topicTag like "ER · 통증 사정" → { dept: "ER", tag: "통증 사정" }. May be empty:
// nothing writes topic_tag today (both card-creation sites leave it blank), which is
// why the filter row used to collapse to a single "교정 노트" chip — it was built from
// a field with no values in it. Kept, rather than deleted, because the column is real
// and a card that DOES carry one should still label itself from it.
function splitTag(topicTag: string): { dept: string; tag: string } {
  const parts = (topicTag || '').split('·').map((s) => s.trim()).filter(Boolean);
  if (parts.length >= 2) return { dept: parts[0], tag: parts.slice(1).join(' · ') };
  return { dept: '', tag: '' };
}

/** The department a card came from — "SURG · WARD" → "SURG".
 *
 *  From `context.dept`, which BOTH card sources fill in from the scenario briefing
 *  (engine.go files corrections, grading.go files suggestions). This is the axis that
 *  actually has values in it. */
function deptOf(card: ReviewCard): string {
  const fromCtx = (card.context?.dept || '').split('·')[0].trim();
  return fromCtx || splitTag(card.topicTag).dept;
}

/** What kind of card this is — the one other thing that genuinely varies.
 *
 *  `correction` is something the learner said and got fixed; `suggestion` is the
 *  end-of-scenario "you could have said this", which was never said at all. The card
 *  already draws them differently (✕ vs 💡, struck through vs not); this makes the
 *  same distinction filterable. */
type Kind = 'correction' | 'suggestion';
function kindOf(card: ReviewCard): Kind {
  return faceOf(card.source).correction ? 'correction' : 'suggestion';
}
const KIND_LABEL: Record<Kind, string> = { correction: 'lab.kindCorrection', suggestion: 'lab.kindSuggestion' };
const KIND_TONE: Record<Kind, string> = { correction: '#FFF3EE', suggestion: 'rgba(249,227,123,.5)' };

// The three halves of this tab, per v26: 교정 노트 / 말하기 / 모범답안.
//
// These used to be sentinel chips in the category row (`__SPEAK__`, `__MODEL__`)
// sitting beside real filters like "ER" and "통증" — two entries in a filter row
// that navigated away instead of filtering, because spoken sentences and scenario
// groups are not PhraseCards and filtering the card list to them always showed
// nothing. v26 makes them what they always were: sections, not filters. The
// category chips now filter only the thing they can filter, and each section's
// content lives under its own tab rather than stacked on one scroll.
type Section = 'notes' | 'speak' | 'models';
/** How far a tab's cap travels on press, and how deep its shadow is. Three rather than
 *  PixelButton's four: a third of the screen is a small cap, and four reads as a lurch
 *  on something this size. */
const TAB_PRESS_OFFSET = 3;
/** Space between the caps. MUST exceed TAB_PRESS_OFFSET: the shadow already occupies
 *  that much to the right of each cap, and a pressed cap lands exactly on its shadow —
 *  with a gap of 3 or less, pressing 교정 노트 would touch 말하기. */
const TAB_GAP = 6;
const SECTIONS: { id: Section; icon: FIconName; labelKey: string }[] = [
  { id: 'notes', icon: 'pen', labelKey: 'lab.tabNotes' },
  { id: 'speak', icon: 'mic', labelKey: 'lab.tabSpeak' },
  { id: 'models', icon: 'doc', labelKey: 'lab.tabModels' },
];

export default function Lab() {
  const t = useT();
  const router = useRouter();
  const [cards, setCards] = useState<ReviewCard[]>([]);
  // The WHOLE deck's counts, from the server (the due list is capped and due-only, so it can
  // answer neither). undefined = the server did not say → the pills are not drawn at all
  // rather than drawn with the due list's length, which is what this used to print as "saved".
  const [deck, setDeck] = useState<{ saved?: number; mastered?: number }>({});
  const [state, setState] = useState<'loading' | 'error' | 'ok'>('loading');
  const [filter, setFilter] = useState('ALL');
  const [section, setSection] = useState<Section>('notes');
  // Which third is under a finger right now. Held here rather than in each tab so
  // the row cannot end up with two faces down at once.
  const [pressedTab, setPressedTab] = useState<Section | null>(null);
  const [toast, setToast] = useState<{ label: string; bg: string; next: string } | null>(null);
  // The 🎙 직접 말하기 연습 summary. null while unknown or unavailable — the block
  // is simply absent then, rather than drawing an empty distribution that reads
  // as "you scored nothing".
  const [speak, setSpeak] = useState<SpeakSummary | null>(null);
  // The 📄 시나리오 모범답안 summary. Same rule as `speak`: null means unknown or
  // unavailable, and the block is absent rather than drawn empty.
  const [models, setModels] = useState<ModelAnswerSummary | null>(null);
  // Separate from `null` on purpose: absent-because-loading and absent-because-broken
  // look identical on screen otherwise, and that ambiguity is what made "the block
  // isn't there" impossible to diagnose without reading the server logs.
  const [speakFailed, setSpeakFailed] = useState(false);
  const [modelsFailed, setModelsFailed] = useState(false);
  // The model-answer situation names are localized server-side → reload on a language change.
  const locale = useLocale();

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      api.reviewOverview()
        .then((o) => { if (alive) { setCards(o.cards); setDeck({ saved: o.saved, mastered: o.mastered }); setState('ok'); } })
        .catch(() => { if (alive) setState('error'); });
      // Separate from the card read and deliberately not awaited with it: the
      // speaking summary failing must not turn the whole tab into the error state.
      // A failed read is reported, not swallowed. Swallowing it made "the request
      // failed" and "you have nothing yet" the same blank space — which is exactly
      // the state that had to be debugged from the outside when the block did not
      // appear. An empty summary is a legitimate answer and renders its own hint;
      // `null` now means only "still loading".
      api.speakSummary()
        .then((sum) => { if (alive) setSpeak(sum); })
        .catch(() => { if (alive) setSpeakFailed(true); });
      api.modelAnswerSummary()
        .then((sum) => { if (alive) setModels(sum); })
        .catch(() => { if (alive) setModelsFailed(true); });
      return () => { alive = false; };
    }, [locale]),
  );

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
    setToast({ label: t(meta.labelKey), bg: meta.bg, next: nextLabel(t, interval) });
    setTimeout(() => setToast(null), 1600);
  };

  // The filter row, over the two axes a card actually varies on: which department it
  // came from, and whether it is a correction or a suggestion.
  //
  // A chip is only offered when it SPLITS the list — `0 < count < cards.length`. A chip
  // matching every card is what 전체 already is, and a chip matching none is a dead end;
  // both were on screen before, and between them the row had nothing to filter. Ids are
  // namespaced (`dept:ER`, `kind:correction`) because the two axes share one row and one
  // selection: last tap wins, like the handoff's row.
  const cats = useMemo(() => {
    const byDept = new Map<string, number>();
    const byKind = new Map<Kind, number>();
    for (const c of cards) {
      const d = deptOf(c);
      if (d) byDept.set(d, (byDept.get(d) ?? 0) + 1);
      const k = kindOf(c);
      byKind.set(k, (byKind.get(k) ?? 0) + 1);
    }
    const splits = (count: number) => count > 0 && count < cards.length;
    return [
      // mint, not ink — the chip's own text and its count are both drawn in ink, so a
      // tone of ink paints the label out when the chip is active and the count out when
      // it is not. The handoff's cats list gives 전체 T.mint for the same reason.
      { id: 'ALL', label: t('board.all'), count: cards.length, tone: 'rgba(168,217,151,.4)' },
      ...Array.from(byKind)
        .filter(([, count]) => splits(count))
        .map(([k, count]) => ({ id: `kind:${k}`, label: t(KIND_LABEL[k]), count, tone: KIND_TONE[k] })),
      ...Array.from(byDept)
        .filter(([, count]) => splits(count))
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .map(([d, count]) => ({ id: `dept:${d}`, label: d, count, tone: toneOf(d) })),
    ];
  }, [cards, t]);
  const shown = useMemo(() => {
    // A filter left over from a previous set of cards (its chip is no longer offered)
    // falls back to 전체 rather than showing an empty list with nothing highlighted.
    if (filter === 'ALL' || !cats.some((c) => c.id === filter)) return cards;
    const [axis, value] = filter.split(':');
    if (axis === 'kind') return cards.filter((c) => kindOf(c) === value);
    if (axis === 'dept') return cards.filter((c) => deptOf(c) === value);
    return cards;
  }, [cards, cats, filter]);

  if (state !== 'ok') {
    return (
      <View style={{ flex: 1, backgroundColor: nb.paper, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 }}>
        {state === 'loading' ? <ActivityIndicator color={C} /> : <Text style={[nbText.hand(17), { textAlign: 'center' }]}>{t('lab.loadFailed')}</Text>}
      </View>
    );
  }

  // The notes list is VIRTUALIZED, and that is a performance fix, not a style choice.
  //
  // Fifty due cards is an ordinary week of practice, and the screen mounted all of them:
  // 5,431 host nodes, because each card carries a Shadowed frame, a Collapsible (whose
  // children are always mounted so their height can be measured), four PixelButtons and
  // several FIcons. Opening the "복습 등급이 뭔가요?" disclosure then animates a HEIGHT,
  // which the native driver cannot touch — so every frame of that animation re-laid out
  // the entire scroll content. That is the lag, and memoizing does not touch it: the
  // work is layout, not render.
  //
  // A FlatList mounts a window of rows instead. The header — title, tabs, hero, grade
  // guide, mini stats, filter chips — rides along as ListHeaderComponent so it still
  // scrolls with the list rather than becoming a fixed bar the design never asked for.
  // 헤더 보조 카운트('오늘 복습할 것 n')는 v48에서 지웠다 — 같은 수가 히어로 도장과 탭에 있다.
  const title = (
    <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
      <Text style={nbText.hand(30)}>{t('lab.nbTitle')}</Text>
      <View style={{ flex: 1 }} />
    </View>
  );
  const tabs = (
    <SectionTabs
      section={section}
      onSelect={setSection}
      cardCount={cards.length}
      speak={speak}
      models={models}
    />
  );

  return (
    <View style={{ flex: 1, backgroundColor: nb.cream }}>
      <Rules />
      {section === 'notes' ? (
        <FlatList
          data={shown}
          keyExtractor={(c) => c.id}
          ListHeaderComponent={
            <View style={{ gap: space.md }}>
              {title}
              {tabs}
              {/* 자료 선반(v48) — 인계 노트·슬랭, 교정 노트 탭에서만. */}
              <MaterialShelf />
              {/* 오늘의 복습 — 홈 '이어서' 바 모양(화면의 주 행동 하나). 왼쪽은 오늘 장수를 찍은 빨간
                  도장이고, 바 전체가 시작이다. 대기 카드가 없으면 바 대신 한 줄만. */}
              {cards.length > 0 ? (
                <GoBar
                  testID="lab-hero"
                  accessibilityLabel={t('common.start')}
                  onPress={() => router.push('/review')}
                  left={<HeroStamp top={t('lab.today')} bottom={t('lab.nCards', { n: cards.length })} />}
                >
                  <Text style={{ fontFamily: nbFonts.monoBold, fontSize: 13, color: 'rgba(255,253,244,.75)' }}>
                    {t('lab.estMin', { n: Math.max(1, Math.round(cards.length * 0.8)) })}
                  </Text>
                </GoBar>
              ) : (
                <NbPaper rot={-0.6} style={{ paddingVertical: 14, paddingHorizontal: 15 }}>
                  <Text style={[nbText.hand(19), { lineHeight: 22 }]}>{t('lab.nothingDue')}</Text>
                </NbPaper>
              )}

              {/* 숫자 둘, 알약으로 — 저장(덱 전체) · 마스터(3점). 서버가 총수를 주지 않으면 그리지 않는다. */}
              {(deck.saved !== undefined || deck.mastered !== undefined) && (
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {deck.saved !== undefined && (
                    <View accessible accessibilityLabel={`${t('lab.savedCards')} ${deck.saved}`}><Pill icon="lab" n={deck.saved} /></View>
                  )}
                  {deck.mastered !== undefined && (
                    <View accessible accessibilityLabel={`${t('lab.mastered')} ${deck.mastered}`}><Pill icon="star" n={deck.mastered} /></View>
                  )}
                </View>
              )}

              {/* category filter */}
              {cats.length > 1 && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6, paddingVertical: 2 }}>
                  {cats.map((c) => {
                    const active = filter === c.id;
                    return (
                      <NbChip key={c.id} on={active} rot={active ? -0.8 : 0.8} onPress={() => setFilter(c.id)}>
                        {`${c.label} ${c.count}`}
                      </NbChip>
                    );
                  })}
                </ScrollView>
              )}
            </View>
          }
          // The old ScrollView spaced everything with one `gap`. A FlatList's rows are
          // separate children, so the two gaps it used to cover are set explicitly.
          ListHeaderComponentStyle={{ marginBottom: space.md }}
          ItemSeparatorComponent={() => <View style={{ height: space.md }} />}
          renderItem={({ item, index }) => <PhraseCard card={item} onGrade={grade} rot={index % 2 ? 0.5 : -0.5} />}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', paddingVertical: 40, gap: 8 }}>
              <NbIcon name="pencil" size={34} color={nb.soft} />
              <Text style={[nbText.hand(16, nb.soft), { textAlign: 'center' }]}>{t('lab.allDone')}</Text>
            </View>
          }
          // The same left/top as the speak and model tabs' lists (paddingHorizontal 20,
          // paddingTop TOP_INSET=52). They were 16 and 56 here, so the shared 복습 노트
          // title and its tabs jumped ~4px sideways and up every time the section changed
          // ("교정노트 ↔ 말하기 ↔ 모범답안을 오가면 미세하게 왔다갔다"). One inset, one place.
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: TOP_INSET, paddingBottom: 40 }}
          // A card is tall — four grade buttons and a note — so a small window covers
          // the screen with room to spare and the first paint stays cheap.
          initialNumToRender={3}
          maxToRenderPerBatch={3}
          windowSize={5}
        />
      ) : section === 'speak' ? (
        // The list itself, not a summary with a "전체 ›" link into it. The tab's own
        // header (sort, department chips, count) and the lab's title + tabs ride at the
        // top of the same scroll — see SpeakList's `embedded`.
        <SpeakList embedded above={<View style={{ gap: space.md, marginBottom: space.md }}>{title}{tabs}</View>} />
      ) : (
        <ModelAnswerList embedded above={<View style={{ gap: space.md, marginBottom: space.md }}>{title}{tabs}</View>} />
      )}

      {/* grade confirmation — so cards don't just silently disappear from the list */}
      {toast && (
        <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, bottom: 24, alignItems: 'center', paddingHorizontal: 18 }}>
          <Shadowed offset={3}>
            <View style={{ backgroundColor: '#fff', borderWidth: 2.5, borderColor: C, paddingVertical: 11, paddingHorizontal: 16, minWidth: 250, alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={{ backgroundColor: toast.bg, borderWidth: 2, borderColor: C, paddingVertical: 2, paddingHorizontal: 8 }}>
                  <Text style={{ fontFamily: nbFonts.hand, fontSize: 16.2, color: C }}>{toast.label}</Text>
                </View>
                <Text style={{ fontFamily: nbFonts.hand, fontSize: 17.6, color: C }}>{toast.next}</Text>
              </View>
            </View>
          </Shadowed>
        </View>
      )}
    </View>
  );
}

// 섹션 탭 — 교정 노트 / 말하기 / 모범답안.
//
// Three boxes, each pressing exactly like a PixelButton: a bordered cap sitting on a
// hard offset shadow, and pressing translates the WHOLE cap — border and all — by that
// offset so it covers its own shadow. That is the app's press, and it is what the tabs
// were asked to feel like.
//
// They started as one box with 2.5px dividers, which is what the handoff draws, and the
// press was faked inside it: each third clipped its contents and shifted them, so only
// the label appeared to move while the black outline stayed put. A cap can only drop
// into a shadow if it has somewhere to drop, and inside a tightly packed single box
// there is nowhere — so the row gives up its shared outline and each third gets its own.
//
// TAB_GAP is what keeps the movement from touching the neighbour: the shadow already
// extends TAB_PRESS_OFFSET to the right of each cap, and a pressed cap lands exactly on
// it, so the gap has to be larger than the offset. tabGeometry.test enforces that.
/** The three section tabs. A component because both branches of the screen draw it —
 *  the notes list has it inside ListHeaderComponent, the other two inside a ScrollView —
 *  and a second copy of this JSX is a second thing to keep in step. */
/**
 * The three sections, as index stickers.
 *
 * The inactive ones are pastel tabs tucked BEHIND the page, each a degree off square; the
 * active one comes forward in the page's own colour and loses its bottom edge so it reads
 * as continuous with the sheet below. That continuity is the whole device — without it
 * they are three buttons in a row, which is what this replaced (and what the pixel
 * version was, right down to a press offset that had to be faked to say "you are here").
 *
 * NbIndexTabs owns the drawing; this only names the tabs and their counts.
 */
function SectionTabs({ section, onSelect, cardCount, speak, models }: {
  section: Section;
  onSelect: (s: Section) => void;
  cardCount: number;
  speak: SpeakSummary | null;
  models: ModelAnswerSummary | null;
}) {
  const t = useT();
  const at = SECTIONS.findIndex((sec) => sec.id === section);
  return (
    <View testID="lab-sections">
      <NbIndexTabs
        active={at < 0 ? 0 : at}
        onSelect={(i: number) => { playSfx('tap'); onSelect(SECTIONS[i].id); }}
        // The count, or nothing while it is still unknown — a 0 that means "not loaded
        // yet" is the one number this row must not show. NbIndexTabs draws a number when
        // it is given one, so undefined is how "not yet" is said.
        tabs={SECTIONS.map((sec) => {
          const n = sectionCount(sec.id, cardCount, speak, models);
          const parsed = Number(n);
          return [t(sec.labelKey), Number.isFinite(parsed) ? parsed : undefined] as [string, number?];
        })}
      />
    </View>
  );
}

/** 히어로 왼쪽의 도장 — 종이색 바탕 52 원 · 3px double 빨강 · -8°, '오늘' 9/800 + 장수 Gaegu 19.
 *  잉크 바 위에 놓이므로 NbStamp(투명·.9)가 아니라 종이를 깔았다. */
function HeroStamp({ top, bottom }: { top: string; bottom: string }) {
  return (
    <View testID="lab-hero-stamp" style={{
      width: 52, height: 52, borderRadius: 26, backgroundColor: nb.paper, borderWidth: 1, borderColor: nb.red,
      alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-8deg' }], flexShrink: 0,
    }}>
      <NbDoubleRing color={nb.red} radius={26} />
      <Text numberOfLines={1} style={{ fontFamily: nbFonts.bodyHeavy, fontSize: 9, color: nb.red, width: 100, textAlign: 'center' }}>{top}</Text>
      <Text numberOfLines={1} style={{ fontFamily: nbFonts.hand, fontSize: 19, lineHeight: 19, color: nb.red, width: 100, textAlign: 'center' }}>{bottom}</Text>
    </View>
  );
}

/** 숙련 점 — 12px · 1.6 테두리. 채워진 점은 초록으로 차며 쾅(`.v48-done`, 1.15 → 1, 회전 없음). */
function Pip({ filled }: { filled: boolean }) {
  const { style } = useNbMotion(stampSpec(0), { auto: filled });
  return (
    <Animated.View
      testID={filled ? 'lab-pip-on' : 'lab-pip'}
      style={[{
        width: 12, height: 12, borderRadius: 6, borderWidth: 1.6,
        borderColor: filled ? nb.green : 'rgba(62,54,43,.3)', backgroundColor: filled ? nb.green : 'transparent',
      }, filled ? style : null]}
    />
  );
}

/** 듣기(파랑) · 말하기(잉크) 36 원 — 눌리면 `.v48-press`. */
function RoundAction({ kind, onPress, label }: { kind: 'speak' | 'say'; onPress: () => void; label: string }) {
  const press = useV48Press('press');
  const ink = kind === 'say';
  return (
    <Pressable onPress={onPress} onPressIn={press.onPressIn} onPressOut={press.onPressOut} hitSlop={4}
      accessibilityRole="button" accessibilityLabel={label} testID={ink ? 'lab-card-say' : 'lab-card-listen'}>
      <Animated.View style={{ transform: press.transform }}>
        {ink && <View pointerEvents="none" style={{ position: 'absolute', left: 1.5, top: 2, width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(62,54,43,.3)' }} />}
        <View style={{
          width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center',
          backgroundColor: ink ? nb.ink : 'rgba(169,196,224,.45)', borderWidth: ink ? 0 : 1.6, borderColor: nb.blue,
        }}>
          <NbIcon name={ink ? 'mic' : 'speaker'} size={19} color={ink ? nb.paper : undefined} />
        </View>
      </Animated.View>
    </Pressable>
  );
}

/** 카드가 넘어가는 길 — `transform .4s ease, opacity .4s ease`: 왼쪽(다시·어려움)이면 -40px · -6°,
 *  오른쪽이면 +40px · +6°로 기울며 사라진다. 키프레임이 아니라 전환이라 nbMotion 명세 밖. */
const AWAY = { duration: 400, dx: 40, rot: 6 } as const;

function PhraseCard({ card, onGrade, rot = -0.5 }: { card: ReviewCard; onGrade: (id: string, g: ReviewGrade) => void; rot?: number }) {
  const pronOn = usePronunciationEnabled();
  const t = useT();
  const router = useRouter();
  const reduce = useReduceMotion();
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
  const dept = deptOf(card);
  const kind = kindOf(card);
  // The strip has to say SOMETHING about where the card came from. Department when we
  // know it, else the scenario's own title — never the old fallback, which labelled every
  // card "교정 노트" (the name of the screen it was already on).
  const headerLabel = dept || card.context?.title || t('lab.correctionNote');
  const face = faceOf(card.source);
  const [showCtx, setShowCtx] = useState(false);
  const ctx = card.context;
  // 맥락은 출처 줄 끝의 ⌄ 뒤에 접혀 있다(v48). 펼치면 아래에서 톡 올라온다.
  const hasCtx = !!ctx && (!!ctx.title || !!ctx.situation || !!ctx.npc);
  const ctxLine = ctx?.situation || ctx?.title || ctx?.npc || '';

  // 등급을 누르면 카드가 그 방향으로 기울며 넘어간 뒤 큐에서 빠진다. 모션 줄이기면 바로.
  const away = useRef(new Animated.Value(0)).current;
  const [dir, setDir] = useState<-1 | 1>(-1);
  const [leaving, setLeaving] = useState(false);
  const pick = (g: ReviewGrade, index: number) => {
    if (leaving) return;
    if (reduce) { onGrade(card.id, g); return; }
    setDir(index < 2 ? -1 : 1);
    setLeaving(true);
    Animated.timing(away, { toValue: 1, duration: AWAY.duration, easing: CSS_EASE.ease, useNativeDriver: true })
      .start(() => onGrade(card.id, g));
  };
  const awayStyle = {
    opacity: away.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
    transform: [
      { translateX: away.interpolate({ inputRange: [0, 1], outputRange: [0, dir * AWAY.dx] }) },
      { rotate: away.interpolate({ inputRange: [0, 1], outputRange: ['0deg', `${dir * AWAY.rot}deg`] }) },
    ],
  };

  return (
    <Animated.View testID="lab-card" style={awayStyle}>
    <NbPaper rot={rot} style={{ paddingTop: 12, paddingBottom: 10, paddingHorizontal: 14 }}>
      {/* 출처 줄 — 과 · 종류(교정/제안) · 끝에 ⌄. 줄 전체가 맥락을 연다. 빨간 점·태그는 지웠다:
          이 목록은 GET /me/review라 전부 '오늘 복습'이고(그 배지는 늘 참이라 정보가 없었다),
          하위 태그는 아무도 쓰지 않는다. 종류는 칩이 걸러내는 축이라 남긴다. */}
      <Pressable
        onPress={() => hasCtx && setShowCtx((v) => !v)} disabled={!hasCtx} testID="lab-card-source"
        accessibilityRole={hasCtx ? 'button' : undefined} accessibilityState={hasCtx ? { expanded: showCtx } : undefined}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}
      >
        <Text numberOfLines={1} style={{ flex: 1, minWidth: 0, fontFamily: nbFonts.bodyBold, fontSize: 10.5, color: nb.blue }}>
          {headerLabel}
        </Text>
        <NbTag color={face.correction ? nb.red : nb.green}>{t(KIND_LABEL[kind])}</NbTag>
        {hasCtx && <Chev open={showCtx} />}
      </Pressable>
      {hasCtx && showCtx && (
        <V48Pop testID="lab-card-ctx" style={{ marginTop: 7 }}>
          <Text style={nbText.hand(14, nb.soft)}>{`\u270E ${ctxLine}`}</Text>
          {!!ctx?.npc && ctxLine !== ctx.npc && (
            <View style={{ marginTop: 6, paddingTop: 6, borderTopWidth: 1, borderTopColor: 'rgba(62,54,43,.16)' }}>
              <Text style={nbText.hand(13, nb.soft)}>{t('lab.theySaid')}</Text>
              <Text style={[nbText.body(11.5), { marginTop: 2 }]}>{ctx.npc}</Text>
            </View>
          )}
        </V48Pop>
      )}

      {/* What was said, struck out in red pen — but only when it is something that WAS
          said. See data/reviewCardFace: a graded scenario also files "you could have said
          this", and drawing one of those behind a strike claims the learner said a
          sentence they never said. */}
      <Text
        style={[
          nbText.body(13.5, nb.soft),
          { marginTop: 8, textDecorationLine: face.strike ? 'line-through' : 'none', textDecorationColor: nb.red },
        ]}
      >
        {card.front}
      </Text>

      {/* The correction, under a highlighter, with the arrow a red pen leaves. */}
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 7, marginTop: 6 }}>
        <Text style={[nbText.hand(15, nb.red), { flexShrink: 0, transform: [{ rotate: '-4deg' }] }]}>{'\u2192'}</Text>
        <View style={{ flex: 1, minWidth: 0 }}>
          <NbMark textStyle={{ fontFamily: nbFonts.bodyMid, fontSize: 14.5, lineHeight: 22 }}>{card.back}</NbMark>
        </View>
      </View>

      {/* 왜? — the reason, in blue pen. It is the only part of the card that teaches
          anything transferable, so it is not a footnote. (v48: unchanged.) */}
      {!!card.note && (
        <NbMemo color={nb.blue} rot={-0.3} style={{ marginTop: 9 }}>
          <Text style={nbText.hand(13.5)}>
            <Text style={{ color: nb.blue }}>{t('lab.whyLabel')} </Text>
            {card.note}
          </Text>
        </NbMemo>
      )}

      {/* 숙련 점(글자 없이) + 듣기(파랑 원) · 말하기(잉크 원). */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 }}>
        {[0, 1, 2].map((i) => <Pip key={i} filled={i < card.masteryPips} />)}
        <View style={{ flex: 1 }} />
        <RoundAction kind="speak" onPress={speak} label={t('model.listenAll')} />
        {pronOn && <RoundAction kind="say" onPress={practicePronunciation} label={t('model.repeatAfter')} />}
      </View>

      {/* 등급 넷 — 얼굴 + 모노 간격. 누르면 카드가 그 방향으로 기울며 넘어간다. */}
      <GradeRow onGrade={pick} disabled={leaving} style={{ marginTop: 10 }} />
    </NbPaper>
    </Animated.View>
  );
}

/** The notebook's ruled lines, behind the list. */
function Rules() {
  const { height } = useWindowDimensions();
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, overflow: 'hidden' }}>
      {Array.from({ length: Math.ceil(height / RULE_H) }).map((_, i) => (
        <View key={i} style={{ position: 'absolute', left: 0, right: 0, top: (i + 1) * RULE_H, height: 1, backgroundColor: RULE_COLOR }} />
      ))}
    </View>
  );
}

/** The number under a section tab. `'…'` while the summary is still unknown: a
 *  tab that reads 0 and then jumps to 128 looks like the feature was empty, and
 *  0 is also a legitimate answer once the read lands — so the two states cannot
 *  share a glyph. */
function sectionCount(
  id: Section,
  cardCount: number,
  speak: SpeakSummary | null,
  models: ModelAnswerSummary | null,
): string {
  if (id === 'notes') return String(cardCount);
  const sum = id === 'speak' ? speak : models;
  return sum ? String(sum.total) : '…';
}

/** A tab whose summary is still in flight. Its own component so the section
 *  reads the same as the others: the tab is switched to, something is there. */
function SectionLoading() {
  return (
    <View style={{ paddingVertical: 40, alignItems: 'center' }}>
      <ActivityIndicator color={C} />
    </View>
  );
}

/** A block whose data could not be read. Says so, rather than leaving a gap: a
 *  missing block reads as a missing FEATURE, and the learner then looks for it in the
 *  wrong place. Same frame as the real block so the page does not jump when it
 *  recovers on the next focus. */
function BlockUnavailable({ titleKey }: { titleKey: string }) {
  const t = useT();
  return (
    <Shadowed offset={4}>
      <View style={{ backgroundColor: '#fff', borderWidth: 3, borderColor: C, padding: 12, gap: 3 }}>
        <Text style={{ fontFamily: nbFonts.hand, fontSize: 16.2, color: C }}>{t(titleKey)}</Text>
        <Text style={{ fontFamily: nbFonts.body, fontSize: 10.5, color: nb.soft, lineHeight: 16 }}>{t('lab.blockUnavailable')}</Text>
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
