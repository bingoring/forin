// MilestoneFlag — the section-exam flag at the end of a track. 핸드오프 v41
// 08_JOURNEY_RESOURCES.md §3("마일스톤 깃발") · frontend-components.md §2/§6.
//
// No `onPress` (task-19-brief.md): there is no exam a learner can actually tap into
// yet, so this is a sign, not a button — the only journey-map element that isn't
// pressable. Dimming it before it opens is the SAME language J1/J3 already
// established for a `far` station (opacity, not a padlock): drawing a lock here would
// contradict that rule for a shape that was never interactive to begin with, which is
// why this file draws no lock icon in any state.
//
// `state` comes straight off the server (learning.Milestone.State) and is never
// invented here — `passed` does not appear in practice yet (no scoreable exam exists),
// but the type carries it so a future exam does not need this component touched.
import { Text } from 'react-native';
import { NbPaper, nbText } from '@/components/nb/NbUI';
import { nb } from '@/theme/nb';
import { useT } from '@/i18n';

export type MilestoneState = 'passed' | 'open' | 'closed';

// rect 80×34 — frontend-components.md §2, pinned the same way Station.tsx pins RADIUS:
// JourneyMap's layout math reads these rather than repeating the numbers.
export const MILESTONE_FLAG_WIDTH = 80;
export const MILESTONE_FLAG_HEIGHT = 34;

export function MilestoneFlag({ title, state }: { title: string; state: MilestoneState }) {
  const t = useT();
  return (
    <NbPaper
      testID="milestone-flag"
      style={{
        width: MILESTONE_FLAG_WIDTH,
        height: MILESTONE_FLAG_HEIGHT,
        alignItems: 'center',
        justifyContent: 'center',
        // 열리기 전 opacity .55(frontend-components.md §2) — `closed`만 흐리다. `passed`도
        // 지금 나오지 않지만(브리프) 나오는 순간 정상 밝기여야 하므로 `!== 'open'`이 아니라
        // `=== 'closed'`로 콕 집는다.
        opacity: state === 'closed' ? 0.55 : 1,
      }}
    >
      <Text numberOfLines={1} style={nbText.mono(8, nb.blue)}>
        {title}
      </Text>
      <Text numberOfLines={1} style={[nbText.hand(11), { marginTop: 2 }]}>
        {t(`journey.milestone.${state}`)}
      </Text>
    </NbPaper>
  );
}
