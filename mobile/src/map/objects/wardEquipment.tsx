// Internal-Medicine inpatient Ward objects — faithful RN-svg ports of the handoff
// interior-objects-ward2.jsx catalog + the ward-local helpers in interior-ward.jsx
// (MealCart, SharpsBin, IsoSign, DedicatedBP) plus a small DeskPhone. Authored at
// ITILE=16, rendered at TILE px via S; Box maps the handoff's x*ITILE / top-N
// offsets 1:1. SVG `<text>` → shape blocks; the handoff's DIV sign (IsoSign) is
// recreated with RN Views/Text. v13 2.5D: floor objects carry a ground shadow.
// Dispatched via WardObjectView. Cross-dept pieces (ibed/imonitor/iiv/icurtain/
// icabinet/ireception/nursestation/vitals/walltv/sofa/oxygen/wastebin/chartbinder/
// pneumatictube/barcodescanner/baylabel) resolve on the shared dispatch chain.
import { type ReactElement } from 'react';
import { Text, View } from 'react-native';
import Svg, { Circle, Ellipse, G, Line, Path, Rect } from 'react-native-svg';
import { TILE } from '@engine';
import type { MapObject } from '@engine';

const C = '#2A2522';
const S = TILE / 16;
const FONT = 'DungGeunMo';

function Box({ x, y, offX = 0, offY = 0, w, h, z, children }: { x: number; y: number; offX?: number; offY?: number; w: number; h: number; z?: number; children: React.ReactNode }) {
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: x * TILE + offX * S, top: y * TILE + offY * S, width: w * S, height: h * S, zIndex: z }}>{children}</View>
  );
}

// ─── O2Flowmeter — wall oxygen flow meter + humidifier + cannula line ──
export function O2Flowmeter({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offX={3} w={10} h={26}>
      <Svg viewBox="0 0 10 26" width={10 * S} height={26 * S}>
        <Ellipse cx={5.0} cy={25.0} rx={3.4} ry={2} fill="rgba(0,0,0,0.16)" />
        <Rect x={2} y={0} width={6} height={3} fill="#16A34A" stroke={C} strokeWidth={0.4} />
        <Rect x={2.5} y={3} width={5} height={11} fill="#D7EEF5" stroke={C} strokeWidth={0.4} />
        <Circle cx={5} cy={9} r={1.3} fill="#475569" />
        {[0, 1, 2, 3, 4].map((i) => <Rect key={i} x={2.5} y={5 + i * 1.8} width={1.4} height={0.5} fill={C} opacity={0.5} />)}
        <Rect x={2} y={14} width={6} height={6} fill="#BFE3EE" stroke={C} strokeWidth={0.4} />
        <Rect x={2.5} y={17} width={5} height={2.5} fill="#9FD0E4" />
        <Path d="M5 20 Q9 23 4 25" fill="none" stroke="#CFE3EC" strokeWidth={1.2} />
      </Svg>
    </Box>
  );
}

// ─── Nebulizer — inhalation compressor with mist puff ──────────────────
export function Nebulizer({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offX={2} offY={-2} w={20} h={24}>
      <Svg viewBox="0 0 20 24" width={20 * S} height={24 * S}>
        <Ellipse cx={10.0} cy={22.7} rx={6.8} ry={2.3} fill="rgba(0,0,0,0.16)" />
        <Ellipse cx={15} cy={4} rx={2.6} ry={1.7} fill="#BFE3EE" opacity={0.7} />
        <Ellipse cx={16.6} cy={2.4} rx={1.5} ry={1} fill="#D7EEF5" opacity={0.6} />
        <Path d="M6 7 L11 6 L11 9 L7 10 Z" fill="#CFE3EC" stroke={C} strokeWidth={0.4} />
        <Path d="M11 7 Q15 6 15 4" fill="none" stroke="#A8DCEC" strokeWidth={1.2} />
        <Path d="M2 12 L18 12 L18 20 Q18 21 17 21 L3 21 Q2 21 2 20 Z" fill="#B7BEC6" stroke={C} strokeWidth={0.7} />
        <Rect x={2} y={6} width={16} height={6} rx={1.2} fill="#D1D5DB" stroke={C} strokeWidth={0.7} />
        <Rect x={3.5} y={7.2} width={13} height={1.4} fill="#E1E5EA" />
        <Circle cx={14} cy={9.6} r={1.4} fill="#16A34A" stroke={C} strokeWidth={0.3} />
        <Line x1={2} y1={12} x2={18} y2={12} stroke={C} strokeWidth={0.55} />
        <Rect x={4} y={14} width={8} height={4} rx={0.5} fill="#0F1A24" />
        <Rect x={5} y={14.9} width={6} height={1} fill="#22D3EE" />
        <Rect x={5} y={16.4} width={4} height={1} fill="#10B981" />
        <Circle cx={15} cy={16} r={1.4} fill="#16A34A" stroke={C} strokeWidth={0.4} />
      </Svg>
    </Box>
  );
}

