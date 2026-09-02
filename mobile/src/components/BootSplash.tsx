// What the app shows while it boots: the passport's cover, in the dark.
//
// It replaced a bare ActivityIndicator — a spinner that was the first thing anyone saw of
// the app, belonged to no product in particular, and was on screen longest exactly when
// the wait mattered most, on a cold start.
//
// The art is the SAME cover the onboarding splash and the passport's first page carry
// (v30), which is the point: launch and first screen are one document opening rather than
// two different pictures. It is also why this file holds the drawing and
// (onboarding)/splash.tsx renders it — one implementation, so the two can never drift.
//
// Deliberately NOT a progress bar or a percentage: boot is a handful of parallel reads
// with no meaningful ordering, so any number would be invented. The walking dot is the
// honest signal — something is happening, and it is ours.
import { useEffect, useRef } from 'react';
import { Animated, Easing, Text, View } from 'react-native';
import { cover, nbFonts } from '@/theme/nb';
import { useT } from '@/i18n';

// The document's cover, from theme/nb — the same green as the passport's first page.
const { green: COVER_GREEN, gold: COVER_GOLD, creamSoft: COVER_CREAM, goldFaint: COVER_GOLD_FAINT } = cover;

export function BootSplash({ slow }: { slow?: boolean }) {
  const t = useT();
  return (
    <View style={{ flex: 1, backgroundColor: COVER_GREEN }}>
      {/* Centred by the CONTAINER rather than by a top offset: this screen is the only
          one that has to look right on every device height before any layout has been
          measured. */}
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <View style={styles.emblem}>
          <View pointerEvents="none" style={styles.emblemInner} />
          <Text style={styles.emblemF}>f</Text>
        </View>
        {/* The wordmark is machine-printed here and handwritten everywhere else, because
            this is the COVER of the document rather than a page inside it. */}
        <Text style={styles.wordmark}>FORIN</Text>
        <Text style={styles.tagline}>{t('onb.cover.sub')}</Text>
      </View>

      <Dots />

      {/* Only once the wait is long enough to wonder about — and it says what is
          happening, not "loading". The server scales to zero, so the first launch after
          an idle period genuinely is waking something up. */}
      {slow && (
        <View style={styles.slowWrap}>
          <Text style={styles.slowText}>{t('boot.waking')}</Text>
        </View>
      )}
    </View>
  );
}

/** Three dots, the lit one walking. The only moving thing on the screen — it is what
 *  says the app is working rather than stuck. */
function Dots() {
  const t = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.timing(t, { toValue: 3, duration: 1050, easing: Easing.linear, useNativeDriver: true }),
    ).start();
  }, [t]);
  return (
    <View style={styles.dots}>
      {[0, 1, 2].map((i) => (
        <Animated.View
          key={i}
          style={[
            styles.dot,
            {
              // Interpolated rather than driven by state, so the loop never touches React
              // — this screen is on top of a boot sequence that is already busy.
              opacity: t.interpolate({
                inputRange: [i - 0.5, i, i + 0.5, i + 2.5, i + 3],
                outputRange: [0.35, 1, 0.35, 0.35, 1],
                extrapolate: 'clamp',
              }),
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = {
  emblem: {
    width: 108, height: 108, borderRadius: 54, borderWidth: 2, borderColor: COVER_GOLD,
    alignItems: 'center', justifyContent: 'center',
  } as const,
  emblemInner: {
    position: 'absolute', left: 6, top: 6, right: 6, bottom: 6,
    borderRadius: 48, borderWidth: 1.2, borderColor: COVER_GOLD_FAINT,
  } as const,
  emblemF: { fontFamily: nbFonts.hand, fontSize: 64, lineHeight: 72, color: COVER_GOLD, marginTop: -8 } as const,
  wordmark: { fontFamily: nbFonts.monoBold, fontSize: 13, letterSpacing: 6, color: COVER_GOLD, marginTop: 24 } as const,
  tagline: { fontFamily: nbFonts.hand, fontSize: 17, color: COVER_CREAM, marginTop: 8 } as const,
  dots: { position: 'absolute', left: 0, right: 0, bottom: 72, flexDirection: 'row', gap: 7, justifyContent: 'center' } as const,
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COVER_GOLD } as const,
  slowWrap: { position: 'absolute', left: 0, right: 0, bottom: 120, alignItems: 'center', paddingHorizontal: 32 } as const,
  slowText: { fontFamily: nbFonts.hand, fontSize: 15, color: COVER_CREAM, textAlign: 'center', lineHeight: 22 } as const,
};
