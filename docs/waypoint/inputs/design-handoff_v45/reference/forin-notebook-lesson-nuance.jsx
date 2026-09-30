// forin-notebook-lesson-nuance.jsx — 뉘앙스 학습 3화면 (수첩 그림체)
// ① STEP 2 워밍업: 문장 5연속 스와이프(Immersion Reel) — 정의 없이 같은 단어를 5장면에서 '봄'
// ② STEP 2 유형: 같은 뜻, 다른 장면(Context Match) — 어색한 장면 1개 고르기
// ③ STEP 2 유형: 한 단어 바꾸기(Swap One) — 밑줄 단어를 뉘앙스 맞는 유의어로 교체
(function () {
  const { NbPaper, NbButton, NbTag, NbMark, NbMemo } = window.NbUI;
  const NbIcon = window.NbIcon;
  const HW = '"Gaegu","Nanum Pen Script",cursive';
  const F = '"Pretendard",sans-serif';
  const MONO = '"IBM Plex Mono",monospace';
  const c = { bg: '#F1EBDD', paper: '#FFFdf4', ink: '#3E362B', soft: '#9A8F7C', red: '#C75146', blue: '#4A6FA5', green: '#5F8D5A', amber: '#C77E2E' };

  if (!document.getElementById('nb-nuance-css')) {
    const s = document.createElement('style'); s.id = 'nb-nuance-css';
    s.textContent = `
@keyframes nb-swipe-out{0%{transform:translateX(0) rotate(0)}100%{transform:translateX(-120%) rotate(-8deg);opacity:0}}
.nb-swipe-out{animation:nb-swipe-out .38s cubic-bezier(.4,.05,.6,1) both;pointer-events:none}
@keyframes nb-swipe-in{0%{transform:translateX(30px) scale(.96);opacity:0}100%{transform:none;opacity:1}}
.nb-swipe-in{animation:nb-swipe-in .3s ease-out both}
@keyframes nb-reveal{0%{opacity:0;transform:translateY(-6px)}100%{opacity:1;transform:none}}
.nb-reveal{animation:nb-reveal .3s ease-out both}
@keyframes nb-ok{0%{transform:scale(.6) rotate(-20deg);opacity:0}70%{transform:scale(1.08) rotate(-10deg);opacity:1}100%{transform:scale(1) rotate(-10deg)}}
.nb-ok{animation:nb-ok .35s ease-out both}
`;
    document.head.appendChild(s);
  }

  function Frame({ label, step, sub, title, prog, children }) {
    return (
      <div style={{ boxSizing: 'border-box', width: 402, height: 874, background: c.bg, backgroundImage: 'repeating-linear-gradient(transparent 0 27px, rgba(62,54,43,.06) 27px 28px)', borderRadius: 40, overflow: 'hidden', position: 'relative', fontFamily: F }} data-screen-label={label}>
        <div style={{ height: 44, display: 'flex', alignItems: 'center', padding: '0 24px', fontSize: 14, fontWeight: 700, color: c.ink }}>9:41<div style={{ flex: 1 }}/>▮▮▮</div>
        <div style={{ padding: '6px 24px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: HW, fontSize: 15, color: c.ink, border: `1.5px solid ${c.ink}`, borderRadius: 3, padding: '1px 8px', transform: 'rotate(-1deg)', whiteSpace: 'nowrap' }}>‹ 나가기</span>
            <div style={{ flex: 1 }}/>
            <NbTag color={c.blue} rot={1}>{step}</NbTag>
            {sub && <span style={{ fontFamily: HW, fontSize: 12.5, color: c.soft, whiteSpace: 'nowrap' }}>{sub}</span>}
          </div>
          {prog}
          <div style={{ fontFamily: HW, fontSize: 21, color: c.ink, marginTop: 12, lineHeight: 1.25 }}>{title}</div>
        </div>
        {children}
      </div>
    );
  }
  const Stamp = ({ ok }) => (
    <div className="nb-ok" style={{ width: 56, height: 56, borderRadius: '50%', border: `3px double ${ok ? c.green : c.red}`, color: ok ? c.green : c.red, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: c.paper, flexShrink: 0 }}>
      <div style={{ fontSize: 7.5, fontWeight: 800, letterSpacing: 1 }}>{ok ? 'GOOD' : 'RETRY'}</div>
      <div style={{ fontFamily: HW, fontSize: 15, lineHeight: 1 }}>{ok ? '정답' : '다시'}</div>
    </div>
  );

  // ══ ① Immersion Reel — 정의 없이 5장면 스와이프 ══
  const REEL = {
    word: 'deteriorate',
    scenes: [
      { who: '구급대원 → 간호사', t: 'She started to deteriorate en route — BP dropped to 88.', ko: '이송 중 나빠지기 시작했어요 — 혈압 88까지.' , tone: '급함' },
      { who: '야간 인계', t: "If he deteriorates overnight, call the rapid response team.", ko: '밤새 악화되면 신속대응팀 호출.', tone: '경고' },
      { who: '차트 기록', t: 'Pt condition deteriorated despite fluids. MD notified.', ko: '수액에도 상태 악화. 의사 보고함.', tone: '건조' },
      { who: '의사 → 간호사', t: "Watch him closely — I don't want him to deteriorate on us.", ko: '잘 지켜봐요 — 우리 손에서 나빠지면 안 돼.', tone: '긴장' },
      { who: '보호자에게는…', t: "(✕ deteriorate) → “He's getting worse, and we're acting on it.”", ko: '보호자에겐 쉬운 말로 — "상태가 나빠지고 있고, 조치 중이에요."', tone: '완곡', swap: true },
    ],
  };
  function ImmersionReel() {
    const [i, setI] = React.useState(0);
    const [out, setOut] = React.useState(false);
    const [feel, setFeel] = React.useState(null);
    const n = REEL.scenes.length, done = i >= n;
    const next = () => { if (out || done) return; setOut(true); setTimeout(() => { setOut(false); setI(k => k + 1); }, 380); };
    const s = REEL.scenes[i];
    const hl = (txt) => txt.split(/(deteriorate[sd]?)/i).map((p, k) => /^deteriorate/i.test(p) ? <mark key={k} style={{ background: 'linear-gradient(transparent 55%, #F9E37B 55%)', padding: '0 2px' }}>{p}</mark> : p);
    return (
      <Frame label="수첩 STEP2 워밍업 · 문장 릴" step="STEP 2 · 워밍업" sub="30초" title={<span>외우지 말고 <NbMark>다섯 장면</NbMark>에서 그냥 만나보세요</span>}
        prog={<div style={{ display: 'flex', gap: 4, marginTop: 10 }}>{REEL.scenes.map((_, k) => <div key={k} style={{ flex: 1, height: 5, borderRadius: 2, background: k < i ? c.blue : 'rgba(62,54,43,.15)', transform: `rotate(${k % 2 ? .7 : -.7}deg)`, transition: 'background .3s' }}/>)}</div>}>
        <div style={{ position: 'absolute', left: 24, right: 24, top: 176 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontFamily: MONO, fontSize: 24, fontWeight: 700, color: c.ink }}>{REEL.word}</span>
            <NbIcon name="speaker" size={16}/>
            <div style={{ flex: 1 }}/>
            <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 700, color: c.soft }}>{Math.min(i + 1, n)} / {n}</span>
          </div>
          <div style={{ position: 'relative', height: 300, marginTop: 14 }}>
            {/* 뒤 카드 두 장 */}
            {!done && i + 2 < n && <div style={{ position: 'absolute', inset: '0 -8px auto 8px', height: 240, background: '#F7F1E1', border: `1px solid #E0D6C0`, transform: 'rotate(2deg)' }}/>}
            {!done && i + 1 < n && <div style={{ position: 'absolute', inset: '0 -4px auto 4px', height: 240, background: '#FBF6E8', border: `1px solid #E0D6C0`, transform: 'rotate(-1.2deg)' }}/>}
            {!done && (
              <div key={i} className={out ? 'nb-swipe-out' : 'nb-swipe-in'} onClick={next} style={{ position: 'absolute', left: 0, right: 0, top: 0, cursor: 'pointer' }}>
                <NbPaper rot={0} tape tapeLeft={130} style={{ padding: '18px 16px 16px', minHeight: 240, boxSizing: 'border-box', ...(s.swap ? { border: `1.5px dashed ${c.amber}` } : {}) }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <NbTag color={s.swap ? c.amber : c.blue} rot={-1}>{s.who}</NbTag>
                    <div style={{ flex: 1 }}/>
                    <span style={{ fontFamily: HW, fontSize: 12.5, color: c.soft, border: `1.3px solid rgba(62,54,43,.3)`, borderRadius: 2, padding: '0 6px', whiteSpace: 'nowrap' }}>{s.tone}</span>
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 600, color: c.ink, lineHeight: 1.6, marginTop: 16 }}>{hl(s.t)}</div>
                  <div style={{ fontFamily: HW, fontSize: 14.5, color: c.soft, marginTop: 10, lineHeight: 1.4 }}>{s.ko}</div>
                  <div style={{ position: 'absolute', right: 14, bottom: 12, fontFamily: HW, fontSize: 12.5, color: c.soft }}>탭 → 다음 장면</div>
                </NbPaper>
              </div>
            )}
            {done && (
              <div className="nb-swipe-in">
                <NbPaper rot={-0.5} style={{ padding: '16px 16px 14px' }}>
                  <div style={{ fontFamily: HW, fontSize: 18, color: c.ink }}>다섯 번 만난 <span style={{ fontFamily: MONO, fontWeight: 700 }}>deteriorate</span>, 어떤 느낌이었나요?</div>
                  <div style={{ fontSize: 11, color: c.soft, marginTop: 3 }}>정답 없음 — 감상 하나만 남겨요</div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
                    {['딱딱한 임상어', '급하고 무거움', '보호자에겐 안 씀', '차트에 잘 맞음'].map((f, k) => (
                      <div key={f} onClick={() => setFeel(f)} style={{ padding: '7px 12px', border: `1.6px solid ${feel === f ? c.ink : 'rgba(62,54,43,.35)'}`, background: feel === f ? c.ink : c.paper, color: feel === f ? c.paper : c.ink, fontFamily: HW, fontSize: 14.5, cursor: 'pointer', transform: `rotate(${k % 2 ? .8 : -.8}deg)`, whiteSpace: 'nowrap' }}>{f}</div>
                    ))}
                  </div>
                  {feel && <div className="nb-reveal" style={{ marginTop: 12, padding: '7px 10px', border: `1.3px dashed ${c.blue}`, background: 'rgba(74,111,165,.05)', fontFamily: HW, fontSize: 13.5, color: c.ink, lineHeight: 1.45 }}><b style={{ color: c.blue }}>뉘앙스</b> 맞아요 — 의료진끼리는 정확해서 좋고, 가족 앞에서는 <i>getting worse</i>로 바꿔 말해요. 이 느낌이 노트에 저장됐어요 ✎</div>}
                </NbPaper>
                <div onClick={() => { setI(0); setFeel(null); }} style={{ textAlign: 'center', marginTop: 10, fontFamily: HW, fontSize: 13, color: c.blue, textDecoration: 'underline', textUnderlineOffset: 3, cursor: 'pointer' }}>(프로토타입: 다시 보기)</div>
              </div>
            )}
          </div>
        </div>
        <div style={{ position: 'absolute', left: 24, right: 24, bottom: 34 }}>
          <NbButton variant={done && feel ? 'ink' : 'dashed'} size="lg" full icon="speech" iconColor={done && feel ? '#FFFdf4' : undefined} style={done && feel ? {} : { opacity: .5 }}>STEP 2 · 문장 학습 시작 ›</NbButton>
        </div>
      </Frame>
    );
  }

  // ══ ② Context Match — 같은 뜻, 다른 장면: 어색한 장면 고르기 ══
  const CTX = {
    word: 'deteriorate', ko: '악화되다',
    scenes: [
      { who: '차트 기록', icon: 'board', t: 'Pt condition deteriorated overnight.', ok: true },
      { who: '보호자에게', icon: 'me', t: "Your mother deteriorated last night.", ok: false, fix: "Your mother got worse last night, and we've started treatment." },
      { who: '야간 의사 콜', icon: 'monitor', t: 'He is deteriorating — SpO2 down to 86.', ok: true },
    ],
    why: '의료진끼리는 정확한 임상어가 좋지만, 가족에게는 차갑고 무섭게 들려요. 같은 뜻이라도 듣는 사람에 따라 온도를 바꿔요.',
  };
  function ContextMatch() {
    const [pick, setPick] = React.useState(null);
    const [res, setRes] = React.useState(null);
    const check = () => pick != null && !res && setRes(CTX.scenes[pick].ok ? 'wrong' : 'right');
    return (
      <Frame label="수첩 STEP2 · 장면 고르기" step="STEP 2 · 문장 2/5" sub="같은 뜻, 다른 장면" title={<span><span style={{ fontFamily: MONO }}>{CTX.word}</span>가 <NbMark>어색한 장면</NbMark>은 어디일까요?</span>}
        prog={<div style={{ display: 'flex', gap: 4, marginTop: 10 }}>{[0,1,2,3,4].map(k => <div key={k} style={{ flex: 1, height: 5, borderRadius: 2, background: k < 1 ? c.ink : k === 1 ? c.amber : 'rgba(62,54,43,.15)', transform: `rotate(${k % 2 ? .7 : -.7}deg)` }}/>)}</div>}>
        <div style={{ position: 'absolute', left: 24, right: 24, top: 176 }}>
          <NbMemo rot={-0.3} color={c.blue}>뜻은 셋 다 “악화되다” — 듣는 사람이 달라요</NbMemo>
          {CTX.scenes.map((s, i) => {
            const on = pick === i, isAns = !s.ok;
            const ok = res && isAns, bad = res && on && !isAns;
            return (
              <div key={i} onClick={() => !res && setPick(i)} style={{ cursor: 'pointer' }}>
                <NbPaper rot={i % 2 ? .5 : -.5} style={{ marginTop: 11, padding: '11px 12px', display: 'flex', gap: 11, alignItems: 'flex-start', ...(ok ? { boxShadow: `0 2px 6px rgba(62,54,43,.14), 0 0 0 2.5px ${c.green}` } : bad ? { boxShadow: `0 2px 6px rgba(62,54,43,.14), 0 0 0 2px ${c.red}` } : on ? { boxShadow: `0 2px 6px rgba(62,54,43,.14), 0 0 0 2px ${c.ink}` } : {}) }}>
                  <div style={{ width: 42, height: 42, borderRadius: 10, background: `${c.blue}18`, border: `1.5px solid ${c.blue}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transform: `rotate(${i % 2 ? 2 : -2}deg)` }}><NbIcon name={s.icon} size={24}/></div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontFamily: HW, fontSize: 13.5, color: c.soft }}>{s.who}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: c.ink, lineHeight: 1.5, marginTop: 2, ...(ok ? { textDecoration: 'line-through', textDecorationColor: c.red, textDecorationThickness: 2, color: c.soft } : {}) }}>{s.t}</div>
                    {ok && <div className="nb-reveal" style={{ marginTop: 6, fontSize: 13.5, fontWeight: 700, color: c.ink, lineHeight: 1.5 }}><span style={{ fontFamily: HW, color: c.red, marginRight: 4 }}>→</span><mark style={{ background: 'linear-gradient(transparent 55%, #F9E37B 55%)', padding: '0 2px' }}>{s.fix}</mark></div>}
                  </div>
                  {res && isAns && <Stamp ok={res === 'right'}/>}
                </NbPaper>
              </div>
            );
          })}
          {res && <div className="nb-reveal" style={{ marginTop: 12, padding: '7px 10px', border: `1.3px dashed ${c.blue}`, background: 'rgba(74,111,165,.05)', fontFamily: HW, fontSize: 13.5, color: c.ink, lineHeight: 1.45 }}><b style={{ color: c.blue }}>뉘앙스</b> {CTX.why}</div>}
        </div>
        <div style={{ position: 'absolute', left: 24, right: 24, bottom: 34 }}>
          {!res
            ? <div onClick={check}><NbButton variant="ink" size="lg" full icon="pencil" iconColor="#FFFdf4" style={pick == null ? { opacity: .4 } : {}}>확인하기</NbButton></div>
            : <div style={{ display: 'flex', gap: 10 }}><div style={{ flex: 1 }}><NbButton variant="paper" size="lg" full icon="mic">고친 문장 따라 말하기</NbButton></div><div onClick={() => { setPick(null); setRes(null); }}><NbButton variant="ink" size="lg" icon="speech" iconColor="#FFFdf4">다음 ›</NbButton></div></div>}
        </div>
      </Frame>
    );
  }

  // ══ ③ Swap One — 밑줄 단어를 뉘앙스 맞는 유의어로 교체 ══
  const SWAP = {
    who: '보호자에게 · 임종 소식', icon: 'me',
    before: ['Your mom ', 'died', ' last night.'],
    options: ['passed away', 'expired', 'is gone'],
    answer: 'passed away',
    notes: { 'passed away': '가장 흔한 완곡 표현 — 가족 앞에서 표준.', expired: '차트·행정 용어. 사람에게 쓰면 차갑게 들려요.', 'is gone': '너무 모호해서 오해의 여지 — 피하세요.' },
    why: '"died"는 사실이지만 직설이라 가족에겐 충격이 커요. 같은 사실을 공감의 온도로 전하는 게 뉘앙스예요.',
  };
  function SwapOne() {
    const [pick, setPick] = React.useState(null);
    const [res, setRes] = React.useState(null);
    const check = () => pick && !res && setRes(pick === SWAP.answer ? 'right' : 'wrong');
    return (
      <Frame label="수첩 STEP2 · 한 단어 바꾸기" step="STEP 2 · 문장 4/5" sub="한 단어 바꾸기" title={<span>밑줄 친 말을 <NbMark>더 어울리는 말</NbMark>로 바꿔요</span>}
        prog={<div style={{ display: 'flex', gap: 4, marginTop: 10 }}>{[0,1,2,3,4].map(k => <div key={k} style={{ flex: 1, height: 5, borderRadius: 2, background: k < 3 ? c.ink : k === 3 ? c.amber : 'rgba(62,54,43,.15)', transform: `rotate(${k % 2 ? .7 : -.7}deg)` }}/>)}</div>}>
        <div style={{ position: 'absolute', left: 24, right: 24, top: 176 }}>
          <NbPaper rot={-0.5} tape tapeLeft={130} style={{ padding: '16px 16px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${c.amber}22`, border: `1.5px solid ${c.amber}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><NbIcon name={SWAP.icon} size={22}/></div>
              <NbTag color={c.amber} rot={-1}>{SWAP.who}</NbTag>
            </div>
            <div style={{ fontSize: 19, fontWeight: 600, color: c.ink, lineHeight: 1.7, marginTop: 14 }}>
              {SWAP.before[0]}
              <span style={{ position: 'relative', display: 'inline-block' }}>
                <span style={{ textDecoration: res ? 'line-through' : 'underline', textDecorationColor: c.red, textDecorationThickness: 2.5, textUnderlineOffset: 5, color: res ? c.soft : c.ink }}>{SWAP.before[1]}</span>
                {pick && <span className="nb-reveal" style={{ position: 'absolute', left: '50%', top: -26, transform: 'translateX(-50%) rotate(-3deg)', whiteSpace: 'nowrap', fontFamily: HW, fontSize: 17, color: res ? (res === 'right' ? c.green : c.red) : c.blue, background: c.paper, padding: '0 4px', borderBottom: `1.5px solid currentColor` }}>{pick}</span>}
              </span>
              {SWAP.before[2]}
            </div>
            <div style={{ fontFamily: HW, fontSize: 13.5, color: c.soft, marginTop: 8 }}>어젯밤 어머니가 돌아가셨어요 — 라고 전해야 해요</div>
          </NbPaper>
          <div style={{ fontFamily: HW, fontSize: 14.5, color: c.soft, marginTop: 14 }}>바꿀 말 — 하나만 골라 위에 얹어요</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
            {SWAP.options.map((o, i) => {
              const on = pick === o, ok = res && o === SWAP.answer, bad = res && on && !ok;
              return <div key={o} onClick={() => !res && setPick(o)} style={{ padding: '8px 14px', border: `1.6px solid ${ok ? c.green : bad ? c.red : on ? c.ink : c.ink}`, background: ok ? 'rgba(95,141,90,.12)' : bad ? 'rgba(199,81,70,.1)' : on ? 'rgba(249,227,123,.5)' : c.paper, fontFamily: MONO, fontSize: 13.5, fontWeight: 700, color: c.ink, cursor: 'pointer', transform: `rotate(${i % 2 ? 1 : -1}deg)`, boxShadow: on ? 'none' : '1px 2px 0 rgba(62,54,43,.2)' }}>{o}</div>;
            })}
          </div>
          {res && (
            <div className="nb-reveal" style={{ marginTop: 14 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  {SWAP.options.map(o => (
                    <div key={o} style={{ display: 'flex', gap: 7, alignItems: 'baseline', marginTop: 4 }}>
                      <span style={{ fontFamily: MONO, fontSize: 11.5, fontWeight: 700, color: o === SWAP.answer ? c.green : c.soft, width: 84, flexShrink: 0 }}>{o}</span>
                      <span style={{ fontFamily: HW, fontSize: 13, color: c.ink, lineHeight: 1.35 }}>{SWAP.notes[o]}</span>
                    </div>
                  ))}
                </div>
                <Stamp ok={res === 'right'}/>
              </div>
              <div style={{ marginTop: 10, padding: '7px 10px', border: `1.3px dashed ${c.blue}`, background: 'rgba(74,111,165,.05)', fontFamily: HW, fontSize: 13.5, color: c.ink, lineHeight: 1.45 }}><b style={{ color: c.blue }}>뉘앙스</b> {SWAP.why}</div>
            </div>
          )}
        </div>
        <div style={{ position: 'absolute', left: 24, right: 24, bottom: 34 }}>
          {!res
            ? <div onClick={check}><NbButton variant="ink" size="lg" full icon="pencil" iconColor="#FFFdf4" style={!pick ? { opacity: .4 } : {}}>확인하기</NbButton></div>
            : <div style={{ display: 'flex', gap: 10 }}><div style={{ flex: 1 }}><NbButton variant="paper" size="lg" full icon="mic">바꾼 문장 따라 말하기</NbButton></div><div onClick={() => { setPick(null); setRes(null); }}><NbButton variant="ink" size="lg" icon="speech" iconColor="#FFFdf4">다음 ›</NbButton></div></div>}
        </div>
      </Frame>
    );
  }

  Object.assign(window, { ImmersionReel, ContextMatch, SwapOne });
})();
