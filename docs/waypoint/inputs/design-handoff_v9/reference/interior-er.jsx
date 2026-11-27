// interior-er.jsx — Emergency Medical Center, rebuilt to the master blueprint.
// 40×60 tiles (much larger zones than before so the big Derp characters fit).
//
//   ┌─────────────── 공공 로비 (Lobby) ───────────────┐
//   │  앰뷸런스 인계 · 보안검색 · 원무과 · 트리아지 · 대기  │
//   ├──────────┬──────────────┬──────────────────────┤
//   │ 소생실    │ 중앙 너스      │ 제1진료실(내과)         │
//   │ (Resus)  │ 스테이션+약품실 │                       │
//   ├──────────┼──────────────┼──────────────────────┤
//   │ 음압격리  │ 소처치·봉합실  │ 제2진료실(외상/정형)     │
//   ├──────────┼──────────────┼──────────────────────┤
//   │ 정신과    │ 가족상담·임종실 │ 제염실 (외부 연결)       │
//   │ 안전격리  │ (Quiet Room)  │ (Decontamination)     │
//   └──────────┴──────────────┴──────────────────────┘
//
// Internal zone boundaries use IThreshold (a dark open doorway) instead of a
// drawn door leaf — clearer "different zone" read, per design direction.
// Cross-dept objects (CrashCart, Ventilator, SurgicalLight, InstrumentTray,
// BankOfMonitors, XrayViewbox, CastCart, ExamStool, PyxisMachine) and the new
// blueprint objects (interior-objects-er3.jsx) resolve at render time.

