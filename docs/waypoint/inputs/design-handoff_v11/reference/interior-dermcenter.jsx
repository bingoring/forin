// interior-dermcenter.jsx — 피부과 외래 및 센터 (Dermatology Clinic & Center).
// 28×52 tiles, vertical flow. Outpatient-centric with privacy-focused rooms,
// bright white tone. Reception/waiting → exam (dermatoscope/Wood's lamp) →
// phototherapy (UV booth) → minor-surgery/laser (biopsy, cryo, CO2 laser).
// NOT the lightweight 피부과 외래 clinic-engine screen (ScreenInteriorDerm).
//
//   ┌──── 로비 · 접수 · 대기 ────┐
//   ├ 제1진료실 ┬ 제2진료실 ──────┤   (더마토스코프 · 우드등)
//   ├ 광선 치료실 ──────────────┤   (전신 UV 부스 · 국소 UV)
//   ├ 소수술 · 레이저 처치실 ─────┤   (펀치 생검 · 냉동 · CO2 레이저)
//   └────────────────────────────┘
//
// New objects: interior-objects-derm2.jsx. Reused: ClinicReception, IBed,
// IChair, Sofa, WaterCooler, DressingCart, SurgicalLight, InstrumentTray.

function ScreenInteriorDermCenter() {
  const COLS = 28, ROWS = 52;
  const Th = window.IThreshold;
  const W = window;

  const regions = [
    { id: 'lobby',  name: '로비 · 접수 · 대기',     icon: '🌸', bounds: { x: 0,  y: 0,  w: 28, h: 14 } },
    { id: 'exam1',  name: '제1진료실 · 병변 진단',   icon: '🔬', bounds: { x: 0,  y: 13, w: 14, h: 13 } },
    { id: 'exam2',  name: '제2진료실',             icon: '🩺', bounds: { x: 13, y: 13, w: 15, h: 13 } },
    { id: 'photo',  name: '광선 치료실',           icon: '💜', bounds: { x: 0,  y: 25, w: 28, h: 13 } },
    { id: 'laser',  name: '소수술 · 레이저 처치실',  icon: '✨', bounds: { x: 0,  y: 37, w: 28, h: 15 } },
  ];

  const rooms = [
    { id: 'lobby',  name: '로비 · 접수',  sub: '문진·대기',   icon: '🌸', color: '#FBCFE8', x: 14, y: 6,  questCount: 1 },
    { id: 'exam1',  name: '제1진료실',   sub: '더마토스코프·우드등', icon: '🔬', color: '#F0E6EA', x: 6,  y: 19, questCount: 1 },
    { id: 'exam2',  name: '제2진료실',   sub: '피부 진찰',   icon: '🩺', color: '#F0E6EA', x: 20, y: 19 },
    { id: 'photo',  name: '광선 치료실',  sub: '전신 UV 부스', icon: '💜', color: '#DDD6FE', x: 13, y: 31, questCount: 1 },
    { id: 'laser',  name: '레이저 처치실', sub: '생검·냉동·레이저', icon: '✨', color: '#FCE7F0', x: 13, y: 44, questCount: 1 },
  ];

  return (
    <InteriorScreen
      label="06j Interior · DERM CENTER" deptCode="피부과 센터 · 2F" deptColor="#DB2777"
      cols={COLS} rows={ROWS} floor="derm"
      playerStart={{ x: 14, y: 11 }}
      rooms={rooms}
      regions={regions}
      missionText="제1진료실 · 점(Mole) ABCD 사정 보조 + 병변 분류"
      render={() => (
        <>
          {/* ═══════════════ OUTER WALLS ═══════════════ */}
          <IWall x={0} y={0} w={13} h={1}/>
          <IDoor x={13} y={0} w={3} h={1} kind="auto" label="↓ 캠퍼스로"/>
          <IWall x={16} y={0} w={12} h={1}/>
          <IWall x={0} y={1} w={1} h={50}/>
          <IWall x={27} y={1} w={1} h={50}/>
          <IWall x={0} y={51} w={28} h={1}/>

          {/* ═══ DIVIDER y13 (lobby / exam) ═══ */}
          <IWall x={1}  y={13} w={4} h={1}/>
          <Th    x={5}  y={13} w={3} h={1} label="→ 진료실"/>
          <IWall x={8}  y={13} w={5} h={1}/>
          <Th    x={13} y={13} w={3} h={1} label="→ 진료실 2"/>
          <IWall x={16} y={13} w={11} h={1}/>
          {/* exam1 | exam2 divider */}
          <IWall x={13} y={14} w={1} h={4}/>
          <Th    x={13} y={18} w={1} h={3}/>
          <IWall x={13} y={21} w={1} h={5}/>

          {/* ═══ DIVIDER y25 (exam / phototherapy) ═══ */}
          <IWall x={1}  y={25} w={6} h={1}/>
          <Th    x={7}  y={25} w={3} h={1} label="→ 광선실"/>
          <IWall x={10} y={25} w={17} h={1}/>

          {/* ═══ DIVIDER y37 (phototherapy / laser) — sterile ═══ */}
          <IWall x={1}  y={37} w={6} h={1}/>
          <Th    x={7}  y={37} w={3} h={1} tone="sterile" label="→ 처치실"/>
          <IWall x={10} y={37} w={17} h={1}/>

          {/* ════════════════ 로비 · 접수 · 대기 (y1-12) ════════════════ */}
          <BayLabel x={1} y={1} text="DERMATOLOGY · 접수 & 대기"/>
          <window.ClinicReception x={3} y={3} w={6} tone="#DB2777" label="접수"/>
          <INpc x={4} y={6} kind="nurse" hair="#3C2A18" shirt="#FBCFE8"/>
          <IHotspot x={4} y={5} kind="quest" label="발진 히스토리 문진"/>
          <window.LesionChart x={10} y={1} w={3}/>
          {/* waiting lounge — 1-seat sofas */}
          <window.Sofa x={18} y={3} w={2} color="#E2C0CE"/>
          <window.Sofa x={21} y={3} w={2} color="#C9B0D8"/>
          <window.Sofa x={24} y={3} w={2} color="#B8C8DC"/>
          <window.CoffeeTable x={20} y={6} w={2}/>
          {[18,20,22,24].map((cx,i) => <IChair key={'w'+i} x={cx} y={9} color="#FBCFE8" facing="up"/>)}
          <WaterCooler x={26} y={6}/>
          <window.WallTV x={1} y={9} w={2}/>
          {/* patients: itchy atopic + masked */}
          <INpc x={19} y={5} kind="patient" hair="#9A6B3F" expression="sad"/>
          <INpc x={23} y={5} kind="patient" hair="#3C2A18"/>
          <INpc x={20} y={10} kind="visitor" hair="#5C3A1A"/>
          <IHotspot x={19} y={5} kind="info" label="아토피 대기 환자"/>
          <IPlant x={26} y={10}/>

          {/* ════════════════ 제1진료실 · 병변 진단 (y14-24) ════════════════ */}
          <BayLabel x={1} y={14} text="EXAM 1 · 병변 진단" highlight/>
          <IBed x={2} y={16} variant="ward" occupied label="진찰 베드"/>
          <window.Dermatoscope x={6} y={16}/>
          <window.WoodsLamp x={8} y={17}/>
          <IMonitor x={10} y={16}/>
          <IReception x={9} y={20} w={3} h={1} label="진료"/>
          <window.LesionChart x={1} y={22} w={2}/>
          {/* dermatologist + assist nurse + patient (shirt off) */}
          <INpc x={4} y={19} kind="doctor" hair="#1F2937"/>
          <IHotspot x={3} y={16} kind="quest" label="점 ABCD 사정"/>
          <INpc x={10} y={22} kind="nurse" hair="#3C2A18" shirt="#FBCFE8"/>

          {/* ════════════════ 제2진료실 (y14-24) ════════════════ */}
          <BayLabel x={14} y={14} text="EXAM 2"/>
          <IBed x={15} y={16} variant="ward" label="진찰 베드"/>
          <window.Dermatoscope x={19} y={16}/>
          <IReception x={22} y={20} w={3} h={1} label="진료"/>
          <IMonitor x={25} y={16}/>
          <SkinAnatomy x={24} y={14}/>
          <INpc x={17} y={22} kind="doctor" hair="#3C2A18"/>
          <IChair x={20} y={22} color="#F0E6EA" facing="up"/>
          <IPlant x={26} y={23}/>

          {/* ════════════════ 광선 치료실 (y26-36) ════════════════ */}
          <BayLabel x={1} y={26} text="PHOTOTHERAPY · 광선 치료실" highlight/>
          {/* whole-body UV booth — the showpiece */}
          <window.UVBooth x={3} y={29}/>
          {/* localized hand/foot UV box + goggle sanitizer */}
          <window.HandUVBox x={9} y={31}/>
          <window.GoggleSanitizer x={12} y={29}/>
          {/* control console desk */}
          <IReception x={15} y={31} w={4} h={1} label="조사 콘솔"/>
          <IMonitor x={19} y={30}/>
          {/* phototherapy nurse setting dose + goggled patient entering */}
          <INpc x={16} y={33} kind="nurse" hair="#3C2A18" shirt="#DDD6FE"/>
          <IHotspot x={15} y={31} kind="quest" label="UV 강도·시간 세팅"/>
          <INpc x={6} y={33} kind="patient" hair="#9A6B3F"/>
          <IHotspot x={4} y={29} kind="info" label="전신 UVB 부스"/>
          <window.Sofa x={22} y={33} w={3} color="#C9B0D8"/>
          <IPlant x={25} y={29}/>

          {/* ════════════════ 소수술 · 레이저 처치실 (laser, y38-50) ════════════════ */}
          <BayLabel x={1} y={38} text="MINOR SURGERY · LASER" highlight/>
          {/* adjustable surgical chair under a surgical light */}
          <window.SurgicalLight x={6} y={39}/>
          <IBed x={4} y={41} variant="or" occupied label="SURGICAL CHAIR"/>
          {/* biopsy kit on a mayo stand + formalin bottle */}
          <window.BiopsyKit x={8} y={41}/>
          <window.BiopsyBottle x={10} y={44}/>
          {/* cryotherapy tank + CO2 laser */}
          <window.CryoTank x={13} y={41}/>
          <window.CO2Laser x={16} y={42}/>
          <window.DressingCart x={20} y={41}/>
          <ICabinet x={23} y={39} w={4} variant="sterile" label="STERILE"/>
          {/* surgeon doing a punch biopsy + nurse assisting */}
          <INpc x={5} y={43} kind="surgeon" hair="#1F2937"/>
          <IHotspot x={5} y={41} kind="quest" label="펀치 생검 처치"/>
          <INpc x={8} y={44} kind="nurse" hair="#3C2A18" shirt="#FCE7F0"/>
          <window.WasteBin x={23} y={44} tone="infectious"/>
          <IPlant x={25} y={48}/>
        </>
      )}
    />
  );
}

