// screen-campus-hub.jsx — 캠퍼스 탭 개편 (모바일 우선 허브).
//
// ── 정보 구조: 두 탭의 역할을 명확히 분리 ────────────────────────────
//   캠퍼스 탭  = "어디서 무엇을 배울까"  → 장소 · 커리큘럼 축 (이 파일)
//   상황판 탭  = "지금 병원에 무슨 일이"  → 시간 · 전원 피드 축 (screen-event-board)
// 이전 버전의 "오늘의 상황" 탭은 상황판과 역할이 겹쳐 제거했다. 부서별 상황은
// 층을 눌렀을 때 열리는 "부서 상세 시트" 안에서만 다룬다(= 장소에 종속).
//
// 층 탭 → 층을 누르면 인테리어로 바로 들어가지 않는다. 부서 상세 시트가 열리고
// 거기서 사용자가 선택한다:  ① 상황 시작(대화)  ② 이 층 걸어보기(탐험, 부차)
//
// 확장성: 새 부서가 생기면 BLD에 층 한 줄 + DEPT 항목 하나만 추가하면 되고,
// 새 이벤트는 상황판 피드에만 추가된다(두 곳에 중복 기입할 필요 없음).
//
// exports: ScreenCampusCurriculum / ScreenCampusBuildings / ScreenCampusDept

