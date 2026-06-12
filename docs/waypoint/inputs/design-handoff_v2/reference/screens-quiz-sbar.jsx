// screens-quiz-sbar.jsx — G · SBAR phone handoff ordering (ICU zone)

function ScreenQuizSBAR() {
  const t = window.ForinTokens;
  const C = '#2A2522';

  // SBAR sections with their colors
  const tracks = [
    { key: 'S', name: 'Situation',      color: '#EF4444', desc: '지금 무슨 일이?'    },
    { key: 'B', name: 'Background',     color: '#F97316', desc: '환자 배경은?'        },
    { key: 'A', name: 'Assessment',     color: '#3B82F6', desc: '내가 본 상태는?'    },
    { key: 'R', name: 'Recommendation', color: '#10B981', desc: '어떻게 하면 좋을지?' },
  ];

  // 5 cards in correct order. State: cards 1/2/3 are placed; cards 4/5 still in bank.
  const cards = [
    { idx: 1, track: 'S', text: '"Mr. Park in Bed 412 has new shortness of breath."',     placed: true  },
    { idx: 2, track: 'B', text: '"68-year-old male, post-op day 2, history of asthma."',  placed: true  },
    { idx: 3, track: 'A', text: '"SpO₂ 88% on room air, RR 28, accessory muscle use."',  placed: true  },
    { idx: 4, track: 'A', text: '"BP 110/70, HR 105, lungs clear bilaterally."',          placed: false, dragging: true },
    { idx: 5, track: 'R', text: '"I\'d like you to come evaluate. He may need a stat ABG."', placed: false },
  ];

  const slots = [1, 2, 3, 4, 5];

  return (
    <div data-screen-label="07g Quiz · SBAR" style={{ height: '100%', background: '#1F2937', position: 'relative', overflow: 'hidden' }}>
      <QuizBackdrop/>

      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '52px 16px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 7 }}>
        <button style={{ background: '#fff', border: `2px solid ${C}`, padding: '4px 10px', fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: C, boxShadow: `2px 2px 0 0 ${C}` }}>× 나가기</button>
        <div style={{ background: '#fff', border: `2px solid ${C}`, padding: '4px 8px', fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: C, boxShadow: `2px 2px 0 0 ${C}`, display: 'flex', alignItems: 'center', gap: 4 }}>
          📞 Dr. Patel
        </div>
      </div>

      <QuizCard
        kind="ORDER" zone="ICU" title="SBAR 인계 순서"
        sub='담당의에게 SBAR 형식으로 보고하기'
        missionNum={1} total={2} timer="01:35"
        footer={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ flex: 1, fontFamily: '"DungGeunMo",monospace', fontSize: 9, color: C, lineHeight: 1.3 }}>
              <div style={{ color: t.textSoft }}>3/5 카드 배치됨</div>
            </div>
            <button style={{ background: '#fff', border: `2px solid ${C}`, padding: '7px 10px', fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: C, boxShadow: `2px 2px 0 0 ${C}` }}>💡 힌트</button>
            <button style={{ background: t.mint, border: `2px solid ${C}`, padding: '7px 12px', fontFamily: '"DungGeunMo",monospace', fontSize: 12, color: C, boxShadow: `2px 2px 0 0 ${t.mintShadow}` }}>📞 콜 시작</button>
          </div>
        }>
        {/* SBAR legend rail */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 10 }}>
          {tracks.map(tr => (
            <div key={tr.key} style={{ flex: 1, background: tr.color, border: `2px solid ${C}`, padding: '4px 6px', textAlign: 'center', boxShadow: `2px 2px 0 0 ${C}` }}>
              <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 14, color: '#fff', lineHeight: 1 }}>{tr.key}</div>
              <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 8, color: '#fff', marginTop: 2, opacity: 0.9 }}>{tr.name}</div>
            </div>
          ))}
        </div>

        {/* numbered slots (ordered area) */}
        <div style={{ background: t.paper, border: `2px dashed ${C}66`, padding: 6, marginBottom: 10 }}>
          <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 9, color: C, marginBottom: 4 }}>━ 콜 스크립트 (순서대로) ━━━━</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {slots.map(s => {
              const placed = cards.find(c => c.placed && c.idx === s);
              return <ScriptSlot key={s} slotNum={s} card={placed} tracks={tracks}/>;
            })}
          </div>
        </div>

        {/* card bank below */}
        <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 9, color: '#fff', opacity: 0.85, marginBottom: 5 }}>━ 미배치 카드 ━━━━━━</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {cards.filter(c => !c.placed).map(c => <SBARCard key={c.idx} card={c} tracks={tracks} inBank/>)}
        </div>

        {/* mini-feedback */}
        <div style={{ marginTop: 10, padding: '6px 8px', background: t.cream, border: `1.5px dashed ${C}55`, fontFamily: '"Galmuri11",monospace', fontSize: 10, color: t.textSoft, lineHeight: 1.5 }}>
          <b style={{ color: C }}>SBAR Tip.</b> Background는 환자의 <u>변하지 않는</u> 정보(나이/병력/입원사유),
          Assessment는 <u>지금 당장</u>의 평가예요.
        </div>
      </QuizCard>
    </div>
  );
}

function ScriptSlot({ slotNum, card, tracks }) {
  const C = '#2A2522';
  const t = window.ForinTokens;
  if (card) {
    return (
      <div style={{ display: 'flex', alignItems: 'stretch', gap: 4 }}>
        <div style={{ width: 18, background: '#fff', border: `2px solid ${C}`, fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: C, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {slotNum}
        </div>
        <SBARCard card={card} tracks={tracks}/>
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', alignItems: 'stretch', gap: 4 }}>
      <div style={{ width: 18, background: '#fff', border: `2px solid ${C}66`, fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: C + '66', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {slotNum}
      </div>
      <div style={{ flex: 1, border: `2px dashed ${C}55`, background: 'transparent', padding: '8px 10px', fontFamily: '"Galmuri11",monospace', fontSize: 11, color: C + '66' }}>
        여기로 드래그…
      </div>
    </div>
  );
}

function SBARCard({ card, tracks, inBank }) {
  const C = '#2A2522';
  const t = window.ForinTokens;
  const tr = tracks.find(x => x.key === card.track);
  return (
    <div style={{
      flex: 1, display: 'flex', alignItems: 'stretch',
      background: '#fff', border: `2px solid ${C}`,
      boxShadow: card.dragging ? `3px 3px 0 0 ${t.yellowShadow}` : `2px 2px 0 0 ${C}`,
      transform: card.dragging ? 'translate(-1px,-1px) rotate(-1deg)' : 'none',
      position: 'relative',
    }}>
      <div style={{ width: 22, background: tr.color, borderRight: `2px solid ${C}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"DungGeunMo",monospace', fontSize: 14, color: '#fff' }}>
        {tr.key}
      </div>
      <div style={{ flex: 1, padding: '6px 10px', fontFamily: '"Galmuri11","Pretendard",sans-serif', fontSize: 11, color: C, lineHeight: 1.35 }}>
        {card.text}
      </div>
      {card.dragging && inBank && (
        <div style={{ position: 'absolute', top: -7, right: -7, width: 16, height: 16, background: '#EF4444', color: '#fff', border: `2px solid ${C}`, fontFamily: '"DungGeunMo",monospace', fontSize: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>!</div>
      )}
      {!inBank && (
        <div style={{ display: 'flex', alignItems: 'center', padding: '0 6px', borderLeft: `1.5px dashed ${C}33` }}>
          <span style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: '#10B981' }}>✓</span>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { ScreenQuizSBAR });
