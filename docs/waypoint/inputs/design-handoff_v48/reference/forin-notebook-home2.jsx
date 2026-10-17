// forin-notebook-home2.jsx — 홈 개선안: "출근 브리핑 데스크"
// 콘셉트: 홈 = 매일 아침 받는 근무 브리핑 쪽지. 기기 시간에 맞춰 상단 미니 병동이
// 라이브로 바뀌고(DAY/EVENING/NIGHT — 출현 시나리오 확률도 변함), 오늘의 호출(제한시간),
// 오늘 할 일 3칸 체크, 이어서 하기 좌표, 오늘의 문장, 동료 소식 한 줄로 구성.
(function () {
  const { NbPaper, NbButton, NbTag, NbMark, NbMemo, NbCheck } = window.NbUI;
  const NbIcon = window.NbIcon;
  const HW = '"Gaegu","Nanum Pen Script",cursive';
  const F = '"Pretendard",sans-serif';
  const MONO = '"IBM Plex Mono",monospace';
  const c = { bg: '#F1EBDD', paper: '#FFFdf4', ink: '#3E362B', soft: '#9A8F7C', red: '#C75146', blue: '#4A6FA5', green: '#5F8D5A', tape: 'rgba(160,200,220,.55)' };

  if (!document.getElementById('nb-home2-css')) {
    const s = document.createElement('style');
    s.id = 'nb-home2-css';
    s.textContent = `
@keyframes nbh-blink{0%,60%{opacity:1}70%,100%{opacity:.15}}
@keyframes nbh-walk{0%{transform:translateX(0)}50%{transform:translateX(52px)}100%{transform:translateX(0)}}
@keyframes nbh-pulse{0%,100%{opacity:.9}50%{opacity:.35}}
@keyframes nbh-shake{0%,90%,100%{transform:rotate(-.4deg)}93%{transform:rotate(.8deg) translateX(-1px)}96%{transform:rotate(-1deg) translateX(1px)}}
`;
    document.head.appendChild(s);
  }

  function Frame({ label, children }) {
    return (
      <div style={{ boxSizing: 'border-box', width: 402, height: 874, background: c.bg, backgroundImage: 'repeating-linear-gradient(transparent 0 27px, rgba(62,54,43,.06) 27px 28px)', borderRadius: 40, overflow: 'hidden', position: 'relative', fontFamily: F }} data-screen-label={label}>
        <div style={{ height: 44, display: 'flex', alignItems: 'center', padding: '0 24px', fontSize: 14, fontWeight: 700, color: c.ink }}>9:41<div style={{ flex: 1 }}/>▮▮▮</div>
        <div style={{ position: 'absolute', top: 44, left: 0, right: 0, bottom: 68, overflowY: 'auto' }}>{children}</div>
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

  // ── 라이브 병동 (기기 시간 연동 · 수첩 낙서판) ──
  function LiveWardNb({ mode }) {
    const M = {
      day: { sky: '#C7E0EE', label: 'DAY · 회진 시간', sub: '병동이 가장 분주한 시간 · 회진 대화 출현↑', npc2: true, night: false },
      evening: { sky: '#F2D3C4', label: 'EVENING · 인계 준비', sub: '교대 인계 시간 · SBAR 시나리오 출현↑', npc2: true, night: false },
      night: { sky: '#3D4A63', label: 'NIGHT · 밤 근무', sub: '고요한 병동 · 야간 호출 이벤트 출현↑', npc2: false, night: true },
    }[mode];
    const P2 = { stroke: c.ink, strokeWidth: 1.7, strokeLinejoin: 'round', strokeLinecap: 'round' };
    return (
      <NbPaper rot={-0.5} tape tapeLeft={140} style={{ margin: '0 20px', padding: 0, overflow: 'hidden' }}>
        {/* 창밖 하늘 */}
        <div style={{ height: 25, background: M.sky, borderBottom: '1.5px solid rgba(62,54,43,.35)', position: 'relative' }}>
          {M.night && [[16, 7], [58, 13], [104, 5], [160, 11], [225, 7], [280, 14], [330, 6]].map((p, i) => (
            <div key={i} style={{ position: 'absolute', left: p[0], top: p[1], width: 3, height: 3, borderRadius: 99, background: '#F5ECC8', animation: `nbh-blink ${2 + i * .5}s steps(1) infinite` }}/>))}
          {mode === 'day' && <svg viewBox="0 0 20 20" width="17" height="17" style={{ position: 'absolute', right: 12, top: 4 }}><circle cx="10" cy="10" r="5.5" fill="#F5ECC8" {...P2}/><path d="M10 1.5 V3.5 M10 16.5 V18.5 M1.5 10 H3.5 M16.5 10 H18.5" {...P2} fill="none"/></svg>}
          {mode === 'evening' && <svg viewBox="0 0 20 12" width="19" height="12" style={{ position: 'absolute', right: 12, top: 8 }}><path d="M2 11 A8 8 0 0 1 18 11 Z" fill="#E3AC7E" {...P2}/></svg>}
          {mode === 'night' && <svg viewBox="0 0 16 16" width="15" height="15" style={{ position: 'absolute', right: 13, top: 4 }}><path d="M12.5 2.5 A6.5 6.5 0 1 0 13.5 12 A5.4 5.4 0 0 1 12.5 2.5 Z" fill="#F5ECC8" {...P2}/></svg>}
          <span style={{ position: 'absolute', left: 9, top: 5, fontFamily: MONO, fontSize: 8, fontWeight: 700, letterSpacing: 1, color: M.night ? '#F5ECC8' : c.ink, background: M.night ? 'rgba(62,54,43,.4)' : 'rgba(255,253,244,.7)', padding: '1px 5px' }}>{M.label}</span>
        </div>
        {/* 병동 낙서 장면 */}
        <div style={{ height: 82, position: 'relative', background: 'linear-gradient(#FFFdf4 60%, #EFE7D4 60%)' }}>
          {M.night && <div style={{ position: 'absolute', inset: 0, background: '#3D4A63', opacity: .2, zIndex: 3, pointerEvents: 'none' }}/>}
          {/* 침대 3개 */}
          {[116, 176, 236].map((x) => (
            <svg key={x} viewBox="0 0 46 26" width="46" height="26" style={{ position: 'absolute', left: x, bottom: 7 }}>
              <rect x="1.5" y="7" width="43" height="13" fill="#FFFdf4" {...P2}/>
              <rect x="4" y="9.5" width="10" height="6" fill="#FFFdf4" {...P2} strokeWidth="1.3"/>
              <path d="M16 9.5 H42 V17 H16 Z" fill="#DFEDE2" stroke={c.ink} strokeWidth="1.3"/>
              <path d="M1.5 20 V24 M44.5 20 V24" {...P2} fill="none"/>
            </svg>
          ))}
          {/* 바이탈 모니터 */}
          <svg viewBox="0 0 30 24" width="30" height="24" style={{ position: 'absolute', right: 12, top: 6 }}>
            <rect x="1.5" y="1.5" width="27" height="17" fill="#3D4A63" {...P2}/>
            <path d="M5 11 H10 L12 7 L15 14 L17 11 H25" fill="none" stroke="#8FD8A4" strokeWidth="1.6" strokeLinejoin="round" style={{ animation: 'nbh-pulse 1.3s infinite' }}/>
            <path d="M11 19 V22 M19 19 V22" {...P2} fill="none"/>
          </svg>
          {/* 순회 간호사 — 2등신 캐릭터 아장아장 */}
          <div style={{ position: 'absolute', left: 16, bottom: 4, animation: 'nbh-walk 7s ease-in-out infinite', zIndex: 2 }}>
            {window.NbCharacter ? <window.NbCharacter size={30} hair="bob" hairColor="darkbrown" outfitColor="mint" eyes="dot" mouth="smile" walk/> : <NbIcon name="me" size={24}/>}
          </div>
          {M.npc2 && (
            <div style={{ position: 'absolute', right: 52, bottom: 4, zIndex: 2 }}>
              {window.NbCharacter ? <window.NbCharacter size={30} hair="short" hairColor="black" outfitColor="navy" eyes="dot" mouth="line" flip/> : <NbIcon name="me" size={24}/>}
            </div>
          )}
        </div>
        {/* 무드 설명 바 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '6px 11px', borderTop: '1.5px dashed rgba(62,54,43,.25)' }}>
          <span style={{ width: 7, height: 7, borderRadius: 99, background: c.red, animation: 'nbh-blink 1.4s steps(1) infinite', flexShrink: 0 }}/>
          <span style={{ fontFamily: HW, fontSize: 13.5, color: c.ink }}>{M.sub}</span>
        </div>
      </NbPaper>
    );
  }

  // ── 오늘의 호출 (페이저 쪽지 · 하루 1회) ──
  function PagingNb({ answered }) {
    if (answered) return (
      <NbPaper rot={0.4} style={{ margin: '13px 20px 0', padding: '9px 13px', display: 'flex', alignItems: 'center', gap: 9 }}>
        <NbIcon name="pager" size={17}/>
        <span style={{ fontFamily: HW, fontSize: 14, color: c.soft, flex: 1 }}>오늘의 호출 응답 완료 · 보너스 +40 XP</span>
        <NbTag color={c.green} rot={-2}>✓ 응답함</NbTag>
      </NbPaper>
    );
    return (
      <div style={{ margin: '13px 20px 0', animation: 'nbh-shake 3.2s infinite' }}>
        <NbPaper rot={0} style={{ padding: 0, overflow: 'hidden', boxShadow: '0 3px 10px rgba(62,54,43,.22)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 12px', background: 'rgba(199,81,70,.12)', borderBottom: `1.5px solid ${c.red}` }}>
            <span style={{ width: 8, height: 8, borderRadius: 99, background: c.red, animation: 'nbh-blink .8s steps(1) infinite', flexShrink: 0 }}/>
            <span style={{ fontFamily: HW, fontSize: 15.5, color: c.red }}><NbIcon name="pager" size={15}/> 오늘의 호출</span>
            <div style={{ flex: 1 }}/>
            <NbTag color={c.red} rot={2}>+40 XP</NbTag>
          </div>
          <div style={{ padding: '11px 13px 13px' }}>
            <div style={{ fontFamily: HW, fontSize: 17.5, color: c.ink, lineHeight: 1.4 }}>"3병동 환자 통증 호소! 담당 간호사 응답 바랍니다."</div>
            <div style={{ fontSize: 11, color: c.soft, marginTop: 4 }}>응답하면 통증 사정 단기 시나리오 즉시 입장 · 약 3분</div>
            <div style={{ marginTop: 10, height: 10, border: `1.5px solid ${c.ink}`, position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 1.5, width: '72%', background: 'repeating-linear-gradient(-45deg, rgba(233,196,90,.9) 0 5px, rgba(233,196,90,.5) 5px 10px)' }}/>
            </div>
            <div style={{ display: 'flex', marginTop: 4, alignItems: 'baseline' }}>
              <span style={{ fontFamily: MONO, fontSize: 10, fontWeight: 700, color: c.red }}>⏱ 43:12 남음</span>
              <div style={{ flex: 1 }}/>
              <span style={{ fontFamily: HW, fontSize: 12, color: c.soft }}>오늘 놓치면 소멸</span>
            </div>
            <div style={{ display: 'flex', gap: 9, marginTop: 11 }}>
              <div style={{ flex: 1 }}><NbButton variant="yellow" size="md" full>지금 응답 <NbIcon name="run" size={15}/></NbButton></div>
              <NbButton variant="ghost" size="md">무시</NbButton>
            </div>
          </div>
        </NbPaper>
      </div>
    );
  }

  // ── 오늘 할 일 3칸 (브리핑 체크) ──
  function TodayBrief({ done = 1 }) {
    const rows = [
      ['복습 5장 넘기기', '리뷰랩 · 약 4분', 'lab', done >= 1],
      ['커리큘럼 이어서 하기', 'ER 2-3 · 투약 설명 · 약 8분', 'hospital', done >= 2],
      ['오늘의 문장 따라 말하기', '발음 연습 · 약 1분', 'mic', done >= 3],
    ];
    return (
      <NbPaper rot={0.4} style={{ margin: '13px 20px 0', padding: '4px 14px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', paddingTop: 9 }}>
          <span style={{ fontFamily: HW, fontSize: 17.5, color: c.ink }}>오늘의 근무 브리핑</span>
          <div style={{ flex: 1 }}/>
          <span style={{ fontFamily: MONO, fontSize: 10.5, fontWeight: 700, color: done >= 3 ? c.green : c.soft }}>{done}/3</span>
        </div>
        {rows.map((r, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 10, marginTop: 9, borderTop: '1.3px dashed rgba(62,54,43,.15)' }}>
            <NbCheck done={r[3]}/>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontFamily: HW, fontSize: 15.5, color: c.ink, textDecoration: r[3] ? 'line-through' : 'none', textDecorationColor: c.soft }}>{r[0]}</div>
              <div style={{ fontSize: 10, color: c.soft, marginTop: 1 }}>{r[1]}</div>
            </div>
            {!r[3] && <span style={{ fontFamily: HW, fontSize: 13, color: c.blue, whiteSpace: 'nowrap' }}>하러 가기 ›</span>}
          </div>
        ))}
        <div style={{ marginTop: 11, fontFamily: HW, fontSize: 12.5, color: c.soft }}>3칸을 다 채우면 오늘 근무 도장이 찍혀요 — 연속 12일째 ✎</div>
      </NbPaper>
    );
  }

  // ── 이어서 하기 (커리큘럼 좌표) ──
  function ContinueCard() {
    return (
      <NbPaper rot={-0.4} tape tapeLeft={120} style={{ margin: '13px 20px 0', padding: '12px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <NbIcon name="siren" size={26}/>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: c.blue, letterSpacing: 1 }}>이어서 하기 · ER 2-3</div>
            <div style={{ fontFamily: HW, fontSize: 17, color: c.ink, marginTop: 2, lineHeight: 1.2 }}>진통제 투약 설명 — 2/4 단계</div>
            <div style={{ marginTop: 6, height: 7, border: `1.4px solid ${c.ink}`, width: '86%' }}>
              <div style={{ height: '100%', width: '50%', background: 'repeating-linear-gradient(-45deg, rgba(95,141,90,.7) 0 5px, rgba(95,141,90,.4) 5px 10px)' }}/>
            </div>
          </div>
          <NbButton variant="ink" size="sm">계속 ›</NbButton>
        </div>
      </NbPaper>
    );
  }

  // ── 오늘의 문장 ──
  function PhraseCard() {
    return (
      <NbPaper rot={0.5} style={{ margin: '13px 20px 0', padding: '12px 14px' }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: c.blue, letterSpacing: 1 }}>오늘의 문장 · 통증 사정</div>
        <div style={{ fontSize: 15.5, fontWeight: 700, color: c.ink, marginTop: 6, lineHeight: 1.5 }}><mark style={{ background: 'linear-gradient(transparent 55%, #F9E37B 55%)', padding: '0 2px' }}>On a scale of 0 to 10, how bad is your pain?</mark></div>
        <div style={{ fontFamily: HW, fontSize: 14, color: c.soft, marginTop: 3 }}>0에서 10까지라면, 통증이 얼마나 심한가요?</div>
        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          <NbButton variant="paper" size="sm" icon="speaker">듣기</NbButton>
          <NbButton variant="yellow" size="sm" icon="mic">따라하기</NbButton>
        </div>
      </NbPaper>
    );
  }

  // ── 동료 소식 한 줄 ──
  function PeerLine() {
    return (
      <NbPaper rot={-0.3} style={{ margin: '13px 20px 20px', padding: '9px 13px', display: 'flex', alignItems: 'center', gap: 10 }}>
        {window.NbAvatar ? <window.NbAvatar size={26} hair="ponytail" hairColor="brown" outfit="scrubV" outfitColor="sky" eyes="lash" mouth="smile" bg="washSky"/> : <NbIcon name="me" size={22}/>}
        <span style={{ fontFamily: HW, fontSize: 13.5, color: c.ink, flex: 1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Jiyoon님이 NCLEX 모의 1차를 통과했어요 🎉</span>
        <span style={{ fontFamily: HW, fontSize: 12.5, color: c.blue, whiteSpace: 'nowrap' }}>응원 ›</span>
      </NbPaper>
    );
  }

  function HomeV2({ mode = 'day', answered = false, done = 1 }) {
    const label = { day: 'DAY', evening: 'EVENING', night: 'NIGHT' }[mode];
    return (
      <Frame label={`수첩 홈 개선안 · ${label}`}>
        <div style={{ display: 'flex', alignItems: 'baseline', padding: '8px 20px 11px' }}>
          <div style={{ fontFamily: HW, fontSize: 27, color: c.ink }}>{mode === 'night' ? '오늘도 무사히, 밤 근무' : '좋은 아침, Minji'}</div>
          <div style={{ flex: 1 }}/>
          <span style={{ fontFamily: HW, fontSize: 13.5, color: c.soft, whiteSpace: 'nowrap' }}><NbIcon name="fire" size={14}/> 12일째</span>
        </div>
        <LiveWardNb mode={mode}/>
        <PagingNb answered={answered}/>
        <TodayBrief done={done}/>
        <ContinueCard/>
        <PhraseCard/>
        <PeerLine/>
      </Frame>
    );
  }

  Object.assign(window, { HomeV2 });
})();
