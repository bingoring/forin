// What the app shows while it boots: forin's plane bobbing in the middle of a pixel
// sky, with clouds drifting past it.
//
// It replaced a bare ActivityIndicator on a flat background. That spinner was the first
// thing anyone saw of the app and it belonged to no product in particular — and it was
// on screen longest exactly when the wait mattered most, on a cold start.
//
// The art is the same PixelPlane and Cloud the onboarding landing uses, so the launch
// and the first screen are continuous rather than two different skies. Both already
// animate on their own (the plane bobs, clouds drift); nothing here re-implements that.
//
// Deliberately NOT a progress bar or a percentage: boot is a handful of parallel reads
// with no meaningful ordering, so any number would be invented. The plane moving is the
// honest signal — something is happening, and it is ours.
import { Text, View } from 'react-native';
import { Cloud, PixelPlane, VertGradient } from '@/components/onboardingArt';
import { colors, fonts, fs } from '@/theme/tokens';

export function BootSplash({ slow }: { slow?: boolean }) {
  return (
    <View style={{ flex: 1, backgroundColor: colors.peach }}>
      <VertGradient from={colors.peach} to={colors.mint} bands={16} />

      {/* Clouds around the plane rather than behind it — at three sizes, so the drift
          reads as depth instead of one layer sliding. */}
      <Cloud size={1} style={{ top: '26%', left: 18 }} />
      <Cloud size={1.4} style={{ top: '38%', right: 10 }} />
      <Cloud size={0.75} style={{ top: '58%', left: 46 }} />

      {/* Centred, and centred by the CONTAINER rather than by a top offset: this screen
          is the only one that has to look right on every device height before any
          layout has been measured. */}
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ width: 170, height: 90, alignItems: 'center', justifyContent: 'center' }}>
          <PixelPlane size={170} style={{ top: 0, left: 0 }} />
        </View>
        <Text
          style={{
            marginTop: 22,
            fontFamily: fonts.heading,
            fontSize: fs(34),
            color: colors.ink,
            letterSpacing: 2,
            textShadowColor: colors.yellow,
            textShadowOffset: { width: 3, height: 3 },
            textShadowRadius: 0,
          }}
        >
          forin
        </Text>
      </View>

      {/* Only once the wait is long enough to wonder about — and it says what is
          happening, not "loading". The server scales to zero, so the first launch after
          an idle period genuinely is waking something up. */}
      {slow && (
        <View style={{ position: 'absolute', left: 0, right: 0, bottom: 56, alignItems: 'center', paddingHorizontal: 32 }}>
          <Text style={{ fontFamily: fonts.body, fontSize: fs(11), color: colors.text, textAlign: 'center', lineHeight: 17 }}>
            서버를 깨우고 있어요{'\n'}조금만 기다려 주세요
          </Text>
        </View>
      )}
    </View>
  );
}
