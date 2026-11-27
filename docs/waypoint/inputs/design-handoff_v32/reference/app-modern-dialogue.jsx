// app-modern-dialogue.jsx — 모던 리디자인 2차: 대화 화면.
// 컨셉: 미연시(비주얼노벨) 무대 + 메신저형 기록의 하이브리드.
//  · 상단 무대: 상대 캐릭터가 주인공 — AI가 발화와 함께 감정을 응답하면
//    표정(아바타)·감정 오라 색·감정 칩이 함께 바뀐다.
//  · 퀵 인포: 무대 아래 칩 스트립(통증·KTAS·대기시간·동행) — 항상 보임.
//  · 현재 발화는 VN 스타일 대사 카드, 지난 대화는 그 아래 메신저 로그로 축적.
// modern-ui.jsx 로드 후 실행.

const M = window.ModernTokens, F = window.ModernFont, card = window.mcard;
const { MAvatar, MNav, MPhone } = window;

// 감정 프리셋 — AI 응답의 emotion 필드가 이 키로 온다
const EMO = {
  anxious: { icon: 'emo_anxious', label: '불안', color: '#F59E0B', soft: '#FEF3E2' },
  angry:   { icon: 'emo_angry', label: '화남', color: '#EF4444', soft: '#FFE9E9' },
  relieved:{ icon: 'emo_relieved', label: '안심', color: '#16B364', soft: '#E7F8EE' },
  pain:    { icon: 'emo_pain', label: '통증', color: '#F472B6', soft: '#FDEBF4' },
};

// ── 슬림 헤더: 나가기 + 진행 + 시나리오명 ────────────────────────────
function DHead() {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 12, height: 96, boxSizing: 'border-box', padding: '52px 16px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ width: 32, height: 32, borderRadius: 12, background: 'rgba(255,255,255,.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F, fontSize: 15, color: M.faint, flexShrink: 0 }}>✕</div>
      <div style={{ flex: 1, height: 10, background: 'rgba(255,255,255,.7)', borderRadius: 999, overflow: 'hidden' }}>
        <div style={{ width: '60%', height: '100%', borderRadius: 999, background: M.primary }}/>
      </div>
      <div style={{ fontFamily: F, fontSize: 12, fontWeight: 700, color: M.text, flexShrink: 0 }}>3/5</div>
    </div>
  );
}

