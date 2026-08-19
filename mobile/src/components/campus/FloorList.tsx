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
import { BUILDING_STYLE, DEFAULT_BUILDING_STYLE, INTERIOR_DEPTS, deptCodeOf } from '@/data/campus';
import type { Curriculum, CurriculumBuilding, CurriculumFloor } from '@/api/client';
import { Chip, CurriculumDots, Shadowed } from './parts';
import { t } from '@/i18n';

const C = colors.ink;

export function FloorList({ buildings, onOpenCurriculum, onOpenDept }: {
  buildings: CurriculumBuilding[];
  onOpenCurriculum(c: Curriculum): void;
  onOpenDept(floor: CurriculumFloor, deptCode: string): void;
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
                  onOpenCurriculum={onOpenCurriculum}
                  onOpenDept={onOpenDept}
                />
              ))}
            </View>
          </Shadowed>
        );
      })}
    </View>
  );
}

function FloorRow({ floor, last, onOpenCurriculum, onOpenDept }: {
  floor: CurriculumFloor;
  last: boolean;
  onOpenCurriculum(c: Curriculum): void;
  onOpenDept(floor: CurriculumFloor, deptCode: string): void;
}) {
  // A floor expands when it holds what you are working on, so opening the tab puts
  // the next thing on screen without a tap.
  const [open, setOpen] = useState(floor.curricula.some((c) => c.resume));
  // The department is read off this floor's own step ids, so it cannot disagree
  // with the path the way a hand-kept table did.
  const code = deptCodeOf(floor.curricula[0]?.steps?.[0]?.scenarioId);
  const walkable = !!code && INTERIOR_DEPTS.has(code);
  // Strip the "본관 1F " prefix the server sends for the lift's benefit — the
  // building and floor are already the two rows above this one.
  const place = floor.curricula[0]?.where.replace(new RegExp(`^\\S+\\s+${floor.floor}\\s*`), '') || floor.where;

  return (
    <View style={{ borderBottomWidth: last ? 0 : 1.5, borderBottomColor: C + '33', borderStyle: 'dotted' }}>
      <Pressable onPress={() => setOpen(!open)} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 9, paddingHorizontal: 11 }}>
        <View style={{ width: 40, backgroundColor: C, borderWidth: 2, borderColor: C, paddingVertical: 3, alignItems: 'center' }}>
          <Text style={{ fontFamily: fonts.heading, fontSize: fs(9.5), color: colors.cream }}>{floor.floor}</Text>
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={{ fontFamily: fonts.body, fontSize: fs(11), color: C, lineHeight: 14 }}>{place}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
            <CurriculumDots states={floor.curricula.map((c) => c.state)} />
            <Text style={{ fontFamily: fonts.heading, fontSize: fs(8.5), color: colors.textSoft }}>커리큘럼 {floor.curricula.length}</Text>
          </View>
        </View>
        <PixelIcon name={open ? 'chevron-up' : 'chevron-down'} color={C} size={12} sw={2} />
      </Pressable>

      {open && (
        <View style={{ paddingHorizontal: 11, paddingBottom: 10, gap: 7 }}>
          {floor.curricula.map((c) => (
            <Pressable key={c.key} onPress={() => onOpenCurriculum(c)}>
              <View style={{
                flexDirection: 'row', alignItems: 'center', gap: 8,
                backgroundColor: c.state === 'done' ? colors.mint : c.state === 'doing' ? colors.paper : '#fff',
                borderWidth: c.resume ? 3 : 2, borderColor: c.resume ? colors.yellowDeep : C,
                paddingVertical: 8, paddingHorizontal: 9,
              }}>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={{ fontFamily: fonts.heading, fontSize: fs(11.5), color: C }}>{c.name}</Text>
                  {!!c.next && c.state !== 'done' && (
                    <Text style={{ fontFamily: fonts.body, fontSize: fs(9.5), color: colors.textSoft, marginTop: 2 }}>다음 · {c.next}</Text>
                  )}
                </View>
                {c.resume && <Chip label="NOW" bg={colors.yellowDeep} color={C} />}
                <Text style={{ fontFamily: fonts.heading, fontSize: fs(10), color: C }}>{c.done}/{c.total}</Text>
                <PixelIcon name="chevron-right" color={C} size={12} sw={2} />
              </View>
            </Pressable>
          ))}
          {walkable && (
            <Pressable onPress={() => onOpenDept(floor, code!)} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingTop: 3 }}>
              <PixelIcon name="pin" color={colors.textSoft} size={11} sw={1.7} />
              <Text style={{ fontFamily: fonts.heading, fontSize: fs(9.5), color: colors.textSoft }}>이 층의 다른 상황 보기</Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}
