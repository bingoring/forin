// ds-primitives.jsx — DS pages for buttons / boxes / chips / bars / chrome.

// ─── 1. Pixel primitives (button, box, chip, statbar) ──────────────
function ScreenDSPrimitives() {
  const F = window.Forin;
  const t = F.tokens;

  return (
    <DSPage
      title="Pixel Primitives"
      subtitle="기본 UI 빌딩 블록. 모든 버튼/박스는 3px 두께 검정 외곽선 + 3-4px 단단한 그림자. 데이터 표시(StatTile/MiniStat/StatBar/Pips), 강조(Highlight/Badge), 필터(FilterTab), 진행(PathStepper) 포함."
      accent="#FFEDD5"
    >
      <DSSection title="◆ Button" hint="Forin.Button — size: sm / md / lg, full bool, variant: hud / block">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: t.ink, opacity: 0.65, marginBottom: 8 }}>
              ━ variant=&quot;hud&quot; (기본) · HUD 빠른이동·A 버튼과 동일 스타일 ━
            </div>
            <DSRow gap={14} align="center">
              <F.Button size="sm">small</F.Button>
              <F.Button size="md">medium</F.Button>
              <F.Button size="lg">large</F.Button>
              <F.Button bg={t.peach} shadow={t.peachShadow}>Secondary</F.Button>
              <F.Button bg={t.yellow} shadow={t.yellowShadow}>Highlight</F.Button>
              <F.Button bg="#FCA5A5" shadow="#DC2626" color="#7F1D1D">긴급</F.Button>
              <F.Button bg="#1F2937" color="#A7F3D0" shadow="#0F172A">Dark</F.Button>
            </DSRow>
          </div>
          <div>
            <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: t.ink, opacity: 0.65, marginBottom: 8 }}>
              ━ variant=&quot;block&quot; · 납작한 3D 직육면체 (옆면 두께 강조) ━
            </div>
            <DSRow gap={14} align="center">
              <F.Button variant="block" size="sm">small</F.Button>
              <F.Button variant="block" size="md">medium</F.Button>
              <F.Button variant="block" size="lg">large</F.Button>
              <F.Button variant="block" bg={t.peach} shadow={t.peachShadow}>Secondary</F.Button>
              <F.Button variant="block" bg={t.yellow} shadow={t.yellowShadow}>Highlight</F.Button>
              <F.Button variant="block" bg="#FCA5A5" shadow="#DC2626" color="#7F1D1D">긴급</F.Button>
              <F.Button variant="block" bg="#1F2937" color="#A7F3D0" shadow="#0F172A">Dark</F.Button>
            </DSRow>
          </div>
        </div>
        <div style={{ marginTop: 14, maxWidth: 320, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <F.Button full>전체 너비 · hud</F.Button>
          <F.Button full variant="block">전체 너비 · block</F.Button>
        </div>
        <div style={{ marginTop: 14, fontFamily: '"Galmuri11",monospace', fontSize: 11, color: t.ink, opacity: 0.7, lineHeight: 1.6 }}>
          props: <DSCode>{'bg, color, shadow, size, full, variant, onClick, disabled'}</DSCode><br/>
          호버 시 살짝 떠오르고, 클릭하면 그림자 위치까지 눌립니다. 두 버전 모두 마우스로 직접 눌러보세요.
        </div>
      </DSSection>

      <DSSection title="◆ Box" hint="Forin.Box — 카드 / 패널 컨테이너">
        <DSGrid minItem={180}>
          <F.Box>
            <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 12 }}>Default cream</div>
            <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 11, marginTop: 4 }}>기본 카드 박스</div>
          </F.Box>
          <F.Box bg={t.mint} shadow={t.mintShadow}>
            <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 12 }}>Mint</div>
            <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 11, marginTop: 4 }}>강조 카드</div>
          </F.Box>
          <F.Box bg={t.peach} shadow={t.peachShadow}>
            <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 12 }}>Peach</div>
            <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 11, marginTop: 4 }}>서브 카드</div>
          </F.Box>
          <F.Box bg={t.yellow} shadow={t.yellowShadow}>
            <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 12 }}>Yellow</div>
            <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 11, marginTop: 4 }}>퀘스트 안내</div>
          </F.Box>
        </DSGrid>
      </DSSection>

      <DSSection title="◆ Chip" hint="Forin.Chip — 인라인 태그">
        <DSRow gap={8} align="center">
          <F.Chip>기본</F.Chip>
          <F.Chip bg={t.mint}>완료</F.Chip>
          <F.Chip bg={t.peach}>진행중</F.Chip>
          <F.Chip bg="#FCA5A5">긴급</F.Chip>
          <F.Chip bg="#1F2937" color="#fff">Dark</F.Chip>
          <F.Chip bg={t.pink}>소아과</F.Chip>
          <F.Chip bg={t.blue}>안내</F.Chip>
          <F.Chip bg={t.lilac}>OR</F.Chip>
        </DSRow>
      </DSSection>

      <DSSection title="◆ StatBar" hint="Forin.StatBar — HP/MP 스타일 진행률 바">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <F.StatBar label="HP"  value={92} max={100} color={t.mint} w={200}/>
          <F.StatBar label="EXP" value={48} max={100} color="#FACC15" w={200}/>
          <F.StatBar label="RU"  value={22} max={50}  color="#A78BFA" w={200}/>
          <F.StatBar value={75} max={100} color="#F87171" w={200}/>
        </div>
      </DSSection>

      <DSSection title="◆ Dropdown" hint="Forin.PixelDropdown — 라벨 · 값 · ▼ 화살표 버튼 · 펼침 목록 (닫힘/열림 두 상태)">
        <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 11, color: t.textSoft, marginBottom: 12, lineHeight: 1.5 }}>
          "눌러서 펼친다"가 한눈에 보이도록 오른쪽에 <b>구분선 + 픽셀 삼각형 화살표 버튼</b>을 붙였습니다.
          열리면 화살표가 뒤집히고(▲) 트리거가 눌린 상태(그림자 제거)가 되며, 아래로 목록 패널이 붙어 나옵니다.
          선택된 항목에는 ✓ 와 민트 배경.
        </div>
        <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start', minHeight: 330 }}>
          <div>
            <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: t.ink, marginBottom: 6 }}>닫힘 (기본)</div>
            <F.PixelDropdown label="정렬" value="긴급도 순" width={172}
              items={['긴급도 순', '최신 순', '소요 시간 짧은 순', '레벨 낮은 순']}/>
          </div>
          <div>
            <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: t.ink, marginBottom: 6 }}>열림</div>
            <F.PixelDropdown label="정렬" value="긴급도 순" width={172} open
              items={['긴급도 순', '최신 순', '소요 시간 짧은 순', '레벨 낮은 순']}/>
          </div>
          <div>
            <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: t.ink, marginBottom: 6 }}>미선택</div>
            <F.PixelDropdown label="근무 부서" width={150}
              items={['응급의료센터', '중환자실 ICU', '수술실 OR']}/>
          </div>
        </div>
      </DSSection>

      <DSSection title="◆ Grid background" hint="Forin.gridBg(color, size) — 닷-그리드 텍스처">
        <div style={{
          height: 120, border: `2px solid ${t.ink}`,
          boxShadow: `3px 3px 0 0 ${t.ink}`,
          background: t.paper, ...F.gridBg(),
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: '"Galmuri11",monospace', fontSize: 12, color: t.ink,
        }}>
          기본 6px 닷 패턴 — 페이지 배경에 깔립니다.
        </div>
      </DSSection>
    </DSPage>
  );
}

