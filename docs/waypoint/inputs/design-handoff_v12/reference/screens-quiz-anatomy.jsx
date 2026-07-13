// screens-quiz-anatomy.jsx — F · Body anatomy labeling (Ward zone)
//
// PatientFrontPixel uses the SAME pixel-art vocabulary as the rest of the
// design system: same OUTLINE color, same skin/hair/gown palette, same
// face features (chibi-style eyes, blush, worried mouth) as Forin.FacePatient
// — but stretched to anatomical proportions so each labelable region (thigh,
// calf, wrist, ankle…) is large enough to drop a dot onto.
//
// Dot positions below are expressed as % of the 136 × 380 host card, and
// each one is hand-aligned to a specific region of the body sprite. If you
// edit the body, you'll need to re-tune these coordinates.

function ScreenQuizAnatomy() {
  const t = window.ForinTokens;
  const C = '#2A2522';

  // 6 dots — pre-baked answer state for the demo screenshot:
  //   #1 forehead       ✓ correct
  //   #2 shoulder       ✓ correct
  //   #3 abdomen        ✓ correct (over the red cross on gown)
  //   #4 thigh (WRONG)  player put 'thigh' on the CALF
  //   #5 ?              hovering over right wrist (ID band)
  //   #6 (empty)        next drop target on left ankle
  const dots = [
    { id: 1, x: 50, y:  7, label: 'forehead', state: 'correct' },
    { id: 2, x: 28, y: 20, label: 'shoulder', state: 'correct' },
    { id: 3, x: 50, y: 34, label: 'abdomen',  state: 'correct' },
    { id: 4, x: 61, y: 79, label: 'thigh',    state: 'wrong'   },
    { id: 5, x: 76, y: 42, label: '?',        state: 'hover'   },
    { id: 6, x: 39, y: 89, label: null,       state: 'empty'   },
  ];

  const wordBank = [
    { w: 'forehead', used: true },
    { w: 'shoulder', used: true },
    { w: 'abdomen',  used: true },
    { w: 'thigh',    used: true },
    { w: 'wrist',    focused: true },
    { w: 'ankle' },
    { w: 'lower back' },
    { w: 'calf' },
  ];

  return (
    <div data-screen-label="07f Quiz · Anatomy" style={{ height: '100%', background: '#1F2937', position: 'relative', overflow: 'hidden' }}>
      <QuizBackdrop/>

      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '52px 16px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 7 }}>
        <button style={{ background: '#fff', border: `2px solid ${C}`, padding: '4px 10px', fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: C, boxShadow: `2px 2px 0 0 ${C}` }}>× 나가기</button>
        <div style={{ background: '#fff', border: `2px solid ${C}`, padding: '4px 8px', fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: C, boxShadow: `2px 2px 0 0 ${C}` }}>
          병동 6F · Mr. Kim
        </div>
      </div>

      <QuizCard
        kind="LABEL" zone="병동" title="신체 부위 라벨링"
        sub='"여기가 아파요." 환자가 짚은 부위를 영어로'
        missionNum={2} total={4} timer="01:12"
        footer={
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ flex: 1, background: '#fff', border: `2px solid ${C}`, padding: '8px', fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: C, boxShadow: `2px 2px 0 0 ${C}` }}>↺ 처음부터</button>
            <button style={{ flex: 2, background: t.mint, border: `2px solid ${C}`, padding: '8px', fontFamily: '"DungGeunMo",monospace', fontSize: 12, color: C, boxShadow: `2px 2px 0 0 ${t.mintShadow}` }}>✓ 제출 (4/6 채움)</button>
          </div>
        }>
        {/* layout: patient image (left) + word bank (right) */}
        <div style={{ display: 'grid', gridTemplateColumns: '136px 1fr', gap: 12 }}>
          {/* patient body diagram */}
          <div style={{ position: 'relative', background: t.paper, border: `3px solid ${C}`, boxShadow: `3px 3px 0 0 ${C}`, height: 380, padding: 8 }}>
            <div style={{ position: 'absolute', top: -8, left: 8, background: '#fff', border: `1.5px solid ${C}`, padding: '0 4px', fontFamily: '"DungGeunMo",monospace', fontSize: 8, color: C }}>
              PATIENT · F
            </div>
            <PatientFrontPixel/>
            {/* dots overlaid */}
            {dots.map(d => (
              <BodyDot key={d.id} {...d} parentH={380}/>
            ))}
          </div>

          {/* right side: word bank + tagged answers */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 9, color: C, opacity: 0.7 }}>━ 단어 카드 ━━━━━</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {wordBank.map((w, i) => <AnatomyTile key={i} {...w}/>)}
            </div>

            <div style={{ marginTop: 6, padding: '6px 8px', background: '#FEE2E2', border: `2px solid ${C}`, fontFamily: '"Galmuri11",monospace', fontSize: 10, color: C, lineHeight: 1.4, boxShadow: `2px 2px 0 0 ${C}` }}>
              <b style={{ background: '#EF4444', color: '#fff', padding: '0 4px', marginRight: 4, fontFamily: '"DungGeunMo",monospace', fontSize: 9 }}>X</b>
              <b>#4</b> — 윗다리는 <u>thigh</u>, 종아리는 <u>calf</u>!
            </div>

            <div style={{ marginTop: 4, padding: '6px 8px', background: t.cream, border: `1.5px dashed ${C}66`, fontFamily: '"Galmuri11",monospace', fontSize: 10, color: t.textSoft, lineHeight: 1.4 }}>
              <b style={{ color: C }}>Tip.</b> "It hurts <u>around</u> my…"처럼 around / behind / between을 함께 쓰면 더 자연스러워요.
            </div>
          </div>
        </div>
      </QuizCard>
    </div>
  );
}

