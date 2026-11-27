// interior-womenkids-opd.jsx — 소아·산부인과 외래 + 키즈 놀이광장 (여성소아 센터 1F).
// Bright welcoming lobby: pediatric OPD exam rooms, OB/GYN exam room, and a big
// kids play plaza. Reuses peds toys + L&D + clinic objects — no new objects.

function ScreenInteriorWomenKidsOPD() {
  const COLS = 28, ROWS = 40;
  const Th = window.IThreshold;
  const W = window;

  const regions = [
    { id: 'lobby',   name: '로비 · 접수 · 계측',        icon: '🎈', bounds: { x: 0,  y: 0,  w: 28, h: 10 } },
    { id: 'play',    name: '키즈 놀이광장',            icon: '🛝', bounds: { x: 0,  y: 9,  w: 14, h: 16 } },
    { id: 'pedopd',  name: '소아청소년과 외래',         icon: '🧸', bounds: { x: 13, y: 9,  w: 15, h: 16 } },
    { id: 'obopd',   name: '산부인과 외래',            icon: '🤰', bounds: { x: 0,  y: 24, w: 15, h: 16 } },
    { id: 'usroom',  name: '초음파실',                icon: '📡', bounds: { x: 14, y: 24, w: 14, h: 16 } },
  ];

  const rooms = [
    { id: 'lobby',   name: '로비·접수',   sub: '계측·대기',    icon: '🎈', color: '#FBCFE8', x: 6,  y: 5, questCount: 1 },
    { id: 'play',    name: '키즈 광장',   sub: '놀이·대기',    icon: '🛝', color: '#FDE68A', x: 6,  y: 17 },
    { id: 'pedopd',  name: '소아 외래',   sub: '진찰·성장',    icon: '🧸', color: '#BAE6FD', x: 20, y: 17, questCount: 1 },
    { id: 'obopd',   name: '산부인과 외래', sub: '산전 진찰',   icon: '🤰', color: '#A7F3D0', x: 6,  y: 32, questCount: 1 },
    { id: 'usroom',  name: '초음파실',    sub: '태아 초음파',  icon: '📡', color: '#DDD6FE', x: 21, y: 32 },
  ];

  return (
    <InteriorScreen
      label="06w Interior · 여성소아 OPD" deptCode="소아·산부인과 외래 · 여성소아 1F" deptColor="#DB7093"
      cols={COLS} rows={ROWS} floor="peds"
      playerStart={{ x: 4, y: 8 }}
      rooms={rooms}
      regions={regions}
      missionText="소아 외래 · 영유아 성장 계측 후 진찰 안내"
      render={() => (
        <>
          {/* ═══════════════ OUTER WALLS ═══════════════ */}
          <IWall x={0} y={0} w={12} h={1}/>
          <IDoor x={12} y={0} w={3} h={1} kind="auto" label="↓ 캠퍼스/엘리베이터"/>
          <IWall x={15} y={0} w={13} h={1}/>
          <IWall x={0} y={1} w={1} h={38}/>
          <IWall x={27} y={1} w={1} h={38}/>
          <IWall x={0} y={39} w={28} h={1}/>

          {/* ═══ LOBBY / MID DIVIDER (y9) ═══ */}
          <IWall x={1}  y={9} w={5} h={1}/>
          <Th    x={6}  y={9} w={2} h={1} label="→ 놀이광장"/>
          <IWall x={8}  y={9} w={5} h={1}/>
          <Th    x={13} y={9} w={2} h={1} label="→ 소아 외래"/>
          <IWall x={15} y={9} w={12} h={1}/>
          <IWall x={13} y={10} w={1} h={15}/>

          {/* ═══ MID / LOWER DIVIDER (y24) ═══ */}
          <IWall x={1}  y={24} w={5} h={1}/>
          <Th    x={6}  y={24} w={2} h={1} label="→ 산부인과"/>
          <IWall x={8}  y={24} w={6} h={1}/>
          <Th    x={14} y={24} w={2} h={1} label="→ 초음파"/>
          <IWall x={16} y={24} w={11} h={1}/>
          <IWall x={14} y={25} w={1} h={14}/>

          {/* ════════════════ 로비 · 접수 · 계측 (lobby, y1-8) ════════════════ */}
          <BayLabel x={1} y={1} text="LOBBY · 접수 · 계측" highlight/>
          <window.ClinicReception x={2} y={3} w={5} tone="#DB2777" label="접수"/>
          <window.BabyScale x={9} y={3}/>
          <window.StadiometerScale x={12} y={2}/>
          <window.WaterCooler x={16} y={2}/>
          {[18,20,22,24].map((cx,i)=><IChair key={i} x={cx} y={5} color={['#FBCFE8','#BAE6FD','#FDE68A','#A7F3D0'][i]} facing="up"/>)}
          <INpc x={4} y={5} kind="nurse" hair="#3C2A18" shirt="#FBCFE8"/>
          <IHotspot x={3} y={3} kind="quest" label="영유아 성장 계측"/>
          <INpc x={19} y={6} kind="parent" hair="#9A6B3F"/>
          <INpc x={21} y={6} kind="child" hair="#7C3F00"/>

          {/* ════════════════ 키즈 놀이광장 (play, y10-23) ════════════════ */}
          <BayLabel x={1} y={10} text="KIDS PLAZA · 놀이광장"/>
          <div style={{ position: 'absolute', left: 1 * ITILE + 2, top: 12 * ITILE + 2, width: 11 * ITILE - 4, height: 10 * ITILE - 4, background: '#FEF3C7', border: `2px dashed ${IP.ink}44` }}/>
          <window.SmallSlide x={2} y={13}/>
          <window.RockingHorse x={8} y={13}/>
          <window.ToyChest x={9} y={18}/>
          <window.Blocks x={4} y={18}/>
          <window.Mural x={2} y={10}/>
          <INpc x={4} y={16} kind="child" hair="#FACC15"/>
          <INpc x={6} y={19} kind="child" hair="#3C2A18"/>
          <INpc x={9} y={16} kind="parent" hair="#5C3A1A"/>
          <IHotspot x={5} y={15} kind="info" label="놀이·대기"/>
          <IPlant x={11} y={21}/>

          {/* ════════════════ 소아청소년과 외래 (pedopd, y10-23) ════════════════ */}
          <BayLabel x={14} y={10} text="PEDIATRIC OPD · 소아 진료"/>
          {/* two exam rooms */}
          <IBed x={15} y={12} variant="ward" occupied label="진찰 1"/>
          <IReception x={18} y={12} w={3} h={1} label="진료"/>
          <window.TongueDepressorJar x={21} y={11}/>
          <window.StickerRoll x={23} y={11}/>
          <IBed x={15} y={18} variant="peds" occupied label="진찰 2"/>
          <IReception x={18} y={18} w={3} h={1}/>
          <IChair x={22} y={19} color="#BAE6FD" facing="left"/>
          <INpc x={17} y={15} kind="doctor" hair="#3C2A18"/>
          <INpc x={19} y={20} kind="child" hair="#9A6B3F"/>
          <INpc x={21} y={20} kind="parent" hair="#5C3A1A"/>
          <IHotspot x={16} y={12} kind="quest" label="소아 진찰·성장상담"/>
          <IPlant x={25} y={22}/>

          {/* ════════════════ 산부인과 외래 (obopd, y25-38) ════════════════ */}
          <BayLabel x={1} y={25} text="OB/GYN OPD · 산전 진찰"/>
          <IBed x={2} y={28} variant="ward" occupied label="산전 진찰"/>
          <window.FetalMonitor x={5} y={28}/>
          <IReception x={8} y={29} w={3} h={1} label="진료"/>
          <IChair x={11} y={30} color="#A7F3D0" facing="left"/>
          <INpc x={7} y={32} kind="doctor" hair="#1F2937"/>
          <INpc x={3} y={32} kind="parent" hair="#3C2A18"/>
          <IHotspot x={3} y={28} kind="quest" label="산전 진찰·상담"/>
          <IPlant x={12} y={36}/>

          {/* ════════════════ 초음파실 (usroom, y25-38) ════════════════ */}
          <BayLabel x={15} y={25} text="ULTRASOUND · 초음파실"/>
          <IBed x={16} y={28} variant="ward" occupied label="초음파 베드"/>
          <window.UltrasoundCart x={20} y={28}/>
          <IMonitor x={19} y={27}/>
          <INpc x={18} y={32} kind="doctor" hair="#5C3A1A"/>
          <IHotspot x={17} y={28} kind="info" label="태아 초음파"/>
          <IPlant x={25} y={36}/>
        </>
      )}
    />
  );
}

Object.assign(window, { ScreenInteriorWomenKidsOPD });
