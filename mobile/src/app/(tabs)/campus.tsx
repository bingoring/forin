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
// curriculum, so "what next" is answered by the home tab rather than by walls here — this
// tab answers "where is it", which is the question a 24-floor building actually raises.
import { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { api, type Progress, type Curriculum, type CurriculumBuilding, type CurriculumFloor } from '@/api/client';
import { BUILDING_STYLE, DEFAULT_BUILDING_STYLE } from '@/data/campus';
import { PixelButton } from '@/components/PixelButton';
import { colors, fonts, fs } from '@/theme/tokens';
import { FloorList } from '@/components/campus/FloorList';
import { useIsActiveTab } from '@/lib/nav';
import { PixelIcon } from '@/components/PixelIcon';
import { searchCampus, type CampusHit } from '@/data/campusSearch';
import { DeptSheet, type DeptTarget } from '@/components/campus/DeptSheet';
import { Shadowed } from '@/components/campus/parts';
import { t, useLocale } from '@/i18n';

const C = colors.ink;

export default function Campus() {
  const router = useRouter();
  const [enLevel, setEnLevel] = useState('B1');
  const [streak, setStreak] = useState(0);
  const [buildings, setBuildings] = useState<CurriculumBuilding[]>([]);
  const [dept, setDept] = useState<DeptTarget | null>(null);
  // The sheet now lives in the tab-level overlay, so a pushed screen covers it and it
  // needs no hiding on the way to a briefing — it simply stays where it was, scroll
  // position and all. What it does need is to go away when the user leaves this TAB,
  // because the overlay sits above all of them.
  const onThisTab = useIsActiveTab('campus');
  const [query, setQuery] = useState('');
  const found = useMemo(() => searchCampus(buildings, query.trim()), [buildings, query]);

  // A hit opens the same sheet a floor row does, so search is a shortcut to the existing
  // surface rather than a second way of showing a floor.
  const openHit = (h: CampusHit) => {
    const b = buildings.find((x) => x.building === h.building);
    const f = b?.floors.find((x) => x.floor === h.floor);
    if (f) openFloor(f, h.code);
  };

  useFocusEffect(
    useCallback(() => {
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
        {/* Search, where the 이어하기 card used to be.
            That card was the home tab's "오늘의 한 가지" a second time — the same server
            flag, the same button, one tab over. This space is better spent on the thing
            only this tab can do: reach a named ward without walking the building to it.
            Coverage numbers were the other candidate and are the wrong shape here — a
            progress bar implies the goal is to fill it, and nobody needs the curriculum
            for a ward they will never be assigned to. */}
        <View style={{ marginBottom: 14 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#fff', borderWidth: 2.5, borderColor: C, paddingVertical: 8, paddingHorizontal: 10 }}>
            <PixelIcon name="search" color={C} size={15} sw={1.9} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder={t('campus.searchPlaceholder')}
              placeholderTextColor={colors.textFaint}
              autoCorrect={false}
              autoCapitalize="none"
              returnKeyType="search"
              style={{ flex: 1, fontFamily: fonts.body, fontSize: fs(12), color: C, padding: 0 }}
            />
            {query.length > 0 && (
              <Pressable onPress={() => setQuery('')} hitSlop={8} accessibilityLabel={t('campus.searchClear')}>
                <PixelIcon name="x" color={colors.textSoft} size={13} sw={2} />
              </Pressable>
            )}
          </View>
        </View>

        {query.trim().length > 0 ? (
          <View style={{ gap: 7 }}>
            {found.hits.length === 0 ? (
              <Text style={{ fontFamily: fonts.body, fontSize: fs(11), color: colors.textSoft, textAlign: 'center', paddingVertical: 22 }}>
                {t('campus.searchNone', { q: query.trim() })}
              </Text>
            ) : (
              <>
                {found.hits.map((h: CampusHit, i: number) => (
                  <Pressable
                    key={`${h.building}/${h.floor}/${h.curriculum ?? ''}/${i}`}
                    onPress={() => openHit(h)}
                    style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fff', borderWidth: 2, borderColor: C + '55', paddingVertical: 9, paddingHorizontal: 11 }}
                  >
                    <View style={{ width: 44, backgroundColor: C, borderWidth: 2, borderColor: C, paddingVertical: 3, alignItems: 'center' }}>
                      <Text style={{ fontFamily: fonts.heading, fontSize: fs(9), color: colors.cream }}>{h.floor}</Text>
                    </View>
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <Text style={{ fontFamily: fonts.heading, fontSize: fs(12), color: C }}>{h.curriculum ?? h.place}</Text>
                      <Text style={{ fontFamily: fonts.body, fontSize: fs(9.5), color: colors.textSoft, marginTop: 2 }}>
                        {h.curriculum ? `${h.building} ${h.floor} ${h.place}` : h.building}
                      </Text>
                    </View>
                  </Pressable>
                ))}
                {found.truncated > 0 && (
                  <Text style={{ fontFamily: fonts.body, fontSize: fs(9.5), color: colors.textFaint, textAlign: 'center', marginTop: 4 }}>
                    {t('campus.searchMore', { n: found.truncated })}
                  </Text>
                )}
              </>
            )}
          </View>
        ) : buildings.length === 0 ? (
          <Text style={{ fontFamily: fonts.body, fontSize: fs(11), color: colors.textSoft, textAlign: 'center', paddingVertical: 24 }}>
            {t('campus.loading')}
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
        suspended={!onThisTab}
        onClose={() => setDept(null)}
        onStart={open}
        onWalk={(code) => router.push(`/interior/INT-${code}-00001`)}
      />
    </View>
  );
}
