// interior-or.jsx — Operating Room interior. Workflow: Pre-op → OR → Recovery.

function ScreenInteriorOR() {
  const COLS = 22, ROWS = 30;

  const regions = [
    { id: 'preop',  name: 'Pre-op Holding',     icon: '💤', bounds: { x: 0, y: 0, w: 12, h: 10 } },
    { id: 'scrub',  name: 'Scrub Sinks',        icon: '🚿', bounds: { x: 11, y: 0, w: 11, h: 10 } },
    { id: 'or1',    name: 'OR 1 · 충수절제',    icon: '🔪', bounds: { x: 0, y: 10, w: 22, h: 12 } },
    { id: 'pacu',   name: 'PACU 회복실',        icon: '❤️‍🩹', bounds: { x: 0, y: 22, w: 14, h: 8 } },
    { id: 'family', name: '가족 면담실',         icon: '🪑', bounds: { x: 13, y: 22, w: 9, h: 8 } },
  ];

  const rooms = [
    { id: 'preop',   name: 'Pre-op Holding', sub: '수술 전 대기', icon: '💤', color: '#FBCFE8', x: 4, y: 5, questCount: 1 },
    { id: 'scrub',   name: 'Scrub Sinks', sub: '손소독', icon: '🚿', color: '#BAE6FD', x: 14, y: 5 },
    { id: 'or1',     name: 'OR 1 · Appy', sub: '충수절제 진행 중', icon: '🔪', color: '#DDD6FE', x: 11, y: 15, questCount: 2 },
    { id: 'pacu',    name: 'PACU 회복실', sub: '술 후 모니터링', icon: '❤️‍🩹', color: '#A7F3D0', x: 8, y: 25, questCount: 1 },
    { id: 'family',  name: '가족 면담', sub: '대기 가족', icon: '🪑', color: '#FED7AA', x: 19, y: 25, questCount: 1 },
  ];

  return (
    <InteriorScreen
      label="06b Interior · OR" deptCode="수술실 OR · 3F" deptColor="#9333EA"
      cols={COLS} rows={ROWS} floor="sterile"
      playerStart={{ x: 11, y: 15 }}
      rooms={rooms}
      regions={regions}
      missionText="OR 1 메인 룸 · 수술 중 기구 패스 도와주기"
      render={() => (
        <>
          {/* OUTER WALLS */}
          <IWall x={0} y={0} w={9}  h={1}/>
          <IDoor x={9} y={0} w={2}  h={1} kind="auto" label="↓ 캠퍼스로"/>
          <IWall x={11} y={0} w={11} h={1}/>
          <IWall x={0}  y={1} w={1}  h={28}/>
          <IWall x={21} y={1} w={1}  h={28}/>
          <IWall x={0}  y={29} w={22} h={1}/>

          {/* PRE-OP holding (y 1-9, top half) */}
          <BayLabel x={2} y={1} text="PRE-OP HOLDING"/>
          {/* 3 pre-op beds */}
          <IBed x={2}  y={3} variant="ward" occupied label="GARCIA"/>
          <IBed x={2}  y={6} variant="ward" occupied label="LEE"/>
          <IBed x={6}  y={3} variant="ward" occupied/>
          <IBed x={6}  y={6} variant="ward"/>
          {/* IV stands */}
          <IIV x={4} y={3}/>
          <IIV x={4} y={6}/>
          <IIV x={8} y={3}/>
          {/* monitors at heads */}
          <IMonitor x={1} y={3} beep/>
          <IMonitor x={1} y={6}/>
          <IMonitor x={5} y={3}/>
          {/* nurse with chart, holding clipboard */}
          <INpc x={5} y={5} kind="nurse" hair="#3C2A18" shirt="#A5D8E8"/>
          {/* anesthesiologist visiting */}
          <INpc x={9} y={4} kind="doctor" hair="#1F2937"/>
          {/* patients */}
          <INpc x={3} y={4.5} kind="patient" hair="#5C3A1A"/>
          <IHotspot x={3} y={4} kind="urgent" label="동의서"/>
          <INpc x={3} y={7.5} kind="patient" hair="#9A6B3F"/>

          {/* SCRUB SINKS (right of pre-op, y 1-9) */}
          <IWall x={11} y={1} w={1} h={3}/>
          <IDoor x={11} y={4} w={1} h={2} kind="wood" label="→ 스크럽"/>
          <IWall x={11} y={6} w={1} h={4}/>
          <BayLabel x={12} y={1} text="SCRUB"/>
          {/* 3 sinks against right wall */}
          <Sink x={12} y={3}/>
          <Sink x={12} y={6}/>
          <Sink x={16} y={3}/>
          <Sink x={16} y={6}/>
          {/* gowning lockers */}
          <ICabinet x={18} y={2} w={2} variant="linen" label="GOWN"/>
          <ICabinet x={18} y={4} w={2} variant="linen"/>
          <ICabinet x={18} y={6} w={2} variant="linen"/>
          {/* scrubbing surgeon */}
          <INpc x={13} y={4} kind="surgeon" hair="#1F2937"/>

          {/* RED LINE / Sterile boundary y=10 */}
          <IWall x={1}  y={10} w={4} h={1}/>
          <IDoor x={5}  y={10} w={2} h={1} kind="sterile" label="STERILE"/>
          <IWall x={7}  y={10} w={3} h={1}/>
          <IDoor x={10} y={10} w={2} h={1} kind="sterile"/>
          <IWall x={12} y={10} w={4} h={1}/>
          <IDoor x={16} y={10} w={2} h={1} kind="sterile"/>
          <IWall x={18} y={10} w={3} h={1}/>

          {/* MAIN OR (y 11-21) */}
          <BayLabel x={1}  y={11} text="OR 1 · APPY (충수절제)" highlight/>
          {/* surgical lights overhead (decorative round dome) */}
          {/* OR table (center) — no overhead surgical lights so view is clear */}
          <IBed x={10} y={14} variant="or" occupied label="DRAPED"/>
          {/* anesthesia machine at head */}
          <AnesthesiaMachine x={9} y={13}/>
          {/* instrument tray to right of patient */}
          <InstrumentTray x={13} y={15}/>
          <InstrumentTray x={13} y={17}/>
          {/* monitors */}
          <IMonitor x={8}  y={11} beep/>
          <IMonitor x={14} y={11} beep/>
          {/* IV stands */}
          <IIV x={9}  y={17}/>
          <IIV x={13} y={13}/>
          {/* Surgical team positioned around patient */}
          <INpc x={9}  y={15.5} kind="surgeon" hair="#1F2937"/>
          <IHotspot x={9} y={14} kind="info" label="Dr. Kim 집도"/>
          <INpc x={11} y={15.5} kind="surgeon" hair="#5C3A1A"/>
          <INpc x={11} y={17}   kind="surgeon" hair="#7C3F00"/>
          {/* scrub nurse near instrument tray */}
          <INpc x={14} y={16} kind="nurse" hair="#3C2A18" shirt="#A5D8E8"/>
          <IHotspot x={14} y={15} kind="quest" label="기구 패스"/>
          {/* anesthesiologist at head */}
          <INpc x={9}  y={13.5} kind="doctor" hair="#1F2937"/>
          <IHotspot x={9} y={12.5} kind="info" label="마취 모니터"/>

          {/* sterile cabinets along walls */}
          <ICabinet x={1}  y={12} w={4} variant="sterile" label="STERILE"/>
          <ICabinet x={1}  y={14} w={3} variant="sterile"/>
          <ICabinet x={1}  y={16} w={3} variant="equipment"/>
          <ICabinet x={17} y={12} w={3} variant="sterile"/>
          <ICabinet x={17} y={14} w={3} variant="sterile"/>
          <ICabinet x={17} y={16} w={3} variant="drug"/>

          {/* Circulating nurse (moves between sterile and non-sterile) */}
          <INpc x={5} y={18} kind="nurse" hair="#7C3F00" shirt="#A7F3D0"/>

          {/* status board on wall (clock + procedure timer) */}
          <StatusBoard x={2} y={20}/>

          {/* DIVIDER y=22 */}
          <IWall x={1}  y={22} w={5} h={1}/>
          <IDoor x={6}  y={22} w={2} h={1} kind="wood" label="→ PACU"/>
          <IWall x={8}  y={22} w={3} h={1}/>
          <IWall x={11} y={22} w={4} h={1}/>
          <IDoor x={15} y={22} w={2} h={1} kind="wood"/>
          <IWall x={17} y={22} w={4} h={1}/>

          {/* PACU Recovery (y 23-28) */}
          <BayLabel x={2} y={23} text="PACU · RECOVERY"/>
          {/* 3 recovery beds */}
          <IBed x={2}  y={24} variant="ward" occupied/>
          <IBed x={6}  y={24} variant="ward" occupied label="POST-OP"/>
          <IBed x={10} y={24} variant="ward"/>
          {/* monitors */}
          <IMonitor x={1}  y={24} beep/>
          <IMonitor x={5}  y={24}/>
          {/* recovery nurses */}
          <INpc x={4} y={26} kind="nurse" hair="#3C2A18"/>
          <INpc x={8} y={26} kind="nurse" hair="#9A6B3F" shirt="#FBCFE8"/>
          <IHotspot x={7} y={26} kind="quest" label="활력 체크"/>
          {/* nurse station */}
          <IReception x={15} y={25} w={3} h={1} label="PACU NURSE"/>
          <INpc x={15} y={26.5} kind="nurse" hair="#5C3A1A" shirt="#A5D8E8"/>
          {/* family member waiting (no quest, anxious) */}
          <INpc x={19} y={25} kind="parent" hair="#3C2A18"/>
          <IHotspot x={19} y={25} kind="info" label="가족 면담"/>
        </>
      )}
    />
  );
}

