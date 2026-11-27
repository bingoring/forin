// forin-notebook-profile.jsx — 프로필(나) 탭 + 성장 리포트 (수첩 그림체)
// 실구현 구조 이식. 변경점(사용자 확정): 스티커 보드 제거, 연속 학습 스트립 제거,
// 4스탯(시나리오·새 표현·대화 시간·레벨)은 유지.
(function () {
  const c = { bg: '#F1EBDD', paper: '#FFFdf4', ink: '#3E362B', soft: '#9A8F7C', red: '#C75146', blue: '#4A6FA5', green: '#5F8D5A', tape: 'rgba(160,200,220,.55)' };
  const HW = '"Gaegu","Nanum Pen Script",cursive';
  const F = '"Pretendard",sans-serif';
  const MONO = '"IBM Plex Mono",monospace';
  const NbIcon = window.NbIcon;
  const paper = (rot = 0) => ({ background: c.paper, border: `1px solid #E0D6C0`, boxShadow: '0 2px 6px rgba(62,54,43,.14)', transform: `rotate(${rot}deg)`, position: 'relative' });
  const tape = (l, rot = -4, w = 74) => <div style={{ position: 'absolute', top: -10, left: l, width: w, height: 20, background: c.tape, transform: `rotate(${rot}deg)`, boxShadow: '0 1px 2px rgba(0,0,0,.08)' }}/>;

  function Frame({ label, children, nav = true }) {
    return (
      <div style={{ boxSizing: 'border-box', width: 402, height: 874, background: c.bg, backgroundImage: 'repeating-linear-gradient(transparent 0 27px, rgba(62,54,43,.06) 27px 28px)', borderRadius: 40, overflow: 'hidden', position: 'relative', fontFamily: F }} data-screen-label={label}>
        <div style={{ height: 44, display: 'flex', alignItems: 'center', padding: '0 24px', fontSize: 14, fontWeight: 700, color: c.ink }}>9:41<div style={{ flex: 1 }}/>▮▮▮</div>
        {children}
        {nav && (
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 68, background: c.paper, borderTop: `1.5px solid #E0D6C0`, display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '0 8px 8px', zIndex: 30 }}>
            {[['home','홈',false],['hospital','일터',false],['board','상황판',false],['lab','리뷰랩',false],['me','나',true]].map((t, i) => (
              <div key={i} style={{ textAlign: 'center', opacity: t[2] ? 1 : .55 }}>
                <div style={{ height: 20 }}><NbIcon name={t[0]} size={19}/></div>
                <div style={{ fontFamily: HW, fontSize: 13, color: c.ink, fontWeight: t[2] ? 700 : 400 }}>{t[1]}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── A · 프로필 메인 ──
  function ProfileScrapbook() {
    const badge = (name, icon, state, i) => (
      <div key={i} style={{ ...paper(i % 2 ? 0.8 : -0.8), padding: '13px 0 9px', textAlign: 'center', opacity: state === 'lock' ? .45 : 1, ...(state === 'on' ? { boxShadow: '0 2px 6px rgba(62,54,43,.14), 0 0 0 2px #C3B1E8' } : {}) }}>
        {state === 'on' && <div style={{ position: 'absolute', top: -8, right: -5, background: '#C3B1E8', border: `1.3px solid ${c.ink}`, fontFamily: HW, fontSize: 11, color: c.ink, padding: '0 5px', transform: 'rotate(4deg)' }}>장착</div>}
        <div style={{ height: 24 }}><NbIcon name={icon} size={22} color={state === 'lock' ? '#C9BFA8' : c.ink}/></div>
        <div style={{ fontFamily: HW, fontSize: 13, color: state === 'lock' ? c.soft : c.ink, marginTop: 4, whiteSpace: 'nowrap' }}>{state === 'lock' ? '???' : name}</div>
      </div>
    );
    const setting = (title, sub, right, rot) => (
      <div style={{ ...paper(rot), marginTop: 9, padding: '11px 13px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontFamily: HW, fontSize: 17, color: c.ink, lineHeight: 1.1 }}>{title}</div>
          <div style={{ fontSize: 10.5, color: c.soft, marginTop: 2 }}>{sub}</div>
        </div>
        {right}
      </div>
    );
    return (
      <Frame label="수첩 프로필">
        <div style={{ position: 'absolute', top: 44, left: 0, right: 0, bottom: 78, overflowY: 'auto', padding: '10px 20px 20px' }}>
          <div style={{ fontFamily: HW, fontSize: 30, color: c.ink }}>내 사원증</div>
          {/* MY CARD — 사원증 */}
          <div style={{ ...paper(-0.6), marginTop: 12, padding: '16px 15px 13px' }}>
            {tape(120)}
            <div style={{ display: 'flex', gap: 13 }}>
              <div style={{ ...paper(-2.5), padding: '5px 5px 2px', flexShrink: 0, alignSelf: 'flex-start' }}>
                <svg viewBox="0 0 64 70" width="70" height="76">
                  <path d="M18 24 Q16 8 32 8 Q48 8 46 24 L45 30 Q32 25 19 30 Z" fill="#6E7F78" stroke={c.ink} strokeWidth="2" strokeLinejoin="round"/>
                  <circle cx="32" cy="32" r="14" fill="#F6DCC0" stroke={c.ink} strokeWidth="2"/>
                  <circle cx="27" cy="31" r="1.4" fill={c.ink}/><circle cx="37" cy="31" r="1.4" fill={c.ink}/>
                  <path d="M28 38 H36" stroke={c.ink} strokeWidth="2" strokeLinecap="round"/>
                  <path d="M14 70 Q16 52 32 52 Q48 52 50 70" fill="#B8CBB0" stroke={c.ink} strokeWidth="2" strokeLinejoin="round"/>
                </svg>
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontFamily: HW, fontSize: 20, color: '#B4A88F', borderBottom: `1.7px solid rgba(62,54,43,.4)`, paddingBottom: 2, display: 'inline-block' }}>이름을 적어주세요 ✎</div>
                <div style={{ marginTop: 7, fontSize: 10, fontWeight: 800, letterSpacing: 1.5, color: c.soft }}>RANK</div>
                <div style={{ fontFamily: MONO, fontSize: 16, fontWeight: 700, color: c.ink, marginTop: 1 }}>Senior Nurse</div>
                <div style={{ marginTop: 6, display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: HW, fontSize: 12.5, color: c.ink, background: 'rgba(195,177,232,.4)', border: `1.3px solid ${c.ink}`, borderRadius: 2, padding: '0 6px', whiteSpace: 'nowrap' }}><NbIcon name="shield" size={13}/> 숨은 영웅</span>
                  <span style={{ fontSize: 10.5, color: c.soft, alignSelf: 'center', whiteSpace: 'nowrap' }}>EN-US · 미국 종합병원</span>
                </div>
              </div>
            </div>
            {/* 레벨 진행 — 연필 게이지 */}
            <div style={{ marginTop: 12 }}>
              <div style={{ display: 'flex', fontFamily: MONO, fontSize: 10, fontWeight: 700, color: c.soft }}>
                <span>LV 29</span><div style={{ flex: 1, textAlign: 'center' }}>69 / 100</div><span>LV 30</span>
              </div>
              <div style={{ marginTop: 4, height: 11, border: `1.7px solid ${c.ink}`, borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ width: '69%', height: '100%', background: 'repeating-linear-gradient(-45deg, rgba(95,141,90,.5) 0 6px, rgba(95,141,90,.32) 6px 12px)' }}/>
              </div>
              <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                <span style={{ fontFamily: HW, fontSize: 13.5, color: c.ink, background: 'rgba(249,227,123,.5)', border: `1.5px solid ${c.ink}`, borderRadius: 2, padding: '1px 8px', whiteSpace: 'nowrap' }}><NbIcon name="star" size={13} color="#C99A1E"/> LV 29</span>
                <span style={{ fontFamily: HW, fontSize: 13.5, color: c.green, border: `1.5px solid ${c.green}`, borderRadius: 2, padding: '1px 8px', whiteSpace: 'nowrap' }}>EN B1</span>
              </div>
            </div>
          </div>
          {/* 성장 리포트 배너 */}
          <div style={{ ...paper(0.5), marginTop: 13, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 11, background: 'rgba(95,141,90,.13)' }}>
            <NbIcon name="chartup" size={24}/>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontFamily: HW, fontSize: 18, color: c.ink, lineHeight: 1.05 }}>오늘의 성장 리포트</div>
              <div style={{ fontSize: 10.5, color: c.soft, marginTop: 2, whiteSpace: 'nowrap' }}>LV 29 · 2,869 XP · 1일 연속</div>
            </div>
            <span style={{ fontFamily: HW, fontSize: 18, color: c.ink }}>›</span>
          </div>
          {/* 내 동료 */}
          <div style={{ marginTop: 16, display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontFamily: HW, fontSize: 18, color: c.ink }}>내 동료</span>
            <div style={{ flex: 1 }}/>
            <span style={{ fontSize: 11, color: c.soft }}>0명 · 전체 ›</span>
          </div>
          <div style={{ ...paper(-0.4), marginTop: 8, padding: '12px 14px' }}>
            <div style={{ fontFamily: HW, fontSize: 15.5, color: c.soft, lineHeight: 1.35 }}>아직 동료가 없어요. 코드를 주고받아 서로의 학습을 응원해 보세요.</div>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: 10, paddingTop: 9, borderTop: `1.3px dashed rgba(62,54,43,.18)` }}>
              <div>
                <div style={{ fontSize: 10, color: c.soft }}>내 초대 코드</div>
                <div style={{ fontFamily: MONO, fontSize: 17, fontWeight: 700, color: c.ink, letterSpacing: 1 }}>2A-RWMH</div>
              </div>
              <div style={{ flex: 1 }}/>
              <div style={{ background: 'rgba(249,227,123,.55)', border: `1.7px solid ${c.ink}`, borderRadius: 3, fontFamily: HW, fontSize: 14.5, color: c.ink, padding: '6px 13px', transform: 'rotate(1deg)' }}>+ 추가</div>
            </div>
          </div>
          {/* CAREER PATH */}
          <div style={{ ...paper(0.4), marginTop: 13, padding: '13px 15px 15px', background: '#FCF3E4' }}>
            {tape(28, -6, 58)}
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.5, color: c.soft }}>CAREER PATH</div>
            <div style={{ display: 'flex', alignItems: 'flex-start', marginTop: 11 }}>
              {[['Learner','done'],['Junior','done'],['Senior','here'],['Head Nurse','todo']].map((s, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <div style={{ flex: 1, height: 2, background: s[1] === 'todo' ? '#D8CFBC' : 'rgba(95,141,90,.5)', marginTop: 12, minWidth: 14 }}/>}
                  <div style={{ textAlign: 'center', width: 64 }}>
                    <div style={{ width: 25, height: 25, margin: '0 auto', border: `1.7px solid ${s[1] === 'todo' ? c.soft : c.ink}`, borderRadius: 4, background: s[1] === 'here' ? 'rgba(249,227,123,.6)' : c.paper, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HW, fontSize: 14, color: c.ink, transform: `rotate(${i % 2 ? 2 : -2}deg)` }}>
                      {s[1] === 'done' ? <svg viewBox="0 0 24 24" width="17" height="17"><path d="M5 12 L10 17 L20 6" fill="none" stroke={c.green} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/></svg> : i + 1}
                    </div>
                    <div style={{ fontFamily: HW, fontSize: 12.5, color: s[1] === 'todo' ? c.soft : c.ink, marginTop: 3, lineHeight: 1.1 }}>{s[0]}</div>
                    {s[1] === 'here' && <div style={{ fontSize: 8.5, fontWeight: 800, color: '#C77E2E', marginTop: 1 }}>● HERE</div>}
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
          {/* 칭호 */}
          <div style={{ marginTop: 16, display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontFamily: HW, fontSize: 18, color: c.ink }}>칭호</span>
            <div style={{ flex: 1 }}/>
            <span style={{ fontSize: 11, color: c.soft }}>9 / 15</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 9, marginTop: 8 }}>
            {badge('새내기','pencil','open',0)}{badge('간호사 캡','pill','open',1)}{badge('청진기','monitor','open',2)}{badge('사흘의 성실','star','open',3)}
            {badge('','baby','lock',4)}{badge('숨은 영웅','lock','on',5)}{badge('응급실 에이스','siren','open',6)}{badge('','speech','lock',7)}
          </div>
          {/* 히든 미션 */}
          <div style={{ marginTop: 16, display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontFamily: HW, fontSize: 18, color: c.ink }}>히든 미션</span>
            <div style={{ flex: 1 }}/>
            <span style={{ fontSize: 11, color: c.soft }}>1 / 3</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginTop: 8 }}>
            <div style={{ ...paper(-0.8), padding: '14px 0 10px', textAlign: 'center', background: 'rgba(95,141,90,.15)' }}>
              <NbIcon name="compass" size={22}/>
              <div style={{ fontFamily: HW, fontSize: 13.5, color: c.ink, marginTop: 4 }}>베테랑</div>
            </div>
            {[0,1].map(i => (
              <div key={i} style={{ ...paper(i ? 0.6 : 0.3), padding: '14px 0 10px', textAlign: 'center', opacity: .5 }}>
                <div style={{ fontFamily: HW, fontSize: 19, color: c.soft }}>?</div>
                <div style={{ fontFamily: HW, fontSize: 13.5, color: c.soft, marginTop: 2 }}>???</div>
              </div>
            ))}
          </div>
          {/* 설정 */}
          <div style={{ marginTop: 16, fontFamily: HW, fontSize: 18, color: c.ink }}>언어</div>
          {setting('앱 언어', '화면에 보이는 말이 한국어로 나와요.', <span style={{ fontFamily: HW, fontSize: 15, color: c.ink, whiteSpace: 'nowrap' }}>한국어 ›</span>, -0.3)}
          {setting('배우는 언어', 'English · 온보딩에서 고른 나라로 정해져요.', null, 0.3)}
          <div style={{ marginTop: 14, fontFamily: HW, fontSize: 18, color: c.ink }}>소리</div>
          {setting('효과음', '모든 효과음이 꺼져 있어요.', (
            <div style={{ width: 40, height: 21, border: `1.7px solid ${c.ink}`, borderRadius: 2, display: 'flex', flexShrink: 0 }}>
              <div style={{ width: 18, background: c.ink }}/>
            </div>
          ), -0.3)}
          <div style={{ marginTop: 14, fontFamily: HW, fontSize: 18, color: c.ink }}>계정</div>
          {setting('로그아웃', '이 기기에서 로그아웃하고 로그인 화면으로 돌아가요.', <span style={{ fontFamily: HW, fontSize: 17, color: c.ink }}>›</span>, 0.3)}
        </div>
      </Frame>
    );
  }

  // ── B · 성장 리포트 (달력 + 4스탯) ──
  function GrowthScrapbook() {
    const cellS = { day: 'rgba(249,227,123,.65)', eve: 'rgba(233,150,100,.35)', night: 'rgba(195,177,232,.45)' };
    const cal = [
      null, null, null, null, null, [1], [2],
      [3], [4], [5], [6], [7], [8], [9],
      [10], [11], [12,'eve'], [13,'eve'], [14], [15], [16],
      [17], [18,'day'], [19], [20], [21,'eve','sel'], [22], [23],
      [24,'eve'], [25,'eve'], [26,'eve'], [27,'day'], [28], [29], [30],
      [31,'day'],
    ];
    return (
      <Frame label="수첩 성장 리포트" nav={false}>
        <div style={{ position: 'absolute', top: 44, left: 0, right: 0, height: 40, display: 'flex', alignItems: 'center', padding: '0 18px', zIndex: 5 }}>
          <div style={{ ...paper(-0.5), padding: '4px 11px', fontFamily: HW, fontSize: 14, color: c.ink }}>‹ 돌아가기</div>
          <div style={{ flex: 1, textAlign: 'center', fontFamily: MONO, fontSize: 12, fontWeight: 700, color: c.ink }}>TODAY · 9월 1일</div>
          <span style={{ fontFamily: HW, fontSize: 15, color: c.soft }}>화요일</span>
        </div>
        <div style={{ position: 'absolute', top: 90, left: 0, right: 0, bottom: 0, overflowY: 'auto', padding: '4px 20px 24px' }}>
          {/* 달력 */}
          <div style={{ ...paper(-0.4), padding: '13px 13px 11px' }}>
            {tape(120)}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ ...paper(0), width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HW, fontSize: 14 }}>‹</div>
              <div style={{ flex: 1, textAlign: 'center', fontFamily: HW, fontSize: 19, color: c.ink }}>2026년 8월</div>
              <div style={{ ...paper(0), width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HW, fontSize: 14 }}>›</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4, marginTop: 9 }}>
              {['월','화','수','목','금','토','일'].map(d => <div key={d} style={{ textAlign: 'center', fontFamily: HW, fontSize: 12.5, color: c.soft }}>{d}</div>)}
              {cal.map((d, i) => d === null
                ? <div key={i}/>
                : <div key={i} style={{ height: 34, border: `1.4px solid ${d[2] === 'sel' ? c.ink : '#E0D6C0'}`, borderRadius: 3, background: d[1] ? cellS[d[1]] : c.paper, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: d[2] === 'sel' ? 'rotate(-1.5deg)' : 'none', boxShadow: d[2] === 'sel' ? '1.5px 1.5px 0 rgba(62,54,43,.3)' : 'none' }}>
                    <span style={{ fontFamily: MONO, fontSize: 10.5, fontWeight: 700, color: d[1] ? c.ink : '#C9BFA8' }}>{d[0]}</span>
                    
                  </div>)}
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 9, fontFamily: HW, fontSize: 12, color: c.soft }}>
              <span><span style={{ display: 'inline-block', width: 9, height: 9, background: cellS.day, border: `1.2px solid ${c.ink}`, verticalAlign: '-1px' }}/> 데이</span>
              <span><span style={{ display: 'inline-block', width: 9, height: 9, background: cellS.eve, border: `1.2px solid ${c.ink}`, verticalAlign: '-1px' }}/> 이브닝</span>
              <span><span style={{ display: 'inline-block', width: 9, height: 9, background: cellS.night, border: `1.2px solid ${c.ink}`, verticalAlign: '-1px' }}/> 나이트</span>
            </div>
            <div style={{ fontSize: 10, color: c.soft, marginTop: 5, lineHeight: 1.5 }}>학습을 시작한 시각으로 근무대를 표시해요.</div>
            {/* 선택한 날 상세 */}
            <div style={{ marginTop: 10, border: `1.5px solid ${c.ink}`, borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', background: cellS.eve, padding: '7px 10px', borderBottom: `1.5px solid ${c.ink}` }}>
                <span style={{ fontFamily: HW, fontSize: 15, color: c.ink }}>8월 21일 (금) · 이브닝</span>
                <div style={{ flex: 1 }}/>
                <span style={{ fontFamily: HW, fontSize: 13, color: c.ink }}>2/2 완료</span>
              </div>
              {[['19:00','흉통 환자 트리아지'],['19:24','통증 사정 — Mrs. Hopkins']].map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderTop: i ? `1.2px dashed rgba(62,54,43,.15)` : 'none' }}>
                  <span style={{ fontFamily: MONO, fontSize: 10, fontWeight: 700, color: c.soft }}>{r[0]}</span>
                  <span style={{ fontFamily: HW, fontSize: 14.5, color: c.ink, flex: 1, minWidth: 0 }}>{r[1]}</span>
                  <svg viewBox="0 0 24 24" width="15" height="15"><path d="M5 12 L10 17 L20 6" fill="none" stroke={c.green} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              ))}
            </div>
          </div>
          {/* 오늘의 성장 리포트 카드 */}
          <div style={{ ...paper(0.5), marginTop: 14, padding: '14px 15px', background: 'rgba(95,141,90,.14)' }}>
            <div style={{ fontSize: 10.5, color: c.soft }}>오늘의 성장 리포트</div>
            <div style={{ fontFamily: HW, fontSize: 22, color: c.ink, marginTop: 4 }}>오늘도 출근했어요!</div>
            <div style={{ fontFamily: HW, fontSize: 17, color: c.ink, marginTop: 2 }}><mark style={{ background: 'linear-gradient(transparent 55%, #F9E37B 55%)', padding: '0 2px' }}>1일 연속</mark> 성장 중이에요</div>
            <div style={{ display: 'flex', gap: 7, marginTop: 9 }}>
              <span style={{ fontFamily: HW, fontSize: 13, color: c.ink, background: 'rgba(249,227,123,.6)', border: `1.5px solid ${c.ink}`, borderRadius: 2, padding: '1px 8px', whiteSpace: 'nowrap' }}>최장 4일</span>
              <span style={{ fontFamily: MONO, fontSize: 11.5, fontWeight: 700, color: c.ink, border: `1.5px solid ${c.ink}`, borderRadius: 2, padding: '2px 8px', whiteSpace: 'nowrap' }}>2,869 XP</span>
            </div>
          </div>
          {/* 4스탯 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 12 }}>
            {[['시나리오','0','이번 주 완료',-0.5],['새 표현','12','이번 주 배움',0.5],['대화 시간','4분','이번 주 현장',-0.4],['레벨','Lv.29','Senior Nurse',0.4]].map((s, i) => (
              <div key={i} style={{ ...paper(s[3]), padding: '11px 13px' }}>
                <div style={{ fontSize: 10.5, color: c.soft }}>{s[0]}</div>
                <div style={{ fontFamily: HW, fontSize: 24, color: c.ink, marginTop: 2, lineHeight: 1 }}>{s[1]}</div>
                <div style={{ fontSize: 10, color: c.soft, marginTop: 3 }}>{s[2]}</div>
              </div>
            ))}
          </div>
          {/* CTA */}
          <div style={{ marginTop: 15, background: c.ink, color: c.paper, padding: '13px 0', textAlign: 'center', fontFamily: HW, fontSize: 18, borderRadius: 3, boxShadow: '3px 3px 0 rgba(62,54,43,.3)' }}>오늘의 근무 시작하기 ✎</div>
        </div>
      </Frame>
    );
  }

  // ── C · 동료 추가 — 초대 코드 주고받기 ──
  function ColleagueAddScrapbook() {
    return (
      <Frame label="수첩 동료 추가" nav={false}>
        <div style={{ position: 'absolute', top: 52, left: 18, right: 18, display: 'flex', alignItems: 'center', gap: 11 }}>
          <div style={{ ...paper(-1), width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HW, fontSize: 16, color: c.ink, flexShrink: 0 }}>‹</div>
          <div>
            <div style={{ fontFamily: HW, fontSize: 23, color: c.ink, lineHeight: 1 }}>동료 추가</div>
            <div style={{ fontSize: 11, color: c.soft, marginTop: 3 }}>초대 코드를 주고받아 연결해요</div>
          </div>
        </div>
        <div style={{ position: 'absolute', top: 116, left: 0, right: 0, bottom: 0, overflowY: 'auto', padding: '4px 20px 24px' }}>
          {/* 내 초대 코드 — 큰 코드 줅지 */}
          <div style={{ ...paper(-0.6), padding: '17px 15px 14px', background: 'rgba(95,141,90,.15)', textAlign: 'center' }}>
            {tape(140)}
            <div style={{ fontFamily: HW, fontSize: 14.5, color: c.soft }}>내 초대 코드</div>
            <div style={{ fontFamily: MONO, fontSize: 34, fontWeight: 700, color: c.ink, letterSpacing: 4, marginTop: 4 }}>2A-RWMH</div>
            <div style={{ fontSize: 10.5, color: c.soft, marginTop: 4 }}>7일간 유효 · 최대 10명 (현재 0명)</div>
            <div style={{ display: 'flex', gap: 9, marginTop: 12 }}>
              <div style={{ ...paper(-0.5), flex: 1, padding: '9px 0', fontFamily: HW, fontSize: 15.5, color: c.ink }}>⧉ 복사</div>
              <div style={{ flex: 1, background: c.ink, color: c.paper, border: `1px solid ${c.ink}`, borderRadius: 2, padding: '9px 0', fontFamily: HW, fontSize: 15.5, transform: 'rotate(0.5deg)', boxShadow: '2px 2px 0 rgba(62,54,43,.25)' }}>↑ 공유</div>
            </div>
          </div>
          {/* 또는 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '17px 4px 0' }}>
            <div style={{ flex: 1, borderTop: `1.5px dashed rgba(62,54,43,.3)` }}/>
            <span style={{ fontFamily: HW, fontSize: 14, color: c.soft }}>또는</span>
            <div style={{ flex: 1, borderTop: `1.5px dashed rgba(62,54,43,.3)` }}/>
          </div>
          {/* 받은 코드 입력 — 밑줄 필기란 */}
          <div style={{ marginTop: 14, fontFamily: HW, fontSize: 16.5, color: c.ink }}>받은 코드 적기</div>
          <div style={{ ...paper(0.4), marginTop: 8, padding: '13px 0', textAlign: 'center', boxShadow: '0 2px 6px rgba(62,54,43,.14), 0 0 0 2px #E9C45A' }}>
            <span style={{ fontFamily: MONO, fontSize: 20, fontWeight: 700, color: '#C9BFA8', letterSpacing: 5 }}>XX-XXXX</span>
          </div>
          <div style={{ marginTop: 12, background: '#B8AE9C', color: c.paper, borderRadius: 3, padding: '12px 0', textAlign: 'center', fontFamily: HW, fontSize: 17 }}>동료 요청 보내기</div>
          {/* 안내 메모 */}
          <div style={{ marginTop: 13, padding: '9px 12px', border: `1.4px dashed ${c.soft}`, borderRadius: 3, fontFamily: HW, fontSize: 14, color: c.soft, lineHeight: 1.5, transform: 'rotate(-0.3deg)' }}>
            ✒ 상대가 수락하면 서로의 <b style={{ color: c.ink }}>학습 현황</b>과 <b style={{ color: c.ink }}>응원</b>을 주고받을 수 있어요. 공개 범위는 언제든 바꿀 수 있습니다.
          </div>
        </div>
      </Frame>
    );
  }

  Object.assign(window, { ProfileScrapbook, GrowthScrapbook, ColleagueAddScrapbook });
})();
