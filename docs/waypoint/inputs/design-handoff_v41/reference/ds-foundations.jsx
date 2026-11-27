// ds-foundations.jsx — DS pages for Tokens, Type, Icons.
//
// Pulls the LIVE values from window.ForinTokens and window.IP — when those
// are tweaked (e.g. via the Tweaks panel), this catalog auto-updates.

// ─── 1. Color tokens ───────────────────────────────────────────────
function ScreenDSColors() {
  const t = window.ForinTokens;
  const IP = window.IP;

  // Token group definitions — labels + hex pulled from live tokens.
  const brand = [
    { name: 'mint',         hex: t.mint,         sub: 'Primary accent' },
    { name: 'mintDeep',     hex: t.mintDeep,     sub: 'Hover/active' },
    { name: 'mintShadow',   hex: t.mintShadow,   sub: 'Button shadow' },
    { name: 'peach',        hex: t.peach,        sub: 'Secondary surface' },
    { name: 'peachDeep',    hex: t.peachDeep,    sub: 'Gown / accent' },
    { name: 'peachShadow',  hex: t.peachShadow,  sub: 'Shadow' },
    { name: 'yellow',       hex: t.yellow,       sub: 'Quest / highlight' },
    { name: 'yellowDeep',   hex: t.yellowDeep,   sub: 'Active highlight' },
    { name: 'yellowShadow', hex: t.yellowShadow, sub: 'Shadow' },
  ];

  const surface = [
    { name: 'cream', hex: t.cream, sub: 'Card surface' },
    { name: 'paper', hex: t.paper, sub: 'Page background' },
    { name: 'ink',   hex: t.ink,   sub: 'Border / text' },
  ];

  const text = [
    { name: 'text',      hex: t.text,      sub: 'Body text' },
    { name: 'textSoft',  hex: t.textSoft,  sub: 'Secondary' },
    { name: 'textFaint', hex: t.textFaint, sub: 'Disabled' },
  ];

  const semantic = [
    { name: 'pink',  hex: t.pink,  sub: 'Peds, soft cue' },
    { name: 'blue',  hex: t.blue,  sub: 'Info' },
    { name: 'red',   hex: t.red,   sub: 'Urgent / alert' },
    { name: 'lilac', hex: t.lilac, sub: 'OR / specialty' },
  ];

  const interiorFloor = [
    { name: 'floorClinical',     hex: IP.floorClinical,     sub: 'ER / Ward base' },
    { name: 'floorClinicalAlt',  hex: IP.floorClinicalAlt,  sub: 'ER / Ward alt' },
    { name: 'floorSterile',      hex: IP.floorSterile,      sub: 'OR base' },
    { name: 'floorSterileAlt',   hex: IP.floorSterileAlt,   sub: 'OR alt' },
    { name: 'floorPeds',         hex: IP.floorPeds,         sub: 'Pediatrics base' },
    { name: 'floorPedsAlt',      hex: IP.floorPedsAlt,      sub: 'Pediatrics alt' },
    { name: 'floorICU',          hex: IP.floorICU,          sub: 'ICU base' },
    { name: 'floorICUAlt',       hex: IP.floorICUAlt,       sub: 'ICU alt' },
    { name: 'floorPharma',       hex: IP.floorPharma,       sub: 'Pharmacy base' },
    { name: 'floorPharmaAlt',    hex: IP.floorPharmaAlt,    sub: 'Pharmacy alt' },
  ];

  const interiorBuilding = [
    { name: 'wall',         hex: IP.wall,         sub: 'Wall face' },
    { name: 'wallTop',      hex: IP.wallTop,      sub: 'Wall top edge' },
    { name: 'wallSide',     hex: IP.wallSide,     sub: 'Wall side highlight' },
    { name: 'wallShadow',   hex: IP.wallShadow,   sub: 'Wall shadow' },
    { name: 'groutLine',    hex: IP.groutLine,    sub: 'Tile grout' },
    { name: 'glass',        hex: IP.glass,        sub: 'Glass partition' },
    { name: 'glassFrame',   hex: IP.glassFrame,   sub: 'Glass frame' },
    { name: 'doorWood',     hex: IP.doorWood,     sub: 'Wood door' },
    { name: 'doorAccent',   hex: IP.doorAccent,   sub: 'Door highlight' },
    { name: 'doorAuto',     hex: IP.doorAuto,     sub: 'Auto / sliding door' },
  ];

  const interiorMaterial = [
    { name: 'metal',      hex: IP.metal,      sub: 'Stainless surface' },
    { name: 'metalDk',    hex: IP.metalDk,    sub: 'Stainless dark' },
    { name: 'blueScrub',  hex: IP.blueScrub,  sub: 'Surgical scrubs' },
    { name: 'greenScrub', hex: IP.greenScrub, sub: 'Nurse scrubs' },
  ];

  return (
    <DSPage
      title="Colors"
      subtitle="모든 컬러는 window.ForinTokens (UI) 와 window.IP (interior) 에서 라이브로 가져옵니다. Tweaks 패널의 팔레트 변경이 즉시 반영됩니다."
    >
      <DSSection title="◆ Brand · Surface · Text" hint="Forin.tokens.*">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <DSGrid minItem={130}>
            {brand.map(c => <DSSwatch key={c.name} {...c}/>)}
          </DSGrid>
          <DSGrid minItem={130}>
            {surface.map(c => <DSSwatch key={c.name} {...c}/>)}
            {text.map(c => <DSSwatch key={c.name} {...c}/>)}
          </DSGrid>
          <DSGrid minItem={130}>
            {semantic.map(c => <DSSwatch key={c.name} {...c}/>)}
          </DSGrid>
        </div>
      </DSSection>

      <DSSection title="◆ Interior Floors" hint="Forin.interior.floor* — 부서별 바닥 톤">
        <DSGrid minItem={130}>
          {interiorFloor.map(c => <DSSwatch key={c.name} {...c}/>)}
        </DSGrid>
      </DSSection>

      <DSSection title="◆ Interior Building" hint="Forin.interior.* — 벽 / 유리 / 도어">
        <DSGrid minItem={130}>
          {interiorBuilding.map(c => <DSSwatch key={c.name} {...c}/>)}
        </DSGrid>
      </DSSection>

      <DSSection title="◆ Interior Material" hint="Forin.interior.metal* / scrub*">
        <DSGrid minItem={130}>
          {interiorMaterial.map(c => <DSSwatch key={c.name} {...c}/>)}
        </DSGrid>
      </DSSection>
    </DSPage>
  );
}

