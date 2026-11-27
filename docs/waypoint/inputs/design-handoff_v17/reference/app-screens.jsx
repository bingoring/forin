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
          <DCArtboard id="int-ld" label="가족 분만실 L&D · 여성소아 3F" width={402} height={874}><Phone><ScreenInteriorLD/></Phone></DCArtboard>
          <DCArtboard id="int-nursery" label="신생아실 Nursery · 여성소아 4F" width={402} height={874}><Phone><ScreenInteriorNursery/></Phone></DCArtboard>
          <DCArtboard id="int-onco" label="종양·BMT · 암센터 3F" width={402} height={874}><Phone><ScreenInteriorOnco/></Phone></DCArtboard>
          <DCArtboard id="int-rad" label="영상의학과 · 외래진단동 1F" width={402} height={874}><Phone><ScreenInteriorRad/></Phone></DCArtboard>
          <DCArtboard id="int-rehab" label="재활치료실 PT/OT · 재활관 1F" width={402} height={874}><Phone><ScreenInteriorRehab/></Phone></DCArtboard>
          <DCArtboard id="int-endo" label="내시경실 · 외래진단동 4F" width={402} height={874}><Phone><ScreenInteriorEndo/></Phone></DCArtboard>
          <DCArtboard id="int-dial" label="인공신장실 · 외래진단동 3F" width={402} height={874}><Phone><ScreenInteriorDial/></Phone></DCArtboard>
          <DCArtboard id="int-infusion" label="외래 주사센터 · 외래진단동 3F" width={402} height={874}><Phone><ScreenInteriorInfusion/></Phone></DCArtboard>
          <DCArtboard id="int-psych" label="정신과 폐쇄병동 · 암센터 2F" width={402} height={874}><Phone><ScreenInteriorPsych/></Phone></DCArtboard>
          <DCArtboard id="int-hospice" label="완화의료·호스피스 · 재활관 4F" width={402} height={874}><Phone><ScreenInteriorHospice/></Phone></DCArtboard>
          <DCArtboard id="int-geri" label="치매·노인병동 · 재활관 4F" width={402} height={874}><Phone><ScreenInteriorGeri/></Phone></DCArtboard>
          <DCArtboard id="int-nicu" label="신생아 중환자실 NICU · 여성소아 6F" width={402} height={874}><Phone><ScreenInteriorNICU/></Phone></DCArtboard>
          <DCArtboard id="int-picu" label="소아 중환자실 PICU · 여성소아 5F" width={402} height={874}><Phone><ScreenInteriorPICU/></Phone></DCArtboard>
          <DCArtboard id="int-postpartum" label="산후 병동 · 여성소아 3F" width={402} height={874}><Phone><ScreenInteriorPostpartum/></Phone></DCArtboard>
          <DCArtboard id="int-cards" label="순환기·호흡기내과 병동 · 본관 5F" width={402} height={874}><Phone><ScreenInteriorCards/></Phone></DCArtboard>
          <DCArtboard id="int-specialty" label="전문 외래 · 외래진단동 2F" width={402} height={874}><Phone><ScreenInteriorSpecialty/></Phone></DCArtboard>
          <DCArtboard id="int-spd" label="중앙공급실·영양·하역 · 지원동 1F" width={402} height={874}><Phone><ScreenInteriorSPD/></Phone></DCArtboard>
          <DCArtboard id="int-sim" label="간호부·감염관리·시뮬랩 · 지원동 3F" width={402} height={874}><Phone><ScreenInteriorSim/></Phone></DCArtboard>
          <DCArtboard id="int-lounge" label="락커·휴게실·식당 · 지원동 2F" width={402} height={874}><Phone><ScreenInteriorLounge/></Phone></DCArtboard>
          <DCArtboard id="int-morgue" label="영안실·부검실 · 지원동 B1" width={402} height={874}><Phone><ScreenInteriorMorgue/></Phone></DCArtboard>
          <DCArtboard id="int-womenkids-opd" label="소아·산부인과 외래 · 여성소아 1F" width={402} height={874}><Phone><ScreenInteriorWomenKidsOPD/></Phone></DCArtboard>
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
          <DCArtboard id="quiz-er-1" label="ER · 트리아지 문장" width={402} height={874}><Phone><ScreenQuizER1/></Phone></DCArtboard>
          <DCArtboard id="quiz-er-2" label="ER · 증상 어휘 매칭" width={402} height={874}><Phone><ScreenQuizER2/></Phone></DCArtboard>
          <DCArtboard id="quiz-er-3" label="ER · 쇼크 지표 판독" width={402} height={874}><Phone><ScreenQuizER3/></Phone></DCArtboard>
          <DCArtboard id="quiz-er-4" label="ER · 성인 BLS 순서" width={402} height={874}><Phone><ScreenQuizER4/></Phone></DCArtboard>
          <DCArtboard id="quiz-er-5" label="ER · 패혈증 경고징후" width={402} height={874}><Phone><ScreenQuizER5/></Phone></DCArtboard>
          <DCArtboard id="quiz-er-6" label="ER · 흉통 트리아지" width={402} height={874}><Phone><ScreenQuizER6/></Phone></DCArtboard>
          <DCArtboard id="quiz-er-7" label="ER · 산소 유량 설정" width={402} height={874}><Phone><ScreenQuizER7/></Phone></DCArtboard>
        </DCSection>

        <DCSection id="quizzes-ward-icu" title="⑦ Mid-Dialogue Quizzes · Ward / ICU" subtitle="병동·중환자실 — 해부 부위, 인계(SBAR)">
          <DCArtboard id="quiz-anatomy" label="병동 · 신체 부위 라벨링" width={402} height={874}><Phone><ScreenQuizAnatomy/></Phone></DCArtboard>
          <DCArtboard id="quiz-sbar" label="ICU · SBAR 인계 순서" width={402} height={874}><Phone><ScreenQuizSBAR/></Phone></DCArtboard>
          <DCArtboard id="quiz-ward-1" label="병동 · 투약 시각 문장" width={402} height={874}><Phone><ScreenQuizWARD1/></Phone></DCArtboard>
          <DCArtboard id="quiz-ward-2" label="병동 · 신체 부위 어휘" width={402} height={874}><Phone><ScreenQuizWARD2/></Phone></DCArtboard>
          <DCArtboard id="quiz-ward-3" label="병동 · I/O 균형 판독" width={402} height={874}><Phone><ScreenQuizWARD3/></Phone></DCArtboard>
          <DCArtboard id="quiz-ward-4" label="병동 · SBAR 인계 순서" width={402} height={874}><Phone><ScreenQuizWARD4/></Phone></DCArtboard>
          <DCArtboard id="quiz-ward-5" label="병동 · 낙상 고위험 선별" width={402} height={874}><Phone><ScreenQuizWARD5/></Phone></DCArtboard>
          <DCArtboard id="quiz-ward-6" label="병동 · 욕창 예방" width={402} height={874}><Phone><ScreenQuizWARD6/></Phone></DCArtboard>
          <DCArtboard id="quiz-ward-7" label="병동 · 수액펌프 오류찾기" width={402} height={874}><Phone><ScreenQuizWARD7/></Phone></DCArtboard>
        </DCSection>

        <DCSection id="quizzes-pharma" title="⑧ Mid-Dialogue Quizzes · Pharmacy" subtitle="약국·임상안전 — 듣고 받아쓰기, 용량 계산">
          <DCArtboard id="quiz-listen" label="약국 · 구두 처방 받아쓰기" width={402} height={874}><Phone><ScreenQuizListen/></Phone></DCArtboard>
          <DCArtboard id="quiz-dosage" label="약국 · 약물 용량 계산" width={402} height={874}><Phone><ScreenQuizDosage/></Phone></DCArtboard>
          <DCArtboard id="quiz-pharma-1" label="약국 · 복약지도 문장" width={402} height={874}><Phone><ScreenQuizPHARMA1/></Phone></DCArtboard>
          <DCArtboard id="quiz-pharma-2" label="약국 · 약효군 용어" width={402} height={874}><Phone><ScreenQuizPHARMA2/></Phone></DCArtboard>
          <DCArtboard id="quiz-pharma-3" label="약국 · 고위험 약품 라벨" width={402} height={874}><Phone><ScreenQuizPHARMA3/></Phone></DCArtboard>
          <DCArtboard id="quiz-pharma-4" label="약국 · 불출 검수 순서" width={402} height={874}><Phone><ScreenQuizPHARMA4/></Phone></DCArtboard>
          <DCArtboard id="quiz-pharma-5" label="약국 · 고위험 이중확인" width={402} height={874}><Phone><ScreenQuizPHARMA5/></Phone></DCArtboard>
          <DCArtboard id="quiz-pharma-6" label="약국 · 약물 상호작용" width={402} height={874}><Phone><ScreenQuizPHARMA6/></Phone></DCArtboard>
          <DCArtboard id="quiz-pharma-7" label="약국 · 조제 라벨 오류찾기" width={402} height={874}><Phone><ScreenQuizPHARMA7/></Phone></DCArtboard>
        </DCSection>

        <DCSection id="qz-ld" title="⑨ Quizzes · 분만실 L&D" subtitle="분만 단계·태아심박·산후출혈·자간전증">
          <DCArtboard id="qz-ld-1" label="분만실 · 분만 단계 순서" width={402} height={874}><Phone><ScreenQuizLD1/></Phone></DCArtboard>
          <DCArtboard id="qz-ld-2" label="분만실 · 태아심박 감시" width={402} height={874}><Phone><ScreenQuizLD2/></Phone></DCArtboard>
          <DCArtboard id="qz-ld-3" label="분만실 · 분만 용어 매칭" width={402} height={874}><Phone><ScreenQuizLD3/></Phone></DCArtboard>
          <DCArtboard id="qz-ld-4" label="분만실 · 산후 출혈" width={402} height={874}><Phone><ScreenQuizLD4/></Phone></DCArtboard>
          <DCArtboard id="qz-ld-5" label="분만실 · 자간전증 경고징후" width={402} height={874}><Phone><ScreenQuizLD5/></Phone></DCArtboard>
          <DCArtboard id="qz-ld-6" label="분만실 · 진통 교육 문장" width={402} height={874}><Phone><ScreenQuizLD6/></Phone></DCArtboard>
        </DCSection>

        <DCSection id="qz-nicu" title="⑩ Quizzes · 신생아중환자실 NICU" subtitle="APGAR·미숙아·광선치료·수유">
          <DCArtboard id="qz-nicu-1" label="NICU · APGAR 판정" width={402} height={874}><Phone><ScreenQuizNICU1/></Phone></DCArtboard>
          <DCArtboard id="qz-nicu-2" label="NICU · 미숙아 관찰" width={402} height={874}><Phone><ScreenQuizNICU2/></Phone></DCArtboard>
          <DCArtboard id="qz-nicu-3" label="NICU · 신생아 용어" width={402} height={874}><Phone><ScreenQuizNICU3/></Phone></DCArtboard>
          <DCArtboard id="qz-nicu-4" label="NICU · 광선치료 간호" width={402} height={874}><Phone><ScreenQuizNICU4/></Phone></DCArtboard>
          <DCArtboard id="qz-nicu-5" label="NICU · 수유 사정" width={402} height={874}><Phone><ScreenQuizNICU5/></Phone></DCArtboard>
          <DCArtboard id="qz-nicu-6" label="NICU · 부모 교육 문장" width={402} height={874}><Phone><ScreenQuizNICU6/></Phone></DCArtboard>
          <DCArtboard id="qz-nicu-7" label="NICU · 인큐베이터 온도" width={402} height={874}><Phone><ScreenQuizNICU7/></Phone></DCArtboard>
        </DCSection>

        <DCSection id="qz-psych" title="⑪ Quizzes · 정신과" subtitle="치료적 반응·자살위험·안전·리튬">
          <DCArtboard id="qz-psych-1" label="정신과 · 치료적 반응" width={402} height={874}><Phone><ScreenQuizPSYCH1/></Phone></DCArtboard>
          <DCArtboard id="qz-psych-2" label="정신과 · 자살위험 사정" width={402} height={874}><Phone><ScreenQuizPSYCH2/></Phone></DCArtboard>
          <DCArtboard id="qz-psych-3" label="정신과 · 안전 환경" width={402} height={874}><Phone><ScreenQuizPSYCH3/></Phone></DCArtboard>
          <DCArtboard id="qz-psych-4" label="정신과 · 정신과 용어" width={402} height={874}><Phone><ScreenQuizPSYCH4/></Phone></DCArtboard>
          <DCArtboard id="qz-psych-5" label="정신과 · 리튬 독성" width={402} height={874}><Phone><ScreenQuizPSYCH5/></Phone></DCArtboard>
          <DCArtboard id="qz-psych-6" label="정신과 · 공격성 대응 단계" width={402} height={874}><Phone><ScreenQuizPSYCH6/></Phone></DCArtboard>
        </DCSection>

        <DCSection id="qz-onco" title="⑫ Quizzes · 종양·BMT" subtitle="항암 부작용·격리·유출응급·GVHD">
          <DCArtboard id="qz-onco-1" label="종양 · 항암 부작용" width={402} height={874}><Phone><ScreenQuizONCO1/></Phone></DCArtboard>
          <DCArtboard id="qz-onco-2" label="종양 · 호중구감소 격리" width={402} height={874}><Phone><ScreenQuizONCO2/></Phone></DCArtboard>
          <DCArtboard id="qz-onco-3" label="종양 · 유출 응급" width={402} height={874}><Phone><ScreenQuizONCO3/></Phone></DCArtboard>
          <DCArtboard id="qz-onco-4" label="종양 · 종양응급 인지" width={402} height={874}><Phone><ScreenQuizONCO4/></Phone></DCArtboard>
          <DCArtboard id="qz-onco-5" label="종양 · BMT GVHD" width={402} height={874}><Phone><ScreenQuizONCO5/></Phone></DCArtboard>
          <DCArtboard id="qz-onco-6" label="종양 · 통증 사정 문장" width={402} height={874}><Phone><ScreenQuizONCO6/></Phone></DCArtboard>
        </DCSection>

        <DCSection id="qz-dial" title="⑬ Quizzes · 인공신장실" subtitle="AV문합·투석부작용·고칼륨·식이">
          <DCArtboard id="qz-dial-1" label="인공신장실 · AV 문합 사정" width={402} height={874}><Phone><ScreenQuizDIAL1/></Phone></DCArtboard>
          <DCArtboard id="qz-dial-2" label="인공신장실 · 투석 부작용" width={402} height={874}><Phone><ScreenQuizDIAL2/></Phone></DCArtboard>
          <DCArtboard id="qz-dial-3" label="인공신장실 · 고칼륨혈증" width={402} height={874}><Phone><ScreenQuizDIAL3/></Phone></DCArtboard>
          <DCArtboard id="qz-dial-4" label="인공신장실 · 신장 용어" width={402} height={874}><Phone><ScreenQuizDIAL4/></Phone></DCArtboard>
          <DCArtboard id="qz-dial-5" label="인공신장실 · 수분·식이 교육" width={402} height={874}><Phone><ScreenQuizDIAL5/></Phone></DCArtboard>
          <DCArtboard id="qz-dial-6" label="인공신장실 · 체중 확인 문장" width={402} height={874}><Phone><ScreenQuizDIAL6/></Phone></DCArtboard>
        </DCSection>

        <DCSection id="qz-rehab" title="⑭ Quizzes · 재활치료" subtitle="이동·용어·낙상·편마비·보조기구">
          <DCArtboard id="qz-rehab-1" label="재활 · 이동 지시 문장" width={402} height={874}><Phone><ScreenQuizREHAB1/></Phone></DCArtboard>
          <DCArtboard id="qz-rehab-2" label="재활 · 재활 용어" width={402} height={874}><Phone><ScreenQuizREHAB2/></Phone></DCArtboard>
          <DCArtboard id="qz-rehab-3" label="재활 · 낙상 예방" width={402} height={874}><Phone><ScreenQuizREHAB3/></Phone></DCArtboard>
          <DCArtboard id="qz-rehab-4" label="재활 · 편마비 케어" width={402} height={874}><Phone><ScreenQuizREHAB4/></Phone></DCArtboard>
          <DCArtboard id="qz-rehab-5" label="재활 · 보조기구 안전" width={402} height={874}><Phone><ScreenQuizREHAB5/></Phone></DCArtboard>
          <DCArtboard id="qz-rehab-6" label="재활 · 목발 계단 오르기" width={402} height={874}><Phone><ScreenQuizREHAB6/></Phone></DCArtboard>
        </DCSection>

        <DCSection id="qz-rad" title="⑮ Quizzes · 영상의학" subtitle="조영제·MRI안전·방사선방어">
          <DCArtboard id="qz-rad-1" label="영상 · 조영제 위험선별" width={402} height={874}><Phone><ScreenQuizRAD1/></Phone></DCArtboard>
          <DCArtboard id="qz-rad-2" label="영상 · MRI 안전" width={402} height={874}><Phone><ScreenQuizRAD2/></Phone></DCArtboard>
          <DCArtboard id="qz-rad-3" label="영상 · 조영제 반응" width={402} height={874}><Phone><ScreenQuizRAD3/></Phone></DCArtboard>
          <DCArtboard id="qz-rad-4" label="영상 · 영상 용어" width={402} height={874}><Phone><ScreenQuizRAD4/></Phone></DCArtboard>
          <DCArtboard id="qz-rad-5" label="영상 · 방사선 방어" width={402} height={874}><Phone><ScreenQuizRAD5/></Phone></DCArtboard>
          <DCArtboard id="qz-rad-6" label="영상 · 검사 안내 문장" width={402} height={874}><Phone><ScreenQuizRAD6/></Phone></DCArtboard>
        </DCSection>

        <DCSection id="qz-endo" title="⑯ Quizzes · 내시경" subtitle="금식·진정후사정·천공·장정결">
          <DCArtboard id="qz-endo-1" label="내시경 · 금식 안내 문장" width={402} height={874}><Phone><ScreenQuizENDO1/></Phone></DCArtboard>
          <DCArtboard id="qz-endo-2" label="내시경 · 진정 후 사정" width={402} height={874}><Phone><ScreenQuizENDO2/></Phone></DCArtboard>
          <DCArtboard id="qz-endo-3" label="내시경 · 천공 경고징후" width={402} height={874}><Phone><ScreenQuizENDO3/></Phone></DCArtboard>
          <DCArtboard id="qz-endo-4" label="내시경 · 내시경 용어" width={402} height={874}><Phone><ScreenQuizENDO4/></Phone></DCArtboard>
          <DCArtboard id="qz-endo-5" label="내시경 · 대장내시경 준비" width={402} height={874}><Phone><ScreenQuizENDO5/></Phone></DCArtboard>
          <DCArtboard id="qz-endo-6" label="내시경 · 체위" width={402} height={874}><Phone><ScreenQuizENDO6/></Phone></DCArtboard>
        </DCSection>

        <DCSection id="growth" title="⑰ Growth & Career" subtitle="'나' 탭 = 프로필(홈) → 오늘의 리포트 · '리뷰랩' 탭 = 오답노트">
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
