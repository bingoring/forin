// interior-ward.jsx — 일반 내과 병동 (Internal Medicine inpatient WARD).
// 28×52 tiles, vertical flow for the phone frame. NOT the outpatient 내과 clinic
// (that's ScreenInteriorInternal in interior-clinics.jsx) — this is the 6F 일반
// 병동 with a central nursing station, multi-bed chronic-care room, contact-
// isolation room, and clean/dirty utility + linen rooms.
//
//   ┌ 린넨·배식 ┬ 클린 유틸 ┬ 더티 유틸 ┐   (서비스 스트립)
//   ├──────── 중앙 간호 스테이션 · 복도 ────┤   (컨트롤 타워 + 핸드레일)
//   ├──────── 4인용 일반 병실 (A·B·C·D) ───┤   (만성질환, 커튼 분리)
//   ├ 1인실 ──────────┬ VRE 접촉 격리실 ───┤
//   └─────────────────┴──────────────────┘
//
// New blueprint objects live in interior-objects-ward2.jsx; cross-dept objects
// (NurseStationDesk, VitalsCart, CompCart, WasteBin, ChartBinder, PneumaticTube,
// BarcodeScanner, SinkOR, OxygenTank) resolve at render time.

function ScreenInteriorWard() {
  const COLS = 28, ROWS = 46;
  const Th = window.IThreshold;
  const W = window;

  const regions = [
    { id: 'linen',   name: '린넨실 · 배식실',       icon: '🍱', bounds: { x: 0,  y: 0,  w: 10, h: 11 } },
    { id: 'clean',   name: 'Clean Utility · 물품',  icon: '📦', bounds: { x: 9,  y: 0,  w: 10, h: 11 } },
    { id: 'dirty',   name: 'Dirty Utility · 오염',  icon: '☣️', bounds: { x: 18, y: 0,  w: 10, h: 11 } },
    { id: 'station', name: '중앙 간호 스테이션',     icon: '🖥', bounds: { x: 0,  y: 10, w: 28, h: 11 } },
    { id: 'room4',   name: '4인용 일반 병실',        icon: '🛏', bounds: { x: 0,  y: 20, w: 28, h: 11 } },
    { id: 'private', name: '1인실',                 icon: '🚪', bounds: { x: 0,  y: 31, w: 14, h: 15 } },
    { id: 'iso',     name: 'VRE 접촉 격리실',        icon: '⚠️', bounds: { x: 13, y: 31, w: 15, h: 15 } },
  ];

  const rooms = [
    { id: 'linen',   name: '린넨·배식실', sub: '시트·식이',   icon: '🍱', color: '#FED7AA', x: 4,  y: 5 },
    { id: 'clean',   name: 'Clean Utility', sub: '물품·수액', icon: '📦', color: '#A7F3D0', x: 13, y: 5,  questCount: 1 },
    { id: 'dirty',   name: 'Dirty Utility', sub: '오염 처리', icon: '☣️', color: '#FDE68A', x: 22, y: 5 },
    { id: 'station', name: '간호 스테이션', sub: 'Hand-off·회진', icon: '🖥', color: '#BAE6FD', x: 13, y: 15, questCount: 1 },
    { id: 'room4',   name: '4인용 병실',   sub: '만성질환 케어', icon: '🛏', color: '#FBCFE8', x: 13, y: 27, questCount: 2 },
    { id: 'private', name: '1인실',        sub: '면역저하',   icon: '🚪', color: '#DDD6FE', x: 6,  y: 40 },
    { id: 'iso',     name: 'VRE 격리실',   sub: '접촉 격리',  icon: '⚠️', color: '#FCA5A5', x: 21, y: 40, questCount: 1 },
  ];

  return (
    <InteriorScreen
      label="06f Interior · WARD" deptCode="일반 내과 병동 · 6F" deptColor="#E08A2B"
      cols={COLS} rows={ROWS} floor="internal"
      playerStart={{ x: 4, y: 15 }}
      rooms={rooms}
      regions={regions}
      missionText="4인실 Bed B · 식전 혈당(BST) 측정 + 투약"
      render={() => (
        <>
          {/* ═══════════════ OUTER WALLS ═══════════════ */}
          <IWall x={0} y={0} w={28} h={1}/>
          <IWall x={0} y={1} w={1} h={13}/>
          <IDoor x={0} y={14} w={1} h={3} kind="auto" label="← 캠퍼스로"/>
          <IWall x={0} y={17} w={1} h={28}/>
          <IWall x={27} y={1} w={1} h={44}/>
          <IWall x={0} y={45} w={28} h={1}/>

          {/* ═══ SERVICE STRIP DIVIDERS (y10) ═══ */}
          <IWall x={1}  y={10} w={4} h={1}/>
          <Th    x={5}  y={10} w={2} h={1} label="→ 복도"/>
          <IWall x={7}  y={10} w={6} h={1}/>
          <Th    x={13} y={10} w={2} h={1} label="→ 복도"/>
          <IWall x={15} y={10} w={6} h={1}/>
          <Th    x={21} y={10} w={2} h={1}/>
          <IWall x={23} y={10} w={4} h={1}/>
          {/* service vertical dividers */}
          <IWall x={9}  y={1} w={1} h={5}/>
          <Th    x={9}  y={6} w={1} h={3}/>
          <IWall x={9}  y={9} w={1} h={1}/>
          <IWall x={18} y={1} w={1} h={5}/>
          <Th    x={18} y={6} w={1} h={3}/>
          <IWall x={18} y={9} w={1} h={1}/>

          {/* ═══ STATION / ROOM4 DIVIDER (y20) ═══ */}
          <IWall x={1}  y={20} w={6} h={1}/>
          <Th    x={7}  y={20} w={3} h={1}/>
          <IWall x={10} y={20} w={8} h={1}/>
          <Th    x={18} y={20} w={3} h={1}/>
          <IWall x={21} y={20} w={6} h={1}/>

          {/* ═══ ROOM4 / LOWER DIVIDER (y31) ═══ */}
          <IWall x={1}  y={31} w={5} h={1}/>
          <Th    x={6}  y={31} w={2} h={1} label="→ 1인실"/>
          <IWall x={8}  y={31} w={11} h={1}/>
          <Th    x={19} y={31} w={2} h={1} label="→ 격리"/>
          <IWall x={21} y={31} w={6} h={1}/>
          {/* private | isolation divider */}
          <IWall x={13} y={32} w={1} h={13}/>

          {/* ════════════════ 린넨실 · 배식실 (y1-9) ════════════════ */}
          <BayLabel x={1} y={1} text="린넨 · 배식실"/>
          <ICabinet x={1} y={2} w={3} variant="linen" label="LINEN"/>
          <ICabinet x={5} y={2} w={3} variant="linen"/>
          <MealCart x={2} y={5}/>
          <ICabinet x={6} y={6} w={2} variant="supply"/>
          <INpc x={4} y={8} kind="nurse" hair="#7C3F00" shirt="#FED7AA"/>
          <IHotspot x={2} y={5} kind="info" label="식이 배식"/>

          {/* ════════════════ Clean Utility (y1-9) ════════════════ */}
          <BayLabel x={10} y={1} text="CLEAN UTILITY"/>
          <W.SupplyBasketShelf x={10} y={2} w={4} shelves={4}/>
          <W.IVStorageCart x={10} y={6}/>
          <IReception x={14} y={7} w={3} h={1} label="투약 준비"/>
          <W.BarcodeScanner x={16} y={6}/>
          <INpc x={12} y={8} kind="nurse" hair="#3C2A18" shirt="#A7F3D0"/>
          <IHotspot x={11} y={6} kind="quest" label="수액 라벨 출력"/>

          {/* ════════════════ Dirty Utility (y1-9) ════════════════ */}
          <BayLabel x={19} y={1} text="DIRTY UTILITY"/>
          <W.SluiceSink x={19} y={3}/>
          <WasteBin x={22} y={2} tone="infectious"/>
          <SharpsBin x={24} y={2}/>
          <W.LinenHamper x={19} y={6}/>
          <W.LinenHamper x={22} y={6} tone="clean"/>
          <IHotspot x={20} y={3} kind="info" label="오염물 처리"/>

          {/* ════════════════ 중앙 간호 스테이션 · 복도 (y11-19) ════════════════ */}
          <BayLabel x={1} y={11} text="CENTRAL NURSING STATION" highlight/>
          {/* corridor handrails along both side walls */}
          <W.Handrail x={27} y={11} w={1} h={8} vertical/>
          {/* big ㄷ-shape nurse station desk, center */}
          <NurseStationDesk x={8} y={12} w={12} h={5}/>
          {/* pneumatic tube inbox + PDA chargers on the back */}
          <W.PneumaticTube x={5} y={11}/>
          <ChartBinder x={20} y={12}/>
          <DeskPhone x={9} y={12}/>
          <DeskPhone x={17} y={12}/>
          {/* two parked vital-sign carts in the hallway */}
          <W.VitalsCart x={3} y={16}/>
          <W.VitalsCart x={23} y={16}/>
          {/* team: charge nurse (critical-value call) + resident (verbal order) */}
          <INpc x={11} y={15} kind="nurse"  hair="#3C2A18" shirt="#A5D8E8"/>
          <IHotspot x={11} y={14} kind="urgent" label="Critical Value 콜"/>
          <INpc x={15} y={15} kind="doctor" hair="#1F2937"/>
          <IHotspot x={15} y={14} kind="info" label="구두 처방"/>
          <INpc x={5} y={18} kind="nurse" hair="#9A6B3F" shirt="#A7F3D0"/>

          {/* ════════════════ 4인용 일반 병실 (y21-34) ════════════════ */}
          <BayLabel x={1} y={21} text="4-BED ROOM · 만성질환"/>
          {/* Bed A — COPD (호흡기) */}
          <IBed x={2} y={23} variant="ward" occupied label="A · COPD"/>
          <W.O2Flowmeter x={1} y={23}/>
          <W.Nebulizer x={5} y={23}/>
          <IMonitor x={6} y={22}/>
          <IHotspot x={3} y={23} kind="info" label="산소 유량 확인"/>
          {/* Bed B — 당뇨/욕창 (BST 미션) */}
          <IBed x={9} y={23} variant="ward" occupied label="B · DM"/>
          <W.AirMattress x={12} y={23}/>
          <W.FallRiskSign x={9} y={26}/>
          <W.VitalsCart x={13} y={25}/>
          <INpc x={12} y={26} kind="nurse" hair="#3C2A18" shirt="#A5D8E8"/>
          <IHotspot x={9} y={23} kind="quest" label="식전 혈당(BST)"/>
          {/* Bed C — 간경변 (복수) */}
          <IBed x={17} y={23} variant="ward" occupied label="C · 간경변"/>
          <IIV x={20} y={23}/>
          <IChair x={21} y={25} color="#FED7AA" facing="left"/>
          <INpc x={21} y={26} kind="parent" hair="#5C3A1A"/>
          <IHotspot x={17} y={23} kind="info" label="복수 사정"/>
          {/* Bed D — 내시경 후 NPO */}
          <IBed x={24} y={23} variant="ward" occupied label="D · NPO"/>
          <W.NPOBoard x={24} y={22}/>
          <IMonitor x={26} y={23} beep/>
          {/* curtains splitting the bays */}
          <ICurtain x={8}  y={22} w={1} h={6} color="#BFE3EE"/>
          <ICurtain x={16} y={22} w={1} h={6} color="#BFE3EE"/>
          <ICurtain x={23} y={22} w={1} h={6} color="#BFE3EE"/>
          {/* rounding doctor */}
          <INpc x={3} y={29} kind="doctor" hair="#1F2937"/>

          {/* ════════════════ 1인실 (private, y32-44) ════════════════ */}
          <BayLabel x={1} y={32} text="1인실 · PRIVATE"/>
          <IBed x={3} y={34} variant="ward" occupied label="PRIVATE"/>
          <IMonitor x={2} y={34} beep/>
          <IIV x={6} y={34}/>
          <W.WallTV x={2} y={39} w={2}/>
          <IChair x={8} y={36} color="#FED7AA" facing="left"/>
          <window.Sofa x={8} y={41} w={3} color="#9CB4C8"/>
          <INpc x={9} y={37} kind="parent" hair="#3C2A18"/>
          <INpc x={5} y={38} kind="nurse"  hair="#7C3F00" shirt="#A5D8E8"/>
          <IHotspot x={4} y={34} kind="info" label="면역저하 케어"/>
          <IPlant x={11} y={43}/>

          {/* ════════════════ VRE 접촉 격리실 (iso, y32-44) ════════════════ */}
          <BayLabel x={14} y={32} text="VRE 접촉 격리실" highlight/>
          {/* yellow isolation sign on the door + cart OUTSIDE the room */}
          <IsoSign x={19} y={31}/>
          <W.IsolationCart x={15} y={33}/>
          {/* student nurse gowning at the cart, just outside */}
          <INpc x={17} y={35} kind="nurse" hair="#3C2A18" shirt="#FEF9C3"/>
          <IHotspot x={15} y={33} kind="quest" label="가운·장갑 착용"/>
          {/* inside: isolated patient watching TV, dedicated equipment */}
          <IBed x={22} y={34} variant="ward" occupied label="VRE"/>
          <IMonitor x={26} y={34}/>
          <W.WallTV x={24} y={32} w={2}/>
          <DedicatedBP x={22} y={38}/>
          <WasteBin x={20} y={39} tone="infectious"/>
          <IHotspot x={22} y={34} kind="info" label="전용 의료기기"/>
        </>
      )}
    />
  );
}

