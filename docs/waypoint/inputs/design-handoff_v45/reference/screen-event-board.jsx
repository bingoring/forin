// screen-event-board.jsx — Daily scenario board. Fast-travel to any active event.

function ScreenEventBoard() {
  const t = window.ForinTokens;
  const C = '#2A2522';
  const today = new Date(2026, 4, 14); // May 14 2026 (frozen for design demo)
  const todays = window.getTodaysActiveScenarios(today);

  const [filter, setFilter] = React.useState('ALL');

  const byDept = todays.reduce((acc, s) => {
    (acc[s.dept] = acc[s.dept] || []).push(s);
    return acc;
  }, {});

  const deptOrder = ['ER', 'ICU', 'OR', 'PEDS', 'PHARMA'];
  const deptMeta = {
    ER:     { name: '응급실 ER',    short: 'ER',     icon: '🚑', color: '#DC2626' },
    ICU:    { name: '중환자실 ICU', short: 'ICU',    icon: '🛏', color: '#7F1D1D' },
    OR:     { name: '수술실 OR',    short: 'OR',     icon: '🔪', color: '#9333EA' },
    PEDS:   { name: '소아과 Peds',  short: 'PEDS',   icon: '👶', color: '#3B82F6' },
    PHARMA: { name: '약국 Pharma',  short: 'PHARMA', icon: '💊', color: '#16A34A' },
  };

  const totalUrgent = todays.filter(s => s.urgency === 'urgent').length;
  const totalQuest  = todays.filter(s => s.urgency === 'quest').length;

  const visibleDepts = filter === 'ALL' ? deptOrder : [filter];

  return (
    <div data-screen-label="Event Board" style={{ height: '100%', background: t.cream, position: 'relative', overflow: 'auto', paddingBottom: 110 }}>
      <ForinTopBar
        title="오늘의 상황판"
        left={<span style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 18, color: C }}>≡</span>}
        right={<span style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: C }}>5/14 WED</span>}
      />

      {/* Date + summary card */}
      <div style={{ margin: '16px 18px 0', background: t.mint, border: `3px solid ${C}`, padding: 14, boxShadow: `4px 4px 0 0 ${t.mintShadow}`, position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ fontSize: 28 }}>📋</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: C, opacity: 0.7 }}>TODAY · MAY 14</div>
            <div style={{ fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 16, color: C, lineHeight: 1.1, marginTop: 3 }}>
              현장 상황 {todays.length}건 발생
            </div>
          </div>
          <div style={{ background: '#fff', border: `2px solid ${C}`, padding: '4px 8px', boxShadow: `2px 2px 0 0 ${C}`, fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: C, textAlign: 'center' }}>
            <div style={{ color: t.textSoft, fontSize: 8 }}>새로고침</div>
            <div>⏱ 14:23</div>
          </div>
        </div>
        {/* counters */}
        <div style={{ marginTop: 10, display: 'flex', gap: 6 }}>
          <Counter label="URGENT" value={totalUrgent} color="#EF4444"/>
          <Counter label="QUEST"  value={totalQuest}  color="#FACC15"/>
          <Counter label="완료"   value={0}            color={t.mintShadow}/>
          <Counter label="남은"   value={todays.length} color={C}/>
        </div>
      </div>

      {/* Department filter tabs */}
      <div style={{ margin: '14px 12px 0', display: 'flex', gap: 4, overflowX: 'auto', paddingBottom: 2 }}>
        <DeptTab id="ALL" label="전체" icon="✨" color={C} active={filter==='ALL'} count={todays.length}
          onClick={() => setFilter('ALL')}/>
        {deptOrder.map(d => {
          const m = deptMeta[d];
          const count = (byDept[d] || []).length;
          return (
            <DeptTab key={d} id={d} label={m.short} icon={m.icon} color={m.color}
              active={filter===d} count={count}
              onClick={() => setFilter(d)}/>
          );
        })}
      </div>

      {/* department sections */}
      <div style={{ padding: '12px 18px 24px' }}>
        {visibleDepts.map(dept => {
          const list = byDept[dept] || [];
          if (list.length === 0) return null;
          const m = deptMeta[dept];
          return (
            <div key={dept} style={{ marginBottom: 18 }}>
              {/* dept header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{ width: 28, height: 28, background: m.color, border: `2.5px solid ${C}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, boxShadow: `2px 2px 0 0 ${C}` }}>
                  {m.icon}
                </div>
                <div style={{ fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 13, color: C, flex: 1 }}>
                  {m.name}
                </div>
                <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: t.textSoft }}>
                  {list.length}건
                </div>
              </div>
              {/* scenario cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {list.map(s => <EventCard key={s.id} s={s}/>)}
              </div>
            </div>
          );
        })}

        {/* Empty state when filtered dept has no events today */}
        {visibleDepts.length === 1 && !byDept[visibleDepts[0]] && (
          <div style={{ marginTop: 4, padding: '24px 16px', textAlign: 'center', background: t.paper, border: `2px dashed ${C}55`, fontFamily: '"Galmuri11",monospace', fontSize: 11, color: t.textSoft, lineHeight: 1.6 }}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>{deptMeta[visibleDepts[0]]?.icon}</div>
            {deptMeta[visibleDepts[0]]?.name}에 오늘 발생한 상황이 없어요.<br/>
            내일 다시 확인해보세요!
          </div>
        )}

        {/* daily rotation explanation */}
        <div style={{ marginTop: 4, background: t.paper, border: `2px dashed ${C}55`, padding: '8px 10px', fontFamily: '"Galmuri11",monospace', fontSize: 10, color: t.textSoft, lineHeight: 1.5 }}>
          <b style={{ color: C }}>💡 매일 자정마다</b> 새로운 6개의 현장 상황이 랜덤하게 발생해요.
          저장된 시나리오 {window.SCENARIOS.length}종 중 골라요.
        </div>
      </div>

      <ForinBottomNav active="board"/>
    </div>
  );
}

function Counter({ label, value, color }) {
  const C = '#2A2522';
  return (
    <div style={{ flex: 1, background: '#fff', border: `2px solid ${C}`, padding: '4px 6px', textAlign: 'center', boxShadow: `2px 2px 0 0 ${C}77` }}>
      <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 8, color, lineHeight: 1 }}>{label}</div>
      <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 16, color: C, lineHeight: 1.1, marginTop: 2 }}>{value}</div>
    </div>
  );
}

