// interior-orthoward.jsx — 정형외과 병동 (Orthopedics inpatient WARD).
// 28×52 tiles, vertical flow. Impaired-mobility care: skeletal traction, CPM,
// casting, CMS checks, hip-fracture dislocation precautions. Wide open bays for
// beds + DME. NOT the outpatient 정형외과 clinic (ScreenInteriorOrtho).
//
//   ┌ PT 연계 통로 ┬ 석고실 · 소처치실 ──────┐   (재활 + 캐스팅)
//   ├──── 중앙 간호 스테이션 · 보조기 베이 ────┤   (PACS·CMS·BraceRack)
//   ├──── 4인용 골절/견인 병실 (A·B·C·D) ─────┤   (견인·CPM·구획증후군)
//   ├──── 1인용 고령 고관절 골절 병실 ─────────┤   (외전베개·낙상경보)
//   └─────────────────────────────────────────┘
//
// New objects: interior-objects-ortho2.jsx. Reused cross-dept: NurseStationDesk,
// Walker, WalkerRack, DressingCart, SurgicalLight, Handrail, Wheelchair,
// SluiceSink, WasteBin, MealCart.

function ScreenInteriorOrthoWard() {
  const COLS = 28, ROWS = 52;
  const Th = window.IThreshold;
  const W = window;

  const regions = [
    { id: 'pt',      name: '물리치료 연계 통로',     icon: '🦮', bounds: { x: 0,  y: 0,  w: 10, h: 11 } },
    { id: 'cast',    name: '석고실 · 소처치실',      icon: '🦴', bounds: { x: 9,  y: 0,  w: 19, h: 11 } },
    { id: 'station', name: '중앙 간호 스테이션 · 보조기', icon: '🖥', bounds: { x: 0,  y: 10, w: 28, h: 11 } },
    { id: 'room4',   name: '4인용 골절/견인 병실',    icon: '🦵', bounds: { x: 0,  y: 20, w: 28, h: 16 } },
    { id: 'hip',     name: '1인용 고관절 골절 병실',  icon: '🦯', bounds: { x: 0,  y: 35, w: 28, h: 17 } },
  ];

  const rooms = [
    { id: 'pt',      name: 'PT 연계 통로', sub: '재활 이동',    icon: '🦮', color: '#FED7AA', x: 4,  y: 5 },
    { id: 'cast',    name: '석고실·처치',  sub: '깁스·소독',    icon: '🦴', color: '#A8DCEC', x: 17, y: 5,  questCount: 1 },
    { id: 'station', name: '간호 스테이션', sub: 'CMS·보조기',  icon: '🖥', color: '#BAE6FD', x: 13, y: 15, questCount: 1 },
    { id: 'room4',   name: '4인 골절 병실', sub: '견인·CPM·석고', icon: '🦵', color: '#FBCFE8', x: 13, y: 27, questCount: 2 },
    { id: 'hip',     name: '고관절 골절실', sub: '탈구 방지',   icon: '🦯', color: '#FCA5A5', x: 13, y: 44, questCount: 1 },
  ];

  return (
    <InteriorScreen
      label="06i Interior · ORTHO WARD" deptCode="정형외과 병동 · 8F" deptColor="#B45309"
      cols={COLS} rows={ROWS} floor="ortho"
      playerStart={{ x: 13, y: 14 }}
      rooms={rooms}
      regions={regions}
      missionText="4인실 Bed C · 구획증후군(Compartment) CMS 사정"
      missionUrgent
      render={() => (
        <>
          {/* ═══════════════ OUTER WALLS ═══════════════ */}
          <IWall x={0} y={0} w={28} h={1}/>
          <IWall x={0} y={1} w={1} h={50}/>
          <IWall x={27} y={1} w={1} h={50}/>
          <IWall x={0} y={51} w={12} h={1}/>
          <IDoor x={12} y={51} w={3} h={1} kind="auto" label="↑ 캠퍼스로"/>
          <IWall x={15} y={51} w={13} h={1}/>

          {/* ═══ SERVICE STRIP DIVIDER (y10) — wide open thresholds ═══ */}
          <IWall x={1}  y={10} w={3} h={1}/>
          <Th    x={4}  y={10} w={3} h={1} label="→ 복도"/>
          <IWall x={7}  y={10} w={5} h={1}/>
          <Th    x={12} y={10} w={4} h={1} tone="sterile" label="→ 석고실"/>
          <IWall x={16} y={10} w={11} h={1}/>
          {/* pt | cast vertical divider */}
          <IWall x={9}  y={1} w={1} h={4}/>
          <Th    x={9}  y={5} w={1} h={4}/>
          <IWall x={9}  y={9} w={1} h={1}/>

          {/* ═══ STATION / ROOM4 DIVIDER (y20) — extra-wide bays ═══ */}
          <IWall x={1}  y={20} w={5} h={1}/>
          <Th    x={6}  y={20} w={4} h={1}/>
          <IWall x={10} y={20} w={6} h={1}/>
          <Th    x={16} y={20} w={4} h={1}/>
          <IWall x={20} y={20} w={7} h={1}/>

          {/* ═══ ROOM4 / HIP DIVIDER (y35) ═══ */}
          <IWall x={1}  y={35} w={8} h={1}/>
          <Th    x={9}  y={35} w={4} h={1} label="→ 고관절실"/>
          <IWall x={13} y={35} w={14} h={1}/>

          {/* ════════════════ 물리치료 연계 통로 (y1-9) ════════════════ */}
          <BayLabel x={1} y={1} text="PT 연계 통로"/>
          <W.Handrail x={1} y={2} w={1} h={7} vertical/>
          <W.WalkerRack x={2} y={2} w={2}/>
          <W.Wheelchair x={2} y={6}/>
          <INpc x={5} y={7} kind="patient" hair="#9A6B3F"/>
          <IHotspot x={3} y={5} kind="info" label="재활 이동"/>
          <IPlant x={7} y={8}/>

          {/* ════════════════ 석고실 · 소처치실 (y1-9) ════════════════ */}
          <BayLabel x={10} y={1} text="CAST ROOM · 소처치" highlight/>
          {/* adjustable procedure bed */}
          <IBed x={11} y={3} variant="or" occupied label="처치 베드"/>
          {/* plaster trap sink — core object */}
          <window.PlasterTrapSink x={15} y={3}/>
          <window.CastRollShelf x={18} y={2} w={3}/>
          <window.CastCutter x={22} y={6}/>
          <window.DressingCart x={24} y={3}/>
          {/* surgeon casting a fiberglass cast + nurse with warm-water bucket */}
          <INpc x={11} y={6} kind="surgeon" hair="#1F2937"/>
          <INpc x={14} y={6} kind="nurse"   hair="#3C2A18" shirt="#A8DCEC"/>
          <IHotspot x={12} y={4} kind="quest" label="화이버글래스 깁스"/>

          {/* ════════════════ 중앙 간호 스테이션 · 보조기 베이 (y11-19) ════════════════ */}
          <BayLabel x={1} y={11} text="CENTRAL STATION · DME BAY" highlight/>
          <W.Handrail x={1}  y={11} w={1} h={8} vertical/>
          <W.Handrail x={27} y={11} w={1} h={8} vertical/>
          {/* PACS dual-monitor station + ㄷ desk */}
          <NurseStationDesk x={6} y={13} w={11} h={5}/>
          <window.PACSViewer x={2} y={12}/>
          <DeskPhone x={7} y={13}/>
          <CMSChart x={15} y={12}/>
          {/* equipment bay along the right wall: brace rack + walker rack */}
          <window.BraceRack x={20} y={12} w={3}/>
          <window.Walker x={24} y={16}/>
          {/* team: charge nurse (PT call) + ortho resident (PACS) + nurse sizing crutches */}
          <INpc x={9}  y={16} kind="nurse"  hair="#3C2A18" shirt="#A5D8E8"/>
          <IHotspot x={9} y={15} kind="urgent" label="PT 스케줄 콜"/>
          <INpc x={13} y={16} kind="doctor" hair="#1F2937"/>
          <IHotspot x={13} y={15} kind="info" label="X-ray 정렬 검토"/>
          <INpc x={22} y={16} kind="nurse"  hair="#7C3F00" shirt="#A7F3D0"/>
          <IHotspot x={21} y={15} kind="info" label="목발 높이 조절"/>

          {/* ════════════════ 4인용 골절/견인 병실 (y21-34) ════════════════ */}
          <BayLabel x={1} y={21} text="4-BED · 골절/견인"/>
          {/* Bed A — 골격 견인 (하이라이트) */}
          <IBed x={2} y={23} variant="ward" occupied label="A · 견인"/>
          <window.TractionFrame x={4} y={22}/>
          <IMonitor x={1} y={23}/>
          <INpc x={3} y={27} kind="nurse" hair="#3C2A18" shirt="#A5D8E8"/>
          <IHotspot x={3} y={23} kind="quest" label="견인 추·줄 사정"/>
          {/* Bed B — 인공관절 후 CPM */}
          <IBed x={9} y={23} variant="ward" occupied label="B · TKA"/>
          <window.CPMMachine x={11} y={26}/>
          <IIV x={8} y={23}/>
          <IHotspot x={9} y={23} kind="info" label="CPM 각도 확인"/>
          {/* Bed C — 구획증후군 의심 (위급) */}
          <IBed x={17} y={23} variant="ward" occupied label="C · 구획증후군"/>
          <W.FallRiskSign x={20} y={22}/>
          <INpc x={20} y={26} kind="nurse" hair="#3C2A18" shirt="#A5D8E8"/>
          <IHotspot x={17} y={23} kind="urgent" label="CMS 사정 (5P)"/>
          {/* Bed D — 석고 붕대 환자 */}
          <IBed x={24} y={23} variant="ward" occupied label="D · 석고"/>
          <IChair x={21} y={25} color="#FED7AA" facing="left"/>
          <IHotspot x={24} y={23} kind="info" label="석고 부종 사정"/>
          {/* curtains splitting the bays */}
          <ICurtain x={8}  y={22} w={1} h={11} color="#BFE3EE"/>
          <ICurtain x={16} y={22} w={1} h={11} color="#BFE3EE"/>
          <ICurtain x={23} y={22} w={1} h={11} color="#BFE3EE"/>
          <INpc x={3} y={31} kind="doctor" hair="#1F2937"/>

          {/* ════════════════ 1인용 고령 고관절 골절 병실 (hip, y36-50) ════════════════ */}
          <BayLabel x={1} y={36} text="GERIATRIC HIP FRACTURE · THR" highlight/>
          {/* elderly patient flat in bed with an abduction pillow between the legs */}
          <IBed x={4} y={38} variant="ward" occupied label="THR · 절대안정"/>
          <window.AbductionPillow x={6} y={40}/>
          <IMonitor x={3} y={38} beep/>
          <IIV x={9} y={38}/>
          {/* bed alarm mat at the bedside */}
          <window.BedAlarm x={4} y={42}/>
          {/* elevated toilet + safety guard near the wall */}
          <window.ElevatedToiletGuard x={24} y={37}/>
          {/* nurse educating dislocation precautions + worried daughter */}
          <INpc x={8} y={41} kind="nurse"  hair="#3C2A18" shirt="#A5D8E8"/>
          <IHotspot x={5} y={38} kind="quest" label="탈구 방지 교육"/>
          <INpc x={11} y={41} kind="parent" hair="#9A6B3F"/>
          <IChair x={11} y={43} color="#FED7AA" facing="left"/>
          <window.Sofa x={20} y={45} w={3} color="#9CB4C8"/>
          <IPlant x={25} y={48}/>
        </>
      )}
    />
  );
}

