// screens-onboarding.jsx — Splash, language picker, job select, level diagnosis

function ScreenSplash() {
  const T = window.ForinTokens;
  // phase: 'intro' → 'panning'
  const [panning, setPanning] = React.useState(false);
  const [ctaGone, setCtaGone] = React.useState(false);

  function start() {
    if (panning) return;
    setCtaGone(true);                       // button leaves first
    setTimeout(() => setPanning(true), 200); // then the camera pans
  }

  const sky = { /* shared sky decor for both panels */ };

  return (
    <div data-screen-label="01 Splash → Login" style={{ height: '100%', position: 'relative', overflow: 'hidden',
      background: `linear-gradient(180deg, ${T.peach} 0%, ${T.mint} 100%)` }}>
      <style>{`
        @keyframes forinPlaneFloat { 0%,100%{ transform: translate(-50%, 0); } 50%{ transform: translate(calc(-50% + 6px), -6px); } }
        /* the WORLD is a 2-panel filmstrip; the camera pans left one screen */
        .forin-track { display: flex; width: 200%; height: 100%;
          transform: translateX(0); transition: transform 1.15s cubic-bezier(.5,.02,.45,1); }
        .forin-track.panning { transform: translateX(-50%); }
        .forin-panel { position: relative; width: 50%; height: 100%; flex: 0 0 50%; }
        .forin-cta { transition: opacity .3s ease-out, transform .3s ease-out; }
        .forin-cta.gone { opacity: 0; transform: translateY(16px); pointer-events: none; }
      `}</style>

      {/* ── WORLD (pans left) — two side-by-side full-screen panels ── */}
      <div className={`forin-track${panning ? ' panning' : ''}`}>

        {/* PANEL A — onboarding: sky + center logo/tagline (CTA fades before pan) */}
        <div className="forin-panel">
          <Cloud style={{ top: 110, left: 24 }} />
          <Cloud style={{ top: 180, right: 30 }} size={1.3} />
          <Cloud style={{ top: 300, left: 70 }} size={0.8} />
          <PixelSun style={{ position: 'absolute', top: 78, right: 30 }} />

          <div style={{ position: 'absolute', top: 408, left: 0, right: 0, textAlign: 'center', padding: '0 24px' }}>
            <div style={{ fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 64, color: T.ink, lineHeight: 1, letterSpacing: 3,
              textShadow: `4px 4px 0 ${T.yellow}` }}>forin</div>
            <div style={{ fontFamily: '"Galmuri11","DungGeunMo",monospace', fontSize: 13, color: T.text, marginTop: 14, lineHeight: 1.6 }}>
              해외 이직, 언어로 막막할 때<br/>
              <span style={{ color: T.ink, fontSize: 14 }}>가장 따뜻한 현장 시뮬레이션</span>
            </div>
          </div>

          <div className={`forin-cta${ctaGone ? ' gone' : ''}`}
            style={{ position: 'absolute', bottom: 96, left: 0, right: 0, padding: '0 32px', zIndex: 3 }}>
            <PixelButton full size="lg" bg={T.yellow} shadow={T.yellowShadow} onClick={start}>
              ✈  여정 시작하기
            </PixelButton>
          </div>
        </div>

        {/* PANEL B — login: enters from the right; same sky continues */}
        <div className="forin-panel">
          <Cloud style={{ top: 96, left: 30 }} size={1.1} />
          <Cloud style={{ top: 200, right: 24 }} size={0.9} />
          <PixelSun style={{ position: 'absolute', top: 70, left: 28 }} />

          <div style={{ position: 'absolute', top: 250, left: 0, right: 0, textAlign: 'center', padding: '0 24px' }}>
            <div style={{ fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 40, color: T.ink, lineHeight: 1, letterSpacing: 2, textShadow: `3px 3px 0 ${T.yellow}` }}>forin</div>
            <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 12, color: T.textSoft, marginTop: 10 }}>한 번의 탭으로 시작하세요.</div>
          </div>

          <div style={{ position: 'absolute', bottom: 44, left: 0, right: 0, padding: '0 28px', zIndex: 3 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <OneTapButton bg="#fff" color={T.ink} shadow={`${T.ink}55`} icon={<GoogleGlyph/>} label="Google로 계속하기"/>
              <OneTapButton bg="#000" color="#fff" shadow="#000"         icon={<AppleGlyph/>}  label="Apple로 계속하기"/>
              <OneTapButton bg="#FEE500" color="#3C1E1E" shadow="#CCB800" icon={<KakaoGlyph/>}  label="카카오로 시작하기"/>
            </div>
            <div style={{ textAlign: 'center', marginTop: 16, fontFamily: '"Galmuri11",monospace', fontSize: 10, color: T.textSoft, lineHeight: 1.6 }}>
              계속 진행하면 <span style={{ color: T.ink, textDecoration: 'underline' }}>이용약관</span> 및 <span style={{ color: T.ink, textDecoration: 'underline' }}>개인정보처리방침</span>에<br/>동의하는 것으로 간주됩니다.
            </div>
          </div>
        </div>
      </div>

      {/* ── AIRPLANE — the camera's focus; stays fixed near center ── */}
      <div style={{ position: 'absolute', top: 196, left: '50%', zIndex: 4,
        animation: 'forinPlaneFloat 3.2s ease-in-out infinite' }}>
        <PixelPlane/>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// Login (standalone artboard) — the post-pan end-state shown on its own.
// Same onboarding background; logo + tagline + the three social providers.
// In the product this is the right half of the ONE continuous splash pan.
function ScreenLogin() {
  const T = window.ForinTokens;
  return (
    <div data-screen-label="01b Login" style={{
      height: '100%', position: 'relative', overflow: 'hidden',
      background: `linear-gradient(180deg, ${T.peach} 0%, ${T.mint} 100%)`,
      animation: 'forinLoginIn .5s ease-out both',
    }}>
      <style>{`@keyframes forinLoginIn { 0%{ opacity:0; } 100%{ opacity:1; } }`}</style>

      <Cloud style={{ top: 96, left: 30 }} size={1.1}/>
      <Cloud style={{ top: 200, right: 24 }} size={0.9}/>
      <PixelSun style={{ position: 'absolute', top: 70, left: 28 }} />

      <div style={{ position: 'absolute', top: 250, left: 0, right: 0, textAlign: 'center', padding: '0 24px', zIndex: 2 }}>
        <div style={{ fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 40, color: T.ink, letterSpacing: 2, textShadow: `3px 3px 0 ${T.yellow}` }}>forin</div>
        <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 12, color: T.textSoft, marginTop: 10 }}>한 번의 탭으로 시작하세요.</div>
      </div>

      <div style={{ position: 'absolute', bottom: 44, left: 0, right: 0, padding: '0 28px', zIndex: 3 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <OneTapButton bg="#fff" color={T.ink} shadow={`${T.ink}55`} icon={<GoogleGlyph/>} label="Google로 계속하기"/>
          <OneTapButton bg="#000" color="#fff" shadow="#000"         icon={<AppleGlyph/>}  label="Apple로 계속하기"/>
          <OneTapButton bg="#FEE500" color="#3C1E1E" shadow="#CCB800" icon={<KakaoGlyph/>}  label="카카오로 시작하기"/>
        </div>
        <div style={{ textAlign: 'center', marginTop: 16, fontFamily: '"Galmuri11",monospace', fontSize: 10, color: T.textSoft, lineHeight: 1.6 }}>
          계속 진행하면 <span style={{ color: T.ink, textDecoration: 'underline' }}>이용약관</span> 및 <span style={{ color: T.ink, textDecoration: 'underline' }}>개인정보처리방침</span>에<br/>동의하는 것으로 간주됩니다.
        </div>
      </div>
    </div>
  );
}

// expose ScreenLogin alongside other onboarding screens
window.ScreenLogin = ScreenLogin;

function OneTapButton({ bg, color, shadow, icon, label, sub, primary }) {
  const T = window.ForinTokens;
  return (
    <button style={{
      width: '100%', background: bg, color,
      border: `3px solid ${T.ink}`, boxShadow: `4px 4px 0 0 ${shadow}`,
      padding: primary ? '13px 16px' : '11px 16px',
      display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
      textAlign: 'left',
    }}>
      <span style={{ width: 26, height: 26, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</span>
      <span style={{ flex: 1 }}>
        <span style={{ display: 'block', fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: primary ? 15 : 13, lineHeight: 1.2 }}>{label}</span>
        {sub && <span style={{ display: 'block', fontFamily: '"Galmuri11",monospace', fontSize: 10, opacity: 0.7, marginTop: 3 }}>{sub}</span>}
      </span>
      {primary && <span style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 16 }}>▶</span>}
    </button>
  );
}

// ── Provider glyphs (pixel-crisp SVG) ──
function NaverGlyph() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24">
      <rect x="2" y="2" width="20" height="20" rx="2" fill="#03C75A"/>
      <path d="M8 7 H10.7 L13.3 11 V7 H16 V17 H13.3 L10.7 13 V17 H8 Z" fill="#fff"/>
    </svg>
  );
}
function MailGlyph() {
  const T = window.ForinTokens;
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={T.ink} strokeWidth="2" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="1.5"/>
      <path d="M4 7 L12 13 L20 7"/>
    </svg>
  );
}
function GoogleGlyph() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M23 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.2c-.3 1.5-1.1 2.7-2.4 3.6v3h3.9c2.3-2.1 3.3-5.2 3.3-8.8z"/>
      <path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1C3.4 21.3 7.4 24 12 24z"/>
      <path fill="#FBBC05" d="M5.4 14.3c-.2-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3V6.6H1.4C.5 8.2 0 10 0 12s.5 3.8 1.4 5.4l4-3.1z"/>
      <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4C17.9 1.2 15.2 0 12 0 7.4 0 3.4 2.7 1.4 6.6l4 3.1C6.3 6.9 8.9 4.8 12 4.8z"/>
    </svg>
  );
}
function AppleGlyph() {
  return (
    <svg width="20" height="22" viewBox="0 0 18 22" fill="#fff">
      <path d="M14.5 11.6c0-2.5 2-3.7 2.1-3.8-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.6.9-.7 0-1.9-.9-3.1-.8-1.6 0-3.1.9-3.9 2.4-1.7 2.9-.4 7.2 1.2 9.5.8 1.2 1.7 2.5 2.9 2.4 1.2 0 1.6-.7 3-.7s1.8.7 3 .7 2-1.1 2.8-2.2c.9-1.3 1.2-2.5 1.3-2.6-.1 0-2.4-1-2.4-3.6zM12.3 4.2c.6-.8 1.1-1.8 1-2.9-.9 0-2 .6-2.7 1.4-.6.7-1.1 1.8-1 2.8 1 .1 2-.5 2.7-1.3z"/>
    </svg>
  );
}
function KakaoGlyph() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="#3C1E1E">
      <path d="M12 3C6.5 3 2 6.5 2 10.8c0 2.8 1.9 5.2 4.7 6.6-.2.7-.7 2.6-.8 3-.1.5.2.5.4.4.2-.1 2.6-1.8 3.7-2.5.6.1 1.3.1 2 .1 5.5 0 10-3.5 10-7.8S17.5 3 12 3z"/>
    </svg>
  );
}

