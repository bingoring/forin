// interior-specialty.jsx — 전문 외래 (안과·이비인후과·비뇨·신경과) (외래진단동 2F).
// A long outpatient corridor with distinct specialty exam rooms off it, each
// with its signature equipment. New objects: interior-objects-eye2.jsx. Reused:
// IReception, IChair, WaitingDisplay, IBed, IMonitor, Otoscope, ClinicReception.

function ScreenInteriorSpecialty() {
  const COLS = 28, ROWS = 44;
  const Th = window.IThreshold;
  const W = window;

  const regions = [
    { id: 'checkin', name: '통합 접수 · 대기',        icon: '🪑', bounds: { x: 0,  y: 0,  w: 28, h: 12 } },
    { id: 'eye',     name: '안과 진료실',              icon: '👁', bounds: { x: 0,  y: 11, w: 14, h: 13 } },
    { id: 'ent',     name: '이비인후과 진료실',         icon: '👂', bounds: { x: 13, y: 11, w: 15, h: 13 } },
    { id: 'uro',     name: '비뇨의학과 진료실',         icon: '🚹', bounds: { x: 0,  y: 23, w: 14, h: 21 } },
    { id: 'neuro',   name: '신경과 진료실',            icon: '🧠', bounds: { x: 13, y: 23, w: 15, h: 21 } },
  ];

  const rooms = [
    { id: 'checkin', name: '통합 접수', sub: '전문외래 대기', icon: '🪑', color: '#BAE6FD', x: 6,  y: 6 },
    { id: 'eye',     name: '안과',    sub: '세극등·검안',   icon: '👁', color: '#DDD6FE', x: 6,  y: 18, questCount: 1 },
    { id: 'ent',     name: '이비인후과', sub: '내시경·처치', icon: '👂', color: '#FBCFE8', x: 21, y: 18 },
    { id: 'uro',     name: '비뇨의학과', sub: '초음파·요검사', icon: '🚹', color: '#A7F3D0', x: 6,  y: 36 },
    { id: 'neuro',   name: '신경과',  sub: '신경학 검사',    icon: '🧠', color: '#FDE68A', x: 21, y: 36, questCount: 1 },
  ];

  return (
    <InteriorScreen
      label="06w Interior · SPECIALTY OPD" deptCode="전문 외래 · 외래진단동 2F" deptColor="#2A7C8C"
      cols={COLS} rows={ROWS} floor="clinical"
      playerStart={{ x: 4, y: 10 }}
      rooms={rooms}
      regions={regions}
      missionText="안과 진료실 · 세극등 검사 준비 + 시력 측정 안내"
      render={() => (
        <>
          {/* ═══════════════ OUTER WALLS ═══════════════ */}
          <IWall x={0} y={0} w={28} h={1}/>
          <IWall x={0} y={1} w={1} h={8}/>
          <IDoor x={0} y={9} w={1} h={3} kind="auto" label="← 엘리베이터"/>
          <IWall x={0} y={12} w={1} h={29}/>
          <IWall x={27} y={1} w={1} h={40}/>
          <IWall x={0} y={41} w={28} h={1}/>

          {/* ═══ CHECK-IN / ROOMS DIVIDER (y11) ═══ */}
          <IWall x={1}  y={11} w={4} h={1}/>
          <Th    x={5}  y={11} w={2} h={1} label="→ 안과"/>
          <IWall x={7}  y={11} w={6} h={1}/>
          <Th    x={13} y={11} w={2} h={1} label="→ 이비인후과"/>
          <IWall x={15} y={11} w={12} h={1}/>
          {/* eye | ent divider */}
          <IWall x={13} y={12} w={1} h={11}/>

          {/* ═══ UPPER / LOWER ROOMS DIVIDER (y23) ═══ */}
          <IWall x={1}  y={23} w={4} h={1}/>
          <Th    x={5}  y={23} w={2} h={1} label="→ 비뇨"/>
          <IWall x={7}  y={23} w={6} h={1}/>
          <Th    x={13} y={23} w={2} h={1} label="→ 신경과"/>
          <IWall x={15} y={23} w={12} h={1}/>
          <IWall x={13} y={24} w={1} h={17}/>

          {/* ════════════════ 통합 접수 · 대기 (y1-10) ════════════════ */}
          <BayLabel x={1} y={1} text="SPECIALTY OPD · 통합 접수"/>
          <window.ClinicReception x={2} y={3} w={5} tone="#2A7C8C" label="접수"/>
          <W.WaitingDisplay x={9} y={1}/>
          {[13,15,17,19,21,23].map((cx,i)=><IChair key={i} x={cx} y={4} color="#BAE6FD" facing="down"/>)}
          {[13,15,17,19,21,23].map((cx,i)=><IChair key={'b'+i} x={cx} y={8} color="#DDD6FE" facing="up"/>)}
          <INpc x={3} y={6} kind="nurse" hair="#3C2A18" shirt="#A5D8E8"/>
          <INpc x={14} y={7} kind="patient" hair="#9A6B3F"/>
          <INpc x={20} y={7} kind="visitor" hair="#5C3A1A"/>
          <IPlant x={25} y={2}/>
          <IHotspot x={3} y={3} kind="info" label="전문외래 접수"/>

          {/* ════════════════ 안과 진료실 (eye, y12-22) ════════════════ */}
          <BayLabel x={1} y={12} text="OPHTHALMOLOGY · 안과" highlight/>
          <W.SlitLamp x={2} y={15}/>
          <W.PhoropterStand x={7} y={14}/>
          <W.VisionChart x={10} y={13}/>
          <IChair x={4} y={19} color="#DDD6FE" facing="up"/>
          <INpc x={2} y={19} kind="doctor" hair="#1F2937"/>
          <INpc x={4} y={20} kind="patient" hair="#7C3F00"/>
          <IHotspot x={3} y={15} kind="quest" label="세극등 검사 준비"/>

          {/* ════════════════ 이비인후과 진료실 (ent, y12-22) ════════════════ */}
          <BayLabel x={14} y={12} text="ENT · 이비인후과"/>
          <W.ENTTowerChair x={15} y={14}/>
          <window.Otoscope x={20} y={13}/>
          <IReception x={22} y={19} w={3} h={1} label="진료"/>
          <INpc x={16} y={20} kind="doctor" hair="#5C3A1A"/>
          <INpc x={19} y={19} kind="patient" hair="#9A6B3F"/>
          <IHotspot x={15} y={14} kind="info" label="내시경 이경 처치"/>

          {/* ════════════════ 비뇨의학과 진료실 (uro, y24-44) ════════════════ */}
          <BayLabel x={1} y={24} text="UROLOGY · 비뇨의학과"/>
          <IBed x={2} y={27} variant="ward" label="검사 베드"/>
          <window.UltrasoundCart x={6} y={28}/>
          <IReception x={2} y={36} w={4} h={1} label="진료"/>
          <IMonitor x={9} y={27}/>
          <ICabinet x={9} y={31} w={3} variant="supply" label="요검사"/>
          <INpc x={4} y={39} kind="doctor" hair="#1F2937"/>
          <INpc x={7} y={38} kind="patient" hair="#5C3A1A"/>
          <IHotspot x={3} y={27} kind="info" label="방광 초음파"/>

          {/* ════════════════ 신경과 진료실 (neuro, y24-44) ════════════════ */}
          <BayLabel x={14} y={24} text="NEUROLOGY · 신경과"/>
          <IBed x={15} y={27} variant="ward" occupied label="신경학 검사"/>
          <IReception x={22} y={28} w={3} h={1} label="진료"/>
          <IMonitor x={22} y={31}/>
          {/* EEG cart + reflex-test corner */}
          <window.CompCart x={15} y={35}/>
          <ICabinet x={22} y={35} w={3} variant="equipment" label="EEG"/>
          <INpc x={17} y={31} kind="doctor" hair="#1F2937"/>
          <INpc x={16} y={39} kind="patient" hair="#9A6B3F"/>
          <IHotspot x={16} y={27} kind="quest" label="신경학적 사정 (GCS·반사)"/>
          <IPlant x={25} y={39}/>
        </>
      )}
    />
  );
}

Object.assign(window, { ScreenInteriorSpecialty });