// ─── Meal cart — 배식 카트 (trays) ─────────────────────────────────
function MealCart({ x, y }) {
  return (
    <div style={{ position: 'absolute', left: x * ITILE, top: y * ITILE - 2, width: ITILE * 1.6, height: ITILE * 1.8 }}>
      <svg viewBox="0 0 26 30" width={ITILE * 1.6} height={ITILE * 1.8} shapeRendering="crispEdges">
          <ellipse cx="13.0" cy="28" rx="8.8" ry="3" fill="rgba(0,0,0,.16)"/>
        <rect x="2" y="2" width="22" height="24" fill="#CBD5E1" stroke={IP.ink} strokeWidth=".6"/>
        {/* tray slots */}
        {[0,1,2,3].map(i => (
          <g key={i}>
            <rect x="3" y={4 + i*5.5} width="20" height="4.5" fill="#E5E7EB" stroke={IP.ink} strokeWidth=".4"/>
            <rect x="5" y={5 + i*5.5} width="6" height="2.5" fill="#FBBF24"/>
            <rect x="12" y={5 + i*5.5} width="4" height="2.5" fill="#A7F3D0"/>
            <rect x="17" y={5 + i*5.5} width="3" height="2.5" fill="#FCA5A5"/>
          </g>
        ))}
        <ellipse cx="6" cy="28" rx="2.2" ry="1.6" fill={IP.ink}/>
        <ellipse cx="20" cy="28" rx="2.2" ry="1.6" fill={IP.ink}/>
      </svg>
    </div>
  );
}

