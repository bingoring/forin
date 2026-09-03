// forin-notebook-onboarding-flow.jsx — 온보딩 인터랙티브 플로우 (클릭해서 진행)
// 여권 은유 전개: 표지 → (종이 넘김) 직업 → 목적지(나라 고르면 도장 쾅) →
// 비행 전환 → 입국심사(심사관이 언어 능력 질문) → 입국 승인
// 모든 페이지는 '여권 오른쪽 면' — 왼쪽 가장자리에 접히는 홈(거터) 표현.
(function () {
  const NB = window.NB;
  const { NbPaper, NbButton, NbTag, NbStamp, NbMark, NbMemo, NbCheck } = window.NbUI;
  const NbIcon = window.NbIcon;
  const HW = '"Gaegu","Nanum Pen Script",cursive';
  const F = '"Pretendard",sans-serif';
  const MONO = '"IBM Plex Mono",monospace';
  const c = { ink: '#3E362B', soft: '#9A8F7C', red: '#C75146', blue: '#4A6FA5', green: '#5F8D5A', paper: '#FFFdf4', cream: '#F1EBDD' };

  if (!document.getElementById('nb-onb-css')) {
    const s = document.createElement('style');
    s.id = 'nb-onb-css';
    s.textContent = `
.nb-page{position:absolute;inset:0;background:#F1EBDD;background-image:repeating-linear-gradient(transparent 0 27px,rgba(62,54,43,.06) 27px 28px)}
@keyframes nb-hinge{0%{transform:rotateY(0deg)}48%{transform:rotateY(var(--a))}100%{transform:rotateY(calc(var(--a)*0.38))}}
.nb-hinge{position:absolute;top:0;height:100%;transform-origin:left center;transform-style:preserve-3d;animation:nb-hinge 1.25s cubic-bezier(.45,.05,.28,.98) both;animation-delay:var(--d)}
@keyframes nb-turnbase{0%{transform:rotateY(0deg)}97%{opacity:1}100%{transform:rotateY(-128deg);opacity:0}}
.nb-turnbase{position:absolute;inset:0;transform-origin:left center;transform-style:preserve-3d;animation:nb-turnbase 1.25s cubic-bezier(.45,.05,.28,.98) both}
@keyframes nb-shade{0%{opacity:0}45%{opacity:var(--s)}100%{opacity:var(--s)}}
.nb-shade{position:absolute;inset:0;pointer-events:none;animation:nb-shade 1.25s ease both;animation-delay:var(--d)}
@keyframes nb-hinge-in{0%{transform:rotateY(var(--a))}100%{transform:rotateY(0deg)}}
.nb-hinge-in{position:absolute;top:0;height:100%;transform-origin:left center;transform-style:preserve-3d;animation:nb-hinge-in 1.1s cubic-bezier(.3,.6,.3,1) both;animation-delay:var(--d)}
@keyframes nb-arrive{0%{opacity:0;transform:translateY(-14px) scale(1.03);filter:blur(3px)}100%{opacity:1;transform:none;filter:none}}
.nb-arrive{animation:nb-arrive .75s ease-out both}
@keyframes nb-pop-body{0%{transform:translateY(160px)}58%{transform:translateY(-13px)}78%{transform:translateY(6px)}100%{transform:translateY(0)}}
@keyframes nb-pop-head{0%{transform:translateY(185px)}52%{transform:translateY(-30px)}74%{transform:translateY(11px)}88%{transform:translateY(-5px)}100%{transform:translateY(0)}}
@keyframes nb-pop-cap{0%{transform:translateY(210px) rotate(-6deg)}42%{transform:translateY(-84px) rotate(10deg)}62%{transform:translateY(-80px) rotate(6deg)}80%{transform:translateY(10px) rotate(-3deg)}91%{transform:translateY(-4px) rotate(1deg)}100%{transform:translateY(0) rotate(0)}}
@keyframes nb-slide-out{0%{transform:translateX(0)}100%{transform:translateX(-105%)}}
.nb-slide-out{animation:nb-slide-out .6s cubic-bezier(.4,.05,.2,1) both;z-index:11;box-shadow:8px 0 24px rgba(62,54,43,.25)}
@keyframes nb-slide-in{0%{transform:translateX(105%)}100%{transform:translateX(0)}}
.nb-slide-in{animation:nb-slide-in .6s cubic-bezier(.4,.05,.2,1) both}
@keyframes nb-walkx{0%{left:-70px}100%{left:260px}}
.nb-walkx{animation:nb-walkx 2.5s cubic-bezier(.3,.1,.7,.9) forwards}
@keyframes nb-bob{0%{transform:translateY(0) rotate(-2deg)}100%{transform:translateY(-7px) rotate(2deg)}}
.nb-bob{animation:nb-bob .3s ease-in-out infinite alternate}
@keyframes nb-leg{0%{transform:rotate(-24deg)}100%{transform:rotate(24deg)}}
.nb-pop-body{animation:nb-pop-body .85s cubic-bezier(.35,.6,.3,1) both;animation-delay:.15s}
.nb-pop-head{animation:nb-pop-head 1s cubic-bezier(.35,.6,.3,1) both;animation-delay:.2s}
.nb-pop-cap{animation:nb-pop-cap 1.25s cubic-bezier(.35,.6,.3,1) both;animation-delay:.24s}
@keyframes nb-sweep{0%{opacity:.32;transform:translateX(0)}100%{opacity:0;transform:translateX(-402px)}}
.nb-sweep{position:absolute;inset:0;background:linear-gradient(90deg,transparent 30%,rgba(62,54,43,.35) 82%,rgba(62,54,43,.5));animation:nb-sweep 1.25s cubic-bezier(.45,.05,.28,.98) both;pointer-events:none}
@keyframes nb-stamp{0%{transform:scale(2.4) rotate(-24deg);opacity:0}55%{transform:scale(.92) rotate(-11deg);opacity:1}75%{transform:scale(1.06) rotate(-13deg)}100%{transform:scale(1) rotate(-12deg);opacity:1}}
.nb-stamped{animation:nb-stamp .38s ease-out both}
@keyframes nb-fly{0%{transform:translate(-40px,110px) rotate(8deg)}50%{transform:translate(150px,30px) rotate(-4deg)}100%{transform:translate(360px,-60px) rotate(-10deg)}}
@keyframes nb-cloud{0%{transform:translateX(0)}100%{transform:translateX(-430px)}}
@keyframes nb-fade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
.nb-fade{animation:nb-fade .4s ease both}
`;
    document.head.appendChild(s);
  }

  // 여권 거터(왼쪽 접힘) + 페이지 여백
  function Gutter() {
    return (
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 20, background: 'linear-gradient(90deg, rgba(62,54,43,.32), rgba(62,54,43,.12) 55%, transparent)', zIndex: 3, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', left: 6, top: 0, bottom: 0, borderLeft: '1.5px dashed rgba(62,54,43,.35)' }}/>
      </div>
    );
  }
  const dots = (n, total = 4) => (
    <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
      {Array.from({ length: total }).map((_, i) => <span key={i} style={{ width: i === n ? 22 : 8, height: 8, borderRadius: 99, background: i === n ? c.ink : 'rgba(62,54,43,.25)' }}/>)}
    </div>
  );

  // 종이 곡면 컬: 페이지를 N개 세로 관절로 쪼개 중첩 회전 — 오른쪽 끝이 먼저
  // 들리고 가운데가 휘며, 각 슬라이스 안에 실제 페이지 내용이 그대로 흘러
  // '종이 위 콘텐츠가 곡면을 타는' 효과를 냄.
  function CurlOut({ children }) {
    const W = 402, N = 24, w = W / N;
    // 책등(-4°)에서 바깥(-12°)으로 갈수록 더 감김 — 합계 ≈ -188°: 끝까지 넘어가
    // 왼쪽 화면 밖(책 반대면)으로 완전히 사라진다.
    const angles = Array.from({ length: N }, (_, i) => -(4 + 8 * (i / (N - 1))));
    const delays = Array.from({ length: N }, (_, i) => (N - 1 - i) * 0.0045); // 오른쪽 끝부터 들림
    const build = (i) => (
      <div className="nb-hinge" style={{ left: i === 0 ? 0 : w, width: W - i * w, '--a': angles[i].toFixed(2) + 'deg', '--d': delays[i].toFixed(3) + 's' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: w + 1.6, height: '100%', overflow: 'hidden', background: '#F1EBDD' }}>
          <div style={{ position: 'absolute', left: -i * w, top: 0, width: W, height: '100%' }}>{children}</div>
          <div className="nb-shade" style={{ background: '#3E362B', '--s': (0.03 + (i / N) * 0.3).toFixed(3), '--d': delays[i].toFixed(3) + 's' }}/>
        </div>
        {i < N - 1 && build(i + 1)}
      </div>
    );
    return <div style={{ position: 'absolute', inset: 0, perspective: 1500, perspectiveOrigin: '15% 50%', zIndex: 12, pointerEvents: 'none' }}><div className="nb-turnbase">{build(0)}</div></div>;
  }

  function CurlIn({ children, bg = '#2E4636' }) {
    const W = 402, N = 24, w = W / N;
    const angles = Array.from({ length: N }, (_, i) => -(4 + 8 * (i / (N - 1))));
    const delays = Array.from({ length: N }, (_, i) => i * 0.0045); // 책등부터 덮임
    const build = (i) => (
      <div className="nb-hinge-in" style={{ left: i === 0 ? 0 : w, width: W - i * w, '--a': angles[i].toFixed(2) + 'deg', '--d': delays[i].toFixed(3) + 's' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: w + 1.6, height: '100%', overflow: 'hidden', background: bg }}>
          <div style={{ position: 'absolute', left: -i * w, top: 0, width: W, height: '100%' }}>{children}</div>
        </div>
        {i < N - 1 && build(i + 1)}
      </div>
    );
    return <div style={{ position: 'absolute', inset: 0, perspective: 1500, perspectiveOrigin: '15% 50%', zIndex: 12, pointerEvents: 'none' }}>{build(0)}</div>;
  }

  function ImmigrationPage({ lvl, pickLvl, lvlRow, dots, onPass, onBack }) {
    const EN = "Welcome. How's your English for work?";
    const KO = '일할 때 영어, 어느 정도예요?';
    const [en, setEn] = React.useState(0);
    const [ko, setKo] = React.useState(0);
    React.useEffect(() => {
      let i = 0, j = 0, t2;
      const t1 = setTimeout(function tick() {
        if (i < EN.length) { setEn(++i); t2 = setTimeout(tick, 34); }
        else if (j < KO.length) { setKo(++j); t2 = setTimeout(tick, 24); }
      }, 1300);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }, []);
    const P2 = { stroke: '#3E362B', strokeWidth: 2, strokeLinejoin: 'round', strokeLinecap: 'round' };
    return (
      <div className="nb-page" key="p5">
        <Gutter/>
        {/* 하늘 배경 — 심사관이 아래에서 벌떡 */}
        <div style={{ height: 250, background: 'linear-gradient(#BFDCEE, #DCEAF2)', borderBottom: '1.5px solid #C4D5DF', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', left: 34, top: 14, fontFamily: MONO, fontSize: 9.5, fontWeight: 700, letterSpacing: 2.5, color: c.blue }}>IMMIGRATION · 입국심사</div>
          <div onClick={onBack} style={{ position: 'absolute', right: 16, top: 10, zIndex: 6, width: 32, height: 32, background: '#FFFdf4', border: '1px solid #E0D6C0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HW, fontSize: 16, color: c.ink, cursor: 'pointer', transform: 'rotate(-1deg)' }}>‹</div>
          {/* 부스 카운터 */}
          <div className="nb-pop-body" style={{ position: 'absolute', left: 30, bottom: 0, width: 110, height: 120 }}>
            <svg viewBox="0 0 110 120" width="110" height="120">
              <rect x="8" y="86" width="94" height="34" fill="#4A6FA5" {...P2}/>
              <rect x="14" y="94" width="26" height="4" fill="#D4B46A" stroke="none"/>
              <path d="M30 86 Q30 62 55 62 Q80 62 80 86" fill="#213B4A" {...P2}/>
            </svg>
          </div>
          {/* 머리 */}
          <div className="nb-pop-head" style={{ position: 'absolute', left: 62, bottom: 52, width: 46, height: 46 }}>
            <svg viewBox="0 0 46 46" width="46" height="46">
              <circle cx="23" cy="24" r="20" fill="#F6DCC0" {...P2}/>
              <circle cx="16" cy="23" r="2" fill="#3E362B"/><circle cx="30" cy="23" r="2" fill="#3E362B"/>
              <path d="M17 32 H29" {...P2} fill="none"/>
            </svg>
          </div>
          {/* 모자 — 더 높이 솟았다가 머리 위로 뚝 */}
          <div className="nb-pop-cap" style={{ position: 'absolute', left: 58, bottom: 88, width: 54, height: 30 }}>
            <svg viewBox="0 0 54 30" width="54" height="30">
              <path d="M8 22 Q8 4 27 4 Q46 4 46 22 Z" fill="#213B4A" {...P2}/>
              <rect x="4" y="20" width="46" height="7" rx="2.5" fill="#213B4A" {...P2}/>
              <rect x="21" y="11" width="12" height="6" rx="1" fill="#D4B46A" stroke="#3E362B" strokeWidth="1.6"/>
            </svg>
          </div>
          {/* 말풍선 — 타자기 */}
          {en > 0 && (
            <div style={{ position: 'absolute', right: 16, bottom: 66, width: 210, background: '#FFFdf4', border: '1px solid #E0D6C0', boxShadow: '0 2px 6px rgba(62,54,43,.14)', padding: '10px 12px', transform: 'rotate(0.4deg)' }}>
              <div style={{ position: 'absolute', left: -9, bottom: 14, width: 0, height: 0, borderTop: '7px solid transparent', borderBottom: '7px solid transparent', borderRight: '9px solid #E0D6C0' }}/>
              <div style={{ fontSize: 13, color: c.ink, lineHeight: 1.45, minHeight: 38 }}>{EN.slice(0, en)}{en < EN.length && <span style={{ borderLeft: '2px solid #3E362B', marginLeft: 1 }}/>}</div>
              {ko > 0 && <div style={{ fontFamily: HW, fontSize: 13, color: c.soft, marginTop: 3 }}>{KO.slice(0, ko)}</div>}
            </div>
          )}
        </div>
        {/* 종이 영역 — 답변 옵션 */}
        <div style={{ padding: '14px 24px 0 34px', opacity: ko >= KO.length ? 1 : .35, transition: 'opacity .4s', pointerEvents: ko >= KO.length ? 'auto' : 'none' }}>
          {lvlRow('a', '더듬더듬 — 단어 위주로 말해요', '기초 표현부터 · 보기 중에서 선택 위주', -0.3)}
          {lvlRow('b', '문장은 되는데 병원 영어가 막혀요', '임상 표현 집중 · 보기+직접 반반', 0.3)}
          {lvlRow('c', '일상 대화 OK, 실전 감각이 필요해요', '직접 말하기 위주 · 돌발 상황 많이', -0.3)}
          {lvl && <NbMemo color={c.green} rot={0.3} style={{ marginTop: 13 }}><b style={{ color: c.green }}>심사관</b> "Good. Enjoy your stay — and your shift."</NbMemo>}
        </div>
        <div style={{ position: 'absolute', left: 34, right: 24, bottom: 34 }}>
          {dots(3)}
          <div onClick={onPass} style={{ marginTop: 13, opacity: lvl ? 1 : .45, pointerEvents: lvl ? 'auto' : 'none' }}>
            <NbButton variant="ink" size="lg" full>심사대 통과하기 ›</NbButton>
          </div>
        </div>
      </div>
    );
  }

  // 공식 Google G 로고
  const GLogo = ({ size = 18 }) => (
    <svg viewBox="0 0 48 48" width={size} height={size} style={{ display: 'block', flexShrink: 0 }}>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  );

  function OnbFlow() {
    const [step, setStep] = React.useState(0);       // 0표지 1직업 2목적지 3비행 4입국심사 5승인
    const [turning, setTurning] = React.useState(null); // 넘어가는 중인 이전 장
    const [job, setJob] = React.useState(null);
    const [dest, setDest] = React.useState(null);    // 도장은 다시 골라 옮길 수 있음
    const [lvl, setLvl] = React.useState(null);
    const [slide, setSlide] = React.useState(null);   // 옆으로 미는 전환 (심사대 통과)
    const [stamping, setStamping] = React.useState(false); // 출국 직전 도장 연출
    const [returning, setReturning] = React.useState(null); // 뒤로가기 — 넘어갔던 장이 되돌아옴
    const go = (n) => {
      setTurning(step);
      setStep(n);
      setTimeout(() => setTurning(null), 1320);
    };
    const goBack = (n) => {
      if (returning != null) return;
      setReturning(n);
      setTimeout(() => { setStep(n); setReturning(null); }, 1150);
    };
    const goSlide = (n) => {
      setSlide(step);
      setStep(n);
      setTimeout(() => setSlide(null), 640);
    };
    React.useEffect(() => {
      if (step === 3) { const t = setTimeout(() => setStep(4), 1700); return () => clearTimeout(t); }   // 닫힘 → 비행
      if (step === 4) { const t = setTimeout(() => setStep(5), 2700); return () => clearTimeout(t); }   // 비행 → 입국심사
      if (step === 7) { const t = setTimeout(() => { setStep(0); setJob(null); setDest(null); setLvl(null); }, 3100); return () => clearTimeout(t); } // 출근 → (프로토타입) 표지 리셋
      if (step === 8) { const t = setTimeout(() => setStep(2), 2700); return () => clearTimeout(t); }   // 귀국 비행 → 목적지 선택
    }, [step]);
    const pickDest = (d) => setDest(d);   // 자유롭게 변경 — 도장이 옮겨 찍힘
    const DESTS = {
      usa: { name: '미국', code: 'USA', apt: 'JFK' },
      aus: { name: '호주', code: 'AUS', apt: 'SYD' },
      can: { name: '캐나다', code: 'CAN', apt: 'YVR' },
      gbr: { name: '영국', code: 'GBR', apt: 'LHR' },
    };
    const D = DESTS[dest] || DESTS.usa;
    const pickLvl = (l) => setLvl(l);

    const header = (title, sub) => (
      <div style={{ padding: '14px 24px 0 34px' }}>
        <div style={{ fontFamily: HW, fontSize: 26, color: c.ink, lineHeight: 1.2 }}>{title}</div>
        {sub && <div style={{ fontSize: 11.5, color: c.soft, marginTop: 3 }}>{sub}</div>}
      </div>
    );

    // ── 페이지들 ──
    const pageCover = (
      <div className="nb-page" key="p0" style={{ background: '#2E4636', backgroundImage: 'none' }}>
        <div style={{ position: 'absolute', inset: '54px 26px 40px', border: '1.6px solid rgba(212,180,106,.85)', padding: '30px 18px 16px', textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontFamily: MONO, fontSize: 10, fontWeight: 700, letterSpacing: 4, color: '#D4B46A' }}>PASSPORT</div>
          <div style={{ fontFamily: HW, fontSize: 15, color: 'rgba(212,180,106,.75)', marginTop: 3 }}>forin</div>
          <div style={{ width: 96, height: 96, margin: '26px auto 0', borderRadius: '50%', border: '2px solid #D4B46A', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 5, borderRadius: '50%', border: '1.2px solid rgba(212,180,106,.6)' }}/>
            <span style={{ fontFamily: HW, fontSize: 56, color: '#D4B46A', lineHeight: 1, marginTop: -6 }}>f</span>
          </div>
          <div style={{ fontFamily: HW, fontSize: 34, color: '#F3E6C8', marginTop: 26, lineHeight: 1.2 }}>내일은,<br/>해외에서 출근</div>
          <div style={{ fontFamily: HW, fontSize: 14.5, color: 'rgba(243,230,200,.65)', marginTop: 9 }}>말이 통해야, 일이 통한다</div>
          <div style={{ flex: 1 }}/>
          {/* 소셜 로그인 — 로그인이 곱 여권 펼치기 (공식 브랜드 리소스) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div onClick={() => go(1)} style={{ background: '#fff', borderRadius: 6, height: 48, display: 'flex', alignItems: 'center', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,.25)', position: 'relative', paddingLeft: 18 }}>
              <GLogo size={19}/><span style={{ position: 'absolute', left: 0, right: 0, textAlign: 'center' }}><span style={{ fontFamily: F, fontSize: 14.5, fontWeight: 600, color: '#1F1F1F' }}>Google로 계속하기</span></span>
            </div>
            <div onClick={() => go(1)} style={{ background: '#000', borderRadius: 6, height: 48, display: 'flex', alignItems: 'center', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,.25)', position: 'relative', paddingLeft: 18 }}>
              <span style={{ fontSize: 19, color: '#fff', marginTop: -2 }}></span><span style={{ position: 'absolute', left: 0, right: 0, textAlign: 'center' }}><span style={{ fontFamily: F, fontSize: 14.5, fontWeight: 600, color: '#fff' }}>Apple로 계속하기</span></span>
            </div>
            <div onClick={() => go(1)} style={{ borderRadius: 6, overflow: 'hidden', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,.25)', lineHeight: 0 }}>
              <img src="uploads/kakao_login_large_wide.png" alt="카카오 로그인" style={{ width: '100%', height: 48, objectFit: 'cover', display: 'block' }}/>
            </div>
          </div>
          <div style={{ fontFamily: HW, fontSize: 12, color: 'rgba(243,230,200,.55)', marginTop: 12, lineHeight: 1.5 }}>계속하면 이용약관·개인정보처리방침에 동의하게 돼요</div>
        </div>
      </div>
    );

    const jobRow = (icon, name, sub, soon, rot) => (
      <div onClick={() => !soon && setJob(name)}>
        <NbPaper rot={rot} style={{ marginTop: 11, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12, opacity: soon ? .5 : 1, cursor: soon ? 'default' : 'pointer', ...(job === name ? { boxShadow: '0 2px 6px rgba(62,54,43,.14), 0 0 0 2.5px #E9C45A' } : {}) }}>
          <NbIcon name={icon} size={28}/>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontFamily: HW, fontSize: 18.5, color: c.ink, lineHeight: 1.05 }}>{job === name ? <NbMark>{name}</NbMark> : name}</div>
            <div style={{ fontSize: 10.5, color: c.soft, marginTop: 2 }}>{sub}</div>
          </div>
          {job === name ? <NbCheck done/> : soon ? <NbTag color={c.soft} rot={2}>준비중</NbTag> : <NbCheck/>}
        </NbPaper>
      </div>
    );
    const pageJob = (
      <div className="nb-page" key="p1">
        <Gutter/>
        <div onClick={() => goBack(0)} style={{ position: 'absolute', right: 22, top: 14, zIndex: 5 }}><NbPaper rot={-1} style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HW, fontSize: 16, color: c.ink, cursor: 'pointer' }}>‹</NbPaper></div>
        {header('어떤 일을 하시나요?', '직업에 맞는 일터와 상황이 준비돼요')}
        <div style={{ padding: '2px 24px 0 34px' }}>
          {jobRow('stetho', '간호사', '병원 캠퍼스 · 24개 부서 · NCLEX/OET 대비', false, -0.4)}
          {jobRow('bell', '호텔리어', '호텔 프런트 · 컨시어지 상황', true, 0.4)}
          {jobRow('coffee', '바리스타 · 서비스직', '카페 · 주문/컴플레인 상황', true, -0.3)}
          {jobRow('gear', '엔지니어', '오피스 · 스탠드업/코드리뷰 상황', true, 0.3)}
        </div>
        <div style={{ position: 'absolute', left: 34, right: 24, bottom: 34 }}>
          {dots(1)}
          <div onClick={() => job && go(2)} style={{ marginTop: 13, opacity: job ? 1 : .45, pointerEvents: job ? 'auto' : 'none' }}>
            <NbButton variant="ink" size="lg" full>다음 장 넘기기 ›</NbButton>
          </div>
        </div>
      </div>
    );

    const destCard = (id, flagTxt, name, sub, rot) => (
      <div onClick={() => pickDest(id)} style={{ position: 'relative' }}>
        <NbPaper rot={rot} style={{ padding: '14px 6px 11px', textAlign: 'center', cursor: 'pointer', ...(dest === id ? { boxShadow: '0 2px 6px rgba(62,54,43,.14), 0 0 0 2.5px #E9C45A' } : {}), ...(dest && dest !== id ? { opacity: .7 } : {}) }}>
          <div style={{ fontSize: 25 }}>{flagTxt}</div>
          <div style={{ fontFamily: HW, fontSize: 17, color: c.ink, marginTop: 3 }}>{name}</div>
          <div style={{ fontSize: 9.5, color: c.soft, marginTop: 2, whiteSpace: 'nowrap' }}>{sub}</div>
        </NbPaper>
      </div>
    );
    const pageDest = (
      <div className="nb-page" key="p2">
        <Gutter/>
        <div onClick={() => goBack(1)} style={{ position: 'absolute', right: 22, top: 14, zIndex: 5 }}><NbPaper rot={-1} style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HW, fontSize: 16, color: c.ink, cursor: 'pointer' }}>‹</NbPaper></div>
        {header('어디로 떠나나요?', '목적지에 맞춰 표현·억양·면허 준비가 달라져요')}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 13, padding: '16px 24px 0 34px' }}>
          {destCard('usa', '🇺🇸', '미국', 'NCLEX-RN · EN-US', -0.5)}
          {destCard('aus', '🇦🇺', '호주', 'OBA · EN-AU', 0.5)}
          {destCard('can', '🇨🇦', '캐나다', 'NCLEX · EN-CA', -0.4)}
          {destCard('gbr', '🇬🇧', '영국', 'NMC · EN-GB', 0.4)}
        </div>
        <div style={{ padding: '14px 24px 0 34px', height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {stamping ? (
            <div className="nb-stamped" key={dest} style={{ textAlign: 'center' }}>
              <div style={{ width: 108, height: 108, margin: '0 auto', borderRadius: '50%', border: `3.5px double ${c.blue}`, color: c.blue, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(241,235,221,.6)' }}>
                <div style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: 2 }}>ADMITTED</div>
                <div style={{ fontFamily: HW, fontSize: 27, lineHeight: 1.05 }}>{D.name}</div>
                <div style={{ fontFamily: MONO, fontSize: 8.5, fontWeight: 700, marginTop: 2 }}>SEP 01 2026 · {D.code}</div>
              </div>
              <div style={{ fontFamily: HW, fontSize: 12.5, color: c.soft, marginTop: 7 }}>쾅! 출국합니다</div>
            </div>
          ) : null}
        </div>
        <div style={{ position: 'absolute', left: 34, right: 24, bottom: 34 }}>
          {dots(2)}
          <div onClick={() => { if (!dest || stamping) return; setStamping(true); setTimeout(() => { setStamping(false); setStep(3); }, 1150); }} style={{ marginTop: 13, opacity: dest ? 1 : .45, pointerEvents: dest ? 'auto' : 'none' }}>
            <NbButton variant="ink" size="lg" full>출국하기 ✈</NbButton>
          </div>
        </div>
      </div>
    );

    const backCover = (
      <div style={{ position: 'absolute', inset: 0, background: '#2E4636' }}>
        <div style={{ position: 'absolute', inset: '26px 22px', border: '1.6px solid rgba(212,180,106,.85)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 84, height: 84, borderRadius: '50%', border: '2px solid #D4B46A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <NbIcon name="plane" size={40} color="#D4B46A"/>
          </div>
          <div style={{ fontFamily: MONO, fontSize: 11, fontWeight: 700, letterSpacing: 4, color: '#D4B46A', marginTop: 20 }}>BON VOYAGE</div>
          <div style={{ fontFamily: HW, fontSize: 19, color: 'rgba(243,230,200,.75)', marginTop: 6 }}>여권을 챙겼어요 — 곧 이륙합니다</div>
        </div>
      </div>
    );
    const pageClosing = (
      <div className="nb-page" key="p3close">
        {pageDest}
        <CurlIn>{backCover}</CurlIn>
      </div>
    );

    const pageFlight = (
      <div className="nb-page nb-arrive" key="p4" style={{ background: 'linear-gradient(#BFDCEE 0%, #DCEAF2 55%, #F1EBDD 100%)', backgroundImage: 'none', overflow: 'hidden' }}>
        <Gutter/>
        {/* 구름 */}
        <div style={{ position: 'absolute', top: 150, left: 0, right: -430, display: 'flex', gap: 90, animation: 'nb-cloud 6s linear infinite' }}>
          {[0,1,2,3,4,5].map(i => (
            <div key={i} style={{ width: 92, height: 30, background: '#fff', borderRadius: 99, opacity: .85, boxShadow: '14px 8px 0 -4px #fff, -12px 9px 0 -5px #fff', marginTop: (i % 3) * 60 }}/>
          ))}
        </div>
        {/* 점선 항로 + 비행기 */}
        <svg viewBox="0 0 402 300" style={{ position: 'absolute', top: 210, left: 0, width: 402 }}>
          <path d="M-20 250 Q160 190 420 60" fill="none" stroke="rgba(62,54,43,.4)" strokeWidth="2" strokeDasharray="7 8"/>
        </svg>
        <div style={{ position: 'absolute', top: 330, left: 30, animation: 'nb-fly 2.3s ease-in forwards' }}>
          <NbIcon name="plane" size={54}/>
        </div>
        <div className="nb-fade" style={{ position: 'absolute', left: 34, right: 24, top: 560, textAlign: 'center' }}>
          <div style={{ fontFamily: HW, fontSize: 25, color: c.ink }}>{D.name}으로 가는 중…</div>
          <div style={{ fontFamily: MONO, fontSize: 10.5, fontWeight: 700, color: c.soft, marginTop: 7, letterSpacing: 1.5 }}>{'ICN → ' + D.apt + ' · FORIN AIR 026'}</div>
          <div style={{ marginTop: 14, display: 'flex', justifyContent: 'center' }}>
            <NbTag color={c.blue} rot={-2}>기내에서 첫 표현 예습 중 ✎</NbTag>
          </div>
        </div>
      </div>
    );

    const lvlRow = (id, t, sub, rot) => (
      <div onClick={() => pickLvl(id)}>
        <NbPaper rot={rot} style={{ marginTop: 9, padding: '10px 13px', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', ...(lvl === id ? { boxShadow: '0 2px 6px rgba(62,54,43,.14), 0 0 0 2.5px #E9C45A' } : {}), ...(lvl && lvl !== id ? { opacity: .75 } : {}) }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontFamily: HW, fontSize: 16.5, color: c.ink, lineHeight: 1.15 }}>{lvl === id ? <NbMark>{t}</NbMark> : t}</div>
            <div style={{ fontSize: 10.5, color: c.soft, marginTop: 2 }}>{sub}</div>
          </div>
          <NbCheck done={lvl === id}/>
        </NbPaper>
      </div>
    );
    const pageImmigration = <ImmigrationPage key="p5" lvl={lvl} pickLvl={pickLvl} lvlRow={lvlRow} dots={dots} onPass={() => lvl && goSlide(6)} onBack={() => setStep(8)}/>;

    const pageApproved = (
      <div className="nb-page" key="p6">
        <Gutter/>
        <div style={{ padding: '30px 24px 0 34px', textAlign: 'center' }}>
          <div className="nb-stamped" style={{ display: 'inline-block' }}>
            <div style={{ width: 130, height: 130, borderRadius: '50%', border: `4px double ${c.green}`, color: c.green, display: 'inline-flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-12deg)' }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 2 }}>APPROVED</div>
              <div style={{ fontFamily: HW, fontSize: 27, lineHeight: 1.1 }}>입국 승인</div>
              <div style={{ fontFamily: MONO, fontSize: 8.5, fontWeight: 700, marginTop: 2 }}>{D.code} · RN · SEP 01</div>
            </div>
          </div>
          <div style={{ fontFamily: HW, fontSize: 24, color: c.ink, marginTop: 22, lineHeight: 1.3 }}>환영해요!<br/>이제 첫 출근만 남았어요</div>
        </div>
        <div style={{ padding: '18px 24px 0 34px' }}>
          <NbPaper rot={-0.8} tape tapeLeft={130} style={{ padding: '12px 14px', display: 'flex', gap: 12, alignItems: 'center' }}>
            <NbIcon name="me" size={36}/>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontFamily: MONO, fontSize: 13, fontWeight: 700, color: c.ink }}>RN · Learner</div>
              <div style={{ fontSize: 10.5, color: c.soft, marginTop: 2, whiteSpace: 'nowrap' }}>{'EN-' + D.code.slice(0,2) + ' · ' + D.name + ' 종합병원 · 오늘부터 1일'}</div>
            </div>
            <NbTag color={c.green}>EN B1</NbTag>
          </NbPaper>
        </div>
        <div style={{ position: 'absolute', left: 34, right: 24, bottom: 34 }}>
          <div onClick={() => setStep(7)}>
            <NbButton variant="ink" size="lg" full icon="pencil" iconColor="#FFFdf4">첫 출근하기</NbButton>
          </div>
        </div>
      </div>
    );

    const pageFlightBack = (
      <div className="nb-page nb-arrive" key="p8" style={{ background: 'linear-gradient(#BFDCEE 0%, #DCEAF2 55%, #F1EBDD 100%)', backgroundImage: 'none', overflow: 'hidden' }}>
        <Gutter/>
        <div style={{ position: 'absolute', top: 150, left: 0, right: -430, display: 'flex', gap: 90, animation: 'nb-cloud 6s linear infinite' }}>
          {[0,1,2,3,4,5].map(i => (
            <div key={i} style={{ width: 92, height: 30, background: '#fff', borderRadius: 99, opacity: .85, boxShadow: '14px 8px 0 -4px #fff, -12px 9px 0 -5px #fff', marginTop: (i % 3) * 60 }}/>
          ))}
        </div>
        <svg viewBox="0 0 402 300" style={{ position: 'absolute', top: 210, left: 0, width: 402, transform: 'scaleX(-1)' }}>
          <path d="M-20 250 Q160 190 420 60" fill="none" stroke="rgba(62,54,43,.4)" strokeWidth="2" strokeDasharray="7 8"/>
        </svg>
        <div style={{ position: 'absolute', top: 330, right: 30, animation: 'nb-fly 2.3s ease-in forwards', transform: 'scaleX(-1)' }}>
          <div style={{ transform: 'scaleX(-1)' }}><div style={{ transform: 'scaleX(-1)' }}><NbIcon name="plane" size={54} style={{ transform: 'scaleX(-1)' }}/></div></div>
        </div>
        <div className="nb-fade" style={{ position: 'absolute', left: 34, right: 24, top: 560, textAlign: 'center' }}>
          <div style={{ fontFamily: HW, fontSize: 25, color: c.ink }}>다시 집으로 돌아가는 중…</div>
          <div style={{ fontFamily: MONO, fontSize: 10.5, fontWeight: 700, color: c.soft, marginTop: 7, letterSpacing: 1.5 }}>{D.apt + ' → ICN · FORIN AIR 027'}</div>
          <div style={{ marginTop: 14, display: 'flex', justifyContent: 'center' }}>
            <NbTag color={c.blue} rot={-2}>목적지를 다시 고를 수 있어요</NbTag>
          </div>
        </div>
      </div>
    );

    const pageCommute = (
      <div className="nb-page nb-arrive" key="p7" style={{ background: 'linear-gradient(#BFDCEE 0%, #E8EEE4 46%, #F1EBDD 62%)', backgroundImage: 'none', overflow: 'hidden' }}>
        <Gutter/>
        {/* 병원 목적지 */}
        <div style={{ position: 'absolute', right: 30, top: 236, textAlign: 'center' }}>
          <NbIcon name="hospital" size={92}/>
          <div style={{ fontFamily: HW, fontSize: 13, color: c.soft, marginTop: 2 }}>{D.name} 종합병원</div>
        </div>
        {/* 길 */}
        <div style={{ position: 'absolute', left: 0, right: 0, top: 348, borderTop: '2px dashed rgba(62,54,43,.35)' }}/>
        {/* 출근하는 사람 — 걸음 봉봉 + 전진 */}
        <div className="nb-walkx" style={{ position: 'absolute', top: 262 }}>
          <div className="nb-bob">
            <svg viewBox="0 0 60 90" width="62" height="93">
              <circle cx="30" cy="16" r="12" fill="#F6DCC0" stroke="#3E362B" strokeWidth="2"/>
              <path d="M20 12 Q20 4 30 4 Q40 4 40 12 L40 14 Q30 10 20 14 Z" fill="#8A6A4A" stroke="#3E362B" strokeWidth="2" strokeLinejoin="round"/>
              <circle cx="34" cy="15" r="1.5" fill="#3E362B"/>
              <path d="M18 30 Q30 24 42 30 L40 56 H20 Z" fill="#B8CBB0" stroke="#3E362B" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M40 34 L50 44" stroke="#3E362B" strokeWidth="2.4" strokeLinecap="round"/>
              <rect x="46" y="42" width="13" height="10" rx="1.5" fill="#C75146" stroke="#3E362B" strokeWidth="1.8" transform="rotate(6 52 47)"/>
              <g style={{ transformOrigin: '26px 56px', animation: 'nb-leg .3s ease-in-out infinite alternate' }}><path d="M26 56 L22 76 L18 76" fill="none" stroke="#3E362B" strokeWidth="2.6" strokeLinecap="round"/></g>
              <g style={{ transformOrigin: '34px 56px', animation: 'nb-leg .3s ease-in-out infinite alternate-reverse' }}><path d="M34 56 L38 76 L42 76" fill="none" stroke="#3E362B" strokeWidth="2.6" strokeLinecap="round"/></g>
            </svg>
          </div>
        </div>
        <div className="nb-fade" style={{ position: 'absolute', left: 34, right: 24, top: 500, textAlign: 'center', animationDelay: '.4s' }}>
          <div style={{ fontFamily: HW, fontSize: 25, color: c.ink }}>첫 출근 중…</div>
          <div style={{ fontFamily: MONO, fontSize: 10.5, fontWeight: 700, color: c.soft, marginTop: 7, letterSpacing: 1.5 }}>DAY 1 · {D.code} GENERAL HOSPITAL</div>
          <div style={{ marginTop: 14, display: 'flex', justifyContent: 'center' }}>
            <NbTag color={c.blue} rot={-2}>가는 길에 인사 표현 예습 중 ✎</NbTag>
          </div>
        </div>
      </div>
    );

    return (
      <div style={{ boxSizing: 'border-box', width: 402, height: 874, background: c.cream, borderRadius: 40, overflow: 'hidden', position: 'relative', fontFamily: F }} data-screen-label="온보딩 인터랙티브">
        <div style={{ height: 44, display: 'flex', alignItems: 'center', padding: '0 24px', fontSize: 14, fontWeight: 700, color: c.ink, position: 'relative', zIndex: 5 }}>9:41<div style={{ flex: 1 }}/>▮▮▮</div>
        <div style={{ position: 'absolute', top: 44, left: 0, right: 0, bottom: 0 }}>
          <div className={slide != null ? 'nb-slide-in' : ''} style={{ position: 'absolute', inset: 0 }}>
            {[pageCover, pageJob, pageDest, pageClosing, pageFlight, pageImmigration, pageApproved, pageCommute, pageFlightBack][step]}
          </div>
          {returning != null && (
            <CurlIn key={'ret' + returning} bg={returning === 0 ? '#2E4636' : '#F1EBDD'}>
              {[pageCover, pageJob, pageDest, pageClosing, pageFlight, pageImmigration, pageApproved, pageCommute, pageFlightBack][returning]}
            </CurlIn>
          )}
          {slide != null && (
            <div className="nb-slide-out" key={'slide' + slide} style={{ position: 'absolute', inset: 0 }}>
              {[pageCover, pageJob, pageDest, pageClosing, pageFlight, pageImmigration, pageApproved, pageCommute][slide]}
            </div>
          )}
          {turning != null && (
            <React.Fragment key={'turn' + turning}>
              <div className="nb-sweep" style={{ zIndex: 11 }}/>
              <CurlOut>{[pageCover, pageJob, pageDest, pageClosing, pageFlight, pageImmigration, pageApproved, pageCommute, pageFlightBack][turning]}</CurlOut>
            </React.Fragment>
          )}
        </div>
      </div>
    );
  }

  Object.assign(window, { OnbFlow });
})();
