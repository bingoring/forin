// screen-elevator.jsx — Building-entry ELEVATOR simulation. Entering any campus
// pavilion opens this: a pixel elevator cab + a floor directory where each floor
// summarises its departments and a LIVE situation count, then you pick a floor
// to ride to that floor's corridor/interior.
//
// Events are NOT hard-coded — each floor maps to scenario departments and reads
// window.getTodaysActiveScenarios() (the same source as the 상황판 / dept
// interiors), so the elevator, board, and rooms always agree. Floors with no
// trackable department simply show no chip.

(function () {
  const T = window.ForinTokens;
  const TODAY = new Date(2026, 4, 14); // frozen demo date — matches the board

  // ── Per-building directory, floors TOP→BOTTOM (as shown in the cab).
  //    sdepts: scenario dept codes (ER/ICU/OR/PEDS/PHARMA) whose live count
  //    surfaces on that floor. Omit when the floor has no tracked scenarios.
  const BUILDINGS = {
    tower: {
      name: '메인 메디컬 타워', sub: '본관 · MAIN MEDICAL TOWER', tone: 'A',
      accent: '#D14B3D', wall: '#E8EAEC', trim: '#C2C7CB',
      floors: [
        { f: '8F', depts: ['정형외과 병동 (Ortho)'], icon: '🦴' },
        { f: '7F', depts: ['일반 외과 병동 (GS)'], icon: '🔪' },
        { f: '6F', depts: ['일반 내과 병동 (IM)'], icon: '🛏' },
        { f: '5F', depts: ['순환기 · 호흡기내과 병동'], icon: '🫁' },
        { f: '4F', depts: ['중앙 ICU', 'CCU · Neuro · TICU'], icon: '🫀', sdepts: ['ICU'] },
        { f: '3F', depts: ['수술실 OR', '회복실 PACU', '당일수술센터'], icon: '🔪', sdepts: ['OR'] },
        { f: '2F', depts: ['피부과 외래', '내과 · 외과 외래'], icon: '🩺' },
        { f: '1F', depts: ['응급의료센터 ER', '원내 약국', '메인 로비'], icon: '🚑', sdepts: ['ER', 'PHARMA'], lobby: true },
      ],
    },
    women: {
      name: '여성소아 센터', sub: '별관 1 · WOMEN & CHILDREN', tone: 'B',
      accent: '#C2487E', wall: '#F3E6D6', trim: '#E0CBB4',
      floors: [
        { f: '6F', depts: ['신생아 중환자실 NICU'], icon: '👶' },
        { f: '5F', depts: ['소아 중환자실 PICU'], icon: '🧒' },
        { f: '4F', depts: ['신생아실 Nursery'], icon: '🍼' },
        { f: '3F', depts: ['가족 분만실 L&D'], icon: '🤰' },
        { f: '3F ', depts: ['산후 병동 Postpartum'], icon: '🛏' },
        { f: '2F', depts: ['소아 일반 병동'], icon: '🧸', sdepts: ['PEDS'] },
        { f: '1F', depts: ['소아청소년과 · 산부인과 외래', '키즈 놀이광장'], icon: '🎈', lobby: true },
      ],
    },
    onco: {
      name: '암센터 · 특수 재활관', sub: '별관 2 · ONCOLOGY & REHAB', tone: 'C',
      accent: '#1E8A5B', wall: '#E4ECE0', trim: '#C2D4BE',
      floors: [
        { f: '4F', depts: ['완화의료 · 호스피스', '노인성 질환 병동'], icon: '🕊' },
        { f: '3F', depts: ['종양학 병동', '조혈모세포 이식실 BMT'], icon: '🎗' },
        { f: '2F', depts: ['정신과 폐쇄 병동', '정신과 외래'], icon: '🧠' },
        { f: '1F', depts: ['대형 재활치료실 PT/OT Gym'], icon: '🦮', lobby: true },
      ],
    },
    dx: {
      name: '외래 · 진단 지원동', sub: '별관 3 · OUTPATIENT & DX', tone: 'D',
      accent: '#0E7490', wall: '#E6E9EC', trim: '#C4CBD2',
      floors: [
        { f: '4F', depts: ['내시경실', '심혈관 조영실 Cath', '인터벤션 IR'], icon: '🔭' },
        { f: '3F', depts: ['인공신장실 Dialysis', '외래 주사센터'], icon: '💉' },
        { f: '2F', depts: ['안과 · 이비인후과 · 비뇨 · 신경과'], icon: '👁' },
        { f: '1F', depts: ['영상의학과', '진단검사의학과', '혈액은행'], icon: '🩻', lobby: true },
      ],
    },
    admin: {
      name: '행정 · 백스테이지 윙', sub: '지원동 · ADMIN & SUPPORT', tone: 'E',
      accent: '#6E6354', wall: '#D9D4C8', trim: '#B3AC98',
      floors: [
        { f: '3F', depts: ['간호부 사무실', '감염관리실', '시뮬레이션 랩'], icon: '🎓' },
        { f: '2F', depts: ['직원 락커룸', '의료진 휴게실 · 식당'], icon: '☕' },
        { f: '1F', depts: ['중앙공급실 SPD', '영양팀 · 배식실', '하역장'], icon: '📦', lobby: true },
        { f: 'B1', depts: ['영안실 · 부검실', '시설팀 기계실'], icon: '🔧' },
      ],
    },
  };

  // live count of active scenarios per dept code (synced with the board)
  function deptCounts() {
    const out = {};
    let list = [];
    try { list = window.getTodaysActiveScenarios ? window.getTodaysActiveScenarios(TODAY) : []; } catch (e) { list = []; }
    list.forEach(s => {
      const d = out[s.dept] || (out[s.dept] = { total: 0, urgent: 0 });
      d.total++; if (s.urgency === 'urgent') d.urgent++;
    });
    return out;
  }

  function FloorButton({ fl, accent, selected, counts, onSelect }) {
    // sum live scenarios across this floor's tracked depts
    let total = 0, urgent = 0;
    (fl.sdepts || []).forEach(d => { if (counts[d]) { total += counts[d].total; urgent += counts[d].urgent; } });
    const chip = fl.sdepts
      ? (total === 0
          ? { bg: '#BFE3D0', dot: '#1E8A5B', label: '정상' }
          : urgent > 0
            ? { bg: '#FCA5A5', dot: '#DC2626', label: `긴급 ${urgent}`, blink: true }
            : { bg: '#FDE68A', dot: '#D97706', label: `진행 ${total}` })
      : null;
    return (
      <div onClick={() => onSelect(fl.f)} style={{
        display: 'flex', alignItems: 'stretch', gap: 0, cursor: 'pointer',
        background: selected ? accent : '#fff',
        border: `2.5px solid ${T.ink}`, boxShadow: `2px 2px 0 0 ${T.ink}`,
        overflow: 'hidden', transition: 'background 80ms',
      }}>
        <div style={{ width: 42, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          background: selected ? '#fff' : T.cream, borderRight: `2px solid ${T.ink}`, padding: '8px 0' }}>
          <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 16, color: T.ink, lineHeight: 1 }}>{fl.f}</div>
          {fl.lobby && <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 7, color: T.textSoft, marginTop: 2 }}>LOBBY</div>}
        </div>
        <div style={{ flex: 1, padding: '7px 6px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 12 }}>{fl.icon}</span>
            <span style={{ fontFamily: '"Galmuri11",monospace', fontSize: 10.5, color: selected ? '#fff' : T.ink, lineHeight: 1.3 }}>{fl.depts.join(' · ')}</span>
          </div>
        </div>
        {chip && (
          <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', padding: '0 7px 0 5px', background: chip.bg, borderLeft: `2px solid ${T.ink}` }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: chip.dot, marginRight: 4, animation: chip.blink ? 'forinBlink .8s steps(2) infinite' : 'none' }}/>
            <span style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 8.5, color: T.ink, whiteSpace: 'nowrap' }}>{chip.label}</span>
          </div>
        )}
      </div>
    );
  }

  function ScreenElevator({ building = 'tower', onPickFloor }) {
    const [bk, setBk] = React.useState(building);
    const b = BUILDINGS[bk];
    const counts = deptCounts();
    const start = b.floors.find(f => f.lobby)?.f || b.floors[b.floors.length - 1].f;
    const [cur, setCur] = React.useState(start);   // where the cab currently is
    const [sel, setSel] = React.useState(start);   // target floor
    const [riding, setRiding] = React.useState(false);

    React.useEffect(() => { const s = b.floors.find(f => f.lobby)?.f || b.floors[b.floors.length - 1].f; setCur(s); setSel(s); setRiding(false); }, [bk]);

    // floors are listed top→bottom, so a smaller index means a higher floor
    const idx = x => b.floors.findIndex(f => f.f === x);
    const dir = idx(sel) < idx(cur) ? 'up' : idx(sel) > idx(cur) ? 'down' : 'same';
    const arrow = dir === 'up' ? '▲' : dir === 'down' ? '▼' : '';

    const ride = () => {
      setRiding(true);
      setTimeout(() => { setRiding(false); setCur(sel); onPickFloor && onPickFloor(bk, sel); }, 1500);
    };

    return (
      <div style={{ position: 'absolute', inset: 0, background: T.paper, display: 'flex', flexDirection: 'column', fontFamily: '"Galmuri11",monospace' }}>
        <ForinTopBar title="엘리베이터" left={<span style={{ fontSize: 20 }}>‹</span>} right={<span style={{ fontSize: 16 }}>🛗</span>}/>

        {/* building switch tabs */}
        <div style={{ display: 'flex', gap: 4, padding: '8px 10px 4px', overflowX: 'auto', background: T.paper, borderBottom: `2px dotted ${T.ink}33` }}>
          {Object.entries(BUILDINGS).map(([k, v]) => (
            <div key={k} onClick={() => setBk(k)} style={{
              flexShrink: 0, cursor: 'pointer', padding: '4px 8px',
              background: k === bk ? v.accent : '#fff', color: k === bk ? '#fff' : T.ink,
              border: `2px solid ${T.ink}`, fontFamily: '"DungGeunMo",monospace', fontSize: 9,
            }}>{v.name}</div>
          ))}
        </div>

        {/* scrollable cab area — generous bottom pad clears the GO bar + nav */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 12px 168px' }}>
          {/* cab header: floor readout + doors */}
          <div style={{ background: b.wall, border: `3px solid ${T.ink}`, boxShadow: `4px 4px 0 0 ${T.ink}`, padding: 12, marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div>
                <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 13, color: T.ink }}>{b.name}</div>
                <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 8.5, color: T.textSoft, marginTop: 1 }}>{b.sub}</div>
              </div>
              <div style={{ background: '#0F1A24', border: `2px solid ${T.ink}`, padding: '4px 10px', minWidth: 46, textAlign: 'center' }}>
                <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 18, color: riding ? '#FBBF24' : '#22D3EE', lineHeight: 1 }}>{sel}</div>
                <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 6, color: '#5A6B78', marginTop: 1 }}>{riding ? `${arrow || '▲'} 이동중` : '정지'}</div>
              </div>
            </div>
            <div style={{ position: 'relative', height: 30, border: `2px solid ${T.ink}`, background: b.trim, overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: '50%', background: `linear-gradient(90deg,${b.wall},${b.trim})`, borderRight: `1px solid ${T.ink}`, transform: riding ? 'translateX(-100%)' : 'translateX(0)', transition: 'transform 1.4s ease-in-out', backgroundImage: `repeating-linear-gradient(90deg, transparent 0 7px, ${T.ink}22 7px 8px)` }}/>
              <div style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: '50%', background: `linear-gradient(90deg,${b.trim},${b.wall})`, borderLeft: `1px solid ${T.ink}`, transform: riding ? 'translateX(100%)' : 'translateX(0)', transition: 'transform 1.4s ease-in-out', backgroundImage: `repeating-linear-gradient(90deg, transparent 0 7px, ${T.ink}22 7px 8px)` }}/>
              {riding && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"DungGeunMo",monospace', fontSize: 9, color: T.ink }}>탑승 중…</div>}
            </div>
          </div>

          {/* floor directory */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: T.textSoft }}>층 선택 · 진료과 & 현황</div>
            <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 8, color: T.textSoft }}>🔴긴급 🟡진행 🟢정상 · 상황판 연동</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {b.floors.map(fl => <FloorButton key={fl.f} fl={fl} accent={b.accent} selected={sel === fl.f} counts={counts} onSelect={setSel}/>)}
          </div>
        </div>

        {/* GO button pinned above the nav (nav ≈ 78px tall) */}
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 78, padding: '10px 12px', background: T.paper, borderTop: `2px solid ${T.ink}` }}>
          <PixelButton full bg={b.accent} shadow={T.ink} color="#fff" onClick={ride} disabled={riding}>
            {riding ? '이동 중…' : dir === 'same' ? `${sel} 층 (현재 위치)` : `${sel} 층으로 이동 ${arrow}`}
          </PixelButton>
        </div>

        <ForinBottomNav active="campus"/>
      </div>
    );
  }

  Object.assign(window, { ScreenElevator, ELEVATOR_BUILDINGS: BUILDINGS });
})();
