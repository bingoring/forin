// forin-notebook-pron.jsx — 발음 연습 2상태 (수첩 그림체)
// A 대기: 문장 카드(IPA + 원어민 듣기 + 회차) · 주의 메모 · 큰 녹음 버튼 · 회차 점수
// B 녹음 중: 어두운 화면 · 문장 쪽지 · REC 파형 · 끝내기 버튼
(function () {
  const c = { bg: '#F1EBDD', paper: '#FFFdf4', ink: '#3E362B', soft: '#9A8F7C', red: '#C75146', blue: '#4A6FA5', green: '#5F8D5A', tape: 'rgba(160,200,220,.55)' };
  const HW = '"Gaegu","Nanum Pen Script",cursive';
  const F = '"Pretendard",sans-serif';
  const MONO = '"IBM Plex Mono",monospace';
  const NbIcon = window.NbIcon;
  const paper = (rot = 0) => ({ background: c.paper, border: `1px solid #E0D6C0`, boxShadow: '0 2px 6px rgba(62,54,43,.14)', transform: `rotate(${rot}deg)`, position: 'relative' });

  // ── A · 발음 연습 대기 ──
  function PronReady() {
    return (
      <div style={{ boxSizing: 'border-box', width: 402, height: 874, background: c.bg, backgroundImage: 'repeating-linear-gradient(transparent 0 27px, rgba(62,54,43,.06) 27px 28px)', borderRadius: 40, overflow: 'hidden', position: 'relative', fontFamily: F }} data-screen-label="수첩 발음 연습">
        <div style={{ height: 44, display: 'flex', alignItems: 'center', padding: '0 24px', fontSize: 14, fontWeight: 700, color: c.ink }}>9:41<div style={{ flex: 1 }}/>▮▮▮</div>
        <div style={{ position: 'absolute', top: 52, left: 18, right: 18, display: 'flex', alignItems: 'center' }}>
          <div style={{ ...paper(-1), width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HW, fontSize: 16, color: c.ink }}>‹</div>
          <div style={{ flex: 1 }}/>
          <div style={{ ...paper(1), padding: '5px 11px', fontFamily: HW, fontSize: 14, color: c.ink, background: 'rgba(95,141,90,.18)' }}><NbIcon name="mic" size={14}/> 발음</div>
        </div>
        <div style={{ position: 'absolute', top: 108, left: 0, right: 0, bottom: 0, overflowY: 'auto', padding: '0 20px 24px' }}>
          <div style={{ fontFamily: HW, fontSize: 28, color: c.ink }}>발음 연습장</div>
          {/* 문장 카드 */}
          <div style={{ ...paper(-0.5), marginTop: 12, padding: '15px 16px 13px' }}>
            <div style={{ position: 'absolute', top: -11, left: 14, background: c.ink, color: c.paper, fontFamily: HW, fontSize: 13, padding: '1px 9px', transform: 'rotate(-1.5deg)' }}>따라 말해보세요</div>
            <div style={{ fontSize: 19, fontWeight: 700, color: c.ink, marginTop: 4, lineHeight: 1.5 }}>I'm giving you acetaminophen 650 milligrams.</div>
            <div style={{ fontFamily: MONO, fontSize: 11, color: c.soft, marginTop: 8, lineHeight: 1.6 }}>/aɪm ˈɡɪvɪŋ ju əˌsiːtəˈmɪnəfən sɪks ˈfɪfti ˈmɪlɪɡræmz/</div>
            <div style={{ marginTop: 8, display: 'flex', gap: 6 }}>
              <span style={{ fontFamily: HW, fontSize: 14, color: c.ink, background: 'rgba(233,196,90,.4)', padding: '0 4px', border: `1.3px dashed #C77E2E` }}>ˌsiːtəˈmɪ</span>
              <span style={{ fontSize: 10.5, color: '#C77E2E', alignSelf: 'center' }}>← 지난번 약했던 부분</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: 12 }}>
              <div style={{ ...paper(0.5), display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 12px', fontFamily: HW, fontSize: 14.5, color: c.ink, background: 'rgba(143,199,232,.3)' }}><NbIcon name="speaker" size={15}/> 원어민</div>
              <div style={{ flex: 1 }}/>
              <span style={{ fontFamily: HW, fontSize: 14, color: c.soft }}>3회 중 3회차</span>
            </div>
          </div>
          {/* 주의 메모 */}
          <div style={{ marginTop: 15, padding: '9px 12px', background: '#FFF3EE', border: `1.5px dashed #D9A08E`, transform: 'rotate(0.4deg)', fontFamily: HW, fontSize: 14.5, color: c.ink, lineHeight: 1.45 }}>
            <b style={{ color: c.red }}>주의!</b> 약물명과 용량은 잘못 들리면 <b style={{ color: c.red }}>투약 사고</b>로 이어져요. 음절을 끊어서 또박또박.
          </div>
          {/* 녹음 버튼 */}
          <div style={{ textAlign: 'center', marginTop: 26 }}>
            <div style={{ display: 'inline-block', position: 'relative' }}>
              <div style={{ width: 96, height: 96, background: 'rgba(199,81,70,.2)', border: `2px solid ${c.ink}`, borderRadius: '50%', boxShadow: '3px 3px 0 rgba(62,54,43,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-2deg)' }}>
                <NbIcon name="mic" size={42}/>
              </div>
              <div style={{ position: 'absolute', top: -7, right: -13, fontFamily: HW, fontSize: 13, color: c.red, transform: 'rotate(8deg)' }}>꾹!</div>
            </div>
            <div style={{ fontFamily: HW, fontSize: 17, color: c.ink, marginTop: 9 }}>눌러서 녹음</div>
            <div style={{ fontSize: 11, color: c.soft, marginTop: 2 }}>조용한 곳에서 · 최대 10초</div>
          </div>
          {/* 회차 점수 */}
          <div style={{ ...paper(0.4), marginTop: 24, padding: '13px 15px' }}>
            <div style={{ fontFamily: HW, fontSize: 16, color: c.ink }}><NbIcon name="chartup" size={15}/> 이 문장 내 점수</div>
            {[['1차', 62, '#C77E2E'], ['2차', 74, c.blue], ['3차', 89, c.green]].map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: i ? 7 : 10 }}>
                <span style={{ fontFamily: HW, fontSize: 14, color: c.soft, width: 24, flexShrink: 0 }}>{r[0]}</span>
                <div style={{ flex: 1, height: 10, border: `1.5px solid ${c.ink}`, borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ width: `${r[1]}%`, height: '100%', background: `repeating-linear-gradient(-45deg, ${r[2]}55 0 5px, ${r[2]}33 5px 10px)` }}/>
                </div>
                <span style={{ fontFamily: MONO, fontSize: 12.5, fontWeight: 700, color: c.ink, width: 24, textAlign: 'right', flexShrink: 0 }}>{r[1]}</span>
              </div>
            ))}
            <div style={{ marginTop: 9, fontFamily: HW, fontSize: 13, color: c.green }}>↑ 27점 올랐어요 — 이 기세로 한 번 더!</div>
          </div>
        </div>
      </div>
    );
  }

  // ── B · 녹음 중 (듣고 있어요) ──
  function PronRecording() {
    const bars = [4,7,10,14,9,6,11,15,12,8,5,9,13,10,7,12,16,11,8,6,10,14,9,5,8];
    return (
      <div style={{ boxSizing: 'border-box', width: 402, height: 874, background: '#2E2823', borderRadius: 40, overflow: 'hidden', position: 'relative', fontFamily: F }} data-screen-label="수첩 발음 녹음중">
        <div style={{ height: 44, display: 'flex', alignItems: 'center', padding: '0 24px', fontSize: 14, fontWeight: 700, color: '#F1EBDD' }}>9:41<div style={{ flex: 1 }}/>▮▮▮</div>
        <div style={{ position: 'absolute', top: 52, left: 18, right: 18, display: 'flex', alignItems: 'center' }}>
          <div style={{ width: 32, height: 32, background: '#F1EBDD', border: `1px solid #E0D6C0`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HW, fontSize: 16, color: c.ink, transform: 'rotate(-1deg)' }}>‹</div>
          <div style={{ flex: 1 }}/>
          <div style={{ background: 'rgba(95,141,90,.35)', border: `1px solid #5F8D5A`, padding: '5px 11px', fontFamily: HW, fontSize: 14, color: '#DCEBd2', transform: 'rotate(1deg)' }}>발음</div>
        </div>
        <div style={{ position: 'absolute', top: 116, left: 20, right: 20 }}>
          <div style={{ fontFamily: HW, fontSize: 26, color: '#F1EBDD' }}>듣고 있어요…</div>
          {/* 문장 쪽지 */}
          <div style={{ ...paper(-0.6), marginTop: 14, padding: '14px 16px', textAlign: 'center' }}>
            <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%) rotate(-3deg)', width: 70, height: 18, background: c.tape }}/>
            <div style={{ fontSize: 16.5, fontWeight: 700, color: c.ink, lineHeight: 1.5 }}>I'm giving you acetaminophen 650 milligrams.</div>
          </div>
          {/* REC 패널 */}
          <div style={{ marginTop: 16, background: '#1D2B33', border: `1.5px solid #0F1B21`, borderRadius: 4, padding: '18px 14px 12px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 3, height: 44 }}>
              {bars.map((h, i) => <div key={i} style={{ width: 3.5, height: h * 2.4, background: i % 4 === 0 ? '#8FC7E8' : '#4E7A8E', borderRadius: 1 }}/>)}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: 12 }}>
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#E4574B', marginRight: 7 }}/>
              <span style={{ fontFamily: MONO, fontSize: 12, fontWeight: 700, color: '#8FC7E8' }}>REC 00:03</span>
              <div style={{ flex: 1 }}/>
              <span style={{ fontFamily: HW, fontSize: 14, color: '#9BA8A0' }}>남은 7초</span>
            </div>
          </div>
          {/* 진행 눈금 — 형광펜 채움 */}
          <div style={{ display: 'flex', gap: 4, marginTop: 16 }}>
            {Array.from({ length: 26 }).map((_, i) => (
              <div key={i} style={{ flex: 1, height: 26, background: i < 9 ? 'rgba(168,217,151,.85)' : '#F1EBDD', border: '1px solid #171310', transform: `rotate(${i % 2 ? 1.5 : -1.5}deg)` }}/>
            ))}
          </div>
          {/* 끝내기 */}
          <div style={{ textAlign: 'center', marginTop: 44 }}>
            <div style={{ display: 'inline-flex', width: 92, height: 92, background: '#F1EBDD', border: `1px solid #E0D6C0`, alignItems: 'center', justifyContent: 'center', transform: 'rotate(-1.5deg)', boxShadow: '0 3px 8px rgba(0,0,0,.35)' }}>
              <div style={{ width: 30, height: 30, background: '#2E2823' }}/>
            </div>
            <div style={{ fontFamily: HW, fontSize: 17, color: '#F1EBDD', marginTop: 10 }}>눌러서 끝내기</div>
          </div>
        </div>
      </div>
    );
  }

  // ── C · 발음 채점 ──
  function PronScore() {
    const syl = (t, grade) => (
      <span style={{ display: 'inline-block', fontFamily: MONO, fontSize: 11.5, fontWeight: 700, color: c.ink, padding: '4px 7px', border: `1.4px solid ${c.ink}`, borderRadius: 2, background: grade === 'good' ? 'rgba(168,217,151,.7)' : grade === 'mid' ? 'rgba(249,227,123,.7)' : 'rgba(244,164,155,.7)', transform: `rotate(${(t.length % 3) - 1}deg)` }}>{t}</span>
    );
    const S = [['aɪm','good'],['ˈɡɪ','good'],['vɪŋ','good'],['ju','good'],['ə','mid'],['ˌsiː','bad'],['tə','bad'],['ˈmɪ','bad'],['nə','mid'],['fən','good'],['sɪks','good'],['ˈfɪf','good'],['ti','good'],['ˈmɪ','good'],['lɪ','mid'],['ɡræmz','good']];
    const fix = (ipa, tip, rot) => (
      <div style={{ ...paper(rot), marginTop: 10, padding: '11px 13px', display: 'flex', alignItems: 'center', gap: 11 }}>
        <span style={{ fontFamily: MONO, fontSize: 12, fontWeight: 700, color: c.ink, background: 'rgba(244,164,155,.7)', border: `1.4px solid ${c.ink}`, borderRadius: 2, padding: '5px 8px', flexShrink: 0, transform: 'rotate(-2deg)' }}>{ipa}</span>
        <div style={{ minWidth: 0, flex: 1, fontFamily: HW, fontSize: 15.5, color: c.ink, lineHeight: 1.35 }}>{tip}</div>
        <div style={{ ...paper(1.5), width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: 'rgba(143,199,232,.3)' }}><NbIcon name="speaker" size={16}/></div>
      </div>
    );
    return (
      <div style={{ boxSizing: 'border-box', width: 402, height: 874, background: c.bg, backgroundImage: 'repeating-linear-gradient(transparent 0 27px, rgba(62,54,43,.06) 27px 28px)', borderRadius: 40, overflow: 'hidden', position: 'relative', fontFamily: F }} data-screen-label="수첩 발음 채점">
        <div style={{ height: 44, display: 'flex', alignItems: 'center', padding: '0 24px', fontSize: 14, fontWeight: 700, color: c.ink }}>9:41<div style={{ flex: 1 }}/>▎▎▎</div>
        <div style={{ position: 'absolute', top: 52, left: 18, right: 18, display: 'flex', alignItems: 'center', zIndex: 5 }}>
          <div style={{ ...paper(-1), width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HW, fontSize: 16, color: c.ink }}>‹</div>
          <div style={{ flex: 1 }}/>
          <div style={{ ...paper(1), padding: '5px 11px', fontFamily: HW, fontSize: 14, color: c.ink, background: 'rgba(95,141,90,.18)' }}><NbIcon name="mic" size={14}/> 발음</div>
        </div>
        <div style={{ position: 'absolute', top: 104, left: 0, right: 0, bottom: 0, overflowY: 'auto', padding: '0 20px 24px' }}>
          <div style={{ fontFamily: HW, fontSize: 28, color: c.ink }}>발음 채점표</div>
          {/* 총점 + 3지표 */}
          <div style={{ ...paper(-0.5), marginTop: 12, padding: '13px 15px', display: 'flex', gap: 14, alignItems: 'center', background: 'rgba(168,217,151,.35)' }}>
            <div style={{ textAlign: 'center', flexShrink: 0, paddingRight: 13, borderRight: `1.5px dashed rgba(62,54,43,.3)` }}>
              <div style={{ fontFamily: HW, fontSize: 40, color: c.ink, lineHeight: 1 }}>78</div>
              <div style={{ fontFamily: MONO, fontSize: 10, fontWeight: 700, color: c.soft }}>/ 100</div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              {[['정확도', 72, c.green], ['유창성', 81, c.blue], ['억양', 84, '#C77E2E']].map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: i ? 6 : 0 }}>
                  <span style={{ fontFamily: HW, fontSize: 13.5, color: c.ink, width: 42, flexShrink: 0 }}>{r[0]}</span>
                  <div style={{ flex: 1, height: 9, border: `1.4px solid ${c.ink}`, borderRadius: 2, overflow: 'hidden', background: c.paper }}>
                    <div style={{ width: `${r[1]}%`, height: '100%', background: `repeating-linear-gradient(-45deg, ${r[2]}66 0 5px, ${r[2]}3d 5px 10px)` }}/>
                  </div>
                  <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 700, color: c.ink, width: 20, textAlign: 'right', flexShrink: 0 }}>{r[1]}</span>
                </div>
              ))}
            </div>
          </div>
          {/* 음절별 결과 */}
          <div style={{ ...paper(0.4), marginTop: 13, padding: '13px 15px' }}>
            <div style={{ fontFamily: HW, fontSize: 16, color: c.ink }}>음절별 결과</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
              {S.map((s, i) => <React.Fragment key={i}>{syl(s[0], s[1])}</React.Fragment>)}
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 12, fontFamily: HW, fontSize: 13, color: c.soft }}>
              <span><span style={{ display: 'inline-block', width: 9, height: 9, background: 'rgba(168,217,151,.9)', border: `1.2px solid ${c.ink}`, verticalAlign: '-1px' }}/> 좋아요</span>
              <span><span style={{ display: 'inline-block', width: 9, height: 9, background: 'rgba(249,227,123,.9)', border: `1.2px solid ${c.ink}`, verticalAlign: '-1px' }}/> 애매해요</span>
              <span><span style={{ display: 'inline-block', width: 9, height: 9, background: 'rgba(244,164,155,.9)', border: `1.2px solid ${c.ink}`, verticalAlign: '-1px' }}/> 다시!</span>
            </div>
          </div>
          {/* 속도 비교 패널 */}
          <div style={{ marginTop: 13, background: '#1D2B33', border: `1.5px solid #0F1B21`, borderRadius: 4, padding: '12px 14px' }}>
            <div style={{ fontFamily: HW, fontSize: 14, color: '#9BB8C6' }}>원어민 4.2초 대비 조금 빨라요</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 7 }}>
              <span style={{ background: 'rgba(168,217,151,.85)', fontFamily: MONO, fontSize: 10, fontWeight: 700, color: '#1D2B33', padding: '1px 6px' }}>내 발음</span>
              <span style={{ fontFamily: MONO, fontSize: 11, color: '#9BB8C6' }}>3.6초</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2.5, height: 26, marginTop: 8, justifyContent: 'center' }}>
              {[2,3,5,8,6,4,7,10,8,5,3,6,9,7,4,2,5,8,6,3].map((h, i) => <div key={i} style={{ width: 3, height: h * 2.2, background: i % 4 === 0 ? '#8FC7E8' : '#4E7A8E', borderRadius: 1 }}/>)}
            </div>
          </div>
          {/* 교정 포인트 */}
          <div style={{ marginTop: 15, fontFamily: HW, fontSize: 16, color: c.ink }}>— 교정 포인트 2 ———</div>
          {fix('ˌsiː', <span>혀끝을 윗잋몸에 붙였다 바람과 함께 떼요 — “씨”처럼 길게.</span>, -0.4)}
          {fix('ˈmɪ', <span>입을 반쯤만 벌리고 짧게 — /æ/처럼 넓히지 마세요.</span>, 0.4)}
          {/* 액션 */}
          <div style={{ display: 'flex', gap: 9, marginTop: 16 }}>
            <div style={{ ...paper(-0.5), flex: 1, padding: '11px 0', textAlign: 'center', fontFamily: HW, fontSize: 16, color: c.ink }}><NbIcon name="mic" size={15}/> 다시 녹음</div>
            <div style={{ flex: 1, background: c.ink, color: c.paper, borderRadius: 3, padding: '11px 0', textAlign: 'center', fontFamily: HW, fontSize: 16, boxShadow: '2px 2px 0 rgba(62,54,43,.3)', transform: 'rotate(0.4deg)' }}>다음 문장 ›</div>
          </div>
          <div style={{ marginTop: 11, border: `1.6px dashed #B9A8DC`, borderRadius: 3, padding: '10px 0', textAlign: 'center', fontFamily: HW, fontSize: 15, color: '#8A76B8', background: 'rgba(195,177,232,.12)' }}>☐ 약한 음소만 드릴하기</div>
          <div style={{ textAlign: 'center', fontFamily: HW, fontSize: 13, color: c.soft, marginTop: 6 }}>드릴 기능은 곷 제공돼요</div>
        </div>
      </div>
    );
  }

  Object.assign(window, { PronReady, PronRecording, PronScore });
})();
