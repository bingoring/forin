// The top-right cluster of the dialogue screen: the way out of the situation, and the
// missions it will be graded on.
//
// Its own file because three bugs lived in it and none of them was reachable by a test
// while it was 70 lines inside a 1,000-line screen:
//
//  1. The mission panel rendered EMPTY. Its text is a `flex: 1` child, and the cluster
//     sized itself to its content (`alignItems: 'flex-end'`, no width) — a flex child in
//     an auto-width parent resolves to a basis of zero, so the panel laid out at ~0pt
//     wide and there was nothing to see. The width is definite now, and the panel
//     stretches to it.
//  2. Opening the panel pushed 상황 종료 far below the panel's visible bottom. Same
//     cause: at ~0pt wide every word wrapped onto its own line, so the height Collapsible
//     measured was several times the height anyone could see. Fixing the width fixes the
//     phantom space; there was never anything hidden down there.
//  3. The × in the opposite corner moved when the panel opened. That one is in the row
//     ABOVE this component (see the screen): it centred its children vertically, so
//     growing this cluster re-centred the exit. The row pins to the top now.
//
// Order: the way out first, missions under it. Asked for directly — and it also puts the
// exit at a fixed distance from the top corner instead of one that moves with the
// mission count.
import { Animated, Pressable, Text, View } from 'react-native';
import { Collapsible, DisclosureChevron } from '@/components/Collapsible';
import { FIcon } from '@/components/FIcon';
import { PixelButton } from '@/components/PixelButton';
import { colors, fonts, fs } from '@/theme/tokens';
import { useT } from '@/i18n';

const C = colors.ink;

/** The cluster's width, and therefore the panel's.
 *
 *  DEFINITE on purpose. It used to be `maxWidth`, which leaves the width to the content —
 *  and a `flex: 1` child of an auto-width parent gets a flex basis of zero, which is how
 *  the panel came to be laid out at no width at all. */
export const MISSION_CLUSTER_W = 240;

export function MissionCluster({ goals, done, open, onToggle, opacity, disabled }: {
  goals: string[];
  /** 1-based mission numbers the character has reported as covered. */
  done: Set<number>;
  open: boolean;
  onToggle: () => void;
  /** Fades with the rest of the chrome while the keyboard is up. */
  opacity: Animated.AnimatedInterpolation<number> | number;
  /** True while typing: the cluster is faded, so it must not take touches either. */
  disabled?: boolean;
}) {
  const t = useT();
  return (
    <Animated.View
      testID="mission-cluster"
      // alignItems: 'flex-end' pins the chip and the button to the right WALL. The end
      // button used to line up with the left edge of the mission box, so it drifted left
      // and right as the mission text changed length.
      style={{ alignItems: 'flex-end', gap: 4, width: MISSION_CLUSTER_W, opacity }}
      pointerEvents={disabled ? 'none' : 'auto'}
    >
      {goals.length > 0 && (
        <>
          {/* The chip is the whole control: it says how many missions there are and opens
              them. They used to be listed permanently in a white box, which at four or
              five goals — the shape all content has now — grew tall enough to cover the
              portrait and crowd the thread. A learner glances at this; they do not read
              it continuously. So it is closed by default and one tap away. */}
          <Pressable onPress={onToggle} hitSlop={6}>
            <View style={{ position: 'absolute', left: 2, top: 2, right: -2, bottom: -2, backgroundColor: C }} />
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: colors.yellow, borderWidth: 2, borderColor: C, paddingVertical: 3, paddingHorizontal: 8 }}>
              <Text style={{ fontFamily: fonts.heading, fontSize: fs(10), color: C }}>
                {t('dialogue.missionCount', { n: goals.length })}
              </Text>
              {/* Says how far along, when the character has reported anything — the
                  number is the reason to open it or not. */}
              {done.size > 0 && (
                <Text style={{ fontFamily: fonts.heading, fontSize: fs(9), color: colors.textSoft }}>
                  {done.size}/{goals.length}
                </Text>
              )}
              <DisclosureChevron open={open} color={C} size={11} />
            </View>
          </Pressable>

          {/* The WIDTH CHAIN, and every link of it matters.
              The panel's text is a `flex: 1` child, so it needs a parent with a definite
              width or it resolves to a basis of zero and lays out invisibly. Putting the
              width on the cluster alone was not enough — and that is exactly what the
              first attempt did: Collapsible sits between them, the cluster pins its
              children to the right wall rather than stretching them, so Collapsible's
              own width stayed auto and the panel's `alignSelf: 'stretch'` stretched to
              nothing. The width is repeated HERE so the chain has no auto link in it. */}
          <Collapsible open={open} style={{ marginTop: 3, width: MISSION_CLUSTER_W }}>
            <View
              testID="mission-panel"
              style={{
                alignSelf: 'stretch',
                backgroundColor: 'rgba(255,255,255,0.96)',
                borderWidth: 2,
                borderColor: C,
                paddingVertical: 5,
                paddingHorizontal: 8,
                gap: 3,
              }}
            >
              {goals.map((g, i) => {
                const isDone = done.has(i + 1);
                return (
                  <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 5 }}>
                    {/* A bullet, so the items read as a list rather than as one paragraph
                        that happens to wrap. The tick replaces it when covered — two
                        marks in a row would be noise. */}
                    {isDone
                      ? <FIcon name="check" size={11} />
                      : <Text style={{ fontFamily: fonts.body, fontSize: fs(10), color: colors.textSoft, lineHeight: 14 }}>·</Text>}
                    <Text
                      style={{
                        flex: 1,
                        fontFamily: fonts.body,
                        fontSize: fs(10),
                        lineHeight: 14,
                        color: isDone ? colors.textSoft : C,
                        textDecorationLine: isDone ? 'line-through' : 'none',
                      }}
                    >
                      {g}
                    </Text>
                  </View>
                );
              })}
            </View>
          </Collapsible>
        </>
      )}
    </Animated.View>
  );
}
