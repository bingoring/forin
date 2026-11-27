// interior-shared.jsx — Shared primitives for hospital interior maps.
// Top-down GBA-style. Each interior screen composes these atoms into a layout.

const ITILE = 16; // matches campus tile size

const IP = {
  // Floor types
  floorClinical: '#E8E5D4',   // off-white tile (general)
  floorClinicalAlt: '#DAD6C2',
  floorSterile: '#D6E4EC',    // blue-white (OR)
  floorSterileAlt: '#BFD4DE',
  floorPeds: '#FDE6BB',       // warm yellow (Pediatrics)
  floorPedsAlt: '#FAD79A',
  floorICU: '#E1E4EC',        // cool gray (ICU)
  floorICUAlt: '#C8CEDA',
  floorPharma: '#E9DEC0',     // warm beige (Pharmacy)
  floorPharmaAlt: '#D8C9A4',

  // Clinic departments (added — outpatient clinics)
  floorInternal: '#E3E8E0',   // soft sage (Internal Medicine)
  floorInternalAlt: '#CFD8C9',
  floorSurgery: '#DCE6EC',    // cool steel (General Surgery)
  floorSurgeryAlt: '#C3D2DC',
  floorOrtho: '#ECE6DA',      // warm bone (Orthopedics)
  floorOrthoAlt: '#DBD2BE',
  floorDerm: '#F0E6EA',       // soft rose (Dermatology)
  floorDermAlt: '#E2D0D8',

  groutLine: '#9C8866',
  wall: '#C8C0A8',
  wallTop: '#8E8460',
  wallSide: '#BFB294',
  wallShadow: '#5C523A',

  ink: '#2A2522',
  glass: '#A8C8DC',
  glassFrame: '#3E2E1C',

  doorWood: '#7C4F2C',
  doorAccent: '#C97E3A',
  doorAuto: '#9CD3E0',

  metal: '#9CA3AF',
  metalDk: '#4B5563',
  blueScrub: '#A5D8E8',
  greenScrub: '#A7D7B0',
};

// ─── Floor tile renderer ────────────────────────────────────────────
function IFloor({ theme = 'clinical', x, y }) {
  const a = IP[`floor${theme.charAt(0).toUpperCase() + theme.slice(1)}`];
  const b = IP[`floor${theme.charAt(0).toUpperCase() + theme.slice(1)}Alt`];
  // Subtle alternating tile pattern (checkerboard at 2x2 tiles)
  const useAlt = ((x + y) & 1) === 0;
  return (
    <div style={{
      position: 'absolute', left: x * ITILE, top: y * ITILE,
      width: ITILE, height: ITILE,
      background: useAlt ? a : b,
      borderRight: `1px solid ${IP.groutLine}33`,
      borderBottom: `1px solid ${IP.groutLine}33`,
    }}/>
  );
}

// ─── Wall block (chunky with top shadow) ────────────────────────────
function IWall({ x, y, w = 1, h = 1, theme = 'clinical' }) {
  return (
    <div style={{
      position: 'absolute', left: x * ITILE, top: y * ITILE,
      width: w * ITILE, height: h * ITILE,
      background: IP.wall,
      borderTop: `3px solid ${IP.wallTop}`,
      borderLeft: `2px solid ${IP.wallSide}`,
      borderRight: `2px solid ${IP.wallShadow}`,
      borderBottom: `2px solid ${IP.wallShadow}`,
      boxSizing: 'border-box',
    }}>
      {/* tile seam */}
      <div style={{ position: 'absolute', inset: 0,
        backgroundImage: `linear-gradient(90deg, ${IP.wallShadow}22 0 1px, transparent 1px ${ITILE}px)`,
        backgroundSize: `${ITILE}px ${ITILE}px`,
      }}/>
    </div>
  );
}

