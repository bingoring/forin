// screens-quiz-depts.jsx — Department-specific mid-dialogue quizzes for the
// newer floors (L&D · NICU · Psych · Oncology · Dialysis · Rehab · Radiology ·
// Endoscopy). Reuses the shared QuizBackdrop + QuizCard chrome from
// screens-quiz.jsx (loaded before this file). Each screen is a representative
// static state (like the existing ER/ICU/Pharmacy quizzes).

(function () {
  const T = () => window.ForinTokens;

  function QuizTop({ label }) {
    const t = T();
    return (
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '52px 16px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 7 }}>
        <button style={{ background: '#fff', border: `2px solid ${t.ink}`, padding: '4px 10px', fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: t.ink, boxShadow: `2px 2px 0 0 ${t.ink}` }}>× 나가기</button>
        <div style={{ background: '#fff', border: `2px solid ${t.ink}`, padding: '4px 8px', fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: t.ink, boxShadow: `2px 2px 0 0 ${t.ink}` }}>{label}</div>
      </div>
    );
  }

  function Choice({ n, en, ko, state }) {
    const t = T();
    const bg = state === 'correct' ? t.mint : state === 'wrong' ? '#FCA5A5' : '#fff';
    const mark = state === 'correct' ? '✓' : state === 'wrong' ? '✕' : n;
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, background: bg, border: `2px solid ${t.ink}`, boxShadow: `2px 2px 0 0 ${t.ink}`, padding: '8px 10px', marginBottom: 8 }}>
        <div style={{ width: 18, height: 18, flexShrink: 0, background: state === 'idle' ? t.paper : t.ink, color: state === 'idle' ? t.ink : '#fff', border: `2px solid ${t.ink}`, fontFamily: '"DungGeunMo",monospace', fontSize: 11, textAlign: 'center', lineHeight: '15px' }}>{mark}</div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 12.5, color: t.ink, lineHeight: 1.25 }}>{en}</div>
          {ko && <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 10, color: t.textSoft, marginTop: 2 }}>{ko}</div>}
        </div>
      </div>
    );
  }

  function Footer({ progress, cta = '✓ 확인' }) {
    const t = T();
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ flex: 1, fontFamily: '"Galmuri11",monospace', fontSize: 10, color: t.textSoft }}>{progress}</div>
        <button style={{ background: '#fff', border: `2px solid ${t.ink}`, padding: '8px 10px', fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: t.ink, boxShadow: `2px 2px 0 0 ${t.ink}` }}>↺ 다시</button>
        <button style={{ background: t.mint, border: `2px solid ${t.ink}`, padding: '8px 12px', fontFamily: '"DungGeunMo",monospace', fontSize: 12, color: t.ink, boxShadow: `2px 2px 0 0 ${t.mintShadow}` }}>{cta}</button>
      </div>
    );
  }

  function Shell({ label, cardProps, children }) {
    return (
      <div data-screen-label={label} style={{ height: '100%', background: '#1F2937', position: 'relative', overflow: 'hidden' }}>
        <QuizBackdrop/>
        <QuizTop label={cardProps.topLabel}/>
        <QuizCard {...cardProps}>{children}</QuizCard>
      </div>
    );
  }

  const prompt = (txt) => {
    const t = T();
    return <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 11, color: t.textSoft, marginBottom: 10, textAlign: 'center', lineHeight: 1.45, whiteSpace: 'pre-line' }}>{txt}</div>;
  };

  // ─── 1. L&D · labor-stage ordering ──────────────────────────────────
  function ScreenQuizLabor() {
    const t = T();
    const steps = [
      { n: 1, en: 'Latent phase — cervix 0–6 cm', ko: '잠복기 · 자궁경부 0–6cm', fixed: true },
      { n: 2, en: 'Active phase — cervix 6–10 cm', ko: '활성기 · 6–10cm', fixed: true },
      { n: 3, en: 'Delivery of the baby (pushing)', ko: '태아 만출 (밀어내기)', fixed: false },
      { n: 4, en: 'Delivery of the placenta', ko: '태반 만출', fixed: false },
    ];
    return (
      <Shell label="Quiz · L&D Labor" cardProps={{ topLabel: '분만 4단계', kind: 'ORDER', title: '분만 진행 단계 순서', sub: 'Stages of labor — 순서대로 배열', zone: 'L&D', missionNum: 2, total: 4, timer: '01:03', footer: <Footer progress="2 / 4 고정됨"/> }}>
        {prompt('산모에게 진행 상황을 설명하려 합니다. 분만 단계를 순서대로 놓으세요.')}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, background: s.fixed ? t.mint : '#fff', border: `2px solid ${t.ink}`, boxShadow: `2px 2px 0 0 ${t.ink}`, padding: '8px 10px' }}>
              <div style={{ width: 20, height: 20, flexShrink: 0, background: t.ink, color: '#fff', fontFamily: '"DungGeunMo",monospace', fontSize: 12, textAlign: 'center', lineHeight: '17px' }}>{s.n}</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 12, color: t.ink }}>{s.en}</div>
                <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 10, color: t.textSoft, marginTop: 2 }}>{s.ko}</div>
              </div>
              <div style={{ marginLeft: 'auto', fontSize: 14, color: t.ink }}>{s.fixed ? '🔒' : '↕'}</div>
            </div>
          ))}
        </div>
      </Shell>
    );
  }

  // ─── 2. NICU · APGAR scoring ────────────────────────────────────────
  function ScreenQuizApgar() {
    const t = T();
    const rows = [
      { sign: 'Heart rate > 100', ko: '심박수 100회 초과', score: 2, state: 'correct' },
      { sign: 'Body pink, limbs blue', ko: '몸통 분홍·사지 청색', score: 1, state: 'correct' },
      { sign: 'Grimace to stimulation', ko: '자극 시 찡그림', score: 1, state: 'idle' },
      { sign: 'No respiratory effort', ko: '호흡 노력 없음', score: 0, state: 'wrong' },
    ];
    return (
      <Shell label="Quiz · NICU APGAR" cardProps={{ topLabel: 'APGAR 1분', kind: 'SCORE', title: '신생아 APGAR 채점', sub: '각 항목의 점수(0·1·2)를 고르세요', zone: 'NICU', missionNum: 1, total: 5, timer: '00:55', footer: <Footer progress="합계 4 / 10 · 2문항 남음"/> }}>
        {prompt('출생 1분 APGAR을 채점 중입니다. 각 소견의 점수를 선택하세요.')}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {rows.map((r, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: `2px solid ${t.ink}`, boxShadow: `2px 2px 0 0 ${t.ink}`, padding: '7px 9px' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 11.5, color: t.ink }}>{r.sign}</div>
                <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 9.5, color: t.textSoft }}>{r.ko}</div>
              </div>
              {[0,1,2].map(v => {
                const on = r.state !== 'idle' && v === r.score;
                const good = r.state === 'correct';
                return <div key={v} style={{ width: 22, height: 22, textAlign: 'center', lineHeight: '20px', fontFamily: '"DungGeunMo",monospace', fontSize: 12, border: `2px solid ${t.ink}`, background: on ? (good ? t.mint : '#FCA5A5') : t.paper, color: t.ink }}>{v}</div>;
              })}
            </div>
          ))}
        </div>
      </Shell>
    );
  }

  // ─── 3. Psychiatry · therapeutic de-escalation (MCQ) ────────────────
  function ScreenQuizPsych() {
    return (
      <Shell label="Quiz · Psych De-escalation" cardProps={{ topLabel: '치료적 의사소통', kind: 'MCQ', title: '안전·치료적 반응 고르기', sub: '불안이 높은 환자에게 가장 적절한 응답은?', zone: 'PSYCH', missionNum: 3, total: 6, timer: '01:20', footer: <Footer progress="정답 선택됨 · 해설 보기"/> }}>
        {prompt('환자: "다들 나를 감시하고 있어요. 여기서 나가야 해요."\n가장 치료적인(therapeutic) 응답을 고르세요.')}
        <Choice n={1} en={'"That\'s not true, nobody is watching you."'} ko="사실이 아니라고 즉시 부정" state="wrong"/>
        <Choice n={2} en={'"You seem frightened. I\'m here with you and you are safe."'} ko="감정을 인정하고 안전을 보장" state="correct"/>
        <Choice n={3} en={'"Calm down or I\'ll call security."'} ko="위협적 지시" state="idle"/>
        <Choice n={4} en={'"Why do you think everyone is watching you?"'} ko="망상을 캐묻기" state="idle"/>
      </Shell>
    );
  }

  // ─── 4. Oncology · chemo side-effect matching ───────────────────────
  function ScreenQuizChemo() {
    const t = T();
    const pairs = [
      { en: 'Neutropenia', ko: '호중구감소증', state: 'correct' },
      { en: 'Mucositis', ko: '점막염', state: 'correct' },
      { en: 'Alopecia', ko: '탈모', state: 'idle' },
      { en: 'Extravasation', ko: '혈관 외 유출', state: 'idle' },
    ];
    return (
      <Shell label="Quiz · Onco Chemo Terms" cardProps={{ topLabel: '항암 부작용 용어', kind: 'MATCH', title: '화학요법 부작용 매칭', sub: 'BMT·종양 병동 필수 어휘 4종', zone: 'ONCO', missionNum: 2, total: 4, timer: '00:48', footer: <Footer progress="2 / 4 완료"/> }}>
        {prompt('영어 용어와 우리말 뜻을 짝지으세요.')}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {pairs.map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ flex: 1, background: p.state === 'correct' ? t.mint : '#fff', border: `2px solid ${t.ink}`, boxShadow: `2px 2px 0 0 ${t.ink}`, padding: '8px 10px', fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 12.5, color: t.ink }}>{p.en}</div>
              <div style={{ fontSize: 14, color: '#fff' }}>{p.state === 'correct' ? '━' : '⋯'}</div>
              <div style={{ flex: 1, background: p.state === 'correct' ? t.mint : '#fff', border: `2px solid ${t.ink}`, boxShadow: `2px 2px 0 0 ${t.ink}`, padding: '8px 10px', fontFamily: '"Galmuri11",monospace', fontSize: 11, color: t.ink, textAlign: 'right' }}>{p.ko}</div>
            </div>
          ))}
        </div>
      </Shell>
    );
  }

  // ─── 5. Dialysis · AV-fistula assessment (MCQ) ──────────────────────
  function ScreenQuizDialysis() {
    return (
      <Shell label="Quiz · Dialysis Fistula" cardProps={{ topLabel: '투석 전 사정', kind: 'MCQ', title: 'AV 문합 부위 사정', sub: '투석 시작 전 반드시 확인할 것은?', zone: 'DIAL', missionNum: 1, total: 4, timer: '00:39', footer: <Footer progress="정답 선택됨"/> }}>
        {prompt('동정맥루(AV fistula)로 투석을 시작하기 전, 개통성 확인을 위해 사정해야 하는 것은?')}
        <Choice n={1} en={'Palpate for a thrill, auscultate for a bruit'} ko="진동(thrill) 촉지·잡음(bruit) 청진" state="correct"/>
        <Choice n={2} en={'Take blood pressure on the fistula arm'} ko="문합 팔에서 혈압 측정" state="wrong"/>
        <Choice n={3} en={'Start an IV line in the fistula'} ko="문합 부위에 수액 주입" state="idle"/>
        <Choice n={4} en={'Apply a tight bandage over the site'} ko="부위에 압박 붕대 적용" state="idle"/>
      </Shell>
    );
  }

  // ─── 6. Rehab · transfer/ADL sentence completion ────────────────────
  function ScreenQuizRehab() {
    const t = T();
    const chips = ['weight-bearing', 'transfer', 'gait belt', 'range of motion'];
    return (
      <Shell label="Quiz · Rehab Transfer" cardProps={{ topLabel: '재활 지시 문장', kind: 'FILL', title: '이동·보행 지시 완성', sub: '빈칸에 알맞은 재활 용어를 넣으세요', zone: 'REHAB', missionNum: 2, total: 3, timer: '01:10', footer: <Footer progress="1 / 2 채움" cta="✓ 제출"/> }}>
        {prompt('물리치료사의 지시를 완성하세요.')}
        <div style={{ background: '#fff', border: `2px solid ${t.ink}`, boxShadow: `3px 3px 0 0 ${t.ink}`, padding: '12px', fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 13, color: t.ink, lineHeight: 1.9, marginBottom: 12 }}>
          "Apply the <span style={{ background: t.mint, border: `2px solid ${t.ink}`, padding: '1px 6px' }}>gait belt</span> before you help the patient
          <span style={{ display: 'inline-block', minWidth: 70, borderBottom: `3px solid ${t.ink}`, textAlign: 'center', color: t.textSoft }}>&nbsp;?&nbsp;</span>
          from the bed to the chair. He is partial <span style={{ textDecoration: 'underline dotted' }}>weight-bearing</span> on the left leg."
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {chips.map((c, i) => (
            <div key={i} style={{ background: i === 1 ? t.paper : t.yellow, border: `2px solid ${t.ink}`, boxShadow: `2px 2px 0 0 ${t.ink}`, padding: '7px 11px', fontFamily: '"DungGeunMo",monospace', fontSize: 12, color: t.ink, opacity: i === 0 ? 0.4 : 1 }}>{c}</div>
          ))}
        </div>
      </Shell>
    );
  }

  // ─── 7. Radiology · contrast-safety screening (multi-flag) ──────────
  function ScreenQuizRadiology() {
    const t = T();
    const flags = [
      { en: 'Prior contrast reaction', ko: '조영제 부작용 병력', on: true },
      { en: 'eGFR 22 (renal impairment)', ko: '신기능 저하', on: true },
      { en: 'Metformin use', ko: '메트포르민 복용', on: true },
      { en: 'Took a multivitamin', ko: '종합비타민 복용', on: false },
    ];
    return (
      <Shell label="Quiz · Radiology Contrast" cardProps={{ topLabel: 'CT 조영 전 스크리닝', kind: 'CHECK', title: '조영제 위험 요인 선별', sub: 'CT 조영 전 확인할 위험 요인을 모두 고르세요', zone: 'RAD', missionNum: 3, total: 5, timer: '01:05', footer: <Footer progress="3 / 3 위험요인 선택"/> }}>
        {prompt('조영제(contrast) 투여 전 문진입니다. 주의가 필요한 항목을 모두 선택하세요.')}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {flags.map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, background: f.on ? t.mint : '#fff', border: `2px solid ${t.ink}`, boxShadow: `2px 2px 0 0 ${t.ink}`, padding: '8px 10px' }}>
              <div style={{ width: 18, height: 18, flexShrink: 0, border: `2px solid ${t.ink}`, background: f.on ? t.ink : t.paper, color: '#fff', fontFamily: '"DungGeunMo",monospace', fontSize: 12, textAlign: 'center', lineHeight: '15px' }}>{f.on ? '✓' : ''}</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 12, color: t.ink }}>{f.en}</div>
                <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 10, color: t.textSoft, marginTop: 1 }}>{f.ko}</div>
              </div>
            </div>
          ))}
        </div>
      </Shell>
    );
  }

  // ─── 8. Endoscopy · NPO / prep instruction completion ───────────────
  function ScreenQuizEndo() {
    const t = T();
    return (
      <Shell label="Quiz · Endoscopy NPO" cardProps={{ topLabel: '내시경 준비 안내', kind: 'FILL', title: '금식(NPO) 안내 완성', sub: '위내시경 전 준비 지시를 완성하세요', zone: 'ENDO', missionNum: 1, total: 3, timer: '00:50', footer: <Footer progress="1 / 1 채움" cta="✓ 제출"/> }}>
        {prompt('환자에게 시술 전 준비를 안내합니다.')}
        <div style={{ background: '#fff', border: `2px solid ${t.ink}`, boxShadow: `3px 3px 0 0 ${t.ink}`, padding: '12px', fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 13, color: t.ink, lineHeight: 2, marginBottom: 12 }}>
          "Please do <span style={{ background: t.mint, border: `2px solid ${t.ink}`, padding: '1px 6px' }}>not eat or drink</span>
          <span style={{ display: 'inline-block', minWidth: 60, borderBottom: `3px solid ${t.ink}`, textAlign: 'center', color: t.textSoft }}>&nbsp;?&nbsp;</span>
          hours before the gastroscopy. You may take heart medication with a small sip of water."
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {['for 8', 'for 2', 'until midnight'].map((c, i) => (
            <div key={i} style={{ background: i === 0 ? t.yellow : t.paper, border: `2px solid ${t.ink}`, boxShadow: `2px 2px 0 0 ${t.ink}`, padding: '7px 11px', fontFamily: '"DungGeunMo",monospace', fontSize: 12, color: t.ink }}>{c}</div>
          ))}
        </div>
      </Shell>
    );
  }

  Object.assign(window, {
    ScreenQuizLabor, ScreenQuizApgar, ScreenQuizPsych, ScreenQuizChemo,
    ScreenQuizDialysis, ScreenQuizRehab, ScreenQuizRadiology, ScreenQuizEndo,
  });
})();
