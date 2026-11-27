// forin-notebook-ui.jsx — 수첩 공용 컴포넌트 킷 (NbUI)
// 화면마다 중복되던 paper/tape/stamp/버튼을 컴포넌트화. 모든 버튼은
// 누름 인터랙션(눌리면 가라앉고 그림자 사라짐) 내장. window.NbUI로 노출.
(function () {
  const NB = window.NB;
  const HW = '"Gaegu","Nanum Pen Script",cursive';
  const F = '"Pretendard",sans-serif';
  const MONO = '"IBM Plex Mono",monospace';
  const NbIcon = window.NbIcon;
  const PAPER_BG = '#FFFdf4', PAPER_BD = '#E0D6C0', CREAM = '#F1EBDD';

  // 전역 인터랙션 CSS (1회 주입)
  if (!document.getElementById('nb-ui-css')) {
    const s = document.createElement('style');
    s.id = 'nb-ui-css';
    s.textContent = `
.nb-press{cursor:pointer;transition:transform .06s ease,box-shadow .06s ease;user-select:none}
.nb-press:active{transform:translate(1.5px,2px) rotate(0deg)!important;box-shadow:none!important}
.nb-chip{cursor:pointer;transition:transform .06s ease}
.nb-chip:active{transform:scale(.94)!important}
`;
    document.head.appendChild(s);
  }

  // ── 종이 카드 ──
  function NbPaper({ rot = 0, tape, tapeLeft = 120, pinned, pinColor, bg, style, children }) {
    return (
      <div style={{ background: bg || PAPER_BG, border: `1px solid ${PAPER_BD}`, boxShadow: '0 2px 6px rgba(62,54,43,.14)', transform: `rotate(${rot}deg)`, position: 'relative', ...style }}>
        {tape && <NbTape left={tapeLeft}/>}
        {pinned && <NbPin left={typeof pinned === 'number' ? pinned : 150} color={pinColor}/>}
        {children}
      </div>
    );
  }
  function NbTape({ left = 120, rot = -4, width = 74 }) {
    return <div style={{ position: 'absolute', top: -10, left, width, height: 20, background: 'rgba(160,200,220,.55)', transform: `rotate(${rot}deg)`, boxShadow: '0 1px 2px rgba(0,0,0,.08)', pointerEvents: 'none' }}/>;
  }
  // 비스듬한 입체 압정
  function NbPin({ left = 150, color = NB.red, dark = '#8E3A32' }) {
    return (
      <div style={{ position: 'absolute', top: -11, left, width: 22, height: 24, zIndex: 2, pointerEvents: 'none' }}>
        <svg viewBox="0 0 22 24" width="22" height="24">
          <ellipse cx="12.5" cy="19.5" rx="4.5" ry="1.6" fill="rgba(62,54,43,.28)"/>
          <path d="M10.5 12.5 L13 17.5" stroke={NB.ink} strokeWidth="1.6" strokeLinecap="round"/>
          <path d="M7.5 9.5 L12.5 12.8 L11 14.6 L6.3 11.6 Z" fill={dark} stroke={NB.ink} strokeWidth="1.4" strokeLinejoin="round"/>
          <ellipse cx="8" cy="7" rx="6.2" ry="4.6" fill={color} stroke={NB.ink} strokeWidth="1.6" transform="rotate(-18 8 7)"/>
          <ellipse cx="6.2" cy="5.6" rx="2" ry="1.2" fill="rgba(255,255,255,.6)" transform="rotate(-18 6.2 5.6)"/>
        </svg>
      </div>
    );
  }

  // ── 버튼 — variant: ink(주CTA) / paper(보조) / dashed(옅은 액션) / danger ──
  function NbButton({ variant = 'ink', icon, iconColor, rot = 0, size = 'md', full, style, children }) {
    const pad = size === 'lg' ? '13px 22px' : size === 'sm' ? '5px 11px' : '9px 15px';
    const fs = size === 'lg' ? 18 : size === 'sm' ? 13 : 15.5;
    const V = {
      ink:    { background: NB.ink, color: PAPER_BG, border: `1px solid ${NB.ink}`, boxShadow: '2.5px 2.5px 0 rgba(62,54,43,.3)' },
      paper:  { background: PAPER_BG, color: NB.ink, border: `1px solid ${PAPER_BD}`, boxShadow: '0 2px 6px rgba(62,54,43,.14)' },
      yellow: { background: 'rgba(249,227,123,.55)', color: NB.ink, border: `1.7px solid ${NB.ink}`, boxShadow: '2px 2px 0 rgba(62,54,43,.25)' },
      dashed: { background: 'transparent', color: NB.soft, border: `1.5px dashed ${NB.soft}`, boxShadow: 'none' },
      danger: { background: 'transparent', color: NB.red, border: `2px solid ${NB.red}`, boxShadow: '2px 2px 0 rgba(199,81,70,.25)' },
    }[variant];
    return (
      <div className="nb-press" style={{ ...V, display: full ? 'block' : 'inline-block', textAlign: 'center', borderRadius: 3, padding: pad, fontFamily: HW, fontSize: fs, transform: `rotate(${rot}deg)`, whiteSpace: 'nowrap', ...style }}>
        {icon && <NbIcon name={icon} size={fs} color={iconColor || (variant === 'ink' ? PAPER_BG : NB.ink)} style={{ marginRight: 5 }}/>}
        {children}
      </div>
    );
  }

  // ── 태그/필 — nowrap 내장 ──
  function NbTag({ color = NB.ink, fill, rot = 0, style, children }) {
    return <span style={{ display: 'inline-block', fontFamily: HW, fontSize: 12.5, color: fill ? '#fff' : color, background: fill ? color : 'transparent', border: fill ? 'none' : `1.4px solid ${color}`, borderRadius: 2, padding: '0 6px', whiteSpace: 'nowrap', transform: `rotate(${rot}deg)`, ...style }}>{children}</span>;
  }
  // 필터 칩 (선택 토글)
  function NbChip({ on, rot = 0, children }) {
    return <span className="nb-chip" style={{ display: 'inline-block', background: on ? NB.ink : PAPER_BG, color: on ? PAPER_BG : NB.ink, border: `1px solid ${on ? NB.ink : PAPER_BD}`, boxShadow: '0 2px 6px rgba(62,54,43,.14)', padding: '4px 11px', fontFamily: HW, fontSize: 14, whiteSpace: 'nowrap', transform: `rotate(${rot}deg)` }}>{children}</span>;
  }
  // 잉크 스탬프 (층표 등)
  function NbInkStamp({ children }) {
    return <span style={{ background: NB.ink, color: PAPER_BG, fontFamily: HW, fontSize: 12, padding: '1px 7px', borderRadius: 2, whiteSpace: 'nowrap', flexShrink: 0 }}>{children}</span>;
  }
  // 이중선 원형 도장
  function NbStamp({ color = NB.red, rot = -8, size = 54, top, bottom }) {
    return (
      <div style={{ width: size, height: size, borderRadius: '50%', border: `3px double ${color}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color, transform: `rotate(${rot}deg)`, flexShrink: 0, opacity: .9 }}>
        {top && <div style={{ fontSize: size * 0.17, fontWeight: 800 }}>{top}</div>}
        {bottom && <div style={{ fontFamily: HW, fontSize: size * 0.32, lineHeight: 1 }}>{bottom}</div>}
      </div>
    );
  }
  // 형광펜
  function NbMark({ children }) {
    return <mark style={{ background: 'linear-gradient(transparent 55%, #F9E37B 55%)', padding: '0 2px', color: 'inherit' }}>{children}</mark>;
  }
  // 점선 메모
  function NbMemo({ color = NB.blue, rot = -0.3, style, children }) {
    return <div style={{ padding: '8px 11px', border: `1.4px dashed ${color}`, borderRadius: 3, fontFamily: HW, fontSize: 14, color: NB.ink, lineHeight: 1.45, background: `${color}10`, transform: `rotate(${rot}deg)`, ...style }}>{children}</div>;
  }
  // 빗금 연필 게이지
  function NbGauge({ value, color = NB.green, height = 10 }) {
    return (
      <div style={{ height, border: `1.5px solid ${NB.ink}`, borderRadius: 2, overflow: 'hidden', background: PAPER_BG }}>
        <div style={{ width: `${value}%`, height: '100%', background: `repeating-linear-gradient(-45deg, ${color}66 0 5px, ${color}3d 5px 10px)` }}/>
      </div>
    );
  }
  // 손그림 체크박스
  function NbCheck({ done, size = 19 }) {
    return (
      <div style={{ width: size, height: size, border: `1.7px solid ${done ? NB.green : NB.soft}`, borderRadius: 4, position: 'relative', flexShrink: 0, background: done ? 'rgba(95,141,90,.12)' : 'transparent' }}>
        {done && <svg viewBox="0 0 24 24" width={size + 3} height={size + 3} style={{ position: 'absolute', left: -1, top: -4 }}><path d="M5 12 L10 17 L20 5" fill="none" stroke={NB.green} strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round"/></svg>}
      </div>
    );
  }
  // 진행 네모칸 (커리큘럼 n/m)
  function NbProgSquares({ done, total, color = NB.green }) {
    return (
      <span style={{ display: 'inline-flex', gap: 2.5, verticalAlign: '-1px' }}>
        {Array.from({ length: total }).map((_, i) => (
          <span key={i} style={{ width: 8, height: 8, border: `1.3px solid ${i < done ? color : NB.soft}`, background: i < done ? `${color}59` : 'transparent', borderRadius: 1.5 }}/>
        ))}
      </span>
    );
  }
  // 밑줄 검색 필기란
  function NbSearchLine({ placeholder, right }) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 4px', borderBottom: `2px solid rgba(62,54,43,.45)` }}>
        <NbIcon name="magnify" size={16}/>
        <span style={{ fontFamily: HW, fontSize: 15, color: '#B4A88F', flex: 1, minWidth: 0 }}>{placeholder}</span>
        {right}
      </div>
    );
  }
  // 시트/영역 손잡이
  function NbGrabber({ style }) {
    return <div style={{ width: 52, height: 5, background: 'rgba(62,54,43,.25)', borderRadius: 99, margin: '7px auto', ...style }}/>;
  }
  // 인덱스 탭 (리뷰랩·일터 세그먼트)
  function NbIndexTabs({ tabs, active = 0 }) {
    const colors = ['rgba(244,164,155,.75)', 'rgba(143,199,232,.75)', 'rgba(168,217,151,.75)', 'rgba(249,227,123,.75)'];
    return (
      <div style={{ position: 'relative' }}>
        <div style={{ display: 'flex', gap: 3, alignItems: 'flex-end', padding: '0 6px' }}>
          {tabs.map((t, i) => {
            const on = i === active;
            return (
              <div key={i} className="nb-chip" style={{ flex: 1, position: 'relative', textAlign: 'center', fontFamily: HW, fontSize: on ? 16 : 14.5, color: NB.ink, background: on ? PAPER_BG : colors[i % 4], border: `1.4px solid ${on ? NB.ink : 'rgba(62,54,43,.35)'}`, borderBottom: on ? `1.4px solid ${PAPER_BG}` : '1.4px solid rgba(62,54,43,.35)', borderRadius: '8px 8px 0 0', padding: on ? '8px 0 6px' : '5px 0 3px', marginBottom: on ? -1.4 : 2, opacity: on ? 1 : .8, zIndex: on ? 2 : 1, transform: on ? 'none' : `rotate(${i % 2 ? 0.8 : -0.8}deg)`, whiteSpace: 'nowrap', boxShadow: on ? '0 -2px 5px rgba(62,54,43,.12)' : 'none' }}>
                {on && <div style={{ position: 'absolute', top: 4, left: '50%', transform: 'translateX(-50%)', width: 26, height: 5, background: 'rgba(160,200,220,.6)', borderRadius: 1 }}/>}
                {t[0]} {t[1] != null && <span style={{ fontSize: 11, opacity: .7 }}>{t[1]}</span>}
              </div>
            );
          })}
        </div>
        <div style={{ height: 0, borderTop: `1.4px solid ${NB.ink}`, position: 'relative', zIndex: 0 }}/>
      </div>
    );
  }
  // 폰 프레임 + 하단 탭
  function NbFrame({ label, active, nav = true, dark, children }) {
    return (
      <div style={{ boxSizing: 'border-box', width: 402, height: 874, background: dark ? '#2E2823' : CREAM, backgroundImage: dark ? 'none' : 'repeating-linear-gradient(transparent 0 27px, rgba(62,54,43,.06) 27px 28px)', borderRadius: 40, overflow: 'hidden', position: 'relative', fontFamily: F }} data-screen-label={label}>
        <div style={{ height: 44, display: 'flex', alignItems: 'center', padding: '0 24px', fontSize: 14, fontWeight: 700, color: dark ? CREAM : NB.ink }}>9:41<div style={{ flex: 1 }}/>▮▮▮</div>
        {children}
        {nav && (
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 68, background: PAPER_BG, borderTop: `1.5px solid ${PAPER_BD}`, display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '0 8px 8px', zIndex: 30 }}>
            {[['home','홈'],['hospital','일터'],['speech','라운지'],['lab','리뷰랩'],['me','나']].map((t, i) => (
              <div key={i} className="nb-chip" style={{ textAlign: 'center', opacity: t[1] === active ? 1 : .55 }}>
                <div style={{ height: 20 }}><NbIcon name={t[0]} size={19}/></div>
                <div style={{ fontFamily: HW, fontSize: 13, color: NB.ink, fontWeight: t[1] === active ? 700 : 400 }}>{t[1]}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── UI 킷 쇼케이스 아트보드 ──
  function ScreenNbKit() {
    const row = { display: 'flex', gap: 9, alignItems: 'center', flexWrap: 'wrap', marginTop: 9 };
    const lbl = (t) => <div style={{ fontFamily: MONO, fontSize: 10, fontWeight: 700, color: NB.soft, letterSpacing: 1, marginTop: 16 }}>{t}</div>;
    return (
      <div style={{ boxSizing: 'border-box', width: 402, minHeight: 874, background: CREAM, backgroundImage: 'repeating-linear-gradient(transparent 0 27px, rgba(62,54,43,.06) 27px 28px)', padding: '18px 20px 24px', fontFamily: F }}>
        <div style={{ fontFamily: HW, fontSize: 26, color: NB.ink }}>NbUI 컴포넌트 킷</div>
        <div style={{ fontSize: 11, color: NB.soft, marginTop: 2 }}>버튼은 눌러보세요 — 가라앉는 인터랙션 내장</div>
        {lbl('NBBUTTON — ink / paper / yellow / dashed / danger')}
        <div style={row}>
          <NbButton variant="ink" icon="pencil" iconColor="#FFFdf4">시작하기</NbButton>
          <NbButton variant="paper" icon="speaker">듣기</NbButton>
          <NbButton variant="yellow" icon="mic" size="sm">말하기</NbButton>
          <NbButton variant="dashed" size="sm">발음 연습</NbButton>
          <NbButton variant="danger" size="sm" rot={2}>응답!</NbButton>
        </div>
        {lbl('NBPAPER — tape / pinned')}
        <NbPaper rot={-0.5} tape style={{ marginTop: 12, padding: '11px 13px', fontFamily: HW, fontSize: 15, color: NB.ink }}>테이프 붙은 종이 카드</NbPaper>
        <NbPaper rot={0.5} pinned={40} pinColor={NB.blue} style={{ marginTop: 16, padding: '11px 13px', fontFamily: HW, fontSize: 15, color: NB.ink }}>압정 꽂힌 라운지 쪽지</NbPaper>
        {lbl('NBTAG · NBCHIP · NBINKSTAMP · NBSTAMP')}
        <div style={row}>
          <NbTag color={NB.red} fill>긴급</NbTag>
          <NbTag color={NB.green}>EN B1</NbTag>
          <NbTag color={NB.red} rot={-2}>지금</NbTag>
          <NbChip on>전체 14</NbChip>
          <NbChip>SBAR 3</NbChip>
          <NbInkStamp>1F</NbInkStamp>
          <NbStamp top="연속출근" bottom="12일"/>
          <NbStamp color={NB.green} rot={-10} top="" bottom="통과"/>
        </div>
        {lbl('NBMARK · NBMEMO · NBGAUGE · NBCHECK · NBPROGSQUARES')}
        <div style={{ fontFamily: HW, fontSize: 17, color: NB.ink, marginTop: 10 }}><NbMark>형광펜 강조</NbMark> 는 이렇게</div>
        <NbMemo style={{ marginTop: 10 }}><b style={{ color: NB.blue }}>왜?</b> 점선 메모 박스 — 팁·규칙·경고에 사용</NbMemo>
        <div style={{ marginTop: 10 }}><NbGauge value={69}/></div>
        <div style={row}>
          <NbCheck done/><NbCheck/>
          <NbProgSquares done={3} total={7}/>
        </div>
        {lbl('NBSEARCHLINE · NBINDEXTABS · NBGRABBER')}
        <div style={{ marginTop: 10 }}><NbSearchLine placeholder="과·병동·커리큘럼 이름으로 찾기…" right={<span style={{ fontFamily: HW, fontSize: 13, color: NB.ink }}>정렬 ∨</span>}/></div>
        <div style={{ marginTop: 12 }}><NbIndexTabs tabs={[['교정 노트', 14], ['말하기', 128], ['모범답안', 34]]} active={0}/></div>
        <NbGrabber style={{ marginTop: 14 }}/>
      </div>
    );
  }

  window.NbUI = { NbPaper, NbTape, NbPin, NbButton, NbTag, NbChip, NbInkStamp, NbStamp, NbMark, NbMemo, NbGauge, NbCheck, NbProgSquares, NbSearchLine, NbGrabber, NbIndexTabs, NbFrame };
  Object.assign(window, { ScreenNbKit });
})();
