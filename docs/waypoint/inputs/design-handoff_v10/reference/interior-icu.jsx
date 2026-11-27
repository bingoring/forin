// interior-icu.jsx — Intensive Care Unit, rebuilt to the master blueprint.
// 34×44 tiles. Four glass-walled PRIVATE rooms across the top (A pod: 호흡기/
// 신부전 · B pod: 신경외과/수술후), a fortress-like central monitoring hub in
// the middle, and visitor / dirty-utility / med-equip support rooms below.
//
//   ┌ R1 VENT ┬ R2 CRRT ┬ R3 EVD ┬ R4 TTM ┐   (1인실, 유리문 격리)
//   ├─────────┴─ CENTRAL ICU STATION ──────┤   (텔레메트리 월 · 코드블루)
//   ├ 면회 대기 ┬ DIRTY UTIL ┬ MED · EQUIP ─┤
//   └──────────┴────────────┴──────────────┘
//
// New blueprint objects live in interior-objects-icu2.jsx; cross-dept objects
// (SoiledCart, etc.) resolve at render time.

function ScreenInteriorICU() {
  const COLS = 34, ROWS = 44;
  const Th = window.IThreshold;
  const Tint = window.Tint;

  const regions = [
    { id: 'r1',      name: 'Room 1 · 인공호흡 (A)',  icon: '🫁', bounds: { x: 0,  y: 0,  w: 9,  h: 18 } },
    { id: 'r2',      name: 'Room 2 · CRRT 투석 (A)', icon: '🩸', bounds: { x: 8,  y: 0,  w: 9,  h: 18 } },
    { id: 'r3',      name: 'Room 3 · 뇌압/EVD (B)',  icon: '🧠', bounds: { x: 16, y: 0,  w: 9,  h: 18 } },
    { id: 'r4',      name: 'Room 4 · TTM 저체온 (B)', icon: '❄️', bounds: { x: 24, y: 0,  w: 10, h: 18 } },
    { id: 'station', name: '중앙 제어 허브',          icon: '🖥', bounds: { x: 0,  y: 17, w: 34, h: 14 } },
    { id: 'family',  name: '면회 대기실',            icon: '💔', bounds: { x: 0,  y: 30, w: 14, h: 14 } },
    { id: 'dirty',   name: 'Dirty Utility · 오염',   icon: '☣️', bounds: { x: 13, y: 30, w: 11, h: 14 } },
    { id: 'equip',   name: 'Med · 장비 보관실',       icon: '💊', bounds: { x: 23, y: 30, w: 11, h: 14 } },
  ];

  const rooms = [
    { id: 'r1',      name: 'Room 1 · VENT',  sub: '인공호흡·다약물', icon: '🫁', color: '#FCA5A5', x: 3,  y: 7,  questCount: 1 },
    { id: 'r2',      name: 'Room 2 · CRRT',  sub: '지속적 신대체',   icon: '🩸', color: '#FECACA', x: 11, y: 7,  questCount: 1 },
    { id: 'r3',      name: 'Room 3 · EVD',   sub: '뇌압 모니터링',   icon: '🧠', color: '#DDD6FE', x: 19, y: 7,  questCount: 1 },
    { id: 'r4',      name: 'Room 4 · TTM',   sub: '목표 체온 유지',  icon: '❄️', color: '#BAE6FD', x: 27, y: 7,  questCount: 1 },
    { id: 'station', name: '중앙 제어 허브',  sub: '4-방 텔레메트리', icon: '🖥', color: '#A7F3D0', x: 16, y: 23, questCount: 1 },
    { id: 'family',  name: '면회 대기실',    sub: '인터폰·통제',     icon: '💔', color: '#FBCFE8', x: 5,  y: 36 },
    { id: 'dirty',   name: 'Dirty Utility',  sub: '오염 처리',       icon: '☣️', color: '#FDE68A', x: 18, y: 36 },
    { id: 'equip',   name: 'Med · 장비',     sub: 'Pyxis·Vent',     icon: '💊', color: '#DDD6FE', x: 28, y: 36, questCount: 1 },
  ];

  return (
    <InteriorScreen
      label="06d Interior · ICU" deptCode="중환자실 ICU · 5F" deptColor="#DC2626"
      cols={COLS} rows={ROWS} floor="ICU"
      playerStart={{ x: 16, y: 23 }}
      rooms={rooms}
      regions={regions}
      missionText="Room 1 · 승압제 적정 + 중앙 허브 SBAR 보고"
      missionUrgent
      render={() => (
        <>
          {/* dimmer lighting over the patient rooms (calmer ICU ambience) */}
          <Tint x={1} y={1} w={32} h={16} color="#26354D" op={0.16}/>

          {/* ═══════════════ OUTER WALLS ═══════════════ */}
          <IWall x={0} y={0} w={34} h={1}/>
          <IWall x={0}  y={1}  w={1}  h={42}/>
          <IWall x={33} y={1}  w={1}  h={42}/>
          <IWall x={0}  y={43} w={6}  h={1}/>
          <IDoor x={6}  y={43} w={3}  h={1} kind="auto" label="↓ 캠퍼스로"/>
          <IWall x={9}  y={43} w={24} h={1}/>

          {/* ─── 4 PRIVATE GLASS ROOMS (vertical glass dividers) ─── */}
          <IGlass x={8}  y={1} w={1} h={16}/>
          <IGlass x={16} y={1} w={1} h={16}/>
          <IGlass x={24} y={1} w={1} h={16}/>
          {/* bottom glass boundary at y17 w/ a sliding auto door per room */}
          <IGlass x={1}  y={17} w={3} h={1}/><IDoor x={4}  y={17} w={1} h={1} kind="auto"/><IGlass x={5}  y={17} w={3} h={1}/>
          <IGlass x={9}  y={17} w={3} h={1}/><IDoor x={12} y={17} w={1} h={1} kind="auto"/><IGlass x={13} y={17} w={3} h={1}/>
          <IGlass x={17} y={17} w={3} h={1}/><IDoor x={20} y={17} w={1} h={1} kind="auto"/><IGlass x={21} y={17} w={3} h={1}/>
          <IGlass x={25} y={17} w={3} h={1}/><IDoor x={28} y={17} w={1} h={1} kind="auto"/><IGlass x={29} y={17} w={4} h={1}/>

          {/* ════════ ROOM 1 · 인공호흡 + 다약물 (A pod) ════════ */}
          <BayLabel x={1} y={1} text="ROOM 1 · 인공호흡" highlight/>
          <IBed x={2} y={3} variant="ward" occupied label="INTUBATED"/>
          <Ventilator x={1} y={8}/>
          <window.IVPumpTower x={5} y={6}/>
          <IMonitor x={4} y={2} beep/>
          <window.IIV x={6} y={3}/>
          <window.FoleyBag x={2} y={11}/>
          <INpc x={4} y={11} kind="nurse" hair="#3C2A18"/>
          <IHotspot x={4} y={10} kind="quest" label="승압제 적정"/>

          {/* ════════ ROOM 2 · CRRT 투석 (A pod) ════════ */}
          <BayLabel x={9} y={1} text="ROOM 2 · CRRT"/>
          <IBed x={10} y={3} variant="ward" occupied/>
          <IMonitor x={12} y={2} beep/>
          <window.IIV x={12} y={4}/>
          <window.CRRTMachine x={13} y={7}/>
          <INpc x={10} y={11} kind="nurse" hair="#5C3A1A" shirt="#A5D8E8"/>
          <IHotspot x={10} y={10} kind="info" label="필터 압력"/>

          {/* ════════ ROOM 3 · 뇌압/EVD (B pod) ════════ */}
          <BayLabel x={17} y={1} text="ROOM 3 · 뇌압/EVD"/>
          <IBed x={18} y={3} variant="ward" occupied/>
          <IMonitor x={20} y={2} beep/>
          <window.EVDStand x={21} y={6}/>
          <window.ICPMonitor x={22} y={10}/>
          <INpc x={18} y={11} kind="nurse" hair="#3C2A18"/>
          <IHotspot x={18} y={10} kind="quest" label="동공·GCS 사정"/>

          {/* ════════ ROOM 4 · TTM 저체온 (B pod) ════════ */}
          <BayLabel x={25} y={1} text="ROOM 4 · TTM"/>
          <IBed x={26} y={3} variant="ward" occupied/>
          <IMonitor x={28} y={2} beep/>
          <window.TTMUnit x={29} y={7}/>
          <INpc x={26} y={11} kind="nurse" hair="#7C3F00" shirt="#A5D8E8"/>
          <IHotspot x={26} y={10} kind="info" label="떨림 감시"/>

          {/* ════════════════ CENTRAL ICU STATION (y18-29) ════════════════ */}
          <BayLabel x={12} y={18} text="CENTRAL ICU STATION"/>
          {/* central telemetry wall (4-room waveforms) */}
          <BankOfMonitors x={11} y={18}/>
          {/* PPE / isolation on the flanks */}
          <ICabinet x={1}  y={19} w={4} variant="linen" label="PPE"/>
          <ICabinet x={29} y={19} w={4} variant="equipment"/>
          {/* twin nurse-station charting desks (ㄴ자의 I자 버전) */}
          <NurseDeskI x={6}  y={23} w={6} h={2} label="ORDER PC"/>
          <NurseDeskI x={15} y={23} w={6} h={2}/>
          <DeskPhone x={9}  y={22}/>
          <DeskPhone x={18} y={22}/>
          {/* code-blue crash cart, center */}
          <CrashCart x={24} y={22}/>
          <BayLabel x={23} y={20} text="CODE BLUE"/>
          {/* hub team: charge nurse · intensivist · RT */}
          <INpc x={8}  y={25} kind="nurse"  hair="#3C2A18"/>
          <IHotspot x={8} y={25} kind="quest" label="SBAR / ABGA"/>
          <INpc x={13} y={25} kind="doctor" hair="#1F2937"/>
          <INpc x={18} y={25} kind="doctor" hair="#7C3F00" shirt="#A7D7B0"/>
          <IHotspot x={18} y={25} kind="info" label="RT · VENT 설정"/>
          <INpc x={22} y={25} kind="nurse"  hair="#5C3A1A" shirt="#A5D8E8"/>

          {/* ═══════════════ DIVIDER y30 (station / support) ═══════════════ */}
          <IWall x={1}  y={30} w={4} h={1}/>
          <Th    x={5}  y={30} w={3} h={1} label="→ 면회"/>
          <IWall x={8}  y={30} w={5} h={1}/>
          <Th    x={13} y={30} w={3} h={1} label="→ 오염"/>
          <IWall x={16} y={30} w={6} h={1}/>
          <Th    x={22} y={30} w={3} h={1} label="→ MED"/>
          <IWall x={25} y={30} w={8} h={1}/>
          {/* support vertical dividers */}
          <IWall x={13} y={31} w={1} h={4}/><Th x={13} y={35} w={1} h={3}/><IWall x={13} y={38} w={1} h={5}/>
          <IWall x={23} y={31} w={1} h={4}/><Th x={23} y={35} w={1} h={3}/><IWall x={23} y={38} w={1} h={5}/>

          {/* ════════════════ 면회 대기실 (family, y31-42) ════════════════ */}
          <BayLabel x={1} y={31} text="면회 대기실 · VISITOR"/>
          <window.VisitorScreen x={9} y={31} w={2}/>
          <window.GownBox x={1} y={32}/>
          <window.Intercom x={3} y={39}/>
          <HandSanitizer x={11} y={32}/>
          <window.Sofa x={2} y={35} w={3} color="#9CB4C8"/>
          <window.CoffeeTable x={3} y={37} w={2}/>
          <WaterCooler x={11} y={35}/>
          <INpc x={6} y={37} kind="visitor" hair="#3C2A18"/>
          <INpc x={9} y={40} kind="visitor" hair="#9A6B3F"/>
          <IHotspot x={6} y={36} kind="info" label="면회 대기"/>
          <IPlant x={12} y={41}/>

          {/* ════════════════ DIRTY UTILITY (dirty, y31-42) ════════════════ */}
          <BayLabel x={14} y={31} text="DIRTY UTILITY · 오염"/>
          <window.SinkOR x={14} y={34}/>
          <WasteBin x={18} y={33} tone="infectious"/>
          <WasteBin x={21} y={33} tone="infectious"/>
          <window.SoiledCart x={18} y={37}/>
          <ICabinet x={20} y={40} w={3} variant="supply"/>
          <IHotspot x={16} y={33} kind="info" label="오염 처리 · C-line"/>

          {/* ════════════════ MED · 장비 보관실 (equip, y31-42) ════════════════ */}
          <BayLabel x={24} y={31} text="MED · 장비 보관실"/>
          <window.PyxisMachine x={24} y={33}/>
          <ICabinet x={27} y={33} w={3} variant="drug" label="DRUGS"/>
          <ICabinet x={24} y={37} w={4} variant="equipment" label="VENT"/>
          <ICabinet x={28} y={37} w={4} variant="supply"/>
          <CrashCart x={31} y={40}/>
          <INpc x={26} y={40} kind="nurse" hair="#3C2A18" shirt="#A7D7B0"/>
          <IHotspot x={26} y={39} kind="quest" label="투약 준비"/>
          <IPlant x={31} y={36}/>
        </>
      )}
    />
  );
}

// ─── ICU-specific helpers (unchanged) ──────
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
