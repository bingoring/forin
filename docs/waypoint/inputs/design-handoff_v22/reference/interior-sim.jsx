// interior-sim.jsx — 간호부 총괄 사무실 · 감염관리실 · 교육 시뮬레이션 랩 (지원동 3F).
// Admin + education back-of-house: an open nursing-admin office, an infection-
// control office with a PPE don/doff practice bay, and a simulation lab (sim
// manikin room + one-way-mirror control booth + debrief). New objects: interior-
// objects-sim2.jsx.

function ScreenInteriorSim() {
  const COLS = 28, ROWS = 42;
  const Th = window.IThreshold;
  const W = window;

  const regions = [
    { id: 'admin',   name: '간호부 총괄 사무실',        icon: '🗂', bounds: { x: 0,  y: 0,  w: 28, h: 12 } },
    { id: 'infection', name: '감염관리실',              icon: '🦠', bounds: { x: 0,  y: 11, w: 14, h: 14 } },
    { id: 'debrief', name: '디브리핑 · 강의실',          icon: '📽', bounds: { x: 13, y: 11, w: 15, h: 14 } },
    { id: 'simlab',  name: '시뮬레이션 랩',             icon: '🩺', bounds: { x: 0,  y: 24, w: 19, h: 18 } },
    { id: 'booth',   name: '제어실 (Control)',          icon: '🎛', bounds: { x: 18, y: 24, w: 10, h: 18 } },
  ];

  const rooms = [
    { id: 'admin',   name: '간호부 사무실', sub: '행정·배치',  icon: '🗂', color: '#BAE6FD', x: 6,  y: 6 },
    { id: 'infection', name: '감염관리실', sub: 'PPE 착탈의',  icon: '🦠', color: '#A7F3D0', x: 6,  y: 17, questCount: 1 },
    { id: 'debrief', name: '디브리핑실',  sub: '강의·복기',    icon: '📽', color: '#DDD6FE', x: 20, y: 17 },
    { id: 'simlab',  name: '시뮬 랩',    sub: '마네킹 실습',   icon: '🩺', color: '#FBCFE8', x: 8,  y: 34, questCount: 1 },
    { id: 'booth',   name: '제어실',     sub: '시나리오 조작', icon: '🎛', color: '#C4CBD2', x: 23, y: 34 },
  ];

  return (
    <InteriorScreen
      label="06y Interior · SIM/ADMIN" deptCode="간호부·감염관리·시뮬랩 · 지원동 3F" deptColor="#0E7C8C"
      cols={COLS} rows={ROWS} floor="clinical"
      playerStart={{ x: 4, y: 8 }}
      rooms={rooms}
      regions={regions}
      missionText="시뮬레이션 랩 · 마네킹 응급 시나리오 실습 + 디브리핑"
      render={() => (
        <>
          {/* ═══════════════ OUTER WALLS ═══════════════ */}
          <IWall x={0} y={0} w={28} h={1}/>
          <IWall x={0} y={1} w={1} h={6}/>
          <IDoor x={0} y={7} w={1} h={3} kind="auto" label="← 엘리베이터"/>
          <IWall x={0} y={10} w={1} h={31}/>
          <IWall x={27} y={1} w={1} h={40}/>
          <IWall x={0} y={41} w={28} h={1}/>

          {/* ═══ ADMIN / MID DIVIDER (y11) ═══ */}
          <IWall x={1}  y={11} w={4} h={1}/>
          <Th    x={5}  y={11} w={2} h={1} label="→ 감염관리"/>
          <IWall x={7}  y={11} w={6} h={1}/>
          <Th    x={13} y={11} w={2} h={1} label="→ 강의실"/>
          <IWall x={15} y={11} w={12} h={1}/>
          <IWall x={13} y={12} w={1} h={13}/>

          {/* ═══ MID / SIM DIVIDER (y24) ═══ */}
          <IWall x={1}  y={24} w={6} h={1}/>
          <Th    x={7}  y={24} w={2} h={1} label="→ 시뮬랩"/>
          <IWall x={9}  y={24} w={18} h={1}/>
          {/* sim | control booth: one-way mirror wall */}
          <IWall x={18} y={25} w={1} h={17}/>

          {/* ════════════════ 간호부 총괄 사무실 (admin, y1-10) ════════════════ */}
          <BayLabel x={1} y={1} text="NURSING ADMIN OFFICE · 간호부"/>
          <W.OfficeDesk x={2} y={3}/>
          <W.OfficeDesk x={7} y={3}/>
          <W.OfficeDesk x={12} y={3}/>
          <ICabinet x={18} y={2} w={4} h={1} kind="pharma"/>
          <ICabinet x={22} y={2} w={4} h={1} kind="pharma"/>
          <window.ShelfLabel x={18} y={2} text="인사·근무표"/>
          <window.WaterCooler x={25} y={6}/>
          <INpc x={3} y={7} kind="doctor" hair="#3C2A18"/>
          <INpc x={8} y={7} kind="nurse" hair="#7C3F00" shirt="#A5D8E8"/>
          <INpc x={13} y={7} kind="nurse" hair="#5C3A1A" shirt="#A5D8E8"/>
          <IHotspot x={3} y={3} kind="info" label="근무 배치·행정"/>
          <IPlant x={25} y={9}/>

          {/* ════════════════ 감염관리실 (infection, y12-23) ════════════════ */}
          <BayLabel x={1} y={12} text="INFECTION CONTROL · 감염관리" highlight/>
          <W.PPEBoard x={2} y={13} w={3}/>
          {/* PPE don/doff practice bay */}
          <window.GownBox x={2} y={16}/>
          <window.ScrubDispenser x={5} y={16}/>
          <window.WasteBin x={8} y={16} tone="infectious"/>
          <W.OfficeDesk x={2} y={19}/>
          <INpc x={6} y={21} kind="nurse" hair="#3C2A18" shirt="#A7F3D0"/>
          <IHotspot x={3} y={16} kind="quest" label="PPE 착탈의 감사"/>

          {/* ════════════════ 디브리핑 · 강의실 (debrief, y12-23) ════════════════ */}
          <BayLabel x={14} y={12} text="DEBRIEF · 강의실"/>
          <window.WallTV x={22} y={12} w={2}/>
          {/* seminar table + chairs */}
          <window.CoffeeTable x={17} y={16} w={3}/>
          {[16,18,20].map((cx,i)=><IChair key={i} x={cx} y={14} color="#DDD6FE" facing="down"/>)}
          {[16,18,20].map((cx,i)=><IChair key={'b'+i} x={cx} y={20} color="#DDD6FE" facing="up"/>)}
          <INpc x={22} y={16} kind="doctor" hair="#1F2937"/>
          <INpc x={17} y={19} kind="nurse" hair="#9A6B3F" shirt="#DDD6FE"/>
          <IHotspot x={18} y={16} kind="info" label="사례 디브리핑"/>

          {/* ════════════════ 시뮬레이션 랩 (simlab, y25-42) ════════════════ */}
          <BayLabel x={1} y={25} text="SIMULATION LAB · 시뮬 실습"/>
          {/* realistic mock resus room: sim bed + real monitor + crash cart */}
          <W.SimManikin x={2} y={28} />
          <IMonitor x={1} y={28} beep/>
          <window.CrashCart x={7} y={28}/>
          <window.IVPump x={6} y={32}/>
          <window.Ventilator x={9} y={30}/>
          <INpc x={4} y={36} kind="nurse" hair="#3C2A18" shirt="#FBCFE8"/>
          <INpc x={7} y={37} kind="nurse" hair="#5C3A1A" shirt="#FBCFE8"/>
          <INpc x={11} y={34} kind="doctor" hair="#1F2937"/>
          <IHotspot x={3} y={28} kind="quest" label="응급 시나리오 실습"/>
          <IPlant x={16} y={38}/>

          {/* ════════════════ 제어실 (booth, y25-42) ════════════════ */}
          <BayLabel x={19} y={25} text="CONTROL BOOTH"/>
          {/* one-way mirror looking into the sim lab */}
          <W.ControlBooth x={19} y={27} w={1}/>
          <W.OfficeDesk x={20} y={33}/>
          <INpc x={22} y={37} kind="doctor" hair="#5C3A1A"/>
          <IHotspot x={20} y={30} kind="info" label="마네킹 시나리오 조작"/>
        </>
      )}
    />
  );
}

Object.assign(window, { ScreenInteriorSim });
