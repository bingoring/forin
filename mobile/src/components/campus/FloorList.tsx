// 건물 → 층 → 커리큘럼. This replaced the career tab's two segmented tabs.
//
// The old split showed the same thing twice in two vocabularies: a 25-row roadmap
// of chapters, and a floor list whose CH.N chips pointed at those chapters — from a
// client fixture that had drifted out of agreement with the server. The hierarchy
// now IS the roadmap, and every row comes from one payload.
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { PixelIcon } from '@/components/PixelIcon';
import { Collapsible, DisclosureChevron } from '@/components/Collapsible';
import { colors, fonts, fs } from '@/theme/tokens';
import { BUILDING_STYLE, DEFAULT_BUILDING_STYLE, floorDeptCode, floorPlace } from '@/data/campus';
import type { CurriculumBuilding, CurriculumFloor } from '@/api/client';
import { Chip, CurriculumDots, Shadowed } from './parts';
import { t, useT } from '@/i18n';
import { toggleFloorFavorite, useIsFloorFavorite } from '@/lib/favorites';

const C = colors.ink;

export function FloorList({ buildings, onOpenFloor, focus }: {
  buildings: CurriculumBuilding[];
  onOpenFloor(floor: CurriculumFloor, deptCode?: string): void;
  /** A floor arrived at from search or favourites: open its building and mark the row. */
  focus?: { building: string; floor: string } | null;
}) {
  const t = useT();
  // The building holding the resume target opens first — the learner's own place,
  // not a fixed default.
  const [open, setOpen] = useState<string>(() => {
    for (const b of buildings) {
      for (const f of b.floors) {
        if (f.curricula.some((c) => c.resume)) return b.building;
      }
    }
    return buildings[0]?.building ?? '';
  });

  // Arriving from search or a favourite opens the building it is in, so the row can be
  // seen in its place rather than only in the sheet that covers it.
  useEffect(() => {
    if (focus?.building) setOpen(focus.building);
  }, [focus?.building, focus?.floor]);

  return (
    <View>
      {buildings.map((b) => (
        <BuildingCard
          key={b.building}
          building={b}
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
function BuildingCard({ building: b, isOpen, onToggle, focus, onOpenFloor }: {
  building: CurriculumBuilding;
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
    <Shadowed offset={3} style={{ marginBottom: 10 }}>
      <View style={{ borderWidth: 3, borderColor: C, backgroundColor: '#fff' }}>
        <Pressable
          onPress={onToggle}
          accessibilityRole="button"
          accessibilityState={{ expanded: isOpen }}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 9, paddingVertical: 10, paddingHorizontal: 11, backgroundColor: isOpen ? colors.cream : '#fff' }}
        >
          <View style={{ width: 28, height: 28, backgroundColor: style.accent, borderWidth: 2, borderColor: C, alignItems: 'center', justifyContent: 'center' }}>
            <PixelIcon name={style.icon} color={C} size={16} sw={1.7} />
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={{ fontFamily: fonts.heading, fontSize: fs(12.5), color: C }}>{b.building}</Text>
            <Text style={{ fontFamily: fonts.body, fontSize: fs(9.5), color: colors.textSoft, marginTop: 2 }}>{style.subKey ? t(style.subKey) : ''}</Text>
          </View>
          <Text style={{ fontFamily: fonts.heading, fontSize: fs(10), color: colors.textSoft }}>{done}/{total}</Text>
          <DisclosureChevron open={isOpen} color={C} />
        </Pressable>

        <Collapsible open={isOpen} style={{ borderTopWidth: isOpen ? 2.5 : 0, borderTopColor: C }}>
          {b.floors.map((f, fi) => (
            <FloorRow
              key={f.floor}
              floor={f}
              last={fi === b.floors.length - 1}
              building={b.building}
              focused={focus?.building === b.building && focus?.floor === f.floor}
              onOpenFloor={onOpenFloor}
            />
          ))}
        </Collapsible>
      </View>
    </Shadowed>
  );
}

function FloorRow({ floor, last, building, focused, onOpenFloor }: {
  floor: CurriculumFloor;
  last: boolean;
  building: string;
  focused?: boolean;
  onOpenFloor(floor: CurriculumFloor, deptCode?: string): void;
}) {
  const t = useT();
  // Tapping a floor opens the sheet. It used to expand inline instead, which put the
  // curricula in the list and left the floor's other situations behind a second,
  // smaller link — so the two things you can do on a floor sat at different depths.
  // The sheet shows both: curricula first, then the situations, scrolling on.
  const code = floorDeptCode(floor.curricula);
  const place = floorPlace(floor);
  const resuming = floor.curricula.some((c) => c.resume);
  const starred = useIsFloorFavorite({ building, floor: floor.floor });

  return (
    <Pressable
      onPress={() => onOpenFloor(floor, code)}
      style={{
        flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 9, paddingHorizontal: 11,
        borderBottomWidth: last ? 0 : 1.5, borderBottomColor: C + '33', borderStyle: 'dotted',
        // Focused beats resuming: you were just sent here, and that is the row you are
        // looking for. It fades on the next tap because focus is cleared then.
        backgroundColor: focused ? colors.yellow : resuming ? colors.paper : 'transparent',
      }}
    >
      <View style={{ width: 40, backgroundColor: C, borderWidth: 2, borderColor: C, paddingVertical: 3, alignItems: 'center' }}>
        <Text style={{ fontFamily: fonts.heading, fontSize: fs(9.5), color: colors.cream }}>{floor.floor}</Text>
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={{ fontFamily: fonts.body, fontSize: fs(11), color: C, lineHeight: 14 }}>{place}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
          <CurriculumDots states={floor.curricula.map((c) => c.state)} />
          <Text style={{ fontFamily: fonts.heading, fontSize: fs(8.5), color: colors.textSoft }}>
            {t('campus.curriculumCount', { n: floor.curricula.length })}
          </Text>
        </View>
      </View>
      {resuming && <Chip label={t('step.now')} bg={colors.yellowDeep} color={C} />}
      {/* The star is its own target, not part of the row: tapping it must not open the
          floor. hitSlop stays inside half the gap so the two never merge. */}
      <Pressable
        onPress={() => void toggleFloorFavorite({ building, floor: floor.floor, place, code })}
        hitSlop={{ top: 10, bottom: 10, left: 5, right: 5 }}
        accessibilityRole="switch"
        accessibilityState={{ checked: starred }}
        accessibilityLabel={t(starred ? 'campus.favRemove' : 'campus.favAdd')}
      >
        {/* Filled when on. See PixelIcon's `fill`: two outline colours at this size read
            as the same star, which is why the on state looked like nothing happened. */}
        <PixelIcon name="star" color={starred ? C : C + '44'} fill={starred ? colors.yellowDeep : 'none'} size={17} sw={2} />
      </Pressable>
    </Pressable>
  );
}
