// app-screens.jsx — App SCREENS ONLY (sections ①–⑨).
// Split out of the full app so screens load without the heavy DS catalog.

const { useState, useEffect } = React;

function Phone({ children }) {
  return <IOSDevice width={402} height={874}>{children}</IOSDevice>;
}

function ForinScreensApp() {
  const [t, setTweak] = useTweaks(/*EDITMODE-BEGIN*/{
    "palette": ["#A7F3D0","#FFEDD5","#FEF08A"],
    "scanlines": true
  }/*EDITMODE-END*/);

  const [bump, setBump] = useState(0);
  useEffect(() => {
    const [mint, peach, yellow] = t.palette;
    Object.assign(window.ForinTokens, { mint, peach, yellow });
    setBump(x => x + 1);
  }, [t.palette]);

  useEffect(() => {
    document.documentElement.style.setProperty('--forin-scanlines', t.scanlines ? '1' : '0');
  }, [t.scanlines]);

  return (
    <>
      <DesignCanvas key={bump}>
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
          <DCArtboard id="elevator" label="C · 엘리베이터 (건물 진입)" width={402} height={874}><Phone><ScreenElevator/></Phone></DCArtboard>
        </DCSection>

        <DCSection id="interiors" title="③ Department Interiors" subtitle="각 부서 내부 — 환자, 장비, 동료, 이벤트">
          <DCArtboard id="int-er" label="ER · 응급실 내부" width={402} height={874}><Phone><ScreenInteriorER/></Phone></DCArtboard>
          <DCArtboard id="int-or" label="OR · 수술실 내부" width={402} height={874}><Phone><ScreenInteriorOR/></Phone></DCArtboard>
          <DCArtboard id="int-peds" label="Pediatrics · 소아과 내부" width={402} height={874}><Phone><ScreenInteriorPeds/></Phone></DCArtboard>
          <DCArtboard id="int-icu" label="ICU · 중환자실 내부" width={402} height={874}><Phone><ScreenInteriorICU/></Phone></DCArtboard>
          <DCArtboard id="int-pharma" label="Pharmacy · 약국 내부" width={402} height={874}><Phone><ScreenInteriorPharma/></Phone></DCArtboard>
          <DCArtboard id="int-ward" label="일반 내과 병동 · Ward 내부" width={402} height={874}><Phone><ScreenInteriorWard/></Phone></DCArtboard>
          <DCArtboard id="int-surgward" label="일반 외과 병동 · Surg Ward 내부" width={402} height={874}><Phone><ScreenInteriorSurgWard/></Phone></DCArtboard>
          <DCArtboard id="int-orthoward" label="정형외과 병동 · Ortho Ward 내부" width={402} height={874}><Phone><ScreenInteriorOrthoWard/></Phone></DCArtboard>
          <DCArtboard id="int-dermcenter" label="피부과 센터 · Derm Center 내부" width={402} height={874}><Phone><ScreenInteriorDermCenter/></Phone></DCArtboard>
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

        <DCSection id="quizzes-er" title="⑥ Mid-Dialogue Quizzes · ER" subtitle="응급실 — 통증 사정, 어휘, 모니터, 트리아지">
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

        <DCSection id="growth" title="⑨ Growth & Career" subtitle="'나' 탭 = 프로필(홈) → 오늘의 리포트 · '리뷰랩' 탭 = 오답노트">
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

ReactDOM.createRoot(document.getElementById('root')).render(<ForinScreensApp/>);
