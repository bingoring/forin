// interior-objects-er2.jsx — additional ER 2.5D objects for the expanded
// Emergency Room layout (triage / nursing station / critical / isolation /
// exam & procedure). Same v2 pixel style: visible TOP + FRONT + depth, 45°.

(function () {
  const C = '#2A2522';
  const T = window.ITILE || 16;

  // ─── Ticket Dispenser — 번호표 발행기 ──────────────────────────────
  function TicketDispenser({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T + 2, top: y * T - 8, width: T - 4, height: T * 1.6, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.28))' }}>
        <svg viewBox="0 0 12 26" width={T - 4} height={T * 1.6} shapeRendering="geometricPrecision">
          {/* full silhouette */}
          <path d="M1 2 Q0.5 2 0.5 2.6 L0.5 19 Q0.5 19.6 1 19.6 L11 19.6 Q11.5 19.6 11.5 19 L11.5 2.6 Q11.5 2 11 2 Z" fill="#B7BEC6"/>
          {/* big TOP face (high-angle) — plain cabinet top */}
          <path d="M1 2 Q0.5 2 0.5 2.6 L0.5 11 L11.5 11 L11.5 2.6 Q11.5 2 11 2 Z" fill="#D3D8DE"/>
          <rect x="2.5" y="3.4" width="7" height="5.6" rx=".5" fill="#C1C7CE"/>
          {/* seam top → front */}
          <line x1="0.5" y1="11" x2="11.5" y2="11" stroke={C} strokeWidth=".55"/>
          {/* FRONT band — viewer-facing SCREEN + ticket slot */}
          <rect x="2" y="11.8" width="8" height="4" rx=".4" fill="#0F1A24" stroke={C} strokeWidth=".4"/>
          <rect x="3" y="12.6" width="6" height="1.1" fill="#22D3EE"/>
          <rect x="3" y="14.1" width="4" height="1" fill="#FACC15"/>
          <rect x="2" y="16.2" width="8" height="1.4" rx=".3" fill="#1F2937"/>
          <rect x="3.4" y="17.2" width="5" height="2.2" rx=".3" fill="#fff" stroke={C} strokeWidth=".3"/>
          <rect x="4" y="18" width="4" height=".6" fill={C} opacity=".5"/>
          {/* outer outline */}
          <path d="M1 2 Q0.5 2 0.5 2.6 L0.5 19 Q0.5 19.6 1 19.6 L11 19.6 Q11.5 19.6 11.5 19 L11.5 2.6 Q11.5 2 11 2 Z" fill="none" stroke={C} strokeWidth=".65"/>
          {/* pedestal + base */}
          <rect x="4.5" y="19.6" width="3" height="3.4" fill="#6B7280" stroke={C} strokeWidth=".4"/>
          <ellipse cx="6" cy="24" rx="4" ry="1.4" fill="#4B5563"/>
        </svg>
      </div>
    );
  }

  // ─── Brochure Rack — 병원 안내 브로셔 거치대 ───────────────────────
  function BrochureRack({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T + 1, top: y * T - 4, width: T - 2, height: T * 1.4, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.25))' }}>
        <svg viewBox="0 0 14 22" width={T - 2} height={T * 1.4} shapeRendering="crispEdges">
          {/* back board */}
          <rect x="1" y="0" width="12" height="16" fill="#A88862" stroke={C} strokeWidth=".5"/>
          {/* three pockets with pamphlets */}
          {[0,1,2].map(r => (
            <g key={r}>
              <rect x="2" y={1 + r*5} width="10" height="4" fill="#7C5A38" stroke={C} strokeWidth=".3"/>
              <rect x="2.6" y={0.4 + r*5} width="4" height="3" fill={['#F87171','#FACC15','#A7F3D0'][r]} stroke={C} strokeWidth=".3"/>
              <rect x="7" y={0.4 + r*5} width="4" height="3" fill={['#BAE6FD','#FBCFE8','#C4B5FD'][r]} stroke={C} strokeWidth=".3"/>
            </g>
          ))}
          {/* legs */}
          <rect x="3" y="16" width="1.5" height="5" fill="#5C3A1A"/>
          <rect x="9.5" y="16" width="1.5" height="5" fill="#5C3A1A"/>
        </svg>
      </div>
    );
  }

  // ─── Desk Phone — 전화기 ───────────────────────────────────────────
  function DeskPhone({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T + 3, top: y * T + 4, width: T - 6, height: T - 4, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.25))' }}>
        <svg viewBox="0 0 10 10" width={T - 6} height={T - 4} shapeRendering="crispEdges">
          {/* base top */}
          <path d="M1 3 L9 3 L9.5 4 L.5 4 Z" fill="#4B5563" stroke={C} strokeWidth=".3"/>
          <rect x="1" y="4" width="8" height="5" fill="#374151" stroke={C} strokeWidth=".4"/>
          {/* keypad */}
          <rect x="2" y="5" width="4" height="3.5" fill="#1F2937"/>
          {[0,1].map(r=>[0,1,2].map(c=>(
            <rect key={r+'-'+c} x={2.4+c*1.3} y={5.3+r*1.5} width=".9" height=".9" fill="#9CA3AF"/>
          )))}
          {/* handset on cradle */}
          <rect x="6.5" y="1" width="2" height="8" fill="#111827" stroke={C} strokeWidth=".4"/>
          <rect x="6.2" y="1" width="2.6" height="1.6" fill="#1F2937" stroke={C} strokeWidth=".3"/>
          <rect x="6.2" y="7.4" width="2.6" height="1.6" fill="#1F2937" stroke={C} strokeWidth=".3"/>
          {/* coil cord */}
          <path d="M1 6 q-1 1 0 2 q1 1 0 1.5" fill="none" stroke={C} strokeWidth=".4"/>
        </svg>
      </div>
    );
  }

  // ─── Vitals Cart — 활력징후 측정 카트 (SpO2 + 체온계 + 모니터) ──────
  function VitalsCart({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T + 1, top: y * T - 6, width: T - 2, height: T * 2.1, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.28))' }}>
        <svg viewBox="0 0 14 34" width={T - 2} height={T * 2.1} shapeRendering="geometricPrecision">
          {/* full silhouette: monitor head (top) → viewer-facing screen → pole/base */}
          {/* FAR top face — monitor casing top + hanging SpO2 probe */}
          <path d="M2 1 Q1 1 1 2 L1 6 L13 6 L13 2 Q13 1 12 1 Z" fill="#B7BEC6" stroke={C} strokeWidth=".45"/>
          <path d="M13 4 q3 4 1 9" fill="none" stroke={C} strokeWidth=".5"/>
          <rect x="12.6" y="12.4" width="2.6" height="2.4" rx=".6" fill="#EF4444" stroke={C} strokeWidth=".3"/>
          {/* seam top → screen panel */}
          <line x1="1" y1="6" x2="13" y2="6" stroke={C} strokeWidth=".55"/>
          {/* NEAR viewer-facing SCREEN panel */}
          <rect x="1" y="6" width="12" height="9" fill="#374151" stroke={C} strokeWidth=".5"/>
          <rect x="2" y="7" width="10" height="7" rx=".5" fill="#0F1A24"/>
          <text x="4.4" y="10" fontSize="2.6" fill="#22D3EE" textAnchor="middle" fontFamily="monospace">98</text>
          <text x="9.4" y="10" fontSize="2.2" fill="#FACC15" textAnchor="middle" fontFamily="monospace">36.5</text>
          <path d="M2.4 12.4 L4 12.4 L4.8 10.8 L5.6 13.4 L6.4 11.4 L7.2 12.4 L11.6 12.4" fill="none" stroke="#10B981" strokeWidth=".55"/>
          {/* pole */}
          <rect x="6" y="15" width="2" height="7" fill="#9CA3AF" stroke={C} strokeWidth=".4"/>
          {/* supply basket (top face) with thermometer */}
          <path d="M2 21 L12 21 L11.4 25 L2.6 25 Z" fill="#CBD5E1" stroke={C} strokeWidth=".45"/>
          <rect x="3.2" y="21.6" width="5" height="1.5" rx=".4" fill="#fff" stroke={C} strokeWidth=".3"/>
          <rect x="3.5" y="21.9" width="1" height="1" fill="#EF4444"/>
          {/* wheeled base */}
          <rect x="3" y="25" width="8" height="2.4" rx=".5" fill="#6B7280" stroke={C} strokeWidth=".4"/>
          <ellipse cx="4.5" cy="28.6" rx="1.8" ry="1.3" fill="#2C3239"/>
          <ellipse cx="9.5" cy="28.6" rx="1.8" ry="1.3" fill="#2C3239"/>
        </svg>
      </div>
    );
  }

  // ─── Waiting Display — 대기 순서 안내 모니터 (벽걸이) ────────────────
  function WaitingDisplay({ x, y, w = 2 }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T, width: T * w, height: T - 2, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.25))' }}>
        <svg viewBox={`0 0 ${w*16} 14`} width={T * w} height={T - 2} shapeRendering="crispEdges" preserveAspectRatio="none">
          {/* bezel */}
          <rect x="0" y="0" width={w*16} height="14" fill="#1F2937" stroke={C} strokeWidth=".6"/>
          {/* screen */}
          <rect x="1.5" y="1.5" width={w*16-3} height="11" fill="#0B2A3A"/>
          {/* header bar */}
          <rect x="1.5" y="1.5" width={w*16-3} height="3" fill="#DC2626"/>
          <rect x="3" y="2.3" width="10" height="1.4" fill="#fff"/>
          {/* now-serving big number */}
          <rect x="3" y="6" width="7" height="5" fill="#FACC15"/>
          {/* queue rows */}
          <rect x={w*16-13} y="6" width="10" height="1.2" fill="#22D3EE"/>
          <rect x={w*16-13} y="8" width="10" height="1.2" fill="#94A3B8"/>
          <rect x={w*16-13} y="10" width="7" height="1.2" fill="#94A3B8"/>
        </svg>
      </div>
    );
  }

  // ─── Water Cooler — 정수기 ─────────────────────────────────────────
  function WaterCooler({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T + 3, top: y * T - 6, width: T - 6, height: T * 1.5, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.26))' }}>
        <svg viewBox="0 0 10 24" width={T - 6} height={T * 1.5} shapeRendering="geometricPrecision">
          {/* full silhouette */}
          <path d="M1.5 5 Q1 5 1 5.6 L1 21 Q1 21.5 1.5 21.5 L8.5 21.5 Q9 21.5 9 21 L9 5.6 Q9 5 8.5 5 Z" fill="#D1D5DB"/>
          {/* TOP face — dispenser cabinet top (a cylinder bottle stands ON it) */}
          <path d="M1.5 5 Q1 5 1 5.6 L1 12 L9 12 L9 5.6 Q9 5 8.5 5 Z" fill="#EDEFF2"/>
          {/* WATER BOTTLE as an upright CYLINDER sitting on top (larger, lower) */}
          <ellipse cx="5" cy="3.2" rx="3.2" ry="1.2" fill="#CDEAF3" stroke={C} strokeWidth=".35"/>
          <path d="M1.8 3.2 L1.8 8.4 Q1.8 9.6 5 9.6 Q8.2 9.6 8.2 8.4 L8.2 3.2" fill="#A8DCEC" stroke={C} strokeWidth=".4"/>
          <rect x="2.6" y="4" width="1.2" height="4.4" fill="#CDEAF3" opacity=".7"/>{/* highlight */}
          <ellipse cx="5" cy="9" rx="1.7" ry=".8" fill="#3B82F6"/>{/* neck/cap into cooler */}
          {/* seam top → front */}
          <line x1="1" y1="12" x2="9" y2="12" stroke={C} strokeWidth=".5"/>
          {/* FRONT band — taps (hot/cold) + drip tray + cup */}
          <rect x="2.6" y="13.2" width="1.6" height="2" rx=".3" fill="#EF4444" stroke={C} strokeWidth=".3"/>
          <rect x="5.8" y="13.2" width="1.6" height="2" rx=".3" fill="#3B82F6" stroke={C} strokeWidth=".3"/>
          <rect x="2.6" y="16" width="4.8" height="1.4" rx=".3" fill="#9CA3AF" stroke={C} strokeWidth=".3"/>
          <path d="M3.6 17.6 L6.4 17.6 L6 20 L4 20 Z" fill="#fff" stroke={C} strokeWidth=".3"/>
          {/* outer outline */}
          <path d="M1.5 5 Q1 5 1 5.6 L1 21 Q1 21.5 1.5 21.5 L8.5 21.5 Q9 21.5 9 21 L9 5.6 Q9 5 8.5 5 Z" fill="none" stroke={C} strokeWidth=".6"/>
        </svg>
      </div>
    );
  }

  // ─── Chart Binder Stack — 인계장 서류첩 ────────────────────────────
  function ChartBinder({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T + 2, top: y * T + 2, width: T - 4, height: T - 2, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.24))' }}>
        <svg viewBox="0 0 12 12" width={T - 4} height={T - 2} shapeRendering="crispEdges">
          {/* three stacked ring binders seen at angle */}
          {[0,1,2].map(i => (
            <g key={i}>
              <path d={`M1 ${8-i*2.4} L11 ${8-i*2.4} L11 ${10-i*2.4} L1 ${10-i*2.4} Z`} fill={['#3B82F6','#EF4444','#16A34A'][i]} stroke={C} strokeWidth=".4"/>
              {/* spine rings */}
              <rect x="2" y={8.4-i*2.4} width="8" height=".5" fill="#fff" opacity=".7"/>
              <rect x="3" y={8-i*2.4} width=".8" height="2" fill="#1F2937" opacity=".5"/>
              <rect x="8" y={8-i*2.4} width=".8" height="2" fill="#1F2937" opacity=".5"/>
            </g>
          ))}
        </svg>
      </div>
    );
  }

  // ─── IV Pump — 인퓨전 펌프 달린 IV 폴대 ────────────────────────────
  function IVPump({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 22, width: T, height: T * 2.8, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.28))' }}>
        <svg viewBox="0 0 16 46" width={T} height={T * 2.8} shapeRendering="crispEdges">
          {/* hook */}
          <rect x="6" y="0" width="5" height="2" fill="#9CA3AF" stroke={C} strokeWidth=".4"/>
          <rect x="6" y="0" width="2" height="4" fill="#9CA3AF" stroke={C} strokeWidth=".4"/>
          {/* IV bag */}
          <rect x="4" y="4" width="8" height="9" fill="#A8DCEC" stroke={C} strokeWidth=".5"/>
          <rect x="5" y="5" width="6" height="1" fill="#D4F0F8"/>
          <rect x="5" y="6.5" width="6" height="4" fill="#7DBFD9"/>
          <rect x="5" y="11" width="6" height="1.5" fill="#fff"/>
          {/* pole */}
          <rect x="7" y="13" width="2" height="9" fill="#CBD5E1" stroke={C} strokeWidth=".4"/>
          {/* PUMP box mounted on pole — larger top face (higher angle) + viewer-facing screen */}
          <path d="M2 19 L14 19 L14 23.5 L2 23.5 Z" fill="#5B6672" stroke={C} strokeWidth=".45"/>
          <rect x="3" y="20" width="5" height="2.6" rx=".4" fill="#3A424B"/>{/* top vent */}
          <line x1="2" y1="23.5" x2="14" y2="23.5" stroke={C} strokeWidth=".5"/>
          <rect x="2" y="23.5" width="12" height="8.5" fill="#475569" stroke={C} strokeWidth=".6"/>
          <rect x="3" y="24.4" width="10" height="3.6" rx=".4" fill="#0F1A24"/>
          <rect x="4" y="25.2" width="5" height="1.2" fill="#22D3EE"/>
          <rect x="4" y="26.8" width="3" height="1" fill="#10B981"/>
          {/* buttons */}
          <rect x="3.5" y="29" width="2" height="2" rx=".4" fill="#10B981" stroke={C} strokeWidth=".3"/>
          <rect x="6.5" y="29" width="2" height="2" rx=".4" fill="#EF4444" stroke={C} strokeWidth=".3"/>
          <rect x="9.5" y="29" width="2.5" height="2" rx=".4" fill="#9CA3AF" stroke={C} strokeWidth=".3"/>
          {/* lower pole */}
          <rect x="7" y="31" width="2" height="8" fill="#CBD5E1" stroke={C} strokeWidth=".4"/>
          {/* spider base */}
          <ellipse cx="8" cy="40" rx="6" ry="2" fill="#6B7280" stroke={C} strokeWidth=".4"/>
          <ellipse cx="3" cy="42" rx="1.4" ry="1" fill={C}/>
          <ellipse cx="13" cy="42" rx="1.4" ry="1" fill={C}/>
          <ellipse cx="8" cy="43" rx="1.4" ry="1" fill={C}/>
        </svg>
      </div>
    );
  }

  // ─── Waste Bin — 의료폐기물 함 (tone: 'general' | 'infectious') ─────
  function WasteBin({ x, y, tone = 'general' }) {
    const infectious = tone === 'infectious';
    const body = infectious ? '#FACC15' : '#CBD5E1';
    const bodyDk = infectious ? '#CA8A04' : '#94A3B8';
    const lid = infectious ? '#EAB308' : '#9CA3AF';
    return (
      <div style={{ position: 'absolute', left: x * T + 3, top: y * T, width: T - 6, height: T * 1.3, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.26))' }}>
        <svg viewBox="0 0 10 18" width={T - 6} height={T * 1.3} shapeRendering="crispEdges">
          {/* pedal lid top */}
          <ellipse cx="5" cy="3" rx="4.5" ry="1.6" fill={lid} stroke={C} strokeWidth=".4"/>
          <rect x="0.5" y="3" width="9" height="2" fill={lid}/>
          {/* body */}
          <path d="M1 5 L9 5 L8.3 15 L1.7 15 Z" fill={body} stroke={C} strokeWidth=".5"/>
          <path d="M5.5 5 L9 5 L8.3 15 L5 15 Z" fill={bodyDk} opacity=".4"/>
          {/* biohazard / label */}
          {infectious
            ? <text x="5" y="11.5" fontSize="5" fill={C} textAnchor="middle" fontFamily="monospace">☣</text>
            : <rect x="3" y="8" width="4" height="3" fill="#fff" stroke={C} strokeWidth=".3"/>}
          {/* pedal */}
          <rect x="1" y="15.5" width="3" height="1.5" fill="#6B7280" stroke={C} strokeWidth=".3"/>
        </svg>
      </div>
    );
  }

  // ─── Pressure Gauge — 음압 수치 표시기 (벽걸이) ────────────────────
  function PressureGauge({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T + 2, top: y * T + 1, width: T - 4, height: T - 2, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.24))' }}>
        <svg viewBox="0 0 12 12" width={T - 4} height={T - 2} shapeRendering="crispEdges">
          {/* casing */}
          <rect x="0" y="0" width="12" height="12" fill="#E5E7EB" stroke={C} strokeWidth=".6"/>
          {/* screen */}
          <rect x="1.5" y="1.5" width="9" height="6" fill="#0B2A3A" stroke={C} strokeWidth=".4"/>
          {/* negative pressure number (cyan) */}
          <rect x="2.5" y="2.5" width="6" height="2" fill="#22D3EE"/>
          {/* down arrow (negative) */}
          <path d="M9 2.5 L10.5 2.5 L9.75 4 Z" fill="#22D3EE"/>
          {/* Pa unit dashes */}
          <rect x="2.5" y="5.5" width="5" height="1" fill="#10B981"/>
          {/* status light + label NEG */}
          <circle cx="2.5" cy="9.5" r="1" fill="#10B981" stroke={C} strokeWidth=".3"/>
          <rect x="4.5" y="8.8" width="6" height="2" fill="#16A34A"/>
        </svg>
      </div>
    );
  }

  // ─── PPE Stand — 방호복(레벨 D) 거치대 + 마스크/장갑 박스 ──────────
  function PPEStand({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T + 1, top: y * T - 8, width: T - 2, height: T * 2.1, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.26))' }}>
        <svg viewBox="0 0 14 34" width={T - 2} height={T * 2.1} shapeRendering="crispEdges">
          {/* rail top */}
          <rect x="1" y="2" width="12" height="1.5" fill="#9CA3AF" stroke={C} strokeWidth=".4"/>
          <rect x="6.5" y="0" width="1" height="3" fill="#6B7280"/>
          {/* hanger + gown (level D coverall, white/yellow) */}
          <rect x="6" y="3" width="2" height="1" fill="#374151"/>
          <path d="M3 4 L11 4 L12 8 L9.5 8 L9.5 20 L4.5 20 L4.5 8 L2 8 Z" fill="#FEFCE8" stroke={C} strokeWidth=".5"/>
          {/* hood + zipper */}
          <rect x="6" y="4" width="2" height="3" fill="#FEF9C3" stroke={C} strokeWidth=".3"/>
          <rect x="6.7" y="7" width=".6" height="12" fill="#CA8A04"/>
          {/* mask/glove box at base — top face + front */}
          <path d="M2.6 21 L12 21 L12.8 22.4 L1.8 22.4 Z" fill="#5FA0D8" stroke={C} strokeWidth=".45"/>
          <rect x="2" y="22.4" width="10" height="5.6" fill="#3B82F6" stroke={C} strokeWidth=".5"/>
          <rect x="3" y="23.4" width="8" height="2.5" rx=".3" fill="#fff"/>
          <rect x="3.5" y="23.9" width="3" height="1.5" fill="#A5D8E8"/>
          {/* legs */}
          <rect x="3" y="28" width="1.5" height="4" fill="#6B7280"/>
          <rect x="9.5" y="28" width="1.5" height="4" fill="#6B7280"/>
        </svg>
      </div>
    );
  }

  // ─── Otoscope / Wall Diagnostic Set — 벽걸이 이경 진단세트 ──────────
  function Otoscope({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T + 2, top: y * T + 1, width: T - 4, height: T, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.22))' }}>
        <svg viewBox="0 0 12 14" width={T - 4} height={T} shapeRendering="crispEdges">
          {/* wall plate */}
          <rect x="0" y="0" width="12" height="14" fill="#D6CFB8" stroke={C} strokeWidth=".5"/>
          {/* otoscope head unit (left) */}
          <rect x="1.5" y="2" width="4" height="4" fill="#1F2937" stroke={C} strokeWidth=".4"/>
          <path d="M2 6 L5 6 L4 9 L3 9 Z" fill="#374151" stroke={C} strokeWidth=".3"/>
          <path d="M3 9 L4 9 L3.6 11 L3.4 11 Z" fill="#FACC15"/>
          {/* ophthalmoscope unit (right) */}
          <rect x="6.5" y="2" width="4" height="4" fill="#1F2937" stroke={C} strokeWidth=".4"/>
          <circle cx="8.5" cy="7.5" r="1.6" fill="#374151" stroke={C} strokeWidth=".3"/>
          <circle cx="8.5" cy="7.5" r=".6" fill="#FACC15"/>
          {/* charger base */}
          <rect x="1" y="11.5" width="10" height="2" fill="#9CA3AF" stroke={C} strokeWidth=".4"/>
        </svg>
      </div>
    );
  }

  // ─── Anatomy Poster — 신체 구조도 포스터 (벽) ──────────────────────
  function AnatomyPoster({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T + 1, top: y * T, width: T - 2, height: T * 1.4, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.2))' }}>
        <svg viewBox="0 0 14 22" width={T - 2} height={T * 1.4} shapeRendering="crispEdges">
          {/* frame */}
          <rect x="0" y="0" width="14" height="22" fill="#fff" stroke={C} strokeWidth=".6"/>
          <rect x="1" y="1" width="12" height="20" fill="#FDEBE0"/>
          {/* body figure */}
          <circle cx="7" cy="4.5" r="2" fill="#F4B89A" stroke={C} strokeWidth=".3"/>
          <rect x="5" y="6.5" width="4" height="7" fill="#F4B89A" stroke={C} strokeWidth=".3"/>
          {/* ribcage lines */}
          <rect x="5.5" y="7.5" width="3" height=".5" fill="#C4705A"/>
          <rect x="5.5" y="8.8" width="3" height=".5" fill="#C4705A"/>
          <rect x="5.5" y="10.1" width="3" height=".5" fill="#C4705A"/>
          {/* heart dot */}
          <rect x="6" y="8" width="1.2" height="1.2" fill="#DC2626"/>
          {/* arms */}
          <rect x="3" y="7" width="1.5" height="5" fill="#F4B89A" stroke={C} strokeWidth=".3"/>
          <rect x="9.5" y="7" width="1.5" height="5" fill="#F4B89A" stroke={C} strokeWidth=".3"/>
          {/* legs */}
          <rect x="5.2" y="13.5" width="1.5" height="6" fill="#F4B89A" stroke={C} strokeWidth=".3"/>
          <rect x="7.3" y="13.5" width="1.5" height="6" fill="#F4B89A" stroke={C} strokeWidth=".3"/>
          {/* caption bar */}
          <rect x="1" y="20" width="12" height="1" fill="#3B82F6"/>
        </svg>
      </div>
    );
  }

  // ─── Dressing Cart — 드레싱 카트 (베타딘·거즈·멸균장갑) ─────────────
  function DressingCart({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 4, width: T * 1.4, height: T * 1.8, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.26))' }}>
        <svg viewBox="0 0 22 30" width={T * 1.4} height={T * 1.8} shapeRendering="geometricPrecision">
          {/* full silhouette */}
          <path d="M2 2 Q1 2 1 3 L1 24 Q1 25 2 25 L20 25 Q21 25 21 24 L21 3 Q21 2 20 2 Z" fill="#AEB4BC"/>
          {/* TOP tray face — supplies seen from above */}
          <path d="M2 2 Q1 2 1 3 L1 13 L21 13 L21 3 Q21 2 20 2 Z" fill="#E1E5EA"/>
          <ellipse cx="5" cy="4.2" rx="1.7" ry="1" fill="#92400E" stroke={C} strokeWidth=".3"/>{/* betadine cap */}
          <rect x="3.6" y="4.2" width="2.8" height="4.6" rx=".4" fill="#B45309" stroke={C} strokeWidth=".35"/>
          <rect x="8.5" y="4" width="4.4" height="4.6" rx=".4" fill="#fff" stroke={C} strokeWidth=".35"/>{/* gauze */}
          <line x1="8.5" y1="5.6" x2="12.9" y2="5.6" stroke="#D6DCE2" strokeWidth=".5"/>
          <line x1="8.5" y1="7" x2="12.9" y2="7" stroke="#D6DCE2" strokeWidth=".5"/>
          <rect x="14.5" y="4" width="4.6" height="4.6" rx=".4" fill="#A5D8E8" stroke={C} strokeWidth=".35"/>{/* glove pouch */}
          <rect x="15" y="4.6" width="3.4" height="1.2" fill="#fff" opacity=".6"/>
          <ellipse cx="7" cy="11" rx="3.4" ry="1.4" fill="#E5E7EB" stroke={C} strokeWidth=".35"/>{/* kidney dish */}
          <rect x="12" y="10.2" width="6" height="1.4" rx=".5" fill="#9CA3AF"/>{/* instrument */}
          {/* seam top → front */}
          <line x1="1" y1="13" x2="21" y2="13" stroke={C} strokeWidth=".55"/>
          {/* FRONT band — two drawers */}
          <rect x="2.5" y="14.2" width="17" height="4" rx=".4" fill="#C6C2B6" stroke={C} strokeWidth=".4"/>
          <rect x="9" y="15.6" width="4" height="1.2" fill="#8A8577"/>
          <rect x="2.5" y="19" width="17" height="4" rx=".4" fill="#C6C2B6" stroke={C} strokeWidth=".4"/>
          <rect x="9" y="20.4" width="4" height="1.2" fill="#8A8577"/>
          {/* outer outline */}
          <path d="M2 2 Q1 2 1 3 L1 24 Q1 25 2 25 L20 25 Q21 25 21 24 L21 3 Q21 2 20 2 Z" fill="none" stroke={C} strokeWidth=".65"/>
          {/* wheels */}
          <ellipse cx="4.5" cy="26.5" rx="2" ry="1.4" fill="#2C3239"/>
          <ellipse cx="17.5" cy="26.5" rx="2" ry="1.4" fill="#2C3239"/>
        </svg>
      </div>
    );
  }

  // ─── Triage Floor Line — 중증도 안내 바닥선 (red/yellow/green) ──────
  // Horizontal or vertical colored guide line painted on the floor.
  function TriageLine({ x, y, w = 1, h = 1, color = '#EF4444' }) {
    return (
      <div style={{
        position: 'absolute', left: x * T, top: y * T, width: w * T, height: h * T,
        pointerEvents: 'none',
      }}>
        <div style={{
          position: 'absolute',
          ...(w >= h
            ? { left: 2, right: 2, top: '50%', height: 4, transform: 'translateY(-50%)' }
            : { top: 2, bottom: 2, left: '50%', width: 4, transform: 'translateX(-50%)' }),
          background: color, border: `1px solid ${C}55`,
          boxShadow: `0 0 0 1px ${color}55`,
        }}/>
      </div>
    );
  }

  Object.assign(window, {
    TicketDispenser, BrochureRack, DeskPhone, VitalsCart, WaitingDisplay,
    WaterCooler, ChartBinder, IVPump, WasteBin, PressureGauge, PPEStand,
    Otoscope, AnatomyPoster, DressingCart, TriageLine,
  });
})();
