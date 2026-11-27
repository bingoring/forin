// forin-notebook-session.jsx — 퀴즈 · 결과 · 복습 세션 (근무 수첩 그림체)
(function () {
  const { NbPaper, NbButton, NbTag, NbStamp, NbMark, NbMemo, NbCheck } = window.NbUI;
  const NbIcon = window.NbIcon;
  const HW = '"Gaegu","Nanum Pen Script",cursive';
  const F = '"Pretendard",sans-serif';
  const MONO = '"IBM Plex Mono",monospace';
  const c = { bg: '#F1EBDD', paper: '#FFFdf4', ink: '#3E362B', soft: '#9A8F7C', red: '#C75146', blue: '#4A6FA5', green: '#5F8D5A' };

  function Frame({ label, children, noNav }) {
    return (
      <div style={{ boxSizing: 'border-box', width: 402, height: 874, background: c.bg, backgroundImage: 'repeating-linear-gradient(transparent 0 27px, rgba(62,54,43,.06) 27px 28px)', borderRadius: 40, overflow: 'hidden', position: 'relative', fontFamily: F }} data-screen-label={label}>
        <div style={{ height: 44, display: 'flex', alignItems: 'center', padding: '0 24px', fontSize: 14, fontWeight: 700, color: c.ink }}>9:41<div style={{ flex: 1 }}/>▮▮▮</div>
        {children}
      </div>
    );
  }
  // 퀴즈 공통 헤더 — 미션 번호 + 진행 밑줄
  function QuizHead({ zone, num, total, title }) {
    return (
      <div style={{ padding: '6px 24px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: HW, fontSize: 15, color: c.ink, border: `1.5px solid ${c.ink}`, borderRadius: 3, padding: '1px 8px', transform: 'rotate(-1deg)', whiteSpace: 'nowrap' }}>✕ 그만두기</span>
          <div style={{ flex: 1 }}/>
          <NbTag color={c.blue} rot={1}>{zone}</NbTag>
          <span style={{ fontFamily: MONO, fontSize: 12, fontWeight: 700, color: c.soft, whiteSpace: 'nowrap' }}>{num}/{total}</span>
        </div>
        <div style={{ display: 'flex', gap: 5, marginTop: 10 }}>
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} style={{ flex: 1, height: 5, borderRadius: 2, background: i < num ? c.ink : 'rgba(62,54,43,.15)', transform: `rotate(${i % 2 ? 0.7 : -0.7}deg)` }}/>
          ))}
        </div>
        <div style={{ fontFamily: HW, fontSize: 24, color: c.ink, marginTop: 13, lineHeight: 1.25 }}>{title}</div>
      </div>
    );
  }

  // ── A · 퀴즈: 용어 잇기 (펜으로 선 긋기) ──
  function QuizMatch() {
    const L = ['stabbing', 'dull', 'throbbing', 'burning'];
    const R = ['둔한 통증', '타는 듯한', '찌르는 듯한', '욱신거리는'];
    // 연결: stabbing→찌르는(0→2 확정), dull→둔한(1→0 진행중)
    return (
      <Frame label="수첩 퀴즈 · 용어 잇기">
        <QuizHead zone="ER · 통증 사정" num={2} total={6} title={<span>통증 표현을 <NbMark>선으로 이어</NbMark>보세요</span>}/>
        <div style={{ position: 'absolute', left: 24, right: 24, top: 210, bottom: 170 }}>
          <svg viewBox="0 0 354 420" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 2 }}>
            <path d="M118 40 C200 55 250 175 236 208" fill="none" stroke={c.green} strokeWidth="2.4" strokeLinecap="round" strokeDasharray="1 0"/>
            <path d="M96 146 C160 150 180 95 226 72" fill="none" stroke={c.blue} strokeWidth="2.2" strokeLinecap="round" strokeDasharray="6 7"/>
          </svg>
          {L.map((w, i) => (
            <NbPaper key={w} rot={i % 2 ? 0.6 : -0.6} style={{ position: 'absolute', left: 0, top: i * 106, width: 118, padding: '13px 0', textAlign: 'center', ...(i === 0 ? { boxShadow: '0 2px 6px rgba(62,54,43,.14), 0 0 0 2px ' + c.green } : i === 1 ? { boxShadow: '0 2px 6px rgba(62,54,43,.14), 0 0 0 2px ' + c.blue } : {}) }}>
              <span style={{ fontFamily: MONO, fontSize: 13.5, fontWeight: 700, color: c.ink }}>{w}</span>
            </NbPaper>
          ))}
          {R.map((w, i) => (
            <NbPaper key={w} rot={i % 2 ? -0.6 : 0.6} style={{ position: 'absolute', right: 0, top: i * 106, width: 128, padding: '13px 0', textAlign: 'center', ...(i === 2 ? { boxShadow: '0 2px 6px rgba(62,54,43,.14), 0 0 0 2px ' + c.green } : {}) }}>
              <span style={{ fontFamily: HW, fontSize: 16.5, color: c.ink }}>{w}</span>
            </NbPaper>
          ))}
          <div style={{ position: 'absolute', left: 130, top: 435, right: 140 }}>
            <NbMemo rot={-0.4}>남은 짝 <b style={{ color: c.blue }}>2개</b> — 카드를 눌러 이으세요</NbMemo>
          </div>
        </div>
        <div style={{ position: 'absolute', left: 24, right: 24, bottom: 34 }}>
          <NbButton variant="ink" size="lg" full style={{ opacity: .45 }}>채점하기</NbButton>
        </div>
      </Frame>
    );
  }

  // ── B · 퀴즈: 받아쓰기 (필기란) ──
  function QuizDictation() {
    return (
      <Frame label="수첩 퀴즈 · 받아쓰기">
        <QuizHead zone="약국 · 처방 확인" num={4} total={6} title={<span>들리는 대로 <NbMark>받아 적어</NbMark>보세요</span>}/>
        <div style={{ padding: '18px 24px 0' }}>
          <NbPaper rot={-0.5} tape tapeLeft={130} style={{ padding: '16px 15px', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <NbIcon name="speaker" size={30}/>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontFamily: HW, fontSize: 17, color: c.ink }}>다시 듣기 (2회 남음)</div>
                <div style={{ fontSize: 10.5, color: c.soft, marginTop: 1 }}>0.8배속 <span style={{ textDecoration: 'underline', textUnderlineOffset: 2 }}>느리게</span></div>
              </div>
            </div>
            {/* 파형 낙서 */}
            <svg viewBox="0 0 260 30" width="260" height="30" style={{ marginTop: 8 }}>
              {Array.from({ length: 34 }).map((_, i) => (
                <rect key={i} x={i * 7.6} y={15 - (3 + Math.abs(Math.sin(i * 1.7)) * 11)} width="3.4" height={(3 + Math.abs(Math.sin(i * 1.7)) * 11) * 2} rx="1.7" fill={i < 14 ? c.blue : 'rgba(62,54,43,.2)'}/>
              ))}
            </svg>
          </NbPaper>
          <div style={{ marginTop: 22, fontFamily: HW, fontSize: 15, color: c.soft }}>✎ 내가 들은 문장</div>
          {/* 필기란 3줄 */}
          <div style={{ marginTop: 6 }}>
            <div style={{ borderBottom: `2px solid rgba(62,54,43,.5)`, padding: '6px 2px', fontFamily: HW, fontSize: 20, color: c.ink }}>Take one tablet twice a day</div>
            <div style={{ borderBottom: `2px solid rgba(62,54,43,.3)`, padding: '6px 2px', fontFamily: HW, fontSize: 20, color: c.ink }}>with meals<span style={{ borderLeft: `2px solid ${c.blue}`, marginLeft: 2, animation: 'nbq-blink 1s steps(1) infinite' }}>&nbsp;</span></div>
            <div style={{ borderBottom: `2px solid rgba(62,54,43,.3)`, height: 37 }}/>
            <style>{`@keyframes nbq-blink{0%,60%{opacity:1}70%,100%{opacity:0}}`}</style>
          </div>
          <div style={{ marginTop: 16 }}>
            <NbMemo color={c.blue} rot={0.3}><b style={{ color: c.blue }}>힌트</b> 복용 횟수(twice)와 시점(meals)을 잘 들어보세요</NbMemo>
          </div>
        </div>
        <div style={{ position: 'absolute', left: 24, right: 24, bottom: 34, display: 'flex', gap: 10 }}>
          <NbButton variant="dashed" style={{ flex: 1 }}>모르겠어요</NbButton>
          <NbButton variant="ink" style={{ flex: 2 }}>제출하기 ✎</NbButton>
        </div>
      </Frame>
    );
  }

  // ── C · 결과 (시나리오 클리어) ──
  function ResultNb() {
    return (
      <Frame label="수첩 결과 · 시나리오 클리어">
        <div style={{ position: 'absolute', top: 44, left: 0, right: 0, bottom: 0, overflowY: 'auto', padding: '10px 24px 34px' }}>
          <div style={{ textAlign: 'center', marginTop: 8 }}>
            <NbStamp color={c.green} size={118} rot={-11} top="PASSED" bottom={<span style={{ fontFamily: MONO, fontSize: 8 }}>SEP 02 · ER</span>}>
              <span style={{ fontFamily: HW, fontSize: 24 }}>근무 완료</span>
            </NbStamp>
            <div style={{ fontFamily: HW, fontSize: 25, color: c.ink, marginTop: 14, lineHeight: 1.25 }}>흉통 환자 트리아지,<br/>잘 마쳤어요!</div>
          </div>
          {/* 오늘 근무 요약 */}
          <NbPaper rot={-0.5} tape tapeLeft={128} style={{ marginTop: 18, padding: '13px 15px' }}>
            <div style={{ display: 'flex', textAlign: 'center' }}>
              {[['대화 턴', '14'], ['새 표현', '5'], ['평균 발음', '78'], ['XP', '+120']].map((s, i) => (
                <div key={i} style={{ flex: 1, borderLeft: i ? `1.3px dashed rgba(62,54,43,.2)` : 'none' }}>
                  <div style={{ fontSize: 10, color: c.soft }}>{s[0]}</div>
                  <div style={{ fontFamily: HW, fontSize: 21, color: i === 3 ? c.green : c.ink, marginTop: 2 }}>{s[1]}</div>
                </div>
              ))}
            </div>
          </NbPaper>
          {/* 미션 체크 */}
          <NbPaper rot={0.5} style={{ marginTop: 13, padding: '12px 15px' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: c.blue, letterSpacing: 1 }}>☐ 미션 결과</div>
            {[['OPQRST로 통증 사정하기', true], ['방사통(radiation) 확인하기', true], ['ESI 레벨 판정 말하기', true], ['보호자 안심시키기', false]].map((m, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 9 }}>
                <NbCheck done={m[1]}/>
                <span style={{ fontFamily: HW, fontSize: 16.5, color: m[1] ? c.ink : c.soft, textDecoration: m[1] ? 'none' : 'none' }}>{m[0]}</span>
                {!m[1] && <NbTag color={c.red} rot={-2} style={{ marginLeft: 'auto' }}>다음에!</NbTag>}
              </div>
            ))}
          </NbPaper>
          {/* 교정 하이라이트 → 리뷰랩 */}
          <NbPaper rot={-0.4} style={{ marginTop: 13, padding: '12px 15px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: c.red, letterSpacing: 1 }}>빨간펜 3곳 → 복습 노트에 저장됨</div>
              <div style={{ flex: 1 }}/>
              <span style={{ fontFamily: HW, fontSize: 13.5, color: c.blue, textDecoration: 'underline', textUnderlineOffset: 3, whiteSpace: 'nowrap' }}>모두 보기 ›</span>
            </div>
            <div style={{ marginTop: 8, fontSize: 12.5, color: c.soft, textDecoration: 'line-through', textDecorationColor: c.red, textDecorationThickness: 2 }}>I want to ask about your pain.</div>
            <div style={{ marginTop: 4, display: 'flex', gap: 7 }}>
              <span style={{ fontFamily: HW, fontSize: 14, color: c.red, transform: 'rotate(-4deg)' }}>→</span>
              <span style={{ fontSize: 13.5, fontWeight: 700, color: c.ink }}><NbMark>Can you tell me about your pain?</NbMark></span>
            </div>
          </NbPaper>
          <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
            <NbButton variant="paper" style={{ flex: 1 }}>대화 다시 보기</NbButton>
            <NbButton variant="ink" style={{ flex: 1 }}>다음 근무 ›</NbButton>
          </div>
        </div>
      </Frame>
    );
  }

  // ── D · 오늘의 복습 세션 (플래시카드) ──
  function ReviewSessionNb() {
    return (
      <Frame label="수첩 복습 세션 · 플래시카드">
        <div style={{ padding: '6px 24px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: HW, fontSize: 15, color: c.ink, border: `1.5px solid ${c.ink}`, borderRadius: 3, padding: '1px 8px', transform: 'rotate(-1deg)', whiteSpace: 'nowrap' }}>✕ 그만두기</span>
            <div style={{ flex: 1 }}/>
            <NbTag color={c.red} rot={1}>오늘의 복습</NbTag>
            <span style={{ fontFamily: MONO, fontSize: 12, fontWeight: 700, color: c.soft }}>2/5</span>
          </div>
          <div style={{ display: 'flex', gap: 5, marginTop: 10 }}>
            {[1,1,0,0,0].map((v, i) => <div key={i} style={{ flex: 1, height: 5, borderRadius: 2, background: v ? c.ink : 'rgba(62,54,43,.15)', transform: `rotate(${i % 2 ? 0.7 : -0.7}deg)` }}/>)}
          </div>
        </div>
        {/* 카드 스택 */}
        <div style={{ position: 'absolute', left: 24, right: 24, top: 150 }}>
          <NbPaper rot={2.2} style={{ position: 'absolute', inset: '10px -6px auto 14px', height: 380 }}/>
          <NbPaper rot={-1.4} style={{ position: 'absolute', inset: '5px 8px auto -4px', height: 380 }}/>
          <NbPaper rot={-0.3} tape tapeLeft={140} style={{ position: 'relative', height: 380, padding: '22px 20px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <NbTag color={c.blue}>ICU · SBAR</NbTag>
              <div style={{ flex: 1 }}/>
              <span style={{ fontSize: 10, fontWeight: 800, color: '#fff', background: c.red, padding: '1px 7px', transform: 'rotate(-2deg)' }}>D+3</span>
            </div>
            <div style={{ marginTop: 26, fontFamily: HW, fontSize: 17, color: c.soft, textAlign: 'center' }}>✎ 이 상황, 영어로 뭐라고 하죠?</div>
            <div style={{ marginTop: 12, fontFamily: HW, fontSize: 25, color: c.ink, textAlign: 'center', lineHeight: 1.4 }}>“환자 상태가<br/>악화 징후를 보입니다”</div>
            <div style={{ flex: 1 }}/>
            <div style={{ textAlign: 'center', fontFamily: HW, fontSize: 15, color: c.blue, textDecoration: 'underline', textUnderlineOffset: 4 }}>카드를 눌러 뒤집기 ↻</div>
            <div style={{ marginTop: 14, display: 'flex', justifyContent: 'center' }}>
              <NbButton variant="dashed" size="sm" icon="mic">먼저 말해보고 확인하기</NbButton>
            </div>
          </NbPaper>
        </div>
        {/* SRS 4버튼 */}
        <div style={{ position: 'absolute', left: 24, right: 24, bottom: 34 }}>
          <div style={{ textAlign: 'center', fontFamily: HW, fontSize: 14, color: c.soft, marginBottom: 9 }}>얼마나 기억나요?</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {[['다시', '<1분', c.red], ['어려움', '10분', '#C77E2E'], ['알맞음', '1일', c.blue], ['쉬움', '4일', c.green]].map((b, j) => (
              <div key={j} style={{ flex: 1, textAlign: 'center', border: `1.8px solid ${b[2]}`, borderRadius: 4, padding: '9px 0 6px', background: c.paper, transform: `rotate(${j % 2 ? 0.6 : -0.6}deg)`, boxShadow: '0 2px 5px rgba(62,54,43,.1)' }}>
                <div style={{ fontFamily: HW, fontSize: 16.5, color: b[2], lineHeight: 1 }}>{b[0]}</div>
                <div style={{ fontSize: 9, color: c.soft, marginTop: 3 }}>{b[1]}</div>
              </div>
            ))}
          </div>
        </div>
      </Frame>
    );
  }

  // ── E · 퀴즈: 문장 완성 (칩 붙이기) ──
  function QuizSentence() {
    return (
      <Frame label="수첩 퀴즈 · 문장 완성">
        <QuizHead zone="ER · 통증 사정" num={1} total={6} title={<span>빈칸에 <NbMark>낱말 칩</NbMark>을 붙여 문장을 완성하세요</span>}/>
        <div style={{ padding: '18px 24px 0' }}>
          <NbPaper rot={-0.5} tape tapeLeft={130} style={{ padding: '18px 16px' }}>
            <div style={{ fontFamily: HW, fontSize: 15, color: c.soft }}>✎ 환자에게 통증 강도를 물을 때</div>
            <div style={{ marginTop: 12, fontSize: 18, fontWeight: 700, color: c.ink, lineHeight: 2.1 }}>
              On a <span style={{ display: 'inline-block', background: 'rgba(95,141,90,.16)', border: `1.6px solid ${c.green}`, borderRadius: 3, padding: '0 10px', fontFamily: MONO, fontSize: 15, transform: 'rotate(-1deg)' }}>scale</span> of 0 to 10,<br/>how <span style={{ display: 'inline-block', borderBottom: `2px solid ${c.blue}`, minWidth: 68, color: c.blue, fontFamily: HW, textAlign: 'center' }}>?</span> is your pain?
            </div>
            <div style={{ fontFamily: HW, fontSize: 14.5, color: c.soft, marginTop: 8 }}>0에서 10까지, 통증이 얼마나 심한가요?</div>
          </NbPaper>
          <div style={{ marginTop: 20, fontFamily: HW, fontSize: 14.5, color: c.soft }}>낱말 칩 — 누르면 빈칸에 붙어요</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9, marginTop: 9 }}>
            {['bad', 'strong', 'much', 'painful'].map((w, i) => (
              <NbPaper key={w} rot={i % 2 ? 0.8 : -0.8} style={{ padding: '8px 16px', cursor: 'pointer', ...(i === 0 ? { boxShadow: '0 2px 6px rgba(62,54,43,.14), 0 0 0 2px ' + c.blue } : {}) }}>
                <span style={{ fontFamily: MONO, fontSize: 14, fontWeight: 700, color: c.ink }}>{w}</span>
              </NbPaper>
            ))}
          </div>
          <div style={{ marginTop: 16 }}>
            <NbMemo color={c.blue} rot={0.3}><b style={{ color: c.blue }}>힌트</b> 강도를 묻는 관용 표현은 how bad — how strong은 약효에 써요</NbMemo>
          </div>
        </div>
        <div style={{ position: 'absolute', left: 24, right: 24, bottom: 34 }}>
          <NbButton variant="ink" size="lg" full>붙이기 ✓</NbButton>
        </div>
      </Frame>
    );
  }

  // ── F · 퀴즈: 객관식 (치료적 의사소통) ──
  function QuizMCQ() {
    const opts = [
      ['"Calm down, please."', '명령형 — 불안을 키움', false, true],
      ['"I can see this is really hard. I\'m here with you."', '공감 + 동행 — 치료적', true, false],
      ['"Nothing bad will happen."', '근거 없는 안심 — 비치료적', false, false],
    ];
    return (
      <Frame label="수첩 퀴즈 · 객관식">
        <QuizHead zone="정신과 · 치료적 소통" num={3} total={6} title={<span>불안이 높은 환자에게 <NbMark>가장 치료적인 한마디</NbMark>는?</span>}/>
        <div style={{ padding: '14px 24px 0' }}>
          <NbMemo rot={-0.3} color={c.blue}>환자: “I can't breathe… something terrible is going to happen.”</NbMemo>
          {opts.map((o, i) => (
            <NbPaper key={i} rot={i % 2 ? 0.5 : -0.5} style={{ marginTop: 12, padding: '13px 14px', cursor: 'pointer', ...(o[2] ? { boxShadow: '0 2px 6px rgba(62,54,43,.14), 0 0 0 2.5px ' + c.green } : o[3] ? { boxShadow: '0 2px 6px rgba(62,54,43,.14), 0 0 0 2px ' + c.red } : {}) }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ width: 22, height: 22, borderRadius: '50%', border: `1.7px solid ${o[2] ? c.green : o[3] ? c.red : c.soft}`, color: o[2] ? c.green : o[3] ? c.red : c.soft, fontFamily: HW, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{o[2] ? '✓' : o[3] ? '✕' : String.fromCharCode(65 + i)}</span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: c.ink, lineHeight: 1.5 }}>{o[0]}</div>
                  <div style={{ fontFamily: HW, fontSize: 13.5, color: o[2] ? c.green : o[3] ? c.red : c.soft, marginTop: 3 }}>{o[1]}</div>
                </div>
              </div>
            </NbPaper>
          ))}
          <div style={{ marginTop: 14 }}>
            <NbMemo color={c.green} rot={0.3}><b style={{ color: c.green }}>왜?</b> 감정을 인정(validate)하고 함께 있음을 알리는 것이 먼저예요.</NbMemo>
          </div>
        </div>
        <div style={{ position: 'absolute', left: 24, right: 24, bottom: 34 }}>
          <NbButton variant="ink" size="lg" full>다음 문제 ›</NbButton>
        </div>
      </Frame>
    );
  }

  // ── G · 퀴즈: 순서 배열 (분만 단계) ──
  function QuizOrder() {
    const steps = [
      ['1', 'Early labor — 자궁경부 0–6cm', true],
      ['2', 'Active labor — 6–10cm', true],
      ['?', 'Pushing & birth — 만쪽 후 힘주기', false],
      ['?', 'Delivery of placenta — 태반 만출', false],
    ];
    return (
      <Frame label="수첩 퀴즈 · 순서 배열">
        <QuizHead zone="분만실 · 분만 단계" num={5} total={6} title={<span>분만 단계를 <NbMark>순서대로</NbMark> 배열하세요</span>}/>
        <div style={{ padding: '16px 24px 0' }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: i ? 11 : 0 }}>
              <span style={{ width: 26, height: 26, borderRadius: '50%', border: `1.8px solid ${s[2] ? c.green : c.soft}`, color: s[2] ? c.green : c.soft, fontFamily: HW, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{s[0]}</span>
              <NbPaper rot={i % 2 ? 0.5 : -0.5} style={{ flex: 1, padding: '11px 13px', display: 'flex', alignItems: 'center', gap: 8, ...(s[2] ? {} : { borderStyle: 'dashed', background: 'transparent', boxShadow: 'none' }) }}>
                <span style={{ fontSize: 13.5, fontWeight: 700, color: s[2] ? c.ink : c.soft }}>{s[1]}</span>
                <div style={{ flex: 1 }}/>
                {!s[2] && <span style={{ fontFamily: HW, fontSize: 13, color: c.soft }}>↕ 끌기</span>}
                {s[2] && <NbCheck done size={17}/>}
              </NbPaper>
            </div>
          ))}
          <div style={{ marginTop: 16 }}>
            <NbMemo color={c.blue} rot={0.3}><b style={{ color: c.blue }}>힌트</b> transition(이행기)은 active labor의 마지막 구간이에요</NbMemo>
          </div>
        </div>
        <div style={{ position: 'absolute', left: 24, right: 24, bottom: 34 }}>
          <NbButton variant="ink" size="lg" full style={{ opacity: .45 }}>순서 확정</NbButton>
        </div>
      </Frame>
    );
  }

  // ── H · 퀴즈: 안전 스크리닝 체크 (복수 선택) ──
  function QuizFlags() {
    const rows = [
      ['조영제 알레르기 병력 (iodine)', true],
      ['아침에 커피를 마셨다', false],
      ['metformin 복용 중', true],
      ['eGFR 28 — 신기능 저하', true],
      ['혈압약 복용 중', false],
    ];
    return (
      <Frame label="수첩 퀴즈 · 안전 체크">
        <QuizHead zone="영상의학과 · 조영 CT" num={6} total={6} title={<span>조영 CT 전, <NbMark>위험 요인에 모두</NbMark> 체크하세요</span>}/>
        <div style={{ padding: '14px 24px 0' }}>
          <NbMemo rot={-0.3} color={c.blue}>환자 차트 읽고 체크 — 놓치면 위험해요!</NbMemo>
          <NbPaper rot={-0.4} style={{ marginTop: 12, padding: '5px 14px 13px' }}>
            {rows.map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0 0', borderTop: i ? `1.3px dashed rgba(62,54,43,.15)` : 'none', marginTop: i ? 8 : 8 }}>
                <NbCheck done={r[1]}/>
                <span style={{ fontFamily: HW, fontSize: 16.5, color: r[1] ? c.ink : c.soft }}>{r[0]}</span>
                {r[1] && i !== 1 && <NbTag color={c.red} rot={-2} style={{ marginLeft: 'auto', fontSize: 10.5 }}>위험</NbTag>}
              </div>
            ))}
          </NbPaper>
          <div style={{ marginTop: 14 }}>
            <NbMemo color={c.green} rot={0.3}><b style={{ color: c.green }}>왜?</b> 요오드 알레르기·metformin·신기능 저하는 조영제 3대 체크 항목이에요.</NbMemo>
          </div>
        </div>
        <div style={{ position: 'absolute', left: 24, right: 24, bottom: 34 }}>
          <NbButton variant="ink" size="lg" full>제출하기 ✎</NbButton>
        </div>
      </Frame>
    );
  }

  Object.assign(window, { QuizMatch, QuizDictation, ResultNb, ReviewSessionNb, QuizSentence, QuizMCQ, QuizOrder, QuizFlags });
})();
