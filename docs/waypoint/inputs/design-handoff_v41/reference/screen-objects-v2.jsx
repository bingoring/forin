// screen-objects-v2.jsx — RPG Maker-style 2.5D object library v2.
// Reference: classic GBA-era top-down RPG furniture where objects are drawn
// as if viewed from a 45° upper-front angle, so you see the FRONT face
// prominently + a hint of the top. Tables show legs, beds show their full
// side profile, drawers have visible drawer faces.

(function () {
  const C = '#2A2522';

  // ─── GURNEY v2 — mobile stretcher with rails + IV pole + 4 wheels ────
  function GurneyV2({ x = 0, y = 0 }) {
    return (
      <div style={{ position: 'absolute', left: x, top: y, width: 56, height: 96, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.3))' }}>
        <svg viewBox="0 0 28 48" width="56" height="96" shapeRendering="crispEdges">
          {/* hand rails (top) */}
          <rect x="3" y="1" width="22" height="2" fill="#94A3B8" stroke={C} strokeWidth=".4"/>
          <rect x="3" y="1" width="2" height="8" fill="#94A3B8" stroke={C} strokeWidth=".4"/>
          <rect x="23" y="1" width="2" height="8" fill="#94A3B8" stroke={C} strokeWidth=".4"/>
          {/* mattress TOP face */}
          <rect x="2" y="9" width="24" height="24" fill="#FFFFFF" stroke={C} strokeWidth=".5"/>
          <rect x="2.5" y="9.5" width="23" height="1.5" fill="#F3F4F6"/>
          {/* pillow — pixel-art block */}
          <rect x="7"   y="11" width="14" height="4.5" fill="#F8FAFC"/>
          <rect x="6.5" y="12" width="0.7" height="2.5" fill="#F8FAFC"/>
          <rect x="20.8" y="12" width="0.7" height="2.5" fill="#F8FAFC"/>
          <rect x="8"   y="11.5" width="12" height="0.8" fill="#FFFFFF"/>
          <rect x="7"   y="14.3" width="14" height="1.2" fill="#E8ECF1"/>
          <rect x="13.7" y="12" width="0.5" height="3" fill="#D8DEE6" opacity=".55"/>
          {/* sheet folds */}
          <line x1="8" y1="17" x2="8" y2="32" stroke="#C4C4C4" strokeWidth=".25" opacity=".5"/>
          <line x1="20" y1="17" x2="20" y2="32" stroke="#C4C4C4" strokeWidth=".25" opacity=".5"/>
          {/* mattress FRONT thickness */}
          <rect x="2" y="33" width="24" height="3" fill="#E5E7EB" stroke={C} strokeWidth=".5"/>
          {/* frame */}
          <rect x="2" y="36" width="24" height="3" fill="#4B5563" stroke={C} strokeWidth=".5"/>
          <rect x="2.5" y="36.5" width="23" height="1" fill="#6B7280"/>
          {/* wheel posts */}
          <rect x="3" y="39" width="3" height="4" fill="#1F2937" stroke={C} strokeWidth=".4"/>
          <rect x="22" y="39" width="3" height="4" fill="#1F2937" stroke={C} strokeWidth=".4"/>
          {/* wheels (2 visible front) */}
          <ellipse cx="4.5" cy="45" rx="2.5" ry="2" fill={C}/>
          <ellipse cx="23.5" cy="45" rx="2.5" ry="2" fill={C}/>
          <ellipse cx="4.5" cy="44.5" rx="1.2" ry=".8" fill="#6B7280"/>
          <ellipse cx="23.5" cy="44.5" rx="1.2" ry=".8" fill="#6B7280"/>
          {/* IV pole on left */}
          <rect x="0" y="2" width="1.5" height="34" fill="#9CA3AF" stroke={C} strokeWidth=".3"/>
          {/* IV bag */}
          <rect x="-1" y="2" width="4" height="5" fill="#A8DCEC" stroke={C} strokeWidth=".3"/>
        </svg>
      </div>
    );
  }

  // ─── DEFIB v2 — yellow cart + screen + paddles on top ────────────
  function DefibV2({ x = 0, y = 0 }) {
    return (
      <div style={{ position: 'absolute', left: x, top: y, width: 40, height: 72, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.3))' }}>
        <svg viewBox="0 0 20 36" width="40" height="72" shapeRendering="crispEdges">
          {/* paddles on top (visible from above) */}
          <rect x="2" y="0" width="6" height="3" fill="#F59E0B" stroke={C} strokeWidth=".4"/>
          <rect x="3" y=".5" width="4" height="1" fill="#FBBF24"/>
          <rect x="12" y="0" width="6" height="3" fill="#F59E0B" stroke={C} strokeWidth=".4"/>
          <rect x="13" y=".5" width="4" height="1" fill="#FBBF24"/>
          {/* cable from paddles */}
          <path d="M 5 3 Q 4 6 8 8" fill="none" stroke={C} strokeWidth=".5"/>
          <path d="M 15 3 Q 16 6 12 8" fill="none" stroke={C} strokeWidth=".5"/>
          {/* TOP face of body */}
          <path d="M 2 3 L 18 3 L 19 5 L 1 5 Z" fill="#FACC15" stroke={C} strokeWidth=".4"/>
          {/* body */}
          <rect x="1" y="5" width="18" height="14" fill="#FACC15" stroke={C} strokeWidth=".5"/>
          <rect x="1.5" y="5.5" width="17" height="1.5" fill="#FEF08A"/>
          {/* screen */}
          <rect x="3" y="7" width="14" height="8" fill="#0F1A24" stroke={C} strokeWidth=".4"/>
          <path d="M 4 11 L 6 11 L 7 8 L 8 14 L 9 9 L 10 11 L 14 11" fill="none" stroke="#10B981" strokeWidth=".7"/>
          <rect x="3" y="15" width="4" height="2" fill="#1F2937" stroke={C} strokeWidth=".3"/>
          <rect x="8" y="15" width="4" height="2" fill="#DC2626" stroke={C} strokeWidth=".3"/>
          <rect x="13" y="15" width="4" height="2" fill="#10B981" stroke={C} strokeWidth=".3"/>
          {/* cart bottom */}
          <path d="M 1 19 L 19 19 L 20 21 L 0 21 Z" fill="#9CA3AF" stroke={C} strokeWidth=".4"/>
          <rect x="1" y="21" width="18" height="10" fill="#94A3B8" stroke={C} strokeWidth=".4"/>
          <rect x="2" y="23" width="16" height="3" fill="#fff" stroke={C} strokeWidth=".3"/>
          <rect x="2" y="27" width="16" height="3" fill="#fff" stroke={C} strokeWidth=".3"/>
          <ellipse cx="3" cy="33" rx="2" ry="1.5" fill={C}/>
          <ellipse cx="17" cy="33" rx="2" ry="1.5" fill={C}/>
        </svg>
      </div>
    );
  }

  // ─── VENTILATOR v2 — ICU breathing machine ────────────────────
  function VentilatorV2({ x = 0, y = 0 }) {
    return (
      <div style={{ position: 'absolute', left: x, top: y, width: 36, height: 84, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.3))' }}>
        <svg viewBox="0 0 18 42" width="36" height="84" shapeRendering="crispEdges">
          {/* breathing tube curling up */}
          <path d="M 5 0 Q 2 4 4 8" fill="none" stroke="#94A3B8" strokeWidth="1.5"/>
          <rect x="4" y="7" width="3" height="2" fill="#94A3B8" stroke={C} strokeWidth=".3"/>
          {/* top face */}
          <path d="M 2 8 L 16 8 L 17 10 L 1 10 Z" fill="#94A3B8" stroke={C} strokeWidth=".4"/>
          {/* upper body with screen */}
          <rect x="1" y="10" width="16" height="14" fill="#475569" stroke={C} strokeWidth=".5"/>
          {/* screen */}
          <rect x="3" y="12" width="12" height="8" fill="#0F1A24" stroke={C} strokeWidth=".4"/>
          <path d="M 4 16 L 6 16 L 7 14 L 8 18 L 9 15 L 11 16 L 14 16" fill="none" stroke="#22D3EE" strokeWidth=".5"/>
          <rect x="4" y="18" width="10" height=".6" fill="#FACC15"/>
          {/* knobs row */}
          <ellipse cx="4" cy="22" rx="1.2" ry="1" fill="#EF4444" stroke={C} strokeWidth=".3"/>
          <ellipse cx="7" cy="22" rx="1.2" ry="1" fill="#3B82F6" stroke={C} strokeWidth=".3"/>
          <ellipse cx="10" cy="22" rx="1.2" ry="1" fill="#10B981" stroke={C} strokeWidth=".3"/>
          <ellipse cx="13" cy="22" rx="1.2" ry="1" fill="#FACC15" stroke={C} strokeWidth=".3"/>
          {/* divider */}
          <rect x="1" y="24" width="16" height="1" fill="#1F2937"/>
          {/* lower body */}
          <rect x="1" y="25" width="16" height="10" fill="#374151" stroke={C} strokeWidth=".5"/>
          <rect x="3" y="27" width="12" height="2" fill="#1F2937"/>
          <rect x="3" y="30" width="12" height="2" fill="#1F2937"/>
          {/* base */}
          <ellipse cx="9" cy="36" rx="8" ry="1.5" fill="#1F2937" stroke={C} strokeWidth=".4"/>
          <ellipse cx="3" cy="40" rx="2" ry="1.5" fill={C}/>
          <ellipse cx="15" cy="40" rx="2" ry="1.5" fill={C}/>
        </svg>
      </div>
    );
  }

  // ─── IV STAND v2 — hook + bag + drip chamber + spider base ────────
  function IVStandV2({ x = 0, y = 0 }) {
    return (
      <div style={{ position: 'absolute', left: x, top: y, width: 32, height: 96, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.28))' }}>
        <svg viewBox="0 0 16 48" width="32" height="96" shapeRendering="crispEdges">
          {/* hook curling upward (inverted-J) */}
          <rect x="7" y="6" width="2" height="6" fill="#9CA3AF" stroke={C} strokeWidth=".4"/>
          <rect x="5" y="4" width="2" height="3" fill="#9CA3AF" stroke={C} strokeWidth=".4"/>
          <rect x="3" y="2" width="2" height="3" fill="#9CA3AF" stroke={C} strokeWidth=".4"/>
          <rect x="3" y="0" width="6" height="2" fill="#9CA3AF" stroke={C} strokeWidth=".4"/>
          <rect x="9" y="2" width="2" height="3" fill="#9CA3AF" stroke={C} strokeWidth=".4"/>
          <rect x="4" y="0.5" width="3" height=".5" fill="#E2E5EB"/>
          {/* IV bag */}
          <rect x="1" y="13" width="14" height="13" fill="#A8DCEC" stroke={C} strokeWidth=".5"/>
          <rect x="1.5" y="13.5" width="13" height="1.5" fill="#D4F0F8"/>
          <rect x="2" y="16" width="12" height="7" fill="#7DBFD9"/>
          <rect x="2" y="23" width="12" height="3" fill="#FFFFFF" stroke={C} strokeWidth=".3"/>
          <rect x="3" y="24" width="10" height=".5" fill={C} opacity=".7"/>
          <rect x="3" y="25" width="7" height=".5" fill={C} opacity=".5"/>
          {/* hanging loop */}
          <circle cx="8" cy="11" r="1.5" fill="none" stroke={C} strokeWidth=".4"/>
          {/* drip chamber */}
          <rect x="6" y="27" width="4" height="6" fill="#D4F0F8" stroke={C} strokeWidth=".4"/>
          <rect x="6.5" y="30" width="3" height="3" fill="#A8DCEC"/>
          <circle cx="8" cy="28.5" r=".5" fill="#5E8FA8"/>
          {/* pole (3-tone for depth) */}
          <rect x="7" y="33" width="1" height="10" fill="#E2E5EB"/>
          <rect x="8" y="33" width="1" height="10" fill="#9CA3AF"/>
          {/* spider base hub */}
          <ellipse cx="8" cy="43" rx="3" ry="1.5" fill="#4B5563" stroke={C} strokeWidth=".4"/>
          {/* legs */}
          <rect x="0" y="43" width="5" height="1.5" fill="#4B5563" stroke={C} strokeWidth=".3" transform="rotate(15 2.5 43)"/>
          <rect x="11" y="43" width="5" height="1.5" fill="#4B5563" stroke={C} strokeWidth=".3" transform="rotate(-15 13 43)"/>
          {/* wheel tips */}
          <circle cx="1" cy="46" r="1" fill={C}/>
          <circle cx="15" cy="46" r="1" fill={C}/>
        </svg>
      </div>
    );
  }

  // ─── CRIB v2 — pediatric bed with rails + stuffie ──────────────
  function CribV2({ x = 0, y = 0 }) {
    return (
      <div style={{ position: 'absolute', left: x, top: y, width: 64, height: 96, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.3))' }}>
        <svg viewBox="0 0 32 48" width="64" height="96" shapeRendering="crispEdges">
          {/* HEADBOARD top */}
          <rect x="2" y="0" width="28" height="2" fill="#F59E0B" stroke={C} strokeWidth=".4"/>
          {/* HEADBOARD body */}
          <rect x="2" y="2" width="28" height="8" fill="#FBBF77" stroke={C} strokeWidth=".5"/>
          {/* slats on headboard */}
          {[5,9,13,17,21,25].map(sx => <rect key={sx} x={sx} y="3" width="1" height="6" fill="#F59E0B"/>)}
          {/* mattress TOP */}
          <rect x="3" y="10" width="26" height="22" fill="#FBCFE8" stroke={C} strokeWidth=".5"/>
          {/* pillow — pixel-art block */}
          <rect x="9"   y="12" width="14" height="4.5" fill="#FFFFFF"/>
          <rect x="8.3" y="13" width="0.7" height="2.5" fill="#FFFFFF"/>
          <rect x="22.8" y="13" width="0.7" height="2.5" fill="#FFFFFF"/>
          <rect x="10"  y="12.4" width="12" height="0.8" fill="#FEFEFE"/>
          <rect x="9"   y="15.4" width="14" height="1.1" fill="#E5E7EB"/>
          <rect x="15.7" y="13" width="0.5" height="3" fill="#D1D5DB" opacity=".6"/>
          {/* blanket */}
          <rect x="4" y="18" width="24" height="13" fill="#A7F3D0" stroke={C} strokeWidth=".4"/>
          <rect x="4" y="18" width="24" height="1" fill="#FFFFFF"/>
          {/* SIDE RAILS (vertical bars going up from mattress sides) */}
          {[3,6,9,12,15,18,21,24,27].map(sx => <rect key={sx} x={sx} y="10" width=".8" height="22" fill="#F59E0B" opacity=".7"/>)}
          {/* mattress FRONT thickness */}
          <rect x="2" y="32" width="28" height="3" fill="#E89BB7" stroke={C} strokeWidth=".4"/>
          {/* footboard top */}
          <rect x="2" y="35" width="28" height="2" fill="#F59E0B" stroke={C} strokeWidth=".4"/>
          {/* footboard body */}
          <rect x="2" y="37" width="28" height="5" fill="#FBBF77" stroke={C} strokeWidth=".5"/>
          {/* legs */}
          <rect x="3" y="42" width="3" height="5" fill="#7C4F2C" stroke={C} strokeWidth=".4"/>
          <rect x="26" y="42" width="3" height="5" fill="#7C4F2C" stroke={C} strokeWidth=".4"/>
          {/* stuffie at foot of bed */}
          <text x="24" y="30" fontSize="4" textAnchor="middle">🐻</text>
        </svg>
      </div>
    );
  }

  // ─── CRASH CART v2 — red emergency cart with drawers + defib top ───
  function CrashCartV2({ x = 0, y = 0 }) {
    return (
      <div style={{ position: 'absolute', left: x, top: y, width: 40, height: 80, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.3))' }}>
        <svg viewBox="0 0 20 40" width="40" height="80" shapeRendering="crispEdges">
          {/* defib on top */}
          <rect x="3" y="0" width="14" height="4" fill="#FACC15" stroke={C} strokeWidth=".4"/>
          <text x="10" y="3" fontSize="2" textAnchor="middle" fill={C}>⚡</text>
          {/* TOP face of cart */}
          <path d="M 2 4 L 18 4 L 19 6 L 1 6 Z" fill="#B91C1C" stroke={C} strokeWidth=".4"/>
          {/* body */}
          <rect x="1" y="6" width="18" height="28" fill="#DC2626" stroke={C} strokeWidth=".5"/>
          <rect x="1" y="6" width="1.5" height="28" fill="#F87171"/>
          {/* drawers (5 visible) */}
          {[7,12,17,22,27].map((dy, i) => (
            <g key={i}>
              <rect x="3" y={dy} width="14" height="3.5" fill="#fff" stroke={C} strokeWidth=".3"/>
              <rect x="3" y={dy} width="14" height=".5" fill="#F3F4F6"/>
              <rect x="9" y={dy + 1.5} width="2" height=".8" fill="#FACC15" stroke={C} strokeWidth=".2"/>
              <text x="5" y={dy + 2.5} fontSize="1.2" fill={C} fontFamily="monospace">{['ABC','MEDS','IV','ECG','SUC'][i]}</text>
            </g>
          ))}
          {/* base */}
          <rect x="1" y="34" width="18" height="2" fill="#7F1D1D" stroke={C} strokeWidth=".4"/>
          {/* wheels */}
          <ellipse cx="3" cy="38" rx="2" ry="1.5" fill={C}/>
          <ellipse cx="17" cy="38" rx="2" ry="1.5" fill={C}/>
        </svg>
      </div>
    );
  }

  // ─── SURGICAL LIGHT v2 — ceiling-mounted dome lamp ────────────
  function SurgLightV2({ x = 0, y = 0 }) {
    return (
      <div style={{ position: 'absolute', left: x, top: y, width: 88, height: 56, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.25))' }}>
        <svg viewBox="0 0 44 28" width="88" height="56" shapeRendering="crispEdges">
          {/* ceiling mount */}
          <rect x="20" y="0" width="4" height="3" fill="#374151" stroke={C} strokeWidth=".4"/>
          {/* swing arm */}
          <rect x="21" y="3" width="2" height="8" fill="#9CA3AF" stroke={C} strokeWidth=".3"/>
          {/* DOME top (where you see from above) */}
          <ellipse cx="22" cy="14" rx="16" ry="5" fill="#F1F5F9" stroke={C} strokeWidth=".5"/>
          <ellipse cx="22" cy="13" rx="15" ry="4" fill="#FFFFFF"/>
          {/* dome side band */}
          <path d="M 6 14 L 38 14 L 36 18 L 8 18 Z" fill="#E5E7EB" stroke={C} strokeWidth=".4"/>
          {/* light source array (visible from below — multiple bulbs) */}
          {[10,14,18,22,26,30,34].map((bx, i) => (
            <circle key={i} cx={bx} cy="19.5" r="2" fill="#FEF08A" stroke={C} strokeWidth=".3"/>
          ))}
          {/* center bulb glowing brighter */}
          <circle cx="22" cy="19.5" r="2" fill="#FFFFFF"/>
          {/* glow */}
          <ellipse cx="22" cy="24" rx="18" ry="3" fill="#FEF08A" opacity=".4"/>
        </svg>
      </div>
    );
  }

  // ─── PYXIS MED DISPENSER v2 — tall locked med cabinet ─────────────
  function PyxisV2({ x = 0, y = 0 }) {
    return (
      <div style={{ position: 'absolute', left: x, top: y, width: 40, height: 84, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.32))' }}>
        <svg viewBox="0 0 20 42" width="40" height="84" shapeRendering="crispEdges">
          {/* TOP face */}
          <path d="M 2 1 L 18 1 L 19 4 L 1 4 Z" fill="#6B7280" stroke={C} strokeWidth=".4"/>
          {/* body */}
          <rect x="1" y="4" width="18" height="34" fill="#94A3B8" stroke={C} strokeWidth=".5"/>
          <rect x="1" y="4" width="1.5" height="34" fill="#CBD5E1"/>
          {/* big touchscreen */}
          <rect x="3" y="6" width="14" height="14" fill="#0F1A24" stroke={C} strokeWidth=".4"/>
          <text x="10" y="9" fontSize="2" fill="#22D3EE" textAnchor="middle" fontFamily="monospace">PYXIS</text>
          <rect x="4" y="11" width="5" height="3" fill="#10B981" opacity=".7"/>
          <rect x="11" y="11" width="5" height="3" fill="#22D3EE" opacity=".7"/>
          <rect x="4" y="15" width="12" height="1" fill="#22D3EE"/>
          <rect x="4" y="17" width="8" height="1" fill="#22D3EE"/>
          {/* fingerprint reader */}
          <circle cx="10" cy="22" r="1.5" fill="#3B82F6" stroke={C} strokeWidth=".3"/>
          {/* drawers (5 of them) */}
          {[24, 27, 30, 33, 36].map((dy, i) => (
            <g key={i}>
              <rect x="3" y={dy} width="14" height="2.5" fill="#fff" stroke={C} strokeWidth=".3"/>
              <rect x="9" y={dy + 1} width="2" height=".8" fill="#FACC15"/>
              {/* lock icon */}
              <rect x="4" y={dy + .8} width="1" height="1" fill="#EF4444"/>
            </g>
          ))}
          {/* base */}
          <rect x="1" y="38" width="18" height="3" fill="#4B5563" stroke={C} strokeWidth=".4"/>
          <rect x="3" y="40" width="3" height="2" fill={C}/>
          <rect x="14" y="40" width="3" height="2" fill={C}/>
        </svg>
      </div>
    );
  }

  // ─── LAMINAR FLOW HOOD v2 — pharmacy clean room hood ─────────────
  function LaminarHoodV2({ x = 0, y = 0 }) {
    return (
      <div style={{ position: 'absolute', left: x, top: y, width: 96, height: 80, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.28))' }}>
        <svg viewBox="0 0 48 40" width="96" height="80" shapeRendering="crispEdges">
          {/* HEPA filter cap on top */}
          <path d="M 4 1 L 44 1 L 45 4 L 3 4 Z" fill="#475569" stroke={C} strokeWidth=".4"/>
          <rect x="3" y="4" width="42" height="2" fill="#374151" stroke={C} strokeWidth=".3"/>
          <text x="24" y="5.5" fontSize="1.2" fill="#fff" textAnchor="middle" fontFamily="monospace">HEPA ↓</text>
          {/* main hood body — front face */}
          <rect x="2" y="6" width="44" height="24" fill="#D1D5DB" stroke={C} strokeWidth=".5"/>
          {/* glass sash */}
          <rect x="4" y="8" width="40" height="14" fill="#A8DCEC" stroke={C} strokeWidth=".4"/>
          <rect x="4.5" y="8.5" width="39" height="1" fill="#D4F0F8"/>
          {/* hash pattern on glass */}
          <line x1="4" y1="12" x2="44" y2="12" stroke="#fff" strokeWidth=".5" opacity=".5"/>
          <line x1="4" y1="16" x2="44" y2="16" stroke="#fff" strokeWidth=".5" opacity=".5"/>
          {/* work surface (visible from above) */}
          <rect x="4" y="22" width="40" height="6" fill="#fff" stroke={C} strokeWidth=".4"/>
          {/* equipment on work surface (syringes, vials) */}
          <rect x="6" y="23" width="12" height="1.2" fill="#4B5563"/>
          <rect x="6" y="25" width="8" height="1.2" fill="#4B5563"/>
          <rect x="22" y="23" width="4" height="4" fill="#A5B4FC" stroke={C} strokeWidth=".3"/>
          <rect x="28" y="23" width="4" height="4" fill="#FEF08A" stroke={C} strokeWidth=".3"/>
          <rect x="34" y="23" width="4" height="4" fill="#FBCFE8" stroke={C} strokeWidth=".3"/>
          {/* base/legs */}
          <rect x="2" y="30" width="44" height="3" fill="#9CA3AF" stroke={C} strokeWidth=".4"/>
          <rect x="3" y="33" width="4" height="5" fill="#4B5563" stroke={C} strokeWidth=".4"/>
          <rect x="41" y="33" width="4" height="5" fill="#4B5563" stroke={C} strokeWidth=".4"/>
        </svg>
      </div>
    );
  }

  // ─── SURGICAL SINK v2 — scrub station with knee-paddle taps ───────
  function SinkV2({ x = 0, y = 0 }) {
    return (
      <div style={{ position: 'absolute', left: x, top: y, width: 56, height: 64, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.28))' }}>
        <svg viewBox="0 0 28 32" width="56" height="64" shapeRendering="crispEdges">
          {/* faucet arm (curving down) */}
          <rect x="13" y="0" width="2" height="6" fill="#9CA3AF" stroke={C} strokeWidth=".4"/>
          <rect x="13" y="6" width="6" height="2" fill="#9CA3AF" stroke={C} strokeWidth=".4"/>
          <rect x="17" y="8" width="2" height="3" fill="#6B7280" stroke={C} strokeWidth=".4"/>
          {/* running water */}
          <rect x="17.5" y="11" width="1" height="4" fill="#7DD3FC"/>
          {/* knobs */}
          <ellipse cx="10" cy="4" rx="1.5" ry="1" fill="#3B82F6" stroke={C} strokeWidth=".3"/>
          <ellipse cx="22" cy="4" rx="1.5" ry="1" fill="#EF4444" stroke={C} strokeWidth=".3"/>
          {/* basin rim (top face) */}
          <ellipse cx="14" cy="14" rx="12" ry="4" fill="#E5E7EB" stroke={C} strokeWidth=".5"/>
          <ellipse cx="14" cy="13" rx="11" ry="3" fill="#F3F4F6"/>
          {/* water in basin */}
          <ellipse cx="14" cy="15" rx="10" ry="2.5" fill="#A8DCEC"/>
          {/* basin FRONT face (depth) */}
          <path d="M 2 14 L 26 14 L 24 22 L 4 22 Z" fill="#9CA3AF" stroke={C} strokeWidth=".4"/>
          {/* base/pipe */}
          <rect x="12" y="22" width="4" height="3" fill="#6B7280" stroke={C} strokeWidth=".4"/>
          {/* knee paddle */}
          <rect x="6" y="25" width="16" height="3" fill="#94A3B8" stroke={C} strokeWidth=".4"/>
          <rect x="6.5" y="25.5" width="15" height="1" fill="#CBD5E1"/>
          {/* legs */}
          <rect x="4" y="28" width="3" height="4" fill="#4B5563" stroke={C} strokeWidth=".3"/>
          <rect x="21" y="28" width="3" height="4" fill="#4B5563" stroke={C} strokeWidth=".3"/>
        </svg>
      </div>
    );
  }

  // ─── BED v2 — 45° top-down with visible TOP + FRONT faces ─────────
  // The bed footprint is 32×32 (top face). The top face shows the mattress
  // surface (where you can see the pillow + blanket from above). Below the
  // top face, the front edge of the mattress + footboard + visible legs are
  // drawn — so the full bed reads as a 3D box.
  function BedV2({ x = 0, y = 0, color = 'wood' }) {
    const palette = {
      wood:  { frame: '#7C4F2C', frameDk: '#5C3A1A', frameLt: '#A88862', blanket: '#A8D8E8', blanketDk: '#5E8FA8' },
      green: { frame: '#7C4F2C', frameDk: '#5C3A1A', frameLt: '#A88862', blanket: '#86EFAC', blanketDk: '#4ADE80' },
      pink:  { frame: '#7C4F2C', frameDk: '#5C3A1A', frameLt: '#A88862', blanket: '#FBCFE8', blanketDk: '#F9A8D4' },
    }[color];
    const p = palette;

    return (
      <div style={{
        position: 'absolute', left: x, top: y,
        width: 64, height: 112,
        imageRendering: 'pixelated',
        filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.3))',
      }}>
        <svg viewBox="0 0 32 56" width="64" height="112" shapeRendering="crispEdges">
          {/* ═══ TOP FACE (mattress surface viewed from above-angle) ═══
              This is the main "floor footprint" of the bed — 32 wide × 38 tall.
              You see the pillow + blanket from directly above. */}

          {/* Headboard TOP edge (slightly recessed up at the head) */}
          <rect x="2" y="0" width="28" height="2" fill={p.frameLt} stroke={C} strokeWidth=".5"/>
          {/* Headboard small top-face highlight */}
          <rect x="3" y=".5" width="26" height=".8" fill="#C4A07C"/>

          {/* Mattress TOP surface (you look DOWN at it) */}
          <rect x="1" y="2" width="30" height="36" fill="#FFFFFF" stroke={C} strokeWidth=".5"/>
          {/* mattress shading on top — subtle diagonal */}
          <rect x="1.5" y="2.5" width="29" height="1" fill="#FEFEFE"/>

          {/* PILLOW (sitting ON the mattress top, near the head) */}
          {/* Pillow top face */}
          <ellipse cx="16" cy="7" rx="11" ry="3.5" fill="#FFFFFF" stroke={C} strokeWidth=".4"/>
          <ellipse cx="16" cy="6.7" rx="10" ry="2.5" fill="#FEFEFE"/>
          {/* Pillow front edge (visible because we look from 45°) */}
          <path d="M 5 7.5 Q 16 11 27 7.5 L 26.5 9.5 Q 16 12.5 5.5 9.5 Z" fill="#E5E5E5" stroke={C} strokeWidth=".3"/>
          {/* Pillow seam */}
          <line x1="16" y1="4.5" x2="16" y2="9.5" stroke={C} strokeWidth=".2" opacity=".3"/>

          {/* BLANKET (covering the lower 2/3 of the mattress top) */}
          {/* Sheet showing above blanket (white strip) */}
          <rect x="1" y="14" width="30" height="1.5" fill="#FFFFFF"/>
          {/* Blanket top surface */}
          <rect x="1" y="15" width="30" height="22" fill={p.blanket} stroke={C} strokeWidth=".5"/>
          {/* Blanket fold seam at top */}
          <rect x="1" y="14.5" width="30" height="1" fill={p.blanketDk}/>
          {/* Blanket pinch/fold lines */}
          <line x1="9"  y1="16" x2="9"  y2="37" stroke={p.blanketDk} strokeWidth=".3" opacity=".4"/>
          <line x1="16" y1="16" x2="16" y2="37" stroke={p.blanketDk} strokeWidth=".25" opacity=".25"/>
          <line x1="23" y1="16" x2="23" y2="37" stroke={p.blanketDk} strokeWidth=".3" opacity=".4"/>
          {/* Bottom shadow on blanket */}
          <rect x="1" y="34" width="30" height="3" fill={p.blanketDk} opacity=".7"/>

          {/* ═══ FRONT FACE (mattress thickness) ═══
              Below the top face — viewer sees this because of 45° angle. */}
          {/* Mattress FRONT edge (the side you'd see if you crouched in front) */}
          <rect x="1" y="38" width="30" height="4" fill="#E8E5D4" stroke={C} strokeWidth=".5"/>
          {/* highlight on top of front edge */}
          <rect x="2" y="38.5" width="28" height=".6" fill="#FFFFFF"/>
          {/* Mattress bottom shading */}
          <rect x="1" y="41" width="30" height="1" fill="#C8C4B0"/>

          {/* ═══ BED FRAME / BOX SPRING (front face) ═══ */}
          <rect x="1" y="42" width="30" height="4" fill={p.frame} stroke={C} strokeWidth=".5"/>
          <rect x="2" y="42.5" width="28" height=".8" fill={p.frameLt}/>
          {/* wood grain */}
          <line x1="2" y1="44" x2="30" y2="44" stroke={p.frameDk} strokeWidth=".2" opacity=".6"/>
          <line x1="2" y1="45" x2="30" y2="45" stroke={p.frameDk} strokeWidth=".2" opacity=".4"/>

          {/* ═══ LEGS (4 visible — full thickness boxes with top + front) ═══ */}
          {/* Front-left leg */}
          <rect x="2" y="46" width="4" height="8" fill={p.frameDk} stroke={C} strokeWidth=".5"/>
          <rect x="2.5" y="46.5" width="1.5" height="7" fill={p.frameLt}/>
          <rect x="4.5" y="46.5" width="1" height="7" fill={p.frame}/>
          {/* Front-right leg */}
          <rect x="26" y="46" width="4" height="8" fill={p.frameDk} stroke={C} strokeWidth=".5"/>
          <rect x="26.5" y="46.5" width="1.5" height="7" fill={p.frameLt}/>
          <rect x="28.5" y="46.5" width="1" height="7" fill={p.frame}/>
        </svg>

        {/* Headboard rises BEHIND the bed — drawn as a separate element so it
            appears "behind" the top mattress surface (and slightly above the bed
            container). */}
        <div style={{
          position: 'absolute', left: 4, top: -16, width: 56, height: 22,
          imageRendering: 'pixelated', filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.25))',
        }}>
          <svg viewBox="0 0 28 11" width="56" height="22" shapeRendering="crispEdges">
            {/* headboard top face */}
            <rect x="1" y="0" width="26" height="2" fill={p.frameLt} stroke={C} strokeWidth=".5"/>
            {/* headboard front face */}
            <rect x="1" y="2" width="26" height="9" fill={p.frame} stroke={C} strokeWidth=".5"/>
            {/* inset panel */}
            <rect x="3" y="3" width="22" height="6" fill={p.frameDk}/>
            <rect x="4" y="3.8" width="20" height=".6" fill={p.frame}/>
            <rect x="4" y="5.4" width="20" height=".6" fill={p.frame}/>
            <rect x="4" y="7"   width="20" height=".6" fill={p.frame}/>
          </svg>
        </div>
      </div>
    );
  }

  // ─── FRIDGE v2 — TOP face + FRONT face both visible ────────────────
  // Footprint 28×30. From above-front angle: viewer sees the TOP (a flat
  // rectangle) AND the FRONT (door, handles, kickplate). The TOP slopes
  // back into the page, drawn as a foreshortened trapezoid-ish band.
  function FridgeV2({ x = 0, y = 0 }) {
    return (
      <div style={{ position: 'absolute', left: x, top: y, width: 56, height: 96, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.32))' }}>
        <svg viewBox="0 0 28 48" width="56" height="96" shapeRendering="crispEdges">
          {/* ═══ TOP FACE (sloped back at perspective angle) ═══
              Drawn as a parallelogram-shaped band giving the impression of
              looking down onto the top of the fridge. */}
          <path d="M 4 0 L 26 0 L 28 6 L 2 6 Z" fill="#D1D5DB" stroke={C} strokeWidth=".5"/>
          {/* top face highlight (left edge catches light) */}
          <path d="M 4 0 L 26 0 L 25 1 L 5 1 Z" fill="#F3F4F6"/>
          {/* small vent on top */}
          <rect x="11" y="2.5" width="6" height="1.5" fill="#9CA3AF" stroke={C} strokeWidth=".3"/>
          <line x1="12" y1="3.2" x2="16" y2="3.2" stroke={C} strokeWidth=".2"/>

          {/* ═══ FRONT FACE (the body) ═══ */}
          <rect x="2" y="6" width="26" height="38" fill="#E5E7EB" stroke={C} strokeWidth=".5"/>
          {/* right side darker (light coming from upper-left) */}
          <rect x="26" y="6" width="2" height="38" fill="#9CA3AF" opacity=".5"/>
          {/* left edge highlight */}
          <rect x="2" y="6" width="1.5" height="38" fill="#FFFFFF" opacity=".4"/>

          {/* Freezer / fridge division (horizontal seam) */}
          <line x1="2" y1="16" x2="28" y2="16" stroke={C} strokeWidth=".7"/>

          {/* Freezer door (top section) */}
          <rect x="3" y="7" width="24" height="8" fill="#F3F4F6" stroke={C} strokeWidth=".3"/>
          {/* control panel + display */}
          <rect x="5" y="9" width="6" height="4" fill="#1F2937" stroke={C} strokeWidth=".3"/>
          <rect x="6" y="10" width="1" height="1" fill="#10B981"/>
          <rect x="7.5" y="10" width="1" height="1" fill="#FACC15"/>
          <rect x="6" y="11.5" width="4" height=".6" fill="#22D3EE"/>
          {/* freezer door handle (vertical bar) */}
          <rect x="22" y="9" width="1.5" height="5" fill="#6B7280" stroke={C} strokeWidth=".3"/>
          <rect x="22.3" y="9.2" width=".6" height="4.6" fill="#9CA3AF"/>

          {/* Fridge door (bottom section) */}
          <rect x="3" y="17" width="24" height="22" fill="#F3F4F6" stroke={C} strokeWidth=".3"/>
          {/* main fridge handle (vertical bar) */}
          <rect x="22" y="20" width="1.5" height="14" fill="#6B7280" stroke={C} strokeWidth=".3"/>
          <rect x="22.3" y="20.3" width=".6" height="13.5" fill="#9CA3AF"/>
          {/* magnet decoration on door */}
          <rect x="6" y="20" width="3" height="3" fill="#EF4444" stroke={C} strokeWidth=".3"/>
          <rect x="6.5" y="20.5" width="2" height="2" fill="#FCA5A5"/>

          {/* ═══ KICKPLATE + LEGS ═══ */}
          {/* kickplate (slightly inset) */}
          <rect x="2" y="44" width="26" height="2" fill="#4B5563" stroke={C} strokeWidth=".4"/>
          {/* legs */}
          <rect x="3" y="45" width="3" height="3" fill="#1F2937" stroke={C} strokeWidth=".4"/>
          <rect x="22" y="45" width="3" height="3" fill="#1F2937" stroke={C} strokeWidth=".4"/>
        </svg>
      </div>
    );
  }

  // ─── DESK v2 — TOP face (the wood surface) + FRONT apron + legs ───
  // The TOP is foreshortened. We see the FULL flat top from above-front,
  // and the FRONT apron is a darker band under the top edge.
  function DeskV2({ x = 0, y = 0, w = 144, h = 96 }) {
    return (
      <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.3))' }}>
        <svg viewBox={`0 0 ${w/2} ${h/2}`} width={w} height={h} shapeRendering="crispEdges">
          {/* ═══ TOP FACE (the wooden plank, viewed from above) ═══
              Slightly trapezoidal — back edge narrower than front for
              foreshortening effect. */}
          <path d={`M 6 2 L ${(w/2)-6} 2 L ${(w/2)-2} ${(h/2)-18} L 2 ${(h/2)-18} Z`}
                fill="#A88862" stroke={C} strokeWidth=".5"/>
          {/* top highlight (back edge catches light) */}
          <path d={`M 6 2 L ${(w/2)-6} 2 L ${(w/2)-7} 4 L 7 4 Z`} fill="#C4A07C"/>
          {/* wood grain lines (running along the long axis) */}
          <line x1="4" y1="10" x2={(w/2)-4} y2="10" stroke={C} strokeWidth=".2" opacity=".3"/>
          <line x1="3" y1="16" x2={(w/2)-3} y2="16" stroke={C} strokeWidth=".2" opacity=".3"/>
          <line x1="3" y1="22" x2={(w/2)-3} y2="22" stroke={C} strokeWidth=".15" opacity=".25"/>

          {/* ═══ FRONT APRON (thickness of the top, visible band) ═══ */}
          <rect x="2" y={(h/2)-18} width={(w/2)-4} height="4" fill="#7C5A38" stroke={C} strokeWidth=".5"/>
          {/* highlight along apron top */}
          <rect x="3" y={(h/2)-17.5} width={(w/2)-6} height=".7" fill="#956B40"/>

          {/* ═══ LEGS (4 visible — front 2 tall, back 2 small stubs) ═══ */}
          {/* back-left (tiny stub peeking out behind top — gives depth) */}
          <rect x="4" y="0" width="2" height="2.5" fill="#5C3A1A" stroke={C} strokeWidth=".4"/>
          <rect x={(w/2)-6} y="0" width="2" height="2.5" fill="#5C3A1A" stroke={C} strokeWidth=".4"/>

          {/* front-left leg (visible top + front faces) */}
          <rect x="3" y={(h/2)-14} width="4" height="12" fill="#5C3A1A" stroke={C} strokeWidth=".5"/>
          <rect x="3.5" y={(h/2)-13.5} width="1.5" height="11" fill="#7C4F2C"/>
          <rect x="5" y={(h/2)-13.5} width="1" height="11" fill="#3F2A18"/>

          {/* front-right leg */}
          <rect x={(w/2)-7} y={(h/2)-14} width="4" height="12" fill="#5C3A1A" stroke={C} strokeWidth=".5"/>
          <rect x={(w/2)-6.5} y={(h/2)-13.5} width="1.5" height="11" fill="#7C4F2C"/>
          <rect x={(w/2)-5} y={(h/2)-13.5} width="1" height="11" fill="#3F2A18"/>

          {/* ═══ ITEMS ON DESK ═══ */}
          {/* clipboard */}
          <rect x="10" y="5" width="9" height="13" fill="#FEF3C7" stroke={C} strokeWidth=".4"/>
          <rect x="13" y="3.5" width="3" height="2" fill="#9CA3AF" stroke={C} strokeWidth=".3"/>
          <line x1="11" y1="8"  x2="18" y2="8"  stroke={C} strokeWidth=".25"/>
          <line x1="11" y1="10" x2="18" y2="10" stroke={C} strokeWidth=".25"/>
          <line x1="11" y1="12" x2="18" y2="12" stroke={C} strokeWidth=".25"/>
          {/* coffee mug — top face (ellipse) + side */}
          <ellipse cx="28" cy="9" rx="3.5" ry="1.5" fill="#1F2937" stroke={C} strokeWidth=".4"/>
          <path d="M 24.5 9 L 24.5 13 Q 28 14.5 31.5 13 L 31.5 9" fill="#FFFFFF" stroke={C} strokeWidth=".4"/>
          <ellipse cx="28" cy="9" rx="2.7" ry="1" fill="#6B2C0E"/>
          {/* mug handle */}
          <path d="M 31.5 10 Q 33 11 31.5 12.5" fill="none" stroke={C} strokeWidth=".5"/>
          {/* monitor on desk */}
          <rect x="38" y="2" width="14" height="10" fill="#1F2937" stroke={C} strokeWidth=".5"/>
          <rect x="39" y="3" width="12" height="7" fill="#0F1A24"/>
          <rect x="40" y="4.5" width="10" height=".5" fill="#22D3EE"/>
          <rect x="40" y="6" width="10" height=".5" fill="#F87171"/>
          <rect x="40" y="7.5" width="10" height=".5" fill="#FACC15"/>
          <rect x="44" y="12" width="2" height="2" fill="#4B5563" stroke={C} strokeWidth=".3"/>
          <rect x="41" y="14" width="8" height="1.5" fill="#374151" stroke={C} strokeWidth=".3"/>
        </svg>
      </div>
    );
  }

  // ─── CHAIR v2 — top face of seat + front face + 4 legs ────────────
  function ChairV2({ x = 0, y = 0, color = '#EF4444' }) {
    const dark = darken(color, 0.65);
    const lite = lighten(color, 1.2);
    return (
      <div style={{ position: 'absolute', left: x, top: y, width: 40, height: 56, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.28))' }}>
        <svg viewBox="0 0 20 28" width="40" height="56" shapeRendering="crispEdges">
          {/* backrest TOP face (slim band at top showing thickness) */}
          <path d="M 4 1 L 16 1 L 17 2 L 3 2 Z" fill={lite} stroke={C} strokeWidth=".4"/>
          {/* backrest FRONT face */}
          <rect x="3" y="2" width="14" height="11" fill={color} stroke={C} strokeWidth=".5"/>
          {/* backrest panel detail */}
          <rect x="5" y="4" width="10" height="2" fill={dark} opacity=".55"/>
          <rect x="5" y="8" width="10" height="2" fill={dark} opacity=".55"/>
          <line x1="10" y1="3" x2="10" y2="12" stroke={dark} strokeWidth=".3" opacity=".5"/>

          {/* SEAT TOP face (you look down at the cushion) */}
          <path d="M 2 13 L 18 13 L 17 16 L 3 16 Z" fill={lite} stroke={C} strokeWidth=".5"/>
          <path d="M 2.5 13.5 L 17.5 13.5 L 17 14.5 L 3 14.5 Z" fill={color}/>

          {/* SEAT FRONT face (visible cushion thickness) */}
          <rect x="2" y="15.5" width="16" height="2.5" fill={dark} stroke={C} strokeWidth=".4"/>

          {/* LEGS (4 visible posts — front + back-peek) */}
          <rect x="2" y="18" width="2.5" height="9" fill="#5C3A1A" stroke={C} strokeWidth=".4"/>
          <rect x="15.5" y="18" width="2.5" height="9" fill="#5C3A1A" stroke={C} strokeWidth=".4"/>
          {/* leg highlights */}
          <rect x="2.3" y="18.3" width=".8" height="8.5" fill="#A88862"/>
          <rect x="15.8" y="18.3" width=".8" height="8.5" fill="#A88862"/>
          <rect x="3.6" y="18.3" width=".6" height="8.5" fill="#3F2A18"/>
          <rect x="17.1" y="18.3" width=".6" height="8.5" fill="#3F2A18"/>
        </svg>
      </div>
    );
  }

  // ─── DRESSER v2 — TOP face + FRONT with drawers + legs ─────────────
  function DresserV2({ x = 0, y = 0 }) {
    return (
      <div style={{ position: 'absolute', left: x, top: y, width: 72, height: 96, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.3))' }}>
        <svg viewBox="0 0 36 48" width="72" height="96" shapeRendering="crispEdges">
          {/* TOP face (you look down at it) */}
          <path d="M 4 0 L 32 0 L 34 5 L 2 5 Z" fill="#956B40" stroke={C} strokeWidth=".5"/>
          {/* top highlight (back edge catches light) */}
          <path d="M 5 .5 L 31 .5 L 30.5 1.5 L 5.5 1.5 Z" fill="#B68256"/>
          {/* item on top (jewelry box) */}
          <rect x="12" y="1.5" width="6" height="3" fill="#FACC15" stroke={C} strokeWidth=".3"/>
          <rect x="13" y="2" width="4" height="1" fill="#FFFFFF"/>
          {/* picture frame on top */}
          <rect x="22" y="1.5" width="5" height="3" fill="#7C4F2C" stroke={C} strokeWidth=".3"/>
          <rect x="22.5" y="2" width="4" height="2" fill="#A8DCEC"/>

          {/* FRONT face (body) */}
          <rect x="2" y="5" width="32" height="36" fill="#7C4F2C" stroke={C} strokeWidth=".5"/>
          {/* left edge highlight */}
          <rect x="2" y="5" width="1.5" height="36" fill="#A88862" opacity=".5"/>
          {/* right edge shadow */}
          <rect x="32.5" y="5" width="1.5" height="36" fill="#3F2A18" opacity=".5"/>

          {/* 4 DRAWERS */}
          {[0,1,2,3].map(i => {
            const top = 7 + i * 8;
            return (
              <g key={i}>
                <rect x="4" y={top} width="28" height="7" fill="#8B5A2B" stroke={C} strokeWidth=".4"/>
                <rect x="4.5" y={top + .5} width="27" height="1" fill="#A88862" opacity=".5"/>
                {/* drawer face inset detail */}
                <rect x="5" y={top + 1} width="26" height="5" fill="#8B5A2B" stroke={C} strokeWidth=".2"/>
                {/* handle */}
                <rect x="16" y={top + 3} width="4" height="1.4" fill="#FACC15" stroke={C} strokeWidth=".3"/>
                <rect x="16.3" y={top + 3.2} width="3.4" height=".4" fill="#FEF3C7"/>
              </g>
            );
          })}

          {/* LEGS (4 visible) */}
          <rect x="3" y="41" width="4" height="6" fill="#3F2A18" stroke={C} strokeWidth=".4"/>
          <rect x="29" y="41" width="4" height="6" fill="#3F2A18" stroke={C} strokeWidth=".4"/>
          <rect x="3.5" y="41.5" width="1.5" height="5" fill="#7C4F2C"/>
          <rect x="29.5" y="41.5" width="1.5" height="5" fill="#7C4F2C"/>
        </svg>
      </div>
    );
  }

  // ─── MONITOR v2 (computer monitor / TV on stand) ──────────────────
  function MonitorV2({ x = 0, y = 0 }) {
    return (
      <div style={{ position: 'absolute', left: x, top: y, width: 56, height: 72, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.32))' }}>
        <svg viewBox="0 0 28 36" width="56" height="72" shapeRendering="crispEdges">
          {/* TOP face of monitor housing */}
          <path d="M 4 2 L 24 2 L 26 4 L 2 4 Z" fill="#4B5563" stroke={C} strokeWidth=".4"/>
          {/* TOP highlight (back edge) */}
          <path d="M 5 2.5 L 23 2.5 L 22.5 3.2 L 5.5 3.2 Z" fill="#6B7280"/>

          {/* FRONT face of monitor housing */}
          <rect x="2" y="4" width="24" height="18" fill="#1F2937" stroke={C} strokeWidth=".5"/>
          {/* left edge highlight */}
          <rect x="2" y="4" width="1.2" height="18" fill="#374151"/>
          {/* SCREEN (recessed) */}
          <rect x="4" y="6" width="20" height="14" fill="#0F1A24" stroke={C} strokeWidth=".3"/>
          {/* screen content */}
          <rect x="5" y="8" width="18" height=".8" fill="#22D3EE"/>
          <rect x="5" y="10" width="18" height=".8" fill="#F87171"/>
          <rect x="5" y="12" width="14" height=".8" fill="#FACC15"/>
          <rect x="5" y="14" width="16" height=".8" fill="#10B981"/>
          {/* power LED */}
          <rect x="23" y="20" width="1" height="1" fill="#10B981"/>

          {/* STAND NECK */}
          <rect x="12" y="22" width="4" height="5" fill="#374151" stroke={C} strokeWidth=".4"/>
          <rect x="12.5" y="22.5" width="1" height="4" fill="#4B5563"/>

          {/* BASE — top face (ellipse-ish) + side */}
          <ellipse cx="14" cy="28.5" rx="9" ry="2" fill="#4B5563" stroke={C} strokeWidth=".5"/>
          <ellipse cx="14" cy="28" rx="8" ry="1.4" fill="#6B7280"/>
          <path d="M 5 28.5 Q 14 31 23 28.5 L 22 31 Q 14 33 6 31 Z" fill="#374151" stroke={C} strokeWidth=".4"/>

          {/* small legs at the front of base */}
          <rect x="5" y="31" width="2" height="3" fill="#1F2937" stroke={C} strokeWidth=".3"/>
          <rect x="21" y="31" width="2" height="3" fill="#1F2937" stroke={C} strokeWidth=".3"/>
        </svg>
      </div>
    );
  }

  // tiny color utils
  function darken(hex, f) {
    const n = parseInt(hex.slice(1), 16);
    const r = Math.max(0, Math.floor(((n >> 16) & 255) * f));
    const g = Math.max(0, Math.floor(((n >> 8) & 255) * f));
    const b = Math.max(0, Math.floor((n & 255) * f));
    return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
  }
  function lighten(hex, f) {
    const n = parseInt(hex.slice(1), 16);
    const r = Math.min(255, Math.floor(((n >> 16) & 255) * f));
    const g = Math.min(255, Math.floor(((n >> 8) & 255) * f));
    const b = Math.min(255, Math.floor((n & 255) * f));
    return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
  }

  // ─── COMPARISON SCREEN ─────────────────────────────────────────
  function ScreenObjectsCompare() {
    return (
      <div data-screen-label="Object 2.5D · v1 vs v2" style={{ height: '100%', background: '#E8E5D4', position: 'relative', overflow: 'auto' }}>
        <window.ForinTopBar
          title="2.5D Objects · v1 vs v2"
          left={<span style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 18, color: C }}>‹</span>}
          right={<span style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: C }}>비교</span>}
        />

        {/* Reference note */}
        <div style={{ margin: '14px 14px 0', background: '#FFF8E7', border: `2px solid ${C}`, padding: '8px 10px', fontFamily: '"Galmuri11",monospace', fontSize: 11, color: '#374151', lineHeight: 1.5, boxShadow: `3px 3px 0 0 ${C}` }}>
          🎮 <b>v2</b>는 RPG Maker 클래식 스타일.<br/>
          침대/책상/냉장고가 정면 + 측면 + 다리까지 보이도록 그렸어요.
        </div>

        <ComparisonRow title="🛏 Gurney (이동형 스트레처)" subtitle="ER·앜뷰런스 입실 용">
          <Variant label="v1 · 이름: Gurney">
            <div style={{ position: 'relative', width: 64, height: 100, transform: 'scale(2)', transformOrigin: 'top left' }}>
              <window.Gurney x={0} y={0} occupied/>
            </div>
          </Variant>
          <Variant label="v2 · 4바퀴 + 한드레일 + IV폴">
            <GurneyV2 x={0} y={0}/>
          </Variant>
        </ComparisonRow>

        <ComparisonRow title="⚡ Defibrillator (제세동기)" subtitle="ER 트라우마·ICU">
          <Variant label="v1 · 이름: Defib">
            <div style={{ position: 'relative', width: 48, height: 80, transform: 'scale(1.8)', transformOrigin: 'top left' }}>
              <window.Defib x={0} y={0}/>
            </div>
          </Variant>
          <Variant label="v2 · 패들+화면+카트">
            <DefibV2 x={0} y={0}/>
          </Variant>
        </ComparisonRow>

        <ComparisonRow title="💨 Ventilator (인공호흡기)" subtitle="ICU 궁중 환자용">
          <Variant label="v1 · 이름: Ventilator">
            <div style={{ position: 'relative', width: 32, height: 64, transform: 'scale(1.8)', transformOrigin: 'top left' }}>
              <window.Ventilator x={0} y={0}/>
            </div>
          </Variant>
          <Variant label="v2 · 스크린+노브+호흡튜브">
            <VentilatorV2 x={0} y={0}/>
          </Variant>
        </ComparisonRow>

        <ComparisonRow title="💉 IV Stand (링거 스탠드)" subtitle="모든 병실">
          <Variant label="v1 · 이름: IIV">
            <div style={{ position: 'relative', width: 32, height: 64, transform: 'scale(1.8)', transformOrigin: 'top left' }}>
              <window.IIV x={0} y={0}/>
            </div>
          </Variant>
          <Variant label="v2 · 후크+백+드립+베이스">
            <IVStandV2 x={0} y={0}/>
          </Variant>
        </ComparisonRow>

        <ComparisonRow title="🎉 Crib (소아 용 쿠션베드)" subtitle="소아과 병동">
          <Variant label="v1 · 이름: PedsBed">
            <div style={{ position: 'relative', width: 64, height: 96, transform: 'scale(2)', transformOrigin: 'top left' }}>
              <window.PedsBed x={0} y={0} occupied stuffie="🐻"/>
            </div>
          </Variant>
          <Variant label="v2 · 세로 레일+담요+곰인형">
            <CribV2 x={0} y={0}/>
          </Variant>
        </ComparisonRow>

        <ComparisonRow title="🚨 Crash Cart (응급 카트)" subtitle="ICU·ER">
          <Variant label="v1 · 이름: CrashCart">
            <div style={{ position: 'relative', width: 32, height: 64, transform: 'scale(1.8)', transformOrigin: 'top left' }}>
              <window.CrashCart x={0} y={0}/>
            </div>
          </Variant>
          <Variant label="v2 · 서람 5개 + 세동기 상단">
            <CrashCartV2 x={0} y={0}/>
          </Variant>
        </ComparisonRow>

        <ComparisonRow title="💡 Surgical Light (수술등)" subtitle="OR 수술실">
          <Variant label="v1 · 이름: SurgicalLight">
            <div style={{ position: 'relative', width: 64, height: 32, transform: 'scale(1.8)', transformOrigin: 'top left' }}>
              <window.SurgicalLight x={0} y={0}/>
            </div>
          </Variant>
          <Variant label="v2 · 천장마운트 + 돔형등">
            <SurgLightV2 x={0} y={0}/>
          </Variant>
        </ComparisonRow>

        <ComparisonRow title="💊 Pyxis (자동 약장)" subtitle="ICU·약국">
          <Variant label="v1 · 이름: PyxisMachine">
            <div style={{ position: 'relative', width: 48, height: 80, transform: 'scale(1.8)', transformOrigin: 'top left' }}>
              <window.PyxisMachine x={0} y={0}/>
            </div>
          </Variant>
          <Variant label="v2 · 터치스크린+지문+잠긴서람">
            <PyxisV2 x={0} y={0}/>
          </Variant>
        </ComparisonRow>

        <ComparisonRow title="🧪 Laminar Hood (무균후드)" subtitle="약국 IV 클린룸">
          <Variant label="v1 · 이름: LaminarHood">
            <div style={{ position: 'relative', width: 100, height: 64, transform: 'scale(1.5)', transformOrigin: 'top left' }}>
              <window.LaminarHood x={0} y={0}/>
            </div>
          </Variant>
          <Variant label="v2 · HEPA + 글래스샤시 + 바이얼">
            <LaminarHoodV2 x={0} y={0}/>
          </Variant>
        </ComparisonRow>

        <ComparisonRow title="🚿 Surgical Sink (스크럽 싱크)" subtitle="OR 손 소독">
          <Variant label="v1 · 이름: Sink">
            <div style={{ position: 'relative', width: 48, height: 48, transform: 'scale(1.8)', transformOrigin: 'top left' }}>
              <window.Sink x={0} y={0}/>
            </div>
          </Variant>
          <Variant label="v2 · 발판 + 수도꼭지 + 물줄기">
            <SinkV2 x={0} y={0}/>
          </Variant>
        </ComparisonRow>

        <ComparisonRow title="🛏 Bed (일반 병상)" subtitle="ER·병동 환자 침대">
          <Variant label="v1 · 현재">
            <div style={{ position: 'relative', width: 64, height: 100, transform: 'scale(2)', transformOrigin: 'top left' }}>
              <window.IBed x={0} y={0} variant="ward" occupied/>
            </div>
          </Variant>
          <Variant label="v2 · RPG Maker style">
            <div style={{ position: 'relative', width: 64, height: 96 }}>
              <BedV2 x={0} y={0} color="wood"/>
            </div>
            <div style={{ position: 'absolute', left: 80, top: 0 }}>
              <BedV2 x={0} y={0} color="green"/>
            </div>
            <div style={{ position: 'absolute', left: 160, top: 0 }}>
              <BedV2 x={0} y={0} color="pink"/>
            </div>
          </Variant>
        </ComparisonRow>

        <ComparisonRow title="🪑 책상 (Desk)" subtitle="개인 책상 — 2w × 1h 비율">
          <Variant label="v1 · IReception">
            <div style={{ position: 'relative', width: 64, height: 40, transform: 'scale(2)', transformOrigin: 'top left' }}>
              <window.IReception x={0} y={0} w={2} h={1} label="DESK"/>
            </div>
          </Variant>
          <Variant label="v2 · 1인 사무 책상">
            <DeskV2 x={0} y={0} w={120} h={72}/>
          </Variant>
        </ComparisonRow>

        <ComparisonRow title="🧊 냉장고 (Fridge)" subtitle="문 + 손잡이 + 받침">
          <Variant label="v1 · 단순 박스">
            <div style={{ position: 'relative', width: 40, height: 80 }}>
              <div style={{ position: 'absolute', inset: 0, background: '#E5E7EB', border: `2px solid ${C}`, boxShadow: `2px 3px 0 rgba(0,0,0,.2)` }}/>
              <div style={{ position: 'absolute', left: 1, right: 1, top: '38%', height: 2, background: C }}/>
              <div style={{ position: 'absolute', right: 4, top: 8, width: 2, height: 10, background: '#94A3B8'}}/>
              <div style={{ position: 'absolute', right: 4, bottom: 8, width: 2, height: 10, background: '#94A3B8'}}/>
            </div>
          </Variant>
          <Variant label="v2 · 입체 + 받침다리">
            <FridgeV2 x={0} y={0}/>
          </Variant>
        </ComparisonRow>

        <ComparisonRow title="🪑 의자 (Chair)" subtitle="등받이 + 다리 + 측면">
          <Variant label="v1 · 단순 의자">
            <div style={{ position: 'relative', width: 32, height: 32, transform: 'scale(1.5)', transformOrigin: 'top left' }}>
              <window.IChair x={0} y={0} color="#FED7AA" facing="up"/>
            </div>
          </Variant>
          <Variant label="v2 · 측면 + 4 legs">
            <ChairV2 x={0} y={0} color="#EF4444"/>
            <div style={{ position: 'absolute', left: 48, top: 0 }}>
              <ChairV2 x={0} y={0} color="#3B82F6"/>
            </div>
            <div style={{ position: 'absolute', left: 96, top: 0 }}>
              <ChairV2 x={0} y={0} color="#10B981"/>
            </div>
          </Variant>
        </ComparisonRow>

        <ComparisonRow title="🗄 서랍장 (Dresser)" subtitle="다중 서랍 + 손잡이 + 다리">
          <Variant label="v1 · 캐비닛">
            <div style={{ position: 'relative', width: 64, height: 48, transform: 'scale(1.5)', transformOrigin: 'top left' }}>
              <window.ICabinet x={0} y={0} w={4} h={1} variant="chart" label="CHART"/>
            </div>
          </Variant>
          <Variant label="v2 · 입체 서랍장">
            <DresserV2 x={0} y={0}/>
          </Variant>
        </ComparisonRow>

        <ComparisonRow title="📺 모니터 (Monitor)" subtitle="화면 + 스탠드 + 받침">
          <Variant label="v1 · 박스 + 다리">
            <div style={{ position: 'relative', width: 32, height: 40, transform: 'scale(1.5)', transformOrigin: 'top left' }}>
              <window.IMonitor x={0} y={0} beep/>
            </div>
          </Variant>
          <Variant label="v2 · TV 스타일">
            <MonitorV2 x={0} y={0}/>
          </Variant>
        </ComparisonRow>

        <div style={{ height: 30 }}/>
      </div>
    );
  }

  function ComparisonRow({ title, subtitle, children }) {
    return (
      <div style={{ margin: '14px 14px 0', background: '#FFFFFF', border: `3px solid ${C}`, boxShadow: `4px 4px 0 0 ${C}` }}>
        <div style={{ background: '#FEF08A', borderBottom: `2px solid ${C}`, padding: '5px 10px' }}>
          <div style={{ fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 13, color: C, lineHeight: 1.1 }}>{title}</div>
          <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 10, color: '#6B7280', marginTop: 2 }}>{subtitle}</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
          {children}
        </div>
      </div>
    );
  }

  function Variant({ label, children }) {
    return (
      <div style={{ borderLeft: `1.5px dashed ${C}44`, padding: '12px 10px', minHeight: 130, position: 'relative' }}>
        <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 9, color: '#6B7280', marginBottom: 8 }}>━ {label}</div>
        <div style={{ position: 'relative', height: 110 }}>{children}</div>
      </div>
    );
  }

  Object.assign(window, {
    BedV2, DeskV2, FridgeV2, ChairV2, DresserV2, MonitorV2,
    GurneyV2, DefibV2, VentilatorV2, IVStandV2, CribV2,
    CrashCartV2, SurgLightV2, PyxisV2, LaminarHoodV2, SinkV2,
    ScreenObjectsCompare,
  });
})();
