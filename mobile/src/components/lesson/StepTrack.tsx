// StepTrack — the four-step header every STEP screen of a situation lesson wears
// (lesson-four-steps-v44 Task F; handoff reference forin-notebook-lesson.jsx StepTrack).
//
// The reference takes `done` (a count) and `active` (an index). The app takes the
// server's per-step states instead: a count cannot say that step 1 was skipped while
// step 3 is done, and the server already decided each state (GET /me/lesson).
import { Text, View } from 'react-native';
import Svg, { ClipPath, Circle, Defs, G, Line } from 'react-native-svg';
import { NbIcon, type NbIconName } from '@/components/nb/NbIcon';
import { nbText } from '@/components/nb/NbUI';
import type { LessonStepKind, LessonStepState, LessonStepView } from '@/api/client';
import { useT } from '@/i18n';
import { nb, nbFonts } from '@/theme/nb';

const STEP_LOOK: Record<LessonStepKind, { icon: NbIconName; color: string }> = {
  words: { icon: 'pencil', color: nb.amber },
  sentences: { icon: 'speech', color: nb.blue },
  guided: { icon: 'speech', color: nb.purple },
  free: { icon: 'mic', color: nb.red },
};

const D = 44;
const faint = 'rgba(62,54,43,.25)';

export function StepTrack({ steps }: { steps: LessonStepView[] }) {
  const t = useT();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 26 }}>
      {steps.map((s, i) => {
        const look = STEP_LOOK[s.kind];
        const dim = s.state === 'lock' || s.state === 'skip' || s.state === 'empty';
        // lesson.jsx L43 `i < done`: solid after a step the learner actually finished. A
        // skipped or not-yet-written step was not done, so the line after it stays dashed
        // (lesson-fidelity-v46 T6, audit hub #87).
        const solid = s.state === 'done';
        const label = t(`lesson.step.${s.kind}`);
        const note = s.state === 'skip' ? t('lesson.step.skip') : s.state === 'empty' ? t('lesson.step.empty') : '';
        return (
          <View key={s.kind} style={{ flexDirection: 'row', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 0 }}>
            <View
              style={{ width: 58, alignItems: 'center' }}
              accessibilityLabel={note ? `${label} · ${note}` : label}
            >
              <View style={[circle(s.state, look.color), { transform: [{ rotate: `${i % 2 ? 3 : -3}deg` }] }]}>
                {s.state === 'skip' && <Hatch />}
                <View style={{ opacity: dim ? 0.4 : 1 }}><NbIcon name={look.icon} size={22} /></View>
                {s.state === 'done' && (
                  <View testID="steptrack-done" style={{
                    position: 'absolute', right: -5, top: -5, width: 17, height: 17, borderRadius: 8.5,
                    backgroundColor: nb.green, borderWidth: 1.5, borderColor: nb.paper, alignItems: 'center', justifyContent: 'center',
                  }}>
                    <NbIcon name="check" size={11} color="#fff" />
                  </View>
                )}
                {s.state === 'skip' && (
                  <View testID="steptrack-strike" style={{
                    position: 'absolute', left: -4, right: -4, top: D / 2 - 1, borderTopWidth: 2, borderColor: nb.soft,
                    transform: [{ rotate: '-20deg' }],
                  }} />
                )}
              </View>
              <Text
                testID={`steptrack-label-${s.kind}`}
                numberOfLines={1}
                style={[
                  nbText.hand(12.5, dim ? nb.soft : nb.ink),
                  // L41 `fontWeight: 700` — Gaegu's own bold cut; a weight on the regular face
                  // is not synthesised for a custom font on iOS (audit hub #86).
                  { marginTop: 4 },
                  s.state === 'now' ? { fontFamily: nbFonts.handBold } : null,
                  s.state === 'skip' ? { textDecorationLine: 'line-through' } : null,
                ]}
              >
                {label}
              </Text>
            </View>
            {i < steps.length - 1 && <Link index={i} solid={solid} />}
          </View>
        );
      })}
    </View>
  );
}

/**
 * The line between two circles. Drawn from views rather than a one-sided border: RN
 * clips a border inside a zero-height box, and iOS will not dash a border that is set
 * on one side only — both render as no line at all.
 */
function Link({ index, solid }: { index: number; solid: boolean }) {
  return (
    <View testID={`steptrack-link-${index}`} style={{
      flex: 1, height: 2, marginTop: -18, overflow: 'hidden', flexDirection: 'row', gap: 3,
      backgroundColor: solid ? nb.green : 'transparent',
    }}>
      {!solid && Array.from({ length: 12 }).map((_, k) => (
        <View key={k} testID="steptrack-dash" style={{ width: 4, height: 2, backgroundColor: faint }} />
      ))}
    </View>
  );
}

function circle(state: LessonStepState, color: string) {
  const base = { width: D, height: D, borderRadius: D / 2, alignItems: 'center' as const, justifyContent: 'center' as const };
  switch (state) {
    case 'now': return { ...base, borderWidth: 2.2, borderColor: color, backgroundColor: `${color}18` };
    case 'done': return { ...base, borderWidth: 2, borderColor: nb.green, backgroundColor: 'rgba(95,141,90,.12)' };
    case 'skip': return { ...base, borderWidth: 1.4, borderColor: faint };
    // lock and empty look alike on the track: not yet, and nothing to press. Only skip
    // is hatched — hatching means "your level skips this", which empty is not.
    default: return { ...base, borderWidth: 1.6, borderColor: nb.soft, borderStyle: 'dashed' as const };
  }
}

/**
 * The reference's `repeating-linear-gradient(-45deg, rgba(62,54,43,.07) 0 3px, transparent
 * 3px 7px)`, drawn as SVG lines clipped to the circle. The 3 and 7 are measured across the
 * stripes, so the lines are 3 thick and 7·√2 apart along a row (audit hub #81).
 */
const HATCH_STEP = 7 * Math.SQRT2;
function Hatch() {
  return (
    <View testID="steptrack-hatch" pointerEvents="none" style={{ position: 'absolute', left: 0, top: 0 }}>
      <Svg width={D} height={D}>
        <Defs>
          <ClipPath id="steptrack-hatch-clip"><Circle cx={D / 2} cy={D / 2} r={D / 2 - 1} /></ClipPath>
        </Defs>
        <G clipPath="url(#steptrack-hatch-clip)">
          {Array.from({ length: Math.ceil((2 * D) / HATCH_STEP) + 1 }).map((_, k) => (
            <Line key={k} x1={k * HATCH_STEP - D} y1={D} x2={k * HATCH_STEP} y2={0} stroke="rgba(62,54,43,.07)" strokeWidth={3} />
          ))}
        </G>
      </Svg>
    </View>
  );
}