(function () {
  const T = () => window.ForinTokens;

  // ── 메인 커리큘럼 — 챕터 > 스텝(대화/퀴즈/돌발/시험) ────────────────
  const CURRICULUM = [
    { ch: 1, name: '입사 첫 주 · 기본 소통', dept: '본관 1F 로비 · ER', done: 5, total: 5, state: 'done' },
    { ch: 2, name: '응급실 트리아지', dept: '본관 1F 응급의료센터', done: 4, total: 6, state: 'now',
      steps: [
        { k: 'dlg', n: '접수 · 주호소 청취', s: 'done' },
        { k: 'quiz', n: '통증 사정 표현', s: 'done' },
        { k: 'dlg', n: 'KTAS 분류 설명', s: 'done' },
        { k: 'event', n: '돌발 · 구급차 2대 동시 도착', s: 'done' },
        { k: 'dlg', n: '보호자에게 대기 안내', s: 'now' },
        { k: 'boss', n: 'SBAR 인계 (챕터 시험)', s: 'lock' },
      ] },
    { ch: 3, name: '병동 인계와 투약', dept: '본관 5F 내과 병동', done: 0, total: 7, state: 'lock' },
    { ch: 4, name: '수술 전후 케어', dept: '본관 3F 수술실 · PACU', done: 0, total: 6, state: 'lock' },
    { ch: 5, name: '중환자실 집중 감시', dept: '본관 4F ICU', done: 0, total: 8, state: 'lock' },
  ];

  const STEP_META = {
    dlg:   { icon: '💬', label: '대화', bg: 'blue' },
    quiz:  { icon: '📝', label: '퀴즈', bg: 'yellow' },
    event: { icon: '⚡', label: '돌발 이벤트', bg: 'peach' },
    boss:  { icon: '🏁', label: '챕터 시험', bg: 'pink' },
  };

  // ── 건물·층 ─────────────────────────────────────────────────────────
  const BLD = [
    { id: 'tower', name: '메인 메디컬 타워', sub: '본관 · 9개 과', accent: '#D14B3D', icon: '🩺', open: true,
      floors: [
        { f: '1F', d: '응급의료센터 · 중앙약국', n: 3, hot: true, cur: 2 },
        { f: '2F', d: '피부과 센터', n: 1 },
        { f: '3F', d: '수술실 · PACU', n: 2, cur: 4 },
        { f: '4F', d: '중앙 중환자실 ICU', n: 2, hot: true, cur: 5 },
        { f: '5-8F', d: '내과 · 외과 · 정형외과 병동', n: 4, cur: 3 },
      ] },
    { id: 'women', name: '여성소아 센터', sub: '별관 1 · 6개 과', accent: '#C2487E', icon: '👶',
      floors: [{ f: '1F', d: '소아·산부인과 외래', n: 2 }, { f: '3F', d: '분만실 · 산후 · 신생아실', n: 3 }, { f: '4-6F', d: 'NICU · PICU', n: 2 }] },
    { id: 'onco', name: '암센터 · 특수 재활관', sub: '별관 2 · 6개 과', accent: '#1E8A5B', icon: '🧃',
      floors: [{ f: '1F', d: '재활치료실 PT/OT', n: 2 }, { f: '2F', d: '정신과 폐쇄병동', n: 1 }, { f: '3F', d: '종양 · BMT', n: 2 }, { f: '4F', d: '호스피스 · 노인병동', n: 2 }] },
    { id: 'dx', name: '외래 · 진단 지원동', sub: '별관 3 · 6개 과', accent: '#0E7490', icon: '🔎',
      floors: [{ f: '1F', d: '영상의학 · 진단검사', n: 2 }, { f: '3F', d: '인공신장실 · 주사센터', n: 2 }, { f: '4F', d: '내시경 · Cath · IR', n: 1 }] },
    { id: 'admin', name: '행정 · 백스테이지 윙', sub: '지원동 · 4개 부서', accent: '#6E6354', icon: '⚙',
      floors: [{ f: 'B1', d: '영안실 · 부검실', n: 1 }, { f: '1F', d: '중앙공급실 · 영양팀', n: 1 }, { f: '2F', d: '락커 · 휴게실', n: 1 }, { f: '3F', d: '간호부 · 시뮬랩', n: 2 }] },
  ];

  // ── 부서 상세 (층 탭에서 층을 눌렀을 때 열리는 시트) ─────────────────
  const DEPT = {
    name: '응급의료센터', en: 'Emergency Medical Center', where: '메인 메디컬 타워 · 1F',
    accent: '#D14B3D', icon: '🚨', lv: 'B1', cleared: 7, totalSit: 12,
    // 이 부서에 배치된 커리큘럼 스텝 (커리큘럼 축과 연결)
    chapter: { ch: 2, name: '응급실 트리아지', done: 4, total: 6, next: '보호자에게 대기 안내' },
    // 이 부서에서 지금 고를 수 있는 상황 (부서에 종속 = 상황판 전체 피드와 구분)
    sits: [
      { urg: 1, name: '흉통 환자 트리아지', lv: 'B1', min: 6, tag: '긴급', room: '분류소' },
      { urg: 0, name: '주취 환자 진정 · 보안 협조', lv: 'B2', min: 7, tag: '신규', room: '소생실' },
      { urg: 0, name: '소아 열경련 부모 안내', lv: 'A2', min: 5, tag: '신규', room: '패스트트랙' },
      { urg: 0, name: '음압 격리실 인계', lv: 'B1', min: 6, tag: '완료', room: '격리실' },
    ],
  };

  // ══ 공통 조각 ═══════════════════════════════════════════════════════
  function Head({ tab }) {
    const t = T();
    const tabs = [['curriculum', '커리큘럼'], ['buildings', '건물·층']];
    return (
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 112, background: t.cream, borderBottom: `3px solid ${t.ink}`, padding: '48px 14px 0', zIndex: 8, boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 17, color: t.ink }}>캠퍼스</div>
          <div style={{ background: t.mint, border: `2px solid ${t.ink}`, padding: '2px 7px', fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: t.ink, boxShadow: `2px 2px 0 0 ${t.mintShadow}` }}>Lv.B1</div>
          <div style={{ flex: 1 }}/>
          <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: t.ink }}>🔥 12일</div>
        </div>
        <div style={{ display: 'flex' }}>
          {tabs.map(([id, label]) => {
            const on = id === tab;
            return <div key={id} style={{ flex: 1, textAlign: 'center', padding: '7px 0 6px', fontFamily: '"DungGeunMo",monospace', fontSize: 12.5,
              color: on ? t.ink : t.textFaint, background: on ? t.paper : 'transparent',
              border: `3px solid ${on ? t.ink : 'transparent'}`, borderBottom: `3px solid ${on ? t.paper : 'transparent'}`,
              marginBottom: -3, position: 'relative', zIndex: on ? 2 : 1, boxSizing: 'border-box' }}>{label}</div>;
          })}
        </div>
      </div>
    );
  }

  // 하단 부차 기능: 게임식 탐험 진입
  function ExploreDock() {
    const t = T();
    return (
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 62, padding: '10px 14px', background: `linear-gradient(180deg, transparent, ${t.paper} 45%)`, zIndex: 9 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, background: t.lilac, border: `3px solid ${t.ink}`, boxShadow: `3px 3px 0 0 ${t.ink}`, padding: '9px 11px' }}>
          <div style={{ fontSize: 17 }}>🎮</div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 12, color: t.ink }}>캠퍼스 탐험 모드</div>
            <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 9.5, color: t.textSoft, marginTop: 1 }}>직접 걸어다니며 NPC 만나기 · 선택 기능</div>
          </div>
          <div style={{ background: '#fff', border: `2px solid ${t.ink}`, padding: '4px 8px', fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: t.ink }}>입장 ›</div>
        </div>
      </div>
    );
  }

  function Shell({ label, tab, children }) {
    const t = T();
    return (
      <div data-screen-label={label} style={{ height: '100%', background: t.paper, position: 'relative', overflow: 'hidden' }}>
        <Head tab={tab}/>
        <div style={{ position: 'absolute', top: 112, left: 0, right: 0, bottom: 0, overflowY: 'auto', padding: '12px 14px 138px' }}>{children}</div>
        <ExploreDock/>
        <window.ForinBottomNav active="campus"/>
      </div>
    );
  }

  // ══ TAB 1 · 커리큘럼 ════════════════════════════════════════════════
  function ScreenCampusCurriculum() {
    const t = T();
    const cur = CURRICULUM[1];
    return (
      <Shell label="Campus · 커리큘럼" tab="curriculum">
        <div style={{ background: t.mint, border: `3px solid ${t.ink}`, boxShadow: `4px 4px 0 0 ${t.mintShadow}`, padding: '12px', marginBottom: 15, position: 'relative' }}>
          <div style={{ position: 'absolute', top: -8, left: 10, background: t.ink, color: t.cream, padding: '1px 6px', fontFamily: '"DungGeunMo",monospace', fontSize: 9 }}>MAIN CURRICULUM</div>
          <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 10, color: t.ink, opacity: .75, marginTop: 2 }}>CHAPTER {cur.ch} · {cur.dept}</div>
          <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 16, color: t.ink, margin: '4px 0 8px' }}>{cur.name}</div>
          <div style={{ height: 12, background: '#fff', border: `2px solid ${t.ink}`, position: 'relative', marginBottom: 9 }}>
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${cur.done / cur.total * 100}%`, background: t.mintShadow }}/>
            <div style={{ position: 'absolute', right: 4, top: -1, fontFamily: '"DungGeunMo",monospace', fontSize: 8.5, color: t.ink }}>{cur.done}/{cur.total}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ flex: 1, fontFamily: '"Galmuri11",monospace', fontSize: 10.5, color: t.ink }}>다음 · 보호자에게 대기 안내</div>
            <div style={{ background: t.ink, color: t.cream, border: `2px solid ${t.ink}`, padding: '7px 13px', fontFamily: '"DungGeunMo",monospace', fontSize: 12.5 }}>▶ 이어하기</div>
          </div>
        </div>

        <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: t.ink, marginBottom: 8 }}>━ CHAPTER {cur.ch} 진행 ━━━━━━</div>
        <div style={{ position: 'relative', paddingLeft: 16, marginBottom: 17 }}>
          <div style={{ position: 'absolute', left: 6, top: 8, bottom: 8, width: 3, background: t.ink + '22' }}/>
          {cur.steps.map((s, i) => {
            const m = STEP_META[s.k];
            const bg = s.s === 'done' ? '#fff' : s.s === 'now' ? t[m.bg] : t.ink + '11';
            const dot = s.s === 'done' ? t.mintShadow : s.s === 'now' ? t.yellowDeep : t.ink + '33';
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 7, position: 'relative' }}>
                <div style={{ position: 'absolute', left: -14, width: 11, height: 11, background: dot, border: `2px solid ${t.ink}`, borderRadius: '50%' }}/>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, background: bg, border: `2.5px solid ${s.s === 'lock' ? t.ink + '55' : t.ink}`,
                  boxShadow: s.s === 'lock' ? 'none' : `2.5px 2.5px 0 0 ${t.ink}`, padding: '8px 9px', opacity: s.s === 'lock' ? .55 : 1 }}>
                  <span style={{ fontSize: 14 }}>{s.s === 'lock' ? '🔒' : m.icon}</span>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 11.5, color: t.ink, lineHeight: 1.25 }}>{s.n}</div>
                    <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 8.5, color: t.textSoft, marginTop: 2 }}>{m.label}</div>
                  </div>
                  {s.s === 'done' && <span style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 12, color: t.mintShadow }}>✓</span>}
                  {s.s === 'now' && <span style={{ background: t.ink, color: t.cream, fontFamily: '"DungGeunMo",monospace', fontSize: 9, padding: '2px 6px' }}>NOW</span>}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: t.ink, marginBottom: 8 }}>━ 전체 로드맵 ━━━━━━━━</div>
        {CURRICULUM.map((c, i) => {
          const lock = c.state === 'lock', now = c.state === 'now';
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, background: now ? t.yellow : '#fff', border: `2.5px solid ${lock ? t.ink + '55' : t.ink}`,
              boxShadow: lock ? 'none' : `2.5px 2.5px 0 0 ${t.ink}`, padding: '9px 10px', marginBottom: 8, opacity: lock ? .6 : 1 }}>
              <div style={{ width: 26, height: 26, flexShrink: 0, background: c.state === 'done' ? t.mint : now ? t.ink : t.ink + '18',
                color: now ? t.cream : t.ink, border: `2px solid ${t.ink}`, fontFamily: '"DungGeunMo",monospace', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {c.state === 'done' ? '✓' : lock ? '🔒' : c.ch}
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 12, color: t.ink, lineHeight: 1.2 }}>{c.name}</div>
                <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 9, color: t.textSoft, marginTop: 2 }}>{c.dept} · {c.done}/{c.total}</div>
              </div>
              {!lock && <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 13, color: t.ink }}>›</div>}
            </div>
          );
        })}
      </Shell>
    );
  }

  // ══ TAB 2 · 건물·층 ════════════════════════════════════════════════
  function ScreenCampusBuildings() {
    const t = T();
    return (
      <Shell label="Campus · 건물·층" tab="buildings">
        {/* 역할 안내 — 상황판과의 혼동 방지 */}
        <div style={{ display: 'flex', gap: 7, background: t.blue, border: `2.5px solid ${t.ink}`, boxShadow: `2.5px 2.5px 0 0 ${t.ink}`, padding: '8px 10px', marginBottom: 12 }}>
          <span style={{ fontSize: 13 }}>🧭</span>
          <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 10, color: t.ink, lineHeight: 1.5 }}>
            <b>여기</b>는 장소로 찾는 곳 — 층을 누르면 그 부서의 학습 카드가 열립니다.<br/>
            지금 병원 전체에 벌어지는 일은 <b>상황판</b> 탭에서 시간순으로 봅니다.
          </div>
        </div>
        {BLD.map((b, i) => (
          <div key={i} style={{ marginBottom: 10, border: `3px solid ${t.ink}`, boxShadow: `3px 3px 0 0 ${t.ink}`, background: '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '10px 11px', background: b.open ? t.cream : '#fff', borderBottom: b.open ? `2.5px solid ${t.ink}` : 'none' }}>
              <div style={{ width: 28, height: 28, flexShrink: 0, background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 21 }}>{b.icon}</div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 12.5, color: t.ink }}>{b.name}</div>
                <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 9.5, color: t.textSoft, marginTop: 2 }}>{b.sub}</div>
              </div>
              <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 13, color: t.ink }}>{b.open ? '▾' : '▸'}</div>
            </div>
            {b.open && b.floors.map((f, j) => (
              <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 11px', borderBottom: j < b.floors.length - 1 ? `1.5px dotted ${t.ink}33` : 'none' }}>
                <div style={{ width: 38, flexShrink: 0, background: t.ink, color: t.cream, fontFamily: '"DungGeunMo",monospace', fontSize: 9.5, textAlign: 'center', padding: '3px 0', border: `2px solid ${t.ink}` }}>{f.f}</div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 11, color: t.ink, lineHeight: 1.25 }}>{f.d}</div>
                  {/* 층 행은 "학습량"만 요약 — 실시간 이벤트 수가 아니라 커리큘럼/상황 보유량 */}
                  <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                    {f.cur && <span style={{ background: t.mint, border: `1.5px solid ${t.ink}`, fontFamily: '"DungGeunMo",monospace', fontSize: 8, color: t.ink, padding: '1px 4px' }}>CH.{f.cur}</span>}
                    <span style={{ background: '#fff', border: `1.5px solid ${t.ink}`, fontFamily: '"DungGeunMo",monospace', fontSize: 8, color: t.textSoft, padding: '1px 4px' }}>상황 {f.n}</span>
                  </div>
                </div>
                <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 12, color: t.ink, flexShrink: 0 }}>›</div>
              </div>
            ))}
          </div>
        ))}
      </Shell>
    );
  }

  // ══ 층 탭 → 부서 상세 시트 (인테리어도 상황판도 아님) ═══════════════
  function ScreenCampusDept() {
    const t = T();
    const d = DEPT;
    return (
      <div data-screen-label="Campus · 부서 상세 시트" style={{ height: '100%', background: t.ink + 'AA', position: 'relative', overflow: 'hidden' }}>
        {/* 뒤에 남아있는 층 리스트 (컨텍스트 유지) */}
        <div style={{ position: 'absolute', inset: 0, background: t.paper, opacity: .35 }}/>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 112, background: t.cream, opacity: .5, borderBottom: `3px solid ${t.ink}` }}/>

        {/* 시트 */}
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: 74, background: t.paper, border: `3px solid ${t.ink}`, borderBottom: 'none', boxShadow: `0 -4px 0 0 ${t.ink}22`, overflow: 'hidden' }}>
          {/* 그랩바 + 헤더 */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, background: t.cream, borderBottom: `3px solid ${t.ink}`, padding: '8px 14px 11px', zIndex: 5 }}>
            <div style={{ width: 40, height: 4, background: t.ink + '44', margin: '0 auto 9px' }}/>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <div style={{ width: 34, height: 34, flexShrink: 0, background: d.accent, border: `2.5px solid ${t.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17 }}>{d.icon}</div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 15, color: t.ink }}>{d.name}</div>
                <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 9.5, color: t.textSoft, marginTop: 2 }}>{d.where} · {d.en}</div>
              </div>
              <div style={{ background: '#fff', border: `2px solid ${t.ink}`, width: 24, height: 24, textAlign: 'center', lineHeight: '21px', fontFamily: '"DungGeunMo",monospace', fontSize: 13, color: t.ink, flexShrink: 0 }}>×</div>
            </div>
          </div>

          <div style={{ position: 'absolute', top: 84, left: 0, right: 0, bottom: 0, overflowY: 'auto', padding: '12px 14px 96px' }}>
            {/* 진행 요약 */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
              {[['권장 레벨', d.lv], ['해결한 상황', `${d.cleared}/${d.totalSit}`], ['커리큘럼', `CH.${d.chapter.ch}`]].map(([k, v], i) => (
                <div key={i} style={{ flex: 1, background: '#fff', border: `2.5px solid ${t.ink}`, boxShadow: `2.5px 2.5px 0 0 ${t.ink}`, padding: '7px 6px', textAlign: 'center' }}>
                  <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 8.5, color: t.textSoft }}>{k}</div>
                  <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 13, color: t.ink, marginTop: 2 }}>{v}</div>
                </div>
              ))}
            </div>

            {/* ① 커리큘럼 연결 — 이 부서에 배치된 챕터 */}
            <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: t.ink, marginBottom: 8 }}>━ 이 부서의 커리큘럼 ━━━━━</div>
            <div style={{ background: t.mint, border: `3px solid ${t.ink}`, boxShadow: `3px 3px 0 0 ${t.mintShadow}`, padding: '11px', marginBottom: 16 }}>
              <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 9.5, color: t.ink, opacity: .75 }}>CHAPTER {d.chapter.ch}</div>
              <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 14, color: t.ink, margin: '3px 0 7px' }}>{d.chapter.name}</div>
              <div style={{ height: 11, background: '#fff', border: `2px solid ${t.ink}`, position: 'relative', marginBottom: 8 }}>
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${d.chapter.done / d.chapter.total * 100}%`, background: t.mintShadow }}/>
                <div style={{ position: 'absolute', right: 4, top: -2, fontFamily: '"DungGeunMo",monospace', fontSize: 8, color: t.ink }}>{d.chapter.done}/{d.chapter.total}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ flex: 1, fontFamily: '"Galmuri11",monospace', fontSize: 10, color: t.ink }}>다음 · {d.chapter.next}</div>
                <div style={{ background: t.ink, color: t.cream, border: `2px solid ${t.ink}`, padding: '6px 11px', fontFamily: '"DungGeunMo",monospace', fontSize: 11.5 }}>▶ 이어하기</div>
              </div>
            </div>

            {/* ② 이 부서의 상황 (부서 종속 — 병원 전체 피드는 상황판) */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 8 }}>
              <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: t.ink }}>━ 이 부서의 상황 ━━━━━━</div>
            </div>
            {d.sits.map((s, i) => {
              const urgent = s.urg === 1, done = s.tag === '완료';
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, background: urgent ? t.red : '#fff', border: `2.5px solid ${t.ink}`,
                  boxShadow: `2.5px 2.5px 0 0 ${t.ink}`, padding: '9px 10px', marginBottom: 8, opacity: done ? .62 : 1 }}>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
                      <span style={{ background: done ? t.mint : urgent ? t.ink : t.yellow, color: urgent && !done ? t.cream : t.ink, border: `1.5px solid ${t.ink}`, fontFamily: '"DungGeunMo",monospace', fontSize: 8.5, padding: '1px 5px' }}>{s.tag}</span>
                      <span style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 8.5, color: urgent ? t.ink : t.textSoft }}>{s.room}</span>
                    </div>
                    <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 12, color: t.ink, lineHeight: 1.25 }}>{s.name}</div>
                    <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 8.5, color: urgent ? t.ink : t.textSoft, marginTop: 3 }}>Lv.{s.lv} · 약 {s.min}분</div>
                  </div>
                  <div style={{ background: done ? '#fff' : t.ink, color: done ? t.ink : t.cream, border: `2px solid ${t.ink}`, padding: '6px 9px', fontFamily: '"DungGeunMo",monospace', fontSize: 11, flexShrink: 0 }}>{done ? '복습' : '시작'}</div>
                </div>
              );
            })}
          </div>

          {/* 시트 하단 액션 — 탐험은 여기서도 부차 */}
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, background: t.cream, borderTop: `3px solid ${t.ink}`, padding: '10px 14px', display: 'flex', gap: 8 }}>
            <div style={{ flex: 1, background: t.ink, color: t.cream, border: `2.5px solid ${t.ink}`, boxShadow: `2.5px 2.5px 0 0 ${t.ink}`, padding: '10px 0', textAlign: 'center', fontFamily: '"DungGeunMo",monospace', fontSize: 13 }}>▶ 다음 상황 시작</div>
            <div style={{ background: t.lilac, border: `2.5px solid ${t.ink}`, boxShadow: `2.5px 2.5px 0 0 ${t.ink}`, padding: '10px 12px', textAlign: 'center', fontFamily: '"DungGeunMo",monospace', fontSize: 12, color: t.ink, flexShrink: 0 }}>🎮 걸어보기</div>
          </div>
        </div>
      </div>
    );
  }

  Object.assign(window, { ScreenCampusCurriculum, ScreenCampusBuildings, ScreenCampusDept });
})();
