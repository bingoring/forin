// A roaming ambient NPC: useGridMover drives tile position/dir/walking/emote;
// the sprite glides between tiles (reanimated) with the same step-synced gait as
// the player, and pops an emote bubble. Each instance owns its own mover/timer so
// per-tick updates re-render only this NPC, not the whole map (06 §4). Reusable —
// drop into any tile world via an NpcSpec.
import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { TILE } from './coords';
import { useGridMover } from './useGridMover';
import { RoleSprite } from '@/characters/Sprite';
import { EmoteBubble } from './EmoteBubble';
import type { NpcSpec } from './types';

const NPC_GLIDE_MS = 340; // tile glide window (NPCs amble slower than the player)

export function AmbientNpc({ spec, size }: { spec: NpcSpec; size: number }) {
  const { x, y, dir, walking, emote } = useGridMover({
    mode: spec.mode,
    path: spec.path,
    bound: spec.bound,
    start: spec.start,
    tickMs: spec.tickMs,
    emoteChance: spec.emoteChance,
  });

  const spriteH = (size * 80) / 64;
  const dx = TILE / 2 - size / 2;
  const dy = TILE - spriteH;

  const pxX = useSharedValue(x * TILE);
  const pyY = useSharedValue(y * TILE);
  const walkClock = useSharedValue(0);
  useEffect(() => {
    pxX.value = withTiming(x * TILE, { duration: NPC_GLIDE_MS, easing: Easing.linear });
    pyY.value = withTiming(y * TILE, { duration: NPC_GLIDE_MS, easing: Easing.linear });
    walkClock.value = 0;
    walkClock.value = withTiming(1, { duration: NPC_GLIDE_MS, easing: Easing.linear });
  }, [x, y, pxX, pyY, walkClock]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: pxX.value + dx }, { translateY: pyY.value + dy }],
  }));

  return (
    <Animated.View pointerEvents="none" style={[{ position: 'absolute', left: 0, top: 0, width: size, height: spriteH }, style]}>
      {emote ? (
        <View style={{ position: 'absolute', top: -16, left: 0, right: 0, alignItems: 'center', zIndex: 5 }}>
          <EmoteBubble emote={emote} />
        </View>
      ) : null}
      <RoleSprite kind={spec.kind} seed={spec.seed} mood={spec.mood} size={size} dir={dir} walking={walking} walkClock={walkClock} />
    </Animated.View>
  );
}