// ─── AirMattress — alternating-pressure pump (pressure-ulcer prevention) ─
export function AirMattress({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offX={2} offY={-2} w={20} h={22}>
      <Svg viewBox="0 0 20 22" width={20 * S} height={22 * S}>
        <Ellipse cx={10.0} cy={20.7} rx={6.8} ry={2.3} fill="rgba(0,0,0,0.16)" />
        <Path d="M2 11 L18 11 L18 18 Q18 19 17 19 L3 19 Q2 19 2 18 Z" fill="#3E4756" stroke={C} strokeWidth={0.7} />
        <Rect x={2} y={2} width={16} height={9} rx={1.2} fill="#4E5A6B" stroke={C} strokeWidth={0.7} />
        <Rect x={3.5} y={3.2} width={13} height={1.6} fill="#647388" />
        <Circle cx={6} cy={8} r={1.1} fill="#16A34A" />
        <Circle cx={10} cy={8} r={1.1} fill="#FACC15" />
        <Circle cx={14} cy={8} r={1.1} fill="#334155" />
        <Line x1={2} y1={11} x2={18} y2={11} stroke={C} strokeWidth={0.55} />
        <Rect x={4} y={12.6} width={7} height={3.6} rx={0.5} fill="#0F1A24" />
        <Rect x={5} y={13.5} width={5} height={1} fill="#22D3EE" />
        <Circle cx={14} cy={14.4} r={1.3} fill="#94A3B8" stroke={C} strokeWidth={0.3} />
        <Circle cx={16.4} cy={14.4} r={1.3} fill="#94A3B8" stroke={C} strokeWidth={0.3} />
        <Path d="M14 17 Q12 21 16 21" fill="none" stroke="#CBD5E1" strokeWidth={1.2} />
      </Svg>
    </Box>
  );
}

// ─── FallRiskSign — yellow fall-risk warning triangle (bed foot) ───────
export function FallRiskSign({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offX={3} offY={2} w={10} h={10} z={3}>
      <Svg viewBox="0 0 10 10" width={10 * S} height={10 * S}>
        <Ellipse cx={5.0} cy={9.0} rx={3.4} ry={2} fill="rgba(0,0,0,0.16)" />
        <Path d="M5 0 L10 9 L0 9 Z" fill="#FACC15" stroke="#DC2626" strokeWidth={0.8} />
        <Rect x={4.4} y={3} width={1.2} height={3} fill={C} />
        <Rect x={4.4} y={6.6} width={1.2} height={1.2} fill={C} />
      </Svg>
    </Box>
  );
}

// ─── NPOBoard — 'NPO 금식' bedside board ───────────────────────────────
export function NPOBoard({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offX={2} offY={2} w={14} h={9}>
      <Svg viewBox="0 0 14 9" width={14 * S} height={9 * S}>
        <Ellipse cx={7.0} cy={8.0} rx={4.8} ry={2} fill="rgba(0,0,0,0.16)" />
        <Rect x={0} y={0} width={14} height={9} fill="#fff" stroke={C} strokeWidth={0.6} />
        <Rect x={0} y={0} width={14} height={3} fill="#DC2626" />
        <Rect x={2} y={1} width={10} height={1} fill="#fff" opacity={0.8} />
        <Rect x={1.5} y={4.5} width={7} height={1} fill={C} opacity={0.5} />
        <Rect x={1.5} y={6.5} width={5} height={1} fill={C} opacity={0.5} />
      </Svg>
    </Box>
  );
}

