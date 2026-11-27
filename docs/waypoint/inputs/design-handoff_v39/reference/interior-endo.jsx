// interior-endo.jsx — 내시경실 Endoscopy Suite (외래·진단동 4F).
// Structure: prep/recovery bays → central scope-reprocessing core → two
// procedure rooms (GI scope towers). New objects: interior-objects-endo2.jsx.

function ScreenInteriorEndo() {
  const COLS = 28, ROWS = 44;
  const Th = window.IThreshold;
  const W = window;

  const regions = [
    { id: 'checkin', name: '접수 · 대기',          icon: '🪑', bounds: { x: 0,  y: 0,  w: 28, h: 10 } },
    { id: 'prep',    name: '전처치 · 회복 베이',    icon: '🛏', bounds: { x: 0,  y: 9,  w: 14, h: 18 } },
    { id: 'reproc',  name: '세척 · 재처리실',       icon: '🧼', bounds: { x: 13, y: 9,  w: 15, h: 18 } },
    { id: 'proc1',   name: '내시경 시술실 1',        icon: '🔬', bounds: { x: 0,  y: 26, w: 14, h: 18 } },
    { id: 'proc2',   name: '내시경 시술실 2',        icon: '🔬', bounds: { x: 13, y: 26, w: 15, h: 18 } },
  ];

  const rooms = [
    { id: 'checkin', name: '접수·대기',  sub: '금식 확인',    icon: '🪑', color: '#BAE6FD', x: 5,  y: 5, questCount: 1 },
    { id: 'prep',    name: '전처치·회복', sub: '진정·모니터',  icon: '🛏', color: '#FBCFE8', x: 6,  y: 17, questCount: 1 },
    { id: 'reproc',  name: '세척·재처리', sub: 'AER·소독',    icon: '🧼', color: '#A7F3D0', x: 21, y: 17 },
    { id: 'proc1',   name: '시술실 1',   sub: '상부 위내시경', icon: '🔬', color: '#DDD6FE', x: 6,  y: 36, questCount: 1 },
    { id: 'proc2',   name: '시술실 2',   sub: '대장내시경',   icon: '🔬', color: '#C7D2FE', x: 21, y: 36 },
  ];

  return (
    <InteriorScreen
      label="06n Interior · ENDOSCOPY" deptCode="내시경실 · 외래진단동 4F" deptColor="#0E7490"
      cols={COLS} rows={ROWS} floor="clinical"
      playerStart={{ x: 4, y: 8 }}
      rooms={rooms}
      regions={regions}
      missionText="시술실 1 · 상부 위내시경 진정 모니터 + 스코프 준비"
      render={() => (
        <>
          {/* ═══════════════ OUTER WALLS ═══════════════ */}
          <IWall x={0} y={0} w={28} h={1}/>
          <IWall x={0} y={1} w={1} h={6}/>
          <IDoor x={0} y={7} w={1} h={3} kind="auto" label="← 엘리베이터"/>
          <IWall x={0} y={10} w={1} h={33}/>
          <IWall x={27} y={1} w={1} h={42}/>
          <IWall x={0} y={43} w={28} h={1}/>

          {/* ═══ CHECK-IN / MID DIVIDER (y9) ═══ */}
          <IWall x={1}  y={9} w={4} h={1}/>
          <Th    x={5}  y={9} w={2} h={1} label="→ 전처치"/>
          <IWall x={7}  y={9} w={6} h={1}/>
          <Th    x={13} y={9} w={2} h={1} tone="sterile" label="→ 재처리"/>
          <IWall x={15} y={9} w={12} h={1}/>
          {/* prep | reproc divider */}
          <IWall x={13} y={10} w={1} h={16}/>

          {/* ═══ MID / PROC DIVIDER (y26) ═══ */}
          <IWall x={1}  y={26} w={5} h={1}/>
          <Th    x={6}  y={26} w={2} h={1} label="→ 시술1"/>
          <IWall x={8}  y={26} w={6} h={1}/>
          <Th    x={14} y={26} w={2} h={1} label="→ 시술2"/>
          <IWall x={16} y={26} w={11} h={1}/>
          {/* proc1 | proc2 divider */}
          <IWall x={13} y={27} w={1} h={16}/>

          {/* ════════════════ 접수 · 대기 (y1-8) ════════════════ */}
          <BayLabel x={1} y={1} text="ENDO CHECK-IN · 금식 확인"/>
          <IReception x={2} y={3} w={4} h={1} label="접수"/>
          <IMonitor x={6} y={2}/>
          {[15,17,19,21,23].map((cx,i)=><IChair key={i} x={cx} y={6} color="#BAE6FD" facing="up"/>)}
          <INpc x={3} y={4} kind="nurse" hair="#3C2A18" shirt="#A5D8E8"/>
          <INpc x={16} y={7} kind="patient" hair="#9A6B3F"/>
          <IHotspot x={3} y={3} kind="quest" label="금식(NPO) 확인"/>
          <IPlant x={25} y={2}/>

          {/* ════════════════ 전처치 · 회복 베이 (y10-25) ════════════════ */}
          <BayLabel x={1} y={10} text="PREP · RECOVERY" highlight/>
          <IBed x={2} y={12} variant="ward" occupied label="전처치"/>
          <IMonitor x={1} y={12} beep/>
          <IIV x={6} y={12}/>
          <W.OxygenTank x={7} y={12}/>
          <ICurtain x={1} y={17} w={11} h={1} color="#F5C6D8"/>
          <IBed x={2} y={19} variant="ward" occupied label="회복"/>
          <IMonitor x={1} y={19}/>
          <W.SuctionUnit x={6} y={20}/>
          <INpc x={5} y={15} kind="nurse" hair="#3C2A18" shirt="#FBCFE8"/>
          <IHotspot x={3} y={12} kind="info" label="진정 회복 관찰"/>

          {/* ════════════════ 세척 · 재처리실 (y10-25) ════════════════ */}
          <BayLabel x={14} y={10} text="REPROCESSING · 소독"/>
          <W.ScopeWasher x={14} y={13}/>
          <W.ScopeCabinet x={22} y={12}/>
          <W.SinkOR x={14} y={19}/>
          <WasteBin x={19} y={20} tone="infectious"/>
          <INpc x={17} y={22} kind="nurse" hair="#7C3F00" shirt="#A7F3D0"/>
          <IHotspot x={15} y={13} kind="info" label="내시경 재처리(AER)"/>

          {/* ════════════════ 내시경 시술실 1 (proc1, y27-44) ════════════════ */}
          <BayLabel x={1} y={27} text="ENDO SUITE 1 · 상부"/>
          <W.ProcedureBed x={2} y={31}/>
          <W.EndoTower x={2} y={37}/>
          <IMonitor x={9} y={30} beep/>
          <W.SuctionUnit x={11} y={31}/>
          {/* endoscopist + assisting nurse + sedation nurse */}
          <INpc x={6} y={35} kind="doctor" hair="#1F2937"/>
          <INpc x={9} y={35} kind="nurse" hair="#3C2A18" shirt="#DDD6FE"/>
          <INpc x={3} y={34} kind="nurse" hair="#7C3F00" shirt="#A5D8E8"/>
          <IHotspot x={3} y={31} kind="quest" label="진정 모니터·스코프"/>

          {/* ════════════════ 내시경 시술실 2 (proc2, y27-44) ════════════════ */}
          <BayLabel x={14} y={27} text="ENDO SUITE 2 · 대장"/>
          <W.ProcedureBed x={15} y={31}/>
          <W.EndoTower x={23} y={37}/>
          <IMonitor x={14} y={30} beep/>
          <W.SuctionUnit x={22} y={31}/>
          <INpc x={19} y={35} kind="doctor" hair="#5C3A1A"/>
          <INpc x={16} y={35} kind="nurse" hair="#3C2A18" shirt="#C7D2FE"/>
          <IHotspot x={16} y={31} kind="info" label="대장내시경 진행"/>
          <IPlant x={25} y={41}/>
        </>
      )}
    />
  );
}

Object.assign(window, { ScreenInteriorEndo });
