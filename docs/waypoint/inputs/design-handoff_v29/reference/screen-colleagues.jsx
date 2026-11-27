// screen-colleagues.jsx — 동료(Colleague) 시스템.
//
// 왜: 홈의 "같은 목표를 준비하는 사람들"은 익명 티커라 관계가 남지 않는다.
// 여기에 초대 코드로 맺는 **동료 관계**를 얹어, 서로 학습 현황을 보고 응원을
// 주고받게 한다. 관계 종류를 데이터에 두어(peer / mentor / mentee) 훗날
// 현지인 멘토–멘티로 확장해도 화면 구조를 바꾸지 않아도 되게 설계.
//
//   ScreenColleagues      동료 목록 (내 코드 · 응원 인박스 · 관계 뱃지)
//   ScreenColleagueAdd    코드로 추가 (내 코드 공유 / 코드 입력)
//   ScreenColleagueDetail 동료 프로필 (학습 현황 · 주고받은 응원)
//   ScreenCheerCompose    응원 보내기 시트 (프리셋 + 한마디)

(function () {
  const T = () => window.ForinTokens;

  // 관계 유형 — 지금은 peer 중심, mentor/mentee는 확장 슬롯
  const REL = {
    peer:   { label: '동료', icon: '🤝', bg: 'mint' },
    mentor: { label: '멘토', icon: '⭐', bg: 'yellow' },
    mentee: { label: '멘티', icon: '🌱', bg: 'blue' },
  };

  const PEOPLE = [
    { id: 1, name: '민서', flag: '🇦🇺', rel: 'peer', lv: 'B1', streak: 21, today: true,
      now: 'ICU 승압제 적정 진행 중', hair: '#3C2A18', style: 'long', shirt: '#A5D8E8' },
    { id: 2, name: 'Jae', flag: '🇺🇸', rel: 'peer', lv: 'B2', streak: 30, today: true,
      now: '수술 전 체크리스트', hair: '#1F2937', style: 'short', shirt: '#A7F3D0' },
    { id: 3, name: '하늘', flag: '🇬🇧', rel: 'peer', lv: 'A2', streak: 4, today: false,
      now: '어제 · ER 트리아지', hair: '#7C3F00', style: 'ponytail', shirt: '#FBCFE8' },
    { id: 4, name: 'Emma', flag: '🇦🇺', rel: 'mentor', lv: '현지 RN', streak: 0, today: true,
      now: '시드니 ER 5년차 · 주 1회 피드백', hair: '#5C3A1A', style: 'bob', shirt: '#DDD6FE' },
  ];

  const Sprite = ({ p, size = 34 }) => (
    window.SmoothSprite
      ? <window.SmoothSprite width={size} hair={p.hair} hairStyle={p.style} skin="#F4D2AE"
          shirt={p.shirt} shirtDk="#4FC79D" leg="#475569" expression="happy" dir="down"/>
      : <div style={{ fontSize: size * 0.55 }}>🧑‍⚕️</div>
  );

  function Head({ title, sub, back }) {
    const t = T();
    return (
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, background: t.cream,
        borderBottom: `3px solid ${t.ink}`, padding: '48px 14px 11px', zIndex: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          {back && <div style={{ background: '#fff', border: `2px solid ${t.ink}`, boxShadow: `2px 2px 0 0 ${t.ink}`,
            padding: '3px 8px', fontFamily: '"DungGeunMo",monospace', fontSize: 12, color: t.ink }}>‹</div>}
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 16, color: t.ink }}>{title}</div>
            {sub && <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 10, color: t.textSoft, marginTop: 3 }}>{sub}</div>}
          </div>
        </div>
      </div>
    );
  }

  const Body = ({ children }) => (
    <div style={{ position: 'absolute', top: 104, left: 0, right: 0, bottom: 62, overflowY: 'auto', padding: '13px 16px 24px' }}>{children}</div>
  );

  function Shell({ label, children }) {
    const t = T();
    return (
      <div data-screen-label={label} style={{ height: '100%', background: t.paper, position: 'relative', overflow: 'hidden' }}>
        {children}
        <window.ForinBottomNav active="home"/>
      </div>
    );
  }

  const RelTag = ({ rel }) => {
    const t = T(); const r = REL[rel];
    return <span style={{ background: t[r.bg], border: `1.5px solid ${t.ink}`, padding: '1px 5px',
      fontFamily: '"DungGeunMo",monospace', fontSize: 8.5, color: t.ink, flexShrink: 0 }}>{r.icon} {r.label}</span>;
  };

  // ══ 1 · 동료 목록 ═══════════════════════════════════════════════════
  function ScreenColleagues() {
    const t = T();
    return (
      <Shell label="Colleagues · 목록">
        <Head title="동료" sub="함께 준비하는 사람들 · 4명"/>
        <Body>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, background: t.ink,
            border: `3px solid ${t.ink}`, boxShadow: `3px 3px 0 0 ${t.ink}`, padding: '11px 12px', marginBottom: 13 }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 9.5, color: t.cream, opacity: .75 }}>내 초대 코드</div>
              <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 19, color: t.mint, letterSpacing: 2, marginTop: 3 }}>K7-N4XQ</div>
            </div>
            <div style={{ background: t.mint, border: `2px solid ${t.ink}`, padding: '6px 9px',
              fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: t.ink, flexShrink: 0 }}>공유</div>
            <div style={{ background: '#fff', border: `2px solid ${t.ink}`, padding: '6px 9px',
              fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: t.ink, flexShrink: 0 }}>+ 추가</div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 9, background: t.peach,
            border: `3px solid ${t.ink}`, boxShadow: `3px 3px 0 0 ${t.peachShadow || t.ink}`, padding: '10px 12px', marginBottom: 14 }}>
            <div style={{ fontSize: 17 }}>💌</div>
            <div style={{ minWidth: 0, flex: 1, fontFamily: '"Galmuri11",monospace', fontSize: 11, color: t.ink, lineHeight: 1.4 }}>
              <b>민서</b>님이 응원을 보냈어요 · 외 1건
            </div>
            <div style={{ background: t.ink, color: t.cream, border: `2px solid ${t.ink}`, padding: '4px 8px',
              fontFamily: '"DungGeunMo",monospace', fontSize: 10, flexShrink: 0 }}>열기</div>
          </div>

          <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: t.ink, marginBottom: 8 }}>━ 내 동료 ━━━━━━━━━</div>
          {PEOPLE.map(p => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#fff',
              border: `3px solid ${t.ink}`, boxShadow: `3px 3px 0 0 ${t.ink}`, padding: '10px 11px', marginBottom: 9 }}>
              <div style={{ width: 40, height: 40, flexShrink: 0, background: t.cream, border: `2px solid ${t.ink}`,
                display: 'flex', alignItems: 'flex-end', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                <Sprite p={p} size={36}/>
                {p.today && <div style={{ position: 'absolute', top: 2, right: 2, width: 7, height: 7,
                  background: t.mintShadow, border: `1.5px solid ${t.ink}` }}/>}
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
                  <span style={{ fontSize: 11 }}>{p.flag}</span>
                  <span style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 12, color: t.ink }}>{p.name}</span>
                  <RelTag rel={p.rel}/>
                </div>
                <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 10.5, color: t.textSoft, lineHeight: 1.3 }}>{p.now}</div>
                <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 9, color: t.textSoft, marginTop: 3 }}>
                  {p.rel === 'mentor' ? p.lv : 'Lv.' + p.lv}{p.streak ? ` · 🔥 ${p.streak}일` : ''}
                </div>
              </div>
              <div style={{ background: t.yellow, border: `2px solid ${t.ink}`, boxShadow: `2px 2px 0 0 ${t.yellowShadow}`,
                padding: '6px 8px', fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: t.ink, flexShrink: 0 }}>👏</div>
            </div>
          ))}

          <div style={{ marginTop: 6, textAlign: 'center', fontFamily: '"Galmuri11",monospace', fontSize: 9.5, color: t.textFaint, lineHeight: 1.5 }}>
            현지 간호사 멘토 매칭은 준비 중이에요
          </div>
        </Body>
      </Shell>
    );
  }

  // ══ 2 · 코드로 추가 ═════════════════════════════════════════════════
  function ScreenColleagueAdd() {
    const t = T();
    return (
      <Shell label="Colleagues · 코드로 추가">
        <Head title="동료 추가" sub="초대 코드를 주고받아 연결해요" back/>
        <Body>
          <div style={{ background: t.mint, border: `3px solid ${t.ink}`, boxShadow: `4px 4px 0 0 ${t.mintShadow}`,
            padding: '16px 14px', textAlign: 'center', marginBottom: 15 }}>
            <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 10.5, color: t.ink, opacity: .8 }}>내 초대 코드</div>
            <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 30, color: t.ink, letterSpacing: 4, margin: '9px 0 4px' }}>K7-N4XQ</div>
            <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 9.5, color: t.ink, opacity: .7 }}>7일간 유효 · 최대 10명</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <div style={{ flex: 1, background: '#fff', border: `2.5px solid ${t.ink}`, boxShadow: `2.5px 2.5px 0 0 ${t.ink}`,
                padding: '9px 0', fontFamily: '"DungGeunMo",monospace', fontSize: 12, color: t.ink }}>📋 복사</div>
              <div style={{ flex: 1, background: t.ink, color: t.cream, border: `2.5px solid ${t.ink}`,
                padding: '9px 0', fontFamily: '"DungGeunMo",monospace', fontSize: 12 }}>↗ 공유</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 13 }}>
            <div style={{ flex: 1, height: 3, background: t.ink + '22' }}/>
            <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: t.textSoft }}>또는</div>
            <div style={{ flex: 1, height: 3, background: t.ink + '22' }}/>
          </div>

          <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: t.ink, marginBottom: 8 }}>받은 코드 입력</div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 11 }}>
            {['M', '2', '-', 'B', '8', 'L', '_'].map((c, i) => (
              <div key={i} style={{ flex: c === '-' ? 0.4 : 1, background: c === '_' ? t.yellow : '#fff',
                border: `2.5px solid ${t.ink}`, boxShadow: c === '-' ? 'none' : `2.5px 2.5px 0 0 ${c === '_' ? t.yellowShadow : t.ink}`,
                padding: '11px 0', textAlign: 'center', fontFamily: '"DungGeunMo",monospace', fontSize: 16, color: t.ink,
                opacity: c === '-' ? .4 : 1 }}>{c === '_' ? '|' : c}</div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#fff',
            border: `3px solid ${t.ink}`, boxShadow: `3px 3px 0 0 ${t.ink}`, padding: '11px 12px', marginBottom: 12 }}>
            <div style={{ width: 40, height: 40, flexShrink: 0, background: t.cream, border: `2px solid ${t.ink}`,
              display: 'flex', alignItems: 'flex-end', justifyContent: 'center', overflow: 'hidden' }}>
              <Sprite p={{ hair: '#9A6B3F', style: 'curly', shirt: '#FED7AA' }} size={36}/>
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 12.5, color: t.ink }}>🇨🇦 서연</div>
              <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 10, color: t.textSoft, marginTop: 3 }}>Lv.B1 · 캐나다 준비 · 연속 9일</div>
            </div>
            <span style={{ background: t.mint, border: `1.5px solid ${t.ink}`, padding: '2px 6px',
              fontFamily: '"DungGeunMo",monospace', fontSize: 9, color: t.ink, flexShrink: 0 }}>찾음</span>
          </div>

          <div style={{ background: t.ink, color: t.cream, border: `3px solid ${t.ink}`, boxShadow: `3px 3px 0 0 ${t.ink}`,
            padding: '13px 0', textAlign: 'center', fontFamily: '"DungGeunMo",monospace', fontSize: 14 }}>🤝 동료 요청 보내기</div>

          <div style={{ marginTop: 13, background: t.cream, border: `2px dashed ${t.ink}55`, padding: '9px 11px',
            fontFamily: '"Galmuri11",monospace', fontSize: 10, color: t.textSoft, lineHeight: 1.6 }}>
            상대가 수락하면 서로의 <b style={{ color: t.ink }}>학습 현황</b>과 <b style={{ color: t.ink }}>응원</b>을 주고받을 수 있어요.
            공개 범위는 언제든 설정에서 바꿀 수 있습니다.
          </div>
        </Body>
      </Shell>
    );
  }

  // ══ 3 · 동료 프로필 ═════════════════════════════════════════════════
  function ScreenColleagueDetail() {
    const t = T();
    const p = PEOPLE[0];
    const week = [1, 1, 2, 1, 0, 1, 1];
    return (
      <Shell label="Colleagues · 프로필">
        <Head title="민서" sub="🇦🇺 호주 준비 · 동료 · 32일째 함께" back/>
        <Body>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: t.cream,
            border: `3px solid ${t.ink}`, boxShadow: `4px 4px 0 0 ${t.ink}`, padding: '13px', marginBottom: 13 }}>
            <div style={{ width: 62, height: 62, flexShrink: 0, background: '#fff', border: `3px solid ${t.ink}`,
              display: 'flex', alignItems: 'flex-end', justifyContent: 'center', overflow: 'hidden' }}>
              <Sprite p={p} size={56}/>
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 16, color: t.ink }}>민서</span>
                <RelTag rel="peer"/>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                {[['Lv.', 'B1'], ['연속', '21일'], ['클리어', '48']].map((s, i) => (
                  <div key={i}>
                    <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 9, color: t.textSoft }}>{s[0]}</div>
                    <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 13, color: t.ink, marginTop: 2 }}>{s[1]}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 9, background: t.mint,
            border: `3px solid ${t.ink}`, boxShadow: `3px 3px 0 0 ${t.mintShadow}`, padding: '10px 12px', marginBottom: 13 }}>
            <div style={{ width: 8, height: 8, background: t.mintShadow, border: `1.5px solid ${t.ink}`, flexShrink: 0 }}/>
            <div style={{ minWidth: 0, flex: 1, fontFamily: '"Galmuri11",monospace', fontSize: 11, color: t.ink, lineHeight: 1.35 }}>
              지금 <b>ICU 승압제 적정</b> 시나리오 진행 중
            </div>
            <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 9, color: t.ink, opacity: .7, flexShrink: 0 }}>3분 전</div>
          </div>

          <div style={{ background: '#fff', border: `3px solid ${t.ink}`, boxShadow: `3px 3px 0 0 ${t.ink}`,
            padding: '11px 12px', marginBottom: 13 }}>
            <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: t.ink, marginBottom: 9 }}>이번 주 학습</div>
            <div style={{ display: 'flex', gap: 6, marginBottom: 7 }}>
              {week.map((d, i) => (
                <div key={i} style={{ flex: 1, height: 30, background: d === 2 ? t.yellow : d === 1 ? t.mint : '#fff',
                  border: `2px solid ${d === 0 ? t.ink + '44' : t.ink}`, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                  <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 8, color: t.ink, opacity: .55, paddingBottom: 2 }}>
                    {['월','화','수','목','금','토','일'][i]}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 10, color: t.textSoft }}>나보다 2일 더 많이 학습했어요</div>
          </div>

          <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: t.ink, marginBottom: 8 }}>━ 주고받은 응원 ━━━━━━</div>
          {[['받음', '민서', '오늘도 화이팅! 트리아지 금방 익숙해져요 💪', t.peach],
            ['보냄', '나', '30일 연속 축하해요! 대단해요 👏', '#fff']].map((c, i) => (
            <div key={i} style={{ background: c[3], border: `2.5px solid ${t.ink}`, boxShadow: `2.5px 2.5px 0 0 ${t.ink}`,
              padding: '9px 11px', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <span style={{ background: t.ink, color: t.cream, fontFamily: '"DungGeunMo",monospace', fontSize: 8, padding: '1px 5px' }}>{c[0]}</span>
                <span style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: t.ink }}>{c[1]}</span>
              </div>
              <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 11, color: t.ink, lineHeight: 1.45 }}>{c[2]}</div>
            </div>
          ))}

          <div style={{ display: 'flex', gap: 8, marginTop: 13 }}>
            <div style={{ flex: 2, background: t.yellow, border: `3px solid ${t.ink}`, boxShadow: `3px 3px 0 0 ${t.yellowShadow}`,
              padding: '12px 0', textAlign: 'center', fontFamily: '"DungGeunMo",monospace', fontSize: 13, color: t.ink }}>👏 응원 보내기</div>
            <div style={{ flex: 1, background: '#fff', border: `3px solid ${t.ink}`, boxShadow: `3px 3px 0 0 ${t.ink}`,
              padding: '12px 0', textAlign: 'center', fontFamily: '"DungGeunMo",monospace', fontSize: 13, color: t.ink }}>⚔ 대결</div>
          </div>
        </Body>
      </Shell>
    );
  }

  // ══ 4 · 응원 보내기 시트 ════════════════════════════════════════════
  function ScreenCheerCompose() {
    const t = T();
    const presets = [['👏', '잘하고 있어요'], ['💪', '오늘도 화이팅'], ['🔥', '연속 대단해요'], ['🌙', '무리하지 말아요']];
    return (
      <Shell label="Colleagues · 응원 보내기">
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(42,37,34,.55)' }}/>
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 62, background: t.paper,
          borderTop: `4px solid ${t.ink}`, padding: '14px 16px 20px', zIndex: 10 }}>
          <div style={{ width: 44, height: 5, background: t.ink + '33', margin: '0 auto 14px' }}/>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{ width: 40, height: 40, flexShrink: 0, background: t.cream, border: `2.5px solid ${t.ink}`,
              display: 'flex', alignItems: 'flex-end', justifyContent: 'center', overflow: 'hidden' }}>
              <Sprite p={PEOPLE[0]} size={36}/>
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 14, color: t.ink }}>민서에게 응원 보내기</div>
              <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 10, color: t.textSoft, marginTop: 3 }}>ICU 승압제 적정 진행 중</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 8, marginBottom: 13 }}>
            {presets.map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, background: i === 1 ? t.yellow : '#fff',
                border: `2.5px solid ${t.ink}`, boxShadow: `2.5px 2.5px 0 0 ${i === 1 ? t.yellowShadow : t.ink}`, padding: '9px 10px' }}>
                <span style={{ fontSize: 15 }}>{p[0]}</span>
                <span style={{ fontFamily: '"Galmuri11",monospace', fontSize: 11, color: t.ink }}>{p[1]}</span>
              </div>
            ))}
          </div>

          <div style={{ background: '#fff', border: `3px solid ${t.ink}`, boxShadow: `3px 3px 0 0 ${t.ink}`,
            padding: '10px 11px', marginBottom: 13 }}>
            <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 11, color: t.ink, lineHeight: 1.5 }}>
              오늘도 화이팅! 트리아지 금방 익숙해져요<span style={{ color: t.textFaint }}>|</span>
            </div>
            <div style={{ textAlign: 'right', fontFamily: '"DungGeunMo",monospace', fontSize: 9, color: t.textFaint, marginTop: 6 }}>24 / 60</div>
          </div>

          <div style={{ background: t.ink, color: t.cream, border: `3px solid ${t.ink}`, boxShadow: `3px 3px 0 0 ${t.ink}`,
            padding: '13px 0', textAlign: 'center', fontFamily: '"DungGeunMo",monospace', fontSize: 14 }}>💌 보내기</div>
        </div>
        <window.ForinBottomNav active="home"/>
      </Shell>
    );
  }

  Object.assign(window, { ScreenColleagues, ScreenColleagueAdd, ScreenColleagueDetail, ScreenCheerCompose });
})();
