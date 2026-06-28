// interior-pharma.jsx — Pharmacy. Counter at front, drug shelves, IV admixture
// clean room, prescription queue. Pharmacist + tech NPCs.

function ScreenInteriorPharma() {
  const COLS = 36, ROWS = 42;
  const Th = window.IThreshold;

  const regions = [
    { id: 'vault',     name: '마약류 보관고',         icon: '🔒', bounds: { x: 0,  y: 28, w: 13, h: 14 } },
    { id: 'ante',      name: '무균 전실 (Anteroom)',  icon: '🚿', bounds: { x: 20, y: 12, w: 16, h: 9  } },
    { id: 'cleanroom', name: '무균 조제실 (Cleanroom)', icon: '🧪', bounds: { x: 20, y: 19, w: 16, h: 23 } },
    { id: 'window',    name: '수령 창구 · 기송관 허브', icon: '💊', bounds: { x: 0,  y: 0,  w: 36, h: 13 } },
    { id: 'dispense',  name: '일반 약품 조제실',       icon: '⚗', bounds: { x: 0,  y: 12, w: 21, h: 30 } },
  ];

  const rooms = [
    { id: 'window',    name: '수령 창구',   sub: '처방·반납',   icon: '💊', color: '#A7F3D0', x: 6,  y: 9,  questCount: 1 },
    { id: 'tube',      name: '기송관 허브',  sub: 'Pneumatic',   icon: '📮', color: '#BAE6FD', x: 18, y: 6,  questCount: 1 },
    { id: 'dispense',  name: '조제실',      sub: 'ATC · 검수',  icon: '⚗', color: '#FBCFE8', x: 6,  y: 20, questCount: 1 },
    { id: 'lasa',      name: 'LASA 선반',   sub: '고위험 약물', icon: '⚠️', color: '#FCA5A5', x: 10, y: 16 },
    { id: 'vault',     name: '마약류 보관고', sub: '이중 잠금',   icon: '🔒', color: '#FCA5A5', x: 4,  y: 33, questCount: 1, locked: true },
    { id: 'ante',      name: '무균 전실',   sub: '방진복·에어샤워', icon: '🚿', color: '#A7F3D0', x: 27, y: 16 },
    { id: 'cleanroom', name: '무균 조제실', sub: '항암·TPN',    icon: '🧪', color: '#DDD6FE', x: 27, y: 28, questCount: 1 },
  ];

  return (
    <InteriorScreen
      label="06e Interior · PHARMA" deptCode="중앙 약제부 Pharmacy · 1F" deptColor="#16A34A"
      cols={COLS} rows={ROWS} floor="pharma"
      playerStart={{ x: 9, y: 9 }}
      rooms={rooms}
      regions={regions}
      missionText="수령 창구 · 누락 약(Missing Med) 확인 + 더블체크"
      render={() => (
        <>
          {/* ═══════════════ OUTER WALLS ═══════════════ */}
          <IWall x={0} y={0} w={36} h={1}/>
          <IWall x={0} y={1} w={1} h={3}/>
          <IDoor x={0} y={4} w={1} h={2} kind="auto" label="간호사 출입"/>
          <IWall x={0} y={6} w={1} h={35}/>
          <IWall x={35} y={1} w={1} h={40}/>
          <IWall x={0} y={41} w={15} h={1}/>
          <IDoor x={15} y={41} w={3} h={1} kind="auto" label="↑ 캠퍼스로"/>
          <IWall x={18} y={41} w={17} h={1}/>

          {/* ═══════════════ DIVIDER y12 (window hub / back) ═══════════════ */}
          <IWall x={1}  y={12} w={5} h={1}/>
          <Th    x={6}  y={12} w={2} h={1} label="STAFF ONLY"/>
          <IWall x={8}  y={12} w={12} h={1}/>
          <Th    x={20} y={12} w={2} h={1} tone="sterile" label="무균 전실"/>
          <IWall x={22} y={12} w={13} h={1}/>
          {/* dispense | cleanroom vertical wall (x21) */}
          <IWall x={21} y={13} w={1} h={28}/>
          {/* ante | cleanroom glass + air-shower threshold (y19) */}
          <IGlass x={22} y={19} w={5} h={1}/>
          <Th     x={27} y={19} w={2} h={1} tone="sterile" label="에어샤워"/>
          <IGlass x={29} y={19} w={6} h={1}/>
          {/* vault alcove walls (bottom-left of dispense) */}
          <IWall x={1}  y={28} w={4} h={1}/>
          <Th    x={5}  y={28} w={2} h={1} tone="sterile" label="마약류 보관고"/>
          <IWall x={7}  y={28} w={6} h={1}/>
          <IWall x={12} y={29} w={1} h={12}/>

          {/* ════════════════ 수령 창구 · 기송관 허브 (y1-11) ════════════════ */}
          <BayLabel x={1} y={1} text="약품 수령 창구 · PICK-UP WINDOW"/>
          {/* white medication shelving packed behind the pickup counter */}
          <window.MedWallShelf x={1} y={1} w={11} shelves={3}/>
          {/* pick-up counter + glass barrier standing ON the desk */}
          <PharmaCounter x={1} y={4} w={11}/>
          <IGlass x={1} y={3} w={11} h={1} z={4}/>
          <CounterSign x={2} y={4} text="PICK-UP" color="#10B981"/>
          <CounterSign x={6} y={4} text="DROP-OFF" color="#FACC15"/>
          <window.BarcodeScanner x={9} y={4}/>
          <window.ReturnBox x={11} y={3}/>
          {/* window pharmacist (on phone) behind glass */}
          <INpc x={4} y={3} kind="doctor" hair="#1F2937"/>
          {/* ward nurse arguing about a missing med (in front) */}
          <INpc x={5} y={9} kind="nurse" hair="#7C3F00" shirt="#A5D8E8"/>
          <IHotspot x={4} y={6} kind="quest" label="누락 약 확인"/>
          <INpc x={8} y={9} kind="nurse" hair="#3C2A18" shirt="#A7F3D0"/>

          {/* pneumatic tube station (right of window) */}
          <BayLabel x={15} y={1} text="기송관 PNEUMATIC TUBE"/>
          <window.PneumaticTube x={16} y={3}/>
          <window.TubeCapsuleRack x={19} y={7}/>
          <INpc x={18} y={9} kind="nurse" hair="#5C3A1A" shirt="#A7F3D0"/>
          <IHotspot x={16} y={5} kind="info" label="캡슐 송수신"/>
          {/* a wall of medication shelving along the right of the hub */}
          <window.MedWallShelf x={26} y={1} w={8} shelves={4}/>
          <Fridge x={32} y={5}/>
          <IPlant x={33} y={9}/>

          {/* ════════════════ 일반 약품 조제실 (dispense, y13-40) ════════════════ */}
          <BayLabel x={1} y={13} text="MAIN DISPENSING"/>
          {/* automatic tablet dispenser (ATC) */}
          <window.ATCMachine x={2} y={16}/>
          {/* LASA high-alert shelf */}
          <window.LASAShelf x={8} y={15} w={3}/>
          {/* drug shelves with labels */}
          <ICabinet x={14} y={14} w={3} h={1} kind="pharma"/>
          <ICabinet x={17} y={14} w={3} h={1} kind="pharma"/>
          <ShelfLabel x={14} y={14} text="A · ANTIBIOTICS"/>
          <ShelfLabel x={17} y={14} text="B · CARDIAC"/>
          {/* central verify/double-check desk */}
          <IReception x={13} y={19} w={4} h={1} label="검수대 · DOUBLE-CHECK"/>
          <IMonitor x={18} y={19}/>
          <INpc x={14} y={22} kind="doctor" hair="#1F2937"/>
          <INpc x={16} y={22} kind="doctor" hair="#3C2A18"/>
          <IHotspot x={15} y={20} kind="quest" label="처방 더블체크"/>
          <MedCart x={9} y={23}/>
          <INpc x={9} y={25} kind="nurse" hair="#7C3F00" shirt="#FBCFE8"/>
          <ICabinet x={14} y={25} w={3} h={1} kind="pharma"/>
          <ICabinet x={17} y={25} w={3} h={1} kind="pharma"/>
          <ShelfLabel x={14} y={25} text="C · INSULIN"/>
          <ShelfLabel x={17} y={25} text="D · PRN"/>

          {/* NARCOTICS VAULT (deep corner) */}
          <BayLabel x={1} y={29} text="NARCOTICS VAULT"/>
          <window.NarcoticsVault x={2} y={32}/>
          <ChartBinder x={6} y={34}/>
          <INpc x={8} y={36} kind="doctor" hair="#1F2937"/>
          <IHotspot x={3} y={32} kind="info" label="마약류 관리 대장"/>

          {/* ════════════════ 무균 전실 (ante, y13-18) ════════════════ */}
          <BayLabel x={22} y={13} text="전실 · ANTEROOM"/>
          <window.SinkOR x={22} y={15}/>
          <GownBox x={26} y={14}/>
          <window.ScrubDispenser x={29} y={14}/>
          <window.TackyMat x={31} y={16} w={2}/>
          <HandSanitizer x={34} y={14}/>
          <IHotspot x={24} y={15} kind="info" label="방진복 · 에어샤워"/>

          {/* ════════════════ 무균 조제실 (cleanroom, y20-40) ════════════════ */}
          <BayLabel x={22} y={20} text="STERILE CLEANROOM · 항암/TPN"/>
          <window.BSC x={23} y={25}/>
          <window.BSC x={23} y={31}/>
          <window.MagnehelicGauge x={34} y={22}/>
          <window.ChemoSpillKit x={34} y={27}/>
          <INpc x={26} y={28} kind="surgeon" hair="#1F2937"/>
          <IHotspot x={25} y={25} kind="quest" label="항암제 믹스 (BSC)"/>
          <Centrifuge x={31} y={33}/>
          <PrintLabel x={28} y={36}/>
          <WallPhone x={34} y={32} ringing/>
          <IHotspot x={34} y={32} kind="urgent" label="STAT 콜"/>
          <FloorTape x={22} y={39} w={12} text="━━ STERILE LINE ━ NO STREET CLOTHES ━━"/>
        </>
      )}
    />
  );
}

