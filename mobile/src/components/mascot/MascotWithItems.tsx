import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Path, Rect, G } from 'react-native-svg';
import { Mascot, MoroPose } from './Mascot';
import { colors } from '../../theme';

export interface EquippedItem {
  slot: string;          // 'hat' | 'outfit' | 'accessory' | 'background' | 'expression'
  rarity: string;        // used to pick the overlay tint
  name?: string;         // informational only in MVP
}

interface Props {
  pose?: MoroPose;
  size?: number;
  items?: EquippedItem[];
}

// Map item rarity to an overlay tint. Keeps the overlay tied to the
// existing rarity-color tokens so Moro stays color-consistent with the
// inventory grid.
function rarityTint(rarity: string): string {
  switch (rarity) {
    case 'legendary': return colors.rarityLegendary;
    case 'epic':      return colors.rarityEpic;
    case 'rare':      return colors.rarityRare;
    case 'uncommon':  return colors.rarityUncommon;
    default:          return colors.rarityCommon;
  }
}

/**
 * Composites the placeholder Moro mascot with placeholder item overlays
 * for equipped slots. The overlays are intentionally simple geometric
 * silhouettes — not final art. They communicate "something is equipped
 * here" and use the rarity color. When real per-item SVGs land, swap the
 * body of this component's overlay <Svg> block. The {pose, size, items}
 * contract stays the same.
 */
export function MascotWithItems({ pose = 'welcome', size = 120, items = [] }: Props) {
  const hat = items.find((i) => i.slot === 'hat');
  const outfit = items.find((i) => i.slot === 'outfit');
  const accessory = items.find((i) => i.slot === 'accessory');
  // background + expression slots exist in the DB but are out of scope
  // for the mascot-rig overlay — backgrounds render behind the mascot,
  // expressions change eye/mouth and need per-item art.

  return (
    <View style={{ width: size, height: size }}>
      <Mascot pose={pose} size={size} />
      {(hat || outfit || accessory) ? (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <Svg width={size} height={size} viewBox="0 0 100 100">
            {outfit ? (
              <G>
                {/* Outfit: tint a small chest sash on the ivory panel */}
                <Path
                  d="M42 68 L58 68 L58 76 L42 76 Z"
                  fill={rarityTint(outfit.rarity)}
                  opacity={0.75}
                />
              </G>
            ) : null}
            {hat ? (
              <G>
                {/* Hat: small cap over the head */}
                <Path
                  d="M32 18 Q50 6 68 18 L62 22 L38 22 Z"
                  fill={rarityTint(hat.rarity)}
                />
                <Rect
                  x={34}
                  y={22}
                  width={32}
                  height={3}
                  rx={1}
                  fill={rarityTint(hat.rarity)}
                  opacity={0.8}
                />
              </G>
            ) : null}
            {accessory ? (
              <G>
                {/* Accessory: circular emblem at chest */}
                <Circle cx={50} cy={72} r={4} fill={rarityTint(accessory.rarity)} />
                <Circle cx={50} cy={72} r={2} fill={colors.surface} />
              </G>
            ) : null}
          </Svg>
        </View>
      ) : null}
    </View>
  );
}
