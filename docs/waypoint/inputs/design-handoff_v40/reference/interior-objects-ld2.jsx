// interior-objects-ld2.jsx — Labor & Delivery / Postpartum / Nursery objects.
// Obstetric unit blueprint. v2 pixel style: dominant TOP face + short front,
// single continuous silhouette, right-side ground-contact ellipse shadow.
// Loads before the L&D screen render.

(function () {
  const C = '#2A2522';
  const T = window.ITILE || 16;

  // ─── BirthingBed — 분만대 (다리 거치대 stirrups + 등받이 각도) ───────
  function BirthingBed({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 4, width: T * 3, height: T * 2.6 }}>
        <svg viewBox="0 0 48 42" width={T * 3} height={T * 2.6} shapeRendering="geometricPrecision">
          <ellipse cx="24" cy="40" rx="20" ry="2.6" fill="rgba(0,0,0,.16)"/>
          {/* mattress TOP face (dominant) folding into a short front band */}
          <path d="M4 6 L44 6 L44 33 Q44 35 42 35 L6 35 Q4 35 4 33 Z" fill="#C9DCE6" stroke={C} strokeWidth=".7"/>
          <rect x="4" y="6" width="40" height="26" fill="#DCE9F0"/>{/* pad top */}
          {/* raised back-rest section (upper third) */}
          <rect x="6" y="7.5" width="36" height="9" rx="1.5" fill="#B7D0DC" stroke={C} strokeWidth=".4"/>
          <rect x="7" y="9" width="34" height="1.4" fill="#CFE0E8"/>
          {/* draw sheet + perineal opening near the foot */}
          <rect x="12" y="24" width="24" height="8" fill="#EAF2F6"/>
          <path d="M20 32 Q24 27 28 32 Z" fill="#B7D0DC"/>
          {/* stirrups (leg supports) splaying at the foot corners */}
          <path d="M8 33 L2 40" stroke="#8A929B" strokeWidth="2.2" strokeLinecap="round"/>
          <circle cx="2" cy="40" r="2.2" fill="#9CA3AF" stroke={C} strokeWidth=".4"/>
          <path d="M40 33 L46 40" stroke="#8A929B" strokeWidth="2.2" strokeLinecap="round"/>
          <circle cx="46" cy="40" r="2.2" fill="#9CA3AF" stroke={C} strokeWidth=".4"/>
          <line x1="4" y1="33" x2="44" y2="33" stroke={C} strokeWidth=".5"/>{/* top↔front seam */}
          {/* side control rails */}
          <rect x="3" y="16" width="1.6" height="12" rx=".8" fill="#9CA3AF" stroke={C} strokeWidth=".3"/>
          <rect x="43.4" y="16" width="1.6" height="12" rx=".8" fill="#9CA3AF" stroke={C} strokeWidth=".3"/>
        </svg>
      </div>
    );
  }

  // ─── FetalMonitor — 태아 감시장치 CTG (뷰어 향 듀얼 파형 + 트랜스듀서) ─
  function FetalMonitor({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 8, width: T * 1.4, height: T * 2.3 }}>
        <svg viewBox="0 0 22 36" width={T * 1.4} height={T * 2.3} shapeRendering="geometricPrecision">
          <ellipse cx="11" cy="31.5" rx="8" ry="2.4" fill="rgba(0,0,0,.16)"/>
          {/* cart TOP + continuous front */}
          <path d="M3 12 L19 12 L19 30 Q19 31 18 31 L4 31 Q3 31 3 30 Z" fill="#8E99A4" stroke={C} strokeWidth=".6"/>
          <rect x="3" y="9" width="16" height="3.5" fill="#AEB6BE" stroke={C} strokeWidth=".5"/>{/* top cap */}
          {/* viewer-facing screen — two waveforms (FHR + toco) */}
          <rect x="2" y="1" width="18" height="11" rx="1" fill="#111827" stroke={C} strokeWidth=".6"/>
          <rect x="3.2" y="2.2" width="15.6" height="8.6" fill="#0B1A22"/>
          <path d="M4 5 Q7 3.5 10 5 T16 5" fill="none" stroke="#F472B6" strokeWidth=".6"/>{/* FHR */}
          <path d="M4 8.4 Q7 7.4 10 8.4 T16 8.4" fill="none" stroke="#22D3EE" strokeWidth=".6"/>{/* toco */}
          <text x="17" y="4" fontSize="2.2" fill="#F9A8D4" textAnchor="end" fontFamily="monospace">142</text>
          {/* two round transducers on the shelf */}
          <circle cx="7" cy="15" r="2.2" fill="#E5E7EB" stroke={C} strokeWidth=".4"/>
          <circle cx="13" cy="15" r="2.2" fill="#F9C9D6" stroke={C} strokeWidth=".4"/>
          {/* knob + printout slot on front */}
          <circle cx="6" cy="26" r="1.6" fill="#CBD5E1" stroke={C} strokeWidth=".3"/>
          <rect x="10" y="24.5" width="7" height="3" fill="#fff" stroke={C} strokeWidth=".4"/>
          <line x1="10" y1="26" x2="17" y2="26" stroke={C} strokeWidth=".2"/>
        </svg>
      </div>
    );
  }

  // ─── InfantWarmer — 신생아 개방형 워머 (라디언트 히터 + 트레이) ──────
  function InfantWarmer({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 12, width: T * 1.8, height: T * 2.8 }}>
        <svg viewBox="0 0 28 44" width={T * 1.8} height={T * 2.8} shapeRendering="geometricPrecision">
          <ellipse cx="14" cy="42.5" rx="10" ry="2.4" fill="rgba(0,0,0,.16)"/>
          {/* radiant heater head on a post, glowing down */}
          <rect x="12.5" y="0" width="3" height="9" fill="#9CA3AF" stroke={C} strokeWidth=".4"/>
          <rect x="6" y="8" width="16" height="4" rx="1" fill="#5B6672" stroke={C} strokeWidth=".5"/>
          <rect x="8" y="10.5" width="12" height="1.4" fill="#F59E0B"/>{/* warm element */}
          <path d="M8 12 L6 20 M14 12 L14 20 M20 12 L22 20" stroke="#FBBF24" strokeWidth=".5" opacity=".5"/>
          {/* bassinet tray TOP face (dominant) + short front */}
          <path d="M4 20 L24 20 L24 30 Q24 31.5 22.5 31.5 L5.5 31.5 Q4 31.5 4 30 Z" fill="#F7C9D9" stroke={C} strokeWidth=".6"/>
          <rect x="5.5" y="21" width="17" height="7" rx="2" fill="#FDE4EE"/>{/* mattress */}
          {/* swaddled newborn */}
          <ellipse cx="14" cy="24.5" rx="5" ry="2.6" fill="#FFF3F7"/>
          <circle cx="10.5" cy="24.5" r="1.6" fill="#FBD9C0" stroke={C} strokeWidth=".3"/>
          <line x1="4" y1="20" x2="24" y2="20" stroke={C} strokeWidth=".5"/>
          {/* base column + wheels */}
          <rect x="10" y="31.5" width="8" height="8" fill="#B7BEC6" stroke={C} strokeWidth=".5"/>
          <rect x="11" y="33" width="6" height="2.5" fill="#0F1A24"/>{/* control panel */}
          <ellipse cx="8" cy="40" rx="2" ry="1.4" fill={C}/>
          <ellipse cx="20" cy="40" rx="2" ry="1.4" fill={C}/>
        </svg>
      </div>
    );
  }

  // ─── Bassinet — 신생아 이동 카트형 아기 침대 (투명 통) ───────────────
  function Bassinet({ x, y, tag }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 2, width: T * 1.5, height: T * 2 }}>
        <svg viewBox="0 0 24 32" width={T * 1.5} height={T * 2} shapeRendering="geometricPrecision">
          <ellipse cx="12" cy="30.5" rx="8" ry="2.2" fill="rgba(0,0,0,.16)"/>
          {/* clear acrylic tub — TOP oval opening + slanted clear front */}
          <ellipse cx="12" cy="8" rx="10" ry="4.4" fill="#DDEFF5" fillOpacity=".85" stroke={C} strokeWidth=".6"/>
          <ellipse cx="12" cy="7.4" rx="7.6" ry="3" fill="#EAF6FA"/>
          {/* swaddled baby inside */}
          <ellipse cx="12" cy="8" rx="5" ry="2.2" fill="#FFF3F7"/>
          <circle cx="8.5" cy="8" r="1.5" fill="#FBD9C0" stroke={C} strokeWidth=".3"/>
          {/* tub walls (transparent) folding down to the cart */}
          <path d="M2 8 L2 15 Q2 17 4 17 L20 17 Q22 17 22 15 L22 8" fill="#CFE6EE" fillOpacity=".5" stroke={C} strokeWidth=".5"/>
          {/* name card */}
          <rect x="8" y="12" width="8" height="3" rx=".5" fill={tag === 'boy' ? '#BFE0EA' : '#F9C9D6'} stroke={C} strokeWidth=".3"/>
          {/* chrome cart frame + wheels */}
          <rect x="4" y="17" width="16" height="9" fill="#B7BEC6" stroke={C} strokeWidth=".5"/>
          <rect x="5.5" y="19" width="13" height="4" fill="#CBD5E1"/>{/* storage shelf */}
          <ellipse cx="7" cy="28" rx="2" ry="1.4" fill={C}/>
          <ellipse cx="17" cy="28" rx="2" ry="1.4" fill={C}/>
        </svg>
      </div>
    );
  }

  // ─── DeliveryCart — 분만 기구 카트 (겸자·클램프·트레이) ──────────────
  function DeliveryCart({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 4, width: T * 1.5, height: T * 1.9 }}>
        <svg viewBox="0 0 24 30" width={T * 1.5} height={T * 1.9} shapeRendering="geometricPrecision">
          <ellipse cx="12" cy="28.5" rx="8" ry="2.2" fill="rgba(0,0,0,.16)"/>
          {/* worktop TOP face + short front */}
          <path d="M2 8 L22 8 L22 25 Q22 26 21 26 L3 26 Q2 26 2 25 Z" fill="#9BA2AB" stroke={C} strokeWidth=".6"/>
          <rect x="2" y="2" width="20" height="6" rx="1" fill="#B7BEC6" stroke={C} strokeWidth=".5"/>
          {/* sterile-blue drape + instruments on top */}
          <rect x="4" y="3" width="16" height="4" fill="#A5D8E8"/>
          <rect x="5" y="3.6" width="7" height="1" fill="#9CA3AF"/>{/* forceps */}
          <rect x="5" y="5" width="5" height="1" fill="#9CA3AF"/>{/* clamp */}
          <rect x="14" y="3.6" width="1" height="3" fill="#9CA3AF"/>{/* scissors */}
          <line x1="2" y1="8" x2="22" y2="8" stroke={C} strokeWidth=".5"/>
          {/* two drawers (front) + casters */}
          <rect x="4" y="10" width="16" height="6" rx=".5" fill="#E1E5EA" stroke={C} strokeWidth=".4"/>
          <rect x="4" y="17" width="16" height="6" rx=".5" fill="#E1E5EA" stroke={C} strokeWidth=".4"/>
          <rect x="10" y="12.5" width="4" height="1.2" fill="#9AA1A8"/>
          <rect x="10" y="19.5" width="4" height="1.2" fill="#9AA1A8"/>
          <ellipse cx="5" cy="27.5" rx="1.8" ry="1.3" fill={C}/>
          <ellipse cx="19" cy="27.5" rx="1.8" ry="1.3" fill={C}/>
        </svg>
      </div>
    );
  }

  // ─── NursingRecliner — 수유용 리클라이너 (수유 쿠션) ────────────────
  function NursingRecliner({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 4, width: T * 1.6, height: T * 1.9 }}>
        <svg viewBox="0 0 26 30" width={T * 1.6} height={T * 1.9} shapeRendering="geometricPrecision">
          <ellipse cx="13" cy="25.8" rx="9.5" ry="2.4" fill="rgba(0,0,0,.16)"/>
          {/* seat TOP face + front */}
          <path d="M4 12 L22 12 L23 24 Q23 25 22 25 L4 25 Q3 25 3 24 Z" fill="#8FB5A0" stroke={C} strokeWidth=".6"/>
          <path d="M5 13 L21 13 L21.6 22 L4.4 22 Z" fill="#A7D0BC"/>{/* cushion */}
          {/* tall padded backrest */}
          <path d="M4 3 L22 3 L22 12 L4 12 Z" fill="#8FB5A0" stroke={C} strokeWidth=".6"/>
          <rect x="5.5" y="4.5" width="15" height="6" rx="2" fill="#A7D0BC"/>
          {/* armrests */}
          <rect x="2" y="12" width="3" height="10" rx="1" fill="#7BA491" stroke={C} strokeWidth=".4"/>
          <rect x="21" y="12" width="3" height="10" rx="1" fill="#7BA491" stroke={C} strokeWidth=".4"/>
          {/* C-shaped nursing pillow on the seat */}
          <path d="M8 18 Q13 14 18 18 Q18 21 15 20 Q13 18 11 20 Q8 21 8 18 Z" fill="#FDE4EE" stroke={C} strokeWidth=".4"/>
        </svg>
      </div>
    );
  }

  // ─── WarmerCabinet — 보온 담요/수액 캐비닛 (벽 부착) ────────────────
  function WarmerCabinet({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T + 1, top: y * T, width: T - 2, height: T * 1.4 }}>
        <svg viewBox="0 0 14 22" width={T - 2} height={T * 1.4} shapeRendering="geometricPrecision">
          <ellipse cx="7" cy="20.5" rx="5" ry="1.6" fill="rgba(0,0,0,.14)"/>
          <path d="M1 3 L13 3 L13 19 Q13 20 12 20 L2 20 Q1 20 1 19 Z" fill="#CF9E6E" stroke={C} strokeWidth=".6"/>
          <rect x="1" y="1" width="12" height="2.4" fill="#B98A5A"/>{/* top */}
          {/* glass door showing folded warm blankets */}
          <rect x="2" y="4.5" width="10" height="13.5" rx=".6" fill="#E8D2B0" stroke={C} strokeWidth=".4"/>
          <rect x="3" y="6" width="8" height="2.4" fill="#F2E0C4" stroke={C} strokeWidth=".25"/>
          <rect x="3" y="9" width="8" height="2.4" fill="#F2E0C4" stroke={C} strokeWidth=".25"/>
          <rect x="3" y="12" width="8" height="2.4" fill="#F2E0C4" stroke={C} strokeWidth=".25"/>
          {/* temp readout + handle */}
          <rect x="8.5" y="1.2" width="4" height="1.4" fill="#0B2A1A"/>
          <rect x="8.6" y="1.5" width="2.4" height=".8" fill="#F59E0B"/>
          <rect x="10.6" y="10" width="1" height="4" fill="#8A6A40"/>
        </svg>
      </div>
    );
  }

  Object.assign(window, {
    BirthingBed, FetalMonitor, InfantWarmer, Bassinet, DeliveryCart,
    NursingRecliner, WarmerCabinet,
  });
})();
