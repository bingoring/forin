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
      position: 'absolute', left: x * ITILE, top: y * ITILE - 4,
      width: w * ITILE, height: ITILE * 1.7,
    }}>
      <svg viewBox={`0 0 ${w * 16} 28`} width={w * ITILE} height={ITILE * 1.7} shapeRendering="geometricPrecision" preserveAspectRatio="none">
        {/* TOP work-surface (dominant) folding straight into a continuous front */}
        <path d={`M1 12 L${w*16-1} 12 L${w*16-1} 24 Q${w*16-1} 25 ${w*16-2} 25 L2 25 Q1 25 1 24 Z`} fill="#C6C2B6" stroke={IP.ink} strokeWidth=".7"/>
        <rect x="1" y="1" width={w*16-2} height="11" fill="#ECEAE1" stroke={IP.ink} strokeWidth=".7"/>
        <rect x="2.5" y="2.4" width={w*16-5} height="1.6" fill="#F7F5EE"/>{/* back-edge highlight */}
        <line x1="1" y1="12" x2={w*16-1} y2="12" stroke={IP.ink} strokeWidth=".55"/>{/* top↔front seam */}
        {/* laminate seams on the front band */}
        <g opacity=".18">
          {Array.from({length: Math.max(1, Math.round(w*16/8))}).map((_,i)=>(
            <line key={i} x1={4+i*8} y1="13" x2={4+i*8} y2="24" stroke={IP.ink} strokeWidth="1"/>
          ))}
        </g>
        {/* kick base shadow */}
        <rect x="2" y="23.5" width={w*16-4} height="1.5" fill={IP.ink} opacity=".22"/>
      </svg>
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
    <div style={{ position: 'absolute', left: x * ITILE, top: y * ITILE - 4, width: ITILE * 1.3, height: ITILE * 2 }}>
      <svg viewBox="0 0 22 34" width={ITILE * 1.3} height={ITILE * 2} shapeRendering="geometricPrecision">
          <ellipse cx="11.0" cy="32.4" rx="7.5" ry="2.6" fill="rgba(0,0,0,.16)"/>
        {/* rectangular TOP face (dominant) folding straight into a continuous front */}
        <path d="M2 8 L20 8 L20 30 Q20 31 19 31 L3 31 Q2 31 2 30 Z" fill="#9BA2AB" stroke={IP.ink} strokeWidth=".7"/>
        <rect x="2" y="1" width="18" height="7" rx="1.2" fill="#B4BAC2" stroke={IP.ink} strokeWidth=".7"/>{/* flat cabinet top */}
        <rect x="3.5" y="2.3" width="15" height="1.4" fill="#C7CDD4"/>{/* back-edge highlight */}
        <line x1="2" y1="8" x2="20" y2="8" stroke={IP.ink} strokeWidth=".55"/>{/* top↔front seam */}
        {/* viewer-facing touchscreen on the front */}
        <rect x="4" y="10.5" width="14" height="9.5" rx=".8" fill="#1F2937" stroke={IP.ink} strokeWidth=".6"/>
        <rect x="5.2" y="11.7" width="11.6" height="7.1" rx=".5" fill="#0B1A22"/>
        <text x="11" y="14.4" fontSize="2.3" fill="#10B981" textAnchor="middle" fontFamily="monospace">TAP ID</text>
        <rect x="7" y="15.6" width="8" height="1.1" fill="#22D3EE"/>
        {/* card slot + printer slot on the front band */}
        <rect x="5" y="22" width="12" height="1.8" rx=".6" fill="#2C3239"/>
        <rect x="5" y="25.5" width="12" height="3" rx=".6" fill="#fff" stroke={IP.ink} strokeWidth=".4"/>
        <rect x="6" y="27.6" width="10" height="1" fill="#E1E5EA"/>
      </svg>
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
    <div style={{ position: 'absolute', left: x * ITILE, top: y * ITILE - 3, width: ITILE * 4, height: ITILE * 1.7 }}>
      <svg viewBox="0 0 64 28" width={ITILE * 4} height={ITILE * 1.7} shapeRendering="geometricPrecision" preserveAspectRatio="none">
          <ellipse cx="32.0" cy="21.6" rx="21.8" ry="7.4" fill="rgba(0,0,0,.16)"/>
        {/* TOP work-surface (dominant) */}
        <rect x="1" y="1" width="62" height="20" rx="2" fill="#E8E5DB" stroke={IP.ink} strokeWidth=".7"/>
        <rect x="3" y="2.5" width="58" height="1.6" fill="#F2F0E8"/>
        {/* triangular counting tray with pills */}
        <path d="M6 6 L26 6 L20 17 L6 17 Z" fill="#FFFFFF" stroke={IP.ink} strokeWidth=".5"/>
        {[9,13,17].map((px,i)=><circle key={i} cx={px} cy="9" r="1.3" fill="#FACC15" stroke={IP.ink} strokeWidth=".2"/>)}
        {[10,14].map((px,i)=><circle key={'b'+i} cx={px} cy="12" r="1.3" fill="#A7F3D0" stroke={IP.ink} strokeWidth=".2"/>)}
        {/* counting spatula */}
        <rect x="22" y="9" width="12" height="1.6" rx=".6" fill="#64748B" transform="rotate(-12 22 9)"/>
        {/* amber stock bottle (top view: ring + cap) */}
        <ellipse cx="44" cy="11" rx="5" ry="4.4" fill="#B45309" stroke={IP.ink} strokeWidth=".5"/>
        <ellipse cx="44" cy="10.4" rx="2.6" ry="2.2" fill="#D97706"/>
        {/* label printer */}
        <rect x="52" y="6" width="9" height="9" rx="1" fill="#CBD5E1" stroke={IP.ink} strokeWidth=".5"/>
        <rect x="53.5" y="13" width="6" height="1.6" fill="#fff" stroke={IP.ink} strokeWidth=".3"/>
        {/* FRONT band */}
        <rect x="1" y="21" width="62" height="4" fill="#C6C2B6" stroke={IP.ink} strokeWidth=".6"/>
      </svg>
    </div>
  );
}

