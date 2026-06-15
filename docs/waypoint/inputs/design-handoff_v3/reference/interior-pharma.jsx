// interior-pharma.jsx — Pharmacy. Counter at front, drug shelves, IV admixture
// clean room, prescription queue. Pharmacist + tech NPCs.

function ScreenInteriorPharma() {
  const COLS = 22, ROWS = 26;

  const regions = [
    { id: 'dispense', name: '디스펜싱',        icon: '💊', bounds: { x: 0, y: 0, w: 11, h: 8 } },
    { id: 'compound', name: 'Compounding',     icon: '⚗', bounds: { x: 10, y: 0, w: 12, h: 8 } },
    { id: 'cleanroom', name: 'IV 무균실',      icon: '🧪', bounds: { x: 0, y: 8, w: 22, h: 8 } },
    { id: 'pickup',   name: '픽업 카운터',     icon: '🏪', bounds: { x: 0, y: 15, w: 16, h: 11 } },
    { id: 'kiosk',    name: '자가 키오스크',   icon: '📺', bounds: { x: 15, y: 15, w: 7, h: 11 } },
  ];

  const rooms = [
    { id: 'pickup',   name: '픽업 카운터', sub: '처방전 수령', icon: '🏪', color: '#A7F3D0', x: 7, y: 19, questCount: 1 },
    { id: 'consult',  name: '복약 상담', sub: 'Pharm consult', icon: '💬', color: '#BAE6FD', x: 11, y: 19, questCount: 1 },
    { id: 'kiosk',    name: '자가 키오스크', sub: 'Quick pickup', icon: '📺', color: '#FEF08A', x: 17, y: 19 },
    { id: 'queue',    name: '대기 줄', sub: '환자·간호사 대기', icon: '🚶', color: '#FED7AA', x: 4, y: 23 },
    { id: 'dispense', name: '디스펜싱 (back)', sub: '약 조제', icon: '💊', color: '#FBCFE8', x: 5, y: 5, questCount: 1 },
    { id: 'compound', name: 'Compounding', sub: '알약 카운팅', icon: '⚗', color: '#DDD6FE', x: 13, y: 5, questCount: 1 },
    { id: 'fridge',   name: '냉장 보관소', sub: '백신·인슐린', icon: '❄️', color: '#BAE6FD', x: 17, y: 4 },
    { id: 'cleanroom', name: 'IV 무균실', sub: 'USP 797', icon: '🧪', color: '#A7F3D0', x: 7, y: 13, questCount: 2, locked: false },
    { id: 'safe',     name: '통제약물 금고', sub: '마약·향정', icon: '🔒', color: '#FCA5A5', x: 19, y: 6, locked: true },
  ];

  return (
    <InteriorScreen
      label="06e Interior · PHARMA" deptCode="약국 Pharmacy · 1F" deptColor="#16A34A"
      cols={COLS} rows={ROWS} floor="pharma"
      playerStart={{ x: 11, y: 16 }}
      rooms={rooms}
      regions={regions}
      missionText="Dr. Patel의 헤파린 처방 픽업하고 더블체크"
      render={() => (
        <>
          {/* OUTER WALLS */}
          <IWall x={0} y={0} w={22} h={1}/>
          <IWall x={0} y={1} w={1} h={24}/>
          <IWall x={21} y={1} w={1} h={24}/>
          <IWall x={0} y={25} w={9} h={1}/>
          <IDoor x={9} y={25} w={2} h={1} kind="auto" label="↑ 캠퍼스로"/>
          <IWall x={11} y={25} w={11} h={1}/>

          {/* y=8 — divider between public pickup area and back staff area */}
          <IWall x={1}  y={8} w={6} h={1}/>
          <IDoor x={7}  y={8} w={1} h={1} kind="wood" label="STAFF ONLY"/>
          <IWall x={8}  y={8} w={6} h={1}/>
          <IDoor x={14} y={8} w={1} h={1} kind="wood"/>
          <IWall x={15} y={8} w={6} h={1}/>

          {/* ─── PUBLIC PICKUP AREA (y 16-24) ─── */}
          <BayLabel x={1} y={16} text="PRESCRIPTION PICKUP"/>
          {/* Long counter spanning much of width */}
          <PharmaCounter x={1} y={17} w={14}/>
          {/* counter signs */}
          <CounterSign x={2}  y={17} text="DROP-OFF" color="#FACC15"/>
          <CounterSign x={6}  y={17} text="PICKUP"  color="#10B981"/>
          <CounterSign x={10} y={17} text="CONSULT" color="#3B82F6"/>

          {/* pharmacy techs behind counter */}
          <INpc x={3}  y={18.5} kind="nurse" hair="#3C2A18" shirt="#A7F3D0"/>
          <INpc x={7}  y={18.5} kind="nurse" hair="#5C3A1A" shirt="#A7F3D0"/>
          <IHotspot x={7} y={18} kind="quest" label="처방 픽업"/>
          <INpc x={11} y={18.5} kind="doctor" hair="#1F2937"/>
          <IHotspot x={11} y={18} kind="info" label="복약 상담"/>

          {/* waiting line — nurses + patients */}
          {/* Queue rope */}
          <QueueRope x={2}  y={21}/>
          <QueueRope x={2}  y={23}/>
          <QueueRope x={6}  y={21}/>
          <QueueRope x={6}  y={23}/>

          {/* waiting customers */}
          <INpc x={3} y={20.5} kind="nurse" hair="#7C3F00" shirt="#A5D8E8"/>
          <INpc x={3} y={22} kind="patient" hair="#9A6B3F"/>
          <INpc x={3} y={23.5} kind="parent" hair="#3C2A18"/>
          <INpc x={4.5} y={23.5} kind="child" hair="#3C2A18"/>
          <INpc x={7} y={20.5} kind="visitor" hair="#5C3A1A"/>
          <INpc x={11} y={20.5} kind="patient" hair="#9A6B3F"/>
          <IHotspot x={11} y={20} kind="info" label="복약법 설명"/>

          {/* Self-service kiosk on right */}
          <BayLabel x={16} y={16} text="QUICK PICKUP"/>
          <Kiosk x={16} y={17}/>
          <Kiosk x={18} y={17}/>
          <INpc x={16.5} y={20} kind="patient" hair="#7C3F00"/>
          <INpc x={19} y={20} kind="visitor" hair="#3C2A18"/>

          {/* Waiting bench */}
          <IChair x={16} y={22} color="#FED7AA" facing="down"/>
          <IChair x={17} y={22} color="#FED7AA" facing="down"/>
          <IChair x={18} y={22} color="#FED7AA" facing="down"/>
          <IChair x={19} y={22} color="#FED7AA" facing="down"/>
          <INpc x={17} y={22.5} kind="patient" hair="#9A6B3F"/>
          <INpc x={19} y={22.5} kind="parent" hair="#5C3A1A"/>

          {/* ─── BACK / STAFF AREA (y 1-7) ─── */}
          <BayLabel x={1} y={1} text="DISPENSING"/>

          {/* Wall of drug shelves — top wall, cols 1-20 */}
          <ICabinet x={1}  y={1} w={3} h={1} kind="pharma"/>
          <ICabinet x={4}  y={1} w={3} h={1} kind="pharma"/>
          <ICabinet x={7}  y={1} w={3} h={1} kind="pharma"/>
          <ICabinet x={10} y={1} w={3} h={1} kind="pharma"/>
          <ICabinet x={13} y={1} w={3} h={1} kind="pharma"/>
          <ICabinet x={16} y={1} w={4} h={1} kind="pharma"/>

          {/* second row of shelves */}
          <ICabinet x={1}  y={3} w={3} h={1} kind="pharma"/>
          <ICabinet x={4}  y={3} w={3} h={1} kind="pharma"/>
          <ICabinet x={7}  y={3} w={3} h={1} kind="pharma"/>
          {/* shelf labels (high-alert reds) */}
          <ShelfLabel x={1}  y={3} text="A · ANTIBIOTICS"/>
          <ShelfLabel x={4}  y={3} text="B · CARDIAC"/>
          <ShelfLabel x={7}  y={3} text="C · INSULIN"/>

          {/* Compounding bench in middle */}
          <BayLabel x={11} y={3} text="COMPOUNDING"/>
          <CountingBench x={11} y={4}/>
          <INpc x={12} y={5.5} kind="doctor" hair="#3C2A18"/>
          <IHotspot x={12} y={5} kind="quest" label="알약 카운팅"/>

          {/* Refrigerator and freezer */}
          <Fridge x={16} y={3}/>
          <Fridge x={18} y={3}/>
          <ShelfLabel x={16} y={3} text="REFRIGERATED"/>

          {/* Storage on left bottom of staff area */}
          <ICabinet x={1} y={5} w={3} h={1} kind="pharma"/>
          <ICabinet x={4} y={5} w={3} h={1} kind="pharma"/>
          <ICabinet x={7} y={5} w={3} h={1} kind="pharma"/>
          <ShelfLabel x={1}  y={5} text="D · PRN"/>
          <ShelfLabel x={4}  y={5} text="E · TOPICAL"/>
          <ShelfLabel x={7}  y={5} text="F · CONTROLLED" warn/>

          {/* controlled-substances safe in corner */}
          <CSSafe x={19} y={5}/>

          {/* Pharmacist verifying script */}
          <INpc x={5} y={6.5} kind="doctor" hair="#1F2937"/>
          <IHotspot x={5} y={6} kind="info" label="처방 검토"/>
          {/* Tech moving carts */}
          <INpc x={8} y={6.5} kind="nurse" hair="#7C3F00" shirt="#FBCFE8"/>

          {/* Med cart in transit */}
          <MedCart x={9} y={6}/>

          {/* ─── IV ADMIXTURE / CLEAN ROOM (y 9-15) ─── */}
          {/* Glass partition separating clean room */}
          <IGlass x={1}  y={9} w={20} h={1}/>
          {/* Inside clean room — sealed area */}
          <BayLabel x={2} y={10} text="IV ADMIXTURE CLEAN ROOM (USP 797)" highlight/>
          {/* Laminar flow hoods */}
          <LaminarHood x={2}  y={11}/>
          <LaminarHood x={6}  y={11}/>
          <LaminarHood x={10} y={11}/>

          {/* Gowned techs */}
          <INpc x={3.5} y={13} kind="surgeon" hair="#1F2937"/>
          <IHotspot x={3.5} y={12.5} kind="quest" label="IV 혼합"/>
          <INpc x={7.5} y={13} kind="surgeon" hair="#3C2A18"/>

          {/* Counter / batch prep */}
          <PharmaCounter x={14} y={11} w={6}/>
          <Centrifuge x={14} y={13}/>
          <PrintLabel x={17} y={13}/>

          {/* Phone on wall — incoming call */}
          <WallPhone x={20} y={11} ringing/>
          <IHotspot x={20} y={11} kind="urgent" label="STAT 콜"/>

          {/* Floor markings */}
          <FloorTape x={1} y={15} w={20} text="━━ STERILE LINE ━ NO STREET CLOTHES ━━"/>
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
      {/* base */}
      <div style={{ position: 'absolute', inset: 0, background: '#A88862', border: `2.5px solid ${IP.ink}` }}/>
      {/* counter top */}
      <div style={{ position: 'absolute', left: -1, right: -1, top: -3, height: 7, background: '#C49D6C', border: `2px solid ${IP.ink}` }}/>
      {/* counter texture */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 6, bottom: 2,
        backgroundImage: `repeating-linear-gradient(90deg, ${IP.ink}33 0 1px, transparent 1px 8px)` }}/>
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
