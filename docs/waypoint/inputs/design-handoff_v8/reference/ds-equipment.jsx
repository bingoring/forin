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

      <DSSection title="◆ 접수 · 트리아지 · 대기" hint="신규 — 입구/원무과/KTAS 트리아지/대기실 구성 오브젝트">
        <DSGrid minItem={140}>
          <DSCard name="TicketDispenser" sub="번호표 발행기" code='<Forin.TicketDispenser/>' previewH={150}>
            <DSTileFrame width={40} height={110}><F.TicketDispenser x={0} y={0.6}/></DSTileFrame>
          </DSCard>
          <DSCard name="BrochureRack" sub="안내 브로셔 거치대" previewH={140}>
            <DSTileFrame width={48} height={100}><F.BrochureRack x={0} y={0.3}/></DSTileFrame>
          </DSCard>
          <DSCard name="DeskPhone" sub="전화기" previewH={110}>
            <DSTileFrame width={40} height={50}><F.DeskPhone x={0} y={0}/></DSTileFrame>
          </DSCard>
          <DSCard name="VitalsCart" sub="활력징후 카트 (SpO2+체온+모니터)" previewH={170}>
            <DSTileFrame width={48} height={150}><F.VitalsCart x={0} y={0.5}/></DSTileFrame>
          </DSCard>
          <DSCard name="WaitingDisplay" sub="대기순서 안내 모니터 (벽)" previewH={90}>
            <DSTileFrame width={120} height={50}><F.WaitingDisplay x={0} y={0} w={2}/></DSTileFrame>
          </DSCard>
          <DSCard name="WaterCooler" sub="정수기" previewH={150}>
            <DSTileFrame width={40} height={110}><F.WaterCooler x={0} y={0.6}/></DSTileFrame>
          </DSCard>
          <DSCard name="TriageLine" sub="중증도 안내 바닥선 (R/Y/G)" previewH={80}>
            <DSTileFrame width={150} height={30}>
              <F.TriageLine x={0} y={0} w={3} color="#EF4444"/>
              <F.TriageLine x={3} y={0} w={3} color="#FACC15"/>
              <F.TriageLine x={6} y={0} w={3} color="#16A34A"/>
            </DSTileFrame>
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
          <DSCard name="IVPump" sub="인퓨전 펌프 IV 폴대 (신규)" code='<Forin.IVPump/>' previewH={180}>
            <DSTileFrame width={48} height={160}><F.IVPump x={0} y={1}/></DSTileFrame>
          </DSCard>
        </DSGrid>
      </DSSection>

      <DSSection title="◆ 소생 · 격리 · 처치" hint="신규 — 소생실/음압격리실/소처치실 전용. CrashCart·Ventilator는 ICU, SurgicalLight·InstrumentTray는 OR 재사용.">
        <DSGrid minItem={140}>
          <DSCard name="WasteBin · 일반" sub="의료폐기물 (general)" code='<Forin.WasteBin/>' previewH={120}>
            <DSTileFrame width={40} height={70}><F.WasteBin x={0} y={0}/></DSTileFrame>
          </DSCard>
          <DSCard name="WasteBin · 감염성" sub='tone="infectious" (노란 ☣)' previewH={120}>
            <DSTileFrame width={40} height={70}><F.WasteBin x={0} y={0} tone="infectious"/></DSTileFrame>
          </DSCard>
          <DSCard name="PressureGauge" sub="음압 수치 표시기 (벽)" previewH={100}>
            <DSTileFrame width={48} height={60}><F.PressureGauge x={0} y={0}/></DSTileFrame>
          </DSCard>
          <DSCard name="PPEStand" sub="레벨D 방호복 거치대 + 마스크 박스" previewH={170}>
            <DSTileFrame width={48} height={150}><F.PPEStand x={0} y={0.5}/></DSTileFrame>
          </DSCard>
          <DSCard name="DressingCart" sub="드레싱 카트 (베타딘·거즈·멸균장갑)" previewH={140}>
            <DSTileFrame width={64} height={110}><F.DressingCart x={0} y={0.3}/></DSTileFrame>
          </DSCard>
        </DSGrid>
      </DSSection>

      <DSSection title="◆ 진료실 (내과 · 외상/정형)" hint="신규 벽부착 진단/교육 오브젝트. 진찰베드=IBed, X-ray뷰박스·깁스카트=Clinic 재사용.">
        <DSGrid minItem={140}>
          <DSCard name="Otoscope" sub="벽걸이 이경 진단세트" previewH={110}>
            <DSTileFrame width={48} height={70}><F.Otoscope x={0} y={0}/></DSTileFrame>
          </DSCard>
          <DSCard name="AnatomyPoster" sub="신체 구조도 포스터 (벽)" previewH={130}>
            <DSTileFrame width={48} height={100}><F.AnatomyPoster x={0} y={0}/></DSTileFrame>
          </DSCard>
        </DSGrid>
      </DSSection>

      <DSSection title="◆ 보안 · 로비 (신규)" hint="공공 로비 정문 보안검색 + 안내. 블루프린트 추가 오브젝트.">
        <DSGrid minItem={150}>
          <DSCard name="SecurityScanner" sub="X-ray 보안 검색대 (벨트라인)" code='<Forin.SecurityScanner/>' previewH={130}>
            <DSTileFrame width={90} height={90}><F.SecurityScanner x={0} y={0.5}/></DSTileFrame>
          </DSCard>
          <DSCard name="MetalDetector" sub="금속 탐지 게이트 (경보 점멸)" code='<Forin.MetalDetector/>' previewH={170}>
            <DSTileFrame width={70} height={150}><F.MetalDetector x={0} y={1.2}/></DSTileFrame>
          </DSCard>
          <DSCard name="BarcodePrinter" sub="접수 바코드/라벨 프린터" previewH={90}>
            <DSTileFrame width={40} height={50}><F.BarcodePrinter x={0} y={0}/></DSTileFrame>
          </DSCard>
          <DSCard name="WallTV" sub="대기실 벽걸이 TV (뉴스)" previewH={90}>
            <DSTileFrame width={120} height={50}><F.WallTV x={0} y={0} w={2}/></DSTileFrame>
          </DSCard>
          <DSCard name="IThreshold · 가로" sub="구역 경계 어두운 통로 (문 없음)" code='<Forin.IThreshold/>' previewH={70}>
            <DSTileFrame width={90} height={36}><F.IThreshold x={0} y={0} w={3} h={1}/></DSTileFrame>
          </DSCard>
          <DSCard name="IThreshold · 세로" sub="h>w 면 세로 통로" previewH={90}>
            <DSTileFrame width={36} height={70}><F.IThreshold x={0} y={0} w={1} h={3}/></DSTileFrame>
          </DSCard>
        </DSGrid>
      </DSSection>

      <DSSection title="◆ 중앙 허브 약품 (신규)" hint="너스 스테이션 뒤 자동 약품 디스펜서실. 허브 데스크는 Furniture의 NurseStationDesk/NurseDeskI 참고.">
        <DSGrid minItem={150}>
          <DSCard name="MedFridge" sub="의약품 냉장고 (유리문 + 약병/백신)" code='<Forin.MedFridge/>' previewH={160}>
            <DSTileFrame width={48} height={140}><F.MedFridge x={0} y={0.4}/></DSTileFrame>
          </DSCard>
        </DSGrid>
      </DSSection>

      <DSSection title="◆ 정신과 안전 격리실 (신규)" hint="자해 방지 미니멀 구성. 바닥 고정 베드 + 보호 CCTV.">
        <DSGrid minItem={150}>
          <DSCard name="BoltedBed" sub="바닥 고정 매트리스 베드 (레일·바퀴 없음)" code='<Forin.BoltedBed/>' previewH={170}>
            <DSTileFrame width={70} height={150}><F.BoltedBed x={0} y={0} occupied/></DSTileFrame>
          </DSCard>
          <DSCard name="CCTVCamera" sub="보호 커버 천장 CCTV (REC LED)" code='<Forin.CCTVCamera/>' previewH={90}>
            <DSTileFrame width={48} height={50}><F.CCTVCamera x={0} y={0}/></DSTileFrame>
          </DSCard>
        </DSGrid>
      </DSSection>

      <DSSection title="◆ 가족 상담 · 임종실 (신규)" hint="따뜻하고 차분한 공간 — 패브릭 소파, 티 테이블, 조명, 풍경화.">
        <DSGrid minItem={150}>
          <DSCard name="Sofa" sub="패브릭 소파 (w·color 가변)" code='<Forin.Sofa/>' previewH={120}>
            <DSTileFrame width={110} height={90}><F.Sofa x={0} y={0.4} w={3}/></DSTileFrame>
          </DSCard>
          <DSCard name="CoffeeTable" sub="낮은 나무 티 테이블" previewH={90}>
            <DSTileFrame width={90} height={50}><F.CoffeeTable x={0} y={0}/></DSTileFrame>
          </DSCard>
          <DSCard name="TissueBox" sub="티슈 박스" previewH={70}>
            <DSTileFrame width={40} height={40}><F.TissueBox x={0} y={0}/></DSTileFrame>
          </DSCard>
          <DSCard name="FloorLamp" sub="스탠드 조명 (따뜻한 빛)" previewH={160}>
            <DSTileFrame width={40} height={140}><F.FloorLamp x={0} y={0.7}/></DSTileFrame>
          </DSCard>
          <DSCard name="FramedPicture" sub="잔잔한 풍경화 액자 (벽)" previewH={90}>
            <DSTileFrame width={110} height={50}><F.FramedPicture x={0} y={0} w={3}/></DSTileFrame>
          </DSCard>
        </DSGrid>
      </DSSection>

      <DSSection title="◆ 제염실 (신규)" hint="외부 연결 관통형 제염실. 산업용 샤워 + 배수 + 화학 드럼.">
        <DSGrid minItem={150}>
          <DSCard name="DeconShower" sub="산업용 고압 제염 샤워기" code='<Forin.DeconShower/>' previewH={160}>
            <DSTileFrame width={48} height={140}><F.DeconShower x={0} y={0.5}/></DSTileFrame>
          </DSCard>
          <DSCard name="FloorDrain" sub="대형 바닥 배수 그릴 (오염수 수집)" previewH={80}>
            <DSTileFrame width={90} height={50}><F.FloorDrain x={0} y={0} w={2}/></DSTileFrame>
          </DSCard>
          <DSCard name="ChemDrum · 세척액" sub="화학물질 세척액 통" code='<Forin.ChemDrum/>' previewH={130}>
            <DSTileFrame width={40} height={100}><F.ChemDrum x={0} y={0.4}/></DSTileFrame>
          </DSCard>
          <DSCard name="ChemDrum · 폐기" sub='tone="waste" (☣ 폐기 드럼)' previewH={130}>
            <DSTileFrame width={40} height={100}><F.ChemDrum x={0} y={0.4} tone="waste"/></DSTileFrame>
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
          <DSCard name="ChartBinder" sub="인계장 서류첩 (링바인더 3단)" code='<Forin.ChartBinder/>' previewH={90}>
            <DSTileFrame width={40} height={50}><F.ChartBinder x={0} y={0}/></DSTileFrame>
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

      <DSSection title="◆ 제한구역 수술실 (신규)" hint="블루프린트 추가 — 제1/제2 수술실 전용 장비.">
        <DSGrid minItem={150}>
          <DSCard name="ORBoomMonitor" sub="천장 붐형 수술 디스플레이 (복강경 화면)" code='<Forin.ORBoomMonitor/>' previewH={120}>
            <DSTileFrame width={120} height={90}><F.ORBoomMonitor x={0} y={0.5} w={2}/></DSTileFrame>
          </DSCard>
          <DSCard name="Bovie / ESU" sub="전기소작기 (절제·지혈)" code='<Forin.Bovie/>' previewH={160}>
            <DSTileFrame width={48} height={140}><F.Bovie x={0} y={0.3}/></DSTileFrame>
          </DSCard>
          <DSCard name="KickBucket" sub="거즈 수거 양동이 (바닥)" previewH={90}>
            <DSTileFrame width={48} height={50}><F.KickBucket x={0} y={0}/></DSTileFrame>
          </DSCard>
          <DSCard name="TimeoutBoard" sub="타임아웃 보드 (환자·부위·항생제)" previewH={100}>
            <DSTileFrame width={150} height={60}><F.TimeoutBoard x={0} y={0} w={3}/></DSTileFrame>
          </DSCard>
          <DSCard name="CArm" sub="이동형 C-arm 영상장비" code='<Forin.CArm/>' previewH={170}>
            <DSTileFrame width={90} height={150}><F.CArm x={0} y={0.6}/></DSTileFrame>
          </DSCard>
        </DSGrid>
      </DSSection>

      <DSSection title="◆ 복강경·로봇 수술 (신규)" hint="제2수술실 (Lap/Robotic).">
        <DSGrid minItem={150}>
          <DSCard name="RoboticConsole" sub="로봇 수술 제어 콘솔" code='<Forin.RoboticConsole/>' previewH={170}>
            <DSTileFrame width={90} height={150}><F.RoboticConsole x={0} y={0.5}/></DSTileFrame>
          </DSCard>
          <DSCard name="LapTower" sub="복강경 모니터 타워 (2단+광원+레코더)" code='<Forin.LapTower/>' previewH={200}>
            <DSTileFrame width={64} height={180}><F.LapTower x={0} y={1.2}/></DSTileFrame>
          </DSCard>
          <DSCard name="CO2Insufflator" sub="이산화탄소 인수플레이터" previewH={130}>
            <DSTileFrame width={48} height={100}><F.CO2Insufflator x={0} y={0}/></DSTileFrame>
          </DSCard>
        </DSGrid>
      </DSSection>

      <DSSection title="◆ 스크럽 · 준비 (신규)" hint="스크럽 스테이션 + Pre-Op 가온/동의서.">
        <DSGrid minItem={150}>
          <DSCard name="ScrubDispenser" sub="소독액(클로르헥시딘/베타딘)+솔/타월" code='<Forin.ScrubDispenser/>' previewH={130}>
            <DSTileFrame width={48} height={100}><F.ScrubDispenser x={0} y={0}/></DSTileFrame>
          </DSCard>
          <DSCard name="ScrubTimer" sub="벽면 디지털 스크럽 타이머 (5:00)" previewH={90}>
            <DSTileFrame width={48} height={50}><F.ScrubTimer x={0} y={0}/></DSTileFrame>
          </DSCard>
          <DSCard name="BairHugger" sub="환자 가온 온풍 장치 (+호스/담요)" code='<Forin.BairHugger/>' previewH={160}>
            <DSTileFrame width={70} height={140}><F.BairHugger x={0} y={0.3}/></DSTileFrame>
          </DSCard>
          <DSCard name="ConsentClipboard" sub="수술 동의서 서류판" previewH={90}>
            <DSTileFrame width={40} height={50}><F.ConsentClipboard x={0} y={0}/></DSTileFrame>
          </DSCard>
        </DSGrid>
      </DSSection>

      <DSSection title="◆ 오염 반출 (신규)" hint="Dirty Utility — 오염 기구 반출실.">
        <DSGrid minItem={150}>
          <DSCard name="SoiledCart" sub="오염 기구 밀폐 이송 카트 (감염성)" code='<Forin.SoiledCart/>' previewH={130}>
            <DSTileFrame width={64} height={100}><F.SoiledCart x={0} y={0.3}/></DSTileFrame>
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

      <DSSection title="◆ 1인실 집중 케어 (신규)" hint="블루프린트 추가 — 호흡기/신부전 A pod, 신경외과/수술후 B pod 전용 장비.">
        <DSGrid minItem={150}>
          <DSCard name="CRRTMachine" sub="지속적 신대체요법 (투석액 백 4)" code='<Forin.CRRTMachine/>' previewH={200}>
            <DSTileFrame width={80} height={180}><F.CRRTMachine x={0} y={0.9}/></DSTileFrame>
          </DSCard>
          <DSCard name="IVPumpTower" sub="6단 적층 인퓨전 펌프 (C-line)" code='<Forin.IVPumpTower/>' previewH={200}>
            <DSTileFrame width={48} height={180}><F.IVPumpTower x={0} y={1.4}/></DSTileFrame>
          </DSCard>
          <DSCard name="EVDStand" sub="체외 뇌척수액 배액 (레벨 자+배액백)" code='<Forin.EVDStand/>' previewH={180}>
            <DSTileFrame width={48} height={150}><F.EVDStand x={0} y={1.2}/></DSTileFrame>
          </DSCard>
          <DSCard name="ICPMonitor" sub="뇌압 모니터 (실시간 수치)" previewH={130}>
            <DSTileFrame width={48} height={100}><F.ICPMonitor x={0} y={0.4}/></DSTileFrame>
          </DSCard>
          <DSCard name="TTMUnit" sub="목표 체온 유지 냉각 장치" code='<Forin.TTMUnit/>' previewH={160}>
            <DSTileFrame width={70} height={140}><F.TTMUnit x={0} y={0.3}/></DSTileFrame>
          </DSCard>
          <DSCard name="FoleyBag" sub="시간당 소변량 측정 백" previewH={110}>
            <DSTileFrame width={40} height={70}><F.FoleyBag x={0} y={0}/></DSTileFrame>
          </DSCard>
        </DSGrid>
      </DSSection>

      <DSSection title="◆ 출입 통제 · 면회 (신규)" hint="ICU 메인 출입문 / 면회 대기실.">
        <DSGrid minItem={150}>
          <DSCard name="Intercom" sub="보안 인터폰 + 카메라 (벨→스테이션)" code='<Forin.Intercom/>' previewH={120}>
            <DSTileFrame width={48} height={90}><F.Intercom x={0} y={0}/></DSTileFrame>
          </DSCard>
          <DSCard name="GownBox" sub="면회객 일회용 가운 함" previewH={130}>
            <DSTileFrame width={48} height={100}><F.GownBox x={0} y={0}/></DSTileFrame>
          </DSCard>
          <DSCard name="VisitorScreen" sub="면회 안내 ('현재 면회 불가')" previewH={90}>
            <DSTileFrame width={120} height={50}><F.VisitorScreen x={0} y={0} w={2}/></DSTileFrame>
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
      <DSSection title="◆ 외래 계측 · 진료 (신규)" hint="블루프린트 추가 — 소아 외래 계측/진료 오브젝트.">
        <DSGrid minItem={150}>
          <DSCard name="BabyScale" sub="영유아 바구니형 체중계" code='<Forin.BabyScale/>' previewH={110}>
            <DSTileFrame width={70} height={70}><F.BabyScale x={0} y={0.2}/></DSTileFrame>
          </DSCard>
          <DSCard name="StadiometerScale" sub="학령기 자동 신장/체중계 (캐릭터)" code='<Forin.StadiometerScale/>' previewH={170}>
            <DSTileFrame width={48} height={150}><F.StadiometerScale x={0} y={0.9}/></DSTileFrame>
          </DSCard>
          <DSCard name="TongueDepressorJar" sub="설압자 통" previewH={90}>
            <DSTileFrame width={40} height={50}><F.TongueDepressorJar x={0} y={0}/></DSTileFrame>
          </DSCard>
          <DSCard name="StickerRoll" sub="캐릭터 보상 스티커 통" previewH={90}>
            <DSTileFrame width={40} height={50}><F.StickerRoll x={0} y={0}/></DSTileFrame>
          </DSCard>
          <DSCard name="DosingChart" sub="체중 기반 소아 투약 계산표 (벽)" previewH={90}>
            <DSTileFrame width={120} height={50}><F.DosingChart x={0} y={0} w={2}/></DSTileFrame>
          </DSCard>
        </DSGrid>
      </DSSection>

      <DSSection title="◆ 소아 병동 · 낙상방지 (신규)" hint="철제 창살 크립 + 수액 익판.">
        <DSGrid minItem={150}>
          <DSCard name="MetalCrib" sub="철제 창살 안전 크립 (핵심)" code='<Forin.MetalCrib occupied/>' previewH={170}>
            <DSTileFrame width={70} height={150}><F.MetalCrib x={0} y={0} occupied stuffie="🐻"/></DSTileFrame>
          </DSCard>
          <DSCard name="IVBoard" sub="캐릭터 수액 익판 (손등 고정)" previewH={90}>
            <DSTileFrame width={48} height={50}><F.IVBoard x={0} y={0}/></DSTileFrame>
          </DSCard>
        </DSGrid>
      </DSSection>

      <DSSection title="◆ NICU 신생아 중환자실 (신규)" hint="인큐베이터 + 광선치료 + 모유 냉장고.">
        <DSGrid minItem={150}>
          <DSCard name="Incubator" sub="인큐베이터 (온도·습도 표시)" code='<Forin.Incubator/>' previewH={150}>
            <DSTileFrame width={90} height={120}><F.Incubator x={0} y={0.3}/></DSTileFrame>
          </DSCard>
          <DSCard name="PhototherapyLamp" sub="황달 광선치료기 (청색광)" code='<Forin.PhototherapyLamp/>' previewH={90}>
            <DSTileFrame width={110} height={60}><F.PhototherapyLamp x={0} y={0.5} w={2}/></DSTileFrame>
          </DSCard>
          <DSCard name="MilkFridge" sub="모유 보관 냉장고 (네임 라벨 젖병)" code='<Forin.MilkFridge/>' previewH={160}>
            <DSTileFrame width={48} height={140}><F.MilkFridge x={0} y={0.3}/></DSTileFrame>
          </DSCard>
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

      <DSSection title="◆ 수령 창구 · 기송관 (신규)" hint="블루프린트 추가 — 간호사 수령 창구 & 기송관 허브.">
        <DSGrid minItem={150}>
          <DSCard name="PneumaticTube" sub="기송관 송수신 기기 (안내등 점멸)" code='<Forin.PneumaticTube/>' previewH={170}>
            <DSTileFrame width={64} height={150}><F.PneumaticTube x={0} y={0.4}/></DSTileFrame>
          </DSCard>
          <DSCard name="TubeCapsuleRack" sub="원통 기송관 캡슐 거치대 (6)" previewH={90}>
            <DSTileFrame width={90} height={50}><F.TubeCapsuleRack x={0} y={0}/></DSTileFrame>
          </DSCard>
          <DSCard name="ReturnBox" sub="약품 반납함" previewH={110}>
            <DSTileFrame width={48} height={80}><F.ReturnBox x={0} y={0}/></DSTileFrame>
          </DSCard>
          <DSCard name="BarcodeScanner" sub="바코드 스캐너 (레이저 Red)" previewH={90}>
            <DSTileFrame width={40} height={50}><F.BarcodeScanner x={0} y={0}/></DSTileFrame>
          </DSCard>
        </DSGrid>
      </DSSection>

      <DSSection title="◆ 일반 조제실 (신규)" hint="자동 조제기 · LASA 선반 · 마약류 금고.">
        <DSGrid minItem={150}>
          <DSCard name="ATCMachine" sub="자동 알약 조제기 (약봉지 배출)" code='<Forin.ATCMachine/>' previewH={200}>
            <DSTileFrame width={96} height={180}><F.ATCMachine x={0} y={1}/></DSTileFrame>
          </DSCard>
          <DSCard name="LASAShelf" sub="고위험/유사외형 약물 선반 (⚠ 경고)" code='<Forin.LASAShelf/>' previewH={110}>
            <DSTileFrame width={150} height={80}><F.LASAShelf x={0} y={0.5} w={3}/></DSTileFrame>
          </DSCard>
          <DSCard name="MedWallShelf" sub="흰색 약품 책장 (병·박스 빼곡, 벽면)" code='<Forin.MedWallShelf w shelves/>' previewH={120}>
            <DSTileFrame width={200} height={90}><F.MedWallShelf x={0} y={0.4} w={5} shelves={4}/></DSTileFrame>
          </DSCard>
          <DSCard name="NarcoticsVault" sub="이중 잠금 마약류 금고 (지문+자물쇠)" code='<Forin.NarcoticsVault/>' previewH={170}>
            <DSTileFrame width={90} height={150}><F.NarcoticsVault x={0} y={0.3}/></DSTileFrame>
          </DSCard>
        </DSGrid>
      </DSSection>

      <DSSection title="◆ 무균 조제실 (신규)" hint="항암/TPN 클린룸 — 생물안전작업대·차압계·유출 키트.">
        <DSGrid minItem={150}>
          <DSCard name="BSC" sub="생물안전작업대 (HEPA 배기)" code='<Forin.BSC/>' previewH={140}>
            <DSTileFrame width={96} height={90}><F.BSC x={0} y={0.3}/></DSTileFrame>
          </DSCard>
          <DSCard name="MagnehelicGauge" sub="차압계 (아날로그 다이얼)" previewH={90}>
            <DSTileFrame width={48} height={50}><F.MagnehelicGauge x={0} y={0}/></DSTileFrame>
          </DSCard>
          <DSCard name="ChemoSpillKit" sub="항암제 유출 처리 키트 (노란 가방)" previewH={90}>
            <DSTileFrame width={48} height={50}><F.ChemoSpillKit x={0} y={0}/></DSTileFrame>
          </DSCard>
          <DSCard name="TackyMat" sub="점착성 바닥 매트 (먼지 제거)" previewH={80}>
            <DSTileFrame width={110} height={50}><F.TackyMat x={0} y={0} w={2}/></DSTileFrame>
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
  ScreenDSEquipmentWard,
});

