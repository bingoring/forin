// screens-map.jsx — Smart Map (hospital dollhouse) + 2D Exploration (tile world)

function ScreenSmartMap() {
  const T = window.ForinTokens;
  const floors = [
    { n: '6F', name: '일반 병동', scenes: 8, done: 5, hot: 1, color: T.peach, npc: '👩‍⚕️' },
    { n: '4F', name: '중환자실 ICU', scenes: 6, done: 2, hot: 2, color: T.mint, npc: '👨‍⚕️' },
    { n: '3F', name: '수술실 OR', scenes: 7, done: 7, hot: 0, color: T.lilac, npc: '🧑‍⚕️', clear: true },
    { n: '2F', name: '응급실 ER', scenes: 10, done: 4, hot: 3, color: T.red, npc: '🚑', active: true },
    { n: '1F', name: '접수 / 로비', scenes: 5, done: 5, hot: 0, color: T.yellow, npc: '🤵', clear: true },
    { n: 'B1', name: '식당 / 편의시설', scenes: 4, done: 1, hot: 0, color: T.peachDeep, npc: '🧑‍🍳' },
  ];

  return (
    <div data-screen-label="05 SmartMap" style={{ height: '100%', background: T.cream, position: 'relative' }}>
      <ForinTopBar
        title="SMART MAP"
        left={<div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 28, height: 28, background: T.mint, border: `2px solid ${T.ink}` }} />
        </div>}
        right={<div style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: '"DungGeunMo",monospace', fontSize: 12, color: T.ink }}>
          <PixelStar size={14}/> 248
        </div>}
      />

      {/* top status row */}
      <div style={{ padding: '14px 18px 8px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 11, color: T.textSoft }}>오늘의 미션</div>
          <div style={{ fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 15, color: T.ink, lineHeight: 1.3 }}>응급실에서 통증 사정 1건</div>
        </div>
        <div style={{ background: T.yellow, border: `2px solid ${T.ink}`, padding: '4px 8px', fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: T.ink, boxShadow: `2px 2px 0 0 ${T.yellowShadow}` }}>
          🔥 7일 연속
        </div>
      </div>

      {/* dollhouse */}
      <div style={{ margin: '8px 18px 0', position: 'relative' }}>
        {/* roof */}
        <div style={{ height: 26, background: T.red, border: `3px solid ${T.ink}`, borderBottom: 'none',
          clipPath: 'polygon(0 100%, 12% 0, 88% 0, 100% 100%)',
          marginBottom: -3, position: 'relative' }}>
          <div style={{ position: 'absolute', top: 4, left: '50%', transform: 'translateX(-50%)', background: '#fff', border: `2px solid ${T.ink}`, padding: '1px 8px', fontFamily: '"DungGeunMo",monospace', fontSize: 9, color: T.ink }}>
            🏥 HEALING HOSPITAL
          </div>
        </div>

        <div style={{ border: `3px solid ${T.ink}`, background: T.paper, boxShadow: `4px 4px 0 0 ${T.ink}` }}>
          {floors.map((f, i) => (
            <FloorRow key={f.n} f={f} isLast={i === floors.length - 1}/>
          ))}
        </div>

        {/* legend */}
        <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap', fontFamily: '"Galmuri11",monospace', fontSize: 10, color: T.textSoft }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 10, height: 10, background: T.yellow, border: `1.5px solid ${T.ink}`, display: 'inline-block' }}/>
            <span>!</span> 곤란한 상황
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 10, height: 10, background: T.mint, border: `1.5px solid ${T.ink}`, display: 'inline-block' }}/>
            클리어
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 10, height: 10, background: T.peach, border: `1.5px solid ${T.ink}`, display: 'inline-block' }}/>
            진행 중
          </span>
        </div>
      </div>

      <ForinBottomNav active="map"/>
    </div>
  );
}

