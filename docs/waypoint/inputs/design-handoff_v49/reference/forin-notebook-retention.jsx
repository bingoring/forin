// forin-notebook-retention.jsx — 리텐션 시스템 (알림·스트릭 보호) · 근무 수첩
(function () {
  const { NbPaper, NbButton, NbTag, NbMark, NbMemo, NbCheck } = window.NbUI;
  const NbIcon = window.NbIcon;
  const HW = '"Gaegu","Nanum Pen Script",cursive';
  const F = '"Pretendard",sans-serif';
  const MONO = '"IBM Plex Mono",monospace';
  const c = { bg: '#F1EBDD', paper: '#FFFdf4', ink: '#3E362B', soft: '#9A8F7C', red: '#C75146', blue: '#4A6FA5', green: '#5F8D5A', amber: '#C77E2E' };

  function Frame({ label, children, dark }) {
    return (
      <div style={{ boxSizing: 'border-box', width: 402, height: 874, background: dark ? '#2B2620' : c.bg, backgroundImage: dark ? 'none' : 'repeating-linear-gradient(transparent 0 27px, rgba(62,54,43,.06) 27px 28px)', borderRadius: 40, overflow: 'hidden', position: 'relative', fontFamily: F }} data-screen-label={label}>
        <div style={{ height: 44, display: 'flex', alignItems: 'center', padding: '0 24px', fontSize: 14, fontWeight: 700, color: dark ? '#F1EBDD' : c.ink }}>9:41<div style={{ flex: 1 }}/>▮▮▮</div>
        {children}
      </div>
    );
  }

  // ── A · 잠금화면 푸시 (OS 알림 3종) ──
  function PushLock() {
    const noti = (icon, title, body, time, i) => (
      <div key={title} style={{ margin: '10px 18px 0', background: 'rgba(250,248,242,.92)', backdropFilter: 'blur(6px)', borderRadius: 14, padding: '11px 13px', display: 'flex', gap: 10, alignItems: 'flex-start', boxShadow: '0 4px 14px rgba(0,0,0,.25)', transform: `rotate(${i % 2 ? 0.3 : -0.3}deg)` }}>
        <div style={{ width: 34, height: 34, borderRadius: 8, background: '#2E4636', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ fontFamily: HW, fontSize: 20, color: '#D4B46A' }}>f</span>
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontSize: 12.5, fontWeight: 800, color: '#1E1A14' }}>{title}</span>
            <div style={{ flex: 1 }}/>
            <span style={{ fontSize: 10, color: '#8A8272' }}>{time}</span>
          </div>
          <div style={{ fontSize: 12, color: '#3E362B', marginTop: 2, lineHeight: 1.45 }}>{body}</div>
        </div>
        <div style={{ marginTop: 3, flexShrink: 0 }}><NbIcon name={icon} size={17}/></div>
      </div>
    );
    return (
      <Frame label="리텐션 · 잠금화면 푸시" dark>
        <div style={{ textAlign: 'center', paddingTop: 26 }}>
          <div style={{ fontFamily: MONO, fontSize: 13, color: 'rgba(241,235,221,.6)', letterSpacing: 2 }}>TUE, SEP 9</div>
          <div style={{ fontFamily: HW, fontSize: 64, color: '#F1EBDD', lineHeight: 1, marginTop: 4 }}>8:12</div>
        </div>
        <div style={{ marginTop: 26 }}>
          {noti('fire', '스트릭이 식어가요', '어제 못 왔죠? 오늘 3분이면 13일 스트릭이 살아나요. 보호권 1장 남음 🎫', '지금', 0)}
          {noti('lab', '복습 카드 5장이 기다려요', '"deterioration" 오늘 안 보면 잊혀질 확률 78% — D+3 골든타임이에요.', '1시간 전', 1)}
          {noti('pager', '📟 야간 호출 · CODE PAGE', '3병동 통증 호소 환자 — 응답하면 +40 XP. 오늘 밤까지만 유효해요.', '3시간 전', 2)}
        </div>
        <div style={{ margin: '18px 18px 0', textAlign: 'center' }}>
          <NbMemo rot={-0.3} color={c.amber} style={{ background: 'rgba(250,248,242,.9)', textAlign: 'left' }}><b style={{ color: c.amber }}>설계 원칙</b> 하루 최대 1건(호출은 예외) · 시간대는 사용자의 학습 습관 시각 ±30분 · 죄책감 대신 구체적 이득(3분·+40XP·78%)으로 말해요.</NbMemo>
        </div>
      </Frame>
    );
  }

  // ── B · 스트릭 보호 (보호권·동결) ──
  function StreakGuard() {
    const days = ['월', '화', '수', '목', '금', '토', '일'];
    const state = ['done', 'done', 'done', 'freeze', 'done', 'today', 'future'];
    return (
      <Frame label="리텐션 · 스트릭 보호">
        <div style={{ display: 'flex', alignItems: 'baseline', padding: '10px 22px 0' }}>
          <span style={{ fontFamily: HW, fontSize: 28, color: c.ink }}>연속 출근</span>
          <div style={{ flex: 1 }}/>
          <NbTag color={c.amber} rot={1}><NbIcon name="fire" size={13}/> 12일째</NbTag>
        </div>
        {/* 주간 도장 스트립 */}
        <div style={{ padding: '14px 22px 0' }}>
          <NbPaper rot={-0.4} tape tapeLeft={140} style={{ padding: '13px 12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {days.map((d, i) => (
                <div key={i} style={{ textAlign: 'center', width: 44 }}>
                  <div style={{ fontFamily: HW, fontSize: 12.5, color: c.soft }}>{d}</div>
                  <div style={{ width: 38, height: 38, margin: '5px auto 0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: state[i] === 'done' ? `2.4px double ${c.green}` : state[i] === 'freeze' ? `2px solid ${c.blue}` : state[i] === 'today' ? `2px dashed ${c.amber}` : `1.6px dashed rgba(62,54,43,.25)`,
                    color: state[i] === 'done' ? c.green : state[i] === 'freeze' ? c.blue : state[i] === 'today' ? c.amber : c.soft,
                    transform: state[i] === 'done' ? `rotate(${i % 2 ? 8 : -8}deg)` : 'none', background: state[i] === 'freeze' ? 'rgba(74,111,165,.08)' : 'transparent' }}>
                    {state[i] === 'done' && <span style={{ fontFamily: HW, fontSize: 15 }}>✓</span>}
                    {state[i] === 'freeze' && <NbIcon name="drop" size={16}/>}
                    {state[i] === 'today' && <span style={{ fontFamily: HW, fontSize: 12 }}>오늘</span>}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ fontFamily: HW, fontSize: 12.5, color: c.soft, marginTop: 9, textAlign: 'center' }}>목요일은 <b style={{ color: c.blue }}>동결권</b>이 지켜줬어요 — 스트릭 유지!</div>
          </NbPaper>
          {/* 보호권 지갑 */}
          <div style={{ fontFamily: HW, fontSize: 17, color: c.ink, marginTop: 16 }}>보호권 지갑 🎫</div>
          {[
            ['drop', '동결권', '하루 쉬어도 스트릭 유지 · 자동 사용', '1장 보유', c.blue],
            ['bandage', '응급 복구권', '끊긴 스트릭 24시간 안에 되살리기', '0장 · 7일 개근 시 지급', c.red],
          ].map((r, i) => (
            <NbPaper key={i} rot={i % 2 ? 0.5 : -0.5} style={{ marginTop: 10, padding: '11px 13px', display: 'flex', alignItems: 'center', gap: 11 }}>
              <NbIcon name={r[0]} size={20}/>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontFamily: HW, fontSize: 16.5, color: c.ink, lineHeight: 1.1 }}>{r[1]}</div>
                <div style={{ fontSize: 10.5, color: c.soft, marginTop: 2 }}>{r[2]}</div>
              </div>
              <NbTag color={r[4]} rot={i % 2 ? 2 : -2}>{r[3]}</NbTag>
            </NbPaper>
          ))}
          <div style={{ marginTop: 12 }}>
            <NbMemo rot={0.3} color={c.blue}><b style={{ color: c.blue }}>철학</b> 스트릭은 채찍이 아니라 안전망 — 잃는 공포 대신 "지켜졌다"는 안도를 설계해요.</NbMemo>
          </div>
          {/* 위기 모먼트 */}
          <div style={{ fontFamily: HW, fontSize: 17, color: c.ink, marginTop: 15 }}>오늘 놓치면? (23:40 시나리오)</div>
          <NbPaper rot={-0.4} style={{ marginTop: 9, padding: '12px 13px', boxShadow: `0 2px 6px rgba(62,54,43,.14), 0 0 0 2px ${c.amber}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <NbIcon name="fire" size={18}/>
              <span style={{ fontFamily: HW, fontSize: 16, color: c.ink }}>20분 남았어요 — 1분 미니 복습으로 지키기</span>
            </div>
            <div style={{ fontSize: 11, color: c.soft, marginTop: 5 }}>자정 직전엔 정식 학습 대신 카드 3장 초간단 복습으로도 출근 도장이 찍혀요.</div>
            <div style={{ marginTop: 10 }}><NbButton variant="ink" size="md" full>1분 복습으로 지키기 ✎</NbButton></div>
          </NbPaper>
        </div>
      </Frame>
    );
  }

  // ── C · 알림 설정 (사용자 통제) ──
  function NotifSettings() {
    const Toggle = ({ on }) => (
      <div style={{ width: 42, height: 24, borderRadius: 12, border: `1.8px solid ${c.ink}`, background: on ? c.green : 'transparent', position: 'relative', flexShrink: 0 }}>
        <div style={{ position: 'absolute', top: 2, left: on ? 20 : 2, width: 16, height: 16, borderRadius: '50%', background: c.paper, border: `1.5px solid ${c.ink}` }}/>
      </div>
    );
    const rows = [
      ['복습 리마인더', '잊기 직전 카드가 생기면 · 하루 1회', true],
      ['스트릭 위기 알림', '자정 2시간 전, 오늘 미출근 시', true],
      ['야간 호출 (보너스)', '주 2~3회 · 랜덤 시간', true],
      ['동료 응원 소식', '동료가 응원을 보내면', false],
      ['라운지 답글', '내 글에 답글이 달리면', true],
    ];
    return (
      <Frame label="리텐션 · 알림 설정">
        <div style={{ display: 'flex', alignItems: 'baseline', padding: '10px 22px 0' }}>
          <span style={{ fontFamily: HW, fontSize: 28, color: c.ink }}>알림 설정</span>
          <div style={{ flex: 1 }}/>
          <span style={{ fontFamily: HW, fontSize: 13, color: c.soft }}>나 › 설정</span>
        </div>
        <div style={{ padding: '12px 22px 0' }}>
          {/* 학습 시간 약속 */}
          <NbPaper rot={-0.4} tape tapeLeft={130} style={{ padding: '12px 14px' }}>
            <div style={{ fontFamily: HW, fontSize: 17, color: c.ink }}>나의 출근 시간 ✎</div>
            <div style={{ fontSize: 10.5, color: c.soft, marginTop: 2 }}>이 시간 근처로만 알림이 와요 (±30분)</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              {['아침 7–9시', '점심 12–1시', '밤 9–11시'].map((s, i) => (
                <div key={i} style={{ flex: 1, textAlign: 'center', fontFamily: HW, fontSize: 14, padding: '7px 0', border: i === 2 ? `2px solid ${c.ink}` : `1.5px dashed rgba(62,54,43,.35)`, borderRadius: 3, color: i === 2 ? c.ink : c.soft, background: i === 2 ? 'rgba(233,196,90,.25)' : 'transparent', transform: `rotate(${i % 2 ? 0.6 : -0.6}deg)`, whiteSpace: 'nowrap' }}>{s}</div>
              ))}
            </div>
          </NbPaper>
          {rows.map((r, i) => (
            <NbPaper key={i} rot={i % 2 ? 0.4 : -0.4} style={{ marginTop: 10, padding: '11px 13px', display: 'flex', alignItems: 'center', gap: 11 }}>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontFamily: HW, fontSize: 16, color: c.ink, lineHeight: 1.1 }}>{r[0]}</div>
                <div style={{ fontSize: 10.5, color: c.soft, marginTop: 2 }}>{r[1]}</div>
              </div>
              <Toggle on={r[2]}/>
            </NbPaper>
          ))}
          <div style={{ marginTop: 12 }}>
            <NbMemo rot={0.3}><b style={{ color: c.ink }}>약속</b> 하루 마케팅성 알림 0건. 모든 알림은 끌 수 있고, 2주 무반응 알림은 스스로 조용해져요.</NbMemo>
          </div>
        </div>
      </Frame>
    );
  }

  Object.assign(window, { PushLock, StreakGuard, NotifSettings });
})();