// ─── Sharps bin — 주삿바늘 수거함 ──────────────────────────────────
function SharpsBin({ x, y }) {
  return (
    <div style={{ position: 'absolute', left: x * ITILE + 3, top: y * ITILE + 2, width: ITILE - 6, height: ITILE - 2 }}>
      <svg viewBox="0 0 10 12" width={ITILE - 6} height={ITILE - 2} shapeRendering="crispEdges">
          <ellipse cx="5.0" cy="11.0" rx="3.4" ry="2" fill="rgba(0,0,0,.16)"/>
        <rect x="1" y="0" width="8" height="3" fill="#B45309" stroke={IP.ink} strokeWidth=".4"/>
        <rect x="3" y="1" width="4" height="1.2" fill="#0F1A24"/>
        <rect x="1" y="3" width="8" height="8" fill="#FACC15" stroke={IP.ink} strokeWidth=".5"/>
        <text x="5" y="8" fontSize="3.2" fill={IP.ink} textAnchor="middle" fontFamily="monospace">☣</text>
      </svg>
    </div>
  );
}

// ─── Isolation door sign — 노란 격리 표지판 ────────────────────────
function IsoSign({ x, y }) {
  return (
    <div style={{ position: 'absolute', left: x * ITILE - 4, top: y * ITILE - 14, zIndex: 4 }}>
      <div style={{ background: '#FACC15', border: `2.5px solid #DC2626`, padding: '2px 5px', fontFamily: '"DungGeunMo",monospace', fontSize: 8, color: '#7F1D1D', boxShadow: `2px 2px 0 0 ${IP.ink}`, textAlign: 'center', lineHeight: 1.2 }}>
        CONTACT<br/>ISOLATION
      </div>
    </div>
  );
}

