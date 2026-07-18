// Outpatient Infusion Center objects — faithful RN-svg ports of the handoff.
// The three chemo-specific pieces (InfusionChair/SmartInfusionPump/PPEStation)
// come from interior-objects-onco2.jsx (infusion reuses the oncology catalog);
// CoffeeMachine is lifted from interior-icu.jsx (unported until now). Authored at
// ITILE=16, rendered at TILE px via S; Box maps the handoff x*ITILE / top-N
// offsets 1:1. v13+ 2.5D: floor objects carry a ground-contact ellipse shadow.
// Dispatched via InfusionObjectView. Cross-dept reused pieces (pneumatictube/
// medfridge/handsanitizer/crashcart/compcart/watercooler/coffeetable/
// nursestation/deskphone/ireception/icabinet/imonitor/ichair/iplant/baylabel)
// resolve on the shared dispatch chain.
import { type ReactElement } from 'react';
import { View } from 'react-native';
import Svg, { Ellipse, G, Line, Path, Rect } from 'react-native-svg';
import { TILE } from '@engine';
import type { MapObject } from '@engine';

const C = '#2A2522';
const S = TILE / 16;

function Box({ x, y, offX = 0, offY = 0, w, h, z, children }: { x: number; y: number; offX?: number; offY?: number; w: number; h: number; z?: number; children: React.ReactNode }) {
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: x * TILE + offX * S, top: y * TILE + offY * S, width: w * S, height: h * S, zIndex: z }}>{children}</View>
  );
}

// ─── InfusionChair — 항암 주입 리클라이너 (넓은 팔걸이 + 랩 담요) ──────
export function InfusionChair({ x, y, occupied }: { x: number; y: number; occupied?: boolean }) {
  return (
    <Box x={x} y={y} offY={-4} w={42} h={54}>
      <Svg viewBox="0 0 42 54" width={42 * S} height={54 * S}>
        <Ellipse cx={21} cy={52} rx={16} ry={2.4} fill="rgba(0,0,0,0.16)" />
        <Path d="M8 40 L34 40 L33 49 Q33 50 32 50 L10 50 Q9 50 9 49 Z" fill="#3E6470" stroke={C} strokeWidth={0.7} />
        <Rect x={10} y={41.5} width={22} height={7} rx={2} fill="#5B8593" />
        <Path d="M5 20 L37 20 L37 40 L5 40 Z" fill="#4F7C8A" stroke={C} strokeWidth={0.7} />
        <Rect x={7} y={22} width={28} height={16} rx={2.5} fill="#6E9DAB" />
        <Path d="M21 22 L21 38" stroke="#5B8A99" strokeWidth={0.5} />
        <Path d="M5 2 L37 2 Q38 2 38 3 L38 20 L4 20 L4 3 Q4 2 5 2 Z" fill="#4F7C8A" stroke={C} strokeWidth={0.7} />
        <Rect x={7} y={4} width={28} height={14} rx={3} fill="#6E9DAB" />
        <Rect x={13} y={3} width={16} height={4.5} rx={2} fill="#89B4C0" />
        <Path d="M0.5 20 L5 20 L5 42 Q5 43 4 43 L1.5 43 Q0.5 43 0.5 42 Z" fill="#37525C" stroke={C} strokeWidth={0.6} />
        <Path d="M37 20 L41.5 20 L41.5 42 Q41.5 43 40.5 43 L38 43 Q37 43 37 42 Z" fill="#37525C" stroke={C} strokeWidth={0.6} />
        <Rect x={1.4} y={22} width={3} height={16} rx={1.2} fill="#48697A" />
        <Rect x={37.6} y={22} width={3} height={16} rx={1.2} fill="#48697A" />
        {occupied && (
          <G>
            <Rect x={17} y={6} width={8} height={7} rx={3} fill="#FBD9C0" stroke={C} strokeWidth={0.3} />
            <Rect x={17.3} y={5.1} width={7.4} height={1.6} fill="#5B4636" />
            <Path d="M14 20 L28 20 L26 34 L16 34 Z" fill="#8FB6C2" stroke={C} strokeWidth={0.4} />
            <Rect x={10} y={30} width={22} height={12} rx={2.5} fill="#DDE9C8" stroke={C} strokeWidth={0.4} />
            <Path d="M10 35 L32 35 M10 38.5 L32 38.5" stroke="#C2D3A8" strokeWidth={0.5} />
            <Path d="M28 24 Q36 22 39 24" fill="none" stroke="#C0392B" strokeWidth={0.6} />
          </G>
        )}
      </Svg>
    </Box>
  );
}