function FloorRow({ f, isLast }) {
  const T = window.ForinTokens;
  const pct = Math.round((f.done / f.scenes) * 100);
  return (
    <div style={{
      display: 'flex', alignItems: 'stretch',
      borderBottom: isLast ? 'none' : `2px solid ${T.ink}`,
      background: f.active ? T.peach : 'transparent',
      position: 'relative',
      cursor: 'pointer',
    }}>
      {/* floor number */}
      <div style={{
        width: 44, background: f.color, borderRight: `2px solid ${T.ink}`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        fontFamily: '"DungGeunMo",monospace', fontSize: 14, color: T.ink,
      }}>
        {f.n}
      </div>
      {/* room cutaway */}
      <div style={{ flex: 1, padding: '8px 10px', position: 'relative', minHeight: 56 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 13, color: T.ink }}>{f.name}</span>
          {f.active && <PixelChip bg={T.yellow}>NOW HERE</PixelChip>}
          {f.clear && <PixelChip bg={T.mint}>CLEAR ✓</PixelChip>}
        </div>
        {/* tiny furniture sprites */}
        <div style={{ display: 'flex', gap: 6, marginTop: 6, alignItems: 'flex-end', height: 22, opacity: 0.95 }}>
          <span style={{ fontSize: 14 }}>{f.npc}</span>
          {f.n === '2F' && <><span style={{ fontSize: 13 }}>🛏</span><span style={{ fontSize: 13 }}>💉</span><span style={{ fontSize: 13 }}>📋</span></>}
          {f.n === '6F' && <><span style={{ fontSize: 13 }}>🛏</span><span style={{ fontSize: 13 }}>🌿</span></>}
          {f.n === '4F' && <><span style={{ fontSize: 13 }}>📺</span><span style={{ fontSize: 13 }}>🛏</span></>}
          {f.n === '3F' && <><span style={{ fontSize: 13 }}>💡</span><span style={{ fontSize: 13 }}>🔪</span></>}
          {f.n === '1F' && <><span style={{ fontSize: 13 }}>💺</span><span style={{ fontSize: 13 }}>📞</span></>}
          {f.n === 'B1' && <><span style={{ fontSize: 13 }}>🍱</span><span style={{ fontSize: 13 }}>☕</span></>}
        </div>
        {/* progress + quests */}
        <div style={{ position: 'absolute', right: 10, top: 8, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: T.textSoft }}>{f.done}/{f.scenes}</div>
          <div style={{ width: 60, height: 8, background: '#fff', border: `1.5px solid ${T.ink}` }}>
            <div style={{ width: `${pct}%`, height: '100%', background: f.clear ? T.mint : (f.active ? T.yellowDeep : T.mintDeep) }}/>
          </div>
          {f.hot > 0 && (
            <div style={{ background: T.yellow, border: `1.5px solid ${T.ink}`, padding: '1px 5px', fontFamily: '"DungGeunMo",monospace', fontSize: 9, color: T.ink, boxShadow: `2px 2px 0 0 ${T.ink}` }}>
              ! {f.hot} QUEST
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
function ScreenExplore() {
  const T = window.ForinTokens;

  // Build a tile map (12 cols x 14 rows)
  const W = 12, H = 14;
  // legend: '.'=floor, '#'=wall, 'B'=bed, 'C'=chair, 'D'=desk, 'S'=screen, '|'=door
  const map = [
    '############',
    '#..B.#..B..#',
    '#..B.#..B..#',
    '#....#.....#',
    '#....#.....#',
    '#####|######',
    '#..........#',
    '#...P......#',
    '#..........#',
    '##|####|####',
    '#...#......#',
    '#.D.#..B...#',
    '#.S.#..B...#',
    '############',
  ];
  const tileSize = 26;

  return (
    <div data-screen-label="06 Explore" style={{ height: '100%', background: T.cream, position: 'relative', overflow: 'hidden' }}>
      <ForinTopBar
        title="2F · 응급실"
        left={<span style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 18, color: T.ink }}>‹</span>}
        right={<span style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 12, color: T.ink, display: 'inline-flex', alignItems: 'center', gap: 4 }}><PixelHeart size={11}/> 92%</span>}
      />

      {/* mini-objective banner */}
      <div style={{ margin: '10px 16px 8px', background: T.yellow, border: `3px solid ${T.ink}`, padding: '8px 12px', boxShadow: `3px 3px 0 0 ${T.yellowShadow}`, display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 24, height: 24, background: '#fff', border: `2px solid ${T.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"DungGeunMo",monospace', fontSize: 13, flexShrink: 0 }}>!</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: T.textSoft }}>QUEST</div>
          <div style={{ fontFamily: '"Galmuri11","DungGeunMo",monospace', fontSize: 12, color: T.ink, lineHeight: 1.3 }}>4번 베드의 환자에게 통증을 사정하세요</div>
        </div>
      </div>

      {/* tile map */}
      <div style={{ margin: '4px 16px', padding: 8, background: T.peach, border: `3px solid ${T.ink}`, boxShadow: `4px 4px 0 0 ${T.ink}`, position: 'relative' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${W}, ${tileSize}px)`,
          gridTemplateRows: `repeat(${H}, ${tileSize}px)`,
          gap: 0, justifyContent: 'center', position: 'relative',
        }}>
          {map.flatMap((row, y) => row.split('').map((ch, x) => <Tile key={`${x}-${y}`} ch={ch} x={x} y={y}/>))}

          {/* NPCs over tiles */}
          <NPC col={3} row={2} icon="🤒" exclaim quest/>
          <NPC col={8} row={2} icon="😷"/>
          <NPC col={4} row={11} icon="👨‍⚕️" exclaim/>
          <NPC col={8} row={11} icon="🤕"/>

          {/* Player */}
          <div style={{ position: 'absolute', left: 7 * tileSize, top: 7 * tileSize, width: tileSize, height: tileSize, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {window.DerpPlayer ? <window.DerpPlayer size={32} tag=""/> : <PixelNurse size={26}/>}
            <div style={{ position: 'absolute', bottom: -4, fontFamily: '"DungGeunMo",monospace', fontSize: 8, background: '#fff', border: `1.5px solid ${T.ink}`, padding: '0 4px', whiteSpace: 'nowrap' }}>YOU</div>
          </div>

          {/* click path indicator */}
          <div style={{ position: 'absolute', left: 5 * tileSize + 6, top: 2 * tileSize + 6, width: 14, height: 14, border: `2px dashed ${T.yellowShadow}`, animation: 'forinPulse 1s steps(3,end) infinite' }}/>
        </div>
      </div>

      {/* HUD bottom */}
      <div style={{ position: 'absolute', bottom: 100, left: 16, right: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ background: '#fff', border: `3px solid ${T.ink}`, padding: '6px 10px', flex: 1, boxShadow: `3px 3px 0 0 ${T.ink}` }}>
          <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 9, color: T.textSoft }}>RANK</div>
          <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 13, color: T.ink }}>Junior Nurse</div>
        </div>
        <button style={{ width: 60, height: 60, background: T.mint, border: `3px solid ${T.ink}`, boxShadow: `4px 4px 0 0 ${T.mintShadow}`, fontFamily: '"DungGeunMo",monospace', fontSize: 22, color: T.ink, cursor: 'pointer' }}>💬</button>
      </div>

      <ForinBottomNav active="explore"/>

      <style>{`@keyframes forinPulse { 0%,100%{opacity:1} 50%{opacity:.3} }`}</style>
    </div>
  );
}

