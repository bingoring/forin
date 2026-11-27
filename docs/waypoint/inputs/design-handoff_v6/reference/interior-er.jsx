// interior-er.jsx — ER interior, expanded to 30×40 for breathing room.

function ScreenInteriorER() {
  const COLS = 30, ROWS = 40;

  // Region map (expanded — each room ~40% larger)
  //  y=0..9   : entry zone (ambulance bay + triage + reception + waiting)
  //  y=10..27 : main treatment area (bays + nurse station + trauma)
  //  y=28..39 : back rooms (supply, office, x-ray, break)
  const regions = [
    { id: 'top-hall',  name: '입구 · 트리아지', icon: '🚑', bounds: { x: 0, y: 0, w: 30, h: 10 } },
    { id: 'left-bays', name: '경증 베이 1-2',   icon: '🛏', bounds: { x: 0, y: 9, w: 10, h: 9 } },
    { id: 'left-bays2',name: '베이 3-4',        icon: '🛏', bounds: { x: 0, y: 17, w: 10, h: 11 } },
    { id: 'nurse',     name: '너스 스테이션',    icon: '👩‍⚕️', bounds: { x: 9, y: 9, w: 10, h: 19 } },
    { id: 'trauma',    name: '트라우마 룸',      icon: '🚨', bounds: { x: 18, y: 9, w: 12, h: 19 } },
    { id: 'supply',    name: '서플라이',         icon: '📦', bounds: { x: 0, y: 27, w: 9, h: 13 } },
    { id: 'office',    name: '의국',             icon: '👨‍⚕️', bounds: { x: 8, y: 27, w: 8, h: 13 } },
    { id: 'xray',      name: 'X-Ray Room',       icon: '🩻', bounds: { x: 15, y: 27, w: 8, h: 13 } },
    { id: 'break',     name: '직원 휴게실',      icon: '☕', bounds: { x: 22, y: 27, w: 8, h: 13 } },
  ];

  // Fast-travel destinations (player teleports to these center points)
  const rooms = [
    { id: 'amb',     name: '앰뷸런스 베이', sub: '도착 환자', icon: '🚑', color: '#FCA5A5', x: 13, y: 4, questCount: 1 },
    { id: 'triage',  name: '트리아지 데스크', sub: '응급도 분류', icon: '📋', color: '#FBCFE8', x: 5, y: 5 },
    { id: 'reg',     name: '등록 데스크',   sub: '접수',       icon: '📝', color: '#BAE6FD', x: 24, y: 5, questCount: 1 },
    { id: 'bay1',    name: 'Bay 1', sub: '경증',     icon: '🛏', color: '#A7F3D0', x: 3, y: 13 },
    { id: 'bay2',    name: 'Bay 2', sub: '경증',     icon: '🛏', color: '#A7F3D0', x: 7, y: 13 },
    { id: 'bay3',    name: 'Bay 3', sub: '중등도',   icon: '🛏', color: '#FEF08A', x: 3, y: 22 },
    { id: 'bay4',    name: 'Bay 4 · Hopkins', sub: 'Pain 7/10', icon: '🛏', color: '#FCA5A5', x: 7, y: 22, questCount: 1 },
    { id: 'nurse',   name: '너스 스테이션',  sub: '중앙 허브', icon: '👩‍⚕️', color: '#FFEDD5', x: 14, y: 16 },
    { id: 'trauma1', name: 'Trauma 1',       sub: '중증',     icon: '🚨', color: '#FCA5A5', x: 24, y: 14 },
    { id: 'trauma2', name: 'Trauma 2',       sub: '대기',     icon: '🚨', color: '#FED7AA', x: 24, y: 22 },
    { id: 'supply',  name: '서플라이',       sub: '의료 소모품', icon: '📦', color: '#DDD6FE', x: 4, y: 33 },
    { id: 'office',  name: '의국',           sub: 'Dr. Office', icon: '👨‍⚕️', color: '#BAE6FD', x: 12, y: 33 },
    { id: 'xray',    name: 'X-Ray Room',     icon: '🩻',       color: '#A7F3D0', x: 19, y: 33, questCount: 1 },
    { id: 'break',   name: '직원 휴게실',    sub: '커피·휴식', icon: '☕', color: '#FBCFE8', x: 26, y: 33 },
  ];

  return (
    <InteriorScreen
      label="06a Interior · ER" deptCode="응급실 ER · 2F"
      cols={COLS} rows={ROWS} floor="clinical"
      playerStart={{ x: 14, y: 16 }}
      rooms={rooms}
      regions={regions}
      missionText="너스 스테이션 · Dr. Patel 인계 받기"
      missionUrgent
      render={() => (
        <>
          {/* ─── OUTER WALLS ─── */}
          <IWall x={0}  y={0} w={12} h={1}/>
          <IDoor x={12} y={0} w={4}  h={1} kind="auto" label="AMBULANCE BAY"/>
          <IWall x={16} y={0} w={14} h={1}/>
          <IWall x={0}  y={1} w={1}  h={38}/>
          <IWall x={29} y={1} w={1}  h={38}/>
          <IWall x={0}  y={39} w={14} h={1}/>
          <IDoor x={14} y={39} w={2}  h={1} kind="auto" label="↓ 캠퍼스로"/>
          <IWall x={16} y={39} w={14} h={1}/>

          {/* ─── DIVIDER y=9 between entry & main treatment ─── */}
          <IWall x={1}  y={9} w={7} h={1}/>
          <IDoor x={8}  y={9} w={2} h={1} kind="wood" label="→ 베이"/>
          <IWall x={10} y={9} w={7} h={1}/>
          <IDoor x={17} y={9} w={2} h={1} kind="wood" label="→ 트라우마"/>
          <IWall x={19} y={9} w={10} h={1}/>

          {/* ─── DIVIDER y=27 between treatment & back rooms ─── */}
          <IWall x={1}  y={27} w={6} h={1}/>
          <IDoor x={7}  y={27} w={2} h={1} kind="wood"/>
          <IWall x={9}  y={27} w={4} h={1}/>
          <IDoor x={13} y={27} w={2} h={1} kind="wood"/>
          <IWall x={15} y={27} w={5} h={1}/>
          <IDoor x={20} y={27} w={2} h={1} kind="wood"/>
          <IWall x={22} y={27} w={7} h={1}/>

          {/* ════════ ENTRY ZONE (y 1-8) ════════ */}
          <BayLabel x={3} y={1} text="AMBULANCE INTAKE"/>
          {/* parked gurney with new patient */}
          <Gurney x={12} y={3} occupied/>
          <IIV x={15} y={3}/>
          {/* paramedics */}
          <INpc x={16} y={5} kind="paramedic" hair="#1F2937"/>
          <IHotspot x={16} y={5} kind="urgent" label="핸드오프"/>
          <INpc x={11} y={5} kind="paramedic" hair="#7C3F00"/>
          {/* second empty gurney + oxygen tank */}
          <Gurney x={9} y={4}/>
          <OxygenTank x={8} y={5}/>

          {/* triage desk (left) */}
          <IReception x={3} y={4} w={2} h={1} label="TRIAGE"/>
          <INpc x={4} y={6} kind="nurse" hair="#3C2A18"/>
          <Whiteboard x={1} y={1} w={2}/>

          {/* registration desk (right) */}
          <IReception x={22} y={4} w={3} h={1} label="REGISTER"/>
          <INpc x={23} y={6} kind="nurse" hair="#5C3A1A" shirt="#FBCFE8"/>
          <CompCart x={20} y={3}/>
          <HandSanitizer x={26} y={1}/>

          {/* waiting chairs row (more chairs, more space) */}
          {[2,4,6,19,21,23,25,27].map((cx,i) =>
            <IChair key={i} x={cx} y={8} color={i%2===0?'#FED7AA':'#FBCFE8'} facing="up"/>
          )}
          {/* waiting people */}
          <INpc x={6} y={7.5} kind="patient" hair="#9A6B3F"/>
          <IHotspot x={6} y={7} kind="quest" label="통증 사정"/>
          <INpc x={19} y={7.5} kind="parent" hair="#5C3A1A"/>
          <INpc x={21} y={7.5} kind="child"  hair="#7C3F00"/>
          <INpc x={25} y={7.5} kind="police" hair="#1F2937"/>
          <IHotspot x={25} y={7} kind="police" label="동행 환자"/>

          {/* wheelchair parked in waiting */}
          <Wheelchair x={9} y={7}/>
          <Wheelchair x={17} y={7}/>

          {/* plants flanking the entry */}
          <IPlant x={1}  y={4}/>
          <IPlant x={28} y={4}/>

          {/* ════════ TREATMENT BAYS — LEFT (y 10-26) ════════ */}
          {/* Bay 1 (cols 1-4) */}
          <ICurtain x={4} y={10} w={1} h={7}/>
          <BayLabel x={1} y={10} text="BAY 1"/>
          <IBed x={1} y={11} variant="ward" occupied/>
          <IMonitor x={1} y={15}/>
          <BPCuff x={3} y={11}/>
          <SuctionUnit x={3} y={12}/>
          <INpc x={2} y={16} kind="patient" hair="#3C2A18"/>
          <IPlant x={3} y={16}/>

          {/* Bay 2 (cols 5-8) */}
          <ICurtain x={8} y={10} w={1} h={7}/>
          <BayLabel x={5} y={10} text="BAY 2"/>
          <IBed x={5} y={11} variant="ward"/>
          <IIV x={8} y={12}/>
          <IChair x={7} y={15} color="#FBCFE8" facing="up"/>
          <SharpsContainer x={5} y={15}/>

          {/* Bay 3 (cols 1-4, y 18-26) */}
          <ICurtain x={4} y={18} w={1} h={7}/>
          <BayLabel x={1} y={18} text="BAY 3"/>
          <IBed x={1} y={19} variant="ward" occupied/>
          <IMonitor x={1} y={23} beep/>
          <INpc x={2} y={22} kind="nurse" hair="#3C2A18" shirt="#A7D7B0"/>
          <BPCuff x={3} y={19}/>
          <GloveDispenser x={3} y={24}/>

          {/* Bay 4 — Hopkins (cols 5-8, y 18-26) */}
          <ICurtain x={8} y={18} w={1} h={7}/>
          <BayLabel x={5} y={18} text="BAY 4" highlight/>
          <IBed x={5} y={19} variant="ward" occupied label="HOPKINS"/>
          <IMonitor x={5} y={23} beep/>
          <IIV x={8} y={19}/>
          <INpc x={6} y={22} kind="patient" hair="#9A6B3F"/>
          <IHotspot x={6} y={21} kind="urgent" label="PAIN 7"/>
          <SharpsContainer x={7} y={24}/>
          <SuctionUnit x={7} y={21}/>

          {/* ════════ NURSE STATION (cols 10-17, y 11-19) ════════ */}
          <IReception x={12} y={14} w={4} h={2} label="NURSE STATION"/>
          <INpc x={12} y={17} kind="nurse" hair="#3C2A18"/>
          <INpc x={14} y={17} kind="doctor" hair="#5C3A1A"/>
          <INpc x={16} y={17} kind="nurse" hair="#7C3F00" shirt="#FBCFE8"/>
          <IHotspot x={14} y={16} kind="urgent" label="Dr. Patel"/>
          {/* chart cabinet behind */}
          <ICabinet x={11} y={20} w={6} variant="chart" label="CHARTS"/>
          {/* Multiple computer carts */}
          <CompCart x={10} y={13}/>
          <CompCart x={17} y={13}/>
          {/* Whiteboard with shift schedule */}
          <Whiteboard x={11} y={11} w={6}/>
          <IPlant x={10} y={11}/>
          <IPlant x={17} y={11}/>

          {/* ════════ TRAUMA ROOMS (cols 19-28, y 10-26) ════════ */}
          <IGlass x={18} y={10} w={1} h={17}/>
          <BayLabel x={19} y={10} text="TRAUMA 1"/>
          <IBed x={22} y={12} variant="or" occupied label="CRIT"/>
          <IMonitor x={20} y={11} beep/>
          <IMonitor x={26} y={11}/>
          <IIV x={25} y={12}/>
          <IIV x={20} y={15}/>
          {/* Defibrillator + EKG */}
          <Defib x={20} y={17}/>
          <EKG x={26} y={15}/>
          <OxygenTank x={28} y={12}/>
          <ICabinet x={25} y={17} w={3} variant="equipment" label="CART"/>
          <INpc x={22} y={16} kind="surgeon" hair="#1F2937"/>
          <INpc x={24} y={16} kind="doctor"  hair="#7C3F00"/>
          <INpc x={27} y={13} kind="nurse"   hair="#3C2A18" shirt="#A5D8E8"/>

          <ICurtain x={18} y={19} w={11} h={1}/>
          <BayLabel x={19} y={20} text="TRAUMA 2"/>
          <IBed x={22} y={22} variant="or"/>
          <IMonitor x={20} y={21}/>
          <IIV x={25} y={22}/>
          <Defib x={28} y={22}/>
          <SharpsContainer x={20} y={25}/>
          <IPlant x={27} y={25}/>

          {/* ════════ BACK ROOMS (y 28-38) ════════ */}
          {/* Vertical walls between back rooms */}
          <IWall x={7}  y={28} w={1} h={4}/>
          <IDoor x={7}  y={32} w={1} h={2} kind="wood"/>
          <IWall x={7}  y={34} w={1} h={5}/>
          <IWall x={14} y={28} w={1} h={4}/>
          <IDoor x={14} y={32} w={1} h={2} kind="wood"/>
          <IWall x={14} y={34} w={1} h={5}/>
          <IWall x={21} y={28} w={1} h={3}/>
          <IDoor x={21} y={31} w={1} h={2} kind="wood"/>
          <IWall x={21} y={33} w={1} h={6}/>

          {/* Supply closet */}
          <BayLabel x={1} y={28} text="SUPPLY"/>
          <ICabinet x={1} y={29} w={2} variant="supply"/>
          <ICabinet x={4} y={29} w={2} variant="drug"/>
          <ICabinet x={1} y={32} w={2} variant="linen"/>
          <ICabinet x={4} y={32} w={2} variant="equipment"/>
          <ICabinet x={1} y={36} w={5} variant="supply"/>
          <Scale x={3} y={37}/>
          <Wheelchair x={5} y={35}/>
          <IPlant x={5} y={37}/>

          {/* Doctor's office */}
          <BayLabel x={9} y={28} text="DR. OFFICE"/>
          <IReception x={9} y={30} w={2} h={1}/>
          <CompCart x={12} y={30}/>
          <IChair x={9}  y={33} color="#A8C7DC" facing="up"/>
          <IChair x={10} y={33} color="#A8C7DC" facing="up"/>
          <IChair x={11} y={33} color="#A8C7DC" facing="up"/>
          <INpc x={10} y={31} kind="doctor" hair="#1F2937"/>
          <Whiteboard x={9} y={35} w={5}/>
          <IPlant x={12} y={36}/>

          {/* X-Ray */}
          <BayLabel x={16} y={28} text="X-RAY"/>
          <XrayMachine x={17} y={30}/>
          <IMonitor x={16} y={34}/>
          <CompCart x={19} y={34}/>
          <IHotspot x={17} y={29} kind="info" label="결과 확인"/>
          <Sink x={20} y={37}/>
          <IPlant x={20} y={29}/>

          {/* Break room */}
          <BayLabel x={23} y={28} text="STAFF BREAK"/>
          <ICabinet x={23} y={29} w={3} variant="supply"/>
          <IChair x={23} y={32} color="#FED7AA" facing="down"/>
          <IChair x={25} y={32} color="#FED7AA" facing="down"/>
          <IChair x={27} y={32} color="#FED7AA" facing="down"/>
          {/* coffee machine (custom) */}
          <div style={{ position: 'absolute', left: 26 * ITILE, top: 35 * ITILE, width: ITILE, height: ITILE * 1.4, filter: 'drop-shadow(2px 2px 0 rgba(0,0,0,.2))' }}>
            <div style={{ position: 'absolute', inset: 0, background: '#475569', border: `2px solid ${IP.ink}` }}/>
            <div style={{ position: 'absolute', inset: 2, top: 2, bottom: 8, background: '#1F2937', border: `1px solid ${IP.ink}88` }}/>
            <div style={{ position: 'absolute', left: 5, bottom: 3, width: 6, height: 4, background: '#fff', border: `1px solid ${IP.ink}` }}/>
          </div>
          <Sink x={23} y={35}/>
          <INpc x={24} y={35} kind="nurse" hair="#7C3F00" shirt="#FBCFE8"/>
          <IPlant x={27} y={37}/>
        </>
      )}
    />
  );
}

