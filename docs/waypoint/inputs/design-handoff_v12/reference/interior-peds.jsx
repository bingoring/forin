// interior-peds.jsx — Pediatrics & Neonatal Center, rebuilt to the master
// blueprint. 34×48 tiles. Colorful & friendly up front; clinically precise
// inside. Outpatient/play → pediatric ward (fall-prevention cribs + micro-
// dosing station) → innermost NICU (gowning anteroom + incubator zone).
//
//   ┌──── 외래 대기 · 놀이 · 계측 · 접수 ────┐
//   ├ 소아 진료실 ┬──── 소아 병동 (4인실) ────┤
//   ├ NICU 전실 ╎────── NICU 인큐베이터 존 ───┤
//   └────────────┴───────────────────────────┘
//
// New blueprint objects live in interior-objects-peds2.jsx; cross-dept objects
// (IVPump, SinkOR, ScrubDispenser, GownBox, ClinicReception, NurseDeskI) resolve
// at render time.

function ScreenInteriorPeds() {
  const COLS = 34, ROWS = 48;
  const Th = window.IThreshold;
  const Tint = window.Tint;

  const regions = [
    { id: 'welcome', name: '외래 · 대기 · 놀이', icon: '🌈', bounds: { x: 0,  y: 0,  w: 34, h: 15 } },
    { id: 'exam',    name: '소아 진료실',        icon: '🩺', bounds: { x: 0,  y: 14, w: 12, h: 16 } },
    { id: 'ward',    name: '소아 병동',          icon: '🛏', bounds: { x: 11, y: 14, w: 23, h: 16 } },
    { id: 'ante',    name: 'NICU 전실 · 세척',   icon: '🧼', bounds: { x: 0,  y: 29, w: 10, h: 19 } },
    { id: 'nicu',    name: 'NICU 인큐베이터 존',  icon: '👶', bounds: { x: 9,  y: 29, w: 25, h: 19 } },
  ];

  const rooms = [
    { id: 'welcome', name: '외래 대기·놀이', sub: '접수·계측·놀이방', icon: '🌈', color: '#FBCFE8', x: 16, y: 6,  questCount: 1 },
    { id: 'exam',    name: '소아 진료실',   sub: '성장·문진',     icon: '🩺', color: '#BAE6FD', x: 5,  y: 22, questCount: 1 },
    { id: 'ward',    name: '소아 병동',     sub: '크립·투약',     icon: '🛏', color: '#FED7AA', x: 22, y: 24, questCount: 1 },
    { id: 'ante',    name: 'NICU 전실',     sub: '3분 스크럽',    icon: '🧼', color: '#A7F3D0', x: 4,  y: 38 },
    { id: 'nicu',    name: 'NICU',          sub: '인큐베이터 3',  icon: '👶', color: '#C7D2FE', x: 20, y: 38, questCount: 1 },
  ];

  return (
    <InteriorScreen
      label="06c Interior · PEDS" deptCode="소아청소년 센터 · 4F" deptColor="#3B82F6"
      cols={COLS} rows={ROWS} floor="peds"
      playerStart={{ x: 18, y: 20 }}
      rooms={rooms}
      regions={regions}
      missionText="소아 병동 · 체중 기반 투약 소분 도와주기"
      render={() => (
        <>
          {/* NICU low-light tint */}
          <Tint x={1} y={30} w={32} h={16} color="#1E2A40" op={0.15}/>

          {/* ═══════════════ OUTER WALLS ═══════════════ */}
          <IWall x={0}  y={0} w={15} h={1}/>
          <IDoor x={15} y={0} w={3}  h={1} kind="auto" label="↓ 캠퍼스로"/>
          <IWall x={18} y={0} w={16} h={1}/>
          <IWall x={0}  y={1}  w={1}  h={46}/>
          <IWall x={33} y={1}  w={1}  h={46}/>
          <IWall x={0}  y={47} w={34} h={1}/>

          {/* DIVIDER y14 (welcome / exam+ward) */}
          <IWall x={1}  y={14} w={4}  h={1}/>
          <Th    x={5}  y={14} w={3}  h={1} label="→ 진료실"/>
          <IWall x={8}  y={14} w={8}  h={1}/>
          <Th    x={16} y={14} w={3}  h={1} label="→ 병동"/>
          <IWall x={19} y={14} w={14} h={1}/>
          {/* exam | ward divider (x11) */}
          <IWall x={11} y={15} w={1} h={5}/>
          <Th    x={11} y={20} w={1} h={3}/>
          <IWall x={11} y={23} w={1} h={6}/>

          {/* DIVIDER y29 (mid / NICU) */}
          <IWall x={1}  y={29} w={4}  h={1}/>
          <Th    x={5}  y={29} w={3}  h={1} label="→ NICU 전실"/>
          <IWall x={8}  y={29} w={25} h={1}/>
          {/* NICU anteroom | incubator zone (glass + sterile scrub threshold) */}
          <IGlass x={9} y={30} w={1} h={4}/>
          <Th     x={9} y={34} w={1} h={3} tone="sterile" label="스크럽 후 입장"/>
          <IGlass x={9} y={37} w={1} h={9}/>

          {/* ════════════════ WELCOME · 외래 (y1-13) ════════════════ */}
          <BayLabel x={1} y={1} text="환영 · 외래 · 4F"/>
          {/* reception (real reception desk = ClinicReception) */}
          <window.ClinicReception x={13} y={3} w={6} tone="#DB2777" label="접수"/>
          <INpc x={14} y={6} kind="nurse" hair="#5C3A1A" shirt="#FBCFE8"/>
          <INpc x={16} y={6} kind="nurse" hair="#3C2A18" shirt="#A7F3D0"/>

          {/* growth assessment (left) */}
          <BayLabel x={1} y={2} text="계측"/>
          <window.BabyScale x={2} y={4}/>
          <window.StadiometerScale x={5} y={4}/>
          <BPCuff x={1} y={6}/>
          <INpc x={3} y={8} kind="nurse" hair="#7C3F00" shirt="#A5D8E8"/>
          <IHotspot x={3} y={7} kind="info" label="성장 계측"/>

          {/* play area (right) */}
          <BayLabel x={26} y={1} text="PLAY" highlight/>
          <div style={{ position: 'absolute', left: 20 * ITILE + 2, top: 3 * ITILE + 2, width: 12 * ITILE - 4, height: 8 * ITILE - 4, background: '#FED7AA', border: `2px dashed ${IP.ink}55` }}/>
          <SmallSlide x={29} y={3}/>
          <Blocks x={24} y={5}/>
          <RockingHorse x={21} y={6}/>
          <ToyChest x={30} y={6}/>
          <Mural x={20} y={1}/>
          <Balloon x={22} y={2} c="#EF4444"/>
          <Balloon x={23} y={1.5} c="#3B82F6"/>
          <Balloon x={24} y={2.5} c="#10B981"/>
          <INpc x={25} y={8} kind="child"  hair="#FACC15"/>
          <INpc x={27} y={8} kind="child"  hair="#3C2A18"/>
          <INpc x={29} y={9} kind="parent" hair="#5C3A1A"/>
          <IHotspot x={25} y={7} kind="info" label="놀이방"/>

          {/* waiting chairs + families (center-bottom of welcome) */}
          {[2,4,6,8].map((cx,i) => <IChair key={'wc'+i} x={cx} y={11} color={['#FBCFE8','#BAE6FD','#FEF08A','#BBF7D0'][i]} facing="up"/>)}
          <INpc x={3} y={10.5} kind="parent" hair="#3C2A18"/>
          <INpc x={5} y={10.5} kind="child"  hair="#7C3F00"/>
          <IPlant x={1} y={12}/>
          <IPlant x={31} y={11}/>

          {/* ════════════════ 소아 진료실 (exam, y15-28) ════════════════ */}
          <BayLabel x={1} y={15} text="EXAM · 소아 진료실"/>
          {/* exam bed w/ steps + high guard */}
          <IBed x={2} y={17} variant="ward" label="EXAM"/>
          <IMonitor x={1} y={17}/>
          {/* doctor desk (white) + growth-curve PC */}
          <IReception x={6} y={18} w={3} h={1} label="진료"/>
          <IMonitor x={9} y={17}/>
          <window.TongueDepressorJar x={6} y={16}/>
          <window.StickerRoll x={8} y={16}/>
          <INpc x={4} y={24} kind="doctor" hair="#3C2A18"/>
          <INpc x={6} y={25} kind="child"  hair="#9A6B3F"/>
          <INpc x={7} y={24} kind="parent" hair="#5C3A1A"/>
          <IChair x={9} y={24} color="#BAE6FD" facing="up"/>
          <IHotspot x={3} y={17} kind="quest" label="성장 문진"/>
          <IPlant x={10} y={27}/>

          {/* ════════════════ 소아 병동 (ward, y15-28) ════════════════ */}
          <BayLabel x={12} y={15} text="PEDIATRIC WARD"/>
          {/* nursing station (micro-dosing) */}
          <NurseDeskI x={12} y={16} w={6} h={2} label="PEDS STATION"/>
          <window.DosingChart x={19} y={15} w={2}/>
          <window.StickerRoll x={22} y={16}/>
          <INpc x={13} y={20} kind="nurse" hair="#3C2A18"/>
          <INpc x={15} y={20} kind="nurse" hair="#7C3F00" shirt="#A7D7B0"/>
          <INpc x={17} y={20} kind="nurse" hair="#5C3A1A" shirt="#FBCFE8"/>
          <INpc x={19} y={21} kind="parent" hair="#9A6B3F"/>
          <IHotspot x={14} y={19} kind="quest" label="투약 소분"/>
          {/* 4-bed room: 2 metal cribs + 2 ward beds */}
          <window.MetalCrib x={13} y={23} occupied stuffie="🐻"/>
          <window.MetalCrib x={17} y={23} occupied stuffie="🦊"/>
          <IBed x={24} y={23} variant="ward" occupied/>
          <IBed x={28} y={23} variant="peds" occupied/>
          <window.IVBoard x={13} y={24}/>
          <window.IVPump x={16} y={23}/>
          <window.IVPump x={20} y={23}/>
          <window.IVPump x={27} y={23}/>
          <IMonitor x={12} y={23} beep/>
          <INpc x={22} y={26} kind="parent" hair="#3C2A18"/>
          <INpc x={31} y={26} kind="parent" hair="#7C3F00"/>
          <INpc x={23} y={25} kind="doctor" hair="#1F2937"/>
          <INpc x={25} y={26} kind="nurse"  hair="#3C2A18" shirt="#A5D8E8"/>
          <IHotspot x={24} y={23} kind="info" label="회진 · 촉진"/>
          <IPlant x={32} y={27}/>

          {/* ════════════════ NICU 전실 (ante, y30-46) ════════════════ */}
          <BayLabel x={1} y={30} text="NICU 전실 · SCRUB"/>
          <window.SinkOR x={2} y={33}/>
          <window.ScrubDispenser x={6} y={33}/>
          <window.GownBox x={1} y={37}/>
          <HandSanitizer x={7} y={36}/>
          <BayLabel x={1} y={41} text="3분 스크럽 후 입장" highlight/>
          <INpc x={4} y={43} kind="nurse" hair="#3C2A18" shirt="#FEF9C3"/>
          <IHotspot x={3} y={36} kind="info" label="손 위생 3분"/>

          {/* ════════════════ NICU 인큐베이터 존 (nicu, y30-46) ════════════════ */}
          <BayLabel x={10} y={30} text="NICU · INCUBATOR ZONE"/>
          <window.PhototherapyLamp x={11} y={32} w={2}/>
          <window.PhototherapyLamp x={18} y={32} w={2}/>
          <window.PhototherapyLamp x={25} y={32} w={2}/>
          <window.Incubator x={11} y={35}/>
          <window.Incubator x={18} y={35}/>
          <window.Incubator x={25} y={35}/>
          <IMonitor x={10} y={35} beep/>
          <IMonitor x={17} y={35} beep/>
          <IMonitor x={24} y={35} beep/>
          <window.MilkFridge x={30} y={34}/>
          <INpc x={14} y={40} kind="nurse" hair="#3C2A18" shirt="#FEF9C3"/>
          <INpc x={22} y={41} kind="nurse" hair="#7C3F00" shirt="#FEF9C3"/>
          <IHotspot x={12} y={35} kind="quest" label="위관영양"/>
          <IHotspot x={22} y={40} kind="info" label="바이탈 차팅"/>
        </>
      )}
    />
  );
}

