// Visual-novel-scale face portraits — faithful RN port of design-handoff
// reference/forin-faces.jsx. Same identity vocabulary as the chibi Sprite (hair
// color/style, skin, cap, scrub color) at higher resolution (viewBox 16×18, with
// headroom -1 -4 18 22) so the 12 expressions read legibly. Used by dialogue /
// briefing (Stage 2-6). Rendered with react-native-svg (rect-based pixel art).
import { memo } from 'react';
import Svg, { G, Path, Rect, Text as SvgText } from 'react-native-svg';
import type { Expression, HairStyle, RoleKind } from './Sprite';

const OUTLINE = '#1F1A14';
const BLUSH = '#F9A8B4';
const TEAR = '#3B82F6';

function mix(a: string, b: string, t: number): string {
  const p = (h: string) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  const [ar, ag, ab] = p(a);
  const [br, bg, bb] = p(b);
  const rr = Math.round(ar + (br - ar) * t);
  const gg = Math.round(ag + (bg - ag) * t);
  const bl = Math.round(ab + (bb - ab) * t);
  return '#' + [rr, gg, bl].map((v) => v.toString(16).padStart(2, '0')).join('');
}

// ── HAIR PLATES (drawn after skin, before expression). ViewBox 16×18. ──
function HairPlate({ style, hair, hatTone, hatTrim, skin }: { style: HairStyle; hair: string; hatTone?: string; hatTrim?: string; skin: string }) {
  const H = hair;
  const HL = mix(hair, '#FFFFFF', 0.2);
  const HD = mix(hair, OUTLINE, 0.3);

  switch (style) {
    case 'short':
      return (
        <G>
          <Rect x={5} y={0} width={6} height={1} fill={H} />
          <Rect x={3} y={1} width={10} height={1} fill={H} />
          <Rect x={2} y={2} width={12} height={2} fill={H} />
          <Rect x={2} y={4} width={3} height={1} fill={H} />
          <Rect x={11} y={4} width={3} height={1} fill={H} />
          <Rect x={4} y={1} width={6} height={1} fill={HL} />
          <Rect x={3} y={2} width={8} height={0.5} fill={HL} />
          <Rect x={5} y={0} width={1} height={1} fill={OUTLINE} />
          <Rect x={10} y={0} width={1} height={1} fill={OUTLINE} />
          <Rect x={3} y={1} width={1} height={1} fill={OUTLINE} />
          <Rect x={12} y={1} width={1} height={1} fill={OUTLINE} />
          <Rect x={2} y={2} width={1} height={2} fill={OUTLINE} />
          <Rect x={13} y={2} width={1} height={2} fill={OUTLINE} />
        </G>
      );
    case 'bob':
      return (
        <G>
          <Rect x={4} y={0} width={8} height={1} fill={H} />
          <Rect x={2} y={1} width={12} height={3} fill={H} />
          <Rect x={2} y={4} width={3} height={1} fill={H} />
          <Rect x={11} y={4} width={3} height={1} fill={H} />
          <Rect x={2} y={4} width={2} height={6} fill={H} />
          <Rect x={12} y={4} width={2} height={6} fill={H} />
          <Rect x={3} y={1} width={8} height={1} fill={HL} />
          <Rect x={2} y={9} width={2} height={1} fill={HD} />
          <Rect x={12} y={9} width={2} height={1} fill={HD} />
          <Rect x={4} y={0} width={1} height={1} fill={OUTLINE} />
          <Rect x={11} y={0} width={1} height={1} fill={OUTLINE} />
          <Rect x={2} y={1} width={1} height={9} fill={OUTLINE} />
          <Rect x={13} y={1} width={1} height={9} fill={OUTLINE} />
        </G>
      );
    case 'long':
      return (
        <G>
          <Rect x={4} y={0} width={8} height={1} fill={H} />
          <Rect x={2} y={1} width={12} height={3} fill={H} />
          <Rect x={2} y={4} width={3} height={1} fill={H} />
          <Rect x={11} y={4} width={3} height={1} fill={H} />
          <Rect x={1} y={4} width={3} height={14} fill={H} />
          <Rect x={12} y={4} width={3} height={14} fill={H} />
          <Rect x={1} y={17} width={1} height={1} fill={HD} />
          <Rect x={14} y={17} width={1} height={1} fill={HD} />
          <Rect x={3} y={1} width={8} height={1} fill={HL} />
          <Rect x={4} y={0} width={1} height={1} fill={OUTLINE} />
          <Rect x={11} y={0} width={1} height={1} fill={OUTLINE} />
          <Rect x={1} y={1} width={1} height={17} fill={OUTLINE} />
          <Rect x={14} y={1} width={1} height={17} fill={OUTLINE} />
        </G>
      );
    case 'pigtails':
      return (
        <G>
          <Rect x={4} y={0} width={8} height={1} fill={H} />
          <Rect x={2} y={1} width={12} height={3} fill={H} />
          <Rect x={2} y={4} width={3} height={1} fill={H} />
          <Rect x={11} y={4} width={3} height={1} fill={H} />
          <Rect x={2} y={4} width={2} height={2} fill={H} />
          <Rect x={12} y={4} width={2} height={2} fill={H} />
          <Rect x={0} y={4} width={2} height={4} fill={H} />
          <Rect x={14} y={4} width={2} height={4} fill={H} />
          <Rect x={0} y={4} width={1} height={1} fill={HL} />
          <Rect x={14} y={4} width={1} height={1} fill={HL} />
          <Rect x={0} y={8} width={2} height={1} fill="#EF4444" />
          <Rect x={14} y={8} width={2} height={1} fill="#EF4444" />
          <Rect x={3} y={1} width={8} height={1} fill={HL} />
          <Rect x={4} y={0} width={1} height={1} fill={OUTLINE} />
          <Rect x={11} y={0} width={1} height={1} fill={OUTLINE} />
          <Rect x={2} y={1} width={1} height={3} fill={OUTLINE} />
          <Rect x={13} y={1} width={1} height={3} fill={OUTLINE} />
          <Rect x={0} y={4} width={1} height={4} fill={OUTLINE} />
          <Rect x={15} y={4} width={1} height={4} fill={OUTLINE} />
          <Rect x={0} y={9} width={2} height={1} fill={OUTLINE} />
          <Rect x={14} y={9} width={2} height={1} fill={OUTLINE} />
        </G>
      );
    case 'bun':
      return (
        <G>
          <Rect x={6} y={-1} width={4} height={1} fill={H} />
          <Rect x={5} y={-2} width={6} height={1} fill={H} />
          <Rect x={4} y={-3} width={8} height={1} fill={H} />
          <Rect x={5} y={-4} width={6} height={1} fill={H} />
          <Rect x={6} y={-2} width={3} height={1} fill={HL} />
          <Rect x={5} y={0} width={6} height={1} fill={H} />
          <Rect x={3} y={1} width={10} height={1} fill={H} />
          <Rect x={2} y={2} width={12} height={2} fill={H} />
          <Rect x={2} y={4} width={3} height={1} fill={H} />
          <Rect x={11} y={4} width={3} height={1} fill={H} />
          <Rect x={3} y={2} width={8} height={0.5} fill={HL} />
          <Rect x={4} y={-3} width={1} height={1} fill={OUTLINE} />
          <Rect x={11} y={-3} width={1} height={1} fill={OUTLINE} />
          <Rect x={5} y={0} width={1} height={1} fill={OUTLINE} />
          <Rect x={10} y={0} width={1} height={1} fill={OUTLINE} />
          <Rect x={3} y={1} width={1} height={1} fill={OUTLINE} />
          <Rect x={12} y={1} width={1} height={1} fill={OUTLINE} />
          <Rect x={2} y={2} width={1} height={2} fill={OUTLINE} />
          <Rect x={13} y={2} width={1} height={2} fill={OUTLINE} />
        </G>
      );
    case 'mohawk':
      return (
        <G>
          <Rect x={2} y={3} width={12} height={1} fill={mix(skin, OUTLINE, 0.15)} />
          <Rect x={6} y={-1} width={4} height={1} fill={H} />
          <Rect x={5} y={0} width={6} height={1} fill={H} />
          <Rect x={5} y={1} width={6} height={2} fill={H} />
          <Rect x={5} y={3} width={6} height={1} fill={H} />
          <Rect x={6} y={0} width={3} height={1} fill={HL} />
          <Rect x={5} y={0} width={1} height={3} fill={OUTLINE} />
          <Rect x={10} y={0} width={1} height={3} fill={OUTLINE} />
          <Rect x={6} y={-1} width={1} height={1} fill={OUTLINE} />
          <Rect x={9} y={-1} width={1} height={1} fill={OUTLINE} />
        </G>
      );
    case 'curly':
      return (
        <G>
          <Rect x={3} y={0} width={3} height={1} fill={H} />
          <Rect x={7} y={0} width={2} height={1} fill={H} />
          <Rect x={10} y={0} width={3} height={1} fill={H} />
          <Rect x={2} y={1} width={12} height={3} fill={H} />
          <Rect x={1} y={2} width={2} height={2} fill={H} />
          <Rect x={13} y={2} width={2} height={2} fill={H} />
          <Rect x={2} y={4} width={2} height={3} fill={H} />
          <Rect x={12} y={4} width={2} height={3} fill={H} />
          <Rect x={3} y={0} width={1} height={1} fill={HL} />
          <Rect x={7} y={0} width={1} height={1} fill={HL} />
          <Rect x={10} y={0} width={1} height={1} fill={HL} />
          <Rect x={3} y={2} width={1} height={1} fill={HL} />
          <Rect x={11} y={2} width={1} height={1} fill={HL} />
          <Rect x={1} y={2} width={1} height={2} fill={OUTLINE} />
          <Rect x={14} y={2} width={1} height={2} fill={OUTLINE} />
          <Rect x={2} y={4} width={1} height={3} fill={OUTLINE} />
          <Rect x={13} y={4} width={1} height={3} fill={OUTLINE} />
        </G>
      );
    case 'bald':
      return (
        <G>
          <Rect x={2} y={2} width={2} height={3} fill={H} />
          <Rect x={12} y={2} width={2} height={3} fill={H} />
          <Rect x={2} y={2} width={1} height={3} fill={OUTLINE} />
          <Rect x={13} y={2} width={1} height={3} fill={OUTLINE} />
        </G>
      );
    case 'cap':
      return (
        <G>
          <Rect x={4} y={0} width={8} height={1} fill={hatTone} />
          <Rect x={2} y={1} width={12} height={3} fill={hatTone} />
          {hatTrim ? <Rect x={2} y={3} width={12} height={1} fill={hatTrim} /> : null}
          {hatTrim === '#EF4444' ? (
            <G>
              <Rect x={7} y={0.5} width={2} height={1.5} fill="#EF4444" />
              <Rect x={6.5} y={1} width={3} height={0.7} fill="#EF4444" />
            </G>
          ) : null}
          <Rect x={3} y={1} width={6} height={1} fill={hatTone ? mix(hatTone, '#FFFFFF', 0.3) : '#FFF'} />
          <Rect x={2} y={4} width={1.5} height={0.8} fill={H} />
          <Rect x={12.5} y={4} width={1.5} height={0.8} fill={H} />
          <Rect x={4} y={0} width={1} height={1} fill={OUTLINE} />
          <Rect x={11} y={0} width={1} height={1} fill={OUTLINE} />
          <Rect x={2} y={1} width={1} height={3} fill={OUTLINE} />
          <Rect x={13} y={1} width={1} height={3} fill={OUTLINE} />
        </G>
      );
    case 'peakedCap':
      return (
        <G>
          <Rect x={4} y={0} width={8} height={1} fill={hatTone} />
          <Rect x={2} y={1} width={12} height={3} fill={hatTone} />
          {hatTrim ? <Rect x={7} y={1.5} width={2} height={1.5} fill={hatTrim} /> : null}
          <Rect x={1} y={4} width={14} height={1} fill={hatTone ? mix(hatTone, OUTLINE, 0.4) : OUTLINE} />
          <Rect x={3} y={1} width={6} height={1} fill={hatTone ? mix(hatTone, '#FFFFFF', 0.25) : '#FFF'} />
          <Rect x={4} y={0} width={1} height={1} fill={OUTLINE} />
          <Rect x={11} y={0} width={1} height={1} fill={OUTLINE} />
          <Rect x={2} y={1} width={1} height={3} fill={OUTLINE} />
          <Rect x={13} y={1} width={1} height={3} fill={OUTLINE} />
          <Rect x={1} y={5} width={14} height={0.5} fill={OUTLINE} />
        </G>
      );
    default:
      return null;
  }
}

