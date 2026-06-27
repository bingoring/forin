// interior-objects-pharma2.jsx — Central Pharmacy blueprint objects.
// v2 pixel style (visible TOP + FRONT + depth, 45°). Tile-based coords.
// Loads before the Pharmacy screen render.

(function () {
  const C = '#2A2522';
  const T = window.ITILE || 16;

  // ─── PneumaticTube — 기송관 송수신 기기 (벽면 매립, 안내등 점멸) ─────
  function PneumaticTube({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 6, width: T * 1.6, height: T * 2.4, filter: 'drop-shadow(2px 3px 0 rgba(0,0,0,.26))' }}>
        <svg viewBox="0 0 26 40" width={T * 1.6} height={T * 2.4} shapeRendering="crispEdges">
          {/* transparent pipe rising */}
          <rect x="16" y="0" width="8" height="40" fill="#CFE3EC" stroke={C} strokeWidth=".5" opacity=".85"/>
          <rect x="18" y="0" width="2" height="40" fill="#EAF6FA"/>
          {/* a capsule travelling in the pipe */}
          <rect x="17.5" y="14" width="5" height="7" rx="2.5" fill="#FBBF24" stroke={C} strokeWidth=".5"/>
          <rect x="18" y="15.5" width="4" height="2" fill="#FDE68A"/>
          {/* docking unit */}
          <rect x="1" y="6" width="15" height="20" fill="#94A3B8" stroke={C} strokeWidth=".6"/>
          <rect x="2" y="7" width="13" height="2" fill="#CBD5E1"/>
          {/* receive port */}
          <rect x="3" y="11" width="10" height="8" fill="#1F2937" stroke={C} strokeWidth=".5"/>
          <ellipse cx="8" cy="15" rx="3.5" ry="3" fill="#0B1620"/>
          {/* status panel + light */}
          <rect x="3" y="20" width="10" height="4" fill="#0F1A24"/>
          <rect x="4" y="21" width="5" height="1.4" fill="#22D3EE"/>
          {/* base cabinet */}
          <rect x="1" y="26" width="15" height="11" fill="#6B7280" stroke={C} strokeWidth=".5"/>
          <rect x="2.5" y="27.5" width="12" height="3" fill="#fff" stroke={C} strokeWidth=".3"/>
        </svg>
        {/* blinking arrival light */}
        <div style={{ position: 'absolute', left: 12, top: 2, width: 4, height: 4, background: '#EF4444', borderRadius: '50%', animation: 'forinBlink 1s steps(2,end) infinite' }}/>
      </div>
    );
  }

  // ─── TubeCapsuleRack — 원통형 기송관 캡슐 거치대 (5-6개) ────────────
  function TubeCapsuleRack({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T + 1, width: T * 1.6, height: T - 2, filter: 'drop-shadow(1.5px 2px 0 rgba(0,0,0,.22))' }}>
        <svg viewBox="0 0 26 12" width={T * 1.6} height={T - 2} shapeRendering="crispEdges">
          {/* rack */}
          <rect x="1" y="8" width="24" height="3" fill="#94A3B8" stroke={C} strokeWidth=".5"/>
          {/* capsules slotted */}
          {[2,6,10,14,18,22].map((cx,i) => (
            <g key={i}>
              <rect x={cx} y="2" width="3.4" height="7" rx="1.7" fill={['#FBBF24','#60A5FA','#34D399','#FBBF24','#F87171','#60A5FA'][i]} stroke={C} strokeWidth=".4"/>
              <rect x={cx+0.4} y="3" width="2.6" height="2" fill="#fff" opacity=".55"/>
            </g>
          ))}
        </svg>
      </div>
    );
  }

  // ─── ReturnBox — 약품 반납함 ──────────────────────────────────────
  function ReturnBox({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T + 2, top: y * T, width: T - 4, height: T * 1.3, filter: 'drop-shadow(1.5px 2px 0 rgba(0,0,0,.22))' }}>
        <svg viewBox="0 0 12 18" width={T - 4} height={T * 1.3} shapeRendering="crispEdges">
          {/* angled deposit lid */}
          <path d="M1 2 L11 0 L11 4 L1 5 Z" fill="#374151" stroke={C} strokeWidth=".5"/>
          <rect x="2.5" y="2.2" width="6" height="1.2" fill="#0F1A24"/>{/* slot */}
          {/* body */}
          <rect x="1" y="5" width="10" height="12" fill="#3B82F6" stroke={C} strokeWidth=".5"/>
          <rect x="2" y="8" width="8" height="3" fill="#fff" stroke={C} strokeWidth=".3"/>
          <text x="6" y="10.3" fontSize="2.2" fill={C} textAnchor="middle" fontFamily="monospace">RETURN</text>
        </svg>
      </div>
    );
  }

  // ─── BarcodeScanner — 바코드 스캐너 (레이저 Red) ───────────────────
  function BarcodeScanner({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T + 4, top: y * T + 3, width: T - 8, height: T - 5, filter: 'drop-shadow(1px 1.5px 0 rgba(0,0,0,.2))' }}>
        <svg viewBox="0 0 8 10" width={T - 8} height={T - 5} shapeRendering="crispEdges">
          <rect x="2" y="2" width="4" height="6" rx="1" fill="#1F2937" stroke={C} strokeWidth=".4"/>
          <rect x="3" y="0" width="2" height="3" fill="#374151"/>
          {/* red laser */}
          <rect x="0.5" y="8" width="7" height="1" fill="#EF4444"/>
          <rect x="1" y="9" width="6" height="0.6" fill="#FCA5A5" opacity=".7"/>
        </svg>
      </div>
    );
  }

  // ─── ATCMachine — 자동 알약 조제기 (빌딩형, 약봉지 배출) ────────────
  function ATCMachine({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 16, width: T * 2.4, height: T * 3.4, filter: 'drop-shadow(3px 4px 0 rgba(0,0,0,.3))' }}>
        <svg viewBox="0 0 38 54" width={T * 2.4} height={T * 3.4} shapeRendering="crispEdges">
          {/* tall cabinet body */}
          <rect x="2" y="0" width="34" height="44" fill="#E5E7EB" stroke={C} strokeWidth=".7"/>
          <rect x="2" y="0" width="34" height="3" fill="#16A34A"/>
          {/* grid of pill canister cells (building-like) */}
          {[...Array(5)].map((_,r) => [...Array(6)].map((_,c) => (
            <rect key={r+'-'+c} x={4 + c*5.4} y={5 + r*5} width="4.6" height="4" fill="#CFE3EC" stroke={C} strokeWidth=".25"/>
          )))}
          {/* control screen */}
          <rect x="24" y="31" width="10" height="9" fill="#0F1A24" stroke={C} strokeWidth=".5"/>
          <rect x="25" y="32.5" width="8" height="1.4" fill="#22D3EE"/>
          <rect x="25" y="35" width="6" height="1.4" fill="#FBBF24"/>
          {/* output chute */}
          <rect x="6" y="40" width="12" height="4" fill="#1F2937" stroke={C} strokeWidth=".5"/>
          {/* sealed packet strip coming out */}
          <rect x="7" y="44" width="10" height="6" fill="#fff" stroke={C} strokeWidth=".4"/>
          <line x1="10" y1="44" x2="10" y2="50" stroke={C} strokeWidth=".3"/>
          <line x1="13" y1="44" x2="13" y2="50" stroke={C} strokeWidth=".3"/>
          {/* feet */}
          <rect x="3" y="44" width="3" height="8" fill="#9CA3AF"/>
          <rect x="32" y="44" width="3" height="8" fill="#9CA3AF"/>
        </svg>
      </div>
    );
  }

  // ─── LASAShelf — 고위험/유사외형 약물 선반 (빨간 경고) ──────────────
  function LASAShelf({ x, y, w = 3 }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 8, width: T * w, height: T * 1.5, filter: 'drop-shadow(2px 2px 0 rgba(0,0,0,.22))' }}>
        <svg viewBox={`0 0 ${w*16} 24`} width={T * w} height={T * 1.5} shapeRendering="crispEdges" preserveAspectRatio="none">
          {/* warning header */}
          <rect x="0" y="0" width={w*16} height="5" fill="#DC2626" stroke={C} strokeWidth=".5"/>
          <text x={w*8} y="3.8" fontSize="3" fill="#fff" textAnchor="middle" fontFamily="monospace">⚠ HIGH-ALERT LASA</text>
          {/* shelf body */}
          <rect x="0" y="5" width={w*16} height="19" fill="#D6CFB8" stroke={C} strokeWidth=".5"/>
          {/* bins with tall-man-lettering labels */}
          {[...Array(w)].map((_,i) => (
            <g key={i}>
              <rect x={2 + i*16} y="8" width="12" height="13" fill="#FFF8E7" stroke={C} strokeWidth=".4"/>
              <rect x={2 + i*16} y="8" width="12" height="2.4" fill={['#F59E0B','#3B82F6','#10B981'][i%3]}/>
              <rect x={3 + i*16} y="12" width="10" height="1" fill={C} opacity=".5"/>
              <rect x={3 + i*16} y="14.5" width="7" height="1" fill={C} opacity=".5"/>
            </g>
          ))}
        </svg>
      </div>
    );
  }

  // ─── NarcoticsVault — 이중 잠금 마약류 금고 (지문+자물쇠) ───────────
  function NarcoticsVault({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 4, width: T * 2, height: T * 2.4, filter: 'drop-shadow(3px 4px 0 rgba(0,0,0,.3))' }}>
        <svg viewBox="0 0 32 40" width={T * 2} height={T * 2.4} shapeRendering="crispEdges">
          {/* heavy steel body */}
          <rect x="1" y="1" width="30" height="38" fill="#4B5563" stroke={C} strokeWidth="1"/>
          <rect x="2" y="2" width="28" height="2" fill="#6B7280"/>
          {/* thick door */}
          <rect x="3" y="4" width="26" height="33" fill="#5B6776" stroke={C} strokeWidth=".7"/>
          <rect x="4" y="5" width="2" height="31" fill="#7E8893"/>{/* hinge edge highlight */}
          {/* fingerprint reader (glowing) */}
          <rect x="19" y="9" width="8" height="9" fill="#0F1A24" stroke={C} strokeWidth=".5"/>
          <ellipse cx="23" cy="13.5" rx="2.6" ry="3" fill="#7F1D1D"/>
          <ellipse cx="23" cy="13.5" rx="1.6" ry="2" fill="#EF4444"/>
          {/* heavy combination lock */}
          <circle cx="23" cy="24" r="3.5" fill="#1F2937" stroke={C} strokeWidth=".6"/>
          <circle cx="23" cy="24" r="1.3" fill="#FACC15"/>
          {/* big latch handle */}
          <rect x="7" y="18" width="9" height="3" fill="#374151" stroke={C} strokeWidth=".5"/>
          <rect x="13" y="18" width="3" height="8" fill="#374151" stroke={C} strokeWidth=".5"/>
          {/* label */}
          <rect x="6" y="6" width="12" height="3.5" fill="#FACC15" stroke={C} strokeWidth=".4"/>
          <text x="12" y="8.7" fontSize="2.6" fill={C} textAnchor="middle" fontFamily="monospace">NARCOTICS</text>
        </svg>
      </div>
    );
  }

  // ─── BSC — 생물안전작업대 (Biological Safety Cabinet, 항암 조제) ─────
  function BSC({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 4, width: T * 2.4, height: T * 2, filter: 'drop-shadow(3px 4px 0 rgba(0,0,0,.24))' }}>
        <svg viewBox="0 0 38 32" width={T * 2.4} height={T * 2} shapeRendering="crispEdges">
          {/* exhaust top (HEPA) */}
          <rect x="2" y="0" width="34" height="5" fill="#6B7280" stroke={C} strokeWidth=".6"/>
          <text x="19" y="3.6" fontSize="2.6" fill="#A7F3D0" textAnchor="middle" fontFamily="monospace">↑ HEPA EXHAUST</text>
          {/* cabinet frame */}
          <rect x="2" y="5" width="34" height="22" fill="#94A3B8" stroke={C} strokeWidth=".7"/>
          {/* angled sash glass with green safety light */}
          <rect x="4" y="7" width="30" height="11" fill="#CFE9DE" stroke={C} strokeWidth=".5" opacity=".9"/>
          <rect x="4" y="7" width="30" height="2" fill="#34D399"/>
          <rect x="5" y="9.5" width="11" height="2" fill="#fff" opacity=".5"/>{/* glare */}
          {/* work surface — syringe + chemo vial inside */}
          <rect x="4" y="18" width="30" height="6" fill="#E8EEF0" stroke={C} strokeWidth=".5"/>
          <rect x="7" y="20" width="12" height="1.6" fill="#4B5563"/>{/* syringe */}
          <rect x="22" y="19" width="5" height="4" fill="#A78BFA" stroke={C} strokeWidth=".4"/>{/* chemo vial */}
          {/* feet */}
          <rect x="3" y="27" width="4" height="4" fill="#6B7280"/>
          <rect x="31" y="27" width="4" height="4" fill="#6B7280"/>
        </svg>
      </div>
    );
  }

  // ─── MagnehelicGauge — 차압계 (아날로그 다이얼) ───────────────────
  function MagnehelicGauge({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T + 2, top: y * T + 1, width: T - 4, height: T - 2, filter: 'drop-shadow(1.5px 2px 0 rgba(0,0,0,.22))' }}>
        <svg viewBox="0 0 12 12" width={T - 4} height={T - 2} shapeRendering="crispEdges">
          <rect x="0" y="0" width="12" height="12" fill="#E5E7EB" stroke={C} strokeWidth=".6"/>
          <circle cx="6" cy="6" r="4.6" fill="#fff" stroke={C} strokeWidth=".5"/>
          {/* dial ticks */}
          {[0,1,2,3,4,5,6,7].map(i => {
            const a = (i/8)*6.283; return <rect key={i} x={6 + Math.cos(a)*3.6 - 0.2} y={6 + Math.sin(a)*3.6 - 0.2} width=".5" height=".5" fill={C}/>;
          })}
          {/* needle */}
          <line x1="6" y1="6" x2="8.6" y2="3.8" stroke="#DC2626" strokeWidth=".6"/>
          <circle cx="6" cy="6" r=".7" fill={C}/>
          <rect x="3.5" y="9.5" width="5" height="1.4" fill="#16A34A"/>{/* +Pa label */}
        </svg>
      </div>
    );
  }

  // ─── ChemoSpillKit — 항암제 유출 처리 키트 (노란 응급 가방) ─────────
  function ChemoSpillKit({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T + 2, top: y * T + 1, width: T - 4, height: T - 2, filter: 'drop-shadow(1.5px 2px 0 rgba(0,0,0,.24))' }}>
        <svg viewBox="0 0 12 12" width={T - 4} height={T - 2} shapeRendering="crispEdges">
          {/* handle */}
          <path d="M4 2 Q6 0 8 2" fill="none" stroke={C} strokeWidth=".7"/>
          {/* bag body */}
          <rect x="1" y="2.5" width="10" height="8.5" rx="1.5" fill="#FACC15" stroke={C} strokeWidth=".6"/>
          <rect x="1.5" y="3" width="2" height="7.5" fill="#FDE68A"/>
          {/* hazard diamond */}
          <path d="M6 4 L8 6 L6 8 L4 6 Z" fill="#fff" stroke={C} strokeWidth=".4"/>
          <text x="6" y="6.8" fontSize="2.4" fill="#B45309" textAnchor="middle" fontFamily="monospace">☣</text>
          <text x="6" y="10.4" fontSize="2" fill={C} textAnchor="middle" fontFamily="monospace">SPILL</text>
        </svg>
      </div>
    );
  }

  // ─── TackyMat — 점착성 바닥 매트 (먼지 제거, 전실 입구) ─────────────
  function TackyMat({ x, y, w = 2 }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T, width: T * w, height: T, pointerEvents: 'none' }}>
        <svg viewBox={`0 0 ${w*16} 16`} width={T * w} height={T} shapeRendering="crispEdges" preserveAspectRatio="none">
          <rect x="1" y="2" width={w*16-2} height="12" fill="#7DC0D8" stroke={C} strokeWidth=".5" opacity=".75"/>
          <rect x="1" y="2" width={w*16-2} height="12" fill="none" stroke="#fff" strokeWidth=".4" strokeDasharray="2 2" opacity=".6"/>
          <text x={w*8} y="9.5" fontSize="3" fill="#0B3A4A" textAnchor="middle" fontFamily="monospace">TACKY MAT</text>
        </svg>
      </div>
    );
  }

  // ─── MedWallShelf — 흰색 약품 책장 (병·박스 빼곡, 벽면) ─────────────
  function MedWallShelf({ x, y, w = 4, shelves = 5 }) {
    const W = w * T, H = T * 1.5;
    const pillCols = ['#FFFDF5','#FDE9C8','#E6F0D8','#D8E8F0','#F6DCE0','#EDE4D2','#FFFFFF','#E0DCCE','#F2E6C8','#DCE8E2'];
    const capCols  = ['#DC2626','#2563EB','#16A34A','#F59E0B','#7C3AED','#0EA5A0','#475569','#DB2777'];
    const rows = [];
    for (let s = 0; s < shelves; s++) {
      const shelfTop = 2 + s * ((24 - 2) / shelves);
      const slotH = (24 - 2) / shelves;
      const items = [];
      let cx = 1.2;
      let i = 0;
      while (cx < w * 16 - 2.4) {
        const bw = 2.2 + (i * 7 % 3) * 0.7;          // 2.2–3.6 wide bottles
        const bh = slotH - 1.6 - (i % 2) * 1.2;       // varied heights
        const isBox = i % 4 === 3;
        const by = shelfTop + (slotH - 1.4) - bh;
        const fill = pillCols[(i + s * 3) % pillCols.length];
        items.push(
          <g key={s + '-' + i}>
            <rect x={cx} y={by} width={bw} height={bh} fill={fill} stroke={C} strokeWidth=".3"/>
            {isBox ? (
              <rect x={cx + 0.4} y={by + 0.6} width={bw - 0.8} height="1" fill={capCols[(i + s) % capCols.length]} opacity=".75"/>
            ) : (
              <>
                <rect x={cx + 0.4} y={by} width={bw - 0.8} height="1.1" fill={capCols[(i + s) % capCols.length]}/>
                <rect x={cx + 0.5} y={by + 1.6} width={bw - 1} height="1.2" fill="#fff" opacity=".8"/>
              </>
            )}
          </g>
        );
        cx += bw + 0.5;
        i++;
      }
      rows.push(
        <g key={'shelf' + s}>
          {items}
          {/* shelf plank */}
          <rect x="0.5" y={shelfTop + slotH - 1.4} width={w * 16 - 1} height="1.4" fill="#E8E5DB" stroke={C} strokeWidth=".4"/>
          <rect x="0.5" y={shelfTop + slotH - 1.4} width={w * 16 - 1} height="0.5" fill="#FAF8F2"/>
        </g>
      );
    }
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 4, width: W, height: H, filter: 'drop-shadow(2px 3px 0 rgba(0,0,0,.22))' }}>
        <svg viewBox={`0 0 ${w * 16} 26`} width={W} height={H} shapeRendering="crispEdges" preserveAspectRatio="none">
          {/* white cabinet carcass */}
          <rect x="0" y="0" width={w * 16} height="26" fill="#EFEDE4" stroke={C} strokeWidth=".7"/>
          <rect x="0" y="0" width={w * 16} height="2" fill="#FAF8F2"/>
          {/* side uprights */}
          <rect x="0" y="0" width="1" height="26" fill="#D7D3C6"/>
          <rect x={w * 16 - 1} y="0" width="1" height="26" fill="#D7D3C6"/>
          {rows}
        </svg>
      </div>
    );
  }

  Object.assign(window, {
    PneumaticTube, TubeCapsuleRack, ReturnBox, BarcodeScanner, ATCMachine,
    LASAShelf, NarcoticsVault, BSC, MagnehelicGauge, ChemoSpillKit, TackyMat,
    MedWallShelf,
  });
})();
