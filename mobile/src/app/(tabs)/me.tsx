// 나 (profile) tab — the player's ID card wired to the real growth system
// (GET /me + /me/progress): rank, level + XP bar, reputation stats, a growth
// summary, a career-path stepper, the title collection, and a review-lab teaser.
// 1:1 in spirit with the v17 handoff ScreenProfile, scaled to live data.
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View , useWindowDimensions } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { NbIcon } from '@/components/nb/NbIcon';
import { NbButton, NbGauge, NbMark, NbPaper, NbStamp, NbTag, nbText } from '@/components/nb/NbUI';
import { RULE_COLOR, RULE_H, nb, nbFonts } from '@/theme/nb';
import { PixelButton } from '@/components/PixelButton';
import { PixelChip } from '@/components/PixelChip';
import { InfoSheet, type InfoSheetData } from '@/components/InfoSheet';
import { api, type Colleague, type GrowthStats, type InviteCode, type Progress } from '@/api/client';
import { signOut } from '@/lib/auth';
import { earnedTitles, foundMissions, titleById, MISSIONS, type GrowthInput } from '@/data/titles';
import { ECON, careerFor } from '@/data/economy';
import { space, type as typeScale } from '@/theme/tokens';
import { isSfxMuted, playSfx, setSfxMuted } from '@/lib/sfx';
import { LOCALES, LOCALE_META, adoptProfileLocale, completenessLabel, setLocale, t, type Locale, useLocale, useT } from '@/i18n';
import { BottomSheet } from '@/components/BottomSheet';
import { useMyAvatar } from '@/hooks/useMyAvatar';
import { NbAvatar } from '@/components/nb/NbAvatar';
import { adoptAvatar } from '@/lib/nbAvatar';
import { NameSheet } from '@/components/me/NameSheet';

const C = nb.ink;

// Bars cycle this palette, so a profession with more (or fewer) dimensions than
// nursing's three still renders without a code change.

// repMap flattens the server's ordered standings for threshold checks.
const repMap = (st: Progress['reputation']) =>
  Object.fromEntries(st.map((s) => [s.key, s.value]));

