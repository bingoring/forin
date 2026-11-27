// interior-objects-morgue2.jsx — 영안실 · 부검실 objects (지원동 B1).
// Somber back-of-house. v2 top-down, single silhouette, ground ellipse.

(function () {
  const C = '#2A2522';
  const T = window.ITILE || 16;

  // ─── CadaverFridge — 시신 냉장 보관 캐비닛 (다단 도어) ────────────────
  function CadaverFridge({ x, y, w = 3 }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 10, width: T * w, height: T * 2.1 }}>
        <svg viewBox={`0 0 ${w*16} 34`} width={T * w} height={T * 2.1} shapeRendering="geometricPrecision" preserveAspectRatio="none">
          <ellipse cx={w*8} cy="32.5" rx={w*7} ry="1.6" fill="rgba(0,0,0,.16)"/>
          {/* stainless bank: big TOP face folds into the front (continuous) */}
          <path d={`M1 11 L${w*16-1} 11 L${w*16-1} 31 L1 31 Z`} fill="#8E99A4" stroke={C} strokeWidth=".7"/>
          <rect x="1" y="2" width={w*16-2} height="9" fill="#A6B0BA" stroke={C} strokeWidth=".6"/>{/* large top face */}
          <rect x="2.5" y="3.5" width={w*16-5} height="2" fill="#BBC4CC"/>{/* top back-edge highlight */}
          {[...Array(w)].map((_,cc)=><rect key={'t'+cc} x={2+cc*((w*16-2)/w)+2} y="6.5" width={(w*16-2)/w-6} height="2.6" rx=".4" fill="#7E8993"/>)}
          <line x1="1" y1="11" x2={w*16-1} y2="11" stroke={C} strokeWidth=".5"/>{/* top↔front seam */}
          {/* chamber doors: cols × 3 rows, each with a handle + ID card slot */}
          {[...Array(w)].map((_,cc)=>[0,1,2].map(r=>{
            const cw = (w*16-2)/w;
            return (
              <g key={cc+'-'+r}>
                <rect x={1+cc*cw+0.8} y={12+r*6.2} width={cw-1.6} height="5.6" rx=".5" fill="#9FAAB4" stroke={C} strokeWidth=".4"/>
                <rect x={1+cc*cw+cw*0.5-2.5} y={12+r*6.2+2} width="5" height="1.3" fill="#5B6772"/>{/* handle */}
                <rect x={1+cc*cw+2} y={12+r*6.2+0.7} width="4" height="1.5" fill="#EDEFF2" stroke={C} strokeWidth=".25"/>{/* ID card */}
              </g>
            );
          }))}
        </svg>
      </div>
    );
  }

  // ─── AutopsyTable — 부검대 (배수 채널 + 헹굼 수전) ────────────────────
  function AutopsyTable({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 4, width: T * 2.6, height: T * 3 }}>
        <svg viewBox="0 0 42 48" width={T * 2.6} height={T * 3} shapeRendering="geometricPrecision">
          <ellipse cx="21" cy="46" rx="16" ry="2.4" fill="rgba(0,0,0,.16)"/>
          {/* perforated stainless table: big TOP face + short front as ONE
             continuous silhouette, full outline incl. top edge */}
          <path d="M3 6 L39 6 L39 40 Q39 42 37 42 L5 42 Q3 42 3 40 Z" fill="#AEB6BE" stroke={C} strokeWidth=".9"/>
          <rect x="4" y="7.5" width="34" height="2" fill="#C7CDD4"/>{/* top back-edge highlight */}
          {/* raised rim of the tray on the top face */}
          <rect x="5" y="9" width="32" height="26" rx="2" fill="none" stroke="#7C858E" strokeWidth="1.1"/>
          {/* drain perforations across the top */}
          {[...Array(7)].map((_,r)=>[...Array(11)].map((_,cc)=>(
            <circle key={r+'-'+cc} cx={8+cc*2.7} cy={12+r*3} r=".55" fill="#8A929B"/>
          )))}
          <line x1="3" y1="35" x2="39" y2="35" stroke={C} strokeWidth=".6"/>{/* top↔front seam */}
          {/* front-panel vent seams so front reads distinct from top */}
          <line x1="12" y1="36" x2="12" y2="41" stroke={C} strokeWidth=".4" opacity=".4"/>
          <line x1="30" y1="36" x2="30" y2="41" stroke={C} strokeWidth=".4" opacity=".4"/>
          {/* rinse faucet at the head + drain spout at the foot */}
          <rect x="19" y="2" width="4" height="4" rx="1" fill="#9CA3AF" stroke={C} strokeWidth=".4"/>
          <rect x="20.2" y="42" width="1.6" height="3" fill="#7C858E"/>
          {/* central pedestal */}
          <rect x="18" y="42" width="6" height="3" fill="#8A929B"/>
        </svg>
      </div>
    );
  }

  // ─── ViewingBier — 유족 참관용 안치대 (덮개 + 은은한 조명) ────────────
  function ViewingBier({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 4, width: T * 2.6, height: T * 2.6 }}>
        <svg viewBox="0 0 42 42" width={T * 2.6} height={T * 2.6} shapeRendering="geometricPrecision">
          <ellipse cx="21" cy="40" rx="16" ry="2.2" fill="rgba(0,0,0,.14)"/>
          {/* draped catafalque: big top face + short front (continuous) */}
          <path d="M3 12 L39 12 L39 34 Q39 36 37 36 L5 36 Q3 36 3 34 Z" fill="#5C5170" stroke={C} strokeWidth=".8"/>
          {/* long white cloth drape over the top (falls over the front edge) */}
          <path d="M4 8 L38 8 L38 30 Q38 31 37 31 L5 31 Q4 31 4 30 Z" fill="#EFECF4" stroke={C} strokeWidth=".5"/>
          <rect x="5" y="9.5" width="32" height="2" fill="#FBFAFE"/>{/* drape sheen */}
          {/* soft folds in the cloth */}
          <path d="M4 18 Q11 20 21 18 T38 18" fill="none" stroke="#D6D0E0" strokeWidth="1"/>
          <path d="M4 24 Q11 26 21 24 T38 24" fill="none" stroke="#D6D0E0" strokeWidth=".8"/>
          {/* single white lily laid on top */}
          <ellipse cx="21" cy="14.5" rx="3.2" ry="1.8" fill="#FFFFFF" stroke={C} strokeWidth=".3"/>
          <circle cx="21" cy="14.5" r="1" fill="#FBBF24"/>
          <path d="M21 16 Q24 18 27 17" fill="none" stroke="#6E8A5A" strokeWidth=".7"/>{/* stem */}
          {/* two candle holders with soft glow flanking */}
          <circle cx="6" cy="6" r="2.4" fill="#FDE68A" opacity=".55"/>
          <rect x="5.2" y="5.5" width="1.6" height="3" fill="#E8D8A0"/>
          <circle cx="36" cy="6" r="2.4" fill="#FDE68A" opacity=".55"/>
          <rect x="35.2" y="5.5" width="1.6" height="3" fill="#E8D8A0"/>
        </svg>
      </div>
    );
  }

  Object.assign(window, {
    CadaverFridge, AutopsyTable, ViewingBier,
  });
})();
