// screens-dialogue.jsx — Visual novel dialogue + mission + completion screen

function ScreenDialogue({ hintOn = false }) {
  const T = window.ForinTokens;
  return (
    <div data-screen-label={hintOn ? '07b Dialogue · Hint ON' : '07a Dialogue · Free'} style={{ height: '100%', background: '#1F2937', position: 'relative', overflow: 'hidden' }}>
      {/* ER room backdrop */}
      <DialogueBackdrop/>

      {/* status bar overlay (transparent header) */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '52px 16px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 5 }}>
        <button style={{ background: '#fff', border: `2px solid ${T.ink}`, padding: '4px 10px', fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: T.ink, boxShadow: `2px 2px 0 0 ${T.ink}`, cursor: 'pointer' }}>× 나가기</button>

        {/* mission tracker */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          <div style={{ background: T.yellow, border: `2px solid ${T.ink}`, padding: '3px 8px', fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: T.ink, boxShadow: `2px 2px 0 0 ${T.ink}` }}>
            🎯 MISSION 1/3
          </div>
          <div style={{ background: 'rgba(255,255,255,0.95)', border: `2px solid ${T.ink}`, padding: '4px 8px', fontFamily: '"Galmuri11",monospace', fontSize: 10, color: T.ink, maxWidth: 180, lineHeight: 1.3, textAlign: 'right' }}>
            통증 수치(1–10) 끌어내기
          </div>
        </div>
      </div>

      {/* Patient portrait (left) */}
      <div style={{ position: 'absolute', left: 16, top: 130, zIndex: 3 }}>
        <PortraitFrame name="Mrs. Hopkins" side="L" status="Pain 7/10">
          <div style={{ position: 'absolute', left: '50%', top: 8, transform: 'translateX(-50%)' }}>
            <window.DerpPatient x={3} y={2} hair="#9A6B3F" expression="pain" size={132}/>
          </div>
          <span style={{ position: 'absolute', top: 6, right: -10, fontSize: 18, animation: 'forinShake 0.6s ease-in-out infinite', zIndex: 3 }}>💧</span>
        </PortraitFrame>
      </div>

      {/* Player portrait (right) */}
      <div style={{ position: 'absolute', right: 16, top: 160, zIndex: 2, opacity: 0.85 }}>
        <PortraitFrame name="YOU · Junior Nurse" side="R" hue={T.mint}>
          <div style={{ position: 'absolute', left: '50%', top: 8, transform: 'translateX(-50%)' }}>
            <window.DerpPlayer expression="focused" size={132} tag=""/>
          </div>
        </PortraitFrame>
      </div>

      {/* Quick-access tools dock — horizontal row below both portraits.
          Positioned in the CREAM (lower 60%) section, below the peach
          backdrop seam (y≈350) so it visually belongs to the player's
          working area, not the patient-room scene above. */}
      <div style={{
        position: 'absolute', left: 14, right: 14, top: 360,
        display: 'flex', alignItems: 'center', gap: 6, zIndex: 7,
      }}>
        <div style={{
          fontFamily: '"DungGeunMo",monospace', fontSize: 8,
          color: T.ink, opacity: 0.75,
          background: '#fff', border: `1.5px solid ${T.ink}`,
          padding: '2px 5px', whiteSpace: 'nowrap', flexShrink: 0,
        }}>QUICK INFO</div>
        <div style={{ flex: 1, height: 0, borderTop: `2px dotted ${T.ink}55` }}/>
        {[
          { i: '📋', label: '차트' },
          { i: '💊', label: '약물' },
          { i: '🩺', label: '활력' },
        ].map(tool => (
          <button key={tool.label} style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '4px 8px',
            background: '#fff', border: `2px solid ${T.ink}`,
            boxShadow: `2px 2px 0 0 ${T.ink}`,
            fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: T.ink,
            cursor: 'pointer', flexShrink: 0,
          }}>
            <span style={{ fontSize: 14, lineHeight: 1 }}>{tool.i}</span>
            <span style={{ lineHeight: 1 }}>{tool.label}</span>
          </button>
        ))}
      </div>

      {/* dialogue box */}
      <div style={{ position: 'absolute', left: 14, right: 14, bottom: 24, zIndex: 6 }}>
        {/* speaker tab */}
        <div style={{ display: 'inline-block', background: T.peach, border: `3px solid ${T.ink}`, borderBottom: 'none', padding: '4px 12px', fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 13, color: T.ink, marginLeft: 12, boxShadow: `3px -2px 0 0 ${T.peachShadow}` }}>
          MRS. HOPKINS · 환자
        </div>
        <div style={{ background: T.cream, border: `3px solid ${T.ink}`, padding: '14px 16px 12px', boxShadow: `4px 4px 0 0 ${T.ink}`, position: 'relative' }}>
          <div style={{ fontFamily: '"Galmuri11","Pretendard",sans-serif', fontSize: 14, color: T.ink, lineHeight: 1.55 }}>
            "Oh nurse... it's <u>throbbing</u> right here.<br/>
            I can hardly move my arm. <span style={{ background: T.yellow, padding: '0 3px' }}>It started about an hour ago.</span>"
          </div>
          {/* translate / hint row */}
          <div style={{ marginTop: 10, paddingTop: 10, borderTop: `2px dotted ${T.ink}33`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
            <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 11, color: T.textSoft, lineHeight: 1.4, flex: 1 }}>
              <b style={{ color: T.ink }}>throbbing</b> · 욱신거리는, 맥박치듯 아픈
            </div>
            <div style={{ background: T.mint, border: `2px solid ${T.ink}`, padding: '2px 8px', fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: T.ink, flexShrink: 0 }}>tap to 번역</div>
          </div>
          {/* blinking next-arrow */}
          <div style={{ position: 'absolute', right: 10, bottom: -8, width: 20, height: 20, background: T.yellow, border: `2px solid ${T.ink}`, fontFamily: '"DungGeunMo",monospace', fontSize: 12, lineHeight: '16px', textAlign: 'center', boxShadow: `2px 2px 0 0 ${T.ink}`, animation: 'forinBlink 0.8s steps(2,end) infinite' }}>▼</div>
        </div>

        {/* HINT-ON: response choices reveal */}
        {hintOn && (
          <>
            <div style={{ marginTop: 12, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ background: T.yellow, border: `2px solid ${T.ink}`, padding: '2px 8px', fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: T.ink, boxShadow: `2px 2px 0 0 ${T.ink}` }}>💡 HINT ON</div>
              <div style={{ flex: 1, height: 0, borderTop: `2px dotted ${T.ink}55` }}/>
              <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 10, color: T.cream, opacity: 0.85 }}>3가지 추천 답변</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, animation: 'forinSlideUp .25s ease-out' }}>
              <ChoiceRow num={1} text='"On a scale of 1 to 10, how bad is the pain?"' suggested/>
              <ChoiceRow num={2} text='"Can you describe what you were doing when it started?"'/>
              <ChoiceRow num={3} text='"Let me get the doctor right away."' risky/>
            </div>
          </>
        )}

        {/* FREE MODE: mic input field */}
        {!hintOn && (
          <div style={{ marginTop: 14 }}>
            <div style={{ background: '#fff', border: `3px solid ${T.ink}`, boxShadow: `3px 3px 0 0 ${T.ink}`, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, background: T.mint, border: `2px solid ${T.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0, boxShadow: `2px 2px 0 0 ${T.mintShadow}` }}>🎤</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: T.textSoft, lineHeight: 1 }}>SPEAK FREELY</div>
                <div style={{ fontFamily: '"Galmuri11","Pretendard",sans-serif', fontSize: 12, color: T.textFaint, marginTop: 4, lineHeight: 1.3 }}>마이크 버튼을 누르고 자유롭게 답해보세요…</div>
              </div>
              {/* sound wave animation */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 2, height: 20 }}>
                {[3, 7, 12, 8, 4].map((h, i) => (
                  <div key={i} style={{ width: 3, height: h, background: T.ink + '55', animation: `forinWave 0.8s ease-in-out infinite`, animationDelay: `${i * 0.1}s` }}/>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* bottom action rail */}
        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
          <button style={{ flex: 1, background: hintOn ? '#fff' : T.mint, border: `2px solid ${T.ink}`, padding: '6px 8px', fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: T.ink, boxShadow: `2px 2px 0 0 ${hintOn ? T.ink : T.mintShadow}` }}>🎤 직접 말하기</button>
          <button style={{ flex: 1, background: hintOn ? T.yellow : '#fff', border: `2px solid ${T.ink}`, padding: '6px 8px', fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: T.ink, boxShadow: `2px 2px 0 0 ${hintOn ? T.yellowShadow : T.ink}`, position: 'relative' }}>
            💡 힌트{hintOn && <span style={{ position: 'absolute', top: -6, right: -6, width: 14, height: 14, background: T.ink, color: T.yellow, fontFamily: '"DungGeunMo",monospace', fontSize: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>●</span>}
          </button>
          <button style={{ width: 44, background: '#fff', border: `2px solid ${T.ink}`, padding: '6px', fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: T.ink, boxShadow: `2px 2px 0 0 ${T.ink}` }}>⏸</button>
        </div>
      </div>

      <style>{`
        @keyframes forinBlink { 0%,49%{opacity:1} 50%,100%{opacity:0} }
        @keyframes forinShake { 0%,100%{transform:translateY(0) rotate(-3deg)} 50%{transform:translateY(-2px) rotate(3deg)} }
        @keyframes forinSlideUp { 0%{transform:translateY(12px);opacity:0} 100%{transform:translateY(0);opacity:1} }
        @keyframes forinWave { 0%,100%{transform:scaleY(.5)} 50%{transform:scaleY(1.3)} }
      `}</style>
    </div>
  );
}

function DialogueBackdrop() {
  const T = window.ForinTokens;
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#FCE7C8' }}>
      {/* room wall / floor split — peach on top, cream below */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `
        linear-gradient(180deg, ${T.peach} 0%, ${T.peach} 40%, ${T.cream} 40%, ${T.cream} 100%)
      `}}/>
    </div>
  );
}

function PortraitFrame({ children, name, side = 'L', status, hue }) {
  const T = window.ForinTokens;
  const bg = hue || T.peach;
  return (
    <div style={{ position: 'relative' }}>
      <div style={{ width: 110, height: 130, background: bg, border: `3px solid ${T.ink}`, boxShadow: `4px 4px 0 0 ${T.ink}`, padding: 6, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 6, background: 'rgba(255,255,255,0.5)' }}/>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', height: '100%' }}>{children}</div>
        {/* pixel scanline overlay */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `repeating-linear-gradient(0deg, rgba(0,0,0,.06) 0 1px, transparent 1px 3px)`, pointerEvents: 'none' }}/>
      </div>
      <div style={{
        background: '#fff', border: `2px solid ${T.ink}`, padding: '2px 8px',
        fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 10, color: T.ink,
        marginTop: 6, display: 'inline-block', boxShadow: `2px 2px 0 0 ${T.ink}`,
      }}>{name}</div>
      {status && (
        <div style={{ marginTop: 4, background: '#EF4444', color: '#fff', border: `2px solid ${T.ink}`, padding: '2px 6px', fontFamily: '"DungGeunMo",monospace', fontSize: 9, display: 'inline-block', boxShadow: `2px 2px 0 0 ${T.ink}` }}>
          {status}
        </div>
      )}
    </div>
  );
}

// Legacy big-pixel portraits (kept for reference; not used since Forin.Face
// adoption in dialogue + briefing). Safe to delete in a future cleanup.
function PixelPortraitPatient() {
  // bigger portrait — use crispEdges
  const C = '#374151';
  return (
    <svg width="86" height="100" viewBox="0 0 16 18" shapeRendering="crispEdges">
      {/* hair */}
      <rect x="3" y="1" width="10" height="3" fill="#9A6B3F"/>
      <rect x="2" y="3" width="2" height="6" fill="#9A6B3F"/>
      <rect x="12" y="3" width="2" height="6" fill="#9A6B3F"/>
      {/* face */}
      <rect x="4" y="3" width="8" height="7" fill="#FDE1C8" stroke={C} strokeWidth=".2"/>
      {/* eyes furrowed */}
      <rect x="5.5" y="5.5" width="1.5" height="1" fill={C}/>
      <rect x="9" y="5.5" width="1.5" height="1" fill={C}/>
      <rect x="5.5" y="5" width="1.5" height=".5" fill="#9A6B3F"/>
      <rect x="9" y="5" width="1.5" height=".5" fill="#9A6B3F"/>
      {/* blush */}
      <rect x="5" y="7" width="1" height=".8" fill="#F9A8B4" opacity=".7"/>
      <rect x="10" y="7" width="1" height=".8" fill="#F9A8B4" opacity=".7"/>
      {/* worried mouth */}
      <rect x="7" y="8" width="2" height=".5" fill="#7C2D12"/>
      <rect x="6.5" y="8.5" width="1" height=".5" fill="#7C2D12"/>
      <rect x="8.5" y="8.5" width="1" height=".5" fill="#7C2D12"/>
      {/* gown */}
      <rect x="3" y="10" width="10" height="8" fill="#FED7AA" stroke={C} strokeWidth=".2"/>
      <rect x="6" y="11" width="4" height="1" fill="#fff"/>
    </svg>
  );
}

function PixelPortraitNurse() {
  const C = '#374151';
  return (
    <svg width="86" height="100" viewBox="0 0 16 18" shapeRendering="crispEdges">
      {/* hat */}
      <rect x="4" y="0" width="8" height="2" fill="#fff" stroke={C} strokeWidth=".2"/>
      <rect x="7" y="1" width="2" height="1" fill="#EF4444"/>
      {/* hair side */}
      <rect x="3" y="2" width="2" height="6" fill="#2D2417"/>
      <rect x="11" y="2" width="2" height="6" fill="#2D2417"/>
      <rect x="3" y="2" width="10" height="2" fill="#2D2417"/>
      {/* face */}
      <rect x="4" y="3" width="8" height="6" fill="#FDE1C8" stroke={C} strokeWidth=".2"/>
      {/* eyes smile */}
      <rect x="5.5" y="6" width="1.5" height="1" fill={C}/>
      <rect x="9" y="6" width="1.5" height="1" fill={C}/>
      {/* blush */}
      <rect x="5" y="7.5" width="1" height=".8" fill="#F9A8B4" opacity=".8"/>
      <rect x="10" y="7.5" width="1" height=".8" fill="#F9A8B4" opacity=".8"/>
      {/* smile */}
      <rect x="6.5" y="8" width="3" height=".5" fill="#F87171"/>
      {/* outfit */}
      <rect x="3" y="10" width="10" height="8" fill="#A7F3D0" stroke={C} strokeWidth=".2"/>
      <rect x="7" y="11" width="2" height="2" fill="#EF4444"/>
      <rect x="6" y="11.5" width="4" height="1" fill="#EF4444"/>
      <rect x="5" y="14" width="6" height="1" fill="#fff" opacity=".5"/>
    </svg>
  );
}

function ChoiceRow({ num, text, suggested, risky }) {
  const T = window.ForinTokens;
  return (
    <div style={{
      display: 'flex', alignItems: 'stretch',
      background: suggested ? '#fff' : 'rgba(255,255,255,0.92)',
      border: `2px solid ${T.ink}`,
      boxShadow: suggested ? `3px 3px 0 0 ${T.mintShadow}` : `2px 2px 0 0 ${T.ink}66`,
      cursor: 'pointer', position: 'relative',
    }}>
      <div style={{
        width: 28, background: suggested ? T.mint : (risky ? T.red : T.peach),
        borderRight: `2px solid ${T.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: '"DungGeunMo",monospace', fontSize: 14, color: T.ink,
      }}>{num}</div>
      <div style={{ flex: 1, padding: '8px 10px', fontFamily: '"Galmuri11","Pretendard",sans-serif', fontSize: 12, color: T.ink, lineHeight: 1.4 }}>
        {text}
        {suggested && <div style={{ marginTop: 3, fontFamily: '"DungGeunMo",monospace', fontSize: 9, color: T.mintShadow }}>★ AI 추천 · 미션 진행</div>}
        {risky && <div style={{ marginTop: 3, fontFamily: '"DungGeunMo",monospace', fontSize: 9, color: '#B91C1C' }}>⚠ 평판 −2 위험</div>}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
function ScreenDialogueResult() {
  const T = window.ForinTokens;
  const containerRef = React.useRef(null);
  const stickerRef = React.useRef(null);
  const [bursts, setBursts] = React.useState([]);
  const nextIdRef = React.useRef(1);

  // Convert a viewport point to container CSS pixels, accounting for any
  // CSS scale (Phone frame, DesignCanvas zoom).
  function toLocal(clientX, clientY) {
    const c = containerRef.current;
    if (!c) return { x: 0, y: 0 };
    const r = c.getBoundingClientRect();
    const sx = (c.clientWidth  || 1) / (r.width  || 1);
    const sy = (c.clientHeight || 1) / (r.height || 1);
    return { x: (clientX - r.left) * sx, y: (clientY - r.top) * sy };
  }
  function spawnBurst(x, y) {
    const id = nextIdRef.current++;
    setBursts(prev => [...prev, { id, x, y }]);
    setTimeout(() => setBursts(curr => curr.filter(b => b.id !== id)), 4600);
  }

  // Initial burst is OFF by default so a Result screen merely *visible* in the
  // multi-artboard canvas runs zero animations (48-particle WAAPI bursts across
  // several visible artboards froze the page). Confetti fires only on click.
  React.useEffect(() => {}, []);

  // Click anywhere on the background → trigger a new burst.
  // Clicks on buttons are ignored so the action rail still works.
  function onBgClick(e) {
    if (e.target.closest('button')) return;
    const p = toLocal(e.clientX, e.clientY);
    spawnBurst(p.x, p.y);
  }

  return (
    <div
      ref={containerRef}
      onClick={onBgClick}
      data-screen-label="08 Result"
      style={{ height: '100%', background: T.cream, position: 'relative', overflow: 'hidden', cursor: 'pointer' }}
    >
      {/* Confetti layer — above background, below content */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1, overflow: 'hidden' }}>
        <ConfettiStyles/>
        {bursts.map(b => <ConfettiBurst key={b.id} x={b.x} y={b.y}/>)}
      </div>

      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '52px 16px 8px', display: 'flex', justifyContent: 'space-between', zIndex: 3 }}>
        <button style={{ background: '#fff', border: `2px solid ${T.ink}`, padding: '4px 10px', fontFamily: '"DungGeunMo",monospace', fontSize: 11, boxShadow: `2px 2px 0 0 ${T.ink}` }}>‹ 맵으로</button>
        <button style={{ background: T.yellow, border: `2px solid ${T.ink}`, padding: '4px 10px', fontFamily: '"DungGeunMo",monospace', fontSize: 11, boxShadow: `2px 2px 0 0 ${T.yellowShadow}` }}>↗ 공유</button>
      </div>

      <div style={{ padding: '70px 22px 0', textAlign: 'center', position: 'relative', zIndex: 2 }}>
        <div style={{ fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 12, color: T.textSoft }}>SCENARIO CLEAR!</div>
        <div style={{ fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 34, color: T.ink, lineHeight: 1.1, marginTop: 4, textShadow: `3px 3px 0 ${T.yellow}` }}>
          참 잘했어요!
        </div>
        <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 12, color: T.textSoft, marginTop: 8 }}>
          ER · 환자 통증 사정 #04
        </div>

        {/* sticker — burst anchor */}
        <div ref={stickerRef} style={{ margin: '18px auto', width: 130, height: 130, background: T.yellow, border: `4px solid ${T.ink}`, boxShadow: `5px 5px 0 0 ${T.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', transform: 'rotate(-4deg)' }}>
          <div style={{ width: 100, height: 100, borderRadius: '50%', border: `3px dashed ${T.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <PixelStar size={32}/>
            <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 14, color: T.ink, marginTop: 4 }}>참잘했</div>
            <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 12, color: T.ink }}>어요</div>
          </div>
        </div>

        {/* rewards */}
        <div style={{ background: '#fff', border: `3px solid ${T.ink}`, boxShadow: `4px 4px 0 0 ${T.ink}`, padding: 14, textAlign: 'left' }}>
          <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 12, color: T.textSoft, marginBottom: 10 }}>REWARDS</div>
          <RewardRow icon="⭐" label="경험치" value="+ 120 XP"/>
          <RewardRow icon="❤️" label="환자 만족도" value="+ 8" tone={T.mint}/>
          <RewardRow icon="🤝" label="동료 신뢰도" value="+ 4" tone={T.mint}/>
          <RewardRow icon="🎖" label="새 자격증 진척" value="응급 대응 · 65%" tone={T.peach}/>

          <div style={{ marginTop: 12, paddingTop: 12, borderTop: `2px dotted ${T.ink}33`, fontFamily: '"Galmuri11",monospace', fontSize: 11, color: T.ink, lineHeight: 1.5 }}>
            "오늘 당신은 3명의 환자에게 미소를 주었습니다." 💌
          </div>
        </div>

        <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
          <PixelButton bg="#fff" shadow={T.ink + '33'} style={{ flex: 1 }}>📓 리뷰랩에 저장</PixelButton>
          <PixelButton bg={T.mint} shadow={T.mintShadow} style={{ flex: 1 }}>다음 시나리오 ▶</PixelButton>
        </div>
      </div>
    </div>
  );
}

