// 상황 준비 — the 근무 수첩 line (v29).
//
// The page a nurse would have written before walking into a room: a polaroid of the person
// taped to the sheet, where and how hard it is, how they are feeling in red pen, the four
// things to get done as a checklist, what it pays, and where it sits in the curriculum.
//
// The DATA is unchanged. `guide` is still the rung the learner tapped in the curriculum
// list and is still carried through rather than re-derived — the server can only infer a
// rung from what has been cleared, and inference cannot know which of two rows was
// tapped.
//
// What changed beyond the drawing: the missions are now the scenario's own GOALS. The
// pixel briefing showed skills, rewards and entry requirements but never the goals, so the
// learner walked in without knowing what they would be graded on — and those goals are
// exactly what the dialogue screen's mission tracker fills in.
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { RoleFace, type Expression, type RoleKind } from '@engine';
import { NbIcon } from '@/components/nb/NbIcon';
import { NbButton, NbCheck, NbPaper, NbTag, nbText } from '@/components/nb/NbUI';
import { RULE_COLOR, RULE_H, TOP_INSET, nb, nbFonts } from '@/theme/nb';
import { api, type ScenarioDetail } from '@/api/client';
import { asMood, moodExpression } from '@/data/moodTone';
import { useT } from '@/i18n';
import { TASK_SCREEN } from '@/theme/transitions';

const ROLE_KINDS = new Set<RoleKind>(['nurse', 'doctor', 'surgeon', 'paramedic', 'police', 'patient', 'child', 'parent', 'visitor', 'pharmacist']);
const EXPRESSIONS = new Set<Expression>(['neutral', 'happy', 'worried', 'pain', 'panic', 'thinking', 'focused']);

