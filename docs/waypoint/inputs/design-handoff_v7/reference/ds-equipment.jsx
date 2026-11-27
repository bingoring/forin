// ds-equipment.jsx — Medical equipment catalogs grouped by department.

// ─── ER Equipment ──────────────────────────────────────────────────
function ScreenDSEquipmentER() {
  const F = window.Forin;
  return (
    <DSPage
      title="ER Equipment"
      subtitle="응급실에서 사용하는 모든 2.5D 의료 장비 컴포넌트."
      accent="#FCA5A5"
    >
      <DSSection title="◆ Patient transport">
        <DSGrid minItem={150}>
          <DSCard name="Gurney · empty" code='<Forin.Gurney/>' previewH={160}>
            <DSTileFrame width={70} height={140}><F.Gurney x={0} y={0}/></DSTileFrame>
          </DSCard>
          <DSCard name="Gurney · occupied" code='occupied' previewH={160}>
            <DSTileFrame width={70} height={140}><F.Gurney x={0} y={0} occupied/></DSTileFrame>
          </DSCard>
          <DSCard name="Wheelchair" code='<Forin.Wheelchair/>' previewH={160}>
            <DSTileFrame width={48} height={120}><F.Wheelchair x={0} y={0}/></DSTileFrame>
          </DSCard>
        </DSGrid>
      </DSSection>

      <DSSection title="◆ Emergency devices">
        <DSGrid minItem={140}>
          <DSCard name="Defib" sub="제세동기" code='<Forin.Defib/>' previewH={150}>
            <DSTileFrame width={40} height={120}><F.Defib x={0} y={0}/></DSTileFrame>
          </DSCard>
          <DSCard name="EKG cart" sub="심전도" code='<Forin.EKG/>' previewH={150}>
            <DSTileFrame width={40} height={120}><F.EKG x={0} y={0}/></DSTileFrame>
          </DSCard>
          <DSCard name="OxygenTank" sub="산소 통" previewH={140}>
            <DSTileFrame width={32} height={80}><F.OxygenTank x={0} y={0}/></DSTileFrame>
          </DSCard>
          <DSCard name="BP Cuff" sub="혈압계 (벽걸이)" previewH={120}>
            <DSTileFrame width={48} height={80}><F.BPCuff x={0} y={0}/></DSTileFrame>
          </DSCard>
          <DSCard name="Suction" sub="흡인기" previewH={120}>
            <DSTileFrame width={48} height={80}><F.SuctionUnit x={0} y={0}/></DSTileFrame>
          </DSCard>
        </DSGrid>
      </DSSection>

      <DSSection title="◆ Hygiene & consumables">
        <DSGrid minItem={140}>
          <DSCard name="Glove Dispenser" code='<Forin.GloveDispenser/>'>
            <DSTileFrame width={40} height={60}><F.GloveDispenser x={0} y={0}/></DSTileFrame>
          </DSCard>
          <DSCard name="Sharps Container" sub="바이오해저드">
            <DSTileFrame width={40} height={60}><F.SharpsContainer x={0} y={0}/></DSTileFrame>
          </DSCard>
          <DSCard name="Hand Sanitizer">
            <DSTileFrame width={32} height={60}><F.HandSanitizer x={0} y={0}/></DSTileFrame>
          </DSCard>
          <DSCard name="Scale" sub="체중계">
            <DSTileFrame width={40} height={60}><F.Scale x={0} y={0}/></DSTileFrame>
          </DSCard>
        </DSGrid>
      </DSSection>

      <DSSection title="◆ Workstations">
        <DSGrid minItem={150}>
          <DSCard name="CompCart" sub="컴퓨터 카트 (모니터+키보드+서랍)" previewH={150}>
            <DSTileFrame width={40} height={120}><F.CompCart x={0} y={0}/></DSTileFrame>
          </DSCard>
          <DSCard name="Whiteboard" sub="화이트보드 (w 가변)" previewH={120}>
            <DSTileFrame width={150} height={50}><F.Whiteboard x={0} y={0} w={3}/></DSTileFrame>
          </DSCard>
          <DSCard name="XRay Machine" sub="ER 후방 X-ray 룸" previewH={150}>
            <DSTileFrame width={80} height={120}><F.XrayMachine x={0} y={0}/></DSTileFrame>
          </DSCard>
        </DSGrid>
      </DSSection>

      <DSSection title="◆ Sinks" hint="Sink (= OR scrub, 마지막 정의 우선) — ER에서도 동일 컴포넌트 재사용">
        <DSGrid minItem={150}>
          <DSCard name="Sink · scrub" sub="OR 표준 (수도꼭지+세면대+무릎패달)" code='<Forin.Sink/>' previewH={150}>
            <DSTileFrame width={64} height={100}><F.Sink x={0} y={0.4}/></DSTileFrame>
          </DSCard>
        </DSGrid>
      </DSSection>
    </DSPage>
  );
}

