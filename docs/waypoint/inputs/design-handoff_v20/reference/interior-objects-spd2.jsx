// interior-objects-spd2.jsx — 중앙공급실 SPD/CSD · 영양팀/배식실 · 하역장 objects.
// Industrial back-of-house support. v2 top-down, single silhouette, ground ellipse.

(function () {
  const C = '#2A2522';
  const T = window.ITILE || 16;

  // ─── Autoclave — 대형 고압증기 멸균기 (스테인리스 도어) ─────────────
  function Autoclave({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 4, width: T * 2, height: T * 2.2 }}>
        <svg viewBox="0 0 32 34" width={T * 2} height={T * 2.2} shapeRendering="geometricPrecision">
          <ellipse cx="16" cy="32.5" rx="12" ry="2.2" fill="rgba(0,0,0,.16)"/>
          {/* chamber body: top face + short front (continuous) */}
          <path d="M2 8 L30 8 L30 28 Q30 29 29 29 L3 29 Q2 29 2 28 Z" fill="#8A929B" stroke={C} strokeWidth=".7"/>
          <rect x="2" y="8" width="28" height="3" fill="#AEB6BE"/>
          {/* big round pressure door facing viewer */}
          <circle cx="14" cy="19" r="7" fill="#B7BEC6" stroke={C} strokeWidth=".6"/>
          <circle cx="14" cy="19" r="5" fill="#9CA3AF"/>
          <circle cx="14" cy="19" r="1.4" fill="#5B6672"/>{/* wheel-lock center */}
          {[0,1,2,3].map(i=>{const a=i*1.57;return <rect key={i} x={14+Math.cos(a)*5-0.3} y={19+Math.sin(a)*5-0.3} width=".6" height=".6" fill="#5B6672"/>;})}
          {/* control panel + steam gauge on the right */}
          <rect x="23" y="12" width="5" height="6" fill="#0F1A24" stroke={C} strokeWidth=".4"/>
          <rect x="23.6" y="13" width="3.6" height="1" fill="#22D3EE"/>
          <rect x="23.6" y="15" width="2.6" height="1" fill="#FBBF24"/>
          <circle cx="25.5" cy="22" r="1.8" fill="#fff" stroke={C} strokeWidth=".4"/>
          <line x1="25.5" y1="22" x2="26.7" y2="20.9" stroke="#DC2626" strokeWidth=".4"/>
        </svg>
      </div>
    );
  }

  // ─── SterileRack — 멸균 팩 보관 랙 (파우치 정렬) ────────────────────
  function SterileRack({ x, y, w = 3 }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 4, width: T * w, height: T * 1.7 }}>
        <svg viewBox={`0 0 ${w*16} 28`} width={T * w} height={T * 1.7} shapeRendering="geometricPrecision" preserveAspectRatio="none">
          <ellipse cx={w*8} cy="26.5" rx={w*7} ry="1.8" fill="rgba(0,0,0,.12)"/>
          {/* wire shelving carcass */}
          <rect x="1" y="1" width={w*16-2} height="24" fill="#DCE3E8" stroke={C} strokeWidth=".6"/>
          {[9,17].map((sy,r)=>(
            <g key={r}>
              <rect x="1" y={sy} width={w*16-2} height="1.4" fill="#B7BEC6"/>
              {/* peel-pouches with blue indicator strips */}
              {[...Array(w*2)].map((_,i)=>(
                <g key={i}>
                  <rect x={2.5+i*((w*16-5)/(w*2))} y={sy-6.5} width={(w*16-5)/(w*2)-1} height="6" fill="#EAF2F6" stroke={C} strokeWidth=".25"/>
                  <rect x={2.5+i*((w*16-5)/(w*2))} y={sy-6.5} width={(w*16-5)/(w*2)-1} height="1.2" fill="#5A8AC0"/>
                </g>
              ))}
            </g>
          ))}
          {/* top row */}
          {[...Array(w*2)].map((_,i)=>(
            <rect key={'t'+i} x={2.5+i*((w*16-5)/(w*2))} y="2.5" width={(w*16-5)/(w*2)-1} height="6" fill="#EAF2F6" stroke={C} strokeWidth=".25"/>
          ))}
        </svg>
      </div>
    );
  }

  // ─── WasherDisinfector — 기구 세척 소독기 (통과형 스테인리스) ────────
  function WasherDisinfector({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 4, width: T * 1.8, height: T * 2 }}>
        <svg viewBox="0 0 28 30" width={T * 1.8} height={T * 2} shapeRendering="geometricPrecision">
          <ellipse cx="14" cy="28.5" rx="10" ry="2" fill="rgba(0,0,0,.16)"/>
          <path d="M2 7 L26 7 L26 25 Q26 26 25 26 L3 26 Q2 26 2 25 Z" fill="#9CA3AF" stroke={C} strokeWidth=".7"/>
          <rect x="2" y="7" width="24" height="3" fill="#BEC5CD"/>
          {/* glass door showing instrument baskets */}
          <rect x="4" y="11" width="20" height="12" rx="1" fill="#CFE6EE" fillOpacity=".55" stroke={C} strokeWidth=".5"/>
          <rect x="5.5" y="13" width="17" height="3" fill="#9CA3AF" opacity=".5"/>
          <rect x="5.5" y="17.5" width="17" height="3" fill="#9CA3AF" opacity=".5"/>
          {/* control */}
          <rect x="4" y="8" width="7" height="2.2" fill="#0F1A24"/>
          <rect x="4.6" y="8.6" width="4" height="1" fill="#22D3EE"/>
        </svg>
      </div>
    );
  }

  // ─── FoodCartColumn — 배식 카트 (다단 트레이, 보온고) ────────────────
  function FoodCartColumn({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 4, width: T * 1.4, height: T * 2.2 }}>
        <svg viewBox="0 0 22 34" width={T * 1.4} height={T * 2.2} shapeRendering="geometricPrecision">
          <ellipse cx="11" cy="32.5" rx="8" ry="2.2" fill="rgba(0,0,0,.16)"/>
          {/* insulated cabinet: top + front (continuous) */}
          <path d="M2 6 L20 6 L20 28 Q20 29 19 29 L3 29 Q2 29 2 28 Z" fill="#C6C2B6" stroke={C} strokeWidth=".7"/>
          <rect x="2" y="6" width="18" height="3" fill="#D8D4C6"/>
          {/* stacked tray slots (front) */}
          {[11,15,19,23].map((ty,i)=>(
            <rect key={i} x="4" y={ty} width="14" height="2.6" fill="#E6E2D6" stroke={C} strokeWidth=".3"/>
          ))}
          {/* latch handle + hot indicator */}
          <rect x="17" y="14" width="1.4" height="8" fill="#9C8F70"/>
          <rect x="5" y="7" width="4" height="1.6" fill="#EF6C6C"/>{/* HOT */}
          <ellipse cx="5" cy="31" rx="1.6" ry="1.2" fill={C}/>
          <ellipse cx="17" cy="31" rx="1.6" ry="1.2" fill={C}/>
        </svg>
      </div>
    );
  }

  // ─── PalletStack — 하역장 물류 파렛트 (박스 적재) ───────────────────
  function PalletStack({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 2, width: T * 1.8, height: T * 1.8 }}>
        <svg viewBox="0 0 28 28" width={T * 1.8} height={T * 1.8} shapeRendering="geometricPrecision">
          <ellipse cx="14" cy="26.5" rx="11" ry="2" fill="rgba(0,0,0,.16)"/>
          {/* wooden pallet base */}
          <path d="M2 20 L26 20 L24 25 L4 25 Z" fill="#B98A5A" stroke={C} strokeWidth=".5"/>
          {[6,14,22].map((bx,i)=><rect key={i} x={bx-1} y="20" width="2" height="5" fill="#8F6A3E"/>)}
          {/* stacked cardboard cartons (top faces + fronts) */}
          <path d="M4 8 L14 8 L14 20 L4 20 Z" fill="#C9A876" stroke={C} strokeWidth=".5"/>
          <path d="M4 8 L14 8 L15 6 L5 6 Z" fill="#D9BC8E"/>
          <path d="M14 10 L24 10 L24 20 L14 20 Z" fill="#BE9E6E" stroke={C} strokeWidth=".5"/>
          <path d="M14 10 L24 10 L25 8 L15 8 Z" fill="#D3B584"/>
          {/* shipping labels */}
          <rect x="6" y="12" width="6" height="4" fill="#FBFAF4" stroke={C} strokeWidth=".3"/>
          <rect x="16" y="13" width="6" height="4" fill="#FBFAF4" stroke={C} strokeWidth=".3"/>
        </svg>
      </div>
    );
  }

  // ─── CargoTruck — 하역장 배송 트럭 (박스 화물칸 후면) ───────────────
  function CargoTruck({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 4, width: T * 2.4, height: T * 3 }}>
        <svg viewBox="0 0 38 48" width={T * 2.4} height={T * 3} shapeRendering="geometricPrecision">
          <ellipse cx="19" cy="46.5" rx="16" ry="2.4" fill="rgba(0,0,0,.18)"/>
          {/* box cargo body: big top face + tall rear (backed up to the dock) */}
          <path d="M3 4 L35 4 L35 40 Q35 41 34 41 L4 41 Q3 41 3 40 Z" fill="#D8DCE0" stroke={C} strokeWidth=".8"/>
          <rect x="3" y="4" width="32" height="6" fill="#E6E9EC" stroke={C} strokeWidth=".6"/>{/* roof top face + outline */}
          {/* roll-up rear door with horizontal slats */}
          <rect x="6" y="12" width="26" height="26" rx="1" fill="#B7BEC6" stroke={C} strokeWidth=".6"/>
          {[15,19,23,27,31,35].map((sy,i)=><line key={i} x1="6" y1={sy} x2="32" y2={sy} stroke="#8A929B" strokeWidth=".6"/>)}
          {/* latch handles */}
          <rect x="17" y="24" width="1.6" height="5" fill="#5B6672"/>
          <rect x="20" y="24" width="1.6" height="5" fill="#5B6672"/>
          {/* cab peeking at the far end */}
          <rect x="9" y="1" width="20" height="3.5" rx="1" fill="#5A8AC0" stroke={C} strokeWidth=".5"/>
        </svg>
      </div>
    );
  }

  Object.assign(window, {
    Autoclave, SterileRack, WasherDisinfector, FoodCartColumn, PalletStack, CargoTruck,
  });
})();