function Fridge({ x, y }) {
  return (
    <div style={{ position: 'absolute', left: x * ITILE, top: y * ITILE - 4, width: ITILE * 1.3, height: ITILE * 1.6 }}>
      <svg viewBox="0 0 22 30" width={ITILE * 1.3} height={ITILE * 1.85} shapeRendering="geometricPrecision">
          <ellipse cx="11.0" cy="28.4" rx="7.5" ry="2.6" fill="rgba(0,0,0,.16)"/>
        {/* TOP face — plain appliance lid (dominant) folding into a continuous front */}
        <path d="M2 9 L20 9 L20 26 Q20 27 19 27 L3 27 Q2 27 2 26 Z" fill="#A7CFE0" stroke={IP.ink} strokeWidth=".7"/>
        <rect x="2" y="1" width="18" height="8" rx="2" fill="#CBE8F5" stroke={IP.ink} strokeWidth=".7"/>
        <rect x="3.5" y="2.5" width="15" height="1.5" fill="#E4F3FA"/>
        <line x1="2" y1="9" x2="20" y2="9" stroke={IP.ink} strokeWidth=".5"/>{/* lid↔door seam */}
        {/* viewer-facing glass door with shelved vials */}
        <rect x="4" y="10.5" width="14" height="12" rx="1" fill="#9FD0E4" stroke={IP.ink} strokeWidth=".5"/>
        <rect x="4.5" y="13.5" width="13" height=".9" fill="#7FB8D8"/>
        <rect x="4.5" y="17.5" width="13" height=".9" fill="#7FB8D8"/>
        {[5.2,8,10.8,13.6].map((vx,i)=><rect key={i} x={vx} y="11" width="1.7" height="2.2" fill="#FEFCF2" stroke={IP.ink} strokeWidth=".2"/>)}
        {[5.2,8,10.8,13.6].map((vx,i)=><rect key={'b'+i} x={vx} y="14.8" width="1.7" height="2.2" fill="#DFF0E4" stroke={IP.ink} strokeWidth=".2"/>)}
        {[5.2,8,10.8,13.6].map((vx,i)=><rect key={'c'+i} x={vx} y="18.8" width="1.7" height="2.2" fill="#F4D29A" stroke={IP.ink} strokeWidth=".2"/>)}
        {/* door handle + temp readout on the front */}
        <rect x="17" y="13" width="1.2" height="7" rx=".4" fill="#6E9DB5"/>
        <rect x="5" y="23.5" width="5.2" height="2.2" rx=".4" fill="#0B2A3A"/>
        <text x="7.6" y="25.3" fontSize="1.9" fill="#22D3EE" textAnchor="middle" fontFamily="monospace">4°</text>
        {/* casters */}
        <ellipse cx="5" cy="28" rx="1.6" ry="1.2" fill="#2C3239"/>
        <ellipse cx="17" cy="28" rx="1.6" ry="1.2" fill="#2C3239"/>
      </svg>
    </div>
  );
}

