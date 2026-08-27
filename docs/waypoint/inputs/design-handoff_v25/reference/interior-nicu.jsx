// interior-nicu.jsx — 신생아 중환자실 NICU (여성소아 센터 6F).
// Distinct: gowning anteroom entry (strict infection control), dim low-light
// pods of enclosed isolettes each with its own monitor + CPAP, a giraffe-warmer
// resuscitation bay, and a family kangaroo-care corner. New objects: interior-
// objects-nicu2.jsx. Reused: BankOfMonitors, IMonitor, MilkFridge, SinkOR,
// GownBox, ScrubDispenser, NursingRecliner.

function ScreenInteriorNICU() {
  const COLS = 28, ROWS = 44;
  const Th = window.IThreshold;
  const W = window;

  const regions = [
    { id: 'ante',    name: 'NICU 전실 · 스크럽',        icon: '🧼', bounds: { x: 0,  y: 0,  w: 28, h: 9 } },
    { id: 'station', name: '중앙 모니터 스테이션',       icon: '🖥', bounds: { x: 0,  y: 8,  w: 14, h: 14 } },
    { id: 'resus',   name: '신생아 소생 베이',           icon: '🚨', bounds: { x: 13, y: 8,  w: 15, h: 14 } },
    { id: 'podA',    name: 'A 포드 (인큐베이터)',        icon: '👶', bounds: { x: 0,  y: 21, w: 14, h: 23 } },
    { id: 'podB',    name: 'B 포드 · 캥거루 케어',       icon: '🍼', bounds: { x: 13, y: 21, w: 15, h: 23 } },
  ];

  const rooms = [
    { id: 'ante',    name: 'NICU 전실', sub: '가운·손위생',  icon: '🧼', color: '#A7F3D0', x: 5,  y: 4, questCount: 1 },
    { id: 'station', name: '모니터 스테이션', sub: '중앙 감시', icon: '🖥', color: '#BAE6FD', x: 6,  y: 14, questCount: 1 },
    { id: 'resus',   name: '소생 베이',  sub: '기린 워머',    icon: '🚨', color: '#FCA5A5', x: 21, y: 14 },
    { id: 'podA',    name: 'A 포드',    sub: '인큐베이터 3', icon: '👶', color: '#C7D2FE', x: 6,  y: 33, questCount: 1 },
    { id: 'podB',    name: 'B 포드',    sub: '캥거루 케어',  icon: '🍼', color: '#FBCFE8', x: 21, y: 33 },
  ];

  return (
    <InteriorScreen
      label="06s Interior · NICU" deptCode="신생아 중환자실 NICU · 여성소아 6F" deptColor="#5B7FB0"
      cols={COLS} rows={ROWS} floor="peds"
      playerStart={{ x: 4, y: 7 }}
      rooms={rooms}
      regions={regions}
      missionText="A 포드 · 인큐베이터 온·습도 확인 + 미숙아 활력징후"
      render={() => (
        <>
          {/* low-light NICU tint over the pods */}
          <W.Tint x={1} y={22} w={26} h={21} color="#1E2A40" op={0.15}/>

          {/* ═══════════════ OUTER WALLS ═══════════════ */}
          <IWall x={0} y={0} w={28} h={1}/>
          <IWall x={0} y={1} w={1} h={4}/>
          <IDoor x={0} y={5} w={1} h={2} kind="auto" label="← 엘리베이터"/>
          <IWall x={0} y={7} w={1} h={36}/>
          <IWall x={27} y={1} w={1} h={42}/>
          <IWall x={0} y={43} w={28} h={1}/>

          {/* ═══ ANTEROOM / WARD DIVIDER (y8) — sterile scrub gate ═══ */}
          <IWall x={1}  y={8} w={5} h={1}/>
          <Th    x={6}  y={8} w={2} h={1} tone="sterile" label="스크럽 후 입장"/>
          <IWall x={8}  y={8} w={19} h={1}/>
          {/* station | resus divider */}
          <IWall x={13} y={9} w={1} h={4}/>
          <Th    x={13} y={13} w={1} h={4}/>
          <IWall x={13} y={17} w={1} h={5}/>

          {/* ═══ MID / PODS DIVIDER (y21) ═══ */}
          <IWall x={1}  y={21} w={5} h={1}/>
          <Th    x={6}  y={21} w={2} h={1} label="→ A 포드"/>
          <IWall x={8}  y={21} w={6} h={1}/>
          <Th    x={14} y={21} w={2} h={1} label="→ B 포드"/>
          <IWall x={16} y={21} w={11} h={1}/>
          {/* pod A | pod B glass divider */}
          <IGlass x={13} y={22} w={1} h={21}/>

          {/* ════════════════ NICU 전실 · 스크럽 (y1-7) ════════════════ */}
          <BayLabel x={1} y={1} text="NICU ANTEROOM · 전실" highlight/>
          <W.SinkOR x={2} y={2}/>
          <window.GownBox x={6} y={2}/>
          <window.ScrubDispenser x={9} y={2}/>
          <window.HandSanitizer x={12} y={2}/>
          <BayLabel x={15} y={2} text="3분 스크럽 · 가운 착용"/>
          <INpc x={5} y={5} kind="nurse" hair="#3C2A18" shirt="#FEF9C3"/>
          <INpc x={16} y={5} kind="visitor" hair="#5C3A1A"/>
          <IHotspot x={3} y={2} kind="quest" label="손위생·가운 착용"/>

          {/* ════════════════ 중앙 모니터 스테이션 (station, y9-20) ════════════════ */}
          <BayLabel x={1} y={9} text="CENTRAL MONITOR STATION" highlight/>
          <window.BankOfMonitors x={2} y={11}/>
          <NurseStationDesk x={2} y={15} w={9} h={4}/>
          <DeskPhone x={3} y={15}/>
          <INpc x={6} y={18} kind="nurse" hair="#3C2A18" shirt="#A5D8E8"/>
          <IHotspot x={6} y={17} kind="info" label="중앙 활력 감시"/>

          {/* ════════════════ 신생아 소생 베이 (resus, y9-20) ════════════════ */}
          <BayLabel x={14} y={9} text="RESUSCITATION BAY"/>
          <W.GiraffeWarmer x={16} y={12}/>
          <window.CrashCart x={22} y={11}/>
          <W.CPAPUnit x={24} y={13}/>
          <INpc x={19} y={18} kind="doctor" hair="#1F2937"/>
          <INpc x={21} y={18} kind="nurse" hair="#7C3F00" shirt="#FEF9C3"/>
          <IHotspot x={16} y={12} kind="urgent" label="미숙아 소생·기도"/>

          {/* ════════════════ A 포드 (인큐베이터) (podA, y22-44) ════════════════ */}
          <BayLabel x={1} y={22} text="POD A · INCUBATORS"/>
          <W.PhototherapyLED x={2} y={25} w={2}/>
          <W.NICUIsolette x={2} y={27}/>
          <IMonitor x={7} y={27} beep/>
          <W.CPAPUnit x={9} y={26}/>
          <W.NICUIsolette x={2} y={37}/>
          <IMonitor x={7} y={37} beep/>
          <INpc x={6} y={33} kind="nurse" hair="#3C2A18" shirt="#C7D2FE"/>
          <IHotspot x={3} y={27} kind="quest" label="온·습도·활력 확인"/>
          <window.MilkFridge x={11} y={40}/>

          {/* ════════════════ B 포드 · 캥거루 케어 (podB, y22-44) ════════════════ */}
          <BayLabel x={14} y={22} text="POD B · KANGAROO CARE"/>
          <W.NICUIsolette x={15} y={26}/>
          <IMonitor x={20} y={26} beep/>
          <W.PhototherapyLED x={15} y={24} w={2}/>
          {/* parent skin-to-skin kangaroo care in a recliner */}
          <window.NursingRecliner x={20} y={33}/>
          <W.NICUIsolette x={15} y={37}/>
          <IMonitor x={20} y={37}/>
          <INpc x={22} y={35} kind="parent" hair="#9A6B3F"/>
          <INpc x={18} y={40} kind="nurse" hair="#7C3F00" shirt="#FBCFE8"/>
          <IHotspot x={20} y={33} kind="info" label="캥거루 케어 지지"/>
          <IPlant x={25} y={43}/>
        </>
      )}
    />
  );
}

Object.assign(window, { ScreenInteriorNICU });
