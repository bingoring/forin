// screens-quiz-bank.jsx — Bespoke per-department quizzes. SIX genuinely
// different visual formats (adapted from the ER/Ward/Pharmacy originals):
//   1) FILL    — sentence with word-bank slots      (cf. ScreenQuizSentence)
//   2) MATCH   — two columns + SVG connector lines   (cf. ScreenQuizMatching)
//   3) MONITOR — dark device panel, read & interpret (cf. ScreenQuizVitals)
//   4) ORDER   — numbered timeline, lock/drag        (cf. ScreenQuizSBAR)
//   5) CHECK   — clipboard checklist w/ checkboxes
//   6) MCQ     — scenario card + suggested-answer rows (dialogue style)
// Each department gets one of EACH format (6 distinct screens, not clones).
// Reuses window.QuizBackdrop + window.QuizCard from screens-quiz.jsx.

(function () {
  const T = () => window.ForinTokens;
  const INK = '#2A2522';

  function TopBar({ ctx }) {
    const t = T();
    return (
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '52px 16px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 7 }}>
        <button style={{ background: '#fff', border: `2px solid ${t.ink}`, padding: '4px 10px', fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: t.ink, boxShadow: `2px 2px 0 0 ${t.ink}` }}>× 나가기</button>
        <div style={{ background: '#fff', border: `2px solid ${t.ink}`, padding: '4px 8px', fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: t.ink, boxShadow: `2px 2px 0 0 ${t.ink}` }}>{ctx}</div>
      </div>
    );
  }
  const Ctx = (txt) => {
    const t = T();
    return <div style={{ background: t.paper, border: `2px solid ${t.ink}`, padding: '8px 10px', fontFamily: '"Galmuri11",monospace', fontSize: 11, color: t.text, lineHeight: 1.4, marginBottom: 13, position: 'relative', whiteSpace: 'pre-line' }}>
      <div style={{ position: 'absolute', top: -6, left: 12, background: '#fff', border: `1.5px solid ${t.ink}`, padding: '0 4px', fontFamily: '"DungGeunMo",monospace', fontSize: 8, color: t.ink }}>CONTEXT</div>
      {txt}
    </div>;
  };
  const submitFooter = (label = '✓ 제출하기') => {
    const t = T();
    return <div style={{ display: 'flex', gap: 8 }}>
      <button style={{ flex: 1, background: '#fff', border: `2px solid ${t.ink}`, padding: '8px', fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: t.ink, boxShadow: `2px 2px 0 0 ${t.ink}` }}>건너뛰기 −10XP</button>
      <button style={{ flex: 2, background: t.mint, border: `2px solid ${t.ink}`, padding: '8px', fontFamily: '"DungGeunMo",monospace', fontSize: 12, color: t.ink, boxShadow: `2px 2px 0 0 ${t.mintShadow}` }}>{label}</button>
    </div>;
  };

  // ═══ FORMAT 1 · FILL — sentence slots + word bank ══════════════════
  function FillFmt({ q }) {
    const t = T();
    const seg = q.sentence; // array of strings|{f:'word'}|{a:true}
    return (<>
      {Ctx(q.ctx)}
      <div style={{ background: '#fff', border: `3px solid ${t.ink}`, padding: '14px 12px', boxShadow: `3px 3px 0 0 ${t.ink}`, fontFamily: '"Galmuri11","Pretendard",sans-serif', fontSize: 14, color: t.ink, lineHeight: 2.3, textAlign: 'center' }}>
        {seg.map((s, i) => {
          if (typeof s === 'string') return <span key={i}>{s}</span>;
          if (s.a) return <span key={i} style={{ display: 'inline-block', minWidth: 58, padding: '3px 12px', margin: '0 2px', border: `2.5px dashed ${t.yellowShadow}`, background: t.yellow + '33', fontFamily: '"DungGeunMo",monospace', fontSize: 13, color: t.yellowShadow, textAlign: 'center', animation: 'forinPulseRing 1.2s ease-in-out infinite' }}>?</span>;
          return <span key={i} style={{ display: 'inline-block', background: t.mint, border: `2.5px solid ${t.ink}`, padding: '3px 10px', margin: '0 2px', fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 13, color: t.ink, boxShadow: `2px 2px 0 0 ${t.mintShadow}` }}>{s.f}<span style={{ marginLeft: 4, color: t.mintShadow, fontSize: 10 }}>✓</span></span>;
        })}
      </div>
      <div style={{ marginTop: 14 }}>
        <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: '#fff', opacity: 0.85, marginBottom: 6 }}>━ 단어 카드 ━━━━━━━━</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
          {q.bank.map((w, i) => (
            <div key={i} style={{ background: w[1] === 'used' ? t.ink + '22' : (w[1] === 'focus' ? t.yellow : '#fff'), color: w[1] === 'used' ? t.textFaint : t.ink, border: `3px solid ${t.ink}`, boxShadow: w[1] === 'used' ? 'none' : `3px 3px 0 0 ${w[1] === 'focus' ? t.yellowShadow : t.ink}`, padding: '8px 4px', textAlign: 'center', fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 12.5, position: 'relative', transform: w[1] === 'focus' ? 'translate(-1px,-1px)' : 'none', textDecoration: w[1] === 'used' ? 'line-through' : 'none' }}>
              {w[0]}
              {w[1] === 'focus' && <div style={{ position: 'absolute', top: -8, left: -8, width: 14, height: 14, background: t.red, border: `2px solid ${t.ink}`, fontFamily: '"DungGeunMo",monospace', fontSize: 9, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>!</div>}
            </div>
          ))}
        </div>
      </div>
      {q.tip && <div style={{ marginTop: 13, display: 'flex', alignItems: 'center', gap: 6, fontFamily: '"Galmuri11",monospace', fontSize: 10, color: t.textSoft }}><div style={{ width: 18, height: 18, background: t.yellow, border: `1.5px solid ${t.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>💡</div>{q.tip}</div>}
    </>);
  }

  // ═══ FORMAT 2 · MATCH — two columns + connector lines ══════════════
  function MatchFmt({ q }) {
    const t = T();
    // q.pairs: [{en,sub,ko,e,state}] index-aligned; connectors drawn for
    // matched rows (state correct/wrong); one row 'picked' (in progress).
    const chip = (main, sub, side, state, picked) => {
      let bg = '#fff', sh = t.ink;
      if (state === 'correct') { bg = t.mint; sh = t.mintShadow; }
      if (state === 'wrong') { bg = '#FEE2E2'; sh = '#EF4444'; }
      if (picked) { bg = t.yellow; sh = t.yellowShadow; }
      return <div style={{ background: bg, border: `3px solid ${t.ink}`, boxShadow: `3px 3px 0 0 ${sh}`, padding: '8px', textAlign: 'center', position: 'relative', fontFamily: '"DungGeunMo","Galmuri11",monospace', color: t.ink, lineHeight: 1.1, transform: picked ? 'translate(-1px,-1px)' : 'none' }}>
        <div style={{ fontSize: 12.5 }}>{main}</div>
        {sub && <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 9, color: t.textSoft, marginTop: 3 }}>{sub}</div>}
        {(state === 'correct' || state === 'wrong' || picked) && <div style={{ position: 'absolute', top: -7, [side === 'L' ? 'right' : 'left']: -7, width: 14, height: 14, background: state === 'correct' ? t.mintShadow : (state === 'wrong' ? '#EF4444' : t.red), color: '#fff', border: `2px solid ${t.ink}`, fontFamily: '"DungGeunMo",monospace', fontSize: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{state === 'correct' ? '✓' : (state === 'wrong' ? '✕' : '!')}</div>}
      </div>;
    };
    return (<>
      <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 11, color: t.textSoft, marginBottom: 10, textAlign: 'center' }}>{q.ctx}</div>
      <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr 36px 1fr', gap: 8 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {q.pairs.map((p, i) => <div key={i}>{chip(p.en, p.sub, 'L', p.state, p.picked)}</div>)}
        </div>
        <svg viewBox="0 0 36 240" width="36" height="240" style={{ overflow: 'visible', alignSelf: 'stretch' }}>
          {q.pairs.map((p, i) => {
            if (!p.state || p.state === 'idle') return null;
            const y = 20 + i * 60, color = p.state === 'correct' ? t.mintShadow : '#EF4444';
            return <g key={i}><path d={`M0 ${y} L36 ${y + (p.to || 0) * 60}`} stroke={color} strokeWidth="3" strokeDasharray={p.state === 'wrong' ? '4,3' : 'none'} fill="none"/><rect x="-3" y={y - 3} width="6" height="6" fill={color} stroke={t.ink}/><rect x="33" y={y + (p.to || 0) * 60 - 3} width="6" height="6" fill={color} stroke={t.ink}/></g>;
          })}
          {q.pairs.map((p, i) => p.picked ? <path key={'p' + i} d={`M0 ${20 + i * 60} L24 ${20 + i * 60 + 12}`} stroke={t.yellowShadow} strokeWidth="3" strokeDasharray="3,3" fill="none"/> : null)}
        </svg>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {q.pairs.map((p, i) => <div key={i}>{chip(p.ko, p.e, 'R', p.rstate, false)}</div>)}
        </div>
      </div>
      {q.note && <div style={{ marginTop: 12, background: '#FEE2E2', border: `2px solid ${t.ink}`, padding: '6px 10px', fontFamily: '"Galmuri11",monospace', fontSize: 11, color: t.ink, lineHeight: 1.4, display: 'flex', alignItems: 'center', gap: 6, boxShadow: `2px 2px 0 0 ${t.ink}` }}><span style={{ background: '#EF4444', color: '#fff', fontFamily: '"DungGeunMo",monospace', fontSize: 9, padding: '1px 5px', border: `1.5px solid ${t.ink}` }}>X</span><span dangerouslySetInnerHTML={{ __html: q.note }}/></div>}
    </>);
  }

  // ═══ FORMAT 3 · MONITOR — dark device panel, read & interpret ══════
  function MonitorFmt({ q }) {
    const t = T();
    return (<>
      {Ctx(q.ctx)}
      <div style={{ background: '#0F1A24', border: `4px solid ${t.ink}`, boxShadow: `4px 4px 0 0 ${t.ink}`, padding: 10, position: 'relative' }}>
        <div style={{ position: 'absolute', top: -8, left: 8, background: '#fff', border: `1.5px solid ${t.ink}`, padding: '0 4px', fontFamily: '"DungGeunMo",monospace', fontSize: 8, color: t.ink }}>{q.device}</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {q.readings.map((r, i) => (
            <div key={i} style={{ background: '#0A1320', border: `2px solid ${r.color}66`, padding: 8, position: 'relative', minHeight: 62 }}>
              <div style={{ fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 22, color: r.color, lineHeight: 1, textShadow: `0 0 8px ${r.color}66` }}>{r.num}</div>
              <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 10, color: '#94A3B8', marginTop: 2 }}>{r.unit}</div>
              <div style={{ marginTop: 6, background: r.state === 'correct' ? t.mint : (r.state === 'hover' ? t.yellow : 'transparent'), color: r.state ? t.ink : '#fff', border: r.state ? `2px solid ${t.ink}` : `2px dashed ${t.yellow}88`, padding: '3px 6px', fontFamily: '"DungGeunMo",monospace', fontSize: 9.5, textAlign: 'center', boxShadow: r.state === 'correct' ? `2px 2px 0 0 ${t.mintShadow}` : 'none', animation: r.state === 'hover' ? 'forinPulseRing 1s ease-in-out infinite' : 'none' }}>{r.label}</div>
            </div>
          ))}
        </div>
        {q.wave && <div style={{ marginTop: 8, height: 24, background: '#000', border: `1.5px solid ${t.ink}`, overflow: 'hidden' }}><svg viewBox="0 0 200 24" width="100%" height="24" preserveAspectRatio="none"><polyline points={q.wave} fill="none" stroke="#22D3EE" strokeWidth="1.5"/></svg></div>}
      </div>
      <div style={{ marginTop: 14 }}>
        <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: '#fff', opacity: 0.85, marginBottom: 6 }}>━ 라벨 카드 ━━━━━━━━</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 8 }}>
          {q.bank.map((w, i) => (
            <div key={i} style={{ background: w[2] === 'used' ? t.ink + '22' : (w[2] === 'focus' ? t.yellow : '#fff'), color: w[2] === 'used' ? t.textFaint : t.ink, border: `3px solid ${t.ink}`, boxShadow: w[2] === 'used' ? 'none' : `3px 3px 0 0 ${w[2] === 'focus' ? t.yellowShadow : t.ink}`, padding: '7px 6px', textAlign: 'center', fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 11, position: 'relative', textDecoration: w[2] === 'used' ? 'line-through' : 'none' }}>{w[0]}{w[1] && <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 9, color: t.textSoft, marginTop: 2 }}>{w[1]}</div>}</div>
          ))}
        </div>
      </div>
      {q.tip && <div style={{ marginTop: 12, fontFamily: '"Galmuri11",monospace', fontSize: 10, color: t.textSoft, lineHeight: 1.5, padding: '6px 8px', background: t.cream, border: `1.5px dashed ${t.ink}55` }}><b style={{ color: t.ink }}>Tip.</b> {q.tip}</div>}
    </>);
  }

  // ═══ FORMAT 4 · ORDER — numbered timeline (lock/drag) ══════════════
  function OrderFmt({ q }) {
    const t = T();
    return (<>
      {Ctx(q.ctx)}
      <div style={{ position: 'relative', paddingLeft: 14 }}>
        <div style={{ position: 'absolute', left: 5, top: 6, bottom: 6, width: 3, background: t.ink + '33' }}/>
        {q.steps.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 9, position: 'relative' }}>
            <div style={{ position: 'absolute', left: -12, width: 10, height: 10, background: s[2] ? t.mintShadow : t.yellow, border: `2px solid ${t.ink}`, borderRadius: '50%' }}/>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 9, background: s[2] ? t.mint : '#fff', border: `3px solid ${t.ink}`, boxShadow: `3px 3px 0 0 ${s[2] ? t.mintShadow : t.ink}`, padding: '8px 10px' }}>
              <div style={{ width: 20, height: 20, flexShrink: 0, background: t.ink, color: '#fff', fontFamily: '"DungGeunMo",monospace', fontSize: 12, textAlign: 'center', lineHeight: '18px' }}>{i + 1}</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 12, color: t.ink }}>{s[0]}</div>
                <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 10, color: t.textSoft, marginTop: 2 }}>{s[1]}</div>
              </div>
              <div style={{ marginLeft: 'auto', fontSize: 14 }}>{s[2] ? '🔒' : '↕'}</div>
            </div>
          </div>
        ))}
      </div>
    </>);
  }

  // ═══ FORMAT 5 · CHECK — clipboard checklist ════════════════════════
  function CheckFmt({ q }) {
    const t = T();
    return (<>
      {Ctx(q.ctx)}
      <div style={{ background: '#fff', border: `3px solid ${t.ink}`, boxShadow: `3px 3px 0 0 ${t.ink}`, padding: '6px 6px 4px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', width: 34, height: 8, background: '#9CA3AF', border: `2px solid ${t.ink}` }}/>
        {q.items.map((it, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '7px 8px', borderBottom: i < q.items.length - 1 ? `1.5px dotted ${t.ink}33` : 'none' }}>
            <div style={{ width: 19, height: 19, flexShrink: 0, border: `2.5px solid ${t.ink}`, background: it[2] ? t.mint : '#fff', color: t.ink, fontFamily: '"DungGeunMo",monospace', fontSize: 13, textAlign: 'center', lineHeight: '16px' }}>{it[2] ? '✓' : ''}</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 12, color: t.ink }}>{it[0]}</div>
              <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 9.5, color: t.textSoft, marginTop: 1 }}>{it[1]}</div>
            </div>
            {it[2] && <div style={{ marginLeft: 'auto', fontFamily: '"DungGeunMo",monospace', fontSize: 9, color: '#fff', background: t.mintShadow, padding: '1px 5px' }}>선택</div>}
          </div>
        ))}
      </div>
      {q.tip && <div style={{ marginTop: 12, fontFamily: '"Galmuri11",monospace', fontSize: 10, color: t.textSoft, lineHeight: 1.5, padding: '6px 8px', background: t.cream, border: `1.5px dashed ${t.ink}55` }}><b style={{ color: t.ink }}>Tip.</b> {q.tip}</div>}
    </>);
  }

  // ═══ FORMAT 6 · MCQ — scenario + suggested-answer rows ═════════════
  function McqFmt({ q }) {
    const t = T();
    return (<>
      <div style={{ background: t.ink, border: `3px solid ${t.ink}`, boxShadow: `3px 3px 0 0 ${t.ink}`, padding: '10px 12px', marginBottom: 13, position: 'relative' }}>
        <div style={{ position: 'absolute', top: -7, left: 10, background: t.peach, border: `1.5px solid ${t.ink}`, padding: '0 5px', fontFamily: '"DungGeunMo",monospace', fontSize: 8, color: t.ink }}>💬 SCENE</div>
        <div style={{ fontFamily: '"Galmuri11","Pretendard",sans-serif', fontSize: 12.5, color: t.cream, lineHeight: 1.5, whiteSpace: 'pre-line' }}>{q.scene}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {q.opts.map((o, i) => {
          const bg = o[2] === 'correct' ? t.mint : o[2] === 'wrong' ? '#FEE2E2' : '#fff';
          const sh = o[2] === 'correct' ? t.mintShadow : o[2] === 'wrong' ? '#EF4444' : t.ink;
          const mk = o[2] === 'correct' ? '✓' : o[2] === 'wrong' ? '✕' : (i + 1);
          return <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, background: bg, border: `2.5px solid ${t.ink}`, boxShadow: `2.5px 2.5px 0 0 ${sh}`, padding: '9px 10px' }}>
            <div style={{ width: 20, height: 20, flexShrink: 0, background: o[2] === 'idle' || !o[2] ? t.paper : t.ink, color: o[2] === 'idle' || !o[2] ? t.ink : '#fff', border: `2px solid ${t.ink}`, fontFamily: '"DungGeunMo",monospace', fontSize: 11, textAlign: 'center', lineHeight: '17px' }}>{mk}</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 12.5, color: t.ink, lineHeight: 1.3 }}>{o[0]}</div>
              {o[1] && <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 10, color: t.textSoft, marginTop: 2 }}>{o[1]}</div>}
            </div>
          </div>;
        })}
      </div>
      {q.note && <div style={{ marginTop: 12, background: t.mint, border: `2px solid ${t.ink}`, padding: '6px 10px', fontFamily: '"Galmuri11",monospace', fontSize: 10.5, color: t.ink, lineHeight: 1.4, boxShadow: `2px 2px 0 0 ${t.mintShadow}` }}><b>왜?</b> {q.note}</div>}
    </>);
  }

  // ═══ FORMAT 7 · CALC — dose/fluid calculation with keypad ══════════
  function CalcFmt({ q }) {
    const t = T();
    return (<>
      {Ctx(q.ctx)}
      <div style={{ background: '#fff', border: `3px solid ${t.ink}`, boxShadow: `3px 3px 0 0 ${t.ink}`, padding: '12px' }}>
        {q.given.map((g, i) => (<div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: '"Galmuri11",monospace', fontSize: 12, color: t.ink, padding: '3px 0', borderBottom: `1px dotted ${t.ink}33` }}><span>{g[0]}</span><b style={{ fontFamily: '"DungGeunMo",monospace' }}>{g[1]}</b></div>))}
        <div style={{ marginTop: 10, textAlign: 'center', fontFamily: '"DungGeunMo",monospace', fontSize: 15, color: t.ink }}>{q.eq} = <span style={{ background: t.mint, border: `2.5px solid ${t.ink}`, padding: '3px 12px', boxShadow: `2px 2px 0 0 ${t.mintShadow}` }}>{q.answer}</span> <span style={{ fontFamily: '"Galmuri11",monospace', fontSize: 11, color: t.textSoft }}>{q.unit}</span></div>
      </div>
      <div style={{ marginTop: 14 }}>
        <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: '#fff', opacity: .85, marginBottom: 6 }}>━ 계산기 ━━━━━━━━</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6 }}>
          {['7','8','9','4','5','6','1','2','3','.','0','⌫'].map((k, i) => (<div key={i} style={{ background: k === '⌫' ? t.paper : '#fff', border: `2.5px solid ${t.ink}`, boxShadow: `2px 2px 0 0 ${t.ink}`, padding: '9px 0', textAlign: 'center', fontFamily: '"DungGeunMo",monospace', fontSize: 14, color: t.ink }}>{k}</div>))}
        </div>
      </div>
      {q.tip && <div style={{ marginTop: 12, fontFamily: '"Galmuri11",monospace', fontSize: 10, color: t.textSoft, lineHeight: 1.5, padding: '6px 8px', background: t.cream, border: `1.5px dashed ${t.ink}55` }}><b style={{ color: t.ink }}>Tip.</b> {q.tip}</div>}
    </>);
  }

  // ═══ FORMAT 8 · SORT — drag chips into labeled buckets ═════════════
  function SortFmt({ q }) {
    const t = T();
    return (<>
      {Ctx(q.ctx)}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12, minHeight: 20 }}>
        {q.pool.map((p, i) => (<div key={i} style={{ background: t.yellow, border: `2.5px solid ${t.ink}`, boxShadow: `2px 2px 0 0 ${t.yellowShadow}`, padding: '6px 10px', fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 11.5, color: t.ink }}>{p}</div>))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${q.buckets.length},1fr)`, gap: 8 }}>
        {q.buckets.map((b, i) => (
          <div key={i} style={{ border: `3px solid ${t.ink}`, boxShadow: `3px 3px 0 0 ${t.ink}`, background: '#fff' }}>
            <div style={{ background: b.color, borderBottom: `2px solid ${t.ink}`, padding: '5px 4px', fontFamily: '"DungGeunMo",monospace', fontSize: 10.5, color: t.ink, textAlign: 'center' }}>{b.name}</div>
            <div style={{ padding: 6, display: 'flex', flexDirection: 'column', gap: 5, minHeight: 88 }}>
              {b.chips.map((c, j) => (<div key={j} style={{ background: c[1] ? t.mint : '#fff', border: `2px solid ${t.ink}`, boxShadow: c[1] ? `2px 2px 0 0 ${t.mintShadow}` : 'none', padding: '5px 6px', fontFamily: '"Galmuri11",monospace', fontSize: 10, color: t.ink, textAlign: 'center', lineHeight: 1.2 }}>{c[0]}{c[1] && <span style={{ marginLeft: 3, color: t.mintShadow }}>✓</span>}</div>))}
            </div>
          </div>
        ))}
      </div>
      {q.tip && <div style={{ marginTop: 12, fontFamily: '"Galmuri11",monospace', fontSize: 10, color: t.textSoft, lineHeight: 1.5, padding: '6px 8px', background: t.cream, border: `1.5px dashed ${t.ink}55` }}><b style={{ color: t.ink }}>Tip.</b> {q.tip}</div>}
    </>);
  }

  // ═══ FORMAT 9 · DICTATION — listen (waveform) & fill the blanks ════
  function DictationFmt({ q }) {
    const t = T();
    return (<>
      <div style={{ background: t.ink, border: `3px solid ${t.ink}`, boxShadow: `3px 3px 0 0 ${t.ink}`, padding: '10px 12px', marginBottom: 13, position: 'relative' }}>
        <div style={{ position: 'absolute', top: -7, left: 10, background: t.peach, border: `1.5px solid ${t.ink}`, padding: '0 5px', fontFamily: '"DungGeunMo",monospace', fontSize: 8, color: t.ink }}>🔊 AUDIO · 다시듣기</div>
        <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 11, color: t.cream, marginBottom: 7, lineHeight: 1.4 }}>{q.audio}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 2, height: 22 }}>{[4,9,14,7,12,5,10,15,6,11,8,13,4,9,12,6].map((h, i) => (<div key={i} style={{ flex: 1, height: h, background: '#22D3EE', opacity: .85 }}/>))}</div>
      </div>
      <div style={{ background: '#fff', border: `3px solid ${t.ink}`, padding: '14px 12px', boxShadow: `3px 3px 0 0 ${t.ink}`, fontFamily: '"Galmuri11","Pretendard",sans-serif', fontSize: 14, color: t.ink, lineHeight: 2.3, textAlign: 'center' }}>
        {q.sentence.map((s, i) => {
          if (typeof s === 'string') return <span key={i}>{s}</span>;
          if (s.a) return <span key={i} style={{ display: 'inline-block', minWidth: 58, padding: '3px 12px', margin: '0 2px', border: `2.5px dashed ${t.yellowShadow}`, background: t.yellow + '33', fontFamily: '"DungGeunMo",monospace', fontSize: 13, color: t.yellowShadow, animation: 'forinPulseRing 1.2s ease-in-out infinite' }}>?</span>;
          return <span key={i} style={{ display: 'inline-block', background: t.mint, border: `2.5px solid ${t.ink}`, padding: '3px 10px', margin: '0 2px', fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 13, color: t.ink, boxShadow: `2px 2px 0 0 ${t.mintShadow}` }}>{s.f}<span style={{ marginLeft: 4, color: t.mintShadow, fontSize: 10 }}>✓</span></span>;
        })}
      </div>
      <div style={{ marginTop: 14 }}>
        <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: '#fff', opacity: 0.85, marginBottom: 6 }}>━ 들은 단어 ━━━━━━━━</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
          {q.bank.map((w, i) => (<div key={i} style={{ background: w[1] === 'used' ? t.ink + '22' : (w[1] === 'focus' ? t.yellow : '#fff'), color: w[1] === 'used' ? t.textFaint : t.ink, border: `3px solid ${t.ink}`, boxShadow: w[1] === 'used' ? 'none' : `3px 3px 0 0 ${w[1] === 'focus' ? t.yellowShadow : t.ink}`, padding: '8px 4px', textAlign: 'center', fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 12.5, textDecoration: w[1] === 'used' ? 'line-through' : 'none' }}>{w[0]}</div>))}
        </div>
      </div>
      {q.tip && <div style={{ marginTop: 13, display: 'flex', alignItems: 'center', gap: 6, fontFamily: '"Galmuri11",monospace', fontSize: 10, color: t.textSoft }}><div style={{ width: 18, height: 18, background: t.yellow, border: `1.5px solid ${t.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>💡</div>{q.tip}</div>}
    </>);
  }

  const FMT = { fill: FillFmt, match: MatchFmt, monitor: MonitorFmt, order: OrderFmt, check: CheckFmt, mcq: McqFmt, calc: CalcFmt, sort: SortFmt, dictation: DictationFmt, gauge: GaugeFmt, spoterror: SpotErrorFmt };
  const KINDTAG = { fill: 'FILL', match: 'MATCH', monitor: 'LABEL', order: 'ORDER', check: 'CHECK', mcq: 'MCQ', calc: 'CALC', sort: 'SORT', dictation: 'LISTEN', gauge: 'SET', spoterror: 'FIX' };

  function GaugeFmt({ q }) {
    const t = T();
    const ok = q.correct;
    return (<>
      {Ctx(q.ctx)}
      <div style={{ background: '#0F1A24', border: `4px solid ${t.ink}`, boxShadow: `4px 4px 0 0 ${t.ink}`, padding: 14, position: 'relative', textAlign: 'center' }}>
        <div style={{ position: 'absolute', top: -8, left: 8, background: '#fff', border: `1.5px solid ${t.ink}`, padding: '0 4px', fontFamily: '"DungGeunMo",monospace', fontSize: 8, color: t.ink }}>{q.device}</div>
        <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 34, color: ok ? '#34D399' : '#FB923C', textShadow: `0 0 10px ${ok ? '#34D399' : '#FB923C'}66` }}>{q.current}</div>
        <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 11, color: '#94A3B8', marginTop: 2 }}>{q.unit}</div>
        <div style={{ marginTop: 12, height: 14, background: '#0A1320', border: `2px solid ${t.ink}`, position: 'relative' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: q.pct + '%', background: ok ? '#34D399' : '#FB923C' }}/>
          <div style={{ position: 'absolute', left: q.targetPct + '%', top: -3, bottom: -3, width: 3, background: '#22D3EE' }}/>
        </div>
        <div style={{ marginTop: 8, display: 'inline-block', background: t.mint, border: `2px solid ${t.ink}`, padding: '3px 10px', fontFamily: '"DungGeunMo",monospace', fontSize: 12, color: t.ink, boxShadow: `2px 2px 0 0 ${t.mintShadow}` }}>🎯 목표 {q.target}</div>
      </div>
      <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 8 }}>
        <div style={{ background: '#fff', border: `2.5px solid ${t.ink}`, boxShadow: `2px 2px 0 0 ${t.ink}`, padding: '10px', textAlign: 'center', fontFamily: '"DungGeunMo",monospace', fontSize: 15, color: t.ink }}>▼ 낮춤</div>
        <div style={{ background: t.yellow, border: `2.5px solid ${t.ink}`, boxShadow: `2px 2px 0 0 ${t.yellowShadow}`, padding: '10px', textAlign: 'center', fontFamily: '"DungGeunMo",monospace', fontSize: 15, color: t.ink }}>▲ 올림</div>
      </div>
      {q.tip && <div style={{ marginTop: 12, fontFamily: '"Galmuri11",monospace', fontSize: 10, color: t.textSoft, lineHeight: 1.5, padding: '6px 8px', background: t.cream, border: `1.5px dashed ${t.ink}55` }}><b style={{ color: t.ink }}>Tip.</b> {q.tip}</div>}
    </>);
  }
  function SpotErrorFmt({ q }) {
    const t = T();
    return (<>
      {Ctx(q.ctx)}
      <div style={{ background: '#fff', border: `3px solid ${t.ink}`, boxShadow: `3px 3px 0 0 ${t.ink}`, padding: '2px 4px' }}>
        {q.rows.map((r, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, padding: '9px 8px', borderBottom: i < q.rows.length - 1 ? `1.5px dotted ${t.ink}33` : 'none', background: r[2] ? '#FEE2E2' : 'transparent' }}>
            <span style={{ fontFamily: '"Galmuri11",monospace', fontSize: 11, color: t.textSoft }}>{r[0]}</span>
            <span style={{ fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 12.5, color: t.ink, display: 'flex', alignItems: 'center', gap: 6 }}>{r[1]}{r[2] && <span style={{ background: '#EF4444', color: '#fff', fontFamily: '"DungGeunMo",monospace', fontSize: 9, padding: '1px 5px', border: `1.5px solid ${t.ink}` }}>✕</span>}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 10, fontFamily: '"Galmuri11",monospace', fontSize: 11, color: '#fff', textAlign: 'center' }}>⚠ 위 항목 중 <b>잘못된 하나</b>를 찾으세요.</div>
      {q.note && <div style={{ marginTop: 10, background: t.mint, border: `2px solid ${t.ink}`, padding: '6px 10px', fontFamily: '"Galmuri11",monospace', fontSize: 10.5, color: t.ink, lineHeight: 1.4, boxShadow: `2px 2px 0 0 ${t.mintShadow}` }}><b>정답</b> {q.note}</div>}
    </>);
  }

  function renderQuiz(dep, d, q, i) {
    const Body = FMT[q.fmt];
    const foot = q.fmt === 'match'
      ? (() => { const t = T(); return <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><div style={{ flex: 1, fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: t.ink }}>{q.prog || '2/4'}</div><button style={{ background: '#fff', border: `2px solid ${t.ink}`, padding: '8px 10px', fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: t.ink, boxShadow: `2px 2px 0 0 ${t.ink}` }}>↺ 다시</button><button style={{ background: t.mint, border: `2px solid ${t.ink}`, padding: '8px 12px', fontFamily: '"DungGeunMo",monospace', fontSize: 12, color: t.ink, boxShadow: `2px 2px 0 0 ${t.mintShadow}` }}>✓ 확인</button></div>; })()
      : submitFooter(q.cta);
    return (
      <div data-screen-label={`Quiz · ${dep} ${i + 1}`} style={{ height: '100%', background: '#1F2937', position: 'relative', overflow: 'hidden' }}>
        <QuizBackdrop/>
        <TopBar ctx={q.top || d.topLabel}/>
        <QuizCard kind={KINDTAG[q.fmt]} title={q.title} sub={q.sub} zone={d.zone} missionNum={i + 1} total={6} timer={q.timer || '01:00'} footer={foot}>
          <Body q={q}/>
        </QuizCard>
      </div>
    );
  }

  // ══════════════════ DATA BANK — 6 DISTINCT formats per dept ═════════
  const S = (str) => str; // readability
  const BANK = window.ForinQuizBank = {
    LD: { zone: 'L&D', topLabel: '분만실 · Mrs. Park', quizzes: [
      { fmt: 'order', title: '분만 진행 단계', sub: '4단계를 순서대로', ctx: '👩 산모에게 진행 상황을 설명하려 합니다. 분만 단계를 순서대로 배열하세요.', steps: [['Latent phase (0–6 cm)', '잠복기', true], ['Active phase (6–10 cm)', '활성기', true], ['Delivery of the baby', '태아 만출', false], ['Delivery of the placenta', '태반 만출', false]] },
      { fmt: 'match', title: '분만 용어 매칭', sub: 'OB 필수 어휘 4종', ctx: '왼쪽 영어와 오른쪽 뜻을 짝지으세요.', prog: '2/4', pairs: [
        { en: 'Effacement', sub: '/ɪˈfeɪsmənt/', ko: '자궁경부 소실', e: '📏', state: 'correct', to: 0, rstate: 'correct' },
        { en: 'Dilation', sub: '/daɪˈleɪʃn/', ko: '자궁경부 개대', e: '⭕', state: 'correct', to: 0, rstate: 'correct' },
        { en: 'Crowning', sub: '/ˈkraʊnɪŋ/', ko: '오로(분비물)', e: '💧', state: 'wrong', to: 1 },
        { en: 'Lochia', sub: '/ˈloʊkiə/', ko: '배림(머리 보임)', e: '👶', picked: true } ], note: '<b>Crowning</b>은 태아 머리가 보이는 "배림"이에요.' },
      { fmt: 'monitor', title: '태아심박 감시 판독', sub: 'EFM 파형 해석', device: 'FETAL MONITOR · EFM', ctx: '전자태아감시(EFM) 화면입니다. 각 수치의 의미를 라벨로 붙이세요.', readings: [
        { num: '142', unit: 'FHR bpm', color: '#22D3EE', label: 'Baseline FHR', state: 'correct' },
        { num: '↓ late', unit: 'deceleration', color: '#EF4444', label: '?', state: 'hover' },
        { num: '3.5', unit: 'min interval', color: '#FACC15', label: '?', state: null },
        { num: '+15', unit: 'accel bpm', color: '#34D399', label: 'Acceleration', state: 'correct' } ],
        bank: [['Late decel', '늦은 하강', 'focus'], ['Contraction', '수축 간격'], ['Baseline', '', 'used'], ['Acceleration', '', 'used']], tip: '늦은 하강(late deceleration)은 태반 기능 저하 신호 — 즉시 좌측위!' },
      { fmt: 'mcq', title: '산후 출혈 대응', sub: 'PPH first action', top: '분만실 · 분만 직후', scene: '분만 직후 자궁이 물렁하고(atony) 질 출혈이 많습니다.\n가장 먼저 할 중재를 고르세요.', opts: [
        ['Firm fundal massage', '자궁저 마сад지로 수축 유도', 'correct'],
        ['Wait and reassess in 15 min', '15분 후 재사정', 'wrong'],
        ['Ambulate the patient', '환자 보행 격려', 'idle'],
        ['Insert a Foley catheter only', '유치도뇨만 시행', 'idle'] ], note: '이완성 출혈의 1차 중재는 자궁저 마사지로 수축을 유도하는 것.' },
      { fmt: 'check', title: '중증 자간전증 선별', sub: '경고징후 모두 고르기', ctx: '산전 산모의 활력징후·증상입니다. 중증 자간전증(severe pre-eclampsia)을 시사하는 항목을 모두 체크하세요.', items: [['BP 168 / 112 mmHg', '중증 고혈압', true], ['Severe headache', '심한 두통', true], ['Visual changes (blurring)', '시야 흐림', true], ['Mild ankle edema', '경미한 발목 부종', false]], tip: '경미한 발목 부종은 정상 임신에서도 흔해요.' },
      { fmt: 'dictation', title: '구두 처방 받아쓰기', sub: '전화 지시 복창', top: '분만실 · 전화 지시', audio: 'Dr. Park (전화): "After delivery, give oxytocin ten units in one litre of normal saline, IV."', sentence: ['"Oxytocin ', { a: true }, ' units in ', { f: '1 litre' }, ' of normal saline, IV."'], bank: [['10', 'focus'], ['1'], ['100'], ['1 litre', 'used'], ['2 litres'], ['saline', 'used']], tip: '구두 처방은 반드시 복창(read-back)으로 재확인해요.' },
    ]},
    NICU: { zone: 'NICU', topLabel: '신생아중환자실', quizzes: [
      { fmt: 'monitor', title: 'APGAR 채점', sub: '1분 점수 라벨링', device: 'APGAR · 1 MIN', ctx: '출생 1분 신생아 소견입니다. 각 항목의 점수(0·1·2)를 붙이세요.', readings: [
        { num: '110', unit: 'Heart rate', color: '#34D399', label: '2점', state: 'correct' },
        { num: 'blue', unit: 'limbs / pink body', color: '#FACC15', label: '?', state: 'hover' },
        { num: 'grimace', unit: 'reflex', color: '#22D3EE', label: '1점', state: 'correct' },
        { num: 'weak', unit: 'cry / effort', color: '#FB923C', label: '?', state: null } ],
        bank: [['0점', 'absent', ''], ['1점', 'partial', 'focus'], ['2점', 'full', 'used']], tip: '몸통 분홍·사지 청색(acrocyanosis)은 색깔 항목 1점.' },
      { fmt: 'check', title: '미숙아 위험 징후', sub: '즉시 보고 항목 고르기', ctx: '이른둥이(미숙아)를 관찰 중입니다. 즉시 보고해야 할 위험 징후를 모두 체크하세요.', items: [['Apnea > 20 sec', '20초 이상 무호흡', true], ['Grunting / retractions', '신음·함몰호흡', true], ['Temperature instability', '체온 불안정', true], ['Occasional hiccups', '가끔 딸꾹질', false]], tip: '딸꾹질은 정상. 무호흡·함몰호흡·체온 불안정은 응급.' },
      { fmt: 'match', title: '신생아 용어', sub: 'NICU 필수 어휘', ctx: '용어와 뜻을 짝지으세요.', prog: '2/4', pairs: [
        { en: 'Jaundice', sub: '/ˈdʒɔːndɪs/', ko: '황달', e: '💛', state: 'correct', to: 0, rstate: 'correct' },
        { en: 'Surfactant', sub: '/sərˈfæktənt/', ko: '폐 표면활성제', e: '🫁', state: 'correct', to: 0, rstate: 'correct' },
        { en: 'Gavage', sub: '/ɡəˈvɑːʒ/', ko: '캥거루 케어', e: '🦘', state: 'wrong', to: 1 },
        { en: 'Kangaroo care', sub: '피부접촉', ko: '위관 영양', e: '🍼', picked: true }], note: '<b>Gavage</b>는 위관 영양(tube feeding)이에요.' },
      { fmt: 'mcq', title: '광선치료 간호', sub: 'Phototherapy', top: 'NICU · 황달 치료', scene: '황달로 광선치료(phototherapy)를 받는 신생아를 간호합니다.\n옳은 중재를 고르세요.', opts: [['Cover the eyes with shields', '안대로 눈 보호·기저귀만 착용', 'correct'], ['Dress the baby warmly in a blanket', '담요로 감싸기', 'wrong'], ['Stop all feeds during therapy', '수유 전면 중단', 'idle'], ['Apply lotion to the skin', '피부에 로션 도포', 'idle']], note: '광선치료 시 눈 보호가 필수, 노출 피부를 넓혀 효과를 높여요.' },
      { fmt: 'calc', title: '체중 기반 용량 계산', sub: 'Weight-based dose', ctx: '🍼 신생아 항생제를 체중 기반으로 계산합니다. 처방 용량을 구하세요.', given: [['Baby weight', '3.2 kg'], ['Ordered dose', '5 mg / kg'], ['Frequency', 'q12h']], eq: '5 × 3.2', answer: '16', unit: 'mg / dose', tip: '신생아 투약은 체중(kg) × 용량으로 계산 — 소수점 주의!' },
      { fmt: 'order', title: '캥거루 케어 순서', sub: '피부접촉 준비 단계', ctx: '부모의 캥거루 케어(skin-to-skin)를 준비합니다. 순서대로 배열하세요.', steps: [['Hand hygiene & gown', '손위생·가운', true], ['Screen & warm the room', '실온·차폐 준비', true], ['Place baby skin-to-skin', '피부접촉으로 안기', false], ['Cover with a warm blanket', '따뜻한 담요로 덮기', false]] },
      { fmt: 'gauge', title: '인큐베이터 온도 설정', sub: 'Servo temp set', ctx: '🍼 미숙아 인큐베이터를 중성온도환경으로 설정하세요.', device: 'INCUBATOR · SERVO', current: '34.0', unit: '°C · 현재', target: '36.5 °C', pct: 52, targetPct: 78, correct: false, tip: '미숙아 중성온도환경은 대략 36–37°C.' },
    ]},
    PSYCH: { zone: 'PSYCH', topLabel: '정신과 폐쇄병동', quizzes: [
      { fmt: 'mcq', title: '치료적 의사소통', sub: '가장 치료적인 응답', top: '정신과 · 데이룸', scene: '환자: "다들 나를 감시하고 있어요. 여기서 나가야 해요."\n가장 치료적인(therapeutic) 응답을 고르세요.', opts: [['"You seem frightened. I\'m here and you are safe."', '감정 인정 + 안전 보장', 'correct'], ['"That\'s not true, nobody is watching you."', '망상을 즉시 부정', 'wrong'], ['"Calm down or I\'ll call security."', '위협적 지시', 'idle'], ['"Why do you think everyone watches you?"', '망상을 캐묻기', 'idle']], note: '망상은 부정도 동조도 하지 않고, 감정을 반영하며 안전을 보장.' },
      { fmt: 'check', title: '자살위험 사정', sub: '고위험 요소 고르기', ctx: '입원 환자를 사정 중입니다. 즉각적 고위험(high acute risk)을 시사하는 요소를 모두 체크하세요.', items: [['A specific plan and access to means', '구체적 계획 + 수단 접근', true], ['Recently giving away belongings', '소지품 나눠주기', true], ['Expresses hopelessness', '절망감 표현', true], ['Enjoys weekend hobbies', '주말 취미를 즐김', false]], tip: '계획·수단·절망감은 고위험. 미래 지향적 태도는 보호 요인.' },
      { fmt: 'check', title: '안전 환경 점검', sub: '리거처 프리 환경', top: '정신과 · 병실 점검', ctx: '폐쇄병동 병실을 안전 점검합니다. 즉시 조치가 필요한(위험) 항목을 모두 체크하세요.', items: [['Long call-bell cord', '긴 콜벨 끈', true], ['Glass drinking cup', '유리컵', true], ['Exposed door hinges', '노출된 경첩', true], ['Bolted-down safe bed', '볼트 고정 안전침대', false]], tip: '끈·유리·경첩 등 리거처(결박) 지점을 제거해야 해요.' },
      { fmt: 'match', title: '정신상태 용어', sub: 'Mental status', ctx: '용어와 뜻을 짝지으세요.', prog: '2/4', pairs: [
        { en: 'Delusion', sub: '/dɪˈluːʒn/', ko: '망상', e: '🧠', state: 'correct', to: 0, rstate: 'correct' },
        { en: 'Hallucination', sub: '/həˌluːsɪˈneɪʃn/', ko: '환각', e: '👁', state: 'correct', to: 0, rstate: 'correct' },
        { en: 'Flat affect', sub: '/ˈæfekt/', ko: '우원증(빙빙 돌려말함)', e: '🔄', state: 'wrong', to: 1 },
        { en: 'Tangentiality', sub: '/tænˌdʒenʃiˈæləti/', ko: '둔마된 정동', e: '😐', picked: true }], note: '<b>Flat affect</b>은 감정 표현이 거의 없는 "둔마된 정동".' },
      { fmt: 'mcq', title: '리튬 독성', sub: 'Lithium toxicity', top: '정신과 · 투약', scene: '리튬 복용 환자가 손 떨림·구토·혼돈을 보입니다.\n우선 조치를 고르세요.', opts: [['Hold the dose & check lithium level', '투약 보류 + 혈중농도 확인', 'correct'], ['Give an extra dose', '추가 투약', 'wrong'], ['Restrict all fluids', '수분 전면 제한', 'idle'], ['Ignore — these are expected', '정상이므로 무시', 'idle']], note: '떨림·구토·혼돈은 리튬 독성 신호 — 보류하고 농도 확인.' },
      { fmt: 'order', title: '공격성 대응 단계', sub: 'De-escalation ladder', ctx: '초조·공격성이 고조되는 환자에게 개입합니다. 낮은 강도부터 순서대로 배열하세요.', steps: [['Verbal de-escalation', '언어적 진정', true], ['Offer PRN medication', '필요시 약물 제안', true], ['Show of team presence', '팀이 함께 있음을 보임', false], ['Restraint as last resort', '최후수단으로 억제', false]] },
    ]},
    ONCO: { zone: 'ONCO', topLabel: '종양·BMT 병동', quizzes: [
      { fmt: 'match', title: '항암 부작용 용어', sub: 'Chemo side-effects', ctx: '용어와 뜻을 짝지으세요.', prog: '2/4', pairs: [
        { en: 'Neutropenia', sub: '/ˌnuːtroʊˈpiːniə/', ko: '호중구감소증', e: '🛡', state: 'correct', to: 0, rstate: 'correct' },
        { en: 'Mucositis', sub: '/ˌmjuːkəˈsaɪtɪs/', ko: '점막염', e: '👄', state: 'correct', to: 0, rstate: 'correct' },
        { en: 'Alopecia', sub: '/ˌæləˈpiːʃə/', ko: '혈관외 유출', e: '💉', state: 'wrong', to: 1 },
        { en: 'Extravasation', sub: '/ɪkˌstrævəˈseɪʃn/', ko: '탈모', e: '💇', picked: true }], note: '<b>Alopecia</b>는 탈모, <b>Extravasation</b>은 혈관외 유출.' },
      { fmt: 'check', title: '호중구감소 격리', sub: '중성구감소성 예방', ctx: '호중구감소증(ANC↓) 환자를 보호 격리합니다. 옳은 간호 항목을 모두 체크하세요.', items: [['Strict hand hygiene', '엄격한 손위생', true], ['No fresh flowers or plants', '생화·화분 반입 금지', true], ['Low-microbial (cooked) diet', '가열식 저균 식이', true], ['Encourage raw salads', '생채소 샐러드 권장', false]], tip: '생화·생채소는 균 노출원 — 피해야 해요.' },
      { fmt: 'mcq', title: '항암제 유출 응급', sub: 'Extravasation', top: '종양 · 주입 중', scene: '항암제 정맥주입 중 주입부위에 통증·부종·발적이 생깁니다.\n가장 먼저 할 조치를 고르세요.', opts: [['Stop infusion, leave the IV, aspirate', '주입 중단·카테터 유지·흡인', 'correct'], ['Flush rapidly with saline', '생리식염수로 빠르게 플러시', 'wrong'], ['Increase the infusion rate', '주입 속도 증가', 'idle'], ['Apply firm massage', '강하게 마사지', 'idle']], note: '유출 의심 시 즉시 중단, 카테터는 남겨 잔여 약물을 흡인.' },
      { fmt: 'check', title: '종양 응급 인지', sub: 'Oncologic emergencies', top: '종양 · 응급 선별', ctx: '즉시 보고·대응이 필요한 종양 응급을 모두 체크하세요.', items: [['Fever in neutropenia', '호중구감소성 발열', true], ['Tumor lysis (↑K⁺, ↑PO₄)', '종양용해증후군', true], ['SVC syndrome (facial swelling)', '상대정맥증후군', true], ['Mild fatigue after chemo', '항암 후 경미한 피로', false]], tip: '호중구감소성 발열은 38℃만 넘어도 응급.' },
      { fmt: 'monitor', title: 'BMT 이식 후 사정', sub: 'GVHD 3대 표적', device: 'POST-BMT · GVHD PANEL', ctx: '동종 조혈모세포이식 후 환자입니다. 각 소견이 어떤 GVHD 표적 장기인지 라벨을 붙이세요.', readings: [
        { num: 'rash', unit: '피부 발진 60%', color: '#F87171', label: 'Skin', state: 'correct' },
        { num: '2.1 L', unit: '설사/일', color: '#FACC15', label: '?', state: 'hover' },
        { num: 'Bili↑', unit: '빌리루빈 상승', color: '#FB923C', label: '?', state: null },
        { num: 'ANC', unit: '생착 지표', color: '#34D399', label: 'Engraftment', state: 'correct' }],
        bank: [['Gut / GI', '장관', 'focus'], ['Liver', '간'], ['Skin', '', 'used'], ['Engraftment', '', 'used']], tip: 'GVHD 3대 표적: 피부·장관·간.' },
      { fmt: 'calc', title: '항구토제 용량 계산', sub: 'Antiemetic dose', ctx: '💉 항암 전 항구토제(ondansetron)를 체중 기반으로 계산하세요.', given: [['Patient weight', '60 kg'], ['Ordered dose', '0.15 mg / kg'], ['Max single', '16 mg']], eq: '0.15 × 60', answer: '9', unit: 'mg IV', tip: '계산값이 최대 단일용량(16 mg)을 넘지 않는지 확인.' },
    ]},
    DIAL: { zone: 'DIAL', topLabel: '인공신장실', quizzes: [
      { fmt: 'mcq', title: 'AV 문합 사정', sub: 'Fistula patency', top: '인공신장실 · 투석 전', scene: '동정맥루(AV fistula)로 혈액투석을 시작하기 전입니다.\n개통성 확인 방법으로 옳은 것을 고르세요.', opts: [['Palpate a thrill, auscultate a bruit', '진동 촉지 + 잡음 청진', 'correct'], ['Take blood pressure on that arm', '문합 팔에서 혈압 측정', 'wrong'], ['Start an IV line in the fistula', '문합에 수액 주입', 'idle'], ['Wrap it with a tight bandage', '압박 붕대로 감기', 'idle']], note: '문합 팔은 혈압·채혈·수액 금지. Thrill·bruit로 개통 확인.' },
      { fmt: 'monitor', title: '투석 중 활력 감시', sub: '이상치 판독', device: 'DIALYSIS CONSOLE', ctx: '투석 중 콘솔 화면입니다. 각 수치의 의미·이상 여부 라벨을 붙이세요.', readings: [
        { num: '88/52', unit: 'BP mmHg', color: '#EF4444', label: '?', state: 'hover' },
        { num: '−1.2 L', unit: 'UF removed', color: '#22D3EE', label: 'Ultrafiltration', state: 'correct' },
        { num: '6.8', unit: 'K⁺ mmol/L', color: '#FB923C', label: '?', state: null },
        { num: '320', unit: 'BFR mL/min', color: '#34D399', label: 'Blood flow', state: 'correct' }],
        bank: [['Hypotension', '저혈압↓', 'focus'], ['Hyperkalemia', '고칼륨'], ['Ultrafiltration', '', 'used'], ['Blood flow', '', 'used']], tip: 'BP 88/52는 투석 중 저혈압 — UF 속도를 낮춰야.' },
      { fmt: 'match', title: '신장 용어', sub: 'Renal terms', ctx: '용어와 뜻을 짝지으세요.', prog: '2/4', pairs: [
        { en: 'Anuria', sub: '/əˈnjʊəriə/', ko: '무뇨', e: '🚫', state: 'correct', to: 0, rstate: 'correct' },
        { en: 'Uremia', sub: '/juˈriːmiə/', ko: '요독증', e: '☠', state: 'correct', to: 0, rstate: 'correct' },
        { en: 'Dry weight', sub: 'target', ko: '한외여과', e: '💧', state: 'wrong', to: 1 },
        { en: 'Ultrafiltration', sub: '/ˌʌltrəfɪlˈtreɪʃn/', ko: '건체중', e: '⚖', picked: true }], note: '<b>Dry weight</b>는 건체중, <b>Ultrafiltration</b>은 한외여과.' },
      { fmt: 'mcq', title: '고칼륨혈증 대응', sub: 'Hyperkalemia', top: '인공신장실 · 투석 전', scene: '투석 전 혈액검사에서 K⁺ 6.8, 심전도에 뾰족한 T파가 보입니다.\n우선 대응을 고르세요.', opts: [['Notify MD, prepare for urgent dialysis', '의사 보고 + 응급투석 준비', 'correct'], ['Give the patient a banana', '바나나 섭취 권장', 'wrong'], ['Encourage orange juice', '오렌지주스 권장', 'idle'], ['Delay dialysis to tomorrow', '투석을 내일로 연기', 'idle']], note: '뾰족한 T파는 고칼륨 심장 독성 — 즉시 보고·투석.' },
      { fmt: 'check', title: '투석 식이 교육', sub: '제한 항목 고르기', ctx: '혈액투석 환자에게 식이를 교육합니다. "제한"해야 할 항목을 모두 체크하세요.', items: [['High-potassium foods (banana)', '고칼륨 식품', true], ['Phosphorus (dairy, nuts)', '인 (유제품·견과)', true], ['Excess fluid intake', '과도한 수분', true], ['Adequate high-quality protein', '양질 단백질 적정 섭취', false]], tip: '칼륨·인·수분은 제한, 단백질은 적정 섭취 필요.' },
      { fmt: 'calc', title: '한외여과량(UF) 계산', sub: 'Fluid removal goal', ctx: '⚖ 투석 UF 목표량을 계산합니다. 제거할 수분량을 구하세요.', given: [['Pre-dialysis weight', '72.5 kg'], ['Dry weight', '70.0 kg'], ['Rinse-back', '+0.3 L']], eq: '72.5 − 70.0', answer: '2.5', unit: 'L (UF goal)', tip: '현재 체중 − 건체중 = 제거할 수분량. 린스백은 별도 고려.' },
    ]},
    REHAB: { zone: 'REHAB', topLabel: '재활치료실', quizzes: [
      { fmt: 'fill', title: '이동 지시 문장', sub: 'Transfer 안내', ctx: '🦽 물리치료사의 이동 지시를 완성하세요.', sentence: ['"Apply the gait belt before you help him ', { a: true }, ' from the bed to the ', { f: 'wheelchair' }, '."'], bank: [['transfer', 'focus'], ['fall'], ['sleep'], ['wheelchair', 'used'], ['walk'], ['lift']], tip: '침대↔의자 옮기기는 transfer. 안전벨트는 gait belt.' },
      { fmt: 'match', title: '재활 용어', sub: 'Rehab terms', ctx: '용어와 뜻을 짝지으세요.', prog: '2/4', pairs: [
        { en: 'ROM', sub: 'range of motion', ko: '관절가동범위', e: '🔄', state: 'correct', to: 0, rstate: 'correct' },
        { en: 'Gait', sub: '/ɡeɪt/', ko: '보행', e: '🚶', state: 'correct', to: 0, rstate: 'correct' },
        { en: 'Contracture', sub: '/kənˈtræktʃər/', ko: '일상생활활동', e: '🪥', state: 'wrong', to: 1 },
        { en: 'ADL', sub: 'daily living', ko: '구축(관절 굳음)', e: '🔒', picked: true }], note: '<b>Contracture</b>는 구축, <b>ADL</b>은 일상생활활동.' },
      { fmt: 'mcq', title: '낙상 예방', sub: 'Fall prevention', top: '재활 · 뇌졸중 환자', scene: '좌측 편마비 뇌졸중 재활 환자를 봅니다.\n낙상 예방으로 옳은 것을 고르세요.', opts: [['Lock brakes, non-slip shoes, call bell in reach', '브레이크 잠금·미끄럼방지·콜벨', 'correct'], ['Leave the floor slightly wet', '바닥을 젖은 채로', 'wrong'], ['Remove the gait belt to move faster', '보행벨트 제거', 'idle'], ['Rush the transfer', '이동을 서두르기', 'idle']], note: '브레이크·미끄럼방지 신발·콜벨은 낙상 예방의 기본.' },
      { fmt: 'order', title: '목발 계단 오르기', sub: 'Crutch — up stairs', ctx: '부분 체중부하 환자의 목발 계단 오르기입니다. 순서대로 배열하세요.', steps: [['"Up with the good"', '건측 다리 먼저', true], ['Good (strong) leg steps up', '건측이 위 계단으로', true], ['Bring up crutches', '목발을 올림', false], ['Then the affected leg', '환측 다리를 올림', false]] },
      { fmt: 'sort', title: '체중부하 상태 분류', sub: 'Weight-bearing sort', ctx: '🦵 환자별 체중부하(weight-bearing) 지시를 분류하세요. 카드를 알맞은 칸으로.', pool: ['WBAT'], buckets: [
        { name: 'Full (FWB)', color: '#A7F3D0', chips: [['체중 100% 허용', true], ['정상 보행', true]] },
        { name: 'Partial (PWB)', color: '#FDE68A', chips: [['체중 50% 제한', true]] },
        { name: 'Non (NWB)', color: '#FCA5A5', chips: [['환측 딛기 금지', true], ['목발/워커 필수', true]] } ], tip: 'WBAT = weight-bearing as tolerated(견딜 수 있는 만큼) — Full 쪽!' },
      { fmt: 'mcq', title: '편마비 옷 입히기', sub: 'Hemiplegia dressing', top: '재활 · ADL 훈련', scene: '좌측 편마비 환자의 옷 입히기를 돕습니다.\n올바른 순서를 고르세요.', opts: [['Dress the weak (left) arm first', '약한 쪽(좌측)부터 입힌다', 'correct'], ['Dress the strong arm first', '강한 쪽부터 입힌다', 'wrong'], ['Order does not matter', '순서는 상관없다', 'idle'], ['Avoid dressing to prevent pain', '통증 우려로 옷 안 입힘', 'idle']], note: '옷 입힐 땐 약한 쪽 먼저, 벗을 땐 강한 쪽 먼저.' },
    ]},
    RAD: { zone: 'RAD', topLabel: '영상의학과', quizzes: [
      { fmt: 'check', title: '조영제 위험 선별', sub: 'CT contrast screen', ctx: '📋 CT 조영 전 문진입니다. 주의(위험)가 필요한 항목을 모두 체크하세요.', items: [['Prior contrast reaction', '조영제 부작용 병력', true], ['eGFR 22 (renal impairment)', '신기능 저하', true], ['Metformin use', '메트포르민 복용', true], ['Took a daily multivitamin', '종합비타민 복용', false]], tip: '신기능 저하·메트포르민·과거 반응은 조영제 위험 요인.' },
      { fmt: 'check', title: 'MRI 반입 금지', sub: 'MRI safety zone', top: '영상 · MRI 실', ctx: '🧲 MRI 검사실 반입이 "금지"되는 항목을 모두 체크하세요.', items: [['Pacemaker', '심박동기', true], ['Ferromagnetic O₂ tank', '철제 산소통', true], ['Unknown metal implant', '미확인 금속 임플란트', true], ['Cotton hospital gown', '면 병원 가운', false]], tip: '강자성 금속은 MRI 자기장에서 치명적 — 면 소재만 허용.' },
      { fmt: 'mcq', title: '조영제 아나필락시스', sub: 'Contrast reaction', top: '영상 · 조영 직후', scene: '조영제 주입 직후 환자가 두드러기·천명·저혈압을 보입니다.\n우선 조치를 고르세요.', opts: [['Stop contrast, call for help, prepare epinephrine', '조영 중단·도움요청·에피네프린 준비', 'correct'], ['Continue and finish the scan', '스캔을 마저 진행', 'wrong'], ['Give more contrast', '조영제 추가 주입', 'idle'], ['Just document it', '기록만 하고 관찰', 'idle']], note: '아나필락시스 의심 시 즉시 중단·응급 호출·에피네프린.' },
      { fmt: 'match', title: '영상 용어', sub: 'Imaging terms', ctx: '용어와 뜻을 짝지으세요.', prog: '2/4', pairs: [
        { en: 'Radiopaque', sub: '/ˌreɪdioʊˈpeɪk/', ko: '불투과(흰색)', e: '⬜', state: 'correct', to: 0, rstate: 'correct' },
        { en: 'Contrast', sub: '/ˈkɒntrɑːst/', ko: '조영제', e: '💉', state: 'correct', to: 0, rstate: 'correct' },
        { en: 'Supine', sub: '/ˈsuːpaɪn/', ko: '복와위(엎드림)', e: '🛏', state: 'wrong', to: 1 },
        { en: 'Prone', sub: '/proʊn/', ko: '앙와위(바로 누움)', e: '⬆', picked: true }], note: '<b>Supine</b>은 앙와위(바로 누움), <b>Prone</b>은 복와위(엎드림).' },
      { fmt: 'mcq', title: '방사선 방어 ALARA', sub: 'Radiation safety', top: '영상 · 촬영실', scene: '이동식 X-ray 촬영을 보조합니다.\n방사선 방어 원칙(ALARA)에 맞는 것을 고르세요.', opts: [['Time, distance, shielding', '시간↓·거리↑·차폐', 'correct'], ['Stand close to finish faster', '가까이 서서 빨리 끝내기', 'wrong'], ['Skip the lead apron once', '이번만 납 가운 생략', 'idle'], ['Longer exposure is fine', '노출 시간은 무관', 'idle']], note: '방사선은 시간을 줄이고, 거리를 늘리고, 차폐하는 것이 원칙.' },
      { fmt: 'sort', title: '검사 우선순위 분류', sub: 'STAT vs Routine', ctx: '📩 접수된 영상 오더를 우선순위로 분류하세요. 카드를 알맞은 칸으로.', pool: ['Follow-up CXR'], buckets: [
        { name: 'STAT 즉시', color: '#FCA5A5', chips: [['Trauma pan-CT', true], ['Suspected stroke MRI', true]] },
        { name: 'Urgent', color: '#FDE68A', chips: [['Post-op check', true]] },
        { name: 'Routine', color: '#A7F3D0', chips: [['Annual screening', true], ['Chronic follow-up', true]] } ], tip: '외상·뇌졸중 의심은 STAT, 정기 추적은 Routine.' },
    ]},
    ENDO: { zone: 'ENDO', topLabel: '내시경실', quizzes: [
      { fmt: 'fill', title: '금식(NPO) 안내', sub: '위내시경 준비 문장', ctx: '🔎 위내시경 전 환자에게 준비를 안내합니다. 문장을 완성하세요.', sentence: ['"Please do not eat or drink ', { a: true }, ' before the gastroscopy; heart meds with a ', { f: 'small sip' }, ' of water are okay."'], bank: [['for 8 hours', 'focus'], ['for 2 minutes'], ['as you like'], ['small sip', 'used'], ['large glass'], ['no water']], tip: '상부 내시경은 보통 6–8시간 금식.' },
      { fmt: 'mcq', title: '진정 후 회복 사정', sub: 'Post-sedation', top: '내시경 · 회복실', scene: '진정 내시경(sedation)을 마친 환자를 회복실에서 봅니다.\n옳은 사정·간호를 고르세요.', opts: [['Monitor airway/LOC/vitals; NPO until gag returns', '기도·의식·활력 감시, 구역반사 회복까지 금식', 'correct'], ['Discharge alone immediately', '즉시 혼자 귀가', 'wrong'], ['Give a full meal right away', '즉시 정상 식사', 'idle'], ['Let the patient drive home', '직접 운전 귀가 허용', 'idle']], note: '진정 후 기도·의식 감시 필수, 구역반사 회복 전 금식.' },
      { fmt: 'check', title: '천공 경고징후', sub: 'Perforation signs', ctx: '내시경 후 환자를 관찰합니다. 천공(perforation)을 시사하는 징후를 모두 체크하세요.', items: [['Severe, worsening abdominal pain', '악화되는 심한 복통', true], ['Fever & tachycardia', '발열·빈맥', true], ['Subcutaneous emphysema', '피하기종(목 부음·염발음)', true], ['Mild sore throat', '경미한 인후통', false]], tip: '심한 복통·발열·피하기종은 천공 응급. 인후통은 흔한 정상.' },
      { fmt: 'match', title: '내시경 용어', sub: 'Endoscopy terms', ctx: '용어와 뜻을 짝지으세요.', prog: '2/4', pairs: [
        { en: 'Gastroscopy', sub: '/ɡæˈstrɒskəpi/', ko: '위내시경', e: '🔎', state: 'correct', to: 0, rstate: 'correct' },
        { en: 'Colonoscopy', sub: '/ˌkoʊləˈnɒskəpi/', ko: '대장내시경', e: '🔬', state: 'correct', to: 0, rstate: 'correct' },
        { en: 'Polypectomy', sub: '/ˌpɒlɪˈpektəmi/', ko: '조직검사', e: '🧪', state: 'wrong', to: 1 },
        { en: 'Biopsy', sub: '/ˈbaɪɒpsi/', ko: '용종 절제', e: '✂', picked: true }], note: '<b>Polypectomy</b>는 용종 절제, <b>Biopsy</b>는 조직검사.' },
      { fmt: 'mcq', title: '대장내시경 장정결', sub: 'Bowel prep', top: '내시경 · 검사 전날', scene: '대장내시경을 앞둔 환자에게 장정결(bowel prep)을 교육합니다.\n옳은 안내를 고르세요.', opts: [['Clear liquids & finish the whole prep solution', '맑은 유동식 + 장정결제 완복', 'correct'], ['Eat red jelly and juice', '빨간 젤리·주스 섭취', 'wrong'], ['Have a high-fiber meal', '고섬유식 섭취', 'idle'], ['Skip the prep if busy', '바쁘면 장정결 생략', 'idle']], note: '맑은 유동식 + 장정결제 완복이 필수. 붉은색·섬유질은 금지.' },
      { fmt: 'order', title: '내시경 준비 순서', sub: 'Pre-procedure', ctx: '상부 내시경 직전 준비 단계입니다. 순서대로 배열하세요.', steps: [['Verify consent & NPO status', '동의서·금식 확인', true], ['Confirm patient & site (time-out)', '환자·부위 확인(타임아웃)', true], ['Position left lateral decubitus', '좌측위로 체위', false], ['Attach monitors & bite block', '모니터·바이트블록 장착', false]] },
    ]},
    ER: { zone: 'ER', topLabel: '응급실 · ER', quizzes: [
      { fmt: 'fill', title: '트리아지 문장', sub: '주호소 질문 완성', ctx: '🚑 도보 내원 환자의 주호소를 묻습니다. 문장을 완성하세요.', sentence: ['"What ', { a: true }, ' you here today, and when did it ', { f: 'start' }, '?"'], bank: [['brings', 'focus'], ['takes'], ['leaves'], ['start', 'used'], ['stop'], ['hurt']], tip: '"어디가 불편해서 오셨어요?"는 What brings you here?' },
      { fmt: 'match', title: '증상 어휘 매칭', sub: 'ER 주호소 표현', ctx: '주호소 영어와 뜻을 짝지으세요.', prog: '2/4', pairs: [
        { en: 'Shortness of breath', sub: 'SOB', ko: '호흡곤란', e: '🫁', state: 'correct', to: 0, rstate: 'correct' },
        { en: 'Palpitations', sub: '/ˌpælpɪˈteɪʃnz/', ko: '두근거림', e: '💓', state: 'correct', to: 0, rstate: 'correct' },
        { en: 'Dizziness', sub: '/ˈdɪzinəs/', ko: '실신', e: '😵', state: 'wrong', to: 1 },
        { en: 'Syncope', sub: '/ˈsɪŋkəpi/', ko: '어지럼', e: '🌀', picked: true }], note: '<b>Syncope</b>는 실신, <b>Dizziness</b>는 어지럼.' },
      { fmt: 'monitor', title: '쇼크 지표 판독', sub: '활력징후 해석', device: 'ER MONITOR · SHOCK', ctx: '내원 환자의 모니터입니다. 각 수치의 의미·이상 여부 라벨을 붙이세요.', readings: [
        { num: '88/54', unit: 'BP mmHg', color: '#EF4444', label: '?', state: 'hover' },
        { num: '124', unit: 'HR bpm', color: '#F87171', label: 'Tachycardia', state: 'correct' },
        { num: '1.4', unit: 'shock index', color: '#FB923C', label: '?', state: null },
        { num: '93%', unit: 'SpO₂', color: '#FACC15', label: 'Sat', state: 'correct' }],
        bank: [['Hypotension', '저혈압↓', 'focus'], ['Shock index↑', 'HR/SBP'], ['Tachycardia', '', 'used'], ['Sat', '', 'used']], tip: '쇼크지수(HR/SBP) > 0.9면 순환 부전 의심.' },
      { fmt: 'order', title: '성인 BLS 순서', sub: 'C-A-B', ctx: '무반응·무호흡 성인을 발견했습니다. 기본소생술 순서로 배열하세요.', steps: [['Check response & call for help', '반응 확인·도움요청', true], ['Start chest compressions', '가슴압박 시작', true], ['Open airway', '기도 개방', false], ['Give rescue breaths', '인공호흡', false]] },
      { fmt: 'check', title: '패혈증 경고징후', sub: 'Sepsis red flags', ctx: '내원 환자에서 패혈증(sepsis)을 시사하는 위험 징후를 모두 체크하세요.', items: [['Temp 39.2℃ or < 36℃', '발열/저체온', true], ['HR > 90, RR > 20', '빈맥·빈호흡', true], ['Altered mental status', '의식 변화', true], ['Isolated mild headache', '단독 경미한 두통', false]], tip: '발열·빈맥·빈호흡·의식변화 = qSOFA/SIRS 경고.' },
      { fmt: 'mcq', title: '흉통 트리아지', sub: 'Chest pain triage', top: '응급실 · 접수 창구', scene: '52세 남성이 30분간 지속되는 압박성 흉통·식은땀·좌완 방사통을 호소합니다.\n가장 먼저 할 조치를 고르세요.', opts: [['Immediate ECG within 10 min & notify MD', '10분 내 심전도 + 의사 보고', 'correct'], ['Send to the waiting room', '대기실에서 순서 대기', 'wrong'], ['Give oral antacid and observe', '제산제 주고 관찰', 'idle'], ['Schedule an outpatient visit', '외래 예약 안내', 'idle']], note: '허혈성 흉통 의심은 10분 내 심전도가 표준.' },
      { fmt: 'gauge', title: '산소 유량 설정', sub: 'O₂ flow to target', ctx: '🫁 SpO₂ 88%인 저산소 환자입니다. 안면마스크 산소를 목표까지 올리세요.', device: 'O₂ FLOWMETER', current: '2', unit: 'L/min · 현재', target: '6 L/min', pct: 20, targetPct: 60, correct: false, tip: '안면마스크는 보통 6–10 L/min, 코캐늄라는 최대 6 L/min.' },
    ]},
    WARD: { zone: '병동', topLabel: '일반 병동 · Mr. Kim', quizzes: [
      { fmt: 'fill', title: '투약 시각 문장', sub: '복약 안내 완성', ctx: '💊 아침 투약을 안내합니다. 문장을 완성하세요.', sentence: ['"Take this tablet ', { a: true }, ' a day, ', { f: 'with food' }, ' to protect your stomach."'], bank: [['twice', 'focus'], ['never'], ['once only'], ['with food', 'used'], ['on empty'], ['at night']], tip: '"하루 두 번"은 twice a day (BID).' },
      { fmt: 'match', title: '신체 부위 어휘', sub: 'Anatomy terms', ctx: '"여기가 아파요." 부위 영어와 뜻을 짝지으세요.', prog: '2/4', pairs: [
        { en: 'Abdomen', sub: '/ˈæbdəmən/', ko: '복부', e: '🫃', state: 'correct', to: 0, rstate: 'correct' },
        { en: 'Lower back', sub: 'lumbar', ko: '허리', e: '🔙', state: 'correct', to: 0, rstate: 'correct' },
        { en: 'Calf', sub: '/kɑːf/', ko: '허벅지', e: '🦵', state: 'wrong', to: 1 },
        { en: 'Thigh', sub: '/θaɪ/', ko: '종아리', e: '🦿', picked: true }], note: '<b>Calf</b>는 종아리, <b>Thigh</b>는 허벅지.' },
      { fmt: 'monitor', title: 'I/O 균형 판독', sub: '섭취·배설 해석', device: 'WARD · INTAKE/OUTPUT', ctx: '8시간 섭취/배설 기록입니다. 각 수치의 의미 라벨을 붙이세요.', readings: [
        { num: '1200', unit: 'intake mL', color: '#22D3EE', label: 'Intake', state: 'correct' },
        { num: '250', unit: 'urine mL/8h', color: '#FB923C', label: '?', state: 'hover' },
        { num: '−600', unit: 'balance mL', color: '#FACC15', label: '?', state: null },
        { num: '0.4', unit: 'mL/kg/h', color: '#EF4444', label: 'Low UO', state: 'correct' }],
        bank: [['Oliguria', '소변감소', 'focus'], ['Net balance', '수분 균형'], ['Intake', '', 'used'], ['Low UO', '', 'used']], tip: '소변량 < 0.5 mL/kg/h는 핍뇨(oliguria).' },
      { fmt: 'order', title: 'SBAR 인계 순서', sub: 'Hand-off', ctx: '당직 간호사에게 SBAR로 인계합니다. 순서대로 배열하세요.', steps: [['Situation — 지금 무슨 일', '상황', true], ['Background — 배경·병력', '배경', true], ['Assessment — 내 사정·판단', '평가', false], ['Recommendation — 요청·제안', '권고', false]] },
      { fmt: 'check', title: '낙상 고위험 선별', sub: 'Fall risk', ctx: '입원 환자의 낙상 위험을 사정합니다. 위험 요인을 모두 체크하세요.', items: [['History of a recent fall', '최근 낙상 이력', true], ['On sedatives / diuretics', '진정제·이뇨제 복용', true], ['Unsteady gait, needs assist', '불안정 보행', true], ['Independent, steady gait', '독립적·안정 보행', false]], tip: '낙상 이력·약물·보행 불안정이 핵심 위험 요인.' },
      { fmt: 'mcq', title: '욕창 예방', sub: 'Pressure injury', top: '병동 · 체위변경', scene: '거동이 어려운 와상 환자의 욕창을 예방하려 합니다.\n가장 적절한 중재를 고르세요.', opts: [['Reposition at least every 2 hours', '최소 2시간마다 체위변경', 'correct'], ['Massage reddened bony areas', '발적 부위를 마사지', 'wrong'], ['Keep the head of bed at 90°', '침상 머리 90° 유지', 'idle'], ['Use a doughnut cushion', '도넛 방석 사용', 'idle']], note: '2시간 간격 체위변경이 표준. 발적 마사지·도넛 방석은 금기.' },
      { fmt: 'spoterror', title: '수액 펌프 세팅 점검', sub: 'Spot the error', ctx: '💧 다음 IV 펌프 세팅을 검수합니다. 잘못된 항목 하나를 찾으세요.', rows: [['Fluid', '0.9% NaCl 1 L', false], ['Rate', '1000 mL / hr', true], ['Route', 'Peripheral IV', false], ['Check', '환자 2개 지표 확인', false]], note: '유지 수액 1000 mL/hr는 위험한 과속 — 보통 80–125 mL/hr.' },
    ]},
    PHARMA: { zone: '약국', topLabel: '중앙 약국', quizzes: [
      { fmt: 'fill', title: '복약지도 문장', sub: '항생제 안내 완성', ctx: '💊 항생제를 조제하며 복약지도를 합니다. 문장을 완성하세요.', sentence: ['"Finish the ', { a: true }, ' course even if you feel better, and take it ', { f: 'every 8 hours' }, '."'], bank: [['entire', 'focus'], ['half'], ['first dose'], ['every 8 hours', 'used'], ['once'], ['as needed']], tip: '항생제는 증상이 나아도 전체 과정(entire course)을 완료.' },
      { fmt: 'match', title: '약효군 용어', sub: 'Drug classes', ctx: '약효군 영어와 뜻을 짝지으세요.', prog: '2/4', pairs: [
        { en: 'Anticoagulant', sub: '/ˌæntikoʊˈæɡjələnt/', ko: '항응고제', e: '🩸', state: 'correct', to: 0, rstate: 'correct' },
        { en: 'Antiemetic', sub: '/ˌæntiɪˈmetɪk/', ko: '진토제', e: '🤢', state: 'correct', to: 0, rstate: 'correct' },
        { en: 'Diuretic', sub: '/ˌdaɪəˈretɪk/', ko: '진통제', e: '💊', state: 'wrong', to: 1 },
        { en: 'Analgesic', sub: '/ˌænəlˈdʒiːzɪk/', ko: '이뇨제', e: '💧', picked: true }], note: '<b>Diuretic</b>은 이뇨제, <b>Analgesic</b>은 진통제.' },
      { fmt: 'monitor', title: '고위험 약품 라벨', sub: '라벨 판독', device: 'RX LABEL · HIGH-ALERT', ctx: '조제 라벨을 최종 검수합니다. 각 항목의 의미 라벨을 붙이세요.', readings: [
        { num: '10x', unit: 'insulin units', color: '#EF4444', label: '?', state: 'hover' },
        { num: 'LASA', unit: 'look-alike', color: '#FB923C', label: 'Tall-man', state: 'correct' },
        { num: 'KCl', unit: 'IV potassium', color: '#F87171', label: '?', state: null },
        { num: '2 RN', unit: 'double-check', color: '#34D399', label: 'Verify', state: 'correct' }],
        bank: [['Dose error↑', '용량 오류', 'focus'], ['High-alert', '고위험'], ['Tall-man', '', 'used'], ['Verify', '', 'used']], tip: '인슐린·헤파린·KCl은 고위험 약품 — 2인 확인.' },
      { fmt: 'order', title: '불출 검수 순서', sub: 'Dispensing check', ctx: '처방을 조제·불출합니다. 안전 검수 순서로 배열하세요.', steps: [['Verify prescription & patient', '처방·환자 확인', true], ['Check drug, dose, route', '약품·용량·경로 대조', true], ['Scan barcode (final check)', '바코드 최종 스캔', false], ['Counsel & dispense', '복약지도 후 불출', false]] },
      { fmt: 'check', title: '고위험 이중확인', sub: 'Double-check', ctx: '고위험 약품 불출 전 2인 이중확인 항목입니다. 반드시 확인할 것을 모두 체크하세요.', items: [['Right drug & concentration', '약품·농도', true], ['Right dose & pump rate', '용량·주입속도', true], ['Right patient (2 identifiers)', '환자 2개 지표', true], ['Matching label color only', '라벨 색만 일치', false]], tip: '라벨 색이 아니라 약품·용량·환자를 실제로 대조.' },
      { fmt: 'mcq', title: '약물 상호작용', sub: 'Interaction', top: '약국 · 처방 검토', scene: '와파린(warfarin) 복용 환자에게 새 처방으로 NSAID가 추가되었습니다.\n약사의 가장 적절한 조치를 고르세요.', opts: [['Contact the prescriber — bleeding risk', '처방의에게 연락 (출혈 위험)', 'correct'], ['Dispense both without comment', '그대로 함께 불출', 'wrong'], ['Double the warfarin dose', '와파린 용량 2배', 'idle'], ['Tell patient to skip warfarin', '와파린 임의 중단 안내', 'idle']], note: 'NSAID+와파린은 출혈 위험↑ — 처방의 확인이 필요.' },
      { fmt: 'spoterror', title: '조제 라벨 검수', sub: 'Spot the error', ctx: '💊 불출 전 조제 라벨을 최종 검수합니다. 잘못된 항목 하나를 찾으세요.', rows: [['Drug', 'Metformin 500 mg', false], ['Dose', 'Take 5 tablets BID', true], ['Route', 'PO (경구)', false], ['Patient', 'Kim · 2 identifiers', false]], note: '1회 5정은 과용량 — 보통 1정. 용량 오류를 잡아야 해요.' },
    ]},
  };

  Object.keys(BANK).forEach(dep => {
    const d = BANK[dep];
    d.quizzes.forEach((q, i) => { window['ScreenQuiz' + dep + (i + 1)] = () => renderQuiz(dep, d, q, i); });
  });
})();
