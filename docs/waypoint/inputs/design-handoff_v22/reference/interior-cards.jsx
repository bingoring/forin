// interior-cards.jsx — 순환기·호흡기내과 병동 Cardiac/Pulmonary Ward (본관 5F).
// A telemetry-monitored medical ward: central tele station with a wall of
// waveforms, monitored beds, a step-down bay with cardiac chairs, and a
// pulmonary bay with wall O2 + BiPAP. New objects: interior-objects-cards2.jsx.

function ScreenInteriorCards() {
  const COLS = 28, ROWS = 50;
  const Th = window.IThreshold;
  const W = window;

  const regions = [
    { id: 'clean',   name: 'Clean Utility · 투약',     icon: '💊', bounds: { x: 0,  y: 0,  w: 14, h: 11 } },
    { id: 'tele',    name: '텔레메트리 판독',           icon: '📈', bounds: { x: 13, y: 0,  w: 15, h: 11 } },
    { id: 'station', name: '중앙 간호 스테이션',         icon: '🖥', bounds: { x: 0,  y: 10, w: 28, h: 11 } },
    { id: 'cardiac', name: '심장 모니터 병실',           icon: '🫀', bounds: { x: 0,  y: 20, w: 28, h: 16 } },
    { id: 'pulmo',   name: '호흡기 병실 (O2·BiPAP)',    icon: '🫁', bounds: { x: 0,  y: 35, w: 28, h: 15 } },
  ];

  const rooms = [
    { id: 'clean',   name: 'Clean Utility', sub: '투약 준비',  icon: '💊', color: '#A7F3D0', x: 5,  y: 5 },
    { id: 'tele',    name: '텔레메트리 판독', sub: '중앙 파형', icon: '📈', color: '#C4CBD2', x: 20, y: 5, questCount: 1 },
    { id: 'station', name: '간호 스테이션', sub: '심전도 감시', icon: '🖥', color: '#BAE6FD', x: 13, y: 15, questCount: 1 },
    { id: 'cardiac', name: '심장 병실',    sub: '모니터·기좌', icon: '🫀', color: '#FBCFE8', x: 8,  y: 27, questCount: 2 },
    { id: 'pulmo',   name: '호흡기 병실',  sub: 'O2·BiPAP',   icon: '🫁', color: '#BAE6FD', x: 8,  y: 44, questCount: 1 },
  ];

  return (
    <InteriorScreen
      label="06v Interior · CARDIO-PULM" deptCode="순환기·호흡기내과 병동 · 본관 5F" deptColor="#C0405A"
      cols={COLS} rows={ROWS} floor="internal"
      playerStart={{ x: 4, y: 15 }}
      rooms={rooms}
      regions={regions}
      missionText="심장 병실 A · 부정맥 텔레메트리 알람 확인 + 활력 사정"
      missionUrgent
      render={() => (
        <>
          {/* ═══════════════ OUTER WALLS ═══════════════ */}
          <IWall x={0} y={0} w={28} h={1}/>
          <IWall x={0} y={1} w={1} h={13}/>
          <IDoor x={0} y={14} w={1} h={3} kind="auto" label="← 엘리베이터"/>
          <IWall x={0} y={17} w={1} h={32}/>
          <IWall x={27} y={1} w={1} h={48}/>
          <IWall x={0} y={49} w={28} h={1}/>

          {/* ═══ SERVICE / STATION DIVIDER (y10) ═══ */}
          <IWall x={1}  y={10} w={5} h={1}/>
          <Th    x={6}  y={10} w={2} h={1} label="→ 복도"/>
          <IWall x={8}  y={10} w={5} h={1}/>
          <Th    x={13} y={10} w={2} h={1} label="→ 판독"/>
          <IWall x={15} y={10} w={12} h={1}/>
          <IWall x={13} y={1} w={1} h={5}/>
          <Th    x={13} y={6} w={1} h={3}/>
          <IWall x={13} y={9} w={1} h={1}/>

          {/* ═══ STATION / CARDIAC DIVIDER (y20) ═══ */}
          <IWall x={1}  y={20} w={6} h={1}/>
          <Th    x={7}  y={20} w={3} h={1}/>
          <IWall x={10} y={20} w={8} h={1}/>
          <Th    x={18} y={20} w={3} h={1}/>
          <IWall x={21} y={20} w={6} h={1}/>

          {/* ═══ CARDIAC / PULMO DIVIDER (y35) ═══ */}
          <IWall x={1}  y={35} w={9} h={1}/>
          <Th    x={10} y={35} w={3} h={1} label="→ 호흡기"/>
          <IWall x={13} y={35} w={14} h={1}/>

          {/* ════════════════ Clean Utility · 투약 (y1-9) ════════════════ */}
          <BayLabel x={1} y={1} text="CLEAN UTILITY · 투약"/>
          <ICabinet x={2} y={2} w={3} variant="drug" label="CARDIAC MEDS"/>
          <ICabinet x={6} y={2} w={3} variant="supply"/>
          <IReception x={2} y={6} w={4} h={1} label="투약 준비"/>
          <window.Fridge x={10} y={5}/>
          <INpc x={4} y={7} kind="nurse" hair="#3C2A18" shirt="#A7F3D0"/>
          <IHotspot x={3} y={6} kind="info" label="항부정맥제 준비"/>

          {/* ════════════════ 텔레메트리 판독 (tele, y1-9) ════════════════ */}
          <BayLabel x={14} y={1} text="TELEMETRY · 판독" highlight/>
          <W.Tint x={14} y={1} w={13} h={9} color="#1E2A40" op={0.16}/>
          <W.TelemetryUnit x={15} y={3} w={3}/>
          <IReception x={20} y={6} w={4} h={1} label="판독 데스크"/>
          <INpc x={17} y={7} kind="nurse" hair="#3C2A18" shirt="#A5D8E8"/>
          <INpc x={21} y={7} kind="doctor" hair="#1F2937"/>
          <IHotspot x={16} y={4} kind="quest" label="부정맥 판독"/>

          {/* ════════════════ 중앙 간호 스테이션 (station, y11-19) ════════════════ */}
          <BayLabel x={1} y={11} text="CARDIO-PULM STATION" highlight/>
          <W.Handrail x={27} y={11} w={1} h={8} vertical/>
          <NurseStationDesk x={8} y={12} w={12} h={5}/>
          <W.TelemetryUnit x={2} y={11} w={3}/>
          <DeskPhone x={9} y={12}/>
          <window.CrashCart x={22} y={13}/>
          <INpc x={11} y={15} kind="nurse" hair="#3C2A18" shirt="#A5D8E8"/>
          <IHotspot x={11} y={14} kind="urgent" label="텔레 알람 대응"/>
          <INpc x={15} y={15} kind="doctor" hair="#5C3A1A"/>

          {/* ════════════════ 심장 모니터 병실 (cardiac, y21-34) ════════════════ */}
          <BayLabel x={1} y={21} text="CARDIAC MONITORED ROOM"/>
          {/* Bed A — arrhythmia telemetry */}
          <IBed x={2} y={23} variant="ward" occupied label="A · 부정맥"/>
          <IMonitor x={1} y={23} beep/>
          <W.O2FlowStation x={6} y={22}/>
          <INpc x={5} y={26} kind="nurse" hair="#3C2A18" shirt="#A5D8E8"/>
          <IHotspot x={3} y={23} kind="quest" label="EKG·활력 사정"/>
          {/* Bed B — post-MI, cardiac chair */}
          <IBed x={9} y={23} variant="ward" occupied label="B · 심근경색"/>
          <W.CardiacChair x={12} y={25}/>
          <window.IIV x={8} y={23}/>
          <IHotspot x={9} y={23} kind="info" label="기좌 호흡 완화"/>
          {/* Bed C — HF monitoring */}
          <IBed x={17} y={23} variant="ward" occupied label="C · 심부전"/>
          <IMonitor x={16} y={23} beep/>
          <W.O2FlowStation x={21} y={22}/>
          {/* Bed D */}
          <IBed x={24} y={23} variant="ward"/>
          <ICurtain x={8}  y={22} w={1} h={6} color="#F5C6D8"/>
          <ICurtain x={16} y={22} w={1} h={6} color="#F5C6D8"/>
          <ICurtain x={23} y={22} w={1} h={6} color="#F5C6D8"/>
          <INpc x={20} y={31} kind="doctor" hair="#1F2937"/>

          {/* ════════════════ 호흡기 병실 (pulmo, y36-50) ════════════════ */}
          <BayLabel x={1} y={36} text="PULMONARY ROOM · O2/BiPAP" highlight/>
          {/* Bed A — COPD on BiPAP */}
          <IBed x={2} y={38} variant="ward" occupied label="COPD · BiPAP"/>
          <W.BiPAPUnit x={6} y={39}/>
          <W.O2FlowStation x={1} y={38}/>
          <INpc x={5} y={42} kind="nurse" hair="#3C2A18" shirt="#BAE6FD"/>
          <IHotspot x={3} y={38} kind="quest" label="BiPAP 설정·ABGA"/>
          {/* Bed B — pneumonia, high-flow O2 */}
          <IBed x={11} y={38} variant="ward" occupied label="폐렴 · O2"/>
          <W.O2FlowStation x={15} y={37}/>
          <window.IIV x={10} y={38}/>
          <window.Nebulizer x={16} y={40}/>
          <IHotspot x={11} y={38} kind="info" label="네뷸라이저 흡입"/>
          {/* Bed C */}
          <IBed x={20} y={38} variant="ward"/>
          <W.CardiacChair x={23} y={40}/>
          <ICurtain x={10} y={37} w={1} h={6} color="#A7C7E7"/>
          <ICurtain x={19} y={37} w={1} h={6} color="#A7C7E7"/>
          <IPlant x={25} y={46}/>
        </>
      )}
    />
  );
}

Object.assign(window, { ScreenInteriorCards });
