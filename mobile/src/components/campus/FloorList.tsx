// 건물 → 층 → 커리큘럼, in the 근무 수첩 line (v29).
//
// This replaced the career tab's two segmented tabs. The old split showed the same thing
// twice in two vocabularies: a 25-row roadmap of chapters, and a floor list whose CH.N
// chips pointed at those chapters — from a client fixture that had drifted out of
// agreement with the server. The hierarchy now IS the roadmap, and every row comes from
// one payload.
//
// The drawing changed with v29, the structure did not: a building is a sheet of paper laid
// slightly off square, a floor is a ruled line with an ink floor-stamp, and progress is a
// row of little boxes you can count instead of a bar you can only estimate.
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Collapsible } from '@/components/Collapsible';
import { NbIcon } from '@/components/nb/NbIcon';
import { NbInkStamp, NbMark, NbPaper, NbProgSquares, NbTag, nbText } from '@/components/nb/NbUI';
import { nb, nbFonts } from '@/theme/nb';
import { BUILDING_STYLE, DEFAULT_BUILDING_STYLE, floorDeptCode, floorPlace } from '@/data/campus';
import type { CurriculumBuilding, CurriculumFloor } from '@/api/client';
import { useT } from '@/i18n';
import { toggleFloorFavorite, useIsFloorFavorite } from '@/lib/favorites';

/** Every card a fraction of a degree off square. A page of perfectly aligned cards reads
 *  as a form; that is the whole device. Fixed per index rather than random so the list
 *  does not reshuffle itself on every render. */
const ROT = [-0.4, 0.5, -0.5, 0.4, -0.3, 0.45];

export function FloorList({ buildings, onOpenFloor, focus }: {
  buildings: CurriculumBuilding[];
  onOpenFloor(floor: CurriculumFloor, deptCode?: string): void;
  /** A floor arrived at from search or favourites: open its building and mark the row. */
  focus?: { building: string; floor: string } | null;
}) {
  // The building holding the resume target opens first — the learner's own place, not a
  // fixed default.
  const [open, setOpen] = useState<string>(() => {
    for (const b of buildings) {
      for (const f of b.floors) {
        if (f.curricula.some((c) => c.resume)) return b.building;
      }
    }
    return buildings[0]?.building ?? '';
  });

  // Arriving from search or a favourite opens the building it is in, so the row can be seen
  // in its place rather than only in the sheet that covers it.
  useEffect(() => {
    if (focus?.building) setOpen(focus.building);
  }, [focus?.building, focus?.floor]);

  return (
    <View>
      {buildings.map((b, i) => (
        <BuildingCard
          key={b.building}
          building={b}
          rot={ROT[i % ROT.length]}
          isOpen={open === b.building}
          onToggle={() => setOpen(open === b.building ? '' : b.building)}
          focus={focus}
          onOpenFloor={onOpenFloor}
        />
      ))}
    </View>
  );
}

/** One building, with its floors sliding out rather than appearing. See Collapsible. */
function BuildingCard({ building: b, rot, isOpen, onToggle, focus, onOpenFloor }: {
  building: CurriculumBuilding;
  rot: number;
  isOpen: boolean;
  onToggle(): void;
  focus?: { building: string; floor: string } | null;
  onOpenFloor(floor: CurriculumFloor, deptCode?: string): void;
}) {
  const t = useT();
  const style = BUILDING_STYLE[b.building] ?? DEFAULT_BUILDING_STYLE;
  const total = b.floors.reduce((n, f) => n + f.curricula.length, 0);
  const done = b.floors.reduce((n, f) => n + f.curricula.filter((c) => c.state === 'done').length, 0);

  return (
    <NbPaper rot={rot} style={{ marginTop: 12 }}>
      <Pressable
        onPress={onToggle}
        accessibilityRole="button"
        accessibilityState={{ expanded: isOpen }}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 11, paddingHorizontal: 12 }}
      >
        <NbIcon name={style.nbIcon} size={26} />
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={[nbText.hand(19), { lineHeight: 20 }]}>{b.building}</Text>
          <Text numberOfLines={1} style={[nbText.body(10.5, nb.soft), { marginTop: 3 }]}>
            {style.subKey ? t(style.subKey) : ''}
          </Text>
        </View>
        <Text numberOfLines={1} style={nbText.hand(14, nb.soft)}>{done}/{total}</Text>
        <NbIcon name={isOpen ? 'chevronUp' : 'chevronDown'} size={16} />
      </Pressable>

      <Collapsible open={isOpen}>
        {b.floors.map((f) => (
          <FloorRow
            key={f.floor}
            floor={f}
            building={b.building}
            focused={focus?.building === b.building && focus?.floor === f.floor}
            onOpenFloor={onOpenFloor}
          />
        ))}
      </Collapsible>
    </NbPaper>
  );
}

