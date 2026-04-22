import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { color as colors } from '../theme';

// forin icon set — ported from DesignDemo/icons.jsx.
//
// Every icon is a <Svg> with a 24×24 viewBox and stroke/fill driven by
// the caller's `color` prop so tinting stays consistent with our
// semantic palette. Size defaults to 22 — small-ish, which matches the
// "rounded, friendly" feel of the visual design.
//
// Adding a new icon:
//   1. Add a case to the `render` switch below, keeping the viewBox at
//      24×24.
//   2. Extend the `IconName` union.
//   3. Reach for an existing icon first; the set is deliberately small.

export type IconName =
  | 'heart'
  | 'flame'
  | 'gem'
  | 'star'
  | 'lock'
  | 'check'
  | 'x'
  | 'play'
  | 'mic'
  | 'volume'
  | 'chat'
  | 'home'
  | 'book'
  | 'shop'
  | 'person'
  | 'trophy'
  | 'settings'
  | 'arrow-left'
  | 'arrow-right'
  | 'plus'
  | 'coin'
  | 'gift'
  | 'clock';

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
}

export function Icon({ name, size = 22, color = colors.ink }: IconProps) {
  // Common stroke props — every icon shares the same stroke width, caps
  // and joins for a cohesive line feel.
  const stroke = {
    stroke: color,
    strokeWidth: 2.2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  switch (name) {
    case 'heart':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M12 20s-7-4.5-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.5-7 10-7 10z" fill={color} />
        </Svg>
      );
    case 'flame':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path
            d="M12 3c1.5 3 4 4 4 8a4 4 0 11-8 0c0-2 1-3 2-4-1 0-2 1-2 2 0-3 2-4 4-6z"
            fill={color}
          />
        </Svg>
      );
    case 'gem':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M6 4h12l3 5-9 11L3 9l3-5zM9 9h6M6 4l3 5M18 4l-3 5" {...stroke} />
        </Svg>
      );
    case 'star':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M12 3l2.6 5.6L20 9.5l-4 4 1 6-5-3-5 3 1-6-4-4 5.4-.9L12 3z" fill={color} />
        </Svg>
      );
    case 'lock':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x={5} y={11} width={14} height={9} rx={2} fill={color} />
          <Path d="M8 11V8a4 4 0 018 0v3" {...stroke} />
        </Svg>
      );
    case 'check':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M5 12l5 5L20 7" {...stroke} />
        </Svg>
      );
    case 'x':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M6 6l12 12M18 6L6 18" {...stroke} />
        </Svg>
      );
    case 'play':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M8 5l12 7-12 7V5z" fill={color} />
        </Svg>
      );
    case 'mic':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x={9} y={3} width={6} height={12} rx={3} {...stroke} />
          <Path d="M5 11a7 7 0 0014 0M12 18v3" {...stroke} />
        </Svg>
      );
    case 'volume':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M4 10v4h4l5 4V6l-5 4H4zM17 8a6 6 0 010 8M20 5a10 10 0 010 14" {...stroke} />
        </Svg>
      );
    case 'chat':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M4 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2h-6l-4 4v-4H6a2 2 0 01-2-2V6z"
            {...stroke}
          />
        </Svg>
      );
    case 'home':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M3 11l9-7 9 7v9a2 2 0 01-2 2h-4v-6h-6v6H5a2 2 0 01-2-2v-9z" {...stroke} />
        </Svg>
      );
    case 'book':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M4 5a2 2 0 012-2h14v16H6a2 2 0 00-2 2V5z" {...stroke} />
        </Svg>
      );
    case 'shop':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M3 8h18l-2 12H5L3 8zM8 8V5a4 4 0 018 0v3" {...stroke} />
        </Svg>
      );
    case 'person':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Circle cx={12} cy={8} r={4} {...stroke} />
          <Path d="M4 21a8 8 0 0116 0" {...stroke} />
        </Svg>
      );
    case 'trophy':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M7 4h10v5a5 5 0 01-10 0V4zM4 5h3v3a3 3 0 01-3-3zM20 5h-3v3a3 3 0 003-3zM9 15h6v3H9zM8 21h8"
            {...stroke}
          />
        </Svg>
      );
    case 'settings':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Circle cx={12} cy={12} r={3} {...stroke} />
          <Path
            d="M12 2v3M12 19v3M22 12h-3M5 12H2M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1M18.4 18.4l-2.1-2.1M7.7 7.7L5.6 5.6"
            {...stroke}
          />
        </Svg>
      );
    case 'arrow-left':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M19 12H5M12 5l-7 7 7 7" {...stroke} />
        </Svg>
      );
    case 'arrow-right':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M5 12h14M12 5l7 7-7 7" {...stroke} />
        </Svg>
      );
    case 'plus':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M12 5v14M5 12h14" {...stroke} />
        </Svg>
      );
    case 'coin':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx={12} cy={12} r={9} fill={color} />
        </Svg>
      );
    case 'gift':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x={3} y={9} width={18} height={12} rx={1.5} {...stroke} />
          <Path d="M3 13h18M12 9v12" {...stroke} />
          <Path
            d="M12 9s-2-5-5-5a2.5 2.5 0 000 5h5zM12 9s2-5 5-5a2.5 2.5 0 010 5h-5z"
            {...stroke}
          />
        </Svg>
      );
    case 'clock':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Circle cx={12} cy={12} r={9} {...stroke} />
          <Path d="M12 7v5l3 3" {...stroke} />
        </Svg>
      );
  }
}
