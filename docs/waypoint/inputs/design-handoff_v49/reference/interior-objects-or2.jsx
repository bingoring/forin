// interior-objects-or2.jsx — Operating-suite (OR & PACU) blueprint objects.
// Same v2 pixel style: visible TOP + FRONT + side depth, viewed from 45° above.
// Tile-based coords. Loads after interior-shared/objects, before interior-or.

(function () {
  const C = '#2A2522';
  const T = window.ITILE || 16;

  // ─── BairHugger — 환자 가온 온풍 조절 장치 (+ 호스 + 담요) ──────────
  function BairHugger({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 4, width: T * 1.6, height: T * 2.1 }}>
        <svg viewBox="0 0 26 34" width={T * 1.6} height={T * 2.1} shapeRendering="geometricPrecision">
          <ellipse cx="9.0" cy="28.5" rx="8.5" ry="2.9" fill="rgba(0,0,0,.16)"/>
          {/* flexible warm-air hose coiling out of the unit's top port */}
          <path d="M17 9 Q24 7 23 11 Q22 15 25 16" fill="none" stroke="#BBD7E2" strokeWidth="2.6" strokeLinecap="round"/>
          <ellipse cx="16" cy="9" rx="1.6" ry="1" fill="#9CA3AF" stroke={C} strokeWidth=".35"/>{/* port */}
          {/* full silhouette */}
          <path d="M2 8 Q1 8 1 9 L1 25 Q1 26 2 26 L16 26 Q17 26 17 25 L17 9 Q17 8 16 8 Z" fill="#3E7CA8"/>
          {/* TOP face */}
          <path d="M2 8 Q1 8 1 9 L1 14 L17 14 L17 9 Q17 8 16 8 Z" fill="#5A9AC6"/>
          <circle cx="13" cy="11" r="1.8" fill="#CBD5E1" stroke={C} strokeWidth=".35"/>{/* dial on top */}
          {/* seam → viewer-facing panel */}
          <line x1="1" y1="14" x2="17" y2="14" stroke={C} strokeWidth=".55"/>
          <rect x="2.5" y="15" width="8" height="4" rx=".5" fill="#0F1A24"/>
          <text x="6.5" y="18" fontSize="2.6" fill="#FACC15" textAnchor="middle" fontFamily="monospace">38°</text>
          {/* filter grille on the front */}
          <rect x="2.5" y="20" width="12" height="3.4" rx=".3" fill="#1F2937"/>
          <rect x="2.5" y="20.6" width="12" height="2.2" fill="none" stroke="#6B7280" strokeWidth=".4" strokeDasharray="1 1"/>
          {/* re-stroke */}
          <path d="M2 8 Q1 8 1 9 L1 25 Q1 26 2 26 L16 26 Q17 26 17 25 L17 9 Q17 8 16 8 Z" fill="none" stroke={C} strokeWidth=".65"/>
          {/* wheels */}
          <ellipse cx="4" cy="27.5" rx="2" ry="1.4" fill="#2C3239"/>
          <ellipse cx="14" cy="27.5" rx="2" ry="1.4" fill="#2C3239"/>
        </svg>
      </div>
    );
  }

  // ─── Bovie / ESU — 전기소작기 (조직 절제·지혈) ─────────────────────
  function Bovie({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 4, width: T * 1.3, height: T * 1.9 }}>
        <svg viewBox="0 0 20 30" width={T * 1.3} height={T * 1.9} shapeRendering="geometricPrecision">
          <ellipse cx="10.0" cy="28.7" rx="6.8" ry="2.3" fill="rgba(0,0,0,.16)"/>
          {/* full generator silhouette (top face + tall viewer-facing panel) */}
          <path d="M2 2 Q1 2 1 3 L1 24 Q1 25 2 25 L18 25 Q19 25 19 24 L19 3 Q19 2 18 2 Z" fill="#54606C"/>
          {/* TOP face — casing top with the bovie pencil resting in its holster */}
          <path d="M2 2 Q1 2 1 3 L1 11 L19 11 L19 3 Q19 2 18 2 Z" fill="#6B7580"/>
          <rect x="14.5" y="3.5" width="2" height="6" rx="1" fill="#E5E7EB" stroke={C} strokeWidth=".4"/>{/* pencil */}
          <rect x="14.8" y="3" width="1.4" height="1.6" fill="#EAB308"/>
          <path d="M16.5 9 Q20 12 16.5 16" fill="none" stroke={C} strokeWidth=".5"/>{/* coiled cord */}
          {/* seam top → front control panel */}
          <line x1="1" y1="11" x2="19" y2="11" stroke={C} strokeWidth=".6"/>
          {/* VIEWER-FACING panel — cut/coag displays + dials */}
          <rect x="2.5" y="12.5" width="6" height="4" rx=".5" fill="#0F1A24"/>
          <text x="5.5" y="15.7" fontSize="3" fill="#FBBF24" textAnchor="middle" fontFamily="monospace">30</text>
          <rect x="11.5" y="12.5" width="6" height="4" rx=".5" fill="#0F1A24"/>
          <text x="14.5" y="15.7" fontSize="3" fill="#22D3EE" textAnchor="middle" fontFamily="monospace">25</text>
          <circle cx="6" cy="21" r="2.2" fill="#FBBF24" stroke={C} strokeWidth=".4"/>
          <line x1="6" y1="21" x2="7.4" y2="19.8" stroke={C} strokeWidth=".4"/>
          <circle cx="14" cy="21" r="2.2" fill="#22D3EE" stroke={C} strokeWidth=".4"/>
          <line x1="14" y1="21" x2="15.4" y2="19.8" stroke={C} strokeWidth=".4"/>
          {/* re-stroke silhouette */}
          <path d="M2 2 Q1 2 1 3 L1 24 Q1 25 2 25 L18 25 Q19 25 19 24 L19 3 Q19 2 18 2 Z" fill="none" stroke={C} strokeWidth=".7"/>
          {/* casters */}
          <ellipse cx="4" cy="26.5" rx="1.8" ry="1.4" fill="#2C3239"/>
          <ellipse cx="16" cy="26.5" rx="1.8" ry="1.4" fill="#2C3239"/>
        </svg>
      </div>
    );
  }

  // ─── KickBucket — 바퀴 달린 거즈 수거 양동이 (바닥) ────────────────
  function KickBucket({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T + 2, top: y * T + 2, width: T - 4, height: T - 2 }}>
        <svg viewBox="0 0 12 12" width={T - 4} height={T - 2} shapeRendering="crispEdges">
          <ellipse cx="6.0" cy="11.0" rx="4.1" ry="2" fill="rgba(0,0,0,.16)"/>
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
      <div style={{ position: 'absolute', left: x * T, top: y * T, width: T * w, height: T * 1.3 }}>
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
      <div style={{ position: 'absolute', left: x * T, top: y * T - 8, width: T * 2.2, height: T * 2.6 }}>
        <svg viewBox="0 0 36 42" width={T * 2.2} height={T * 2.6} shapeRendering="geometricPrecision">
          <ellipse cx="18.0" cy="38.9" rx="12.2" ry="4.1" fill="rgba(0,0,0,.16)"/>
          {/* full silhouette (top face + tall front) as ONE outline */}
          <path d="M6 6 Q4 6 4 8 L4 34 Q4 36 6 36 L30 36 Q32 36 32 34 L32 8 Q32 6 30 6 Z" fill="#8A929B"/>
          {/* TOP face — binocular viewport hood seen from above */}
          <path d="M6 6 Q4 6 4 8 L4 17 L32 17 L32 8 Q32 6 30 6 Z" fill="#A6ADB5"/>
          <path d="M10 8 L26 8 L24 14 L12 14 Z" fill="#1F2937" stroke={C} strokeWidth=".4"/>
          <rect x="13" y="9.4" width="4" height="3" fill="#0B1620"/>
          <rect x="19" y="9.4" width="4" height="3" fill="#0B1620"/>
          {/* seam top → front console */}
          <line x1="4" y1="17" x2="32" y2="17" stroke={C} strokeWidth=".6"/>
          {/* VIEWER-FACING armrest console + hand controls */}
          <rect x="6" y="18.5" width="24" height="6" rx="1" fill="#B7BEC6" stroke={C} strokeWidth=".4"/>
          <rect x="9" y="19.6" width="4" height="3.4" rx=".5" fill="#475569" stroke={C} strokeWidth=".4"/>
          <rect x="23" y="19.6" width="4" height="3.4" rx=".5" fill="#475569" stroke={C} strokeWidth=".4"/>
          {/* pedestal shading */}
          <rect x="14" y="25" width="8" height="8" fill="#727E8C"/>
          {/* foot-pedal tray on the floor in front */}
          <path d="M8 33 L28 33 L30 36.5 L6 36.5 Z" fill="#374151" stroke={C} strokeWidth=".4"/>
          <rect x="11" y="33.8" width="4" height="2" fill="#FBBF24"/>
          <rect x="21" y="33.8" width="4" height="2" fill="#22D3EE"/>
          {/* re-stroke silhouette */}
          <path d="M6 6 Q4 6 4 8 L4 34 Q4 36 6 36 L30 36 Q32 36 32 34 L32 8 Q32 6 30 6 Z" fill="none" stroke={C} strokeWidth=".7"/>
        </svg>
      </div>
    );
  }

  // ─── LapTower — 복강경 모니터 타워 (2단 모니터 + 광원 + 레코더) ─────
  function LapTower({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 18, width: T * 1.5, height: T * 3.4 }}>
        <svg viewBox="0 0 24 56" width={T * 1.5} height={T * 3.4} shapeRendering="geometricPrecision">
          <ellipse cx="12.0" cy="48.5" rx="9" ry="3" fill="rgba(0,0,0,.16)"/>
          {/* viewer-facing endoscopy monitor with a top bezel cap */}
          <path d="M2 0.4 L22 0.4 L23 1.8 L1 1.8 Z" fill="#2C333B"/>
          <rect x="1" y="1.8" width="22" height="13.5" fill="#111827" stroke={C} strokeWidth=".6"/>
          <rect x="2.5" y="3" width="19" height="11" rx=".4" fill="#3A1414"/>
          <ellipse cx="12" cy="8.5" rx="7" ry="5" fill="#7C2D2D"/>
          <ellipse cx="10" cy="8" rx="2.5" ry="3.5" fill="#A83A3A"/>
          <rect x="11" y="4" width="1.5" height="9" fill="#D9C8A8"/>{/* instrument */}
          {/* tower cabinet silhouette (top cap + stacked modules) */}
          <path d="M3.5 16 L20.5 16 L20.5 45 Q20.5 45.6 20 45.6 L4 45.6 Q3.5 45.6 3.5 45 Z" fill="#9CA3AF"/>
          {/* top cap face */}
          <path d="M3.5 16 L20.5 16 L19.4 18 L4.6 18 Z" fill="#B7BEC6" stroke={C} strokeWidth=".4"/>
          {/* light-source module (viewer face) */}
          <rect x="4" y="18.5" width="16" height="7" fill="#374151" stroke={C} strokeWidth=".5"/>
          <rect x="5" y="20" width="9" height="3" fill="#0F1A24"/>
          <rect x="5.5" y="20.6" width="6" height="1.4" fill="#22D3EE"/>
          <circle cx="17" cy="22" r="1.6" fill="#A7F3D0" stroke={C} strokeWidth=".3"/>
          {/* insufflator / recorder module */}
          <rect x="4" y="26" width="16" height="6" fill="#5B6776" stroke={C} strokeWidth=".5"/>
          <rect x="5.5" y="27.5" width="6" height="3" fill="#0F1A24"/>
          <text x="8.5" y="30" fontSize="2.4" fill="#FBBF24" textAnchor="middle" fontFamily="monospace">CO₂</text>
          <circle cx="16" cy="29" r="1.6" fill="#fff" stroke={C} strokeWidth=".3"/>
          {/* drawers */}
          <rect x="4.5" y="33" width="15" height="3" fill="#EDEFF2" stroke={C} strokeWidth=".3"/>
          <rect x="4.5" y="37.5" width="15" height="3" fill="#EDEFF2" stroke={C} strokeWidth=".3"/>
          {/* re-stroke cabinet silhouette */}
          <path d="M3.5 16 L20.5 16 L20.5 45 Q20.5 45.6 20 45.6 L4 45.6 Q3.5 45.6 3.5 45 Z" fill="none" stroke={C} strokeWidth=".6"/>
          {/* wheels */}
          <ellipse cx="6" cy="47.5" rx="2.2" ry="1.6" fill="#2C3239"/>
          <ellipse cx="18" cy="47.5" rx="2.2" ry="1.6" fill="#2C3239"/>
        </svg>
      </div>
    );
  }

  // ─── CO2Insufflator — 이산화탄소 인수플레이터 (복부 팽창 가스) ──────
  function CO2Insufflator({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T + 1, top: y * T - 2, width: T - 2, height: T * 1.6 }}>
        <svg viewBox="0 0 14 26" width={T - 2} height={T * 1.6} shapeRendering="geometricPrecision">
          <ellipse cx="7.0" cy="21" rx="5" ry="1.8" fill="rgba(0,0,0,.16)"/>
          {/* green CO2 cylinder standing behind (round top + vertical body) */}
          <ellipse cx="3" cy="3" rx="1.8" ry="1" fill="#4ADE80" stroke={C} strokeWidth=".3"/>
          <path d="M1.2 3 L1.2 9 Q1.2 10 3 10 Q4.8 10 4.8 9 L4.8 3" fill="#16A34A" stroke={C} strokeWidth=".35"/>
          {/* full unit silhouette */}
          <path d="M2 6 Q1 6 1 7 L1 20 Q1 21 2 21 L12 21 Q13 21 13 20 L13 7 Q13 6 12 6 Z" fill="#54606C"/>
          {/* TOP face */}
          <path d="M2 6 Q1 6 1 7 L1 12 L13 12 L13 7 Q13 6 12 6 Z" fill="#6B7580"/>
          <circle cx="10" cy="9" r="1.8" fill="#fff" stroke={C} strokeWidth=".3"/>{/* pressure gauge */}
          <line x1="10" y1="9" x2="11.1" y2="8" stroke={C} strokeWidth=".3"/>
          {/* seam → viewer-facing panel */}
          <line x1="1" y1="12" x2="13" y2="12" stroke={C} strokeWidth=".55"/>
          <rect x="2" y="13" width="7" height="4" rx=".4" fill="#0F1A24"/>
          <text x="5.5" y="16" fontSize="2.6" fill="#22D3EE" textAnchor="middle" fontFamily="monospace">12</text>
          <rect x="10" y="13.4" width="2.4" height="2.4" rx=".4" fill="#334155" stroke={C} strokeWidth=".3"/>
          {/* re-stroke */}
          <path d="M2 6 Q1 6 1 7 L1 20 Q1 21 2 21 L12 21 Q13 21 13 20 L13 7 Q13 6 12 6 Z" fill="none" stroke={C} strokeWidth=".6"/>
        </svg>
      </div>
    );
  }

  // ─── ScrubDispenser — 벽면 소독액(클로르헥시딘/베타딘) + 솔/타월 박스 ─
  function ScrubDispenser({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T + 1, top: y * T - 2, width: T - 2, height: T * 1.6 }}>
        <svg viewBox="0 0 14 26" width={T - 2} height={T * 1.6} shapeRendering="geometricPrecision">
          <ellipse cx="7.0" cy="25.0" rx="4.8" ry="2" fill="rgba(0,0,0,.16)"/>
          {/* full wall-unit silhouette */}
          <path d="M1 2 L13 2 L13 23 Q13 24 12 24 L2 24 Q1 24 1 23 Z" fill="#C7CDD4"/>
          {/* TOP bevel face */}
          <path d="M1 2 L13 2 L12 4.4 L2 4.4 Z" fill="#DDE1E6"/>
          <line x1="1" y1="4.4" x2="13" y2="4.4" stroke={C} strokeWidth=".5"/>
          {/* chlorhexidine (pink) + betadine (amber) bottles, elbow levers */}
          <rect x="2" y="5.4" width="4" height="7" rx=".4" fill="#F9C9D6" stroke={C} strokeWidth=".4"/>
          <rect x="2.4" y="6.2" width="1.2" height="5" fill="#FBDCE5"/>
          <rect x="1" y="12.4" width="6" height="1.6" rx=".3" fill="#9CA3AF"/>
          <rect x="8" y="5.4" width="4" height="7" rx=".4" fill="#B45309" stroke={C} strokeWidth=".4"/>
          <rect x="8.4" y="6.2" width="1.2" height="5" fill="#D97706"/>
          <rect x="7" y="12.4" width="6" height="1.6" rx=".3" fill="#9CA3AF"/>
          {/* towel / brush box below */}
          <rect x="1.5" y="15" width="11" height="8" rx=".3" fill="#fff" stroke={C} strokeWidth=".5"/>
          <rect x="1.5" y="15" width="11" height="2" fill="#3B82F6"/>
          <rect x="3" y="18" width="8" height="2" fill="#E5E7EB" stroke={C} strokeWidth=".3"/>
          <rect x="3" y="20.6" width="4" height="2" fill="#16A34A"/>
          {/* re-stroke */}
          <path d="M1 2 L13 2 L13 23 Q13 24 12 24 L2 24 Q1 24 1 23 Z" fill="none" stroke={C} strokeWidth=".6"/>
        </svg>
      </div>
    );
  }

  // ─── ScrubTimer — 벽면 디지털 스크럽 타이머 (5분 카운트다운) ────────
  function ScrubTimer({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T + 2, top: y * T + 1, width: T - 4, height: T - 2 }}>
        <svg viewBox="0 0 12 12" width={T - 4} height={T - 2} shapeRendering="crispEdges">
          <ellipse cx="6.0" cy="11.0" rx="4.1" ry="2" fill="rgba(0,0,0,.16)"/>
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
      <div style={{ position: 'absolute', left: x * T + 3, top: y * T + 3, width: T - 6, height: T - 4 }}>
        <svg viewBox="0 0 10 12" width={T - 6} height={T - 4} shapeRendering="crispEdges">
          <ellipse cx="5.0" cy="11.0" rx="3.4" ry="2" fill="rgba(0,0,0,.16)"/>
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
      <div style={{ position: 'absolute', left: x * T, top: y * T - 4, width: T * 1.3, height: T * 1.7 }}>
        <svg viewBox="0 0 20 28" width={T * 1.3} height={T * 1.7} shapeRendering="geometricPrecision">
          <ellipse cx="10.0" cy="26.7" rx="6.8" ry="2.3" fill="rgba(0,0,0,.16)"/>
          {/* full silhouette */}
          <path d="M2 2 Q1 2 1 3 L1 22 Q1 23 2 23 L18 23 Q19 23 19 22 L19 3 Q19 2 18 2 Z" fill="#9AA1A9"/>
          {/* TOP lid face — closed hinged lid seen from above */}
          <path d="M2 2 Q1 2 1 3 L1 11 L19 11 L19 3 Q19 2 18 2 Z" fill="#B4BAC2"/>
          <rect x="3" y="3.4" width="14" height="5.6" rx=".6" fill="#A6ADB5" stroke={C} strokeWidth=".35"/>
          <rect x="8.5" y="2" width="3" height="1.6" fill="#4B5563"/>{/* latch */}
          {/* seam lid → body */}
          <line x1="1" y1="11" x2="19" y2="11" stroke={C} strokeWidth=".6"/>
          {/* FRONT body with biohazard panel */}
          <rect x="6" y="13" width="8" height="8" rx=".5" fill="#FACC15" stroke={C} strokeWidth=".4"/>
          <text x="10" y="19" fontSize="5" fill={C} textAnchor="middle" fontFamily="monospace">☣</text>
          {/* re-stroke silhouette */}
          <path d="M2 2 Q1 2 1 3 L1 22 Q1 23 2 23 L18 23 Q19 23 19 22 L19 3 Q19 2 18 2 Z" fill="none" stroke={C} strokeWidth=".7"/>
          {/* wheels */}
          <ellipse cx="4" cy="24.5" rx="2.4" ry="1.6" fill="#2C3239"/>
          <ellipse cx="16" cy="24.5" rx="2.4" ry="1.6" fill="#2C3239"/>
        </svg>
      </div>
    );
  }

  // ─── ORBoomMonitor — 천장 붐형 수술 디스플레이 (복강경 화면) ────────
  function ORBoomMonitor({ x, y, w = 2 }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 6, width: T * w, height: T * 1.6, zIndex: 1 }}>
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
      <div style={{ position: 'absolute', left: x * T, top: y * T - 10, width: T * 2.2, height: T * 2.8 }}>
        <svg viewBox="0 0 36 46" width={T * 2.2} height={T * 2.8} shapeRendering="crispEdges">
          <ellipse cx="18.0" cy="42.9" rx="12.2" ry="4.1" fill="rgba(0,0,0,.16)"/>
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
