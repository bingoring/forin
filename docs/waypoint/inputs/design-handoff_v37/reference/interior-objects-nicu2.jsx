// interior-objects-nicu2.jsx — 신생아 중환자실 NICU objects.
// Distinct from open Nursery: enclosed isolette incubators, giraffe warmer beds,
// nasal-CPAP/vent, bedside developmental care. v2 top-down, single silhouette,
// ground-contact ellipse shadow.

(function () {
  const C = '#2A2522';
  const T = window.ITILE || 16;

  // ─── NICUIsolette — 폐쇄형 신생아 인큐베이터 (온·습도 표시 + 포트홀) ─
  function NICUIsolette({ x, y, occupied = true }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 4, width: T * 2.4, height: T * 2.4 }}>
        <svg viewBox="0 0 38 38" width={T * 2.4} height={T * 2.4} shapeRendering="geometricPrecision">
          <ellipse cx="19" cy="36.5" rx="15" ry="2.2" fill="rgba(0,0,0,.16)"/>
          {/* base cabinet: big top face + short front (continuous silhouette) */}
          <path d="M3 20 L35 20 L35 32 Q35 33 34 33 L4 33 Q3 33 3 32 Z" fill="#7FB8C8" stroke={C} strokeWidth=".7"/>
          <rect x="3" y="20" width="32" height="2" fill="#A7D2DE"/>
          {/* viewer-facing temp/humidity readout on the front band */}
          <rect x="6" y="24" width="12" height="6" rx=".6" fill="#0F1A24" stroke={C} strokeWidth=".4"/>
          <text x="12" y="27" fontSize="2.6" fill="#FBBF24" textAnchor="middle" fontFamily="monospace">36.8</text>
          <text x="12" y="29.6" fontSize="2.4" fill="#22D3EE" textAnchor="middle" fontFamily="monospace">65%</text>
          <circle cx="24" cy="26" r="1.8" fill="#CBD5E1" stroke={C} strokeWidth=".3"/>
          <circle cx="29" cy="26" r="1.8" fill="#CBD5E1" stroke={C} strokeWidth=".3"/>
          {/* clear acrylic hood sitting on the base (overlaps for top-down) */}
          <rect x="5" y="8" width="28" height="14" rx="4" fill="#DDEFF5" fillOpacity=".82" stroke={C} strokeWidth=".6"/>
          <rect x="7" y="10" width="24" height="9" rx="3" fill="#C4E2EC" fillOpacity=".8"/>
          <path d="M8 10.5 L16 10.5 L10 20.5 L8 20.5 Z" fill="#FFFFFF" opacity=".28"/>{/* glare */}
          {/* access portholes (round hand-holes on the near wall) */}
          <circle cx="13" cy="20" r="2.6" fill="#BFE0EA" stroke={C} strokeWidth=".5"/>
          <circle cx="25" cy="20" r="2.6" fill="#BFE0EA" stroke={C} strokeWidth=".5"/>
          {occupied && (
            <g>
              <ellipse cx="19" cy="14" rx="6" ry="3" fill="#FBE3EE"/>{/* tiny swaddle */}
              <circle cx="14" cy="14" r="1.7" fill="#FBD9C0" stroke={C} strokeWidth=".3"/>
            </g>
          )}
        </svg>
      </div>
    );
  }

  // ─── GiraffeWarmer — 개방·폐쇄 겸용 신생아 워머 (승강 후드 기둥) ─────
  function GiraffeWarmer({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 14, width: T * 2, height: T * 3 }}>
        <svg viewBox="0 0 32 48" width={T * 2} height={T * 3} shapeRendering="geometricPrecision">
          <ellipse cx="16" cy="42" rx="12" ry="2.2" fill="rgba(0,0,0,.16)"/>
          {/* tall support column + radiant heater head */}
          <rect x="14.5" y="0" width="3" height="10" fill="#9CA3AF" stroke={C} strokeWidth=".4"/>
          <rect x="7" y="9" width="18" height="4" rx="1" fill="#5B6672" stroke={C} strokeWidth=".5"/>
          <rect x="9" y="11.5" width="14" height="1.4" fill="#F59E0B"/>
          <path d="M9 13 L7 21 M16 13 L16 21 M23 13 L25 21" stroke="#FBBF24" strokeWidth=".5" opacity=".45"/>
          {/* bassinet tray: top face + short front */}
          <path d="M4 21 L28 21 L28 30 Q28 31 27 31 L5 31 Q4 31 4 30 Z" fill="#DDEFF5" fillOpacity=".9" stroke={C} strokeWidth=".6"/>
          <rect x="6" y="22" width="20" height="7" rx="2" fill="#FDE4EE"/>
          <ellipse cx="16" cy="25.5" rx="5" ry="2.4" fill="#FFF3F7"/>
          <circle cx="12" cy="25.5" r="1.6" fill="#FBD9C0" stroke={C} strokeWidth=".3"/>
          {/* base + monitor panel + wheels */}
          <path d="M10 31 L22 31 L22 39 Q22 40 21 40 L11 40 Q10 40 10 39 Z" fill="#B7BEC6" stroke={C} strokeWidth=".5"/>
          <rect x="11" y="33" width="10" height="3" fill="#0F1A24"/>
          <rect x="12" y="33.6" width="4" height="1" fill="#A7F3D0"/>
          <ellipse cx="9" cy="41" rx="2" ry="1.4" fill={C}/>
          <ellipse cx="23" cy="41" rx="2" ry="1.4" fill={C}/>
        </svg>
      </div>
    );
  }

  // ─── CPAPUnit — 신생아 비강 CPAP/인공호흡기 (가습기 + 회로) ──────────
  function CPAPUnit({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 14, width: T * 1.1, height: T * 2.6 }}>
        <svg viewBox="0 0 18 42" width={T * 1.1} height={T * 2.6} shapeRendering="geometricPrecision">
          <ellipse cx="9" cy="40.5" rx="6" ry="1.7" fill="rgba(0,0,0,.16)"/>
          {/* screen head, viewer-facing */}
          <rect x="2" y="4" width="14" height="10" rx="1" fill="#475569" stroke={C} strokeWidth=".5"/>
          <rect x="3.5" y="5.5" width="11" height="7" fill="#0B1A22"/>
          <path d="M4.5 9 Q7 7.5 9.5 9 T14 9" fill="none" stroke="#22D3EE" strokeWidth=".6"/>
          {/* heated humidifier chamber (blue water) */}
          <rect x="4" y="15" width="10" height="5" rx="1" fill="#BFE3EE" stroke={C} strokeWidth=".4"/>
          <rect x="4" y="17.5" width="10" height="2.5" fill="#9FD0E4"/>
          {/* twin heated circuit tubing */}
          <path d="M14 12 Q19 16 15 22" fill="none" stroke="#D4E8F0" strokeWidth="1.4"/>
          {/* pole + base */}
          <rect x="8" y="20" width="2" height="16" fill="#CBD5E1" stroke={C} strokeWidth=".3"/>
          <ellipse cx="9" cy="37" rx="5" ry="1.7" fill="#6B7280" stroke={C} strokeWidth=".4"/>
        </svg>
      </div>
    );
  }

  // ─── PhototherapyLED — 신생아 황달 LED 광선판 (인큐 위 청색광) ───────
  function PhototherapyLED({ x, y, w = 2 }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 6, width: T * w, height: T * 1.2, zIndex: 1 }}>
        <svg viewBox={`0 0 ${w*16} 18`} width={T * w} height={T * 1.2} shapeRendering="geometricPrecision" preserveAspectRatio="none">
          <rect x={w*8-1} y="0" width="2" height="3" fill="#9CA3AF"/>{/* arm */}
          <rect x="2" y="3" width={w*16-4} height="5" rx="1" fill="#475569" stroke={C} strokeWidth=".5"/>
          <rect x="3" y="7" width={w*16-6} height="2.4" fill="#3B82F6"/>
          {[...Array(Math.max(3,w*2))].map((_,i)=><rect key={i} x={4+i*((w*16-8)/(w*2))} y="7.4" width="2" height="1.8" fill="#7DD3FC"/>)}
          <rect x="1" y="9.4" width={w*16-2} height="7" fill="#60A5FA" opacity=".3"/>{/* blue glow */}
        </svg>
      </div>
    );
  }

  Object.assign(window, {
    NICUIsolette, GiraffeWarmer, CPAPUnit, PhototherapyLED,
  });
})();
