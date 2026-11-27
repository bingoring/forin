// interior-objects-or2.jsx — Operating-suite (OR & PACU) blueprint objects.
// Same v2 pixel style: visible TOP + FRONT + side depth, viewed from 45° above.
// Tile-based coords. Loads after interior-shared/objects, before interior-or.

(function () {
  const C = '#2A2522';
  const T = window.ITILE || 16;

  // ─── BairHugger — 환자 가온 온풍 조절 장치 (+ 호스 + 담요) ──────────
  function BairHugger({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 4, width: T * 1.6, height: T * 2.1, filter: 'drop-shadow(2px 3px 0 rgba(0,0,0,.28))' }}>
        <svg viewBox="0 0 26 34" width={T * 1.6} height={T * 2.1} shapeRendering="crispEdges">
          {/* flexible warm-air hose curling up to a blanket */}
          <path d="M20 8 Q26 6 24 1" fill="none" stroke="#BBD7E2" strokeWidth="3"/>
          <rect x="20" y="0" width="6" height="3" fill="#CFE6EE" stroke={C} strokeWidth=".4"/>
          {/* top face */}
          <path d="M2 8 L16 8 L17 10 L1 10 Z" fill="#3E7CA8" stroke={C} strokeWidth=".4"/>
          {/* unit body (teal blue) */}
          <rect x="1" y="10" width="16" height="13" fill="#4F90BE" stroke={C} strokeWidth=".5"/>
          <rect x="1.5" y="10.5" width="15" height="1.5" fill="#7DB4D4"/>
          {/* display + dial */}
          <rect x="3" y="12" width="8" height="4" fill="#0F1A24" stroke={C} strokeWidth=".4"/>
          <text x="7" y="15.2" fontSize="2.6" fill="#FACC15" textAnchor="middle" fontFamily="monospace">38°</text>
          <circle cx="13.5" cy="14" r="2" fill="#CBD5E1" stroke={C} strokeWidth=".4"/>
          <rect x="3" y="17" width="11" height="4" fill="#1F2937"/>{/* filter grille */}
          <rect x="3" y="17.6" width="11" height="2.6" fill="none" stroke="#6B7280" strokeWidth=".4" strokeDasharray="1 1"/>
          {/* wheeled base */}
          <rect x="2" y="23" width="14" height="3" fill="#374151" stroke={C} strokeWidth=".4"/>
          <ellipse cx="4" cy="28" rx="2" ry="1.4" fill={C}/>
          <ellipse cx="14" cy="28" rx="2" ry="1.4" fill={C}/>
        </svg>
      </div>
    );
  }

  // ─── Bovie / ESU — 전기소작기 (조직 절제·지혈) ─────────────────────
  function Bovie({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 2, width: T, height: T * 2.2, filter: 'drop-shadow(2px 3px 0 rgba(0,0,0,.28))' }}>
        <svg viewBox="0 0 16 36" width={T} height={T * 2.2} shapeRendering="crispEdges">
          {/* generator top face */}
          <path d="M1 2 L15 2 L16 4 L0 4 Z" fill="#475569" stroke={C} strokeWidth=".4"/>
          {/* generator body */}
          <rect x="0" y="4" width="16" height="13" fill="#5B6776" stroke={C} strokeWidth=".5"/>
          {/* cut/coag numeric displays */}
          <rect x="1.5" y="5.5" width="6" height="4" fill="#0F1A24"/>
          <text x="4.5" y="8.8" fontSize="3" fill="#FBBF24" textAnchor="middle" fontFamily="monospace">30</text>
          <rect x="8.5" y="5.5" width="6" height="4" fill="#0F1A24"/>
          <text x="11.5" y="8.8" fontSize="3" fill="#22D3EE" textAnchor="middle" fontFamily="monospace">25</text>
          {/* dials */}
          <circle cx="4" cy="13" r="1.6" fill="#FBBF24" stroke={C} strokeWidth=".3"/>
          <circle cx="11.5" cy="13" r="1.6" fill="#22D3EE" stroke={C} strokeWidth=".3"/>
          {/* bovie pencil in holster + cord */}
          <rect x="13" y="3" width="2" height="7" fill="#E5E7EB" stroke={C} strokeWidth=".3"/>
          <rect x="13.4" y="2" width="1.2" height="2" fill="#EAB308"/>
          <path d="M14 10 Q17 13 14 16" fill="none" stroke={C} strokeWidth=".5"/>
          {/* cart shelf + foot pedal */}
          <rect x="1" y="17" width="14" height="10" fill="#9CA3AF" stroke={C} strokeWidth=".4"/>
          <rect x="2" y="18" width="12" height="3" fill="#fff" stroke={C} strokeWidth=".3"/>
          <ellipse cx="8" cy="30" rx="4" ry="1.6" fill="#FBBF24" stroke={C} strokeWidth=".4"/>{/* foot pedal */}
          <ellipse cx="3" cy="33" rx="2" ry="1.4" fill={C}/>
          <ellipse cx="13" cy="33" rx="2" ry="1.4" fill={C}/>
        </svg>
      </div>
    );
  }

  // ─── KickBucket — 바퀴 달린 거즈 수거 양동이 (바닥) ────────────────
  function KickBucket({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T + 2, top: y * T + 2, width: T - 4, height: T - 2, filter: 'drop-shadow(2px 2px 0 rgba(0,0,0,.26))' }}>
        <svg viewBox="0 0 12 12" width={T - 4} height={T - 2} shapeRendering="crispEdges">
          {/* stainless ring frame */}
          <ellipse cx="6" cy="4" rx="5.5" ry="2.3" fill="#CBD5E1" stroke={C} strokeWidth=".5"/>
          <ellipse cx="6" cy="3.6" rx="4.3" ry="1.6" fill="#9CA3AF"/>
          {/* red biohazard liner with sponges */}
          <path d="M2 4 L10 4 L9 9 L3 9 Z" fill="#DC2626" stroke={C} strokeWidth=".4"/>
          <rect x="4" y="3" width="2.2" height="2" fill="#F8FAFC" stroke={C} strokeWidth=".25"/>{/* sponge */}
          <rect x="6.5" y="3.4" width="2" height="1.8" fill="#E5E7EB" stroke={C} strokeWidth=".25"/>
          {/* caster wheels */}
          <circle cx="3.5" cy="10" r="1.2" fill={C}/>
          <circle cx="8.5" cy="10" r="1.2" fill={C}/>
        </svg>
      </div>
    );
  }

  // ─── TimeoutBoard — 벽면 타임아웃 보드 (환자·부위·항생제) ──────────
  function TimeoutBoard({ x, y, w = 3 }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T, width: T * w, height: T * 1.3, filter: 'drop-shadow(2px 2px 0 rgba(0,0,0,.24))' }}>
        <svg viewBox={`0 0 ${w*16} 20`} width={T * w} height={T * 1.3} shapeRendering="crispEdges" preserveAspectRatio="none">
          {/* frame + white surface */}
          <rect x="0" y="0" width={w*16} height="20" fill="#E5E7EB" stroke={C} strokeWidth=".6"/>
          <rect x="1.5" y="1.5" width={w*16-3} height="17" fill="#fff"/>
          {/* header */}
          <rect x="1.5" y="1.5" width={w*16-3} height="4" fill="#DC2626"/>
          <rect x="3" y="2.6" width={w*7} height="1.6" fill="#fff"/>
          {/* rows: patient / site / abx with check */}
          <rect x="3" y="7.5" width={w*9} height="1.3" fill="#3B82F6"/>
          <rect x="3" y="10.5" width={w*7} height="1.3" fill={C} opacity=".6"/>
          <rect x={w*16-9} y="10" width="2.2" height="2.2" fill="#16A34A"/>{/* L/R site marker */}
          <rect x="3" y="13.5" width={w*6} height="1.3" fill={C} opacity=".6"/>
          {/* ABx checkbox ticked */}
          <rect x={w*16-9} y="13" width="2.4" height="2.4" fill="#fff" stroke={C} strokeWidth=".5"/>
          <path d={`M${w*16-8.6} 14.2 L${w*16-7.8} 15 L${w*16-6.6} 13.4`} fill="none" stroke="#16A34A" strokeWidth=".7"/>
        </svg>
      </div>
    );
  }

  // ─── RoboticConsole — 로봇 수술 제어 콘솔 (집도의가 머리를 묻음) ────
  function RoboticConsole({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 8, width: T * 2.2, height: T * 2.6, filter: 'drop-shadow(3px 4px 0 rgba(0,0,0,.3))' }}>
        <svg viewBox="0 0 36 42" width={T * 2.2} height={T * 2.6} shapeRendering="crispEdges">
          {/* column / hood support */}
          <rect x="14" y="2" width="8" height="10" fill="#475569" stroke={C} strokeWidth=".5"/>
          {/* binocular viewport hood (where surgeon rests head) */}
          <path d="M8 8 L28 8 L25 16 L11 16 Z" fill="#1F2937" stroke={C} strokeWidth=".5"/>
          <rect x="13" y="10" width="4" height="3" fill="#0B1620"/>
          <rect x="19" y="10" width="4" height="3" fill="#0B1620"/>
          <rect x="9" y="8" width="18" height="1.4" fill="#374151"/>
          {/* arm-rest console + hand controls */}
          <path d="M6 18 L30 18 L32 24 L4 24 Z" fill="#9CA3AF" stroke={C} strokeWidth=".5"/>
          <rect x="9" y="19.5" width="4" height="3" fill="#475569" stroke={C} strokeWidth=".4"/>
          <rect x="23" y="19.5" width="4" height="3" fill="#475569" stroke={C} strokeWidth=".4"/>
          {/* pedestal */}
          <rect x="14" y="24" width="8" height="9" fill="#6B7280" stroke={C} strokeWidth=".5"/>
          {/* foot-pedal tray */}
          <rect x="8" y="33" width="20" height="3" fill="#374151" stroke={C} strokeWidth=".4"/>
          <rect x="11" y="33.4" width="4" height="2" fill="#FBBF24"/>
          <rect x="21" y="33.4" width="4" height="2" fill="#22D3EE"/>
          {/* base */}
          <ellipse cx="18" cy="39" rx="12" ry="2.4" fill="#4B5563" stroke={C} strokeWidth=".4"/>
        </svg>
      </div>
    );
  }

  // ─── LapTower — 복강경 모니터 타워 (2단 모니터 + 광원 + 레코더) ─────
  function LapTower({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 18, width: T * 1.5, height: T * 3.4, filter: 'drop-shadow(3px 4px 0 rgba(0,0,0,.3))' }}>
        <svg viewBox="0 0 24 56" width={T * 1.5} height={T * 3.4} shapeRendering="crispEdges">
          {/* top monitor — endoscopic view */}
          <rect x="1" y="0" width="22" height="15" fill="#111827" stroke={C} strokeWidth=".6"/>
          <rect x="2.5" y="1.5" width="19" height="12" fill="#3A1414"/>
          <ellipse cx="12" cy="7.5" rx="7" ry="5" fill="#7C2D2D"/>
          <ellipse cx="10" cy="7" rx="2.5" ry="3.5" fill="#A83A3A"/>
          <rect x="11" y="3" width="1.5" height="9" fill="#D9C8A8"/>{/* instrument */}
          {/* second monitor / light-source box */}
          <rect x="3" y="16" width="18" height="9" fill="#374151" stroke={C} strokeWidth=".5"/>
          <rect x="4.5" y="17.5" width="15" height="3" fill="#0F1A24"/>
          <rect x="5" y="18" width="6" height="2" fill="#22D3EE"/>
          <circle cx="17" cy="22.5" r="1.4" fill="#A7F3D0" stroke={C} strokeWidth=".3"/>{/* light source glow */}
          {/* insufflator / recorder stack */}
          <rect x="3" y="26" width="18" height="6" fill="#5B6776" stroke={C} strokeWidth=".5"/>
          <rect x="4.5" y="27.5" width="6" height="3" fill="#0F1A24"/>
          <text x="7.5" y="30" fontSize="2.4" fill="#FBBF24" textAnchor="middle" fontFamily="monospace">CO₂</text>
          <circle cx="16" cy="29" r="1.6" fill="#fff" stroke={C} strokeWidth=".3"/>
          {/* tower cabinet body */}
          <rect x="3" y="32" width="18" height="13" fill="#9CA3AF" stroke={C} strokeWidth=".5"/>
          <rect x="4.5" y="33.5" width="15" height="3" fill="#fff" stroke={C} strokeWidth=".3"/>
          <rect x="4.5" y="38" width="15" height="3" fill="#fff" stroke={C} strokeWidth=".3"/>
          {/* wheels */}
          <ellipse cx="5" cy="48" rx="2.2" ry="1.6" fill={C}/>
          <ellipse cx="19" cy="48" rx="2.2" ry="1.6" fill={C}/>
        </svg>
      </div>
    );
  }

  // ─── CO2Insufflator — 이산화탄소 인수플레이터 (복부 팽창 가스) ──────
  function CO2Insufflator({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T + 1, top: y * T, width: T - 2, height: T * 1.5, filter: 'drop-shadow(2px 2px 0 rgba(0,0,0,.26))' }}>
        <svg viewBox="0 0 14 24" width={T - 2} height={T * 1.5} shapeRendering="crispEdges">
          {/* unit */}
          <path d="M1 2 L13 2 L14 4 L0 4 Z" fill="#475569" stroke={C} strokeWidth=".4"/>
          <rect x="0" y="4" width="14" height="11" fill="#5B6776" stroke={C} strokeWidth=".5"/>
          <rect x="1.5" y="5.5" width="7" height="3.5" fill="#0F1A24"/>
          <text x="5" y="8.4" fontSize="2.6" fill="#22D3EE" textAnchor="middle" fontFamily="monospace">12</text>
          <circle cx="11" cy="7.5" r="2" fill="#fff" stroke={C} strokeWidth=".3"/>
          <rect x="1.5" y="10" width="11" height="3.5" fill="#1F2937"/>
          {/* green CO2 tank on side */}
          <ellipse cx="2.5" cy="16" rx="2" ry=".8" fill="#15803D" stroke={C} strokeWidth=".3"/>
          <rect x=".5" y="16" width="4" height="6" fill="#16A34A" stroke={C} strokeWidth=".3"/>
          <rect x="6" y="15" width="8" height="7" fill="#9CA3AF" stroke={C} strokeWidth=".4"/>
        </svg>
      </div>
    );
  }

  // ─── ScrubDispenser — 벽면 소독액(클로르헥시딘/베타딘) + 솔/타월 박스 ─
  function ScrubDispenser({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T + 1, top: y * T, width: T - 2, height: T * 1.5, filter: 'drop-shadow(1.5px 2px 0 rgba(0,0,0,.24))' }}>
        <svg viewBox="0 0 14 24" width={T - 2} height={T * 1.5} shapeRendering="crispEdges">
          {/* wall plate */}
          <rect x="0" y="0" width="14" height="24" fill="#D6DCE2" stroke={C} strokeWidth=".5"/>
          {/* chlorhexidine (pink) bottle + elbow lever */}
          <rect x="2" y="2" width="4" height="8" fill="#F9C9D6" stroke={C} strokeWidth=".4"/>
          <rect x="2.4" y="3" width="1.2" height="6" fill="#FBDCE5"/>
          <rect x="1" y="10" width="6" height="1.6" fill="#9CA3AF"/>{/* lever */}
          {/* betadine (amber) bottle + lever */}
          <rect x="8" y="2" width="4" height="8" fill="#B45309" stroke={C} strokeWidth=".4"/>
          <rect x="8.4" y="3" width="1.2" height="6" fill="#D97706"/>
          <rect x="7" y="10" width="6" height="1.6" fill="#9CA3AF"/>
          {/* towel / brush box below */}
          <rect x="1.5" y="13" width="11" height="9" fill="#fff" stroke={C} strokeWidth=".5"/>
          <rect x="1.5" y="13" width="11" height="2" fill="#3B82F6"/>
          <rect x="3" y="16" width="8" height="2" fill="#E5E7EB" stroke={C} strokeWidth=".3"/>{/* towel */}
          <rect x="3" y="19" width="4" height="2.4" fill="#16A34A"/>{/* scrub brush */}
        </svg>
      </div>
    );
  }

  // ─── ScrubTimer — 벽면 디지털 스크럽 타이머 (5분 카운트다운) ────────
  function ScrubTimer({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T + 2, top: y * T + 1, width: T - 4, height: T - 2, filter: 'drop-shadow(1.5px 2px 0 rgba(0,0,0,.24))' }}>
        <svg viewBox="0 0 12 12" width={T - 4} height={T - 2} shapeRendering="crispEdges">
          <rect x="0" y="0" width="12" height="12" fill="#1F2937" stroke={C} strokeWidth=".6"/>
          <rect x="1.5" y="2" width="9" height="5" fill="#0B2A3A"/>
          <text x="6" y="6" fontSize="3.4" fill="#22D3EE" textAnchor="middle" fontFamily="monospace">5:00</text>
          <rect x="2" y="8.5" width="8" height="1.6" fill="#16A34A"/>{/* SCRUB label */}
        </svg>
        <div style={{ position: 'absolute', left: '50%', top: -1, transform: 'translateX(-50%)', width: 3, height: 3, background: '#22D3EE', borderRadius: '50%', animation: 'forinBlink 1s steps(2,end) infinite' }}/>
      </div>
    );
  }

  // ─── ConsentClipboard — 수술 동의서 서류판 ─────────────────────────
  function ConsentClipboard({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T + 3, top: y * T + 3, width: T - 6, height: T - 4, filter: 'drop-shadow(1px 1.5px 0 rgba(0,0,0,.22))' }}>
        <svg viewBox="0 0 10 12" width={T - 6} height={T - 4} shapeRendering="crispEdges">
          <rect x="1" y="1" width="8" height="11" fill="#A88862" stroke={C} strokeWidth=".4"/>{/* board */}
          <rect x="1.6" y="2" width="6.8" height="9" fill="#FEFCF2" stroke={C} strokeWidth=".3"/>{/* paper */}
          <rect x="3.5" y="0.4" width="3" height="1.6" fill="#9CA3AF" stroke={C} strokeWidth=".3"/>{/* clip */}
          <rect x="2.4" y="3.4" width="5" height=".5" fill={C} opacity=".5"/>
          <rect x="2.4" y="4.6" width="5" height=".5" fill={C} opacity=".5"/>
          <rect x="2.4" y="5.8" width="4" height=".5" fill={C} opacity=".5"/>
          {/* signature line + scrawl */}
          <rect x="2.4" y="9" width="4" height=".5" fill={C}/>
          <path d="M2.6 8.6 Q3.4 7.8 4.2 8.6 T5.8 8.6" fill="none" stroke="#1E3A8A" strokeWidth=".4"/>
        </svg>
      </div>
    );
  }

  // ─── SoiledCart — 오염 기구 밀폐 이송 카트 (감염성) ────────────────
  function SoiledCart({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 4, width: T * 1.3, height: T * 1.7, filter: 'drop-shadow(2px 3px 0 rgba(0,0,0,.28))' }}>
        <svg viewBox="0 0 20 28" width={T * 1.3} height={T * 1.7} shapeRendering="crispEdges">
          {/* closed lid top */}
          <path d="M2 2 L18 2 L19 5 L1 5 Z" fill="#8A929B" stroke={C} strokeWidth=".5"/>
          {/* body */}
          <rect x="1" y="5" width="18" height="17" fill="#A8AEB6" stroke={C} strokeWidth=".5"/>
          <rect x="1.5" y="5.5" width="2" height="16" fill="#C2C7CE"/>
          {/* biohazard panel */}
          <rect x="6" y="9" width="8" height="8" fill="#FACC15" stroke={C} strokeWidth=".4"/>
          <text x="10" y="15" fontSize="5" fill={C} textAnchor="middle" fontFamily="monospace">☣</text>
          {/* latch */}
          <rect x="9" y="5" width="2" height="2" fill="#4B5563"/>
          {/* wheels */}
          <ellipse cx="4" cy="24" rx="2.4" ry="1.7" fill={C}/>
          <ellipse cx="16" cy="24" rx="2.4" ry="1.7" fill={C}/>
        </svg>
      </div>
    );
  }

  // ─── ORBoomMonitor — 천장 붐형 수술 디스플레이 (복강경 화면) ────────
  function ORBoomMonitor({ x, y, w = 2 }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 6, width: T * w, height: T * 1.6, zIndex: 1, filter: 'drop-shadow(2px 3px 0 rgba(0,0,0,.3))' }}>
        <svg viewBox={`0 0 ${w*16} 26`} width={T * w} height={T * 1.6} shapeRendering="crispEdges" preserveAspectRatio="none">
          {/* boom arm */}
          <rect x={w*8-1} y="0" width="2" height="5" fill="#9CA3AF" stroke={C} strokeWidth=".3"/>
          {/* bezel */}
          <rect x="1" y="5" width={w*16-2} height="18" fill="#111827" stroke={C} strokeWidth=".6"/>
          {/* endoscopic image */}
          <rect x="2.5" y="6.5" width={w*16-5} height="15" fill="#3A1414"/>
          <ellipse cx={w*8} cy="14" rx={w*5} ry="6" fill="#7C2D2D"/>
          <ellipse cx={w*8-3} cy="13" rx={w*1.6} ry="4" fill="#A83A3A"/>
          <rect x={w*8-0.5} y="8" width="1.5" height="11" fill="#D9C8A8"/>{/* instrument shaft */}
          <rect x="3" y="7" width={w*5} height="1.4" fill="#22D3EE" opacity=".6"/>{/* HUD bar */}
        </svg>
      </div>
    );
  }

  // ─── CArm — 이동형 C-arm 영상장비 (+ 모니터 카트) ──────────────────
  function CArm({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 10, width: T * 2.2, height: T * 2.8, filter: 'drop-shadow(3px 4px 0 rgba(0,0,0,.3))' }}>
        <svg viewBox="0 0 36 46" width={T * 2.2} height={T * 2.8} shapeRendering="crispEdges">
          {/* C-shaped arc */}
          <path d="M10 6 A16 16 0 1 0 10 38" fill="none" stroke="#CBD5E1" strokeWidth="4"/>
          <path d="M10 6 A16 16 0 1 0 10 38" fill="none" stroke={C} strokeWidth=".6"/>
          {/* image intensifier (top) */}
          <rect x="6" y="2" width="10" height="6" fill="#94A3B8" stroke={C} strokeWidth=".5"/>
          {/* X-ray source (bottom) */}
          <rect x="6" y="36" width="10" height="6" fill="#6B7280" stroke={C} strokeWidth=".5"/>
          {/* support arm + base */}
          <rect x="22" y="18" width="10" height="4" fill="#9CA3AF" stroke={C} strokeWidth=".4"/>
          <rect x="30" y="8" width="5" height="32" fill="#B7BEC6" stroke={C} strokeWidth=".5"/>
          <ellipse cx="32" cy="43" rx="5" ry="2" fill="#4B5563" stroke={C} strokeWidth=".4"/>
        </svg>
      </div>
    );
  }

  Object.assign(window, {
    BairHugger, Bovie, KickBucket, TimeoutBoard, RoboticConsole, LapTower,
    CO2Insufflator, ScrubDispenser, ScrubTimer, ConsentClipboard, SoiledCart,
    ORBoomMonitor, CArm,
  });
})();
