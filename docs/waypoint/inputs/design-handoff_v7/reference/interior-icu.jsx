// interior-icu.jsx — ICU expanded to 30×38 for breathing room. Four glass-
// walled patient rooms across the top, central monitoring station in the
// middle, support rooms across the bottom.

function ScreenInteriorICU() {
  const COLS = 30, ROWS = 38;

  const regions = [
    { id: 'r1',      name: 'Room 1 · Wong',  icon: '🛏', bounds: { x: 0,  y: 0,  w: 8,  h: 16 } },
    { id: 'r2',      name: 'Room 2 · Lee',   icon: '🛏', bounds: { x: 7,  y: 0,  w: 8,  h: 16 } },
    { id: 'r3',      name: 'Room 3 · 위급', icon: '🛏', bounds: { x: 14, y: 0,  w: 8,  h: 16 } },
    { id: 'r4',      name: 'Room 4 · Park',  icon: '🛏', bounds: { x: 21, y: 0,  w: 9,  h: 16 } },
    { id: 'station', name: '중앙 모니터링',   icon: '🖥', bounds: { x: 0,  y: 15, w: 30, h: 11 } },
    { id: 'family',  name: '가족실',         icon: '💔', bounds: { x: 0,  y: 25, w: 9,  h: 13 } },
    { id: 'break',   name: '직원 휴게실',     icon: '☕', bounds: { x: 8,  y: 25, w: 8,  h: 13 } },
    { id: 'med',     name: 'Med Room',       icon: '💊', bounds: { x: 15, y: 25, w: 8,  h: 13 } },
    { id: 'equip',   name: '장비 보관실',     icon: '📦', bounds: { x: 22, y: 25, w: 8,  h: 13 } },
  ];

  const rooms = [
    { id: 'r1',      name: 'Room 1 · Wong', sub: 'Intubated',   icon: '🛏', color: '#FCA5A5', x: 3, y: 7, questCount: 1 },
    { id: 'r2',      name: 'Room 2 · Lee',  sub: 'Stable',      icon: '🛏', color: '#FEF08A', x: 10, y: 7, questCount: 1 },
    { id: 'r3',      name: 'Room 3 · Park', sub: 'ARDS · 위급', icon: '🛏', color: '#FCA5A5', x: 17, y: 7, questCount: 2 },
    { id: 'r4',      name: 'Room 4 · Park', sub: 'Stable',      icon: '🛏', color: '#A7F3D0', x: 25, y: 7 },
    { id: 'monitor', name: '중앙 모니터링',  sub: '4-방 동시',   icon: '🖥', color: '#BAE6FD', x: 15, y: 20, questCount: 1 },
    { id: 'crash',   name: '크래시 카트',    sub: '응급·제세동기', icon: '⚡', color: '#FED7AA', x: 3, y: 20 },
    { id: 'family',  name: '가족실',        sub: '면담·위로',    icon: '💔', color: '#FBCFE8', x: 4, y: 30, questCount: 1 },
    { id: 'break',   name: '직원 휴게실',    sub: '커피·휴식',    icon: '☕', color: '#FEF08A', x: 12, y: 30 },
    { id: 'med',     name: 'Med Room',      sub: 'Pyxis 약장',  icon: '💊', color: '#DDD6FE', x: 18, y: 32, questCount: 1 },
    { id: 'equip',   name: '장비 보관실',    sub: 'Vent·IV pump', icon: '📦', color: '#A7F3D0', x: 26, y: 31 },
  ];

  return (
    <InteriorScreen
      label="06d Interior · ICU" deptCode="중환자실 ICU · 5F" deptColor="#DC2626"
      cols={COLS} rows={ROWS} floor="ICU"
      playerStart={{ x: 15, y: 19 }}
      rooms={rooms}
      regions={regions}
      missionText="Room 3 환자의 인공호흡기 설정 닥터에게 보고 (SBAR)"
      missionUrgent
      render={() => (
        <>
          {/* OUTER WALLS */}
          <IWall x={0}  y={0} w={12} h={1}/>
          <IDoor x={12} y={0} w={2}  h={1} kind="auto" label="↓ 캠퍼스로"/>
          <IWall x={14} y={0} w={16} h={1}/>
          <IWall x={0}  y={1}  w={1}  h={36}/>
          <IWall x={29} y={1}  w={1}  h={36}/>
          <IWall x={0}  y={37} w={30} h={1}/>

          {/* ─── PATIENT ROOMS — 4 across, separated by glass walls ─── */}
          {/* Bottom glass boundary at y=15 (between rooms and monitoring) */}
          <IGlass x={1} y={15} w={6}  h={1}/>
          <IDoor  x={4} y={15} w={1}  h={1} kind="auto"/>
          <IGlass x={8} y={15} w={6}  h={1}/>
          <IDoor  x={11} y={15} w={1} h={1} kind="auto"/>
          <IGlass x={15} y={15} w={6} h={1}/>
          <IDoor  x={18} y={15} w={1} h={1} kind="auto"/>
          <IGlass x={22} y={15} w={7} h={1}/>
          <IDoor  x={25} y={15} w={1} h={1} kind="auto"/>

          {/* Vertical glass between rooms */}
          <IGlass x={7}  y={1} w={1} h={15}/>
          <IGlass x={14} y={1} w={1} h={15}/>
          <IGlass x={21} y={1} w={1} h={15}/>

          {/* ─── ROOM 1 · Mr. Wong (intubated) ─── */}
          <BayLabel x={1} y={1} text="ROOM 1 · Mr. Wong" highlight/>
          <IBed x={2} y={3} variant="ward" occupied label="INTUBATED"/>
          <Ventilator x={1} y={8}/>
          <IMonitor x={4} y={2} beep/>
          <IMonitor x={5} y={2} beep/>
          <IIV x={5} y={5}/>
          <IIV x={5} y={8}/>
          <IChair x={2} y={12} color="#A8C7DC" facing="up"/>
          <INpc x={3} y={11.5} kind="visitor" hair="#3C2A18"/>
          <IHotspot x={3} y={11} kind="info" label="가족 설명"/>

          {/* ─── ROOM 2 · Mrs. Lee ─── */}
          <BayLabel x={8} y={1} text="ROOM 2 · Mrs. Lee"/>
          <IBed x={9} y={3} variant="ward" occupied/>
          <IMonitor x={11} y={2}/>
          <IMonitor x={12} y={2} beep/>
          <IIV x={12} y={5}/>
          <INpc x={10} y={9} kind="nurse" hair="#5C3A1A" shirt="#A5D8E8"/>
          <IHotspot x={10} y={8} kind="quest" label="활력 체크"/>
          <IChair x={9} y={12} color="#A8C7DC" facing="up"/>

          {/* ─── ROOM 3 · Mr. Park (ARDS) ─── */}
          <BayLabel x={15} y={1} text="ROOM 3 · Mr. Park" highlight/>
          <IBed x={16} y={3} variant="ward" occupied label="ARDS"/>
          <Ventilator x={15} y={8}/>
          <IMonitor x={18} y={2} beep/>
          <IMonitor x={19} y={2} beep/>
          <IIV x={19} y={5}/>
          <IIV x={19} y={8}/>
          <INpc x={16} y={11} kind="nurse" hair="#3C2A18"/>
          <IHotspot x={16} y={10} kind="urgent" label="VENT 설정"/>
          <INpc x={18} y={11} kind="doctor" hair="#7C3F00"/>
          <IHotspot x={18} y={11} kind="info" label="RT 협업"/>

          {/* ─── ROOM 4 · Mrs. Park ─── */}
          <BayLabel x={22} y={1} text="ROOM 4 · Mrs. Park"/>
          <IBed x={24} y={3} variant="ward" occupied/>
          <IMonitor x={26} y={2}/>
          <IMonitor x={27} y={2}/>
          <IIV x={27} y={5}/>
          <INpc x={23} y={11} kind="visitor" hair="#9A6B3F"/>
          <IPlant x={26} y={12}/>

          {/* ─── CENTRAL MONITORING STATION (y 16-24) ─── */}
          <BayLabel x={11} y={16} text="CENTRAL MONITORING"/>
          {/* Bank of monitors */}
          <BankOfMonitors x={9} y={16.3}/>
          {/* Two semicircular desks */}
          <IReception x={9}  y={19} w={5} h={3}/>
          <IReception x={16} y={19} w={5} h={3}/>
          {/* Charge nurse + team */}
          <INpc x={11} y={22} kind="nurse" hair="#3C2A18"/>
          <IHotspot x={11} y={22} kind="quest" label="SBAR 인계"/>
          <INpc x={14} y={22} kind="doctor" hair="#1F2937"/>
          <INpc x={18} y={22} kind="nurse" hair="#5C3A1A" shirt="#A5D8E8"/>

          {/* Crash cart + supply (left side of station) */}
          <BayLabel x={2} y={17} text="CRASH"/>
          <CrashCart x={3} y={19}/>
          <ICabinet x={2} y={22} w={4} variant="equipment" label="CRASH KIT"/>

          {/* Isolation/PPE storage (right side of station) */}
          <BayLabel x={23} y={17} text="ISOLATION"/>
          <ICabinet x={23} y={18} w={5} variant="linen" label="PPE"/>
          <ICabinet x={23} y={20} w={5} variant="supply"/>
          <ICabinet x={23} y={22} w={5} variant="equipment"/>

          {/* ─── DIVIDER y=24 (between station and support rooms) ─── */}
          <IWall x={1}  y={24} w={7}  h={1}/>
          <IDoor x={8}  y={24} w={1}  h={1} kind="wood"/>
          <IWall x={9}  y={24} w={6}  h={1}/>
          <IDoor x={15} y={24} w={1}  h={1} kind="wood"/>
          <IWall x={16} y={24} w={6}  h={1}/>
          <IDoor x={22} y={24} w={1}  h={1} kind="wood"/>
          <IWall x={23} y={24} w={6}  h={1}/>

          {/* ─── SUPPORT ROOMS (y 25-36) ─── */}
          {/* Vertical dividers between bottom rooms */}
          <IWall x={8}  y={25} w={1} h={4}/>
          <IDoor x={8}  y={29} w={1} h={2} kind="wood"/>
          <IWall x={8}  y={31} w={1} h={6}/>
          <IWall x={15} y={25} w={1} h={4}/>
          <IDoor x={15} y={29} w={1} h={2} kind="wood"/>
          <IWall x={15} y={31} w={1} h={6}/>
          <IWall x={22} y={25} w={1} h={4}/>
          <IDoor x={22} y={29} w={1} h={2} kind="wood"/>
          <IWall x={22} y={31} w={1} h={6}/>

          {/* Family room (cols 1-7) */}
          <BayLabel x={1} y={25} text="FAMILY ROOM"/>
          <IChair x={1} y={27} color="#FED7AA" facing="down"/>
          <IChair x={2} y={27} color="#FED7AA" facing="down"/>
          <IChair x={3} y={27} color="#FED7AA" facing="down"/>
          <div style={{ position: 'absolute', left: 1 * ITILE, top: 30 * ITILE, width: ITILE * 6, height: ITILE * 1.4, background: '#8B5A2B', border: `2px solid ${IP.ink}`, boxShadow: `2px 2px 0 0 ${IP.ink}66` }}/>
          <div style={{ position: 'absolute', left: 3 * ITILE, top: 30 * ITILE + 4, width: 10, height: 8, background: '#fff', border: `1.5px solid ${IP.ink}` }}/>
          <IChair x={1} y={33} color="#A8C7DC" facing="up"/>
          <IChair x={3} y={33} color="#A8C7DC" facing="up"/>
          <IChair x={5} y={33} color="#A8C7DC" facing="up"/>
          <INpc x={3} y={27.5} kind="visitor" hair="#3C2A18"/>
          <IHotspot x={3} y={27} kind="info" label="가족 면담"/>
          <INpc x={5} y={27.5} kind="visitor" hair="#9A6B3F"/>
          <IPlant x={7} y={35}/>

          {/* Break room (cols 9-14) */}
          <BayLabel x={9} y={25} text="STAFF BREAK"/>
          <div style={{ position: 'absolute', left: 9 * ITILE, top: 29 * ITILE, width: ITILE * 5, height: ITILE * 1.4, background: '#8B5A2B', border: `2px solid ${IP.ink}` }}/>
          <IChair x={9}  y={27} color="#FBCFE8" facing="down"/>
          <IChair x={11} y={27} color="#FBCFE8" facing="down"/>
          <IChair x={13} y={27} color="#FBCFE8" facing="down"/>
          <IChair x={10} y={32} color="#FBCFE8" facing="up"/>
          <IChair x={12} y={32} color="#FBCFE8" facing="up"/>
          <CoffeeMachine x={9} y={34}/>
          <div style={{ position: 'absolute', left: 13 * ITILE, top: 33 * ITILE, width: ITILE * 1.2, height: ITILE * 2, background: '#E5E7EB', border: `2px solid ${IP.ink}` }}/>
          <INpc x={11} y={31} kind="nurse" hair="#7C3F00" shirt="#FBCFE8"/>

          {/* Med Room (cols 16-21) — Pyxis + drug cabinets */}
          <BayLabel x={16} y={25} text="MED ROOM"/>
          <ICabinet x={16} y={26} w={5} variant="drug" label="DRUGS"/>
          <ICabinet x={16} y={28} w={5} variant="drug"/>
          <ICabinet x={16} y={30} w={5} variant="chart"/>
          <PyxisMachine x={17} y={33}/>
          <INpc x={20} y={34} kind="nurse" hair="#3C2A18" shirt="#A7D7B0"/>
          <IHotspot x={20} y={33.5} kind="quest" label="투약 준비"/>

          {/* Equipment storage (cols 23-28) */}
          <BayLabel x={23} y={25} text="EQUIPMENT"/>
          <ICabinet x={23} y={26} w={5} variant="equipment" label="VENT"/>
          <CrashCart x={24} y={29}/>
          <ICabinet x={23} y={32} w={5} variant="supply"/>
          <ICabinet x={23} y={34} w={5} variant="equipment"/>
          <IPlant x={27} y={36}/>
        </>
      )}
    />
  );
}

