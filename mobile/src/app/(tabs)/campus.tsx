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
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { api, type Progress, type Curriculum, type CurriculumBuilding, type CurriculumFloor } from '@/api/client';
import { BUILDING_STYLE, DEFAULT_BUILDING_STYLE, deptCodeOf, floorDeptCode, floorPlace } from '@/data/campus';
import { NbIcon, type NbIconName } from '@/components/nb/NbIcon';
import { NbInkStamp, NbPaper, NbTag, nbText } from '@/components/nb/NbUI';
import { RULE_COLOR, RULE_H, nb, nbFonts, TOP_INSET } from '@/theme/nb';
import { ExploreButton, FloorList } from '@/components/campus/FloorList';
import { useIsActiveTab } from '@/lib/nav';
import { searchCampus, type CampusHit } from '@/data/campusSearch';
import { toggleFloorFavorite, toggleSituationFavorite, useFavorites, type FavFloor } from '@/lib/favorites';
import type { DeptSituation } from '@/api/client';
import { DeptSheet, type DeptTarget } from '@/components/campus/DeptSheet';
import { t, useLocale, useT } from '@/i18n';

export default function Campus() {
  const t = useT();
  const router = useRouter();
  const [enLevel, setEnLevel] = useState('B1');
  // The language the band is IN. The chip used to hardcode nothing at all and read
  // "Lv.B1"; a German-track learner's B1 is not an English B1.
  const [targetLang, setTargetLang] = useState('en');
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
  const favorites = useFavorites();

  // A floor arrived at from search or a favourite: the building opens and the row is lit.
  const [focus, setFocus] = useState<{ building: string; floor: string } | null>(null);
  const [focusSit, setFocusSit] = useState<DeptSituation | null>(null);

  // Situations live on the server — 3,203 of them — so this half of the search is a
  // request, not a filter. Debounced because it fires per keystroke, and sequenced so a
  // slow answer for "흉" cannot land after the answer for "흉통".
  const [sitHits, setSitHits] = useState<DeptSituation[]>([]);
  const sitSeq = useRef(0);
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) { setSitHits([]); return; } // one letter matches most of the bank
    const seq = ++sitSeq.current;
    const timer = setTimeout(() => {
      api.searchSituations(q, 12)
        .then((r) => { if (seq === sitSeq.current) setSitHits(r); })
        .catch(() => { if (seq === sitSeq.current) setSitHits([]); });
    }, 220);
    return () => clearTimeout(timer);
  }, [query]);

  // A hit opens the same sheet a floor row does, so search is a shortcut to the existing
  // surface rather than a second way of showing a floor.
  const openHit = (h: CampusHit) => {
    goToFloor({ building: h.building, floor: h.floor, place: h.place, code: h.code });
  };

  /**
   * Leave the search and land on the floor: the query clears, the building opens, the row
   * lights up, and the sheet comes up over it. Clearing the query matters — coming back
   * out of the sheet onto a list of search results, rather than the place you were sent
   * to, is the part that would feel like nothing happened.
   */
  const goToFloor = (target: FavFloor, situation?: DeptSituation) => {
    const b = buildings.find((x) => x.building === target.building);
    const f = b?.floors.find((x) => x.floor === target.floor);
    setQuery('');
    setFocus({ building: target.building, floor: target.floor });
    setFocusSit(situation ?? null);
    if (f) openFloor(f, target.code ?? undefined);
  };

  /** Where a situation id lives: the floor whose department matches its bank. */
  const floorOfScenario = (scenarioId: string): FavFloor | undefined => {
    const dept = deptCodeOf(scenarioId);
    if (!dept) return undefined;
    for (const b of buildings) {
      for (const f of b.floors) {
        if (floorDeptCode(f.curricula) === dept) {
          return { building: b.building, floor: f.floor, place: floorPlace(f), code: dept };
        }
      }
    }
    return undefined;
  };

  const openSituation = (s: DeptSituation) => {
    const home = floorOfScenario(s.scenarioId);
    // No floor teaches this bank — open it directly rather than refusing to move.
    if (!home) { open(s.scenarioId); return; }
    goToFloor(home, s);
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
        const prof = (me as { profile?: { targetLevel?: string; targetLang?: string } } | null)?.profile;
        if (prof?.targetLevel) setEnLevel(prof.targetLevel);
        if (prof?.targetLang) setTargetLang(prof.targetLang);
        if (bs.length) setBuildings(bs);
      });
      return () => { alive = false; };
    }, []),
  );

  // Quiz steps (QZ-*) open the quiz player; scenario steps open the briefing.
  // `guide` rides along: the two entries of a dialogue share one scenario id, so the
  // rung the learner tapped is the only thing that distinguishes them. Dropping it here
  // is what made "1/2 보기 중에서" open the unguided run.
  const open = (scn?: string, guide?: 'choices' | 'free') => {
    if (!scn) return;
    if (scn.startsWith('QZ-')) { router.push(`/quiz/${scn}`); return; }
    router.push(guide ? `/scenario/${scn}?guide=${guide}` : `/scenario/${scn}`);
  };

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
      // The ward's own doodle, so the sheet's header says WHICH place rather than "a
      // place" — the pixel version put a coloured square with a pin in it.
      nbIcon: (BUILDING_STYLE[building] ?? DEFAULT_BUILDING_STYLE).nbIcon,
      curricula: floor.curricula,
    });
  };

  return (
    <Sheet>
      {/* ── the notebook's own heading, on the page rather than in a bar ──
          A separate header band with its own border is a chrome the paper line does not
          have: on paper the title is just the first thing written. */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingTop: TOP_INSET, paddingBottom: 30 }}>
        <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
          <Text style={nbText.hand(30)}>{t('campus.nbTitle')}</Text>
          <View style={{ marginLeft: 8 }}>
            {/* The learner's CEFR band, labelled by the language it is in. It used to read
                "Lv.{enLevel}", one dot away from the XP level's "LV 12" on the profile
                card — two unrelated numbers under one abbreviation. */}
            <NbTag color={nb.green}>{(targetLang || 'en').toUpperCase()} {enLevel}</NbTag>
          </View>
          <View style={{ flex: 1 }} />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <NbIcon name="star" size={14} color="#C99A1E" />
            <Text numberOfLines={1} style={nbText.hand(15, nb.soft)}>{t('campus.streakDays', { n: streak })}</Text>
          </View>
        </View>

        {/* Search, written on a ruled line rather than boxed in.
            It sits where the 이어하기 card used to. That card was the home tab's
            "오늘의 한 가지" a second time — same server flag, same button, one tab over.
            This space is better spent on the thing only this tab can do: reach a named
            ward without walking the building to it. */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12, paddingVertical: 7, paddingHorizontal: 4, borderBottomWidth: 2, borderBottomColor: 'rgba(62,54,43,.45)' }}>
          <NbIcon name="magnify" size={17} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={t('campus.searchPlaceholder')}
            placeholderTextColor={nb.placeholder}
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="search"
            style={{ flex: 1, fontFamily: nbFonts.hand, fontSize: 16, color: nb.ink, padding: 0 }}
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')} hitSlop={8} accessibilityLabel={t('campus.searchClear')}>
              <NbIcon name="chevronRight" size={14} color={nb.soft} />
            </Pressable>
          )}
        </View>

        {/* 오늘의 상황판. It lives here rather than in the lounge: a daily rotation of
            situations across the hospital is a fact about the WORKPLACE, and the lounge
            is where colleagues talk to each other. Hidden while searching — the results
            are the only thing that should be under the query. */}
        {query.trim().length === 0 && (
          <Pressable onPress={() => router.push('/board')}>
            <NbPaper rot={-0.4} bg="rgba(143,199,232,.22)" style={styles.boardLink}>
              <NbIcon name="board" size={22} />
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text numberOfLines={1} style={nbText.hand(16)}>{t('campus.boardLink')}</Text>
                <Text numberOfLines={1} style={[nbText.body(10, nb.soft), { marginTop: 1 }]}>{t('campus.boardLinkSub')}</Text>
              </View>
              <NbIcon name="chevronRight" size={15} />
            </NbPaper>
          </Pressable>
        )}

        {query.trim().length > 0 ? (
          <View style={{ marginTop: 12 }}>
            {found.hits.length === 0 && sitHits.length === 0 ? (
              <Text style={[nbText.hand(16, nb.soft), { textAlign: 'center', paddingVertical: 22 }]}>
                {t('campus.searchNone', { q: query.trim() })}
              </Text>
            ) : (
              <>
                {found.hits.map((h: CampusHit, i: number) => (
                  <Row
                    key={`${h.building}/${h.floor}/${h.curriculum ?? ''}/${i}`}
                    stamp={h.floor}
                    title={h.curriculum ?? h.place}
                    sub={h.curriculum ? `${h.building} ${h.floor} ${h.place}` : h.building}
                    rot={i % 2 ? 0.4 : -0.4}
                    onPress={() => openHit(h)}
                  />
                ))}
                {sitHits.length > 0 && (
                  <>
                    <Text style={[nbText.hand(16), { marginTop: 12 }]}>{t('campus.favSituations')}</Text>
                    {sitHits.map((sv, i) => (
                      <Row
                        key={sv.scenarioId}
                        stamp={sv.lv}
                        title={sv.name}
                        sub={floorOfScenario(sv.scenarioId)?.place ?? sv.room ?? ''}
                        rot={i % 2 ? -0.4 : 0.4}
                        urgent={sv.urgent}
                        onPress={() => openSituation(sv)}
                      />
                    ))}
                  </>
                )}
                {found.truncated > 0 && (
                  <Text style={[nbText.body(10, nb.soft), { textAlign: 'center', marginTop: 6 }]}>
                    {t('campus.searchMore', { n: found.truncated })}
                  </Text>
                )}
              </>
            )}
          </View>
        ) : buildings.length === 0 ? (
          <Text style={[nbText.hand(16, nb.soft), { textAlign: 'center', paddingVertical: 24 }]}>
            {t('campus.loading')}
          </Text>
        ) : (
          <>
            {(favorites.floors.length > 0 || favorites.situations.length > 0) && (
              /* One flat block, deliberately: a starred ward and a starred situation are
                 both "take me back there", and splitting them into two sections doubles
                 the chrome to say the same thing. */
              <View style={{ marginTop: 14 }}>
                <SectionHead icon="star" iconColor="#C99A1E" label={t('campus.favTitle')} />
                {favorites.floors.map((f, i) => (
                  <Row
                    key={`f/${f.building}/${f.floor}`}
                    stamp={f.floor}
                    title={f.place}
                    sub={f.building}
                    rot={i % 2 ? 0.6 : -0.5}
                    starred
                    onStar={() => void toggleFloorFavorite(f)}
                    onPress={() => goToFloor(f)}
                  />
                ))}
                {favorites.situations.map((sv, i) => (
                  <Row
                    key={`s/${sv.scenarioId}`}
                    stamp="!"
                    title={sv.name}
                    sub={floorOfScenario(sv.scenarioId)?.place ?? sv.where ?? ''}
                    rot={i % 2 ? -0.5 : 0.6}
                    starred
                    onStar={() => void toggleSituationFavorite(sv)}
                    onPress={() => open(sv.scenarioId)}
                  />
                ))}
              </View>
            )}
            {/* The two blocks are one scroll and used to run together: a starred ward
                row and a building card are both paper, and without a label the first
                building read as a third favourite. The head names what follows; the
                torn rule above it is where one section ends. */}
            <View style={{ marginTop: 18 }}>
              {(favorites.floors.length > 0 || favorites.situations.length > 0) && <SectionRule />}
              <SectionHead
                icon="hospital"
                label={t('campus.buildingsTitle')}
                right={t('campus.buildingsCount', { n: buildings.length })}
              />
            </View>
            <FloorList buildings={buildings} onOpenFloor={openFloor} focus={focus} />
            {/* Walking the map is the opt-in; the list is the way in. It used to be a
                filled lilac button competing with every row above it. */}
            <ExploreButton onPress={() => router.push('/interior/CAMPUS-00001')} />
          </>
        )}
      </ScrollView>

      <DeptSheet
        target={dept}
        suspended={!onThisTab}
        focusSituation={focusSit}
        // Closing clears the highlight too: it marked where you were sent, and you have
        // been. Leaving it lit would make the next visit look like another arrival.
        onClose={() => { setDept(null); setFocusSit(null); setFocus(null); }}
        onStart={open}
        onWalk={(code) => router.push(`/interior/INT-${code}-00001`)}
      />
    </Sheet>
  );
}