// ─── Ward Equipment (일반 내과 병동) ────────────────────────────────
function ScreenDSEquipmentWard() {
  const F = window.Forin;
  return (
    <DSPage
      title="Ward Equipment"
      subtitle="일반 내과 병동(6F) — 만성질환 케어·낙상/욕창 방지·접촉 격리·병동 유틸리티. 공통 가구(IBed·NurseStationDesk·VitalsCart 등)는 Furniture 참고."
      accent="#F3C99A"
    >
      <DSSection title="◆ 만성질환 베드사이드 (신규)" hint="4인용 일반 병실 — 호흡기·당뇨·욕창 케어.">
        <DSGrid minItem={150}>
          <DSCard name="O2Flowmeter" sub="벽면 산소 유량계 (+비강 캐뉼라)" code='<Forin.O2Flowmeter/>' previewH={140}>
            <DSTileFrame width={48} height={110}><F.O2Flowmeter x={0} y={0}/></DSTileFrame>
          </DSCard>
          <DSCard name="Nebulizer" sub="네블라이저 (흡입치료기)" code='<Forin.Nebulizer/>' previewH={120}>
            <DSTileFrame width={48} height={90}><F.Nebulizer x={0} y={0}/></DSTileFrame>
          </DSCard>
          <DSCard name="AirMattress" sub="에어 매트리스 펌프 (욕창 방지)" code='<Forin.AirMattress/>' previewH={110}>
            <DSTileFrame width={48} height={80}><F.AirMattress x={0} y={0}/></DSTileFrame>
          </DSCard>
          <DSCard name="FallRiskSign" sub="낙상 고위험 표지판" previewH={90}>
            <DSTileFrame width={48} height={50}><F.FallRiskSign x={0} y={0}/></DSTileFrame>
          </DSCard>
          <DSCard name="NPOBoard" sub="'NPO 금식' 머리맡 보드" previewH={80}>
            <DSTileFrame width={70} height={45}><F.NPOBoard x={0} y={0}/></DSTileFrame>
          </DSCard>
        </DSGrid>
      </DSSection>

      <DSSection title="◆ 접촉 격리 (신규)" hint="VRE 접촉 격리실 — 가운·장갑·전용 기기.">
        <DSGrid minItem={150}>
          <DSCard name="IsolationCart" sub="접촉 격리 카트 (노란 가운·장갑 S/M/L)" code='<Forin.IsolationCart/>' previewH={150}>
            <DSTileFrame width={70} height={120}><F.IsolationCart x={0} y={0.3}/></DSTileFrame>
          </DSCard>
          <DSCard name="DedicatedBP" sub="격리실 전용 혈압계 (반출 금지)" previewH={150}>
            <DSTileFrame width={48} height={120}><F.DedicatedBP x={0} y={0.8}/></DSTileFrame>
          </DSCard>
        </DSGrid>
      </DSSection>

      <DSSection title="◆ 병동 유틸리티 (신규)" hint="클린/더티 유틸리티 · 린넨/배식.">
        <DSGrid minItem={150}>
          <DSCard name="SupplyBasketShelf" sub="라벨 바구니 물품 선반" code='<Forin.SupplyBasketShelf w shelves/>' previewH={120}>
            <DSTileFrame width={150} height={90}><F.SupplyBasketShelf x={0} y={0.4} w={4} shelves={4}/></DSTileFrame>
          </DSCard>
          <DSCard name="IVStorageCart" sub="수액 보관 카트 (D5·NS·HS)" code='<Forin.IVStorageCart/>' previewH={140}>
            <DSTileFrame width={70} height={100}><F.IVStorageCart x={0} y={0.2}/></DSTileFrame>
          </DSCard>
          <DSCard name="SluiceSink" sub="배설물 처리 싱크대 (깊은 클리닉 싱크)" code='<Forin.SluiceSink/>' previewH={120}>
            <DSTileFrame width={80} height={90}><F.SluiceSink x={0} y={0.2}/></DSTileFrame>
          </DSCard>
          <DSCard name="LinenHamper" sub="오염/청결 Linen 수거함 (바퀴)" code='<Forin.LinenHamper tone/>' previewH={110}>
            <DSTileFrame width={90} height={90}>
              <F.LinenHamper x={0} y={0}/>
              <F.LinenHamper x={2.5} y={0} tone="clean"/>
            </DSTileFrame>
          </DSCard>
          <DSCard name="MealCart" sub="배식 카트 (식판)" previewH={120}>
            <DSTileFrame width={64} height={100}><F.MealCart x={0} y={0.2}/></DSTileFrame>
          </DSCard>
          <DSCard name="SharpsBin" sub="주삿바늘 수거함" previewH={90}>
            <DSTileFrame width={40} height={55}><F.SharpsBin x={0} y={0}/></DSTileFrame>
          </DSCard>
        </DSGrid>
      </DSSection>

      <DSSection title="◆ 복도 (신규)" hint="낙상 방지 핸드레일.">
        <DSGrid minItem={300}>
          <DSCard name="Handrail" sub="복도 벽면 손잡이 (가로/세로, w 가변)" code='<Forin.Handrail w vertical/>' previewH={50}>
            <DSTileFrame width={240} height={20}><F.Handrail x={0} y={0} w={6}/></DSTileFrame>
          </DSCard>
        </DSGrid>
      </DSSection>
    </DSPage>
  );
}

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
