// screen-briefing.jsx — Pre-dialogue scenario briefing modal
// Triggered when the player steps on a `!` quest hotspot. Shows the scenario
// summary, NPC info, expected rewards, then offers "지금 진행 / 나중에".

function ScreenBriefing({ variant = 'er' }) {
  const t = window.ForinTokens;
  const C = '#2A2522';

  // 3 ready-made scenario presets so we can demo different cases easily
  const scenarios = {
    er: {
      dept: 'ER · TRAUMA BAY #4', deptColor: '#DC2626',
      title: '통증 사정 — Mrs. Hopkins',
      tagline: '"It started about an hour ago…"',
      npc: {
        name: 'Mrs. Hopkins', sub: '67y / Female',
        face: { role: 'patient', hair: '#9A6B3F', hairStyle: 'bob', expression: 'pain' },
      },
      brief: '응급 베이에 막 도착한 환자입니다. 한 시간 전부터 오른팔이 욱신거린다며 호소하고 있어요. 활력 징후는 안정적입니다. PQRST에 따라 통증을 사정하고 닥터에게 전달할 정보를 모아주세요.',
      difficulty: 2,
      skills: ['통증 사정 (PQRST)', '청구 어휘', '의문문 만들기'],
      time: '약 5분',
      rewards: [
        { ic: '⭐', label: '경험치', value: '+ 120 XP' },
        { ic: '❤', label: '환자 만족도', value: '+ 6' },
        { ic: '🎖', label: '응급 대응 진척', value: '+ 1' },
      ],
      reqs: [
        { label: '레벨 B1+', met: true },
        { label: '응급 대응력 60+', met: true },
      ],
      tone: t.peach, accent: t.peachShadow,
    },
    or: {
      dept: 'OR · PRE-OP', deptColor: '#9333EA',
      title: '수술 동의 확인 — Mr. Garcia',
      tagline: '"Will I be awake during the surgery?"',
      npc: {
        name: 'Mr. Garcia', sub: '54y / Male · 충수염',
        face: { role: 'patient', hair: '#5C3A1A', hairStyle: 'short', expression: 'worried' },
      },
      brief: '곧 충수절제술을 받을 환자입니다. 수술 동의 사항 5가지를 재확인하고 마취 전 마지막 질문을 받아주세요. NPO 시간, 알러지, 보철물 여부를 반드시 영어로 확인해야 합니다.',
      difficulty: 3,
      skills: ['수술 동의', 'NPO 확인', '환자 안심시키기'],
      time: '약 7분',
      rewards: [
        { ic: '⭐', label: '경험치', value: '+ 180 XP' },
        { ic: '❤', label: '환자 만족도', value: '+ 8' },
        { ic: '🎖', label: '수술실 인증 진척', value: '+ 1' },
      ],
      reqs: [
        { label: '레벨 B1+', met: true },
        { label: '환자 만족도 70+', met: true },
      ],
      tone: '#E9D5FF', accent: '#9333EA',
    },
    police: {
      dept: 'ER · RECEPTION', deptColor: '#1F2937',
      title: '경찰 동행 환자 인계 — Officer Davis',
      tagline: '"We brought a possible assault victim…"',
      npc: {
        name: 'Officer Davis', sub: 'NYPD · 38m precinct',
        face: { role: 'police', hair: '#1F2937', expression: 'focused' },
      },
      brief: '경찰이 신원 불명의 부상 환자를 데려왔습니다. 환자의 상태, 발견 시각, 알러지 정보 등을 핸드오프로 받고 보고서에 적절히 기록해야 합니다.',
      difficulty: 3,
      skills: ['SBAR 인계 받기', '공문서 어휘', '시간/장소 청취'],
      time: '약 8분',
      rewards: [
        { ic: '⭐', label: '경험치', value: '+ 240 XP' },
        { ic: '🤝', label: '동료 신뢰도', value: '+ 10' },
        { ic: '📋', label: '특수 시나리오 잠금해제', value: '✓' },
      ],
      reqs: [
        { label: '레벨 B2+', met: false },
        { label: '응급 대응력 75+', met: true },
      ],
      tone: '#F3F4F6', accent: '#1F2937',
    },
  };
  const s = scenarios[variant];

  return (
    <div data-screen-label={`Brief · ${variant.toUpperCase()}`} style={{ height: '100%', background: '#1F2937', position: 'relative', overflow: 'hidden' }}>
      {/* faded interior backdrop (suggests we paused mid-exploration) */}
      <div style={{ position: 'absolute', inset: 0,
        background: `linear-gradient(180deg, ${s.tone} 0%, ${t.cream} 100%)`,
        opacity: 0.35 }}/>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(31,41,55,0.55)' }}/>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `repeating-linear-gradient(0deg, rgba(255,255,255,.04) 0 1px, transparent 1px 3px)`, pointerEvents: 'none' }}/>

      {/* topbar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '52px 16px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 8 }}>
        <button style={{ background: '#fff', border: `2px solid ${C}`, padding: '4px 10px', fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: C, boxShadow: `2px 2px 0 0 ${C}` }}>× 닫기</button>
        <div style={{ background: s.deptColor, color: '#fff', border: `2px solid ${C}`, padding: '4px 8px', fontFamily: '"DungGeunMo",monospace', fontSize: 11, boxShadow: `2px 2px 0 0 ${C}`, display: 'flex', alignItems: 'center', gap: 4 }}>
          ⚑ {s.dept}
        </div>
      </div>

      {/* main scenario card */}
      <div style={{ position: 'absolute', left: 14, right: 14, top: 102, bottom: 22, zIndex: 6,
        background: t.cream, border: `4px solid ${C}`, boxShadow: `6px 6px 0 0 ${C}`,
        display: 'flex', flexDirection: 'column' }}>

        {/* corner staples */}
        {[[6,6],[6,'B'],['R',6],['R','B']].map((p,i) => (
          <div key={i} style={{ position: 'absolute', width: 6, height: 6, background: C,
            ...(p[0]==='R' ? {right:6} : {left:p[0]}),
            ...(p[1]==='B' ? {bottom:6} : {top:p[1]}),
          }}/>
        ))}

        {/* ribbon header */}
        <div style={{ background: s.tone, borderBottom: `3px solid ${C}`, padding: '10px 14px', position: 'relative' }}>
          <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: s.accent, lineHeight: 1, letterSpacing: 1 }}>
            ❗ NEW SCENARIO
          </div>
          <div style={{ fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 17, color: C, lineHeight: 1.2, marginTop: 4 }}>
            {s.title}
          </div>
          <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 11, color: C, opacity: 0.8, fontStyle: 'italic', marginTop: 3 }}>
            {s.tagline}
          </div>
          {/* attention marker */}
          <div style={{ position: 'absolute', top: -10, right: 14, width: 22, height: 22, background: t.yellow, border: `2.5px solid ${C}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"DungGeunMo",monospace', fontSize: 13, color: C, boxShadow: `2px 2px 0 0 ${C}`, animation: 'forinBob 1.2s ease-in-out infinite' }}>!</div>
        </div>

        <div style={{ flex: 1, padding: '14px 14px 12px', overflow: 'auto' }}>
          {/* NPC strip */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 14 }}>
            <BriefingPortrait face={s.npc.face}/>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 13, color: C, lineHeight: 1.1 }}>{s.npc.name}</div>
              <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 10, color: t.textSoft, marginTop: 3 }}>{s.npc.sub}</div>
              <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                <DifficultyStars n={s.difficulty}/>
                <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 9, color: t.textSoft }}>⏱ {s.time}</div>
              </div>
            </div>
          </div>

          {/* situation brief */}
          <div style={{ background: '#fff', border: `2.5px solid ${C}`, boxShadow: `3px 3px 0 0 ${C}`, padding: '10px 12px', position: 'relative', marginBottom: 12 }}>
            <div style={{ position: 'absolute', top: -8, left: 10, background: C, color: t.yellow, padding: '0 6px', fontFamily: '"DungGeunMo",monospace', fontSize: 9 }}>
              SITUATION
            </div>
            <div style={{ fontFamily: '"Galmuri11","Pretendard",sans-serif', fontSize: 12, color: t.text, lineHeight: 1.6, marginTop: 3 }}>
              {s.brief}
            </div>
          </div>

          {/* skills practiced */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 9, color: t.textSoft, marginBottom: 5 }}>━ 연습할 스킬 ━━━━━━</div>
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
              {s.skills.map((sk, i) => (
                <div key={i} style={{ background: t.mint, border: `2px solid ${C}`, padding: '3px 7px', fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 10, color: C, boxShadow: `2px 2px 0 0 ${t.mintShadow}` }}>
                  {sk}
                </div>
              ))}
            </div>
          </div>

          {/* rewards */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 9, color: t.textSoft, marginBottom: 5 }}>━ 완료 시 보상 ━━━━━━</div>
            <div style={{ background: t.paper, border: `2px solid ${C}`, padding: '4px 8px', boxShadow: `2px 2px 0 0 ${C}` }}>
              {s.rewards.map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', borderBottom: i < s.rewards.length - 1 ? `1.5px dotted ${C}22` : 'none' }}>
                  <div style={{ width: 20, height: 20, background: '#fff', border: `1.5px solid ${C}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0 }}>{r.ic}</div>
                  <div style={{ flex: 1, fontFamily: '"Galmuri11",monospace', fontSize: 11, color: t.text }}>{r.label}</div>
                  <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: C }}>{r.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* requirements */}
          <div>
            <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 9, color: t.textSoft, marginBottom: 5 }}>━ 입장 조건 ━━━━━━━</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {s.reqs.map((r, i) => (
                <div key={i} style={{
                  background: r.met ? t.mint : '#FEE2E2',
                  border: `2px solid ${C}`, padding: '2px 8px',
                  fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 10, color: C,
                  display: 'flex', alignItems: 'center', gap: 4,
                  boxShadow: `1.5px 1.5px 0 0 ${C}`,
                }}>
                  <span style={{ color: r.met ? '#16A34A' : '#DC2626' }}>{r.met ? '✓' : '✗'}</span>
                  {r.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* footer buttons */}
        <div style={{ borderTop: `3px dotted ${C}44`, background: t.paper, padding: '10px 14px 12px', display: 'flex', gap: 8 }}>
          <button style={{
            flex: 1, background: '#fff', border: `2.5px solid ${C}`,
            padding: '10px 8px', fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 12, color: C,
            boxShadow: `3px 3px 0 0 ${C}`,
          }}>나중에 하기</button>
          <button style={{
            flex: 2, background: t.mint, border: `2.5px solid ${C}`,
            padding: '10px 8px', fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 13, color: C,
            boxShadow: `3px 3px 0 0 ${t.mintShadow}`,
            position: 'relative',
          }}>
            ▶  지금 진행
            <div style={{ position: 'absolute', top: -6, right: -6, background: t.yellow, border: `2px solid ${C}`, padding: '0 4px', fontFamily: '"DungGeunMo",monospace', fontSize: 8, color: C, boxShadow: `1.5px 1.5px 0 0 ${C}` }}>
              +120XP
            </div>
          </button>
        </div>
      </div>

      <style>{`@keyframes forinBob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }`}</style>
    </div>
  );
}

function DifficultyStars({ n }) {
  const C = '#2A2522';
  const t = window.ForinTokens;
  const colors = [t.mint, t.yellow, '#FCA5A5'];
  const labels = ['EASY', 'MEDIUM', 'HARD'];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <div style={{ display: 'flex', gap: 2 }}>
        {[1,2,3].map(i => (
          <div key={i} style={{
            width: 11, height: 11,
            background: i <= n ? colors[n-1] : '#fff',
            border: `1.5px solid ${C}`,
          }}/>
        ))}
      </div>
      <span style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 9, color: C, marginLeft: 2 }}>{labels[n-1]}</span>
    </div>
  );
}