function FloorRow({ floor, building, focused, onOpenFloor }: {
  floor: CurriculumFloor;
  building: string;
  focused?: boolean;
  onOpenFloor(floor: CurriculumFloor, deptCode?: string): void;
}) {
  const t = useT();
  // Tapping a floor opens the sheet. It used to expand inline instead, which put the
  // curricula in the list and left the floor's other situations behind a second, smaller
  // link — so the two things you can do on a floor sat at different depths. The sheet
  // shows both: curricula first, then the situations, scrolling on.
  const code = floorDeptCode(floor.curricula);
  const place = floorPlace(floor);
  const resuming = floor.curricula.some((c) => c.resume);
  const starred = useIsFloorFavorite({ building, floor: floor.floor });
  const done = floor.curricula.filter((c) => c.state === 'done').length;

  return (
    <Pressable
      onPress={() => onOpenFloor(floor, code)}
      style={{
        flexDirection: 'row', alignItems: 'center', gap: 9, paddingVertical: 9, paddingHorizontal: 10,
        borderTopWidth: 1.5, borderTopColor: 'rgba(62,54,43,.16)', borderStyle: 'dashed',
        // Focused beats resuming: you were just sent here, and that is the row you are
        // looking for. It fades on the next tap, because focus is cleared then.
        backgroundColor: focused ? 'rgba(249,227,123,.45)' : resuming ? 'rgba(249,227,123,.25)' : 'transparent',
        // No dimming for an untouched floor. Every floor is open from the first day —
        // dimming the ones nobody has started said "not yet", which is exactly what the
        // learner has to know is false about this list. Grey belongs to the CURRICULUM
        // rows inside the sheet, where a step really can be locked.
      }}
    >
      <NbInkStamp>{floor.floor}</NbInkStamp>
      <View style={{ flex: 1, minWidth: 0 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          {resuming
            ? <NbMark textStyle={{ fontSize: 17 }}>{place}</NbMark>
            : <Text numberOfLines={1} style={[nbText.hand(17), { flexShrink: 1, lineHeight: 19 }]}>{place}</Text>}
          {resuming && <NbTag color={nb.red}>{t('step.now')}</NbTag>}
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 3 }}>
          {/* Countable, not estimated: with two of seven done, a bar says "a bit" and
              boxes say two. */}
          <NbProgSquares done={done} total={floor.curricula.length} />
          <Text numberOfLines={1} style={[nbText.body(10.5, nb.soft), { marginLeft: 2 }]}>
            {t('campus.curriculumCount', { n: floor.curricula.length })}
          </Text>
        </View>
      </View>
      {/* Its own target, not part of the row: tapping the star must not open the floor.
          hitSlop stays inside half the gap so the two never merge. */}
      <Pressable
        onPress={() => void toggleFloorFavorite({ building, floor: floor.floor, place, code })}
        hitSlop={{ top: 10, bottom: 10, left: 5, right: 5 }}
        accessibilityRole="switch"
        accessibilityState={{ checked: starred }}
        accessibilityLabel={t(starred ? 'campus.favRemove' : 'campus.favAdd')}
      >
        {/* Off is the same star, faint. Two outline colours at this size read as the same
            star, which is why the on state used to look like nothing happened — so the
            difference here is opacity, which is unmistakable. */}
        <View style={{ opacity: starred ? 1 : 0.3 }}>
          <NbIcon name="star" size={18} color={starred ? '#C99A1E' : nb.soft} />
        </View>
      </Pressable>
    </Pressable>
  );
}

/** The dashed "walk the map instead" button, at the bottom of the list.
 *
 *  Dashed and quiet on purpose: exploring is the opt-in, and the list is the way in. It
 *  used to be a filled lilac button competing with every row above it. */
export function ExploreButton({ onPress }: { onPress: () => void }) {
  const t = useT();
  return (
    <Pressable onPress={onPress} style={({ pressed }) => ({
      marginTop: 16,
      borderWidth: 1.7,
      borderColor: nb.blue,
      borderStyle: 'dashed',
      borderRadius: 3,
      backgroundColor: 'rgba(74,111,165,.06)',
      paddingVertical: 11,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 7,
      transform: pressed ? [{ translateX: 1.5 }, { translateY: 2 }] : [{ rotate: '-0.3deg' }],
    })}>
      <NbIcon name="compass" size={17} color={nb.blue} />
      <Text style={{ fontFamily: nbFonts.hand, fontSize: 17, color: nb.blue }}>{t('campus.exploreTitle')}</Text>
    </Pressable>
  );
}