// ─── OR Equipment ──────────────────────────────────────────────────
function ScreenDSEquipmentOR() {
  const F = window.Forin;
  return (
    <DSPage
      title="OR Equipment"
      subtitle="수술실 전용 장비. 무균 환경 색상(블루 톤)으로 통일."
      accent="#DDD6FE"
    >
      <DSSection title="◆ Anesthesia & instruments">
        <DSGrid minItem={150}>
          <DSCard name="Anesthesia Machine" sub="마취기 (가스 통 포함)" previewH={170}>
            <DSTileFrame width={48} height={150}><F.AnesthesiaMachine x={0} y={1.4}/></DSTileFrame>
          </DSCard>
          <DSCard name="Instrument Tray" sub="Mayo stand + 멸균 드레이프 + 도구" previewH={150}>
            <DSTileFrame width={80} height={100}><F.InstrumentTray x={0} y={0.4}/></DSTileFrame>
          </DSCard>
        </DSGrid>
      </DSSection>

      <DSSection title="◆ Surgical lighting">
        <DSGrid minItem={250}>
          <DSCard name="Surgical Light" sub="천장형 돔 + 멀티 벌브" code='<Forin.SurgicalLight/>' previewH={120}>
            <DSTileFrame width={140} height={70} padTop={20}><F.SurgicalLight x={1} y={0}/></DSTileFrame>
          </DSCard>
        </DSGrid>
      </DSSection>

      <DSSection title="◆ Scrub station">
        <DSGrid minItem={150}>
          <DSCard name="Sink · OR scrub" sub="수도꼭지+세면대+무릎패달" previewH={150}>
            <DSTileFrame width={64} height={100}><F.SinkOR x={0} y={0.4}/></DSTileFrame>
          </DSCard>
        </DSGrid>
      </DSSection>

      <DSSection title="◆ Status display">
        <DSGrid minItem={300}>
          <DSCard name="Status Board" sub="시간 / 경과 / 다음 환자" code='<Forin.StatusBoard/>' previewH={80}>
            <DSTileFrame width={200} height={50}><F.StatusBoard x={0} y={0}/></DSTileFrame>
          </DSCard>
        </DSGrid>
      </DSSection>
    </DSPage>
  );
}