function Cloud({ style = {}, size = 1 }) {
  const T = window.ForinTokens;
  const s = 8 * size;
  return (
    <div style={{ position: 'absolute', ...style, animation: `forinDrift ${(7/size).toFixed(1)}s ease-in-out infinite` }}>
      <style>{`@keyframes forinDrift{0%,100%{transform:translateX(0)}50%{transform:translateX(6px)}}`}</style>
      <svg width={s * 9} height={s * 5} viewBox="0 0 36 20" shapeRendering="crispEdges">
        {/* puffy body — stacked lobes */}
        <rect x="10" y="5"  width="8"  height="4" fill="#fff"/>
        <rect x="6"  y="8"  width="10" height="4" fill="#fff"/>
        <rect x="16" y="6"  width="9"  height="3" fill="#fff"/>
        <rect x="4"  y="11" width="28" height="4" fill="#fff"/>
        <rect x="22" y="9"  width="8"  height="5" fill="#fff"/>
        <rect x="14" y="9"  width="10" height="2" fill="#fff"/>
        {/* soft shadow underside */}
        <rect x="6"  y="14" width="24" height="1" fill={T.blue}/>
        <rect x="10" y="15" width="14" height="1" fill={T.blue} opacity=".6"/>
        {/* highlight tops */}
        <rect x="11" y="5"  width="5" height="1" fill="#fff"/>
        <rect x="17" y="6"  width="6" height="1" fill="#FEFEFE"/>
        {/* outline accents */}
        <rect x="4"  y="11" width="28" height="1" fill={T.ink} opacity=".12"/>
      </svg>
    </div>
  );
}