function PedsBed({ x, y, occupied, stuffie }) {
  const C = IP.ink;
  return (
    <div style={{
      position: 'absolute', left: x * ITILE, top: y * ITILE,
      width: ITILE * 2, height: ITILE * 3,
      filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.22))',
    }}>
      <svg viewBox="0 0 32 48" width={ITILE * 2} height={ITILE * 3} shapeRendering="crispEdges">
        <rect x="2" y="0" width="28" height="2" fill="#F59E0B"/>
        <rect x="3" y="0.5" width="26" height="0.7" fill="#FBBF24"/>
        <rect x="2" y="2" width="28" height="6" fill="#FBBF77"/>
        {[5,9,13,17,21,25].map(sx => <rect key={sx} x={sx} y="3" width="1" height="4" fill="#D97706"/>)}
        <rect x="2" y="2"  width="28" height="0.6" fill="#FCD34D"/>
        <rect x="2" y="7.4" width="28" height="0.6" fill="#B45309"/>
        <rect x="3" y="8" width="26" height="24" fill="#FDE4EE"/>
        <rect x="3" y="8" width="26" height="1" fill="#FFFFFF"/>
        <rect x="3" y="30" width="26" height="1.5" fill="#F0C8D9"/>
        <rect x="9"   y="10" width="14" height="4.5" fill="#FFFFFF"/>
        <rect x="8.3" y="11" width="0.7" height="2.5" fill="#FFFFFF"/>
        <rect x="22.8" y="11" width="0.7" height="2.5" fill="#FFFFFF"/>
        <rect x="10"  y="10.4" width="12" height="0.8" fill="#FEFEFE"/>
        <rect x="9"   y="13.4" width="14" height="1.1" fill="#E5E7EB"/>
        <rect x="15.7" y="11" width="0.5" height="3" fill="#D1D5DB" opacity=".6"/>
        <rect x="3" y="16" width="26" height="14" fill="#A7F3D0"/>
        <rect x="3" y="16" width="26" height="0.8" fill="#FFFFFF"/>
        <rect x="3" y="16.8" width="26" height="0.5" fill="#7DCEA0"/>
        <rect x="10" y="18" width="0.5" height="11" fill="#7DCEA0" opacity=".4"/>
        <rect x="16" y="18" width="0.5" height="11" fill="#7DCEA0" opacity=".25"/>
        <rect x="22" y="18" width="0.5" height="11" fill="#7DCEA0" opacity=".4"/>
        {occupied && (
          <g>
            <rect x="13" y="11" width="6" height="4" fill="#FDE1C8"/>
            <rect x="12" y="12" width="1" height="2" fill="#FDE1C8"/>
            <rect x="19" y="12" width="1" height="2" fill="#FDE1C8"/>
            <rect x="13" y="10.5" width="6" height="1" fill="#6B4423"/>
            <rect x="14" y="10" width="4" height="0.7" fill="#6B4423"/>
            <rect x="14" y="13" width="1" height="0.4" fill={C}/>
            <rect x="17" y="13" width="1" height="0.4" fill={C}/>
            <rect x="12.5" y="11"   width="0.4" height="4" fill={C} opacity=".5"/>
            <rect x="19.1" y="11"   width="0.4" height="4" fill={C} opacity=".5"/>
            <rect x="13"   y="14.7" width="6" height="0.4" fill={C} opacity=".5"/>
            <rect x="11" y="18" width="10" height="2" fill="#7DCEA0" opacity=".5"/>
          </g>
        )}
        <rect x="3" y="32" width="26" height="2" fill="#F0C8D9"/>
        <rect x="2" y="34" width="28" height="2" fill="#F59E0B"/>
        <rect x="3" y="34.5" width="26" height="0.7" fill="#FBBF24"/>
        <rect x="2" y="36" width="28" height="6" fill="#FBBF77"/>
        {[5,9,13,17,21,25].map(sx => <rect key={sx} x={sx} y="37" width="1" height="4" fill="#D97706"/>)}
        <rect x="2" y="36"  width="28" height="0.6" fill="#FCD34D"/>
        <rect x="2" y="41.4" width="28" height="0.6" fill="#B45309"/>
        <rect x="3" y="42" width="3" height="5" fill="#7C2D12"/>
        <rect x="26" y="42" width="3" height="5" fill="#7C2D12"/>
        <rect x="3.3" y="42.3" width="1" height="4.4" fill="#9A3412"/>
        <rect x="26.3" y="42.3" width="1" height="4.4" fill="#9A3412"/>
        <rect x="2"  y="8"  width="0.7" height="24" fill="#D97706"/>
        <rect x="29.3" y="8"  width="0.7" height="24" fill="#D97706"/>
      </svg>
      {stuffie && (
        <div style={{ position: 'absolute', right: 2, bottom: ITILE * 1.1, fontSize: 11, lineHeight: 1, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.3))' }}>{stuffie}</div>
      )}
    </div>
  );
}

