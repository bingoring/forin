// PathSegment — the dashed Q-curve between two stations. 핸드오프 v41 08_JOURNEY_RESOURCES.md §3.
//
// The curve itself never decides `done` — JourneyMap does, from the two stations it
// connects, because a segment is only "cleared" when BOTH ends are (one done and one not
// is still a road ahead). This component just draws whatever it is told.
import { Path } from 'react-native-svg';
import { nb } from '@/theme/nb';

export interface Point { x: number; y: number }

export function PathSegment({ from, to, done }: { from: Point; to: Point; done: boolean }) {
  const cx = (from.x + to.x) / 2;
  const cy = from.y + 14;
  return (
    <Path
      testID="path-segment"
      d={`M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`}
      stroke={done ? nb.green : 'rgba(62,54,43,.28)'}
      strokeWidth={done ? 2.6 : 2.2}
      strokeDasharray="7 7"
      fill="none"
    />
  );
}
