// interior-objects-er.jsx — ER-specific 2.5D objects, all v2 style.
// Each object shows visible TOP + FRONT + side depth — viewed from 45° above.
// Coordinates are tile-based; SVG content is hand-drawn pixel art.

(function () {
  const C = '#2A2522';
  const T = window.ITILE || 16;

  // ─── Gurney v2 — mobile patient stretcher ─────────────────────────
  function Gurney({ x, y, occupied }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 4, width: T * 2, height: T * 3 + 8, filter: 'drop-shadow(3px 4px 0 rgba(0,0,0,.3))' }}>
        <svg viewBox="0 0 32 56" width={T * 2} height={T * 3 + 8} shapeRendering="crispEdges">
          {/* hand rails (top) */}
          <rect x="3" y="1" width="26" height="2" fill="#94A3B8" stroke={C} strokeWidth=".4"/>
          <rect x="3" y="1" width="2" height="9" fill="#94A3B8" stroke={C} strokeWidth=".4"/>
          <rect x="27" y="1" width="2" height="9" fill="#94A3B8" stroke={C} strokeWidth=".4"/>
          {/* mattress TOP */}
          <rect x="2" y="10" width="28" height="30" fill="#FFFFFF" stroke={C} strokeWidth=".5"/>
          <rect x="2.5" y="10.5" width="27" height="1.5" fill="#F3F4F6"/>
          {/* pillow — pixel-art block (no stretched-ellipse look) */}
          {/* main body */}
          <rect x="8"   y="13" width="16" height="4.5" fill="#F8FAFC"/>
          {/* rounded corner pixels — chip top corners */}
          <rect x="8"   y="13" width="1.2" height="1" fill="#FFFFFF" opacity="0"/>
          <rect x="22.8" y="13" width="1.2" height="1" fill="#FFFFFF" opacity="0"/>
          <rect x="7.5" y="14" width="0.7" height="2.5" fill="#F8FAFC"/>
          <rect x="23.8" y="14" width="0.7" height="2.5" fill="#F8FAFC"/>
          {/* top highlight (catches light) */}
          <rect x="9"   y="13.5" width="14" height="0.8" fill="#FFFFFF"/>
          {/* soft inner shadow underside */}
          <rect x="8"   y="16.3" width="16" height="1.2" fill="#E8ECF1"/>
          {/* seam down middle (subtle, no outline) */}
          <rect x="15.7" y="14" width="0.5" height="3" fill="#D8DEE6" opacity=".55"/>
          {/* sheet folds */}
          <line x1="9" y1="19" x2="9" y2="38" stroke="#C4C4C4" strokeWidth=".3" opacity=".5"/>
          <line x1="23" y1="19" x2="23" y2="38" stroke="#C4C4C4" strokeWidth=".3" opacity=".5"/>
          {/* mattress FRONT thickness */}
          <rect x="2" y="40" width="28" height="3" fill="#E5E7EB" stroke={C} strokeWidth=".5"/>
          {/* frame */}
          <rect x="2" y="43" width="28" height="3" fill="#4B5563" stroke={C} strokeWidth=".5"/>
          <rect x="2.5" y="43.5" width="27" height="1" fill="#6B7280"/>
          {/* wheel posts */}
          <rect x="3" y="46" width="3" height="4" fill="#1F2937" stroke={C} strokeWidth=".4"/>
          <rect x="26" y="46" width="3" height="4" fill="#1F2937" stroke={C} strokeWidth=".4"/>
          <ellipse cx="4.5" cy="52" rx="2.5" ry="2" fill={C}/>
          <ellipse cx="27.5" cy="52" rx="2.5" ry="2" fill={C}/>
          {/* IV pole left */}
          <rect x="0" y="2" width="1.5" height="42" fill="#9CA3AF" stroke={C} strokeWidth=".3"/>
          <rect x="-1" y="2" width="4" height="5" fill="#A8DCEC" stroke={C} strokeWidth=".3"/>
          {occupied && (
            <>
              <ellipse cx="16" cy="17" rx="3.5" ry="3.5" fill="#FDE1C8" stroke={C} strokeWidth=".5"/>
              <rect x="14" y="13.5" width="4" height="2" fill="#6B4423"/>
              <rect x="6" y="22" width="20" height="18" fill="#FED7AA" stroke={C} strokeWidth=".4"/>
              <line x1="6" y1="26" x2="26" y2="26" stroke="#E0A876" strokeWidth=".5"/>
            </>
          )}
        </svg>
      </div>
    );
  }

  // ─── Defib v2 — yellow cart with paddles + screen ─────────────────
  function Defib({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T, width: T, height: T * 2.5, filter: 'drop-shadow(3px 4px 0 rgba(0,0,0,.3))' }}>
        <svg viewBox="0 0 20 40" width={T} height={T * 2.5} shapeRendering="crispEdges">
          {/* paddles on top */}
          <rect x="2" y="0" width="6" height="3" fill="#F59E0B" stroke={C} strokeWidth=".4"/>
          <rect x="3" y=".5" width="4" height="1" fill="#FBBF24"/>
          <rect x="12" y="0" width="6" height="3" fill="#F59E0B" stroke={C} strokeWidth=".4"/>
          <rect x="13" y=".5" width="4" height="1" fill="#FBBF24"/>
          {/* top face */}
          <path d="M 2 3 L 18 3 L 19 5 L 1 5 Z" fill="#FACC15" stroke={C} strokeWidth=".4"/>
          {/* body */}
          <rect x="1" y="5" width="18" height="15" fill="#FACC15" stroke={C} strokeWidth=".5"/>
          <rect x="1.5" y="5.5" width="17" height="1.5" fill="#FEF08A"/>
          {/* screen */}
          <rect x="3" y="7" width="14" height="8" fill="#0F1A24" stroke={C} strokeWidth=".4"/>
          <path d="M 4 11 L 6 11 L 7 8 L 8 14 L 9 9 L 10 11 L 14 11" fill="none" stroke="#10B981" strokeWidth=".7"/>
          {/* buttons */}
          <rect x="3" y="16" width="4" height="2" fill="#1F2937" stroke={C} strokeWidth=".3"/>
          <rect x="8" y="16" width="4" height="2" fill="#DC2626" stroke={C} strokeWidth=".3"/>
          <rect x="13" y="16" width="4" height="2" fill="#10B981" stroke={C} strokeWidth=".3"/>
          {/* cart bottom */}
          <path d="M 1 20 L 19 20 L 20 22 L 0 22 Z" fill="#9CA3AF" stroke={C} strokeWidth=".4"/>
          <rect x="1" y="22" width="18" height="13" fill="#94A3B8" stroke={C} strokeWidth=".4"/>
          <rect x="2" y="24" width="16" height="3" fill="#fff" stroke={C} strokeWidth=".3"/>
          <rect x="2" y="28" width="16" height="3" fill="#fff" stroke={C} strokeWidth=".3"/>
          <ellipse cx="3" cy="38" rx="2" ry="1.5" fill={C}/>
          <ellipse cx="17" cy="38" rx="2" ry="1.5" fill={C}/>
        </svg>
      </div>
    );
  }

  // ─── Oxygen Tank v2 — green cylinder with valve ───────────────────
  function OxygenTank({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T + 2, top: y * T - 2, width: T - 4, height: T + 4, filter: 'drop-shadow(2px 3px 0 rgba(0,0,0,.28))' }}>
        <svg viewBox="0 0 12 20" width={T - 4} height={T + 4} shapeRendering="crispEdges">
          {/* valve top */}
          <rect x="4" y="0" width="4" height="2" fill="#94A3B8" stroke={C} strokeWidth=".3"/>
          <rect x="3" y="2" width="6" height="1" fill="#9CA3AF" stroke={C} strokeWidth=".3"/>
          {/* top dome (3D) */}
          <ellipse cx="6" cy="4" rx="4" ry="1.5" fill="#15803D" stroke={C} strokeWidth=".4"/>
          <ellipse cx="6" cy="3.5" rx="3" ry="1" fill="#22C55E"/>
          {/* body */}
          <rect x="2" y="4" width="8" height="13" fill="#16A34A" stroke={C} strokeWidth=".4"/>
          <rect x="2.5" y="5" width="1.5" height="11" fill="#22C55E"/>
          {/* O2 label */}
          <rect x="3" y="9" width="6" height="4" fill="#fff" stroke={C} strokeWidth=".3"/>
          <text x="6" y="12.3" fontSize="2.5" fill={C} textAnchor="middle" fontFamily="monospace">O₂</text>
          {/* base */}
          <ellipse cx="6" cy="17" rx="4" ry="1.5" fill="#15803D" stroke={C} strokeWidth=".4"/>
        </svg>
      </div>
    );
  }

  // ─── Glove Dispenser v2 — wall-mount with peeking glove ──────────
  function GloveDispenser({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T + 2, top: y * T, width: T - 4, height: T - 2, filter: 'drop-shadow(2px 2px 0 rgba(0,0,0,.25))' }}>
        <svg viewBox="0 0 12 14" width={T - 4} height={T - 2} shapeRendering="crispEdges">
          {/* top face */}
          <path d="M 1 1 L 11 1 L 12 2.5 L 0 2.5 Z" fill="#94A3B8" stroke={C} strokeWidth=".3"/>
          {/* body */}
          <rect x="1" y="2" width="10" height="9" fill="#fff" stroke={C} strokeWidth=".4"/>
          <rect x="1" y="2" width="10" height="1.5" fill="#3B82F6"/>
          {/* glass window */}
          <rect x="2" y="4" width="8" height="5" fill="#A8DCEC" stroke={C} strokeWidth=".3"/>
          <rect x="2.5" y="4.5" width="7" height=".8" fill="#D4F0F8"/>
          {/* glove peeking out */}
          <path d="M 3.5 8 L 8.5 8 L 7.5 12 L 4.5 12 Z" fill="#3B82F6" stroke={C} strokeWidth=".3"/>
          <rect x="3.5" y="11.5" width="5" height=".8" fill="#1E40AF"/>
        </svg>
      </div>
    );
  }

  // ─── Sharps Container v2 — red bin with biohazard ────────────────
  function SharpsContainer({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T + 2, top: y * T, width: T - 4, height: T, filter: 'drop-shadow(2px 2px 0 rgba(0,0,0,.28))' }}>
        <svg viewBox="0 0 12 14" width={T - 4} height={T} shapeRendering="crispEdges">
          {/* yellow lid top face */}
          <path d="M 1 1 L 11 1 L 12 3 L 0 3 Z" fill="#FACC15" stroke={C} strokeWidth=".4"/>
          {/* lid slot */}
          <rect x="3" y="1.5" width="6" height=".8" fill={C}/>
          {/* body */}
          <rect x="1" y="3" width="10" height="10" fill="#DC2626" stroke={C} strokeWidth=".5"/>
          <rect x="1.5" y="3.5" width="1.5" height="9" fill="#F87171"/>
          {/* biohazard sticker */}
          <rect x="3" y="6" width="6" height="5" fill="#fff" stroke={C} strokeWidth=".3"/>
          <text x="6" y="9.5" fontSize="3" fill={C} textAnchor="middle" fontFamily="monospace">☣</text>
        </svg>
      </div>
    );
  }

  // ─── Hand Sanitizer v2 — wall pump ────────────────────────────────
  function HandSanitizer({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T + 4, top: y * T, width: T - 8, height: T - 4, filter: 'drop-shadow(1.5px 2px 0 rgba(0,0,0,.22))' }}>
        <svg viewBox="0 0 8 12" width={T - 8} height={T - 4} shapeRendering="crispEdges">
          {/* pump top */}
          <rect x="3" y="0" width="2" height="2" fill="#fff" stroke={C} strokeWidth=".3"/>
          <rect x="2" y="2" width="4" height="1" fill="#9CA3AF" stroke={C} strokeWidth=".3"/>
          {/* top face */}
          <path d="M 1 3 L 7 3 L 7.5 4 L .5 4 Z" fill="#7DBFD9" stroke={C} strokeWidth=".3"/>
          {/* bottle body */}
          <rect x="1" y="4" width="6" height="7" fill="#A8DCEC" stroke={C} strokeWidth=".3"/>
          <rect x="1.5" y="4.5" width="1" height="6" fill="#D4F0F8"/>
          {/* fluid label */}
          <rect x="2" y="7" width="4" height="2" fill="#fff" stroke={C} strokeWidth=".2"/>
          <line x1="2.5" y1="7.7" x2="5.5" y2="7.7" stroke={C} strokeWidth=".2"/>
        </svg>
      </div>
    );
  }

  // ─── EKG v2 — ECG machine on cart ─────────────────────────────────
  function EKG({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 2, width: T, height: T * 2.2, filter: 'drop-shadow(2px 3px 0 rgba(0,0,0,.28))' }}>
        <svg viewBox="0 0 16 36" width={T} height={T * 2.2} shapeRendering="crispEdges">
          {/* top face */}
          <path d="M 2 2 L 14 2 L 15 4 L 1 4 Z" fill="#94A3B8" stroke={C} strokeWidth=".4"/>
          {/* body */}
          <rect x="1" y="4" width="14" height="14" fill="#E5E7EB" stroke={C} strokeWidth=".5"/>
          {/* screen */}
          <rect x="2" y="5" width="12" height="6" fill="#0F1A24" stroke={C} strokeWidth=".4"/>
          <path d="M 3 8 L 5 8 L 6 6 L 7 10 L 8 7 L 9 8 L 11 8 L 12 6 L 13 10" fill="none" stroke="#10B981" strokeWidth=".5"/>
          {/* knobs */}
          <circle cx="3" cy="13" r="1" fill="#EF4444" stroke={C} strokeWidth=".3"/>
          <circle cx="6" cy="13" r="1" fill="#3B82F6" stroke={C} strokeWidth=".3"/>
          <circle cx="9" cy="13" r="1" fill="#10B981" stroke={C} strokeWidth=".3"/>
          {/* printer slot */}
          <rect x="2" y="15" width="12" height="1.5" fill="#1F2937"/>
          <rect x="2" y="16.5" width="12" height="1" fill="#fff"/>
          {/* cart */}
          <rect x="2" y="18" width="12" height="11" fill="#9CA3AF" stroke={C} strokeWidth=".4"/>
          <rect x="3" y="19" width="10" height="2.5" fill="#fff" stroke={C} strokeWidth=".3"/>
          <rect x="3" y="23" width="10" height="2.5" fill="#fff" stroke={C} strokeWidth=".3"/>
          <ellipse cx="3" cy="32" rx="2" ry="1.5" fill={C}/>
          <ellipse cx="13" cy="32" rx="2" ry="1.5" fill={C}/>
        </svg>
      </div>
    );
  }

  // ─── Computer Cart v2 — workstation on wheels ─────────────────────
  function CompCart({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 4, width: T, height: T * 2.2, filter: 'drop-shadow(2px 3px 0 rgba(0,0,0,.28))' }}>
        <svg viewBox="0 0 16 36" width={T} height={T * 2.2} shapeRendering="crispEdges">
          {/* monitor top */}
          <path d="M 3 2 L 13 2 L 14 3 L 2 3 Z" fill="#4B5563" stroke={C} strokeWidth=".4"/>
          {/* monitor body */}
          <rect x="2" y="3" width="12" height="10" fill="#1F2937" stroke={C} strokeWidth=".4"/>
          <rect x="3" y="4" width="10" height="8" fill="#0F1A24"/>
          <rect x="4" y="5" width="8" height="1" fill="#22D3EE"/>
          <rect x="4" y="7" width="8" height="1" fill="#10B981"/>
          <rect x="4" y="9" width="6" height="1" fill="#FACC15"/>
          {/* monitor neck */}
          <rect x="7" y="13" width="2" height="3" fill="#374151"/>
          {/* keyboard tray (top face) */}
          <path d="M 2 16 L 14 16 L 15 18 L 1 18 Z" fill="#94A3B8" stroke={C} strokeWidth=".4"/>
          <rect x="1" y="18" width="14" height="2" fill="#6B7280" stroke={C} strokeWidth=".4"/>
          <rect x="2.5" y="16.5" width="11" height="1.2" fill="#1F2937"/>
          {/* base column */}
          <rect x="6" y="20" width="4" height="10" fill="#9CA3AF" stroke={C} strokeWidth=".4"/>
          {/* drawers */}
          <rect x="1" y="22" width="3" height="7" fill="#fff" stroke={C} strokeWidth=".3"/>
          <rect x="12" y="22" width="3" height="7" fill="#fff" stroke={C} strokeWidth=".3"/>
          <ellipse cx="3" cy="33" rx="2" ry="1.5" fill={C}/>
          <ellipse cx="13" cy="33" rx="2" ry="1.5" fill={C}/>
        </svg>
      </div>
    );
  }

  // ─── ER Sink v2 — basin with faucet ───────────────────────────────
  function Sink({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T, width: T, height: T - 2, filter: 'drop-shadow(2px 3px 0 rgba(0,0,0,.25))' }}>
        <svg viewBox="0 0 16 14" width={T} height={T - 2} shapeRendering="crispEdges">
          {/* faucet */}
          <rect x="7" y="0" width="2" height="3" fill="#94A3B8" stroke={C} strokeWidth=".3"/>
          <rect x="7" y="3" width="4" height="1.5" fill="#9CA3AF" stroke={C} strokeWidth=".3"/>
          <rect x="9" y="4.5" width="2" height="1.5" fill="#6B7280"/>
          <rect x="9.5" y="6" width="1" height="2" fill="#7DD3FC"/>
          {/* knobs */}
          <circle cx="5" cy="2" r=".8" fill="#3B82F6" stroke={C} strokeWidth=".3"/>
          <circle cx="11.5" cy="1.5" r=".8" fill="#EF4444" stroke={C} strokeWidth=".3"/>
          {/* basin rim TOP */}
          <ellipse cx="8" cy="7" rx="7" ry="2" fill="#E5E7EB" stroke={C} strokeWidth=".4"/>
          <ellipse cx="8" cy="6.5" rx="6" ry="1.3" fill="#F3F4F6"/>
          {/* water in basin */}
          <ellipse cx="8" cy="7.5" rx="5" ry="1" fill="#A8DCEC"/>
          {/* basin FRONT */}
          <path d="M 1 7 L 15 7 L 14 12 L 2 12 Z" fill="#9CA3AF" stroke={C} strokeWidth=".4"/>
          <path d="M 1 7 L 2 7 L 2 12 L 1 12 Z" fill="#CBD5E1"/>
        </svg>
      </div>
    );
  }

  // ─── Whiteboard v2 — wall-mounted with frame ──────────────────────
  function Whiteboard({ x, y, w = 3 }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T, width: T * w, height: T - 4, filter: 'drop-shadow(2px 2px 0 rgba(0,0,0,.25))' }}>
        <svg viewBox={`0 0 ${w * 16} 12`} width={T * w} height={T - 4} shapeRendering="crispEdges" preserveAspectRatio="none">
          {/* frame top face */}
          <path d={`M 1 .5 L ${w*16-1} .5 L ${w*16-1.5} 1.5 L 1.5 1.5 Z`} fill="#9CA3AF" stroke={C} strokeWidth=".3"/>
          {/* frame */}
          <rect x="1" y="1" width={w * 16 - 2} height="10" fill="#E5E7EB" stroke={C} strokeWidth=".4"/>
          {/* white surface */}
          <rect x="2" y="2" width={w * 16 - 4} height="7" fill="#fff" stroke={C} strokeWidth=".2"/>
          {/* notes */}
          <rect x="4" y="3" width="6" height=".8" fill="#3B82F6"/>
          <rect x="4" y="4.2" width="10" height=".5" fill={C}/>
          <rect x="4" y="5.4" width="8" height=".5" fill={C}/>
          <rect x="16" y="3" width="6" height=".8" fill="#EF4444"/>
          <rect x="16" y="4.2" width="10" height=".5" fill={C}/>
          {/* marker tray bottom */}
          <rect x="1" y="9" width={w * 16 - 2} height="2" fill="#6B7280" stroke={C} strokeWidth=".3"/>
          <rect x="3" y="9.4" width="2" height=".8" fill="#EF4444"/>
          <rect x="6" y="9.4" width="2" height=".8" fill="#3B82F6"/>
          <rect x="9" y="9.4" width="2" height=".8" fill="#10B981"/>
        </svg>
      </div>
    );
  }

  // ─── Medical Scale v2 — platform with display ─────────────────────
  function Scale({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T + 2, top: y * T, width: T - 4, height: T - 2, filter: 'drop-shadow(2px 2px 0 rgba(0,0,0,.25))' }}>
        <svg viewBox="0 0 12 14" width={T - 4} height={T - 2} shapeRendering="crispEdges">
          {/* display unit */}
          <rect x="3" y="0" width="6" height="4" fill="#1F2937" stroke={C} strokeWidth=".3"/>
          <rect x="4" y=".5" width="4" height="3" fill="#0F1A24"/>
          <text x="6" y="2.8" fontSize="2" fill="#10B981" textAnchor="middle" fontFamily="monospace">75</text>
          {/* neck */}
          <rect x="5" y="4" width="2" height="2" fill="#4B5563"/>
          {/* platform TOP */}
          <ellipse cx="6" cy="7" rx="5" ry="1.5" fill="#94A3B8" stroke={C} strokeWidth=".4"/>
          <ellipse cx="6" cy="6.5" rx="4" ry="1" fill="#CBD5E1"/>
          {/* platform FRONT */}
          <path d="M 1 7 L 11 7 L 10 11 L 2 11 Z" fill="#6B7280" stroke={C} strokeWidth=".4"/>
          {/* feet */}
          <rect x="2" y="11" width="2" height="2" fill="#1F2937"/>
          <rect x="8" y="11" width="2" height="2" fill="#1F2937"/>
        </svg>
      </div>
    );
  }

  // ─── BP Cuff v2 — wall-mount BP monitor ───────────────────────────
  function BPCuff({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T + 2, top: y * T, width: T - 4, height: T, filter: 'drop-shadow(2px 2px 0 rgba(0,0,0,.25))' }}>
        <svg viewBox="0 0 12 14" width={T - 4} height={T} shapeRendering="crispEdges">
          {/* top face */}
          <path d="M 1 0 L 11 0 L 12 1 L 0 1 Z" fill="#374151" stroke={C} strokeWidth=".3"/>
          {/* device body */}
          <rect x="1" y="1" width="10" height="6" fill="#1F2937" stroke={C} strokeWidth=".4"/>
          {/* screen */}
          <rect x="2" y="2" width="8" height="4" fill="#0F1A24" stroke={C} strokeWidth=".3"/>
          <text x="6" y="4" fontSize="1.8" fill="#10B981" textAnchor="middle" fontFamily="monospace">120</text>
          <text x="6" y="5.5" fontSize="1.3" fill="#22D3EE" textAnchor="middle" fontFamily="monospace">/80</text>
          {/* cuff hanging */}
          <path d="M 2 7 L 10 7 L 9 12 L 3 12 Z" fill="#1E40AF" stroke={C} strokeWidth=".4"/>
          <rect x="2.5" y="7" width="7" height="1" fill="#3B82F6"/>
          <rect x="3.5" y="9" width="5" height=".6" fill="#1E3A8A"/>
          {/* hose */}
          <path d="M 10 8 Q 11 10 9 12" fill="none" stroke={C} strokeWidth=".5"/>
        </svg>
      </div>
    );
  }

  // ─── Suction Unit v2 — bedside with canister + gauge ─────────────
  function SuctionUnit({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T + 1, top: y * T + 1, width: T - 2, height: T - 2, filter: 'drop-shadow(2px 2px 0 rgba(0,0,0,.28))' }}>
        <svg viewBox="0 0 14 14" width={T - 2} height={T - 2} shapeRendering="crispEdges">
          {/* top face */}
          <path d="M 1 1 L 13 1 L 14 3 L 0 3 Z" fill="#374151" stroke={C} strokeWidth=".3"/>
          {/* body */}
          <rect x="1" y="3" width="12" height="10" fill="#94A3B8" stroke={C} strokeWidth=".4"/>
          {/* canister with fluid */}
          <rect x="2" y="4" width="5" height="8" fill="#D4F0F8" stroke={C} strokeWidth=".3"/>
          <rect x="2" y="9" width="5" height="3" fill="#FCA5A5"/>
          {/* gauge */}
          <circle cx="10" cy="7" r="2.5" fill="#fff" stroke={C} strokeWidth=".3"/>
          <line x1="10" y1="7" x2="11.5" y2="5.5" stroke={C} strokeWidth=".4"/>
          <circle cx="10" cy="7" r=".3" fill={C}/>
        </svg>
      </div>
    );
  }

  // ─── Wheelchair v2 — proper big wheels + footrest ─────────────────
  function Wheelchair({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T, width: T, height: T * 1.6, filter: 'drop-shadow(2px 3px 0 rgba(0,0,0,.28))' }}>
        <svg viewBox="0 0 16 26" width={T} height={T * 1.6} shapeRendering="crispEdges">
          {/* push handles (top) */}
          <rect x="3" y="0" width="1" height="3" fill="#9CA3AF" stroke={C} strokeWidth=".3"/>
          <rect x="12" y="0" width="1" height="3" fill="#9CA3AF" stroke={C} strokeWidth=".3"/>
          {/* backrest */}
          <rect x="3" y="3" width="10" height="8" fill="#374151" stroke={C} strokeWidth=".4"/>
          <rect x="4" y="4" width="8" height="6" fill="#4B5563"/>
          <rect x="4" y="4" width="8" height=".8" fill="#6B7280"/>
          {/* seat TOP */}
          <path d="M 2 11 L 14 11 L 13 13 L 3 13 Z" fill="#4B5563" stroke={C} strokeWidth=".4"/>
          {/* seat FRONT */}
          <rect x="3" y="13" width="10" height="2" fill="#1F2937" stroke={C} strokeWidth=".3"/>
          {/* armrests */}
          <rect x="2" y="9" width="2" height="3" fill="#1F2937" stroke={C} strokeWidth=".3"/>
          <rect x="12" y="9" width="2" height="3" fill="#1F2937" stroke={C} strokeWidth=".3"/>
          {/* big wheels */}
          <circle cx="3" cy="18" r="4" fill="none" stroke={C} strokeWidth=".6"/>
          <circle cx="13" cy="18" r="4" fill="none" stroke={C} strokeWidth=".6"/>
          <circle cx="3" cy="18" r="1.5" fill="#9CA3AF" stroke={C} strokeWidth=".3"/>
          <circle cx="13" cy="18" r="1.5" fill="#9CA3AF" stroke={C} strokeWidth=".3"/>
          {/* spokes */}
          <line x1="3" y1="14" x2="3" y2="22" stroke={C} strokeWidth=".3"/>
          <line x1="-1" y1="18" x2="7" y2="18" stroke={C} strokeWidth=".3"/>
          <line x1="13" y1="14" x2="13" y2="22" stroke={C} strokeWidth=".3"/>
          <line x1="9" y1="18" x2="17" y2="18" stroke={C} strokeWidth=".3"/>
          {/* footrest */}
          <rect x="5" y="22" width="6" height="2" fill="#94A3B8" stroke={C} strokeWidth=".3"/>
          {/* small front caster wheels */}
          <circle cx="5" cy="25" r="1" fill={C}/>
          <circle cx="11" cy="25" r="1" fill={C}/>
        </svg>
      </div>
    );
  }

  Object.assign(window, {
    Gurney, Defib, OxygenTank, GloveDispenser, SharpsContainer, HandSanitizer,
    EKG, CompCart, Sink, Whiteboard, Scale, BPCuff, SuctionUnit, Wheelchair,
  });
})();
