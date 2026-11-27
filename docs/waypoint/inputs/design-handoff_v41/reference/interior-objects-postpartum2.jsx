// interior-objects-postpartum2.jsx — 산후 병동 Postpartum objects.
// Mother-baby couplet care. v2 top-down, single silhouette, ground ellipse.

(function () {
  const C = '#2A2522';
  const T = window.ITILE || 16;

  // ─── PostpartumBed — 산모 회복 침대 (등받이 각도 + 포근한 이불) ──────
  function PostpartumBed({ x, y, occupied }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 4, width: T * 2.6, height: T * 3.4 }}>
        <svg viewBox="0 0 42 52" width={T * 2.6} height={T * 3.4} shapeRendering="geometricPrecision">
          <ellipse cx="21" cy="50" rx="18" ry="2.4" fill="rgba(0,0,0,.16)"/>
          {/* headboard */}
          <path d="M4 3 L38 3 L38 8 L4 8 Z" fill="#C7BBA0" stroke={C} strokeWidth=".7"/>
          <rect x="5" y="4" width="32" height="1.4" fill="#DACFB6"/>
          {/* mattress top face + short front (continuous) */}
          <path d="M4 8 L38 8 L38 44 Q38 46 36 46 L6 46 Q4 46 4 44 Z" fill="#E4DAC8" stroke={C} strokeWidth=".7"/>
          {/* raised backrest wedge (semi-Fowler) */}
          <rect x="6" y="9" width="30" height="10" rx="2" fill="#D6C9AE"/>
          <rect x="10" y="10.5" width="22" height="8" rx="3" fill="#FBFAF4" stroke={C} strokeWidth=".4"/>{/* pillow */}
          {occupied && (
            <g>
              <rect x="18" y="12" width="6.5" height="5.5" rx="2.4" fill="#FBD9C0" stroke={C} strokeWidth=".3"/>
              <rect x="18.3" y="11.1" width="5.9" height="1.5" fill="#5B4636"/>
              <ellipse cx="21" cy="32" rx="10" ry="6.5" fill="#EEB6CC" opacity=".6"/>
            </g>
          )}
          {/* soft pink quilt */}
          <rect x="5" y="22" width="32" height="22" rx="1.5" fill="#F5C6D8"/>
          <path d="M5 29 L37 29 M5 36 L37 36" stroke="#E8AEC4" strokeWidth=".6"/>
          <path d="M14 22 L14 44 M23 22 L23 44 M32 22 L32 44" stroke="#E8AEC4" strokeWidth=".5" opacity=".6"/>
          {/* side rails */}
          <rect x="1.5" y="16" width="2.4" height="18" rx="1" fill="#B7C0C8" stroke={C} strokeWidth=".4"/>
          <rect x="38.1" y="16" width="2.4" height="18" rx="1" fill="#B7C0C8" stroke={C} strokeWidth=".4"/>
          <line x1="4" y1="44" x2="38" y2="44" stroke={C} strokeWidth=".5"/>
          {/* legs + wheels */}
          <rect x="5" y="46" width="3" height="3.5" fill="#6B7280"/>
          <rect x="34" y="46" width="3" height="3.5" fill="#6B7280"/>
          <ellipse cx="6.5" cy="49.5" rx="1.8" ry="1.2" fill={C}/>
          <ellipse cx="35.5" cy="49.5" rx="1.8" ry="1.2" fill={C}/>
        </svg>
      </div>
    );
  }

  // ─── SitzBathStation — 좌욕기·회음 케어 스테이션 (화장실 코너) ────────
  function SitzBathStation({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 4, width: T * 2, height: T * 2.4 }}>
        <svg viewBox="0 0 32 38" width={T * 2} height={T * 2.4} shapeRendering="geometricPrecision">
          <ellipse cx="16" cy="36" rx="12" ry="2.2" fill="rgba(0,0,0,.15)"/>
          {/* commode/chair frame: seat top + front apron (continuous) */}
          <path d="M4 16 L28 16 L28 28 Q28 30 26 30 L6 30 Q4 30 4 28 Z" fill="#C3CAD1" stroke={C} strokeWidth=".7"/>
          {/* wide toilet-seat ring with the sitz basin nested in it (top face) */}
          <ellipse cx="16" cy="14" rx="13" ry="7" fill="#E7ECEF" stroke={C} strokeWidth=".7"/>
          <ellipse cx="16" cy="14" rx="10.5" ry="5.2" fill="#F4F7F9"/>
          {/* warm-water basin insert */}
          <ellipse cx="16" cy="14.5" rx="7.5" ry="3.6" fill="#BFE0EA" stroke={C} strokeWidth=".5"/>
          <path d="M10 13.5 Q16 11.8 22 13.5" fill="none" stroke="#FFFFFF" strokeWidth=".7" opacity=".6"/>
          {/* support armrests both sides */}
          <rect x="1.5" y="15" width="3.5" height="13" rx="1.5" fill="#9CA3AF" stroke={C} strokeWidth=".5"/>
          <rect x="27" y="15" width="3.5" height="13" rx="1.5" fill="#9CA3AF" stroke={C} strokeWidth=".5"/>
          {/* warm-water bag on a small pole + tube feeding the basin */}
          <rect x="6" y="2" width="4" height="6" rx="1" fill="#F7C6D6" stroke={C} strokeWidth=".4"/>
          <path d="M8 8 Q8 12 12 13.5" fill="none" stroke="#E8AEC4" strokeWidth=".7"/>
          {/* legs */}
          <rect x="5" y="30" width="3" height="4" fill="#6B7280"/>
          <rect x="24" y="30" width="3" height="4" fill="#6B7280"/>
        </svg>
      </div>
    );
  }

  // ─── LactationPump — 병원용 모유 유축기 (카트) ─────────────────────
  function LactationPump({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 4, width: T * 1.3, height: T * 1.9 }}>
        <svg viewBox="0 0 20 30" width={T * 1.3} height={T * 1.9} shapeRendering="geometricPrecision">
          <ellipse cx="10" cy="28.5" rx="7" ry="2" fill="rgba(0,0,0,.16)"/>
          {/* pump unit: top + front (continuous) */}
          <path d="M3 8 L17 8 L17 18 Q17 19 16 19 L4 19 Q3 19 3 18 Z" fill="#E4DAEC" stroke={C} strokeWidth=".6"/>
          <rect x="3" y="8" width="14" height="2.5" fill="#EFE7F5"/>
          {/* viewer-facing display + dial */}
          <rect x="5" y="11" width="7" height="4" rx=".5" fill="#0F1A24"/>
          <rect x="5.6" y="12" width="4" height="1" fill="#C4B5E8"/>
          <circle cx="14" cy="13" r="1.8" fill="#CBD5E1" stroke={C} strokeWidth=".3"/>
          {/* two collection bottles + tubing on top */}
          <rect x="5" y="4" width="3" height="4.5" rx="1" fill="#FBFAF4" stroke={C} strokeWidth=".3"/>
          <rect x="12" y="4" width="3" height="4.5" rx="1" fill="#FBFAF4" stroke={C} strokeWidth=".3"/>
          {/* pole + wheels */}
          <rect x="9" y="19" width="2" height="6" fill="#CBD5E1"/>
          <ellipse cx="6" cy="26" rx="1.8" ry="1.3" fill={C}/>
          <ellipse cx="14" cy="26" rx="1.8" ry="1.3" fill={C}/>
        </svg>
      </div>
    );
  }

  Object.assign(window, {
    PostpartumBed, SitzBathStation, LactationPump,
  });
})();