/** The ruled page everything is written on. */
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

/**
 * One row of this tab's three lists — a search hit, a favourite ward, a favourite
 * situation. They were three near-identical blocks of markup; the differences that matter
 * are the stamp and whether there is a star, so those are the props.
 */
function Row({ stamp, title, sub, rot, starred, urgent, onStar, onPress }: {
  stamp: string;
  title: string;
  sub: string;
  rot: number;
  starred?: boolean;
  urgent?: boolean;
  onStar?: () => void;
  onPress: () => void;
}) {
  const t = useT();
  return (
    <Pressable onPress={onPress}>
      <NbPaper rot={rot} style={{ marginTop: 8, paddingVertical: 9, paddingHorizontal: 11, flexDirection: 'row', alignItems: 'center', gap: 9 }}>
        {urgent ? <NbTag color={nb.red} fill>{stamp}</NbTag> : <NbInkStamp>{stamp}</NbInkStamp>}
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text numberOfLines={1} style={[nbText.hand(17), { lineHeight: 19 }]}>{title}</Text>
          <Text numberOfLines={1} style={[nbText.body(10.5, nb.soft), { marginTop: 2 }]}>{sub}</Text>
        </View>
        {/* The star's own target, so removing a favourite does not also open it. */}
        {!!onStar && (
          <Pressable
            onPress={onStar}
            hitSlop={{ top: 10, bottom: 10, left: 5, right: 5 }}
            accessibilityRole="switch"
            accessibilityState={{ checked: !!starred }}
            accessibilityLabel={t('campus.favRemove')}
          >
            <NbIcon name="star" size={18} color="#C99A1E" />
          </Pressable>
        )}
      </NbPaper>
    </Pressable>
  );
}

