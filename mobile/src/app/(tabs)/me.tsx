// 나 (profile) tab — the player's ID card wired to the real growth system
// (GET /me + /me/progress): rank, level + XP bar, reputation stats, a growth
// summary, a career-path stepper, milestone badges, and a review-lab teaser.
// 1:1 in spirit with the v17 handoff ScreenProfile, scaled to live data.
import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { PixelButton } from '@/components/PixelButton';
import { PixelChip } from '@/components/PixelChip';
import { InfoSheet, type InfoSheetData } from '@/components/InfoSheet';
import { FacePlayer } from '@engine';
import { api, type Progress } from '@/api/client';
import { earnedBadges } from '@/data/badges';
import { earnedTitles, foundMissions, titleById, MISSIONS, type GrowthInput } from '@/data/titles';
import { ECON, careerFor } from '@/data/economy';
import { colors, fonts, space, type as t } from '@/theme/tokens';

const C = colors.ink;

export default function Me() {
  const router = useRouter();
  const [progress, setProgress] = useState<Progress | null>(null);
  const [enLevel, setEnLevel] = useState<string>('');
  const [scenariosTotal, setScenariosTotal] = useState(0);
  const [equipped, setEquipped] = useState<string>('');
  const [foundIds, setFoundIds] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<{ name: string; reward: string } | null>(null);
  const [state, setState] = useState<'loading' | 'error' | 'ok'>('loading');
  const [sheet, setSheet] = useState<InfoSheetData | null>(null);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      (async () => {
        try {
          const [p, me, stats, found] = await Promise.all([
            api.progress(), api.me().catch(() => null), api.growthStats().catch(() => null), api.missions().catch(() => [] as string[]),
          ]);
          if (!alive) return;
          setProgress(p);
          const prof = (me as { profile?: { targetLevel?: string; equippedTitle?: string } } | null)?.profile;
          setEnLevel(prof?.targetLevel || '');
          setEquipped(prof?.equippedTitle || '');
          setScenariosTotal(stats?.scenariosTotal ?? 0);

          // Detect newly-met missions not yet recorded → persist + celebrate.
          const g: GrowthInput = {
            level: p.level, xp: p.xp, streakLongest: p.streakLongest,
            patientSatisfaction: p.patientSatisfaction, peerTrust: p.peerTrust, emergencyResponse: p.emergencyResponse,
            scenariosTotal: stats?.scenariosTotal ?? 0,
          };
          const set = new Set(found);
          const fresh = foundMissions(g).filter((m) => !set.has(m.id));
          for (const m of fresh) {
            set.add(m.id);
            try { await api.recordMission(m.id); } catch { /* best-effort */ }
          }
          if (alive) {
            setFoundIds(set);
            if (fresh.length) { setToast({ name: fresh[0].name, reward: fresh[0].reward }); setTimeout(() => alive && setToast(null), 3200); }
            setState('ok');
          }
        } catch {
          if (alive) setState('error');
        }
      })();
      return () => { alive = false; };
    }, []),
  );

  const equip = async (titleId: string) => {
    setEquipped(titleId); // optimistic
    setSheet(null);
    try { await api.equipTitle(titleId); } catch { /* best-effort; refreshes on next focus */ }
  };

  if (state !== 'ok' || !progress) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.paper, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 }}>
        {state === 'loading' ? <ActivityIndicator color={C} /> : <Text style={{ fontFamily: fonts.body, fontSize: t.body, color: colors.textSoft, textAlign: 'center' }}>프로필을 불러오지 못했어요. (로그인·서버 확인)</Text>}
      </View>
    );
  }

  const { level, xp, streakCurrent, streakLongest, patientSatisfaction, peerTrust, emergencyResponse } = progress;
  const career = careerFor(level);
  const inLevel = xp % ECON.xpPerLevel;

  const badges = earnedBadges({ xp, level, streakLongest });
  const gotCount = badges.filter((b) => b.got).length;
  const BADGE_TOTAL = 24; // full career-badge pool (handoff shows collection vs 24)

  const growth: GrowthInput = { level, xp, streakLongest, patientSatisfaction, peerTrust, emergencyResponse, scenariosTotal };
  const titles = earnedTitles(growth, foundIds.size); // hidden_hero earned = permanent discoveries
  const equippedTitle = titleById(equipped);

  // open a title detail sheet, with an 장착/장착 해제 action when earned
  const openTitle = (id: string) => {
    const tdef = titles.find((x) => x.id === id);
    if (!tdef) return;
    const isEquipped = equipped === id;
    setSheet({
      icon: tdef.emoji, iconBg: tdef.got ? colors.lilac : colors.cream, title: tdef.got ? tdef.name : '???',
      status: { label: isEquipped ? '● 장착 중' : tdef.got ? '✓ 보유' : '🔒 미보유', bg: isEquipped ? colors.yellow : tdef.got ? colors.mint : colors.cream },
      what: tdef.got ? tdef.desc + (tdef.effect ? `\n\n✨ 효과: ${tdef.effect}` : '') : '아직 보유하지 않은 칭호예요.',
      how: tdef.how,
      action: tdef.got ? { label: isEquipped ? '장착 해제' : '장착하기', bg: isEquipped ? '#fff' : colors.yellow, onPress: () => equip(isEquipped ? '' : id) } : undefined,
    });
  };

  const openMission = (id: string) => {
    const m = MISSIONS.find((x) => x.id === id);
    if (!m) return;
    const done = foundIds.has(id);
    setSheet({
      icon: done ? '🎉' : '❔', iconBg: done ? colors.mint : colors.cream, title: done ? m.name : '숨겨진 미션',
      status: { label: done ? '✓ 발견!' : '🔒 미발견', bg: done ? colors.mint : colors.cream },
      what: done ? `히든 미션 '${m.name}'을 발견했어요!` : `힌트: ${m.hint}`,
      how: `보상: ${m.reward}`,
    });
  };

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
              {/* avatar — same pixel portrait as the dialogue player frame.
                  alignSelf flex-start stops the shadow box from stretching to
                  the row's full height (the row defaults to alignItems:stretch). */}
              <Shadowed offset={3} style={{ alignSelf: 'flex-start' }}>
                <View style={{ width: 80, height: 96, backgroundColor: colors.peach, borderWidth: 3, borderColor: C, overflow: 'hidden', alignItems: 'center', justifyContent: 'flex-end' }}>
                  <View style={{ position: 'absolute', left: 5, top: 5, right: 5, bottom: 5, backgroundColor: 'rgba(255,255,255,0.4)' }} />
                  <FacePlayer size={86} />
                </View>
              </Shadowed>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={{ fontFamily: fonts.heading, fontSize: 10, color: colors.textSoft }}>RANK</Text>
                <Text style={{ fontFamily: fonts.heading, fontSize: 18, color: C }}>{career.label}</Text>
                {!!equippedTitle && (
                  <View style={{ alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3, backgroundColor: colors.lilac, borderWidth: 2, borderColor: C, paddingVertical: 1, paddingHorizontal: 6 }}>
                    <Text style={{ fontSize: 10 }}>{equippedTitle.emoji}</Text>
                    <Text style={{ fontFamily: fonts.heading, fontSize: 9, color: C }}>{equippedTitle.name}</Text>
                  </View>
                )}
                <Text style={{ fontFamily: fonts.body, fontSize: 11, color: colors.textSoft, marginTop: 2 }}>EN-US · 미국 종합병원</Text>
                {/* xp bar */}
                <View style={{ marginTop: 10 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontFamily: fonts.heading, fontSize: 9, color: colors.textSoft }}>LV {level}</Text>
                    <Text style={{ fontFamily: fonts.heading, fontSize: 9, color: colors.textSoft }}>{inLevel} / {ECON.xpPerLevel}</Text>
                    <Text style={{ fontFamily: fonts.heading, fontSize: 9, color: colors.textSoft }}>LV {level + 1}</Text>
                  </View>
                  <View style={{ height: 10, backgroundColor: colors.cream, borderWidth: 2, borderColor: C, marginTop: 3 }}>
                    <View style={{ width: `${(inLevel / ECON.xpPerLevel) * 100}%`, height: '100%', backgroundColor: colors.mint }} />
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

        {/* growth summary → 성장 리포트 상세 (/growth) */}
        <Pressable onPress={() => router.push('/growth')}>
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
        </Pressable>

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
              const open = () => setSheet({
                icon: b.e, iconBg: bg, title: b.got ? b.name : '???',
                status: { label: b.got ? '✓ 획득' : '🔒 잠김', bg: b.got ? colors.mint : colors.cream },
                what: b.what, how: b.how,
              });
              return (
                <Shadowed key={i} offset={b.got ? 3 : 0} shadowColor={b.special ? colors.yellowShadow : C} style={{ width: '22.5%' }}>
                  <Pressable onPress={open} style={{ aspectRatio: 1, borderWidth: b.got ? 3 : 2, borderColor: C, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 22, opacity: b.got ? 1 : 0.35 }}>{b.e}</Text>
                    <Text style={{ fontFamily: fonts.body, fontSize: 8, color: b.got ? C : colors.textFaint, marginTop: 3 }}>{b.l}</Text>
                    {b.got && b.special && (
                      <View style={{ position: 'absolute', top: -4, right: -4, backgroundColor: '#EF4444', borderWidth: 1.5, borderColor: C, paddingHorizontal: 3 }}>
                        <Text style={{ fontFamily: fonts.heading, fontSize: 7, color: '#fff' }}>NEW</Text>
                      </View>
                    )}
                  </Pressable>
                </Shadowed>
              );
            })}
          </View>
        </View>

        {/* titles (칭호) — tap to view / equip */}
        <View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
            <Text style={{ fontFamily: fonts.heading, fontSize: 14, color: C }}>🏷 칭호</Text>
            <Text style={{ fontFamily: fonts.body, fontSize: 11, color: colors.textSoft }}>{titles.filter((x) => x.got).length} / {titles.length}</Text>
          </View>
          <View style={{ gap: 8 }}>
            {titles.map((tt) => {
              const isEq = equipped === tt.id;
              return (
                <Shadowed key={tt.id} offset={tt.got ? 3 : 0} shadowColor={isEq ? colors.yellowShadow : C + '33'}>
                  <Pressable onPress={() => openTitle(tt.id)} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: isEq ? colors.lilac : tt.got ? '#fff' : colors.cream, borderWidth: isEq ? 3 : 2, borderColor: C, paddingVertical: 9, paddingHorizontal: 12 }}>
                    <Text style={{ fontSize: 22, opacity: tt.got ? 1 : 0.35 }}>{tt.emoji}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontFamily: fonts.heading, fontSize: 13, color: tt.got ? C : colors.textFaint }}>{tt.got ? tt.name : '???'}{tt.warm ? ' ✨' : ''}</Text>
                      <Text style={{ fontFamily: fonts.body, fontSize: 10, color: colors.textSoft, marginTop: 2 }}>{tt.got ? tt.desc : tt.how}</Text>
                    </View>
                    {isEq
                      ? <View style={{ backgroundColor: colors.yellow, borderWidth: 1.5, borderColor: C, paddingVertical: 1, paddingHorizontal: 5 }}><Text style={{ fontFamily: fonts.heading, fontSize: 8, color: C }}>장착</Text></View>
                      : tt.got && <Text style={{ fontFamily: fonts.heading, fontSize: 14, color: C }}>▶</Text>}
                  </Pressable>
                </Shadowed>
              );
            })}
          </View>
        </View>

        {/* hidden missions (히든미션) — hint until discovered */}
        <View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
            <Text style={{ fontFamily: fonts.heading, fontSize: 14, color: C }}>🔍 히든 미션</Text>
            <Text style={{ fontFamily: fonts.body, fontSize: 11, color: colors.textSoft }}>{foundIds.size} / {MISSIONS.length}</Text>
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {MISSIONS.map((m) => {
              const done = foundIds.has(m.id);
              return (
                <Shadowed key={m.id} offset={done ? 3 : 0} shadowColor={done ? colors.mintShadow : C + '33'} style={{ width: '31.5%' }}>
                  <Pressable onPress={() => openMission(m.id)} style={{ aspectRatio: 1, borderWidth: done ? 3 : 2, borderColor: C, backgroundColor: done ? colors.mint : colors.cream, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 }}>
                    <Text style={{ fontSize: 22 }}>{done ? '🎉' : '❔'}</Text>
                    <Text style={{ fontFamily: fonts.body, fontSize: 8, color: done ? C : colors.textFaint, marginTop: 3, textAlign: 'center' }}>{done ? m.name : '???'}</Text>
                  </Pressable>
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

      {/* hidden-mission discovery celebration */}
      {toast && (
        <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, bottom: 28, alignItems: 'center', paddingHorizontal: 18 }}>
          <Shadowed offset={4} shadowColor={colors.yellowShadow}>
            <View style={{ backgroundColor: colors.yellow, borderWidth: 3, borderColor: C, paddingVertical: 12, paddingHorizontal: 18, alignItems: 'center', minWidth: 260 }}>
              <Text style={{ fontFamily: fonts.heading, fontSize: 14, color: C }}>🎉 히든 미션 발견!</Text>
              <Text style={{ fontFamily: fonts.body, fontSize: 12, color: C, marginTop: 4 }}>{toast.name}</Text>
              <Text style={{ fontFamily: fonts.body, fontSize: 11, color: colors.textSoft, marginTop: 4 }}>보상: {toast.reward}</Text>
            </View>
          </Shadowed>
        </View>
      )}

      <InfoSheet data={sheet} onClose={() => setSheet(null)} />
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
