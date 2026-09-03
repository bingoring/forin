// interior-rehab.jsx — 대형 재활치료실 PT/OT Gym (암센터 · 재활관 1F).
// Distinct: one big open therapy gym (no multi-room grid) with a gait-training
// zone, mat-therapy zone, cardio/equipment zone, and an OT ADL-training corner.
// New objects: interior-objects-rehab2.jsx.

function ScreenInteriorRehab() {
  const COLS = 28, ROWS = 44;
  const Th = window.IThreshold;
  const W = window;

  const regions = [
    { id: 'reception', name: '재활 접수 · 평가',     icon: '📋', bounds: { x: 0,  y: 0,  w: 28, h: 10 } },
    { id: 'gait',    name: '보행 훈련존',            icon: '🚶', bounds: { x: 0,  y: 9,  w: 14, h: 18 } },
    { id: 'mat',     name: '매트 치료존',            icon: '🧘', bounds: { x: 13, y: 9,  w: 15, h: 18 } },
    { id: 'cardio',  name: '유산소 · 근력 존',        icon: '🏃', bounds: { x: 0,  y: 26, w: 15, h: 18 } },
    { id: 'adl',     name: 'OT · 일상생활 훈련',      icon: '🍳', bounds: { x: 14, y: 26, w: 14, h: 18 } },
  ];

  const rooms = [
    { id: 'reception', name: '재활 접수', sub: '평가·스케줄', icon: '📋', color: '#BAE6FD', x: 5,  y: 5, questCount: 1 },
    { id: 'gait',    name: '보행 훈련',  sub: '평행봉·트레드밀', icon: '🚶', color: '#A7D0BC', x: 6,  y: 17, questCount: 1 },
    { id: 'mat',     name: '매트 치료',  sub: '도수·운동치료',  icon: '🧘', color: '#C7B8E8', x: 21, y: 17 },
    { id: 'cardio',  name: '유산소·근력', sub: '지구력 훈련',   icon: '🏃', color: '#FBCFE8', x: 6,  y: 35 },
    { id: 'adl',     name: 'ADL 훈련',   sub: '작업치료(OT)',  icon: '🍳', color: '#FDE68A', x: 21, y: 35, questCount: 1 },
  ];

  return (
    <InteriorScreen
      label="06m Interior · REHAB" deptCode="재활치료실 PT/OT · 재활관 1F" deptColor="#1E8A5B"
      cols={COLS} rows={ROWS} floor="peds"
      playerStart={{ x: 4, y: 8 }}
      rooms={rooms}
      regions={regions}
      missionText="보행 훈련존 · 뇌졸중 환자 평행봉 보행 보조"
      render={() => (
        <>
          {/* ═══════════════ OUTER WALLS ═══════════════ */}
          <IWall x={0} y={0} w={28} h={1}/>
          <IWall x={0} y={1} w={1} h={6}/>
          <IDoor x={0} y={7} w={1} h={3} kind="auto" label="← 엘리베이터"/>
          <IWall x={0} y={10} w={1} h={33}/>
          <IWall x={27} y={1} w={1} h={42}/>
          <IWall x={0} y={43} w={28} h={1}/>

          {/* ═══ RECEPTION / GYM DIVIDER (y9) — wide openings (open gym) ═══ */}
          <IWall x={1}  y={9} w={4} h={1}/>
          <Th    x={5}  y={9} w={4} h={1}/>
          <IWall x={9}  y={9} w={5} h={1}/>
          <Th    x={14} y={9} w={4} h={1}/>
          <IWall x={18} y={9} w={9} h={1}/>
          {/* gait | mat divider (partial, open gym feel) */}
          <IWall x={13} y={10} w={1} h={4}/>
          <Th    x={13} y={14} w={1} h={5}/>
          <IWall x={13} y={19} w={1} h={8}/>
          {/* upper / lower gym divider (y26) */}
          <IWall x={1}  y={26} w={12} h={1}/>
          <Th    x={13} y={26} w={2} h={1}/>
          <IWall x={15} y={26} w={12} h={1}/>

          {/* ════════════════ 재활 접수 · 평가 (y1-8) ════════════════ */}
          <BayLabel x={1} y={1} text="REHAB RECEPTION · 평가"/>
          <IReception x={2} y={3} w={4} h={1} label="접수·평가"/>
          <IMonitor x={6} y={2}/>
          <W.CompCart x={9} y={2}/>
          {/* PT evaluating gait / ROM */}
          <INpc x={4} y={6} kind="doctor" hair="#3C2A18"/>
          <INpc x={7} y={6} kind="patient" hair="#9A6B3F"/>
          <IHotspot x={4} y={3} kind="quest" label="초기 기능 평가"/>
          {[13,15].map((cx,i)=><IChair key={'a'+i} x={cx} y={4} color="#BAE6FD" facing="down"/>)}
          {[13,15].map((cx,i)=><IChair key={'b'+i} x={cx} y={6} color="#BAE6FD" facing="down"/>)}
          <IPlant x={17} y={5}/>

          {/* ════════════════ 보행 훈련존 (gait, y10-25) ════════════════ */}
          <BayLabel x={1} y={10} text="GAIT TRAINING" highlight/>
          <W.ParallelBars x={2} y={12} w={4}/>
          <W.Treadmill x={3} y={18}/>
          <W.ShoulderPulley x={10} y={11}/>
          {/* stroke patient practicing in the bars, PT guiding */}
          <INpc x={5} y={15} kind="patient" hair="#5C3A1A"/>
          <INpc x={7} y={16} kind="nurse" hair="#3C2A18" shirt="#A7D0BC"/>
          <IHotspot x={4} y={13} kind="quest" label="평행봉 보행 보조"/>
          <W.WalkerRack x={9} y={22} w={3}/>

          {/* ════════════════ 매트 치료존 (mat, y10-25) ════════════════ */}
          <BayLabel x={14} y={10} text="MAT THERAPY"/>
          <W.TherapyMat x={15} y={13}/>
          <W.TherapyMat x={15} y={20}/>
          <W.ShoulderPulley x={24} y={11}/>
          {/* manual therapist working on a patient */}
          <INpc x={17} y={16} kind="nurse" hair="#7C3F00" shirt="#C7B8E8"/>
          <INpc x={21} y={22} kind="patient" hair="#9A6B3F"/>
          <IHotspot x={16} y={13} kind="info" label="도수 치료·ROM"/>
          <IPlant x={25} y={24}/>

          {/* ════════════════ 유산소 · 근력 존 (cardio, y27-42) ════════════════ */}
          <BayLabel x={1} y={27} text="CARDIO · STRENGTH"/>
          <W.Treadmill x={2} y={30}/>
          <W.Treadmill x={7} y={30}/>
          <W.GymBallRack x={2} y={37}/>
          <W.ParallelBars x={7} y={38} w={4}/>
          <INpc x={4} y={35} kind="patient" hair="#3C2A18"/>
          <INpc x={9} y={35} kind="nurse" hair="#3C2A18" shirt="#FBCFE8"/>
          <IHotspot x={3} y={31} kind="info" label="지구력 훈련"/>

          {/* ════════════════ OT · 일상생활 훈련 (adl, y27-42) ════════════════ */}
          <BayLabel x={15} y={27} text="OT · ADL TRAINING" highlight/>
          <W.ADLKitchen x={15} y={30} w={4}/>
          <IBed x={20} y={35} variant="ward" label="이동 훈련"/>
          <W.GymBallRack x={24} y={37}/>
          {/* OT therapist teaching kitchen ADL */}
          <INpc x={17} y={33} kind="nurse" hair="#7C3F00" shirt="#FDE68A"/>
          <INpc x={19} y={33} kind="patient" hair="#5C3A1A"/>
          <IHotspot x={16} y={30} kind="quest" label="부엌 일상동작 훈련"/>
          <IPlant x={25} y={41}/>
        </>
      )}
    />
  );
}

Object.assign(window, { ScreenInteriorRehab });
