// forin-notebook-quiz2.jsx — 병동별 특화 퀴즈 6종 (근무 수첩)
// 픽셀 라인의 시각 유형 이식: 바이탈 라벨링·ESI 판정·용량 계산·신체부위 라벨링·APGAR 채점·라벨 오류찾기
(function () {
  const { NbPaper, NbButton, NbTag, NbMark, NbMemo, NbCheck } = window.NbUI;
  const NbIcon = window.NbIcon;
  const HW = '"Gaegu","Nanum Pen Script",cursive';
  const F = '"Pretendard",sans-serif';
  const MONO = '"IBM Plex Mono",monospace';
  const c = { bg: '#F1EBDD', paper: '#FFFdf4', ink: '#3E362B', soft: '#9A8F7C', red: '#C75146', blue: '#4A6FA5', green: '#5F8D5A' };

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
        <div style={{ fontFamily: HW, fontSize: 23, color: c.ink, marginTop: 13, lineHeight: 1.25 }}>{title}</div>
      </div>
    );
  }
  const CTA = ({ children, dim }) => (
    <div style={{ position: 'absolute', left: 24, right: 24, bottom: 34 }}>
      <NbButton variant="ink" size="lg" full style={dim ? { opacity: .45 } : {}}>{children}</NbButton>
    </div>
  );

  // ── I · ER 바이탈 라벨링 — 손그림 모니터에 라벨 쪽지 붙이기 ──
  function QuizVitalsNb() {
    return (
      <Frame label="수첩 퀴즈 · 바이탈 라벨링">
        <Head zone="ER · 모니터 판독" num={2} total={6} title={<span>모니터 숫자에 <NbMark>영어 명칭 쪽지</NbMark>를 붙이세요</span>}/>
        <div style={{ padding: '14px 24px 0' }}>
          {/* 손그림 모니터 */}
          <NbPaper rot={-0.4} tape tapeLeft={130} style={{ padding: 12 }}>
            <div style={{ background: '#213B4A', borderRadius: 4, padding: '12px 13px', position: 'relative' }}>
              {[['HR', '118', '#7FD8A4', 'bpm', true], ['SpO2', '91', '#8FC7F0', '%', false], ['BP', '88/54', '#F0C987', 'mmHg', false], ['RR', '26', '#F5A3A3', '/min', false]].map((v, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: i ? 9 : 0 }}>
                  <span style={{ fontFamily: MONO, fontSize: 24, fontWeight: 700, color: v[2], width: 86 }}>{v[1]}</span>
                  <span style={{ fontFamily: MONO, fontSize: 10, color: 'rgba(255,255,255,.55)' }}>{v[3]}</span>
                  <div style={{ flex: 1 }}/>
                  {v[4]
                    ? <span style={{ background: c.paper, border: `1.4px solid ${c.ink}`, fontFamily: MONO, fontSize: 11.5, fontWeight: 700, color: c.ink, padding: '3px 9px', transform: 'rotate(-2deg)', boxShadow: '1px 2px 3px rgba(0,0,0,.3)' }}>heart rate ✓</span>
                    : <span style={{ border: `1.4px dashed rgba(255,255,255,.45)`, fontFamily: HW, fontSize: 12.5, color: 'rgba(255,255,255,.6)', padding: '3px 12px' }}>?</span>}
                </div>
              ))}
            </div>
          </NbPaper>
          <div style={{ marginTop: 16, fontFamily: HW, fontSize: 14.5, color: c.soft }}>라벨 쪽지 — 끌어다 붙이세요</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9, marginTop: 8 }}>
            {['oxygen saturation', 'blood pressure', 'respiratory rate'].map((w, i) => (
              <NbPaper key={w} rot={i % 2 ? 1 : -1} style={{ padding: '7px 13px', cursor: 'grab' }}>
                <span style={{ fontFamily: MONO, fontSize: 12.5, fontWeight: 700, color: c.ink }}>{w}</span>
              </NbPaper>
            ))}
          </div>
          <div style={{ marginTop: 14 }}>
            <NbMemo color={c.red} rot={0.3}><b style={{ color: c.red }}>주의</b> 이 바이탈, 쇼크 초기 징후예요 — 라벨 붙이며 눈에 익히세요</NbMemo>
          </div>
        </div>
        <CTA dim>3개 남음</CTA>
      </Frame>
    );
  }

  // ── J · ER ESI 트리아지 판정 — 레벨 도장 찍기 ──
  function QuizTriageNb() {
    return (
      <Frame label="수첩 퀴즈 · ESI 판정">
        <Head zone="ER · 트리아지" num={5} total={6} title={<span>이 환자의 <NbMark>ESI 레벨 도장</NbMark>을 찍으세요</span>}/>
        <div style={{ padding: '13px 24px 0' }}>
          <NbPaper rot={-0.4} style={{ padding: '12px 14px' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: c.blue, letterSpacing: 1 }}>환자 메모</div>
            <div style={{ fontFamily: HW, fontSize: 17, color: c.ink, marginTop: 6, lineHeight: 1.5 }}>58세 남 · 흉통 30분 · 식은땀<br/>혈압 88/54 · SpO2 91% · 의식 명료</div>
          </NbPaper>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 22, padding: '0 2px' }}>
            {[[1, '소생', c.red], [2, '긴급', '#C77E2E'], [3, '준긴급', c.blue], [4, '경증', c.green], [5, '비긴급', c.soft]].map((l, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', border: `3px double ${l[2]}`, color: l[2], display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: `rotate(${i % 2 ? 6 : -7}deg)`, cursor: 'pointer', background: i === 1 ? 'rgba(199,126,46,.14)' : 'transparent', boxShadow: i === 1 ? `0 0 0 2.5px ${l[2]}` : 'none' }}>
                  <div style={{ fontFamily: HW, fontSize: 21, lineHeight: 1 }}>{l[0]}</div>
                  <div style={{ fontSize: 8, fontWeight: 800 }}>{l[1]}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 22 }}>
            <NbMemo color={c.blue} rot={-0.3}><b style={{ color: c.blue }}>기준 메모</b> ESI 2 = 고위험 상황 또는 심한 통증/이상 바이탈 — 의식 저하 없이도 가능해요.</NbMemo>
          </div>
          <div style={{ marginTop: 12, fontFamily: HW, fontSize: 15, color: c.soft, textAlign: 'center' }}>지금 찍은 도장: <b style={{ color: '#C77E2E' }}>ESI 2 · 긴급</b></div>
        </div>
        <CTA>판정 제출 ✎</CTA>
      </Frame>
    );
  }

  // ── K · 약국 용량 계산 — 연습장 낙서 계산 ──
  function QuizDosageNb() {
    return (
      <Frame label="수첩 퀴즈 · 용량 계산">
        <Head zone="약국 · 용량 계산" num={4} total={6} title={<span>연습장에 계산하고 <NbMark>답을 적으세요</NbMark></span>}/>
        <div style={{ padding: '13px 24px 0' }}>
          <NbPaper rot={-0.4} style={{ padding: '12px 14px' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: c.blue, letterSpacing: 1 }}>처방전</div>
            <div style={{ fontFamily: MONO, fontSize: 13.5, fontWeight: 700, color: c.ink, marginTop: 6, lineHeight: 1.7 }}>Amoxicillin 25 mg/kg/day<br/>divided q12h · 체중 16 kg</div>
            <div style={{ fontFamily: HW, fontSize: 14, color: c.soft, marginTop: 4 }}>1회 투여량은 몇 mg?</div>
          </NbPaper>
          {/* 연습장 */}
          <NbPaper rot={0.5} tape tapeLeft={150} style={{ marginTop: 13, padding: '12px 15px', minHeight: 150 }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: c.soft, letterSpacing: 1 }}>연습장 ✎</div>
            <div style={{ fontFamily: HW, fontSize: 21, color: c.blue, marginTop: 10, lineHeight: 1.75, transform: 'rotate(-0.5deg)' }}>
              25 × 16 = 400 mg/day<br/>
              400 ÷ 2회 = <span style={{ position: 'relative', display: 'inline-block' }}>200<svg viewBox="0 0 60 30" width="52" height="26" style={{ position: 'absolute', left: -8, top: 0 }}><ellipse cx="30" cy="15" rx="27" ry="13" fill="none" stroke={c.red} strokeWidth="2.2" strokeDasharray="1 0" transform="rotate(-4 30 15)"/></svg></span> mg
            </div>
          </NbPaper>
          <div style={{ marginTop: 18, display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span style={{ fontFamily: HW, fontSize: 16, color: c.soft, whiteSpace: 'nowrap' }}>답:</span>
            <div style={{ flex: 1, borderBottom: `2px solid rgba(62,54,43,.55)`, padding: '4px 2px', fontFamily: HW, fontSize: 24, color: c.ink, textAlign: 'center' }}>200</div>
            <span style={{ fontFamily: MONO, fontSize: 14, fontWeight: 700, color: c.ink }}>mg / dose</span>
          </div>
          {/* 숫자 키패드 쪽지 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, marginTop: 16 }}>
            {['1','2','3','4','5','6','7','8','9','0'].map((n, i) => (
              <NbPaper key={n} rot={i % 2 ? 0.8 : -0.8} style={{ padding: '9px 0', textAlign: 'center', cursor: 'pointer' }}>
                <span style={{ fontFamily: MONO, fontSize: 15, fontWeight: 700, color: c.ink }}>{n}</span>
              </NbPaper>
            ))}
          </div>
        </div>
        <CTA>제출하기 ✎</CTA>
      </Frame>
    );
  }

  // ── L · 병동 신체부위 라벨링 — 낙서 인체 + 화살표 ──
  function QuizAnatomyNb() {
    return (
      <Frame label="수첩 퀴즈 · 신체부위">
        <Head zone="병동 · 신체 부위" num={3} total={6} title={<span>화살표가 가리키는 부위의 <NbMark>영어 이름</NbMark>은?</span>}/>
        <div style={{ padding: '10px 24px 0', display: 'flex', gap: 14 }}>
          {/* 낙서 인체 */}
          <NbPaper rot={-0.5} style={{ width: 168, padding: '14px 8px', flexShrink: 0 }}>
            <svg viewBox="0 0 140 240" width="150" height="258">
              <g fill="none" stroke={c.ink} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
                <circle cx="70" cy="28" r="18" fill="rgba(233,150,100,.14)"/>
                <path d="M70 46 V54 M45 62 Q70 52 95 62 L100 130 Q70 140 40 130 Z" fill="rgba(74,111,165,.1)"/>
                <path d="M45 64 L28 110 L24 146 M95 64 L112 110 L116 146"/>
                <path d="M52 132 L48 190 L46 224 M88 132 L92 190 L94 224"/>
              </g>
              {/* 화살표 3개 */}
              <g fontFamily='"Gaegu",cursive' fontSize="13">
                <path d="M10 70 Q20 78 26 92" fill="none" stroke={c.green} strokeWidth="2" strokeLinecap="round"/><path d="M22 84 L26 93 L17 92" fill="none" stroke={c.green} strokeWidth="2" strokeLinejoin="round"/>
                <text x="2" y="62" fill={c.green}>①</text>
                <path d="M130 96 Q122 104 114 112" fill="none" stroke={c.red} strokeWidth="2" strokeLinecap="round"/><path d="M120 105 L113 113 L112 104" fill="none" stroke={c.red} strokeWidth="2" strokeLinejoin="round"/>
                <text x="126" y="88" fill={c.red}>②</text>
                <path d="M22 196 Q32 194 42 192" fill="none" stroke={c.blue} strokeWidth="2" strokeLinecap="round"/><path d="M35 188 L43 192 L35 197" fill="none" stroke={c.blue} strokeWidth="2" strokeLinejoin="round"/>
                <text x="8" y="200" fill={c.blue}>③</text>
              </g>
            </svg>
          </NbPaper>
          {/* 답 쪽지 */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {[['①', 'shoulder', c.green, true], ['②', 'wrist', c.red, false], ['③', 'shin', c.blue, false]].map((r, i) => (
              <div key={i} style={{ marginTop: i ? 13 : 4 }}>
                <div style={{ fontFamily: HW, fontSize: 15, color: r[2] }}>{r[0]} 이 부위는?</div>
                {r[3]
                  ? <NbPaper rot={-1} style={{ marginTop: 5, padding: '7px 11px', boxShadow: `0 2px 6px rgba(62,54,43,.14), 0 0 0 2px ${c.green}` }}><span style={{ fontFamily: MONO, fontSize: 13.5, fontWeight: 700, color: c.ink }}>shoulder ✓</span></NbPaper>
                  : <div style={{ marginTop: 5, borderBottom: `2px solid rgba(62,54,43,.35)`, padding: '5px 2px', fontFamily: HW, fontSize: 17, color: c.soft }}>?</div>}
              </div>
            ))}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 18 }}>
              {['wrist', 'elbow', 'shin', 'thigh'].map((w, i) => (
                <NbPaper key={w} rot={i % 2 ? 1 : -1} style={{ padding: '5px 10px', cursor: 'grab' }}>
                  <span style={{ fontFamily: MONO, fontSize: 12, fontWeight: 700, color: c.ink }}>{w}</span>
                </NbPaper>
              ))}
            </div>
          </div>
        </div>
        <CTA dim>2개 남음</CTA>
      </Frame>
    );
  }

  // ── M · NICU APGAR 채점표 ──
  function QuizApgarNb() {
    const rows = [
      ['Heart rate', '>100 bpm', 2, true],
      ['Respiration', '느리고 불규칙', 1, true],
      ['Muscle tone', '사지 굴곡 활발', 2, true],
      ['Reflex', '얼굴 찡그림만', null, false],
      ['Color', '몸통 분홍·사지 청색', null, false],
    ];
    return (
      <Frame label="수첩 퀴즈 · APGAR">
        <Head zone="NICU · 신생아 사정" num={2} total={6} title={<span>생후 1분 — <NbMark>APGAR 점수</NbMark>를 매기세요</span>}/>
        <div style={{ padding: '13px 24px 0' }}>
          <NbPaper rot={-0.4} tape tapeLeft={140} style={{ padding: '4px 14px 12px' }}>
            {rows.map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 10, borderTop: i ? `1.3px dashed rgba(62,54,43,.15)` : 'none', marginTop: i ? 9 : 6 }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontFamily: MONO, fontSize: 12, fontWeight: 700, color: c.ink }}>{r[0]}</div>
                  <div style={{ fontFamily: HW, fontSize: 14, color: c.soft, marginTop: 1 }}>{r[1]}</div>
                </div>
                {[0, 1, 2].map(p => (
                  <span key={p} style={{ width: 30, height: 30, borderRadius: '50%', border: `1.8px ${r[2] === p ? 'double' : 'solid'} ${r[2] === p ? c.green : 'rgba(62,54,43,.3)'}`, color: r[2] === p ? c.green : c.soft, fontFamily: HW, fontSize: 15, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transform: r[2] === p ? 'rotate(-6deg)' : 'none', background: r[2] === p ? 'rgba(95,141,90,.1)' : 'transparent' }}>{p}</span>
                ))}
              </div>
            ))}
          </NbPaper>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: 14 }}>
            <NbMemo color={c.blue} rot={-0.3} style={{ flex: 1 }}>7–10 정상 · 4–6 중등도 억제 · 0–3 즉각 소생</NbMemo>
            <div style={{ width: 64, height: 64, borderRadius: '50%', border: `3px double ${c.blue}`, color: c.blue, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: 'rotate(8deg)', marginLeft: 12, flexShrink: 0 }}>
              <div style={{ fontSize: 8.5, fontWeight: 800 }}>지금까지</div>
              <div style={{ fontFamily: HW, fontSize: 22, lineHeight: 1 }}>5점</div>
            </div>
          </div>
        </div>
        <CTA dim>2항목 남음</CTA>
      </Frame>
    );
  }

  // ── N · 약국 조제 라벨 오류찾기 — 틀린 곳에 동그라미 ──
  function QuizErrorNb() {
    return (
      <Frame label="수첩 퀴즈 · 오류찾기">
        <Head zone="약국 · 조제 검수" num={6} total={6} title={<span>라벨에서 <NbMark>틀린 곳에 동그라미</NbMark> 치세요</span>}/>
        <div style={{ padding: '13px 24px 0' }}>
          <NbMemo rot={-0.3} color={c.blue}>처방전과 조제 라벨을 대조하세요 — 오류 2곳</NbMemo>
          <div style={{ display: 'flex', gap: 11, marginTop: 13 }}>
            <NbPaper rot={-0.6} style={{ flex: 1, padding: '11px 12px' }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: c.blue, letterSpacing: 1 }}>처방전 ✓</div>
              <div style={{ fontFamily: MONO, fontSize: 11.5, fontWeight: 700, color: c.ink, marginTop: 7, lineHeight: 1.85 }}>Warfarin<br/>2.5 mg<br/>1 tab · 저녁<br/>Kim, Minji</div>
            </NbPaper>
            <NbPaper rot={0.6} style={{ flex: 1, padding: '11px 12px' }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: c.red, letterSpacing: 1 }}>조제 라벨</div>
              <div style={{ fontFamily: MONO, fontSize: 11.5, fontWeight: 700, color: c.ink, marginTop: 7, lineHeight: 1.85 }}>
                Warfarin<br/>
                <span style={{ position: 'relative', display: 'inline-block' }}>25 mg<svg viewBox="0 0 70 26" width="58" height="22" style={{ position: 'absolute', left: -6, top: 0 }}><ellipse cx="35" cy="13" rx="32" ry="11" fill="none" stroke={c.red} strokeWidth="2.2" transform="rotate(-3 35 13)"/></svg></span><br/>
                1 tab · <span style={{ position: 'relative', display: 'inline-block' }}>아침<svg viewBox="0 0 54 26" width="44" height="22" style={{ position: 'absolute', left: -6, top: 0 }}><ellipse cx="27" cy="13" rx="24" ry="11" fill="none" stroke={c.red} strokeWidth="2.2" transform="rotate(3 27 13)"/></svg></span><br/>
                Kim, Minji
              </div>
            </NbPaper>
          </div>
          <div style={{ marginTop: 15 }}>
            <NbMemo color={c.green} rot={0.3}><b style={{ color: c.green }}>잘 찾았어요!</b> 2.5 → 25 mg는 10배 용량 오류 — 와파린은 출혈 위험이 커요. 복용 시점도 달라요.</NbMemo>
          </div>
          <div style={{ marginTop: 13, display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{ fontFamily: HW, fontSize: 14, color: c.soft }}>찾은 오류</span>
            {[1, 2].map(i => <span key={i} style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${c.red}`, color: c.red, fontFamily: HW, fontSize: 12, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{i}</span>)}
            <span style={{ fontFamily: HW, fontSize: 14, color: c.green }}>/ 2 완료</span>
          </div>
        </div>
        <CTA>검수 완료 ✎</CTA>
      </Frame>
    );
  }

  Object.assign(window, { QuizVitalsNb, QuizTriageNb, QuizDosageNb, QuizAnatomyNb, QuizApgarNb, QuizErrorNb });
})();
