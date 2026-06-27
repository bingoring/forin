// interior-or.jsx — Operating Suite (OR & PACU), rebuilt to the master
// blueprint. 40×52 tiles with strict 3-stage zoning (오염↔청정 동선 분리):
//
//   ┌──── UNRESTRICTED (비제한) ────┬──────────────────────────────┐
//   │ 보호자 대기실        │ 직원 탈의실 · 락커룸                       │
//   ├──── SEMI-RESTRICTED (준제한) ─┼──────────────────────────────┤
//   │ Pre-Op Holding │ Clean / Dirty │ PACU 회복실 (+ nurse desk)     │
//   │  (3 beds)      │   Utility     │  (4 beds)                     │
//   ├──── RESTRICTED (제한·양압) ────┴──────────────────────────────┤
//   │ OR 1 (General/Ortho) │ Scrub │ OR 2 (Lap/Robotic)             │
//   └──────────────────────┴───────┴────────────────────────────────┘
//
// Internal passages use IThreshold (dark open doorway). Restricted (OR)
// entries use a blue "sterile" threshold (gowning required). New blueprint
// objects live in interior-objects-or2.jsx; cross-dept objects resolve at
// render time.

function ScreenInteriorOR() {
  const COLS = 40, ROWS = 52;
  const Th = window.IThreshold;
  const Tint = window.Tint;

  const regions = [
    { id: 'family', name: '보호자 대기실 (비제한)',  icon: '🪑', bounds: { x: 0,  y: 0,  w: 20, h: 15 } },
    { id: 'locker', name: '탈의실 · 락커룸 (비제한)', icon: '🧥', bounds: { x: 19, y: 0,  w: 21, h: 15 } },
    { id: 'preop',  name: '수술 전 대기실 (준제한)',  icon: '💤', bounds: { x: 0,  y: 14, w: 14, h: 18 } },
    { id: 'clean',  name: 'Clean Utility · 멸균물품', icon: '📦', bounds: { x: 13, y: 14, w: 8,  h: 9  } },
    { id: 'dirty',  name: 'Dirty Utility · 오염반출', icon: '☣️', bounds: { x: 13, y: 22, w: 8,  h: 10 } },
    { id: 'pacu',   name: '회복실 PACU (준제한)',     icon: '❤️‍🩹', bounds: { x: 20, y: 14, w: 20, h: 18 } },
    { id: 'or1',    name: '제1수술실 (제한·양압)',    icon: '🔪', bounds: { x: 0,  y: 31, w: 16, h: 21 } },
    { id: 'scrub',  name: '스크럽 스테이션',          icon: '🚿', bounds: { x: 15, y: 31, w: 9,  h: 21 } },
    { id: 'or2',    name: '제2수술실 (복강경/로봇)',  icon: '🤖', bounds: { x: 23, y: 31, w: 17, h: 21 } },
  ];

  const rooms = [
    { id: 'family', name: '보호자 대기실', sub: '비제한 구역', icon: '🪑', color: '#FED7AA', x: 10, y: 7,  questCount: 1 },
    { id: 'locker', name: '탈의실·락커룸', sub: '수술복 착용', icon: '🧥', color: '#BAE6FD', x: 28, y: 7 },
    { id: 'preop',  name: 'Pre-Op 대기',  sub: '수술 전 확인', icon: '💤', color: '#FBCFE8', x: 5,  y: 20, questCount: 1 },
    { id: 'clean',  name: 'Clean Utility', sub: '멸균 물품',   icon: '📦', color: '#A7F3D0', x: 16, y: 18 },
    { id: 'dirty',  name: 'Dirty Utility', sub: '오염 반출',   icon: '☣️', color: '#FDE68A', x: 16, y: 27 },
    { id: 'pacu',   name: 'PACU 회복실',  sub: '술 후 모니터링', icon: '❤️‍🩹', color: '#A7F3D0', x: 24, y: 20, questCount: 1 },
    { id: 'or1',    name: 'OR 1',         sub: '일반/정형',    icon: '🔪', color: '#DDD6FE', x: 7,  y: 39, questCount: 2 },
    { id: 'scrub',  name: '스크럽',       sub: '손 소독 5분',  icon: '🚿', color: '#BAE6FD', x: 18, y: 39 },
    { id: 'or2',    name: 'OR 2',         sub: '복강경/로봇',  icon: '🤖', color: '#C7D2FE', x: 31, y: 39, questCount: 1 },
  ];

  return (
    <InteriorScreen
      label="06b Interior · OR" deptCode="수술실 OR & PACU · 3F" deptColor="#9333EA"
      cols={COLS} rows={ROWS} floor="sterile"
      playerStart={{ x: 7, y: 40 }}
      rooms={rooms}
      regions={regions}
      missionText="OR 1 · 수술 중 기구 패스 도와주기"
      missionUrgent
      render={() => (
        <>
          {/* green tint over the restricted ORs (sterile suite ambience) */}
          <Tint x={1}  y={32} w={14} h={19} color="#CDE3D6" op={0.28}/>
          <Tint x={24} y={32} w={15} h={19} color="#CDE3D6" op={0.28}/>

          {/* ═══════════════ OUTER WALLS ═══════════════ */}
          <IWall x={0}  y={0} w={17} h={1}/>
          <IDoor x={17} y={0} w={4}  h={1} kind="auto" label="↓ 캠퍼스로"/>
          <IWall x={21} y={0} w={19} h={1}/>
          <IWall x={0}  y={1} w={1}  h={50}/>
          <IWall x={39} y={1} w={1}  h={50}/>
          <IWall x={0}  y={51} w={40} h={1}/>

          {/* ═══════════════ DIVIDER y14 (unrestricted / semi) ═══════════════ */}
          <IWall x={1}  y={14} w={4}  h={1}/>
          <Th    x={5}  y={14} w={3}  h={1} label="→ Pre-Op"/>
          <IWall x={8}  y={14} w={9}  h={1}/>
          <Th    x={17} y={14} w={3}  h={1} label="→ 복도"/>
          <IWall x={20} y={14} w={9}  h={1}/>
          <Th    x={29} y={14} w={3}  h={1} label="→ PACU"/>
          <IWall x={32} y={14} w={7}  h={1}/>

          {/* ═══════════════ DIVIDER y31 (semi / restricted — STERILE) ═══════════════ */}
          <IWall x={1}  y={31} w={4}  h={1}/>
          <Th    x={5}  y={31} w={3}  h={1} tone="sterile" label="STERILE → OR1"/>
          <IWall x={8}  y={31} w={9}  h={1}/>
          <Th    x={17} y={31} w={3}  h={1} tone="sterile" label="→ 스크럽"/>
          <IWall x={20} y={31} w={9}  h={1}/>
          <Th    x={29} y={31} w={3}  h={1} tone="sterile" label="STERILE → OR2"/>
          <IWall x={32} y={31} w={7}  h={1}/>

          {/* ═══════════════ VERTICAL DIVIDERS ═══════════════ */}
          {/* preop | utility (x13, y15-31) */}
          <IWall x={13} y={15} w={1} h={3}/>
          <Th    x={13} y={18} w={1} h={3}/>
          <IWall x={13} y={21} w={1} h={11}/>
          {/* utility | pacu (x20, y15-31) */}
          <IWall x={20} y={15} w={1} h={4}/>
          <Th    x={20} y={19} w={1} h={3}/>
          <IWall x={20} y={22} w={1} h={10}/>
          {/* clean | dirty (y22, x14-20) */}
          <IWall x={14} y={22} w={2} h={1}/>
          <Th    x={16} y={22} w={2} h={1}/>
          <IWall x={18} y={22} w={2} h={1}/>
          {/* family | locker (x19, y1-13) */}
          <IWall x={19} y={1} w={1} h={5}/>
          <Th    x={19} y={6} w={1} h={3}/>
          <IWall x={19} y={9} w={1} h={5}/>
          {/* or1 | scrub (x15, y32-50) */}
          <IWall x={15} y={32} w={1} h={4}/>
          <Th    x={15} y={36} w={1} h={3} tone="sterile"/>
          <IWall x={15} y={39} w={1} h={12}/>
          {/* scrub | or2 (x23, y32-50) */}
          <IWall x={23} y={32} w={1} h={4}/>
          <Th    x={23} y={36} w={1} h={3} tone="sterile"/>
          <IWall x={23} y={39} w={1} h={12}/>

          {/* ════════════════════ 보호자 대기실 (family, y1-13) ════════════════════ */}
          <BayLabel x={1} y={1} text="보호자 대기실 · WAITING"/>
          <window.WallTV x={9} y={1} w={2}/>
          <window.Sofa x={2} y={4} w={3} color="#9CB4C8"/>
          <window.Sofa x={2} y={9} w={3} color="#C0A6B8"/>
          <window.CoffeeTable x={3} y={6} w={2}/>
          {[10,12,14,16].map((cx,i) => <IChair key={'f'+i} x={cx} y={5} color="#FED7AA" facing="down"/>)}
          {[10,12,14,16].map((cx,i) => <IChair key={'g'+i} x={cx} y={9} color="#FBCFE8" facing="up"/>)}
          <WaterCooler x={17} y={3}/>
          <IPlant x={17} y={11}/>
          <INpc x={11} y={7} kind="parent"  hair="#3C2A18"/>
          <INpc x={13} y={7} kind="visitor" hair="#5C3A1A"/>
          <IHotspot x={12} y={6} kind="info" label="가족 대기"/>

          {/* ════════════════════ 탈의실 · 락커룸 (locker, y1-13) ════════════════════ */}
          <BayLabel x={20} y={1} text="탈의실 · LOCKER"/>
          <ICabinet x={21} y={3} w={3} variant="linen" label="GOWN"/>
          <ICabinet x={25} y={3} w={3} variant="linen"/>
          <ICabinet x={29} y={3} w={3} variant="linen"/>
          <ICabinet x={33} y={3} w={3} variant="linen"/>
          <ICabinet x={21} y={6} w={3} variant="linen"/>
          <ICabinet x={25} y={6} w={3} variant="linen"/>
          <HandSanitizer x={37} y={3}/>
          {[22,24,26,28].map((cx,i) => <IChair key={'lk'+i} x={cx} y={10} color="#BAE6FD" facing="up"/>)}
          <INpc x={24} y={8} kind="nurse"   hair="#3C2A18" shirt="#A5D8E8"/>
          <INpc x={30} y={8} kind="surgeon" hair="#1F2937"/>
          <IHotspot x={24} y={7} kind="info" label="수술복 착용"/>
          <IPlant x={37} y={11}/>

          {/* ════════════════════ PRE-OP HOLDING (preop, y15-30) ════════════════════ */}
          <BayLabel x={1} y={15} text="PRE-OP HOLDING" highlight/>
          {/* Pre-Op 1 — 환자 확인 */}
          <IBed x={2} y={17} variant="ward" occupied label="PRE-OP 1"/>
          <IMonitor x={1} y={17} beep/>
          <window.CompCart x={5} y={16}/>
          <window.ConsentClipboard x={2} y={20}/>
          <INpc x={5} y={19} kind="nurse" hair="#3C2A18" shirt="#A5D8E8"/>
          <IHotspot x={3} y={17} kind="quest" label="환자 확인 · ID"/>
          {/* Pre-Op 3 (right column) */}
          <IBed x={8} y={17} variant="ward" occupied label="PRE-OP 3"/>
          <window.IIV x={10} y={17}/>
          <IMonitor x={11} y={17}/>
          {/* curtain divider */}
          <ICurtain x={1} y={21} w={11} h={1} color="#A7C7E7"/>
          {/* Pre-Op 2 — 마취 면담 */}
          <IBed x={2} y={23} variant="ward" occupied label="PRE-OP 2"/>
          <window.IIV x={5} y={23}/>
          <window.BairHugger x={6} y={25}/>
          <INpc x={5} y={25} kind="doctor" hair="#1F2937"/>
          <IHotspot x={3} y={23} kind="info" label="마취 면담"/>
          <IPlant x={11} y={29}/>

          {/* ════════════════════ CLEAN UTILITY (clean, y15-21) ════════════════════ */}
          <BayLabel x={14} y={15} text="CLEAN UTILITY"/>
          <ICabinet x={14} y={17} w={5} variant="sterile" label="STERILE"/>
          <ICabinet x={14} y={19} w={5} variant="sterile"/>
          <ICabinet x={14} y={20} w={5} variant="supply"/>
          <INpc x={16} y={20} kind="nurse" hair="#7C3F00" shirt="#A7F3D0"/>
          <IHotspot x={16} y={18} kind="info" label="멸균 물품"/>

          {/* ════════════════════ DIRTY UTILITY (dirty, y23-30) ════════════════════ */}
          <BayLabel x={14} y={23} text="DIRTY UTILITY · 오염"/>
          <window.SoiledCart x={14} y={26}/>
          <window.SoiledCart x={17} y={26}/>
          <WasteBin x={14} y={29} tone="infectious"/>
          <WasteBin x={18} y={29} tone="infectious"/>
          <IHotspot x={16} y={25} kind="info" label="기구 반출 → SPD"/>

          {/* ════════════════════ PACU 회복실 (pacu, y15-30) ════════════════════ */}
          <BayLabel x={21} y={15} text="PACU · RECOVERY"/>
          {/* 4 open beds */}
          <IBed x={22} y={17} variant="ward" occupied label="PACU 1"/>
          <IBed x={26} y={17} variant="ward" occupied label="PACU 2"/>
          <IBed x={30} y={17} variant="ward" occupied/>
          <IBed x={34} y={17} variant="ward"/>
          <IMonitor x={21} y={17} beep/>
          <IMonitor x={25} y={17} beep/>
          <IMonitor x={29} y={17}/>
          <IMonitor x={33} y={17}/>
          {/* PACU 1 — hand-off (핵심 시나리오) */}
          <INpc x={22} y={20} kind="nurse" hair="#7C3F00" shirt="#A7F3D0"/>
          <INpc x={24} y={20} kind="nurse" hair="#3C2A18" shirt="#A5D8E8"/>
          <IHotspot x={22} y={17} kind="quest" label="인계 Hand-off"/>
          {/* PACU 2 — 오한 케어 */}
          <SuctionUnit x={29} y={20}/>
          <window.BairHugger x={28} y={19}/>
          <INpc x={26} y={20} kind="nurse" hair="#9A6B3F" shirt="#FBCFE8"/>
          <IHotspot x={26} y={17} kind="info" label="오한 케어 · O2"/>
          {/* PACU nurse desk */}
          <window.BankOfMonitors x={30} y={22}/>
          <NurseDeskI x={30} y={24} w={4} h={2} label="PACU NURSE"/>
          <window.CompCart x={34} y={24}/>
          <window.CrashCart x={36} y={25}/>
          <INpc x={31} y={27} kind="nurse" hair="#5C3A1A" shirt="#A5D8E8"/>
          <INpc x={33} y={27} kind="nurse" hair="#1F2937" shirt="#A7F3D0"/>
          <IHotspot x={31} y={25} kind="info" label="PACU 데스크"/>
          <IPlant x={37} y={29}/>

          {/* ════════════════════ OR 1 · GENERAL/ORTHO (or1, y32-50) ════════════════════ */}
          <BayLabel x={1} y={32} text="OR 1 · GENERAL/ORTHO" highlight/>
          <window.SurgicalLight x={7} y={34}/>
          <window.ORBoomMonitor x={11} y={34} w={2}/>
          <IBed x={6} y={37} variant="or" occupied label="DRAPED"/>
          <AnesthesiaMachine x={4} y={36}/>
          <IMonitor x={3} y={37} beep/>
          <InstrumentTray x={9} y={38}/>
          <window.Bovie x={12} y={38}/>
          <window.IIV x={4} y={41}/>
          <window.KickBucket x={8} y={41}/>
          {/* sterile cabinets along left wall */}
          <ICabinet x={1} y={34} w={3} variant="sterile" label="STERILE"/>
          <ICabinet x={1} y={45} w={3} variant="equipment"/>
          {/* team */}
          <INpc x={5}  y={39} kind="surgeon" hair="#1F2937"/>
          <INpc x={7}  y={39} kind="surgeon" hair="#5C3A1A"/>
          <INpc x={9}  y={40} kind="nurse"   hair="#3C2A18" shirt="#A5D8E8"/>
          <INpc x={4}  y={37} kind="doctor"  hair="#1F2937"/>
          <INpc x={13} y={43} kind="nurse"   hair="#7C3F00" shirt="#A7F3D0"/>
          <window.CompCart x={12} y={42}/>
          <IHotspot x={7}  y={37} kind="quest" label="기구 패스"/>
          <IHotspot x={13} y={42} kind="info"  label="카운트 (순회)"/>
          {/* time-out board on the bottom wall */}
          <window.TimeoutBoard x={1} y={48} w={3}/>

          {/* ════════════════════ SCRUB STATION (scrub, y32-50) ════════════════════ */}
          <BayLabel x={16} y={32} text="SCRUB"/>
          <window.SinkOR x={16} y={35}/>
          <window.SinkOR x={16} y={40}/>
          <window.ScrubDispenser x={19} y={35}/>
          <window.ScrubDispenser x={19} y={40}/>
          <window.ScrubTimer x={20} y={33}/>
          <INpc x={17} y={38} kind="surgeon" hair="#1F2937"/>
          <INpc x={17} y={43} kind="nurse"   hair="#3C2A18" shirt="#A5D8E8"/>
          <IHotspot x={17} y={35} kind="info" label="5분 스크럽"/>

          {/* ════════════════════ OR 2 · LAP/ROBOTIC (or2, y32-50) ════════════════════ */}
          <BayLabel x={24} y={32} text="OR 2 · LAP/ROBOTIC" highlight/>
          <window.SurgicalLight x={30} y={34}/>
          <window.ORBoomMonitor x={33} y={34} w={2}/>
          <IBed x={29} y={37} variant="or" occupied label="DRAPED"/>
          <AnesthesiaMachine x={27} y={36}/>
          <IMonitor x={26} y={37} beep/>
          <window.LapTower x={25} y={37}/>
          <window.CO2Insufflator x={26} y={41}/>
          <window.RoboticConsole x={33} y={42}/>
          {/* team */}
          <INpc x={31} y={40} kind="nurse"   hair="#3C2A18" shirt="#A5D8E8"/>
          <INpc x={27} y={37} kind="doctor"  hair="#1F2937"/>
          <INpc x={34} y={45} kind="surgeon" hair="#5C3A1A"/>
          <INpc x={37} y={45} kind="nurse"   hair="#7C3F00" shirt="#A7F3D0"/>
          <window.CompCart x={37} y={44}/>
          <ICabinet x={24} y={34} w={3} variant="sterile" label="STERILE"/>
          <ICabinet x={36} y={34} w={3} variant="drug"/>
          <IHotspot x={33} y={43} kind="quest" label="로봇 콘솔"/>
          <IHotspot x={29} y={37} kind="info"  label="복강경 화면"/>
          <StatusBoard x={24} y={49}/>
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
        <rect x="15" y="0" width="2" height="6" fill="#9CA3AF" stroke={IP.ink} strokeWidth=".4"/>
        <rect x="15" y="6" width="6" height="2" fill="#9CA3AF" stroke={IP.ink} strokeWidth=".4"/>
        <rect x="19" y="8" width="2" height="3" fill="#6B7280" stroke={IP.ink} strokeWidth=".4"/>
        <rect x="19.5" y="11" width="1" height="4" fill="#7DD3FC"/>
        <circle cx="12" cy="4" r="1.5" fill="#3B82F6" stroke={IP.ink} strokeWidth=".3"/>
        <circle cx="24" cy="4" r="1.5" fill="#EF4444" stroke={IP.ink} strokeWidth=".3"/>
        <ellipse cx="16" cy="14" rx="12" ry="4" fill="#E5E7EB" stroke={IP.ink} strokeWidth=".5"/>
        <ellipse cx="16" cy="13" rx="11" ry="3" fill="#F3F4F6"/>
        <ellipse cx="16" cy="15" rx="10" ry="2.5" fill="#A8DCEC"/>
        <path d="M 4 14 L 28 14 L 26 22 L 6 22 Z" fill="#9CA3AF" stroke={IP.ink} strokeWidth=".4"/>
        <path d="M 4 14 L 6 14 L 6 22 L 4 22 Z" fill="#CBD5E1"/>
        <rect x="14" y="22" width="4" height="3" fill="#6B7280" stroke={IP.ink} strokeWidth=".4"/>
        <rect x="6" y="25" width="20" height="3" fill="#94A3B8" stroke={IP.ink} strokeWidth=".4"/>
        <rect x="7" y="25.5" width="18" height="1" fill="#CBD5E1"/>
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
        <rect x="30" y="0" width="4" height="3" fill="#374151" stroke={IP.ink} strokeWidth=".4"/>
        <rect x="31" y="3" width="2" height="10" fill="#9CA3AF" stroke={IP.ink} strokeWidth=".3"/>
        <ellipse cx="32" cy="17" rx="22" ry="6" fill="#F1F5F9" stroke={IP.ink} strokeWidth=".5"/>
        <ellipse cx="32" cy="15.5" rx="20" ry="4" fill="#FFFFFF"/>
        <path d="M 10 17 L 54 17 L 51 21 L 13 21 Z" fill="#E5E7EB" stroke={IP.ink} strokeWidth=".4"/>
        {[14,20,26,32,38,44,50].map((bx, i) => (
          <circle key={i} cx={bx} cy="22.5" r="2.5" fill="#FEF08A" stroke={IP.ink} strokeWidth=".3"/>
        ))}
        <circle cx="32" cy="22.5" r="2.5" fill="#FFFFFF"/>
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
        <path d="M 2 1 L 22 1 L 23 3 L 1 3 Z" fill="#475569" stroke={IP.ink} strokeWidth=".4"/>
        <rect x="1" y="3" width="22" height="13" fill="#374151" stroke={IP.ink} strokeWidth=".5"/>
        <rect x="3" y="5" width="18" height="9" fill="#0F1A24" stroke={IP.ink} strokeWidth=".4"/>
        <rect x="4" y="6" width="16" height="1" fill="#22D3EE"/>
        <rect x="4" y="8" width="16" height="1" fill="#FACC15"/>
        <rect x="4" y="10" width="12" height="1" fill="#10B981"/>
        <rect x="19" y="14" width="3" height="2" fill="#94A3B8" stroke={IP.ink} strokeWidth=".3"/>
        <path d="M 22 15 Q 24 17 22 20" fill="none" stroke="#94A3B8" strokeWidth="1.5"/>
        <rect x="1" y="16" width="22" height="1" fill="#1F2937"/>
        <rect x="1" y="17" width="22" height="6" fill="#94A3B8" stroke={IP.ink} strokeWidth=".4"/>
        <circle cx="5" cy="20" r="1.5" fill="#EF4444" stroke={IP.ink} strokeWidth=".3"/>
        <circle cx="10" cy="20" r="1.5" fill="#3B82F6" stroke={IP.ink} strokeWidth=".3"/>
        <circle cx="15" cy="20" r="1.5" fill="#10B981" stroke={IP.ink} strokeWidth=".3"/>
        <circle cx="20" cy="20" r="1.5" fill="#FACC15" stroke={IP.ink} strokeWidth=".3"/>
        <rect x="2" y="24" width="20" height="5" fill="#fff" stroke={IP.ink} strokeWidth=".4"/>
        <rect x="3" y="25" width="6" height="3" fill="#0F1A24"/>
        <text x="6" y="27" fontSize="2" fill="#10B981" textAnchor="middle" fontFamily="monospace">5.2</text>
        <rect x="11" y="25" width="6" height="3" fill="#0F1A24"/>
        <text x="14" y="27" fontSize="2" fill="#FACC15" textAnchor="middle" fontFamily="monospace">98%</text>
        <ellipse cx="2.5" cy="30" rx="2" ry=".8" fill="#15803D" stroke={IP.ink} strokeWidth=".3"/>
        <rect x=".5" y="30" width="4" height="6" fill="#16A34A" stroke={IP.ink} strokeWidth=".3"/>
        <ellipse cx="2.5" cy="36" rx="2" ry=".8" fill="#15803D" stroke={IP.ink} strokeWidth=".3"/>
        <rect x="1" y="29" width="22" height="9" fill="#6B7280" stroke={IP.ink} strokeWidth=".4"/>
        <rect x="5" y="30" width="17" height="3" fill="#fff" stroke={IP.ink} strokeWidth=".3"/>
        <rect x="5" y="34" width="17" height="3" fill="#fff" stroke={IP.ink} strokeWidth=".3"/>
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
        <ellipse cx="14" cy="5" rx="13" ry="3" fill="#A5D8E8" stroke={IP.ink} strokeWidth=".5"/>
        <ellipse cx="14" cy="4" rx="12" ry="2" fill="#C8E5F0"/>
        <line x1="3" y1="5" x2="25" y2="5" stroke={IP.ink} strokeWidth=".2" opacity=".3"/>
        <path d="M 1 5 L 27 5 L 25 11 L 3 11 Z" fill="#7DBFD9" stroke={IP.ink} strokeWidth=".4"/>
        <path d="M 3 11 L 25 11 L 24 13 L 4 13 Z" fill="#A5D8E8" stroke={IP.ink} strokeWidth=".3"/>
        <rect x="4" y="3" width="10" height="1.2" fill="#9CA3AF" stroke={IP.ink} strokeWidth=".25"/>
        <rect x="3" y="3.2" width="2" height=".7" fill="#374151"/>
        <rect x="6" y="2" width="8" height=".8" fill="#9CA3AF" stroke={IP.ink} strokeWidth=".25"/>
        <rect x="16" y="3" width="6" height="1" fill="#9CA3AF" stroke={IP.ink} strokeWidth=".25"/>
        <rect x="22" y="3.2" width="2" height=".7" fill="#374151"/>
        <rect x="17" y="4.5" width="7" height=".7" fill="#9CA3AF"/>
        <rect x="13" y="13" width="2" height="7" fill="#9CA3AF" stroke={IP.ink} strokeWidth=".3"/>
        <rect x="13.3" y="13.2" width=".7" height="6.5" fill="#CBD5E1"/>
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
