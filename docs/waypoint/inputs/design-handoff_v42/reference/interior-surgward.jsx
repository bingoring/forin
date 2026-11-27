// interior-surgward.jsx — 일반 외과 병동 (General Surgery inpatient WARD).
// 28×52 tiles, vertical flow. Perioperative care: post-op admits, PCA pain
// control, surgical drains (JP/Hemovac), NG-to-suction, dressing changes, and
// the ambulation corridor (post-op walking). NOT the outpatient 외과 clinic
// (that's ScreenInteriorSurgery in interior-clinics.jsx).
//
//   ┌ 린넨·배식 ┬ 중앙 처치/드레싱룸 ─────┐   (서비스 + 멸균 처치)
//   ├──────── 중앙 간호 스테이션 · 보행 복도 ─┤   (OP 스케줄 보드 + 워커)
//   ├──────── 4인용 수술 후 병실 (A·B·C·D) ──┤   (PCA·JP·가스배출·퇴원)
//   ├──────── 1인용 대수술 후 중증 병실 ──────┤   (NG·Hemovac·SCD)
//   └────────────────────────────────────────┘
//
// New blueprint objects: interior-objects-surg2.jsx. Reused cross-dept:
// NurseStationDesk, VitalsCart, DressingCart, SurgicalLight, InstrumentTray,
// SuctionUnit, Handrail, NPOBoard, IVStorageCart, SupplyBasketShelf, MealCart,
// SharpsBin, LinenHamper, SluiceSink.

