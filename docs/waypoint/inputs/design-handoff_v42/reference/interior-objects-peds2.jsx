// interior-objects-peds2.jsx — Pediatrics & Neonatal Center blueprint objects.
// Playful but clinically precise. v2 pixel style (visible TOP + FRONT + depth).
// Tile-based coords. Loads before the Peds screen render.

(function () {
  const C = '#2A2522';
  const T = window.ITILE || 16;

  // ─── Incubator / Isolette — 신생아 인큐베이터 (온도·습도 표시) ───────
  function Incubator({ x, y, occupied = true }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 8, width: T * 2.2, height: T * 2.5 }}>
        <svg viewBox="0 0 36 42" width={T * 2.2} height={T * 2.5} shapeRendering="geometricPrecision">
          <ellipse cx="18.0" cy="38.9" rx="12.2" ry="4.1" fill="rgba(0,0,0,.16)"/>
          {/* ===== base cabinet drawn FIRST (behind), then the hood in front ===== */}
          {/* front band (thickness) */}
          <path d="M3 29 L33 29 L33 32.5 Q33 33.1 32.4 33.1 L3.6 33.1 Q3 33.1 3 32.5 Z" fill="#5F94A4"/>
          {/* large flat top deck of the base */}
          <path d="M3 19 L33 19 Q34 19 34 20 L34 28 Q34 29 33 29 L3 29 Q2 29 2 28 L2 20 Q2 19 3 19 Z" fill="#7FB8C8"/>
          <rect x="4" y="20.2" width="28" height="1.4" fill="#9CC8D4"/>{/* top back-edge highlight */}
          <line x1="3" y1="29" x2="33" y2="29" stroke={C} strokeWidth=".5"/>
          {/* control cluster on the viewer-facing FRONT band */}
          <rect x="4.5" y="29.4" width="12" height="3.2" rx=".5" fill="#0F1A24" stroke={C} strokeWidth=".4"/>
          <text x="7.6" y="31.8" fontSize="2.3" fill="#FBBF24" textAnchor="middle" fontFamily="monospace">36.5°</text>
          <text x="13" y="31.8" fontSize="2.1" fill="#22D3EE" textAnchor="middle" fontFamily="monospace">60%</text>
          <circle cx="21" cy="31" r="1.4" fill="#CBD5E1" stroke={C} strokeWidth=".35"/>
          <circle cx="24.6" cy="31" r="1.4" fill="#CBD5E1" stroke={C} strokeWidth=".35"/>
          <rect x="27.5" y="29.6" width="4" height="2.8" rx=".4" fill="#475569"/>
          {/* base silhouette outline (top + front, continuous) */}
          <path d="M3 19 L33 19 Q34 19 34 20 L34 32.5 Q34 33.1 33.4 33.1 L3.6 33.1 Q3 33.1 3 32.5 L2.9 20 Q2.9 19 3 19 Z" fill="none" stroke={C} strokeWidth=".6"/>
          {/* column + wheeled base */}
          <rect x="16.5" y="33.1" width="3" height="3.4" fill="#C6CBD1" stroke={C} strokeWidth=".4"/>
          <ellipse cx="18" cy="38" rx="12" ry="2.6" fill="#D7DBDF" stroke={C} strokeWidth=".5"/>
          <ellipse cx="8" cy="40" rx="2.2" ry="1.6" fill={C}/>
          <ellipse cx="28" cy="40" rx="2.2" ry="1.6" fill={C}/>

          {/* ===== clear acrylic hood IN FRONT, slightly transparent so the base deck shows through ===== */}
          <g opacity=".9">
            <rect x="3" y="12" width="30" height="16" rx="4" fill="#DDEFF5" fillOpacity=".82" stroke={C} strokeWidth=".6"/>
            <rect x="5.5" y="14" width="25" height="12" rx="3" fill="#C4E2EC" fillOpacity=".8"/>{/* inner mattress well */}
            <path d="M6 14.5 L15 14.5 L9 25.5 L6 25.5 Z" fill="#FFFFFF" opacity=".28"/>{/* glare */}
            <circle cx="11" cy="26" r="2.4" fill="#AFD3DE" stroke={C} strokeWidth=".5"/>
            <circle cx="25" cy="26" r="2.4" fill="#AFD3DE" stroke={C} strokeWidth=".5"/>
            {occupied && (
              <g>
                <ellipse cx="18" cy="20" rx="7" ry="3.4" fill="#FBE3EE"/>{/* blanket */}
                <circle cx="12.5" cy="20" r="2" fill="#FBD9C0" stroke={C} strokeWidth=".3"/>{/* head */}
                <path d="M11 18.8 Q12.5 17.8 14 18.8" fill="none" stroke="#7C5230" strokeWidth=".7"/>{/* hair */}
              </g>
            )}
          </g>
        </svg>
      </div>
    );
  }

  // ─── PhototherapyLamp — 황달 광선치료기 (청색광) ───────────────────
  function PhototherapyLamp({ x, y, w = 2 }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 8, width: T * w, height: T * 1.9, zIndex: 1 }}>
        <svg viewBox={`0 0 ${w*16} 30`} width={T * w} height={T * 1.9} shapeRendering="geometricPrecision" preserveAspectRatio="none">
          {/* blue light beam cast down onto the incubator */}
          <path d={`M ${w*4} 20 L ${w*12} 20 L ${w*14} 29 L ${w*2} 29 Z`} fill="#60A5FA" opacity=".28"/>
          {/* arm from ceiling */}
          <rect x={w*8-1.5} y="0" width="3" height="3.5" fill="#9CA3AF" stroke={C} strokeWidth=".4"/>
          {/* LIT UNDERSIDE (tilted toward us) with blue LED array */}
          <path d={`M2 8 L ${w*16-2} 8 L ${w*16-2} 13 L2 13 Z`} fill="#2C4A6E"/>
          <ellipse cx={w*8} cy="13" rx={w*8-2} ry="3.4" fill="#1E3A5F" stroke={C} strokeWidth=".5"/>
          {[...Array(Math.max(4,w*3))].map((_,i) => (
            <ellipse key={i} cx={4 + i*((w*16-8)/(w*3-1))} cy="12.5" rx="1.6" ry="1.1" fill="#7DD3FC"/>
          ))}
          {/* TOP housing (clean, dominant) */}
          <ellipse cx={w*8} cy="7" rx={w*8-2} ry="5" fill="#5B6672" stroke={C} strokeWidth=".7"/>
          <ellipse cx={w*8} cy="5.6" rx={w*8-6} ry="3" fill="#727E8C" opacity=".8"/>
          <text x={w*8} y="7.2" fontSize="3" fill="#BFD8F0" textAnchor="middle" fontFamily="monospace">UVB</text>
        </svg>
      </div>
    );
  }

  // ─── MetalCrib — 철제 창살 안전 크립 베드 (핵심) ──────────────────
  function MetalCrib({ x, y, occupied, stuffie }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T, width: T * 2, height: T * 3 }}>
        <svg viewBox="0 0 32 48" width={T * 2} height={T * 3} shapeRendering="crispEdges">
          <ellipse cx="16.0" cy="45.3" rx="10.9" ry="3.7" fill="rgba(0,0,0,.16)"/>
          {/* far (rear) rail seen edge-on at the top */}
          <rect x="2" y="3" width="28" height="2.2" fill="#B7C0C8" stroke={C} strokeWidth=".5"/>
          {[4,7,10,13,16,19,22,25,28].map(sx => <rect key={'b'+sx} x={sx} y="5" width="1.1" height="3" fill="#9CA3AF"/>)}
          {/* TOP face — mattress + blanket seen from above (dominant) */}
          <rect x="4" y="8" width="24" height="30" fill="#FDE4EE" stroke={C} strokeWidth=".5"/>
          <rect x="4.5" y="8.5" width="23" height="1.2" fill="#fff"/>
          <rect x="4" y="24" width="24" height="14" fill="#A7F3D0"/>
          <rect x="4" y="24" width="24" height="1" fill="#fff"/>
          {/* baby lying in the crib */}
          {occupied && (
            <g>
              <rect x="13" y="13" width="6" height="4.5" rx="1" fill="#FBD9C0"/>
              <rect x="13.3" y="12.4" width="5.4" height="1.2" fill="#6B4423"/>
              <rect x="11" y="26" width="10" height="4" rx="1.5" fill="#7DCEA0" opacity=".5"/>
            </g>
          )}
          {/* near (front/foot) rail — short thickness band at the bottom edge */}
          <rect x="2" y="38" width="28" height="3" fill="#CBD5E1" stroke={C} strokeWidth=".5"/>
          {[4,7,10,13,16,19,22,25,28].map(sx => <rect key={'f'+sx} x={sx} y="38.4" width="1.1" height="2.2" fill="#9CA3AF"/>)}
          {/* side rails (thin, along left/right edges of the top face) */}
          <rect x="2" y="5" width="2.4" height="34" fill="#7E8893" stroke={C} strokeWidth=".5"/>
          <rect x="27.6" y="5" width="2.4" height="34" fill="#7E8893" stroke={C} strokeWidth=".5"/>
          {/* legs + wheels */}
          <rect x="3" y="41" width="3" height="4" fill="#6B7280"/>
          <rect x="26" y="41" width="3" height="4" fill="#6B7280"/>
          <ellipse cx="4.5" cy="45.5" rx="2" ry="1.3" fill={C}/>
          <ellipse cx="27.5" cy="45.5" rx="2" ry="1.3" fill={C}/>
        </svg>
        {stuffie && <div style={{ position: 'absolute', right: 3, bottom: T * 1.2, fontSize: 11 }}>{stuffie}</div>}
      </div>
    );
  }

  // ─── IVBoard — 캐릭터 모양 수액 익판 (손등 고정) ──────────────────
  function IVBoard({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T + 3, top: y * T + 3, width: T - 6, height: T - 6 }}>
        <svg viewBox="0 0 10 10" width={T - 6} height={T - 6} shapeRendering="crispEdges">
          <ellipse cx="5.0" cy="9.0" rx="3.4" ry="2" fill="rgba(0,0,0,.16)"/>
          {/* star/character splint board */}
          <path d="M5 0 L6.3 3 L9.5 3 L7 5.2 L8 8.5 L5 6.6 L2 8.5 L3 5.2 L0.5 3 L3.7 3 Z" fill="#FBBF24" stroke={C} strokeWidth=".4"/>
          {/* taped IV line */}
          <rect x="4.4" y="4" width="1.2" height="4" fill="#FBD9C0"/>
          <rect x="3.5" y="5" width="3" height="0.8" fill="#fff" opacity=".8"/>
          <rect x="5" y="3.5" width="0.5" height="3" fill="#A8DCEC"/>
        </svg>
      </div>
    );
  }

  // ─── BabyScale — 영유아 바구니형 체중계 ───────────────────────────
  function BabyScale({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 4, width: T * 1.5, height: T * 1.5 }}>
        <svg viewBox="0 0 24 24" width={T * 1.5} height={T * 1.5} shapeRendering="geometricPrecision">
          <ellipse cx="12.0" cy="22.2" rx="8.2" ry="2.8" fill="rgba(0,0,0,.16)"/>
          {/* base cabinet: top face + short front, continuous silhouette */}
          <path d="M3 13 L21 13 L21 19 Q21 19.6 20.4 19.6 L3.6 19.6 Q3 19.6 3 19 Z" fill="#B9C1C9"/>
          <path d="M4 11 L20 11 Q21 11 21 12 L21 13 L3 13 L3 12 Q3 11 4 11 Z" fill="#8E99A4"/>
          <line x1="3" y1="13" x2="21" y2="13" stroke={C} strokeWidth=".5"/>
          {/* viewer-facing display on the front band */}
          <rect x="7" y="14.4" width="10" height="4" rx=".5" fill="#0F1A24" stroke={C} strokeWidth=".4"/>
          <text x="12" y="17.6" fontSize="3" fill="#10B981" textAnchor="middle" fontFamily="monospace">4.2kg</text>
          {/* contoured weighing basin sitting on top (oval tray seen from above) */}
          <ellipse cx="12" cy="8" rx="11" ry="5" fill="#FDE4EE" stroke={C} strokeWidth=".55"/>
          <ellipse cx="12" cy="7.4" rx="9" ry="3.6" fill="#FBD0E0"/>
          <ellipse cx="12" cy="7" rx="6" ry="2.2" fill="#F7BBD2"/>{/* the scooped hollow the baby lies in */}
          <path d="M6 6.4 Q12 4.6 18 6.4" fill="none" stroke="#FFFFFF" strokeWidth=".7" opacity=".6"/>
        </svg>
      </div>
    );
  }

  // ─── StadiometerScale — 학령기 자동 신장/체중계 (캐릭터) ───────────
  function StadiometerScale({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 20, width: T * 1.4, height: T * 3 }}>
        <svg viewBox="0 0 22 46" width={T * 1.4} height={T * 3} shapeRendering="geometricPrecision">
          <ellipse cx="11.0" cy="44.4" rx="7.5" ry="2.6" fill="rgba(0,0,0,.16)"/>
          {/* ground platform: big TOP face + short front (child stands here) */}
          <path d="M2 40 L20 40 L20 44 Q20 44.6 19.4 44.6 L2.6 44.6 Q2 44.6 2 44 Z" fill="#9AA6B2"/>
          <path d="M2 34 L20 34 L20 40 L2 40 Z" fill="#C3CAD1" stroke={C} strokeWidth=".5"/>
          <ellipse cx="11" cy="37" rx="6.5" ry="2.4" fill="#AEB6BE"/>{/* footprint pad */}
          <line x1="2" y1="40" x2="20" y2="40" stroke={C} strokeWidth=".5"/>
          {/* measuring column rising from the back of the platform */}
          <rect x="8" y="6" width="6" height="29" rx="1" fill="#7FB8D6" stroke={C} strokeWidth=".5"/>
          <rect x="8.8" y="7" width="1.6" height="27" fill="#A5D2E6"/>{/* column highlight */}
          {/* tick marks up the column */}
          {[...Array(9)].map((_,i)=><rect key={i} x="11.6" y={9+i*3} width="2" height=".5" fill={C} opacity=".55"/>)}
          {/* sliding head-bar (viewer-facing) */}
          <rect x="5.5" y="13" width="11" height="2.4" rx=".5" fill="#EF4444" stroke={C} strokeWidth=".4"/>
          <rect x="14" y="13.3" width="3" height="1.8" fill="#B91C1C"/>
          {/* friendly animal-ear + face topper */}
          <circle cx="7.5" cy="3.5" r="2.4" fill="#FBBF24" stroke={C} strokeWidth=".4"/>
          <circle cx="14.5" cy="3.5" r="2.4" fill="#FBBF24" stroke={C} strokeWidth=".4"/>
          <rect x="6" y="4" width="10" height="4.5" rx="2" fill="#FCD34D" stroke={C} strokeWidth=".5"/>
          <circle cx="9" cy="6.2" r=".7" fill={C}/><circle cx="13" cy="6.2" r=".7" fill={C}/>
          <path d="M9.5 7.4 Q11 8.4 12.5 7.4" fill="none" stroke={C} strokeWidth=".4"/>
          {/* digital display mounted on the column front */}
          <rect x="6.5" y="27" width="9" height="4" rx=".5" fill="#0F1A24" stroke={C} strokeWidth=".4"/>
          <text x="11" y="30" fontSize="2.6" fill="#22D3EE" textAnchor="middle" fontFamily="monospace">112cm</text>
        </svg>
      </div>
    );
  }

  // ─── TongueDepressorJar — 설압자 통 ───────────────────────────────
  function TongueDepressorJar({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T + 4, top: y * T + 3, width: T - 8, height: T - 5 }}>
        <svg viewBox="0 0 8 10" width={T - 8} height={T - 5} shapeRendering="crispEdges">
          <ellipse cx="4.0" cy="9.0" rx="2.7" ry="2" fill="rgba(0,0,0,.16)"/>
          {/* sticks poking out */}
          {[0,1,2,3].map(i => <rect key={i} x={1.4+i*1.4} y="0" width="1" height="4" fill="#E0B070" stroke={C} strokeWidth=".2"/>)}
          {/* jar */}
          <rect x="1" y="3.5" width="6" height="6" fill="#D7EEF5" stroke={C} strokeWidth=".5"/>
          <rect x="1.5" y="4" width="1.4" height="5" fill="#EAF6FA"/>
        </svg>
      </div>
    );
  }

  // ─── StickerRoll — 캐릭터 보상 스티커 통 ──────────────────────────
  function StickerRoll({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T + 4, top: y * T + 4, width: T - 8, height: T - 6 }}>
        <svg viewBox="0 0 8 8" width={T - 8} height={T - 6} shapeRendering="crispEdges">
          <ellipse cx="4.0" cy="7.0" rx="2.7" ry="2" fill="rgba(0,0,0,.16)"/>
          <circle cx="4" cy="4" r="3.6" fill="#FBCFE8" stroke={C} strokeWidth=".5"/>
          <circle cx="4" cy="4" r="1.4" fill="#fff" stroke={C} strokeWidth=".3"/>
          {/* peeling sticker star */}
          <path d="M7 1 L7.6 2.4 L9 2.4 L7.9 3.4 L8.3 4.8 L7 4 L5.7 4.8 L6.1 3.4 L5 2.4 L6.4 2.4 Z" fill="#FACC15" stroke={C} strokeWidth=".3"/>
        </svg>
      </div>
    );
  }

  // ─── DosingChart — 체중 기반 소아 투약 계산표 (벽) ─────────────────
  function DosingChart({ x, y, w = 2 }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T, width: T * w, height: T * 1.2 }}>
        <svg viewBox={`0 0 ${w*16} 18`} width={T * w} height={T * 1.2} shapeRendering="crispEdges" preserveAspectRatio="none">
          <rect x="0" y="0" width={w*16} height="18" fill="#fff" stroke={C} strokeWidth=".6"/>
          <rect x="0" y="0" width={w*16} height="4" fill="#3B82F6"/>
          <rect x="2" y="1.2" width={w*9} height="1.6" fill="#fff"/>
          {/* dosing rows (kg → mL) */}
          {[0,1,2,3].map(r => (
            <g key={r}>
              <rect x="2" y={6 + r*2.8} width={w*5} height="1.2" fill={C} opacity=".55"/>
              <rect x={w*16-w*6} y={6 + r*2.8} width={w*4} height="1.2" fill="#10B981"/>
            </g>
          ))}
        </svg>
      </div>
    );
  }

  // ─── MilkFridge — 모유 보관 전용 냉장고 (네임 라벨 젖병) ────────────
  function MilkFridge({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T - 2, top: y * T - 5, width: T * 1.5, height: T * 2.3 }}>
        <svg viewBox="0 0 24 37" width={T * 1.5} height={T * 2.3} shapeRendering="geometricPrecision">
          <ellipse cx="12.0" cy="35.2" rx="8.2" ry="2.8" fill="rgba(0,0,0,.16)"/>
          {/* continuous silhouette (top face + front) */}
          <path d="M2 2 Q1 2 1 3 L1 34 Q1 35 2 35 L22 35 Q23 35 23 34 L23 3 Q23 2 22 2 Z" fill="#E9EBEC"/>
          {/* TOP face */}
          <path d="M2 2 Q1 2 1 3 L1 8 L23 8 L23 3 Q23 2 22 2 Z" fill="#CBD2D6"/>
          <line x1="1" y1="8" x2="23" y2="8" stroke={C} strokeWidth=".5"/>
          {/* glass door showing labeled milk bottles on shelves */}
          <rect x="2.5" y="10" width="19" height="22" rx=".8" fill="#D7EEF5" stroke={C} strokeWidth=".5"/>
          {[12,19,26].map((sy,r) => (
            <g key={r}>
              <rect x="3" y={sy+4} width="18" height=".9" fill="#AFD3DE"/>{/* shelf */}
              {[0,1,2,3].map(i => (
                <g key={i}>
                  <rect x={3.8+i*4.4} y={sy} width="3" height="4.2" rx=".6" fill="#FFFDF5" stroke={C} strokeWidth=".25"/>
                  <rect x={4.3+i*4.4} y={sy-1} width="2" height="1.4" fill="#E8E0D0"/>{/* teat/cap */}
                  <rect x={3.8+i*4.4} y={sy+2.6} width="3" height="1.2" fill="#FBE3C8"/>{/* name label */}
                </g>
              ))}
            </g>
          ))}
          {/* vertical handle */}
          <rect x="18.5" y="14" width="1.6" height="14" rx=".6" fill="#9AA6B2" stroke={C} strokeWidth=".3"/>
          {/* temp display on the top-front */}
          <rect x="3" y="3.4" width="6" height="3" rx=".4" fill="#0B2A3A"/>
          <text x="6" y="5.8" fontSize="2.4" fill="#22D3EE" textAnchor="middle" fontFamily="monospace">4°</text>
          {/* re-stroke silhouette */}
          <path d="M2 2 Q1 2 1 3 L1 34 Q1 35 2 35 L22 35 Q23 35 23 34 L23 3 Q23 2 22 2 Z" fill="none" stroke={C} strokeWidth=".7"/>
        </svg>
      </div>
    );
  }

  Object.assign(window, {
    Incubator, PhototherapyLamp, MetalCrib, IVBoard, BabyScale,
    StadiometerScale, TongueDepressorJar, StickerRoll, DosingChart, MilkFridge,
  });
})();
