// 나 (profile) tab — the player's ID card wired to the real growth system
// (GET /me + /me/progress): rank, level + XP bar, reputation stats, a growth
// summary, a career-path stepper, milestone badges, and a review-lab teaser.
// 1:1 in spirit with the v17 handoff ScreenProfile, scaled to live data.
import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { PixelButton } from '@/components/PixelButton';
import { PixelChip } from '@/components/PixelChip';
import { api, type Progress } from '@/api/client';
import { colors, fonts, space, type as t } from '@/theme/tokens';

const C = colors.ink;
const XP_PER_LEVEL = 100;

// Server keeps rank at a default; derive a friendly career title from level so
// the card reflects real progression.
function careerOf(level: number) {
  if (level >= 30) return { label: 'Head Nurse', step: 3 };
  if (level >= 15) return { label: 'Senior Nurse', step: 2 };
  if (level >= 5) return { label: 'Junior Nurse', step: 1 };
  return { label: 'Learner', step: 0 };
}

export default function Me() {
  const router = useRouter();
  const [progress, setProgress] = useState<Progress | null>(null);
  const [enLevel, setEnLevel] = useState<string>('');
  const [state, setState] = useState<'loading' | 'error' | 'ok'>('loading');

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      (async () => {
        try {
          const [p, me] = await Promise.all([api.progress(), api.me().catch(() => null)]);
          if (!alive) return;
          setProgress(p);
          setEnLevel(((me as { profile?: { targetLevel?: string } } | null)?.profile?.targetLevel) || '');
          setState('ok');
        } catch {
          if (alive) setState('error');
        }
      })();
      return () => { alive = false; };
    }, []),
  );

  if (state !== 'ok' || !progress) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.paper, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 }}>
        {state === 'loading' ? <ActivityIndicator color={C} /> : <Text style={{ fontFamily: fonts.body, fontSize: t.body, color: colors.textSoft, textAlign: 'center' }}>프로필을 불러오지 못했어요. (로그인·서버 확인)</Text>}
      </View>
    );
  }

  const { level, xp, streakCurrent, streakLongest, patientSatisfaction, peerTrust, emergencyResponse } = progress;
  const career = careerOf(level);
  const inLevel = xp % XP_PER_LEVEL;

  const badges = [
    { e: '👒', l: '첫 근무', got: xp > 0 },
    { e: '🩺', l: 'Lv.3', got: level >= 3 },
    { e: '💉', l: 'Lv.5', got: level >= 5 },
    { e: '🔥', l: '3일 연속', got: streakLongest >= 3 },
    { e: '🏅', l: '7일 연속', got: streakLongest >= 7, special: true },
    { e: '🏆', l: 'Lv.10', got: level >= 10 },
    { e: '👑', l: 'Lv.20', got: level >= 20 },
    { e: '🔒', l: '???', got: false },
  ] as { e: string; l: string; got: boolean; special?: boolean }[];
  const gotCount = badges.filter((b) => b.got).length;
  const BADGE_TOTAL = 24; // full career-badge pool (handoff shows collection vs 24)

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <ScrollView contentContainerStyle={{ padding: space.lg, paddingTop: 56, paddingBottom: 40, gap: space.md }}>
        <Text style={{ fontFamily: fonts.heading, fontSize: t.screenHeading, color: C }}>MY CARD</Text>

        {/* ── ID card ── */}
        <Shadowed offset={5}>
          <View style={{ backgroundColor: '#fff', borderWidth: 3, borderColor: C, overflow: 'hidden' }}>
            {/* hospital header band — flush to the card's top edge (ID-card look) */}
            <View style={{ height: 8, backgroundColor: colors.mint, borderBottomWidth: 2, borderBottomColor: C }} />
            {/* punched-hole notch (id-card vibe) */}
            <View style={{ position: 'absolute', top: -1, left: '50%', marginLeft: -12, width: 24, height: 5, backgroundColor: colors.cream, borderWidth: 2, borderTopWidth: 0, borderColor: C }} />
            <View style={{ padding: 14, paddingTop: 12, flexDirection: 'row', gap: 14 }}>
              {/* avatar */}
              <Shadowed offset={3}>
                <View style={{ width: 80, height: 96, backgroundColor: colors.peach, borderWidth: 3, borderColor: C, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 46 }}>👩‍⚕️</Text>
                </View>
              </Shadowed>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={{ fontFamily: fonts.heading, fontSize: 10, color: colors.textSoft }}>RANK</Text>
                <Text style={{ fontFamily: fonts.heading, fontSize: 18, color: C }}>{career.label}</Text>
                <Text style={{ fontFamily: fonts.body, fontSize: 11, color: colors.textSoft, marginTop: 2 }}>EN-US · 미국 종합병원</Text>
                {/* xp bar */}
                <View style={{ marginTop: 10 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontFamily: fonts.heading, fontSize: 9, color: colors.textSoft }}>LV {level}</Text>
                    <Text style={{ fontFamily: fonts.heading, fontSize: 9, color: colors.textSoft }}>{inLevel} / {XP_PER_LEVEL}</Text>
                    <Text style={{ fontFamily: fonts.heading, fontSize: 9, color: colors.textSoft }}>LV {level + 1}</Text>
                  </View>
                  <View style={{ height: 10, backgroundColor: colors.cream, borderWidth: 2, borderColor: C, marginTop: 3 }}>
                    <View style={{ width: `${(inLevel / XP_PER_LEVEL) * 100}%`, height: '100%', backgroundColor: colors.mint }} />
                  </View>
                </View>
                <View style={{ flexDirection: 'row', gap: 6, marginTop: 8 }}>
                  <PixelChip label={`★ LV ${level}`} bg={colors.yellow} />
                  {!!enLevel && <PixelChip label={`EN ${enLevel}`} bg={colors.mint} />}
                </View>
              </View>
            </View>

            {/* reputation */}
            <View style={{ marginTop: 14, paddingTop: 12, borderTopWidth: 2, borderTopColor: '#2A252233', borderStyle: 'dashed' }}>
              <RepRow label="환자 만족도" value={patientSatisfaction} color={colors.mint} />
              <RepRow label="동료 신뢰도" value={peerTrust} color={colors.peach} />
              <RepRow label="응급 대응력" value={emergencyResponse} color={colors.yellow} />
            </View>
          </View>
        </Shadowed>

        {/* growth summary */}
        <Shadowed offset={4} shadowColor={colors.mintShadow}>
          <View style={{ backgroundColor: colors.mint, borderWidth: 3, borderColor: C, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ width: 38, height: 38, backgroundColor: '#fff', borderWidth: 2, borderColor: C, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 20 }}>📊</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: fonts.heading, fontSize: 14, color: C }}>오늘의 성장 리포트</Text>
              <Text style={{ fontFamily: fonts.body, fontSize: 11, color: C, marginTop: 3, opacity: 0.8 }}>Lv.{level} · {xp.toLocaleString()} XP · 🔥 {streakCurrent}일 연속</Text>
            </View>
            <Text style={{ fontFamily: fonts.heading, fontSize: 16, color: C }}>▶</Text>
          </View>
        </Shadowed>

        {/* career path */}
        <Shadowed offset={3}>
          <View style={{ backgroundColor: colors.paper, borderWidth: 3, borderColor: C, padding: 12 }}>
            <Text style={{ fontFamily: fonts.heading, fontSize: 11, color: colors.textSoft, marginBottom: 10 }}>CAREER PATH</Text>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
              {['Learner', 'Junior', 'Senior', 'Head Nurse'].map((s, i) => {
                const here = i === career.step;
                const done = i < career.step;
                return (
                  <View key={s} style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-start' }}>
                    <View style={{ alignItems: 'center', width: 52 }}>
                      <Shadowed offset={here ? 3 : 0} shadowColor={colors.yellowShadow}>
                        <View style={{ width: 20, height: 20, borderWidth: 2, borderColor: C, backgroundColor: done || here ? colors.mint : '#fff', alignItems: 'center', justifyContent: 'center' }}>
                          <Text style={{ fontFamily: fonts.heading, fontSize: 9, color: C }}>{done ? '✓' : i + 1}</Text>
                        </View>
                      </Shadowed>
                      <Text style={{ fontFamily: fonts.body, fontSize: 8, color: done || here ? C : colors.textFaint, marginTop: 4, textAlign: 'center' }}>{s}</Text>
                      {here && <Text style={{ fontFamily: fonts.heading, fontSize: 7, color: colors.yellowShadow, marginTop: 1 }}>● HERE</Text>}
                    </View>
                    {i < 3 && <View style={{ flex: 1, height: 2, backgroundColor: done ? colors.mint : '#2A252233', marginTop: 9 }} />}
                  </View>
                );
              })}
            </View>
          </View>
        </Shadowed>

        {/* badges */}
        <View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
            <Text style={{ fontFamily: fonts.heading, fontSize: 14, color: C }}>🎖 커리어 뱃지</Text>
            <Text style={{ fontFamily: fonts.body, fontSize: 11, color: colors.textSoft }}>{gotCount} / {BADGE_TOTAL}</Text>
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {badges.map((b, i) => {
              // earned = white tile + ink shadow; special earned = yellow + NEW ribbon; locked = flat cream.
              const bg = !b.got ? colors.cream : b.special ? colors.yellow : '#fff';
              return (
                <Shadowed key={i} offset={b.got ? 3 : 0} shadowColor={b.special ? colors.yellowShadow : C} style={{ width: '22.5%' }}>
                  <View style={{ aspectRatio: 0.85, borderWidth: b.got ? 3 : 2, borderColor: C, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 22, opacity: b.got ? 1 : 0.35 }}>{b.e}</Text>
                    <Text style={{ fontFamily: fonts.body, fontSize: 8, color: b.got ? C : colors.textFaint, marginTop: 3 }}>{b.l}</Text>
                    {b.got && b.special && (
                      <View style={{ position: 'absolute', top: -4, right: -4, backgroundColor: '#EF4444', borderWidth: 1.5, borderColor: C, paddingHorizontal: 3 }}>
                        <Text style={{ fontFamily: fonts.heading, fontSize: 7, color: '#fff' }}>NEW</Text>
                      </View>
                    )}
                  </View>
                </Shadowed>
              );
            })}
          </View>
        </View>

        {/* review lab teaser → review tab */}
        <Pressable onPress={() => router.push('/lab')}>
          <Shadowed offset={4}>
            <View style={{ backgroundColor: colors.lilac, borderWidth: 3, borderColor: C, padding: 14, gap: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
                <View style={{ width: 40, height: 40, backgroundColor: '#fff', borderWidth: 2, borderColor: C, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 22 }}>📓</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: fonts.heading, fontSize: 14, color: C }}>리뷰랩 · 오답노트</Text>
                  <Text style={{ fontFamily: fonts.body, fontSize: 11, color: colors.text, marginTop: 4, lineHeight: 16 }}>AI가 교정한 문장이 <Text style={{ fontFamily: fonts.heading }}>'현지인처럼 말하기'</Text> 카드로 변환됐어요.</Text>
                </View>
              </View>
              {/* corrected-phrase example box */}
              <View style={{ backgroundColor: '#fff', borderWidth: 2, borderColor: C, paddingVertical: 8, paddingHorizontal: 10 }}>
                <Text style={{ fontFamily: fonts.body, fontSize: 11, color: colors.textFaint, textDecorationLine: 'line-through' }}>I want to ask about your pain.</Text>
                <Text style={{ fontFamily: fonts.body, fontSize: 11, color: C, marginTop: 2 }}>→ <Text style={{ backgroundColor: colors.mint }}>Can you tell me about your pain?</Text></Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <PixelButton label="리뷰랩 열기 ▶" bg={colors.yellow} shadowColor={colors.yellowShadow} offset={2} fontSize={11} borderWidth={2} paddingV={5} paddingH={10} onPress={() => router.push('/lab')} />
              </View>
            </View>
          </Shadowed>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function RepRow({ label, value, color }: { label: string; value: number; color: string }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 5 }}>
      <Text style={{ width: 78, fontFamily: fonts.body, fontSize: 11, color: C }}>{label}</Text>
      <View style={{ flex: 1, height: 12, backgroundColor: colors.cream, borderWidth: 2, borderColor: C }}>
        <View style={{ width: `${pct}%`, height: '100%', backgroundColor: color }} />
      </View>
      <Text style={{ width: 34, textAlign: 'right', fontFamily: fonts.heading, fontSize: 11, color: C }}>{pct}%</Text>
    </View>
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
