// interior-objects-er3.jsx — Emergency Medical Center additions for the
// blueprint rebuild: lobby security, central-hub pharmacy, psychiatric safe
// room, family quiet room, and the external decontamination room.
// Same v2 pixel style as the other interior-objects files: visible TOP + FRONT
// + side depth, viewed from a 45° upper-front angle. Tile-based coords.

(function () {
  const C = '#2A2522';
  const T = window.ITILE || 16;

  // ─── IThreshold — open doorway (NO door leaf) ──────────────────────
  // The user disliked the flat "horizontal" door look between zones. This
  // paints a dark floor opening in a wall gap to read as "a passage into a
  // different zone" without drawing a physical door.
  function IThreshold({ x, y, w = 1, h = 1, label, tone }) {
    const vertical = h > w;
    const fill = tone === 'sterile' ? '#16384A' : '#1A1712';
    const sill = tone === 'sterile' ? '#3E7C9A' : '#5C5648';
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T, width: w * T, height: h * T }}>
        {/* dark threshold floor */}
        <div style={{ position: 'absolute', inset: 0, background: fill,
          backgroundImage: `repeating-linear-gradient(${vertical ? '180deg' : '90deg'}, #000 0 1px, transparent 1px ${T/2}px)` }}/>
        {/* jamb shadows on the two wall sides */}
        {vertical ? (
          <>
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, background: '#000', opacity: .55 }}/>
            <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 2, background: '#000', opacity: .55 }}/>
          </>
        ) : (
          <>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: '#000', opacity: .55 }}/>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: '#000', opacity: .55 }}/>
          </>
        )}
        {/* threshold strip on the floor (metal sill) */}
        <div style={{ position: 'absolute', ...(vertical
          ? { left: 1, right: 1, top: '50%', height: 2, transform: 'translateY(-50%)' }
          : { top: 1, bottom: 1, left: '50%', width: 2, transform: 'translateX(-50%)' }),
          background: sill }}/>
        {label && (
          <div style={{ position: 'absolute', left: '50%', top: -12, transform: 'translateX(-50%)',
            background: '#fff', border: `1.5px solid ${C}`, padding: '0 4px',
            fontFamily: '"DungGeunMo",monospace', fontSize: 7, color: C, whiteSpace: 'nowrap',
            boxShadow: `1.5px 1.5px 0 0 ${C}`, zIndex: 5 }}>{label}</div>
        )}
      </div>
    );
  }

  // ─── SecurityScanner — X-ray 보안 검색대 (가방 벨트라인) ────────────
  function SecurityScanner({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 4, width: T * 2, height: T * 1.6 }}>
        <svg viewBox="0 0 32 26" width={T * 2} height={T * 1.6} shapeRendering="geometricPrecision">
          <ellipse cx="16.0" cy="23.3" rx="10.9" ry="3.7" fill="rgba(0,0,0,.16)"/>
          {/* SCANNER TUNNEL (left) — top face + front with mouth */}
          <path d="M2 4 Q1 4 1 5 L1 16 Q1 17 2 17 L13 17 Q14 17 14 16 L14 5 Q14 4 13 4 Z" fill="#5B6672"/>
          <path d="M2 4 Q1 4 1 5 L1 10 L14 10 L14 5 Q14 4 13 4 Z" fill="#8A929B"/>
          <rect x="10" y="5.4" width="3" height="3.4" rx=".4" fill="#0F1A24"/>
          <rect x="10.4" y="5.9" width="2.2" height="1" fill="#F59E0B"/>
          {/* tunnel mouth on the front */}
          <rect x="2.5" y="11" width="6.5" height="5" rx=".4" fill="#0B2A3A" stroke={C} strokeWidth=".4"/>
          {[0,1,2,3].map(i => <rect key={i} x={2.9 + i*1.5} y="11.3" width="1.05" height="4.4" fill="#0B1C26"/>)}
          <path d="M2 4 Q1 4 1 5 L1 16 Q1 17 2 17 L13 17 Q14 17 14 16 L14 5 Q14 4 13 4 Z" fill="none" stroke={C} strokeWidth=".6"/>
          {/* BELT LINE (right) — top belt surface + thin front edge */}
          <path d="M14 8 L31 8 L31 15 L14 15 Z" fill="#6B7280" stroke={C} strokeWidth=".45"/>
          {[16.5,20,23.5,27,30].map((rx,i) => <line key={i} x1={rx} y1="8" x2={rx} y2="15" stroke="#565E66" strokeWidth=".5"/>)}
          <rect x="14" y="15" width="17" height="1.8" fill="#4B5563" stroke={C} strokeWidth=".4"/>
          {/* a tray + bag riding on the belt (top-down) */}
          <rect x="22" y="9.5" width="7" height="4" rx=".5" fill="#1F2937" stroke={C} strokeWidth=".4"/>
          <ellipse cx="25.5" cy="11.5" rx="2.6" ry="1.6" fill="#7C3F00" stroke={C} strokeWidth=".4"/>
          {/* legs */}
          <ellipse cx="3" cy="18" rx="1.6" ry="1.1" fill="#2C3239"/>
          <ellipse cx="12" cy="18" rx="1.6" ry="1.1" fill="#2C3239"/>
          <ellipse cx="17" cy="17" rx="1.4" ry="1" fill="#2C3239"/>
          <ellipse cx="29" cy="17" rx="1.4" ry="1" fill="#2C3239"/>
        </svg>
      </div>
    );
  }

  // ─── MetalDetector — 금속 탐지 게이트 (walk-through, blinks) ─────────
  function MetalDetector({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 10, width: T * 2, height: T * 2 }}>
        <svg viewBox="0 0 32 32" width={T * 2} height={T * 2} shapeRendering="geometricPrecision">
          <ellipse cx="16.0" cy="29.3" rx="10.9" ry="3.7" fill="rgba(0,0,0,.16)"/>
          {/* floor footprint (walk-through opening seen from above) */}
          <path d="M4 20 L28 20 L26 30 L6 30 Z" fill="#0F1A24" opacity=".14"/>
          {/* LEFT pillar — top cap (parallelogram) + front face */}
          <path d="M2 6 L9 6 L10.5 9 L3.5 9 Z" fill="#EDEFF2" stroke={C} strokeWidth=".5"/>
          <rect x="3.5" y="9" width="7" height="19" fill="#D3D8DE" stroke={C} strokeWidth=".5"/>
          <rect x="4.2" y="9.6" width="1.4" height="17.6" fill="#EDEFF2"/>
          <rect x="6" y="12" width="3" height="2.6" rx=".4" fill="#10B981" stroke={C} strokeWidth=".3"/>
          <rect x="6" y="15.4" width="3" height="2.6" rx=".4" fill="#334155" stroke={C} strokeWidth=".3"/>
          {/* RIGHT pillar */}
          <path d="M23 6 L30 6 L31.5 9 L24.5 9 Z" fill="#EDEFF2" stroke={C} strokeWidth=".5"/>
          <rect x="24.5" y="9" width="7" height="19" fill="#D3D8DE" stroke={C} strokeWidth=".5"/>
          <rect x="25.2" y="9.6" width="1.4" height="17.6" fill="#EDEFF2"/>
          {/* TOP lintel — top face slab + thin front band */}
          <path d="M2 2 L30 2 L28.5 5 L3.5 5 Z" fill="#DDE1E6" stroke={C} strokeWidth=".5"/>
          <path d="M3.5 5 L28.5 5 L28.5 7 L3.5 7 Z" fill="#B7BEC6" stroke={C} strokeWidth=".45"/>
          <circle cx="16" cy="3.4" r="1.4" fill="#EF4444" stroke={C} strokeWidth=".3"/>
          {/* feet */}
          <ellipse cx="6.5" cy="29" rx="2.4" ry="1.2" fill="#5B6672"/>
          <ellipse cx="27.5" cy="29" rx="2.4" ry="1.2" fill="#5B6672"/>
        </svg>
        <div style={{ position: 'absolute', left: '50%', top: 1, transform: 'translateX(-50%)', width: 4, height: 4, background: '#EF4444', borderRadius: '50%', animation: 'forinBlink 1s steps(2,end) infinite' }}/>
      </div>
    );
  }

  // ─── BarcodePrinter — 바코드/라벨 프린터 (접수) ────────────────────
  function BarcodePrinter({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T + 3, top: y * T + 2, width: T - 6, height: T - 4 }}>
        <svg viewBox="0 0 10 10" width={T - 6} height={T - 4} shapeRendering="crispEdges">
          <ellipse cx="5.0" cy="9.0" rx="3.4" ry="2" fill="rgba(0,0,0,.16)"/>
          <path d="M1 2 L9 2 L9.5 3 L.5 3 Z" fill="#4B5563" stroke={C} strokeWidth=".3"/>
          <rect x="1" y="3" width="8" height="5" fill="#374151" stroke={C} strokeWidth=".4"/>
          {/* slot + printed label peeking */}
          <rect x="2" y="3.5" width="6" height="1.2" fill="#0F1A24"/>
          <rect x="2.5" y="4.5" width="5" height="2.5" fill="#fff" stroke={C} strokeWidth=".3"/>
          {/* barcode lines */}
          {[0,1,2,3,4].map(i => <rect key={i} x={3 + i*0.9} y="5" width=".4" height="1.6" fill={C}/>)}
          {/* green ready light */}
          <rect x="7" y="6" width="1" height="1" fill="#10B981"/>
        </svg>
      </div>
    );
  }

  // ─── WallTV — 벽걸이 TV (뉴스 재생) ───────────────────────────────
  function WallTV({ x, y, w = 2 }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T, width: T * w, height: T - 2 }}>
        <svg viewBox={`0 0 ${w*16} 14`} width={T * w} height={T - 2} shapeRendering="crispEdges" preserveAspectRatio="none">
          <rect x="0" y="0" width={w*16} height="14" fill="#111827" stroke={C} strokeWidth=".6"/>
          <rect x="1.5" y="1.5" width={w*16-3} height="11" fill="#1E3A5F"/>
          {/* news scene */}
          <rect x="2.5" y="2.5" width={w*16-5} height="5" fill="#3B6CA8"/>
          <rect x="3.5" y="3.5" width="4" height="3" fill="#FDE1C8"/>{/* anchor */}
          <rect x="4" y="3.3" width="3" height="1" fill="#4B2E18"/>
          {/* lower-third banner */}
          <rect x="2.5" y="8.5" width={w*16-5} height="2" fill="#DC2626"/>
          <rect x="3.2" y="9" width={w*8} height="1" fill="#fff"/>
          {/* ticker */}
          <rect x="2.5" y="10.8" width={w*16-5} height="1.4" fill="#0B2A3A"/>
          <rect x="3.2" y="11.2" width={w*10} height=".7" fill="#FACC15"/>
        </svg>
      </div>
    );
  }

  // ─── MedFridge — 의약품 냉장고 (투명 유리문 + 약병/백신) ───────────
  function MedFridge({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T + 1, top: y * T - 6, width: T - 2, height: T * 1.8 }}>
        <svg viewBox="0 0 14 30" width={T - 2} height={T * 1.8} shapeRendering="geometricPrecision">
          <ellipse cx="7.0" cy="29.0" rx="4.8" ry="2" fill="rgba(0,0,0,.16)"/>
          {/* full silhouette */}
          <path d="M1 2 Q0.5 2 0.5 2.6 L0.5 27 Q0.5 27.6 1 27.6 L13 27.6 Q13.5 27.6 13.5 27 L13.5 2.6 Q13.5 2 13 2 Z" fill="#C1C7CE"/>
          {/* TOP face (high angle) + temp display */}
          <path d="M1 2 Q0.5 2 0.5 2.6 L0.5 9 L13.5 9 L13.5 2.6 Q13.5 2 13 2 Z" fill="#D8DDE2"/>
          <rect x="8" y="3.4" width="4" height="1.8" rx=".3" fill="#0B2A3A"/>
          <rect x="8.5" y="3.8" width="2.6" height="1" fill="#22D3EE"/>
          {/* seam top → door */}
          <line x1="0.5" y1="9" x2="13.5" y2="9" stroke={C} strokeWidth=".55"/>
          {/* FRONT glass door — shelves of vials */}
          <rect x="1.5" y="10" width="11" height="16.4" rx=".5" fill="#BFE3EE" stroke={C} strokeWidth=".5"/>
          <rect x="2" y="10.5" width="3" height="15.4" fill="#D7F0F6" opacity=".55"/>
          {[11.5,15.5,19.5,23].map((sy,r) => (
            <g key={r}>
              <rect x="2" y={sy} width="10" height="3" fill="#A7CBD8" stroke={C} strokeWidth=".25"/>
              {[0,1,2,3].map(i => (
                <rect key={i} x={2.6 + i*2.4} y={sy+0.4} width="1.6" height="2.2"
                  fill={['#FCA5A5','#FACC15','#A7F3D0','#BAE6FD'][(r+i)%4]} stroke={C} strokeWidth=".2"/>
              ))}
            </g>
          ))}
          <rect x="11.3" y="15" width="1.2" height="7" rx=".4" fill="#6B7280" stroke={C} strokeWidth=".3"/>
          {/* outer outline */}
          <path d="M1 2 Q0.5 2 0.5 2.6 L0.5 27 Q0.5 27.6 1 27.6 L13 27.6 Q13.5 27.6 13.5 27 L13.5 2.6 Q13.5 2 13 2 Z" fill="none" stroke={C} strokeWidth=".65"/>
        </svg>
      </div>
    );
  }

  // ─── BoltedBed — 정신과 안전 격리실 바닥 고정 매트리스 ─────────────
  // Extremely minimal, low platform bolted to the floor (no rails/wheels).
  function BoltedBed({ x, y, occupied }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T, width: T * 2, height: T * 3 }}>
        <svg viewBox="0 0 32 48" width={T * 2} height={T * 3} shapeRendering="crispEdges">
          <ellipse cx="16.0" cy="45.3" rx="10.9" ry="3.7" fill="rgba(0,0,0,.16)"/>
          {/* low padded platform base */}
          <rect x="2" y="6" width="28" height="36" rx="3" fill="#6E6256" stroke={C} strokeWidth=".7"/>
          {/* mattress top (soft vinyl) */}
          <rect x="4" y="8" width="24" height="30" rx="2" fill="#8C9AA6" stroke={C} strokeWidth=".5"/>
          <rect x="5" y="9" width="22" height="2" fill="#A6B2BC"/>
          {/* seam quilting */}
          <line x1="16" y1="9" x2="16" y2="37" stroke="#5E6A74" strokeWidth=".4" opacity=".5"/>
          <line x1="5" y1="23" x2="27" y2="23" stroke="#5E6A74" strokeWidth=".4" opacity=".5"/>
          {/* floor bolts at the four corners */}
          {[[4.5,7.5],[27.5,7.5],[4.5,40.5],[27.5,40.5]].map(([bx,by],i) => (
            <g key={i}><circle cx={bx} cy={by} r="1.3" fill="#3A4048" stroke={C} strokeWidth=".4"/><rect x={bx-0.6} y={by-0.2} width="1.2" height=".4" fill="#9CA3AF"/></g>
          ))}
          {/* occupant (lying, calm) */}
          {occupied && (
            <g>
              <rect x="13" y="12" width="6" height="4" fill="#FDE1C8"/>
              <rect x="13" y="11" width="6" height="1.2" fill="#4B2E18"/>
              <rect x="9" y="18" width="14" height="16" fill="#C7D0D8" opacity=".8"/>
            </g>
          )}
          {/* front padded edge */}
          <rect x="2" y="42" width="28" height="3" rx="1.5" fill="#5A4F44" stroke={C} strokeWidth=".5"/>
        </svg>
      </div>
    );
  }

  // ─── CCTVCamera — 보호 커버 씌운 천장 CCTV (작동 LED) ──────────────
  function CCTVCamera({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T + 2, top: y * T, width: T - 2, height: T - 4 }}>
        <svg viewBox="0 0 14 12" width={T - 2} height={T - 4} shapeRendering="crispEdges">
          <ellipse cx="7.0" cy="11.0" rx="4.8" ry="2" fill="rgba(0,0,0,.16)"/>
          {/* wall bracket */}
          <rect x="0" y="2" width="3" height="3" fill="#6B7280" stroke={C} strokeWidth=".4"/>
          {/* protective dome cover */}
          <path d="M3 3 L12 3 Q14 3 13 8 L4 9 Q2 6 3 3 Z" fill="#9CA3AF" stroke={C} strokeWidth=".5"/>
          <path d="M4 4 L11 4 Q12.5 4 12 7 L5 8 Q3.5 6 4 4 Z" fill="#5B6573" opacity=".8"/>
          {/* lens */}
          <circle cx="8" cy="6" r="2" fill="#0B1620" stroke={C} strokeWidth=".4"/>
          <circle cx="8" cy="6" r=".7" fill="#22D3EE"/>
          {/* rec LED */}
          <circle cx="11.5" cy="4" r=".8" fill="#EF4444"/>
        </svg>
      </div>
    );
  }

  // ─── Sofa — 가족 상담실 패브릭 소파 (2 tiles wide) ─────────────────
  function Sofa({ x, y, w = 2, color = '#8FA9C4' }) {
    const dk = window.darkenHex ? window.darkenHex(color, 0.7) : '#5E7286';
    const lt = window.lightenHex ? window.lightenHex(color, 1.12) : '#A9C0D6';
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 6, width: T * w, height: T * 1.6 }}>
        <svg viewBox={`0 0 ${w*16} 26`} width={T * w} height={T * 1.6} shapeRendering="crispEdges" preserveAspectRatio="none">
          <ellipse cx={w*8} cy={24.5-w*2.3} rx={w*6.8} ry={w*2.3} fill="rgba(0,0,0,.16)"/>
          {/* backrest top */}
          <path d={`M3 2 L${w*16-3} 2 L${w*16-2} 4 L2 4 Z`} fill={lt} stroke={C} strokeWidth=".4"/>
          {/* backrest */}
          <rect x="2" y="4" width={w*16-4} height="7" fill={color} stroke={C} strokeWidth=".4"/>
          {/* armrests */}
          <rect x="0" y="5" width="3.5" height="13" rx="1" fill={dk} stroke={C} strokeWidth=".4"/>
          <rect x={w*16-3.5} y="5" width="3.5" height="13" rx="1" fill={dk} stroke={C} strokeWidth=".4"/>
          {/* seat cushions */}
          <path d={`M3 11 L${w*16-3} 11 L${w*16-3} 17 L3 17 Z`} fill={lt} stroke={C} strokeWidth=".4"/>
          {Array.from({length: w}).map((_,i) => (
            <line key={i} x1={3 + (i+1)*((w*16-6)/(w))} y1="11" x2={3 + (i+1)*((w*16-6)/(w))} y2="17" stroke={dk} strokeWidth=".4" opacity=".5"/>
          ))}
          {/* seat front */}
          <rect x="3" y="17" width={w*16-6} height="2" fill={dk} stroke={C} strokeWidth=".4"/>
          {/* legs */}
          <rect x="3" y="19" width="2" height="4" fill="#5C3A1A"/>
          <rect x={w*16-5} y="19" width="2" height="4" fill="#5C3A1A"/>
        </svg>
      </div>
    );
  }

  // ─── CoffeeTable — 낮은 나무 티 테이블 ─────────────────────────────
  function CoffeeTable({ x, y, w = 2 }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T + 1, width: T * w, height: T }}>
        <svg viewBox={`0 0 ${w*16} 16`} width={T * w} height={T} shapeRendering="geometricPrecision">
          <ellipse cx={w*8} cy="12" rx={w*5.4} ry={w*1.8} fill="rgba(0,0,0,.16)"/>
          {/* legs peeking at the far corners */}
          <rect x="3" y="2" width="1.8" height="3" rx=".4" fill="#5C3A1A"/>
          <rect x={w*16-4.8} y="2" width="1.8" height="3" rx=".4" fill="#5C3A1A"/>
          {/* big rectangular TOP face (high angle) */}
          <rect x="2" y="2.5" width={w*16-4} height="8" rx="1.2" fill="#C08B54" stroke={C} strokeWidth=".5"/>
          <rect x="3.2" y="3.4" width={w*16-6.4} height="2.4" rx=".8" fill="#D2A672"/>
          <line x1="4" y1="7.6" x2={w*16-4} y2="7.6" stroke="#A8764A" strokeWidth=".5" opacity=".6"/>
          {/* front edge (thickness band) */}
          <path d={`M2 10.5 L${w*16-2} 10.5 L${w*16-2} 12 L2 12 Z`} fill="#8A5A30" stroke={C} strokeWidth=".45"/>
          {/* front legs */}
          <rect x="3" y="12" width="1.8" height="3" rx=".4" fill="#5C3A1A"/>
          <rect x={w*16-4.8} y="12" width="1.8" height="3" rx=".4" fill="#5C3A1A"/>
        </svg>
      </div>
    );
  }

  // ─── TissueBox — 티슈 박스 (탁상) ─────────────────────────────────
  function TissueBox({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T + 4, top: y * T + 4, width: T - 8, height: T - 6 }}>
        <svg viewBox="0 0 8 7" width={T - 8} height={T - 6} shapeRendering="crispEdges">
          <ellipse cx="4.0" cy="6.0" rx="2.7" ry="2" fill="rgba(0,0,0,.16)"/>
          <path d="M1 1 L7 1 L7.5 2 L.5 2 Z" fill="#BFD7E8" stroke={C} strokeWidth=".3"/>
          <rect x="1" y="2" width="6" height="4" fill="#7FB0D8" stroke={C} strokeWidth=".4"/>
          <rect x="1.4" y="2.4" width="5.2" height="1" fill="#A7CDE8"/>
          {/* tissue pop */}
          <path d="M3 1 Q4 -0.5 5 1 Z" fill="#fff" stroke={C} strokeWidth=".3"/>
        </svg>
      </div>
    );
  }

  // ─── FloorLamp — 은은한 스탠드 조명 (따뜻한 빛) ────────────────────
  function FloorLamp({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T + 3, top: y * T - 14, width: T - 6, height: T * 2.1 }}>
        <svg viewBox="0 0 10 34" width={T - 6} height={T * 2.1} shapeRendering="crispEdges">
          <ellipse cx="5.0" cy="33.0" rx="3.4" ry="2" fill="rgba(0,0,0,.16)"/>
          {/* warm glow */}
          <ellipse cx="5" cy="6" rx="6" ry="5" fill="#FFE9A8" opacity=".35"/>
          {/* shade */}
          <path d="M2 2 L8 2 L9 8 L1 8 Z" fill="#F4D78C" stroke={C} strokeWidth=".5"/>
          <path d="M2.5 2.5 L7.5 2.5 L8 4 L2 4 Z" fill="#FBE9B8"/>
          {/* pole */}
          <rect x="4.5" y="8" width="1.2" height="21" fill="#9CA3AF" stroke={C} strokeWidth=".3"/>
          {/* base */}
          <ellipse cx="5" cy="30" rx="4" ry="1.6" fill="#6B7280" stroke={C} strokeWidth=".4"/>
        </svg>
      </div>
    );
  }

  // ─── FramedPicture — 잔잔한 풍경화 액자 (벽) ───────────────────────
  function FramedPicture({ x, y, w = 2 }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T + 1, width: T * w, height: T - 4 }}>
        <svg viewBox={`0 0 ${w*16} 12`} width={T * w} height={T - 4} shapeRendering="crispEdges" preserveAspectRatio="none">
          {/* frame */}
          <rect x="0" y="0" width={w*16} height="12" fill="#8C6A42" stroke={C} strokeWidth=".6"/>
          <rect x="1.2" y="1.2" width={w*16-2.4} height="9.6" fill="#C8B488"/>
          {/* landscape: sky / hills / sun */}
          <rect x="2" y="2" width={w*16-4} height="4" fill="#BFE0F0"/>
          <circle cx={w*16-5} cy="3.8" r="1.4" fill="#FBD877"/>
          <path d={`M2 6 Q${w*4} 3.5 ${w*8} 6 T ${w*16-2} 6 L${w*16-2} 9.5 L2 9.5 Z`} fill="#7FB069"/>
          <path d={`M2 7.5 Q${w*6} 6 ${w*16-2} 8 L${w*16-2} 9.5 L2 9.5 Z`} fill="#5E8C50"/>
        </svg>
      </div>
    );
  }

  // ─── DeconShower — 산업용 고압 제염 샤워기 헤드 (벽/천장) ───────────
  function DeconShower({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T + 2, top: y * T - 6, width: T - 4, height: T * 1.9 }}>
        <svg viewBox="0 0 12 30" width={T - 4} height={T * 1.9} shapeRendering="crispEdges">
          <ellipse cx="6.0" cy="29.0" rx="4.1" ry="2" fill="rgba(0,0,0,.16)"/>
          {/* supply pipe */}
          <rect x="5" y="0" width="2" height="6" fill="#9CA3AF" stroke={C} strokeWidth=".4"/>
          {/* pull-chain valve */}
          <rect x="8" y="1" width="1" height="6" fill="#FACC15"/>
          <rect x="7.6" y="6.5" width="1.8" height="1.5" fill="#EAB308" stroke={C} strokeWidth=".3"/>
          {/* big shower rose */}
          <ellipse cx="6" cy="8" rx="5.5" ry="2" fill="#6B7280" stroke={C} strokeWidth=".5"/>
          <ellipse cx="6" cy="7.6" rx="4.5" ry="1.3" fill="#94A3B8"/>
          {/* spray jets */}
          {[2.5,4,5.5,7,8.5].map((jx,i) => (
            <rect key={i} x={jx} y="10" width=".8" height={i%2? 16:12} fill="#9FD8EC" opacity=".75"/>
          ))}
          {/* mist at base */}
          <ellipse cx="6" cy="27" rx="5" ry="1.6" fill="#BFE3EE" opacity=".5"/>
        </svg>
      </div>
    );
  }

  // ─── FloorDrain — 대형 바닥 배수 그릴 (오염수 수집, 1-2 tiles) ──────
  function FloorDrain({ x, y, w = 2 }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T, width: T * w, height: T, pointerEvents: 'none' }}>
        <svg viewBox={`0 0 ${w*16} 16`} width={T * w} height={T} shapeRendering="crispEdges" preserveAspectRatio="none">
          {/* recessed wet basin */}
          <rect x="1" y="2" width={w*16-2} height="12" rx="1" fill="#7E8A8E" stroke={C} strokeWidth=".5"/>
          <rect x="2" y="3" width={w*16-4} height="10" fill="#5E6E72"/>
          {/* grille bars */}
          {Array.from({length: w*4}).map((_,i) => (
            <rect key={i} x={2.5 + i*((w*16-5)/(w*4))} y="3.5" width="1.2" height="9" fill="#3A4448"/>
          ))}
          {/* wet sheen */}
          <rect x="3" y="4" width={w*5} height="1.5" fill="#A7C7D2" opacity=".4"/>
        </svg>
      </div>
    );
  }

  // ─── ChemDrum — 화학물질 세척액 통 (위험 라벨) ─────────────────────
  function ChemDrum({ x, y, tone = 'chem' }) {
    const body = tone === 'waste' ? '#E0E4E8' : '#F0A93C';
    const bodyDk = tone === 'waste' ? '#A8AEB6' : '#C07E1E';
    return (
      <div style={{ position: 'absolute', left: x * T + 2, top: y * T - 4, width: T - 4, height: T * 1.6 }}>
        <svg viewBox="0 0 12 26" width={T - 4} height={T * 1.6} shapeRendering="crispEdges">
          <ellipse cx="6.0" cy="25.0" rx="4.1" ry="2" fill="rgba(0,0,0,.16)"/>
          {/* lid */}
          <ellipse cx="6" cy="3" rx="5" ry="1.8" fill={bodyDk} stroke={C} strokeWidth=".4"/>
          <ellipse cx="6" cy="2.6" rx="4" ry="1.2" fill={body}/>
          <rect x="4.5" y="1.5" width="3" height="1.4" fill="#6B7280"/>{/* bung */}
          {/* body */}
          <rect x="1" y="3" width="10" height="20" fill={body} stroke={C} strokeWidth=".5"/>
          <rect x="1.6" y="4" width="1.6" height="18" fill={tone==='waste'?'#F4F6F8':'#F8C266'}/>
          {/* hoop ribs */}
          <rect x="1" y="9" width="10" height="1" fill={bodyDk}/>
          <rect x="1" y="16" width="10" height="1" fill={bodyDk}/>
          {/* hazard label */}
          <rect x="3" y="11" width="6" height="4.5" fill="#fff" stroke={C} strokeWidth=".4"/>
          {tone === 'waste'
            ? <text x="6" y="14.6" fontSize="4" fill={C} textAnchor="middle" fontFamily="monospace">☣</text>
            : <path d="M6 11.6 L8 15 L4 15 Z" fill="#EF4444" stroke={C} strokeWidth=".3"/>}
          {/* base */}
          <ellipse cx="6" cy="23" rx="5" ry="1.6" fill={bodyDk} stroke={C} strokeWidth=".4"/>
        </svg>
      </div>
    );
  }

  // ─── NurseStationDesk — 대형 ㄷ자형 오픈 너스 스테이션 데스크 ───────
  // Matches a real hospital nursing station: birch-laminate body, beige quartz
  // top with a raised corridor-side ledge, drawer pedestals, a back wall of
  // monitors + keyboards, and side-counter accessories (label printer, baskets,
  // pen caddy). U opens toward the viewer (bottom); staff sit inside the well.
  function NurseStationDesk({ x, y, w = 10, h = 6 }) {
    const W = w * 16, HH = h * 16, R = 10, TH = HH + R, bar = 16;
    const wood = '#E4E2D8', woodDk = '#BFBBAD', woodLt = '#F2F0E8';
    const qz = '#EAE3D0', qzEdge = '#D2C9AE', qzHi = '#F4EFDF';
    const nMon = Math.max(3, w - 4);
    const monXs = [];
    for (let i = 0; i < nMon; i++) monXs.push(24 + (i + 0.5) * ((W - 48) / nMon));
    return (
      <div style={{ position: 'absolute', left: x * 16, top: y * 16 - R, width: W, height: TH }}>
        <svg viewBox={`0 0 ${W} ${TH}`} width={W} height={TH} shapeRendering="crispEdges">
          {/* ── wood body (U): top + left + right runs ── */}
          <rect x="4" y={R} width={W - 8} height={bar + 5} fill={wood} stroke={C} strokeWidth="0.7"/>
          <rect x="4" y={R} width={bar + 4} height={HH - 6} fill={wood} stroke={C} strokeWidth="0.7"/>
          <rect x={W - 4 - (bar + 4)} y={R} width={bar + 4} height={HH - 6} fill={wood} stroke={C} strokeWidth="0.7"/>
          {/* wood grain hints */}
          <rect x="6" y={R + bar + 2} width={W - 12} height="1" fill={woodDk} opacity=".4"/>

          {/* ── quartz tops (sit on the runs) ── */}
          <rect x="4" y={R - 2} width={W - 8} height={bar} fill={qz} stroke={C} strokeWidth="0.6"/>
          <rect x="4" y={R - 2} width={bar + 4} height={HH - 8} fill={qz} stroke={C} strokeWidth="0.6"/>
          <rect x={W - 4 - (bar + 4)} y={R - 2} width={bar + 4} height={HH - 8} fill={qz} stroke={C} strokeWidth="0.6"/>
          {/* raised back ledge (corridor side, the tall back lip) */}
          <rect x="4" y={R - 4} width={W - 8} height="4" fill={qzEdge} stroke={C} strokeWidth="0.6"/>
          <rect x="5" y={R - 3.4} width={W - 10} height="1" fill={qzHi}/>
          {/* quartz front edge highlights */}
          <rect x="5" y={R + bar - 4} width={W - 10} height="1" fill={qzHi} opacity=".7"/>

          {/* ── monitor wall on the back run (screens face the well/viewer) ── */}
          {monXs.map((mx, i) => (
            <g key={'m' + i}>
              {/* stand */}
              <rect x={mx - 1} y={R + bar - 6} width="2" height="3" fill="#3A4048"/>
              <rect x={mx - 3} y={R + bar - 3} width="6" height="1.4" fill="#2A2F36"/>
              {/* bezel */}
              <rect x={mx - 7} y={R - 6} width="14" height={bar - 1} fill="#1B2128" stroke={C} strokeWidth="0.5"/>
              {/* screen */}
              <rect x={mx - 5.6} y={R - 4.6} width="11.2" height={bar - 4} fill="#0F1A24"/>
              {/* screen content — first monitor shows a CT scan, others EMR rows */}
              {i === 0 ? (
                <>
                  <rect x={mx - 5} y={R - 4} width="10.4" height={bar - 5} fill="#142028"/>
                  <ellipse cx={mx} cy={R + 1} rx="3.4" ry="4" fill="#3A4A55"/>
                  <ellipse cx={mx - 1} cy={R + 1} rx="1" ry="1.4" fill="#0B1116"/>
                  <ellipse cx={mx + 1.2} cy={R + 1} rx="1" ry="1.4" fill="#0B1116"/>
                </>
              ) : (
                <>
                  <rect x={mx - 4.6} y={R - 3.6} width="9" height="1.1" fill="#2BB3C8"/>
                  <rect x={mx - 4.6} y={R - 1.6} width="7" height="0.9" fill="#5A6B78"/>
                  <rect x={mx - 4.6} y={R + 0} width="9" height="0.9" fill="#5A6B78"/>
                  <rect x={mx - 4.6} y={R + 1.6} width="6" height="0.9" fill="#E0A23A"/>
                  <rect x={mx - 4.6} y={R + 3.2} width="8" height="0.9" fill="#3FB07A"/>
                </>
              )}
              {/* keyboard in front of each monitor (on the well-side counter edge) */}
              <rect x={mx - 5} y={R + bar - 2.5} width="10" height="3" fill="#B7BEC6" stroke={C} strokeWidth="0.4"/>
              <rect x={mx - 4.4} y={R + bar - 2} width="8.8" height="2" fill="#8B939C"/>
            </g>
          ))}

          {/* ── drawer pedestals at the two front corners ── */}
          {[6, W - 6 - 16].map((dx, i) => (
            <g key={'d' + i}>
              <rect x={dx} y={R + HH - 28} width="16" height="22" fill={woodDk} stroke={C} strokeWidth="0.6"/>
              {[0, 1, 2].map(r => (
                <g key={r}>
                  <rect x={dx + 1.5} y={R + HH - 26 + r * 7} width="13" height="5.5" fill={wood} stroke={C} strokeWidth="0.4"/>
                  <rect x={dx + 5} y={R + HH - 23.5 + r * 7} width="6" height="1.2" fill="#9AA1A8"/>
                </g>
              ))}
            </g>
          ))}

          {/* ── side-counter accessories (top faces) ── */}
          {/* label printer (right side counter) */}
          <rect x={W - 4 - bar + 1} y={R + 2} width="12" height="9" fill="#F2EFE6" stroke={C} strokeWidth="0.5"/>
          <rect x={W - 4 - bar + 2} y={R + 3} width="10" height="2.5" fill="#0F1A24"/>
          <rect x={W - 4 - bar + 2} y={R + 8} width="10" height="1.5" fill="#fff" stroke={C} strokeWidth="0.3"/>
          {/* wire basket (left side counter) */}
          <rect x="7" y={R + 3} width="11" height="7" fill="#F7F7F4" stroke={C} strokeWidth="0.5"/>
          <rect x="7" y={R + 3} width="11" height="7" fill="none" stroke="#B7BEC6" strokeWidth="0.4" strokeDasharray="1 1"/>
          {/* pen caddy (left) */}
          <rect x="8" y={R + 11} width="6" height="5" fill="#7E8893" stroke={C} strokeWidth="0.4"/>
          <rect x="9" y={R + 8} width="1" height="4" fill="#EF4444"/>
          <rect x="11" y={R + 8} width="1" height="4" fill="#3B82F6"/>
          {/* coffee cup (right) */}
          <ellipse cx={W - 12} cy={R + 14} rx="2.4" ry="1.1" fill="#fff" stroke={C} strokeWidth="0.4"/>
          <rect x={W - 14.2} y={R + 11} width="4.4" height="3.2" fill="#fff" stroke={C} strokeWidth="0.4"/>
          <ellipse cx={W - 12} cy={R + 11} rx="2.2" ry="0.9" fill="#7C4A22"/>
        </svg>
      </div>
    );
  }

  Object.assign(window, {
    IThreshold, SecurityScanner, MetalDetector, BarcodePrinter, WallTV,
    MedFridge, BoltedBed, CCTVCamera, Sofa, CoffeeTable, TissueBox,
    FloorLamp, FramedPicture, DeconShower, FloorDrain, ChemDrum,
    NurseStationDesk,
  });
})();
