// interior-objects-psych2.jsx — 정신과 폐쇄병동 objects.
// Ligature-safe, bolted, minimal furnishings. v2 top-down, single silhouette,
// ground-contact ellipse shadow.

(function () {
  const C = '#2A2522';
  const T = window.ITILE || 16;

  // ─── SafeBed — 바닥 볼트 고정 안전 침대 (자해 방지, 모서리 둥금) ─────
  function SafeBed({ x, y, occupied = true }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 4, width: T * 2.4, height: T * 3.2 }}>
        <svg viewBox="0 0 38 50" width={T * 2.4} height={T * 3.2} shapeRendering="geometricPrecision">
          <ellipse cx="19" cy="48" rx="16" ry="2.4" fill="rgba(0,0,0,.16)"/>
          {/* one-piece molded plinth: big top face + short front, rounded (no ligature) */}
          <path d="M3 5 L35 5 Q37 5 37 8 L37 42 Q37 45 35 45 L3 45 Q1 45 1 42 L1 8 Q1 5 3 5 Z" fill="#C3BBA9" stroke={C} strokeWidth=".8"/>
          <path d="M3 5 L35 5 Q37 5 37 8 L37 10 L1 10 L1 8 Q1 5 3 5 Z" fill="#D2CBBB"/>{/* top bevel */}
          {/* mattress */}
          <rect x="4" y="8" width="30" height="28" rx="3" fill="#8FA9B8"/>
          <rect x="4" y="8" width="30" height="1.4" fill="#A6C0CE"/>
          {/* pillow */}
          <rect x="8" y="10" width="22" height="8" rx="3" fill="#EDF1F4" stroke={C} strokeWidth=".3"/>
          {/* occupant */}
          {occupied && (
            <g>
              <rect x="16" y="11.5" width="6" height="5" rx="2.2" fill="#FDE1C8" stroke={C} strokeWidth=".3"/>
              <rect x="16.4" y="10.6" width="5.2" height="1.4" fill="#5B4636"/>
              <ellipse cx="19" cy="27" rx="10" ry="7" fill="#7E96A6"/>{/* blanket mound */}
              <rect x="9" y="20" width="20" height="1" fill="#A6C0CE" opacity=".6"/>
            </g>
          )}
          <line x1="1" y1="36" x2="37" y2="36" stroke={C} strokeWidth=".6"/>{/* top↔front seam */}
          {/* recessed floor bolts (no gap under bed) */}
          <circle cx="5" cy="42" r="1.1" fill="#6B7280"/>
          <circle cx="33" cy="42" r="1.1" fill="#6B7280"/>
        </svg>
      </div>
    );
  }

  // ─── SeclusionPad — 안정실 패딩 매트 (벽·바닥 완충) ────────────────
  function SeclusionPad({ x, y, w = 3 }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T, width: T * w, height: T * 1.6 }}>
        <svg viewBox={`0 0 ${w*16} 26`} width={T * w} height={T * 1.6} shapeRendering="geometricPrecision" preserveAspectRatio="none">
          <ellipse cx={w*8} cy="24" rx={w*7} ry="1.8" fill="rgba(0,0,0,.12)"/>
          {/* padded floor mat (quilted) */}
          <rect x="1" y="4" width={w*16-2} height="18" rx="2" fill="#C6D0C2" stroke={C} strokeWidth=".6"/>
          {/* quilting seams */}
          {[...Array(w*2)].map((_,i)=><line key={'v'+i} x1={4+i*((w*16-6)/(w*2))} y1="5" x2={4+i*((w*16-6)/(w*2))} y2="21" stroke="#A9B5A4" strokeWidth=".5"/>)}
          <line x1="2" y1="13" x2={w*16-2} y2="13" stroke="#A9B5A4" strokeWidth=".5"/>
          <rect x="3" y="6" width={w*6} height="2" fill="#D6DED2"/>{/* highlight */}
        </svg>
      </div>
    );
  }

  // ─── GroupTable — 데이룸 원형 그룹 활동 테이블 (모서리 없음) ──────────
  function GroupTable({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 2, width: T * 2.2, height: T * 1.8 }}>
        <svg viewBox="0 0 36 28" width={T * 2.2} height={T * 1.8} shapeRendering="geometricPrecision">
          <ellipse cx="18" cy="26" rx="14" ry="2" fill="rgba(0,0,0,.14)"/>
          {/* round table top + short front rim (continuous) */}
          <ellipse cx="18" cy="10" rx="16" ry="7.5" fill="#CBA36B" stroke={C} strokeWidth=".6"/>
          <ellipse cx="18" cy="9" rx="13" ry="5.6" fill="#DBB884"/>
          <path d="M2 10 Q2 20 8 23 M34 10 Q34 20 28 23" fill="none" stroke="#B08A52" strokeWidth="1"/>
          {/* soft board-game pieces on top */}
          <circle cx="14" cy="9" r="1.6" fill="#EF6C6C"/>
          <circle cx="21" cy="10" r="1.6" fill="#5A8AC0"/>
          {/* center pedestal foot (no sharp legs) */}
          <ellipse cx="18" cy="22" rx="5" ry="1.8" fill="#9CA3AF"/>
        </svg>
      </div>
    );
  }

  // ─── ObsWindow — 간호 관찰창 (안전유리 카운터, 상시 관찰) ────────────
  function ObsWindow({ x, y, w = 4 }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 6, width: T * w, height: T * 1.6, zIndex: 3 }}>
        <svg viewBox={`0 0 ${w*16} 26`} width={T * w} height={T * 1.6} shapeRendering="geometricPrecision" preserveAspectRatio="none">
          {/* counter base */}
          <rect x="0" y="16" width={w*16} height="9" fill="#8E99A4" stroke={C} strokeWidth=".5"/>
          <rect x="0" y="16" width={w*16} height="2" fill="#AEB6BE"/>
          {/* thick safety-glass observation window with mullions */}
          <rect x="1" y="1" width={w*16-2} height="15" fill="#CFE6EE" fillOpacity=".5" stroke={C} strokeWidth=".7"/>
          {[...Array(w)].map((_,i)=><line key={i} x1={(i+1)*(w*16/(w+1))} y1="1" x2={(i+1)*(w*16/(w+1))} y2="16" stroke={C} strokeWidth=".5" opacity=".5"/>)}
          <rect x="2" y="2.5" width={w*5} height="3" fill="#FFFFFF" opacity=".35"/>{/* glare */}
        </svg>
      </div>
    );
  }

  Object.assign(window, {
    SafeBed, SeclusionPad, GroupTable, ObsWindow,
  });
})();