function Balloon({ x, y, c }) {
  return (
    <div style={{ position: 'absolute', left: x * ITILE + 4, top: y * ITILE - 4, animation: 'forinBob 1.6s ease-in-out infinite' }}>
      <svg viewBox="0 0 8 14" width="12" height="20" shapeRendering="crispEdges">
        <ellipse cx="4" cy="4" rx="3" ry="4" fill={c} stroke={IP.ink} strokeWidth=".5"/>
        <rect x="4" y="8" width="0.5" height="6" fill={IP.ink}/>
      </svg>
    </div>
  );
}

function Mural({ x, y }) {
  return (
    <div style={{ position: 'absolute', left: x * ITILE, top: y * ITILE, width: ITILE * 4, height: ITILE * 2, background: '#FEF3C7', border: `2px solid ${IP.ink}`, padding: 2 }}>
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <div style={{ position: 'absolute', right: 4, top: 1, width: 6, height: 6, background: '#FACC15', border: `1px solid ${IP.ink}`, borderRadius: '50%' }}/>
        <div style={{ position: 'absolute', left: 8, top: 2, width: 14, height: 4, background: '#fff', border: `1px solid ${IP.ink}` }}/>
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 12, background: '#86EFAC', borderTop: `1px solid ${IP.ink}`,
          clipPath: 'polygon(0 60%, 30% 30%, 60% 70%, 100% 40%, 100% 100%, 0 100%)' }}/>
        <div style={{ position: 'absolute', left: 6, bottom: 2, width: 8, height: 5, background: '#FCA5A5', border: `1px solid ${IP.ink}` }}/>
      </div>
    </div>
  );
}