function EventCard({ s }) {
  const t = window.ForinTokens;
  const C = '#2A2522';
  const urgencyBg = { urgent: '#FEE2E2', quest: '#FEF3C7', info: '#fff' }[s.urgency] || '#fff';
  const urgencyAccent = { urgent: '#DC2626', quest: '#CA8A04', info: '#6B7280' }[s.urgency] || C;
  const urgencyLabel = { urgent: 'URGENT', quest: 'QUEST', info: 'INFO' }[s.urgency];

  // Check if any reqs are unmet
  const blocked = s.reqs && s.reqs.some(r => !r.met);

  return (
    <div style={{
      background: urgencyBg, border: `3px solid ${C}`, padding: '10px 12px',
      boxShadow: `3px 3px 0 0 ${C}`, position: 'relative',
      opacity: blocked ? 0.7 : 1,
    }}>
      {/* urgency tag */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
          <div style={{ background: urgencyAccent, color: '#fff', border: `1.5px solid ${C}`, padding: '1px 6px', fontFamily: '"DungGeunMo",monospace', fontSize: 9, boxShadow: `1.5px 1.5px 0 0 ${C}` }}>
            {urgencyLabel}
          </div>
          <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 9, color: t.textSoft }}>
            {s.roomIcon} {s.roomName}
          </div>
        </div>
        <DifficultyMini n={s.difficulty}/>
      </div>

      {/* title + npc */}
      <div style={{ fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 13, color: C, lineHeight: 1.2 }}>
        {s.title}
      </div>
      <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 10, color: t.textSoft, marginTop: 3 }}>
        👤 {s.npc.name} · {s.npc.sub}
      </div>

      {/* tagline italic */}
      <div style={{ marginTop: 6, padding: '4px 8px', background: '#fff', border: `1.5px solid ${C}44`, fontFamily: '"Galmuri11",monospace', fontSize: 10, color: t.text, fontStyle: 'italic', lineHeight: 1.3 }}>
        {s.tagline}
      </div>

      {/* skill chips + time */}
      <div style={{ marginTop: 8, display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
        {s.skills.slice(0, 2).map((sk, i) => (
          <div key={i} style={{ background: t.mint, border: `1.5px solid ${C}`, padding: '1px 5px', fontFamily: '"DungGeunMo",monospace', fontSize: 8, color: C }}>{sk}</div>
        ))}
        {s.skills.length > 2 && (
          <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 8, color: t.textSoft }}>+{s.skills.length - 2}</div>
        )}
        <div style={{ marginLeft: 'auto', fontFamily: '"DungGeunMo",monospace', fontSize: 9, color: t.textSoft }}>
          ⏱ {s.time}
        </div>
      </div>

      {/* footer actions */}
      <div style={{ marginTop: 9, display: 'flex', gap: 6 }}>
        <button style={{ flex: 1, background: '#fff', border: `2px solid ${C}`, padding: '5px 6px', fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: C, boxShadow: `2px 2px 0 0 ${C}66` }}>
          📍 위치 보기
        </button>
        <button disabled={blocked} style={{
          flex: 2, background: blocked ? '#E5E7EB' : t.mint, border: `2px solid ${C}`,
          padding: '5px 6px', fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: C,
          boxShadow: blocked ? 'none' : `2px 2px 0 0 ${t.mintShadow}`,
          cursor: blocked ? 'not-allowed' : 'pointer',
          position: 'relative',
        }}>
          {blocked ? '🔒 조건 미달' : '▶ 진행하기'}
        </button>
      </div>
    </div>
  );
}

