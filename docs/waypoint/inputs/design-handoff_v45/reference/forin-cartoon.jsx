// forin-cartoon.jsx — forin 카툰 리디자인 시안 (Cartoon Network풍)
// 그림체 규칙:
//  · 굵고 일정하지 않은 잉크 아웃라인(3~5px) + 블롭(찌그러진 원) 실루엣
//  · 채도 높은 플랫 컬러 + 크림 배경 + 하프톤 도트
//  · 카드마다 살짝 기울임(rotate ±1~2도) — 스티커 느낌
//  · 스타버스트/말풍선/의성어(BEEP!) 코믹 문법
//  · 마스코트: 청진기를 두른 블롭 캐릭터 "포리(Fori)"
const CT = {
  ink: '#2B2622',
  cream: '#FAF6EC',
  paper: '#FFFFFF',
  sky: '#8FC7E8', skyDk: '#5E9EC4',
  pink: '#F2879C', pinkDk: '#C96579',
  yellow: '#F7D877', yellowDk: '#D9B44A',
  lime: '#A8D977', limeDk: '#7FAE4E',
  purple: '#C3B1E8',
  orange: '#F2A46B',
  navy: '#3A4A5E',
};
const JUA = '"Jua","BMJua",sans-serif';
const BHS = '"Black Han Sans","Jua",sans-serif';
// 찌그러진 블롭 radius 프리셋 — 요소마다 다른 걸 써서 손그림 느낌
const BLOB1 = '58% 42% 55% 45% / 52% 48% 52% 48%';
const BLOB2 = '45% 55% 48% 52% / 55% 45% 58% 42%';
const BLOB3 = '50% 50% 42% 58% / 48% 52% 45% 55%';

