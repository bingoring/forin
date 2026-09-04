// forin-notebook.jsx — forin 메인 디벨롭 방향: "간호사 근무 수첩" 그림체
// · 줄노트 종이 배경 + 마스킹테이프 + 도장(스탬프) + 손글씨(Gaegu)
// · 아이콘: 펜 낙서(doodle) 스타일 — 가는 잉크 스트로크(1.7px) + 옅은 수채 필
const NB = { ink: '#3E362B', soft: '#9A8F7C', red: '#C75146', blue: '#4A6FA5', green: '#5F8D5A', wash: { red: 'rgba(199,81,70,.18)', blue: 'rgba(74,111,165,.18)', green: 'rgba(95,141,90,.2)', yellow: 'rgba(233,196,90,.3)', peach: 'rgba(233,150,100,.22)' } };

// ── 수첩 낙서 아이콘 세트 (24×24) ──
function NbIcon({ name, size = 20, color = NB.ink, style }) {
  const P = { stroke: color, strokeWidth: 1.7, strokeLinejoin: 'round', strokeLinecap: 'round', fill: 'none' };
  const G = {
    home: <g><path d="M4.5 11.5 L12 4.5 L19.5 11.5" {...P}/><path d="M6.5 10.5 V19 H17.5 V10.5" {...P}/><rect x="10" y="13.5" width="4" height="5.5" fill={NB.wash.yellow} {...P}/></g>,
    hospital: <g><rect x="5" y="5" width="14" height="14.5" rx="1.5" fill={NB.wash.blue} {...P}/><path d="M12 9 V15 M9 12 H15" stroke={NB.red} strokeWidth="2.4" strokeLinecap="round"/></g>,
    board: <g><rect x="6" y="4.5" width="12" height="15" rx="1.5" {...P}/><path d="M9.5 4.5 V3 H14.5 V4.5" {...P}/><path d="M9 10 H15 M9 13 H13.5 M9 16 H14.5" {...P}/><path d="M8.7 7.2 L10 8.3 L12 6" stroke={NB.green} strokeWidth="1.7" fill="none" strokeLinecap="round"/></g>,
    lab: <g><path d="M6 5.5 Q12 3.5 18 5.5 V18.5 Q12 16.5 6 18.5 Z" fill={NB.wash.green} {...P}/><path d="M12 4.8 V17.3" {...P}/><path d="M8 9 Q10 8.4 10.5 8.6 M8 12 Q10 11.4 10.5 11.6" {...P}/></g>,
    me: <g><circle cx="12" cy="9" r="4" fill={NB.wash.peach} {...P}/><path d="M5.5 19.5 Q6 14 12 14 Q18 14 18.5 19.5" fill={NB.wash.blue} {...P}/></g>,
    mic: <g><rect x="9.5" y="4" width="5" height="9" rx="2.5" fill={NB.wash.red} {...P}/><path d="M6.5 11 Q12 16.5 17.5 11" {...P}/><path d="M12 14.8 V18.5 M9.5 18.5 H14.5" {...P}/></g>,
    speaker: <g><path d="M5 10 H8 L12.5 5.8 V18.2 L8 14 H5 Z" fill={NB.wash.blue} {...P}/><path d="M15.5 9.5 Q17 12 15.5 14.5 M18 7 Q20.7 12 18 17" {...P}/></g>,
    siren: <g><path d="M7.5 14.5 A4.5 4.5 0 0 1 16.5 14.5" fill={NB.wash.red} {...P}/><path d="M5.5 14.5 H18.5 V17.5 H5.5 Z" {...P}/><path d="M12 4.5 V7 M6.5 6.5 L8.2 8.6 M17.5 6.5 L15.8 8.6" stroke={NB.red} strokeWidth="1.7" strokeLinecap="round"/></g>,
    scalpel: <g><path d="M5 17.5 C9 16.5 13 13.5 16 9.8 L18.7 6.2 C19.6 7.3 19.4 8.8 18.4 10.2 C15.4 14.2 10.4 17 5 17.5 Z" fill={NB.wash.blue} {...P}/><path d="M15.8 9.5 L17.8 11.4" {...P}/></g>,
    baby: <g><circle cx="12" cy="13" r="6" fill={NB.wash.peach} {...P}/><path d="M12 7 Q11.2 4.8 13.4 4.2" {...P}/><circle cx="10" cy="12.5" r="0.7" fill={NB.ink} stroke="none"/><circle cx="14" cy="12.5" r="0.7" fill={NB.ink} stroke="none"/><path d="M10.8 15.4 Q12 16.4 13.2 15.4" {...P}/></g>,
    monitor: <g><rect x="4.5" y="6" width="15" height="10.5" rx="1.5" fill={NB.wash.blue} {...P}/><path d="M7 11.5 H9.2 L10.6 9 L12.4 13.8 L13.8 11.5 H17" stroke={NB.green} strokeWidth="1.7" fill="none" strokeLinejoin="round" strokeLinecap="round"/><path d="M10 19 H14" {...P}/></g>,
    pill: <g transform="rotate(-32 12 12)"><rect x="4.5" y="9" width="15" height="6" rx="3" {...P}/><path d="M12 9 V15" {...P}/><path d="M12.4 9.5 H16 A2.6 2.6 0 0 1 16 14.5 H12.4 Z" fill={NB.wash.green} stroke="none"/></g>,
    bandage: <g transform="rotate(-28 12 12)"><rect x="4" y="9" width="16" height="6" rx="3" fill={NB.wash.peach} {...P}/><path d="M9.3 9 V15 M14.7 9 V15" {...P}/><circle cx="11.3" cy="11" r="0.5" fill={NB.ink} stroke="none"/><circle cx="12.7" cy="13" r="0.5" fill={NB.ink} stroke="none"/><circle cx="12.7" cy="11" r="0.5" fill={NB.ink} stroke="none"/><circle cx="11.3" cy="13" r="0.5" fill={NB.ink} stroke="none"/></g>,
    bell: <g><path d="M12 4.5 Q7 5.5 7 11 L6 15.5 H18 L17 11 Q17 5.5 12 4.5 Z" fill={NB.wash.yellow} {...P}/><path d="M10.3 18 Q12 19.6 13.7 18" {...P}/></g>,
    star: <g><path d="M12 4 L14 9.3 L19.5 9.6 L15.2 13 L16.7 18.5 L12 15.3 L7.3 18.5 L8.8 13 L4.5 9.6 L10 9.3 Z" fill={NB.wash.yellow} {...P}/></g>,
    magnify: <g><circle cx="10.5" cy="10.5" r="5.5" fill={NB.wash.blue} {...P}/><path d="M14.7 14.7 L19 19" {...P}/></g>,
    bulb: <g><circle cx="12" cy="9.5" r="5" fill={NB.wash.yellow} {...P}/><path d="M10.2 16 H13.8 M10.7 18.3 H13.3" {...P}/><path d="M11 14.5 L11 12.5 M13 14.5 L13 12.5" {...P}/><path d="M12 2 V3.2 M5.5 5 L6.6 6 M18.5 5 L17.4 6" stroke={NB.ink} strokeWidth="1.4" strokeLinecap="round"/></g>,
    trophy: <g><path d="M8 5 H16 V10 A4 4 0 0 1 8 10 Z" fill={NB.wash.yellow} {...P}/><path d="M8 6.5 H5.5 A2.5 2.5 0 0 0 8 9.5 M16 6.5 H18.5 A2.5 2.5 0 0 1 16 9.5" {...P}/><path d="M12 14 V16.5 M9 19 H15 M10 19 Q10 16.5 12 16.5 Q14 16.5 14 19" {...P}/></g>,
    speech: <g><path d="M4.5 6.5 Q4.5 4.5 6.5 4.5 H17.5 Q19.5 4.5 19.5 6.5 V13 Q19.5 15 17.5 15 H10 L6 18.5 V15 Q4.5 15 4.5 13 Z" fill={NB.wash.blue} {...P}/><path d="M8 8.5 H16 M8 11.5 H13" {...P}/></g>,
    compass: <g><circle cx="12" cy="12" r="7.5" fill={NB.wash.yellow} {...P}/><path d="M14.8 9.2 L13 13 L9.2 14.8 L11 11 Z" fill={NB.wash.red} {...P}/><circle cx="12" cy="12" r="0.8" fill={NB.ink} stroke="none"/></g>,
    chartup: <g><path d="M4.5 4.5 V19 H19.5" {...P}/><path d="M7.5 15.5 L11 11.5 L13.5 13.5 L18.5 7" stroke={NB.green} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/><path d="M15.5 6.5 H18.8 V9.8" stroke={NB.green} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></g>,
    shield: <g><path d="M12 3.5 L19 6 V12 Q19 17.5 12 20.5 Q5 17.5 5 12 V6 Z" fill={NB.wash.blue} {...P}/><path d="M8.8 12 L11.2 14.4 L15.5 9.5" {...P}/></g>,
    handshake2: <g><path d="M2 8 L8 6.5 L12 10.5 L16 6.5 L22 8" {...P}/><path d="M8 6.5 V13 Q8 15 10 15 H14 Q16 15 16 13 V6.5" {...P}/><path d="M10 10.5 L12 12.5 L14 10.5" {...P}/></g>,
    pushpin: <g><path d="M9 3.5 H15 L14 9 H10 Z" fill={NB.wash.red} {...P}/><path d="M7.5 9 H16.5 L15.5 12 H8.5 Z" fill={NB.wash.red} {...P}/><path d="M12 12 V19.5" {...P}/></g>,
    dice: <g><rect x="4.5" y="4.5" width="15" height="15" rx="3" fill={NB.wash.yellow} {...P}/><circle cx="9" cy="9" r="1.4" fill={NB.ink}/><circle cx="15" cy="9" r="1.4" fill={NB.ink}/><circle cx="12" cy="12" r="1.4" fill={NB.ink}/><circle cx="9" cy="15" r="1.4" fill={NB.ink}/><circle cx="15" cy="15" r="1.4" fill={NB.ink}/></g>,
    pager: <g><rect x="3.5" y="7" width="17" height="11" rx="2" fill={NB.wash.yellow} {...P}/><rect x="6.5" y="9.8" width="7.5" height="5" rx="1" fill="#fff" {...P} strokeWidth="1.4"/><circle cx="17.3" cy="12.5" r="1.1" fill={NB.ink}/><path d="M17.5 4 Q19.8 4.8 20.5 7 M15.5 5.2 Q17 5.8 17.5 7" {...P} fill="none"/></g>,
    run: <g><circle cx="15" cy="5.3" r="2.1" fill={NB.wash.red} {...P}/><path d="M8 10.5 L13 9 L14.5 12.5 L11.5 15 L13 19.5 M14.5 12.5 L18 14.5 M11.5 15 L7.5 17.5 M5.5 12.5 L8.8 11.8" {...P} fill="none"/></g>,
    fire: <g><path d="M12 3.5 C13 6.8 16.5 8.3 16.5 12.8 C16.5 16.5 14.6 19 12 19 C9.4 19 7.5 16.5 7.5 12.8 C7.5 10.4 8.9 8.7 9.9 7.2 C10.3 8.5 11.2 9.1 11.2 9.1 C11.2 7 11.5 5 12 3.5 Z" fill={NB.wash.red} {...P}/><path d="M12 11.8 C13.2 13.2 13.8 14.2 13.8 15.5 C13.8 16.9 13 17.8 12 17.8 C11 17.8 10.2 16.9 10.2 15.5 C10.2 14.2 10.9 13.1 12 11.8 Z" fill={NB.wash.yellow} stroke="none"/></g>,
    stetho: <g><path d="M7 3.5 V9 Q7 13 11 13 Q15 13 15 9 V3.5" {...P}/><path d="M6 3 H8.2 M13.8 3 H16" {...P}/><path d="M11 13 V15.5 Q11 18 14 18 Q17 18 17 15.5" {...P}/><circle cx="17" cy="13.5" r="2.6" fill={NB.wash.yellow} {...P}/></g>,
    plane: <g><path d="M3 13.5 L20 7 L15.5 15 L10 14 Z" fill={NB.wash.blue} {...P}/><path d="M10 14 L9 18 L11.7 14.9" {...P}/><path d="M20 7 L10 12.5" {...P}/></g>,
    coffee: <g><path d="M5.5 8.5 H16 V15 Q16 18.5 10.75 18.5 Q5.5 18.5 5.5 15 Z" fill={NB.wash.peach} {...P}/><path d="M16 10 H18 Q19.8 10 19.8 12 Q19.8 14 18 14 H16" {...P}/><path d="M8.5 3.5 Q7.5 5 8.5 6.5 M12 3.5 Q11 5 12 6.5" {...P}/></g>,
    gear: <g><path d="M12 3.5 V6 M12 18 V20.5 M3.5 12 H6 M18 12 H20.5 M6 6 L7.8 7.8 M16.2 16.2 L18 18 M18 6 L16.2 7.8 M7.8 16.2 L6 18" {...P}/><circle cx="12" cy="12" r="5" fill={NB.wash.blue} {...P}/><circle cx="12" cy="12" r="1.6" fill={NB.ink} stroke="none"/></g>,
    calendar: <g><rect x="4.5" y="5.5" width="15" height="14" rx="1.5" fill={NB.wash.yellow} {...P}/><path d="M4.5 9.5 H19.5" {...P}/><path d="M8.5 3.5 V7 M15.5 3.5 V7" {...P}/><circle cx="9" cy="13" r="0.8" fill={NB.ink} stroke="none"/><circle cx="12.5" cy="13" r="0.8" fill={NB.ink} stroke="none"/><circle cx="16" cy="13" r="0.8" fill={NB.ink} stroke="none"/><circle cx="9" cy="16.3" r="0.8" fill={NB.ink} stroke="none"/></g>,
    lock: <g><rect x="6.5" y="10.5" width="11" height="8.5" rx="1.5" fill={NB.wash.yellow} {...P}/><path d="M8.5 10.5 V8 A3.5 3.5 0 0 1 15.5 8 V10.5" {...P}/><circle cx="12" cy="14" r="1.1" fill={NB.ink} stroke="none"/><path d="M12 15 V16.8" {...P}/></g>,
    pencil: <g><path d="M14.5 5 L19 9.5 L9.5 19 L4.8 19.2 L5 14.5 Z" fill={NB.wash.yellow} {...P}/><path d="M12.8 6.7 L17.3 11.2" {...P}/><path d="M5 14.5 L9.5 19" {...P}/></g>,
  };
  return <svg viewBox="0 0 24 24" width={size} height={size} style={{ display: 'inline-block', verticalAlign: '-0.18em', flexShrink: 0, ...style }}>{G[name] || G.star}</svg>;
}

