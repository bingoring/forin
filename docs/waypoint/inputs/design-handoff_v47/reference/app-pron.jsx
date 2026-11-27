// app-pron.jsx — 발음·스피킹 피드백 canvas, split out of app-flow.jsx so the
// Flow page no longer loads these four heavy artboards alongside dialogue and
// growth (that froze scrolling). Screens live in screen-pronunciation.jsx.

function Phone({ children }) { return <IOSDevice width={402} height={874}>{children}</IOSDevice>; }

function ForinPronApp() {
  return (
    <DesignCanvas>
              <DCSection id="pron" title="⑤b 발음·스피킹 피드백" subtitle="녹음 → 채점 → 음절 교정 → 취약 음소 드릴 (약물명·숫자 집중)">
                <DCArtboard id="pron-practice" label="A · 연습 대기 (문장 + 녹음)" width={402} height={874}><Phone><ScreenPronPractice/></Phone></DCArtboard>
                <DCArtboard id="pron-recording" label="B · 녹음 중 (실시간 파형)" width={402} height={874}><Phone><ScreenPronRecording/></Phone></DCArtboard>
                <DCArtboard id="pron-result" label="C · 채점 결과 (음절 하이라이트)" width={402} height={874}><Phone><ScreenPronResult/></Phone></DCArtboard>
                <DCArtboard id="pron-drill" label="D · 취약 음소 드릴 (개인화)" width={402} height={874}><Phone><ScreenPronDrill/></Phone></DCArtboard>
              </DCSection>
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<ForinPronApp/>);