export default function Me() {
  const t = useT();
  const myFace = useMyAvatar();
  const router = useRouter();
  const [progress, setProgress] = useState<Progress | null>(null);
  const [enLevel, setEnLevel] = useState<string>('');
  const [scenariosTotal, setScenariosTotal] = useState(0);
  // The whole growth snapshot, not just the total: the hidden titles read today's
  // and this week's activity, and those live nowhere else on this screen.
  const [stats, setStats] = useState<GrowthStats | null>(null);
  const [equipped, setEquipped] = useState<string>('');
  // '' means the learner has not chosen one; the row then shows the placeholder and
  // other people see user.ShortID.
  const [displayName, setDisplayName] = useState<string>('');
  const [nameOpen, setNameOpen] = useState(false);
  const [foundIds, setFoundIds] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<{ name: string; reward: string } | null>(null);
  const [state, setState] = useState<'loading' | 'error' | 'ok'>('loading');
  const [sheet, setSheet] = useState<InfoSheetData | null>(null);
  const [signingOut, setSigningOut] = useState(false);
  const [colleagues, setColleagues] = useState<Colleague[]>([]);
  const [invite, setInvite] = useState<InviteCode | null>(null);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      (async () => {
        try {
          const [p, me, stats, found, mates, code] = await Promise.all([
            api.progress(), api.me().catch(() => null), api.growthStats().catch(() => null), api.missions().catch(() => [] as string[]),
            api.colleagues().catch(() => ({ colleagues: [] as Colleague[], pendingRequests: 0, unreadCheers: 0 })),
            api.inviteCode().catch(() => null),
          ]);
          if (!alive) return;
          setProgress(p);
          const prof = (me as { profile?: { targetLevel?: string; equippedTitle?: string; nativeLang?: string; targetLang?: string; displayName?: string; avatar?: unknown } } | null)?.profile;
          // The portrait rides along with the profile read that was already happening.
          // The user id is what seeds a face for a learner who never opened the picker,
          // so it matters as much as the stored spec.
          adoptAvatar((me as { user?: { id?: string } } | null)?.user?.id ?? '', prof?.avatar);
          setEnLevel(prof?.targetLevel || '');
          setEquipped(prof?.equippedTitle || '');
          setDisplayName(prof?.displayName || '');
          setTargetLang(prof?.targetLang || '');
          // 온보딩에서 고른 모국어를 UI 언어로 채택하되, 아래 설정을 한 번이라도
          // 만졌다면 그쪽이 이긴다(R2).
          adoptProfileLocale(prof?.nativeLang);
          setStats(stats);
          setScenariosTotal(stats?.scenariosTotal ?? 0);
          setColleagues(mates.colleagues);
          setInvite(code);

          // Detect newly-met missions not yet recorded → persist + celebrate.
          const g: GrowthInput = {
            level: p.level, xp: p.xp, streakLongest: p.streakLongest, streakCurrent: p.streakCurrent,
            rep: repMap(p.reputation),
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
            if (fresh.length) { setToast({ name: t(fresh[0].nameKey), reward: t(fresh[0].rewardKey) }); setTimeout(() => alive && setToast(null), 3200); }
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

  // Sign out — drops the session on this device, so confirm first. On success we
  // navigate away and the screen unmounts, so `signingOut` is only cleared on failure.
  // 앱 언어. useLocale()을 구독하므로 여기서 바꾸면 화면이 즉시 다시 그려진다 —
  // 재시작이 필요하면 "설정에서 바꿀 수 있다"가 절반만 참이다.
  const locale = useLocale();
  const [langOpen, setLangOpen] = useState(false);
  const [targetLang, setTargetLang] = useState('');

  // 효과음 on/off. 저장 실패해도 이 세션에는 반영되므로 낙관적으로 그린다.
  const [sfxOn, setSfxOn] = useState(!isSfxMuted());
  const toggleSfx = () => {
    const next = !sfxOn;
    setSfxOn(next);
    // Both directions make a sound, and the OFF one has to be played BEFORE muting —
    // playSfx checks the flag when it is called.
    //
    // Reported as "every second tap makes a sound, one tap makes none", and this
    // control was producing exactly that: turning sound off cannot be confirmed by a
    // sound if you mute first, so alternate taps were silent by construction. A
    // switch that only answers half its taps reads as broken, and a farewell blip on
    // the way out is the last thing the speaker does — which is itself the
    // confirmation.
    if (next) {
      void setSfxMuted(false);
      playSfx('confirm');
    } else {
      playSfx('back');
      void setSfxMuted(true);
    }
  };

  const confirmSignOut = () => {
    Alert.alert(t('settings.account.signOut'), t('settings.account.signOutConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('settings.account.signOut'),
        style: 'destructive',
        onPress: async () => {
          setSigningOut(true);
          try {
            await signOut();
            // The passport's COVER is the app's only sign-in surface (v31 flow page 0):
            // green, gold, three provider buttons. Signing out used to land on a second,
            // paper-coloured login screen, so the first thing after signing out was a
            // door that did not look like the one everyone came in through.
            router.replace('/passport');
          } catch {
            setSigningOut(false);
            Alert.alert(t('settings.account.signOutFailed'), t('common.retryHint'));
          }
        },
      },
    ]);
  };

  if (state !== 'ok' || !progress) {
    return (
      <View style={{ flex: 1, backgroundColor: nb.paper, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 }}>
        {state === 'loading' ? <ActivityIndicator color={C} /> : <Text style={{ fontFamily: nbFonts.body, fontSize: typeScale.body, color: nb.soft, textAlign: 'center' }}>프로필을 불러오지 못했어요. (로그인·서버 확인)</Text>}
      </View>
    );
  }

  const { level, xp, streakCurrent, streakLongest } = progress;
  const career = careerFor(level);
  const inLevel = xp % ECON.xpPerLevel;


  // The day/week signals are what the light-hearted hidden titles read. Without them
  // those titles could never fire on the one screen that displays the collection.
  const growth: GrowthInput = {
    level, xp, streakLongest, streakCurrent,
    rep: repMap(progress.reputation), scenariosTotal,
    scenariosToday: stats?.scenariosToday,
    conversationSecondsToday: stats?.conversationSecondsToday,
    newCardsWeek: stats?.newCardsWeek,
  };
  const titles = earnedTitles(growth, foundIds.size); // hidden_hero earned = permanent discoveries
  const equippedTitle = titleById(equipped);

  // open a title detail sheet, with an 장착/장착 해제 action when earned
  const openTitle = (id: string) => {
    const tdef = titles.find((x) => x.id === id);
    if (!tdef) return;
    const isEquipped = equipped === id;
    setSheet({
      icon: tdef.emoji, iconNode: <NbIcon name={tdef.nbIcon} size={34} />, iconBg: tdef.got ? 'rgba(195,177,232,.35)' : nb.cream, title: tdef.got ? t(tdef.nameKey) : '???',
      status: { label: isEquipped ? t('title.equipped') : tdef.got ? t('title.owned') : t('title.notOwned'), bg: isEquipped ? 'rgba(249,227,123,.5)' : tdef.got ? 'rgba(168,217,151,.4)' : nb.cream },
      what: tdef.got ? t(tdef.descKey) + (tdef.effectKey ? `\n\n${t('title.effectLabel')}: ${t(tdef.effectKey)}` : '') : t('title.notOwnedBody'),
      how: t(tdef.howKey),
      action: tdef.got ? { label: isEquipped ? t('title.unequip') : t('title.equip'), bg: isEquipped ? '#fff' : 'rgba(249,227,123,.5)', onPress: () => equip(isEquipped ? '' : id) } : undefined,
    });
  };

  const openMission = (id: string) => {
    const m = MISSIONS.find((x) => x.id === id);
    if (!m) return;
    const done = foundIds.has(id);
    setSheet({
      icon: '', iconNode: done ? <NbIcon name={m.nbIcon} size={34} /> : <Text style={nbText.hand(30, nb.soft)}>?</Text>, iconBg: done ? 'rgba(168,217,151,.4)' : nb.cream, title: done ? t(m.nameKey) : t('mission.hiddenTitle'),
      status: { label: done ? t('mission.found') : t('mission.notFound'), bg: done ? 'rgba(168,217,151,.4)' : nb.cream },
      what: done ? t('mission.foundBody', { name: t(m.nameKey) }) : t('mission.hintBody', { hint: t(m.hintKey) }),
      how: t('mission.rewardBody', { reward: t(m.rewardKey) }),
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: nb.cream }}>
      <Rules />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 56, paddingBottom: 40, gap: 14 }}>
        <Text style={nbText.hand(30)}>{t('me.nbTitle')}</Text>

        {/* ── 사원증 ──
            A staff pass, not a bordered box: the photo is a print with its own margin, the
            name is written on a ruled line the way a pass is filled in by hand, and RANK is
            typed because that part is issued rather than written. */}
        <NbPaper rot={-0.6} tape tapeLeft={140} style={{ paddingVertical: 14, paddingHorizontal: 14, flexDirection: 'row', gap: 14 }}>
              {/* Tapping the portrait edits it. The pencil is the only thing that says so —
                  an ID photo does not otherwise look interactive. */}
              <Pressable onPress={() => { playSfx('tap'); router.push('/avatar'); }} style={{ alignSelf: 'flex-start' }}>
                <NbPaper rot={-2} style={{ paddingTop: 6, paddingHorizontal: 6, paddingBottom: 3 }}>
                  {/* The v32 portrait. The pixel sprite it replaced lived on the device
                      only, so it reset on reinstall and nobody else could see it — and
                      this face now turns up on other people's screens. */}
                  <NbAvatar spec={myFace ?? undefined} size={78} />
                </NbPaper>
                <View style={{ position: 'absolute', bottom: -4, right: -6, backgroundColor: 'rgba(249,227,123,.9)', borderWidth: 1.5, borderColor: nb.ink, borderRadius: 3, width: 21, height: 21, alignItems: 'center', justifyContent: 'center' }}>
                  <NbIcon name="pencil" size={12} />
                </View>
              </Pressable>

              <View style={{ flex: 1, minWidth: 0 }}>
                {/* The name goes ABOVE the rank, and the handoff has no slot for it — there
                    was no name in the product at all. Rank is what you are; this is who you
                    are, and it is the thing a colleague list needs. Written on a ruled line,
                    which is what says it is yours to fill in. */}
                <Pressable
                  onPress={() => { playSfx('tap'); setNameOpen(true); }}
                  hitSlop={6}
                  style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 5, borderBottomWidth: 1.5, borderBottomColor: 'rgba(62,54,43,.35)', paddingBottom: 2 }}
                >
                  <Text
                    numberOfLines={1}
                    style={[nbText.hand(20, displayName ? nb.ink : nb.placeholder), { flexShrink: 1 }]}
                  >
                    {displayName || t('profile.namePlaceholder')}
                  </Text>
                  <NbIcon name="pencil" size={13} color={nb.soft} />
                </Pressable>
                <Text style={{ fontFamily: nbFonts.monoBold, fontSize: 9.5, letterSpacing: 2, color: nb.soft, marginTop: 6 }}>RANK</Text>
                <Text numberOfLines={1} style={[nbText.hand(19), { marginTop: 1 }]}>{career.label}</Text>
                {!!equippedTitle && (
                  <View style={{ marginTop: 4 }}>
                    <NbTag color="#7C3AED">{t(equippedTitle.nameKey)}</NbTag>
                  </View>
                )}
                <Text numberOfLines={1} style={[nbText.body(10.5, nb.soft), { marginTop: 3 }]}>
                  {t('me.postedAt', { lang: (enLevel ? `EN ${enLevel}` : 'EN'), place: t('country.us') })}
                </Text>
                {/* The level, as a pencil gauge. A filled bar is a progress bar; hatching is
                    something somebody drew in. */}
                <View style={{ marginTop: 10 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={nbText.mono(9)}>LV {level}</Text>
                    <Text style={nbText.mono(9)}>{inLevel} / {ECON.xpPerLevel}</Text>
                    <Text style={nbText.mono(9)}>LV {level + 1}</Text>
                  </View>
                  <View style={{ marginTop: 4 }}>
                    <NbGauge value={(inLevel / ECON.xpPerLevel) * 100} />
                  </View>
                </View>
              </View>
          {/* Nothing below the identity block. Reputation gauges lived here and were asked
              to go; an invite code briefly replaced them, which was worse — it was never
              asked for, and a card does not need a field just because the space opened up.
              The code already has its own row further down. */}
        </NbPaper>

        {/* growth summary → 성장 리포트 상세 (/growth) */}
        <Pressable onPress={() => router.push('/growth')}>
          {/* Washed green, as the handoff draws it: the one banner on this page that is an
              invitation rather than a record, so it is the one with a colour. */}
          <NbPaper rot={0.5} bg="rgba(95,141,90,.13)" style={{ padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{ width: 38, height: 38, alignItems: 'center', justifyContent: 'center' }}>
                <NbIcon name="chartup" size={22} />
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text numberOfLines={1} style={nbText.hand(17)}>{t('me.growthTitle')}</Text>
                <Text numberOfLines={1} style={[nbText.body(11, nb.soft), { marginTop: 3 }]}>
                  {t('me.growthSub', { lv: level, xp: xp.toLocaleString(), n: streakCurrent })}
                </Text>
              </View>
              <NbIcon name="chevronRight" size={16} color={nb.soft} />
          </NbPaper>
        </Pressable>

        {/* 내 동료 — 관리 소유권은 프로필에 있다(홈은 오늘 활동만 보여주고 여기로 보낸다) */}
        <View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <NbIcon name="handshake2" size={17} />
              <Text style={nbText.hand(17)}>{t('me.colleaguesTitle')}</Text>
            </View>
            <Pressable onPress={() => router.push('/colleagues')} hitSlop={6} style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
              <Text numberOfLines={1} style={nbText.hand(14, nb.soft)}>{t('me.colleaguesAll', { n: colleagues.length })}</Text>
              <NbIcon name="chevronRight" size={12} color={nb.soft} />
            </Pressable>
          </View>
          <NbPaper rot={0.4} style={{ padding: 12 }}>
              {colleagues.length === 0 ? (
                <Text style={nbText.hand(15, nb.soft)}>
                  {t('me.noColleagues')}
                </Text>
              ) : (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  {colleagues.slice(0, 8).map((c) => (
                    <Pressable
                      key={c.id}
                      onPress={() => router.push(`/colleagues/${c.id}`)}
                      style={{ alignItems: 'center', width: '21%' }}
                    >
                      <NbPaper rot={-1} style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
                        <NbIcon name="me" size={22} />
                      </NbPaper>
                      <Text numberOfLines={1} style={[nbText.hand(13), { marginTop: 3 }]}>{c.name}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12, paddingTop: 11, borderTopWidth: 2, borderTopColor: C + '22' }}>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={nbText.body(10, nb.soft)}>{t('me.myCode')}</Text>
                  {/* The code is TYPED — it is issued, not written, and it has to be read
                      out loud to somebody. */}
                  <Text style={{ fontFamily: nbFonts.monoBold, fontSize: 15, letterSpacing: 2, color: nb.ink, marginTop: 2 }}>
                    {invite?.code ?? '· · · ·'}
                  </Text>
                </View>
                <NbButton variant="yellow" size="sm" icon="handshake2" onPress={() => router.push('/colleagues/add')}>
                  {t('me.addColleague')}
                </NbButton>
              </View>
          </NbPaper>
        </View>

        {/* career path */}
        <NbPaper rot={-0.4} style={{ padding: 12 }}>
            {/* CAREER PATH, typed: it is the ladder the hospital publishes, not something
                the nurse wrote for herself. */}
            <Text style={{ fontFamily: nbFonts.monoBold, fontSize: 9.5, letterSpacing: 2, color: nb.soft, marginBottom: 10 }}>CAREER PATH</Text>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
              {['Learner', 'Junior', 'Senior', 'Head Nurse'].map((s, i) => {
                const here = i === career.step;
                const done = i < career.step;
                return (
                  <View key={s} style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-start' }}>
                    <View style={{ alignItems: 'center', width: 52 }}>
                      {/* A step you have taken is TICKED, not filled: a pen goes through
                          a box on a form, and a filled square says nothing about who did
                          it. The one you are on is ringed instead — the same gold the app
                          uses for "this is the one you chose". */}
                      <View style={{
                        width: 21, height: 21, borderRadius: 4, borderWidth: here ? 2 : 1.5,
                        borderColor: here ? '#C99A1E' : done ? nb.green : nb.soft,
                        backgroundColor: done ? 'rgba(95,141,90,.12)' : 'transparent',
                        alignItems: 'center', justifyContent: 'center',
                      }}>
                        {done
                          ? <NbIcon name="check" size={14} color={nb.green} />
                          : <Text style={nbText.hand(13, here ? nb.ink : nb.soft)}>{i + 1}</Text>}
                      </View>
                      <Text numberOfLines={1} style={[nbText.body(8.5, done || here ? nb.ink : nb.soft), { marginTop: 4, textAlign: 'center' }]}>{s}</Text>
                      {here && <Text numberOfLines={1} style={{ fontFamily: nbFonts.monoBold, fontSize: 7.5, letterSpacing: 1, color: '#C99A1E', marginTop: 2 }}>HERE</Text>}
                    </View>
                    {i < 3 && <View style={{ flex: 1, height: 1.5, backgroundColor: done ? nb.green : 'rgba(62,54,43,.2)', marginTop: 10 }} />}
                  </View>
                );
              })}
            </View>
        </NbPaper>

        {/* The one collection. Badges used to sit above this as a second grid you
            could look at but not use; feedback asked for a single thing, so they
            moved into the catalog and this is the only place they live. */}
        <View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <NbIcon name="star" size={17} color="#C99A1E" />
              <Text style={nbText.hand(17)}>{t('title.section')}</Text>
            </View>
            <Text numberOfLines={1} style={nbText.hand(14, nb.soft)}>{titles.filter((x) => x.got).length} / {titles.length}</Text>
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {/* A grid, not a list. Fifteen full-width rows ran to roughly 700px and
                pushed everything under it off the screen; four per row is about 280.
                Nothing is lost — the description and the equip button already lived in
                the detail sheet a tap away, so the row was carrying text nobody could
                act on from there. */}
            {titles.map((tt) => {
              const isEq = equipped === tt.id;
              return (
                <Pressable key={tt.id} onPress={() => openTitle(tt.id)} style={{ width: '22.5%' }}>
                  <NbPaper
                    rot={tt.got ? -0.7 : 0.5}
                    bg={tt.got ? undefined : 'transparent'}
                    style={[
                      { aspectRatio: 0.86, alignItems: 'center', justifyContent: 'center', gap: 3, paddingHorizontal: 3 },
                      // Equipped: a violet edge, the one colour this grid uses for "the
                      // one on your card". Locked: no paper at all — an unclaimed title is
                      // a blank space on the page rather than a card you own.
                      isEq ? { borderWidth: 2, borderColor: '#7C3AED' } : null,
                      tt.got ? null : { borderStyle: 'dashed', borderColor: 'rgba(62,54,43,.25)' },
                    ]}
                  >
                    {/* A locked title is dimmed rather than tinted: the doodle carries its
                        own watercolour fill, and a colour override would only reach the
                        stroke. */}
                    <View style={{ opacity: tt.got ? 1 : 0.3 }}>
                      <NbIcon name={tt.nbIcon} size={22} />
                    </View>
                    <Text
                      numberOfLines={2}
                      style={[nbText.hand(12, tt.got ? nb.ink : nb.soft), { lineHeight: 14, textAlign: 'center' }]}
                    >
                      {tt.got ? t(tt.nameKey) : '???'}
                    </Text>
                    {/* The equipped one says so on the tile: it is the single title the
                        card shows, and hunting for it in a grid of fifteen is the one
                        thing the list did better. */}
                    {isEq && (
                      <View style={{ position: 'absolute', top: -6, right: -6 }}>
                        <NbTag color="#7C3AED" fill rot={-3}>{t('title.equippedShort')}</NbTag>
                      </View>
                    )}
                  </NbPaper>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* hidden missions (히든미션) — hint until discovered */}
        <View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <NbIcon name="magnify" size={17} />
              <Text style={nbText.hand(19)}>{t('me.hiddenMissions')}</Text>
            </View>
            <Text style={{ fontFamily: nbFonts.body, fontSize: 11, color: nb.soft }}>{foundIds.size} / {MISSIONS.length}</Text>
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {MISSIONS.map((m) => {
              const done = foundIds.has(m.id);
              return (
                <Pressable key={m.id} onPress={() => openMission(m.id)} style={{ width: '31.5%' }}>
                  {/* Found: a green-washed slip with its own doodle. Not found: a dim slip
                      with a pencilled "?" — the mission's name IS the reward, so the tile
                      cannot show it. */}
                  <NbPaper
                    rot={done ? -0.8 : 0.5}
                    bg={done ? 'rgba(95,141,90,.15)' : undefined}
                    style={[{ paddingTop: 14, paddingBottom: 10, alignItems: 'center' }, done ? null : { opacity: 0.5 }]}
                  >
                    {done
                      ? <NbIcon name={m.nbIcon} size={22} />
                      : <Text style={nbText.hand(19, nb.soft)}>?</Text>}
                    <Text numberOfLines={1} style={[nbText.hand(13.5, done ? nb.ink : nb.soft), { marginTop: 4 }]}>
                      {done ? t(m.nameKey) : '???'}
                    </Text>
                  </NbPaper>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* review lab teaser → review tab */}
        <Pressable onPress={() => router.push('/lab')}>
          <NbPaper rot={-0.5} style={{ padding: 14, gap: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
                <NbPaper rot={-2} style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
                  <NbIcon name="lab" size={21} />
                </NbPaper>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: nbFonts.hand, fontSize: 18.9, color: C }}>리뷰랩 · 오답노트</Text>
                  <Text style={{ fontFamily: nbFonts.body, fontSize: 11, color: nb.ink, marginTop: 4, lineHeight: 16 }}>AI가 교정한 문장이 <Text style={{ fontFamily: nbFonts.hand }}>{t('lab.likeALocal')}</Text> 카드로 변환됐어요.</Text>
                </View>
              </View>
              {/* One card, as it appears in the lab: struck out in red pen, then the
                  correction under a highlighter. */}
              <View style={{ borderWidth: 1.3, borderStyle: 'dashed', borderColor: 'rgba(62,54,43,.25)', borderRadius: 3, paddingVertical: 8, paddingHorizontal: 10 }}>
                <Text style={[nbText.body(11, nb.soft), { textDecorationLine: 'line-through', textDecorationColor: nb.red }]}>I want to ask about your pain.</Text>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 5, marginTop: 3 }}>
                  <Text style={[nbText.hand(14, nb.red), { transform: [{ rotate: '-4deg' }] }]}>{'\u2192'}</Text>
                  <NbMark textStyle={{ fontFamily: nbFonts.bodyMid, fontSize: 12 }}>Can you tell me about your pain?</NbMark>
                </View>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <NbButton variant="yellow" size="sm" iconRight="chevronRight" onPress={() => router.push('/lab')}>
                  {t('me.openLab')}
                </NbButton>
              </View>
          </NbPaper>
        </Pressable>

        {/* 언어 — UI 언어와 배우는 언어는 별개 축이다(R1). UI는 여기서 바꾸고,
            배우는 언어는 온보딩에서 고른 나라가 정하므로 읽기 전용으로 보여준다(R3). */}
        <View style={{ marginTop: space.sm }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <NbIcon name="speech" size={17} />
            <Text style={{ fontFamily: nbFonts.hand, fontSize: 18.9, color: C }}>{t('settings.language.section')}</Text>
          </View>
          <NbPaper rot={-0.3}>
            <View>
              <Pressable
                onPress={() => setLangOpen(true)}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 11, paddingHorizontal: 13 }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: nbFonts.hand, fontSize: 17.6, color: C }}>{t('settings.language.appTitle')}</Text>
                  <Text style={{ fontFamily: nbFonts.body, fontSize: 10, color: nb.soft, marginTop: 2 }}>
                    {t('settings.language.appSubOn', { name: LOCALE_META[locale].name })}
                  </Text>
                </View>
                <Text numberOfLines={1} style={nbText.hand(16)}>{LOCALE_META[locale].name}</Text>
                <NbIcon name="chevronRight" size={15} color={nb.soft} />
              </Pressable>
              {!!targetLang && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, paddingHorizontal: 13, borderTopWidth: 1.3, borderStyle: 'dashed', borderTopColor: 'rgba(62,54,43,.18)' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: nbFonts.hand, fontSize: 16.2, color: C }}>{t('settings.language.learning')}</Text>
                    <Text style={{ fontFamily: nbFonts.body, fontSize: 10, color: nb.soft, marginTop: 2 }}>
                      {t('settings.language.learningSub', { name: LOCALE_META[targetLang as Locale]?.name ?? targetLang })}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </NbPaper>
        </View>

        {/* 소리 — 효과음이 생겼으니 끌 수단도 있어야 한다. 병원/야근 환경에서
            무음으로 쓰는 사람이 있고, 껐다는 사실은 기기에 남는다. */}
        <View style={{ marginTop: space.sm }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <NbIcon name="speaker" size={17} />
            <Text style={{ fontFamily: nbFonts.hand, fontSize: 18.9, color: C }}>{t('settings.sound.section')}</Text>
          </View>
          <NbPaper rot={0.3}>
            <Pressable
              onPress={toggleSfx}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 11, paddingHorizontal: 13 }}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: nbFonts.hand, fontSize: 17.6, color: C }}>{t('settings.sound.title')}</Text>
                <Text style={{ fontFamily: nbFonts.body, fontSize: 10, color: nb.soft, marginTop: 2 }}>
                  {sfxOn ? t('settings.sound.on') : t('settings.sound.off')}
                </Text>
              </View>
              {/* An INK toggle, as the handoff draws it: a pen-outlined slot with a solid
                  block in it. No RN Switch anywhere in this app, and a platform switch
                  here would be the one control not drawn by hand. */}
              <View style={{ width: 40, height: 21, borderWidth: 1.7, borderColor: nb.ink, borderRadius: 2, flexDirection: 'row', flexShrink: 0, justifyContent: sfxOn ? 'flex-end' : 'flex-start' }}>
                <View style={{ width: 18, backgroundColor: sfxOn ? nb.ink : 'rgba(62,54,43,.35)' }} />
              </View>
            </Pressable>
          </NbPaper>
        </View>

        {/* 계정 — 로그아웃 (그 전까진 로그인 화면으로 돌아갈 경로가 없었다) */}
        <View style={{ marginTop: space.sm }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <NbIcon name="lock" size={17} />
            <Text style={{ fontFamily: nbFonts.hand, fontSize: 18.9, color: C }}>{t('settings.account.section')}</Text>
          </View>
          <NbPaper rot={-0.3} style={{ opacity: signingOut ? 0.6 : 1 }}>
            <Pressable
              onPress={confirmSignOut}
              disabled={signingOut}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 11, paddingHorizontal: 13 }}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: nbFonts.hand, fontSize: 17.6, color: C }}>{t('settings.account.signOut')}</Text>
                <Text style={{ fontFamily: nbFonts.body, fontSize: 10, color: nb.soft, marginTop: 2 }}>{t('settings.account.signOutSub')}</Text>
              </View>
              {signingOut
                ? <ActivityIndicator color={nb.ink} />
                : <NbIcon name="chevronRight" size={15} color={nb.soft} />}
            </Pressable>
          </NbPaper>
        </View>
      </ScrollView>

      {/* hidden-mission discovery celebration */}
      {toast && (
        <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, bottom: 28, alignItems: 'center', paddingHorizontal: 18 }}>
          <NbPaper rot={-0.6} bg="rgba(249,227,123,.55)" style={{ paddingVertical: 12, paddingHorizontal: 18, alignItems: 'center', minWidth: 260 }}>
            <Text style={nbText.hand(19)}>{t('mission.foundBanner')}</Text>
            <Text style={[nbText.hand(16), { marginTop: 2 }]}>{toast.name}</Text>
            <Text style={[nbText.body(11, nb.soft), { marginTop: 3 }]}>{t('mission.rewardBody', { reward: toast.reward })}</Text>
          </NbPaper>
        </View>
      )}

      <InfoSheet data={sheet} onClose={() => setSheet(null)} />
      <NameSheet
        visible={nameOpen}
        current={displayName}
        onClose={() => setNameOpen(false)}
        onSaved={setDisplayName}
      />
      {/* The portrait builder is a SCREEN now (app/avatar), not a sheet: ten axes do
          not fit in a sheet's detent, and the preview has to stay pinned while the
          grid scrolls.

          The face scan went with it. It read hair and skin COLOURS off a photo and set
          the pixel avatar's four hex values; NbAvatar takes named keys, so bringing it
          back needs a photo→key mapping (the v32 asset set is designed for one — eight
          skin steps, dyed hair points). Left out rather than wired to nothing: a
          shortcut that sets values nobody draws is worse than an absent one. */}

      {/* 앱 언어 고르기. 번역 완성도를 계산값 그대로 보여준다(R8·R9) — 부분 번역을
          완전한 것처럼 제시하지 않기 위해서다. */}
      <BottomSheet visible={langOpen} onClose={() => setLangOpen(false)}>
        <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
          <Text style={nbText.hand(21)}>{t('settings.language.pickTitle')}</Text>
          <Text style={[nbText.body(10.5, nb.soft), { marginBottom: 12 }]}>{t('settings.language.pickNote')}</Text>
          {LOCALES.map((code) => {
            const meta = LOCALE_META[code];
            const done = completenessLabel(code);
            const on = code === locale;
            return (
              <Pressable
                key={code}
                onPress={() => { void setLocale(code); playSfx('confirm'); setLangOpen(false); }}
                style={{ marginBottom: 9 }}
              >
                <NbPaper
                  rot={on ? -0.6 : 0.4}
                  bg={on ? 'rgba(168,217,151,.35)' : undefined}
                  style={[
                    { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 11, paddingHorizontal: 13 },
                    on ? { borderColor: nb.green, borderWidth: 1.8 } : null,
                  ]}
                >
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text numberOfLines={1} style={nbText.hand(18)}>{meta.name}</Text>
                    <Text numberOfLines={1} style={nbText.body(9.5, nb.soft)}>{meta.sub}</Text>
                  </View>
                  {/* Partial translations say so, with the number they actually are — a
                      language shown as complete when it is not is the one thing this
                      sheet must not do. */}
                  {!done.full && <NbTag color="#C99A1E">{done.text}</NbTag>}
                  {on && <NbIcon name="check" size={15} color={nb.green} />}
                </NbPaper>
              </Pressable>
            );
          })}
        </View>
      </BottomSheet>
    </View>
  );
}

/** The notebook's ruled lines, behind the page. */
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
