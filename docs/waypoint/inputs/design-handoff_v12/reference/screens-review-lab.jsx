// screens-review-lab.jsx — 리뷰랩 (Review Lab) — the "오답노트 / speak-like-a-local"
// tab. AI-corrected sentences from scenarios become reviewable phrase cards
// with spaced-repetition. Bottom-nav tab id = 'lab'.

function ScreenReviewLab() {
  const T = window.ForinTokens;
  const C = T.ink;

  // category filter tabs
  const cats = [
    { id: 'all',    label: '전체',   count: 14, color: T.mint },
    { id: 'due',    label: '복습',   count: 5,  color: '#FCA5A5' },
    { id: 'pain',   label: '통증',   count: 4,  color: T.peach },
    { id: 'sbar',   label: 'SBAR',  count: 3,  color: T.blue },
    { id: 'phrase', label: '표현',   count: 2,  color: T.lilac },
  ];

  // phrase cards — each a corrected line
  const cards = [
    {
      dept: 'ER · 통증 사정', tone: T.peach, due: true,
      bad: 'I want to ask about your pain.',
      good: 'Can you tell me about your pain?',
      note: '"I want to ask"는 다소 직역체예요. 환자에게는 부드러운 의문문이 자연스러워요.',
      tag: '통증', mastery: 1,
    },
    {
      dept: 'ICU · SBAR 인계', tone: T.blue, due: true,
      bad: 'The patient condition is not good.',
      good: 'The patient is showing signs of deterioration.',
      note: '임상 인계에서는 구체적 임상 표현을 써요. "not good" → "deterioration".',
      tag: 'SBAR', mastery: 0,
    },
    {
      dept: 'ER · 트리아지', tone: T.peach, due: false,
      bad: 'Please wait a moment, I call the doctor.',
      good: "Please hold on, I'll get the doctor right away.",
      note: '미래 의지는 will. "I call" → "I\'ll get". right away로 긴급함을 전달.',
      tag: '표현', mastery: 2,
    },
    {
      dept: '약국 · 복약 상담', tone: T.mint, due: false,
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

        {/* ── Category filter ── */}
        <div style={{ marginTop: 16, display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
          {cats.map((c, i) => (
            <window.FilterTab key={c.id} label={c.label} count={c.count} active={i === 0} color={c.color}/>
          ))}
        </div>

        {/* ── Phrase cards ── */}
        <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {cards.map((c, i) => <PhraseCard key={i} {...c}/>)}
        </div>
      </div>

      <ForinBottomNav active="lab"/>
    </div>
  );
}

function MiniStat(props) { return <window.MiniStat {...props}/>; }

// One corrected-phrase card: bad → good, note, mastery pips, actions.
function PhraseCard({ dept, tone, bad, good, note, tag, mastery, due }) {
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

        {/* footer: mastery pips + actions */}
        <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
            <window.Pips filled={mastery} total={3} color={T.mint} label="숙련"/>
          </div>
          <div style={{ flex: 1 }}/>
          <button style={{ background: '#fff', border: `2px solid ${C}`, boxShadow: `2px 2px 0 0 ${C}`, padding: '4px 8px', fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: C, cursor: 'pointer' }}>🎤 따라 말하기</button>
          <button style={{ background: '#fff', border: `2px solid ${C}`, padding: '4px 7px', fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: C, cursor: 'pointer' }}>★</button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ScreenReviewLab });
