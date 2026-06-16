// forin-npcs-smooth.jsx — Smooth (non-pixel) version of the forin NPCs.
//
// Mirrors chibi-npcs.jsx 1:1 (same roles, same hair/skin palette, same
// deterministic x,y variation, same INpc-style wrapper) but rendered as
// soft rounded vector art instead of hard pixels. Keeps the top-heavy
// "가분수" chibi proportions: a big round head over a small body + short legs.
//
// Pixel NPCs are NOT removed — these live alongside them under the
// `Smooth*` names and `window.Forin.Smooth*`.
//
// ViewBox is 64 × 80 (w:h = 4:5). Head fills the upper ~55%.

(function () {
  const INK = '#3A2E26';                 // soft dark brown outline (not pure black)

  function mix(a, b, t) {
    const p = h => [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)];
    const [ar,ag,ab] = p(a), [br,bg,bb] = p(b);
    const r = Math.round(ar + (br-ar)*t);
    const g = Math.round(ag + (bg-ag)*t);
    const bl = Math.round(ab + (bb-ab)*t);
    return '#' + [r,g,bl].map(v => v.toString(16).padStart(2,'0')).join('');
  }

  // ───────────────────────────────────────────────────────────────────
  // SmoothSprite — soft vector character. Same prop surface as RPGSprite.
  // ───────────────────────────────────────────────────────────────────
  function SmoothSprite({
    hair = '#3C2A18',
    hairStyle = 'short',
    skin = '#F8D7B2',
    shirt = '#A7F3D0',
    shirtDk,
    leg = '#3F3D52',
    shoe = '#2A1B0E',
    hatTone,
    hatTrim,
    chestCross = false,
    chestMark,
    expression = 'neutral',
    mask = false,
    width = 40,
    tag,
    bob = false,
    dir = 'down',
    walking = false,
    style,
  }) {
    const H   = hair;
    const HL  = mix(hair, '#FFFFFF', 0.22);
    const HD  = mix(hair, INK, 0.30);
    const sh  = mix(skin, '#C98A5E', 0.30);   // skin shadow
    const slo = mix(skin, INK, 0.35);          // skin outline
    shirtDk   = shirtDk || mix(shirt, INK, 0.28);
    const legDk = mix(leg, INK, 0.30);
    const height = width * 80 / 64;

    // Head geometry: center (32, 26), rx 22, ry 21.
    const HX = 32, HY = 26, HRX = 22, HRY = 21;

    // ── Hair plates (drawn behind + over the head) ──
    function hairBack() {
      switch (hairStyle) {
        case 'long':
          return <path d="M8 22 Q6 50 12 60 L18 58 Q15 38 17 24 Z M56 22 Q58 50 52 60 L46 58 Q49 38 47 24 Z" fill={HD}/>;
        case 'bob':
          return <path d="M9 24 Q8 44 14 50 L18 48 Q15 34 16 24 Z M55 24 Q56 44 50 50 L46 48 Q49 34 48 24 Z" fill={HD}/>;
        case 'pigtails':
          return (
            <g>
              <ellipse cx="9" cy="34" rx="7" ry="9" fill={H}/>
              <ellipse cx="55" cy="34" rx="7" ry="9" fill={H}/>
              <ellipse cx="8" cy="31" rx="2.5" ry="3" fill={HL}/>
              <ellipse cx="54" cy="31" rx="2.5" ry="3" fill={HL}/>
            </g>
          );
        default:
          return null;
      }
    }
    function hairFront() {
      switch (hairStyle) {
        case 'bald':
          return (
            <g>
              {/* faint side fringe only */}
              <path d={`M12 28 Q11 20 18 16`} fill="none" stroke={H} strokeWidth="3" strokeLinecap="round"/>
              <path d={`M52 28 Q53 20 46 16`} fill="none" stroke={H} strokeWidth="3" strokeLinecap="round"/>
            </g>
          );
        case 'cap':
          return (
            <g>
              {/* SOLID dome — one filled shape from brim line up over the crown,
                 no inner cut-out, so zero scalp shows. Head spans x 8-56. */}
              <path d="M8 21 Q6 1 32 0 Q58 1 56 21 Q32 26 8 21 Z" fill={hatTone}/>
              {/* highlight sweep */}
              <path d="M13 11 Q32 3 51 11" fill="none" stroke={mix(hatTone,'#FFFFFF',0.3)} strokeWidth="2.5" strokeLinecap="round"/>
              {/* trim band hugging the brim */}
              {hatTrim && <path d="M8 21 Q32 26 56 21" fill="none" stroke={hatTrim} strokeWidth="3.5" strokeLinecap="round"/>}
              {hatTrim === '#EF4444' && (
                <g>
                  <rect x="29.5" y="5" width="5" height="10" rx="1" fill="#EF4444"/>
                  <rect x="27" y="8" width="10" height="4" rx="1" fill="#EF4444"/>
                </g>
              )}
            </g>
          );
        case 'peakedCap':
          return (
            <g>
              {/* SOLID crown — brim just above the eyes */}
              <path d="M9 21 Q7 1 32 0 Q57 1 55 21 Q32 25 9 21 Z" fill={hatTone}/>
              {/* visor projecting forward, just over the brow */}
              <path d="M5 21 Q32 16 59 21 L57 26 Q32 21 7 26 Z" fill={mix(hatTone, INK, 0.35)}/>
              {hatTrim && <ellipse cx="32" cy="12" rx="4" ry="3" fill={hatTrim}/>}
            </g>
          );
        case 'bun':
          return (
            <g>
              <ellipse cx="32" cy="6" rx="7" ry="6" fill={H}/>
              <ellipse cx="30" cy="4.5" rx="2.5" ry="2" fill={HL}/>
              <path d="M11 26 Q12 8 32 6 Q52 8 53 26 Q50 15 32 13 Q14 15 11 26 Z" fill={H}/>
              <path d="M16 16 Q32 8 48 16" fill="none" stroke={HL} strokeWidth="2" strokeLinecap="round"/>
            </g>
          );
        case 'curly':
          return (
            <g>
              {[ [14,16,7],[24,9,8],[36,9,8],[48,15,7],[12,26,6],[52,26,6] ].map((c,i)=>
                <circle key={i} cx={c[0]} cy={c[1]} r={c[2]} fill={H}/>)}
              {[ [22,8,3],[36,8,3],[13,22,2.5] ].map((c,i)=>
                <circle key={'h'+i} cx={c[0]} cy={c[1]} r={c[2]} fill={HL}/>)}
            </g>
          );
        case 'long':
          return (
            <g>
              <path d="M11 26 Q12 4 32 4 Q52 4 53 26 Q48 14 38 13 Q40 18 36 20 Q32 12 28 20 Q24 18 26 13 Q16 14 11 26 Z" fill={H}/>
              <path d="M18 14 Q28 7 40 11" fill="none" stroke={HL} strokeWidth="2.5" strokeLinecap="round"/>
            </g>
          );
        case 'bob':
          return (
            <g>
              <path d="M10 28 Q10 4 32 4 Q54 4 54 28 Q50 14 40 13 Q42 19 37 21 Q32 13 27 21 Q22 19 24 13 Q14 14 10 28 Z" fill={H}/>
              <path d="M18 13 Q30 7 42 12" fill="none" stroke={HL} strokeWidth="2.5" strokeLinecap="round"/>
            </g>
          );
        case 'pigtails':
          return (
            <g>
              <path d="M12 24 Q14 6 32 6 Q50 6 52 24 Q46 14 38 13 Q40 18 36 20 Q32 13 28 20 Q24 18 26 13 Q18 14 12 24 Z" fill={H}/>
              <path d="M18 14 Q30 8 40 12" fill="none" stroke={HL} strokeWidth="2" strokeLinecap="round"/>
            </g>
          );
        case 'mohawk':
          return (
            <g>
              {/* shaved sides hinted, tall center strip */}
              <path d="M27 2 Q32 -2 37 2 L36 18 Q32 15 28 18 Z" fill={H}/>
              <path d="M29 3 Q32 1 33 4 L32.5 14 Q31 13 30 14 Z" fill={HL}/>
              <path d="M14 24 Q13 18 20 15" fill="none" stroke={mix(skin,INK,0.12)} strokeWidth="3" strokeLinecap="round"/>
              <path d="M50 24 Q51 18 44 15" fill="none" stroke={mix(skin,INK,0.12)} strokeWidth="3" strokeLinecap="round"/>
            </g>
          );
        case 'short':
        default:
          return (
            <g>
              <path d="M11 27 Q11 5 32 5 Q53 5 53 27 Q49 15 39 14 Q41 19 37 20 Q33 13 30 20 Q26 18 25 14 Q15 15 11 27 Z" fill={H}/>
              <path d="M18 13 Q30 7 43 13" fill="none" stroke={HL} strokeWidth="2.5" strokeLinecap="round"/>
            </g>
          );
      }
    }

    const showMask = mask;
    const facingSide = dir === 'left' || dir === 'right';
    const flip = dir === 'left';
    // Per-instance random phase so idle motions across NPCs don't sync up.
    const seed = React.useMemo(() => Math.random(), []);
    const blinkDelay = (seed * 6).toFixed(2);
    const breatheDelay = (seed * 3).toFixed(2);

    // ── Face features — derp aesthetic (small dot eyes) across 12 emotions.
    // Eyes anchor: left (23), right (41); base eyeY 27. Mouth ~ y33-36.
    function face() {
      const eyeY = 27;
      const E = INK;

      // eye primitives (all keep the "하찮은" small/vacant character)
      const dotEyes = (dy = 1.5) => (
        <g>
          <circle cx="23" cy={eyeY + dy} r="2" fill={E}/>
          <circle cx="41" cy={eyeY + dy} r="2" fill={E}/>
        </g>
      );
      const dotEyesUp = (
        <g>
          <circle cx="23" cy={eyeY - 1} r="2" fill={E}/>
          <circle cx="41" cy={eyeY - 1} r="2" fill={E}/>
        </g>
      );
      const dotEyesWide = (
        <g>
          <circle cx="22" cy={eyeY} r="2.4" fill={E}/>
          <circle cx="42" cy={eyeY} r="2.4" fill={E}/>
        </g>
      );
      const lineEyes = (   // closed / sleepy
        <g>
          <path d="M20 28 Q23 29.5 26 28" fill="none" stroke={E} strokeWidth="1.6" strokeLinecap="round"/>
          <path d="M38 28 Q41 29.5 44 28" fill="none" stroke={E} strokeWidth="1.6" strokeLinecap="round"/>
        </g>
      );
      const squintEyes = (  // pain — > <
        <g>
          <path d="M20 26 L25 28 L20 30" fill="none" stroke={E} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M44 26 L39 28 L44 30" fill="none" stroke={E} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </g>
      );

      // brow primitives
      const browsAngry = (
        <g>
          <path d="M19 22 L27 25" fill="none" stroke={E} strokeWidth="1.6" strokeLinecap="round"/>
          <path d="M45 22 L37 25" fill="none" stroke={E} strokeWidth="1.6" strokeLinecap="round"/>
        </g>
      );
      const browsSad = (
        <g>
          <path d="M20 24 L27 22" fill="none" stroke={E} strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M44 24 L37 22" fill="none" stroke={E} strokeWidth="1.5" strokeLinecap="round"/>
        </g>
      );

      // mouth primitives
      const mWobble = <path d="M29 34 Q31 33 33 34 Q35 35 37 34" fill="none" stroke={E} strokeWidth="1.6" strokeLinecap="round"/>;
      const mFlat   = <path d="M29 34.5 L37 34.5" fill="none" stroke={E} strokeWidth="1.6" strokeLinecap="round"/>;
      const mSmile  = <path d="M28 33 Q32 37 36 33" fill="none" stroke={E} strokeWidth="1.7" strokeLinecap="round"/>;
      const mFrown  = <path d="M28 36 Q32 32 36 36" fill="none" stroke={E} strokeWidth="1.7" strokeLinecap="round"/>;
      const mOpenO  = <ellipse cx="33" cy="35" rx="2.4" ry="3" fill={E}/>;
      const mGrit   = (
        <g>
          <rect x="28" y="33.5" width="10" height="3.4" rx="1.2" fill={E}/>
          <line x1="33" y1="33.5" x2="33" y2="36.9" stroke="#FFF" strokeWidth="0.8"/>
        </g>
      );
      const mYawn   = <ellipse cx="33" cy="35.5" rx="2.8" ry="3.4" fill={E}/>;
      const mTiny   = <circle cx="33" cy="35" r="1.3" fill={E}/>;

      // extra marks
      const tear   = <g><ellipse cx="45" cy="31" rx="1.4" ry="2.2" fill="#7DD3FC"/><ellipse cx="44.6" cy="30.4" rx="0.5" ry="0.7" fill="#FFF"/></g>;
      const sweat  = <g><ellipse cx="47" cy="22" rx="1.8" ry="2.8" fill="#7DD3FC"/><ellipse cx="46.4" cy="21.2" rx="0.6" ry="0.9" fill="#FFF"/></g>;
      const anger  = <path d="M44 19 L48 19 M46 17 L46 21 M45 22 L49 18 M45 18 L49 22" stroke="#EF4444" strokeWidth="1" strokeLinecap="round"/>;
      const qmark  = <text x="46" y="20" fontSize="9" fill={E} fontFamily="monospace" fontWeight="bold">?</text>;
      const zzz    = <text x="45" y="20" fontSize="8" fill={E} fontFamily="monospace">z</text>;

      const blush = (op = 0.4) => (
        <g>
          <ellipse cx="19" cy="33" rx="2.8" ry="1.7" fill="#F9A8B4" opacity={op}/>
          <ellipse cx="45" cy="32.5" rx="3" ry="1.8" fill="#F9A8B4" opacity={op}/>
        </g>
      );
      const bigBlush = (
        <g>
          <ellipse cx="19" cy="33" rx="4" ry="2.6" fill="#F9A8B4" opacity="0.7"/>
          <ellipse cx="45" cy="32.5" rx="4.2" ry="2.7" fill="#F9A8B4" opacity="0.72"/>
        </g>
      );

      let eyes = dotEyes(), brows = null, mouth = mWobble, marks = null, bl = blush();
      switch (expression) {
        case 'happy':     eyes = dotEyes(0.5); mouth = mSmile; break;
        case 'sad':       eyes = dotEyes(2);   brows = browsSad; mouth = mFrown; marks = tear; bl = blush(0.25); break;
        case 'worried':   eyes = dotEyes(1);   brows = browsSad; mouth = mWobble; marks = sweat; break;
        case 'pain':      eyes = squintEyes;   mouth = mGrit; marks = sweat; bl = null; break;
        case 'surprised': eyes = dotEyesWide;  mouth = mOpenO; break;
        case 'angry':     eyes = dotEyes(0.5); brows = browsAngry; mouth = mFrown; marks = anger; bl = null; break;
        case 'thinking':  eyes = dotEyesUp;    mouth = mFlat; marks = qmark; break;
        case 'sleepy':    eyes = lineEyes;     mouth = mYawn; marks = zzz; break;
        case 'panic':     eyes = dotEyesWide;  mouth = mOpenO; marks = sweat; bl = null; break;
        case 'focused':   eyes = dotEyes(0.5); brows = browsAngry; mouth = mFlat; bl = null; break;
        case 'shy':       eyes = dotEyes(1.5); mouth = mTiny; bl = bigBlush; break;
        case 'neutral':
        case 'derp':
        default:          eyes = dotEyes();    mouth = mWobble; break;
      }

      return (
        <g>
          {bl}
          {brows}
          {eyes}
          {!showMask && mouth}
          {marks}
        </g>
      );
    }

    // ── Back-of-head (dir 'up') — hair fills the crown, no face ──
    function backHead() {
      if (hairStyle === 'cap' || hairStyle === 'peakedCap') {
        // hat seen from behind: same dome, minus the front badge/visor accents
        return (
          <g>
            <ellipse cx={HX} cy={HY - 2} rx={HRX - 1} ry={HRY - 1} fill={hatTone}/>
            {hairStyle === 'peakedCap' && <path d={`M9 24 Q32 20 55 24 Q32 27 9 24 Z`} fill={mix(hatTone, INK, 0.2)}/>}
            {/* a little hair peeking at the nape */}
            <path d="M16 40 Q32 46 48 40 Q32 44 16 40 Z" fill={H}/>
          </g>
        );
      }
      if (hairStyle === 'bald') {
        return <path d="M14 38 Q32 44 50 38 Q32 42 14 38 Z" fill={H} opacity="0.9"/>;
      }
      return (
        <g>
          {/* hair-filled crown */}
          <ellipse cx={HX} cy={HY - 1} rx={HRX - 1} ry={HRY - 1} fill={H}/>
          {/* center part + highlight */}
          <path d={`M32 7 L32 42`} stroke={HD} strokeWidth="1.2" opacity="0.5"/>
          <path d="M18 14 Q32 8 46 14" fill="none" stroke={HL} strokeWidth="2.5" strokeLinecap="round"/>
          {hairStyle === 'bun' && <ellipse cx="32" cy="6" rx="7" ry="6" fill={H}/>}
          {hairStyle === 'pigtails' && (
            <g><ellipse cx="9" cy="34" rx="7" ry="9" fill={H}/><ellipse cx="55" cy="34" rx="7" ry="9" fill={H}/></g>
          )}
        </g>
      );
    }

    // ── Side / 3-4 face (dir 'left'/'right', designed right-facing, flipped for left) ──
    function sideFace() {
      const E = INK;
      // one visible eye toward the front (right side), small nose tip at head edge
      return (
        <g>
          {/* nose bump at the front edge of the head */}
          <path d="M53 25 Q57 27 53 29 Z" fill={skin} stroke={slo} strokeWidth="1"/>
          {/* single eye */}
          <circle cx="42" cy="27" r="2" fill={E}/>
          {/* brow/expression cues kept minimal */}
          {expression === 'happy' && <path d="M39 33 Q42 36 45 33" fill="none" stroke={E} strokeWidth="1.6" strokeLinecap="round"/>}
          {expression !== 'happy' && <path d="M40 34 Q42 33.4 44 34" fill="none" stroke={E} strokeWidth="1.6" strokeLinecap="round"/>}
          {/* cheek blush */}
          <ellipse cx="44" cy="31" rx="2.6" ry="1.6" fill="#F9A8B4" opacity="0.4"/>
        </g>
      );
    }

    // ── Side-profile hat (cap / peakedCap) — designed right-facing ──
    function hatSide() {
      if (hairStyle === 'peakedCap') {
        return (
          <g>
            {/* crown */}
            <path d="M11 21 Q9 2 35 1 Q56 3 55 21 Q34 25 11 21 Z" fill={hatTone}/>
            {/* visor projecting forward (toward the face / right) */}
            <path d="M50 20 Q63 20 61 25 Q53 25 50 23 Z" fill={mix(hatTone, INK, 0.35)}/>
            {/* side badge toward the front */}
            {hatTrim && <ellipse cx="49" cy="12" rx="3" ry="2.6" fill={hatTrim}/>}
          </g>
        );
      }
      // cap (nurse / surgeon)
      return (
        <g>
          <path d="M10 21 Q8 1 34 0 Q56 2 55 21 Q33 25 10 21 Z" fill={hatTone}/>
          <path d="M14 11 Q31 4 49 12" fill="none" stroke={mix(hatTone,'#FFFFFF',0.3)} strokeWidth="2.5" strokeLinecap="round"/>
          {hatTrim && <path d="M10 21 Q33 25 55 21" fill="none" stroke={hatTrim} strokeWidth="3.5" strokeLinecap="round"/>}
          {/* nurse cross sits at the FRONT of the cap when seen from the side */}
          {hatTrim === '#EF4444' && (
            <g>
              <rect x="46" y="5" width="4" height="9" rx="1" fill="#EF4444"/>
              <rect x="44" y="7.5" width="8" height="4" rx="1" fill="#EF4444"/>
            </g>
          )}
        </g>
      );
    }
    const isHat = hairStyle === 'cap' || hairStyle === 'peakedCap';

    // Walking leg swing via SMIL (reliable inside the drop-shadow filter)
    const legSwingA = walking ? (
      <animateTransform attributeName="transform" type="rotate"
        values="-10 27 65; 10 27 65; -10 27 65" dur="0.5s" repeatCount="indefinite"/>
    ) : null;
    const legSwingB = walking ? (
      <animateTransform attributeName="transform" type="rotate"
        values="10 37 65; -10 37 65; 10 37 65" dur="0.5s" repeatCount="indefinite"/>
    ) : null;
    const armSwingA = walking ? (
      <animateTransform attributeName="transform" type="rotate"
        values="8 20 52; -8 20 52; 8 20 52" dur="0.5s" repeatCount="indefinite"/>
    ) : null;
    const armSwingB = walking ? (
      <animateTransform attributeName="transform" type="rotate"
        values="-8 44 52; 8 44 52; -8 44 52" dur="0.5s" repeatCount="indefinite"/>
    ) : null;

    // walking bob (whole body) — subtle vertical
    const walkBob = walking ? { animation: 'forinWalkBob .5s ease-in-out infinite' } : null;
    // idle breathing — gentle, always-on when standing (desynced per instance)
    const idleAnim = !walking
      ? { animation: `forinIdleBreath 3.2s ease-in-out infinite`, animationDelay: `-${breatheDelay}s` }
      : null;

    // Blink eyelids — skin-colored caps that briefly cover the dot eyes.
    // Front-facing idle only (side/back faces handled separately / omitted).
    const blink = (!facingSide && dir !== 'up') ? (
      <g style={{ animation: 'forinBlink 5.5s steps(1,end) infinite', animationDelay: `-${blinkDelay}s`, transformOrigin: '32px 27px' }}>
        <rect x="20" y="24" width="6" height="5" rx="2" fill={skin}/>
        <rect x="38" y="24" width="6" height="5" rx="2" fill={skin}/>
      </g>
    ) : null;

    return (
      <div style={{ position: 'relative', width, height, ...(bob && !walking ? { animation: 'forinSmoothBob 1.4s ease-in-out infinite' } : idleAnim), ...walkBob, ...style }}>
        <style>{`
          @keyframes forinSmoothBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-2px)}}
          @keyframes forinWalkBob{0%,100%{transform:translateY(0)}25%{transform:translateY(-1.5px)}50%{transform:translateY(0)}75%{transform:translateY(-1.5px)}}
          @keyframes forinIdleBreath{0%,100%{transform:translateY(0) scaleY(1)}50%{transform:translateY(-1px) scaleY(1.012)}}
          @keyframes forinBlink{0%,96%,100%{opacity:0}97.5%,99%{opacity:1}}
        `}</style>
        <svg viewBox="0 0 64 80" width={width} height={height}
             style={{ display: 'block', overflow: 'visible', filter: 'drop-shadow(1px 2px 1px rgba(0,0,0,.18))' }}>
          <g transform={flip ? 'translate(64,0) scale(-1,1)' : undefined}>
          {/* ground shadow */}
          <ellipse cx="32" cy="77" rx="15" ry="2.4" fill="#000" opacity="0.13"/>

          {/* back hair (long/bob/pigtails fall behind the body) */}
          {dir !== 'up' && hairBack()}

          {/* ── ARMS ── Side view: one arm tucked along the narrow torso ── */}
          {facingSide ? null : (
            <>
              <g>
                <path d="M20 52 Q14 56 15 64" fill="none" stroke={shirt} strokeWidth="6" strokeLinecap="round"/>
                <path d="M20 52 Q14 56 15 64" fill="none" stroke={slo} strokeWidth="1.4" strokeLinecap="round" opacity="0.5"/>
                <circle cx="15" cy="64" r="3" fill={skin} stroke={slo} strokeWidth="1.2"/>
                {armSwingA}
              </g>
              <g>
                <path d="M44 52 Q50 56 49 64" fill="none" stroke={shirt} strokeWidth="6" strokeLinecap="round"/>
                <path d="M44 52 Q50 56 49 64" fill="none" stroke={slo} strokeWidth="1.4" strokeLinecap="round" opacity="0.5"/>
                <circle cx="49" cy="64" r="3" fill={skin} stroke={slo} strokeWidth="1.2"/>
                {armSwingB}
              </g>
            </>
          )}

          {/* ── BODY (small, short) ── Side view: narrower profile ── */}
          {facingSide ? (
            <>
              <path d="M26 52 Q26 47 32 47 Q39 47 39 52 L40 66 Q32 69 25 66 Z" fill={shirt} stroke={slo} strokeWidth="1.6" strokeLinejoin="round"/>
              {/* back-edge shading (left = behind) */}
              <path d="M26 50 Q26 48 28 47 L28 68 Q26 67 25 66 Z" fill={shirtDk} opacity="0.5"/>
            </>
          ) : (
            <>
              <path d="M20 52 Q20 47 32 47 Q44 47 44 52 L46 66 Q32 70 18 66 Z" fill={shirt} stroke={slo} strokeWidth="1.6" strokeLinejoin="round"/>
              {/* body shading */}
              <path d="M38 49 Q44 50 44 53 L46 66 Q41 68 38 68 Z" fill={shirtDk} opacity="0.55"/>
            </>
          )}

          {/* chest marker — FRONT only (hidden in side & back profile) */}
          {!facingSide && dir !== 'up' && chestCross && (
            <g>
              <rect x="29" y="52" width="6" height="9" rx="1.5" fill="#EF4444"/>
              <rect x="26.5" y="54.5" width="11" height="4" rx="1.5" fill="#EF4444"/>
            </g>
          )}
          {!facingSide && dir !== 'up' && chestMark}

          {/* ── LEGS (short, swing when walking) ──
               Side view: two legs at body center, swinging opposite phase so
               they cross front↔back (natural profile stride). One is drawn
               darker (the far leg) for depth. */}
          {facingSide ? (
            <>
              {/* far leg (behind, darker) */}
              <g>
                <rect x="29" y="65" width="6" height="9" rx="3" fill={legDk}/>
                <ellipse cx="32" cy="75" rx="4.6" ry="2.6" fill={mix(shoe, INK, 0.25)}/>
                {walking && (
                  <animateTransform attributeName="transform" type="rotate"
                    values="22 32 64; -22 32 64; 22 32 64" dur="0.5s" repeatCount="indefinite"/>
                )}
              </g>
              {/* near leg (front) */}
              <g>
                <rect x="29" y="65" width="6" height="9" rx="3" fill={leg}/>
                <rect x="32" y="65" width="2.4" height="9" rx="1.2" fill={legDk} opacity="0.5"/>
                <ellipse cx="32" cy="75" rx="4.8" ry="2.6" fill={shoe}/>
                {walking && (
                  <animateTransform attributeName="transform" type="rotate"
                    values="-22 32 64; 22 32 64; -22 32 64" dur="0.5s" repeatCount="indefinite"/>
                )}
              </g>
            </>
          ) : (
            <>
              <g>
                <rect x="24" y="65" width="6.5" height="9" rx="3" fill={leg}/>
                <rect x="27.5" y="65" width="2.6" height="9" rx="1.3" fill={legDk} opacity="0.5"/>
                <ellipse cx="27.2" cy="75" rx="4.4" ry="2.6" fill={shoe}/>
                {legSwingA}
              </g>
              <g>
                <rect x="33.5" y="65" width="6.5" height="9" rx="3" fill={leg}/>
                <rect x="37" y="65" width="2.6" height="9" rx="1.3" fill={legDk} opacity="0.5"/>
                <ellipse cx="36.8" cy="75" rx="4.4" ry="2.6" fill={shoe}/>
                {legSwingB}
              </g>
            </>
          )}

          {/* ── SIDE ARM (drawn on top of body, swings when walking) ── */}
          {facingSide && (
            <g>
              <path d="M33 52 Q37 57 35 64" fill="none" stroke={shirt} strokeWidth="5" strokeLinecap="round"/>
              <path d="M33 52 Q37 57 35 64" fill="none" stroke={slo} strokeWidth="1.2" strokeLinecap="round" opacity="0.4"/>
              <circle cx="35" cy="64" r="2.8" fill={skin} stroke={slo} strokeWidth="1.2"/>
              {walking && (
                <animateTransform attributeName="transform" type="rotate"
                  values="20 34 53; -20 34 53; 20 34 53" dur="0.5s" repeatCount="indefinite"/>
              )}
            </g>
          )}

          {/* ── HEAD ── */}
          <ellipse cx={HX} cy={HY} rx={HRX} ry={HRY} fill={skin} stroke={slo} strokeWidth="1.6"/>
          {/* face shading on right */}
          {dir !== 'up' && <path d={`M${HX+6} ${HY-HRY+4} Q${HX+HRX} ${HY} ${HX+6} ${HY+HRY-4} Q${HX+HRX-3} ${HY} ${HX+6} ${HY-HRY+4} Z`} fill={sh} opacity="0.4"/>}

          {dir === 'up' ? (
            backHead()
          ) : (
            <>
              {facingSide && isHat ? hatSide() : hairFront()}
              {facingSide ? sideFace() : face()}
              {blink}
            </>
          )}

          {/* surgical mask (front & side) */}
          {showMask && dir !== 'up' && (
            <g>
              <path d="M18 30 Q32 28 46 30 L44 40 Q32 46 20 40 Z" fill="#FFFFFF" stroke={slo} strokeWidth="1.4" strokeLinejoin="round"/>
              <path d="M20 33 Q32 32 44 33" fill="none" stroke="#D9DEE3" strokeWidth="1.2"/>
              <path d="M20 36 Q32 35 44 36" fill="none" stroke="#D9DEE3" strokeWidth="1.2"/>
              <path d="M18 31 Q12 33 14 39" fill="none" stroke={slo} strokeWidth="1.2" strokeLinecap="round"/>
              <path d="M46 31 Q52 33 50 39" fill="none" stroke={slo} strokeWidth="1.2" strokeLinecap="round"/>
            </g>
          )}
          </g>
        </svg>

        {tag && (
          <div style={{
            position: 'absolute', left: '50%', top: -12, transform: 'translateX(-50%)',
            background: '#fff', border: `2px solid ${INK}`, borderRadius: 6,
            fontFamily: '"DungGeunMo",monospace', fontSize: 7, padding: '1px 5px',
            whiteSpace: 'nowrap', color: INK, boxShadow: `1px 1px 0 0 ${INK}`,
          }}>{tag}</div>
        )}
      </div>
    );
  }

  // ── Shared palette + deterministic variation (mirrors chibi-npcs.jsx) ──
  const HAIR_VARIANTS = ['#1F2937','#3C2A18','#5C3A1A','#7C3F00','#9A6B3F','#C28E5C','#E2B16B','#FACC15','#EF4444','#B45309','#D1D5DB','#A78BFA','#22D3EE'];
  const SKIN_VARIANTS = ['#FCE5C8','#F8D7B2','#E9BE93','#C99066','#9A6B45'];
  function hash(x, y, salt = 0) {
    const v = Math.floor((x * 73856093) ^ (y * 19349663) ^ (salt * 83492791));
    return Math.abs(v);
  }
  const pick = (arr, h) => arr[h % arr.length];

  // ── Role configs — single source for both Smooth* and Derp* presets ──
  // fn(h) returns the per-role props given a deterministic hash h.
  const ROLES = {
    nurse: (h, shirt) => ({ hair: pick(HAIR_VARIANTS, h), hairStyle: 'cap',
      hatTone: '#FFFFFF', hatTrim: '#EF4444', skin: pick(SKIN_VARIANTS, h >> 5),
      shirt: shirt || '#A7F3D0', shirtDk: '#4FC79D', leg: '#FFFFFF', shoe: '#1F2937',
      chestMark: <g><rect x="29.5" y="53" width="5" height="8" rx="1" fill="#EF4444"/><rect x="27.5" y="55" width="9" height="4" rx="1" fill="#EF4444"/></g> }),
    doctor: (h) => ({ hair: pick(HAIR_VARIANTS, h), hairStyle: pick(['short','bob','curly','short'], h >> 3),
      skin: pick(SKIN_VARIANTS, h >> 5), shirt: '#FFFFFF', shirtDk: '#B0B5BD', leg: '#475569', shoe: '#1F2937',
      chestMark: <g><path d="M27 49 Q27 56 32 57" fill="none" stroke={INK} strokeWidth="1.4"/><circle cx="32" cy="58" r="1.8" fill={INK}/></g> }),
    surgeon: (h) => ({ hair: '#3C2A18', hairStyle: 'cap', hatTone: '#A8DCEC', hatTrim: '#5E8FA8',
      skin: pick(SKIN_VARIANTS, h >> 5), shirt: '#A8DCEC', shirtDk: '#5E8FA8', leg: '#A8DCEC', shoe: '#FFFFFF', mask: true }),
    paramedic: (h) => ({ hair: pick(HAIR_VARIANTS, h), hairStyle: 'peakedCap', hatTone: '#0F172A', hatTrim: '#FACC15',
      skin: pick(SKIN_VARIANTS, h >> 5), shirt: '#FACC15', shirtDk: '#CA8A04', leg: '#1F2937', shoe: '#0F172A' }),
    police: (h) => ({ hair: '#1F2937', hairStyle: 'peakedCap', hatTone: '#1E3A8A', hatTrim: '#FACC15',
      skin: pick(SKIN_VARIANTS, h >> 5), shirt: '#1E3A8A', shirtDk: '#0F172A', leg: '#1E3A8A', shoe: '#0F172A',
      chestMark: <ellipse cx="26" cy="55" rx="2.4" ry="2.8" fill="#FACC15"/> }),
    patient: (h) => ({ hair: pick(HAIR_VARIANTS, h), hairStyle: pick(['short','bob','long','curly','bald'], h >> 3),
      skin: pick(SKIN_VARIANTS, h >> 5), shirt: '#FED7AA', shirtDk: '#C99066', leg: '#FED7AA', shoe: '#FCE5C8' }),
    child: (h) => ({ hair: pick(HAIR_VARIANTS, h), hairStyle: pick(['short','pigtails','bob','curly','mohawk'], h >> 3),
      skin: pick(SKIN_VARIANTS, h >> 5), shirt: pick(['#FBCFE8','#FDE68A','#A7F3D0','#BAE6FD','#FCA5A5','#DDD6FE'], h >> 7),
      leg: pick(['#3F2A18','#1E40AF','#7C2D12','#4338CA'], h >> 9), shoe: '#1F2937' }),
    parent: (h) => ({ hair: pick(HAIR_VARIANTS, h), hairStyle: pick(['bob','long','short','bun','curly','short'], h >> 3),
      skin: pick(SKIN_VARIANTS, h >> 5), shirt: pick(['#FBCFE8','#7DD3FC','#A78BFA','#FCA5A5','#BBF7D0','#94A3B8'], h >> 7),
      leg: pick(['#3F2A18','#1E40AF','#52525B'], h >> 9), shoe: '#2A1B0E' }),
    visitor: (h) => ({ hair: pick(HAIR_VARIANTS, h), hairStyle: pick(['short','bob','long','curly','bald','short'], h >> 3),
      skin: pick(SKIN_VARIANTS, h >> 5), shirt: pick(['#A78BFA','#0EA5E9','#94A3B8','#F59E0B','#65A30D','#9333EA'], h >> 7),
      leg: pick(['#3F2A18','#1E3A8A','#52525B','#27272A'], h >> 9), shoe: '#2A1B0E' }),
    pharmacist: (h) => ({ hair: pick(HAIR_VARIANTS, h), hairStyle: pick(['short','bob','bun','curly'], h >> 3),
      skin: pick(SKIN_VARIANTS, h >> 5), shirt: '#FFFFFF', shirtDk: '#B0B5BD', leg: '#475569', shoe: '#1F2937',
      chestMark: <rect x="28" y="53" width="8" height="6" rx="1.5" fill="#10B981"/> }),
  };
  const ROLE_SALT = { nurse:1, doctor:2, surgeon:3, paramedic:4, police:5, patient:6, child:7, parent:8, visitor:9, pharmacist:10 };
  const DEFAULT_SIZE = { child: 34 };

  // Factory: builds a role component. mood sets the default expression
  // ('happy' = cheerful, 'derp' = vacant neutral). An explicit `expression`
  // prop always overrides. Surgeon's mask is a separate prop.
  function makeRole(kind, mood) {
    return function ({ x = 0, y = 0, seed, hair, shirt, size, expression, dir, walking }) {
      // Identity hash: use a STABLE seed when provided (so a moving NPC keeps
      // its skin/hair/outfit), else fall back to tile position.
      const h = (seed != null) ? hash(seed, seed * 7 + 13, ROLE_SALT[kind]) : hash(x, y, ROLE_SALT[kind]);
      const cfg = ROLES[kind](h, shirt);
      const sz = size || DEFAULT_SIZE[kind] || 40;
      const { mask, ...rest } = cfg;
      const expr = expression || (mood === 'derp' ? 'neutral' : 'happy');
      return <SmoothSprite width={sz} {...rest} hair={hair || cfg.hair} mask={!!mask} expression={expr} dir={dir} walking={walking}/>;
    };
  }

  // ── Smooth (똘망똘망) role presets ──
  const SmoothNurse      = makeRole('nurse', 'happy');
  const SmoothDoctor     = makeRole('doctor', 'happy');
  const SmoothSurgeon    = makeRole('surgeon', 'happy');
  const SmoothParamedic  = makeRole('paramedic', 'happy');
  const SmoothPolice     = makeRole('police', 'happy');
  const SmoothPatient    = makeRole('patient', 'happy');
  const SmoothChild      = makeRole('child', 'happy');
  const SmoothParent     = makeRole('parent', 'happy');
  const SmoothVisitor    = makeRole('visitor', 'happy');
  const SmoothPharmacist = makeRole('pharmacist', 'happy');

  // ── Derp (하찮은) role presets — same identity, vacant goofy face ──
  const DerpNurse      = makeRole('nurse', 'derp');
  const DerpDoctor     = makeRole('doctor', 'derp');
  const DerpSurgeon    = makeRole('surgeon', 'derp');
  const DerpParamedic  = makeRole('paramedic', 'derp');
  const DerpPolice     = makeRole('police', 'derp');
  const DerpPatient    = makeRole('patient', 'derp');
  const DerpChild      = makeRole('child', 'derp');
  const DerpParent     = makeRole('parent', 'derp');
  const DerpVisitor    = makeRole('visitor', 'derp');
  const DerpPharmacist = makeRole('pharmacist', 'derp');

  function SmoothPlayer({ size = 40, tag = 'YOU', expression = 'happy', dir, walking }) {
    return <SmoothSprite width={size} hair="#3C2A18" hairStyle="cap"
      hatTone="#FFFFFF" hatTrim="#EF4444" skin="#FCE5C8"
      shirt="#A7F3D0" shirtDk="#4FC79D" leg="#3F3D52" shoe="#1F2937" chestCross tag={tag} expression={expression} dir={dir} walking={walking}/>;
  }
  function DerpPlayer({ size = 40, tag = 'YOU', expression = 'neutral', dir, walking }) {
    return <SmoothSprite width={size} hair="#3C2A18" hairStyle="cap"
      hatTone="#FFFFFF" hatTrim="#EF4444" skin="#FCE5C8"
      shirt="#A7F3D0" shirtDk="#4FC79D" leg="#3F3D52" shoe="#1F2937" chestCross tag={tag} expression={expression} dir={dir} walking={walking}/>;
  }

  // ── Tile-placement wrapper (parallels INpcV2) ──
  function SmoothNpc({ x, y, kind = 'nurse', shirt, hair, size, mood = 'happy', expression, dir, walking }) {
    const T = window.ITILE || 16;
    const SIZE = size || 40;
    const pickRole = (happy, derp) => mood === 'derp' ? derp : happy;
    const roles = mood === 'derp'
      ? { nurse: DerpNurse, doctor: DerpDoctor, surgeon: DerpSurgeon, paramedic: DerpParamedic,
          police: DerpPolice, patient: DerpPatient, parent: DerpParent, child: DerpChild,
          visitor: DerpVisitor, pharmacist: DerpPharmacist }
      : { nurse: SmoothNurse, doctor: SmoothDoctor, surgeon: SmoothSurgeon, paramedic: SmoothParamedic,
          police: SmoothPolice, patient: SmoothPatient, parent: SmoothParent, child: SmoothChild,
          visitor: SmoothVisitor, pharmacist: SmoothPharmacist };
    const Role = roles[kind] || roles.nurse;
    const sz = kind === 'child' ? SIZE - 6 : SIZE;
    // Offsets scale with size so the sprite's feet sit on the tile and it
    // centers horizontally. Sprite is sz wide × sz*80/64 tall.
    const offX = (sz - T) / 2;
    const offY = sz * 80 / 64 - T;
    return (
      <div style={{ position: 'absolute', left: x * T - offX, top: y * T - offY, zIndex: 4 }}>
        <Role x={x} y={y} hair={hair} shirt={shirt} size={sz} expression={expression} dir={dir} walking={walking}/>
      </div>
    );
  }
  function DerpNpc(props) { return <SmoothNpc {...props} mood="derp"/>; }

  Object.assign(window, {
    SmoothSprite, SmoothPlayer,
    SmoothNurse, SmoothDoctor, SmoothSurgeon, SmoothParamedic, SmoothPolice,
    SmoothPatient, SmoothChild, SmoothParent, SmoothVisitor, SmoothPharmacist,
    SmoothNpc, DerpNpc,
    DerpPlayer,
    DerpNurse, DerpDoctor, DerpSurgeon, DerpParamedic, DerpPolice,
    DerpPatient, DerpChild, DerpParent, DerpVisitor, DerpPharmacist,
  });
})();
