// 홈 — 앱을 켜면 처음 만나는 화면 (handoff v21 ScreenHome / ScreenHomeDone).
//
// 커리어 탭은 커리큘럼·건물·상황이 전부 목록이라 켜자마자 "골라야 한다"는 압박이
// 된다. 홈은 반대 원칙이다: 오늘 할 딱 한 가지만 크게, 성취를 먼저, 나머지는 얕은 문.
//
// 모든 모듈은 GET /me/home 한 번으로 온다(앱 첫 화면이라 왕복 수가 곧 체감 지연).
// 서버가 "보여줄 것"만 담아 보내므로 여기서는 **필드가 없으면 그리지 않는다**가
// 유일한 규칙이다 — 자리를 채우는 문구를 지어내지 않는다.
import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { PixelIcon, type IconName } from '@/components/PixelIcon';
import { AnimatedFace } from '@engine';
import { api, type Home } from '@/api/client';
import { colors, fonts, space, type as typeScale, fs } from '@/theme/tokens';
import { t, useLocale } from '@/i18n';
import { useAvatar } from '@/hooks/useAvatar';

const C = colors.ink;

export default function HomeTab() {
  const router = useRouter();
  const [home, setHome] = useState<Home | null>(null);
  const [state, setState] = useState<'loading' | 'error' | 'ok'>('loading');
  const [flipped, setFlipped] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      (async () => {
        try {
          const h = await api.home();
          if (!alive) return;
          setHome(h);
          setState('ok');
        } catch {
          if (alive) setState('error');
        }
      })();
      return () => { alive = false; };
    }, []),
  );

  if (state !== 'ok' || !home) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.paper, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        {state === 'loading'
          ? <ActivityIndicator color={C} />
          : <Text style={{ fontFamily: fonts.body, fontSize: typeScale.body, color: colors.textSoft, textAlign: 'center' }}>
{t('home.loadFailed')}
            </Text>}
      </View>
    );
  }

  const startToday = () => {
    const id = home.todayOne?.scenarioId;
    if (!id) return;
    // Same routing rule the career tab uses — the home hero is a shortcut into the
    // existing curriculum flow, not a parallel one.
    router.push(id.startsWith('QZ-') ? `/quiz/${id}` : `/scenario/${id}`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.paper }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <Greeting date={home.date} done={home.done} />

        {/* On a first run the order flips: the task comes before the streak.
            Achievements-before-tasks is the right default (see the file header), but a
            learner who has cleared nothing has no achievements — leading with a row of
            ten empty day-boxes and a "0일 연속" puts their own emptiness first and
            pushes the one thing they should tap below the fold. */}
        {home.firstRun ? (
          home.todayOne ? <TodayOne one={home.todayOne} onStart={startToday} firstRun /> : null
        ) : (
          <>
            {!!home.shift && <ShiftBadge shift={home.shift.shift} deptLabel={home.shift.deptLabel} />}
            <StreakStrip streak={home.streak} week={home.week} />
            {home.todayOne
              ? <TodayOne one={home.todayOne} onStart={startToday} />
              : <RestCard streakNext={home.streak + 1} onMore={() => router.push('/board')} />}
          </>
        )}

        {!!home.mentorNote && <MentorNote note={home.mentorNote} />}
        {!!home.phrase && (
          <PhraseOfDay phrase={home.phrase} flipped={flipped} onFlip={() => setFlipped((f) => !f)} />
        )}

        <Doors
          waiting={home.situationsWaiting}
          onExplore={() => router.push('/campus')}
          onBoard={() => router.push('/board')}
        />

        {!!home.review && (
          <OneReview front={home.review.front} onPress={() => router.push('/lab')} />
        )}

        <ColleagueStrip
          colleagues={home.colleagues}
          total={home.colleagueTotal}
          unread={home.unreadCheers}
          pending={home.pendingRequests}
          onOpenAll={() => router.push('/colleagues')}
          onAdd={() => router.push('/colleagues/add')}
        />
      </ScrollView>
    </View>
  );
}

