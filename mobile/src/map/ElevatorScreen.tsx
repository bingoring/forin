// Elevator entry (5f-ii) — RN port of screen-elevator.jsx. Entering a campus
// pavilion opens this: building tabs + a pixel cab (floor read-out + sliding
// doors) + a floor directory where each floor shows its departments and a LIVE
// situation chip read from the shared scenario source (same as the 상황판), then
// you pick a floor to ride to that floor's interior.
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts } from '@/theme/tokens';
import { PixelButton } from '@/components/PixelButton';
import { deptCounts, type Dept } from '@/content/scenarios';
import { api } from '@/api/client';

export interface ElevFloor {
  f: string;
  depts: string[];
  icon: string;
  sdepts?: Dept[]; // scenario depts whose live count surfaces on this floor
  lobby?: boolean;
  interior?: string; // interior id to ride to (omitted = not built yet)
  entry?: { x: number; y: number }; // spawn tile on arrival (else the map's default)
  // Floors hosting more than one department: after picking the floor, a sub-picker
  // lets the rider choose which room to ride to. Each room may be unbuilt (no
  // interior → "준비 중"). When present this supersedes the floor-level interior/entry.
  rooms?: { dept: string; interior?: string; entry?: { x: number; y: number } }[];
}
export interface ElevBuilding {
  name: string;
  sub: string;
  accent: string;
  wall: string;
  trim: string;
  floors: ElevFloor[];
}

