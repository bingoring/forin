// forin-ui.jsx — shared tokens + pixel UI primitives + character/sprite SVGs
// Loaded as Babel script. Exports to window so other screen files can use.

const ForinTokens = {
  mint: '#A7F3D0',
  mintDeep: '#6EE7B7',
  mintShadow: '#4FC79D',
  peach: '#FFEDD5',
  peachDeep: '#FED7AA',
  peachShadow: '#E8B584',
  yellow: '#FEF08A',
  yellowDeep: '#FACC15',
  yellowShadow: '#CA8A04',
  text: '#374151',
  textSoft: '#6B7280',
  textFaint: '#9CA3AF',
  cream: '#FFFBF0',
  paper: '#FFF8E7',
  ink: '#2A2522',
  pink: '#FBCFE8',
  blue: '#BAE6FD',
  red: '#FCA5A5',
  lilac: '#DDD6FE',
};

// ─── Pixel box: 3px solid border + stepped 4-layer drop shadow for a chunky tile look
function PixelBox({ children, bg = ForinTokens.cream, border = ForinTokens.ink, shadow = ForinTokens.ink, p = 12, style = {}, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: bg, border: `3px solid ${border}`, color: ForinTokens.text,
      padding: p, position: 'relative',
      boxShadow: `4px 4px 0 0 ${shadow}`,
      imageRendering: 'pixelated',
      ...style,
    }}>{children}</div>
  );
}

// ─── Pixel button (chunky tile-like, can be pressed)
//
// Differs from PixelBox visually so it reads unmistakably as "clickable":
//   - chipped (notched) corners on the top-left + bottom-right
//   - inner highlight strip along the top edge (catches light)
//   - inner darker strip along the bottom (cast-shadow under the cap)
//   - a tiny pixel "rivet" dot in two opposite corners (rivet/screw look)
//   - chunky 4-px solid drop shadow that the button slides into on press
//
// variant:
//   'hud'   (default) — single solid drop shadow, HUD빠른이동/A button style.
//   'block' — stacked 1-px shadows fuse into a 4-px-thick side wall, giving
//             a real 3-D extruded block look. The cap collapses on press.
function PixelButton({
  children, bg = ForinTokens.mint, color = ForinTokens.ink,
  shadow = ForinTokens.mintShadow, size = 'md', full,
  style = {}, onClick, disabled, variant = 'hud',
}) {
  const pad = size === 'lg' ? '14px 26px' : size === 'sm' ? '7px 14px' : '11px 20px';
  const fs  = size === 'lg' ? 16          : size === 'sm' ? 11          : 13;
  const cls = React.useMemo(() => 'pxbtn-' + Math.random().toString(36).slice(2, 8), []);

  // For 'block' we layer four 1-pixel-offset shadows of the SAME color so
  // they fuse into one solid 4-px side wall.
  const restShadow = variant === 'block'
    ? `1px 1px 0 0 ${shadow}, 2px 2px 0 0 ${shadow}, 3px 3px 0 0 ${shadow}, 4px 4px 0 0 ${shadow}`
    : `4px 4px 0 0 ${shadow}`;
  const hoverShadow = variant === 'block'
    ? `1px 1px 0 0 ${shadow}, 2px 2px 0 0 ${shadow}, 3px 3px 0 0 ${shadow}, 4px 4px 0 0 ${shadow}, 5px 5px 0 0 ${shadow}, 6px 6px 0 0 ${shadow}`
    : `6px 6px 0 0 ${shadow}`;

  // Compute lighter/darker tones for the inner bevel strips so the
  // top edge looks lit and the bottom edge looks shaded.
  const lite = mixHex(bg, '#FFFFFF', 0.45);
  const dark = mixHex(bg, ForinTokens.ink, 0.30);
  const ink  = ForinTokens.ink;

  return (
    <React.Fragment>
      <style>{`
        .${cls} {
          position: relative;
          background: ${bg};
          color: ${color};
          border: 3px solid ${ink};
          padding: ${pad};
          font-family: "DungGeunMo","Galmuri11",monospace;
          font-size: ${fs}px;
          letter-spacing: 0.4px;
          cursor: ${disabled ? 'not-allowed' : 'pointer'};
          box-shadow: none;
          display: ${full ? 'block' : 'inline-flex'};
          align-items: center;
          justify-content: center;
          gap: 6px;
          width: ${full ? '100%' : 'auto'};
          text-align: center;
          transition: background 80ms ease-out;
          opacity: ${disabled ? 0.55 : 1};
        }
        /* DEFAULT (raised) — light comes from above:
           - top edge has a bright highlight strip (cap is lit on top)
           - bottom edge has a dark strip (cap casts a shadow on the bottom face) */
        .${cls}::before {
          content: '';
          position: absolute;
          left: 4px; right: 4px; top: 3px;
          height: 3px;
          background: ${lite};
          pointer-events: none;
          transition: background 80ms ease-out;
        }
        .${cls}::after {
          content: '';
          position: absolute;
          left: 4px; right: 4px; bottom: 3px;
          height: 3px;
          background: ${dark};
          pointer-events: none;
          transition: background 80ms ease-out;
        }
        .${cls} > * { position: relative; z-index: 1; }

        /* PRESSED (recessed into the page) — same light source from above,
           but now the cap is gone and we see INTO a hole. The upper rim of
           the hole blocks light → top edge is in shadow. The lower wall of
           the hole catches the angled light from above → bottom edge is lit.
           So we SWAP the highlight and shadow strips. */
        .${cls}:active:not(:disabled)::before {
          background: ${dark};
        }
        .${cls}:active:not(:disabled)::after {
          background: ${lite};
        }
      `}</style>
      <button onClick={onClick} disabled={disabled} className={cls} style={style}>
        <span style={{ position: 'relative', zIndex: 2 }}>{children}</span>
      </button>
    </React.Fragment>
  );
}