// ─── Surgical Sink v2 — basin (top) + faucet + knee paddle ─────────
function Sink({ x, y }) {
  return (
    <div style={{ position: 'absolute', left: x * ITILE, top: y * ITILE - 4, width: ITILE * 2, height: ITILE * 2, filter: 'drop-shadow(3px 4px 0 rgba(0,0,0,.28))' }}>
      <svg viewBox="0 0 32 32" width={ITILE * 2} height={ITILE * 2} shapeRendering="crispEdges">
        {/* faucet arm — gooseneck */}
        <rect x="15" y="0" width="2" height="6" fill="#9CA3AF" stroke={IP.ink} strokeWidth=".4"/>
        <rect x="15" y="6" width="6" height="2" fill="#9CA3AF" stroke={IP.ink} strokeWidth=".4"/>
        <rect x="19" y="8" width="2" height="3" fill="#6B7280" stroke={IP.ink} strokeWidth=".4"/>
        {/* water stream */}
        <rect x="19.5" y="11" width="1" height="4" fill="#7DD3FC"/>
        {/* knobs */}
        <circle cx="12" cy="4" r="1.5" fill="#3B82F6" stroke={IP.ink} strokeWidth=".3"/>
        <circle cx="24" cy="4" r="1.5" fill="#EF4444" stroke={IP.ink} strokeWidth=".3"/>
        {/* basin rim (top face — ellipse) */}
        <ellipse cx="16" cy="14" rx="12" ry="4" fill="#E5E7EB" stroke={IP.ink} strokeWidth=".5"/>
        <ellipse cx="16" cy="13" rx="11" ry="3" fill="#F3F4F6"/>
        {/* water in basin */}
        <ellipse cx="16" cy="15" rx="10" ry="2.5" fill="#A8DCEC"/>
        {/* basin FRONT (depth) */}
        <path d="M 4 14 L 28 14 L 26 22 L 6 22 Z" fill="#9CA3AF" stroke={IP.ink} strokeWidth=".4"/>
        <path d="M 4 14 L 6 14 L 6 22 L 4 22 Z" fill="#CBD5E1"/>
        {/* base pipe */}
        <rect x="14" y="22" width="4" height="3" fill="#6B7280" stroke={IP.ink} strokeWidth=".4"/>
        {/* knee paddle */}
        <rect x="6" y="25" width="20" height="3" fill="#94A3B8" stroke={IP.ink} strokeWidth=".4"/>
        <rect x="7" y="25.5" width="18" height="1" fill="#CBD5E1"/>
        {/* legs */}
        <rect x="4" y="28" width="3" height="4" fill="#4B5563" stroke={IP.ink} strokeWidth=".3"/>
        <rect x="25" y="28" width="3" height="4" fill="#4B5563" stroke={IP.ink} strokeWidth=".3"/>
      </svg>
    </div>
  );
}