// ── 인사 ───────────────────────────────────────────────────────────────────
function Greeting({ date, done }: { date: string; done: boolean }) {
  const locale = useLocale();
  const avatar = useAvatar();
  const d = new Date(date + 'T00:00:00');
  // Formatted by Intl rather than assembled from a Korean weekday array: the order
  // of month, day and weekday differs per language, so a translated template would
  // still be wrong ("18 Monday August" in German). Hermes ships Intl and this file
  // already leans on it for the timezone.
  const label = Number.isNaN(d.getTime())
    ? date
    : dateLabel(d, locale);
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 10, paddingHorizontal: space.lg, paddingTop: 56, paddingBottom: 12 }}>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={{ fontFamily: fonts.body, fontSize: fs(11), color: colors.textSoft }}>{label}</Text>
        <Text style={{ fontFamily: fonts.heading, fontSize: fs(19), color: C, marginTop: 5, lineHeight: 25 }}>
          {done ? t('home.greetingDone') : t('home.greetingStart')}
        </Text>
      </View>
      <Shadowed offset={3} style={{ alignSelf: 'flex-end' }}>
        <View style={{ width: 58, height: 58, backgroundColor: colors.cream, borderWidth: 3, borderColor: C, overflow: 'hidden', alignItems: 'center', justifyContent: 'flex-end' }}>
          <AnimatedFace size={62} avatar={avatar} expression={done ? 'happy' : 'focused'} />
        </View>
      </Shadowed>
    </View>
  );
}

/** "8월 18일 월요일" in the reader's language, or the raw date if Intl is absent. */
function dateLabel(d: Date, locale: string): string {
  try {
    return new Intl.DateTimeFormat(locale, { month: 'long', day: 'numeric', weekday: 'long' }).format(d);
  } catch {
    return d.toDateString();
  }
}

// ── 근무 배지 — 화면에서 유일하게 어두운 카드 (시선이 한 번 끊긴다) ─────────
function ShiftBadge({ shift, deptLabel }: { shift: string; deptLabel: string }) {
  return (
    <Shadowed offset={3} style={{ marginHorizontal: space.lg }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9, backgroundColor: C, borderWidth: 3, borderColor: C, paddingVertical: 9, paddingHorizontal: 11 }}>
        <View style={{ backgroundColor: colors.mint, borderWidth: 2, borderColor: C, paddingVertical: 2, paddingHorizontal: 6 }}>
          <Text style={{ fontFamily: fonts.heading, fontSize: fs(10), color: C }}>{shift}</Text>
        </View>
        <PixelIcon name="shift" color={colors.cream} size={14} sw={1.6} />
        <Text numberOfLines={1} style={{ flex: 1, minWidth: 0, fontFamily: fonts.body, fontSize: fs(10.5), color: colors.cream }}>
          오늘 배치 · {deptLabel}
        </Text>
      </View>
    </Shadowed>
  );
}

// ── 연속 + 최근 학습 리듬 (성취를 과제보다 먼저) ───────────────────────────
function StreakStrip({ streak, week }: { streak: number; week: number[] }) {
  return (
    <Shadowed offset={3} style={{ marginHorizontal: space.lg, marginTop: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.cream, borderWidth: 3, borderColor: C, paddingVertical: 11, paddingHorizontal: 13 }}>
        <View style={{ alignItems: 'center' }}>
          <PixelIcon name="flame" color={C} size={20} sw={1.7} />
          <Text style={{ fontFamily: fonts.heading, fontSize: fs(17), color: C, marginTop: 3 }}>{streak}</Text>
          <Text style={{ fontFamily: fonts.body, fontSize: fs(9), color: colors.textSoft }}>연속</Text>
        </View>
        <View style={{ width: 3, alignSelf: 'stretch', backgroundColor: C + '22' }} />
        <View style={{ flex: 1, minWidth: 0 }}>
          {/* A rolling window ending today, not a calendar week — the server
              sends progress.StreakWindowDays cells and we read the length. */}
          <Text style={{ fontFamily: fonts.body, fontSize: fs(10), color: colors.textSoft, marginBottom: 7 }}>최근 {week.length}일</Text>
          <View style={{ flexDirection: 'row', gap: 3 }}>
            {week.map((d, i) => (
              <View key={i} style={{
                flex: 1, height: 14,
                backgroundColor: d === 2 ? colors.yellow : d === 1 ? colors.mint : '#fff',
                borderWidth: 2, borderColor: d === 0 ? C + '44' : C,
              }} />
            ))}
          </View>
        </View>
      </View>
    </Shadowed>
  );
}

