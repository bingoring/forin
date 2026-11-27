// interior-dial.jsx — 인공신장실 Hemodialysis Unit (외래·진단동 3F).
// Structure: check-in/weigh → open dialysis floor (rows of chairs + machines)
// around a central nursing island → RO water treatment room + isolation station.
// New objects: interior-objects-dial2.jsx.

function ScreenInteriorDial() {
  const COLS = 28, ROWS = 44;
  const Th = window.IThreshold;
  const W = window;

  const regions = [
    { id: 'checkin', name: '접수 · 체중 측정',       icon: '⚖️', bounds: { x: 0,  y: 0,  w: 28, h: 10 } },
    { id: 'floor',   name: '투석 치료실 (오픈 플로어)', icon: '🩸', bounds: { x: 0,  y: 9,  w: 28, h: 26 } },
    { id: 'water',   name: 'RO 수처리실',            icon: '💧', bounds: { x: 0,  y: 34, w: 14, h: 10 } },
    { id: 'iso',     name: '격리 투석 스테이션',       icon: '⚠️', bounds: { x: 13, y: 34, w: 15, h: 10 } },
  ];

  const rooms = [
    { id: 'checkin', name: '접수·체중',  sub: '투석 전 체중',  icon: '⚖️', color: '#BAE6FD', x: 5,  y: 5, questCount: 1 },
    { id: 'floor',   name: '투석 치료실', sub: '혈액투석 HD',   icon: '🩸', color: '#FCA5A5', x: 13, y: 20, questCount: 2 },
    { id: 'water',   name: 'RO 수처리실', sub: '역삼투 정수',   icon: '💧', color: '#A7F3D0', x: 6,  y: 39 },
    { id: 'iso',     name: '격리 투석',   sub: 'B형간염 격리',  icon: '⚠️', color: '#FDE68A', x: 21, y: 39, questCount: 1 },
  ];

  return (
    <InteriorScreen
      label="06o Interior · DIALYSIS" deptCode="인공신장실 · 외래진단동 3F" deptColor="#0E7490"
      cols={COLS} rows={ROWS} floor="clinical"
      playerStart={{ x: 4, y: 8 }}
      rooms={rooms}
      regions={regions}
      missionText="투석 치료실 Chair 2 · 투석 전 체중·바이탈 + 천자 확인"
      render={() => (
        <>
          {/* ═══════════════ OUTER WALLS ═══════════════ */}
          <IWall x={0} y={0} w={28} h={1}/>
          <IWall x={0} y={1} w={1} h={6}/>
          <IDoor x={0} y={7} w={1} h={3} kind="auto" label="← 엘리베이터"/>
          <IWall x={0} y={10} w={1} h={33}/>
          <IWall x={27} y={1} w={1} h={42}/>
          <IWall x={0} y={43} w={28} h={1}/>

          {/* ═══ CHECK-IN / FLOOR DIVIDER (y9) ═══ */}
          <IWall x={1}  y={9} w={5} h={1}/>
          <Th    x={6}  y={9} w={3} h={1} label="→ 치료실"/>
          <IWall x={9}  y={9} w={18} h={1}/>

          {/* ═══ FLOOR / SUPPORT DIVIDER (y34) ═══ */}
          <IWall x={1}  y={34} w={5} h={1}/>
          <Th    x={6}  y={34} w={2} h={1} label="→ 수처리"/>
          <IWall x={8}  y={34} w={6} h={1}/>
          <Th    x={14} y={34} w={2} h={1} tone="sterile" label="→ 격리"/>
          <IWall x={16} y={34} w={11} h={1}/>
          {/* water | iso divider */}
          <IWall x={13} y={35} w={1} h={8}/>

          {/* ════════════════ 접수 · 체중 측정 (y1-8) ════════════════ */}
          <BayLabel x={1} y={1} text="DIALYSIS CHECK-IN · 체중"/>
          <IReception x={2} y={3} w={4} h={1} label="접수"/>
          <W.StadiometerScale x={7} y={2}/>
          <IMonitor x={9} y={2}/>
          {[16,18,20,22].map((cx,i)=><IChair key={i} x={cx} y={6} color="#BAE6FD" facing="up"/>)}
          <INpc x={3} y={4} kind="nurse" hair="#3C2A18" shirt="#A5D8E8"/>
          <INpc x={8} y={5} kind="patient" hair="#9A6B3F"/>
          <IHotspot x={7} y={3} kind="quest" label="투석 전 체중 측정"/>
          <IPlant x={25} y={2}/>

          {/* ════════════════ 투석 치료실 오픈 플로어 (y10-33) ════════════════ */}
          <BayLabel x={1} y={10} text="HEMODIALYSIS FLOOR" highlight/>
          {/* left column of stations (chair + machine) */}
          <W.DialysisChair x={2} y={13} occupied/>
          <W.DialysisMachine x={6} y={13}/>
          <W.DialysisChair x={2} y={20} occupied/>
          <W.DialysisMachine x={6} y={20}/>
          <W.DialysisChair x={2} y={27} occupied/>
          <W.DialysisMachine x={6} y={27}/>
          {/* central nursing island */}
          <NurseStationDesk x={10} y={16} w={8} h={5}/>
          <W.CompCart x={11} y={22}/>
          <INpc x={13} y={19} kind="nurse" hair="#3C2A18" shirt="#FCA5A5"/>
          <IHotspot x={3} y={20} kind="quest" label="바이탈·천자(AVF) 확인"/>
          <INpc x={5} y={17} kind="nurse" hair="#7C3F00" shirt="#A5D8E8"/>
          {/* right column of stations */}
          <W.DialysisChair x={20} y={13} occupied/>
          <W.DialysisMachine x={24} y={13}/>
          <W.DialysisChair x={20} y={20} occupied/>
          <W.DialysisMachine x={24} y={20}/>
          <W.DialysisChair x={20} y={27}/>
          <W.DialysisMachine x={24} y={27}/>
          <INpc x={19} y={24} kind="doctor" hair="#1F2937"/>

          {/* ════════════════ RO 수처리실 (water, y35-42) ════════════════ */}
          <BayLabel x={1} y={35} text="RO WATER · 수처리"/>
          <W.ROWaterUnit x={2} y={38}/>
          <W.SinkOR x={8} y={38}/>
          <INpc x={6} y={41} kind="doctor" hair="#5C3A1A"/>
          <IHotspot x={3} y={38} kind="info" label="역삼투 수질 점검"/>

          {/* ════════════════ 격리 투석 스테이션 (iso, y35-42) ════════════════ */}
          <BayLabel x={14} y={35} text="ISOLATION HD · B형간염"/>
          <W.DialysisChair x={15} y={37} occupied/>
          <W.DialysisMachine x={19} y={37}/>
          <WasteBin x={23} y={37} tone="infectious"/>
          <INpc x={17} y={41} kind="nurse" hair="#3C2A18" shirt="#FEF9C3"/>
          <IHotspot x={15} y={37} kind="info" label="전용 격리 투석"/>
          <IPlant x={25} y={41}/>
        </>
      )}
    />
  );
}

Object.assign(window, { ScreenInteriorDial });