export default function ScenarioBriefingRoute() {
  const t = useT();
  const { id, guide } = useLocalSearchParams<{ id: string; guide?: 'choices' | 'free' }>();
  const router = useRouter();
  const [scenario, setScenario] = useState<ScenarioDetail | null>(null);
  const [state, setState] = useState<'loading' | 'error' | 'ok'>('loading');

  useEffect(() => {
    let alive = true;
    setState('loading');
    api
      .scenario(id)
      .then((s) => { if (alive) { setScenario(s); setState('ok'); } })
      .catch(() => { if (alive) setState('error'); });
    return () => { alive = false; };
  }, [id]);

  if (state !== 'ok' || !scenario) {
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

  const b = scenario.briefing ?? {};
  const p = scenario.persona ?? {};
  const kind = (ROLE_KINDS.has(p.role as RoleKind) ? p.role : 'patient') as RoleKind;
  const authored = (EXPRESSIONS.has(p.mood as Expression) ? p.mood : 'neutral') as Expression;
  const expr = moodExpression(asMood(p.mood)) ?? authored;
  const goals = scenario.goals ?? [];
  const xp = b.rewards?.find((r) => /xp/i.test(r.value))?.value?.replace(/\s+/g, '') ?? '';

  return (
    <Sheet>
      <Stack.Screen options={TASK_SCREEN} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingTop: TOP_INSET, paddingBottom: 30 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Pressable onPress={() => router.back()} hitSlop={10}>
            <NbPaper rot={-1} style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}>
              <NbIcon name="chevronLeft" size={16} />
            </NbPaper>
          </Pressable>
          <Text numberOfLines={1} style={[nbText.hand(24), { flex: 1, minWidth: 0 }]}>{t('briefing.nbTitle')}</Text>
        </View>

        {/* The situation's cover page: a polaroid of the person, taped down. */}
        <NbPaper rot={-0.6} tape tapeLeft={110} style={{ marginTop: 16, paddingTop: 16, paddingBottom: 13, paddingHorizontal: 16 }}>
          <View style={{ flexDirection: 'row', gap: 13 }}>
            {/* A polaroid, not a framed sprite: the border is the print's own margin, and
                the name is typed on the white strip at the bottom the way a photo is
                labelled. */}
            <NbPaper rot={-2.5} style={{ paddingTop: 6, paddingHorizontal: 6, paddingBottom: 3, flexShrink: 0 }}>
              <View style={{ width: 78, height: 90, overflow: 'hidden', alignItems: 'center', justifyContent: 'flex-end' }}>
                <RoleFace kind={kind} hair={p.hair} expression={expr} size={86} />
              </View>
              <Text numberOfLines={1} style={{ fontFamily: nbFonts.monoBold, fontSize: 9, color: nb.ink, textAlign: 'center', paddingTop: 2, paddingBottom: 1 }}>
                {p.name || 'NPC'}
              </Text>
            </NbPaper>

            <View style={{ flex: 1, minWidth: 0 }}>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 5 }}>
                {!!b.dept && <NbTag color={nb.red}>{b.dept}</NbTag>}
                <NbTag color={nb.blue}>
                  {t('briefing.lvTime', { lv: b.reqs?.find((r) => r.metric === 'level')?.label ?? `Lv.${b.difficulty ?? 1}`, time: b.timeLabel ?? '' })}
                </NbTag>
              </View>
              <Text style={[nbText.hand(23), { marginTop: 7, lineHeight: 26 }]}>{scenario.title}</Text>
              {!!b.brief && (
                <Text style={[nbText.body(11.5, nb.soft), { marginTop: 5 }]}>{b.brief}</Text>
              )}
            </View>
          </View>

          {/* How they are feeling, in red pen. It is the one thing on this page that
              changes how the learner should open their mouth, so it is not a chip in a row
              of chips. */}
          {!!p.mood && (
            <View style={{ marginTop: 11, paddingVertical: 7, paddingHorizontal: 10, backgroundColor: '#FFF3EE', borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#D9A08E', transform: [{ rotate: '0.4deg' }] }}>
              <Text style={nbText.hand(14.5, nb.red)}>
                {t('briefing.moodNow', { mood: String(p.mood).toUpperCase() })}
                {!!p.personality && ` — ${p.personality}`}
              </Text>
            </View>
          )}
        </NbPaper>

        {/* The checklist. These are the scenario's GOALS — the same list the dialogue
            screen's tracker fills in, so the learner walks in knowing what counts. */}
        {goals.length > 0 && (
          <NbPaper rot={0.5} style={{ marginTop: 14, paddingTop: 13, paddingBottom: 8, paddingHorizontal: 15 }}>
            <Text style={{ fontFamily: nbFonts.bodyBold, fontSize: 11, color: nb.blue, letterSpacing: 1 }}>
              {t('briefing.missions', { n: goals.length })}
            </Text>
            <View style={{ marginTop: 5 }}>
              {goals.map((g, i) => (
                <View
                  key={i}
                  style={{
                    flexDirection: 'row', gap: 9, alignItems: 'flex-start', paddingVertical: 8, paddingHorizontal: 2,
                    borderTopWidth: i > 0 ? 1.3 : 0, borderTopColor: 'rgba(62,54,43,.14)', borderStyle: 'dashed',
                  }}
                >
                  <View style={{ marginTop: 2 }}><NbCheck size={18} /></View>
                  <Text style={[nbText.hand(16.5), { flex: 1, minWidth: 0, lineHeight: 19 }]}>{g}</Text>
                </View>
              ))}
            </View>
          </NbPaper>
        )}

        {/* What it pays, and where it sits. Two small cards rather than two labelled lists:
            both answers are one line long. */}
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
          <View style={{ flex: 1 }}>
            <NbPaper rot={-0.5} style={{ paddingVertical: 10, paddingHorizontal: 12 }}>
              <Text style={nbText.body(10.5, nb.soft)}>{t('briefing.reward')}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 3 }}>
                <NbIcon name="star" size={15} color="#C99A1E" />
                <Text numberOfLines={2} style={[nbText.hand(17), { flex: 1, minWidth: 0 }]}>
                  {xp ? t('briefing.rewardXp', { xp }) : t('briefing.rewardPlain')}
                </Text>
              </View>
            </NbPaper>
          </View>
          {!!b.skills?.length && (
            <View style={{ width: 130 }}>
              <NbPaper rot={0.6} style={{ paddingVertical: 10, paddingHorizontal: 12 }}>
                <Text style={nbText.body(10.5, nb.soft)}>{t('briefing.skills')}</Text>
                <Text numberOfLines={3} style={[nbText.hand(15), { marginTop: 3, lineHeight: 18 }]}>
                  {b.skills.join(' · ')}
                </Text>
              </NbPaper>
            </View>
          )}
        </View>

        <View style={{ marginTop: 18 }}>
          <NbButton
            variant="ink"
            size="lg"
            full
            icon="pencil"
            iconColor={nb.paper}
            onPress={() => router.push(guide ? `/dialogue/${id}?guide=${guide}` : `/dialogue/${id}`)}
          >
            {t('briefing.start')}
          </NbButton>
        </View>

        {/* Reading the model answers first is a legitimate way in — for someone who froze
            on the first turn, it is the only one. Underlined rather than buttoned: it is
            the second choice, not a second CTA. */}
        <Pressable onPress={() => router.push('/model-answers')} hitSlop={8} style={{ marginTop: 10, alignItems: 'center' }}>
          <Text style={[nbText.hand(14.5, nb.blue), { textDecorationLine: 'underline' }]}>
            {t('briefing.peekModel')}
          </Text>
        </Pressable>
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
