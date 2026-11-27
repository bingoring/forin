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
    <div style={{ position: 'absolute', left: x * ITILE, top: y * ITILE - 8, width: ITILE * 1.6, height: ITILE * 2.9 }}>
      <svg viewBox="0 0 26 46" width={ITILE * 1.6} height={ITILE * 2.9} shapeRendering="geometricPrecision">
          <ellipse cx="13.0" cy="44" rx="8.8" ry="3" fill="rgba(0,0,0,.16)"/>
        {/* ── large touchscreen monitor on a stalk (viewer-facing) ── */}
        <rect x="3" y="1" width="18" height="12" rx="1.2" fill="#1B2128" stroke={IP.ink} strokeWidth=".6"/>
        <rect x="4.2" y="2.2" width="15.6" height="9.6" rx=".5" fill="#0B1622"/>
        {/* waveforms + numeric column */}
        <path d="M5 5.5 L7 5.5 L8 3.6 L9 7.2 L10 5.5 L14 5.5" fill="none" stroke="#22D3EE" strokeWidth=".55"/>
        <path d="M5 8.6 L8 8.6 L8 6.9 L11 6.9 L11 8.6 L14 8.6" fill="none" stroke="#FACC15" strokeWidth=".5"/>
        <rect x="15.5" y="3.2" width="3.4" height="2.2" fill="#10B981" opacity=".85"/>
        <rect x="15.5" y="6.2" width="3.4" height="2.2" fill="#F87171" opacity=".85"/>
        <rect x="15.5" y="9.2" width="3.4" height="1.6" fill="#38BDF8" opacity=".7"/>
        {/* stalk down to the body */}
        <rect x="11.5" y="13" width="2.4" height="4" fill="#B7BEC6" stroke={IP.ink} strokeWidth=".4"/>

        {/* ── central body unit (dominant TOP face + short front) ── */}
        <path d="M6.5 20 L18.5 20 L18.5 31 Q18.5 31.6 17.9 31.6 L7.1 31.6 Q6.5 31.6 6.5 31 Z" fill="#E4E5E3"/>
        {/* big top face of the body (gas modules seen from above) */}
        <path d="M7.1 13 L17.9 13 Q18.5 13 18.5 13.6 L18.5 20 L6.5 20 L6.5 13.6 Q6.5 13 7.1 13 Z" fill="#54606C"/>
        <rect x="8" y="14.2" width="9" height="1.4" fill="#6B7885"/>{/* back-edge highlight */}
        <rect x="8.2" y="16.2" width="4" height="3" rx=".4" fill="#3A424C"/>{/* gas module on top */}
        <circle cx="15" cy="17.6" r="1.4" fill="#9AA6B2" stroke={IP.ink} strokeWidth=".35"/>{/* dial on top */}
        <line x1="6.5" y1="20" x2="18.5" y2="20" stroke={IP.ink} strokeWidth=".55"/>{/* seam top→front */}
        {/* viewer-facing front: patient-port + expiratory valve + label */}
        <circle cx="10" cy="26" r="1.6" fill="#CBD5E1" stroke={IP.ink} strokeWidth=".4"/>
        <circle cx="14.6" cy="26" r="1.3" fill="#9AA6B2" stroke={IP.ink} strokeWidth=".4"/>
        <rect x="7.6" y="29" width="9.4" height="1.4" fill="#D2D6D4"/>
        {/* blue breathing-circuit hose looping off the side, from the port */}
        <path d="M8.4 24 Q1.5 24 2.5 29 Q3.2 32.5 8 30.5" fill="none" stroke="#7FB8E6" strokeWidth="2.4" strokeLinecap="round"/>
        <path d="M8.4 24 Q1.5 24 2.5 29 Q3.2 32.5 8 30.5" fill="none" stroke="#5B95C9" strokeWidth=".5" strokeLinecap="round" opacity=".5"/>
        {/* body outline */}
        <path d="M7.1 13 L17.9 13 Q18.5 13 18.5 13.6 L18.5 31 Q18.5 31.6 17.9 31.6 L7.1 31.6 Q6.5 31.6 6.5 31 L6.5 13.6 Q6.5 13 7.1 13 Z" fill="none" stroke={IP.ink} strokeWidth=".6"/>

        {/* ── column + spider wheel base ── */}
        <rect x="11.5" y="31.6" width="2.4" height="6" fill="#C6CBD1" stroke={IP.ink} strokeWidth=".4"/>
        <ellipse cx="12.6" cy="39" rx="9" ry="2.4" fill="#D7DBDF" stroke={IP.ink} strokeWidth=".5"/>
        <ellipse cx="4.5" cy="41.5" rx="2.1" ry="1.6" fill="#2C3239" stroke={IP.ink} strokeWidth=".4"/>
        <ellipse cx="20.5" cy="41.5" rx="2.1" ry="1.6" fill="#2C3239" stroke={IP.ink} strokeWidth=".4"/>
        <ellipse cx="12.6" cy="43" rx="2.1" ry="1.6" fill="#2C3239" stroke={IP.ink} strokeWidth=".4"/>
      </svg>
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
    <div style={{ position: 'absolute', left: x * ITILE, top: y * ITILE - 3, width: ITILE * 1.4, height: ITILE * 1.9 }}>
      <svg viewBox="0 0 22 30" width={ITILE * 1.4} height={ITILE * 1.9} shapeRendering="geometricPrecision">
          <ellipse cx="11.0" cy="28.4" rx="7.5" ry="2.6" fill="rgba(0,0,0,.16)"/>
        {/* full silhouette (red lid top + viewer-facing defib + drawers) */}
        <path d="M2 1 Q1 1 1 2 L1 25 Q1 26 2 26 L20 26 Q21 26 21 25 L21 2 Q21 1 20 1 Z" fill="#B91C1C"/>
        {/* TOP lid face — defibrillator unit sitting on top (paddles in wells) */}
        <path d="M2 1 Q1 1 1 2 L1 9 L21 9 L21 2 Q21 1 20 1 Z" fill="#DC2626"/>
        <ellipse cx="15.5" cy="5" rx="2.2" ry="1.6" fill="#374151" stroke={IP.ink} strokeWidth=".4"/>
        <ellipse cx="18.5" cy="5" rx="1.6" ry="1.4" fill="#4B5563" stroke={IP.ink} strokeWidth=".35"/>
        <rect x="3" y="3" width="8" height="3.4" rx=".4" fill="#7F1D1D"/>{/* handle */}
        {/* seam lid → viewer-facing defib screen */}
        <line x1="1" y1="9" x2="21" y2="9" stroke={IP.ink} strokeWidth=".6"/>
        <rect x="2.5" y="10" width="9" height="5" rx=".5" fill="#0B3A1E" stroke={IP.ink} strokeWidth=".4"/>
        <path d="M3.2 12.4 L5 12.4 L6 10.6 L7 13.8 L8 12.4 L11 12.4" fill="none" stroke="#4ADE80" strokeWidth=".55"/>
        <rect x="13" y="10.4" width="2" height="2" rx=".3" fill="#DC2626" stroke={IP.ink} strokeWidth=".3"/>
        <rect x="16" y="10.4" width="2" height="2" rx=".3" fill="#FACC15" stroke={IP.ink} strokeWidth=".3"/>
        {/* red-cross drug badge */}
        <rect x="13" y="13" width="5" height="2" rx=".3" fill="#fff" stroke={IP.ink} strokeWidth=".3"/>
        {/* seam → drawers */}
        <line x1="1" y1="16" x2="21" y2="16" stroke={IP.ink} strokeWidth=".55"/>
        <rect x="3" y="17" width="16" height="3" rx=".3" fill="#fff" stroke={IP.ink} strokeWidth=".35"/>
        <rect x="9.5" y="18.1" width="3" height="1" fill="#DC2626"/>
        <rect x="3" y="20.5" width="16" height="3" rx=".3" fill="#fff" stroke={IP.ink} strokeWidth=".35"/>
        <rect x="9.5" y="21.6" width="3" height="1" fill="#DC2626"/>
        {/* re-stroke silhouette */}
        <path d="M2 1 Q1 1 1 2 L1 25 Q1 26 2 26 L20 26 Q21 26 21 25 L21 2 Q21 1 20 1 Z" fill="none" stroke={IP.ink} strokeWidth=".7"/>
        <ellipse cx="4.5" cy="27.5" rx="1.8" ry="1.3" fill="#2C3239"/>
        <ellipse cx="17.5" cy="27.5" rx="1.8" ry="1.3" fill="#2C3239"/>
      </svg>
    </div>
  );
}

