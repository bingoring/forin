// screens-quiz-dosage.jsx — J · Dosage calculation (Pharmacy / ICU)

function ScreenQuizDosage() {
  const t = window.ForinTokens;
  const C = '#2A2522';

  return (
    <div data-screen-label="07j Quiz · Dosage" style={{ height: '100%', background: '#1F2937', position: 'relative', overflow: 'hidden' }}>
      <QuizBackdrop/>

      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '52px 16px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 7 }}>
        <button style={{ background: '#fff', border: `2px solid ${C}`, padding: '4px 10px', fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: C, boxShadow: `2px 2px 0 0 ${C}` }}>× 나가기</button>
        <div style={{ background: '#fff', border: `2px solid ${C}`, padding: '4px 8px', fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: C, boxShadow: `2px 2px 0 0 ${C}` }}>
          💊 PHARMA · Safety check
        </div>
      </div>

      <QuizCard
        kind="CALC" zone="약국" title="약물 용량 계산"
        sub="처방 → 바이알 → 투여량 (D ÷ H × Q)"
        missionNum={2} total={3} timer="02:14"
        footer={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ flex: 1, fontFamily: '"Galmuri11",monospace', fontSize: 10, color: C, lineHeight: 1.3 }}>
              <span style={{ color: t.textSoft }}>2nd check by:</span> <b>Nurse Park</b>
            </div>
            <button style={{ background: '#fff', border: `2px solid ${C}`, padding: '7px 10px', fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: C, boxShadow: `2px 2px 0 0 ${C}` }}>↺ 다시</button>
            <button style={{ background: t.mint, border: `2px solid ${C}`, padding: '7px 14px', fontFamily: '"DungGeunMo",monospace', fontSize: 12, color: C, boxShadow: `2px 2px 0 0 ${t.mintShadow}` }}>✓ 더블체크</button>
          </div>
        }>
        {/* order card */}
        <div style={{ background: '#fff', border: `3px solid ${C}`, boxShadow: `3px 3px 0 0 ${C}`, padding: 0, marginBottom: 10, position: 'relative' }}>
          <div style={{ background: '#FEF08A', borderBottom: `2.5px solid ${C}`, padding: '4px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: C }}>📋 ORDER · #0824</div>
            <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 9, color: C }}>Dr. Patel · 14:23</div>
          </div>
          <div style={{ padding: '8px 10px', fontFamily: '"Galmuri11","Pretendard",sans-serif', fontSize: 13, color: C, lineHeight: 1.5 }}>
            <div><b>Patient:</b> Mr. Lee (62 M, Bed 412)</div>
            <div style={{ marginTop: 3 }}>
              <b style={{ background: '#FEF08A', padding: '0 4px' }}>Heparin 5,000 units</b> SC × 1 dose now
            </div>
          </div>
        </div>

        {/* layout: vial on left, worksheet + input on right */}
        <div style={{ display: 'grid', gridTemplateColumns: '92px 1fr', gap: 10 }}>
          {/* vial pixel art */}
          <div style={{ background: t.paper, border: `2.5px solid ${C}`, boxShadow: `3px 3px 0 0 ${C}`, padding: 6, position: 'relative' }}>
            <div style={{ position: 'absolute', top: -7, left: 4, background: '#fff', border: `1.5px solid ${C}`, padding: '0 4px', fontFamily: '"DungGeunMo",monospace', fontSize: 8, color: C }}>
              ON HAND
            </div>
            <VialPixel/>
            <div style={{ marginTop: 4, fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: C, lineHeight: 1.2, textAlign: 'center' }}>
              Heparin
            </div>
            <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 12, color: '#DC2626', textAlign: 'center', marginTop: 2 }}>
              10,000 u/mL
            </div>
            <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 9, color: t.textSoft, textAlign: 'center', marginTop: 1 }}>
              5 mL multi-dose vial
            </div>
          </div>

          {/* worksheet */}
          <div style={{ background: '#fff', border: `2.5px solid ${C}`, boxShadow: `3px 3px 0 0 ${C}`, padding: '8px 10px' }}>
            <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 9, color: t.textSoft, marginBottom: 4 }}>━ FORMULA ━</div>
            {/* D/H × Q */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, fontFamily: '"DungGeunMo","Galmuri11",monospace', color: C }}>
              <Fraction top="D" bottom="H"/>
              <span style={{ fontSize: 14 }}>×</span>
              <span style={{ fontSize: 14 }}>Q</span>
              <span style={{ fontSize: 14 }}>=</span>
              <span style={{ fontSize: 14, background: t.mint, border: `2px solid ${C}`, padding: '2px 6px', boxShadow: `2px 2px 0 0 ${t.mintShadow}` }}>?</span>
            </div>
            {/* substitution row */}
            <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, fontFamily: '"DungGeunMo","Galmuri11",monospace', color: C }}>
              <Fraction top={<span style={{ color: '#DC2626' }}>5,000</span>} bottom={<span style={{ color: '#DC2626' }}>10,000</span>} sub="units"/>
              <span style={{ fontSize: 13 }}>×</span>
              <span style={{ fontSize: 13 }}>1 mL</span>
              <span style={{ fontSize: 13 }}>=</span>
              <div style={{ background: t.yellow, border: `2px solid ${C}`, padding: '3px 8px', boxShadow: `2px 2px 0 0 ${t.yellowShadow}`, fontFamily: '"DungGeunMo",monospace', fontSize: 14 }}>0.5 mL</div>
            </div>

            <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1.5px dashed ${C}33`, fontFamily: '"Galmuri11",monospace', fontSize: 10, color: t.textSoft, lineHeight: 1.4 }}>
              <b style={{ color: C }}>D</b> Desired · <b style={{ color: C }}>H</b> On Hand · <b style={{ color: C }}>Q</b> per Quantity
            </div>
          </div>
        </div>

        {/* syringe scale */}
        <div style={{ marginTop: 10, background: '#fff', border: `2.5px solid ${C}`, boxShadow: `3px 3px 0 0 ${C}`, padding: '8px 10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5 }}>
            <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: C }}>주사기 눈금 (1 mL)</div>
            <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: C }}>
              <span style={{ background: t.mint, padding: '1px 5px', border: `1.5px solid ${C}`, boxShadow: `1.5px 1.5px 0 0 ${t.mintShadow}` }}>0.5 mL</span>
            </div>
          </div>
          <SyringeScale value={0.5}/>
        </div>

        {/* safety check tip */}
        <div style={{ marginTop: 10, padding: '7px 9px', background: '#FEF3C7', border: `2px solid ${C}`, fontFamily: '"Galmuri11",monospace', fontSize: 10, color: C, lineHeight: 1.5, boxShadow: `2px 2px 0 0 ${C}`, display: 'flex', gap: 6 }}>
          <span style={{ background: '#F59E0B', color: '#fff', border: `1.5px solid ${C}`, padding: '0 5px', fontFamily: '"DungGeunMo",monospace', fontSize: 9, flexShrink: 0, height: 14 }}>5R</span>
          <div>
            <b>5 Rights:</b> Right <u>Patient</u> · <u>Drug</u> · <u>Dose</u> · <u>Route</u> · <u>Time</u> — 모두 확인했나요?
          </div>
        </div>
      </QuizCard>
    </div>
  );
}

function Fraction({ top, bottom, sub }) {
  const C = '#2A2522';
  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
      <span style={{ fontSize: 13, padding: '0 3px' }}>{top}</span>
      <div style={{ height: 2, background: C, width: '100%' }}/>
      <span style={{ fontSize: 13, padding: '0 3px' }}>{bottom}</span>
      {sub && <span style={{ position: 'absolute', right: -22, top: '50%', transform: 'translateY(-50%)', fontFamily: '"Galmuri11",monospace', fontSize: 9, color: '#6B7280' }}>{sub}</span>}
    </div>
  );
}

function VialPixel() {
  const C = '#2A2522';
  return (
    <svg viewBox="0 0 30 50" width="100%" height="76" shapeRendering="crispEdges">
      {/* cap */}
      <rect x="10" y="2" width="10" height="3" fill="#475569"/>
      <rect x="9" y="5" width="12" height="2" fill="#64748B"/>
      <rect x="9" y="5" width="12" height="2" fill="none" stroke={C} strokeWidth=".4"/>
      {/* neck */}
      <rect x="11" y="7" width="8" height="2" fill="#94A3B8" stroke={C} strokeWidth=".4"/>
      {/* body */}
      <rect x="7" y="9" width="16" height="32" fill="#E0E7FF" stroke={C} strokeWidth=".5"/>
      {/* liquid */}
      <rect x="8" y="14" width="14" height="26" fill="#A5B4FC"/>
      <rect x="8" y="14" width="14" height="2" fill="#7C8CE6"/>
      {/* label */}
      <rect x="6" y="20" width="18" height="14" fill="#FFF" stroke={C} strokeWidth=".5"/>
      <rect x="6" y="20" width="18" height="3" fill="#DC2626"/>
      <rect x="8" y="25" width="14" height="1" fill={C}/>
      <rect x="8" y="27" width="10" height="1" fill={C}/>
      <rect x="8" y="29" width="12" height="1" fill={C}/>
      <rect x="8" y="31" width="8" height="1" fill={C}/>
      {/* base */}
      <rect x="6" y="41" width="18" height="3" fill="#94A3B8" stroke={C} strokeWidth=".4"/>
    </svg>
  );
}

function SyringeScale({ value }) {
  const C = '#2A2522';
  const t = window.ForinTokens;
  // 0.0 to 1.0 with 0.1 marks
  return (
    <div style={{ position: 'relative', height: 28 }}>
      {/* barrel */}
      <div style={{ position: 'absolute', left: 6, right: 28, top: 8, bottom: 8, background: '#fff', border: `2px solid ${C}` }}>
        {/* fill up to value (out of 1.0) */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${value * 100}%`, background: '#A5B4FC', borderRight: `2px solid ${C}` }}/>
        {/* tick marks */}
        {[0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9].map(v => (
          <div key={v} style={{
            position: 'absolute', left: `${v * 100}%`, top: 0, bottom: 0, width: 1,
            background: C, opacity: v === 0.5 ? 1 : 0.4,
          }}/>
        ))}
        {/* 0.5 emphasis */}
        <div style={{ position: 'absolute', left: '50%', top: -10, transform: 'translateX(-50%)', fontFamily: '"DungGeunMo",monospace', fontSize: 8, color: C }}>0.5</div>
        <div style={{ position: 'absolute', right: -4, top: -10, fontFamily: '"DungGeunMo",monospace', fontSize: 8, color: t.textSoft }}>1.0</div>
        <div style={{ position: 'absolute', left: -4, top: -10, fontFamily: '"DungGeunMo",monospace', fontSize: 8, color: t.textSoft }}>0</div>
      </div>
      {/* plunger */}
      <div style={{ position: 'absolute', left: `${6 + value * (100 * 0.85)}px`, top: 4, bottom: 4, width: 6, background: '#374151', border: `1.5px solid ${C}` }}/>
      {/* tip */}
      <div style={{ position: 'absolute', left: 0, top: 12, width: 8, height: 4, background: '#475569', border: `1.5px solid ${C}` }}/>
      {/* needle */}
      <div style={{ position: 'absolute', right: 6, top: 13, width: 22, height: 2, background: C }}/>
    </div>
  );
}

Object.assign(window, { ScreenQuizDosage });
