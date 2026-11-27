// app-flow.jsx — Briefing + Dialogue + Growth canvas (sections ④⑤⑰), split out
// so no single page carries every section. Screens live in the shared files.

const { useState, useEffect } = React;
function Phone({ children }) { return <IOSDevice width={402} height={874}>{children}</IOSDevice>; }

function ForinFlowApp() {
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

        <DCSection id="growth" title="⑰ Growth & Career" subtitle="'나' 탭 = 프로필(홈) → 오늘의 리포트 · '리뷰랩' 탭 = 오답노트">
          <DCArtboard id="profile" label="나 탭 (홈) · Profile → 오늘의 리포트" width={402} height={874}><Phone><ScreenProfile/></Phone></DCArtboard>
          <DCArtboard id="review-lab" label="리뷰랩 탭 · 오답노트" width={402} height={874}><Phone><ScreenReviewLab/></Phone></DCArtboard>
          <DCArtboard id="speak-list" label="리뷰랩 › 직접 말하기 전체 (128)" width={402} height={874}><Phone><ScreenSpeakList/></Phone></DCArtboard>
          <DCArtboard id="model-list" label="리뷰랩 › 모범답안 전체 (34)" width={402} height={874}><Phone><ScreenModelAnswerList/></Phone></DCArtboard>
        </DCSection>
      </DesignCanvas>

      <TweaksPanel title="forin · Tweaks">
        <TweakSection label="Palette">
          <TweakColor label="컬러 팔레트" value={t.palette}
            options={[['#A7F3D0','#FFEDD5','#FEF08A'],['#DDD6FE','#FBCFE8','#FDE68A'],['#BAE6FD','#FFE4E6','#FEF3C7'],['#BBF7D0','#FED7AA','#FDE68A']]}
            onChange={v => setTweak('palette', v)} />
        </TweakSection>
        <TweakSection label="Pixel Feel">
          <TweakToggle label="Scanline 오버레이" value={t.scanlines} onChange={v => setTweak('scanlines', v)} />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<ForinFlowApp/>);
