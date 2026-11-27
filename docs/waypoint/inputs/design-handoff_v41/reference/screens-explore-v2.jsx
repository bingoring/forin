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
  function Building({ x, y, w, h, roof, label, sign, accent, signColor, redCross, emblem, special, mainEntrance, arch = 'pitched', helipad, onSelect }) {
    const rmid = roof.mid, rdk = roof.dk, rlt = roof.lt;
    const px = x * TILE, py = y * TILE, pw = w * TILE, ph = h * TILE;
    const isFlat = arch === 'flat' || arch === 'tower' || arch === 'glass';
    const isTower = arch === 'tower';
    const isGlass = arch === 'glass';
    const wallH = isTower ? TILE * 2.5 : isGlass ? TILE * 2.1 : TILE * 1.5; // front wall face

    return (
      <div onClick={onSelect} style={{
        position: 'absolute', left: px, top: py, width: pw, height: ph,
        imageRendering: 'pixelated', cursor: 'pointer',
        filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.3))',
      }}>
        {/* ROOF body (top face viewed from above) */}
        {!isFlat && (
          <>
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
          </>
        )}
        {/* FLAT CONCRETE ROOF — parapet edge + rooftop mechanical units (modern hospital block) */}
        {isFlat && (
          <div style={{
            position: 'absolute', left: 0, right: 0, top: 0, bottom: wallH,
            background: rmid,
            backgroundImage: `
              repeating-linear-gradient(90deg, ${rdk}44 0 1px, transparent 1px ${TILE * 0.9}px),
              repeating-linear-gradient(180deg, ${rdk}44 0 1px, transparent 1px ${TILE * 0.9}px)
            `,
            border: `2px solid ${P.ink}`,
          }}>
            {/* raised parapet inner edge */}
            <div style={{ position: 'absolute', inset: 2, border: `2px solid ${rlt}`, opacity: 0.7 }}/>
            {helipad ? (
              <div style={{
                position: 'absolute', left: '50%', top: '52%', transform: 'translate(-50%,-50%)',
                width: Math.min(pw, ph - wallH) * 0.62, height: Math.min(pw, ph - wallH) * 0.62, borderRadius: '50%',
                background: '#3A4452', border: `2px solid #E8DCB4`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#E8DCB4', fontWeight: 'bold', fontFamily: 'monospace', fontSize: 13,
              }}>H</div>
            ) : (
              <>
                {/* HVAC unit (large) */}
                <div style={{ position: 'absolute', left: 7, bottom: 9, width: 15, height: 11, background: '#B8B0A0', border: `1.5px solid ${P.ink}` }}>
                  <div style={{ position: 'absolute', left: 1, top: 1, right: 1, height: 2, background: '#D8D0C0' }}/>
                  <div style={{ position: 'absolute', inset: 3, backgroundImage: `repeating-linear-gradient(90deg, ${P.ink}44 0 1px, transparent 1px 3px)` }}/>
                </div>
                {/* HVAC unit (small) */}
                <div style={{ position: 'absolute', right: 9, top: 11, width: 10, height: 9, background: '#A8A090', border: `1.5px solid ${P.ink}` }}>
                  <div style={{ position: 'absolute', left: 1, top: 1, right: 1, height: 1.5, background: '#C8C0B0' }}/>
                </div>
                {/* vent pipe */}
                <div style={{ position: 'absolute', right: 24, top: 9, width: 5, height: 8, background: '#9C8866', border: `1px solid ${P.ink}` }}/>
              </>
            )}
          </div>
        )}
        {/* eaves overhang shadow at base of roof */}
        <div style={{ position: 'absolute', left: -2, right: -2, bottom: wallH - 2, height: 4, background: rdk, border: `1.5px solid ${P.ink}` }}>
          <div style={{ position: 'absolute', left: 1, right: 1, top: 1, height: 1, background: rlt, opacity: 0.6 }}/>
        </div>

        {/* CHIMNEY (decorative, on roof) */}
        {arch === 'pitched' && special !== 'flat' && w >= 4 && (
          <div style={{ position: 'absolute', left: pw - 22, top: -8, width: 10, height: 14, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.3))' }}>
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
          background: isGlass ? '#27414F' : P.wallA,
          borderLeft: `2px solid ${P.ink}`, borderRight: `2px solid ${P.ink}`, borderBottom: `2px solid ${P.ink}`,
          overflow: isGlass ? 'hidden' : 'visible',
          backgroundImage: isGlass ? 'none' : `
            linear-gradient(180deg, ${P.wallShade}88 0 2px, transparent 2px),
            repeating-linear-gradient(90deg, ${P.wallShade}22 0 1px, transparent 1px ${TILE}px)
          `,
        }}>
          {/* cornice band on concrete flat / tower facades */}
          {isFlat && !isGlass && (
            <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 3, background: P.wallShade, borderBottom: `1px solid ${P.ink}` }}/>
          )}

          {/* GLASS CURTAIN WALL — mullion grid + sky reflection */}
          {isGlass && (
            <>
              <div style={{ position: 'absolute', inset: 0,
                backgroundImage: `
                  repeating-linear-gradient(90deg, ${P.windowFrame} 0 1.5px, transparent 1.5px ${TILE * 0.7}px),
                  repeating-linear-gradient(180deg, ${P.windowFrame} 0 1.5px, transparent 1.5px ${TILE * 0.62}px),
                  linear-gradient(135deg, #C2E2F0 0%, #8FB8D2 42%, #5784A0 72%, #46708A 100%)
                `,
              }}/>
              <div style={{ position: 'absolute', top: 0, bottom: 0, left: '8%', width: '22%', background: 'rgba(255,255,255,.28)', transform: 'skewX(-22deg)' }}/>
              <div style={{ position: 'absolute', top: 0, bottom: 0, left: '40%', width: '8%', background: 'rgba(255,255,255,.16)', transform: 'skewX(-22deg)' }}/>
            </>
          )}

          {/* WINDOWS — single row, or two ribbon rows for towers */}
          {!isGlass && Array.from({ length: isTower ? 2 : 1 }).flatMap((_, row) =>
            Array.from({ length: Math.max(1, w - 2) }).map((_, i) => {
              const centerIdx = Math.floor((w - 1) / 2) - 1;
              const bottomRow = row === (isTower ? 1 : 0);
              if (bottomRow && i === centerIdx) return null;
              const top = 5 + row * (TILE * 0.95);
              return (
                <div key={row + '-' + i} style={{
                  position: 'absolute', left: TILE * (i + 1) + 2, top,
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
            })
          )}

          {/* DOOR — proper frame with top arch + handle (glass entrance for curtain-wall) */}
          <div style={{
            position: 'absolute', left: '50%', transform: 'translateX(-50%)',
            bottom: 0, width: isGlass ? TILE + 6 : TILE, height: TILE + 4,
            background: isGlass ? '#152A35' : (accent || P.door),
            border: `2px solid ${P.ink}`,
            borderBottom: 'none',
            backgroundImage: isGlass ? 'none' : `linear-gradient(90deg, ${P.ink}33 0 1px, transparent 1px 4px)`,
          }}>
            {isGlass ? (
              <>
                {/* glass double-door split + header light */}
                <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: P.ink }}/>
                <div style={{ position: 'absolute', left: 1, right: 1, top: 1, height: 2, background: '#9FD0E4', opacity: 0.7 }}/>
              </>
            ) : (
              <>
                {/* arch top */}
                <div style={{ position: 'absolute', left: 1, right: 1, top: 1, height: 2, background: P.doorAccent, opacity: 0.7 }}/>
                {/* handle */}
                <div style={{ position: 'absolute', right: 2, top: '60%', width: 2, height: 3, background: P.flower1 }}/>
              </>
            )}
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

  // ─── FLAGSHIP MEDICAL CENTER — a grand multi-tower complex (Cedars-Sinai
  //     style): dark-glass tower + glowing amber atrium + white-stone tower,
  //     lit dusk windows, podium + entrance canopy. For marquee departments.
  function MedCenter({ x, y, w, h, label, sign, signColor, onSelect }) {
    const px = x * TILE, py = y * TILE, pw = w * TILE, ph = h * TILE;
    const ink = P.ink;
    // window grid for a tower section; deterministic lit pattern for dusk glow
    const grid = (cols, rows, litRatio, salt, on, off) => {
      const cells = [];
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        const isLit = ((c * 7 + r * 13 + salt * 31) % 10) < litRatio * 10;
        cells.push(
          <div key={r + '-' + c} style={{
            position: 'absolute',
            left: `${(c + 0.5) * (100 / cols)}%`, top: `${(r + 0.5) * (100 / rows)}%`,
            width: `${(100 / cols) * 0.62}%`, height: `${(100 / rows) * 0.5}%`,
            transform: 'translate(-50%,-50%)',
            background: isLit ? on : off,
            boxShadow: isLit ? `0 0 2px ${on}` : 'none',
          }}/>
        );
      }
      return cells;
    };
    return (
      <div onClick={onSelect} style={{
        position: 'absolute', left: px, top: py, width: pw, height: ph,
        cursor: 'pointer', filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.32))',
      }}>
        {/* LEFT — dark glass tower with silver pilasters */}
        <div style={{ position: 'absolute', left: 31, width: 38, bottom: 16, height: 146, background: 'linear-gradient(180deg,#3C4856,#28333D)', border: `2px solid ${ink}`, overflow: 'hidden' }}>
          {grid(4, 16, 0.45, 1, '#FFE3A0', '#1E2832')}
          {/* vertical silver mullions */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `repeating-linear-gradient(90deg, #6E7E8C 0 1.5px, transparent 1.5px 9px)`, opacity: 0.45 }}/>
          {/* top light cap */}
          <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 4, background: '#5E6C7A' }}/>
        </div>
        {/* left rooftop penthouse */}
        <div style={{ position: 'absolute', left: 40, width: 16, height: 9, top: -64, background: '#8E98A2', border: `1.5px solid ${ink}` }}/>

        {/* RIGHT — white stone tower with punched windows */}
        <div style={{ position: 'absolute', left: 91, width: 38, bottom: 16, height: 118, background: 'linear-gradient(180deg,#E4DECE,#CDC6B2)', border: `2px solid ${ink}`, overflow: 'hidden' }}>
          {grid(4, 12, 0.28, 5, '#FFEDB0', '#A9B7C0')}
          <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 4, background: '#F0EAD8' }}/>
        </div>
        {/* right rooftop penthouse */}
        <div style={{ position: 'absolute', left: 99, width: 14, height: 7, top: -36, background: '#B8B0A0', border: `1.5px solid ${ink}` }}/>

        {/* connecting glass bridge */}
        <div style={{ position: 'absolute', left: 87, width: 12, bottom: 72, height: 22, background: '#8FB8D2', border: `1.5px solid ${ink}` }}>
          <div style={{ position: 'absolute', left: 1, top: 1, right: 1, height: 2, background: '#D8EEF8', opacity: 0.7 }}/>
        </div>

        {/* CENTER — glowing amber glass atrium (the showpiece), rounded top */}
        <div style={{ position: 'absolute', left: 65, width: 30, bottom: 16, height: 160, background: 'linear-gradient(180deg,#F8D26A,#E89A2C)', border: `2px solid ${ink}`, borderTopLeftRadius: 9, borderTopRightRadius: 9, overflow: 'hidden', boxShadow: '0 0 12px rgba(244,196,86,.75)' }}>
          {/* bright glowing core */}
          <div style={{ position: 'absolute', left: '16%', right: '16%', top: '9%', bottom: 0, background: 'linear-gradient(180deg,#FFF6CE,#FBD877)', opacity: 0.9 }}/>
          {/* horizontal floor plates */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `repeating-linear-gradient(180deg, #B97720aa 0 1px, transparent 1px 7px)` }}/>
          {/* vertical mullions */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `repeating-linear-gradient(90deg, #C98A2A 0 1px, transparent 1px 6px)`, opacity: 0.5 }}/>
        </div>
        {/* center rooftop crown */}
        <div style={{ position: 'absolute', left: 68, width: 24, height: 8, top: -88, background: '#D89A38', border: `1.5px solid ${ink}`, borderRadius: '7px 7px 0 0' }}/>

        {/* PODIUM base + entrance */}
        <div style={{ position: 'absolute', left: -4, right: -4, bottom: 0, height: 24, background: '#CFC8B6', border: `2px solid ${ink}` }}>
          {/* ground-floor lit lobby strip */}
          <div style={{ position: 'absolute', left: 4, right: 4, top: 6, height: 6, background: 'linear-gradient(90deg,#FFE6A6,#F4D27A)', opacity: 0.9 }}/>
          {/* entrance portal */}
          <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', bottom: 0, width: 34, height: 15, background: '#28333D', border: `2px solid ${ink}`, borderBottom: 'none' }}>
            <div style={{ position: 'absolute', left: 2, right: 2, top: 2, height: 3, background: '#FFE6A6', opacity: 0.85 }}/>
          </div>
          {/* canopy slab over the entrance */}
          <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', bottom: 14, width: 46, height: 5, background: '#9FA8B0', border: `1.5px solid ${ink}` }}/>
        </div>

        {/* SIGN plaque on podium */}
        {sign && (
          <div style={{
            position: 'absolute', left: '50%', bottom: 27, transform: 'translateX(-50%)',
            background: signColor || P.red, color: '#fff',
            fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 9, lineHeight: 1,
            padding: '2px 6px', border: `1.5px solid ${ink}`, whiteSpace: 'nowrap',
            boxShadow: `2px 2px 0 0 ${ink}`,
          }}>{sign}</div>
        )}
        {/* label tag, just above the sign so it stays on the building */}
        {label && (
          <div style={{
            position: 'absolute', left: '50%', bottom: 42, transform: 'translateX(-50%)',
            background: '#fff', color: ink, border: `1.5px solid ${ink}`,
            fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 8, padding: '1px 4px',
            whiteSpace: 'nowrap', boxShadow: `1.5px 1.5px 0 0 ${ink}`,
          }}>{label}</div>
        )}
      </div>
    );
  }


  // ─── FLAGSHIP MEDICAL CENTER (horizontal) — a sleek daytime block whose
  //     signature is bold WHITE horizontal sun-shade bands over dark glass
  //     ribbon windows, a rooftop signage parapet, and ground-floor pilotis.
  function MedCenterH({ x, y, w, h, label, sign, signColor, onSelect }) {
    const px = x * TILE, py = y * TILE, pw = w * TILE, ph = h * TILE;
    const ink = P.ink;
    const facadeH = 100;                 // rises a little above the footprint
    const floors = 5, signH = 10, groundH = 16;
    const floorH = (facadeH - signH - groundH) / floors;
    const rows = [];
    for (let i = 0; i < floors; i++) {
      const top = signH + i * floorH;
      rows.push(
        <React.Fragment key={i}>
          {/* dark glass ribbon window strip */}
          <div style={{ position: 'absolute', left: 3, right: 9, top, height: floorH * 0.5, background: 'linear-gradient(180deg,#A6BECC,#6E8C9E)' }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: `repeating-linear-gradient(90deg, #38484F 0 1px, transparent 1px 7px)`, opacity: 0.5 }}/>
          </div>
          {/* bold white sun-shade fin */}
          <div style={{ position: 'absolute', left: 0, right: 0, top: top + floorH * 0.5, height: floorH * 0.5, background: 'linear-gradient(180deg,#FFFFFF,#E6EAEE)', borderTop: `1px solid #C6CCD2` }}/>
        </React.Fragment>
      );
    }
    const cols = Math.max(3, w);
    return (
      <div onClick={onSelect} style={{
        position: 'absolute', left: px, top: py, width: pw, height: ph,
        cursor: 'pointer', filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.3))',
      }}>
        {/* main horizontal mass */}
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: facadeH, border: `2px solid ${ink}`, background: '#E2E7EB', overflow: 'hidden' }}>
          {/* rooftop signage parapet */}
          <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: signH, background: 'linear-gradient(180deg,#FFFFFF,#EBEEF1)', borderBottom: `1px solid #C6CCD2`, display: 'flex', alignItems: 'center', gap: 2, paddingLeft: 5 }}>
            <div style={{ width: 6, height: 6, background: '#E06A2C', borderRadius: '50%' }}/>
            <div style={{ width: '46%', height: 2, background: '#5A6E8C' }}/>
          </div>
          {rows}
          {/* ground floor — recessed dark glass lobby behind pilotis columns */}
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: groundH, background: '#33414C' }}>
            <div style={{ position: 'absolute', left: 3, right: 3, top: 2, bottom: 4, background: 'linear-gradient(180deg,#84A4B6,#506E80)', opacity: 0.85 }}/>
            {Array.from({ length: cols }).map((_, i) => (
              <div key={i} style={{ position: 'absolute', bottom: 0, left: `${(i + 0.5) * (100 / cols)}%`, transform: 'translateX(-50%)', width: 3, height: groundH, background: '#E8EBEE', border: `1px solid ${ink}` }}/>
            ))}
          </div>
          {/* right return face — corner depth */}
          <div style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: 7, background: 'rgba(38,52,62,.26)' }}/>
        </div>

        {/* dept sign plaque on the parapet */}
        {sign && (
          <div style={{
            position: 'absolute', left: '50%', top: -2, transform: 'translate(-50%,-100%)',
            background: signColor || '#3E6E62', color: '#fff',
            fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 9, lineHeight: 1,
            padding: '2px 6px', border: `1.5px solid ${ink}`, whiteSpace: 'nowrap',
            boxShadow: `2px 2px 0 0 ${ink}`,
          }}>{sign}</div>
        )}
        {/* label tag above */}
        {label && (
          <div style={{
            position: 'absolute', left: '50%', top: -20, transform: 'translate(-50%,-100%)',
            background: '#fff', color: ink, border: `1.5px solid ${ink}`,
            fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 8, padding: '1px 4px',
            whiteSpace: 'nowrap', boxShadow: `1.5px 1.5px 0 0 ${ink}`,
          }}>{label}</div>
        )}
      </div>
    );
  }


  // ─── CURVED-GLASS LANDMARK — Severance / Yonsei Cancer Center style: a
  //     convex curved glass tower whose horizontal bands bow outward, a
  //     rounded crown, a rooftop sign band and a small white dish sculpture.
  function MedCenterC({ x, y, w, h, label, sign, signColor, onSelect }) {
    const px = x * TILE, py = y * TILE, pw = w * TILE, ph = h * TILE;
    const ink = '#2A2522';
    const towerH = 96, podiumH = 16;
    return (
      <div onClick={onSelect} style={{
        position: 'absolute', left: px, top: py, width: pw, height: ph,
        cursor: 'pointer', filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.3))',
      }}>
        {/* white dish sculpture on the roof (signature) */}
        <div style={{ position: 'absolute', left: 12, bottom: podiumH + towerH - 6, width: 2, height: 14, background: '#C8CED4', border: `1px solid ${ink}`, transform: 'rotate(-14deg)', transformOrigin: 'bottom' }}/>
        <div style={{ position: 'absolute', left: 6, bottom: podiumH + towerH + 4, width: 14, height: 7, background: '#F4F6F8', border: `1.5px solid ${ink}`, borderRadius: '50%', transform: 'rotate(-18deg)' }}/>

        {/* curved glass tower */}
        <div style={{
          position: 'absolute', left: 2, right: 2, bottom: podiumH - 2, height: towerH,
          border: `2px solid ${ink}`, borderRadius: '24px 24px 4px 4px', overflow: 'hidden',
          backgroundImage: `
            linear-gradient(90deg, rgba(28,46,60,.42) 0%, rgba(255,255,255,.22) 46%, rgba(28,46,60,.46) 100%),
            linear-gradient(90deg, transparent 34%, rgba(255,255,255,.30) 47%, transparent 60%),
            repeating-linear-gradient(180deg, #A8C6D6 0 7px, #E9EFF3 7px 11px)
          `,
          backgroundColor: '#9FC0D2',
        }}>
          {/* curved crown shading */}
          <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 20, background: 'linear-gradient(180deg, rgba(255,255,255,.4), transparent)' }}/>
          {/* rooftop sign band */}
          <div style={{ position: 'absolute', left: 10, right: 10, top: 7, height: 6, background: '#fff', border: `1px solid ${ink}`, display: 'flex', alignItems: 'center', gap: 2, paddingLeft: 3 }}>
            <div style={{ width: 4, height: 4, background: signColor || '#1E6FA8', borderRadius: '50%' }}/>
            <div style={{ width: '55%', height: 1.6, background: '#5A7A92' }}/>
          </div>
        </div>

        {/* podium base — green-tinted glass with entrance */}
        <div style={{ position: 'absolute', left: -2, right: -2, bottom: 0, height: podiumH, background: 'linear-gradient(180deg,#8FB0A0,#5E8472)', border: `2px solid ${ink}` }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `repeating-linear-gradient(90deg, ${ink}33 0 1px, transparent 1px 8px)` }}/>
          <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', bottom: 0, width: 22, height: 11, background: '#2E3A44', border: `2px solid ${ink}`, borderBottom: 'none' }}>
            <div style={{ position: 'absolute', left: 2, right: 2, top: 2, height: 2, background: '#BFE0F0', opacity: 0.7 }}/>
          </div>
        </div>

        {/* dept sign plaque */}
        {sign && (
          <div style={{
            position: 'absolute', left: '50%', bottom: podiumH + 2, transform: 'translateX(-50%)',
            background: signColor || '#1E6FA8', color: '#fff',
            fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 9, lineHeight: 1,
            padding: '2px 6px', border: `1.5px solid ${ink}`, whiteSpace: 'nowrap',
            boxShadow: `2px 2px 0 0 ${ink}`,
          }}>{sign}</div>
        )}
        {label && (
          <div style={{
            position: 'absolute', left: '50%', bottom: podiumH + towerH + 16, transform: 'translate(-50%,0)',
            background: '#fff', color: ink, border: `1.5px solid ${ink}`,
            fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 8, padding: '1px 4px',
            whiteSpace: 'nowrap', boxShadow: `1.5px 1.5px 0 0 ${ink}`,
          }}>{label}</div>
        )}
      </div>
    );
  }

  // ─── HISTORIC LANDMARK (Victorian) — Johns Hopkins style: red-brick body,
  //     dark slate mansard roofs + dormers, corner turrets, and a great green
  //     copper dome on a stone drum. Drawn entirely WITHIN the footprint, so
  //     it never overhangs neighbours (works even at the map's top edge).
  function MedCenterV({ x, y, w, h, label, sign, signColor, onSelect }) {
    const px = x * TILE, py = y * TILE, pw = w * TILE, ph = h * TILE;
    const ink = '#2A2522';
    const C = {
      brick: '#9E4A3C', brickDk: '#7E3A2E', brickLt: '#B86A5A',
      stone: '#E0D4BB', stoneDk: '#BCA98A',
      slate: '#3B414C', slateLt: '#535B68', slateDk: '#2A2F38',
      copper: '#5E9486', copperDk: '#3C6A5E', copperLt: '#8FBCAE',
      glass: '#2E3A44', lit: '#ECC766', sash: '#E0D4BB',
    };
    // a row of arched windows within [bx..bx+bw], top by, given count
    const winRow = (bx, bw, by, count, salt, key) => {
      const out = []; const gap = bw / count;
      for (let i = 0; i < count; i++) {
        const wx = bx + i * gap + gap * 0.28, ww = gap * 0.44;
        const isLit = ((i * 5 + salt * 7) % 10) < 3;
        out.push(
          <g key={key + i}>
            <rect x={wx} y={by} width={ww} height={6.5} fill={isLit ? C.lit : C.glass} stroke={C.sash} strokeWidth="0.6"/>
            <path d={`M${wx - 0.3} ${by} Q${wx + ww / 2} ${by - 2.6} ${wx + ww + 0.3} ${by}`} fill={C.stone} stroke={ink} strokeWidth="0.4"/>
          </g>
        );
      }
      return out;
    };
    return (
      <div onClick={onSelect} style={{
        position: 'absolute', left: px, top: py, width: pw, height: ph,
        cursor: 'pointer', filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.3))',
      }}>
        <svg viewBox="0 0 144 80" width={pw} height={ph} style={{ display: 'block', overflow: 'visible' }} shapeRendering="auto">
          <defs>
            <pattern id={`brk${x}_${y}`} width="9" height="6" patternUnits="userSpaceOnUse">
              <rect width="9" height="6" fill={C.brick}/>
              <rect width="9" height="0.7" y="5.3" fill={C.brickDk}/>
              <rect width="0.7" height="3" x="0" fill={C.brickDk}/>
              <rect width="0.7" height="3" x="4.5" y="3" fill={C.brickDk}/>
            </pattern>
          </defs>
          {/* ── corner turrets (steep pointed roofs) ── */}
          {[12, 132].map((cx, i) => (
            <g key={`turret${i}`}>
              <rect x={cx - 7} y={34} width={14} height={46} fill={`url(#brk${x}_${y})`} stroke={ink} strokeWidth="0.8"/>
              <path d={`M${cx - 9} 35 L${cx} 16 L${cx + 9} 35 Z`} fill={C.slate} stroke={ink} strokeWidth="0.8"/>
              <path d={`M${cx} 17 L${cx + 8} 34 L${cx} 34 Z`} fill={C.slateDk} opacity="0.6"/>
              <rect x={cx - 0.6} y={11} width={1.2} height={6} fill={C.copperDk}/>
              <rect x={cx - 1.6} y={32} width={3.2} height={5} fill={C.lit} stroke={C.sash} strokeWidth="0.5"/>
            </g>
          ))}

          {/* ── wing mansard roofs + brick bodies ── */}
          {[[16, 52], [92, 128]].map(([x0, x1], i) => (
            <g key={`wing${i}`}>
              {/* brick body */}
              <rect x={x0} y={40} width={x1 - x0} height={40} fill={`url(#brk${x}_${y})`} stroke={ink} strokeWidth="0.8"/>
              {/* mansard slate roof */}
              <path d={`M${x0 - 1} 41 L${x1 + 1} 41 L${x1 - 4} 27 L${x0 + 4} 27 Z`} fill={C.slate} stroke={ink} strokeWidth="0.8"/>
              <path d={`M${x0 - 1} 41 L${x1 + 1} 41 L${x1 + 1} 39 L${x0 - 1} 39 Z`} fill={C.slateDk}/>
              {/* dormers */}
              {[0.28, 0.62].map((f, d) => {
                const dx = x0 + (x1 - x0) * f;
                return (
                  <g key={d}>
                    <path d={`M${dx - 3} 34 L${dx} 29 L${dx + 3} 34 Z`} fill={C.slateLt} stroke={ink} strokeWidth="0.5"/>
                    <rect x={dx - 2} y={34} width={4} height={5} fill={C.lit} stroke={C.sash} strokeWidth="0.5"/>
                  </g>
                );
              })}
              {/* stone string course + two window rows */}
              <rect x={x0} y={47} width={x1 - x0} height={1.4} fill={C.stone}/>
              {winRow(x0 + 2, x1 - x0 - 4, 51, i === 0 ? 4 : 4, i + 1, `wA${i}`)}
              <rect x={x0} y={62} width={x1 - x0} height={1.4} fill={C.stone}/>
              {winRow(x0 + 2, x1 - x0 - 4, 66, i === 0 ? 4 : 4, i + 3, `wB${i}`)}
            </g>
          ))}

          {/* ── central pavilion (taller, forward) ── */}
          <rect x={52} y={30} width={40} height={50} fill={`url(#brk${x}_${y})`} stroke={ink} strokeWidth="0.9"/>
          {/* stone quoins / cornice */}
          <rect x={52} y={30} width={40} height={2} fill={C.stone}/>
          <rect x={52} y={44} width={40} height={1.4} fill={C.stone}/>
          {winRow(55, 34, 34, 4, 9, 'cT')}
          {winRow(55, 34, 48, 4, 2, 'cM')}
          {/* grand arched entrance */}
          <path d="M64 80 L64 70 Q72 60 80 70 L80 80 Z" fill={C.glass} stroke={C.stone} strokeWidth="1.4"/>
          <path d="M64 70 Q72 60 80 70" fill="none" stroke={C.stoneDk} strokeWidth="0.8"/>
          <rect x={71.4} y={70} width={1.2} height={10} fill={C.stoneDk}/>
          <rect x={62} y={79} width={20} height={1.6} fill={C.stoneDk}/>

          {/* ── stone drum + green copper dome ── */}
          <rect x={60} y={18} width={24} height={13} rx={1} fill={C.stone} stroke={ink} strokeWidth="0.8"/>
          {/* drum arched windows */}
          {[64, 70.5, 77].map((wx, i) => (
            <g key={`drum${i}`}>
              <rect x={wx} y={21} width={3.2} height={7} fill={C.glass}/>
              <path d={`M${wx - 0.2} 21 Q${wx + 1.6} 19 ${wx + 3.4} 21`} fill={C.stoneDk}/>
            </g>
          ))}
          <rect x={59} y={17} width={26} height={1.6} fill={C.stoneDk}/>
          {/* dome */}
          <path d="M58 18 C58 8 63 5 72 5 C81 5 86 8 86 18 Z" fill={C.copper} stroke={ink} strokeWidth="0.9"/>
          {/* dome ribs */}
          {[64, 72, 80].map((rx, i) => (
            <path key={`rib${i}`} d={`M72 6 Q${rx} 11 ${rx === 72 ? 72 : (rx < 72 ? 60 : 84)} 18`} fill="none" stroke={C.copperDk} strokeWidth="0.7" opacity="0.7"/>
          ))}
          {/* dome highlight */}
          <path d="M63 16 C63 9 66 6 71 6" fill="none" stroke={C.copperLt} strokeWidth="1.4" strokeLinecap="round"/>
          {/* lantern + finial */}
          <rect x={68.5} y={1} width={7} height={6} rx={1} fill={C.stone} stroke={ink} strokeWidth="0.7"/>
          <path d="M68 1.5 Q72 -1.5 76 1.5 Z" fill={C.copper} stroke={ink} strokeWidth="0.6"/>
          <rect x={71.4} y={-3} width={1.2} height={4} fill={C.copperDk}/>
        </svg>

        {/* dept sign plaque on the facade */}
        {sign && (
          <div style={{
            position: 'absolute', left: '50%', top: TILE * (h - 1.1), transform: 'translateX(-50%)',
            background: signColor || '#7E3A2E', color: '#fff',
            fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 9, lineHeight: 1,
            padding: '2px 6px', border: `1.5px solid ${ink}`, whiteSpace: 'nowrap',
            boxShadow: `2px 2px 0 0 ${ink}`,
          }}>{sign}</div>
        )}
        {label && (
          <div style={{
            position: 'absolute', left: '50%', top: -14, transform: 'translate(-50%,-100%)',
            background: '#fff', color: ink, border: `1.5px solid ${ink}`,
            fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 8, padding: '1px 4px',
            whiteSpace: 'nowrap', boxShadow: `1.5px 1.5px 0 0 ${ink}`,
          }}>{label}</div>
        )}
      </div>
    );
  }

  function Tree({ x, y, big }) {
    const s = big ? TILE * 2.2 : TILE * 1.7;
    return (
      <div style={{
        position: 'absolute', left: x * TILE - (big ? 6 : 4), top: y * TILE - (big ? 14 : 10),
        width: s, height: s + 6, imageRendering: 'pixelated',
        filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.22))',
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
      <div style={{ position: 'absolute', left: x * TILE, top: y * TILE - 6, width: TILE * 2, height: TILE + 6, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.22))' }}>
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
      <div style={{ position: 'absolute', left: x * TILE, top: y * TILE - 32, width: TILE, height: TILE * 3, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.25))' }}>
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
      <div style={{ position: 'absolute', left: x * TILE + 2, top: y * TILE - 4, width: TILE - 4, height: TILE + 4, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.22))' }}>
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
      <div style={{ position: 'absolute', left: x * TILE, top: y * TILE - 10, width: TILE, height: TILE * 1.6, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.22))' }}>
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
      <div style={{ position: 'absolute', left: x * TILE + 4, top: y * TILE + 2, width: TILE - 8, height: TILE - 2, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.22))' }}>
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
      <div style={{ position: 'absolute', left: x * TILE, top: y * TILE - 8, width: TILE, height: TILE * 1.8, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.25))' }}>
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
      <div style={{ position: 'absolute', left: x * TILE, top: y * TILE - 4, width: TILE * 2, height: TILE * 2, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.22))' }}>
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
      <div style={{ position: 'absolute', left: x * TILE, top: y * TILE - 6, width: TILE * w, height: TILE + 4, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.18))' }}>
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
      <div style={{ position: 'absolute', left: x * TILE + 2, top: y * TILE - 18, width: TILE, height: TILE * 2, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.25))' }}>
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
      <div style={{ position: 'absolute', left: x * TILE, top: y * TILE - 14, width: TILE, height: TILE * 1.8, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.25))' }}>
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
      <div style={{ position: 'absolute', left: x * TILE, top: y * TILE - 4, width: TILE * 2.4, height: TILE * 1.6, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.3))' }}>
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
      <div style={{ position: 'absolute', left: x * TILE, top: y * TILE - 6, width: TILE * 1.6, height: TILE * 3, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.3))' }}>
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

  // ─── CLOCK TOWER — garden centerpiece (replaces the fountain) ───────
  // ─── CLOCK TOWER — Big-Ben-style Gothic centerpiece ─────────────────
  function Fountain({ x, y }) {
    const buff = '#C9B486', buffLt = '#DCC99C', buffDk = '#A8946A', slate = '#6E7A86',
      slateDk = '#4C5660', slateLt = '#8B97A2', gold = '#D8B24A', ink = P.ink;
    const W = TILE * 4.2, H = TILE * 9;
    const rib = (rx) => <rect key={rx} x={rx} y="40" width="1.4" height="56" fill={buffDk} opacity=".7"/>;
    return (
      <div style={{ position: 'absolute', left: x * TILE, top: y * TILE - TILE * 7, width: W, height: H, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.3))' }}>
        <style>{`@keyframes forinFlagW { 0%,100%{transform:scaleX(1)} 50%{transform:scaleX(.65)} }`}</style>
        <svg viewBox="0 0 64 144" width={W} height={H} shapeRendering="geometricPrecision">
          {/* ground shadow */}
          <ellipse cx="32" cy="139" rx="26" ry="5" fill="rgba(0,0,0,.12)"/>

          {/* ───── base / plinth (stepped) ───── */}
          <path d="M 6 132 L 58 132 L 62 140 L 2 140 Z" fill={buffDk} stroke={ink} strokeWidth=".8"/>
          <rect x="9" y="124" width="46" height="8" fill={buff} stroke={ink} strokeWidth=".7"/>
          {/* arched main entrance */}
          <path d="M 27 132 L 27 119 Q 32 112 37 119 L 37 132 Z" fill="#4A3B2A" stroke={ink} strokeWidth=".6"/>
          <path d="M 28.5 132 L 28.5 120 Q 32 115 35.5 120 L 35.5 132 Z" fill="#5C4A34"/>

          {/* ───── tall shaft (buff stone, vertical pilaster ribs) ───── */}
          <rect x="13" y="40" width="38" height="92" fill={buff} stroke={ink} strokeWidth=".8"/>
          <rect x="13" y="40" width="4" height="92" fill={buffLt}/>{/* corner pilaster L */}
          <rect x="47" y="40" width="4" height="92" fill={buffDk}/>{/* corner pilaster R */}
          {[21,26,31,36,41].map(rib)}
          {/* string courses dividing the shaft into stages */}
          {[58,80,104].map((cy,i)=><rect key={i} x="13" y={cy} width="38" height="2" fill={buffDk} stroke={ink} strokeWidth=".4"/>)}
          {/* lancet windows per stage */}
          {[66,90,112].map((wy,i)=>(
            <g key={i}>
              <path d={`M 23 ${wy+10} L 23 ${wy+3} Q 25 ${wy} 27 ${wy+3} L 27 ${wy+10} Z`} fill="#7E94A2" stroke={ink} strokeWidth=".4"/>
              <path d={`M 37 ${wy+10} L 37 ${wy+3} Q 39 ${wy} 41 ${wy+3} L 41 ${wy+10} Z`} fill="#7E94A2" stroke={ink} strokeWidth=".4"/>
            </g>
          ))}

          {/* ───── clock stage (slightly wider, ornate) ───── */}
          <rect x="10" y="40" width="44" height="4" fill={buffDk} stroke={ink} strokeWidth=".5"/>
          <rect x="11" y="16" width="42" height="24" fill={buffLt} stroke={ink} strokeWidth=".8"/>
          <rect x="11" y="16" width="42" height="2.4" fill={buff}/>
          {/* gilded surround + clock face */}
          <circle cx="32" cy="28" r="10" fill={gold} stroke={ink} strokeWidth=".8"/>
          <circle cx="32" cy="28" r="8.6" fill="#FBF8EE" stroke={ink} strokeWidth=".6"/>
          {[...Array(12)].map((_,i)=>{const a=i*Math.PI/6;return <rect key={i} x={32+Math.sin(a)*7.3-0.3} y={28-Math.cos(a)*7.3-0.3} width=".7" height=".7" fill={ink}/>;})}
          <line x1="32" y1="28" x2="32" y2="22" stroke={ink} strokeWidth="1.1"/>
          <line x1="32" y1="28" x2="36.5" y2="29.5" stroke={ink} strokeWidth=".9"/>
          <circle cx="32" cy="28" r="1.1" fill={gold}/>
          {/* little corner pinnacle finials flanking the clock stage */}
          <path d="M 11 16 L 13 9 L 15 16 Z" fill={buffLt} stroke={ink} strokeWidth=".4"/>
          <path d="M 49 16 L 51 9 L 53 16 Z" fill={buffLt} stroke={ink} strokeWidth=".4"/>

          {/* ───── belfry: gilded arcade + slate base of the spire ───── */}
          <rect x="13" y="12" width="38" height="4" fill={gold} stroke={ink} strokeWidth=".5"/>
          {[16,22,28,34,40,46].map((ax,i)=><path key={i} d={`M ${ax} 12 L ${ax} 8 Q ${ax+1.5} 6 ${ax+3} 8 L ${ax+3} 12 Z`} fill="#3A2E22" stroke={gold} strokeWidth=".4"/>)}
          {/* slate cornice */}
          <path d="M 9 12 L 55 12 L 51 6 L 13 6 Z" fill={slateDk} stroke={ink} strokeWidth=".6"/>

          {/* ───── steep crocketed spire ───── */}
          <path d="M 13 6 L 32 -34 L 51 6 Z" fill={slate} stroke={ink} strokeWidth=".8"/>
          <path d="M 32 -34 L 51 6 L 40 6 Z" fill={slateDk}/>{/* shaded face */}
          <path d="M 32 -34 L 24 6 L 13 6 Z" fill={slateLt} opacity=".6"/>{/* lit face */}
          {/* spire ribs + crockets */}
          <line x1="32" y1="-34" x2="32" y2="6" stroke={slateDk} strokeWidth=".5"/>
          {[[-18,4],[-6,9],[6,14]].map(([sy,off],i)=>(
            <g key={i}>
              <path d={`M ${32-off} ${sy} l -2 -1.5`} stroke={gold} strokeWidth="1" strokeLinecap="round"/>
              <path d={`M ${32+off} ${sy} l 2 -1.5`} stroke={gold} strokeWidth="1" strokeLinecap="round"/>
            </g>
          ))}
          {/* gilded finial + orb */}
          <rect x="31" y="-44" width="2" height="11" fill={gold} stroke={ink} strokeWidth=".3"/>
          <circle cx="32" cy="-45" r="2" fill="#EAC75E" stroke={ink} strokeWidth=".4"/>
          <path d="M 30.6 -47 L 32 -50 L 33.4 -47 Z" fill={gold}/>
        </svg>
      </div>
    );
  }

  // ─── BIKE RACK v2 — proper depth ───────────────────────────────────
  function BikeRack({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * TILE, top: y * TILE - 4, width: TILE * 2, height: TILE * 1.5, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.22))' }}>
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
      <div style={{ position: 'absolute', left: x * TILE, top: y * TILE, width: TILE * 4, height: TILE * 3, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.15))' }}>
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
  function PlayerSprite({ dir, walking }) {
    if (window.DerpPlayer) return <window.DerpPlayer size={24} tag="" dir={dir} walking={walking}/>;
    if (window.ChibiPlayer) return <window.ChibiPlayer size={18} tag=""/>;
    // fallback box if DS not loaded
    return <div style={{ width: 18, height: 21, background: window.ForinTokens.mint, border: `1px solid ${P.ink}` }}/>;
  }

  // ─── NPC sprite — uses the design-system DERP role presets ────────
  // kind maps to a Derp* role component (forin-npcs-smooth.jsx). x,y seed
  // the deterministic hairstyle/skin/outfit variation so each NPC is
  // distinct yet stable across renders.
  function NPC({ x, y, shirt, hair, hairStyle, exclaim, quest, kind, dir, walking, seed, emote }) {
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
    // Stable identity seed: defaults to the spawn tile so static NPCs are
    // unchanged, but movers pass an explicit seed so color stays fixed.
    const idSeed = seed != null ? seed : (x * 131 + y);
    return (
      <div style={{ position: 'absolute', left: x * TILE - 4, top: y * TILE - 16, zIndex: 4, transition: 'left .55s linear, top .55s linear' }}>
        {Role ? <Role seed={idSeed} hair={hair} hairStyle={hairStyle} shirt={shirt} size={kind === 'child' ? 20 : 24} dir={dir} walking={walking}/> : null}
        {exclaim && (
          <div style={{ position: 'absolute', top: -12, left: '60%', background: quest ? '#FEF08A' : '#fff', border: `2px solid ${P.ink}`, width: 13, height: 13, fontFamily: '"DungGeunMo",monospace', fontSize: 9, color: P.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `2px 2px 0 0 ${P.ink}`, animation: 'forinBob 1.2s ease-in-out infinite', zIndex: 6 }}>!</div>
        )}
        {emote && (
          <div style={{ position: 'absolute', top: -20, left: '50%', transform: 'translateX(-30%)', background: '#fff', border: `2px solid ${P.ink}`, borderRadius: 8, padding: '1px 5px 2px', fontSize: 12, lineHeight: 1, boxShadow: `2px 2px 0 0 ${P.ink}`, animation: 'forinEmotePop .25s ease-out', zIndex: 7, whiteSpace: 'nowrap' }}>
            {emote}
            <div style={{ position: 'absolute', bottom: -5, left: 8, width: 5, height: 5, background: '#fff', borderRight: `2px solid ${P.ink}`, borderBottom: `2px solid ${P.ink}`, transform: 'rotate(45deg)' }}/>
          </div>
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

  // ─── Map layout (26 cols × 60 rows) — RADIAL CENTRAL-HUB campus ─────
  // A central Healing Garden plaza (fountain + statue) is ringed by 5 pavilions:
  // 본관(N) · 암센터(NW) · 행정(NE) · 외래(SW) · 여성소아(SE). A south main-gate
  // avenue leads up into the garden; a backstage service road runs along the top.
  const MAP = [
    'gggggggggggggggggggggggggg', //  0 north service yard
    'cccccccccccccccccccccccccc', //  1 service sidewalk
    'rrrrrrrrrrrrrrrrrrrrrrrrrr', //  2 backstage service road (ambulance/trucks)
    'cccccccccccccccccccccccccc', //  3 service sidewalk
    'gggggggggggggggggggggggggg', //  4 building tops begin (drawn on top)
    'ggGgggggggggggggggggGggggg', //  5
    'gggggggggggggggggggggggggg', //  6
    'gggggggggggggggggggggggggg', //  7  암센터(NW) · 행정(NE) footprints
    'ggGgggggggggggggggggggGggg', //  8
    'gggggggggggggggggggggggggg', //  9
    'gggggggggggggggggggggggggg', // 10
    'ggggggggggggGggggggggggggg', // 11
    'gggppgggggggppgggggggppggg', // 12 front-door spokes (NW · 본관 · NE)
    'gggppgggggggppgggggggppggg', // 13
    'gggppgggggggppgggggggppggg', // 14
    'gggppgggggggppgggggggppggg', // 15
    'gggppgggggggppgggggggppggg', // 16
    'gggppgggggggppgggggggppggg', // 17
    'ggggzzzzzzzzzzzzzzzzzzgggg', // 18 ─ Healing Garden plaza begins ─
    'ggggzzzzzzzzzzzzzzzzzzgggg', // 19
    'ggggzzzzzzzzzzzzzzzzzzgggg', // 20
    'ggggzzzzzzzzzzzzzzzzzzgggg', // 21
    'ggggzzzzzzzzzzzzzzzzzzgggg', // 22
    'ggggzzzzzzzzzzzzzzzzzzgggg', // 23 (fountain)
    'ggggzzzzzzzzzzzzzzzzzzgggg', // 24 (statue)
    'ggggzzzzzzzzzzzzzzzzzzgggg', // 25
    'ggggzzzzzzzzzzzzzzzzzzgggg', // 26
    'ggggzzzzzzzzzzzzzzzzzzgggg', // 27
    'ggggzzzzzzzzzzzzzzzzzzgggg', // 28
    'ggggzzzzzzzzzzzzzzzzzzgggg', // 29
    'ggggzzzzzzzzzzzzzzzzzzgggg', // 30
    'ggggzzzzzzzzzzzzzzzzzzgggg', // 31 ─ Healing Garden plaza ends ─
    'gggggggggggpPPpggggggggggg', // 32 avenue south
    'ggggppggggggppggggggppgggg', // 33 spokes (외래 SW · avenue · 여성소아 SE)
    'ggggppggggggppggggggppgggg', // 34
    'ggggppggggggppggggggppgggg', // 35
    'ggggppggggggppggggggppgggg', // 36
    'ggggppggggggppggggggppgggg', // 37
    'ggggppggggggppggggggppgggg', // 38
    'ggggppggggggppgggggggggggg', // 39 SE building top begins
    'ggggggggggggppgggggggggggg', // 40 외래(SW) footprint · avenue
    'ggggggggggggppgggggggggggg', // 41
    'ggggggggggggppgggggggggggg', // 42
    'ggggggggggggppgggggggggggg', // 43
    'ggggggggggggppgggggggggggg', // 44
    'ggGgggggggggppggggggggGggg', // 45
    'ggggggggggggppgggggggggggg', // 46
    'cccccccccccccccccccccccccc', // 47 gate sidewalk
    'rrrrrrrrrrrrllrrrrrrrrrrrr', // 48 main gate road (4-lane)
    'rrrrrrrrrrrrllrrrrrrrrrrrr', // 49
    'cccccccccccccccccccccccccc', // 50 gate sidewalk
    'ggggzzzzzzzzzzzzzzzzzzgggg', // 51 ─ Main Gate forecourt ─
    'ggggzzzzzzzzzzzzzzzzzzgggg', // 52
    'ggggzzzzzzzzzzzzzzzzzzgggg', // 53
    'ggggggggggggppgggggggggggg', // 54
    'gggggggggggggggggggggggggg', // 55
    'ggGgggggggggggggggggGggggg', // 56
    'gggggggggggggggggggggggggg', // 57
    'gggggggggggggggggggggggggg', // 58
    'gggggggggggggggggggggggggg', // 59
  ];

  // ── Patrol layer — isolated so its 0.9s interval re-renders ONLY the
  // patrolling NPCs, never the huge static campus world. ──
  // Two NPC behaviors:
  //  • 'patrol' — follows a fixed waypoint path, pausing+emoting at ends.
  //  • 'wander' — free-roams within a rectangular bound (stays out of rooms),
  //    occasionally standing still to emote.
  function PatrolNPCs() {
    const EMOTES = ['💬', '😄', '🤔', '☕', '👍', '✨', '😮', '🩺', '📋', '❤️'];

    // Each agent carries a STABLE seed (fixed identity color) + behavior.
    const agents = React.useRef([
      // patrols (fixed routes)
      { seed: 11, kind: 'nurse',   mode: 'patrol', path: [{x:8,y:19},{x:9,y:19},{x:10,y:19},{x:11,y:19},{x:12,y:19}] },
      { seed: 27, kind: 'doctor',  mode: 'patrol', path: [{x:6,y:52},{x:7,y:52},{x:8,y:52},{x:9,y:52},{x:10,y:52}] },
      { seed: 41, kind: 'visitor', mode: 'patrol', path: [{x:12,y:46},{x:12,y:44},{x:12,y:42},{x:12,y:40}] },
      // wanderers (free roam within bounds — central Healing Garden plaza)
      { seed: 63, kind: 'patient', mode: 'wander', bound: { x:5,  y:19, w:6, h:5 } },
      { seed: 88, kind: 'parent',  mode: 'wander', bound: { x:14, y:26, w:6, h:5 } },
      { seed: 95, kind: 'child',   mode: 'wander', bound: { x:6,  y:26, w:5, h:5 } },
      // hairstyle showcase — one free-roamer per hairstyle (patient role, so
      // the hair isn't hidden by a hat), spread across the garden plaza.
      { seed: 201, kind: 'patient', hairStyle: 'short',    mode: 'wander', bound: { x:5,  y:19, w:4, h:3 } },
      { seed: 202, kind: 'patient', hairStyle: 'bob',      mode: 'wander', bound: { x:10, y:19, w:4, h:3 } },
      { seed: 203, kind: 'patient', hairStyle: 'long',     mode: 'wander', bound: { x:15, y:19, w:5, h:3 } },
      { seed: 204, kind: 'patient', hairStyle: 'pigtails', mode: 'wander', bound: { x:5,  y:26, w:4, h:3 } },
      { seed: 205, kind: 'patient', hairStyle: 'bun',      mode: 'wander', bound: { x:10, y:26, w:4, h:3 } },
      { seed: 206, kind: 'patient', hairStyle: 'curly',    mode: 'wander', bound: { x:15, y:26, w:5, h:3 } },
      { seed: 207, kind: 'patient', hairStyle: 'mohawk',   mode: 'wander', bound: { x:8,  y:29, w:4, h:2 } },
      { seed: 208, kind: 'patient', hairStyle: 'bald',     mode: 'wander', bound: { x:13, y:29, w:4, h:2 } },
    ]).current;

    const init = agents.map((a) => {
      const start = a.mode === 'patrol' ? a.path[0] : { x: a.bound.x + 1, y: a.bound.y + 1 };
      return { x: start.x, y: start.y, i: 0, fwd: true, dir: 'down', walking: false, emote: null, pause: 0 };
    });
    const [st, setSt] = React.useState(init);

    React.useEffect(() => {
      let tick = 0;
      const id = setInterval(() => {
        tick++;
        setSt(prev => prev.map((s, k) => {
          const a = agents[k];
          // If paused, count down; maybe show an emote partway through.
          if (s.pause > 0) {
            const np = s.pause - 1;
            return { ...s, walking: false, pause: np, emote: np === 1 ? null : s.emote };
          }
          // Occasionally stop to emote (≈1 in 5 steps).
          if (Math.random() < 0.22) {
            const em = EMOTES[Math.floor(Math.random() * EMOTES.length)];
            return { ...s, walking: false, emote: em, pause: 2 + Math.floor(Math.random() * 2) };
          }

          if (a.mode === 'patrol') {
            const path = a.path;
            let { i, fwd } = s;
            let ni = fwd ? i + 1 : i - 1;
            if (ni >= path.length) { ni = path.length - 2; fwd = false; }
            if (ni < 0) { ni = 1; fwd = true; }
            const from = path[i], to = path[ni];
            const dir = to.x > from.x ? 'right' : to.x < from.x ? 'left' : to.y < from.y ? 'up' : 'down';
            return { ...s, x: to.x, y: to.y, i: ni, fwd, dir, walking: true, emote: null };
          }

          // wander: step one tile in a random cardinal dir, clamped to bound.
          const b = a.bound;
          const dirs = [['up',0,-1],['down',0,1],['left',-1,0],['right',1,0]];
          const opts = dirs.filter(([, dx, dy]) =>
            s.x + dx >= b.x && s.x + dx < b.x + b.w &&
            s.y + dy >= b.y && s.y + dy < b.y + b.h);
          if (!opts.length) return { ...s, walking: false, emote: null };
          const [dir, dx, dy] = opts[Math.floor(Math.random() * opts.length)];
          return { ...s, x: s.x + dx, y: s.y + dy, dir, walking: true, emote: null };
        }));
      }, 1800); // slower, calmer cadence
      return () => clearInterval(id);
    }, []);

    return st.map((s, k) => {
      const a = agents[k];
      return <NPC key={'ag' + k} x={s.x} y={s.y} seed={a.seed} kind={a.kind} hairStyle={a.hairStyle}
                  dir={s.dir} walking={s.walking} emote={s.emote}/>;
    });
  }

  function ScreenExplore() {
    const T = window.ForinTokens;
    const mapW = COLS * TILE;
    const mapH = ROWS * TILE;
    const scrollRef = React.useRef(null);

    // Player position (in tile coords) + facing direction + walking pulse
    const [pos, setPos] = React.useState({ x: 12, y: 45 });
    const [dir, setDir] = React.useState('up');
    const [walking, setWalking] = React.useState(false);
    const walkTimer = React.useRef(null);
    function step(d) {
      setDir(d);
      setWalking(true);
      clearTimeout(walkTimer.current);
      walkTimer.current = setTimeout(() => setWalking(false), 320);
      if (d === 'up')    setPos(p => ({ x: p.x, y: Math.max(1, p.y - 1) }));
      if (d === 'down')  setPos(p => ({ x: p.x, y: Math.min(ROWS - 2, p.y + 1) }));
      if (d === 'left')  setPos(p => ({ x: Math.max(0, p.x - 1), y: p.y }));
      if (d === 'right') setPos(p => ({ x: Math.min(COLS - 1, p.x + 1), y: p.y }));
    }

    // Center scroll on player position
    React.useEffect(() => {
      const el = scrollRef.current;
      if (!el) return;
      const targetX = pos.x * TILE - el.clientWidth / 2 + TILE / 2;
      const targetY = pos.y * TILE - el.clientHeight / 2 + TILE / 2;
      el.scrollTo({ left: targetX, top: targetY, behavior: 'smooth' });
    }, [pos]);

    // Buildings — campus rebuilt to FIVE pavilions, all in the new landmark
    // architecture (본관/MedCenter, 암센터/MedCenterC, 의과대/MedCenterV styles).
    // The nine departments built so far (ER/OR/ICU/Pharmacy + 내·외·정형·피부)
    // now live INSIDE the Main Medical Tower; the other pavilions group the
    // remaining services and will be detailed later.
    const buildings = [
      // 본관 — Main Medical Tower: N of the garden, center, tallest.
      // ER · OR · ICU · Pharmacy · 내과/외과/정형외과/피부과.
      { x: 8,  y: 5,  w: 10, h: 7, roof: { mid: P.roofWhite, dk: P.roofWhiteDk, lt: '#F2EDDE' },
        label: '본관 · 메인 메디컬 타워', sign: '🚑 MEDICAL TOWER', signColor: P.red,
        mainEntrance: true, arch: 'landmark' },

      // 암센터 및 특수 재활관 — NW of the garden (curved eco glass).
      { x: 1,  y: 6,  w: 6, h: 6, roof: { mid: P.roofTeal, dk: P.roofTealDk, lt: '#85B5A8' },
        label: '암센터 · 재활관', sign: '🎗 ONCOLOGY · REHAB', signColor: '#1E8A5B',
        arch: 'landmark', landmark: 'curved' },

      // 여성소아 센터 — SE of the garden (warm rounded pavilion).
      { x: 18, y: 39, w: 7, h: 6, roof: { mid: P.roofMauve, dk: P.roofMauveDk, lt: '#B89BC0' },
        label: '여성소아 센터', sign: '🤰 WOMEN & CHILDREN', signColor: '#C2487E',
        arch: 'landmark', landmark: 'victorian' },

      // 외래 및 진단 지원동 — SW of the garden (low wide silver monolith).
      { x: 1,  y: 40, w: 8, h: 5, roof: { mid: P.roofWhite, dk: P.roofWhiteDk, lt: '#F2EDDE' },
        label: '외래 · 진단 지원동', sign: '🔬 OUTPATIENT · DX', signColor: '#0E7490',
        mainEntrance: true, arch: 'landmark', landmark: 'horizontal' },

      // 행정 및 백스테이지 윙 — NE of the garden (utilitarian concrete/brick).
      { x: 19, y: 7,  w: 6, h: 5, roof: { mid: '#9A8C7A', dk: '#6E6354', lt: '#B7AB98' },
        label: '행정 · 지원동', sign: '📦 ADMIN · SUPPORT', signColor: '#6E6354',
        emblem: '📦', arch: 'flat' },
    ];

    // NPCs — outside the buildings, walking the paths
    const npcs = [
      { x: 12, y: 15, shirt: '#fff', hair: '#3C2A18', kind: 'doctor', exclaim: true, quest: true, label: 'Dr. Patel' },
      { x: 6,  y: 18, shirt: '#A7F3D0', hair: '#7C3F00', kind: 'nurse' },
      { x: 19, y: 18, shirt: '#FFEDD5', hair: '#5C3A1A', kind: 'patient', exclaim: true },
      { x: 14, y: 19, shirt: '#BAE6FD', hair: '#2D1B0F', kind: 'nurse' },
      { x: 4,  y: 16, shirt: '#FBCFE8', hair: '#9A6B3F', kind: 'patient' },
      { x: 21, y: 16, shirt: '#fff', hair: '#3C2A18', kind: 'doctor' },
      { x: 8,  y: 34, shirt: '#A7F3D0', hair: '#3C2A18', kind: 'nurse' },
      { x: 16, y: 34, shirt: '#FFEDD5', hair: '#7C3F00', kind: 'patient', exclaim: true },
      { x: 20, y: 41, shirt: '#fff', hair: '#1F2937', kind: 'doctor' },
      { x: 5,  y: 41, shirt: '#FBCFE8', hair: '#9A6B3F', kind: 'patient' },
    ];

    // ── Patrol NPCs are rendered by the isolated <PatrolNPCs/> component
    // (defined at module scope) so their movement interval never re-renders
    // this huge component. ──

    // Tree clusters — line the south gate avenue (metasequoia), ring the
    // garden, and dot the corners. Kept off building footprints & plaza.
    const trees = [
      // south gate avenue (tall rows of trees flanking the entry road)
      [8, 51], [16, 51], [8, 54], [16, 54], [8, 57], [16, 57], [10, 58], [14, 58],
      // garden ring
      [3, 18], [21, 18], [3, 24], [21, 24], [3, 30], [21, 30],
      // between SW/SE buildings and garden
      [10, 36], [15, 36], [9, 45], [16, 45],
      // corners / north
      [0, 6], [25, 6], [0, 12], [25, 12], [0, 45], [25, 45], [0, 58], [25, 58],
    ];
    const bushes = [[5, 17], [20, 17], [5, 32], [20, 32], [11, 17], [14, 17]];
    const flowers = [
      [5, 19, P.flower3], [19, 19, P.flower3], [6, 30, P.flower1],
      [18, 30, P.flower1], [11, 31, P.flower2], [14, 31, P.flower2],
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
            @keyframes forinEmotePop { 0% {transform:translateX(-30%) scale(0)} 70% {transform:translateX(-30%) scale(1.15)} 100% {transform:translateX(-30%) scale(1)} }
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

            {/* clock tower — center of the Healing Garden (new 2.5D, scaled down) */}
            <div style={{ position: 'absolute', left: 150, top: 250, transform: 'scale(0.58)', transformOrigin: 'top left' }}>
              <window.ClockTower2D/>
            </div>
            {/* statue beside the fountain */}
            <Statue x={15} y={24}/>

            {/* helipad on the Main Medical Tower roof */}
            <Helipad x={11.5} y={4}/>

            {/* trees */}
            {trees.map(([x, y], i) => <Tree key={`t${i}`} x={x} y={y} big={i % 4 === 0}/>)}
            {bushes.map(([x, y], i) => <Bush key={`b${i}`} x={x} y={y}/>)}
            {flowers.map(([x, y, c], i) => <Flowers key={`f${i}`} x={x} y={y} c={c}/>)}

            {/* benches around the garden */}
            <Bench x={6}  y={20}/>
            <Bench x={18} y={20}/>
            <Bench x={6}  y={28}/>
            <Bench x={18} y={28}/>

            {/* streetlamps — garden corners + gate road + service road */}
            <Streetlamp x={4}  y={18}/>
            <Streetlamp x={20} y={18}/>
            <Streetlamp x={4}  y={31}/>
            <Streetlamp x={20} y={31}/>
            <Streetlamp x={2}  y={47}/>
            <Streetlamp x={24} y={47}/>
            <Streetlamp x={2}  y={1}/>
            <Streetlamp x={24} y={1}/>

            {/* trash + recycle bins (gate sidewalk) */}
            <TrashCan x={9}  y={47} color="#16A34A"/>
            <TrashCan x={10} y={47} color="#1E40AF"/>
            <TrashCan x={15} y={47} color="#16A34A"/>

            {/* mailbox + hydrants on sidewalks */}
            <Mailbox x={16} y={47}/>
            <Hydrant x={6}  y={47}/>
            <Hydrant x={19} y={47}/>
            <Hydrant x={6}  y={1}/>

            {/* bus stop at the south main gate */}
            <BusStop x={16} y={50}/>

            {/* picnic tables in the garden */}
            <PicnicTable x={9}  y={27}/>
            <PicnicTable x={15} y={29}/>

            {/* privacy hedge screening the backstage service road */}
            <Hedge x={8}  y={3.5} w={4}/>
            <Hedge x={14} y={3.5} w={4}/>

            {/* lavender/garden beds framing the garden */}
            <Hedge x={5}  y={31.5} w={3}/>
            <Hedge x={16} y={31.5} w={3}/>

            {/* ambulances + trucks on the north backstage service road */}
            <Ambulance x={2}  y={2}/>
            <Ambulance x={22} y={2}/>

            {/* shuttle buses + parked cars on the south gate road */}
            <Ambulance x={2} y={48}/>
            <ParkedCar x={5}  y={48} color="#FACC15"/>
            <ParkedCar x={7}  y={48} color="#3B82F6"/>
            <ParkedCar x={20} y={48} color="#EF4444"/>
            <ParkedCar x={22} y={48} color="#10B981"/>

            {/* bike racks near the gate forecourt */}
            <BikeRack x={6}  y={52}/>
            <BikeRack x={18} y={52}/>
            <Bench x={9}  y={52}/>
            <Bench x={15} y={52}/>

            {/* buildings — landmarks use the confirmed 2.5D buildings-v2 globals,
               positioned at the footprint's x,y (they render at 0,0 internally) */}
            {buildings.map((b, i) => {
              if (b.arch !== 'landmark') return <Building key={i} {...b}/>;
              const C = b.landmark === 'horizontal' ? window.MedCenterH2D
                : b.landmark === 'victorian' ? window.MedCenterV2D
                : b.landmark === 'curved' ? window.MedCenterC2D
                : window.MedCenter2D;
              return (
                <div key={i} onClick={b.onSelect} style={{ position: 'absolute', left: b.x * TILE, top: b.y * TILE, width: b.w * TILE, height: b.h * TILE, cursor: 'pointer' }}>
                  {b.landmark === 'victorian'
                    ? <div style={{ position: 'absolute', left: '50%', bottom: 0, transform: 'translateX(-50%) scale(1.5)', transformOrigin: 'bottom center' }}>
                        <div style={{ position: 'relative', width: b.w * TILE, height: b.h * TILE }}>
                          <C w={b.w} h={b.h} TILE={TILE} label={b.label} sign={b.sign} signColor={b.signColor}/>
                        </div>
                      </div>
                    : <C w={b.w} h={b.h} TILE={TILE} label={b.label} sign={b.sign} signColor={b.signColor}/>}
                </div>
              );
            })}

            {/* NPCs */}
            {npcs.map((n, i) => <NPC key={i} {...n}/>)}
            {/* Patrolling NPCs (isolated interval) */}
            <PatrolNPCs/>

            {/* Player */}
            <div style={{ position: 'absolute', left: pos.x * TILE - 4, top: pos.y * TILE - 16, animation: 'forinPlayerStep .6s ease-in-out infinite', transition: 'left .3s linear, top .3s linear' }}>
              <PlayerSprite dir={dir} walking={walking}/>
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
          <PixelDPad size={72} onMove={(d) => { step(d); }}/>
          <PixelIconButton bg={T.mint} size={52} fontSize={18}>A</PixelIconButton>
        </div>

        <ForinBottomNav active="campus"/>
      </div>
    );
  }

      window.ScreenExplore = ScreenExplore;
})();