// ─── SkinAnatomy — 피부 구조도 액자 (표피/진피/피하) ───────────────
function SkinAnatomy({ x, y }) {
  return (
    <div style={{ position: 'absolute', left: x * ITILE, top: y * ITILE, width: ITILE * 2, height: ITILE * 1.4, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.22))' }}>
      <svg viewBox="0 0 32 22" width={ITILE * 2} height={ITILE * 1.4} shapeRendering="crispEdges" preserveAspectRatio="none">
        <rect x="0" y="0" width="32" height="22" fill="#fff" stroke={IP.ink} strokeWidth=".7"/>
        {/* skin layers cross-section */}
        <rect x="2" y="2" width="28" height="4" fill="#F0C8B0"/>{/* epidermis */}
        <rect x="2" y="6" width="28" height="8" fill="#E0A890"/>{/* dermis */}
        <rect x="2" y="14" width="28" height="6" fill="#F4D8A0"/>{/* subcutaneous fat */}
        {/* hair follicle */}
        <line x1="10" y1="2" x2="12" y2="18" stroke="#6B4423" strokeWidth=".6"/>
        <ellipse cx="12" cy="18" rx="2" ry="1.4" fill="#8B5A2B"/>
        {/* label ticks */}
        <line x1="22" y1="4" x2="30" y2="4" stroke={IP.ink} strokeWidth=".3" opacity=".5"/>
        <line x1="22" y1="10" x2="30" y2="10" stroke={IP.ink} strokeWidth=".3" opacity=".5"/>
      </svg>
    </div>
  );
}

Object.assign(window, { ScreenInteriorDermCenter, SkinAnatomy });