// ── 카툰 아이콘 세트 — 굵은 잉크 스트로크 + 파스텔 플랫 필 (24×24) ──
function CtIcon({ name, size = 20, style }) {
  const K = CT.ink, W = 2.2;
  const P = { stroke: K, strokeWidth: W, strokeLinejoin: 'round', strokeLinecap: 'round' };
  const G = {
    home: <g><path d="M4 11 L12 4.5 L20 11 V19.5 H4 Z" fill={CT.yellow} {...P}/><rect x="9.7" y="13" width="4.6" height="6.5" fill="#fff" {...P}/></g>,
    hospital: <g><rect x="5" y="4.5" width="14" height="15" rx="2.5" fill={CT.sky} {...P}/><path d="M12 8.5 V15.5 M8.5 12 H15.5" stroke="#fff" strokeWidth="3.4" strokeLinecap="round"/></g>,
    board: <g><rect x="5.5" y="5" width="13" height="14.5" rx="2" fill="#fff" {...P}/><rect x="9" y="3" width="6" height="4" rx="1.5" fill={CT.sky} {...P}/><path d="M8.5 11 H15.5 M8.5 14.5 H13" {...P} fill="none"/></g>,
    lab: <g><rect x="5.5" y="4.5" width="13" height="15" rx="2" fill={CT.purple} {...P}/><path d="M9 4.5 V19.5" {...P} fill="none"/><path d="M12 9 H15.5 M12 12.5 H15.5" stroke="#fff" strokeWidth={W} strokeLinecap="round"/></g>,
    me: <g><circle cx="12" cy="12" r="8" fill={CT.peachFill} {...P}/><circle cx="9.2" cy="10.5" r="1" fill={K}/><circle cx="14.8" cy="10.5" r="1" fill={K}/><path d="M9 14.5 Q12 17 15 14.5" fill="none" {...P}/></g>,
    mic: <g><rect x="9" y="3.5" width="6" height="10" rx="3" fill={CT.pink} {...P}/><path d="M6 11.5 Q12 17.5 18 11.5" fill="none" {...P}/><path d="M12 15.5 V19.5 M9 19.5 H15" fill="none" {...P}/></g>,
    speaker: <g><path d="M4.5 9.5 H8 L13 5 V19 L8 14.5 H4.5 Z" fill={CT.sky} {...P}/><path d="M16 9 Q18 12 16 15 M18.5 6.5 Q22 12 18.5 17.5" fill="none" {...P}/></g>,
    bulb: <g><circle cx="12" cy="10" r="5.5" fill={CT.yellow} {...P}/><path d="M10 17.5 H14 M10.5 20 H13.5" fill="none" {...P}/><path d="M12 15.5 V17.5" fill="none" {...P}/></g>,
    fire: <g><path d="M12 3.5 C13 7 17 8.5 17 13 C17 16.8 14.8 19.5 12 19.5 C9.2 19.5 7 16.8 7 13 C7 10.5 8.5 8.8 9.5 7.2 C10 8.6 11 9.2 11 9.2 C11 7 11.4 5 12 3.5 Z" fill={CT.orange} {...P}/><path d="M12 12 C13.4 13.6 14 14.6 14 16 C14 17.6 13.1 18.6 12 18.6 C10.9 18.6 10 17.6 10 16 C10 14.6 10.8 13.4 12 12 Z" fill={CT.yellow} stroke="none"/></g>,
    pager: <g><rect x="4" y="7.5" width="16" height="10" rx="2.5" fill={CT.yellow} {...P}/><rect x="7" y="10.2" width="7" height="4.4" rx="1" fill="#fff" {...P}/><circle cx="17" cy="12.5" r="1.1" fill={K}/><path d="M17.5 4.5 Q19.5 5.5 20 7.5 M15.8 5.8 Q17 6.5 17.4 7.6" fill="none" {...P}/></g>,
    run: <g><circle cx="14.5" cy="5.5" r="2.2" fill={CT.peachFill} {...P}/><path d="M8 10.5 L12.5 9 L14 12.5 L11 15 L12.5 19.5 M14 12.5 L17.5 14.5 M11 15 L7 17.5 M5.5 12.5 L8.5 12" fill="none" {...P}/></g>,
    siren: <g><path d="M7.5 14 A4.5 4.5 0 0 1 16.5 14 Z" fill={CT.pink} {...P}/><rect x="5" y="14" width="14" height="4" rx="1.5" fill="#fff" {...P}/><path d="M12 4.5 V7 M6 6.5 L7.8 8.5 M18 6.5 L16.2 8.5" fill="none" {...P}/></g>,
    scalpel: <g><path d="M4.5 17 C8 16 12 13 15 9.5 L18.5 5.5 C19.5 6.5 19.5 8 18.5 9.5 C15.5 13.5 10 16.5 4.5 17 Z" fill="#fff" {...P}/><path d="M15.5 9 L18 11.5" fill="none" {...P}/></g>,
    baby: <g><circle cx="12" cy="13" r="6.5" fill={CT.peachFill} {...P}/><path d="M12 6.5 Q11 4 13.5 3.5" fill="none" {...P}/><circle cx="9.8" cy="12.2" r="0.9" fill={K}/><circle cx="14.2" cy="12.2" r="0.9" fill={K}/><path d="M10.5 15.5 Q12 16.8 13.5 15.5" fill="none" {...P}/></g>,
    monitor: <g><rect x="4" y="5.5" width="16" height="11.5" rx="2" fill={CT.navy} {...P}/><path d="M6.5 12 H9 L10.5 9 L12.5 14.5 L14 12 H17.5" fill="none" stroke={CT.lime} strokeWidth={W} strokeLinejoin="round" strokeLinecap="round"/><path d="M9.5 20 H14.5" fill="none" {...P}/></g>,
    pill: <g><g transform="rotate(-35 12 12)"><rect x="4.5" y="9" width="15" height="6.5" rx="3.25" fill="#fff" {...P}/><path d="M12 9 V15.5" {...P} fill="none"/><path d="M12 9.2 H16.2 A3.05 3.05 0 0 1 16.2 15.3 H12 Z" fill={CT.lime} stroke="none"/><rect x="4.5" y="9" width="15" height="6.5" rx="3.25" fill="none" {...P}/></g></g>,
    bandage: <g><g transform="rotate(-30 12 12)"><rect x="3.5" y="9" width="17" height="6.5" rx="3.25" fill={CT.orange} {...P}/><rect x="9" y="9" width="6" height="6.5" fill="#FBE8D8" stroke={K} strokeWidth="1.6"/><circle cx="11" cy="11.2" r="0.55" fill={K}/><circle cx="13" cy="13" r="0.55" fill={K}/><circle cx="13" cy="11.2" r="0.55" fill={K}/><circle cx="11" cy="13" r="0.55" fill={K}/></g></g>,
    drop: <g><path d="M12 4 C14.5 8 17 10.5 17 14 C17 17 14.8 19.5 12 19.5 C9.2 19.5 7 17 7 14 C7 10.5 9.5 8 12 4 Z" fill={CT.sky} {...P}/><path d="M9.8 14.5 Q9.8 16.8 11.5 17.3" fill="none" stroke="#fff" strokeWidth={W} strokeLinecap="round"/></g>,
    faceWorried: <g><circle cx="12" cy="12" r="8" fill={CT.yellow} {...P}/><path d="M7.5 9 L10.5 10 M16.5 9 L13.5 10" fill="none" {...P}/><circle cx="9.5" cy="12" r="0.9" fill={K}/><circle cx="14.5" cy="12" r="0.9" fill={K}/><ellipse cx="12" cy="15.8" rx="1.7" ry="2" fill="#7A4A3A" {...P}/><path d="M18.5 5.5 C19.5 7 20 8 19 9" fill="none" stroke={CT.skyDk} strokeWidth={W} strokeLinecap="round"/></g>,
    facePain: <g><circle cx="12" cy="12" r="8" fill={CT.yellow} {...P}/><path d="M7.8 10 L10.6 12 M10.6 10 L7.8 12 M16.2 10 L13.4 12 M13.4 10 L16.2 12" fill="none" {...P}/><path d="M9.5 16.3 Q10.7 15 12 16.3 Q13.3 17.6 14.5 16.3" fill="none" {...P}/></g>,
  };
  return <svg viewBox="0 0 24 24" width={size} height={size} style={{ display: 'inline-block', verticalAlign: '-0.18em', flexShrink: 0, ...style }}>{G[name] || G.me}</svg>;
}
CT.peachFill = '#F8D8BC';


