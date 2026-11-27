// screens-quiz-triage.jsx — H · ESI triage level decision (ER zone)

function ScreenQuizTriage() {
  const t = window.ForinTokens;
  const C = '#2A2522';

  const levels = [
    { n: 1, color: '#DC2626', name: 'Resuscitation', time: 'Immediate' },
    { n: 2, color: '#F97316', name: 'Emergent',     time: '< 10 min', selected: true },
    { n: 3, color: '#FACC15', name: 'Urgent',       time: '< 30 min' },
    { n: 4, color: '#22C55E', name: 'Less Urgent',  time: '< 1 hour' },
    { n: 5, color: '#3B82F6', name: 'Non-urgent',   time: '< 2 hours' },
  ];

  return (
    <div data-screen-label="07h Quiz · Triage" style={{ height: '100%', background: '#1F2937', position: 'relative', overflow: 'hidden' }}>
      <QuizBackdrop/>

      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '52px 16px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 7 }}>
        <button style={{ background: '#fff', border: `2px solid ${C}`, padding: '4px 10px', fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: C, boxShadow: `2px 2px 0 0 ${C}` }}>× 나가기</button>
        <div style={{ background: '#DC2626', color: '#fff', border: `2px solid ${C}`, padding: '4px 8px', fontFamily: '"DungGeunMo",monospace', fontSize: 11, boxShadow: `2px 2px 0 0 ${C}`, display: 'flex', alignItems: 'center', gap: 4 }}>
          🚑 WALK-IN · 14:23
        </div>
      </div>

      <QuizCard
        kind="DECIDE" zone="ER" title="ESI 트리아지 판정"
        sub='지금 막 도착한 환자의 응급도를 결정하세요'
        missionNum={4} total={4} timer="00:38"
        footer={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ flex: 1, fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: C }}>
              선택: <b style={{ background: '#F97316', color: '#fff', padding: '1px 6px', marginLeft: 4 }}>LV 2</b>
            </div>
            <button style={{ background: '#fff', border: `2px solid ${C}`, padding: '7px 10px', fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: C, boxShadow: `2px 2px 0 0 ${C}` }}>↺ 다시</button>
            <button style={{ background: t.mint, border: `2px solid ${C}`, padding: '7px 14px', fontFamily: '"DungGeunMo",monospace', fontSize: 12, color: C, boxShadow: `2px 2px 0 0 ${t.mintShadow}` }}>✓ 확정</button>
          </div>
        }>
        {/* patient case card */}
        <div style={{ background: '#fff', border: `3px solid ${C}`, boxShadow: `3px 3px 0 0 ${C}`, padding: 10, marginBottom: 12, position: 'relative' }}>
          <div style={{ position: 'absolute', top: -8, left: 10, background: '#DC2626', color: '#fff', border: `1.5px solid ${C}`, padding: '0 5px', fontFamily: '"DungGeunMo",monospace', fontSize: 9 }}>
            PATIENT CASE
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <div style={{ width: 56, height: 64, background: t.peach, border: `2px solid ${C}`, position: 'relative', flexShrink: 0, padding: 4, overflow: 'hidden' }}>
              {window.DerpPatient
                ? <div style={{ position: 'absolute', left: '50%', top: 5, transform: 'translateX(-50%)' }}>
                    <window.DerpPatient x={5} y={2} hair="#9A6B3F" expression="pain" size={66}/>
                  </div>
                : <PatientHeadPixel/>}
              <div style={{ position: 'absolute', inset: 0, backgroundImage: `repeating-linear-gradient(0deg, rgba(0,0,0,.06) 0 1px, transparent 1px 3px)`, pointerEvents: 'none' }}/>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 12, color: C }}>45 y / F</div>
              <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 10, color: t.textSoft, marginTop: 2 }}>도보 입실 · NKDA · 발병 30분 전</div>
              <div style={{ marginTop: 5, padding: '4px 6px', background: t.cream, border: `1.5px solid ${C}`, fontFamily: '"Galmuri11",monospace', fontSize: 10, color: C, lineHeight: 1.35 }}>
                <b style={{ background: '#FEF08A', padding: '0 3px' }}>CC.</b> "Crushing chest pain radiating to the left arm. I'm sweating a lot."
              </div>
            </div>
          </div>
          {/* vitals strip */}
          <div style={{ marginTop: 8, display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 4 }}>
            <Vital label="BP"   value="88/52" unit="mmHg" warn/>
            <Vital label="HR"   value="122"   unit="bpm"  warn/>
            <Vital label="SpO₂" value="88"    unit="%"    warn/>
            <Vital label="Temp" value="36.8"  unit="°C"/>
          </div>
          {/* observation */}
          <div style={{ marginTop: 6, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            <ObsTag>diaphoretic</ObsTag>
            <ObsTag>pale</ObsTag>
            <ObsTag>anxious</ObsTag>
            <ObsTag warn>↓ BP</ObsTag>
            <ObsTag warn>↑ HR</ObsTag>
          </div>
        </div>

        {/* ESI level chips */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {levels.map(l => <TriageRow key={l.n} {...l}/>)}
        </div>

        {/* reasoning panel — appears when one is selected */}
        <div style={{ marginTop: 10, background: '#FFF7ED', border: `2px solid ${C}`, padding: '8px 10px', boxShadow: `2px 2px 0 0 ${C}`, position: 'relative' }}>
          <div style={{ position: 'absolute', top: -8, left: 8, background: '#F97316', color: '#fff', border: `1.5px solid ${C}`, padding: '0 5px', fontFamily: '"DungGeunMo",monospace', fontSize: 9 }}>
            WHY LV 2?
          </div>
          <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 10, color: C, lineHeight: 1.55 }}>
            <Reason ok>흉통 + 발한 + 좌측 방사통 → <b>STEMI 가능성</b></Reason>
            <Reason ok>BP 88/52, SpO₂ 88% — 활력징후 불안정</Reason>
            <Reason bad>아직 심정지 아님 → <s>LV 1</s></Reason>
            <Reason note>📋 다음: 12-lead ECG, IV access, troponin</Reason>
          </div>
        </div>
      </QuizCard>
    </div>
  );
}