// ─── Pharmacy-specific helpers ────────────────────────────────────
function PharmaCounter({ x, y, w }) {
  return (
    <div style={{
      position: 'absolute', left: x * ITILE, top: y * ITILE,
      width: w * ITILE, height: ITILE * 1.5,
      filter: 'drop-shadow(2px 3px 0 rgba(0,0,0,.18))',
    }}>
      {/* base — white clinical laminate */}
      <div style={{ position: 'absolute', inset: 0, background: '#D8D4C8', border: `2.5px solid ${IP.ink}` }}/>
      {/* counter top */}
      <div style={{ position: 'absolute', left: -1, right: -1, top: -3, height: 7, background: '#ECEAE1', border: `2px solid ${IP.ink}` }}/>
      {/* counter texture */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 6, bottom: 2,
        backgroundImage: `repeating-linear-gradient(90deg, ${IP.ink}22 0 1px, transparent 1px 8px)` }}/>
    </div>
  );
}

function CounterSign({ x, y, text, color }) {
  return (
    <div style={{ position: 'absolute', left: x * ITILE, top: y * ITILE - 14, zIndex: 3, animation: 'forinBob 1.4s ease-in-out infinite' }}>
      <div style={{
        background: color, color: IP.ink, border: `2px solid ${IP.ink}`,
        padding: '1px 5px', fontFamily: '"DungGeunMo",monospace', fontSize: 8,
        boxShadow: `2px 2px 0 0 ${IP.ink}`,
      }}>{text}</div>
      <div style={{ width: 2, height: 8, background: IP.ink, margin: '0 auto' }}/>
    </div>
  );
}