function CtCard({ rot = 0, bg = '#fff', style, children, radius = 22 }) {
  return (
    <div style={{ background: bg, border: `3.5px solid ${CT.ink}`, borderRadius: radius, boxShadow: `3px 4px 0 0 ${CT.ink}`, transform: `rotate(${rot}deg)`, position: 'relative', ...style }}>{children}</div>
  );
}
function Starburst({ size = 66, color = CT.yellow, text, rot = -8, style }) {
  const pts = [];
  const n = 12;
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 ? 38 : 50;
    const a = (Math.PI * i) / n;
    pts.push(`${50 + r * Math.cos(a)},${50 + r * Math.sin(a)}`);
  }
  return (
    <div style={{ width: size, height: size, position: 'relative', transform: `rotate(${rot}deg)`, flexShrink: 0, ...style }}>
      <svg viewBox="0 0 100 100" width={size} height={size} style={{ position: 'absolute', inset: 0 }}>
        <polygon points={pts.join(' ')} fill={color} stroke={CT.ink} strokeWidth="4"/>
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: BHS, fontSize: size * 0.22, color: CT.ink, textAlign: 'center', lineHeight: 1.05 }}>{text}</div>
    </div>
  );
}
// 하프톤 도트 배경
const HALFTONE = (c = 'rgba(43,38,34,.05)') => ({ backgroundImage: `radial-gradient(${c} 1.6px, transparent 1.6px)`, backgroundSize: '11px 11px' });

