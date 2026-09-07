// Route for the full 시나리오 모범답안 목록.
//
// The screen is a component because the review lab's 모범답안 tab renders the same list
// inline — tapping that tab should land on the list, not on a summary linking to it.
import { Stack, useLocalSearchParams } from 'expo-router';
import { ModelAnswerList } from '@/components/model/ModelAnswerList';
import { PLACE_SCREEN } from '@/theme/transitions';

export default function ModelAnswerListScreen() {
  // `?scenario=SCN-…` — arriving from a handoff note's 표현 다시 보기: open that scenario's
  // corrections expanded, so the learner sees the exact conversation, not the generic list.
  const { scenario } = useLocalSearchParams<{ scenario?: string }>();
  return (
    <>
      <Stack.Screen options={PLACE_SCREEN} />
      <ModelAnswerList focusScenario={typeof scenario === 'string' ? scenario : undefined} />
    </>
  );
}