// ─── Dedicated BP (격리실 전용 혈압계) ─────────────────────────────
function DedicatedBP({ x, y }) {
  return (
    <div style={{ position: 'absolute', left: x * ITILE, top: y * ITILE - 12, width: ITILE, height: ITILE * 2.2 }}>
      <svg viewBox="0 0 16 36" width={ITILE} height={ITILE * 2.2} shapeRendering="crispEdges">
          <ellipse cx="8.0" cy="35.0" rx="5.4" ry="2" fill="rgba(0,0,0,.16)"/>
        <rect x="4" y="20" width="2" height="14" fill="#CBD5E1" stroke={IP.ink} strokeWidth=".3"/>
        <rect x="2" y="6" width="12" height="11" fill="#475569" stroke={IP.ink} strokeWidth=".5"/>
        <rect x="3" y="7.5" width="10" height="6" fill="#0F1A24"/>
        <text x="8" y="11.5" fontSize="3.4" fill="#22D3EE" textAnchor="middle" fontFamily="monospace">120</text>
        {/* cuff */}
        <rect x="10" y="17" width="5" height="4" rx="1" fill="#FACC15" stroke={IP.ink} strokeWidth=".4"/>
        <ellipse cx="5" cy="34" rx="4" ry="1.6" fill="#6B7280" stroke={IP.ink} strokeWidth=".4"/>
        {/* yellow 'isolation only' tag */}
        <rect x="1" y="3" width="9" height="3" fill="#FACC15" stroke={IP.ink} strokeWidth=".3"/>
      </svg>
    </div>
  );
}

Object.assign(window, {
  ScreenInteriorWard,
  MealCart, SharpsBin, IsoSign, DedicatedBP,
});