// ── 마스코트 "포리" — 청진기 두른 블롭, 표정 교체 가능 ──
function Fori({ size = 96, mood = 'happy', rot = 0 }) {
  const eye = (x, blink) => (
    <div style={{ position: 'absolute', left: `${x}%`, top: '34%', width: '17%', height: blink ? '4%' : '20%', background: blink ? CT.ink : '#fff', border: `3px solid ${CT.ink}`, borderRadius: '50%' }}>
      {!blink && <div style={{ position: 'absolute', left: '28%', top: '30%', width: '38%', height: '42%', background: CT.ink, borderRadius: '50%' }}/>}
    </div>
  );
  const mouth = { happy: { w: '34%', h: '18%', r: '0 0 60px 60px', bg: '#7A2E2E', bd: true }, oh: { w: '18%', h: '16%', r: '50%', bg: '#7A2E2E', bd: true }, grin: { w: '40%', h: '8%', r: 8, bg: CT.ink, bd: false } }[mood] || {};
  return (
    <div style={{ width: size, height: size * 0.92, position: 'relative', transform: `rotate(${rot}deg)`, flexShrink: 0 }}>
      <div style={{ position: 'absolute', inset: 0, background: CT.sky, border: `4px solid ${CT.ink}`, borderRadius: BLOB1 }}/>
      <div style={{ position: 'absolute', left: '8%', top: '12%', width: '26%', height: '18%', background: '#fff', opacity: .5, borderRadius: '50%' }}/>
      {eye(24)}{eye(56)}
      <div style={{ position: 'absolute', left: '50%', top: '58%', transform: 'translateX(-50%)', width: mouth.w, height: mouth.h, background: mouth.bg, border: mouth.bd ? `3px solid ${CT.ink}` : 'none', borderRadius: mouth.r }}/>
      {/* 볼터치 */}
      <div style={{ position: 'absolute', left: '12%', top: '56%', width: '13%', height: '9%', background: CT.pink, opacity: .55, borderRadius: '50%' }}/>
      <div style={{ position: 'absolute', right: '12%', top: '56%', width: '13%', height: '9%', background: CT.pink, opacity: .55, borderRadius: '50%' }}/>
      {/* 청진기 */}
      <svg viewBox="0 0 100 92" style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        <path d="M30 78 Q50 92 70 78" fill="none" stroke={CT.ink} strokeWidth="5" strokeLinecap="round"/>
        <circle cx="70" cy="78" r="9" fill={CT.yellow} stroke={CT.ink} strokeWidth="4"/>
      </svg>
    </div>
  );
}

// ── 폰 프레임 ──
function CtPhone({ children, label }) {
  return (
    <div style={{ boxSizing: 'border-box', width: 402, height: 874, background: CT.cream, border: `5px solid ${CT.ink}`, borderRadius: 40, overflow: 'hidden', position: 'relative', fontFamily: JUA }} data-screen-label={label}>
      <div style={{ height: 44, display: 'flex', alignItems: 'center', padding: '0 24px', fontFamily: BHS, fontSize: 15, color: CT.ink }}>
        9:41<div style={{ flex: 1 }}/><span style={{ fontSize: 12 }}>▮▮▮</span>
      </div>
      {children}
    </div>
  );
}