// Per-building directory, floors TOP→BOTTOM (matches the 5-pavilion master plan).
// `interior` is set only where a real interior exists today; the rest ride to a
// "준비 중" placeholder until 5g builds them.
export const ELEVATOR_BUILDINGS: Record<string, ElevBuilding> = {
  tower: {
    name: '메인 메디컬 타워', sub: '본관 · MAIN MEDICAL TOWER', accent: '#D14B3D', wall: '#E8EAEC', trim: '#C2C7CB',
    floors: [
      { f: '8F', depts: ['일반 내과 병동'], icon: '🛏', interior: 'INT-WARD-00001', entry: { x: 1, y: 15 } },
      { f: '7F', depts: ['일반 외과 병동', '수술 후 회복'], icon: '🩹', interior: 'INT-SURGWARD-00001', entry: { x: 1, y: 15 } },
      { f: '6F', depts: ['정형외과 병동', '골절·관절 재활'], icon: '🦴', interior: 'INT-ORTHOWARD-00001', entry: { x: 1, y: 15 } },
      { f: '4F', depts: ['중앙 ICU', 'CCU · Neuro · TICU'], icon: '🫀', sdepts: ['ICU'], interior: 'INT-ICU-00001', entry: { x: 7, y: 42 } },
      { f: '3F', depts: ['수술실 OR', '회복실 PACU', '당일수술센터'], icon: '🔪', sdepts: ['OR'], interior: 'INT-OR-00001', entry: { x: 18, y: 1 } },
      { f: '2F', depts: ['피부과 센터', '피부 병변·광선·레이저'], icon: '🌸', interior: 'INT-DERM-00001', entry: { x: 14, y: 1 } },
      { f: '1F', depts: ['응급의료센터 ER', '메인 로비'], icon: '🚑', sdepts: ['ER'], lobby: true, interior: 'INT-ER-00001', entry: { x: 20, y: 11 } },
      { f: 'P1', depts: ['중앙 약제부 · 원내 약국', 'IV 무균조제실', '마약류 보관고'], icon: '💊', sdepts: ['PHARMA'], interior: 'INT-PHARMA-00001', entry: { x: 16, y: 40 } },
    ],
  },
  women: {
    name: '여성소아 센터', sub: '별관 1 · WOMEN & CHILDREN', accent: '#C2487E', wall: '#F3E6D6', trim: '#E0CBB4',
    floors: [
      { f: '4F', depts: ['신생아 중환자실 NICU', '소아 중환자실 PICU'], icon: '👶', rooms: [
        { dept: '신생아 중환자실 NICU', interior: 'INT-NICU-00001', entry: { x: 1, y: 6 } },
        { dept: '소아 중환자실 PICU', interior: 'INT-PICU-00001', entry: { x: 1, y: 6 } },
      ] },
      { f: '3F', depts: ['가족 분만실 L&D', '산후 병동', '신생아실'], icon: '🤰', interior: 'INT-LD-00001', entry: { x: 1, y: 15 } },
      { f: '2F', depts: ['소아 일반 병동'], icon: '🧸', sdepts: ['PEDS'] },
      { f: '1F', depts: ['소아청소년과 외래', '산부인과 외래', '키즈 놀이광장'], icon: '🎈', lobby: true, sdepts: ['PEDS'], interior: 'INT-WOMENKIDS-OPD-00001', entry: { x: 13, y: 1 } },
    ],
  },
  onco: {
    name: '암센터 · 특수 재활관', sub: '별관 2 · ONCOLOGY & REHAB', accent: '#1E8A5B', wall: '#E4ECE0', trim: '#C2D4BE',
    floors: [
      { f: '4F', depts: ['완화의료 · 호스피스', '노인성 질환 병동'], icon: '🕊' },
      { f: '3F', depts: ['종양학 병동', '조혈모세포 이식실 BMT'], icon: '🎗' },
      { f: '2F', depts: ['정신과 폐쇄 병동', '정신과 외래'], icon: '🧠' },
      { f: '1F', depts: ['대형 재활치료실 PT/OT Gym'], icon: '🦮', lobby: true },
    ],
  },
  dx: {
    name: '외래 · 진단 지원동', sub: '별관 3 · OUTPATIENT & DX', accent: '#0E7490', wall: '#E6E9EC', trim: '#C4CBD2',
    floors: [
      { f: '4F', depts: ['내시경실', '심혈관 조영실 Cath', '인터벤션 IR'], icon: '🔭' },
      { f: '3F', depts: ['외래 주사센터', '인공신장실 Dialysis'], icon: '💉', rooms: [
        { dept: '외래 주사센터', interior: 'INT-INFUSION-00001', entry: { x: 1, y: 6 } },
        { dept: '인공신장실 Dialysis' }, // 준비 중
      ] },
      { f: '2F', depts: ['안과 · 이비인후과 · 비뇨 · 신경과'], icon: '👁' },
      { f: '1F', depts: ['영상의학과', '진단검사의학과', '혈액은행'], icon: '🩻', lobby: true, interior: 'INT-RAD-00001', entry: { x: 1, y: 14 } },
    ],
  },
  admin: {
    name: '행정 · 백스테이지 윙', sub: '지원동 · ADMIN & SUPPORT', accent: '#6E6354', wall: '#D9D4C8', trim: '#B3AC98',
    floors: [
      { f: '3F', depts: ['간호부 사무실', '감염관리실', '시뮬레이션 랩'], icon: '🎓' },
      { f: '2F', depts: ['직원 락커룸', '의료진 휴게실 · 식당'], icon: '☕' },
      { f: '1F', depts: ['중앙공급실 SPD', '영양팀 · 배식실', '하역장'], icon: '📦', lobby: true },
      { f: 'B1', depts: ['영안실 · 부검실', '시설팀 기계실'], icon: '🔧' },
    ],
  },
};

function floorChip(fl: ElevFloor, counts: Record<string, { total: number; urgent: number }>) {
  if (!fl.sdepts) return null;
  let total = 0;
  let urgent = 0;
  for (const d of fl.sdepts) {
    if (counts[d]) {
      total += counts[d].total;
      urgent += counts[d].urgent;
    }
  }
  if (total === 0) return { bg: '#BFE3D0', dot: '#1E8A5B', label: '정상' };
  if (urgent > 0) return { bg: '#FCA5A5', dot: '#DC2626', label: `긴급 ${urgent}` };
  return { bg: '#FDE68A', dot: '#D97706', label: `진행 ${total}` };
}

const INK = colors.ink;