// ─── IsolationCart — contact-isolation cart (yellow gowns/gloves) ──────
export function IsolationCart({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-6} w={22} h={32}>
      <Svg viewBox="0 0 22 32" width={22 * S} height={32 * S}>
        <Ellipse cx={11.0} cy={30.4} rx={7.5} ry={2.6} fill="rgba(0,0,0,0.16)" />
        <Path d="M3 3 Q2 3 2 4 L2 27 Q2 28 3 28 L19 28 Q20 28 20 27 L20 4 Q20 3 19 3 Z" fill="#C9CDD3" />
        <Path d="M3 3 Q2 3 2 4 L2 12 L20 12 L20 4 Q20 3 19 3 Z" fill="#FACC15" />
        <Rect x={4} y={7.6} width={6} height={3.4} rx={0.5} fill="#FEF3C7" stroke={C} strokeWidth={0.35} />
        <Rect x={12} y={7.6} width={6} height={3.4} rx={0.5} fill="#FDE68A" stroke={C} strokeWidth={0.35} />
        <Line x1={2} y1={12} x2={20} y2={12} stroke={C} strokeWidth={0.6} />
        <Rect x={3} y={13} width={4.8} height={5} rx={0.4} fill="#3B82F6" stroke={C} strokeWidth={0.4} />
        <Rect x={8.6} y={13} width={4.8} height={5} rx={0.4} fill="#16A34A" stroke={C} strokeWidth={0.4} />
        <Rect x={14.2} y={13} width={4.8} height={5} rx={0.4} fill="#DB2777" stroke={C} strokeWidth={0.4} />
        <Rect x={4} y={13.6} width={2.8} height={1.4} fill="#fff" opacity={0.75} />
        <Rect x={9.6} y={13.6} width={2.8} height={1.4} fill="#fff" opacity={0.75} />
        <Rect x={15.2} y={13.6} width={2.8} height={1.4} fill="#fff" opacity={0.75} />
        <Rect x={3} y={19} width={16} height={3} rx={0.3} fill="#EDEFF2" stroke={C} strokeWidth={0.4} />
        <Rect x={9} y={20} width={4} height={1} fill="#9CA3AF" />
        <Rect x={3} y={23} width={16} height={3} rx={0.3} fill="#EDEFF2" stroke={C} strokeWidth={0.4} />
        <Rect x={9} y={24} width={4} height={1} fill="#9CA3AF" />
        <Path d="M3 3 Q2 3 2 4 L2 27 Q2 28 3 28 L19 28 Q20 28 20 27 L20 4 Q20 3 19 3 Z" fill="none" stroke={C} strokeWidth={0.7} />
        <Ellipse cx={5} cy={29.5} rx={2} ry={1.4} fill="#2C3239" />
        <Ellipse cx={17} cy={29.5} rx={2} ry={1.4} fill="#2C3239" />
      </Svg>
    </Box>
  );
}