// ─── ICU Equipment ─────────────────────────────────────────────────
function ScreenDSEquipmentICU() {
  const F = window.Forin;
  return (
    <DSPage
      title="ICU Equipment"
      subtitle="중환자실 전용. 인공호흡기, 중앙 모니터링, 응급 카트 등."
      accent="#BAE6FD"
    >
      <DSSection title="◆ Life support">
        <DSGrid minItem={150}>
          <DSCard name="Ventilator" sub="인공호흡기" code='<Forin.Ventilator/>' previewH={130}>
            <DSTileFrame width={40} height={90}><F.Ventilator x={0} y={0.4}/></DSTileFrame>
          </DSCard>
          <DSCard name="Crash Cart" sub="응급 카트 (세동기 상단)" code='<Forin.CrashCart/>' previewH={130}>
            <DSTileFrame width={40} height={90}><F.CrashCart x={0} y={0.4}/></DSTileFrame>
          </DSCard>
          <DSCard name="Pyxis Machine" sub="자동 약장" code='<Forin.PyxisMachine/>' previewH={140}>
            <DSTileFrame width={64} height={100}><F.PyxisMachine x={0} y={0}/></DSTileFrame>
          </DSCard>
        </DSGrid>
      </DSSection>

      <DSSection title="◆ Central monitoring">
        <DSGrid minItem={320}>
          <DSCard name="Bank of Monitors" sub="중앙 모니터링 (R1-R4 환자)" code='<Forin.BankOfMonitors/>' previewH={90}>
            <DSTileFrame width={220} height={50}><F.BankOfMonitors x={0} y={0}/></DSTileFrame>
          </DSCard>
        </DSGrid>
      </DSSection>

      <DSSection title="◆ Break room">
        <DSGrid minItem={140}>
          <DSCard name="Coffee Machine" sub="휴게실 커피머신 (김 모션 포함)" previewH={120}>
            <DSTileFrame width={32} height={70}><F.CoffeeMachine x={0} y={0}/></DSTileFrame>
          </DSCard>
        </DSGrid>
      </DSSection>
    </DSPage>
  );
}

// ─── Peds Equipment ────────────────────────────────────────────────
function ScreenDSEquipmentPeds() {
  const F = window.Forin;
  return (
    <DSPage
      title="Pediatrics Equipment"
      subtitle="소아과 전용 — 따뜻한 색감, 놀이방 데코, 백신 냉장고."
      accent="#FDE68A"
    >
      <DSSection title="◆ Wards">
        <DSGrid minItem={140}>
          <DSCard name="PedsBed · empty" previewH={150}><DSTileFrame width={64} height={130}><F.PedsBed x={0} y={0} stuffie="🐰"/></DSTileFrame></DSCard>
          <DSCard name="PedsBed · occupied" previewH={150}><DSTileFrame width={64} height={130}><F.PedsBed x={0} y={0} occupied stuffie="🐻"/></DSTileFrame></DSCard>
          <DSCard name="Fridge · 백신" code='<Forin.FridgePeds/>' previewH={140}><DSTileFrame width={40} height={90}><F.FridgePeds x={0} y={0}/></DSTileFrame></DSCard>
        </DSGrid>
      </DSSection>

      <DSSection title="◆ Playroom decor">
        <DSGrid minItem={140}>
          <DSCard name="Balloon · red" code='c="#EF4444"' previewH={100}><DSTileFrame width={32} height={50}><F.Balloon x={0} y={0.5} c="#EF4444"/></DSTileFrame></DSCard>
          <DSCard name="Balloon · yellow" previewH={100}><DSTileFrame width={32} height={50}><F.Balloon x={0} y={0.5} c="#FACC15"/></DSTileFrame></DSCard>
          <DSCard name="Balloon · blue" previewH={100}><DSTileFrame width={32} height={50}><F.Balloon x={0} y={0.5} c="#3B82F6"/></DSTileFrame></DSCard>
          <DSCard name="Mural" sub="벽 그림 (sun + cloud + mountain)" previewH={120}><DSTileFrame width={100} height={50}><F.Mural x={0} y={0}/></DSTileFrame></DSCard>
          <DSCard name="Toy Chest" sub="장난감 상자" previewH={120}><DSTileFrame width={48} height={40}><F.ToyChest x={0} y={0}/></DSTileFrame></DSCard>
          <DSCard name="Blocks" sub="컬러 블록" previewH={100}><DSTileFrame width={32} height={30}><F.Blocks x={0} y={0}/></DSTileFrame></DSCard>
          <DSCard name="Small Slide" sub="놀이 미끄럼틀" previewH={120}><DSTileFrame width={48} height={48}><F.SmallSlide x={0} y={0}/></DSTileFrame></DSCard>
          <DSCard name="Rocking Horse" sub="흔들의자 (애니메이션)" previewH={120}><DSTileFrame width={48} height={48}><F.RockingHorse x={0} y={0}/></DSTileFrame></DSCard>
        </DSGrid>
      </DSSection>
    </DSPage>
  );
}