// ─── Glass wall (ICU partitions) ────────────────────────────────────
function IGlass({ x, y, w = 1, h = 1, z }) {
  const vertical = h > w;
  return (
    <div style={{
      position: 'absolute', left: x * ITILE, top: y * ITILE,
      width: w * ITILE, height: h * ITILE,
      background: IP.glass + '33',
      border: `2px solid ${IP.glassFrame}`,
      boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.55)`,
      backgroundImage: `repeating-linear-gradient(90deg, ${IP.glassFrame}44 0 1px, transparent 1px ${ITILE}px),`
        + `repeating-linear-gradient(180deg, ${IP.glassFrame}44 0 1px, transparent 1px ${ITILE}px),`
        + `linear-gradient(135deg, rgba(255,255,255,0.35) 0 18%, transparent 18% 32%, rgba(255,255,255,0.22) 32% 42%, transparent 42%)`,
      ...(z != null ? { zIndex: z } : {}),
    }}>
      {/* pane frame divider follows the long axis */}
      <div style={{ position: 'absolute', ...(vertical
        ? { top: 0, bottom: 0, left: '50%', width: 2, transform: 'translateX(-50%)' }
        : { left: 0, right: 0, top: '50%', height: 2, transform: 'translateY(-50%)' }),
        background: IP.glassFrame + '99' }}/>
    </div>
  );
}

// ─── Door variants ──────────────────────────────────────────────────
// Auto-detects orientation: when h > w, renders as a vertical door (handle
// at the bottom, horizontal wood grain, label to the side instead of below).
function IDoor({ x, y, w = 1, h = 1, kind = 'wood', label }) {
  const vertical = h > w;
  const bg = kind === 'auto' ? IP.doorAuto : (kind === 'sterile' ? '#4F76A4' : IP.doorWood);
  return (
    <div style={{
      position: 'absolute', left: x * ITILE, top: y * ITILE,
      width: w * ITILE, height: h * ITILE,
      background: bg, border: `2px solid ${IP.ink}`,
      boxShadow: `inset 2px 2px 0 0 ${IP.doorAccent}66`,
      backgroundImage: kind === 'wood' ? (vertical
        ? `repeating-linear-gradient(90deg, ${IP.ink}22 0 1px, transparent 1px ${ITILE/3}px)`
        : `repeating-linear-gradient(180deg, ${IP.ink}22 0 1px, transparent 1px ${ITILE/3}px)`) : 'none',
    }}>
      {kind === 'auto' && (
        <div style={{ position: 'absolute', left: '50%', top: 2, transform: 'translateX(-50%)', fontFamily: '"DungGeunMo",monospace', fontSize: 7, color: IP.ink, background: '#fff', padding: '0 2px', border: `1px solid ${IP.ink}` }}>AUTO</div>
      )}
      {/* handle position depends on orientation */}
      {vertical ? (
        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', bottom: 3, width: 3, height: 2, background: '#FACC15' }}/>
      ) : (
        <div style={{ position: 'absolute', right: 3, top: '50%', width: 2, height: 3, background: '#FACC15' }}/>
      )}
      {/* hinge indicator */}
      {vertical
        ? <div style={{ position: 'absolute', left: 2, top: 2, width: 2, height: 2, background: IP.ink + '88' }}/>
        : <div style={{ position: 'absolute', left: 2, top: 2, width: 2, height: 2, background: IP.ink + '88' }}/>}
      {label && (
        <div style={{
          position: 'absolute',
          ...(vertical
            ? { left: w * ITILE + 4, top: '50%', transform: 'translateY(-50%)' }
            : { left: '50%', top: h * ITILE + 2, transform: 'translateX(-50%)' }),
          background: '#fff', border: `1.5px solid ${IP.ink}`, padding: '0 4px',
          fontFamily: '"DungGeunMo",monospace', fontSize: 8, color: IP.ink, whiteSpace: 'nowrap',
          boxShadow: `1.5px 1.5px 0 0 ${IP.ink}`, zIndex: 5,
        }}>{label}</div>
      )}
    </div>
  );
}

// ─── Bed variants ───────────────────────────────────────────────────
// True 2.5D top-down at 45°: headboard rises tall behind (you see its front
// face), mattress is thick (visible front edge), pillow + blanket sit on top
// with shading. Side rails project upward like real bed rails. Foot panel
// rises at the front with visible front face.
function IBed({ x, y, variant = 'ward', occupied, label }) {
  const C = IP.ink;
  // Per-variant palette
  const palette = {
    ward: {
      frame: '#9CA3AF', frameDk: '#6B7280', frameLt: '#CBD5E1',
      sheet: '#FFFFFF', sheetDk: '#E5E7EB',
      blanket: '#FED7AA', blanketDk: '#E0A876', blanketHi: '#FFE9CC',
    },
    or: {
      frame: '#64748B', frameDk: '#334155', frameLt: '#94A3B8',
      sheet: '#D5E2EC', sheetDk: '#A8C2D4',
      blanket: '#5E8FA8', blanketDk: '#3F6680', blanketHi: '#7DABC4',
    },
    peds: {
      frame: '#F59E0B', frameDk: '#B45309', frameLt: '#FBBF24',
      sheet: '#FDE4EE', sheetDk: '#F0C8D9',
      blanket: '#A7F3D0', blanketDk: '#7DCEA0', blanketHi: '#C7F8DE',
    },
  }[variant];
  const p = palette;

  return (
    <div style={{
      position: 'absolute', left: x * ITILE, top: y * ITILE - 6,
      width: ITILE * 2.4, height: ITILE * 3.5,
    }}>
      <svg viewBox="0 0 32 48" width={ITILE * 2.4} height={ITILE * 3.5} shapeRendering="crispEdges">
          <ellipse cx="16.0" cy="46.5" rx="15" ry="2.4" fill="rgba(0,0,0,.16)"/>
        {/* ── HEADBOARD top face ── */}
        <rect x="1" y="0" width="30" height="2" fill={p.frameLt}/>
        <rect x="2" y="0.5" width="28" height="0.6" fill={p.frame}/>

        {/* ── HEADBOARD body ── */}
        <rect x="1" y="2" width="30" height="5" fill={p.frameDk}/>
        {/* vertical bar details */}
        <rect x="8"  y="3" width="0.7" height="3" fill={p.frame}/>
        <rect x="15.5" y="3" width="0.7" height="3" fill={p.frame}/>
        <rect x="23" y="3" width="0.7" height="3" fill={p.frame}/>
        {/* shading */}
        <rect x="1" y="6.4" width="30" height="0.6" fill="#000" opacity=".25"/>

        {/* ── MATTRESS TOP ── */}
        <rect x="1" y="7" width="30" height="26" fill={p.sheet}/>
        {/* sheet shading row at top + bottom */}
        <rect x="1" y="7" width="30" height="0.6" fill="#FFFFFF"/>
        <rect x="1" y="31.4" width="30" height="1.2" fill={p.sheetDk}/>
        {/* subtle horizontal seam */}
        <rect x="1" y="20" width="30" height="0.4" fill={p.sheetDk} opacity=".55"/>

        {/* ── PILLOW ── */}
        <rect x="8"   y="9"  width="16" height="4.5" fill="#FFFFFF"/>
        <rect x="7.3" y="10" width="0.7" height="2.5" fill="#FFFFFF"/>
        <rect x="23.8" y="10" width="0.7" height="2.5" fill="#FFFFFF"/>
        <rect x="9"   y="9.4" width="14" height="0.8" fill="#FEFEFE"/>
        <rect x="8"   y="12.4" width="16" height="1.1" fill="#E5E7EB"/>
        <rect x="15.7" y="10" width="0.5" height="3" fill="#D1D5DB" opacity=".55"/>

        {/* ── OCCUPANT (head + blanket lump) ── */}
        {occupied && (
          <g>
            {/* head — pixel-art rounded square (no harsh outline circle) */}
            <rect x="13" y="10.5" width="6" height="4" fill="#FDE1C8"/>
            <rect x="12" y="11.5" width="1" height="2" fill="#FDE1C8"/>
            <rect x="19" y="11.5" width="1" height="2" fill="#FDE1C8"/>
            {/* hair */}
            <rect x="13" y="10" width="6" height="1" fill="#6B4423"/>
            <rect x="14" y="9.5" width="4" height="0.7" fill="#6B4423"/>
            {/* closed eyes */}
            <rect x="14" y="12.6" width="1" height="0.4" fill={C}/>
            <rect x="17" y="12.6" width="1" height="0.4" fill={C}/>
            {/* light face outline */}
            <rect x="12.4" y="10.5" width="0.4" height="4" fill={C} opacity=".4"/>
            <rect x="19.2" y="10.5" width="0.4" height="4" fill={C} opacity=".4"/>
            <rect x="13"   y="14.2" width="6" height="0.4" fill={C} opacity=".4"/>
          </g>
        )}

        {/* ── BLANKET (lower 2/3 of mattress) ── */}
        <rect x="1" y="18" width="30" height="14" fill={p.blanket}/>
        {/* sheet showing above blanket */}
        <rect x="1" y="17.4" width="30" height="0.8" fill="#FFFFFF"/>
        {/* top fold seam on blanket */}
        <rect x="1" y="18" width="30" height="0.5" fill={p.blanketHi}/>
        <rect x="1" y="18.5" width="30" height="0.4" fill={p.blanketDk}/>
        {/* subtle vertical fold lines */}
        <rect x="9"  y="19" width="0.4" height="12" fill={p.blanketDk} opacity=".4"/>
        <rect x="16" y="19" width="0.4" height="12" fill={p.blanketDk} opacity=".25"/>
        <rect x="23" y="19" width="0.4" height="12" fill={p.blanketDk} opacity=".4"/>
        {/* bottom shadow */}
        <rect x="1" y="30.5" width="30" height="1.5" fill={p.blanketDk} opacity=".55"/>
        {/* feet bulges */}
        {occupied && (
          <g>
            <rect x="6"  y="29" width="6" height="2" fill={p.blanketDk} opacity=".55"/>
            <rect x="20" y="29" width="6" height="2" fill={p.blanketDk} opacity=".55"/>
          </g>
        )}

        {/* ── MATTRESS FRONT edge (thickness) ── */}
        <rect x="1" y="33" width="30" height="2" fill={p.sheetDk}/>
        <rect x="2" y="33.2" width="28" height="0.4" fill={p.sheet}/>

        {/* ── BED FRAME / FOOT PANEL ── */}
        <rect x="1" y="35" width="30" height="3" fill={p.frame}/>
        <rect x="2" y="35.3" width="28" height="0.6" fill={p.frameLt}/>
        <rect x="1" y="38" width="30" height="3" fill={p.frameDk}/>
        <rect x="2" y="38.4" width="28" height="0.4" fill={p.frame}/>

        {/* ── SIDE BED RAILS (peek out left + right at mattress level) ── */}
        <rect x="-1" y="14" width="3" height="14" fill={p.frameDk}/>
        <rect x="-0.6" y="15" width="0.6" height="12" fill={p.frameLt}/>
        <rect x="30"  y="14" width="3" height="14" fill={p.frameDk}/>
        <rect x="32"  y="15" width="0.6" height="12" fill={p.frameLt}/>

        {/* ── LEGS / WHEELS ── */}
        <rect x="2" y="41" width="3" height="5" fill={p.frameDk}/>
        <rect x="27" y="41" width="3" height="5" fill={p.frameDk}/>
        <ellipse cx="3.5" cy="46.5" rx="2" ry="1.3" fill={C}/>
        <ellipse cx="28.5" cy="46.5" rx="2" ry="1.3" fill={C}/>
      </svg>

      {/* label */}
      {label && (
        <div style={{
          position: 'absolute', left: -1, top: -10,
          background: '#fff', border: `1.5px solid ${C}`, padding: '0 3px',
          fontFamily: '"DungGeunMo",monospace', fontSize: 7, color: C,
          boxShadow: `1.5px 1.5px 0 0 ${C}`,
          whiteSpace: 'nowrap', zIndex: 5,
        }}>{label}</div>
      )}
    </div>
  );
}

// ─── Reception desk (4w×2h) ─────────────────────────────────────────
// 2.5D v2: long counter top + visible front + 4 leg posts (proper desk).
// Projection is fixed (≈70° top-down): the TOP face always fills most of the
// height regardless of h, so a 3×1 desk reads the same as a 4×2 (not edge-on).
function IReception({ x, y, w = 4, h = 2, label }) {
  const W = w * 16;
  const legH = 8, apronH = 4;
  const H = h * 16 + 8;            // container/viewBox height
  const topB = H - legH - apronH;  // bottom edge of the top face
  const cx = w * 8;
  // accessories live on the back half of the top face; keep the monitor (incl.
  // its base + stand) clear of the front apron edge (topB).
  const monH = Math.min(8, topB - 6);
  const monY = 2;
  return (
    <div style={{
      position: 'absolute', left: x * ITILE, top: y * ITILE - 4,
      width: w * ITILE, height: H,
    }}>
      <svg viewBox={`0 0 ${W} ${H}`} width={w * ITILE} height={H} shapeRendering="crispEdges" preserveAspectRatio="none">
        <rect x={W*0.12} y={H-1-W*0.2} width={W*0.86} height={W*0.2} rx="1.5" fill="rgba(0,0,0,.16)"/>
        {/* DESK TOP (flat rectangle — RPG-Maker 2.5D, top & bottom edges equal) */}
        <path d={`M 2 1 L ${W-2} 1 L ${W-2} ${topB} L 2 ${topB} Z`}
              fill="#ECEAE1" stroke={IP.ink} strokeWidth=".5"/>
        {/* top back-edge highlight */}
        <rect x="3" y="1.5" width={W-6} height="1.9" fill="#FAF8F2"/>
        {/* seam line near the front edge */}
        <line x1="2" y1={topB-2.5} x2={W-2} y2={topB-2.5} stroke={IP.ink} strokeWidth=".25" opacity=".15"/>

        {/* DESK FRONT APRON (thickness band under top) */}
        <rect x="2" y={topB} width={W-4} height={apronH} fill="#C6C2B6" stroke={IP.ink} strokeWidth=".4"/>
        <rect x="3" y={topB+0.5} width={W-6} height=".7" fill="#DAD6CA"/>

        {/* BACK leg stubs (chrome, peek above the top) */}
        <rect x="3" y="0" width="2" height="1.6" fill="#9CA3AF" stroke={IP.ink} strokeWidth=".3"/>
        <rect x={W-5} y="0" width="2" height="1.6" fill="#9CA3AF" stroke={IP.ink} strokeWidth=".3"/>

        {/* FRONT legs (chrome) */}
        <rect x="2" y={H-legH} width="3" height={legH} fill="#9CA3AF" stroke={IP.ink} strokeWidth=".4"/>
        <rect x="2.5" y={H-legH+0.5} width="1" height={legH-1} fill="#CBD5E1"/>
        <rect x={W-5} y={H-legH} width="3" height={legH} fill="#9CA3AF" stroke={IP.ink} strokeWidth=".4"/>
        <rect x={W-4.5} y={H-legH+0.5} width="1" height={legH-1} fill="#CBD5E1"/>

        {/* MONITOR seen from above-behind: thin top cap + screen tilted up */}
        <rect x={cx-6} y={monY} width="12" height={monH} fill="#1F2937" stroke={IP.ink} strokeWidth=".4"/>
        <rect x={cx-5} y={monY+1} width="10" height={monH-2} fill="#0F1A24"/>
        <rect x={cx-4} y={monY+1.8} width="8" height=".7" fill="#10B981"/>
        <rect x={cx-4} y={monY+3.2} width="8" height=".7" fill="#22D3EE"/>
        <rect x={cx-4} y={monY+4.6} width="6" height=".7" fill="#FACC15"/>
        {/* monitor base + stand on the desktop */}
        <rect x={cx-1} y={monY+monH} width="2" height="1.4" fill="#4B5563"/>
        <ellipse cx={cx} cy={monY+monH+2} rx="3.5" ry="1" fill="#374151"/>

        {/* CLIPBOARD lying flat on the top (left) */}
        <rect x="5" y={topB-7} width="6.5" height="6" fill="#FEF3C7" stroke={IP.ink} strokeWidth=".3"/>
        <rect x="7" y={topB-7.8} width="2.5" height="1.2" fill="#9CA3AF" stroke={IP.ink} strokeWidth=".25"/>
        <line x1="6" y1={topB-5} x2="10.5" y2={topB-5} stroke={IP.ink} strokeWidth=".2"/>
        <line x1="6" y1={topB-3.5} x2="10.5" y2={topB-3.5} stroke={IP.ink} strokeWidth=".2"/>

        {/* COFFEE MUG seen from above: ring + handle (right) */}
        {w >= 3 && (
          <g>
            <ellipse cx={W-8} cy={topB-4} rx="2.6" ry="2.2" fill="#FFFFFF" stroke={IP.ink} strokeWidth=".4"/>
            <ellipse cx={W-8} cy={topB-4} rx="1.7" ry="1.4" fill="#6B2C0E"/>
            <path d={`M ${W-5.6} ${topB-5} Q ${W-3.6} ${topB-4} ${W-5.6} ${topB-3}`} fill="none" stroke={IP.ink} strokeWidth=".5"/>
          </g>
        )}
      </svg>

      {label && (
        <div style={{ position: 'absolute', left: '50%', top: -16, transform: 'translateX(-50%)',
          background: '#fff', border: `1.5px solid ${IP.ink}`, padding: '0 4px',
          fontFamily: '"DungGeunMo",monospace', fontSize: 8, color: IP.ink, whiteSpace: 'nowrap',
          boxShadow: `1.5px 1.5px 0 0 ${IP.ink}`, zIndex: 5 }}>{label}</div>
      )}
    </div>
  );
}

// ─── NurseDeskI — straight (I-bar) nursing/charting station ─────────
// White clinical version of NurseStationDesk: one straight counter run with a
// back monitor wall + keyboards, drawer pedestals at the ends, and side desk
// accessories. The everywhere-usable hub desk (use NurseStationDesk for the
// big ㄷ/U version). U/I desks are common furniture — no wood anywhere.
function NurseDeskI({ x, y, w = 8, h = 2, label }) {
  const W = w * 16, HH = h * 16, R = 10, TH = HH + R;
  const qz = '#ECEAE1', qzEdge = '#D2CDBE', qzHi = '#FAF8F2';
  const body = '#E4E2D8', bodyDk = '#C6C2B6';
  const nMon = Math.max(2, w - 3);
  const monXs = [];
  for (let i = 0; i < nMon; i++) monXs.push(10 + (i + 0.5) * ((W - 20) / nMon));
  return (
    <div style={{ position: 'absolute', left: x * 16, top: y * 16 - R, width: W, height: TH }}>
      <svg viewBox={`0 0 ${W} ${TH}`} width={W} height={TH} shapeRendering="crispEdges" preserveAspectRatio="none">
        {/* counter body */}
        <rect x="2" y={R} width={W - 4} height={HH - 2} fill={body} stroke={IP.ink} strokeWidth="0.7"/>
        {/* quartz top + raised back ledge */}
        <rect x="2" y={R - 2} width={W - 4} height="12" fill={qz} stroke={IP.ink} strokeWidth="0.6"/>
        <rect x="2" y={R - 4} width={W - 4} height="3" fill={qzEdge} stroke={IP.ink} strokeWidth="0.5"/>
        <rect x="3" y={R - 3.4} width={W - 6} height="1" fill={qzHi}/>
        {/* monitor wall (screens face down toward viewer) */}
        {monXs.map((mx, i) => (
          <g key={i}>
            <rect x={mx - 1} y={R + 5} width="2" height="2" fill="#3A4048"/>
            <rect x={mx - 6} y={R - 6} width="12" height="12" fill="#1B2128" stroke={IP.ink} strokeWidth="0.5"/>
            <rect x={mx - 4.8} y={R - 4.8} width="9.6" height="9" fill="#0F1A24"/>
            <rect x={mx - 4} y={R - 3.6} width="8" height="1" fill="#2BB3C8"/>
            <rect x={mx - 4} y={R - 1.8} width="6" height="0.9" fill="#5A6B78"/>
            <rect x={mx - 4} y={R - 0.2} width="8" height="0.9" fill="#E0A23A"/>
            {/* keyboard */}
            <rect x={mx - 5} y={R + 8} width="10" height="2.4" fill="#B7BEC6" stroke={IP.ink} strokeWidth="0.4"/>
          </g>
        ))}
        {/* drawer pedestals at the ends */}
        {[3, W - 3 - 14].map((dx, i) => (
          <g key={'d' + i}>
            <rect x={dx} y={R + HH - 18} width="14" height="14" fill={bodyDk} stroke={IP.ink} strokeWidth="0.5"/>
            {[0, 1].map(r => (
              <g key={r}>
                <rect x={dx + 1.5} y={R + HH - 16 + r * 6} width="11" height="4.6" fill={body} stroke={IP.ink} strokeWidth="0.4"/>
                <rect x={dx + 5} y={R + HH - 14 + r * 6} width="4" height="1" fill="#9AA1A8"/>
              </g>
            ))}
          </g>
        ))}
      </svg>
      {label && (
        <div style={{ position: 'absolute', left: '50%', top: -6, transform: 'translateX(-50%)',
          background: '#fff', border: `1.5px solid ${IP.ink}`, padding: '0 4px',
          fontFamily: '"DungGeunMo",monospace', fontSize: 8, color: IP.ink, whiteSpace: 'nowrap',
          boxShadow: `1.5px 1.5px 0 0 ${IP.ink}`, zIndex: 5 }}>{label}</div>
      )}
    </div>
  );
}

// ─── Vital monitor on stand ─────────────────────────────────────────
function IMonitor({ x, y, beep }) {
  return (
    <div style={{ position: 'absolute', left: x * ITILE, top: y * ITILE - 8, width: ITILE, height: ITILE * 2 }}>
      {/* ground contact shadow */}
      <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', bottom: -2, width: ITILE * 0.85, height: 5, background: 'rgba(0,0,0,.16)', borderRadius: '50%' }}/>
      {/* wheeled base */}
      <div style={{ position: 'absolute', left: 1, right: 1, bottom: 0, height: 5, background: IP.metalDk, border: `1.5px solid ${IP.ink}` }}>
        <div style={{ position: 'absolute', left: 0, bottom: -2, width: 3, height: 3, background: IP.ink, borderRadius: '50%' }}/>
        <div style={{ position: 'absolute', right: 0, bottom: -2, width: 3, height: 3, background: IP.ink, borderRadius: '50%' }}/>
      </div>
      {/* pole */}
      <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', bottom: 4, width: 3, height: 8, background: IP.metal, border: `1px solid ${IP.ink}` }}/>
      {/* top face of monitor box (dominant, high POV) */}
      <div style={{ position: 'absolute', left: 2, right: 1, top: -6, height: 7, background: IP.metal, border: `1.5px solid ${IP.ink}`, zIndex: 1 }}>
        <div style={{ position: 'absolute', left: 1, right: 1, top: 1, height: 1.5, background: '#E2E5EB', opacity: .5 }}/>
      </div>
      {/* right side face */}
      <div style={{ position: 'absolute', right: -2, top: 0, height: ITILE + 4, width: 3, background: IP.metalDk, border: `1px solid ${IP.ink}` }}/>
      {/* monitor front face (screen tilted toward viewer) */}
      <div style={{ position: 'absolute', left: 2, right: 2, top: 0, height: ITILE + 4, background: IP.metalDk, border: `2px solid ${IP.ink}` }}>
        <div style={{ position: 'absolute', inset: 1.5, background: '#0F1A24' }}>
          <div style={{ position: 'absolute', left: 1, right: 1, top: 2, height: 1, background: '#22D3EE' }}/>
          <div style={{ position: 'absolute', left: 1, right: 1, top: 6, height: 1, background: '#F87171' }}/>
          <div style={{ position: 'absolute', left: 1, right: 1, top: 9, height: 1, background: '#FACC15' }}/>
        </div>
        <div style={{ position: 'absolute', right: 1, top: 1, width: 1.5, height: 1.5, background: '#10B981' }}/>
      </div>
      {beep && (
        <div style={{ position: 'absolute', top: -10, right: -4, background: '#EF4444', color: '#fff', border: `1.5px solid ${IP.ink}`, padding: '0 3px', fontFamily: '"DungGeunMo",monospace', fontSize: 8, animation: 'forinBlink .8s steps(2,end) infinite', zIndex: 5 }}>♪</div>
      )}
    </div>
  );
}

// ─── IV stand ───────────────────────────────────────────────────────
// True 2.5D: tall vertical pole + hook curling OVER the top (handle opens
// upward so the bag's loop slots into the curl) + bag hangs BELOW the hook
// + drip chamber + tubing + spider base. Viewed from 45° upper-front.
function IIV({ x, y }) {
  return (
    <div style={{ position: 'absolute', left: x * ITILE, top: y * ITILE - 22, width: ITILE, height: ITILE * 2.6 }}>
      {/* ── Hook curling upward (an inverted-J) ── */}
      <svg viewBox="0 0 16 18" width={ITILE} height={ITILE * 1.1} shapeRendering="crispEdges" style={{ position: 'absolute', top: 0, left: 0 }}>
        {/* pole top stub */}
        <rect x="7" y="7" width="2" height="5" fill={IP.metal} stroke={IP.ink} strokeWidth=".5"/>
        {/* curl over top — two-step hook (one diagonal riser + top bar) */}
        <rect x="4" y="3" width="3" height="5" fill={IP.metal} stroke={IP.ink} strokeWidth=".5"/>
        <rect x="3" y="1" width="6" height="2" fill={IP.metal} stroke={IP.ink} strokeWidth=".5"/>
        <rect x="9" y="2" width="2" height="3" fill={IP.metal} stroke={IP.ink} strokeWidth=".5"/>
        {/* highlight on left edge (toward light) */}
        <rect x="3" y="1.4" width="3" height="0.6" fill="#E2E5EB"/>
      </svg>

      {/* ── IV bag (hangs below hook, has thickness/depth) ── */}
      <div style={{ position: 'absolute', left: 1, top: 14, width: 14, height: 14 }}>
        {/* bag side (depth strip) */}
        <div style={{ position: 'absolute', right: -2, top: 1, bottom: 1, width: 3, background: '#5E8FA8', border: `1px solid ${IP.ink}` }}/>
        {/* bag front face */}
        <div style={{ position: 'absolute', inset: 0, background: '#A8DCEC', border: `2px solid ${IP.ink}` }}>
          {/* top highlight (catches light) */}
          <div style={{ position: 'absolute', left: 1, right: 1, top: 1, height: 1.5, background: '#D4F0F8' }}/>
          {/* fluid level */}
          <div style={{ position: 'absolute', left: 1, right: 1, top: 3, bottom: 5, background: '#7DBFD9' }}/>
          {/* label */}
          <div style={{ position: 'absolute', left: 1, right: 1, bottom: 1, height: 4, background: '#fff', border: `0.5px solid ${IP.ink}55` }}>
            <div style={{ position: 'absolute', left: 1, right: 1, top: 1, height: 0.8, background: IP.ink + '88' }}/>
            <div style={{ position: 'absolute', left: 1, right: 1, top: 2.5, height: 0.8, background: IP.ink + '55' }}/>
          </div>
        </div>
        {/* hanging loop (small ring at top, connecting to hook) */}
        <div style={{ position: 'absolute', left: '50%', top: -4, transform: 'translateX(-50%)', width: 4, height: 4, background: 'transparent', border: `1.5px solid ${IP.ink}`, borderRadius: '50%' }}/>
      </div>

      {/* ── Drip chamber (cylindrical, below bag) ── */}
      <div style={{ position: 'absolute', left: 5, top: 30, width: 6, height: 8 }}>
        <div style={{ position: 'absolute', right: -1, top: 1, bottom: 1, width: 1.5, background: '#7DBFD9', border: `0.5px solid ${IP.ink}` }}/>
        <div style={{ position: 'absolute', inset: 0, background: '#D4F0F8', border: `1.5px solid ${IP.ink}` }}>
          <div style={{ position: 'absolute', left: 1, right: 1, top: 3, height: 3, background: '#A8DCEC' }}/>
          {/* drip droplet */}
          <div style={{ position: 'absolute', left: '50%', top: 1.5, transform: 'translateX(-50%)', width: 1, height: 1, background: '#5E8FA8' }}/>
        </div>
      </div>

      {/* ── Vertical pole (3D cylinder: dark right side + light left side) ── */}
      <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)',
        top: 40, bottom: 6, width: 3 }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 1, background: '#E2E5EB' }}/>
        <div style={{ position: 'absolute', left: 1, top: 0, bottom: 0, width: 1, background: IP.metal }}/>
        <div style={{ position: 'absolute', left: 2, top: 0, bottom: 0, width: 1, background: IP.metalDk }}/>
      </div>

      {/* ── Spider base (5 legs splayed, viewed from above-angle: visible top + legs) ── */}
      <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', bottom: 0, width: 14, height: 8 }}>
        {/* top hub (round) */}
        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: 0, width: 6, height: 3, background: IP.metalDk, border: `1px solid ${IP.ink}`, borderRadius: '50%' }}>
          <div style={{ position: 'absolute', left: 1, top: 0.5, width: 2, height: 0.8, background: '#E2E5EB' }}/>
        </div>
        {/* legs */}
        <div style={{ position: 'absolute', left: 0,  top: 3, width: 7, height: 2, background: IP.metalDk, border: `0.5px solid ${IP.ink}`, transform: 'rotate(20deg)', transformOrigin: '100% 50%' }}/>
        <div style={{ position: 'absolute', right: 0, top: 3, width: 7, height: 2, background: IP.metalDk, border: `0.5px solid ${IP.ink}`, transform: 'rotate(-20deg)', transformOrigin: '0% 50%' }}/>
        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: 4, width: 2, height: 3, background: IP.metalDk, border: `0.5px solid ${IP.ink}` }}/>
        {/* wheels at leg tips */}
        <div style={{ position: 'absolute', left: 0, bottom: 0, width: 2, height: 2, background: IP.ink, borderRadius: '50%' }}/>
        <div style={{ position: 'absolute', right: 0, bottom: 0, width: 2, height: 2, background: IP.ink, borderRadius: '50%' }}/>
      </div>
    </div>
  );
}

// ─── Curtain (around bay) — 1 tile wide ─────────────────────────────
function ICurtain({ x, y, w = 1, h = 1, color = '#A7C7E7' }) {
  return (
    <div style={{
      position: 'absolute', left: x * ITILE, top: y * ITILE,
      width: w * ITILE, height: h * ITILE,
      background: color, border: `1.5px solid ${IP.ink}`,
      backgroundImage: `repeating-linear-gradient(90deg, ${IP.ink}33 0 1px, transparent 1px 3px)`,
    }}/>
  );
}

// ─── Chair (1 tile) ─────────────────────────────────────────────────
function IChair({ x, y, color = '#FED7AA', facing = 'down' }) {
  const dark = darkenHex(color, 0.55);
  const gap = darkenHex(color, 0.32);
  const lite = lightenHex(color, 1.15);
  const liter = lightenHex(color, 1.32);
  const leg = '#9CA3AF', legHi = '#CBD5E1', ink = IP.ink;
  // 5 vertical spindles across the backrest
  const spindles = (yTop, h) => [0,1,2,3,4].map(i => (
    <rect key={i} x={3.6 + i * 1.95} y={yTop} width="1.15" height={h} fill={color} stroke={ink} strokeWidth=".2"/>
  ));
  let inner, flip = false;

  if (facing === 'up') {
    // BACK view: we look at the rear of the chair — tall crown rail + spindle
    // back face us; the seat is mostly hidden, rear legs drop straight down.
    inner = (
      <g>
        {/* seat sliver peeking above the back */}
        <path d="M 3 10.5 L 13 10.5 L 12 12.6 L 4 12.6 Z" fill={lite} stroke={ink} strokeWidth=".35"/>
        {/* crown rail (rounded ears) — bright top seen from behind-above */}
        <rect x="2.2" y="1" width="11.6" height="2.8" rx="1.2" fill={lite} stroke={ink} strokeWidth=".4"/>
        <rect x="3" y="1.4" width="10" height="1.1" fill={liter}/>
        {/* spindle back (tall, faces viewer) */}
        <rect x="2.9" y="3.8" width="10.2" height="6.9" fill={gap} stroke={ink} strokeWidth=".4"/>
        {spindles(4.0, 6.5)}
        {/* rear legs drop STRAIGHT down (square, like the front) */}
        <rect x="3" y="12.4" width="2.2" height="5.4" fill={leg} stroke={ink} strokeWidth=".35"/>
        <rect x="3.5" y="12.9" width="0.9" height="4.4" fill={legHi}/>
        <rect x="10.8" y="12.4" width="2.2" height="5.4" fill={leg} stroke={ink} strokeWidth=".35"/>
        <rect x="11.3" y="12.9" width="0.9" height="4.4" fill={legHi}/>
      </g>
    );
  } else if (facing === 'left' || facing === 'right') {
    flip = facing === 'left';   // draw back-on-LEFT, mirror for facing left
    inner = (
      <g>
        {/* BACKREST: horizontal TOP face (lighter, generous for high viewpoint) + boundary + side face */}
        <path d="M 1.6 1.4 L 5.6 1.4 L 5.6 8 L 1.6 8 Z" fill={liter} stroke={ink} strokeWidth=".4"/>
        <rect x="1.6" y="8" width="4" height="9.4" fill={color} stroke={ink} strokeWidth=".4"/>
        <line x1="1.6" y1="8" x2="5.6" y2="8" stroke={ink} strokeWidth=".45"/>{/* horizontal boundary */}
        <rect x="2.6" y="2.2" width="1.8" height="5.4" fill={gap} opacity=".4"/>{/* spindle hint on top face */}
        {/* SEAT top face to the right of the backrest */}
        <path d="M 5.6 7 L 15 7 L 15 16.6 L 5.6 16.6 Z" fill={lite} stroke={ink} strokeWidth=".4"/>
        <path d="M 6.2 7.8 L 14.2 7.8 L 14.2 15.8 L 6.2 15.8 Z" fill={color}/>
        <path d="M 5.6 16.6 L 15 16.6 L 15 18.4 L 5.6 18.4 Z" fill={dark} stroke={ink} strokeWidth=".4"/>
        {/* legs — both identical, dropping to the SAME bottom */}
        <rect x="2.4" y="16.8" width="2.2" height="7.8" fill={leg} stroke={ink} strokeWidth=".4"/>
        <rect x="2.9" y="17.3" width="1" height="6.8" fill={legHi}/>
        <rect x="12.4" y="18.4" width="2.2" height="6.2" fill={leg} stroke={ink} strokeWidth=".4"/>
        <rect x="12.9" y="18.9" width="1" height="5.2" fill={legHi}/>
      </g>
    );
  } else {
    // FRONT view (occupant faces viewer): crown rail + spindles behind a big seat.
    inner = (
      <g>
        {/* back legs peeking behind the crown */}
        <rect x="2.6" y="0.4" width="1.8" height="1.6" fill={leg} stroke={ink} strokeWidth=".25"/>
        <rect x="11.6" y="0.4" width="1.8" height="1.6" fill={leg} stroke={ink} strokeWidth=".25"/>
        {/* crown rail (rounded ears) */}
        <rect x="2.2" y="1" width="11.6" height="2.6" rx="1.2" fill={lite} stroke={ink} strokeWidth=".4"/>
        <rect x="3" y="1.4" width="10" height="1" fill={liter}/>
        {/* spindle backrest (taller) */}
        <rect x="2.9" y="3.6" width="10.2" height="5.2" fill={gap} stroke={ink} strokeWidth=".4"/>
        {spindles(3.8, 4.8)}
        {/* seat — dominant top face */}
        <path d="M 2.4 9 L 13.6 9 L 15 16.6 L 1 16.6 Z" fill={lite} stroke={ink} strokeWidth=".4"/>
        <path d="M 3.4 9.8 L 12.6 9.8 L 13.7 15.8 L 2.3 15.8 Z" fill={color}/>
        <path d="M 4 11.8 L 12 11.8" stroke={dark} strokeWidth=".5" opacity=".3"/>
        {/* seat front thickness */}
        <path d="M 1 16.6 L 15 16.6 L 15 18.4 L 1 18.4 Z" fill={dark} stroke={ink} strokeWidth=".4"/>
        {/* front legs */}
        <rect x="1.8" y="18.4" width="2.4" height="6" fill={leg} stroke={ink} strokeWidth=".4"/>
        <rect x="2.3" y="18.9" width="1" height="5" fill={legHi}/>
        <rect x="11.8" y="18.4" width="2.4" height="6" fill={leg} stroke={ink} strokeWidth=".4"/>
        <rect x="12.3" y="18.9" width="1" height="5" fill={legHi}/>
      </g>
    );
  }

  return (
    <div style={{ position: 'absolute', left: x * ITILE, top: y * ITILE - ITILE * 0.5, width: ITILE, height: ITILE * 1.6 }}>
      <svg viewBox="0 0 16 26" width={ITILE} height={ITILE * 1.6} shapeRendering="crispEdges"
           style={flip ? { transform: 'scaleX(-1)' } : undefined}>
          <ellipse cx="8.0" cy="25.0" rx="5.4" ry="2" fill="rgba(0,0,0,.16)"/>
        {inner}
      </svg>
    </div>
  );
}

function darkenHex(hex, f) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, Math.floor(((n >> 16) & 255) * f));
  const g = Math.max(0, Math.floor(((n >> 8) & 255) * f));
  const b = Math.max(0, Math.floor((n & 255) * f));
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}
function lightenHex(hex, f) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.min(255, Math.floor(((n >> 16) & 255) * f));
  const g = Math.min(255, Math.floor(((n >> 8) & 255) * f));
  const b = Math.min(255, Math.floor((n & 255) * f));
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

// ─── Cabinet — content-specific variants + 2.5D box geometry.
//   Each cabinet shows a visible TOP face and a right SIDE face for depth,
//   so it reads as a real 3D wall unit rather than a flat sticker.
function ICabinet({ x, y, w = 2, h = 1, variant, kind, label }) {
  const v = CABINET_VARIANTS[variant || kind] || CABINET_VARIANTS.supply;
  return (
    <div style={{
      position: 'absolute', left: x * ITILE, top: y * ITILE,
      width: w * ITILE, height: h * ITILE,
    }}>
      {/* TOP face — a band of lighter color rising slightly above the cabinet.
          This is the visible top surface of the cabinet "box". */}
      <div style={{ position: 'absolute', left: 3, right: -1, top: -4, height: 6,
        background: v.top, border: `2px solid ${IP.ink}`, transform: 'none', zIndex: 1 }}>
        <div style={{ position: 'absolute', left: 1, right: 1, top: 1, height: 1.5, background: v.topLight || '#ffffff', opacity: 0.4 }}/>
      </div>

      {/* RIGHT SIDE face — narrow vertical band giving depth to the right edge */}
      <div style={{ position: 'absolute', right: -3, top: -1, bottom: -2, width: 4,
        background: v.top, border: `2px solid ${IP.ink}`, zIndex: 0 }}/>

      {/* FRONT face — the cabinet body */}
      <div style={{ position: 'absolute', inset: 0, background: v.frame, border: `2.5px solid ${IP.ink}`, zIndex: 2 }}/>

      {/* Compartments (drawn over the front face) */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 3 }}>
        {Array.from({ length: w }).map((_, i) => v.renderTile(i, ITILE))}
      </div>

      {/* Category strip (left edge — colored tag) */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: v.tag, zIndex: 4 }}/>

      {/* base shadow line at bottom — gives "grounded" feel */}
      <div style={{ position: 'absolute', left: -2, right: -3, bottom: -2, height: 2,
        background: IP.ink, opacity: 0.4, zIndex: 5 }}/>

      {/* tag label */}
      {label && (
        <div style={{ position: 'absolute', left: 2, top: -12, background: v.tag, color: v.tagText,
          border: `1.5px solid ${IP.ink}`, padding: '0 3px',
          fontFamily: '"DungGeunMo",monospace', fontSize: 7,
          boxShadow: `1.5px 1.5px 0 0 ${IP.ink}`, whiteSpace: 'nowrap', zIndex: 6 }}>{label}</div>
      )}
    </div>
  );
}

// Per-variant tile renderer. Each tile is one ITILE-wide cabinet door so a
// w=4 cabinet shows 4 different compartments. Each variant also defines a
// `top` color (top face of the 3D box) and optional `topLight` highlight.
const CABINET_VARIANTS = {
  // SUPPLY — gauze rolls, bandages, syringes
  supply: {
    frame: '#D6CFB8', top: '#A89378', topLight: '#E8DCC0', tag: '#DC2626', tagText: '#fff',
    renderTile: (i, S) => (
      <div key={i} style={{ position: 'absolute', left: i * S + 3, top: 3, width: S - 6, bottom: 3, background: '#FFF8E7', border: `1.5px solid ${IP.ink}99` }}>
        {/* red cross top shelf */}
        <div style={{ position: 'absolute', left: '50%', top: 1, transform: 'translateX(-50%)', width: 4, height: 4 }}>
          <div style={{ position: 'absolute', left: 1.5, top: 0, width: 1, height: 4, background: '#DC2626' }}/>
          <div style={{ position: 'absolute', left: 0, top: 1.5, width: 4, height: 1, background: '#DC2626' }}/>
        </div>
        {/* bandage roll mid */}
        <div style={{ position: 'absolute', left: 2, top: 6, width: S - 10, height: 2, background: '#FED7AA', border: `0.6px solid ${IP.ink}66` }}/>
        {/* syringe bottom */}
        <div style={{ position: 'absolute', left: 1, bottom: 1, width: S - 8, height: 1.5, background: '#94A3B8' }}/>
        <div style={{ position: 'absolute', left: S - 9, bottom: 1, width: 1, height: 1.5, background: '#DC2626' }}/>
      </div>
    ),
  },
  // DRUG cabinet — locked, pill bottles
  drug: {
    frame: '#94A3B8', top: '#6B7280', tag: '#FACC15', tagText: '#1F2937',
    renderTile: (i, S) => (
      <div key={i} style={{ position: 'absolute', left: i * S + 3, top: 3, width: S - 6, bottom: 3, background: '#1F2937', border: `1.5px solid ${IP.ink}` }}>
        {/* pill bottle */}
        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: 2, width: 5, height: 4, background: ['#F87171','#FACC15','#A7F3D0'][i % 3] }}/>
        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: 1, width: 4, height: 1.5, background: '#fff' }}/>
        {/* lock at bottom */}
        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', bottom: 1, width: 3, height: 3, background: '#FACC15', border: `0.5px solid ${IP.ink}` }}/>
      </div>
    ),
  },
  // LINEN — folded sheets, towels
  linen: {
    frame: '#E8DCC0', top: '#C8B68C', tag: '#3B82F6', tagText: '#fff',
    renderTile: (i, S) => (
      <div key={i} style={{ position: 'absolute', left: i * S + 3, top: 3, width: S - 6, bottom: 3, background: '#fff', border: `1.5px solid ${IP.ink}99` }}>
        <div style={{ position: 'absolute', left: 1, top: 1, right: 1, height: 2, background: '#BAE6FD', borderBottom: `0.5px solid ${IP.ink}66` }}/>
        <div style={{ position: 'absolute', left: 1, top: 4, right: 1, height: 2, background: '#FBCFE8', borderBottom: `0.5px solid ${IP.ink}66` }}/>
        <div style={{ position: 'absolute', left: 1, top: 7, right: 1, height: 2, background: '#fff', border: `0.5px solid ${IP.ink}66` }}/>
      </div>
    ),
  },
  // CHART — manila folder cabinet (records)
  chart: {
    frame: '#7C5A38', top: '#5C3A1A', tag: '#A88862', tagText: '#fff',
    renderTile: (i, S) => (
      <div key={i} style={{ position: 'absolute', left: i * S + 3, top: 3, width: S - 6, bottom: 3, background: '#1F2937', border: `1.5px solid ${IP.ink}` }}>
        {/* folder tabs sticking out */}
        {[0,1,2,3].map(k => (
          <div key={k} style={{ position: 'absolute', left: 1.5 + k * 2, top: 1.5, width: 1.5, height: S - 10, background: ['#FCD34D','#FB923C','#A7F3D0','#FBCFE8'][k], borderTop: `0.5px solid ${IP.ink}` }}/>
        ))}
        {/* handle */}
        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', bottom: 1, width: 4, height: 1.5, background: '#FACC15' }}/>
      </div>
    ),
  },
  // STERILE — covered with sterile blue drape (OR supply)
  sterile: {
    frame: '#4F76A4', top: '#385878', tag: '#A5D8E8', tagText: '#1F2937',
    renderTile: (i, S) => (
      <div key={i} style={{ position: 'absolute', left: i * S + 3, top: 3, width: S - 6, bottom: 3, background: '#A5D8E8', border: `1.5px solid ${IP.ink}99` }}>
        <div style={{ position: 'absolute', inset: 1, backgroundImage: `repeating-linear-gradient(45deg, rgba(255,255,255,.4) 0 1px, transparent 1px 3px)` }}/>
        {/* sealed pouch shape */}
        <div style={{ position: 'absolute', left: 2, top: 2, right: 2, height: 3, background: '#fff', border: `0.5px solid ${IP.ink}55` }}/>
        <div style={{ position: 'absolute', left: 2, bottom: 2, right: 2, height: 3, background: '#fff', border: `0.5px solid ${IP.ink}55` }}/>
      </div>
    ),
  },
  // EQUIPMENT — defibrillator + tools
  equipment: {
    frame: '#475569', top: '#1F2937', tag: '#EF4444', tagText: '#fff',
    renderTile: (i, S) => (
      <div key={i} style={{ position: 'absolute', left: i * S + 3, top: 3, width: S - 6, bottom: 3, background: '#1F2937', border: `1.5px solid ${IP.ink}` }}>
        <div style={{ position: 'absolute', left: 1.5, top: 2, right: 1.5, height: 3, background: '#FACC15', border: `0.5px solid ${IP.ink}` }}/>
        <div style={{ position: 'absolute', left: 1.5, top: 6, right: 1.5, height: 1.5, background: '#9CA3AF' }}/>
        <div style={{ position: 'absolute', left: 1.5, bottom: 1.5, right: 1.5, height: 2, background: '#6B7280' }}/>
      </div>
    ),
  },
  // PHARMA — colored pill jars (legacy variant)
  pharma: {
    frame: '#D6CFB8', top: '#A89378', tag: '#16A34A', tagText: '#fff',
    renderTile: (i, S) => (
      <div key={i} style={{ position: 'absolute', left: i * S + 3, top: 3, width: S - 6, bottom: 3, background: '#fff', border: `1.5px solid ${IP.ink}99` }}>
        <div style={{ position: 'absolute', left: 1, top: 1, right: 1, height: 2, background: '#F87171' }}/>
        <div style={{ position: 'absolute', left: 1, top: 4, right: 1, height: 2, background: '#FACC15' }}/>
        <div style={{ position: 'absolute', left: 1, top: 7, right: 1, height: 2, background: '#A7F3D0' }}/>
      </div>
    ),
  },
};

// ─── Plant pot ──────────────────────────────────────────────────────
function IPlant({ x, y }) {
  return (
    <div style={{ position: 'absolute', left: x * ITILE, top: y * ITILE - 6, width: ITILE, height: ITILE * 1.3 }}>
      <svg viewBox="0 0 16 22" width={ITILE} height={ITILE * 1.3} shapeRendering="crispEdges">
          <ellipse cx="8.0" cy="21.0" rx="5.4" ry="2" fill="rgba(0,0,0,.16)"/>
        {/* foliage rising from the pot */}
        <rect x="6" y="2" width="3" height="8" fill="#4A7A4A"/>
        <rect x="4" y="4" width="3" height="6" fill="#3E6B3A"/>
        <rect x="9" y="3" width="3" height="7" fill="#3E6B3A"/>
        <rect x="3" y="6" width="2" height="4" fill="#5E9554"/>
        <rect x="11" y="5" width="2" height="5" fill="#5E9554"/>
        <rect x="7" y="1" width="2" height="3" fill="#5E9554"/>
        {/* pot BODY — foreshortened tapered tub */}
        <path d="M 4 13 L 12 13 L 10.6 20 L 5.4 20 Z" fill="#7C3F1A" stroke={IP.ink} strokeWidth=".7"/>
        <path d="M 5.4 20 A 3 1.2 0 0 0 10.6 20" fill="#7C3F1A" stroke={IP.ink} strokeWidth=".6"/>
        <path d="M 6 16 L 10 16 L 9.4 19.6 A 2 .8 0 0 1 6.6 19.6 Z" fill="#5C2A0D" opacity=".35"/>
        {/* pot TOP face — elliptical rim + soil opening */}
        <ellipse cx="8" cy="13" rx="4" ry="1.7" fill="#A0531C" stroke={IP.ink} strokeWidth=".6"/>
        <ellipse cx="8" cy="13" rx="2.7" ry="1" fill="#3A2A1A"/>
        <ellipse cx="8" cy="12.7" rx="4" ry="1.4" fill="none" stroke="#B8702A" strokeWidth=".6"/>
      </svg>
    </div>
  );
}

// ─── Hotspot (! quest marker) ───────────────────────────────────────
function IHotspot({ x, y, kind = 'quest', label }) {
  const colors = { quest: '#FEF08A', urgent: '#EF4444', info: '#fff', police: '#1F2937' };
  return (
    <div style={{ position: 'absolute', left: x * ITILE - 2, top: y * ITILE - 18, width: ITILE + 4, zIndex: 10, pointerEvents: 'none' }}>
      <div style={{
        position: 'relative', margin: '0 auto', width: 18, height: 18,
        background: colors[kind], border: `2.5px solid ${IP.ink}`,
        boxShadow: `2px 2px 0 0 ${IP.ink}`,
        fontFamily: '"DungGeunMo",monospace', fontSize: 12, color: kind === 'police' ? '#fff' : IP.ink,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: 'forinBob 1.2s ease-in-out infinite',
      }}>
        {kind === 'urgent' ? '!' : (kind === 'info' ? '?' : '!')}
      </div>
      {label && (
        <div style={{
          position: 'absolute', left: '50%', top: 24, transform: 'translateX(-50%)',
          background: '#fff', border: `1.5px solid ${IP.ink}`, padding: '0 4px',
          fontFamily: '"DungGeunMo",monospace', fontSize: 7, color: IP.ink, whiteSpace: 'nowrap',
          boxShadow: `1.5px 1.5px 0 0 ${IP.ink}`,
        }}>{label}</div>
      )}
    </div>
  );
}

// ─── NPC sprites (kinds for staff/patient/etc) ─────────────────────
function INpc(props) {
  // Main forin character style: Derp smooth NPC (big head + short legs).
  if (window.DerpNpc) return <window.DerpNpc {...props} size={props.size || 28}/>;
  // Fallbacks for older sprite sets.
  if (window.INpcV2) return <window.INpcV2 {...props}/>;
  const { x, y, kind = 'nurse', shirt, hair = '#3C2A18' } = props;
  const C = IP.ink;
  // shirt color by kind
  const palette = {
    nurse: { shirt: shirt || IP.greenScrub, hat: false },
    doctor: { shirt: '#fff', hat: false },
    surgeon: { shirt: IP.blueScrub, hat: true, hatColor: IP.blueScrub },
    patient: { shirt: '#FED7AA', hat: false, gown: true },
    police: { shirt: '#1E3A8A', hat: true, hatColor: '#0F172A' },
    paramedic: { shirt: '#FACC15', hat: false },
    parent: { shirt: '#FBCFE8', hat: false },
    child: { shirt: '#BAE6FD', hat: false, small: true },
    visitor: { shirt: '#A78BFA', hat: false },
  };
  const p = palette[kind] || palette.nurse;
  const scale = p.small ? 0.7 : 1;
  return (
    <div style={{
      position: 'absolute', left: x * ITILE + 1, top: y * ITILE - 4,
      width: ITILE - 2, height: ITILE * 1.4,
      transform: `scale(${scale})`, transformOrigin: 'bottom center',
    }}>
      <svg viewBox="0 0 12 17" width={ITILE - 2} height={ITILE * 1.4} shapeRendering="crispEdges">
          <ellipse cx="6.0" cy="16.0" rx="4.1" ry="2" fill="rgba(0,0,0,.16)"/>
        {/* hat */}
        {p.hat && <rect x="2" y="0" width="8" height="2" fill={p.hatColor || '#1F2937'}/>}
        {kind === 'surgeon' && <rect x="2" y="0" width="8" height="3" fill={p.hatColor} stroke={C} strokeWidth=".3"/>}
        {kind === 'nurse' && <>
          <rect x="3" y="0" width="6" height="1" fill="#fff"/>
          <rect x="5" y="0.5" width="2" height="0.6" fill="#EF4444"/>
        </>}
        {/* hair */}
        {!p.hat && <rect x="2" y="1" width="8" height="2" fill={hair}/>}
        {/* face */}
        <rect x="3" y="3" width="6" height="3" fill="#FDE1C8" stroke={C} strokeWidth=".3"/>
        <rect x="4" y="4" width="1" height="1" fill={C}/>
        <rect x="7" y="4" width="1" height="1" fill={C}/>
        <rect x="5" y="5.4" width="2" height=".6" fill="#F87171"/>
        {/* body */}
        <rect x="2" y="6" width="8" height="5" fill={p.shirt} stroke={C} strokeWidth=".3"/>
        {/* cross on nurse */}
        {kind === 'nurse' && <>
          <rect x="5" y="7" width="2" height="2" fill="#EF4444"/>
          <rect x="4" y="7.5" width="4" height="1" fill="#EF4444"/>
        </>}
        {/* stethoscope on doctor */}
        {kind === 'doctor' && <>
          <rect x="4" y="6" width="4" height="0.5" fill="#1F2937"/>
          <rect x="5" y="8" width="2" height="2" fill="#1F2937"/>
        </>}
        {/* gown trim */}
        {p.gown && <rect x="2" y="9" width="8" height="0.8" fill="#fff" opacity=".6"/>}
        {/* arms */}
        <rect x="1" y="6" width="1" height="4" fill={p.shirt} stroke={C} strokeWidth=".3"/>
        <rect x="10" y="6" width="1" height="4" fill={p.shirt} stroke={C} strokeWidth=".3"/>
        {/* legs */}
        <rect x="3" y="11" width="2" height="4" fill={kind === 'patient' ? '#FDE1C8' : '#3F3D52'}/>
        <rect x="7" y="11" width="2" height="4" fill={kind === 'patient' ? '#FDE1C8' : '#3F3D52'}/>
        <rect x="3" y="15" width="3" height="1" fill={C}/>
        <rect x="6" y="15" width="3" height="1" fill={C}/>
        {/* badges */}
        {kind === 'police' && <rect x="5" y="7" width="2" height="2" fill="#FACC15"/>}
        {kind === 'paramedic' && <rect x="5" y="7" width="2" height="2" fill="#EF4444"/>}
      </svg>
    </div>
  );
}

// ─── Player (uses unified RPGSprite from chibi-npcs.jsx) ────────────
function IPlayer({ x, y, dir, walking }) {
  return (
    <div style={{
      position: 'absolute',
      left: x * ITILE - 6, top: y * ITILE - 19,
      zIndex: 9,
      animation: 'forinPlayerStep .6s ease-in-out infinite',
      transition: 'left .3s linear, top .3s linear',
    }}>
      {window.DerpPlayer
        ? <window.DerpPlayer size={28} tag="YOU" dir={dir} walking={walking}/>
        : window.ChibiPlayer
        ? <window.ChibiPlayer size={18} tag="YOU"/>
        : <div style={{ width: 18, height: 21, background: '#A7F3D0', border: `1px solid ${IP.ink}` }}/>}
    </div>
  );
}

// ─── Common interior screen wrapper ─────────────────────────────────
// renderer takes a function that renders absolutely-positioned children
// onto a (cols × rows) tile grid. Wraps in scroll viewport + HUD.
const ZOOM = 2; // Undertale-style camera zoom (each tile renders 2x size visually)

function InteriorScreen({
  label, deptCode, deptColor = '#DC2626', floor = 'clinical',
  cols, rows, playerStart, render, rooms, regions,
  topRight, missionText, missionUrgent, onElevator,
}) {
  const t = window.ForinTokens;
  const C = IP.ink;
  const scrollRef = React.useRef(null);
  const [pos, setPos] = React.useState(playerStart);
  const [pdir, setPdir] = React.useState('down');
  const [pwalk, setPwalk] = React.useState(false);
  const pwalkTimer = React.useRef(null);
  function istep(d) {
    setPdir(d); setPwalk(true);
    clearTimeout(pwalkTimer.current);
    pwalkTimer.current = setTimeout(() => setPwalk(false), 320);
    if (d === 'up')    setPos(p => ({ x: p.x, y: Math.max(1, p.y - 1) }));
    if (d === 'down')  setPos(p => ({ x: p.x, y: Math.min(rows - 2, p.y + 1) }));
    if (d === 'left')  setPos(p => ({ x: Math.max(0, p.x - 1), y: p.y }));
    if (d === 'right') setPos(p => ({ x: Math.min(cols - 1, p.x + 1), y: p.y }));
  }
  const [mapOpen, setMapOpen] = React.useState(false);
  const [elevOpen, setElevOpen] = React.useState(false);
  const [transitionTo, setTransitionTo] = React.useState(null); // region name being entered

  // Determine which region currently contains the player
  function regionAt(p) {
    if (!regions) return null;
    return regions.find(r => p.x >= r.bounds.x && p.x < r.bounds.x + r.bounds.w
                          && p.y >= r.bounds.y && p.y < r.bounds.y + r.bounds.h);
  }
  const currentRegion = regionAt(pos);

  // Detect region changes → trigger fade overlay
  const prevRegionRef = React.useRef(currentRegion?.id);
  React.useEffect(() => {
    if (currentRegion && currentRegion.id !== prevRegionRef.current) {
      setTransitionTo(currentRegion.name);
      const id = setTimeout(() => setTransitionTo(null), 700);
      prevRegionRef.current = currentRegion.id;
      return () => clearTimeout(id);
    }
  }, [currentRegion?.id]);

  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    // Camera centers on the player but is clamped by the browser to map bounds
    // (so the view never shows past the outer walls — eliminating dead area).
    el.scrollTo({
      left: pos.x * ITILE * ZOOM - el.clientWidth / 2 + (ITILE * ZOOM) / 2,
      top:  pos.y * ITILE * ZOOM - el.clientHeight / 2 + (ITILE * ZOOM) / 2,
      behavior: 'smooth',
    });
  }, [pos]);

  const mapW = cols * ITILE;
  const mapH = rows * ITILE;
  const mapWz = mapW * ZOOM;
  const mapHz = mapH * ZOOM;

  return (
    <div data-screen-label={label} style={{ height: '100%', background: '#1F2937', position: 'relative', overflow: 'hidden' }}>
      <window.ForinTopBar
        title={deptCode}
        left={<span style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 18, color: C }}>‹</span>}
        right={topRight || <span style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 12, color: C, display: 'inline-flex', alignItems: 'center', gap: 4 }}><window.PixelHeart size={11}/> 92%</span>}
      />

      {/* mission banner */}
      <div style={{ margin: '8px 12px 6px', background: missionUrgent ? '#FEE2E2' : t.yellow, border: `3px solid ${C}`, padding: '6px 10px', boxShadow: `3px 3px 0 0 ${missionUrgent ? '#EF4444' : t.yellowShadow}`, display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 20, height: 20, background: missionUrgent ? '#EF4444' : '#fff', color: missionUrgent ? '#fff' : C, border: `2px solid ${C}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"DungGeunMo",monospace', fontSize: 12, flexShrink: 0 }}>!</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 9, color: missionUrgent ? '#7F1D1D' : t.textSoft, lineHeight: 1 }}>{missionUrgent ? 'URGENT' : 'INSIDE'} · {deptCode}</div>
          <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 11, color: C, lineHeight: 1.2, marginTop: 2 }}>{missionText}</div>
        </div>
      </div>

      {/* viewport */}
      <div ref={scrollRef} style={{
        margin: '0 8px', height: 540, overflow: 'auto', position: 'relative',
        background: IP[`floor${floor.charAt(0).toUpperCase() + floor.slice(1)}`],
        border: `3px solid ${IP.ink}`, boxShadow: `4px 4px 0 0 ${IP.ink}`,
        scrollbarWidth: 'none',
      }}>
        <style>{`
          @keyframes forinBob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }
          @keyframes forinPlayerStep { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-1px)} }
          @keyframes forinBlink { 0%,49%{opacity:1} 50%,100%{opacity:0} }
          @keyframes forinTransitionFade { 0%{opacity:1} 70%{opacity:1} 100%{opacity:0} }
        `}</style>

        {/* zoom wrapper: scrollable extent is mapW*ZOOM × mapH*ZOOM
            inner div renders at native (mapW × mapH) then scaled up so all
            child coords stay in tile-units. */}
        <div style={{ position: 'relative', width: mapWz, height: mapHz, imageRendering: 'pixelated' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, width: mapW, height: mapH,
            transform: `scale(${ZOOM})`, transformOrigin: '0 0', imageRendering: 'pixelated' }}>
            {/* floor */}
            {Array.from({ length: rows }).map((_, y) => (
              Array.from({ length: cols }).map((_, x) => (
                <IFloor key={`${x}-${y}`} theme={floor} x={x} y={y}/>
              ))
            ))}

            {render({ pos, setPos })}

            {/* player */}
            <IPlayer x={pos.x} y={pos.y} dir={pdir} walking={pwalk}/>

            {/* Room mask — 4 black panels covering everything outside the current
                region. Renders ON TOP of all map content but inside the scaled wrapper. */}
            {currentRegion && (
              <RoomMask region={currentRegion} mapW={mapW} mapH={mapH}/>
            )}
          </div>
        </div>

        {/* Transition overlay (fade-in label when entering a new region) */}
        {transitionTo && (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 25, pointerEvents: 'none',
            background: 'rgba(0,0,0,.55)', backdropFilter: 'blur(2px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: 'forinTransitionFade .7s ease-out forwards',
          }}>
            <div style={{
              fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 22, color: '#fff',
              padding: '8px 18px', border: `3px solid #fff`,
              boxShadow: `0 0 0 1px ${IP.ink}, 4px 4px 0 ${IP.ink}`,
              background: 'rgba(0,0,0,.7)', letterSpacing: 1,
            }}>
              ➜  {transitionTo}
            </div>
          </div>
        )}

        {/* Current region badge (top-left inside viewport) */}
        {currentRegion && (
          <div style={{
            position: 'absolute', left: 12, top: 8, zIndex: 15,
            background: '#fff', border: `2.5px solid ${IP.ink}`,
            padding: '3px 8px', fontFamily: '"DungGeunMo","Galmuri11",monospace',
            fontSize: 10, color: IP.ink, boxShadow: `2px 2px 0 0 ${IP.ink}`,
            display: 'flex', alignItems: 'center', gap: 4, pointerEvents: 'none',
          }}>
            <span style={{ fontSize: 12 }}>{currentRegion.icon || '🚪'}</span>
            <span>{currentRegion.name}</span>
          </div>
        )}
      </div>

      {/* Fast travel modal */}
      {mapOpen && rooms && (
        <FastTravelModal rooms={rooms} deptCode={deptCode} pos={pos}
          onPick={(r) => { setPos({ x: r.x, y: r.y }); setMapOpen(false); }}
          onClose={() => setMapOpen(false)} />
      )}

      {/* HUD */}
      <div style={{ position: 'absolute', bottom: 100, left: 12, right: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ background: '#fff', border: `3px solid ${C}`, padding: '6px 10px', flex: 1, boxShadow: `3px 3px 0 0 ${C}` }}>
          <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 9, color: t.textSoft }}>ZONE</div>
          <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: C }}>{deptCode}</div>
        </div>
        {/* Elevator button — leave this dept, back to the floor selector */}
        <window.PixelIconButton bg={t.blue || '#BAE6FD'} size={52} caption="엘리베이터"
          fontSize={18} onClick={() => (onElevator ? onElevator() : setElevOpen(true))} title="엘리베이터">
          🛗
        </window.PixelIconButton>
        {/* Fast travel button */}
        {rooms && (
          <window.PixelIconButton bg={t.yellow} size={52} caption="빠른이동"
            fontSize={18} onClick={() => setMapOpen(true)} title="빠른 이동">
            🗺
          </window.PixelIconButton>
        )}
        <window.PixelDPad size={72} onMove={(d) => { istep(d); }}/>
        <window.PixelIconButton bg={t.mint} size={52} fontSize={18}>A</window.PixelIconButton>
      </div>

      {/* Elevator overlay — opens the floor selector over this dept */}
      {elevOpen && window.ScreenElevator && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 40 }}>
          <window.ScreenElevator onPickFloor={() => setElevOpen(false)} onClose={() => setElevOpen(false)}/>
          <button onClick={() => setElevOpen(false)} style={{ position: 'absolute', top: 10, left: 10, zIndex: 50, background: '#fff', border: `2px solid ${C}`, padding: '4px 10px', fontFamily: '"DungGeunMo",monospace', fontSize: 14, color: C, boxShadow: `2px 2px 0 0 ${C}` }}>‹ 돌아가기</button>
        </div>
      )}

      <window.ForinBottomNav active="campus"/>
    </div>
  );
}