// ─── color util shared by PixelButton ─────────────────────────────
function mixHex(a, b, t) {
  const parse = h => [
    parseInt(h.slice(1, 3), 16),
    parseInt(h.slice(3, 5), 16),
    parseInt(h.slice(5, 7), 16),
  ];
  const [ar, ag, ab] = parse(a);
  const [br, bg, bb] = parse(b);
  const mix = (x, y) => Math.round(x + (y - x) * t);
  return '#' + [mix(ar, br), mix(ag, bg), mix(ab, bb)]
    .map(v => v.toString(16).padStart(2, '0')).join('');
}

// ─── Pixel icon button — square chunky button for a single glyph (A / 🗺 /
// arrows). Same lit-from-above bevel + press-to-recess mechanic as
// PixelButton, but square and centered. Optional small caption under the
// glyph (e.g. the HUD 빠른이동 button).
function PixelIconButton({
  children, caption, bg = ForinTokens.mint, color = ForinTokens.ink,
  size = 52, fontSize, style = {}, onClick, disabled, title,
}) {
  const ink = ForinTokens.ink;
  const cls = React.useMemo(() => 'pxic-' + Math.random().toString(36).slice(2, 8), []);
  const lite = mixHex(bg, '#FFFFFF', 0.45);
  const dark = mixHex(bg, ink, 0.30);
  const fs = fontSize || Math.round(size * 0.36);
  return (
    <React.Fragment>
      <style>{`
        .${cls} {
          position: relative; background: ${bg}; color: ${color};
          border: 3px solid ${ink};
          width: ${size}px; height: ${size}px; padding: 0;
          display: inline-flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 1px;
          font-family: "DungGeunMo","Galmuri11",monospace; font-size: ${fs}px;
          cursor: ${disabled ? 'not-allowed' : 'pointer'};
          transition: background 80ms ease-out;
          opacity: ${disabled ? 0.55 : 1};
        }
        .${cls}::before { content:''; position:absolute; left:4px; right:4px; top:3px; height:3px; background:${lite}; pointer-events:none; transition:background 80ms ease-out; }
        .${cls}::after  { content:''; position:absolute; left:4px; right:4px; bottom:3px; height:3px; background:${dark}; pointer-events:none; transition:background 80ms ease-out; }
        .${cls} > * { position: relative; z-index: 1; }
        .${cls}:active:not(:disabled)::before { background:${dark}; }
        .${cls}:active:not(:disabled)::after  { background:${lite}; }
      `}</style>
      <button onClick={onClick} disabled={disabled} title={title} className={cls} style={style}>
        <span style={{ position: 'relative', zIndex: 2, lineHeight: 1 }}>{children}</span>
        {caption && <span style={{ position: 'relative', zIndex: 2, fontSize: Math.max(8, Math.round(size * 0.17)), lineHeight: 1 }}>{caption}</span>}
      </button>
    </React.Fragment>
  );
}

