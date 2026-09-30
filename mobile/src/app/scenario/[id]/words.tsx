// STEP placeholder — lesson-four-steps-v44. The hub links here now so the button is not a
// dead route; Task H replaces this file with the real screen.
import { Pressable, Text, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StepTrack } from '@/components/lesson/StepTrack';
import { NbIcon } from '@/components/nb/NbIcon';
import { NbPaper, nbText } from '@/components/nb/NbUI';
import { api, type LessonStepView } from '@/api/client';
import { TOP_INSET, nb } from '@/theme/nb';
import { useT } from '@/i18n';
import { TASK_SCREEN } from '@/theme/transitions';

export default function LessonStepStub() {
  const t = useT();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [steps, setSteps] = useState<LessonStepView[]>([]);
  useEffect(() => { api.lesson(id).then((l) => setSteps(l.steps)).catch(() => {}); }, [id]);
  return (
    <View style={{ flex: 1, backgroundColor: nb.cream, paddingTop: TOP_INSET }}>
      <Stack.Screen options={TASK_SCREEN} />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 20 }}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <NbPaper rot={-1} style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}>
            <NbIcon name="chevronLeft" size={16} />
          </NbPaper>
        </Pressable>
        <Text style={nbText.hand(21)}>{t('lesson.step.words')}</Text>
      </View>
      {steps.length > 0 && <View style={{ marginTop: 12 }}><StepTrack steps={steps} /></View>}
      <Text style={[nbText.hand(16, nb.soft), { textAlign: 'center', marginTop: 40 }]}>{t('lesson.stub.body')}</Text>
    </View>
  );
}
