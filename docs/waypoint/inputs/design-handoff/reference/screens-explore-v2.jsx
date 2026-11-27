// screens-explore-v2.jsx — Top-down hospital CAMPUS, Pokemon GBA / Undertale style.
// Replaces the previous floor-interior version with a wide tile world full of
// pixel-art buildings, paths, gardens, trees and NPCs the player walks between.

(function () {
  const TILE = 16; // px per tile (pixel-perfect, doubled-up for crisp look at phone scale)
  const COLS = 26;
  const ROWS = 60;

  // Soft hospital-campus palette inspired by GBA-era town tiles.
  const P = {
    grassA: '#7DA86B', grassB: '#8FBC7B', grassDark: '#577A4C',
    pathA: '#C9B98A', pathB: '#B8A573', pathLine: '#897852',
    plaza: '#D9CDA4',
    asphalt: '#4A4A52', laneLine: '#E8DCB4',
    water: '#6FA8C7', waterDeep: '#3F86A8',
    wallA: '#E8DCC0', wallB: '#D4C29A', wallShade: '#9C8866',
    door: '#5C3A1A', doorAccent: '#C97E3A',
    window: '#9BC8E4', windowFrame: '#3C2A18',
    roofBlue: '#5C7AA8', roofBlueDk: '#3C5380', roofBlueLt: '#8AA8D0',
    roofRed: '#B0524A', roofRedDk: '#7E342E', roofRedLt: '#D58074',
    roofGreen: '#6E9560', roofGreenDk: '#4E6A42', roofGreenLt: '#94BC85',
    roofTeal: '#5E978A', roofTealDk: '#3E6E62',
    roofMauve: '#9573A0', roofMauveDk: '#6E4F7C',
    roofWhite: '#E8E2D2', roofWhiteDk: '#A8A292',
    tree: '#3E6B3A', treeLt: '#5E9554', treeDk: '#274422', trunk: '#5C3A1A',
    bush: '#5E9554',
    flower1: '#E8C25A', flower2: '#E47C7C', flower3: '#C284D6',
    ink: '#2A2522',
    red: '#D14242', redCross: '#FFFFFF',
    sign: '#3C2A18',
  };

  // ─── Buildings ──────────────────────────────────────────────────────
  // Top-down with roof visible. The "front face" sits in the bottom 1.5
  // tiles where the door + windows live, so the building reads as 3D-ish.
  // ─── BUILDING v2 — true 2.5D with visible TOP roof + RIGHT side + FRONT wall ─
  function Building({ x, y, w, h, roof, label, sign, accent, signColor, redCross, emblem, special, mainEntrance, onSelect }) {
    const rmid = roof.mid, rdk = roof.dk, rlt = roof.lt;
    const px = x * TILE, py = y * TILE, pw = w * TILE, ph = h * TILE;
    const wallH = TILE * 1.5; // front wall face

    return (
      <div onClick={onSelect} style={{
        position: 'absolute', left: px, top: py, width: pw, height: ph,
        imageRendering: 'pixelated', cursor: 'pointer',
        filter: 'drop-shadow(4px 6px 0 rgba(0,0,0,.3))',
      }}>
        {/* ROOF body (top face viewed from above) */}
        <div style={{
          position: 'absolute', left: 0, right: 0, top: 0, bottom: wallH,
          background: rmid,
          backgroundImage: `
            repeating-linear-gradient(90deg, ${rdk} 0 2px, transparent 2px ${TILE}px),
            repeating-linear-gradient(180deg, ${rdk}66 0 1px, transparent 1px ${TILE / 2}px)
          `,
          border: `2px solid ${P.ink}`,
        }}/>
        {/* roof top light edge */}
        <div style={{ position: 'absolute', left: 2, right: 2, top: 2, height: 3, background: rlt }}/>
        {/* roof right shadow (3D depth on top face) */}
        <div style={{ position: 'absolute', right: 2, top: 2, bottom: wallH + 2, width: 3, background: rdk, opacity: 0.5 }}/>
        {/* eaves overhang shadow at base of roof */}
        <div style={{ position: 'absolute', left: -2, right: -2, bottom: wallH - 2, height: 4, background: rdk, border: `1.5px solid ${P.ink}` }}>
          <div style={{ position: 'absolute', left: 1, right: 1, top: 1, height: 1, background: rlt, opacity: 0.6 }}/>
        </div>

        {/* CHIMNEY (decorative, on roof) */}
        {special !== 'flat' && w >= 4 && (
          <div style={{ position: 'absolute', left: pw - 22, top: -8, width: 10, height: 14, filter: 'drop-shadow(1px 2px 0 rgba(0,0,0,.3))' }}>
            {/* chimney top face */}
            <div style={{ position: 'absolute', left: 0, top: 0, right: 0, height: 2, background: '#3F2A18', border: `1px solid ${P.ink}` }}/>
            {/* chimney body */}
            <div style={{ position: 'absolute', left: 0, right: 0, top: 1, bottom: 0, background: P.wallShade, border: `1.5px solid ${P.ink}` }}>
              <div style={{ position: 'absolute', left: 1, top: 2, width: 1, height: 6, background: '#8E7A5E' }}/>
            </div>
            {/* smoke puff */}
            <div style={{ position: 'absolute', left: 2, top: -6, width: 4, height: 4, background: '#FFFFFF', opacity: 0.6, borderRadius: '50%', animation: 'forinBob 2.2s ease-in-out infinite' }}/>
          </div>
        )}

        {/* RED CROSS emblem on roof */}
        {redCross && (
          <div style={{ position: 'absolute', left: '50%', top: 6, transform: 'translateX(-50%)', width: 22, height: 22, background: '#fff', border: `2.5px solid ${P.ink}`, boxShadow: `2px 2px 0 0 ${P.ink}` }}>
            <div style={{ position: 'absolute', left: 8.5, top: 2, width: 5, height: 18, background: P.red}}/>
            <div style={{ position: 'absolute', left: 2, top: 8.5, width: 18, height: 5, background: P.red }}/>
          </div>
        )}

        {/* FACILITY emblem on roof (for non-cross buildings) — makes each
            building identifiable from above as its function */}
        {emblem && !redCross && (
          <div style={{ position: 'absolute', left: '50%', top: 6, transform: 'translateX(-50%)', width: 22, height: 22, background: '#fff', border: `2.5px solid ${P.ink}`, boxShadow: `2px 2px 0 0 ${P.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, lineHeight: 1 }}>
            {emblem}
          </div>
        )}

        {/* FRONT WALL FACE */}
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 0, height: wallH,
          background: P.wallA,
          borderLeft: `2px solid ${P.ink}`, borderRight: `2px solid ${P.ink}`, borderBottom: `2px solid ${P.ink}`,
          backgroundImage: `
            linear-gradient(180deg, ${P.wallShade}88 0 2px, transparent 2px),
            repeating-linear-gradient(90deg, ${P.wallShade}22 0 1px, transparent 1px ${TILE}px)
          `,
        }}>
          {/* windows */}
          {Array.from({ length: Math.max(1, w - 2) }).map((_, i) => {
            const centerIdx = Math.floor((w - 1) / 2) - 1;
            if (i === centerIdx) return null;
            return (
              <div key={i} style={{
                position: 'absolute', left: TILE * (i + 1) + 2, top: 5,
                width: TILE - 6, height: TILE - 6,
              }}>
                {/* sill */}
                <div style={{ position: 'absolute', left: -2, right: -2, bottom: -1, height: 2, background: '#8E7A5E', border: `1px solid ${P.ink}` }}/>
                {/* frame + glass */}
                <div style={{ position: 'absolute', inset: 0, background: P.window, border: `1.5px solid ${P.windowFrame}` }}>
                  <div style={{ position: 'absolute', left: 0, right: 0, top: '45%', height: 1, background: P.windowFrame }}/>
                  <div style={{ position: 'absolute', left: '45%', top: 0, bottom: 0, width: 1, background: P.windowFrame }}/>
                  {/* glass highlight */}
                  <div style={{ position: 'absolute', left: 1, right: '60%', top: 1, height: 2, background: '#FFFFFF', opacity: 0.5 }}/>
                </div>
              </div>
            );
          })}

          {/* DOOR — proper frame with top arch + handle */}
          <div style={{
            position: 'absolute', left: '50%', transform: 'translateX(-50%)',
            bottom: 0, width: TILE, height: TILE + 4,
            background: accent || P.door,
            border: `2px solid ${P.ink}`,
            borderBottom: 'none',
            backgroundImage: `linear-gradient(90deg, ${P.ink}33 0 1px, transparent 1px 4px)`,
          }}>
            {/* arch top */}
            <div style={{ position: 'absolute', left: 1, right: 1, top: 1, height: 2, background: P.doorAccent, opacity: 0.7 }}/>
            {/* handle */}
            <div style={{ position: 'absolute', right: 2, top: '60%', width: 2, height: 3, background: P.flower1 }}/>
            {/* steps in front */}
            {mainEntrance && (
              <>
                <div style={{ position: 'absolute', left: -4, right: -4, bottom: -2, height: 3, background: '#C8C0A8', border: `1.5px solid ${P.ink}` }}/>
                <div style={{ position: 'absolute', left: -6, right: -6, bottom: -5, height: 3, background: '#A8A088', border: `1.5px solid ${P.ink}` }}/>
              </>
            )}
            {/* awning */}
            {mainEntrance && (
              <div style={{ position: 'absolute', left: -3, top: -10, right: -3, height: 8, background: P.red, border: `1.5px solid ${P.ink}` }}>
                <div style={{ position: 'absolute', inset: 0, backgroundImage: `repeating-linear-gradient(90deg, transparent 0 3px, ${P.ink}33 3px 4px)` }}/>
              </div>
            )}
          </div>
        </div>

        {/* SIGN plaque on wall */}
        {sign && (
          <div style={{
            position: 'absolute', left: '50%', top: TILE * (h - 2.6), transform: 'translateX(-50%)',
            background: signColor || P.sign, color: '#fff',
            fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 9, lineHeight: 1,
            padding: '2px 6px', border: `1.5px solid ${P.ink}`, whiteSpace: 'nowrap',
            boxShadow: `2px 2px 0 0 ${P.ink}`,
          }}>{sign}</div>
        )}

        {/* tiny label tag */}
        {label && (
          <div style={{
            position: 'absolute', left: '50%', top: -16, transform: 'translateX(-50%)',
            background: '#fff', color: P.ink, border: `1.5px solid ${P.ink}`,
            fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 8, padding: '1px 4px',
            whiteSpace: 'nowrap', boxShadow: `1.5px 1.5px 0 0 ${P.ink}`,
          }}>{label}</div>
        )}
      </div>
    );
  }

  // ─── TREE v2 — true 2.5D canopy ball + visible trunk side ────────
  function Tree({ x, y, big }) {
    const s = big ? TILE * 2.2 : TILE * 1.7;
    return (
      <div style={{
        position: 'absolute', left: x * TILE - (big ? 6 : 4), top: y * TILE - (big ? 14 : 10),
        width: s, height: s + 6, imageRendering: 'pixelated',
        filter: 'drop-shadow(3px 5px 0 rgba(0,0,0,.22))',
      }}>
        <svg viewBox="0 0 20 24" width={s} height={s + 6} shapeRendering="crispEdges">
          {/* shadow under tree (round) */}
          <ellipse cx="10" cy="22" rx="6" ry="1.5" fill="rgba(0,0,0,.22)"/>
          {/* trunk SIDE (3D cylinder split) */}
          <rect x="8.5" y="17" width="3" height="5" fill={P.trunk} stroke={P.ink} strokeWidth=".5"/>
          <rect x="8.5" y="17" width="1" height="5" fill="#7B5A38"/>
          <rect x="10.5" y="17" width="1" height="5" fill="#3F2A10"/>
          {/* trunk top face peeking out (root flair) */}
          <ellipse cx="10" cy="17" rx="2" ry=".7" fill="#7B5A38" stroke={P.ink} strokeWidth=".3"/>
          {/* CANOPY — layered round masses (back darker, front lighter) */}
          <circle cx="10" cy="9"  r="9" fill={P.treeDk} stroke={P.ink} strokeWidth=".5"/>
          <circle cx="8.5" cy="8.5" r="7.5" fill={P.tree}/>
          <circle cx="11" cy="11" r="6" fill={P.tree}/>
          <circle cx="7.5" cy="7" r="4" fill={P.treeLt}/>
          <circle cx="12" cy="10" r="2.5" fill={P.treeLt}/>
          <circle cx="6" cy="11" r="1.5" fill={P.tree}/>
          {/* outline at canopy bottom (visible because we look from 45°) */}
          <path d="M 1 12 Q 10 18 19 12" fill="none" stroke={P.ink} strokeWidth=".5"/>
          {/* tiny apple/dot */}
          <circle cx="13.5" cy="9" r=".8" fill="#EF4444"/>
          <circle cx="7" cy="11" r=".7" fill="#EF4444"/>
        </svg>
      </div>
    );
  }

  // ─── BENCH v2 — top + front + visible legs ───────────────────────
  function Bench({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * TILE, top: y * TILE - 6, width: TILE * 2, height: TILE + 6, filter: 'drop-shadow(3px 3px 0 rgba(0,0,0,.22))' }}>
        <svg viewBox="0 0 32 22" width={TILE * 2} height={TILE + 6} shapeRendering="crispEdges">
          {/* back support frames */}
          <rect x="3" y="0" width="2" height="8" fill="#5C3A1A"/>
          <rect x="27" y="0" width="2" height="8" fill="#5C3A1A"/>
          {/* backrest top */}
          <rect x="2" y="2" width="28" height="3" fill="#8B5A2B" stroke={P.ink} strokeWidth=".4"/>
          <rect x="3" y="2.5" width="26" height="1" fill="#A88862"/>
          {/* seat top face */}
          <rect x="2" y="9" width="28" height="3" fill="#A88862" stroke={P.ink} strokeWidth=".4"/>
          <rect x="3" y="9.5" width="26" height="1" fill="#C49D6C"/>
          {/* seat front edge (thickness) */}
          <rect x="2" y="12" width="28" height="2" fill="#5C3A1A" stroke={P.ink} strokeWidth=".4"/>
          {/* legs (visible front + 1 middle) */}
          <rect x="3" y="14" width="3" height="7" fill="#3F2A10" stroke={P.ink} strokeWidth=".4"/>
          <rect x="3.5" y="14.5" width="1" height="6" fill="#7B5A38"/>
          <rect x="14.5" y="14" width="3" height="7" fill="#3F2A10" stroke={P.ink} strokeWidth=".4"/>
          <rect x="15" y="14.5" width="1" height="6" fill="#7B5A38"/>
          <rect x="26" y="14" width="3" height="7" fill="#3F2A10" stroke={P.ink} strokeWidth=".4"/>
          <rect x="26.5" y="14.5" width="1" height="6" fill="#7B5A38"/>
        </svg>
      </div>
    );
  }

  // ─── STREETLAMP — pole + lamp head with top + glow ───────────────
  function Streetlamp({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * TILE, top: y * TILE - 32, width: TILE, height: TILE * 3, filter: 'drop-shadow(2px 3px 0 rgba(0,0,0,.25))' }}>
        <svg viewBox="0 0 16 48" width={TILE} height={TILE * 3} shapeRendering="crispEdges">
          {/* base */}
          <rect x="6" y="42" width="4" height="4" fill="#4B5563" stroke={P.ink} strokeWidth=".4"/>
          <rect x="5" y="43" width="6" height="3" fill="#3F3D52" stroke={P.ink} strokeWidth=".4"/>
          {/* pole */}
          <rect x="7" y="12" width="2" height="30" fill="#4B5563"/>
          <rect x="7" y="12" width="1" height="30" fill="#6B7280"/>
          {/* lamp arm */}
          <rect x="7" y="10" width="2" height="2" fill="#4B5563"/>
          {/* lamp head — top face */}
          <rect x="3" y="3" width="10" height="2" fill="#4B5563" stroke={P.ink} strokeWidth=".4"/>
          <rect x="4" y="3.5" width="8" height="1" fill="#6B7280"/>
          {/* lamp shade */}
          <path d="M 3 5 L 13 5 L 11 10 L 5 10 Z" fill="#4B5563" stroke={P.ink} strokeWidth=".5"/>
          {/* glow */}
          <rect x="6" y="8" width="4" height="3" fill="#FACC15"/>
          <rect x="5" y="9" width="6" height="2" fill="#FEF08A"/>
          {/* light cone */}
          <path d="M 6 11 L 10 11 L 14 18 L 2 18 Z" fill="#FEF08A" opacity=".3"/>
        </svg>
      </div>
    );
  }

  // ─── TRASH CAN — cylindrical with top opening ───────────────────
  function TrashCan({ x, y, color = '#16A34A' }) {
    const dark = color === '#16A34A' ? '#15803D' : '#1E40AF';
    return (
      <div style={{ position: 'absolute', left: x * TILE + 2, top: y * TILE - 4, width: TILE - 4, height: TILE + 4, filter: 'drop-shadow(2px 2px 0 rgba(0,0,0,.22))' }}>
        <svg viewBox="0 0 12 20" width={TILE - 4} height={TILE + 4} shapeRendering="crispEdges">
          {/* top rim (ellipse) */}
          <ellipse cx="6" cy="4" rx="5" ry="1.5" fill={dark} stroke={P.ink} strokeWidth=".5"/>
          <ellipse cx="6" cy="3.5" rx="4" ry="1" fill="#1F2937"/>
          {/* body — slightly tapered cylinder */}
          <path d="M 1 4 L 11 4 L 10 18 L 2 18 Z" fill={color} stroke={P.ink} strokeWidth=".5"/>
          {/* light side */}
          <path d="M 1 4 L 3 4 L 3 18 L 2 18 Z" fill={dark} opacity=".4"/>
          {/* recycle/trash label */}
          <rect x="4" y="9" width="4" height="4" fill="#fff" stroke={P.ink} strokeWidth=".3"/>
          <path d="M 4.5 11 L 7.5 11 M 6 10 L 7.5 11 L 6 12" fill="none" stroke={dark} strokeWidth=".5"/>
        </svg>
      </div>
    );
  }

  // ─── MAILBOX — blue mailbox on post ─────────────────────────────
  function Mailbox({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * TILE, top: y * TILE - 10, width: TILE, height: TILE * 1.6, filter: 'drop-shadow(2px 2px 0 rgba(0,0,0,.22))' }}>
        <svg viewBox="0 0 16 26" width={TILE} height={TILE * 1.6} shapeRendering="crispEdges">
          {/* post */}
          <rect x="7" y="14" width="2" height="11" fill="#4B5563" stroke={P.ink} strokeWidth=".4"/>
          {/* box top face (rounded) */}
          <ellipse cx="8" cy="3" rx="6" ry="2" fill="#3B82F6" stroke={P.ink} strokeWidth=".5"/>
          {/* box body */}
          <path d="M 2 3 L 14 3 L 14 13 L 2 13 Z" fill="#3B82F6" stroke={P.ink} strokeWidth=".5"/>
          {/* highlight */}
          <rect x="2.5" y="3.5" width="11" height="1.2" fill="#60A5FA"/>
          {/* slot */}
          <rect x="4" y="6" width="8" height="1.5" fill="#1F2937"/>
          {/* USPS-style logo */}
          <rect x="5" y="9" width="6" height="2" fill="#fff" stroke={P.ink} strokeWidth=".3"/>
          <rect x="5.5" y="9.5" width="5" height=".8" fill="#3B82F6"/>
          {/* red flag */}
          <rect x="13" y="6" width="2" height="3" fill="#EF4444" stroke={P.ink} strokeWidth=".3"/>
        </svg>
      </div>
    );
  }

  // ─── FIRE HYDRANT — short red post with caps ────────────────────
  function Hydrant({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * TILE + 4, top: y * TILE + 2, width: TILE - 8, height: TILE - 2, filter: 'drop-shadow(1.5px 2px 0 rgba(0,0,0,.22))' }}>
        <svg viewBox="0 0 8 14" width={TILE - 8} height={TILE - 2} shapeRendering="crispEdges">
          {/* base */}
          <rect x="1" y="12" width="6" height="2" fill="#4B5563" stroke={P.ink} strokeWidth=".4"/>
          {/* body */}
          <rect x="2" y="3" width="4" height="9" fill="#DC2626" stroke={P.ink} strokeWidth=".4"/>
          <rect x="2" y="3.5" width="1" height="8" fill="#F87171"/>
          {/* side cap */}
          <rect x="0" y="6" width="2" height="3" fill="#B91C1C" stroke={P.ink} strokeWidth=".3"/>
          <rect x="6" y="6" width="2" height="3" fill="#B91C1C" stroke={P.ink} strokeWidth=".3"/>
          {/* top dome */}
          <ellipse cx="4" cy="3" rx="2.5" ry="1.2" fill="#FACC15" stroke={P.ink} strokeWidth=".4"/>
          {/* bolt on top */}
          <rect x="3.5" y="1.5" width="1" height="1" fill="#4B5563"/>
        </svg>
      </div>
    );
  }

  // ─── VENDING MACHINE — fridge-like with display ─────────────────
  function VendingMachine({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * TILE, top: y * TILE - 8, width: TILE, height: TILE * 1.8, filter: 'drop-shadow(3px 3px 0 rgba(0,0,0,.25))' }}>
        <svg viewBox="0 0 16 28" width={TILE} height={TILE * 1.8} shapeRendering="crispEdges">
          {/* top face */}
          <path d="M 1 2 L 15 2 L 14 4 L 2 4 Z" fill="#94A3B8" stroke={P.ink} strokeWidth=".4"/>
          {/* body */}
          <rect x="1" y="4" width="14" height="20" fill="#DC2626" stroke={P.ink} strokeWidth=".5"/>
          <rect x="1" y="4" width="1" height="20" fill="#F87171"/>
          {/* glass display */}
          <rect x="3" y="6" width="10" height="11" fill="#1F2937" stroke={P.ink} strokeWidth=".4"/>
          {/* drinks in display */}
          {[0,1,2].map(r => [0,1,2].map(c => (
            <rect key={r*3+c} x={3.5 + c*3} y={6.5 + r*3} width="2.5" height="2.5" fill={['#FACC15','#3B82F6','#10B981','#FBCFE8','#A78BFA','#FB923C','#EF4444','#22D3EE','#84CC16'][r*3+c]} stroke={P.ink} strokeWidth=".2"/>
          )))}
          {/* logo strip */}
          <rect x="3" y="18" width="10" height="2" fill="#fff" stroke={P.ink} strokeWidth=".3"/>
          <text x="8" y="19.5" fontSize="1.5" fill="#DC2626" textAnchor="middle" fontFamily="monospace">COLA</text>
          {/* keypad */}
          <rect x="3" y="20.5" width="6" height="2.5" fill="#1F2937" stroke={P.ink} strokeWidth=".3"/>
          {[0,1,2,3,4].map(i => (
            <rect key={i} x={3.3 + i*1.2} y={21} width=".8" height="1.5" fill="#374151"/>
          ))}
          {/* coin slot + dispenser */}
          <rect x="10" y="20.5" width="3" height=".8" fill="#1F2937"/>
          <rect x="10" y="22" width="3" height="1.5" fill="#374151" stroke={P.ink} strokeWidth=".3"/>
          {/* base */}
          <rect x="1" y="24" width="14" height="2" fill="#3F3D52" stroke={P.ink} strokeWidth=".4"/>
          {/* feet */}
          <rect x="2" y="26" width="2" height="2" fill="#1F2937"/>
          <rect x="12" y="26" width="2" height="2" fill="#1F2937"/>
        </svg>
      </div>
    );
  }

  // ─── PICNIC TABLE — table + bench seats both sides ──────────────
  function PicnicTable({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * TILE, top: y * TILE - 4, width: TILE * 2, height: TILE * 2, filter: 'drop-shadow(3px 3px 0 rgba(0,0,0,.22))' }}>
        <svg viewBox="0 0 32 32" width={TILE * 2} height={TILE * 2} shapeRendering="crispEdges">
          {/* back bench seat */}
          <rect x="2" y="6" width="28" height="3" fill="#A88862" stroke={P.ink} strokeWidth=".4"/>
          {/* table top */}
          <rect x="2" y="11" width="28" height="6" fill="#7C4F2C" stroke={P.ink} strokeWidth=".5"/>
          <rect x="3" y="11.5" width="26" height="1.2" fill="#A88862"/>
          {/* table grain */}
          <line x1="3" y1="14" x2="29" y2="14" stroke={P.ink} strokeWidth=".2" opacity=".4"/>
          {/* table thickness */}
          <rect x="2" y="16" width="28" height="2" fill="#5C3A1A" stroke={P.ink} strokeWidth=".4"/>
          {/* front bench seat */}
          <rect x="2" y="20" width="28" height="3" fill="#A88862" stroke={P.ink} strokeWidth=".4"/>
          {/* legs (X-frame visible) */}
          <line x1="5" y1="9"  x2="5"  y2="29" stroke="#5C3A1A" strokeWidth="2"/>
          <line x1="27" y1="9" x2="27" y2="29" stroke="#5C3A1A" strokeWidth="2"/>
          <line x1="3" y1="9"  x2="7"  y2="29" stroke="#5C3A1A" strokeWidth="1"/>
          <line x1="25" y1="9" x2="29" y2="29" stroke="#5C3A1A" strokeWidth="1"/>
        </svg>
      </div>
    );
  }

  // ─── HEDGE ROW — neat trimmed hedge segment ─────────────────────
  function Hedge({ x, y, w = 2 }) {
    return (
      <div style={{ position: 'absolute', left: x * TILE, top: y * TILE - 6, width: TILE * w, height: TILE + 4, filter: 'drop-shadow(2px 3px 0 rgba(0,0,0,.18))' }}>
        <svg viewBox={`0 0 ${w * 16} 22`} width={TILE * w} height={TILE + 6} shapeRendering="crispEdges" preserveAspectRatio="none">
          {/* top face */}
          <rect x="1" y="2" width={w * 16 - 2} height="4" fill={P.bush} stroke={P.ink} strokeWidth=".4"/>
          {/* highlights on top */}
          <rect x="2" y="2.5" width={w * 16 - 4} height="1" fill={P.treeLt}/>
          {/* front face */}
          <rect x="1" y="5" width={w * 16 - 2} height="14" fill="#4E7A4E" stroke={P.ink} strokeWidth=".4"/>
          {/* texture bumps on front */}
          {Array.from({ length: Math.floor(w * 5) }).map((_, i) => (
            <rect key={i} x={2 + i * 3} y="7" width="2" height="2" fill={P.bush}/>
          ))}
          {Array.from({ length: Math.floor(w * 5) }).map((_, i) => (
            <rect key={i} x={3 + i * 3} y="10" width="2" height="2" fill={P.treeLt}/>
          ))}
          {/* bottom shadow */}
          <rect x="1" y="17" width={w * 16 - 2} height="2" fill="#3B5C3B"/>
        </svg>
      </div>
    );
  }

  // ─── BUS STOP SIGN ───────────────────────────────────────────
  function BusStop({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * TILE + 2, top: y * TILE - 18, width: TILE, height: TILE * 2, filter: 'drop-shadow(2px 2px 0 rgba(0,0,0,.25))' }}>
        <svg viewBox="0 0 16 32" width={TILE - 4} height={TILE * 2} shapeRendering="crispEdges">
          {/* post */}
          <rect x="7" y="14" width="2" height="16" fill="#4B5563" stroke={P.ink} strokeWidth=".4"/>
          {/* sign top */}
          <path d="M 1 1 L 15 1 L 14 3 L 2 3 Z" fill="#1E40AF" stroke={P.ink} strokeWidth=".4"/>
          {/* sign body */}
          <rect x="1" y="3" width="14" height="11" fill="#3B82F6" stroke={P.ink} strokeWidth=".5"/>
          {/* logo */}
          <rect x="3" y="5" width="10" height="3" fill="#fff"/>
          <text x="8" y="7.5" fontSize="2.5" fill="#1F2937" textAnchor="middle" fontFamily="monospace">BUS</text>
          <text x="8" y="11" fontSize="1.8" fill="#fff" textAnchor="middle" fontFamily="monospace">STOP</text>
        </svg>
      </div>
    );
  }

  // ─── STATUE — pedestal + figure ─────────────────────────────────
  function Statue({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * TILE, top: y * TILE - 14, width: TILE, height: TILE * 1.8, filter: 'drop-shadow(3px 3px 0 rgba(0,0,0,.25))' }}>
        <svg viewBox="0 0 16 28" width={TILE} height={TILE * 1.8} shapeRendering="crispEdges">
          {/* pedestal top */}
          <path d="M 2 22 L 14 22 L 15 25 L 1 25 Z" fill="#A89272" stroke={P.ink} strokeWidth=".4"/>
          {/* pedestal body */}
          <rect x="2" y="22" width="12" height="6" fill="#8E7A5E" stroke={P.ink} strokeWidth=".5"/>
          <rect x="2.5" y="22.5" width="1" height="5" fill="#A89272"/>
          {/* plaque */}
          <rect x="5" y="24.5" width="6" height="2" fill="#3F2A18" stroke={P.ink} strokeWidth=".3"/>
          {/* statue body (figure of a person) */}
          <rect x="5" y="13" width="6" height="9" fill="#B8B098" stroke={P.ink} strokeWidth=".4"/>
          <rect x="5.5" y="13" width="1" height="8" fill="#D4CFB8"/>
          {/* head */}
          <ellipse cx="8" cy="11" rx="2.5" ry="2.5" fill="#B8B098" stroke={P.ink} strokeWidth=".4"/>
          <ellipse cx="7" cy="10.5" rx="1" ry="1.5" fill="#D4CFB8"/>
          {/* arm raised */}
          <rect x="10" y="13" width="2" height="6" fill="#B8B098" stroke={P.ink} strokeWidth=".3"/>
          <ellipse cx="11" cy="11" rx="1.5" ry="2" fill="#B8B098"/>
        </svg>
      </div>
    );
  }

  // ─── Bush ───────────────────────────────────────────────────────────
  function Bush({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * TILE, top: y * TILE, width: TILE, height: TILE }}>
        <svg viewBox="0 0 16 16" width={TILE} height={TILE} shapeRendering="crispEdges">
          <rect x="2" y="6" width="12" height="8" fill={P.bush} stroke={P.ink} strokeWidth=".5"/>
          <rect x="4" y="4" width="8" height="2" fill={P.bush}/>
          <rect x="3" y="7" width="2" height="2" fill={P.treeLt}/>
          <rect x="9" y="9" width="2" height="1" fill={P.treeLt}/>
        </svg>
      </div>
    );
  }

  // ─── Flower bed (1x1 tile) ──────────────────────────────────────────
  function Flowers({ x, y, c }) {
    return (
      <div style={{ position: 'absolute', left: x * TILE, top: y * TILE, width: TILE, height: TILE }}>
        <svg viewBox="0 0 16 16" width={TILE} height={TILE} shapeRendering="crispEdges">
          <rect x="2" y="10" width="12" height="4" fill="#7A5C32" stroke={P.ink} strokeWidth=".5"/>
          <rect x="3" y="7" width="2" height="2" fill={c}/>
          <rect x="7" y="6" width="2" height="2" fill={P.flower1}/>
          <rect x="11" y="7" width="2" height="2" fill={P.flower3}/>
          <rect x="5" y="9" width="1" height="1" fill={P.treeLt}/>
          <rect x="9" y="9" width="1" height="1" fill={P.treeLt}/>
        </svg>
      </div>
    );
  }

  // ─── PARKED CAR v2 — side profile (looks more natural, 2 wheels visible)
  // Car is drawn horizontally as if parked along the curb, viewed from the
  // upper-front at 45°. Shows roof top, windshield + side window glass,
  // body side panel, and 2 wheels on the visible side. 2 tiles wide × 1 tall.
  function ParkedCar({ x, y, color = '#EF4444' }) {
    const darken = (c) => c === '#EF4444' ? '#991B1B' : c === '#3B82F6' ? '#1E3A8A' : c === '#FACC15' ? '#A16207' : '#15803D';
    const dark = darken(color);
    return (
      <div style={{ position: 'absolute', left: x * TILE, top: y * TILE - 4, width: TILE * 2.4, height: TILE * 1.6, filter: 'drop-shadow(3px 4px 0 rgba(0,0,0,.3))' }}>
        <svg viewBox="0 0 38 24" width={TILE * 2.4} height={TILE * 1.6} shapeRendering="crispEdges">
          {/* roof top (the slim top face viewed from above-angle) */}
          <path d="M 11 1 L 27 1 L 28 4 L 10 4 Z" fill={color} stroke={P.ink} strokeWidth=".5"/>
          <rect x="12" y="1.5" width="14" height="1" fill="#FFFFFF" opacity=".5"/>
          {/* windshield + side windows (sloping band on top of body) */}
          <path d="M 10 4 L 28 4 L 30 8 L 8 8 Z" fill="#A8DCEC" stroke={P.ink} strokeWidth=".5"/>
          {/* window divider (B-pillar) */}
          <rect x="18" y="4" width="1" height="4" fill={dark}/>
          {/* glass highlight */}
          <path d="M 11 5 L 17 5 L 17 7 L 11 7 Z" fill="#D4F0F8"/>
          <path d="M 20 5 L 27 5 L 28 7 L 21 7 Z" fill="#D4F0F8"/>
          {/* body main (long side panel) */}
          <rect x="3" y="8" width="32" height="10" fill={color} stroke={P.ink} strokeWidth=".5"/>
          {/* body highlight (top edge) */}
          <rect x="3.5" y="8.5" width="31" height="1" fill="#FFFFFF" opacity=".3"/>
          {/* body shadow (bottom edge) */}
          <rect x="3" y="16" width="32" height="2" fill={dark} opacity=".55"/>
          {/* door line */}
          <line x1="18" y1="8" x2="18" y2="18" stroke={dark} strokeWidth=".4" opacity=".7"/>
          {/* door handle */}
          <rect x="14" y="11.5" width="2" height=".6" fill={dark}/>
          <rect x="22" y="11.5" width="2" height=".6" fill={dark}/>
          {/* wheel arches */}
          <path d="M 4 15 Q 8 12 12 15 L 12 18 L 4 18 Z" fill={dark} opacity=".4"/>
          <path d="M 26 15 Q 30 12 34 15 L 34 18 L 26 18 Z" fill={dark} opacity=".4"/>
          {/* wheels (2 visible — front + rear on this side) */}
          <ellipse cx="8" cy="18.5" rx="3" ry="2.5" fill={P.ink}/>
          <ellipse cx="30" cy="18.5" rx="3" ry="2.5" fill={P.ink}/>
          {/* wheel hubcaps */}
          <ellipse cx="8" cy="18.5" rx="1.5" ry="1.3" fill="#6B7280"/>
          <ellipse cx="30" cy="18.5" rx="1.5" ry="1.3" fill="#6B7280"/>
          <ellipse cx="8" cy="18" rx=".7" ry=".5" fill="#9CA3AF"/>
          <ellipse cx="30" cy="18" rx=".7" ry=".5" fill="#9CA3AF"/>
          {/* headlight (right side — pointing forward) */}
          <ellipse cx="35" cy="11" rx="1.2" ry="1.5" fill="#FACC15" stroke={P.ink} strokeWidth=".3"/>
          {/* tail light (left side) */}
          <rect x="2.5" y="10" width="1.5" height="3" fill="#FCA5A5" stroke={P.ink} strokeWidth=".3"/>
          {/* license plate */}
          <rect x="32" y="14" width="3" height="1.5" fill="#fff" stroke={P.ink} strokeWidth=".3"/>
        </svg>
      </div>
    );
  }

  // ─── AMBULANCE v2 — full 2.5D van ──────────────────────────────────
  function Ambulance({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * TILE, top: y * TILE - 6, width: TILE * 1.6, height: TILE * 3, filter: 'drop-shadow(3px 5px 0 rgba(0,0,0,.3))' }}>
        <svg viewBox="0 0 14 26" width={TILE * 1.6} height={TILE * 3} shapeRendering="crispEdges">
          {/* roof top */}
          <rect x="2" y="2" width="10" height="3" fill="#E5E7EB" stroke={P.ink} strokeWidth=".4"/>
          <rect x="2.5" y="2.5" width="9" height="1" fill="#fff"/>
          {/* light bar on roof */}
          <rect x="3" y="0.5" width="8" height="2" fill="#fff" stroke={P.ink} strokeWidth=".4"/>
          <rect x="4" y="0.7" width="2" height="1.2" fill="#3B82F6"/>
          <rect x="8" y="0.7" width="2" height="1.2" fill={P.red}/>
          {/* windshield */}
          <path d="M 2 5 L 12 5 L 13 8 L 1 8 Z" fill="#A8DCEC" stroke={P.ink} strokeWidth=".4"/>
          <path d="M 3 5.5 L 11 5.5 L 11 7 L 3 7 Z" fill="#D4F0F8"/>
          {/* body main */}
          <rect x="1" y="8" width="12" height="14" fill="#FFFFFF" stroke={P.ink} strokeWidth=".5"/>
          {/* right side shadow */}
          <rect x="11" y="8" width="2" height="14" fill="#E5E7EB" opacity=".7"/>
          {/* red stripe */}
          <rect x="1" y="11" width="12" height="2" fill={P.red}/>
          {/* large cross */}
          <rect x="5" y="14" width="4" height="6" fill={P.red}/>
          <rect x="3" y="16" width="8" height="2" fill={P.red}/>
          {/* rear bumper */}
          <rect x="1" y="22" width="12" height="2" fill="#94A3B8" stroke={P.ink} strokeWidth=".4"/>
          {/* wheels */}
          <ellipse cx="1.5" cy="10" rx="1" ry="1.5" fill={P.ink}/>
          <ellipse cx="12.5" cy="10" rx="1" ry="1.5" fill={P.ink}/>
          <ellipse cx="1.5" cy="20" rx="1" ry="1.5" fill={P.ink}/>
          <ellipse cx="12.5" cy="20" rx="1" ry="1.5" fill={P.ink}/>
          {/* AMBULANCE text */}
          <rect x="2" y="9" width="10" height="1.5" fill="#1F2937"/>
        </svg>
      </div>
    );
  }

  // ─── FOUNTAIN v2 — circular basin with raised center ───────────────
  function Fountain({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * TILE, top: y * TILE - 4, width: TILE * 3, height: TILE * 3.2, filter: 'drop-shadow(3px 4px 0 rgba(0,0,0,.28))' }}>
        <svg viewBox="0 0 48 52" width={TILE * 3} height={TILE * 3.2} shapeRendering="crispEdges">
          {/* outer rim (top) */}
          <ellipse cx="24" cy="24" rx="22" ry="6" fill="#A89272" stroke={P.ink} strokeWidth=".8"/>
          {/* outer rim highlight */}
          <ellipse cx="24" cy="22.5" rx="21" ry="4.5" fill="#C4A878"/>
          {/* basin front side (visible depth) */}
          <path d="M 2 24 L 46 24 L 46 30 L 2 30 Z" fill="#7B6B4E" stroke={P.ink} strokeWidth=".5"/>
          <ellipse cx="24" cy="30" rx="22" ry="4" fill="#5C4E32"/>
          {/* water inside */}
          <ellipse cx="24" cy="23" rx="18" ry="4" fill={P.water}/>
          <ellipse cx="24" cy="22" rx="17" ry="3" fill={P.waterDeep}/>
          {/* center pedestal */}
          <ellipse cx="24" cy="18" rx="6" ry="2" fill="#A89272" stroke={P.ink} strokeWidth=".4"/>
          <rect x="22" y="10" width="4" height="8" fill="#C8C0B0" stroke={P.ink} strokeWidth=".4"/>
          <rect x="22.5" y="10" width="1" height="8" fill="#E8DCC0"/>
          {/* center spout */}
          <ellipse cx="24" cy="10" rx="3" ry="1" fill="#A89272" stroke={P.ink} strokeWidth=".3"/>
          {/* water spray (3 columns of droplets) */}
          <rect x="23.5" y="3" width="1" height="7" fill={P.water}/>
          <rect x="20" y="6" width="1" height="4" fill={P.water}/>
          <rect x="27" y="6" width="1" height="4" fill={P.water}/>
          <circle cx="24" cy="3" r="1" fill="#fff" opacity=".8"/>
          {/* ripples */}
          <ellipse cx="14" cy="24" rx="2" ry=".5" fill="#fff" opacity=".5"/>
          <ellipse cx="34" cy="24" rx="2" ry=".5" fill="#fff" opacity=".5"/>
        </svg>
      </div>
    );
  }

  // ─── BIKE RACK v2 — proper depth ───────────────────────────────────
  function BikeRack({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * TILE, top: y * TILE - 4, width: TILE * 2, height: TILE * 1.5, filter: 'drop-shadow(2px 3px 0 rgba(0,0,0,.22))' }}>
        <svg viewBox="0 0 32 22" width={TILE * 2} height={TILE * 1.5} shapeRendering="crispEdges">
          {/* base bar (long horizontal at bottom) */}
          <rect x="1" y="18" width="30" height="2" fill="#4B5563" stroke={P.ink} strokeWidth=".4"/>
          {/* 3 U-shape posts (inverted U) */}
          {[3, 14, 25].map(rx => (
            <g key={rx}>
              <rect x={rx} y="6" width="2" height="13" fill="#4B5563" stroke={P.ink} strokeWidth=".3"/>
              <rect x={rx + 4} y="6" width="2" height="13" fill="#4B5563" stroke={P.ink} strokeWidth=".3"/>
              <rect x={rx} y="6" width="6" height="2" fill="#4B5563" stroke={P.ink} strokeWidth=".3"/>
            </g>
          ))}
          {/* highlights */}
          {[3, 14, 25].map(rx => (
            <g key={rx + 100}>
              <rect x={rx + .5} y="6.5" width=".8" height="12" fill="#6B7280"/>
              <rect x={rx + 4.5} y="6.5" width=".8" height="12" fill="#6B7280"/>
            </g>
          ))}
          {/* one bike parked at left */}
          <circle cx="7" cy="14" r="3" fill="none" stroke={P.ink} strokeWidth=".6"/>
          <circle cx="15" cy="14" r="3" fill="none" stroke={P.ink} strokeWidth=".6"/>
          <rect x="7" y="8" width="9" height="1" fill="#3B82F6"/>
          <rect x="9" y="9" width="2" height="4" fill="#3B82F6"/>
          <rect x="14" y="9" width="2" height="4" fill="#3B82F6"/>
          <rect x="11" y="6" width="2" height="2" fill="#3B82F6"/>
        </svg>
      </div>
    );
  }

  // ─── HELIPAD — flat ground marking (already 2D, kept as-is) ────────
  function Helipad({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * TILE, top: y * TILE, width: TILE * 4, height: TILE * 4 }}>
        <svg viewBox="0 0 64 64" width={TILE * 4} height={TILE * 4} shapeRendering="crispEdges">
          <rect x="2" y="2" width="60" height="60" fill={P.asphalt} stroke="#FFEC60" strokeWidth="2.5"/>
          <circle cx="32" cy="32" r="22" fill="none" stroke="#FFEC60" strokeWidth="2.5"/>
          <rect x="20" y="18" width="6" height="28" fill="#FFEC60"/>
          <rect x="38" y="18" width="6" height="28" fill="#FFEC60"/>
          <rect x="20" y="30" width="24" height="4" fill="#FFEC60"/>
        </svg>
      </div>
    );
  }

  // ─── Lily pad ───────────────────────────────────────────────────────
  function LilyPad({ x, y, c }) {
    return (
      <div style={{ position: 'absolute', left: x * TILE, top: y * TILE }}>
        <svg viewBox="0 0 14 8" width={14} height={8} shapeRendering="crispEdges">
          <ellipse cx="7" cy="4" rx="6" ry="3" fill={c} stroke={P.ink} strokeWidth=".5"/>
          <rect x="6" y="1" width="2" height="2" fill="#fff"/>
          <rect x="5" y="2" width="4" height="0.5" fill="#FBCFE8"/>
        </svg>
      </div>
    );
  }

  // ─── Basketball half-court ──────────────────────────────────────────
  function BBallCourt({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * TILE, top: y * TILE, width: TILE * 4, height: TILE * 3, filter: 'drop-shadow(2px 3px 0 rgba(0,0,0,.15))' }}>
        <svg viewBox="0 0 64 48" width={TILE * 4} height={TILE * 3} shapeRendering="crispEdges">
          <rect x="2" y="2" width="60" height="44" fill="#B05A4C" stroke={P.ink} strokeWidth="1.5"/>
          {/* free throw box */}
          <rect x="20" y="2" width="24" height="20" fill="none" stroke="#fff" strokeWidth="1.5"/>
          {/* hoop arc */}
          <path d="M 16 22 A 16 12 0 0 0 48 22" fill="none" stroke="#fff" strokeWidth="1.5"/>
          {/* hoop pole at top center */}
          <rect x="30" y="0" width="4" height="3" fill="#3F3D52"/>
          <rect x="28" y="3" width="8" height="2" fill="#fff" stroke={P.ink} strokeWidth=".5"/>
        </svg>
      </div>
    );
  }

  // ─── Player sprite — uses the design-system DERP player ───────────
  function PlayerSprite() {
    if (window.DerpPlayer) return <window.DerpPlayer size={24} tag=""/>;
    if (window.ChibiPlayer) return <window.ChibiPlayer size={18} tag=""/>;
    // fallback box if DS not loaded
    return <div style={{ width: 18, height: 21, background: window.ForinTokens.mint, border: `1px solid ${P.ink}` }}/>;
  }

  // ─── NPC sprite — uses the design-system DERP role presets ────────
  // kind maps to a Derp* role component (forin-npcs-smooth.jsx). x,y seed
  // the deterministic hairstyle/skin/outfit variation so each NPC is
  // distinct yet stable across renders.
  function NPC({ x, y, shirt, hair, exclaim, quest, kind }) {
    const roleMap = {
      doctor:     window.DerpDoctor,
      nurse:      window.DerpNurse,
      patient:    window.DerpPatient,
      surgeon:    window.DerpSurgeon,
      paramedic:  window.DerpParamedic,
      parent:     window.DerpParent,
      visitor:    window.DerpVisitor,
      child:      window.DerpChild,
      pharmacist: window.DerpPharmacist,
      police:     window.DerpPolice,
    };
    const Role = roleMap[kind] || window.DerpNurse;
    return (
      <div style={{ position: 'absolute', left: x * TILE - 4, top: y * TILE - 16, zIndex: 4 }}>
        {Role ? <Role x={x} y={y} hair={hair} shirt={shirt} size={kind === 'child' ? 20 : 24}/> : null}
        {exclaim && (
          <div style={{ position: 'absolute', top: -12, left: '60%', background: quest ? '#FEF08A' : '#fff', border: `2px solid ${P.ink}`, width: 13, height: 13, fontFamily: '"DungGeunMo",monospace', fontSize: 9, color: P.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `2px 2px 0 0 ${P.ink}`, animation: 'forinBob 1.2s ease-in-out infinite', zIndex: 6 }}>!</div>
        )}
      </div>
    );
  }

  // ─── Tile sub-types (ground) ────────────────────────────────────────
  // legend used in mapRows[y][x]:
  //   g  grass     G  grass with grass-tuft
  //   p  path stone block A
  //   P  path stone block B (darker / grout)
  //   z  plaza (lighter open tile)
  //   r  road asphalt
  //   l  road lane stripe
  //   c  curb (sidewalk)
  //   w  garden plot soil
  function Tile({ ch, xy }) {
    const baseStyle = { position: 'relative', width: TILE, height: TILE };
    switch (ch) {
      case 'g':
        return <div style={{ ...baseStyle, background: (xy % 2 === 0) ? P.grassA : P.grassB,
          backgroundImage: `linear-gradient(45deg, ${P.grassDark}33 0 1px, transparent 1px), linear-gradient(135deg, ${P.grassDark}33 0 1px, transparent 1px)`,
          backgroundSize: '4px 4px' }}/>;
      case 'G':
        return <div style={{ ...baseStyle, background: P.grassA }}>
          <div style={{ position: 'absolute', left: 4, bottom: 3, width: 2, height: 3, background: P.grassDark }}/>
          <div style={{ position: 'absolute', right: 4, top: 5, width: 1, height: 2, background: P.grassDark }}/>
        </div>;
      case 'p':
        return <div style={{ ...baseStyle, background: P.pathA, borderRight: `1px solid ${P.pathLine}55`, borderBottom: `1px solid ${P.pathLine}55` }}/>;
      case 'P':
        return <div style={{ ...baseStyle, background: P.pathB, borderRight: `1px solid ${P.pathLine}55`, borderBottom: `1px solid ${P.pathLine}55` }}/>;
      case 'z':
        return <div style={{ ...baseStyle, background: P.plaza, borderRight: `1px solid ${P.pathLine}33`, borderBottom: `1px solid ${P.pathLine}33` }}/>;
      case 'r':
        return <div style={{ ...baseStyle, background: P.asphalt }}/>;
      case 'l':
        return <div style={{ ...baseStyle, background: P.asphalt }}>
          <div style={{ position: 'absolute', left: 4, top: 6, width: TILE - 8, height: 3, background: P.laneLine }}/>
        </div>;
      case 'c':
        return <div style={{ ...baseStyle, background: '#BFB298', borderTop: `2px solid ${P.pathLine}`, borderBottom: `2px solid ${P.pathLine}` }}/>;
      case 'w':
        return <div style={{ ...baseStyle, background: '#8C6A3A' }}>
          <div style={{ position: 'absolute', left: 3, top: 3, width: 2, height: 2, background: '#A87C44' }}/>
          <div style={{ position: 'absolute', right: 3, bottom: 4, width: 2, height: 2, background: '#A87C44' }}/>
        </div>;
      default:
        return <div style={{ ...baseStyle, background: P.grassA }}/>;
    }
  }

  // ─── Map layout (26 cols × 44 rows) ─────────────────────────────────
  // Hand-painted. Spaces below in comments aid orientation.
  //          0    5    1    1    2    2
  //          0    5    0    5    0    5
  const MAP = [
    'gggggggggggggggggggggggggg', //  0 top edge grass / helipad area
    'ggggggggggggggggggggggGggg', //  1
    'ggGgggggggggggggggggggggGg', //  2
    'ggggggggggggGggggggggggggg', //  3
    'cccccccccccccccccccccccccc', //  4 sidewalk top
    'rrrrrrrrrrrrlrrrrrrrrrrrrr', //  5 main road
    'rrrrrrrrrrrrlrrrrrrrrrrrrr', //  6
    'cccccccccccccccccccccccccc', //  7 sidewalk bottom of road
    'ggggppppppgggggggggppppgGg', //  8
    'ggggpPPPpgggggGgggggpPPpgg', //  9
    'ggggpPPPpgggggggggggpPPpgg', // 10
    'ggGgpPPPpzzzzzzzzzggpPPpgg', // 11
    'ggggpPPPpzzzzzzzzzggpPPpgg', // 12
    'ggggppppppzzzzzzzzggppppgg', // 13
    'ggggggggggzzzzzzzzgggGgggg', // 14
    'ggGgggGggggzzzzzggggggggGg', // 15
    'ggggggggggggppppgggggggGgg', // 16
    'gGgggppppppppPPppppppppggg', // 17 horizontal main path
    'ggggpPPPPPPPPPPPPPPPPPPpgg', // 18
    'gggGppppppppppppppppppppgg', // 19
    'ggggggggggggggggggGggggggg', // 20
    'gggGggggGgggggggggggggGggg', // 21
    'ggppppgggggppppppgggppppgg', // 22
    'gpPPPpgggggpPPPPpgggpPPPpg', // 23
    'gpPPPpzzzzzpPPPPpzzzpPPPpg', // 24
    'gpPPPpzzzzzpPPPPpzzzpPPPpg', // 25
    'gppppppzzzpppppppzzpppppgg', // 26
    'gggGgggzzzggggGggzzgggggGg', // 27
    'gGggggggggggggggggggGggggg', // 28
    'ggggggggggggggGggggggggGgg', // 29
    'cccccccccccccccccccccccccc', // 30 lower road
    'rrrrrrrrrrrrlrrrrrrrrrrrrr', // 31
    'rrrrrrrrrrrrlrrrrrrrrrrrrr', // 32
    'cccccccccccccccccccccccccc', // 33
    'ggGgggggggggggggggggggGggg', // 34
    'gggppppggGggggggggggppppgg', // 35
    'gggpPPpgggggppppggggpPPpgg', // 36
    'gggpPPpgggggpPPpggggpPPpgg', // 37
    'gggpPPpgggggpPPpggggpPPpgg', // 38
    'gggppppggGgggppppgggppppgg', // 39
    'ggGggggggggggggGggggggGggg', // 40
    'gggggggwwwwgggggggwwwggGgg', // 41
    'ggGggwwwwwwwwgggwwwwwwwggg', // 42
    'gggggggggggggggggggggggggg', // 43
    'cccccccccccccccccccccccccc', // 44 sidewalk
    'rrrrrrrrrrrrlrrrrrrrrrrrrr', // 45 third road
    'rrrrrrrrrrrrlrrrrrrrrrrrrr', // 46
    'cccccccccccccccccccccccccc', // 47
    'gGggggggggggggGgggggggGggg', // 48
    'gggggggggggggggggggggggggg', // 49 buildings row begins (drawn on top)
    'gggggggggggggggggggggggggg', // 50
    'ggGgggggggggggggggggGggggg', // 51
    'gggggggggggggggggggggggGgg', // 52
    'ggggppppppppppppppppppgggg', // 53 plaza/path beneath buildings
    'gggpPPPPPPPPPPPPPPPPPPpggg', // 54
    'gggpPPPPPPPPPPPPPPPPPPpggg', // 55
    'ggGppppppppppppppppppppGgg', // 56
    'ggggggggggggGgggggGgggggGg', // 57
    'gggggwwwwwwwwgggggggggggGg', // 58 pond
    'ggGggwwwwwwwwgggGgggggGggg', // 59
  ];

  function ScreenExplore() {
    const T = window.ForinTokens;
    const mapW = COLS * TILE;
    const mapH = ROWS * TILE;
    const scrollRef = React.useRef(null);

    // Player position (in tile coords)
    const [pos, setPos] = React.useState({ x: 12, y: 19 });

    // Center scroll on player position
    React.useEffect(() => {
      const el = scrollRef.current;
      if (!el) return;
      const targetX = pos.x * TILE - el.clientWidth / 2 + TILE / 2;
      const targetY = pos.y * TILE - el.clientHeight / 2 + TILE / 2;
      el.scrollTo({ left: targetX, top: targetY, behavior: 'smooth' });
    }, [pos]);

    // Buildings — campus-wide hospital. Many roof colors per reference image.
    const buildings = [
      // Top row — back of campus
      { x: 0,  y: 0,  w: 5, h: 4, roof: { mid: P.roofRed, dk: P.roofRedDk, lt: P.roofRedLt },     label: '연구동', sign: 'LAB', emblem: '🔬' },
      { x: 6,  y: 0,  w: 5, h: 4, roof: { mid: P.roofGreen, dk: P.roofGreenDk, lt: P.roofGreenLt }, label: '교육관', sign: 'EDU', emblem: '📚' },
      { x: 16, y: 0,  w: 6, h: 4, roof: { mid: P.roofTeal, dk: P.roofTealDk, lt: '#85B5A8' },     label: '카페테리아', sign: '🍱 CAFE', signColor: '#3E6E62', emblem: '🍱' },

      // Middle-top large hospital — main building (between roads)
      { x: 1,  y: 8,  w: 6, h: 6, roof: { mid: P.roofRed, dk: P.roofRedDk, lt: P.roofRedLt }, label: '본관 · MAIN', sign: 'HOSPITAL', signColor: P.red, redCross: true, mainEntrance: true },
      { x: 19, y: 8,  w: 6, h: 6, roof: { mid: P.roofWhite, dk: P.roofWhiteDk, lt: '#F2EDDE' }, label: '응급실 ER', sign: '🚑 ER', signColor: P.red, redCross: true, mainEntrance: true },

      // Middle row buildings  
      { x: 1,  y: 22, w: 5, h: 5, roof: { mid: P.roofBlue, dk: P.roofBlueDk, lt: P.roofBlueLt },  label: '소아과', sign: '👶 PEDS', emblem: '🧸' },
      { x: 10, y: 22, w: 7, h: 5, roof: { mid: P.roofMauve, dk: P.roofMauveDk, lt: '#B89BC0' },   label: '수술실 OR', sign: '🔪 OR', signColor: '#6E4F7C', redCross: true, mainEntrance: true },
      { x: 20, y: 22, w: 4, h: 5, roof: { mid: P.roofGreen, dk: P.roofGreenDk, lt: P.roofGreenLt }, label: '약국', sign: '💊 PHARMA', emblem: '💊' },

      // Bottom row
      { x: 3,  y: 35, w: 4, h: 5, roof: { mid: P.roofBlue, dk: P.roofBlueDk, lt: P.roofBlueLt }, label: '직원기숙사', sign: '🏠 DORM', emblem: '🏠' },
      { x: 12, y: 35, w: 4, h: 5, roof: { mid: P.roofRed, dk: P.roofRedDk, lt: P.roofRedLt }, label: 'ICU', sign: 'ICU', signColor: P.red, redCross: true },
      { x: 19, y: 35, w: 4, h: 5, roof: { mid: P.roofTeal, dk: P.roofTealDk, lt: '#85B5A8' }, label: '재활센터', sign: 'REHAB', emblem: '🦽' },

      // South ward — added when campus expanded
      { x: 0,  y: 49, w: 5, h: 4, roof: { mid: P.roofRed, dk: P.roofRedDk, lt: P.roofRedLt }, label: '영상의학', sign: '🩻 X-RAY', signColor: P.red, redCross: true },
      { x: 6,  y: 48, w: 6, h: 5, roof: { mid: P.roofMauve, dk: P.roofMauveDk, lt: '#B89BC0' }, label: '산부인과', sign: '👶 MATERNITY', signColor: '#6E4F7C', emblem: '👶', mainEntrance: true },
      { x: 13, y: 49, w: 4, h: 4, roof: { mid: P.roofRed, dk: P.roofRedDk, lt: P.roofRedLt }, label: '심장내과', sign: '♥ CARDIO', signColor: P.red, redCross: true },
      { x: 18, y: 48, w: 6, h: 5, roof: { mid: P.roofGreen, dk: P.roofGreenDk, lt: P.roofGreenLt }, label: '외래 클리닉', sign: 'OPD', emblem: '🩺', mainEntrance: true },
      // Chapel (small, with cross)
      { x: 14, y: 56, w: 3, h: 3, roof: { mid: P.roofWhite, dk: P.roofWhiteDk, lt: '#F2EDDE' }, label: '채플', sign: '✟ CHAPEL', special: 'flat', emblem: '✟' },
    ];

    // NPCs — outside the buildings, walking the paths
    const npcs = [
      { x: 12, y: 15, shirt: '#fff', hair: '#3C2A18', kind: 'doctor', exclaim: true, quest: true, label: 'Dr. Patel' },
      { x: 6,  y: 18, shirt: '#A7F3D0', hair: '#7C3F00', kind: 'nurse' },
      { x: 19, y: 18, shirt: '#FFEDD5', hair: '#5C3A1A', kind: 'patient', exclaim: true },
      { x: 14, y: 19, shirt: '#BAE6FD', hair: '#2D1B0F', kind: 'nurse' },
      { x: 4,  y: 28, shirt: '#FBCFE8', hair: '#9A6B3F', kind: 'patient' },
      { x: 21, y: 28, shirt: '#fff', hair: '#3C2A18', kind: 'doctor' },
      { x: 8,  y: 34, shirt: '#A7F3D0', hair: '#3C2A18', kind: 'nurse' },
      { x: 17, y: 33, shirt: '#FFEDD5', hair: '#7C3F00', kind: 'patient', exclaim: true },
      // south ward NPCs
      { x: 4,  y: 54, shirt: '#A7F3D0', hair: '#5C3A1A', kind: 'nurse' },
      { x: 9,  y: 54, shirt: '#FBCFE8', hair: '#7C3F00', kind: 'patient', exclaim: true },
      { x: 15, y: 54, shirt: '#fff', hair: '#1F2937', kind: 'doctor' },
      { x: 21, y: 54, shirt: '#FFEDD5', hair: '#3C2A18', kind: 'patient', exclaim: true, quest: true },
      { x: 12, y: 47, shirt: '#FBCFE8', hair: '#9A6B3F', kind: 'patient' },
      { x: 18, y: 59, shirt: '#A7F3D0', hair: '#5C3A1A', kind: 'nurse' },
    ];

    // Tree clusters (decorative)
    const trees = [
      [0, 6],  [3, 6],  [8, 6],  [22, 6], [24, 6], [25, 8],
      [0, 14], [8, 16], [17, 16], [24, 14], [0, 20], [25, 20],
      [7, 27], [17, 28], [25, 28], [0, 34], [9, 33], [25, 34],
      [1, 41], [10, 42], [22, 41], [23, 43],
      // south ward trees
      [0, 48], [13, 48], [24, 47], [25, 49],
      [0, 54], [12, 54], [25, 54], [4, 57], [22, 57], [25, 57],
      [0, 59], [3, 59], [13, 58], [25, 59],
    ];
    const bushes = [[3, 14], [21, 14], [3, 28], [22, 28], [13, 8], [13, 14]];
    const flowers = [
      [4, 7, P.flower2], [22, 7, P.flower3], [3, 21, P.flower1],
      [13, 28, P.flower2], [22, 21, P.flower3], [11, 21, P.flower1],
    ];

    return (
      <div data-screen-label="06 Explore" style={{ height: '100%', background: P.grassA, position: 'relative', overflow: 'hidden' }}>
        <ForinTopBar
          title="병원 캠퍼스"
          left={<span style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 18, color: T.ink }}>‹</span>}
          right={<span style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 12, color: T.ink, display: 'inline-flex', alignItems: 'center', gap: 4 }}><PixelHeart size={11}/> 92%</span>}
        />

        {/* mission banner */}
        <div style={{ margin: '8px 12px 6px', background: T.yellow, border: `3px solid ${T.ink}`, padding: '6px 10px', boxShadow: `3px 3px 0 0 ${T.yellowShadow}`, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 20, height: 20, background: '#fff', border: `2px solid ${T.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"DungGeunMo",monospace', fontSize: 12, flexShrink: 0 }}>!</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 9, color: T.textSoft, lineHeight: 1 }}>QUEST</div>
            <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 11, color: T.ink, lineHeight: 1.2, marginTop: 2 }}>Dr. Patel을 만나 ER로 인계받기</div>
          </div>
        </div>

        {/* viewport */}
        <div ref={scrollRef} style={{
          margin: '0 8px', height: 540, overflow: 'auto', position: 'relative',
          background: P.grassA, border: `3px solid ${P.ink}`, boxShadow: `4px 4px 0 0 ${P.ink}`,
          scrollbarWidth: 'none',
        }}>
          <style>{`
            .forin-map-viewport::-webkit-scrollbar{display:none}
            @keyframes forinBob { 0%,100% {transform:translateY(0)} 50% {transform:translateY(-3px)} }
            @keyframes forinPlayerStep { 0%,100% {transform:translateY(0)} 50% {transform:translateY(-1px)} }
          `}</style>

          {/* map */}
          <div style={{ position: 'relative', width: mapW, height: mapH, imageRendering: 'pixelated' }}>
            {/* base ground grid */}
            <div style={{
              position: 'absolute', inset: 0,
              display: 'grid',
              gridTemplateColumns: `repeat(${COLS}, ${TILE}px)`,
              gridTemplateRows: `repeat(${ROWS}, ${TILE}px)`,
            }}>
              {MAP.flatMap((row, y) => row.split('').map((ch, x) => (
                <Tile key={`${x}-${y}`} ch={ch} xy={x + y}/>
              )))}
            </div>

            {/* fountain center plaza */}
            <Fountain x={11} y={11}/>

            {/* helipad area top-right */}
            <Helipad x={11} y={0.2}/>

            {/* trees */}
            {trees.map(([x, y], i) => <Tree key={`t${i}`} x={x} y={y} big={i % 4 === 0}/>)}
            {bushes.map(([x, y], i) => <Bush key={`b${i}`} x={x} y={y}/>)}
            {flowers.map(([x, y, c], i) => <Flowers key={`f${i}`} x={x} y={y} c={c}/>)}

            {/* benches */}
            <Bench x={13} y={15}/>
            <Bench x={9} y={15}/>

            {/* streetlamps along main road */}
            <Streetlamp x={2}  y={4}/>
            <Streetlamp x={8}  y={4}/>
            <Streetlamp x={14} y={4}/>
            <Streetlamp x={20} y={4}/>
            <Streetlamp x={24} y={4}/>
            <Streetlamp x={2}  y={30}/>
            <Streetlamp x={8}  y={30}/>
            <Streetlamp x={14} y={30}/>
            <Streetlamp x={20} y={30}/>
            <Streetlamp x={24} y={30}/>
            <Streetlamp x={2}  y={47}/>
            <Streetlamp x={14} y={47}/>
            <Streetlamp x={24} y={47}/>

            {/* trash + recycle bins (sidewalks) */}
            <TrashCan x={5}  y={4} color="#16A34A"/>
            <TrashCan x={6}  y={4} color="#1E40AF"/>
            <TrashCan x={17} y={4} color="#16A34A"/>
            <TrashCan x={18} y={4} color="#1E40AF"/>
            <TrashCan x={5}  y={30} color="#16A34A"/>
            <TrashCan x={17} y={30} color="#1E40AF"/>

            {/* mailboxes at curbs */}
            <Mailbox x={11} y={4}/>
            <Mailbox x={15} y={30}/>

            {/* fire hydrants on sidewalk */}
            <Hydrant x={3}  y={4}/>
            <Hydrant x={21} y={4}/>
            <Hydrant x={11} y={30}/>
            <Hydrant x={21} y={47}/>

            {/* bus stop near main entrance */}
            <BusStop x={9}  y={4}/>
            <BusStop x={19} y={30}/>

            {/* vending machines near dorms + cafeteria */}
            <VendingMachine x={1}  y={36}/>
            <VendingMachine x={7}  y={36}/>
            <VendingMachine x={20} y={36}/>

            {/* picnic tables in the central plaza */}
            <PicnicTable x={11} y={15.5}/>
            <PicnicTable x={15} y={15.5}/>

            {/* hedges lining the central plaza (outside fountain) */}
            <Hedge x={10} y={8.5} w={3}/>
            <Hedge x={15} y={8.5} w={3}/>

            {/* hedge rows around bottom plaza */}
            <Hedge x={11} y={23} w={2}/>
            <Hedge x={14} y={23} w={2}/>

            {/* statue at center plaza near fountain */}
            <Statue x={17} y={12}/>

            {/* ambulance parked next to ER */}
            <Ambulance x={17} y={5}/>
            <Ambulance x={25.5} y={5}/>

            {/* south ward extras: ambulance + parked cars on row 45-46 road */}
            <Ambulance x={2} y={45}/>
            <ParkedCar x={5} y={45} color="#3B82F6"/>
            <ParkedCar x={7} y={45} color="#EF4444"/>
            <ParkedCar x={20} y={45} color="#FACC15"/>
            <ParkedCar x={22} y={45} color="#10B981"/>

            {/* additional parked cars on north road too */}
            <ParkedCar x={3}  y={31} color="#3B82F6"/>
            <ParkedCar x={5}  y={31} color="#10B981"/>
            <ParkedCar x={22} y={31} color="#FACC15"/>

            {/* south plaza benches + bike rack */}
            <Bench x={3} y={56}/>
            <Bench x={20} y={56}/>
            <BikeRack x={6}  y={51}/>
            <BikeRack x={18} y={51}/>

            {/* lily pads in pond */}
            <LilyPad x={6} y={58.5} c="#94BC85"/>
            <LilyPad x={9} y={58.7} c="#6E9560"/>

            {/* basketball half-court near dorm */}
            <BBallCourt x={0} y={42}/>

            {/* buildings */}
            {buildings.map((b, i) => <Building key={i} {...b}/>)}

            {/* NPCs */}
            {npcs.map((n, i) => <NPC key={i} {...n}/>)}

            {/* Player */}
            <div style={{ position: 'absolute', left: pos.x * TILE - 4, top: pos.y * TILE - 16, animation: 'forinPlayerStep .6s ease-in-out infinite' }}>
              <PlayerSprite/>
              <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: '#fff', border: `1.5px solid ${P.ink}`, fontFamily: '"DungGeunMo",monospace', fontSize: 7, padding: '1px 4px', whiteSpace: 'nowrap', boxShadow: `1.5px 1.5px 0 0 ${P.ink}` }}>YOU</div>
            </div>
          </div>
        </div>

        {/* mini-map overlay */}
        <div style={{
          position: 'absolute', right: 16, top: 158, width: 88, height: 132,
          background: 'rgba(255,255,255,.92)', border: `3px solid ${P.ink}`,
          boxShadow: `3px 3px 0 0 ${P.ink}`, padding: 4, zIndex: 5,
        }}>
          <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 8, color: P.ink, textAlign: 'center', marginBottom: 2 }}>MAP</div>
          <div style={{ position: 'relative', width: 76, height: 110, background: P.grassA, border: `1.5px solid ${P.ink}`, overflow: 'hidden' }}>
            {/* road */}
            <div style={{ position: 'absolute', left: 0, right: 0, top: '12%', height: 6, background: P.asphalt }}/>
            <div style={{ position: 'absolute', left: 0, right: 0, top: '68%', height: 6, background: P.asphalt }}/>
            {/* simplified building dots */}
            {buildings.map((b, i) => (
              <div key={i} style={{
                position: 'absolute',
                left: `${(b.x / COLS) * 100}%`,
                top: `${(b.y / ROWS) * 100}%`,
                width: `${(b.w / COLS) * 100}%`,
                height: `${(b.h / ROWS) * 100}%`,
                background: b.roof.mid,
                border: `1px solid ${P.ink}`,
              }}/>
            ))}
            {/* you-are-here dot */}
            <div style={{
              position: 'absolute',
              left: `${(pos.x / COLS) * 100}%`,
              top: `${(pos.y / ROWS) * 100}%`,
              width: 6, height: 6, background: '#FEF08A', border: `1.5px solid ${P.ink}`,
              transform: 'translate(-50%,-50%)',
              animation: 'forinBob 1s ease-in-out infinite',
            }}/>
          </div>
        </div>

        {/* HUD bottom */}
        <div style={{ position: 'absolute', bottom: 100, left: 12, right: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ background: '#fff', border: `3px solid ${T.ink}`, padding: '6px 10px', flex: 1, boxShadow: `3px 3px 0 0 ${T.ink}` }}>
            <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 9, color: T.textSoft }}>RANK</div>
            <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 12, color: T.ink }}>Junior Nurse · LV 12</div>
          </div>
          {/* D-pad */}
          <PixelDPad size={72} onMove={(d) => {
            if (d === 'up')    setPos(p => ({ x: p.x, y: Math.max(1, p.y - 1) }));
            if (d === 'down')  setPos(p => ({ x: p.x, y: Math.min(ROWS - 2, p.y + 1) }));
            if (d === 'left')  setPos(p => ({ x: Math.max(0, p.x - 1), y: p.y }));
            if (d === 'right') setPos(p => ({ x: Math.min(COLS - 1, p.x + 1), y: p.y }));
          }}/>
          <PixelIconButton bg={T.mint} size={52} fontSize={18}>A</PixelIconButton>
        </div>

        <ForinBottomNav active="campus"/>
      </div>
    );
  }

      window.ScreenExplore = ScreenExplore;
})();