function CoffeeMachine({ x, y }) {
  return (
    <div style={{ position: 'absolute', left: x * ITILE, top: y * ITILE - 4, width: ITILE * 1.3, height: ITILE * 1.7 }}>
      <svg viewBox="0 0 20 28" width={ITILE * 1.3} height={ITILE * 1.7} shapeRendering="geometricPrecision">
          <ellipse cx="10.0" cy="26.7" rx="6.8" ry="2.3" fill="rgba(0,0,0,.16)"/>
        {/* full silhouette: big TOP lid folds straight down into a short front */}
        <path d="M2 3 Q1 3 1 4 L1 24 Q1 25 2 25 L18 25 Q19 25 19 24 L19 4 Q19 3 18 3 Z" fill="#4E5865"/>
        {/* TOP face — machine lid (dominant) with round bean hopper seen from above */}
        <path d="M2 3 Q1 3 1 4 L1 17 L19 17 L19 4 Q19 3 18 3 Z" fill="#5E6A78"/>
        <rect x="3" y="4.4" width="14" height="1.6" fill="#727E8C"/>{/* back-edge highlight */}
        <ellipse cx="13.5" cy="10" rx="3.4" ry="2.8" fill="#2A1C10" stroke={IP.ink} strokeWidth=".5"/>{/* bean hopper */}
        <ellipse cx="13.5" cy="9.4" rx="2" ry="1.5" fill="#4A3420"/>
        {/* grinder vent slots on the lid */}
        {[4,6,8].map((gx,i)=><rect key={i} x={gx} y="8" width="1" height="6" fill="#3A424C"/>)}
        {/* seam top → front */}
        <line x1="1" y1="17" x2="19" y2="17" stroke={IP.ink} strokeWidth=".55"/>
        {/* FRONT band: viewer-facing display + spout + cup on a drip tray */}
        <rect x="2.4" y="18" width="7" height="3.2" rx=".4" fill="#0F1A24"/>
        <text x="5.9" y="20.5" fontSize="2.6" fill="#22D3EE" textAnchor="middle" fontFamily="monospace">☕</text>
        <rect x="12" y="18" width="4" height="1.6" fill="#2C3239"/>{/* spout head */}
        <rect x="13.4" y="19.6" width="1.2" height="2" fill="#2C3239"/>{/* nozzle */}
        <path d="M12 22 L16 22 L15.4 24.4 L12.6 24.4 Z" fill="#fff" stroke={IP.ink} strokeWidth=".4"/>{/* cup */}
        {/* outer outline */}
        <path d="M2 3 Q1 3 1 4 L1 24 Q1 25 2 25 L18 25 Q19 25 19 24 L19 4 Q19 3 18 3 Z" fill="none" stroke={IP.ink} strokeWidth=".65"/>
      </svg>
    </div>
  );
}