function ScreenInteriorER() {
  const COLS = 40, ROWS = 60;
  const Th = window.IThreshold;

  // Region map (bounds overlap the dividing walls so the player always has a
  // region; first match wins, ordered top→bottom, left→right).
  const regions = [
    { id: 'lobby',  name: '공공 로비 · 접수 · 트리아지', icon: '🚑', bounds: { x: 0,  y: 0,  w: 40, h: 17 } },
    { id: 'resus',  name: '응급 소생실',           icon: '🚨', bounds: { x: 0,  y: 16, w: 14, h: 18 } },
    { id: 'nurse',  name: '중앙 너스 스테이션 · 약품실', icon: '👩‍⚕️', bounds: { x: 13, y: 16, w: 14, h: 18 } },
    { id: 'exam1',  name: '제1진료실 · 내과',      icon: '🩺', bounds: { x: 26, y: 16, w: 14, h: 18 } },
    { id: 'iso',    name: '음압 격리실',           icon: '🦠', bounds: { x: 0,  y: 33, w: 14, h: 17 } },
    { id: 'suture', name: '소처치 · 봉합실',       icon: '🩹', bounds: { x: 13, y: 33, w: 14, h: 17 } },
    { id: 'exam2',  name: '제2진료실 · 외상/정형', icon: '🦴', bounds: { x: 26, y: 33, w: 14, h: 17 } },
    { id: 'psych',  name: '정신과 안전 격리실',     icon: '🧷', bounds: { x: 0,  y: 49, w: 14, h: 11 } },
    { id: 'quiet',  name: '가족 상담 · 임종실',     icon: '🕊️', bounds: { x: 13, y: 49, w: 14, h: 11 } },
    { id: 'decon',  name: '제염실 (외부 연결)',     icon: '🚿', bounds: { x: 26, y: 49, w: 14, h: 11 } },
  ];

  // Fast-travel destinations (one per zone + key sub-spots).
  const rooms = [
    { id: 'amb',    name: '앰뷸런스 인계',  sub: '도착 환자',   icon: '🚑', color: '#FCA5A5', x: 6,  y: 4,  questCount: 1 },
    { id: 'triage', name: '트리아지 · KTAS', sub: '응급도 분류', icon: '📋', color: '#FBCFE8', x: 4,  y: 10, questCount: 1 },
    { id: 'reg',    name: '원무과 접수',     sub: '등록',       icon: '📝', color: '#BAE6FD', x: 31, y: 6 },
    { id: 'wait',   name: '대기실',         sub: '경증 대기',   icon: '🪑', color: '#FED7AA', x: 19, y: 12 },
    { id: 'resus',  name: '응급 소생실',     sub: '중증',       icon: '🚨', color: '#FCA5A5', x: 5,  y: 26, questCount: 1 },
    { id: 'nurse',  name: '너스 스테이션',   sub: '중앙 허브',   icon: '👩‍⚕️', color: '#FFEDD5', x: 19, y: 28 },
    { id: 'pyxis',  name: '약품실 PYXIS',    sub: '자동 약장',   icon: '💊', color: '#DDD6FE', x: 16, y: 19 },
    { id: 'exam1',  name: '제1진료실',      sub: '내과',       icon: '🩺', color: '#A7F3D0', x: 33, y: 22, questCount: 1 },
    { id: 'iso',    name: '음압 격리실',     sub: '감염 관리',   icon: '🦠', color: '#FEF08A', x: 4,  y: 44, questCount: 1 },
    { id: 'suture', name: '소처치·봉합실',   sub: '드레싱·봉합', icon: '🩹', color: '#DDD6FE', x: 18, y: 44, questCount: 1 },
    { id: 'exam2',  name: '제2진료실',      sub: '외상/정형',   icon: '🦴', color: '#FED7AA', x: 33, y: 42 },
    { id: 'psych',  name: '정신과 격리실',   sub: '1:1 관찰',    icon: '🧷', color: '#C7D2FE', x: 5,  y: 55, questCount: 1 },
    { id: 'quiet',  name: '가족 상담실',     sub: '임종·상담',   icon: '🕊️', color: '#FBCFE8', x: 19, y: 55 },
    { id: 'decon',  name: '제염실',         sub: '외부 제염',   icon: '🚿', color: '#A7E3D0', x: 32, y: 55, questCount: 1 },
  ];

  return (
    <InteriorScreen
      label="06a Interior · ER" deptCode="응급의료센터 · 1F"
      cols={COLS} rows={ROWS} floor="clinical"
      playerStart={{ x: 19, y: 28 }}
      rooms={rooms}
      regions={regions}
      missionText="너스 스테이션 · Dr. Patel 인계 받기"
      missionUrgent
      render={() => (
        <>
          {/* floor tints for special-function rooms */}
          <Tint x={1}  y={50} w={11} h={8} color="#C7D6E8" op={0.32}/>{/* psych padded */}
          <Tint x={14} y={50} w={12} h={8} color="#F1DCC0" op={0.4}/>{/* quiet warm */}
          <Tint x={27} y={50} w={12} h={8} color="#BFD8DE" op={0.4}/>{/* decon wet tile */}

          {/* ═══════════════ OUTER WALLS ═══════════════ */}
          {/* top wall + 2 entrances */}
          <IWall x={0}  y={0} w={4}  h={1}/>
          <IDoor x={4}  y={0} w={4}  h={1} kind="auto" label="🚑 AMBULANCE"/>
          <IWall x={8}  y={0} w={10} h={1}/>
          <IDoor x={18} y={0} w={4}  h={1} kind="auto" label="정문 ENTRANCE"/>
          <IWall x={22} y={0} w={18} h={1}/>
          {/* side walls */}
          <IWall x={0}  y={1} w={1}  h={58}/>
          <IWall x={39} y={1} w={1}  h={58}/>
          {/* bottom wall + campus exit + decon exterior door */}
          <IWall x={0}  y={59} w={18} h={1}/>
          <IDoor x={18} y={59} w={4}  h={1} kind="auto" label="↓ 캠퍼스로"/>
          <IWall x={22} y={59} w={12} h={1}/>
          <IDoor x={34} y={59} w={3}  h={1} kind="auto" label="🚿 외부"/>
          <IWall x={37} y={59} w={3}  h={1}/>

          {/* ═══════════════ DIVIDER y16 (lobby / treatment) ═══════════════ */}
          <IWall x={1}  y={16} w={4}  h={1}/>
          <Th    x={5}  y={16} w={3}  h={1} label="→ 소생실"/>
          <IWall x={8}  y={16} w={9}  h={1}/>
          <Th    x={17} y={16} w={4}  h={1} label="→ 스테이션"/>
          <IWall x={21} y={16} w={10} h={1}/>
          <Th    x={31} y={16} w={3}  h={1} label="→ 내과"/>
          <IWall x={34} y={16} w={5}  h={1}/>

          {/* ═══════════════ DIVIDER y33 (upper / lower treatment) ═══════════════ */}
          <IWall x={1}  y={33} w={4}  h={1}/>
          <Th    x={5}  y={33} w={3}  h={1} label="→ 격리"/>
          <IWall x={8}  y={33} w={9}  h={1}/>
          <Th    x={17} y={33} w={4}  h={1} label="→ 처치실"/>
          <IWall x={21} y={33} w={10} h={1}/>
          <Th    x={31} y={33} w={3}  h={1} label="→ 외상"/>
          <IWall x={34} y={33} w={5}  h={1}/>

          {/* ═══════════════ DIVIDER y49 (lower / back) ═══════════════ */}
          <IWall x={1}  y={49} w={4}  h={1}/>
          <Th    x={5}  y={49} w={3}  h={1} label="→ 정신과"/>
          <IWall x={8}  y={49} w={9}  h={1}/>
          <Th    x={17} y={49} w={4}  h={1} label="→ 상담실"/>
          <IWall x={21} y={49} w={10} h={1}/>
          <Th    x={31} y={49} w={3}  h={1} label="→ 제염실"/>
          <IWall x={34} y={49} w={5}  h={1}/>

          {/* ═══════════════ VERTICAL DIVIDERS (x13 & x26) ═══════════════ */}
          {/* band1 y17-32 */}
          <IWall x={13} y={17} w={1} h={4}/>
          <Th    x={13} y={21} w={1} h={3}/>
          <IWall x={13} y={24} w={1} h={9}/>
          <IWall x={26} y={17} w={1} h={4}/>
          <Th    x={26} y={21} w={1} h={3}/>
          <IWall x={26} y={24} w={1} h={9}/>
          {/* band2 y34-48 */}
          <IWall x={13} y={34} w={1} h={4}/>
          <Th    x={13} y={38} w={1} h={3}/>
          <IWall x={13} y={41} w={1} h={8}/>
          <IWall x={26} y={34} w={1} h={4}/>
          <Th    x={26} y={38} w={1} h={3}/>
          <IWall x={26} y={41} w={1} h={8}/>
          {/* band3 y50-58 */}
          <IWall x={13} y={50} w={1} h={3}/>
          <Th    x={13} y={53} w={1} h={3}/>
          <IWall x={13} y={56} w={1} h={3}/>
          <IWall x={26} y={50} w={1} h={3}/>
          <Th    x={26} y={53} w={1} h={3}/>
          <IWall x={26} y={56} w={1} h={3}/>

          {/* ════════════════════ LOBBY (y1-15) ════════════════════ */}
          {/* triage routing lines on the floor (red/yellow/green) */}
          <TriageLine x={6}  y={13} w={1} h={3} color="#EF4444"/>
          <TriageLine x={19} y={13} w={1} h={3} color="#FACC15"/>
          <TriageLine x={32} y={13} w={1} h={3} color="#16A34A"/>

          {/* — AMBULANCE INTAKE (top-left) — */}
          <BayLabel x={2} y={1} text="🚑 AMBULANCE INTAKE" highlight/>
          <Gurney x={4} y={3} occupied/>
          <window.IVPump x={7} y={3}/>
          <OxygenTank x={3} y={3}/>
          <INpc x={3} y={7} kind="paramedic" hair="#1F2937"/>
          <INpc x={7} y={7} kind="paramedic" hair="#7C3F00"/>
          <IHotspot x={5} y={5} kind="urgent" label="핸드오프 SBAR"/>

          {/* — SECURITY CHECK (center top, at the public entrance) — */}
          <BayLabel x={15} y={1} text="SECURITY"/>
          <window.MetalDetector x={18} y={2}/>
          <window.SecurityScanner x={21} y={3}/>
          <INpc x={16} y={4} kind="police" hair="#1F2937"/>
          <INpc x={24} y={4} kind="police" hair="#3C2A18"/>

          {/* — REGISTRATION · 원무과 (right) — */}
          <BayLabel x={28} y={1} text="원무과 REGISTER"/>
          <IReception x={29} y={4} w={4} h={1} label="접수"/>
          <window.CompCart x={34} y={3}/>
          <window.BarcodePrinter x={35} y={6}/>
          <TicketDispenser x={37} y={6}/>
          <BrochureRack x={28} y={6}/>
          <DeskPhone x={31} y={3}/>
          <HandSanitizer x={37} y={2}/>
          <INpc x={30} y={6} kind="nurse" hair="#5C3A1A" shirt="#BAE6FD"/>
          <INpc x={32} y={6} kind="nurse" hair="#7C3F00" shirt="#BAE6FD"/>
          <INpc x={30} y={8} kind="patient" hair="#9A6B3F"/>
          <INpc x={33} y={8} kind="visitor" hair="#3C2A18"/>
          <IHotspot x={31} y={5} kind="quest" label="접수 등록"/>

          {/* — TRIAGE · KTAS (left) — */}
          <BayLabel x={1} y={6} text="TRIAGE · KTAS" highlight/>
          <IReception x={2} y={8} w={3} h={1} label="트리아지"/>
          <VitalsCart x={6} y={7}/>
          <BPCuff x={1} y={7}/>
          <HandSanitizer x={1} y={9}/>
          <Wheelchair x={6} y={10}/>
          <Wheelchair x={7} y={11}/>
          <INpc x={4} y={10} kind="nurse" hair="#3C2A18"/>
          <INpc x={2} y={11} kind="patient" hair="#9A6B3F"/>
          <INpc x={3} y={12} kind="visitor" hair="#5C3A1A"/>
          <IHotspot x={4} y={9} kind="quest" label="KTAS 분류"/>

          {/* — WAITING (center) — */}
          <BayLabel x={14} y={7} text="WAITING · 대기"/>
          <WaitingDisplay x={14} y={8} w={3}/>
          <window.WallTV x={22} y={8} w={2}/>
          <WaterCooler x={25} y={9}/>
          {[15,17,19,21,23].map((cx,i) => <IChair key={'wa'+i} x={cx} y={11} color={i%2?'#FBCFE8':'#FED7AA'} facing="up"/>)}
          {[15,17,19,21,23].map((cx,i) => <IChair key={'wb'+i} x={cx} y={13} color={i%2?'#FED7AA':'#FBCFE8'} facing="up"/>)}
          <INpc x={16} y={10.5} kind="patient" hair="#3C2A18"/>
          <INpc x={20} y={10.5} kind="parent"  hair="#5C3A1A"/>
          <INpc x={21} y={10.5} kind="child"   hair="#7C3F00"/>
          <INpc x={24} y={12.5} kind="visitor" hair="#9A6B3F"/>
          <IPlant x={25} y={13}/>

          {/* ════════════════════ RESUS · 소생실 (left, y17-32) ════════════════════ */}
          <BayLabel x={1} y={17} text="RESUS · 소생실" highlight/>
          {/* TRAUMA BAY 1 */}
          <window.SurgicalLight x={4} y={17}/>
          <IBed x={3} y={18} variant="or" occupied label="TRAUMA 1"/>
          <IMonitor x={1} y={18} beep/>
          <window.Ventilator x={6} y={18}/>
          <window.CrashCart x={8} y={18}/>
          <Defib x={10} y={18}/>
          <window.IVPump x={2} y={17}/>
          <SuctionUnit x={1} y={21}/>
          <INpc x={3} y={21} kind="doctor"    hair="#1F2937"/>
          <INpc x={5} y={21} kind="nurse"     hair="#3C2A18" shirt="#A7D7B0"/>
          <INpc x={6} y={20} kind="nurse"     hair="#7C3F00" shirt="#A7D7B0"/>
          <IHotspot x={4} y={18} kind="urgent" label="CODE"/>
          {/* curtain divider */}
          <ICurtain x={1} y={23} w={11} h={1} color="#A7C7E7"/>
          {/* TRAUMA BAY 2 */}
          <window.SurgicalLight x={4} y={24}/>
          <IBed x={3} y={25} variant="or" occupied label="TRAUMA 2"/>
          <IMonitor x={1} y={25} beep/>
          <window.Ventilator x={6} y={25}/>
          <window.IVPump x={2} y={24}/>
          <OxygenTank x={10} y={25}/>
          <WasteBin x={10} y={28} tone="infectious"/>
          <INpc x={3} y={29} kind="paramedic" hair="#5C3A1A"/>
          <INpc x={6} y={29} kind="paramedic" hair="#1F2937"/>

          {/* ════════════════════ NURSE STATION + 약품실 (center, y17-32) ════════════════════ */}
          {/* — PYXIS / 약품실 (top-left alcove, glass-walled) — */}
          <BayLabel x={14} y={17} text="약품실 · PYXIS"/>
          <window.PyxisMachine x={14} y={18}/>
          <window.MedFridge x={17} y={18}/>
          <ICabinet x={14} y={21} w={2} variant="drug" label="마약 보관"/>
          <SharpsContainer x={18} y={21}/>
          <INpc x={16} y={20} kind="nurse" hair="#3C2A18" shirt="#A7D7B0"/>
          {/* glass partition between 약품실 and the open station */}
          <IGlass x={19} y={18} w={1} h={4}/>

          {/* — CENTRAL NURSE STATION (대형 ㄷ자형 오픈 데스크) — */}
          <BayLabel x={21} y={17} text="NURSE STATION"/>
          <window.BankOfMonitors x={21} y={17}/>
          {/* the ㄷ open desk: monitor wall + quartz counter + drawer pedestals */}
          <window.NurseStationDesk x={14} y={23} w={10} h={6}/>
          {/* desk-top accessories on the side counters */}
          <ChartBinder x={14} y={25}/>
          <window.BarcodePrinter x={23} y={26}/>
          <DeskPhone x={14} y={27}/>
          {/* staff seated inside the U well, facing the monitor wall */}
          <INpc x={16} y={27} kind="nurse"  hair="#3C2A18"/>
          <INpc x={18} y={27} kind="doctor" hair="#5C3A1A"/>
          <INpc x={20} y={27} kind="nurse"  hair="#7C3F00" shirt="#FBCFE8"/>
          <INpc x={22} y={27} kind="doctor" hair="#1F2937"/>
          {/* corridor side: a stool + blue-covered transport carts parked along the counter */}
          <ExamStool x={16} y={31}/>
          <DressingCart x={19} y={30}/>
          <DressingCart x={22} y={30}/>
          <IHotspot x={19} y={25} kind="urgent" label="Dr. Patel"/>

          {/* ════════════════════ EXAM1 · 내과 (right, y17-32) ════════════════════ */}
          <BayLabel x={27} y={17} text="제1진료실 · 내과"/>
          <Otoscope x={27} y={17}/>
          <AnatomyPoster x={37} y={17}/>
          <IReception x={28} y={20} w={3} h={1} label="진료"/>
          <window.CompCart x={27} y={19}/>
          <IMonitor x={31} y={19}/>
          <ExamStool x={30} y={22}/>
          <IBed x={34} y={20} variant="ward" occupied/>
          <IChair x={32} y={24} color="#A8C7DC" facing="up"/>
          <INpc x={28} y={23} kind="doctor" hair="#1F2937"/>
          <INpc x={34} y={24} kind="patient" hair="#5C3A1A"/>
          <IHotspot x={34} y={20} kind="quest" label="복통 문진"/>
          <IPlant x={37} y={30}/>

          {/* ════════════════════ ISOLATION · 음압격리 (left, y34-48) ════════════════════ */}
          {/* anteroom (전실) */}
          <BayLabel x={1} y={34} text="전실 · ANTEROOM"/>
          <PPEStand x={2} y={34}/>
          <WasteBin x={5} y={35} tone="infectious"/>
          <PressureGauge x={8} y={34}/>
          <HandSanitizer x={10} y={35}/>
          {/* glass wall + threshold between anteroom and inner room */}
          <IGlass x={1} y={38} w={4} h={1}/>
          <Th     x={5} y={38} w={2} h={1} label="격리실"/>
          <IGlass x={7} y={38} w={5} h={1}/>
          {/* inner isolation room */}
          <BayLabel x={1} y={39} text="음압 격리실"/>
          <IBed x={3} y={41} variant="ward" occupied label="격리"/>
          <IMonitor x={1} y={41} beep/>
          <window.IIV x={6} y={41}/>
          <DressingCart x={8} y={42}/>
          <WasteBin x={10} y={46} tone="infectious"/>
          <window.CCTVCamera x={10} y={39}/>
          <INpc x={6} y={45} kind="nurse" hair="#3C2A18" shirt="#FEF9C3"/>
          <IHotspot x={3} y={41} kind="info" label="감염 관리"/>

          {/* ════════════════════ SUTURE · 소처치·봉합 (center, y34-48) ════════════════════ */}
          <BayLabel x={14} y={34} text="소처치 · 봉합실"/>
          <window.SurgicalLight x={18} y={34}/>
          <IBed x={17} y={37} variant="or" occupied label="처치"/>
          <DressingCart x={14} y={38}/>
          <window.InstrumentTray x={21} y={37}/>
          <SuctionUnit x={23} y={35}/>
          <SharpsContainer x={23} y={46}/>
          <GloveDispenser x={14} y={46}/>
          <INpc x={15} y={44} kind="nurse"  hair="#7C3F00" shirt="#A7D7B0"/>
          <INpc x={20} y={44} kind="doctor" hair="#5C3A1A"/>
          <IHotspot x={17} y={36} kind="quest" label="봉합 처치"/>

          {/* ════════════════════ EXAM2 · 외상/정형 (right, y34-48) ════════════════════ */}
          <BayLabel x={27} y={34} text="제2진료실 · 외상/정형"/>
          <window.XrayViewbox x={35} y={34}/>
          <IReception x={28} y={37} w={3} h={1} label="진료"/>
          <window.CompCart x={27} y={36}/>
          <window.CastCart x={28} y={40}/>
          <IBed x={34} y={37} variant="ward" occupied/>
          <ExamStool x={32} y={41}/>
          <INpc x={29} y={41} kind="doctor" hair="#1F2937"/>
          <INpc x={34} y={41} kind="nurse"  hair="#3C2A18" shirt="#A7D7B0"/>
          <IHotspot x={34} y={37} kind="quest" label="부목 고정"/>
          <IPlant x={37} y={46}/>

          {/* ════════════════════ PSYCH · 정신과 안전 격리실 (left, y50-58) ════════════════════ */}
          <BayLabel x={1} y={50} text="정신과 안전 격리실"/>
          <window.BoltedBed x={4} y={51} occupied/>
          <window.CCTVCamera x={10} y={50}/>
          <IChair x={2} y={55} color="#94A3B8" facing="down"/>
          <INpc x={5} y={55} kind="patient" hair="#5C3A1A"/>
          <INpc x={2} y={56} kind="visitor" hair="#1F2937"/>
          <IHotspot x={5} y={52} kind="info" label="1:1 관찰 (Sitter)"/>

          {/* ════════════════════ QUIET · 가족 상담·임종실 (center, y50-58) ════════════════════ */}
          <BayLabel x={14} y={50} text="가족 상담 · 임종실"/>
          <window.FramedPicture x={18} y={50} w={2}/>
          <window.Sofa x={15} y={52} w={3} color="#8FA9C4"/>
          <window.Sofa x={21} y={55} w={3} color="#C0A6B8"/>
          <window.CoffeeTable x={17} y={54} w={2}/>
          <window.TissueBox x={18} y={53}/>
          <window.FloorLamp x={24} y={51}/>
          <INpc x={16} y={54} kind="doctor" hair="#3C2A18"/>
          <INpc x={22} y={56} kind="visitor" hair="#5C3A1A"/>
          <INpc x={23} y={56} kind="parent"  hair="#7C3F00"/>
          <IPlant x={25} y={57}/>
          <IHotspot x={17} y={53} kind="info" label="가족 상담"/>

          {/* ════════════════════ DECON · 제염실 (right, y50-58) ════════════════════ */}
          <BayLabel x={27} y={50} text="제염실 · DECON"/>
          <window.DeconShower x={29} y={50}/>
          <window.DeconShower x={33} y={50}/>
          <window.FloorDrain x={29} y={53} w={2}/>
          <window.FloorDrain x={32} y={53} w={2}/>
          <window.ChemDrum x={37} y={51}/>
          <window.ChemDrum x={37} y={54} tone="waste"/>
          <INpc x={31} y={56} kind="paramedic" hair="#1F2937"/>
          <IHotspot x={31} y={52} kind="info" label="제염 처치"/>
        </>
      )}
    />
  );
}

