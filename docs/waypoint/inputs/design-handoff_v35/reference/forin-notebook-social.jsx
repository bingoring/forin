// forin-notebook-social.jsx — 동료 목록/상세 · 길찾기 · 스플래시/로그인 (근무 수첩)
(function () {
  const { NbPaper, NbButton, NbTag, NbStamp, NbMark, NbMemo, NbCheck } = window.NbUI;
  const NbIcon = window.NbIcon;
  const HW = '"Gaegu","Nanum Pen Script",cursive';
  const F = '"Pretendard",sans-serif';
  const MONO = '"IBM Plex Mono",monospace';
  const c = { bg: '#F1EBDD', paper: '#FFFdf4', ink: '#3E362B', soft: '#9A8F7C', red: '#C75146', blue: '#4A6FA5', green: '#5F8D5A' };

  function Frame({ label, tab, children }) {
    return (
      <div style={{ boxSizing: 'border-box', width: 402, height: 874, background: c.bg, backgroundImage: 'repeating-linear-gradient(transparent 0 27px, rgba(62,54,43,.06) 27px 28px)', borderRadius: 40, overflow: 'hidden', position: 'relative', fontFamily: F }} data-screen-label={label}>
        <div style={{ height: 44, display: 'flex', alignItems: 'center', padding: '0 24px', fontSize: 14, fontWeight: 700, color: c.ink }}>9:41<div style={{ flex: 1 }}/>▮▮▮</div>
        {children}
        {tab && (
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 68, background: c.paper, borderTop: `1.5px solid #E0D6C0`, display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '0 8px 8px', zIndex: 30 }}>
            {[['home','홈'],['hospital','일터'],['board','라운지'],['lab','리뷰랩'],['me','나']].map((t, i) => (
              <div key={i} style={{ textAlign: 'center', opacity: t[1] === tab ? 1 : .55 }}>
                <div style={{ height: 20 }}><NbIcon name={t[0]} size={19}/></div>
                <div style={{ fontFamily: HW, fontSize: 13, color: c.ink, fontWeight: t[1] === tab ? 700 : 400 }}>{t[1]}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
  // 폴라로이드 아바타
  function Polaroid({ name, size = 52, rot = -2 }) {
    return (
      <div style={{ background: '#fff', border: '1px solid #E0D6C0', padding: '4px 4px 12px', boxShadow: '0 2px 5px rgba(62,54,43,.18)', transform: `rotate(${rot}deg)`, flexShrink: 0, position: 'relative' }}>
        <div style={{ width: size, height: size, background: 'rgba(74,111,165,.14)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><NbIcon name="me" size={size * 0.62}/></div>
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, textAlign: 'center', fontFamily: HW, fontSize: 10.5, color: c.ink }}>{name}</div>
      </div>
    );
  }

  // ── A · 동료 목록 ──
  function ColleaguesNb() {
    const rows = [
      { n: '수진', code: 'RN-SUJIN', where: '🇺🇸 미국 준비', streak: 21, today: true, local: false },
      { n: 'Grace', code: 'RN-GRACE', where: '🇺🇸 NYC 근무중', streak: 96, today: true, local: true },
      { n: '민호', code: 'RN-MINHO', where: '🇦🇺 호주 준비', streak: 8, today: false, local: false },
      { n: '하영', code: 'RN-HAYNG', where: '🇺🇸 미국 준비', streak: 34, today: true, local: false },
    ];
    return (
      <Frame label="수첩 동료 · 목록" tab="나">
        <div style={{ position: 'absolute', top: 44, left: 0, right: 0, bottom: 78, overflowY: 'auto', padding: '8px 20px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <div style={{ fontFamily: HW, fontSize: 30, color: c.ink }}>내 동료들</div>
            <div style={{ flex: 1 }}/>
            <NbTag color={c.green} rot={1}>4명 · 오늘 3명 출근</NbTag>
          </div>
          {/* 코드로 추가 */}
          <NbPaper rot={-0.5} tape tapeLeft={120} style={{ marginTop: 14, padding: '11px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <NbIcon name="handshake2" size={24}/>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontFamily: HW, fontSize: 16.5, color: c.ink }}>코드로 동료 맺기</div>
              <div style={{ fontSize: 10.5, color: c.soft, marginTop: 1 }}>내 코드 <span style={{ fontFamily: MONO, fontWeight: 700, color: c.ink }}>RN-JIMIN</span> · 복사</div>
            </div>
            <NbButton variant="paper" size="sm">추가 +</NbButton>
          </NbPaper>
          {/* 함께 목표 위젯 */}
          <NbPaper rot={0.5} style={{ marginTop: 12, padding: '11px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: c.blue, letterSpacing: 1, whiteSpace: 'nowrap' }}>이번 주 함께 목표</span>
              <div style={{ flex: 1 }}/>
              <span style={{ fontFamily: HW, fontSize: 14, color: c.soft, whiteSpace: 'nowrap' }}>시나리오 20개 중 <b style={{ color: c.ink }}>13</b></span>
            </div>
            <div style={{ marginTop: 8, height: 11, border: `1.5px solid ${c.ink}`, borderRadius: 3, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, width: '65%', background: 'repeating-linear-gradient(-45deg, rgba(95,141,90,.55) 0 6px, rgba(95,141,90,.3) 6px 12px)' }}/>
            </div>
          </NbPaper>
          <div style={{ marginTop: 16, fontFamily: HW, fontSize: 17, color: c.ink }}>— 동료 카드 ——</div>
          {rows.map((r, i) => (
            <NbPaper key={i} rot={i % 2 ? 0.5 : -0.5} style={{ marginTop: 11, padding: '11px 13px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <Polaroid name={r.n} rot={i % 2 ? 2 : -2}/>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontFamily: HW, fontSize: 18.5, color: c.ink }}>{r.n}</span>
                  {r.local && <NbTag color={c.green} fill rot={-2} style={{ fontSize: 10.5 }}>현지 근무중</NbTag>}
                </div>
                <div style={{ fontSize: 11, color: c.soft, marginTop: 2, whiteSpace: 'nowrap' }}>{r.where} · 연속 {r.streak}일 {r.today ? '· 오늘 출근 ✓' : '· 아직 안 왔어요'}</div>
              </div>
              <div style={{ textAlign: 'center', flexShrink: 0 }}>
                <NbButton variant="dashed" size="sm">응원 ✉</NbButton>
              </div>
            </NbPaper>
          ))}
          <div style={{ marginTop: 14 }}>
            <NbMemo rot={0.3} color={c.blue}>현지 근무중인 동료에게는 <b style={{ color: c.blue }}>멘토 요청</b>을 보낼 수 있어요 — 프로필에서.</NbMemo>
          </div>
        </div>
      </Frame>
    );
  }

  // ── B · 동료 상세 ──
  function ColleagueDetailNb() {
    return (
      <Frame label="수첩 동료 · 상세" tab="나">
        <div style={{ position: 'absolute', top: 44, left: 0, right: 0, bottom: 78, overflowY: 'auto', padding: '8px 20px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontFamily: HW, fontSize: 16, color: c.ink }}>‹ 동료들</span>
            <div style={{ flex: 1 }}/>
            <NbTag color={c.soft} rot={1}>RN-GRACE</NbTag>
          </div>
          {/* 헤더 폴라로이드 */}
          <NbPaper rot={-0.5} tape tapeLeft={150} style={{ marginTop: 14, padding: '16px 15px', display: 'flex', gap: 14, alignItems: 'center' }}>
            <Polaroid name="Grace" size={74} rot={-3}/>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{ fontFamily: HW, fontSize: 24, color: c.ink }}>Grace</span>
                <NbTag color={c.green} fill rot={-2} style={{ fontSize: 10.5 }}>현지 근무중</NbTag>
              </div>
              <div style={{ fontSize: 11.5, color: c.soft, marginTop: 3, lineHeight: 1.5 }}>🇺🇸 NYC · Med-Surg RN 3년차<br/>NCLEX 합격 · 2023년 이주</div>
            </div>
          </NbPaper>
          {/* 스탯 */}
          <NbPaper rot={0.4} style={{ marginTop: 12, padding: '11px 13px', display: 'flex', textAlign: 'center' }}>
            {[['연속 출근', '96일'], ['완료 시나리오', '214'], ['도움 준 답변', '48']].map((s, i) => (
              <div key={i} style={{ flex: 1, borderLeft: i ? `1.3px dashed rgba(62,54,43,.2)` : 'none' }}>
                <div style={{ fontSize: 10, color: c.soft, whiteSpace: 'nowrap' }}>{s[0]}</div>
                <div style={{ fontFamily: HW, fontSize: 19, color: c.ink, marginTop: 2 }}>{s[1]}</div>
              </div>
            ))}
          </NbPaper>
          {/* 최근 라운지 글 */}
          <div style={{ marginTop: 15, fontFamily: HW, fontSize: 16.5, color: c.ink }}>— 최근 라운지 글 ——</div>
          {[['야간 인계 때 제일 많이 쓰는 표현 5개 정리해봤어요', '어제 · 공감 32'], ['첫 코드블루 겪은 날… 다들 무서워하지 마세요', '4일 전 · 공감 87']].map((p, i) => (
            <NbPaper key={i} rot={i % 2 ? 0.5 : -0.5} pinned style={{ marginTop: 10, padding: '11px 13px' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: c.ink, lineHeight: 1.45 }}>{p[0]}</div>
              <div style={{ fontSize: 10.5, color: c.soft, marginTop: 4 }}>{p[1]}</div>
            </NbPaper>
          ))}
          {/* 액션 */}
          <div style={{ display: 'flex', gap: 10, marginTop: 17 }}>
            <NbButton variant="paper" style={{ flex: 1 }} icon="speech">응원 보내기</NbButton>
            <NbButton variant="ink" style={{ flex: 1 }} icon="handshake2" iconColor="#FFFdf4">멘토 요청</NbButton>
          </div>
          <div style={{ marginTop: 11 }}>
            <NbMemo rot={-0.3}>멘토를 수락하면 한 달간 주 1회 질문 쪽지를 보낼 수 있어요.</NbMemo>
          </div>
        </div>
      </Frame>
    );
  }

  // ── C · 길찾기 (병원 내 손그림 약도) ──
  function WayfindingNb() {
    return (
      <Frame label="수첩 길찾기 · 병원 약도" tab="일터">
        <div style={{ position: 'absolute', top: 44, left: 0, right: 0, bottom: 78, display: 'flex', flexDirection: 'column', padding: '8px 20px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontFamily: HW, fontSize: 16, color: c.ink }}>‹ 3층 · 수술실</span>
            <div style={{ flex: 1 }}/>
            <NbTag color={c.blue} rot={1}><NbIcon name="compass" size={13}/> 길찾기</NbTag>
          </div>
          <div style={{ fontFamily: HW, fontSize: 24, color: c.ink, marginTop: 10, lineHeight: 1.25 }}>회복실(PACU)까지<br/><span style={{ fontSize: 16, color: c.soft }}>지금 위치: 중앙 간호 스테이션</span></div>
          {/* 손그림 약도 */}
          <NbPaper rot={-0.4} tape tapeLeft={130} style={{ marginTop: 13, flex: 1, padding: 10, minHeight: 0 }}>
            <svg viewBox="0 0 330 380" style={{ width: '100%', height: '100%' }}>
              {/* 방 윤곽 — 손그림 느낌 */}
              <g fill="none" stroke={c.ink} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round">
                <rect x="12" y="14" width="130" height="105" rx="3" fill="rgba(74,111,165,.1)"/>
                <rect x="185" y="14" width="132" height="105" rx="3" fill="rgba(233,196,90,.16)"/>
                <rect x="12" y="150" width="90" height="120" rx="3" fill="rgba(199,81,70,.1)"/>
                <rect x="130" y="150" width="187" height="120" rx="3" fill="rgba(95,141,90,.12)"/>
                <rect x="12" y="300" width="305" height="66" rx="3" fill="rgba(62,54,43,.05)"/>
              </g>
              <g fontFamily='"Gaegu",cursive' fontSize="15" fill={c.ink}>
                <text x="30" y="45">수술방 1·2</text>
                <text x="203" y="45">회복실 PACU</text>
                <text x="26" y="180">소독실</text>
                <text x="148" y="180">중앙 스테이션</text>
                <text x="30" y="338">복도 · 엘리베이터 홀</text>
              </g>
              {/* 경로 — 빨간펜 점선 */}
              <path d="M215 215 L215 250 Q215 262 227 262 L285 262 Q296 262 296 250 L296 130 Q296 122 288 120 L252 118" fill="none" stroke={c.red} strokeWidth="2.6" strokeDasharray="7 6" strokeLinecap="round"/>
              <path d="M258 124 L250 118 L258 111" fill="none" stroke={c.red} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
              {/* 현재 위치 · 목적지 */}
              <circle cx="215" cy="215" r="9" fill={c.blue} opacity=".25"/>
              <circle cx="215" cy="215" r="4.5" fill={c.blue}/>
              <g transform="translate(228 60)">
                <circle r="13" fill="none" stroke={c.red} strokeWidth="2" strokeDasharray="3 3"/>
                <text x="-6" y="5" fontFamily='"Gaegu",cursive' fontSize="14" fill={c.red}>★</text>
              </g>
            </svg>
          </NbPaper>
          {/* 단계 안내 */}
          <NbPaper rot={0.4} style={{ marginTop: 11, padding: '10px 13px' }}>
            {[['1', '스테이션에서 오른쪽 복도로 나가기', true], ['2', '엘리베이터 홀 지나 왼쪽으로', false], ['3', '유리문(스크럽 존) 통과 → PACU', false]].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: i ? 7 : 0 }}>
                <span style={{ width: 20, height: 20, borderRadius: '50%', border: `1.7px solid ${s[2] ? c.blue : c.soft}`, color: s[2] ? c.blue : c.soft, fontFamily: HW, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{s[0]}</span>
                <span style={{ fontFamily: HW, fontSize: 15.5, color: s[2] ? c.ink : c.soft }}>{s[1]}</span>
                {s[2] && <NbTag color={c.blue} rot={-2} style={{ marginLeft: 'auto', fontSize: 10.5 }}>지금 여기</NbTag>}
              </div>
            ))}
          </NbPaper>
        </div>
      </Frame>
    );
  }

  // ── D · 스플래시 ──
  function SplashNb() {
    return (
      <Frame label="수첩 스플래시">
        <div style={{ position: 'absolute', inset: 0, background: '#2E4636', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 108, height: 108, borderRadius: '50%', border: '2px solid #D4B46A', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 6, borderRadius: '50%', border: '1.2px solid rgba(212,180,106,.6)' }}/>
            <span style={{ fontFamily: HW, fontSize: 64, color: '#D4B46A', lineHeight: 1, marginTop: -8 }}>f</span>
          </div>
          <div style={{ fontFamily: MONO, fontSize: 13, fontWeight: 700, letterSpacing: 6, color: '#D4B46A', marginTop: 24 }}>FORIN</div>
          <div style={{ fontFamily: HW, fontSize: 17, color: 'rgba(243,230,200,.7)', marginTop: 8 }}>말이 통해야, 일이 통한다</div>
          <div style={{ position: 'absolute', bottom: 72, display: 'flex', gap: 7 }}>
            {[0, 1, 2].map(i => <span key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: '#D4B46A', opacity: i === 0 ? 1 : .35 }}/>)}
          </div>
        </div>
      </Frame>
    );
  }

  // ── E · 로그인 ──
  function LoginNb() {
    return (
      <Frame label="수첩 로그인">
        <div style={{ position: 'absolute', top: 44, left: 0, right: 0, bottom: 0, padding: '26px 28px 34px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', border: `2px solid ${c.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px auto 0' }}>
            <span style={{ fontFamily: HW, fontSize: 38, color: c.ink, marginTop: -4 }}>f</span>
          </div>
          <div style={{ textAlign: 'center', fontFamily: HW, fontSize: 27, color: c.ink, marginTop: 16, lineHeight: 1.3 }}>다시 출근할 시간이에요</div>
          <div style={{ textAlign: 'center', fontSize: 12, color: c.soft, marginTop: 4 }}>어제까지 연속 12일 — 오늘도 이어가요</div>
          <div style={{ flex: 1 }}/>
          {/* 소셜 로그인 — 공식 브랜드 리소스 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ background: '#fff', border: '1px solid #DADCE0', borderRadius: 6, height: 50, display: 'flex', alignItems: 'center', cursor: 'pointer', boxShadow: '0 1px 3px rgba(62,54,43,.12)', position: 'relative', paddingLeft: 18 }}>
              <svg viewBox="0 0 48 48" width="19" height="19" style={{ display: 'block', flexShrink: 0 }}>
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              <span style={{ position: 'absolute', left: 0, right: 0, textAlign: 'center', fontSize: 15, fontWeight: 600, color: '#1F1F1F' }}>Google로 계속하기</span>
            </div>
            <div style={{ background: '#000', borderRadius: 6, height: 50, display: 'flex', alignItems: 'center', cursor: 'pointer', position: 'relative', paddingLeft: 18 }}>
              <span style={{ fontSize: 20, color: '#fff', marginTop: -2 }}></span><span style={{ position: 'absolute', left: 0, right: 0, textAlign: 'center', fontSize: 15, fontWeight: 600, color: '#fff' }}>Apple로 계속하기</span></span>
            </div>
            <div style={{ borderRadius: 6, overflow: 'hidden', cursor: 'pointer', lineHeight: 0, boxShadow: '0 1px 3px rgba(62,54,43,.12)' }}>
              <img src="uploads/kakao_login_large_wide.png" alt="카카오 로그인" style={{ width: '100%', height: 50, objectFit: 'cover', display: 'block' }}/>
            </div>
          </div>
          <div style={{ textAlign: 'center', fontFamily: HW, fontSize: 12.5, color: c.soft, marginTop: 18, lineHeight: 1.6 }}>계속하면 이용약관·개인정보처리방침에 동의하게 돼요</div>
          <div style={{ height: 34 }}/>
        </div>
      </Frame>
    );
  }

  Object.assign(window, { ColleaguesNb, ColleagueDetailNb, WayfindingNb, SplashNb, LoginNb });
})();
