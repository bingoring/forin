// ds-derp.jsx — Full catalog for the Derp (하찮은) smooth NPCs, now the
// main forin character style. Mirrors the pixel atlas: player, role atlas,
// hairstyle matrix, hair colors, and a full role × expression matrix.

function ScreenDSDerp() {
  const F = window.Forin;
  const t = F.tokens;
  const EXP = F.expressions; // [{id, ko, en}, ...] — 12 expressions

  const roles = [
    { name: 'Nurse',      Comp: F.DerpNurse,     sub: '간호사' },
    { name: 'Doctor',     Comp: F.DerpDoctor,    sub: '의사' },
    { name: 'Surgeon',    Comp: F.DerpSurgeon,   sub: '외과의(마스크)' },
    { name: 'Paramedic',  Comp: F.DerpParamedic, sub: '구급대원' },
    { name: 'Police',     Comp: F.DerpPolice,    sub: '경찰' },
    { name: 'Patient',    Comp: F.DerpPatient,   sub: '환자' },
    { name: 'Child',      Comp: F.DerpChild,     sub: '아동' },
    { name: 'Parent',     Comp: F.DerpParent,    sub: '보호자' },
    { name: 'Visitor',    Comp: F.DerpVisitor,   sub: '면회객' },
    { name: 'Pharmacist', Comp: F.DerpPharmacist,sub: '약사' },
  ];

  const HAIR_STYLES = ['short','bob','long','pigtails','bun','curly','bald','mohawk'];

  return (
    <DSPage
      title="Characters · Derp (메인)"
      subtitle="forin의 메인 캐릭터 스타일 — 하찮고 멍한 표정의 부드러운 벡터 NPC. 픽셀 아틀라스와 동일하게 역할·플레이어·머리스타일·머리색·표정을 전부 구현했습니다."
      accent="#FDE68A"
    >
      {/* ── Player ── */}
      <DSSection title="◆ Player" hint="Forin.DerpPlayer — 간호사 모자 + 민트 + 적십자">
        <DSRow gap={20} align="flex-end">
          <F.DerpPlayer size={48}/>
          <F.DerpPlayer size={64}/>
          <F.DerpPlayer size={96} tag=""/>
        </DSRow>
        <div style={{ marginTop: 10, fontFamily: '"Galmuri11",monospace', fontSize: 11, color: t.ink, opacity: 0.7 }}>
          코드: <DSCode>{'<Forin.DerpPlayer size={40} expression="happy"/>'}</DSCode>
        </div>
      </DSSection>

      {/* ── Role atlas ── */}
      <DSSection title="◆ Role Atlas · 10 roles" hint="Forin.Derp{Role}">
        <DSGrid minItem={120} gap={12}>
          {roles.map((r, i) => (
            <div key={r.name} style={{
              background: '#fff', border: `2px solid ${t.ink}`, boxShadow: `3px 3px 0 0 ${t.ink}`,
              padding: '12px 6px 6px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
            }}>
              <div style={{ height: 64, display: 'flex', alignItems: 'flex-end' }}>
                <r.Comp x={i + 1} y={1} size={r.name === 'Child' ? 46 : 52}/>
              </div>
              <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: t.ink }}>{r.name}</div>
              <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 9, color: t.ink, opacity: 0.6 }}>{r.sub}</div>
            </div>
          ))}
        </DSGrid>
      </DSSection>

      {/* ── Hair styles ── */}
      <DSSection title="◆ Hair styles · 8 종 + 모자 2" hint="SmoothSprite hairStyle prop">
        <DSGrid minItem={110} gap={12}>
          {HAIR_STYLES.map(hs => (
            <div key={hs} style={{
              background: '#fff', border: `2px solid ${t.ink}`, boxShadow: `3px 3px 0 0 ${t.ink}`,
              padding: '12px 4px 4px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            }}>
              <F.SmoothSprite width={52} hair="#5C3A1A" hairStyle={hs} skin="#F8D7B2"
                shirt="#A7F3D0" shirtDk="#4FC79D" leg="#475569" expression="neutral"/>
              <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 9, color: t.ink }}>{hs}</div>
            </div>
          ))}
          {[['cap','#FFFFFF','#EF4444'], ['peakedCap','#1E3A8A','#FACC15']].map(([hs, tone, trim]) => (
            <div key={hs} style={{
              background: '#fff', border: `2px solid ${t.ink}`, boxShadow: `3px 3px 0 0 ${t.ink}`,
              padding: '12px 4px 4px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            }}>
              <F.SmoothSprite width={52} hair="#5C3A1A" hairStyle={hs} hatTone={tone} hatTrim={trim}
                skin="#F8D7B2" shirt="#A7F3D0" shirtDk="#4FC79D" leg="#475569" expression="neutral"/>
              <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 9, color: t.ink }}>{hs}</div>
            </div>
          ))}
        </DSGrid>
      </DSSection>

      {/* ── Hair colors ── */}
      <DSSection title="◆ Hair colors · 13" hint="결정적 자동 선택 풀">
        <DSGrid minItem={92} gap={10}>
          {[
            ['#1F2937','black'],['#3C2A18','dk brown'],['#5C3A1A','brown'],['#7C3F00','md brown'],
            ['#9A6B3F','lt brown'],['#C28E5C','d.blonde'],['#E2B16B','blonde'],['#FACC15','blonde+'],
            ['#EF4444','ginger'],['#B45309','auburn'],['#D1D5DB','silver'],['#A78BFA','purple'],['#22D3EE','cyan'],
          ].map(([hex, label]) => (
            <div key={hex} style={{
              background: '#fff', border: `2px solid ${t.ink}`, boxShadow: `2px 2px 0 0 ${t.ink}`,
              padding: '8px 2px 3px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            }}>
              <F.SmoothSprite width={42} hair={hex} hairStyle="long" skin="#F8D7B2"
                shirt="#FFFFFF" shirtDk="#B0B5BD" leg="#475569" expression="neutral"/>
              <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 8, color: t.ink, opacity: 0.7 }}>{label}</div>
            </div>
          ))}
        </DSGrid>
      </DSSection>

      {/* ── 12 expressions (Player) ── */}
      <DSSection title="◆ 12 표정 (Player 기준)" hint="expression prop — 픽셀 Face와 동일 어휘">
        <DSGrid minItem={120} gap={12}>
          {EXP.map(e => (
            <div key={e.id} style={{
              background: '#fff', border: `2px solid ${t.ink}`, boxShadow: `3px 3px 0 0 ${t.ink}`,
              padding: '12px 6px 6px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
            }}>
              <F.DerpPlayer size={64} tag="" expression={e.id}/>
              <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: t.ink }}>{e.id}</div>
              <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 9, color: t.ink, opacity: 0.65, textAlign: 'center' }}>
                {e.ko} · {e.en}
              </div>
            </div>
          ))}
        </DSGrid>
      </DSSection>

      {/* ── Full role × expression matrix ── */}
      {roles.map((r, ri) => (
        <DSSection key={r.name} title={`◆ ${r.name} × ${EXP.length} expressions`} hint={r.sub}>
          <DSGrid minItem={92} gap={8}>
            {EXP.map(e => (
              <div key={e.id} style={{
                background: '#fff', border: `2px solid ${t.ink}`, boxShadow: `2px 2px 0 0 ${t.ink}`,
                padding: '8px 2px 3px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              }}>
                <r.Comp x={ri + 1} y={ri + 2} size={r.name === 'Child' ? 44 : 48} expression={e.id}/>
                <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 8, color: t.ink, opacity: 0.8 }}>{e.id}</div>
              </div>
            ))}
          </DSGrid>
        </DSSection>
      ))}

      {/* ── Diversity sample ── */}
      <DSSection title="◆ 다양성 샘플" hint="머리·색·피부·표정 결정적 변형">
        <div style={{
          background: '#fff', border: `2px solid ${t.ink}`, boxShadow: `3px 3px 0 0 ${t.ink}`,
          padding: 16, display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 10, justifyItems: 'center',
        }}>
          {Array.from({ length: 24 }).map((_, i) => {
            const list = ['DerpNurse','DerpDoctor','DerpPatient','DerpParent','DerpVisitor','DerpPharmacist'];
            const Role = F[list[i % list.length]];
            const exprs = ['neutral','happy','sleepy','worried','thinking','surprised'];
            return Role ? <Role key={i} x={i} y={Math.floor(i / 4) + 1} size={44} expression={exprs[i % exprs.length]}/> : null;
          })}
        </div>
      </DSSection>
    </DSPage>
  );
}

Object.assign(window, { ScreenDSDerp });