function CSSafe({ x, y }) {
  return (
    <div style={{ position: 'absolute', left: x * ITILE, top: y * ITILE - 3, width: ITILE * 1.7, height: ITILE * 1.6 }}>
      <svg viewBox="0 0 28 28" width={ITILE * 1.7} height={ITILE * 1.72} shapeRendering="geometricPrecision">
          <ellipse cx="14.0" cy="25.8" rx="9.5" ry="3.2" fill="rgba(0,0,0,.16)"/>
        {/* TOP face — plain steel lid (dominant) folding into a continuous front */}
        <path d="M2 9 L26 9 L26 25 Q26 26 25 26 L3 26 Q2 26 2 25 Z" fill="#4E5865" stroke={IP.ink} strokeWidth=".8"/>
        <rect x="2" y="1" width="24" height="8" rx="1.5" fill="#5B6672" stroke={IP.ink} strokeWidth=".8"/>
        <rect x="3.5" y="2.4" width="21" height="1.6" fill="#727E8C"/>
        <line x1="2" y1="9" x2="26" y2="9" stroke={IP.ink} strokeWidth=".55"/>{/* lid↔door seam */}
        {/* viewer-facing door with CONTROLLED banner, keypad, dial, handle */}
        <rect x="4" y="10.5" width="20" height="12" rx="1" fill="#525C68" stroke={IP.ink} strokeWidth=".5"/>
        <rect x="4" y="10.5" width="20" height="1.6" fill="#DC2626"/>
        {/* keypad */}
        <rect x="15.5" y="13" width="7" height="8" rx=".6" fill="#0F1A24"/>
        {Array.from({length:9}).map((_,i)=><rect key={i} x={16.3+(i%3)*2.1} y={13.8+Math.floor(i/3)*2.2} width="1.6" height="1.6" rx=".3" fill="#2B3542"/>)}
        {/* combination dial */}
        <circle cx="9" cy="16.5" r="3.2" fill="#1F2937" stroke={IP.ink} strokeWidth=".6"/>
        <circle cx="9" cy="16.5" r="1.1" fill="#FACC15"/>
        <line x1="9" y1="16.5" x2="9" y2="13.6" stroke="#FACC15" strokeWidth=".5"/>
        {/* latch handle */}
        <rect x="12.5" y="20.5" width="3" height="4" rx=".8" fill="#2C3239" stroke={IP.ink} strokeWidth=".4"/>
      </svg>
    </div>
  );
}

