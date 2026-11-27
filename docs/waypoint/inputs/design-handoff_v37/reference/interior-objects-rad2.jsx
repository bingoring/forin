// interior-objects-rad2.jsx — 영상의학과 Radiology objects (CT/MRI/X-ray).
// Imaging suites: gantry/bore scanners on patient tables + shielded control
// consoles + reading room. v2 top-down, single silhouette, ground ellipse.

(function () {
  const C = '#2A2522';
  const T = window.ITILE || 16;

  // ─── CTScanner — CT 도넛형 갠트리 + 환자 테이블 ─────────────────────
  function CTScanner({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 8, width: T * 4, height: T * 3.4 }}>
        <svg viewBox="0 0 64 54" width={T * 4} height={T * 3.4} shapeRendering="geometricPrecision">
          <ellipse cx="32" cy="51" rx="29" ry="3" fill="rgba(0,0,0,.17)"/>
          {/* ── big donut gantry: rounded TOP face folding into a tall front ── */}
          <path d="M6 6 L58 6 Q62 6 62 12 L62 30 Q62 34 58 34 L6 34 Q2 34 2 30 L2 12 Q2 6 6 6 Z" fill="#D2DAE0" stroke={C} strokeWidth="1"/>
          <path d="M6 6 L58 6 Q62 6 62 12 L62 14 L2 14 L2 12 Q2 6 6 6 Z" fill="#E4EAEF"/>{/* top bevel */}
          {/* concentric bore rings for depth + lit aperture */}
          <ellipse cx="32" cy="20" rx="20" ry="14" fill="#B4BEC6" stroke={C} strokeWidth=".7"/>
          <ellipse cx="32" cy="20" rx="15" ry="10.5" fill="#98A2AA"/>
          <ellipse cx="32" cy="20" rx="10.5" ry="7.5" fill="#3A434C"/>
          <ellipse cx="32" cy="20" rx="7" ry="5" fill="#12181E"/>
          <ellipse cx="32" cy="20" rx="10.5" ry="7.5" fill="none" stroke="#22D3EE" strokeWidth=".7" opacity=".8"/>
          <ellipse cx="32" cy="13.5" rx="9" ry="1.8" fill="#67E8F9" opacity=".45"/>{/* aperture glow */}
          {/* status dots on the gantry face */}
          <circle cx="12" cy="20" r="1.2" fill="#22C55E"/>
          <circle cx="52" cy="20" r="1.2" fill="#EF4444"/>
          <path d="M2 30 L62 30" stroke={C} strokeWidth=".5" opacity=".5"/>{/* top↔front seam */}
          {/* ── patient couch sliding out toward viewer (NPC-sized) ── */}
          <path d="M24 32 L40 32 L40 50 Q40 51 39 51 L25 51 Q24 51 24 50 Z" fill="#C7D0D8" stroke={C} strokeWidth=".7"/>
          <rect x="25.5" y="33.5" width="13" height="16" rx="1.5" fill="#E1E7EC"/>{/* cushioned pad */}
          <rect x="27" y="35" width="10" height="2" rx="1" fill="#B7C0C8"/>{/* head rest */}
          {/* pedestal base under the couch */}
          <rect x="29" y="49" width="6" height="3" fill="#8A929B"/>
        </svg>
      </div>
    );
  }

  // ─── MRIScanner — 대형 MRI (긴 보어 자석 + 환자 테이블 + 안전존) ────
  function MRIScanner({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 8, width: T * 4.4, height: T * 3.2 }}>
        <svg viewBox="0 0 70 51" width={T * 4.4} height={T * 3.2} shapeRendering="geometricPrecision">
          {/* ground-contact shadow */}
          <ellipse cx="35" cy="47" rx="32" ry="3" fill="rgba(0,0,0,.18)"/>
          {/* ── massive magnet housing: big rounded TOP face folding straight
                 into a tall front (single continuous silhouette) ── */}
          <path d="M4 6 L66 6 L66 38 Q66 42 62 42 L8 42 Q4 42 4 38 Z" fill="#C6D0D8" stroke={C} strokeWidth="1"/>
          <rect x="4" y="6" width="62" height="20" rx="7" fill="#DCE4EA"/>{/* top face */}
          <path d="M4 26 L66 26" stroke={C} strokeWidth=".5" opacity=".5"/>{/* top↔front seam */}
          {/* recessed manufacturer band + vent louvres on the front */}
          <rect x="10" y="30" width="14" height="8" rx="1" fill="#B4BEC6"/>
          {[0,1,2,3].map(i=><line key={i} x1="11" y1={31.5+i*1.7} x2="23" y2={31.5+i*1.7} stroke="#9AA6AE" strokeWidth=".5"/>)}
          <rect x="46" y="30" width="14" height="8" rx="1" fill="#B4BEC6"/>
          {[0,1,2,3].map(i=><line key={'r'+i} x1="47" y1={31.5+i*1.7} x2="59" y2={31.5+i*1.7} stroke="#9AA6AE" strokeWidth=".5"/>)}
          {/* deep circular bore — concentric rings for depth + lit aperture */}
          <ellipse cx="35" cy="21" rx="15" ry="15" fill="#AEB8C0" stroke={C} strokeWidth=".7"/>
          <ellipse cx="35" cy="21" rx="12" ry="12" fill="#8A96A0"/>
          <ellipse cx="35" cy="21" rx="9" ry="9" fill="#3A434C"/>
          <ellipse cx="35" cy="21" rx="6.5" ry="6.5" fill="#1B2128"/>
          <ellipse cx="35" cy="21" rx="6.5" ry="6.5" fill="none" stroke="#3B82F6" strokeWidth=".8" opacity=".8"/>{/* aperture light */}
          <ellipse cx="35" cy="14.5" rx="8" ry="1.8" fill="#60A5FA" opacity=".5"/>{/* ring glow */}
          {/* patient table sliding out toward the viewer, into the bore (NPC-sized) */}
          <rect x="29" y="21" width="12" height="28" rx="1.5" fill="#B7C0C8" stroke={C} strokeWidth=".6"/>
          <rect x="30.5" y="24" width="9" height="23" fill="#D2D9DE"/>
          <rect x="31.5" y="42" width="7" height="3.5" fill="#9FB6C8"/>{/* head coil */}
          {/* blue magnet-safety zone floor line */}
          <rect x="4" y="44" width="62" height="1.6" fill="#3B82F6" opacity=".4"/>
          <text x="35" y="45.3" fontSize="2.4" fill="#1E3A8A" textAnchor="middle" fontFamily="monospace">⚠ MAGNET ON</text>
        </svg>
      </div>
    );
  }

  // ─── XrayUnit — 천장형 X선 튜브 암 + 벽 부착 버키 (Bucky) ────────────
  function XrayUnit({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 8, width: T * 2.6, height: T * 2.8 }}>
        <svg viewBox="0 0 42 44" width={T * 2.6} height={T * 2.8} shapeRendering="geometricPrecision">
          <ellipse cx="21" cy="42" rx="16" ry="2.2" fill="rgba(0,0,0,.16)"/>
          {/* ── patient exam table: big TOP face + short front (dominant footprint) ── */}
          <path d="M3 18 L33 18 L33 36 Q33 38 31 38 L5 38 Q3 38 3 36 Z" fill="#C7D0D8" stroke={C} strokeWidth=".8"/>
          <rect x="4" y="19.5" width="28" height="14" rx="2" fill="#E1E7EC"/>{/* pad top */}
          <rect x="6" y="21" width="24" height="2" fill="#D2DAE0"/>
          <line x1="3" y1="33.5" x2="33" y2="33.5" stroke={C} strokeWidth=".5"/>{/* top↔front seam */}
          {/* pedestal */}
          <rect x="15" y="38" width="6" height="3" fill="#8A929B"/>
          {/* ── overhead tube on a ceiling rail, with a small TOP face ── */}
          <rect x="6" y="0" width="30" height="2.4" fill="#9CA3AF" stroke={C} strokeWidth=".4"/>{/* rail */}
          <rect x="18" y="2.4" width="2.4" height="6" fill="#B7BEC6" stroke={C} strokeWidth=".3"/>{/* column */}
          <rect x="12" y="8" width="14" height="4" fill="#727E8C" stroke={C} strokeWidth=".5"/>{/* tube TOP face */}
          <path d="M12 12 L26 12 L25 16 L13 16 Z" fill="#5B6672" stroke={C} strokeWidth=".5"/>{/* tube front */}
          <rect x="17" y="16" width="4" height="2.2" fill="#374151"/>{/* collimator */}
          <path d="M18 18 L15 24 M20 18 L23 24" stroke="#FBBF24" strokeWidth=".5" opacity=".45"/>{/* beam */}
          {/* wall Bucky detector panel (right) */}
          <rect x="35" y="12" width="5" height="22" rx="1" fill="#AEB6BE" stroke={C} strokeWidth=".5"/>
          <rect x="34" y="18" width="7" height="9" rx="1" fill="#E1E7EC" stroke={C} strokeWidth=".5"/>
        </svg>
      </div>
    );
  }

  // ─── ControlConsole — 촬영 제어 콘솔 (납유리 차폐창 + 듀얼 모니터) ────
  function ControlConsole({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 6, width: T * 2.4, height: T * 2 }}>
        <svg viewBox="0 0 38 32" width={T * 2.4} height={T * 2} shapeRendering="geometricPrecision">
          <rect x={2} y={26} width={34} height="4" rx="1.5" fill="rgba(0,0,0,.16)"/>
          {/* desk TOP + short front */}
          <path d="M2 12 L36 12 L36 26 Q36 27 35 27 L3 27 Q2 27 2 26 Z" fill="#9BA2AB" stroke={C} strokeWidth=".6"/>
          <rect x="2" y="12" width="34" height="4" fill="#B0B7BF"/>
          {/* leaded-glass shielding window rising at the back */}
          <rect x="2" y="1" width="34" height="11" rx="1" fill="#BFE0EA" fillOpacity=".55" stroke={C} strokeWidth=".6"/>
          <line x1="13" y1="1" x2="13" y2="12" stroke={C} strokeWidth=".4" opacity=".5"/>
          <line x1="25" y1="1" x2="25" y2="12" stroke={C} strokeWidth=".4" opacity=".5"/>
          <rect x="3" y="2.5" width="10" height="2.5" fill="#FFFFFF" opacity=".35"/>{/* glare */}
          {/* dual monitors on the desk facing the operator (viewer) */}
          <rect x="6" y="13.5" width="10" height="7" fill="#111827" stroke={C} strokeWidth=".5"/>
          <rect x="7" y="14.5" width="8" height="5" fill="#0B1A22"/>
          <rect x="8" y="15.4" width="6" height="1" fill="#22D3EE"/>
          <rect x="22" y="13.5" width="10" height="7" fill="#111827" stroke={C} strokeWidth=".5"/>
          <rect x="23" y="14.5" width="8" height="5" fill="#0B1220"/>
          <rect x="24" y="15.4" width="4" height="3" fill="#9FB6C8"/>{/* bone image */}
          {/* keyboard + expose button (front) */}
          <rect x="12" y="22" width="14" height="2.6" rx=".5" fill="#B7BEC6" stroke={C} strokeWidth=".4"/>
          <circle cx="30" cy="23" r="1.6" fill="#DC2626" stroke={C} strokeWidth=".4"/>
        </svg>
      </div>
    );
  }

  // ─── LeadApronRack — 납 방호복 걸이대 ──────────────────────────────
  function LeadApronRack({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 4, width: T * 1.4, height: T * 1.9 }}>
        <svg viewBox="0 0 22 30" width={T * 1.4} height={T * 1.9} shapeRendering="geometricPrecision">
          <ellipse cx="11" cy="28.5" rx="8" ry="2" fill="rgba(0,0,0,.16)"/>
          {/* rail */}
          <rect x="2" y="2" width="18" height="2" rx="1" fill="#9CA3AF" stroke={C} strokeWidth=".4"/>
          <rect x="4" y="0.5" width="1.4" height="27" fill="#B7BEC6"/>
          <rect x="16.6" y="0.5" width="1.4" height="27" fill="#B7BEC6"/>
          {/* two hanging lead aprons (rounded shoulders + long body) */}
          <path d="M5 4 Q8 3 11 4 L11.5 18 Q8 20 4.5 18 Z" fill="#3E6FA0" stroke={C} strokeWidth=".5"/>
          <path d="M6 6 L10 6" stroke="#5A8AC0" strokeWidth=".6"/>
          <path d="M11.5 4 Q14.5 3 17.5 4 L18 16 Q14.5 18 11 16 Z" fill="#5B7C4A" stroke={C} strokeWidth=".5"/>
          <path d="M12.5 6 L16.5 6" stroke="#7BA45E" strokeWidth=".6"/>
          <ellipse cx="11" cy="26.5" rx="6" ry="1.4" fill="#6B7280"/>{/* base */}
        </svg>
      </div>
    );
  }

  Object.assign(window, {
    CTScanner, MRIScanner, XrayUnit, ControlConsole, LeadApronRack,
  });
})();
