import React from 'react';
import Svg, { Path, Circle, Ellipse, G } from 'react-native-svg';

export type MoroPose =
  | 'welcome'
  | 'think'
  | 'cheer'
  | 'worry'
  | 'read-chart'
  | 'sleep'
  | 'wave'
  | 'explain';

interface Props {
  pose?: MoroPose;
  size?: number;
}

/**
 * Placeholder Moro mascot. Drawn with react-native-svg primitives so the
 * flow can be built and tested before final art arrives. Identity traits
 * kept across all 8 poses: long-haired bicolor silhouette, central white
 * blaze, golden amber eyes, pink nose.
 *
 * Final art swap: replace this component's internals with an <SvgXml>
 * render of the shipped pose SVGs. The `pose` prop contract stays.
 */
export function Mascot({ pose = 'welcome', size = 120 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {/* Body — long-haired bicolor base. Chocolate outer, ivory panel. */}
      <Ellipse cx="50" cy="62" rx="28" ry="24" fill="#8B6F47" />
      <Ellipse cx="50" cy="70" rx="18" ry="16" fill="#FBF7EC" />

      {/* Head */}
      <Circle cx="50" cy="36" r="22" fill="#8B6F47" />
      {/* Ears — outer chocolate, inner dusty pink */}
      <Path d="M30 20 L34 10 L42 18 Z" fill="#8B6F47" />
      <Path d="M58 18 L66 10 L70 20 Z" fill="#8B6F47" />
      <Path d="M33 19 L36 13 L40 19 Z" fill="#E8A8A0" />
      <Path d="M60 19 L64 13 L67 19 Z" fill="#E8A8A0" />

      {/* Central white blaze — Moro's signature, visible in every pose */}
      <Path
        d="M50 18 L46 30 L48 44 L50 50 L52 44 L54 30 Z"
        fill="#FBF7EC"
      />

      {/* Pose-specific layers */}
      <PoseLayer pose={pose} />

      {/* Eyes — golden amber, or closed lines when asleep */}
      {pose === 'sleep' ? (
        <G>
          <Path d="M39 36 L45 36" stroke="#3A2A24" strokeWidth={1.5} />
          <Path d="M55 36 L61 36" stroke="#3A2A24" strokeWidth={1.5} />
        </G>
      ) : (
        <G>
          <Circle cx={42} cy={36} r={3} fill="#E6B04A" />
          <Circle cx={58} cy={36} r={3} fill="#E6B04A" />
        </G>
      )}

      {/* Pink nose */}
      <Path d="M48 42 L50 45 L52 42 Z" fill="#E8A8A0" />
      {/* Mouth — smile / frown / neutral depending on pose */}
      <Path
        d={
          pose === 'cheer'
            ? 'M46 48 Q50 53 54 48'
            : pose === 'worry'
            ? 'M46 49 Q50 46 54 49'
            : 'M48 48 Q50 50 52 48'
        }
        stroke="#3A2A24"
        strokeWidth={1.2}
        fill="none"
      />

      {/* Whiskers — always on */}
      <Path d="M30 42 L42 43" stroke="#3A2A24" strokeWidth={0.7} />
      <Path d="M30 45 L42 45" stroke="#3A2A24" strokeWidth={0.7} />
      <Path d="M58 43 L70 42" stroke="#3A2A24" strokeWidth={0.7} />
      <Path d="M58 45 L70 45" stroke="#3A2A24" strokeWidth={0.7} />
    </Svg>
  );
}

function PoseLayer({ pose }: { pose: MoroPose }) {
  switch (pose) {
    case 'welcome':
      return (
        <Path
          d="M72 58 Q78 50 80 44"
          stroke="#8B6F47"
          strokeWidth={5}
          strokeLinecap="round"
          fill="none"
        />
      );
    case 'wave':
      return (
        <G>
          <Path
            d="M72 58 Q82 46 86 40"
            stroke="#8B6F47"
            strokeWidth={5}
            strokeLinecap="round"
            fill="none"
          />
          <Circle cx="86" cy="40" r="4" fill="#8B6F47" />
        </G>
      );
    case 'think':
      return (
        <G>
          <Circle cx="82" cy="22" r="4" fill="#FBF7EC" stroke="#8B6F47" strokeWidth={1} />
          <Circle cx="75" cy="28" r="2" fill="#FBF7EC" stroke="#8B6F47" strokeWidth={1} />
        </G>
      );
    case 'cheer':
      return (
        <G>
          <Path d="M22 52 L18 38" stroke="#8B6F47" strokeWidth={5} strokeLinecap="round" />
          <Path d="M78 52 L82 38" stroke="#8B6F47" strokeWidth={5} strokeLinecap="round" />
          <Circle cx="20" cy="20" r="1.5" fill="#E6B04A" />
          <Circle cx="80" cy="20" r="1.5" fill="#E8A8A0" />
          <Circle cx="50" cy="8" r="1.5" fill="#A8B86F" />
        </G>
      );
    case 'worry':
      return <Path d="M68 26 L70 22 L72 26 Q70 30 68 26 Z" fill="#8BA8C4" />;
    case 'read-chart':
      return (
        <G>
          <Path d="M36 66 L64 66 L64 86 L36 86 Z" fill="#FBF7EC" stroke="#8B6F47" strokeWidth={1.5} />
          <Path d="M40 72 L60 72" stroke="#7A6852" strokeWidth={1} />
          <Path d="M40 76 L60 76" stroke="#7A6852" strokeWidth={1} />
          <Path d="M40 80 L54 80" stroke="#7A6852" strokeWidth={1} />
        </G>
      );
    case 'sleep':
      return (
        <G>
          <Path d="M72 18 L80 18 L72 26 L80 26" stroke="#8B6F47" strokeWidth={2} fill="none" />
          <Path d="M82 10 L88 10 L82 16 L88 16" stroke="#8B6F47" strokeWidth={1.5} fill="none" />
        </G>
      );
    case 'explain':
      return (
        <Path
          d="M72 58 L86 50 L82 46"
          stroke="#8B6F47"
          strokeWidth={4}
          strokeLinecap="round"
          fill="none"
        />
      );
  }
}
