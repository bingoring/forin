// interior-picu.jsx — 소아 중환자실 PICU (여성소아 센터 5F).
// Glass-walled single-patient ICU rooms for children, a central monitor hub,
// a pediatric crash/resus bay, and a family-presence zone (parents stay at the
// bedside). New objects: interior-objects-picu2.jsx. Reused: BankOfMonitors,
// IMonitor, IIV, SinkOR, GownBox, ReclinerDaybed, NursingRecliner.

function ScreenInteriorPICU() {
  const COLS = 28, ROWS = 44;
  const Th = window.IThreshold;
  const W = window;

  const regions = [
    { id: 'ante',    name: '전실 · 손위생',            icon: '🧼', bounds: { x: 0,  y: 0,  w: 28, h: 8 } },
    { id: 'station', name: '중앙 모니터 허브',          icon: '🖥', bounds: { x: 0,  y: 7,  w: 28, h: 11 } },
    { id: 'room1',   name: 'PICU 1 (유리 격리실)',      icon: '🧒', bounds: { x: 0,  y: 17, w: 10, h: 27 } },
    { id: 'room2',   name: 'PICU 2 (유리 격리실)',      icon: '🧒', bounds: { x: 9,  y: 17, w: 10, h: 27 } },
    { id: 'room3',   name: 'PICU 3 · 가족 상주',        icon: '👨‍👩‍👧', bounds: { x: 18, y: 17, w: 10, h: 27 } },
  ];

  const rooms = [
    { id: 'ante',    name: '전실',      sub: '가운·손위생',  icon: '🧼', color: '#A7F3D0', x: 5,  y: 4 },
    { id: 'station', name: '모니터 허브', sub: '3-방 감시',   icon: '🖥', color: '#BAE6FD', x: 14, y: 12, questCount: 1 },
    { id: 'room1',   name: 'PICU 1',    sub: '인공호흡·진정', icon: '🧒', color: '#C7D2FE', x: 5,  y: 30, questCount: 1 },
    { id: 'room2',   name: 'PICU 2',    sub: '집중 감시',    icon: '🧒', color: '#FBCFE8', x: 14, y: 30 },
    { id: 'room3',   name: 'PICU 3',    sub: '가족 상주',    icon: '👨‍👩‍👧', color: '#FDE68A', x: 23, y: 30 },
  ];

  return (
    <InteriorScreen
      label="06t Interior · PICU" deptCode="소아 중환자실 PICU · 여성소아 5F" deptColor="#6D6BC4"
      cols={COLS} rows={ROWS} floor="peds"
      playerStart={{ x: 4, y: 6 }}
      rooms={rooms}
      regions={regions}
      missionText="PICU 1 · 소아 인공호흡기 설정 확인 + 진정 사정"
      render={() => (
        <>
          <W.Tint x={1} y={18} w={26} h={25} color="#232C48" op={0.12}/>

          {/* ═══════════════ OUTER WALLS ═══════════════ */}
          <IWall x={0} y={0} w={28} h={1}/>
          <IWall x={0} y={1} w={1} h={4}/>
          <IDoor x={0} y={5} w={1} h={2} kind="auto" label="← 엘리베이터"/>
          <IWall x={0} y={7} w={1} h={36}/>
          <IWall x={27} y={1} w={1} h={42}/>
          <IWall x={0} y={43} w={28} h={1}/>

          {/* ═══ ANTEROOM / HUB DIVIDER (y7) — sterile gate ═══ */}
          <IWall x={1}  y={7} w={5} h={1}/>
          <Th    x={6}  y={7} w={2} h={1} tone="sterile" label="손위생 후 입장"/>
          <IWall x={8}  y={7} w={19} h={1}/>

          {/* ═══ HUB / ROOMS DIVIDER (y17) — glass fronts + sliding doors ═══ */}
          <IGlass x={1}  y={17} w={2} h={1}/><IDoor x={3}  y={17} w={1} h={1} kind="auto"/><IGlass x={4}  y={17} w={5} h={1}/>
          <IGlass x={10} y={17} w={2} h={1}/><IDoor x={12} y={17} w={1} h={1} kind="auto"/><IGlass x={13} y={17} w={5} h={1}/>
          <IGlass x={19} y={17} w={2} h={1}/><IDoor x={21} y={17} w={1} h={1} kind="auto"/><IGlass x={22} y={17} w={5} h={1}/>
          {/* room glass dividers */}
          <IGlass x={9}  y={18} w={1} h={25}/>
          <IGlass x={18} y={18} w={1} h={25}/>

          {/* ════════════════ 전실 · 손위생 (y1-6) ════════════════ */}
          <BayLabel x={1} y={1} text="ANTEROOM · 손위생" highlight/>
          <W.SinkOR x={2} y={2}/>
          <window.GownBox x={6} y={2}/>
          <window.HandSanitizer x={9} y={2}/>
          <INpc x={5} y={5} kind="nurse" hair="#3C2A18" shirt="#C7D2FE"/>
          <IHotspot x={3} y={2} kind="info" label="가운·손위생"/>

          {/* ════════════════ 중앙 모니터 허브 (station, y8-16) ════════════════ */}
          <BayLabel x={1} y={8} text="CENTRAL MONITOR HUB" highlight/>
          <window.BankOfMonitors x={9} y={9}/>
          <NurseStationDesk x={2} y={11} w={6} h={4}/>
          <IReception x={20} y={10} w={5} h={1} label="PICU DESK"/>
          <window.CrashCart x={24} y={13}/>
          <DeskPhone x={3} y={11}/>
          <INpc x={5} y={14} kind="nurse" hair="#3C2A18" shirt="#A5D8E8"/>
          <IHotspot x={5} y={13} kind="quest" label="3-방 활력 감시"/>
          <INpc x={12} y={14} kind="doctor" hair="#1F2937"/>

          {/* ════════════════ PICU 1 (room1, y18-44) ════════════════ */}
          <BayLabel x={1} y={18} text="PICU 1"/>
          <W.PICUBed x={2} y={22} occupied/>
          <W.PedVentilator x={1} y={30}/>
          <IMonitor x={7} y={21} beep/>
          <window.IIV x={7} y={24}/>
          <INpc x={5} y={35} kind="nurse" hair="#3C2A18" shirt="#C7D2FE"/>
          <IHotspot x={3} y={22} kind="quest" label="소아 vent·진정 사정"/>

          {/* ════════════════ PICU 2 (room2, y18-44) ════════════════ */}
          <BayLabel x={10} y={18} text="PICU 2"/>
          <W.PICUBed x={11} y={22} occupied/>
          <IMonitor x={16} y={21} beep/>
          <W.BroselowCart x={11} y={31}/>
          <INpc x={15} y={36} kind="nurse" hair="#7C3F00" shirt="#FBCFE8"/>
          <IHotspot x={12} y={22} kind="info" label="집중 감시"/>

          {/* ════════════════ PICU 3 · 가족 상주 (room3, y18-44) ════════════════ */}
          <BayLabel x={19} y={18} text="PICU 3 · 가족 상주"/>
          <W.PICUBed x={20} y={22} occupied/>
          <IMonitor x={25} y={21}/>
          {/* parents stay at the bedside */}
          <W.ReclinerDaybed x={20} y={31}/>
          <INpc x={22} y={35} kind="parent" hair="#5C3A1A"/>
          <IPlant x={25} y={42}/>
          <IHotspot x={20} y={31} kind="info" label="가족 상주 지지"/>
        </>
      )}
    />
  );
}

Object.assign(window, { ScreenInteriorPICU });