// ─── ICU-specific helpers (unchanged from previous version) ──────
function Ventilator({ x, y }) {
  return (
    <div style={{ position: 'absolute', left: x * ITILE, top: y * ITILE - 4, width: ITILE, height: ITILE * 2, filter: 'drop-shadow(2px 2px 0 rgba(0,0,0,.2))' }}>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 22, background: '#475569', border: `2px solid ${IP.ink}` }}>
        <div style={{ position: 'absolute', left: 2, top: 2, right: 2, height: 8, background: '#0F1A24' }}>
          <div style={{ position: 'absolute', left: 1, right: 1, top: 1, height: 1, background: '#22D3EE' }}/>
          <div style={{ position: 'absolute', left: 1, right: 1, top: 4, height: 1, background: '#FACC15' }}/>
        </div>
        <div style={{ position: 'absolute', left: 2, top: 12, width: 2, height: 2, background: '#EF4444' }}/>
        <div style={{ position: 'absolute', left: 5, top: 12, width: 2, height: 2, background: '#3B82F6' }}/>
        <div style={{ position: 'absolute', left: 8, top: 12, width: 2, height: 2, background: '#10B981' }}/>
        <div style={{ position: 'absolute', left: 11, top: 12, width: 2, height: 2, background: '#FACC15' }}/>
      </div>
      <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: 0, width: 4, height: 8, background: '#94A3B8', border: `1px solid ${IP.ink}` }}/>
      <div style={{ position: 'absolute', top: -2, right: -1, fontFamily: '"DungGeunMo",monospace', fontSize: 6, color: '#0F1A24', background: '#22D3EE', padding: '0 2px', border: `1px solid ${IP.ink}` }}>VENT</div>
    </div>
  );
}