// ─── Small helpers ────────────────────────────────────────────────
function BayLabel({ x, y, text, highlight }) {
  return (
    <div style={{
      position: 'absolute', left: x * ITILE + 2, top: y * ITILE + 1, zIndex: 3,
      background: highlight ? '#FEF08A' : '#FFFFFFDD',
      border: `1.5px solid ${IP.ink}`,
      padding: '0 4px', fontFamily: '"DungGeunMo",monospace', fontSize: 7, color: IP.ink,
      boxShadow: `1.5px 1.5px 0 0 ${IP.ink}66`, whiteSpace: 'nowrap',
    }}>{text}</div>
  );
}

function XrayMachine({ x, y }) {
  return (
    <div style={{ position: 'absolute', left: x * ITILE, top: y * ITILE, width: ITILE * 2, height: ITILE * 2.5, filter: 'drop-shadow(2px 3px 0 rgba(0,0,0,.18))' }}>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 8, background: '#9CA3AF', border: `2px solid ${IP.ink}` }}/>
      <div style={{ position: 'absolute', left: 4, top: 0, bottom: 8, width: 4, background: '#6B7280', border: `1.5px solid ${IP.ink}` }}/>
      <div style={{ position: 'absolute', left: 12, top: 0, width: 18, height: 14, background: '#374151', border: `2px solid ${IP.ink}` }}>
        <div style={{ position: 'absolute', inset: 2, background: '#9CA3AF' }}/>
        <div style={{ position: 'absolute', left: 4, top: 4, width: 6, height: 6, background: '#FACC15' }}/>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 16, height: 8, background: '#fff', border: `1.5px solid ${IP.ink}` }}/>
    </div>
  );
}

Object.assign(window, { ScreenInteriorER, BayLabel, XrayMachine });
