// forin-notebook-lesson-words-live.jsx — STEP 1 단어 학습 인터랙티브 (수첩 그림체)
// 학습 루프: 프롬프트(한국어 뜻 + 맥락 단서) → 사용자가 '떠올려서' 답함 → 낱장 뒤집혀 정답·해설
// → 알아요/헷갈려요로 뜯어냄. 프롬프트 3유형 교대: 첫글자 힌트 채우기 · 3지 고르기 · 듣고 뜻 고르기.
(function () {
  const { NbPaper, NbButton, NbTag, NbMark, NbMemo } = window.NbUI;
  const NbIcon = window.NbIcon;
  const HW = '"Gaegu","Nanum Pen Script",cursive';
  const F = '"Pretendard",sans-serif';
  const MONO = '"IBM Plex Mono",monospace';
  const c = { bg: '#F1EBDD', paper: '#FFFdf4', ink: '#3E362B', soft: '#9A8F7C', red: '#C75146', blue: '#4A6FA5', green: '#5F8D5A', amber: '#C77E2E' };

  if (!document.getElementById('nb-tear-css')) {
    const s = document.createElement('style'); s.id = 'nb-tear-css';
    s.textContent = `
@keyframes nb-tear-r{0%{transform:rotate(0) translate(0,0)}18%{transform:rotate(-3deg) translate(3px,-6px)}100%{transform:rotate(22deg) translate(300px,-80px);opacity:0}}
@keyframes nb-tear-l{0%{transform:rotate(0) translate(0,0)}18%{transform:rotate(3deg) translate(-3px,-6px)}100%{transform:rotate(-22deg) translate(-300px,-80px);opacity:0}}
.nb-tear-r{animation:nb-tear-r .62s cubic-bezier(.3,.6,.4,1) both;transform-origin:top left;pointer-events:none}
.nb-tear-l{animation:nb-tear-l .62s cubic-bezier(.3,.6,.4,1) both;transform-origin:top right;pointer-events:none}
@keyframes nb-rise{0%{transform:translateY(6px) scale(.985)}100%{transform:none}}
.nb-rise{animation:nb-rise .4s ease-out both}
@keyframes nb-stub{0%{opacity:0;transform:scaleY(.4)}100%{opacity:1;transform:none}}
.nb-stub{animation:nb-stub .3s ease-out both;transform-origin:top}
@keyframes nb-flip{0%{transform:rotateX(0);opacity:1}45%{transform:rotateX(62deg);opacity:1}55%{transform:rotateX(-62deg);opacity:1}100%{transform:rotateX(0);opacity:1}}
.nb-flip{animation:nb-flip .5s ease-in-out both;transform-origin:center 40%}
@keyframes nb-shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}
.nb-shake{animation:nb-shake .3s ease both}
@keyframes nb-ok{0%{transform:scale(.6) rotate(-20deg);opacity:0}70%{transform:scale(1.08) rotate(-10deg);opacity:1}100%{transform:scale(1) rotate(-10deg)}}
.nb-ok{animation:nb-ok .35s ease-out both}
@keyframes nb-reveal{0%{opacity:0;transform:translateY(-6px)}100%{opacity:1;transform:none}}
.nb-reveal{animation:nb-reveal .3s ease-out both}
`;
    document.head.appendChild(s);
  }

  // 프롬프트 유형: fill(첫글자 힌트 + 키보드 칩) / pick(영어 3지) / listen(듣고 뜻 3지)
  const WORDS = [
    { w: 'mechanism of injury', ipa: '/ˈmɛkənɪzəm əv ˈɪndʒəri/', ko: '손상 기전', cue: '어떻게 다쳤는지 — 사고의 원인·방식', ex: 'What was the mechanism of injury?', exKo: '손상 기전이 무엇이었나요?', tag: '외상 인계', icon: 'siren', type: 'pick', opts: ['mechanism of injury', 'cause of illness', 'point of impact'] },
    { w: 'hypotensive', ipa: '/ˌhaɪpəˈtɛnsɪv/', ko: '저혈압의', cue: '혈압이 낮은 상태 — BP 88/54', ex: 'Patient is hypotensive, BP 88 over 54.', exKo: '저혈압, 혈압 88/54.', tag: '바이탈', icon: 'monitor', type: 'fill', chips: ['hypo', 'tens', 'ive', 'hyper', 'ion'] },
    { w: 'deteriorate', ipa: '/dɪˈtɪriəreɪt/', ko: '(상태가) 악화되다', cue: '이송 중 점점 나빠지는 환자', ex: 'She started to deteriorate en route.', exKo: '이송 중 악화되기 시작했어요.', tag: '상태 변화', icon: 'chartup', type: 'listen', opts: ['악화되다', '안정되다', '의식을 잃다'] },
    { w: 'restrained driver', ipa: '/rɪˈstreɪnd ˈdraɪvər/', ko: '안전벨트 착용 운전자', cue: '벨트를 맨 채 운전하던 사람', ex: 'Restrained driver, airbag deployed.', exKo: '벨트 착용 운전자, 에어백 전개.', tag: '외상 인계', icon: 'shield', type: 'pick', opts: ['restrained driver', 'restless driver', 'retained driver'] },
    { w: 'en route', ipa: '/ɒn ˈruːt/', ko: '이송 중에', cue: '구급차로 오는 길에', ex: 'We gave 500 mL saline en route.', exKo: '이송 중 생리식염수 500 투여.', tag: '외상 인계', icon: 'compass', type: 'fill', chips: ['en', 'route', 'on', 'road', 'way'] },
    { w: 'GCS', ipa: '/dʒiː siː ɛs/', ko: '글래스고 혼수 척도', cue: '의식 수준 점수 — 눈·말·운동 15점', ex: 'GCS is 14, eyes open to voice.', exKo: 'GCS 14, 음성에 눈 뜸.', tag: '신경 사정', icon: 'bulb', type: 'listen', opts: ['글래스고 혼수 척도', '통증 척도', '낙상 위험 점수'] },
  ];
  // 뉘앙스 문제 — 회상 6장 뒤에 이어지는 2장
  const NUANCE = [
    { type: 'slider', tag: '뉘앙스 · 강도', icon: 'faceWorried', ko: '통증의 세기', cue: '환자: "It\'s… bearable, but it won\'t go away."', scale: ['discomfort', 'pain', 'agony'], answer: 0, why: '"bearable(견딜 만하다)"이면 discomfort 쪽. pain은 중립, agony는 극심한 고통 — 한국어로는 다 "아프다"지만 온도가 달라요.', ex: 'Some discomfort is expected after the procedure.', exKo: '시술 후 약간의 불편감은 정상이에요.' , w: 'discomfort · pain · agony', ipa: '' },
    { type: 'pair', tag: '뉘앙스 · 콜로케이션', icon: 'pill', ko: '무엇과 같이 쓰나요?', cue: '자연스럽게 붙는 짝을 이어요 — 뉘앙스의 절반은 짝에서 나와요', pairs: [['administer', 'medication'], ['titrate', 'the drip'], ['en route', 'to the ER']], decoys: ['the patient'], why: 'administer는 "투여하다"라서 medication과, titrate는 용량을 "조절"하니 drip과 붙어요. en route는 항상 to와.', ex: 'We administered 4 mg morphine en route to the ER.', exKo: '응급실로 이송 중 모르핀 4mg 투여.', w: 'administer · titrate · en route', ipa: '' },
  ];
  const TYPE_LABEL = { fill: '조각 맞추기', pick: '영어 고르기', listen: '듣고 뜻 고르기', slider: '뉘앙스 저울', pair: '콜로케이션 짝' };
  const ALL = [...WORDS, ...NUANCE];

  // ── 낱장(앞면: 프롬프트 / 뒷면: 정답) ──
  function Sheet({ d, idx, total, dim, style, className, face = 'front', answer, onAnswer, result }) {
    const wrong = result === 'wrong';
    const prompt = () => {
      if (d.type === 'pick') return (
        <div style={{ marginTop: 14 }}>
          {d.opts.map((o, i) => {
            const on = answer === o, ok = result && o === d.w, bad = result && on && !ok;
            return (
              <div key={o} onClick={() => !result && onAnswer(o)} style={{ marginTop: i ? 8 : 0, padding: '10px 12px', border: `1.6px solid ${ok ? c.green : bad ? c.red : on ? c.ink : 'rgba(62,54,43,.3)'}`, background: ok ? 'rgba(95,141,90,.12)' : bad ? 'rgba(199,81,70,.1)' : c.paper, fontFamily: MONO, fontSize: 14, fontWeight: 700, color: c.ink, cursor: 'pointer', transform: `rotate(${i % 2 ? .4 : -.4}deg)`, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 18, height: 18, borderRadius: '50%', border: `1.5px solid ${ok ? c.green : bad ? c.red : c.soft}`, color: ok ? c.green : bad ? c.red : c.soft, fontFamily: HW, fontSize: 12, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{ok ? '✓' : bad ? '✕' : String.fromCharCode(65 + i)}</span>{o}
              </div>
            );
          })}
        </div>
      );
      if (d.type === 'listen') return (
        <div style={{ marginTop: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: 62, height: 62, borderRadius: '50%', border: `2px solid ${c.blue}`, background: 'rgba(74,111,165,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 5px rgba(62,54,43,.15)' }}><NbIcon name="speaker" size={30}/></div>
          </div>
          <div style={{ textAlign: 'center', fontFamily: MONO, fontSize: 11.5, color: c.soft, marginTop: 6 }}>{d.ipa}</div>
          <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
            {d.opts.map((o, i) => {
              const on = answer === o, ok = result && o === d.opts[0], bad = result && on && !ok;
              return <div key={o} onClick={() => !result && onAnswer(o)} style={{ flex: 1, padding: '9px 4px', textAlign: 'center', border: `1.6px solid ${ok ? c.green : bad ? c.red : on ? c.ink : 'rgba(62,54,43,.3)'}`, background: ok ? 'rgba(95,141,90,.12)' : bad ? 'rgba(199,81,70,.1)' : c.paper, fontFamily: HW, fontSize: 14, color: c.ink, cursor: 'pointer', transform: `rotate(${i % 2 ? .6 : -.6}deg)`, lineHeight: 1.2 }}>{o}</div>;
            })}
          </div>
        </div>
      );
      if (d.type === 'slider') {
        const pos = answer == null ? null : answer;
        return (
          <div style={{ marginTop: 18 }}>
            <div style={{ position: 'relative', height: 62 }}>
              <div style={{ position: 'absolute', left: 36, right: 36, top: 20, height: 4, background: 'linear-gradient(90deg, #7A9E7E, #C77E2E, #C75146)', borderRadius: 2 }}/>
              {d.scale.map((s, i) => {
                const n = d.scale.length, x = i / (n - 1) * 100;
                const edge = i === 0 ? 'left' : i === n - 1 ? 'right' : 'center';
                const on = pos === i, ok = result && i === d.answer, bad = result && on && !ok;
                return (
                  <div key={s} onClick={() => !result && onAnswer(i)} style={{ position: 'absolute', left: `calc(36px + (100% - 72px) * ${x / 100})`, top: 0, transform: 'translateX(-50%)', textAlign: 'center', cursor: 'pointer', width: 72 }}>
                    <div style={{ width: on || ok ? 26 : 18, height: on || ok ? 26 : 18, margin: `${on || ok ? 9 : 13}px auto 0`, borderRadius: '50%', border: `2px solid ${ok ? c.green : bad ? c.red : on ? c.ink : 'rgba(62,54,43,.45)'}`, background: ok ? c.green : bad ? c.red : on ? c.ink : c.paper, boxShadow: on || ok ? '0 2px 5px rgba(62,54,43,.3)' : 'none', transition: 'all .15s' }}/>
                    <div style={{ fontFamily: MONO, fontSize: 11.5, fontWeight: 700, color: ok ? c.green : bad ? c.red : on ? c.ink : c.soft, marginTop: 6, lineHeight: 1.15, wordBreak: 'break-word', width: 96, marginLeft: -12 }}>{s}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: HW, fontSize: 12, color: c.soft, marginTop: 8, padding: '0 4px' }}><span>약함 · 완곡</span><span>강함 · 직설</span></div>
            <div style={{ fontFamily: HW, fontSize: 13, color: c.soft, marginTop: 8 }}>이 환자의 말에 맞는 위치를 골라요</div>
          </div>
        );
      }
      if (d.type === 'pair') {
        const sel = answer || { left: null, links: {} };
        const rights = [...d.pairs.map(p => p[1]), ...d.decoys];
        const linkOf = (l) => sel.links[l];
        const isOk = (l, r) => d.pairs.some(p => p[0] === l && p[1] === r);
        // 매핑 색 — 왼쪽 단어 순서대로 고정 (파랑 · 주황 · 보라)
        const PAIR_COL = ['#4A6FA5', '#D9822B', '#8B5CB8'];
        const colOf = (l) => PAIR_COL[d.pairs.findIndex(p => p[0] === l)] || c.ink;
        const pairIdx = (l) => d.pairs.findIndex(p => p[0] === l) + 1;
        return (
          <div style={{ marginTop: 14, display: 'flex', gap: 10 }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {d.pairs.map(([l]) => {
                const r = linkOf(l), on = sel.left === l;
                const ok = result && r && isOk(l, r), bad = result && r && !isOk(l, r);
                const pc = colOf(l);
                return <div key={l} onClick={() => !result && onAnswer({ ...sel, left: on ? null : l })} style={{ padding: '9px 10px', border: `${on || r ? 2.2 : 1.6}px solid ${ok ? c.green : bad ? c.red : on || r ? pc : 'rgba(62,54,43,.3)'}`, background: on ? `${pc}14` : c.paper, fontFamily: MONO, fontSize: 12.5, fontWeight: 700, color: c.ink, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, transform: 'rotate(-.4deg)', boxShadow: on ? `0 0 0 3px ${pc}33` : 'none' }}><span style={{ width: 16, height: 16, borderRadius: '50%', background: pc, color: '#fff', fontFamily: HW, fontSize: 11, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{pairIdx(l)}</span>{l}<div style={{ flex: 1 }}/>{r && <span style={{ fontFamily: HW, fontSize: 13, color: ok ? c.green : bad ? c.red : pc }}>→</span>}</div>;
              })}
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {rights.map(r => {
                const usedBy = Object.keys(sel.links).find(l => sel.links[l] === r);
                const ok = result && usedBy && isOk(usedBy, r), bad = result && usedBy && !isOk(usedBy, r);
                const pc = usedBy ? colOf(usedBy) : (sel.left ? colOf(sel.left) : null);
                return <div key={r} onClick={() => { if (result || !sel.left) return; const links = { ...sel.links }; Object.keys(links).forEach(k => { if (links[k] === r) delete links[k]; }); links[sel.left] = r; onAnswer({ left: null, links }); }} style={{ padding: '9px 10px', border: `${usedBy ? 2.2 : 1.6}px ${usedBy ? 'solid' : 'dashed'} ${ok ? c.green : bad ? c.red : usedBy ? pc : sel.left ? pc + '99' : 'rgba(62,54,43,.35)'}`, background: usedBy ? `${pc}14` : 'transparent', fontFamily: MONO, fontSize: 12.5, fontWeight: 700, color: c.ink, cursor: 'pointer', transform: 'rotate(.4deg)', display: 'flex', alignItems: 'center', gap: 6 }}>{usedBy && <span style={{ width: 16, height: 16, borderRadius: '50%', background: ok ? c.green : bad ? c.red : pc, color: '#fff', fontFamily: HW, fontSize: 11, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{pairIdx(usedBy)}</span>}{r}</div>;
              })}
            </div>
          </div>
        );
      }
      // fill — 조각 칩으로 단어 조립
      const built = answer || [];
      const target = d.w.split(' ');
      return (
        <div style={{ marginTop: 12 }}>
          <div style={{ minHeight: 42, borderBottom: `2px solid ${result ? (wrong ? c.red : c.green) : 'rgba(62,54,43,.5)'}`, display: 'flex', alignItems: 'flex-end', gap: 4, padding: '0 2px 6px', flexWrap: 'wrap' }}>
            {built.length === 0 && <span style={{ fontFamily: HW, fontSize: 15, color: '#B4A88F' }}>{d.w[0]}{'_ '.repeat(Math.min(d.w.length - 1, 9))}</span>}
            {built.map((b, i) => <span key={i} onClick={() => !result && onAnswer(built.filter((_, j) => j !== i))} style={{ fontFamily: MONO, fontSize: 17, fontWeight: 700, color: c.ink, background: 'rgba(249,227,123,.55)', padding: '1px 5px', cursor: 'pointer' }}>{b}</span>)}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 12 }}>
            {d.chips.map((ch, i) => {
              const used = built.includes(ch);
              return <span key={ch} onClick={() => !result && !used && onAnswer([...built, ch])} style={{ fontFamily: MONO, fontSize: 13.5, fontWeight: 700, color: used ? 'transparent' : c.ink, background: used ? 'repeating-linear-gradient(-45deg, rgba(62,54,43,.1) 0 3px, transparent 3px 6px)' : c.paper, border: `1.4px ${used ? 'dashed' : 'solid'} ${used ? 'rgba(62,54,43,.3)' : c.ink}`, padding: '6px 11px', cursor: used ? 'default' : 'pointer', transform: `rotate(${i % 2 ? 1 : -1}deg)`, boxShadow: used ? 'none' : '1px 2px 0 rgba(62,54,43,.2)' }}>{ch}</span>;
            })}
          </div>
          <div style={{ fontFamily: HW, fontSize: 12.5, color: c.soft, marginTop: 8 }}>조각을 눌러 순서대로 붙여요 · 다시 누르면 빼요{target.length > 1 ? ' · 띄어쓰기는 자동' : ''}</div>
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
          {true ? (
            <>
              {/* 프롬프트 — 한국어 뜻 + 맥락 단서 (아이콘 크게) */}
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 14 }}>
                <div style={{ width: 58, height: 58, borderRadius: '50%', background: `${c.amber}22`, border: `2px solid ${c.amber}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transform: 'rotate(-4deg)' }}><NbIcon name={d.icon} size={32}/></div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: HW, fontSize: 23, color: c.ink, lineHeight: 1.15 }}><NbMark>{d.type === 'listen' ? '이 단어의 뜻은?' : d.ko}</NbMark></div>
                  <div style={{ fontFamily: HW, fontSize: 13.5, color: c.soft, marginTop: 4, lineHeight: 1.35 }}>✎ {d.cue}</div>
                </div>
              </div>
              {prompt()}
              {/* 해설 — 같은 장 아래에 펼쳐짐 */}
              {result && (
                <div className="nb-reveal" style={{ marginTop: 14, paddingTop: 12, borderTop: `1.5px dashed rgba(62,54,43,.3)`, position: 'relative' }}>
                  <div style={{ position: 'absolute', right: 0, top: 6 }} className="nb-ok">
                    <div style={{ width: 56, height: 56, borderRadius: '50%', border: `3px double ${wrong ? c.red : c.green}`, color: wrong ? c.red : c.green, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-10deg)', background: c.paper }}>
                      <div style={{ fontSize: 7.5, fontWeight: 800, letterSpacing: 1 }}>{wrong ? 'RETRY' : 'GOOD'}</div>
                      <div style={{ fontFamily: HW, fontSize: 15, lineHeight: 1 }}>{wrong ? '다시' : '정답'}</div>
                    </div>
                  </div>
                  <div style={{ paddingRight: 64 }}>
                    <div style={{ fontFamily: MONO, fontSize: 19, fontWeight: 700, color: c.ink, lineHeight: 1.15 }}>{d.w} <span style={{ marginLeft: 4, verticalAlign: '-2px' }}><NbIcon name="speaker" size={15}/></span></div>
                    {d.ipa && <div style={{ fontFamily: MONO, fontSize: 11, color: c.soft, marginTop: 3 }}>{d.ipa}</div>}
                  </div>
                  {d.why && <div style={{ marginTop: 8, fontFamily: HW, fontSize: 13.5, color: c.ink, lineHeight: 1.45, padding: '6px 9px', border: `1.3px dashed ${c.blue}`, background: 'rgba(74,111,165,.05)' }}><b style={{ color: c.blue }}>뉘앙스</b> {d.why}</div>}
                  <div style={{ marginTop: 9, padding: '8px 10px', borderLeft: `2.5px solid ${c.blue}`, background: 'rgba(74,111,165,.06)' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: c.ink, lineHeight: 1.5 }}>{d.ex}</div>
                    <div style={{ fontFamily: HW, fontSize: 13, color: c.soft, marginTop: 2 }}>{d.exKo}</div>
                  </div>
                  {wrong && answer && d.type === 'fill' && <div style={{ marginTop: 7, fontFamily: HW, fontSize: 13, color: c.red }}>내 답: <s>{Array.isArray(answer) ? answer.join(' ') : answer}</s></div>}
                </div>
              )}
            </>
          ) : (
            <>
              <div style={{ position: 'absolute', right: 14, top: 40 }} className="nb-ok">
                <div style={{ width: 64, height: 64, borderRadius: '50%', border: `3px double ${wrong ? c.red : c.green}`, color: wrong ? c.red : c.green, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-10deg)' }}>
                  <div style={{ fontSize: 8, fontWeight: 800, letterSpacing: 1 }}>{wrong ? 'RETRY' : 'GOOD'}</div>
                  <div style={{ fontFamily: HW, fontSize: 17, lineHeight: 1 }}>{wrong ? '다시' : '정답'}</div>
                </div>
              </div>
              <div style={{ fontFamily: MONO, fontSize: 24, fontWeight: 700, color: c.ink, marginTop: 16, lineHeight: 1.15, paddingRight: 70 }}>{d.w}</div>
              <div style={{ fontFamily: MONO, fontSize: 12, color: c.soft, marginTop: 5 }}>{d.ipa} <span style={{ marginLeft: 6, verticalAlign: '-2px' }}><NbIcon name="speaker" size={15}/></span></div>
              <div style={{ fontFamily: HW, fontSize: 21, color: c.ink, marginTop: 12 }}><NbMark>{d.ko}</NbMark></div>
              <div style={{ marginTop: 13, padding: '9px 11px', borderLeft: `2.5px solid ${c.blue}`, background: 'rgba(74,111,165,.06)' }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: c.ink, lineHeight: 1.5 }}>{d.ex}</div>
                <div style={{ fontFamily: HW, fontSize: 13.5, color: c.soft, marginTop: 3 }}>{d.exKo}</div>
              </div>
              {wrong && answer && <div style={{ marginTop: 9, fontFamily: HW, fontSize: 13.5, color: c.red }}>내 답: <s>{Array.isArray(answer) ? answer.join(' ') : answer}</s></div>}
            </>
          )}
        </div>
      </div>
    );
  }

  function WordStudyLive() {
    const [i, setI] = React.useState(0);
    const [face, setFace] = React.useState('front');   // front(프롬프트) → back(정답)
    const [answer, setAnswer] = React.useState(null);
    const [result, setResult] = React.useState(null);  // 'right' | 'wrong'
    const [flipping, setFlipping] = React.useState(false);
    const [shake, setShake] = React.useState(false);
    const [tear, setTear] = React.useState(null);
    const [known, setKnown] = React.useState([]);
    const [fuzzy, setFuzzy] = React.useState([]);
    const total = ALL.length;
    const done = i >= total;
    const d = ALL[i];

    const isRight = () => {
      if (!d || answer == null) return false;
      if (d.type === 'fill') return (Array.isArray(answer) ? answer.join(' ') : '').replace(/\s+/g, '') === d.w.replace(/\s+/g, '');
      if (d.type === 'listen') return answer === d.opts[0];
      if (d.type === 'slider') return answer === d.answer;
      if (d.type === 'pair') { const L = (answer && answer.links) || {}; return d.pairs.every(p => L[p[0]] === p[1]); }
      return answer === d.w;
    };
    const hasAnswer = d && (d.type === 'pair' ? !!(answer && Object.keys(answer.links || {}).length === d.pairs.length) : Array.isArray(answer) ? answer.length > 0 : answer != null);
    const check = () => {
      if (!hasAnswer || result) return;
      const r = isRight() ? 'right' : 'wrong';
      setResult(r);
      if (r === 'right') (setKnown)(a => [...a, d.w]);
      else { setShake(true); setTimeout(() => setShake(false), 320); setFuzzy(a => [...a, d.w]); }
      setFace('back');
    };
    const tearNext = (dir) => {
      if (tear) return;
      setTear({ idx: i, dir });
      setTimeout(() => { setTear(null); setI(n => n + 1); setFace('front'); setAnswer(null); setResult(null); }, 620);
    };
    const reset = () => { setI(0); setFace('front'); setAnswer(null); setResult(null); setKnown([]); setFuzzy([]); setTear(null); };

    return (
      <div style={{ boxSizing: 'border-box', width: 402, height: 874, background: c.bg, backgroundImage: 'repeating-linear-gradient(transparent 0 27px, rgba(62,54,43,.06) 27px 28px)', borderRadius: 40, overflow: 'hidden', position: 'relative', fontFamily: F }} data-screen-label="수첩 STEP1 단어 · 인터랙티브">
        <div style={{ height: 44, display: 'flex', alignItems: 'center', padding: '0 24px', fontSize: 14, fontWeight: 700, color: c.ink }}>9:41<div style={{ flex: 1 }}/>▮▮▮</div>
        <div style={{ padding: '6px 24px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: HW, fontSize: 15, color: c.ink, border: `1.5px solid ${c.ink}`, borderRadius: 3, padding: '1px 8px', transform: 'rotate(-1deg)', whiteSpace: 'nowrap' }}>‹ 나가기</span>
            <div style={{ flex: 1 }}/>
            <NbTag color={c.green} rot={1}>STEP 1 · 단어</NbTag>
          </div>
          <div style={{ display: 'flex', gap: 4, marginTop: 10 }}>
            {ALL.map((_, k) => <div key={k} style={{ flex: 1, height: 5, borderRadius: 2, background: k < i ? (fuzzy.includes(ALL[k].w) ? c.red : c.ink) : (k >= WORDS.length ? 'rgba(74,111,165,.25)' : 'rgba(62,54,43,.15)'), transform: `rotate(${k % 2 ? .7 : -.7}deg)`, transition: 'background .3s' }}/>)}
          </div>
          <div style={{ fontFamily: HW, fontSize: 21, color: c.ink, marginTop: 12, lineHeight: 1.25 }}>{i >= WORDS.length && !done ? <span>이제 <NbMark>뉘앙스</NbMark>를 느껴봐요 — 비슷한 말, 다른 온도</span> : <span>구급대 인계 — 뜻을 보고 <NbMark>영어를 떠올려</NbMark>보세요</span>}</div>
        </div>

        {/* 단어장 묶음 */}
        <div style={{ position: 'absolute', left: 24, right: 24, top: 172, bottom: 182, overflowY: 'auto', overflowX: 'hidden', paddingTop: 12, paddingBottom: 8, scrollbarWidth: 'none' }}>
        <div style={{ position: 'relative', minHeight: 360 }}>
          <div style={{ position: 'absolute', left: 14, right: 14, top: -9, display: 'flex', justifyContent: 'space-between', zIndex: 5 }}>
            {Array.from({ length: 9 }).map((_, k) => <div key={k} style={{ width: 12, height: 18, border: `2px solid ${c.ink}`, borderRadius: 6, background: c.bg, boxSizing: 'border-box' }}/>)}
          </div>
          <div style={{ position: 'absolute', left: 4, right: -4, top: 8, bottom: 0, background: '#F7F1E1', border: `1px solid #E0D6C0` }}/>
          <div style={{ position: 'absolute', left: 2, right: -2, top: 4, bottom: 4, background: '#FBF6E8', border: `1px solid #E0D6C0` }}/>
          {i > 0 && <div key={'stub' + i} className="nb-stub" style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 13, background: c.paper, borderLeft: `1px solid #E0D6C0`, borderRight: `1px solid #E0D6C0`, borderBottom: `1.5px dashed rgba(62,54,43,.35)`, zIndex: 4, clipPath: 'polygon(0 0,100% 0,100% 70%,94% 100%,88% 70%,80% 100%,72% 68%,64% 100%,55% 72%,47% 100%,40% 70%,31% 100%,23% 72%,15% 100%,8% 68%,0 100%)' }}/>}
          {!done && i + 1 < total && <Sheet d={ALL[i + 1]} idx={i + 1} total={total} dim answer={null} onAnswer={() => {}}/>}
          {!done && !tear && (
            <div className={shake ? 'nb-shake' : ''} style={{ position: 'relative', zIndex: 3 }}>
              <Sheet key={'cur' + i} d={d} idx={i} total={total} className="nb-rise" face="front" answer={answer} onAnswer={setAnswer} result={result} style={{ position: 'relative' }}/>
            </div>
          )}
          {tear && <Sheet d={ALL[tear.idx]} idx={tear.idx} total={total} className={tear.dir === 'r' ? 'nb-tear-r' : 'nb-tear-l'} style={{ zIndex: 6 }} face="front" result={fuzzy.includes(ALL[tear.idx].w) ? 'wrong' : 'right'} answer={answer} onAnswer={() => {}}/>}
          {done && (
            <div className="nb-rise" style={{ position: 'relative', zIndex: 3, background: c.paper, border: `1px solid #E0D6C0`, boxShadow: '0 4px 10px rgba(62,54,43,.16)', padding: '28px 18px 20px', textAlign: 'center' }}>
              <div style={{ display: 'inline-block', width: 96, height: 96, borderRadius: '50%', border: `3px double ${c.green}`, color: c.green, transform: 'rotate(-10deg)' }}>
                <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 2, marginTop: 24 }}>DONE</div>
                <div style={{ fontFamily: HW, fontSize: 22, lineHeight: 1 }}>단어 완료</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 18 }}>
                <div style={{ textAlign: 'center' }}><div style={{ fontFamily: HW, fontSize: 24, color: c.green }}>{known.length}</div><div style={{ fontSize: 10.5, color: c.soft }}>바로 맞힘</div></div>
                <div style={{ width: 1, background: 'rgba(62,54,43,.2)' }}/>
                <div style={{ textAlign: 'center' }}><div style={{ fontFamily: HW, fontSize: 24, color: c.red }}>{fuzzy.length}</div><div style={{ fontSize: 10.5, color: c.soft }}>틀림 → 노트</div></div>
              </div>
              {fuzzy.length > 0 && <div style={{ marginTop: 10, fontFamily: HW, fontSize: 13.5, color: c.soft }}>틀린 단어는 STEP 2 문장에 다시 나와요 ✎</div>}
              <div onClick={reset} style={{ marginTop: 14, fontFamily: HW, fontSize: 13, color: c.blue, textDecoration: 'underline', textUnderlineOffset: 3, cursor: 'pointer' }}>(프로토타입: 처음부터)</div>
            </div>
          )}
        </div>
        </div>

        {/* 하단 — 앞면: 확인 / 뒷면: 뜯어서 다음 */}
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
          <NbButton variant={done ? 'ink' : 'dashed'} size="lg" full icon="speech" iconColor={done ? '#FFFdf4' : undefined} style={done ? {} : { opacity: .5 }}>STEP 2 · 문장 학습으로 ›</NbButton>
        </div>
      </div>
    );
  }

  Object.assign(window, { WordStudyLive });
})();
