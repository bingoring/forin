// forin-notebook-lesson.jsx — 상황(커리큘럼) 4단계 학습 흐름 (근무 수첩)
// 단어 → 문장 → 보기 대화 → 자유 대화. 텍스트보다 아이콘·큰 버튼·시각 요소 우선.
(function () {
  const { NbPaper, NbButton, NbTag, NbMark, NbMemo, NbCheck, NbStamp, NbFrame, NbGauge } = window.NbUI;
  const NbIcon = window.NbIcon;
  const HW = '"Gaegu","Nanum Pen Script",cursive';
  const F = '"Pretendard",sans-serif';
  const MONO = '"IBM Plex Mono",monospace';
  const c = { bg: '#F1EBDD', paper: '#FFFdf4', ink: '#3E362B', soft: '#9A8F7C', red: '#C75146', blue: '#4A6FA5', green: '#5F8D5A', amber: '#C77E2E', purple: '#7A5C9E' };

  if (!document.getElementById('nbl-css')) {
    const st = document.createElement('style'); st.id = 'nbl-css';
    st.textContent = `@keyframes nbl-flip{0%{transform:rotateY(0)}100%{transform:rotateY(180deg)}}
@keyframes nbl-pop{0%{transform:scale(.6);opacity:0}70%{transform:scale(1.08)}100%{transform:scale(1);opacity:1}}
.nbl-pop{animation:nbl-pop .35s cubic-bezier(.3,.7,.4,1.2) both}`;
    document.head.appendChild(st);
  }

  // ── 공통: 4단계 스텝 트랙 (아이콘 + 도장) ──
  const STEPS = [
    { k: 'word', icon: 'pencil', label: '단어', color: c.amber },
    { k: 'sent', icon: 'speech', label: '문장', color: c.blue },
    { k: 'pick', icon: 'speech', label: '가이드 대화', color: c.purple },
    { k: 'free', icon: 'mic', label: '자유 대화', color: c.red },
  ];
  function StepTrack({ done = 0, active, skipped = [] }) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', padding: '0 26px' }}>
        {STEPS.map((s, i) => {
          const st = skipped.includes(i) ? 'skip' : i < done ? 'done' : i === active ? 'now' : 'todo';
          return (
            <React.Fragment key={s.k}>
              <div style={{ textAlign: 'center', width: 58 }}>
                <div style={{ width: 44, height: 44, margin: '0 auto', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
                  border: st === 'now' ? `2.2px solid ${s.color}` : st === 'done' ? `2px solid ${c.green}` : st === 'skip' ? `1.4px solid rgba(62,54,43,.25)` : `1.6px dashed ${c.soft}`,
                  background: st === 'now' ? `${s.color}18` : st === 'done' ? 'rgba(95,141,90,.12)' : st === 'skip' ? 'repeating-linear-gradient(-45deg, rgba(62,54,43,.07) 0 3px, transparent 3px 7px)' : 'transparent', transform: `rotate(${i % 2 ? 3 : -3}deg)` }}>
                  <NbIcon name={s.icon} size={22} style={{ opacity: st === 'todo' || st === 'skip' ? .4 : 1 }}/>
                  {st === 'done' && <div style={{ position: 'absolute', right: -5, top: -5, width: 17, height: 17, borderRadius: '50%', background: c.green, color: '#fff', fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1.5px solid ${c.paper}` }}>✓</div>}
                  {st === 'skip' && <div style={{ position: 'absolute', left: -4, right: -4, top: '50%', borderTop: `2px solid ${c.soft}`, transform: 'rotate(-20deg)' }}/>}
                </div>
                <div style={{ fontFamily: HW, fontSize: 12.5, color: st === 'todo' || st === 'skip' ? c.soft : c.ink, marginTop: 4, whiteSpace: 'nowrap', fontWeight: st === 'now' ? 700 : 400, textDecoration: st === 'skip' ? 'line-through' : 'none' }}>{s.label}</div>
              </div>
              {i < 3 && <div style={{ flex: 1, height: 0, borderTop: `2px ${i < done ? 'solid' : 'dashed'} ${i < done ? c.green : 'rgba(62,54,43,.25)'}`, marginTop: -18 }}/>}
            </React.Fragment>
          );
        })}
      </div>
    );
  }
  const Back = () => <NbPaper rot={-1} style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HW, fontSize: 16, color: c.ink, flexShrink: 0 }}>←</NbPaper>;
  const Head = ({ title, sub, right }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 20px 0' }}>
      <Back/>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontFamily: HW, fontSize: 21, color: c.ink, lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</div>
        {sub && <div style={{ fontSize: 10.5, color: c.soft, marginTop: 2, whiteSpace: 'nowrap' }}>{sub}</div>}
      </div>
      {right}
    </div>
  );
  const CTA = ({ children, dim, icon, bottom = 30 }) => (
    <div style={{ position: 'absolute', left: 20, right: 20, bottom, zIndex: 31 }}>
      <NbButton variant="ink" size="lg" full icon={icon} iconColor="#FFFdf4" style={dim ? { opacity: .45 } : {}}>{children}</NbButton>
    </div>
  );

  // ══ A · 상황 허브 (4단계 티켓) — 기존 D 브리핑을 대체 ══
  // level: 'a'(더듬더듬) = 4단계 모두 / 'b'(병원 영어 막힘) = 단어 건너뜀 / 'c'(실전 감각) = 단어·문장 건너뜀
  const SKIP = { a: [], b: [0], c: [0, 1] };
  const LEVEL_LABEL = { a: '기초 · 4단계 모두', b: '중급 · 단어 건너뜀', c: '실전 · 단어·문장 건너뜀' };
  function LessonHub({ done = 0, level = 'a' }) {
    const P = { stroke: c.ink, strokeWidth: 2, strokeLinejoin: 'round', strokeLinecap: 'round', fill: 'none' };
    const skipped = SKIP[level] || [];
    const firstActive = [0,1,2,3].find(i => !skipped.includes(i) && i >= done);
    const stage = (i, s, meta) => {
      const isSkip = skipped.includes(i);
      const st = isSkip ? 'skip' : i < done ? 'done' : i === firstActive ? 'now' : 'todo';
      if (isSkip) return (
        <div key={s.k} style={{ marginTop: 10, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 12, border: `1.4px dashed rgba(62,54,43,.3)`, borderRadius: 4, background: 'repeating-linear-gradient(-45deg, rgba(62,54,43,.05) 0 4px, transparent 4px 9px)', transform: `rotate(${i % 2 ? 0.4 : -0.4}deg)` }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, border: `1.4px solid rgba(62,54,43,.25)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, opacity: .5 }}><NbIcon name={s.icon} size={20}/></div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <span style={{ fontFamily: MONO, fontSize: 10, fontWeight: 700, color: c.soft }}>STEP {i + 1}</span>
            <span style={{ fontFamily: HW, fontSize: 16, color: c.soft, marginLeft: 6, textDecoration: 'line-through' }}>{s.label}</span>
            <div style={{ fontSize: 10.5, color: c.soft, marginTop: 2, whiteSpace: 'nowrap' }}>내 레벨에선 건너뛰어요</div>
          </div>
          <NbButton variant="dashed" size="sm">그래도 할래요</NbButton>
        </div>
      );
      return (
        <NbPaper key={s.k} rot={i % 2 ? 0.5 : -0.5} style={{ marginTop: 10, padding: '11px 12px', display: 'flex', alignItems: 'center', gap: 12, opacity: st === 'todo' ? .6 : 1, ...(st === 'now' ? { boxShadow: `0 2px 6px rgba(62,54,43,.14), 0 0 0 2.5px ${s.color}` } : {}) }}>
          <div style={{ width: 46, height: 46, borderRadius: 10, background: `${s.color}22`, border: `1.6px solid ${s.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transform: `rotate(${i % 2 ? 2 : -2}deg)` }}>
            <NbIcon name={s.icon} size={26}/>
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontFamily: MONO, fontSize: 10, fontWeight: 700, color: s.color }}>STEP {i + 1}</span>
              <span style={{ fontFamily: HW, fontSize: 18, color: c.ink }}>{s.label}</span>
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 4, alignItems: 'center' }}>
              {meta.map((m, j) => <span key={j} style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 10.5, color: c.soft, whiteSpace: 'nowrap' }}><NbIcon name={m[0]} size={12}/>{m[1]}</span>)}
            </div>
          </div>
          {st === 'done' ? <NbStamp color={c.green} size={40} top="✓" bottom="완료"/> : st === 'now' ? <NbButton variant="ink" size="sm">시작 ›</NbButton> : <NbIcon name="lock" size={18}/>}
        </NbPaper>
      );
    };
    return (
      <NbFrame label="수첩 상황 허브" active="일터">
        <div style={{ position: 'absolute', top: 44, left: 0, right: 0, bottom: 68, overflowY: 'auto', paddingBottom: 96 }}>
          <Head title="반복 신원확인 이유 설명" sub="ER · 투약 안전 · 오류 예방 · 3/34" right={<NbTag color={c.blue} style={{ fontSize: 10.5 }}><NbIcon name="shield" size={11}/> {LEVEL_LABEL[level].split(' · ')[0]}</NbTag>}/>
          {/* 상황 표지 — 폴라로이드 + 태그 (텍스트 최소) */}
          <div style={{ margin: '14px 20px 0' }}>
            <NbPaper rot={-0.6} tape tapeLeft={120} style={{ padding: '13px 14px' }}>
              <div style={{ display: 'flex', gap: 13, alignItems: 'center' }}>
                <NbPaper rot={-2.5} style={{ padding: '5px 5px 2px', flexShrink: 0 }}>
                  {window.NbAvatar ? <window.NbAvatar size={72} hair="short" hairColor="darkbrown" mouth="frown" eyes="angry" outfit="hospitalGown" outfitColor="sky" bg="plain"/> : (
                    <svg viewBox="0 0 72 84" width="72" height="84"><circle cx="36" cy="36" r="16" fill="#F6DCC0" {...P}/><path d="M18 84 Q20 62 36 62 Q52 62 54 84" fill="#B8CBB0" {...P}/></svg>)}
                  <div style={{ textAlign: 'center', fontFamily: MONO, fontSize: 8.5, fontWeight: 700, color: c.ink, whiteSpace: 'nowrap' }}>Mr. Alvarez</div>
                </NbPaper>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                    <NbTag color={c.red} style={{ fontSize: 10.5 }}><NbIcon name="siren" size={11}/> ER BAY 2</NbTag>
                    <NbTag color={c.blue} style={{ fontSize: 10.5 }}>Lv.B1</NbTag>
                    <NbTag color={c.soft} style={{ fontSize: 10.5 }}>~12분</NbTag>
                  </div>
                  <div style={{ fontFamily: HW, fontSize: 15, color: c.soft, marginTop: 8, lineHeight: 1.4 }}>“또 물어요? 아까도 말했잖아요.” — 짜증난 환자에게 <NbMark>왜 매번 확인하는지</NbMark> 설명하기</div>
                </div>
              </div>
              {/* 감정 + 보상 아이콘 행 */}
              <div style={{ display: 'flex', gap: 8, marginTop: 11 }}>
                {[['faceAngry', '짜증남', c.red], ['star', '+60 XP', c.amber], ['lab', '노트 자동저장', c.blue]].map((m, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6, padding: '6px 8px', border: `1.3px dashed ${m[2]}`, borderRadius: 4, background: `${m[2]}10` }}>
                    <NbIcon name={m[0]} size={16}/><span style={{ fontFamily: HW, fontSize: 12.5, color: c.ink, whiteSpace: 'nowrap' }}>{m[1]}</span>
                  </div>
                ))}
              </div>
            </NbPaper>
          </div>
          {/* 4단계 티켓 */}
          <div style={{ margin: '16px 20px 0' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <div style={{ fontFamily: HW, fontSize: 17, color: c.ink }}>{4 - skipped.length}단계로 익혀요</div>
              <span style={{ fontSize: 10.5, color: c.soft, whiteSpace: 'nowrap' }}>{LEVEL_LABEL[level]}</span>
              <div style={{ flex: 1 }}/>
              <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 700, color: c.soft }}>{done}/{4 - skipped.length}</span>
            </div>
            <div style={{ marginTop: 6 }}><NbGauge value={done / (4 - skipped.length) * 100} color={c.green} height={9}/></div>
            {stage(0, STEPS[0], [['pencil', '단어 8'], ['speaker', '듣기']])}
            {stage(1, STEPS[1], [['speech', '문장 5'], ['mic', '따라 말하기']])}
            {stage(2, STEPS[2], [['speech', '한국어 가이드'], ['mic', '말하기·타이핑'], ['star', '+20']])}
            {stage(3, STEPS[3], [['mic', '실전'], ['star', '+40']])}
          </div>
        </div>
        <CTA bottom={84} icon={firstActive != null ? STEPS[firstActive].icon : 'star'}>{firstActive == null ? '다시 풀기 ↺' : done === 0 ? `STEP ${firstActive + 1} · ${STEPS[firstActive].label}부터 시작` : `STEP ${firstActive + 1} 이어서 ›`}</CTA>
      </NbFrame>
    );
  }

  // ══ B · STEP 1 단어 — 큰 그림 플래시카드 + 8칸 진행 ══
  function LessonWords() {
    const words = [
      { w: 'wristband', ko: '손목 밴드', icon: 'bandage', done: true },
      { w: 'date of birth', ko: '생년월일', icon: 'board', done: true },
      { w: 'verify', ko: '확인하다', icon: 'shield', done: true },
      { w: 'allergy', ko: '알레르기', icon: 'siren', now: true },
      { w: 'medication', ko: '약', icon: 'pill' },
      { w: 'safety', ko: '안전', icon: 'shield' },
      { w: 'double-check', ko: '재확인', icon: 'board' },
      { w: 'policy', ko: '규정', icon: 'lab' },
    ];
    const cur = words[3];
    return (
      <NbFrame label="수첩 STEP1 단어" active="일터" nav={false}>
        <div style={{ position: 'absolute', top: 44, left: 0, right: 0, bottom: 0 }}>
          <Head title="STEP 1 · 단어" sub="반복 신원확인 이유 설명" right={<NbTag color={c.amber} fill style={{ fontSize: 11 }}>4 / 8</NbTag>}/>
          <div style={{ marginTop: 12 }}><StepTrack done={0} active={0}/></div>
          {/* 8칸 진행 — 아이콘 칩 */}
          <div style={{ display: 'flex', gap: 5, padding: '14px 20px 0' }}>
            {words.map((w, i) => (
              <div key={i} style={{ flex: 1, height: 30, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', border: w.now ? `2px solid ${c.amber}` : w.done ? `1.5px solid ${c.green}` : `1.3px dashed ${c.soft}`, background: w.done ? 'rgba(95,141,90,.15)' : w.now ? `${c.amber}20` : 'transparent', transform: `rotate(${i % 2 ? 1.5 : -1.5}deg)` }}>
                <NbIcon name={w.icon} size={15} style={{ opacity: w.done || w.now ? 1 : .35 }}/>
              </div>
            ))}
          </div>
          {/* 큰 플래시카드 */}
          <div style={{ padding: '18px 26px 0' }}>
            <NbPaper rot={-0.8} tape tapeLeft={140} style={{ padding: '22px 18px 18px', textAlign: 'center', minHeight: 250 }}>
              <div style={{ width: 92, height: 92, margin: '0 auto', borderRadius: '50%', background: `${c.amber}22`, border: `2px solid ${c.amber}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="nbl-pop">
                <NbIcon name={cur.icon} size={52}/>
              </div>
              <div style={{ fontFamily: MONO, fontSize: 28, fontWeight: 700, color: c.ink, marginTop: 16, letterSpacing: -0.5 }}>{cur.w}</div>
              <div style={{ fontFamily: MONO, fontSize: 12, color: c.soft, marginTop: 3 }}>/ˈælərdʒi/</div>
              <div style={{ fontFamily: HW, fontSize: 21, color: c.ink, marginTop: 10 }}><NbMark>{cur.ko}</NbMark></div>
              {/* 예문 — 한 줄만 */}
              <div style={{ marginTop: 12, fontSize: 12, color: c.soft, fontStyle: 'italic', lineHeight: 1.5 }}>“Do you have any <b style={{ color: c.ink }}>allergies</b>?”</div>
              {/* 듣기 / 따라하기 큰 아이콘 버튼 */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginTop: 16 }}>
                {[['speaker', c.blue], ['mic', c.red]].map((b, i) => (
                  <div key={i} style={{ width: 54, height: 54, borderRadius: '50%', border: `2px solid ${b[1]}`, background: `${b[1]}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 5px rgba(62,54,43,.15)', transform: `rotate(${i ? 3 : -3}deg)` }}>
                    <NbIcon name={b[0]} size={26}/>
                  </div>
                ))}
              </div>
            </NbPaper>
          </div>
          {/* 알아요 / 헷갈려요 — 아이콘 2분할 */}
          <div style={{ position: 'absolute', left: 20, right: 20, bottom: 30, display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}><NbButton variant="paper" size="lg" full rot={-0.5}><span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}><NbIcon name="bulb" size={19}/> 헷갈려요</span></NbButton></div>
            <div style={{ flex: 1 }}><NbButton variant="ink" size="lg" full rot={0.5}><span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}><NbIcon name="shield" size={19} color="#FFFdf4"/> 알아요 ✓</span></NbButton></div>
          </div>
        </div>
      </NbFrame>
    );
  }

  // ══ C · STEP 2 문장 — 청크 조립 + 듣기·따라 말하기 ══
  function LessonSentences() {
    const chunks = [['I need to', true], ['check your', true], ['wristband', false], ['every time', false]];
    const pool = ['every time', 'wristband', 'for safety', 'your name'];
    return (
      <NbFrame label="수첩 STEP2 문장" active="일터" nav={false}>
        <div style={{ position: 'absolute', top: 44, left: 0, right: 0, bottom: 0 }}>
          <Head title="STEP 2 · 문장" sub="유형 · 청크 조립" right={<NbTag color={c.blue} fill style={{ fontSize: 11 }}>2 / 5</NbTag>}/>
          <div style={{ marginTop: 12 }}><StepTrack done={1} active={1}/></div>
          {/* 상황 말풍선 — 아바타 + 한 줄 */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', padding: '16px 20px 0' }}>
            <div style={{ flexShrink: 0 }}>{window.NbAvatar ? <window.NbAvatar size={56} hair="short" hairColor="darkbrown" mouth="frown" eyes="angry" outfit="hospitalGown" outfitColor="sky" bg="plain"/> : <NbIcon name="me" size={40}/>}</div>
            <NbPaper rot={0.4} style={{ flex: 1, padding: '9px 12px', position: 'relative' }}>
              <div style={{ position: 'absolute', left: -8, bottom: 12, borderTop: '6px solid transparent', borderBottom: '6px solid transparent', borderRight: `8px solid #E0D6C0` }}/>
              <div style={{ fontSize: 12.5, color: c.ink, fontStyle: 'italic', lineHeight: 1.45 }}>“Why do you keep asking my name?”</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 4 }}><NbIcon name="faceAngry" size={13}/><span style={{ fontFamily: HW, fontSize: 12, color: c.red }}>짜증</span></div>
            </NbPaper>
          </div>
          {/* 조립 슬롯 — 큰 청크 종이 */}
          <div style={{ padding: '18px 20px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <NbIcon name="speech" size={16}/><span style={{ fontFamily: HW, fontSize: 14.5, color: c.soft }}>조각을 순서대로 붙이세요</span>
            </div>
            <NbPaper rot={-0.5} style={{ marginTop: 8, padding: '14px 12px', minHeight: 92, display: 'flex', flexWrap: 'wrap', gap: 8, alignContent: 'flex-start' }}>
              {chunks.map((ch, i) => ch[1]
                ? <span key={i} className="nbl-pop" style={{ fontFamily: MONO, fontSize: 15, fontWeight: 700, color: c.ink, background: `${c.blue}20`, border: `1.6px solid ${c.blue}`, borderRadius: 4, padding: '7px 11px', transform: `rotate(${i % 2 ? 1 : -1}deg)` }}>{ch[0]}</span>
                : <span key={i} style={{ minWidth: 78, height: 36, border: `1.6px dashed ${c.soft}`, borderRadius: 4, display: 'inline-block' }}/>)}
            </NbPaper>
            {/* 조각 풀 */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9, marginTop: 14 }}>
              {pool.map((p, i) => (
                <NbPaper key={p} rot={i % 2 ? 1 : -1} style={{ padding: '8px 13px', cursor: 'grab' }}>
                  <span style={{ fontFamily: MONO, fontSize: 14, fontWeight: 700, color: c.ink }}>{p}</span>
                </NbPaper>
              ))}
            </div>
            {/* 힌트: 한국어 뜻 + 듣기 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14 }}>
              <NbMemo rot={0.3} style={{ flex: 1 }}>매번 <b>손목 밴드를 확인</b>해야 해요</NbMemo>
              <div style={{ width: 46, height: 46, borderRadius: '50%', border: `2px solid ${c.blue}`, background: `${c.blue}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><NbIcon name="speaker" size={22}/></div>
            </div>
          </div>
          <div style={{ position: 'absolute', left: 20, right: 20, bottom: 30, display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}><NbButton variant="paper" size="lg" full><span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}><NbIcon name="mic" size={19}/> 따라 말하기</span></NbButton></div>
            <div style={{ flex: 1 }}><NbButton variant="ink" size="lg" full style={{ opacity: .45 }}>확인 ✓</NbButton></div>
          </div>
        </div>
      </NbFrame>
    );
  }

  // ══ STEP 2 문장 — 유형 ② 빈칸 채우기 (핵심 청크 1개) ══
  function LessonSentBlank() {
    return (
      <NbFrame label="수첩 STEP2 빈칸" active="일터" nav={false}>
        <div style={{ position: 'absolute', top: 44, left: 0, right: 0, bottom: 0 }}>
          <Head title="STEP 2 · 문장" sub="유형 · 빈칸 채우기" right={<NbTag color={c.blue} fill style={{ fontSize: 11 }}>3 / 5</NbTag>}/>
          <div style={{ marginTop: 12 }}><StepTrack done={1} active={1}/></div>
          <div style={{ padding: '18px 22px 0' }}>
            <NbPaper rot={-0.6} tape tapeLeft={130} style={{ padding: '18px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}><NbIcon name="speech" size={16}/><span style={{ fontFamily: HW, fontSize: 14, color: c.soft }}>환자를 안심시키는 문장</span></div>
              <div style={{ fontSize: 19, fontWeight: 700, color: c.ink, lineHeight: 1.9 }}>
                It's <span style={{ display: 'inline-block', minWidth: 118, borderBottom: `2.5px solid ${c.blue}`, textAlign: 'center', color: c.blue, fontFamily: HW, fontSize: 20 }}>?</span> ,<br/>not because I forgot.
              </div>
              <div style={{ fontFamily: HW, fontSize: 14.5, color: c.soft, marginTop: 8 }}>“당신의 안전을 위한 거예요, 잊어서가 아니라”</div>
            </NbPaper>
            {/* 2×2 큰 선택 카드 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 11, marginTop: 16 }}>
              {[['for your safety', 'shield', true], ['for my record', 'board'], ['because of policy', 'lab'], ['for the doctor', 'me']].map((o, i) => (
                <NbPaper key={i} rot={i % 2 ? 0.8 : -0.8} style={{ padding: '13px 10px', textAlign: 'center', cursor: 'pointer', ...(o[2] ? { boxShadow: `0 2px 6px rgba(62,54,43,.14), 0 0 0 2.5px ${c.green}` } : {}) }}>
                  <div style={{ width: 40, height: 40, margin: '0 auto', borderRadius: '50%', background: o[2] ? 'rgba(95,141,90,.15)' : `${c.blue}12`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><NbIcon name={o[1]} size={22}/></div>
                  <div style={{ fontFamily: MONO, fontSize: 12.5, fontWeight: 700, color: c.ink, marginTop: 8 }}>{o[0]}</div>
                </NbPaper>
              ))}
            </div>
            <div style={{ marginTop: 14 }}><NbMemo color={c.green} rot={0.3}><b style={{ color: c.green }}>✓</b> 이유를 먼저 말하면 환자가 덜 불쾌해해요.</NbMemo></div>
          </div>
          <div style={{ position: 'absolute', left: 20, right: 20, bottom: 30, display: 'flex', gap: 12 }}>
            <div style={{ width: 62 }}><NbButton variant="paper" size="lg" full><NbIcon name="speaker" size={20}/></NbButton></div>
            <div style={{ flex: 1 }}><NbButton variant="ink" size="lg" full icon="mic" iconColor="#FFFdf4">따라 말하고 다음 ›</NbButton></div>
          </div>
        </div>
      </NbFrame>
    );
  }

  // ══ STEP 2 문장 — 유형 ③ 순서 배열 (대화 흐름) ══
  function LessonSentOrder() {
    const lines = [
      ['I know it feels repetitive.', 'me', true],
      ['It\u2019s for your safety.', 'shield', true],
      ['Can you tell me your name and date of birth?', 'board', false],
      ['Thank you, Mr. Alvarez.', 'star', false],
    ];
    return (
      <NbFrame label="수첩 STEP2 순서" active="일터" nav={false}>
        <div style={{ position: 'absolute', top: 44, left: 0, right: 0, bottom: 0 }}>
          <Head title="STEP 2 · 문장" sub="유형 · 순서 배열" right={<NbTag color={c.blue} fill style={{ fontSize: 11 }}>4 / 5</NbTag>}/>
          <div style={{ marginTop: 12 }}><StepTrack done={1} active={1}/></div>
          <div style={{ padding: '16px 20px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><NbIcon name="compass" size={16}/><span style={{ fontFamily: HW, fontSize: 14.5, color: c.soft }}>공감 → 이유 → 확인 → 감사 순서로 놓으세요</span></div>
            {lines.map((l, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 11 }}>
                <span style={{ width: 28, height: 28, borderRadius: '50%', border: `1.8px solid ${l[2] ? c.green : c.soft}`, color: l[2] ? c.green : c.soft, fontFamily: HW, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: l[2] ? 'rgba(95,141,90,.12)' : 'transparent' }}>{l[2] ? i + 1 : '?'}</span>
                <NbPaper rot={i % 2 ? 0.5 : -0.5} style={{ flex: 1, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 9, ...(l[2] ? {} : { borderStyle: 'dashed', background: 'transparent', boxShadow: 'none' }) }}>
                  <NbIcon name={l[1]} size={18}/>
                  <span style={{ fontSize: 13, fontWeight: 600, color: l[2] ? c.ink : c.soft, flex: 1, minWidth: 0, lineHeight: 1.4 }}>{l[0]}</span>
                  {!l[2] && <span style={{ fontFamily: HW, fontSize: 13, color: c.soft, whiteSpace: 'nowrap' }}>↕</span>}
                  {l[2] && <NbCheck done size={17}/>}
                </NbPaper>
              </div>
            ))}
            <div style={{ marginTop: 14 }}><NbMemo rot={-0.3}>힌트: <b>공감</b>이 먼저 — “I know…”</NbMemo></div>
          </div>
          <div style={{ position: 'absolute', left: 20, right: 20, bottom: 30, display: 'flex', gap: 12 }}>
            <div style={{ width: 62 }}><NbButton variant="paper" size="lg" full><NbIcon name="speaker" size={20}/></NbButton></div>
            <div style={{ flex: 1 }}><NbButton variant="ink" size="lg" full style={{ opacity: .45 }}>순서 확정 ✓</NbButton></div>
          </div>
        </div>
      </NbFrame>
    );
  }

  // ══ STEP 2 문장 — 유형 ④ 듣고 고르기 (오디오 → 뜻 카드) ══
  function LessonSentListen() {
    return (
      <NbFrame label="수첩 STEP2 듣기" active="일터" nav={false}>
        <div style={{ position: 'absolute', top: 44, left: 0, right: 0, bottom: 0 }}>
          <Head title="STEP 2 · 문장" sub="유형 · 듣고 고르기" right={<NbTag color={c.blue} fill style={{ fontSize: 11 }}>1 / 5</NbTag>}/>
          <div style={{ marginTop: 12 }}><StepTrack done={1} active={1}/></div>
          <div style={{ padding: '22px 22px 0', textAlign: 'center' }}>
            {/* 큰 재생 버튼 + 파형 */}
            <div style={{ width: 96, height: 96, margin: '0 auto', borderRadius: '50%', border: `2.5px solid ${c.blue}`, background: `${c.blue}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 8px rgba(62,54,43,.18)' }} className="nbl-pop"><NbIcon name="speaker" size={46}/></div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 3, marginTop: 14, height: 26 }}>
              {[6,12,18,24,14,20,10,22,16,8,18,12,6].map((h, i) => <span key={i} style={{ width: 4, height: h, background: i < 8 ? c.blue : 'rgba(62,54,43,.2)', borderRadius: 2 }}/>)}
            </div>
            <div style={{ fontFamily: HW, fontSize: 16, color: c.soft, marginTop: 8 }}>들은 문장의 <NbMark>뜻</NbMark>을 고르세요</div>
            <div style={{ marginTop: 6, display: 'inline-flex', gap: 6 }}>
              <NbTag color={c.soft} style={{ fontSize: 10.5 }}>1.0×</NbTag><NbTag color={c.soft} style={{ fontSize: 10.5 }}>다시 듣기 2회 남음</NbTag>
            </div>
          </div>
          <div style={{ padding: '16px 20px 0' }}>
            {[['bandage', '매번 손목 밴드를 확인해야 해요', true], ['pill', '지금 약을 드릴게요', false], ['board', '차트에 기록했어요', false]].map((o, i) => (
              <NbPaper key={i} rot={i % 2 ? 0.5 : -0.5} style={{ marginTop: 10, padding: '12px 13px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', ...(o[2] ? { boxShadow: `0 2px 6px rgba(62,54,43,.14), 0 0 0 2.5px ${c.green}` } : {}) }}>
                <div style={{ width: 42, height: 42, borderRadius: 10, background: o[2] ? 'rgba(95,141,90,.15)' : `${c.blue}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><NbIcon name={o[0]} size={24}/></div>
                <span style={{ fontFamily: HW, fontSize: 17, color: c.ink, flex: 1 }}>{o[1]}</span>
                {o[2] && <NbCheck done size={18}/>}
              </NbPaper>
            ))}
            <div style={{ marginTop: 12, fontSize: 12.5, color: c.soft, fontStyle: 'italic', textAlign: 'center' }}>“I need to check your wristband every time.”</div>
          </div>
          <div style={{ position: 'absolute', left: 20, right: 20, bottom: 30 }}><NbButton variant="ink" size="lg" full>확인 ✓</NbButton></div>
        </div>
      </NbFrame>
    );
  }

  // ══ D · STEP 2 문장 — 완성 후 따라 말하기 결과 카드 ══
  function LessonSentenceDone() {
    return (
      <NbFrame label="수첩 STEP2 문장 완성" active="일터" nav={false}>
        <div style={{ position: 'absolute', top: 44, left: 0, right: 0, bottom: 0 }}>
          <Head title="STEP 2 · 문장" sub="반복 신원확인 이유 설명" right={<NbTag color={c.blue} fill style={{ fontSize: 11 }}>5 / 5</NbTag>}/>
          <div style={{ marginTop: 12 }}><StepTrack done={1} active={1}/></div>
          <div style={{ padding: '20px 24px 0', textAlign: 'center' }}>
            <div className="nbl-pop"><NbStamp color={c.green} size={92} top="STEP 2" bottom="PASSED"/></div>
            <div style={{ fontFamily: HW, fontSize: 22, color: c.ink, marginTop: 14 }}>문장 5개, 입에 붙었어요</div>
          </div>
          {/* 5문장 요약 — 점수 아이콘 행 */}
          <div style={{ padding: '14px 20px 0' }}>
            {[
              ['I need to check your wristband every time.', 91],
              ['It\u2019s for your safety.', 88],
              ['Can you tell me your name and date of birth?', 76],
              ['This is hospital policy.', 84],
              ['I know it feels repetitive.', 69],
            ].map((s, i) => (
              <NbPaper key={i} rot={i % 2 ? 0.4 : -0.4} style={{ marginTop: 8, padding: '8px 11px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: '50%', border: `2px solid ${s[1] >= 80 ? c.green : c.amber}`, background: s[1] >= 80 ? 'rgba(95,141,90,.15)' : `${c.amber}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HW, fontSize: 13.5, color: c.ink, flexShrink: 0 }}>{s[1]}</div>
                <div style={{ fontSize: 12.5, color: c.ink, flex: 1, minWidth: 0, lineHeight: 1.4 }}>{s[0]}</div>
                <NbIcon name="speaker" size={17}/>
              </NbPaper>
            ))}
          </div>
          <div style={{ position: 'absolute', left: 20, right: 20, bottom: 30 }}>
            <NbButton variant="ink" size="lg" full icon="speech" iconColor="#FFFdf4">STEP 3 · 가이드 대화로 ›</NbButton>
          </div>
        </div>
      </NbFrame>
    );
  }

  Object.assign(window, { LessonHub, LessonWords, LessonSentences, LessonSentBlank, LessonSentOrder, LessonSentListen, LessonSentenceDone, NbStepTrack: StepTrack });
})();
