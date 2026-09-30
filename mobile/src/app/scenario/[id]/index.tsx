// 상황 허브 — lesson-four-steps-v44 G (handoff reference forin-notebook-lesson.jsx LessonHub).
//
// Replaces the 상황 준비 (briefing) page, at the same route: every entry point that opened
// the briefing — the journey, the board, a hotspot, the lounge, a handoff note, the next
// situation on a result — now opens this, with no call-site change and back returning to
// wherever the learner came from (spec §6 결정 4).
//
// A cover card (polaroid + tags + one line + three chips), then the four step tickets
// with a gauge, then one CTA for the next step. The server decides each step's state
// (GET /me/lesson); the page only adds `그래도 할래요` for a step the learner's level skips.
//
// The `?guide=` a caller may still pass is ignored. It used to carry which of the two
// curriculum rows was tapped into the conversation; the hub is now where the rung is
// chosen, and each dialogue step sends its own (data/lessonSteps stepHref).
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { Stack, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { type Expression, type RoleKind } from '@engine';
import { NbAvatar } from '@/components/nb/NbAvatar';
import { npcAvatarSpec, type NpcExpression } from '@/data/npcAvatar';
import { NbIcon, type NbIconName } from '@/components/nb/NbIcon';
import { NbButton, NbGauge, NbPaper, NbStamp, NbTag, nbText } from '@/components/nb/NbUI';
import { RULE_COLOR, RULE_H, TOP_INSET, nb, nbFonts } from '@/theme/nb';
import { api, type LessonDetail, type LessonStepKind, type LessonStepView } from '@/api/client';
import { asMood, moodExpression } from '@/data/moodTone';
import { applyOptIn, gauge, nextStep, stepHref } from '@/data/lessonSteps';
import { type Translate, useT } from '@/i18n';
import { TASK_SCREEN } from '@/theme/transitions';

const ROLE_KINDS = new Set<RoleKind>(['nurse', 'doctor', 'surgeon', 'paramedic', 'police', 'patient', 'child', 'parent', 'visitor', 'pharmacist']);
const EXPRESSIONS = new Set<Expression>(['neutral', 'happy', 'worried', 'pain', 'panic', 'thinking', 'focused']);

const STEP_LOOK: Record<LessonStepKind, { icon: NbIconName; color: string }> = {
  words: { icon: 'pencil', color: nb.amber },
  sentences: { icon: 'speech', color: nb.blue },
  guided: { icon: 'speech', color: nb.purple },
  free: { icon: 'mic', color: nb.red },
};

/** The CEFR level as the onboarding's three answers (spec §4). */
function levelBand(level: string): 'A' | 'B' | 'C' {
  if (level.startsWith('A')) return 'A';
  return level === 'B1' ? 'B' : 'C';
}

/** Mood → an icon for the feeling chip. `faceAngry` arrives with K; until then the closest. */
function moodIcon(mood?: string): NbIconName {
  switch (mood) {
    case 'pain': return 'bandage';
    case 'panic': case 'worried': return 'siren';
    default: return 'speech';
  }
}

function stepMeta(t: Translate, s: LessonStepView): [NbIconName, string][] {
  const n = s.count ?? 0;
  switch (s.kind) {
    case 'words': return [['pencil', t('lesson.meta.words', { n })], ['speaker', t('lesson.meta.listen')]];
    case 'sentences': return [['speech', t('lesson.meta.sentences', { n })], ['mic', t('lesson.meta.repeat')]];
    case 'guided': return [['speech', t('lesson.meta.koGuide')], ['mic', t('lesson.meta.speakType')], ['check', t('lesson.meta.goals', { n })]];
    case 'free': return [['mic', t('lesson.meta.real')], ['check', t('lesson.meta.goals', { n })]];
  }
}

export default function LessonHubRoute() {
  const t = useT();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [state, setState] = useState<'loading' | 'error' | 'ok'>('loading');
  const [optIn, setOptIn] = useState<ReadonlySet<LessonStepKind>>(new Set());

  // On focus, not on mount: coming back from a STEP screen must show that step done. The
  // spinner is only for the first read — a refresh keeps the page on screen.
  useFocusEffect(
    useCallback(() => {
      let alive = true;
      api
        .lesson(id)
        .then((l) => { if (alive) { setLesson(l); setState('ok'); } })
        .catch(() => { if (alive) setState((s) => (s === 'ok' ? s : 'error')); });
      return () => { alive = false; };
    }, [id]),
  );

  const steps = useMemo(() => applyOptIn(lesson?.steps ?? [], optIn), [lesson, optIn]);

  if (state !== 'ok' || !lesson) {
    return (
      <Sheet>
        <Stack.Screen options={TASK_SCREEN} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14, padding: 24 }}>
          {state === 'loading' ? (
            <ActivityIndicator color={nb.ink} />
          ) : (
            <>
              <Text style={[nbText.hand(17), { textAlign: 'center' }]}>{t('briefing.loadFailed')}</Text>
              <Text style={nbText.mono(11)}>{id}</Text>
              <NbButton variant="paper" onPress={() => router.back()}>{t('common.back')}</NbButton>
            </>
          )}
        </View>
      </Sheet>
    );
  }

  const sit = lesson.situation;
  const b = sit.briefing ?? {};
  const p = sit.persona ?? {};
  const kind = (ROLE_KINDS.has(p.role as RoleKind) ? p.role : 'patient') as RoleKind;
  // Same NPC portrait the dialogue draws — same seed (name + scenario), so the person on
  // the cover is the person you then talk to.
  const npcSeed = `${p.name || 'npc'}|${id}`;
  const authored = (EXPRESSIONS.has(p.mood as Expression) ? p.mood : 'neutral') as Expression;
  const expr = moodExpression(asMood(p.mood)) ?? authored;
  const xp = b.rewards?.find((r) => /xp/i.test(r.value))?.value?.replace(/\s+/g, '') ?? '';
  const band = levelBand(lesson.level);
  const g = gauge(steps);
  const next = nextStep(steps);
  const nextIndex = next ? steps.indexOf(next) : -1;
  const cta = !next
    ? t('lesson.hub.ctaAgain')
    : g.done === 0
      ? t('lesson.hub.ctaFirst', { n: nextIndex + 1, label: t(`lesson.step.${next.kind}`) })
      : t('lesson.hub.ctaNext', { n: nextIndex + 1 });
  const open = (k: LessonStepKind) => router.push(stepHref(id, k));

  const chips: [NbIconName, string, string][] = [
    ...(p.mood ? [[moodIcon(p.mood), String(p.mood).toUpperCase(), nb.red] as [NbIconName, string, string]] : []),
    ...(xp ? [['star', xp, nb.amber] as [NbIconName, string, string]] : []),
    ['lab', t('lesson.hub.noteAuto'), nb.blue],
  ];

  return (
    <Sheet>
      <Stack.Screen options={TASK_SCREEN} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: TOP_INSET, paddingBottom: 96 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 20 }}>
          <Pressable onPress={() => router.back()} hitSlop={10}>
            <NbPaper rot={-1} style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}>
              <NbIcon name="chevronLeft" size={16} />
            </NbPaper>
          </Pressable>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text numberOfLines={1} style={nbText.hand(21)}>{sit.title}</Text>
            {!!b.dept && <Text numberOfLines={1} style={[nbText.body(10.5, nb.soft), { marginTop: 1 }]}>{b.dept}</Text>}
          </View>
          <NbTag color={nb.blue}>{t(`lesson.hub.levelShort${band}`)}</NbTag>
        </View>

        {/* The cover: a polaroid of the person, the three tags, one line, three chips. */}
        <View style={{ marginTop: 14, marginHorizontal: 20 }}>
          <NbPaper rot={-0.6} tape tapeLeft={120} style={{ paddingVertical: 13, paddingHorizontal: 14 }}>
            <View style={{ flexDirection: 'row', gap: 13, alignItems: 'center' }}>
              <NbPaper rot={-2.5} style={{ paddingTop: 5, paddingHorizontal: 5, paddingBottom: 2, flexShrink: 0 }}>
                <View style={{ width: 72, height: 84, overflow: 'hidden', alignItems: 'center', justifyContent: 'flex-end' }}>
                  <NbAvatar spec={npcAvatarSpec(kind, npcSeed, expr as NpcExpression)} size={72} />
                </View>
                <Text numberOfLines={1} style={{ fontFamily: nbFonts.monoBold, fontSize: 8.5, color: nb.ink, textAlign: 'center' }}>
                  {p.name || 'NPC'}
                </Text>
              </NbPaper>
              <View style={{ flex: 1, minWidth: 0 }}>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 5 }}>
                  {!!b.dept && <NbTag color={nb.red}>{b.dept}</NbTag>}
                  <NbTag color={nb.blue}>{`Lv.${lesson.level}`}</NbTag>
                  {!!b.timeLabel && <NbTag color={nb.soft}>{b.timeLabel}</NbTag>}
                </View>
                {!!(b.brief || sit.tagline) && (
                  <Text style={[nbText.hand(15, nb.soft), { marginTop: 8, lineHeight: 21 }]}>{b.brief || sit.tagline}</Text>
                )}
              </View>
            </View>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 11 }}>
              {chips.map(([icon, label, color], i) => (
                <View key={i} style={{
                  flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 6, paddingHorizontal: 8,
                  borderWidth: 1.3, borderStyle: 'dashed', borderColor: color, borderRadius: 4, backgroundColor: `${color}10`,
                }}>
                  <NbIcon name={icon} size={16} />
                  <Text numberOfLines={1} style={[nbText.hand(12.5), { flexShrink: 1 }]}>{label}</Text>
                </View>
              ))}
            </View>
          </NbPaper>
        </View>

        {/* The four tickets. The count and the denominator are the steps left for THIS
            learner — a skipped or unwritten step is not counted (spec §4, 결정 3). */}
        <View style={{ marginTop: 16, marginHorizontal: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
            <Text style={nbText.hand(17)}>{t('lesson.hub.steps', { n: g.total })}</Text>
            <Text numberOfLines={1} style={[nbText.body(10.5, nb.soft), { flexShrink: 1 }]}>{t(`lesson.hub.level${band}`)}</Text>
            <View style={{ flex: 1 }} />
            <Text testID="lesson-gauge-count" style={[nbText.mono(11), { fontFamily: nbFonts.monoBold }]}>{`${g.done}/${g.total}`}</Text>
          </View>
          <View style={{ marginTop: 6 }}><NbGauge value={g.total ? (g.done / g.total) * 100 : 0} height={9} /></View>
          {steps.map((s, i) => (
            <Ticket
              key={s.kind} t={t} step={s} index={i}
              onOpen={() => open(s.kind)}
              onOptIn={() => setOptIn((prev) => new Set(prev).add(s.kind))}
            />
          ))}
        </View>
      </ScrollView>

      {/* No tab bar on this page (결정 4) — the CTA sits where the STEP screens put theirs. */}
      <View testID="lesson-cta" style={{ position: 'absolute', left: 20, right: 20, bottom: 30, zIndex: 31 }}>
        <NbButton
          variant="ink" size="lg" full iconColor={nb.paper}
          icon={next ? STEP_LOOK[next.kind].icon : 'star'}
          onPress={() => open(next ? next.kind : 'free')}
        >
          {cta}
        </NbButton>
      </View>
    </Sheet>
  );
}