Object.assign(window, {
  ITILE, IP, ZOOM,
  IFloor, IWall, IGlass, IDoor,
  IBed, IReception, NurseDeskI, IMonitor, IIV, ICurtain, IChair, ICabinet, IPlant,
  IHotspot, INpc, IPlayer, InteriorScreen,
  CABINET_VARIANTS, darkenHex, lightenHex,
});

// ─── RoomMask — paints solid black over everything outside the current
// region's bounds. Implemented as 4 absolutely-positioned panels around the
// rectangular cutout so the inner room remains fully visible.
function RoomMask({ region, mapW, mapH }) {
  const { x, y, w, h } = region.bounds;
  const left = x * ITILE, top = y * ITILE;
  const right = left + w * ITILE, bottom = top + h * ITILE;
  const black = '#0A0805';
  const style = (s) => ({ position: 'absolute', background: black, zIndex: 20, pointerEvents: 'none', ...s });
  return (
    <>
      {/* top */}
      <div style={style({ left: 0, top: 0, width: mapW, height: top })}/>
      {/* bottom */}
      <div style={style({ left: 0, top: bottom, width: mapW, height: mapH - bottom })}/>
      {/* left */}
      <div style={style({ left: 0, top, width: left, height: bottom - top })}/>
      {/* right */}
      <div style={style({ left: right, top, width: mapW - right, height: bottom - top })}/>
      {/* subtle vignette inside the room — gradient along edges */}
      <div style={style({
        left, top, width: w * ITILE, height: h * ITILE, background: 'transparent',
        boxShadow: `inset 0 0 24px rgba(0,0,0,.5)`,
      })}/>
    </>
  );
}

