// interior-onco.jsx — 종양학 병동 · 조혈모세포 이식실 BMT (암센터 3F).
// Distinct structure: a large open CHEMO INFUSION BAY (rows of recliners) up
// front, then a positive-pressure BMT isolation wing behind an anteroom, plus
// a quiet counseling room. New objects: interior-objects-onco2.jsx.
//
//   ┌ 약물 조제 확인 ┬ 상담실 (Quiet) ┐   (서비스)
//   ├──── 중앙 간호 스테이션 ─────────┤   (입구)
//   ├──── 항암 주입 베이 (리클라이너) ─┤   (개방형 infusion)
//   ├ BMT 전실 ╎ BMT 무균 이식실 1·2 ─┤   (양압 격리)
//   └──────────┴────────────────────┘

function ScreenInteriorOnco() {
  const COLS = 28, ROWS = 50;
  const Th = window.IThreshold;
  const W = window;

  const regions = [
    { id: 'verify',  name: '약물 조제 확인',          icon: '💊', bounds: { x: 0,  y: 0,  w: 14, h: 11 } },
    { id: 'quiet',   name: '상담실 · Quiet Room',     icon: '🕊', bounds: { x: 13, y: 0,  w: 15, h: 11 } },
    { id: 'station', name: '중앙 간호 스테이션',       icon: '🖥', bounds: { x: 0,  y: 10, w: 28, h: 10 } },
    { id: 'infusion', name: '항암 주입 베이',          icon: '🧪', bounds: { x: 0,  y: 19, w: 28, h: 16 } },
    { id: 'ante',    name: 'BMT 전실 (Anteroom)',     icon: '🧼', bounds: { x: 0,  y: 34, w: 9,  h: 16 } },
    { id: 'bmt',     name: 'BMT 무균 이식실',          icon: '🎗', bounds: { x: 8,  y: 34, w: 20, h: 16 } },
  ];

  const rooms = [
    { id: 'verify',  name: '조제 확인',   sub: '항암 더블체크', icon: '💊', color: '#DDD6FE', x: 4,  y: 5, questCount: 1 },
    { id: 'quiet',   name: '상담실',      sub: '가족 상담',    icon: '🕊', color: '#E4ECE0', x: 20, y: 5 },
    { id: 'station', name: '간호 스테이션', sub: '주입 조율',   icon: '🖥', color: '#BAE6FD', x: 13, y: 15, questCount: 1 },
    { id: 'infusion', name: '항암 주입 베이', sub: 'Infusion', icon: '🧪', color: '#C7B8E8', x: 13, y: 26, questCount: 2 },
    { id: 'ante',    name: 'BMT 전실',    sub: '양압·방호구',  icon: '🧼', color: '#A7F3D0', x: 4,  y: 43 },
    { id: 'bmt',     name: 'BMT 이식실',  sub: '무균 격리',    icon: '🎗', color: '#FBCFE8', x: 18, y: 43, questCount: 1 },
  ];

  return (
    <InteriorScreen
      label="06k Interior · ONCO/BMT" deptCode="종양학 · BMT · 암센터 3F" deptColor="#1E8A5B"
      cols={COLS} rows={ROWS} floor="internal"
      playerStart={{ x: 4, y: 15 }}
      rooms={rooms}
      regions={regions}
      missionText="주입 베이 Chair 2 · 항암제 이중 확인 + 주입 모니터"
      render={() => (
        <>
          {/* ═══════════════ OUTER WALLS ═══════════════ */}
          <IWall x={0} y={0} w={28} h={1}/>
          <IWall x={0} y={1} w={1} h={13}/>
          <IDoor x={0} y={14} w={1} h={3} kind="auto" label="← 엘리베이터"/>
          <IWall x={0} y={17} w={1} h={32}/>
          <IWall x={27} y={1} w={1} h={48}/>
          <IWall x={0} y={49} w={28} h={1}/>

          {/* ═══ SERVICE STRIP DIVIDER (y10) ═══ */}
          <IWall x={1}  y={10} w={5} h={1}/>
          <Th    x={6}  y={10} w={2} h={1} label="→ 복도"/>
          <IWall x={8}  y={10} w={5} h={1}/>
          <Th    x={13} y={10} w={2} h={1} label="→ 복도"/>
          <IWall x={15} y={10} w={12} h={1}/>
          <IWall x={13} y={1} w={1} h={5}/>
          <Th    x={13} y={6} w={1} h={3}/>
          <IWall x={13} y={9} w={1} h={1}/>

          {/* ═══ STATION / INFUSION DIVIDER (y19) ═══ */}
          <IWall x={1}  y={19} w={7} h={1}/>
          <Th    x={8}  y={19} w={3} h={1}/>
          <IWall x={11} y={19} w={7} h={1}/>
          <Th    x={18} y={19} w={3} h={1}/>
          <IWall x={21} y={19} w={6} h={1}/>

          {/* ═══ INFUSION / BMT DIVIDER (y34) ═══ */}
          <IWall x={1}  y={34} w={7} h={1}/>
          <Th    x={8}  y={34} w={1} h={1} tone="sterile" label="→ 전실"/>
          <IWall x={9}  y={34} w={18} h={1}/>
          {/* anteroom | BMT glass wall + sterile air-lock */}
          <IWall  x={8}  y={35} w={1} h={2}/>
          <Th     x={8}  y={37} w={1} h={2} tone="sterile"/>
          <IGlass x={8}  y={39} w={1} h={10}/>
          {/* BMT room 1 | room 2 glass divider */}
          <IGlass x={18} y={36} w={1} h={13}/>

          {/* ════════════════ 약물 조제 확인 (y1-9) ════════════════ */}
          <BayLabel x={1} y={1} text="CHEMO VERIFY · 조제 확인" highlight/>
          <IReception x={2} y={3} w={4} h={1} label="더블체크"/>
          <IMonitor x={6} y={2}/>
          <W.ChemoHazardBin x={2} y={6}/>
          <ICabinet x={8} y={2} w={4} variant="drug" label="CHEMO"/>
          <W.Fridge x={10} y={6}/>
          <INpc x={4} y={7} kind="doctor" hair="#1F2937"/>
          <INpc x={7} y={7} kind="nurse" hair="#3C2A18" shirt="#C7B8E8"/>
          <IHotspot x={3} y={3} kind="quest" label="항암제 이중 확인"/>

          {/* ════════════════ 상담실 · Quiet Room (y1-9) ════════════════ */}
          <BayLabel x={14} y={1} text="QUIET ROOM · 상담"/>
          <window.Sofa x={15} y={3} w={3} color="#8FB59E"/>
          <window.CoffeeTable x={19} y={4} w={2}/>
          <window.Sofa x={22} y={3} w={3} color="#B7A6C8"/>
          <IPlant x={25} y={2}/>
          <window.FramedPicture x={16} y={1} w={2}/>
          <INpc x={18} y={7} kind="doctor" hair="#5C3A1A"/>
          <INpc x={21} y={7} kind="parent" hair="#3C2A18"/>
          <IHotspot x={19} y={5} kind="info" label="가족 면담"/>

          {/* ════════════════ 중앙 간호 스테이션 (y11-18) ════════════════ */}
          <BayLabel x={1} y={11} text="ONCOLOGY NURSING STATION" highlight/>
          <W.Handrail x={27} y={11} w={1} h={7} vertical/>
          <NurseStationDesk x={8} y={12} w={12} h={5}/>
          <DeskPhone x={9} y={12}/>
          <ChartBinder x={18} y={12}/>
          <W.CompCart x={4} y={12}/>
          <INpc x={11} y={15} kind="nurse" hair="#3C2A18" shirt="#A5D8E8"/>
          <IHotspot x={11} y={14} kind="info" label="주입 스케줄"/>
          <INpc x={15} y={15} kind="nurse" hair="#7C3F00" shirt="#C7B8E8"/>

          {/* ════════════════ 항암 주입 베이 (infusion, y20-33) ════════════════ */}
          <BayLabel x={1} y={20} text="CHEMO INFUSION BAY"/>
          {/* row of recliner chairs, each with a smart pump — open bay (no curtains between all) */}
          <W.InfusionChair x={2}  y={22} occupied/>
          <W.SmartInfusionPump x={5} y={22}/>
          <W.InfusionChair x={7}  y={22} occupied/>
          <W.SmartInfusionPump x={10} y={22}/>
          <W.InfusionChair x={13} y={22} occupied/>
          <W.SmartInfusionPump x={16} y={22}/>
          <IHotspot x={8} y={22} kind="quest" label="주입 속도·부작용 관찰"/>
          <W.InfusionChair x={2}  y={28} occupied/>
          <W.SmartInfusionPump x={5} y={28}/>
          <W.InfusionChair x={7}  y={28}/>
          <W.SmartInfusionPump x={10} y={28}/>
          {/* nurse tending + snack/comfort cart */}
          <INpc x={12} y={30} kind="nurse" hair="#3C2A18" shirt="#C7B8E8"/>
          <W.WarmerCabinet x={20} y={22}/>
          <window.WaterCooler x={24} y={22}/>
          <window.WallTV x={23} y={28} w={2}/>
          <IPlant x={25} y={32}/>
          <INpc x={20} y={30} kind="parent" hair="#9A6B3F"/>

          {/* ════════════════ BMT 전실 (ante, y35-50) ════════════════ */}
          <BayLabel x={1} y={35} text="BMT 전실 · ANTEROOM" highlight/>
          <W.PPEStation x={1} y={37}/>
          <W.SinkOR x={2} y={41}/>
          <window.HandSanitizer x={6} y={40}/>
          <W.ChemoHazardBin x={5} y={44}/>
          <INpc x={4} y={47} kind="nurse" hair="#3C2A18" shirt="#FEF9C3"/>
          <IHotspot x={2} y={41} kind="info" label="양압 손위생·방호"/>

          {/* ════════════════ BMT 무균 이식실 (bmt, y35-50) ════════════════ */}
          <BayLabel x={9} y={35} text="BMT ISOLATION"/>
          {/* positive-pressure HEPA header across both pods */}
          <W.BMTPod x={9} y={36} w={18}/>
          {/* Room 1 — transplant patient, HEPA-filtered */}
          <IBed x={10} y={40} variant="ward" occupied label="BMT 1"/>
          <IMonitor x={9} y={40} beep/>
          <W.SmartInfusionPump x={14} y={40}/>
          <INpc x={12} y={44} kind="nurse" hair="#3C2A18" shirt="#FEF9C3"/>
          <IHotspot x={10} y={40} kind="info" label="이식·생착 모니터"/>
          {/* Room 2 */}
          <IBed x={20} y={40} variant="ward" occupied label="BMT 2"/>
          <IMonitor x={26} y={40}/>
          <W.SmartInfusionPump x={24} y={40}/>
          <W.WallTV x={20} y={48} w={2}/>
          <INpc x={23} y={45} kind="parent" hair="#5C3A1A"/>
        </>
      )}
    />
  );
}

Object.assign(window, { ScreenInteriorOnco });
