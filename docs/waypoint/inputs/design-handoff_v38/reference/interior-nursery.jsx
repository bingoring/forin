// interior-nursery.jsx — 신생아실 Well-Baby Nursery (여성소아 센터 4F).
// Rows of bassinets behind a big viewing window, an admission/assessment warmer,
// a feeding/lactation corner, and a hand-hygiene gowning entry. Distinct from
// NICU (that's ScreenInteriorICU-style intensive care). Reuses L&D objects.

function ScreenInteriorNursery() {
  const COLS = 28, ROWS = 42;
  const Th = window.IThreshold;
  const W = window;

  const regions = [
    { id: 'entry',   name: '손위생 · 가운 착의',       icon: '🧼', bounds: { x: 0,  y: 0,  w: 28, h: 9 } },
    { id: 'nursery', name: '신생아실 (배시넷 존)',      icon: '🍼', bounds: { x: 0,  y: 8,  w: 19, h: 20 } },
    { id: 'admit',   name: '신생아 사정 · 워머',        icon: '🌡', bounds: { x: 18, y: 8,  w: 10, h: 20 } },
    { id: 'feeding', name: '수유 · 모유 수유실',        icon: '🤱', bounds: { x: 0,  y: 27, w: 14, h: 15 } },
    { id: 'viewing', name: '면회 관람창',              icon: '👀', bounds: { x: 13, y: 27, w: 15, h: 15 } },
  ];

  const rooms = [
    { id: 'entry',   name: '손위생·가운', sub: '출입 위생',   icon: '🧼', color: '#A7F3D0', x: 5,  y: 4, questCount: 1 },
    { id: 'nursery', name: '신생아실',    sub: '배시넷 관리',  icon: '🍼', color: '#FBCFE8', x: 8,  y: 17, questCount: 1 },
    { id: 'admit',   name: '사정 워머',   sub: '입원 사정',    icon: '🌡', color: '#FED7AA', x: 22, y: 17 },
    { id: 'feeding', name: '수유실',      sub: '모유 수유',    icon: '🤱', color: '#FDE68A', x: 6,  y: 35 },
    { id: 'viewing', name: '관람창',      sub: '가족 면회',    icon: '👀', color: '#BAE6FD', x: 21, y: 35 },
  ];

  return (
    <InteriorScreen
      label="06n Interior · NURSERY" deptCode="신생아실 · 여성소아 4F" deptColor="#DB7093"
      cols={COLS} rows={ROWS} floor="peds"
      playerStart={{ x: 4, y: 7 }}
      rooms={rooms}
      regions={regions}
      missionText="출입 손위생 후 · 배시넷 신생아 활력징후 라운드"
      render={() => (
        <>
          {/* ═══════════════ OUTER WALLS ═══════════════ */}
          <IWall x={0} y={0} w={28} h={1}/>
          <IWall x={0} y={1} w={1} h={4}/>
          <IDoor x={0} y={5} w={1} h={2} kind="auto" label="← 엘리베이터"/>
          <IWall x={0} y={7} w={1} h={34}/>
          <IWall x={27} y={1} w={1} h={40}/>
          <IWall x={0} y={41} w={28} h={1}/>

          {/* ═══ ENTRY / WARD DIVIDER (y8) — hygiene gate ═══ */}
          <IWall x={1}  y={8} w={5} h={1}/>
          <Th    x={6}  y={8} w={2} h={1} tone="sterile" label="손위생 게이트"/>
          <IWall x={8}  y={8} w={19} h={1}/>
          {/* nursery | admit divider */}
          <IWall x={18} y={9} w={1} h={19}/>

          {/* ═══ UPPER / LOWER DIVIDER (y27) ═══ */}
          <IWall x={1}  y={27} w={5} h={1}/>
          <Th    x={6}  y={27} w={2} h={1} label="→ 수유실"/>
          <IWall x={8}  y={27} w={5} h={1}/>
          {/* viewing window along the lower-right divider */}
          <W.ObsWindow x={13} y={27} w={5}/>
          <IWall x={18} y={27} w={9} h={1}/>
          <IWall x={13} y={28} w={1} h={13}/>

          {/* ════════════════ 손위생 · 가운 착의 (entry, y1-7) ════════════════ */}
          <BayLabel x={1} y={1} text="HAND HYGIENE · 가운 착의" highlight/>
          <window.SinkOR x={2} y={2}/>
          <window.ScrubDispenser x={6} y={2}/>
          <window.GownBox x={9} y={2}/>
          <window.WarmerCabinet x={13} y={2}/>
          <IReception x={18} y={3} w={4} h={1} label="신생아실 데스크"/>
          <INpc x={4} y={5} kind="nurse" hair="#3C2A18" shirt="#FBCFE8"/>
          <IHotspot x={3} y={2} kind="quest" label="손위생 3분·가운"/>
          <INpc x={19} y={5} kind="parent" hair="#9A6B3F"/>

          {/* ════════════════ 신생아실 배시넷 존 (nursery, y9-26) ════════════════ */}
          <BayLabel x={1} y={9} text="WELL-BABY NURSERY · 배시넷"/>
          {/* rows of wheeled bassinets with name tags */}
          <window.Bassinet x={2}  y={11} tag="A-1"/>
          <window.Bassinet x={6}  y={11} tag="A-2"/>
          <window.Bassinet x={10} y={11} tag="A-3"/>
          <window.Bassinet x={14} y={11} tag="A-4"/>
          <window.Bassinet x={2}  y={16} tag="B-1"/>
          <window.Bassinet x={6}  y={16} tag="B-2"/>
          <window.Bassinet x={10} y={16} tag="B-3"/>
          <window.Bassinet x={14} y={16} tag="B-4"/>
          <window.Bassinet x={2}  y={21} tag="C-1"/>
          <window.Bassinet x={6}  y={21} tag="C-2"/>
          <window.CompCart x={11} y={22}/>
          <INpc x={5} y={14} kind="nurse" hair="#3C2A18" shirt="#FBCFE8"/>
          <IHotspot x={2} y={11} kind="quest" label="신생아 활력징후"/>
          <INpc x={10} y={19} kind="nurse" hair="#7C3F00" shirt="#FBCFE8"/>

          {/* ════════════════ 신생아 사정 · 워머 (admit, y9-26) ════════════════ */}
          <BayLabel x={19} y={9} text="ADMISSION · 사정 워머"/>
          <window.InfantWarmer x={20} y={12}/>
          <window.BabyScale x={23} y={17}/>
          <window.WarmerCabinet x={25} y={11}/>
          <window.PhototherapyLamp x={20} y={20} w={2}/>
          <INpc x={22} y={16} kind="nurse" hair="#5C3A1A" shirt="#FED7AA"/>
          <IHotspot x={20} y={12} kind="info" label="입원 사정·계측"/>
          <IPlant x={25} y={25}/>

          {/* ════════════════ 수유 · 모유 수유실 (feeding, y28-40) ════════════════ */}
          <BayLabel x={1} y={28} text="LACTATION · 수유실"/>
          <window.NursingRecliner x={2} y={31}/>
          <window.NursingRecliner x={7} y={31}/>
          <window.NursingRecliner x={2} y={36}/>
          <window.MilkFridge x={10} y={31}/>
          <ICurtain x={6} y={31} w={1} h={8} color="#FBD0E0"/>
          <INpc x={3} y={34} kind="parent" hair="#3C2A18"/>
          <INpc x={8} y={34} kind="nurse" hair="#7C3F00" shirt="#FDE68A"/>
          <IHotspot x={3} y={31} kind="info" label="모유 수유 교육"/>

          {/* ════════════════ 면회 관람창 (viewing, y28-40) ════════════════ */}
          <BayLabel x={14} y={28} text="VIEWING · 면회 관람창"/>
          {/* families viewing through the window from a small lounge */}
          <window.Sofa x={15} y={33} w={3} color="#A7C7E7"/>
          <window.CoffeeTable x={16} y={36} w={2}/>
          <IChair x={20} y={33} color="#BAE6FD" facing="down"/>
          <IChair x={22} y={33} color="#BAE6FD" facing="down"/>
          <INpc x={16} y={35} kind="visitor" hair="#5C3A1A"/>
          <INpc x={21} y={35} kind="parent" hair="#9A6B3F"/>
          <IHotspot x={16} y={33} kind="info" label="가족 면회"/>
          <IPlant x={25} y={39}/>
        </>
      )}
    />
  );
}

Object.assign(window, { ScreenInteriorNursery });