function Vital({ label, value, unit, warn }) {
  const C = '#2A2522';
  const t = window.ForinTokens;
  return (
    <div style={{ background: warn ? '#FEE2E2' : t.paper, border: `1.5px solid ${C}`, padding: '4px 5px', textAlign: 'center' }}>
      <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 8, color: t.textSoft, lineHeight: 1 }}>{label}</div>
      <div style={{ fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 13, color: warn ? '#DC2626' : C, lineHeight: 1.1, marginTop: 2 }}>{value}</div>
      <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 8, color: t.textSoft, marginTop: 1 }}>{unit}</div>
    </div>
  );
}

function ObsTag({ children, warn }) {
  const C = '#2A2522';
  return (
    <div style={{
      background: warn ? '#DC2626' : '#fff', color: warn ? '#fff' : C,
      border: `1.5px solid ${C}`, padding: '2px 5px',
      fontFamily: '"DungGeunMo",monospace', fontSize: 9,
      boxShadow: `1.5px 1.5px 0 0 ${C}66`,
    }}>{children}</div>
  );
}

function TriageRow({ n, color, name, time, selected }) {
  const C = '#2A2522';
  const t = window.ForinTokens;
  return (
    <div style={{
      display: 'flex', alignItems: 'stretch',
      background: selected ? color + '22' : '#fff',
      border: `2.5px solid ${selected ? color : C}`,
      boxShadow: selected ? `3px 3px 0 0 ${color}` : `2px 2px 0 0 ${C}66`,
      transform: selected ? 'translate(-1px,-1px)' : 'none',
      cursor: 'pointer',
      position: 'relative',
    }}>
      <div style={{ width: 38, background: color, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRight: `2.5px solid ${C}` }}>
        <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 20, color: '#fff', lineHeight: 1 }}>{n}</div>
        <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 7, color: '#fff', opacity: 0.9 }}>LV</div>
      </div>
      <div style={{ flex: 1, padding: '6px 10px' }}>
        <div style={{ fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 12, color: C }}>{name}</div>
        <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 9, color: t.textSoft }}>{time}</div>
      </div>
      {selected && (
        <div style={{ display: 'flex', alignItems: 'center', padding: '0 10px' }}>
          <div style={{ background: color, color: '#fff', border: `1.5px solid ${C}`, padding: '1px 6px', fontFamily: '"DungGeunMo",monospace', fontSize: 9 }}>✓ SELECTED</div>
        </div>
      )}
    </div>
  );
}

function Reason({ ok, bad, note, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 5, marginBottom: 3 }}>
      <span style={{ minWidth: 14, fontFamily: '"DungGeunMo",monospace', fontSize: 10 }}>
        {ok ? '✓' : bad ? '✗' : ''}
      </span>
      <span>{children}</span>
    </div>
  );
}

function PatientHeadPixel() {
  const C = '#2A2522';
  return (
    <svg viewBox="0 0 16 18" width="100%" height="100%" shapeRendering="crispEdges">
      <rect x="3" y="1" width="10" height="3" fill="#9A6B3F"/>
      <rect x="4" y="3" width="8" height="7" fill="#FDE1C8" stroke={C} strokeWidth=".2"/>
      <rect x="5.5" y="5.5" width="1.5" height="1" fill={C}/>
      <rect x="9" y="5.5" width="1.5" height="1" fill={C}/>
      <rect x="6.5" y="8" width="3" height=".6" fill="#7C2D12"/>
      <rect x="3" y="10" width="10" height="8" fill="#FED7AA" stroke={C} strokeWidth=".2"/>
      {/* sweat drops */}
      <rect x="13" y="4" width="1" height="2" fill="#60A5FA"/>
      <rect x="13" y="6" width="1" height="1" fill="#60A5FA"/>
    </svg>
  );
}

Object.assign(window, { ScreenQuizTriage });
