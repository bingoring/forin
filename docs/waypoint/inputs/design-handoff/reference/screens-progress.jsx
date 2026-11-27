// screens-progress.jsx — Growth report, sticker board, profile/badges, review lab

function ScreenGrowth() {
  const T = window.ForinTokens;
  return (
    <div data-screen-label="09 Growth" style={{ height: '100%', background: T.cream, position: 'relative', overflow: 'auto' }}>
      <ForinTopBar
        title="TODAY · 5월 13일"
        left={<span style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 18, color: T.ink }}>‹</span>}
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

function StatTile({ label, value, sub, color }) {
  const T = window.ForinTokens;
  return (
    <div style={{ background: '#fff', border: `3px solid ${T.ink}`, padding: 12, boxShadow: `3px 3px 0 0 ${T.ink}66`, position: 'relative' }}>
      <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: T.textSoft }}>{label}</div>
      <div style={{ fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 24, color: T.ink, lineHeight: 1, marginTop: 4 }}>{value}</div>
      <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 10, color: T.textSoft, marginTop: 2 }}>{sub}</div>
      <div style={{ position: 'absolute', right: 8, top: 8, width: 12, height: 12, background: color, border: `2px solid ${T.ink}` }}/>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
function ScreenProfile() {
  const T = window.ForinTokens;
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

        {/* career path bar */}
        <div style={{ marginTop: 16, background: T.paper, border: `3px solid ${T.ink}`, padding: 12, boxShadow: `3px 3px 0 0 ${T.ink}` }}>
          <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: T.textSoft, marginBottom: 8 }}>CAREER PATH</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
            {[
              { n: 'Learner', done: true },
              { n: 'Junior', done: true, here: true },
              { n: 'Senior', done: false },
              { n: 'Head Nurse', done: false },
            ].map((r,i,a) => (
              <React.Fragment key={r.n}>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ width: 28, height: 28, margin: '0 auto', background: r.done ? T.mint : '#fff', border: `2px solid ${T.ink}`, boxShadow: r.here ? `2px 2px 0 0 ${T.yellowShadow}` : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: T.ink }}>
                    {r.done ? '✓' : (i+1)}
                  </div>
                  <div style={{ marginTop: 4, fontFamily: '"DungGeunMo",monospace', fontSize: 9, color: r.here ? T.ink : T.textSoft }}>{r.n}</div>
                  {r.here && <div style={{ marginTop: 2, fontFamily: '"DungGeunMo",monospace', fontSize: 8, color: T.yellowShadow }}>● HERE</div>}
                </div>
                {i < a.length - 1 && <div style={{ width: 16, height: 4, background: a[i+1].done ? T.mint : T.ink+'22' }}/>}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* badges */}
        <div style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
            <div style={{ fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 14, color: T.ink }}>🎖 커리어 뱃지</div>
            <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 11, color: T.textSoft }}>5 / 24</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
            {badges.map((b,i) => (
              <div key={i} style={{
                aspectRatio: '1', background: b.got ? (b.special ? T.yellow : '#fff') : T.cream,
                border: `3px solid ${T.ink}`,
                boxShadow: b.got ? `3px 3px 0 0 ${b.special ? T.yellowShadow : T.ink}` : 'none',
                opacity: b.got ? 1 : 0.5,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                position: 'relative',
              }}>
                <div style={{ fontSize: 22, filter: b.got ? 'none' : 'grayscale(1)' }}>{b.e}</div>
                <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 8, color: T.ink, marginTop: 2, textAlign: 'center', padding: '0 2px' }}>{b.l}</div>
                {b.special && <div style={{ position: 'absolute', top: -6, right: -6, background: '#EF4444', color: '#fff', border: `2px solid ${T.ink}`, padding: '0 4px', fontFamily: '"DungGeunMo",monospace', fontSize: 8 }}>NEW</div>}
              </div>
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
  const T = window.ForinTokens;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '5px 0' }}>
      <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 11, color: T.text, minWidth: 78 }}>{label}</div>
      <div style={{ flex: 1, height: 10, background: T.cream, border: `2px solid ${T.ink}`, position: 'relative' }}>
        <div style={{ width: `${value}%`, height: '100%', background: color }}/>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(90deg, rgba(0,0,0,.12) 1px, transparent 1px)`, backgroundSize: '5px 100%' }}/>
      </div>
      <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: T.ink, minWidth: 32, textAlign: 'right' }}>{value}%</div>
    </div>
  );
}

Object.assign(window, { ScreenGrowth, ScreenProfile });
