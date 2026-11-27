// forin-notebook-journey2.jsx — 여정 지도 확장: 우표 정거장(귀여운 대안) + 부서→주제→상황 3뎁스
// 은유: 차트 바인더(부서) → 인덱스 간지(주제) → 우표 앨범(상황 30~40개) + 빨간 실이 완료 우표를 꿰어 현재 위치까지
(function () {
  const { NbPaper, NbButton, NbTag, NbMark, NbMemo, NbCheck } = window.NbUI;
  const NbIcon = window.NbIcon;
  const HW = '"Gaegu","Nanum Pen Script",cursive';
  const F = '"Pretendard",sans-serif';
  const MONO = '"IBM Plex Mono",monospace';
  const c = { bg: '#F1EBDD', paper: '#FFFdf4', ink: '#3E362B', soft: '#9A8F7C', red: '#C75146', blue: '#4A6FA5', green: '#5F8D5A', amber: '#C77E2E', yarn: '#D3574B' };

  if (!document.getElementById('nbj2-css')) {
    const st = document.createElement('style'); st.id = 'nbj2-css';
    st.textContent = `
@keyframes nbj2-draw{to{stroke-dashoffset:0}}
@keyframes nbj2-pop{0%{transform:scale(0) rotate(-12deg);opacity:0}70%{transform:scale(1.1) rotate(2deg)}100%{transform:scale(1) rotate(0);opacity:1}}
@keyframes nbj2-wig{0%,100%{transform:rotate(-3deg)}50%{transform:rotate(3deg)}}
@keyframes nbj2-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
@keyframes nbj2-ring{0%,100%{opacity:.95}50%{opacity:.3}}
@keyframes nbj2-fly-in{0%{transform:translate(var(--fx),var(--fy)) scale(.22) rotate(var(--fr));opacity:.9}55%{transform:translate(0,0) scale(1.03) rotate(0);opacity:1}100%{transform:translate(0,0) scale(1) rotate(0);opacity:1}}
@keyframes nbj2-fly-out{0%{transform:translate(0,0) scale(1) rotate(0);opacity:1}100%{transform:translate(var(--fx),var(--fy)) scale(.22) rotate(var(--fr));opacity:.85}}
@keyframes nbj2-open{0%{transform:scaleX(1) skewY(0);filter:brightness(1)}60%{filter:brightness(.82)}100%{transform:scaleX(0.02) skewY(-6deg);filter:brightness(.7)}}
@keyframes nbj2-close{0%{transform:scaleX(0.02) skewY(-6deg);filter:brightness(.7)}100%{transform:scaleX(1) skewY(0);filter:brightness(1)}}
@keyframes nbj2-fade{from{opacity:0}to{opacity:1}}
.nbj2-cover{position:absolute;inset:0;transform-origin:left center;z-index:3;box-shadow:6px 0 18px rgba(62,54,43,.25);will-change:transform}
`;
    document.head.appendChild(st);
  }

  function Frame({ label, children, nav = true }) {
    return (
      <div style={{ boxSizing: 'border-box', width: 402, height: 874, background: c.bg, backgroundImage: 'repeating-linear-gradient(transparent 0 27px, rgba(62,54,43,.06) 27px 28px)', borderRadius: 40, overflow: 'hidden', position: 'relative', fontFamily: F }} data-screen-label={label}>
        <div style={{ height: 44, display: 'flex', alignItems: 'center', padding: '0 24px', fontSize: 14, fontWeight: 700, color: c.ink }}>9:41<div style={{ flex: 1 }}/>▮▮▮</div>
        {children}
        {nav && <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 68, background: c.paper, borderTop: `1.5px solid #E0D6C0`, display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '0 8px 8px', zIndex: 30 }}>
          {[['home','홈',false],['hospital','일터',true],['board','라운지',false],['lab','리뷰랩',false],['me','나',false]].map((t, i) => (
            <div key={i} style={{ textAlign: 'center', opacity: t[2] ? 1 : .55 }}>
              <div style={{ height: 20 }}><NbIcon name={t[0]} size={19}/></div>
              <div style={{ fontFamily: HW, fontSize: 13, color: c.ink, fontWeight: t[2] ? 700 : 400 }}>{t[1]}</div>
            </div>
          ))}
        </div>}
      </div>
    );
  }

  // ── 우표(postage stamp) 노드 — 톱니 테두리 + 상태별 잉크 ──
  // state: done | here | next | locked
  function Stamp({ size = 62, state, icon, n, wash, rot = 0, delay = 0 }) {
    const tooth = 6, teeth = Math.round(size / tooth);
    const dots = [];
    for (let i = 0; i < teeth; i++) {
      const p = i * tooth + tooth / 2;
      dots.push([p, 0], [p, size], [0, p], [size, p]);
    }
    const dim = state === 'locked';
    const fill = state === 'done' ? (wash || 'rgba(95,141,90,.16)') : state === 'here' ? 'rgba(233,196,90,.28)' : c.paper;
    return (
      <div style={{ width: size, height: size, position: 'relative', transform: `rotate(${rot}deg)`, animation: `nbj2-pop .4s cubic-bezier(.3,.7,.4,1.2) both`, animationDelay: delay + 's', opacity: dim ? .5 : 1 }}>
        <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} style={{ position: 'absolute', inset: 0 }}>
          <rect x="1" y="1" width={size - 2} height={size - 2} fill={fill} stroke={state === 'here' ? c.amber : dim ? c.soft : c.ink} strokeWidth={state === 'here' ? 2 : 1.4} strokeDasharray={dim ? '3 3' : 'none'}/>
          {dots.map((d, i) => <circle key={i} cx={d[0]} cy={d[1]} r="2.6" fill={c.bg}/>)}
          <rect x="7" y="7" width={size - 14} height={size - 14} fill="none" stroke={dim ? 'rgba(62,54,43,.25)' : 'rgba(62,54,43,.35)'} strokeWidth="1" strokeDasharray="2 2"/>
          <text x={size - 9} y="15" textAnchor="end" fontFamily='"IBM Plex Mono",monospace' fontSize="7.5" fontWeight="700" fill={dim ? c.soft : c.ink}>{String(n).padStart(2, '0')}</text>
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 4 }}>
          {state === 'locked' ? <NbIcon name="lock" size={size * .3} color={c.soft}/> : <NbIcon name={icon} size={size * .38}/>}
        </div>
        {state === 'done' && (
          <div style={{ position: 'absolute', right: -6, bottom: -6, width: 24, height: 24, borderRadius: '50%', border: `2px double ${c.green}`, background: 'rgba(241,235,221,.85)', color: c.green, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HW, fontSize: 13, transform: 'rotate(-14deg)' }}>✓</div>
        )}
        {state === 'here' && (
          <div style={{ position: 'absolute', left: '50%', top: -30, transform: 'translateX(-50%)', animation: 'nbj2-bob 2s ease-in-out infinite' }}>
            <svg viewBox="0 0 26 30" width="26" height="30">
              <path d="M6 2 V29" stroke={c.ink} strokeWidth="1.8"/>
              <path d="M6 3 L22 8 L6 13 Z" fill={c.red} stroke={c.ink} strokeWidth="1.3" style={{ animation: 'nbj2-wig 2s ease-in-out infinite', transformOrigin: '6px 8px' }}/>
            </svg>
          </div>
        )}
      </div>
    );
  }

  // 빨간 실 — 점 배열을 살짝 흔들리는 곡선으로 잇고 각 점에 핀
  function Yarn({ pts, endPin = true, delay = 0.2 }) {
    if (pts.length < 2) return null;
    let d = `M${pts[0][0]} ${pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) {
      const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
      const mx = (x0 + x1) / 2 + (i % 2 ? 7 : -7), my = (y0 + y1) / 2 + (i % 2 ? -5 : 6);
      d += ` Q${mx} ${my} ${x1} ${y1}`;
    }
    return (
      <g>
        <path d={d} fill="none" stroke={c.yarn} strokeWidth="2.2" strokeLinecap="round" pathLength="100" strokeDasharray="100" strokeDashoffset="100" style={{ animation: `nbj2-draw 1.4s ease-out ${delay}s both` }}/>
        <path d={d} fill="none" stroke="rgba(255,255,255,.55)" strokeWidth=".7" strokeDasharray="3 5" pathLength="100" strokeDashoffset="100" style={{ animation: `nbj2-draw 1.4s ease-out ${delay}s both` }}/>
        {pts.map((p, i) => (i < pts.length - 1 || endPin) && (
          <g key={i} transform={`translate(${p[0]},${p[1]})`}>
            <circle r="4.2" fill={i === pts.length - 1 ? c.amber : c.red} stroke={c.ink} strokeWidth="1.2"/>
            <circle cx="-1.2" cy="-1.2" r="1.2" fill="rgba(255,255,255,.7)"/>
          </g>
        ))}
      </g>
    );
  }

  // ══ D · 정거장 대안 — 우표 & 빨간 실 (기존 A의 귀여운 버전) ══
  function JourneyStampsAlt() {
    const P = [
      [70, 80, 'done', 'DAY 1 입국', 'compass', 'rgba(74,111,165,.16)'],
      [200, 130, 'done', '첫 인사·소개', 'speech', 'rgba(95,141,90,.16)'],
      [318, 92, 'done', '병원 지도', 'hospital', 'rgba(233,150,100,.18)'],
      [300, 232, 'done', '통증 사정', 'bandage', 'rgba(95,141,90,.16)'],
      [160, 262, 'here', '중증 응대', 'siren'],
      [64, 372, 'next', 'ICU 인계', 'monitor'],
      [212, 400, 'locked', '약국 콜백', 'pill'],
      [330, 372, 'locked', '외과 라운딩', 'scalpel'],
      [250, 520, 'locked', '분만실 협업', 'baby'],
      [96, 540, 'locked', '면허 시험', 'trophy'],
    ];
    const donePts = P.filter(p => p[2] === 'done' || p[2] === 'here').map(p => [p[0], p[1]]);
    return (
      <Frame label="여정 · 우표 정거장 (대안)">
        <div style={{ display: 'flex', alignItems: 'baseline', padding: '8px 22px 0' }}>
          <span style={{ fontFamily: HW, fontSize: 28, color: c.ink }}>나의 여정</span>
          <div style={{ flex: 1 }}/>
          <NbTag color={c.green} rot={1}>우표 4 / 10</NbTag>
        </div>
        <div style={{ position: 'absolute', top: 96, left: 0, right: 0, bottom: 150, overflow: 'hidden' }}>
          {/* 낙서 장식 */}
          <svg viewBox="0 0 402 620" width="402" height="620" style={{ position: 'absolute', inset: 0 }}>
            <g fill="none" stroke="rgba(62,54,43,.22)" strokeWidth="1.3" strokeLinecap="round">
              <path d="M330 30 q6 -10 14 -2 q8 -8 14 2 q8 2 2 8 h-28 q-6 -4 -2 -8"/>
              <path d="M22 200 q4 -8 10 -2 q6 -6 10 1 q6 1 1 6 h-20 q-4 -3 -1 -5"/>
              <path d="M355 470 l4 -8 l4 8 M359 462 v-5"/>
              <path d="M40 470 h10 M45 465 v10"/>
              <circle cx="372" cy="300" r="3"/><circle cx="386" cy="292" r="1.6"/>
            </g>
            <Yarn pts={donePts}/>
            {/* 다음 예정 — 연필 점선 */}
            <path d="M160 262 Q120 300 64 372" fill="none" stroke="rgba(62,54,43,.35)" strokeWidth="1.6" strokeDasharray="4 5"/>
            <path d="M64 372 Q140 400 212 400 Q280 400 330 372" fill="none" stroke="rgba(62,54,43,.22)" strokeWidth="1.4" strokeDasharray="4 5"/>
            <path d="M330 372 Q300 480 250 520 Q170 560 96 540" fill="none" stroke="rgba(62,54,43,.18)" strokeWidth="1.4" strokeDasharray="4 5"/>
          </svg>
          {P.map((p, i) => (
            <div key={i} style={{ position: 'absolute', left: p[0] - 31, top: p[1] - 31 }}>
              <Stamp state={p[2]} icon={p[4]} n={i + 1} wash={p[5]} rot={[-4, 3, -2, 5, -3, 4, -5, 2, -3, 4][i]} delay={i * 0.08}/>
              <div style={{ position: 'absolute', left: '50%', top: 66, transform: 'translateX(-50%)', whiteSpace: 'nowrap', fontFamily: HW, fontSize: 12.5, color: p[2] === 'locked' ? c.soft : c.ink, background: 'rgba(241,235,221,.85)', padding: '0 4px' }}>{p[3]}</div>
            </div>
          ))}
        </div>
        <div style={{ position: 'absolute', left: 16, right: 16, bottom: 82 }}>
          <NbPaper rot={-0.4} tape tapeLeft={130} style={{ padding: '10px 13px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <NbIcon name="siren" size={22}/>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontFamily: HW, fontSize: 16, color: c.ink, lineHeight: 1.1 }}>중증 응대 — 5번째 우표</div>
              <div style={{ fontSize: 10.5, color: c.soft, marginTop: 2 }}>빨간 실이 여기까지 왔어요 · 상황 3개 남음</div>
            </div>
            <NbButton variant="ink" size="sm">이어서 ›</NbButton>
          </NbPaper>
        </div>
      </Frame>
    );
  }

  // ══ E · 부서 → 주제 : 차트 바인더 + 인덱스 간지 ══
  function TopicBinder({ onBack, nav }) {
    const topics = [
      { t: '투약 안전 · 오류 예방', n: 34, d: 34, state: 'done', col: c.green, icon: 'pill' },
      { t: '약제부 인계 · SBAR · 콜백', n: 36, d: 12, state: 'here', col: c.amber, icon: 'speech' },
      { t: '고위험 약물 이중 확인', n: 32, d: 0, state: 'next', col: c.blue, icon: 'shield' },
      { t: '마약류 관리 · 폐기 입회', n: 30, d: 0, state: 'locked', col: c.soft, icon: 'lock' },
      { t: '환자 교육 · 복약 상담', n: 38, d: 0, state: 'locked', col: c.soft, icon: 'bulb' },
    ];
    const total = topics.reduce((a, t) => a + t.n, 0), done = topics.reduce((a, t) => a + t.d, 0);
    return (
      <Frame label="여정 · 부서 → 주제 (차트 바인더)" nav={nav !== undefined ? nav : !onBack}>
        {/* 부서 헤더 — 바인더 표지 라벨 */}
        <div style={{ padding: '6px 22px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span onClick={onBack} style={{ fontFamily: HW, fontSize: 14, color: c.soft, cursor: 'pointer' }}>‹ 서가</span>
          <div style={{ flex: 1 }}/>
          <NbTag color={c.blue} rot={1}>약국 · Pharmacy</NbTag>
        </div>
        <div style={{ margin: '10px 22px 0', display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ width: 54, height: 54, border: `1.6px solid ${c.ink}`, background: c.paper, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-3deg)', boxShadow: '2px 2px 0 rgba(62,54,43,.18)' }}><NbIcon name="pill" size={30}/></div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontFamily: HW, fontSize: 25, color: c.ink, lineHeight: 1.1 }}>약국 차트 바인더</div>
            <div style={{ fontSize: 11, color: c.soft, marginTop: 3 }}>주제 35 · 상황 1,180 · 우표 <b style={{ color: c.green }}>{done + 470}</b> 모음</div>
          </div>
        </div>
        {/* 부서 진행 — 주제 수가 35개까지 늘어나도 읽히는 3구간 잉크 게이지 (완료 / 진행중 / 남음) */}
        {(() => {
          const TOP = 35, doneT = 14, curT = 3; // 실제 데이터에선 주제 상태 집계
          const pct = (n) => (n / TOP * 100) + '%';
          return (
            <div style={{ margin: '10px 22px 0' }}>
              <div style={{ height: 9, border: `1.4px solid ${c.ink}`, borderRadius: 3, overflow: 'hidden', display: 'flex', position: 'relative' }}>
                <div style={{ width: pct(doneT), background: c.green }}/>
                <div style={{ width: pct(curT), background: 'repeating-linear-gradient(-45deg, rgba(199,126,46,.85) 0 4px, rgba(199,126,46,.45) 4px 8px)' }}/>
                {/* 5개 단위 눈금 */}
                {Array.from({ length: Math.floor(TOP / 5) - 1 }).map((_, i) => <div key={i} style={{ position: 'absolute', left: pct((i + 1) * 5), top: 0, bottom: 0, width: 1, background: 'rgba(62,54,43,.25)' }}/>)}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 5, fontFamily: HW, fontSize: 12.5, color: c.soft }}>
                <span style={{ whiteSpace: 'nowrap' }}><span style={{ display: 'inline-block', width: 9, height: 9, background: c.green, marginRight: 4, verticalAlign: -1 }}/>완료 <b style={{ color: c.ink }}>{doneT}</b></span>
                <span style={{ whiteSpace: 'nowrap' }}><span style={{ display: 'inline-block', width: 9, height: 9, background: c.amber, marginRight: 4, verticalAlign: -1 }}/>진행 <b style={{ color: c.ink }}>{curT}</b></span>
                <span style={{ whiteSpace: 'nowrap' }}>남음 {TOP - doneT - curT}</span>
                <div style={{ flex: 1 }}/>
                <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 700, color: c.ink, whiteSpace: 'nowrap' }}>{doneT}<span style={{ color: c.soft }}>/{TOP} 주제</span></span>
              </div>
            </div>
          );
        })()}
        {/* 인덱스 간지 스택 — 바인더 링 + 오른쪽 색 탭 */}
        <div style={{ position: 'absolute', top: 236, left: 0, right: 0, bottom: 78, overflowY: 'auto', padding: '10px 22px 20px 30px' }}>
          {/* 바인더 링 */}
          <div style={{ position: 'absolute', left: 12, top: 14, bottom: 30, width: 8 }}>
            {Array.from({ length: 14 }).map((_, i) => <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', border: `1.5px solid ${c.ink}`, background: c.bg, marginBottom: 34 }}/>)}
          </div>
          {topics.map((t, i) => {
            const here = t.state === 'here', locked = t.state === 'locked';
            return (
              <div key={i} style={{ position: 'relative', marginTop: i ? 12 : 0, marginLeft: here ? 0 : 6, opacity: locked ? .6 : 1 }}>
                {/* 색 인덱스 탭 */}
                <div style={{ position: 'absolute', right: -8, top: 14 + i * 4, width: 22, height: 44, background: t.col, border: `1.4px solid ${c.ink}`, borderLeft: 'none', borderRadius: '0 5px 5px 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: MONO, fontSize: 9, fontWeight: 700, color: '#fff', writingMode: 'vertical-rl' }}>{String(i + 1).padStart(2, '0')}</span>
                </div>
                <NbPaper rot={i % 2 ? 0.4 : -0.4} tape={here} tapeLeft={120} style={{ padding: here ? '13px 14px 12px' : '11px 14px', boxShadow: here ? `0 3px 8px rgba(62,54,43,.18), 0 0 0 2px ${c.amber}` : undefined }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                    <NbIcon name={t.icon} size={19}/>
                    <div style={{ fontFamily: HW, fontSize: here ? 18 : 16.5, color: c.ink, lineHeight: 1.1, minWidth: 0, flex: 1 }}>{t.t}</div>
                    {t.state === 'done' && <span style={{ fontFamily: HW, fontSize: 11, color: c.green, border: `2px double ${c.green}`, borderRadius: '50%', width: 34, height: 34, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-12deg)', flexShrink: 0 }}>완료</span>}
                    {here && <NbTag color={c.amber} rot={-2}>진행중</NbTag>}
                    {t.state === 'next' && <NbTag color={c.blue} rot={2}>다음</NbTag>}
                  </div>
                  {/* 우표 미니 격자: 상황 수만큼 점 — 한눈에 34개 규모가 보임 */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginTop: 9, maxWidth: 260 }}>
                    {Array.from({ length: t.n }).map((_, k) => (
                      <span key={k} style={{ width: 9, height: 9, borderRadius: 1.5, border: `1px solid ${k < t.d ? t.col : 'rgba(62,54,43,.3)'}`, background: k < t.d ? t.col : k === t.d && here ? 'rgba(233,196,90,.6)' : 'transparent', transform: `rotate(${(k * 7) % 5 - 2}deg)` }}/>
                    ))}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}>
                    <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 700, color: c.ink, whiteSpace: 'nowrap' }}>{t.d}<span style={{ color: c.soft }}> / {t.n}</span></span>
                    <span style={{ fontFamily: HW, fontSize: 12.5, color: c.soft, marginLeft: 8 }}>{t.state === 'done' ? '모든 우표 모음' : here ? '13번째 상황 · 약 6분' : locked ? `앞 주제 ${i === 3 ? '60%' : '이중 확인'} 완료 시 열림` : '준비됨'}</span>
                    <div style={{ flex: 1 }}/>
                    {here && <NbButton variant="ink" size="sm">이어서 ›</NbButton>}
                    {t.state === 'next' && <NbButton variant="paper" size="sm">미리보기</NbButton>}
                  </div>
                </NbPaper>
              </div>
            );
          })}
          <div style={{ marginTop: 14 }}>
            <NbMemo rot={0.3} color={c.blue}><b style={{ color: c.blue }}>추천 순서</b> 주제 2의 SBAR가 끝나면 3(이중 확인)이 열려요 — 실제 약국 업무 순서 그대로.</NbMemo>
          </div>
        </div>
      </Frame>
    );
  }

  // ══ F · 주제 → 상황 : 우표 앨범 (34장) + 빨간 실 ══
  function StampAlbum() {
    const N = 36, D = 12;
    const icons = ['speech', 'pager', 'monitor', 'pill', 'shield', 'bell', 'speaker', 'mic', 'board', 'bulb', 'siren', 'bandage'];
    const cols = 5, S = 56, GX = 12, GY = 20, X0 = 18, Y0 = 34;
    // 서펜타인: 짝수 행은 왼→오, 홀수 행은 오→왼 — 빨간 실이 자연스럽게 이어짐
    const pos = (i) => { const r = Math.floor(i / cols), col = r % 2 ? cols - 1 - (i % cols) : i % cols; return [X0 + col * (S + GX) + S / 2, Y0 + r * (S + GY) + S / 2]; };
    const yarnPts = Array.from({ length: D + 1 }, (_, i) => pos(i));
    const rows = Math.ceil(N / cols);
    const H = Y0 + rows * (S + GY) + 20;
    const stage = (i) => i < 12 ? '기초' : i < 24 ? '실전' : '심화';
    return (
      <Frame label="여정 · 주제 → 상황 (우표 앨범)">
        <div style={{ padding: '6px 22px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: HW, fontSize: 14, color: c.soft }}>‹ 약국 바인더</span>
          <div style={{ flex: 1 }}/>
          <NbTag color={c.amber} rot={1}>02 · 진행중</NbTag>
        </div>
        <div style={{ padding: '8px 22px 0' }}>
          <div style={{ fontFamily: HW, fontSize: 24, color: c.ink, lineHeight: 1.15 }}>약제부 인계 · SBAR · 콜백</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
            <span style={{ fontFamily: MONO, fontSize: 12, fontWeight: 700, color: c.ink, whiteSpace: 'nowrap' }}>{D}<span style={{ color: c.soft }}> / {N}</span></span>
            <span style={{ fontFamily: HW, fontSize: 12.5, color: c.soft, whiteSpace: 'nowrap' }}>· 실 13번째</span>
            <div style={{ flex: 1 }}/>
            {/* 구간 칩 — 12장 단위 */}
            {[['기초', '1–12', true], ['실전', '13–24', false], ['심화', '25–36', false]].map((s, i) => (
              <span key={i} style={{ fontFamily: HW, fontSize: 11.5, color: s[2] ? c.paper : c.ink, background: s[2] ? c.ink : 'transparent', border: `1.3px solid ${c.ink}`, borderRadius: 3, padding: '1px 6px', whiteSpace: 'nowrap', transform: `rotate(${i % 2 ? 1 : -1}deg)` }}>{s[0]}</span>
            ))}
          </div>
        </div>
        {/* 앨범 페이지 */}
        <div style={{ position: 'absolute', top: 152, left: 14, right: 14, bottom: 150, overflowY: 'auto' }}>
          <div style={{ position: 'relative', height: H, background: c.paper, border: `1px solid #E0D6C0`, boxShadow: '0 2px 6px rgba(62,54,43,.14)', margin: '4px 6px' }}>
            {/* 앨범 종이 그리드 라인 */}
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(62,54,43,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(62,54,43,.05) 1px, transparent 1px)', backgroundSize: '18px 18px' }}/>
            {/* 구간 라벨 (좌측 여백 손글씨) */}
            {[0, 12, 24].map((k, i) => (
              <div key={k} style={{ position: 'absolute', left: 6, top: Y0 + Math.floor(k / cols) * (S + GY) - 22, fontFamily: HW, fontSize: 12, color: c.soft }}>— {stage(k)} {k + 1}~{k + 12}</div>
            ))}
            <svg viewBox={`0 0 362 ${H}`} width="362" height={H} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2 }}>
              <Yarn pts={yarnPts}/>
            </svg>
            {Array.from({ length: N }).map((_, i) => {
              const [x, y] = pos(i);
              const st = i < D ? 'done' : i === D ? 'here' : i < D + 3 ? 'next' : 'locked';
              return (
                <div key={i} style={{ position: 'absolute', left: x - S / 2, top: y - S / 2 }}>
                  <Stamp size={S} state={st} icon={icons[i % icons.length]} n={i + 1} wash={['rgba(95,141,90,.16)', 'rgba(74,111,165,.16)', 'rgba(233,150,100,.18)'][i % 3]} rot={[-3, 2, -2, 3, -1][i % 5]} delay={Math.min(i, 14) * 0.04}/>
                </div>
              );
            })}
          </div>
        </div>
        {/* 현재 우표 카드 */}
        <div style={{ position: 'absolute', left: 16, right: 16, bottom: 82, zIndex: 5 }}>
          <NbPaper rot={-0.4} tape tapeLeft={120} style={{ padding: '10px 13px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 40, height: 40, background: 'rgba(233,196,90,.28)', border: `1.6px solid ${c.amber}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-4deg)', flexShrink: 0 }}><NbIcon name="speaker" size={22}/></div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontFamily: HW, fontSize: 16, color: c.ink, lineHeight: 1.1 }}>13 · 누락 약 콜백 받기</div>
              <div style={{ fontSize: 10.5, color: c.soft, marginTop: 2, whiteSpace: 'nowrap' }}>실전 첫 상황 · 직접 말하기 · 약 6분 · +60 XP</div>
            </div>
            <NbButton variant="ink" size="sm">시작 ✎</NbButton>
          </NbPaper>
        </div>
      </Frame>
    );
  }

  // ══ G · 부서 선택 — 바인더 서가 (비선형: 어느 바인더든 꺼내 읽는다) ══
  function BinderShelf({ onPick }) {
    const depts = [
      { k: 'ER', n: '응급센터', icon: 'siren', col: '#C75146', topics: 6, done: 2, cur: '중증 응대', mine: true },
      { k: 'ICU', n: '중환자실', icon: 'monitor', col: '#4A6FA5', topics: 5, done: 1, cur: '벤트 알람' },
      { k: 'OR', n: '수술실', icon: 'scalpel', col: '#5F8D5A', topics: 5, done: 0 },
      { k: 'PHM', n: '약국', icon: 'pill', col: '#C77E2E', topics: 5, done: 1, cur: 'SBAR 콜백' },
      { k: 'PEDS', n: '소아과', icon: 'baby', col: '#D98BA6', topics: 5, done: 0 },
      { k: 'L&D', n: '분만실', icon: 'bell', col: '#7A9E7E', topics: 4, done: 0 },
      { k: 'IM', n: '내과병동', icon: 'bandage', col: '#8B7BB5', topics: 6, done: 0 },
      { k: 'PSY', n: '정신과', icon: 'bulb', col: '#6E8FA8', topics: 4, done: 0 },
    ];
    const Binder = ({ d, i }) => {
      const pct = d.done / d.topics;
      return (
        <div onClick={onPick} style={{ position: 'relative', width: 78, height: 118, flexShrink: 0, transform: `rotate(${[-1.5, 1, -0.5, 1.5][i % 4]}deg)`, cursor: 'pointer' }}>
          {/* 바인더 등 */}
          <div style={{ position: 'absolute', inset: 0, background: c.paper, border: `1.6px solid ${c.ink}`, borderRadius: '3px 6px 6px 3px', boxShadow: d.mine ? `0 3px 8px rgba(62,54,43,.2), 0 0 0 2px ${c.amber}` : '2px 2px 0 rgba(62,54,43,.16)' }}/>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 9, background: d.col, borderRight: `1.4px solid ${c.ink}`, borderRadius: '3px 0 0 3px' }}/>
          {/* 등 라벨 */}
          <div style={{ position: 'absolute', left: 16, right: 6, top: 8, background: '#fff', border: `1px solid #E0D6C0`, padding: '4px 4px 3px', textAlign: 'center' }}>
            <div style={{ fontFamily: MONO, fontSize: 9, fontWeight: 700, color: c.ink, letterSpacing: .5 }}>{d.k}</div>
            <div style={{ fontFamily: HW, fontSize: 11.5, color: c.ink, lineHeight: 1.1, marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden' }}>{d.n}</div>
          </div>
          <div style={{ position: 'absolute', left: 16, right: 6, top: 52, display: 'flex', justifyContent: 'center' }}><NbIcon name={d.icon} size={24}/></div>
          {/* 진행 — 등 하단 잉크 바 */}
          <div style={{ position: 'absolute', left: 16, right: 6, bottom: 9, height: 7, border: `1.2px solid ${c.ink}`, borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ width: pct * 100 + '%', height: '100%', background: d.col }}/>
          </div>
          <div style={{ position: 'absolute', left: 16, right: 6, bottom: 18, textAlign: 'center', fontFamily: MONO, fontSize: 8.5, fontWeight: 700, color: c.soft }}>{d.done}/{d.topics}</div>
          {d.mine && <div style={{ position: 'absolute', right: -6, top: -10, transform: 'rotate(8deg)' }}><NbTag color={c.amber}>내 부서</NbTag></div>}
          {d.cur && !d.mine && <div style={{ position: 'absolute', left: 10, right: -2, top: -8, height: 14, background: 'rgba(160,200,220,.6)', transform: 'rotate(-3deg)' }}/>}
        </div>
      );
    };
    return (
      <Frame label="여정 · 부서 선택 (바인더 서가)">
        <div style={{ display: 'flex', alignItems: 'baseline', padding: '8px 22px 0' }}>
          <span style={{ fontFamily: HW, fontSize: 28, color: c.ink }}>나의 여정</span>
          <div style={{ flex: 1 }}/>
          <span style={{ fontFamily: HW, fontSize: 13.5, color: c.soft }}>바인더 8권 · 우표 41 모음</span>
        </div>
        <div style={{ position: 'absolute', top: 94, left: 0, right: 0, bottom: 78, overflowY: 'auto', padding: '4px 22px 20px' }}>
          {/* 내 부서 — 펼쳐진 바인더 */}
          <div onClick={onPick}><NbPaper rot={-0.4} tape tapeLeft={130} style={{ padding: '12px 14px', boxShadow: `0 3px 8px rgba(62,54,43,.18), 0 0 0 2px ${c.amber}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 44, height: 44, border: `1.6px solid ${c.ink}`, background: 'rgba(199,81,70,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-3deg)', flexShrink: 0 }}><NbIcon name="siren" size={26}/></div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ fontFamily: HW, fontSize: 19, color: c.ink }}>ER 바인더</span><NbTag color={c.amber} rot={-2}>내 부서</NbTag></div>
                <div style={{ fontSize: 10.5, color: c.soft, marginTop: 2 }}>주제 2/6 완료 · 지금 '중증 응대' 13/34</div>
              </div>
              <NbButton variant="ink" size="sm">이어서 ›</NbButton>
            </div>
            <div style={{ display: 'flex', gap: 4, marginTop: 10 }}>
              {[1, 1, .38, 0, 0, 0].map((p, i) => <div key={i} style={{ flex: 1, height: 7, border: `1.2px solid ${c.ink}`, borderRadius: 2, overflow: 'hidden', transform: `rotate(${i % 2 ? .8 : -.8}deg)` }}><div style={{ width: p * 100 + '%', height: '100%', background: p === 1 ? c.green : c.amber }}/></div>)}
            </div>
          </NbPaper></div>
          {/* 공통 필수 — 얇은 바인더 */}
          <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', border: `1.4px dashed ${c.green}`, borderRadius: 3, background: 'rgba(95,141,90,.06)' }}>
            <NbIcon name="shield" size={18}/>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontFamily: HW, fontSize: 15, color: c.ink, lineHeight: 1.1 }}>공통 필수 — 모든 부서가 공유</div>
              <div style={{ fontSize: 10.5, color: c.soft, marginTop: 1 }}>손위생·환자 확인·SBAR 기본 · 어느 바인더에서 해도 한 번만</div>
            </div>
            <span style={{ fontFamily: HW, fontSize: 12, color: c.green, border: `2px double ${c.green}`, borderRadius: '50%', width: 32, height: 32, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-12deg)', flexShrink: 0 }}>완료</span>
          </div>
          {/* 서가 */}
          <div style={{ fontFamily: HW, fontSize: 16, color: c.ink, marginTop: 16 }}>서가 — 아무 바인더나 꺼내 읽어요 ✎</div>
          <div style={{ fontSize: 10.5, color: c.soft, marginTop: 2 }}>순서 없음 · 부서마다 독립 진행 · 파란 테이프 = 읽던 곳 표시</div>
          {[depts.slice(0, 4), depts.slice(4, 8)].map((row, r) => (
            <div key={r} style={{ position: 'relative', marginTop: r ? 26 : 16 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', padding: '0 2px' }}>
                {row.map((d, i) => <Binder key={d.k} d={d} i={i + r}/>)}
              </div>
              {/* 선반 */}
              <div style={{ height: 6, marginTop: 4, background: '#C9B99A', border: `1.4px solid ${c.ink}`, borderRadius: 2, boxShadow: '0 4px 0 rgba(62,54,43,.12)' }}/>
            </div>
          ))}
          <div style={{ marginTop: 20 }}>
            <NbMemo rot={0.3} color={c.blue}><b style={{ color: c.blue }}>추천</b> ER 근무 예정이면 ER → ICU(인계 상대) → 약국(콜백 상대) 순이 실무에 가까워요. 물론 순서는 자유!</NbMemo>
          </div>
        </div>
      </Frame>
    );
  }

  // ══ H · 주제 → 상황 : 불규칙 우표 여정 (D 스타일로 커리큘럼 36장) ══
  // 지그재그 산책길 — 5장 단위 '구간'마다 좌우로 흔들리며 내려간다. 세로 스크롤.
  function StampTrail() {
    const N = 36, D = 12;
    const icons = ['speech', 'pager', 'monitor', 'pill', 'shield', 'bell', 'speaker', 'mic', 'board', 'bulb', 'siren', 'bandage'];
    const names = ['인계 첫 인사', '약 이름 확인', '용량 재확인', '콜백 요청', '전화 받기', '누락 약 문의', 'SBAR·S', 'SBAR·B', 'SBAR·A', 'SBAR·R', '반복 확인', '통화 마무리', '누락 약 콜백', '긴급 STAT', '오더 변경', '알레르기 확인', '대체약 협의', '기송관 발송', '시간 지연 사과', '재확인 전화', '야간 약사', '상호작용 경고', '마약류 확인', '폐기 입회', '이중 서명', '보호자 응대', '외국인 환자', '전산 오류', '약 반납', '분할 처방', '항암제 지연', '소아 용량', '인슐린 콜백', '항응고제', '최종 인계', '주제 시험'];
    // 불규칙 좌표 — 손으로 흩뿌린 듯 (x: 60~340 사이 지그재그 + 지터, y: 82px 간격 + 지터)
    const base = [[70, 80], [200, 130], [318, 92], [300, 232], [160, 262], [64, 372], [212, 400], [330, 372], [250, 520], [96, 540]]; // D 패턴
    const PER = 600;
    const pts = Array.from({ length: N }, (_, i) => { const b = base[i % 10], k = Math.floor(i / 10); return [b[0] + (k % 2 ? 8 : -6), b[1] + k * PER]; });
    const H = pts[N - 1][1] + 130;
    const rots = [-5, 4, -2, 6, -4, 3, -6, 2, 5, -3, 4, -5];
    const st = (i) => i < D ? 'done' : i === D ? 'here' : i < D + 3 ? 'next' : 'locked';
    // 미래 구간 연필 점선
    let future = `M${pts[D][0]} ${pts[D][1]}`;
    for (let i = D + 1; i < N; i++) { const [x0, y0] = pts[i - 1], [x1, y1] = pts[i]; future += ` Q${(x0 + x1) / 2 + (i % 2 ? 10 : -10)} ${(y0 + y1) / 2} ${x1} ${y1}`; }
    const doodle = (x, y, k) => k === 0
      ? <path d={`M${x} ${y} q6 -10 14 -2 q8 -8 14 2 q8 2 2 8 h-28 q-6 -4 -2 -8`} fill="none" stroke="rgba(62,54,43,.2)" strokeWidth="1.3"/>
      : k === 1 ? <path d={`M${x} ${y} l4 -8 l4 8 M${x + 4} ${y - 8} v-5`} fill="none" stroke="rgba(62,54,43,.2)" strokeWidth="1.3" strokeLinecap="round"/>
      : <g fill="none" stroke="rgba(62,54,43,.2)" strokeWidth="1.3"><circle cx={x} cy={y} r="3"/><circle cx={x + 12} cy={y - 7} r="1.6"/></g>;
    return (
      <Frame label="여정 · 주제 → 상황 (불규칙 우표 산책길)">
        <div style={{ padding: '6px 22px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: HW, fontSize: 14, color: c.soft }}>‹ 약국 바인더</span>
          <div style={{ flex: 1 }}/>
          <NbTag color={c.amber} rot={1}>02 · 진행중</NbTag>
        </div>
        <div style={{ padding: '8px 22px 0' }}>
          <div style={{ fontFamily: HW, fontSize: 24, color: c.ink, lineHeight: 1.15 }}>약제부 인계 · SBAR · 콜백</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
            <span style={{ fontFamily: MONO, fontSize: 12, fontWeight: 700, color: c.ink, whiteSpace: 'nowrap' }}>{D}<span style={{ color: c.soft }}> / {N}</span></span>
            <span style={{ fontFamily: HW, fontSize: 12.5, color: c.soft, whiteSpace: 'nowrap' }}>· 실 13번째</span>
            <div style={{ flex: 1 }}/>
            {[['기초', true], ['실전', false], ['심화', false]].map((s, i) => (
              <span key={i} style={{ fontFamily: HW, fontSize: 11.5, color: s[1] ? c.paper : c.ink, background: s[1] ? c.ink : 'transparent', border: `1.3px solid ${c.ink}`, borderRadius: 3, padding: '1px 6px', whiteSpace: 'nowrap', transform: `rotate(${i % 2 ? 1 : -1}deg)` }}>{s[0]}</span>
            ))}
          </div>
        </div>
        {/* 산책길 — 스크롤, 현재 위치 근처로 초기 스크롤 */}
        <div style={{ position: 'absolute', top: 152, left: 0, right: 0, bottom: 150, overflowY: 'auto' }} ref={el => { if (el && !el.dataset.init) { el.dataset.init = 1; el.scrollTop = Math.max(0, pts[D][1] - 300); } }}>
          <div style={{ position: 'relative', height: H }}>
            <svg viewBox={`0 0 402 ${H}`} width="402" height={H} style={{ position: 'absolute', inset: 0 }}>
              {/* 구간 경계 — 손글씨 라벨 + 잔선 */}
              {[0, 12, 24].map((k, i) => (
                <g key={k}>
                  <line x1="18" x2="384" y1={pts[k][1] - 62} y2={pts[k][1] - 62} stroke="rgba(62,54,43,.18)" strokeWidth="1" strokeDasharray="2 4"/>
                  <text x="20" y={pts[k][1] - 68} fontFamily='"Gaegu",cursive' fontSize="12.5" fill={c.soft}>— {['기초', '실전', '심화'][i]} {k + 1}~{k + 12}</text>
                </g>
              ))}
              {Array.from({ length: Math.ceil(H / 600) }).map((_, k) => (
                <g key={k} transform={`translate(0,${k * 600})`}>
                  {doodle(330, 30, 0)}{doodle(22, 200, 0)}{doodle(355, 470, 1)}{doodle(372, 300, 2)}
                  <path d="M40 470 h10 M45 465 v10" stroke="rgba(62,54,43,.22)" strokeWidth="1.3" strokeLinecap="round"/>
                  <path d="M120 560 h8 M124 556 v8" stroke="rgba(62,54,43,.22)" strokeWidth="1.3" strokeLinecap="round"/>
                  {doodle(250, 330, 1)}
                </g>
              ))}
              <path d={future} fill="none" stroke="rgba(62,54,43,.28)" strokeWidth="1.5" strokeDasharray="4 5"/>
              <Yarn pts={pts.slice(0, D + 1)}/>
            </svg>
            {pts.map((p, i) => {
              const s = st(i);
              return (
                <div key={i} style={{ position: 'absolute', left: p[0] - 31, top: p[1] - 31 }}>
                  <Stamp size={62} state={s} icon={icons[i % icons.length]} n={i + 1} wash={['rgba(95,141,90,.16)', 'rgba(74,111,165,.16)', 'rgba(233,150,100,.18)'][i % 3]} rot={rots[i % 12]} delay={Math.min(Math.abs(i - D), 6) * 0.06}/>
                  <div style={{ position: 'absolute', left: '50%', top: 66, transform: 'translateX(-50%)', whiteSpace: 'nowrap', fontFamily: HW, fontSize: 12.5, color: s === 'locked' ? c.soft : c.ink, background: 'rgba(241,235,221,.85)', padding: '0 4px', opacity: s === 'locked' && i > D + 6 ? .55 : 1 }}>{s === 'locked' && i > D + 6 ? '· · ·' : names[i]}</div>
                </div>
              );
            })}
          </div>
        </div>
        {/* 현재 우표 카드 */}
        <div style={{ position: 'absolute', left: 16, right: 16, bottom: 82, zIndex: 5 }}>
          <NbPaper rot={-0.4} tape tapeLeft={120} style={{ padding: '10px 13px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 40, height: 40, background: 'rgba(233,196,90,.28)', border: `1.6px solid ${c.amber}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-4deg)', flexShrink: 0 }}><NbIcon name="speaker" size={22}/></div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontFamily: HW, fontSize: 16, color: c.ink, lineHeight: 1.1 }}>13 · 누락 약 콜백 받기</div>
              <div style={{ fontSize: 10.5, color: c.soft, marginTop: 2, whiteSpace: 'nowrap' }}>실전 첫 상황 · 직접 말하기 · 약 6분 · +60 XP</div>
            </div>
            <NbButton variant="ink" size="sm">시작 ✎</NbButton>
          </NbPaper>
        </div>
      </Frame>
    );
  }

  // ══ I · G→E 전환 인터랙티브 — 바인더가 날아와 펼쳐지고, 뒤로가면 닫혀서 서가로 ══
  function BinderFlyDemo() {
    const [phase, setPhase] = React.useState('shelf'); // shelf | in | open | opened | closing | out
    const [from, setFrom] = React.useState({ x: 0, y: 0, r: 0 });
    const hostRef = React.useRef(null);
    const pick = (e) => {
      const host = hostRef.current.getBoundingClientRect();
      const b = e.currentTarget.getBoundingClientRect();
      // 바인더 중심 → 펼친 카드 중심(호스트 중앙) 오프셋
      setFrom({ x: (b.left + b.width / 2) - (host.left + host.width / 2), y: (b.top + b.height / 2) - (host.top + (host.height - 68 * host.height / 874) / 2), r: -10 });
      setPhase('in');
      setTimeout(() => setPhase('open'), 640);
      setTimeout(() => setPhase('opened'), 640 + 1380);
    };
    const back = () => { setPhase('closing'); setTimeout(() => setPhase('out'), 900); setTimeout(() => setPhase('shelf'), 900 + 620); };
    const shelfVisible = phase === 'shelf' || phase === 'in' || phase === 'out';
    const flying = phase === 'in' || phase === 'out';
    const showE = phase === 'open' || phase === 'opened' || phase === 'closing';
    // 비행: 마운트 직후 한 프레임 뒤 identity로 → transition
    const [flown, setFlown] = React.useState(false);
    React.useEffect(() => {
      if (phase === 'in') { setFlown(false); const id = requestAnimationFrame(() => requestAnimationFrame(() => setFlown(true))); return () => cancelAnimationFrame(id); }
      if (phase === 'out') { setFlown(false); }
      if (phase === 'open' || phase === 'opened' || phase === 'closing') setFlown(true);
    }, [phase]);
    const farTf = `translate(${from.x}px, ${from.y}px) scale(.22) rotate(${from.r}deg)`;
    const flyStyle = flying
      ? { transform: flown ? 'translate(0,0) scale(1) rotate(0)' : farTf, transition: phase === 'in' ? 'transform .64s cubic-bezier(.3,.8,.3,1)' : 'transform .6s cubic-bezier(.5,0,.6,.5)' }
      : { transform: 'none' };
    const coverOpen = phase === 'open' || phase === 'opened';
    const coverStyle = { transform: coverOpen ? 'scaleX(0.02) skewY(-6deg)' : 'scaleX(1) skewY(0)', filter: coverOpen ? 'brightness(.7)' : 'brightness(1)', transition: phase === 'open' ? 'transform .7s cubic-bezier(.4,.1,.3,1), filter .7s' : phase === 'closing' ? 'transform .5s cubic-bezier(.5,.1,.5,1), filter .5s' : 'none' };
    const vars = { '--fx': from.x + 'px', '--fy': from.y + 'px', '--fr': from.r + 'deg' };
    const FX = window.NbOnbFX || {};
    const coverFace = (
      <div style={{ position: 'absolute', inset: 0, background: '#FFFdf4', border: `1.6px solid ${c.ink}`, borderRadius: '3px 6px 6px 3px', boxSizing: 'border-box' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 46, background: '#C77E2E', borderRight: `1.6px solid ${c.ink}` }}/>
        <div style={{ position: 'absolute', left: 90, right: 40, top: 60, background: '#fff', border: '1px solid #E0D6C0', padding: '18px 16px', textAlign: 'center' }}>
          <div style={{ fontFamily: MONO, fontSize: 22, fontWeight: 700, color: c.ink, letterSpacing: 2 }}>PHM</div>
          <div style={{ fontFamily: HW, fontSize: 26, color: c.ink, marginTop: 4 }}>약국 차트</div>
        </div>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 260, display: 'flex', justifyContent: 'center' }}><NbIcon name="pill" size={120}/></div>
        <div style={{ position: 'absolute', left: 90, right: 40, bottom: 80, height: 9, border: `1.4px solid ${c.ink}`, borderRadius: 3, overflow: 'hidden' }}><div style={{ width: '40%', height: '100%', background: '#C77E2E' }}/></div>
      </div>
    );
    return (
      <div ref={hostRef} style={{ position: 'relative', width: 402, height: 874 }}>
        {/* 서가 (G) */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: phase === 'shelf' ? 'auto' : 'none' }}>
          <BinderShelf onPick={pick}/>
        </div>
        {/* 비행 중엔 서가 본문만 살짝 어둡게(탭바 제외) */}
        <div style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 68, background: c.bg, opacity: phase === 'shelf' ? 0 : (flying ? .55 : 1), transition: 'opacity .3s', pointerEvents: 'none', zIndex: 30, borderRadius: '40px 40px 0 0' }}/>
        {/* 날아오는/펼쳐지는 바인더 */}
        {phase !== 'shelf' && (
          <div style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 68, zIndex: 40, ...flyStyle, transformOrigin: 'center', borderRadius: flying ? 14 : '40px 40px 0 0', overflow: 'hidden', boxShadow: flying ? '0 24px 60px rgba(62,54,43,.35)' : 'none' }}>
            {/* 내지 = E — 표지가 열리는 동안 아래에 이미 존재 */}
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: c.bg, opacity: showE ? 1 : 0, transition: 'opacity .2s', pointerEvents: phase === 'opened' ? 'auto' : 'none' }}>
              <TopicBinder onBack={back}/>
            </div>
            {/* 표지 — in/out: 닫힌 채 비행 / open: 온보딩 여권 넘김(CurlOut, 24관절 곡면) / closing: 역넘김(CurlIn) / opened: 제거 */}
            {(phase === 'in' || phase === 'out') && (
              <div className="nbj2-cover" style={{ pointerEvents: 'none' }}>{coverFace}</div>
            )}
            {phase === 'open' && (FX.CurlOut
              ? <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}><FX.CurlOut>{coverFace}</FX.CurlOut></div>
              : <div className="nbj2-cover" style={{ ...coverStyle, pointerEvents: 'none' }}>{coverFace}</div>)}
            {phase === 'closing' && (FX.CurlIn
              ? <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}><FX.CurlIn bg="#FFFdf4" dur=".8s">{coverFace}</FX.CurlIn></div>
              : <div className="nbj2-cover" style={{ ...coverStyle, pointerEvents: 'none' }}>{coverFace}</div>)}
          </div>
        )}
        {phase === 'shelf' && <div style={{ position: 'absolute', left: 0, right: 0, top: 102, textAlign: 'center', fontFamily: HW, fontSize: 12.5, color: c.amber, zIndex: 50, pointerEvents: 'none' }}>★ 서가의 바인더를 탭해 보세요</div>}
      </div>
    );
  }

  Object.assign(window, { JourneyStampsAlt, TopicBinder, StampAlbum, StampTrail, BinderShelf, BinderFlyDemo, NbStampNode: Stamp, NbYarn: Yarn });
})();
