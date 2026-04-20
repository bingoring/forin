import React from 'react';
import Svg, { Rect, Text as SvgText, Line } from 'react-native-svg';
import { colors } from '../../theme';
import type { CurriculumUnit } from '../../types/api';

interface Props {
  width: number;
  height: number;
  units: CurriculumUnit[];
  floorLabel: string;
}

/**
 * Placeholder floor canvas. Draws a cream rectangle with labeled zones
 * for each Unit at its map_x/map_y. When the final SVG ships, replace
 * the contents of this component's <Svg> with <SvgXml xml={floorSvg} />.
 *
 * Hotspots are rendered by the parent (MapScreen) on top of this canvas,
 * so both the background and the interactive layer stay easy to swap
 * independently.
 */
export function FloorCanvas({ width, height, units, floorLabel }: Props) {
  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <Rect x={0} y={0} width={width} height={height} fill={colors.background} />

      {/* Floor label strip */}
      <Rect x={0} y={0} width={width} height={40} fill={colors.accent} opacity={0.15} />
      <SvgText
        x={width / 2}
        y={26}
        fontSize={16}
        fontWeight="600"
        textAnchor="middle"
        fill={colors.textPrimary}
      >
        {floorLabel}
      </SvgText>

      {/* Grid lines — soft beige reference for placeholder layout */}
      <Line
        x1={0}
        y1={height / 2}
        x2={width}
        y2={height / 2}
        stroke={colors.border}
        strokeWidth={1}
        strokeDasharray="4 6"
      />
      <Line
        x1={width / 2}
        y1={40}
        x2={width / 2}
        y2={height}
        stroke={colors.border}
        strokeWidth={1}
        strokeDasharray="4 6"
      />

      {/* Zone rectangles for each Unit — one per location */}
      {units.map((u) => {
        const cx = (u.map_x / 100) * width;
        const cy = (u.map_y / 100) * height;
        const zoneW = 110;
        const zoneH = 70;
        return (
          <React.Fragment key={u.id}>
            <Rect
              x={cx - zoneW / 2}
              y={cy - zoneH / 2}
              width={zoneW}
              height={zoneH}
              rx={12}
              fill={colors.surface}
              stroke={colors.border}
              strokeWidth={1.5}
            />
            <SvgText
              x={cx}
              y={cy + 4}
              fontSize={11}
              fontWeight="600"
              textAnchor="middle"
              fill={colors.textSecondary}
            >
              {u.location_type}
            </SvgText>
          </React.Fragment>
        );
      })}
    </Svg>
  );
}
