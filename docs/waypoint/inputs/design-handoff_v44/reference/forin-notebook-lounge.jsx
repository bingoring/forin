// forin-notebook-lounge.jsx — 상황판 탭 개편안: "라운지" (동종 업계 해외이직 커뮤니티)
// A 피드: 검색 + 필터 칩 + 글 카드(일상/질문/AI 대화 공유) — 대화 공유 카드는
//   시나리오에서 '연속 구간만' 잘라온 스니펫임을 표시.
// B 대화 공유 작성: 연속 턴 선택 UI (끊긴 선택 불가 규칙 시각화)
// C 상대 프로필 시트: 미국 근무 중 현직자 + 동료 요청
(function () {
  const c = { bg: '#F1EBDD', paper: '#FFFdf4', ink: '#3E362B', soft: '#9A8F7C', red: '#C75146', blue: '#4A6FA5', green: '#5F8D5A', tape: 'rgba(160,200,220,.55)' };
  const HW = '"Gaegu","Nanum Pen Script",cursive';
  const F = '"Pretendard",sans-serif';
  const MONO = '"IBM Plex Mono",monospace';
  const NbIcon = window.NbIcon;
  const paper = (rot = 0) => ({ background: c.paper, border: `1px solid #E0D6C0`, boxShadow: '0 2px 6px rgba(62,54,43,.14)', transform: `rotate(${rot}deg)`, position: 'relative' });
  // 비스듬히 꽂힌 압정 — 머리 윗면(타원) + 옆면 띠 + 목·바늘 + 그림자
  const pin = (l, color = c.red, dark = '#8E3A32') => (
    <div style={{ position: 'absolute', top: -11, left: l, width: 22, height: 24, zIndex: 2, pointerEvents: 'none' }}>
      <svg viewBox="0 0 22 24" width="22" height="24">
        <ellipse cx="12.5" cy="19.5" rx="4.5" ry="1.6" fill="rgba(62,54,43,.28)"/>
        <path d="M10.5 12.5 L13 17.5" stroke={c.ink} strokeWidth="1.6" strokeLinecap="round"/>
        <path d="M7.5 9.5 L12.5 12.8 L11 14.6 L6.3 11.6 Z" fill={dark} stroke={c.ink} strokeWidth="1.4" strokeLinejoin="round"/>
        <ellipse cx="8" cy="7" rx="6.2" ry="4.6" fill={color} stroke={c.ink} strokeWidth="1.6" transform="rotate(-18 8 7)"/>
        <ellipse cx="6.2" cy="5.6" rx="2" ry="1.2" fill="rgba(255,255,255,.6)" transform="rotate(-18 6.2 5.6)"/>
      </svg>
    </div>
  );

  const avatar = (bg, rot = -2) => (
    <div style={{ width: 38, height: 38, flexShrink: 0, background: c.paper, border: `1px solid #E0D6C0`, transform: `rotate(${rot}deg)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 3px rgba(62,54,43,.2)' }}>
      <svg viewBox="0 0 32 32" width="30" height="30"><circle cx="16" cy="12" r="7" fill={bg} stroke="#3E362B" strokeWidth="1.6"/><path d="M4 32 Q6 22 16 22 Q26 22 28 32" fill={bg} stroke="#3E362B" strokeWidth="1.6"/></svg>
    </div>
  );
  const flag = (t, color) => <span style={{ fontFamily: MONO, fontSize: 9, fontWeight: 700, color: '#fff', background: color, padding: '1px 5px', borderRadius: 2, whiteSpace: 'nowrap' }}>{t}</span>;

  function Frame({ label, children, nav = true }) {
    return (
      <div style={{ boxSizing: 'border-box', width: 402, height: 874, background: c.bg, backgroundImage: 'repeating-linear-gradient(transparent 0 27px, rgba(62,54,43,.06) 27px 28px)', borderRadius: 40, overflow: 'hidden', position: 'relative', fontFamily: F }} data-screen-label={label}>
        <div style={{ height: 44, display: 'flex', alignItems: 'center', padding: '0 24px', fontSize: 14, fontWeight: 700, color: c.ink }}>9:41<div style={{ flex: 1 }}/>▮▮▮</div>
        {children}
        {nav && (
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 68, background: c.paper, borderTop: `1.5px solid #E0D6C0`, display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '0 8px 8px', zIndex: 30 }}>
            {[['home','홈',false],['hospital','일터',false],['speech','라운지',true],['lab','리뷰랩',false],['me','나',false]].map((t, i) => (
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

  // ── A · 라운지 피드 ──
  function LoungeFeed() {
    const meta = (name, sub, av, badge) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
        {av}
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ fontFamily: HW, fontSize: 16, color: c.ink, whiteSpace: 'nowrap' }}>{name}</span>
            {badge}
          </div>
          <div style={{ fontSize: 10, color: c.soft, marginTop: 1, whiteSpace: 'nowrap' }}>{sub}</div>
        </div>
        <span style={{ fontFamily: HW, fontSize: 15, color: c.soft }}>⋯</span>
      </div>
    );
    const foot = (likes, cmts) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 13, marginTop: 10, paddingTop: 8, borderTop: `1.3px dashed rgba(62,54,43,.15)` }}>
        <span style={{ fontFamily: HW, fontSize: 13.5, color: c.soft }}><NbIcon name="star" size={13} color="#C99A1E"/> 응원 {likes}</span>
        <span style={{ fontFamily: HW, fontSize: 13.5, color: c.soft }}><NbIcon name="speech" size={13}/> 댓글 {cmts}</span>
        <div style={{ flex: 1 }}/>
        <span style={{ fontFamily: HW, fontSize: 13.5, color: c.blue }}>답글 쓰기 ✎</span>
      </div>
    );
    return (
      <Frame label="수첩 라운지 피드">
        <div style={{ position: 'absolute', top: 44, left: 0, right: 0, bottom: 78, overflowY: 'auto', padding: '10px 20px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <div style={{ fontFamily: HW, fontSize: 30, color: c.ink }}>스태프 라운지</div>
            <div style={{ flex: 1 }}/>
            <div style={{ ...paper(1), padding: '5px 12px', fontFamily: HW, fontSize: 14.5, color: c.ink, background: 'rgba(249,227,123,.5)' }}>글쓰기 ✎</div>
          </div>
          <div style={{ fontSize: 11, color: c.soft, marginTop: 2 }}>해외로 가는 같은 직업 동료들의 휴게실</div>
          {/* 검색 + 필터 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, padding: '6px 4px', borderBottom: `2px solid rgba(62,54,43,.45)` }}>
            <NbIcon name="magnify" size={16}/>
            <span style={{ fontFamily: HW, fontSize: 15, color: '#B4A88F' }}>글·사람·태그 찾기…</span>
          </div>
          <div style={{ display: 'flex', gap: 7, marginTop: 10, overflowX: 'auto', paddingBottom: 4 }}>
            {[['전체', true], ['간호사', true], ['🇺🇸 미국', false], ['질문', false], ['대화 공유', false], ['NCLEX', false], ['현지 근무중', false]].map((f, i) => (
              <span key={i} style={{ ...paper(i % 2 ? 0.8 : -0.8), display: 'inline-block', padding: '4px 11px', fontFamily: HW, fontSize: 14, color: f[1] ? c.paper : c.ink, background: f[1] ? c.ink : c.paper, whiteSpace: 'nowrap' }}>{f[0]}</span>
            ))}
          </div>
          {/* 글 1 · AI 대화 공유 */}
          <div style={{ ...paper(-0.5), marginTop: 14, padding: '12px 14px' }}>
            {pin(170)}
            {meta('지민 (나)', '간호사 · 미국 준비 · LV 29', avatar('#B8CBB0'), flag('준비중', c.blue))}
            <div style={{ fontFamily: HW, fontSize: 16.5, color: c.ink, marginTop: 9, lineHeight: 1.3 }}>환자분이 제 발음을 듣고 "허리가 아니라 등이요"를 세 번 말하게 했어요 😭 다들 back/waist 어떻게 구분해요?</div>
            {/* 대화 스니펫 — 연속 구간 */}
            <div style={{ marginTop: 9, border: `1.5px solid ${c.ink}`, borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(143,199,232,.25)', padding: '5px 9px', borderBottom: `1.5px solid ${c.ink}` }}>
                <span style={{ fontFamily: HW, fontSize: 12.5, color: c.ink, whiteSpace: 'nowrap' }}>ER · 통증 사정 — Mrs. Hopkins</span>
                <div style={{ flex: 1 }}/>
                <span style={{ fontFamily: MONO, fontSize: 8.5, fontWeight: 700, color: c.soft, whiteSpace: 'nowrap' }}>연속 3턴 · 대화 열기 ›</span>
              </div>
              <div style={{ padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ alignSelf: 'flex-end', maxWidth: '85%', background: c.paper, border: `1.3px solid ${c.ink}`, borderRadius: '10px 10px 2px 10px', padding: '5px 9px', fontSize: 11.5, color: c.ink }}>Where is the pain?</div>
                <div style={{ alignSelf: 'flex-start', maxWidth: '85%', background: '#FCEEDC', border: `1.3px solid #E8D2B0`, borderRadius: '10px 10px 10px 2px', padding: '5px 9px', fontSize: 11.5, color: c.ink }}>My back… not the waist, the BACK.</div>
                <div style={{ alignSelf: 'flex-end', maxWidth: '85%', background: c.paper, border: `1.3px solid ${c.ink}`, borderRadius: '10px 10px 2px 10px', padding: '5px 9px', fontSize: 11.5, color: c.ink }}>Got it — your upper back, near the shoulder blades?</div>
              </div>
            </div>
            {foot(24, 9)}
          </div>
          {/* 글 2 · 현지 근무자 팁 */}
          <div style={{ ...paper(0.5), marginTop: 13, padding: '12px 14px' }}>
            {pin(24, c.blue, '#2E4A73')}
            {meta('Grace RN', '간호사 · 🇺🇸 텍사스 3년차', avatar('#E9C45A', 2), flag('현지 근무중', c.green))}
            <div style={{ fontFamily: HW, fontSize: 16.5, color: c.ink, marginTop: 9, lineHeight: 1.35 }}>미국 병동에서 진짜 많이 쓰는 말 Top 3 적어봐요. "I'll be right back"은 하루 50번 씀. 궁금한 거 댓글로!</div>
            <div style={{ display: 'flex', gap: 5, marginTop: 8 }}>
              {['#현지팁', '#병동영어'].map(t => <span key={t} style={{ fontFamily: HW, fontSize: 12.5, color: c.blue, whiteSpace: 'nowrap' }}>{t}</span>)}
            </div>
            {foot(58, 21)}
          </div>
          {/* 글 3 · 질문 */}
          <div style={{ ...paper(-0.4), marginTop: 13, padding: '12px 14px', background: '#FCF3E4' }}>
            {pin(296, c.green, '#3E6139')}
            {meta('준호', '간호사 · 호주 준비 · LV 12', avatar('#C3B1E8', -1), flag('질문', '#C77E2E'))}
            <div style={{ fontFamily: HW, fontSize: 16.5, color: c.ink, marginTop: 9, lineHeight: 1.35 }}>OET 스피킹, 롤플레이에서 환자가 화낼 때 어떤 표현으로 진정시키는 게 자연스러울까요?</div>
            {foot(11, 14)}
          </div>
        </div>
      </Frame>
    );
  }

  // ── B · 대화 공유 작성 (연속 턴 선택) ──
  function LoungeShare() {
    const turn = (who, txt, state, i) => (
      <div key={i} style={{ display: 'flex', gap: 9, alignItems: 'flex-start', padding: '8px 10px', background: state === 'sel' ? 'rgba(168,217,151,.3)' : state === 'blocked' ? 'rgba(62,54,43,.05)' : 'transparent', borderTop: i ? `1.3px dashed rgba(62,54,43,.13)` : 'none', opacity: state === 'blocked' ? .55 : 1 }}>
        <div style={{ width: 19, height: 19, flexShrink: 0, marginTop: 2, border: `1.7px solid ${state === 'sel' ? c.green : state === 'blocked' ? '#C9BFA8' : c.soft}`, borderRadius: 4, background: state === 'sel' ? 'rgba(95,141,90,.15)' : 'transparent', position: 'relative' }}>
          {state === 'sel' && <svg viewBox="0 0 24 24" width="21" height="21" style={{ position: 'absolute', left: -2, top: -4 }}><path d="M5 12 L10 17 L20 5" fill="none" stroke={c.green} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          {state === 'blocked' && <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#C9BFA8' }}>✕</span>}
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontFamily: MONO, fontSize: 9, fontWeight: 700, color: who === '나' ? c.blue : c.red }}>{who}</div>
          <div style={{ fontSize: 12.5, color: c.ink, lineHeight: 1.4, marginTop: 1 }}>{txt}</div>
        </div>
      </div>
    );
    return (
      <Frame label="수첩 대화 공유" nav={false}>
        <div style={{ position: 'absolute', top: 52, left: 18, right: 18, display: 'flex', alignItems: 'center', gap: 11 }}>
          <div style={{ ...paper(-1), width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HW, fontSize: 16, color: c.ink, flexShrink: 0 }}>‹</div>
          <div>
            <div style={{ fontFamily: HW, fontSize: 23, color: c.ink, lineHeight: 1 }}>대화 공유하기</div>
            <div style={{ fontSize: 11, color: c.soft, marginTop: 3 }}>이어진 구간만 잘라서 올릴 수 있어요</div>
          </div>
        </div>
        <div style={{ position: 'absolute', top: 118, left: 0, right: 0, bottom: 0, overflowY: 'auto', padding: '0 20px 24px' }}>
          {/* 원본 시나리오 */}
          <div style={{ ...paper(-0.4), padding: '10px 13px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <NbIcon name="siren" size={22}/>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontFamily: HW, fontSize: 16, color: c.ink, lineHeight: 1.05 }}>ER · 통증 사정 — Mrs. Hopkins</div>
              <div style={{ fontSize: 10, color: c.soft, marginTop: 2 }}>어제 완료 · 총 9턴</div>
            </div>
            <span style={{ fontFamily: HW, fontSize: 13, color: c.soft, whiteSpace: 'nowrap' }}>바꾸기 ›</span>
          </div>
          {/* 규칙 메모 */}
          <div style={{ marginTop: 11, padding: '8px 11px', border: `1.4px dashed ${c.blue}`, borderRadius: 3, fontFamily: HW, fontSize: 13.5, color: c.ink, lineHeight: 1.4, background: 'rgba(74,111,165,.06)', transform: 'rotate(-0.3deg)' }}>
            <b style={{ color: c.blue }}>규칙</b> 선택은 <b>연달아</b>만 돼요. 중간을 건너뛰면 대화 맥락이 깨져서 ✕ 표시가 떠요.
          </div>
          {/* 턴 선택 목록 */}
          <div style={{ ...paper(0.3), marginTop: 12 }}>
            {turn('나', 'Hello Mrs. Hopkins, I am your nurse today.', 'off', 0)}
            {turn('환자', "It's my back…Feels like stabbing, really sharp.", 'off', 1)}
            {turn('나', 'Where is the pain?', 'sel', 2)}
            {turn('환자', 'My back… not the waist, the BACK.', 'sel', 3)}
            {turn('나', 'Got it — your upper back, near the shoulder blades?', 'sel', 4)}
            {turn('환자', "Yes! Finally. It's a nine, maybe ten.", 'off', 5)}
            {turn('나', 'When did it start?', 'blocked', 6)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: 9 }}>
            <span style={{ fontFamily: HW, fontSize: 14, color: c.green }}>✓ 3턴 선택됨 (3~5턴)</span>
            <div style={{ flex: 1 }}/>
            <span style={{ fontFamily: HW, fontSize: 13, color: c.soft }}>최대 6턴</span>
          </div>
          {/* 한마디 */}
          <div style={{ marginTop: 13, fontFamily: HW, fontSize: 16, color: c.ink }}>같이 올릴 한마디</div>
          <div style={{ ...paper(-0.3), marginTop: 7, padding: '11px 13px', fontFamily: HW, fontSize: 15.5, color: c.ink, lineHeight: 1.4 }}>
            환자분이 제 발음을 듣고 "허리가 아니라 등이요"를 세 번…<span style={{ borderLeft: `2px solid ${c.ink}`, marginLeft: 1 }}/>
          </div>
          <div style={{ display: 'flex', gap: 5, marginTop: 8 }}>
            {['#발음굴욕', '#통증사정', '+ 태그'].map((t, i) => (
              <span key={t} style={{ fontFamily: HW, fontSize: 13, color: i === 2 ? c.soft : c.blue, border: i === 2 ? `1.3px dashed ${c.soft}` : 'none', borderRadius: 2, padding: i === 2 ? '1px 7px' : 0, whiteSpace: 'nowrap' }}>{t}</span>
            ))}
          </div>
          <div style={{ marginTop: 15, background: c.ink, color: c.paper, borderRadius: 3, padding: '13px 0', textAlign: 'center', fontFamily: HW, fontSize: 17.5, boxShadow: '3px 3px 0 rgba(62,54,43,.3)' }}><window.NbIcon name="pushpin" size={16} color="#FFFdf4"/> 라운지에 붙이기</div>
        </div>
      </Frame>
    );
  }

  // ── C · 상대 프로필 시트 (동료 요청) ──
  function LoungeProfile() {
    return (
      <Frame label="수첩 라운지 프로필">
        <div style={{ position: 'absolute', top: 44, left: 0, right: 0, height: 130, background: 'rgba(62,54,43,.28)' }}/>
        <div style={{ position: 'absolute', top: 168, left: 0, right: 0, bottom: 0, background: c.bg, backgroundImage: 'repeating-linear-gradient(transparent 0 27px, rgba(62,54,43,.06) 27px 28px)', borderTop: `1.5px solid #E0D6C0`, borderRadius: '18px 18px 0 0', boxShadow: '0 -4px 14px rgba(62,54,43,.2)' }}>
          <div style={{ width: 52, height: 5, background: 'rgba(62,54,43,.25)', borderRadius: 99, margin: '9px auto 0' }}/>
          <div style={{ position: 'absolute', top: 22, left: 0, right: 0, bottom: 78, overflowY: 'auto', padding: '8px 20px 20px' }}>
            {/* 헤더 */}
            <div style={{ display: 'flex', gap: 13 }}>
              <div style={{ ...paper(-2), padding: '5px 5px 2px', flexShrink: 0, alignSelf: 'flex-start' }}>
                <svg viewBox="0 0 64 70" width="66" height="72"><path d="M16 26 Q14 8 32 8 Q50 8 48 26 L47 32 Q32 26 17 32 Z" fill="#C99A1E" stroke={c.ink} strokeWidth="2" strokeLinejoin="round"/><circle cx="32" cy="33" r="14" fill="#F6DCC0" stroke={c.ink} strokeWidth="2"/><circle cx="27" cy="32" r="1.4" fill={c.ink}/><circle cx="37" cy="32" r="1.4" fill={c.ink}/><path d="M28 39 Q32 42 36 39" fill="none" stroke={c.ink} strokeWidth="2" strokeLinecap="round"/><path d="M14 70 Q16 53 32 53 Q48 53 50 70" fill="#8FC7E8" stroke={c.ink} strokeWidth="2" strokeLinejoin="round"/></svg>
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontFamily: HW, fontSize: 24, color: c.ink }}>Grace RN</span>
                  <span style={{ fontFamily: MONO, fontSize: 9, fontWeight: 700, color: '#fff', background: c.green, padding: '1px 6px', borderRadius: 2, whiteSpace: 'nowrap' }}>현지 근무중</span>
                </div>
                <div style={{ fontSize: 11.5, color: c.soft, marginTop: 3 }}>간호사 · 🇺🇸 텍사스 종합병원 3년차 · ICU</div>
                <div style={{ display: 'flex', gap: 5, marginTop: 7, flexWrap: 'wrap' }}>
                  {['#NCLEX 합격', '#현지팁', '#멘토 열려있음'].map(t => <span key={t} style={{ fontFamily: HW, fontSize: 12.5, color: c.blue, whiteSpace: 'nowrap' }}>{t}</span>)}
                </div>
              </div>
            </div>
            {/* 스탯 */}
            <div style={{ display: 'flex', gap: 9, marginTop: 13 }}>
              {[['라운지 글','32',-0.5],['받은 응원','412',0.4],['동료','18',-0.4]].map((s, i) => (
                <div key={i} style={{ ...paper(s[2]), flex: 1, padding: '8px 0', textAlign: 'center' }}>
                  <div style={{ fontSize: 10, color: c.soft }}>{s[0]}</div>
                  <div style={{ fontFamily: HW, fontSize: 19, color: c.ink, marginTop: 1 }}>{s[1]}</div>
                </div>
              ))}
            </div>
            {/* 소개 메모 */}
            <div style={{ ...paper(0.4), marginTop: 12, padding: '11px 13px', fontFamily: HW, fontSize: 15, color: c.ink, lineHeight: 1.45 }}>
              한국에서 5년, 텍사스에서 3년째 ICU 간호사로 일하고 있어요. NCLEX·영어 면접 질문 환영. 준비하던 시절의 저처럼 막막한 분들 돕고 싶어요 ✎
            </div>
            {/* 최근 글 */}
            <div style={{ marginTop: 13, fontFamily: HW, fontSize: 15.5, color: c.ink }}>— 최근 글 ——</div>
            {[['미국 병동에서 진짜 많이 쓰는 말 Top 3', '응원 58 · 댓글 21'], ['야간 인계 때 살아남는 법 (진지)', '응원 44 · 댓글 12']].map((p, i) => (
              <div key={i} style={{ ...paper(i % 2 ? 0.4 : -0.4), marginTop: 8, padding: '9px 12px', display: 'flex', alignItems: 'center', gap: 9 }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontFamily: HW, fontSize: 15, color: c.ink, lineHeight: 1.15 }}>{p[0]}</div>
                  <div style={{ fontSize: 10, color: c.soft, marginTop: 2 }}>{p[1]}</div>
                </div>
                <span style={{ fontFamily: HW, fontSize: 15, color: c.soft }}>›</span>
              </div>
            ))}
            {/* 액션 */}
            <div style={{ display: 'flex', gap: 9, marginTop: 15 }}>
              <div style={{ flex: 1.4, background: c.ink, color: c.paper, borderRadius: 3, padding: '12px 0', textAlign: 'center', fontFamily: HW, fontSize: 16.5, boxShadow: '2px 2px 0 rgba(62,54,43,.3)', transform: 'rotate(-0.4deg)' }}><window.NbIcon name="handshake2" size={16} color="#FFFdf4"/> 동료 요청 보내기</div>
              <div style={{ ...paper(0.5), flex: 1, padding: '12px 0', textAlign: 'center', fontFamily: HW, fontSize: 15.5, color: c.ink }}>응원 남기기</div>
            </div>
            <div style={{ fontSize: 10.5, color: c.soft, textAlign: 'center', marginTop: 8 }}>동료가 되면 서로의 학습 현황을 보고 응원할 수 있어요</div>
          </div>
        </div>
      </Frame>
    );
  }

  Object.assign(window, { LoungeFeed, LoungeShare, LoungeProfile });
})();
