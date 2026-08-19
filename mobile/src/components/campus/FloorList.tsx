// 건물 → 층 → 커리큘럼. This replaced the career tab's two segmented tabs.
//
// The old split showed the same thing twice in two vocabularies: a 25-row roadmap
// of chapters, and a floor list whose CH.N chips pointed at those chapters — from a
// client fixture that had drifted out of agreement with the server. The hierarchy
// now IS the roadmap, and every row comes from one payload.
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { PixelIcon } from '@/components/PixelIcon';
import { colors, fonts, fs } from '@/theme/tokens';
import { BUILDING_STYLE, DEFAULT_BUILDING_STYLE, deptCodeOf } from '@/data/campus';
import type { CurriculumBuilding, CurriculumFloor } from '@/api/client';
import { Chip, CurriculumDots, Shadowed } from './parts';
import { t } from '@/i18n';

const C = colors.ink;

export function FloorList({ buildings, onOpenFloor }: {
  buildings: CurriculumBuilding[];
  onOpenFloor(floor: CurriculumFloor, deptCode?: string): void;
}) {
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

  return (
    <View>
      {buildings.map((b) => {
        const style = BUILDING_STYLE[b.building] ?? DEFAULT_BUILDING_STYLE;
        const isOpen = open === b.building;
        const total = b.floors.reduce((n, f) => n + f.curricula.length, 0);
        const done = b.floors.reduce((n, f) => n + f.curricula.filter((c) => c.state === 'done').length, 0);
        return (
          <Shadowed key={b.building} offset={3} style={{ marginBottom: 10 }}>
            <View style={{ borderWidth: 3, borderColor: C, backgroundColor: '#fff' }}>
              <Pressable
                onPress={() => setOpen(isOpen ? '' : b.building)}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 9, paddingVertical: 10, paddingHorizontal: 11, backgroundColor: isOpen ? colors.cream : '#fff', borderBottomWidth: isOpen ? 2.5 : 0, borderBottomColor: C }}
              >
                <View style={{ width: 28, height: 28, backgroundColor: style.accent, borderWidth: 2, borderColor: C, alignItems: 'center', justifyContent: 'center' }}>
                  <PixelIcon name={style.icon} color={C} size={16} sw={1.7} />
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={{ fontFamily: fonts.heading, fontSize: fs(12.5), color: C }}>{b.building}</Text>
                  <Text style={{ fontFamily: fonts.body, fontSize: fs(9.5), color: colors.textSoft, marginTop: 2 }}>{style.subKey ? t(style.subKey) : ''}</Text>
                </View>
                <Text style={{ fontFamily: fonts.heading, fontSize: fs(10), color: colors.textSoft }}>{done}/{total}</Text>
                <PixelIcon name={isOpen ? 'chevron-up' : 'chevron-down'} color={C} size={13} sw={2} />
              </Pressable>

              {isOpen && b.floors.map((f, fi) => (
                <FloorRow
                  key={f.floor}
                  floor={f}
                  last={fi === b.floors.length - 1}
                  onOpenFloor={onOpenFloor}
                />
              ))}
            </View>
          </Shadowed>
        );
      })}
    </View>
  );
}

function FloorRow({ floor, last, onOpenFloor }: {
  floor: CurriculumFloor;
  last: boolean;
  onOpenFloor(floor: CurriculumFloor, deptCode?: string): void;
}) {
  // Tapping a floor opens the sheet. It used to expand inline instead, which put the
  // curricula in the list and left the floor's other situations behind a second,
  // smaller link — so the two things you can do on a floor sat at different depths.
  // The sheet shows both: curricula first, then the situations, scrolling on.
  const code = deptCodeOf(floor.curricula[0]?.steps?.[0]?.scenarioId);
  // Strip the "본관 1F " prefix the server sends for the lift's benefit — the building
  // and floor are already the two rows above this one.
  const place = floor.curricula[0]?.where.replace(new RegExp(`^\\S+\\s+${floor.floor}\\s*`), '') || floor.where;
  const resuming = floor.curricula.some((c) => c.resume);

  return (
    <Pressable
      onPress={() => onOpenFloor(floor, code)}
      style={{
        flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 9, paddingHorizontal: 11,
        borderBottomWidth: last ? 0 : 1.5, borderBottomColor: C + '33', borderStyle: 'dotted',
        backgroundColor: resuming ? colors.paper : 'transparent',
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
      <PixelIcon name="chevron-right" color={C} size={12} sw={2} />
    </Pressable>
  );
}
