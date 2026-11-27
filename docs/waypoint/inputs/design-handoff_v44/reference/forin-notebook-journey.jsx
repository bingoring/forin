// forin-notebook-journey.jsx — 일터 커리큘럼 '여정 지도' 뷰 (근무 수첩)
// 여권·도장 세계관 연장: 구불구불한 점선 경로 위에 정거장 — 완료는 도장이 찍히고,
// 현재 위치는 HERE 깃발, 앞은 옅은 빈 원. NCLEX 마일스톤 깃발이 구간 사이에.
(function () {
  const { NbPaper, NbButton, NbTag, NbMark, NbMemo, NbCheck, NbProgSquares } = window.NbUI;
  const NbIcon = window.NbIcon;
  const HW = '"Gaegu","Nanum Pen Script",cursive';
  const F = '"Pretendard",sans-serif';
  const MONO = '"IBM Plex Mono",monospace';
  const c = { bg: '#F1EBDD', paper: '#FFFdf4', ink: '#3E362B', soft: '#9A8F7C', red: '#C75146', blue: '#4A6FA5', green: '#5F8D5A', amber: '#C77E2E' };

  if (!document.getElementById('nbj-css')) {
    const st = document.createElement('style');
    st.id = 'nbj-css';
    st.textContent = `
@keyframes nbj-draw{to{stroke-dashoffset:0}}
@keyframes nbj-stamp{0%{transform:scale(2.2) rotate(-24deg);opacity:0}55%{transform:scale(.9) rotate(-10deg);opacity:1}75%{transform:scale(1.06) rotate(-13deg)}100%{transform:scale(1) rotate(-12deg);opacity:1}}
@keyframes nbj-flag{0%,100%{transform:rotate(0)}50%{transform:rotate(6deg)}}
@keyframes nbj-ring{0%,100%{opacity:.9}50%{opacity:.35}}
@keyframes nbj-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
@keyframes nbj-node-in{0%{transform:scale(0);opacity:0}70%{transform:scale(1.12)}100%{transform:scale(1);opacity:1}}
@keyframes nbj-press{0%{transform:scale(1)}40%{transform:scale(.92)}100%{transform:scale(1)}}
.nbj-press{animation:nbj-press .25s ease-out}
`;
    document.head.appendChild(st);
  }

  function Frame({ label, children }) {
    return (
      <div style={{ boxSizing: 'border-box', width: 402, height: 874, background: c.bg, backgroundImage: 'repeating-linear-gradient(transparent 0 27px, rgba(62,54,43,.06) 27px 28px)', borderRadius: 40, overflow: 'hidden', position: 'relative', fontFamily: F }} data-screen-label={label}>
        <div style={{ height: 44, display: 'flex', alignItems: 'center', padding: '0 24px', fontSize: 14, fontWeight: 700, color: c.ink }}>9:41<div style={{ flex: 1 }}/>▮▮▮</div>
        {children}
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 68, background: c.paper, borderTop: `1.5px solid #E0D6C0`, display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '0 8px 8px', zIndex: 30 }}>
          {[['home','홈',false],['hospital','일터',true],['board','라운지',false],['lab','리뷰랩',false],['me','나',false]].map((t, i) => (
            <div key={i} style={{ textAlign: 'center', opacity: t[2] ? 1 : .55 }}>
              <div style={{ height: 20 }}><NbIcon name={t[0]} size={19}/></div>
              <div style={{ fontFamily: HW, fontSize: 13, color: c.ink, fontWeight: t[2] ? 700 : 400 }}>{t[1]}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 정거장: done(도장) / here / next(열림) / locked
  function Station({ x, y, state, label, sub, icon, flip, idx = 0, onTap, justStamped }) {
    const [pressed, setPressed] = React.useState(false);
    const tap = () => { setPressed(true); setTimeout(() => setPressed(false), 260); onTap && onTap(); };
    return (
      <g transform={`translate(${x},${y})`} onClick={tap} style={{ cursor: 'pointer' }}>
        <g className={pressed ? 'nbj-press' : ''} style={{ transformOrigin: '0 0', transformBox: 'fill-box' }}>
        <g style={{ animation: `nbj-node-in .45s cubic-bezier(.3,.7,.4,1.2) both`, animationDelay: `${idx * 0.09}s`, transformOrigin: '0 0', transformBox: 'fill-box' }}>
        {state === 'done' && (
          <g transform="rotate(-12)" style={justStamped ? { animation: 'nbj-stamp .5s ease-out both', animationDelay: `${idx * 0.09 + 0.2}s`, transformOrigin: '0 0', transformBox: 'fill-box' } : {}}>
            <circle r="24" fill="rgba(241,235,221,.9)" stroke={c.green} strokeWidth="2.6"/>
            <circle r="19" fill="none" stroke={c.green} strokeWidth="1.1"/>
            <text y="-2" textAnchor="middle" fontFamily='"IBM Plex Mono",monospace' fontSize="6.5" fontWeight="700" fill={c.green}>PASSED</text>
            <text y="11" textAnchor="middle" fontFamily='"Gaegu",cursive' fontSize="12" fill={c.green}>{label}</text>
          </g>
        )}
        {state === 'here' && (
          <g>
            <circle r="30" fill="#FFFdf4" stroke={c.ink} strokeWidth="2.2"/>
            <circle r="30" fill="none" stroke={c.amber} strokeWidth="2.2" strokeDasharray="5 4" style={{ animation: 'nbj-ring 1.6s ease-in-out infinite' }}/>
            <text y="4.5" textAnchor="middle" fontFamily='"Gaegu",cursive' fontSize="13.5" fill={c.ink}>{label}</text>
            <g transform="translate(12,-48)" style={{ animation: 'nbj-bob 2.2s ease-in-out infinite' }}>
              <path d="M0 0 V22" stroke={c.ink} strokeWidth="2"/>
              <path d="M0 1 L17 5.5 L0 10 Z" fill={c.red} stroke={c.ink} strokeWidth="1.3" style={{ animation: 'nbj-flag 2.2s ease-in-out infinite', transformOrigin: '0 5px', transformBox: 'fill-box' }}/>
              <text x="-4" y="-4" textAnchor="middle" fontFamily='"IBM Plex Mono",monospace' fontSize="7.5" fontWeight="700" fill={c.red}>HERE</text>
            </g>
          </g>
        )}
        {state === 'next' && (
          <g>
            <circle r="26" fill="#FFFdf4" stroke={c.ink} strokeWidth="1.8"/>
            <text y="4" textAnchor="middle" fontFamily='"Gaegu",cursive' fontSize="12.5" fill={c.ink}>{label}</text>
          </g>
        )}
        {state === 'locked' && (
          <g opacity=".45">
            <circle r="25" fill="none" stroke={c.soft} strokeWidth="1.6" strokeDasharray="4 3"/>
            <text y="4" textAnchor="middle" fontFamily='"Gaegu",cursive' fontSize="11.5" fill={c.soft}>{label}</text>
          </g>
        )}
        </g>
        </g>
      </g>
    );
  }

  // ── A · 여정 지도 (내 트랙 중심) ──
  // 구조: 공통 필수 → 목표 부서(ER) 심화가 메인 경로. 타 부서는 '협업 정거장'
  // (내 부서 시점의 상황: ER→ICU 인계 등)으로 경로에 등장. 나머지는 자유 탐방.
  function JourneyMap() {
    const [sheet, setSheet] = React.useState(null);   // 탭한 정거장 라벨
    const [stampDemo, setStampDemo] = React.useState(false); // '중증 응대' 통과 데모
    const P = [
      [80, 56, 'done', '기본기', { sub: '공통 필수' }],
      [232, 108, 'done', '인계', { sub: '공통 필수' }],
      [92, 176, 'done', '트리아지', { sub: 'ER' }],
      [252, 238, 'here', '중증 응대', { sub: 'ER' }],
      [110, 316, 'next', 'ICU 인계', { collab: 'ER → ICU' }],
      [262, 380, 'locked', '약국 전화', { collab: 'ER → 약국' }],
      [122, 452, 'locked', '심폐소생', { sub: 'ER' }],
      [258, 514, 'locked', 'OR 이송', { collab: 'ER → OR' }],
    ];
    const path = `M ${P[0][0]} ${P[0][1]} ` + P.slice(1).map((p, i) => {
      const prev = P[i];
      return `Q ${(prev[0] + p[0]) / 2} ${prev[1] + 14} ${p[0]} ${p[1]}`;
    }).join(' ');
    const donePath = `M ${P[0][0]} ${P[0][1]} ` + P.slice(1, 4).map((p, i) => {
      const prev = P[i];
      return `Q ${(prev[0] + p[0]) / 2} ${prev[1] + 14} ${p[0]} ${p[1]}`;
    }).join(' ');
    return (
      <Frame label="일터 · 여정 지도 (ER 트랙)">
        <div style={{ display: 'flex', alignItems: 'baseline', padding: '8px 22px 0' }}>
          <span style={{ fontFamily: HW, fontSize: 28, color: c.ink }}>나의 여정</span>
          <div style={{ flex: 1 }}/>
          <span style={{ fontFamily: HW, fontSize: 13.5, color: c.soft }}>목표 부서 기준</span>
        </div>
        <div style={{ display: 'flex', gap: 8, padding: '8px 22px 0', alignItems: 'center' }}>
          <NbTag color={c.red} rot={-1}><NbIcon name="siren" size={12}/> ER 트랙</NbTag>
          <NbTag color={c.green} rot={1}>도장 3</NbTag>
          <div style={{ flex: 1 }}/>
          <span style={{ fontFamily: HW, fontSize: 12.5, color: c.soft, textDecoration: 'underline', textUnderlineOffset: 3 }}>트랙 변경</span>
        </div>
        <div style={{ position: 'absolute', top: 128, left: 0, right: 0, bottom: 78, overflowY: 'auto' }}>
          <svg viewBox="0 0 402 560" width="402" height="560" style={{ display: 'block' }}>
            <path d={path} fill="none" stroke="rgba(62,54,43,.28)" strokeWidth="2.2" strokeDasharray="7 7"/>
            <path d={donePath} fill="none" stroke={c.green} strokeWidth="2.6" pathLength="100" strokeDasharray="100" strokeDashoffset="100" style={{ animation: 'nbj-draw 1.1s ease-out .15s both' }}/>
            <text x={P[0][0] - 36} y={P[0][1] - 30} fontFamily='"IBM Plex Mono",monospace' fontSize="8" fontWeight="700" fill={c.soft} letterSpacing="1.5">DAY 1 · 입국</text>
            {/* NCLEX 마일스톤 */}
            <g transform="translate(322, 168) rotate(3)">
              <rect x="-6" y="-13" width="80" height="34" fill="#FFFdf4" stroke="#E0D6C0"/>
              <text x="33" y="1" textAnchor="middle" fontFamily='"IBM Plex Mono",monospace' fontSize="8" fontWeight="700" fill={c.blue}>NCLEX 1차</text>
              <text x="33" y="14" textAnchor="middle" fontFamily='"Gaegu",cursive' fontSize="11" fill={c.green}>모의 통과 ✓</text>
            </g>
            {P.map((p, i) => {
              const state = stampDemo && p[3] === '중증 응대' ? 'done' : p[2];
              return (
              <g key={i}>
                <Station x={p[0]} y={p[1]} state={state} label={p[3]} idx={i} justStamped={stampDemo && p[3] === '중증 응대'} onTap={() => setSheet(p[3])}/>
                {/* 협업 정거장: 파란 점선 링 + 시점 라벨 */}
                {p[4].collab && (
                  <g transform={`translate(${p[0]},${p[1]})`}>
                    <circle r={p[2] === 'here' ? 36 : 32} fill="none" stroke={c.blue} strokeWidth="1.4" strokeDasharray="3 3"/>
                    <g transform="translate(0,-44)">
                      <rect x="-40" y="-11" width="80" height="16" fill="rgba(74,111,165,.1)" stroke={c.blue} strokeWidth="1" transform="rotate(-2)"/>
                      <text y="1" textAnchor="middle" fontFamily='"IBM Plex Mono",monospace' fontSize="8" fontWeight="700" fill={c.blue} transform="rotate(-2)">협업 · {p[4].collab}</text>
                    </g>
                  </g>
                )}
                {p[4].sub === '공통 필수' && (
                  <text x={p[0]} y={p[1] + 40} textAnchor="middle" fontFamily='"Gaegu",cursive' fontSize="10.5" fill={c.soft}>공통 필수</text>
                )}
              </g>
            );})}
          </svg>
          {/* 자유 탐방 — 잠금 없는 출장 */}
          <div style={{ padding: '2px 20px 96px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontFamily: HW, fontSize: 17, color: c.ink }}>자유 탐방 ✈</span>
              <span style={{ fontSize: 10.5, color: c.soft }}>잠금 없음 — 언제든 다른 부서로 출장</span>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 9, overflowX: 'auto', paddingBottom: 4 }}>
              {[['baby', '분만실', 2], ['monitor', 'ICU', 0], ['pill', '약국', 1], ['bandage', '외과', 0], ['me', '정신과', 0]].map((d, i) => (
                <NbPaper key={i} rot={i % 2 ? 0.8 : -0.8} style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
                  <NbIcon name={d[0]} size={17}/>
                  <span style={{ fontFamily: HW, fontSize: 14, color: c.ink, whiteSpace: 'nowrap' }}>{d[1]}</span>
                  {d[2] > 0 && <span style={{ fontFamily: MONO, fontSize: 9, fontWeight: 700, color: c.green, whiteSpace: 'nowrap' }}>도장 {d[2]}</span>}
                </NbPaper>
              ))}
            </div>
          </div>
        </div>
        <div style={{ position: 'absolute', left: 16, right: 16, bottom: 82 }}>
          <NbPaper rot={-0.3} style={{ padding: '11px 13px', display: 'flex', alignItems: 'center', gap: 11 }}>
            <NbIcon name="siren" size={22}/>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontFamily: HW, fontSize: 16.5, color: c.ink, lineHeight: 1.1 }}>ER · 중증 응대</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
                <NbProgSquares total={5} done={2} size={9}/>
                <span style={{ fontSize: 10, color: c.soft, whiteSpace: 'nowrap' }}>2/5 · 다음: 흉통 환자 사정</span>
              </div>
            </div>
            <div onClick={() => setStampDemo(!stampDemo)}><NbButton variant="ink" size="sm">{stampDemo ? '↺ 되돌리기' : '통과 데모 ✓'}</NbButton></div>
          </NbPaper>
        </div>
        {/* 정거장 탭 미니 시트 */}
        {sheet && (
          <div onClick={() => setSheet(null)} style={{ position: 'absolute', left: 16, right: 16, bottom: 152, zIndex: 20 }}>
            <NbPaper rot={-0.5} tape tapeLeft={120} style={{ padding: '11px 13px', display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 6px 16px rgba(62,54,43,.25)' }}>
              <NbIcon name="pushpin" size={16}/>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontFamily: HW, fontSize: 16, color: c.ink, lineHeight: 1.1 }}>{sheet} 정거장</div>
                <div style={{ fontSize: 10.5, color: c.soft, marginTop: 2 }}>탭하면 상세 바텀시트(B 아트보드)로 열려요 — 닫으려면 탭</div>
              </div>
              <NbButton variant="paper" size="sm">열기 ›</NbButton>
            </NbPaper>
          </div>
        )}
      </Frame>
    );
  }

  // ── B · 정거장 상세 바텀시트 ──
  function StationSheet() {
    const steps = [
      ['대화', 'speech', '중환자 가족 응대', 'done'],
      ['퀴즈', 'pencil', '벤트 알람 대응', 'done'],
      ['대화', 'speech', 'SBAR 야간 보고', 'here'],
      ['퀴즈', 'pencil', '승압제 적정', 'next'],
      ['시험', 'trophy', 'ICU 구간 통과전', 'locked'],
    ];
    return (
      <Frame label="일터 · 정거장 상세">
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(62,54,43,.3)' }}/>
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, background: c.bg, borderTop: `2px solid ${c.ink}`, borderRadius: '22px 22px 0 0', padding: '10px 20px 84px', backgroundImage: 'repeating-linear-gradient(transparent 0 27px, rgba(62,54,43,.05) 27px 28px)' }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(62,54,43,.3)', margin: '0 auto' }}/>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12 }}>
            <div style={{ width: 46, height: 46, borderRadius: '50%', border: `2.2px solid ${c.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', background: c.paper, flexShrink: 0 }}>
              <NbIcon name="monitor" size={24}/>
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontFamily: HW, fontSize: 21, color: c.ink, lineHeight: 1.1 }}>ICU 정거장</div>
              <div style={{ fontSize: 10.5, color: c.soft, marginTop: 2 }}>구간 통과 시 여정 지도에 도장이 찍혀요</div>
            </div>
            <NbTag color={c.amber} rot={2}>2/5</NbTag>
          </div>
          {steps.map((s, i) => (
            <NbPaper key={i} rot={i % 2 ? 0.4 : -0.4} style={{ marginTop: 10, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10, opacity: s[3] === 'locked' ? .5 : 1, ...(s[3] === 'here' ? { boxShadow: `0 2px 6px rgba(62,54,43,.14), 0 0 0 2.2px #E9C45A` } : {}) }}>
              <NbIcon name={s[1]} size={18}/>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: c.ink, textDecoration: s[3] === 'done' ? 'line-through' : 'none', textDecorationColor: c.green }}>{s[2]}</div>
                <div style={{ fontFamily: HW, fontSize: 11.5, color: c.soft }}>{s[0]}</div>
              </div>
              {s[3] === 'done' && <span style={{ fontFamily: HW, fontSize: 14, color: c.green }}>통과 ✓</span>}
              {s[3] === 'here' && <NbButton variant="ink" size="sm">시작 ›</NbButton>}
              {s[3] === 'next' && <span style={{ fontFamily: HW, fontSize: 13, color: c.soft }}>다음</span>}
              {s[3] === 'locked' && <NbIcon name="lock" size={15}/>}
            </NbPaper>
          ))}
          <div style={{ marginTop: 12 }}>
            <NbMemo rot={0.3} color={c.blue}><b style={{ color: c.blue }}>통과전</b> 구간 시험을 통과하면 PASSED 도장 + OR 정거장이 열려요.</NbMemo>
          </div>
        </div>
      </Frame>
    );
  }

  // ── C · 면허 로드맵 (국가 트랙 오버레이) ──
  function LicenseTrack() {
    const rows = [
      ['서류 준비', 'CGFNS 평가 · 영문 성적표', 'done', '3월'],
      ['NCLEX-RN 1차 모의', '합격선 도달', 'done', '5월'],
      ['영어 요건', 'OET B등급 (스피킹 집중)', 'here', '진행 중'],
      ['NCLEX-RN 본시험', 'Pearson VUE 예약', 'next', '예정'],
      ['취업 비자', '스폰서 병원 매칭', 'locked', '—'],
    ];
    const col = { done: c.green, here: c.amber, next: c.blue, locked: c.soft };
    return (
      <Frame label="일터 · 면허 로드맵">
        <div style={{ display: 'flex', alignItems: 'baseline', padding: '8px 22px 0' }}>
          <span style={{ fontFamily: HW, fontSize: 28, color: c.ink }}>면허 로드맵</span>
          <div style={{ flex: 1 }}/>
          <NbTag color={c.blue} rot={1}>🇺🇸 미국 · RN</NbTag>
        </div>
        <div style={{ padding: '4px 22px 0', fontSize: 11, color: c.soft }}>여정 지도의 마일스톤 깃발과 연동 — 학습 진행이 요건을 채워요</div>
        <div style={{ position: 'absolute', top: 118, left: 0, right: 0, bottom: 78, overflowY: 'auto', padding: '6px 22px 20px' }}>
          {rows.map((r, i) => (
            <div key={i} style={{ display: 'flex', gap: 12 }}>
              {/* 타임라인 축 */}
              <div style={{ width: 26, display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px ${r[2] === 'done' ? 'double' : 'solid'} ${col[r[2]]}`, background: r[2] === 'here' ? 'rgba(199,126,46,.12)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HW, fontSize: 11, color: col[r[2]], marginTop: 4 }}>{r[2] === 'done' ? '✓' : i + 1}</div>
                {i < rows.length - 1 && <div style={{ flex: 1, borderLeft: `1.6px dashed ${r[2] === 'done' ? c.green : 'rgba(62,54,43,.25)'}`, margin: '3px 0' }}/>}
              </div>
              <NbPaper rot={i % 2 ? 0.4 : -0.4} style={{ flex: 1, padding: '11px 13px', marginBottom: 12, opacity: r[2] === 'locked' ? .55 : 1, ...(r[2] === 'here' ? { boxShadow: `0 2px 6px rgba(62,54,43,.14), 0 0 0 2.2px #E9C45A` } : {}) }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: HW, fontSize: 17, color: c.ink }}>{r[0]}</span>
                  <div style={{ flex: 1 }}/>
                  <span style={{ fontFamily: MONO, fontSize: 10, fontWeight: 700, color: col[r[2]], whiteSpace: 'nowrap' }}>{r[3]}</span>
                </div>
                <div style={{ fontSize: 11.5, color: c.soft, marginTop: 3 }}>{r[1]}</div>
                {r[2] === 'here' && (
                  <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <NbProgSquares total={6} done={4} size={9}/>
                    <span style={{ fontSize: 10, color: c.soft }}>스피킹 4/6 — 발음 연습이 여기에 반영돼요</span>
                  </div>
                )}
              </NbPaper>
            </div>
          ))}
          <NbMemo rot={-0.3} color={c.green}><b style={{ color: c.green }}>연동</b> ICU 구간을 통과하면 'NCLEX 본시험' 준비도가 +8% 올라가요.</NbMemo>
        </div>
      </Frame>
    );
  }

  Object.assign(window, { JourneyMap, StationSheet, LicenseTrack });
})();
