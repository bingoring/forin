// interior-spd.jsx — 중앙공급실 SPD/CSD · 영양팀/배식실 · 하역장 (행정·지원동 1F).
// Industrial back-of-house: a soiled→clean instrument reprocessing line, sterile
// storage, a food-service kitchen/tray line, and a loading dock. Staff-only,
// exposed-pipe utilitarian feel. New objects: interior-objects-spd2.jsx.

function ScreenInteriorSPD() {
  const COLS = 30, ROWS = 44;
  const Th = window.IThreshold;
  const W = window;

  const regions = [
    { id: 'soiled',  name: '오염 세척 구역 (Decon)',   icon: '🧽', bounds: { x: 0,  y: 0,  w: 15, h: 12 } },
    { id: 'sterile', name: '멸균 · 보관 구역',          icon: '📦', bounds: { x: 14, y: 0,  w: 16, h: 12 } },
    { id: 'kitchen', name: '영양팀 · 배식실',           icon: '🍚', bounds: { x: 0,  y: 11, w: 30, h: 15 } },
    { id: 'dock',    name: '화물 하역장 (Loading Dock)', icon: '🚚', bounds: { x: 0,  y: 25, w: 30, h: 19 } },
  ];

  const rooms = [
    { id: 'soiled',  name: '오염 세척',  sub: '기구 세척·소독', icon: '🧽', color: '#FDE68A', x: 6,  y: 6, questCount: 1 },
    { id: 'sterile', name: '멸균·보관',  sub: 'Autoclave·SPD', icon: '📦', color: '#A7F3D0', x: 22, y: 6, questCount: 1 },
    { id: 'kitchen', name: '영양팀 배식', sub: '조리·트레이',   icon: '🍚', color: '#FED7AA', x: 8,  y: 18 },
    { id: 'dock',    name: '하역장',    sub: '물류 입·출고',   icon: '🚚', color: '#C4CBD2', x: 8,  y: 35 },
  ];

  return (
    <InteriorScreen
      label="06x Interior · SPD/SUPPORT" deptCode="중앙공급실·영양·하역 · 지원동 1F" deptColor="#6B7280"
      cols={COLS} rows={ROWS} floor="pharma"
      playerStart={{ x: 4, y: 8 }}
      rooms={rooms}
      regions={regions}
      missionText="멸균 구역 · 오토클레이브 사이클 확인 + 멸균 팩 검수"
      render={() => (
        <>
          {/* ═══════════════ OUTER WALLS ═══════════════ */}
          <IWall x={0} y={0} w={30} h={1}/>
          <IWall x={0} y={1} w={1} h={6}/>
          <IDoor x={0} y={7} w={1} h={3} kind="auto" label="← 엘리베이터"/>
          <IWall x={0} y={10} w={1} h={33}/>
          <IWall x={29} y={1} w={1} h={30}/>
          {/* loading-dock roll-up door on the right */}
          <IDoor x={29} y={31} w={1} h={6} kind="auto" label="하역장 게이트"/>
          <IWall x={29} y={37} w={1} h={6}/>
          <IWall x={0} y={43} w={30} h={1}/>

          {/* ═══ SOILED / STERILE DIVIDER (y11) — one-way pass-through ═══ */}
          <IWall x={1}  y={11} w={5} h={1}/>
          <Th    x={6}  y={11} w={2} h={1} label="→ 배식"/>
          <IWall x={8}  y={11} w={6} h={1}/>
          <Th    x={14} y={11} w={2} h={1} label="→ 배식"/>
          <IWall x={16} y={11} w={13} h={1}/>
          {/* soiled | sterile barrier wall with a pass-through washer */}
          <IWall x={14} y={1} w={1} h={4}/>
          <Th    x={14} y={5} w={1} h={3} tone="sterile" label="세척→멸균"/>
          <IWall x={14} y={8} w={1} h={3}/>

          {/* ═══ KITCHEN / DOCK DIVIDER (y25) ═══ */}
          <IWall x={1}  y={25} w={6} h={1}/>
          <Th    x={7}  y={25} w={3} h={1} label="→ 하역장"/>
          <IWall x={10} y={25} w={19} h={1}/>

          {/* ════════════════ 오염 세척 구역 (soiled, y1-10) ════════════════ */}
          <BayLabel x={1} y={1} text="DECONTAMINATION · 오염 세척" highlight/>
          <window.SinkOR x={2} y={2}/>
          <W.WasherDisinfector x={6} y={2}/>
          <window.SoiledCart x={10} y={3}/>
          <window.WasteBin x={2} y={7} tone="infectious"/>
          <INpc x={5} y={7} kind="nurse" hair="#3C2A18" shirt="#FEF9C3"/>
          <IHotspot x={7} y={3} kind="quest" label="기구 세척·소독 사이클"/>

          {/* ════════════════ 멸균 · 보관 구역 (sterile, y1-10) ════════════════ */}
          <BayLabel x={15} y={1} text="STERILE PROCESSING · 멸균"/>
          <W.Autoclave x={16} y={2}/>
          <W.Autoclave x={20} y={2}/>
          <W.SterileRack x={24} y={3} w={3}/>
          <W.SterileRack x={16} y={8} w={4}/>
          <INpc x={22} y={8} kind="nurse" hair="#7C3F00" shirt="#A7F3D0"/>
          <IHotspot x={17} y={3} kind="quest" label="오토클레이브·팩 검수"/>

          {/* ════════════════ 영양팀 · 배식실 (kitchen, y12-24) ════════════════ */}
          <BayLabel x={1} y={12} text="NUTRITION · 배식실"/>
          {/* stainless prep counters + tray assembly line */}
          <window.ADLKitchen x={2} y={14} w={4}/>
          <window.Fridge x={7} y={14}/>
          {/* tray line: a run of food carts */}
          <W.FoodCartColumn x={2} y={19}/>
          <W.FoodCartColumn x={5} y={19}/>
          <W.FoodCartColumn x={8} y={19}/>
          <IReception x={12} y={14} w={5} h={1} label="식단 검수"/>
          <window.ShelfLabel x={19} y={13} text="DIET ORDERS"/>
          <ICabinet x={19} y={14} w={4} h={1} kind="pharma"/>
          <ICabinet x={23} y={14} w={4} h={1} kind="pharma"/>
          <W.FoodCartColumn x={20} y={19}/>
          <W.FoodCartColumn x={23} y={19}/>
          <INpc x={4} y={17} kind="nurse" hair="#3C2A18" shirt="#FED7AA"/>
          <INpc x={13} y={17} kind="nurse" hair="#9A6B3F" shirt="#FED7AA"/>
          <IHotspot x={12} y={14} kind="info" label="치료식 트레이 준비"/>

          {/* ════════════════ 화물 하역장 (dock, y26-42) ════════════════ */}
          <BayLabel x={1} y={26} text="LOADING DOCK · 하역장"/>
          {/* concrete dock zone with painted floor lane (tint) */}
          <W.Tint x={1} y={26} w={28} h={16} color="#9CA3AF" op={0.14}/>
          <W.PalletStack x={2} y={30}/>
          <W.PalletStack x={6} y={30}/>
          <W.PalletStack x={2} y={37}/>
          {/* incoming delivery truck at the dock gate */}
          <window.CargoTruck x={22} y={31}/>
          {/* pallet jack + dock worker */}
          <window.MedCart x={12} y={33}/>
          <INpc x={10} y={35} kind="nurse" hair="#3C2A18" shirt="#C4CBD2"/>
          <INpc x={16} y={34} kind="visitor" hair="#5C3A1A"/>
          <IHotspot x={12} y={33} kind="info" label="물류 입·출고 검수"/>
          {/* yellow safety floor line at the dock edge */}
          <window.FloorTape x={1} y={41} w={20} text="━━ 안전선 · DOCK EDGE ━━"/>
        </>
      )}
    />
  );
}

Object.assign(window, { ScreenInteriorSPD });
