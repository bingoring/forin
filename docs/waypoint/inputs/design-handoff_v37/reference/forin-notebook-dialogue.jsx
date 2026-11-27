// forin-notebook-dialogue.jsx — 상황 내 대화 화면 2모드 (수첩 그림체)
// 실구현 구조: 상단 초상화 무대(손잡이로 높이 조절) / QUICK INFO 칩 / 메시지
// 목록(손잡이) / 하단 입력 — ① 직접 말하기(SPEAK FREELY) ② 보기 중 선택(옵션
// 영역에도 손잡이 + 접기). 여기서는 각 모드를 아트보드로 고정 표현.
(function () {
  const c = { bg: '#F1EBDD', paper: '#FFFdf4', ink: '#3E362B', soft: '#9A8F7C', red: '#C75146', blue: '#4A6FA5', green: '#5F8D5A', stage: '#F6E3DC', tape: 'rgba(160,200,220,.55)' };
  const HW = '"Gaegu","Nanum Pen Script",cursive';
  const F = '"Pretendard",sans-serif';
  const NbIcon = window.NbIcon;
  const paper = (rot = 0) => ({ background: c.paper, border: `1px solid #E0D6C0`, boxShadow: '0 2px 6px rgba(62,54,43,.14)', transform: `rotate(${rot}deg)`, position: 'relative' });
  const grab = { width: 52, height: 5, background: 'rgba(62,54,43,.25)', borderRadius: 99, margin: '7px auto' };

  // 낙서 초상화 — role: 'patient' | 'medic'
  function Portrait({ role }) {
    const P = { stroke: c.ink, strokeWidth: 2, strokeLinejoin: 'round', strokeLinecap: 'round', fill: 'none' };
    return (
      <svg viewBox="0 0 100 110" width="118" height="130">
        {role === 'medic' && <g><path d="M28 30 Q28 12 50 12 Q72 12 72 30 L72 34 H28 Z" fill="#3E4A66" {...P}/><rect x="24" y="32" width="52" height="7" rx="2" fill="#3E4A66" {...P}/><rect x="45" y="20" width="10" height="6" rx="1" fill="#E9C45A" {...P}/></g>}
        {role === 'patient' && <path d="M28 34 Q26 14 50 14 Q74 14 72 34 L70 42 Q50 36 30 42 Z" fill="#8A6A4A" {...P}/>}
        <circle cx="50" cy="48" r="22" fill="#F6DCC0" {...P}/>
        {role === 'patient'
          ? <g><path d="M40 46 L47 49 M47 46 L40 49 M60 46 L53 49 M53 46 L60 49" {...P}/><path d="M42 60 Q46 57 50 60 Q54 63 58 60" {...P}/><path d="M73 40 C75 43 76 45 74 47" stroke={c.blue} strokeWidth="2" fill="none" strokeLinecap="round"/></g>
          : <g><circle cx="42" cy="47" r="1.6" fill={c.ink} stroke="none"/><circle cx="58" cy="47" r="1.6" fill={c.ink} stroke="none"/><path d="M44 60 H56" {...P}/><circle cx="36" cy="54" r="3" fill="rgba(199,81,70,.25)" stroke="none"/><circle cx="64" cy="54" r="3" fill="rgba(199,81,70,.25)" stroke="none"/></g>}
        <path d="M26 108 Q28 82 50 82 Q72 82 74 108" fill={role === 'medic' ? '#E9C45A' : '#B8CBB0'} {...P}/>
      </svg>
    );
  }

  function TopBar() {
    return (
      <div style={{ position: 'absolute', top: 50, left: 16, right: 16, display: 'flex', alignItems: 'center', zIndex: 5 }}>
        <div style={{ ...paper(-1), width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HW, fontSize: 17, color: c.red }}>✕</div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <div style={{ ...paper(0.5), padding: '6px 16px', fontFamily: HW, fontSize: 15, color: c.green }}>✓ 상황 종료</div>
        </div>
        <div style={{ ...paper(1), padding: '6px 10px', fontFamily: HW, fontSize: 14, color: c.ink, background: 'rgba(249,227,123,.5)' }}>미션 4 ∨</div>
      </div>
    );
  }

  function Stage({ role, name, tag, short }) {
    return (
      <div style={{ height: short ? 168 : 236, background: c.stage, borderBottom: `1.5px solid #E0D6C0`, position: 'relative' }}>
        <div style={{ position: 'absolute', left: '50%', top: short ? 38 : 54, transform: 'translateX(-50%)' }}>
          <div style={{ ...paper(-1.5), padding: '8px 8px 4px' }}>
            <div style={{ position: 'absolute', top: -9, left: '50%', transform: 'translateX(-50%) rotate(-3deg)', width: 58, height: 16, background: c.tape }}/>
            <div style={{ height: short ? 92 : 120, overflow: 'hidden', display: 'flex', justifyContent: 'center' }}><Portrait role={role}/></div>
          </div>
        </div>
        <div style={{ position: 'absolute', left: 22, top: short ? 60 : 88 }}>
          <div style={{ ...paper(-2), padding: '3px 9px', fontFamily: '"IBM Plex Mono",monospace', fontSize: 11, fontWeight: 700, color: c.ink, whiteSpace: 'nowrap' }}>{name}</div>
          <div style={{ marginTop: 6, display: 'inline-block', background: c.red, color: '#fff', fontSize: 9.5, fontWeight: 800, letterSpacing: 1, padding: '2px 7px', transform: 'rotate(-2deg)' }}>{tag}</div>
        </div>
        <div style={{ position: 'absolute', right: 26, top: short ? 66 : 96 }}>
          <div style={{ ...paper(2), width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><NbIcon name="speaker" size={17}/></div>
        </div>
      </div>
    );
  }

  function QuickInfo() {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '2px 16px 0' }}>
        <span style={{ fontFamily: '"IBM Plex Mono",monospace', fontSize: 9, fontWeight: 700, letterSpacing: 1, color: c.soft, border: `1.3px solid ${c.soft}`, padding: '2px 6px', whiteSpace: 'nowrap' }}>QUICK INFO</span>
        {[['board','차트'],['pill','약물'],['monitor','활력']].map((q, i) => (
          <span key={i} style={{ ...paper(i % 2 ? 0.8 : -0.8), display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 9px', fontFamily: HW, fontSize: 14, color: c.ink }}><NbIcon name={q[0]} size={14}/> {q[1]}</span>
        ))}
      </div>
    );
  }

  const bubbleMine = { ...paper(0), marginLeft: 40, padding: '9px 12px', fontFamily: F, fontSize: 13.5, color: c.ink, lineHeight: 1.5 };
  const bubbleNpc = { ...paper(0), marginRight: 40, padding: '9px 12px', fontFamily: F, fontSize: 13.5, color: c.ink, lineHeight: 1.5, background: '#FCEEDC', borderColor: '#E8D2B0' };

  // ── D · 직접 대화 (SPEAK FREELY) ──
  function DialogueSpeak() {
    return (
      <div style={{ boxSizing: 'border-box', width: 402, height: 874, background: c.bg, backgroundImage: 'repeating-linear-gradient(transparent 0 27px, rgba(62,54,43,.06) 27px 28px)', borderRadius: 40, overflow: 'hidden', position: 'relative', fontFamily: F }} data-screen-label="수첩 대화 · 직접">
        <div style={{ height: 44, display: 'flex', alignItems: 'center', padding: '0 24px', fontSize: 14, fontWeight: 700, color: c.ink }}>9:41<div style={{ flex: 1 }}/>▮▮▮</div>
        <TopBar/>
        <div style={{ position: 'absolute', top: 44, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column' }}>
          <Stage role="patient" name="Mrs. Hopkins" tag="PAIN"/>
          <div style={grab}/>
          <QuickInfo/>
          <div style={{ flex: 1, overflowY: 'auto', padding: '10px 16px 4px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={bubbleMine}>Hello Mrs. Hopkins, I am your nurse today. Where is the pain, and what does it feel like?</div>
            <div style={bubbleNpc}>It's my back…Feels like stabbing, really sharp.</div>
            <div style={bubbleMine}>Zero to ten, how bad is it right now? Does it spread anywhere?</div>
            <div style={bubbleNpc}>It's a nine…Maybe ten. It's just all over my back, nowhere else.</div>
            <div style={{ ...bubbleMine, opacity: .6 }}>When did it start, and does…</div>
          </div>
          <div style={grab}/>
          <div style={{ padding: '0 16px 22px' }}>
            <div style={{ fontFamily: '"IBM Plex Mono",monospace', fontSize: 9.5, fontWeight: 700, letterSpacing: 1, color: c.soft }}>SPEAK FREELY · 마이크를 눌러 말하기</div>
            <div style={{ ...paper(0), marginTop: 7, display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px' }}>
              <div style={{ width: 38, height: 38, background: 'rgba(95,141,90,.15)', border: `1.7px solid ${c.ink}`, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><NbIcon name="mic" size={20}/></div>
              <div style={{ fontFamily: HW, fontSize: 16, color: '#B4A88F', lineHeight: 1.3 }}>자유롭게 영어로 답하거나<br/>마이크로 말해보세요…</div>
            </div>
            <div style={{ display: 'flex', gap: 9, marginTop: 10 }}>
              <div style={{ ...paper(0), flex: 1, padding: '9px 0', textAlign: 'center', fontFamily: HW, fontSize: 15, color: c.soft, opacity: .6 }}>▷ 보내기</div>
              <div style={{ ...paper(0.5), padding: '9px 16px', fontFamily: HW, fontSize: 15, color: c.ink }}><NbIcon name="bulb" size={15}/> 힌트</div>
              <div style={{ ...paper(-0.5), padding: '9px 13px', fontFamily: HW, fontSize: 15, color: c.ink }}><NbIcon name="board" size={15}/> 3</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── E · 보기 중 선택 (옵션 시트 · 영역 조절 손잡이) ──
  function DialogueOptions() {
    const opt = (txt, rot) => (
      <div style={{ ...paper(rot), display: 'flex', alignItems: 'stretch', marginTop: 9, overflow: 'hidden' }}>
        <div style={{ flex: 1, padding: '10px 12px', fontFamily: F, fontSize: 13.5, color: c.ink, lineHeight: 1.45 }}>{txt}</div>
        <div style={{ width: 56, background: 'rgba(249,227,123,.55)', borderLeft: `1.5px solid #E0D6C0`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, flexShrink: 0 }}>
          <NbIcon name="mic" size={16}/>
          <span style={{ fontFamily: HW, fontSize: 12.5, color: c.ink }}>말하기</span>
        </div>
      </div>
    );
    return (
      <div style={{ boxSizing: 'border-box', width: 402, height: 874, background: c.bg, backgroundImage: 'repeating-linear-gradient(transparent 0 27px, rgba(62,54,43,.06) 27px 28px)', borderRadius: 40, overflow: 'hidden', position: 'relative', fontFamily: F }} data-screen-label="수첩 대화 · 보기 선택">
        <div style={{ height: 44, display: 'flex', alignItems: 'center', padding: '0 24px', fontSize: 14, fontWeight: 700, color: c.ink }}>9:41<div style={{ flex: 1 }}/>▮▮▮</div>
        <TopBar/>
        <div style={{ position: 'absolute', top: 44, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column' }}>
          <Stage role="medic" name="Paramedic Ruiz" tag="FOCUSED" short={true}/>
          <div style={grab}/>
          <QuickInfo/>
          <div style={{ overflowY: 'auto', padding: '10px 16px 2px', display: 'flex', flexDirection: 'column', gap: 10, height: 148 }}>
            <div style={bubbleNpc}>
              32-year-old, restrained driver, head-on collision. GCS 14, BP 100 over 60.
              <div style={{ marginTop: 7 }}><span style={{ background: 'rgba(95,141,90,.2)', border: `1.5px solid ${c.green}`, borderRadius: 3, padding: '2px 8px', fontFamily: HW, fontSize: 12.5, color: c.green }}>tap to 번역</span></div>
            </div>
          </div>
          <div style={grab}/>
          {/* 옵션 영역 — 자체 손잡이 + 접기 */}
          <div style={{ flex: 1, padding: '2px 16px 0', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <div style={{ display: 'flex', alignItems: 'baseline' }}>
              <span style={{ fontFamily: HW, fontSize: 15.5, color: c.ink }}>이렇게 말해볼 수 있어요</span>
              <div style={{ flex: 1 }}/>
              <span style={{ fontFamily: HW, fontSize: 14, color: c.soft }}>접기 ∧</span>
            </div>
            <div style={{ overflowY: 'auto', minHeight: 0 }}>
              {opt(<span>Can you tell me the mechanism of injury and the patient's vital signs, please?</span>, -0.4)}
              {opt(<span>What treatments have been provided so far for this patient?</span>, 0.4)}
              {opt(<span>I understand it's a head-on collision; can you confirm the patient's name?</span>, -0.3)}
            </div>
            <div style={{ textAlign: 'center', padding: '7px 0', fontFamily: HW, fontSize: 14.5, color: c.blue, textDecoration: 'underline', textUnderlineOffset: 3 }}>직접 입력할래요</div>
          </div>
          <div style={{ display: 'flex', gap: 9, padding: '0 16px 22px' }}>
            <div style={{ ...paper(0), flex: 1, padding: '9px 0', textAlign: 'center', fontFamily: HW, fontSize: 15, color: c.soft, opacity: .6 }}>▷ 보내기</div>
            <div style={{ ...paper(0.5), padding: '9px 16px', fontFamily: HW, fontSize: 15, color: c.ink }}><NbIcon name="bulb" size={15}/> 힌트</div>
            <div style={{ ...paper(-0.5), padding: '9px 13px', fontFamily: HW, fontSize: 15, color: c.ink }}><NbIcon name="board" size={15}/></div>
          </div>
        </div>
      </div>
    );
  }

  Object.assign(window, { DialogueSpeak, DialogueOptions });
})();
