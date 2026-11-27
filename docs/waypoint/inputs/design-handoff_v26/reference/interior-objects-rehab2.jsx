// interior-objects-rehab2.jsx — 재활치료실 PT/OT Gym objects.
// Big open therapy gym. v2 top-down, single silhouette, ground ellipse shadow.

(function () {
  const C = '#2A2522';
  const T = window.ITILE || 16;

  // ─── ParallelBars — 평행봉 (보행 훈련) ─────────────────────────────
  function ParallelBars({ x, y, w = 4 }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T, width: T * w, height: T * 1.6 }}>
        <svg viewBox={`0 0 ${w*16} 26`} width={T * w} height={T * 1.6} shapeRendering="geometricPrecision" preserveAspectRatio="none">
          <ellipse cx={w*8} cy="24" rx={w*7} ry="2" fill="rgba(0,0,0,.14)"/>
          {/* walkway mat between the bars (top face) */}
          <rect x="6" y="8" width={w*16-12} height="11" rx="1" fill="#8FB59E" stroke={C} strokeWidth=".5"/>
          <rect x="7" y="9" width={w*16-14} height="2" fill="#A7D0BC"/>
          {/* two horizontal wooden hand-rails (viewer near + far) */}
          <rect x="3" y="5" width={w*16-6} height="2.4" rx="1.2" fill="#C99F68" stroke={C} strokeWidth=".4"/>{/* far rail */}
          <rect x="3" y="18.5" width={w*16-6} height="2.4" rx="1.2" fill="#B98A5A" stroke={C} strokeWidth=".4"/>{/* near rail */}
          {/* chrome uprights */}
          {[4, w*16-6].map((ux,i)=>(<g key={i}>
            <rect x={ux} y="6" width="2" height="16" fill="#9CA3AF" stroke={C} strokeWidth=".3"/>
          </g>))}
          {[Math.round(w*16/2)-1].map((ux,i)=>(<rect key={'m'+i} x={ux} y="6" width="2" height="16" fill="#9CA3AF" stroke={C} strokeWidth=".3"/>))}
        </svg>
      </div>
    );
  }

  // ─── TherapyMat — 승강식 치료 매트 테이블 ──────────────────────────
  function TherapyMat({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 2, width: T * 2.4, height: T * 1.8 }}>
        <svg viewBox="0 0 38 28" width={T * 2.4} height={T * 1.8} shapeRendering="geometricPrecision">
          <ellipse cx="19" cy="26" rx="15" ry="2.2" fill="rgba(0,0,0,.16)"/>
          {/* thick mat top face + front band (continuous) */}
          <path d="M2 4 L36 4 L36 20 Q36 21 35 21 L3 21 Q2 21 2 20 Z" fill="#3E6FA0" stroke={C} strokeWidth=".6"/>
          <rect x="2" y="4" width="34" height="10" fill="#5A8AC0"/>{/* padded top */}
          <line x1="19" y1="4" x2="19" y2="14" stroke="#3E6FA0" strokeWidth=".6" opacity=".6"/>{/* seam */}
          <line x1="2" y1="14" x2="36" y2="14" stroke={C} strokeWidth=".4"/>
          {/* hydraulic lift base + pedal */}
          <rect x="12" y="21" width="14" height="4" fill="#9CA3AF" stroke={C} strokeWidth=".4"/>
          <rect x="8" y="23" width="5" height="2.4" fill="#FBBF24" stroke={C} strokeWidth=".4"/>{/* pedal */}
        </svg>
      </div>
    );
  }

  // ─── Treadmill — 재활 트레드�will (손잡이 + 콘솔) ────────────────────
  function Treadmill({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 8, width: T * 1.8, height: T * 2.4 }}>
        <svg viewBox="0 0 28 38" width={T * 1.8} height={T * 2.4} shapeRendering="geometricPrecision">
          <ellipse cx="14" cy="31" rx="11.5" ry="2.4" fill="rgba(0,0,0,.16)"/>
          {/* running deck — top face + short front */}
          <path d="M3 16 L25 16 L25 30 Q25 31 24 31 L4 31 Q3 31 3 30 Z" fill="#3A4048" stroke={C} strokeWidth=".6"/>
          <rect x="4" y="17" width="20" height="12" fill="#2C3239"/>{/* belt */}
          {[0,1,2,3].map(i=><line key={i} x1="4" y1={19+i*3} x2="24" y2={19+i*3} stroke="#4B5563" strokeWidth=".5"/>)}
          {/* side rails */}
          <rect x="3" y="16" width="2" height="14" fill="#B7BEC6"/>
          <rect x="23" y="16" width="2" height="14" fill="#B7BEC6"/>
          {/* upright handlebars + console facing viewer */}
          <rect x="5" y="4" width="2" height="12" fill="#9CA3AF" stroke={C} strokeWidth=".3"/>
          <rect x="21" y="4" width="2" height="12" fill="#9CA3AF" stroke={C} strokeWidth=".3"/>
          <rect x="6" y="2" width="16" height="6" rx="1" fill="#475569" stroke={C} strokeWidth=".5"/>
          <rect x="8" y="3" width="12" height="3.5" fill="#0B1A22"/>
          <rect x="9" y="4" width="5" height="1.4" fill="#22D3EE"/>
        </svg>
      </div>
    );
  }

  // ─── ShoulderPulley — 벽 부착 어깨 도르래 운동기 ───────────────────
  function ShoulderPulley({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T + 2, top: y * T, width: T - 4, height: T * 1.6 }}>
        <svg viewBox="0 0 12 26" width={T - 4} height={T * 1.6} shapeRendering="geometricPrecision">
          {/* wall board */}
          <rect x="1" y="0" width="10" height="4" rx=".5" fill="#DCE3E8" stroke={C} strokeWidth=".5"/>
          <circle cx="6" cy="2" r="1.4" fill="#9CA3AF" stroke={C} strokeWidth=".3"/>{/* pulley wheel */}
          {/* two ropes with handles hanging */}
          <line x1="4.5" y1="2.5" x2="4" y2="16" stroke={C} strokeWidth=".5"/>
          <line x1="7.5" y1="2.5" x2="8" y2="12" stroke={C} strokeWidth=".5"/>
          <rect x="3" y="16" width="2.4" height="3" rx="1" fill="#C99F68" stroke={C} strokeWidth=".3"/>
          <rect x="7" y="12" width="2.4" height="3" rx="1" fill="#C99F68" stroke={C} strokeWidth=".3"/>
        </svg>
      </div>
    );
  }

  // ─── ADLKitchen — 일상생활동작(OT) 훈련용 부엌 유닛 ─────────────────
  function ADLKitchen({ x, y, w = 3 }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 4, width: T * w, height: T * 1.9 }}>
        <svg viewBox={`0 0 ${w*16} 30`} width={T * w} height={T * 1.9} shapeRendering="geometricPrecision" preserveAspectRatio="none">
          <ellipse cx={w*8} cy="28" rx={w*7} ry="2" fill="rgba(0,0,0,.14)"/>
          {/* counter top face + front cabinets */}
          <path d={`M2 8 L${w*16-2} 8 L${w*16-2} 25 Q${w*16-2} 26 ${w*16-3} 26 L3 26 Q2 26 2 25 Z`} fill="#CBBFA6" stroke={C} strokeWidth=".6"/>
          <rect x="2" y="8" width={w*16-4} height="5" fill="#E0D6BE"/>{/* worktop */}
          {/* sink + faucet + a training stove dial on top */}
          <rect x="6" y="9" width="8" height="3" rx=".6" fill="#B7BEC6" stroke={C} strokeWidth=".4"/>
          <rect x="9" y="8" width="1.4" height="2" fill="#9CA3AF"/>
          <circle cx={w*16-8} cy="10.5" r="1.8" fill="#5B6672"/>{/* stove eye */}
          <circle cx={w*16-13} cy="10.5" r="1.8" fill="#5B6672"/>
          {/* lower cabinet doors (front) */}
          <line x1={w*16/2} y1="13" x2={w*16/2} y2="25" stroke={C} strokeWidth=".4" opacity=".5"/>
          <rect x="5" y="17" width="3" height="1" fill="#9AA1A8"/>
          <rect x={w*16-8} y="17" width="3" height="1" fill="#9AA1A8"/>
        </svg>
      </div>
    );
  }

  // ─── GymBallRack — 짐볼·운동도구 거치대 ────────────────────────────
  function GymBallRack({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 2, width: T * 1.8, height: T * 1.6 }}>
        <svg viewBox="0 0 28 26" width={T * 1.8} height={T * 1.6} shapeRendering="geometricPrecision">
          <ellipse cx="14" cy="24" rx="11" ry="2" fill="rgba(0,0,0,.14)"/>
          {/* cradle rack */}
          <path d="M2 14 L26 14 L24 22 L4 22 Z" fill="#B7BEC6" stroke={C} strokeWidth=".5"/>
          {/* three gym balls */}
          <circle cx="9" cy="11" r="6" fill="#EF6C6C" stroke={C} strokeWidth=".5"/>
          <circle cx="20" cy="12" r="5" fill="#5A8AC0" stroke={C} strokeWidth=".5"/>
          <circle cx="7" cy="12" r="1.4" fill="#fff" opacity=".5"/>
          <circle cx="18" cy="11" r="1.2" fill="#fff" opacity=".5"/>
        </svg>
      </div>
    );
  }

  Object.assign(window, {
    ParallelBars, TherapyMat, Treadmill, ShoulderPulley, ADLKitchen, GymBallRack,
  });
})();