function MedCart({ x, y }) {
  return (
    <div style={{ position: 'absolute', left: x * ITILE, top: y * ITILE - 3, width: ITILE * 1.5, height: ITILE * 1.6 }}>
      <svg viewBox="0 0 24 28" width={ITILE * 1.5} height={ITILE * 1.72} shapeRendering="geometricPrecision">
          <ellipse cx="12.0" cy="26.2" rx="8.2" ry="2.8" fill="rgba(0,0,0,.16)"/>
        {/* TOP worktop face (dominant) folding into a continuous front */}
        <path d="M2 9 L22 9 L22 25 Q22 26 21 26 L3 26 Q2 26 2 25 Z" fill="#9BA2AB" stroke={IP.ink} strokeWidth=".7"/>
        <rect x="2" y="1" width="20" height="8" rx="1.5" fill="#B7BEC6" stroke={IP.ink} strokeWidth=".7"/>
        <rect x="3.5" y="2.4" width="17" height="1.4" fill="#D2D7DD"/>
        {/* a small sharps/tray sitting on the worktop */}
        <rect x="12" y="3.4" width="7" height="4" rx=".6" fill="#FEF3C7" stroke={IP.ink} strokeWidth=".4"/>
        <line x1="2" y1="9" x2="22" y2="9" stroke={IP.ink} strokeWidth=".5"/>{/* worktop↔front seam */}
        {/* viewer-facing drawer stack with color-coded tabs */}
        {[['#F87171','AM',10.5],['#FBBF24','PM',14],['#A7F3D0','HS',17.5]].map(([c,t,ty],i)=>(
          <g key={i}>
            <rect x="4" y={ty} width="16" height="3" rx=".5" fill="#E1E5EA" stroke={IP.ink} strokeWidth=".4"/>
            <rect x="4" y={ty} width="2.4" height="3" fill={c}/>
            <rect x="14.5" y={ty+1} width="3.5" height="1" rx=".4" fill="#9AA1A8"/>{/* pull */}
            <text x="10" y={ty+2.2} fontSize="1.8" fill="#475569" textAnchor="middle" fontFamily="monospace">{t}</text>
          </g>
        ))}
        {/* casters */}
        <ellipse cx="5" cy="27" rx="1.6" ry="1.2" fill="#2C3239"/>
        <ellipse cx="19" cy="27" rx="1.6" ry="1.2" fill="#2C3239"/>
      </svg>
    </div>
  );
}

function LaminarHood({ x, y }) {
  return (
    <div style={{ position: 'absolute', left: x * ITILE, top: y * ITILE - 4, width: ITILE * 3, height: ITILE * 2 }}>
      <svg viewBox="0 0 48 32" width={ITILE * 3} height={ITILE * 2} shapeRendering="geometricPrecision">
          <ellipse cx="24.0" cy="27.5" rx="16.3" ry="5.5" fill="rgba(0,0,0,.16)"/>
        {/* TOP HEPA plenum (dominant) folding into a continuous front cabinet */}
        <path d="M2 11 L46 11 L46 27 Q46 28.5 44.5 28.5 L3.5 28.5 Q2 28.5 2 27 Z" fill="#8A929B" stroke={IP.ink} strokeWidth=".8"/>
        <rect x="2" y="1" width="44" height="10" rx="1.5" fill="#A6ADB6" stroke={IP.ink} strokeWidth=".8"/>
        <rect x="4" y="2.4" width="40" height="2" fill="#BEC5CD"/>{/* plenum grille edge */}
        <g opacity=".5">{Array.from({length:9}).map((_,i)=><line key={i} x1={6+i*4.4} y1="5" x2={6+i*4.4} y2="9.5" stroke={IP.ink} strokeWidth=".5"/>)}</g>
        <text x="24" y="8.4" fontSize="3" fill="#0F1A24" textAnchor="middle" fontFamily="monospace">HEPA ↓</text>
        <line x1="2" y1="11" x2="46" y2="11" stroke={IP.ink} strokeWidth=".55"/>{/* top↔front seam */}
        {/* viewer-facing sash glass with green safety light */}
        <rect x="4" y="12.5" width="40" height="6.5" rx=".8" fill="#CFE9DE" stroke={IP.ink} strokeWidth=".5"/>
        <rect x="4" y="12.5" width="40" height="1.6" fill="#34D399"/>{/* safe-light bar */}
        <rect x="6" y="15" width="14" height="2.6" fill="#FFFFFF" opacity=".45"/>{/* glare */}
        {/* interior work deck seen through the sash */}
        <rect x="6" y="19.5" width="36" height="6.5" rx=".6" fill="#E8EEF0" stroke={IP.ink} strokeWidth=".4"/>
        <rect x="9" y="21.4" width="14" height="1.6" fill="#4B5563"/>{/* syringe */}
        <rect x="9" y="23.6" width="9" height="1.6" fill="#4B5563"/>
        <rect x="33" y="20.6" width="5" height="4.2" fill="#A5B4FC" stroke={IP.ink} strokeWidth=".4"/>{/* chemo vial */}
      </svg>
    </div>
  );
}

