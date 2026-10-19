// interior-objects-dial2.jsx — 인공신장실 Hemodialysis Unit objects.
// Rows of dialysis stations + RO water treatment. v2 top-down, single
// silhouette, ground-contact ellipse shadow.

(function () {
  const C = '#2A2522';
  const T = window.ITILE || 16;

  // ─── DialysisMachine — 혈액투석기 (혈액펌프 + 다이알라이저 + 화면) ────
  function DialysisMachine({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 18, width: T * 1.5, height: T * 3.2 }}>
        <svg viewBox="0 0 24 52" width={T * 1.5} height={T * 3.2} shapeRendering="geometricPrecision">
          <ellipse cx="12" cy="50" rx="8" ry="2.2" fill="rgba(0,0,0,.16)"/>
          {/* top cap folding into a continuous tall front cabinet */}
          <path d="M2 6 L22 6 L22 47 Q22 48 21 48 L3 48 Q2 48 2 47 Z" fill="#8E99A4" stroke={C} strokeWidth=".6"/>
          <rect x="2" y="6" width="20" height="2.6" fill="#AEB6BE"/>
          {/* viewer-facing touchscreen (upper) */}
          <rect x="4" y="9" width="16" height="10" rx="1" fill="#111827" stroke={C} strokeWidth=".5"/>
          <rect x="5" y="10.2" width="14" height="7.6" fill="#0B1A22"/>
          <path d="M6 14 Q9 12.5 12 14 T18 14" fill="none" stroke="#F87171" strokeWidth=".6"/>{/* pressure trace */}
          <rect x="6" y="15.5" width="8" height="1" fill="#22D3EE"/>
          {/* blood pump (rotating rotor) */}
          <circle cx="8" cy="24" r="3.4" fill="#1F2937" stroke={C} strokeWidth=".5"/>
          <circle cx="8" cy="24" r="1.2" fill="#DC2626"/>
          <rect x="7.4" y="20.6" width="1.2" height="3.4" fill="#7F1D1D"/>
          {/* dialyzer cartridge (vertical amber tube) + blood lines */}
          <rect x="15" y="21" width="3.4" height="12" rx="1.5" fill="#E4A94B" stroke={C} strokeWidth=".5"/>
          <rect x="15.6" y="22" width="2.2" height="10" fill="#F1C56E"/>
          <path d="M11 24 Q15 22 15 25" fill="none" stroke="#DC2626" strokeWidth=".8"/>
          <path d="M18 33 Q20 36 16 37" fill="none" stroke="#3B82F6" strokeWidth=".8"/>
          {/* dialysate connectors + level lamp (front) */}
          <circle cx="8" cy="34" r="1.6" fill="#10B981" stroke={C} strokeWidth=".3"/>
          <rect x="4" y="40" width="16" height="4" fill="#5B6672"/>{/* base module */}
          {/* casters */}
          <ellipse cx="6" cy="48" rx="2" ry="1.4" fill={C}/>
          <ellipse cx="18" cy="48" rx="2" ry="1.4" fill={C}/>
        </svg>
      </div>
    );
  }

  // ─── DialysisChair — 투석용 리클라이너 (팔 지지대 + 담요) ────────────
  function DialysisChair({ x, y, occupied }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 4, width: T * 2.4, height: T * 3.2 }}>
        <svg viewBox="0 0 38 50" width={T * 2.4} height={T * 3.2} shapeRendering="geometricPrecision">
          <ellipse cx="19" cy="45.5" rx="15" ry="2.2" fill="rgba(0,0,0,.16)"/>
          {/* extended footrest (reclined toward viewer) — top face + front band */}
          <path d="M8 34 L30 34 L30 42 L8 42 Z" fill="#6E9A82" stroke={C} strokeWidth=".6"/>
          <path d="M8 42 L30 42 L30 44.5 Q30 45 29 45 L9 45 Q8 45 8 44.5 Z" fill="#3E6050" stroke={C} strokeWidth=".6"/>{/* front apron */}
          <rect x="10" y="35.5" width="18" height="5.5" rx="2" fill="#8BB89E"/>
          {/* long reclined seat (big top face) */}
          <path d="M4 12 L34 12 L34 34 L4 34 Z" fill="#5E8A72" stroke={C} strokeWidth=".7"/>
          <rect x="6" y="14" width="26" height="19" rx="2" fill="#7CA891"/>
          <path d="M19 14 L19 33" stroke="#6B9880" strokeWidth=".5"/>
          {/* reclined backrest at the head: top face + a short front band so it
             reads as an angled (not pure top-down) recliner */}
          <path d="M4 2 L34 2 Q35 2 35 3 L35 10 L3 10 L3 3 Q3 2 4 2 Z" fill="#5E8A72" stroke={C} strokeWidth=".7"/>
          <rect x="6" y="3.5" width="26" height="6" rx="2.5" fill="#7CA891"/>
          <path d="M3 10 L35 10 L35 13 L3 13 Z" fill="#4C7460" stroke={C} strokeWidth=".6"/>{/* backrest front band */}
          <rect x="12" y="1.5" width="14" height="3.5" rx="2" fill="#93BBA5"/>{/* headrest */}
          {/* AV-fistula arm board (right) + arm support (left) */}
          <rect x="34" y="16" width="4" height="12" rx="1.2" fill="#4C7460" stroke={C} strokeWidth=".5"/>
          <rect x="0" y="14" width="4" height="22" rx="1.5" fill="#48697A"/>
          {/* reclining patient */}
          {occupied && (
            <g>
              <rect x="15.5" y="4" width="7" height="6" rx="2.6" fill="#FBD9C0" stroke={C} strokeWidth=".3"/>
              <rect x="15.8" y="3.1" width="6.4" height="1.6" fill="#5B4636"/>
              <ellipse cx="19" cy="24" rx="9" ry="9" fill="#CFE0EA" opacity=".6"/>{/* blanket */}
              {/* fistula line to the arm board */}
              <path d="M23 20 Q30 20 34 22" fill="none" stroke="#C0392B" strokeWidth=".7"/>
            </g>
          )}
        </svg>
      </div>
    );
  }

  // ─── ROWaterUnit — 역삼투압(RO) 수처리 장치 (탱크 + 파이프) ──────────
  function ROWaterUnit({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 10, width: T * 2.1, height: T * 2.7 }}>
        <svg viewBox="0 0 34 44" width={T * 2.1} height={T * 2.7} shapeRendering="geometricPrecision">
          <ellipse cx="17" cy="41.5" rx="13" ry="2.2" fill="rgba(0,0,0,.16)"/>
          {/* twin vertical RO membrane cylinders with round TOP caps */}
          <ellipse cx="7" cy="5" rx="3" ry="1.5" fill="#D4E6EE" stroke={C} strokeWidth=".4"/>{/* top cap */}
          <rect x="4" y="5" width="6" height="27" fill="#BFD8E4" stroke={C} strokeWidth=".5"/>
          <rect x="5" y="6" width="1.6" height="24" fill="#DCEAF0"/>
          <ellipse cx="14" cy="5" rx="3" ry="1.5" fill="#C2D8E4" stroke={C} strokeWidth=".4"/>
          <rect x="11" y="5" width="6" height="27" fill="#A7C7D8" stroke={C} strokeWidth=".5"/>
          {/* control cabinet: big top face + front (continuous) */}
          <path d="M19 14 L31 14 L31 32 Q31 33 30 33 L20 33 Q19 33 19 32 Z" fill="#8E99A4" stroke={C} strokeWidth=".6"/>
          <rect x="19" y="9" width="12" height="5" fill="#A6B0BA" stroke={C} strokeWidth=".5"/>{/* top face */}
          <rect x="20.5" y="10" width="9" height="1.6" fill="#BBC4CC"/>{/* top highlight */}
          <line x1="19" y1="14" x2="31" y2="14" stroke={C} strokeWidth=".5"/>
          {/* viewer-facing screen + gauges */}
          <rect x="20.5" y="16" width="9" height="4" fill="#0F1A24"/>
          <rect x="21" y="17" width="6" height="1" fill="#22D3EE"/>
          <circle cx="23" cy="24" r="1.8" fill="#fff" stroke={C} strokeWidth=".4"/>
          <circle cx="27.5" cy="24" r="1.8" fill="#fff" stroke={C} strokeWidth=".4"/>
          {/* interconnecting base manifold spanning cylinders + cabinet */}
          <rect x="4" y="32" width="27" height="4" rx="1" fill="#B7BEC6" stroke={C} strokeWidth=".5"/>
          <rect x="7" y="30" width="14" height="2" fill="#9CA3AF"/>{/* pipe */}
          {/* casters attached directly under the base */}
          <ellipse cx="8" cy="37" rx="2.2" ry="1.5" fill={C}/>
          <ellipse cx="17" cy="37" rx="2.2" ry="1.5" fill={C}/>
          <ellipse cx="27" cy="37" rx="2.2" ry="1.5" fill={C}/>
        </svg>
      </div>
    );
  }

  Object.assign(window, {
    DialysisMachine, DialysisChair, ROWaterUnit,
  });
})();
