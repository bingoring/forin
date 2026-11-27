// interior-objects-peds2.jsx — Pediatrics & Neonatal Center blueprint objects.
// Playful but clinically precise. v2 pixel style (visible TOP + FRONT + depth).
// Tile-based coords. Loads before the Peds screen render.

(function () {
  const C = '#2A2522';
  const T = window.ITILE || 16;

  // ─── Incubator / Isolette — 신생아 인큐베이터 (온도·습도 표시) ───────
  function Incubator({ x, y, occupied = true }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 6, width: T * 2.2, height: T * 2.4, filter: 'drop-shadow(3px 4px 0 rgba(0,0,0,.26))' }}>
        <svg viewBox="0 0 36 40" width={T * 2.2} height={T * 2.4} shapeRendering="crispEdges">
          {/* clear acrylic hood */}
          <rect x="3" y="2" width="30" height="15" rx="3" fill="#D7EEF5" stroke={C} strokeWidth=".6" opacity=".92"/>
          <rect x="5" y="3.5" width="9" height="2" fill="#FFFFFF" opacity=".7"/>{/* glare */}
          {/* access portholes (round hand-holes) */}
          <circle cx="11" cy="11" r="3" fill="#BFE0EA" stroke={C} strokeWidth=".5"/>
          <circle cx="25" cy="11" r="3" fill="#BFE0EA" stroke={C} strokeWidth=".5"/>
          {/* tiny newborn inside */}
          {occupied && (
            <g>
              <rect x="15" y="8.5" width="6" height="4" rx="1.5" fill="#FBD9C0"/>
              <rect x="14.5" y="8" width="4" height="1.4" fill="#7C5230"/>
              <rect x="14" y="12" width="9" height="3" rx="1.5" fill="#FBE3EE"/>
            </g>
          )}
          {/* base cabinet */}
          <rect x="2" y="17" width="32" height="12" fill="#7FB8C8" stroke={C} strokeWidth=".6"/>
          <rect x="3" y="18" width="30" height="1.5" fill="#A7D2DE"/>
          {/* digital temp/humidity readout */}
          <rect x="4" y="20" width="11" height="6" fill="#0F1A24" stroke={C} strokeWidth=".4"/>
          <text x="9.5" y="23" fontSize="2.6" fill="#FBBF24" textAnchor="middle" fontFamily="monospace">36.5</text>
          <text x="9.5" y="25.5" fontSize="2.2" fill="#22D3EE" textAnchor="middle" fontFamily="monospace">60%</text>
          {/* control knobs */}
          <circle cx="20" cy="22" r="1.6" fill="#CBD5E1" stroke={C} strokeWidth=".3"/>
          <circle cx="25" cy="22" r="1.6" fill="#CBD5E1" stroke={C} strokeWidth=".3"/>
          <rect x="28" y="20" width="4" height="6" fill="#475569"/>
          {/* wheeled base */}
          <rect x="3" y="29" width="30" height="3" fill="#6B7280" stroke={C} strokeWidth=".5"/>
          <ellipse cx="7" cy="35" rx="2.4" ry="1.7" fill={C}/>
          <ellipse cx="29" cy="35" rx="2.4" ry="1.7" fill={C}/>
        </svg>
      </div>
    );
  }

  // ─── PhototherapyLamp — 황달 광선치료기 (청색광) ───────────────────
  function PhototherapyLamp({ x, y, w = 2 }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 8, width: T * w, height: T * 1.3, zIndex: 1, filter: 'drop-shadow(2px 3px 0 rgba(0,0,0,.24))' }}>
        <svg viewBox={`0 0 ${w*16} 20`} width={T * w} height={T * 1.3} shapeRendering="crispEdges" preserveAspectRatio="none">
          {/* arm */}
          <rect x={w*8-1} y="0" width="2" height="4" fill="#9CA3AF" stroke={C} strokeWidth=".3"/>
          {/* lamp housing */}
          <rect x="2" y="4" width={w*16-4} height="6" fill="#475569" stroke={C} strokeWidth=".5"/>
          {/* blue LED underside */}
          <rect x="3" y="9" width={w*16-6} height="3" fill="#3B82F6"/>
          {[...Array(Math.max(3,w*2))].map((_,i) => (
            <rect key={i} x={4 + i*((w*16-8)/(w*2))} y="9.4" width="2" height="2.2" fill="#7DD3FC"/>
          ))}
          {/* blue glow cast down */}
          <rect x="1" y="12" width={w*16-2} height="7" fill="#60A5FA" opacity=".3"/>
        </svg>
      </div>
    );
  }

  // ─── MetalCrib — 철제 창살 안전 크립 베드 (핵심) ──────────────────
  function MetalCrib({ x, y, occupied, stuffie }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T, width: T * 2, height: T * 3, filter: 'drop-shadow(3px 4px 0 rgba(0,0,0,.24))' }}>
        <svg viewBox="0 0 32 48" width={T * 2} height={T * 3} shapeRendering="crispEdges">
          {/* rear high rail */}
          <rect x="2" y="2" width="28" height="2" fill="#B7C0C8" stroke={C} strokeWidth=".5"/>
          {[5,9,13,17,21,25,29].map(sx => <rect key={'b'+sx} x={sx} y="4" width="1.2" height="8" fill="#9CA3AF"/>)}
          {/* mattress + sheet */}
          <rect x="3" y="12" width="26" height="22" fill="#FDE4EE"/>
          <rect x="3" y="12" width="26" height="1" fill="#fff"/>
          {/* blanket */}
          <rect x="3" y="22" width="26" height="12" fill="#A7F3D0"/>
          <rect x="3" y="22" width="26" height="0.8" fill="#fff"/>
          {/* baby */}
          {occupied && (
            <g>
              <rect x="13" y="15" width="6" height="4" fill="#FBD9C0"/>
              <rect x="13.5" y="14.5" width="5" height="1" fill="#6B4423"/>
              <rect x="11" y="23" width="10" height="3" fill="#7DCEA0" opacity=".5"/>
            </g>
          )}
          {/* mattress front edge */}
          <rect x="3" y="34" width="26" height="2" fill="#F0C8D9"/>
          {/* FRONT high safety rail (tall vertical bars over the view) */}
          <rect x="2" y="6" width="28" height="2" fill="#CBD5E1" stroke={C} strokeWidth=".5"/>
          <rect x="2" y="36" width="28" height="2" fill="#B7C0C8" stroke={C} strokeWidth=".5"/>
          {[4,7,10,13,16,19,22,25,28].map(sx => <rect key={'f'+sx} x={sx} y="8" width="1.3" height="28" fill="#9CA3AF" opacity=".92"/>)}
          {/* corner posts */}
          <rect x="2" y="2" width="2.5" height="40" fill="#7E8893" stroke={C} strokeWidth=".5"/>
          <rect x="27.5" y="2" width="2.5" height="40" fill="#7E8893" stroke={C} strokeWidth=".5"/>
          {/* legs + wheels */}
          <rect x="3" y="42" width="3" height="4" fill="#6B7280"/>
          <rect x="26" y="42" width="3" height="4" fill="#6B7280"/>
          <ellipse cx="4.5" cy="46.5" rx="2" ry="1.3" fill={C}/>
          <ellipse cx="27.5" cy="46.5" rx="2" ry="1.3" fill={C}/>
        </svg>
        {stuffie && <div style={{ position: 'absolute', right: 3, bottom: T * 1.2, fontSize: 11, filter: 'drop-shadow(1px 1px 0 rgba(0,0,0,.3))' }}>{stuffie}</div>}
      </div>
    );
  }

  // ─── IVBoard — 캐릭터 모양 수액 익판 (손등 고정) ──────────────────
  function IVBoard({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T + 3, top: y * T + 3, width: T - 6, height: T - 6, filter: 'drop-shadow(1px 1.5px 0 rgba(0,0,0,.22))' }}>
        <svg viewBox="0 0 10 10" width={T - 6} height={T - 6} shapeRendering="crispEdges">
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
      <div style={{ position: 'absolute', left: x * T, top: y * T, width: T * 1.4, height: T * 1.2, filter: 'drop-shadow(2px 2px 0 rgba(0,0,0,.24))' }}>
        <svg viewBox="0 0 22 18" width={T * 1.4} height={T * 1.2} shapeRendering="crispEdges">
          {/* curved basket */}
          <path d="M2 6 Q11 1 20 6 L19 11 Q11 8 3 11 Z" fill="#FDE4EE" stroke={C} strokeWidth=".5"/>
          <path d="M3 6.5 Q11 2.5 19 6.5" fill="none" stroke="#F0C8D9" strokeWidth=".6"/>
          {/* base + display */}
          <rect x="6" y="11" width="10" height="4" fill="#94A3B8" stroke={C} strokeWidth=".5"/>
          <rect x="8" y="11.8" width="6" height="2.4" fill="#0F1A24"/>
          <text x="11" y="13.8" fontSize="2.2" fill="#10B981" textAnchor="middle" fontFamily="monospace">4.2</text>
          <rect x="9" y="15" width="4" height="2" fill="#6B7280"/>
        </svg>
      </div>
    );
  }

  // ─── StadiometerScale — 학령기 자동 신장/체중계 (캐릭터) ───────────
  function StadiometerScale({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 14, width: T, height: T * 2.6, filter: 'drop-shadow(2px 3px 0 rgba(0,0,0,.24))' }}>
        <svg viewBox="0 0 16 42" width={T} height={T * 2.6} shapeRendering="crispEdges">
          {/* friendly animal-ear topper */}
          <circle cx="5" cy="3" r="2" fill="#FBBF24" stroke={C} strokeWidth=".4"/>
          <circle cx="11" cy="3" r="2" fill="#FBBF24" stroke={C} strokeWidth=".4"/>
          {/* column with height scale */}
          <rect x="6" y="4" width="4" height="28" fill="#86C5DC" stroke={C} strokeWidth=".5"/>
          {[...Array(7)].map((_,i)=><rect key={i} x="6" y={7+i*3.5} width="2" height=".5" fill={C} opacity=".5"/>)}
          {/* height slider */}
          <rect x="4" y="11" width="8" height="2" fill="#EF4444" stroke={C} strokeWidth=".4"/>
          {/* digital display */}
          <rect x="2.5" y="32" width="11" height="4" fill="#0F1A24" stroke={C} strokeWidth=".4"/>
          <text x="8" y="35" fontSize="2.4" fill="#22D3EE" textAnchor="middle" fontFamily="monospace">112cm</text>
          {/* platform */}
          <rect x="1" y="36" width="14" height="4" fill="#94A3B8" stroke={C} strokeWidth=".5"/>
          <rect x="2" y="37" width="12" height="1.4" fill="#CBD5E1"/>
        </svg>
      </div>
    );
  }

  // ─── TongueDepressorJar — 설압자 통 ───────────────────────────────
  function TongueDepressorJar({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T + 4, top: y * T + 3, width: T - 8, height: T - 5, filter: 'drop-shadow(1px 1.5px 0 rgba(0,0,0,.2))' }}>
        <svg viewBox="0 0 8 10" width={T - 8} height={T - 5} shapeRendering="crispEdges">
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
      <div style={{ position: 'absolute', left: x * T + 4, top: y * T + 4, width: T - 8, height: T - 6, filter: 'drop-shadow(1px 1.5px 0 rgba(0,0,0,.2))' }}>
        <svg viewBox="0 0 8 8" width={T - 8} height={T - 6} shapeRendering="crispEdges">
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
      <div style={{ position: 'absolute', left: x * T, top: y * T, width: T * w, height: T * 1.2, filter: 'drop-shadow(2px 2px 0 rgba(0,0,0,.22))' }}>
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
      <div style={{ position: 'absolute', left: x * T + 1, top: y * T - 4, width: T - 2, height: T * 1.7, filter: 'drop-shadow(2px 3px 0 rgba(0,0,0,.26))' }}>
        <svg viewBox="0 0 14 28" width={T - 2} height={T * 1.7} shapeRendering="crispEdges">
          <path d="M1 2 L13 2 L14 4 L0 4 Z" fill="#CBD5E1" stroke={C} strokeWidth=".4"/>
          <rect x="0" y="4" width="14" height="22" fill="#E5E7EB" stroke={C} strokeWidth=".5"/>
          {/* glass door w/ bottle shelves */}
          <rect x="1.5" y="5.5" width="11" height="19" fill="#D7EEF5" stroke={C} strokeWidth=".5"/>
          {[7,12,17].map((sy,r) => (
            <g key={r}>
              <rect x="2" y={sy} width="10" height="4" fill="#BFE0EA"/>
              {[0,1,2,3].map(i => (
                <g key={i}>
                  <rect x={2.5+i*2.4} y={sy+0.6} width="1.6" height="3" fill="#FFFDF5" stroke={C} strokeWidth=".2"/>
                  <rect x={2.5+i*2.4} y={sy+2.6} width="1.6" height="1" fill="#FBE3C8"/>{/* name label */}
                </g>
              ))}
            </g>
          ))}
          <rect x="11.5" y="11" width="1.2" height="7" fill="#6B7280"/>
          {/* temp display */}
          <rect x="9" y="2.3" width="4" height="1.4" fill="#0B2A3A"/>
          <rect x="9.5" y="2.6" width="2.5" height=".8" fill="#22D3EE"/>
        </svg>
      </div>
    );
  }

  Object.assign(window, {
    Incubator, PhototherapyLamp, MetalCrib, IVBoard, BabyScale,
    StadiometerScale, TongueDepressorJar, StickerRoll, DosingChart, MilkFridge,
  });
})();