// ─── LinenHamper — wheeled fabric linen hamper (soiled/clean) ──────────
export function LinenHamper({ x, y, tone = 'soiled' }: { x: number; y: number; tone?: string }) {
  const bag = tone === 'soiled' ? '#D8D2C4' : '#BAE6FD';
  const bagDk = tone === 'soiled' ? '#BEB7A4' : '#8EC9E8';
  return (
    <Box x={x} y={y} offX={2} offY={-2} w={20} h={26}>
      <Svg viewBox="0 0 20 26" width={20 * S} height={26 * S}>
        <Ellipse cx={10.0} cy={24.7} rx={6.8} ry={2.3} fill="rgba(0,0,0,0.16)" />
        <Ellipse cx={10} cy={6} rx={8} ry={4} fill="#9CA3AF" stroke={C} strokeWidth={0.6} />
        <Ellipse cx={10} cy={6} rx={6} ry={2.8} fill={bagDk} />
        <Ellipse cx={10} cy={5.6} rx={4.4} ry={1.9} fill={bag} />
        <Path d="M2.4 6.5 Q1 17 5 21 L15 21 Q19 17 17.6 6.5" fill={bag} stroke={C} strokeWidth={0.6} />
        <Path d="M5 11 Q10 13 15 11" fill="none" stroke={bagDk} strokeWidth={0.7} opacity={0.7} />
        <Path d="M4.4 15 Q10 17.5 15.6 15" fill="none" stroke={bagDk} strokeWidth={0.7} opacity={0.7} />
        <Ellipse cx={10} cy={21.5} rx={6} ry={1.8} fill="#6B7280" stroke={C} strokeWidth={0.4} />
        <Ellipse cx={5.5} cy={23.5} rx={1.6} ry={1.2} fill="#2C3239" />
        <Ellipse cx={14.5} cy={23.5} rx={1.6} ry={1.2} fill="#2C3239" />
      </Svg>
    </Box>
  );
}

// ─── SluiceSink — deep dirty-utility sluice sink ───────────────────────
export function SluiceSink({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-2} w={26} h={28}>
      <Svg viewBox="0 0 26 28" width={26 * S} height={28 * S}>
        <Ellipse cx={13.0} cy={26} rx={8.8} ry={3} fill="rgba(0,0,0,0.16)" />
        <Path d="M2 16 L24 16 L24 25 Q24 26 23 26 L3 26 Q2 26 2 25 Z" fill="#9AA6B2" stroke={C} strokeWidth={0.7} />
        <Rect x={2} y={4} width={22} height={12} rx={1} fill="#C3CAD1" stroke={C} strokeWidth={0.7} />
        <Rect x={5} y={6} width={16} height={8.5} rx={1.2} fill="#7E8893" stroke={C} strokeWidth={0.6} />
        <Rect x={6.5} y={7.2} width={13} height={6} rx={0.8} fill="#5E6773" />
        <Ellipse cx={13} cy={10.3} rx={2.4} ry={1.4} fill="#454E58" />
        <Rect x={11.5} y={2.5} width={1.8} height={3.5} rx={0.6} fill="#9CA3AF" stroke={C} strokeWidth={0.35} />
        <Path d="M12.4 3 Q17 2.2 17 6" fill="none" stroke="#9CA3AF" strokeWidth={1.4} />
        <Rect x={20} y={4.5} width={2.6} height={3} rx={0.5} fill="#6B7280" stroke={C} strokeWidth={0.35} />
        <Line x1={2} y1={16} x2={24} y2={16} stroke={C} strokeWidth={0.55} />
        <Rect x={4} y={17.5} width={7.5} height={7} rx={0.4} fill="#EDEFF2" stroke={C} strokeWidth={0.4} />
        <Rect x={14.5} y={17.5} width={7.5} height={7} rx={0.4} fill="#EDEFF2" stroke={C} strokeWidth={0.4} />
        <Rect x={10.3} y={20} width={1.4} height={2} fill="#9CA3AF" />
        <Rect x={14.8} y={20} width={1.4} height={2} fill="#9CA3AF" />
      </Svg>
    </Box>
  );
}

