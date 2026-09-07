// screens-quiz-listen.jsx — I · Listening dictation (Pharmacy/General)

function ScreenQuizListen() {
  const t = window.ForinTokens;
  const C = '#2A2522';

  // Choices — A is correct; B/C are similar-sounding distractors
  const choices = [
    {
      letter: 'A',
      text: 'Give 2 mg of morphine IV every 4 hours, PRN pain.',
      tags: ['2 mg', 'IV', 'q4h', 'PRN'],
      hovering: true,
    },
    {
      letter: 'B',
      text: 'Give 20 mg of morphine IM every 4 hours, after meals.',
      tags: ['20 mg', 'IM', 'q4h', 'PC'],
    },
    {
      letter: 'C',
      text: 'Give 2 mL of morphine IV every 6 hours, PRN pain.',
      tags: ['2 mL', 'IV', 'q6h', 'PRN'],
    },
  ];

  return (
    <div data-screen-label="07i Quiz · Listening" style={{ height: '100%', background: '#1F2937', position: 'relative', overflow: 'hidden' }}>
      <QuizBackdrop/>

      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '52px 16px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 7 }}>
        <button style={{ background: '#fff', border: `2px solid ${C}`, padding: '4px 10px', fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: C, boxShadow: `2px 2px 0 0 ${C}` }}>× 나가기</button>
        <div style={{ background: '#fff', border: `2px solid ${C}`, padding: '4px 8px', fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: C, boxShadow: `2px 2px 0 0 ${C}` }}>
          📞 Dr. Patel
        </div>
      </div>

      <QuizCard
        kind="LISTEN" zone="약국" title="구두 처방 받아쓰기"
        sub='의사의 verbal order를 정확히 듣고 골라주세요'
        missionNum={1} total={3} timer="01:48"
        footer={
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ flex: 1, background: '#fff', border: `2px solid ${C}`, padding: '8px', fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: C, boxShadow: `2px 2px 0 0 ${C}` }}>🔊 한 번 더 듣기 (1/3)</button>
            <button style={{ flex: 2, background: t.mint, border: `2px solid ${C}`, padding: '8px', fontFamily: '"DungGeunMo",monospace', fontSize: 12, color: C, boxShadow: `2px 2px 0 0 ${t.mintShadow}` }}>✓ 복창하기 (Read back)</button>
          </div>
        }>
        {/* speaker + waveform card */}
        <div style={{ background: '#0F1A24', border: `3px solid ${C}`, boxShadow: `3px 3px 0 0 ${C}`, padding: 10, marginBottom: 12, position: 'relative' }}>
          <div style={{ position: 'absolute', top: -8, left: 8, background: '#fff', border: `1.5px solid ${C}`, padding: '0 5px', fontFamily: '"DungGeunMo",monospace', fontSize: 9, color: C }}>
            AUDIO · 0:08
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* speaker icon */}
            <div style={{ width: 44, height: 44, background: t.mint, border: `2.5px solid ${C}`, boxShadow: `2px 2px 0 0 ${t.mintShadow}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="22" height="22" viewBox="0 0 22 22" shapeRendering="crispEdges">
                <rect x="4" y="8" width="3" height="6" fill={C}/>
                <rect x="7" y="6" width="2" height="10" fill={C}/>
                <rect x="9" y="4" width="2" height="14" fill={C}/>
                <rect x="13" y="7" width="1" height="2" fill={C}/>
                <rect x="14" y="6" width="1" height="4" fill={C}/>
                <rect x="13" y="13" width="1" height="2" fill={C}/>
                <rect x="14" y="12" width="1" height="4" fill={C}/>
                <rect x="16" y="9" width="1" height="4" fill={C}/>
                <rect x="17" y="8" width="1" height="6" fill={C}/>
              </svg>
            </div>
            {/* waveform */}
            <div style={{ flex: 1, position: 'relative', height: 44 }}>
              <svg viewBox="0 0 200 40" width="100%" height="40" preserveAspectRatio="none" shapeRendering="crispEdges">
                {Array.from({ length: 50 }).map((_, i) => {
                  const heights = [6,12,18,10,22,14,8,16,28,18,24,12,8,14,20,30,22,16,8,12,18,26,14,8,10,16,22,28,18,12,8,14,20,16,10,18,24,12,8,14,20,16,10,6,12,18,8,14,20,10];
                  const played = i < 26;
                  const h = heights[i] || 10;
                  return (
                    <rect key={i} x={i * 4} y={20 - h / 2} width="3" height={h}
                          fill={played ? '#22D3EE' : '#475569'}/>
                  );
                })}
                {/* playhead */}
                <rect x="103" y="0" width="2" height="40" fill="#FEF08A"/>
              </svg>
              <div style={{ position: 'absolute', bottom: -14, left: 0, right: 0, display: 'flex', justifyContent: 'space-between', fontFamily: '"DungGeunMo",monospace', fontSize: 8, color: '#94A3B8' }}>
                <span>0:00</span><span style={{ color: '#FEF08A' }}>0:05</span><span>0:08</span>
              </div>
            </div>
          </div>
          {/* speed + replay */}
          <div style={{ marginTop: 18, display: 'flex', gap: 6 }}>
            <SpeedBtn>0.7×</SpeedBtn>
            <SpeedBtn active>1.0×</SpeedBtn>
            <div style={{ flex: 1 }}/>
            <SpeedBtn>📝 자막</SpeedBtn>
          </div>
        </div>

        {/* instruction */}
        <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 11, color: t.text, marginBottom: 6, textAlign: 'center' }}>
          닥터가 뭐라고 말했나요? <b style={{ color: C }}>가장 정확한 것</b>을 고르세요.
        </div>

        {/* choices */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {choices.map(ch => <ChoiceTile key={ch.letter} {...ch}/>)}
        </div>

        {/* glossary */}
        <div style={{ marginTop: 10, padding: '6px 8px', background: t.paper, border: `1.5px dashed ${C}55`, fontFamily: '"Galmuri11",monospace', fontSize: 10, color: t.textSoft, lineHeight: 1.6 }}>
          <b style={{ color: C }}>약어.</b>
          <span style={{ marginLeft: 4 }}><b>PRN</b> 필요할 때</span>
          <span style={{ marginLeft: 8 }}><b>q4h</b> 4시간마다</span>
          <span style={{ marginLeft: 8 }}><b>IV</b> 정맥주사</span>
          <span style={{ marginLeft: 8 }}><b>IM</b> 근육주사</span>
        </div>
      </QuizCard>
    </div>
  );
}

function SpeedBtn({ children, active }) {
  const C = '#2A2522';
  const t = window.ForinTokens;
  return (
    <button style={{
      background: active ? t.yellow : '#fff', border: `2px solid ${C}`,
      padding: '3px 8px', fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: C,
      boxShadow: active ? `2px 2px 0 0 ${t.yellowShadow}` : `1.5px 1.5px 0 0 ${C}`,
    }}>{children}</button>
  );
}

function ChoiceTile({ letter, text, tags, hovering }) {
  const C = '#2A2522';
  const t = window.ForinTokens;
  return (
    <div style={{
      display: 'flex', alignItems: 'stretch',
      background: hovering ? t.yellow + '44' : '#fff',
      border: `2.5px solid ${hovering ? t.yellowShadow : C}`,
      boxShadow: hovering ? `3px 3px 0 0 ${t.yellowShadow}` : `2px 2px 0 0 ${C}66`,
      transform: hovering ? 'translate(-1px,-1px)' : 'none',
      cursor: 'pointer', position: 'relative',
    }}>
      <div style={{ width: 30, background: hovering ? t.yellow : t.peach, borderRight: `2.5px solid ${C}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"DungGeunMo",monospace', fontSize: 16, color: C }}>
        {letter}
      </div>
      <div style={{ flex: 1, padding: '7px 9px' }}>
        <div style={{ fontFamily: '"Galmuri11","Pretendard",sans-serif', fontSize: 12, color: C, lineHeight: 1.35 }}>
          "{text}"
        </div>
        <div style={{ marginTop: 4, display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          {tags.map((tg, i) => (
            <span key={i} style={{ background: '#fff', border: `1px solid ${C}55`, padding: '0 4px', fontFamily: '"DungGeunMo",monospace', fontSize: 8, color: C }}>{tg}</span>
          ))}
        </div>
      </div>
      {hovering && (
        <div style={{ position: 'absolute', top: -7, right: -7, width: 14, height: 14, background: t.yellowShadow, color: '#fff', border: `2px solid ${C}`, fontFamily: '"DungGeunMo",monospace', fontSize: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>?</div>
      )}
    </div>
  );
}

Object.assign(window, { ScreenQuizListen });