// ─── Pharma Equipment ──────────────────────────────────────────────
function ScreenDSEquipmentPharma() {
  const F = window.Forin;
  return (
    <DSPage
      title="Pharmacy Equipment"
      subtitle="약국 — 카운터, 키오스크, 무균 후드, 통제약물 금고, 라벨 프린터."
      accent="#A7F3D0"
    >
      <DSSection title="◆ Public counter">
        <DSGrid minItem={220}>
          <DSCard name="Pharma Counter" code='w={5}' previewH={100}>
            <DSTileFrame width={180} height={50}><F.PharmaCounter x={0} y={0} w={5}/></DSTileFrame>
          </DSCard>
          <DSCard name="Counter Sign" sub="3 종 · 떠다니는 라벨" previewH={100}>
            <DSTileFrame width={180} height={50}>
              <F.CounterSign x={0} y={0} text="DROP-OFF" color="#FACC15"/>
              <F.CounterSign x={2.5} y={0} text="PICKUP" color="#10B981"/>
              <F.CounterSign x={5} y={0} text="CONSULT" color="#3B82F6"/>
            </DSTileFrame>
          </DSCard>
          <DSCard name="Kiosk" sub="자가 픽업 키오스크" code='<Forin.Kiosk/>' previewH={140}>
            <DSTileFrame width={32} height={80}><F.Kiosk x={0} y={0}/></DSTileFrame>
          </DSCard>
          <DSCard name="Queue Rope" sub="대기줄 가이드" previewH={80}>
            <DSTileFrame width={64} height={30}><F.QueueRope x={0} y={0}/></DSTileFrame>
          </DSCard>
        </DSGrid>
      </DSSection>

      <DSSection title="◆ Dispensing (back area)">
        <DSGrid minItem={160}>
          <DSCard name="Shelf Label" sub="A · ANTIBIOTICS" code='<Forin.ShelfLabel/>' previewH={70}>
            <DSTileFrame width={120} height={30}>
              <F.ShelfLabel x={0} y={0} text="A · ANTIBIOTICS"/>
            </DSTileFrame>
          </DSCard>
          <DSCard name="Shelf Label · warn" sub="통제약물" code='warn' previewH={70}>
            <DSTileFrame width={120} height={30}>
              <F.ShelfLabel x={0} y={0} text="F · CONTROLLED" warn/>
            </DSTileFrame>
          </DSCard>
          <DSCard name="Counting Bench" sub="알약 카운팅" previewH={120}>
            <DSTileFrame width={120} height={50}><F.CountingBench x={0} y={0}/></DSTileFrame>
          </DSCard>
          <DSCard name="CSSafe" sub="통제약물 금고 (지문+키패드)" previewH={120}>
            <DSTileFrame width={48} height={50}><F.CSSafe x={0} y={0}/></DSTileFrame>
          </DSCard>
          <DSCard name="Med Cart" sub="시간대별 약 카트" previewH={120}>
            <DSTileFrame width={40} height={50}><F.MedCart x={0} y={0}/></DSTileFrame>
          </DSCard>
          <DSCard name="Fridge · 약품" code='<Forin.FridgePharma/>' previewH={120}>
            <DSTileFrame width={32} height={50}><F.FridgePharma x={0} y={0}/></DSTileFrame>
          </DSCard>
        </DSGrid>
      </DSSection>

      <DSSection title="◆ IV admixture clean room">
        <DSGrid minItem={200}>
          <DSCard name="Laminar Hood" sub="HEPA + 글래스샤시 + 바이얼" previewH={140}>
            <DSTileFrame width={90} height={70}><F.LaminarHood x={0} y={0}/></DSTileFrame>
          </DSCard>
          <DSCard name="Centrifuge" sub="원심분리기 (회전 모션)" previewH={120}>
            <DSTileFrame width={40} height={50}><F.Centrifuge x={0} y={0}/></DSTileFrame>
          </DSCard>
          <DSCard name="Print Label" sub="라벨 프린터" previewH={120}>
            <DSTileFrame width={48} height={50}><F.PrintLabel x={0} y={0}/></DSTileFrame>
          </DSCard>
          <DSCard name="Wall Phone" sub="STAT 콜 (애니메이션)" previewH={120}>
            <DSTileFrame width={32} height={50}><F.WallPhone x={0} y={0} ringing/></DSTileFrame>
          </DSCard>
        </DSGrid>
      </DSSection>

      <DSSection title="◆ Floor markings">
        <DSGrid minItem={300}>
          <DSCard name="Floor Tape" sub="멸균 경계 / 안전 라인" previewH={50}>
            <DSTileFrame width={240} height={20}>
              <F.FloorTape x={0} y={0} w={15} text="━━ STERILE LINE ━ NO STREET CLOTHES ━━"/>
            </DSTileFrame>
          </DSCard>
        </DSGrid>
      </DSSection>
    </DSPage>
  );
}

