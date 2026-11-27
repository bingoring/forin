// interior-objects-eye2.jsx — 안과·이비인후과 전문외래 objects.
// Specialty ophthalmology + ENT exam gear. v2 top-down, single silhouette,
// ground-contact ellipse shadow.

(function () {
  const C = '#2A2522';
  const T = window.ITILE || 16;

  // ─── SlitLamp — 세극등 현미경 (턱받침 + 조이스틱 본체) ───────────────
  function SlitLamp({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 6, width: T * 1.8, height: T * 2 }}>
        <svg viewBox="0 0 28 32" width={T * 1.8} height={T * 2} shapeRendering="geometricPrecision">
          <ellipse cx="14" cy="27" rx="11" ry="2.2" fill="rgba(0,0,0,.16)"/>
          {/* instrument table top + short front */}
          <path d="M2 16 L26 16 L26 26 Q26 27 25 27 L3 27 Q2 27 2 26 Z" fill="#B7BEC6" stroke={C} strokeWidth=".6"/>
          <rect x="2" y="16" width="24" height="3" fill="#CBD5E1"/>
          {/* patient chin/forehead rest frame (facing viewer) */}
          <rect x="5" y="8" width="2" height="8" fill="#9CA3AF" stroke={C} strokeWidth=".3"/>
          <rect x="21" y="8" width="2" height="8" fill="#9CA3AF" stroke={C} strokeWidth=".3"/>
          <rect x="4" y="6" width="20" height="2.5" rx="1" fill="#CBD5E1" stroke={C} strokeWidth=".3"/>{/* forehead bar */}
          <rect x="10" y="12" width="8" height="2" rx="1" fill="#E1E7EC" stroke={C} strokeWidth=".3"/>{/* chin rest */}
          {/* binocular microscope + slit illumination arm */}
          <rect x="11" y="16.5" width="6" height="4" rx="1" fill="#475569" stroke={C} strokeWidth=".4"/>
          <rect x="12" y="14.5" width="1.8" height="2.5" fill="#374151"/>
          <rect x="14.2" y="14.5" width="1.8" height="2.5" fill="#374151"/>
          <rect x="19" y="17" width="2" height="4" fill="#FBBF24"/>{/* slit beam housing */}
          {/* joystick */}
          <circle cx="8" cy="21" r="1.6" fill="#5B6672" stroke={C} strokeWidth=".3"/>
        </svg>
      </div>
    );
  }

  // ─── PhoropterStand — 검안기(포롭터) 아암 스탠드 ────────────────────
  function PhoropterStand({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 8, width: T * 1.5, height: T * 2.2 }}>
        <svg viewBox="0 0 24 36" width={T * 1.5} height={T * 2.2} shapeRendering="geometricPrecision">
          <ellipse cx="14" cy="31.5" rx="8" ry="2" fill="rgba(0,0,0,.16)"/>
          {/* the phoropter head (twin lens dials facing patient/viewer) */}
          <path d="M3 4 L21 4 L21 12 L3 12 Z" fill="#475569" stroke={C} strokeWidth=".5"/>
          <circle cx="8" cy="8" r="3.4" fill="#5B6672" stroke={C} strokeWidth=".5"/>
          <circle cx="8" cy="8" r="1.4" fill="#0B1A22"/>
          <circle cx="16" cy="8" r="3.4" fill="#5B6672" stroke={C} strokeWidth=".5"/>
          <circle cx="16" cy="8" r="1.4" fill="#0B1A22"/>
          {/* suspension arm + counterweight column */}
          <rect x="11" y="12" width="2" height="6" fill="#9CA3AF"/>
          <rect x="17" y="12" width="4" height="18" fill="#B7BEC6" stroke={C} strokeWidth=".4"/>
          {/* base */}
          <ellipse cx="14" cy="31" rx="7" ry="2" fill="#8A929B" stroke={C} strokeWidth=".4"/>
        </svg>
      </div>
    );
  }

  // ─── ENTTowerChair — 이비인후과 진료 유닛 (기구 걸이 + 전동 체어) ────
  function ENTTowerChair({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 4, width: T * 2.6, height: T * 3 }}>
        <svg viewBox="0 0 42 48" width={T * 2.6} height={T * 3} shapeRendering="geometricPrecision">
          {/* two separate ground shadows — one per object */}
          <ellipse cx="12" cy="45" rx="10" ry="2.2" fill="rgba(0,0,0,.16)"/>
          <ellipse cx="33" cy="45" rx="6" ry="2" fill="rgba(0,0,0,.16)"/>
          {/* ── powered exam chair (left) — seat big top face + short front ── */}
          <path d="M2 22 L22 22 L22 36 Q22 38 20 38 L4 38 Q2 38 2 36 Z" fill="#3E6FA0" stroke={C} strokeWidth=".7"/>
          <rect x="4" y="24" width="16" height="12" rx="2" fill="#5A8AC0"/>
          {/* reclined backrest + headrest at the head (top) */}
          <path d="M2 4 L22 4 Q23 4 23 5 L23 22 L1 22 L1 5 Q1 4 2 4 Z" fill="#3E6FA0" stroke={C} strokeWidth=".7"/>
          <rect x="4" y="6" width="16" height="14" rx="2.5" fill="#5A8AC0"/>
          <rect x="8" y="5" width="8" height="4" rx="2" fill="#7AA6D4"/>{/* headrest */}
          <line x1="1" y1="22" x2="23" y2="22" stroke={C} strokeWidth=".5" opacity=".5"/>{/* seat↔back seam */}
          {/* armrests */}
          <rect x="0" y="23" width="3" height="13" rx="1.2" fill="#2E5480"/>
          <rect x="21" y="23" width="3" height="13" rx="1.2" fill="#2E5480"/>
          {/* ── ENT instrument tower (right) — separate unit: top + front ── */}
          <path d="M27 8 L39 8 Q40 8 40 9 L40 40 Q40 41 39 41 L28 41 Q27 41 27 40 L27 9 Q27 8 28 8 Z" fill="#5B6672" stroke={C} strokeWidth=".7"/>
          <rect x="28" y="6" width="11" height="3" rx="1" fill="#6E7A86"/>{/* top face */}
          <line x1="27" y1="9" x2="40" y2="9" stroke={C} strokeWidth=".5" opacity=".6"/>
          {/* viewer-facing scope screen + instruments */}
          <rect x="29" y="11" width="9" height="6" rx="1" fill="#0F1A24"/>
          <rect x="30" y="12.2" width="7" height="1.2" fill="#22D3EE"/>
          <rect x="30" y="14.2" width="5" height="1" fill="#A7F3D0"/>
          {/* hanging scopes/suction on the front */}
          <rect x="30" y="20" width="1.4" height="9" rx=".6" fill="#9CA3AF"/>
          <rect x="33" y="20" width="1.4" height="7" rx=".6" fill="#9CA3AF"/>
          <rect x="36" y="20" width="1.4" height="8" rx=".6" fill="#9CA3AF"/>
          <rect x="29" y="31" width="9" height="6" rx="1" fill="#4B5563"/>{/* drawer */}
        </svg>
      </div>
    );
  }

  // ─── VisionChart — 시력 검사표 (벽, 조명 박스) ──────────────────────
  function VisionChart({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T + 2, top: y * T, width: T - 4, height: T * 1.4 }}>
        <svg viewBox="0 0 12 20" width={T - 4} height={T * 1.4} shapeRendering="geometricPrecision">
          <rect x="1" y="1" width="10" height="18" rx=".5" fill="#fff" stroke={C} strokeWidth=".6"/>
          {/* big-to-small letter rows */}
          <text x="6" y="5.5" fontSize="4" fill={C} textAnchor="middle" fontFamily="monospace">E</text>
          <text x="6" y="9.5" fontSize="2.6" fill={C} textAnchor="middle" fontFamily="monospace">F P</text>
          <text x="6" y="12.8" fontSize="1.8" fill={C} textAnchor="middle" fontFamily="monospace">T O Z</text>
          <text x="6" y="15.6" fontSize="1.3" fill={C} textAnchor="middle" fontFamily="monospace">L P E D</text>
          <text x="6" y="17.8" fontSize="1" fill={C} textAnchor="middle" fontFamily="monospace">P E C F D</text>
        </svg>
      </div>
    );
  }

  Object.assign(window, {
    SlitLamp, PhoropterStand, ENTTowerChair, VisionChart,
  });
})();