function Kiosk({ x, y }) {
  return (
    <div style={{ position: 'absolute', left: x * ITILE, top: y * ITILE, width: ITILE * 1.2, height: ITILE * 2, filter: 'drop-shadow(2px 3px 0 rgba(0,0,0,.2))' }}>
      <div style={{ position: 'absolute', inset: 0, background: '#94A3B8', border: `2px solid ${IP.ink}` }}/>
      {/* screen */}
      <div style={{ position: 'absolute', left: 2, right: 2, top: 2, height: 12, background: '#1F2937', border: `1.5px solid ${IP.ink}99` }}>
        <div style={{ position: 'absolute', left: 1, top: 1, fontFamily: '"DungGeunMo",monospace', fontSize: 5, color: '#10B981' }}>TAP ID</div>
        <div style={{ position: 'absolute', left: 2, right: 2, top: 6, height: 1.5, background: '#22D3EE' }}/>
        <div style={{ position: 'absolute', left: 2, right: 2, top: 9, height: 1.5, background: '#22D3EE' }}/>
      </div>
      {/* card slot */}
      <div style={{ position: 'absolute', left: 4, top: 17, right: 4, height: 2, background: IP.ink }}/>
      {/* printer slot */}
      <div style={{ position: 'absolute', left: 3, bottom: 4, right: 3, height: 3, background: '#fff', border: `1px solid ${IP.ink}` }}/>
    </div>
  );
}