// ─── Surgical Light v2 — ceiling-mounted dome with multi-bulbs ─────
function SurgicalLight({ x, y }) {
  return (
    <div style={{ position: 'absolute', left: x * ITILE - 16, top: y * ITILE, width: ITILE * 4, height: ITILE * 2, zIndex: 1, filter: 'drop-shadow(3px 4px 0 rgba(0,0,0,.25))' }}>
      <svg viewBox="0 0 64 32" width={ITILE * 4} height={ITILE * 2} shapeRendering="crispEdges">
        {/* ceiling mount */}
        <rect x="30" y="0" width="4" height="3" fill="#374151" stroke={IP.ink} strokeWidth=".4"/>
        {/* swing arm */}
        <rect x="31" y="3" width="2" height="10" fill="#9CA3AF" stroke={IP.ink} strokeWidth=".3"/>
        {/* DOME top */}
        <ellipse cx="32" cy="17" rx="22" ry="6" fill="#F1F5F9" stroke={IP.ink} strokeWidth=".5"/>
        <ellipse cx="32" cy="15.5" rx="20" ry="4" fill="#FFFFFF"/>
        {/* dome side band */}
        <path d="M 10 17 L 54 17 L 51 21 L 13 21 Z" fill="#E5E7EB" stroke={IP.ink} strokeWidth=".4"/>
        {/* light bulbs (visible from below) */}
        {[14,20,26,32,38,44,50].map((bx, i) => (
          <circle key={i} cx={bx} cy="22.5" r="2.5" fill="#FEF08A" stroke={IP.ink} strokeWidth=".3"/>
        ))}
        <circle cx="32" cy="22.5" r="2.5" fill="#FFFFFF"/>
        {/* glow */}
        <ellipse cx="32" cy="28" rx="24" ry="3" fill="#FEF08A" opacity=".35"/>
      </svg>
    </div>
  );
}

