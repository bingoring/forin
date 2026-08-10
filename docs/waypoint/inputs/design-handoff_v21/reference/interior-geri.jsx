// interior-geri.jsx — 치매·노인성 질환 병동 Geriatric/Dementia Ward (재활관 4F).
// Dementia-friendly: a loop-style day area at the entry (wandering-safe), a
// nursing station with sightlines, memory-cued patient rooms with low beds, and
// a reminiscence lounge. New objects: interior-objects-geri2.jsx.

function ScreenInteriorGeri() {
  const COLS = 28, ROWS = 44;
  const Th = window.IThreshold;
  const W = window;

  const regions = [
    { id: 'daycommon', name: '데이 커먼 · 배회 안전존', icon: '🔆', bounds: { x: 0,  y: 0,  w: 28, h: 10 } },
    { id: 'station', name: '노인 간호 스테이션',        icon: '👁', bounds: { x: 0,  y: 9,  w: 14, h: 14 } },
    { id: 'reminis', name: '회상 라운지',               icon: '📻', bounds: { x: 13, y: 9,  w: 15, h: 14 } },
    { id: 'roomA',   name: '치매 병실 A',               icon: '🛏', bounds: { x: 0,  y: 22, w: 14, h: 22 } },
    { id: 'roomB',   name: '치매 병실 B',               icon: '🛏', bounds: { x: 13, y: 22, w: 15, h: 22 } },
  ];

  const rooms = [
    { id: 'daycommon', name: '데이 커먼', sub: '배회 안전·활동', icon: '🔆', color: '#FDE68A', x: 6,  y: 5 },
    { id: 'station', name: '노인 간호 스테이션', sub: '시야 확보', icon: '👁', color: '#BAE6FD', x: 6,  y: 15, questCount: 1 },
    { id: 'reminis', name: '회상 라운지', sub: '추억·정서 안정', icon: '📻', color: '#E4DAC8', x: 21, y: 15 },
    { id: 'roomA',   name: '치매 병실 A', sub: '초저상·회상상자', icon: '🛏', color: '#B7C9A8', x: 6,  y: 34, questCount: 1 },
    { id: 'roomB',   name: '치매 병실 B', sub: '낙상 방지',     icon: '🛏', color: '#C7B8E8', x: 21, y: 34 },
  ];

  return (
    <InteriorScreen
      label="06r Interior · GERIATRIC" deptCode="치매·노인병동 · 재활관 4F" deptColor="#B07A3C"
      cols={COLS} rows={ROWS} floor="peds"
      playerStart={{ x: 4, y: 8 }}
      rooms={rooms}
      regions={regions}
      missionText="치매 병실 A · 초저상 침대 낙상 사정 + 현실 인식 지지"
      render={() => (
        <>
          {/* ═══════════════ OUTER WALLS ═══════════════ */}
          <IWall x={0} y={0} w={28} h={1}/>
          <IWall x={0} y={1} w={1} h={6}/>
          <IDoor x={0} y={7} w={1} h={3} kind="auto" label="← 엘리베이터"/>
          <IWall x={0} y={10} w={1} h={33}/>
          <IWall x={27} y={1} w={1} h={42}/>
          <IWall x={0} y={43} w={28} h={1}/>

          {/* ═══ DAY COMMON / MID DIVIDER (y9) ═══ */}
          <IWall x={1}  y={9} w={4} h={1}/>
          <Th    x={5}  y={9} w={3} h={1} label="→ 복도"/>
          <IWall x={8}  y={9} w={6} h={1}/>
          <Th    x={14} y={9} w={3} h={1} label="→ 회상실"/>
          <IWall x={17} y={9} w={10} h={1}/>
          <IWall x={13} y={10} w={1} h={4}/>
          <Th    x={13} y={14} w={1} h={4}/>
          <IWall x={13} y={18} w={1} h={5}/>

          {/* ═══ MID / ROOMS DIVIDER (y22) ═══ */}
          <IWall x={1}  y={22} w={4} h={1}/>
          <Th    x={5}  y={22} w={3} h={1} label="→ 병실 A"/>
          <IWall x={8}  y={22} w={6} h={1}/>
          <Th    x={14} y={22} w={3} h={1} label="→ 병실 B"/>
          <IWall x={17} y={22} w={10} h={1}/>
          <IWall x={13} y={23} w={1} h={20}/>

          {/* ════════════════ 데이 커먼 · 배회 안전존 (y1-8) ════════════════ */}
          <BayLabel x={1} y={1} text="DAY COMMON · 배회 안전존"/>
          {/* continuous handrail along the top wall (wandering loop) */}
          <W.HandrailWall x={2} y={1} w={8}/>
          <W.OrientationBoard x={2} y={3} w={3}/>
          {/* activity table + comfortable geri chairs */}
          <W.GeriReclineChair x={12} y={3}/>
          <window.CoffeeTable x={15} y={4} w={2}/>
          <W.GeriReclineChair x={18} y={3}/>
          <window.WallTV x={23} y={1} w={2}/>
          <IPlant x={25} y={7}/>
          <INpc x={13} y={7} kind="patient" hair="#C7C7C7"/>
          <INpc x={19} y={7} kind="patient" hair="#D8D8D8"/>
          <IHotspot x={3} y={3} kind="info" label="현실 인식 (날짜·계절)"/>

          {/* ════════════════ 노인 간호 스테이션 (station, y10-21) ════════════════ */}
          <BayLabel x={1} y={10} text="GERIATRIC STATION" highlight/>
          <NurseStationDesk x={2} y={13} w={9} h={5}/>
          <DeskPhone x={3} y={13}/>
          <ChartBinder x={9} y={13}/>
          <window.VitalsCart x={2} y={19}/>
          <INpc x={6} y={16} kind="nurse" hair="#3C2A18" shirt="#A5D8E8"/>
          <IHotspot x={6} y={15} kind="info" label="배회·낙상 관찰"/>
          <INpc x={9} y={19} kind="doctor" hair="#5C3A1A"/>

          {/* ════════════════ 회상 라운지 (reminis, y10-21) ════════════════ */}
          <BayLabel x={14} y={10} text="REMINISCENCE LOUNGE · 회상"/>
          {/* vintage-styled cozy corner: old radio, framed photos, warm sofa */}
          <window.Sofa x={15} y={13} w={3} color="#C4A578"/>
          <window.CoffeeTable x={19} y={14} w={2}/>
          <window.FramedPicture x={15} y={10} w={2}/>
          <window.FramedPicture x={21} y={10} w={2}/>
          <W.ComfortCart x={23} y={13}/>
          <IPlant x={25} y={20}/>
          <INpc x={17} y={19} kind="patient" hair="#CFCFCF"/>
          <INpc x={20} y={19} kind="visitor" hair="#5C3A1A"/>
          <IHotspot x={16} y={14} kind="info" label="추억 회상 요법"/>

          {/* ════════════════ 치매 병실 A (roomA, y23-44) ════════════════ */}
          <BayLabel x={1} y={23} text="DEMENTIA ROOM A"/>
          {/* memory box beside the door helps residents find their room */}
          <W.MemoryBox x={1} y={24}/>
          <W.LowBed x={3} y={27} occupied/>
          <W.LowBed x={9} y={27} occupied/>
          <W.GeriReclineChair x={3} y={38}/>
          <window.FramedPicture x={11} y={23} w={1}/>
          <INpc x={7} y={33} kind="nurse" hair="#3C2A18" shirt="#B7C9A8"/>
          <IHotspot x={4} y={27} kind="quest" label="초저상 낙상 사정"/>
          <INpc x={10} y={40} kind="patient" hair="#D8D8D8"/>

          {/* ════════════════ 치매 병실 B (roomB, y23-44) ════════════════ */}
          <BayLabel x={14} y={23} text="DEMENTIA ROOM B"/>
          <W.MemoryBox x={14} y={24}/>
          <W.LowBed x={16} y={27} occupied/>
          <W.LowBed x={22} y={27}/>
          <W.GeriReclineChair x={16} y={38}/>
          <IPlant x={25} y={42}/>
          <INpc x={20} y={33} kind="nurse" hair="#7C3F00" shirt="#C7B8E8"/>
          <IHotspot x={17} y={27} kind="info" label="야간 배회 관찰"/>
          <INpc x={23} y={40} kind="visitor" hair="#9A6B3F"/>
        </>
      )}
    />
  );
}

Object.assign(window, { ScreenInteriorGeri });
