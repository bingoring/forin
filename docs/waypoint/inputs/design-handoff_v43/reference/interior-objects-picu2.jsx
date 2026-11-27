// interior-objects-picu2.jsx — 소아 중환자실 PICU objects.
// Pediatric ICU: child-scaled ICU beds, pediatric vent, crash cart with Broselow
// tape, comforting decor. v2 top-down, single silhouette, ground ellipse shadow.

(function () {
  const C = '#2A2522';
  const T = window.ITILE || 16;

  // ─── PICUBed — 소아 중환자 베드 (높은 안전 사이드레일 + 모니터 붐) ──
  function PICUBed({ x, y, occupied }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 4, width: T * 2.7, height: T * 3.4 }}>
        <svg viewBox="0 0 44 52" width={T * 2.7} height={T * 3.4} shapeRendering="geometricPrecision">
          <ellipse cx="22" cy="50" rx="18" ry="2.4" fill="rgba(0,0,0,.16)"/>
          {/* headboard */}
          <path d="M4 3 L40 3 L40 8 L4 8 Z" fill="#B7C0C8" stroke={C} strokeWidth=".7"/>
          <rect x="5" y="4" width="34" height="1.4" fill="#D2DAE0"/>
          {/* mattress top face + short front (continuous) */}
          <path d="M4 8 L40 8 L40 44 Q40 46 38 46 L6 46 Q4 46 4 44 Z" fill="#DCE6EC" stroke={C} strokeWidth=".7"/>
          {/* pillow */}
          <rect x="9" y="10" width="26" height="9" rx="3" fill="#FBFAF4" stroke={C} strokeWidth=".4"/>
          {/* cheerful star blanket (lower 2/3) */}
          <rect x="5" y="23" width="34" height="21" rx="1.5" fill="#9FC3E8"/>
          <path d="M14 30 l1.2 2.4 2.4 .3 -1.8 1.7 .5 2.4 -2.3 -1.2 -2.3 1.2 .5 -2.4 -1.8 -1.7 2.4 -.3Z" fill="#FBFAF4" opacity=".85"/>
          <path d="M30 35 l1.2 2.4 2.4 .3 -1.8 1.7 .5 2.4 -2.3 -1.2 -2.3 1.2 .5 -2.4 -1.8 -1.7 2.4 -.3Z" fill="#FBFAF4" opacity=".6"/>
          {occupied && (
            <g>
              <rect x="19" y="11.5" width="6" height="5.5" rx="2.3" fill="#FBD9C0" stroke={C} strokeWidth=".3"/>
              <rect x="19.4" y="10.6" width="5.2" height="1.4" fill="#6B4423"/>
            </g>
          )}
          {/* high safety side-rails (near + far) with vertical bars */}
          <rect x="3" y="8" width="38" height="2.2" rx="1" fill="#CBD5E1" stroke={C} strokeWidth=".4"/>
          <rect x="3" y="43.5" width="38" height="2.2" rx="1" fill="#B7C0C8" stroke={C} strokeWidth=".4"/>
          {[8,15,22,29,36].map((bx,i)=><rect key={i} x={bx} y="10" width="1.1" height="33.5" fill="#9CA3AF" opacity=".45"/>)}
          <line x1="4" y1="44" x2="40" y2="44" stroke={C} strokeWidth=".5"/>
          {/* legs + wheels */}
          <rect x="5" y="46" width="3" height="3.5" fill="#6B7280"/>
          <rect x="36" y="46" width="3" height="3.5" fill="#6B7280"/>
          <ellipse cx="6.5" cy="49.5" rx="1.8" ry="1.2" fill={C}/>
          <ellipse cx="37.5" cy="49.5" rx="1.8" ry="1.2" fill={C}/>
        </svg>
      </div>
    );
  }

  // ─── PedVentilator — 소아용 인공호흡기 (뷰어 향 파형 + 회로) ─────────
  function PedVentilator({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 12, width: T * 1.2, height: T * 2.6 }}>
        <svg viewBox="0 0 20 42" width={T * 1.2} height={T * 2.6} shapeRendering="geometricPrecision">
          <ellipse cx="10" cy="40.5" rx="7" ry="1.8" fill="rgba(0,0,0,.16)"/>
          {/* screen head */}
          <rect x="2" y="3" width="16" height="12" rx="1" fill="#475569" stroke={C} strokeWidth=".5"/>
          <rect x="3.5" y="4.5" width="13" height="9" fill="#0B1A22"/>
          <path d="M4.5 8 Q7 6.5 9.5 8 T14.5 8" fill="none" stroke="#22D3EE" strokeWidth=".6"/>
          <path d="M4.5 11 Q7 10 9.5 11 T14.5 11" fill="none" stroke="#FBBF24" strokeWidth=".6"/>
          {/* body + humidifier + circuit */}
          <path d="M3 15 L17 15 L17 30 Q17 31 16 31 L4 31 Q3 31 3 30 Z" fill="#5B6672" stroke={C} strokeWidth=".5"/>
          <rect x="4.5" y="16.5" width="7" height="4" fill="#BFE3EE" stroke={C} strokeWidth=".3"/>{/* humidifier */}
          <path d="M17 18 Q21 22 17 26" fill="none" stroke="#D4E8F0" strokeWidth="1.3"/>
          {/* pole + wheels */}
          <rect x="9" y="31" width="2" height="5" fill="#CBD5E1"/>
          <ellipse cx="6" cy="37" rx="2" ry="1.4" fill={C}/>
          <ellipse cx="14" cy="37" rx="2" ry="1.4" fill={C}/>
        </svg>
      </div>
    );
  }

  // ─── BroselowCart — 소아 응급 카트 (색상 구획 Broselow 테이프) ───────
  function BroselowCart({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 2, width: T * 1.4, height: T * 1.9 }}>
        <svg viewBox="0 0 22 30" width={T * 1.4} height={T * 1.9} shapeRendering="geometricPrecision">
          <ellipse cx="11" cy="28.5" rx="8" ry="2.2" fill="rgba(0,0,0,.16)"/>
          {/* worktop top + front */}
          <path d="M2 6 L20 6 L20 25 Q20 26 19 26 L3 26 Q2 26 2 25 Z" fill="#C6483C" stroke={C} strokeWidth=".6"/>
          <rect x="2" y="6" width="18" height="3.5" fill="#D9614F"/>
          {/* color-coded Broselow drawers (front) */}
          {[['#EF6C6C',10],['#FBBF24',13.5],['#5A8AC0',17],['#7BB07B',20.5]].map(([col,dy],i)=>(
            <g key={i}>
              <rect x="4" y={dy} width="14" height="3" rx=".4" fill={col} stroke={C} strokeWidth=".3"/>
              <rect x="10" y={dy+1} width="2.5" height="1" fill="#fff" opacity=".7"/>
            </g>
          ))}
          <line x1="2" y1="9.5" x2="20" y2="9.5" stroke={C} strokeWidth=".4"/>
          <ellipse cx="5" cy="27.5" rx="1.6" ry="1.2" fill={C}/>
          <ellipse cx="17" cy="27.5" rx="1.6" ry="1.2" fill={C}/>
        </svg>
      </div>
    );
  }

  Object.assign(window, {
    PICUBed, PedVentilator, BroselowCart,
  });
})();