// ── 미연시 무대: 캐릭터 + 감정 + 퀵 인포 ─────────────────────────────
function Stage({ emo, delta }) {
  const e = EMO[emo];
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 336, boxSizing: 'border-box', background: `linear-gradient(180deg, ${e.soft} 0%, ${M.bg} 100%)`, zIndex: 5 }}>
      {/* 캐릭터 — 감정 오라 링 + 표정. AI emotion 응답에 따라 face/ring이 바뀜 */}
      <div style={{ position: 'absolute', left: '50%', top: 108, transform: 'translateX(-50%)', textAlign: 'center' }}>
        <div style={{ width: 124, height: 124, margin: '0 auto', borderRadius: '50%', background: '#fff', border: `5px solid ${e.color}`, boxShadow: `0 10px 26px ${e.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'border-color .3s' }}><window.MIcon name={e.icon} size={82}/></div>
        {/* 감정 칩 — 변화가 있으면 delta(이전→현재)로 표시 */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: -14, position: 'relative', background: '#fff', borderRadius: 999, padding: '5px 13px', boxShadow: '0 3px 10px rgba(27,39,51,.12)' }}>
          {delta && <><span style={{ filter: 'grayscale(.55) opacity(.75)' }}><window.MIcon name={EMO[delta].icon} size={14}/></span><span style={{ fontFamily: F, fontSize: 11, color: M.faint }}>→</span></>}
          <window.MIcon name={e.icon} size={15}/>
          <span style={{ fontFamily: F, fontSize: 12, fontWeight: 800, color: e.color }}>{e.label}</span>
        </div>
        <div style={{ fontFamily: F, fontSize: 15, fontWeight: 800, color: M.ink, marginTop: 8 }}>Mr. Park <span style={{ fontWeight: 500, color: M.faint, fontSize: 12.5 }}>· 보호자</span></div>
      </div>
      {/* 퀵 인포 — 환자 상태 상시 노출 */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 12, display: 'flex', gap: 6, justifyContent: 'center', padding: '0 14px', flexWrap: 'wrap' }}>
        {[['emo_pain', '환자 Mrs. Park'], ['clipboard', 'KTAS 2'], ['target', '통증 7/10'], ['clock', '대기 40분']].map((c, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,.9)', borderRadius: 999, padding: '5px 10px', boxShadow: '0 1px 4px rgba(27,39,51,.08)' }}>
            <window.MIcon name={c[0]} size={13}/>
            <span style={{ fontFamily: F, fontSize: 11, fontWeight: 700, color: M.text }}>{c[1]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── VN 대사 카드 (현재 발화) ──────────────────────────────────────────
function NowLine({ emo, txt, sub }) {
  const e = EMO[emo];
  return (
    <div style={{ margin: '14px 16px 6px', position: 'relative', zIndex: 8, ...card({ padding: '13px 15px', borderRadius: 18, border: `1.5px solid ${e.color}33` }) }}>
      <div style={{ position: 'absolute', top: -9, left: 14, background: e.color, color: '#fff', borderRadius: 999, padding: '2px 10px', fontFamily: F, fontSize: 10.5, fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: 4 }}><window.MIcon name={e.icon} size={13}/>Mr. Park</div>
      <div style={{ fontFamily: F, fontSize: 14.5, fontWeight: 600, color: M.ink, lineHeight: 1.55, marginTop: 3 }}>{txt}</div>
      {sub && <div style={{ fontFamily: F, fontSize: 11.5, fontWeight: 500, color: M.faint, marginTop: 5 }}>{sub}</div>}
    </div>
  );
}

// ── 메신저형 지난 기록 ────────────────────────────────────────────────
function LogBubble({ mine, txt, emo }) {
  if (mine) return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '4px 16px' }}>
      <div style={{ maxWidth: '80%', background: M.primary, color: '#fff', borderRadius: '16px 16px 4px 16px', padding: '9px 13px', fontFamily: F, fontSize: 13, fontWeight: 500, lineHeight: 1.5 }}>{txt}</div>
    </div>
  );
  const e = emo && EMO[emo];
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', padding: '4px 16px' }}>
      <div style={{ maxWidth: '80%' }}>
        {/* 과거 발화에도 당시의 감정 기록을 작은 칩으로 유지 */}
        {e && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 3, background: e.soft, borderRadius: 999, padding: '2px 8px' }}>
            <span style={{ fontSize: 10 }}><window.MIcon name={e.icon} size={12}/></span>
            <span style={{ fontFamily: F, fontSize: 9.5, fontWeight: 800, color: e.color }}>{e.label}</span>
          </div>
        )}
        <div style={{ background: '#fff', borderRadius: '16px 16px 16px 4px', padding: '9px 13px', fontFamily: F, fontSize: 13, fontWeight: 500, color: M.text, lineHeight: 1.5, boxShadow: '0 1px 3px rgba(27,39,51,.05)' }}>{txt}</div>
      </div>
    </div>
  );
}

function HistoryLog() {
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px 4px' }}>
        <div style={{ flex: 1, height: 1, background: M.line }}/>
        <span style={{ fontFamily: F, fontSize: 10.5, fontWeight: 700, color: M.faint }}>— 지난 대화 —</span>
        <div style={{ flex: 1, height: 1, background: M.line }}/>
      </div>
      <LogBubble emo="anxious" txt="Nurse! How much longer do we have to wait?"/>
      <LogBubble mine txt="I understand you're worried. Let me check her status right now."/>
    </>
  );
}

// ── 입력부 ────────────────────────────────────────────────────────────
function DInput({ hint }) {
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 10, background: '#fff', borderTop: `1px solid ${M.line}`, padding: '12px 16px 30px', boxSizing: 'border-box' }}>
      {hint && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontFamily: F, fontSize: 11.5, fontWeight: 700, color: M.faint, marginBottom: 8 }}>💡 이렇게 말해볼까요?</div>
          {[
            ['The doctor will see her within 10 minutes — she\'s next in line.', '구체적 시간 + 순서 안내'],
            ['I know 40 minutes feels long. Her vitals are being monitored.', '감정 인정 + 안심'],
            ['Let me get you an update from the doctor right away.', '즉각 행동 제시'],
          ].map((h, i) => (
            <div key={i} style={{ background: i === 0 ? M.primarySoft : M.bg, border: `1.5px solid ${i === 0 ? M.primary : M.line}`, borderRadius: 14, padding: '10px 12px', marginBottom: 7 }}>
              <div style={{ fontFamily: F, fontSize: 13, fontWeight: 600, color: M.ink, lineHeight: 1.45 }}>{h[0]}</div>
              <div style={{ fontFamily: F, fontSize: 10.5, fontWeight: 500, color: M.faint, marginTop: 3 }}>{h[1]}</div>
            </div>
          ))}
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 44, height: 44, borderRadius: 16, background: hint ? M.yellow : M.yellowSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><window.MIcon name="bulb" size={24}/></div>
        <div style={{ flex: 1, height: 52, borderRadius: 999, background: `linear-gradient(135deg, ${M.primary}, #0FA95B)`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 6px 16px rgba(22,179,100,.3)' }}>
          <window.MIcon name="mic" size={22}/>
          <span style={{ fontFamily: F, fontSize: 15, fontWeight: 800, color: '#fff' }}>눌러서 말하기</span>
        </div>
        <div style={{ width: 44, height: 44, borderRadius: 16, background: M.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><window.MIcon name="keyboard" size={24}/></div>
      </div>
    </div>
  );
}

// ── 셸: 무대(고정) + 대사 카드 + 스크롤 기록 + 입력 ──────────────────
function DShell({ label, emo, delta, line, sub, hint, extraLog }) {
  return (
    <div data-screen-label={label} style={{ height: '100%', background: M.bg, position: 'relative', overflow: 'hidden' }}>
      <Stage emo={emo} delta={delta}/>
      <DHead/>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 352, bottom: hint ? 360 : 118, zIndex: 8, overflowY: 'auto' }}>
        {/* 시간순: 지난 대화가 위, 현재 발화(VN 카드)가 맨 아래 */}
        <HistoryLog/>
        {extraLog}
        <NowLine emo={emo} txt={line} sub={sub}/>
      </div>
      <DInput hint={hint}/>
    </div>
  );
}

// A · 자유 발화 — 보호자가 화남
function ScreenModernDialogue() {
  return <DShell label="Modern Dialogue · VN Free" emo="angry"
    line="We've been here for 40 minutes already. Is anyone even looking at her?"
    sub="화가 난 어조 · 감정을 먼저 인정해 보세요"/>;
}

// B · 힌트 열림
function ScreenModernDialogueHint() {
  return <DShell label="Modern Dialogue · VN Hint" emo="angry"
    line="We've been here for 40 minutes already. Is anyone even looking at her?"
    sub="화가 난 어조 · 감정을 먼저 인정해 보세요" hint/>;
}

// C · 감정 변화 — 좋은 답변 후 AI가 relieved 감정으로 응답, 표정이 바뀜
function ScreenModernDialogueEmotion() {
  return <DShell label="Modern Dialogue · 감정 변화" emo="relieved" delta="angry"
    line="Oh… thank you. I'm sorry I raised my voice — please, just take care of her."
    sub="답변이 통했어요 · 감정: 화남 → 안심"
    extraLog={<LogBubble mine txt="I know 40 minutes feels long. Her vitals are being monitored the whole time, and she's next in line."/>}/>;
}

// D · 결과(클리어)
function ScreenModernResult() {
  const spoken = [
    ["I understand you're worried…", 88],
    ['The doctor will see her within 10 minutes.', 92],
    ['Let me get you an update right away.', 76],
  ];
  return (
    <div data-screen-label="Modern Result · Clear" style={{ height: '100%', background: M.bg, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, bottom: 110, overflowY: 'auto', padding: '64px 20px 20px' }}>
        <div style={{ ...card({ padding: '30px 18px 20px', textAlign: 'center' }), position: 'relative', overflow: 'hidden' }}>
          {/* 폭죽 — 기존 픽셀 결과 화면 오마주 (정적 조각, 무한 애니 금지) */}
          {[['10%','12%',M.yellow,-24],['24%','5%',M.blue,18],['42%','3%',M.pink,-8],['60%','7%',M.primary,30],['79%','12%',M.purple,-18],['6%','32%',M.orange,40],['89%','34%',M.red,-30],['16%','22%',M.primary,10],['70%','24%',M.yellow,-40]].map((p, i) => (
            <div key={i} style={{ position: 'absolute', left: p[0], top: p[1], width: i % 2 ? 7 : 9, height: i % 3 ? 12 : 9, borderRadius: 3, background: p[2], transform: `rotate(${p[3]}deg)`, opacity: .85 }}/>
          ))}
          <div style={{ width: 112, height: 112, margin: '0 auto', borderRadius: '50%', background: M.yellowSoft, border: `4px solid ${M.yellow}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-8deg)', boxShadow: '0 8px 20px rgba(255,200,0,.35)' }}>
            <window.MIcon name="star" size={40}/>
            <div style={{ fontFamily: F, fontSize: 12.5, fontWeight: 800, color: M.orange, marginTop: 3 }}>참 잘했어요!</div>
          </div>
          <div style={{ fontFamily: F, fontSize: 21, fontWeight: 800, color: M.ink, marginTop: 14, letterSpacing: '-.02em' }}>시나리오 클리어!</div>
          <div style={{ fontFamily: F, fontSize: 13, fontWeight: 500, color: M.text, marginTop: 6 }}>보호자의 감정을 화남 → 안심으로 바꿨어요</div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 16 }}>
            {[['XP', '+45', M.primarySoft, M.primaryDeep], ['표현', '+3', M.blueSoft, M.blue], ['연속', '13일', M.orangeSoft, M.orange]].map((s, i) => (
              <div key={i} style={{ background: s[2], borderRadius: 14, padding: '9px 16px' }}>
                <div style={{ fontFamily: F, fontSize: 16, fontWeight: 800, color: s[3] }}>{s[1]}</div>
                <div style={{ fontFamily: F, fontSize: 10.5, fontWeight: 600, color: M.faint }}>{s[0]}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginTop: 12, ...card({ padding: '14px 16px' }) }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <window.MIcon name="mic" size={16}/>
            <span style={{ fontFamily: F, fontSize: 13, fontWeight: 800, color: M.ink }}>직접 말한 문장</span>
            <div style={{ flex: 1 }}/>
            <span style={{ background: M.primarySoft, color: M.primaryDeep, borderRadius: 999, padding: '3px 10px', fontFamily: F, fontSize: 11, fontWeight: 800 }}>평균 85</span>
          </div>
          {spoken.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: i < spoken.length - 1 ? `1px solid ${M.line}` : 'none' }}>
              <div style={{ width: 34, flexShrink: 0, textAlign: 'center', borderRadius: 10, padding: '5px 0', fontFamily: F, fontSize: 12, fontWeight: 800, background: s[1] >= 85 ? M.primarySoft : M.yellowSoft, color: s[1] >= 85 ? M.primaryDeep : M.orange }}>{s[1]}</div>
              <div style={{ minWidth: 0, flex: 1, fontFamily: F, fontSize: 13, fontWeight: 500, color: M.ink, lineHeight: 1.4 }}>{s[0]}</div>
              <span><window.MIcon name="speaker" size={16}/></span>
            </div>
          ))}
          <div style={{ marginTop: 10, background: M.yellowSoft, borderRadius: 12, padding: '10px 0', fontFamily: F, fontSize: 13, fontWeight: 800, color: M.orange, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}><window.MIcon name="target" size={15}/>낮은 점수 1문장 다시 연습</div>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, background: '#fff', borderTop: `1px solid ${M.line}`, padding: '12px 20px 30px', display: 'flex', gap: 10 }}>
        <div style={{ flex: 1, borderRadius: 16, padding: '13px 0', textAlign: 'center', fontFamily: F, fontSize: 14, fontWeight: 800, color: M.text, background: M.bg }}>리뷰랩에 저장</div>
        <div style={{ flex: 1.4, borderRadius: 16, padding: '13px 0', textAlign: 'center', fontFamily: F, fontSize: 14, fontWeight: 800, color: '#fff', background: M.primary, boxShadow: '0 5px 14px rgba(22,179,100,.3)' }}>다음 단계 →</div>
      </div>
    </div>
  );
}

function ForinModernDialogueApp() {
  return (
    <DesignCanvas>
      <DCSection id="modern-dialogue" title="🆕 모던 리디자인 · 2차 (대화 — 미연시 무대 + 메신저 기록)" subtitle="상단 무대: 캐릭터 표정이 AI 감정 응답에 따라 변화 · 퀵 인포 칩 상시 노출 · 현재 발화는 VN 대사 카드, 지난 대화는 메신저 로그">
        <DCArtboard id="md-free" label="A · 자유 발화 (보호자 화남)" width={402} height={874}><MPhone><ScreenModernDialogue/></MPhone></DCArtboard>
        <DCArtboard id="md-hint" label="B · 힌트 열림 (3개 제안)" width={402} height={874}><MPhone><ScreenModernDialogueHint/></MPhone></DCArtboard>
        <DCArtboard id="md-emotion" label="C · 감정 변화 (화남 → 안심)" width={402} height={874}><MPhone><ScreenModernDialogueEmotion/></MPhone></DCArtboard>
        <DCArtboard id="md-result" label="D · 시나리오 클리어" width={402} height={874}><MPhone><ScreenModernResult/></MPhone></DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<ForinModernDialogueApp/>);