function ToyChest({ x, y }) {
  return (
    <div style={{ position: 'absolute', left: x * ITILE, top: y * ITILE - 4, width: ITILE * 2, height: ITILE * 1.7, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.22))' }}>
      <svg viewBox="0 0 32 28" width={ITILE * 2} height={ITILE * 1.7} shapeRendering="geometricPrecision">
        {/* continuous silhouette (top face + front band) */}
        <path d="M3 2 L29 2 Q30 2 30 3 L30 24 Q30 25 29 25 L3 25 Q2 25 2 24 L2 3 Q2 2 3 2 Z" fill="#8B4513"/>
        {/* TOP face — open chest showing toys inside */}
        <path d="M3 2 L29 2 Q30 2 30 3 L30 17 L2 17 L2 3 Q2 2 3 2 Z" fill="#A0531C"/>
        <rect x="4.5" y="3.8" width="23" height="11.5" rx="1.5" fill="#5E3210"/>{/* inner well */}
        <circle cx="9" cy="9.5" r="3" fill="#EF4444" stroke={IP.ink} strokeWidth=".4"/>
        <rect x="14" y="6.5" width="5" height="6" rx="1" fill="#3B82F6" stroke={IP.ink} strokeWidth=".4"/>
        <circle cx="23" cy="9.5" r="2.6" fill="#10B981" stroke={IP.ink} strokeWidth=".4"/>
        <rect x="18" y="9.5" width="4" height="4" fill="#FACC15" stroke={IP.ink} strokeWidth=".3"/>
        {/* seam top → front */}
        <line x1="2" y1="17" x2="30" y2="17" stroke={IP.ink} strokeWidth=".55"/>
        {/* FRONT band with wood plank + heart latch */}
        <rect x="3.5" y="18.4" width="25" height="1.3" fill="#A0531C"/>
        <path d="M16 20.2 l1.2 -1.2 a.9 .9 0 0 1 1.3 1.3 l-2.5 2.4 l-2.5 -2.4 a.9 .9 0 0 1 1.3 -1.3 z" fill="#FACC15" stroke={IP.ink} strokeWidth=".3"/>
        {/* re-stroke silhouette */}
        <path d="M3 2 L29 2 Q30 2 30 3 L30 24 Q30 25 29 25 L3 25 Q2 25 2 24 L2 3 Q2 2 3 2 Z" fill="none" stroke={IP.ink} strokeWidth=".7"/>
      </svg>
    </div>
  );
}

