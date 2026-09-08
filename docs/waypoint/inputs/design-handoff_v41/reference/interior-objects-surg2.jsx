// interior-objects-surg2.jsx — General Surgery Ward blueprint objects.
// Perioperative nursing: PCA pumps, surgical drains (JP/Hemovac), NG-to-suction,
// SCD/DVT prophylaxis, ambulation aids, OP schedule board. v2 pixel style.
// Loads before the Surgery-ward screen render.

(function () {
  const C = '#2A2522';
  const T = window.ITILE || 16;

  // ─── PCAPump — 무통주사(PCA) 펌프 (IV 폴대 장착, 버튼) ──────────────
  function PCAPump({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 18, width: T, height: T * 3 }}>
        <svg viewBox="0 0 16 48" width={T} height={T * 3} shapeRendering="geometricPrecision">
          <ellipse cx="8.0" cy="47.0" rx="5.4" ry="2" fill="rgba(0,0,0,.16)"/>
          {/* IV bag on the hook */}
          <rect x="5" y="0" width="6" height="1.4" fill="#9CA3AF"/>
          <rect x="4.5" y="1.4" width="5" height="7" fill="#BFE3EE" stroke={C} strokeWidth=".4"/>
          <rect x="5" y="2.4" width="2" height="5" fill="#D4F0F8"/>
          {/* pump module: TOP lid (dominant) folding straight into a continuous front */}
          <path d="M2 12.5 L14 12.5 L14 21 Q14 22 13 22 L3 22 Q2 22 2 21 Z" fill="#3E4756" stroke={C} strokeWidth=".55"/>
          <rect x="2" y="9" width="12" height="3.5" rx=".8" fill="#586471" stroke={C} strokeWidth=".5"/>{/* lid */}
          <rect x="3" y="9.6" width="10" height="1.1" fill="#6E7C8C"/>{/* back-edge highlight */}
          <line x1="2" y1="12.5" x2="14" y2="12.5" stroke={C} strokeWidth=".5"/>{/* top↔front seam */}
          {/* viewer-facing screen + lock on the front */}
          <rect x="3" y="13.4" width="10" height="4.2" rx=".4" fill="#0F1A24"/>
          <rect x="3.6" y="14.2" width="6" height="1.2" fill="#22D3EE"/>
          <rect x="3.6" y="16" width="8" height="1" fill="#10B981"/>
          <rect x="10.5" y="18.4" width="2.5" height="2.5" rx=".4" fill="#FACC15"/>{/* lock */}
          {/* the patient demand button on a coiled cord */}
          <path d="M14 17 Q18 20 15 24" fill="none" stroke={C} strokeWidth=".5"/>
          <rect x="13.5" y="24" width="3.5" height="4.5" rx="1.4" fill="#DC2626" stroke={C} strokeWidth=".4"/>
          <circle cx="15.2" cy="26.2" r="1" fill="#FCA5A5"/>
          {/* pole + base */}
          <rect x="7" y="22" width="2" height="20" fill="#CBD5E1" stroke={C} strokeWidth=".3"/>
          <ellipse cx="8" cy="44" rx="6" ry="2" fill="#6B7280" stroke={C} strokeWidth=".4"/>
          <ellipse cx="3" cy="45.5" rx="1.3" ry="1" fill={C}/>
          <ellipse cx="13" cy="45.5" rx="1.3" ry="1" fill={C}/>
        </svg>
      </div>
    );
  }

  // ─── JPDrain — Jackson-Pratt 배액관 (수류탄 모양 음압 백) ───────────
  function JPDrain({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T + 3, top: y * T + 2, width: T - 6, height: T * 1.3 }}>
        <svg viewBox="0 0 10 16" width={T - 6} height={T * 1.3} shapeRendering="crispEdges">
          <ellipse cx="5.0" cy="15.0" rx="3.4" ry="2" fill="rgba(0,0,0,.16)"/>
          {/* tubing up to the wound */}
          <path d="M5 0 Q2 3 4 6" fill="none" stroke="#E0A0A0" strokeWidth=".7"/>
          {/* grenade-shaped compressed bulb */}
          <rect x="3.5" y="5" width="3" height="1.6" fill="#9CA3AF" stroke={C} strokeWidth=".3"/>{/* cap */}
          <path d="M2 8 Q5 6 8 8 L8 13 Q5 15 2 13 Z" fill="#C97B6E" stroke={C} strokeWidth=".5"/>
          {/* accordion ribs */}
          <path d="M2.4 9.5 Q5 8.6 7.6 9.5" fill="none" stroke={C} strokeWidth=".3" opacity=".5"/>
          <path d="M2.3 11 Q5 10.2 7.7 11" fill="none" stroke={C} strokeWidth=".3" opacity=".5"/>
          {/* serosanguinous fluid */}
          <path d="M2.6 11.5 Q5 13.6 7.4 11.5 L7.4 12.6 Q5 14.6 2.6 12.6 Z" fill="#8B2530"/>
        </svg>
      </div>
    );
  }

  // ─── Hemovac — 대용량 원반형 음압 배액관 ───────────────────────────
  function Hemovac({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T + 2, top: y * T + 2, width: T - 4, height: T - 2 }}>
        <svg viewBox="0 0 12 12" width={T - 4} height={T - 2} shapeRendering="crispEdges">
          <ellipse cx="6.0" cy="11.0" rx="4.1" ry="2" fill="rgba(0,0,0,.16)"/>
          {/* tubing */}
          <path d="M6 0 Q3 2 5 3.5" fill="none" stroke="#E0A0A0" strokeWidth=".7"/>
          {/* compressed disc body (top view) */}
          <ellipse cx="6" cy="7.5" rx="5" ry="4" fill="#B86B5E" stroke={C} strokeWidth=".5"/>
          <ellipse cx="6" cy="7" rx="4" ry="3" fill="#C97B6E"/>
          {/* spring-disc concentric rings */}
          <ellipse cx="6" cy="7" rx="2.6" ry="2" fill="none" stroke={C} strokeWidth=".3" opacity=".5"/>
          <ellipse cx="6" cy="7" rx="1.2" ry="1" fill="#8B2530"/>
          {/* port */}
          <rect x="5.4" y="3.4" width="1.2" height="1.6" fill="#9CA3AF"/>
        </svg>
      </div>
    );
  }

  // ─── NGSuction — 비위관(Levin) → 벽면 흡인기 (담즙색 위액) ──────────
  function NGSuction({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T, width: T * 1.2, height: T * 1.8 }}>
        <svg viewBox="0 0 20 30" width={T * 1.2} height={T * 1.8} shapeRendering="crispEdges">
          <ellipse cx="14.5" cy="25.5" rx="6" ry="2.2" fill="rgba(0,0,0,.16)"/>
          {/* wall suction regulator */}
          <rect x="11" y="1" width="8" height="9" fill="#475569" stroke={C} strokeWidth=".5"/>
          <circle cx="15" cy="5.5" r="2.6" fill="#0F1A24"/>
          <line x1="15" y1="5.5" x2="16.6" y2="4" stroke="#22D3EE" strokeWidth=".5"/>
          <text x="15" y="9.2" fontSize="2" fill="#FBBF24" textAnchor="middle" fontFamily="monospace">LOW</text>
          {/* collection canister with bile-green gastric fluid */}
          <rect x="11" y="11" width="7" height="14" fill="#D4E8E0" stroke={C} strokeWidth=".5" opacity=".9"/>
          <rect x="11" y="17" width="7" height="8" fill="#6FA03C" opacity=".7"/>
          {[0,1,2].map(i => <rect key={i} x="11" y={13 + i*3} width="2" height=".5" fill={C} opacity=".4"/>)}
          {/* NG tube routing in from the patient (left) */}
          <path d="M0 20 Q6 16 11 19" fill="none" stroke="#C6E0A0" strokeWidth="1"/>
        </svg>
      </div>
    );
  }

  // ─── SCDDevice — 간헐적 공기 압박 장치 (DVT 예방, 다리 슬리브) ──────
  function SCDDevice({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 3, width: T * 1.6, height: T * 1.7 }}>
        <svg viewBox="0 0 26 28" width={T * 1.6} height={T * 1.7} shapeRendering="geometricPrecision">
          {/* split ground shadow — one blob under the pump, one under the leg sleeve */}
          <ellipse cx="7.5" cy="20.5" rx="6" ry="1.8" fill="rgba(0,0,0,.16)"/>
          <ellipse cx="20" cy="25" rx="4.5" ry="1.7" fill="rgba(0,0,0,.16)"/>
          {/* pump: TOP lid (dominant) folding into a continuous short front */}
          <path d="M1 12 L15 12 L15 19 Q15 20 14 20 L2 20 Q1 20 1 19 Z" fill="#4E5865" stroke={C} strokeWidth=".7"/>
          <rect x="1" y="3" width="14" height="9" rx="1.2" fill="#5E6B7A" stroke={C} strokeWidth=".7"/>{/* lid */}
          <rect x="2.4" y="4.2" width="11" height="1.5" fill="#77869A"/>{/* back-edge highlight */}
          <line x1="1" y1="12" x2="15" y2="12" stroke={C} strokeWidth=".55"/>{/* top↔front seam */}
          {/* viewer-facing display + status light on the front */}
          <rect x="3" y="13.4" width="7" height="4" rx=".5" fill="#0F1A24"/>
          <rect x="4" y="14.4" width="5" height="1" fill="#22D3EE"/>
          <circle cx="12" cy="15.4" r="1.4" fill="#10B981" stroke={C} strokeWidth=".35"/>
          {/* twin air hoses out to the leg sleeve */}
          <path d="M15 9 Q20 10 20 14" fill="none" stroke="#94A3B8" strokeWidth="1.3"/>
          <path d="M15 11 Q22 12 22 16" fill="none" stroke="#94A3B8" strokeWidth="1.3"/>
          {/* inflatable leg sleeve wrapping (velcro segments) */}
          <rect x="17" y="14" width="8" height="12" rx="2" fill="#A8C7DC" stroke={C} strokeWidth=".55"/>
          <line x1="17" y1="18" x2="25" y2="18" stroke={C} strokeWidth=".4"/>
          <line x1="17" y1="21.5" x2="25" y2="21.5" stroke={C} strokeWidth=".4"/>
          <rect x="18" y="15" width="6" height="1.6" fill="#C3DAEA"/>
        </svg>
      </div>
    );
  }

  // ─── Walker — 보행 보조기 (워커) ──────────────────────────────────
  function Walker({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T, width: T * 1.4, height: T * 1.5 }}>
        <svg viewBox="0 0 22 24" width={T * 1.4} height={T * 1.5} shapeRendering="crispEdges">
          <ellipse cx="11.0" cy="22.4" rx="7.5" ry="2.6" fill="rgba(0,0,0,.16)"/>
          {/* top grip bars (foreshortened frame) */}
          <path d="M3 4 L19 4 L17 7 L5 7 Z" fill="#9CA3AF" stroke={C} strokeWidth=".4"/>
          <rect x="4" y="3" width="4" height="1.6" fill="#374151"/>{/* grips */}
          <rect x="14" y="3" width="4" height="1.6" fill="#374151"/>
          {/* front cross bar */}
          <rect x="5" y="11" width="12" height="1.6" fill="#CBD5E1" stroke={C} strokeWidth=".3"/>
          {/* legs */}
          <rect x="3" y="7" width="1.8" height="15" fill="#B7BEC6" stroke={C} strokeWidth=".4"/>
          <rect x="17.2" y="7" width="1.8" height="15" fill="#B7BEC6" stroke={C} strokeWidth=".4"/>
          <rect x="6" y="12" width="1.6" height="10" fill="#9CA3AF" stroke={C} strokeWidth=".3"/>
          <rect x="14.4" y="12" width="1.6" height="10" fill="#9CA3AF" stroke={C} strokeWidth=".3"/>
          {/* feet */}
          {[3.4,6.2,14.6,17.6].map((fx,i) => <rect key={i} x={fx} y="22" width="2" height="2" fill={C}/>)}
        </svg>
      </div>
    );
  }

  // ─── WalkerRack — 워커/보행 보조기 보관대 ─────────────────────────
  function WalkerRack({ x, y, w = 3 }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T, width: T * w, height: T * 1.4 }}>
        <svg viewBox={`0 0 ${w*16} 22`} width={T * w} height={T * 1.4} shapeRendering="crispEdges" preserveAspectRatio="none">
          {/* floor zone */}
          <rect x="0" y="2" width={w*16} height="20" fill="#E8EEF0" stroke={C} strokeWidth=".5"/>
          <rect x="0" y="2" width={w*16} height="2" fill="#3B82F6"/>
          {/* parked walkers (simplified frames) */}
          {[...Array(w)].map((_,i) => (
            <g key={i}>
              <rect x={3 + i*16} y="6" width="10" height="1.6" fill="#9CA3AF" stroke={C} strokeWidth=".3"/>
              <rect x={3.5 + i*16} y="7" width="1.6" height="13" fill="#B7BEC6" stroke={C} strokeWidth=".3"/>
              <rect x={11 + i*16} y="7" width="1.6" height="13" fill="#B7BEC6" stroke={C} strokeWidth=".3"/>
              <rect x={3.5 + i*16} y="13" width="9" height="1.2" fill="#CBD5E1"/>
            </g>
          ))}
        </svg>
      </div>
    );
  }

  // ─── OPScheduleBoard — 수술 스케줄 화이트보드 ──────────────────────
  function OPScheduleBoard({ x, y, w = 4 }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T, width: T * w, height: T * 1.5 }}>
        <svg viewBox={`0 0 ${w*16} 24`} width={T * w} height={T * 1.5} shapeRendering="crispEdges" preserveAspectRatio="none">
          <rect x="0" y="0" width={w*16} height="24" fill="#E5E7EB" stroke={C} strokeWidth=".7"/>
          <rect x="1.5" y="1.5" width={w*16-3} height="21" fill="#fff"/>
          {/* header */}
          <rect x="1.5" y="1.5" width={w*16-3} height="4" fill="#2563EB"/>
          <rect x="3" y="2.6" width={w*9} height="1.8" fill="#fff"/>
          {/* column dividers */}
          <line x1={w*7} y1="6" x2={w*7} y2="23" stroke={C} strokeWidth=".3" opacity=".4"/>
          <line x1={w*12} y1="6" x2={w*12} y2="23" stroke={C} strokeWidth=".3" opacity=".4"/>
          {/* OP rows with status chips (수술중/회복중/복귀) */}
          {[['#F87171',7],['#FBBF24',11],['#34D399',15],['#94A3B8',19]].map(([col,ry],i) => (
            <g key={i}>
              <rect x="3" y={ry} width={w*5} height="1.4" fill={C} opacity=".5"/>
              <rect x={w*7+2} y={ry} width={w*3.5} height="1.4" fill={C} opacity=".4"/>
              <rect x={w*12+2} y={ry-0.4} width={w*2.6} height="2.4" rx="1" fill={col}/>
            </g>
          ))}
        </svg>
      </div>
    );
  }

  // ─── StapleRemover — 스킨 스테이플러 제거기 (트레이 위) ─────────────
  function StapleRemover({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T + 3, top: y * T + 4, width: T - 6, height: T - 8 }}>
        <svg viewBox="0 0 12 8" width={T - 6} height={T - 8} shapeRendering="crispEdges">
          <ellipse cx="6.0" cy="7.0" rx="4.1" ry="2" fill="rgba(0,0,0,.16)"/>
          {/* sterile tray */}
          <rect x="0" y="3" width="12" height="5" rx="1" fill="#A5D8E8" stroke={C} strokeWidth=".4"/>
          {/* staple remover tool (plier-like) */}
          <path d="M1 6 L7 4 L11 1.5" fill="none" stroke="#9CA3AF" strokeWidth="1.2"/>
          <path d="M1 6 L7 5.4 L11 4" fill="none" stroke="#CBD5E1" strokeWidth="1.2"/>
          <circle cx="5.5" cy="5" r=".8" fill="#374151"/>
          <rect x="10" y="0.6" width="2" height="2" fill="#475569"/>
        </svg>
      </div>
    );
  }

  // ─── AbdoBinder — 복대 (수술 후 복부 지지대, 선반/카트용) ────────────
  function AbdoBinder({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T + 3, top: y * T + 3, width: T - 6, height: T - 6 }}>
        <svg viewBox="0 0 10 10" width={T - 6} height={T - 6} shapeRendering="crispEdges">
          <ellipse cx="5.0" cy="9.0" rx="3.4" ry="2" fill="rgba(0,0,0,.16)"/>
          {/* rolled elastic binder */}
          <ellipse cx="5" cy="5" rx="4.4" ry="4.4" fill="#E8E0D0" stroke={C} strokeWidth=".5"/>
          <ellipse cx="5" cy="5" rx="1.6" ry="1.6" fill="#CFC6B2" stroke={C} strokeWidth=".3"/>
          {/* velcro band */}
          <path d="M5 0.6 A4.4 4.4 0 0 1 9 4" fill="none" stroke="#B0A689" strokeWidth="1"/>
          <rect x="7.4" y="6.6" width="2.4" height="1.6" fill="#9C8F70"/>
        </svg>
      </div>
    );
  }

  Object.assign(window, {
    PCAPump, JPDrain, Hemovac, NGSuction, SCDDevice, Walker, WalkerRack,
    OPScheduleBoard, StapleRemover, AbdoBinder,
  });
})();
