// forin-notebook-lesson-sent-live.jsx — STEP 2 문장 학습 인터랙티브 (단어장과 같은 낱장 플래시카드)
// 단어장 패턴 재사용: 상단 진행 바 + n/N · 프롬프트에 바로 답 → 같은 장 아래 해설 → 헷갈려요/알겠어요로 뜯어냄.
// 문장 프롬프트 4유형 교대: listen(듣고 뜻) · build(청크 조립) · blank(빈칸) · order(대화 순서).
(function () {
  const { NbPaper, NbButton, NbTag, NbMark, NbMemo } = window.NbUI;
  const NbIcon = window.NbIcon;
  const HW = '"Gaegu","Nanum Pen Script",cursive';
  const F = '"Pretendard",sans-serif';
  const MONO = '"IBM Plex Mono",monospace';
  const c = { bg: '#F1EBDD', paper: '#FFFdf4', ink: '#3E362B', soft: '#9A8F7C', red: '#C75146', blue: '#4A6FA5', green: '#5F8D5A', amber: '#C77E2E' };

  const SENTS = [
    { type: 'listen', tag: '환자 안심', icon: 'bandage', en: 'I need to check your wristband every time.', ko: '매번 손목 밴드를 확인해야 해요', why: 'every time을 문장 끝에 — "매번"을 강조해 반복 확인의 이유가 자연스럽게 전달돼요.', opts: [['bandage', '매번 손목 밴드를 확인해야 해요'], ['pill', '지금 약을 드릴게요'], ['board', '차트에 기록했어요']] },
    { type: 'build', tag: '이유 설명', icon: 'shield', en: "It's for your safety, not because I forgot.", ko: '당신의 안전을 위한 거예요, 잊어서가 아니라', why: '"not because I forgot"을 덧붙이면 환자의 오해(간호사가 깜빡했나?)를 먼저 지워줘요.', chunks: ["It's", 'for your safety,', 'not because', 'I forgot.'], pool: ['not because', 'for your safety,', 'I forgot.', "It's", 'for the doctor'] },
    { type: 'blank', tag: '공감', icon: 'faceWorried', en: 'I know it feels repetitive.', ko: '반복처럼 느껴지시는 거 알아요', why: '"I know…"로 시작하면 지시가 아니라 공감으로 들려요. 환자 불만 응대의 첫 문장.', before: 'I know it feels ', after: '.', answer: 'repetitive', opts: [['repetitive', 'compass'], ['important', 'star'], ['annoying', 'faceAngry'], ['quick', 'chartup']] },
    { type: 'listen', tag: '신원 확인', icon: 'board', en: 'Can you tell me your name and date of birth?', ko: '성함과 생년월일을 말씀해 주시겠어요?', why: 'Can you tell me…? 가 What is your name? 보다 부드러워요. 병원 표준 두 가지 식별자 확인 문장.', opts: [['board', '성함과 생년월일을 말씀해 주시겠어요?'], ['monitor', '혈압을 재겠습니다'], ['pill', '알레르기가 있으신가요?']] },
    { type: 'order', tag: '대화 흐름', icon: 'compass', en: '공감 → 이유 → 확인 → 감사', ko: '불만 환자 응대 4문장 순서', why: '공감이 먼저. 이유를 설명한 뒤 확인을 요청하고, 마지막에 이름을 불러 감사하면 관계가 닫혀요.', lines: [['I know it feels repetitive.', 'faceWorried'], ["It's for your safety.", 'shield'], ['Can you tell me your name and date of birth?', 'board'], ['Thank you, Mr. Alvarez.', 'star']], shuffled: [1, 3, 0, 2] },
    { type: 'build', tag: '감사', icon: 'star', en: 'Thank you for bearing with me, Mr. Alvarez.', ko: '참아 주셔서 감사해요, 알바레즈 씨', why: 'bear with me = "조금만 참아 주세요". 이름을 붙이면 사무적이지 않고 개인적인 감사가 돼요.', chunks: ['Thank you', 'for bearing', 'with me,', 'Mr. Alvarez.'], pool: ['with me,', 'Thank you', 'Mr. Alvarez.', 'for bearing', 'for waiting'] },
  ];
  const TYPE_LABEL = { listen: '듣고 뜻 고르기', build: '청크 조립', blank: '빈칸 채우기', order: '대화 순서' };
  const total = SENTS.length;

  function Sheet({ d, idx, dim, style, className, answer, onAnswer, result }) {
    const wrong = result === 'wrong';
    const prompt = () => {
      if (d.type === 'listen') return (
        <div style={{ marginTop: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, height: 26, padding: '0 6px' }}>
            {[6,12,18,24,14,20,10,22,16,8,18,12,6,16,10,20,12,8].map((h, i) => <span key={i} style={{ width: 4, height: h, background: i < 11 ? c.blue : 'rgba(62,54,43,.2)', borderRadius: 2 }}/>)}
            <div style={{ flex: 1 }}/>
            <span style={{ fontFamily: HW, fontSize: 12, color: c.soft, whiteSpace: 'nowrap' }}>탭해서 다시 듣기 · 2회</span>
          </div>
          <div style={{ marginTop: 12 }}>
            {d.opts.map((o, i) => {
              const on = answer === o[1], ok = result && o[1] === d.ko, bad = result && on && !ok;
              return (
                <div key={i} onClick={() => !result && onAnswer(o[1])} style={{ marginTop: i ? 8 : 0, padding: '10px 12px', border: `1.6px solid ${ok ? c.green : bad ? c.red : on ? c.ink : 'rgba(62,54,43,.3)'}`, background: ok ? 'rgba(95,141,90,.12)' : bad ? 'rgba(199,81,70,.1)' : c.paper, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', transform: `rotate(${i % 2 ? .4 : -.4}deg)` }}>
                  <span style={{ width: 18, height: 18, borderRadius: '50%', border: `1.5px solid ${ok ? c.green : bad ? c.red : c.soft}`, color: ok ? c.green : bad ? c.red : c.soft, fontFamily: HW, fontSize: 12, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{ok ? '✓' : bad ? '✕' : String.fromCharCode(65 + i)}</span>
                  <span style={{ fontFamily: HW, fontSize: 15.5, color: c.ink, flex: 1, lineHeight: 1.25 }}>{o[1]}</span>
                </div>
              );
            })}
          </div>
        </div>
      );
      if (d.type === 'build') {
        const built = answer || [];
        return (
          <div style={{ marginTop: 12 }}>
            <div style={{ minHeight: 42, borderBottom: `2px solid ${result ? (wrong ? c.red : c.green) : 'rgba(62,54,43,.5)'}`, display: 'flex', alignItems: 'flex-end', gap: 4, padding: '0 2px 6px', flexWrap: 'wrap' }}>
              {built.length === 0 && <span style={{ fontFamily: HW, fontSize: 15, color: '#B4A88F' }}>{d.en.split(' ')[0]} _ _ _ _ _</span>}
              {built.map((b, i) => <span key={i} onClick={() => !result && onAnswer(built.filter((_, j) => j !== i))} style={{ fontFamily: MONO, fontSize: 15, fontWeight: 700, color: c.ink, background: 'rgba(249,227,123,.55)', padding: '1px 5px', cursor: 'pointer' }}>{b}</span>)}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 12 }}>
              {d.pool.map((ch, i) => {
                const used = built.includes(ch);
                return <span key={ch} onClick={() => !result && !used && onAnswer([...built, ch])} style={{ fontFamily: MONO, fontSize: 13.5, fontWeight: 700, color: used ? 'transparent' : c.ink, background: used ? 'repeating-linear-gradient(-45deg, rgba(62,54,43,.1) 0 3px, transparent 3px 6px)' : c.paper, border: `1.4px ${used ? 'dashed' : 'solid'} ${used ? 'rgba(62,54,43,.3)' : c.ink}`, padding: '6px 11px', cursor: used ? 'default' : 'pointer', transform: `rotate(${i % 2 ? 1 : -1}deg)`, boxShadow: used ? 'none' : '1px 2px 0 rgba(62,54,43,.2)' }}>{ch}</span>;
              })}
            </div>
            <div style={{ fontFamily: HW, fontSize: 12.5, color: c.soft, marginTop: 8 }}>조각을 눌러 순서대로 붙여요 · 다시 누르면 빼요</div>
          </div>
        );
      }
      if (d.type === 'blank') return (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: c.ink, lineHeight: 1.9 }}>
            {d.before}<span style={{ display: 'inline-block', minWidth: 110, borderBottom: `2.5px solid ${result ? (wrong ? c.red : c.green) : c.blue}`, textAlign: 'center', color: result ? (wrong ? c.red : c.green) : c.blue, fontFamily: answer ? MONO : HW, fontSize: answer ? 16 : 19, padding: '0 6px' }}>{result && wrong ? d.answer : (answer || '?')}</span>{d.after}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9, marginTop: 12 }}>
            {d.opts.map((o, i) => {
              const on = answer === o[0], ok = result && o[0] === d.answer, bad = result && on && !ok;
              return (
                <div key={o[0]} onClick={() => !result && onAnswer(o[0])} style={{ padding: '10px 8px', textAlign: 'center', border: `1.6px solid ${ok ? c.green : bad ? c.red : on ? c.ink : 'rgba(62,54,43,.3)'}`, background: ok ? 'rgba(95,141,90,.12)' : bad ? 'rgba(199,81,70,.1)' : c.paper, cursor: 'pointer', transform: `rotate(${i % 2 ? .8 : -.8}deg)` }}>
                  <NbIcon name={o[1]} size={22}/>
                  <div style={{ fontFamily: MONO, fontSize: 12.5, fontWeight: 700, color: c.ink, marginTop: 5 }}>{o[0]}</div>
                </div>
              );
            })}
          </div>
        </div>
      );
      // order — 탭 순서대로 번호 매기기
      const seq = answer || [];
      return (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontFamily: HW, fontSize: 13, color: c.soft }}>말할 순서대로 탭하세요 · 다시 누르면 취소</div>
          {d.shuffled.map((li, i) => {
            const l = d.lines[li];
            const pos = seq.indexOf(li);
            const picked = pos >= 0;
            const ok = result && picked && pos === li, bad = result && picked && pos !== li;
            return (
              <div key={li} onClick={() => { if (result) return; onAnswer(picked ? seq.filter(x => x !== li) : [...seq, li]); }} style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 8, cursor: 'pointer' }}>
                <span style={{ width: 26, height: 26, borderRadius: '50%', border: `1.8px solid ${ok ? c.green : bad ? c.red : picked ? c.ink : 'rgba(62,54,43,.35)'}`, color: ok ? c.green : bad ? c.red : picked ? c.ink : c.soft, background: picked ? (ok ? 'rgba(95,141,90,.12)' : bad ? 'rgba(199,81,70,.1)' : c.paper) : 'transparent', fontFamily: HW, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{picked ? pos + 1 : '?'}</span>
                <div style={{ flex: 1, padding: '8px 10px', border: `1.5px ${picked ? 'solid' : 'dashed'} ${ok ? c.green : bad ? c.red : picked ? c.ink : 'rgba(62,54,43,.35)'}`, background: picked ? c.paper : 'transparent', display: 'flex', alignItems: 'center', gap: 8, transform: `rotate(${i % 2 ? .4 : -.4}deg)` }}>
                  <NbIcon name={l[1]} size={17}/>
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: picked ? c.ink : c.soft, lineHeight: 1.35, flex: 1, minWidth: 0 }}>{l[0]}</span>
                </div>
              </div>
            );
          })}
        </div>
      );
    };
    return (
      <div className={className} style={{ position: 'absolute', left: 0, right: 0, top: 0, ...style }}>
        <div style={{ position: 'relative', background: c.paper, border: `1px solid #E0D6C0`, boxShadow: dim ? 'none' : '0 4px 10px rgba(62,54,43,.16)', padding: '22px 18px 16px', minHeight: 300, opacity: dim ? .85 : 1 }}>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 13, borderTop: `1.5px dashed rgba(62,54,43,.3)` }}/>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
            <NbTag color={c.blue} rot={-1}>{d.tag}</NbTag>
            <span style={{ fontFamily: HW, fontSize: 12.5, color: c.soft, whiteSpace: 'nowrap' }}>{result ? TYPE_LABEL[d.type] + ' · 해설' : TYPE_LABEL[d.type]}</span>
            <div style={{ flex: 1 }}/>
            <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 700, color: c.soft, whiteSpace: 'nowrap', flexShrink: 0 }}>{idx + 1} / {total}</span>
          </div>
          {/* 프롬프트 헤더 — 아이콘 + 한국어 뜻(listen 제외) */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 14 }}>
            <div style={{ width: 58, height: 58, borderRadius: '50%', background: d.type === 'listen' ? 'rgba(74,111,165,.1)' : `${c.amber}22`, border: `2px solid ${d.type === 'listen' ? c.blue : c.amber}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transform: 'rotate(-4deg)', cursor: d.type === 'listen' ? 'pointer' : 'default', boxShadow: d.type === 'listen' ? '0 2px 5px rgba(62,54,43,.15)' : 'none' }}><NbIcon name={d.type === 'listen' ? 'speaker' : d.icon} size={32}/></div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: HW, fontSize: d.type === 'listen' ? 21 : 18.5, color: c.ink, lineHeight: 1.25 }}><NbMark>{d.type === 'listen' ? '이 문장의 뜻은?' : d.ko}</NbMark></div>
              <div style={{ fontFamily: HW, fontSize: 13.5, color: c.soft, marginTop: 4, lineHeight: 1.35 }}>✎ {d.type === 'listen' ? '스피커를 눌러 듣고 뜻을 골라요' : '이 뜻을 영어로 만들어요'}</div>
            </div>
          </div>
          {prompt()}
          {result && (
            <div className="nb-reveal" style={{ marginTop: 14, paddingTop: 12, borderTop: `1.5px dashed rgba(62,54,43,.3)`, position: 'relative' }}>
              <div style={{ position: 'absolute', right: 0, top: 6 }} className="nb-ok">
                <div style={{ width: 56, height: 56, borderRadius: '50%', border: `3px double ${wrong ? c.red : c.green}`, color: wrong ? c.red : c.green, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-10deg)', background: c.paper }}>
                  <div style={{ fontSize: 7.5, fontWeight: 800, letterSpacing: 1 }}>{wrong ? 'RETRY' : 'GOOD'}</div>
                  <div style={{ fontFamily: HW, fontSize: 15, lineHeight: 1 }}>{wrong ? '다시' : '정답'}</div>
                </div>
              </div>
              <div style={{ paddingRight: 64 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: c.ink, lineHeight: 1.5 }}>{d.type === 'order' ? d.lines.map(l => l[0]).join(' ') : d.en} <span style={{ marginLeft: 2, verticalAlign: '-2px' }}><NbIcon name="speaker" size={15}/></span></div>
                <div style={{ fontFamily: HW, fontSize: 13.5, color: c.soft, marginTop: 3 }}>{d.ko}</div>
              </div>
              <div style={{ marginTop: 9, padding: '8px 10px', borderLeft: `2.5px solid ${c.blue}`, background: 'rgba(74,111,165,.06)' }}>
                <div style={{ fontFamily: HW, fontSize: 13.5, color: c.ink, lineHeight: 1.45 }}><b style={{ color: c.blue }}>왜?</b> {d.why}</div>
              </div>
              <div style={{ marginTop: 10, display: 'flex', justifyContent: 'center' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '7px 16px', border: `1.6px solid ${c.ink}`, borderRadius: 99, fontFamily: HW, fontSize: 14.5, color: c.ink, background: 'rgba(249,227,123,.45)' }}><NbIcon name="mic" size={17}/> 따라 말하기</div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  function SentStudyLive() {
    const [i, setI] = React.useState(0);
    const [face, setFace] = React.useState('front');
    const [answer, setAnswer] = React.useState(null);
    const [result, setResult] = React.useState(null);
    const [shake, setShake] = React.useState(false);
    const [tear, setTear] = React.useState(null);
    const [known, setKnown] = React.useState([]);
    const [fuzzy, setFuzzy] = React.useState([]);
    const done = i >= total;
    const d = SENTS[i];
    const norm = (s) => s.replace(/\s+/g, ' ').trim();
    const isRight = () => {
      if (!d || answer == null) return false;
      if (d.type === 'listen') return answer === d.ko;
      if (d.type === 'build') return norm(answer.join(' ')) === norm(d.en);
      if (d.type === 'blank') return answer === d.answer;
      if (d.type === 'order') return answer.length === d.lines.length && answer.every((v, k) => v === k);
      return false;
    };
    const hasAnswer = d && (Array.isArray(answer) ? (d.type === 'order' ? answer.length === d.lines.length : answer.length > 0) : answer != null);
    const check = () => {
      if (!hasAnswer || result) return;
      const r = isRight() ? 'right' : 'wrong';
      setResult(r);
      if (r === 'right') setKnown(a => [...a, d.en]); else { setShake(true); setTimeout(() => setShake(false), 320); setFuzzy(a => [...a, d.en]); }
      setFace('back');
    };
    const tearNext = (dir) => {
      if (tear) return;
      setTear({ idx: i, dir });
      setTimeout(() => { setTear(null); setI(n => n + 1); setFace('front'); setAnswer(null); setResult(null); }, 620);
    };
    const reset = () => { setI(0); setFace('front'); setAnswer(null); setResult(null); setKnown([]); setFuzzy([]); setTear(null); };

    return (
      <div style={{ boxSizing: 'border-box', width: 402, height: 874, background: c.bg, backgroundImage: 'repeating-linear-gradient(transparent 0 27px, rgba(62,54,43,.06) 27px 28px)', borderRadius: 40, overflow: 'hidden', position: 'relative', fontFamily: F }} data-screen-label="수첩 STEP2 문장 · 인터랙티브">
        <div style={{ height: 44, display: 'flex', alignItems: 'center', padding: '0 24px', fontSize: 14, fontWeight: 700, color: c.ink }}>9:41<div style={{ flex: 1 }}/>▮▮▮</div>
        <div style={{ padding: '6px 24px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: HW, fontSize: 15, color: c.ink, border: `1.5px solid ${c.ink}`, borderRadius: 3, padding: '1px 8px', transform: 'rotate(-1deg)', whiteSpace: 'nowrap' }}>‹ 나가기</span>
            <div style={{ flex: 1 }}/>
            <NbTag color={c.blue} rot={1}>STEP 2 · 문장</NbTag>
            <span style={{ fontFamily: MONO, fontSize: 12, fontWeight: 700, color: c.soft, whiteSpace: 'nowrap' }}>{Math.min(i + 1, total)} / {total}</span>
          </div>
          <div style={{ display: 'flex', gap: 4, marginTop: 10 }}>
            {SENTS.map((s, k) => <div key={k} style={{ flex: 1, height: 5, borderRadius: 2, background: k < i ? (fuzzy.includes(s.en) ? c.red : c.ink) : 'rgba(62,54,43,.15)', transform: `rotate(${k % 2 ? .7 : -.7}deg)`, transition: 'background .3s' }}/>)}
          </div>
          <div style={{ fontFamily: HW, fontSize: 21, color: c.ink, marginTop: 12, lineHeight: 1.25 }}>반복 신원확인 — 뜻을 보고 <NbMark>문장을 만들어</NbMark>보세요</div>
        </div>

        <div style={{ position: 'absolute', left: 24, right: 24, top: 172, bottom: 182, overflowY: 'auto', overflowX: 'hidden', paddingTop: 12, paddingBottom: 8, scrollbarWidth: 'none' }}>
        <div style={{ position: 'relative', minHeight: 360 }}>
          <div style={{ position: 'absolute', left: 14, right: 14, top: -9, display: 'flex', justifyContent: 'space-between', zIndex: 5 }}>
            {Array.from({ length: 9 }).map((_, k) => <div key={k} style={{ width: 12, height: 18, border: `2px solid ${c.ink}`, borderRadius: 6, background: c.bg, boxSizing: 'border-box' }}/>)}
          </div>
          <div style={{ position: 'absolute', left: 4, right: -4, top: 8, bottom: 0, background: '#F7F1E1', border: `1px solid #E0D6C0` }}/>
          <div style={{ position: 'absolute', left: 2, right: -2, top: 4, bottom: 4, background: '#FBF6E8', border: `1px solid #E0D6C0` }}/>
          {i > 0 && <div key={'stub' + i} className="nb-stub" style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 13, background: c.paper, borderLeft: `1px solid #E0D6C0`, borderRight: `1px solid #E0D6C0`, borderBottom: `1.5px dashed rgba(62,54,43,.35)`, zIndex: 4, clipPath: 'polygon(0 0,100% 0,100% 70%,94% 100%,88% 70%,80% 100%,72% 68%,64% 100%,55% 72%,47% 100%,40% 70%,31% 100%,23% 72%,15% 100%,8% 68%,0 100%)' }}/>}
          {!done && i + 1 < total && <Sheet d={SENTS[i + 1]} idx={i + 1} dim answer={null} onAnswer={() => {}}/>}
          {!done && !tear && (
            <div className={shake ? 'nb-shake' : ''} style={{ position: 'relative', zIndex: 3 }}>
              <Sheet key={'cur' + i} d={d} idx={i} className="nb-rise" answer={answer} onAnswer={setAnswer} result={result} style={{ position: 'relative' }}/>
            </div>
          )}
          {tear && <Sheet d={SENTS[tear.idx]} idx={tear.idx} className={tear.dir === 'r' ? 'nb-tear-r' : 'nb-tear-l'} style={{ zIndex: 6 }} result={fuzzy.includes(SENTS[tear.idx].en) ? 'wrong' : 'right'} answer={answer} onAnswer={() => {}}/>}
          {done && (
            <div className="nb-rise" style={{ position: 'relative', zIndex: 3, background: c.paper, border: `1px solid #E0D6C0`, boxShadow: '0 4px 10px rgba(62,54,43,.16)', padding: '28px 18px 20px', textAlign: 'center' }}>
              <div style={{ display: 'inline-block', width: 96, height: 96, borderRadius: '50%', border: `3px double ${c.blue}`, color: c.blue, transform: 'rotate(-10deg)' }}>
                <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 2, marginTop: 24 }}>DONE</div>
                <div style={{ fontFamily: HW, fontSize: 22, lineHeight: 1 }}>문장 완료</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 18 }}>
                <div style={{ textAlign: 'center' }}><div style={{ fontFamily: HW, fontSize: 24, color: c.green }}>{known.length}</div><div style={{ fontSize: 10.5, color: c.soft }}>바로 맞힘</div></div>
                <div style={{ width: 1, background: 'rgba(62,54,43,.2)' }}/>
                <div style={{ textAlign: 'center' }}><div style={{ fontFamily: HW, fontSize: 24, color: c.red }}>{fuzzy.length}</div><div style={{ fontSize: 10.5, color: c.soft }}>틀림 → 노트</div></div>
              </div>
              <div style={{ marginTop: 10, fontFamily: HW, fontSize: 13.5, color: c.soft }}>이 문장들이 STEP 3 가이드 대화의 정답이 돼요 ✎</div>
              <div onClick={reset} style={{ marginTop: 14, fontFamily: HW, fontSize: 13, color: c.blue, textDecoration: 'underline', textUnderlineOffset: 3, cursor: 'pointer' }}>(프로토타입: 처음부터)</div>
            </div>
          )}
        </div>
        </div>

        <div style={{ position: 'absolute', left: 24, right: 24, bottom: 98 }}>
          {!done && face === 'front' && (
            <div onClick={check} style={{ cursor: hasAnswer ? 'pointer' : 'default' }}>
              <NbButton variant="ink" size="lg" full icon="pencil" iconColor="#FFFdf4" style={hasAnswer ? {} : { opacity: .4 }}>확인하기</NbButton>
            </div>
          )}
          {!done && face === 'back' && (
            <div style={{ display: 'flex', gap: 12 }}>
              {[
                { dir: 'l', col: c.amber, icon: 'bulb', label: '아직 헷갈려요', sub: '노트에 저장', rot: -0.8 },
                { dir: 'r', col: c.green, icon: 'check', label: result === 'right' ? '외웠어요' : '이제 알겠어요', sub: '뜯고 다음 장', rot: 0.8 },
              ].map(b => (
                <div key={b.dir} onClick={() => tearNext(b.dir)} style={{ flex: 1, cursor: 'pointer' }}>
                  <NbPaper rot={b.rot} style={{ padding: '11px 10px', display: 'flex', alignItems: 'center', gap: 10, border: `1.8px solid ${b.col}`, background: `${b.col}14` }}>
                    <NbIcon name={b.icon} size={30} style={{ flexShrink: 0 }}/>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontFamily: HW, fontSize: 17, color: b.col, lineHeight: 1, whiteSpace: 'nowrap' }}>{b.label}</div>
                      <div style={{ fontSize: 10.5, color: c.soft, marginTop: 4, whiteSpace: 'nowrap' }}>{b.sub}</div>
                    </div>
                  </NbPaper>
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{ position: 'absolute', left: 24, right: 24, bottom: 34 }}>
          <NbButton variant={done ? 'ink' : 'dashed'} size="lg" full icon="speech" iconColor={done ? '#FFFdf4' : undefined} style={done ? {} : { opacity: .5 }}>STEP 3 · 가이드 대화로 ›</NbButton>
        </div>
      </div>
    );
  }

  Object.assign(window, { SentStudyLive });
})();
