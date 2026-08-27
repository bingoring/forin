// screen-home.jsx — 홈 탭 (앱 진입 첫 화면).
//
// 왜 필요한가: 캠퍼스 탭은 커리큘럼·건물·상황이 모두 "목록"으로 펼쳐져 있어
// 앱을 켜자마자 마주하면 압박감이 든다. 홈은 그 반대 원칙으로 만든다.
//   · 목록이 아니라 "오늘 할 딱 한 가지"만 크게 — 고르는 부담을 없앤다
//   · 성취를 먼저(연속·주간 리듬), 과제는 그 다음
//   · 나머지는 얕은 '문' 카드로만
//
// 홈에서만 보여주는 것 (다른 탭에는 없는 모듈):
//   · 근무 배지 — 오늘의 근무(데이/이브닝)와 배치된 과, 날씨까지 세계관 연출
//   · 멘토 쪽지 — 선임 간호사 NPC가 매일 남기는 한 줄
//   · 오늘의 한마디 — 표현 1개 (앞/뒤 뒤집기 카드)
//   · 다음 뱃지까지 — 마일스톤 근접 알림
//   · 동료 소식 — 같은 목표 학습자들의 활동 티커

(function () {
  const T = () => window.ForinTokens;

  // ── 근무 배지 (홈 전용) — 오늘의 근무·배치·날씨 ────────────────────
  function ShiftBadge() {
    const t = T();
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, margin: '0 16px',
        background: t.ink, border: `3px solid ${t.ink}`, boxShadow: `3px 3px 0 0 ${t.ink}`, padding: '9px 11px' }}>
        <div style={{ background: t.mint, border: `2px solid ${t.ink}`, padding: '2px 6px',
          fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: t.ink, flexShrink: 0 }}>DAY</div>
        <div style={{ minWidth: 0, flex: 1, fontFamily: '"Galmuri11",monospace', fontSize: 10.5, color: t.cream, lineHeight: 1.3 }}>
          오늘 배치 · <b style={{ color: t.mint }}>본관 1F 응급의료센터</b>
        </div>
        <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: t.cream, opacity: .8, flexShrink: 0 }}>☀ 27°</div>
      </div>
    );
  }

  function Greeting({ done }) {
    const t = T();
    return (
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, padding: '48px 16px 12px' }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 11, color: t.textSoft }}>8월 7일 금요일 · 아침</div>
          <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 19, color: t.ink, marginTop: 5, lineHeight: 1.3 }}>
            {done ? '오늘 몫은 끝냈어요 👏' : '지원님, 천천히 시작해요'}
          </div>
        </div>
        {/* 홈에서만: 내 캐릭터가 인사 */}
        <div style={{ width: 58, height: 58, flexShrink: 0, background: t.blue, border: `3px solid ${t.ink}`,
          boxShadow: `3px 3px 0 0 ${t.ink}`, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', overflow: 'hidden' }}>
          {window.SmoothSprite
            ? <window.SmoothSprite width={52} hair="#3C2A18" hairStyle="ponytail" skin="#F8D7B2"
                shirt="#A7F3D0" shirtDk="#4FC79D" leg="#475569" expression="happy" dir="down"/>
            : <div style={{ fontSize: 26, paddingBottom: 6 }}>🧑‍⚕️</div>}
        </div>
      </div>
    );
  }

  // 성취 먼저 — 연속일 + 주간 리듬
  function StreakStrip() {
    const t = T();
    const week = [1, 1, 1, 0, 1, 1, 2];
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: t.peach,
        border: `3px solid ${t.ink}`, boxShadow: `3px 3px 0 0 ${t.peachShadow}`, padding: '11px 13px', margin: '12px 16px 0' }}>
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          <div style={{ fontSize: 19, lineHeight: 1 }}>🔥</div>
          <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 17, color: t.ink, marginTop: 3 }}>12</div>
          <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 9, color: t.text }}>연속</div>
        </div>
        <div style={{ width: 3, alignSelf: 'stretch', background: t.ink + '22' }}/>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 10, color: t.text, marginBottom: 7 }}>이번 주</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {week.map((d, i) => (
              <div key={i} style={{ flex: 1, height: 14,
                background: d === 2 ? t.yellow : d === 1 ? t.mint : '#fff',
                border: `2px solid ${d === 0 ? t.ink + '44' : t.ink}` }}/>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 오늘의 한 가지 — 화면에서 가장 큰 단 하나
  function TodayOne() {
    const t = T();
    return (
      <div style={{ margin: '13px 16px 0', background: t.mint, border: `3px solid ${t.ink}`,
        boxShadow: `4px 4px 0 0 ${t.mintShadow}`, padding: '14px 14px 13px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: -9, left: 12, background: t.ink, color: t.cream,
          padding: '2px 7px', fontFamily: '"DungGeunMo",monospace', fontSize: 9 }}>오늘의 한 가지</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginTop: 4 }}>
          <div style={{ width: 44, height: 44, flexShrink: 0, background: '#fff', border: `2.5px solid ${t.ink}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>💬</div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 10, color: t.ink, opacity: .75 }}>CHAPTER 2 · 응급실 트리아지</div>
            <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 15, color: t.ink, marginTop: 3, lineHeight: 1.3 }}>보호자에게 대기 안내하기</div>
            <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 10, color: t.ink, opacity: .7, marginTop: 4 }}>대화 · 약 6분이면 충분해요</div>
          </div>
        </div>
        <div style={{ marginTop: 12, background: t.ink, color: t.cream, border: `2.5px solid ${t.ink}`,
          padding: '11px 0', textAlign: 'center', fontFamily: '"DungGeunMo",monospace', fontSize: 14 }}>▶ 시작하기</div>
      </div>
    );
  }

  // 멘토 쪽지 (홈 전용) — 선임 NPC가 남긴 한 줄
  function MentorNote() {
    const t = T();
    return (
      <div style={{ display: 'flex', gap: 10, margin: '13px 16px 0', background: t.peach,
        border: `3px solid ${t.ink}`, boxShadow: `3px 3px 0 0 ${t.peachShadow || t.ink}`, padding: '11px 12px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: -9, left: 12, background: '#fff', border: `2px solid ${t.ink}`,
          padding: '1px 6px', fontFamily: '"DungGeunMo",monospace', fontSize: 9, color: t.ink }}>멘토 쪽지</div>
        <div style={{ width: 34, height: 34, flexShrink: 0, marginTop: 3, background: '#fff', border: `2px solid ${t.ink}`,
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center', overflow: 'hidden' }}>
          {window.SmoothSprite
            ? <window.SmoothSprite width={30} hair="#5C3A1A" hairStyle="bob" skin="#F0C8A0" shirt="#A5D8E8" shirtDk="#5FA8C4" leg="#475569" expression="neutral" dir="down"/>
            : <div style={{ fontSize: 17 }}>👩‍⚕️</div>}
        </div>
        <div style={{ minWidth: 0, flex: 1, marginTop: 2 }}>
          <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 11.5, color: t.ink, lineHeight: 1.5 }}>
            “보호자가 화를 낼 땐 정보를 더 주기 전에 감정을 먼저 인정해줘요.”
          </div>
          <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 9, color: t.text, marginTop: 5 }}>— 수간호사 Emma · ER</div>
        </div>
      </div>
    );
  }

  // 오늘의 한마디 (홈 전용) — 표현 1개, 뒤집기 카드
  function PhraseOfDay() {
    const t = T();
    return (
      <div style={{ margin: '13px 16px 0', background: t.cream, border: `3px solid ${t.ink}`,
        boxShadow: `3px 3px 0 0 ${t.ink}`, padding: '12px 13px', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <span style={{ fontSize: 13 }}>💡</span>
          <span style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 10.5, color: t.ink }}>오늘의 한마디</span>
          <div style={{ flex: 1 }}/>
          <span style={{ fontFamily: '"Galmuri11",monospace', fontSize: 9, color: t.textSoft }}>탭하면 뜻 보기</span>
        </div>
        <div style={{ background: t.cream, border: `2.5px dashed ${t.ink}66`, padding: '13px 10px', textAlign: 'center' }}>
          <div style={{ fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 15, color: t.ink, lineHeight: 1.35 }}>
            “Bear with me for a moment.”
          </div>
          <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 10, color: t.textSoft, marginTop: 6 }}>
            잠시만 기다려 주시겠어요 · 대기 안내에 자주 씀
          </div>
        </div>
      </div>
    );
  }

  // 다음 뱃지까지 (홈 전용) — 마일스톤 근접
  function NextBadge() {
    const t = T();
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 11, margin: '13px 16px 0',
        background: t.lilac || '#DDD6FE', border: `3px solid ${t.ink}`, boxShadow: `3px 3px 0 0 ${t.ink}`, padding: '11px 12px' }}>
        <div style={{ width: 36, height: 36, flexShrink: 0, background: '#fff', border: `2.5px solid ${t.ink}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🏅</div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 11.5, color: t.ink }}>다음 뱃지 · ER 트리아지 마스터</div>
          <div style={{ height: 10, background: '#fff', border: `2px solid ${t.ink}`, marginTop: 6, position: 'relative' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '75%', background: t.ink }}/>
          </div>
          <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 9.5, color: t.ink, opacity: .75, marginTop: 4 }}>
            2개 시나리오만 더 하면 획득!
          </div>
        </div>
      </div>
    );
  }

  // 가벼운 입구 2개
  function Doors() {
    const t = T();
    const door = (icon, title, sub, bg, subColor) => (
      <div style={{ flex: 1, background: bg, border: `3px solid ${t.ink}`, boxShadow: `3px 3px 0 0 ${t.ink}`, padding: '12px 11px' }}>
        <div style={{ fontSize: 19 }}>{icon}</div>
        <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 12, color: t.ink, marginTop: 7 }}>{title}</div>
        <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 9.5, color: subColor || t.textSoft, marginTop: 3, lineHeight: 1.4, whiteSpace: 'pre-line' }}>{sub}</div>
      </div>
    );
    return (
      <div style={{ display: 'flex', gap: 10, margin: '13px 16px 0' }}>
        {door('🗺', '둘러보기', '건물·층에서\n원하는 과 고르기', '#fff')}
        {door('📋', '오늘의 상황', '지금 벌어진 일\n5건 대기중', t.blue || '#BAE6FD', t.text)}
      </div>
    );
  }

  // 어제 놓친 것 하나만
  function OneReview() {
    const t = T();
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '13px 16px 0',
        background: t.yellow, border: `3px solid ${t.ink}`, boxShadow: `3px 3px 0 0 ${t.yellowShadow}`, padding: '10px 12px' }}>
        <div style={{ width: 26, height: 26, flexShrink: 0, background: '#fff', border: `2px solid ${t.ink}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>📓</div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 11.5, color: t.ink, lineHeight: 1.25 }}>어제 틀린 표현 하나만 다시 볼까요?</div>
          <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 9.5, color: t.text, marginTop: 3 }}>“radiate” · 1분</div>
        </div>
        <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 13, color: t.ink }}>›</div>
      </div>
    );
  }

  // 동료 소식 (홈 전용) — 코드로 릺은 동료들의 활동 + 응원 진입
  function PeerTicker() {
    const t = T();
    const rows = [
      ['🇦🇺', '민서', 'ICU 승압제 시나리오 클리어', true],
      ['🇺🇸', 'Jae', '연속 30일 달성', true],
      ['🇬🇧', '하늘', 'ER 트리아지 마스터 획득', false],
    ];
    return (
      <div style={{ margin: '13px 16px 0', background: t.pink, border: `3px solid ${t.ink}`, boxShadow: `3px 3px 0 0 ${t.ink}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px 6px', borderBottom: `2px dotted ${t.ink}33` }}>
          <span style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 10.5, color: t.ink }}>🤝 내 동료</span>
          <span style={{ background: t.mint, border: `1.5px solid ${t.ink}`, fontFamily: '"DungGeunMo",monospace', fontSize: 8.5, color: t.ink, padding: '0 4px' }}>4</span>
          <div style={{ flex: 1 }}/>
          <span style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 9.5, color: t.text }}>프로필 ›</span>
        </div>
        {rows.map((r, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 12px',
            borderBottom: i < rows.length - 1 ? `1.5px dotted ${t.ink}22` : 'none' }}>
            {r[3] && <span style={{ width: 6, height: 6, background: t.mintShadow, border: `1.5px solid ${t.ink}`, flexShrink: 0 }}/>}
            {!r[3] && <span style={{ width: 6, flexShrink: 0 }}/>}
            <span style={{ fontSize: 12 }}>{r[0]}</span>
            <span style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: t.ink, flexShrink: 0 }}>{r[1]}</span>
            <span style={{ fontFamily: '"Galmuri11",monospace', fontSize: 10, color: t.text, minWidth: 0, flex: 1, lineHeight: 1.25 }}>{r[2]}</span>
            <span style={{ background: t.yellow, border: `1.5px solid ${t.ink}`, fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: t.ink, padding: '1px 5px', flexShrink: 0 }}>👏</span>
          </div>
        ))}
        <div style={{ padding: '8px 12px', borderTop: `2px dotted ${t.ink}33`, display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ fontFamily: '"Galmuri11",monospace', fontSize: 10, color: t.text, flex: 1 }}>동료 관리는 프로필에서</span>
          <span style={{ background: '#fff', border: `2px solid ${t.ink}`, fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: t.ink, padding: '3px 8px' }}>+ 추가</span>
        </div>
      </div>
    );
  }

  function Shell({ label, children }) {
    const t = T();
    return (
      <div data-screen-label={label} style={{ height: '100%', background: t.paper, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, bottom: 62, overflowY: 'auto', paddingBottom: 24 }}>
          {children}
        </div>
        <window.ForinBottomNav active="home"/>
      </div>
    );
  }

  // ══ 기본 상태 ══════════════════════════════════════════════════════
  function ScreenHome() {
    return (
      <Shell label="Home · 기본">
        <Greeting done={false}/>
        <ShiftBadge/>
        <StreakStrip/>
        <TodayOne/>
        <MentorNote/>
        <PhraseOfDay/>
        <Doors/>
        <NextBadge/>
        <OneReview/>
        <PeerTicker/>
      </Shell>
    );
  }

  // ══ 오늘 완료 상태 — 더 시키지 않고 쉬어도 된다고 말해준다 ═════════
  function ScreenHomeDone() {
    const t = T();
    return (
      <Shell label="Home · 오늘 완료">
        <Greeting done={true}/>
        <ShiftBadge/>
        <StreakStrip/>
        <div style={{ margin: '13px 16px 0', background: t.cream, border: `3px solid ${t.ink}`,
          boxShadow: `4px 4px 0 0 ${t.ink}`, padding: '18px 14px', textAlign: 'center' }}>
          <div style={{ fontSize: 34 }}>🌙</div>
          <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 14, color: t.ink, marginTop: 9 }}>오늘 목표를 다 채웠어요</div>
          <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 11, color: t.textSoft, marginTop: 6, lineHeight: 1.6 }}>
            13일째 연속이 눈앞이에요.<br/>여기서 멈춰도 괜찮아요.
          </div>
          <div style={{ display: 'inline-block', marginTop: 12, background: '#fff', border: `2.5px solid ${t.ink}`,
            boxShadow: `2.5px 2.5px 0 0 ${t.ink}`, padding: '8px 16px', fontFamily: '"DungGeunMo",monospace', fontSize: 12, color: t.ink }}>
            + 한 판 더 하기
          </div>
        </div>
        <NextBadge/>
        <PhraseOfDay/>
        <Doors/>
        <OneReview/>
        <PeerTicker/>
      </Shell>
    );
  }

  Object.assign(window, { ScreenHome, ScreenHomeDone });
})();