/**
 * A section label in the notebook's hand: a doodle, the name of what follows, and
 * (optionally) how much of it there is.
 *
 * Both of this tab's standing blocks get one. Only 즐겨찾기 had a label before, so
 * 건물 began with an unlabelled paper card directly under a starred ward row — the
 * same material, the same rotation, no boundary. What separates them is a name, not
 * more chrome.
 */
function SectionHead({ icon, iconColor, label, right }: {
  icon: NbIconName;
  iconColor?: string;
  label: string;
  right?: string;
}) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      <NbIcon name={icon} size={15} color={iconColor} />
      <Text style={[nbText.hand(16), { flex: 1, minWidth: 0 }]} numberOfLines={1}>{label}</Text>
      {!!right && <Text numberOfLines={1} style={nbText.hand(14, nb.soft)}>{right}</Text>}
    </View>
  );
}

/** Where a section ends: a torn dashed rule, not a solid divider. The page is paper. */
function SectionRule() {
  return (
    <View
      style={{
        borderTopWidth: 1.4, borderStyle: 'dashed', borderTopColor: 'rgba(62,54,43,.22)',
        marginBottom: 14,
      }}
    />
  );
}

const styles = {
  boardLink: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    marginTop: 14, paddingVertical: 10, paddingHorizontal: 13,
  } as const,
};
