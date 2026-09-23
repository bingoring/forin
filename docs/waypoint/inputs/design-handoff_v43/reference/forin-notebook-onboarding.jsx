// forin-notebook-onboarding.jsx — 온보딩 4단계 (수첩 그림체 · NbUI 사용)
// 은유: "새 근무 수첩 만들기" — 표지 → 직업 → 목적지 → 진단·목표(사원증 완성)
(function () {
  const NB = window.NB;
  const { NbPaper, NbTape, NbButton, NbTag, NbStamp, NbMark, NbMemo, NbGauge, NbCheck, NbFrame } = window.NbUI;
  const NbIcon = window.NbIcon;
  const HW = '"Gaegu","Nanum Pen Script",cursive';
  const F = '"Pretendard",sans-serif';
  const MONO = '"IBM Plex Mono",monospace';
  const c = { ink: '#3E362B', soft: '#9A8F7C', red: '#C75146', blue: '#4A6FA5', green: '#5F8D5A', paper: '#FFFdf4' };

  const dots = (n) => (
    <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
      {[0,1,2,3].map(i => <span key={i} style={{ width: i === n ? 22 : 8, height: 8, borderRadius: 99, background: i === n ? c.ink : 'rgba(62,54,43,.25)', transition: 'width .2s' }}/>)}
    </div>
  );
  const skip = <span style={{ fontFamily: HW, fontSize: 14, color: c.soft, textDecoration: 'underline', textUnderlineOffset: 3 }}>건너뛰기</span>;

  // ── A · 표지 (웰컴) ──
  function OnbCover() {
    return (
      <NbFrame label="수첩 온보딩 · 표지" nav={false}>
        <div style={{ position: 'absolute', top: 44, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px 34px 34px' }}>
          {/* 여권형 표지 */}
          <NbPaper rot={-1} tape tapeLeft={104} style={{ width: '100%', padding: 0, background: '#2E4636', overflow: 'visible' }}>
            <div style={{ border: '1.6px solid rgba(212,180,106,.85)', margin: 7, padding: '26px 20px 16px', textAlign: 'center' }}>
              <div style={{ fontFamily: MONO, fontSize: 10, fontWeight: 700, letterSpacing: 4, color: '#D4B46A' }}>PASSPORT</div>
              <div style={{ fontFamily: HW, fontSize: 15, color: 'rgba(212,180,106,.75)', marginTop: 3 }}>forin</div>
              {/* 금장 엠블럼 */}
              <div style={{ width: 92, height: 92, margin: '20px auto 0', borderRadius: '50%', border: '2px solid #D4B46A', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <div style={{ position: 'absolute', inset: 5, borderRadius: '50%', border: '1.2px solid rgba(212,180,106,.6)' }}/>
                <NbIcon name="stetho" size={46} color="#D4B46A"/>
              </div>
              <div style={{ fontFamily: HW, fontSize: 33, color: '#F3E6C8', marginTop: 20, lineHeight: 1.2 }}>내일은,<br/>해외에서 출근</div>
              <div style={{ fontFamily: HW, fontSize: 14.5, color: 'rgba(243,230,200,.65)', marginTop: 8 }}>말이 통해야, 일이 통한다</div>
              {/* MRZ 기계판독부 */}
              <div style={{ marginTop: 22, paddingTop: 10, borderTop: '1.2px solid rgba(212,180,106,.4)', fontFamily: MONO, fontSize: 9.5, color: 'rgba(243,230,200,.55)', letterSpacing: 1.5, lineHeight: 1.7, textAlign: 'left', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                P&lt;FORIN&lt;&lt;RN&lt;&lt;GLOBAL&lt;&lt;NURSE&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;<br/>
                EN2026&lt;&lt;USA&lt;AUS&lt;CAN&lt;GBR&lt;&lt;&lt;&lt;&lt;D142&lt;&lt;&lt;
              </div>
            </div>
          </NbPaper>
          <div style={{ flex: 1 }}/>
          <NbMemo rot={0.3} style={{ alignSelf: 'stretch' }}>실제 병원 상황 속에서 <b style={{ color: c.blue }}>대화로</b> 현지 언어를 익히는 직업 시뮬레이터예요.</NbMemo>
          <NbButton variant="ink" size="lg" full icon="pencil" iconColor="#FFFdf4" style={{ alignSelf: 'stretch', marginTop: 14 }}>새 수첩 만들기</NbButton>
          <div style={{ fontFamily: HW, fontSize: 14, color: c.soft, marginTop: 12 }}>이미 수첩이 있어요 · <span style={{ textDecoration: 'underline', textUnderlineOffset: 3, color: c.ink }}>로그인</span></div>
        </div>
      </NbFrame>
    );
  }

  // ── B · 직업 선택 ──
  function OnbJob() {
    const job = (icon, name, sub, state, rot) => (
      <NbPaper rot={rot} style={{ marginTop: 11, padding: '13px 15px', display: 'flex', alignItems: 'center', gap: 12, opacity: state === 'soon' ? .55 : 1, ...(state === 'on' ? { boxShadow: '0 2px 6px rgba(62,54,43,.14), 0 0 0 2.5px #E9C45A' } : {}) }}>
        <NbIcon name={icon} size={30}/>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontFamily: HW, fontSize: 19, color: c.ink, lineHeight: 1.05 }}>{state === 'on' ? <NbMark>{name}</NbMark> : name}</div>
          <div style={{ fontSize: 11, color: c.soft, marginTop: 2 }}>{sub}</div>
        </div>
        {state === 'on' && <NbCheck done/>}
        {state === 'soon' && <NbTag color={c.soft} rot={2}>준비중</NbTag>}
      </NbPaper>
    );
    return (
      <NbFrame label="수첩 온보딩 · 직업" nav={false}>
        <div style={{ position: 'absolute', top: 44, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', padding: '14px 24px 30px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <NbPaper rot={-1} style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HW, fontSize: 16, color: c.ink }}>‹</NbPaper>
            <div style={{ flex: 1 }}/>
            {skip}
          </div>
          <div style={{ fontFamily: HW, fontSize: 27, color: c.ink, marginTop: 18, lineHeight: 1.25 }}>어떤 일을 하시나요?</div>
          <div style={{ fontSize: 12, color: c.soft, marginTop: 4 }}>직업에 맞는 일터와 상황이 준비돼요</div>
          <div style={{ marginTop: 10 }}>
            {job('stetho', '간호사', '병원 캠퍼스 · 24개 부서 · NCLEX/OET 대비', 'on', -0.4)}
            {job('bell', '호텔리어', '호텔 프런트 · 컨시어지 상황', 'soon', 0.4)}
            {job('coffee', '바리스타 · 서비스직', '카페 · 주문/컴플레인 상황', 'soon', -0.3)}
            {job('gear', '엔지니어', '오피스 · 스탠드업/코드리뷰 상황', 'soon', 0.3)}
          </div>
          <NbMemo rot={-0.3} style={{ marginTop: 14 }}>지금은 <b style={{ color: c.blue }}>간호사</b>부터! 다른 직업 수첩도 차례로 열려요.</NbMemo>
          <div style={{ flex: 1 }}/>
          {dots(1)}
          <NbButton variant="ink" size="lg" full style={{ marginTop: 14 }}>다음 ›</NbButton>
        </div>
      </NbFrame>
    );
  }

  // ── C · 목적지 선택 ──
  function OnbDest() {
    const dest = (flagTxt, name, sub, state, rot) => (
      <NbPaper rot={rot} style={{ padding: '15px 6px 12px', textAlign: 'center', ...(state === 'on' ? { boxShadow: '0 2px 6px rgba(62,54,43,.14), 0 0 0 2.5px #E9C45A' } : {}) }}>
        <div style={{ fontSize: 26 }}>{flagTxt}</div>
        <div style={{ fontFamily: HW, fontSize: 17, color: c.ink, marginTop: 4 }}>{state === 'on' ? <NbMark>{name}</NbMark> : name}</div>
        <div style={{ fontSize: 9.5, color: c.soft, marginTop: 2, whiteSpace: 'nowrap' }}>{sub}</div>
      </NbPaper>
    );
    return (
      <NbFrame label="수첩 온보딩 · 목적지" nav={false}>
        <div style={{ position: 'absolute', top: 44, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', padding: '14px 24px 30px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <NbPaper rot={-1} style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HW, fontSize: 16, color: c.ink }}>‹</NbPaper>
            <div style={{ flex: 1 }}/>
            {skip}
          </div>
          <div style={{ fontFamily: HW, fontSize: 27, color: c.ink, marginTop: 18, lineHeight: 1.25 }}>어디로 떠나나요?</div>
          <div style={{ fontSize: 12, color: c.soft, marginTop: 4 }}>표현·억양·면허 정보가 나라에 맞춰져요</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 16 }}>
            {dest('🇺🇸', '미국', 'NCLEX-RN · EN-US', 'on', -0.5)}
            {dest('🇦🇺', '호주', 'OBA · EN-AU', 'off', 0.5)}
            {dest('🇨🇦', '캐나다', 'NCLEX · EN-CA', 'off', -0.4)}
            {dest('🇬🇧', '영국', 'NMC · EN-GB', 'off', 0.4)}
          </div>
          {/* 여권 도장 낙서 */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
            <NbStamp color={c.blue} top="DESTINATION" bottom="USA" size={72} rot={-7}/>
          </div>
          <NbMemo rot={0.3} style={{ marginTop: 14 }}>미국을 고르면 <b style={{ color: c.blue }}>미국 종합병원</b> 세계관 + 미국식 표현으로 진행돼요.</NbMemo>
          <div style={{ flex: 1 }}/>
          {dots(2)}
          <NbButton variant="ink" size="lg" full style={{ marginTop: 14 }}>다음 ›</NbButton>
        </div>
      </NbFrame>
    );
  }

  // ── D · 수준·목표 → 사원증 발급 ──
  function OnbLevel() {
    const lv = (t, sub, on, rot) => (
      <NbPaper rot={rot} style={{ marginTop: 9, padding: '10px 13px', display: 'flex', alignItems: 'center', gap: 10, ...(on ? { boxShadow: '0 2px 6px rgba(62,54,43,.14), 0 0 0 2.5px #E9C45A' } : {}) }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontFamily: HW, fontSize: 16.5, color: c.ink, lineHeight: 1.1 }}>{on ? <NbMark>{t}</NbMark> : t}</div>
          <div style={{ fontSize: 10.5, color: c.soft, marginTop: 2 }}>{sub}</div>
        </div>
        <NbCheck done={on}/>
      </NbPaper>
    );
    return (
      <NbFrame label="수첩 온보딩 · 수준과 목표" nav={false}>
        <div style={{ position: 'absolute', top: 44, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', padding: '14px 24px 30px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <NbPaper rot={-1} style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HW, fontSize: 16, color: c.ink }}>‹</NbPaper>
            <div style={{ flex: 1 }}/>
          </div>
          <div style={{ fontFamily: HW, fontSize: 27, color: c.ink, marginTop: 14, lineHeight: 1.25 }}>지금 영어는 어느 정도?</div>
          {lv('더듬더듬 — 단어 위주로 말해요', '기초 표현부터 · 보기 중에서 선택 위주', false, -0.3)}
          {lv('문장은 되는데 병원 영어가 막혀요', '임상 표현 집중 · 보기+직접 말하기 반반', true, 0.3)}
          {lv('일상 대화 OK, 실전 감각이 필요해요', '직접 말하기 위주 · 돌발 상황 많이', false, -0.3)}
          <div style={{ fontFamily: HW, fontSize: 20, color: c.ink, marginTop: 18 }}>목표일이 있나요?</div>
          <NbPaper rot={0.3} style={{ marginTop: 8, padding: '11px 13px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <NbIcon name="calendar" size={20}/>
            <span style={{ fontFamily: HW, fontSize: 16, color: c.ink }}>NCLEX 시험일</span>
            <div style={{ flex: 1 }}/>
            <span style={{ fontFamily: MONO, fontSize: 13, fontWeight: 700, color: c.blue, borderBottom: `1.7px solid rgba(62,54,43,.4)`, whiteSpace: 'nowrap' }}>2027. 1. 21</span>
          </NbPaper>
          {/* 사원증 발급 미리보기 */}
          <div style={{ marginTop: 18, fontFamily: HW, fontSize: 15, color: c.soft, textAlign: 'center' }}>─ 수첩 첫 장에 붙을 사원증 ─</div>
          <NbPaper rot={-0.8} tape tapeLeft={130} style={{ marginTop: 10, padding: '13px 15px', display: 'flex', gap: 12, alignItems: 'center' }}>
            <NbIcon name="me" size={38}/>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontFamily: MONO, fontSize: 13, fontWeight: 700, color: c.ink }}>RN · Learner</div>
              <div style={{ fontSize: 10.5, color: c.soft, marginTop: 2, whiteSpace: 'nowrap' }}>EN-US · 미국 종합병원 · D-142</div>
              <div style={{ marginTop: 6 }}><NbGauge value={2} height={8}/></div>
            </div>
            <NbTag color={c.green}>EN B1</NbTag>
          </NbPaper>
          <div style={{ flex: 1, minHeight: 14 }}/>
          {dots(3)}
          <NbButton variant="ink" size="lg" full icon="pencil" iconColor="#FFFdf4" style={{ marginTop: 14 }}>첫 출근하기</NbButton>
        </div>
      </NbFrame>
    );
  }

  Object.assign(window, { OnbCover, OnbJob, OnbDest, OnbLevel });
})();
