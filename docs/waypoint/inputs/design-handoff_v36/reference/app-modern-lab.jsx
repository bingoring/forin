// app-modern-lab.jsx — 모던 리디자인 3차: 리뷰랩. modern-icons → modern-ui 로드 후 실행.
const M = window.ModernTokens, F = window.ModernFont, card = window.mcard;
const { MAvatar, MNav, MIcon, MPhone } = window;

function LabHead() {
  return (
    <div style={{ padding: '56px 20px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontFamily: F, fontSize: 22, fontWeight: 800, color: M.ink, letterSpacing: '-.02em' }}>리뷰랩</div>
          <div style={{ fontFamily: F, fontSize: 12.5, fontWeight: 500, color: M.faint, marginTop: 3 }}>시나리오에서 배운 것들을 내 것으로</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: M.orangeSoft, borderRadius: 999, padding: '6px 12px' }}>
          <MIcon name="book" size={14}/>
          <span style={{ fontFamily: F, fontSize: 12, fontWeight: 800, color: M.orange }}>오늘 복습 6</span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 7, marginTop: 14, overflowX: 'auto', paddingBottom: 2 }}>
        {[['전체', 24, true], ['복습', 6, false], ['통증', 5, false], ['SBAR', 4, false], ['말하기', 7, false], ['모범답안', 2, false]].map((c, i) => (
          <div key={i} style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 5, background: c[2] ? M.ink : '#fff', borderRadius: 999, padding: '7px 13px', boxShadow: c[2] ? 'none' : '0 1px 4px rgba(27,39,51,.08)' }}>
          <span style={{ fontFamily: F, fontSize: 12.5, fontWeight: 700, color: c[2] ? '#fff' : M.text }}>{c[0]}</span>
          <span style={{ fontFamily: F, fontSize: 10.5, fontWeight: 800, color: c[2] ? 'rgba(255,255,255,.7)' : M.faint }}>{c[1]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// 오늘의 복습 카드 (뒤집기)
function PhraseCard() {
  return (
    <div style={{ margin: '14px 20px 0', background: `linear-gradient(135deg, ${M.purple}, #7048E8)`, borderRadius: 24, padding: '18px 18px 16px', boxShadow: '0 8px 22px rgba(139,92,246,.28)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <MIcon name="bulb" size={16}/>
        <span style={{ fontFamily: F, fontSize: 11.5, fontWeight: 800, color: 'rgba(255,255,255,.85)' }}>오늘의 복습 1 / 6 · 통증 사정</span>
        <div style={{ flex: 1 }}/>
        <span style={{ background: 'rgba(255,255,255,.2)', borderRadius: 999, padding: '3px 9px', fontFamily: F, fontSize: 10.5, fontWeight: 700, color: '#fff' }}>D+3</span>
      </div>
      <div style={{ fontFamily: F, fontSize: 19, fontWeight: 800, color: '#fff', marginTop: 12, letterSpacing: '-.01em', lineHeight: 1.4 }}>"Does the pain radiate anywhere?"</div>
      <div style={{ fontFamily: F, fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,.8)', marginTop: 5 }}>통증이 다른 곳으로 퍼지나요? — 탭하면 예문 보기</div>
      <div style={{ display: 'flex', gap: 9, marginTop: 15 }}>
        <div style={{ flex: 1, background: 'rgba(255,255,255,.16)', borderRadius: 14, padding: '11px 0', textAlign: 'center', fontFamily: F, fontSize: 13, fontWeight: 800, color: '#fff' }}>어려워요</div>
        <div style={{ flex: 1, background: '#fff', borderRadius: 14, padding: '11px 0', textAlign: 'center', fontFamily: F, fontSize: 13, fontWeight: 800, color: M.purple }}>기억나요 ✓</div>
      </div>
    </div>
  );
}

// 직접 말하기 — 분포 + 급한 2문장 (요약형 유지)
function SpeakBlock() {
  return (
    <div style={{ margin: '13px 20px 0', ...card({ padding: '15px 16px' }) }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        <MIcon name="mic" size={17}/>
        <span style={{ fontFamily: F, fontSize: 14, fontWeight: 800, color: M.ink }}>직접 말하기 연습</span>
        <div style={{ flex: 1 }}/>
        <span style={{ background: M.purpleSoft, color: M.purple, borderRadius: 999, padding: '3px 10px', fontFamily: F, fontSize: 11, fontWeight: 800 }}>128문장</span>
      </div>
      <div style={{ display: 'flex', gap: 7, marginTop: 12 }}>
        {[['60↓', 12, M.red, '#FFE9E9'], ['60–79', 41, M.orange, M.orangeSoft], ['80+', 75, M.primaryDeep, M.primarySoft]].map((b, i) => (
          <div key={i} style={{ flex: 1, background: b[3], borderRadius: 14, padding: '9px 0', textAlign: 'center' }}>
            <div style={{ fontFamily: F, fontSize: 16, fontWeight: 800, color: b[2] }}>{b[1]}</div>
            <div style={{ fontFamily: F, fontSize: 10, fontWeight: 700, color: M.faint }}>{b[0]}</div>
          </div>
        ))}
      </div>
      {[["I'm giving you acetaminophen 650 milligrams.", 58, '/mɪn/·/lɪ/'], ['Please bear with me for a moment.', 64, '/ɪə/']].map((r, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 0', borderBottom: i < 1 ? `1px solid ${M.line}` : 'none', marginTop: i === 0 ? 6 : 0 }}>
          <div style={{ width: 36, flexShrink: 0, textAlign: 'center', borderRadius: 10, padding: '5px 0', fontFamily: F, fontSize: 12, fontWeight: 800, background: '#FFE9E9', color: M.red }}>{r[1]}</div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontFamily: F, fontSize: 13, fontWeight: 600, color: M.ink, lineHeight: 1.35 }}>{r[0]}</div>
            <div style={{ fontFamily: F, fontSize: 10.5, fontWeight: 600, color: M.faint, marginTop: 2 }}>약한 음소 {r[2]}</div>
          </div>
          <MIcon name="mic" size={16}/>
        </div>
      ))}
      <div style={{ display: 'flex', gap: 9, marginTop: 12 }}>
        <div style={{ flex: 1.2, background: M.purple, borderRadius: 14, padding: '11px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}><MIcon name="target" size={14}/><span style={{ fontFamily: F, fontSize: 12.5, fontWeight: 800, color: '#fff' }}>약한 것부터 (10)</span></div>
        <div style={{ flex: 1, background: M.bg, borderRadius: 14, padding: '11px 0', textAlign: 'center', fontFamily: F, fontSize: 12.5, fontWeight: 800, color: M.text }}>전체 128 ›</div>
      </div>
    </div>
  );
}

// 모범답안 — 최근 1개 비교 + 접힌 목록 (요약형 유지)
function ModelBlock() {
  return (
    <div style={{ margin: '13px 20px 0', ...card({ padding: '15px 16px' }) }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        <MIcon name="clipboard" size={17}/>
        <span style={{ fontFamily: F, fontSize: 14, fontWeight: 800, color: M.ink }}>시나리오 모범답안</span>
        <div style={{ flex: 1 }}/>
        <span style={{ fontFamily: F, fontSize: 12, fontWeight: 700, color: M.faint }}>전체 ›</span>
      </div>
      <div style={{ marginTop: 11, background: M.bg, borderRadius: 16, padding: '12px 13px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 9 }}>
          <span style={{ background: M.primarySoft, color: M.primaryDeep, borderRadius: 999, padding: '2px 8px', fontFamily: F, fontSize: 10, fontWeight: 800 }}>최근</span>
          <span style={{ fontFamily: F, fontSize: 12, fontWeight: 700, color: M.ink }}>ER · 흉통 환자 트리아지</span>
        </div>
        <div style={{ fontFamily: F, fontSize: 12.5, fontWeight: 500, color: M.faint, textDecoration: 'line-through', lineHeight: 1.45 }}>Where is pain? How much?</div>
        <div style={{ fontFamily: F, fontSize: 13, fontWeight: 700, color: M.primaryDeep, marginTop: 4, lineHeight: 1.45 }}>Where exactly is the pain, and does it spread anywhere?</div>
        <div style={{ marginTop: 8, background: '#fff', borderRadius: 12, padding: '8px 11px', fontFamily: F, fontSize: 11.5, fontWeight: 500, color: M.text, lineHeight: 1.5 }}><b style={{ color: M.ink }}>왜?</b> radiate(방사통) 여부는 흉통에서 반드시 물어야 해요.</div>
      </div>
      {[['ICU · 승압제 적정 보고', '4단계', 'hospital'], ['분만실 · 초산모 진통 코칭', '3단계', 'mates'], ['약국 · 누락 약 확인', '2단계', 'check']].map((r, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '10px 2px', borderBottom: i < 2 ? `1px solid ${M.line}` : 'none' }}>
          <MIcon name={r[2]} size={16}/>
          <span style={{ minWidth: 0, flex: 1, fontFamily: F, fontSize: 12.5, fontWeight: 600, color: M.ink }}>{r[0]}</span>
          <span style={{ fontFamily: F, fontSize: 11, fontWeight: 600, color: M.faint }}>{r[1]}</span>
          <span style={{ fontFamily: F, fontSize: 14, color: M.faint }}>›</span>
        </div>
      ))}
      <div style={{ marginTop: 8, textAlign: 'center', fontFamily: F, fontSize: 11, fontWeight: 600, color: M.faint }}>+ 30개 더 · 과·날짜로 검색</div>
    </div>
  );
}

function ScreenModernLab() {
  return (
    <div data-screen-label="Modern Review Lab" style={{ height: '100%', background: M.bg, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, bottom: 84, overflowY: 'auto', paddingBottom: 26 }}>
        <LabHead/>
        <PhraseCard/>
        <SpeakBlock/>
        <ModelBlock/>
      </div>
      <MNav active="lab"/>
    </div>
  );
}

function ForinModernLabApp() {
  return (
    <DesignCanvas>
      <DCSection id="modern-lab" title="🆕 모던 리디자인 · 3차 (리뷰랩)" subtitle="복습 카드(간격 반복) · 직접 말하기 요약 · 모범답안 비교 — 요약형 구조 유지">
        <DCArtboard id="ml-lab" label="리뷰랩 (오답노트)" width={402} height={874}><MPhone><ScreenModernLab/></MPhone></DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<ForinModernLabApp/>);
