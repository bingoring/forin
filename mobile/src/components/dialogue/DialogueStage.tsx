// The dialogue's stage contents — handoff v46 dialogue.jsx Stage (L41–58), lesson-fidelity-v46
// 결정 5: the taped polaroid in the middle, the name stamp and the red mood tag on the LEFT
// (left 22), the speaker on the RIGHT (right 26). Positions come from data/dialogueSplit
// stageGeometry, which is the handoff's numbers at the handoff heights and follows the
// learner's drag from there.
//
// The band itself (`#F6E3DC`, 1.5 #E0D6C0 underline) is drawn by the screen, behind its
// backdrop press; this is what stands on it. The portrait is NbAvatar — the app's avatar
// system — where the handoff sketches a doodle Portrait.
import type { ReactNode } from 'react';
import { Animated, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { NbIcon } from '@/components/nb/NbIcon';
import { NbPaper, NbPressable } from '@/components/nb/NbUI';
import { PIC, STAGE_TOP, type StageGeometry } from '@/data/dialogueSplit';
import { nb, nbFonts } from '@/theme/nb';

export function DialogueStage({ g, name, status, sweat, portrait, voiceOn, onToggleVoice, voiceLabel, opacity, typing }: {
  g: StageGeometry;
  name: string;
  /** The mood tag (PAIN, FOCUSED …). Absent → no tag. */
  status?: string;
  sweat?: boolean;
  /** The portrait, drawn PIC.w × scale wide. */
  portrait: (width: number) => ReactNode;
  voiceOn: boolean;
  onToggleVoice: () => void;
  voiceLabel: string;
  opacity: Animated.Value | Animated.AnimatedInterpolation<number>;
  typing: boolean;
}) {
  const w = Math.round(PIC.w * g.scale);
  const pe = typing ? 'none' : 'box-none';
  return (
    <>
      {/* L44–49: centred, paper(-1.5) 8/8/4, tape 58×16 rot -3 at top -9, print height 120|92. */}
      <Animated.View pointerEvents={pe} style={{ position: 'absolute', left: 0, right: 0, top: STAGE_TOP + g.polaroidTop, alignItems: 'center', zIndex: 3, opacity }}>
        <View>
          <NbPaper rot={-1.5} style={{ paddingTop: 8, paddingHorizontal: 8, paddingBottom: 4 }}>
            <View testID="stage-tape" pointerEvents="none" style={{ position: 'absolute', top: -9, left: (w + 16) / 2 - 29, width: 58, height: 16, backgroundColor: nb.tape, transform: [{ rotate: '-3deg' }], zIndex: 2 }} />
            <View testID="stage-print" style={{ width: w, height: g.pictureH, overflow: 'hidden', alignItems: 'center' }}>
              {portrait(w)}
            </View>
          </NbPaper>
          {/* The distress drop rides the mood (ours — the handoff draws sweat into the
              patient doodle, which NbAvatar does not have). */}
          {sweat && (
            <View style={{ position: 'absolute', top: 2, right: -8, zIndex: 4 }}>
              <Svg viewBox="0 0 24 24" width={18} height={18}>
                <Path d="M12 4 Q17 12 17 15 A5 5 0 0 1 7 15 Q7 12 12 4 Z" fill="rgba(74,111,165,.35)" stroke={nb.blue} strokeWidth="1.6" strokeLinejoin="round" />
              </Svg>
            </View>
          )}
        </View>
      </Animated.View>

      {/* L50–53: left 22. Name stamp paper(-2) 3/9, MONO 11 700, never wraps; the mood tag
          under it — red, white Pretendard 9.5 800 tracking 1, 2/7, rot -2, square. */}
      <Animated.View testID="stage-plate" pointerEvents="none" style={{ position: 'absolute', left: 22, top: STAGE_TOP + g.nameTop, zIndex: 4, opacity, alignItems: 'flex-start' }}>
        <NbPaper rot={-2} style={{ paddingVertical: 3, paddingHorizontal: 9 }}>
          <Text numberOfLines={1} style={{ fontFamily: nbFonts.monoBold, fontSize: 11, color: nb.ink }}>{name}</Text>
        </NbPaper>
        {!!status && (
          <View testID="stage-mood" style={{ marginTop: 6, backgroundColor: nb.red, paddingVertical: 2, paddingHorizontal: 7, transform: [{ rotate: '-2deg' }] }}>
            <Text numberOfLines={1} style={{ fontFamily: nbFonts.bodyBold, fontSize: 9.5, letterSpacing: 1, color: '#fff' }}>{status}</Text>
          </View>
        )}
      </Animated.View>

      {/* L54–55: right 26, paper(2) 32×32, NbIcon speaker 17. It is the voice switch — off
          draws the speaker faded (ours; the handoff has only the on state). */}
      <Animated.View pointerEvents={pe} style={{ position: 'absolute', right: 26, top: STAGE_TOP + g.speakerTop, zIndex: 4, opacity }}>
        <NbPressable
          testID="stage-voice"
          accessibilityLabel={voiceLabel}
          onPress={onToggleVoice}
          rot={2}
          shadow="paper"
          faceStyle={{ width: 32, height: 32, backgroundColor: nb.paper, borderWidth: 1, borderColor: nb.paperEdge, alignItems: 'center', justifyContent: 'center' }}
        >
          <View style={{ opacity: voiceOn ? 1 : 0.4 }}>
            <NbIcon name="speaker" size={17} />
          </View>
        </NbPressable>
      </Animated.View>
    </>
  );
}