function QueueRope({ x, y }) {
  return (
    <div style={{ position: 'absolute', left: x * ITILE, top: y * ITILE, width: ITILE * 2, height: 6, pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 3, height: 4, background: '#1F2937'}}/>
      <div style={{ position: 'absolute', right: 0, top: 0, width: 3, height: 4, background: '#1F2937'}}/>
      <div style={{ position: 'absolute', left: 3, right: 3, top: 1, height: 2, background: '#9CA3AF', border: `0.5px solid ${IP.ink}` }}/>
    </div>
  );
}

function ShelfLabel({ x, y, text, warn }) {
  return (
    <div style={{
      position: 'absolute', left: x * ITILE + 2, top: y * ITILE - 9, zIndex: 4,
      background: warn ? '#DC2626' : '#1F2937',
      color: warn ? '#fff' : '#FACC15',
      border: `1.5px solid ${IP.ink}`,
      padding: '0 4px', fontFamily: '"DungGeunMo",monospace', fontSize: 6,
      boxShadow: `1px 1px 0 0 ${IP.ink}`,
    }}>{text}</div>
  );
}

function CountingBench({ x, y }) {
  return (
    <div style={{ position: 'absolute', left: x * ITILE, top: y * ITILE, width: ITILE * 4, height: ITILE * 1.4, filter: 'drop-shadow(2px 2px 0 rgba(0,0,0,.18))' }}>
      <div style={{ position: 'absolute', inset: 0, background: '#E5E7EB', border: `2px solid ${IP.ink}` }}/>
      {/* pill tray */}
      <div style={{ position: 'absolute', left: 2, top: 3, width: 12, height: 8, background: '#fff', border: `1.5px solid ${IP.ink}` }}>
        {/* pills */}
        {[2,5,8].map(px => <div key={px} style={{ position: 'absolute', left: px, top: 2, width: 2, height: 2, background: '#FACC15' }}/>)}
        {[2,5,8].map(px => <div key={px} style={{ position: 'absolute', left: px, top: 5, width: 2, height: 2, background: '#A7F3D0' }}/>)}
      </div>
      {/* counting spatula */}
      <div style={{ position: 'absolute', right: 10, top: 7, width: 12, height: 1, background: '#4B5563', transform: 'rotate(-15deg)' }}/>
      {/* bottle */}
      <div style={{ position: 'absolute', right: 4, top: 2, width: 8, height: 12, background: '#F87171', border: `1.5px solid ${IP.ink}` }}>
        <div style={{ position: 'absolute', left: 2, top: -2, right: 2, height: 3, background: '#fff', border: `1px solid ${IP.ink}` }}/>
      </div>
    </div>
  );
}

function Fridge({ x, y }) {
  return (
    <div style={{ position: 'absolute', left: x * ITILE, top: y * ITILE, width: ITILE * 1.2, height: ITILE * 1.4, filter: 'drop-shadow(2px 3px 0 rgba(0,0,0,.2))' }}>
      <div style={{ position: 'absolute', inset: 0, background: '#BAE6FD', border: `2px solid ${IP.ink}` }}/>
      <div style={{ position: 'absolute', left: 1, right: 1, top: '38%', height: 1.5, background: IP.ink }}/>
      <div style={{ position: 'absolute', right: 2, top: 4, width: 1.5, height: 6, background: IP.metalDk }}/>
      <div style={{ position: 'absolute', right: 2, bottom: 4, width: 1.5, height: 6, background: IP.metalDk }}/>
    </div>
  );
}

