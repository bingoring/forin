// app-modern.jsx — 전면 모던 리디자인 시안 캔버스 (1차: 홈).
// 방향(사용자 확정): 픽셀 요소 전부 제거 · Duolingo계 친근한 둥근 톤 ·
// Pretendard · 캐릭터가 주인공. 기존 픽셀 시스템 파일은 건드리지 않는 별도 시안.

const M = window.ModernTokens;
const F = window.ModernFont;
const card = window.mcard;
const { MAvatar, MNav, MIcon } = window;

// ── 홈 모듈들 ─────────────────────────────────────────────────────────
function MGreeting({ done }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '56px 20px 4px' }}>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontFamily: F, fontSize: 13, fontWeight: 500, color: M.faint }}>8월 24일 월요일 · 아침</div>
        <div style={{ fontFamily: F, fontSize: 22, fontWeight: 800, color: M.ink, marginTop: 3, letterSpacing: '-.02em' }}>
          {done ? '오늘 몫은 끝냈어요' : '지원님, 천천히 시작해요'}
        </div>
      </div>
      <MAvatar icon="nurse"/>
    </div>
  );
}

function MShift() {
  return (
    <div style={{ margin: '14px 20px 0', display: 'flex', alignItems: 'center', gap: 10, background: M.ink, borderRadius: 18, padding: '12px 14px' }}>
      <span style={{ background: M.primary, color: '#fff', fontFamily: F, fontSize: 11, fontWeight: 800, borderRadius: 999, padding: '3px 10px', flexShrink: 0 }}>DAY</span>
      <span style={{ minWidth: 0, flex: 1, fontFamily: F, fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,.85)' }}>오늘 배치 · <b style={{ color: '#fff', fontWeight: 700 }}>본관 1F 응급의료센터</b></span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: F, fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,.7)', flexShrink: 0 }}><MIcon name="sun" size={15}/>27°</span>
    </div>
  );
}

function MStreak() {
  const week = [1, 1, 1, 0, 1, 1, 2];
  const days = ['월', '화', '수', '목', '금', '토', '일'];
  return (
    <div style={{ margin: '12px 20px 0', display: 'flex', alignItems: 'center', gap: 14, ...card({ padding: '14px 16px' }) }}>
      <div style={{ textAlign: 'center', flexShrink: 0 }}>
        <MIcon name="flame" size={26} style={{ margin: '0 auto' }}/>
        <div style={{ fontFamily: F, fontSize: 20, fontWeight: 800, color: M.orange, marginTop: 2 }}>12</div>
        <div style={{ fontFamily: F, fontSize: 10, fontWeight: 600, color: M.faint }}>연속</div>
      </div>
      <div style={{ width: 1, alignSelf: 'stretch', background: M.line }}/>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {week.map((d, i) => (
            <div key={i} style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ height: 26, borderRadius: 9, background: d === 2 ? M.yellow : d === 1 ? M.primary : M.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#fff', fontWeight: 800, fontFamily: F }}>{d === 2 ? '★' : d === 1 ? '✓' : ''}</div>
              <div style={{ fontFamily: F, fontSize: 9.5, fontWeight: 600, color: M.faint, marginTop: 3 }}>{days[i]}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MTodayOne() {
  return (
    <div style={{ margin: '12px 20px 0', background: `linear-gradient(135deg, ${M.primary}, #0FA95B)`, borderRadius: 24, padding: '18px 18px 16px', boxShadow: '0 8px 22px rgba(22,179,100,.28)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 52, height: 52, flexShrink: 0, borderRadius: 18, background: 'rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MIcon name="chat" size={30}/></div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontFamily: F, fontSize: 11.5, fontWeight: 700, color: 'rgba(255,255,255,.8)' }}>오늘의 한 가지 · CHAPTER 2</div>
          <div style={{ fontFamily: F, fontSize: 17, fontWeight: 800, color: '#fff', marginTop: 3, letterSpacing: '-.01em' }}>보호자에게 대기 안내하기</div>
          <div style={{ fontFamily: F, fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,.75)', marginTop: 3 }}>대화 · 약 6분이면 충분해요</div>
        </div>
      </div>
      <div style={{ marginTop: 14, background: '#fff', borderRadius: 16, padding: '13px 0', textAlign: 'center', fontFamily: F, fontSize: 15, fontWeight: 800, color: M.primaryDeep, boxShadow: '0 3px 0 rgba(0,0,0,.12)' }}>시작하기</div>
    </div>
  );
}

function MMentor() {
  return (
    <div style={{ margin: '12px 20px 0', display: 'flex', gap: 11, ...card({ padding: '14px 15px' }) }}>
      <MAvatar size={40} bg={M.blueSoft} icon="mentor"/>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontFamily: F, fontSize: 11, fontWeight: 700, color: M.blue }}>멘토 쪽지 · 수간호사 Emma</div>
        <div style={{ marginTop: 5, background: M.blueSoft, borderRadius: '4px 14px 14px 14px', padding: '9px 12px', fontFamily: F, fontSize: 13, fontWeight: 500, color: M.ink, lineHeight: 1.5 }}>
          보호자가 화를 낼 땐 정보를 더 주기 전에 감정을 먼저 인정해줘요.
        </div>
      </div>
    </div>
  );
}

function MPhrase() {
  return (
    <div style={{ margin: '12px 20px 0', ...card({ padding: '14px 16px' }) }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <MIcon name="bulb" size={17}/>
        <span style={{ fontFamily: F, fontSize: 12.5, fontWeight: 700, color: M.ink }}>오늘의 한마디</span>
        <div style={{ flex: 1 }}/>
        <span style={{ fontFamily: F, fontSize: 11, fontWeight: 500, color: M.faint }}>탭하면 뜻 보기</span>
      </div>
      <div style={{ marginTop: 10, background: M.purpleSoft, borderRadius: 16, padding: '16px 12px', textAlign: 'center' }}>
        <div style={{ fontFamily: F, fontSize: 16, fontWeight: 700, color: M.purple, letterSpacing: '-.01em' }}>"Bear with me for a moment."</div>
        <div style={{ fontFamily: F, fontSize: 12, fontWeight: 500, color: M.text, marginTop: 6 }}>잠시만 기다려 주시겠어요 · 대기 안내에 자주 씀</div>
      </div>
    </div>
  );
}

function MDoors() {
  const door = (icon, title, sub, bg, fg) => (
    <div style={{ flex: 1, ...card({ padding: '14px 14px' }) }}>
      <div style={{ width: 40, height: 40, borderRadius: 14, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MIcon name={icon} size={24}/></div>
      <div style={{ fontFamily: F, fontSize: 14, fontWeight: 800, color: M.ink, marginTop: 9 }}>{title}</div>
      <div style={{ fontFamily: F, fontSize: 11.5, fontWeight: 500, color: fg || M.faint, marginTop: 2, lineHeight: 1.4, whiteSpace: 'pre-line' }}>{sub}</div>
    </div>
  );
  return (
    <div style={{ display: 'flex', gap: 10, margin: '12px 20px 0' }}>
      {door('map', '둘러보기', '건물·층에서\n원하는 과 고르기', M.primarySoft)}
      {door('clipboard', '오늘의 상황', '지금 벌어진 일\n5건 대기중', M.blueSoft, M.blue)}
    </div>
  );
}

function MNextBadge() {
  return (
    <div style={{ margin: '12px 20px 0', display: 'flex', alignItems: 'center', gap: 12, ...card({ padding: '13px 15px' }) }}>
      <div style={{ width: 42, height: 42, flexShrink: 0, borderRadius: 14, background: M.yellowSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MIcon name="medal" size={24}/></div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontFamily: F, fontSize: 13, fontWeight: 700, color: M.ink }}>다음 뱃지 · ER 트리아지 마스터</div>
        <div style={{ height: 8, background: M.bg, borderRadius: 999, marginTop: 7, overflow: 'hidden' }}>
          <div style={{ width: '75%', height: '100%', borderRadius: 999, background: M.yellow }}/>
        </div>
        <div style={{ fontFamily: F, fontSize: 11, fontWeight: 600, color: M.faint, marginTop: 5 }}>2개 시나리오만 더 하면 획득!</div>
      </div>
    </div>
  );
}

function MReview() {
  return (
    <div style={{ margin: '12px 20px 0', display: 'flex', alignItems: 'center', gap: 11, ...card({ padding: '12px 15px' }) }}>
      <div style={{ width: 34, height: 34, flexShrink: 0, borderRadius: 12, background: M.orangeSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MIcon name="book" size={19}/></div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontFamily: F, fontSize: 13, fontWeight: 600, color: M.ink }}>어제 틀린 표현 하나만 다시 볼까요?</div>
        <div style={{ fontFamily: F, fontSize: 11, fontWeight: 500, color: M.faint, marginTop: 2 }}>"radiate" · 1분</div>
      </div>
      <div style={{ fontFamily: F, fontSize: 16, color: M.faint }}>›</div>
    </div>
  );
}

function MPeers() {
  const rows = [['🇦🇺', '민서', 'ICU 승압제 시나리오 클리어', M.primarySoft], ['🇺🇸', 'Jae', '연속 30일 달성', M.orangeSoft], ['🇬🇧', '하늘', 'ER 트리아지 마스터 획득', M.yellowSoft]];
  return (
    <div style={{ margin: '12px 20px 0', ...card({ padding: '4px 0' }) }}>
      <div style={{ padding: '11px 16px 7px', fontFamily: F, fontSize: 12.5, fontWeight: 700, color: M.ink, display: 'flex', alignItems: 'center', gap: 6 }}><MIcon name="mates" size={16}/>같은 목표를 준비하는 사람들</div>
      {rows.map((r, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 16px', borderTop: `1px solid ${M.line}` }}>
          <MAvatar size={30} bg={r[3]} emoji={r[0]}/>
          <span style={{ fontFamily: F, fontSize: 12.5, fontWeight: 700, color: M.ink, flexShrink: 0 }}>{r[1]}</span>
          <span style={{ minWidth: 0, flex: 1, fontFamily: F, fontSize: 12, fontWeight: 500, color: M.text }}>{r[2]}</span>
          <MIcon name="star" size={16}/>
        </div>
      ))}
    </div>
  );
}

function MShell({ label, children }) {
  return (
    <div data-screen-label={label} style={{ height: '100%', background: M.bg, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, bottom: 84, overflowY: 'auto', paddingBottom: 28 }}>{children}</div>
      <MNav active="home"/>
    </div>
  );
}

function ScreenModernHome() {
  return (
    <MShell label="Modern Home · 기본">
      <MGreeting done={false}/>
      <MShift/>
      <MStreak/>
      <MTodayOne/>
      <MMentor/>
      <MPhrase/>
      <MDoors/>
      <MNextBadge/>
      <MReview/>
      <MPeers/>
    </MShell>
  );
}

function ScreenModernHomeDone() {
  return (
    <MShell label="Modern Home · 오늘 완료">
      <MGreeting done={true}/>
      <MShift/>
      <MStreak/>
      <div style={{ margin: '12px 20px 0', ...card({ padding: '22px 16px', textAlign: 'center' }) }}>
        <MIcon name="moon" size={44} style={{ margin: '0 auto' }}/>
        <div style={{ fontFamily: F, fontSize: 16, fontWeight: 800, color: M.ink, marginTop: 10 }}>오늘 목표를 다 채웠어요</div>
        <div style={{ fontFamily: F, fontSize: 13, fontWeight: 500, color: M.text, marginTop: 6, lineHeight: 1.6 }}>13일째 연속이 눈앞이에요.<br/>여기서 멈춰도 괜찮아요.</div>
        <div style={{ display: 'inline-block', marginTop: 14, background: M.primarySoft, borderRadius: 999, padding: '10px 20px', fontFamily: F, fontSize: 13.5, fontWeight: 800, color: M.primaryDeep }}>+ 한 판 더 하기</div>
      </div>
      <MNextBadge/>
      <MPhrase/>
      <MDoors/>
      <MReview/>
      <MPeers/>
    </MShell>
  );
}

function Phone({ children }) { return <IOSDevice width={402} height={874}>{children}</IOSDevice>; }

function ForinModernApp() {
  return (
    <DesignCanvas>
      <DCSection id="modern-home" title="🆕 전면 모던 리디자인 · 1차 시안 (홈)" subtitle="픽셀 전부 제거 · Duolingo계 친근한 둥근 톤 · Pretendard · 기존 픽셀 페이지는 그대로 두고 별도 시안">
        <DCArtboard id="m-home" label="A · 홈 (기본)" width={402} height={874}><Phone><ScreenModernHome/></Phone></DCArtboard>
        <DCArtboard id="m-home-done" label="B · 홈 (오늘 완료)" width={402} height={874}><Phone><ScreenModernHomeDone/></Phone></DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<ForinModernApp/>);
