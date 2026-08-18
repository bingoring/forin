// 오늘의 상황판 (event board) — a daily-rotated set of scenario cards from the
// server (api.boardToday), grouped into department sections with a filter bar.
// 1:1 with the v17 handoff screen-event-board: a pinned date+summary card with
// four counter tiles (URGENT/QUEST/완료/남은), dept filter tabs, then per-dept
// sections (colored header + count) of rich EventCards (urgency tag · room ·
// difficulty meter · title · NPC · tagline · skill chips · time · action rail).
// The summary + filter bar stay pinned at the top while the sections scroll.
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { api, type BoardCard } from '@/api/client';
import { PixelIcon, type IconName } from '@/components/PixelIcon';
import { colors, fonts, space, type as t, fs } from '@/theme/tokens';
import { PixelButton } from '@/components/PixelButton';

const C = colors.ink;

// dept code → label (한글 ENG) + short code + icon + color. Canonical order first.
const DEPT_META: Record<string, { name: string; short: string; icon: IconName; color: string }> = {
  ER: { name: '응급실 ER', short: 'ER', icon: 'ambulance', color: '#DC2626' },
  ICU: { name: '중환자실 ICU', short: 'ICU', icon: 'bed', color: '#7F1D1D' },
  OR: { name: '수술실 OR', short: 'OR', icon: 'scalpel', color: '#9333EA' },
  PEDS: { name: '소아과 Peds', short: 'PEDS', icon: 'teddy', color: '#3B82F6' },
  PHARMA: { name: '약국 Pharma', short: 'PHARMA', icon: 'pill', color: '#16A34A' },
  LD: { name: '분만실 L&D', short: 'LD', icon: 'pregnant', color: '#DB2777' },
  NICU: { name: '신생아중환자실 NICU', short: 'NICU', icon: 'bottle', color: '#0EA5E9' },
  PICU: { name: '소아중환자실 PICU', short: 'PICU', icon: 'teddy', color: '#6366F1' },
  NURSERY: { name: '신생아실 Nursery', short: 'NURSERY', icon: 'baby', color: '#F472B6' },
  WOMENKIDS: { name: '여성소아외래', short: 'W&K', icon: 'flower', color: '#EC4899' },
  RAD: { name: '영상의학 Rad', short: 'RAD', icon: 'xray', color: '#0891B2' },
  ENDO: { name: '내시경 Endo', short: 'ENDO', icon: 'microscope', color: '#0D9488' },
  DIAL: { name: '인공신장실 Dialysis', short: 'DIAL', icon: 'droplet', color: '#2563EB' },
  SPECIALTY: { name: '특수외래 Specialty', short: 'SPEC', icon: 'eye', color: '#7C3AED' },
  INFUSION: { name: '주사센터 Infusion', short: 'INFU', icon: 'syringe', color: '#059669' },
  ONCO: { name: '암센터 Oncology', short: 'ONCO', icon: 'ribbon', color: '#9333EA' },
  HOSPICE: { name: '호스피스 Hospice', short: 'HOSP', icon: 'dove', color: '#64748B' },
  GERI: { name: '노인병동 Geriatrics', short: 'GERI', icon: 'cane', color: '#B45309' },
  PSYCH: { name: '정신과 Psych', short: 'PSYCH', icon: 'brain', color: '#7C3AED' },
  REHAB: { name: '재활 Rehab', short: 'REHAB', icon: 'prosthesis', color: '#0284C7' },
  SIM: { name: '시뮬레이션랩 Sim', short: 'SIM', icon: 'cap', color: '#4F46E5' },
  LOUNGE: { name: '라운지 Lounge', short: 'LOUNGE', icon: 'cup', color: '#A16207' },
  SPD: { name: '중앙공급 SPD', short: 'SPD', icon: 'box', color: '#525252' },
  MORGUE: { name: '영안실 Morgue', short: 'MORGUE', icon: 'candle', color: '#334155' },
  GEN: { name: '공통 General', short: 'GEN', icon: 'hospital', color: '#6B7280' },
};
const DEPT_ORDER = Object.keys(DEPT_META);
// urgency → card tint, accent, tag (1:1 with the handoff scheme).
const URGENCY: Record<string, { tint: string; accent: string; label: string }> = {
  urgent: { tint: '#FEE2E2', accent: '#DC2626', label: 'URGENT' },
  quest: { tint: '#FEF3C7', accent: '#CA8A04', label: 'QUEST' },
  info: { tint: '#FFFFFF', accent: '#6B7280', label: 'INFO' },
};
const urg = (u: string) => URGENCY[u] ?? URGENCY.quest;

