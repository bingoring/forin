// buildings-v2.jsx — 2.5D landmark buildings for the campus.
//
// The campus is viewed from a slightly-elevated diagonal (NOT straight top-down),
// so structures must show BOTH a top face and a front face (and a hint of one
// side). These reworked landmarks add an explicit roof TOP plane + a shaded
// RIGHT side plane on top of the existing front facade, so they sit in the world
// like the chairs/desks do.
//
// Exposed on window for both the DS catalog (ScreenDSBuildings) and, once
// confirmed, the campus (screens-explore-v2). Pure presentational — each takes
// pixel width/height of the footprint front face.

(function () {
  const ink = '#2A2522';

  // Generic extruded block: FRONT face + a large RECTANGULAR TOP face. The view
  // is from high above at a slight angle, so the roof reads as a big rectangle
  // (not a trapezoid). Outline on top + left + right edges (open at the front
  // edge where it meets the facade).
  function Block3D({ left = 0, bottom = 0, fw, fh, d = 14, front, side, top, radius = 0, children, glow, topInset, topRim }) {
    const td = Math.round(d * 2.3);   // visible roof depth — generous (high POV)
    return (
      <div style={{ position: 'absolute', left, bottom, width: fw, height: fh }}>
        {/* TOP face — rectangle. With topInset: band between outer and inner
           rectangle is filled with topRim. */}
        <div style={{ position: 'absolute', left: 0, top: -td, width: fw + 4, height: td + 2,
          background: topInset ? (topRim || top) : top, boxSizing: 'border-box',
          borderLeft: `2px solid ${ink}`, borderRight: `2px solid ${ink}`,
          borderTop: `2px solid ${ink}`,
          borderTopLeftRadius: radius, borderTopRightRadius: radius }}>
          {topInset && <div style={{ position: 'absolute', left: 4, right: 4, top: 4, bottom: 4, background: top, border: `2px solid ${ink}`, boxSizing: 'border-box' }}/>}
        </div>
        {/* FRONT face */}
        <div style={{ position: 'absolute', left: 0, top: 0, width: fw, height: fh,
          background: front, border: `2px solid ${ink}`, overflow: 'hidden',
          borderTopLeftRadius: radius, borderTopRightRadius: radius,
          boxShadow: glow || 'none' }}>
          {children}
        </div>
      </div>
    );
  }

  // window grid (dusk-lit) for tower fronts
  function grid(cols, rows, litRatio, salt, on, off) {
    const cells = [];
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const isLit = ((c * 7 + r * 13 + salt * 31) % 10) < litRatio * 10;
      cells.push(<div key={r + '-' + c} style={{
        position: 'absolute', left: `${(c + 0.5) * (100 / cols)}%`, top: `${(r + 0.5) * (100 / rows)}%`,
        width: `${(100 / cols) * 0.62}%`, height: `${(100 / rows) * 0.5}%`,
        transform: 'translate(-50%,-50%)', background: isLit ? on : off,
        boxShadow: isLit ? `0 0 2px ${on}` : 'none' }}/>);
    }
    return cells;
  }

  // ─── MAIN MEDICAL TOWER (2.5D) — three towers on a podium, big flat roofs ─
  function MedCenter2D({ w = 10, h = 7, TILE = 16, label, sign, signColor = '#D14B3D' }) {
    const pw = w * TILE, ph = h * TILE;
    return (
      <div style={{ position: 'absolute', left: 0, top: 0, width: pw, height: ph }}>
        {/* right-side ground shadow (light upper-left) */}
        <div style={{ position: 'absolute', left: pw, bottom: 0, width: 16, height: ph - 4, background: 'rgba(40,32,28,.28)' }}/>

        {/* LEFT — dark glass tower */}
        <Block3D left={24} bottom={16} fw={40} fh={150} d={11}
          front={'linear-gradient(180deg,#3C4856,#28333D)'} top={'#4C5A68'}>
          {grid(4, 16, 0.45, 1, '#FFE3A0', '#1E2832')}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(90deg,#6E7E8C 0 1.5px,transparent 1.5px 10px)', opacity: .4 }}/>
        </Block3D>

        {/* RIGHT — white-stone tower */}
        <Block3D left={92} bottom={16} fw={40} fh={120} d={10}
          front={'linear-gradient(180deg,#E4DECE,#CDC6B2)'} top={'#EDE7D6'}>
          {grid(4, 12, 0.28, 5, '#FFEDB0', '#A9B7C0')}
        </Block3D>

        {/* CENTER — glowing amber atrium (the showpiece, tallest), square top */}
        <Block3D left={62} bottom={16} fw={32} fh={166} d={12}
          front={'linear-gradient(180deg,#F8D26A,#E89A2C)'} top={'#F2C257'}
          glow={'0 0 12px rgba(244,196,86,.7)'}>
          <div style={{ position: 'absolute', left: '14%', right: '14%', top: '8%', bottom: 0, background: 'linear-gradient(180deg,#FFF6CE,#FBD877)', opacity: .9 }}/>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(180deg,#B97720aa 0 1px,transparent 1px 8px)' }}/>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(90deg,#C98A2A 0 1px,transparent 1px 7px)', opacity: .5 }}/>
        </Block3D>
        {/* connecting glass bridge between center & left */}
        <div style={{ position: 'absolute', left: 56, bottom: 78, width: 8, height: 20, background: '#8FB8D2', border: `1.5px solid ${ink}` }}>
          <div style={{ position: 'absolute', left: 1, top: 1, right: 1, height: 2, background: '#D8EEF8', opacity: .7 }}/>
        </div>

        {/* PODIUM base with big flat roof + entrance portal */}
        <Block3D left={-4} bottom={0} fw={pw + 8} fh={28} d={11} front={'#CFC8B6'} top={'#E2DBC8'}>
          <div style={{ position: 'absolute', left: 6, right: 6, top: 7, height: 6, background: 'linear-gradient(90deg,#FFE6A6,#F4D27A)', opacity: .9 }}/>
          <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', bottom: 0, width: 36, height: 18, background: '#28333D', border: `2px solid ${ink}`, borderBottom: 'none' }}>
            <div style={{ position: 'absolute', left: 2, right: 2, top: 2, height: 3, background: '#FFE6A6', opacity: .85 }}/>
          </div>
          <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', bottom: 16, width: 48, height: 5, background: '#9FA8B0', border: `1.5px solid ${ink}` }}/>
        </Block3D>

        <Plaque sign={sign} signColor={signColor} label={label}/>
      </div>
    );
  }

  // ─── CLOCK TOWER (2.5D) — extruded gothic shaft + spire with a top face ───
  function ClockTower2D({ TILE = 16 }) {
    const wood = '#9C7A4A', woodLt = '#B89866', woodDk = '#6E5230', woodTop = '#C2A472',
      vine = '#5C8A3A', vineDk = '#3E6326', stone = '#C9CDD2', stoneDk = '#9AA0A8';
    return (
      <div style={{ position: 'absolute', left: 0, top: 0, width: TILE * 6, height: 300 }}>
        {/* right-side ground shadow (light upper-left) */}
        <div style={{ position: 'absolute', left: 84, bottom: 0, width: 14, height: 40, background: 'rgba(40,32,28,.26)' }}/>

        {/* ── BASE PLINTH (wide, short) with arched entrance ── */}
        <Block3D left={2} bottom={0} fw={92} fh={40} d={9} front={woodLt} top={woodTop}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(90deg,transparent 0 10px,#6E523088 10px 11px)', opacity: .5 }}/>
          {/* timber posts */}
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 6, background: woodDk }}/>
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 6, background: woodDk }}/>
          {/* arched entrance */}
          <div style={{ position: 'absolute', left: '50%', bottom: 0, transform: 'translateX(-50%)', width: 26, height: 26, background: '#3A2C1C', borderRadius: '13px 13px 0 0', border: `2px solid ${ink}` }}/>
          {/* greenery tufts on the ledge */}
          <div style={{ position: 'absolute', left: 9, bottom: 2, width: 8, height: 5, background: vine, borderRadius: '3px 3px 0 0' }}/>
          <div style={{ position: 'absolute', right: 9, bottom: 2, width: 8, height: 5, background: vine, borderRadius: '3px 3px 0 0' }}/>
        </Block3D>

        {/* ── SHAFT (timber frame + vertical green vines) ── */}
        <Block3D left={16} bottom={40} fw={64} fh={150} d={10} front={wood} top={woodTop}>
          {/* corner + central timber pillars */}
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 8, background: woodDk }}/>
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 8, background: woodDk }}/>
          <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 6, transform: 'translateX(-50%)', background: woodDk }}/>
          {/* vertical vine ribbons in the two bays */}
          {[0.27, 0.73].map((fx, i) => (
            <div key={i} style={{ position: 'absolute', left: `${fx*100}%`, top: 6, bottom: 6, width: 9, transform: 'translateX(-50%)',
              background: `repeating-linear-gradient(180deg, ${vine} 0 7px, ${vineDk} 7px 12px)`, borderRadius: 3, border: `1px solid ${vineDk}` }}/>
          ))}
          {/* small wooden window boxes */}
          {[40, 86].map((t,i) => (
            <React.Fragment key={i}>
              <div style={{ position: 'absolute', left: 14, top: t, width: 9, height: 7, background: woodLt, border: `1.5px solid ${woodDk}` }}/>
              <div style={{ position: 'absolute', right: 14, top: t, width: 9, height: 7, background: woodLt, border: `1.5px solid ${woodDk}` }}/>
            </React.Fragment>
          ))}
        </Block3D>

        {/* ── CLOCK HEAD (wider square block) ── */}
        <Block3D left={6} bottom={190} fw={84} fh={70} d={12} front={wood} top={woodTop} topInset topRim={woodDk}>
          {/* heavy timber frame */}
          <div style={{ position: 'absolute', inset: 0, border: `7px solid ${woodDk}`, boxSizing: 'border-box' }}/>
          {/* big clock face: stone bezel + white dial */}
          <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 50, height: 50, borderRadius: '50%', background: stoneDk, border: `3px solid ${ink}` }}>
            <div style={{ position: 'absolute', inset: 5, borderRadius: '50%', background: stone }}/>
            <div style={{ position: 'absolute', inset: 9, borderRadius: '50%', background: '#FBF8EE', border: `1px solid ${stoneDk}` }}/>
            {/* 12/3/6/9 ticks */}
            {[[0,-1],[1,0],[0,1],[-1,0]].map(([dx,dy],i)=>(
              <div key={i} style={{ position: 'absolute', left: `calc(50% + ${dx*17}px)`, top: `calc(50% + ${dy*17}px)`, width: 3, height: 3, background: ink, transform: 'translate(-50%,-50%)' }}/>
            ))}
            {/* hands */}
            <div style={{ position: 'absolute', left: '50%', top: '50%', width: 2.4, height: 15, background: '#7A4A2A', transform: 'translate(-50%,-100%) rotate(18deg)', transformOrigin: 'bottom' }}/>
            <div style={{ position: 'absolute', left: '50%', top: '50%', width: 2.4, height: 11, background: '#7A4A2A', transform: 'translate(-50%,-50%) rotate(96deg)', transformOrigin: 'left' }}/>
            <div style={{ position: 'absolute', left: '50%', top: '50%', width: 4, height: 4, borderRadius: '50%', background: ink, transform: 'translate(-50%,-50%)' }}/>
          </div>
        </Block3D>

        {/* clock head's flat roof (rectangle + inner rectangle) is drawn by the
           Block3D topInset above — nothing else sits above the clock head */}
      </div>
    );
  }

  function Plaque({ sign, signColor, label }) {
    return (
      <React.Fragment>
        {sign && <div style={{ position: 'absolute', left: '50%', bottom: 27, transform: 'translateX(-50%)', background: signColor, color: '#fff', fontFamily: '"DungGeunMo",monospace', fontSize: 9, lineHeight: 1, padding: '2px 6px', border: `1.5px solid ${ink}`, whiteSpace: 'nowrap', boxShadow: `2px 2px 0 0 ${ink}` }}>{sign}</div>}
        {label && <div style={{ position: 'absolute', left: '50%', bottom: 43, transform: 'translateX(-50%)', background: '#fff', color: ink, border: `1.5px solid ${ink}`, fontFamily: '"DungGeunMo",monospace', fontSize: 8, padding: '1px 4px', whiteSpace: 'nowrap', boxShadow: `1.5px 1.5px 0 0 ${ink}` }}>{label}</div>}
      </React.Fragment>
    );
  }

  // ─── HORIZONTAL LANDMARK (2.5D) — faithful original facade + trapezoid top ─
  function MedCenterH2D({ w = 8, h = 5, TILE = 16, label, sign, signColor = '#0E7490' }) {
    const pw = w * TILE, ph = h * TILE;
    const facadeH = 100, floors = 5, signH = 10, groundH = 16;
    const floorH = (facadeH - signH - groundH) / floors;
    const cols = Math.max(3, w);
    const d = 14;
    const rows = [];
    for (let i = 0; i < floors; i++) {
      const top = signH + i * floorH;
      rows.push(
        <React.Fragment key={i}>
          <div style={{ position: 'absolute', left: 3, right: 9, top, height: floorH * 0.5, background: 'linear-gradient(180deg,#A6BECC,#6E8C9E)' }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(90deg,#38484F 0 1px,transparent 1px 7px)', opacity: .5 }}/>
          </div>
          <div style={{ position: 'absolute', left: 0, right: 0, top: top + floorH * 0.5, height: floorH * 0.5, background: 'linear-gradient(180deg,#FFFFFF,#E6EAEE)', borderTop: '1px solid #C6CCD2' }}/>
        </React.Fragment>
      );
    }
    return (
      <div style={{ position: 'absolute', left: 0, top: 0, width: pw, height: ph }}>
        {/* 2.5D ground shadow — light from upper-left → shadow only on the RIGHT
           side of the building; nothing below the rectangle's bottom edge. */}
        <div style={{ position: 'absolute', left: pw, bottom: 0, width: d, height: facadeH, background: 'rgba(40,32,28,.30)' }}/>
        {/* TOP roof — large rectangle (high POV), outline on top + sides */}
        <div style={{ position: 'absolute', left: 0, top: ph - facadeH - Math.round(d * 2.3), width: pw, height: Math.round(d * 2.3) + 2, boxSizing: 'border-box', background: '#D2D7DB', borderLeft: `2px solid ${ink}`, borderRight: `2px solid ${ink}`, borderTop: `2px solid ${ink}` }}/>
        {/* FRONT facade — verbatim from the original MedCenterH */}
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: facadeH, border: `2px solid ${ink}`, background: '#E2E7EB', overflow: 'hidden' }}>
          {/* rooftop signage parapet */}
          <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: signH, background: 'linear-gradient(180deg,#FFFFFF,#EBEEF1)', borderBottom: '1px solid #C6CCD2', display: 'flex', alignItems: 'center', gap: 2, paddingLeft: 5 }}>
            <div style={{ width: 6, height: 6, background: '#E06A2C', borderRadius: '50%' }}/>
            <div style={{ width: '46%', height: 2, background: '#5A6E8C' }}/>
          </div>
          {rows}
          {/* ground floor — recessed dark glass lobby behind pilotis columns */}
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: groundH, background: '#33414C' }}>
            <div style={{ position: 'absolute', left: 3, right: 3, top: 2, bottom: 4, background: 'linear-gradient(180deg,#84A4B6,#506E80)', opacity: .85 }}/>
            {Array.from({ length: cols }).map((_, i) => (
              <div key={i} style={{ position: 'absolute', bottom: 0, left: `${(i + 0.5) * (100 / cols)}%`, transform: 'translateX(-50%)', width: 3, height: groundH, background: '#E8EBEE', border: `1px solid ${ink}` }}/>
            ))}
          </div>
        </div>
        <Plaque sign={sign} signColor={signColor} label={label}/>
      </div>
    );
  }

  // ─── 여성소아 센터 (2.5D) — faithful Johns-Hopkins facade + flat 2.5D roof ──
  function MedCenterV2D({ w = 7, h = 6, TILE = 16, label, sign, signColor = '#C2487E' }) {
    const pw = w * TILE, ph = h * TILE;
    const C = { brick: '#9E4A3C', brickDk: '#7E3A2E', stone: '#E0D4BB', stoneDk: '#BCA98A',
      slate: '#3B414C', slateLt: '#535B68', slateDk: '#2A2F38',
      copper: '#5E9486', copperDk: '#3C6A5E', copperLt: '#8FBCAE', glass: '#2E3A44', lit: '#ECC766', sash: '#E0D4BB' };
    const winRow = (bx, bw, by, count, salt, key) => {
      const out = []; const gap = bw / count;
      for (let i = 0; i < count; i++) {
        const wx = bx + i * gap + gap * 0.28, ww = gap * 0.44;
        const isLit = ((i * 5 + salt * 7) % 10) < 3;
        out.push(<g key={key + i}><rect x={wx} y={by} width={ww} height={6.5} fill={isLit ? C.lit : C.glass} stroke={C.sash} strokeWidth="0.6"/><path d={`M${wx - 0.3} ${by} Q${wx + ww / 2} ${by - 2.6} ${wx + ww + 0.3} ${by}`} fill={C.stone} stroke={ink} strokeWidth="0.4"/></g>);
      }
      return out;
    };
    return (
      <div style={{ position: 'absolute', left: 0, top: 0, width: pw, height: ph, filter: 'drop-shadow(4px 7px 0 rgba(0,0,0,.3))' }}>
        {/* right-side ground shadow */}
        <div style={{ position: 'absolute', left: pw, bottom: 0, width: 14, height: ph - 6, background: 'rgba(40,32,28,.24)' }}/>
        <svg viewBox="0 0 144 80" width={pw} height={ph} style={{ display: 'block', overflow: 'visible' }}>
          <defs>
            <pattern id={`brkV`} width="9" height="6" patternUnits="userSpaceOnUse">
              <rect width="9" height="6" fill={C.brick}/><rect width="9" height="0.7" y="5.3" fill={C.brickDk}/>
              <rect width="0.7" height="3" x="0" fill={C.brickDk}/><rect width="0.7" height="3" x="4.5" y="3" fill={C.brickDk}/>
            </pattern>
          </defs>
          {/* corner turrets — flat-topped caps (a readable top face, not spires) */}
          {[12, 132].map((cx, i) => (
            <g key={`t${i}`}>
              <rect x={cx - 7} y={30} width={14} height={50} fill="url(#brkV)" stroke={ink} strokeWidth="0.8"/>
              {/* flat slate roof cap with a small recessed inner rectangle */}
              <rect x={cx - 8} y={24} width={16} height={8} fill={C.slateLt} stroke={ink} strokeWidth="0.8"/>
              <rect x={cx - 5} y={26} width={10} height={4} fill={C.slate}/>
              <rect x={cx - 1.6} y={33} width={3.2} height={5} fill={C.lit} stroke={C.sash} strokeWidth="0.5"/>
            </g>
          ))}
          {/* wings — brick body + mansard + 2.5D flat roof slab on top */}
          {[[16, 52], [92, 128]].map(([x0, x1], i) => (
            <g key={`w${i}`}>
              {/* flat 2.5D roof slab receding behind the wing body */}
              <rect x={x0 + 3} y={20} width={x1 - x0 - 6} height={20} fill={C.slateLt} stroke={ink} strokeWidth="0.8"/>
              <rect x={x0 + 6} y={23} width={x1 - x0 - 12} height={14} fill={C.slate}/>
              <rect x={x0} y={40} width={x1 - x0} height={40} fill="url(#brkV)" stroke={ink} strokeWidth="0.8"/>
              <rect x={x0} y={47} width={x1 - x0} height={1.4} fill={C.stone}/>
              {winRow(x0 + 2, x1 - x0 - 4, 51, 4, i + 1, `wA${i}`)}
              <rect x={x0} y={62} width={x1 - x0} height={1.4} fill={C.stone}/>
              {winRow(x0 + 2, x1 - x0 - 4, 66, 4, i + 3, `wB${i}`)}
            </g>
          ))}
          {/* central pavilion with a flat 2.5D roof slab + low cupola on top */}
          {/* flat roof slab (the readable top face) */}
          <rect x={53} y={18} width={38} height={14} fill={C.slateLt} stroke={ink} strokeWidth="0.9"/>
          <rect x={57} y={21} width={30} height={8} fill={C.slate}/>
          <rect x={52} y={30} width={40} height={50} fill="url(#brkV)" stroke={ink} strokeWidth="0.9"/>
          <rect x={52} y={30} width={40} height={2} fill={C.stone}/>
          <rect x={52} y={44} width={40} height={1.4} fill={C.stone}/>
          {winRow(55, 34, 34, 4, 9, 'cT')}
          {winRow(55, 34, 48, 4, 2, 'cM')}
          <path d="M64 80 L64 70 Q72 60 80 70 L80 80 Z" fill={C.glass} stroke={C.stone} strokeWidth="1.4"/>
          <rect x={71.4} y={70} width={1.2} height={10} fill={C.stoneDk}/>
          <rect x={62} y={79} width={20} height={1.6} fill={C.stoneDk}/>
          {/* LOW cupola sitting on the flat roof (short, not a spire) */}
          <rect x={63} y={12} width={18} height={6} fill={C.stone} stroke={ink} strokeWidth="0.7"/>
          {[65.5, 70, 74.5, 79].map((wx,i)=><rect key={`cw${i}`} x={wx} y={13.5} width={2} height={3.5} fill={C.glass}/>)}
          <path d="M62 12 C62 5 67 2 72 2 C77 2 82 5 82 12 Z" fill={C.copper} stroke={ink} strokeWidth="0.8"/>
          <path d="M66 10 C66 5 68 3 71 3" fill="none" stroke={C.copperLt} strokeWidth="1.2" strokeLinecap="round"/>
          <rect x={71.2} y={-2} width={1.6} height={4} fill="#E6B84E" stroke={ink} strokeWidth="0.4"/>
          <circle cx={72} cy={-3} r={1.4} fill="#F0CC66" stroke={ink} strokeWidth="0.4"/>
        </svg>
        <Plaque sign={sign} signColor={signColor} label={label}/>
      </div>
    );
  }

  // ─── 암센터 (2.5D · original) — a calm "healing" eco-tower: warm cream
  //     facade with living-green vertical garden ribbons, big sun-lit windows,
  //     a wood-warm base, and a planted ROOF GARDEN on the flat 2.5D roof. ────
  function MedCenterC2D({ w = 8, h = 7, TILE = 16, label, sign, signColor = '#2E9E6E' }) {
    const pw = w * TILE, ph = h * TILE;
    const cream = '#F3ECDD', creamDk = '#E0D6C0', warm = '#EAD9B8',
      glass = 'linear-gradient(180deg,#BFE3EE,#7FB9CC)', glassLt = '#DCF1F6',
      green = '#5C9A52', greenDk = '#3E7338', greenLt = '#82BE6E',
      wood = '#B98A52', woodDk = '#8E6638', roof = '#EDE6D6';
    const podH = 26, towerBottom = podH, towerH = ph - podH - 4;
    return (
      <div style={{ position: 'absolute', left: 0, top: 0, width: pw, height: ph, filter: 'drop-shadow(4px 7px 0 rgba(0,0,0,.3))' }}>
        {/* right-side ground shadow */}
        <div style={{ position: 'absolute', left: pw, bottom: 0, width: 14, height: ph - 6, background: 'rgba(40,32,28,.22)' }}/>

        {/* ── TOWER with a planted roof garden on its flat 2.5D roof ── */}
        <Block3D left={6} bottom={towerBottom} fw={pw - 12} fh={towerH} d={13} front={cream} top={roof} topInset topRim={creamDk}>
          {/* warm vertical pilasters framing the bays */}
          {[0.0, 0.5, 1.0].map((f,i) => (
            <div key={'pl'+i} style={{ position: 'absolute', left: `calc(${f*100}% - 3px)`, top: 0, bottom: 0, width: 6, background: `linear-gradient(90deg,${warm},${creamDk})` }}/>
          ))}
          {/* two big sun-lit glass window bays */}
          {[0.12, 0.62].map((f,i) => (
            <div key={'gl'+i} style={{ position: 'absolute', left: `${f*100}%`, top: 8, bottom: 8, width: '26%', background: glass, border: `1.5px solid ${ink}`, overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, backgroundImage: `repeating-linear-gradient(180deg, transparent 0 6px, ${ink}22 6px 7px),repeating-linear-gradient(90deg, transparent 0 7px, ${ink}22 7px 8px)` }}/>
              <div style={{ position: 'absolute', left: 1, top: 1, width: '40%', height: 4, background: glassLt, opacity: .8 }}/>
            </div>
          ))}
          {/* LIVING GREEN GARDEN ribbon down the center (the signature) */}
          <div style={{ position: 'absolute', left: '44%', top: 2, bottom: 2, width: '12%', background: `linear-gradient(180deg,${greenLt},${green} 60%,${greenDk})`, border: `1.5px solid ${ink}`, overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(${greenLt} 1.4px, transparent 1.6px),radial-gradient(${greenDk} 1.2px, transparent 1.4px)`, backgroundSize: '7px 7px, 5px 5px', backgroundPosition: '0 0, 3px 3px' }}/>
            {/* trailing vines spilling over the floor ledges */}
            {[0.28,0.55,0.82].map((t,i)=><div key={i} style={{ position:'absolute', left:0, right:0, top:`${t*100}%`, height:5, background:greenDk, borderRadius:'0 0 4px 4px', opacity:.85 }}/>)}
          </div>
          {/* warm sign band near the top */}
          <div style={{ position: 'absolute', left: '30%', top: 4, width: '40%', height: 5, background: '#fff', border: `1px solid ${ink}`, display:'flex', alignItems:'center', justifyContent:'center', gap:2 }}>
            <div style={{ width:4, height:4, borderRadius:'50%', background:signColor }}/>
            <div style={{ width:'56%', height:2, background:signColor }}/>
          </div>
        </Block3D>

        {/* ROOF GARDEN: planters + a slim tree on the flat roof */}
        {[0.26,0.5,0.74].map((f,i)=>(
          <div key={'rp'+i} style={{ position:'absolute', left:`calc(6px + ${f}*(${pw-12}px) - 5px)`, bottom: towerBottom + towerH + 6, width:10, height:6, background:green, border:`1.5px solid ${ink}`, borderRadius:'3px 3px 0 0' }}/>
        ))}
        <div style={{ position:'absolute', left:'50%', bottom: towerBottom + towerH + 10, width:4, height:12, background:woodDk, transform:'translateX(-50%)' }}/>
        <div style={{ position:'absolute', left:'50%', bottom: towerBottom + towerH + 18, width:16, height:12, background:green, border:`1.5px solid ${ink}`, borderRadius:'50%', transform:'translateX(-50%)' }}/>

        {/* ── WOOD-WARM BASE / PODIUM with a welcoming glazed entrance ── */}
        <div style={{ position: 'absolute', left: -2, right: -2, bottom: 0, height: podH, background: `linear-gradient(180deg,${wood},${woodDk})`, border: `2px solid ${ink}`, boxSizing: 'border-box', overflow: 'hidden' }}>
          {/* warm timber battens */}
          <div style={{ position:'absolute', inset:0, backgroundImage:`repeating-linear-gradient(90deg, transparent 0 6px, ${woodDk}99 6px 7px)` }}/>
          {/* glazed entrance lobby */}
          <div style={{ position:'absolute', left:'50%', bottom:0, transform:'translateX(-50%)', width:'46%', height:18, background:glass, border:`2px solid ${ink}`, borderBottom:'none', overflow:'hidden' }}>
            <div style={{ position:'absolute', inset:0, backgroundImage:`repeating-linear-gradient(90deg, transparent 0 6px, ${ink}22 6px 7px)` }}/>
            <div style={{ position:'absolute', left:'42%', bottom:0, width:'16%', height:10, background:'#2E5C52' }}/>
          </div>
          {/* low planter hedges flanking the entrance */}
          <div style={{ position:'absolute', left:6, bottom:2, width:18, height:7, background:green, borderRadius:'4px 4px 0 0', border:`1px solid ${ink}` }}/>
          <div style={{ position:'absolute', right:6, bottom:2, width:18, height:7, background:green, borderRadius:'4px 4px 0 0', border:`1px solid ${ink}` }}/>
        </div>

        <Plaque sign={sign} signColor={signColor} label={label}/>
      </div>
    );
  }

  Object.assign(window, { Block3D: Block3D, MedCenter2D, ClockTower2D, MedCenterH2D, MedCenterV2D, MedCenterC2D });
})();
