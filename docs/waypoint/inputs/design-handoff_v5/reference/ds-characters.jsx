// ds-characters.jsx — Character atlas.
// Shows the user (player) sprite, every role-preset NPC, every hairstyle, and
// the hair-color / skin-tone palettes used by the deterministic role auto-picker.

function ScreenDSCharacters() {
  const F = window.Forin;
  const t = F.tokens;

  return (
    <DSPage
      title="Characters"
      subtitle="모든 NPC와 사용자 캐릭터는 동일한 RPGSprite 베이스(12×14 픽셀)를 공유합니다. 머리 비중이 크고 다리가 짧은 chibi 비율."
      accent="#FBCFE8"
    >
      {/* ─── User / Player ─── */}
      <DSSection title="◆ Player (user character)" hint="Forin.Player — 흰 간호사 모자 · 민트 스크럽 · YOU 태그">
        <DSGrid minItem={130} gap={14}>
          <DSChibiCard name="Player · YOU" sub="default size=18">
            <F.Player size={28}/>
          </DSChibiCard>
          <DSChibiCard name="Player · large" sub="size=36">
            <F.Player size={36}/>
          </DSChibiCard>
          <DSChibiCard name="Player · no tag" sub='tag=""'>
            <F.Player size={32} tag=""/>
          </DSChibiCard>
        </DSGrid>
        <div style={{ marginTop: 12, fontFamily: '"Galmuri11",monospace', fontSize: 11, color: t.ink, opacity: 0.7 }}>
          코드: <DSCode>{'<Forin.Player size={18} tag="YOU"/>'}</DSCode>
        </div>
      </DSSection>

      {/* ─── Role Atlas ─── */}
      <DSSection title="◆ NPC Role Atlas" hint="Forin.{Nurse,Doctor,Surgeon,…} · 10 roles">
        <DSGrid minItem={120} gap={12}>
          <DSChibiCard name="Nurse" sub="민트 스크럽 + 적십자"><F.Nurse x={1} y={1} size={28}/></DSChibiCard>
          <DSChibiCard name="Doctor" sub="흰 가운 + 청진기"><F.Doctor x={2} y={1} size={28}/></DSChibiCard>
          <DSChibiCard name="Surgeon" sub="블루 스크럽 + 마스크"><F.Surgeon x={3} y={1} size={28}/></DSChibiCard>
          <DSChibiCard name="Paramedic" sub="노란 자켓 + 모자"><F.Paramedic x={4} y={1} size={28}/></DSChibiCard>
          <DSChibiCard name="Police" sub="네이비 + 배지"><F.Police x={5} y={1} size={28}/></DSChibiCard>
          <DSChibiCard name="Patient" sub="환자복"><F.Patient x={6} y={1} size={28}/></DSChibiCard>
          <DSChibiCard name="Child" sub="작은 사이즈"><F.Child x={7} y={1} size={26}/></DSChibiCard>
          <DSChibiCard name="Parent" sub="보호자"><F.Parent x={8} y={1} size={28}/></DSChibiCard>
          <DSChibiCard name="Visitor" sub="면회객"><F.Visitor x={9} y={1} size={28}/></DSChibiCard>
          <DSChibiCard name="Pharmacist" sub="흰 가운 + 약사 마크"><F.Pharmacist x={10} y={1} size={28}/></DSChibiCard>
        </DSGrid>
        <div style={{ marginTop: 12, fontFamily: '"Galmuri11",monospace', fontSize: 11, color: t.ink, opacity: 0.7 }}>
          코드: <DSCode>{'<Forin.Nurse hair="#3C2A18" shirt="#A7F3D0"/>'}</DSCode>
          {' · '}좌표 prop <DSCode>{'x,y'}</DSCode>는 결정적 변형 시드입니다.
        </div>
      </DSSection>

      {/* ─── Hairstyle catalog ─── */}
      <DSSection title="◆ Hair styles · 10 종" hint="RPGSprite hairStyle prop">
        <DSGrid minItem={110} gap={12}>
          {[
            ['short',     '짧은 머리'],
            ['bob',       '단발'],
            ['long',      '긴 머리'],
            ['pigtails',  '양갈래'],
            ['bun',       '쪽머리'],
            ['mohawk',    '모히칸'],
            ['curly',     '곱슬'],
            ['bald',      '대머리'],
            ['cap',       '수술/간호 모자'],
            ['peakedCap', '제복 모자'],
          ].map(([style, ko]) => (
            <DSChibiCard key={style} name={style} sub={ko}>
              <F.Sprite
                width={32}
                hair="#3C2A18"
                hairStyle={style}
                hatTone={style === 'cap' ? '#FFFFFF' : style === 'peakedCap' ? '#1E3A8A' : undefined}
                hatTrim={style === 'cap' ? '#EF4444' : style === 'peakedCap' ? '#FACC15' : undefined}
                shirt="#A7F3D0"
                leg="#475569"
              />
            </DSChibiCard>
          ))}
        </DSGrid>
        <div style={{ marginTop: 12, fontFamily: '"Galmuri11",monospace', fontSize: 11, color: t.ink, opacity: 0.7 }}>
          코드: <DSCode>{'<Forin.Sprite hairStyle="bob" hair="#3C2A18"/>'}</DSCode>
        </div>
      </DSSection>

      {/* ─── Hair color palette ─── */}
      <DSSection title="◆ Hair color palette · 13" hint="결정적 자동 선택 풀">
        <DSGrid minItem={110} gap={10}>
          {[
            ['#1F2937','black'],
            ['#3C2A18','very dark brown'],
            ['#5C3A1A','dark brown'],
            ['#7C3F00','medium brown'],
            ['#9A6B3F','light brown'],
            ['#C28E5C','dirty blonde'],
            ['#E2B16B','blonde'],
            ['#FACC15','bright blonde'],
            ['#EF4444','red / ginger'],
            ['#B45309','auburn'],
            ['#D1D5DB','silver / gray'],
            ['#A78BFA','dyed purple'],
            ['#22D3EE','dyed cyan'],
          ].map(([hex, label]) => (
            <DSChibiCard key={hex} name={label} sub={hex}>
              <F.Sprite width={30} hair={hex} hairStyle="long" shirt="#FFFFFF" leg="#475569"/>
            </DSChibiCard>
          ))}
        </DSGrid>
      </DSSection>

      {/* ─── Skin tones ─── */}
      <DSSection title="◆ Skin tones · 5" hint="결정적 자동 선택 풀">
        <DSGrid minItem={110} gap={10}>
          {[
            ['#FCE5C8','very fair'],
            ['#F8D7B2','fair'],
            ['#E9BE93','tan'],
            ['#C99066','medium'],
            ['#9A6B45','deeper'],
          ].map(([hex, label]) => (
            <DSChibiCard key={hex} name={label} sub={hex}>
              <F.Sprite width={30} skin={hex} hair="#3C2A18" hairStyle="short" shirt="#FFEDD5" leg="#475569"/>
            </DSChibiCard>
          ))}
        </DSGrid>
      </DSSection>

      {/* ─── Diversity sample (random combos) ─── */}
      <DSSection title="◆ 다양성 샘플" hint="머리 + 피부 + 옷 결합 — 결정적 해시 기반">
        <div style={{
          background: '#fff', border: `2px solid ${t.ink}`,
          boxShadow: `3px 3px 0 0 ${t.ink}`,
          padding: 16,
          display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 8,
          justifyItems: 'center',
        }}>
          {Array.from({ length: 30 }).map((_, i) => {
            const roles = ['Nurse','Doctor','Surgeon','Paramedic','Patient','Parent','Visitor','Pharmacist'];
            const Role = F[roles[i % roles.length]];
            return Role ? <Role key={i} x={i} y={Math.floor(i/3)+1} size={28}/> : null;
          })}
        </div>
        <div style={{ marginTop: 10, fontFamily: '"Galmuri11",monospace', fontSize: 11, color: t.ink, opacity: 0.7 }}>
          매번 다르게 보이지만 x,y 좌표가 같으면 항상 같은 외형이 나옵니다. 인테리어 화면이 새로고침 되어도 NPC 외형이 보존됩니다.
        </div>
      </DSSection>

      {/* ─── Tile-placed wrapper ─── */}
      <DSSection title="◆ Tile-placed NPC" hint="Forin.Npc — 인테리어 그리드에 절대 배치">
        <div style={{
          position: 'relative', height: 100, background: '#E8E5D4',
          border: `2px solid ${t.ink}`, boxShadow: `3px 3px 0 0 ${t.ink}`,
        }}>
          <F.Npc x={1} y={1.5} kind="nurse" shirt="#A7F3D0"/>
          <F.Npc x={3} y={1.5} kind="doctor"/>
          <F.Npc x={5} y={1.5} kind="patient"/>
          <F.Npc x={7} y={1.5} kind="surgeon"/>
          <F.Npc x={9} y={1.5} kind="police"/>
          <F.Npc x={11} y={1.5} kind="child"/>
        </div>
        <div style={{ marginTop: 10, fontFamily: '"Galmuri11",monospace', fontSize: 11, color: t.ink, opacity: 0.7 }}>
          코드: <DSCode>{'<Forin.Npc x={3} y={1.5} kind="doctor" hair="#3C2A18"/>'}</DSCode>
          {' · '}x,y는 ITILE(16px) 단위
        </div>
      </DSSection>
    </DSPage>
  );
}

