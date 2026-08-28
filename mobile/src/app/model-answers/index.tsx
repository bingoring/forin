// Route for the full 시나리오 모범답안 목록.
//
// The screen is a component because the review lab's 모범답안 tab renders the same list
// inline — tapping that tab should land on the list, not on a summary linking to it.
import { Stack } from 'expo-router';
import { ModelAnswerList } from '@/components/model/ModelAnswerList';
import { PLACE_SCREEN } from '@/theme/transitions';

export default function ModelAnswerListScreen() {
  return (
    <>
      <Stack.Screen options={PLACE_SCREEN} />
      <ModelAnswerList />
    </>
  );
}