export default function Board() {
  const router = useRouter();
  const [cards, setCards] = useState<BoardCard[]>([]);
  const [state, setState] = useState<'loading' | 'error' | 'ok'>('loading');
  const [filter, setFilter] = useState('ALL');
  const [adPlaying, setAdPlaying] = useState(false);
  const [topping, setTopping] = useState(false);
  const [capReached, setCapReached] = useState(false);

  // Rewarded-ad stub: real SDK (react-native-google-mobile-ads) needs a dev build,
  // so in Expo Go this simulates a short ad view. Swap for the SDK in production.
  const watchAd = () => new Promise<void>((resolve) => {
    setAdPlaying(true);
    setTimeout(() => { setAdPlaying(false); resolve(); }, 1600);
  });

  const onTopUp = async () => {
    if (topping || capReached) return;
    setTopping(true);
    await watchAd();
    try {
      const r = await api.topUpDailyBoard();
      setCards(r.scenarios);
      if (r.adGrants >= r.cap) setCapReached(true);
    } catch (e) {
      if ((e as { capReached?: boolean }).capReached) setCapReached(true);
    } finally {
      setTopping(false);
    }
  };

  useEffect(() => {
    let alive = true;
    // Personalized daily pool (weighted, per-user, resets 00:00 local); fall back
    // to the global rotated board if the authed call fails (offline / not authed).
    api.dailyBoard()
      .then((c) => { if (alive) { setCards(c); setState('ok'); } })
      .catch(() => api.boardToday()
        .then((c) => { if (alive) { setCards(c); setState('ok'); } })
        .catch(() => { if (alive) setState('error'); }));
    return () => { alive = false; };
  }, []);

  const byDept = useMemo(() => {
    const m: Record<string, BoardCard[]> = {};
    for (const c of cards) (m[c.dept] = m[c.dept] || []).push(c);
    return m;
  }, [cards]);
  // depts present, in canonical order (unknown depts appended).
  const presentDepts = useMemo(() => {
    const present = Object.keys(byDept);
    return [...DEPT_ORDER.filter((d) => present.includes(d)), ...present.filter((d) => !DEPT_ORDER.includes(d))];
  }, [byDept]);
  const urgent = cards.filter((c) => c.urgency === 'urgent').length;
  const quest = cards.filter((c) => c.urgency === 'quest').length;
  const shownDepts = filter === 'ALL' ? presentDepts : presentDepts.filter((d) => d === filter);

  if (state !== 'ok') {
    return (
      <View style={{ flex: 1, backgroundColor: colors.cream, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 }}>
        {state === 'loading' ? <ActivityIndicator color={C} /> : <Text style={{ fontFamily: fonts.body, fontSize: t.body, color: colors.textSoft, textAlign: 'center' }}>상황판을 불러오지 못했어요. (서버 확인)</Text>}
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      {/* ── pinned header: title + summary + counters + filter tabs ── */}
      <View style={{ paddingTop: 52, paddingHorizontal: space.lg, paddingBottom: 8, backgroundColor: colors.cream, borderBottomWidth: 2, borderBottomColor: '#2A252222', zIndex: 2 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={{ fontFamily: fonts.heading, fontSize: fs(16), color: C }}>≡</Text>
          <Text style={{ flex: 1, fontFamily: fonts.heading, fontSize: t.screenHeading, color: C }}>오늘의 상황판</Text>
          <Text style={{ fontFamily: fonts.heading, fontSize: fs(11), color: C }}>{todayLabel()}</Text>
        </View>

        {/* date + summary card */}
        <Shadowed offset={4} shadowColor={colors.mintShadow} style={{ marginTop: 10 }}>
          <View style={{ backgroundColor: colors.mint, borderWidth: 3, borderColor: C, padding: 14 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <PixelIcon name="clipboard" color={C} size={28} sw={1.6} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: fonts.heading, fontSize: fs(10), color: C, opacity: 0.7 }}>TODAY · {monthDay()}</Text>
                <Text style={{ fontFamily: fonts.heading, fontSize: fs(16), color: C, marginTop: 2 }}>현장 상황 {cards.length}건 발생</Text>
              </View>
              <Shadowed offset={2}>
                <View style={{ backgroundColor: '#fff', borderWidth: 2, borderColor: C, paddingVertical: 3, paddingHorizontal: 7, alignItems: 'center' }}>
                  <Text style={{ fontFamily: fonts.heading, fontSize: fs(8), color: colors.textSoft }}>새로고침</Text>
                  <Text style={{ fontFamily: fonts.heading, fontSize: fs(10), color: C }}>⏱ {nowTime()}</Text>
                </View>
              </Shadowed>
            </View>
            <View style={{ flexDirection: 'row', gap: 6, marginTop: 10 }}>
              <Counter label="URGENT" value={urgent} accent="#EF4444" />
              <Counter label="QUEST" value={quest} accent="#FACC15" />
              <Counter label="완료" value={0} accent={colors.mintShadow} />
              <Counter label="남은" value={cards.length} accent={C} />
            </View>
          </View>
        </Shadowed>

        {/* filter tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 5, paddingVertical: 2, paddingTop: 10 }}>
          <DeptTab id="ALL" label="전체" icon="sparkle" color={C} active={filter === 'ALL'} count={cards.length} onPress={() => setFilter('ALL')} />
          {presentDepts.map((d) => (
            <DeptTab key={d} id={d} label={DEPT_META[d]?.short ?? d} icon={DEPT_META[d]?.icon ?? 'hospital'} color={DEPT_META[d]?.color ?? C} active={filter === d} count={byDept[d].length} onPress={() => setFilter(d)} />
          ))}
        </ScrollView>
      </View>

      {/* ── scrolling sections ── */}
      <ScrollView contentContainerStyle={{ padding: space.lg, paddingTop: 14, paddingBottom: 40, gap: 18 }}>
        {shownDepts.map((dept) => {
          const list = byDept[dept] ?? [];
          const m = DEPT_META[dept];
          return (
            <View key={dept}>
              {/* dept header */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Shadowed offset={2}>
                  <View style={{ width: 28, height: 28, backgroundColor: m?.color ?? C, borderWidth: 2.5, borderColor: C, alignItems: 'center', justifyContent: 'center' }}>
                    <PixelIcon name={m?.icon ?? 'hospital'} color={C} size={17} sw={1.7} />
                  </View>
                </Shadowed>
                <Text style={{ flex: 1, fontFamily: fonts.heading, fontSize: fs(13), color: C }}>{m?.name ?? dept}</Text>
                <Text style={{ fontFamily: fonts.heading, fontSize: fs(10), color: colors.textSoft }}>{list.length}건</Text>
              </View>
              <View style={{ gap: 8 }}>
                {list.map((c) => <EventCard key={c.id} c={c} onPress={() => router.push(`/scenario/${c.id}`)} />)}
              </View>
            </View>
          );
        })}
        {shownDepts.length === 0 && (
          <View style={{ alignItems: 'center', gap: 6, borderWidth: 2, borderColor: C + '55', borderStyle: 'dashed', backgroundColor: colors.paper, paddingVertical: 28 }}>
            <PixelIcon name={DEPT_META[filter]?.icon ?? 'calendar'} color={C} size={28} sw={1.6} />
            <Text style={{ fontFamily: fonts.body, fontSize: t.caption, color: colors.textSoft, textAlign: 'center' }}>{DEPT_META[filter]?.name ?? filter}에 오늘 발생한 상황이 없어요.</Text>
            <Text style={{ fontFamily: fonts.body, fontSize: t.caption, color: colors.textFaint }}>내일 다시 확인해보세요!</Text>
          </View>
        )}

        {/* rewarded-ad top-up — open extra situations when the board runs dry */}
        {filter === 'ALL' && (
          <Shadowed offset={4} shadowColor={capReached ? C + '33' : colors.yellowShadow}>
            <Pressable onPress={onTopUp} disabled={topping || capReached} style={{ backgroundColor: capReached ? colors.paper : colors.yellow, borderWidth: 3, borderColor: C, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <PixelIcon name={capReached ? 'check' : 'play'} color={C} size={26} sw={1.7} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: fonts.heading, fontSize: fs(14), color: C }}>{capReached ? '오늘의 보상을 다 받았어요' : '광고 보고 새 상황 3건 열기'}</Text>
                <Text style={{ fontFamily: fonts.body, fontSize: fs(10), color: capReached ? colors.textSoft : C, marginTop: 3, lineHeight: 15 }}>{capReached ? '자정이 지나면 새로운 현장이 열려요.' : '현장이 잠잠한가요? 짧은 광고를 보고 시나리오를 더 받아요.'}</Text>
              </View>
              {topping ? <ActivityIndicator color={C} /> : !capReached && <PixelIcon name="play" color={C} size={18} sw={1.9} />}
            </Pressable>
          </Shadowed>
        )}

        {/* daily rotation note */}
        <View style={{ backgroundColor: colors.paper, borderWidth: 2, borderColor: C + '55', borderStyle: 'dashed', paddingVertical: 8, paddingHorizontal: 10 }}>
          <Text style={{ fontFamily: fonts.body, fontSize: fs(10), color: colors.textSoft, lineHeight: 15 }}>
            <Text style={{ fontFamily: fonts.heading, color: C }}>매일 자정마다 </Text>새로운 현장 상황이 부서별로 골고루 발생해요. 저장된 300+ 시나리오 중에서 오늘의 {cards.length}건을 골랐어요.
          </Text>
        </View>
      </ScrollView>

      {/* rewarded-ad stub overlay */}
      <Modal visible={adPlaying} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: '#000A', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
          <PixelIcon name="clipboard" color={colors.textFaint} size={40} sw={1.5} />
          <Text style={{ fontFamily: fonts.heading, fontSize: fs(15), color: '#fff' }}>광고 시청 중…</Text>
          <ActivityIndicator color="#fff" />
          <Text style={{ fontFamily: fonts.body, fontSize: fs(11), color: '#fff', opacity: 0.7 }}>(개발 모드 · 실제 광고는 dev build 필요)</Text>
        </View>
      </Modal>
    </View>
  );
}

// ── rich event card ──
function EventCard({ c, onPress }: { c: BoardCard; onPress: () => void }) {
  const u = urg(c.urgency);
  return (
    <Shadowed offset={3}>
      <View style={{ backgroundColor: u.tint, borderWidth: 3, borderColor: C, paddingVertical: 10, paddingHorizontal: 12 }}>
        {/* urgency tag + room + difficulty */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, flex: 1 }}>
            <Shadowed offset={1.5}>
              <View style={{ backgroundColor: u.accent, borderWidth: 1.5, borderColor: C, paddingHorizontal: 6, paddingVertical: 1 }}>
                <Text style={{ fontFamily: fonts.heading, fontSize: fs(9), color: '#fff' }}>{u.label}</Text>
              </View>
            </Shadowed>
            {!!c.room && <Text style={{ flex: 1, fontFamily: fonts.heading, fontSize: fs(9), color: colors.textSoft }} numberOfLines={1}>{c.room}</Text>}
          </View>
          <DifficultyMini n={c.difficulty ?? 1} />
        </View>

        {/* title + npc */}
        <Text style={{ fontFamily: fonts.heading, fontSize: fs(13), color: C, lineHeight: 17 }}>{c.title}</Text>
        {!!c.npcName && <Text style={{ fontFamily: fonts.body, fontSize: fs(10), color: colors.textSoft, marginTop: 3 }}>{c.npcName}{c.npcSub ? ` · ${c.npcSub}` : ''}</Text>}

        {/* tagline */}
        {!!c.tagline && (
          <View style={{ marginTop: 6, backgroundColor: '#fff', borderWidth: 1.5, borderColor: C + '44', paddingVertical: 4, paddingHorizontal: 8 }}>
            <Text style={{ fontFamily: fonts.body, fontSize: fs(10), color: colors.text, fontStyle: 'italic', lineHeight: 14 }} numberOfLines={2}>{c.tagline}</Text>
          </View>
        )}

        {/* skills + time */}
        {(!!c.skills?.length || !!c.timeLabel) && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8, flexWrap: 'wrap' }}>
            {(c.skills ?? []).slice(0, 2).map((sk, i) => (
              <View key={i} style={{ backgroundColor: colors.mint, borderWidth: 1.5, borderColor: C, paddingHorizontal: 5, paddingVertical: 1 }}>
                <Text style={{ fontFamily: fonts.heading, fontSize: fs(8), color: C }}>{sk}</Text>
              </View>
            ))}
            {(c.skills?.length ?? 0) > 2 && <Text style={{ fontFamily: fonts.heading, fontSize: fs(8), color: colors.textSoft }}>+{(c.skills!.length) - 2}</Text>}
            {!!c.timeLabel && <Text style={{ marginLeft: 'auto', fontFamily: fonts.heading, fontSize: fs(9), color: colors.textSoft }}>⏱ {c.timeLabel}</Text>}
          </View>
        )}

        {/* action rail */}
        <View style={{ flexDirection: 'row', gap: 6, marginTop: 9 }}>
          <View style={{ flex: 1 }}>
            <PixelButton icon="pin" label="위치 보기" bg="#fff" shadowColor={C} fontSize={10} borderWidth={2} paddingV={5} offset={2} onPress={onPress} full />
          </View>
          <View style={{ flex: 2 }}>
            <PixelButton icon="play" label="진행하기" bg={colors.mint} shadowColor={colors.mintShadow} fontSize={11} borderWidth={2} paddingV={5} offset={2} onPress={onPress} full />
          </View>
        </View>
      </View>
    </Shadowed>
  );
}