// ─── SupplyBasketShelf — labelled supply-basket shelving (w tiles) ─────
export function SupplyBasketShelf({ x, y, w = 4, shelves = 4 }: { x: number; y: number; w?: number; shelves?: number }) {
  const W = w * 16;
  const baskets = ['#BAE6FD', '#FBCFE8', '#FEF08A', '#BBF7D0', '#DDD6FE', '#FED7AA'];
  const rowEls: ReactElement[] = [];
  for (let s = 0; s < shelves; s++) {
    const top = 2 + s * ((24 - 2) / shelves);
    const slotH = (24 - 2) / shelves;
    const items: ReactElement[] = [];
    const per = w * 2;
    for (let i = 0; i < per; i++) {
      const bw = (W - 2) / per - 0.6;
      const bx = 1 + i * ((W - 2) / per);
      items.push(
        <G key={i}>
          <Rect x={bx} y={top + 1} width={bw} height={slotH - 2.6} fill={baskets[(i + s) % baskets.length]} stroke={C} strokeWidth={0.3} />
          <Rect x={bx} y={top + 1} width={bw} height={1.2} fill="#fff" opacity={0.7} />
        </G>,
      );
    }
    rowEls.push(
      <G key={s}>
        {items}
        <Rect x={0.5} y={top + slotH - 1.4} width={W - 1} height={1.4} fill="#E8E5DB" stroke={C} strokeWidth={0.4} />
      </G>,
    );
  }
  return (
    <Box x={x} y={y} offY={-4} w={W} h={26} z={1}>
      <Svg viewBox={`0 0 ${W} 26`} width={W * S} height={26 * S} preserveAspectRatio="none">
        <Rect x={0} y={0} width={W} height={26} fill="#EFEDE4" stroke={C} strokeWidth={0.7} />
        <Rect x={0} y={0} width={1} height={26} fill="#D7D3C6" />
        <Rect x={W - 1} y={0} width={1} height={26} fill="#D7D3C6" />
        {rowEls}
      </Svg>
    </Box>
  );
}

// ─── IVStorageCart — IV-bag storage cart (D5/NS/HS boxes) ──────────────
export function IVStorageCart({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-4} w={24} h={30}>
      <Svg viewBox="0 0 24 30" width={24 * S} height={30 * S}>
        <Ellipse cx={12.0} cy={28.2} rx={8.2} ry={2.8} fill="rgba(0,0,0,0.16)" />
        <Path d="M2 2 Q1 2 1 3 L1 25 Q1 26 2 26 L22 26 Q23 26 23 25 L23 3 Q23 2 22 2 Z" fill="#B7C0C8" />
        <Path d="M2 2 Q1 2 1 3 L1 14 L23 14 L23 3 Q23 2 22 2 Z" fill="#CFE3EC" />
        {[0, 1, 2].map((i) => (
          <G key={i}>
            <Rect x={2.5 + i * 7} y={3.6} width={6} height={8.4} rx={0.5} fill="#EAF6FA" stroke={C} strokeWidth={0.35} />
            <Rect x={2.5 + i * 7} y={3.6} width={6} height={2.4} rx={0.4} fill="#BFE0EA" />
          </G>
        ))}
        <Line x1={1} y1={14} x2={23} y2={14} stroke={C} strokeWidth={0.6} />
        <Rect x={2.5} y={15.4} width={19} height={4.4} rx={0.4} fill="#C8CDD2" stroke={C} strokeWidth={0.4} />
        <Rect x={10} y={17} width={4} height={1.2} fill="#9CA3AF" />
        <Rect x={2.5} y={20.6} width={19} height={4.4} rx={0.4} fill="#C8CDD2" stroke={C} strokeWidth={0.4} />
        <Rect x={10} y={22.2} width={4} height={1.2} fill="#9CA3AF" />
        <Path d="M2 2 Q1 2 1 3 L1 25 Q1 26 2 26 L22 26 Q23 26 23 25 L23 3 Q23 2 22 2 Z" fill="none" stroke={C} strokeWidth={0.65} />
        <Ellipse cx={4.5} cy={27.5} rx={2} ry={1.4} fill="#2C3239" />
        <Ellipse cx={19.5} cy={27.5} rx={2} ry={1.4} fill="#2C3239" />
      </Svg>
    </Box>
  );
}

