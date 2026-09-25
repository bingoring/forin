// interior-postpartum.jsx — 산후 병동 Postpartum (여성소아 센터 3F).
// Mother-baby couplet-care rooms (rooming-in bassinet at each mother bed), a
// lactation/education room, and a warm family lounge. New objects: interior-
// objects-postpartum2.jsx. Reused: Bassinet, NursingRecliner, InfantWarmer,
// WarmerCabinet, NurseStationDesk, VitalsCart.

function ScreenInteriorPostpartum() {
  const COLS = 28, ROWS = 44;
  const Th = window.IThreshold;
  const W = window;

  const regions = [
    { id: 'lactation', name: '수유 · 교육실',           icon: '🍼', bounds: { x: 0,  y: 0,  w: 14, h: 10 } },
    { id: 'lounge',  name: '가족 라운지',               icon: '🛋', bounds: { x: 13, y: 0,  w: 15, h: 10 } },
    { id: 'station', name: '산후 간호 스테이션',         icon: '🖥', bounds: { x: 0,  y: 9,  w: 28, h: 11 } },
    { id: 'room1',   name: '모아동실 1 (2인)',          icon: '🛏', bounds: { x: 0,  y: 19, w: 14, h: 25 } },
    { id: 'room2',   name: '모아동실 2 (2인)',          icon: '🛏', bounds: { x: 13, y: 19, w: 15, h: 25 } },
  ];

  const rooms = [
    { id: 'lactation', name: '수유·교육실', sub: '모유수유 지도', icon: '🍼', color: '#FBCFE8', x: 5,  y: 5, questCount: 1 },
    { id: 'lounge',  name: '가족 라운지', sub: '휴식',        icon: '🛋', color: '#E4DAC8', x: 20, y: 5 },
    { id: 'station', name: '산후 스테이션', sub: '모아 케어',  icon: '🖥', color: '#BAE6FD', x: 14, y: 14, questCount: 1 },
    { id: 'room1',   name: '모아동실 1', sub: '룸인 케어',    icon: '🛏', color: '#FDE68A', x: 6,  y: 32, questCount: 1 },
    { id: 'room2',   name: '모아동실 2', sub: '룸인 케어',    icon: '🛏', color: '#A7F3D0', x: 21, y: 32 },
  ];

  return (
    <InteriorScreen
      label="06u Interior · POSTPARTUM" deptCode="산후 병동 · 여성소아 3F" deptColor="#D06A9A"
      cols={COLS} rows={ROWS} floor="peds"
      playerStart={{ x: 14, y: 13 }}
      rooms={rooms}
      regions={regions}
      missionText="모아동실 1 · 모유수유 교육 + 신생아 룸인 케어"
      render={() => (
        <>
          {/* ═══════════════ OUTER WALLS ═══════════════ */}
          <IWall x={0} y={0} w={28} h={1}/>
          <IWall x={0} y={1} w={1} h={12}/>
          <IDoor x={0} y={13} w={1} h={3} kind="auto" label="← 엘리베이터"/>
          <IWall x={0} y={16} w={1} h={27}/>
          <IWall x={27} y={1} w={1} h={42}/>
          <IWall x={0} y={43} w={28} h={1}/>

          {/* ═══ TOP / STATION DIVIDER (y9) ═══ */}
          <IWall x={1}  y={9} w={5} h={1}/>
          <Th    x={6}  y={9} w={2} h={1} label="→ 복도"/>
          <IWall x={8}  y={9} w={6} h={1}/>
          <Th    x={14} y={9} w={2} h={1} label="→ 복도"/>
          <IWall x={16} y={9} w={11} h={1}/>
          <IWall x={13} y={1} w={1} h={5}/>
          <Th    x={13} y={6} w={1} h={3}/>
          <IWall x={13} y={9} w={1} h={1}/>

          {/* ═══ STATION / ROOMS DIVIDER (y19) ═══ */}
          <IWall x={1}  y={19} w={5} h={1}/>
          <Th    x={6}  y={19} w={2} h={1} label="→ 1실"/>
          <IWall x={8}  y={19} w={6} h={1}/>
          <Th    x={14} y={19} w={2} h={1} label="→ 2실"/>
          <IWall x={16} y={19} w={11} h={1}/>
          <IWall x={13} y={20} w={1} h={23}/>

          {/* ════════════════ 수유 · 교육실 (y1-8) ════════════════ */}
          <BayLabel x={1} y={1} text="LACTATION · 수유 교육" highlight/>
          <W.NursingRecliner x={2} y={3}/>
          <W.NursingRecliner x={6} y={3}/>
          <W.LactationPump x={10} y={2}/>
          <window.WarmerCabinet x={12} y={2}/>
          <INpc x={4} y={7} kind="nurse" hair="#3C2A18" shirt="#FBCFE8"/>
          <INpc x={7} y={7} kind="parent" hair="#9A6B3F"/>
          <IHotspot x={3} y={3} kind="quest" label="모유수유 자세 지도"/>

          {/* ════════════════ 가족 라운지 (y1-8) ════════════════ */}
          <BayLabel x={14} y={1} text="FAMILY LOUNGE"/>
          <window.Sofa x={15} y={3} w={3} color="#C4A578"/>
          <window.CoffeeTable x={19} y={4} w={2}/>
          <window.WaterCooler x={24} y={2}/>
          <window.WallTV x={22} y={1} w={2}/>
          <IPlant x={25} y={7}/>
          <INpc x={16} y={7} kind="visitor" hair="#5C3A1A"/>

          {/* ════════════════ 산후 간호 스테이션 (station, y10-18) ════════════════ */}
          <BayLabel x={1} y={10} text="POSTPARTUM STATION" highlight/>
          <W.Handrail x={27} y={10} w={1} h={8} vertical/>
          <NurseStationDesk x={8} y={12} w={12} h={5}/>
          <DeskPhone x={9} y={12}/>
          <ChartBinder x={18} y={12}/>
          <window.VitalsCart x={4} y={13}/>
          <INpc x={11} y={15} kind="nurse" hair="#3C2A18" shirt="#A5D8E8"/>
          <IHotspot x={11} y={14} kind="info" label="산모·신생아 활력"/>
          <INpc x={15} y={15} kind="nurse" hair="#7C3F00" shirt="#FBCFE8"/>

          {/* ════════════════ 모아동실 1 (room1, y20-44) ════════════════ */}
          <BayLabel x={1} y={20} text="COUPLET ROOM 1 · 룸인"/>
          {/* mother bed + rooming-in bassinet pairs */}
          <W.PostpartumBed x={2} y={23} occupied/>
          <W.Bassinet x={6} y={24} tag="girl"/>
          <IMonitor x={1} y={23}/>
          <W.PostpartumBed x={2} y={35} occupied/>
          <W.Bassinet x={6} y={36} tag="boy"/>
          <W.SitzBathStation x={10} y={23}/>
          <W.NursingRecliner x={9} y={38}/>
          <INpc x={5} y={31} kind="nurse" hair="#3C2A18" shirt="#FDE68A"/>
          <IHotspot x={3} y={23} kind="quest" label="룸인·수유 케어"/>
          <INpc x={11} y={40} kind="parent" hair="#5C3A1A"/>

          {/* ════════════════ 모아동실 2 (room2, y20-44) ════════════════ */}
          <BayLabel x={14} y={20} text="COUPLET ROOM 2 · 룸인"/>
          <W.PostpartumBed x={15} y={23} occupied/>
          <W.Bassinet x={19} y={24} tag="boy"/>
          <IMonitor x={14} y={23}/>
          <W.PostpartumBed x={15} y={35}/>
          <W.Bassinet x={19} y={36} tag="girl"/>
          <W.SitzBathStation x={23} y={23}/>
          <W.NursingRecliner x={22} y={38}/>
          <INpc x={18} y={31} kind="parent" hair="#9A6B3F"/>
          <IHotspot x={16} y={23} kind="info" label="산모 회복 관찰"/>
          <IPlant x={25} y={43}/>
        </>
      )}
    />
  );
}

Object.assign(window, { ScreenInteriorPostpartum });