function Blocks({ x, y }) {
  return (
    <div style={{ position: 'absolute', left: x * ITILE, top: y * ITILE, width: ITILE * 1.2, height: ITILE * 0.8 }}>
      <div style={{ position: 'absolute', left: 0, top: 6, width: 6, height: 6, background: '#EF4444', border: `1px solid ${IP.ink}` }}/>
      <div style={{ position: 'absolute', left: 6, top: 4, width: 6, height: 8, background: '#3B82F6', border: `1px solid ${IP.ink}` }}/>
      <div style={{ position: 'absolute', left: 3, top: 0, width: 6, height: 6, background: '#FACC15', border: `1px solid ${IP.ink}` }}/>
      <div style={{ position: 'absolute', left: 12, top: 6, width: 6, height: 6, background: '#10B981', border: `1px solid ${IP.ink}` }}/>
    </div>
  );
}

function SmallSlide({ x, y }) {
  return (
    <div style={{ position: 'absolute', left: x * ITILE, top: y * ITILE - 6, width: ITILE * 2.6, height: ITILE * 2.4, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.22))' }}>
      <svg viewBox="0 0 42 38" width={ITILE * 2.6} height={ITILE * 2.4} shapeRendering="geometricPrecision">
        {/* ===== climbing ladder (back-right), seen from above-front ===== */}
        {/* two rails */}
        <path d="M33 15 L35.5 5" stroke="#4F7CC4" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M39 15 L41 5" stroke="#3A63A8" strokeWidth="1.8" strokeLinecap="round"/>
        {/* rungs */}
        <path d="M34.6 8.4 L40.2 8.4 M34 11 L39.6 11 M33.4 13.6 L39 13.6" stroke="#F4B740" strokeWidth="1.2" strokeLinecap="round"/>

        {/* ===== top platform (deck), a raised slab ===== */}
        {/* deck front thickness */}
        <path d="M20 16.5 L34 16.5 L34 20 Q34 20.6 33.4 20.6 L20.6 20.6 Q20 20.6 20 20 Z" fill="#C1443C"/>
        {/* deck top face */}
        <path d="M21 11 L35 11 L34 16.5 L20 16.5 Z" fill="#F87171" stroke={IP.ink} strokeWidth=".55"/>
        <path d="M22 12 L34 12" stroke="#FCA5A5" strokeWidth=".7"/>{/* deck plank highlight */}
        <line x1="20" y1="16.5" x2="34" y2="16.5" stroke={IP.ink} strokeWidth=".5"/>
        {/* safety guard rail behind the deck */}
        <path d="M21.5 11 L21.5 7 M27.5 11 L27.5 6.5 M34 11 L34 7" stroke="#4F7CC4" strokeWidth="1.2" strokeLinecap="round"/>
        <path d="M21 7.2 L34.4 6.6" stroke="#4F7CC4" strokeWidth="1.2" strokeLinecap="round"/>
        {/* platform legs */}
        <rect x="21" y="20" width="1.8" height="12" fill="#7C4A24" stroke={IP.ink} strokeWidth=".3"/>
        <rect x="31.5" y="20" width="1.8" height="12" fill="#7C4A24" stroke={IP.ink} strokeWidth=".3"/>
        <ellipse cx="21.9" cy="32.5" rx="1.6" ry=".8" fill="#5E3410"/>
        <ellipse cx="32.4" cy="32.5" rx="1.6" ry=".8" fill="#5E3410"/>

        {/* ===== the slide chute, curving down-left ===== */}
        {/* chute sliding surface (top) */}
        <path d="M20 12.5 L25.5 12.5 Q10 18 8.5 30 L2.5 30 Q4.5 17 20 12.5 Z" fill="#FCD34D" stroke={IP.ink} strokeWidth=".6"/>
        {/* inner sheen down the middle of the chute */}
        <path d="M21 13.6 Q9 19 7 29.4" fill="none" stroke="#FEF08A" strokeWidth="1.4" strokeLinecap="round"/>
        {/* raised side rail of the chute (left edge, catches light) */}
        <path d="M20 12.5 Q4.5 17 2.5 30" fill="none" stroke="#E0A020" strokeWidth="1.3" strokeLinecap="round"/>
        {/* run-out lip at the bottom (front thickness) */}
        <path d="M2.5 30 L8.5 30 L7.6 33.4 Q7.5 34 6.9 34 L2.2 34 Q1.6 34 1.7 33.4 Z" fill="#E0A020" stroke={IP.ink} strokeWidth=".5"/>
        <path d="M2.4 31 L8.2 31" stroke="#F4B740" strokeWidth=".6"/>
      </svg>
    </div>
  );
}