// BriefingPortrait — high-res Face from forin-faces.jsx with a chunky frame.
// BriefingPortrait — Derp character (main forin style) in a chunky frame.
// We render the full Derp body large + anchored to the top so the big head
// fills the frame like a portrait bust; the frame crops the legs.
function BriefingPortrait({ face }) {
  const C = '#2A2522';
  const t = window.ForinTokens;
  const roleMap = {
    nurse:      window.DerpNurse,
    doctor:     window.DerpDoctor,
    surgeon:    window.DerpSurgeon,
    paramedic:  window.DerpParamedic,
    police:     window.DerpPolice,
    patient:    window.DerpPatient,
    child:      window.DerpChild,
    parent:     window.DerpParent,
    visitor:    window.DerpVisitor,
    pharmacist: window.DerpPharmacist,
    player:     window.DerpPlayer,
  };
  const Role = roleMap[face?.role] || window.DerpPatient;
  const isPlayer = face?.role === 'player';
  return (
    <div style={{
      width: 90, height: 102, background: t.peach,
      border: `3px solid ${C}`, boxShadow: `3px 3px 0 0 ${C}`,
      padding: 6, position: 'relative', flexShrink: 0, overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', inset: 6, background: 'rgba(255,255,255,0.4)' }}/>
      <div style={{ position: 'absolute', left: '50%', top: 10, transform: 'translateX(-50%)' }}>
        {isPlayer
          ? <Role size={108} tag="" expression={face?.expression || 'neutral'}/>
          : <Role x={3} y={2} hair={face?.hair} size={108} expression={face?.expression || 'neutral'}/>}
      </div>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `repeating-linear-gradient(0deg, rgba(0,0,0,.07) 0 1px, transparent 1px 3px)`, pointerEvents: 'none' }}/>
    </div>
  );
}

Object.assign(window, { ScreenBriefing });
