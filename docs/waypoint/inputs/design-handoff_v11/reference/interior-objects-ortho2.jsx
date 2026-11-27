// interior-objects-ortho2.jsx — Orthopedics Ward blueprint objects.
// Impaired-mobility care: skeletal traction, CPM, casting, abduction pillow,
// braces, bed alarm. v2 pixel style. Loads before the Ortho-ward screen.

(function () {
  const C = '#2A2522';
  const T = window.ITILE || 16;

  // ─── TractionFrame — 골격 견인 장치 (철제 틀 + 도르래 + 추) ─────────
  function TractionFrame({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 20, width: T * 2.4, height: T * 3.4, zIndex: 2, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.28))' }}>
        <svg viewBox="0 0 38 54" width={T * 2.4} height={T * 3.4} shapeRendering="crispEdges">
          {/* overhead steel frame */}
          <rect x="2" y="2" width="3" height="40" fill="#9CA3AF" stroke={C} strokeWidth=".5"/>
          <rect x="33" y="2" width="3" height="40" fill="#9CA3AF" stroke={C} strokeWidth=".5"/>
          <rect x="2" y="2" width="34" height="3" fill="#B7BEC6" stroke={C} strokeWidth=".5"/>
          {/* pulley at the foot end */}
          <circle cx="30" cy="10" r="2.6" fill="#CBD5E1" stroke={C} strokeWidth=".5"/>
          <circle cx="30" cy="10" r=".9" fill="#475569"/>
          {/* cord: from leg pin over the pulley down to weights */}
          <path d="M14 18 L30 8" stroke={C} strokeWidth=".7"/>
          <path d="M30 12 L30 34" stroke={C} strokeWidth=".7"/>
          {/* the elevated leg with a pin site */}
          <rect x="8" y="16" width="12" height="4" rx="2" fill="#FBD9C0" stroke={C} strokeWidth=".4"/>
          <rect x="13.5" y="14.5" width="1.4" height="5" fill="#9CA3AF"/>{/* skeletal pin */}
          <rect x="6" y="15" width="4" height="6" fill="#fff" stroke={C} strokeWidth=".3"/>{/* sling */}
          {/* stacked iron weights hanging in the air */}
          <rect x="27" y="34" width="6" height="3" fill="#475569" stroke={C} strokeWidth=".4"/>
          <rect x="27.5" y="37" width="5" height="3" fill="#374151" stroke={C} strokeWidth=".4"/>
          <rect x="28" y="40" width="4" height="3" fill="#475569" stroke={C} strokeWidth=".4"/>
        </svg>
      </div>
    );
  }

  // ─── CPMMachine — 무릎 지속수동운동 (CPM) 기계 (다리 거치) ──────────
  function CPMMachine({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 6, width: T * 2.2, height: T * 1.7, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.26))' }}>
        <svg viewBox="0 0 36 28" width={T * 2.2} height={T * 1.7} shapeRendering="crispEdges">
          {/* hinged cradle (thigh → knee bend → calf) */}
          <path d="M2 18 L14 18 L20 8 L26 8" fill="none" stroke="#7FA8C0" strokeWidth="5" strokeLinejoin="round"/>
          <path d="M2 18 L14 18 L20 8 L26 8" fill="none" stroke={C} strokeWidth=".6" strokeLinejoin="round"/>
          {/* hinge joint at the knee */}
          <circle cx="17" cy="13" r="2.6" fill="#475569" stroke={C} strokeWidth=".5"/>
          <circle cx="17" cy="13" r=".9" fill="#FBBF24"/>
          {/* leg resting in the cradle */}
          <rect x="3" y="14" width="11" height="3.5" rx="1.7" fill="#FBD9C0"/>
          <rect x="20" y="5" width="7" height="3.5" rx="1.7" fill="#FBD9C0"/>
          {/* base unit: TOP lid (dominant) folding into a continuous short front */}
          <path d="M1 21 L21 21 L21 25 Q21 26 20 26 L2 26 Q1 26 1 25 Z" fill="#454E5B" stroke={C} strokeWidth=".55"/>
          <rect x="1" y="18" width="20" height="3.2" rx=".8" fill="#5B6776" stroke={C} strokeWidth=".5"/>{/* lid */}
          <rect x="2.5" y="18.6" width="17" height="1" fill="#6F7C8B"/>{/* back-edge highlight */}
          <line x1="1" y1="21" x2="21" y2="21" stroke={C} strokeWidth=".5"/>{/* top↔front seam */}
          {/* viewer-facing control on the front band */}
          <rect x="2.5" y="22" width="6" height="3" rx=".4" fill="#0F1A24"/>
          <rect x="3" y="22.7" width="4" height="1" fill="#22D3EE"/>
          <text x="15" y="24.4" fontSize="2.4" fill="#A7F3D0" textAnchor="middle" fontFamily="monospace">90°</text>
          <ellipse cx="4" cy="26.5" rx="2" ry="1.2" fill={C}/>
          <ellipse cx="18" cy="26.5" rx="2" ry="1.2" fill={C}/>
        </svg>
      </div>
    );
  }

  // ─── PlasterTrapSink — 석고 트랩 싱크대 (하단 석고 분리 필터) ────────
  function PlasterTrapSink({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 2, width: T * 1.6, height: T * 1.9, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.24))' }}>
        <svg viewBox="0 0 26 34" width={T * 1.6} height={T * 2.1} shapeRendering="geometricPrecision">
          {/* TOP counter face (dominant) folding into a continuous front cabinet */}
          <path d="M2 15 L24 15 L24 24 Q24 25 23 25 L3 25 Q2 25 2 24 Z" fill="#9AA6B2" stroke={C} strokeWidth=".7"/>
          <rect x="2" y="4" width="22" height="11" rx="1" fill="#C3CAD1" stroke={C} strokeWidth=".7"/>
          {/* deep basin opening seen from above, plaster-cloudy water */}
          <rect x="5" y="6" width="16" height="7.5" rx="1.2" fill="#7E8893" stroke={C} strokeWidth=".6"/>
          <rect x="6.5" y="7" width="13" height="5.5" rx=".8" fill="#C4CBC6"/>{/* cloudy water */}
          <ellipse cx="13" cy="9.6" rx="2.2" ry="1.2" fill="#AAB2AC"/>
          {/* faucet mounted at the back edge, arching over the basin */}
          <rect x="11.5" y="1.5" width="1.8" height="4" rx=".6" fill="#9CA3AF" stroke={C} strokeWidth=".35"/>
          <path d="M12.4 2 Q17 1.4 17 5.6" fill="none" stroke="#9CA3AF" strokeWidth="1.4"/>
          <line x1="2" y1="15" x2="24" y2="15" stroke={C} strokeWidth=".55"/>{/* top↔front seam */}
          {/* viewer-facing cabinet front with the big TRAP filter behind a door */}
          <rect x="4" y="16.5" width="18" height="7.5" rx=".4" fill="#EDEFF2" stroke={C} strokeWidth=".4"/>
          <rect x="8.5" y="18" width="9" height="5" rx=".5" fill="#B7BEC6" stroke={C} strokeWidth=".45"/>
          <ellipse cx="13" cy="20.5" rx="3.4" ry="1.6" fill="#94A3B8"/>
          <text x="13" y="21.2" fontSize="2.4" fill={C} textAnchor="middle" fontFamily="monospace">TRAP</text>
        </svg>
      </div>
    );
  }

  // ─── CastCutter — 깁스 절단 전기톱 ────────────────────────────────
  function CastCutter({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T + 2, top: y * T + 3, width: T - 4, height: T - 6, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.22))' }}>
        <svg viewBox="0 0 14 10" width={T - 4} height={T - 6} shapeRendering="crispEdges">
          {/* body */}
          <rect x="1" y="3" width="8" height="4.5" rx="1.5" fill="#F59E0B" stroke={C} strokeWidth=".4"/>
          <rect x="2" y="4" width="3" height="2.5" fill="#0F1A24"/>{/* vent */}
          {/* circular blade */}
          <circle cx="11" cy="5.2" r="3" fill="#CBD5E1" stroke={C} strokeWidth=".5"/>
          <circle cx="11" cy="5.2" r=".8" fill="#475569"/>
          {[0,1,2,3,4,5].map(i => {
            const a = (i/6)*6.283; return <rect key={i} x={11+Math.cos(a)*2.6-0.2} y={5.2+Math.sin(a)*2.6-0.2} width=".5" height=".5" fill={C}/>;
          })}
          {/* cord */}
          <path d="M1 5 Q-1 7 1 9" fill="none" stroke={C} strokeWidth=".5"/>
        </svg>
      </div>
    );
  }

  // ─── CastRollShelf — 석고/화이버글래스 롤 보관장 (색상별) ────────────
  function CastRollShelf({ x, y, w = 3 }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 4, width: T * w, height: T * 1.5, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.22))' }}>
        <svg viewBox={`0 0 ${w*16} 24`} width={T * w} height={T * 1.5} shapeRendering="crispEdges" preserveAspectRatio="none">
          <rect x="0" y="0" width={w*16} height="24" fill="#E8E5DB" stroke={C} strokeWidth=".6"/>
          {[2,13].map((sy,r) => (
            <g key={r}>
              <rect x="1" y={sy+9} width={w*16-2} height="1.4" fill="#D2CDBE"/>
              {[...Array(w*2)].map((_,i) => {
                const col = ['#FFFFFF','#34D399','#60A5FA','#F87171','#FFFFFF','#FBBF24'][(i+r*2)%6];
                return (
                  <g key={i}>
                    <ellipse cx={3.5 + i*((w*16-5)/(w*2))} cy={sy+2} rx="2.6" ry="1.4" fill={col} stroke={C} strokeWidth=".3"/>
                    <rect x={3.5 + i*((w*16-5)/(w*2))-2.6} y={sy+2} width="5.2" height="7" fill={col} stroke={C} strokeWidth=".3"/>
                    <circle cx={3.5 + i*((w*16-5)/(w*2))} cy={sy+2} r=".8" fill={C} opacity=".3"/>
                  </g>
                );
              })}
            </g>
          ))}
        </svg>
      </div>
    );
  }

  // ─── BraceRack — 보조기 거치대 (목발·지팡이·무릎/발목 보조기) ────────
  function BraceRack({ x, y, w = 3 }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 8, width: T * w, height: T * 2, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.22))' }}>
        <svg viewBox={`0 0 ${w*16} 36`} width={T * w} height={T * 2} shapeRendering="crispEdges" preserveAspectRatio="none">
          {/* wall pegboard */}
          <rect x="0" y="0" width={w*16} height="22" fill="#D6DCE2" stroke={C} strokeWidth=".5"/>
          {/* crutches (pair) */}
          <rect x="3" y="2" width="1.4" height="18" fill="#B7BEC6" stroke={C} strokeWidth=".3"/>
          <rect x="5" y="2" width="1.4" height="18" fill="#B7BEC6" stroke={C} strokeWidth=".3"/>
          <rect x="2.4" y="3" width="4.6" height="1.6" fill="#9CA3AF"/>{/* axilla pads */}
          <rect x="3" y="9" width="3.4" height="1.2" fill="#374151"/>{/* hand grip */}
          {/* aluminum cane */}
          <rect x="10" y="3" width="1.4" height="17" fill="#CBD5E1" stroke={C} strokeWidth=".3"/>
          <path d="M10 3 Q12.5 2 12.5 4" fill="none" stroke="#94A3B8" strokeWidth="1.4"/>
          {/* hinged knee brace (boxed) */}
          <rect x={w*16-12} y="3" width="9" height="7" fill="#5B6776" stroke={C} strokeWidth=".4"/>
          <circle cx={w*16-7.5} cy="6.5" r="1.6" fill="#FBBF24"/>
          {/* CAM boot */}
          <rect x={w*16-12} y="12" width="9" height="7" fill="#A8C7DC" stroke={C} strokeWidth=".4"/>
          <rect x={w*16-11} y="16" width="7" height="2.5" fill="#7FA8C0"/>
          {/* floor shelf line */}
          <rect x="0" y="22" width={w*16} height="2" fill="#C6C2B6" stroke={C} strokeWidth=".4"/>
        </svg>
      </div>
    );
  }

  // ─── AbductionPillow — 외전 베개 (파란 삼각 스펀지, 다리 사이) ───────
  function AbductionPillow({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T + 2, top: y * T + 1, width: T - 4, height: T * 1.2, zIndex: 2, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.22))' }}>
        <svg viewBox="0 0 12 16" width={T - 4} height={T * 1.2} shapeRendering="crispEdges">
          {/* wedge / trapezoid foam (narrow top, wide bottom) */}
          <path d="M4 1 L8 1 L11 15 L1 15 Z" fill="#5B9BD5" stroke={C} strokeWidth=".5"/>
          <path d="M4.5 1.6 L7.5 1.6 L8.2 6 L3.8 6 Z" fill="#7FB3E0"/>
          {/* leg straps */}
          <rect x="1.4" y="6" width="9.2" height="1.4" fill="#3E6FA0"/>
          <rect x="0.8" y="11" width="10.4" height="1.4" fill="#3E6FA0"/>
        </svg>
      </div>
    );
  }

  // ─── ElevatedToiletGuard — 변기 높이 조절기 + 안전 가드 ─────────────
  function ElevatedToiletGuard({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T, width: T * 1.4, height: T * 1.5, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.22))' }}>
        <svg viewBox="0 0 22 24" width={T * 1.4} height={T * 1.5} shapeRendering="crispEdges">
          {/* both-side safety arm rails */}
          <rect x="1" y="6" width="2" height="16" fill="#9CA3AF" stroke={C} strokeWidth=".4"/>
          <rect x="19" y="6" width="2" height="16" fill="#9CA3AF" stroke={C} strokeWidth=".4"/>
          <rect x="1" y="6" width="6" height="2" fill="#CBD5E1" stroke={C} strokeWidth=".3"/>
          <rect x="15" y="6" width="6" height="2" fill="#CBD5E1" stroke={C} strokeWidth=".3"/>
          {/* elevated raised seat */}
          <ellipse cx="11" cy="13" rx="7" ry="4" fill="#FFFFFF" stroke={C} strokeWidth=".5"/>
          <ellipse cx="11" cy="13" rx="4" ry="2" fill="#D7DCD6"/>
          {/* riser block under the seat */}
          <rect x="5" y="16" width="12" height="5" fill="#E5E7EB" stroke={C} strokeWidth=".4"/>
        </svg>
      </div>
    );
  }

  // ─── BedAlarm — 낙상 경보기 (매트형 센서 + 알람 박스) ───────────────
  function BedAlarm({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T + 2, top: y * T + 2, width: T - 4, height: T - 4, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.22))' }}>
        <svg viewBox="0 0 12 12" width={T - 4} height={T - 4} shapeRendering="crispEdges">
          {/* pressure mat */}
          <rect x="0.5" y="5" width="11" height="6.5" rx="1" fill="#475569" stroke={C} strokeWidth=".4"/>
          <rect x="1.5" y="6" width="9" height="1" fill="#64748B"/>
          <rect x="1.5" y="8" width="9" height="1" fill="#64748B"/>
          {/* alarm control box + sound */}
          <rect x="3" y="0.6" width="6" height="4" rx="1" fill="#DC2626" stroke={C} strokeWidth=".4"/>
          <circle cx="6" cy="2.6" r="1" fill="#FCA5A5"/>
        </svg>
        <div style={{ position: 'absolute', left: '50%', top: -1, transform: 'translateX(-50%)', width: 3, height: 3, background: '#FACC15', borderRadius: '50%', animation: 'forinBlink .8s steps(2,end) infinite' }}/>
      </div>
    );
  }

  // ─── PACSViewer — PACS 듀얼 모니터 (뼈 정렬 X-ray) ─────────────────
  function PACSViewer({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 4, width: T * 2, height: T * 1.4, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.26))' }}>
        <svg viewBox="0 0 32 22" width={T * 2} height={T * 1.4} shapeRendering="geometricPrecision">
          {[0,16].map((mx,i) => (
            <g key={i}>
              {/* thin top bezel cap — monitor tilted toward the viewer */}
              <path d={`M${mx+2} 0 L${mx+14} 0 L${mx+15} 1.6 L${mx+1} 1.6 Z`} fill="#2C333B" stroke={C} strokeWidth=".4"/>
              {/* screen facing the viewer */}
              <rect x={mx+1} y="1.6" width="14" height="12" fill="#111827" stroke={C} strokeWidth=".5"/>
              <rect x={mx+2} y="2.6" width="12" height="10" fill="#0B1220"/>
              {/* bone X-ray hint */}
              <rect x={mx+7} y="4" width="2" height="7.5" fill="#9FB6C8"/>
              <ellipse cx={mx+8} cy="7.5" rx="2.6" ry="1.4" fill="#C3D2DC"/>
              <rect x={mx+5} y="7" width="6" height="1.4" fill="#7E96A8"/>{/* fracture/plate line */}
            </g>
          ))}
          {/* stand */}
          <rect x="14" y="13.6" width="4" height="5.4" fill="#9CA3AF" stroke={C} strokeWidth=".3"/>
          <ellipse cx="16" cy="20" rx="7" ry="1.6" fill="#6B7280" stroke={C} strokeWidth=".4"/>
        </svg>
      </div>
    );
  }

  Object.assign(window, {
    TractionFrame, CPMMachine, PlasterTrapSink, CastCutter, CastRollShelf,
    BraceRack, AbductionPillow, ElevatedToiletGuard, BedAlarm, PACSViewer,
  });
})();
