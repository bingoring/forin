// forin-notebook-quiz3.jsx — 병동 특화 퀴즈 II (12종, 근무 수첩)
// ICU·OR·분만실·소아과·정신과·재활·투석·내시경·정형외과·호스피스·감염관리·병동
(function () {
  const { NbPaper, NbButton, NbTag, NbMark, NbMemo, NbCheck } = window.NbUI;
  const NbIcon = window.NbIcon;
  const HW = '"Gaegu","Nanum Pen Script",cursive';
  const F = '"Pretendard",sans-serif';
  const MONO = '"IBM Plex Mono",monospace';
  const c = { bg: '#F1EBDD', paper: '#FFFdf4', ink: '#3E362B', soft: '#9A8F7C', red: '#C75146', blue: '#4A6FA5', green: '#5F8D5A', amber: '#C77E2E' };

  function Frame({ label, children }) {
    return (
      <div style={{ boxSizing: 'border-box', width: 402, height: 874, background: c.bg, backgroundImage: 'repeating-linear-gradient(transparent 0 27px, rgba(62,54,43,.06) 27px 28px)', borderRadius: 40, overflow: 'hidden', position: 'relative', fontFamily: F }} data-screen-label={label}>
        <div style={{ height: 44, display: 'flex', alignItems: 'center', padding: '0 24px', fontSize: 14, fontWeight: 700, color: c.ink }}>9:41<div style={{ flex: 1 }}/>▮▮▮</div>
        {children}
      </div>
    );
  }
  function Head({ zone, num, total, title }) {
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
        <div style={{ fontFamily: HW, fontSize: 23, color: c.ink, marginTop: 12, lineHeight: 1.25 }}>{title}</div>
      </div>
    );
  }
  const CTA = ({ children, dim }) => (
    <div style={{ position: 'absolute', left: 24, right: 24, bottom: 34 }}>
      <NbButton variant="ink" size="lg" full style={dim ? { opacity: .45 } : {}}>{children}</NbButton>
    </div>
  );
  const Opt = ({ pick, wrong, label, sub, idx }) => (
    <NbPaper rot={idx % 2 ? 0.5 : -0.5} style={{ marginTop: 11, padding: '12px 13px', cursor: 'pointer', ...(pick ? { boxShadow: `0 2px 6px rgba(62,54,43,.14), 0 0 0 2.5px ${c.green}` } : wrong ? { boxShadow: `0 2px 6px rgba(62,54,43,.14), 0 0 0 2px ${c.red}` } : {}) }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <span style={{ width: 22, height: 22, borderRadius: '50%', border: `1.7px solid ${pick ? c.green : wrong ? c.red : c.soft}`, color: pick ? c.green : wrong ? c.red : c.soft, fontFamily: HW, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{pick ? '✓' : wrong ? '✕' : String.fromCharCode(65 + idx)}</span>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: c.ink, lineHeight: 1.5 }}>{label}</div>
          {sub && <div style={{ fontFamily: HW, fontSize: 13, color: pick ? c.green : wrong ? c.red : c.soft, marginTop: 2 }}>{sub}</div>}
        </div>
      </div>
    </NbPaper>
  );

  // ── 1 · ICU 인공호흡기 알람 대응 ──
  function QuizVentAlarm() {
    return (
      <Frame label="수첩 퀴즈 · 벤트 알람">
        <Head zone="ICU · 인공호흡기" num={1} total={6} title={<span><NbMark>High Pressure 알람</NbMark> — 가장 먼저 할 일은?</span>}/>
        <div style={{ padding: '12px 24px 0' }}>
          <NbPaper rot={-0.4} style={{ padding: '10px 13px', background: '#213B4A' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#F5A3A3', flexShrink: 0 }}/>
              <span style={{ fontFamily: MONO, fontSize: 13, fontWeight: 700, color: '#F5A3A3' }}>HIGH PRESSURE — Ppeak 42</span>
            </div>
            <div style={{ fontFamily: MONO, fontSize: 10.5, color: 'rgba(255,255,255,.6)', marginTop: 5 }}>SpO2 89% ↓ · 환자 기침 반복</div>
          </NbPaper>
          <Opt idx={0} label="환자부터 사정 — 호흡음 청진, 기침·분비물 확인" sub="기계보다 환자 먼저! 분비물 막힘이 흔한 원인" pick/>
          <Opt idx={1} label="알람을 끄고 지켜본다" sub="알람 무시는 최악 — 원인 미해결" wrong/>
          <Opt idx={2} label="즉시 설정 압력을 올린다"/>
          <div style={{ marginTop: 13 }}>
            <NbMemo color={c.green} rot={0.3}><b style={{ color: c.green }}>왜?</b> DOPE(Displacement·Obstruction·Pneumothorax·Equipment) 순서로 환자부터 사정해요.</NbMemo>
          </div>
        </div>
        <CTA>다음 문제 ›</CTA>
      </Frame>
    );
  }

  // ── 2 · ICU 승압제 적정 (게이지 조절) ──
  function QuizTitration() {
    return (
      <Frame label="수첩 퀴즈 · 승압제 적정">
        <Head zone="ICU · Titration" num={3} total={6} title={<span>MAP 58 — norepinephrine을 <NbMark>어떻게 조절</NbMark>할까요?</span>}/>
        <div style={{ padding: '12px 24px 0' }}>
          <NbPaper rot={-0.4} style={{ padding: '12px 14px' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: c.blue, letterSpacing: 1 }}>지시 사항</div>
            <div style={{ fontFamily: MONO, fontSize: 12.5, fontWeight: 700, color: c.ink, marginTop: 6, lineHeight: 1.7 }}>Target MAP ≥ 65 mmHg<br/>Titrate 0.02 mcg/kg/min q5min</div>
          </NbPaper>
          {/* 펌프 게이지 */}
          <NbPaper rot={0.5} tape tapeLeft={140} style={{ marginTop: 13, padding: '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline' }}>
              <span style={{ fontFamily: HW, fontSize: 16, color: c.ink }}>현재 주입 속도</span>
              <div style={{ flex: 1 }}/>
              <span style={{ fontFamily: MONO, fontSize: 19, fontWeight: 700, color: c.ink }}>0.08</span>
              <span style={{ fontFamily: MONO, fontSize: 10.5, color: c.soft, marginLeft: 4 }}>mcg/kg/min</span>
            </div>
            <div style={{ marginTop: 12, height: 14, border: `1.7px solid ${c.ink}`, borderRadius: 4, position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 2, width: '40%', background: 'repeating-linear-gradient(-45deg, rgba(74,111,165,.55) 0 6px, rgba(74,111,165,.3) 6px 12px)' }}/>
              <div style={{ position: 'absolute', left: '50%', top: -7, bottom: -7, borderLeft: `2px dashed ${c.green}` }}/>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 15 }}>
              <NbButton variant="paper" size="sm">− 0.02 내리기</NbButton>
              <NbButton variant="ink" size="sm">+ 0.02 올리기 ✓</NbButton>
            </div>
          </NbPaper>
          <div style={{ marginTop: 13 }}>
            <NbMemo color={c.blue} rot={-0.3}><b style={{ color: c.blue }}>메모</b> MAP이 목표 미만 → 프로토콜 단위만큼 상향. 임의로 2배 올리면 안 돼요.</NbMemo>
          </div>
        </div>
        <CTA>0.10으로 조절 제출 ✎</CTA>
      </Frame>
    );
  }

  // ── 3 · OR 수술 기구 매칭 ──
  function QuizInstruments() {
    const items = [
      ['forceps', 'M4 8 Q10 12 16 17 M16 8 Q10 12 4 17', true],
      ['scalpel', 'M3 16 L13 6 L17 8 Q12 14 5 17 Z', false],
      ['retractor', 'M4 6 V13 Q4 17 9 17 H16 M16 14 V20', false],
    ];
    return (
      <Frame label="수첩 퀴즈 · 수술 기구">
        <Head zone="OR · 기구 전달" num={2} total={6} title={<span>집도의가 부른 기구에 <NbMark>이름표</NbMark>를 붙이세요</span>}/>
        <div style={{ padding: '12px 24px 0' }}>
          <NbMemo rot={-0.3} color={c.blue}>집도의: “<b>Forceps</b>, please.” — 어떤 기구죠?</NbMemo>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 11, marginTop: 14 }}>
            {items.map((it, i) => (
              <NbPaper key={i} rot={i % 2 ? 0.8 : -0.8} style={{ padding: '14px 0 11px', textAlign: 'center', cursor: 'pointer', ...(it[2] ? { boxShadow: `0 2px 6px rgba(62,54,43,.14), 0 0 0 2.5px ${c.green}` } : {}) }}>
                <svg viewBox="0 0 20 24" width="44" height="52"><path d={it[1]} fill="none" stroke={c.ink} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <div style={{ fontFamily: MONO, fontSize: 10.5, fontWeight: 700, color: it[2] ? c.green : c.soft, marginTop: 5 }}>{it[2] ? '✓ 선택' : '?'}</div>
              </NbPaper>
            ))}
          </div>
          {/* 기구 노트 */}
          <NbPaper rot={0.4} tape tapeLeft={130} style={{ marginTop: 16, padding: '11px 14px' }}>
            <div style={{ fontSize: 10.5, fontWeight: 800, color: c.blue, letterSpacing: 1 }}>기구 노트 ✎</div>
            {[['forceps', '집게 — 조직을 잡을 때'], ['retractor', '견인기 — 시야 확보'], ['hemostat', '지혈 겸자 — 혈관 클램프']].map((r, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginTop: 7, alignItems: 'baseline' }}>
                <span style={{ fontFamily: MONO, fontSize: 12, fontWeight: 700, color: c.ink, width: 82, flexShrink: 0 }}>{r[0]}</span>
                <span style={{ fontFamily: HW, fontSize: 14.5, color: c.soft }}>{r[1]}</span>
              </div>
            ))}
          </NbPaper>
        </div>
        <CTA>전달하기 ✓</CTA>
      </Frame>
    );
  }

  // ── 4 · OR 타임아웃 체크 ──
  function QuizTimeout() {
    const rows = [
      ['환자 이름·등록번호 확인', true, '"Can you state your name and DOB?"'],
      ['수술 부위·좌우 표시 확인', true, '"We\'re operating on the LEFT knee."'],
      ['수술명 구두 확인', false, null],
      ['알레르기·항생제 투여 확인', false, null],
    ];
    return (
      <Frame label="수첩 퀴즈 · 타임아웃">
        <Head zone="OR · Time-out" num={4} total={6} title={<span>절개 전 <NbMark>타임아웃 체크리스트</NbMark>를 완료하세요</span>}/>
        <div style={{ padding: '12px 24px 0' }}>
          <NbMemo rot={-0.3} color={c.red}><b style={{ color: c.red }}>전원 동작 멈춤!</b> 서큘레이팅 간호사인 당신이 읽어야 해요.</NbMemo>
          <NbPaper rot={-0.4} tape tapeLeft={140} style={{ marginTop: 13, padding: '6px 14px 13px' }}>
            {rows.map((r, i) => (
              <div key={i} style={{ paddingTop: 10, borderTop: i ? `1.3px dashed rgba(62,54,43,.15)` : 'none', marginTop: i ? 9 : 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <NbCheck done={r[1]}/>
                  <span style={{ fontFamily: HW, fontSize: 16.5, color: r[1] ? c.ink : c.soft }}>{r[0]}</span>
                </div>
                {r[2] && <div style={{ marginLeft: 28, marginTop: 4, fontSize: 11.5, color: c.blue, fontStyle: 'italic' }}>{r[2]}</div>}
              </div>
            ))}
          </NbPaper>
          <div style={{ marginTop: 13, fontFamily: HW, fontSize: 15, color: c.soft, textAlign: 'center' }}>다음 항목을 영어로 말하면 체크돼요 <NbIcon name="mic" size={15}/></div>
        </div>
        <CTA dim>2항목 남음</CTA>
      </Frame>
    );
  }

  // ── 5 · 분만실 태아 모니터 판독 ──
  function QuizFHR() {
    return (
      <Frame label="수첩 퀴즈 · 태아 모니터">
        <Head zone="분만실 · FHR 판독" num={2} total={6} title={<span>이 <NbMark>감속 패턴</NbMark>은 무엇일까요?</span>}/>
        <div style={{ padding: '12px 24px 0' }}>
          <NbPaper rot={-0.4} tape tapeLeft={130} style={{ padding: 11 }}>
            <svg viewBox="0 0 320 120" style={{ width: '100%', display: 'block' }}>
              <g stroke="rgba(199,81,70,.18)" strokeWidth="1">{Array.from({ length: 9 }).map((_, i) => <line key={i} x1="0" y1={i * 15} x2="320" y2={i * 15}/>)}{Array.from({ length: 17 }).map((_, i) => <line key={'v' + i} x1={i * 20} y1="0" x2={i * 20} y2="120"/>)}</g>
              <path d="M0 30 Q30 26 60 30 Q80 32 95 55 Q110 78 125 55 Q140 33 170 30 Q210 27 240 30 Q270 33 320 29" fill="none" stroke={c.ink} strokeWidth="2"/>
              <path d="M0 100 Q40 96 70 78 Q95 62 120 78 Q150 98 200 100 Q260 102 320 99" fill="none" stroke={c.blue} strokeWidth="2" strokeDasharray="5 4"/>
              <text x="6" y="20" fontFamily='"IBM Plex Mono",monospace' fontSize="9" fill={c.ink}>FHR 140</text>
              <text x="6" y="115" fontFamily='"IBM Plex Mono",monospace' fontSize="9" fill={c.blue}>UC (자궁수축)</text>
            </svg>
          </NbPaper>
          <div style={{ marginTop: 5 }}>
            <Opt idx={0} label="Early deceleration — 수축과 동시에 내려갔다 회복" sub="머리 압박 · 정상 소견, 관찰" pick/>
            <Opt idx={1} label="Late deceleration" sub="수축 '후' 감속 — 태반 관류 저하 의심" />
            <Opt idx={2} label="Variable deceleration"/>
          </div>
          <div style={{ marginTop: 12 }}>
            <NbMemo color={c.green} rot={0.3}><b style={{ color: c.green }}>왜?</b> 감속의 최저점이 수축 정점과 일치하면 early — 거울처럼 겹쳐요.</NbMemo>
          </div>
        </div>
        <CTA>판독 제출 ✎</CTA>
      </Frame>
    );
  }

  // ── 6 · 소아과 쉬운 말로 바꾸기 ──
  function QuizPlainLang() {
    const pairs = [
      ['NPO', '아무것도 먹이지 마세요', true],
      ['febrile', '열이 나요', true],
      ['IV line', null, false],
      ['antipyretic', null, false],
    ];
    const chips = ['해열제예요', '팔에 놓는 주삿줄이에요'];
    return (
      <Frame label="수첩 퀴즈 · 쉬운 말">
        <Head zone="소아과 · 보호자 설명" num={3} total={6} title={<span>의학 용어를 <NbMark>보호자의 말</NbMark>로 바꿔주세요</span>}/>
        <div style={{ padding: '12px 24px 0' }}>
          <NbMemo rot={-0.3} color={c.blue}>보호자: “선생님, 그게 무슨 뜻이에요?” — 쉬운 말 쪽지를 붙이세요</NbMemo>
          <NbPaper rot={-0.4} style={{ marginTop: 13, padding: '5px 14px 13px' }}>
            {pairs.map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 11, borderTop: i ? `1.3px dashed rgba(62,54,43,.15)` : 'none', marginTop: i ? 9 : 7 }}>
                <span style={{ fontFamily: MONO, fontSize: 12.5, fontWeight: 700, color: c.ink, width: 92, flexShrink: 0 }}>{p[0]}</span>
                <span style={{ fontFamily: HW, fontSize: 14, color: c.red, flexShrink: 0, transform: 'rotate(-4deg)' }}>→</span>
                {p[2]
                  ? <span style={{ fontFamily: HW, fontSize: 15.5, color: c.ink }}><NbMark>{p[1]}</NbMark> <span style={{ color: c.green }}>✓</span></span>
                  : <div style={{ flex: 1, borderBottom: `2px solid rgba(62,54,43,.3)`, height: 24 }}/>}
              </div>
            ))}
          </NbPaper>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9, marginTop: 14 }}>
            {chips.map((w, i) => (
              <NbPaper key={w} rot={i % 2 ? 1 : -1} style={{ padding: '7px 13px', cursor: 'grab' }}>
                <span style={{ fontFamily: HW, fontSize: 15, color: c.ink }}>{w}</span>
              </NbPaper>
            ))}
          </div>
          <div style={{ marginTop: 13 }}>
            <NbMemo color={c.green} rot={0.3}><b style={{ color: c.green }}>팁</b> 미국 병원은 “teach-back” — 설명 후 보호자가 다시 말해보게 해요.</NbMemo>
          </div>
        </div>
        <CTA dim>2개 남음</CTA>
      </Frame>
    );
  }

  // ── 7 · 정신과 위험 신호 선별 ──
  function QuizRiskFlags() {
    const rows = [
      ['“요즘은 잠이 안 와요.”', false],
      ['“다 정리해 뒀어요. 이제 편해요.”', true],
      ['“가족들한테 미안하다고 전해 주세요.”', true],
      ['“입맛이 없어요.”', false],
    ];
    return (
      <Frame label="수첩 퀴즈 · 위험 신호">
        <Head zone="정신과 · 안전 사정" num={5} total={6} title={<span>환자의 말 중 <NbMark>즉시 보고할 위험 신호</NbMark>는?</span>}/>
        <div style={{ padding: '12px 24px 0' }}>
          <NbMemo rot={-0.3} color={c.red}>복수 선택 — 놓치면 위험해요</NbMemo>
          {rows.map((r, i) => (
            <NbPaper key={i} rot={i % 2 ? 0.5 : -0.5} style={{ marginTop: 11, padding: '11px 13px', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <NbCheck done={r[1]}/>
              <span style={{ fontSize: 13.5, fontWeight: 600, color: r[1] ? c.ink : c.soft, lineHeight: 1.5, fontStyle: 'italic' }}>{r[0]}</span>
              {r[1] && <NbTag color={c.red} rot={-2} style={{ marginLeft: 'auto', fontSize: 10.5 }}>보고</NbTag>}
            </NbPaper>
          ))}
          <div style={{ marginTop: 13 }}>
            <NbMemo color={c.green} rot={0.3}><b style={{ color: c.green }}>왜?</b> 신변 정리·작별 인사는 자살 경고 신호(warning sign) — 즉시 1:1 관찰과 보고가 필요해요.</NbMemo>
          </div>
        </div>
        <CTA>선별 제출 ✎</CTA>
      </Frame>
    );
  }

  // ── 8 · 재활 이동 보조 순서 ──
  function QuizTransfer() {
    const steps = [
      ['1', '침대 잠금 + 게이트벨트 착용', true],
      ['2', '환자를 침대 가장자리에 앉히기', true],
      ['?', '건측(강한 쪽)으로 휠체어 배치', false],
      ['?', '“One, two, three, stand!” 구령과 함께 기립', false],
    ];
    return (
      <Frame label="수첩 퀴즈 · 이동 보조">
        <Head zone="재활 · Transfer" num={1} total={6} title={<span>편마비 환자 휠체어 이동, <NbMark>순서대로</NbMark> 놓으세요</span>}/>
        <div style={{ padding: '14px 24px 0' }}>
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
            <NbMemo color={c.blue} rot={0.3}><b style={{ color: c.blue }}>힌트</b> 휠체어는 항상 환자의 <b>건측</b>에 — 마비측으로 이동하면 낙상해요.</NbMemo>
          </div>
        </div>
        <CTA dim>순서 확정</CTA>
      </Frame>
    );
  }

  // ── 9 · 투석 수분 제한 계산 ──
  function QuizFluidCalc() {
    return (
      <Frame label="수첩 퀴즈 · 수분 계산">
        <Head zone="인공신장실 · 수분 관리" num={4} total={6} title={<span>이번 투석에서 <NbMark>제거할 수분량</NbMark>은?</span>}/>
        <div style={{ padding: '12px 24px 0' }}>
          <NbPaper rot={-0.4} style={{ padding: '12px 14px' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: c.blue, letterSpacing: 1 }}>투석 전 체크</div>
            <div style={{ display: 'flex', textAlign: 'center', marginTop: 9 }}>
              {[['오늘 체중', '64.8 kg'], ['건체중', '62.5 kg'], ['투석 중 섭취', '+0.2 L']].map((s, i) => (
                <div key={i} style={{ flex: 1, borderLeft: i ? `1.3px dashed rgba(62,54,43,.2)` : 'none' }}>
                  <div style={{ fontSize: 10, color: c.soft, whiteSpace: 'nowrap' }}>{s[0]}</div>
                  <div style={{ fontFamily: MONO, fontSize: 15, fontWeight: 700, color: c.ink, marginTop: 3 }}>{s[1]}</div>
                </div>
              ))}
            </div>
          </NbPaper>
          <NbPaper rot={0.5} tape tapeLeft={150} style={{ marginTop: 13, padding: '12px 15px' }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: c.soft, letterSpacing: 1 }}>연습장 ✎</div>
            <div style={{ fontFamily: HW, fontSize: 20, color: c.blue, marginTop: 8, lineHeight: 1.7, transform: 'rotate(-0.5deg)' }}>64.8 − 62.5 = 2.3 L<br/>2.3 + 0.2 = <span style={{ position: 'relative', display: 'inline-block' }}>2.5<svg viewBox="0 0 56 30" width="48" height="26" style={{ position: 'absolute', left: -8, top: -1 }}><ellipse cx="28" cy="15" rx="25" ry="13" fill="none" stroke={c.red} strokeWidth="2.2" transform="rotate(-4 28 15)"/></svg></span> L</div>
          </NbPaper>
          <div style={{ marginTop: 15, display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span style={{ fontFamily: HW, fontSize: 16, color: c.soft, whiteSpace: 'nowrap' }}>UF Goal:</span>
            <div style={{ flex: 1, borderBottom: `2px solid rgba(62,54,43,.55)`, padding: '3px 2px', fontFamily: HW, fontSize: 23, color: c.ink, textAlign: 'center' }}>2.5</div>
            <span style={{ fontFamily: MONO, fontSize: 14, fontWeight: 700, color: c.ink }}>L</span>
          </div>
          <div style={{ marginTop: 13 }}>
            <NbMemo color={c.blue} rot={-0.3}>영어로: “We'll take off <b>two and a half liters</b> today.”</NbMemo>
          </div>
        </div>
        <CTA>제출하기 ✎</CTA>
      </Frame>
    );
  }

  // ── 10 · 내시경 NPO 시간 계산 문장 ──
  function QuizNPO() {
    return (
      <Frame label="수첩 퀴즈 · NPO 안내">
        <Head zone="내시경실 · 검사 전 안내" num={2} total={6} title={<span>내일 <NbMark>오전 9시 위내시경</NbMark> — 안내를 완성하세요</span>}/>
        <div style={{ padding: '12px 24px 0' }}>
          <NbPaper rot={-0.5} tape tapeLeft={130} style={{ padding: '15px 16px' }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: c.ink, lineHeight: 2.05 }}>
              Please don't eat anything after <span style={{ display: 'inline-block', background: 'rgba(95,141,90,.16)', border: `1.6px solid ${c.green}`, borderRadius: 3, padding: '0 10px', fontFamily: MONO, fontSize: 14, transform: 'rotate(-1deg)' }}>midnight</span>.<br/>
              You may have <span style={{ display: 'inline-block', borderBottom: `2px solid ${c.blue}`, minWidth: 90, color: c.blue, fontFamily: HW, textAlign: 'center' }}>?</span> until 2 hours before.
            </div>
            <div style={{ fontFamily: HW, fontSize: 14, color: c.soft, marginTop: 8 }}>자정 이후 금식 · 검사 2시간 전까지는 __만 가능</div>
          </NbPaper>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9, marginTop: 16 }}>
            {['clear liquids', 'milk', 'a light meal', 'gum'].map((w, i) => (
              <NbPaper key={w} rot={i % 2 ? 0.8 : -0.8} style={{ padding: '8px 15px', cursor: 'pointer', ...(i === 0 ? { boxShadow: `0 2px 6px rgba(62,54,43,.14), 0 0 0 2px ${c.blue}` } : {}) }}>
                <span style={{ fontFamily: MONO, fontSize: 13.5, fontWeight: 700, color: c.ink }}>{w}</span>
              </NbPaper>
            ))}
          </div>
          <div style={{ marginTop: 15 }}>
            <NbMemo color={c.green} rot={0.3}><b style={{ color: c.green }}>왜?</b> 물·맑은 주스 같은 clear liquid만 허용 — 우유는 위 배출이 느려 흡인 위험이 있어요.</NbMemo>
          </div>
        </div>
        <CTA>붙이기 ✓</CTA>
      </Frame>
    );
  }

  // ── 11 · 정형외과 CMS 체크 ──
  function QuizCMS() {
    const rows = [
      ['Circulation — 발가락 색·모세혈관 충만', '분홍색 · 2초 미만', c.green, '정상'],
      ['Motion — 발가락 움직임', '움직임 약해짐', c.amber, '주의'],
      ['Sensation — 감각', '“저리고 터질 것 같아요”', c.red, '위험'],
    ];
    return (
      <Frame label="수첩 퀴즈 · CMS 체크">
        <Head zone="정형외과 · 석고 사정" num={3} total={6} title={<span>통깁스 3시간째 — <NbMark>CMS 사정 결과</NbMark>를 판정하세요</span>}/>
        <div style={{ padding: '12px 24px 0' }}>
          <NbPaper rot={-0.4} tape tapeLeft={140} style={{ padding: '5px 14px 13px' }}>
            {rows.map((r, i) => (
              <div key={i} style={{ paddingTop: 11, borderTop: i ? `1.3px dashed rgba(62,54,43,.15)` : 'none', marginTop: i ? 9 : 7 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: MONO, fontSize: 11.5, fontWeight: 700, color: c.ink, flex: 1, minWidth: 0 }}>{r[0]}</span>
                  <NbTag color={r[2]} rot={i % 2 ? 2 : -2} style={{ fontSize: 10.5 }}>{r[3]}</NbTag>
                </div>
                <div style={{ fontFamily: HW, fontSize: 14.5, color: c.soft, marginTop: 3 }}>{r[1]}</div>
              </div>
            ))}
          </NbPaper>
          <div style={{ fontFamily: HW, fontSize: 17, color: c.ink, marginTop: 15 }}>지금 해야 할 일은?</div>
          <Opt idx={0} label="즉시 의사 보고 — 구획증후군 의심" sub="진통제 무효 + 감각 이상 = 응급!" pick/>
          <Opt idx={1} label="진통제를 더 주고 1시간 후 재사정" sub="시간 지연 = 조직 괴사 위험" wrong/>
          <div style={{ marginTop: 12 }}>
            <NbMemo color={c.green} rot={0.3}><b style={{ color: c.green }}>보고 문장</b> “I'm concerned about compartment syndrome.”</NbMemo>
          </div>
        </div>
        <CTA>보고하기 ✎</CTA>
      </Frame>
    );
  }

  // ── 12 · 감염관리 PPE 착용 순서 ──
  function QuizPPE() {
    const items = [
      ['1', '손 위생', 'M12 4 Q8 8 8 13 Q8 19 12 20 Q16 19 16 13 Q16 8 12 4', true],
      ['2', '가운(Gown)', 'M8 5 L12 7 L16 5 L18 9 L15 10 V19 H9 V10 L6 9 Z', true],
      ['?', '마스크/N95', 'M5 10 Q12 6 19 10 L18 15 Q12 18 6 15 Z M5 10 L3 8 M19 10 L21 8', false],
      ['?', '고글 → 장갑', 'M4 10 Q7 8 10 10 Q12 11 14 10 Q17 8 20 10 L19 14 Q16 16 13 13 Q12 12 11 13 Q8 16 5 14 Z', false],
    ];
    return (
      <Frame label="수첩 퀴즈 · PPE 순서">
        <Head zone="감염관리 · 격리실 입실" num={1} total={6} title={<span>PPE <NbMark>착용(Donning) 순서</NbMark>를 완성하세요</span>}/>
        <div style={{ padding: '12px 24px 0' }}>
          <NbMemo rot={-0.3} color={c.blue}>VRE 접촉주의 병실 앞 — 격리 카트에서 순서대로!</NbMemo>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 14 }}>
            {items.map((it, i) => (
              <NbPaper key={i} rot={i % 2 ? 0.7 : -0.7} style={{ padding: '13px 12px', display: 'flex', alignItems: 'center', gap: 10, ...(it[3] ? {} : { borderStyle: 'dashed', background: 'transparent', boxShadow: 'none' }) }}>
                <span style={{ width: 25, height: 25, borderRadius: '50%', border: `1.8px solid ${it[3] ? c.green : c.soft}`, color: it[3] ? c.green : c.soft, fontFamily: HW, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{it[0]}</span>
                <svg viewBox="0 0 24 24" width="30" height="30"><path d={it[2]} fill={it[3] ? 'rgba(95,141,90,.12)' : 'none'} stroke={c.ink} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span style={{ fontFamily: HW, fontSize: 14.5, color: it[3] ? c.ink : c.soft, lineHeight: 1.2 }}>{it[1]}</span>
              </NbPaper>
            ))}
          </div>
          <div style={{ marginTop: 15 }}>
            <NbMemo color={c.green} rot={0.3}><b style={{ color: c.green }}>암기</b> 착용은 손위생→가운→마스크→고글→장갑, 벗을 땐 장갑부터(가장 오염).</NbMemo>
          </div>
        </div>
        <CTA dim>순서 확정</CTA>
      </Frame>
    );
  }

  Object.assign(window, { QuizVentAlarm, QuizTitration, QuizInstruments, QuizTimeout, QuizFHR, QuizPlainLang, QuizRiskFlags, QuizTransfer, QuizFluidCalc, QuizNPO, QuizCMS, QuizPPE });
})();