function PyxisMachine({ x, y }) {
  return (
    <div style={{ position: 'absolute', left: x * ITILE, top: y * ITILE - 3, width: ITILE * 2, height: ITILE * 2.1 }}>
      <svg viewBox="0 0 32 34" width={ITILE * 2} height={ITILE * 2.1} shapeRendering="geometricPrecision">
          <ellipse cx="16.0" cy="31.3" rx="10.9" ry="3.7" fill="rgba(0,0,0,.16)"/>
        {/* full silhouette (plain lid top + viewer-facing screen + drawers) */}
        <path d="M3 1 Q2 1 2 2 L2 30 Q2 31 3 31 L29 31 Q30 31 30 30 L30 2 Q30 1 29 1 Z" fill="#8A929B"/>
        {/* TOP lid face — plain cabinet top */}
        <path d="M3 1 Q2 1 2 2 L2 8 L30 8 L30 2 Q30 1 29 1 Z" fill="#AEB4BC"/>
        <rect x="4" y="2.4" width="24" height="2" rx=".4" fill="#C7CDD4"/>
        {/* seam lid → viewer-facing control panel */}
        <line x1="2" y1="8" x2="30" y2="8" stroke={IP.ink} strokeWidth=".6"/>
        {/* big touchscreen facing the user + fingerprint reader */}
        <rect x="4" y="9" width="15" height="10" rx=".8" fill="#0F1A24" stroke={IP.ink} strokeWidth=".5"/>
        <text x="11.5" y="12.6" fontSize="3" fill="#22D3EE" textAnchor="middle" fontFamily="monospace">PYXIS</text>
        <rect x="5.5" y="14" width="12" height="1.4" fill="#10B981"/>
        <rect x="5.5" y="16.2" width="9" height="1.4" fill="#22D3EE"/>
        <ellipse cx="24.5" cy="13" rx="3" ry="3.4" fill="#7F1D1D" stroke={IP.ink} strokeWidth=".5"/>
        <ellipse cx="24.5" cy="13" rx="1.6" ry="2" fill="#EF4444"/>
        {/* seam → drawers */}
        <line x1="2" y1="20" x2="30" y2="20" stroke={IP.ink} strokeWidth=".55"/>
        <rect x="4" y="21" width="24" height="2.6" rx=".4" fill="#C7CDD4" stroke={IP.ink} strokeWidth=".3"/>
        <rect x="4" y="24.2" width="24" height="2.6" rx=".4" fill="#C7CDD4" stroke={IP.ink} strokeWidth=".3"/>
        <rect x="4" y="27.4" width="24" height="2.6" rx=".4" fill="#C7CDD4" stroke={IP.ink} strokeWidth=".3"/>
        <rect x="14" y="21.9" width="4" height="1" fill="#64748B"/>
        <rect x="14" y="25.1" width="4" height="1" fill="#64748B"/>
        <rect x="14" y="28.3" width="4" height="1" fill="#64748B"/>
        {/* re-stroke silhouette */}
        <path d="M3 1 Q2 1 2 2 L2 30 Q2 31 3 31 L29 31 Q30 31 30 30 L30 2 Q30 1 29 1 Z" fill="none" stroke={IP.ink} strokeWidth=".7"/>
      </svg>
    </div>
  );
}

Object.assign(window, {
  ScreenInteriorICU,
  Ventilator, BankOfMonitors, CrashCart, CoffeeMachine, PyxisMachine,
});
