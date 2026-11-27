// interior-hospice.jsx — 완화의료·호스피스 병동 (암센터·재활관 4F).
// Warm, home-like, dignified — NOT a clinical ward. A private family-style
// room + a shared family lounge with a small kitchenette, a quiet reflection
// room, and a garden-view balcony sunroom. New objects: interior-objects-hospice2.jsx.

function ScreenInteriorHospice() {
  const COLS = 28, ROWS = 44;
  const Th = window.IThreshold;
  const W = window;

  const regions = [
    { id: 'lounge',  name: '가족 라운지 · 키친',        icon: '🍵', bounds: { x: 0,  y: 0,  w: 28, h: 10 } },
    { id: 'station', name: '완화 케어 스테이션',         icon: '🕊', bounds: { x: 0,  y: 9,  w: 14, h: 14 } },
    { id: 'reflection', name: '명상 · 추모실',           icon: '🕯', bounds: { x: 13, y: 9,  w: 15, h: 14 } },
    { id: 'room1',   name: '1인 완화 병실 A',           icon: '🛏', bounds: { x: 0,  y: 22, w: 14, h: 22 } },
    { id: 'sunroom', name: '정원뷰 선룸 · 병실 B',       icon: '🌿', bounds: { x: 13, y: 22, w: 15, h: 22 } },
  ];

  const rooms = [
    { id: 'lounge',  name: '가족 라운지', sub: '키친·휴식',   icon: '🍵', color: '#E4DAC8', x: 6,  y: 5 },
    { id: 'station', name: '완화 케어 데스크', sub: '통증·정서 케어', icon: '🕊', color: '#BAE6FD', x: 6,  y: 15, questCount: 1 },
    { id: 'reflection', name: '명상·추모실', sub: '조용한 공간', icon: '🕯', color: '#E4ECE0', x: 20, y: 15 },
    { id: 'room1',   name: '완화 병실 A', sub: '가정형 1인실', icon: '🛏', color: '#B7C9A8', x: 6,  y: 34, questCount: 1 },
    { id: 'sunroom', name: '선룸 · 병실 B', sub: '정원뷰 임종실', icon: '🌿', color: '#C7E8D8', x: 21, y: 34 },
  ];

  return (
    <InteriorScreen
      label="06q Interior · HOSPICE" deptCode="완화의료·호스피스 · 재활관 4F" deptColor="#5B8A6E"
      cols={COLS} rows={ROWS} floor="peds"
      playerStart={{ x: 4, y: 8 }}
      rooms={rooms}
      regions={regions}
      missionText="완화 병실 A · 통증 조절(지속주입) 확인 + 가족 정서 지지"
      render={() => (
        <>
          {/* ═══════════════ OUTER WALLS ═══════════════ */}
          <IWall x={0} y={0} w={28} h={1}/>
          <IWall x={0} y={1} w={1} h={6}/>
          <IDoor x={0} y={7} w={1} h={3} kind="auto" label="← 엘리베이터"/>
          <IWall x={0} y={10} w={1} h={33}/>
          <IWall x={27} y={1} w={1} h={42}/>
          <IWall x={0} y={43} w={28} h={1}/>

          {/* ═══ LOUNGE / MID DIVIDER (y9) ═══ */}
          <IWall x={1}  y={9} w={4} h={1}/>
          <Th    x={5}  y={9} w={3} h={1} label="→ 복도"/>
          <IWall x={8}  y={9} w={6} h={1}/>
          <Th    x={14} y={9} w={3} h={1} label="→ 명상실"/>
          <IWall x={17} y={9} w={10} h={1}/>
          {/* station | reflection divider */}
          <IWall x={13} y={10} w={1} h={4}/>
          <Th    x={13} y={14} w={1} h={4}/>
          <IWall x={13} y={18} w={1} h={5}/>

          {/* ═══ MID / ROOMS DIVIDER (y22) ═══ */}
          <IWall x={1}  y={22} w={4} h={1}/>
          <Th    x={5}  y={22} w={3} h={1} label="→ 병실 A"/>
          <IWall x={8}  y={22} w={6} h={1}/>
          <Th    x={14} y={22} w={3} h={1} label="→ 선룸 B"/>
          <IWall x={17} y={22} w={10} h={1}/>
          {/* room A | sunroom divider */}
          <IWall x={13} y={23} w={1} h={20}/>

          {/* ════════════════ 가족 라운지 · 키친 (y1-8) ════════════════ */}
          <BayLabel x={1} y={1} text="FAMILY LOUNGE · 가족 라운지"/>
          {/* kitchenette counter along the top */}
          <window.ADLKitchen x={2} y={2} w={3}/>
          <window.Fridge x={6} y={2}/>
          <window.WaterCooler x={8} y={2}/>
          {/* soft seating + coffee table */}
          <window.Sofa x={12} y={3} w={3} color="#B7C9A8"/>
          <window.CoffeeTable x={16} y={4} w={2}/>
          <W.ReclinerDaybed x={19} y={3}/>
          <window.FramedPicture x={13} y={1} w={2}/>
          <IPlant x={25} y={2}/>
          <INpc x={14} y={7} kind="parent" hair="#5C3A1A"/>
          <INpc x={20} y={7} kind="visitor" hair="#3C2A18"/>
          <IHotspot x={13} y={4} kind="info" label="가족 휴식 공간"/>

          {/* ════════════════ 완화 케어 스테이션 (station, y10-21) ════════════════ */}
          <BayLabel x={1} y={10} text="PALLIATIVE CARE DESK" highlight/>
          <NurseStationDesk x={2} y={13} w={9} h={5}/>
          <DeskPhone x={3} y={13}/>
          <ChartBinder x={9} y={13}/>
          <W.ComfortCart x={2} y={19}/>
          {/* palliative nurse + chaplain/social worker */}
          <INpc x={6} y={16} kind="nurse" hair="#3C2A18" shirt="#A5D8E8"/>
          <IHotspot x={6} y={15} kind="info" label="통증·증상 관리"/>
          <INpc x={9} y={19} kind="doctor" hair="#5C3A1A"/>

          {/* ════════════════ 명상 · 추모실 (reflection, y10-21) ════════════════ */}
          <BayLabel x={14} y={10} text="REFLECTION ROOM · 명상"/>
          <W.Tint x={14} y={10} w={13} h={12} color="#2A2440" op={0.10}/>
          <window.Sofa x={15} y={13} w={2} color="#A9B5C4"/>
          <window.Sofa x={20} y={13} w={2} color="#A9B5C4"/>
          <window.CoffeeTable x={17} y={17} w={2}/>
          {/* candle table + framed art */}
          <window.FramedPicture x={23} y={11} w={2}/>
          <IPlant x={25} y={19}/>
          <INpc x={18} y={19} kind="visitor" hair="#9A6B3F"/>
          <IHotspot x={17} y={14} kind="info" label="조용한 성찰"/>

          {/* ════════════════ 1인 완화 병실 A (room1, y23-44) ════════════════ */}
          <BayLabel x={1} y={23} text="PALLIATIVE ROOM A · 가정형"/>
          <W.HospiceBed x={2} y={26} occupied/>
          <W.SyringeDriver x={7} y={27}/>
          <IMonitor x={1} y={26}/>
          {/* family staying over */}
          <W.ReclinerDaybed x={2} y={37}/>
          <window.FramedPicture x={9} y={23} w={2}/>
          <IPlant x={11} y={30}/>
          <INpc x={6} y={31} kind="nurse" hair="#3C2A18" shirt="#B7C9A8"/>
          <INpc x={4} y={40} kind="parent" hair="#5C3A1A"/>
          <IHotspot x={3} y={26} kind="quest" label="지속주입 통증 조절"/>

          {/* ════════════════ 정원뷰 선룸 · 병실 B (sunroom, y23-44) ════════════════ */}
          <BayLabel x={14} y={23} text="SUNROOM · 정원뷰 병실 B"/>
          {/* big garden-view window band along the right wall */}
          <IGlass x={26} y={24} w={1} h={18}/>
          <W.Tint x={20} y={24} w={7} h={18} color="#EAF6DE" op={0.16}/>
          <W.HospiceBed x={15} y={27} occupied/>
          <W.SyringeDriver x={20} y={28}/>
          {/* many plants + a reclining chair facing the garden */}
          <IPlant x={24} y={26}/>
          <IPlant x={24} y={33}/>
          <IPlant x={24} y={40}/>
          <W.ReclinerDaybed x={15} y={38}/>
          <INpc x={19} y={32} kind="nurse" hair="#7C3F00" shirt="#C7E8D8"/>
          <INpc x={18} y={41} kind="visitor" hair="#3C2A18"/>
          <IHotspot x={16} y={27} kind="info" label="임종 돌봄·존엄 케어"/>
        </>
      )}
    />
  );
}

Object.assign(window, { ScreenInteriorHospice });