// ─── Pixel D-pad — 4 directional arrow buttons in a plus layout + center
// hub. onMove('up'|'down'|'left'|'right') fires on press. Each arrow reuses
// PixelIconButton so it shares the press-to-recess feel.
function PixelDPad({ onMove, size = 72, bg = '#FED7AA', color = ForinTokens.ink }) {
  const ink = ForinTokens.ink;
  const gap = 2;
  const cell = Math.round((size - gap * 2) / 3);
  const mid = cell + gap;
  const dirs = {
    up:    { left: mid,       top: 0,         ch: '▲' },
    down:  { left: mid,       top: mid * 2,   ch: '▼' },
    left:  { left: 0,         top: mid,       ch: '◀' },
    right: { left: mid * 2,   top: mid,       ch: '▶' },
  };
  return (
    <div style={{ position: 'relative', width: mid * 2 + cell, height: mid * 2 + cell }}>
      {/* center pivot dot — tiny, just hints the join; no big white fill */}
      <div style={{
        position: 'absolute', left: mid + cell / 2 - 2, top: mid + cell / 2 - 2,
        width: 4, height: 4, background: ink, opacity: 0.45,
      }}/>
      {Object.entries(dirs).map(([d, m]) => (
        <PixelIconButton
          key={d} bg={bg} color={color} size={cell}
          fontSize={Math.round(cell * 0.44)}
          style={{ position: 'absolute', left: m.left, top: m.top }}
          onClick={() => onMove && onMove(d)}
        >{m.ch}</PixelIconButton>
      ))}
    </div>
  );
}

// ─── Pixel tag/chip
function PixelChip({ children, bg = ForinTokens.yellow, color = ForinTokens.ink, style = {} }) {
  return (
    <span style={{
      background: bg, color, border: `2px solid ${ForinTokens.ink}`,
      padding: '2px 8px', fontFamily: '"DungGeunMo","Galmuri11",monospace',
      fontSize: 10, letterSpacing: 0.3, display: 'inline-block',
      ...style,
    }}>{children}</span>
  );
}

// ─── Subtle pixel-grid background (CSS-only, dotted)
function pixelGridBg(c = 'rgba(55,65,81,0.06)', size = 6) {
  return {
    backgroundImage: `radial-gradient(${c} 1px, transparent 1px)`,
    backgroundSize: `${size}px ${size}px`,
  };
}