// ─── Anesthesia Machine v2 — screen + knobs + gas cylinders + cart ─
function AnesthesiaMachine({ x, y }) {
  return (
    <div style={{ position: 'absolute', left: x * ITILE, top: y * ITILE - ITILE - 4, width: ITILE * 1.5, height: ITILE * 2.6, filter: 'drop-shadow(3px 4px 0 rgba(0,0,0,.28))' }}>
      <svg viewBox="0 0 24 42" width={ITILE * 1.5} height={ITILE * 2.6} shapeRendering="crispEdges">
        {/* top face */}
        <path d="M 2 1 L 22 1 L 23 3 L 1 3 Z" fill="#475569" stroke={IP.ink} strokeWidth=".4"/>
        {/* upper screen housing */}
        <rect x="1" y="3" width="22" height="13" fill="#374151" stroke={IP.ink} strokeWidth=".5"/>
        {/* screen */}
        <rect x="3" y="5" width="18" height="9" fill="#0F1A24" stroke={IP.ink} strokeWidth=".4"/>
        <rect x="4" y="6" width="16" height="1" fill="#22D3EE"/>
        <rect x="4" y="8" width="16" height="1" fill="#FACC15"/>
        <rect x="4" y="10" width="12" height="1" fill="#10B981"/>
        {/* tube curling out */}
        <rect x="19" y="14" width="3" height="2" fill="#94A3B8" stroke={IP.ink} strokeWidth=".3"/>
        <path d="M 22 15 Q 24 17 22 20" fill="none" stroke="#94A3B8" strokeWidth="1.5"/>
        {/* divider */}
        <rect x="1" y="16" width="22" height="1" fill="#1F2937"/>
        {/* knob row */}
        <rect x="1" y="17" width="22" height="6" fill="#94A3B8" stroke={IP.ink} strokeWidth=".4"/>
        <circle cx="5" cy="20" r="1.5" fill="#EF4444" stroke={IP.ink} strokeWidth=".3"/>
        <circle cx="10" cy="20" r="1.5" fill="#3B82F6" stroke={IP.ink} strokeWidth=".3"/>
        <circle cx="15" cy="20" r="1.5" fill="#10B981" stroke={IP.ink} strokeWidth=".3"/>
        <circle cx="20" cy="20" r="1.5" fill="#FACC15" stroke={IP.ink} strokeWidth=".3"/>
        {/* gauge */}
        <rect x="2" y="24" width="20" height="5" fill="#fff" stroke={IP.ink} strokeWidth=".4"/>
        <rect x="3" y="25" width="6" height="3" fill="#0F1A24"/>
        <text x="6" y="27" fontSize="2" fill="#10B981" textAnchor="middle" fontFamily="monospace">5.2</text>
        <rect x="11" y="25" width="6" height="3" fill="#0F1A24"/>
        <text x="14" y="27" fontSize="2" fill="#FACC15" textAnchor="middle" fontFamily="monospace">98%</text>
        {/* gas cylinder (small green tank) on left side */}
        <ellipse cx="2.5" cy="30" rx="2" ry=".8" fill="#15803D" stroke={IP.ink} strokeWidth=".3"/>
        <rect x=".5" y="30" width="4" height="6" fill="#16A34A" stroke={IP.ink} strokeWidth=".3"/>
        <ellipse cx="2.5" cy="36" rx="2" ry=".8" fill="#15803D" stroke={IP.ink} strokeWidth=".3"/>
        {/* cart bottom */}
        <rect x="1" y="29" width="22" height="9" fill="#6B7280" stroke={IP.ink} strokeWidth=".4"/>
        <rect x="5" y="30" width="17" height="3" fill="#fff" stroke={IP.ink} strokeWidth=".3"/>
        <rect x="5" y="34" width="17" height="3" fill="#fff" stroke={IP.ink} strokeWidth=".3"/>
        {/* wheels */}
        <ellipse cx="3" cy="40" rx="2" ry="1.5" fill={IP.ink}/>
        <ellipse cx="21" cy="40" rx="2" ry="1.5" fill={IP.ink}/>
      </svg>
    </div>
  );
}