function BankOfMonitors({ x, y }) {
  return (
    <div style={{ position: 'absolute', left: x * ITILE, top: y * ITILE,
      width: ITILE * 12, height: ITILE * 1.8,
      background: '#1F2937', border: `2px solid ${IP.ink}`, boxShadow: `3px 3px 0 0 ${IP.ink}`,
      display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 1, padding: 1 }}>
      {[1,2,3,4].map(i => (
        <div key={i} style={{ background: '#0F1A24', border: `1px solid ${IP.ink}99`, padding: 2, position: 'relative' }}>
          <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 6, color: '#94A3B8' }}>R{i}</div>
          <div style={{ position: 'absolute', left: 2, right: 2, top: 9, height: 1, background: '#22D3EE' }}/>
          <div style={{ position: 'absolute', left: 2, right: 2, top: 13, height: 1, background: '#F87171' }}/>
          <div style={{ position: 'absolute', left: 2, right: 2, top: 18, height: 1, background: '#FACC15' }}/>
          {i % 2 === 1 && <div style={{ position: 'absolute', right: 1, top: 1, width: 2, height: 2, background: '#EF4444', animation: 'forinBlink .8s steps(2,end) infinite' }}/>}
        </div>
      ))}
    </div>
  );
}

function CrashCart({ x, y }) {
  return (
    <div style={{ position: 'absolute', left: x * ITILE, top: y * ITILE, width: ITILE, height: ITILE * 2, filter: 'drop-shadow(2px 2px 0 rgba(0,0,0,.18))' }}>
      <div style={{ position: 'absolute', inset: 0, background: '#DC2626', border: `2px solid ${IP.ink}` }}/>
      <div style={{ position: 'absolute', left: 2, right: 2, top: 3, height: 6, background: '#fff', border: `1px solid ${IP.ink}` }}/>
      <div style={{ position: 'absolute', left: 2, right: 2, top: 11, height: 6, background: '#fff', border: `1px solid ${IP.ink}` }}/>
      <div style={{ position: 'absolute', left: 2, right: 2, top: 19, height: 6, background: '#fff', border: `1px solid ${IP.ink}` }}/>
      <div style={{ position: 'absolute', left: 1, top: -3, right: 1, height: 4, background: '#FACC15', border: `1px solid ${IP.ink}` }}/>
      <div style={{ position: 'absolute', left: 4, top: -8, width: 8, height: 5, background: '#FACC15', border: `1px solid ${IP.ink}` }}>
        <div style={{ position: 'absolute', left: 2, top: 1, fontFamily: '"DungGeunMo",monospace', fontSize: 5, color: IP.ink }}>⚡</div>
      </div>
    </div>
  );
}

