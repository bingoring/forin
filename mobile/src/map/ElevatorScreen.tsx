// Elevator entry (5f-ii) — RN port of screen-elevator.jsx. Entering a campus
// pavilion opens this: building tabs + a pixel cab (floor read-out + sliding
// doors) + a floor directory where each floor shows its departments and a LIVE
// situation chip read from the shared scenario source (same as the 상황판), then
// you pick a floor to ride to that floor's interior.
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withSequence, withTiming } from 'react-native-reanimated';
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
      { f: '8F', depts: ['일반 내과 병동', '외과 병동', '정형외과 병동'], icon: '🛏' },
      { f: '6F', depts: ['외과 · 정형외과 병동'], icon: '🦴' },
      { f: '4F', depts: ['중앙 ICU', 'CCU · Neuro · TICU'], icon: '🫀', sdepts: ['ICU'] },
      { f: '3F', depts: ['수술실 OR', '회복실 PACU', '당일수술센터'], icon: '🔪', sdepts: ['OR'] },
      { f: '2F', depts: ['피부과 외래', '내과 · 외과 외래'], icon: '🩺', interior: 'CLINIC-IM-00001' },
      { f: '1F', depts: ['응급의료센터 ER', '원내 약국', '메인 로비'], icon: '🚑', sdepts: ['ER', 'PHARMA'], lobby: true, interior: 'INT-ER-00001' },
    ],
  },
  women: {
    name: '여성소아 센터', sub: '별관 1 · WOMEN & CHILDREN', accent: '#C2487E', wall: '#F3E6D6', trim: '#E0CBB4',
    floors: [
      { f: '4F', depts: ['신생아 중환자실 NICU', '소아 중환자실 PICU'], icon: '👶' },
      { f: '3F', depts: ['가족 분만실 L&D', '산후 병동', '신생아실'], icon: '🤰' },
      { f: '2F', depts: ['소아 일반 병동'], icon: '🧸', sdepts: ['PEDS'] },
      { f: '1F', depts: ['소아청소년과 외래', '산부인과 외래', '키즈 놀이광장'], icon: '🎈', lobby: true },
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
      { f: '3F', depts: ['인공신장실 Dialysis', '외래 주사센터'], icon: '💉' },
      { f: '2F', depts: ['안과 · 이비인후과 · 비뇨 · 신경과'], icon: '👁' },
      { f: '1F', depts: ['영상의학과', '진단검사의학과', '혈액은행'], icon: '🩻', lobby: true },
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
  onPickFloor?: (building: string, floor: ElevFloor) => void;
  onClose?: () => void;
}) {
  const [bk, setBk] = useState(building in ELEVATOR_BUILDINGS ? building : 'tower');
  const b = ELEVATOR_BUILDINGS[bk];
  const counts = deptCounts(); // real "today" — same source as the board
  const lobbyFloor = (bld: ElevBuilding) => bld.floors.find((f) => f.lobby) ?? bld.floors[bld.floors.length - 1];

  const [cur, setCur] = useState(lobbyFloor(b).f); // where the cab is
  const [sel, setSel] = useState(lobbyFloor(b).f); // target floor
  const [riding, setRiding] = useState(false);
  const door = useSharedValue(0); // 0 = open (boarding), 1 = closed (riding)

  useEffect(() => {
    const s = lobbyFloor(ELEVATOR_BUILDINGS[bk]).f;
    setCur(s);
    setSel(s);
    setRiding(false);
    door.value = 0;
  }, [bk, door]);

  const idx = (x: string) => b.floors.findIndex((f) => f.f === x);
  const dir = idx(sel) < idx(cur) ? 'up' : idx(sel) > idx(cur) ? 'down' : 'same';
  const arrow = dir === 'up' ? '▲' : dir === 'down' ? '▼' : '';

  const leftDoor = useAnimatedStyle(() => ({ transform: [{ scaleX: door.value }] }));
  const rightDoor = useAnimatedStyle(() => ({ transform: [{ scaleX: door.value }] }));

  const ride = () => {
    if (riding) return;
    const floor = b.floors.find((f) => f.f === sel)!;
    setRiding(true);
    // preload the destination map during the ride so it's ready when doors open
    if (floor.interior) api.prefetchInterior(floor.interior);
    // doors CLOSE (board) → hold while riding → OPEN (arrive)
    const ease = Easing.inOut(Easing.ease);
    door.value = withSequence(
      withTiming(1, { duration: 450, easing: ease }),
      withDelay(900, withTiming(0, { duration: 450, easing: ease })),
    );
    setTimeout(() => {
      setCur(sel);
      setRiding(false);
      onPickFloor?.(bk, floor); // navigate (or 준비 중) right as the doors finish opening
    }, 1800);
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

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 12, paddingBottom: 24 }}>
        {/* cab header: readout + doors */}
        <View style={{ backgroundColor: b.wall, borderWidth: 3, borderColor: INK, padding: 12, marginBottom: 14 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: fonts.heading, fontSize: 13, color: INK }}>{b.name}</Text>
              <Text style={{ fontFamily: fonts.body, fontSize: 9, color: colors.textSoft, marginTop: 1 }}>{b.sub}</Text>
            </View>
            <View style={{ backgroundColor: '#0F1A24', borderWidth: 2, borderColor: INK, paddingHorizontal: 10, paddingVertical: 4, minWidth: 48, alignItems: 'center' }}>
              <Text style={{ fontFamily: fonts.heading, fontSize: 18, color: riding ? '#FBBF24' : '#22D3EE', lineHeight: 20 }}>{sel}</Text>
              <Text style={{ fontFamily: fonts.heading, fontSize: 6, color: '#5A6B78', marginTop: 1 }}>{riding ? `${arrow || '▲'} 이동중` : '정지'}</Text>
            </View>
          </View>
          {/* sliding doors */}
          <View style={{ height: 30, borderWidth: 2, borderColor: INK, backgroundColor: b.trim, overflow: 'hidden', flexDirection: 'row' }}>
            <Animated.View style={[{ width: '50%', height: '100%', backgroundColor: b.wall, borderRightWidth: 1, borderColor: INK, transformOrigin: 'left' }, leftDoor]} />
            <Animated.View style={[{ width: '50%', height: '100%', backgroundColor: b.wall, borderLeftWidth: 1, borderColor: INK, transformOrigin: 'right' }, rightDoor]} />
            {riding ? (
              <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontFamily: fonts.heading, fontSize: 9, color: INK }}>탑승 중…</Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* floor directory */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <Text style={{ fontFamily: fonts.heading, fontSize: 10, color: colors.textSoft }}>층 선택 · 진료과 & 현황</Text>
          <Text style={{ fontFamily: fonts.body, fontSize: 8, color: colors.textSoft }}>🔴긴급 🟡진행 🟢정상 · 상황판 연동</Text>
        </View>
        <View style={{ gap: 7 }}>
          {b.floors.map((fl) => {
            const chip = floorChip(fl, counts);
            const selected = sel === fl.f;
            return (
              <Pressable key={fl.f} onPress={() => setSel(fl.f)} style={{ flexDirection: 'row', alignItems: 'stretch', backgroundColor: selected ? b.accent : '#fff', borderWidth: 2.5, borderColor: INK, overflow: 'hidden' }}>
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
            );
          })}
        </View>
      </ScrollView>

      {/* GO bar */}
      <View style={{ padding: 12, borderTopWidth: 2, borderColor: INK, backgroundColor: colors.paper }}>
        <PixelButton
          label={riding ? '이동 중…' : dir === 'same' ? `${sel} 층 (현재 위치)` : `${sel} 층으로 이동 ${arrow}`}
          bg={b.accent}
          shadowColor={INK}
          textColor="#fff"
          disabled={riding}
          onPress={ride}
          full
        />
      </View>
    </SafeAreaView>
  );
}
