// interior-objects-lounge2.jsx — 직원 락커룸 · 휴게실 · 식당 objects.
// Back-of-house staff amenities. v2 top-down, single silhouette, ground ellipse.

(function () {
  const C = '#2A2522';
  const T = window.ITILE || 16;

  // ─── LockerBank — 직원 사물함 뱅크 (세로 2단 × 여러 칸) ──────────────
  function LockerBank({ x, y, w = 3 }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 10, width: T * w, height: T * 2.1 }}>
        <svg viewBox={`0 0 ${w*16} 34`} width={T * w} height={T * 2.1} shapeRendering="geometricPrecision" preserveAspectRatio="none">
          <ellipse cx={w*8} cy="32.5" rx={w*7} ry="1.6" fill="rgba(0,0,0,.14)"/>
          {/* big TOP face folds into the front bank (continuous silhouette) */}
          <path d={`M1 11 L${w*16-1} 11 L${w*16-1} 31 L1 31 Z`} fill="#7E93A6" stroke={C} strokeWidth=".7"/>
          <rect x="1" y="2" width={w*16-2} height="9" fill="#93A7B8" stroke={C} strokeWidth=".6"/>{/* large top face */}
          <rect x="2.5" y="3.5" width={w*16-5} height="2" fill="#A6B8C6"/>{/* top back-edge highlight */}
          {[...Array(w)].map((_,cc)=><rect key={'t'+cc} x={2+cc*((w*16-2)/w)+2} y="6.5" width={(w*16-2)/w-6} height="2.6" rx=".4" fill="#6C8092"/>)}
          <line x1="1" y1="11" x2={w*16-1} y2="11" stroke={C} strokeWidth=".5"/>
          {/* locker doors: cols × 2 rows, viewer-facing */}
          {[...Array(w*2)].map((_,i)=>{
            const cw = (w*16-2)/(w*2);
            return (
              <g key={i}>
                <rect x={1+i*cw+0.6} y="12" width={cw-1.2} height="9" fill="#8FA3B4" stroke={C} strokeWidth=".4"/>
                <rect x={1+i*cw+0.6} y="21.5" width={cw-1.2} height="9" fill="#8FA3B4" stroke={C} strokeWidth=".4"/>
                {/* vents + handle */}
                <rect x={1+i*cw+1.4} y="13" width={cw-2.8} height=".7" fill="#6C8092"/>
                <rect x={1+i*cw+1.4} y="14.2" width={cw-2.8} height=".7" fill="#6C8092"/>
                <rect x={1+i*cw+cw-2.6} y="16.5" width="1.2" height="2" fill="#4B5563"/>
                <rect x={1+i*cw+cw-2.6} y="25.5" width="1.2" height="2" fill="#4B5563"/>
              </g>
            );
          })}
        </svg>
      </div>
    );
  }

  // ─── Vending — 자판기 (음료/스낵, 유리 디스플레이) ────────────────────
  function Vending({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 10, width: T * 1.3, height: T * 2.3 }}>
        <svg viewBox="0 0 22 38" width={T * 1.3} height={T * 2.3} shapeRendering="geometricPrecision">
          <ellipse cx="11" cy="36.5" rx="9" ry="1.8" fill="rgba(0,0,0,.16)"/>
          {/* big TOP face + tall front (continuous) */}
          <path d="M2 11 L20 11 L20 36 L2 36 Z" fill="#C23B3B" stroke={C} strokeWidth=".7"/>
          <rect x="2" y="3" width="18" height="8" fill="#D65454" stroke={C} strokeWidth=".6"/>{/* top face */}
          <rect x="3.5" y="4.5" width="15" height="2" fill="#E47070"/>{/* top highlight */}
          <rect x="5" y="7.5" width="12" height="2" rx=".5" fill="#A62E2E"/>{/* top vent grille */}
          <line x1="2" y1="11" x2="20" y2="11" stroke={C} strokeWidth=".5"/>
          {/* glass display with product rows */}
          <rect x="3.5" y="13" width="9" height="15" fill="#0B1A22" stroke={C} strokeWidth=".4"/>
          {[0,1,2,3].map(r=>[0,1,2].map(cc=>(
            <rect key={r+'-'+cc} x={4.2+cc*2.8} y={13.8+r*3.5} width="2.2" height="2.6" rx=".4"
              fill={['#FBBF24','#22C55E','#3B82F6','#EF4444','#A855F7','#F97316'][(r*3+cc)%6]}/>
          )))}
          {/* keypad + dispense tray on front */}
          <rect x="13.5" y="13.5" width="3.5" height="7" fill="#1F2937"/>
          {[0,1,2].map(i=><rect key={i} x="14" y={14.3+i*2} width="2.5" height="1.4" fill="#4B5563"/>)}
          <rect x="4" y="30" width="12" height="3.5" rx=".5" fill="#1B0E0E"/>
        </svg>
      </div>
    );
  }

  // ─── DiningTable — 식당 4인 테이블 (윗면 + 다리, 트레이) ──────────────
  function DiningTable({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 2, width: T * 2.2, height: T * 1.7 }}>
        <svg viewBox="0 0 36 28" width={T * 2.2} height={T * 1.7} shapeRendering="geometricPrecision">
          <ellipse cx="18" cy="26" rx="14" ry="2" fill="rgba(0,0,0,.14)"/>
          {/* rounded-rect top + short front edge */}
          <path d="M3 6 L33 6 Q35 6 35 8 L35 17 Q35 19 33 19 L3 19 Q1 19 1 17 L1 8 Q1 6 3 6 Z" fill="#D9C39A" stroke={C} strokeWidth=".6"/>
          <path d="M3 6 L33 6 Q35 6 35 8 L35 9 L1 9 L1 8 Q1 6 3 6 Z" fill="#E8D6B2"/>
          {/* two trays on the table */}
          <rect x="6" y="9" width="9" height="6" rx="1" fill="#EF6C6C" opacity=".8"/>
          <rect x="21" y="9.5" width="9" height="6" rx="1" fill="#5A8AC0" opacity=".8"/>
          {/* legs */}
          <rect x="4" y="19" width="2.4" height="6" fill="#9C7A48"/>
          <rect x="29.6" y="19" width="2.4" height="6" fill="#9C7A48"/>
        </svg>
      </div>
    );
  }

  // ─── ServeryCounter — 배식 카운터 (트레이 레일 + 온장 파사드) ─────────
  function ServeryCounter({ x, y, w = 4 }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 4, width: T * w, height: T * 1.7 }}>
        <svg viewBox={`0 0 ${w*16} 28`} width={T * w} height={T * 1.7} shapeRendering="geometricPrecision" preserveAspectRatio="none">
          <ellipse cx={w*8} cy="26.5" rx={w*7} ry="1.6" fill="rgba(0,0,0,.14)"/>
          {/* stainless counter: top + front (continuous) */}
          <path d={`M1 9 L${w*16-1} 9 L${w*16-1} 25 L1 25 Z`} fill="#AEB6BE" stroke={C} strokeWidth=".6"/>
          <rect x="1" y="6" width={w*16-2} height="3" fill="#C7CDD4"/>{/* top face */}
          <line x1="1" y1="9" x2={w*16-1} y2="9" stroke={C} strokeWidth=".5"/>
          {/* sneeze-guard glass + warming wells on the top */}
          <rect x="2" y="1" width={w*16-4} height="5" fill="#CFE6EE" fillOpacity=".45" stroke={C} strokeWidth=".4"/>
          {[...Array(w)].map((_,i)=>(
            <rect key={i} x={3+i*((w*16-6)/w)} y="10" width={(w*16-6)/w-2} height="4" rx=".6" fill="#8A6B3A"/>
          ))}
          {/* tray rail on the front */}
          <rect x="1" y="16" width={w*16-2} height="1.6" fill="#8A929B"/>
          {/* front panel seams */}
          {[...Array(w)].map((_,i)=><line key={'s'+i} x1={(i+1)*(w*16/(w+1))} y1="17.6" x2={(i+1)*(w*16/(w+1))} y2="25" stroke={C} strokeWidth=".3" opacity=".4"/>)}
        </svg>
      </div>
    );
  }

  Object.assign(window, {
    LockerBank, Vending, DiningTable, ServeryCounter,
  });
})();
