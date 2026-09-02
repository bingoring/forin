// interior-ld.jsx — 가족 분만실 L&D · 산후 병동 · 신생아실 (여성소아 센터 3F).
// 28×52 tiles, vertical flow. Obstetric unit: enter at the central nursing
// station, then LDR birthing rooms, a postpartum mother-baby room, and a glass
// nursery. New objects live in interior-objects-ld2.jsx; cross-dept objects
// (NurseStationDesk, VitalsCart, CompCart, IV, WasteBin, SinkOR, Sofa) resolve
// at render time.
//
//   ┌ 산모 분류(OB Triage) ┬ 무통/마취 준비 ┐   (서비스 스트립)
//   ├──────── 중앙 간호 스테이션 · 복도 ─────┤   (입구 관문)
//   ├ LDR 1 (분만) ┬ LDR 2 (분만) ┬ 신생아 워머 ┤
//   ├──── 산후 모아동실 ────┬──── 신생아실 ────┤
//   └──────────────────────┴─────────────────┘

function ScreenInteriorLD() {
  const COLS = 28, ROWS = 50;
  const Th = window.IThreshold;
  const W = window;

  const regions = [
    { id: 'triage',  name: '산모 분류 · OB Triage',  icon: '🤰', bounds: { x: 0,  y: 0,  w: 14, h: 11 } },
    { id: 'anes',    name: '무통 · 마취 준비',        icon: '💉', bounds: { x: 13, y: 0,  w: 15, h: 11 } },
    { id: 'station', name: '중앙 간호 스테이션',       icon: '🖥', bounds: { x: 0,  y: 10, w: 28, h: 11 } },
    { id: 'ldr',     name: 'LDR 분만실',             icon: '👶', bounds: { x: 0,  y: 20, w: 28, h: 16 } },
    { id: 'postpartum', name: '산후 모아동실',        icon: '🛏', bounds: { x: 0,  y: 35, w: 15, h: 15 } },
    { id: 'nursery', name: '신생아실 Nursery',        icon: '🍼', bounds: { x: 14, y: 35, w: 14, h: 15 } },
  ];

  const rooms = [
    { id: 'triage',  name: 'OB Triage',  sub: '산모 분류·모니터', icon: '🤰', color: '#F9C9D6', x: 4,  y: 5, questCount: 1 },
    { id: 'anes',    name: '무통·마취 준비', sub: 'Epidural',    icon: '💉', color: '#DDD6FE', x: 20, y: 5 },
    { id: 'station', name: '간호 스테이션', sub: '분만 조율',     icon: '🖥', color: '#BAE6FD', x: 13, y: 15, questCount: 1 },
    { id: 'ldr',     name: 'LDR 분만실',  sub: '진통·분만·회복',  icon: '👶', color: '#FBCFE8', x: 8,  y: 27, questCount: 2 },
    { id: 'postpartum', name: '산후 모아동실', sub: '모유수유 교육', icon: '🛏', color: '#FDE68A', x: 7, y: 44, questCount: 1 },
    { id: 'nursery', name: '신생아실',    sub: '바시넷·수유',    icon: '🍼', color: '#A7F3D0', x: 21, y: 44, questCount: 1 },
  ];

  return (
    <InteriorScreen
      label="06j Interior · L&D" deptCode="가족 분만실 L&D · 여성소아 3F" deptColor="#C2487E"
      cols={COLS} rows={ROWS} floor="peds"
      playerStart={{ x: 4, y: 15 }}
      rooms={rooms}
      regions={regions}
      missionText="LDR 1 · 태아 심박(CTG) 모니터 + 분만 준비"
      render={() => (
        <>
          {/* ═══════════════ OUTER WALLS ═══════════════ */}
          <IWall x={0} y={0} w={28} h={1}/>
          <IWall x={0} y={1} w={1} h={13}/>
          <IDoor x={0} y={14} w={1} h={3} kind="auto" label="← 엘리베이터"/>
          <IWall x={0} y={17} w={1} h={32}/>
          <IWall x={27} y={1} w={1} h={48}/>
          <IWall x={0} y={49} w={28} h={1}/>

          {/* ═══ SERVICE STRIP DIVIDER (y10) ═══ */}
          <IWall x={1}  y={10} w={5} h={1}/>
          <Th    x={6}  y={10} w={2} h={1} label="→ 복도"/>
          <IWall x={8}  y={10} w={5} h={1}/>
          <Th    x={13} y={10} w={2} h={1} label="→ 복도"/>
          <IWall x={15} y={10} w={12} h={1}/>
          {/* triage | anes divider */}
          <IWall x={13} y={1} w={1} h={5}/>
          <Th    x={13} y={6} w={1} h={3}/>
          <IWall x={13} y={9} w={1} h={1}/>

          {/* ═══ STATION / LDR DIVIDER (y20) ═══ */}
          <IWall x={1}  y={20} w={6} h={1}/>
          <Th    x={7}  y={20} w={3} h={1}/>
          <IWall x={10} y={20} w={8} h={1}/>
          <Th    x={18} y={20} w={3} h={1}/>
          <IWall x={21} y={20} w={6} h={1}/>

          {/* ═══ LDR / LOWER DIVIDER (y35) ═══ */}
          <IWall x={1}  y={35} w={5} h={1}/>
          <Th    x={6}  y={35} w={2} h={1} label="→ 산후"/>
          <IWall x={8}  y={35} w={9} h={1}/>
          <Th    x={17} y={35} w={2} h={1} tone="sterile" label="→ 신생아실"/>
          <IWall x={19} y={35} w={8} h={1}/>
          {/* postpartum | nursery divider — glass (뷰 확보) */}
          <IWall  x={14} y={36} w={1} h={2}/>
          <IGlass x={14} y={38} w={1} h={11}/>

          {/* ════════════════ OB Triage (y1-9) ════════════════ */}
          <BayLabel x={1} y={1} text="OB TRIAGE · 산모 분류" highlight/>
          <IBed x={2} y={3} variant="ward" occupied label="TRIAGE"/>
          <W.FetalMonitor x={5} y={2}/>
          <IIV x={7} y={3}/>
          <W.VitalsCart x={9} y={5}/>
          <INpc x={4} y={7} kind="nurse" hair="#3C2A18" shirt="#F9C9D6"/>
          <INpc x={7} y={7} kind="patient" hair="#5C3A1A"/>
          <IHotspot x={3} y={3} kind="quest" label="자궁수축·태동 사정"/>

          {/* ════════════════ 무통 · 마취 준비 (y1-9) ════════════════ */}
          <BayLabel x={14} y={1} text="EPIDURAL PREP"/>
          <ICabinet x={14} y={2} w={3} variant="drug" label="EPIDURAL"/>
          <ICabinet x={17} y={2} w={3} variant="sterile"/>
          <IReception x={21} y={3} w={3} h={1} label="마취 기록"/>
          <W.CompCart x={24} y={2}/>
          <INpc x={16} y={7} kind="doctor" hair="#1F2937"/>
          <IHotspot x={15} y={4} kind="info" label="무통 카트 점검"/>

          {/* ════════════════ 중앙 간호 스테이션 · 복도 (y11-19) ════════════════ */}
          <BayLabel x={1} y={11} text="L&D NURSING STATION" highlight/>
          <W.Handrail x={27} y={11} w={1} h={8} vertical/>
          <NurseStationDesk x={8} y={12} w={12} h={5}/>
          <DeskPhone x={9} y={12}/>
          <DeskPhone x={17} y={12}/>
          <ChartBinder x={20} y={12}/>
          {/* central fetal-monitor telemetry wall */}
          <W.FetalMonitor x={4} y={12}/>
          <W.VitalsCart x={23} y={16}/>
          <INpc x={11} y={15} kind="nurse"  hair="#3C2A18" shirt="#A5D8E8"/>
          <IHotspot x={11} y={14} kind="urgent" label="분만 임박 콜"/>
          <INpc x={15} y={15} kind="doctor" hair="#1F2937"/>
          <INpc x={5} y={18} kind="nurse" hair="#9A6B3F" shirt="#F9C9D6"/>

          {/* ════════════════ LDR 분만실 (y21-34) ════════════════ */}
          <BayLabel x={1} y={21} text="LDR 1 · 진통·분만·회복" highlight/>
          {/* LDR 1 — active labor with fetal monitor + delivery cart */}
          <W.BirthingBed x={2} y={23}/>
          <W.FetalMonitor x={6} y={23}/>
          <W.DeliveryCart x={2} y={29}/>
          <INpc x={5} y={31} kind="nurse" hair="#3C2A18" shirt="#F9C9D6"/>
          <INpc x={3} y={27} kind="doctor" hair="#1F2937"/>
          <IHotspot x={3} y={23} kind="quest" label="태아 심박(CTG)"/>
          {/* LDR 2 */}
          <BayLabel x={11} y={21} text="LDR 2"/>
          <W.BirthingBed x={11} y={23}/>
          <W.FetalMonitor x={15} y={23}/>
          <IIV x={10} y={23}/>
          <INpc x={14} y={31} kind="parent" hair="#5C3A1A"/>
          <IHotspot x={12} y={23} kind="info" label="분만 진행"/>
          {/* Infant warmer bay (right) — newborn resuscitation/warming */}
          <BayLabel x={20} y={21} text="INFANT WARMER"/>
          <W.InfantWarmer x={21} y={24}/>
          <W.WarmerCabinet x={25} y={23}/>
          <INpc x={24} y={30} kind="nurse" hair="#7C3F00" shirt="#A7F3D0"/>
          <IHotspot x={21} y={24} kind="info" label="아기 보온·아프가"/>
          {/* curtains splitting LDR bays */}
          <ICurtain x={10} y={22} w={1} h={12} color="#F5C6D8"/>
          <ICurtain x={19} y={22} w={1} h={12} color="#F5C6D8"/>

          {/* ════════════════ 산후 모아동실 (postpartum, y36-50) ════════════════ */}
          <BayLabel x={1} y={36} text="산후 모아동실 · POSTPARTUM"/>
          {/* mother bed + rooming-in bassinet beside it */}
          <IBed x={2} y={38} variant="ward" occupied label="산모"/>
          <W.Bassinet x={6} y={38} tag="girl"/>
          <IMonitor x={1} y={38}/>
          <W.NursingRecliner x={9} y={40}/>
          <INpc x={4} y={42} kind="nurse" hair="#3C2A18" shirt="#F9C9D6"/>
          <IHotspot x={3} y={38} kind="quest" label="모유수유 교육"/>
          <INpc x={10} y={43} kind="parent" hair="#9A6B3F"/>
          <IPlant x={12} y={47}/>

          {/* ════════════════ 신생아실 Nursery (y36-50) ════════════════ */}
          <BayLabel x={15} y={36} text="신생아실 · NURSERY"/>
          {/* rows of bassinets behind the glass */}
          <W.Bassinet x={16} y={38} tag="boy"/>
          <W.Bassinet x={19} y={38} tag="girl"/>
          <W.Bassinet x={22} y={38} tag="boy"/>
          <W.Bassinet x={16} y={43} tag="girl"/>
          <W.Bassinet x={19} y={43} tag="boy"/>
          <W.InfantWarmer x={23} y={44}/>
          <W.SinkOR x={25} y={37}/>
          <INpc x={21} y={47} kind="nurse" hair="#7C3F00" shirt="#A7F3D0"/>
          <IHotspot x={17} y={38} kind="info" label="신생아 관찰·수유"/>
        </>
      )}
    />
  );
}

Object.assign(window, { ScreenInteriorLD });