function Centrifuge({ x, y }) {
  return (
    <div style={{ position: 'absolute', left: x * ITILE, top: y * ITILE - 3, width: ITILE * 1.5, height: ITILE * 1.6 }}>
      <svg viewBox="0 0 24 26" width={ITILE * 1.5} height={ITILE * 1.6} shapeRendering="geometricPrecision">
          <ellipse cx="12.0" cy="24.2" rx="8.2" ry="2.8" fill="rgba(0,0,0,.16)"/>
        {/* TOP lid (dominant) folding into a continuous short front */}
        <path d="M2 15 L22 15 L22 22 Q22 23 21 23 L3 23 Q2 23 2 22 Z" fill="#B4BAC2" stroke={IP.ink} strokeWidth=".7"/>
        <ellipse cx="12" cy="11" rx="10" ry="7" fill="#C3C9D0" stroke={IP.ink} strokeWidth=".7"/>{/* round drum lid */}
        <ellipse cx="12" cy="10.4" rx="7.5" ry="5.2" fill="#1F2937"/>{/* dark bowl */}
        <ellipse cx="12" cy="10.4" rx="4" ry="2.8" fill="#475569" style={{ transformOrigin: '12px 10.4px', animation: 'forinSpin 0.8s linear infinite' }}/>
        <circle cx="12" cy="10.4" r="1" fill="#9AA1A8"/>
        {/* viewer-facing control on the front band */}
        <rect x="5" y="16.5" width="7" height="4" rx=".5" fill="#0F1A24"/>
        <text x="8.5" y="19.6" fontSize="2.4" fill="#22D3EE" textAnchor="middle" fontFamily="monospace">SPIN</text>
        <circle cx="17" cy="18.5" r="1.6" fill="#10B981" stroke={IP.ink} strokeWidth=".4"/>
      </svg>
      <style>{`@keyframes forinSpin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function PrintLabel({ x, y }) {
  return (
    <div style={{ position: 'absolute', left: x * ITILE, top: y * ITILE - 3, width: ITILE * 1.6, height: ITILE * 1.5 }}>
      <svg viewBox="0 0 26 24" width={ITILE * 1.6} height={ITILE * 1.5} shapeRendering="geometricPrecision">
          <ellipse cx="13.0" cy="22" rx="8.8" ry="3" fill="rgba(0,0,0,.16)"/>
        {/* TOP face (dominant) folding into a continuous short front */}
        <path d="M2 12 L24 12 L24 20 Q24 21 23 21 L3 21 Q2 21 2 20 Z" fill="#B7BEC6" stroke={IP.ink} strokeWidth=".7"/>
        <rect x="2" y="3" width="22" height="9" rx="1.5" fill="#D1D5DB" stroke={IP.ink} strokeWidth=".7"/>
        <rect x="3.5" y="4.2" width="19" height="1.4" fill="#E1E5EA"/>
        {/* paper feed slot on top + a printed label emerging */}
        <rect x="6" y="9" width="14" height="1.6" fill="#2C3239"/>
        <rect x="7" y="1" width="12" height="5" rx=".5" fill="#fff" stroke={IP.ink} strokeWidth=".4"/>
        <rect x="8.5" y="2.2" width="8" height=".9" fill={IP.ink} opacity=".7"/>
        <rect x="8.5" y="3.8" width="6" height=".9" fill={IP.ink} opacity=".5"/>
        <line x1="2" y1="12" x2="24" y2="12" stroke={IP.ink} strokeWidth=".55"/>{/* top↔front seam */}
        {/* viewer-facing button on the front band */}
        <circle cx="19" cy="16" r="1.8" fill="#10B981" stroke={IP.ink} strokeWidth=".4"/>
        <rect x="5" y="15" width="9" height="2" rx=".4" fill="#0F1A24"/>
      </svg>
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