// ── EXPRESSION PLATES — eyes (anchor ~5,5 / 9.5,5), mouth (x6-9, y8-9). ──
function ExpressionPlate({ expr, skin, masked }: { expr: Expression; skin: string; masked: boolean }) {
  const E = OUTLINE;

  const dotEyes = (
    <G>
      <Rect x={5} y={5.3} width={1.3} height={1.5} fill={E} />
      <Rect x={9.7} y={5.3} width={1.3} height={1.5} fill={E} />
      <Rect x={5.3} y={5.5} width={0.5} height={0.5} fill="#FFFFFF" />
      <Rect x={10} y={5.5} width={0.5} height={0.5} fill="#FFFFFF" />
    </G>
  );
  const closedHappyEyes = (
    <G>
      <Rect x={4.5} y={5.7} width={2.5} height={0.5} fill={E} />
      <Rect x={5} y={5.3} width={0.5} height={0.5} fill={E} />
      <Rect x={6} y={5.3} width={0.5} height={0.5} fill={E} />
      <Rect x={9} y={5.7} width={2.5} height={0.5} fill={E} />
      <Rect x={9.5} y={5.3} width={0.5} height={0.5} fill={E} />
      <Rect x={10.5} y={5.3} width={0.5} height={0.5} fill={E} />
    </G>
  );
  const squintEyes = (
    <G>
      <Rect x={4.5} y={5.5} width={0.5} height={0.5} fill={E} />
      <Rect x={5} y={5.7} width={2} height={0.5} fill={E} />
      <Rect x={6.5} y={5.5} width={0.5} height={0.5} fill={E} />
      <Rect x={6.5} y={6} width={0.5} height={0.5} fill={E} />
      <Rect x={11} y={5.5} width={0.5} height={0.5} fill={E} />
      <Rect x={9.5} y={5.7} width={2} height={0.5} fill={E} />
      <Rect x={9} y={5.5} width={0.5} height={0.5} fill={E} />
      <Rect x={9} y={6} width={0.5} height={0.5} fill={E} />
    </G>
  );
  const wideEyes = (
    <G>
      <Rect x={4.5} y={5} width={2.2} height={2.2} fill="#FFFFFF" />
      <Rect x={9.3} y={5} width={2.2} height={2.2} fill="#FFFFFF" />
      <Rect x={5.3} y={5.7} width={1} height={1} fill={E} />
      <Rect x={10.1} y={5.7} width={1} height={1} fill={E} />
      <Rect x={4.5} y={5} width={2.2} height={0.4} fill={E} />
      <Rect x={4.5} y={7} width={2.2} height={0.4} fill={E} />
      <Rect x={4.5} y={5} width={0.4} height={2.2} fill={E} />
      <Rect x={6.3} y={5} width={0.4} height={2.2} fill={E} />
      <Rect x={9.3} y={5} width={2.2} height={0.4} fill={E} />
      <Rect x={9.3} y={7} width={2.2} height={0.4} fill={E} />
      <Rect x={9.3} y={5} width={0.4} height={2.2} fill={E} />
      <Rect x={11.1} y={5} width={0.4} height={2.2} fill={E} />
    </G>
  );
  const halfLidEyes = (
    <G>
      <Rect x={4.5} y={6} width={2.5} height={0.5} fill={E} />
      <Rect x={9} y={6} width={2.5} height={0.5} fill={E} />
      <Rect x={5.5} y={6.5} width={0.5} height={0.5} fill={E} />
      <Rect x={10} y={6.5} width={0.5} height={0.5} fill={E} />
    </G>
  );
  const narrowEyes = (
    <G>
      <Rect x={4.7} y={5.7} width={2} height={0.7} fill={E} />
      <Rect x={9.3} y={5.7} width={2} height={0.7} fill={E} />
    </G>
  );
  const lookDownEyes = (
    <G>
      <Rect x={5} y={5.8} width={1.3} height={1.2} fill={E} />
      <Rect x={9.7} y={5.8} width={1.3} height={1.2} fill={E} />
    </G>
  );
  const lookUpEyes = (
    <G>
      <Rect x={5} y={5} width={1.3} height={1.2} fill={E} />
      <Rect x={9.7} y={5} width={1.3} height={1.2} fill={E} />
    </G>
  );

  const browsRaisedInner = (
    <G>
      <Rect x={6} y={4} width={1} height={0.5} fill={E} />
      <Rect x={5} y={4.3} width={1} height={0.4} fill={E} />
      <Rect x={4.5} y={4.5} width={1} height={0.4} fill={E} />
      <Rect x={9} y={4} width={1} height={0.5} fill={E} />
      <Rect x={10} y={4.3} width={1} height={0.4} fill={E} />
      <Rect x={10.5} y={4.5} width={1} height={0.4} fill={E} />
    </G>
  );
  const browsAngry = (
    <G>
      <Rect x={4.5} y={4} width={1} height={0.4} fill={E} />
      <Rect x={5.2} y={4.3} width={1} height={0.4} fill={E} />
      <Rect x={6} y={4.6} width={1} height={0.4} fill={E} />
      <Rect x={9} y={4.6} width={1} height={0.4} fill={E} />
      <Rect x={9.8} y={4.3} width={1} height={0.4} fill={E} />
      <Rect x={10.5} y={4} width={1} height={0.4} fill={E} />
    </G>
  );
  const browsStraightDown = (
    <G>
      <Rect x={4.5} y={4.5} width={2.5} height={0.5} fill={E} />
      <Rect x={9} y={4.5} width={2.5} height={0.5} fill={E} />
    </G>
  );
  const browsRaised = (
    <G>
      <Rect x={4.5} y={3.5} width={2.5} height={0.5} fill={E} />
      <Rect x={9} y={3.5} width={2.5} height={0.5} fill={E} />
    </G>
  );

  const smileMouth = (
    <G>
      <Rect x={6.5} y={8.5} width={3} height={0.6} fill={E} />
      <Rect x={6} y={8.2} width={0.7} height={0.5} fill={E} />
      <Rect x={9.3} y={8.2} width={0.7} height={0.5} fill={E} />
    </G>
  );
  const bigSmileMouth = (
    <G>
      <Rect x={5.7} y={8.4} width={4.6} height={0.5} fill={E} />
      <Rect x={6} y={8.9} width={4} height={0.5} fill={E} />
      <Rect x={5.3} y={8} width={0.5} height={0.5} fill={E} />
      <Rect x={10.2} y={8} width={0.5} height={0.5} fill={E} />
      <Rect x={6.5} y={8.5} width={3} height={0.6} fill="#F87171" />
    </G>
  );
  const frownMouth = (
    <G>
      <Rect x={6.5} y={9} width={3} height={0.6} fill={E} />
      <Rect x={6} y={9.3} width={0.7} height={0.5} fill={E} />
      <Rect x={9.3} y={9.3} width={0.7} height={0.5} fill={E} />
    </G>
  );
  const flatMouth = <Rect x={6.5} y={8.7} width={3} height={0.5} fill={E} />;
  const wavyMouth = (
    <G>
      <Rect x={6} y={8.7} width={1} height={0.5} fill={E} />
      <Rect x={6.5} y={8.4} width={1} height={0.5} fill={E} />
      <Rect x={7} y={8.7} width={1} height={0.5} fill={E} />
      <Rect x={7.5} y={9} width={1} height={0.5} fill={E} />
      <Rect x={8} y={8.7} width={1} height={0.5} fill={E} />
      <Rect x={8.5} y={9} width={1} height={0.5} fill={E} />
    </G>
  );
  const oMouth = (
    <G>
      <Rect x={7} y={8.3} width={2} height={1} fill={E} />
      <Rect x={7.3} y={8.5} width={1.4} height={0.6} fill="#7C2D12" />
    </G>
  );
  const gritMouth = (
    <G>
      <Rect x={6} y={8.5} width={4} height={0.8} fill={E} />
      <Rect x={6.2} y={8.7} width={3.6} height={0.4} fill="#FFFFFF" />
      <Rect x={7} y={8.7} width={0.3} height={0.4} fill={E} />
      <Rect x={8} y={8.7} width={0.3} height={0.4} fill={E} />
      <Rect x={9} y={8.7} width={0.3} height={0.4} fill={E} />
    </G>
  );
  const tightLineMouth = (
    <G>
      <Rect x={6.5} y={8.6} width={3} height={0.4} fill={E} />
      <Rect x={6} y={8.7} width={0.5} height={0.3} fill={E} />
      <Rect x={9.5} y={8.7} width={0.5} height={0.3} fill={E} />
    </G>
  );
  const smallSmileMouth = (
    <G>
      <Rect x={6.8} y={8.7} width={2.4} height={0.5} fill={E} />
      <Rect x={6.4} y={8.5} width={0.5} height={0.4} fill={E} />
      <Rect x={9.1} y={8.5} width={0.5} height={0.4} fill={E} />
    </G>
  );
  const yawnMouth = (
    <G>
      <Rect x={6.8} y={8.3} width={2.4} height={1.2} fill={E} />
      <Rect x={7} y={8.5} width={2} height={0.8} fill="#7C2D12" />
    </G>
  );

  let eyes: React.ReactNode = dotEyes;
  let brows: React.ReactNode = null;
  let mouth: React.ReactNode = flatMouth;
  const extras: React.ReactNode[] = [];
  switch (expr) {
    case 'happy':
      eyes = closedHappyEyes; mouth = bigSmileMouth; break;
    case 'sad':
      eyes = dotEyes; brows = browsRaisedInner; mouth = frownMouth;
      extras.push(<Rect key="tear" x={11.2} y={7} width={0.7} height={1.5} fill={TEAR} />);
      extras.push(<Rect key="tear2" x={11.3} y={6.7} width={0.5} height={0.5} fill={mix(TEAR, '#FFFFFF', 0.4)} />);
      break;
    case 'worried':
      eyes = dotEyes; brows = browsRaisedInner; mouth = wavyMouth; break;
    case 'pain':
      eyes = squintEyes; brows = browsAngry; mouth = gritMouth;
      extras.push(<Rect key="sweat" x={12} y={3.5} width={0.7} height={1.2} fill={TEAR} />);
      break;
    case 'surprised':
      eyes = wideEyes; brows = browsRaised; mouth = oMouth; break;
    case 'angry':
      eyes = narrowEyes; brows = browsAngry; mouth = gritMouth;
      extras.push(
        <G key="vein">
          <Rect x={11.7} y={3} width={0.5} height={0.5} fill="#EF4444" />
          <Rect x={12.2} y={3.3} width={0.5} height={0.5} fill="#EF4444" />
          <Rect x={11.5} y={3.5} width={0.5} height={0.5} fill="#EF4444" />
          <Rect x={12} y={3.7} width={0.5} height={0.5} fill="#EF4444" />
          <Rect x={11.7} y={4} width={0.5} height={0.5} fill="#EF4444" />
        </G>,
      );
      break;
    case 'thinking':
      eyes = lookUpEyes; brows = browsRaised; mouth = tightLineMouth;
      extras.push(
        <G key="thought">
          <Rect x={12} y={2} width={1} height={1} fill="#FFFFFF" stroke={OUTLINE} strokeWidth={0.2} />
          <SvgText x={12.2} y={2.85} fontSize={1.2} fill={OUTLINE} fontFamily="monospace">?</SvgText>
        </G>,
      );
      break;
    case 'sleepy':
      eyes = halfLidEyes; mouth = yawnMouth;
      extras.push(<SvgText key="z1" x={11.5} y={3.5} fontSize={1.8} fill={OUTLINE} fontFamily="monospace">z</SvgText>);
      extras.push(<SvgText key="z2" x={13} y={2} fontSize={1.4} fill={OUTLINE} fontFamily="monospace">z</SvgText>);
      break;
    case 'panic':
      eyes = wideEyes; brows = browsRaised; mouth = oMouth;
      extras.push(<Rect key="sweat" x={11.5} y={3} width={1} height={2} fill={TEAR} />);
      extras.push(<Rect key="sweat2" x={11.7} y={2.5} width={0.6} height={0.6} fill={mix(TEAR, '#FFFFFF', 0.5)} />);
      break;
    case 'focused':
      eyes = narrowEyes; brows = browsStraightDown; mouth = tightLineMouth; break;
    case 'shy':
      eyes = lookDownEyes; mouth = smallSmileMouth; break;
    case 'neutral':
    case 'derp':
    default:
      eyes = dotEyes; mouth = flatMouth;
  }

  return (
    <G>
      {brows}
      {eyes}
      {!masked && mouth}
      {extras}
    </G>
  );
}

