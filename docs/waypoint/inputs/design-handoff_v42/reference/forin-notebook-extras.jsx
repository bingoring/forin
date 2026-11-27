// forin-notebook-extras.jsx — 재미 콘텐츠 4종 (근무 수첩)
// A 나이트 라디오 · B 환자 인수인계 노트 · C 슬랭 카드 덱 · D 미니게임 허브 · E 기송관 게임
(function () {
  const { NbPaper, NbButton, NbTag, NbMark, NbMemo, NbCheck } = window.NbUI;
  const NbIcon = window.NbIcon;
  const HW = '"Gaegu","Nanum Pen Script",cursive';
  const F = '"Pretendard",sans-serif';
  const MONO = '"IBM Plex Mono",monospace';
  const c = { bg: '#F1EBDD', paper: '#FFFdf4', ink: '#3E362B', soft: '#9A8F7C', red: '#C75146', blue: '#4A6FA5', green: '#5F8D5A', night: '#2E3440' };

  if (!document.getElementById('nb-extra-css')) {
    const s = document.createElement('style');
    s.id = 'nb-extra-css';
    s.textContent = `
@keyframes nbe-eq{0%{height:4px}100%{height:13px}}
@keyframes nbe-blink{0%,60%{opacity:1}70%,100%{opacity:.15}}
@keyframes nbe-drop{0%{transform:translateY(-30px) rotate(-6deg)}100%{transform:translateY(0) rotate(3deg)}}
`;
    document.head.appendChild(s);
  }

  function Frame({ label, dark, children }) {
    return (
      <div style={{ boxSizing: 'border-box', width: 402, height: 874, background: dark ? c.night : c.bg, backgroundImage: dark ? 'none' : 'repeating-linear-gradient(transparent 0 27px, rgba(62,54,43,.06) 27px 28px)', borderRadius: 40, overflow: 'hidden', position: 'relative', fontFamily: F }} data-screen-label={label}>
        <div style={{ height: 44, display: 'flex', alignItems: 'center', padding: '0 24px', fontSize: 14, fontWeight: 700, color: dark ? '#EFE9DD' : c.ink }}>9:41<div style={{ flex: 1 }}/>▮▮▮</div>
        <div style={{ position: 'absolute', top: 44, left: 0, right: 0, bottom: 0, overflowY: 'auto' }}>{children}</div>
      </div>
    );
  }
  const Head = ({ title, sub, dark, right }) => (
    <div style={{ padding: '8px 20px 0' }}>
      <div style={{ display: 'flex', alignItems: 'baseline' }}>
        <span style={{ fontFamily: HW, fontSize: 27, color: dark ? '#EFE9DD' : c.ink }}>{title}</span>
        <div style={{ flex: 1 }}/>
        {right}
      </div>
      {sub && <div style={{ fontSize: 11.5, color: dark ? 'rgba(239,233,221,.55)' : c.soft, marginTop: 3 }}>{sub}</div>}
    </div>
  );

  // ── A · 나이트 근무 라디오 ──
  function NightRadio() {
    return (
      <Frame label="나이트 근무 라디오" dark>
        {/* 별 */}
        {[[30, 18], [90, 40], [180, 12], [260, 34], [330, 20], [365, 52]].map((p, i) => (
          <div key={i} style={{ position: 'absolute', left: p[0], top: p[1], width: 3, height: 3, borderRadius: 99, background: '#F5ECC8', animation: `nbe-blink ${2 + i * .5}s steps(1) infinite` }}/>))}
        <Head dark title="나이트 근무 라디오" sub="밤 10시 이후에만 열리는 채널 — 오늘 밤도 수고해요" right={<NbTag color="#D4B46A" rot={2}>ON AIR</NbTag>}/>
        {/* 라디오 낙서 */}
        <NbPaper rot={-0.5} tape tapeLeft={140} style={{ margin: '16px 20px 0', padding: '16px 16px 14px' }}>
          <svg viewBox="0 0 200 84" style={{ width: '100%', display: 'block' }}>
            <g stroke={c.ink} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
              <rect x="14" y="20" width="172" height="58" rx="9" fill="#E3AEB4"/>
              <path d="M40 20 L92 4" fill="none"/>
              <circle cx="94" cy="4" r="2.5" fill={c.ink}/>
              <rect x="28" y="32" width="70" height="34" rx="4" fill="#FFFdf4"/>
              <circle cx="146" cy="49" r="16" fill="#FFFdf4"/>
              <circle cx="146" cy="49" r="6" fill="#E9C45A"/>
              <circle cx="170" cy="30" r="3" fill="#FFFdf4" strokeWidth="1.6"/>
            </g>
            {/* 주파수 눈금 + 바늘 */}
            <g stroke={c.soft} strokeWidth="1.2">{[36, 46, 56, 66, 76, 86].map(x => <line key={x} x1={x} y1="38" x2={x} y2="44"/>)}</g>
            <line x1="61" y1="34" x2="61" y2="62" stroke={c.red} strokeWidth="2"/>
            <text x="34" y="60" fontFamily='"IBM Plex Mono",monospace' fontSize="8.5" fontWeight="700" fill={c.ink}>FM 3.5 · 3병동</text>
          </svg>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12 }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2.5, height: 14 }}>
              {[0, 1, 2, 3, 4].map(i => <span key={i} style={{ width: 3.5, background: c.green, animation: `nbe-eq .5s ease-in-out ${i * .11}s infinite alternate` }}/>)}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontFamily: HW, fontSize: 16, color: c.ink, lineHeight: 1.1 }}>Lo-fi Night Shift, vol.3</div>
              <div style={{ fontSize: 10, color: c.soft }}>빗소리 + 심전도 비프 리믹스 · 24:12</div>
            </div>
            <NbButton variant="ink" size="sm" icon="speaker">재생</NbButton>
          </div>
        </NbPaper>
        {/* 오늘 밤의 미니 스토리 */}
        <NbPaper rot={0.4} style={{ margin: '14px 20px 0', padding: '13px 15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <NbTag color={c.blue} rot={-2}>오늘 밤의 이야기</NbTag>
            <span style={{ fontSize: 10, color: c.soft }}>3분 읽기 · 실화 기반</span>
          </div>
          <div style={{ fontFamily: HW, fontSize: 19, color: c.ink, marginTop: 9, lineHeight: 1.3 }}>새벽 3시, 502호의 콜벨</div>
          <div style={{ fontSize: 13, color: c.ink, marginTop: 7, lineHeight: 1.65 }}>
            콜벨이 두 번 울렸다 끊겼다. 가보니 할머니는 불을 끈 채 창밖만 보고 계셨다. "Can't sleep?" 하고 물으니, 고개만 끄덕이셨다. 이럴 때 쓸 수 있는 말이 있다 —
          </div>
          <div style={{ marginTop: 9, padding: '7px 10px', background: 'rgba(74,111,165,.07)', border: `1.3px dashed ${c.blue}`, fontSize: 13, fontWeight: 700, color: c.ink }}>
            <mark style={{ background: 'linear-gradient(transparent 55%, #F9E37B 55%)', padding: '0 2px' }}>"Would you like some warm milk, or shall I sit with you for a bit?"</mark>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 11 }}>
            <div style={{ flex: 1 }}><NbButton variant="yellow" size="md" full icon="mic">이 문장 따라 말하기</NbButton></div>
            <NbButton variant="paper" size="md">다음 이야기</NbButton>
          </div>
        </NbPaper>
        <div style={{ margin: '13px 20px 20px' }}>
          <NbMemo rot={-0.3} color="#D4B46A"><b style={{ color: '#B8935A' }}>밤 근무 보너스</b> 밤 10시~새벽 5시 학습은 XP 1.5배 — 야간 호출 출현↑</NbMemo>
        </div>
      </Frame>
    );
  }

  // ── B · 환자 인수인계 노트 (그 후 이야기) ──
  function HandoffNotes() {
    const notes = [
      { unread: true, av: { hair: 'baldFringe', hairColor: 'gray', outfit: 'hospitalGown', outfitColor: 'sky', eyes: 'happy', mouth: 'smile', acc: 'wrinkles' }, name: 'Mr. Park · 흉통', when: '어제 ER 2-3에서 만남', body: '검사 결과 큰 이상 없어 오늘 아침 퇴원했어요. "그 간호사님 영어 참 친절했다"고 하셨대요.', tag: ['감사 +1', c.green], act: '답장 한마디 ✎' },
      { unread: true, av: { hair: 'wavyMid', hairColor: 'lightbrown', outfit: 'hospitalGown', outfitColor: 'lilac', eyes: 'worried', mouth: 'frown' }, name: 'Ms. Rivera · 산모', when: '3일 전 분만실에서 만남', body: '오늘 새벽 2.9kg 여아 출산! 그런데 수유 상담에서 통역이 필요하대요 — 내일 이어지는 시나리오가 열려요.', tag: ['후속 시나리오', c.blue], act: '내일 예약 걸기' },
      { unread: false, av: { hair: 'curlyShort', hairColor: 'brown', outfit: 'hospitalGown', outfitColor: 'mint', eyes: 'uu', mouth: 'pain', acc: 'cannula' }, name: 'Mr. Chen · 수술 후', when: '5일 전 외과병동에서 만남', body: '가스 나왔고(!) 물도 마셨어요. JP 배액관은 내일 제거 예정 — 그때 쓸 표현을 미리 볼래요?', tag: ['복습 연결', '#C77E2E'], act: 'drain removal 표현 보기' },
    ];
    return (
      <Frame label="환자 인수인계 노트">
        <Head title="인수인계 노트" sub="어제 만난 환자들의 '그 후 이야기'가 쪽지로 도착해요" right={<NbTag color={c.red} rot={2}>새 쪽지 2</NbTag>}/>
        <div style={{ padding: '6px 0 20px' }}>
          {notes.map((n, i) => (
            <NbPaper key={i} rot={i % 2 ? 0.5 : -0.5} tape={n.unread} tapeLeft={110 + i * 40} style={{ margin: '14px 20px 0', padding: '12px 13px', ...(n.unread ? {} : { opacity: .75 }) }}>
              <div style={{ display: 'flex', gap: 11 }}>
                <div style={{ width: 46, flexShrink: 0 }}>
                  {window.NbAvatar ? <window.NbAvatar size={46} bg="washSky" {...n.av}/> : <NbIcon name="me" size={36}/>}
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <span style={{ fontFamily: HW, fontSize: 16.5, color: c.ink, whiteSpace: 'nowrap' }}>{n.name}</span>
                    {n.unread && <span style={{ width: 7, height: 7, borderRadius: 99, background: c.red, flexShrink: 0 }}/>}
                    <div style={{ flex: 1 }}/>
                    <NbTag color={n.tag[1]} rot={i % 2 ? 2 : -2} style={{ fontSize: 10 }}>{n.tag[0]}</NbTag>
                  </div>
                  <div style={{ fontSize: 9.5, color: c.soft, marginTop: 1 }}>{n.when}</div>
                </div>
              </div>
              <div style={{ fontFamily: HW, fontSize: 15, color: c.ink, marginTop: 9, lineHeight: 1.5 }}>{n.body}</div>
              <div style={{ marginTop: 9, display: 'flex' }}>
                <div style={{ flex: 1 }}/>
                <span style={{ fontFamily: HW, fontSize: 13.5, color: c.blue, textDecoration: 'underline', textUnderlineOffset: 3 }}>{n.act} ›</span>
              </div>
            </NbPaper>
          ))}
          <div style={{ margin: '14px 20px 0' }}>
            <NbMemo rot={0.3}>환자와의 대화가 좋았을수록(정확도·공감 표현) 후일담이 더 자주 와요.</NbMemo>
          </div>
        </div>
      </Frame>
    );
  }

  // ── C · 슬랭/약어 카드 덱 ──
  function SlangDeck() {
    const got = [['stat', '지금 당장'], ['PRN', '필요시'], ['NPO', '금식'], ['c/o', '호소함'], ['amb', '보행 가능'], ['I&O', '섭취/배설량']];
    const locked = 6;
    return (
      <Frame label="슬랭 카드 덱">
        <Head title="병원 은어 도감" sub="하루 1장 — 교과서엔 없는 현지 병원 말" right={<span style={{ fontFamily: MONO, fontSize: 12, fontWeight: 700, color: c.soft }}>6/30</span>}/>
        {/* 오늘의 카드 */}
        <div style={{ margin: '14px 20px 0', animation: 'nbe-drop .5s ease-out both' }}>
          <NbPaper rot={2} tape tapeLeft={150} style={{ padding: '16px 17px', boxShadow: '0 5px 16px rgba(62,54,43,.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <NbTag color={c.red} rot={-2}>오늘의 카드</NbTag>
              <div style={{ flex: 1 }}/>
              <span style={{ fontSize: 10, color: c.soft }}>#007 · 은어</span>
            </div>
            <div style={{ fontFamily: MONO, fontSize: 30, fontWeight: 700, color: c.ink, marginTop: 12 }}>code brown</div>
            <div style={{ fontFamily: HW, fontSize: 16.5, color: c.ink, marginTop: 5 }}>대변 사고 처리 상황 <span style={{ color: c.soft, fontSize: 13.5 }}>(진짜 응급 코드 아님!)</span></div>
            <div style={{ marginTop: 10, padding: '7px 10px', background: 'rgba(74,111,165,.07)', border: `1.3px dashed ${c.blue}`, fontSize: 12.5, color: c.ink, lineHeight: 1.55 }}>
              "We've got a <b>code brown</b> in room 12." — 동료가 이러면 장갑부터 챙기세요.
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <div style={{ flex: 1 }}><NbButton variant="yellow" size="md" full icon="speaker">발음 듣기</NbButton></div>
              <NbButton variant="paper" size="md">도감에 붙이기 ✓</NbButton>
            </div>
          </NbPaper>
        </div>
        {/* 도감 그리드 */}
        <div style={{ margin: '16px 20px 0', fontFamily: HW, fontSize: 16, color: c.ink }}>— 수집한 카드 ——</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 9, margin: '9px 20px 0' }}>
          {got.map((g, i) => (
            <NbPaper key={i} rot={i % 2 ? 0.8 : -0.8} style={{ padding: '9px 6px', textAlign: 'center' }}>
              <div style={{ fontFamily: MONO, fontSize: 13, fontWeight: 700, color: c.ink }}>{g[0]}</div>
              <div style={{ fontFamily: HW, fontSize: 12, color: c.soft, marginTop: 2, whiteSpace: 'nowrap' }}>{g[1]}</div>
            </NbPaper>
          ))}
          {Array.from({ length: locked }).map((_, i) => (
            <div key={'l' + i} style={{ border: '1.5px dashed rgba(62,54,43,.25)', padding: '9px 6px', textAlign: 'center' }}>
              <div style={{ fontFamily: MONO, fontSize: 13, fontWeight: 700, color: 'rgba(62,54,43,.25)' }}>?</div>
              <div style={{ fontFamily: HW, fontSize: 11.5, color: 'rgba(62,54,43,.3)', marginTop: 2 }}>내일</div>
            </div>
          ))}
        </div>
        <div style={{ margin: '14px 20px 20px' }}>
          <NbMemo color={c.green} rot={-0.3}><b style={{ color: c.green }}>수집 보상</b> 10장마다 히든 카드(진짜 위험한 코드들) 개봉 — 30장이면 '은어 마스터' 칭호</NbMemo>
        </div>
      </Frame>
    );
  }

  // ── D · 쉬는 시간 미니게임 허브 (간호 무관 · 경쟁전) ──
  function GameHub() {
    const games = [
      { icon: 'plane', name: '종이비행기 날리기', sub: '타이밍 게이지 딱 멈춰 멀리! · 15초', best: '최고 42.7m', color: 'rgba(169,203,227,.28)' },
      { icon: 'pencil', name: '펜 뚜껑 스피드', sub: '초록불 뜨는 순간 탭! 반응속도 · 10초', best: '최고 0.21s', color: 'rgba(233,196,90,.2)' },
      { icon: 'star', name: '낙서 짝 맞추기', sub: '뒤집어서 같은 낙서 찾기 · 30초', best: 'NEW', color: 'rgba(227,174,180,.25)' },
      { icon: 'pencil', name: '완벽한 원 그리기', sub: '점선 원을 따라 한 붓에 — 정확도 채점 · 10초', best: '최고 91점', color: 'rgba(168,217,195,.28)' },
      { icon: 'run', name: '복도 달리기', sub: '터치로 점프! 짧게=낮게, 길게=높게 · 반응속도', best: '최고 512m', color: 'rgba(201,162,39,.16)' },
    ];
    const rank = [
      ['1', 'Jiyoon', '48.2m', c.green],
      ['2', '나', '42.7m', c.blue],
      ['3', 'Hana', '39.9m', c.soft],
    ];
    return (
      <Frame label="쉬는 시간 미니게임">
        <Head title="쉬는 시간" sub="공부는 잠깐 끄기 — 30초 낙서 게임, 동료와 점수 배틀" right={<NbTag color={c.blue} rot={2}>오늘 1/3판</NbTag>}/>
        <div style={{ padding: '6px 0' }}>
          {games.map((g, i) => (
            <NbPaper key={i} rot={i % 2 ? 0.5 : -0.5} style={{ margin: '13px 20px 0', padding: '13px 14px', display: 'flex', alignItems: 'center', gap: 12, background: g.color }}>
              <div style={{ width: 44, height: 44, background: c.paper, border: `1.5px solid ${c.ink}`, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transform: `rotate(${i % 2 ? 3 : -3}deg)` }}>
                <NbIcon name={g.icon} size={26}/>
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontFamily: HW, fontSize: 18.5, color: c.ink, lineHeight: 1.1 }}>{g.name}</div>
                <div style={{ fontSize: 10.5, color: c.soft, marginTop: 2 }}>{g.sub}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontFamily: MONO, fontSize: 10, fontWeight: 700, color: g.best === 'NEW' ? c.red : c.soft }}>{g.best}</div>
                <div style={{ marginTop: 5 }}><NbButton variant="ink" size="sm">시작</NbButton></div>
              </div>
            </NbPaper>
          ))}
          {/* 동료 리더보드 */}
          <NbPaper rot={-0.4} tape tapeLeft={130} style={{ margin: '15px 20px 0', padding: '4px 14px 12px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', paddingTop: 9 }}>
              <span style={{ fontFamily: HW, fontSize: 17, color: c.ink }}><NbIcon name="trophy" size={16}/> 이번 주 동료 랭킹 · 종이비행기</span>
              <div style={{ flex: 1 }}/>
              <span style={{ fontSize: 10, color: c.soft }}>일요일 리셋</span>
            </div>
            {rank.map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 9, marginTop: 8, borderTop: '1.3px dashed rgba(62,54,43,.15)' }}>
                <span style={{ width: 22, height: 22, borderRadius: '50%', border: `1.7px solid ${r[3]}`, color: r[3], fontFamily: HW, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{r[0]}</span>
                <span style={{ fontFamily: HW, fontSize: 15.5, color: c.ink, fontWeight: r[1] === '나' ? 700 : 400 }}>{r[1] === '나' ? <NbMark>나</NbMark> : r[1]}</span>
                <div style={{ flex: 1 }}/>
                <span style={{ fontFamily: MONO, fontSize: 12.5, fontWeight: 700, color: c.ink }}>{r[2]}</span>
              </div>
            ))}
            <div style={{ marginTop: 11 }}><NbButton variant="yellow" size="md" full icon="pager">Jiyoon에게 도전장 보내기</NbButton></div>
          </NbPaper>
          <div style={{ margin: '13px 20px 0' }}>
            <NbMemo rot={0.3}>여기선 공부 얘기 금지 — 점수만 남아요. 도전장을 받으면 같은 판으로 대결!</NbMemo>
          </div>
        </div>
      </Frame>
    );
  }

  // ── E · 종이비행기 날리기 (인게임) ──
  function PlaneGame() {
    return (
      <Frame label="종이비행기 날리기 · 인게임">
        <div style={{ display: 'flex', alignItems: 'center', padding: '8px 20px 0' }}>
          <span style={{ fontFamily: HW, fontSize: 15, color: c.ink, border: `1.5px solid ${c.ink}`, borderRadius: 3, padding: '1px 8px', transform: 'rotate(-1deg)' }}>✕ 그만</span>
          <div style={{ flex: 1 }}/>
          <span style={{ fontFamily: HW, fontSize: 13, color: c.soft }}>2번째 시도 / 3</span>
        </div>
        {/* 하늘 + 궤적 */}
        <div style={{ position: 'relative', height: 350, margin: '10px 20px 0', border: '1.5px dashed rgba(62,54,43,.3)', background: 'linear-gradient(#DCEAF2 0%, #EDF3F0 70%, #EFE7D4 70%)', overflow: 'hidden' }}>
          {[[40, 40], [150, 22], [270, 52]].map((p, i) => (
            <div key={i} style={{ position: 'absolute', left: p[0], top: p[1], width: 52, height: 17, background: '#fff', borderRadius: 99, opacity: .9, boxShadow: '9px 5px 0 -3px #fff' }}/>))}
          <svg viewBox="0 0 360 350" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
            <path d="M18 300 Q120 140 210 170 Q290 198 340 260" fill="none" stroke="rgba(62,54,43,.45)" strokeWidth="2" strokeDasharray="6 7"/>
            <text x="196" y="150" fontFamily='"Gaegu",cursive' fontSize="15" fill={c.blue} transform="rotate(-5 196 150)">슝—</text>
          </svg>
          <div style={{ position: 'absolute', left: 232, top: 152, transform: 'rotate(14deg)' }}><NbIcon name="plane" size={40}/></div>
          {/* 지면 거리 눈금 */}
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 34, borderTop: '1.5px solid rgba(62,54,43,.35)' }}>
            {[['10m', '18%'], ['20m', '40%'], ['30m', '62%'], ['40m', '84%']].map((m) => (
              <div key={m[0]} style={{ position: 'absolute', left: m[1], top: 0, bottom: 0 }}>
                <div style={{ width: 1.5, height: 8, background: 'rgba(62,54,43,.45)' }}/>
                <div style={{ fontFamily: MONO, fontSize: 8.5, fontWeight: 700, color: c.soft, marginTop: 2, marginLeft: -8 }}>{m[0]}</div>
              </div>
            ))}
            {/* 이전 최고 기록 깃발 */}
            <div style={{ position: 'absolute', left: '78%', top: -40 }}>
              <div style={{ fontFamily: HW, fontSize: 10, color: c.red, whiteSpace: 'nowrap', marginLeft: 14, marginBottom: 1 }}>내 최고 42.7</div>
              <svg viewBox="0 0 18 28" width="18" height="28"><path d="M4 2 V26" stroke={c.ink} strokeWidth="1.8"/><path d="M4 3 L15 6.5 L4 10 Z" fill={c.red} stroke={c.ink} strokeWidth="1.4"/></svg>
            </div>
          </div>
        </div>
        {/* 결과 낙서 */}
        <div style={{ margin: '12px 20px 0', textAlign: 'center' }}>
          <span style={{ fontFamily: HW, fontSize: 26, color: c.ink }}>37.2m!</span>
          <span style={{ fontFamily: HW, fontSize: 14, color: c.soft, marginLeft: 8 }}>Jiyoon까지 앞으로 11m</span>
        </div>
        {/* 파워 게이지 — 타이밍 탭 */}
        <NbPaper rot={0.4} style={{ margin: '12px 20px 0', padding: '12px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontFamily: HW, fontSize: 15, color: c.ink }}>파워 게이지 — 초록 구간에서 탭!</span>
            <div style={{ flex: 1 }}/>
            <span style={{ fontFamily: MONO, fontSize: 10, fontWeight: 700, color: c.green }}>PERFECT ×1.5</span>
          </div>
          <div style={{ marginTop: 10, height: 16, border: `1.7px solid ${c.ink}`, position: 'relative', background: 'repeating-linear-gradient(-45deg, rgba(233,196,90,.45) 0 6px, rgba(233,196,90,.2) 6px 12px)' }}>
            <div style={{ position: 'absolute', left: '58%', width: '18%', top: 0, bottom: 0, background: 'rgba(95,141,90,.55)' }}/>
            <div style={{ position: 'absolute', left: '67%', top: -5, bottom: -5, borderLeft: `2.5px solid ${c.ink}` }}/>
          </div>
        </NbPaper>
        <div style={{ margin: '13px 20px 0' }}>
          <NbButton variant="yellow" size="lg" full icon="plane">마지막 한 발 날리기!</NbButton>
        </div>
      </Frame>
    );
  }

  // ── F · 완벽한 원 그리기 (인게임) ──
  function CircleGame() {
    return (
      <Frame label="완벽한 원 그리기 · 인게임">
        <div style={{ display: 'flex', alignItems: 'center', padding: '8px 20px 0' }}>
          <span style={{ fontFamily: HW, fontSize: 15, color: c.ink, border: `1.5px solid ${c.ink}`, borderRadius: 3, padding: '1px 8px', transform: 'rotate(-1deg)' }}>✕ 그만</span>
          <div style={{ flex: 1 }}/>
          <span style={{ fontFamily: HW, fontSize: 13, color: c.soft }}>이번 주 동료 최고 · Hana 96점</span>
        </div>
        <div style={{ textAlign: 'center', marginTop: 8, fontFamily: HW, fontSize: 20, color: c.ink }}>점선 원을 따라 <NbMark>한 붓에</NbMark> 그리세요</div>
        {/* 캔버스 */}
        <div style={{ position: 'relative', height: 400, margin: '12px 20px 0', border: '1.5px dashed rgba(62,54,43,.3)', background: 'rgba(255,253,244,.6)' }}>
          <svg viewBox="0 0 360 400" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
            {/* 목표 원 (점선) */}
            <circle cx="180" cy="200" r="120" fill="none" stroke="rgba(62,54,43,.35)" strokeWidth="2" strokeDasharray="7 8"/>
            {/* 사용자가 그린 선 — 살짝 삐뚤 */}
            <path d="M180 82 Q292 88 300 196 Q304 306 186 318 Q72 322 62 204 Q58 100 168 84" fill="none" stroke={c.blue} strokeWidth="3.5" strokeLinecap="round"/>
            {/* 시작점 + 커서 */}
            <circle cx="180" cy="82" r="5" fill={c.green} stroke={c.ink} strokeWidth="1.6"/>
            <circle cx="168" cy="84" r="6" fill={c.paper} stroke={c.ink} strokeWidth="1.8"/>
            {/* 구간 피드백 낙서 */}
            <text x="296" y="140" fontFamily='"Gaegu",cursive' fontSize="14" fill={c.green} transform="rotate(8 296 140)">good!</text>
            <text x="52" y="280" fontFamily='"Gaegu",cursive' fontSize="14" fill={c.red} transform="rotate(-7 52 280)">삐끗</text>
          </svg>
          <div style={{ position: 'absolute', left: 0, right: 0, top: '46%', textAlign: 'center', fontFamily: MONO, fontSize: 40, fontWeight: 700, color: c.ink }}>87<span style={{ fontSize: 15, color: c.soft }}>점</span></div>
          <div style={{ position: 'absolute', left: 0, right: 0, top: '58%', textAlign: 'center', fontFamily: HW, fontSize: 13.5, color: c.soft }}>평균 오차 4.1px · 최고 100점</div>
        </div>
        <div style={{ margin: '13px 20px 0', display: 'flex', gap: 9 }}>
          <div style={{ flex: 1 }}><NbButton variant="yellow" size="lg" full icon="pencil">다시 그리기</NbButton></div>
          <NbButton variant="paper" size="lg">랭킹 올리기</NbButton>
        </div>
        <div style={{ margin: '12px 20px 0' }}>
          <NbMemo rot={-0.3} color={c.blue}><b style={{ color: c.blue }}>채점</b> 궤적 전체의 원 이탈 오차 평균으로 100점 만점 — 손 떼면 즉시 채점돼요.</NbMemo>
        </div>
      </Frame>
    );
  }

  // ── G · 복도 달리기 (인게임 · 러너) ──
  function RunnerGame() {
    return (
      <Frame label="복도 달리기 · 인게임">
        <div style={{ display: 'flex', alignItems: 'center', padding: '8px 20px 0' }}>
          <span style={{ fontFamily: HW, fontSize: 15, color: c.ink, border: `1.5px solid ${c.ink}`, borderRadius: 3, padding: '1px 8px', transform: 'rotate(-1deg)' }}>✕ 그만</span>
          <div style={{ flex: 1 }}/>
          <span style={{ fontFamily: MONO, fontSize: 15, fontWeight: 700, color: c.ink }}>318m</span>
          <div style={{ width: 12 }}/>
          <NbTag color={c.red} rot={2}>속도 ×1.6</NbTag>
        </div>
        {/* 트랙 */}
        <div style={{ position: 'relative', height: 300, margin: '12px 20px 0', border: '1.5px dashed rgba(62,54,43,.3)', background: 'rgba(255,253,244,.6)', overflow: 'hidden' }}>
          {/* 지면 */}
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 54, borderTop: '2px solid rgba(62,54,43,.55)' }}/>
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 40, display: 'flex', gap: 26, padding: '0 8px' }}>
            {[0,1,2,3,4,5,6,7].map(i => <span key={i} style={{ width: 14, borderTop: '1.5px solid rgba(62,54,43,.25)' }}/>)}
          </div>
          {/* 점프 중인 내 캐릭터 (NbCharacter 재사용) */}
          <div style={{ position: 'absolute', left: 52, bottom: 120, transform: 'rotate(6deg)' }}>
            {window.NbCharacter ? <window.NbCharacter size={34} hair="bob" hairColor="darkbrown" outfitColor="mint" eyes="dot" mouth="o"/> : <NbIcon name="run" size={30}/>}
          </div>
          {/* 낮은 장애물: 청소 카트 / 높은 장애물: 걸이형 표지판 */}
          <svg viewBox="0 0 40 34" width="40" height="34" style={{ position: 'absolute', left: 180, bottom: 56 }}>
            <rect x="4" y="4" width="32" height="20" rx="2" fill="#E3AEB4" stroke={c.ink} strokeWidth="1.8"/>
            <circle cx="12" cy="29" r="4" fill={c.paper} stroke={c.ink} strokeWidth="1.6"/>
            <circle cx="28" cy="29" r="4" fill={c.paper} stroke={c.ink} strokeWidth="1.6"/>
          </svg>
          <svg viewBox="0 0 44 60" width="44" height="60" style={{ position: 'absolute', left: 300, bottom: 110 }}>
            <path d="M22 0 V12" stroke={c.ink} strokeWidth="1.8"/>
            <rect x="2" y="12" width="40" height="26" rx="2" fill="#A9CBE3" stroke={c.ink} strokeWidth="1.8"/>
            <text x="9" y="29" fontFamily='"Gaegu",cursive' fontSize="11" fill={c.ink}>WET!</text>
          </svg>
          <div style={{ position: 'absolute', left: 296, bottom: 58, fontFamily: HW, fontSize: 11, color: c.soft }}>← 밑으로!</div>
          {/* 속도선 */}
          {[80, 150, 230].map((y, i) => <div key={i} style={{ position: 'absolute', right: 0, top: y, width: 34 + i * 12, borderTop: '1.5px solid rgba(62,54,43,.2)' }}/>)}
          <div style={{ position: 'absolute', left: 10, top: 8, fontFamily: HW, fontSize: 12, color: c.soft }}>병원 복도 · 점점 빨라져요</div>
        </div>
        {/* 조작 — 점프 버튼 하나 (누른 시간 = 점프 높이) */}
        <div style={{ margin: '12px 20px 0' }}>
          <NbPaper rot={-0.3} style={{ padding: '13px 14px', textAlign: 'center', background: 'rgba(233,196,90,.18)', cursor: 'pointer' }}>
            <div style={{ fontFamily: HW, fontSize: 21, color: c.ink }}><NbIcon name="run" size={19}/> 점프!</div>
            <div style={{ fontSize: 10.5, color: c.soft, marginTop: 3 }}>짧게 누르면 낮게 · 오래 누를수록 높게</div>
            {/* 홀드 게이지 */}
            <div style={{ marginTop: 9, height: 9, border: `1.5px solid ${c.ink}`, position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 1.5, width: '45%', background: 'repeating-linear-gradient(-45deg, rgba(95,141,90,.7) 0 5px, rgba(95,141,90,.4) 5px 10px)' }}/>
            </div>
            <div style={{ display: 'flex', marginTop: 3, fontFamily: HW, fontSize: 10.5, color: c.soft }}>
              <span>낮은 점프</span><div style={{ flex: 1 }}/><span>높은 점프</span>
            </div>
          </NbPaper>
        </div>
        <div style={{ margin: '12px 20px 0' }}>
          <NbMemo rot={0.3} color={c.blue}><b style={{ color: c.blue }}>규칙</b> 속도가 오를수록 장애물 간격도 같이 넓어져요 — 불가능한 배치는 절대 안 나와요. 죽는 건 순전히 반응속도!</NbMemo>
        </div>
        <div style={{ margin: '12px 20px 0', display: 'flex', alignItems: 'baseline', gap: 8, justifyContent: 'center' }}>
          <span style={{ fontFamily: HW, fontSize: 13.5, color: c.soft }}>내 최고 512m · 동료 1위 Jiyoon 897m</span>
        </div>
      </Frame>
    );
  }

  // ── H · 왼오른 농구 (인게임 · 플레이 가능) ──
  // 탭 = 공이 위로 튐. 화면엔 목표 골대 하나만 — 넣으면 카메라가 반대편으로
  // 슬라이드하며 화면 밖에 있던 골대가 들어온다. 궤적 표시 없음.
  function BasketGame() {
    const W = 358, H = 560, FLOOR = H - 46;
    const CAM = 150;                       // 카메라 이동 폭
    const RIGHT_X = W - 64, LEFT_X = -CAM + 64, HOOP_Y = 190;
    const [ui, setUi] = React.useState({ score: 0, best: 43, started: false });
    const ref = React.useRef(null);        // 월드 div
    const ballRef = React.useRef(null);
    const st = React.useRef({ x: 60, y: FLOOR - 14, vx: 0, vy: 0, dir: 1, cam: 0, run: false, raf: 0 });
    const draw = () => {
      const s = st.current;
      if (ballRef.current) ballRef.current.style.transform = `translate(${s.x - 14}px, ${s.y - 14}px) rotate(${s.x * 3}deg)`;
      if (ref.current) ref.current.style.transform = `translateX(${s.cam}px)`;
    };
    const step = () => {
      const s = st.current;
      if (!s.run) return;
      s.vy += 0.42; s.x += s.vx; s.y += s.vy;
      const hx = s.dir === 1 ? RIGHT_X : LEFT_X;
      // 득점: 림 높이를 하강 중 통과 + 림 폭 안
      if (s.vy > 0 && s.y > HOOP_Y && s.y < HOOP_Y + 16 && Math.abs(s.x - hx) < 26) {
        s.dir *= -1;
        s.cam = s.dir === 1 ? 0 : CAM;
        s.vx = 0; s.vy = 0;
        s.x = s.dir === 1 ? 60 : W - 60; s.y = FLOOR - 14;
        setUi(u => ({ ...u, score: u.score + 1, best: Math.max(u.best, u.score + 1) }));
      }
      // 바닥/이탈 → 같은 자리 리셋 (점수 유지, 콤보 개념 없음)
      if (s.y > FLOOR - 6) { s.y = FLOOR - 14; s.vy = 0; s.vx = 0; }
      if (s.x < -CAM - 10 || s.x > W + 10) { s.x = s.dir === 1 ? 60 : W - 60; s.vx = 0; }
      draw();
      s.raf = requestAnimationFrame(step);
    };
    const tap = () => {
      const s = st.current;
      if (!s.run) { s.run = true; setUi(u => ({ ...u, started: true })); s.raf = requestAnimationFrame(step); }
      s.vy = -7.6;
      s.vx = s.dir * 2.1;
    };
    React.useEffect(() => () => cancelAnimationFrame(st.current.raf), []);
    const Hoop = ({ x, flip }) => (
      <div style={{ position: 'absolute', left: x - 44, top: HOOP_Y - 52, width: 108, transform: flip ? 'scaleX(-1)' : 'none' }}>
        <svg viewBox="0 0 128 130" width="128" height="130">
          {/* 기둥 + 백보드 (측면 패널) */}
          <path d="M100 40 H128 V50 H100 Z" fill="#B07F24" stroke={c.ink} strokeWidth="1.6"/>
          <path d="M100 96 H128 V106 H100 Z" fill="#B07F24" stroke={c.ink} strokeWidth="1.6"/>
          <rect x="88" y="30" width="12" height="100" fill="#C9922E" stroke={c.ink} strokeWidth="1.6"/>
          <rect x="76" y="0" width="14" height="92" fill="#EDE8DC" stroke={c.ink} strokeWidth="1.8"/>
          <rect x="76" y="0" width="14" height="20" fill="#FFFdf4" stroke={c.ink} strokeWidth="1.8"/>
          <rect x="79" y="56" width="8" height="18" fill="#C9C2B2"/>

          {/* 림 — 파란 타원 (살짝 아래에서 본 시점) */}
          <ellipse cx="42" cy="56" rx="34" ry="10" fill="none" stroke="#3D7BC4" strokeWidth="7"/>
          <ellipse cx="42" cy="56" rx="34" ry="10" fill="none" stroke={c.ink} strokeWidth="1.2" opacity=".35"/>
          {/* 그물 — 아래로 좁아지는 다이아 격자 */}
          {/* 뒷가닥 — 림 뒤쪽 테두리(위쪽 곡선)에서 내려옴, 옅게 */}
          <g stroke={c.ink} strokeWidth="1.2" fill="none" strokeLinecap="round" opacity=".35">
            <path d="M18 51 Q22 68 26 80 M32 47 Q34 66 35 80 M52 47 Q50 66 49 80 M66 51 Q62 68 58 80"/>
            <path d="M26 80 L31 90 M35 80 L31 90 M49 80 L53 90 M58 80 L53 90 M31 90 L34 102 M53 90 L50 102"/>
          </g>
          {/* 앞가닥 — 림 앞쪽 테두리에서 내려오며 단조롭게 오므라듦 */}
          <g stroke={c.ink} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity=".8">
            <path d="M10 60 Q14 72 21 82 M22 64 Q25 74 29 84 M34 66 Q35 76 37 85 M48 66 Q47 76 45 85 M60 64 Q57 74 53 84 M74 60 Q68 72 61 82"/>
            <path d="M21 82 L26 93 M29 84 L26 93 M29 84 L33 93 M37 85 L33 93 M37 85 L41 93 M45 85 L41 93 M45 85 L49 93 M53 84 L49 93 M53 84 L56 93 M61 82 L56 93"/>
            <path d="M26 93 L30 104 M33 93 L36 104 M41 93 L41 104 M49 93 L46 104 M56 93 L52 104"/>
            <path d="M30 104 Q41 108 52 104"/>
          </g>
        </svg>
      </div>
    );
    return (
      <Frame label="왼오른 농구 · 인게임">
        <div style={{ display: 'flex', alignItems: 'center', padding: '8px 20px 0' }}>
          <span style={{ fontFamily: HW, fontSize: 15, color: c.ink, border: `1.5px solid ${c.ink}`, borderRadius: 3, padding: '1px 8px', transform: 'rotate(-1deg)' }}>✕ 그만</span>
          <div style={{ flex: 1 }}/>
          <span style={{ fontFamily: HW, fontSize: 13, color: c.soft }}>최고</span>
          <span style={{ fontFamily: MONO, fontSize: 15, fontWeight: 700, color: c.ink, marginLeft: 5 }}>{ui.best}</span>
        </div>
        {/* 코트 (뷰포트) */}
        <div onClick={tap} onTouchStart={(e) => { e.preventDefault(); tap(); }} style={{ position: 'relative', height: H, margin: '10px 20px 0', border: '1.5px dashed rgba(62,54,43,.3)', background: 'rgba(255,253,244,.6)', overflow: 'hidden', cursor: 'pointer', touchAction: 'manipulation' }}>
          {/* 점수 스탬프 */}
          <div style={{ position: 'absolute', right: 12, top: 10, zIndex: 3, fontFamily: MONO, fontSize: 22, fontWeight: 700, color: c.ink }}>
            <span style={{ fontFamily: HW, fontSize: 13, color: c.soft, marginRight: 6 }}>연속</span>{ui.score}
          </div>
          {/* 월드 — 카메라가 translateX로 슬라이드 */}
          <div ref={ref} style={{ position: 'absolute', left: 0, top: 0, width: W + CAM, height: '100%', transition: 'transform .55s cubic-bezier(.3,.7,.3,1)' }}>
            <Hoop x={LEFT_X} flip/>
            <Hoop x={RIGHT_X}/>
            {/* 바닥선 */}
            <div style={{ position: 'absolute', left: -CAM, right: 0, top: FLOOR, width: W + CAM * 2, borderTop: '2px solid rgba(62,54,43,.5)' }}/>
            {/* 공 */}
            <div ref={ballRef} style={{ position: 'absolute', left: 0, top: 0, width: 28, height: 28, willChange: 'transform', transform: `translate(${60 - 14}px, ${FLOOR - 28}px)` }}>
              <svg viewBox="0 0 28 28" width="28" height="28">
                <defs><radialGradient id="nbxBall" cx=".35" cy=".3" r=".9"><stop offset="0" stopColor="#F5A94B"/><stop offset="1" stopColor="#D97B23"/></radialGradient></defs>
                <circle cx="14" cy="14" r="12.5" fill="url(#nbxBall)" stroke={c.ink} strokeWidth="1.8"/>
                <path d="M14 1.5 Q10 14 14 26.5 M1.5 14 Q14 10 26.5 14 M4.5 5.5 Q14 13 23.5 5.5 M4.5 22.5 Q14 15 23.5 22.5" fill="none" stroke="#8A4A12" strokeWidth="1.4"/>
              </svg>
            </div>
          </div>
          {!ui.started && (
            <div style={{ position: 'absolute', left: 0, right: 0, top: '52%', textAlign: 'center', zIndex: 3 }}>
              <div style={{ fontFamily: HW, fontSize: 23, color: c.ink }}>탭해서 시작</div>
              <div style={{ fontSize: 11.5, color: c.soft, marginTop: 4 }}>탭할 때마다 공이 위로 튀어요 — 넣으면 반대쪽 골대로!</div>
            </div>
          )}
        </div>
        <div style={{ margin: '12px 20px 0' }}>
          <NbMemo rot={-0.3} color={c.blue}><b style={{ color: c.blue }}>규칙</b> 골을 넣으면 카메라가 반대편으로 미끄러지며 다음 골대가 나타나요. 왼→오른→왼 번갈아 연속 기록!</NbMemo>
        </div>
      </Frame>
    );
  }

  Object.assign(window, { NightRadio, HandoffNotes, SlangDeck, GameHub, PlaneGame, CircleGame, RunnerGame, BasketGame });
})();