function PixelSun({ style = {} }) {
  const T = window.ForinTokens;
  return (
    <div style={style}>
      <svg width="72" height="72" viewBox="0 0 36 36" shapeRendering="crispEdges">
        {/* rays */}
        {[
          [17,0,2,5],[17,31,2,5],[0,17,5,2],[31,17,5,2],   // N S W E
          [5,5,3,3],[28,5,3,3],[5,28,3,3],[28,28,3,3],      // diagonals
        ].map((r,i)=><rect key={i} x={r[0]} y={r[1]} width={r[2]} height={r[3]} fill={T.yellowDeep}/>)}
        {/* glow ring */}
        <rect x="10" y="8"  width="16" height="20" fill={T.yellow}/>
        <rect x="8"  y="10" width="20" height="16" fill={T.yellow}/>
        {/* core */}
        <rect x="11" y="10" width="14" height="16" fill={T.yellowDeep}/>
        <rect x="10" y="12" width="16" height="12" fill={T.yellowDeep}/>
        {/* top-left highlight */}
        <rect x="12" y="11" width="5" height="3" fill="#FFF7C2"/>
        {/* outline (chunky, blocky circle) */}
        <rect x="11" y="8"  width="14" height="2" fill={T.ink}/>
        <rect x="11" y="26" width="14" height="2" fill={T.ink}/>
        <rect x="8"  y="11" width="2"  height="14" fill={T.ink}/>
        <rect x="26" y="11" width="2"  height="14" fill={T.ink}/>
        <rect x="9"  y="9"  width="2"  height="2" fill={T.ink}/>
        <rect x="25" y="9"  width="2"  height="2" fill={T.ink}/>
        <rect x="9"  y="25" width="2"  height="2" fill={T.ink}/>
        <rect x="25" y="25" width="2"  height="2" fill={T.ink}/>
        {/* friendly face */}
        <rect x="14" y="16" width="2" height="3" fill={T.ink}/>
        <rect x="20" y="16" width="2" height="3" fill={T.ink}/>
        <rect x="15" y="21" width="6" height="1" fill={T.ink}/>
        <rect x="14" y="20" width="1" height="1" fill={T.ink}/>
        <rect x="21" y="20" width="1" height="1" fill={T.ink}/>
        {/* cheek blush */}
        <rect x="13" y="19" width="1" height="1" fill="#F9A8B4"/>
        <rect x="22" y="19" width="1" height="1" fill="#F9A8B4"/>
      </svg>
    </div>
  );
}

