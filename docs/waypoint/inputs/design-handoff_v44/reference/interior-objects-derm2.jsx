// interior-objects-derm2.jsx — Dermatology Clinic blueprint objects.
// Skin assessment + phototherapy + minor-surgery/laser. Bright white-tone clinic.
// v2 pixel style. Loads before the Derm screen render.

(function () {
  const C = '#2A2522';
  const T = window.ITILE || 16;

  // ─── Dermatoscope — 더마토스코프 (피부 확대 카메라, 스탠드) ──────────
  function Dermatoscope({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 16, width: T * 1.2, height: T * 2.6 }}>
        <svg viewBox="0 0 20 42" width={T * 1.2} height={T * 2.6} shapeRendering="crispEdges">
          <ellipse cx="10.0" cy="40.7" rx="6.8" ry="2.3" fill="rgba(0,0,0,.16)"/>
          {/* articulated arm */}
          <path d="M10 22 L4 14 L12 6" fill="none" stroke="#B7BEC6" strokeWidth="2"/>
          {/* handheld scope head (lens + ring light) */}
          <g transform="rotate(-30 12 6)">
            <rect x="8" y="2" width="9" height="5" rx="2.5" fill="#475569" stroke={C} strokeWidth=".5"/>
            <circle cx="9.5" cy="4.5" r="2.4" fill="#0F1A24" stroke={C} strokeWidth=".4"/>
            <circle cx="9.5" cy="4.5" r="1.4" fill="#7DD3FC"/>
            <circle cx="9.5" cy="4.5" r="2.9" fill="none" stroke="#FACC15" strokeWidth=".3"/>
          </g>
          {/* small display on the arm joint */}
          <rect x="2" y="14" width="6" height="5" fill="#1F2937" stroke={C} strokeWidth=".4"/>
          <rect x="2.8" y="15" width="4.4" height="3" fill="#5A3A2A"/>{/* skin lesion image */}
          <circle cx="5" cy="16.5" r="1" fill="#3A2018"/>
          {/* pole + base */}
          <rect x="9" y="22" width="2" height="16" fill="#CBD5E1" stroke={C} strokeWidth=".3"/>
          <ellipse cx="10" cy="40" rx="6" ry="2" fill="#6B7280" stroke={C} strokeWidth=".4"/>
        </svg>
      </div>
    );
  }

  // ─── WoodsLamp — 우드등 (자외선 진단 등, 손잡이형) ─────────────────
  function WoodsLamp({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T + 2, top: y * T, width: T - 4, height: T * 1.6 }}>
        <svg viewBox="0 0 12 26" width={T - 4} height={T * 1.6} shapeRendering="crispEdges">
          <ellipse cx="6.0" cy="25.0" rx="4.1" ry="2" fill="rgba(0,0,0,.16)"/>
          {/* lamp head with twin UV tubes */}
          <rect x="1" y="1" width="10" height="7" rx="1.5" fill="#374151" stroke={C} strokeWidth=".5"/>
          <rect x="2.5" y="2.5" width="2" height="4" fill="#A78BFA"/>
          <rect x="5.5" y="2.5" width="2" height="4" fill="#A78BFA"/>
          {/* violet glow */}
          <ellipse cx="6" cy="9.5" rx="5" ry="2.5" fill="#8B5CF6" opacity=".4"/>
          {/* handle */}
          <rect x="5" y="8" width="2" height="10" fill="#475569" stroke={C} strokeWidth=".4"/>
          <rect x="3.5" y="18" width="5" height="6" rx="1.5" fill="#5B6776" stroke={C} strokeWidth=".4"/>
          <rect x="4.5" y="19.5" width="3" height="1.4" fill="#A78BFA"/>{/* power LED */}
        </svg>
      </div>
    );
  }

  // ─── UVBooth — 전신 광선치료 부스 (수직 캡슐, 311nm 청색광) ──────────
  function UVBooth({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 16, width: T * 2.4, height: T * 3.6 }}>
        <svg viewBox="0 0 38 66" width={T * 2.4} height={T * 4.1} shapeRendering="geometricPrecision">
          <ellipse cx="19.0" cy="62.6" rx="12.9" ry="4.4" fill="rgba(0,0,0,.16)"/>
          {/* TOP cap of the cabinet (large, rectangular — high top-down viewpoint) folding into a continuous front */}
          <path d="M1 22 L1 60 Q1 62 3 62 L35 62 Q37 62 37 60 L37 22 Z" fill="#D6DCE2" stroke={C} strokeWidth=".8"/>
          <rect x="1" y="3" width="36" height="19" rx="3" fill="#E4E9EE" stroke={C} strokeWidth=".8"/>{/* rectangular lid — big top face */}
          <rect x="4" y="5" width="30" height="2.6" rx="1" fill="#F1F4F7"/>{/* back-edge highlight */}
          <rect x="6" y="10" width="26" height="9" rx="1.5" fill="#C6CDD5" stroke={C} strokeWidth=".45"/>{/* recessed vent grille on the lid */}
          {[8.5,12,15.5,19,22.5,26,29.5].map((gx,i)=><line key={i} x1={gx} y1="11" x2={gx} y2="18" stroke="#9AA2AB" strokeWidth=".6"/>)}
          <line x1="1" y1="22" x2="37" y2="22" stroke={C} strokeWidth=".6"/>{/* top↔front seam */}
          {/* open doorway revealing the UV tube array (front) */}
          <rect x="6" y="25" width="26" height="28" rx="3" fill="#1B1838" stroke={C} strokeWidth=".6"/>
          {[9,12.5,16,19.5,23,26.5,30].map((tx,i) => (
            <rect key={i} x={tx} y="27" width="1.6" height="24" fill="#5B8DEF"/>
          ))}
          <rect x="7" y="26" width="24" height="26" rx="3" fill="#3B82F6" opacity=".28"/>
          {/* interior grab handle */}
          <rect x="32" y="34" width="2" height="9" fill="#9CA3AF"/>
          {/* control console on the front base */}
          <rect x="4" y="55" width="30" height="5" rx="1" fill="#94A3B8" stroke={C} strokeWidth=".5"/>
          <rect x="6" y="56" width="9" height="3" fill="#0F1A24"/>
          <rect x="6.6" y="56.7" width="6" height="1.4" fill="#22D3EE"/>
          <circle cx="30" cy="57.5" r="1.6" fill="#10B981" stroke={C} strokeWidth=".35"/>
        </svg>
      </div>
    );
  }

  // ─── HandUVBox — 국소 부위 자외선 치료기 (손/발 박스) ───────────────
  function HandUVBox({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 2, width: T * 1.4, height: T * 1.3 }}>
        <svg viewBox="0 0 22 20" width={T * 1.4} height={T * 1.3} shapeRendering="geometricPrecision">
          <ellipse cx="11.0" cy="18.4" rx="7.5" ry="2.6" fill="rgba(0,0,0,.16)"/>
          {/* full silhouette */}
          <path d="M2 2 Q1 2 1 3 L1 16 Q1 17 2 17 L20 17 Q21 17 21 16 L21 3 Q21 2 20 2 Z" fill="#C1C7CE"/>
          {/* TOP face — hand-slot opening with blue UV glow seen from above */}
          <path d="M2 2 Q1 2 1 3 L1 12 L21 12 L21 3 Q21 2 20 2 Z" fill="#D6DCE2"/>
          <rect x="3" y="3.6" width="16" height="6.6" rx=".6" fill="#1B1838" stroke={C} strokeWidth=".4"/>
          {[4.6,7.4,10.2,13,15.8].map((tx,i) => <rect key={i} x={tx} y="4.4" width="1.2" height="5" fill="#5B8DEF"/>)}
          <rect x="3" y="3.6" width="16" height="6.6" rx=".6" fill="#3B82F6" opacity=".22"/>
          {/* seam top → front */}
          <line x1="1" y1="12" x2="21" y2="12" stroke={C} strokeWidth=".55"/>
          {/* FRONT band — timer dial + power */}
          <circle cx="6" cy="14.6" r="1.8" fill="#0F1A24" stroke={C} strokeWidth=".3"/>
          <line x1="6" y1="14.6" x2="7.1" y2="13.6" stroke="#22D3EE" strokeWidth=".45"/>
          <rect x="11" y="13.4" width="7" height="2.4" rx=".4" fill="#334155"/>
          <rect x="11.6" y="14" width="2" height="1.2" fill="#10B981"/>
          {/* outer outline */}
          <path d="M2 2 Q1 2 1 3 L1 16 Q1 17 2 17 L20 17 Q21 17 21 16 L21 3 Q21 2 20 2 Z" fill="none" stroke={C} strokeWidth=".65"/>
        </svg>
      </div>
    );
  }

  // ─── GoggleSanitizer — 보호 고글 보관함 (자외선 소독기) ──────────────
  function GoggleSanitizer({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T + 1, top: y * T, width: T - 2, height: T * 1.5 }}>
        <svg viewBox="0 0 14 24" width={T - 2} height={T * 1.5} shapeRendering="crispEdges">
          <ellipse cx="7.0" cy="23.0" rx="4.8" ry="2" fill="rgba(0,0,0,.16)"/>
          {/* cabinet */}
          <rect x="0" y="0" width="14" height="24" fill="#475569" stroke={C} strokeWidth=".5"/>
          {/* glass door */}
          <rect x="1.5" y="1.5" width="11" height="21" fill="#2A3550" stroke={C} strokeWidth=".4" opacity=".85"/>
          {/* shelves with dark goggles */}
          {[4,11,18].map((sy,r) => (
            <g key={r}>
              <rect x="2" y={sy} width="10" height="1" fill="#1B2438"/>
              <path d={`M3 ${sy-2.5} Q5 ${sy-3.5} 7 ${sy-2.5} Q9 ${sy-3.5} 11 ${sy-2.5} L11 ${sy-1} L3 ${sy-1} Z`} fill="#0B1020" stroke={C} strokeWidth=".3"/>
            </g>
          ))}
          {/* UV sanitize glow */}
          <rect x="1.5" y="1.5" width="11" height="2" fill="#A78BFA" opacity=".5"/>
        </svg>
      </div>
    );
  }

  // ─── BiopsyKit — 피부 조직검사 세트 (메이요 스탠드 위 펀치/포셉/봉합) ─
  function BiopsyKit({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 6, width: T * 1.8, height: T * 1.4 }}>
        <svg viewBox="0 0 28 22" width={T * 1.8} height={T * 1.4} shapeRendering="crispEdges">
          <ellipse cx="14.0" cy="19.8" rx="9.5" ry="3.2" fill="rgba(0,0,0,.16)"/>
          {/* sterile tray */}
          <ellipse cx="14" cy="5" rx="13" ry="3" fill="#A5D8E8" stroke={C} strokeWidth=".5"/>
          <ellipse cx="14" cy="4.5" rx="11.5" ry="2" fill="#C8E5F0"/>
          {/* punch tool (round blade) */}
          <rect x="4" y="2.6" width="6" height="1.2" fill="#9CA3AF" stroke={C} strokeWidth=".25"/>
          <circle cx="3.5" cy="3.2" r="1" fill="#475569"/>
          {/* forceps */}
          <path d="M12 2 L16 4.5 M12 3 L16 4.5" stroke="#9CA3AF" strokeWidth=".7"/>
          {/* small scissors */}
          <path d="M18 2.2 L22 4.4 M18 3.4 L22 4.4" stroke="#CBD5E1" strokeWidth=".7"/>
          <circle cx="18" cy="2.2" r=".7" fill="#374151"/>
          <circle cx="18" cy="3.4" r=".7" fill="#374151"/>
          {/* suture pack */}
          <rect x="22" y="2.6" width="3.5" height="2" fill="#fff" stroke={C} strokeWidth=".3"/>
          {/* mayo stand pole + base */}
          <rect x="13" y="13" width="2" height="7" fill="#9CA3AF" stroke={C} strokeWidth=".3"/>
          <ellipse cx="14" cy="20" rx="6" ry="1.5" fill="#4B5563" stroke={C} strokeWidth=".3"/>
        </svg>
      </div>
    );
  }

  // ─── BiopsyBottle — 포르말린 조직병리 병 (네임 라벨) ─────────────────
  function BiopsyBottle({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T + 4, top: y * T + 3, width: T - 8, height: T - 5 }}>
        <svg viewBox="0 0 8 10" width={T - 8} height={T - 5} shapeRendering="crispEdges">
          <ellipse cx="4.0" cy="9.0" rx="2.7" ry="2" fill="rgba(0,0,0,.16)"/>
          {/* cap */}
          <rect x="2.5" y="0.4" width="3" height="1.6" fill="#DC2626" stroke={C} strokeWidth=".3"/>
          {/* clear bottle with formalin */}
          <rect x="1.5" y="2" width="5" height="7.5" rx="1" fill="#DDF0F5" stroke={C} strokeWidth=".4" opacity=".9"/>
          <rect x="1.5" y="5" width="5" height="4.5" fill="#BCDCE6" opacity=".7"/>
          {/* tiny tissue speck */}
          <circle cx="4" cy="7" r=".7" fill="#C97B6E"/>
          {/* name label */}
          <rect x="2" y="3" width="4" height="1.6" fill="#fff" stroke={C} strokeWidth=".2"/>
        </svg>
      </div>
    );
  }

  // ─── CryoTank — 액체 질소 냉동치료 탱크 + 스프레이 (김 분사) ─────────
  function CryoTank({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 4, width: T * 1.2, height: T * 1.9 }}>
        <svg viewBox="0 0 20 32" width={T * 1.2} height={T * 1.9} shapeRendering="geometricPrecision">
          <ellipse cx="10.0" cy="30.7" rx="6.8" ry="2.3" fill="rgba(0,0,0,.16)"/>
          {/* white vapor puff off the nozzle */}
          <ellipse cx="16" cy="4" rx="2.6" ry="1.6" fill="#fff" opacity=".75"/>
          <ellipse cx="17.5" cy="2.6" rx="1.4" ry="1" fill="#fff" opacity=".55"/>
          {/* trigger spray nozzle sitting on the lid */}
          <rect x="8.5" y="3" width="3" height="3.5" rx=".6" fill="#475569" stroke={C} strokeWidth=".4"/>
          <rect x="11" y="3.6" width="4" height="1.6" fill="#94A3B8"/>
          {/* dewar: TOP disc lid (dominant) + continuous cylinder side + rounded bottom */}
          <path d="M3 8 L3 25 Q3 29 10 29 Q17 29 17 25 L17 8 Z" fill="#CBD5E1" stroke={C} strokeWidth=".6"/>
          <ellipse cx="10" cy="8" rx="7" ry="3" fill="#DCE2E8" stroke={C} strokeWidth=".6"/>{/* lid top */}
          <ellipse cx="10" cy="7.6" rx="4.6" ry="1.8" fill="#EEF2F6"/>
          <rect x="4.6" y="10" width="2.4" height="14" fill="#E5EAF0" opacity=".7"/>{/* side highlight */}
          {/* label band on the cylinder front */}
          <rect x="4.5" y="15" width="11" height="3" fill="#fff" stroke={C} strokeWidth=".3"/>
          <text x="10" y="17.4" fontSize="2.4" fill={C} textAnchor="middle" fontFamily="monospace">LN₂</text>
        </svg>
      </div>
    );
  }

  // ─── CO2Laser — 의료용 CO2 레이저 장비 (조준선 Red Dot) ─────────────
  function CO2Laser({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 14, width: T * 1.5, height: T * 2.8 }}>
        <svg viewBox="0 0 24 46" width={T * 1.5} height={T * 2.8} shapeRendering="crispEdges">
          <ellipse cx="12.0" cy="44.2" rx="8.2" ry="2.8" fill="rgba(0,0,0,.16)"/>
          {/* articulated arm + handpiece */}
          <path d="M12 14 L20 9 L22 13" fill="none" stroke="#B7BEC6" strokeWidth="2"/>
          <rect x="20" y="12" width="3" height="5" rx="1" fill="#475569" stroke={C} strokeWidth=".4"/>
          {/* red aiming dot beam */}
          <line x1="21.5" y1="17" x2="21.5" y2="22" stroke="#EF4444" strokeWidth=".6"/>
          <circle cx="21.5" cy="22.5" r="1" fill="#EF4444"/>
          {/* console body */}
          <path d="M2 14 L16 14 L17 16 L1 16 Z" fill="#475569" stroke={C} strokeWidth=".4"/>
          <rect x="1" y="16" width="16" height="14" fill="#5B6776" stroke={C} strokeWidth=".5"/>
          <rect x="2.5" y="17.5" width="9" height="6" fill="#0F1A24"/>
          <rect x="3" y="18.5" width="6" height="1.2" fill="#22D3EE"/>
          <rect x="3" y="20.5" width="7" height="1.2" fill="#F87171"/>
          <circle cx="14" cy="20.5" r="2" fill="#FBBF24" stroke={C} strokeWidth=".4"/>{/* emergency stop */}
          {/* cabinet + wheels */}
          <rect x="1" y="30" width="16" height="10" fill="#9CA3AF" stroke={C} strokeWidth=".5"/>
          <rect x="2.5" y="31.5" width="13" height="3" fill="#fff" stroke={C} strokeWidth=".3"/>
          <ellipse cx="4" cy="43" rx="2.2" ry="1.6" fill={C}/>
          <ellipse cx="14" cy="43" rx="2.2" ry="1.6" fill={C}/>
        </svg>
      </div>
    );
  }

  // ─── LesionChart — 피부 병변 분류 차트 (벽, 시각자료) ────────────────
  function LesionChart({ x, y, w = 2 }) {
    const cells = ['#E8A0A0','#D98080','#F0C0B0','#E0B0D0','#C8A0C0','#F0D0A0'];
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T, width: T * w, height: T * 1.4 }}>
        <svg viewBox={`0 0 ${w*16} 22`} width={T * w} height={T * 1.4} shapeRendering="crispEdges" preserveAspectRatio="none">
          <rect x="0" y="0" width={w*16} height="22" fill="#fff" stroke={C} strokeWidth=".6"/>
          <rect x="0" y="0" width={w*16} height="3.5" fill="#0EA5A0"/>
          <rect x="2" y="1" width={w*9} height="1.6" fill="#fff"/>
          {/* grid of lesion swatches */}
          {cells.map((col,i) => {
            const cx = 3 + (i % 3) * (w*16-6)/3;
            const cy = 6 + Math.floor(i/3) * 7;
            return (
              <g key={i}>
                <rect x={cx} y={cy} width={(w*16-8)/3} height="5.5" fill="#FCEFE8" stroke={C} strokeWidth=".3"/>
                <circle cx={cx + 3} cy={cy + 2.6} r="1.8" fill={col}/>
              </g>
            );
          })}
        </svg>
      </div>
    );
  }

  Object.assign(window, {
    Dermatoscope, WoodsLamp, UVBooth, HandUVBox, GoggleSanitizer,
    BiopsyKit, BiopsyBottle, CryoTank, CO2Laser, LesionChart,
  });
})();
