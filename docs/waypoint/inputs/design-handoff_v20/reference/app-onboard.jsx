// app-onboard.jsx — Onboarding + Campus canvas (sections ①②), split out so no
// page renders the heavy campus map alongside other sections. Screens live in
// the shared screen files.

const { useState, useEffect } = React;
function Phone({ children }) { return <IOSDevice width={402} height={874}>{children}</IOSDevice>; }

function ForinOnboardApp() {
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

        <DCSection id="home" title="①b 홈 탭 (진입 첫 화면)" subtitle="목록 대신 '오늘 할 딱 한 가지' — 압박 없는 진입점">
          <DCArtboard id="home-default" label="A · 홈 (기본)" width={402} height={874}><Phone><ScreenHome/></Phone></DCArtboard>
          <DCArtboard id="home-done" label="B · 홈 (오늘 완료)" width={402} height={874}><Phone><ScreenHomeDone/></Phone></DCArtboard>
        </DCSection>

        <DCSection id="map" title="② Hospital Campus & Event Board" subtitle="캠퍼스 외부 + 매일 자동 갱신되는 현장 상황판">
          <DCArtboard id="campus" label="A · Campus (Outdoor)" width={402} height={874}><Phone><ScreenExplore/></Phone></DCArtboard>
          <DCArtboard id="event-board" label="B · 상황판 (Daily Events)" width={402} height={874}><Phone><ScreenEventBoard/></Phone></DCArtboard>
          <DCArtboard id="elevator" label="C · 엘리베이터 (건물 진입)" width={402} height={874}><Phone><ScreenElevator/></Phone></DCArtboard>
        </DCSection>

        <DCSection id="campus-hub" title="②b 캠퍼스 탭 (개편)" subtitle="캠퍼스=장소·커리큘럼 축 / 상황판=시간·전원 피드 축 · 층 선택 시 부서 상세 시트">
          <DCArtboard id="hub-curriculum" label="A · 커리큘럼 (기본 탭)" width={402} height={874}><Phone><ScreenCampusCurriculum/></Phone></DCArtboard>
          <DCArtboard id="hub-buildings" label="B · 건물·층 리스트" width={402} height={874}><Phone><ScreenCampusBuildings/></Phone></DCArtboard>
          <DCArtboard id="hub-dept" label="C · 부서 상세 시트 (층 탭 → 층 선택)" width={402} height={874}><Phone><ScreenCampusDept/></Phone></DCArtboard>
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

ReactDOM.createRoot(document.getElementById('root')).render(<ForinOnboardApp/>);