function DifficultyMini({ n }: { n: number }) {
  const cols = ['#A7F3D0', '#FEF08A', '#FCA5A5'];
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[1, 2, 3].map((i) => (
        <View key={i} style={{ width: 8, height: 8, borderWidth: 1, borderColor: C, backgroundColor: i <= n ? cols[Math.min(n, 3) - 1] : '#fff' }} />
      ))}
    </View>
  );
}

function Counter({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <Shadowed offset={2} shadowColor={C + '77'} style={{ flex: 1 }}>
      <View style={{ backgroundColor: '#fff', borderWidth: 2, borderColor: C, paddingVertical: 5, alignItems: 'center' }}>
        <Text style={{ fontFamily: fonts.heading, fontSize: fs(8), color: accent }}>{label}</Text>
        <Text style={{ fontFamily: fonts.heading, fontSize: fs(16), color: C, marginTop: 2 }}>{value}</Text>
      </View>
    </Shadowed>
  );
}

function DeptTab({ label, icon, color, active, count, onPress }: { id: string; label: string; icon: IconName; color: string; active: boolean; count: number; onPress: () => void }) {
  return (
    <Pressable onPress={onPress}>
      <Shadowed offset={active ? 2.5 : 2} shadowColor={active ? C : C + '66'}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: active ? color : '#fff', borderWidth: 2.5, borderColor: C, paddingVertical: 5, paddingHorizontal: 8 }}>
          <PixelIcon name={icon} color={active ? '#fff' : C} size={14} sw={1.8} />
          <Text style={{ fontFamily: fonts.heading, fontSize: fs(10), color: active ? '#fff' : C }}>{label}</Text>
          {count > 0 && (
            <View style={{ backgroundColor: active ? '#fff' : color, borderWidth: 1.5, borderColor: C, paddingHorizontal: 4, minWidth: 14, alignItems: 'center' }}>
              <Text style={{ fontFamily: fonts.heading, fontSize: fs(9), color: active ? color : '#fff' }}>{count}</Text>
            </View>
          )}
        </View>
      </Shadowed>
    </Pressable>
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

// Local date labels (design demo froze at 5/14 WED; here we use the real date).
function todayLabel(): string {
  const d = new Date();
  const wd = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][d.getDay()];
  return `${d.getMonth() + 1}/${d.getDate()} ${wd}`;
}
function monthDay(): string {
  const d = new Date();
  const mon = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'][d.getMonth()];
  return `${mon} ${d.getDate()}`;
}
function nowTime(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}