// ─── Instrument Tray v2 — Mayo stand with sterile drape + tools ────
function InstrumentTray({ x, y }) {
  return (
    <div style={{ position: 'absolute', left: x * ITILE, top: y * ITILE - 6, width: ITILE * 1.8, height: ITILE * 1.4, filter: 'drop-shadow(2px 3px 0 rgba(0,0,0,.25))' }}>
      <svg viewBox="0 0 28 22" width={ITILE * 1.8} height={ITILE * 1.4} shapeRendering="crispEdges">
        {/* tray top (oval) */}
        <ellipse cx="14" cy="5" rx="13" ry="3" fill="#A5D8E8" stroke={IP.ink} strokeWidth=".5"/>
        {/* tray top highlight */}
        <ellipse cx="14" cy="4" rx="12" ry="2" fill="#C8E5F0"/>
        {/* sterile drape pattern */}
        <line x1="3" y1="5" x2="25" y2="5" stroke={IP.ink} strokeWidth=".2" opacity=".3"/>
        {/* tray FRONT face */}
        <path d="M 1 5 L 27 5 L 25 11 L 3 11 Z" fill="#7DBFD9" stroke={IP.ink} strokeWidth=".4"/>
        {/* drape hanging */}
        <path d="M 3 11 L 25 11 L 24 13 L 4 13 Z" fill="#A5D8E8" stroke={IP.ink} strokeWidth=".3"/>
        {/* instruments on top */}
        <rect x="4" y="3" width="10" height="1.2" fill="#9CA3AF" stroke={IP.ink} strokeWidth=".25"/>
        <rect x="3" y="3.2" width="2" height=".7" fill="#374151"/>
        <rect x="6" y="2" width="8" height=".8" fill="#9CA3AF" stroke={IP.ink} strokeWidth=".25"/>
        <rect x="16" y="3" width="6" height="1" fill="#9CA3AF" stroke={IP.ink} strokeWidth=".25"/>
        <rect x="22" y="3.2" width="2" height=".7" fill="#374151"/>
        <rect x="17" y="4.5" width="7" height=".7" fill="#9CA3AF"/>
        {/* tray legs (single chrome pole) */}
        <rect x="13" y="13" width="2" height="7" fill="#9CA3AF" stroke={IP.ink} strokeWidth=".3"/>
        <rect x="13.3" y="13.2" width=".7" height="6.5" fill="#CBD5E1"/>
        {/* base wheels */}
        <ellipse cx="14" cy="20" rx="6" ry="1.5" fill="#4B5563" stroke={IP.ink} strokeWidth=".3"/>
        <circle cx="9" cy="21" r="1.2" fill={IP.ink}/>
        <circle cx="19" cy="21" r="1.2" fill={IP.ink}/>
      </svg>
    </div>
  );
}

function StatusBoard({ x, y }) {
  return (
    <div style={{ position: 'absolute', left: x * ITILE, top: y * ITILE, width: ITILE * 6, height: ITILE * 1.4, background: '#0F1A24', border: `2.5px solid ${IP.ink}`, boxShadow: `3px 3px 0 0 ${IP.ink}` }}>
      <div style={{ display: 'flex', height: '100%' }}>
        <div style={{ flex: 1, borderRight: `1px solid ${IP.ink}99`, padding: 2 }}>
          <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 6, color: '#94A3B8' }}>TIME</div>
          <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: '#22D3EE' }}>09:42</div>
        </div>
        <div style={{ flex: 1, borderRight: `1px solid ${IP.ink}99`, padding: 2 }}>
          <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 6, color: '#94A3B8' }}>ELAPSED</div>
          <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: '#FACC15' }}>0:38</div>
        </div>
        <div style={{ flex: 1.4, padding: 2 }}>
          <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 6, color: '#94A3B8' }}>NEXT</div>
          <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 8, color: '#10B981' }}>LEE · INGUINAL HERNIA</div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  ScreenInteriorOR,
  SurgicalLight, AnesthesiaMachine, InstrumentTray, StatusBoard,
  SinkOR: Sink, // OR-style scrub sink (avoid clobber with ER Sink)
});