Object.assign(window, {
  ScreenDSEquipmentER, ScreenDSEquipmentOR, ScreenDSEquipmentICU,
  ScreenDSEquipmentPeds, ScreenDSEquipmentPharma, ScreenDSEquipmentClinics,
});

// ─── Clinic Equipment (Internal/Surgery/Ortho/Derm) ───────────────
function ScreenDSEquipmentClinics() {
  const F = window.Forin;
  return (
    <DSPage
      title="Clinic Equipment"
      subtitle="외래 진료과(내과·외과·정형외과·피부과)의 시그니처 장비. 공통 가구(IBed·ICabinet·IMonitor 등)는 Furniture 참고."
      accent="#A7E3D0"
    >
      <DSSection title="◆ Reception" hint="외래 공통 모던 카운터 (부서 색 tone)">
        <DSGrid minItem={260}>
          <DSCard name="ClinicReception · 내과" sub="긴 카운터 + 흰상판 + 나무하부 + 사인밴드 + 꽃병" previewH={110}>
            <DSTileFrame width={200} height={60}><F.ClinicReception x={0} y={0.4} w={6} tone="#0E7490" label="접수"/></DSTileFrame>
          </DSCard>
          <DSCard name="ClinicReception · 피부과" sub="tone prop으로 부서 색 반영" previewH={110}>
            <DSTileFrame width={200} height={60}><F.ClinicReception x={0} y={0.4} w={6} tone="#DB2777" label="접수"/></DSTileFrame>
          </DSCard>
        </DSGrid>
      </DSSection>

      <DSSection title="◆ Internal Medicine · 내과">
        <DSGrid minItem={150}>
          <DSCard name="Ultrasound Cart" sub="초음파 카트" previewH={150}>
            <DSTileFrame width={48} height={120}><F.UltrasoundCart x={0} y={0.4}/></DSTileFrame>
          </DSCard>
          <DSCard name="Exam Stool" sub="진료용 스툴" previewH={90}>
            <DSTileFrame width={32} height={40}><F.ExamStool x={0} y={0}/></DSTileFrame>
          </DSCard>
        </DSGrid>
      </DSSection>

      <DSSection title="◆ Orthopedics · 정형외과">
        <DSGrid minItem={150}>
          <DSCard name="X-ray Viewbox" sub="필름 판독 라이트박스" previewH={110}>
            <DSTileFrame width={80} height={60}><F.XrayViewbox x={0} y={0}/></DSTileFrame>
          </DSCard>
          <DSCard name="Cast Cart" sub="깁스·석고 카트" previewH={120}>
            <DSTileFrame width={48} height={60}><F.CastCart x={0} y={0}/></DSTileFrame>
          </DSCard>
          <DSCard name="Crutches" sub="목발" previewH={130}>
            <DSTileFrame width={32} height={80}><F.Crutches x={0} y={0.4}/></DSTileFrame>
          </DSCard>
          <DSCard name="Bone Model" sub="해부 모형" previewH={130}>
            <DSTileFrame width={32} height={80}><F.BoneModel x={0} y={0.5}/></DSTileFrame>
          </DSCard>
        </DSGrid>
      </DSSection>

      <DSSection title="◆ Dermatology · 피부과">
        <DSGrid minItem={150}>
          <DSCard name="Derm Lamp" sub="확대 검사 램프" previewH={140}>
            <DSTileFrame width={48} height={90}><F.DermLamp x={0} y={0.5}/></DSTileFrame>
          </DSCard>
          <DSCard name="Laser Unit" sub="레이저·광치료기" previewH={150}>
            <DSTileFrame width={40} height={100}><F.LaserUnit x={0} y={0.4}/></DSTileFrame>
          </DSCard>
          <DSCard name="Skincare Shelf" sub="제품·샘플 선반" previewH={90}>
            <DSTileFrame width={120} height={40}><F.SkincareShelf x={0} y={0} w={3}/></DSTileFrame>
          </DSCard>
        </DSGrid>
      </DSSection>

      <DSSection title="◆ General Surgery · 외과" hint="공통 OR 장비 재사용 (SurgicalLight·InstrumentTray·IBed or-variant)">
        <DSGrid minItem={150}>
          <DSCard name="Surgical Light" sub="OR Equipment 재사용" previewH={110}>
            <DSTileFrame width={140} height={70} padTop={20}><F.SurgicalLight x={1} y={0}/></DSTileFrame>
          </DSCard>
          <DSCard name="Instrument Tray" sub="OR Equipment 재사용" previewH={130}>
            <DSTileFrame width={80} height={90}><F.InstrumentTray x={0} y={0.4}/></DSTileFrame>
          </DSCard>
        </DSGrid>
      </DSSection>

      <DSSection title="◆ 진료과별 차별화" hint="공통 레이아웃 + waitingDecor/examDecor 훅으로 개성 부여">
        <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 12, color: F.tokens.ink, lineHeight: 1.7 }}>
          • <b>내과</b> — 자가 혈압측정대 + 안내판, 진료실 혈압계 · sage 톤<br/>
          • <b>외과</b> — 거니 + 멸균 캐비닛 + 손소독제, 진료실 멸균 수납 · steel 톤<br/>
          • <b>정형외과</b> — X-ray 뷰박스 + 휠체어 + 목발, 진료실 골격모형 · bone 톤<br/>
          • <b>피부과</b> — 스킨케어 선반 + 화분, 진료실 더마램프 · rose 톤
        </div>
      </DSSection>

      <DSSection title="◆ ClinicInterior 엔진" hint="데이터 기반 외래 진료과 생성기">
        <pre style={{ background: F.tokens.ink, color: '#A7F3D0', padding: 14, fontSize: 11, lineHeight: 1.5, fontFamily: '"DungGeunMo",monospace', border: 0, overflow: 'auto', whiteSpace: 'pre-wrap' }}>
{`// 새 외래 진료과 추가 = config 한 개:
<ClinicInterior cfg={{
  label, code, deptCode, deptColor,
  floor,            // interior-shared IP에 floor 색 추가
  accent, chairColor, cabinet,
  examLabels: ['진료실 1','진료실 2','...'],
  procedureLabel, procedureIcon, procedureSub,
  mission, missionUrgent,
  renderProcedure: () => ( /* 부서별 장비 배치 */ ),
}}/>
// 표준 레이아웃: 접수·대기 → 진료실 3 → 처치실(부서별)`}
        </pre>
      </DSSection>
    </DSPage>
  );
}
