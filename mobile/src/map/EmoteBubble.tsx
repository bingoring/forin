// Speech-bubble emote above an ambient NPC (06_CHARACTER_MOTION §4): a small
// white rounded box with an ink border + tail, popping in. Driven by the emoji
// string useGridMover yields; mounting (emote present) triggers the pop.
import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import { colors } from '@/theme/tokens';

export function EmoteBubble({ emote }: { emote: string }) {
  const s = useSharedValue(0);
  useEffect(() => {
    // forinEmotePop: 0 → 1.15 → 1
    s.value = withSequence(withTiming(1.15, { duration: 140 }), withTiming(1, { duration: 90 }));
  }, [emote, s]);

  const style = useAnimatedStyle(() => ({ transform: [{ scale: s.value }] }));

  return (
    <Animated.View pointerEvents="none" style={[{ alignItems: 'center' }, style]}>
      <View
        style={{
          backgroundColor: '#fff',
          borderColor: colors.ink,
          borderWidth: 2,
          borderRadius: 6,
          paddingHorizontal: 5,
          paddingVertical: 2,
        }}
      >
        <Text style={{ fontSize: 13, lineHeight: 16 }}>{emote}</Text>
      </View>
      {/* tail */}
      <View style={{ width: 4, height: 4, backgroundColor: colors.ink, marginTop: -1 }} />
    </Animated.View>
  );
}
