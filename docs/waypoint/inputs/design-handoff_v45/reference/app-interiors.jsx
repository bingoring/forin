// app-interiors.jsx — Department-interiors canvas, split out of app-screens.jsx
// so no single page renders 30+ heavy tile-map artboards at once (that blocked
// the main thread / crashed the design canvas). Screens live in the shared
// interior files; this page only hosts the interiors section.

function Phone({ children }) { return <IOSDevice width={402} height={874}>{children}</IOSDevice>; }

function ForinInteriorsApp() {
  return (
    <DesignCanvas>
              <DCSection id="interiors" title="③ Department Interiors" subtitle="각 부서 내부 — 환자, 장비, 동료, 이벤트">
                <DCArtboard id="int-er" label="ER · 응급실 내부" width={402} height={874}><Phone><ScreenInteriorER/></Phone></DCArtboard>
                <DCArtboard id="int-or" label="OR · 수술실 내부" width={402} height={874}><Phone><ScreenInteriorOR/></Phone></DCArtboard>
                <DCArtboard id="int-peds" label="Pediatrics · 소아과 내부" width={402} height={874}><Phone><ScreenInteriorPeds/></Phone></DCArtboard>
                <DCArtboard id="int-icu" label="ICU · 중환자실 내부" width={402} height={874}><Phone><ScreenInteriorICU/></Phone></DCArtboard>
                <DCArtboard id="int-pharma" label="Pharmacy · 약국 내부" width={402} height={874}><Phone><ScreenInteriorPharma/></Phone></DCArtboard>
                <DCArtboard id="int-ward" label="일반 내과 병동 · Ward 내부" width={402} height={874}><Phone><ScreenInteriorWard/></Phone></DCArtboard>
                <DCArtboard id="int-surgward" label="일반 외과 병동 · Surg Ward 내부" width={402} height={874}><Phone><ScreenInteriorSurgWard/></Phone></DCArtboard>
                <DCArtboard id="int-orthoward" label="정형외과 병동 · Ortho Ward 내부" width={402} height={874}><Phone><ScreenInteriorOrthoWard/></Phone></DCArtboard>
                <DCArtboard id="int-dermcenter" label="피부과 센터 · Derm Center 내부" width={402} height={874}><Phone><ScreenInteriorDermCenter/></Phone></DCArtboard>
                <DCArtboard id="int-ld" label="가족 분만실 L&D · 여성소아 3F" width={402} height={874}><Phone><ScreenInteriorLD/></Phone></DCArtboard>
                <DCArtboard id="int-nursery" label="신생아실 Nursery · 여성소아 4F" width={402} height={874}><Phone><ScreenInteriorNursery/></Phone></DCArtboard>
                <DCArtboard id="int-onco" label="종양·BMT · 암센터 3F" width={402} height={874}><Phone><ScreenInteriorOnco/></Phone></DCArtboard>
                <DCArtboard id="int-rad" label="영상의학과 · 외래진단동 1F" width={402} height={874}><Phone><ScreenInteriorRad/></Phone></DCArtboard>
                <DCArtboard id="int-rehab" label="재활치료실 PT/OT · 재활관 1F" width={402} height={874}><Phone><ScreenInteriorRehab/></Phone></DCArtboard>
                <DCArtboard id="int-endo" label="내시경실 · 외래진단동 4F" width={402} height={874}><Phone><ScreenInteriorEndo/></Phone></DCArtboard>
                <DCArtboard id="int-dial" label="인공신장실 · 외래진단동 3F" width={402} height={874}><Phone><ScreenInteriorDial/></Phone></DCArtboard>
                <DCArtboard id="int-infusion" label="외래 주사센터 · 외래진단동 3F" width={402} height={874}><Phone><ScreenInteriorInfusion/></Phone></DCArtboard>
                <DCArtboard id="int-psych" label="정신과 폐쇄병동 · 암센터 2F" width={402} height={874}><Phone><ScreenInteriorPsych/></Phone></DCArtboard>
                <DCArtboard id="int-hospice" label="완화의료·호스피스 · 재활관 4F" width={402} height={874}><Phone><ScreenInteriorHospice/></Phone></DCArtboard>
                <DCArtboard id="int-geri" label="치매·노인병동 · 재활관 4F" width={402} height={874}><Phone><ScreenInteriorGeri/></Phone></DCArtboard>
                <DCArtboard id="int-nicu" label="신생아 중환자실 NICU · 여성소아 6F" width={402} height={874}><Phone><ScreenInteriorNICU/></Phone></DCArtboard>
                <DCArtboard id="int-picu" label="소아 중환자실 PICU · 여성소아 5F" width={402} height={874}><Phone><ScreenInteriorPICU/></Phone></DCArtboard>
                <DCArtboard id="int-postpartum" label="산후 병동 · 여성소아 3F" width={402} height={874}><Phone><ScreenInteriorPostpartum/></Phone></DCArtboard>
                <DCArtboard id="int-cards" label="순환기·호흡기내과 병동 · 본관 5F" width={402} height={874}><Phone><ScreenInteriorCards/></Phone></DCArtboard>
                <DCArtboard id="int-specialty" label="전문 외래 · 외래진단동 2F" width={402} height={874}><Phone><ScreenInteriorSpecialty/></Phone></DCArtboard>
                <DCArtboard id="int-spd" label="중앙공급실·영양·하역 · 지원동 1F" width={402} height={874}><Phone><ScreenInteriorSPD/></Phone></DCArtboard>
                <DCArtboard id="int-sim" label="간호부·감염관리·시뮬랩 · 지원동 3F" width={402} height={874}><Phone><ScreenInteriorSim/></Phone></DCArtboard>
                <DCArtboard id="int-lounge" label="락커·휴게실·식당 · 지원동 2F" width={402} height={874}><Phone><ScreenInteriorLounge/></Phone></DCArtboard>
                <DCArtboard id="int-morgue" label="영안실·부검실 · 지원동 B1" width={402} height={874}><Phone><ScreenInteriorMorgue/></Phone></DCArtboard>
                <DCArtboard id="int-womenkids-opd" label="소아·산부인과 외래 · 여성소아 1F" width={402} height={874}><Phone><ScreenInteriorWomenKidsOPD/></Phone></DCArtboard>
                <DCArtboard id="objects-v2" label="🎮 객체 2.5D · v1 vs v2 비교" width={402} height={874}><Phone><ScreenObjectsCompare/></Phone></DCArtboard>
                <DCArtboard id="room-gallery" label="🗂 Room Design Gallery (dev ref)" width={402} height={874}><Phone><ScreenRoomGallery/></Phone></DCArtboard>
              </DCSection>
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<ForinInteriorsApp/>);
