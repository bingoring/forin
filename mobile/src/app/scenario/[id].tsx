// Scenario briefing — pre-dialogue card shown when the player taps a `!` quest
// hotspot. 1:1 port of the v16 handoff `screen-briefing.jsx`: dark backdrop,
// cream card (chunky border + offset shadow + corner staples), tone ribbon
// header, NPC portrait strip, SITUATION box, skill chips, rewards, entry reqs,
// and 나중에/지금 진행 footer. Fetches real content via api.scenario(id); the
// [지금 진행] button opens the AI dialogue screen. reqs.met is computed best-
// effort (pilot: optimistic — full /me gating is a follow-up).
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View, type ViewStyle } from 'react-native';
import { EmojiIcon } from '@/components/EmojiIcon';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { RoleFace, type RoleKind, type Expression } from '@engine';
import { PixelButton } from '@/components/PixelButton';
import { api, type ScenarioDetail } from '@/api/client';

import { colors, fonts, fs } from '@/theme/tokens';
import { t, useLocale, useT } from '@/i18n';
import { TASK_SCREEN } from '@/theme/transitions';

const C = colors.ink;

export default function ScenarioBriefingRoute() {
  const t = useT();
  // `guide` is the rung the learner chose in the curriculum list. Carried through this
  // screen rather than re-derived: the server can only infer a rung from what has been
  // cleared, and inference cannot know which of two rows was tapped.
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
      <View style={{ flex: 1, backgroundColor: '#1F2937', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24 }}>
        <Stack.Screen options={TASK_SCREEN} />
        {state === 'loading' ? (
          <ActivityIndicator color={colors.mint} />
        ) : (
          <>
            <Text style={{ fontFamily: fonts.heading, fontSize: fs(15), color: '#fff', textAlign: 'center' }}>
              시나리오를 불러오지 못했습니다
            </Text>
            <Text style={{ fontFamily: fonts.body, fontSize: fs(12), color: '#9CA3AF' }}>{id}</Text>
            <PixelButton label={t('common.back')} onPress={() => router.back()} />
          </>
        )}
      </View>
    );
  }

  const b = scenario.briefing ?? {};
  const p = scenario.persona ?? {};
  const tone = b.tone || colors.peach;
  const accent = b.accent || colors.peachShadow;
  const deptColor = b.deptColor || '#DC2626';
  const reqs = (b.reqs ?? []).map((r) => ({ ...r, met: true })); // pilot: optimistic gating
  const xpBadge = (b.rewards?.find((r) => r.label.includes(t('result.xp')) || /xp/i.test(r.value))?.value || '').replace(/\s+/g, ''); // e.g. "+120XP"

  return (
    <View style={{ flex: 1, backgroundColor: '#1F2937' }}>
      <Stack.Screen options={TASK_SCREEN} />
      {/* faded tone backdrop */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: tone, opacity: 0.18 }} />

      {/* topbar */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, paddingTop: 52, paddingHorizontal: 16, paddingBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 8 }}>
        <PixelButton label={t('common.close')} bg="#fff" shadowColor={C} offset={2} fontSize={11} borderWidth={2} paddingV={4} paddingH={10} onPress={() => router.back()} />
        <Shadowed offset={2}>
          <View style={{ backgroundColor: deptColor, borderWidth: 2, borderColor: C, paddingVertical: 4, paddingHorizontal: 8 }}>
            <Text style={{ fontFamily: fonts.heading, fontSize: fs(11), color: '#fff' }}>{b.dept || scenario.title}</Text>
          </View>
        </Shadowed>
      </View>

      {/* main scenario card */}
      <View style={{ position: 'absolute', left: 14, right: 14, top: 100, bottom: 22, zIndex: 6 }}>
        <Shadowed offset={6} style={{ flex: 1 }}>
          <View style={{ flex: 1, backgroundColor: colors.cream, borderWidth: 4, borderColor: C }}>
            <CornerStaples />

            {/* ribbon header */}
            <View style={{ backgroundColor: tone, borderBottomWidth: 3, borderBottomColor: C, paddingVertical: 10, paddingHorizontal: 14 }}>
              <Text style={{ fontFamily: fonts.heading, fontSize: fs(10), color: accent, letterSpacing: 1 }}>❗ NEW SCENARIO</Text>
              <Text style={{ fontFamily: fonts.heading, fontSize: fs(17), color: C, marginTop: 4 }}>{scenario.title}</Text>
              <Text style={{ fontFamily: fonts.body, fontSize: fs(11), color: C, opacity: 0.8, fontStyle: 'italic', marginTop: 3 }}>{scenario.tagline}</Text>
              <Shadowed offset={2} style={{ position: 'absolute', top: -10, right: 14 }}>
                <View style={{ width: 22, height: 22, backgroundColor: colors.yellow, borderWidth: 2.5, borderColor: C, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontFamily: fonts.heading, fontSize: fs(13), color: C }}>!</Text>
                </View>
              </Shadowed>
            </View>

            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 14 }}>
              {/* NPC strip */}
              <View style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start', marginBottom: 14 }}>
                <BriefingPortrait role={p.role} hair={p.hair} mood={p.mood} />
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={{ fontFamily: fonts.heading, fontSize: fs(13), color: C }}>{p.name || 'NPC'}</Text>
                  <Text style={{ fontFamily: fonts.body, fontSize: fs(10), color: colors.textSoft, marginTop: 3 }}>{p.sub || p.ageRange || ''}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 }}>
                    <DifficultyStars n={b.difficulty || 1} />
                    {!!b.timeLabel && <Text style={{ fontFamily: fonts.heading, fontSize: fs(9), color: colors.textSoft }}>⏱ {b.timeLabel}</Text>}
                  </View>
                </View>
              </View>

              {/* SITUATION */}
              {!!b.brief && (
                <Shadowed offset={3} style={{ marginBottom: 12 }}>
                  <View style={{ backgroundColor: '#fff', borderWidth: 2.5, borderColor: C, paddingVertical: 10, paddingHorizontal: 12 }}>
                    <View style={{ position: 'absolute', top: -8, left: 10, backgroundColor: C, paddingHorizontal: 6 }}>
                      <Text style={{ fontFamily: fonts.heading, fontSize: fs(9), color: colors.yellow }}>SITUATION</Text>
                    </View>
                    <Text style={{ fontFamily: fonts.body, fontSize: fs(12), color: colors.text, lineHeight: 19, marginTop: 3 }}>{b.brief}</Text>
                  </View>
                </Shadowed>
              )}

              {/* skills */}
              {!!b.skills?.length && (
                <View style={{ marginBottom: 12 }}>
                  <Text style={{ fontFamily: fonts.heading, fontSize: fs(9), color: colors.textSoft, marginBottom: 5 }}>━ 연습할 스킬 ━━━━━━</Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 5 }}>
                    {b.skills.map((sk, i) => (
                      <Shadowed key={i} offset={2} shadowColor={colors.mintShadow}>
                        <View style={{ backgroundColor: colors.mint, borderWidth: 2, borderColor: C, paddingVertical: 3, paddingHorizontal: 7 }}>
                          <Text style={{ fontFamily: fonts.heading, fontSize: fs(10), color: C }}>{sk}</Text>
                        </View>
                      </Shadowed>
                    ))}
                  </View>
                </View>
              )}

              {/* rewards */}
              {!!b.rewards?.length && (
                <View style={{ marginBottom: 12 }}>
                  <Text style={{ fontFamily: fonts.heading, fontSize: fs(9), color: colors.textSoft, marginBottom: 5 }}>━ 완료 시 보상 ━━━━━━</Text>
                  <Shadowed offset={2}>
                    <View style={{ backgroundColor: colors.paper, borderWidth: 2, borderColor: C, paddingVertical: 4, paddingHorizontal: 8 }}>
                      {b.rewards.map((r, i) => (
                        <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 4, borderBottomWidth: i < b.rewards!.length - 1 ? 1.5 : 0, borderBottomColor: '#2A252222', borderStyle: 'dotted' }}>
                          <View style={{ width: 20, height: 20, backgroundColor: '#fff', borderWidth: 1.5, borderColor: C, alignItems: 'center', justifyContent: 'center' }}>
                            {/* The reward icons arrive from content as emoji (⭐ 경험치,
                                ❤ 환자 만족도, 🎖 부서 진척). EmojiIcon resolves them to the
                                v25 artwork — the XP badge, the heart, the badge — the same
                                way the result screen's REWARDS card does. */}
                            <EmojiIcon emoji={r.icon} size={14} />
                          </View>
                          <Text style={{ flex: 1, fontFamily: fonts.body, fontSize: fs(11), color: colors.text }}>{r.label}</Text>
                          <Text style={{ fontFamily: fonts.heading, fontSize: fs(11), color: C }}>{r.value}</Text>
                        </View>
                      ))}
                    </View>
                  </Shadowed>
                </View>
              )}

              {/* entry requirements */}
              {!!reqs.length && (
                <View>
                  <Text style={{ fontFamily: fonts.heading, fontSize: fs(9), color: colors.textSoft, marginBottom: 5 }}>━ 입장 조건 ━━━━━━━</Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                    {reqs.map((r, i) => (
                      <Shadowed key={i} offset={1.5}>
                        <View style={{ backgroundColor: r.met ? colors.mint : '#FEE2E2', borderWidth: 2, borderColor: C, paddingVertical: 2, paddingHorizontal: 8, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                          <Text style={{ fontFamily: fonts.heading, fontSize: fs(10), color: r.met ? '#16A34A' : '#DC2626' }}>{r.met ? '✓' : '✗'}</Text>
                          <Text style={{ fontFamily: fonts.heading, fontSize: fs(10), color: C }}>{r.label}</Text>
                        </View>
                      </Shadowed>
                    ))}
                  </View>
                </View>
              )}
            </ScrollView>

            {/* footer */}
            <View style={{ borderTopWidth: 3, borderTopColor: '#2A252244', borderStyle: 'dotted', backgroundColor: colors.paper, paddingHorizontal: 14, paddingTop: 10, paddingBottom: 12, flexDirection: 'row', gap: 8 }}>
              <PixelButton label={t('scenario.later')} bg="#fff" shadowColor={C} fontSize={12} onPress={() => router.back()} style={{ flex: 1 }} />
              <View style={{ flex: 2 }}>
                <PixelButton
                  icon="play" label={t('scenario.startNow')}
                  bg={colors.mint}
                  shadowColor={colors.mintShadow}
                  onPress={() => router.push(guide ? `/dialogue/${id}?guide=${guide}` : `/dialogue/${id}`)}
                  full
                />
                {/* +XP reward micro-badge (handoff pins this top-right of the CTA) */}
                {!!xpBadge && (
                  <View style={{ position: 'absolute', top: -6, right: -6 }}>
                    <View style={{ position: 'absolute', left: 1.5, top: 1.5, right: -1.5, bottom: -1.5, backgroundColor: C }} />
                    <View style={{ backgroundColor: colors.yellow, borderWidth: 2, borderColor: C, paddingHorizontal: 4 }}>
                      <Text style={{ fontFamily: fonts.heading, fontSize: fs(8), color: C }}>{xpBadge}</Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
          </View>
        </Shadowed>
      </View>
    </View>
  );
}

// ── helpers ──────────────────────────────────────────────────────────

/** Solid offset drop-shadow behind arbitrary children (pixel aesthetic). */
function Shadowed({ children, offset = 4, shadowColor = C, style }: { children: React.ReactNode; offset?: number; shadowColor?: string; style?: ViewStyle }) {
  return (
    <View style={style}>
      <View style={{ position: 'absolute', left: offset, top: offset, right: -offset, bottom: -offset, backgroundColor: shadowColor }} />
      {children}
    </View>
  );
}

function CornerStaples() {
  const S = { position: 'absolute' as const, width: 6, height: 6, backgroundColor: C };
  return (
    <>
      <View style={[S, { left: 6, top: 6 }]} />
      <View style={[S, { right: 6, top: 6 }]} />
      <View style={[S, { left: 6, bottom: 6 }]} />
      <View style={[S, { right: 6, bottom: 6 }]} />
    </>
  );
}

function DifficultyStars({ n }: { n: number }) {
  const palette = [colors.mint, colors.yellow, '#FCA5A5'];
  const labels = ['EASY', 'MEDIUM', 'HARD'];
  const idx = Math.min(3, Math.max(1, n)) - 1;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
      <View style={{ flexDirection: 'row', gap: 3 }}>
        {[0, 1, 2].map((i) => (
          <View key={i} style={{ width: 11, height: 11, borderWidth: 1.5, borderColor: C, backgroundColor: i <= idx ? palette[idx] : '#fff' }} />
        ))}
      </View>
      <Text style={{ fontFamily: fonts.heading, fontSize: fs(9), color: C }}>{labels[idx]}</Text>
    </View>
  );
}

/** Portrait bust in a chunky peach frame — RoleFace anchored to fill the frame. */
function BriefingPortrait({ role, hair, mood }: { role?: string; hair?: string; mood?: string }) {
  const kind = (ROLE_KINDS.has(role as RoleKind) ? role : 'patient') as RoleKind;
  const expr = (EXPRESSIONS.has(mood as Expression) ? mood : 'neutral') as Expression;
  return (
    <Shadowed offset={3}>
      <View style={{ width: 90, height: 102, backgroundColor: colors.peach, borderWidth: 3, borderColor: C, overflow: 'hidden' }}>
        <View style={{ position: 'absolute', left: 6, top: 6, right: 6, bottom: 6, backgroundColor: 'rgba(255,255,255,0.4)' }} />
        <View style={{ position: 'absolute', left: '50%', top: 8, transform: [{ translateX: -54 }] }}>
          <RoleFace kind={kind} hair={hair} expression={expr} size={108} />
        </View>
      </View>
    </Shadowed>
  );
}

const ROLE_KINDS = new Set<RoleKind>(['nurse', 'doctor', 'surgeon', 'paramedic', 'police', 'patient', 'child', 'parent', 'visitor', 'pharmacist']);
const EXPRESSIONS = new Set<Expression>(['neutral', 'derp', 'happy', 'sad', 'worried', 'pain', 'surprised', 'angry', 'thinking', 'sleepy', 'panic', 'focused', 'shy']);
