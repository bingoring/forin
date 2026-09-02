// screen-pronunciation.jsx — 발음·스피킹 피드백.
//
// 왜: forin의 핵심 가치는 "현장에서 말이 통하게 한다"인데, 지금까지 대화는
// 텍스트 선택 중심이었다. 실제 첫 근무에서 가장 두려운 건 내 말이 안 통하는
// 것이므로, 녹음 → 채점 → 음절 단위 교정 → 재시도 루프를 만든다.
// 오류가 치명적인 항목에 집중: 약물명, 숫자(mg/mL), 환자 확인 문구.

(function () {
  const T = () => window.ForinTokens;

  const Shell = ({ label, children, dark }) => {
    const t = T();
    return (
      <div data-screen-label={label} style={{ height: '100%', background: dark ? t.ink : t.paper, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, bottom: 62, overflowY: 'auto', paddingBottom: 20 }}>{children}</div>
        <window.ForinBottomNav active="campus"/>
      </div>
    );
  };

  function Head({ ctx, step, dark }) {
    const t = T();
    return (
      <div style={{ padding: '48px 16px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ background: dark ? t.cream : '#fff', border: `2px solid ${t.ink}`, boxShadow: `2px 2px 0 0 ${t.ink}`, padding: '4px 9px', fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: t.ink }}>‹ 뒤로</div>
          <div style={{ flex: 1 }}/>
          <div style={{ background: t.mint, border: `2px solid ${t.ink}`, padding: '3px 8px', fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: t.ink, boxShadow: `2px 2px 0 0 ${t.mintShadow}` }}>🎙 발음</div>
        </div>
        <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 10, color: dark ? t.textFaint : t.textSoft, marginTop: 11 }}>{ctx}</div>
        <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 15, color: dark ? t.cream : t.ink, marginTop: 4 }}>{step}</div>
      </div>
    );
  }

  function TargetCard({ tokens, ipa, hint }) {
    const t = T();
    return (
      <div style={{ margin: '14px 16px 0', background: '#fff', border: `3px solid ${t.ink}`, boxShadow: `4px 4px 0 0 ${t.ink}`, padding: '15px 13px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: -9, left: 12, background: t.ink, color: t.cream, padding: '2px 7px', fontFamily: '"DungGeunMo",monospace', fontSize: 9 }}>따라 말해보세요</div>
        <div style={{ fontFamily: '"Galmuri11","Pretendard",sans-serif', fontSize: 16, color: t.ink, lineHeight: 1.85, marginTop: 4 }}>
          {tokens.map((tk, i) => tk.hi
            ? <span key={i} style={{ background: tk.hi === 'drug' ? t.lilac : t.yellow, border: `2px solid ${t.ink}`, padding: '1px 5px', margin: '0 1px', fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 15 }}>{tk.w}</span>
            : <span key={i}>{tk.w}</span>)}
        </div>
        <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 10.5, color: t.textSoft, marginTop: 9, letterSpacing: .3 }}>{ipa}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 11, paddingTop: 10, borderTop: `2px dotted ${t.ink}22` }}>
          <div style={{ background: t.blue, border: `2px solid ${t.ink}`, padding: '5px 9px', fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: t.ink, boxShadow: `2px 2px 0 0 ${t.ink}` }}>🔊 원어민</div>
          <div style={{ background: '#fff', border: `2px solid ${t.ink}`, padding: '5px 9px', fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: t.ink }}>0.5× 느리게</div>
          <div style={{ flex: 1 }}/>
          <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 9.5, color: t.textSoft }}>{hint}</div>
        </div>
      </div>
    );
  }

  function Wave({ bars, color, h = 46, live }) {
    const t = T();
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, height: h }}>
        {bars.map((v, i) => (
          <div key={i} style={{ width: 5, height: Math.max(3, v * h), background: color, border: `1.5px solid ${t.ink}` }}/>
        ))}
      </div>
    );
  }

  const W1 = [.3,.6,.9,.5,.8,1,.7,.4,.6,.85,.5,.3,.7,.95,.6,.4,.75,.5,.3,.55];

  // ══ 1 · 연습 대기 ══════════════════════════════════════════════════
  function ScreenPronPractice() {
    const t = T();
    return (
      <Shell label="Pron · 연습 대기">
        <Head ctx="CHAPTER 2 · 응급실 트리아지" step="약물명 · 숫자 발음"/>
        <TargetCard
          tokens={[{w:"I'm giving you "},{w:'acetaminophen',hi:'drug'},{w:' '},{w:'650 milligrams',hi:'num'},{w:' now.'}]}
          ipa="/aɪm ˈɡɪvɪŋ juː əˌsiːtəˈmɪnəfən sɪks ˈfɪfti ˈmɪlɪɡræmz naʊ/"
          hint="3회 중 1회차"/>
        <div style={{ display: 'flex', gap: 9, margin: '13px 16px 0', background: t.peach, border: `3px solid ${t.ink}`, boxShadow: `3px 3px 0 0 ${t.peachShadow}`, padding: '10px 12px' }}>
          <div style={{ fontSize: 15 }}>⚠</div>
          <div style={{ minWidth: 0, flex: 1, fontFamily: '"Galmuri11",monospace', fontSize: 10.5, color: t.text, lineHeight: 1.5 }}>
            약물명과 용량은 잘못 들리면 <b style={{ color: t.ink }}>투약 사고</b>로 이어져요. 음절을 끊어서 또박또박.
          </div>
        </div>
        <div style={{ margin: '22px 16px 0', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 9 }}>
            <div style={{ width: 92, height: 92, background: t.red, border: `4px solid ${t.ink}`, boxShadow: `5px 5px 0 0 ${t.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 38 }}>🎙</div>
            <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 12.5, color: t.ink }}>눌러서 녹음</div>
            <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 9.5, color: t.textSoft }}>조용한 곳에서 · 최대 10초</div>
          </div>
        </div>
        <div style={{ margin: '20px 16px 0', background: t.cream, border: `3px solid ${t.ink}`, boxShadow: `3px 3px 0 0 ${t.ink}` }}>
          <div style={{ padding: '8px 12px 6px', fontFamily: '"DungGeunMo",monospace', fontSize: 10.5, color: t.ink, borderBottom: `2px dotted ${t.ink}33` }}>📈 이 문장 내 점수</div>
          {[['1차','62',t.red],['2차','74',t.yellow],['3차','—','#fff']].map((r,i)=>(
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '7px 12px', borderBottom: i < 2 ? `1.5px dotted ${t.ink}22` : 'none' }}>
              <span style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: t.text, width: 26 }}>{r[0]}</span>
              <div style={{ flex: 1, height: 9, background: '#fff', border: `2px solid ${t.ink}`, position: 'relative' }}>
                {r[1] !== '—' && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: r[1] + '%', background: r[2] }}/>}
              </div>
              <span style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: t.ink, width: 22, textAlign: 'right' }}>{r[1]}</span>
            </div>
          ))}
        </div>
      </Shell>
    );
  }

  // ══ 2 · 녹음 중 ════════════════════════════════════════════════════
  function ScreenPronRecording() {
    const t = T();
    return (
      <Shell label="Pron · 녹음 중" dark>
        <Head ctx="CHAPTER 2 · 응급실 트리아지" step="듣고 있어요…" dark/>
        <div style={{ margin: '16px 16px 0', background: t.cream, border: `3px solid ${t.ink}`, boxShadow: `3px 3px 0 0 ${t.ink}`, padding: '13px 12px' }}>
          <div style={{ fontFamily: '"Galmuri11","Pretendard",sans-serif', fontSize: 14, color: t.ink, lineHeight: 1.8, textAlign: 'center' }}>
            I'm giving you <span style={{ background: t.lilac, border: `2px solid ${t.ink}`, padding: '1px 5px' }}>acetaminophen</span>{' '}
            <span style={{ background: t.yellow, border: `2px solid ${t.ink}`, padding: '1px 5px' }}>650 milligrams</span> now.
          </div>
        </div>
        <div style={{ margin: '20px 16px 0', background: '#0F1A24', border: `3px solid ${t.ink}`, boxShadow: `3px 3px 0 0 ${t.ink}`, padding: '14px 10px' }}>
          <Wave bars={W1} color="#22D3EE" h={52} live/>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
            <div style={{ width: 9, height: 9, background: '#EF4444', borderRadius: '50%' }}/>
            <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 12, color: '#22D3EE' }}>REC 00:04</div>
            <div style={{ flex: 1 }}/>
            <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 10, color: '#94A3B8' }}>남은 6초</div>
          </div>
        </div>
        <div style={{ margin: '14px 16px 0', display: 'flex', gap: 5 }}>
          {["I'm giving you",'a-cet-a-min-o-phen','six fifty','mil-li-grams','now'].map((w,i)=>(
            <div key={i} style={{ flex: 1, background: i < 2 ? t.mint : t.paper, border: `2px solid ${t.ink}`, padding: '5px 2px', textAlign: 'center', fontFamily: '"DungGeunMo",monospace', fontSize: 8, color: i < 2 ? t.ink : t.textSoft, lineHeight: 1.2 }}>{w}</div>
          ))}
        </div>
        <div style={{ margin: '26px 16px 0', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 9 }}>
            <div style={{ width: 84, height: 84, background: t.cream, border: `4px solid ${t.ink}`, boxShadow: `5px 5px 0 0 ${t.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30 }}>⏹</div>
            <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 12.5, color: t.cream }}>눌러서 끝내기</div>
          </div>
        </div>
      </Shell>
    );
  }

  // ══ 3 · 채점 결과 ══════════════════════════════════════════════════
  function ScreenPronResult() {
    const t = T();
    const syl = [["I'm",'ok'],['giv','ok'],['ing','ok'],['you','ok'],['a','ok'],['cet','weak'],['a','ok'],['min','bad'],['o','weak'],['phen','ok'],['six','ok'],['fif','ok'],['ty','ok'],['mil','ok'],['li','weak'],['grams','ok'],['now','ok']];
    const col = s => s === 'ok' ? t.mint : s === 'weak' ? t.yellow : t.red;
    return (
      <Shell label="Pron · 채점 결과">
        <Head ctx="CHAPTER 2 · 응급실 트리아지" step="발음 채점"/>
        <div style={{ margin: '14px 16px 0', background: t.mint, border: `3px solid ${t.ink}`, boxShadow: `4px 4px 0 0 ${t.mintShadow}`, padding: '14px 13px', display: 'flex', alignItems: 'center', gap: 13 }}>
          <div style={{ textAlign: 'center', flexShrink: 0 }}>
            <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 34, color: t.ink, lineHeight: 1 }}>81</div>
            <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 9.5, color: t.ink, opacity: .8, marginTop: 3 }}>/ 100</div>
          </div>
          <div style={{ width: 3, alignSelf: 'stretch', background: t.ink + '33' }}/>
          <div style={{ minWidth: 0, flex: 1 }}>
            {[['정확도','84'],['유창성','79'],['억양','80']].map((r,i)=>(
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: i < 2 ? 6 : 0 }}>
                <span style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 9.5, color: t.ink, width: 34 }}>{r[0]}</span>
                <div style={{ flex: 1, height: 8, background: '#fff', border: `2px solid ${t.ink}`, position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: r[1] + '%', background: t.ink }}/>
                </div>
                <span style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 9.5, color: t.ink, width: 18, textAlign: 'right' }}>{r[1]}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ margin: '13px 16px 0', background: '#fff', border: `3px solid ${t.ink}`, boxShadow: `3px 3px 0 0 ${t.ink}`, padding: '12px 11px' }}>
          <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 10.5, color: t.ink, marginBottom: 9 }}>음절별 결과</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {syl.map((s,i)=>(<div key={i} style={{ background: col(s[1]), border: `2px solid ${t.ink}`, padding: '4px 6px', fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: t.ink }}>{s[0]}</div>))}
          </div>
          <div style={{ display: 'flex', gap: 11, marginTop: 11, paddingTop: 9, borderTop: `2px dotted ${t.ink}22` }}>
            {[['좋아요',t.mint],['애매해요',t.yellow],['다시!',t.red]].map((l,i)=>(
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 11, height: 11, background: l[1], border: `2px solid ${t.ink}` }}/>
                <span style={{ fontFamily: '"Galmuri11",monospace', fontSize: 9.5, color: t.text }}>{l[0]}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ margin: '13px 16px 0', background: '#0F1A24', border: `3px solid ${t.ink}`, boxShadow: `3px 3px 0 0 ${t.ink}`, padding: '11px 10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <div style={{ background: t.blue, border: `1.5px solid ${t.ink}`, padding: '1px 5px', fontFamily: '"DungGeunMo",monospace', fontSize: 8.5, color: t.ink }}>원어민</div>
            <span style={{ fontFamily: '"Galmuri11",monospace', fontSize: 9, color: '#94A3B8' }}>2.1초</span>
          </div>
          <Wave bars={[.4,.7,1,.6,.85,.95,.7,.5,.7,.9,.6,.4,.8,1,.65,.45,.8]} color="#7DD3FC" h={34}/>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 9, marginBottom: 4 }}>
            <div style={{ background: t.mint, border: `1.5px solid ${t.ink}`, padding: '1px 5px', fontFamily: '"DungGeunMo",monospace', fontSize: 8.5, color: t.ink }}>내 발음</div>
            <span style={{ fontFamily: '"Galmuri11",monospace', fontSize: 9, color: '#94A3B8' }}>2.9초 · 조금 느려요</span>
          </div>
          <Wave bars={[.35,.5,.75,.45,.6,.7,.9,.4,.5,.6,.45,.3,.6,.75,.5,.35,.6]} color="#4FC79D" h={34}/>
        </div>
        <div style={{ margin: '13px 16px 0' }}>
          <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: t.ink, marginBottom: 8 }}>━ 교정 포인트 2 ━━━━━━</div>
          {[{ s:'min', ipa:'/ˈmɪn/', msg:'"민"이 아니라 짧은 /ɪ/ — 입을 옆으로 살짝만.', bad:true },
            { s:'li',  ipa:'/lɪ/',   msg:'milligrams의 -li-를 흘리지 말고 짚어주세요.', bad:false }].map((c,i)=>(
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#fff', border: `3px solid ${t.ink}`, boxShadow: `3px 3px 0 0 ${t.ink}`, padding: '10px 11px', marginBottom: 8 }}>
              <div style={{ width: 42, flexShrink: 0, background: c.bad ? t.red : t.yellow, border: `2px solid ${t.ink}`, padding: '5px 0', textAlign: 'center', fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: t.ink }}>{c.s}</div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 9.5, color: t.textSoft }}>{c.ipa}</div>
                <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 11, color: t.ink, marginTop: 3, lineHeight: 1.4 }}>{c.msg}</div>
              </div>
              <div style={{ background: t.blue, border: `2px solid ${t.ink}`, padding: '5px 7px', fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: t.ink, flexShrink: 0 }}>🔊</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 9, margin: '15px 16px 0' }}>
          <div style={{ flex: 1, background: '#fff', border: `3px solid ${t.ink}`, boxShadow: `3px 3px 0 0 ${t.ink}`, padding: '11px 0', textAlign: 'center', fontFamily: '"DungGeunMo",monospace', fontSize: 12, color: t.ink }}>🎙 다시 녹음</div>
          <div style={{ flex: 1, background: t.mint, border: `3px solid ${t.ink}`, boxShadow: `3px 3px 0 0 ${t.mintShadow}`, padding: '11px 0', textAlign: 'center', fontFamily: '"DungGeunMo",monospace', fontSize: 12, color: t.ink }}>다음 문장 ›</div>
        </div>
        <div style={{ margin: '9px 16px 0', background: t.lilac, border: `3px solid ${t.ink}`, boxShadow: `3px 3px 0 0 ${t.ink}`, padding: '10px 0', textAlign: 'center', fontFamily: '"DungGeunMo",monospace', fontSize: 12, color: t.ink }}>🎯 약한 음소만 드릴하기</div>
      </Shell>
    );
  }

  // ══ 4 · 취약 음소 드릴 ═════════════════════════════════════════════
  function ScreenPronDrill() {
    const t = T();
    return (
      <Shell label="Pron · 취약 음소 드릴">
        <Head ctx="내 발음 기록 기반" step="약한 음소 드릴"/>
        <div style={{ margin: '14px 16px 0', fontFamily: '"Galmuri11",monospace', fontSize: 10.5, color: t.textSoft, lineHeight: 1.5 }}>
          지난 2주간 자주 틀린 음소만 모았어요. 하루 3분이면 충분합니다.
        </div>
        <div style={{ margin: '12px 16px 0', background: t.cream, border: `3px solid ${t.ink}`, boxShadow: `3px 3px 0 0 ${t.ink}` }}>
          <div style={{ padding: '9px 12px 7px', fontFamily: '"DungGeunMo",monospace', fontSize: 10.5, color: t.ink, borderBottom: `2px dotted ${t.ink}33` }}>🔤 내 음소 정확도</div>
          {[['/ɪ/ vs /iː/','sit / seat',48,t.red],['/r/ 초성','radiate',61,t.yellow],['/θ/','breathe',66,t.yellow],['/f/ vs /p/','fifty',88,t.mint]].map((r,i)=>(
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '8px 12px', borderBottom: i < 3 ? `1.5px dotted ${t.ink}22` : 'none' }}>
              <div style={{ width: 62, flexShrink: 0 }}>
                <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 10.5, color: t.ink }}>{r[0]}</div>
                <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 9, color: t.text, marginTop: 2 }}>{r[1]}</div>
              </div>
              <div style={{ flex: 1, height: 10, background: '#fff', border: `2px solid ${t.ink}`, position: 'relative' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: r[2] + '%', background: r[3] }}/>
              </div>
              <span style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 10.5, color: t.ink, width: 22, textAlign: 'right' }}>{r[2]}</span>
            </div>
          ))}
        </div>
        <div style={{ margin: '14px 16px 0', background: '#fff', border: `3px solid ${t.ink}`, boxShadow: `4px 4px 0 0 ${t.ink}`, padding: '13px 12px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: -9, left: 12, background: t.red, border: `2px solid ${t.ink}`, padding: '1px 6px', fontFamily: '"DungGeunMo",monospace', fontSize: 9, color: t.ink }}>가장 약한 음소</div>
          <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 13, color: t.ink, marginTop: 4 }}>/ɪ/ vs /iː/ 최소대립쌍</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 11 }}>
            {[['sit','/sɪt/',t.yellow],['seat','/siːt/','#fff'],['fill','/fɪl/',t.yellow],['feel','/fiːl/','#fff']].map((w,i)=>(
              <div key={i} style={{ background: w[2], border: `2.5px solid ${t.ink}`, boxShadow: `2.5px 2.5px 0 0 ${t.ink}`, padding: '9px 6px', textAlign: 'center' }}>
                <div style={{ fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 14, color: t.ink }}>{w[0]}</div>
                <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 9, color: t.text, marginTop: 3 }}>{w[1]}</div>
              </div>
            ))}
          </div>
          <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 10, color: t.text, marginTop: 11, lineHeight: 1.5, padding: '7px 9px', background: t.cream, border: `1.5px dashed ${t.ink}44` }}>
            <b style={{ color: t.ink }}>Tip.</b> /ɪ/는 짧고 느슨하게, /iː/는 길고 입꼬리를 당겨서. 병원에서 "sit"과 "seat"을 헷갈리면 체위 지시가 틀려요.
          </div>
        </div>
        <div style={{ margin: '13px 16px 0' }}>
          <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: t.ink, marginBottom: 8 }}>━ 현장 문장에 적용 ━━━━━</div>
          {[['Please sit up in the bed.','침대에서 앉아주세요'],['Take a deep breath in.','깊게 숨을 들이쉬세요']].map((s,i)=>(
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#fff', border: `3px solid ${t.ink}`, boxShadow: `3px 3px 0 0 ${t.ink}`, padding: '10px 11px', marginBottom: 8 }}>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontFamily: '"Galmuri11","Pretendard",sans-serif', fontSize: 12.5, color: t.ink, lineHeight: 1.3 }}>{s[0]}</div>
                <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 9.5, color: t.textSoft, marginTop: 3 }}>{s[1]}</div>
              </div>
              <div style={{ background: t.red, border: `2px solid ${t.ink}`, padding: '6px 8px', fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: t.ink, flexShrink: 0 }}>🎙</div>
            </div>
          ))}
        </div>
        <div style={{ margin: '15px 16px 0', background: t.mint, border: `3px solid ${t.ink}`, boxShadow: `3px 3px 0 0 ${t.mintShadow}`, padding: '12px 0', textAlign: 'center', fontFamily: '"DungGeunMo",monospace', fontSize: 13, color: t.ink }}>▶ 3분 드릴 시작</div>
      </Shell>
    );
  }

  Object.assign(window, { ScreenPronPractice, ScreenPronRecording, ScreenPronResult, ScreenPronDrill });
})();