Object.assign(window, { ScreenDSCharacters, ScreenDSCharactersSmooth });

// ─── Smooth (non-pixel) character variant catalog ─────────────────────
function ScreenDSCharactersSmooth() {
  const F = window.Forin;
  const t = F.tokens;
  return (
    <DSPage
      title="Characters · Smooth"
      subtitle="픽셀 NPC와 동일한 역할·정체성·가분수(머리 큰) 비율을 유지하되, 부드러운 벡터 스타일로 그린 대체 버전입니다. 픽셀 버전은 그대로 보존됩니다."
      accent="#DDD6FE"
    >
      <DSSection title="◆ 픽셀 vs 스무스 비교" hint="동일 역할 — 위 픽셀 / 아래 스무스">
        <DSGrid minItem={120} gap={12}>
          {[
            ['Nurse', 'Nurse'], ['Doctor','Doctor'], ['Surgeon','Surgeon'],
            ['Patient','Patient'], ['Police','Police'], ['Child','Child'],
          ].map(([label, role]) => {
            const Pixel  = F[role];
            const Smooth = F['Smooth' + role];
            return (
              <div key={label} style={{
                background: '#fff', border: `2px solid ${t.ink}`,
                boxShadow: `3px 3px 0 0 ${t.ink}`, padding: '10px 6px 6px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
              }}>
                <div style={{ height: 54, display: 'flex', alignItems: 'flex-end' }}>
                  {Pixel && <Pixel x={3} y={2} size={30}/>}
                </div>
                <div style={{ width: '60%', height: 1, background: t.ink, opacity: 0.2 }}/>
                <div style={{ height: 56, display: 'flex', alignItems: 'flex-end' }}>
                  {Smooth && <Smooth x={3} y={2} size={48}/>}
                </div>
                <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: t.ink }}>{label}</div>
              </div>
            );
          })}
        </DSGrid>
      </DSSection>

      <DSSection title="◆ Smooth Player" hint="Forin.SmoothPlayer">
        <DSRow gap={20} align="flex-end">
          <F.SmoothPlayer size={48}/>
          <F.SmoothPlayer size={64}/>
          <F.SmoothPlayer size={88} tag=""/>
        </DSRow>
      </DSSection>

      <DSSection title="◆ Smooth NPC Atlas" hint="Forin.Smooth{Role} · 10 roles">
        <DSGrid minItem={120} gap={12}>
          {[
            ['Nurse','간호사'],['Doctor','의사'],['Surgeon','외과의'],['Paramedic','구급대원'],
            ['Police','경찰'],['Patient','환자'],['Child','아동'],['Parent','보호자'],
            ['Visitor','면회객'],['Pharmacist','약사'],
          ].map(([role, ko], i) => {
            const Comp = F['Smooth' + role];
            return (
              <div key={role} style={{
                background: '#fff', border: `2px solid ${t.ink}`,
                boxShadow: `3px 3px 0 0 ${t.ink}`, padding: '12px 6px 6px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              }}>
                <div style={{ height: 64, display: 'flex', alignItems: 'flex-end' }}>
                  {Comp && <Comp x={i + 1} y={1} size={role === 'Child' ? 46 : 52}/>}
                </div>
                <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: t.ink }}>{role}</div>
                <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 9, color: t.ink, opacity: 0.6 }}>{ko}</div>
              </div>
            );
          })}
        </DSGrid>
      </DSSection>

      <DSSection title="◆ 똘망똘망 vs 하찮은" hint="같은 정체성 — 위 Smooth / 아래 Derp">
        <DSGrid minItem={120} gap={12}>
          {[
            ['Nurse','Nurse'], ['Doctor','Doctor'], ['Patient','Patient'],
            ['Police','Police'], ['Child','Child'], ['Pharmacist','Pharmacist'],
          ].map(([label, role]) => {
            const Smooth = F['Smooth' + role];
            const Derp   = F['Derp' + role];
            return (
              <div key={label} style={{
                background: '#fff', border: `2px solid ${t.ink}`,
                boxShadow: `3px 3px 0 0 ${t.ink}`, padding: '10px 6px 6px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
              }}>
                <div style={{ height: 58, display: 'flex', alignItems: 'flex-end' }}>
                  {Smooth && <Smooth x={2} y={2} size={48}/>}
                </div>
                <div style={{ width: '60%', height: 1, background: t.ink, opacity: 0.2 }}/>
                <div style={{ height: 58, display: 'flex', alignItems: 'flex-end' }}>
                  {Derp && <Derp x={2} y={2} size={48}/>}
                </div>
                <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: t.ink }}>{label}</div>
              </div>
            );
          })}
        </DSGrid>
      </DSSection>

      <DSSection title="◆ Derp NPC Atlas" hint="Forin.Derp{Role} · 하찮은 버전">
        <DSGrid minItem={120} gap={12}>
          {[
            ['Nurse','간호사'],['Doctor','의사'],['Surgeon','외과의'],['Paramedic','구급대원'],
            ['Police','경찰'],['Patient','환자'],['Child','아동'],['Parent','보호자'],
            ['Visitor','면회객'],['Pharmacist','약사'],
          ].map(([role, ko], i) => {
            const Comp = F['Derp' + role];
            return (
              <div key={role} style={{
                background: '#fff', border: `2px solid ${t.ink}`,
                boxShadow: `3px 3px 0 0 ${t.ink}`, padding: '12px 6px 6px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              }}>
                <div style={{ height: 64, display: 'flex', alignItems: 'flex-end' }}>
                  {Comp && <Comp x={i + 1} y={1} size={role === 'Child' ? 46 : 52}/>}
                </div>
                <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: t.ink }}>{role}</div>
                <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 9, color: t.ink, opacity: 0.6 }}>{ko}</div>
              </div>
            );
          })}
        </DSGrid>
      </DSSection>
    </DSPage>
  );
}