function PixelPlane({ style = {} }) {
  const T = window.ForinTokens;
  return (
    <div style={style}>
      <svg width="150" height="78" viewBox="0 0 50 26" shapeRendering="crispEdges">
        {/* contrail puffs trailing behind the tail */}
        <rect x="0"  y="12" width="3" height="2" fill="#fff" opacity=".5"/>
        <rect x="4"  y="11" width="3" height="3" fill="#fff" opacity=".7"/>

        {/* tail fin */}
        <rect x="8"  y="4"  width="4" height="6" fill={T.mintShadow}/>
        <rect x="8"  y="4"  width="4" height="2" fill={T.mintDeep}/>
        {/* rear fuselage */}
        <rect x="9"  y="10" width="22" height="5" fill="#fff"/>
        {/* nose cone */}
        <rect x="31" y="10" width="5" height="5" fill="#fff"/>
        <rect x="36" y="11" width="2" height="3" fill={T.peachDeep}/>
        {/* belly shading */}
        <rect x="9"  y="14" width="27" height="1" fill={T.blue}/>
        {/* main wing (swept) */}
        <rect x="14" y="15" width="13" height="3" fill={T.mintDeep}/>
        <rect x="14" y="18" width="9"  height="2" fill={T.mintShadow}/>
        {/* top wing hint */}
        <rect x="16" y="7"  width="9"  height="3" fill={T.mintDeep}/>
        <rect x="16" y="7"  width="9"  height="1" fill="#fff" opacity=".5"/>
        {/* windows */}
        {[12,15,18,21,24,27].map((wx,i)=>(
          <rect key={i} x={wx} y="11" width="2" height="2" fill={T.blue}/>
        ))}
        {/* cockpit window */}
        <rect x="32" y="11" width="2" height="2" fill="#3E2E1C"/>
        {/* outlines */}
        <rect x="9"  y="10" width="22" height="1" fill={T.ink} opacity=".25"/>
        <rect x="9"  y="9"  width="3"  height="1" fill={T.ink} opacity=".25"/>
      </svg>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
function ScreenLocale() {
  const T = window.ForinTokens;
  return (
    <div data-screen-label="02 Locale" style={{ height: '100%', background: T.cream, ...window.pixelGridBg() }}>
      <ForinTopBar title="LANGUAGE" left={<span style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 18, color: T.ink }}>‹</span>} right={<span style={{ fontFamily: '"Galmuri11",monospace', fontSize: 11, color: T.textSoft }}>1/4</span>} />
      <div style={{ padding: '20px 22px 110px' }}>
        <div style={{ fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 22, color: T.ink, lineHeight: 1.3, marginBottom: 6 }}>
          어디서 오셨나요?
        </div>
        <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 12, color: T.textSoft, marginBottom: 22 }}>
          앱이 사용할 모국어를 골라주세요.
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <LocaleCard flag={<FlagKR size={44}/>} name="한국어" sub="Korean" selected />
          <LocaleCard flag={<FlagJP size={44}/>} name="日本語" sub="Japanese" />
          <LocaleCard flag={<FlagUS size={44}/>} name="English" sub="US" />
          <LocaleCard flag={<FlagDE size={44}/>} name="Deutsch" sub="Germany" />
        </div>

        <div style={{ marginTop: 30, fontFamily: '"DungGeunMo",monospace', fontSize: 16, color: T.ink, marginBottom: 12 }}>
          ⇨ 어디로 가시나요?
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <LocaleCard flag={<FlagUS size={44}/>} name="미국" sub="English-US" selected />
          <LocaleCard flag={<FlagDE size={44}/>} name="독일" sub="Deutsch" />
        </div>

        <div style={{ marginTop: 28 }}>
          <PixelButton full size="lg" bg={T.yellow} shadow={T.yellowShadow}>다음 ▶</PixelButton>
        </div>
      </div>
    </div>
  );
}

