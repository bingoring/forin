// The rail's 노트 — this situation's 교정노트, in a bottom sheet (lesson-fidelity-v46 결정 6:
// the learner never leaves the conversation to read them).
//
// The handoff names the button (07 "하단: 보내기 · 듣기 · 노트") but draws nothing behind it;
// the rows are the review lab's own ModelAnswerCardRow, so a correction looks the same
// wherever it is read. The situation's quiz steps used to hang off this same board icon —
// they are offered at the foot of the sheet rather than dropped.
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { BottomSheet } from '@/components/BottomSheet';
import { ModelAnswerCardRow } from '@/components/model/ModelAnswerCardRow';
import { NbIcon } from '@/components/nb/NbIcon';
import { NbButton, nbText } from '@/components/nb/NbUI';
import type { ModelAnswerCard } from '@/api/client';
import { useT } from '@/i18n';
import { nb } from '@/theme/nb';

export function NotesSheet({ visible, onClose, notes, quizCount, onQuiz }: {
  visible: boolean;
  onClose: () => void;
  /** null while loading. */
  notes: ModelAnswerCard[] | null;
  quizCount: number;
  onQuiz: () => void;
}) {
  const t = useT();
  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View testID="notes-sheet" style={{ paddingHorizontal: 16, paddingTop: 6, paddingBottom: 24 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <NbIcon name="board" size={18} />
          <Text style={[nbText.hand(20), { flex: 1 }]}>{t('dialogue.notesTitle')}</Text>
          {!!notes?.length && <Text style={nbText.monoBold(11, nb.soft)}>{notes.length}</Text>}
        </View>
        {notes === null ? (
          <ActivityIndicator color={nb.ink} style={{ marginVertical: 18 }} />
        ) : notes.length === 0 ? (
          <Text style={[nbText.hand(15, nb.soft), { marginVertical: 12 }]}>{t('dialogue.notesEmpty')}</Text>
        ) : (
          <ScrollView style={{ maxHeight: 360 }} showsVerticalScrollIndicator={false}>
            {notes.map((c, i) => <ModelAnswerCardRow key={`${c.createdAt}-${i}`} card={c} divider={i < notes.length - 1} />)}
          </ScrollView>
        )}
        {quizCount > 0 && (
          <View style={{ marginTop: 12 }}>
            <NbButton variant="paper" full icon="board" onPress={onQuiz}>
              {quizCount > 1 ? `${t('dialogue.notesQuiz')} · ${quizCount}` : t('dialogue.notesQuiz')}
            </NbButton>
          </View>
        )}
      </View>
    </BottomSheet>
  );
}
