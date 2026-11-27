// app.jsx — Main canvas assembling forin screens

const { useState, useEffect } = React;

function Phone({ children }) {
  return <IOSDevice width={402} height={874}>{children}</IOSDevice>;
}

function ForinApp() {
  const [t, setTweak] = useTweaks(/*EDITMODE-BEGIN*/{
    "palette": ["#A7F3D0","#FFEDD5","#FEF08A"],
    "scanlines": true
  }/*EDITMODE-END*/);

  // Apply palette into ForinTokens whenever it changes
  const [bump, setBump] = useState(0);
  useEffect(() => {
    const [mint, peach, yellow] = t.palette;
    Object.assign(window.ForinTokens, { mint, peach, yellow });
    setBump(x => x + 1);
  }, [t.palette]);

  // Toggle scanlines globally via CSS variable
  useEffect(() => {
    document.documentElement.style.setProperty('--forin-scanlines', t.scanlines ? '1' : '0');
  }, [t.scanlines]);

  return (
    <>
      <DesignCanvas key={bump}>
        <DCSection id="design-system" title="⓪ Design System" subtitle="forin-v2의 단일 소스 카탈로그 — 모든 토큰, 컴포넌트, 캐릭터, 오브젝트 정의">
          <DCArtboard id="ds-overview"  label="Overview · 시스템 한눈에" width={720} height={900}><ScreenDSOverview/></DCArtboard>
          <DCArtboard id="ds-colors"    label="Colors · 컬러 토큰"    width={720} height={1100}><ScreenDSColors/></DCArtboard>
          <DCArtboard id="ds-type"      label="Typography"            width={720} height={900}><ScreenDSType/></DCArtboard>
          <DCArtboard id="ds-icons"     label="Icons & Flags"         width={720} height={700}><ScreenDSIcons/></DCArtboard>
          <DCArtboard id="ds-primitives" label="Primitives · 버튼 / 박스 / 칩" width={720} height={900}><ScreenDSPrimitives/></DCArtboard>
          <DCArtboard id="ds-chrome"    label="App Chrome · TopBar / Mission / HUD" width={720} height={900}><ScreenDSChrome/></DCArtboard>
          <DCArtboard id="ds-chars"     label="Characters · Player + NPC 아틀라스" width={720} height={1400}><ScreenDSCharacters/></DCArtboard>
          <DCArtboard id="ds-derp"      label="Characters · Derp (메인)" width={720} height={3200}><ScreenDSDerp/></DCArtboard>
          <DCArtboard id="ds-chars-smooth" label="Characters · Smooth (비픽셀)" width={720} height={1300}><ScreenDSCharactersSmooth/></DCArtboard>
          <DCArtboard id="ds-faces"     label="Faces · 얼굴 & 12 표정"   width={720} height={2400}><ScreenDSFaces/></DCArtboard>
          <DCArtboard id="ds-map"       label="Map Atoms · Floor/Wall/Door" width={720} height={900}><ScreenDSMap/></DCArtboard>
          <DCArtboard id="ds-furn"      label="Furniture · 침대 / 데스크 / 캐비닛" width={720} height={1200}><ScreenDSFurniture/></DCArtboard>
          <DCArtboard id="ds-eq-er"     label="ER Equipment"          width={720} height={1200}><ScreenDSEquipmentER/></DCArtboard>
          <DCArtboard id="ds-eq-or"     label="OR Equipment"          width={720} height={800}><ScreenDSEquipmentOR/></DCArtboard>
          <DCArtboard id="ds-eq-icu"    label="ICU Equipment"         width={720} height={700}><ScreenDSEquipmentICU/></DCArtboard>
          <DCArtboard id="ds-eq-peds"   label="Pediatrics Equipment"  width={720} height={800}><ScreenDSEquipmentPeds/></DCArtboard>
          <DCArtboard id="ds-eq-pharma" label="Pharmacy Equipment"    width={720} height={1100}><ScreenDSEquipmentPharma/></DCArtboard>
          <DCArtboard id="ds-eq-ward"   label="Ward Equipment · 일반 병동" width={720} height={1100}><ScreenDSEquipmentWard/></DCArtboard>
          <DCArtboard id="ds-eq-clinics" label="Clinic Equipment · 외래 진료과" width={720} height={1100}><ScreenDSEquipmentClinics/></DCArtboard>
          <DCArtboard id="ds-patterns"  label="Patterns · 결합 예시"   width={720} height={1300}><ScreenDSPatterns/></DCArtboard>
        </DCSection>

        <DCSection id="onboarding" title="① Onboarding" subtitle="첫 실행 — 모국어 / 목표국가 → 직업 → 레벨 진단 (간호사 MVP)">
          <DCArtboard id="splash" label="Splash" width={402} height={874}><Phone><ScreenSplash/></Phone></DCArtboard>
          <DCArtboard id="login" label="Login · One-tap" width={402} height={874}><Phone><ScreenLogin/></Phone></DCArtboard>
          <DCArtboard id="locale" label="Language & Destination" width={402} height={874}><Phone><ScreenLocale/></Phone></DCArtboard>
          <DCArtboard id="job" label="Job · Nurse only (MVP)" width={402} height={874}><Phone><ScreenJob/></Phone></DCArtboard>
          <DCArtboard id="level" label="Level Diagnosis" width={402} height={874}><Phone><ScreenLevel/></Phone></DCArtboard>
        </DCSection>

        <DCSection id="map" title="② Hospital Campus & Event Board" subtitle="캠퍼스 외부 + 매일 자동 갱신되는 현장 상황판">
          <DCArtboard id="campus" label="A · Campus (Outdoor)" width={402} height={874}><Phone><ScreenExplore/></Phone></DCArtboard>
          <DCArtboard id="event-board" label="B · 상황판 (Daily Events)" width={402} height={874}><Phone><ScreenEventBoard/></Phone></DCArtboard>
        </DCSection>

        <DCSection id="interiors" title="③ Department Interiors" subtitle="각 부서 내부 — 환자, 장비, 동료, 이벤트 (각 1F~5F)">
          <DCArtboard id="int-er" label="ER · 응급실 내부" width={402} height={874}><Phone><ScreenInteriorER/></Phone></DCArtboard>
          <DCArtboard id="int-or" label="OR · 수술실 내부" width={402} height={874}><Phone><ScreenInteriorOR/></Phone></DCArtboard>
          <DCArtboard id="int-peds" label="Pediatrics · 소아과 내부" width={402} height={874}><Phone><ScreenInteriorPeds/></Phone></DCArtboard>
          <DCArtboard id="int-icu" label="ICU · 중환자실 내부" width={402} height={874}><Phone><ScreenInteriorICU/></Phone></DCArtboard>
          <DCArtboard id="int-pharma" label="Pharmacy · 약국 내부" width={402} height={874}><Phone><ScreenInteriorPharma/></Phone></DCArtboard>
          <DCArtboard id="int-ward" label="일반 내과 병동 · Ward 내부" width={402} height={874}><Phone><ScreenInteriorWard/></Phone></DCArtboard>
          <DCArtboard id="int-internal" label="내과 · Internal Medicine 내부" width={402} height={874}><Phone><ScreenInteriorInternal/></Phone></DCArtboard>
          <DCArtboard id="int-surgery" label="외과 · General Surgery 내부" width={402} height={874}><Phone><ScreenInteriorSurgery/></Phone></DCArtboard>
          <DCArtboard id="int-ortho" label="정형외과 · Orthopedics 내부" width={402} height={874}><Phone><ScreenInteriorOrtho/></Phone></DCArtboard>
          <DCArtboard id="int-derm" label="피부과 · Dermatology 내부" width={402} height={874}><Phone><ScreenInteriorDerm/></Phone></DCArtboard>
          <DCArtboard id="objects-v2" label="🎮 객체 2.5D · v1 vs v2 비교" width={402} height={874}><Phone><ScreenObjectsCompare/></Phone></DCArtboard>
          <DCArtboard id="room-gallery" label="🗂 Room Design Gallery (dev ref)" width={402} height={874}><Phone><ScreenRoomGallery/></Phone></DCArtboard>
        </DCSection>

        <DCSection id="briefing" title="④ Scenario Briefing" subtitle="`!` 지점에서 시나리오 진입 전 사전 안내 모달">
          <DCArtboard id="brief-er" label="ER · 통증 사정 브리핑" width={402} height={874}><Phone><ScreenBriefing variant="er"/></Phone></DCArtboard>
          <DCArtboard id="brief-or" label="OR · 수술 동의 브리핑" width={402} height={874}><Phone><ScreenBriefing variant="or"/></Phone></DCArtboard>
          <DCArtboard id="brief-police" label="ER · 경찰 동행 브리핑 (조건 미달)" width={402} height={874}><Phone><ScreenBriefing variant="police"/></Phone></DCArtboard>
        </DCSection>

        <DCSection id="dialogue" title="⑤ Visual Novel Dialogue" subtitle="AI 자유 대화 (80%) + 힌트 / 결과">
          <DCArtboard id="dialog-free" label="A · Free Speak (default)" width={402} height={874}><Phone><ScreenDialogue hintOn={false}/></Phone></DCArtboard>
          <DCArtboard id="dialog-hint" label="B · Hint Pressed (3 choices revealed)" width={402} height={874}><Phone><ScreenDialogue hintOn={true}/></Phone></DCArtboard>
          <DCArtboard id="result" label="C · Scenario Clear" width={402} height={874}><Phone><ScreenDialogueResult/></Phone></DCArtboard>
        </DCSection>

        <DCSection id="quizzes-er" title="⑥ Mid-Dialogue Quizzes · ER" subtitle="응급실에서 등장 — 통증 사정, 어휘, 모니터, 트리아지">
          <DCArtboard id="quiz-sentence" label="ER · 문장 완성" width={402} height={874}><Phone><ScreenQuizSentence/></Phone></DCArtboard>
          <DCArtboard id="quiz-match" label="ER · 통증 표현 매칭" width={402} height={874}><Phone><ScreenQuizMatching/></Phone></DCArtboard>
          <DCArtboard id="quiz-vitals" label="ER · 바이탈 라벨링" width={402} height={874}><Phone><ScreenQuizVitals/></Phone></DCArtboard>
          <DCArtboard id="quiz-triage" label="ER · ESI 트리아지 판정" width={402} height={874}><Phone><ScreenQuizTriage/></Phone></DCArtboard>
        </DCSection>

        <DCSection id="quizzes-ward-icu" title="⑦ Mid-Dialogue Quizzes · Ward / ICU" subtitle="병동·중환자실 — 해부 부위, 인계(SBAR)">
          <DCArtboard id="quiz-anatomy" label="병동 · 신체 부위 라벨링" width={402} height={874}><Phone><ScreenQuizAnatomy/></Phone></DCArtboard>
          <DCArtboard id="quiz-sbar" label="ICU · SBAR 인계 순서" width={402} height={874}><Phone><ScreenQuizSBAR/></Phone></DCArtboard>
        </DCSection>

        <DCSection id="quizzes-pharma" title="⑧ Mid-Dialogue Quizzes · Pharmacy" subtitle="약국·임상안전 — 듣고 받아쓰기, 용량 계산">
          <DCArtboard id="quiz-listen" label="약국 · 구두 처방 받아쓰기" width={402} height={874}><Phone><ScreenQuizListen/></Phone></DCArtboard>
          <DCArtboard id="quiz-dosage" label="약국 · 약물 용량 계산" width={402} height={874}><Phone><ScreenQuizDosage/></Phone></DCArtboard>
        </DCSection>

        <DCSection id="growth" title="⑨ Growth & Career" subtitle="'나' 탭 = 프로필(홈) → 오늘의 리포트 push · '리뷰랩' 탭 = 오답노트">
          <DCArtboard id="profile" label="나 탭 (홈) · Profile → 오늘의 리포트" width={402} height={874}><Phone><ScreenProfile/></Phone></DCArtboard>
          <DCArtboard id="review-lab" label="리뷰랩 탭 · 오답노트" width={402} height={874}><Phone><ScreenReviewLab/></Phone></DCArtboard>
        </DCSection>
      </DesignCanvas>

      <TweaksPanel title="forin · Tweaks">
        <TweakSection label="Palette">
          <TweakColor
            label="컬러 팔레트"
            value={t.palette}
            options={[
              ['#A7F3D0','#FFEDD5','#FEF08A'],
              ['#DDD6FE','#FBCFE8','#FDE68A'],
              ['#BAE6FD','#FFE4E6','#FEF3C7'],
              ['#BBF7D0','#FED7AA','#FDE68A'],
            ]}
            onChange={v => setTweak('palette', v)}
          />
        </TweakSection>
        <TweakSection label="Pixel Feel">
          <TweakToggle label="Scanline 오버레이"
            value={t.scanlines}
            onChange={v => setTweak('scanlines', v)} />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<ForinApp/>);