function ScreenInteriorSurgWard() {
  const COLS = 28, ROWS = 46;
  const Th = window.IThreshold;
  const W = window;

  const regions = [
    { id: 'linen',   name: '린넨실 · 배식실',        icon: '🍱', bounds: { x: 0,  y: 0,  w: 10, h: 11 } },
    { id: 'dressing', name: '중앙 처치실 · 드레싱룸',  icon: '🩹', bounds: { x: 9,  y: 0,  w: 19, h: 11 } },
    { id: 'station', name: '중앙 간호 스테이션 · 보행', icon: '🖥', bounds: { x: 0,  y: 10, w: 28, h: 11 } },
    { id: 'room4',   name: '4인용 수술 후 병실',       icon: '🛏', bounds: { x: 0,  y: 20, w: 28, h: 11 } },
    { id: 'major',   name: '1인용 대수술 후 중증실',    icon: '🚨', bounds: { x: 0,  y: 31, w: 28, h: 15 } },
  ];

  const rooms = [
    { id: 'linen',    name: '린넨·배식실', sub: '시트·식이',   icon: '🍱', color: '#FED7AA', x: 4,  y: 5 },
    { id: 'dressing', name: '처치·드레싱룸', sub: '상처 소독·실밥', icon: '🩹', color: '#A8DCEC', x: 17, y: 5,  questCount: 1 },
    { id: 'station',  name: '간호 스테이션', sub: 'OP 인계·스케줄', icon: '🖥', color: '#BAE6FD', x: 13, y: 15, questCount: 1 },
    { id: 'room4',    name: '4인 수술후 병실', sub: 'PCA·배액관', icon: '🛏', color: '#FBCFE8', x: 13, y: 27, questCount: 2 },
    { id: 'major',    name: '대수술 중증실', sub: 'NG·Hemovac·SCD', icon: '🚨', color: '#FCA5A5', x: 13, y: 39, questCount: 1 },
  ];

  return (
    <InteriorScreen
      label="06h Interior · SURG WARD" deptCode="일반 외과 병동 · 7F" deptColor="#2563EB"
      cols={COLS} rows={ROWS} floor="surgery"
      playerStart={{ x: 4, y: 15 }}
      rooms={rooms}
      regions={regions}
      missionText="4인실 Bed A · 심호흡·기침 교육 + PCA 통증 사정"
      render={() => (
        <>
          {/* ═══════════════ OUTER WALLS ═══════════════ */}
          <IWall x={0} y={0} w={28} h={1}/>
          <IWall x={0} y={1} w={1} h={13}/>
          <IDoor x={0} y={14} w={1} h={3} kind="auto" label="← 캠퍼스로"/>
          <IWall x={0} y={17} w={1} h={28}/>
          <IWall x={27} y={1} w={1} h={44}/>
          <IWall x={0} y={45} w={28} h={1}/>

          {/* ═══ SERVICE STRIP DIVIDER (y10) ═══ */}
          <IWall x={1}  y={10} w={4} h={1}/>
          <Th    x={5}  y={10} w={2} h={1} label="→ 복도"/>
          <IWall x={7}  y={10} w={6} h={1}/>
          <Th    x={13} y={10} w={3} h={1} tone="sterile" label="→ 처치실"/>
          <IWall x={16} y={10} w={11} h={1}/>
          {/* linen | dressing vertical divider */}
          <IWall x={9}  y={1} w={1} h={5}/>
          <Th    x={9}  y={6} w={1} h={3}/>
          <IWall x={9}  y={9} w={1} h={1}/>

          {/* ═══ STATION / ROOM4 DIVIDER (y20) ═══ */}
          <IWall x={1}  y={20} w={6} h={1}/>
          <Th    x={7}  y={20} w={3} h={1}/>
          <IWall x={10} y={20} w={8} h={1}/>
          <Th    x={18} y={20} w={3} h={1}/>
          <IWall x={21} y={20} w={6} h={1}/>

          {/* ═══ ROOM4 / MAJOR DIVIDER (y31) ═══ */}
          <IWall x={1}  y={31} w={9} h={1}/>
          <Th    x={10} y={31} w={3} h={1} label="→ 중증실"/>
          <IWall x={13} y={31} w={14} h={1}/>

          {/* ════════════════ 린넨실 · 배식실 (y1-9) ════════════════ */}
          <BayLabel x={1} y={1} text="린넨 · 배식실"/>
          <ICabinet x={1} y={2} w={3} variant="linen" label="LINEN"/>
          <ICabinet x={5} y={2} w={3} variant="linen"/>
          <MealCart x={2} y={5}/>
          <ICabinet x={6} y={6} w={2} variant="supply"/>
          <INpc x={4} y={8} kind="nurse" hair="#7C3F00" shirt="#FED7AA"/>
          <IHotspot x={2} y={5} kind="info" label="식이 배식"/>

          {/* ════════════════ 중앙 처치실 · 드레싱룸 (y1-9) ════════════════ */}
          <BayLabel x={10} y={1} text="TREATMENT · DRESSING ROOM" highlight/>
          {/* treatment bed under a surgical light */}
          <window.SurgicalLight x={14} y={2}/>
          <IBed x={12} y={3} variant="or" occupied label="처치 베드"/>
          {/* dressing cart — the core surgical-nursing object */}
          <window.DressingCart x={16} y={4}/>
          <window.InstrumentTray x={19} y={3}/>
          <window.StapleRemover x={22} y={3}/>
          <ICabinet x={24} y={2} w={3} variant="sterile" label="STERILE"/>
          {/* surgeon + nurse changing the abdominal dressing */}
          <INpc x={12} y={6} kind="surgeon" hair="#1F2937"/>
          <INpc x={15} y={6} kind="nurse"   hair="#3C2A18" shirt="#A8DCEC"/>
          <IHotspot x={13} y={4} kind="quest" label="복부 드레싱 교체"/>
          <window.WasteBin x={24} y={6} tone="infectious"/>

          {/* ════════════════ 중앙 간호 스테이션 · 보행 복도 (y11-19) ════════════════ */}
          <BayLabel x={1} y={11} text="CENTRAL STATION · AMBULATION" highlight/>
          {/* corridor handrails for post-op walking */}
          <W.Handrail x={27} y={11} w={1} h={8} vertical/>
          {/* big ㄷ-shape nurse station + OP schedule whiteboard */}
          <NurseStationDesk x={8} y={13} w={12} h={5}/>
          <window.OPScheduleBoard x={2} y={11} w={5}/>
          <DeskPhone x={9} y={13}/>
          <DeskPhone x={17} y={13}/>
          {/* walker rack + a couple of mobile IV poles in the corridor */}
          <window.WalkerRack x={21} y={11} w={3}/>
          <window.PCAPump x={6} y={16}/>
          {/* team: charge nurse (OR call) + surgical resident (orders) */}
          <INpc x={11} y={16} kind="nurse"   hair="#3C2A18" shirt="#A5D8E8"/>
          <IHotspot x={11} y={15} kind="urgent" label="OR 인계 콜"/>
          <INpc x={15} y={16} kind="doctor"  hair="#1F2937"/>
          <IHotspot x={15} y={15} kind="info" label="수술 상처 오더"/>
          {/* a post-op patient walking with a guardian pushing the IV pole */}
          <INpc x={23} y={16} kind="patient" hair="#9A6B3F"/>
          <INpc x={24} y={17.5} kind="parent" hair="#5C3A1A"/>
          <IHotspot x={23} y={16} kind="info" label="조기 이상(보행)"/>

          {/* ════════════════ 4인용 수술 후 병실 (y21-34) ════════════════ */}
          <BayLabel x={1} y={21} text="4-BED POST-OP RECOVERY"/>
          {/* Bed A — 수술 당일 (PCA + NPO, 심호흡 교육) */}
          <IBed x={2} y={23} variant="ward" occupied label="A · OP DAY"/>
          <window.PCAPump x={5} y={22}/>
          <window.NPOBoard x={2} y={22}/>
          <IMonitor x={1} y={23} beep/>
          <INpc x={4} y={26} kind="nurse" hair="#3C2A18" shirt="#A5D8E8"/>
          <IHotspot x={3} y={23} kind="quest" label="심호흡·기침 교육"/>
          {/* Bed B — JP 배액관 관리 */}
          <IBed x={9} y={23} variant="ward" occupied label="B · JP DRAIN"/>
          <window.JPDrain x={12} y={25}/>
          <IIV x={8} y={23}/>
          <INpc x={12} y={26} kind="nurse" hair="#7C3F00" shirt="#A8DCEC"/>
          <IHotspot x={9} y={23} kind="info" label="JP 배액량 측정"/>
          {/* Bed C — 가스 배출 확인 (기뻐하는 환자) */}
          <IBed x={17} y={23} variant="ward" occupied label="C · FLATUS"/>
          <IIV x={20} y={23}/>
          <INpc x={20} y={26} kind="patient" hair="#9A6B3F" expression="happy"/>
          <IHotspot x={17} y={23} kind="info" label="가스 배출 확인"/>
          {/* Bed D — 퇴원 대기 (실밥 제거 후) */}
          <IBed x={24} y={23} variant="ward" occupied label="D · D/C"/>
          <IChair x={21} y={25} color="#FED7AA" facing="left"/>
          <INpc x={21} y={26} kind="parent" hair="#5C3A1A"/>
          <IHotspot x={24} y={23} kind="info" label="퇴원 약 대기"/>
          {/* curtains splitting the bays */}
          <ICurtain x={8}  y={22} w={1} h={6} color="#BFE3EE"/>
          <ICurtain x={16} y={22} w={1} h={6} color="#BFE3EE"/>
          <ICurtain x={23} y={22} w={1} h={6} color="#BFE3EE"/>
          {/* rounding doctor */}
          <INpc x={3} y={29} kind="doctor" hair="#1F2937"/>

          {/* ════════════════ 1인용 대수술 후 중증실 (major, y32-44) ════════════════ */}
          <BayLabel x={1} y={32} text="MAJOR POST-OP · 대장암/위암 절제" highlight/>
          {/* major-resection patient with NG tube + multiple drains */}
          <IBed x={4} y={34} variant="ward" occupied label="POST-OP MAJOR"/>
          <window.NGSuction x={1} y={34}/>
          <IMonitor x={8} y={34} beep/>
          <IIV x={9} y={34}/>
          <window.PCAPump x={11} y={34}/>
          {/* Hemovac drains pinned to the sheet, close beside the bed */}
          <window.Hemovac x={4} y={36.5}/>
          <window.Hemovac x={6} y={36.5}/>
          {/* SCD/DVT prophylaxis on the legs */}
          <window.SCDDevice x={13} y={38}/>
          {/* nurse checking drain patency + IV rate */}
          <INpc x={8} y={37} kind="nurse" hair="#3C2A18" shirt="#A5D8E8"/>
          <IHotspot x={5} y={34} kind="quest" label="배액관 개통성 확인"/>
          <window.SuctionUnit x={16} y={35}/>
          <window.Sofa x={13} y={41} w={3} color="#9CB4C8"/>
          <INpc x={14} y={39} kind="parent" hair="#3C2A18"/>
          <IChair x={17} y={40} color="#FED7AA" facing="left"/>
          <IPlant x={20} y={41}/>
        </>
      )}
    />
  );
}

Object.assign(window, { ScreenInteriorSurgWard });
