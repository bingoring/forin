// interior-objects-icu2.jsx — Intensive-Care-Unit blueprint objects.
// Same v2 pixel style (visible TOP + FRONT + depth, 45°). Tile-based coords.
// Loads after interior-shared/icu, before the ICU screen render.

(function () {
  const C = '#2A2522';
  const T = window.ITILE || 16;

  // ─── CRRTMachine — 지속적 신대체요법 (투석) 기계 + 투석액 백 4개 ─────
  function CRRTMachine({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 14, width: T * 2, height: T * 3.4, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.3))' }}>
        <svg viewBox="0 0 32 54" width={T * 2} height={T * 3.4} shapeRendering="geometricPrecision">
          {/* IV pole across the top with 4 dialysate bags hanging */}
          <rect x="2" y="0" width="28" height="1.5" rx=".6" fill="#9CA3AF"/>
          {[4,11,18,25].map((bx,i) => (
            <g key={i}>
              <rect x={bx} y="1.5" width="5" height="8" rx=".5" fill={i%2? '#D7F0E0':'#FCE7C8'} stroke={C} strokeWidth=".4"/>
              <rect x={bx+0.6} y="2.5" width="1.4" height="6" fill={i%2? '#A7E0BE':'#F4D29A'}/>
            </g>
          ))}
          {/* full machine silhouette (top face + tall viewer-facing panel) */}
          <path d="M4 12 Q2 12 2 14 L2 44 Q2 46 4 46 L28 46 Q30 46 30 44 L30 14 Q30 12 28 12 Z" fill="#8A929B"/>
          {/* TOP face — casing top with the spinning blood pump */}
          <path d="M4 12 Q2 12 2 14 L2 22 L30 22 L30 14 Q30 12 28 12 Z" fill="#A6ADB5"/>
          <circle cx="24" cy="17" r="3.6" fill="#1F2937" stroke={C} strokeWidth=".5"/>
          <circle cx="24" cy="17" r="1.3" fill="#DC2626"/>
          <rect x="23.4" y="13.6" width="1.2" height="3.4" fill="#7F1D1D"/>
          {/* seam top → front */}
          <line x1="2" y1="22" x2="30" y2="22" stroke={C} strokeWidth=".6"/>
          {/* VIEWER-FACING screen */}
          <rect x="4" y="23.5" width="14" height="9" rx=".6" fill="#0F1A24" stroke={C} strokeWidth=".4"/>
          <rect x="5" y="24.6" width="11" height="1.3" fill="#22D3EE"/>
          <rect x="5" y="26.6" width="9" height="1.3" fill="#F87171"/>
          <rect x="5" y="28.6" width="11" height="1.3" fill="#FACC15"/>
          {/* filter column + blood lines on the front */}
          <rect x="21" y="24" width="3" height="14" rx=".6" fill="#FCA5A5" stroke={C} strokeWidth=".4"/>
          <rect x="21.6" y="25" width="1.8" height="12" fill="#DC2626"/>
          <path d="M21 27 Q18 26 18 30" fill="none" stroke="#DC2626" strokeWidth="1"/>
          <path d="M24 36 Q27 38 26 33" fill="none" stroke="#3B82F6" strokeWidth="1"/>
          {/* drawer */}
          <rect x="4" y="34" width="14" height="3" rx=".3" fill="#C7CDD4" stroke={C} strokeWidth=".3"/>
          {/* re-stroke silhouette */}
          <path d="M4 12 Q2 12 2 14 L2 44 Q2 46 4 46 L28 46 Q30 46 30 44 L30 14 Q30 12 28 12 Z" fill="none" stroke={C} strokeWidth=".7"/>
          {/* wheels */}
          <ellipse cx="6" cy="48" rx="2.4" ry="1.7" fill="#2C3239"/>
          <ellipse cx="26" cy="48" rx="2.4" ry="1.7" fill="#2C3239"/>
        </svg>
      </div>
    );
  }

  // ─── IVPumpTower — 6단 적층 인퓨전 펌프 타워 (C-line 다약물) ────────
  function IVPumpTower({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 22, width: T, height: T * 3.4, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.3))' }}>
        <svg viewBox="0 0 16 54" width={T} height={T * 3.4} shapeRendering="crispEdges">
          {/* hook + 2 IV bags */}
          <rect x="5" y="0" width="6" height="1.4" fill="#9CA3AF"/>
          <rect x="3" y="1.4" width="4" height="6" fill="#A8DCEC" stroke={C} strokeWidth=".4"/>
          <rect x="9" y="1.4" width="4" height="6" fill="#FCE7C8" stroke={C} strokeWidth=".4"/>
          {/* 6 stacked pump modules */}
          {[0,1,2,3,4,5].map(i => (
            <g key={i}>
              <rect x="2" y={9 + i*6} width="12" height="5.4" fill="#475569" stroke={C} strokeWidth=".5"/>
              <rect x="3" y={9.6 + i*6} width="6" height="3" fill="#0F1A24"/>
              <rect x="3.6" y={10.2 + i*6} width="4.6" height="1" fill={['#22D3EE','#10B981','#FACC15','#F87171','#22D3EE','#A78BFA'][i]}/>
              <rect x="10" y={9.8 + i*6} width="1.6" height="1.6" fill="#10B981"/>
              <rect x="10" y={11.8 + i*6} width="1.6" height="1.6" fill="#EF4444"/>
            </g>
          ))}
          {/* pole + base */}
          <rect x="7" y="45" width="2" height="5" fill="#CBD5E1" stroke={C} strokeWidth=".3"/>
          <ellipse cx="8" cy="51" rx="6" ry="2" fill="#6B7280" stroke={C} strokeWidth=".4"/>
          <ellipse cx="3" cy="52.5" rx="1.3" ry="1" fill={C}/>
          <ellipse cx="13" cy="52.5" rx="1.3" ry="1" fill={C}/>
        </svg>
      </div>
    );
  }

  // ─── EVDStand — 체외 뇌척수액 배액 (레벨 자 + 점적통 + 배액백) ──────
  function EVDStand({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 20, width: T, height: T * 3, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.28))' }}>
        <svg viewBox="0 0 16 48" width={T} height={T * 3} shapeRendering="crispEdges">
          {/* pole */}
          <rect x="7" y="0" width="2" height="40" fill="#CBD5E1" stroke={C} strokeWidth=".3"/>
          {/* graduated ruler with leveling line */}
          <rect x="9" y="4" width="3" height="22" fill="#fff" stroke={C} strokeWidth=".4"/>
          {[0,1,2,3,4,5,6,7].map(i => <rect key={i} x="9" y={5 + i*2.6} width={i%2?3:2} height=".5" fill={C}/>)}
          {/* zero-level laser line */}
          <rect x="6" y="12" width="9" height=".8" fill="#EF4444"/>
          {/* drip chamber */}
          <rect x="5" y="14" width="4" height="6" fill="#D4F0F8" stroke={C} strokeWidth=".4"/>
          <rect x="5.6" y="17" width="2.8" height="2.5" fill="#BFE3EE"/>
          {/* CSF line down to bag */}
          <path d="M7 20 Q4 26 6 32" fill="none" stroke="#E9D8A6" strokeWidth=".8"/>
          {/* drainage bag (graduated, pale yellow CSF) */}
          <rect x="3" y="32" width="8" height="11" fill="#FCF6DC" stroke={C} strokeWidth=".5"/>
          <rect x="3.5" y="36" width="7" height="6.5" fill="#F2E6A8"/>
          {[0,1,2,3].map(i => <rect key={i} x="3" y={34 + i*2.2} width="2" height=".5" fill={C} opacity=".5"/>)}
          {/* base */}
          <ellipse cx="8" cy="45" rx="5" ry="1.8" fill="#6B7280" stroke={C} strokeWidth=".4"/>
        </svg>
      </div>
    );
  }

  // ─── ICPMonitor — 뇌압 모니터 (실시간 수치 깜빡임) ────────────────
  function ICPMonitor({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T + 1, top: y * T - 6, width: T - 2, height: T * 1.6, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.26))' }}>
        <svg viewBox="0 0 14 26" width={T - 2} height={T * 1.6} shapeRendering="crispEdges">
          {/* monitor head */}
          <rect x="0" y="0" width="14" height="11" fill="#1F2937" stroke={C} strokeWidth=".5"/>
          <rect x="1.5" y="1.5" width="11" height="8" fill="#0B1A22"/>
          <text x="5.5" y="6.5" fontSize="4.5" fill="#22D3EE" fontFamily="monospace">12</text>
          <text x="10.5" y="4.5" fontSize="2" fill="#94A3B8" fontFamily="monospace">ICP</text>
          <path d="M2 8 L4 8 L5 6.5 L6 9 L7 7.5 L12 7.5" fill="none" stroke="#10B981" strokeWidth=".4"/>
          {/* stand */}
          <rect x="6" y="11" width="2" height="9" fill="#9CA3AF" stroke={C} strokeWidth=".3"/>
          <ellipse cx="7" cy="22" rx="5" ry="1.8" fill="#6B7280" stroke={C} strokeWidth=".4"/>
        </svg>
        <div style={{ position: 'absolute', left: 3, top: 1, width: 3, height: 3, background: '#EF4444', borderRadius: '50%', animation: 'forinBlink 1s steps(2,end) infinite' }}/>
      </div>
    );
  }

  // ─── TTMUnit — 목표 체온 유지 (냉각 담요 장치 + 호스) ─────────────
  function TTMUnit({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 4, width: T * 1.6, height: T * 2.4, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.28))' }}>
        <svg viewBox="0 0 26 38" width={T * 1.6} height={T * 2.4} shapeRendering="geometricPrecision">
          {/* coiling hoses to the cooling pad (curl off the top port) */}
          <path d="M3 8 Q-1 12 5 15 Q10 18 4 21" fill="none" stroke="#7FB8D8" strokeWidth="2.4" strokeLinecap="round"/>
          {/* full silhouette (top face + viewer-facing panel) */}
          <path d="M3 6 Q2 6 2 7 L2 30 Q2 31 3 31 L23 31 Q24 31 24 30 L24 7 Q24 6 23 6 Z" fill="#2C5E7C"/>
          {/* TOP face (cool teal) */}
          <path d="M3 6 Q2 6 2 7 L2 13 L24 13 L24 7 Q24 6 23 6 Z" fill="#4E86A6"/>
          <ellipse cx="18" cy="9.5" rx="2.4" ry="1.4" fill="#9CA3AF" stroke={C} strokeWidth=".35"/>{/* port */}
          {/* seam top → front */}
          <line x1="2" y1="13" x2="24" y2="13" stroke={C} strokeWidth=".55"/>
          {/* VIEWER-FACING screen with target temp */}
          <rect x="3.5" y="14.5" width="11" height="7" rx=".5" fill="#0F1A24" stroke={C} strokeWidth=".4"/>
          <text x="9" y="18.6" fontSize="3.4" fill="#7DD3FC" textAnchor="middle" fontFamily="monospace">34°</text>
          <rect x="3.5" y="22" width="11" height="1" fill="#22D3EE"/>
          {/* water reservoir window (cool blue) */}
          <rect x="16" y="14.5" width="5" height="12" rx=".4" fill="#BFE3EE" stroke={C} strokeWidth=".4"/>
          <rect x="16" y="20" width="5" height="6.5" fill="#9FD0E4"/>
          {/* re-stroke silhouette */}
          <path d="M3 6 Q2 6 2 7 L2 30 Q2 31 3 31 L23 31 Q24 31 24 30 L24 7 Q24 6 23 6 Z" fill="none" stroke={C} strokeWidth=".65"/>
          {/* wheels */}
          <ellipse cx="5" cy="32.5" rx="2.2" ry="1.6" fill="#2C3239"/>
          <ellipse cx="18" cy="32.5" rx="2.2" ry="1.6" fill="#2C3239"/>
        </svg>
      </div>
    );
  }

  // ─── FoleyBag — 시간당 소변량 측정 백 (침대 밑) ───────────────────
  function FoleyBag({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T + 4, top: y * T + 2, width: T - 8, height: T * 1.2, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.22))' }}>
        <svg viewBox="0 0 8 16" width={T - 8} height={T * 1.2} shapeRendering="crispEdges">
          {/* tube */}
          <path d="M4 0 Q1 3 3 5" fill="none" stroke="#E9D8A6" strokeWidth=".7"/>
          {/* bag */}
          <rect x="1" y="5" width="6" height="9" fill="#FCF6DC" stroke={C} strokeWidth=".5"/>
          <rect x="1.5" y="9" width="5" height="4.5" fill="#E9D86A"/>{/* urine */}
          {[0,1,2].map(i => <rect key={i} x="1" y={7 + i*2} width="1.5" height=".5" fill={C} opacity=".5"/>)}
        </svg>
      </div>
    );
  }

  // ─── Intercom — 보안 인터폰 + 카메라 (ICU 출입문 벽) ──────────────
  function Intercom({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T + 3, top: y * T + 1, width: T - 6, height: T * 1.3, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.24))' }}>
        <svg viewBox="0 0 10 18" width={T - 6} height={T * 1.3} shapeRendering="crispEdges">
          {/* camera dome above */}
          <ellipse cx="5" cy="2" rx="3" ry="2" fill="#374151" stroke={C} strokeWidth=".4"/>
          <circle cx="5" cy="2.2" r="1" fill="#0B1620"/>
          <circle cx="5" cy="2.2" r=".4" fill="#22D3EE"/>
          {/* panel */}
          <rect x="1" y="5" width="8" height="12" fill="#9CA3AF" stroke={C} strokeWidth=".5"/>
          {/* speaker grille */}
          <rect x="2.5" y="6.5" width="5" height="3" fill="#1F2937"/>
          {[0,1,2].map(i => <rect key={i} x="3" y={7 + i} width="4" height=".4" fill="#4B5563"/>)}
          {/* call button (glowing) */}
          <circle cx="5" cy="13" r="2" fill="#EF4444" stroke={C} strokeWidth=".4"/>
          <circle cx="5" cy="13" r=".8" fill="#FCA5A5"/>
        </svg>
      </div>
    );
  }

  // ─── GownBox — 면회객 일회용 가운 함 (벽) ──────────────────────────
  function GownBox({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T + 2, top: y * T, width: T - 4, height: T * 1.4, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.24))' }}>
        <svg viewBox="0 0 12 22" width={T - 4} height={T * 1.4} shapeRendering="crispEdges">
          {/* sign */}
          <rect x="1" y="0" width="10" height="4" fill="#3B82F6" stroke={C} strokeWidth=".4"/>
          <rect x="2.5" y="1.4" width="7" height="1.4" fill="#fff"/>
          {/* box */}
          <rect x="1" y="5" width="10" height="14" fill="#E5E7EB" stroke={C} strokeWidth=".5"/>
          {/* gowns folded (yellow isolation) */}
          <rect x="2" y="6.5" width="8" height="3" fill="#FEF3C7" stroke={C} strokeWidth=".3"/>
          <rect x="2" y="10" width="8" height="3" fill="#FDE68A" stroke={C} strokeWidth=".3"/>
          {/* dispenser slot */}
          <rect x="2.5" y="15.5" width="7" height="2.5" fill="#fff" stroke={C} strokeWidth=".3"/>
          <path d="M3.5 15.5 Q6 13.5 8.5 15.5 Z" fill="#FEF3C7" stroke={C} strokeWidth=".3"/>
        </svg>
      </div>
    );
  }

  // ─── VisitorScreen — 면회 안내 스크린 ('현재 면회 불가') ───────────
  function VisitorScreen({ x, y, w = 2 }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T, width: T * w, height: T - 2, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.25))' }}>
        <svg viewBox={`0 0 ${w*16} 14`} width={T * w} height={T - 2} shapeRendering="crispEdges" preserveAspectRatio="none">
          <rect x="0" y="0" width={w*16} height="14" fill="#111827" stroke={C} strokeWidth=".6"/>
          <rect x="1.5" y="1.5" width={w*16-3} height="11" fill="#1A0B0B"/>
          {/* red 'no visit' banner */}
          <rect x="2.5" y="3" width={w*16-5} height="4" fill="#DC2626"/>
          <rect x="4" y="4.2" width={w*9} height="1.6" fill="#fff"/>
          {/* rule lines */}
          <rect x="2.5" y="8.5" width={w*10} height="1" fill="#7F1D1D"/>
          <rect x="2.5" y="10.2" width={w*7} height="1" fill="#7F1D1D"/>
          {/* lock icon */}
          <rect x={w*16-7} y="8.5" width="3.5" height="3" fill="#FACC15"/>
        </svg>
      </div>
    );
  }

  Object.assign(window, {
    CRRTMachine, IVPumpTower, EVDStand, ICPMonitor, TTMUnit,
    FoleyBag, Intercom, GownBox, VisitorScreen,
  });
})();
