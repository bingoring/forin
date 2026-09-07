// interior-objects-cards2.jsx — 순환기·호흡기내과 병동 objects.
// Cardiac/pulmonary ward: telemetry, cardiac chair, wall O2/vent, supplemental
// O2. v2 top-down, single silhouette, ground-contact ellipse shadow.

(function () {
  const C = '#2A2522';
  const T = window.ITILE || 16;

  // ─── TelemetryUnit — 벽 텔레메트리 중앙 수신 모니터 (다환자 파형) ────
  function TelemetryUnit({ x, y, w = 3 }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 6, width: T * w, height: T * 1.6 }}>
        <svg viewBox={`0 0 ${w*16} 26`} width={T * w} height={T * 1.6} shapeRendering="geometricPrecision" preserveAspectRatio="none">
          <rect x={w*8-1} y="0" width="2" height="4" fill="#9CA3AF"/>{/* arm */}
          <rect x="1" y="3" width={w*16-2} height="19" rx="1" fill="#111827" stroke={C} strokeWidth=".7"/>
          <rect x="2.5" y="4.5" width={w*16-5} height="16" fill="#0B1A22"/>
          {/* multi-patient EKG tiles */}
          {[...Array(w)].map((_,i)=>{
            const cx0 = 3.5 + i*((w*16-7)/w);
            const cw = (w*16-7)/w - 1;
            return (<g key={i}>
              <rect x={cx0} y="6" width={cw} height="6.5" fill="#06121A" stroke="#1E3A2A" strokeWidth=".3"/>
              <path d={`M${cx0+1} 9 L${cx0+cw*0.25} 9 L${cx0+cw*0.32} 7 L${cx0+cw*0.4} 11 L${cx0+cw*0.48} 9 L${cx0+cw-1} 9`} fill="none" stroke="#34D399" strokeWidth=".5"/>
              <rect x={cx0} y="13.5" width={cw} height="5.5" fill="#06121A" stroke="#1E3A2A" strokeWidth=".3"/>
              <path d={`M${cx0+1} 16.5 Q${cx0+cw*0.4} 15 ${cx0+cw*0.6} 16.5 T${cx0+cw-1} 16.5`} fill="none" stroke="#22D3EE" strokeWidth=".5"/>
            </g>);
          })}
        </svg>
      </div>
    );
  }

  // ─── CardiacChair — 심장 환자용 기좌 안락의자 (호흡곤란 완화 각도) ───
  function CardiacChair({ x, y, occupied = true }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 4, width: T * 2.2, height: T * 3 }}>
        <svg viewBox="0 0 36 48" width={T * 2.2} height={T * 3} shapeRendering="geometricPrecision">
          <ellipse cx="18" cy="46" rx="14" ry="2.2" fill="rgba(0,0,0,.15)"/>
          {/* seat (big top face) + short front */}
          <path d="M4 20 L32 20 L32 34 Q32 36 30 36 L6 36 Q4 36 4 34 Z" fill="#5A7C8A" stroke={C} strokeWidth=".7"/>
          <rect x="6" y="22" width="24" height="12" rx="2" fill="#7699A6"/>
          {/* tall upright supportive backrest (orthopnea position) at the head */}
          <path d="M4 2 L32 2 Q33 2 33 3 L33 20 L3 20 L3 3 Q3 2 4 2 Z" fill="#5A7C8A" stroke={C} strokeWidth=".7"/>
          <rect x="6" y="4" width="24" height="14" rx="2.5" fill="#7699A6"/>
          <rect x="12" y="3" width="12" height="4" rx="2" fill="#8FB0BC"/>{/* headrest */}
          {/* high armrests both sides */}
          <rect x="1.5" y="20" width="4" height="15" rx="1.5" fill="#48697A" stroke={C} strokeWidth=".5"/>
          <rect x="30.5" y="20" width="4" height="15" rx="1.5" fill="#48697A" stroke={C} strokeWidth=".5"/>
          {/* over-bed tray swung across the front (lean-forward tripod) */}
          <path d="M4 36 L32 36 L32 40 Q32 41 31 41 L5 41 Q4 41 4 40 Z" fill="#C99F68" stroke={C} strokeWidth=".5"/>
          <rect x="6" y="37" width="24" height="2" fill="#DBB884"/>
          {/* seated cardiac patient leaning forward */}
          {occupied && (
            <g>
              <rect x="14.5" y="6" width="7" height="6" rx="2.6" fill="#FBD9C0" stroke={C} strokeWidth=".3"/>
              <rect x="14.8" y="5.1" width="6.4" height="1.6" fill="#5B4636"/>
              <ellipse cx="18" cy="26" rx="8.5" ry="6.5" fill="#8FB0BC" opacity=".5"/>{/* torso/gown */}
            </g>
          )}
        </svg>
      </div>
    );
  }

  // ─── O2FlowStation — 벽면 산소·의료가스 아웃렛 패널 (유량계 + 흡인) ──
  function O2FlowStation({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T + 2, top: y * T, width: T - 4, height: T * 1.3 }}>
        <svg viewBox="0 0 12 18" width={T - 4} height={T * 1.3} shapeRendering="geometricPrecision">
          <ellipse cx="6" cy="17" rx="4.5" ry="1.2" fill="rgba(0,0,0,.12)"/>
          {/* wall gas panel */}
          <rect x="1" y="1" width="10" height="15" rx=".5" fill="#DCE3E8" stroke={C} strokeWidth=".6"/>
          {/* green O2 outlet + flowmeter tube with float ball */}
          <rect x="2.5" y="3" width="2.5" height="8" rx="1" fill="#D7F0E0" stroke={C} strokeWidth=".4"/>
          <circle cx="3.75" cy="7.5" r="0.8" fill="#16A34A"/>{/* float */}
          <circle cx="3.75" cy="12.5" r="1.4" fill="#16A34A" stroke={C} strokeWidth=".3"/>{/* O2 outlet */}
          {/* yellow suction gauge */}
          <circle cx="8.5" cy="5" r="2" fill="#0F1A24" stroke={C} strokeWidth=".4"/>
          <line x1="8.5" y1="5" x2="9.7" y2="3.8" stroke="#FBBF24" strokeWidth=".4"/>
          <circle cx="8.5" cy="12.5" r="1.4" fill="#FBBF24" stroke={C} strokeWidth=".3"/>{/* suction outlet */}
        </svg>
      </div>
    );
  }

  // ─── BiPAPUnit — 비침습 양압 환기 (BiPAP/CPAP, 호흡기내과) ───────────
  function BiPAPUnit({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 4, width: T * 1.3, height: T * 1.8 }}>
        <svg viewBox="0 0 20 28" width={T * 1.3} height={T * 1.8} shapeRendering="geometricPrecision">
          <ellipse cx="10" cy="22.5" rx="8" ry="2" fill="rgba(0,0,0,.16)"/>
          {/* device top + front (continuous) */}
          <path d="M2 8 L18 8 L18 22 Q18 23 17 23 L3 23 Q2 23 2 22 Z" fill="#5B6672" stroke={C} strokeWidth=".6"/>
          <rect x="2" y="8" width="16" height="3" fill="#727E8C"/>
          {/* viewer-facing screen + dial */}
          <rect x="4" y="12" width="8" height="4.5" rx=".5" fill="#0F1A24"/>
          <rect x="4.6" y="13" width="5" height="1" fill="#22D3EE"/>
          <text x="8" y="16" fontSize="2" fill="#A7F3D0" textAnchor="middle" fontFamily="monospace">IPAP</text>
          <circle cx="14.5" cy="14" r="1.8" fill="#CBD5E1" stroke={C} strokeWidth=".3"/>
          {/* heated humidifier + tubing to a mask */}
          <rect x="4" y="17.5" width="6" height="3.5" fill="#BFE3EE" stroke={C} strokeWidth=".3"/>
          <path d="M18 12 Q23 16 19 20" fill="none" stroke="#D4E8F0" strokeWidth="1.3"/>
        </svg>
      </div>
    );
  }

  Object.assign(window, {
    TelemetryUnit, CardiacChair, O2FlowStation, BiPAPUnit,
  });
})();
