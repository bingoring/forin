// Route for the full 직접 말하기 목록 (04_SCREENS ⑨ "11b").
//
// The screen itself is a component, because the review lab's 말하기 tab renders the same
// list inline — tapping that tab should land on the list, not on a summary with a "전체 ›"
// link into it. One implementation, two placements.
import { Stack } from 'expo-router';
import { SpeakList } from '@/components/speak/SpeakList';
import { PLACE_SCREEN } from '@/theme/transitions';

export default function SpeakListScreen() {
  return (
    <>
      <Stack.Screen options={PLACE_SCREEN} />
      <SpeakList />
    </>
  );
}
