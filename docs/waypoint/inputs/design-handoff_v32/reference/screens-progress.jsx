// screens-progress.jsx — Growth report, sticker board, profile/badges, review lab

// ScreenGrowth — pushed sub-view of the "나" tab (entered from Profile's
// "오늘의 리포트" button, or auto-shown after a scenario ends). `onBack`
// returns to Profile.
function ScreenGrowth({ onBack }) {
  const T = window.ForinTokens;
  return (
    <div data-screen-label="09 Growth" style={{ height: '100%', background: T.cream, position: 'relative', overflow: 'auto' }}>
      <ForinTopBar
        title="TODAY · 5월 13일"
        left={<span onClick={onBack} style={{ cursor: 'pointer', fontFamily: '"DungGeunMo",monospace', fontSize: 18, color: T.ink }}>‹</span>}
        right={<span style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: T.textSoft }}>WED</span>}
      />
      <div style={{ padding: '16px 18px 120px' }}>
        {/* hero report card */}
        <div style={{ background: T.mint, border: `3px solid ${T.ink}`, boxShadow: `4px 4px 0 0 ${T.mintShadow}`, padding: 16, position: 'relative' }}>
          <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: T.ink, opacity: 0.7 }}>오늘의 성장 리포트</div>
          <div style={{ fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 20, color: T.ink, lineHeight: 1.3, marginTop: 4 }}>
            "오늘 당신은<br/>
            <span style={{ background: T.yellow, padding: '0 4px', boxShadow: `2px 2px 0 0 ${T.ink}` }}>5명의 환자</span>에게<br/>
            미소를 주었습니다."
          </div>
          <div style={{ marginTop: 12, display: 'flex', gap: 6 }}>
            <PixelChip bg={T.yellow}>🔥 7일 연속</PixelChip>
            <PixelChip bg="#fff">+ 320 XP</PixelChip>
          </div>
          {/* sparkle */}
          <div style={{ position: 'absolute', top: -6, right: -6, fontSize: 24, transform: 'rotate(12deg)' }}>✨</div>
        </div>

        {/* week streak */}
        <div style={{ marginTop: 16, background: '#fff', border: `3px solid ${T.ink}`, padding: 14, boxShadow: `3px 3px 0 0 ${T.ink}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
            <div style={{ fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 13, color: T.ink }}>이번 주 출석</div>
            <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 11, color: T.textSoft }}>5/7일</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4 }}>
            {['월','화','수','목','금','토','일'].map((d,i) => {
              const filled = i < 5;
              const today = i === 4;
              return (
                <div key={d} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 9, color: T.textSoft, marginBottom: 4 }}>{d}</div>
                  <div style={{ height: 28, background: filled ? T.mint : '#FFF', border: `2px solid ${T.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"DungGeunMo",monospace', fontSize: 12, color: T.ink, position: 'relative', boxShadow: today ? `2px 2px 0 0 ${T.yellowShadow}` : 'none' }}>
                    {filled ? '✓' : (today ? '!' : '·')}
                    {today && <div style={{ position: 'absolute', top: -6, right: -4, width: 8, height: 8, background: T.yellow, border: `1.5px solid ${T.ink}` }}/>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* stats grid */}
        <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <StatTile label="시나리오" value="3" sub="완료" color={T.mint}/>
          <StatTile label="새 표현" value="14" sub="배움" color={T.peach}/>
          <StatTile label="환자 만족" value="92%" sub="평판" color={T.yellow}/>
          <StatTile label="대화 시간" value="22분" sub="현장" color={T.pink}/>
        </div>

        {/* sticker board */}
        <div style={{ marginTop: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
            <div style={{ fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 14, color: T.ink }}>★ 칭찬 스티커 보드</div>
            <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 11, color: T.textSoft }}>24 / 100</div>
          </div>
          <div style={{ background: T.paper, border: `3px solid ${T.ink}`, boxShadow: `3px 3px 0 0 ${T.ink}`, padding: 14, position: 'relative',
            backgroundImage: `repeating-linear-gradient(0deg, transparent 0 22px, ${T.ink}11 22px 23px)` }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
              {[
                { e: '⭐', t: 'rotate(-6deg)', bg: T.yellow },
                { e: '❤', t: 'rotate(4deg)', bg: T.peach },
                { e: '🌸', t: 'rotate(-2deg)', bg: T.pink },
                { e: '✿', t: 'rotate(8deg)', bg: T.mint },
                { e: '★', t: 'rotate(-4deg)', bg: T.yellow },
                { e: '♡', t: 'rotate(2deg)', bg: T.peach },
                { e: '', t: '', bg: '' },
                { e: '', t: '', bg: '' },
              ].map((s,i) => (
                <div key={i} style={{
                  aspectRatio: '1', background: s.bg || 'transparent',
                  border: s.e ? `3px solid ${T.ink}` : `2px dashed ${T.ink}33`,
                  boxShadow: s.e ? `3px 3px 0 0 ${T.ink}` : 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22, color: T.ink, transform: s.t,
                }}>{s.e || ''}</div>
              ))}
            </div>
            <div style={{ marginTop: 10, fontFamily: '"Galmuri11",monospace', fontSize: 10, color: T.textSoft, textAlign: 'center' }}>
              · · · 빈 칸이 채워질 때마다 새 자격증이 열려요 · · ·
            </div>
          </div>
        </div>
      </div>

      <ForinBottomNav active="me"/>
    </div>
  );
}

function StatTile(props) { return <window.StatTile {...props}/>; }

// ────────────────────────────────────────────────────────────────
// ScreenProfile — the HOME of the "나" tab (Option A). Profile is what appears
// first when the user taps "나". From here you push the Daily Growth Report
// ("오늘의 리포트" button) or the Review Lab.
function ScreenProfile() {
  const T = window.ForinTokens;
  const [view, setView] = React.useState('profile'); // 'profile' | 'report'
  if (view === 'report') return <ScreenGrowth onBack={() => setView('profile')}/>;
  const badges = [
    { e: '👒', l: '간호사 캡', got: true },
    { e: '🩺', l: '청진기', got: true },
    { e: '🧷', l: '밴드', got: true },
    { e: '💉', l: '주사', got: true },
    { e: '🚑', l: '응급 인증', got: true, special: true },
    { e: '🏆', l: '병동 마스터', got: false },
    { e: '💊', l: '약사 협업', got: false },
    { e: '🔒', l: '???', got: false },
  ];
  return (
    <div data-screen-label="10 Profile" style={{ height: '100%', background: T.cream, overflow: 'auto', position: 'relative' }}>
      <ForinTopBar
        title="MY CARD"
        left={<span style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 18, color: T.ink }}>≡</span>}
        right={<span style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 16, color: T.ink }}>⚙</span>}
      />

      <div style={{ padding: '16px 18px 120px' }}>
        {/* ID Card */}
        <div style={{ background: '#fff', border: `3px solid ${T.ink}`, boxShadow: `5px 5px 0 0 ${T.ink}`, padding: 14, position: 'relative', overflow: 'hidden' }}>
          {/* hospital header strip */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 8, background: T.mint, borderBottom: `2px solid ${T.ink}` }}/>
          <div style={{ display: 'flex', gap: 14, paddingTop: 6 }}>
            <div style={{ width: 80, height: 96, background: T.peach, border: `3px solid ${T.ink}`, boxShadow: `3px 3px 0 0 ${T.ink}`, padding: 4, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', left: '50%', top: 6, transform: 'translateX(-50%)' }}>
                {window.DerpPlayer ? <window.DerpPlayer size={96} tag="" expression="happy"/> : <PixelNurse size={70}/>}
              </div>
              <div style={{ position: 'absolute', inset: 4, backgroundImage: `repeating-linear-gradient(0deg, rgba(0,0,0,.06) 0 1px, transparent 1px 3px)`, pointerEvents: 'none' }}/>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: T.textSoft }}>RANK</div>
              <div style={{ fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 18, color: T.ink, lineHeight: 1.1 }}>Junior Nurse</div>
              <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 11, color: T.textSoft, marginTop: 2 }}>EN-US · 미국 종합병원</div>
              {/* xp bar */}
              <div style={{ marginTop: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: '"DungGeunMo",monospace', fontSize: 9, color: T.textSoft }}>
                  <span>LV 12</span><span>2,140 / 3,000</span><span>LV 13</span>
                </div>
                <div style={{ height: 10, background: T.cream, border: `2px solid ${T.ink}`, marginTop: 3, position: 'relative' }}>
                  <div style={{ width: '71%', height: '100%', background: T.mint }}/>
                  <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(90deg, rgba(0,0,0,.12) 1px, transparent 1px)`, backgroundSize: '5px 100%' }}/>
                </div>
              </div>
              <div style={{ marginTop: 8, display: 'flex', gap: 6 }}>
                <PixelChip bg={T.yellow}>★ LV 12</PixelChip>
                <PixelChip bg={T.mint}>EN B1+</PixelChip>
              </div>
            </div>
          </div>

          {/* reputation rows */}
          <div style={{ marginTop: 14, paddingTop: 12, borderTop: `2px dashed ${T.ink}33` }}>
            <RepRow label="환자 만족도" value={92} color={T.mint}/>
            <RepRow label="동료 신뢰도" value={78} color={T.peach}/>
            <RepRow label="응급 대응력" value={65} color={T.yellow}/>
          </div>

          {/* punched holes (id card vibe) */}
          <div style={{ position: 'absolute', left: '50%', top: -3, transform: 'translateX(-50%)', width: 24, height: 6, background: T.cream, border: `2px solid ${T.ink}`, borderTop: 'none' }}/>
        </div>

        {/* today's report entry — pushes ScreenGrowth */}
        <div onClick={() => setView('report')} style={{ marginTop: 14, cursor: 'pointer', background: T.mint, border: `3px solid ${T.ink}`, boxShadow: `4px 4px 0 0 ${T.mintShadow}`, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 38, height: 38, background: '#fff', border: `2px solid ${T.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>📊</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 14, color: T.ink, lineHeight: 1.2 }}>오늘의 성장 리포트</div>
            <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 11, color: T.ink, opacity: 0.7, marginTop: 3 }}>시나리오 3 완료 · +320 XP · 🔥 7일 연속</div>
          </div>
          <span style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 16, color: T.ink }}>▶</span>
        </div>

        {/* colleagues entry — profile owns colleague management; Home links here */}
        <div style={{ marginTop: 14, background: '#fff', border: `3px solid ${T.ink}`, boxShadow: `4px 4px 0 0 ${T.ink}`, padding: '12px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span style={{ fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 14, color: T.ink }}>🤝 내 동료</span>
            <span style={{ background: T.mint, border: `1.5px solid ${T.ink}`, fontFamily: '"DungGeunMo",monospace', fontSize: 9, color: T.ink, padding: '1px 5px' }}>4</span>
            <div style={{ flex: 1 }}/>
            <span style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: T.textSoft }}>전체 ›</span>
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 11 }}>
            {[['#3C2A18','#A5D8E8','민서'],['#1F2937','#A7F3D0','Jae'],['#7C3F00','#FBCFE8','하늘'],['#5C3A1A','#DDD6FE','Emma']].map((p,i) => (
              <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ height: 44, background: T.cream, border: `2px solid ${T.ink}`, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', overflow: 'hidden' }}>
                  {window.SmoothSprite
                    ? <window.SmoothSprite width={40} hair={p[0]} hairStyle="short" skin="#F4D2AE" shirt={p[1]} shirtDk="#4FC79D" leg="#475569" expression="happy" dir="down"/>
                    : <div style={{ fontSize: 20, paddingBottom: 4 }}>🧑‍⚕️</div>}
                </div>
                <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 9, color: T.ink, marginTop: 4 }}>{p[2]}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: T.ink, border: `2px solid ${T.ink}`, padding: '8px 10px' }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 9, color: T.cream, opacity: .75 }}>내 초대 코드</div>
              <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 15, color: T.mint, letterSpacing: 1.5, marginTop: 2 }}>K7-N4XQ</div>
            </div>
            <div style={{ background: T.mint, border: `2px solid ${T.ink}`, padding: '5px 8px', fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: T.ink, flexShrink: 0 }}>공유</div>
            <div style={{ background: '#fff', border: `2px solid ${T.ink}`, padding: '5px 8px', fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: T.ink, flexShrink: 0 }}>+ 추가</div>
          </div>
        </div>

        {/* career path bar */}
        <div style={{ marginTop: 16, background: T.paper, border: `3px solid ${T.ink}`, padding: 12, boxShadow: `3px 3px 0 0 ${T.ink}` }}>
          <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: T.textSoft, marginBottom: 8 }}>CAREER PATH</div>
          <window.PathStepper steps={[
            { label: 'Learner', done: true },
            { label: 'Junior', done: true, here: true },
            { label: 'Senior', done: false },
            { label: 'Head Nurse', done: false },
          ]}/>
        </div>

        {/* badges */}
        <div style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
            <div style={{ fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 14, color: T.ink }}>🎖 커리어 뱃지</div>
            <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 11, color: T.textSoft }}>5 / 24</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
            {badges.map((b,i) => (
              <window.BadgeTile key={i} emoji={b.e} label={b.l} got={b.got} special={b.special} tag={b.special ? 'NEW' : null}/>
            ))}
          </div>
        </div>

        {/* review lab teaser */}
        <div style={{ marginTop: 16, background: T.lilac, border: `3px solid ${T.ink}`, boxShadow: `4px 4px 0 0 ${T.ink}`, padding: 14, position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <div style={{ width: 40, height: 40, background: '#fff', border: `2px solid ${T.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>📓</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 14, color: T.ink }}>리뷰랩 · 오답노트</div>
              <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 11, color: T.text, marginTop: 4, lineHeight: 1.4 }}>
                AI가 교정한 14개의 문장이<br/>
                <b>'현지인처럼 말하기' 카드</b>로 변환됐어요.
              </div>
            </div>
          </div>
          <div style={{ marginTop: 10, background: '#fff', border: `2px solid ${T.ink}`, padding: '8px 10px', fontFamily: '"Galmuri11",monospace', fontSize: 11, color: T.ink, lineHeight: 1.5 }}>
            <div style={{ textDecoration: 'line-through', color: T.textFaint }}>I want to ask about your pain.</div>
            <div style={{ color: T.ink, marginTop: 2 }}>→ <b style={{ background: T.mint, padding: '0 3px' }}>Can you tell me about your pain?</b></div>
          </div>
          <div style={{ marginTop: 10, textAlign: 'right' }}>
            <PixelButton size="sm" bg={T.yellow} shadow={T.yellowShadow}>리뷰랩 열기 ▶</PixelButton>
          </div>
        </div>
      </div>

      <ForinBottomNav active="me"/>
    </div>
  );
}

function RepRow({ label, value, color }) {
  // Delegates to the DS StatBar in "% + fixed label" mode (formerly bespoke).
  return (
    <div style={{ padding: '5px 0' }}>
      <window.StatBar label={label} value={value} max={100} color={color}
        w={0} labelW={78} showPct/>
    </div>
  );
}

Object.assign(window, { ScreenGrowth, ScreenProfile });
