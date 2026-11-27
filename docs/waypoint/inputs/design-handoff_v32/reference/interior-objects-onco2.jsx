// interior-objects-onco2.jsx — Oncology ward & BMT (조혈모세포 이식) objects.
// Distinct from the ward pattern: chemo infusion bay + positive-pressure HEPA
// isolation. v2 top-down, single silhouette, ground-contact ellipse shadow.

(function () {
  const C = '#2A2522';
  const T = window.ITILE || 16;

  // ─── InfusionChair — 항암 주입 리클라이너 (넓은 팔걸이 + 링거 트레이) ─
  function InfusionChair({ x, y, occupied }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 4, width: T * 2.6, height: T * 3.4 }}>
        <svg viewBox="0 0 42 54" width={T * 2.6} height={T * 3.4} shapeRendering="geometricPrecision">
          <ellipse cx="21" cy="52" rx="16" ry="2.4" fill="rgba(0,0,0,.16)"/>
          {/* extended footrest nearest the viewer */}
          <path d="M8 40 L34 40 L33 49 Q33 50 32 50 L10 50 Q9 50 9 49 Z" fill="#3E6470" stroke={C} strokeWidth=".7"/>
          <rect x="10" y="41.5" width="22" height="7" rx="2" fill="#5B8593"/>
          {/* seat cushion (big top face) */}
          <path d="M5 20 L37 20 L37 40 L5 40 Z" fill="#4F7C8A" stroke={C} strokeWidth=".7"/>
          <rect x="7" y="22" width="28" height="16" rx="2.5" fill="#6E9DAB"/>
          <path d="M21 22 L21 38" stroke="#5B8A99" strokeWidth=".5"/>{/* cushion seam */}
          {/* tall reclined backrest + headrest at the head (top) */}
          <path d="M5 2 L37 2 Q38 2 38 3 L38 20 L4 20 L4 3 Q4 2 5 2 Z" fill="#4F7C8A" stroke={C} strokeWidth=".7"/>
          <rect x="7" y="4" width="28" height="14" rx="3" fill="#6E9DAB"/>
          <rect x="13" y="3" width="16" height="4.5" rx="2" fill="#89B4C0"/>{/* headrest */}
          {/* wide padded armrests down both sides */}
          <path d="M0.5 20 L5 20 L5 42 Q5 43 4 43 L1.5 43 Q0.5 43 0.5 42 Z" fill="#37525C" stroke={C} strokeWidth=".6"/>
          <path d="M37 20 L41.5 20 L41.5 42 Q41.5 43 40.5 43 L38 43 Q37 43 37 42 Z" fill="#37525C" stroke={C} strokeWidth=".6"/>
          <rect x="1.4" y="22" width="3" height="16" rx="1.2" fill="#48697A"/>
          <rect x="37.6" y="22" width="3" height="16" rx="1.2" fill="#48697A"/>
          {/* seated patient: head on headrest, torso, warm blanket over the lap */}
          {occupied && (
            <g>
              <rect x="17" y="6" width="8" height="7" rx="3" fill="#FBD9C0" stroke={C} strokeWidth=".3"/>{/* head */}
              <rect x="17.3" y="5.1" width="7.4" height="1.6" fill="#5B4636"/>{/* hair */}
              <path d="M14 20 L28 20 L26 34 L16 34 Z" fill="#8FB6C2" stroke={C} strokeWidth=".4"/>{/* torso/gown */}
              <rect x="10" y="30" width="22" height="12" rx="2.5" fill="#DDE9C8" stroke={C} strokeWidth=".4"/>{/* lap blanket */}
              <path d="M10 35 L32 35 M10 38.5 L32 38.5" stroke="#C2D3A8" strokeWidth=".5"/>
              {/* IV line into the arm */}
              <path d="M28 24 Q36 22 39 24" fill="none" stroke="#C0392B" strokeWidth=".6"/>
            </g>
          )}
        </svg>
      </div>
    );
  }

  // ─── SmartInfusionPump — 스마트 인퓨전 펌프 (항암 이중 채널 + 폴대) ──
  function SmartInfusionPump({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 20, width: T, height: T * 3 }}>
        <svg viewBox="0 0 16 48" width={T} height={T * 3} shapeRendering="geometricPrecision">
          <ellipse cx="8" cy="46.5" rx="6" ry="1.9" fill="rgba(0,0,0,.16)"/>
          {/* two chemo bags (amber + clear) on the hook */}
          <rect x="4" y="0" width="8" height="1.2" fill="#9CA3AF"/>
          <rect x="3" y="1.2" width="4.5" height="7" rx="1" fill="#F4C77A" stroke={C} strokeWidth=".4"/>{/* chemo */}
          <rect x="8.5" y="1.2" width="4.5" height="7" rx="1" fill="#CFE6EE" stroke={C} strokeWidth=".4"/>
          {/* purple chemo-hazard label on the amber bag */}
          <rect x="3.6" y="3" width="3.3" height="1.6" fill="#7C3AED"/>
          {/* dual-channel pump module, viewer-facing screen */}
          <rect x="2" y="10" width="12" height="12" rx="1" fill="#475569" stroke={C} strokeWidth=".5"/>
          <rect x="3" y="11" width="10" height="4.5" fill="#0F1A24"/>
          <rect x="3.6" y="12" width="6" height="1" fill="#A78BFA"/>
          <rect x="3.6" y="13.6" width="8" height="1" fill="#22D3EE"/>
          <rect x="3" y="16.5" width="4.5" height="4" fill="#5B6672"/>{/* channel A */}
          <rect x="8.5" y="16.5" width="4.5" height="4" fill="#5B6672"/>{/* channel B */}
          {/* pole + wheel base */}
          <rect x="7" y="22" width="2" height="20" fill="#CBD5E1" stroke={C} strokeWidth=".3"/>
          <ellipse cx="8" cy="43" rx="5.5" ry="1.8" fill="#6B7280" stroke={C} strokeWidth=".4"/>
        </svg>
      </div>
    );
  }

  // ─── BMTPod — 무균 양압 이식실 유닛 (전실 + HEPA 헤더 + 유리 격리) ────
  function BMTPod({ x, y, w = 6 }) {
    const px = w * T;
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 6, width: px, height: T * 2 }}>
        <svg viewBox={`0 0 ${w*16} 32`} width={px} height={T * 2} shapeRendering="geometricPrecision" preserveAspectRatio="none">
          {/* HEPA supply header spanning the top (positive pressure ↓) */}
          <rect x="0" y="0" width={w*16} height="6" fill="#6B7280" stroke={C} strokeWidth=".6"/>
          {[...Array(w)].map((_,i)=><rect key={i} x={4+i*16} y="1.6" width="8" height="2.8" fill="#9CA3AF"/>)}
          <text x={w*8} y="4.4" fontSize="3" fill="#A7F3D0" textAnchor="middle" fontFamily="monospace">↓ HEPA POSITIVE PRESSURE</text>
          {/* magnehelic pressure gauge on the header */}
          <circle cx={w*16-8} cy="3" r="2.2" fill="#fff" stroke={C} strokeWidth=".4"/>
          <line x1={w*16-8} y1="3" x2={w*16-6.6} y2="1.8" stroke="#DC2626" strokeWidth=".4"/>
        </svg>
      </div>
    );
  }

  // ─── ChemoHazardBin — 항암 폐기물 전용통 (보라 라벨) ────────────────
  function ChemoHazardBin({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T + 3, top: y * T + 1, width: T - 6, height: T * 1.2 }}>
        <svg viewBox="0 0 10 14" width={T - 6} height={T * 1.2} shapeRendering="geometricPrecision">
          <ellipse cx="5" cy="13" rx="3.6" ry="1.6" fill="rgba(0,0,0,.16)"/>
          {/* lid top + continuous body */}
          <ellipse cx="5" cy="3" rx="4" ry="1.5" fill="#8B5CF6" stroke={C} strokeWidth=".4"/>
          <path d="M1 3 L9 3 L8.3 12 Q8.3 12.6 7.7 12.6 L2.3 12.6 Q1.7 12.6 1.7 12 Z" fill="#7C3AED" stroke={C} strokeWidth=".5"/>
          <path d="M2.6 3 L7.4 3 L7 12 L3 12 Z" fill="#8B5CF6"/>
          <path d="M5 5.5 L6.4 7 L5 8.5 L3.6 7 Z" fill="#fff"/>
          <text x="5" y="7.6" fontSize="2.2" fill="#5B21B6" textAnchor="middle" fontFamily="monospace">☣</text>
          <text x="5" y="11" fontSize="1.7" fill="#EDE9FE" textAnchor="middle" fontFamily="monospace">CHEMO</text>
        </svg>
      </div>
    );
  }

  // ─── PPEStation — 이식실 전실 방호구 스테이션 (가운·마스크·장갑 걸이) ─
  function PPEStation({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T, width: T * 1.6, height: T * 1.5 }}>
        <svg viewBox="0 0 26 24" width={T * 1.6} height={T * 1.5} shapeRendering="geometricPrecision">
          <ellipse cx="13" cy="22.5" rx="9" ry="1.8" fill="rgba(0,0,0,.14)"/>
          {/* wall board */}
          <rect x="1" y="1" width="24" height="20" rx="1" fill="#DCE3E8" stroke={C} strokeWidth=".6"/>
          {/* gown on a hook */}
          <path d="M4 4 L10 4 L11 14 L3 14 Z" fill="#FEF3C7" stroke={C} strokeWidth=".4"/>
          <rect x="6" y="3" width="2" height="1.5" fill="#9CA3AF"/>
          {/* mask + glove boxes */}
          <rect x="13" y="4" width="10" height="4" fill="#A5D8E8" stroke={C} strokeWidth=".4"/>
          <rect x="13" y="9" width="10" height="4" fill="#BFE0EA" stroke={C} strokeWidth=".4"/>
          <rect x="13" y="14" width="10" height="4" fill="#F9C9D6" stroke={C} strokeWidth=".4"/>
          <rect x="14.5" y="4.8" width="4" height="1.2" fill="#fff"/>
          <rect x="14.5" y="9.8" width="4" height="1.2" fill="#fff"/>
          <rect x="14.5" y="14.8" width="4" height="1.2" fill="#fff"/>
        </svg>
      </div>
    );
  }

  Object.assign(window, {
    InfusionChair, SmartInfusionPump, BMTPod, ChemoHazardBin, PPEStation,
  });
})();
