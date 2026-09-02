// interior-objects-sim2.jsx — 시뮬레이션 랩 · 간호부 사무실 · 감염관리실 objects.
// Education/admin back-of-house. v2 top-down, single silhouette, ground ellipse.

(function () {
  const C = '#2A2522';
  const T = window.ITILE || 16;

  // ─── SimManikin — 고성능 시뮬레이션 마네킹 (제어 태블릿 연동 베드) ───
  function SimManikin({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 4, width: T * 2.6, height: T * 3.4 }}>
        <svg viewBox="0 0 42 52" width={T * 2.6} height={T * 3.4} shapeRendering="geometricPrecision">
          <ellipse cx="21" cy="50" rx="17" ry="2.4" fill="rgba(0,0,0,.16)"/>
          {/* sim bed: headboard + big mattress top face + short front */}
          <path d="M4 3 L38 3 L38 8 L4 8 Z" fill="#AEB6BE" stroke={C} strokeWidth=".7"/>
          <rect x="5" y="4" width="32" height="1.4" fill="#CBD5E1"/>
          <path d="M4 8 L38 8 L38 44 Q38 46 36 46 L6 46 Q4 46 4 44 Z" fill="#C7D0D8" stroke={C} strokeWidth=".7"/>
          <rect x="4" y="8" width="34" height="3" fill="#DCE4EA"/>
          {/* pillow */}
          <rect x="9" y="10" width="24" height="8" rx="3" fill="#EDF1F4" stroke={C} strokeWidth=".3"/>
          {/* the manikin lying full-length (NPC-sized): head + torso + legs */}
          <rect x="16.5" y="11" width="9" height="7" rx="3" fill="#E8CBB0" stroke={C} strokeWidth=".4"/>{/* head */}
          <path d="M13 19 L29 19 L27 34 L15 34 Z" fill="#EAD3BC" stroke={C} strokeWidth=".4"/>{/* torso */}
          <rect x="15" y="34" width="5" height="9" rx="1.5" fill="#EAD3BC" stroke={C} strokeWidth=".3"/>{/* leg */}
          <rect x="22" y="34" width="5" height="9" rx="1.5" fill="#EAD3BC" stroke={C} strokeWidth=".3"/>{/* leg */}
          {/* chest sensor leads */}
          <circle cx="17.5" cy="24" r="1.1" fill="#DC2626"/>
          <circle cx="24.5" cy="24" r="1.1" fill="#22C55E"/>
          <circle cx="21" cy="29" r="1.1" fill="#3B82F6"/>
          <path d="M17.5 24 Q12 24 10 21 M24.5 24 Q30 24 32 21" fill="none" stroke="#9CA3AF" strokeWidth=".4"/>
          <line x1="4" y1="44" x2="38" y2="44" stroke={C} strokeWidth=".5"/>
          {/* control tablet on a stand at the foot */}
          <rect x="30" y="38" width="7" height="5" rx=".6" fill="#0F1A24" stroke={C} strokeWidth=".4"/>
          <rect x="31" y="39" width="5" height="3" fill="#22D3EE"/>
          {/* legs */}
          <rect x="5" y="46" width="3" height="3.5" fill="#6B7280"/>
          <rect x="34" y="46" width="3" height="3.5" fill="#6B7280"/>
        </svg>
      </div>
    );
  }

  // ─── ControlBooth — 시뮬 제어실 원웨이 미러 부스 (관찰창 + 콘솔) ─────
  function ControlBooth({ x, y, w = 4 }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 6, width: T * w, height: T * 1.6, zIndex: 3 }}>
        <svg viewBox={`0 0 ${w*16} 26`} width={T * w} height={T * 1.6} shapeRendering="geometricPrecision" preserveAspectRatio="none">
          <rect x="0" y="16" width={w*16} height="9" fill="#8E99A4" stroke={C} strokeWidth=".5"/>
          <rect x="0" y="16" width={w*16} height="2" fill="#AEB6BE"/>
          {/* one-way mirror glass (tinted, subtle reflection) */}
          <rect x="1" y="1" width={w*16-2} height="15" fill="#3A4A55" fillOpacity=".55" stroke={C} strokeWidth=".7"/>
          {[...Array(w)].map((_,i)=><line key={i} x1={(i+1)*(w*16/(w+1))} y1="1" x2={(i+1)*(w*16/(w+1))} y2="16" stroke={C} strokeWidth=".4" opacity=".5"/>)}
          <rect x="2" y="2.5" width={w*5} height="3" fill="#6E8894" opacity=".4"/>{/* reflection */}
          {/* debrief monitors sitting on the counter */}
          <rect x="4" y="17.5" width="7" height="5" fill="#0F1A24"/>
          <rect x="5" y="18.4" width="5" height="3" fill="#22D3EE" opacity=".7"/>
          <rect x={w*16-11} y="17.5" width="7" height="5" fill="#0F1A24"/>
          <rect x={w*16-10} y="18.4" width="5" height="3" fill="#A7F3D0" opacity=".7"/>
        </svg>
      </div>
    );
  }

  // ─── OfficeDesk — 간호부 사무 데스크 (모니터 + 서류·필통) ────────────
  function OfficeDesk({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 4, width: T * 2, height: T * 1.9 }}>
        <svg viewBox="0 0 32 30" width={T * 2} height={T * 1.9} shapeRendering="geometricPrecision">
          <ellipse cx="16" cy="25.5" rx="13" ry="2.2" fill="rgba(0,0,0,.14)"/>
          {/* desktop top + short front */}
          <path d="M2 8 L30 8 L30 24 Q30 25 29 25 L3 25 Q2 25 2 24 Z" fill="#B8A98E" stroke={C} strokeWidth=".6"/>
          <rect x="2" y="8" width="28" height="4" fill="#CCBE9E"/>
          {/* monitor facing viewer */}
          <rect x="11" y="2" width="10" height="7" rx=".6" fill="#1F2937" stroke={C} strokeWidth=".4"/>
          <rect x="12" y="3" width="8" height="5" fill="#0B1A22"/>
          <rect x="12.8" y="3.8" width="6" height="1" fill="#22D3EE"/>
          <rect x="15" y="9" width="2" height="1.5" fill="#4B5563"/>
          {/* keyboard + paper stack + pen cup on the desktop */}
          <rect x="10" y="13" width="12" height="3" rx=".5" fill="#B7BEC6" stroke={C} strokeWidth=".3"/>
          <rect x="4" y="13" width="5" height="6" fill="#FBFAF4" stroke={C} strokeWidth=".3"/>
          <rect x="24" y="12" width="3" height="4" rx="1" fill="#5A8AC0"/>{/* pen cup */}
        </svg>
      </div>
    );
  }

  // ─── PPEBoard — 감염관리 방호구 착탈의 보드 (색상 단계 안내) ──────────
  function PPEBoard({ x, y, w = 3 }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T, width: T * w, height: T * 1.4 }}>
        <svg viewBox={`0 0 ${w*16} 22`} width={T * w} height={T * 1.4} shapeRendering="geometricPrecision" preserveAspectRatio="none">
          <ellipse cx={w*8} cy="20.5" rx={w*7} ry="1.4" fill="rgba(0,0,0,.1)"/>
          <rect x="0" y="0" width={w*16} height="20" rx="1" fill="#fff" stroke={C} strokeWidth=".6"/>
          <rect x="0" y="0" width={w*16} height="4" fill="#0E9488"/>
          <rect x="2" y="1.2" width={w*9} height="1.8" fill="#fff"/>{/* "DON / DOFF" */}
          {/* step icons: gown, mask, goggles, gloves */}
          {[['#FEF3C7',5],['#A5D8E8',5],['#DDD6FE',5],['#F9C9D6',5]].map(([col],i)=>(
            <g key={i}>
              <rect x={3+i*((w*16-6)/4)} y="7" width={(w*16-6)/4-2} height="6" fill={col} stroke={C} strokeWidth=".3"/>
              <circle cx={3+i*((w*16-6)/4)+2} cy="9" r=".9" fill="#0E9488"/>
              <text x={3+i*((w*16-6)/4)+((w*16-6)/4-2)/2} y="16.5" fontSize="2.2" fill={C} textAnchor="middle" fontFamily="monospace">{i+1}</text>
            </g>
          ))}
        </svg>
      </div>
    );
  }

  Object.assign(window, {
    SimManikin, ControlBooth, OfficeDesk, PPEBoard,
  });
})();
