// forin-notebook-home3.jsx — 홈 전면 개편: "달력 한 장 + 버튼 하나"
// 원칙: 글자 없이도 누를 곳이 보이는 홈. 요소는 3개뿐 —
//   ① 상단: 아바타 · 연속 출근(불꽃+숫자) · 호출 배지(있을 때만)
//   ② 근무 달력(프로필 성장 리포트 달력 이식): 근무대 색 + 아이콘, 오늘 = 잉크 동그라미, 탭하면 그날 도장
//   ③ 큰 '이어서' 버튼 하나: 진행 중 부서 아이콘 + 재생 ▶ + 진행 링
(function () {
  const { NbPaper } = window.NbUI;
  const NbIcon = window.NbIcon;
  const HW = '"Gaegu","Nanum Pen Script",cursive';
  const F = '"Pretendard",sans-serif';
  const MONO = '"IBM Plex Mono",monospace';
  const c = { bg: '#F1EBDD', paper: '#FFFdf4', ink: '#3E362B', soft: '#9A8F7C', red: '#C75146', blue: '#4A6FA5', green: '#5F8D5A', tape: 'rgba(160,200,220,.55)' };
  const SHIFT = {
    day:   { bg: 'rgba(249,227,123,.65)', col: '#C9A227' },
    eve:   { bg: 'rgba(233,150,100,.38)', col: '#C7743E' },
    night: { bg: 'rgba(195,177,232,.5)',  col: '#7A68B0' },
  };

  if (!document.getElementById('nb-home3-css')) {
    const s = document.createElement('style');
    s.id = 'nb-home3-css';
    s.textContent = `
@keyframes nbh3-pop{0%{transform:translateY(14px);opacity:0}100%{transform:none;opacity:1}}
.nbh3-pop{animation:nbh3-pop .32s cubic-bezier(.3,.7,.3,1) both}
@keyframes nbh3-ring{0%,100%{transform:rotate(-8deg)}50%{transform:rotate(8deg)}}
.nbh3-ring{animation:nbh3-ring .5s ease-in-out infinite;transform-origin:50% 20%}
@keyframes nbh3-breathe{0%,100%{box-shadow:4px 5px 0 rgba(62,54,43,.28)}50%{box-shadow:4px 5px 0 rgba(62,54,43,.28),0 0 0 7px rgba(249,227,123,.45)}}
.nbh3-go{animation:nbh3-breathe 2.4s ease-in-out infinite;transition:transform .12s}
.nbh3-go:active{transform:translate(2px,3px) rotate(-1deg)}
.nbh3-cell{transition:transform .12s}
.nbh3-cell:active{transform:scale(.92)}
`;
    document.head.appendChild(s);
  }

  // 근무대 글리프 (해 · 노을 · 달)
  function ShiftGlyph({ k, size = 12 }) {
    const col = SHIFT[k].col, P = { fill: 'none', stroke: c.ink, strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' };
    return (
      <svg viewBox="0 0 16 16" width={size} height={size} style={{ display: 'block' }}>
        {k === 'day' && <g><circle cx="8" cy="8" r="3.3" fill={col} {...P}/><path d="M8 1.5 V3 M8 13 V14.5 M1.5 8 H3 M13 8 H14.5 M3.4 3.4 L4.4 4.4 M11.6 11.6 L12.6 12.6 M12.6 3.4 L11.6 4.4 M4.4 11.6 L3.4 12.6" {...P}/></g>}
        {k === 'eve' && <g><path d="M3.5 10.5 A4.5 4.5 0 0 1 12.5 10.5 Z" fill={col} {...P}/><path d="M1.5 10.5 H14.5 M4 13 H12" {...P}/></g>}
        {k === 'night' && <path d="M10.8 2.5 A5.6 5.6 0 1 0 13.5 10.4 A4.4 4.4 0 0 1 10.8 2.5 Z" fill={col} {...P}/>}
      </svg>
    );
  }

  // 9월 데이터: [일, 근무대, [완료한 상황 부서 아이콘…]]
  const DAYS = {
    1: ['day', ['siren', 'siren']], 2: ['eve', ['pill']], 3: ['eve', ['siren']], 4: ['day', ['monitor', 'monitor', 'siren']],
    7: ['night', ['baby']], 8: ['night', ['baby', 'monitor']], 9: ['day', ['siren']], 10: ['day', ['scalpel']], 11: ['eve', ['pill', 'pill']],
    14: ['day', ['siren']], 15: ['eve', ['monitor']], 16: ['eve', ['siren', 'bandage']],
  };
  const TODAY = 16;
  const START_DOW = 1; // 9/1 = 화 (월=0 기준)

  function Frame({ label, children }) {
    return (
      <div style={{ boxSizing: 'border-box', width: 402, height: 874, background: c.bg, backgroundImage: 'repeating-linear-gradient(transparent 0 27px, rgba(62,54,43,.06) 27px 28px)', borderRadius: 40, overflow: 'hidden', position: 'relative', fontFamily: F }} data-screen-label={label}>
        <div style={{ height: 44, display: 'flex', alignItems: 'center', padding: '0 24px', fontSize: 14, fontWeight: 700, color: c.ink }}>9:41<div style={{ flex: 1 }}/>▮▮▮</div>
        {children}
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 68, background: c.paper, borderTop: '1.5px solid #E0D6C0', display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '0 8px 8px', zIndex: 30 }}>
          {[['home', '홈', true], ['hospital', '일터', false], ['board', '라운지', false], ['lab', '리뷰랩', false], ['me', '나', false]].map((t, i) => (
            <div key={i} style={{ textAlign: 'center', opacity: t[2] ? 1 : .55 }}>
              <div style={{ height: 20 }}><NbIcon name={t[0]} size={19}/></div>
              <div style={{ fontFamily: HW, fontSize: 13, color: c.ink, fontWeight: t[2] ? 700 : 400 }}>{t[1]}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function HomeCal({ call = true, initialSel = null }) {
    const [sel, setSel] = React.useState(initialSel);
    const [ringing, setRinging] = React.useState(call);
    const cells = [];
    for (let i = 0; i < START_DOW; i++) cells.push(null);
    for (let d = 1; d <= 30; d++) cells.push(d);
    const streak = 3;
    const selD = sel && DAYS[sel];

    return (
      <Frame label="수첩 홈 · 달력 + 버튼 하나">
        {/* ① 상단 — 아바타 · 연속 · 호출 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 22px 0' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', overflow: 'hidden', border: `2px solid ${c.ink}`, background: c.paper, flexShrink: 0 }}>
            {window.NbAvatar ? <window.NbAvatar size={48} hair="bob" hairColor="darkbrown" outfit="scrubV" outfitColor="sage"/> : <NbIcon name="me" size={44}/>}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '5px 11px 5px 8px', background: c.paper, border: `1.6px solid ${c.ink}`, borderRadius: 99, transform: 'rotate(-1.5deg)' }}>
            <NbIcon name="fire" size={22}/>
            <span style={{ fontFamily: HW, fontSize: 22, color: c.ink, lineHeight: 1 }}>{streak}</span>
          </div>
          <div style={{ flex: 1 }}/>
          {ringing && (
            <div onClick={() => setRinging(false)} style={{ position: 'relative', width: 46, height: 46, borderRadius: '50%', background: 'rgba(199,81,70,.12)', border: `1.8px solid ${c.red}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <div className="nbh3-ring"><NbIcon name="pager" size={26}/></div>
              <span style={{ position: 'absolute', right: -2, top: -2, width: 13, height: 13, borderRadius: '50%', background: c.red, border: `2px solid ${c.bg}` }}/>
            </div>
          )}
        </div>

        {/* ② 근무 달력 */}
        <div style={{ padding: '18px 20px 0' }}>
          <NbPaper rot={-0.4} tape tapeLeft={150} style={{ padding: '16px 13px 13px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HW, fontSize: 19, color: c.soft, cursor: 'pointer' }}>‹</span>
              <div style={{ flex: 1, textAlign: 'center', fontFamily: HW, fontSize: 24, color: c.ink }}>9월</div>
              <span style={{ width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HW, fontSize: 19, color: c.soft, cursor: 'pointer' }}>›</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 5, marginTop: 8 }}>
              {['월', '화', '수', '목', '금', '토', '일'].map((d, i) => <div key={d} style={{ textAlign: 'center', fontFamily: HW, fontSize: 13, color: i > 4 ? c.red : c.soft, opacity: .8 }}>{d}</div>)}
              {cells.map((d, i) => {
                if (d === null) return <div key={'e' + i}/>;
                const info = DAYS[d], isToday = d === TODAY, isSel = sel === d, future = d > TODAY;
                return (
                  <div key={d} className="nbh3-cell" onClick={() => info && setSel(isSel ? null : d)} style={{ position: 'relative', height: 44, borderRadius: 6, background: info ? SHIFT[info[0]].bg : 'transparent', border: isSel ? `2px solid ${c.ink}` : info ? '1.3px solid rgba(62,54,43,.18)' : '1.3px dashed rgba(62,54,43,.12)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, cursor: info ? 'pointer' : 'default', transform: isSel ? 'rotate(-2deg) scale(1.06)' : 'none', boxShadow: isSel ? '2px 2px 0 rgba(62,54,43,.3)' : 'none', zIndex: isSel ? 2 : 1, opacity: future ? .45 : 1 }}>
                    <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 700, color: info ? c.ink : '#B9AE97', lineHeight: 1 }}>{d}</span>
                    {info && <ShiftGlyph k={info[0]} size={13}/>}
                    {isToday && (
                      <svg viewBox="0 0 50 50" style={{ position: 'absolute', inset: -5, width: 'calc(100% + 10px)', height: 'calc(100% + 10px)', pointerEvents: 'none' }}>
                        <path d="M25 4 C40 4 46 14 46 25 C46 37 37 46 25 46 C12 46 4 37 4 25 C4 13 12 5 27 6" fill="none" stroke={c.red} strokeWidth="2.4" strokeLinecap="round"/>
                      </svg>
                    )}
                  </div>
                );
              })}
            </div>
            {/* 범례 — 글리프만 */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 18, marginTop: 11 }}>
              {['day', 'eve', 'night'].map(k => (
                <div key={k} style={{ width: 26, height: 20, borderRadius: 5, background: SHIFT[k].bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ShiftGlyph k={k} size={14}/></div>
              ))}
            </div>
          </NbPaper>

          {/* 선택한 날 — 도장만 (글자 없이) */}
          <div style={{ minHeight: 64, marginTop: 12 }}>
            {selD && (
              <div key={sel} className="nbh3-pop" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: c.paper, border: `1.5px solid ${c.ink}`, borderRadius: 4, transform: 'rotate(0.4deg)' }}>
                <div style={{ width: 40, height: 40, borderRadius: 6, background: SHIFT[selD[0]].bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontFamily: MONO, fontSize: 12, fontWeight: 700, color: c.ink, lineHeight: 1 }}>{sel}</span>
                  <ShiftGlyph k={selD[0]} size={13}/>
                </div>
                <div style={{ display: 'flex', gap: 7, flex: 1, flexWrap: 'wrap' }}>
                  {selD[1].map((ic, i) => (
                    <div key={i} style={{ position: 'relative', width: 38, height: 38, borderRadius: '50%', border: `2px dashed rgba(95,141,90,.6)`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `rotate(${i % 2 ? 6 : -6}deg)` }}>
                      <NbIcon name={ic} size={22}/>
                      <span style={{ position: 'absolute', right: -4, bottom: -4 }}><NbIcon name="check" size={16}/></span>
                    </div>
                  ))}
                </div>
                <span style={{ fontFamily: HW, fontSize: 22, color: c.green, flexShrink: 0 }}>×{selD[1].length}</span>
              </div>
            )}
          </div>
        </div>

        {/* ③ 버튼 하나 — 이어서 */}
        <div style={{ position: 'absolute', left: 20, right: 20, bottom: 98 }}>
          <div className="nbh3-go" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', background: c.ink, borderRadius: 6, cursor: 'pointer', transform: 'rotate(-0.5deg)' }}>
            {/* 진행 링 + 부서 아이콘 */}
            <div style={{ position: 'relative', width: 58, height: 58, flexShrink: 0 }}>
              <svg viewBox="0 0 58 58" width="58" height="58" style={{ position: 'absolute', inset: 0 }}>
                <circle cx="29" cy="29" r="25" fill={c.paper} stroke="rgba(255,253,244,.25)" strokeWidth="5"/>
                <circle cx="29" cy="29" r="25" fill="none" stroke="#F9E37B" strokeWidth="5" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 25 * 0.62} 999`} transform="rotate(-90 29 29)"/>
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><NbIcon name="siren" size={30}/></div>
            </div>
            <div style={{ display: 'flex', gap: 5, flex: 1 }}>
              {[1, 1, 1, 0, 0].map((f, i) => <span key={i} style={{ flex: 1, height: 9, borderRadius: 3, background: f ? '#F9E37B' : 'rgba(255,253,244,.22)', transform: `rotate(${i % 2 ? 2 : -2}deg)` }}/>)}
            </div>
            <div style={{ width: 54, height: 54, borderRadius: '50%', background: '#F9E37B', border: `2px solid ${c.paper}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg viewBox="0 0 24 24" width="26" height="26"><path d="M8.5 5.5 L18.5 12 L8.5 18.5 Z" fill={c.ink} stroke={c.ink} strokeWidth="2" strokeLinejoin="round"/></svg>
            </div>
          </div>
        </div>
      </Frame>
    );
  }

  Object.assign(window, { HomeCal });
})();
