// interior-objects-er.jsx — ER-specific 2.5D objects, all v2 style.
// Each object shows visible TOP + FRONT + side depth — viewed from 45° above.
// Coordinates are tile-based; SVG content is hand-drawn pixel art.

(function () {
  const C = '#2A2522';
  const T = window.ITILE || 16;

  // ─── Gurney v2 — mobile patient stretcher ─────────────────────────
  function Gurney({ x, y, occupied }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 4, width: T * 2, height: T * 3 + 8 }}>
        <svg viewBox="0 0 32 56" width={T * 2} height={T * 3 + 8} shapeRendering="crispEdges">
          <ellipse cx="17.0" cy="48.5" rx="15" ry="5.5" fill="rgba(0,0,0,.16)"/>
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

  // ─── Defib v2 — TOP-DOWN cart: top control face + front band + wheels ─────
  function Defib({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 4, width: T * 1.5, height: T * 2 }}>
        <svg viewBox="0 0 24 32" width={T * 1.5} height={T * 2} shapeRendering="geometricPrecision">
          <ellipse cx="12.0" cy="30.2" rx="8.2" ry="2.8" fill="rgba(0,0,0,.16)"/>
          {/* full silhouette (top + front, single body) */}
          <path d="M4 1 Q2 1 2 3 L2 25 Q2 27 4 27 L20 27 Q22 27 22 25 L22 3 Q22 1 20 1 Z" fill="#CA8A04"/>
          {/* FAR top face (device top) — paddles resting in their wells */}
          <path d="M4 1 Q2 1 2 3 L2 12 L22 12 L22 3 Q22 1 20 1 Z" fill="#FDE047"/>
          <ellipse cx="7" cy="6.5" rx="3.2" ry="2.2" fill="#F59E0B" stroke={C} strokeWidth=".4"/>
          <rect x="6.2" y="4.6" width="1.6" height="1.4" fill="#B45309"/>
          <ellipse cx="16" cy="6.5" rx="3.2" ry="2.2" fill="#F59E0B" stroke={C} strokeWidth=".4"/>
          <rect x="15.2" y="4.6" width="1.6" height="1.4" fill="#B45309"/>
          <path d="M4 9.6 Q12 8.6 20 9.6" fill="none" stroke={C} strokeWidth=".5" opacity=".5"/>{/* coiled cable hint */}
          {/* seam: top → near control panel */}
          <line x1="2" y1="12" x2="22" y2="12" stroke={C} strokeWidth=".6"/>
          {/* NEAR tilted control panel FACING THE VIEWER — screen + dials */}
          <path d="M2 12 L22 12 L22 22 L2 22 Z" fill="#EAB308"/>
          <rect x="3.5" y="13.2" width="10" height="6.4" rx=".6" fill="#0F1A24" stroke={C} strokeWidth=".4"/>
          <path d="M4.2 17 L5.6 17 L6.6 14.4 L7.6 19.2 L8.6 15.6 L9.6 17 L13 17" fill="none" stroke="#10B981" strokeWidth=".6"/>
          <text x="12" y="15.4" fontSize="2" fill="#F87171" textAnchor="middle" fontFamily="monospace">200J</text>
          <circle cx="16.5" cy="15" r="1.5" fill="#1F2937" stroke={C} strokeWidth=".3"/>
          <circle cx="20" cy="15" r="1.5" fill="#DC2626" stroke={C} strokeWidth=".3"/>
          <circle cx="16.5" cy="18.6" r="1.3" fill="#10B981" stroke={C} strokeWidth=".3"/>
          <circle cx="20" cy="18.6" r="1.3" fill="#334155" stroke={C} strokeWidth=".3"/>
          {/* seam: panel → drawer band */}
          <line x1="2" y1="22" x2="22" y2="22" stroke={C} strokeWidth=".6"/>
          {/* front drawer band */}
          <rect x="4" y="23.4" width="6" height="2.6" rx=".4" fill="#CA8A04" stroke={C} strokeWidth=".3"/>
          <rect x="12" y="23.4" width="6" height="2.6" rx=".4" fill="#CA8A04" stroke={C} strokeWidth=".3"/>
          {/* outer silhouette outline */}
          <path d="M4 1 Q2 1 2 3 L2 25 Q2 27 4 27 L20 27 Q22 27 22 25 L22 3 Q22 1 20 1 Z" fill="none" stroke={C} strokeWidth=".7"/>
          <ellipse cx="5" cy="28.5" rx="1.8" ry="1.3" fill="#2C3239"/>
          <ellipse cx="19" cy="28.5" rx="1.8" ry="1.3" fill="#2C3239"/>
        </svg>
      </div>
    );
  }

  // ─── Oxygen Tank v2 — green cylinder with valve ───────────────────
  function OxygenTank({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T + 2, top: y * T - 2, width: T - 4, height: T + 4 }}>
        <svg viewBox="0 0 12 20" width={T - 4} height={T + 4} shapeRendering="geometricPrecision">
          <ellipse cx="6.0" cy="19.0" rx="4.1" ry="2" fill="rgba(0,0,0,.16)"/>
          {/* valve/regulator seen from above (sits on the shoulder) */}
          <ellipse cx="6" cy="2.4" rx="1.8" ry="1.1" fill="#B7BEC6" stroke={C} strokeWidth=".35"/>
          <rect x="5.4" y="1.4" width="1.2" height="1.4" fill="#9CA3AF"/>
          {/* big top ellipse (cylinder cap, high angle) */}
          <ellipse cx="6" cy="5" rx="4.4" ry="2.4" fill="#22C55E" stroke={C} strokeWidth=".4"/>
          <ellipse cx="6" cy="4.4" rx="3" ry="1.4" fill="#4ADE80"/>
          {/* cylinder body — vertical sides */}
          <path d="M1.6 5 L1.6 15 Q1.6 17 6 17 Q10.4 17 10.4 15 L10.4 5" fill="#16A34A" stroke={C} strokeWidth=".45"/>
          <rect x="2.4" y="6" width="1.6" height="9" fill="#22C55E" opacity=".7"/>{/* highlight */}
          {/* O2 label band */}
          <rect x="3" y="9.5" width="6" height="4" rx=".4" fill="#fff" stroke={C} strokeWidth=".3"/>
          <text x="6" y="12.6" fontSize="2.6" fill={C} textAnchor="middle" fontFamily="monospace">O₂</text>
          {/* bottom rim */}
          <path d="M1.6 15 Q1.6 17 6 17 Q10.4 17 10.4 15" fill="none" stroke={C} strokeWidth=".45"/>
        </svg>
      </div>
    );
  }

  // ─── Glove Dispenser v2 — wall-mount with peeking glove ──────────
  function GloveDispenser({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T + 2, top: y * T, width: T - 4, height: T - 2 }}>
        <svg viewBox="0 0 12 14" width={T - 4} height={T - 2} shapeRendering="crispEdges">
          <ellipse cx="6.0" cy="13.0" rx="4.1" ry="2" fill="rgba(0,0,0,.16)"/>
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
      <div style={{ position: 'absolute', left: x * T + 2, top: y * T, width: T - 4, height: T }}>
        <svg viewBox="0 0 12 14" width={T - 4} height={T} shapeRendering="crispEdges">
          <ellipse cx="6.0" cy="13.0" rx="4.1" ry="2" fill="rgba(0,0,0,.16)"/>
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
      <div style={{ position: 'absolute', left: x * T + 4, top: y * T, width: T - 8, height: T - 4 }}>
        <svg viewBox="0 0 8 12" width={T - 8} height={T - 4} shapeRendering="crispEdges">
          <ellipse cx="4.0" cy="11.0" rx="2.7" ry="2" fill="rgba(0,0,0,.16)"/>
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

  // ─── EKG v2 — TOP-DOWN cart: far cart top + near viewer-facing screen panel ─
  function EKG({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 2, width: T * 1.4, height: T * 2 }}>
        <svg viewBox="0 0 22 32" width={T * 1.4} height={T * 2} shapeRendering="geometricPrecision">
          <ellipse cx="11.0" cy="30.4" rx="7.5" ry="2.6" fill="rgba(0,0,0,.16)"/>
          {/* full silhouette */}
          <path d="M4 1 Q2 1 2 3 L2 25 Q2 27 4 27 L18 27 Q20 27 20 25 L20 3 Q20 1 18 1 Z" fill="#8A929B"/>
          {/* FAR top face — cable spool + lead ports resting on the cart top */}
          <path d="M4 1 Q2 1 2 3 L2 12 L20 12 L20 3 Q20 1 18 1 Z" fill="#D2D6DC"/>
          <circle cx="7" cy="6.4" r="2.6" fill="#B7BEC6" stroke={C} strokeWidth=".4"/>
          <circle cx="7" cy="6.4" r="1" fill="#8A929B"/>
          <path d="M9.4 6 Q13 5 15 7.2" fill="none" stroke={C} strokeWidth=".5" opacity=".55"/>{/* lead cable */}
          {[13.5,15,16.5].map((lx,i)=><rect key={i} x={lx} y="4.2" width="1" height="2.4" rx=".4" fill="#4B5563"/>)}
          {/* seam: top → near control panel */}
          <line x1="2" y1="12" x2="20" y2="12" stroke={C} strokeWidth=".6"/>
          {/* NEAR viewer-facing panel — the readable screen + printout + dials */}
          <path d="M2 12 L20 12 L20 22 L2 22 Z" fill="#C7CDD4"/>
          <rect x="3.5" y="13.2" width="10" height="5.4" rx=".5" fill="#0F1A24" stroke={C} strokeWidth=".4"/>
          <path d="M4.2 16 L5.8 16 L6.8 13.8 L7.8 18 L8.8 14.8 L9.8 16 L13 16" fill="none" stroke="#10B981" strokeWidth=".6"/>
          <circle cx="16" cy="14.6" r="1.3" fill="#EF4444" stroke={C} strokeWidth=".3"/>
          <circle cx="19" cy="14.6" r="1.3" fill="#3B82F6" stroke={C} strokeWidth=".3"/>
          <rect x="15" y="16.6" width="4.6" height="2.6" rx=".3" fill="#1F2937"/>
          <rect x="15.5" y="17.1" width="3.6" height="1.5" fill="#fff"/>{/* rhythm strip printout */}
          {/* seam: panel → drawer band */}
          <line x1="2" y1="22" x2="20" y2="22" stroke={C} strokeWidth=".6"/>
          <rect x="4" y="23.4" width="12" height="2.6" rx=".4" fill="#8A929B" stroke={C} strokeWidth=".3"/>
          {/* outer silhouette outline */}
          <path d="M4 1 Q2 1 2 3 L2 25 Q2 27 4 27 L18 27 Q20 27 20 25 L20 3 Q20 1 18 1 Z" fill="none" stroke={C} strokeWidth=".7"/>
          <ellipse cx="5" cy="28.5" rx="1.8" ry="1.3" fill="#2C3239"/>
          <ellipse cx="17" cy="28.5" rx="1.8" ry="1.3" fill="#2C3239"/>
        </svg>
      </div>
    );
  }

  // ─── Computer Cart v2 — workstation on wheels ─────────────────────
  function CompCart({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 4, width: T, height: T * 2.2 }}>
        <svg viewBox="0 0 16 36" width={T} height={T * 2.2} shapeRendering="geometricPrecision">
          <ellipse cx="8.0" cy="35.0" rx="5.4" ry="2" fill="rgba(0,0,0,.16)"/>
          {/* viewer-facing monitor on a neck */}
          <path d="M3 1.4 L13 1.4 L13.6 2.6 L2.4 2.6 Z" fill="#2C333B"/>{/* top bezel cap */}
          <rect x="2" y="2.6" width="12" height="9" fill="#1F2937" stroke={C} strokeWidth=".45"/>
          <rect x="3" y="3.4" width="10" height="7.4" rx=".4" fill="#0F1A24"/>
          <rect x="4" y="4.4" width="8" height="1" fill="#22D3EE"/>
          <rect x="4" y="6.2" width="8" height="1" fill="#10B981"/>
          <rect x="4" y="8" width="6" height="1" fill="#FACC15"/>
          <rect x="7" y="11.6" width="2" height="2.4" fill="#374151"/>{/* neck */}
          {/* full cart silhouette (top keyboard tray + front drawers) */}
          <path d="M2 14 Q1.4 14 1.4 14.6 L1.4 30 Q1.4 30.6 2 30.6 L14 30.6 Q14.6 30.6 14.6 30 L14.6 14.6 Q14.6 14 14 14 Z" fill="#AEB4BC"/>
          {/* TOP keyboard tray face */}
          <path d="M2 14 Q1.4 14 1.4 14.6 L1.4 20 L14.6 20 L14.6 14.6 Q14.6 14 14 14 Z" fill="#C7CDD4"/>
          <rect x="2.6" y="15" width="10.8" height="3.4" rx=".4" fill="#1F2937"/>
          {[0,1,2,3,4].map(i=><rect key={i} x={3.2+i*2.1} y="15.6" width="1.5" height="2.2" fill="#3A424B"/>)}
          {/* seam → front drawers */}
          <line x1="1.4" y1="20" x2="14.6" y2="20" stroke={C} strokeWidth=".55"/>
          <rect x="2.4" y="21" width="11.2" height="3.4" rx=".3" fill="#EDEFF2" stroke={C} strokeWidth=".35"/>
          <rect x="6.6" y="22.2" width="2.8" height="1" fill="#9CA3AF"/>
          <rect x="2.4" y="25.2" width="11.2" height="3.4" rx=".3" fill="#EDEFF2" stroke={C} strokeWidth=".35"/>
          <rect x="6.6" y="26.4" width="2.8" height="1" fill="#9CA3AF"/>
          {/* outer outline */}
          <path d="M2 14 Q1.4 14 1.4 14.6 L1.4 30 Q1.4 30.6 2 30.6 L14 30.6 Q14.6 30.6 14.6 30 L14.6 14.6 Q14.6 14 14 14 Z" fill="none" stroke={C} strokeWidth=".6"/>
          <ellipse cx="3.4" cy="32" rx="1.8" ry="1.3" fill="#2C3239"/>
          <ellipse cx="12.6" cy="32" rx="1.8" ry="1.3" fill="#2C3239"/>
        </svg>
      </div>
    );
  }

  // ─── ER Sink v2 — TOP-DOWN counter basin ──────────────────────────
  function Sink({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 2, width: T, height: T * 1.3 }}>
        <svg viewBox="0 0 16 20" width={T} height={T * 1.3} shapeRendering="geometricPrecision">
          <ellipse cx="8.0" cy="19.0" rx="5.4" ry="2" fill="rgba(0,0,0,.16)"/>
          {/* full silhouette (counter top + front cabinet) */}
          <path d="M1 2 L15 2 L15 16 Q15 17 14 17 L2 17 Q1 17 1 16 Z" fill="#AEB4BC"/>
          {/* TOP counter face */}
          <path d="M1 2 L15 2 L15 12 L1 12 Z" fill="#E1E5EA"/>
          {/* faucet at the back + knobs (seen from above) */}
          <rect x="7" y="2.6" width="2" height="2.6" rx=".4" fill="#9CA3AF" stroke={C} strokeWidth=".3"/>
          <rect x="7.4" y="5" width="1.2" height="2" fill="#7DD3FC"/>
          <circle cx="5" cy="3.6" r=".9" fill="#3B82F6" stroke={C} strokeWidth=".3"/>
          <circle cx="11" cy="3.6" r=".9" fill="#EF4444" stroke={C} strokeWidth=".3"/>
          {/* basin — inset oval on the counter */}
          <ellipse cx="8" cy="8.4" rx="5.2" ry="3" fill="#C7CDD4" stroke={C} strokeWidth=".45"/>
          <ellipse cx="8" cy="8.4" rx="4" ry="2.1" fill="#A8DCEC"/>
          <ellipse cx="8" cy="8.6" rx="1" ry=".6" fill="#5B8FA8"/>{/* drain */}
          {/* seam → front cabinet */}
          <line x1="1" y1="12" x2="15" y2="12" stroke={C} strokeWidth=".55"/>
          <rect x="2.5" y="13" width="11" height="3.2" rx=".3" fill="#C6C2B6" stroke={C} strokeWidth=".35"/>
          <rect x="7" y="14.2" width="2" height="1" fill="#8A8577"/>
          {/* outer outline */}
          <path d="M1 2 L15 2 L15 16 Q15 17 14 17 L2 17 Q1 17 1 16 Z" fill="none" stroke={C} strokeWidth=".6"/>
        </svg>
      </div>
    );
  }

  // ─── Whiteboard v2 — wall-mounted with frame ──────────────────────
  function Whiteboard({ x, y, w = 3 }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T, width: T * w, height: T - 4 }}>
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
      <div style={{ position: 'absolute', left: x * T + 2, top: y * T, width: T - 4, height: T - 2 }}>
        <svg viewBox="0 0 12 14" width={T - 4} height={T - 2} shapeRendering="crispEdges">
          <ellipse cx="6.0" cy="13.0" rx="4.1" ry="2" fill="rgba(0,0,0,.16)"/>
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
      <div style={{ position: 'absolute', left: x * T + 2, top: y * T, width: T - 4, height: T }}>
        <svg viewBox="0 0 12 14" width={T - 4} height={T} shapeRendering="crispEdges">
          <ellipse cx="6.0" cy="13.0" rx="4.1" ry="2" fill="rgba(0,0,0,.16)"/>
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
      <div style={{ position: 'absolute', left: x * T + 1, top: y * T - 2, width: T - 2, height: T * 1.4 }}>
        <svg viewBox="0 0 14 20" width={T - 2} height={T * 1.4} shapeRendering="geometricPrecision">
          <ellipse cx="7.0" cy="19.0" rx="4.8" ry="2" fill="rgba(0,0,0,.16)"/>
          {/* full silhouette */}
          <path d="M2 1 Q1 1 1 2 L1 16 Q1 17 2 17 L12 17 Q13 17 13 16 L13 2 Q13 1 12 1 Z" fill="#8A929B"/>
          {/* TOP face — canister mouths + gauge seen from above */}
          <path d="M2 1 Q1 1 1 2 L1 8 L13 8 L13 2 Q13 1 12 1 Z" fill="#B7BEC6"/>
          <ellipse cx="5" cy="4.6" rx="2.6" ry="1.8" fill="#D4F0F8" stroke={C} strokeWidth=".4"/>
          <ellipse cx="5" cy="4.6" rx="1.4" ry="1" fill="#A8DCEC"/>
          <circle cx="10.2" cy="4.6" r="2" fill="#fff" stroke={C} strokeWidth=".4"/>
          <line x1="10.2" y1="4.6" x2="11.4" y2="3.4" stroke="#DC2626" strokeWidth=".45"/>
          <circle cx="10.2" cy="4.6" r=".4" fill={C}/>
          {/* seam */}
          <line x1="1" y1="8" x2="13" y2="8" stroke={C} strokeWidth=".55"/>
          {/* FRONT band — collection canister with fluid level */}
          <rect x="2.5" y="9.2" width="5" height="6.6" rx=".5" fill="#EAF6FA" stroke={C} strokeWidth=".4"/>
          <rect x="2.5" y="12.6" width="5" height="3.2" rx=".4" fill="#FCA5A5"/>
          <rect x="9" y="9.6" width="2.6" height="5.6" rx=".4" fill="#5B6672"/>
          {/* outer outline */}
          <path d="M2 1 Q1 1 1 2 L1 16 Q1 17 2 17 L12 17 Q13 17 13 16 L13 2 Q13 1 12 1 Z" fill="none" stroke={C} strokeWidth=".6"/>
        </svg>
      </div>
    );
  }

  // ─── Wheelchair v2 — TOP-DOWN: seat top dominant, wheels as side ellipses ──
  function Wheelchair({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 4, width: T * 1.5, height: T * 1.7 }}>
        <svg viewBox="0 0 24 30" width={T * 1.5} height={T * 1.7} shapeRendering="geometricPrecision">
          <ellipse cx="12.0" cy="28.2" rx="8.2" ry="2.8" fill="rgba(0,0,0,.16)"/>
          {/* push handles behind the backrest */}
          <rect x="7" y="1" width="2.2" height="2.2" rx="1" fill="#4B5563" stroke={C} strokeWidth=".4"/>
          <rect x="14.8" y="1" width="2.2" height="2.2" rx="1" fill="#4B5563" stroke={C} strokeWidth=".4"/>
          {/* BACKREST standing up — top face + tall padded front (seamless side) */}
          <path d="M8 3 Q7 3 7 4 L7 12 L17 12 L17 4 Q17 3 16 3 Z" fill="#586472"/>
          <path d="M7 6 L17 6 L17 12 L7 12 Z" fill="#3B4550"/>
          <path d="M8 3 Q7 3 7 4 L7 12 L17 12 L17 4 Q17 3 16 3 Z" fill="none" stroke={C} strokeWidth=".55"/>
          <line x1="7" y1="6" x2="17" y2="6" stroke={C} strokeWidth=".45"/>
          {/* big drive wheels — angled discs flanking the seat */}
          <ellipse cx="3.4" cy="18" rx="3.2" ry="6.2" fill="#2C3239" stroke={C} strokeWidth=".5"/>
          <ellipse cx="3.4" cy="18" rx="1.7" ry="4.6" fill="#3A424B"/>
          <ellipse cx="3.4" cy="18" rx="1" ry="1.6" fill="#9CA3AF" stroke={C} strokeWidth=".3"/>
          <ellipse cx="20.6" cy="18" rx="3.2" ry="6.2" fill="#2C3239" stroke={C} strokeWidth=".5"/>
          <ellipse cx="20.6" cy="18" rx="1.7" ry="4.6" fill="#3A424B"/>
          <ellipse cx="20.6" cy="18" rx="1" ry="1.6" fill="#9CA3AF" stroke={C} strokeWidth=".3"/>
          {/* SEAT — top face + short front band, seamless side */}
          <path d="M7 12 L17 12 L17 21 Q17 22.4 15.6 22.4 L8.4 22.4 Q7 22.4 7 21 Z" fill="#5B6672"/>
          <path d="M7 12 L17 12 L17 19 L7 19 Z" fill="#6E7A88"/>
          <line x1="12" y1="12.6" x2="12" y2="18.4" stroke="#4B5563" strokeWidth=".4" opacity=".5"/>
          <path d="M7 12 L17 12 L17 21 Q17 22.4 15.6 22.4 L8.4 22.4 Q7 22.4 7 21 Z" fill="none" stroke={C} strokeWidth=".55"/>
          <line x1="7" y1="19" x2="17" y2="19" stroke={C} strokeWidth=".45"/>
          {/* footplate + small front casters */}
          <rect x="8.5" y="22.4" width="7" height="2.2" rx="1" fill="#94A3B8" stroke={C} strokeWidth=".4"/>
          <ellipse cx="9" cy="26" rx="1.2" ry="1.6" fill="#2C3239" stroke={C} strokeWidth=".3"/>
          <ellipse cx="15" cy="26" rx="1.2" ry="1.6" fill="#2C3239" stroke={C} strokeWidth=".3"/>
        </svg>
      </div>
    );
  }

  Object.assign(window, {
    Gurney, Defib, OxygenTank, GloveDispenser, SharpsContainer, HandSanitizer,
    EKG, CompCart, Sink, Whiteboard, Scale, BPCuff, SuctionUnit, Wheelchair,
  });
})();
