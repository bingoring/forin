// app-quizzes.jsx — Quiz canvas, split out of app-screens.jsx so neither page
// renders 100+ artboards at once (that froze the design canvas). Screens live
// in the shared screen files; this file only hosts the quiz sections.

function Phone({ children }) { return <IOSDevice width={402} height={874}>{children}</IOSDevice>; }

function ForinQuizzesApp() {
  return (
    <DesignCanvas>
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
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<ForinQuizzesApp/>);
