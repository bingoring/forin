// ds-faces.jsx — Face portraits catalog.
// Shows: every role × every expression matrix + size variants.

function ScreenDSFaces() {
  const F = window.Forin;
  const t = F.tokens;
  const EXP = F.expressions;

  const roles = [
    { name: 'Player',     Comp: F.FacePlayer,    sub: '사용자 캐릭터' },
    { name: 'Nurse',      Comp: F.FaceNurse,     sub: '간호사' },
    { name: 'Doctor',     Comp: F.FaceDoctor,    sub: '의사' },
    { name: 'Surgeon',    Comp: F.FaceSurgeon,   sub: '외과의 (마스크)' },
    { name: 'Paramedic',  Comp: F.FaceParamedic, sub: '응급구조사' },
    { name: 'Police',     Comp: F.FacePolice,    sub: '경찰관' },
    { name: 'Patient',    Comp: F.FacePatient,   sub: '환자' },
    { name: 'Child',      Comp: F.FaceChild,     sub: '아동' },
    { name: 'Parent',     Comp: F.FaceParent,    sub: '보호자' },
    { name: 'Visitor',    Comp: F.FaceVisitor,   sub: '면회객' },
    { name: 'Pharmacist', Comp: F.FacePharmacist,sub: '약사' },
  ];

  return (
    <DSPage
      title="Faces · 얼굴 & 표정"
      subtitle="Visual novel scale 초상화 — 모든 캐릭터 역할 × 모든 표정 매트릭스. RPGSprite와 동일한 머리스타일/색상 어휘를 사용합니다."
      accent="#FED7AA"
    >
      <DSSection title="◆ 사용 방법" hint="대사 화면 · 브리핑 카드에서 표정을 동기화">
        <pre style={{
          background: t.ink, color: '#A7F3D0',
          padding: 14, fontSize: 11, lineHeight: 1.5,
          fontFamily: '"DungGeunMo",monospace',
          border: 0, overflow: 'auto', whiteSpace: 'pre-wrap',
        }}>
{`// 1) 역할 프리셋 + 표정:
<Forin.FacePatient hair="#9A6B3F" hairStyle="bob" expression="pain" size={80}/>

// 2) 직접 컴포넌트:
<Forin.Face
  hair="#3C2A18" hairStyle="cap"
  hatTone="#FFFFFF" hatTrim="#EF4444"
  shirt="#A7F3D0"
  expression="happy" size={80}
/>

// 3) 12가지 표정:
Forin.expressions.forEach(e => console.log(e.id, '·', e.ko, '·', e.en));`}
        </pre>
      </DSSection>

      <DSSection title={`◆ 12 표정 (Player 기준)`} hint="감정별 눈 · 눈썹 · 입 · 부가 표식의 표준 표현">
        <DSGrid minItem={130} gap={12}>
          {EXP.map(e => (
            <div key={e.id} style={{
              background: '#fff', border: `2px solid ${t.ink}`,
              boxShadow: `3px 3px 0 0 ${t.ink}`,
              padding: '10px 6px 6px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
            }}>
              <F.FacePlayer expression={e.id} size={72}/>
              <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: t.ink }}>
                {e.id}
              </div>
              <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 9, color: t.ink, opacity: 0.7, textAlign: 'center' }}>
                {e.ko} · {e.en}
              </div>
            </div>
          ))}
        </DSGrid>
      </DSSection>

      {/* Full role × expression matrix */}
      {roles.map(role => (
        <DSSection key={role.name} title={`◆ ${role.name} × ${EXP.length} expressions`} hint={role.sub}>
          <DSGrid minItem={110} gap={10}>
            {EXP.map(e => (
              <div key={e.id} style={{
                background: '#fff', border: `2px solid ${t.ink}`,
                boxShadow: `3px 3px 0 0 ${t.ink}`,
                padding: '8px 4px 4px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              }}>
                <role.Comp expression={e.id} size={60}/>
                <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 8, color: t.ink, opacity: 0.8 }}>
                  {e.id}
                </div>
              </div>
            ))}
          </DSGrid>
        </DSSection>
      ))}

      <DSSection title="◆ Size variants" hint="size prop 조절 — 동일 픽셀 그리드 비례 확대">
        <DSGrid minItem={140}>
          {[40, 60, 80, 120, 160].map(s => (
            <div key={s} style={{
              background: '#fff', border: `2px solid ${t.ink}`,
              boxShadow: `3px 3px 0 0 ${t.ink}`,
              padding: 8,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              minHeight: 200,
              justifyContent: 'space-between',
            }}>
              <F.FaceNurse expression="happy" size={s}/>
              <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: t.ink, marginTop: 6 }}>
                size={s}
              </div>
            </div>
          ))}
        </DSGrid>
      </DSSection>

      <DSSection title="◆ 머리스타일 매트릭스 (Patient 기준)" hint="RPGSprite와 동일한 hairStyle prop 사용">
        <DSGrid minItem={110}>
          {['short','bob','long','pigtails','bun','curly','bald','mohawk'].map(hs => (
            <div key={hs} style={{
              background: '#fff', border: `2px solid ${t.ink}`,
              boxShadow: `3px 3px 0 0 ${t.ink}`,
              padding: '8px 4px 4px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            }}>
              <F.FacePatient hair="#5C3A1A" hairStyle={hs} expression="neutral" size={60}/>
              <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 9, color: t.ink }}>{hs}</div>
            </div>
          ))}
        </DSGrid>
      </DSSection>

      <DSSection title="◆ 사용 시나리오 예시">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <DialogueExample
            speaker="Mrs. Hopkins"
            sub="환자 · ER Bay 4"
            face={<F.FacePatient hair="#9A6B3F" hairStyle="bob" expression="pain" size={80}/>}
            text='"Oh nurse... it&apos;s throbbing right here. I can hardly move my arm."'
            tone="urgent"
          />
          <DialogueExample
            speaker="Dr. Patel"
            sub="응급의학과 전문의"
            face={<F.FaceDoctor hair="#1F2937" hairStyle="short" expression="focused" size={80}/>}
            text='"Let&apos;s get a CBC and metabolic panel right away. Page me when results are in."'
          />
          <DialogueExample
            speaker="Officer Davis"
            sub="NYPD · 38m precinct"
            face={<F.FacePolice hair="#1F2937" expression="thinking" size={80}/>}
            text='"We brought a possible assault victim. He was unconscious at the scene."'
          />
          <DialogueExample
            speaker="Mia"
            sub="소아과 환자 (4세)"
            face={<F.FaceChild hair="#FACC15" hairStyle="pigtails" expression="sad" size={80}/>}
            text='"엄마... 나 무서워... 아저씨 좀 가라고 해주세요."'
          />
          <DialogueExample
            speaker="Pharmacist Kim"
            sub="약사"
            face={<F.FacePharmacist hair="#3C2A18" hairStyle="bob" expression="happy" size={80}/>}
            text='"네! 처방전 확인해드릴게요. 잠시만요."'
          />
        </div>
      </DSSection>
    </DSPage>
  );
}