export interface FaceProps {
  hair?: string;
  hairStyle?: HairStyle;
  skin?: string;
  hatTone?: string;
  hatTrim?: string;
  shirt?: string;
  shirtDk?: string;
  expression?: Expression;
  mask?: boolean;
  maskColor?: string;
  size?: number;
}

function FaceBase({
  hair = '#3C2A18',
  hairStyle = 'short',
  skin = '#F8D7B2',
  hatTone,
  hatTrim,
  shirt = '#A7F3D0',
  shirtDk,
  expression = 'neutral',
  mask = false,
  maskColor,
  size = 80,
}: FaceProps) {
  const shirtDark = shirtDk || mix(shirt, OUTLINE, 0.3);
  const skinSh = mix(skin, OUTLINE, 0.22);
  const maskC = maskColor || '#FFFFFF';
  const maskD = mix(maskC, OUTLINE, 0.25);
  const blushBig = expression === 'shy';
  const noBlush = ['angry', 'sad', 'panic', 'pain'].includes(expression);

  return (
    <Svg width={size} height={(size * 18) / 16} viewBox="-1 -4 18 22">
      {/* face skin */}
      <Rect x={3} y={3} width={10} height={7} fill={skin} />
      <Rect x={4} y={10} width={8} height={1} fill={skin} />
      <Rect x={11} y={5} width={1} height={5} fill={skinSh} />
      <Rect x={10} y={10} width={2} height={1} fill={skinSh} />
      {/* outline */}
      <Rect x={2} y={3} width={1} height={7} fill={OUTLINE} />
      <Rect x={13} y={3} width={1} height={7} fill={OUTLINE} />
      <Rect x={3} y={10} width={1} height={1} fill={OUTLINE} />
      <Rect x={12} y={10} width={1} height={1} fill={OUTLINE} />
      <Rect x={4} y={11} width={8} height={0.6} fill={OUTLINE} />

      <HairPlate style={hairStyle} hair={hair} hatTone={hatTone} hatTrim={hatTrim} skin={skin} />

      {/* blush */}
      {!noBlush ? (
        <G>
          <Rect x={3.6} y={7} width={1.5} height={1} fill={BLUSH} opacity={blushBig ? 0.95 : 0.55} />
          <Rect x={10.9} y={7} width={1.5} height={1} fill={BLUSH} opacity={blushBig ? 0.95 : 0.55} />
        </G>
      ) : null}

      <ExpressionPlate expr={expression} skin={skin} masked={mask} />

      {/* neck */}
      <Rect x={6} y={11.5} width={4} height={2} fill={skin} />
      <Rect x={6} y={13} width={4} height={0.4} fill={skinSh} />
      <Rect x={5.5} y={11.5} width={0.5} height={2} fill={OUTLINE} />
      <Rect x={10} y={11.5} width={0.5} height={2} fill={OUTLINE} />

      {/* shirt collar / shoulders */}
      <Rect x={2} y={13.5} width={12} height={4.5} fill={shirt} />
      <Rect x={2} y={13.5} width={12} height={0.6} fill={shirtDark} />
      <Rect x={11} y={14} width={3} height={4} fill={shirtDark} />
      <Rect x={1} y={13.5} width={1} height={4.5} fill={OUTLINE} />
      <Rect x={14} y={13.5} width={1} height={4.5} fill={OUTLINE} />
      <Rect x={2} y={13.4} width={4} height={0.4} fill={OUTLINE} />
      <Rect x={10} y={13.4} width={4} height={0.4} fill={OUTLINE} />

      {/* surgical mask (over lower face) */}
      {mask ? (
        <G>
          <Rect x={3} y={7} width={10} height={4} fill={maskC} />
          <Rect x={3} y={7} width={10} height={0.5} fill={maskD} />
          <Rect x={3} y={10.5} width={10} height={0.5} fill={maskD} />
          <Rect x={2} y={7} width={1} height={4} fill={OUTLINE} />
          <Rect x={13} y={7} width={1} height={4} fill={OUTLINE} />
          <Rect x={3} y={6.7} width={10} height={0.4} fill={OUTLINE} />
          <Rect x={3} y={11} width={10} height={0.4} fill={OUTLINE} />
          <Rect x={6} y={7.4} width={4} height={0.4} fill={maskD} />
          <Rect x={3} y={8.3} width={10} height={0.2} fill={maskD} />
          <Rect x={3} y={9.3} width={10} height={0.2} fill={maskD} />
          <Rect x={3} y={10} width={10} height={0.2} fill={maskD} />
          <Path d="M 2 7.5 Q 0.5 9 2 10.5" fill="none" stroke={OUTLINE} strokeWidth={0.4} />
          <Path d="M 14 7.5 Q 15.5 9 14 10.5" fill="none" stroke={OUTLINE} strokeWidth={0.4} />
        </G>
      ) : null}
    </Svg>
  );
}

