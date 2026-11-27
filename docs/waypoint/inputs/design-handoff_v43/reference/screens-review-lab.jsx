// screens-review-lab.jsx — 리뷰랩 (Review Lab) — the "오답노트 / speak-like-a-local"
// tab. AI-corrected sentences from scenarios become reviewable phrase cards
// with spaced-repetition. Bottom-nav tab id = 'lab'.

function ScreenReviewLab() {
  const T = window.ForinTokens;
  const C = T.ink;

  // 교정 노트 탭 안 카테고리 칩
  const cats = [
    { id: 'all',    label: '전체',   count: 14, color: T.mint },
    { id: 'due',    label: '복습',   count: 5,  color: '#FCA5A5' },
    { id: 'pain',   label: '통증',   count: 4,  color: T.peach },
    { id: 'sbar',   label: 'SBAR',  count: 3,  color: T.blue },
    { id: 'phrase', label: '표현',   count: 2,  color: T.lilac },
  ];

  // phrase cards — each a corrected line (+ 장면 맥락)
  const cards = [
    {
      dept: 'ER · 통증 사정', tone: T.peach, due: true,
      ctx: '흉통 환자에게 통증 양상을 묻는 장면',
      bad: 'I want to ask about your pain.',
      good: 'Can you tell me about your pain?',
      note: '"I want to ask"는 다소 직역체예요. 환자에게는 부드러운 의문문이 자연스러워요.',
      tag: '통증', mastery: 1,
    },
    {
      dept: 'ICU · SBAR 인계', tone: T.blue, due: true,
      ctx: '야간 당직 의사에게 환자 상태 악화를 보고하는 장면',
      bad: 'The patient condition is not good.',
      good: 'The patient is showing signs of deterioration.',
      note: '임상 인계에서는 구체적 임상 표현을 써요. "not good" → "deterioration".',
      tag: 'SBAR', mastery: 0,
    },
    {
      dept: 'ER · 트리아지', tone: T.peach, due: false,
      ctx: '대기 중 보호자가 의사를 찾을 때 안심시키는 장면',
      bad: 'Please wait a moment, I call the doctor.',
      good: "Please hold on, I'll get the doctor right away.",
      note: '미래 의지는 will. "I call" → "I\'ll get". right away로 긴급함을 전달.',
      tag: '표현', mastery: 2,
    },
    {
      dept: '약국 · 복약 상담', tone: T.mint, due: false,
      ctx: '퇴원 약 복용법을 설명하는 장면',
      bad: 'Take this medicine two times in one day.',
      good: 'Take this medication twice daily.',
      note: 'medicine보다 medication이 임상적. "two times in one day" → "twice daily".',
      tag: '표현', mastery: 2,
    },
  ];

  return (
    <div data-screen-label="11 Review Lab" style={{ height: '100%', background: T.cream, position: 'relative', overflow: 'hidden' }}>
      <ForinTopBar
        title="리뷰랩 · 오답노트"
        left={<span style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 18, color: C }}>‹</span>}
        right={<span style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 16, color: C }}>🔍</span>}
      />

      <div style={{ height: 'calc(100% - 64px)', overflow: 'auto', padding: '14px 16px 120px' }}>
        {/* ── 섹션 탭 — 교정 노트 / 말하기 / 모범답안 ── */}
        <div style={{ display: 'flex', border: `3px solid ${C}`, boxShadow: `3px 3px 0 0 ${C}`, background: '#fff', marginBottom: 14 }}>
          {[['📓 교정 노트', 14, true], ['🎙 말하기', 128, false], ['📄 모범답안', 34, false]].map((t, i) => (
            <div key={i} style={{ flex: 1, background: t[2] ? T.lilac : '#fff', borderLeft: i ? `2.5px solid ${C}` : 'none', padding: '9px 0 7px', textAlign: 'center' }}>
              <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: C }}>{t[0]}</div>
              <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 8.5, color: T.textSoft, marginTop: 3 }}>{t[1]}</div>
            </div>
          ))}
        </div>

        {/* ── 이하 = 교정 노트 탭 상세 (탭 전용 정보는 전부 탭 아래에) ── */}
        {/* ── Daily review hero ── */}
        <div style={{ background: T.lilac, border: `3px solid ${C}`, boxShadow: `4px 4px 0 0 ${C}`, padding: 14, position: 'relative' }}>
          <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: C, opacity: 0.7 }}>오늘의 복습</div>
          <div style={{ fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 18, color: C, lineHeight: 1.3, marginTop: 4 }}>
            <span style={{ background: '#fff', padding: '0 5px', boxShadow: `2px 2px 0 0 ${C}` }}>5개 카드</span> 복습할 시간이에요
          </div>
          <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 11, color: T.text, marginTop: 8, lineHeight: 1.5 }}>
            AI가 교정한 문장을 <b>'현지인처럼 말하기'</b> 카드로 바꿨어요.<br/>
            기억이 흐려지기 전에 한 번 더 말해볼까요?
          </div>
          <div style={{ marginTop: 12 }}>
            <PixelButton full size="md" bg={T.yellow} shadow={T.yellowShadow}>▶  오늘의 복습 시작 (5)</PixelButton>
          </div>
          <div style={{ position: 'absolute', top: -8, right: -8, fontSize: 26, transform: 'rotate(10deg)' }}>📓</div>
        </div>

        {/* ── Streak / mastery stats ── */}
        <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          <MiniStat label="저장된 카드" value="14" color={T.mint}/>
          <MiniStat label="마스터" value="6" color={T.yellow}/>
          <MiniStat label="복습 대기" value="5" color="#FCA5A5"/>
        </div>

        {/* ── 카테고리 칩 ── */}
        <div style={{ marginTop: 14, display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
          {cats.map((c, i) => (
            <window.FilterTab key={c.id} label={c.label} count={c.count} active={i === 0} color={c.color}/>
          ))}
        </div>

        {/* ── Phrase cards — 기존 교정 노트 카드 그대로 ── */}
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {cards.map((c, i) => <PhraseCard key={i} {...c}/>)}
        </div>
      </div>

      <ForinBottomNav active="lab"/>
    </div>
  );
}

