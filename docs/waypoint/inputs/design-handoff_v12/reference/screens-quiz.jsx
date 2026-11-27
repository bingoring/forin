// screens-quiz.jsx — Structured-learning quiz overlays that appear mid-dialogue.
// Two formats: sentence completion + word matching. Each renders the dialogue
// scene faded behind to communicate "this pops up DURING a conversation".

(function () {
  const T = () => window.ForinTokens;

  // ─── Shared backdrop: faded dialogue scene + dimming overlay ────────
  function QuizBackdrop() {
    return (
      <>
        <DialogueBackdrop/>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(31,41,55,0.65)', zIndex: 2 }}/>
        {/* CRT scanlines on top of the dim layer */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `repeating-linear-gradient(0deg, rgba(255,255,255,.04) 0 1px, transparent 1px 3px)`, pointerEvents: 'none', zIndex: 3 }}/>
      </>
    );
  }

  // ─── Quiz card chrome (shared) ──────────────────────────────────────
  function QuizCard({ kind, title, sub, zone, missionNum, total, timer, children, footer }) {
    const t = T();
    return (
      <div style={{
        position: 'absolute', left: 14, right: 14, top: 110, bottom: 24, zIndex: 6,
        background: t.cream, border: `4px solid ${t.ink}`, boxShadow: `6px 6px 0 0 ${t.ink}`,
        display: 'flex', flexDirection: 'column',
      }}>
        {/* corner staples */}
        {[[6,6],[6,'auto'],['auto',6],['auto','auto']].map((p,i) => (
          <div key={i} style={{
            position: 'absolute',
            ...(p[0]===6 ? {left:6} : {right:6}),
            ...(p[1]===6 ? {top:6} : {bottom:6}),
            width: 6, height: 6, background: t.ink,
          }}/>
        ))}

        {/* header */}
        <div style={{ padding: '12px 14px 10px', borderBottom: `3px dotted ${t.ink}44`, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ background: t.peach, border: `2px solid ${t.ink}`, padding: '3px 8px', fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: t.ink, boxShadow: `2px 2px 0 0 ${t.peachShadow}` }}>
            📚 정형 학습
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {zone && <div style={{ background: t.ink, color: '#fff', fontFamily: '"DungGeunMo",monospace', fontSize: 8, padding: '1px 5px', letterSpacing: .5 }}>{zone}</div>}
              <div style={{ fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 13, color: t.ink, lineHeight: 1 }}>{title}</div>
            </div>
            <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 10, color: t.textSoft, marginTop: 3 }}>{sub}</div>
          </div>
          {/* mission marker + timer */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3 }}>
            <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: t.ink, background: t.yellow, border: `2px solid ${t.ink}`, padding: '1px 5px' }}>
              {kind} · {missionNum}/{total}
            </div>
            <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: t.ink, display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 8, height: 8, background: '#EF4444', borderRadius: 0, animation: 'forinBlink 0.8s steps(2,end) infinite' }}/>
              ⏱ {timer}
            </div>
          </div>
        </div>

        {/* body */}
        <div style={{ flex: 1, padding: '14px 16px', overflow: 'auto' }}>
          {children}
        </div>

        {/* footer */}
        <div style={{ padding: '10px 14px 12px', borderTop: `3px dotted ${t.ink}44`, background: t.paper }}>
          {footer}
        </div>
      </div>
    );
  }

  // ─── 1. SENTENCE COMPLETION ─────────────────────────────────────────
  function ScreenQuizSentence() {
    const t = T();
    // Template: "On a ___ of 1 to ___, how ___ is the pain?"
    // Word bank: bad / scale / ten / how / hurt / sharp
    // State: first two filled correctly, third empty, "bad" highlighted as
    // the next to place (preview / about to drop).

    return (
      <div data-screen-label="07c Quiz · Sentence" style={{ height: '100%', background: '#1F2937', position: 'relative', overflow: 'hidden' }}>
        <QuizBackdrop/>

        {/* top exit/status */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '52px 16px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 7 }}>
          <button style={{ background: '#fff', border: `2px solid ${t.ink}`, padding: '4px 10px', fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: t.ink, boxShadow: `2px 2px 0 0 ${t.ink}` }}>× 나가기</button>
          <div style={{ background: '#fff', border: `2px solid ${t.ink}`, padding: '4px 8px', fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: t.ink, boxShadow: `2px 2px 0 0 ${t.ink}` }}>
            ER · Mrs. Hopkins
          </div>
        </div>

        <QuizCard
          kind="QUIZ" title="문장 완성하기" sub='환자에게 통증 강도를 물어보세요'
          zone="ER"
          missionNum={2} total={3} timer="00:24"
          footer={
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={{ flex: 1, background: '#fff', border: `2px solid ${t.ink}`, padding: '8px', fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: t.ink, boxShadow: `2px 2px 0 0 ${t.ink}` }}>건너뛰기 −10XP</button>
              <button style={{ flex: 2, background: t.mint, border: `2px solid ${t.ink}`, padding: '8px', fontFamily: '"DungGeunMo",monospace', fontSize: 12, color: t.ink, boxShadow: `2px 2px 0 0 ${t.mintShadow}` }}>✓ 제출하기</button>
            </div>
          }>
          {/* context hint */}
          <div style={{ background: t.paper, border: `2px solid ${t.ink}`, padding: '8px 10px', fontFamily: '"Galmuri11",monospace', fontSize: 11, color: t.text, lineHeight: 1.4, marginBottom: 14, position: 'relative' }}>
            <div style={{ position: 'absolute', top: -6, left: 12, background: '#fff', border: `1.5px solid ${t.ink}`, padding: '0 4px', fontFamily: '"DungGeunMo",monospace', fontSize: 8, color: t.ink }}>CONTEXT</div>
            👩 환자가 어디가 얼마나 아픈지 말하고 있어요. 통증 수치를 정확히 알아내야 합니다.
          </div>

          {/* sentence with slots */}
          <div style={{
            background: '#fff', border: `3px solid ${t.ink}`, padding: '14px 12px',
            boxShadow: `3px 3px 0 0 ${t.ink}`,
            fontFamily: '"Galmuri11","Pretendard",sans-serif', fontSize: 14, color: t.ink,
            lineHeight: 2.2, textAlign: 'center',
          }}>
            "On a <FilledSlot word="scale" correct/> of 1 to <FilledSlot word="10" correct/>,
            <br/>how <ActiveSlot/> is the pain?"
          </div>

          {/* word bank */}
          <div style={{ marginTop: 14 }}>
            <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: '#fff', opacity: 0.85, marginBottom: 6 }}>━ 단어 카드 ━━━━━━━━</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              <WordTile word="bad" focused/>
              <WordTile word="sharp"/>
              <WordTile word="hurt"/>
              <WordTile word="how"  used/>
              <WordTile word="scale" used/>
              <WordTile word="ten" used/>
            </div>
          </div>

          {/* mini hint */}
          <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 6, fontFamily: '"Galmuri11",monospace', fontSize: 10, color: t.textSoft }}>
            <div style={{ width: 18, height: 18, background: t.yellow, border: `1.5px solid ${t.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>💡</div>
            얼마나 "심하게" 아픈지를 물어볼 때 쓰는 형용사예요.
          </div>
        </QuizCard>

        <style>{`
          @keyframes forinBlink { 0%,49%{opacity:1} 50%,100%{opacity:0} }
          @keyframes forinPulseRing { 0%,100% {box-shadow: 0 0 0 0 rgba(254,240,138,.9)} 50%{box-shadow: 0 0 0 4px rgba(254,240,138,0)} }
        `}</style>
      </div>
    );
  }

  function FilledSlot({ word, correct }) {
    const t = T();
    return (
      <span style={{
        display: 'inline-block', background: correct ? t.mint : '#fff',
        border: `2.5px solid ${t.ink}`, padding: '3px 10px', margin: '0 2px',
        fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 13, color: t.ink,
        boxShadow: `2px 2px 0 0 ${correct ? t.mintShadow : t.ink}`,
        verticalAlign: 'baseline',
      }}>
        {word}{correct && <span style={{ marginLeft: 4, color: t.mintShadow, fontSize: 10 }}>✓</span>}
      </span>
    );
  }

  function ActiveSlot() {
    const t = T();
    return (
      <span style={{
        display: 'inline-block', minWidth: 60, padding: '3px 12px', margin: '0 2px',
        border: `2.5px dashed ${t.yellowShadow}`, background: t.yellow + '33',
        fontFamily: '"DungGeunMo",monospace', fontSize: 13, color: t.yellowShadow,
        textAlign: 'center', verticalAlign: 'baseline',
        animation: 'forinPulseRing 1.2s ease-in-out infinite',
      }}>?</span>
    );
  }

  function WordTile({ word, focused, used }) {
    const t = T();
    return (
      <div style={{
        background: used ? t.ink + '22' : (focused ? t.yellow : '#fff'),
        color: used ? t.textFaint : t.ink,
        border: `3px solid ${t.ink}`,
        boxShadow: used ? 'none' : `3px 3px 0 0 ${focused ? t.yellowShadow : t.ink}`,
        padding: '8px 4px', textAlign: 'center',
        fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 13,
        position: 'relative',
        transform: focused ? 'translate(-1px,-1px)' : 'none',
        textDecoration: used ? 'line-through' : 'none',
        cursor: used ? 'default' : 'pointer',
      }}>
        {word}
        {focused && <div style={{ position: 'absolute', top: -8, left: -8, width: 14, height: 14, background: t.red, border: `2px solid ${t.ink}`, fontFamily: '"DungGeunMo",monospace', fontSize: 9, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>!</div>}
      </div>
    );
  }

  // ─── 2. WORD MATCHING ───────────────────────────────────────────────
  function ScreenQuizMatching() {
    const t = T();
    // 4 pairs. State: 2 correct, 1 incorrect (red), 1 in-progress.
    const matched = [
      { l: 0, r: 0, state: 'correct' },
      { l: 2, r: 3, state: 'correct' },
      { l: 1, r: 2, state: 'wrong' },
    ];
    const leftPicked = 3; // "burning" is currently picked, awaiting right
    const lefts  = [
      { en: 'throbbing', ipa: '/ˈθrɒbɪŋ/' },
      { en: 'sharp',     ipa: '/ʃɑːrp/' },
      { en: 'dull',      ipa: '/dʌl/' },
      { en: 'burning',   ipa: '/ˈbɜːrnɪŋ/' },
    ];
    const rights = [
      { ko: '욱신거리는', e: '💢' },
      { ko: '둔한 · 무거운', e: '🪨' },
      { ko: '화끈거리는', e: '🔥' },
      { ko: '찌르는 듯한', e: '🗡' },
    ];

    return (
      <div data-screen-label="07d Quiz · Matching" style={{ height: '100%', background: '#1F2937', position: 'relative', overflow: 'hidden' }}>
        <QuizBackdrop/>

        {/* top */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '52px 16px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 7 }}>
          <button style={{ background: '#fff', border: `2px solid ${t.ink}`, padding: '4px 10px', fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: t.ink, boxShadow: `2px 2px 0 0 ${t.ink}` }}>× 나가기</button>
          <div style={{ background: '#fff', border: `2px solid ${t.ink}`, padding: '4px 8px', fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: t.ink, boxShadow: `2px 2px 0 0 ${t.ink}` }}>
            통증 표현 카드 4종
          </div>
        </div>

        <QuizCard
          kind="MATCH" title="통증 표현 매칭" sub='환자가 자주 쓰는 통증 형용사 4개'
          zone="ER"
          missionNum={3} total={3} timer="00:42"
          footer={
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 4, fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: t.ink }}>
                {[0,1,2,3].map(i => (
                  <div key={i} style={{ width: 14, height: 14, border: `2px solid ${t.ink}`,
                    background: i < 2 ? t.mint : (i === 2 ? t.red : '#fff'),
                    fontSize: 9, lineHeight: '10px', textAlign: 'center', color: t.ink,
                  }}>{i < 2 ? '✓' : (i === 2 ? '✕' : '')}</div>
                ))}
                <span style={{ marginLeft: 6 }}>2/4</span>
              </div>
              <button style={{ background: '#fff', border: `2px solid ${t.ink}`, padding: '8px 10px', fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: t.ink, boxShadow: `2px 2px 0 0 ${t.ink}` }}>↺ 다시</button>
              <button style={{ background: t.mint, border: `2px solid ${t.ink}`, padding: '8px 12px', fontFamily: '"DungGeunMo",monospace', fontSize: 12, color: t.ink, boxShadow: `2px 2px 0 0 ${t.mintShadow}` }}>✓ 확인</button>
            </div>
          }>
          <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 11, color: t.textSoft, marginBottom: 10, textAlign: 'center' }}>
            왼쪽 단어와 오른쪽 의미를 짝지어 보세요.
          </div>

          {/* matching board */}
          <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr 36px 1fr', gap: 8, padding: '0 2px' }}>
            {/* left column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {lefts.map((w, i) => {
                const m = matched.find(x => x.l === i);
                const isPicked = leftPicked === i;
                return <MatchChip key={i} text={w.en} sub={w.ipa} side="L"
                  status={m?.state} picked={isPicked}/>;
              })}
            </div>

            {/* connectors */}
            <svg viewBox="0 0 36 240" width="36" height="100%" style={{ overflow: 'visible' }} shapeRendering="crispEdges">
              {/* row centers approx: row i center y ≈ 20 + i*60 */}
              {matched.map((m, i) => {
                const y1 = 20 + m.l * 60;
                const y2 = 20 + m.r * 60;
                const color = m.state === 'correct' ? t.mintShadow : '#EF4444';
                return (
                  <g key={i}>
                    <path d={`M0 ${y1} L36 ${y2}`} stroke={color} strokeWidth="3"
                      strokeDasharray={m.state === 'wrong' ? '4,3' : 'none'} fill="none"/>
                    {/* dots */}
                    <rect x="-3" y={y1-3} width="6" height="6" fill={color} stroke={t.ink} strokeWidth="1"/>
                    <rect x="33" y={y2-3} width="6" height="6" fill={color} stroke={t.ink} strokeWidth="1"/>
                  </g>
                );
              })}
              {/* in-progress dotted line from picked left to user finger */}
              {leftPicked != null && (
                <path d={`M0 ${20 + leftPicked * 60} L24 ${20 + leftPicked * 60 + 12}`}
                  stroke={t.yellowShadow} strokeWidth="3" strokeDasharray="3,3" fill="none"/>
              )}
            </svg>

            {/* right column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {rights.map((w, i) => {
                const m = matched.find(x => x.r === i);
                return <MatchChip key={i} text={w.ko} sub={w.e} side="R" status={m?.state}/>;
              })}
            </div>
          </div>

          {/* feedback toast for the wrong pair */}
          <div style={{ marginTop: 12, background: '#FEE2E2', border: `2px solid ${t.ink}`, padding: '6px 10px', fontFamily: '"Galmuri11",monospace', fontSize: 11, color: t.ink, lineHeight: 1.4, display: 'flex', alignItems: 'center', gap: 6, boxShadow: `2px 2px 0 0 ${t.ink}` }}>
            <span style={{ background: '#EF4444', color: '#fff', fontFamily: '"DungGeunMo",monospace', fontSize: 9, padding: '1px 5px', border: `1.5px solid ${t.ink}` }}>X</span>
            <b>sharp</b>은 "찌르는 듯한" 통증이에요. 다시 시도!
          </div>
        </QuizCard>
      </div>
    );
  }

  function MatchChip({ text, sub, side, status, picked }) {
    const t = T();
    let bg = '#fff', shadow = t.ink, brd = t.ink;
    if (status === 'correct') { bg = t.mint; shadow = t.mintShadow; }
    if (status === 'wrong')   { bg = '#FEE2E2'; shadow = '#EF4444'; }
    if (picked)               { bg = t.yellow; shadow = t.yellowShadow; }
    return (
      <div style={{
        background: bg, border: `3px solid ${brd}`, boxShadow: `3px 3px 0 0 ${shadow}`,
        padding: '8px 8px', textAlign: 'center', position: 'relative',
        fontFamily: '"DungGeunMo","Galmuri11",monospace', color: t.ink, lineHeight: 1.1,
        transform: picked ? 'translate(-1px,-1px)' : 'none',
      }}>
        <div style={{ fontSize: 13 }}>{text}</div>
        {sub && <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 9, color: t.textSoft, marginTop: 3 }}>{sub}</div>}
        {picked && <div style={{ position: 'absolute', top: -7, [side==='L'?'right':'left']: -7, width: 14, height: 14, background: t.red, border: `2px solid ${t.ink}`, fontFamily: '"DungGeunMo",monospace', fontSize: 9, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>!</div>}
        {status === 'correct' && <div style={{ position: 'absolute', top: -7, [side==='L'?'right':'left']: -7, width: 14, height: 14, background: t.mintShadow, color:'#fff', border: `2px solid ${t.ink}`, fontFamily: '"DungGeunMo",monospace', fontSize: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✓</div>}
        {status === 'wrong' && <div style={{ position: 'absolute', top: -7, [side==='L'?'right':'left']: -7, width: 14, height: 14, background: '#EF4444', color:'#fff', border: `2px solid ${t.ink}`, fontFamily: '"DungGeunMo",monospace', fontSize: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</div>}
      </div>
    );
  }

  // ─── 3. VITALS LABELING (bonus — drag-and-drop quiz) ───────────────
  function ScreenQuizVitals() {
    const t = T();
    return (
      <div data-screen-label="07e Quiz · Vitals" style={{ height: '100%', background: '#1F2937', position: 'relative', overflow: 'hidden' }}>
        <QuizBackdrop/>

        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '52px 16px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 7 }}>
          <button style={{ background: '#fff', border: `2px solid ${t.ink}`, padding: '4px 10px', fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: t.ink, boxShadow: `2px 2px 0 0 ${t.ink}` }}>× 나가기</button>
          <div style={{ background: '#fff', border: `2px solid ${t.ink}`, padding: '4px 8px', fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: t.ink, boxShadow: `2px 2px 0 0 ${t.ink}` }}>
            바이탈 모니터
          </div>
        </div>

        <QuizCard
          kind="LABEL" title="바이탈 라벨 붙이기" sub="모니터의 숫자에 알맞은 영어 명칭을 끌어다 놓으세요"
          zone="ER"
          missionNum={1} total={3} timer="00:55"
          footer={
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={{ flex: 1, background: '#fff', border: `2px solid ${t.ink}`, padding: '8px', fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: t.ink, boxShadow: `2px 2px 0 0 ${t.ink}` }}>↺ 처음부터</button>
              <button style={{ flex: 2, background: t.mint, border: `2px solid ${t.ink}`, padding: '8px', fontFamily: '"DungGeunMo",monospace', fontSize: 12, color: t.ink, boxShadow: `2px 2px 0 0 ${t.mintShadow}` }}>✓ 닥터 콜</button>
            </div>
          }>
          {/* monitor */}
          <div style={{
            background: '#0F1A24', border: `4px solid ${t.ink}`, boxShadow: `4px 4px 0 0 ${t.ink}`,
            padding: 10, position: 'relative',
          }}>
            <div style={{ position: 'absolute', top: -8, left: 8, background: '#fff', border: `1.5px solid ${t.ink}`, padding: '0 4px', fontFamily: '"DungGeunMo",monospace', fontSize: 8, color: t.ink }}>
              VITAL SIGNS MONITOR
            </div>

            {/* readings grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <VitalReading num="142/95" unit="mmHg" color="#EF4444" label="?" labelMatched={null}/>
              <VitalReading num="118" unit="bpm" color="#F87171" label="HR · Pulse" labelMatched="correct"/>
              <VitalReading num="92%" unit="SpO₂" color="#FACC15" label="?" labelMatched="hover"/>
              <VitalReading num="38.7" unit="°C" color="#FB923C" label="Temp" labelMatched="correct"/>
            </div>

            {/* ECG wave */}
            <div style={{ marginTop: 8, height: 24, background: '#000', border: `1.5px solid ${t.ink}`, position: 'relative', overflow: 'hidden' }}>
              <svg viewBox="0 0 200 24" width="100%" height="24" preserveAspectRatio="none">
                <polyline points="0,12 30,12 32,4 34,20 36,12 80,12 82,4 84,20 86,12 130,12 132,4 134,20 136,12 180,12 200,12" fill="none" stroke="#22D3EE" strokeWidth="1.5"/>
              </svg>
            </div>
          </div>

          {/* label bank */}
          <div style={{ marginTop: 14 }}>
            <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: '#fff', opacity: 0.85, marginBottom: 6 }}>━ 라벨 카드 ━━━━━━━━</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 8 }}>
              <LabelTile word="Blood Pressure" sub="BP · 혈압" focused/>
              <LabelTile word="SpO₂ · Sat" sub="산소포화도"/>
              <LabelTile word="Temp" sub="체온" used/>
              <LabelTile word="HR · Pulse" sub="심박" used/>
            </div>
          </div>

          {/* explainer */}
          <div style={{ marginTop: 12, fontFamily: '"Galmuri11",monospace', fontSize: 10, color: t.textSoft, lineHeight: 1.5, padding: '6px 8px', background: t.cream, border: `1.5px dashed ${t.ink}55` }}>
            <b style={{ color: t.ink }}>Tip.</b> 미국에서는 BP를 "one-forty-two over ninety-five"처럼 읽어요.
          </div>
        </QuizCard>
      </div>
    );
  }

  function VitalReading({ num, unit, color, label, labelMatched }) {
    const t = T();
    return (
      <div style={{ background: '#0A1320', border: `2px solid ${color}66`, padding: 8, position: 'relative', minHeight: 64 }}>
        <div style={{ fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 24, color, lineHeight: 1, textShadow: `0 0 8px ${color}66` }}>{num}</div>
        <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 10, color: '#94A3B8', marginTop: 2 }}>{unit}</div>
        {/* drop zone */}
        <div style={{
          marginTop: 6,
          background: labelMatched === 'correct' ? t.mint : (labelMatched === 'hover' ? t.yellow : 'transparent'),
          color: labelMatched ? t.ink : '#fff',
          border: labelMatched
            ? `2px solid ${t.ink}`
            : `2px dashed ${t.yellow}88`,
          padding: '3px 6px',
          fontFamily: '"DungGeunMo",monospace', fontSize: 10,
          textAlign: 'center',
          boxShadow: labelMatched === 'correct' ? `2px 2px 0 0 ${t.mintShadow}` : 'none',
          animation: labelMatched === 'hover' ? 'forinPulseRing 1s ease-in-out infinite' : 'none',
        }}>{label}</div>
      </div>
    );
  }

  function LabelTile({ word, sub, focused, used }) {
    const t = T();
    return (
      <div style={{
        background: used ? t.ink + '22' : (focused ? t.yellow : '#fff'),
        color: used ? t.textFaint : t.ink,
        border: `3px solid ${t.ink}`,
        boxShadow: used ? 'none' : `3px 3px 0 0 ${focused ? t.yellowShadow : t.ink}`,
        padding: '7px 6px', textAlign: 'center',
        fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 11,
        position: 'relative',
        transform: focused ? 'translate(-1px,-1px)' : 'none',
        textDecoration: used ? 'line-through' : 'none',
      }}>
        {word}
        {sub && <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 9, color: used ? t.textFaint : t.textSoft, marginTop: 2 }}>{sub}</div>}
        {focused && <div style={{ position: 'absolute', top: -7, right: -7, width: 14, height: 14, background: t.red, color:'#fff', border: `2px solid ${t.ink}`, fontFamily: '"DungGeunMo",monospace', fontSize: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>!</div>}
      </div>
    );
  }

  Object.assign(window, { ScreenQuizSentence, ScreenQuizMatching, ScreenQuizVitals, QuizBackdrop, QuizCard });
})();