// ─── Handrail — corridor wall grab-rail (w tiles, horizontal/vertical) ─
export function Handrail({ x, y, w = 4, vertical = false }: { x: number; y: number; w?: number; vertical?: boolean }) {
  const L = w * 16;
  if (vertical) {
    return (
      <Box x={x} y={y} w={8} h={L}>
        <Svg viewBox={`0 0 8 ${L}`} width={8 * S} height={L * S} preserveAspectRatio="none">
          <Rect x={2.5} y={1} width={3} height={L - 2} fill="#C8CDD2" stroke={C} strokeWidth={0.5} />
          <Rect x={3} y={1} width={1} height={L - 2} fill="#EAECEE" />
          {Array.from({ length: w }).map((_, i) => <Rect key={i} x={0} y={4 + i * 16} width={2.5} height={2} fill="#9CA3AF" stroke={C} strokeWidth={0.3} />)}
        </Svg>
      </Box>
    );
  }
  return (
    <Box x={x} y={y} w={L} h={8}>
      <Svg viewBox={`0 0 ${L} 8`} width={L * S} height={8 * S} preserveAspectRatio="none">
        <Rect x={1} y={2.5} width={L - 2} height={3} fill="#C8CDD2" stroke={C} strokeWidth={0.5} />
        <Rect x={1} y={3} width={L - 2} height={1} fill="#EAECEE" />
        {Array.from({ length: w }).map((_, i) => <Rect key={i} x={4 + i * 16} y={0} width={2} height={2.5} fill="#9CA3AF" stroke={C} strokeWidth={0.3} />)}
      </Svg>
    </Box>
  );
}

// ─── MealCart — meal-tray delivery cart ────────────────────────────────
export function MealCart({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-2} w={26} h={30}>
      <Svg viewBox="0 0 26 30" width={26 * S} height={30 * S}>
        <Ellipse cx={13.0} cy={28} rx={8.8} ry={3} fill="rgba(0,0,0,0.16)" />
        <Rect x={2} y={2} width={22} height={24} fill="#CBD5E1" stroke={C} strokeWidth={0.6} />
        {[0, 1, 2, 3].map((i) => (
          <G key={i}>
            <Rect x={3} y={4 + i * 5.5} width={20} height={4.5} fill="#E5E7EB" stroke={C} strokeWidth={0.4} />
            <Rect x={5} y={5 + i * 5.5} width={6} height={2.5} fill="#FBBF24" />
            <Rect x={12} y={5 + i * 5.5} width={4} height={2.5} fill="#A7F3D0" />
            <Rect x={17} y={5 + i * 5.5} width={3} height={2.5} fill="#FCA5A5" />
          </G>
        ))}
        <Ellipse cx={6} cy={28} rx={2.2} ry={1.6} fill={C} />
        <Ellipse cx={20} cy={28} rx={2.2} ry={1.6} fill={C} />
      </Svg>
    </Box>
  );
}

// ─── SharpsBin — sharps disposal container ─────────────────────────────
export function SharpsBin({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offX={3} offY={2} w={10} h={12}>
      <Svg viewBox="0 0 10 12" width={10 * S} height={12 * S}>
        <Ellipse cx={5.0} cy={11.0} rx={3.4} ry={2} fill="rgba(0,0,0,0.16)" />
        <Rect x={1} y={0} width={8} height={3} fill="#B45309" stroke={C} strokeWidth={0.4} />
        <Rect x={3} y={1} width={4} height={1.2} fill="#0F1A24" />
        <Rect x={1} y={3} width={8} height={8} fill="#FACC15" stroke={C} strokeWidth={0.5} />
        <Path d="M5 5.2 L6.4 7.6 L3.6 7.6 Z" fill="#B45309" />
      </Svg>
    </Box>
  );
}

// ─── DedicatedBP — isolation-room dedicated BP monitor on a stand ──────
export function DedicatedBP({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-12} w={16} h={36}>
      <Svg viewBox="0 0 16 36" width={16 * S} height={36 * S}>
        <Ellipse cx={8.0} cy={35.0} rx={5.4} ry={2} fill="rgba(0,0,0,0.16)" />
        <Rect x={4} y={20} width={2} height={14} fill="#CBD5E1" stroke={C} strokeWidth={0.3} />
        <Rect x={2} y={6} width={12} height={11} fill="#475569" stroke={C} strokeWidth={0.5} />
        <Rect x={3} y={7.5} width={10} height={6} fill="#0F1A24" />
        <Rect x={4} y={9} width={8} height={1.6} fill="#22D3EE" />
        <Rect x={10} y={17} width={5} height={4} rx={1} fill="#FACC15" stroke={C} strokeWidth={0.4} />
        <Ellipse cx={5} cy={34} rx={4} ry={1.6} fill="#6B7280" stroke={C} strokeWidth={0.4} />
        <Rect x={1} y={3} width={9} height={3} fill="#FACC15" stroke={C} strokeWidth={0.3} />
      </Svg>
    </Box>
  );
}