export const Face = memo(FaceBase);

// ── Role presets — same identity as the chibi roles ──
const FACE_ROLE: Record<RoleKind, Partial<FaceProps>> = {
  nurse: { hairStyle: 'cap', hatTone: '#FFFFFF', hatTrim: '#EF4444', shirt: '#A7F3D0', shirtDk: '#4FC79D' },
  doctor: { hairStyle: 'short', shirt: '#FFFFFF', shirtDk: '#B0B5BD' },
  surgeon: { hairStyle: 'cap', hatTone: '#A8DCEC', hatTrim: '#5E8FA8', shirt: '#A8DCEC', shirtDk: '#5E8FA8', mask: true, maskColor: '#A8DCEC' },
  paramedic: { hair: '#7C3F00', hairStyle: 'peakedCap', hatTone: '#0F172A', hatTrim: '#FACC15', shirt: '#FACC15', shirtDk: '#CA8A04' },
  police: { hair: '#1F2937', hairStyle: 'peakedCap', hatTone: '#1E3A8A', hatTrim: '#FACC15', shirt: '#1E3A8A', shirtDk: '#0F172A' },
  patient: { hair: '#9A6B3F', hairStyle: 'short', shirt: '#FED7AA', shirtDk: '#C99066' },
  child: { hair: '#FACC15', hairStyle: 'short', shirt: '#FBCFE8', shirtDk: '#BE185D' },
  parent: { hairStyle: 'bob', shirt: '#FBCFE8', shirtDk: '#BE185D' },
  visitor: { hair: '#5C3A1A', hairStyle: 'short', shirt: '#A78BFA', shirtDk: '#6D28D9' },
  pharmacist: { hairStyle: 'short', shirt: '#FFFFFF', shirtDk: '#B0B5BD' },
};

