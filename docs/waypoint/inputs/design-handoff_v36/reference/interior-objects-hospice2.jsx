// interior-objects-hospice2.jsx — 완화의료·호스피스 병동 objects.
// Warm, home-like, dignified. v2 top-down, single silhouette, ground ellipse.

(function () {
  const C = '#2A2522';
  const T = window.ITILE || 16;

  // ─── HospiceBed — 목재 프레임의 가정형 완화의료 침대 (포근한 이불) ──
  function HospiceBed({ x, y, occupied }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 4, width: T * 2.5, height: T * 3.4 }}>
        <svg viewBox="0 0 40 52" width={T * 2.5} height={T * 3.4} shapeRendering="geometricPrecision">
          <ellipse cx="20" cy="49" rx="17" ry="2.4" fill="rgba(0,0,0,.16)"/>
          {/* warm wooden headboard (top face + short front) */}
          <path d="M3 3 L37 3 L37 11 L3 11 Z" fill="#C99F68" stroke={C} strokeWidth=".7"/>
          <rect x="4" y="4" width="32" height="1.6" fill="#DBB884"/>
          <rect x="9" y="4.5" width="1" height="6" fill="#B0854E"/><rect x="20" y="4.5" width="1" height="6" fill="#B0854E"/><rect x="31" y="4.5" width="1" height="6" fill="#B0854E"/>
          {/* mattress top face + short front (continuous) */}
          <path d="M3 11 L37 11 L37 44 Q37 46 35 46 L5 46 Q3 46 3 44 Z" fill="#E4DAC8" stroke={C} strokeWidth=".7"/>
          {/* two pillows */}
          <rect x="6" y="13" width="12" height="8" rx="3" fill="#FBFAF4" stroke={C} strokeWidth=".4"/>
          <rect x="22" y="13" width="12" height="8" rx="3" fill="#FBFAF4" stroke={C} strokeWidth=".4"/>
          {/* soft patterned quilt (lower 2/3) */}
          <rect x="4" y="23" width="32" height="20" rx="1.5" fill="#B7C9A8"/>
          <path d="M4 30 L36 30 M4 37 L36 37" stroke="#9DB08C" strokeWidth=".6"/>
          <path d="M13 23 L13 43 M22 23 L22 43 M31 23 L31 43" stroke="#9DB08C" strokeWidth=".5" opacity=".6"/>
          {/* occupant */}
          {occupied && (
            <g>
              <rect x="16" y="14.5" width="6.5" height="5.5" rx="2.4" fill="#FBD9C0" stroke={C} strokeWidth=".3"/>
              <rect x="16.4" y="13.6" width="5.7" height="1.5" fill="#8A8A8A"/>{/* grey hair */}
              <ellipse cx="20" cy="32" rx="10" ry="6.5" fill="#A8BE97" opacity=".5"/>
            </g>
          )}
          <line x1="3" y1="44" x2="37" y2="44" stroke={C} strokeWidth=".5"/>
          {/* wooden legs */}
          <rect x="4" y="46" width="3" height="3" fill="#A57C44"/>
          <rect x="33" y="46" width="3" height="3" fill="#A57C44"/>
        </svg>
      </div>
    );
  }

  // ─── ReclinerDaybed — 보호자 상주용 소파 겸 간이침대 ────────────────
  function ReclinerDaybed({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 4, width: T * 2.4, height: T * 2 }}>
        <svg viewBox="0 0 38 32" width={T * 2.4} height={T * 2} shapeRendering="geometricPrecision">
          <ellipse cx="19" cy="30" rx="15" ry="2" fill="rgba(0,0,0,.14)"/>
          {/* reclined daybed: long padded seat top + short front (continuous) */}
          <path d="M2 11 L36 11 L36 25 Q36 27 34 27 L4 27 Q2 27 2 25 Z" fill="#A98D66" stroke={C} strokeWidth=".7"/>
          {/* seat cushions (two segments) */}
          <rect x="3.5" y="12.5" width="15" height="10" rx="2" fill="#C4A578" stroke={C} strokeWidth=".3"/>
          <rect x="19.5" y="12.5" width="15" height="10" rx="2" fill="#C4A578" stroke={C} strokeWidth=".3"/>
          {/* raised headrest bolster at the left (reclined) */}
          <rect x="2" y="4" width="12" height="8" rx="3" fill="#B89A72" stroke={C} strokeWidth=".6"/>
          <rect x="3.5" y="5.5" width="9" height="2" rx="1" fill="#CDB185"/>
          {/* armrests down both long sides */}
          <rect x="1" y="10" width="2.5" height="16" rx="1.2" fill="#8F7550"/>
          <rect x="34.5" y="10" width="2.5" height="16" rx="1.2" fill="#8F7550"/>
          {/* folded throw blanket */}
          <rect x="22" y="14" width="11" height="7" rx="1" fill="#B7C9A8" stroke={C} strokeWidth=".4"/>
          <path d="M22 17.5 L33 17.5" stroke="#9DB08C" strokeWidth=".5"/>
          <line x1="2" y1="22" x2="36" y2="22" stroke={C} strokeWidth=".4" opacity=".5"/>
        </svg>
      </div>
    );
  }

  // ─── ComfortCart — 아로마·음악 완화 케어 카트 (디퓨저·티포트) ────────
  function ComfortCart({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 4, width: T * 1.5, height: T * 1.9 }}>
        <svg viewBox="0 0 24 30" width={T * 1.5} height={T * 1.9} shapeRendering="geometricPrecision">
          <ellipse cx="12" cy="28.5" rx="8" ry="2.2" fill="rgba(0,0,0,.16)"/>
          {/* worktop top + front */}
          <path d="M2 8 L22 8 L22 25 Q22 26 21 26 L3 26 Q2 26 2 25 Z" fill="#B8A98E" stroke={C} strokeWidth=".6"/>
          <rect x="2" y="8" width="20" height="4" fill="#CCBE9E"/>
          {/* aroma diffuser (soft mist) + teapot on top */}
          <rect x="5" y="4" width="4" height="4.5" rx="1.5" fill="#DCE8DE" stroke={C} strokeWidth=".4"/>
          <ellipse cx="7" cy="3" rx="1.6" ry="1" fill="#CFE6EE" opacity=".7"/>{/* mist */}
          <path d="M13 5 L18 5 L17 8.5 L14 8.5 Z" fill="#E4B7A0" stroke={C} strokeWidth=".4"/>{/* teapot */}
          <rect x="15" y="3.5" width="1.4" height="1.8" fill="#E4B7A0"/>
          <line x1="2" y1="12" x2="22" y2="12" stroke={C} strokeWidth=".4"/>
          {/* drawer + shelf (front) */}
          <rect x="4" y="14" width="16" height="4" rx=".5" fill="#E0D6BE" stroke={C} strokeWidth=".4"/>
          <rect x="10" y="15.5" width="4" height="1" fill="#9C8F70"/>
          <rect x="4" y="19.5" width="16" height="4" rx=".5" fill="#E0D6BE" stroke={C} strokeWidth=".4"/>
          <ellipse cx="5" cy="27.5" rx="1.6" ry="1.2" fill={C}/>
          <ellipse cx="19" cy="27.5" rx="1.6" ry="1.2" fill={C}/>
        </svg>
      </div>
    );
  }

  // ─── SyringeDriver — 지속 피하주입 통증펌프 (소형, 폴대 거치) ─────────
  function SyringeDriver({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 16, width: T * 0.9, height: T * 2.6 }}>
        <svg viewBox="0 0 14 42" width={T * 0.9} height={T * 2.6} shapeRendering="geometricPrecision">
          <ellipse cx="7" cy="40.5" rx="5" ry="1.7" fill="rgba(0,0,0,.16)"/>
          {/* small driver box on the pole, viewer-facing */}
          <rect x="2" y="6" width="10" height="8" rx="1" fill="#5B6672" stroke={C} strokeWidth=".5"/>
          <rect x="3" y="7" width="8" height="3" fill="#0F1A24"/>
          <rect x="3.6" y="7.8" width="5" height="1" fill="#A7F3D0"/>
          {/* horizontal syringe barrel clipped on */}
          <rect x="1" y="11" width="11" height="2" rx="1" fill="#E5E7EB" stroke={C} strokeWidth=".3"/>
          <rect x="1.5" y="11.4" width="6" height="1.2" fill="#CFE6EE"/>
          {/* pole + base */}
          <rect x="6" y="14" width="2" height="22" fill="#CBD5E1" stroke={C} strokeWidth=".3"/>
          <ellipse cx="7" cy="37" rx="5" ry="1.7" fill="#6B7280" stroke={C} strokeWidth=".4"/>
        </svg>
      </div>
    );
  }

  Object.assign(window, {
    HospiceBed, ReclinerDaybed, ComfortCart, SyringeDriver,
  });
})();
