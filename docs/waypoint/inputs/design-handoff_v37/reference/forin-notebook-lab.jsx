// forin-notebook-lab.jsx — 리뷰랩(복습 노트) 수첩 그림체
// 구조(기존 확정 구조 유지): 섹션 탭 3분할(교정 노트/말하기/모범답안) 최상단 →
// 교정 노트 탭 상세: 오늘의 복습 히어로 · 통계 3칩 · 카테고리 칩 · PhraseCard
// (맥락 → ✕ 내 문장 → ✓ 교정 → 왜? → 숙련 → SRS 4버튼)
(function () {
  const c = { bg: '#F1EBDD', paper: '#FFFdf4', ink: '#3E362B', soft: '#9A8F7C', red: '#C75146', blue: '#4A6FA5', green: '#5F8D5A', tape: 'rgba(160,200,220,.55)' };
  const HW = '"Gaegu","Nanum Pen Script",cursive';
  const F = '"Pretendard",sans-serif';
  const NbIcon = window.NbIcon;
  const paper = (rot = 0) => ({ background: c.paper, border: `1px solid #E0D6C0`, boxShadow: '0 2px 6px rgba(62,54,43,.14)', transform: `rotate(${rot}deg)`, position: 'relative' });
  const HL = { background: 'linear-gradient(transparent 55%, #F9E37B 55%)', padding: '0 2px' };

  function Frame({ label, children }) {
    return (
      <div style={{ boxSizing: 'border-box', width: 402, height: 874, background: c.bg, backgroundImage: 'repeating-linear-gradient(transparent 0 27px, rgba(62,54,43,.06) 27px 28px)', borderRadius: 40, overflow: 'hidden', position: 'relative', fontFamily: F }} data-screen-label={label}>
        <div style={{ height: 44, display: 'flex', alignItems: 'center', padding: '0 24px', fontSize: 14, fontWeight: 700, color: c.ink }}>9:41<div style={{ flex: 1 }}/>▮▮▮</div>
        {children}
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 68, background: c.paper, borderTop: `1.5px solid #E0D6C0`, display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '0 8px 8px', zIndex: 30 }}>
          {[['home','홈',false],['hospital','일터',false],['board','상황판',false],['lab','리뷰랩',true],['me','나',false]].map((t, i) => (
            <div key={i} style={{ textAlign: 'center', opacity: t[2] ? 1 : .55 }}>
              <div style={{ height: 20 }}><NbIcon name={t[0]} size={19}/></div>
              <div style={{ fontFamily: HW, fontSize: 13, color: c.ink, fontWeight: t[2] ? 700 : 400 }}>{t[1]}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 인덱스 탭 3분할 — 견출지(인덱스 스티커) 스타일
  function SectionTabs({ active = 0 }) {
    const tabs = [['교정 노트', 14], ['말하기', 128], ['모범답안', 34]];
    const colors = ['rgba(244,164,155,.75)', 'rgba(143,199,232,.75)', 'rgba(168,217,151,.75)'];
    return (
      <div style={{ position: 'relative', padding: '6px 20px 0' }}>
        <div style={{ display: 'flex', gap: 3, alignItems: 'flex-end', padding: '0 4px' }}>
          {tabs.map((t, i) => {
            const on = i === active;
            return (
              <div key={i} style={{ flex: 1, position: 'relative', textAlign: 'center', fontFamily: HW, fontSize: on ? 16 : 14.5, color: c.ink, background: on ? c.paper : colors[i], border: `1.4px solid ${on ? c.ink : 'rgba(62,54,43,.35)'}`, borderBottom: 'none', borderRadius: '8px 8px 0 0', padding: on ? '9px 0 7px' : '5px 0 3px', marginBottom: on ? 0 : 2, opacity: on ? 1 : .8, zIndex: on ? 2 : 1, transform: on ? 'none' : `rotate(${i % 2 ? 0.8 : -0.8}deg)`, whiteSpace: 'nowrap', boxShadow: on ? '0 -2px 5px rgba(62,54,43,.12)' : 'none' }}>
                {on && <div style={{ position: 'absolute', top: 4, left: '50%', transform: 'translateX(-50%)', width: 26, height: 5, background: 'rgba(160,200,220,.6)', borderRadius: 1 }}/>}
                {t[0]} <span style={{ fontSize: 11, opacity: .7 }}>{t[1]}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── A · 교정 노트 탭 ──
  function LabNotes() {
    const chip = (txt, n, on, i) => (
      <span key={txt} style={{ ...paper(i % 2 ? 0.8 : -0.8), display: 'inline-block', padding: '4px 11px', fontFamily: HW, fontSize: 14, color: on ? c.paper : c.ink, background: on ? c.ink : c.paper, whiteSpace: 'nowrap' }}>{txt} {n}</span>
    );
    return (
      <Frame label="수첩 리뷰랩 · 교정 노트">
        <div style={{ position: 'absolute', top: 44, left: 0, right: 0, bottom: 78, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', padding: '8px 20px 0' }}>
            <div style={{ fontFamily: HW, fontSize: 30, color: c.ink }}>복습 노트</div>
            <div style={{ flex: 1 }}/>
            <span style={{ fontFamily: HW, fontSize: 14.5, color: c.soft }}>오늘 복습할 것 <b style={{ color: c.red }}>5</b></span>
          </div>
          <SectionTabs active={0}/>
          <div style={{ flex: 1, overflowY: 'auto', borderTop: `1.5px solid ${c.ink}`, padding: '14px 20px 20px' }}>
            {/* 오늘의 복습 히어로 */}
            <div style={{ ...paper(-0.6), padding: '14px 15px' }}>
              <div style={{ position: 'absolute', top: -10, left: 118, width: 74, height: 20, background: c.tape, transform: 'rotate(-4deg)' }}/>
              <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                <div style={{ width: 54, height: 54, borderRadius: '50%', border: `3px double ${c.red}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: c.red, transform: 'rotate(-8deg)', flexShrink: 0 }}>
                  <div style={{ fontSize: 9, fontWeight: 800 }}>오늘</div>
                  <div style={{ fontFamily: HW, fontSize: 19, lineHeight: 1 }}>5장</div>
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontFamily: HW, fontSize: 19, color: c.ink, lineHeight: 1.15 }}>잊어버리기 전에 다시 보기</div>
                  <div style={{ fontSize: 11, color: c.soft, marginTop: 3 }}>간격 반복 · D+3 카드 2장 포함 · 약 4분</div>
                </div>
                <div style={{ background: c.ink, color: c.paper, fontFamily: HW, fontSize: 15, padding: '9px 14px', borderRadius: 3, boxShadow: '2px 2px 0 rgba(62,54,43,.25)', flexShrink: 0 }}>시작 ✎</div>
              </div>
            </div>
            {/* 통계 3칩 */}
            <div style={{ display: 'flex', gap: 9, marginTop: 12 }}>
              {[['저장된 카드','14',-0.5],['마스터','6',0.4],['복습 대기','5',-0.4]].map((s, i) => (
                <div key={i} style={{ ...paper(s[2]), flex: 1, padding: '8px 0', textAlign: 'center' }}>
                  <div style={{ fontSize: 10, color: c.soft }}>{s[0]}</div>
                  <div style={{ fontFamily: HW, fontSize: 20, color: i === 2 ? c.red : c.ink, marginTop: 1 }}>{s[1]}</div>
                </div>
              ))}
            </div>
            {/* 카테고리 칩 */}
            <div style={{ display: 'flex', gap: 7, marginTop: 13, overflowX: 'auto', paddingBottom: 4 }}>
              {chip('전체', 14, true, 0)}{chip('복습', 5, false, 1)}{chip('통증', 4, false, 2)}{chip('SBAR', 3, false, 3)}{chip('표현', 2, false, 4)}
            </div>
            {/* PhraseCard 수첩판 */}
            {[{
              dept: 'ER · 통증 사정', due: true, tag: '통증',
              ctx: '흉통 환자에게 통증 양상을 묻는 장면',
              bad: 'I want to ask about your pain.',
              good: 'Can you tell me about your pain?',
              why: '"I want to ask"는 다소 직역체예요. 환자에게는 부드러운 의문문이 자연스러워요.',
              pips: 1,
            }, {
              dept: 'ICU · SBAR 인계', due: true, tag: 'SBAR',
              ctx: '야간 당직 의사에게 환자 상태 악화를 보고하는 장면',
              bad: 'The patient condition is not good.',
              good: 'The patient is showing signs of deterioration.',
              why: '임상 인계에서는 구체적 임상 표현을 써요. "not good" → "deterioration".',
              pips: 0,
            }].map((k, i) => (
              <div key={i} style={{ ...paper(i % 2 ? 0.5 : -0.5), marginTop: 13, padding: '12px 14px 10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <span style={{ fontSize: 10, fontWeight: 800, color: c.blue, whiteSpace: 'nowrap' }}>{k.dept}</span>
                  <div style={{ flex: 1 }}/>
                  {k.due && <span style={{ fontSize: 9.5, fontWeight: 800, color: '#fff', background: c.red, padding: '1px 6px', transform: 'rotate(-2deg)', whiteSpace: 'nowrap' }}>복습</span>}
                  <span style={{ fontFamily: HW, fontSize: 12.5, color: c.soft, border: `1.3px solid ${c.soft}`, borderRadius: 2, padding: '0 5px', whiteSpace: 'nowrap' }}>{k.tag}</span>
                </div>
                <div style={{ marginTop: 8, fontFamily: HW, fontSize: 14, color: c.soft }}>✎ {k.ctx}</div>
                {/* 빨간펜 교정 */}
                <div style={{ marginTop: 8, fontSize: 13.5, color: c.soft, textDecoration: 'line-through', textDecorationColor: c.red, textDecorationThickness: 2 }}>{k.bad}</div>
                <div style={{ marginTop: 6, display: 'flex', alignItems: 'flex-start', gap: 7 }}>
                  <span style={{ fontFamily: HW, fontSize: 15, color: c.red, flexShrink: 0, transform: 'rotate(-4deg)' }}>→</span>
                  <div style={{ fontSize: 14.5, fontWeight: 700, color: c.ink, lineHeight: 1.5, minWidth: 0 }}><mark style={HL}>{k.good}</mark></div>
                  <span style={{ marginLeft: 'auto', flexShrink: 0 }}><NbIcon name="speaker" size={17}/></span>
                </div>
                <div style={{ marginTop: 9, padding: '6px 9px', background: 'rgba(74,111,165,.07)', border: `1.3px dashed ${c.blue}`, fontFamily: HW, fontSize: 13.5, color: c.ink, lineHeight: 1.4 }}>
                  <b style={{ color: c.blue }}>왜?</b> {k.why}
                </div>
                <div style={{ marginTop: 9, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ fontSize: 10, color: c.soft }}>숙련</span>
                  {[0,1,2].map(p => <span key={p} style={{ width: 9, height: 9, borderRadius: '50%', border: `1.5px solid ${p < k.pips ? c.green : c.soft}`, background: p < k.pips ? 'rgba(95,141,90,.4)' : 'transparent' }}/>)}
                  <div style={{ flex: 1 }}/>
                  <span style={{ fontFamily: HW, fontSize: 13, color: c.ink, border: `1.5px solid ${c.ink}`, borderRadius: 3, padding: '3px 9px', whiteSpace: 'nowrap' }}><NbIcon name="mic" size={13}/> 따라 말하기</span>
                </div>
                {/* SRS 4버튼 */}
                <div style={{ display: 'flex', gap: 6, marginTop: 9 }}>
                  {[['다시','<1분', c.red],['어려움','10분', '#C77E2E'],['알맞음','1일', c.blue],['쉬움','4일', c.green]].map((b, j) => (
                    <div key={j} style={{ flex: 1, textAlign: 'center', border: `1.6px solid ${b[2]}`, borderRadius: 3, padding: '5px 0 3px', transform: `rotate(${j % 2 ? 0.6 : -0.6}deg)` }}>
                      <div style={{ fontFamily: HW, fontSize: 14, color: b[2], lineHeight: 1 }}>{b[0]}</div>
                      <div style={{ fontSize: 8.5, color: c.soft, marginTop: 2 }}>{b[1]}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Frame>
    );
  }

  // ── B · 말하기 탭 (점수 행 리스트) ──
  function LabSpeak() {
    const tone = (sc) => sc >= 80 ? 'rgba(95,141,90,.25)' : sc >= 60 ? 'rgba(233,196,90,.35)' : 'rgba(199,81,70,.22)';
    const rows = [
      { sc: 58, s: "I'm giving you acetaminophen 650 milligrams.", d: '오늘', dept: 'ER', weak: '/mɪn/ · /lɪ/' },
      { sc: 64, s: 'Please bear with me for a moment.', d: '어제', dept: 'ER', weak: '/ɪə/' },
      { sc: 82, s: 'When did the pain start?', d: '어제', dept: 'ER', weak: '—' },
      { sc: 91, s: 'On a scale of 0 to 10, how bad is your pain?', d: '2일 전', dept: 'ER', weak: '—' },
      { sc: 71, s: 'The patient is showing signs of deterioration.', d: '3일 전', dept: 'ICU', weak: '/dɪˌtɪə/' },
    ];
    return (
      <Frame label="수첩 리뷰랩 · 말하기">
        <div style={{ position: 'absolute', top: 44, left: 0, right: 0, bottom: 78, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', padding: '8px 20px 0' }}>
            <div style={{ fontFamily: HW, fontSize: 30, color: c.ink }}>복습 노트</div>
            <div style={{ flex: 1 }}/>
            <span style={{ fontFamily: HW, fontSize: 14.5, color: c.soft }}>말한 문장 <b style={{ color: c.blue }}>128</b></span>
          </div>
          <SectionTabs active={1}/>
          <div style={{ flex: 1, overflowY: 'auto', borderTop: `1.5px solid ${c.ink}`, padding: '13px 20px 20px' }}>
            {/* 과 필터 칩 + 정렬 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <div style={{ display: 'flex', gap: 7, overflowX: 'auto', flex: 1, paddingBottom: 3 }}>
                {[['전체', 128, true], ['ER', 74, false], ['ICU', 22, false], ['분만실', 14, false], ['약국', 18, false]].map((f, i) => (
                  <span key={f[0]} style={{ ...paper(i % 2 ? 0.8 : -0.8), display: 'inline-block', padding: '4px 11px', fontFamily: HW, fontSize: 14, color: f[2] ? c.paper : c.ink, background: f[2] ? c.ink : c.paper, whiteSpace: 'nowrap', flexShrink: 0 }}>{f[0]} {f[1]}</span>
                ))}
              </div>
              <span style={{ fontFamily: HW, fontSize: 13.5, color: c.ink, whiteSpace: 'nowrap', flexShrink: 0 }}>점수 낮은순 ∨</span>
            </div>
            {/* 점수 분포 — 한 줄 잉크 게이지 (탭과 시각 구분) */}
            <div style={{ marginTop: 13 }}>
              <div style={{ display: 'flex', height: 13, border: `1.6px solid ${c.ink}`, borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ width: '9%', background: 'rgba(199,81,70,.5)' }}></div>
                <div style={{ width: '32%', background: 'rgba(233,196,90,.55)', borderLeft: `1.4px solid ${c.ink}` }}></div>
                <div style={{ flex: 1, background: 'rgba(95,141,90,.45)', borderLeft: `1.4px solid ${c.ink}` }}></div>
              </div>
              <div style={{ display: 'flex', gap: 13, marginTop: 5, fontFamily: HW, fontSize: 13, color: c.soft }}>
                {[['60↓ 12', c.red], ['60–79 41', '#C77E2E'], ['80+ 75', c.green]].map((l, i) => (
                  <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', border: `1.4px solid ${l[1]}`, background: 'transparent' }}></span>{l[0]}
                  </span>
                ))}
              </div>
            </div>
            {rows.map((r, i) => (
              <div key={i} style={{ ...paper(i % 2 ? 0.4 : -0.4), marginTop: 10, display: 'flex', alignItems: 'center', gap: 10, padding: '9px 11px' }}>
                <div style={{ width: 34, flexShrink: 0, background: tone(r.sc), border: `1.5px solid ${c.ink}`, borderRadius: 3, padding: '5px 0', textAlign: 'center', fontFamily: HW, fontSize: 15, color: c.ink }}>{r.sc}</div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 12.5, color: c.ink, lineHeight: 1.35 }}>{r.s}</div>
                  <div style={{ fontSize: 10, color: c.soft, marginTop: 2, whiteSpace: 'nowrap' }}>{r.dept} · {r.d} · 약한 음소 {r.weak}</div>
                </div>
                <div style={{ flexShrink: 0 }}><NbIcon name="mic" size={18}/></div>
              </div>
            ))}
            <div style={{ marginTop: 12, textAlign: 'center', fontFamily: HW, fontSize: 13.5, color: c.soft }}>아래로 내리면 계속 이어져요 · 123개 더</div>
          </div>
        </div>
      </Frame>
    );
  }

  // ── C · 모범답안 탭 ──
  function LabModel() {
    const rows = [
      { ic: 'siren', n: 'ER · 흉통 환자 트리아지', d: '오늘', st: 3, ok: 2 },
      { ic: 'monitor', n: 'ICU · 승압제 적정 보고', d: '어제', st: 4, ok: 4 },
      { ic: 'baby', n: '분만실 · 초산모 진통 코칭', d: '2일 전', st: 3, ok: 2 },
      { ic: 'pill', n: '약국 · 누락 약 확인', d: '3일 전', st: 2, ok: 2 },
    ];
    return (
      <Frame label="수첩 리뷰랩 · 모범답안">
        <div style={{ position: 'absolute', top: 44, left: 0, right: 0, bottom: 78, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', padding: '8px 20px 0' }}>
            <div style={{ fontFamily: HW, fontSize: 30, color: c.ink }}>복습 노트</div>
            <div style={{ flex: 1 }}/>
            <span style={{ fontFamily: HW, fontSize: 14.5, color: c.soft }}>완료 시나리오 <b style={{ color: c.green }}>34</b></span>
          </div>
          <SectionTabs active={2}/>
          <div style={{ flex: 1, overflowY: 'auto', borderTop: `1.5px solid ${c.ink}`, padding: '13px 20px 20px' }}>
            {/* 최근 1건 펼침 — 내 답 vs 모범 */}
            <div style={{ ...paper(-0.5), padding: '13px 14px' }}>
              <div style={{ position: 'absolute', top: -10, left: 100, width: 74, height: 20, background: c.tape, transform: 'rotate(-4deg)' }}/>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{ fontSize: 9.5, fontWeight: 800, color: '#fff', background: c.green, padding: '1px 6px', transform: 'rotate(-2deg)' }}>최근</span>
                <span style={{ fontFamily: HW, fontSize: 16.5, color: c.ink, whiteSpace: 'nowrap' }}>ER · 흉통 환자 트리아지</span>
                <div style={{ flex: 1 }}/>
                <span style={{ fontSize: 10.5, color: c.soft, whiteSpace: 'nowrap' }}>3단계</span>
              </div>
              <div style={{ marginTop: 9, fontSize: 10.5, color: c.soft }}>2 · 통증 사정</div>
              <div style={{ marginTop: 5, fontSize: 13, color: c.soft, textDecoration: 'line-through', textDecorationColor: c.red, textDecorationThickness: 2 }}>Where is pain? How much?</div>
              <div style={{ marginTop: 5, display: 'flex', gap: 7, alignItems: 'flex-start' }}>
                <span style={{ fontFamily: HW, fontSize: 15, color: c.red, flexShrink: 0, transform: 'rotate(-4deg)' }}>→</span>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: c.ink, lineHeight: 1.5, minWidth: 0 }}><mark style={{ background: 'linear-gradient(transparent 55%, #F9E37B 55%)', padding: '0 2px' }}>Where exactly is the pain, and does it spread anywhere?</mark></div>
              </div>
              <div style={{ marginTop: 8, padding: '6px 9px', background: 'rgba(74,111,165,.07)', border: `1.3px dashed ${c.blue}`, fontFamily: HW, fontSize: 13, color: c.ink, lineHeight: 1.4 }}>
                <b style={{ color: c.blue }}>왜?</b> radiate(방사통) 여부는 흉통에서 반드시 물어야 해요.
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                <div style={{ flex: 1, textAlign: 'center', border: `1.6px solid ${c.ink}`, borderRadius: 3, padding: '6px 0', fontFamily: HW, fontSize: 14, color: c.ink }}><NbIcon name="speaker" size={14}/> 전체 듣기</div>
                <div style={{ flex: 1, textAlign: 'center', border: `1.6px solid ${c.ink}`, borderRadius: 3, padding: '6px 0', fontFamily: HW, fontSize: 14, color: c.ink, background: 'rgba(249,227,123,.4)' }}><NbIcon name="mic" size={14}/> 따라 말하기</div>
              </div>
            </div>
            {/* 목록 */}
            <div style={{ marginTop: 13, fontFamily: HW, fontSize: 16, color: c.ink }}>— 완료한 시나리오 ——</div>
            {rows.map((r, i) => (
              <div key={i} style={{ ...paper(i % 2 ? 0.4 : -0.4), marginTop: 9, display: 'flex', alignItems: 'center', gap: 10, padding: '10px 11px' }}>
                <NbIcon name={r.ic} size={24}/>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontFamily: HW, fontSize: 16, color: c.ink, lineHeight: 1.1 }}>{r.n}</div>
                  <div style={{ fontSize: 10, color: c.soft, marginTop: 2, whiteSpace: 'nowrap' }}>{r.d} · {r.st}단계 · 모범 일치 {r.ok}/{r.st}</div>
                </div>
                {r.ok < r.st && <span style={{ fontFamily: HW, fontSize: 12, color: '#C77E2E', border: `1.4px solid #C77E2E`, borderRadius: 2, padding: '0 5px', whiteSpace: 'nowrap', transform: 'rotate(-2deg)' }}>개선</span>}
                <span style={{ fontFamily: HW, fontSize: 16, color: c.soft }}>›</span>
              </div>
            ))}
          </div>
        </div>
      </Frame>
    );
  }

  Object.assign(window, { LabNotes, LabSpeak, LabModel });
})();