// ── 오늘의 한 가지 — 화면에서 가장 큰 단 하나 ──────────────────────────────
function TodayOne({ one, onStart, firstRun }: {
  one: NonNullable<Home['todayOne']>;
  onStart: () => void;
  firstRun?: boolean;
}) {
  const icon: IconName = one.kind === 'quiz' ? 'question' : 'speech';
  return (
    <View style={{ marginHorizontal: space.lg, marginTop: 17 }}>
      <Shadowed offset={4} shadowColor={colors.mintShadow}>
        <View style={{ backgroundColor: colors.mint, borderWidth: 3, borderColor: C, padding: 14 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 11, marginTop: 4 }}>
            <View style={{ width: 44, height: 44, backgroundColor: '#fff', borderWidth: 2.5, borderColor: C, alignItems: 'center', justifyContent: 'center' }}>
              <PixelIcon name={icon} color={C} size={24} sw={1.7} />
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text numberOfLines={1} style={{ fontFamily: fonts.body, fontSize: fs(10), color: C, opacity: 0.75 }}>{one.chapter}</Text>
              <Text style={{ fontFamily: fonts.heading, fontSize: fs(15), color: C, marginTop: 3, lineHeight: 20 }}>{one.title}</Text>
            </View>
          </View>
          {/* One line saying what is about to happen. A scenario title alone tells a
              newcomer nothing about whether they are about to read, type or speak. */}
          {firstRun && (
            <Text style={{ fontFamily: fonts.body, fontSize: fs(11), color: C, opacity: 0.8, marginTop: 10, lineHeight: 16 }}>
              {t('home.firstRunHint')}
            </Text>
          )}
          <Pressable onPress={onStart} style={({ pressed }) => ({
            marginTop: 12, backgroundColor: C, borderWidth: 2.5, borderColor: C, paddingVertical: 11,
            flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7,
            opacity: pressed ? 0.85 : 1,
          })}>
            <PixelIcon name="play" color={colors.cream} size={16} sw={1.9} />
            <Text style={{ fontFamily: fonts.heading, fontSize: fs(14), color: colors.cream }}>
              {firstRun ? t('home.firstRunCta') : t('home.startCta')}
            </Text>
          </Pressable>
        </View>
      </Shadowed>
      {/* 라벨 탭 — 카드 위로 걸친다 */}
      <View style={{ position: 'absolute', top: -9, left: 12, backgroundColor: C, paddingVertical: 2, paddingHorizontal: 7 }}>
        <Text style={{ fontFamily: fonts.heading, fontSize: fs(9), color: colors.cream }}>
          {firstRun ? t('home.firstRunTab') : t('home.todayOneTab')}
        </Text>
      </View>
    </View>
  );
}

// ── 완료 상태 — 더 시키지 않는다 ───────────────────────────────────────────
function RestCard({ streakNext, onMore }: { streakNext: number; onMore: () => void }) {
  return (
    <Shadowed offset={4} style={{ marginHorizontal: space.lg, marginTop: 13 }}>
      <View style={{ backgroundColor: colors.cream, borderWidth: 3, borderColor: C, paddingVertical: 18, paddingHorizontal: 14, alignItems: 'center' }}>
        <PixelIcon name="moon" color={C} size={34} sw={1.6} />
        <Text style={{ fontFamily: fonts.heading, fontSize: fs(14), color: C, marginTop: 9 }}>오늘 목표를 다 채웠어요</Text>
        <Text style={{ fontFamily: fonts.body, fontSize: fs(11), color: colors.textSoft, marginTop: 6, lineHeight: 18, textAlign: 'center' }}>
          {streakNext}일째 연속이 눈앞이에요.{'\n'}여기서 멈춰도 괜찮아요.
        </Text>
        <Pressable onPress={onMore} style={({ pressed }) => ({
          marginTop: 12, backgroundColor: '#fff', borderWidth: 2.5, borderColor: C,
          paddingVertical: 8, paddingHorizontal: 16, opacity: pressed ? 0.85 : 1,
        })}>
          <Text style={{ fontFamily: fonts.heading, fontSize: fs(12), color: C }}>+ 한 판 더 하기</Text>
        </Pressable>
      </View>
    </Shadowed>
  );
}

// ── 멘토 쪽지 ──────────────────────────────────────────────────────────────
function MentorNote({ note }: { note: NonNullable<Home['mentorNote']> }) {
  return (
    <View style={{ marginHorizontal: space.lg, marginTop: 17 }}>
      <Shadowed offset={3} shadowColor={colors.peachShadow}>
        <View style={{ flexDirection: 'row', gap: 10, backgroundColor: colors.peach, borderWidth: 3, borderColor: C, paddingVertical: 11, paddingHorizontal: 12 }}>
          <View style={{ width: 34, height: 34, marginTop: 3, backgroundColor: '#fff', borderWidth: 2, borderColor: C, alignItems: 'center', justifyContent: 'center' }}>
            <PixelIcon name="nurse-cap" color={C} size={20} sw={1.6} />
          </View>
          <View style={{ flex: 1, minWidth: 0, marginTop: 2 }}>
            <Text style={{ fontFamily: fonts.body, fontSize: fs(11.5), color: C, lineHeight: 18 }}>{note.text}</Text>
            <Text style={{ fontFamily: fonts.heading, fontSize: fs(9), color: colors.textSoft, marginTop: 5 }}>
              — {note.npc.role} {note.npc.name} · {note.npc.dept}
            </Text>
          </View>
        </View>
      </Shadowed>
      <View style={{ position: 'absolute', top: -9, left: 12, backgroundColor: '#fff', borderWidth: 2, borderColor: C, paddingHorizontal: 6 }}>
        <Text style={{ fontFamily: fonts.heading, fontSize: fs(9), color: C }}>멘토 쪽지</Text>
      </View>
    </View>
  );
}