// ══ 홈 화면 ══════════════════════════════════════════════
function HomeScrapbook() {
  const c = { bg: '#F1EBDD', paper: '#FFFdf4', ink: '#3E362B', soft: '#9A8F7C', red: '#C75146', blue: '#4A6FA5', green: '#5F8D5A', tape: 'rgba(160,200,220,.55)' };
  const HW = '"Gaegu","Nanum Pen Script",cursive';
  const F = '"Pretendard",sans-serif';
  const paper = (rot=0) => ({ background: c.paper, border: `1px solid #E0D6C0`, boxShadow: '0 2px 6px rgba(62,54,43,.14)', transform: `rotate(${rot}deg)`, position: 'relative' });
  const tape = (l, rot=-4) => <div style={{ position: 'absolute', top: -10, left: l, width: 74, height: 20, background: c.tape, transform: `rotate(${rot}deg)`, boxShadow: '0 1px 2px rgba(0,0,0,.08)' }}/>;
  return (
    <div style={{ boxSizing: 'border-box', width: 402, height: 874, background: c.bg, backgroundImage: 'repeating-linear-gradient(transparent 0 27px, rgba(62,54,43,.06) 27px 28px)', borderRadius: 40, overflow: 'hidden', position: 'relative', fontFamily: F }} data-screen-label="수첩 홈">
      <div style={{ height: 44, display: 'flex', alignItems: 'center', padding: '0 24px', fontSize: 14, fontWeight: 700, color: c.ink }}>9:41<div style={{ flex: 1 }}/>▮▮▮</div>
      <div style={{ position: 'absolute', top: 44, left: 0, right: 0, bottom: 78, overflowY: 'auto', padding: '12px 20px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontFamily: HW, fontSize: 30, color: c.ink, lineHeight: 1.1 }}>지민의 근무 수첩</div>
            <div style={{ fontFamily: HW, fontSize: 16, color: c.soft, marginTop: 2 }}>9월 1일 · 데이 근무 · D-142</div>
          </div>
          <div style={{ flex: 1 }}/>
          {/* 스탬프 — 연속 출근 도장 */}
          <div style={{ width: 72, height: 72, borderRadius: '50%', border: `3px double ${c.red}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: c.red, transform: 'rotate(9deg)', opacity: .85 }}>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1 }}>연속출근</div>
            <div style={{ fontFamily: HW, fontSize: 24, lineHeight: 1 }}>12일</div>
          </div>
        </div>
        <div style={{ ...paper(-0.7), marginTop: 16, padding: '18px 16px 14px' }}>
          {tape(120)}
          <div style={{ fontSize: 11, fontWeight: 800, color: c.blue, letterSpacing: 1 }}>☐ 오늘의 할 일</div>
          <div style={{ fontFamily: HW, fontSize: 21, color: c.ink, marginTop: 7, lineHeight: 1.3 }}>3병동 인계 — SBAR로<br/>승압제 보고하기</div>
          <div style={{ display: 'flex', gap: 9, marginTop: 12 }}>
            <div style={{ background: c.ink, color: c.paper, padding: '10px 22px', fontSize: 13.5, fontWeight: 700, borderRadius: 3, boxShadow: '2px 2px 0 rgba(62,54,43,.25)' }}>시작하기 ✎</div>
            <div style={{ border: `1.5px dashed ${c.soft}`, padding: '10px 14px', fontSize: 12.5, color: c.soft, borderRadius: 3 }}><NbIcon name="mic" size={15}/> 발음 연습</div>
          </div>
        </div>
        <div style={{ ...paper(0.9), marginTop: 17, padding: '13px 15px', background: '#FFF3EE', borderColor: '#EBCDBd' }}>
          {tape(200, 5)}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ fontFamily: HW, fontSize: 24, color: c.red, flexShrink: 0 }}>!!</div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: c.red }}>호출 쪽지 · 43분 남음</div>
              <div style={{ fontFamily: HW, fontSize: 16, color: c.ink, marginTop: 2 }}>“3병동 환자 통증 호소! 응답 바람” <span style={{ color: c.soft, fontSize: 13 }}>(+40 XP)</span></div>
            </div>
            <div style={{ border: `2px solid ${c.red}`, color: c.red, padding: '7px 11px', fontSize: 12.5, fontWeight: 800, borderRadius: 3, transform: 'rotate(2deg)', flexShrink: 0 }}>응답!</div>
          </div>
        </div>
        <div style={{ marginTop: 18, fontFamily: HW, fontSize: 19, color: c.ink }}>✂ 과별 출근 카드</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 11, marginTop: 9 }}>
          {[['siren','ER',-1.5],['scalpel','OR',1],['baby','소아과',-0.5],['monitor','ICU',1.5],['pill','약국',-1],['bandage','외과',0.7]].map((d,i)=>(
            <div key={i} style={{ ...paper(d[2]), padding: '13px 0 10px', textAlign: 'center' }}>
              <div style={{ height: 24 }}><NbIcon name={d[0]} size={23}/></div>
              <div style={{ fontFamily: HW, fontSize: 15, color: c.ink, marginTop: 3 }}>{d[1]}</div>
            </div>
          ))}
        </div>
        <div style={{ ...paper(-0.5), marginTop: 17, padding: '14px 16px' }}>
          {tape(30, -6)}
          <div style={{ fontSize: 11, fontWeight: 800, color: c.green, letterSpacing: 1 }}>오늘의 문장 — 형광펜 쫙</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: c.ink, marginTop: 7, lineHeight: 1.55 }}>
            <mark style={{ background: 'linear-gradient(transparent 55%, #F9E37B 55%)', padding: '0 2px' }}>On a scale of 0 to 10, how bad is your pain?</mark>
          </div>
          <div style={{ fontFamily: HW, fontSize: 15, color: c.soft, marginTop: 5 }}>0에서 10까지, 통증이 얼마나 심한가요?</div>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 68, background: c.paper, borderTop: `1.5px solid #E0D6C0`, display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '0 8px 8px' }}>
        {[['home','홈',true],['hospital','일터',false],['board','상황판',false],['lab','리뷰랩',false],['me','나',false]].map((t,i)=>(
          <div key={i} style={{ textAlign: 'center', opacity: t[2] ? 1 : .55 }}>
            <div style={{ height: 20 }}><NbIcon name={t[0]} size={19}/></div>
            <div style={{ fontFamily: HW, fontSize: 13, color: c.ink }}>{t[1]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}



Object.assign(window, { NB, NbIcon, HomeScrapbook });
