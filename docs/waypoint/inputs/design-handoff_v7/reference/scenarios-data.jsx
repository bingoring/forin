// scenarios-data.jsx — Master scenario library + daily rotation logic.
// Each scenario is a fully-formed briefing that can be picked up by the
// scenario-board, briefing modal, and dialogue screen. The "today's events"
// logic picks a small set per real-life day using a deterministic seed so the
// list is stable within the day but rotates fresh each morning.

(function () {
  const T = () => window.ForinTokens;

  // ─── Catalog ─────────────────────────────────────────────────────
  // dept: ER | OR | PEDS | ICU | PHARMA
  // urgency: 'urgent' (red, immediate) | 'quest' (yellow, regular) | 'info' (white, optional)
  // skills: practiced learning skills (chips on the briefing)
  // weight: rotation likelihood (1 = normal, >1 more likely)
  const SCENARIOS = [
    // ─── ER (8) ──────────────────────────────────────────────────
    {
      id: 'er-hopkins-pain', dept: 'ER', deptName: '응급실', deptColor: '#DC2626',
      room: 'bay4', roomName: 'Bay 4', roomIcon: '🛏',
      title: '통증 사정 — Mrs. Hopkins',
      npc: { name: 'Mrs. Hopkins', sub: '67y / F', portrait: 'patient' },
      tagline: '"It started about an hour ago…"',
      brief: '응급 베이에 막 도착한 환자입니다. 한 시간 전부터 오른팔이 욱신거린다며 호소하고 있어요. 활력 징후는 안정적입니다. PQRST에 따라 통증을 사정하고 닥터에게 전달할 정보를 모아주세요.',
      difficulty: 2, time: '약 5분',
      skills: ['통증 사정 (PQRST)', '청구 어휘', '의문문 만들기'],
      rewards: [{ ic: '⭐', label: '경험치', value: '+ 120 XP' }, { ic: '❤', label: '환자 만족도', value: '+ 6' }, { ic: '🎖', label: '응급 대응 진척', value: '+ 1' }],
      reqs: [{ label: '레벨 B1+', met: true }, { label: '응급 대응력 60+', met: true }],
      urgency: 'urgent', tone: '#FFEDD5', accent: '#E8B584', weight: 1.5,
    },
    {
      id: 'er-police-jdoe', dept: 'ER', deptName: '응급실', deptColor: '#DC2626',
      room: 'reg', roomName: '등록 데스크', roomIcon: '📝',
      title: '경찰 동행 환자 인계',
      npc: { name: 'Officer Davis', sub: 'NYPD · 38m precinct', portrait: 'police' },
      tagline: '"We brought a possible assault victim…"',
      brief: '경찰이 신원 불명의 부상 환자를 데려왔습니다. 환자의 상태, 발견 시각, 알러지 정보 등을 핸드오프로 받고 보고서에 적절히 기록해야 합니다.',
      difficulty: 3, time: '약 8분',
      skills: ['SBAR 인계 받기', '공문서 어휘', '시간/장소 청취'],
      rewards: [{ ic: '⭐', label: '경험치', value: '+ 240 XP' }, { ic: '🤝', label: '동료 신뢰도', value: '+ 10' }, { ic: '📋', label: '특수 시나리오 잠금해제', value: '✓' }],
      reqs: [{ label: '레벨 B2+', met: false }, { label: '응급 대응력 75+', met: true }],
      urgency: 'urgent', tone: '#F3F4F6', accent: '#1F2937', weight: 0.6,
    },
    {
      id: 'er-paramedic-mvc', dept: 'ER', deptName: '응급실', deptColor: '#DC2626',
      room: 'amb', roomName: '앰뷸런스 베이', roomIcon: '🚑',
      title: '교통사고 환자 핸드오프',
      npc: { name: 'Paramedic Ruiz', sub: 'EMS · Unit 27', portrait: 'paramedic' },
      tagline: '"32-year-old, restrained driver, head-on collision…"',
      brief: '교통사고 환자가 EMS로 도착했습니다. SBAR 형식으로 사고 메커니즘, 활력 징후, 처치 내역을 정확히 받아 트리아지 결정을 하세요.',
      difficulty: 3, time: '약 6분',
      skills: ['MVA 어휘', 'EMS 약어', '활력징후 듣기'],
      rewards: [{ ic: '⭐', label: '경험치', value: '+ 200 XP' }, { ic: '❤', label: '환자 만족도', value: '+ 4' }, { ic: '🚨', label: '트라우마 인증 진척', value: '+ 1' }],
      reqs: [{ label: '레벨 B1+', met: true }, { label: '응급 대응력 65+', met: true }],
      urgency: 'urgent', tone: '#FECACA', accent: '#DC2626', weight: 1.2,
    },
    {
      id: 'er-anaphylaxis', dept: 'ER', deptName: '응급실', deptColor: '#DC2626',
      room: 'trauma1', roomName: 'Trauma 1', roomIcon: '🚨',
      title: '아나필락시스 — Peanut allergy',
      npc: { name: 'Tyler Chen', sub: '8y / M · with mom', portrait: 'patient' },
      tagline: '"He ate a cookie at school and now he\'s wheezing…"',
      brief: '아동 환자가 호흡곤란으로 도착했습니다. 어머니에게 알러지, 노출 시간, 이전 반응을 영어로 신속히 청취하고 에피네프린 투여를 준비하세요.',
      difficulty: 3, time: '약 7분',
      skills: ['알러지 어휘', '에피펜 안내', '소아 어조'],
      rewards: [{ ic: '⭐', label: '경험치', value: '+ 220 XP' }, { ic: '❤', label: '환자 만족도', value: '+ 10' }],
      reqs: [{ label: '레벨 B1+', met: true }],
      urgency: 'urgent', tone: '#FCA5A5', accent: '#B91C1C', weight: 0.9,
    },
    {
      id: 'er-chest-pain', dept: 'ER', deptName: '응급실', deptColor: '#DC2626',
      room: 'trauma1', roomName: 'Trauma 1', roomIcon: '🚨',
      title: '흉통 환자 트리아지',
      npc: { name: 'Mr. Robinson', sub: '58y / M', portrait: 'patient' },
      tagline: '"It feels like an elephant on my chest…"',
      brief: '운동 후 발생한 흉통을 호소하는 환자입니다. STEMI 가능성을 배제하기 위해 흉통의 양상, 방사통, 동반 증상을 PQRST로 사정하세요.',
      difficulty: 2, time: '약 6분',
      skills: ['흉통 PQRST', '심혈관 어휘', 'ESI 트리아지'],
      rewards: [{ ic: '⭐', label: '경험치', value: '+ 160 XP' }, { ic: '❤', label: '환자 만족도', value: '+ 5' }],
      reqs: [{ label: '레벨 B1+', met: true }],
      urgency: 'quest', tone: '#FFEDD5', accent: '#E8B584', weight: 1.0,
    },
    {
      id: 'er-mental-health', dept: 'ER', deptName: '응급실', deptColor: '#DC2626',
      room: 'bay2', roomName: 'Bay 2', roomIcon: '🛏',
      title: '자해 위험 환자 사정',
      npc: { name: 'Anonymous', sub: '24y / F', portrait: 'patient' },
      tagline: '"I just want it to stop…"',
      brief: '자해 위험성이 있는 환자입니다. 비판단적 어조로 안전 사정(SAD PERSONS)을 진행하고 공감 표현을 사용하세요. 정신과 컨설트를 요청해야 합니다.',
      difficulty: 3, time: '약 10분',
      skills: ['공감 표현', '안전 사정', '비판단 어조'],
      rewards: [{ ic: '⭐', label: '경험치', value: '+ 280 XP' }, { ic: '❤', label: '환자 만족도', value: '+ 12' }, { ic: '🎖', label: '정신간호 인증 진척', value: '+ 1' }],
      reqs: [{ label: '레벨 B2+', met: false }, { label: '환자 만족도 75+', met: true }],
      urgency: 'urgent', tone: '#DDD6FE', accent: '#7E22CE', weight: 0.5,
    },
    {
      id: 'er-language-barrier', dept: 'ER', deptName: '응급실', deptColor: '#DC2626',
      room: 'triage', roomName: '트리아지', roomIcon: '📋',
      title: '언어 장벽 환자 — 통역 호출',
      npc: { name: 'Mrs. Patel', sub: '45y / F · Hindi speaker', portrait: 'patient' },
      tagline: '"... ... ..." (speaks limited English)',
      brief: '영어가 서툰 환자가 복통을 호소합니다. 손짓과 단순한 영어로 통증 부위와 강도를 파악하고, 통역 서비스(Language Line)를 콜하는 표준 절차를 따르세요.',
      difficulty: 2, time: '약 6분',
      skills: ['단순 영어', '통역 콜 매뉴얼', '비언어 의사소통'],
      rewards: [{ ic: '⭐', label: '경험치', value: '+ 150 XP' }, { ic: '❤', label: '환자 만족도', value: '+ 8' }],
      reqs: [{ label: '레벨 B1+', met: true }],
      urgency: 'quest', tone: '#FEF3C7', accent: '#CA8A04', weight: 1.0,
    },
    {
      id: 'er-fever-child', dept: 'ER', deptName: '응급실', deptColor: '#DC2626',
      room: 'bay1', roomName: 'Bay 1', roomIcon: '🛏',
      title: '고열 아동 — 부모 안심',
      npc: { name: 'Mrs. Kim', sub: 'with 2y daughter', portrait: 'patient' },
      tagline: '"She\'s been crying all night, 103° fever…"',
      brief: '고열로 응급실에 온 유아의 어머니가 매우 불안해합니다. 검사 절차를 단순하게 설명하고 부모를 안심시키며, 아이의 증상 발현 시각과 약물 복용 이력을 청취하세요.',
      difficulty: 2, time: '약 6분',
      skills: ['소아 발열 어휘', '부모 안심', '체온/단위 변환'],
      rewards: [{ ic: '⭐', label: '경험치', value: '+ 140 XP' }, { ic: '❤', label: '환자 만족도', value: '+ 7' }],
      reqs: [{ label: '레벨 B1+', met: true }],
      urgency: 'quest', tone: '#FBCFE8', accent: '#BE185D', weight: 1.0,
    },

    // ─── OR (5) ──────────────────────────────────────────────────
    {
      id: 'or-garcia-consent', dept: 'OR', deptName: '수술실', deptColor: '#9333EA',
      room: 'preop', roomName: 'Pre-op', roomIcon: '💤',
      title: '수술 동의 확인 — Mr. Garcia',
      npc: { name: 'Mr. Garcia', sub: '54y / M · 충수염', portrait: 'patient' },
      tagline: '"Will I be awake during the surgery?"',
      brief: '곧 충수절제술을 받을 환자입니다. 수술 동의 사항 5가지를 재확인하고 마취 전 마지막 질문을 받아주세요. NPO 시간, 알러지, 보철물 여부를 반드시 영어로 확인해야 합니다.',
      difficulty: 3, time: '약 7분',
      skills: ['수술 동의', 'NPO 확인', '환자 안심시키기'],
      rewards: [{ ic: '⭐', label: '경험치', value: '+ 180 XP' }, { ic: '❤', label: '환자 만족도', value: '+ 8' }, { ic: '🎖', label: '수술실 인증 진척', value: '+ 1' }],
      reqs: [{ label: '레벨 B1+', met: true }, { label: '환자 만족도 70+', met: true }],
      urgency: 'quest', tone: '#E9D5FF', accent: '#9333EA', weight: 1.2,
    },
    {
      id: 'or-timeout', dept: 'OR', deptName: '수술실', deptColor: '#9333EA',
      room: 'or1', roomName: 'OR 1', roomIcon: '🔪',
      title: '수술 전 Time-out 진행',
      npc: { name: 'Dr. Kim', sub: '주치의', portrait: 'doctor' },
      tagline: '"Let\'s do the timeout, team."',
      brief: 'WHO 수술 안전 체크리스트를 영어로 진행하세요. 환자 신원, 시행 부위, 절차명을 큰 소리로 확인하고 팀 전원의 동의를 받아 기록합니다.',
      difficulty: 2, time: '약 5분',
      skills: ['WHO 체크리스트', '팀 소통', '확인 응대'],
      rewards: [{ ic: '⭐', label: '경험치', value: '+ 160 XP' }, { ic: '🤝', label: '동료 신뢰도', value: '+ 8' }],
      reqs: [{ label: '레벨 B1+', met: true }],
      urgency: 'quest', tone: '#DDD6FE', accent: '#7E22CE', weight: 1.0,
    },
    {
      id: 'or-instrument-pass', dept: 'OR', deptName: '수술실', deptColor: '#9333EA',
      room: 'or1', roomName: 'OR 1', roomIcon: '🔪',
      title: '기구 패스 — Scrub Nurse',
      npc: { name: 'Dr. Park', sub: '집도의', portrait: 'doctor' },
      tagline: '"Bovie. Suction. Mosquito clamp, please."',
      brief: '집도의의 영어 기구 요청을 정확히 알아듣고 패스해야 합니다. Bovie, hemostat, Metzenbaum 등 외과 기구 어휘를 빠르게 처리하세요.',
      difficulty: 3, time: '약 6분',
      skills: ['외과 기구 어휘', '신속 청취', '간결 응대'],
      rewards: [{ ic: '⭐', label: '경험치', value: '+ 200 XP' }, { ic: '🤝', label: '동료 신뢰도', value: '+ 10' }],
      reqs: [{ label: '레벨 B2+', met: false }],
      urgency: 'quest', tone: '#E9D5FF', accent: '#9333EA', weight: 0.7,
    },
    {
      id: 'or-pacu-handoff', dept: 'OR', deptName: '수술실', deptColor: '#9333EA',
      room: 'pacu', roomName: 'PACU', roomIcon: '❤️‍🩹',
      title: 'PACU 인계',
      npc: { name: 'Nurse Park', sub: 'PACU 수석', portrait: 'doctor' },
      tagline: '"Tell me what happened in there."',
      brief: '수술이 막 끝난 환자를 PACU로 인계합니다. 시술 종류, 마취제, 출혈량, 통증 관리 계획을 SBAR로 정확히 전달하세요.',
      difficulty: 2, time: '약 6분',
      skills: ['SBAR 인계', '마취 어휘', '출혈량 보고'],
      rewards: [{ ic: '⭐', label: '경험치', value: '+ 170 XP' }, { ic: '🤝', label: '동료 신뢰도', value: '+ 8' }],
      reqs: [{ label: '레벨 B1+', met: true }],
      urgency: 'quest', tone: '#A7F3D0', accent: '#16A34A', weight: 1.1,
    },
    {
      id: 'or-family-update', dept: 'OR', deptName: '수술실', deptColor: '#9333EA',
      room: 'family', roomName: '가족 면담', roomIcon: '🪑',
      title: '수술 중 가족 업데이트',
      npc: { name: 'Mrs. Garcia', sub: '환자 부인', portrait: 'patient' },
      tagline: '"Is everything OK? It\'s been so long…"',
      brief: '수술이 예정보다 길어지고 있어 가족에게 진행 상황을 차분하게 설명해야 합니다. 과한 약속 없이 안심시키되, 정확한 정보를 전달하세요.',
      difficulty: 2, time: '약 5분',
      skills: ['가족 응대', '시간 표현', '안심 어조'],
      rewards: [{ ic: '⭐', label: '경험치', value: '+ 140 XP' }, { ic: '❤', label: '환자 만족도', value: '+ 6' }],
      reqs: [{ label: '레벨 B1+', met: true }],
      urgency: 'info', tone: '#FED7AA', accent: '#C2410C', weight: 0.9,
    },

    // ─── PEDS (5) ────────────────────────────────────────────────
    {
      id: 'peds-crying-mia', dept: 'PEDS', deptName: '소아과', deptColor: '#3B82F6',
      room: 'play', roomName: '놀이방', roomIcon: '🎠',
      title: '우는 아이 달래기 — Mia',
      npc: { name: 'Mia', sub: '4y / F', portrait: 'patient' },
      tagline: '"I want my mommy!"',
      brief: '놀이방에서 검사를 기다리는 4세 아이가 부모와 분리되어 울고 있습니다. 아이의 눈높이에서 단순하고 따뜻한 영어로 안심시키고 주의를 다른 곳으로 돌려보세요.',
      difficulty: 1, time: '약 4분',
      skills: ['소아 어조', '단순 영어', '주의 분산'],
      rewards: [{ ic: '⭐', label: '경험치', value: '+ 100 XP' }, { ic: '❤', label: '환자 만족도', value: '+ 8' }],
      reqs: [{ label: '레벨 A2+', met: true }],
      urgency: 'urgent', tone: '#FBCFE8', accent: '#BE185D', weight: 1.4,
    },
    {
      id: 'peds-vax-explain', dept: 'PEDS', deptName: '소아과', deptColor: '#3B82F6',
      room: 'vax', roomName: '예방접종실', roomIcon: '💉',
      title: 'MMR 예방접종 설명',
      npc: { name: 'Mr. Johnson', sub: '6m 아기 아빠', portrait: 'patient' },
      tagline: '"Are there any side effects we should watch for?"',
      brief: '아기의 첫 MMR 백신 접종 전 부모에게 효과, 흔한 부작용(미열, 발진), 응급 신호를 설명하세요. CDC 공식 표현을 활용합니다.',
      difficulty: 2, time: '약 6분',
      skills: ['백신 어휘', '부작용 설명', 'CDC 표현'],
      rewards: [{ ic: '⭐', label: '경험치', value: '+ 150 XP' }, { ic: '❤', label: '환자 만족도', value: '+ 7' }],
      reqs: [{ label: '레벨 B1+', met: true }],
      urgency: 'quest', tone: '#A7F3D0', accent: '#16A34A', weight: 1.2,
    },
    {
      id: 'peds-fever-assessment', dept: 'PEDS', deptName: '소아과', deptColor: '#3B82F6',
      room: 'exam', roomName: '진료실', roomIcon: '🩺',
      title: '발열 아동 진단',
      npc: { name: 'Ella', sub: '5y / F · with mom', portrait: 'patient' },
      tagline: '"My ear hurts and I feel hot…"',
      brief: '귀 통증과 발열을 호소하는 아이를 사정하세요. 발열 지속 시간(°F 단위), 식욕, 행동 변화를 부모에게 묻고 신체검진 절차를 안내합니다.',
      difficulty: 2, time: '약 6분',
      skills: ['발열 단위 변환', '소아 신체검진', '단순 안내'],
      rewards: [{ ic: '⭐', label: '경험치', value: '+ 140 XP' }, { ic: '❤', label: '환자 만족도', value: '+ 6' }],
      reqs: [{ label: '레벨 B1+', met: true }],
      urgency: 'quest', tone: '#BAE6FD', accent: '#0369A1', weight: 1.0,
    },
    {
      id: 'peds-anxious-parent', dept: 'PEDS', deptName: '소아과', deptColor: '#3B82F6',
      room: 'wait', roomName: '대기실', roomIcon: '🎈',
      title: '불안한 부모 안심',
      npc: { name: 'Mrs. Schmidt', sub: '신생아 엄마', portrait: 'patient' },
      tagline: '"Is it normal that he sleeps so much?"',
      brief: '신생아의 정상 발달에 대해 과도하게 걱정하는 어머니를 차분하게 안심시키세요. 정상 수면 시간, 수유 빈도, 적신호를 영어로 설명합니다.',
      difficulty: 2, time: '약 5분',
      skills: ['신생아 발달', '부모 안심', '정상 vs 적신호'],
      rewards: [{ ic: '⭐', label: '경험치', value: '+ 130 XP' }, { ic: '❤', label: '환자 만족도', value: '+ 7' }],
      reqs: [{ label: '레벨 B1+', met: true }],
      urgency: 'info', tone: '#FEF3C7', accent: '#CA8A04', weight: 0.9,
    },
    {
      id: 'peds-immunization-consent', dept: 'PEDS', deptName: '소아과', deptColor: '#3B82F6',
      room: 'welcome', roomName: '환영 데스크', roomIcon: '🌈',
      title: '예방접종 동의서 안내',
      npc: { name: 'Multiple parents', sub: '단체 접종일', portrait: 'patient' },
      tagline: '"Where do I sign this?"',
      brief: '동의서의 각 섹션을 영어로 풀어서 설명하고, 알러지/기왕력 칸의 의미를 안내하세요. 5명의 부모가 차례로 줄을 섭니다.',
      difficulty: 1, time: '약 5분',
      skills: ['동의서 어휘', '연속 응대', '간결 설명'],
      rewards: [{ ic: '⭐', label: '경험치', value: '+ 110 XP' }, { ic: '🤝', label: '동료 신뢰도', value: '+ 4' }],
      reqs: [{ label: '레벨 A2+', met: true }],
      urgency: 'info', tone: '#DDD6FE', accent: '#7E22CE', weight: 1.0,
    },

    // ─── ICU (5) ─────────────────────────────────────────────────
    {
      id: 'icu-park-vent', dept: 'ICU', deptName: '중환자실', deptColor: '#DC2626',
      room: 'r3', roomName: 'Room 3', roomIcon: '🛏',
      title: 'ARDS 환자 인공호흡기 설정 보고',
      npc: { name: 'Dr. Patel', sub: '주치의', portrait: 'doctor' },
      tagline: '"Tell me about Park\'s settings."',
      brief: 'ARDS로 인공호흡기를 사용 중인 Mr. Park의 현재 설정(FiO₂, PEEP, Vt)과 변화 추세를 닥터에게 SBAR로 보고하세요. ABG 결과 해석도 포함합니다.',
      difficulty: 3, time: '약 8분',
      skills: ['Vent 설정 어휘', 'ABG 해석', 'SBAR 인계'],
      rewards: [{ ic: '⭐', label: '경험치', value: '+ 260 XP' }, { ic: '🤝', label: '동료 신뢰도', value: '+ 12' }, { ic: '🎖', label: 'ICU 인증 진척', value: '+ 1' }],
      reqs: [{ label: '레벨 B2+', met: false }, { label: 'ICU 인증력 60+', met: true }],
      urgency: 'urgent', tone: '#FCA5A5', accent: '#B91C1C', weight: 1.0,
    },
    {
      id: 'icu-eol-family', dept: 'ICU', deptName: '중환자실', deptColor: '#DC2626',
      room: 'family', roomName: '가족실', roomIcon: '💔',
      title: '임종 가족과의 면담',
      npc: { name: 'Mr. Wong\'s daughter', sub: 'next of kin', portrait: 'patient' },
      tagline: '"Is there anything more we can do?"',
      brief: '회복 가능성이 낮은 환자의 가족에게 의학적 상황과 DNR/comfort care 옵션을 따뜻하고 명확하게 설명하세요. 의사가 자리에 있고 가족의 질문을 받아주세요.',
      difficulty: 3, time: '약 10분',
      skills: ['임종 어휘', 'DNR 설명', '공감 표현'],
      rewards: [{ ic: '⭐', label: '경험치', value: '+ 300 XP' }, { ic: '❤', label: '환자 만족도', value: '+ 15' }, { ic: '🎖', label: '호스피스 인증 진척', value: '+ 1' }],
      reqs: [{ label: '레벨 B2+', met: false }, { label: '환자 만족도 80+', met: false }],
      urgency: 'info', tone: '#1F2937', accent: '#0F172A', weight: 0.4,
    },
    {
      id: 'icu-code-blue', dept: 'ICU', deptName: '중환자실', deptColor: '#DC2626',
      room: 'r2', roomName: 'Room 2', roomIcon: '🛏',
      title: 'Code Blue 콜 응대',
      npc: { name: 'Mrs. Lee', sub: '심정지 환자', portrait: 'patient' },
      tagline: '"CODE BLUE, ICU ROOM 2!"',
      brief: '심정지가 발생했습니다. CPR 팀을 호출하고 압박-환기 비율, 약물 투여 시각, 리듬 체크 결과를 영어로 정확히 콜하세요.',
      difficulty: 3, time: '약 8분',
      skills: ['ACLS 어휘', '응급 콜', '시간 보고'],
      rewards: [{ ic: '⭐', label: '경험치', value: '+ 280 XP' }, { ic: '🤝', label: '동료 신뢰도', value: '+ 15' }, { ic: '🚨', label: 'ACLS 인증 진척', value: '+ 1' }],
      reqs: [{ label: '레벨 B2+', met: false }],
      urgency: 'urgent', tone: '#1F2937', accent: '#DC2626', weight: 0.7,
    },
    {
      id: 'icu-psychosis', dept: 'ICU', deptName: '중환자실', deptColor: '#DC2626',
      room: 'r4', roomName: 'Room 4', roomIcon: '🛏',
      title: 'ICU Delirium 환자 진정',
      npc: { name: 'Mrs. Park', sub: '입원 5일차', portrait: 'patient' },
      tagline: '"There are bugs everywhere! Get them off me!"',
      brief: 'ICU 섬망 상태의 환자가 환각을 호소합니다. 비판단적이고 차분한 어조로 현실 정향을 시도하고, 가족 사진/시계 등 환경 자극을 활용하세요.',
      difficulty: 2, time: '약 6분',
      skills: ['섬망 어휘', '현실 정향', '차분 어조'],
      rewards: [{ ic: '⭐', label: '경험치', value: '+ 180 XP' }, { ic: '❤', label: '환자 만족도', value: '+ 9' }],
      reqs: [{ label: '레벨 B1+', met: true }],
      urgency: 'quest', tone: '#DDD6FE', accent: '#7E22CE', weight: 0.9,
    },
    {
      id: 'icu-monitor-alarm', dept: 'ICU', deptName: '중환자실', deptColor: '#DC2626',
      room: 'monitor', roomName: '중앙 모니터링', roomIcon: '🖥',
      title: '모니터 알람 해석',
      npc: { name: 'Charge Nurse', sub: '동료', portrait: 'doctor' },
      tagline: '"Room 1 just went off — what is it?"',
      brief: '중앙 모니터에 Room 1의 알람이 떴습니다. 파형을 보고 부정맥 종류를 식별하고 닥터에게 알림 필요 여부를 영어로 보고하세요.',
      difficulty: 2, time: '약 5분',
      skills: ['ECG 파형', '부정맥 어휘', '신속 보고'],
      rewards: [{ ic: '⭐', label: '경험치', value: '+ 150 XP' }, { ic: '🤝', label: '동료 신뢰도', value: '+ 6' }],
      reqs: [{ label: '레벨 B1+', met: true }],
      urgency: 'quest', tone: '#FCA5A5', accent: '#DC2626', weight: 1.0,
    },

    // ─── PHARMA (5) ──────────────────────────────────────────────
    {
      id: 'pharma-heparin', dept: 'PHARMA', deptName: '약국', deptColor: '#16A34A',
      room: 'pickup', roomName: '픽업 카운터', roomIcon: '🏪',
      title: '헤파린 더블 체크',
      npc: { name: 'Pharmacist Lee', sub: '약사', portrait: 'doctor' },
      tagline: '"Let\'s confirm the dose."',
      brief: 'Mr. Lee에게 줄 헤파린 5,000 units 처방을 약사와 함께 5 Rights에 따라 영어로 더블체크하세요. 환자명, 용량, 경로, 시간을 정확히 발음합니다.',
      difficulty: 2, time: '약 5분',
      skills: ['5 Rights 영어', '용량 표현', '환자 식별'],
      rewards: [{ ic: '⭐', label: '경험치', value: '+ 140 XP' }, { ic: '🤝', label: '동료 신뢰도', value: '+ 7' }],
      reqs: [{ label: '레벨 B1+', met: true }],
      urgency: 'quest', tone: '#A7F3D0', accent: '#16A34A', weight: 1.2,
    },
    {
      id: 'pharma-verbal-order', dept: 'PHARMA', deptName: '약국', deptColor: '#16A34A',
      room: 'consult', roomName: '복약 상담', roomIcon: '💬',
      title: '구두 처방 받아쓰기',
      npc: { name: 'Dr. Patel', sub: '주치의 (phone)', portrait: 'doctor' },
      tagline: '"Give morphine, 2 milligrams, IV, every 4 hours, PRN pain."',
      brief: '닥터의 구두 처방을 정확히 받아 적고 약사가 검증하기 전까지 복창(read-back)으로 확인하세요. 닮은소리 단어 주의.',
      difficulty: 2, time: '약 4분',
      skills: ['Verbal Order 청취', 'Read-back', 'PRN/q4h 약어'],
      rewards: [{ ic: '⭐', label: '경험치', value: '+ 130 XP' }, { ic: '🤝', label: '동료 신뢰도', value: '+ 5' }],
      reqs: [{ label: '레벨 B1+', met: true }],
      urgency: 'quest', tone: '#FEF08A', accent: '#CA8A04', weight: 1.3,
    },
    {
      id: 'pharma-pediatric-dose', dept: 'PHARMA', deptName: '약국', deptColor: '#16A34A',
      room: 'compound', roomName: 'Compounding', roomIcon: '⚗',
      title: '소아 용량 환산 (체중 기반)',
      npc: { name: 'Pharm Tech', sub: '약무직', portrait: 'doctor' },
      tagline: '"15 kg patient, 10 mg/kg of acetaminophen…"',
      brief: '체중 기반 처방을 mL 단위로 환산하세요. 시럽 농도와 1회 분량을 계산하고 부모 안내문에 적합한 단어로 표현해야 합니다.',
      difficulty: 3, time: '약 7분',
      skills: ['mg/kg 계산', 'mL 환산', '소아 어조'],
      rewards: [{ ic: '⭐', label: '경험치', value: '+ 200 XP' }, { ic: '🎖', label: '소아약리 진척', value: '+ 1' }],
      reqs: [{ label: '레벨 B1+', met: true }, { label: '응급 대응력 60+', met: true }],
      urgency: 'quest', tone: '#FBCFE8', accent: '#BE185D', weight: 0.8,
    },
    {
      id: 'pharma-controlled-pickup', dept: 'PHARMA', deptName: '약국', deptColor: '#16A34A',
      room: 'safe', roomName: '통제약물 금고', roomIcon: '🔒',
      title: '마약류 픽업 (2인 인증)',
      npc: { name: 'Pharmacist Lee', sub: '약사', portrait: 'doctor' },
      tagline: '"Two-witness sign-out for Schedule II."',
      brief: '통제약물(예: morphine, oxycodone)을 2인 검증 절차로 픽업하세요. 처방, 환자, 용량, 잔량을 영어로 함께 카운트합니다.',
      difficulty: 3, time: '약 6분',
      skills: ['Schedule II 어휘', '2인 검증', '카운트'],
      rewards: [{ ic: '⭐', label: '경험치', value: '+ 220 XP' }, { ic: '🎖', label: '통제약물 인증 진척', value: '+ 1' }],
      reqs: [{ label: '레벨 B2+', met: false }],
      urgency: 'info', tone: '#FCA5A5', accent: '#B91C1C', weight: 0.6,
    },
    {
      id: 'pharma-iv-admixture', dept: 'PHARMA', deptName: '약국', deptColor: '#16A34A',
      room: 'cleanroom', roomName: 'IV 무균실', roomIcon: '🧪',
      title: 'IV 혼합 — STAT 콜',
      npc: { name: 'Compounding Tech', sub: '클린룸', portrait: 'doctor' },
      tagline: '"We need vancomycin 1g in NS 250 mL STAT."',
      brief: 'ICU에서 STAT으로 요청된 항생제 IV 혼합을 USP 797 무균 절차에 따라 진행합니다. 용량 계산, 라벨 인쇄, 인계 절차를 영어로 처리하세요.',
      difficulty: 3, time: '약 8분',
      skills: ['IV 혼합 어휘', 'STAT 절차', 'USP 797'],
      rewards: [{ ic: '⭐', label: '경험치', value: '+ 230 XP' }, { ic: '🤝', label: '동료 신뢰도', value: '+ 10' }],
      reqs: [{ label: '레벨 B2+', met: false }],
      urgency: 'urgent', tone: '#A7F3D0', accent: '#16A34A', weight: 0.8,
    },
  ];

  // ─── Daily rotation ──────────────────────────────────────────────
  // Picks ~6 scenarios per day deterministically. Re-rolls at midnight.
  function getTodaysActiveScenarios(date = new Date()) {
    const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
    const rng = mulberry32(seed);

    // Quota per dept: ER:2 OR:1 ICU:1 PEDS:1 PHARMA:1 = 6
    const quotas = { ER: 2, OR: 1, ICU: 1, PEDS: 1, PHARMA: 1 };
    const picked = [];

    for (const dept of Object.keys(quotas)) {
      const candidates = SCENARIOS.filter(s => s.dept === dept);
      const need = quotas[dept];
      const selected = weightedSample(candidates, need, rng);
      picked.push(...selected);
    }
    return picked;
  }

  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function weightedSample(items, k, rng) {
    const pool = items.slice();
    const out = [];
    while (out.length < k && pool.length > 0) {
      const totalW = pool.reduce((s, it) => s + (it.weight || 1), 0);
      let r = rng() * totalW;
      let i = 0;
      while (r >= 0 && i < pool.length) { r -= pool[i].weight || 1; if (r < 0) break; i++; }
      i = Math.min(i, pool.length - 1);
      out.push(pool[i]);
      pool.splice(i, 1);
    }
    return out;
  }

  function getScenarioById(id) {
    return SCENARIOS.find(s => s.id === id);
  }

  function scenariosByDept(dept) {
    return SCENARIOS.filter(s => s.dept === dept);
  }

  Object.assign(window, { SCENARIOS, getTodaysActiveScenarios, getScenarioById, scenariosByDept });
})();