/** A role portrait (matches the chibi RoleSprite identity for the same kind). */
export function RoleFace({ kind, expression, size = 80, hair }: { kind: RoleKind; expression?: Expression; size?: number; hair?: string }) {
  const preset = FACE_ROLE[kind];
  return <Face {...preset} hair={hair || preset.hair} expression={expression} size={size} />;
}

/**
 * The player's portrait — nurse identity, focused by default, drawn from the saved
 * avatar.
 *
 * It used to hardcode a single hair colour, so every learner wore the same face while
 * this very renderer already took hairStyle/skin/shirt for NPCs. `avatar` is passed
 * in rather than read here: engine/ knows how to draw a face and has no business
 * knowing where a preference is stored.
 */
export function FacePlayer({
  expression = 'focused' as Expression,
  size = 80,
  avatar,
}: {
  expression?: Expression;
  size?: number;
  avatar?: { hairStyle?: HairStyle; hair?: string; skin?: string; scrub?: string };
}) {
  const preset = FACE_ROLE.nurse;
  return (
    <Face
      {...preset}
      hairStyle={avatar?.hairStyle ?? preset.hairStyle}
      hair={avatar?.hair ?? '#3C2A18'}
      skin={avatar?.skin ?? preset.skin}
      shirt={avatar?.scrub ?? preset.shirt}
      expression={expression}
      size={size}
    />
  );
}

export const FORIN_EXPRESSIONS: { id: Expression; ko: string; en: string }[] = [
  { id: 'neutral', ko: '평온', en: 'Neutral' },
  { id: 'happy', ko: '기쁨', en: 'Happy' },
  { id: 'sad', ko: '슬픔', en: 'Sad' },
  { id: 'worried', ko: '걱정', en: 'Worried' },
  { id: 'pain', ko: '통증', en: 'In Pain' },
  { id: 'surprised', ko: '놀람', en: 'Surprised' },
  { id: 'angry', ko: '분노', en: 'Angry' },
  { id: 'thinking', ko: '생각', en: 'Thinking' },
  { id: 'sleepy', ko: '졸림', en: 'Sleepy' },
  { id: 'panic', ko: '당황', en: 'Panicked' },
  { id: 'focused', ko: '집중', en: 'Focused' },
  { id: 'shy', ko: '수줍음', en: 'Shy' },
];