function CSSafe({ x, y }) {
  return (
    <div style={{ position: 'absolute', left: x * ITILE, top: y * ITILE, width: ITILE * 1.6, height: ITILE * 1.6, filter: 'drop-shadow(2px 3px 0 rgba(0,0,0,.22))' }}>
      <div style={{ position: 'absolute', inset: 0, background: '#4B5563', border: `2.5px solid ${IP.ink}` }}/>
      {/* keypad */}
      <div style={{ position: 'absolute', right: 3, top: 4, width: 8, height: 12, background: '#1F2937', border: `1.5px solid ${IP.ink}99` }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1, padding: 1 }}>
          {Array.from({ length: 9 }).map((_, i) => <div key={i} style={{ height: 2, background: '#374151' }}/>)}
        </div>
      </div>
      {/* lock */}
      <div style={{ position: 'absolute', left: 4, top: 8, width: 5, height: 5, background: '#FACC15', border: `1.5px solid ${IP.ink}`, borderRadius: '50%' }}/>
      <div style={{ position: 'absolute', left: 2, top: 22, fontFamily: '"DungGeunMo",monospace', fontSize: 5, color: '#fff' }}>CTRL</div>
    </div>
  );
}

function MedCart({ x, y }) {
  return (
    <div style={{ position: 'absolute', left: x * ITILE, top: y * ITILE, width: ITILE * 1.4, height: ITILE * 1.4, filter: 'drop-shadow(2px 3px 0 rgba(0,0,0,.18))' }}>
      <div style={{ position: 'absolute', inset: 0, background: '#9CA3AF', border: `2px solid ${IP.ink}` }}/>
      {/* drawers */}
      <div style={{ position: 'absolute', left: 2, right: 2, top: 2, height: 4, background: '#fff', border: `1px solid ${IP.ink}` }}/>
      <div style={{ position: 'absolute', left: 2, right: 2, top: 8, height: 4, background: '#fff', border: `1px solid ${IP.ink}` }}/>
      <div style={{ position: 'absolute', left: 2, right: 2, top: 14, height: 4, background: '#fff', border: `1px solid ${IP.ink}` }}/>
      {/* labels */}
      <div style={{ position: 'absolute', left: 8, top: 3, fontFamily: '"DungGeunMo",monospace', fontSize: 4, color: IP.ink }}>AM</div>
      <div style={{ position: 'absolute', left: 8, top: 9, fontFamily: '"DungGeunMo",monospace', fontSize: 4, color: IP.ink }}>PM</div>
      <div style={{ position: 'absolute', left: 8, top: 15, fontFamily: '"DungGeunMo",monospace', fontSize: 4, color: IP.ink }}>HS</div>
    </div>
  );
}

function LaminarHood({ x, y }) {
  return (
    <div style={{ position: 'absolute', left: x * ITILE, top: y * ITILE, width: ITILE * 3, height: ITILE * 1.8, filter: 'drop-shadow(2px 3px 0 rgba(0,0,0,.18))' }}>
      {/* outer frame */}
      <div style={{ position: 'absolute', inset: 0, background: '#94A3B8', border: `2.5px solid ${IP.ink}` }}/>
      {/* top sash glass */}
      <div style={{ position: 'absolute', left: 2, right: 2, top: 2, height: 14, background: '#D6E4EC', border: `1.5px solid ${IP.ink}99` }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `repeating-linear-gradient(0deg, rgba(255,255,255,.5) 0 1px, transparent 1px 3px)` }}/>
        {/* HEPA arrow */}
        <div style={{ position: 'absolute', left: 2, top: 1, fontFamily: '"DungGeunMo",monospace', fontSize: 5, color: '#0F1A24' }}>↓ HEPA</div>
      </div>
      {/* work surface — supplies */}
      <div style={{ position: 'absolute', left: 2, right: 2, bottom: 2, top: 18, background: '#fff', border: `1.5px solid ${IP.ink}99` }}>
        {/* syringes */}
        <div style={{ position: 'absolute', left: 2, top: 1, width: 12, height: 1.5, background: '#4B5563' }}/>
        <div style={{ position: 'absolute', left: 2, top: 5, width: 8, height: 1.5, background: '#4B5563' }}/>
        {/* vial */}
        <div style={{ position: 'absolute', right: 2, top: 1, width: 5, height: 6, background: '#A5B4FC', border: `1px solid ${IP.ink}77` }}/>
      </div>
    </div>
  );
}

