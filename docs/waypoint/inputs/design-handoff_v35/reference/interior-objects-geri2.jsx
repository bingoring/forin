// interior-objects-geri2.jsx — 치매·노인병동 (Geriatric/Dementia) objects.
// Dementia-friendly: low beds, memory cues, wandering safety. v2 top-down,
// single silhouette, ground-contact ellipse shadow.

(function () {
  const C = '#2A2522';
  const T = window.ITILE || 16;

  // ─── LowBed — 초저상 낙상 방지 침대 (바닥 가까이, 양옆 매트) ─────────
  function LowBed({ x, y, occupied }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 2, width: T * 2.6, height: T * 3.2 }}>
        <svg viewBox="0 0 42 50" width={T * 2.6} height={T * 3.2} shapeRendering="geometricPrecision">
          <ellipse cx="21" cy="48" rx="18" ry="2.2" fill="rgba(0,0,0,.14)"/>
          {/* crash mats flanking the bed (fall protection) */}
          <rect x="1" y="16" width="5" height="26" rx="1.5" fill="#8FA9B8" stroke={C} strokeWidth=".5"/>
          <rect x="36" y="16" width="5" height="26" rx="1.5" fill="#8FA9B8" stroke={C} strokeWidth=".5"/>
          <rect x="2" y="17" width="3" height="1" fill="#A6C0CE"/><rect x="37" y="17" width="3" height="1" fill="#A6C0CE"/>
          {/* low mattress: top face + very short front (sits near floor) */}
          <path d="M6 6 L36 6 L36 42 Q36 43 35 43 L7 43 Q6 43 6 42 Z" fill="#E4DAC8" stroke={C} strokeWidth=".7"/>
          {/* pillow */}
          <rect x="10" y="8" width="22" height="9" rx="3" fill="#FBFAF4" stroke={C} strokeWidth=".4"/>
          {/* blanket */}
          <rect x="7" y="20" width="28" height="22" rx="1.5" fill="#C4B69A"/>
          <path d="M7 28 L35 28 M7 35 L35 35" stroke="#A89A7C" strokeWidth=".5"/>
          {occupied && (
            <g>
              <rect x="18" y="9.5" width="6" height="5.5" rx="2.3" fill="#FBD9C0" stroke={C} strokeWidth=".3"/>
              <rect x="18.4" y="8.6" width="5.2" height="1.4" fill="#8A8A8A"/>
              <ellipse cx="21" cy="30" rx="9" ry="6" fill="#B3A783" opacity=".5"/>
            </g>
          )}
          <line x1="6" y1="42" x2="36" y2="42" stroke={C} strokeWidth=".5"/>
          {/* floor sensor mat (fall alarm) at the foot */}
          <rect x="13" y="44" width="16" height="4" rx="1" fill="#5B6672"/>
          <rect x="14" y="45" width="14" height="1" fill="#6E7A86"/>
        </svg>
      </div>
    );
  }

  // ─── MemoryBox — 병실문 옆 회상 상자 (환자 사진·추억 물건, 방 찾기) ──
  function MemoryBox({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T + 2, top: y * T, width: T - 4, height: T * 1.3 }}>
        <svg viewBox="0 0 12 18" width={T - 4} height={T * 1.3} shapeRendering="geometricPrecision">
          <ellipse cx="6" cy="17" rx="4.5" ry="1.2" fill="rgba(0,0,0,.14)"/>
          {/* shadow-box frame on the wall */}
          <rect x="1" y="1" width="10" height="15" rx=".5" fill="#C99F68" stroke={C} strokeWidth=".6"/>
          <rect x="2" y="2" width="8" height="13" fill="#F4ECD8"/>
          {/* an old photo + a memento */}
          <rect x="3" y="3.5" width="4" height="4" fill="#B7C9A8" stroke={C} strokeWidth=".3"/>
          <circle cx="5" cy="5.5" r="1" fill="#9DB08C"/>
          <rect x="7.5" y="4" width="2.5" height="3" fill="#E4B7A0" stroke={C} strokeWidth=".3"/>{/* keepsake */}
          <rect x="3" y="9" width="6" height="1.4" fill="#CBA36B"/>{/* name plate */}
          <rect x="3" y="11.5" width="5" height="1" fill="#D8C6A0"/>
        </svg>
      </div>
    );
  }

  // ─── OrientationBoard — 현실 인식 게시판 (날짜·요일·계절·날씨) ────────
  function OrientationBoard({ x, y, w = 3 }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T, width: T * w, height: T * 1.3 }}>
        <svg viewBox={`0 0 ${w*16} 20`} width={T * w} height={T * 1.3} shapeRendering="geometricPrecision" preserveAspectRatio="none">
          <rect x="0" y="0" width={w*16} height="20" rx="1" fill="#fff" stroke={C} strokeWidth=".7"/>
          <rect x="0" y="0" width={w*16} height="4.5" fill="#5B8A6E"/>
          <rect x="2" y="1.3" width={w*8} height="2" fill="#fff"/>{/* "오늘은" header */}
          {/* big date + day + weather sun */}
          <rect x="2" y="6.5" width={w*6} height="4" fill="#3A4048"/>
          <text x={2+w*3} y="9.8" fontSize="3" fill="#FBBF24" textAnchor="middle" fontFamily="monospace">7/16 水</text>
          <circle cx={w*16-6} cy="8.5" r="2.6" fill="#FBBF24" stroke={C} strokeWidth=".4"/>
          <rect x="2" y="12.5" width={w*10} height="1.6" fill={C} opacity=".4"/>{/* season line */}
          <rect x="2" y="15.5" width={w*7} height="1.6" fill={C} opacity=".3"/>
        </svg>
      </div>
    );
  }

  // ─── GeriReclineChair — 노인용 등받이·발판 리클라이너 (팔걸이 높음) ──
  function GeriReclineChair({ x, y, occupied = true }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 4, width: T * 2.2, height: T * 3 }}>
        <svg viewBox="0 0 36 48" width={T * 2.2} height={T * 3} shapeRendering="geometricPrecision">
          <ellipse cx="18" cy="46" rx="14" ry="2.2" fill="rgba(0,0,0,.15)"/>
          {/* extended footrest (reclined, toward viewer) */}
          <path d="M6 34 L30 34 L30 42 Q30 43 29 43 L7 43 Q6 43 6 42 Z" fill="#B89A72" stroke={C} strokeWidth=".6"/>
          <rect x="8" y="35" width="20" height="6" rx="2" fill="#C4A578"/>
          {/* long reclined seat (top face) */}
          <path d="M4 12 L32 12 L32 34 L4 34 Z" fill="#A98D66" stroke={C} strokeWidth=".7"/>
          <rect x="6" y="14" width="24" height="19" rx="2" fill="#C4A578"/>
          {/* tall padded backrest at the head (top) */}
          <path d="M4 2 L32 2 Q33 2 33 3 L33 12 L3 12 L3 3 Q3 2 4 2 Z" fill="#A98D66" stroke={C} strokeWidth=".7"/>
          <rect x="6" y="3.5" width="24" height="8" rx="2.5" fill="#C4A578"/>
          {/* high grip armrests down both sides */}
          <rect x="1.5" y="12" width="4" height="24" rx="1.5" fill="#8F7550" stroke={C} strokeWidth=".5"/>
          <rect x="30.5" y="12" width="4" height="24" rx="1.5" fill="#8F7550" stroke={C} strokeWidth=".5"/>
          {/* reclining elderly occupant */}
          {occupied && (
            <g>
              <rect x="14.5" y="4.5" width="7" height="6" rx="2.6" fill="#FBD9C0" stroke={C} strokeWidth=".3"/>
              <rect x="14.8" y="3.6" width="6.4" height="1.6" fill="#9A9A9A"/>{/* grey hair */}
              <ellipse cx="18" cy="24" rx="8" ry="9" fill="#B7C9A8" opacity=".55"/>{/* lap blanket */}
              <rect x="12" y="34" width="12" height="4" rx="1.5" fill="#E4C9A0"/>{/* slippered feet */}
            </g>
          )}
        </svg>
      </div>
    );
  }

  // ─── HandrailWall — 복도 연속 손잡이 (배회 안전, 벽 부착) ────────────
  function HandrailWall({ x, y, w = 4 }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T, width: T * w, height: T * 0.5 }}>
        <svg viewBox={`0 0 ${w*16} 8`} width={T * w} height={T * 0.5} shapeRendering="geometricPrecision" preserveAspectRatio="none">
          <rect x="0" y="2.5" width={w*16} height="3" rx="1.5" fill="#C99F68" stroke={C} strokeWidth=".5"/>
          <rect x="1" y="3" width={w*16-2} height="1" fill="#DBB884"/>
          {/* wall brackets */}
          {[...Array(w)].map((_,i)=><rect key={i} x={6+i*16} y="5.5" width="2" height="2.5" fill="#9CA3AF"/>)}
        </svg>
      </div>
    );
  }

  Object.assign(window, {
    LowBed, MemoryBox, OrientationBoard, GeriReclineChair, HandrailWall,
  });
})();
