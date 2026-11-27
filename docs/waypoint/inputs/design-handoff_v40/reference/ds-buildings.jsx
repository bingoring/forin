// ds-buildings.jsx — Design-system catalog page for 2.5D landmark buildings.
// Showcases the isometric-ish (top + front + side) treatment for confirmation
// before applying to the campus. Depends on buildings-v2.jsx (window globals).

function ScreenDSBuildings() {
  const Med = window.MedCenter2D, Clock = window.ClockTower2D;
  const cell = (title, sub, h, node) => (
    <div style={{ background: '#fff', border: '2px solid #3A2E26', boxShadow: '4px 4px 0 0 #3A2E26', padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div>
        <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 14, color: '#3A2E26' }}>{title}</div>
        <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: '#8A7E70' }}>{sub}</div>
      </div>
      <div style={{ position: 'relative', height: h, background: '#9BC48A', backgroundImage: 'repeating-linear-gradient(0deg,#90BC80 0 16px,#9BC48A 16px 32px),repeating-linear-gradient(90deg,#90BC80 0 16px,#9BC48A 16px 32px)', border: '1px solid #3A2E2633', overflow: 'hidden' }}>
        {node}
      </div>
    </div>
  );
  return (
    <DSPage
      title="Landmark Buildings · 2.5D"
      subtitle="캠퍼스는 수직 탑다운이 아니라 살짝 위에서 본 대각선 시점 — 건물도 정면뿐 아니라 윗면(+측면)이 보여야 한다. 아래는 입체(top+front+side) 처리한 랜드마크. 컨펌 후 campus(screens-explore)에 적용."
      accent="#5E6C7A"
    >
      <DSSection title="◆ 본관 · 메인 메디컬 타워 (2.5D)" hint="3개 타워 + 3D 포디움. 각 타워에 윗면·우측면 추가.">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
          {cell('MedCenter2D', '<window.MedCenter2D w h/> — top + front + side', 300,
            <div style={{ position: 'absolute', left: 70, top: 120 }}>
              <Med w={10} h={7} label="본관 · 메인 메디컬 타워" sign="🚑 MEDICAL TOWER" signColor="#D14B3D"/>
            </div>)}
        </div>
      </DSSection>

      <DSSection title="◆ 시계탑 (2.5D)" hint="고딕 샤프트를 3D 박스로 압출 + 첨탑 음영면.">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
          {cell('ClockTower2D', '<window.ClockTower2D/> — extruded shaft + spire', 300,
            <div style={{ position: 'absolute', left: 150, top: 20, transform: 'scale(0.72)', transformOrigin: 'top left' }}>
              <Clock/>
            </div>)}
        </div>
      </DSSection>

      <DSSection title="◆ 나머지 랜드마크 (2.5D)" hint="외래·진단동(H) / 여성소아 센터(V) / 암센터·재활관(C).">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
          {cell('MedCenterH2D · 외래·진단 지원동', 'horizontal block + sun-shade bands + parapet', 200,
            <div style={{ position: 'absolute', left: 60, top: 70 }}>
              <window.MedCenterH2D w={8} h={5} label="외래 · 진단 지원동" sign="🔬 OUTPATIENT · DX" signColor="#0E7490"/>
            </div>)}
          {cell('MedCenterV2D · 여성소아 센터', 'red brick + slate mansard + copper dome', 320,
            <div style={{ position: 'absolute', left: 70, top: 40, transform: 'scale(1.5)', transformOrigin: 'top left' }}>
              <window.MedCenterV2D w={7} h={6} label="여성소아 센터" sign="🤰 WOMEN & CHILDREN" signColor="#C2487E"/>
            </div>)}
          {cell('MedCenterC2D · 암센터·재활관', 'convex curved glass + rounded crown + dish', 220,
            <div style={{ position: 'absolute', left: 90, top: 70 }}>
              <window.MedCenterC2D w={6} h={6} label="암센터 · 재활관" sign="🎗 ONCOLOGY · REHAB" signColor="#1E8A5B"/>
            </div>)}
        </div>
      </DSSection>

      <DSSection title="◆ 비교: 기존(정면) vs 신규(2.5D)" hint="확정되면 나머지 4개 랜드마크(MedCenterH/V/C + Building)도 동일 방식으로 전환.">
        <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 12, color: '#5A4E42', lineHeight: 1.6 }}>
          기존 랜드마크는 건물 정면만 그려 수직 탑다운처럼 보였습니다. 2.5D 버전은 의자·책상과 동일하게
          윗면 평행사변형 + 우측 음영면을 더해, 살짝 위에서 본 대각선 시점에 맞춥니다.
        </div>
      </DSSection>
    </DSPage>
  );
}

Object.assign(window, { ScreenDSBuildings });
