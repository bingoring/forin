// interior-infusion.jsx — 외래 주사센터 Outpatient Infusion Center (외래진단동 3F).
// Ambulatory day-treatment: reception + pharmacy pass-through, an open infusion
// bay of recliners (chemo/biologics/iron/hydration), private bay for reactions,
// and a nourishment/comfort corner. Reuses onco + ER objects.

function ScreenInteriorInfusion() {
  const COLS = 28, ROWS = 40;
  const Th = window.IThreshold;
  const W = window;

  const regions = [
    { id: 'check',   name: '접수 · 조제 전달',          icon: '📋', bounds: { x: 0,  y: 0,  w: 28, h: 9 } },
    { id: 'bay',     name: '오픈 주입 베이',           icon: '💉', bounds: { x: 0,  y: 8,  w: 20, h: 21 } },
    { id: 'private', name: '격리 주입실 (반응 관찰)',   icon: '🚨', bounds: { x: 19, y: 8,  w: 9,  h: 21 } },
    { id: 'nourish', name: '간이 휴게 · 다과',         icon: '🍵', bounds: { x: 0,  y: 28, w: 14, h: 12 } },
    { id: 'station', name: '주입 간호 스테이션',        icon: '🖥', bounds: { x: 13, y: 28, w: 15, h: 12 } },
  ];

  const rooms = [
    { id: 'check',   name: '접수·조제전달', sub: '예약·약품 확인', icon: '📋', color: '#BAE6FD', x: 6,  y: 4, questCount: 1 },
    { id: 'bay',     name: '주입 베이',    sub: '리클라이너',   icon: '💉', color: '#A7F3D0', x: 8,  y: 17, questCount: 1 },
    { id: 'private', name: '격리 주입실',  sub: '과민반응 관찰', icon: '🚨', color: '#FCA5A5', x: 23, y: 17, questCount: 1 },
    { id: 'nourish', name: '휴게·다과',    sub: '수분·간식',    icon: '🍵', color: '#FDE68A', x: 6,  y: 34 },
    { id: 'station', name: '간호 스테이션', sub: '주입 관리',   icon: '🖥', color: '#DDD6FE', x: 20, y: 34 },
  ];

  return (
    <InteriorScreen
      label="06f Interior · INFUSION" deptCode="외래 주사센터 · 외래진단동 3F" deptColor="#0EA5A0"
      cols={COLS} rows={ROWS} floor="clinical"
      playerStart={{ x: 4, y: 7 }}
      rooms={rooms}
      regions={regions}
      missionText="주입 베이 · 항암 주입 속도 확인 + 과민반응 모니터링"
      render={() => (
        <>
          {/* ═══════════════ OUTER WALLS ═══════════════ */}
          <IWall x={0} y={0} w={28} h={1}/>
          <IWall x={0} y={1} w={1} h={4}/>
          <IDoor x={0} y={5} w={1} h={2} kind="auto" label="← 엘리베이터"/>
          <IWall x={0} y={7} w={1} h={32}/>
          <IWall x={27} y={1} w={1} h={38}/>
          <IWall x={0} y={39} w={28} h={1}/>

          {/* ═══ CHECK / BAY DIVIDER (y8) ═══ */}
          <IWall x={1}  y={8} w={5} h={1}/>
          <Th    x={6}  y={8} w={2} h={1} label="→ 주입 베이"/>
          <IWall x={8}  y={8} w={11} h={1}/>
          <Th    x={19} y={8} w={2} h={1} tone="sterile" label="→ 격리실"/>
          <IWall x={21} y={8} w={6} h={1}/>
          {/* bay | private divider */}
          <IWall x={19} y={9} w={1} h={20}/>

          {/* ═══ BAY / LOWER DIVIDER (y28) ═══ */}
          <IWall x={1}  y={28} w={5} h={1}/>
          <Th    x={6}  y={28} w={2} h={1} label="→ 휴게"/>
          <IWall x={8}  y={28} w={5} h={1}/>
          <IWall x={13} y={28} w={1} h={11}/>

          {/* ════════════════ 접수 · 조제 전달 (check, y1-7) ════════════════ */}
          <BayLabel x={1} y={1} text="RECEPTION · 조제 전달"/>
          <IReception x={2} y={3} w={5} h={1} label="접수"/>
          <window.PneumaticTube x={9} y={2}/>
          <ICabinet x={13} y={2} w={3} variant="drug" label="당일 약품"/>
          <window.MedFridge x={17} y={2}/>
          <window.HandSanitizer x={21} y={2}/>
          <INpc x={4} y={5} kind="nurse" hair="#3C2A18" shirt="#A5D8E8"/>
          <IHotspot x={3} y={3} kind="quest" label="예약·약품 대조"/>
          <INpc x={12} y={5} kind="patient" hair="#9A6B3F"/>
          <IPlant x={25} y={5}/>

          {/* ════════════════ 오픈 주입 베이 (bay, y9-27) ════════════════ */}
          <BayLabel x={1} y={9} text="INFUSION BAY · 오픈 주입"/>
          {/* recliners each with a smart pump, spaced for wheelchair access */}
          <W.InfusionChair x={2}  y={11} occupied/>
          <W.SmartInfusionPump x={5} y={11}/>
          <W.InfusionChair x={7}  y={11} occupied/>
          <W.SmartInfusionPump x={10} y={11}/>
          <W.InfusionChair x={12} y={11} occupied/>
          <W.SmartInfusionPump x={15} y={11}/>
          <W.InfusionChair x={2}  y={17} occupied/>
          <W.SmartInfusionPump x={5} y={17}/>
          <W.InfusionChair x={7}  y={17}/>
          <W.SmartInfusionPump x={10} y={17}/>
          <W.InfusionChair x={12} y={17} occupied/>
          <W.SmartInfusionPump x={15} y={17}/>
          <W.InfusionChair x={2}  y={23} occupied/>
          <W.SmartInfusionPump x={5} y={23}/>
          <W.InfusionChair x={7}  y={23} occupied/>
          <W.SmartInfusionPump x={10} y={23}/>
          <INpc x={9} y={14} kind="nurse" hair="#3C2A18" shirt="#A7F3D0"/>
          <IHotspot x={7} y={11} kind="quest" label="주입 속도·부작용"/>
          <INpc x={13} y={20} kind="patient" hair="#7C3F00"/>

          {/* ════════════════ 격리 주입실 (private, y9-27) ════════════════ */}
          <BayLabel x={20} y={9} text="ISOLATION · 반응 관찰"/>
          <W.InfusionChair x={20} y={12} occupied/>
          <W.SmartInfusionPump x={23} y={12}/>
          <IMonitor x={25} y={12} beep/>
          <window.CrashCart x={24} y={17}/>
          <window.PPEStation x={20} y={20}/>
          <INpc x={22} y={16} kind="nurse" hair="#5C3A1A" shirt="#FCA5A5"/>
          <IHotspot x={20} y={12} kind="urgent" label="아나필락시스 관찰"/>

          {/* ════════════════ 간이 휴게 · 다과 (nourish, y29-38) ════════════════ */}
          <BayLabel x={1} y={29} text="NOURISHMENT · 다과"/>
          <window.WaterCooler x={2} y={31}/>
          <window.CoffeeMachine x={4} y={31}/>
          <window.CoffeeTable x={6} y={33} w={2}/>
          <IChair x={9} y={32} color="#FDE68A" facing="left"/>
          <IChair x={9} y={35} color="#FDE68A" facing="left"/>
          <INpc x={7} y={35} kind="visitor" hair="#3C2A18"/>
          <IHotspot x={4} y={31} kind="info" label="수분·간식 보충"/>

          {/* ════════════════ 주입 간호 스테이션 (station, y29-38) ════════════════ */}
          <BayLabel x={14} y={29} text="INFUSION STATION"/>
          <NurseStationDesk x={15} y={31} w={9} h={5}/>
          <DeskPhone x={16} y={31}/>
          <W.CompCart x={22} y={31}/>
          <INpc x={18} y={35} kind="nurse" hair="#3C2A18" shirt="#DDD6FE"/>
          <INpc x={21} y={35} kind="doctor" hair="#1F2937"/>
          <IHotspot x={18} y={34} kind="info" label="주입 일정·차팅"/>
          <IPlant x={25} y={37}/>
        </>
      )}
    />
  );
}

Object.assign(window, { ScreenInteriorInfusion });
