// screen-room-gallery.jsx — Development reference: all rooms across all 5
// interior buildings, organized by department. Designers/devs can scan this
// to see what's in each room without exploring each interior.

(function () {
  // Gallery data: enumerated rooms with annotated contents. Mirrors the
  // `regions` array in each interior file but adds furniture + NPC summaries.
  const ROOM_GALLERY = [
    // ─── ER (응급실) ───
    {
      dept: 'ER', deptName: '응급실', deptColor: '#DC2626', floor: '2F',
      id: 'top-hall', name: '입구 · 트리아지', icon: '🚑',
      size: '22 × 8', tone: '#FECACA',
      furniture: ['트리아지 데스크', '등록 데스크', '대기 의자 5', '도착 환자 베드', 'IV 스탠드'],
      npcs: ['트리아지 간호사', '등록 간호사', '구급대원 ×2', '경찰관', '대기 환자 4'],
      scenarios: ['교통사고 핸드오프', '경찰 동행 환자', '소아 발열', '언어 장벽'],
      hotspots: 3,
    },
    {
      dept: 'ER', deptName: '응급실', deptColor: '#DC2626', floor: '2F',
      id: 'left-bays', name: '경증 베이 1-2', icon: '🛏', size: '7 × 7', tone: '#FFEDD5',
      furniture: ['병상 ×2', 'IV 스탠드', '모니터', '커튼 디바이더'],
      npcs: ['환자 (Bay 1)', '담당 간호사'],
      scenarios: ['통증 사정', '약 복용 안내'],
      hotspots: 0,
    },
    {
      dept: 'ER', deptName: '응급실', deptColor: '#DC2626', floor: '2F',
      id: 'left-bays2', name: '베이 3-4 (Hopkins)', icon: '🛏', size: '7 × 7', tone: '#FCA5A5',
      furniture: ['병상 ×2', '모니터 (beep)', 'IV 스탠드', '커튼'],
      npcs: ['Mrs. Hopkins (Pain 7/10)', '환자', '간호사'],
      scenarios: ['통증 사정 PQRST', '활력징후 사정'],
      hotspots: 1,
    },
    {
      dept: 'ER', deptName: '응급실', deptColor: '#DC2626', floor: '2F',
      id: 'nurse', name: '너스 스테이션', icon: '👩‍⚕️', size: '8 × 14', tone: '#FFEDD5',
      furniture: ['중앙 리셉션 (5w)', '차트 캐비닛', '컴퓨터 ×3', '전화기'],
      npcs: ['수석 간호사', '의사', '교대 간호사'],
      scenarios: ['SBAR 인계', '의사 콜', '차트 작성'],
      hotspots: 0,
    },
    {
      dept: 'ER', deptName: '응급실', deptColor: '#DC2626', floor: '2F',
      id: 'trauma', name: '트라우마 룸', icon: '🚨', size: '9 × 14', tone: '#FCA5A5',
      furniture: ['수술용 베드 ×2', '대형 모니터 ×3', 'IV ×3', '응급 카트', '유리 파티션'],
      npcs: ['외과의', '응급의', '집중 간호사'],
      scenarios: ['트라우마 응대', 'STAT 인계', '아나필락시스', '심정지 대응'],
      hotspots: 1,
    },
    {
      dept: 'ER', deptName: '응급실', deptColor: '#DC2626', floor: '2F',
      id: 'supply', name: '서플라이 룸', icon: '📦', size: '7 × 10', tone: '#DDD6FE',
      furniture: ['붕대 캐비닛', '약품 캐비닛 (잠금)', '리넨 캐비닛', '응급 카트'],
      npcs: ['—'],
      scenarios: ['소모품 보충', '재고 확인'],
      hotspots: 0,
    },
    {
      dept: 'ER', deptName: '응급실', deptColor: '#DC2626', floor: '2F',
      id: 'office', name: '의국 (Dr. Office)', icon: '👨‍⚕️', size: '6 × 10', tone: '#BAE6FD',
      furniture: ['의사 책상', '의자 ×2', '식물', '진료 노트'],
      npcs: ['주치의'],
      scenarios: ['처방 받기', '컨설트'],
      hotspots: 0,
    },
    {
      dept: 'ER', deptName: '응급실', deptColor: '#DC2626', floor: '2F',
      id: 'xray', name: 'X-Ray Room', icon: '🩻', size: '6 × 10', tone: '#A7F3D0',
      furniture: ['X-Ray 머신', '환자 테이블', '컨트롤 모니터'],
      npcs: ['방사선사'],
      scenarios: ['영상 결과 확인', '환자 자세 안내'],
      hotspots: 1,
    },
    {
      dept: 'ER', deptName: '응급실', deptColor: '#DC2626', floor: '2F',
      id: 'break', name: '직원 휴게실', icon: '☕', size: '6 × 10', tone: '#FBCFE8',
      furniture: ['커피 머신', '의자 ×2', '캐비닛'],
      npcs: ['휴식 중 간호사'],
      scenarios: ['동료와 잡담', '교대 인수인계'],
      hotspots: 0,
    },

    // ─── OR (수술실) ───
    {
      dept: 'OR', deptName: '수술실', deptColor: '#9333EA', floor: '3F',
      id: 'preop', name: 'Pre-op Holding', icon: '💤', size: '12 × 10', tone: '#FBCFE8',
      furniture: ['병상 ×4', 'IV ×3', '모니터 ×3'],
      npcs: ['Mr. Garcia (충수염)', '환자 ×2', '간호사', '마취과 의사'],
      scenarios: ['수술 동의 확인', 'NPO 체크', '마취 전 면담'],
      hotspots: 1,
    },
    {
      dept: 'OR', deptName: '수술실', deptColor: '#9333EA', floor: '3F',
      id: 'scrub', name: 'Scrub Sinks', icon: '🚿', size: '11 × 10', tone: '#BAE6FD',
      furniture: ['스크럽 싱크 ×4', '가운 락커 ×3 (Linen)'],
      npcs: ['외과의 (스크럽 중)'],
      scenarios: ['손 위생 절차', '가운 입기'],
      hotspots: 0,
    },
    {
      dept: 'OR', deptName: '수술실', deptColor: '#9333EA', floor: '3F',
      id: 'or1', name: 'OR 1 · 충수절제', icon: '🔪', size: '22 × 12', tone: '#E9D5FF',
      furniture: ['수술 테이블 (드레이프)', '수술등 ×2', '마취기', '기구 트레이 ×2', '모니터 ×2', '멸균 캐비닛 ×6', 'STATUS BOARD'],
      npcs: ['집도의', '제1보조의', '제2보조의', '스크럽 간호사', '마취과의', '서큘레이팅 간호사'],
      scenarios: ['Time-out 진행', '기구 패스', '마취 모니터링', '출혈 조절'],
      hotspots: 3,
    },
    {
      dept: 'OR', deptName: '수술실', deptColor: '#9333EA', floor: '3F',
      id: 'pacu', name: 'PACU 회복실', icon: '❤️‍🩹', size: '14 × 8', tone: '#A7F3D0',
      furniture: ['병상 ×3', '모니터 ×2', 'PACU 너스 스테이션'],
      npcs: ['PACU 수석', '회복 간호사 ×2', '회복 환자'],
      scenarios: ['활력 체크', 'PACU 인계', '통증 관리'],
      hotspots: 1,
    },
    {
      dept: 'OR', deptName: '수술실', deptColor: '#9333EA', floor: '3F',
      id: 'family', name: '가족 면담실', icon: '🪑', size: '9 × 8', tone: '#FED7AA',
      furniture: ['의자 ×4', '커피 머신', '식물'],
      npcs: ['대기 가족 ×2'],
      scenarios: ['수술 중간 보고', '결과 통보'],
      hotspots: 1,
    },

    // ─── PEDS (소아과) ───
    {
      dept: 'PEDS', deptName: '소아과', deptColor: '#3B82F6', floor: '4F',
      id: 'welcome', name: '환영 · 대기실', icon: '🌈', size: '22 × 9', tone: '#FBCFE8',
      furniture: ['환영 데스크', '의자 4 (컬러)', '풍선 4', '벽화', '장난감'],
      npcs: ['환영 간호사 ×2', '부모 ×2', '아이 ×2'],
      scenarios: ['첫 진료 접수', '예방접종 동의서', '부모 안심'],
      hotspots: 1,
    },
    {
      dept: 'PEDS', deptName: '소아과', deptColor: '#3B82F6', floor: '4F',
      id: 'ward', name: '소아 병동', icon: '🛏', size: '12 × 12', tone: '#FBCFE8',
      furniture: ['소아 크립 ×4 (곰/여우/토끼/판다 인형)', 'IV ×3', '모니터 ×2'],
      npcs: ['환자 아이 ×3', '부모 ×3', '담당 간호사'],
      scenarios: ['투약 안내', '활력 체크', '식이 안내'],
      hotspots: 1,
    },
    {
      dept: 'PEDS', deptName: '소아과', deptColor: '#3B82F6', floor: '4F',
      id: 'play', name: '놀이방', icon: '🎠', size: '11 × 12', tone: '#FED7AA',
      furniture: ['플레이매트', '토이 박스', '블록', '슬라이드', '흔들 목마', '그림책'],
      npcs: ['Mia (4세, 우는 중)', '아이 ×1', '부모 ×1'],
      scenarios: ['우는 아이 달래기', '주의 분산'],
      hotspots: 1,
    },
    {
      dept: 'PEDS', deptName: '소아과', deptColor: '#3B82F6', floor: '4F',
      id: 'exam', name: '진료실', icon: '🩺', size: '8 × 9', tone: '#BAE6FD',
      furniture: ['진료대', '모니터', '의자'],
      npcs: ['소아과 의사', '부모', '아이'],
      scenarios: ['발열 진단', '문진'],
      hotspots: 1,
    },
    {
      dept: 'PEDS', deptName: '소아과', deptColor: '#3B82F6', floor: '4F',
      id: 'vax', name: '예방접종실', icon: '💉', size: '10 × 9', tone: '#A7F3D0',
      furniture: ['진료대', '백신 냉장고', '약품 캐비닛'],
      npcs: ['예방접종 간호사'],
      scenarios: ['MMR 설명', '백신 부작용 안내'],
      hotspots: 1,
    },
    {
      dept: 'PEDS', deptName: '소아과', deptColor: '#3B82F6', floor: '4F',
      id: 'pickup', name: '약 픽업창', icon: '💊', size: '6 × 9', tone: '#DDD6FE',
      furniture: ['픽업 카운터', '약품 캐비닛'],
      npcs: ['픽업 간호사'],
      scenarios: ['소아 시럽 처방 안내'],
      hotspots: 0,
    },

    // ─── ICU (중환자실) ───
    {
      dept: 'ICU', deptName: '중환자실', deptColor: '#DC2626', floor: '5F',
      id: 'r1', name: 'Room 1 · Wong', icon: '🛏', size: '6 × 12', tone: '#FCA5A5',
      furniture: ['병상 (Intubated)', 'Ventilator', '모니터 ×2', 'IV ×2', '유리 파티션'],
      npcs: ['Mr. Wong (의식 없음)', '가족 (방문)'],
      scenarios: ['가족 설명', '인공호흡기 보고'],
      hotspots: 1,
    },
    {
      dept: 'ICU', deptName: '중환자실', deptColor: '#DC2626', floor: '5F',
      id: 'r2', name: 'Room 2 · Lee', icon: '🛏', size: '6 × 12', tone: '#FEF08A',
      furniture: ['병상', '모니터 ×2', 'IV', '유리 파티션'],
      npcs: ['Mrs. Lee (안정)', '간호사'],
      scenarios: ['활력 체크', 'Code Blue 대응'],
      hotspots: 1,
    },
    {
      dept: 'ICU', deptName: '중환자실', deptColor: '#DC2626', floor: '5F',
      id: 'r3', name: 'Room 3 · Park (ARDS)', icon: '🛏', size: '6 × 12', tone: '#FCA5A5',
      furniture: ['병상', 'Ventilator (ARDS 모드)', '모니터 ×2', 'IV ×2'],
      npcs: ['Mr. Park (위급)', '간호사', '호흡치료사 (RT)'],
      scenarios: ['VENT 설정 보고', 'ABG 결과 보고', 'RT 협업'],
      hotspots: 2,
    },
    {
      dept: 'ICU', deptName: '중환자실', deptColor: '#DC2626', floor: '5F',
      id: 'r4', name: 'Room 4 · Park', icon: '🛏', size: '7 × 12', tone: '#A7F3D0',
      furniture: ['병상', '모니터 ×2', 'IV'],
      npcs: ['Mrs. Park (안정)', '가족 (방문)'],
      scenarios: ['ICU 섬망 대응', '가족 면담'],
      hotspots: 0,
    },
    {
      dept: 'ICU', deptName: '중환자실', deptColor: '#DC2626', floor: '5F',
      id: 'station', name: '중앙 모니터링', icon: '🖥', size: '22 × 8', tone: '#BAE6FD',
      furniture: ['중앙 데스크 (대형)', '모니터 뱅크 (4-방 표시)', '응급 카트', '아이솔레이션 캐비닛 ×3'],
      npcs: ['수석 간호사', '간호사 ×2', '주치의'],
      scenarios: ['SBAR 인계', '모니터 알람 해석', '교대 인계'],
      hotspots: 1,
    },
    {
      dept: 'ICU', deptName: '중환자실', deptColor: '#DC2626', floor: '5F',
      id: 'family', name: '가족실', icon: '💔', size: '8 × 10', tone: '#FBCFE8',
      furniture: ['소파', '의자 ×6', '테이블', '티슈박스', '식물'],
      npcs: ['가족 ×2 (대기)'],
      scenarios: ['임종 면담', '치료 옵션 설명', 'DNR 동의'],
      hotspots: 1,
    },
    {
      dept: 'ICU', deptName: '중환자실', deptColor: '#DC2626', floor: '5F',
      id: 'break', name: '직원 휴게실', icon: '☕', size: '6 × 10', tone: '#FEF08A',
      furniture: ['테이블', '의자 ×4', '커피 머신', '냉장고'],
      npcs: ['휴식 중 간호사'],
      scenarios: ['교대 인계', '교대 휴식'],
      hotspots: 0,
    },
    {
      dept: 'ICU', deptName: '중환자실', deptColor: '#DC2626', floor: '5F',
      id: 'med', name: 'Med Room', icon: '💊', size: '6 × 10', tone: '#DDD6FE',
      furniture: ['약품 캐비닛 ×3 (Drug)', '차트 캐비닛', 'Pyxis 자동 약장'],
      npcs: ['투약 간호사'],
      scenarios: ['투약 준비', '용량 확인', '컨트롤드 약 픽업'],
      hotspots: 1,
    },
    {
      dept: 'ICU', deptName: '중환자실', deptColor: '#DC2626', floor: '5F',
      id: 'equip', name: '장비 보관실', icon: '📦', size: '5 × 10', tone: '#A7F3D0',
      furniture: ['Vent 캐비닛', '응급 카트 (Crash)', '서플라이 캐비닛'],
      npcs: ['—'],
      scenarios: ['장비 점검', '응급 장비 호출'],
      hotspots: 0,
    },

    // ─── PHARMA (약국) ───
    {
      dept: 'PHARMA', deptName: '약국', deptColor: '#16A34A', floor: '1F',
      id: 'dispense', name: '디스펜싱', icon: '💊', size: '11 × 8', tone: '#FBCFE8',
      furniture: ['약 선반 ×6 (Pharma)', '서플라이 캐비닛', '카테고리 라벨 (A:항생제, F:통제)'],
      npcs: ['약사', '약무직 ×2'],
      scenarios: ['처방 검토', '재고 보충'],
      hotspots: 1,
    },
    {
      dept: 'PHARMA', deptName: '약국', deptColor: '#16A34A', floor: '1F',
      id: 'compound', name: 'Compounding · 냉장', icon: '⚗', size: '12 × 8', tone: '#DDD6FE',
      furniture: ['컴파운딩 벤치', '냉장고 ×2 (백신/인슐린)', '통제약물 금고'],
      npcs: ['컴파운딩 약사'],
      scenarios: ['알약 카운팅', '백신 픽업', '통제약물 2인 픽업'],
      hotspots: 2,
    },
    {
      dept: 'PHARMA', deptName: '약국', deptColor: '#16A34A', floor: '1F',
      id: 'cleanroom', name: 'IV 무균실 (USP 797)', icon: '🧪', size: '22 × 8', tone: '#A7F3D0',
      furniture: ['Laminar Flow Hood ×3 (HEPA)', '카운터', '원심분리기', '라벨 프린터', '벽전화 (STAT)', '플로어 테이프 (멸균선)'],
      npcs: ['가운 입은 약사 ×2'],
      scenarios: ['STAT IV 혼합', '항생제 조제', '바이알 검증'],
      hotspots: 2,
    },
    {
      dept: 'PHARMA', deptName: '약국', deptColor: '#16A34A', floor: '1F',
      id: 'pickup', name: '픽업 카운터', icon: '🏪', size: '16 × 11', tone: '#FED7AA',
      furniture: ['카운터 (드롭/픽업/상담)', '큐 로프 ×4', '의자 ×4'],
      npcs: ['약무직 ×3', '간호사 (픽업)', '환자 ×3', '부모+아이'],
      scenarios: ['헤파린 더블체크', '구두 처방 받기', '복약 상담'],
      hotspots: 2,
    },
    {
      dept: 'PHARMA', deptName: '약국', deptColor: '#16A34A', floor: '1F',
      id: 'kiosk', name: '자가 키오스크', icon: '📺', size: '7 × 11', tone: '#FEF08A',
      furniture: ['키오스크 ×2', '의자 ×4'],
      npcs: ['환자 ×2'],
      scenarios: ['자가 픽업', 'ID 인증'],
      hotspots: 0,
    },
  ];

  function ScreenRoomGallery() {
    const t = window.ForinTokens;
    const C = '#2A2522';

    const [filter, setFilter] = React.useState('ALL');
    const deptOrder = ['ER', 'ICU', 'OR', 'PEDS', 'PHARMA'];
    const deptMeta = {
      ER:     { name: '응급실 ER',    icon: '🚑', color: '#DC2626' },
      ICU:    { name: '중환자실 ICU', icon: '🛏', color: '#7F1D1D' },
      OR:     { name: '수술실 OR',    icon: '🔪', color: '#9333EA' },
      PEDS:   { name: '소아과 Peds',  icon: '👶', color: '#3B82F6' },
      PHARMA: { name: '약국 Pharma',  icon: '💊', color: '#16A34A' },
    };
    const byDept = ROOM_GALLERY.reduce((acc, r) => {
      (acc[r.dept] = acc[r.dept] || []).push(r);
      return acc;
    }, {});
    const visibleDepts = filter === 'ALL' ? deptOrder : [filter];

    return (
      <div data-screen-label="Room Gallery" style={{ height: '100%', background: t.cream, position: 'relative', overflow: 'auto', paddingBottom: 110 }}>
        <window.ForinTopBar
          title="방 디자인 갤러리"
          left={<span style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 18, color: C }}>‹</span>}
          right={<span style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 11, color: C }}>{ROOM_GALLERY.length}개 방</span>}
        />

        {/* hero summary */}
        <div style={{ margin: '14px 18px 0', background: t.peach, border: `3px solid ${C}`, padding: 12, boxShadow: `4px 4px 0 0 ${t.peachShadow}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ fontSize: 24 }}>📐</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 9, color: t.textSoft, lineHeight: 1 }}>DEV REFERENCE</div>
              <div style={{ fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 15, color: C, lineHeight: 1.2, marginTop: 3 }}>
                전체 부서 · 전체 방 목록
              </div>
            </div>
            <div style={{ background: '#fff', border: `2px solid ${C}`, padding: '3px 7px', boxShadow: `2px 2px 0 0 ${C}`, fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: C, textAlign: 'center' }}>
              <div style={{ color: t.textSoft, fontSize: 8 }}>총 방</div>
              <div>{ROOM_GALLERY.length}</div>
            </div>
          </div>
        </div>

        {/* filter tabs */}
        <div style={{ margin: '12px 12px 0', display: 'flex', gap: 4, overflowX: 'auto', paddingBottom: 2 }}>
          <RGTab id="ALL" label="전체" icon="✨" color={C} active={filter==='ALL'} count={ROOM_GALLERY.length}
            onClick={() => setFilter('ALL')}/>
          {deptOrder.map(d => {
            const m = deptMeta[d];
            const count = (byDept[d] || []).length;
            return (
              <RGTab key={d} id={d} label={m.icon + ' ' + d} icon="" color={m.color}
                active={filter===d} count={count}
                onClick={() => setFilter(d)}/>
            );
          })}
        </div>

        {/* rooms grouped by dept */}
        <div style={{ padding: '12px 18px 20px' }}>
          {visibleDepts.map(dept => {
            const list = byDept[dept] || [];
            if (list.length === 0) return null;
            const m = deptMeta[dept];
            return (
              <div key={dept} style={{ marginBottom: 18 }}>
                {/* dept header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <div style={{ width: 26, height: 26, background: m.color, border: `2.5px solid ${C}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, boxShadow: `2px 2px 0 0 ${C}` }}>
                    {m.icon}
                  </div>
                  <div style={{ fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 13, color: C, flex: 1 }}>
                    {m.name}
                  </div>
                  <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 10, color: t.textSoft }}>
                    {list.length}개 방 · {list[0].floor}
                  </div>
                </div>
                {/* room cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {list.map(r => <RoomCard key={r.id} room={r}/>)}
                </div>
              </div>
            );
          })}
        </div>

        <window.ForinBottomNav active="board"/>
      </div>
    );
  }

  function RGTab({ id, label, icon, color, active, count, onClick }) {
    const C = '#2A2522';
    return (
      <button onClick={onClick} style={{
        flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: 4,
        background: active ? color : '#fff',
        border: `2.5px solid ${C}`,
        boxShadow: active ? `2.5px 2.5px 0 0 ${C}` : `2px 2px 0 0 ${C}66`,
        padding: '5px 8px', cursor: 'pointer',
        fontFamily: '"DungGeunMo",monospace', fontSize: 10,
        color: active ? '#fff' : C,
        transform: active ? 'translate(-1px,-1px)' : 'none',
      }}>
        {icon && <span style={{ fontSize: 13, lineHeight: 1 }}>{icon}</span>}
        <span>{label}</span>
        {count > 0 && (
          <span style={{
            background: active ? '#fff' : color, color: active ? color : '#fff',
            border: `1.5px solid ${C}`, padding: '0 4px', fontSize: 9, lineHeight: '12px',
            marginLeft: 2, minWidth: 14, textAlign: 'center',
          }}>{count}</span>
        )}
      </button>
    );
  }

  function RoomCard({ room: r }) {
    const t = window.ForinTokens;
    const C = '#2A2522';
    return (
      <div style={{
        background: '#fff', border: `3px solid ${C}`, padding: 0,
        boxShadow: `3px 3px 0 0 ${C}`, position: 'relative', overflow: 'hidden',
      }}>
        {/* color band on top */}
        <div style={{ height: 6, background: r.deptColor }}/>

        {/* header row */}
        <div style={{ padding: '8px 10px 6px', background: r.tone, borderBottom: `2px solid ${C}`, display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, background: '#fff', border: `2px solid ${C}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0, boxShadow: `1.5px 1.5px 0 0 ${C}` }}>
            {r.icon}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: '"DungGeunMo","Galmuri11",monospace', fontSize: 13, color: C, lineHeight: 1.1 }}>{r.name}</div>
            <div style={{ fontFamily: '"Galmuri11",monospace', fontSize: 10, color: t.textSoft, marginTop: 2 }}>
              ID: <code style={{ fontFamily: '"DungGeunMo",monospace', background: '#fff', padding: '0 3px', border: `1px solid ${C}66` }}>{r.id}</code>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
            <div style={{ background: '#fff', border: `1.5px solid ${C}`, padding: '0 4px', fontFamily: '"DungGeunMo",monospace', fontSize: 9, color: C }}>
              📐 {r.size}
            </div>
            {r.hotspots > 0 && (
              <div style={{ background: '#FEF08A', border: `1.5px solid ${C}`, padding: '0 4px', fontFamily: '"DungGeunMo",monospace', fontSize: 9, color: C }}>
                ! {r.hotspots} 핫스팟
              </div>
            )}
          </div>
        </div>

        {/* room schematic mini-preview */}
        <div style={{ padding: '8px 10px 10px' }}>
          <MiniSchematic room={r}/>

          {/* details */}
          <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 5, fontFamily: '"Galmuri11","Pretendard",sans-serif', fontSize: 10, color: t.text, lineHeight: 1.45 }}>
            <DetailRow label="🪑 가구"   items={r.furniture}/>
            <DetailRow label="👥 NPC"    items={r.npcs}/>
            <DetailRow label="⚑ 시나리오" items={r.scenarios}/>
          </div>
        </div>
      </div>
    );
  }

  function DetailRow({ label, items }) {
    const t = window.ForinTokens;
    const C = '#2A2522';
    return (
      <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
        <div style={{ fontFamily: '"DungGeunMo",monospace', fontSize: 9, color: C, minWidth: 48, flexShrink: 0, marginTop: 1 }}>{label}</div>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', flex: 1 }}>
          {items.map((it, i) => (
            <span key={i} style={{ background: t.paper, border: `1px solid ${C}55`, padding: '1px 5px', fontSize: 10, color: t.text }}>
              {it}
            </span>
          ))}
        </div>
      </div>
    );
  }

  // Mini schematic: shows the room's bounds proportions with abstract glyphs
  // for the key furniture types. Stylized — not literal — but enough to
  // convey layout density at a glance.
  function MiniSchematic({ room: r }) {
    const C = '#2A2522';
    const [W, H] = r.size.split('×').map(s => parseInt(s.trim(), 10));
    const aspect = W / H;
    const previewW = 280;
    const previewH = previewW / aspect;
    // pick glyphs from furniture text
    const glyphFor = (s) => {
      if (/병상|크립|침대|진료대|수술|테이블/i.test(s)) return '🛏';
      if (/모니터|monitor/i.test(s)) return '🖥';
      if (/iv|드립/i.test(s)) return '💧';
      if (/캐비닛|선반|보관|약품|차트|냉장/i.test(s)) return '🗄';
      if (/의자|소파|벤치/i.test(s)) return '🪑';
      if (/리셉션|데스크|카운터|키오스크/i.test(s)) return '🏪';
      if (/식물/i.test(s)) return '🪴';
      if (/커피/i.test(s)) return '☕';
      if (/싱크|hood|벤치/i.test(s)) return '🧪';
      if (/카트|crash/i.test(s)) return '🚨';
      if (/풍선|블록|슬라이드|목마|장난감|벽화/i.test(s)) return '🎈';
      if (/x-ray/i.test(s)) return '🩻';
      if (/마취기|수술등/i.test(s)) return '💡';
      return '·';
    };
    const glyphs = r.furniture.slice(0, 8).map(glyphFor);

    return (
      <div style={{ position: 'relative', width: previewW, maxWidth: '100%', height: previewH, maxHeight: 110, background: r.tone, border: `2px solid ${C}`, boxShadow: `inset 0 0 0 1px rgba(255,255,255,.6)`, overflow: 'hidden' }}>
        {/* tile grid hint */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.25,
          backgroundImage: `linear-gradient(${C}33 1px, transparent 1px), linear-gradient(90deg, ${C}33 1px, transparent 1px)`,
          backgroundSize: `${Math.max(8, previewW/W)}px ${Math.max(8, previewH/H)}px`,
        }}/>
        {/* outer wall band */}
        <div style={{ position: 'absolute', inset: 2, border: `2px solid ${C}99`, pointerEvents: 'none' }}/>
        {/* glyphs distributed */}
        {glyphs.map((g, i) => {
          const col = i % 4, row = Math.floor(i / 4);
          return (
            <div key={i} style={{
              position: 'absolute',
              left: `${10 + col * 22}%`, top: `${20 + row * 40}%`,
              fontSize: 18, lineHeight: 1, filter: 'drop-shadow(1px 1px 0 rgba(0,0,0,.3))',
            }}>{g}</div>
          );
        })}
        {/* bounds label */}
        <div style={{ position: 'absolute', right: 4, top: 4, background: '#fff', border: `1px solid ${C}`, padding: '0 4px', fontFamily: '"DungGeunMo",monospace', fontSize: 8, color: C }}>
          {r.size} tiles
        </div>
      </div>
    );
  }

  Object.assign(window, { ScreenRoomGallery, ROOM_GALLERY });
})();