// ─── 2. Typography ─────────────────────────────────────────────────
function ScreenDSType() {
  return (
    <DSPage
      title="Typography"
      subtitle="forin은 한글 픽셀 폰트 두 종류와 깔끔한 산세리프 fallback을 함께 씁니다."
      accent="#FFEDD5"
    >
      <DSSection title="◆ Font families">
        <DSGrid minItem={260} gap={14}>
          <DSCard name="Galmuri11" sub="본문 — quiple/galmuri" bg="#fff" previewH={120}>
            <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 13, color: '#2A2522', lineHeight: 1.5, padding: 12, textAlign: 'center' }}>
              응급실 · 통증 사정<br/>
              <span style={{ fontWeight: 700 }}>The quick brown fox</span>
            </div>
          </DSCard>
          <DSCard name="DungGeunMo" sub="제목 · 라벨 — projectnoonnu" bg="#fff" previewH={120}>
            <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 14, color: '#2A2522', lineHeight: 1.5, padding: 12, textAlign: 'center' }}>
              긴급 · TRAUMA 1<br/>
              <span style={{ fontSize: 18 }}>READY GO!</span>
            </div>
          </DSCard>
          <DSCard name="Pretendard" sub="fallback (영문 · 숫자)" bg="#fff" previewH={120}>
            <div style={{ fontFamily: '"Pretendard",sans-serif', fontSize: 13, color: '#2A2522', lineHeight: 1.5, padding: 12, textAlign: 'center' }}>
              forin v2 · 2026<br/>
              <span style={{ fontWeight: 600 }}>120/80 mmHg</span>
            </div>
          </DSCard>
        </DSGrid>
      </DSSection>

      <DSSection title="◆ Type scale" hint="px 단위 — 픽셀 폰트라 짝수 권장">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <DSTypeSpec family='"DungGeunMo",monospace' size={22} sample="Heading · 22" sub="DS / Page title"/>
          <DSTypeSpec family='"DungGeunMo",monospace' size={18} sample="Subtitle · 18" sub="Screen heading"/>
          <DSTypeSpec family='"DungGeunMo",monospace' size={15} sample="App TopBar · 15" sub="ForinTopBar title"/>
          <DSTypeSpec family='"DungGeunMo",monospace' size={13} sample="Section · 13" sub="PixelButton md"/>
          <DSTypeSpec family='"Galmuri11",monospace'  size={13} sample="본문 — 한국어 13" sub="Mission text"/>
          <DSTypeSpec family='"Galmuri11",monospace'  size={11} sample="Caption · 11px (소문자 안내)" sub="Section hint / chip"/>
          <DSTypeSpec family='"DungGeunMo",monospace' size={10} sample="LABEL · 10" sub="HUD / bay label"/>
          <DSTypeSpec family='"DungGeunMo",monospace' size={8}  sample="MICRO · 8px badge"          sub="Door / hotspot label"/>
          <DSTypeSpec family='"DungGeunMo",monospace' size={6}  sample="TINY · 6px in-game"        sub="Cabinet sticker · NPC tag"/>
        </div>
      </DSSection>
    </DSPage>
  );
}

