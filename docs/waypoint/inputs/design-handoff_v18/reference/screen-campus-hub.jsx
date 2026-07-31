// screen-campus-hub.jsx — 캠퍼스 탭 개편: 모바일 우선 허브.
//
// 설계 원칙
//  1) 메인 커리큘럼이 1순위 — 순서대로 따라가면 해외 근무에서 마주치는 케이스를
//     빠짐없이 경험. 대화 스테이지 사이에 이벤트(퀴즈·돌발 상황·챕터 시험)를
//     끼워 넣어 대화만 이어지는 피로를 끊는다.
//  2) 건물·층은 리스트/아코디언으로 — 타일맵을 걷지 않고도 원하는 과를 바로 선택.
//  3) 자유 선택 — 오늘의 상황에서 마음대로 골라 해결 가능.
//  4) 게임식 탐험(타일맵 워킹)은 "부차 기능"으로 하단 진입 카드 하나로 격하.
//
// 3개 탭 상태를 각각 스크린으로 노출: curriculum / buildings / today

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
    { id: 'tower', name: '메인 메디컬 타워', sub: '본관 · 9개 과', accent: '#D14B3D', icon: '🏢', open: true,
      floors: [
        { f: '1F', d: '응급의료센터 · 중앙약국', n: 3, hot: true },
        { f: '2F', d: '피부과 센터', n: 1 },
        { f: '3F', d: '수술실 · PACU', n: 2 },
        { f: '4F', d: '중앙 중환자실 ICU', n: 2, hot: true },
        { f: '5-8F', d: '내과 · 외과 · 정형외과 병동', n: 4 },
      ] },
    { id: 'women', name: '여성소아 센터', sub: '별관 1 · 6개 과', accent: '#C2487E', icon: '🏥',
      floors: [{ f: '1F', d: '소아·산부인과 외래', n: 2 }, { f: '3F', d: '분만실 · 산후 · 신생아실', n: 3 }, { f: '4-6F', d: 'NICU · PICU', n: 2 }] },
    { id: 'onco', name: '암센터 · 특수 재활관', sub: '별관 2 · 6개 과', accent: '#1E8A5B', icon: '🌿',
      floors: [{ f: '1F', d: '재활치료실 PT/OT', n: 2 }, { f: '2F', d: '정신과 폐쇄병동', n: 1 }, { f: '3F', d: '종양 · BMT', n: 2 }, { f: '4F', d: '호스피스 · 노인병동', n: 2 }] },
    { id: 'dx', name: '외래 · 진단 지원동', sub: '별관 3 · 6개 과', accent: '#0E7490', icon: '🔬',
      floors: [{ f: '1F', d: '영상의학 · 진단검사', n: 2 }, { f: '3F', d: '인공신장실 · 주사센터', n: 2 }, { f: '4F', d: '내시경 · Cath · IR', n: 1 }] },
    { id: 'admin', name: '행정 · 백스테이지 윙', sub: '지원동 · 4개 부서', accent: '#6E6354', icon: '📦',
      floors: [{ f: 'B1', d: '영안실 · 부검실', n: 1 }, { f: '1F', d: '중앙공급실 · 영양팀', n: 1 }, { f: '2F', d: '락커 · 휴게실', n: 1 }, { f: '3F', d: '간호부 · 시뮬랩', n: 2 }] },
  ];

  // ── 오늘의 상황 (자유 선택) ─────────────────────────────────────────
  const TODAY = [
    { urg: 1, dept: 'ER · 본관 1F', name: '흉통 환자 트리아지', lv: 'B1', min: 6, tag: '긴급', icon: '🚨' },
    { urg: 0, dept: 'ICU · 본관 4F', name: '승압제 적정 보고', lv: 'B2', min: 8, tag: '진행중', icon: '🖥' },
    { urg: 0, dept: '분만실 · 여성소아 3F', name: '초산모 진통 코칭', lv: 'A2', min: 5, tag: '신규', icon: '👶' },
    { urg: 0, dept: '약국 · 본관 1F', name: '누락 약 확인 요청', lv: 'B1', min: 4, tag: '신규', icon: '💊' },
    { urg: 0, dept: '재활 · 암센터 1F', name: '보행 훈련 지도', lv: 'A2', min: 5, tag: '신규', icon: '🦮' },
  ];

  // ══ 공통 조각 ═══════════════════════════════════════════════════════
  function Head({ tab }) {
    const t = T();
    const tabs = [['curriculum', '커리큘럼'], ['buildings', '건물·층'], ['today', '오늘의 상황']];
    return (
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 116, background: t.cream, borderBottom: `3px solid ${t.ink}`, padding: '48px 14px 0', zIndex: 8, boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 17, color: t.ink }}>캠퍼스</div>
          <div style={{ background: t.mint, border: `2px solid ${t.ink}`, padding: '2px 7px', fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: t.ink, boxShadow: `2px 2px 0 0 ${t.mintShadow}` }}>Lv.B1</div>
          <div style={{ flex: 1 }}/>
          <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: t.ink }}>🔥 12일</div>
        </div>
        <div style={{ display: 'flex' }}>
          {tabs.map(([id, label]) => {
            const on = id === tab;
            return <div key={id} style={{ flex: 1, textAlign: 'center', padding: '7px 0 6px', fontFamily: '"DungGeunMo",monospace', fontSize: 12,
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

  const Scroll = ({ children }) => (
    <div style={{ position: 'absolute', top: 116, left: 0, right: 0, bottom: 0, overflowY: 'auto', padding: '12px 14px 138px' }}>{children}</div>
  );

  function Shell({ label, tab, children }) {
    const t = T();
    return (
      <div data-screen-label={label} style={{ height: '100%', background: t.paper, position: 'relative', overflow: 'hidden' }}>
        <Head tab={tab}/>
        <Scroll>{children}</Scroll>
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
        {/* 이어하기 히어로 */}
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

        {/* 현재 챕터 스텝 — 대화 사이에 이벤트가 끼워진 타임라인 */}
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

        {/* 전체 로드맵 */}
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

  // ══ TAB 2 · 건물·층 (모바일 아코디언) ═══════════════════════════════
  function ScreenCampusBuildings() {
    const t = T();
    return (
      <Shell label="Campus · 건물·층" tab="buildings">
        <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 10.5, color: t.textSoft, marginBottom: 11, lineHeight: 1.5 }}>
          건물을 눌러 층을 펼치고, 층을 선택해 바로 그 과로 이동합니다. 걸어다니지 않아도 됩니다.
        </div>
        {BLD.map((b, i) => (
          <div key={i} style={{ marginBottom: 10, border: `3px solid ${t.ink}`, boxShadow: `3px 3px 0 0 ${t.ink}`, background: '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '10px 11px', background: b.open ? t.cream : '#fff', borderBottom: b.open ? `2.5px solid ${t.ink}` : 'none' }}>
              <div style={{ width: 28, height: 28, flexShrink: 0, background: b.accent, border: `2px solid ${t.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>{b.icon}</div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 12.5, color: t.ink }}>{b.name}</div>
                <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 9.5, color: t.textSoft, marginTop: 2 }}>{b.sub}</div>
              </div>
              <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 13, color: t.ink }}>{b.open ? '▾' : '▸'}</div>
            </div>
            {b.open && b.floors.map((f, j) => (
              <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 11px', borderBottom: j < b.floors.length - 1 ? `1.5px dotted ${t.ink}33` : 'none' }}>
                <div style={{ width: 38, flexShrink: 0, background: t.ink, color: t.cream, fontFamily: '"DungGeunMo",monospace', fontSize: 9.5, textAlign: 'center', padding: '3px 0', border: `2px solid ${t.ink}` }}>{f.f}</div>
                <div style={{ minWidth: 0, flex: 1, fontFamily: '"Galmuri11",monospace', fontSize: 11, color: t.ink, lineHeight: 1.25 }}>{f.d}</div>
                {f.hot && <span style={{ background: t.red, border: `1.5px solid ${t.ink}`, fontFamily: '"DungGeunMo",monospace', fontSize: 8.5, color: t.ink, padding: '1px 4px', flexShrink: 0 }}>긴급</span>}
                <span style={{ background: t.mint, border: `1.5px solid ${t.ink}`, fontFamily: '"DungGeunMo",monospace', fontSize: 9, color: t.ink, padding: '1px 5px', flexShrink: 0 }}>{f.n}건</span>
                <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 12, color: t.ink, flexShrink: 0 }}>›</div>
              </div>
            ))}
          </div>
        ))}
      </Shell>
    );
  }

  // ══ TAB 3 · 오늘의 상황 (자유 선택) ════════════════════════════════
  function ScreenCampusToday() {
    const t = T();
    return (
      <Shell label="Campus · 오늘의 상황" tab="today">
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 11 }}>
          <div style={{ flex: 1, fontFamily: '"Galmuri11",monospace', fontSize: 10.5, color: t.textSoft, lineHeight: 1.5 }}>
            커리큘럼과 별개로, 마음에 드는 상황을 골라 바로 해결할 수 있습니다.
          </div>
          <div style={{ background: '#fff', border: `2px solid ${t.ink}`, boxShadow: `2px 2px 0 0 ${t.ink}`, padding: '4px 7px', fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: t.ink, flexShrink: 0 }}>⇅ 정렬</div>
        </div>
        {TODAY.map((s, i) => {
          const urgent = s.urg === 1;
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, background: urgent ? t.red : '#fff', border: `3px solid ${t.ink}`,
              boxShadow: `3px 3px 0 0 ${t.ink}`, padding: '10px 11px', marginBottom: 9 }}>
              <div style={{ width: 30, height: 30, flexShrink: 0, background: urgent ? '#fff' : t.cream, border: `2px solid ${t.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>{s.icon}</div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
                  <span style={{ background: urgent ? t.ink : t.yellow, color: urgent ? t.cream : t.ink, border: `1.5px solid ${t.ink}`, fontFamily: '"DungGeunMo",monospace', fontSize: 8.5, padding: '1px 5px' }}>{s.tag}</span>
                  <span style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 9, color: urgent ? t.ink : t.textSoft }}>{s.dept}</span>
                </div>
                <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 12.5, color: t.ink, lineHeight: 1.25 }}>{s.name}</div>
                <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 9, color: urgent ? t.ink : t.textSoft, marginTop: 3 }}>Lv.{s.lv} · 약 {s.min}분</div>
              </div>
              <div style={{ background: t.ink, color: t.cream, border: `2px solid ${t.ink}`, padding: '6px 9px', fontFamily: '"DungGeunMo",monospace', fontSize: 11, flexShrink: 0 }}>시작</div>
            </div>
          );
        })}
        <div style={{ marginTop: 4, textAlign: 'center', fontFamily: '"Galmuri11",monospace', fontSize: 10, color: t.textFaint }}>매일 06:00에 새 상황이 갱신됩니다</div>
      </Shell>
    );
  }

  Object.assign(window, { ScreenCampusCurriculum, ScreenCampusBuildings, ScreenCampusToday });
})();