function Tile({ ch }) {
  const T = window.ForinTokens;
  if (ch === '#') {
    return <div style={{ background: T.peachShadow, borderRight: `1px solid ${T.ink}33`, borderBottom: `1px solid ${T.ink}33` }}/>;
  }
  if (ch === '|') {
    return <div style={{ background: T.mint, borderRight: `1px solid ${T.ink}33` }}/>;
  }
  // floor base + furniture
  return (
    <div style={{ background: '#FFF8E7', position: 'relative', backgroundImage: `linear-gradient(45deg, transparent 46%, ${T.ink}10 47%, ${T.ink}10 53%, transparent 54%)`, backgroundSize: '8px 8px' }}>
      {ch === 'B' && <div style={{ position: 'absolute', inset: 2, background: T.blue, border: `1.5px solid ${T.ink}` }}>
        <div style={{ position: 'absolute', top: 2, left: 2, right: 2, height: 6, background: '#fff', borderBottom: `1px solid ${T.ink}66` }}/>
      </div>}
      {ch === 'D' && <div style={{ position: 'absolute', inset: 2, background: '#A88862', border: `1.5px solid ${T.ink}` }}/>}
      {ch === 'S' && <div style={{ position: 'absolute', inset: 2, background: T.lilac, border: `1.5px solid ${T.ink}` }}>
        <div style={{ position: 'absolute', inset: 3, background: '#1F2937' }}>
          <div style={{ position: 'absolute', left: 2, right: 2, top: 4, height: 1, background: T.mint }}/>
          <div style={{ position: 'absolute', left: 2, right: 2, top: 7, height: 1, background: T.mint }}/>
        </div>
      </div>}
      {ch === 'C' && <div style={{ position: 'absolute', left: 6, top: 6, right: 6, bottom: 6, background: T.peachDeep, border: `1.5px solid ${T.ink}` }}/>}
    </div>
  );
}

function NPC({ col, row, icon, exclaim, quest }) {
  const T = window.ForinTokens;
  const tileSize = 26;
  return (
    <div style={{ position: 'absolute', left: col * tileSize, top: row * tileSize, width: tileSize, height: tileSize, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
      <span>{icon}</span>
      {exclaim && (
        <div style={{ position: 'absolute', top: -14, right: -2, background: quest ? T.yellow : '#fff', border: `2px solid ${T.ink}`, width: 14, height: 14, fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: T.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `2px 2px 0 0 ${T.ink}`, animation: 'forinBob 1.2s ease-in-out infinite' }}>
          !
        </div>
      )}
      <style>{`@keyframes forinBob { 0%,100% {transform:translateY(0)} 50% {transform:translateY(-3px)} }`}</style>
    </div>
  );
}

Object.assign(window, { ScreenSmartMap, ScreenExplore });
