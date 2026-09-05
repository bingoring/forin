// app-home.jsx — Home + Colleagues canvas. Split off app-onboard.jsx because a
// single page with 17 heavy phone artboards never finished hydrating (the lazy
// loader stalled and every artboard stayed on "로딩 대기"). Same remedy used for
// Interiors/Quizzes: fewer artboards per page.

function Phone({ children }) { return <IOSDevice width={402} height={874}>{children}</IOSDevice>; }

function ForinHomeApp() {
  return (
    <DesignCanvas>
        <DCSection id="home" title="①b 홈 탭 (진입 첫 화면)" subtitle="목록 대신 '오늘 할 딱 한 가지' — 압박 없는 진입점">
          <DCArtboard id="home-default" label="A · 홈 (기본 · DAY 무드 + 호출)" width={402} height={874}><Phone><ScreenHome/></Phone></DCArtboard>
          <DCArtboard id="home-done" label="B · 홈 (오늘 완료 · EVENING)" width={402} height={874}><Phone><ScreenHomeDone/></Phone></DCArtboard>
          <DCArtboard id="home-night" label="C · 홈 (NIGHT 무드 · 호출 응답됨)" width={402} height={874}><Phone><ScreenHomeNight/></Phone></DCArtboard>
        </DCSection>



        <DCSection id="colleagues" title="①c 동료 (Colleagues)" subtitle="초대 코드로 관계 맺기 · 학습 현황 공유 · 응원 — 확장: 현지인 멘토·멘티">
          <DCArtboard id="col-list" label="A · 동료 목록" width={402} height={874}><Phone><ScreenColleagues/></Phone></DCArtboard>
          <DCArtboard id="col-add" label="B · 코드로 추가" width={402} height={874}><Phone><ScreenColleagueAdd/></Phone></DCArtboard>
          <DCArtboard id="col-detail" label="C · 동료 프로필" width={402} height={874}><Phone><ScreenColleagueDetail/></Phone></DCArtboard>
          <DCArtboard id="col-cheer" label="D · 응원 보내기" width={402} height={874}><Phone><ScreenCheerCompose/></Phone></DCArtboard>
        </DCSection>


    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<ForinHomeApp/>);