// ─── Small helpers ────────────────────────────────────────────────
function BayLabel({ x, y, text, highlight }) {
  return (
    <div style={{
      position: 'absolute', left: x * ITILE + 2, top: y * ITILE + 1, zIndex: 3,
      background: highlight ? '#FEF08A' : '#FFFFFFDD',
      border: `1.5px solid ${IP.ink}`,
      padding: '0 4px', fontFamily: '"DungGeunMo",monospace', fontSize: 7, color: IP.ink,
      boxShadow: `1.5px 1.5px 0 0 ${IP.ink}66`, whiteSpace: 'nowrap',
    }}>{text}</div>
  );
}

// Translucent floor tint for special-function rooms (padded / warm / wet).
function Tint({ x, y, w, h, color, op = 0.35 }) {
  return (
    <div style={{
      position: 'absolute', left: x * ITILE, top: y * ITILE,
      width: w * ITILE, height: h * ITILE, background: color, opacity: op,
      pointerEvents: 'none',
    }}/>
  );
}

function XrayMachine({ x, y }) {
  return (
    <div style={{ position: 'absolute', left: x * ITILE, top: y * ITILE, width: ITILE * 2, height: ITILE * 2.5, filter: 'drop-shadow(2px 3px 0 rgba(0,0,0,.18))' }}>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 8, background: '#9CA3AF', border: `2px solid ${IP.ink}` }}/>
      <div style={{ position: 'absolute', left: 4, top: 0, bottom: 8, width: 4, background: '#6B7280', border: `1.5px solid ${IP.ink}` }}/>
      <div style={{ position: 'absolute', left: 12, top: 0, width: 18, height: 14, background: '#374151', border: `2px solid ${IP.ink}` }}>
        <div style={{ position: 'absolute', inset: 2, background: '#9CA3AF' }}/>
        <div style={{ position: 'absolute', left: 4, top: 4, width: 6, height: 6, background: '#FACC15' }}/>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 16, height: 8, background: '#fff', border: `1.5px solid ${IP.ink}` }}/>
    </div>
  );
}

Object.assign(window, { ScreenInteriorER, BayLabel, XrayMachine, Tint });
