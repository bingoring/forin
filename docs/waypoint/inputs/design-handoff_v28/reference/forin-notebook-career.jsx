// forin-notebook-career.jsx — 일터(커리어) 탭: 실구현 구조를 수첩 그림체로 이식
// 구조(실구현과 동일): 검색 → 즐겨찾기 → 건물 아코디언(층 목록) → 층 탭하면
// 바텀시트(층 커리큘럼 드랍다운 + 커리큘럼 밖 상황) → 하단 탐험 모드.
(function () {
  const c = { bg: '#F1EBDD', paper: '#FFFdf4', ink: '#3E362B', soft: '#9A8F7C', red: '#C75146', blue: '#4A6FA5', green: '#5F8D5A', tape: 'rgba(160,200,220,.55)' };
  const HW = '"Gaegu","Nanum Pen Script",cursive';
  const F = '"Pretendard",sans-serif';
  const paper = (rot = 0) => ({ background: c.paper, border: `1px solid #E0D6C0`, boxShadow: '0 2px 6px rgba(62,54,43,.14)', transform: `rotate(${rot}deg)`, position: 'relative' });
  const NbIcon = window.NbIcon;
  const HL = { background: 'linear-gradient(transparent 55%, #F9E37B 55%)', padding: '0 2px' };
  const stamp = (txt) => <span style={{ background: c.ink, color: c.paper, fontFamily: HW, fontSize: 12, padding: '1px 7px', borderRadius: 2, flexShrink: 0 }}>{txt}</span>;
  const star = (on) => <NbIcon name="star" size={19} color={on ? '#C99A1E' : '#C9BFA8'} style={{ opacity: on ? 1 : .8 }}/>;
  const prog = (done, total, color = c.green) => (
    <span style={{ display: 'inline-flex', gap: 2.5, verticalAlign: '-1px' }}>
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} style={{ width: 8, height: 8, border: `1.3px solid ${i < done ? color : c.soft}`, background: i < done ? 'rgba(95,141,90,.35)' : 'transparent', borderRadius: 1.5 }}/>
      ))}
    </span>
  );

  function Frame({ label, children, active }) {
    return (
      <div style={{ boxSizing: 'border-box', width: 402, height: 874, background: c.bg, backgroundImage: 'repeating-linear-gradient(transparent 0 27px, rgba(62,54,43,.06) 27px 28px)', borderRadius: 40, overflow: 'hidden', position: 'relative', fontFamily: F }} data-screen-label={label}>
        <div style={{ height: 44, display: 'flex', alignItems: 'center', padding: '0 24px', fontSize: 14, fontWeight: 700, color: c.ink }}>9:41<div style={{ flex: 1 }}/>▮▮▮</div>
        {children}
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 68, background: c.paper, borderTop: `1.5px solid #E0D6C0`, display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '0 8px 8px', zIndex: 30 }}>
          {[['home','홈'],['hospital','일터'],['board','상황판'],['lab','리뷰랩'],['me','나']].map((t, i) => (
            <div key={i} style={{ textAlign: 'center', opacity: t[1] === active ? 1 : .55 }}>
              <div style={{ height: 20 }}><NbIcon name={t[0]} size={19}/></div>
              <div style={{ fontFamily: HW, fontSize: 13, color: c.ink, fontWeight: t[1] === active ? 700 : 400 }}>{t[1]}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── B · 일터 목록 (검색 + 즐겨찾기 + 건물 아코디언) ──
  function CareerScrapbook() {
    const floorRow = (fl, name, doneN, totalN, opts = {}) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 10px', borderTop: `1.5px dashed rgba(62,54,43,.16)`, background: opts.now ? 'rgba(249,227,123,.25)' : 'transparent', opacity: opts.dim ? .55 : 1 }}>
        {stamp(fl)}
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontFamily: HW, fontSize: 17, color: c.ink, lineHeight: 1.1 }}>
            {opts.now ? <mark style={HL}>{name}</mark> : name}
            {opts.now && <span style={{ marginLeft: 6, fontSize: 10.5, fontFamily: F, fontWeight: 800, color: c.red, border: `1.3px solid ${c.red}`, borderRadius: 2, padding: '0 4px', verticalAlign: '2px' }}>지금</span>}
          </div>
          <div style={{ marginTop: 3, fontSize: 10.5, color: c.soft }}>{prog(doneN, totalN)} <span style={{ marginLeft: 4 }}>커리큘럼 {totalN}</span></div>
        </div>
        {star(opts.fav)}
      </div>
    );
    const building = (icon, name, subs, n, m, open, children, rot) => (
      <div style={{ ...paper(rot), marginTop: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 12px' }}>
          <NbIcon name={icon} size={26}/>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontFamily: HW, fontSize: 19, color: c.ink, lineHeight: 1 }}>{name}</div>
            <div style={{ fontSize: 10.5, color: c.soft, marginTop: 3 }}>{subs}</div>
          </div>
          <span style={{ fontFamily: HW, fontSize: 14, color: c.soft, whiteSpace: 'nowrap' }}>{n}/{m}</span>
          <span style={{ fontFamily: HW, fontSize: 16, color: c.ink }}>{open ? '∧' : '∨'}</span>
        </div>
        {open && children}
      </div>
    );
    return (
      <Frame label="수첩 일터 목록" active="일터">
        <div style={{ position: 'absolute', top: 44, left: 0, right: 0, bottom: 78, overflowY: 'auto', padding: '10px 20px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <div style={{ fontFamily: HW, fontSize: 30, color: c.ink }}>일터 수첩</div>
            <span style={{ marginLeft: 8, fontSize: 10.5, fontWeight: 800, color: c.green, border: `1.5px solid ${c.green}`, borderRadius: 2, padding: '1px 5px' }}>EN B1</span>
            <div style={{ flex: 1 }}/>
            <span style={{ fontFamily: HW, fontSize: 15, color: c.soft }}><NbIcon name="star" size={14} color="#C99A1E"/> 12일 연속</span>
          </div>
          {/* 검색 — 밑줄 필기란 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, padding: '7px 4px', borderBottom: `2px solid rgba(62,54,43,.45)` }}>
            <NbIcon name="magnify" size={17}/>
            <span style={{ fontFamily: HW, fontSize: 16, color: '#B4A88F' }}>과·병동·커리큘럼 이름으로 찾기…</span>
          </div>
          {/* 즐겨찾기 */}
          <div style={{ marginTop: 14, fontFamily: HW, fontSize: 16, color: c.ink }}><NbIcon name="star" size={15} color="#C99A1E"/> 즐겨찾기</div>
          {[['3F','수술실 · PACU','본관',-0.5],['P1','중앙 약제부','본관',0.6]].map((f, i) => (
            <div key={i} style={{ ...paper(f[3]), marginTop: 8, display: 'flex', alignItems: 'center', gap: 9, padding: '9px 11px' }}>
              {stamp(f[0])}
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontFamily: HW, fontSize: 17, color: c.ink, lineHeight: 1 }}>{f[1]}</div>
                <div style={{ fontSize: 10.5, color: c.soft, marginTop: 2 }}>{f[2]}</div>
              </div>
              {star(true)}
            </div>
          ))}
          {/* 건물 아코디언 */}
          {building('siren', '본관', '응급 · 수술 · 중환자 · 병동', 1, 29, true, (
            <div>
              {floorRow('1F', '응급의료센터', 1, 5, { now: true })}
              {floorRow('P1', '중앙 약제부', 0, 4, { fav: true })}
              {floorRow('3F', '수술실 · PACU', 0, 4, { fav: true })}
              {floorRow('4F', 'ICU', 0, 4, { dim: true })}
              {floorRow('8F', '일반 내과 병동', 0, 3, { dim: true })}
            </div>
          ), -0.4)}
          {building('baby', '별관 1', '여성 · 소아 · 신생아', 0, 18, false, null, 0.5)}
          {building('pill', '별관 2', '재활 · 정신 · 종양 · 완화', 0, 15, false, null, -0.5)}
          {building('monitor', '별관 3', '영상 · 외래 · 주사 · 내시경', 0, 15, false, null, 0.4)}
          {building('board', '지원동', '영안실 · 공급 · 휴게 · 시뮬랩', 0, 12, false, null, -0.3)}
          {/* 탐험 모드 */}
          <div style={{ marginTop: 16, border: `1.7px dashed ${c.blue}`, borderRadius: 3, padding: '11px 0', textAlign: 'center', fontFamily: HW, fontSize: 17, color: c.blue, transform: 'rotate(-0.3deg)', background: 'rgba(74,111,165,.06)' }}>
            <NbIcon name="compass" size={17}/> 일터 탐험 모드 — 맵 돌아다니기
          </div>
        </div>
      </Frame>
    );
  }

  // ── C · 층 바텀시트 (커리큘럼 드랍다운 + 커리큘럼 밖 상황) ──
  function FloorSheetScrapbook() {
    const step = (icon, name, sub, state) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 9px', borderTop: `1.3px dashed rgba(62,54,43,.14)`, opacity: state === 'lock' ? .45 : 1, background: state === 'retry' ? 'rgba(143,199,232,.22)' : 'transparent' }}>
        <NbIcon name={state === 'lock' ? 'lock' : icon} size={16}/>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontFamily: HW, fontSize: 15.5, color: c.ink, lineHeight: 1.05 }}>{name}</div>
          <div style={{ fontSize: 10, color: c.soft, marginTop: 1.5 }}>{sub}</div>
        </div>
        {state === 'done' && <svg viewBox="0 0 24 24" width="17" height="17"><path d="M5 12 L10 17 L20 6" fill="none" stroke={c.green} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/></svg>}
        {state === 'retry' && <span style={{ fontSize: 10, fontWeight: 800, color: c.blue, border: `1.3px solid ${c.blue}`, borderRadius: 2, padding: '1px 5px', whiteSpace: 'nowrap' }}>다시</span>}
      </div>
    );
    const chap = (name, next, n, m, mode, rot) => (
      <div style={{ ...paper(rot), marginTop: 10, padding: '10px 12px', ...(mode === 'done' ? { background: 'rgba(95,141,90,.12)' } : {}), ...(mode === 'now' ? { boxShadow: '0 2px 6px rgba(62,54,43,.14), 0 0 0 2.5px #E9C45A' } : {}) }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontFamily: HW, fontSize: 17.5, color: c.ink, lineHeight: 1.05 }}>{mode === 'done' ? <span style={{ textDecoration: 'line-through', color: c.soft }}>{name}</span> : mode === 'now' ? <mark style={HL}>{name}</mark> : name}</div>
            {next && <div style={{ fontSize: 10.5, color: c.soft, marginTop: 2 }}>다음 · {next}</div>}
          </div>
          {mode === 'now' && <span style={{ fontSize: 10.5, fontWeight: 800, color: c.red, border: `1.3px solid ${c.red}`, borderRadius: 2, padding: '0 4px', whiteSpace: 'nowrap' }}>지금</span>}
          <span style={{ fontFamily: HW, fontSize: 13.5, color: c.soft, whiteSpace: 'nowrap' }}>{n}/{m}</span>
          <span style={{ fontFamily: HW, fontSize: 15, color: c.ink }}>{mode === 'now' ? '∧' : '∨'}</span>
        </div>
      </div>
    );
    const situ = (tag, tagColor, place, name, meta, btn, rot) => (
      <div style={{ ...paper(rot), marginTop: 10, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 9, ...(tag === '긴급' ? { background: '#FFF0EC', borderColor: '#E4B4A6' } : { opacity: .85 }) }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: tagColor, whiteSpace: 'nowrap' }}>{tag} · {place}</div>
          <div style={{ fontFamily: HW, fontSize: 17, color: c.ink, marginTop: 2, lineHeight: 1.05 }}>{name}</div>
          <div style={{ fontSize: 10, color: c.soft, marginTop: 2 }}>{meta}</div>
        </div>
        {star(false)}
        <div style={{ border: `1.7px solid ${tag === '긴급' ? c.red : c.ink}`, color: tag === '긴급' ? c.red : c.ink, fontFamily: HW, fontSize: 14, padding: '5px 11px', borderRadius: 3, transform: 'rotate(1.5deg)', flexShrink: 0 }}>{btn}</div>
      </div>
    );
    return (
      <Frame label="수첩 층 시트" active="일터">
        {/* 뒤 배경 살짝 어둡게 + 시트 */}
        <div style={{ position: 'absolute', top: 44, left: 0, right: 0, height: 60, background: 'rgba(62,54,43,.25)' }}/>
        <div style={{ position: 'absolute', top: 96, left: 0, right: 0, bottom: 0, background: c.bg, backgroundImage: 'repeating-linear-gradient(transparent 0 27px, rgba(62,54,43,.06) 27px 28px)', borderTop: `1.5px solid #E0D6C0`, borderRadius: '18px 18px 0 0', boxShadow: '0 -4px 14px rgba(62,54,43,.2)' }}>
          <div style={{ width: 52, height: 5, background: 'rgba(62,54,43,.25)', borderRadius: 99, margin: '9px auto 0' }}/>
          <div style={{ position: 'absolute', top: 20, left: 0, right: 0, bottom: 0, overflowY: 'auto', padding: '6px 20px 90px' }}>
            {/* 시트 헤더 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
              <div style={{ ...paper(-2), width: 46, height: 46, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><NbIcon name="siren" size={28}/></div>
              <div>
                <div style={{ fontFamily: HW, fontSize: 24, color: c.ink, lineHeight: 1 }}>응급의료센터</div>
                <div style={{ fontSize: 11, color: c.soft, marginTop: 3 }}>본관 1F · 지금 근무 중인 층</div>
              </div>
              <div style={{ flex: 1 }}/>
              {star(false)}
            </div>
            {/* 스탯 */}
            <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
              {[['커리큘럼','1/5'],['해결한 상황','4/20+']].map((s, i) => (
                <div key={i} style={{ ...paper(i ? 0.5 : -0.5), flex: 1, padding: '9px 0', textAlign: 'center' }}>
                  <div style={{ fontSize: 10.5, color: c.soft }}>{s[0]}</div>
                  <div style={{ fontFamily: HW, fontSize: 21, color: c.ink, marginTop: 1 }}>{s[1]}</div>
                </div>
              ))}
            </div>
            {/* 커리큘럼 */}
            <div style={{ marginTop: 15, fontFamily: HW, fontSize: 16, color: c.ink }}>— 이 층의 커리큘럼 ——</div>
            {chap('첫 출근 · 인계받기', null, 5, 5, 'done', -0.4)}
            <div style={{ ...paper(0.3), marginTop: 10, boxShadow: '0 2px 6px rgba(62,54,43,.14), 0 0 0 2.5px #E9C45A' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px 8px' }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontFamily: HW, fontSize: 17.5, color: c.ink, lineHeight: 1.05 }}><mark style={HL}>접수와 트리아지</mark></div>
                  <div style={{ fontSize: 10.5, color: c.soft, marginTop: 2 }}>다음 · 두부 외상 사정</div>
                </div>
                <span style={{ fontSize: 10.5, fontWeight: 800, color: c.red, border: `1.3px solid ${c.red}`, borderRadius: 2, padding: '0 4px', whiteSpace: 'nowrap' }}>지금</span>
                <span style={{ fontFamily: HW, fontSize: 13.5, color: c.soft, whiteSpace: 'nowrap' }}>3/7</span>
                <span style={{ fontFamily: HW, fontSize: 15, color: c.ink }}>∧</span>
              </div>
              {step('speech', '통증 사정', '대화 · 1/2 보기 중에서', 'done')}
              {step('speech', '통증 사정', '대화 · 2/2 직접 대화', 'done')}
              {step('pencil', '통증 표현 짝맞추기', '퀴즈 · 선택', 'todo')}
              {step('speech', '두부 외상 사정', '대화 · 1/2 보기 중에서', 'retry')}
              {step('speech', '두부 외상 사정', '대화 · 2/2 직접 대화', 'lock')}
              {step('speech', '화상 응급 처치', '대화 · 1/2 보기 중에서', 'lock')}
              {step('trophy', '흉통 환자 트리아지', '챕터 시험', 'done')}
            </div>
            {chap('외상 · 실려 온 환자', '교통사고 환자 핸드오프', 0, 5, 'todo', -0.3)}
            {chap('아이와 보호자', '고열 아동', 1, 5, 'todo', 0.4)}
            {/* 커리큘럼 밖 상황 */}
            <div style={{ marginTop: 16, fontFamily: HW, fontSize: 16, color: c.ink }}>— 커리큘럼 밖의 상황 ——</div>
            {situ('완료', c.green, 'ER · TRIAGE', '흉통 환자 트리아지', 'Lv.B1 · 약 6분', '복습', -0.3)}
            {situ('완료', c.green, 'ER · TRAUMA BAY #4', '통증 사정 — Mrs. Hopkins', 'Lv.B1 · 약 5분', '복습', 0.4)}
            {situ('긴급', c.red, 'ER · QUIET ROOM', '자해 위험 환자 사정', 'Lv.B2 · 약 8분', '시작!', -0.4)}
          </div>
        </div>
      </Frame>
    );
  }

  // ── D · 상황 준비(브리핑) — C에서 상황을 누르면 ──
  function BriefingScrapbook() {
    const P = { stroke: c.ink, strokeWidth: 2, strokeLinejoin: 'round', strokeLinecap: 'round', fill: 'none' };
    const mission = (n, txt, hint) => (
      <div style={{ display: 'flex', gap: 9, alignItems: 'flex-start', padding: '8px 2px', borderTop: n > 1 ? `1.3px dashed rgba(62,54,43,.14)` : 'none' }}>
        <div style={{ width: 18, height: 18, border: `1.7px solid ${c.soft}`, borderRadius: 4, flexShrink: 0, marginTop: 2 }}/>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: HW, fontSize: 16.5, color: c.ink, lineHeight: 1.15 }}>{txt}</div>
          {hint && <div style={{ fontSize: 10.5, color: c.soft, marginTop: 2 }}>{hint}</div>}
        </div>
      </div>
    );
    return (
      <Frame label="수첩 상황 준비" active="일터">
        <div style={{ position: 'absolute', top: 44, left: 0, right: 0, bottom: 78, overflowY: 'auto', padding: '10px 20px 20px' }}>
          {/* 헤더 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ ...paper(-1), width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HW, fontSize: 16, color: c.ink, flexShrink: 0 }}>←</div>
            <div style={{ fontFamily: HW, fontSize: 24, color: c.ink }}>오늘의 상황 미리보기</div>
          </div>
          {/* 상황 표지 — 테이프 붙은 큰 종이 */}
          <div style={{ ...paper(-0.6), marginTop: 16, padding: '16px 16px 13px' }}>
            <div style={{ position: 'absolute', top: -10, left: 110, width: 74, height: 20, background: c.tape, transform: 'rotate(-4deg)', boxShadow: '0 1px 2px rgba(0,0,0,.08)' }}/>
            <div style={{ display: 'flex', gap: 13 }}>
              {/* 폴라로이드 초상 */}
              <div style={{ ...paper(-2.5), padding: '6px 6px 3px', flexShrink: 0 }}>
                <svg viewBox="0 0 72 84" width="78" height="90">
                  <path d="M20 26 Q18 10 36 10 Q54 10 52 26 L50 32 Q36 27 22 32 Z" fill="#8A6A4A" {...P}/>
                  <circle cx="36" cy="36" r="16" fill="#F6DCC0" {...P}/>
                  <path d="M29 34 L34 37 M34 34 L29 37 M43 34 L38 37 M38 34 L43 37" {...P}/>
                  <path d="M31 44 Q34 42 37 44 Q40 46 43 44" {...P}/>
                  <path d="M18 84 Q20 62 36 62 Q52 62 54 84" fill="#B8CBB0" {...P}/>
                </svg>
                <div style={{ textAlign: 'center', fontFamily: '"IBM Plex Mono",monospace', fontSize: 9, fontWeight: 700, color: c.ink, padding: '2px 0 1px', whiteSpace: 'nowrap' }}>Mrs. Hopkins</div>
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 10, fontWeight: 800, color: c.red, border: `1.3px solid ${c.red}`, borderRadius: 2, padding: '1px 5px', whiteSpace: 'nowrap' }}>ER · TRAUMA BAY #4</span>
                  <span style={{ fontSize: 10, fontWeight: 800, color: c.blue, border: `1.3px solid ${c.blue}`, borderRadius: 2, padding: '1px 5px', whiteSpace: 'nowrap' }}>Lv.B1 · 약 5분</span>
                </div>
                <div style={{ fontFamily: HW, fontSize: 23, color: c.ink, marginTop: 7, lineHeight: 1.15 }}>통증 사정<br/>— Mrs. Hopkins</div>
                <div style={{ fontSize: 11.5, color: c.soft, marginTop: 5, lineHeight: 1.55 }}>허리 통증을 호소하는 환자. 통증의 양상을 영어로 묻고 기록해야 해요.</div>
              </div>
            </div>
            {/* 감정 메모 */}
            <div style={{ marginTop: 11, padding: '7px 10px', background: '#FFF3EE', border: `1.5px dashed #D9A08E`, fontFamily: HW, fontSize: 14.5, color: c.red, transform: 'rotate(0.4deg)' }}>
              지금 기분: PAIN — 날카롭게 찌르는 통증으로 예민한 상태예요
            </div>
          </div>
          {/* 미션 체크리스트 */}
          <div style={{ ...paper(0.5), marginTop: 14, padding: '13px 15px 8px' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: c.blue, letterSpacing: 1 }}>☐ 이 상황의 미션 4</div>
            <div style={{ marginTop: 5 }}>
              {mission(1, '간호사로 자기소개하기', '이름 · 역할 · 오늘의 담당임을 알리기')}
              {mission(2, '통증 위치와 양상 묻기', 'stabbing, sharp 같은 표현 듣기')}
              {mission(3, '0~10 척도로 강도 확인', 'On a scale of 0 to 10…')}
              {mission(4, '방사통 여부 확인', 'Does it spread anywhere?')}
            </div>
          </div>
          {/* 보상 + 커리큘럼 위치 */}
          <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
            <div style={{ ...paper(-0.5), flex: 1, padding: '10px 12px' }}>
              <div style={{ fontSize: 10.5, color: c.soft }}>완료 보상</div>
              <div style={{ fontFamily: HW, fontSize: 17, color: c.ink, marginTop: 3 }}><NbIcon name="star" size={15} color="#C99A1E"/> 60 XP · 교정노트 자동 저장</div>
            </div>
            <div style={{ ...paper(0.6), width: 118, padding: '10px 12px', flexShrink: 0 }}>
              <div style={{ fontSize: 10.5, color: c.soft }}>커리큘럼</div>
              <div style={{ fontFamily: HW, fontSize: 15, color: c.ink, marginTop: 3, lineHeight: 1.2 }}>2장 · 접수와<br/>트리아지 4/7</div>
            </div>
          </div>
          {/* CTA */}
          <div style={{ marginTop: 18, background: c.ink, color: c.paper, padding: '14px 0', textAlign: 'center', fontFamily: HW, fontSize: 19, borderRadius: 3, boxShadow: '3px 3px 0 rgba(62,54,43,.3)' }}>출근해서 시작하기 ✎</div>
          <div style={{ marginTop: 10, textAlign: 'center', fontFamily: HW, fontSize: 14.5, color: c.blue, textDecoration: 'underline', textUnderlineOffset: 3 }}>모범 대본 먼저 훑어보기 (보기 모드)</div>
        </div>
      </Frame>
    );
  }

  function NotebookApp() {
    return (
      <DesignCanvas>
        <DCSection id="nb" title="forin Notebook — 근무 수첩 디자인 (메인 디벨롭)" subtitle="줄노트 종이 · 마스킹테이프 · 스탬프 · 손글씨 + 펜 낙서 아이콘">
          <DCArtboard eager={true} id="nb-home" label="A · 홈" width={402} height={874}><window.HomeScrapbook/></DCArtboard>
          <DCArtboard eager={true} id="nb-career" label="B · 일터 (검색 + 즐겨찾기 + 건물 아코디언)" width={402} height={874}><CareerScrapbook/></DCArtboard>
          <DCArtboard eager={true} id="nb-floor" label="C · 층 바텀시트 (커리큘럼 + 상황)" width={402} height={874}><FloorSheetScrapbook/></DCArtboard>
          <DCArtboard eager={true} id="nb-brief" label="D · 상황 준비 (브리핑)" width={402} height={874}><BriefingScrapbook/></DCArtboard>
          <DCArtboard eager={true} id="nb-kit" label="Z · NbUI 컴포넌트 킷 (누름 인터랙션)" width={402} height={880}><window.ScreenNbKit/></DCArtboard>
        </DCSection>
      </DesignCanvas>
    );
  }
  ReactDOM.createRoot(document.getElementById('root')).render(<NotebookApp/>);
})();
