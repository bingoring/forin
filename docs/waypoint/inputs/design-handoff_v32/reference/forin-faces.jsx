// forin-faces.jsx — Visual-novel-scale face portraits.
//
// Same identity vocabulary as the chibi RPGSprite (hair color, hair style,
// skin tone, cap, scrub color) but at a much higher resolution (16×18) so
// expressions can be drawn legibly.
//
// API:
//   <Forin.Face
//     hair="#3C2A18" hairStyle="bob"     // matches RPGSprite props
//     skin="#F8D7B2"
//     hatTone="#FFFFFF" hatTrim="#EF4444"
//     shirt="#A7F3D0"
//     expression="happy"                  // 12 expressions
//     size={80}                           // px width
//     mask                                // optional surgical mask
//   />
//
// Convenience role presets (same identity as the chibi NPC of the same name):
//   FacePlayer / FaceNurse / FaceDoctor / FaceSurgeon / FaceParamedic /
//   FacePolice / FacePatient / FaceChild / FaceParent / FaceVisitor /
//   FacePharmacist

(function () {
  const OUTLINE = '#1F1A14';
  const BLUSH = '#F9A8B4';
  const TEAR = '#3B82F6';

  // small color util (matches chibi-npcs.jsx)
  function mix(a, b, t) {
    const p = h => [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)];
    const [ar,ag,ab] = p(a), [br,bg,bb] = p(b);
    const rr = Math.round(ar + (br-ar)*t);
    const gg = Math.round(ag + (bg-ag)*t);
    const bl = Math.round(ab + (bb-ab)*t);
    return '#' + [rr,gg,bl].map(v => v.toString(16).padStart(2,'0')).join('');
  }

  // ═══════════════════════════════════════════════════════════════════
  //  HAIR PLATES — each rendered AFTER the base skin, BEFORE expression.
  //  ViewBox: 16 wide, 18 tall.  Face skin occupies (col 3–12, row 3–10).
  // ═══════════════════════════════════════════════════════════════════
  function HairPlate({ style, hair, hatTone, hatTrim, skin }) {
    const H  = hair;
    const HL = mix(hair, '#FFFFFF', 0.20);
    const HD = mix(hair, OUTLINE,    0.30);

    switch (style) {
      case 'short':
        return (
          <g>
            {/* hair crown */}
            <rect x="5" y="0" width="6" height="1" fill={H}/>
            <rect x="3" y="1" width="10" height="1" fill={H}/>
            <rect x="2" y="2" width="12" height="2" fill={H}/>
            {/* bangs over forehead — partially cover face rows 3-4 */}
            <rect x="2" y="4" width="3" height="1" fill={H}/>
            <rect x="11" y="4" width="3" height="1" fill={H}/>
            {/* highlight */}
            <rect x="4" y="1" width="6" height="1" fill={HL}/>
            <rect x="3" y="2" width="8" height="0.5" fill={HL}/>
            {/* hair-line outline (above the crown) */}
            <rect x="5" y="0" width="1" height="1" fill={OUTLINE}/>
            <rect x="10" y="0" width="1" height="1" fill={OUTLINE}/>
            <rect x="3" y="1" width="1" height="1" fill={OUTLINE}/>
            <rect x="12" y="1" width="1" height="1" fill={OUTLINE}/>
            <rect x="2" y="2" width="1" height="2" fill={OUTLINE}/>
            <rect x="13" y="2" width="1" height="2" fill={OUTLINE}/>
          </g>
        );

      case 'bob':
        return (
          <g>
            <rect x="4" y="0" width="8" height="1" fill={H}/>
            <rect x="2" y="1" width="12" height="3" fill={H}/>
            {/* bangs */}
            <rect x="2" y="4" width="3" height="1" fill={H}/>
            <rect x="11" y="4" width="3" height="1" fill={H}/>
            {/* sides drop to jaw */}
            <rect x="2" y="4" width="2" height="6" fill={H}/>
            <rect x="12" y="4" width="2" height="6" fill={H}/>
            {/* highlight */}
            <rect x="3" y="1" width="8" height="1" fill={HL}/>
            <rect x="2" y="9" width="2" height="1" fill={HD}/>
            <rect x="12" y="9" width="2" height="1" fill={HD}/>
            {/* outline */}
            <rect x="4" y="0" width="1" height="1" fill={OUTLINE}/>
            <rect x="11" y="0" width="1" height="1" fill={OUTLINE}/>
            <rect x="2" y="1" width="1" height="9" fill={OUTLINE}/>
            <rect x="13" y="1" width="1" height="9" fill={OUTLINE}/>
          </g>
        );

      case 'long':
        return (
          <g>
            <rect x="4" y="0" width="8" height="1" fill={H}/>
            <rect x="2" y="1" width="12" height="3" fill={H}/>
            <rect x="2" y="4" width="3" height="1" fill={H}/>
            <rect x="11" y="4" width="3" height="1" fill={H}/>
            {/* long sides drop past shoulders */}
            <rect x="1" y="4" width="3" height="14" fill={H}/>
            <rect x="12" y="4" width="3" height="14" fill={H}/>
            {/* hair tips taper */}
            <rect x="1" y="17" width="1" height="1" fill={HD}/>
            <rect x="14" y="17" width="1" height="1" fill={HD}/>
            <rect x="3" y="1" width="8" height="1" fill={HL}/>
            {/* outline */}
            <rect x="4" y="0" width="1" height="1" fill={OUTLINE}/>
            <rect x="11" y="0" width="1" height="1" fill={OUTLINE}/>
            <rect x="1" y="1" width="1" height="17" fill={OUTLINE}/>
            <rect x="14" y="1" width="1" height="17" fill={OUTLINE}/>
          </g>
        );

      case 'pigtails':
        return (
          <g>
            <rect x="4" y="0" width="8" height="1" fill={H}/>
            <rect x="2" y="1" width="12" height="3" fill={H}/>
            <rect x="2" y="4" width="3" height="1" fill={H}/>
            <rect x="11" y="4" width="3" height="1" fill={H}/>
            <rect x="2" y="4" width="2" height="2" fill={H}/>
            <rect x="12" y="4" width="2" height="2" fill={H}/>
            {/* pigtail puffs at ear level */}
            <rect x="0" y="4" width="2" height="4" fill={H}/>
            <rect x="14" y="4" width="2" height="4" fill={H}/>
            <rect x="0" y="4" width="1" height="1" fill={HL}/>
            <rect x="14" y="4" width="1" height="1" fill={HL}/>
            {/* red ties */}
            <rect x="0" y="8" width="2" height="1" fill="#EF4444"/>
            <rect x="14" y="8" width="2" height="1" fill="#EF4444"/>
            {/* highlight */}
            <rect x="3" y="1" width="8" height="1" fill={HL}/>
            {/* outline */}
            <rect x="4" y="0" width="1" height="1" fill={OUTLINE}/>
            <rect x="11" y="0" width="1" height="1" fill={OUTLINE}/>
            <rect x="2" y="1" width="1" height="3" fill={OUTLINE}/>
            <rect x="13" y="1" width="1" height="3" fill={OUTLINE}/>
            <rect x="0" y="4" width="1" height="4" fill={OUTLINE}/>
            <rect x="15" y="4" width="1" height="4" fill={OUTLINE}/>
            <rect x="0" y="9" width="2" height="1" fill={OUTLINE}/>
            <rect x="14" y="9" width="2" height="1" fill={OUTLINE}/>
          </g>
        );

      case 'bun':
        return (
          <g>
            {/* bun on top */}
            <rect x="6" y="-1" width="4" height="1" fill={H}/>
            <rect x="5" y="-2" width="6" height="1" fill={H}/>
            <rect x="4" y="-3" width="8" height="1" fill={H}/>
            <rect x="5" y="-4" width="6" height="1" fill={H}/>
            <rect x="6" y="-2" width="3" height="1" fill={HL}/>
            {/* regular short cap */}
            <rect x="5" y="0" width="6" height="1" fill={H}/>
            <rect x="3" y="1" width="10" height="1" fill={H}/>
            <rect x="2" y="2" width="12" height="2" fill={H}/>
            <rect x="2" y="4" width="3" height="1" fill={H}/>
            <rect x="11" y="4" width="3" height="1" fill={H}/>
            <rect x="3" y="2" width="8" height="0.5" fill={HL}/>
            {/* outline */}
            <rect x="4" y="-3" width="1" height="1" fill={OUTLINE}/>
            <rect x="11" y="-3" width="1" height="1" fill={OUTLINE}/>
            <rect x="5" y="-4" width="6" height="1" fill={OUTLINE} opacity="0"/>
            <rect x="5" y="0" width="1" height="1" fill={OUTLINE}/>
            <rect x="10" y="0" width="1" height="1" fill={OUTLINE}/>
            <rect x="3" y="1" width="1" height="1" fill={OUTLINE}/>
            <rect x="12" y="1" width="1" height="1" fill={OUTLINE}/>
            <rect x="2" y="2" width="1" height="2" fill={OUTLINE}/>
            <rect x="13" y="2" width="1" height="2" fill={OUTLINE}/>
          </g>
        );

      case 'mohawk':
        return (
          <g>
            {/* shaved sides — show skin (skinSh) */}
            <rect x="2" y="3" width="12" height="1" fill={mix(skin, OUTLINE, 0.15)}/>
            {/* mohawk strip going up */}
            <rect x="6" y="-1" width="4" height="1" fill={H}/>
            <rect x="5" y="0" width="6" height="1" fill={H}/>
            <rect x="5" y="1" width="6" height="2" fill={H}/>
            <rect x="5" y="3" width="6" height="1" fill={H}/>
            {/* mohawk highlight */}
            <rect x="6" y="0" width="3" height="1" fill={HL}/>
            {/* outline */}
            <rect x="5" y="0" width="1" height="3" fill={OUTLINE}/>
            <rect x="10" y="0" width="1" height="3" fill={OUTLINE}/>
            <rect x="6" y="-1" width="1" height="1" fill={OUTLINE}/>
            <rect x="9" y="-1" width="1" height="1" fill={OUTLINE}/>
          </g>
        );

      case 'curly':
        return (
          <g>
            {/* bumpy crown */}
            <rect x="3" y="0" width="3" height="1" fill={H}/>
            <rect x="7" y="0" width="2" height="1" fill={H}/>
            <rect x="10" y="0" width="3" height="1" fill={H}/>
            <rect x="2" y="1" width="12" height="3" fill={H}/>
            {/* sides */}
            <rect x="1" y="2" width="2" height="2" fill={H}/>
            <rect x="13" y="2" width="2" height="2" fill={H}/>
            <rect x="2" y="4" width="2" height="3" fill={H}/>
            <rect x="12" y="4" width="2" height="3" fill={H}/>
            {/* curl highlights */}
            <rect x="3" y="0" width="1" height="1" fill={HL}/>
            <rect x="7" y="0" width="1" height="1" fill={HL}/>
            <rect x="10" y="0" width="1" height="1" fill={HL}/>
            <rect x="3" y="2" width="1" height="1" fill={HL}/>
            <rect x="11" y="2" width="1" height="1" fill={HL}/>
            {/* outline */}
            <rect x="3" y="0" width="1" height="1" fill={OUTLINE}/>
            <rect x="5" y="0" width="1" height="1" fill={OUTLINE}/>
            <rect x="7" y="0" width="1" height="1" fill={OUTLINE}/>
            <rect x="8" y="0" width="1" height="1" fill={OUTLINE}/>
            <rect x="10" y="0" width="1" height="1" fill={OUTLINE}/>
            <rect x="12" y="0" width="1" height="1" fill={OUTLINE}/>
            <rect x="1" y="2" width="1" height="2" fill={OUTLINE}/>
            <rect x="14" y="2" width="1" height="2" fill={OUTLINE}/>
            <rect x="2" y="4" width="1" height="3" fill={OUTLINE}/>
            <rect x="13" y="4" width="1" height="3" fill={OUTLINE}/>
          </g>
        );

      case 'bald':
        return (
          <g>
            {/* thin band over the back of the head */}
            <rect x="2" y="2" width="2" height="3" fill={H}/>
            <rect x="12" y="2" width="2" height="3" fill={H}/>
            <rect x="2" y="2" width="1" height="3" fill={OUTLINE}/>
            <rect x="13" y="2" width="1" height="3" fill={OUTLINE}/>
          </g>
        );

      case 'cap':
        // Surgical / nurse cap — solid color overlay with trim band.
        return (
          <g>
            <rect x="4" y="0" width="8" height="1" fill={hatTone}/>
            <rect x="2" y="1" width="12" height="3" fill={hatTone}/>
            {/* trim band along bottom of cap */}
            {hatTrim && <rect x="2" y="3" width="12" height="1" fill={hatTrim}/>}
            {/* nurse red cross on hat center (if trim is red) */}
            {hatTrim === '#EF4444' && (
              <g>
                <rect x="7" y="0.5" width="2" height="1.5" fill="#EF4444"/>
                <rect x="6.5" y="1" width="3" height="0.7" fill="#EF4444"/>
              </g>
            )}
            {/* highlight (light from upper-left) */}
            <rect x="3" y="1" width="6" height="1" fill={mix(hatTone, '#FFFFFF', 0.30)}/>
            {/* small hair wisps peeking under cap */}
            <rect x="2" y="4" width="1.5" height="0.8" fill={H}/>
            <rect x="12.5" y="4" width="1.5" height="0.8" fill={H}/>
            {/* outline */}
            <rect x="4" y="0" width="1" height="1" fill={OUTLINE}/>
            <rect x="11" y="0" width="1" height="1" fill={OUTLINE}/>
            <rect x="2" y="1" width="1" height="3" fill={OUTLINE}/>
            <rect x="13" y="1" width="1" height="3" fill={OUTLINE}/>
          </g>
        );

      case 'peakedCap':
        return (
          <g>
            {/* cap top */}
            <rect x="4" y="0" width="8" height="1" fill={hatTone}/>
            <rect x="2" y="1" width="12" height="3" fill={hatTone}/>
            {/* badge */}
            {hatTrim && <rect x="7" y="1.5" width="2" height="1.5" fill={hatTrim}/>}
            {/* visor (extends past the head) */}
            <rect x="1" y="4" width="14" height="1" fill={mix(hatTone, OUTLINE, 0.4)}/>
            {/* highlight */}
            <rect x="3" y="1" width="6" height="1" fill={mix(hatTone, '#FFFFFF', 0.25)}/>
            {/* outline */}
            <rect x="4" y="0" width="1" height="1" fill={OUTLINE}/>
            <rect x="11" y="0" width="1" height="1" fill={OUTLINE}/>
            <rect x="2" y="1" width="1" height="3" fill={OUTLINE}/>
            <rect x="13" y="1" width="1" height="3" fill={OUTLINE}/>
            <rect x="1" y="5" width="14" height="0.5" fill={OUTLINE}/>
          </g>
        );

      default:
        return null;
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  //  EXPRESSION PLATES — drawn ON TOP of skin + hair.
  //  Eye anchor: left = (x=5, y=5), right = (x=9.5, y=5). 2px tall area.
  //  Mouth anchor: x=6-9, y=8-9.
  // ═══════════════════════════════════════════════════════════════════
  function ExpressionPlate({ expr, skin, masked }) {
    const E = OUTLINE;
    const skinSh = mix(skin, OUTLINE, 0.22);

    // Eye shape primitives — used by multiple expressions
    function dotEyes() {
      return (
        <g>
          <rect x="5" y="5.3" width="1.3" height="1.5" fill={E}/>
          <rect x="9.7" y="5.3" width="1.3" height="1.5" fill={E}/>
          {/* eye shine */}
          <rect x="5.3" y="5.5" width="0.5" height="0.5" fill="#FFFFFF"/>
          <rect x="10" y="5.5" width="0.5" height="0.5" fill="#FFFFFF"/>
        </g>
      );
    }
    function closedHappyEyes() {
      return (
        <g>
          {/* left curve ^ */}
          <rect x="4.5" y="5.7" width="2.5" height="0.5" fill={E}/>
          <rect x="5" y="5.3" width="0.5" height="0.5" fill={E}/>
          <rect x="6" y="5.3" width="0.5" height="0.5" fill={E}/>
          {/* right curve ^ */}
          <rect x="9" y="5.7" width="2.5" height="0.5" fill={E}/>
          <rect x="9.5" y="5.3" width="0.5" height="0.5" fill={E}/>
          <rect x="10.5" y="5.3" width="0.5" height="0.5" fill={E}/>
        </g>
      );
    }
    function squintEyes() {
      return (
        <g>
          {/* > < shape */}
          <rect x="4.5" y="5.5" width="0.5" height="0.5" fill={E}/>
          <rect x="5" y="5.7" width="2" height="0.5" fill={E}/>
          <rect x="6.5" y="5.5" width="0.5" height="0.5" fill={E}/>
          <rect x="6.5" y="6" width="0.5" height="0.5" fill={E}/>
          <rect x="11" y="5.5" width="0.5" height="0.5" fill={E}/>
          <rect x="9.5" y="5.7" width="2" height="0.5" fill={E}/>
          <rect x="9" y="5.5" width="0.5" height="0.5" fill={E}/>
          <rect x="9" y="6" width="0.5" height="0.5" fill={E}/>
        </g>
      );
    }
    function wideEyes() {
      return (
        <g>
          {/* whites */}
          <rect x="4.5" y="5" width="2.2" height="2.2" fill="#FFFFFF"/>
          <rect x="9.3" y="5" width="2.2" height="2.2" fill="#FFFFFF"/>
          {/* pupils */}
          <rect x="5.3" y="5.7" width="1" height="1" fill={E}/>
          <rect x="10.1" y="5.7" width="1" height="1" fill={E}/>
          {/* outline */}
          <rect x="4.5" y="5" width="2.2" height="0.4" fill={E}/>
          <rect x="4.5" y="7" width="2.2" height="0.4" fill={E}/>
          <rect x="4.5" y="5" width="0.4" height="2.2" fill={E}/>
          <rect x="6.3" y="5" width="0.4" height="2.2" fill={E}/>
          <rect x="9.3" y="5" width="2.2" height="0.4" fill={E}/>
          <rect x="9.3" y="7" width="2.2" height="0.4" fill={E}/>
          <rect x="9.3" y="5" width="0.4" height="2.2" fill={E}/>
          <rect x="11.1" y="5" width="0.4" height="2.2" fill={E}/>
        </g>
      );
    }
    function halfLidEyes() {
      return (
        <g>
          {/* horizontal lines */}
          <rect x="4.5" y="6" width="2.5" height="0.5" fill={E}/>
          <rect x="9" y="6" width="2.5" height="0.5" fill={E}/>
          {/* tiny dots below */}
          <rect x="5.5" y="6.5" width="0.5" height="0.5" fill={E}/>
          <rect x="10" y="6.5" width="0.5" height="0.5" fill={E}/>
        </g>
      );
    }
    function narrowEyes() {
      return (
        <g>
          {/* narrow horizontal slits */}
          <rect x="4.7" y="5.7" width="2" height="0.7" fill={E}/>
          <rect x="9.3" y="5.7" width="2" height="0.7" fill={E}/>
        </g>
      );
    }
    function lookDownEyes() {
      return (
        <g>
          <rect x="5" y="5.8" width="1.3" height="1.2" fill={E}/>
          <rect x="9.7" y="5.8" width="1.3" height="1.2" fill={E}/>
        </g>
      );
    }
    function lookUpEyes() {
      return (
        <g>
          <rect x="5" y="5" width="1.3" height="1.2" fill={E}/>
          <rect x="9.7" y="5" width="1.3" height="1.2" fill={E}/>
        </g>
      );
    }

    // Brow primitives
    function browsRaisedInner() {
      // / \ shape (sad/worried — inner ends lift)
      return (
        <g>
          <rect x="6" y="4" width="1" height="0.5" fill={E}/>
          <rect x="5" y="4.3" width="1" height="0.4" fill={E}/>
          <rect x="4.5" y="4.5" width="1" height="0.4" fill={E}/>
          <rect x="9" y="4" width="1" height="0.5" fill={E}/>
          <rect x="10" y="4.3" width="1" height="0.4" fill={E}/>
          <rect x="10.5" y="4.5" width="1" height="0.4" fill={E}/>
        </g>
      );
    }
    function browsAngry() {
      // \\ // — inner pointing down
      return (
        <g>
          <rect x="4.5" y="4" width="1" height="0.4" fill={E}/>
          <rect x="5.2" y="4.3" width="1" height="0.4" fill={E}/>
          <rect x="6" y="4.6" width="1" height="0.4" fill={E}/>
          <rect x="9" y="4.6" width="1" height="0.4" fill={E}/>
          <rect x="9.8" y="4.3" width="1" height="0.4" fill={E}/>
          <rect x="10.5" y="4" width="1" height="0.4" fill={E}/>
        </g>
      );
    }
    function browsStraightDown() {
      // straight low brows (focused/determined)
      return (
        <g>
          <rect x="4.5" y="4.5" width="2.5" height="0.5" fill={E}/>
          <rect x="9" y="4.5" width="2.5" height="0.5" fill={E}/>
        </g>
      );
    }
    function browsRaised() {
      // straight raised (surprised)
      return (
        <g>
          <rect x="4.5" y="3.5" width="2.5" height="0.5" fill={E}/>
          <rect x="9" y="3.5" width="2.5" height="0.5" fill={E}/>
        </g>
      );
    }

    // Mouth primitives — only render when NOT masked
    function smileMouth() {
      return (
        <g>
          <rect x="6.5" y="8.5" width="3" height="0.6" fill={E}/>
          <rect x="6" y="8.2" width="0.7" height="0.5" fill={E}/>
          <rect x="9.3" y="8.2" width="0.7" height="0.5" fill={E}/>
        </g>
      );
    }
    function bigSmileMouth() {
      return (
        <g>
          <rect x="5.7" y="8.4" width="4.6" height="0.5" fill={E}/>
          <rect x="6" y="8.9" width="4" height="0.5" fill={E}/>
          <rect x="5.3" y="8" width="0.5" height="0.5" fill={E}/>
          <rect x="10.2" y="8" width="0.5" height="0.5" fill={E}/>
          {/* tongue / inner mouth */}
          <rect x="6.5" y="8.5" width="3" height="0.6" fill="#F87171"/>
        </g>
      );
    }
    function frownMouth() {
      return (
        <g>
          <rect x="6.5" y="9" width="3" height="0.6" fill={E}/>
          <rect x="6" y="9.3" width="0.7" height="0.5" fill={E}/>
          <rect x="9.3" y="9.3" width="0.7" height="0.5" fill={E}/>
        </g>
      );
    }
    function flatMouth() {
      return <rect x="6.5" y="8.7" width="3" height="0.5" fill={E}/>;
    }
    function wavyMouth() {
      return (
        <g>
          <rect x="6" y="8.7" width="1" height="0.5" fill={E}/>
          <rect x="6.5" y="8.4" width="1" height="0.5" fill={E}/>
          <rect x="7" y="8.7" width="1" height="0.5" fill={E}/>
          <rect x="7.5" y="9" width="1" height="0.5" fill={E}/>
          <rect x="8" y="8.7" width="1" height="0.5" fill={E}/>
          <rect x="8.5" y="9" width="1" height="0.5" fill={E}/>
        </g>
      );
    }
    function oMouth() {
      // surprised "O"
      return (
        <g>
          <rect x="7" y="8.3" width="2" height="1" fill={E}/>
          <rect x="7.3" y="8.5" width="1.4" height="0.6" fill="#7C2D12"/>
        </g>
      );
    }
    function gritMouth() {
      // showing teeth — bared
      return (
        <g>
          <rect x="6" y="8.5" width="4" height="0.8" fill={E}/>
          <rect x="6.2" y="8.7" width="3.6" height="0.4" fill="#FFFFFF"/>
          {/* teeth lines */}
          <rect x="7" y="8.7" width="0.3" height="0.4" fill={E}/>
          <rect x="8" y="8.7" width="0.3" height="0.4" fill={E}/>
          <rect x="9" y="8.7" width="0.3" height="0.4" fill={E}/>
        </g>
      );
    }
    function tightLineMouth() {
      // pressed lips (focused)
      return (
        <g>
          <rect x="6.5" y="8.6" width="3" height="0.4" fill={E}/>
          <rect x="6" y="8.7" width="0.5" height="0.3" fill={E}/>
          <rect x="9.5" y="8.7" width="0.5" height="0.3" fill={E}/>
        </g>
      );
    }
    function smallSmileMouth() {
      return (
        <g>
          <rect x="6.8" y="8.7" width="2.4" height="0.5" fill={E}/>
          <rect x="6.4" y="8.5" width="0.5" height="0.4" fill={E}/>
          <rect x="9.1" y="8.5" width="0.5" height="0.4" fill={E}/>
        </g>
      );
    }
    function yawnMouth() {
      // small open oval
      return (
        <g>
          <rect x="6.8" y="8.3" width="2.4" height="1.2" fill={E}/>
          <rect x="7" y="8.5" width="2" height="0.8" fill="#7C2D12"/>
        </g>
      );
    }

    // ─── compose per expression ──────────────────────────────────────
    let eyes, brows, mouth, extras = [];
    switch (expr) {
      case 'happy':
        eyes = closedHappyEyes(); mouth = bigSmileMouth();
        break;
      case 'sad':
        eyes = dotEyes(); brows = browsRaisedInner(); mouth = frownMouth();
        // tear drop
        extras.push(<rect key="tear" x="11.2" y="7" width="0.7" height="1.5" fill={TEAR}/>);
        extras.push(<rect key="tear2" x="11.3" y="6.7" width="0.5" height="0.5" fill={mix(TEAR, '#FFFFFF', 0.4)}/>);
        break;
      case 'worried':
        eyes = dotEyes(); brows = browsRaisedInner(); mouth = wavyMouth();
        break;
      case 'pain':
        eyes = squintEyes(); brows = browsAngry(); mouth = gritMouth();
        // small drop of sweat
        extras.push(<rect key="sweat" x="12" y="3.5" width="0.7" height="1.2" fill={TEAR}/>);
        break;
      case 'surprised':
        eyes = wideEyes(); brows = browsRaised(); mouth = oMouth();
        break;
      case 'angry':
        eyes = narrowEyes(); brows = browsAngry(); mouth = gritMouth();
        // vein/anger mark
        extras.push(
          <g key="vein">
            <rect x="11.7" y="3" width="0.5" height="0.5" fill="#EF4444"/>
            <rect x="12.2" y="3.3" width="0.5" height="0.5" fill="#EF4444"/>
            <rect x="11.5" y="3.5" width="0.5" height="0.5" fill="#EF4444"/>
            <rect x="12" y="3.7" width="0.5" height="0.5" fill="#EF4444"/>
            <rect x="11.7" y="4" width="0.5" height="0.5" fill="#EF4444"/>
          </g>
        );
        break;
      case 'thinking':
        eyes = lookUpEyes(); brows = browsRaised(); mouth = tightLineMouth();
        extras.push(
          <g key="thought">
            <rect x="12" y="2" width="1" height="1" fill="#FFFFFF" stroke={OUTLINE} strokeWidth="0.2"/>
            <text x="12.2" y="2.85" fontSize="1.2" fill={OUTLINE} fontFamily="monospace">?</text>
          </g>
        );
        break;
      case 'sleepy':
        eyes = halfLidEyes(); mouth = yawnMouth();
        extras.push(
          <g key="zs" style={{ transform: 'translate(11.5px, 2px)' }}>
            <text x="0" y="1.5" fontSize="1.8" fill={OUTLINE} fontFamily="monospace">z</text>
            <text x="1.5" y="0" fontSize="1.4" fill={OUTLINE} fontFamily="monospace">z</text>
          </g>
        );
        break;
      case 'panic':
        eyes = wideEyes(); brows = browsRaised(); mouth = oMouth();
        // big sweat drop
        extras.push(<rect key="sweat" x="11.5" y="3" width="1" height="2" fill={TEAR}/>);
        extras.push(<rect key="sweat2" x="11.7" y="2.5" width="0.6" height="0.6" fill={mix(TEAR, '#FFFFFF', 0.5)}/>);
        break;
      case 'focused':
        eyes = narrowEyes(); brows = browsStraightDown(); mouth = tightLineMouth();
        break;
      case 'shy':
        eyes = lookDownEyes(); mouth = smallSmileMouth();
        // EXTRA blush is added by parent component when expr=shy
        break;
      case 'neutral':
      default:
        eyes = dotEyes(); mouth = flatMouth();
    }

    return (
      <g>
        {brows}
        {eyes}
        {!masked && mouth}
        {extras}
      </g>
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  //  Core Face component
  // ═══════════════════════════════════════════════════════════════════
  function Face({
    hair = '#3C2A18',
    hairStyle = 'short',
    skin = '#F8D7B2',
    hatTone, hatTrim,
    shirt = '#A7F3D0',
    shirtDk,
    expression = 'neutral',
    mask = false,           // surgical mask covering nose+mouth
    maskColor,              // defaults to scrub blue if mask
    size = 80,
    style,
  }) {
    shirtDk = shirtDk || mix(shirt, OUTLINE, 0.30);
    const skinSh = mix(skin, OUTLINE, 0.22);
    const maskC  = maskColor || '#FFFFFF';
    const maskD  = mix(maskC, OUTLINE, 0.25);

    // Shy expression gets heavier blush
    const blushBig = expression === 'shy';

    return (
      <svg
        width={size}
        height={size * 18 / 16}
        viewBox="-1 -4 18 22"
        shapeRendering="crispEdges"
        style={{ display: 'block', overflow: 'visible', ...style }}
      >
        {/* ── Face skin ── */}
        <rect x="3" y="3" width="10" height="7" fill={skin}/>
        <rect x="4" y="10" width="8" height="1" fill={skin}/>
        {/* face shading on right side */}
        <rect x="11" y="5" width="1" height="5" fill={skinSh}/>
        <rect x="10" y="10" width="2" height="1" fill={skinSh}/>

        {/* face outline */}
        <rect x="2" y="3" width="1" height="7" fill={OUTLINE}/>
        <rect x="13" y="3" width="1" height="7" fill={OUTLINE}/>
        <rect x="3" y="10" width="1" height="1" fill={OUTLINE}/>
        <rect x="12" y="10" width="1" height="1" fill={OUTLINE}/>
        <rect x="4" y="11" width="8" height="0.6" fill={OUTLINE}/>

        {/* ── Hair (drawn on top of face top, overlaps bangs area) ── */}
        <HairPlate
          style={hairStyle}
          hair={hair}
          hatTone={hatTone}
          hatTrim={hatTrim}
          skin={skin}
        />

        {/* ── Blush (under most expressions) ── */}
        {!['angry','sad','panic','pain'].includes(expression) && (
          <g>
            <rect x="3.6" y="7" width="1.5" height="1" fill={BLUSH} opacity={blushBig ? 0.95 : 0.55}/>
            <rect x="10.9" y="7" width="1.5" height="1" fill={BLUSH} opacity={blushBig ? 0.95 : 0.55}/>
          </g>
        )}

        {/* ── Expression ── */}
        <ExpressionPlate expr={expression} skin={skin} masked={mask}/>

        {/* ── Neck ── */}
        <rect x="6" y="11.5" width="4" height="2" fill={skin}/>
        <rect x="6" y="13" width="4" height="0.4" fill={skinSh}/>
        <rect x="5.5" y="11.5" width="0.5" height="2" fill={OUTLINE}/>
        <rect x="10" y="11.5" width="0.5" height="2" fill={OUTLINE}/>

        {/* ── Shirt collar / shoulders ── */}
        <rect x="2" y="13.5" width="12" height="4.5" fill={shirt}/>
        {/* darker fold under chin */}
        <rect x="2" y="13.5" width="12" height="0.6" fill={shirtDk}/>
        {/* right-side shadow */}
        <rect x="11" y="14" width="3" height="4" fill={shirtDk}/>
        {/* shirt outline */}
        <rect x="1" y="13.5" width="1" height="4.5" fill={OUTLINE}/>
        <rect x="14" y="13.5" width="1" height="4.5" fill={OUTLINE}/>
        <rect x="2" y="13.4" width="4" height="0.4" fill={OUTLINE}/>
        <rect x="10" y="13.4" width="4" height="0.4" fill={OUTLINE}/>

        {/* ── Surgical mask (drawn LAST, over lower face + ties on cheeks) ── */}
        {mask && (
          <g>
            <rect x="3" y="7" width="10" height="4" fill={maskC}/>
            <rect x="3" y="7" width="10" height="0.5" fill={maskD}/>
            <rect x="3" y="10.5" width="10" height="0.5" fill={maskD}/>
            <rect x="2" y="7" width="1" height="4" fill={OUTLINE}/>
            <rect x="13" y="7" width="1" height="4" fill={OUTLINE}/>
            <rect x="3" y="6.7" width="10" height="0.4" fill={OUTLINE}/>
            <rect x="3" y="11" width="10" height="0.4" fill={OUTLINE}/>
            {/* nose pinch */}
            <rect x="6" y="7.4" width="4" height="0.4" fill={maskD}/>
            {/* pleats */}
            <rect x="3" y="8.3" width="10" height="0.2" fill={maskD}/>
            <rect x="3" y="9.3" width="10" height="0.2" fill={maskD}/>
            <rect x="3" y="10.0" width="10" height="0.2" fill={maskD}/>
            {/* ear loops */}
            <path d={`M 2 7.5 Q 0.5 9 2 10.5`} fill="none" stroke={OUTLINE} strokeWidth="0.4"/>
            <path d={`M 14 7.5 Q 15.5 9 14 10.5`} fill="none" stroke={OUTLINE} strokeWidth="0.4"/>
          </g>
        )}
      </svg>
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  //  Role presets — same identity vocabulary as ChibiNurse/Doctor/...
  // ═══════════════════════════════════════════════════════════════════
  function FaceNurse({ hair = '#3C2A18', shirt = '#A7F3D0', expression, size = 80, style }) {
    return (
      <Face
        hair={hair} hairStyle="cap"
        hatTone="#FFFFFF" hatTrim="#EF4444"
        shirt={shirt} shirtDk="#4FC79D"
        expression={expression} size={size} style={style}
      />
    );
  }

  function FaceDoctor({ hair = '#3C2A18', hairStyle, expression, size = 80, style }) {
    return (
      <Face
        hair={hair} hairStyle={hairStyle || 'short'}
        shirt="#FFFFFF" shirtDk="#B0B5BD"
        expression={expression} size={size} style={style}
      />
    );
  }

  function FaceSurgeon({ hair = '#3C2A18', expression, size = 80, style }) {
    return (
      <Face
        hair={hair} hairStyle="cap"
        hatTone="#A8DCEC" hatTrim="#5E8FA8"
        shirt="#A8DCEC" shirtDk="#5E8FA8"
        expression={expression}
        mask maskColor="#A8DCEC"
        size={size} style={style}
      />
    );
  }

  function FaceParamedic({ hair = '#7C3F00', expression, size = 80, style }) {
    return (
      <Face
        hair={hair} hairStyle="peakedCap"
        hatTone="#0F172A" hatTrim="#FACC15"
        shirt="#FACC15" shirtDk="#CA8A04"
        expression={expression} size={size} style={style}
      />
    );
  }

  function FacePolice({ hair = '#1F2937', expression, size = 80, style }) {
    return (
      <Face
        hair={hair} hairStyle="peakedCap"
        hatTone="#1E3A8A" hatTrim="#FACC15"
        shirt="#1E3A8A" shirtDk="#0F172A"
        expression={expression} size={size} style={style}
      />
    );
  }

  function FacePatient({ hair = '#9A6B3F', hairStyle = 'short', expression, size = 80, style }) {
    return (
      <Face
        hair={hair} hairStyle={hairStyle}
        shirt="#FED7AA" shirtDk="#C99066"
        expression={expression} size={size} style={style}
      />
    );
  }

  function FaceChild({ hair = '#FACC15', hairStyle = 'short', expression, size = 80, style }) {
    return (
      <Face
        hair={hair} hairStyle={hairStyle}
        shirt="#FBCFE8" shirtDk="#BE185D"
        expression={expression} size={size} style={style}
      />
    );
  }

  function FaceParent({ hair = '#3C2A18', hairStyle = 'bob', expression, size = 80, style }) {
    return (
      <Face
        hair={hair} hairStyle={hairStyle}
        shirt="#FBCFE8" shirtDk="#BE185D"
        expression={expression} size={size} style={style}
      />
    );
  }

  function FaceVisitor({ hair = '#5C3A1A', hairStyle = 'short', expression, size = 80, style }) {
    return (
      <Face
        hair={hair} hairStyle={hairStyle}
        shirt="#A78BFA" shirtDk="#6D28D9"
        expression={expression} size={size} style={style}
      />
    );
  }

  function FacePharmacist({ hair = '#3C2A18', hairStyle = 'short', expression, size = 80, style }) {
    return (
      <Face
        hair={hair} hairStyle={hairStyle}
        shirt="#FFFFFF" shirtDk="#B0B5BD"
        expression={expression} size={size} style={style}
      />
    );
  }

  function FacePlayer({ expression = 'focused', size = 80, style }) {
    return (
      <FaceNurse hair="#3C2A18" shirt="#A7F3D0" expression={expression} size={size} style={style}/>
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  //  Expression vocabulary (for catalogs, dropdowns)
  // ═══════════════════════════════════════════════════════════════════
  const EXPRESSIONS = [
    { id: 'neutral',   ko: '평온',   en: 'Neutral'    },
    { id: 'happy',     ko: '기쁨',   en: 'Happy'      },
    { id: 'sad',       ko: '슬픔',   en: 'Sad'        },
    { id: 'worried',   ko: '걱정',   en: 'Worried'    },
    { id: 'pain',      ko: '통증',   en: 'In Pain'    },
    { id: 'surprised', ko: '놀람',   en: 'Surprised'  },
    { id: 'angry',     ko: '분노',   en: 'Angry'      },
    { id: 'thinking',  ko: '생각',   en: 'Thinking'   },
    { id: 'sleepy',    ko: '졸림',   en: 'Sleepy'     },
    { id: 'panic',     ko: '당황',   en: 'Panicked'   },
    { id: 'focused',   ko: '집중',   en: 'Focused'    },
    { id: 'shy',       ko: '수줍음', en: 'Shy'        },
  ];

  Object.assign(window, {
    Face, FacePlayer,
    FaceNurse, FaceDoctor, FaceSurgeon, FaceParamedic, FacePolice,
    FacePatient, FaceChild, FaceParent, FaceVisitor, FacePharmacist,
    FORIN_EXPRESSIONS: EXPRESSIONS,
  });
})();