function RewardRow({ icon, label, value, tone }) {
  const T = window.ForinTokens;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', borderBottom: `1.5px dotted ${T.ink}22` }}>
      <div style={{ width: 28, height: 28, background: tone || T.cream, border: `2px solid ${T.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>{icon}</div>
      <div style={{ flex: 1, fontFamily: '"Galmuri11",monospace', fontSize: 12, color: T.ink }}>{label}</div>
      <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 12, color: T.ink }}>{value}</div>
    </div>
  );
}

// ConfettiStyles — singleton style tag for keyframes used by ConfettiBurst.
// ConfettiStyles — only flash keyframes here. Parabolic confetti motion is
// driven per-particle by Web Animations API (see ConfettiBurst) — that lets
// each particle have its OWN parabola through (0,0)→(peakT, peak)→(1,final),
// which CSS @keyframes can't express because they're global.
function ConfettiStyles() {
  return (
    <style>{`
      @keyframes forinFlash {
        0%   { opacity: 0; transform: translate(-50%,-50%) scale(0.4); }
        20%  { opacity: 1; transform: translate(-50%,-50%) scale(1.4); }
        60%  { opacity: 0; transform: translate(-50%,-50%) scale(2.2); }
        100% { opacity: 0; transform: translate(-50%,-50%) scale(2.4); }
      }
    `}</style>
  );
}

// ConfettiBurst — one-shot firework burst at container-local (x, y).
//
// Each ember follows a real parabola y(t) = α(t)·peakY + β(t)·finalY where
// α and β are Lagrange basis polynomials interpolating through three
// points: (0,0), (peakT, peakY), (1, finalY). The horizontal axis moves at
// constant velocity, the vertical axis decelerates to the peak then
// accelerates back down — exactly like projectile motion under gravity.
function ConfettiBurst({ x, y }) {
  const T = window.ForinTokens;
  const colors = [T.mint, T.peach, T.yellow, T.pink, T.blue, '#A78BFA', '#FCA5A5', '#10B981'];

  // Stable particle set — memoized so re-renders don't re-randomize.
  const pieces = React.useMemo(() => Array.from({ length: 18 }, () => {
    const angle = Math.random() * Math.PI * 2;
    const speed = 70 + Math.random() * 180;                       // 70-250 px radial
    const dx = Math.round(Math.cos(angle) * speed);
    return {
      finalX: dx,
      peakY:  -(60 + Math.random() * 130),                        // peak 60-190 px above origin
      finalY: 480 + Math.round(Math.random() * 260),              // ends 480-740 px below origin
      peakT:  0.32 + Math.random() * 0.10,                        // peak at 32-42% of duration
      c:      colors[Math.floor(Math.random() * colors.length)],
      dur:    (2.6 + Math.random() * 1.4) * 1000,                 // 2.6-4.0 s in ms
      rot:    Math.round(Math.random() * 720 - 360),
      size:   7 + Math.floor(Math.random() * 3) * 2,              // 7 / 9 / 11
    };
  }), []);

  // Refs for each particle so we can attach Web Animations to them.
  const refs = React.useRef([]);

  React.useEffect(() => {
    pieces.forEach((p, i) => {
      const el = refs.current[i];
      if (!el) return;

      // Sample the parabola at N+1 evenly-spaced times. Web Animations will
      // linearly interpolate between samples; with N=30 the curve looks
      // perfectly smooth.
      const N = 30;
      const frames = [];
      for (let k = 0; k <= N; k++) {
        const t = k / N;
        // Lagrange basis polynomials passing through (0,0), (peakT, peakY), (1, finalY).
        // α(t) is 1 at t=peakT, 0 at t=0 and t=1.
        // β(t) is 1 at t=1,     0 at t=0 and t=peakT.
        const alpha = (t * (t - 1)) / (p.peakT * (p.peakT - 1));
        const beta  = (t * (t - p.peakT)) / (1 - p.peakT);
        const yt = alpha * p.peakY + beta * p.finalY;
        const xt = p.finalX * t;
        const rotT = p.rot * t;
        // Fade in fast, hold, fade out near the end.
        const op =
          t < 0.05 ? t / 0.05 :
          t > 0.88 ? Math.max(0, 1 - (t - 0.88) / 0.12) :
          1;
        frames.push({
          transform: `translate(calc(-50% + ${xt.toFixed(2)}px), calc(-50% + ${yt.toFixed(2)}px)) rotate(${rotT.toFixed(2)}deg)`,
          opacity: op,
          // pre-sampling already encodes the timing, so each step should be linear
          easing: 'linear',
        });
      }
      el.animate(frames, {
        duration: p.dur,
        easing: 'linear',
        fill: 'forwards',
      });
    });
  }, [pieces]);

  return (
    <React.Fragment>
      {/* warm flash at burst origin */}
      <div style={{
        position: 'absolute', left: x, top: y,
        width: 60, height: 60,
        transform: 'translate(-50%,-50%) scale(0.4)',
        background: 'radial-gradient(circle, rgba(255,255,210,0.95) 0%, rgba(255,200,100,0) 65%)',
        animation: 'forinFlash 0.7s forwards',
        pointerEvents: 'none',
      }}/>
      {/* embers */}
      {pieces.map((p, i) => (
        <div
          key={i}
          ref={el => (refs.current[i] = el)}
          style={{
            position: 'absolute', left: x, top: y,
            width: p.size, height: p.size,
            background: p.c, border: `1.5px solid ${T.ink}`,
            // Initial transform — overridden immediately by Web Animation.
            transform: 'translate(-50%, -50%)',
            opacity: 0,
            pointerEvents: 'none',
          }}
        />
      ))}
    </React.Fragment>
  );
}

Object.assign(window, { ScreenDialogue, ScreenDialogueResult });
