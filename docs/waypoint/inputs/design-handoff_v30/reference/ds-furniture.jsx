// ds-furniture.jsx — Map atoms (floor/wall/door) + Hospital furniture
// (bed, reception, monitor, IV, chair, cabinet, plant, hotspot).

// ─── 1. Map atoms ──────────────────────────────────────────────────
function ScreenDSMap() {
  const F = window.Forin;
  const t = F.tokens;
  const IP = F.interior;

  return (
    <DSPage
      title="Map Atoms"
      subtitle="인테리어 맵을 짓는 데 쓰이는 모든 1-tile 기본 블록. 좌표 단위는 ITILE = 16px."
      accent="#E8E5D4"
    >
      <DSSection title="◆ Floor (theme)" hint="Forin.Floor — theme: clinical / sterile / peds / ICU / pharma">
        <DSGrid minItem={140}>
          {['clinical', 'sterile', 'peds', 'ICU', 'pharma'].map(theme => (
            <FloorSample key={theme} theme={theme}/>
          ))}
        </DSGrid>
        <div style={{ marginTop: 10, fontFamily: '"Galmuri11",monospace', fontSize: 11, color: t.ink, opacity: 0.7 }}>
          체커보드 패턴 자동 — (x+y) 짝수/홀수에 따라 alt 색.
        </div>
      </DSSection>

      <DSSection title="◆ Wall" hint="Forin.Wall — w, h 로 길이 지정">
        <DSGrid minItem={160}>
          <DSCard name="Wall 1×1" sub="기본 1타일" code='<Forin.Wall x={0} y={0}/>'>
            <DSTileFrame width={48} height={48}><F.Wall x={0} y={0}/></DSTileFrame>
          </DSCard>
          <DSCard name="Wall 3×1" sub="가로 3타일" code='w={3}'>
            <DSTileFrame width={140} height={48}><F.Wall x={0} y={0} w={3}/></DSTileFrame>
          </DSCard>
          <DSCard name="Wall 1×3" sub="세로 3타일" code='h={3}'>
            <DSTileFrame width={48} height={140}><F.Wall x={0} y={0} h={3}/></DSTileFrame>
          </DSCard>
        </DSGrid>
      </DSSection>

      <DSSection title="◆ Glass partition" hint="Forin.Glass — ICU 룸 격벽 (반투명)">
        <DSGrid minItem={160}>
          <DSCard name="Glass 3×1" code='<Forin.Glass w={3}/>'>
            <DSTileFrame width={140} height={48}><F.Glass x={0} y={0} w={3}/></DSTileFrame>
          </DSCard>
          <DSCard name="Glass 1×3" code='h={3}'>
            <DSTileFrame width={48} height={140}><F.Glass x={0} y={0} h={3}/></DSTileFrame>
          </DSCard>
        </DSGrid>
      </DSSection>

      <DSSection title="◆ Door" hint="Forin.Door — kind: wood / sterile / auto">
        <DSGrid minItem={160}>
          {[
            ['wood',    '병실/사무실 일반 도어'],
            ['sterile', 'OR 수술실 경계'],
            ['auto',    '자동 슬라이딩 입구'],
          ].map(([kind, label]) => (
            <DSCard key={kind} name={`Door · ${kind}`} sub={label} code={`kind="${kind}"`}>
              <DSTileFrame width={56} height={56}>
                <F.Door x={0} y={0} kind={kind}/>
              </DSTileFrame>
            </DSCard>
          ))}
          <DSCard name="Door 2-wide" sub="가로 자동문" code='w={2}'>
            <DSTileFrame width={96} height={56}>
              <F.Door x={0} y={0} w={2} kind="auto" label="ENTRANCE"/>
            </DSTileFrame>
          </DSCard>
          <DSCard name="Door 1×2" sub="세로 도어 (orientation 자동)" code='h={2}'>
            <DSTileFrame width={56} height={96}>
              <F.Door x={0} y={0} h={2} kind="wood" label="→ ROOM"/>
            </DSTileFrame>
          </DSCard>
        </DSGrid>
      </DSSection>

      <DSSection title="◆ Curtain" hint="Forin.Curtain — 베이 격리용 커튼">
        <DSGrid minItem={160}>
          {[
            ['#A7C7E7', 'blue (default)'],
            ['#FBCFE8', 'pink (peds ward)'],
            ['#BAE6FD', 'light blue (peds play)'],
          ].map(([color, label]) => (
            <DSCard key={color} name="Curtain" sub={label} code={`color="${color}"`}>
              <DSTileFrame width={48} height={140}>
                <F.Curtain x={0} y={0} w={1} h={3} color={color}/>
              </DSTileFrame>
            </DSCard>
          ))}
        </DSGrid>
      </DSSection>
    </DSPage>
  );
}