// ─── DeskPhone — nurse-station desk telephone ──────────────────────────
export function DeskPhone({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-2} w={16} h={14}>
      <Svg viewBox="0 0 16 14" width={16 * S} height={14 * S}>
        <Ellipse cx={8.0} cy={12.6} rx={6} ry={1.8} fill="rgba(0,0,0,0.16)" />
        <Rect x={2} y={4} width={12} height={8} rx={1} fill="#374151" stroke={C} strokeWidth={0.5} />
        <Rect x={3.5} y={6} width={5} height={4.5} fill="#4B5563" stroke={C} strokeWidth={0.3} />
        {[0, 1, 2].map((r) => [0, 1, 2].map((c) => <Rect key={r + '-' + c} x={4 + c * 1.4} y={6.6 + r * 1.3} width={0.9} height={0.9} fill="#1F2937" />))}
        <Rect x={9.5} y={6} width={3.5} height={2} rx={0.3} fill="#0F1A24" />
        <Rect x={10} y={6.5} width={2.5} height={1} fill="#22D3EE" />
        {/* handset on top */}
        <Rect x={1} y={2} width={14} height={2.4} rx={1.2} fill="#4B5563" stroke={C} strokeWidth={0.5} />
        <Rect x={1} y={2} width={2.6} height={2.4} rx={1.2} fill="#374151" />
        <Rect x={12.4} y={2} width={2.6} height={2.4} rx={1.2} fill="#374151" />
      </Svg>
    </Box>
  );
}

// ─── IsoSign — CONTACT ISOLATION door sign (DIV → View/Text) ───────────
export function IsoSign({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offX={-4} offY={-14} w={40} h={22} z={4}>
      <View style={{ alignSelf: 'flex-start', backgroundColor: '#FACC15', borderWidth: 2.5, borderColor: '#DC2626', paddingHorizontal: 5, paddingVertical: 2 }}>
        <Text style={{ fontFamily: FONT, fontSize: 8, color: '#7F1D1D', textAlign: 'center', lineHeight: 10 }}>CONTACT{'\n'}ISOLATION</Text>
      </View>
    </Box>
  );
}

const num = (v: unknown, d: number) => (typeof v === 'number' ? v : d);
const str = (v: unknown, d: string) => (typeof v === 'string' ? v : d);

export function WardObjectView({ object }: { object: MapObject }): ReactElement | null {
  const { type, x, y, props } = object;
  switch (type) {
    case 'o2flowmeter': return <O2Flowmeter x={x} y={y} />;
    case 'nebulizer': return <Nebulizer x={x} y={y} />;
    case 'airmattress': return <AirMattress x={x} y={y} />;
    case 'fallrisksign': return <FallRiskSign x={x} y={y} />;
    case 'npoboard': return <NPOBoard x={x} y={y} />;
    case 'isolationcart': return <IsolationCart x={x} y={y} />;
    case 'linenhamper': return <LinenHamper x={x} y={y} tone={str(props?.tone, 'soiled')} />;
    case 'sluicesink': return <SluiceSink x={x} y={y} />;
    case 'supplybasketshelf': return <SupplyBasketShelf x={x} y={y} w={num(props?.w, 4)} shelves={num(props?.shelves, 4)} />;
    case 'ivstoragecart': return <IVStorageCart x={x} y={y} />;
    case 'handrail': return <Handrail x={x} y={y} w={num(props?.w, 4)} vertical={!!props?.vertical} />;
    case 'mealcart': return <MealCart x={x} y={y} />;
    case 'sharpsbin': return <SharpsBin x={x} y={y} />;
    case 'dedicatedbp': return <DedicatedBP x={x} y={y} />;
    case 'deskphone': return <DeskPhone x={x} y={y} />;
    case 'isosign': return <IsoSign x={x} y={y} />;
    default: return null;
  }
}