function BodyDot({ id, x, y, label, state, parentH }) {
  const t = window.ForinTokens;
  const C = '#2A2522';
  let bg = '#fff', bd = C, ring = 'none';
  if (state === 'correct') { bg = t.mint; }
  if (state === 'wrong')   { bg = '#FCA5A5'; }
  if (state === 'hover')   { bg = t.yellow; ring = 'forinPulseRing 1.1s ease-in-out infinite'; }
  if (state === 'empty')   { bg = '#fff'; bd = '#9CA3AF'; }

  return (
    <div style={{
      position: 'absolute', left: `${x}%`, top: `${y}%`,
      transform: 'translate(-50%,-50%)',
      zIndex: 4,
    }}>
      <div style={{
        width: 18, height: 18, background: bg, border: `2.5px solid ${bd}`,
        borderRadius: '50%', fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: C,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `2px 2px 0 0 ${C}`, animation: ring,
      }}>{id}</div>
      {/* tag below */}
      {label && (
        <div style={{
          position: 'absolute', left: '50%', top: 22, transform: 'translateX(-50%)',
          background: state === 'correct' ? t.mint : (state === 'wrong' ? '#FCA5A5' : t.yellow),
          border: `2px solid ${C}`,
          padding: '1px 5px', fontFamily: '"DungGeunMo",monospace', fontSize: 9, color: C,
          boxShadow: `1.5px 1.5px 0 0 ${C}`, whiteSpace: 'nowrap',
          textDecoration: state === 'wrong' ? 'line-through' : 'none',
        }}>
          {label}
          {state === 'correct' && <span style={{ marginLeft: 3 }}>✓</span>}
          {state === 'wrong'   && <span style={{ marginLeft: 3 }}>✕</span>}
        </div>
      )}
      {state === 'empty' && (
        <div style={{ position: 'absolute', left: '50%', top: 22, transform: 'translateX(-50%)',
          border: `1.5px dashed ${C}66`, padding: '1px 6px', fontFamily: '"DungGeunMo",monospace',
          fontSize: 9, color: C + '66', whiteSpace: 'nowrap' }}>
          drop here
        </div>
      )}
    </div>
  );
}