function LocaleCard({ flag, name, sub, selected }) {
  const T = window.ForinTokens;
  return (
    <div style={{
      background: selected ? T.mint : '#fff',
      border: `3px solid ${T.ink}`,
      boxShadow: selected ? `4px 4px 0 0 ${T.mintShadow}` : `3px 3px 0 0 ${T.ink}33`,
      padding: '14px 12px',
      position: 'relative',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        {flag}
        {selected && <div style={{ marginLeft: 'auto', width: 18, height: 18, background: T.yellow, border: `2px solid ${T.ink}`, fontFamily: '"DungGeunMo",monospace', fontSize: 12, lineHeight: '14px', textAlign: 'center', color: T.ink }}>✓</div>}
      </div>
      <div style={{ fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 15, color: T.ink, lineHeight: 1 }}>{name}</div>
      <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 10, color: T.textSoft, marginTop: 4 }}>{sub}</div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
function ScreenJob() {
  const T = window.ForinTokens;
  const jobs = [
    { name: '간호사', sub: 'Nurse · 종합병원', stickers: 124, ready: true, icon: '🏥' },
    { name: '소프트웨어 엔지니어', sub: 'SW Engineer · 스타트업', stickers: 42, soon: true, icon: '💻' },
    { name: '바리스타', sub: 'Barista · 카페', stickers: 18, soon: true, icon: '☕' },
    { name: '호텔리어', sub: 'Hotelier · 프론트', stickers: 0, soon: true, icon: '🛎' },
  ];
  return (
    <div data-screen-label="03 Job" style={{ height: '100%', background: T.cream, ...window.pixelGridBg() }}>
      <ForinTopBar title="CAREER PATH" left={<span style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 18, color: T.ink }}>‹</span>} right={<span style={{ fontFamily: '"Galmuri11",monospace', fontSize: 11, color: T.textSoft }}>2/4</span>} />
      <div style={{ padding: '20px 22px 110px' }}>
        <div style={{ fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 22, color: T.ink, lineHeight: 1.3, marginBottom: 6 }}>
          어떤 일터로 떠날까요?
        </div>
        <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 12, color: T.textSoft, marginBottom: 18 }}>
          직무에 맞춘 현장 시나리오가 열립니다.
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {jobs.map((j, i) => (
            <div key={i} style={{
              background: j.ready ? T.peach : '#fff',
              border: `3px solid ${T.ink}`,
              boxShadow: j.ready ? `4px 4px 0 0 ${T.peachShadow}` : `3px 3px 0 0 ${T.ink}22`,
              padding: 14, display: 'flex', alignItems: 'center', gap: 14,
              opacity: j.soon ? 0.7 : 1,
            }}>
              <div style={{ width: 52, height: 52, background: '#fff', border: `2px solid ${T.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0 }}>{j.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 16, color: T.ink }}>{j.name}</div>
                <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 11, color: T.textSoft, marginTop: 2 }}>{j.sub}</div>
                <div style={{ marginTop: 6, display: 'flex', gap: 6 }}>
                  {j.ready
                    ? <PixelChip bg={T.mint}>● {j.stickers}개 시나리오</PixelChip>
                    : <PixelChip bg="#fff" color={T.textSoft}>곧 열림</PixelChip>}
                  {j.ready && <PixelChip bg={T.yellow}>MVP</PixelChip>}
                </div>
              </div>
              {j.ready && <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 20, color: T.ink }}>▶</div>}
            </div>
          ))}
        </div>

        <div style={{ marginTop: 22 }}>
          <PixelButton full size="lg" bg={T.yellow} shadow={T.yellowShadow}>간호사로 계속 ▶</PixelButton>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
function ScreenLevel() {
  const T = window.ForinTokens;
  const levels = [
    { code: 'A1', name: 'Beginner', desc: '인사 정도만 가능해요', tone: T.peach },
    { code: 'A2', name: 'Elementary', desc: '간단한 일상 대화가 가능해요', tone: T.peach },
    { code: 'B1', name: 'Intermediate', desc: '업무 대화는 떠듬떠듬...', tone: T.mint, selected: true },
    { code: 'B2', name: 'Upper-Int', desc: '회의에서 의견을 낼 수 있어요', tone: T.mint },
    { code: 'C1', name: 'Advanced', desc: '전문 용어도 자신 있어요', tone: T.yellow },
  ];
  return (
    <div data-screen-label="04 Level" style={{ height: '100%', background: T.cream, ...window.pixelGridBg() }}>
      <ForinTopBar title="LEVEL CHECK" left={<span style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 18, color: T.ink }}>‹</span>} right={<span style={{ fontFamily: '"Galmuri11",monospace', fontSize: 11, color: T.textSoft }}>3/4</span>} />
      <div style={{ padding: '20px 22px 110px' }}>
        <div style={{ fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 22, color: T.ink, lineHeight: 1.3, marginBottom: 6 }}>
          지금 영어 실력은?
        </div>
        <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 12, color: T.textSoft, marginBottom: 20 }}>
          시나리오 난이도가 자동으로 맞춰져요.
        </div>

        {/* xp bar visualization */}
        <div style={{ background: '#fff', border: `3px solid ${T.ink}`, padding: 14, marginBottom: 18, boxShadow: `3px 3px 0 0 ${T.ink}22` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: T.textSoft, marginBottom: 6 }}>
            <span>A1</span><span>A2</span><span>B1</span><span>B2</span><span>C1</span><span>C2</span>
          </div>
          <div style={{ height: 14, background: T.cream, border: `2px solid ${T.ink}`, position: 'relative', display: 'flex' }}>
            {['A1','A2','B1','B2','C1','C2'].map((l,i) => (
              <div key={l} style={{ flex: 1, borderRight: i < 5 ? `2px solid ${T.ink}` : 'none', background: i < 3 ? T.mint : 'transparent' }} />
            ))}
          </div>
          <div style={{ marginTop: 8, fontFamily: '"Galmuri11",monospace', fontSize: 11, color: T.ink }}>
            🎯 추정 레벨 · <b>B1</b> 정도부터 시작해볼게요
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {levels.map(l => (
            <div key={l.code} style={{
              background: l.selected ? l.tone : '#fff',
              border: `3px solid ${T.ink}`,
              boxShadow: l.selected ? `3px 3px 0 0 ${T.mintShadow}` : 'none',
              padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{ width: 36, height: 36, background: l.tone, border: `2px solid ${T.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"DungGeunMo",monospace', fontSize: 13, color: T.ink }}>{l.code}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 13, color: T.ink }}>{l.name}</div>
                <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 11, color: T.textSoft, marginTop: 2 }}>{l.desc}</div>
              </div>
              {l.selected && <div style={{ width: 20, height: 20, background: T.yellow, border: `2px solid ${T.ink}`, fontFamily: '"DungGeunMo",monospace', fontSize: 13, lineHeight: '16px', textAlign: 'center' }}>✓</div>}
            </div>
          ))}
        </div>

        <div style={{ marginTop: 22, display: 'flex', gap: 10 }}>
          <PixelButton bg="#fff" shadow={T.ink + '33'} style={{ flex: 1 }}>2분 진단</PixelButton>
          <PixelButton size="md" bg={T.yellow} shadow={T.yellowShadow} style={{ flex: 1 }}>이대로 시작 ▶</PixelButton>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ScreenSplash, ScreenLogin, ScreenLocale, ScreenJob, ScreenLevel });
