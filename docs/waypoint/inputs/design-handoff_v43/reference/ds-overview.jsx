// ds-overview.jsx — DS index page + composition patterns.

// ─── 1. Overview / Index page ──────────────────────────────────────
function ScreenDSOverview() {
  const F = window.Forin;
  const t = F.tokens;

  const stats = [
    { label: 'Colors',     value: '52' },
    { label: 'Type sizes', value: '9' },
    { label: 'Icons',      value: '7' },
    { label: 'Characters', value: '11' },
    { label: 'Hair styles',value: '10' },
    { label: 'Map atoms',  value: '5' },
    { label: 'Furniture',  value: '10' },
    { label: 'Equipment',  value: '34' },
  ];

  const sections = [
    { id: 'colors',     label: 'Colors',        sub: '브랜드 + 인테리어 컬러 토큰', icon: '🎨' },
    { id: 'type',       label: 'Typography',    sub: '한글 픽셀 + 산세리프', icon: '🔠' },
    { id: 'icons',      label: 'Icons',         sub: '하트 · 별 · 깃발 · 핫스팟', icon: '✦' },
    { id: 'primitives', label: 'Primitives',    sub: 'Button · Box · Chip · StatBar', icon: '◧' },
    { id: 'chrome',     label: 'App Chrome',    sub: 'TopBar · Mission · HUD · BottomNav', icon: '▤' },
    { id: 'chars',      label: 'Characters',    sub: 'Player + 10 NPC 역할', icon: '⌬' },
    { id: 'map',        label: 'Map Atoms',     sub: 'Floor · Wall · Glass · Door', icon: '⊞' },
    { id: 'furn',       label: 'Furniture',     sub: 'Bed · Reception · Cabinet …', icon: '🛏' },
    { id: 'eq-er',      label: 'ER Equipment',  sub: 'Gurney · Defib · EKG · …', icon: '🚑' },
    { id: 'eq-or',      label: 'OR Equipment',  sub: 'Anesthesia · Light · Tray', icon: '🔪' },
    { id: 'eq-icu',     label: 'ICU Equipment', sub: 'Vent · Pyxis · Crash Cart', icon: '🫀' },
    { id: 'eq-peds',    label: 'Peds Equipment',sub: '놀이방 데코 · 백신 냉장고', icon: '🎈' },
    { id: 'eq-pharma',  label: 'Pharma Equip',  sub: '카운터 · 후드 · 금고', icon: '💊' },
    { id: 'patterns',   label: 'Patterns',      sub: '결합 예시', icon: '◈' },
  ];

  return (
    <DSPage
      title="forin Design System"
      subtitle="forin-v2 앱이 사용하는 모든 비주얼 컴포넌트 · 토큰 · 캐릭터 · 오브젝트의 단일 소스 카탈로그."
      accent="#A7F3D0"
    >
      <DSSection title="◆ 시스템 한눈에 보기" hint={`window.Forin · 토큰과 컴포넌트의 통합 네임스페이스`}>
        <DSGrid minItem={130}>
          {stats.map(s => (
            <div key={s.label} style={{
              background: '#fff', border: `2px solid ${t.ink}`,
              boxShadow: `3px 3px 0 0 ${t.ink}`,
              padding: '12px 14px',
            }}>
              <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 28, color: t.ink, lineHeight: 1 }}>
                {s.value}
              </div>
              <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: t.ink, opacity: 0.7, marginTop: 6 }}>
                {s.label}
              </div>
            </div>
          ))}
        </DSGrid>
      </DSSection>

      <DSSection title="◆ 카탈로그 목차" hint="이 섹션의 각 아트보드를 좌→우로 살펴보세요">
        <DSGrid minItem={180}>
          {sections.map(s => (
            <div key={s.id} style={{
              background: '#fff', border: `2px solid ${t.ink}`,
              boxShadow: `3px 3px 0 0 ${t.ink}`,
              padding: '10px 12px',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <div style={{ fontSize: 22 }}>{s.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: t.ink, lineHeight: 1.2 }}>{s.label}</div>
                <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 10, color: t.ink, opacity: 0.7, lineHeight: 1.3, marginTop: 2 }}>{s.sub}</div>
              </div>
            </div>
          ))}
        </DSGrid>
      </DSSection>

      <DSSection title="◆ 사용 방법" hint="앱 코드에서 컴포넌트 가져오기">
        <pre style={{
          background: t.ink, color: '#A7F3D0',
          padding: 14, fontSize: 11, lineHeight: 1.5,
          fontFamily: '"DungGeunMo",monospace',
          border: 0, overflow: 'auto', whiteSpace: 'pre-wrap',
        }}>
{`// 1) 한 컴포넌트만:
const { Bed, Monitor } = window.Forin;
<Bed x={2} y={3} variant="ward" occupied/>

// 2) 토큰 참조:
const { tokens } = window.Forin;
<div style={{ background: tokens.mint, border: '2px solid ' + tokens.ink }}/>

// 3) 인테리어 화면 만들기:
const { InteriorScreen, Wall, Door, Bed, Npc, Hotspot } = window.Forin;
<InteriorScreen
  label="My Ward" deptCode="병동·6F"
  cols={20} rows={20} floor="clinical"
  playerStart={{ x: 10, y: 10 }}
  render={() => <>
    <Wall x={0} y={0} w={20}/>
    <Bed x={2} y={3} variant="ward" occupied/>
    <Npc x={4} y={5} kind="nurse"/>
    <Hotspot x={4} y={4} kind="quest" label="환자 확인"/>
  </>}
/>`}
        </pre>
      </DSSection>

      <DSSection title="◆ 디자인 원칙">
        <ul style={{
          margin: 0, paddingLeft: 18,
          fontFamily: '"Galmuri11",monospace', fontSize: 12, color: t.ink,
          lineHeight: 1.7,
        }}>
          <li>모든 외곽선은 검정(<DSCode>{`Forin.tokens.ink`}</DSCode>) — 두께 1.5 / 2 / 2.5 / 3px</li>
          <li>그림자는 단단한 픽셀 그림자 (3-5px 정수, blur 없음)</li>
          <li>인테리어 오브젝트는 45° 톱뷰 — 항상 TOP face + FRONT face 가 보이도록</li>
          <li>캐릭터는 머리 비중 큰 chibi 비율 — 머리 6px, 몸 4px, 다리 2px</li>
          <li>색상은 채도가 살아있는 16색 픽셀 팔레트 — 그라데이션 회피</li>
          <li>좌표 단위는 항상 <DSCode>{`ITILE = 16px`}</DSCode> — 화면 줌은 <DSCode>{`ZOOM = 2`}</DSCode></li>
        </ul>
      </DSSection>
    </DSPage>
  );
}