// ── 오늘의 한마디 (탭하면 뜻) ──────────────────────────────────────────────
function PhraseOfDay({ phrase, flipped, onFlip }: { phrase: NonNullable<Home['phrase']>; flipped: boolean; onFlip: () => void }) {
  return (
    <Shadowed offset={3} style={{ marginHorizontal: space.lg, marginTop: 13 }}>
      <Pressable onPress={onFlip} style={{ backgroundColor: '#fff', borderWidth: 3, borderColor: C, paddingVertical: 12, paddingHorizontal: 13 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <PixelIcon name="bulb" color={C} size={14} sw={1.7} />
          <Text style={{ fontFamily: fonts.heading, fontSize: fs(10.5), color: C }}>오늘의 한마디</Text>
          <View style={{ flex: 1 }} />
          <Text style={{ fontFamily: fonts.body, fontSize: fs(9), color: colors.textFaint }}>
            {flipped ? t('home.phraseCollapse') : t('home.phraseReveal')}
          </Text>
        </View>
        <View style={{ backgroundColor: colors.cream, borderWidth: 2.5, borderColor: C + '66', paddingVertical: 13, paddingHorizontal: 10, alignItems: 'center' }}>
          <Text style={{ fontFamily: fonts.heading, fontSize: fs(15), color: C, lineHeight: 21, textAlign: 'center' }}>
            “{phrase.en}”
          </Text>
          {flipped && (
            <Text style={{ fontFamily: fonts.body, fontSize: fs(10), color: colors.textSoft, marginTop: 6, textAlign: 'center' }}>
              {phrase.ko}{phrase.note ? ` · ${phrase.note}` : ''}
            </Text>
          )}
        </View>
      </Pressable>
    </Shadowed>
  );
}

// ── 얕은 문 2개 ────────────────────────────────────────────────────────────
function Doors({ waiting, onExplore, onBoard }: { waiting: number; onExplore: () => void; onBoard: () => void }) {
  const Door = ({ icon, title, sub, bg, onPress }: { icon: IconName; title: string; sub: string; bg: string; onPress: () => void }) => (
    <Shadowed offset={3} style={{ flex: 1 }}>
      <Pressable onPress={onPress} style={{ backgroundColor: bg, borderWidth: 3, borderColor: C, paddingVertical: 12, paddingHorizontal: 11 }}>
        <PixelIcon name={icon} color={C} size={20} sw={1.7} />
        <Text style={{ fontFamily: fonts.heading, fontSize: fs(12), color: C, marginTop: 7 }}>{title}</Text>
        <Text style={{ fontFamily: fonts.body, fontSize: fs(9.5), color: colors.textSoft, marginTop: 3, lineHeight: 14 }}>{sub}</Text>
      </Pressable>
    </Shadowed>
  );
  return (
    <View style={{ flexDirection: 'row', gap: 10, marginHorizontal: space.lg, marginTop: 13 }}>
      <Door icon="map" title={t('home.doorExplore')} sub={t('home.doorExploreSub')} bg="#fff" onPress={onExplore} />
      <Door icon="clipboard" title={t('home.doorBoard')} sub={t('home.doorBoardSub', { n: waiting })} bg={colors.blue} onPress={onBoard} />
    </View>
  );
}

// ── 어제 놓친 것 하나 ──────────────────────────────────────────────────────
function OneReview({ front, onPress }: { front: string; onPress: () => void }) {
  return (
    <Shadowed offset={3} style={{ marginHorizontal: space.lg, marginTop: 13 }}>
      <Pressable onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fff', borderWidth: 3, borderColor: C, paddingVertical: 10, paddingHorizontal: 12 }}>
        <View style={{ width: 26, height: 26, backgroundColor: colors.yellow, borderWidth: 2, borderColor: C, alignItems: 'center', justifyContent: 'center' }}>
          <PixelIcon name="note" color={C} size={15} sw={1.7} />
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={{ fontFamily: fonts.body, fontSize: fs(11.5), color: C, lineHeight: 15 }}>틀린 표현 하나만 다시 볼까요?</Text>
          <Text numberOfLines={1} style={{ fontFamily: fonts.heading, fontSize: fs(9.5), color: colors.textSoft, marginTop: 3 }}>“{front}” · 1분</Text>
        </View>
        <PixelIcon name="chevron-right" color={C} size={16} sw={2} />
      </Pressable>
    </Shadowed>
  );
}

// ── 내 동료 ────────────────────────────────────────────────────────────────
function ColleagueStrip({ colleagues, total, unread, pending, onOpenAll, onAdd }: {
  colleagues: Home['colleagues']; total: number; unread: number; pending: number;
  onOpenAll: () => void; onAdd: () => void;
}) {
  return (
    <Shadowed offset={3} style={{ marginHorizontal: space.lg, marginTop: 13 }}>
      <View style={{ backgroundColor: colors.cream, borderWidth: 3, borderColor: C }}>
        <Pressable onPress={onOpenAll} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingTop: 8, paddingBottom: 6, paddingHorizontal: 12, borderBottomWidth: 2, borderBottomColor: C + '33' }}>
          <PixelIcon name="handshake" color={C} size={14} sw={1.7} />
          <Text style={{ fontFamily: fonts.heading, fontSize: fs(10.5), color: C }}>내 동료</Text>
          {total > 0 && (
            <View style={{ backgroundColor: colors.mint, borderWidth: 1.5, borderColor: C, paddingHorizontal: 4 }}>
              <Text style={{ fontFamily: fonts.heading, fontSize: fs(8.5), color: C }}>{total}</Text>
            </View>
          )}
          {(unread > 0 || pending > 0) && (
            <View style={{ backgroundColor: colors.yellow, borderWidth: 1.5, borderColor: C, paddingHorizontal: 4 }}>
              <Text style={{ fontFamily: fonts.heading, fontSize: fs(8.5), color: C }}>
                {unread > 0 ? t('home.cheers', { n: unread }) : t('home.requests', { n: pending })}
              </Text>
            </View>
          )}
          <View style={{ flex: 1 }} />
          <Text style={{ fontFamily: fonts.heading, fontSize: fs(9.5), color: colors.textSoft }}>전체 ›</Text>
        </Pressable>

        {colleagues.length === 0 ? (
          <View style={{ paddingVertical: 14, paddingHorizontal: 12, alignItems: 'center' }}>
            <Text style={{ fontFamily: fonts.body, fontSize: fs(10.5), color: colors.textSoft, textAlign: 'center', lineHeight: 16 }}>
              코드를 주고받아 동료를 추가해보세요.{'\n'}서로의 학습 현황을 보고 응원할 수 있어요.
            </Text>
          </View>
        ) : (
          colleagues.map((c, i) => (
            <Pressable key={c.id} onPress={onOpenAll} style={{
              flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 7, paddingHorizontal: 12,
              borderBottomWidth: i < colleagues.length - 1 ? 1.5 : 0, borderBottomColor: C + '22',
            }}>
              <View style={{ width: 6, height: 6, backgroundColor: c.activeToday ? colors.mintShadow : 'transparent', borderWidth: c.activeToday ? 1.5 : 0, borderColor: C }} />
              <Text style={{ fontFamily: fonts.heading, fontSize: fs(10), color: C }}>{c.name}</Text>
              <Text numberOfLines={1} style={{ flex: 1, minWidth: 0, fontFamily: fonts.body, fontSize: fs(10), color: colors.textSoft, lineHeight: 14 }}>
                {c.activity || t('home.privateProgress')}
              </Text>
            </Pressable>
          ))
        )}

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7, paddingVertical: 8, paddingHorizontal: 12, borderTopWidth: 2, borderTopColor: C + '33' }}>
          <Text style={{ flex: 1, fontFamily: fonts.body, fontSize: fs(10), color: colors.textSoft }}>동료 관리는 프로필에서</Text>
          <Pressable onPress={onAdd} style={{ backgroundColor: '#fff', borderWidth: 2, borderColor: C, paddingVertical: 3, paddingHorizontal: 8 }}>
            <Text style={{ fontFamily: fonts.heading, fontSize: fs(10), color: C }}>+ 추가</Text>
          </Pressable>
        </View>
      </View>
    </Shadowed>
  );
}

function Shadowed({ children, offset = 4, shadowColor = C, style }: {
  children: React.ReactNode; offset?: number; shadowColor?: string; style?: object;
}) {
  return (
    <View style={style}>
      <View style={{ position: 'absolute', left: offset, top: offset, right: -offset, bottom: -offset, backgroundColor: shadowColor }} />
      {children}
    </View>
  );
}