function DialogueExample({ speaker, sub, face, text, tone }) {
  const t = window.ForinTokens;
  const accent = tone === 'urgent' ? '#FCA5A5' : t.peach;
  const shadow = tone === 'urgent' ? '#EF4444' : t.peachShadow;
  return (
    <div style={{
      display: 'flex', gap: 12, alignItems: 'flex-start',
      background: '#FFFBF0', border: `2px solid ${t.ink}`,
      boxShadow: `3px 3px 0 0 ${t.ink}`,
      padding: 12,
    }}>
      <div style={{
        background: accent, border: `2px solid ${t.ink}`,
        boxShadow: `2px 2px 0 0 ${shadow}`,
        padding: 6, flexShrink: 0,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        height: 100, width: 92,
      }}>
        {face}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          background: t.ink, color: t.yellow,
          padding: '2px 8px', display: 'inline-block',
          fontFamily: '"DungGeunMo",monospace', fontSize: 11,
        }}>{speaker.toUpperCase()}</div>
        <div style={{
          fontFamily: '"Galmuri11",monospace', fontSize: 10,
          color: t.ink, opacity: 0.6, marginTop: 4,
        }}>{sub}</div>
        <div style={{
          marginTop: 8,
          fontFamily: '"Galmuri11","Pretendard",sans-serif', fontSize: 13,
          color: t.ink, lineHeight: 1.5,
        }}>{text}</div>
      </div>
    </div>
  );
}

Object.assign(window, { ScreenDSFaces, DialogueExample });
