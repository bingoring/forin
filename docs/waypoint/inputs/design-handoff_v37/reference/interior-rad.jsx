// interior-rad.jsx — 영상의학과 Radiology (외래·진단 지원동 1F).
// Distinct structure: a long central corridor with separate imaging suites off
// it (CT / MRI / X-ray), each paired with a shielded control booth, plus a dark
// PACS reading room and a check-in. New objects: interior-objects-rad2.jsx.
//
//   ┌ 접수·대기 ┬ 판독실 (Reading Room) ┐
//   ├──────── 중앙 복도 · 안내 ─────────┤   (입구)
//   ├ CT 촬영실 ╎제어 ┬ MRI 촬영실 ╎제어 ┤
//   ├──────── X-ray 촬영실 ╎ 제어 ──────┤
//   └──────────────────────────────────┘

function ScreenInteriorRad() {
  const COLS = 28, ROWS = 48;
  const Th = window.IThreshold;
  const W = window;

  const regions = [
    { id: 'checkin', name: '접수 · 대기',            icon: '🪑', bounds: { x: 0,  y: 0,  w: 14, h: 11 } },
    { id: 'reading', name: '판독실 · Reading Room',   icon: '🖥', bounds: { x: 13, y: 0,  w: 15, h: 11 } },
    { id: 'hall',    name: '중앙 복도 · 안내',        icon: '🧭', bounds: { x: 0,  y: 10, w: 28, h: 8 } },
    { id: 'ct',      name: 'CT 촬영실',              icon: '🍩', bounds: { x: 0,  y: 17, w: 14, h: 12 } },
    { id: 'mri',     name: 'MRI 촬영실',             icon: '🧲', bounds: { x: 13, y: 17, w: 15, h: 12 } },
    { id: 'xray',    name: 'X-ray 촬영실',           icon: '🦴', bounds: { x: 0,  y: 28, w: 28, h: 20 } },
  ];

  const rooms = [
    { id: 'checkin', name: '접수·대기',  sub: '영상 접수',    icon: '🪑', color: '#BAE6FD', x: 4,  y: 5 },
    { id: 'reading', name: '판독실',     sub: 'PACS 판독',    icon: '🖥', color: '#C4CBD2', x: 20, y: 5, questCount: 1 },
    { id: 'ct',      name: 'CT 촬영실',  sub: '조영 CT',      icon: '🍩', color: '#DDD6FE', x: 6,  y: 23, questCount: 1 },
    { id: 'mri',     name: 'MRI 촬영실', sub: '3T MRI',       icon: '🧲', color: '#C7D2FE', x: 20, y: 23 },
    { id: 'xray',    name: 'X-ray 촬영실', sub: '일반 촬영',   icon: '🦴', color: '#A7F3D0', x: 13, y: 40, questCount: 1 },
  ];

  return (
    <InteriorScreen
      label="06l Interior · RADIOLOGY" deptCode="영상의학과 · 외래진단동 1F" deptColor="#0E7490"
      cols={COLS} rows={ROWS} floor="clinical"
      playerStart={{ x: 4, y: 14 }}
      rooms={rooms}
      regions={regions}
      missionText="CT 촬영실 · 조영제 주입 확인 + 촬영 포지셔닝"
      render={() => (
        <>
          {/* ═══════════════ OUTER WALLS ═══════════════ */}
          <IWall x={0} y={0} w={28} h={1}/>
          <IWall x={0} y={1} w={1} h={12}/>
          <IDoor x={0} y={13} w={1} h={3} kind="auto" label="← 엘리베이터"/>
          <IWall x={0} y={16} w={1} h={31}/>
          <IWall x={27} y={1} w={1} h={46}/>
          <IWall x={0} y={47} w={28} h={1}/>

          {/* ═══ CHECK-IN / HALL DIVIDER (y10) ═══ */}
          <IWall x={1}  y={10} w={5} h={1}/>
          <Th    x={6}  y={10} w={2} h={1} label="→ 복도"/>
          <IWall x={8}  y={10} w={5} h={1}/>
          <Th    x={13} y={10} w={2} h={1} label="→ 판독"/>
          <IWall x={15} y={10} w={12} h={1}/>
          <IWall x={13} y={1} w={1} h={5}/>
          <Th    x={13} y={6} w={1} h={3}/>
          <IWall x={13} y={9} w={1} h={1}/>

          {/* ═══ HALL / SCAN DIVIDER (y17) ═══ */}
          <IWall x={1}  y={17} w={5} h={1}/>
          <Th    x={6}  y={17} w={2} h={1} label="→ CT"/>
          <IWall x={8}  y={17} w={6} h={1}/>
          <Th    x={14} y={17} w={2} h={1} label="→ MRI"/>
          <IWall x={16} y={17} w={11} h={1}/>
          {/* CT | MRI divider */}
          <IWall x={13} y={18} w={1} h={11}/>

          {/* ═══ SCAN / XRAY DIVIDER (y28) ═══ */}
          <IWall x={1}  y={28} w={10} h={1}/>
          <Th    x={11} y={28} w={2} h={1} label="→ X-ray"/>
          <IWall x={13} y={28} w={14} h={1}/>

          {/* ════════════════ 접수 · 대기 (y1-9) ════════════════ */}
          <BayLabel x={1} y={1} text="영상 접수 · CHECK-IN"/>
          <IReception x={2} y={3} w={4} h={1} label="접수"/>
          <IMonitor x={6} y={2}/>
          {[2,4,6,8,10].map((cx,i) => <IChair key={i} x={cx} y={7} color="#BAE6FD" facing="up"/>)}
          <INpc x={3} y={4} kind="nurse" hair="#3C2A18" shirt="#A5D8E8"/>
          <INpc x={5} y={8} kind="patient" hair="#9A6B3F"/>
          <IPlant x={11} y={8}/>
          <IHotspot x={3} y={3} kind="info" label="검사 접수"/>

          {/* ════════════════ 판독실 · Reading Room (y1-9) ════════════════ */}
          <BayLabel x={14} y={1} text="READING ROOM · 판독" highlight/>
          {/* dark room dim tint */}
          <W.Tint x={14} y={1} w={13} h={9} color="#1E2A40" op={0.18}/>
          <W.PACSViewer x={15} y={3}/>
          <W.PACSViewer x={20} y={3}/>
          <IReception x={23} y={5} w={3} h={1} label="판독 데스크"/>
          <INpc x={16} y={7} kind="doctor" hair="#1F2937"/>
          <INpc x={21} y={7} kind="doctor" hair="#5C3A1A"/>
          <IHotspot x={16} y={4} kind="quest" label="영상 판독 (Read)"/>

          {/* ════════════════ 중앙 복도 · 안내 (y11-16) ════════════════ */}
          <BayLabel x={1} y={11} text="RADIOLOGY CORRIDOR" highlight/>
          <W.Handrail x={27} y={11} w={1} h={5} vertical/>
          <W.LeadApronRack x={3} y={12}/>
          <W.VitalsCart x={22} y={13}/>
          <INpc x={9} y={14} kind="nurse" hair="#3C2A18" shirt="#A5D8E8"/>
          <IHotspot x={9} y={13} kind="info" label="검사 안내"/>
          <INpc x={13} y={14} kind="patient" hair="#7C3F00"/>
          <W.WaitingDisplay x={16} y={11}/>

          {/* ════════════════ CT 촬영실 (y18-27) ════════════════ */}
          <BayLabel x={1} y={18} text="CT SCAN"/>
          <W.CTScanner x={2} y={21}/>
          {/* shielded control booth (glass) in the corner */}
          <IGlass x={11} y={19} w={1} h={8}/>
          <W.ControlConsole x={8} y={24}/>
          <INpc x={9} y={26} kind="doctor" hair="#1F2937"/>
          <IHotspot x={3} y={22} kind="quest" label="조영제·포지셔닝"/>

          {/* ════════════════ MRI 촬영실 (y18-27) ════════════════ */}
          <BayLabel x={14} y={18} text="MRI SCAN"/>
          <W.MRIScanner x={14} y={21}/>
          <W.ControlConsole x={22} y={24}/>
          <INpc x={22} y={26} kind="nurse" hair="#7C3F00" shirt="#A5D8E8"/>
          <IHotspot x={15} y={22} kind="info" label="금속 반입 금지"/>

          {/* ════════════════ X-ray 촬영실 (y29-50) ════════════════ */}
          <BayLabel x={1} y={29} text="GENERAL X-RAY"/>
          <W.XrayUnit x={4} y={33}/>
          {/* control booth behind lead glass */}
          <IGlass x={12} y={30} w={1} h={9}/>
          <W.ControlConsole x={14} y={33}/>
          <W.LeadApronRack x={20} y={31}/>
          <IBed x={3} y={40} variant="ward" label="촬영 대기"/>
          <INpc x={8} y={37} kind="doctor" hair="#1F2937"/>
          <INpc x={16} y={36} kind="nurse" hair="#3C2A18" shirt="#A5D8E8"/>
          <IHotspot x={5} y={34} kind="quest" label="흉부 촬영 포지셔닝"/>
          <INpc x={20} y={44} kind="patient" hair="#9A6B3F"/>
          <IPlant x={25} y={45}/>
        </>
      )}
    />
  );
}

Object.assign(window, { ScreenInteriorRad });
