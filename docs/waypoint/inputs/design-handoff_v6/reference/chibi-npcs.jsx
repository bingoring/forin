// chibi-npcs.jsx — Unified RPG-style pixel character sprite.
// User character (IPlayer) and all NPCs share THIS base, so they all sit
// in the same visual world. Big head + short legs (cute chibi proportions).
//
// Canvas: 12 wide × 14 tall pixels (drawn 1px = 1 logical pixel).
// Layout:
//   row 0:   hair crown
//   row 1-2: hair + bangs
//   row 3-5: face (3 rows)
//   row 6:   chin
//   row 7-9: body (3 rows) — arms hang on sides
//   row 10:  body taper (waist)
//   row 11-12: legs (2 rows — SHORT, gives chibi look)
//   row 13:  shoes (1 row)
// Total displayed: 18 × 21 px.

(function () {
  const OUTLINE = '#1F1A14';

  // ───────────────────────────────────────────────────────────────────
  // RPGSprite — the single source of truth for a forin character.
  // ───────────────────────────────────────────────────────────────────
  // props:
  //   hair         — primary hair color (hex)
  //   hairLt       — optional lighter hair highlight; auto if omitted
  //   hairStyle    — 'short' | 'bob' | 'long' | 'pigtails' | 'bun'
  //                | 'mohawk' | 'curly' | 'bald' | 'cap' | 'peakedCap'
  //   skin         — skin base color (default warm fair)
  //   skinSh       — face shading; auto-derived if omitted
  //   shirt        — chest fill (= outfit)
  //   shirtDk      — outfit shadow; auto-derived if omitted
  //   leg          — leg fill (= pants)
  //   shoe         — shoe color (default dark brown)
  //   hatTone      — base color of hat overlay (when hairStyle is cap/peakedCap)
  //   hatTrim      — accent stripe on cap
  //   chestCross   — boolean: red cross on chest (player iconic)
  //   chestMark    — element rendered on chest (overrides chestCross)
  //   propEl       — extra SVG element drawn last (stethoscope, mask, etc.)
  //   bob          — boolean: idle bob animation (default false)
  //   tag          — optional small label above ('YOU' etc.)
  function RPGSprite({
    hair = '#3C2A18',
    hairLt,
    hairStyle = 'short',
    skin = '#F8D7B2',
    skinSh,
    shirt = '#A7F3D0',
    shirtDk,
    leg = '#3F3D52',
    shoe = '#2A1B0E',
    hatTone,
    hatTrim,
    chestCross = false,
    chestMark,
    propEl,
    bob = false,
    tag,
    width = 18,
  }) {
    // Auto-derived shading colors when not provided
    hairLt   = hairLt   || mix(hair, '#FFFFFF', 0.18);
    skinSh   = skinSh   || mix(skin, OUTLINE,  0.22);
    shirtDk  = shirtDk  || mix(shirt, OUTLINE, 0.30);
    const legDk  = mix(leg, OUTLINE, 0.30);
    const shoeLt = mix(shoe, '#FFFFFF', 0.20);

    const height = width * (14 / 12);

    // Hair geometry — rows 0..5 painted differently per style.
    // We draw skin face first (rows 3-6), then hair on top per style.
    // Side-hair extension (down past face) is controlled by `sides` flag.
    const H = hair;
    const HL = hairLt;

    // Per-style hair plates
    const HairPlate = (() => {
      switch (hairStyle) {
        case 'short':
          return (
            <g>
              {/* crown */}
              <rect x="4" y="0" width="4" height="1" fill={H}/>
              {/* main cap rows */}
              <rect x="3" y="1" width="6" height="1" fill={H}/>
              <rect x="2" y="2" width="8" height="1" fill={H}/>
              {/* bangs over forehead */}
              <rect x="2" y="3" width="2" height="1" fill={H}/>
              <rect x="8" y="3" width="2" height="1" fill={H}/>
              <rect x="3" y="3" width="1" height="1" fill={HL}/>
              {/* highlight */}
              <rect x="4" y="1" width="3" height="1" fill={HL}/>
            </g>
          );
        case 'bob':
          return (
            <g>
              <rect x="3" y="0" width="6" height="1" fill={H}/>
              <rect x="2" y="1" width="8" height="2" fill={H}/>
              {/* sides reach down to jaw */}
              <rect x="2" y="3" width="1" height="3" fill={H}/>
              <rect x="9" y="3" width="1" height="3" fill={H}/>
              {/* bangs */}
              <rect x="3" y="3" width="2" height="1" fill={H}/>
              <rect x="7" y="3" width="2" height="1" fill={H}/>
              <rect x="3" y="1" width="4" height="1" fill={HL}/>
            </g>
          );
        case 'long':
          return (
            <g>
              <rect x="3" y="0" width="6" height="1" fill={H}/>
              <rect x="2" y="1" width="8" height="2" fill={H}/>
              {/* long sides extend past shoulders */}
              <rect x="1" y="3" width="2" height="7" fill={H}/>
              <rect x="9" y="3" width="2" height="7" fill={H}/>
              {/* bangs partial */}
              <rect x="3" y="3" width="2" height="1" fill={H}/>
              <rect x="7" y="3" width="2" height="1" fill={H}/>
              <rect x="3" y="1" width="4" height="1" fill={HL}/>
              {/* hair ends taper */}
              <rect x="1" y="10" width="1" height="1" fill={mix(H, OUTLINE, 0.4)}/>
              <rect x="10" y="10" width="1" height="1" fill={mix(H, OUTLINE, 0.4)}/>
            </g>
          );
        case 'pigtails':
          return (
            <g>
              <rect x="3" y="0" width="6" height="1" fill={H}/>
              <rect x="2" y="1" width="8" height="2" fill={H}/>
              <rect x="2" y="3" width="1" height="2" fill={H}/>
              <rect x="9" y="3" width="1" height="2" fill={H}/>
              <rect x="3" y="3" width="2" height="1" fill={H}/>
              <rect x="7" y="3" width="2" height="1" fill={H}/>
              <rect x="3" y="1" width="4" height="1" fill={HL}/>
              {/* pigtails — small puffs sticking out at ear level */}
              <rect x="0" y="3" width="2" height="3" fill={H}/>
              <rect x="10" y="3" width="2" height="3" fill={H}/>
              <rect x="0" y="3" width="1" height="1" fill={HL}/>
              <rect x="10" y="3" width="1" height="1" fill={HL}/>
              {/* ties */}
              <rect x="0" y="6" width="2" height="1" fill="#EF4444"/>
              <rect x="10" y="6" width="2" height="1" fill="#EF4444"/>
            </g>
          );
        case 'bun':
          return (
            <g>
              <rect x="3" y="0" width="6" height="1" fill={H}/>
              <rect x="2" y="1" width="8" height="2" fill={H}/>
              <rect x="2" y="3" width="1" height="1" fill={H}/>
              <rect x="9" y="3" width="1" height="1" fill={H}/>
              <rect x="3" y="3" width="2" height="1" fill={H}/>
              <rect x="7" y="3" width="2" height="1" fill={H}/>
              <rect x="3" y="1" width="4" height="1" fill={HL}/>
              {/* bun on top */}
              <rect x="4" y="-1" width="4" height="1" fill={H}/>
              <rect x="3" y="-2" width="6" height="1" fill={H}/>
              <rect x="4" y="-2" width="3" height="1" fill={HL}/>
            </g>
          );
        case 'mohawk':
          return (
            <g>
              {/* shaved sides — just a thin strip */}
              <rect x="2" y="2" width="8" height="1" fill={mix(skin, OUTLINE, 0.15)}/>
              {/* mohawk strip */}
              <rect x="5" y="-1" width="2" height="1" fill={H}/>
              <rect x="4" y="0" width="4" height="1" fill={H}/>
              <rect x="4" y="1" width="4" height="2" fill={H}/>
              <rect x="4" y="0" width="2" height="1" fill={HL}/>
            </g>
          );
        case 'curly':
          return (
            <g>
              {/* bumpy crown of curls */}
              <rect x="3" y="0" width="2" height="1" fill={H}/>
              <rect x="6" y="0" width="2" height="1" fill={H}/>
              <rect x="2" y="1" width="8" height="2" fill={H}/>
              <rect x="1" y="2" width="2" height="1" fill={H}/>
              <rect x="9" y="2" width="2" height="1" fill={H}/>
              <rect x="2" y="3" width="1" height="2" fill={H}/>
              <rect x="9" y="3" width="1" height="2" fill={H}/>
              <rect x="3" y="3" width="2" height="1" fill={H}/>
              <rect x="7" y="3" width="2" height="1" fill={H}/>
              {/* curl highlights */}
              <rect x="3" y="0" width="1" height="1" fill={HL}/>
              <rect x="6" y="0" width="1" height="1" fill={HL}/>
              <rect x="3" y="2" width="1" height="1" fill={HL}/>
            </g>
          );
        case 'bald':
          return (
            <g>
              {/* skin only — head crown is skin color */}
              <rect x="4" y="0" width="4" height="1" fill={skin}/>
              <rect x="3" y="1" width="6" height="2" fill={skin}/>
              {/* small hair fringe on sides */}
              <rect x="2" y="2" width="1" height="1" fill={H}/>
              <rect x="9" y="2" width="1" height="1" fill={H}/>
              <rect x="2" y="3" width="1" height="1" fill={H}/>
              <rect x="9" y="3" width="1" height="1" fill={H}/>
            </g>
          );
        case 'cap':
          // Surgical / scrub cap — solid color overlay with trim band.
          return (
            <g>
              <rect x="3" y="0" width="6" height="1" fill={hatTone}/>
              <rect x="2" y="1" width="8" height="2" fill={hatTone}/>
              {/* trim band along bottom edge of cap */}
              {hatTrim && <rect x="2" y="3" width="8" height="1" fill={hatTrim}/>}
              {/* highlight */}
              <rect x="3" y="1" width="5" height="1" fill={mix(hatTone, '#FFFFFF', 0.25)}/>
              {/* a small wisp of hair peeking */}
              <rect x="2" y="3.5" width="1" height="0.6" fill={H}/>
              <rect x="9" y="3.5" width="1" height="0.6" fill={H}/>
            </g>
          );
        case 'peakedCap':
          // Police / paramedic peaked cap.
          return (
            <g>
              <rect x="3" y="1" width="6" height="1" fill={hatTone}/>
              <rect x="2" y="2" width="8" height="2" fill={hatTone}/>
              {/* visor */}
              <rect x="1" y="3.5" width="10" height="1" fill={mix(hatTone, OUTLINE, 0.4)}/>
              {/* gold trim / badge */}
              {hatTrim && <rect x="5" y="2" width="2" height="1" fill={hatTrim}/>}
              <rect x="3" y="2" width="2" height="1" fill={mix(hatTone, '#FFFFFF', 0.25)}/>
            </g>
          );
        default:
          return null;
      }
    })();

    const style = bob ? { animation: 'forinSpriteBob .8s ease-in-out infinite' } : null;

    return (
      <div style={{ position: 'relative', width, height, ...(style || {}) }}>
        <svg viewBox="0 0 12 14" width={width} height={height} shapeRendering="crispEdges"
             style={{ display: 'block', overflow: 'visible', filter: 'drop-shadow(1px 1.5px 0 rgba(0,0,0,.22))' }}>
          {/* ═══════════════════════ FACE ═══════════════════════ */}
          {/* face shape (3 rows of skin) */}
          <rect x="3" y="3" width="6" height="3" fill={skin}/>
          {/* chin (row 6 narrower) */}
          <rect x="4" y="6" width="4" height="1" fill={skin}/>
          {/* face shading on right side */}
          <rect x="7" y="4" width="1" height="2" fill={skinSh}/>
          <rect x="7" y="6" width="1" height="1" fill={skinSh}/>

          {/* face outline */}
          <rect x="2" y="3" width="1" height="3" fill={OUTLINE}/>
          <rect x="9" y="3" width="1" height="3" fill={OUTLINE}/>
          <rect x="3" y="6" width="1" height="1" fill={OUTLINE}/>
          <rect x="8" y="6" width="1" height="1" fill={OUTLINE}/>
          <rect x="4" y="7" width="4" height="1" fill={OUTLINE}/>

          {/* ═══════════════════════ HAIR ═══════════════════════ */}
          {HairPlate}

          {/* ═══════════════════════ EYES ═══════════════════════ */}
          <rect x="4" y="4" width="1" height="1" fill={OUTLINE}/>
          <rect x="7" y="4" width="1" height="1" fill={OUTLINE}/>
          {/* cheek blush */}
          <rect x="3" y="5" width="1" height="1" fill="#F9A8B4" opacity="0.6"/>
          <rect x="8" y="5" width="1" height="1" fill="#F9A8B4" opacity="0.6"/>
          {/* tiny mouth */}
          <rect x="5" y="6" width="2" height="0.5" fill={OUTLINE} opacity="0.75"/>

          {/* ═══════════════════════ BODY ═══════════════════════ */}
          {/* shoulder/neck transition */}
          <rect x="4" y="7" width="4" height="1" fill={shirt}/>
          {/* main torso (rows 8-10) */}
          <rect x="3" y="8" width="6" height="3" fill={shirt}/>
          {/* body shadow on right */}
          <rect x="7" y="8" width="1" height="3" fill={shirtDk}/>
          {/* arms (1px on each side) */}
          <rect x="2" y="8" width="1" height="2" fill={shirt}/>
          <rect x="9" y="8" width="1" height="2" fill={shirt}/>
          {/* hands */}
          <rect x="2" y="10" width="1" height="1" fill={skin}/>
          <rect x="9" y="10" width="1" height="1" fill={skin}/>
          {/* body outline */}
          <rect x="1" y="8" width="1" height="2" fill={OUTLINE}/>
          <rect x="10" y="8" width="1" height="2" fill={OUTLINE}/>
          <rect x="1" y="10" width="1" height="1" fill={OUTLINE}/>
          <rect x="10" y="10" width="1" height="1" fill={OUTLINE}/>
          <rect x="2" y="11" width="1" height="1" fill={OUTLINE}/>
          <rect x="9" y="11" width="1" height="1" fill={OUTLINE}/>
          <rect x="3" y="11" width="6" height="1" fill={shirtDk}/>

          {/* chest marker */}
          {chestMark}
          {chestCross && (
            <g>
              <rect x="5" y="8.5" width="2" height="2" fill="#EF4444"/>
              <rect x="4" y="9" width="4" height="1" fill="#EF4444"/>
            </g>
          )}

          {/* ═══════════════════════ LEGS (SHORT) ═══════════════════════ */}
          {/* row 11-12: 2 rows of legs */}
          <rect x="3" y="11" width="2" height="1" fill={leg}/>
          <rect x="6" y="11" width="2" height="1" fill={leg}/>
          <rect x="3" y="12" width="2" height="1" fill={leg}/>
          <rect x="6" y="12" width="2" height="1" fill={leg}/>
          {/* leg shadow */}
          <rect x="4" y="12" width="1" height="1" fill={legDk}/>
          <rect x="7" y="12" width="1" height="1" fill={legDk}/>
          {/* leg outline */}
          <rect x="2" y="11" width="1" height="2" fill={OUTLINE}/>
          <rect x="5" y="11" width="1" height="2" fill={OUTLINE}/>
          <rect x="8" y="11" width="1" height="2" fill={OUTLINE}/>

          {/* ═══════════════════════ SHOES ═══════════════════════ */}
          <rect x="2" y="13" width="3" height="1" fill={shoe}/>
          <rect x="6" y="13" width="3" height="1" fill={shoe}/>
          <rect x="2" y="13" width="1" height="0.4" fill={shoeLt}/>
          <rect x="6" y="13" width="1" height="0.4" fill={shoeLt}/>

          {/* ground shadow ellipse just below shoes */}
          <ellipse cx="6" cy="14" rx="3.5" ry="0.4" fill="#000" opacity="0.22"/>

          {/* extras (stethoscope, mask, etc.) */}
          {propEl}
        </svg>

        {tag && (
          <div style={{
            position: 'absolute', left: '50%', top: -10, transform: 'translateX(-50%)',
            background: '#fff', border: `1.5px solid ${OUTLINE}`,
            fontFamily: '"DungGeunMo",monospace', fontSize: 6, padding: '1px 3px',
            whiteSpace: 'nowrap', color: OUTLINE,
            boxShadow: `1.5px 1.5px 0 0 ${OUTLINE}`,
          }}>{tag}</div>
        )}
      </div>
    );
  }

  // ───────────────────────────────────────────────────────────────────
  // Palette + helpers
  // ───────────────────────────────────────────────────────────────────
  const HAIR_VARIANTS = [
    '#1F2937', // black
    '#3C2A18', // very dark brown
    '#5C3A1A', // dark brown
    '#7C3F00', // medium brown
    '#9A6B3F', // light brown
    '#C28E5C', // dirty blonde
    '#E2B16B', // blonde
    '#FACC15', // bright blonde
    '#EF4444', // red/ginger
    '#B45309', // auburn
    '#D1D5DB', // silver/gray (elderly)
    '#A78BFA', // dyed purple (fun)
    '#22D3EE', // dyed cyan (fun)
  ];
  const SKIN_VARIANTS = [
    '#FCE5C8', // very fair
    '#F8D7B2', // fair
    '#E9BE93', // tan
    '#C99066', // medium
    '#9A6B45', // deeper
  ];
  const HAIRSTYLES_FEMME = ['bob', 'long', 'pigtails', 'bun', 'curly', 'short'];
  const HAIRSTYLES_MASC  = ['short', 'short', 'curly', 'mohawk', 'bald', 'bob'];

  // Deterministic hash from x,y so the same NPC stays the same across renders.
  function hash(x, y, salt = 0) {
    const v = Math.floor((x * 73856093) ^ (y * 19349663) ^ (salt * 83492791));
    return Math.abs(v);
  }
  function pick(arr, h) { return arr[h % arr.length]; }
  function mix(a, b, t) {
    const p = h => [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)];
    const [ar,ag,ab] = p(a), [br,bg,bb] = p(b);
    const r = Math.round(ar + (br-ar)*t);
    const g = Math.round(ag + (bg-ag)*t);
    const bl = Math.round(ab + (bb-ab)*t);
    return '#' + [r,g,bl].map(v => v.toString(16).padStart(2,'0')).join('');
  }

  // ───────────────────────────────────────────────────────────────────
  // Role presets
  // ───────────────────────────────────────────────────────────────────
  // Each takes x,y,hair (override),shirt,seed and chooses a hairstyle +
  // skin tone deterministically.

  function ChibiNurse({ x = 0, y = 0, hair, shirt = '#A7F3D0', size = 18 }) {
    const h = hash(x, y, 1);
    const usedHair = hair || pick(HAIR_VARIANTS, h);
    const style = pick(HAIRSTYLES_FEMME, h >> 3);
    const skin  = pick(SKIN_VARIANTS, h >> 5);
    return (
      <RPGSprite
        width={size}
        hair={usedHair} hairStyle={style}
        skin={skin}
        shirt={shirt} leg="#FFFFFF" shoe="#1F2937"
        chestMark={<g>
          <rect x="4" y="9" width="4" height="0.6" fill="#EF4444"/>
          <rect x="5.7" y="8.2" width="0.6" height="2" fill="#EF4444"/>
        </g>}
      />
    );
  }

  function ChibiDoctor({ x = 0, y = 0, hair, size = 18 }) {
    const h = hash(x, y, 2);
    const usedHair = hair || pick(HAIR_VARIANTS, h);
    const style = pick(['short', 'bob', 'curly', 'short'], h >> 3);
    const skin  = pick(SKIN_VARIANTS, h >> 5);
    return (
      <RPGSprite
        width={size}
        hair={usedHair} hairStyle={style}
        skin={skin}
        shirt="#FFFFFF" shirtDk="#B0B5BD"
        leg="#475569" shoe="#1F2937"
        propEl={
          <g>
            {/* stethoscope around neck */}
            <rect x="4" y="7.5" width="4" height="0.5" fill="#1F2937"/>
            <rect x="5.5" y="8" width="1" height="1" fill="#1F2937"/>
            {/* breast-pocket pen */}
            <rect x="3" y="8" width="0.6" height="1.4" fill="#EF4444"/>
          </g>
        }
      />
    );
  }

  function ChibiSurgeon({ x = 0, y = 0, hair, size = 18 }) {
    const h = hash(x, y, 3);
    const skin  = pick(SKIN_VARIANTS, h >> 5);
    return (
      <RPGSprite
        width={size}
        hair={hair || '#3C2A18'} hairStyle="cap"
        hatTone="#A8DCEC" hatTrim="#5E8FA8"
        skin={skin}
        shirt="#A8DCEC" shirtDk="#5E8FA8"
        leg="#A8DCEC" shoe="#FFFFFF"
        propEl={
          <g>
            {/* surgical mask covering mouth + lower face */}
            <rect x="3" y="5" width="6" height="2" fill="#FFFFFF"/>
            <rect x="3" y="5" width="6" height="0.4" fill="#E5E7EB"/>
            <rect x="3" y="5" width="1" height="2" fill={OUTLINE} opacity="0.5"/>
            <rect x="8" y="5" width="1" height="2" fill={OUTLINE} opacity="0.5"/>
          </g>
        }
      />
    );
  }

  function ChibiParamedic({ x = 0, y = 0, hair, size = 18 }) {
    const h = hash(x, y, 4);
    const usedHair = hair || pick(HAIR_VARIANTS, h);
    const skin  = pick(SKIN_VARIANTS, h >> 5);
    return (
      <RPGSprite
        width={size}
        hair={usedHair} hairStyle="peakedCap"
        hatTone="#0F172A" hatTrim="#FACC15"
        skin={skin}
        shirt="#FACC15" shirtDk="#CA8A04"
        leg="#1F2937" shoe="#0F172A"
        chestMark={<rect x="4.5" y="9" width="3" height="0.5" fill="#1F2937"/>}
        propEl={<rect x="9" y="8.5" width="1" height="1" fill="#1F2937"/>}
      />
    );
  }

  function ChibiPolice({ x = 0, y = 0, hair, size = 18 }) {
    const h = hash(x, y, 5);
    const skin  = pick(SKIN_VARIANTS, h >> 5);
    return (
      <RPGSprite
        width={size}
        hair={hair || '#1F2937'} hairStyle="peakedCap"
        hatTone="#1E3A8A" hatTrim="#FACC15"
        skin={skin}
        shirt="#1E3A8A" shirtDk="#0F172A"
        leg="#1E3A8A" shoe="#0F172A"
        chestMark={<g>
          <rect x="4.5" y="8.5" width="3" height="0.8" fill="#FACC15"/>
          <rect x="5.5" y="8.5" width="1" height="2" fill="#0F172A"/>
        </g>}
      />
    );
  }

  function ChibiPatient({ x = 0, y = 0, hair, size = 18 }) {
    const h = hash(x, y, 6);
    const usedHair = hair || pick(HAIR_VARIANTS, h);
    const style = pick(['short', 'bob', 'long', 'curly', 'bald'], h >> 3);
    const skin  = pick(SKIN_VARIANTS, h >> 5);
    return (
      <RPGSprite
        width={size}
        hair={usedHair} hairStyle={style}
        skin={skin}
        shirt="#FED7AA" shirtDk="#C99066"
        leg="#FED7AA" shoe="#FCE5C8"
        chestMark={<rect x="4.5" y="8.3" width="3" height="0.4" fill="#C99066"/>}
      />
    );
  }

  function ChibiChild({ x = 0, y = 0, hair, size = 16 }) {
    // Slightly smaller, brighter outfits
    const h = hash(x, y, 7);
    const usedHair = hair || pick(HAIR_VARIANTS, h);
    const style = pick(['short', 'pigtails', 'bob', 'curly', 'mohawk'], h >> 3);
    const skin  = pick(SKIN_VARIANTS, h >> 5);
    const outfit = pick(['#FBCFE8','#FDE68A','#A7F3D0','#BAE6FD','#FCA5A5','#DDD6FE'], h >> 7);
    const pants  = pick(['#3F2A18','#1E40AF','#7C2D12','#4338CA'], h >> 9);
    return (
      <RPGSprite
        width={size}
        hair={usedHair} hairStyle={style}
        skin={skin}
        shirt={outfit} leg={pants} shoe="#1F2937"
      />
    );
  }

  function ChibiParent({ x = 0, y = 0, hair, size = 18 }) {
    const h = hash(x, y, 8);
    const usedHair = hair || pick(HAIR_VARIANTS, h);
    const style = pick(['bob', 'long', 'short', 'bun', 'curly', 'short'], h >> 3);
    const skin  = pick(SKIN_VARIANTS, h >> 5);
    const outfit = pick(['#FBCFE8','#7DD3FC','#A78BFA','#FCA5A5','#BBF7D0','#94A3B8'], h >> 7);
    const pants  = pick(['#3F2A18','#1E40AF','#52525B'], h >> 9);
    return (
      <RPGSprite
        width={size}
        hair={usedHair} hairStyle={style}
        skin={skin}
        shirt={outfit} leg={pants} shoe="#2A1B0E"
      />
    );
  }

  function ChibiVisitor({ x = 0, y = 0, hair, size = 18 }) {
    const h = hash(x, y, 9);
    const usedHair = hair || pick(HAIR_VARIANTS, h);
    const style = pick(['short', 'bob', 'long', 'curly', 'bald', 'short'], h >> 3);
    const skin  = pick(SKIN_VARIANTS, h >> 5);
    const outfit = pick(['#A78BFA','#0EA5E9','#94A3B8','#F59E0B','#65A30D','#9333EA'], h >> 7);
    const pants  = pick(['#3F2A18','#1E3A8A','#52525B','#27272A'], h >> 9);
    return (
      <RPGSprite
        width={size}
        hair={usedHair} hairStyle={style}
        skin={skin}
        shirt={outfit} leg={pants} shoe="#2A1B0E"
      />
    );
  }

  function ChibiPharmacist({ x = 0, y = 0, hair, size = 18 }) {
    const h = hash(x, y, 10);
    const usedHair = hair || pick(HAIR_VARIANTS, h);
    const style = pick(['short', 'bob', 'bun', 'curly'], h >> 3);
    const skin  = pick(SKIN_VARIANTS, h >> 5);
    return (
      <RPGSprite
        width={size}
        hair={usedHair} hairStyle={style}
        skin={skin}
        shirt="#FFFFFF" shirtDk="#B0B5BD"
        leg="#475569" shoe="#1F2937"
        chestMark={<rect x="4.5" y="8.5" width="3" height="1" fill="#10B981"/>}
      />
    );
  }

  // ───────────────────────────────────────────────────────────────────
  // The player (user character) — iconic nurse-cap + mint scrubs + red cross
  // ───────────────────────────────────────────────────────────────────
  function ChibiPlayer({ size = 18, tag = 'YOU' }) {
    return (
      <RPGSprite
        width={size}
        hair="#3C2A18" hairStyle="cap"
        hatTone="#FFFFFF" hatTrim="#EF4444"
        skin="#FCE5C8"
        shirt="#A7F3D0" shirtDk="#4FC79D"
        leg="#3F3D52" shoe="#1F2937"
        chestCross
        tag={tag}
      />
    );
  }

  // ───────────────────────────────────────────────────────────────────
  // INpcV2 — the placement wrapper that interior-shared.jsx delegates to.
  // ───────────────────────────────────────────────────────────────────
  function INpcV2({ x, y, kind = 'nurse', shirt, hair, size }) {
    const T = window.ITILE || 16;
    const SIZE = size || 18;
    const map = {
      nurse:      <ChibiNurse      x={x} y={y} hair={hair} shirt={shirt} size={SIZE}/>,
      doctor:     <ChibiDoctor     x={x} y={y} hair={hair} size={SIZE}/>,
      surgeon:    <ChibiSurgeon    x={x} y={y} hair={hair} size={SIZE}/>,
      paramedic:  <ChibiParamedic  x={x} y={y} hair={hair} size={SIZE}/>,
      police:     <ChibiPolice     x={x} y={y} hair={hair} size={SIZE}/>,
      patient:    <ChibiPatient    x={x} y={y} hair={hair} size={SIZE}/>,
      parent:     <ChibiParent     x={x} y={y} hair={hair} size={SIZE}/>,
      child:      <ChibiChild      x={x} y={y} hair={hair} size={SIZE - 2}/>,
      visitor:    <ChibiVisitor    x={x} y={y} hair={hair} size={SIZE}/>,
      pharmacist: <ChibiPharmacist x={x} y={y} hair={hair} size={SIZE}/>,
    };
    return (
      <div style={{
        position: 'absolute',
        left: x * T - 1,
        top:  y * T - 6,
        zIndex: 4,
      }}>
        {map[kind] || map.nurse}
      </div>
    );
  }

  // ChibiBase legacy alias — kept so existing imports still resolve.
  const ChibiBase = RPGSprite;

  Object.assign(window, {
    RPGSprite,
    ChibiBase,
    ChibiNurse, ChibiDoctor, ChibiSurgeon, ChibiParamedic, ChibiPolice,
    ChibiPatient, ChibiChild, ChibiParent, ChibiVisitor, ChibiPharmacist,
    ChibiPlayer,
    INpcV2,
  });
})();