function Ticket({ t, step, index, onOpen, onOptIn }: {
  t: Translate; step: LessonStepView; index: number; onOpen: () => void; onOptIn: () => void;
}) {
  const look = STEP_LOOK[step.kind];
  const label = t(`lesson.step.${step.kind}`);
  const rot = index % 2 ? 0.4 : -0.4;

  // Skipped for the level, or not written yet: a dashed card with no icon tile of its own.
  // Only skip can be opted into — empty would open a page with nothing on it.
  if (step.state === 'skip' || step.state === 'empty') {
    const skip = step.state === 'skip';
    return (
      <View testID={`lesson-ticket-${step.kind}`} style={{
        marginTop: 10, paddingVertical: 8, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 12,
        borderWidth: 1.4, borderStyle: 'dashed', borderColor: 'rgba(62,54,43,.3)', borderRadius: 4, transform: [{ rotate: `${rot}deg` }],
      }}>
        <View style={{ width: 36, height: 36, borderRadius: 8, borderWidth: 1.4, borderColor: 'rgba(62,54,43,.25)', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}>
          <NbIcon name={look.icon} size={20} />
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text numberOfLines={1}>
            <Text style={[nbText.mono(10, nb.soft), { fontFamily: nbFonts.monoBold }]}>{`STEP ${index + 1}  `}</Text>
            <Text style={[nbText.hand(16, nb.soft), skip ? { textDecorationLine: 'line-through' } : null]}>{label}</Text>
          </Text>
          <Text numberOfLines={1} style={[nbText.body(10.5, nb.soft), { marginTop: 2 }]}>
            {skip ? t('lesson.hub.skipNote') : t('lesson.hub.emptyNote')}
          </Text>
        </View>
        {skip && <NbButton variant="dashed" size="sm" onPress={onOptIn}>{t('lesson.hub.optIn')}</NbButton>}
      </View>
    );
  }

  const now = step.state === 'now';
  return (
    <View testID={`lesson-ticket-${step.kind}`} style={{ marginTop: 10 }}>
      <Pressable disabled={step.state === 'lock'} onPress={onOpen}>
        <NbPaper rot={index % 2 ? 0.5 : -0.5} style={[
          { paddingVertical: 11, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 12, opacity: step.state === 'lock' ? 0.6 : 1 },
          now ? { borderWidth: 2.5, borderColor: look.color } : null,
        ]}>
          <View style={{
            width: 46, height: 46, borderRadius: 10, backgroundColor: `${look.color}22`, borderWidth: 1.6, borderColor: look.color,
            alignItems: 'center', justifyContent: 'center', transform: [{ rotate: `${index % 2 ? 2 : -2}deg` }],
          }}>
            <NbIcon name={look.icon} size={26} />
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
              <Text style={[nbText.mono(10, look.color), { fontFamily: nbFonts.monoBold }]}>{`STEP ${index + 1}`}</Text>
              <Text numberOfLines={1} style={nbText.hand(18)}>{label}</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 4, alignItems: 'center', flexWrap: 'wrap' }}>
              {stepMeta(t, step).map(([icon, text], j) => (
                <View key={j} style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                  <NbIcon name={icon} size={12} />
                  <Text testID={`lesson-meta-${step.kind}-${j}`} style={nbText.body(10.5, nb.soft)}>{text}</Text>
                </View>
              ))}
            </View>
          </View>
          {step.state === 'done'
            ? <NbStamp color={nb.green} size={40} bottom={t('lesson.hub.done')} />
            : now
              ? <NbButton variant="ink" size="sm" iconRight="chevronRight" iconColor={nb.paper} onPress={onOpen}>{t('lesson.hub.start')}</NbButton>
              : <NbIcon name="lock" size={18} />}
        </NbPaper>
      </Pressable>
    </View>
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