function Fridge({ x, y }) {
  return (
    <div style={{ position: 'absolute', left: x * ITILE, top: y * ITILE - 5, width: ITILE * 1.3, height: ITILE * 2.3, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.2))' }}>
      <svg viewBox="0 0 21 37" width={ITILE * 1.3} height={ITILE * 2.3} shapeRendering="geometricPrecision">
        {/* continuous silhouette (top face + front) */}
        <path d="M2 2 Q1 2 1 3 L1 34 Q1 35 2 35 L19 35 Q20 35 20 34 L20 3 Q20 2 19 2 Z" fill="#E9EBEC"/>
        {/* TOP face */}
        <path d="M2 2 Q1 2 1 3 L1 8 L20 8 L20 3 Q20 2 19 2 Z" fill="#CBD2D6"/>
        <line x1="1" y1="8" x2="20" y2="8" stroke={IP.ink} strokeWidth=".5"/>
        {/* freezer / fridge door split */}
        <line x1="1" y1="20" x2="20" y2="20" stroke={IP.ink} strokeWidth=".6"/>
        {/* vertical handles */}
        <rect x="16" y="10" width="1.6" height="7" rx=".6" fill="#9AA6B2" stroke={IP.ink} strokeWidth=".3"/>
        <rect x="16" y="23" width="1.6" height="8" rx=".6" fill="#9AA6B2" stroke={IP.ink} strokeWidth=".3"/>
        {/* VAX label */}
        <rect x="3" y="24" width="9" height="5" rx=".5" fill="#BAE6FD" stroke={IP.ink} strokeWidth=".4"/>
        <text x="7.5" y="27.8" fontSize="3.4" fill={IP.ink} textAnchor="middle" fontFamily="monospace">VAX</text>
        {/* re-stroke silhouette */}
        <path d="M2 2 Q1 2 1 3 L1 34 Q1 35 2 35 L19 35 Q20 35 20 34 L20 3 Q20 2 19 2 Z" fill="none" stroke={IP.ink} strokeWidth=".7"/>
      </svg>
    </div>
  );
}