// ─── SmartInfusionPump — 스마트 인퓨전 펌프 (이중 채널 + 항암 백 + 폴대) ─
export function SmartInfusionPump({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-20} w={16} h={48}>
      <Svg viewBox="0 0 16 48" width={16 * S} height={48 * S}>
        <Ellipse cx={8} cy={46.5} rx={6} ry={1.9} fill="rgba(0,0,0,0.16)" />
        <Rect x={4} y={0} width={8} height={1.2} fill="#9CA3AF" />
        <Rect x={3} y={1.2} width={4.5} height={7} rx={1} fill="#F4C77A" stroke={C} strokeWidth={0.4} />
        <Rect x={8.5} y={1.2} width={4.5} height={7} rx={1} fill="#CFE6EE" stroke={C} strokeWidth={0.4} />
        <Rect x={3.6} y={3} width={3.3} height={1.6} fill="#7C3AED" />
        <Rect x={2} y={10} width={12} height={12} rx={1} fill="#475569" stroke={C} strokeWidth={0.5} />
        <Rect x={3} y={11} width={10} height={4.5} fill="#0F1A24" />
        <Rect x={3.6} y={12} width={6} height={1} fill="#A78BFA" />
        <Rect x={3.6} y={13.6} width={8} height={1} fill="#22D3EE" />
        <Rect x={3} y={16.5} width={4.5} height={4} fill="#5B6672" />
        <Rect x={8.5} y={16.5} width={4.5} height={4} fill="#5B6672" />
        <Rect x={7} y={22} width={2} height={20} fill="#CBD5E1" stroke={C} strokeWidth={0.3} />
        <Ellipse cx={8} cy={43} rx={5.5} ry={1.8} fill="#6B7280" stroke={C} strokeWidth={0.4} />
      </Svg>
    </Box>
  );
}

// ─── PPEStation — 방호구 스테이션 (가운·마스크·장갑 걸이, 벽 부착 보드) ─
export function PPEStation({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} w={26} h={24}>
      <Svg viewBox="0 0 26 24" width={26 * S} height={24 * S}>
        <Ellipse cx={13} cy={22.5} rx={9} ry={1.8} fill="rgba(0,0,0,0.14)" />
        <Rect x={1} y={1} width={24} height={20} rx={1} fill="#DCE3E8" stroke={C} strokeWidth={0.6} />
        <Path d="M4 4 L10 4 L11 14 L3 14 Z" fill="#FEF3C7" stroke={C} strokeWidth={0.4} />
        <Rect x={6} y={3} width={2} height={1.5} fill="#9CA3AF" />
        <Rect x={13} y={4} width={10} height={4} fill="#A5D8E8" stroke={C} strokeWidth={0.4} />
        <Rect x={13} y={9} width={10} height={4} fill="#BFE0EA" stroke={C} strokeWidth={0.4} />
        <Rect x={13} y={14} width={10} height={4} fill="#F9C9D6" stroke={C} strokeWidth={0.4} />
        <Rect x={14.5} y={4.8} width={4} height={1.2} fill="#fff" />
        <Rect x={14.5} y={9.8} width={4} height={1.2} fill="#fff" />
        <Rect x={14.5} y={14.8} width={4} height={1.2} fill="#fff" />
      </Svg>
    </Box>
  );
}

// ─── CoffeeMachine — 원두 그라인더 커피머신 (다과 코너), from interior-icu.jsx ─
export function CoffeeMachine({ x, y }: { x: number; y: number }) {
  return (
    <Box x={x} y={y} offY={-4} w={20} h={28}>
      <Svg viewBox="0 0 20 28" width={20 * S} height={28 * S}>
        <Ellipse cx={10.0} cy={26.7} rx={6.8} ry={2.3} fill="rgba(0,0,0,0.16)" />
        <Path d="M2 3 Q1 3 1 4 L1 24 Q1 25 2 25 L18 25 Q19 25 19 24 L19 4 Q19 3 18 3 Z" fill="#4E5865" />
        <Path d="M2 3 Q1 3 1 4 L1 17 L19 17 L19 4 Q19 3 18 3 Z" fill="#5E6A78" />
        <Rect x={3} y={4.4} width={14} height={1.6} fill="#727E8C" />
        <Ellipse cx={13.5} cy={10} rx={3.4} ry={2.8} fill="#2A1C10" stroke={C} strokeWidth={0.5} />
        <Ellipse cx={13.5} cy={9.4} rx={2} ry={1.5} fill="#4A3420" />
        {[4, 6, 8].map((gx, i) => (<Rect key={i} x={gx} y={8} width={1} height={6} fill="#3A424C" />))}
        <Line x1={1} y1={17} x2={19} y2={17} stroke={C} strokeWidth={0.55} />
        <Rect x={2.4} y={18} width={7} height={3.2} rx={0.4} fill="#0F1A24" />
        <Rect x={4.6} y={19} width={2.6} height={1.6} rx={0.4} fill="#22D3EE" />
        <Rect x={12} y={18} width={4} height={1.6} fill="#2C3239" />
        <Rect x={13.4} y={19.6} width={1.2} height={2} fill="#2C3239" />
        <Path d="M12 22 L16 22 L15.4 24.4 L12.6 24.4 Z" fill="#fff" stroke={C} strokeWidth={0.4} />
        <Path d="M2 3 Q1 3 1 4 L1 24 Q1 25 2 25 L18 25 Q19 25 19 24 L19 4 Q19 3 18 3 Z" fill="none" stroke={C} strokeWidth={0.65} />
      </Svg>
    </Box>
  );
}

export function InfusionObjectView({ object }: { object: MapObject }): ReactElement | null {
  const { type, x, y, props } = object;
  switch (type) {
    case 'infusionchair': return <InfusionChair x={x} y={y} occupied={props?.occupied === true} />;
    case 'smartinfusionpump': return <SmartInfusionPump x={x} y={y} />;
    case 'ppestation': return <PPEStation x={x} y={y} />;
    case 'coffeemachine': return <CoffeeMachine x={x} y={y} />;
    default: return null;
  }
}