function Centrifuge({ x, y }) {
  return (
    <div style={{ position: 'absolute', left: x * ITILE, top: y * ITILE, width: ITILE * 1.4, height: ITILE * 1.4, filter: 'drop-shadow(2px 2px 0 rgba(0,0,0,.18))' }}>
      <div style={{ position: 'absolute', inset: 0, background: '#D1D5DB', border: `2px solid ${IP.ink}` }}/>
      <div style={{ position: 'absolute', left: 3, right: 3, top: 3, bottom: 7, background: '#1F2937', border: `1.5px solid ${IP.ink}99`, borderRadius: '50%' }}>
        <div style={{ position: 'absolute', inset: 2, background: '#475569', borderRadius: '50%', animation: 'forinSpin 0.8s linear infinite' }}/>
      </div>
      <div style={{ position: 'absolute', left: 3, bottom: 2, fontFamily: '"DungGeunMo",monospace', fontSize: 5, color: IP.ink }}>SPIN</div>
      <style>{`@keyframes forinSpin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function PrintLabel({ x, y }) {
  return (
    <div style={{ position: 'absolute', left: x * ITILE, top: y * ITILE, width: ITILE * 1.6, height: ITILE * 1.2, filter: 'drop-shadow(2px 2px 0 rgba(0,0,0,.18))' }}>
      <div style={{ position: 'absolute', inset: 0, background: '#E5E7EB', border: `2px solid ${IP.ink}` }}/>
      {/* paper coming out */}
      <div style={{ position: 'absolute', left: 4, bottom: -3, right: 4, height: 7, background: '#fff', border: `1.5px solid ${IP.ink}` }}>
        <div style={{ position: 'absolute', left: 2, top: 1, height: 1, width: 8, background: IP.ink + '88' }}/>
        <div style={{ position: 'absolute', left: 2, top: 3, height: 1, width: 6, background: IP.ink + '66' }}/>
      </div>
      {/* button */}
      <div style={{ position: 'absolute', right: 3, top: 3, width: 3, height: 3, background: '#10B981', border: `1px solid ${IP.ink}` }}/>
    </div>
  );
}

function WallPhone({ x, y, ringing }) {
  return (
    <div style={{ position: 'absolute', left: x * ITILE, top: y * ITILE, width: ITILE, height: ITILE * 1.4, animation: ringing ? 'forinShake 0.3s ease-in-out infinite' : 'none' }}>
      <div style={{ position: 'absolute', inset: 0, background: '#374151', border: `2px solid ${IP.ink}` }}/>
      <div style={{ position: 'absolute', left: 1, right: 1, top: 2, height: 5, background: '#1F2937', border: `1px solid ${IP.ink}88` }}/>
      <div style={{ position: 'absolute', left: 2, top: 9, width: 12, height: 8, background: '#6B7280', border: `1px solid ${IP.ink}88` }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 0.5, padding: 1 }}>
          {Array.from({ length: 9 }).map((_, i) => <div key={i} style={{ height: 1.2, background: '#1F2937' }}/>)}
        </div>
      </div>
      {ringing && (
        <>
          <div style={{ position: 'absolute', top: -6, left: -4, fontFamily: '"DungGeunMo",monospace', fontSize: 8, color: '#EF4444', animation: 'forinBlink .5s steps(2,end) infinite' }}>♪</div>
          <div style={{ position: 'absolute', top: -6, right: -4, fontFamily: '"DungGeunMo",monospace', fontSize: 8, color: '#EF4444', animation: 'forinBlink .5s steps(2,end) infinite', animationDelay: '0.25s' }}>♫</div>
        </>
      )}
      <style>{`@keyframes forinShake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-1px)} 75%{transform:translateX(1px)} }`}</style>
    </div>
  );
}

function FloorTape({ x, y, w, text }) {
  return (
    <div style={{
      position: 'absolute', left: x * ITILE, top: y * ITILE,
      width: w * ITILE, height: 12,
      background: '#FACC15', border: `2px solid ${IP.ink}`,
      backgroundImage: `repeating-linear-gradient(45deg, ${IP.ink} 0 4px, transparent 4px 10px)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: '"DungGeunMo",monospace', fontSize: 7, color: IP.ink, letterSpacing: 1,
    }}>
      <span style={{ background: '#FACC15', padding: '0 4px' }}>{text}</span>
    </div>
  );
}

Object.assign(window, {
  ScreenInteriorPharma,
  PharmaCounter, CounterSign, Kiosk, QueueRope, ShelfLabel,
  CountingBench, CSSafe, MedCart, LaminarHood, Centrifuge,
  PrintLabel, WallPhone, FloorTape,
  FridgePharma: Fridge,
});