function RockingHorse({ x, y }) {
  return (
    <div style={{ position: 'absolute', left: x * ITILE, top: y * ITILE - 6, width: ITILE * 2.2, height: ITILE * 2, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.22))', animation: 'forinBob 1.4s ease-in-out infinite' }}>
      <svg viewBox="0 0 36 34" width={ITILE * 2.2} height={ITILE * 2} shapeRendering="geometricPrecision">
        {/* ===== twin curved rockers (runners), seen from above-front ===== */}
        <path d="M4 27 Q18 22 32 27 Q31.6 28.4 31 28.4 Q18 24.4 5 28.4 Q4.4 28.4 4 27 Z" fill="#8A4A1E" stroke={IP.ink} strokeWidth=".5"/>
        <path d="M6 30 Q18 26 30 30 Q29.6 31.2 29 31.2 Q18 27.8 7 31.2 Q6.4 31.2 6 30 Z" fill="#6E3A16" stroke={IP.ink} strokeWidth=".5"/>
        {/* cross strut between the rockers */}
        <path d="M12 28.5 L12 30.4 M24 28.5 L24 30.4" stroke="#5E3210" strokeWidth="1.2"/>

        {/* ===== body: rounded pony seen 3/4 from above ===== */}
        {/* body side + top (continuous silhouette) */}
        <path d="M9 15 Q8 11.5 12 11 L22 10.5 Q26 10.5 26.5 14 L26 21 Q25.6 23.5 22.5 23.5 L12 23.5 Q9.2 23.5 9 20 Z" fill="#F7A8C0"/>
        {/* back/top face lighter */}
        <path d="M9 15 Q8 11.5 12 11 L22 10.5 Q26 10.5 26.5 14 L26 16 Q17 14.5 9.4 16.5 Z" fill="#FCC7D8"/>
        <path d="M9.4 16.2 Q17 14.4 26 15.8" fill="none" stroke={IP.ink} strokeWidth=".4" opacity=".5"/>
        <path d="M9 15 Q8 11.5 12 11 L22 10.5 Q26 10.5 26.5 14 L26 21 Q25.6 23.5 22.5 23.5 L12 23.5 Q9.2 23.5 9 20 Z" fill="none" stroke={IP.ink} strokeWidth=".6"/>

        {/* dapple spots */}
        <circle cx="14" cy="18.5" r="1.1" fill="#FFFFFF" opacity=".55"/>
        <circle cx="19" cy="19.5" r=".9" fill="#FFFFFF" opacity=".55"/>
        <circle cx="22" cy="17.5" r=".8" fill="#FFFFFF" opacity=".5"/>

        {/* ===== saddle + blanket on the top face ===== */}
        <rect x="13" y="12.5" width="9" height="5" rx="1.4" fill="#8B5CF6" stroke={IP.ink} strokeWidth=".4"/>
        <rect x="14" y="13.4" width="7" height="1.2" fill="#C4B5FD"/>
        <circle cx="17.5" cy="15.4" r="1" fill="#FACC15" stroke={IP.ink} strokeWidth=".3"/>{/* saddle knob */}

        {/* ===== neck + head (up-right), with flowing mane ===== */}
        <path d="M24 13 Q29 10 30.5 6 Q31 4 33 5 Q34 8 31.5 12 Q29.5 15 25.5 15.5 Z" fill="#F7A8C0" stroke={IP.ink} strokeWidth=".6"/>
        {/* muzzle */}
        <ellipse cx="32" cy="6" rx="2" ry="1.6" fill="#F49BB6" stroke={IP.ink} strokeWidth=".4"/>
        <circle cx="32.6" cy="6" r=".5" fill={IP.ink}/>{/* nostril */}
        {/* ear */}
        <path d="M29.5 6.5 L30.5 4 L31.6 6 Z" fill="#F7A8C0" stroke={IP.ink} strokeWidth=".35"/>
        {/* eye */}
        <circle cx="30" cy="8.5" r=".9" fill={IP.ink}/>
        <circle cx="30.3" cy="8.2" r=".28" fill="#FFF"/>
        {/* golden flowing mane along the neck */}
        <path d="M25 12 Q27 9 29 6.5" fill="none" stroke="#FACC15" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M24 13.5 Q26.5 11 28 8" fill="none" stroke="#F4B740" strokeWidth="1.2" strokeLinecap="round"/>

        {/* ===== swishing tail (down-left) ===== */}
        <path d="M9 15 Q4 15 3 20 Q2.6 22.5 4.5 23" fill="none" stroke="#FACC15" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M9 16.5 Q5.5 17 4.8 21" fill="none" stroke="#F4B740" strokeWidth="1.2" strokeLinecap="round"/>

        {/* ===== stubby legs meeting the rockers ===== */}
        <rect x="12" y="22" width="2.4" height="5" rx="1" fill="#EC8FAC" stroke={IP.ink} strokeWidth=".4"/>
        <rect x="21" y="22" width="2.4" height="5" rx="1" fill="#E67F9F" stroke={IP.ink} strokeWidth=".4"/>
      </svg>
    </div>
  );
}

Object.assign(window, {
  ScreenInteriorPeds,
  PedsBed, Balloon, Mural, ToyChest, Blocks, SmallSlide, RockingHorse,
  FridgePeds: Fridge, // distinct from pharma's Fridge
});