// ─── Stat bar (HP/MP style)
function StatBar({ label, value, max = 100, color = ForinTokens.mint, w = 120 }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: '"Galmuri11","DungGeunMo",monospace', fontSize: 10, color: ForinTokens.ink }}>
      {label && <span style={{ minWidth: 28 }}>{label}</span>}
      <div style={{ width: w, height: 10, background: '#fff', border: `2px solid ${ForinTokens.ink}`, position: 'relative' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, transition: 'width .3s' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(90deg, rgba(0,0,0,.08) 1px, transparent 1px)`, backgroundSize: '5px 100%' }} />
      </div>
      <span style={{ minWidth: 36, textAlign: 'right' }}>{value}/{max}</span>
    </div>
  );
}

// ─── Pixel heart (used for reputation/health)
const PixelHeart = ({ size = 12, filled = true, color = '#EF4444' }) => (
  <svg width={size} height={size} viewBox="0 0 12 12" shapeRendering="crispEdges" style={{ verticalAlign: 'middle' }}>
    <path d={'M2 1h2v1h1v1h2V2h1V1h2v1h1v4h-1v1h-1v1h-1v1h-1v1h-2V9h-1V8h-1V7h-1V6H1V2h1V1z'} fill={filled ? color : 'none'} stroke={ForinTokens.ink} strokeWidth="0.5"/>
  </svg>
);

// ─── Coin/star pixel icons
const PixelStar = ({ size = 14, color = ForinTokens.yellowDeep }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" shapeRendering="crispEdges">
    <path d="M6 1h2v2h2v2h2v2h-3v2h1v3H8V9H6v3H4V9h1V7H2V5h2V3h2V1z" fill={color} stroke={ForinTokens.ink} strokeWidth="0.6"/>
  </svg>
);

// ─── Tiny pixel sprite: hospital staff (16x20-ish, scaleable)
function PixelNurse({ size = 48, hair = '#7C3F00', skin = '#FDE1C8', outfit = ForinTokens.mint, accent = '#fff' }) {
  const px = size / 16; // we draw in 16-wide grid
  const C = ForinTokens.ink;
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 16 20" shapeRendering="crispEdges">
      {/* hat */}
      <rect x="4" y="1" width="8" height="2" fill={accent} stroke={C} strokeWidth=".3"/>
      <rect x="7" y="2" width="2" height="1" fill="#EF4444"/>
      {/* hair */}
      <rect x="3" y="3" width="10" height="2" fill={hair}/>
      {/* face */}
      <rect x="4" y="5" width="8" height="4" fill={skin} stroke={C} strokeWidth=".3"/>
      <rect x="6" y="6" width="1" height="1" fill={C}/>
      <rect x="9" y="6" width="1" height="1" fill={C}/>
      <rect x="7" y="8" width="2" height="1" fill="#F87171"/>
      {/* neck */}
      <rect x="7" y="9" width="2" height="1" fill={skin}/>
      {/* body */}
      <rect x="3" y="10" width="10" height="6" fill={outfit} stroke={C} strokeWidth=".3"/>
      <rect x="7" y="11" width="2" height="2" fill="#EF4444"/>{/* cross */}
      <rect x="6" y="12" width="4" height="0.6" fill="#EF4444"/>
      {/* arms */}
      <rect x="2" y="10" width="1" height="5" fill={outfit} stroke={C} strokeWidth=".3"/>
      <rect x="13" y="10" width="1" height="5" fill={outfit} stroke={C} strokeWidth=".3"/>
      {/* legs */}
      <rect x="4" y="16" width="3" height="3" fill="#4B5563"/>
      <rect x="9" y="16" width="3" height="3" fill="#4B5563"/>
      <rect x="3" y="19" width="4" height="1" fill={C}/>
      <rect x="9" y="19" width="4" height="1" fill={C}/>
    </svg>
  );
}

// ─── Pixel patient sprite (lying or standing)
function PixelPatient({ size = 48, mood = 'neutral' }) {
  const C = ForinTokens.ink;
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 16 20" shapeRendering="crispEdges">
      {/* hair */}
      <rect x="4" y="1" width="8" height="2" fill="#6B4423"/>
      {/* face */}
      <rect x="4" y="3" width="8" height="5" fill="#FDE1C8" stroke={C} strokeWidth=".3"/>
      <rect x="6" y="5" width="1" height="1" fill={C}/>
      <rect x="9" y="5" width="1" height="1" fill={C}/>
      <rect x="7" y="7" width="2" height="0.6" fill={mood === 'sad' ? '#7C2D12' : '#F87171'}/>
      {/* body — patient gown peach */}
      <rect x="3" y="9" width="10" height="7" fill={ForinTokens.peachDeep} stroke={C} strokeWidth=".3"/>
      <rect x="2" y="9" width="1" height="5" fill={ForinTokens.peachDeep} stroke={C} strokeWidth=".3"/>
      <rect x="13" y="9" width="1" height="5" fill={ForinTokens.peachDeep} stroke={C} strokeWidth=".3"/>
      <rect x="4" y="16" width="3" height="3" fill="#FDE1C8"/>
      <rect x="9" y="16" width="3" height="3" fill="#FDE1C8"/>
    </svg>
  );
}

// ─── Pixel flag (4x3 cells)
function PixelFlag({ stripes = ['#fff','#EF4444','#fff','#EF4444'], size = 32 }) {
  const C = ForinTokens.ink;
  return (
    <svg width={size} height={size * 0.7} viewBox="0 0 20 14" shapeRendering="crispEdges" style={{ display: 'block' }}>
      <rect x="1" y="1" width="18" height="12" fill="#fff" stroke={C} strokeWidth=".6"/>
      {stripes.map((c, i) => (
        <rect key={i} x="1" y={1 + i * (12 / stripes.length)} width="18" height={12 / stripes.length} fill={c}/>
      ))}
      <rect x="1" y="1" width="18" height="12" fill="none" stroke={C} strokeWidth=".6"/>
    </svg>
  );
}

// ─── Flag of US (simplified pixel)
function FlagUS({ size = 40 }) {
  const C = ForinTokens.ink;
  return (
    <svg width={size} height={size * 0.65} viewBox="0 0 20 13" shapeRendering="crispEdges" style={{ display: 'block' }}>
      <rect x="1" y="1" width="18" height="11" fill="#fff" stroke={C} strokeWidth=".6"/>
      {[1,3,5,7,9].map(y => <rect key={y} x="1" y={y} width="18" height="1" fill="#EF4444"/>)}
      <rect x="1" y="1" width="8" height="5" fill="#1E3A8A"/>
      {[[2,2],[4,2],[6,2],[3,3],[5,3],[7,3],[2,4],[4,4],[6,4]].map(([x,y],i) => <rect key={i} x={x} y={y} width="1" height="1" fill="#fff"/>)}
    </svg>
  );
}
function FlagKR({ size = 40 }) {
  const C = ForinTokens.ink;
  return (
    <svg width={size} height={size * 0.65} viewBox="0 0 20 13" shapeRendering="crispEdges" style={{ display: 'block' }}>
      <rect x="1" y="1" width="18" height="11" fill="#fff" stroke={C} strokeWidth=".6"/>
      <circle cx="10" cy="6.5" r="3" fill="#EF4444"/>
      <path d="M10 3.5a3 3 0 010 6 1.5 1.5 0 010-3 1.5 1.5 0 000-3z" fill="#1E40AF"/>
      <rect x="3" y="3" width="3" height="0.6" fill={C}/>
      <rect x="3" y="4" width="3" height="0.6" fill={C}/>
      <rect x="3" y="5" width="3" height="0.6" fill={C}/>
      <rect x="14" y="8" width="3" height="0.6" fill={C}/>
      <rect x="14" y="9" width="3" height="0.6" fill={C}/>
      <rect x="14" y="10" width="3" height="0.6" fill={C}/>
    </svg>
  );
}
function FlagJP({ size = 40 }) {
  return (
    <svg width={size} height={size * 0.65} viewBox="0 0 20 13" shapeRendering="crispEdges" style={{ display: 'block' }}>
      <rect x="1" y="1" width="18" height="11" fill="#fff" stroke={ForinTokens.ink} strokeWidth=".6"/>
      <circle cx="10" cy="6.5" r="3" fill="#DC2626"/>
    </svg>
  );
}
function FlagDE({ size = 40 }) {
  return (
    <svg width={size} height={size * 0.65} viewBox="0 0 20 13" shapeRendering="crispEdges" style={{ display: 'block' }}>
      <rect x="1" y="1" width="18" height="3.67" fill="#000"/>
      <rect x="1" y="4.67" width="18" height="3.67" fill="#DC2626"/>
      <rect x="1" y="8.34" width="18" height="3.67" fill="#FACC15"/>
      <rect x="1" y="1" width="18" height="11" fill="none" stroke={ForinTokens.ink} strokeWidth=".6"/>
    </svg>
  );
}

// ─── Top app bar (in-screen)
function ForinTopBar({ title, left, right, bg = ForinTokens.cream }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '52px 16px 12px', background: bg,
      borderBottom: `3px solid ${ForinTokens.ink}`,
      position: 'sticky', top: 0, zIndex: 5,
    }}>
      <div style={{ width: 32 }}>{left}</div>
      <div style={{ fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 15, color: ForinTokens.ink, letterSpacing: 0.5 }}>{title}</div>
      <div style={{ width: 32, textAlign: 'right' }}>{right}</div>
    </div>
  );
}

// ─── Bottom nav (pixel tabs)
function ForinBottomNav({ active = 'campus' }) {
  const tabs = [
    { id: 'campus', label: '캠퍼스', icon: '🏥' },
    { id: 'board',  label: '상황판', icon: '📋' },
    { id: 'lab',    label: '리뷰랩', icon: '📓' },
    { id: 'me',     label: '나',     icon: '👤' },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      paddingBottom: 28, background: ForinTokens.paper,
      borderTop: `3px solid ${ForinTokens.ink}`,
      display: 'flex', justifyContent: 'space-around', zIndex: 5,
    }}>
      {tabs.map(t => (
        <div key={t.id} style={{
          flex: 1, padding: '10px 0 6px', textAlign: 'center',
          background: active === t.id ? ForinTokens.mint : 'transparent',
          borderRight: `2px dotted ${ForinTokens.ink}33`,
          fontFamily: '"DungGeunMo","Galmuri11",monospace',
          color: ForinTokens.ink, fontSize: 11,
        }}>
          <div style={{ fontSize: 18, lineHeight: 1, marginBottom: 2 }}>{t.icon}</div>
          {t.label}
        </div>
      ))}
    </div>
  );
}

Object.assign(window, {
  ForinTokens, PixelBox, PixelButton, PixelIconButton, PixelDPad, PixelChip, pixelGridBg, StatBar,
  PixelHeart, PixelStar, PixelNurse, PixelPatient,
  PixelFlag, FlagUS, FlagKR, FlagJP, FlagDE,
  ForinTopBar, ForinBottomNav,
});
