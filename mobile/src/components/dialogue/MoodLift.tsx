// "You made this better" — the one piece of feedback the dialogue gives mid-scenario.
//
// It appears only when the NPC's mood improved on the learner's last line (see the
// server's MoodImproved). Never on a decline: praising someone whose patient got
// worse is worse than silence, and narrating every downward step turns a role-play
// into a scolding.
//
// It also has to stay OUT of the way. This is a conversation the learner is reading,
// so the banner is a thin strip that fades in above the input, holds, and fades out
// on its own — no tap to dismiss, nothing to close, and it never covers the thread.
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { nb, nbFonts } from '@/theme/nb';
import { NbIcon } from '@/components/nb/NbIcon';
import { useT } from '@/i18n';
import type { Mood } from '@/data/moodTone';

/** How long the strip stays fully visible before fading. Long enough to read six
 *  words, short enough that it is gone before the next reply arrives. */
const HOLD_MS = 2200;
const FADE_MS = 260;

/** Which words to use. The mood is what the character BECAME, so the line names the
 *  change rather than grading the learner — "환자가 안심했어요", not "잘했어요". Praise
 *  for its own sake is what the result screen is for; this is the situation telling
 *  the learner that it moved. */
export function liftKey(mood: Mood): string {
  switch (mood) {
    case 'happy':
      return 'mood.lift.relieved';
    case 'focused':
    case 'thinking':
      return 'mood.lift.calmed';
    case 'neutral':
    case 'derp':
      return 'mood.lift.settled';
    default:
      // Any other improvement is a step out of something worse — still real, still
      // worth saying, without claiming more than happened.
      return 'mood.lift.eased';
  }
}

export function MoodLift({ mood, onDone }: { mood?: Mood; onDone: () => void }) {
  const t = useT();
  const opacity = useRef(new Animated.Value(0)).current;
  // The callback is held in a ref so the animation effect does not restart every time
  // the parent re-renders — which it does on every streamed chunk. A restarting
  // animation would hold the banner open for the whole reply.
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    if (!mood) return;
    opacity.setValue(0);
    const anim = Animated.sequence([
      Animated.timing(opacity, { toValue: 1, duration: FADE_MS, useNativeDriver: true }),
      Animated.delay(HOLD_MS),
      Animated.timing(opacity, { toValue: 0, duration: FADE_MS, useNativeDriver: true }),
    ]);
    anim.start(({ finished }) => { if (finished) doneRef.current(); });
    // Stopping on unmount matters: leaving the scenario mid-banner would otherwise
    // call back into a screen that is gone.
    return () => anim.stop();
  }, [mood, opacity]);

  if (!mood) return null;
  return (
    <Animated.View pointerEvents="none" style={[styles.wrap, { opacity }]}>
      <View style={styles.strip}>
        <NbIcon name="star" size={14} color={nb.green} />
        <Text style={styles.text}>{t(liftKey(mood))}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', marginBottom: 6 },
  /** A slip of green paper, laid on at an angle — somebody's mood improved, and the note
   *  is passed along rather than announced. */
  strip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(168,217,151,.4)',
    borderWidth: 1.3,
    borderColor: '#BFD3BB',
    borderRadius: 2,
    paddingVertical: 5,
    paddingHorizontal: 11,
    transform: [{ rotate: '-0.8deg' }],
  },
  text: { fontFamily: nbFonts.hand, fontSize: 15, color: nb.ink },
});