// ─── 2. App chrome (TopBar, BottomNav, Mission Banner, HUD) ───────
function ScreenDSChrome() {
  const F = window.Forin;
  const t = F.tokens;

  return (
    <DSPage
      title="App Chrome"
      subtitle="스크린 골격을 이루는 영구 요소들: TopBar / Mission Banner / HUD / BottomNav."
      accent="#BAE6FD"
    >
      <DSSection title="◆ TopBar" hint="Forin.TopBar — 모든 스크린 상단" noPad>
        <div style={{ padding: 16, background: t.paper }}>
          <div style={{ border: `2px solid ${t.ink}`, boxShadow: `3px 3px 0 0 ${t.ink}` }}>
            <F.TopBar
              title="응급실 ER · 2F"
              left={<span style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 18, color: t.ink }}>‹</span>}
              right={<span style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 12, color: t.ink, display: 'inline-flex', alignItems: 'center', gap: 4 }}><F.Heart size={11}/> 92%</span>}
            />
          </div>
          <div style={{ marginTop: 8, fontFamily: '"Galmuri11",monospace', fontSize: 11, color: t.ink, opacity: 0.7 }}>
            props: <DSCode>{'title, left, right, bg'}</DSCode> · sticky top, 52px top padding for status bar
          </div>
        </div>
      </DSSection>

      <DSSection title="◆ Mission Banner" hint="InteriorScreen이 자동 렌더 · normal · urgent">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <MissionBanner urgent={false} dept="응급실 ER · 2F" text="너스 스테이션 · Dr. Patel 인계 받기"/>
          <MissionBanner urgent={true}  dept="중환자실 ICU · 5F" text="Room 3 환자의 인공호흡기 설정 닥터에게 보고 (SBAR)"/>
        </div>
        <div style={{ marginTop: 10, fontFamily: '"Galmuri11",monospace', fontSize: 11, color: t.ink, opacity: 0.7 }}>
          InteriorScreen의 <DSCode>{'missionText, missionUrgent'}</DSCode> prop으로 제어
        </div>
      </DSSection>

      <DSSection title="◆ HUD · Action controls" hint="Forin.DPad · Forin.IconButton — 이동 / 액션 버튼">
        <div style={{ background: '#E8E5D4', border: `2px solid ${t.ink}`, boxShadow: `3px 3px 0 0 ${t.ink}`, padding: '16px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ background: '#fff', border: `3px solid ${t.ink}`, padding: '6px 10px', flex: 1, boxShadow: `3px 3px 0 0 ${t.ink}` }}>
              <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 9, color: t.textSoft }}>ZONE</div>
              <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: t.ink }}>응급실 ER · 2F</div>
            </div>
            <F.IconButton bg={t.yellow} size={52} caption="빠른이동" fontSize={18}>🗺</F.IconButton>
            <F.DPad size={72}/>
            <F.IconButton bg={t.mint} size={52} fontSize={18}>A</F.IconButton>
          </div>
        </div>
        <div style={{ marginTop: 10, fontFamily: '"Galmuri11",monospace', fontSize: 11, color: t.ink, opacity: 0.7, lineHeight: 1.6 }}>
          마우스로 직접 눌러보세요 — 모든 버튼이 눌리면 살짝 함몰됩니다.<br/>
          <DSCode>{'<Forin.DPad onMove={(d)=>...}/>'}</DSCode> · d 는 <DSCode>up/down/left/right</DSCode>
        </div>
      </DSSection>

      <DSSection title="◆ IconButton 변형" hint="Forin.IconButton — 단일 글리프 정사각 버튼">
        <DSRow gap={14} align="center">
          <F.IconButton bg={t.mint} size={52} fontSize={18}>A</F.IconButton>
          <F.IconButton bg={t.peach} size={52} fontSize={18}>B</F.IconButton>
          <F.IconButton bg={t.yellow} size={52} caption="빠른이동" fontSize={18}>🗺</F.IconButton>
          <F.IconButton bg="#fff" size={52} fontSize={20}>＋</F.IconButton>
          <F.IconButton bg="#FCA5A5" size={52} fontSize={18}>✕</F.IconButton>
          <F.IconButton bg={t.mint} size={64} caption="확인" fontSize={22}>✓</F.IconButton>
          <F.IconButton bg="#E5E7EB" size={52} fontSize={18} disabled>🔒</F.IconButton>
        </DSRow>
        <div style={{ marginTop: 10, fontFamily: '"Galmuri11",monospace', fontSize: 11, color: t.ink, opacity: 0.7 }}>
          props: <DSCode>{'bg, color, size, fontSize, caption, onClick, disabled'}</DSCode>
        </div>
      </DSSection>

      <DSSection title="◆ BottomNav" hint="Forin.BottomNav — 4-tab persistent nav" noPad>
        <div style={{ position: 'relative', height: 100, background: t.paper, border: `2px solid ${t.ink}`, margin: 16, marginTop: 0 }}>
          <F.BottomNav active="campus"/>
        </div>
        <div style={{ padding: '0 16px 16px', fontFamily: '"Galmuri11",monospace', fontSize: 11, color: t.ink, opacity: 0.7 }}>
          tabs: 캠퍼스 · 상황판 · 리뷰랩 · 나 · <DSCode>{'active="campus|board|lab|me"'}</DSCode>
        </div>
      </DSSection>

      <DSSection title="◆ BayLabel" hint="Forin.BayLabel — 인테리어 안의 구역 라벨">
        <div style={{ position: 'relative', height: 60, background: '#E8E5D4', border: `2px solid ${t.ink}` }}>
          <F.BayLabel x={1.2} y={0.5} text="TRAUMA 1"/>
          <F.BayLabel x={9} y={0.5} text="BAY 4" highlight/>
          <F.BayLabel x={15} y={0.5} text="PLAYROOM"/>
        </div>
      </DSSection>
    </DSPage>
  );
}

function MissionBanner({ urgent, dept, text }) {
  const t = window.ForinTokens;
  return (
    <div style={{
      background: urgent ? '#FEE2E2' : t.yellow,
      border: `3px solid ${t.ink}`,
      padding: '8px 12px',
      boxShadow: `3px 3px 0 0 ${urgent ? '#EF4444' : t.yellowShadow}`,
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <div style={{
        width: 24, height: 24, background: urgent ? '#EF4444' : '#fff',
        color: urgent ? '#fff' : t.ink, border: `2px solid ${t.ink}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: '"DungGeunMo",monospace', fontSize: 14,
      }}>!</div>
      <div style={{ flex: 1 }}>
        <div style={{
          fontFamily: '"DungGeunMo",monospace', fontSize: 10,
          color: urgent ? '#7F1D1D' : t.textSoft, lineHeight: 1,
        }}>{urgent ? 'URGENT' : 'INSIDE'} · {dept}</div>
        <div style={{
          fontFamily: '"Galmuri11",monospace', fontSize: 12,
          color: t.ink, lineHeight: 1.2, marginTop: 3,
        }}>{text}</div>
      </div>
    </div>
  );
}

Object.assign(window, { ScreenDSPrimitives, ScreenDSChrome, MissionBanner });