// ── 하단 탭 — 블롭 버튼 ──
function CtNav({ active = 'home' }) {
  const tabs = [
    { id: 'home', l: '홈', e: 'home', c: CT.yellow },
    { id: 'campus', l: '병원', e: 'hospital', c: CT.sky },
    { id: 'board', l: '상황판', e: 'board', c: CT.lime },
    { id: 'lab', l: '리뷰랩', e: 'lab', c: CT.purple },
    { id: 'me', l: '나', e: 'me', c: CT.pink },
  ];
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 82, background: '#fff', borderTop: `4px solid ${CT.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '0 8px 10px', zIndex: 30 }}>
      {tabs.map((t, i) => (
        <div key={t.id} style={{ textAlign: 'center', transform: t.id === active ? 'translateY(-14px)' : 'none' }}>
          <div style={{ width: 46, height: 44, background: t.id === active ? t.c : '#F1EADF', border: `3.5px solid ${CT.ink}`, borderRadius: [BLOB1, BLOB2, BLOB3][i % 3], display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: t.id === active ? `3px 4px 0 0 ${CT.ink}` : 'none', transform: `rotate(${i % 2 ? 1 : -1}deg)` }}><CtIcon name={t.e} size={22}/></div>
          <div style={{ fontFamily: JUA, fontSize: 11, color: CT.ink, marginTop: 3, fontWeight: t.id === active ? 700 : 400 }}>{t.l}</div>
        </div>
      ))}
    </div>
  );
}

// ══ 홈 화면 ══════════════════════════════════════════════
function CtHome() {
  return (
    <CtPhone label="Cartoon · 홈">
      <div style={{ position: 'absolute', top: 44, left: 0, right: 0, bottom: 82, overflowY: 'auto', ...HALFTONE() }}>
        {/* 인사 + 스트릭 */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '10px 20px 0' }}>
          <div>
            <div style={{ fontFamily: BHS, fontSize: 26, color: CT.ink, lineHeight: 1.15 }}>수간호사 될<br/>지민 님!</div>
            <div style={{ fontFamily: JUA, fontSize: 13, color: '#8A7F6E', marginTop: 4 }}>오늘도 병동은 그대를 기다린다…</div>
          </div>
          <div style={{ flex: 1 }}/>
          <Starburst size={70} color={CT.yellow} text={<span style={{ whiteSpace: 'nowrap' }}><CtIcon name="fire" size={15}/> 12일<br/>연속</span>} rot={5}/>
        </div>

        {/* 마스코트 히어로 — 말풍선 */}
        <CtCard rot={-0.5} bg={CT.paper} style={{ margin: '16px 18px 0', padding: '14px 16px 12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Fori size={92} mood="happy" rot={-4}/>
            <div style={{ flex: 1, position: 'relative', background: CT.yellow, border: `3.5px solid ${CT.ink}`, borderRadius: 18, padding: '10px 12px' }}>
              <div style={{ position: 'absolute', left: -13, top: 26, width: 0, height: 0, borderTop: '9px solid transparent', borderBottom: '9px solid transparent', borderRight: `13px solid ${CT.ink}` }}/>
              <div style={{ position: 'absolute', left: -8, top: 28, width: 0, height: 0, borderTop: '7px solid transparent', borderBottom: '7px solid transparent', borderRight: `10px solid ${CT.yellow}` }}/>
              <div style={{ fontFamily: JUA, fontSize: 14.5, color: CT.ink, lineHeight: 1.35 }}>“어제 /r/ 발음 좋았어!<br/>오늘은 3병동 인계에 도전?”</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <div style={{ flex: 1, background: CT.pink, border: `3.5px solid ${CT.ink}`, borderRadius: 999, boxShadow: `3px 4px 0 0 ${CT.ink}`, padding: '11px 0', textAlign: 'center', fontFamily: BHS, fontSize: 16, color: '#fff' }}>오늘의 미션 시작</div>
            <div style={{ width: 52, background: '#fff', border: `3.5px solid ${CT.ink}`, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CtIcon name="mic" size={22}/></div>
          </div>
        </CtCard>

        {/* 오늘의 호출 — 코믹 의성어 버전 */}
        <CtCard rot={0.6} bg={CT.navy} style={{ margin: '18px 18px 0', padding: '13px 14px' }} radius={26}>
          <div style={{ position: 'absolute', top: -22, left: 14 }}>
            <Starburst size={52} color={CT.pink} text={<span style={{ color: '#fff', whiteSpace: 'nowrap' }}>호출!</span>} rot={-6}/>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 52 }}>
            <div style={{ fontFamily: BHS, fontSize: 17, color: '#fff' }}><CtIcon name="pager" size={17}/> 오늘의 호출</div>
            <div style={{ flex: 1 }}/>
            <div style={{ background: CT.yellow, border: `3px solid ${CT.ink}`, borderRadius: 999, padding: '2px 10px', fontFamily: BHS, fontSize: 12, color: CT.ink, whiteSpace: 'nowrap' }}>+40 XP</div>
          </div>
          <div style={{ fontFamily: JUA, fontSize: 15.5, color: '#fff', margin: '9px 2px 0', lineHeight: 1.4 }}>“3병동 환자 통증 호소! 담당 간호사 응답 바랍니다.”</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 11 }}>
            {/* 제한시간 — 도화선 게이지 */}
            <div style={{ flex: 1, height: 14, background: '#12233A', border: `3px solid ${CT.ink}`, borderRadius: 999, position: 'relative', overflow: 'visible' }}>
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '68%', background: CT.yellow, borderRadius: 999 }}/>
              
            </div>
            <div style={{ fontFamily: BHS, fontSize: 13, color: CT.yellow, flexShrink: 0 }}>43:12</div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <div style={{ flex: 1, background: CT.lime, border: `3.5px solid ${CT.ink}`, borderRadius: 999, boxShadow: `3px 4px 0 0 ${CT.ink}`, padding: '9px 0', textAlign: 'center', fontFamily: BHS, fontSize: 15, color: CT.ink }}><CtIcon name="run" size={17}/> 지금 응답!</div>
            <div style={{ padding: '9px 16px', border: `3px dashed #5B7290`, borderRadius: 999, fontFamily: JUA, fontSize: 13, color: '#8FA8C4' }}>무시</div>
          </div>
        </CtCard>

        {/* 병동 문 — 찌그러진 블롭 그리드 */}
        <div style={{ margin: '20px 18px 0' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <div style={{ fontFamily: BHS, fontSize: 19, color: CT.ink }}>어디로 출근할까?</div>
            <div style={{ fontFamily: JUA, fontSize: 12, color: '#8A7F6E' }}>과별 시나리오</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginTop: 12 }}>
            {[
              ['siren', 'ER', CT.pink, -1], ['scalpel', 'OR', CT.sky, 0.8], ['baby', '소아과', CT.yellow, -0.5],
              ['monitor', 'ICU', CT.purple, 1], ['pill', '약국', CT.lime, -0.8], ['bandage', '외과', CT.orange, 0.5],
            ].map((d, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ height: 64, background: d[2], border: `4px solid ${CT.ink}`, borderRadius: [BLOB1, BLOB2, BLOB3][i % 3], boxShadow: `3px 4px 0 0 ${CT.ink}`, transform: `rotate(${d[3]}deg)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CtIcon name={d[0]} size={28}/></div>
                <div style={{ fontFamily: JUA, fontSize: 12.5, color: CT.ink, marginTop: 5 }}>{d[1]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 오늘의 문장 — 스티커 테이프 */}
        <CtCard rot={-0.4} bg="#fff" style={{ margin: '20px 18px 24px', padding: '16px 16px 13px' }}>
          <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%) rotate(-3deg)', width: 96, height: 22, background: CT.sky, opacity: .85, border: `2.5px solid ${CT.ink}` }}/>
          <div style={{ fontFamily: JUA, fontSize: 12, color: CT.pinkDk }}>오늘의 문장</div>
          <div style={{ fontFamily: BHS, fontSize: 18, color: CT.ink, marginTop: 5, lineHeight: 1.3 }}>“On a scale of 0 to 10,<br/>how bad is your pain?”</div>
          <div style={{ fontFamily: JUA, fontSize: 12.5, color: '#8A7F6E', marginTop: 5 }}>0에서 10까지, 통증이 얼마나 심한가요?</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <div style={{ background: CT.yellow, border: `3px solid ${CT.ink}`, borderRadius: 999, padding: '5px 13px', fontFamily: JUA, fontSize: 12.5, color: CT.ink, boxShadow: `2px 3px 0 0 ${CT.ink}` }}><CtIcon name="speaker" size={15}/> 듣기</div>
            <div style={{ background: '#fff', border: `3px solid ${CT.ink}`, borderRadius: 999, padding: '5px 13px', fontFamily: JUA, fontSize: 12.5, color: CT.ink }}><CtIcon name="mic" size={15}/> 따라하기</div>
          </div>
        </CtCard>
      </div>
      <CtNav active="home"/>
    </CtPhone>
  );
}

// ══ 대화 화면 ══════════════════════════════════════════════
function CtDialogue() {
  return (
    <CtPhone label="Cartoon · 대화">
      <div style={{ position: 'absolute', top: 44, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column' }}>
        {/* 무대 — 상대 캐릭터 + 감정 */}
        <div style={{ height: 240, background: CT.sky, borderBottom: `4px solid ${CT.ink}`, position: 'relative', overflow: 'hidden', ...HALFTONE('rgba(255,255,255,.35)') }}>
          <div style={{ position: 'absolute', left: 16, top: 12, background: '#fff', border: `3px solid ${CT.ink}`, borderRadius: 999, padding: '3px 12px', fontFamily: BHS, fontSize: 12, color: CT.ink, whiteSpace: 'nowrap' }}>ER · 흉통 환자 트리아지</div>
          <div style={{ position: 'absolute', right: 16, top: 12, background: CT.yellow, border: `3px solid ${CT.ink}`, borderRadius: 999, padding: '3px 10px', fontFamily: JUA, fontSize: 11.5, color: CT.ink, whiteSpace: 'nowrap' }}><CtIcon name="faceWorried" size={15}/> 불안함</div>
          {/* 환자 블롭 캐릭터 */}
          <div style={{ position: 'absolute', left: '50%', bottom: -8, transform: 'translateX(-50%)' }}>
            <Fori size={150} mood="oh" rot={2}/>
          </div>
          {/* 땀방울 */}
          <div style={{ position: 'absolute', left: '31%', bottom: 96, transform: 'rotate(-12deg)' }}><CtIcon name="drop" size={24}/></div>
          {/* 상대 대사 말풍선 */}
          <div style={{ position: 'absolute', right: 12, bottom: 18, width: 190, background: '#fff', border: `3.5px solid ${CT.ink}`, borderRadius: 18, padding: '9px 11px', boxShadow: `3px 4px 0 0 ${CT.ink}` }}>
            <div style={{ position: 'absolute', left: -14, bottom: 18, width: 0, height: 0, borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderRight: `14px solid ${CT.ink}` }}/>
            <div style={{ fontFamily: JUA, fontSize: 13.5, color: CT.ink, lineHeight: 1.35 }}>My chest… it feels like something is squeezing it.</div>
          </div>
        </div>
        {/* 대화 로그 */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px', ...HALFTONE() }}>
          <div style={{ textAlign: 'center', margin: '2px 0 12px' }}>
            <span style={{ background: '#EFE6D4', border: `2.5px dashed ${CT.ink}`, borderRadius: 999, padding: '3px 14px', fontFamily: JUA, fontSize: 11, color: '#8A7F6E' }}>— 지난 대화 —</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
            <div style={{ maxWidth: '78%', background: CT.lime, border: `3.5px solid ${CT.ink}`, borderRadius: '18px 18px 4px 18px', padding: '9px 12px', boxShadow: `3px 3px 0 0 ${CT.ink}` }}>
              <div style={{ fontFamily: JUA, fontSize: 14, color: CT.ink }}>When did the pain start?</div>
              <div style={{ display: 'flex', gap: 5, marginTop: 5, justifyContent: 'flex-end' }}>
                <span style={{ background: '#fff', border: `2px solid ${CT.ink}`, borderRadius: 999, padding: '0 7px', fontFamily: BHS, fontSize: 10, color: CT.ink, whiteSpace: 'nowrap' }}>발음 92</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', marginBottom: 10 }}>
            <div style={{ maxWidth: '80%', background: '#fff', border: `3.5px solid ${CT.ink}`, borderRadius: '18px 18px 18px 4px', padding: '9px 12px' }}>
              <div style={{ fontFamily: BHS, fontSize: 10.5, color: CT.pinkDk, marginBottom: 3, whiteSpace: 'nowrap' }}>MR. PARK · <CtIcon name="facePain" size={14}/> 통증</div>
              <div style={{ fontFamily: JUA, fontSize: 14, color: CT.ink }}>About thirty minutes ago, while I was climbing the stairs.</div>
            </div>
          </div>
        </div>
        {/* 입력 바 */}
        <div style={{ background: '#fff', borderTop: `4px solid ${CT.ink}`, padding: '12px 14px 26px', display: 'flex', gap: 9, alignItems: 'center' }}>
          <div style={{ width: 46, height: 46, background: CT.yellow, border: `3.5px solid ${CT.ink}`, borderRadius: BLOB2, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-3deg)' }}><CtIcon name="bulb" size={22}/></div>
          <div style={{ flex: 1, height: 48, background: CT.cream, border: `3.5px solid ${CT.ink}`, borderRadius: 999, display: 'flex', alignItems: 'center', padding: '0 16px', fontFamily: JUA, fontSize: 13, color: '#A89A82' }}>영어로 대답해 보세요…</div>
          <div style={{ width: 54, height: 54, background: CT.pink, border: `4px solid ${CT.ink}`, borderRadius: BLOB1, boxShadow: `3px 4px 0 0 ${CT.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(3deg)' }}><CtIcon name="mic" size={26}/></div>
        </div>
      </div>
    </CtPhone>
  );
}

// ══ 캔버스 ══════════════════════════════════════════════
function CartoonApp() {
  const [bump] = React.useState(0);
  return (
    <DesignCanvas key={bump}>
      <DCSection id="cartoon" title="forin Cartoon 시안" subtitle="카툰 그림체 리디자인 — 굵은 잉크 아웃라인 · 블롭 실루엣 · 채도 높은 플랫 컬러 · 스티커 기울임 · 코믹 의성어">
        <DCArtboard eager={true} id="ct-home" label="A · 홈" width={402} height={874}><CtHome/></DCArtboard>
        <DCArtboard eager={true} id="ct-dlg" label="B · 대화" width={402} height={874}><CtDialogue/></DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<CartoonApp/>);
