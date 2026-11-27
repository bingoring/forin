// forin-notebook-mainloop.jsx — 메인 루프 인터랙티브 데모 (클릭으로 진행)
// 홈 → 상황 준비 → 대화(감정 전환) → 미니 퀴즈 → 결과 → 리뷰랩 적립
(function () {
  const { NbPaper, NbButton, NbTag, NbMark, NbMemo, NbCheck, NbProgSquares } = window.NbUI;
  const NbIcon = window.NbIcon;
  const NbAvatar = window.NbAvatar;
  const HW = '"Gaegu","Nanum Pen Script",cursive';
  const F = '"Pretendard",sans-serif';
  const MONO = '"IBM Plex Mono",monospace';
  const c = { bg: '#F1EBDD', paper: '#FFFdf4', ink: '#3E362B', soft: '#9A8F7C', red: '#C75146', blue: '#4A6FA5', green: '#5F8D5A', amber: '#C77E2E' };

  if (!document.getElementById('nb-loop-css')) {
    const s = document.createElement('style');
    s.id = 'nb-loop-css';
    s.textContent = `
@keyframes nbl-in{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:none}}
.nbl-in{animation:nbl-in .4s cubic-bezier(.3,.7,.3,1) both}
@keyframes nbl-pop{0%{transform:scale(.6) rotate(-14deg);opacity:0}60%{transform:scale(1.08) rotate(-11deg)}100%{transform:scale(1) rotate(-12deg);opacity:1}}
.nbl-pop{animation:nbl-pop .45s ease-out both}
@keyframes nbl-face{0%{transform:scale(1.12)}100%{transform:scale(1)}}
.nbl-face{animation:nbl-face .35s ease-out both}
@keyframes nbl-fly{0%{transform:translate(0,0) rotate(0)}100%{transform:translate(96px,190px) rotate(8deg) scale(.4);opacity:.15}}
.nbl-fly{animation:nbl-fly .8s cubic-bezier(.5,0,.8,.4) both}
`;
    document.head.appendChild(s);
  }

  // 환자 상태별 표정 프리셋 (아바타 에셋 조합)
  const FACES = {
    pain:    { eyes: 'uu', mouth: 'pain', label: '통증', color: '#C75146' },
    anxious: { eyes: 'worried', mouth: 'frown', label: '불안', color: '#C77E2E' },
    relieved:{ eyes: 'happy', mouth: 'smile', label: '안심', color: '#5F8D5A' },
  };

  // 대화 대본: 환자 발화 → 선택지 2 (정답이 감정을 호전시킴)
  const TURNS = [
    {
      face: 'pain',
      npc: "It hurts so much... my chest feels tight.",
      ko: '가슴이 조여요… 너무 아파요.',
      opts: [
        { en: 'On a scale of 0 to 10, how bad is your pain?', good: true, note: '통증 사정 표준 문형' },
        { en: 'Just wait. The doctor is coming.', good: false, note: '공감 없이 지시만 — 불안 가중' },
      ],
    },
    {
      face: 'anxious',
      npc: "It's an 8... Am I going to be okay?",
      ko: '8점이요… 저 괜찮은 거죠?',
      opts: [
        { en: "We're taking good care of you. I'll stay with you.", good: true, note: '안심 + 동행 표현' },
        { en: "I don't know. We'll see.", good: false, note: '불확실 답변 — 신뢰 하락' },
      ],
    },
  ];

  function Frame({ label, children }) {
    return (
      <div style={{ boxSizing: 'border-box', width: 402, height: 874, background: c.bg, backgroundImage: 'repeating-linear-gradient(transparent 0 27px, rgba(62,54,43,.06) 27px 28px)', borderRadius: 40, overflow: 'hidden', position: 'relative', fontFamily: F }} data-screen-label={label}>
        <div style={{ height: 44, display: 'flex', alignItems: 'center', padding: '0 24px', fontSize: 14, fontWeight: 700, color: c.ink }}>9:41<div style={{ flex: 1 }}/>▮▮▮</div>
        <div style={{ position: 'absolute', top: 44, left: 0, right: 0, bottom: 0 }}>{children}</div>
      </div>
    );
  }
  const H1 = ({ children, right }) => (
    <div style={{ display: 'flex', alignItems: 'baseline', padding: '10px 22px 0' }}>
      <span style={{ fontFamily: HW, fontSize: 27, color: c.ink }}>{children}</span>
      <div style={{ flex: 1 }}/>{right}
    </div>
  );

  function MainLoop() {
    const [step, setStep] = React.useState(0);        // 0홈 1준비 2대화 3결과 4리뷰랩
    const [turn, setTurn] = React.useState(0);
    const [picked, setPicked] = React.useState(null); // 이번 턴 선택 인덱스
    const [log, setLog] = React.useState([]);         // {en, good, note}
    const [face, setFace] = React.useState('pain');
    const go = (n) => { setStep(n); setPicked(null); };
    const reset = () => { setStep(0); setTurn(0); setPicked(null); setLog([]); setFace('pain'); };

    const pick = (i) => {
      if (picked != null) return;
      const o = TURNS[turn].opts[i];
      setPicked(i);
      setLog(l => [...l, o]);
      setFace(o.good ? (turn === TURNS.length - 1 ? 'relieved' : TURNS[Math.min(turn + 1, TURNS.length - 1)].face) : 'anxious');
      setTimeout(() => {
        if (turn < TURNS.length - 1) { setTurn(turn + 1); setPicked(null); }
        else setStep(3);
      }, 1400);
    };

    // ── 0 · 홈 (축약) ──
    const home = (
      <div className="nbl-in" key="s0">
        <H1 right={<span style={{ fontFamily: HW, fontSize: 14, color: c.soft }}><NbIcon name="fire" size={14}/> 12일째</span>}>좋은 아침, 지수</H1>
        <div style={{ padding: '10px 22px 0' }}>
          <NbPaper rot={-0.5} tape tapeLeft={130} style={{ padding: '14px 15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <NbTag color={c.red} rot={-2}>오늘의 상황</NbTag>
              <span style={{ fontFamily: MONO, fontSize: 10.5, fontWeight: 700, color: c.soft }}>ER · 트리아지</span>
              <div style={{ flex: 1 }}/>
              <span style={{ fontFamily: HW, fontSize: 12.5, color: c.soft, whiteSpace: 'nowrap' }}>약 3분</span>
            </div>
            <div style={{ fontFamily: HW, fontSize: 21, color: c.ink, marginTop: 9, lineHeight: 1.3 }}>흉통 환자가 접수대 앞에서<br/>가슴을 움켜쥐고 있어요</div>
            <div style={{ fontSize: 11.5, color: c.soft, marginTop: 5 }}>통증 사정 → 안심 표현까지 2턴 대화</div>
            <div onClick={() => go(1)} style={{ marginTop: 12 }}>
              <NbButton variant="ink" size="lg" full>출근해서 맡기 ✎</NbButton>
            </div>
          </NbPaper>
          <div style={{ marginTop: 13 }}>
            <NbMemo rot={0.3} color={c.blue}><b style={{ color: c.blue }}>데모</b> 홈 → 준비 → 대화(감정 전환) → 결과 → 리뷰랩 적립까지 클릭으로 이어져요.</NbMemo>
          </div>
        </div>
      </div>
    );

    // ── 1 · 상황 준비 ──
    const brief = (
      <div className="nbl-in" key="s1">
        <H1 right={<span onClick={() => go(0)} style={{ fontFamily: HW, fontSize: 15, color: c.ink, border: `1.5px solid ${c.ink}`, borderRadius: 3, padding: '1px 8px', cursor: 'pointer' }}>‹</span>}>상황 준비</H1>
        <div style={{ padding: '10px 22px 0' }}>
          <NbPaper rot={-0.5} style={{ padding: '13px 14px', display: 'flex', gap: 13, alignItems: 'center' }}>
            <div style={{ flexShrink: 0, border: `1px solid #E0D6C0`, background: '#fff', padding: 5, transform: 'rotate(-2deg)', boxShadow: '0 2px 5px rgba(62,54,43,.15)' }}>
              <NbAvatar size={84} hair="short" hairColor="darkbrown" outfit="hospitalGown" outfitColor="mint" eyes="uu" mouth="pain" bg="washMint"/>
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: MONO, fontSize: 13, fontWeight: 700, color: c.ink }}>Mr. Park · 58M</div>
              <div style={{ fontFamily: HW, fontSize: 14.5, color: c.soft, marginTop: 3, lineHeight: 1.35 }}>흉통 30분 · 식은땀<br/>ER 접수대 앞</div>
              <div style={{ marginTop: 6 }}><NbTag color={c.red} rot={-2}><NbIcon name="siren" size={12}/> 통증 호소 중</NbTag></div>
            </div>
          </NbPaper>
          <div style={{ fontFamily: HW, fontSize: 16, color: c.ink, marginTop: 14 }}>이번 미션 ✎</div>
          {[['통증을 0–10 척도로 사정하기', 'pain scale'], ['환자를 안심시키는 표현 쓰기', 'reassurance']].map((m, i) => (
            <NbPaper key={i} rot={i % 2 ? 0.5 : -0.5} style={{ marginTop: 9, padding: '10px 13px', display: 'flex', alignItems: 'center', gap: 9 }}>
              <NbCheck/>
              <span style={{ fontSize: 13.5, fontWeight: 600, color: c.ink }}>{m[0]}</span>
              <span style={{ marginLeft: 'auto', fontFamily: MONO, fontSize: 10, color: c.soft, whiteSpace: 'nowrap' }}>{m[1]}</span>
            </NbPaper>
          ))}
          <div style={{ marginTop: 13 }}>
            <NbMemo rot={0.3}>보상 · <b style={{ color: c.amber }}>+60 XP</b> · 교정 노트 자동 적립</NbMemo>
          </div>
          <div onClick={() => go(2)} style={{ position: 'absolute', left: 22, right: 22, top: 640 }}>
            <NbButton variant="ink" size="lg" full>대화 시작 →</NbButton>
          </div>
        </div>
      </div>
    );

    // ── 2 · 대화 (감정 전환) ──
    const fp = FACES[face];
    const t = TURNS[turn];
    const dialogue = (
      <div key="s2">
        {/* 무대 */}
        <div style={{ background: 'rgba(62,54,43,.05)', borderBottom: `1.5px solid rgba(62,54,43,.2)`, padding: '12px 22px 14px', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 13 }}>
            <div className="nbl-face" key={face} style={{ flexShrink: 0, border: `1px solid #E0D6C0`, background: '#fff', padding: 6, transform: 'rotate(-2deg)', boxShadow: '0 3px 7px rgba(62,54,43,.18)' }}>
              <NbAvatar size={104} hair="short" hairColor="darkbrown" outfit="hospitalGown" outfitColor="mint" eyes={fp.eyes} mouth={fp.mouth} bg="washMint"/>
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{ fontFamily: MONO, fontSize: 11.5, fontWeight: 700, color: c.ink, whiteSpace: 'nowrap' }}>MR. PARK</span>
                <NbTag color={fp.color} rot={-2} key={'tag' + face}>{fp.label}</NbTag>
              </div>
              <NbPaper rot={0.4} style={{ marginTop: 7, padding: '9px 11px' }}>
                <div style={{ fontSize: 13.5, color: c.ink, lineHeight: 1.5, fontStyle: 'italic' }}>“{t.npc}”</div>
                <div style={{ fontFamily: HW, fontSize: 12.5, color: c.soft, marginTop: 3 }}>{t.ko}</div>
              </NbPaper>
            </div>
          </div>
          <div style={{ position: 'absolute', right: 20, top: 10, fontFamily: HW, fontSize: 12.5, color: c.soft }}>턴 {turn + 1}/{TURNS.length}</div>
        </div>
        {/* 선택지 */}
        <div style={{ padding: '13px 22px 0' }}>
          <div style={{ fontFamily: HW, fontSize: 15, color: c.soft }}>어떻게 답할까요? — 쪽지를 골라 붙이세요</div>
          {t.opts.map((o, i) => (
            <div key={i} onClick={() => pick(i)}>
              <NbPaper rot={i % 2 ? 0.6 : -0.6} style={{ marginTop: 11, padding: '12px 13px', cursor: 'pointer',
                ...(picked === i ? { boxShadow: `0 2px 6px rgba(62,54,43,.14), 0 0 0 2.5px ${o.good ? c.green : c.red}` } : {}),
                ...(picked != null && picked !== i ? { opacity: .45 } : {}) }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: c.ink, lineHeight: 1.5 }}>{o.en}</div>
                {picked === i && (
                  <div style={{ marginTop: 7, padding: '5px 9px', background: o.good ? 'rgba(95,141,90,.1)' : 'rgba(199,81,70,.08)', border: `1.3px dashed ${o.good ? c.green : c.red}`, fontFamily: HW, fontSize: 13, color: c.ink }}>
                    <b style={{ color: o.good ? c.green : c.red }}>{o.good ? '좋아요!' : '아쉬워요'}</b> {o.note}
                  </div>
                )}
              </NbPaper>
            </div>
          ))}
          {picked == null && (
            <div style={{ marginTop: 14, textAlign: 'center', fontFamily: HW, fontSize: 13, color: c.soft }}><NbIcon name="mic" size={14}/> 직접 말하기로도 답할 수 있어요 (데모는 선택식)</div>
          )}
        </div>
      </div>
    );

    // ── 3 · 결과 ──
    const goodCount = log.filter(o => o.good).length;
    const result = (
      <div className="nbl-in" key="s3">
        <div style={{ textAlign: 'center', paddingTop: 26 }}>
          <div className="nbl-pop" style={{ display: 'inline-block' }}>
            <div style={{ width: 118, height: 118, borderRadius: '50%', border: `4px double ${c.green}`, color: c.green, display: 'inline-flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-12deg)' }}>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2 }}>CLEAR</div>
              <div style={{ fontFamily: HW, fontSize: 25, lineHeight: 1.15 }}>상황 완료</div>
              <div style={{ fontFamily: MONO, fontSize: 8.5, fontWeight: 700 }}>ER · TRIAGE</div>
            </div>
          </div>
          <div style={{ fontFamily: HW, fontSize: 21, color: c.ink, marginTop: 14 }}>모범 답변 {goodCount}/{TURNS.length} · <b style={{ color: c.amber }}>+60 XP</b></div>
        </div>
        <div style={{ padding: '12px 22px 0' }}>
          {log.map((o, i) => (
            <NbPaper key={i} rot={i % 2 ? 0.5 : -0.5} style={{ marginTop: 10, padding: '10px 13px', display: 'flex', gap: 9, alignItems: 'flex-start' }}>
              <span style={{ fontFamily: HW, fontSize: 15, color: o.good ? c.green : c.red, flexShrink: 0 }}>{o.good ? '✓' : '✕'}</span>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: c.ink, lineHeight: 1.45 }}>{o.en}</div>
                <div style={{ fontFamily: HW, fontSize: 12.5, color: c.soft, marginTop: 2 }}>{o.note}</div>
              </div>
              {!o.good && <NbTag color={c.red} rot={2} style={{ marginLeft: 'auto' }}>교정</NbTag>}
            </NbPaper>
          ))}
          <div style={{ marginTop: 13 }}>
            <NbMemo rot={0.3} color={c.blue}>{goodCount < TURNS.length ? <span>아쉬운 답변 <b>{TURNS.length - goodCount}개</b>가 교정 노트로 적립돼요 →</span> : <span>완벽해요! 표현 카드가 리뷰랩에 저장돼요 →</span>}</NbMemo>
          </div>
          <div onClick={() => go(4)} style={{ marginTop: 14 }}>
            <NbButton variant="ink" size="lg" full>리뷰랩에 적립 보기 ✎</NbButton>
          </div>
        </div>
      </div>
    );

    // ── 4 · 리뷰랩 적립 ──
    const bad = log.find(o => !o.good);
    const lab = (
      <div className="nbl-in" key="s4">
        <H1 right={<NbTag color={c.green} rot={2}>+1 적립됨</NbTag>}>복습 노트</H1>
        <div style={{ padding: '10px 22px 0' }}>
          <NbPaper rot={-0.5} tape tapeLeft={120} style={{ padding: '12px 14px', boxShadow: `0 2px 6px rgba(62,54,43,.14), 0 0 0 2px ${c.green}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <span style={{ fontSize: 10, fontWeight: 800, color: c.blue }}>ER · 트리아지</span>
              <div style={{ flex: 1 }}/>
              <span style={{ fontSize: 9.5, fontWeight: 800, color: '#fff', background: c.green, padding: '1px 6px', transform: 'rotate(-2deg)' }}>방금 적립</span>
            </div>
            {bad ? (
              <React.Fragment>
                <div style={{ marginTop: 8, fontSize: 13, color: c.soft, textDecoration: 'line-through', textDecorationColor: c.red, textDecorationThickness: 2 }}>{bad.en}</div>
                <div style={{ marginTop: 6, display: 'flex', gap: 7, alignItems: 'flex-start' }}>
                  <span style={{ fontFamily: HW, fontSize: 15, color: c.red, transform: 'rotate(-4deg)', flexShrink: 0 }}>→</span>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: c.ink, lineHeight: 1.5 }}><NbMark>{TURNS.find((tt, i) => !log[i].good)?.opts.find(o => o.good).en}</NbMark></div>
                </div>
              </React.Fragment>
            ) : (
              <div style={{ marginTop: 8, fontSize: 13.5, fontWeight: 700, color: c.ink, lineHeight: 1.5 }}><NbMark>{log[0]?.en}</NbMark></div>
            )}
            <div style={{ marginTop: 8, padding: '6px 9px', background: 'rgba(74,111,165,.07)', border: `1.3px dashed ${c.blue}`, fontFamily: HW, fontSize: 13, color: c.ink }}>
              <b style={{ color: c.blue }}>왜?</b> {bad ? bad.note : '통증 사정 표준 문형 — D+1에 복습 카드로 돌아와요.'}
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
              {[['다시', '<1분', c.red], ['어려움', '10분', c.amber], ['알맞음', '1일', c.blue], ['쉬움', '4일', c.green]].map((b, j) => (
                <div key={j} style={{ flex: 1, textAlign: 'center', border: `1.6px solid ${b[2]}`, borderRadius: 3, padding: '4px 0 3px' }}>
                  <div style={{ fontFamily: HW, fontSize: 13, color: b[2], lineHeight: 1 }}>{b[0]}</div>
                  <div style={{ fontSize: 8, color: c.soft, marginTop: 1 }}>{b[1]}</div>
                </div>
              ))}
            </div>
          </NbPaper>
          <div style={{ marginTop: 14 }}>
            <NbMemo rot={0.3}>내일 아침 홈의 <b>오늘의 복습</b>에 이 카드가 나타나요 — 루프 완성!</NbMemo>
          </div>
          <div onClick={reset} style={{ marginTop: 14 }}>
            <NbButton variant="paper" size="lg" full>처음부터 다시 보기 ↺</NbButton>
          </div>
        </div>
      </div>
    );

    return (
      <Frame label="메인 루프 데모">
        {[home, brief, dialogue, result, lab][step]}
        {/* 진행 표시 */}
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 14, display: 'flex', justifyContent: 'center', gap: 7 }}>
          {['홈', '준비', '대화', '결과', '리뷰랩'].map((l, i) => (
            <span key={i} style={{ fontFamily: HW, fontSize: 11.5, color: i === step ? c.paper : c.soft, background: i === step ? c.ink : 'transparent', border: `1.3px solid ${i === step ? c.ink : 'rgba(62,54,43,.3)'}`, borderRadius: 3, padding: '1px 7px' }}>{l}</span>
          ))}
        </div>
      </Frame>
    );
  }

  Object.assign(window, { MainLoop });
})();
