// forin-notebook-placement.jsx — 레벨 진단 (배치고사) · 근무 수첩
// 온보딩 입국 직후 '첫 출근 전 실력 체크' — 여정 시작점과 대화 난이도를 배치한다.
(function () {
  const { NbPaper, NbButton, NbTag, NbMark, NbMemo, NbCheck, NbProgSquares, NbGauge } = window.NbUI;
  const NbIcon = window.NbIcon;
  const HW = '"Gaegu","Nanum Pen Script",cursive';
  const F = '"Pretendard",sans-serif';
  const MONO = '"IBM Plex Mono",monospace';
  const c = { bg: '#F1EBDD', paper: '#FFFdf4', ink: '#3E362B', soft: '#9A8F7C', red: '#C75146', blue: '#4A6FA5', green: '#5F8D5A', amber: '#C77E2E' };

  function Frame({ label, children }) {
    return (
      <div style={{ boxSizing: 'border-box', width: 402, height: 874, background: c.bg, backgroundImage: 'repeating-linear-gradient(transparent 0 27px, rgba(62,54,43,.06) 27px 28px)', borderRadius: 40, overflow: 'hidden', position: 'relative', fontFamily: F }} data-screen-label={label}>
        <div style={{ height: 44, display: 'flex', alignItems: 'center', padding: '0 24px', fontSize: 14, fontWeight: 700, color: c.ink }}>9:41<div style={{ flex: 1 }}/>▮▮▮</div>
        {children}
      </div>
    );
  }

  // ── A · 진단 안내 (첫 출근 전 실력 체크) ──
  function PlaceIntro() {
    return (
      <Frame label="레벨 진단 · 안내">
        <div style={{ padding: '18px 24px 0', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', transform: 'rotate(-8deg)' }}>
            <div style={{ width: 96, height: 96, borderRadius: '50%', border: `3px double ${c.blue}`, color: c.blue, display: 'inline-flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 2 }}>DAY 0</div>
              <div style={{ fontFamily: HW, fontSize: 20, lineHeight: 1.15 }}>실력 체크</div>
            </div>
          </div>
          <div style={{ fontFamily: HW, fontSize: 26, color: c.ink, marginTop: 16, lineHeight: 1.3 }}>첫 출근 전,<br/>수간호사 면담이 있어요</div>
          <div style={{ fontSize: 12, color: c.soft, marginTop: 7, lineHeight: 1.6 }}>5분 진단으로 딱 맞는 시작점을 찾아드려요.<br/>못해도 괜찮아요 — 배치일 뿐, 점수가 아니에요.</div>
        </div>
        <div style={{ padding: '16px 24px 0' }}>
          {[['speech', '듣고 답하기 3문항', '환자 발화를 듣고 자연스러운 응답 고르기'], ['mic', '따라 말하기 2문항', '핵심 문장 발음 · 유창성 측정'], ['pencil', '병원 어휘 3문항', '임상 용어 이해도']].map((r, i) => (
            <NbPaper key={i} rot={i % 2 ? 0.5 : -0.5} style={{ marginTop: 10, padding: '11px 13px', display: 'flex', alignItems: 'center', gap: 11 }}>
              <NbIcon name={r[0]} size={20}/>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: HW, fontSize: 16.5, color: c.ink, lineHeight: 1.1 }}>{r[1]}</div>
                <div style={{ fontSize: 10.5, color: c.soft, marginTop: 2 }}>{r[2]}</div>
              </div>
            </NbPaper>
          ))}
          <div style={{ marginTop: 13 }}>
            <NbMemo rot={0.3} color={c.blue}><b style={{ color: c.blue }}>메모</b> 결과에 따라 여정 지도의 시작 정거장과 대화 난이도(보기 중심 ↔ 직접 말하기)가 정해져요.</NbMemo>
          </div>
        </div>
        <div style={{ position: 'absolute', left: 24, right: 24, bottom: 34 }}>
          <NbButton variant="ink" size="lg" full>면담 시작 ✎</NbButton>
          <div style={{ textAlign: 'center', fontFamily: HW, fontSize: 13, color: c.soft, marginTop: 9, textDecoration: 'underline', textUnderlineOffset: 3 }}>건너뛰고 기초부터 시작하기</div>
        </div>
      </Frame>
    );
  }

  // ── B · 진단 진행 (듣고 답하기) ──
  function PlaceListen() {
    return (
      <Frame label="레벨 진단 · 듣고 답하기">
        <div style={{ padding: '6px 24px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <NbTag color={c.blue} rot={-1}>실력 체크</NbTag>
            <div style={{ flex: 1 }}/>
            <span style={{ fontFamily: MONO, fontSize: 12, fontWeight: 700, color: c.soft }}>3/8</span>
          </div>
          <div style={{ display: 'flex', gap: 5, marginTop: 9 }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={{ flex: 1, height: 5, borderRadius: 2, background: i < 3 ? c.ink : 'rgba(62,54,43,.15)', transform: `rotate(${i % 2 ? 0.7 : -0.7}deg)` }}/>
            ))}
          </div>
        </div>
        {/* 수간호사 발화 */}
        <div style={{ padding: '16px 24px 0' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
            <div style={{ flexShrink: 0, border: `1px solid #E0D6C0`, background: '#fff', padding: 5, transform: 'rotate(-2deg)', boxShadow: '0 2px 6px rgba(62,54,43,.16)' }}>
              {window.NbAvatar ? <window.NbAvatar size={78} hair="bun" hairColor="gray" outfit="scrubs" outfitColor="navy" eyes="calm" mouth="smile" bg="washBlue"/> : <NbIcon name="me" size={60}/>}
            </div>
            <NbPaper rot={0.4} style={{ flex: 1, minWidth: 0, padding: '10px 12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{ fontFamily: MONO, fontSize: 10.5, fontWeight: 700, color: c.ink }}>CHARGE NURSE</span>
                <span style={{ marginLeft: 'auto' }}><NbIcon name="speaker" size={16}/></span>
              </div>
              <div style={{ fontSize: 13.5, color: c.ink, fontStyle: 'italic', lineHeight: 1.5, marginTop: 5 }}>“Room 3 needs their meds. Can you handle that after your break?”</div>
              <div style={{ fontFamily: HW, fontSize: 12, color: c.soft, marginTop: 3 }}>다시 듣기 1회 가능</div>
            </NbPaper>
          </div>
          <div style={{ fontFamily: HW, fontSize: 15.5, color: c.soft, marginTop: 15 }}>가장 자연스러운 답은? ✎</div>
          {[
            ['Sure, I\'ll take care of it right after my break.', true],
            ['Yes, break is good.', false],
            ['Room 3 is meds.', false],
          ].map((o, i) => (
            <NbPaper key={i} rot={i % 2 ? 0.5 : -0.5} style={{ marginTop: 10, padding: '12px 13px', cursor: 'pointer', ...(o[1] ? { boxShadow: `0 2px 6px rgba(62,54,43,.14), 0 0 0 2.5px #E9C45A` } : {}) }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ width: 22, height: 22, borderRadius: '50%', border: `1.7px solid ${o[1] ? c.amber : c.soft}`, color: o[1] ? c.amber : c.soft, fontFamily: HW, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{String.fromCharCode(65 + i)}</span>
                <span style={{ fontSize: 13.5, fontWeight: 600, color: c.ink, lineHeight: 1.5 }}>{o[0]}</span>
              </div>
            </NbPaper>
          ))}
          <div style={{ marginTop: 12, textAlign: 'center', fontFamily: HW, fontSize: 12.5, color: c.soft }}>진단 중엔 정답을 알려주지 않아요 — 부담 없이!</div>
        </div>
        <div style={{ position: 'absolute', left: 24, right: 24, bottom: 34 }}>
          <NbButton variant="ink" size="lg" full>다음 ›</NbButton>
        </div>
      </Frame>
    );
  }

  // ── C · 결과 & 배치 ──
  function PlaceResult() {
    const bars = [['듣고 답하기', 72, c.blue], ['말하기 유창성', 48, c.red], ['병원 어휘', 81, c.green]];
    return (
      <Frame label="레벨 진단 · 결과">
        <div style={{ position: 'absolute', top: 44, left: 0, right: 0, bottom: 0, overflowY: 'auto', padding: '10px 24px 40px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'inline-block', transform: 'rotate(-10deg)' }}>
              <div style={{ width: 112, height: 112, borderRadius: '50%', border: `4px double ${c.green}`, color: c.green, display: 'inline-flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: 2 }}>PLACEMENT</div>
                <div style={{ fontFamily: HW, fontSize: 30, lineHeight: 1 }}>B1+</div>
                <div style={{ fontFamily: MONO, fontSize: 8, fontWeight: 700, marginTop: 2 }}>CLINICAL EN</div>
              </div>
            </div>
            <div style={{ fontFamily: HW, fontSize: 21, color: c.ink, marginTop: 12, lineHeight: 1.35 }}>문장은 탄탄해요 —<br/><NbMark>말하기 순발력</NbMark>만 올리면 돼요</div>
          </div>
          {/* 영역별 게이지 */}
          <NbPaper rot={-0.4} tape tapeLeft={130} style={{ marginTop: 14, padding: '12px 14px' }}>
            {bars.map((b, i) => (
              <div key={i} style={{ marginTop: i ? 11 : 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline' }}>
                  <span style={{ fontFamily: HW, fontSize: 14.5, color: c.ink }}>{b[0]}</span>
                  <div style={{ flex: 1 }}/>
                  <span style={{ fontFamily: MONO, fontSize: 12, fontWeight: 700, color: b[2] }}>{b[1]}</span>
                </div>
                <div style={{ marginTop: 4, height: 11, border: `1.6px solid ${c.ink}`, borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: b[1] + '%', height: '100%', background: `repeating-linear-gradient(-45deg, ${b[2]} 0 5px, transparent 5px 9px)` }}/>
                </div>
              </div>
            ))}
          </NbPaper>
          {/* 배치 결과 */}
          <div style={{ fontFamily: HW, fontSize: 17, color: c.ink, marginTop: 15 }}>그래서, 이렇게 시작할게요 ✎</div>
          {[
            ['hospital', '여정 시작점', '공통 필수 건너뛰고 ER 트리아지부터', c.green],
            ['speech', '대화 모드', '보기 반 + 직접 말하기 반 (순발력 훈련)', c.blue],
            ['mic', '집중 처방', '주 3회 발음 드릴 — /r/ · 연음 위주', c.red],
          ].map((r, i) => (
            <NbPaper key={i} rot={i % 2 ? 0.5 : -0.5} style={{ marginTop: 10, padding: '11px 13px', display: 'flex', alignItems: 'center', gap: 11 }}>
              <NbIcon name={r[0]} size={20}/>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontFamily: HW, fontSize: 16, color: c.ink, lineHeight: 1.1 }}>{r[1]}</div>
                <div style={{ fontSize: 11, color: c.soft, marginTop: 2 }}>{r[2]}</div>
              </div>
              <NbCheck done/>
            </NbPaper>
          ))}
          <div style={{ marginTop: 13 }}>
            <NbMemo rot={0.3} color={c.blue}><b style={{ color: c.blue }}>메모</b> 배치는 언제든 조정돼요 — 잘하면 정거장을 건너뛰고, 막히면 보기 모드가 늘어나요.</NbMemo>
          </div>
          <div style={{ marginTop: 15 }}>
            <NbButton variant="ink" size="lg" full>이 배치로 첫 출근 →</NbButton>
          </div>
          <div style={{ textAlign: 'center', fontFamily: HW, fontSize: 13, color: c.soft, marginTop: 9, textDecoration: 'underline', textUnderlineOffset: 3 }}>더 기초부터 시작할래요</div>
        </div>
      </Frame>
    );
  }

  Object.assign(window, { PlaceIntro, PlaceListen, PlaceResult });
})();
