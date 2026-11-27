// interior-objects-endo2.jsx — 내시경실 Endoscopy Suite objects.
// Procedure towers, scope reprocessor, hanging scope storage. v2 top-down,
// single silhouette, ground-contact ellipse shadow.

(function () {
  const C = '#2A2522';
  const T = window.ITILE || 16;

  // ─── EndoTower — 내시경 타워 (모니터 + 광원 + 프로세서 + CO2) ────────
  function EndoTower({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 18, width: T * 1.6, height: T * 3.4 }}>
        <svg viewBox="0 0 26 54" width={T * 1.6} height={T * 3.4} shapeRendering="geometricPrecision">
          <ellipse cx="13" cy="52" rx="9" ry="2.2" fill="rgba(0,0,0,.16)"/>
          {/* top endoscopic monitor (viewer-facing) */}
          <rect x="1" y="0" width="24" height="16" rx="1" fill="#111827" stroke={C} strokeWidth=".6"/>
          <rect x="2.5" y="1.5" width="21" height="13" fill="#2A0E10"/>
          <ellipse cx="13" cy="8" rx="8" ry="5.5" fill="#8B2E2E"/>{/* mucosa view */}
          <ellipse cx="10" cy="7.5" rx="3" ry="3.8" fill="#B54B4B"/>
          <ellipse cx="10" cy="7.5" rx="1.2" ry="1.6" fill="#3A1010"/>{/* lumen */}
          {/* tower cabinet: top cap + continuous front stack */}
          <path d="M3 17 L23 17 L23 49 Q23 50 22 50 L4 50 Q3 50 3 49 Z" fill="#8E99A4" stroke={C} strokeWidth=".6"/>
          <rect x="3" y="17" width="20" height="2.4" fill="#AEB6BE"/>
          {/* light source module */}
          <rect x="4" y="20" width="18" height="6" fill="#5B6672" stroke={C} strokeWidth=".4"/>
          <circle cx="8" cy="23" r="1.8" fill="#A7F3D0"/>{/* xenon lamp glow */}
          <rect x="12" y="21.5" width="8" height="3" fill="#0F1A24"/>
          {/* video processor */}
          <rect x="4" y="27" width="18" height="6" fill="#475569" stroke={C} strokeWidth=".4"/>
          <rect x="5" y="28.5" width="8" height="3" fill="#0F1A24"/>
          <rect x="5.6" y="29.4" width="5" height="1" fill="#22D3EE"/>
          {/* CO2 insufflator + water pump */}
          <rect x="4" y="34" width="18" height="5" fill="#5B6672" stroke={C} strokeWidth=".4"/>
          <text x="9" y="37.8" fontSize="2.6" fill="#FBBF24" fontFamily="monospace">CO₂</text>
          <circle cx="18" cy="36.5" r="1.6" fill="#CBD5E1"/>
          {/* keyboard shelf */}
          <rect x="4" y="40" width="18" height="4" fill="#B7BEC6" stroke={C} strokeWidth=".4"/>
          {/* casters */}
          <ellipse cx="6" cy="50" rx="2" ry="1.4" fill={C}/>
          <ellipse cx="20" cy="50" rx="2" ry="1.4" fill={C}/>
        </svg>
      </div>
    );
  }

  // ─── ScopeWasher — 내시경 자동 세척·재처리기 (AER, 원형 세척조) ──────
  function ScopeWasher({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 4, width: T * 2.2, height: T * 1.9 }}>
        <svg viewBox="0 0 36 30" width={T * 2.2} height={T * 1.9} shapeRendering="geometricPrecision">
          <ellipse cx="18" cy="24.5" rx="15" ry="2.2" fill="rgba(0,0,0,.16)"/>
          {/* machine body: big top face + short front */}
          <path d="M2 6 L34 6 L34 24 Q34 25 33 25 L3 25 Q2 25 2 24 Z" fill="#B0B7BF" stroke={C} strokeWidth=".6"/>
          <rect x="2" y="6" width="32" height="3" fill="#C7CDD4"/>
          {/* two round wash basins on the top (coiled scope inside) */}
          <ellipse cx="11" cy="13" rx="7.5" ry="4.5" fill="#8A929B" stroke={C} strokeWidth=".5"/>
          <ellipse cx="11" cy="12.5" rx="5.5" ry="3" fill="#3E6470"/>
          <path d="M8 12 Q11 10 14 12 Q12 14 10 13 Q9 12 8 12 Z" fill="none" stroke="#CBD5E1" strokeWidth="1"/>{/* coiled scope */}
          <ellipse cx="26" cy="13" rx="7.5" ry="4.5" fill="#8A929B" stroke={C} strokeWidth=".5"/>
          <ellipse cx="26" cy="12.5" rx="5.5" ry="3" fill="#3E6470"/>
          {/* viewer-facing control panel on the front band */}
          <line x1="2" y1="19" x2="34" y2="19" stroke={C} strokeWidth=".4"/>
          <rect x="5" y="20.5" width="10" height="3" fill="#0F1A24"/>
          <rect x="5.6" y="21.4" width="6" height="1" fill="#22D3EE"/>
          <circle cx="28" cy="22" r="1.8" fill="#10B981" stroke={C} strokeWidth=".4"/>
        </svg>
      </div>
    );
  }

  // ─── ScopeCabinet — 내시경 수직 걸이 보관장 (유리문) ────────────────
  function ScopeCabinet({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 6, width: T * 1.6, height: T * 2.2 }}>
        <svg viewBox="0 0 26 36" width={T * 1.6} height={T * 2.2} shapeRendering="geometricPrecision">
          <ellipse cx="13" cy="34.5" rx="10" ry="2" fill="rgba(0,0,0,.14)"/>
          {/* cabinet top + continuous front */}
          <path d="M2 6 L24 6 L24 32 Q24 33 23 33 L3 33 Q2 33 2 32 Z" fill="#CBD5DD" stroke={C} strokeWidth=".6"/>
          <rect x="2" y="3" width="22" height="3" fill="#B7C0C8"/>
          {/* glass door showing hanging scopes (vertical) */}
          <rect x="3.5" y="7.5" width="19" height="24" rx="1" fill="#CFE6EE" fillOpacity=".55" stroke={C} strokeWidth=".5"/>
          {[7,12,17].map((sx,i)=>(<g key={i}>
            <circle cx={sx} cy="10" r="1.3" fill="#5B6672"/>{/* control head */}
            <path d={`M${sx} 11 Q${sx+2} 20 ${sx-1} 29`} fill="none" stroke="#8A929B" strokeWidth="1.4"/>{/* insertion tube */}
          </g>))}
          {/* door handle + HEPA vent */}
          <rect x="21" y="17" width="1.2" height="7" fill="#6E7A86"/>
          <rect x="4" y="1" width="8" height="1.6" fill="#9CA3AF"/>
        </svg>
      </div>
    );
  }

  // ─── ProcedureBed — 전동 시술 베드 (측와위, 머리 받침) ──────────────
  function ProcedureBed({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 2, width: T * 3, height: T * 1.9 }}>
        <svg viewBox="0 0 48 30" width={T * 3} height={T * 1.9} shapeRendering="geometricPrecision">
          <ellipse cx="24" cy="28" rx="20" ry="2.2" fill="rgba(0,0,0,.16)"/>
          {/* mattress top face + short front */}
          <path d="M3 5 L45 5 L45 23 Q45 24 44 24 L4 24 Q3 24 3 23 Z" fill="#4F7C8A" stroke={C} strokeWidth=".6"/>
          <rect x="3" y="5" width="42" height="13" fill="#6E9DAB"/>{/* pad */}
          {/* head pillow (left) + lateral-position wedge */}
          <rect x="5" y="6.5" width="9" height="10" rx="2" fill="#8FB8C4"/>
          <rect x="30" y="7" width="12" height="9" rx="1.5" fill="#5E8A98" opacity=".7"/>{/* wedge */}
          <line x1="3" y1="18" x2="45" y2="18" stroke={C} strokeWidth=".4"/>
          {/* side rails + electric base */}
          <rect x="8" y="4" width="14" height="1.4" rx=".7" fill="#9CA3AF"/>
          <rect x="14" y="24" width="20" height="4" fill="#9CA3AF" stroke={C} strokeWidth=".4"/>
          <rect x="10" y="25.5" width="4" height="2.4" fill="#FBBF24"/>{/* pedal */}
        </svg>
      </div>
    );
  }

  Object.assign(window, {
    EndoTower, ScopeWasher, ScopeCabinet, ProcedureBed,
  });
})();
