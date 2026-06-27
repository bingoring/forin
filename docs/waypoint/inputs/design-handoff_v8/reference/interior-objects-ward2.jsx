// interior-objects-ward2.jsx — Internal Medicine Ward (일반 내과 병동) objects.
// v2 pixel style (visible TOP + FRONT + depth, 45°). Tile-based coords.
// Loads before the Ward screen render.

(function () {
  const C = '#2A2522';
  const T = window.ITILE || 16;

  // ─── O2Flowmeter — 벽면 산소 유량계 (+ 비강 캐뉼라 라인) ───────────
  function O2Flowmeter({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T + 3, top: y * T, width: T - 6, height: T * 1.6, filter: 'drop-shadow(1.5px 2px 0 rgba(0,0,0,.22))' }}>
        <svg viewBox="0 0 10 26" width={T - 6} height={T * 1.6} shapeRendering="crispEdges">
          {/* green wall port */}
          <rect x="2" y="0" width="6" height="3" fill="#16A34A" stroke={C} strokeWidth=".4"/>
          {/* flow tube body */}
          <rect x="2.5" y="3" width="5" height="11" fill="#D7EEF5" stroke={C} strokeWidth=".4"/>
          {/* float ball + graduations */}
          <circle cx="5" cy="9" r="1.3" fill="#475569"/>
          {[0,1,2,3,4].map(i => <rect key={i} x="2.5" y={5 + i*1.8} width="1.4" height=".5" fill={C} opacity=".5"/>)}
          {/* humidifier bottle */}
          <rect x="2" y="14" width="6" height="6" fill="#BFE3EE" stroke={C} strokeWidth=".4"/>
          <rect x="2.5" y="17" width="5" height="2.5" fill="#9FD0E4"/>
          {/* cannula tubing curling down */}
          <path d="M5 20 Q9 23 4 25" fill="none" stroke="#CFE3EC" strokeWidth="1.2"/>
        </svg>
      </div>
    );
  }

  // ─── Nebulizer — 네블라이저 (흡입치료기, 미스트) ───────────────────
  function Nebulizer({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T + 2, top: y * T, width: T - 4, height: T * 1.4, filter: 'drop-shadow(1.5px 2px 0 rgba(0,0,0,.22))' }}>
        <svg viewBox="0 0 12 20" width={T - 4} height={T * 1.4} shapeRendering="crispEdges">
          {/* mist puff */}
          <ellipse cx="9" cy="3" rx="2.4" ry="1.6" fill="#BFE3EE" opacity=".7"/>
          <ellipse cx="10.5" cy="1.6" rx="1.4" ry="1" fill="#D7EEF5" opacity=".6"/>
          {/* mask + tube */}
          <path d="M6 5 Q9 4 9 2" fill="none" stroke="#A8DCEC" strokeWidth="1.2"/>
          <path d="M2 6 L7 6 L6 9 L3 9 Z" fill="#CFE3EC" stroke={C} strokeWidth=".4"/>
          {/* compressor unit */}
          <rect x="1" y="9" width="10" height="9" fill="#E5E7EB" stroke={C} strokeWidth=".5"/>
          <rect x="2" y="10.5" width="5" height="3" fill="#0F1A24"/>
          <rect x="2.5" y="11" width="4" height="1" fill="#22D3EE"/>
          <circle cx="9" cy="12" r="1.3" fill="#16A34A" stroke={C} strokeWidth=".3"/>
          <rect x="2" y="15" width="8" height="1.6" fill="#9CA3AF"/>
        </svg>
      </div>
    );
  }

  // ─── AirMattress — 에어 매트리스 펌프 (욕창 방지, 모터) ────────────
  function AirMattress({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T + 2, top: y * T, width: T - 4, height: T * 1.2, filter: 'drop-shadow(1.5px 2px 0 rgba(0,0,0,.22))' }}>
        <svg viewBox="0 0 12 16" width={T - 4} height={T * 1.2} shapeRendering="crispEdges">
          {/* pump unit hung on bed footboard */}
          <rect x="1" y="2" width="10" height="9" fill="#475569" stroke={C} strokeWidth=".5"/>
          <rect x="2" y="3" width="8" height="2.4" fill="#0F1A24"/>
          <rect x="2.5" y="3.5" width="3" height="1.4" fill="#22D3EE"/>
          {/* alternating-pressure lights */}
          <circle cx="3" cy="7.5" r=".9" fill="#16A34A"/>
          <circle cx="6" cy="7.5" r=".9" fill="#FACC15"/>
          <circle cx="9" cy="7.5" r=".9" fill="#475569"/>
          {/* twin air hoses */}
          <path d="M3 11 Q1 14 5 15" fill="none" stroke="#CBD5E1" strokeWidth="1"/>
          <path d="M8 11 Q11 14 6 15" fill="none" stroke="#CBD5E1" strokeWidth="1"/>
        </svg>
      </div>
    );
  }

  // ─── FallRiskSign — 낙상 고위험 표지판 (침대 발치) ─────────────────
  function FallRiskSign({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T + 3, top: y * T + 2, width: T - 6, height: T - 4, zIndex: 3, filter: 'drop-shadow(1px 1.5px 0 rgba(0,0,0,.24))' }}>
        <svg viewBox="0 0 10 10" width={T - 6} height={T - 4} shapeRendering="crispEdges">
          <path d="M5 0 L10 9 L0 9 Z" fill="#FACC15" stroke="#DC2626" strokeWidth=".8"/>
          <rect x="4.4" y="3" width="1.2" height="3" fill={C}/>
          <rect x="4.4" y="6.6" width="1.2" height="1.2" fill={C}/>
        </svg>
      </div>
    );
  }

  // ─── NPOBoard — 'NPO 금식' 머리맡 보드 ─────────────────────────────
  function NPOBoard({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T + 2, top: y * T + 2, width: T - 4, height: T - 6, filter: 'drop-shadow(1px 1.5px 0 rgba(0,0,0,.22))' }}>
        <svg viewBox="0 0 14 9" width={T - 4} height={T - 6} shapeRendering="crispEdges">
          <rect x="0" y="0" width="14" height="9" fill="#fff" stroke={C} strokeWidth=".6"/>
          <rect x="0" y="0" width="14" height="3" fill="#DC2626"/>
          <text x="7" y="2.3" fontSize="2.2" fill="#fff" textAnchor="middle" fontFamily="monospace">NPO · 금식</text>
          <rect x="1.5" y="4.5" width="7" height="1" fill={C} opacity=".5"/>
          <rect x="1.5" y="6.5" width="5" height="1" fill={C} opacity=".5"/>
        </svg>
      </div>
    );
  }

  // ─── IsolationCart — 접촉 격리 카트 (핵심, 노란 가운/장갑) ──────────
  function IsolationCart({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 4, width: T * 1.4, height: T * 2, filter: 'drop-shadow(2px 3px 0 rgba(0,0,0,.26))' }}>
        <svg viewBox="0 0 22 32" width={T * 1.4} height={T * 2} shapeRendering="crispEdges">
          {/* yellow alert topper */}
          <rect x="2" y="0" width="18" height="4" fill="#FACC15" stroke={C} strokeWidth=".5"/>
          <text x="11" y="3" fontSize="2.6" fill={C} textAnchor="middle" fontFamily="monospace">ISOLATION</text>
          {/* cart body */}
          <rect x="2" y="4" width="18" height="22" fill="#E5E7EB" stroke={C} strokeWidth=".6"/>
          {/* gown shelf */}
          <rect x="3" y="6" width="16" height="5" fill="#FEF3C7" stroke={C} strokeWidth=".4"/>
          <path d="M5 7 L9 7 L8 10 L6 10 Z" fill="#FDE68A" stroke={C} strokeWidth=".3"/>
          <path d="M12 7 L16 7 L15 10 L13 10 Z" fill="#FDE68A" stroke={C} strokeWidth=".3"/>
          {/* glove boxes (S/M/L) */}
          <rect x="3" y="12" width="5" height="5" fill="#3B82F6" stroke={C} strokeWidth=".4"/>
          <rect x="8.5" y="12" width="5" height="5" fill="#16A34A" stroke={C} strokeWidth=".4"/>
          <rect x="14" y="12" width="5" height="5" fill="#DB2777" stroke={C} strokeWidth=".4"/>
          {/* mask/cover drawer */}
          <rect x="3" y="18" width="16" height="3" fill="#fff" stroke={C} strokeWidth=".4"/>
          <rect x="9" y="19" width="4" height="1" fill="#9CA3AF"/>
          <rect x="3" y="22" width="16" height="3" fill="#fff" stroke={C} strokeWidth=".4"/>
          {/* wheels */}
          <ellipse cx="5" cy="29" rx="2.2" ry="1.6" fill={C}/>
          <ellipse cx="17" cy="29" rx="2.2" ry="1.6" fill={C}/>
        </svg>
      </div>
    );
  }

  // ─── LinenHamper — 오염 Linen 수거함 (바퀴 달린 자루) ──────────────
  function LinenHamper({ x, y, tone = 'soiled' }) {
    const bag = tone === 'soiled' ? '#D8D2C4' : '#BAE6FD';
    return (
      <div style={{ position: 'absolute', left: x * T + 2, top: y * T, width: T - 4, height: T * 1.5, filter: 'drop-shadow(2px 2px 0 rgba(0,0,0,.24))' }}>
        <svg viewBox="0 0 12 20" width={T - 4} height={T * 1.5} shapeRendering="crispEdges">
          {/* hoop frame */}
          <ellipse cx="6" cy="3" rx="5" ry="2" fill="#9CA3AF" stroke={C} strokeWidth=".5"/>
          <ellipse cx="6" cy="3" rx="3.6" ry="1.3" fill="#6B7280"/>
          {/* fabric bag bulging */}
          <path d="M2 3 Q1 13 4 16 L8 16 Q11 13 10 3 Z" fill={bag} stroke={C} strokeWidth=".5"/>
          <path d="M4 6 Q6 8 8 6" fill="none" stroke={C} strokeWidth=".4" opacity=".4"/>
          <path d="M3.5 10 Q6 12 8.5 10" fill="none" stroke={C} strokeWidth=".4" opacity=".4"/>
          {/* legs + wheels */}
          <rect x="3" y="16" width="1.4" height="2.5" fill="#6B7280"/>
          <rect x="7.6" y="16" width="1.4" height="2.5" fill="#6B7280"/>
          <circle cx="3.7" cy="19" r="1.2" fill={C}/>
          <circle cx="8.3" cy="19" r="1.2" fill={C}/>
        </svg>
      </div>
    );
  }

  // ─── SluiceSink — 배설물 처리 싱크대 (깊은 클리닉 싱크) ────────────
  function SluiceSink({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 2, width: T * 1.6, height: T * 1.7, filter: 'drop-shadow(2px 3px 0 rgba(0,0,0,.24))' }}>
        <svg viewBox="0 0 26 28" width={T * 1.6} height={T * 1.7} shapeRendering="crispEdges">
          {/* faucet + sprayer */}
          <rect x="12" y="0" width="2" height="5" fill="#9CA3AF" stroke={C} strokeWidth=".4"/>
          <rect x="12" y="5" width="6" height="2" fill="#9CA3AF"/>
          <rect x="17" y="6" width="1.4" height="3" fill="#7DD3FC"/>
          {/* deep basin */}
          <rect x="2" y="7" width="22" height="9" fill="#CBD5E1" stroke={C} strokeWidth=".6"/>
          <rect x="3" y="8" width="20" height="6.5" fill="#94A3B8"/>
          <rect x="4" y="9" width="18" height="4.5" fill="#7E8893"/>
          {/* flush valve */}
          <rect x="20" y="3" width="3" height="4" fill="#6B7280" stroke={C} strokeWidth=".4"/>
          {/* cabinet */}
          <path d="M2 16 L24 16 L23 25 L3 25 Z" fill="#9CA3AF" stroke={C} strokeWidth=".5"/>
          <rect x="4" y="17" width="8" height="7" fill="#fff" stroke={C} strokeWidth=".3"/>
          <rect x="14" y="17" width="8" height="7" fill="#fff" stroke={C} strokeWidth=".3"/>
        </svg>
      </div>
    );
  }

  // ─── SupplyBasketShelf — 라벨 바구니 물품 선반 (클린 유틸리티) ──────
  function SupplyBasketShelf({ x, y, w = 4, shelves = 4 }) {
    const W = w * T, H = T * 1.5;
    const baskets = ['#BAE6FD','#FBCFE8','#FEF08A','#BBF7D0','#DDD6FE','#FED7AA'];
    const rows = [];
    for (let s = 0; s < shelves; s++) {
      const top = 2 + s * ((24 - 2) / shelves);
      const slotH = (24 - 2) / shelves;
      const items = [];
      const per = w * 2;
      for (let i = 0; i < per; i++) {
        const bw = (w * 16 - 2) / per - 0.6;
        const bx = 1 + i * ((w * 16 - 2) / per);
        items.push(
          <g key={i}>
            <rect x={bx} y={top + 1} width={bw} height={slotH - 2.6} fill={baskets[(i + s) % baskets.length]} stroke={C} strokeWidth=".3"/>
            <rect x={bx} y={top + 1} width={bw} height="1.2" fill="#fff" opacity=".7"/>{/* label strip */}
          </g>
        );
      }
      rows.push(
        <g key={s}>
          {items}
          <rect x="0.5" y={top + slotH - 1.4} width={w * 16 - 1} height="1.4" fill="#E8E5DB" stroke={C} strokeWidth=".4"/>
        </g>
      );
    }
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 4, width: W, height: H, filter: 'drop-shadow(2px 3px 0 rgba(0,0,0,.22))' }}>
        <svg viewBox={`0 0 ${w * 16} 26`} width={W} height={H} shapeRendering="crispEdges" preserveAspectRatio="none">
          <rect x="0" y="0" width={w * 16} height="26" fill="#EFEDE4" stroke={C} strokeWidth=".7"/>
          <rect x="0" y="0" width="1" height="26" fill="#D7D3C6"/>
          <rect x={w * 16 - 1} y="0" width="1" height="26" fill="#D7D3C6"/>
          {rows}
        </svg>
      </div>
    );
  }

  // ─── IVStorageCart — 수액 보관 카트 (포도당/생식 백 박스) ──────────
  function IVStorageCart({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 2, width: T * 1.5, height: T * 1.8, filter: 'drop-shadow(2px 3px 0 rgba(0,0,0,.24))' }}>
        <svg viewBox="0 0 24 30" width={T * 1.5} height={T * 1.8} shapeRendering="crispEdges">
          {/* wire shelves with IV-bag boxes */}
          <rect x="1" y="2" width="22" height="10" fill="#CFE3EC" stroke={C} strokeWidth=".5"/>
          {[0,1,2].map(i => <rect key={i} x={2 + i*7} y="3" width="6" height="4" fill="#EAF6FA" stroke={C} strokeWidth=".3"/>)}
          {[0,1,2].map(i => <text key={'t'+i} x={5 + i*7} y="6" fontSize="2" fill="#2563EB" textAnchor="middle" fontFamily="monospace">{['D5','NS','HS'][i]}</text>)}
          <rect x="1" y="12" width="22" height="2" fill="#9CA3AF"/>
          <rect x="1" y="14" width="22" height="10" fill="#CFE3EC" stroke={C} strokeWidth=".5"/>
          {[0,1,2].map(i => <rect key={'b'+i} x={2 + i*7} y="15" width="6" height="4" fill="#EAF6FA" stroke={C} strokeWidth=".3"/>)}
          <rect x="1" y="24" width="22" height="2" fill="#9CA3AF"/>
          {/* wheels */}
          <ellipse cx="4" cy="28" rx="2" ry="1.5" fill={C}/>
          <ellipse cx="20" cy="28" rx="2" ry="1.5" fill={C}/>
        </svg>
      </div>
    );
  }

  // ─── Handrail — 복도 벽면 손잡이 (낙상 방지 바) ───────────────────
  function Handrail({ x, y, w = 4, vertical = false }) {
    const len = w * T;
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T, width: vertical ? T * 0.5 : len, height: vertical ? len : T * 0.5, pointerEvents: 'none' }}>
        <svg viewBox={vertical ? `0 0 8 ${w*16}` : `0 0 ${w*16} 8`} width={vertical ? T * 0.5 : len} height={vertical ? len : T * 0.5} shapeRendering="crispEdges" preserveAspectRatio="none">
          {vertical ? (
            <>
              <rect x="2.5" y="1" width="3" height={w*16-2} fill="#C8CDD2" stroke={C} strokeWidth=".5"/>
              <rect x="3" y="1" width="1" height={w*16-2} fill="#EAECEE"/>
              {[...Array(w)].map((_,i) => <rect key={i} x="0" y={4 + i*16} width="2.5" height="2" fill="#9CA3AF" stroke={C} strokeWidth=".3"/>)}
            </>
          ) : (
            <>
              <rect x="1" y="2.5" width={w*16-2} height="3" fill="#C8CDD2" stroke={C} strokeWidth=".5"/>
              <rect x="1" y="3" width={w*16-2} height="1" fill="#EAECEE"/>
              {[...Array(w)].map((_,i) => <rect key={i} x={4 + i*16} y="0" width="2" height="2.5" fill="#9CA3AF" stroke={C} strokeWidth=".3"/>)}
            </>
          )}
        </svg>
      </div>
    );
  }

  Object.assign(window, {
    O2Flowmeter, Nebulizer, AirMattress, FallRiskSign, NPOBoard,
    IsolationCart, LinenHamper, SluiceSink, SupplyBasketShelf,
    IVStorageCart, Handrail,
  });
})();