export function ElevatorScreen({
  building = 'tower',
  onPickFloor,
  onClose,
}: {
  building?: string;
  onPickFloor?: (building: string, floor: ElevFloor, from?: string, dir?: 'up' | 'down') => void;
  onClose?: () => void;
}) {
  const [bk, setBk] = useState(building in ELEVATOR_BUILDINGS ? building : 'tower');
  const b = ELEVATOR_BUILDINGS[bk];
  const counts = deptCounts(); // real "today" — same source as the board
  const lobbyFloor = (bld: ElevBuilding) => bld.floors.find((f) => f.lobby) ?? bld.floors[bld.floors.length - 1];

  const [cur, setCur] = useState(lobbyFloor(b).f); // where the cab is
  const [sel, setSel] = useState(lobbyFloor(b).f); // target floor
  const [selRoom, setSelRoom] = useState(0); // chosen room on a multi-dept floor
  const [riding, setRiding] = useState(false);
  const { width } = useWindowDimensions();
  // Full-screen cab doors: 0 = fully open (off-screen, panel visible), 1 = shut
  // (met at center, covering the whole screen). Pressing 이동 slides them shut over
  // the ENTIRE screen — that close IS the "doors closing" (no small door preview),
  // then we navigate and the destination DoorReveal continues from the shut state.
  const boarding = useSharedValue(0);

  useEffect(() => {
    const s = lobbyFloor(ELEVATOR_BUILDINGS[bk]).f;
    setCur(s);
    setSel(s);
    setSelRoom(0);
    setRiding(false);
    boarding.value = 0;
  }, [bk, boarding]);

  const idx = (x: string) => b.floors.findIndex((f) => f.f === x);
  const dir = idx(sel) < idx(cur) ? 'up' : idx(sel) > idx(cur) ? 'down' : 'same';
  const arrow = dir === 'up' ? '▲' : dir === 'down' ? '▼' : '';
  const roomLabel = b.floors.find((f) => f.f === sel)?.rooms?.[selRoom]?.dept;

  const half = width / 2 + 2;
  const leftDoor = useAnimatedStyle(() => ({ transform: [{ translateX: -half * (1 - boarding.value) }] }));
  const rightDoor = useAnimatedStyle(() => ({ transform: [{ translateX: half * (1 - boarding.value) }] }));
  const panelDim = useAnimatedStyle(() => ({ opacity: 1 - boarding.value }));

  const ride = () => {
    if (riding) return;
    const baseFloor = b.floors.find((f) => f.f === sel)!;
    // On a multi-dept floor, ride to the chosen room (its interior/entry override
    // the floor-level ones); depts is narrowed so the arrival ticker names the room.
    const room = baseFloor.rooms?.[selRoom];
    const floor: ElevFloor = room
      ? { ...baseFloor, interior: room.interior, entry: room.entry, depts: [room.dept] }
      : baseFloor;
    setRiding(true);
    // preload the destination map during the ride so it's ready when doors open
    if (floor.interior) api.prefetchInterior(floor.interior);
    const ease = Easing.inOut(Easing.cubic);
    boarding.value = withTiming(1, { duration: 520, easing: ease }); // whole screen SHUTS
    const fromF = cur; // where the cab boarded (dir/cur are render-time values)
    const rideDir = dir === 'up' || dir === 'down' ? dir : undefined;
    setTimeout(() => {
      setCur(sel);
      onPickFloor?.(bk, floor, fromF, rideDir);
      if (floor.interior) {
        // navigating away with the screen fully shut — the destination screen
        // continues shut→ticker→open via DoorReveal (opens once its map renders).
        return;
      }
      // 준비 중 floor: stay; reopen the doors.
      setRiding(false);
      boarding.value = withTiming(0, { duration: 520, easing: ease });
    }, 900);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.paper }} edges={['top', 'bottom']}>
      {/* top bar */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 10 }}>
        <Pressable onPress={onClose} hitSlop={10}><Text style={{ fontFamily: fonts.heading, fontSize: 18, color: INK }}>‹ 캠퍼스</Text></Pressable>
        <Text style={{ fontFamily: fonts.heading, fontSize: 16, color: INK }}>🛗 엘리베이터</Text>
        <Text style={{ fontSize: 16 }}>　</Text>
      </View>

      {/* building tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ maxHeight: 40, flexGrow: 0 }} contentContainerStyle={{ gap: 4, paddingHorizontal: 10, paddingBottom: 4 }}>
        {Object.entries(ELEVATOR_BUILDINGS).map(([k, v]) => (
          <Pressable key={k} onPress={() => setBk(k)} style={{ paddingHorizontal: 8, paddingVertical: 4, backgroundColor: k === bk ? v.accent : '#fff', borderWidth: 2, borderColor: INK }}>
            <Text style={{ fontFamily: fonts.heading, fontSize: 9, color: k === bk ? '#fff' : INK }}>{v.name}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <Animated.View style={[{ flex: 1 }, panelDim]}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 12, paddingBottom: 24 }}>
          {/* control-panel head: LCD floor indicator (real-elevator car-operating-
              panel look) — no door preview; the doors are the full-screen shut. */}
          <View style={{ backgroundColor: '#20262B', borderWidth: 3, borderColor: INK, padding: 12, marginBottom: 14, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: fonts.heading, fontSize: 12, color: '#E7ECEF' }}>{b.name}</Text>
              <Text style={{ fontFamily: fonts.body, fontSize: 9, color: '#8A97A0', marginTop: 2 }}>{b.sub}</Text>
              <Text style={{ fontFamily: fonts.body, fontSize: 8.5, color: '#6C7A83', marginTop: 6 }}>현재 {cur} · 정원 15인 · 630kg</Text>
            </View>
            {/* LCD readout */}
            <View style={{ backgroundColor: '#0A1016', borderWidth: 2, borderColor: '#000', paddingHorizontal: 12, paddingVertical: 6, minWidth: 66, alignItems: 'center' }}>
              <Text style={{ fontFamily: fonts.heading, fontSize: 8, color: '#3E5A46' }}>{riding ? `${arrow || '▲'}${arrow || '▲'}` : dir === 'same' ? '＝' : arrow}</Text>
              <Text style={{ fontFamily: fonts.heading, fontSize: 30, lineHeight: 32, color: riding ? '#FCD34D' : '#39D98A' }}>{sel}</Text>
              <Text style={{ fontFamily: fonts.heading, fontSize: 6.5, color: '#3E5A46', marginTop: 2 }}>{riding ? '이동 중' : '대기'}</Text>
            </View>
          </View>

          {/* floor directory */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <Text style={{ fontFamily: fonts.heading, fontSize: 10, color: colors.textSoft }}>층 선택 · 진료과 & 현황</Text>
            <Text style={{ fontFamily: fonts.body, fontSize: 8, color: colors.textSoft }}>🔴긴급 🟡진행 🟢정상 · 상황판 연동</Text>
          </View>
          <View style={{ gap: 11 }}>
            {b.floors.map((fl) => {
              const chip = floorChip(fl, counts);
              const selected = sel === fl.f;
              return (
                // hard offset shadow behind the row (forin's no-blur button look);
                // the SELECTED floor STAYS dropped into the shadow (pressed-in latch),
                // others sit up with their shadow showing. Press gives instant feedback.
                <View key={fl.f} style={{ gap: 8 }}>
                  <View style={{ position: 'relative' }}>
                    <View style={{ position: 'absolute', left: 4, top: 4, width: '100%', height: '100%', backgroundColor: INK }} />
                    <Pressable onPress={() => { setSel(fl.f); setSelRoom(0); }} style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'stretch', backgroundColor: selected ? b.accent : '#fff', borderWidth: 2.5, borderColor: INK, overflow: 'hidden', transform: pressed || selected ? [{ translateX: 4 }, { translateY: 4 }] : [] })}>
                      <View style={{ width: 42, alignItems: 'center', justifyContent: 'center', backgroundColor: selected ? '#fff' : colors.cream, borderRightWidth: 2, borderColor: INK, paddingVertical: 8 }}>
                        <Text style={{ fontFamily: fonts.heading, fontSize: 16, color: INK, lineHeight: 18 }}>{fl.f}</Text>
                        {fl.lobby ? <Text style={{ fontFamily: fonts.body, fontSize: 7, color: colors.textSoft, marginTop: 2 }}>LOBBY</Text> : null}
                      </View>
                      <View style={{ flex: 1, paddingHorizontal: 6, paddingVertical: 7, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <Text style={{ fontSize: 12 }}>{fl.icon}</Text>
                        <Text style={{ flex: 1, fontFamily: fonts.body, fontSize: 10.5, color: selected ? '#fff' : INK }}>{fl.depts.join(' · ')}</Text>
                      </View>
                      {chip ? (
                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 7, backgroundColor: chip.bg, borderLeftWidth: 2, borderColor: INK }}>
                          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: chip.dot, marginRight: 4 }} />
                          <Text style={{ fontFamily: fonts.heading, fontSize: 8.5, color: INK }}>{chip.label}</Text>
                        </View>
                      ) : null}
                    </Pressable>
                  </View>
                  {/* multi-dept floor → room sub-picker (choose which room to ride to) */}
                  {selected && fl.rooms ? (
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, paddingLeft: 46 }}>
                      {fl.rooms.map((rm, i) => {
                        const picked = selRoom === i;
                        const built = !!rm.interior;
                        return (
                          <Pressable key={rm.dept} onPress={() => setSelRoom(i)} style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 5, backgroundColor: picked ? b.accent : '#fff', borderWidth: 2, borderColor: INK, opacity: built ? 1 : 0.6 }}>
                            <Text style={{ fontFamily: fonts.body, fontSize: 9.5, color: picked ? '#fff' : INK }}>{rm.dept}</Text>
                            {!built ? <Text style={{ fontFamily: fonts.heading, fontSize: 7, color: picked ? '#fff' : colors.textSoft }}>준비 중</Text> : null}
                          </Pressable>
                        );
                      })}
                    </View>
                  ) : null}
                </View>
              );
            })}
          </View>
        </ScrollView>

        {/* GO bar */}
        <View style={{ padding: 12, borderTopWidth: 2, borderColor: INK, backgroundColor: colors.paper }}>
          <PixelButton
            label={riding ? '이동 중…' : `${sel} 층${roomLabel ? ` · ${roomLabel}` : ''}${dir === 'same' ? ' (현재 위치)' : `으로 이동 ${arrow}`}`}
            bg={b.accent}
            shadowColor={INK}
            textColor="#fff"
            disabled={riding}
            onPress={ride}
            full
          />
        </View>
      </Animated.View>

      {/* FULL-SCREEN cab doors — slide shut over everything on 이동, then the
          destination DoorReveal continues from this shut state. */}
      {riding ? (
        <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, flexDirection: 'row' }}>
          <Animated.View style={[{ width: '50%', height: '100%', backgroundColor: b.wall, borderRightWidth: 2, borderColor: INK }, leftDoor]}>
            <View style={{ position: 'absolute', right: 3, top: 0, bottom: 0, width: 4, backgroundColor: '#FFFFFF', opacity: 0.35 }} />
            <View style={{ position: 'absolute', right: 12, top: 0, bottom: 0, width: 2, backgroundColor: INK, opacity: 0.12 }} />
          </Animated.View>
          <Animated.View style={[{ width: '50%', height: '100%', backgroundColor: b.wall, borderLeftWidth: 2, borderColor: INK }, rightDoor]}>
            <View style={{ position: 'absolute', left: 3, top: 0, bottom: 0, width: 4, backgroundColor: '#FFFFFF', opacity: 0.35 }} />
            <View style={{ position: 'absolute', left: 12, top: 0, bottom: 0, width: 2, backgroundColor: INK, opacity: 0.12 }} />
          </Animated.View>
        </View>
      ) : null}
    </SafeAreaView>
  );
}