// ─── 2. Patterns — composition examples ────────────────────────────
function ScreenDSPatterns() {
  const F = window.Forin;
  const t = F.tokens;

  return (
    <DSPage
      title="Composition Patterns"
      subtitle="아토믹 컴포넌트를 결합하는 표준 패턴. 인테리어 룸을 구성할 때 참고하세요."
      accent="#FBCFE8"
    >
      <DSSection title="◆ Patient Bay" hint="베드 + IV + 모니터 + 환자 + 핫스팟">
        <div style={{
          position: 'relative', height: 200, background: '#E8E5D4',
          border: `2px solid ${t.ink}`, boxShadow: `3px 3px 0 0 ${t.ink}`,
        }}>
          <F.BayLabel x={0.3} y={0.3} text="BAY 4" highlight/>
          <F.Bed x={1} y={1.5} variant="ward" occupied label="HOPKINS"/>
          <F.Monitor x={1} y={5.5} beep/>
          <F.IV x={4} y={2.5}/>
          <F.Curtain x={5} y={1} w={1} h={5}/>
          <F.Npc x={2} y={5.5} kind="nurse" hair="#3C2A18" shirt="#A7D7B0"/>
          <F.Hotspot x={2} y={4.5} kind="urgent" label="PAIN 7"/>
        </div>
        <div style={{ marginTop: 10, fontFamily: '"Galmuri11",monospace', fontSize: 11, color: t.ink, opacity: 0.7 }}>
          ER 베이 구성 표준 — 베드(헤드 위쪽) · 모니터(헤드 옆) · IV(반대 옆) · 환자 핫스팟 · 베이 라벨 · 커튼 격벽
        </div>
      </DSSection>

      <DSSection title="◆ Reception + Staff" hint="안내 카운터 + 직원 NPC + 등록 핫스팟">
        <div style={{
          position: 'relative', height: 180, background: '#E8E5D4',
          border: `2px solid ${t.ink}`, boxShadow: `3px 3px 0 0 ${t.ink}`,
        }}>
          <F.Reception x={2} y={1} w={5} h={2} label="NURSE STATION"/>
          <F.CompCart x={1} y={1}/>
          <F.Whiteboard x={3} y={5} w={4}/>
          <F.Npc x={3} y={3.5} kind="nurse" hair="#5C3A1A"/>
          <F.Npc x={4.5} y={3.5} kind="doctor" hair="#1F2937"/>
          <F.Npc x={6} y={3.5} kind="nurse" hair="#7C3F00" shirt="#FBCFE8"/>
          <F.Hotspot x={4.5} y={2.5} kind="urgent" label="Dr. Patel"/>
          <F.Plant x={9} y={1}/>
        </div>
      </DSSection>

      <DSSection title="◆ Trauma Room" hint="크리티컬 베드 + 다중 모니터 + 제세동기 + 수술팀">
        <div style={{
          position: 'relative', height: 220, background: '#E8E5D4',
          border: `2px solid ${t.ink}`, boxShadow: `3px 3px 0 0 ${t.ink}`,
        }}>
          <F.BayLabel x={0.3} y={0.3} text="TRAUMA 1" highlight/>
          <F.Bed x={3} y={1.5} variant="or" occupied label="CRIT"/>
          <F.Monitor x={1} y={1} beep/>
          <F.Monitor x={6} y={1}/>
          <F.IV x={6} y={2.5}/>
          <F.Defib x={1} y={5}/>
          <F.OxygenTank x={9} y={2}/>
          <F.Cabinet x={6} y={5} w={3} variant="equipment" label="CART"/>
          <F.Npc x={3} y={5} kind="surgeon" hair="#1F2937"/>
          <F.Npc x={4.5} y={5} kind="doctor" hair="#7C3F00"/>
          <F.Npc x={8} y={3} kind="nurse" hair="#3C2A18" shirt="#A5D8E8"/>
        </div>
      </DSSection>

      <DSSection title="◆ Pediatrics Ward" hint="크립 + 보호자 + IV + 풍선 데코">
        <div style={{
          position: 'relative', height: 200, background: '#FDE6BB',
          border: `2px solid ${t.ink}`, boxShadow: `3px 3px 0 0 ${t.ink}`,
        }}>
          <F.BayLabel x={0.3} y={0.3} text="PEDS WARD"/>
          <F.Balloon x={1} y={0.5} c="#EF4444"/>
          <F.Balloon x={2} y={0.5} c="#FACC15"/>
          <F.Balloon x={3} y={0.5} c="#3B82F6"/>
          <F.PedsBed x={1} y={2} occupied stuffie="🐻"/>
          <F.PedsBed x={5} y={2} occupied stuffie="🦊"/>
          <F.IV x={3} y={3}/>
          <F.Npc x={2} y={6} kind="parent" hair="#3C2A18"/>
          <F.Npc x={6} y={6} kind="parent" hair="#9A6B3F"/>
          <F.Hotspot x={2} y={5} kind="quest" label="투약"/>
          <F.Plant x={9} y={6}/>
        </div>
      </DSSection>

      <DSSection title="◆ Pharmacy Pickup" hint="카운터 + 사인 + 약사 + 대기 환자">
        <div style={{
          position: 'relative', height: 200, background: '#E9DEC0',
          border: `2px solid ${t.ink}`, boxShadow: `3px 3px 0 0 ${t.ink}`,
        }}>
          <F.BayLabel x={0.3} y={0.3} text="PHARMACY"/>
          <F.PharmaCounter x={1} y={2} w={6}/>
          <F.CounterSign x={1.5} y={2} text="DROP-OFF" color="#FACC15"/>
          <F.CounterSign x={3.5} y={2} text="PICKUP" color="#10B981"/>
          <F.CounterSign x={5.5} y={2} text="CONSULT" color="#3B82F6"/>
          <F.Npc x={2} y={3.5} kind="pharmacist" hair="#3C2A18"/>
          <F.Npc x={5} y={3.5} kind="pharmacist" hair="#5C3A1A"/>
          <F.QueueRope x={2} y={6}/>
          <F.QueueRope x={5} y={6}/>
          <F.Npc x={3} y={5.5} kind="patient" hair="#9A6B3F"/>
          <F.Hotspot x={5} y={2.5} kind="quest" label="처방 픽업"/>
        </div>
      </DSSection>
    </DSPage>
  );
}

Object.assign(window, { ScreenDSOverview, ScreenDSPatterns });
