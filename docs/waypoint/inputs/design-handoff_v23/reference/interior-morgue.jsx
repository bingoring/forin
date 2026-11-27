// interior-morgue.jsx — 영안실 · 부검실 Morgue & Autopsy (지원동 B1).
// Somber, controlled-access basement: a cold-storage cadaver bank, an autopsy
// suite, a family viewing room, and a facilities/mechanical corner. New objects:
// interior-objects-morgue2.jsx.

function ScreenInteriorMorgue() {
  const COLS = 28, ROWS = 40;
  const Th = window.IThreshold;
  const W = window;

  const regions = [
    { id: 'reception', name: '접수 · 인수인계',          icon: '📋', bounds: { x: 0,  y: 0,  w: 28, h: 9 } },
    { id: 'cold',    name: '시신 냉장 보관실',           icon: '🧊', bounds: { x: 0,  y: 8,  w: 14, h: 18 } },
    { id: 'autopsy', name: '부검실 (Autopsy)',          icon: '🔬', bounds: { x: 13, y: 8,  w: 15, h: 18 } },
    { id: 'viewing', name: '유족 참관실',               icon: '🕯', bounds: { x: 0,  y: 25, w: 15, h: 15 } },
    { id: 'mech',    name: '시설팀 기계실',             icon: '🔧', bounds: { x: 14, y: 25, w: 14, h: 15 } },
  ];

  const rooms = [
    { id: 'reception', name: '접수·인수', sub: '고인 확인',   icon: '📋', color: '#BAE6FD', x: 6,  y: 4, questCount: 1 },
    { id: 'cold',    name: '냉장 보관실', sub: '시신 안치',   icon: '🧊', color: '#A7C7DC', x: 6,  y: 16 },
    { id: 'autopsy', name: '부검실',     sub: '검안·부검',    icon: '🔬', color: '#C7D0D8', x: 20, y: 16, questCount: 1 },
    { id: 'viewing', name: '유족 참관실', sub: '고별·참관',   icon: '🕯', color: '#DDD6FE', x: 6,  y: 33 },
    { id: 'mech',    name: '기계실',     sub: '시설·설비',    icon: '🔧', color: '#C4CBD2', x: 21, y: 33 },
  ];

  return (
    <InteriorScreen
      label="06m Interior · MORGUE" deptCode="영안실·부검실 · 지원동 B1" deptColor="#4B5563"
      cols={COLS} rows={ROWS} floor="clinical"
      playerStart={{ x: 4, y: 7 }}
      rooms={rooms}
      regions={regions}
      missionText="접수 · 고인 신원 확인 후 냉장 안치 인수인계"
      render={() => (
        <>
          {/* dim basement tint over the whole floor */}
          <Tint x={1} y={1} w={26} h={38} color="#1E2530" op={0.14}/>

          {/* ═══════════════ OUTER WALLS ═══════════════ */}
          <IWall x={0} y={0} w={28} h={1}/>
          <IWall x={0} y={1} w={1} h={4}/>
          <IDoor x={0} y={5} w={1} h={2} kind="auto" label="← 엘리베이터"/>
          <IWall x={0} y={7} w={1} h={32}/>
          <IWall x={27} y={1} w={1} h={38}/>
          <IWall x={0} y={39} w={28} h={1}/>

          {/* ═══ RECEPTION / MID DIVIDER (y8) ═══ */}
          <IWall x={1}  y={8} w={5} h={1}/>
          <Th    x={6}  y={8} w={2} h={1} label="→ 냉장실"/>
          <IWall x={8}  y={8} w={5} h={1}/>
          <Th    x={13} y={8} w={2} h={1} tone="sterile" label="→ 부검실"/>
          <IWall x={15} y={8} w={12} h={1}/>
          <IWall x={13} y={9} w={1} h={17}/>

          {/* ═══ MID / LOWER DIVIDER (y25) ═══ */}
          <IWall x={1}  y={25} w={5} h={1}/>
          <Th    x={6}  y={25} w={2} h={1} label="→ 참관실"/>
          <IWall x={8}  y={25} w={6} h={1}/>
          <Th    x={14} y={25} w={2} h={1} label="→ 기계실"/>
          <IWall x={16} y={25} w={11} h={1}/>
          <IWall x={14} y={26} w={1} h={13}/>

          {/* ════════════════ 접수 · 인수인계 (reception, y1-7) ════════════════ */}
          <BayLabel x={1} y={1} text="RECEPTION · 인수인계"/>
          <IReception x={2} y={3} w={5} h={1} label="영안실 접수"/>
          <ChartBinder x={9} y={2}/>
          <window.DeskPhone x={11} y={2}/>
          <window.HandSanitizer x={14} y={2}/>
          <INpc x={4} y={5} kind="doctor" hair="#3C2A18"/>
          <IHotspot x={3} y={3} kind="quest" label="고인 신원 확인"/>
          <INpc x={17} y={5} kind="visitor" hair="#5C3A1A"/>
          <IPlant x={25} y={5}/>

          {/* ════════════════ 시신 냉장 보관실 (cold, y9-24) ════════════════ */}
          <BayLabel x={1} y={9} text="COLD STORAGE · 냉장 보관" highlight/>
          <W.CadaverFridge x={2} y={11} w={4}/>
          <W.CadaverFridge x={7} y={11} w={4}/>
          <W.CadaverFridge x={2} y={18} w={4}/>
          {/* transfer trolley */}
          <window.Gurney x={8} y={19}/>
          <INpc x={6} y={16} kind="nurse" hair="#3C2A18" shirt="#A7C7DC"/>
          <IHotspot x={3} y={11} kind="info" label="안치·라벨 대조"/>

          {/* ════════════════ 부검실 (autopsy, y9-24) ════════════════ */}
          <BayLabel x={14} y={9} text="AUTOPSY SUITE"/>
          <W.AutopsyTable x={15} y={12}/>
          <window.SinkOR x={22} y={11}/>
          <window.InstrumentTray x={22} y={16}/>
          <IMonitor x={15} y={11}/>
          <window.WasteBin x={25} y={20} tone="infectious"/>
          <INpc x={17} y={19} kind="doctor" hair="#1F2937"/>
          <INpc x={20} y={20} kind="nurse" hair="#5C3A1A" shirt="#C7D0D8"/>
          <IHotspot x={16} y={12} kind="quest" label="검안·부검 기록"/>

          {/* ════════════════ 유족 참관실 (viewing, y26-38) ════════════════ */}
          <BayLabel x={1} y={26} text="VIEWING ROOM · 유족 참관"/>
          <W.ViewingBier x={2} y={29}/>
          {/* seating for family, subdued */}
          <IChair x={2} y={34} color="#DDD6FE" facing="down"/>
          <IChair x={4} y={34} color="#DDD6FE" facing="down"/>
          <IChair x={6} y={34} color="#DDD6FE" facing="down"/>
          <IPlant x={11} y={29}/>
          <INpc x={8} y={31} kind="visitor" hair="#3C2A18"/>
          <INpc x={9} y={33} kind="visitor" hair="#9A6B3F"/>
          <IHotspot x={3} y={29} kind="info" label="고별 참관"/>

          {/* ════════════════ 시설팀 기계실 (mech, y26-38) ════════════════ */}
          <BayLabel x={15} y={26} text="MECHANICAL · 기계실"/>
          <ICabinet x={15} y={28} w={4} variant="equipment" label="설비"/>
          <ICabinet x={19} y={28} w={4} variant="equipment"/>
          <window.Autoclave x={15} y={32}/>
          <INpc x={21} y={34} kind="doctor" hair="#7C3F00"/>
          <IHotspot x={16} y={32} kind="info" label="설비 점검"/>
          <IPlant x={25} y={37}/>
        </>
      )}
    />
  );
}

Object.assign(window, { ScreenInteriorMorgue });
