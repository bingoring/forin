// interior-psych.jsx — 정신과 폐쇄병동 Inpatient Psych Unit (암센터 2F).
// Distinct: controlled double-door entry, an always-observed nursing station
// with a glass ObsWindow onto an open day room, ligature-safe patient rooms,
// and a padded seclusion room. New objects: interior-objects-psych2.jsx.

function ScreenInteriorPsych() {
  const COLS = 28, ROWS = 44;
  const Th = window.IThreshold;
  const W = window;

  const regions = [
    { id: 'sally',   name: '이중 통제문 · 소지품 보관',  icon: '🔒', bounds: { x: 0,  y: 0,  w: 28, h: 9 } },
    { id: 'station', name: '관찰 간호 스테이션',         icon: '👁', bounds: { x: 0,  y: 8,  w: 14, h: 16 } },
    { id: 'dayroom', name: '데이룸 (공동 활동)',         icon: '🎲', bounds: { x: 13, y: 8,  w: 15, h: 16 } },
    { id: 'rooms',   name: '안전 병실',                  icon: '🛏', bounds: { x: 0,  y: 23, w: 14, h: 21 } },
    { id: 'seclusion', name: '안정실 (Seclusion)',       icon: '🧩', bounds: { x: 13, y: 23, w: 15, h: 21 } },
  ];

  const rooms = [
    { id: 'sally',   name: '이중 통제문', sub: '소지품·금속 확인', icon: '🔒', color: '#FDE68A', x: 5,  y: 4, questCount: 1 },
    { id: 'station', name: '관찰 스테이션', sub: '상시 관찰',   icon: '👁', color: '#BAE6FD', x: 6,  y: 15, questCount: 1 },
    { id: 'dayroom', name: '데이룸',      sub: '집단 프로그램',  icon: '🎲', color: '#A7D0BC', x: 21, y: 15 },
    { id: 'rooms',   name: '안전 병실',   sub: '자해 방지',     icon: '🛏', color: '#DDD6FE', x: 6,  y: 35 },
    { id: 'seclusion', name: '안정실',    sub: '격리·진정',     icon: '🧩', color: '#C7B8E8', x: 21, y: 35, questCount: 1 },
  ];

  return (
    <InteriorScreen
      label="06p Interior · PSYCH" deptCode="정신과 폐쇄병동 · 암센터 2F" deptColor="#7C6BA8"
      cols={COLS} rows={ROWS} floor="internal"
      playerStart={{ x: 4, y: 7 }}
      rooms={rooms}
      regions={regions}
      missionText="이중 통제문 · 반입 금지품 확인 후 병동 진입"
      render={() => (
        <>
          {/* ═══════════════ OUTER WALLS ═══════════════ */}
          <IWall x={0} y={0} w={28} h={1}/>
          <IWall x={0} y={1} w={1} h={4}/>
          <IDoor x={0} y={5} w={1} h={2} kind="auto" label="← 엘리베이터"/>
          <IWall x={0} y={7} w={1} h={36}/>
          <IWall x={27} y={1} w={1} h={42}/>
          <IWall x={0} y={43} w={28} h={1}/>

          {/* ═══ SALLY-PORT / WARD DIVIDER (y8) — single controlled door ═══ */}
          <IWall x={1}  y={8} w={5} h={1}/>
          <Th    x={6}  y={8} w={2} h={1} tone="sterile" label="통제문 (카드)"/>
          <IWall x={8}  y={8} w={19} h={1}/>
          {/* station | dayroom divider = observation glass */}
          <IWall  x={13} y={9} w={1} h={2}/>
          <W.ObsWindow x={13} y={12} w={1}/>
          <IWall  x={13} y={14} w={1} h={10}/>

          {/* ═══ UPPER / LOWER DIVIDER (y23) ═══ */}
          <IWall x={1}  y={23} w={5} h={1}/>
          <Th    x={6}  y={23} w={2} h={1} label="→ 병실"/>
          <IWall x={8}  y={23} w={6} h={1}/>
          <Th    x={14} y={23} w={2} h={1} tone="sterile" label="→ 안정실"/>
          <IWall x={16} y={23} w={11} h={1}/>
          {/* rooms | seclusion divider */}
          <IWall x={13} y={24} w={1} h={19}/>

          {/* ════════════════ 이중 통제문 · 소지품 보관 (y1-7) ════════════════ */}
          <BayLabel x={1} y={1} text="SECURE ENTRY · 소지품 보관" highlight/>
          <window.MetalDetector x={3} y={2}/>
          <ICabinet x={7} y={2} w={3} variant="linen" label="LOCKER"/>
          <ICabinet x={11} y={2} w={3} variant="linen"/>
          <IReception x={16} y={3} w={4} h={1} label="보안 데스크"/>
          <INpc x={5} y={5} kind="nurse" hair="#3C2A18" shirt="#FDE68A"/>
          <INpc x={17} y={5} kind="patient" hair="#9A6B3F"/>
          <IHotspot x={4} y={3} kind="quest" label="반입 금지품 확인"/>

          {/* ════════════════ 관찰 간호 스테이션 (station, y9-22) ════════════════ */}
          <BayLabel x={1} y={9} text="OBSERVATION STATION" highlight/>
          <NurseStationDesk x={2} y={12} w={9} h={5}/>
          <DeskPhone x={3} y={12}/>
          <ChartBinder x={9} y={12}/>
          <W.CompCart x={2} y={18}/>
          {/* charge nurse continuously observing the day room through glass */}
          <INpc x={6} y={16} kind="nurse" hair="#3C2A18" shirt="#A5D8E8"/>
          <IHotspot x={6} y={15} kind="info" label="상시 관찰·라운드"/>
          <INpc x={9} y={19} kind="doctor" hair="#1F2937"/>
          {/* secure med room */}
          <ICabinet x={2} y={20} w={3} variant="drug" label="MED"/>

          {/* ════════════════ 데이룸 (dayroom, y9-22) ════════════════ */}
          <BayLabel x={14} y={9} text="DAY ROOM · 공동 활동"/>
          <W.GroupTable x={15} y={12}/>
          <W.GroupTable x={20} y={17}/>
          <window.WallTV x={24} y={9} w={2}/>
          {[15,17].map((cx,i)=><IChair key={i} x={cx} y={15} color="#A7D0BC" facing="up"/>)}
          <IChair x={19} y={20} color="#A7D0BC" facing="up"/>
          <IChair x={23} y={20} color="#A7D0BC" facing="up"/>
          <window.WaterCooler x={25} y={13}/>
          <INpc x={18} y={13} kind="patient" hair="#5C3A1A"/>
          <INpc x={22} y={18} kind="nurse" hair="#7C3F00" shirt="#A7D0BC"/>
          <IHotspot x={16} y={12} kind="info" label="집단 치료 프로그램"/>
          <IPlant x={25} y={21}/>

          {/* ════════════════ 안전 병실 (rooms, y24-44) ════════════════ */}
          <BayLabel x={1} y={24} text="SAFE ROOMS · 자해 방지"/>
          {/* bolted safe beds, no ligature points, observation-friendly */}
          <W.SafeBed x={2} y={27}/>
          <W.SafeBed x={8} y={27}/>
          <W.SafeBed x={2} y={37}/>
          <W.SafeBed x={8} y={37}/>
          <INpc x={6} y={33} kind="nurse" hair="#3C2A18" shirt="#DDD6FE"/>
          <IHotspot x={3} y={27} kind="info" label="1:1 관찰"/>
          <INpc x={10} y={31} kind="patient" hair="#9A6B3F"/>

          {/* ════════════════ 안정실 Seclusion (seclusion, y24-44) ════════════════ */}
          <BayLabel x={14} y={24} text="SECLUSION · 안정실"/>
          {/* fully padded floor + walls, camera, nothing removable */}
          <W.SeclusionPad x={15} y={28} w={4}/>
          <W.SeclusionPad x={15} y={34} w={4}/>
          <W.ObsWindow x={20} y={26} w={3}/>
          {/* ceiling camera marker */}
          <IHotspot x={16} y={28} kind="urgent" label="CCTV 상시 관찰"/>
          <INpc x={17} y={32} kind="patient" hair="#5C3A1A"/>
          <INpc x={22} y={38} kind="nurse" hair="#3C2A18" shirt="#C7B8E8"/>
          <IPlant x={25} y={41}/>
        </>
      )}
    />
  );
}

Object.assign(window, { ScreenInteriorPsych });
