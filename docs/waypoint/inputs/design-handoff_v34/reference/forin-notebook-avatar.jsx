// forin-notebook-avatar.jsx — NbAvatar 레이어 조합 아바타 시스템 (근무 수첩 그림체)
// 문법: 2px 잉크(#3E362B) 외곽선 + 플랫 파스텔 필 + 점눈/선입 · 64×70 흉상 프레임
// 레이어 순서: bg → 뒷머리 → 옷 → 얼굴 → 입 → 눈 → 앞머리 → 모자 → 액세서리
(function () {
  const K = '#3E362B', W = 2;
  const S = { stroke: K, strokeWidth: W, strokeLinejoin: 'round', strokeLinecap: 'round' };
  const SN = { ...S, fill: 'none' };

  // ── 팔레트 ──
  const SKINS = { pale: '#FBEEDD', ivory: '#F9E4C8', beige: '#F6DCC0', tan: '#EFC49E', warm: '#E3AC7E', olive: '#C99465', brown: '#A97250', deep: '#7E5236' };
  const HAIRC = { black: '#2B2622', darkbrown: '#4A382A', brown: '#6B4E36', lightbrown: '#8A6A4A', blonde: '#D9B36B', ash: '#9A9388', gray: '#C9C2B8', white: '#EFE9DD', red: '#A85638', navy: '#3D4A63', pink: '#D9938F', mint: '#8FB8A5' };
  const OUTC = { sage: '#B8CBB0', navy: '#5B6E8C', burgundy: '#9C5A5A', lilac: '#C3B3D6', sky: '#A9CBE3', peach: '#F0C4A8', charcoal: '#6E6A63', mint: '#A8D9C3', yellow: '#E9D98A', rose: '#E3AEB4', white: '#FFFdf4', teal: '#7FAFAF' };

  // ── 배경 (10) ──
  const BGS = {
    plain: () => <rect x="0" y="0" width="64" height="70" fill="#F1EBDD"/>,
    lines: () => <g><rect width="64" height="70" fill="#F1EBDD"/>{[14,26,38,50,62].map(y => <line key={y} x1="0" y1={y} x2="64" y2={y} stroke="rgba(62,54,43,.14)" strokeWidth="1"/>)}</g>,
    grid: () => <g><rect width="64" height="70" fill="#F6F1E4"/>{[12,24,36,48,60].map(y => <line key={'h'+y} x1="0" y1={y} x2="64" y2={y} stroke="rgba(74,111,165,.16)" strokeWidth="1"/>)}{[12,24,36,48,60].map(x => <line key={'v'+x} x1={x} y1="0" x2={x} y2="70" stroke="rgba(74,111,165,.16)" strokeWidth="1"/>)}</g>,
    washSky: () => <rect width="64" height="70" fill="#DCEAF2"/>,
    washPink: () => <rect width="64" height="70" fill="#F6E0DC"/>,
    washMint: () => <rect width="64" height="70" fill="#DFEDE2"/>,
    washYellow: () => <rect width="64" height="70" fill="#F5ECC8"/>,
    window: () => <g><rect width="64" height="70" fill="#E8EEF0"/><rect x="10" y="8" width="44" height="34" fill="#C7E0EE" stroke={K} strokeWidth="1.6"/><line x1="32" y1="8" x2="32" y2="42" stroke={K} strokeWidth="1.4"/><line x1="10" y1="25" x2="54" y2="25" stroke={K} strokeWidth="1.4"/><path d="M14 20 Q18 16 22 20 M40 14 Q44 10 48 14" fill="none" stroke="#fff" strokeWidth="2"/></g>,
    stripe: () => <g><rect width="64" height="70" fill="#F1EBDD"/>{[0,16,32,48].map(x => <rect key={x} x={x} y="0" width="8" height="70" fill="rgba(249,227,123,.4)"/>)}</g>,
    stamps: () => <g><rect width="64" height="70" fill="#F1EBDD"/><circle cx="12" cy="14" r="7" fill="none" stroke="rgba(199,81,70,.4)" strokeWidth="1.4"/><circle cx="54" cy="22" r="6" fill="none" stroke="rgba(74,111,165,.4)" strokeWidth="1.4"/><circle cx="50" cy="56" r="7" fill="none" stroke="rgba(95,141,90,.4)" strokeWidth="1.4"/><circle cx="10" cy="52" r="5" fill="none" stroke="rgba(199,126,46,.4)" strokeWidth="1.4"/></g>,
    dots: () => <g><rect width="64" height="70" fill="#F1EBDD"/>{[[8,10],[24,6],[44,12],[58,8],[6,30],[58,34],[10,58],[30,64],[52,60]].map((p,i) => <circle key={i} cx={p[0]} cy={p[1]} r="2" fill="rgba(62,54,43,.16)"/>)}</g>,
  };

  // ── 뒷머리 (hc = 머리색) ──
  const BACK = {
    none: () => null, baldFringe: () => null, short: () => null, part: () => null, buzz: () => null, curlyShort: () => null, fringe: () => null, spiky: () => null, bald: () => null,
    bob: (hc) => <path d="M18.9 24 A15.2 15.2 0 0 1 45.1 24 L49 44 Q44 48 41 44 L41 30 Q32 26 23 30 L23 44 Q20 48 15 44 Z" fill={hc} {...S}/>,

    ponytail: (hc) => <g><path d="M44 16 Q58 17 57 31 Q56 45 50 54 Q46 57 47 49 Q51 37 46 25 Z" fill={hc} {...S}/><circle cx="46" cy="19" r="2.6" fill="#C75146" stroke={K} strokeWidth="1.4"/></g>,
    bun: (hc) => <circle cx="32" cy="12.5" r="6" fill={hc} {...S}/>,
    twintails: (hc) => <g><path d="M15 24 Q7 29 8 42 Q9 53 14 59 Q18 61 17 53 Q14 42 17 30 Z" fill={hc} {...S}/><path d="M49 24 Q57 29 56 42 Q55 53 50 59 Q46 61 47 53 Q50 42 47 30 Z" fill={hc} {...S}/><circle cx="16" cy="27" r="2.4" fill="#4A6FA5" stroke={K} strokeWidth="1.4"/><circle cx="48" cy="27" r="2.4" fill="#4A6FA5" stroke={K} strokeWidth="1.4"/></g>,
    longStraight: (hc) => <path d="M18.9 24 A15.2 15.2 0 0 1 45.1 24 L49 59 Q44 63.5 32 63.5 Q20 63.5 15 59 Z" fill={hc} {...S}/>,
    curlyLong: (hc) => <path d="M18.9 24 A15.2 15.2 0 0 1 45.1 24 Q50 30 48 36 Q52 44 48 50 Q51 58 45 61 Q39 63 32 63 Q25 63 19 61 Q13 58 16 50 Q12 44 16 36 Q14 30 18.9 24 Z" fill={hc} {...S}/>,
    afro: (hc) => <g><circle cx="20" cy="18" r="9" fill={hc} {...S}/><circle cx="44" cy="18" r="9" fill={hc} {...S}/><circle cx="32" cy="12" r="10" fill={hc} {...S}/><circle cx="15" cy="28" r="6" fill={hc} {...S}/><circle cx="49" cy="28" r="6" fill={hc} {...S}/></g>,
    braid: (hc) => <g>{[26,34,41,47].map((y,i) => <circle key={y} cx={51 - i} cy={y} r={4.4 - i * 0.4} fill={hc} {...S}/>)}<path d="M47.5 52 L46.5 56 M49 52 L50 56" {...SN} strokeWidth="1.5"/></g>,
    wavyMid: (hc) => <path d="M18.9 24 A15.2 15.2 0 0 1 45.1 24 Q51 31 47 38 Q52 45 47 50 Q43 53 32 53 Q21 53 17 50 Q12 45 17 38 Q13 31 18.9 24 Z" fill={hc} {...S}/>,
    wavyLong: (hc) => <path d="M18.9 24 A15.2 15.2 0 0 1 45.1 24 Q51 31 47 38 Q52 45 48 51 Q52 58 46 62 Q40 64 32 64 Q24 64 18 62 Q12 58 16 51 Q12 45 17 38 Q13 31 18.9 24 Z" fill={hc} {...S}/>,
  };

  // ── 앞머리 (16) ──
  const FRONT = {
    none: () => null, bald: () => null,
    short: (hc) => <path d="M19.9 25 A13.7 13.7 0 0 1 44.1 25 L45 30 Q32 25 19 30 Z" fill={hc} {...S}/>,
    part: (hc) => <path d="M19.9 25 A13.7 13.7 0 0 1 44.1 25 L45 31 Q42 24 38 21 Q30 29 19 30 Z" fill={hc} {...S}/>,
    buzz: (hc) => <g><path d="M20.2 24 A13.7 13.7 0 0 1 43.8 24 L45 26 Q32 21 19 26 Z" fill={hc} opacity=".55" {...S}/><g fill={K} opacity=".5">{[24,29,34,39].map(x => <circle key={x} cx={x} cy="16" r=".8"/>)}</g></g>,
    curlyShort: (hc) => <g><circle cx="22.5" cy="21.5" r="5.2" fill={hc} {...S}/><circle cx="32" cy="17.5" r="6.2" fill={hc} {...S}/><circle cx="41.5" cy="21.5" r="5.2" fill={hc} {...S}/><path d="M18 26 Q32 20 46 26 L45 29 Q32 24 19 29 Z" fill={hc} stroke="none"/></g>,
    bob: (hc) => <path d="M19.9 25 A13.7 13.7 0 0 1 44.1 25 L45 30 Q32 24 19 30 Z" fill={hc} {...S}/>,
    midPart: (hc) => <path d="M19.9 25 A13.7 13.7 0 0 1 44.1 25 L45 30 Q39 23 33.5 29 L32 26.5 L30.5 29 Q25 23 19 30 Z" fill={hc} {...S}/>,
    ponytail: (hc) => <path d="M19.9 25 A13.7 13.7 0 0 1 44.1 25 L46 28 Q32 22 19 30 Z" fill={hc} {...S}/>,
    bun: (hc) => <path d="M19.9 25 A13.7 13.7 0 0 1 44.1 25 L45 29 Q32 23 19 29 Z" fill={hc} {...S}/>,
    twintails: (hc) => <path d="M19.9 25 A13.7 13.7 0 0 1 44.1 25 L45 30 Q40 23 32 23 Q24 23 19 30 Z" fill={hc} {...S}/>,
    longStraight: (hc) => <path d="M19.9 25 A13.7 13.7 0 0 1 44.1 25 L45 29 Q32 23 19 29 Z" fill={hc} {...S}/>,
    curlyLong: (hc) => <g><circle cx="23" cy="21.5" r="4.8" fill={hc} {...S}/><circle cx="32" cy="18" r="5.8" fill={hc} {...S}/><circle cx="41" cy="21.5" r="4.8" fill={hc} {...S}/><path d="M19 26 Q32 20 45 26 L44.5 29 Q32 24 19.5 29 Z" fill={hc} stroke="none"/></g>,
    fringe: (hc) => <path d="M19.9 25 A13.7 13.7 0 0 1 44.1 25 L45 28 L41 25 L37 28 L32 25 L27 28 L23 25 L19 28 Z" fill={hc} {...S}/>,
    spiky: (hc) => <path d="M19 26 L17 12 L23 17 L26 8 L31 15 L36 7 L39 15 L45 10 L45 26 Q32 21 19 26 Z" fill={hc} {...S}/>,
    afro: (hc) => <path d="M19 26 Q18 18 32 18 Q46 18 45 26 Q32 22 19 26 Z" fill={hc} stroke="none"/>,
    braid: (hc) => <path d="M19.9 25 A13.7 13.7 0 0 1 44.1 25 L46 28 Q32 22 19 30 Z" fill={hc} {...S}/>,
    wavyMid: (hc) => <path d="M19.9 25 A13.7 13.7 0 0 1 44.1 25 L44.5 29 Q41 25.5 37 28 Q34.5 24.5 32 27.5 Q29.5 24.5 27 28 Q23 25.5 19.5 29 Z" fill={hc} {...S}/>,
    wavyLong: (hc) => <path d="M19.9 25 A13.7 13.7 0 0 1 44.1 25 L44.5 29 Q41 25.5 37 28 Q34.5 24.5 32 27.5 Q29.5 24.5 27 28 Q23 25.5 19.5 29 Z" fill={hc} {...S}/>,
    baldFringe: (hc) => <g><path d="M20.4 27 A12.6 12.6 0 0 0 20 36" fill="none" stroke={hc} strokeWidth="3" strokeLinecap="round"/><path d="M43.6 27 A12.6 12.6 0 0 1 44 36" fill="none" stroke={hc} strokeWidth="3" strokeLinecap="round"/><path d="M26.5 17.6 Q32 15.6 37.5 17.6 M27.5 20 Q32 18.4 36.5 20" fill="none" stroke={hc} strokeWidth="1.6" strokeLinecap="round"/></g>,
  };
  // 스타일 키(뒤+앞 자동 매칭)
  const HAIRS = ['short','part','midPart','buzz','curlyShort','bob','ponytail','bun','twintails','longStraight','curlyLong','wavyMid','wavyLong','fringe','spiky','afro','braid','baldFringe','bald'];

  // ── 눈 (12) ──
  const EYES = {
    dot: () => <g><circle cx="27" cy="31" r="1.6" fill={K}/><circle cx="37" cy="31" r="1.6" fill={K}/></g>,
    lash: () => <g><circle cx="27" cy="31" r="1.6" fill={K}/><circle cx="37" cy="31" r="1.6" fill={K}/><path d="M24 28.5 L22.5 27.5 M40 28.5 L41.5 27.5" {...SN} strokeWidth="1.4"/></g>,
    happy: () => <g><path d="M24.5 31.5 Q27 28.5 29.5 31.5 M34.5 31.5 Q37 28.5 39.5 31.5" {...SN} strokeWidth="1.7"/></g>,
    closed: () => <g><path d="M24.5 31 H29.5 M34.5 31 H39.5" {...SN} strokeWidth="1.7"/></g>,
    round: () => <g><circle cx="27" cy="31" r="3" fill="#fff" stroke={K} strokeWidth="1.5"/><circle cx="37" cy="31" r="3" fill="#fff" stroke={K} strokeWidth="1.5"/><circle cx="27.6" cy="31.4" r="1.3" fill={K}/><circle cx="37.6" cy="31.4" r="1.3" fill={K}/></g>,
    sleepy: () => <g><path d="M24.5 30 Q27 32.5 29.5 30 M34.5 30 Q37 32.5 39.5 30" {...SN} strokeWidth="1.7"/></g>,
    wink: () => <g><circle cx="27" cy="31" r="1.6" fill={K}/><path d="M34.5 31 Q37 29 39.5 31" {...SN} strokeWidth="1.7"/></g>,
    uu: () => <g><path d="M25 29.5 L29 32.5 M29 29.5 L25 32.5 M35 29.5 L39 32.5 M39 29.5 L35 32.5" {...SN} strokeWidth="1.5"/></g>,
    side: () => <g><circle cx="28.4" cy="31" r="1.6" fill={K}/><circle cx="38.4" cy="31" r="1.6" fill={K}/></g>,
    sparkle: () => <g><circle cx="27" cy="31" r="2.2" fill={K}/><circle cx="37" cy="31" r="2.2" fill={K}/><circle cx="27.9" cy="30.2" r=".8" fill="#fff"/><circle cx="37.9" cy="30.2" r=".8" fill="#fff"/></g>,
    droopy: () => <g><path d="M24.5 30 L29.5 31.8 M39.5 30 L34.5 31.8" {...SN} strokeWidth="1.6"/><circle cx="27" cy="33" r="1.3" fill={K}/><circle cx="37" cy="33" r="1.3" fill={K}/></g>,
    weary: () => <g><path d="M24.5 30 H29.5 M34.5 30 H39.5" {...SN} strokeWidth="1.7"/><path d="M25 33.5 Q27 34.6 29 33.5 M35 33.5 Q37 34.6 39 33.5" {...SN} strokeWidth="1.1" opacity=".55"/></g>,
    worried: () => <g><circle cx="27" cy="31.5" r="1.6" fill={K}/><circle cx="37" cy="31.5" r="1.6" fill={K}/><path d="M29.5 26.2 L24 28.3 M34.5 26.2 L40 28.3" {...SN} strokeWidth="1.4"/></g>,
    angry: () => <g><circle cx="27" cy="31.5" r="1.6" fill={K}/><circle cx="37" cy="31.5" r="1.6" fill={K}/><path d="M24 26.2 L29.5 28.3 M40 26.2 L34.5 28.3" {...SN} strokeWidth="1.4"/></g>,
    brow: () => <g><circle cx="27" cy="31" r="1.6" fill={K}/><circle cx="37" cy="31" r="1.6" fill={K}/><path d="M24.5 27 Q27 25.8 29.5 27 M34.5 27 Q37 25.8 39.5 27" {...SN} strokeWidth="1.3"/></g>,
  };

  // ── 입 (12) ──
  const MOUTHS = {
    line: () => <path d="M28 38 H36" {...SN}/>,
    smile: () => <path d="M28 37.5 Q32 40.5 36 37.5" {...SN}/>,
    grin: () => <path d="M27 37 Q32 43 37 37 Z" fill="#fff" {...S} strokeWidth="1.6"/>,
    laugh: () => <g><path d="M27 36.5 Q32 43.5 37 36.5 Z" fill="#7A4A3A" {...S} strokeWidth="1.6"/><path d="M29 40.5 Q32 42.4 35 40.5 L35 41.3 Q32 42.8 29 41.3 Z" fill="#E8A0A0" stroke="none"/></g>,
    pout: () => <path d="M29 39 Q32 36.8 35 39" {...SN}/>,
    o: () => <ellipse cx="32" cy="38.5" rx="2.4" ry="3" fill="#7A4A3A" stroke={K} strokeWidth="1.5"/>,
    wave: () => <path d="M27.5 38 Q29.5 36.6 31.5 38 Q33.5 39.4 36.5 38" {...SN} strokeWidth="1.7"/>,
    smirk: () => <path d="M28.5 38.5 Q33 39.6 36 36.8" {...SN}/>,
    tongue: () => <g><path d="M28 37.5 Q32 40.5 36 37.5" {...SN}/><path d="M31 39.4 Q32 42 34 40.6 Q34.6 39 33.4 38.4 Z" fill="#E8A0A0" stroke={K} strokeWidth="1.2"/></g>,
    frown: () => <path d="M28.5 39.5 Q32 36.8 35.5 39.5" {...SN} strokeWidth="1.8"/>,
    teeth: () => <g><path d="M27 37 Q32 42.6 37 37 Z" fill="#fff" {...S} strokeWidth="1.6"/><line x1="30" y1="37.4" x2="30" y2="39.4" stroke={K} strokeWidth=".9"/><line x1="34" y1="37.4" x2="34" y2="39.4" stroke={K} strokeWidth=".9"/></g>,
    pain: () => <path d="M27.5 38.5 L29.5 37.2 L31.5 38.8 L33.5 37.2 L35.5 38.8 L36.8 37.6" {...SN} strokeWidth="1.6"/>,
    clench: () => <g><path d="M27 36.8 H37 L36 40.6 H28 Z" fill="#fff" {...S} strokeWidth="1.5"/><line x1="30.2" y1="37" x2="30.2" y2="40.3" stroke={K} strokeWidth=".9"/><line x1="33.8" y1="37" x2="33.8" y2="40.3" stroke={K} strokeWidth=".9"/></g>,
    hmm: () => <g><path d="M28 38.5 H35" {...SN}/><circle cx="38.6" cy="38.5" r=".9" fill={K}/></g>,
  };

  // ── 옷 (12, oc = 옷색) — 어깨선 y52, 밑단 y70 ──
  const torso = 'M14 70 Q16 52 32 52 Q48 52 50 70';
  const OUTFITS = {
    scrubV: (oc) => <g><path d={torso} fill={oc} {...S}/><path d="M27 53 L32 59 L37 53" {...SN} strokeWidth="1.7"/></g>,
    scrubPocket: (oc) => <g><path d={torso} fill={oc} {...S}/><path d="M27 53 L32 59 L37 53" {...SN} strokeWidth="1.7"/><rect x="38" y="61" width="7.5" height="7" fill="rgba(255,255,255,.4)" stroke={K} strokeWidth="1.3"/><line x1="40" y1="60" x2="40" y2="64" stroke={K} strokeWidth="1.5"/></g>,
    dress: (oc) => <g><path d={torso} fill={oc} {...S}/><path d="M25 53 Q32 57 39 53" {...SN} strokeWidth="1.6"/><circle cx="32" cy="61" r="1" fill={K}/><circle cx="32" cy="66" r="1" fill={K}/></g>,
    labCoat: (oc) => <g><path d={torso} fill="#F4EEE0" {...S}/><path d="M28 52 L26 70 M36 52 L38 70" {...SN} strokeWidth="1.5"/><path d="M28 52 L32 58 L36 52" fill={oc} {...S} strokeWidth="1.5"/><line x1="32" y1="58" x2="32" y2="70" stroke={K} strokeWidth="1.3"/></g>,
    surgGown: (oc) => <g><path d={torso} fill={oc} {...S}/><path d="M24 54 Q32 51 40 54" {...SN} strokeWidth="1.6"/><path d="M20 60 L44 60" stroke={K} strokeWidth="1.2" strokeDasharray="2.5 2.5" fill="none"/></g>,
    isoGown: (oc) => <g><path d={torso} fill="#E9D98A" {...S}/><path d="M25 53 Q32 56 39 53" {...SN} strokeWidth="1.5"/><path d="M23 58 Q32 61 41 58 M21 64 Q32 67 43 64" fill="none" stroke={K} strokeWidth="1" opacity=".5"/></g>,
    polo: (oc) => <g><path d={torso} fill={oc} {...S}/><path d="M27 52 L29 57 L32 54 L35 57 L37 52" fill="#fff" {...S} strokeWidth="1.4"/><circle cx="32" cy="58.5" r=".8" fill={K}/></g>,
    knit: (oc) => <g><path d={torso} fill={oc} {...S}/><path d="M25 54 Q32 58 39 54" {...SN} strokeWidth="1.5"/><path d="M22 62 L26 58 M28 64 L32 60 M34 64 L38 60 M40 64 L44 60" fill="none" stroke={K} strokeWidth="1" opacity=".4"/></g>,
    hoodie: (oc) => <g><path d={torso} fill={oc} {...S}/><path d="M22 56 Q32 62 42 56 L42 52 Q32 58 22 52 Z" fill={oc} {...S} strokeWidth="1.6"/><path d="M29 59 L29 64 M35 59 L35 64" {...SN} strokeWidth="1.4"/></g>,
    shirt: (oc) => <g><path d={torso} fill="#FDFAF0" {...S}/><path d="M28 52 L32 57 L36 52 M32 57 L32 70" {...SN} strokeWidth="1.4"/><path d="M30 58 L32 61 L34 58 L32 66 Z" fill={oc} {...S} strokeWidth="1.3"/></g>,
    tshirt: (oc) => <g><path d={torso} fill={oc} {...S}/><path d="M26.5 53 Q32 56.5 37.5 53" {...SN} strokeWidth="1.6"/></g>,
    hospitalGown: (oc) => <g><path d={torso} fill={oc} {...S}/><path d="M26 53 L32 60 L38 53" {...SN} strokeWidth="1.6"/>{[[24,63],[32,65],[40,63],[27,68],[37,68]].map((p,i) => <circle key={i} cx={p[0]} cy={p[1]} r="1" fill="rgba(255,255,255,.75)"/>)}<path d="M20 57 L26 55" {...SN} strokeWidth="1.1" opacity=".5"/></g>,
    paramedic: (oc) => <g><path d={torso} fill={oc} {...S}/><path d="M25 53 L28 56 L32 54 L36 56 L39 53" {...SN} strokeWidth="1.4"/><path d="M17 60 Q32 64 47 60 L47 63.5 Q32 67.5 17 63.5 Z" fill="#E9C45A" {...S} strokeWidth="1.4"/><line x1="32" y1="54" x2="32" y2="70" stroke={K} strokeWidth="1.3"/></g>,
    security: (oc) => <g><path d={torso} fill={oc} {...S}/><path d="M20 54.5 L27 53 M44 54.5 L37 53" {...SN} strokeWidth="2.2"/><line x1="32" y1="53" x2="32" y2="70" stroke={K} strokeWidth="1.2"/><circle cx="32" cy="58" r=".9" fill={K}/><circle cx="32" cy="63" r=".9" fill={K}/><circle cx="24" cy="61" r="2.4" fill="#E9C45A" stroke={K} strokeWidth="1.2"/></g>,
    suit: (oc) => <g><path d={torso} fill={oc} {...S}/><path d="M28 52 L32 58 L36 52 Z" fill="#FDFAF0" {...S} strokeWidth="1.3"/><path d="M28 52 L31 62 L32 58 M36 52 L33 62 L32 58" {...SN} strokeWidth="1.4"/><path d="M30.8 58 L32 60 L33.2 58 L32 65 Z" fill="#9C5A5A" {...S} strokeWidth="1.1"/></g>,
    cardigan: (oc) => <g><path d={torso} fill={oc} {...S}/><path d="M27 52 L32 59 L37 52 Z" fill="#FDFAF0" {...S} strokeWidth="1.3"/><path d="M28 53 L28 70 M36 53 L36 70" {...SN} strokeWidth="1.2"/><circle cx="32" cy="62" r=".9" fill={K}/><circle cx="32" cy="66.5" r=".9" fill={K}/></g>,
    coverall: (oc) => <g><circle cx="32" cy="32" r="17" fill={oc} {...S}/><path d={torso} fill={oc} {...S}/><line x1="32" y1="52" x2="32" y2="70" stroke={K} strokeWidth="1.2" strokeDasharray="2.5 2"/><path d="M22 58 Q32 61 42 58" fill="none" stroke={K} strokeWidth="1" opacity=".4"/></g>,
    apron: (oc) => <g><path d={torso} fill="#F4EEE0" {...S}/><path d="M24 55 L24 70 L40 70 L40 55 Q32 52 24 55 Z" fill={oc} {...S} strokeWidth="1.6"/><path d="M27 62 H37" stroke={K} strokeWidth="1.1" opacity=".5" fill="none"/></g>,
  };

  // ── 모자 (11) ──
  const HATS = {
    none: () => null,
    nurseCap: () => <g><path d="M22 13 L32 5 L42 13 L40 17 Q32 14 24 17 Z" fill="#fff" {...S} strokeWidth="1.7"/><path d="M30 11 H34 M32 9 V13" stroke="#C75146" strokeWidth="1.4" fill="none"/></g>,
    scrubCap: (oc) => <path d="M18.8 23 A16 16 0 0 1 45.2 23 L44 24 Q32 19 20 24 Z" fill={oc || '#A9CBE3'} {...S}/>,
    scrubCapDot: (oc) => <g><path d="M18.8 23 A16 16 0 0 1 45.2 23 L44 24 Q32 19 20 24 Z" fill={oc || '#C3B3D6'} {...S}/>{[[25,15],[32,12],[39,15],[28,19],[36,19]].map((p,i) => <circle key={i} cx={p[0]} cy={p[1]} r="1.1" fill="#fff"/>)}</g>,
    beanie: (oc) => <g><path d="M18.9 24 A15.2 15.2 0 0 1 45.1 24 L44 26 Q32 22 20 26 Z" fill={oc || '#9C5A5A'} {...S}/><path d="M20 22 Q32 18 44 22" {...SN} strokeWidth="1.3"/><circle cx="32" cy="7.5" r="2.6" fill={oc || '#9C5A5A'} {...S} strokeWidth="1.5"/></g>,
    cap: (oc) => <g><path d="M20.2 22 A15.5 15.5 0 0 1 43.8 22 L44 23 Q32 19 20 23 Z" fill={oc || '#5B6E8C'} {...S}/><path d="M42 20 Q52 20 53 24 Q45 23 42 24 Z" fill={oc || '#5B6E8C'} {...S} strokeWidth="1.6"/><circle cx="32" cy="9" r="1.2" fill={K}/></g>,
    gradCap: () => <g><path d="M14 15 L32 8 L50 15 L32 22 Z" fill="#4A4438" {...S}/><path d="M26 18 L26 24 Q32 27 38 24 L38 18" fill="#4A4438" {...S} strokeWidth="1.5"/><path d="M46 17 L46 25" {...SN} strokeWidth="1.3"/><circle cx="46" cy="27" r="1.8" fill="#E9C45A" stroke={K} strokeWidth="1.2"/></g>,
    party: () => <g><path d="M26 18 L32 2 L38 18 Z" fill="#F4A49B" {...S}/><circle cx="32" cy="2.5" r="2" fill="#E9C45A" stroke={K} strokeWidth="1.3"/><path d="M28 13 H36 M29.5 8.5 H34.5" stroke="#fff" strokeWidth="1.6" fill="none"/></g>,
    beret: (oc) => <g><path d="M18 18 Q16 7 33 7 Q48 8 45 17 Q38 13 30 15 Q22 17 18 18 Z" fill={oc || '#C75146'} {...S}/><circle cx="33" cy="6" r="1.6" fill={K}/></g>,
    securityCap: (oc) => <g><path d="M20 20 A15 15 0 0 1 44 20 L44.5 22.5 Q32 18 19.5 22.5 Z" fill={oc || '#4A4438'} {...S}/><path d="M20 21.5 Q32 17.5 44 21.5" fill="none" stroke="#E9C45A" strokeWidth="1.6"/><path d="M25 21.8 Q32 26 39 21.8 L39 24 Q32 27.5 25 24 Z" fill={K} {...S} strokeWidth="1.2"/></g>,
    headband: (oc) => <path d="M19 19 Q19 15 32 14 Q45 15 45 19 L45 21.5 Q32 17 19 21.5 Z" fill={oc || '#E9C45A'} {...S} strokeWidth="1.6"/>,
    bandana: (oc) => <g><path d="M19 22 Q18 9 32 9 Q46 9 45 22 L44 24 Q32 19 20 24 Z" fill={oc || '#5F8D5A'} {...S}/><path d="M44 22 L50 26 L45 27 Z" fill={oc || '#5F8D5A'} {...S} strokeWidth="1.5"/></g>,
  };

  // ── 액세서리 (11) ──
  const ACCS = {
    none: () => null,
    stetho: () => <g><path d="M24 52 Q24 62 32 63 Q40 62 40 52" fill="none" stroke="#4A4438" strokeWidth="2"/><circle cx="32" cy="64.5" r="3" fill="#A9CBE3" stroke={K} strokeWidth="1.5"/></g>,
    badge: () => <g><rect x="20" y="57" width="9" height="11" rx="1" fill="#fff" stroke={K} strokeWidth="1.4" transform="rotate(-4 24 62)"/><circle cx="24" cy="60" r="1.7" fill="#F6DCC0" stroke={K} strokeWidth="1"/><path d="M22 64 H27" stroke={K} strokeWidth="1" opacity=".6"/><path d="M24.5 55 L24 57.5" stroke={K} strokeWidth="1.3" fill="none"/></g>,
    glassesRound: () => <g><circle cx="27" cy="31.5" r="4.5" fill="rgba(255,255,255,.25)" stroke={K} strokeWidth="1.5"/><circle cx="37" cy="31.5" r="4.5" fill="rgba(255,255,255,.25)" stroke={K} strokeWidth="1.5"/><path d="M31.5 31 H32.5 M22.5 30.5 L19 29.5 M41.5 30.5 L45 29.5" {...SN} strokeWidth="1.4"/></g>,
    glassesSquare: () => <g><rect x="22.5" y="27.5" width="9" height="7.5" rx="1.5" fill="rgba(255,255,255,.25)" stroke={K} strokeWidth="1.5"/><rect x="32.5" y="27.5" width="9" height="7.5" rx="1.5" fill="rgba(255,255,255,.25)" stroke={K} strokeWidth="1.5"/><path d="M22.5 30 L19 29 M41.5 30 L45 29" {...SN} strokeWidth="1.4"/></g>,
    earring: () => <g><circle cx="17.8" cy="35" r="1.4" fill="#E9C45A" stroke={K} strokeWidth="1"/><circle cx="46.2" cy="35" r="1.4" fill="#E9C45A" stroke={K} strokeWidth="1"/></g>,
    maskChin: () => <path d="M24 38 Q32 46 40 38 L40 43 Q32 49 24 43 Z" fill="#DCEAF2" {...S} strokeWidth="1.5"/>,
    maskOn: () => <g><path d="M22 32 Q32 28 42 32 L41 40 Q32 45 23 40 Z" fill="#DCEAF2" {...S} strokeWidth="1.6"/><path d="M22 33 L18 30 M42 33 L46 30" {...SN} strokeWidth="1.3"/><path d="M26 35 Q32 33.5 38 35" fill="none" stroke={K} strokeWidth=".9" opacity=".4"/></g>,
    plaster: () => <g transform="rotate(-14 41 26)"><rect x="37" y="24" width="8" height="4" rx="2" fill="#F0C4A8" stroke={K} strokeWidth="1.1"/><circle cx="40" cy="26" r=".5" fill={K} opacity=".5"/><circle cx="42" cy="26" r=".5" fill={K} opacity=".5"/></g>,
    earphones: () => <g><circle cx="17.6" cy="33" r="2" fill="#fff" stroke={K} strokeWidth="1.2"/><circle cx="46.4" cy="33" r="2" fill="#fff" stroke={K} strokeWidth="1.2"/><path d="M17.6 35 L17.6 38" {...SN} strokeWidth="1.2"/><path d="M46.4 35 L46.4 38" {...SN} strokeWidth="1.2"/></g>,
    mustache: () => <path d="M26 36.4 Q32 33.8 38 36.4 Q35.2 37.8 32 36.6 Q28.8 37.8 26 36.4 Z" fill="#4A382A" stroke={K} strokeWidth="1"/>,
    beard: () => <path d="M27.5 41 Q32 40 36.5 41 Q37.6 45.6 32 46.2 Q26.4 45.6 27.5 41 Z" fill="#4A382A" stroke={K} strokeWidth="1.2"/>,
    wrinkles: () => <g {...SN} strokeWidth="1" opacity=".45"><path d="M26 22.5 Q32 21 38 22.5 M27.5 25 Q32 23.8 36.5 25"/><path d="M25.5 36 Q24.8 38 26 40 M38.5 36 Q39.2 38 38 40"/></g>,
    cannula: () => <g><path d="M18.6 36.5 Q32 41 45.4 36.5" fill="none" stroke="rgba(74,111,165,.75)" strokeWidth="1.6"/><path d="M30.6 35.4 L30.6 37.6 M33.4 35.4 L33.4 37.6" fill="none" stroke="rgba(74,111,165,.9)" strokeWidth="1.5" strokeLinecap="round"/></g>,
    faceShield: () => <g><path d="M20 20.5 L44 20.5 L45 41.5 Q32 47 19 41.5 Z" fill="rgba(169,203,227,.26)" stroke={K} strokeWidth="1.4"/><rect x="19" y="17.5" width="26" height="4" rx="1.5" fill="#FFFdf4" stroke={K} strokeWidth="1.4"/></g>,
    blush: () => <g><ellipse cx="23.5" cy="35.5" rx="2.4" ry="1.4" fill="#F0A8A0" opacity=".65"/><ellipse cx="40.5" cy="35.5" rx="2.4" ry="1.4" fill="#F0A8A0" opacity=".65"/></g>,
    freckles: () => <g fill={K} opacity=".45">{[[23,34.5],[25.5,36],[28,34.8],[36,34.8],[38.5,36],[41,34.5]].map((p,i) => <circle key={i} cx={p[0]} cy={p[1]} r=".7"/>)}</g>,
  };

  // ── NbAvatar ──
  function NbAvatar({ size = 76, skin = 'beige', hair = 'short', hairColor = 'darkbrown', eyes = 'dot', mouth = 'line', outfit = 'scrubV', outfitColor = 'sage', hat = 'none', bg = 'plain', acc = 'none', hatColor, style }) {
    const sk = SKINS[skin] || skin, hc = HAIRC[hairColor] || hairColor, oc = OUTC[outfitColor] || outfitColor;
    const isBald = hair === 'bald';
    return (
      <svg viewBox="0 0 64 70" width={size} height={size * 70 / 64} style={{ display: 'block', ...style }}>
        {(BGS[bg] || BGS.plain)()}
        {!isBald && BACK[hair] && BACK[hair](hc)}
        {(OUTFITS[outfit] || OUTFITS.scrubV)(oc)}
        <circle cx="32" cy="32" r="14" fill={sk} stroke={K} strokeWidth={W}/>
        {(MOUTHS[mouth] || MOUTHS.line)()}
        {(EYES[eyes] || EYES.dot)()}
        {!isBald && FRONT[hair] && FRONT[hair](hc)}
        {(HATS[hat] || HATS.none)(HAIRC[hatColor] ? HAIRC[hatColor] : (OUTC[hatColor] || hatColor))}
        {(ACCS[acc] || ACCS.none)()}
      </svg>
    );
  }

  const NbAvatarAssets = {
    skins: Object.keys(SKINS), hairColors: Object.keys(HAIRC), outfitColors: Object.keys(OUTC),
    hairs: HAIRS, eyes: Object.keys(EYES), mouths: Object.keys(MOUTHS),
    outfits: Object.keys(OUTFITS), hats: Object.keys(HATS), bgs: Object.keys(BGS), accs: Object.keys(ACCS),
  };
  Object.assign(window, { NbAvatar, NbAvatarAssets });
})();
