// app-ds.jsx — Design System catalog ONLY (section ⓪).
// Split out of the full app so the heavy catalog matrices load on their own.

const { useState, useEffect } = React;

function ForinDSApp() {
  const [bump, setBump] = useState(0);
  // Keep tokens at defaults (no tweaks panel here).
  useEffect(() => {
    document.documentElement.style.setProperty('--forin-scanlines', '1');
  }, []);

  return (
    <DesignCanvas key={bump}>
      <DCSection id="design-system" title="⓪ Design System" subtitle="forin-v2의 단일 소스 카탈로그 — 모든 토큰, 컴포넌트, 캐릭터, 오브젝트 정의">
        <DCArtboard id="ds-overview"  label="Overview · 시스템 한눈에" width={720} height={900}><ScreenDSOverview/></DCArtboard>
        <DCArtboard id="ds-colors"    label="Colors · 컬러 토큰"    width={720} height={1100}><ScreenDSColors/></DCArtboard>
        <DCArtboard id="ds-type"      label="Typography"            width={720} height={900}><ScreenDSType/></DCArtboard>
        <DCArtboard id="ds-icons"     label="Icons & Flags"         width={720} height={700}><ScreenDSIcons/></DCArtboard>
        <DCArtboard id="ds-primitives" label="Primitives · 버튼 / 박스 / 칩" width={720} height={900}><ScreenDSPrimitives/></DCArtboard>
        <DCArtboard id="ds-chrome"    label="App Chrome · TopBar / Mission / HUD" width={720} height={900}><ScreenDSChrome/></DCArtboard>
        <DCArtboard id="ds-chars"     label="Characters · Player + NPC 아틀라스" width={720} height={1400}><ScreenDSCharacters/></DCArtboard>
        <DCArtboard id="ds-derp"      label="Characters · Derp (메인)" width={720} height={3200}><ScreenDSDerp/></DCArtboard>
        <DCArtboard id="ds-chars-smooth" label="Characters · Smooth (비픽셀)" width={720} height={1300}><ScreenDSCharactersSmooth/></DCArtboard>
        <DCArtboard id="ds-faces"     label="Faces · 얼굴 & 12 표정"   width={720} height={2400}><ScreenDSFaces/></DCArtboard>
        <DCArtboard id="ds-map"       label="Map Atoms · Floor/Wall/Door" width={720} height={900}><ScreenDSMap/></DCArtboard>
        <DCArtboard id="ds-furn"      label="Furniture · 침대 / 데스크 / 캐비닛" width={720} height={1200}><ScreenDSFurniture/></DCArtboard>
        <DCArtboard id="ds-eq-er"     label="ER Equipment"          width={720} height={1200}><ScreenDSEquipmentER/></DCArtboard>
        <DCArtboard id="ds-eq-or"     label="OR Equipment"          width={720} height={800}><ScreenDSEquipmentOR/></DCArtboard>
        <DCArtboard id="ds-eq-icu"    label="ICU Equipment"         width={720} height={700}><ScreenDSEquipmentICU/></DCArtboard>
        <DCArtboard id="ds-eq-peds"   label="Pediatrics Equipment"  width={720} height={800}><ScreenDSEquipmentPeds/></DCArtboard>
        <DCArtboard id="ds-eq-pharma" label="Pharmacy Equipment"    width={720} height={1100}><ScreenDSEquipmentPharma/></DCArtboard>
        <DCArtboard id="ds-eq-clinics" label="Clinic Equipment · 외래 진료과" width={720} height={1100}><ScreenDSEquipmentClinics/></DCArtboard>
        <DCArtboard id="ds-patterns"  label="Patterns · 결합 예시"   width={720} height={1300}><ScreenDSPatterns/></DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<ForinDSApp/>);
