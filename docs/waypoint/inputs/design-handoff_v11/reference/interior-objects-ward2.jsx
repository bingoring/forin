// interior-objects-ward2.jsx — Internal Medicine Ward (일반 내과 병동) objects.
// v2 pixel style (visible TOP + FRONT + depth, 45°). Tile-based coords.
// Loads before the Ward screen render.

(function () {
  const C = '#2A2522';
  const T = window.ITILE || 16;

  // ─── O2Flowmeter — 벽면 산소 유량계 (+ 비강 캐뉼라 라인) ───────────
  function O2Flowmeter({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T + 3, top: y * T, width: T - 6, height: T * 1.6, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.22))' }}>
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
      <div style={{ position: 'absolute', left: x * T + 2, top: y * T - 2, width: T * 1.2, height: T * 1.5, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.22))' }}>
        <svg viewBox="0 0 20 24" width={T * 1.2} height={T * 1.5} shapeRendering="geometricPrecision">
          {/* mist puff rising off the mask */}
          <ellipse cx="15" cy="4" rx="2.6" ry="1.7" fill="#BFE3EE" opacity=".7"/>
          <ellipse cx="16.6" cy="2.4" rx="1.5" ry="1" fill="#D7EEF5" opacity=".6"/>
          {/* mask + tube resting on the top */}
          <path d="M6 7 L11 6 L11 9 L7 10 Z" fill="#CFE3EC" stroke={C} strokeWidth=".4"/>
          <path d="M11 7 Q15 6 15 4" fill="none" stroke="#A8DCEC" strokeWidth="1.2"/>
          {/* TOP face (dominant) folding into a continuous short front */}
          <path d="M2 12 L18 12 L18 20 Q18 21 17 21 L3 21 Q2 21 2 20 Z" fill="#B7BEC6" stroke={C} strokeWidth=".7"/>
          <rect x="2" y="6" width="16" height="6" rx="1.2" fill="#D1D5DB" stroke={C} strokeWidth=".7"/>{/* compressor lid */}
          <rect x="3.5" y="7.2" width="13" height="1.4" fill="#E1E5EA"/>
          <circle cx="14" cy="9.6" r="1.4" fill="#16A34A" stroke={C} strokeWidth=".3"/>{/* cup socket */}
          <line x1="2" y1="12" x2="18" y2="12" stroke={C} strokeWidth=".55"/>{/* top↔front seam */}
          {/* viewer-facing display on the front band */}
          <rect x="4" y="14" width="8" height="4" rx=".5" fill="#0F1A24"/>
          <rect x="5" y="14.9" width="6" height="1" fill="#22D3EE"/>
          <rect x="5" y="16.4" width="4" height="1" fill="#10B981"/>
          <circle cx="15" cy="16" r="1.4" fill="#16A34A" stroke={C} strokeWidth=".4"/>
        </svg>
      </div>
    );
  }

  // ─── AirMattress — 에어 매트리스 펌프 (욕창 방지, 모터) ────────────
  function AirMattress({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T + 2, top: y * T - 2, width: T * 1.2, height: T * 1.4, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.22))' }}>
        <svg viewBox="0 0 20 22" width={T * 1.2} height={T * 1.4} shapeRendering="geometricPrecision">
          {/* TOP face (dominant) folding into a continuous short front */}
          <path d="M2 11 L18 11 L18 18 Q18 19 17 19 L3 19 Q2 19 2 18 Z" fill="#3E4756" stroke={C} strokeWidth=".7"/>
          <rect x="2" y="2" width="16" height="9" rx="1.2" fill="#4E5A6B" stroke={C} strokeWidth=".7"/>{/* pump lid */}
          <rect x="3.5" y="3.2" width="13" height="1.6" fill="#647388"/>{/* back-edge highlight */}
          {/* alternating-pressure indicator lights on the lid */}
          <circle cx="6" cy="8" r="1.1" fill="#16A34A"/>
          <circle cx="10" cy="8" r="1.1" fill="#FACC15"/>
          <circle cx="14" cy="8" r="1.1" fill="#334155"/>
          <line x1="2" y1="11" x2="18" y2="11" stroke={C} strokeWidth=".55"/>{/* top↔front seam */}
          {/* viewer-facing display + twin air ports on the front */}
          <rect x="4" y="12.6" width="7" height="3.6" rx=".5" fill="#0F1A24"/>
          <rect x="5" y="13.5" width="5" height="1" fill="#22D3EE"/>
          <circle cx="14" cy="14.4" r="1.3" fill="#94A3B8" stroke={C} strokeWidth=".3"/>
          <circle cx="16.4" cy="14.4" r="1.3" fill="#94A3B8" stroke={C} strokeWidth=".3"/>
          {/* twin air hoses trailing off to the mattress */}
          <path d="M14 17 Q12 21 16 21" fill="none" stroke="#CBD5E1" strokeWidth="1.2"/>
        </svg>
      </div>
    );
  }

  // ─── FallRiskSign — 낙상 고위험 표지판 (침대 발치) ─────────────────
  function FallRiskSign({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T + 3, top: y * T + 2, width: T - 6, height: T - 4, zIndex: 3, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.24))' }}>
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
      <div style={{ position: 'absolute', left: x * T + 2, top: y * T + 2, width: T - 4, height: T - 6, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.22))' }}>
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
      <div style={{ position: 'absolute', left: x * T, top: y * T - 6, width: T * 1.4, height: T * 2, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.26))' }}>
        <svg viewBox="0 0 22 32" width={T * 1.4} height={T * 2} shapeRendering="geometricPrecision">
          {/* full silhouette (top + front, single body) */}
          <path d="M3 3 Q2 3 2 4 L2 27 Q2 28 3 28 L19 28 Q20 28 20 27 L20 4 Q20 3 19 3 Z" fill="#C9CDD3"/>
          {/* TOP face — yellow isolation alert + folded gowns seen from above */}
          <path d="M3 3 Q2 3 2 4 L2 12 L20 12 L20 4 Q20 3 19 3 Z" fill="#FACC15"/>
          <text x="11" y="6.4" fontSize="2.6" fill={C} textAnchor="middle" fontFamily="monospace">ISOLATION</text>
          <rect x="4" y="7.6" width="6" height="3.4" rx=".5" fill="#FEF3C7" stroke={C} strokeWidth=".35"/>
          <rect x="12" y="7.6" width="6" height="3.4" rx=".5" fill="#FDE68A" stroke={C} strokeWidth=".35"/>
          {/* seam top → front */}
          <line x1="2" y1="12" x2="20" y2="12" stroke={C} strokeWidth=".6"/>
          {/* FRONT face — glove boxes (S/M/L) + mask drawers */}
          <rect x="3" y="13" width="4.8" height="5" rx=".4" fill="#3B82F6" stroke={C} strokeWidth=".4"/>
          <rect x="8.6" y="13" width="4.8" height="5" rx=".4" fill="#16A34A" stroke={C} strokeWidth=".4"/>
          <rect x="14.2" y="13" width="4.8" height="5" rx=".4" fill="#DB2777" stroke={C} strokeWidth=".4"/>
          <rect x="4" y="13.6" width="2.8" height="1.4" fill="#fff" opacity=".75"/>
          <rect x="9.6" y="13.6" width="2.8" height="1.4" fill="#fff" opacity=".75"/>
          <rect x="15.2" y="13.6" width="2.8" height="1.4" fill="#fff" opacity=".75"/>
          <rect x="3" y="19" width="16" height="3" rx=".3" fill="#EDEFF2" stroke={C} strokeWidth=".4"/>
          <rect x="9" y="20" width="4" height="1" fill="#9CA3AF"/>
          <rect x="3" y="23" width="16" height="3" rx=".3" fill="#EDEFF2" stroke={C} strokeWidth=".4"/>
          <rect x="9" y="24" width="4" height="1" fill="#9CA3AF"/>
          {/* outer outline */}
          <path d="M3 3 Q2 3 2 4 L2 27 Q2 28 3 28 L19 28 Q20 28 20 27 L20 4 Q20 3 19 3 Z" fill="none" stroke={C} strokeWidth=".7"/>
          {/* wheels */}
          <ellipse cx="5" cy="29.5" rx="2" ry="1.4" fill="#2C3239"/>
          <ellipse cx="17" cy="29.5" rx="2" ry="1.4" fill="#2C3239"/>
        </svg>
      </div>
    );
  }

  // ─── LinenHamper — 오염 Linen 수거함 (바퀴 달린 자루) ──────────────
  function LinenHamper({ x, y, tone = 'soiled' }) {
    const bag = tone === 'soiled' ? '#D8D2C4' : '#BAE6FD';
    const bagDk = tone === 'soiled' ? '#BEB7A4' : '#8EC9E8';
    return (
      <div style={{ position: 'absolute', left: x * T + 2, top: y * T - 2, width: T * 1.2, height: T * 1.6, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.24))' }}>
        <svg viewBox="0 0 20 26" width={T * 1.2} height={T * 1.6} shapeRendering="geometricPrecision">
          {/* hoop rim seen from above (open mouth) */}
          <ellipse cx="10" cy="6" rx="8" ry="4" fill="#9CA3AF" stroke={C} strokeWidth=".6"/>
          <ellipse cx="10" cy="6" rx="6" ry="2.8" fill={bagDk}/>
          <ellipse cx="10" cy="5.6" rx="4.4" ry="1.9" fill={bag}/>{/* linen stuffed in */}
          {/* fabric bag body billowing down (continuous from the rim) */}
          <path d="M2.4 6.5 Q1 17 5 21 L15 21 Q19 17 17.6 6.5" fill={bag} stroke={C} strokeWidth=".6"/>
          <path d="M5 11 Q10 13 15 11" fill="none" stroke={bagDk} strokeWidth=".7" opacity=".7"/>
          <path d="M4.4 15 Q10 17.5 15.6 15" fill="none" stroke={bagDk} strokeWidth=".7" opacity=".7"/>
          {/* wheeled foot ring */}
          <ellipse cx="10" cy="21.5" rx="6" ry="1.8" fill="#6B7280" stroke={C} strokeWidth=".4"/>
          <ellipse cx="5.5" cy="23.5" rx="1.6" ry="1.2" fill="#2C3239"/>
          <ellipse cx="14.5" cy="23.5" rx="1.6" ry="1.2" fill="#2C3239"/>
        </svg>
      </div>
    );
  }

  // ─── SluiceSink — 배설물 처리 싱크대 (깊은 클리닉 싱크) ────────────
  function SluiceSink({ x, y }) {
    return (
      <div style={{ position: 'absolute', left: x * T, top: y * T - 2, width: T * 1.6, height: T * 1.7, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.24))' }}>
        <svg viewBox="0 0 26 28" width={T * 1.6} height={T * 1.7} shapeRendering="geometricPrecision">
          {/* TOP counter face (dominant) folding into a continuous front cabinet */}
          <path d="M2 16 L24 16 L24 25 Q24 26 23 26 L3 26 Q2 26 2 25 Z" fill="#9AA6B2" stroke={C} strokeWidth=".7"/>
          <rect x="2" y="4" width="22" height="12" rx="1" fill="#C3CAD1" stroke={C} strokeWidth=".7"/>
          {/* deep basin opening seen from above (inset well) */}
          <rect x="5" y="6" width="16" height="8.5" rx="1.2" fill="#7E8893" stroke={C} strokeWidth=".6"/>
          <rect x="6.5" y="7.2" width="13" height="6" rx=".8" fill="#5E6773"/>
          <ellipse cx="13" cy="10.3" rx="2.4" ry="1.4" fill="#454E58"/>{/* drain */}
          {/* faucet + sprayer mounted at the back edge, arching over the basin */}
          <rect x="11.5" y="2.5" width="1.8" height="3.5" rx=".6" fill="#9CA3AF" stroke={C} strokeWidth=".35"/>
          <path d="M12.4 3 Q17 2.2 17 6" fill="none" stroke="#9CA3AF" strokeWidth="1.4"/>
          <rect x="20" y="4.5" width="2.6" height="3" rx=".5" fill="#6B7280" stroke={C} strokeWidth=".35"/>{/* flush valve */}
          <line x1="2" y1="16" x2="24" y2="16" stroke={C} strokeWidth=".55"/>{/* top↔front seam */}
          {/* viewer-facing cabinet doors on the front band */}
          <rect x="4" y="17.5" width="7.5" height="7" rx=".4" fill="#EDEFF2" stroke={C} strokeWidth=".4"/>
          <rect x="14.5" y="17.5" width="7.5" height="7" rx=".4" fill="#EDEFF2" stroke={C} strokeWidth=".4"/>
          <rect x="10.3" y="20" width="1.4" height="2" fill="#9CA3AF"/>
          <rect x="14.8" y="20" width="1.4" height="2" fill="#9CA3AF"/>
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
      <div style={{ position: 'absolute', left: x * T, top: y * T - 4, width: W, height: H, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.22))' }}>
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
      <div style={{ position: 'absolute', left: x * T, top: y * T - 4, width: T * 1.5, height: T * 1.8, filter: 'drop-shadow(3px 0px 0 rgba(0,0,0,.24))' }}>
        <svg viewBox="0 0 24 30" width={T * 1.5} height={T * 1.8} shapeRendering="geometricPrecision">
          {/* full silhouette */}
          <path d="M2 2 Q1 2 1 3 L1 25 Q1 26 2 26 L22 26 Q23 26 23 25 L23 3 Q23 2 22 2 Z" fill="#B7C0C8"/>
          {/* TOP face — IV-bag boxes seen from above (D5/NS/HS) */}
          <path d="M2 2 Q1 2 1 3 L1 14 L23 14 L23 3 Q23 2 22 2 Z" fill="#CFE3EC"/>
          {[0,1,2].map(i => (
            <g key={i}>
              <rect x={2.5 + i*7} y="3.6" width="6" height="8.4" rx=".5" fill="#EAF6FA" stroke={C} strokeWidth=".35"/>
              <rect x={2.5 + i*7} y="3.6" width="6" height="2.4" rx=".4" fill="#BFE0EA"/>
              <text x={5.5 + i*7} y="5.4" fontSize="2.2" fill="#2563EB" textAnchor="middle" fontFamily="monospace">{['D5','NS','HS'][i]}</text>
            </g>
          ))}
          {/* seam top → front */}
          <line x1="1" y1="14" x2="23" y2="14" stroke={C} strokeWidth=".6"/>
          {/* FRONT band — a drawer of stock */}
          <rect x="2.5" y="15.4" width="19" height="4.4" rx=".4" fill="#C8CDD2" stroke={C} strokeWidth=".4"/>
          <rect x="10" y="17" width="4" height="1.2" fill="#9CA3AF"/>
          <rect x="2.5" y="20.6" width="19" height="4.4" rx=".4" fill="#C8CDD2" stroke={C} strokeWidth=".4"/>
          <rect x="10" y="22.2" width="4" height="1.2" fill="#9CA3AF"/>
          {/* outer outline */}
          <path d="M2 2 Q1 2 1 3 L1 25 Q1 26 2 26 L22 26 Q23 26 23 25 L23 3 Q23 2 22 2 Z" fill="none" stroke={C} strokeWidth=".65"/>
          {/* wheels */}
          <ellipse cx="4.5" cy="27.5" rx="2" ry="1.4" fill="#2C3239"/>
          <ellipse cx="19.5" cy="27.5" rx="2" ry="1.4" fill="#2C3239"/>
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