function FloorSample({ theme }) {
  const IP = window.IP;
  const cap = theme.charAt(0).toUpperCase() + theme.slice(1);
  const a = IP[`floor${cap}`];
  const b = IP[`floor${cap}Alt`];
  return (
    <div style={{
      background: '#fff', border: `2px solid ${IP.ink}`,
      boxShadow: `3px 3px 0 0 ${IP.ink}`,
      overflow: 'hidden',
    }}>
      <div style={{ height: 80, position: 'relative', background: a }}>
        {/* render an actual 5×5 grid of IFloor tiles */}
        <div style={{ position: 'absolute', left: 0, top: 0, width: 80, height: 80 }}>
          {Array.from({ length: 5 }).map((_, y) =>
            Array.from({ length: 5 }).map((_, x) => (
              <window.Forin.Floor key={`${x}-${y}`} theme={theme} x={x} y={y}/>
            ))
          )}
        </div>
      </div>
      <div style={{ padding: '6px 8px' }}>
        <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: IP.ink }}>{theme}</div>
        <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 8, color: IP.ink, opacity: 0.6 }}>
          {a.toUpperCase()} · {b.toUpperCase()}
        </div>
      </div>
    </div>
  );
}

// ─── 2. Furniture ──────────────────────────────────────────────────
function ScreenDSFurniture() {
  const F = window.Forin;
  const t = F.tokens;

  return (
    <DSPage
      title="Hospital Furniture"
      subtitle="모든 부서 인테리어에서 공통으로 사용하는 가구 컴포넌트. 좌표 prop x,y 는 ITILE 단위입니다."
      accent="#FED7AA"
    >
      {/* ─── Beds ─── */}
      <DSSection title="◆ Bed · IBed" hint="Forin.Bed — variant: ward / or / peds, occupied bool">
        <DSGrid minItem={140}>
          <DSCard name="ward · empty" code='variant="ward"' previewH={140}>
            <DSTileFrame width={64} height={120}><F.Bed x={0} y={0} variant="ward"/></DSTileFrame>
          </DSCard>
          <DSCard name="ward · occupied" code='occupied' previewH={140}>
            <DSTileFrame width={64} height={120}><F.Bed x={0} y={0} variant="ward" occupied/></DSTileFrame>
          </DSCard>
          <DSCard name="or · OR table" code='variant="or"' previewH={140}>
            <DSTileFrame width={64} height={120}><F.Bed x={0} y={0} variant="or" occupied label="DRAPED"/></DSTileFrame>
          </DSCard>
          <DSCard name="peds · 소아용" code='variant="peds"' previewH={140}>
            <DSTileFrame width={64} height={120}><F.Bed x={0} y={0} variant="peds" occupied/></DSTileFrame>
          </DSCard>
        </DSGrid>
      </DSSection>

      <DSSection title="◆ PedsBed · 소아 쿠션 베드" hint="Forin.PedsBed — 곰인형 포함 가능">
        <DSGrid minItem={140}>
          <DSCard name="PedsBed · empty" previewH={140}>
            <DSTileFrame width={64} height={120}><F.PedsBed x={0} y={0} stuffie="🐰"/></DSTileFrame>
          </DSCard>
          <DSCard name="PedsBed · occupied" code='occupied stuffie="🐻"' previewH={140}>
            <DSTileFrame width={64} height={120}><F.PedsBed x={0} y={0} occupied stuffie="🐻"/></DSTileFrame>
          </DSCard>
        </DSGrid>
      </DSSection>

      {/* ─── Desk (plain) ─── */}
      <DSSection title="◆ Desk · 의사 진료 책상" hint="Forin.Desk (=IReception) — 흔 진료용 책상. w 가변. 접수데스크는 Clinic의 ClinicReception 참고">
        <DSGrid minItem={220}>
          <DSCard name="Desk 4×2" sub="기본 — 모니터+차트 (흔색)" code='w={4} h={2}' previewH={140}>
            <DSTileFrame width={150} height={70}>
              <F.Desk x={0} y={0} w={4} h={2} label="진료"/>
            </DSTileFrame>
          </DSCard>
          <DSCard name="Desk 6×2" sub="긴 책상" code='w={6}' previewH={140}>
            <DSTileFrame width={200} height={70}>
              <F.Desk x={0} y={0} w={6} h={2} label="DESK"/>
            </DSTileFrame>
          </DSCard>
          <DSCard name="Desk 3×1" sub="컴팩트" code='h={1}' previewH={120}>
            <DSTileFrame width={120} height={50}>
              <F.Desk x={0} y={0} w={3} h={1} label="DESK"/>
            </DSTileFrame>
          </DSCard>
        </DSGrid>
      </DSSection>

      {/* ─── Nurse station desks (hub) ─── */}
      <DSSection title="◆ Nurse Station Desk · 허브 데스크" hint="병원 허브용 흔색 데스크 — ㄴ자(NurseStationDesk) / I자(NurseDeskI). 메디컬 현장 공통 가구.">
        <DSGrid minItem={240}>
          <DSCard name="NurseStationDesk (ㄴ)" sub="대형 ㄴ자 오픈 데스크 (모니터월+서랍+프린터)" code='<Forin.NurseStationDesk/>' previewH={160}>
            <DSTileFrame width={200} height={140}><F.NurseStationDesk x={0} y={0.6} w={10} h={6}/></DSTileFrame>
          </DSCard>
          <DSCard name="NurseDeskI (I)" sub="직선형 I자 차팅/스테이션 데스크" code='<Forin.NurseDeskI w h/>' previewH={120}>
            <DSTileFrame width={170} height={70}><F.NurseDeskI x={0} y={0.6} w={8} h={2}/></DSTileFrame>
          </DSCard>
        </DSGrid>
      </DSSection>

      {/* ─── Monitor / IV ─── */}
      <DSSection title="◆ Vital Monitor & IV stand">
        <DSGrid minItem={160}>
          <DSCard name="Monitor" code='<Forin.Monitor/>' previewH={120}>
            <DSTileFrame width={32} height={64}><F.Monitor x={0} y={0}/></DSTileFrame>
          </DSCard>
          <DSCard name="Monitor · beeping" code='beep' previewH={120}>
            <DSTileFrame width={48} height={64}><F.Monitor x={0} y={0} beep/></DSTileFrame>
          </DSCard>
          <DSCard name="IV stand" code='<Forin.IV/>' previewH={140}>
            <DSTileFrame width={32} height={80}><F.IV x={0} y={1.4}/></DSTileFrame>
          </DSCard>
        </DSGrid>
      </DSSection>

      {/* ─── Chair ─── */}
      <DSSection title="◆ Chair" hint="Forin.Chair — color · facing: up / down / left / right">
        <DSGrid minItem={130}>
          {[
            ['#FED7AA','down','peach · 정면'],
            ['#BAE6FD','up','blue · 후면'],
            ['#BBF7D0','right','green · 우측'],
            ['#A8C7DC','left','slate · 좌측'],
            ['#FBCFE8','down','pink · 정면'],
            ['#FEF08A','up','yellow · 후면'],
          ].map(([color, facing, label]) => (
            <DSCard key={label} name={`Chair · ${label}`} sub={`facing=${facing}`} code={`color="${color}"`}>
              <DSTileFrame width={32} height={50}><F.Chair x={0} y={0} color={color} facing={facing}/></DSTileFrame>
            </DSCard>
          ))}
        </DSGrid>
      </DSSection>

      {/* ─── Cabinet variants ─── */}
      <DSSection title="◆ Cabinet · 7 variants" hint="Forin.Cabinet — variant 별로 내용물이 달라집니다">
        <DSGrid minItem={170}>
          {[
            ['supply',    'SUPPLY',    '거즈·붕대·주사기'],
            ['drug',      'DRUGS',     '잠긴 약장'],
            ['linen',     'LINEN',     '시트·타올'],
            ['chart',     'CHARTS',    '의무기록 폴더'],
            ['sterile',   'STERILE',   'OR용 멸균 파우치'],
            ['equipment', 'EQUIP',     '제세동기·도구'],
            ['pharma',    'PHARMA',    '컬러 알약병'],
          ].map(([variant, label, sub]) => (
            <DSCard key={variant} name={`Cabinet · ${variant}`} sub={sub} code={`variant="${variant}"`} previewH={110}>
              <DSTileFrame width={86} height={50}>
                <F.Cabinet x={0} y={0} w={2} variant={variant} label={label}/>
              </DSTileFrame>
            </DSCard>
          ))}
        </DSGrid>
      </DSSection>

      {/* ─── Plant / Hotspot ─── */}
      <DSSection title="◆ Decor & markers">
        <DSGrid minItem={130}>
          <DSCard name="Plant pot" code='<Forin.Plant/>'>
            <DSTileFrame width={32} height={56}><F.Plant x={0} y={0}/></DSTileFrame>
          </DSCard>
          {['quest','urgent','info','police'].map(k => (
            <DSCard key={k} name={`Hotspot ${k}`} code={`kind="${k}"`}>
              <DSTileFrame width={48} height={64}>
                <F.Hotspot x={0} y={0} kind={k} label={k.toUpperCase()}/>
              </DSTileFrame>
            </DSCard>
          ))}
        </DSGrid>
      </DSSection>
    </DSPage>
  );
}

Object.assign(window, { ScreenDSMap, ScreenDSFurniture });