// MiniStat comes from forin-ui.jsx (window.MiniStat). Do NOT re-declare a local
// wrapper named MiniStat — a top-level Babel function IS the global, so
// `window.MiniStat` would resolve to the wrapper and recurse forever
// (white screen + frozen page).

// One corrected-phrase card: 맥락 + bad → good, note, mastery pips, SRS 버튼.
function PhraseCard({ dept, tone, ctx, bad, good, note, tag, mastery, due }) {
  const T = window.ForinTokens;
  const C = T.ink;
  return (
    <div style={{ background: '#fff', border: `3px solid ${C}`, boxShadow: `4px 4px 0 0 ${C}`, position: 'relative' }}>
      {/* header strip */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', background: tone, borderBottom: `2.5px solid ${C}` }}>
        <span style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: C, flex: 1 }}>{dept}</span>
        {due && <span style={{ background: '#EF4444', color: '#fff', border: `1.5px solid ${C}`, padding: '0 5px', fontFamily: '"DungGeunMo",monospace', fontSize: 8 }}>복습</span>}
        <span style={{ background: '#fff', border: `1.5px solid ${C}`, padding: '0 5px', fontFamily: '"DungGeunMo",monospace', fontSize: 8, color: C }}>{tag}</span>
      </div>

      {/* body */}
      <div style={{ padding: '10px 12px' }}>
        {/* 장면 맥락 */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 9 }}>
          <span style={{ background: C, color: T.cream, fontFamily: '"DungGeunMo",monospace', fontSize: 8, padding: '1px 5px', flexShrink: 0 }}>맥락</span>
          <span style={{ fontFamily: '"Galmuri11",monospace', fontSize: 10, color: T.textSoft, lineHeight: 1.4 }}>{ctx}</span>
        </div>
        {/* bad line */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
          <span style={{ background: '#FEE2E2', color: '#B91C1C', border: `1.5px solid ${C}`, fontFamily: '"DungGeunMo",monospace', fontSize: 9, padding: '0 4px', flexShrink: 0, marginTop: 1 }}>✕</span>
          <span style={{ fontFamily: '"Galmuri11","Pretendard",sans-serif', fontSize: 12, color: T.textFaint, textDecoration: 'line-through', lineHeight: 1.4 }}>{bad}</span>
        </div>
        {/* good line */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start', marginTop: 8 }}>
          <span style={{ background: T.mint, color: C, border: `1.5px solid ${C}`, fontFamily: '"DungGeunMo",monospace', fontSize: 9, padding: '0 4px', flexShrink: 0, marginTop: 1 }}>✓</span>
          <span style={{ fontFamily: '"Galmuri11","Pretendard",sans-serif', fontSize: 13, color: C, lineHeight: 1.4 }}>
            <b style={{ background: T.mint, padding: '0 2px' }}>{good}</b>
          </span>
          <span style={{ marginLeft: 'auto', fontSize: 15, flexShrink: 0, cursor: 'pointer' }} title="듣기">🔊</span>
        </div>

        {/* note */}
        <div style={{ marginTop: 10, background: T.paper, border: `1.5px dashed ${C}55`, padding: '6px 8px', fontFamily: '"Galmuri11",monospace', fontSize: 10, color: T.text, lineHeight: 1.5 }}>
          <b style={{ color: C }}>왜?</b> {note}
        </div>

        {/* mastery + 따라 말하기 */}
        <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
            <window.Pips filled={mastery} total={3} color={T.mint} label="숙련"/>
          </div>
          <div style={{ flex: 1 }}/>
          <button style={{ background: '#fff', border: `2px solid ${C}`, boxShadow: `2px 2px 0 0 ${C}`, padding: '4px 8px', fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: C, cursor: 'pointer' }}>🎤 따라 말하기</button>
          <button style={{ background: '#fff', border: `2px solid ${C}`, padding: '4px 7px', fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: C, cursor: 'pointer' }}>★</button>
        </div>

        {/* SRS 판정 — 다시/어려움/알맞음/쉬움 */}
        <div style={{ marginTop: 10, display: 'flex', gap: 6 }}>
          {[['다시', '#FCA5A5', '<1분'], ['어려움', T.peach, '10분'], ['알맞음', T.yellow, '1일'], ['쉬움', T.mint, '4일']].map((b, i) => (
            <div key={i} style={{ flex: 1, background: b[1], border: `2px solid ${C}`, boxShadow: `2px 2px 0 0 ${C}`, padding: '6px 0 4px', textAlign: 'center', cursor: 'pointer' }}>
              <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 10.5, color: C }}>{b[0]}</div>
              <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 7.5, color: C, opacity: .6, marginTop: 1 }}>{b[2]}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── 탭 2 전용 화면 · 직접 말하기 (128문장 규모) ────────────────────
// 리뷰랩 상단 섹션 탭에서 진입 · 검색 + 정렬 + 칩 필터 + 무한스크롤.
function ScreenSpeakList() {
  const T = window.ForinTokens;
  const C = T.ink;
  const rows = [
    { s: "I'm giving you acetaminophen 650 milligrams.", sc: 58, dept: 'ER', d: '8/14', weak: '/mɪn/ · /lɪ/' },
    { s: 'Please bear with me for a moment.', sc: 64, dept: 'ER', d: '8/14', weak: '/ɪə/' },
    { s: 'Your potassium is six point eight.', sc: 66, dept: '인공신장실', d: '8/13', weak: '/eɪ/' },
    { s: 'I need to check your fistula first.', sc: 71, dept: '인공신장실', d: '8/13', weak: '/f/ · /θ/' },
    { s: 'Can you rate the pain from zero to ten?', sc: 73, dept: 'ER', d: '8/12', weak: '/r/' },
    { s: 'The doctor ordered a chest X-ray.', sc: 77, dept: '영상의학', d: '8/12', weak: '/tʃ/' },
    { s: 'Take a deep breath and hold it.', sc: 81, dept: '영상의학', d: '8/11', weak: '—' },
    { s: 'Where does it hurt the most?', sc: 92, dept: 'ER', d: '8/11', weak: '—' },
  ];
  const tone = (n) => n < 60 ? '#FCA5A5' : n < 80 ? T.yellow : T.mint;
  return (
    <div data-screen-label="11b Speak List" style={{ height: '100%', background: T.paper, position: 'relative', overflow: 'hidden' }}>
      {/* header + controls (fixed) */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 186, boxSizing: 'border-box', background: T.cream, borderBottom: `3px solid ${C}`, padding: '48px 14px 0', zIndex: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ background: '#fff', border: `2px solid ${C}`, padding: '4px 8px', fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: C, boxShadow: `2px 2px 0 0 ${C}` }}>‹ 뒤로</div>
          <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 14, color: C }}>🎙 직접 말하기</div>
          <div style={{ flex: 1 }}/>
          <div style={{ background: T.lilac, border: `2px solid ${C}`, padding: '2px 7px', fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: C }}>128</div>
        </div>
        {/* search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 9, background: '#fff', border: `2.5px solid ${C}`, boxShadow: `2px 2px 0 0 ${C}`, padding: '7px 9px' }}>
          <span style={{ fontSize: 12 }}>🔍</span>
          <span style={{ flex: 1, fontFamily: '"Galmuri11",monospace', fontSize: 11, color: T.textFaint }}>문장·단어로 검색</span>
        </div>
        {/* sort + filter chips (swipeable) */}
        {/* mobile: segmented sort + tappable toggle chips + 필터 시트 (드롭다운 X) */}
        <div style={{ display: 'flex', gap: 6, marginTop: 8, alignItems: 'center' }}>
          <div style={{ display: 'flex', border: `2.5px solid ${C}`, boxShadow: `2px 2px 0 0 ${C}`, flexShrink: 0 }}>
            {[['약한 순', true], ['최신', false]].map((c, i) => (
              <div key={i} style={{ background: c[1] ? C : '#fff', color: c[1] ? T.cream : C, padding: '5px 10px', fontFamily: '"DungGeunMo",monospace', fontSize: 10.5, borderLeft: i ? `2px solid ${C}` : 'none' }}>{c[0]}</div>
            ))}
          </div>
          <div style={{ flex: 1 }}/>
          <div style={{ background: T.yellow, border: `2.5px solid ${C}`, boxShadow: `2px 2px 0 0 ${T.yellowShadow}`, padding: '5px 10px', fontFamily: '"DungGeunMo",monospace', fontSize: 10.5, color: C, flexShrink: 0 }}>⚙ 필터 2</div>
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 7, overflowX: 'auto' }}>
          {[['ER', true], ['인공신장실', true], ['영상의학', false], ['미완료만', false]].map((c, i) => (
            <div key={i} style={{ flexShrink: 0, background: c[1] ? T.mint : '#fff', color: C, border: `2px solid ${C}`, padding: '4px 9px', fontFamily: '"DungGeunMo",monospace', fontSize: 10 }}>
              {c[1] ? '✓ ' : ''}{c[0]}
            </div>
          ))}
        </div>
      </div>
      {/* rows — 압축 행 리스트 (기존 형태 유지) */}
      <div style={{ position: 'absolute', top: 186, left: 0, right: 0, bottom: 62, overflowY: 'auto', padding: '10px 14px 18px' }}>
        {rows.map((r, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, background: '#fff', border: `2.5px solid ${C}`, boxShadow: `2.5px 2.5px 0 0 ${C}`, padding: '9px 10px', marginBottom: 8 }}>
            <div style={{ width: 30, flexShrink: 0, background: tone(r.sc), border: `2px solid ${C}`, padding: '4px 0', textAlign: 'center', fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: C }}>{r.sc}</div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontFamily: '"Galmuri11","Pretendard",sans-serif', fontSize: 12, color: C, lineHeight: 1.3 }}>{r.s}</div>
              <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 8.5, color: T.textSoft, marginTop: 3 }}>{r.dept} · {r.d} · 약한 음소 {r.weak}</div>
            </div>
            <div style={{ background: '#FCA5A5', border: `2px solid ${C}`, padding: '5px 7px', fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: C, flexShrink: 0 }}>🎙</div>
          </div>
        ))}
        {/* 무한 스크롤 — 아래로 내리면 자동 로드 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '14px 0 4px' }}>
          <div style={{ display: 'flex', gap: 3 }}>
            {[0, 1, 2].map(i => <div key={i} style={{ width: 6, height: 6, background: i === 0 ? C : C + '44' }}/>)}
          </div>
          <span style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: T.textSoft }}>불러오는 중…</span>
        </div>
        <div style={{ textAlign: 'center', fontFamily: '"Galmuri11",monospace', fontSize: 9.5, color: T.textFaint }}>128문장 중 24개 표시</div>
      </div>
      <ForinBottomNav active="lab"/>
    </div>
  );
}

// ── 탭 3 전용 화면 · 시나리오 모범답안 (34개 규모) ─────────────────
function ScreenModelAnswerList() {
  const T = window.ForinTokens;
  const C = T.ink;
  // 과별 아이콘 + 배경색 — 목록에서 어느 과인지 한눈에 구분
  const rows = [
    { n: 'ER · 흉통 환자 트리아지', st: 3, d: '8/14', ok: 2, ic: '🚨', bg: '#FCA5A5' },
    { n: 'ICU · 승압제 적정 보고', st: 4, d: '8/13', ok: 4, ic: '🖥', bg: T.blue },
    { n: '분만실 · 초산모 진통 코칭', st: 3, d: '8/13', ok: 1, ic: '👶', bg: '#FBCFE8' },
    { n: '약국 · 누락 약 확인 요청', st: 2, d: '8/12', ok: 2, ic: '💊', bg: T.mint },
    { n: '내시경 · 금식 안내', st: 3, d: '8/12', ok: 3, ic: '🔎', bg: T.yellow },
    { n: '정신과 · 불안 환자 진정', st: 4, d: '8/11', ok: 2, ic: '🧠', bg: T.lilac },
    { n: '재활 · 보행 훈련 지도', st: 3, d: '8/10', ok: 3, ic: '🦮', bg: T.peach },
  ];
  return (
    <div data-screen-label="11c Model Answer List" style={{ height: '100%', background: T.paper, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 186, boxSizing: 'border-box', background: T.mint, borderBottom: `3px solid ${C}`, padding: '48px 14px 0', zIndex: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ background: '#fff', border: `2px solid ${C}`, padding: '4px 8px', fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: C, boxShadow: `2px 2px 0 0 ${C}` }}>‹ 뒤로</div>
          <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 14, color: C }}>📄 모범답안</div>
          <div style={{ flex: 1 }}/>
          <div style={{ background: '#fff', border: `2px solid ${C}`, padding: '2px 7px', fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: C }}>34</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 9, background: '#fff', border: `2.5px solid ${C}`, boxShadow: `2px 2px 0 0 ${C}`, padding: '7px 9px' }}>
          <span style={{ fontSize: 12 }}>🔍</span>
          <span style={{ flex: 1, fontFamily: '"Galmuri11",monospace', fontSize: 11, color: T.textFaint }}>시나리오·과로 검색</span>
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 8, alignItems: 'center' }}>
          <div style={{ display: 'flex', border: `2.5px solid ${C}`, boxShadow: `2px 2px 0 0 ${C}`, flexShrink: 0 }}>
            {[['최신', true], ['개선 필요', false]].map((c, i) => (
              <div key={i} style={{ background: c[1] ? C : '#fff', color: c[1] ? T.cream : C, padding: '5px 10px', fontFamily: '"DungGeunMo",monospace', fontSize: 10.5, borderLeft: i ? `2px solid ${C}` : 'none' }}>{c[0]}</div>
            ))}
          </div>
          <div style={{ flex: 1 }}/>
          <div style={{ background: '#fff', border: `2.5px solid ${C}`, boxShadow: `2px 2px 0 0 ${C}`, padding: '5px 10px', fontFamily: '"DungGeunMo",monospace', fontSize: 10.5, color: C, flexShrink: 0 }}>⚙ 필터</div>
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 7, overflowX: 'auto' }}>
          {[['ER', false], ['ICU', true], ['분만실', false], ['약국', false], ['재활', false]].map((c, i) => (
            <div key={i} style={{ flexShrink: 0, background: c[1] ? T.mint : '#fff', color: C, border: `2px solid ${C}`, padding: '4px 9px', fontFamily: '"DungGeunMo",monospace', fontSize: 10 }}>
              {c[1] ? '✓ ' : ''}{c[0]}
            </div>
          ))}
        </div>
      </div>
      <div style={{ position: 'absolute', top: 186, left: 0, right: 0, bottom: 62, overflowY: 'auto', padding: '10px 14px 18px' }}>
        {rows.map((r, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, background: '#fff', border: `2.5px solid ${C}`, boxShadow: `2.5px 2.5px 0 0 ${C}`, padding: '10px 10px', marginBottom: 8 }}>
            <div style={{ width: 30, height: 30, flexShrink: 0, background: r.bg, border: `2px solid ${C}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>{r.ic}</div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 12, color: C, lineHeight: 1.3 }}>{r.n}</div>
              <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 8.5, color: T.textSoft, marginTop: 3 }}>{r.d} · {r.st}단계 · 모범 일치 {r.ok}/{r.st}</div>
            </div>
            {r.ok < r.st && <span style={{ background: T.yellow, border: `1.5px solid ${C}`, fontFamily: '"DungGeunMo",monospace', fontSize: 8.5, color: C, padding: '1px 5px', flexShrink: 0 }}>개선</span>}
            <span style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 13, color: C, flexShrink: 0 }}>›</span>
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '14px 0 4px' }}>
          <div style={{ display: 'flex', gap: 3 }}>
            {[0, 1, 2].map(i => <div key={i} style={{ width: 6, height: 6, background: i === 0 ? C : C + '44' }}/>)}
          </div>
          <span style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: T.textSoft }}>불러오는 중…</span>
        </div>
        <div style={{ textAlign: 'center', fontFamily: '"Galmuri11",monospace', fontSize: 9.5, color: T.textFaint }}>34개 시나리오 중 12개 표시</div>
      </div>
      <ForinBottomNav active="lab"/>
    </div>
  );
}

Object.assign(window, { ScreenReviewLab, ScreenSpeakList, ScreenModelAnswerList });
