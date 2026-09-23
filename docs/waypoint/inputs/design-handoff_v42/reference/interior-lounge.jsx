// interior-lounge.jsx — 직원 락커룸 · 의료진 휴게실 · 식당 (지원동 2F).
// Staff-only amenities: gendered locker rooms with benches, a lounge with sofas
// + TV + vending, and a cafeteria (servery line + dining tables). New objects:
// interior-objects-lounge2.jsx.

function ScreenInteriorLounge() {
  const COLS = 28, ROWS = 40;
  const Th = window.IThreshold;
  const W = window;

  const regions = [
    { id: 'lockerA', name: '락커룸 A · 탈의',          icon: '🚹', bounds: { x: 0,  y: 0,  w: 14, h: 16 } },
    { id: 'lockerB', name: '락커룸 B · 탈의',          icon: '🚺', bounds: { x: 13, y: 0,  w: 15, h: 16 } },
    { id: 'lounge',  name: '의료진 휴게실',            icon: '☕', bounds: { x: 0,  y: 15, w: 14, h: 25 } },
    { id: 'cafe',    name: '직원 식당 (배식·식사)',     icon: '🍽', bounds: { x: 13, y: 15, w: 15, h: 25 } },
  ];

  const rooms = [
    { id: 'lockerA', name: '락커룸 A', sub: '탈의·사물함',  icon: '🚹', color: '#BAE6FD', x: 6,  y: 8, questCount: 1 },
    { id: 'lockerB', name: '락커룸 B', sub: '탈의·사물함',  icon: '🚺', color: '#FBCFE8', x: 20, y: 8 },
    { id: 'lounge',  name: '휴게실',   sub: '소파·자판기',  icon: '☕', color: '#FDE68A', x: 6,  y: 28 },
    { id: 'cafe',    name: '직원 식당', sub: '배식·식사',    icon: '🍽', color: '#A7F3D0', x: 20, y: 28, questCount: 1 },
  ];

  return (
    <InteriorScreen
      label="06z Interior · LOUNGE" deptCode="락커·휴게실·식당 · 지원동 2F" deptColor="#8A6D3B"
      cols={COLS} rows={ROWS} floor="clinical"
      playerStart={{ x: 4, y: 14 }}
      rooms={rooms}
      regions={regions}
      missionText="교대 전 · 락커룸에서 근무복 환복 후 인계"
      render={() => (
        <>
          {/* ═══════════════ OUTER WALLS ═══════════════ */}
          <IWall x={0} y={0} w={28} h={1}/>
          <IWall x={0} y={1} w={1} h={11}/>
          <IDoor x={0} y={12} w={1} h={2} kind="auto" label="← 엘리베이터"/>
          <IWall x={0} y={14} w={1} h={25}/>
          <IWall x={27} y={1} w={1} h={38}/>
          <IWall x={0} y={39} w={28} h={1}/>

          {/* ═══ LOCKER / LOUNGE DIVIDER (y15) ═══ */}
          <IWall x={1}  y={15} w={5} h={1}/>
          <Th    x={6}  y={15} w={2} h={1} label="→ 휴게실"/>
          <IWall x={8}  y={15} w={5} h={1}/>
          <Th    x={13} y={15} w={2} h={1} label="→ 식당"/>
          <IWall x={15} y={15} w={12} h={1}/>
          {/* locker A | B divider */}
          <IWall x={13} y={1} w={1} h={14}/>
          {/* lounge | cafe divider */}
          <IWall x={13} y={16} w={1} h={23}/>

          {/* ════════════════ 락커룸 A (lockerA, y1-14) ════════════════ */}
          <BayLabel x={1} y={1} text="LOCKER ROOM A" highlight/>
          <W.LockerBank x={2} y={2} w={3}/>
          <W.LockerBank x={7} y={2} w={3}/>
          <W.LockerBank x={2} y={9} w={3}/>
          {/* bench in the middle */}
          <window.CoffeeTable x={7} y={9} w={2}/>
          <window.HandSanitizer x={11} y={2}/>
          <INpc x={5} y={6} kind="nurse" hair="#3C2A18" shirt="#A5D8E8"/>
          <IHotspot x={3} y={2} kind="quest" label="근무복 환복"/>
          <INpc x={9} y={11} kind="doctor" hair="#1F2937"/>

          {/* ════════════════ 락커룸 B (lockerB, y1-14) ════════════════ */}
          <BayLabel x={14} y={1} text="LOCKER ROOM B"/>
          <W.LockerBank x={15} y={2} w={3}/>
          <W.LockerBank x={19} y={2} w={3}/>
          <W.LockerBank x={23} y={2} w={3}/>
          <window.CoffeeTable x={18} y={9} w={2}/>
          <window.Sink x={24} y={9}/>
          <INpc x={17} y={6} kind="nurse" hair="#7C3F00" shirt="#FBCFE8"/>
          <INpc x={22} y={11} kind="nurse" hair="#9A6B3F" shirt="#FBCFE8"/>
          <IHotspot x={16} y={2} kind="info" label="탈의·정리"/>

          {/* ════════════════ 의료진 휴게실 (lounge, y16-40) ════════════════ */}
          <BayLabel x={1} y={16} text="STAFF LOUNGE · 휴게실"/>
          <window.WallTV x={3} y={16} w={2}/>
          <window.Sofa x={2} y={20} w={3} color="#C0A6B8"/>
          <window.Sofa x={2} y={25} w={3} color="#8FA9C4"/>
          <window.CoffeeTable x={6} y={22} w={2}/>
          <W.Vending x={10} y={17}/>
          <window.CoffeeMachine x={11} y={22}/>
          <window.WaterCooler x={11} y={26}/>
          {/* rest bunks / recliners for on-call */}
          <window.NursingRecliner x={2} y={31}/>
          <window.NursingRecliner x={7} y={31}/>
          <INpc x={4} y={23} kind="nurse" hair="#3C2A18" shirt="#FDE68A"/>
          <INpc x={9} y={34} kind="doctor" hair="#5C3A1A"/>
          <IHotspot x={4} y={20} kind="info" label="교대 휴식"/>
          <IPlant x={11} y={36}/>

          {/* ════════════════ 직원 식당 (cafe, y16-40) ════════════════ */}
          <BayLabel x={14} y={16} text="STAFF CAFETERIA · 식당"/>
          {/* servery line along the top */}
          <W.ServeryCounter x={15} y={18} w={4}/>
          <window.CoffeeMachine x={24} y={17}/>
          <W.DiningTable x={15} y={23}/>
          <W.DiningTable x={21} y={23}/>
          <W.DiningTable x={15} y={30}/>
          <W.DiningTable x={21} y={30}/>
          {[15,17,21,23].map((cx,i)=><IChair key={i} x={cx} y={26} color="#A7F3D0" facing="up"/>)}
          {[15,17,21,23].map((cx,i)=><IChair key={'b'+i} x={cx} y={33} color="#A7F3D0" facing="up"/>)}
          <INpc x={17} y={20} kind="nurse" hair="#3C2A18" shirt="#A7F3D0"/>
          <IHotspot x={16} y={18} kind="quest" label="배식·식사"/>
          <INpc x={22} y={27} kind="doctor" hair="#1F2937"/>
          <INpc x={16} y={34} kind="nurse" hair="#7C3F00" shirt="#A5D8E8"/>
          <IPlant x={25} y={36}/>
        </>
      )}
    />
  );
}

Object.assign(window, { ScreenInteriorLounge });