// ─── CMSChart — 신경혈관(CMS) 사정 기록판 (벽) ─────────────────────
function CMSChart({ x, y }) {
  return (
    <div style={{ position: 'absolute', left: x * ITILE, top: y * ITILE, width: ITILE * 2, height: ITILE * 1.2, filter: 'drop-shadow(2px 2px 0 rgba(0,0,0,.22))' }}>
      <svg viewBox="0 0 32 18" width={ITILE * 2} height={ITILE * 1.2} shapeRendering="crispEdges" preserveAspectRatio="none">
        <rect x="0" y="0" width="32" height="18" fill="#fff" stroke={IP.ink} strokeWidth=".6"/>
        <rect x="0" y="0" width="32" height="3.5" fill="#B45309"/>
        <rect x="2" y="1" width="16" height="1.6" fill="#fff"/>
        {/* CMS rows: Circulation / Motion / Sensation with check ticks */}
        {[5,8.5,12].map((ry,i) => (
          <g key={i}>
            <rect x="2" y={ry} width="3" height="2.4" fill="none" stroke={IP.ink} strokeWidth=".5"/>
            <path d={`M2.6 ${ry+1.2} L3.4 ${ry+2} L4.6 ${ry+0.4}`} fill="none" stroke="#16A34A" strokeWidth=".7"/>
            <rect x="6.5" y={ry+0.4} width={[16,13,11][i]} height="1.4" fill={IP.ink} opacity=".5"/>
          </g>
        ))}
      </svg>
    </div>
  );
}

Object.assign(window, { ScreenInteriorOrthoWard, CMSChart });