function DifficultyMini({ n }) {
  const C = '#2A2522';
  const colors = ['#A7F3D0', '#FEF08A', '#FCA5A5'];
  return (
    <div style={{ display: 'flex', gap: 1.5 }}>
      {[1,2,3].map(i => (
        <div key={i} style={{ width: 8, height: 8, background: i <= n ? colors[n-1] : '#fff', border: `1px solid ${C}` }}/>
      ))}
    </div>
  );
}

function DeptTab({ id, label, icon, color, active, count, onClick }) {
  const C = '#2A2522';
  return (
    <button onClick={onClick} style={{
      flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: 4,
      background: active ? color : '#fff',
      border: `2.5px solid ${C}`,
      boxShadow: active ? `2.5px 2.5px 0 0 ${C}` : `2px 2px 0 0 ${C}66`,
      padding: '5px 8px', cursor: 'pointer',
      fontFamily: '"DungGeunMo",monospace', fontSize: 10,
      color: active ? '#fff' : C,
      transform: active ? 'translate(-1px,-1px)' : 'none',
      position: 'relative',
    }}>
      <span style={{ fontSize: 13, lineHeight: 1 }}>{icon}</span>
      <span>{label}</span>
      {count > 0 && (
        <span style={{
          background: active ? '#fff' : color, color: active ? color : '#fff',
          border: `1.5px solid ${C}`, padding: '0 4px', fontSize: 9, lineHeight: '12px',
          marginLeft: 2, minWidth: 14, textAlign: 'center',
        }}>{count}</span>
      )}
    </button>
  );
}

Object.assign(window, { ScreenEventBoard });