// ─── Fast Travel modal ──────────────────────────────────────────────
// Full-screen overlay listing all rooms in the current building. Each
// room is a clickable card that warps the player there.
function FastTravelModal({ rooms, deptCode, pos, onPick, onClose }) {
  const t = window.ForinTokens;
  const C = IP.ink;
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 30, background: 'rgba(31,41,55,0.7)', backdropFilter: 'blur(1px)' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `repeating-linear-gradient(0deg, rgba(255,255,255,.04) 0 1px, transparent 1px 3px)` }}/>

      {/* card */}
      <div style={{
        position: 'absolute', left: 14, right: 14, top: 80, bottom: 24,
        background: t.cream, border: `4px solid ${C}`, boxShadow: `6px 6px 0 0 ${C}`,
        display: 'flex', flexDirection: 'column',
      }}>
        {/* corner staples */}
        {[[6,6,1,1],[6,'B',1,1],['R',6,1,1],['R','B',1,1]].map((p,i) => (
          <div key={i} style={{ position: 'absolute', width: 6, height: 6, background: C,
            ...(p[0]==='R' ? {right:6} : {left:p[0]}),
            ...(p[1]==='B' ? {bottom:6} : {top:p[1]}),
          }}/>
        ))}

        {/* header */}
        <div style={{ background: t.peach, borderBottom: `3px solid ${C}`, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ fontSize: 20 }}>🗺</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: t.textSoft, lineHeight: 1 }}>FAST TRAVEL · {deptCode}</div>
            <div style={{ fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 15, color: C, lineHeight: 1.1, marginTop: 3 }}>빠른 이동</div>
          </div>
          <button onClick={onClose} style={{ background: '#fff', border: `2px solid ${C}`, padding: '4px 10px', fontFamily: '"DungGeunMo",monospace', fontSize: 12, color: C, boxShadow: `2px 2px 0 0 ${C}` }}>×</button>
        </div>

        {/* room cards */}
        <div style={{ flex: 1, padding: 12, overflow: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, alignContent: 'start' }}>
          {rooms.map(r => {
            const isHere = Math.abs(r.x - pos.x) <= 2 && Math.abs(r.y - pos.y) <= 2;
            const isLocked = r.locked;
            return (
              <button key={r.id} disabled={isLocked} onClick={() => !isLocked && onPick(r)} style={{
                background: isHere ? t.mint : (isLocked ? '#E5E7EB' : '#fff'),
                border: `3px solid ${C}`,
                boxShadow: isHere ? `3px 3px 0 0 ${t.mintShadow}` : (isLocked ? 'none' : `3px 3px 0 0 ${C}66`),
                padding: '10px 8px',
                display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4,
                textAlign: 'left', cursor: isLocked ? 'not-allowed' : 'pointer',
                opacity: isLocked ? 0.5 : 1,
                position: 'relative',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, width: '100%' }}>
                  <div style={{ width: 26, height: 26, background: r.color || t.cream, border: `2px solid ${C}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>
                    {r.icon || '•'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 11, color: C, lineHeight: 1.1 }}>{r.name}</div>
                    {r.sub && <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 9, color: t.textSoft, marginTop: 2 }}>{r.sub}</div>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {r.questCount > 0 && (
                    <div style={{ background: t.yellow, border: `1.5px solid ${C}`, padding: '0 4px', fontFamily: '"DungGeunMo",monospace', fontSize: 8, color: C }}>! {r.questCount}</div>
                  )}
                  {isHere && (
                    <div style={{ background: t.mintShadow, color: '#fff', border: `1.5px solid ${C}`, padding: '0 4px', fontFamily: '"DungGeunMo",monospace', fontSize: 8 }}>HERE</div>
                  )}
                  {isLocked && (
                    <div style={{ background: '#1F2937', color: '#fff', border: `1.5px solid ${C}`, padding: '0 4px', fontFamily: '"DungGeunMo",monospace', fontSize: 8 }}>🔒 LOCKED</div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* footer hint */}
        <div style={{ background: t.paper, borderTop: `3px dotted ${C}44`, padding: '8px 12px', fontFamily: '"Galmuri11",monospace', fontSize: 10, color: t.textSoft, lineHeight: 1.4, textAlign: 'center' }}>
          방을 누르면 즉시 이동해요. 🟡 노란 ! 표시는 진행 가능한 시나리오 개수예요.
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { FastTravelModal });