function CoffeeMachine({ x, y }) {
  return (
    <div style={{ position: 'absolute', left: x * ITILE, top: y * ITILE, width: ITILE, height: ITILE * 1.3, filter: 'drop-shadow(2px 2px 0 rgba(0,0,0,.18))' }}>
      <div style={{ position: 'absolute', inset: 0, background: '#475569', border: `2px solid ${IP.ink}` }}/>
      <div style={{ position: 'absolute', left: 2, right: 2, top: 2, height: 6, background: '#0F1A24', border: `1px solid ${IP.ink}88` }}>
        <div style={{ position: 'absolute', left: 1, top: 1, fontFamily: '"DungGeunMo",monospace', fontSize: 5, color: '#22D3EE' }}>☕</div>
      </div>
      <div style={{ position: 'absolute', left: 4, bottom: 2, width: 8, height: 6, background: '#fff', border: `1px solid ${IP.ink}` }}/>
      <div style={{ position: 'absolute', left: 6, top: -4, width: 2, height: 4, background: '#fff', opacity: 0.7, animation: 'forinBob 1.5s ease-in-out infinite' }}/>
    </div>
  );
}

function PyxisMachine({ x, y }) {
  return (
    <div style={{ position: 'absolute', left: x * ITILE, top: y * ITILE, width: ITILE * 2, height: ITILE * 2, filter: 'drop-shadow(2px 3px 0 rgba(0,0,0,.2))' }}>
      <div style={{ position: 'absolute', inset: 0, background: '#94A3B8', border: `2.5px solid ${IP.ink}` }}/>
      <div style={{ position: 'absolute', left: 2, right: 2, top: 2, height: 14, background: '#1F2937', border: `1.5px solid ${IP.ink}99` }}>
        <div style={{ position: 'absolute', left: 1, top: 1, fontFamily: '"DungGeunMo",monospace', fontSize: 6, color: '#22D3EE' }}>PYXIS</div>
        <div style={{ position: 'absolute', left: 2, right: 2, top: 6, height: 1.5, background: '#10B981' }}/>
        <div style={{ position: 'absolute', left: 2, right: 2, top: 9, height: 1.5, background: '#22D3EE' }}/>
      </div>
      <div style={{ position: 'absolute', left: 2, right: 2, top: 18, height: 5, background: '#fff', border: `1px solid ${IP.ink}` }}/>
      <div style={{ position: 'absolute', left: 2, right: 2, top: 24, height: 5, background: '#fff', border: `1px solid ${IP.ink}` }}/>
    </div>
  );
}

Object.assign(window, {
  ScreenInteriorICU,
  Ventilator, BankOfMonitors, CrashCart, CoffeeMachine, PyxisMachine,
});