// PatientFrontPixel — full-body chibi patient, same identity as Forin.FacePatient.
//
// ViewBox is 24 × 72 — width:height = 1:3, matching the host card's inner
// padded box almost exactly so the body fills it edge to edge.
//
// Body part vertical layout (in viewBox units):
//   y  0  -  3   hair crown
//   y  3  - 10   face (forehead / eyes / blush / mouth)
//   y 10  - 12   neck
//   y 12  - 18   shoulders + chest top
//   y 14  - 32   arms (upper / forearm / hand)
//   y 18  - 38   torso (gown) with red cross at mid-line
//   y 38  - 44   hips
//   y 44  - 54   thighs
//   y 54  - 56   knees
//   y 56  - 66   calves
//   y 66  - 68   ankles
//   y 68  - 71   feet
function PatientFrontPixel() {
  // Smooth vector style — matches the main Derp/Smooth character art (soft
  // INK outline, same skin/gown palette, derp small-dot face) — but drawn
  // with ANATOMICAL proportions (distinct shoulder/abdomen/wrist/thigh/calf/
  // ankle) so the body-part labeling dots still align. Same 24×72 viewBox
  // and landmark y-bands as before, so the dot coords are unchanged.
  const INK    = '#3A2E26';
  const skin   = '#F8D7B2';
  const skinSh = '#E0A876';
  const hair   = '#5C3A1A';
  const hairLt = '#7A5230';
  const gown   = '#FED7AA';
  const gownDk = '#C99066';
  const gownHi = '#FFE4BD';
  const cross  = '#EF4444';
  const idBand = '#3B82F6';
  const sw = 0.6;

  return (
    <svg
      viewBox="0 0 24 72"
      width="100%" height="100%"
      preserveAspectRatio="xMidYMid meet"
      style={{ position: 'relative', zIndex: 1, display: 'block' }}
    >
      {/* ─── DROP SHADOW ─── */}
      <ellipse cx="12" cy="71.2" rx="8" ry="0.6" fill={INK} opacity="0.18"/>

      {/* ─── HAIR back (frames the head) ─── */}
      <path d="M5 9 Q4 1 12 0.5 Q20 1 19 9 Q19 4 12 3 Q5 4 5 9 Z" fill={hair}/>

      {/* ─── LEGS (behind torso/hips) ─── */}
      {/* HIPS / GROIN — bridges gown hem (y38.5) to thigh tops (y43) */}
      <path d="M6 38 Q6 42 8 44 L16 44 Q18 42 18 38 Z" fill={skin} stroke={INK} strokeWidth={sw} strokeLinejoin="round"/>
      <rect x="16.4" y="39" width="1.2" height="4.5" rx="0.6" fill={skinSh} opacity="0.5"/>
      {/* THIGHS y44-54 */}
      <path d="M7 43 Q7 49 8 54 L11 54 Q11 49 11 43 Z" fill={skin} stroke={INK} strokeWidth={sw} strokeLinejoin="round"/>
      <path d="M13 43 Q13 49 13 54 L16 54 Q17 49 17 43 Z" fill={skin} stroke={INK} strokeWidth={sw} strokeLinejoin="round"/>
      <rect x="9.6" y="44" width="1.2" height="10" rx="0.6" fill={skinSh} opacity="0.5"/>
      <rect x="15"  y="44" width="1.2" height="10" rx="0.6" fill={skinSh} opacity="0.5"/>
      {/* KNEES y54-56 */}
      <ellipse cx="9.3"  cy="55" rx="2" ry="1.4" fill={skinSh}/>
      <ellipse cx="14.7" cy="55" rx="2" ry="1.4" fill={skinSh}/>
      {/* CALVES y56-66 (narrower) */}
      <path d="M8 56 Q7.5 61 8.5 66 L10.8 66 Q11 61 10.8 56 Z" fill={skin} stroke={INK} strokeWidth={sw} strokeLinejoin="round"/>
      <path d="M13.2 56 Q13 61 13.2 66 L15.5 66 Q16.5 61 16 56 Z" fill={skin} stroke={INK} strokeWidth={sw} strokeLinejoin="round"/>
      {/* ANKLES y66-68 (narrowest) + FEET */}
      <path d="M8.4 66 L10.6 66 L11 70 Q9.4 71 7.6 70 Z" fill={skin} stroke={INK} strokeWidth={sw} strokeLinejoin="round"/>
      <path d="M13.4 66 L15.6 66 L16.4 70 Q14.6 71 13 70 Z" fill={skin} stroke={INK} strokeWidth={sw} strokeLinejoin="round"/>

      {/* ─── ARMS (behind torso edges) ─── */}
      {/* upper-arm sleeves */}
      <path d="M3.5 14 Q2 17 2.5 20 L5 20 Q5 16 5.5 14 Z" fill={gown} stroke={INK} strokeWidth={sw} strokeLinejoin="round"/>
      <path d="M20.5 14 Q22 17 21.5 20 L19 20 Q19 16 18.5 14 Z" fill={gown} stroke={INK} strokeWidth={sw} strokeLinejoin="round"/>
      {/* forearms (skin) */}
      <path d="M2.5 20 Q2.3 24 3 28 L5 28 Q5.2 24 5 20 Z" fill={skin} stroke={INK} strokeWidth={sw} strokeLinejoin="round"/>
      <path d="M21.5 20 Q21.7 24 21 28 L19 28 Q18.8 24 19 20 Z" fill={skin} stroke={INK} strokeWidth={sw} strokeLinejoin="round"/>
      {/* hands */}
      <ellipse cx="4"  cy="29.5" rx="1.7" ry="1.8" fill={skin} stroke={INK} strokeWidth={sw}/>
      <ellipse cx="20" cy="29.5" rx="1.7" ry="1.8" fill={skin} stroke={INK} strokeWidth={sw}/>
      {/* ID band on right wrist (image-right) */}
      <rect x="18.6" y="27" width="2.8" height="1.4" rx="0.5" fill={idBand} stroke={INK} strokeWidth="0.3"/>

      {/* ─── TORSO (hospital gown) ─── */}
      <path d="M5 13 Q4 13 4 14.5 L5 37.5 Q5 38.5 6 38.5 L18 38.5 Q19 38.5 19 37.5 L20 14.5 Q20 13 19 13 Z"
            fill={gown} stroke={INK} strokeWidth={sw} strokeLinejoin="round"/>
      {/* shoulders cap */}
      <path d="M4.5 13.5 Q12 11 19.5 13.5 L19 15 Q12 12.8 5 15 Z" fill={gownHi}/>
      {/* fold shading */}
      <rect x="5" y="15" width="1.4" height="22" rx="0.7" fill={gownHi} opacity="0.7"/>
      <rect x="17.6" y="15" width="1.4" height="22" rx="0.7" fill={gownDk} opacity="0.6"/>
      {/* neckline V */}
      <path d="M10 13 L12 16 L14 13 Z" fill={skin}/>
      {/* red medical cross (abdomen marker, y22) */}
      <rect x="10.2" y="22" width="3.6" height="1.4" rx="0.4" fill={cross}/>
      <rect x="11.3" y="20.9" width="1.4" height="3.6" rx="0.4" fill={cross}/>

      {/* ─── NECK ─── */}
      <path d="M10 9.5 L10 12.5 Q12 13.5 14 12.5 L14 9.5 Z" fill={skin} stroke={INK} strokeWidth={sw} strokeLinejoin="round"/>
      <path d="M10 11.8 Q12 12.8 14 11.8" fill="none" stroke={skinSh} strokeWidth="0.5"/>

      {/* ─── HEAD ─── */}
      <ellipse cx="12" cy="6" rx="6" ry="6" fill={skin} stroke={INK} strokeWidth={sw}/>
      {/* face shading right */}
      <path d="M14 1.5 Q18 6 14 10.5 Q16.5 6 14 1.5 Z" fill={skinSh} opacity="0.35"/>
      {/* hair front (bob) */}
      <path d="M6 7 Q6 0.5 12 0.5 Q18 0.5 18 7 Q16.5 3.5 12.5 3.2 Q13.2 4.5 11.5 4.8 Q9.5 3.2 9 4.6 Q7.5 3.6 6 7 Z" fill={hair}/>
      <path d="M8 3.2 Q12 1 16 3.4" fill="none" stroke={hairLt} strokeWidth="0.7" strokeLinecap="round"/>
      {/* hair sides past jaw */}
      <path d="M6 6 Q5 9 6.5 11 L7.5 10.5 Q6.5 8 7 6 Z" fill={hair}/>
      <path d="M18 6 Q19 9 17.5 11 L16.5 10.5 Q17.5 8 17 6 Z" fill={hair}/>
      {/* derp small-dot eyes */}
      <circle cx="9.8"  cy="6.4" r="0.9" fill={INK}/>
      <circle cx="14.2" cy="6.4" r="0.9" fill={INK}/>
      {/* blush */}
      <ellipse cx="8.3"  cy="8" rx="1.2" ry="0.8" fill="#F9A8B4" opacity="0.5"/>
      <ellipse cx="15.7" cy="8" rx="1.2" ry="0.8" fill="#F9A8B4" opacity="0.5"/>
      {/* wobbly blank mouth */}
      <path d="M10.6 8.7 Q11.5 8.3 12 8.7 Q12.5 9.1 13.4 8.7" fill="none" stroke={INK} strokeWidth="0.6" strokeLinecap="round"/>
    </svg>
  );
}

function AnatomyTile({ w, focused, used }) {
  const t = window.ForinTokens;
  const C = '#2A2522';
  return (
    <div style={{
      background: used ? C + '22' : (focused ? t.yellow : '#fff'),
      color: used ? '#9CA3AF' : C,
      border: `2.5px solid ${C}`,
      boxShadow: used ? 'none' : `2.5px 2.5px 0 0 ${focused ? t.yellowShadow : C}`,
      padding: '7px 4px', textAlign: 'center',
      fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 11,
      position: 'relative',
      transform: focused ? 'translate(-1px,-1px)' : 'none',
      textDecoration: used ? 'line-through' : 'none',
    }}>
      {w}
      {focused && <div style={{ position: 'absolute', top: -6, right: -6, width: 12, height: 12, background: '#EF4444', color: '#fff', border: `1.5px solid ${C}`, fontFamily: '"DungGeunMo",monospace', fontSize: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>!</div>}
    </div>
  );
}

Object.assign(window, { ScreenQuizAnatomy });