// ─── 3. Icons & flags ──────────────────────────────────────────────
function ScreenDSIcons() {
  const F = window.Forin;
  return (
    <DSPage
      title="Icons & Flags"
      subtitle="모든 아이콘은 SVG 픽셀 그리드. size prop으로 임의 크기 가능."
      accent="#FEF08A"
    >
      <DSSection title="◆ Pixel icons" hint="Forin.Heart · Forin.Star">
        <DSGrid minItem={130}>
          <DSCard name="Heart" sub="filled" code='<Forin.Heart size={18}/>'>
            <F.Heart size={28}/>
          </DSCard>
          <DSCard name="Heart" sub="outline" code='<Forin.Heart filled={false}/>'>
            <F.Heart size={28} filled={false}/>
          </DSCard>
          <DSCard name="Heart" sub="custom color" code='color="#3B82F6"'>
            <F.Heart size={28} color="#3B82F6"/>
          </DSCard>
          <DSCard name="Star" sub="default" code='<Forin.Star size={18}/>'>
            <F.Star size={28}/>
          </DSCard>
        </DSGrid>
      </DSSection>

      <DSSection title="◆ Flags (localized)" hint="언어 선택 · 캠퍼스 안내판에 사용">
        <DSGrid minItem={130}>
          <DSCard name="FlagUS" code='<Forin.FlagUS size={40}/>'>
            <F.FlagUS size={56}/>
          </DSCard>
          <DSCard name="FlagKR" code='<Forin.FlagKR size={40}/>'>
            <F.FlagKR size={56}/>
          </DSCard>
          <DSCard name="FlagJP" code='<Forin.FlagJP size={40}/>'>
            <F.FlagJP size={56}/>
          </DSCard>
          <DSCard name="FlagDE" code='<Forin.FlagDE size={40}/>'>
            <F.FlagDE size={56}/>
          </DSCard>
          <DSCard name="PixelFlag" sub="custom stripes" code='stripes={[...]}'>
            <F.Flag size={56} stripes={['#fff','#3B82F6','#fff','#DC2626']}/>
          </DSCard>
        </DSGrid>
      </DSSection>

      <DSSection title="◆ Hotspot markers" hint="Map quest/urgent/info/police 표식">
        <DSGrid minItem={130}>
          {['quest','urgent','info','police'].map(k => (
            <DSCard key={k} name={`Hotspot · ${k}`} code={`<Forin.Hotspot kind="${k}"/>`}>
              <div style={{ position: 'relative', width: 32, height: 50 }}>
                <F.Hotspot x={0} y={0} kind={k} label={k.toUpperCase()}/>
              </div>
            </DSCard>
          ))}
        </DSGrid>
      </DSSection>
    </DSPage>
  );
}

Object.assign(window, { ScreenDSColors, ScreenDSType, ScreenDSIcons });
