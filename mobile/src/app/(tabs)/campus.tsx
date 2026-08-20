// 커리어 탭 — 이어하기 + 건물 → 층 → 커리큘럼.
//
// v19 split this screen into two segmented tabs, 커리큘럼 and 건물·층, and showed
// the same path twice: a 25-row chapter roadmap on one side, a floor list with CH.N
// chips on the other — from a client fixture that had drifted out of agreement with
// the server (a "5-8F" row merging four real floors, chips naming the wrong
// chapters). Choosing a segment also became the first thing the screen asked of
// you, which is exactly the pressure the home tab was built to avoid.
//
// One hierarchy now, one payload, and the hierarchy IS the roadmap. Nothing here is
// locked: every floor and curriculum is open and the sequence lives inside a
// curriculum, so "what next" is answered by the resume hero rather than by walls.
import { useCallback, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { api, type Progress, type Curriculum, type CurriculumBuilding, type CurriculumFloor } from '@/api/client';
import { BUILDING_STYLE, DEFAULT_BUILDING_STYLE } from '@/data/campus';
import { PixelButton } from '@/components/PixelButton';
import { colors, fonts, fs } from '@/theme/tokens';
import { FloorList } from '@/components/campus/FloorList';
import { DeptSheet, type DeptTarget } from '@/components/campus/DeptSheet';
import { ProgressBar, Shadowed } from '@/components/campus/parts';
import { t, useLocale } from '@/i18n';

const C = colors.ink;

export default function Campus() {
  const router = useRouter();
  const [enLevel, setEnLevel] = useState('B1');
  const [streak, setStreak] = useState(0);
  const [buildings, setBuildings] = useState<CurriculumBuilding[]>([]);
  const [dept, setDept] = useState<DeptTarget | null>(null);
  // The sheet is HIDDEN while a pushed screen is on top — not thrown away.
  //
  // A RN Modal renders above the pushed screen, so an open sheet would cover the
  // briefing we just opened. The fix for that was to clear `dept` on the way out, which
  // solved the covering and broke the way back: coming out of a briefing you did not
  // want left you at the building list, having to pick the floor again to see the list
  // you were reading a second ago. Keeping the subject and hiding the view means back
  // lands where you left.
  const [away, setAway] = useState(false);

  useFocusEffect(
    useCallback(() => {
      // Regaining focus means the pushed screen is gone, so the sheet can come back.
      setAway(false);
      let alive = true;
      Promise.all([
        api.progress().catch(() => null),
        api.me().catch(() => null),
        api.curriculum().catch(() => [] as CurriculumBuilding[]),
      ]).then(([p, me, bs]) => {
        if (!alive) return;
        if (p) setStreak((p as Progress).streakCurrent);
        const lv = (me as { profile?: { targetLevel?: string } } | null)?.profile?.targetLevel;
        if (lv) setEnLevel(lv);
        if (bs.length) setBuildings(bs);
      });
      return () => { alive = false; };
    }, []),
  );

  // Quiz steps (QZ-*) open the quiz player; scenario steps open the briefing.
  const open = (scn?: string) => { if (scn) router.push(scn.startsWith('QZ-') ? `/quiz/${scn}` : `/scenario/${scn}`); };

  // The server flags exactly one curriculum to continue, and the home tab reads the
  // same flag — neither screen decides for itself, so they cannot disagree.
  const resume = buildings.flatMap((b) => b.floors).flatMap((f) => f.curricula).find((c) => c.resume);
  const resumeStep = resume?.steps?.find((s) => s.state === 'now');

  // One gesture from a floor to everything on it: the sheet carries the floor's
  // curricula AND its situations. `deptCode` may be absent for a floor whose steps have
  // no bank prefix — the sheet then shows the curricula and says the situation list is
  // empty rather than refusing to open.
  const openFloor = (floor: CurriculumFloor, code?: string) => {
    const first = floor.curricula[0];
    const building = buildings.find((b) => b.floors.includes(floor))?.building ?? '';
    setDept({
      deptCode: code ?? '',
      place: (first?.where ?? floor.where).replace(new RegExp(`^\\S+\\s+${floor.floor}\\s*`), '') || floor.where,
      where: first?.where ?? floor.where,
      accent: (BUILDING_STYLE[building] ?? DEFAULT_BUILDING_STYLE).accent,
      curricula: floor.curricula,
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.paper }}>
      {/* ── fixed header ── */}
      <View style={{ paddingTop: 50, paddingHorizontal: 14, paddingBottom: 10, backgroundColor: colors.cream, borderBottomWidth: 3, borderBottomColor: C }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={{ fontFamily: fonts.heading, fontSize: fs(17), color: C }}>커리어</Text>
          <Shadowed offset={2} shadowColor={colors.mintShadow}>
            <View style={{ backgroundColor: colors.mint, borderWidth: 2, borderColor: C, paddingVertical: 2, paddingHorizontal: 7 }}>
              <Text style={{ fontFamily: fonts.heading, fontSize: fs(10), color: C }}>Lv.{enLevel}</Text>
            </View>
          </Shadowed>
          <View style={{ flex: 1 }} />
          <Text style={{ fontFamily: fonts.heading, fontSize: fs(11), color: C }}>{streak}일 연속</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 14, paddingBottom: 150 }}>
        {resume ? (
          <Shadowed offset={4} shadowColor={colors.mintShadow} style={{ marginBottom: 15 }}>
            <View style={{ backgroundColor: colors.mint, borderWidth: 3, borderColor: C, padding: 12 }}>
              <View style={{ position: 'absolute', top: -8, left: 10, backgroundColor: C, paddingVertical: 1, paddingHorizontal: 6 }}>
                <Text style={{ fontFamily: fonts.heading, fontSize: fs(9), color: colors.cream }}>이어하기</Text>
              </View>
              <Text style={{ fontFamily: fonts.body, fontSize: fs(10), color: C, opacity: 0.75, marginTop: 2 }}>{resume.where}</Text>
              <Text style={{ fontFamily: fonts.heading, fontSize: fs(16), color: C, marginTop: 4, marginBottom: 8 }}>{resume.name}</Text>
              <ProgressBar done={resume.done} total={resume.total} />
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 9 }}>
                <Text style={{ flex: 1, fontFamily: fonts.body, fontSize: fs(10.5), color: C }}>다음 · {resume.next ?? t('campus.resumePending')}</Text>
                <PixelButton icon="play" label={t('campus.resume')} bg={C} textColor={colors.cream} shadowColor={colors.mintShadow} offset={2} fontSize={12.5} borderWidth={2} paddingV={7} paddingH={13} onPress={() => open(resumeStep?.scenarioId)} />
              </View>
            </View>
          </Shadowed>
        ) : buildings.length > 0 ? (
          // Every curriculum done. Say so instead of pointing at a task.
          <View style={{ backgroundColor: '#fff', borderWidth: 2, borderColor: C + '55', borderStyle: 'dashed', padding: 16, marginBottom: 15 }}>
            <Text style={{ fontFamily: fonts.heading, fontSize: fs(12), color: C, textAlign: 'center' }}>모든 커리큘럼을 마쳤어요</Text>
            <Text style={{ fontFamily: fonts.body, fontSize: fs(10.5), color: colors.textSoft, textAlign: 'center', marginTop: 4 }}>아무 층이나 다시 열어 복습할 수 있어요.</Text>
          </View>
        ) : null}

        {buildings.length === 0 ? (
          <Text style={{ fontFamily: fonts.body, fontSize: fs(11), color: colors.textSoft, textAlign: 'center', paddingVertical: 24 }}>
            커리큘럼을 불러오는 중이에요.
          </Text>
        ) : (
          <FloorList buildings={buildings} onOpenFloor={openFloor} />
        )}
      </ScrollView>

      {/* ── explore dock (opt-in tile walk) ── */}
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 12, paddingHorizontal: 14 }}>
        <Shadowed offset={3}>
          <PixelButton
            icon="map" label={t('campus.exploreTitle')} bg={colors.lilac} shadowColor={C}
            fontSize={12} borderWidth={3} paddingV={11} full
            onPress={() => router.push('/interior/CAMPUS-00001')}
          />
        </Shadowed>
      </View>

      <DeptSheet
        target={dept}
        suspended={away}
        // Closing is the user's decision and forgets the floor. Navigating is not.
        onClose={() => { setDept(null); setAway(false); }}
        onStart={(scn) => { setAway(true); open(scn); }}
        onWalk={(code) => { setAway(true); router.push(`/interior/INT-${code}-00001`); }}
      />
    </View>
  );
}
