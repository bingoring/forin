// STEP 3 가이드 대화의 입력부 — handoff v46 dialogue.jsx DialogueOptions L150–176
// (lesson-fidelity-v46 T7): the 말하기 / 타이핑 pill switch, then either the 84pt red
// HOLD mic ("꾹 누르고 영어로 말하기") or the typing card (underlined writing line + word
// chips that insert on tap).
//
// The parent owns the draft and the recorder: what the mic hears lands in the same draft
// the typing card edits, so a learner can say it and then fix one word by typing.
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';
import { NbIcon } from '@/components/nb/NbIcon';
import { NbPaper, nbText } from '@/components/nb/NbUI';
import { useT } from '@/i18n';
import { nb, nbFonts } from '@/theme/nb';

export type GuidedInputMode = 'speak' | 'type';
export type RecState = 'idle' | 'recording' | 'transcribing';

export function GuidedInput({ mode, onMode, rec, onMicDown, onMicUp, draft, onDraft, chips, editable, micEnabled, onSubmit }: {
  mode: GuidedInputMode;
  onMode: (m: GuidedInputMode) => void;
  rec: RecState;
  /** Press-in on the big mic: start recording. */
  onMicDown: () => void;
  /** Release: stop and transcribe into the draft. */
  onMicUp: () => void;
  draft: string;
  onDraft: (next: string) => void;
  /** Word chips under the writing line (data/guidedTarget wordChips). */
  chips: string[];
  /** The writing line and chips take input. */
  editable: boolean;
  /** The mic takes a press. Separate from `editable`: while it records the draft is not
   *  editable, but the release that ends the recording must still reach the mic. */
  micEnabled: boolean;
  onSubmit: () => void;
}) {
  const t = useT();
  const insert = (w: string) => onDraft(draft.trim() ? `${draft.replace(/\s+$/, '')} ${w}` : w);
  return (
    <View style={{ flex: 1, minHeight: 0 }}>
      {/* L151–157: centred, gap 8, marginTop 12. */}
      <View style={{ flexDirection: 'row', gap: 8, marginTop: 12, justifyContent: 'center' }}>
        {([['speak', 'mic', t('guided.modeSpeak')], ['type', 'pencil', t('guided.modeType')]] as const).map(([m, icon, label]) => {
          const on = mode === m;
          return (
            <Pressable
              key={m}
              testID={`guided-mode-${m}`}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
              onPress={() => onMode(m)}
              style={{
                flexDirection: 'row', alignItems: 'center', gap: 6,
                paddingVertical: 6, paddingHorizontal: 14, borderRadius: 99,
                borderWidth: 1.6, borderColor: on ? nb.ink : 'rgba(62,54,43,.3)',
                backgroundColor: on ? nb.ink : 'transparent',
              }}
            >
              <NbIcon name={icon} size={15} color={on ? nb.paper : undefined} />
              <Text numberOfLines={1} style={nbText.hand(14, on ? nb.paper : nb.soft)}>{label}</Text>
            </Pressable>
          );
        })}
      </View>
      {/* L158: the spacer that puts the mic / the card at the bottom. */}
      <View style={{ flex: 1 }} />
      {mode === 'speak' ? (
        // L160–163
        <View style={{ alignItems: 'center', paddingBottom: 6 }}>
          <Pressable
            testID="guided-mic"
            accessibilityRole="button"
            accessibilityLabel={t('guided.holdToSpeak')}
            onPressIn={micEnabled ? onMicDown : undefined}
            onPressOut={micEnabled ? onMicUp : undefined}
            disabled={!micEnabled}
            style={{
              width: 84, height: 84, borderRadius: 42, borderWidth: 2.5, borderColor: nb.red,
              // Recording deepens the red wash — ours; the handoff draws the idle mic only.
              backgroundColor: rec === 'recording' ? 'rgba(199,81,70,.3)' : 'rgba(199,81,70,.12)',
              alignItems: 'center', justifyContent: 'center',
              shadowColor: nb.ink, shadowOpacity: 0.18, shadowRadius: 4, shadowOffset: { width: 0, height: 3 }, elevation: 3,
            }}
          >
            {rec === 'transcribing' ? <ActivityIndicator color={nb.ink} /> : <NbIcon name="mic" size={40} />}
          </Pressable>
          <Text numberOfLines={1} style={[nbText.hand(14, nb.soft), { marginTop: 7 }]}>
            {rec === 'recording' ? t('guided.holdListening') : rec === 'transcribing' ? t('dialogue.transcribing') : t('guided.holdToSpeak')}
          </Text>
        </View>
      ) : (
        // L165–175
        <NbPaper testID="guided-typing-card" rot={0.3} style={{ paddingVertical: 10, paddingHorizontal: 12, marginBottom: 6 }}>
          <Text numberOfLines={1} style={{ fontFamily: nbFonts.bodyBold, fontSize: 10, color: nb.blue, letterSpacing: 1 }}>{t('guided.typeLabel')}</Text>
          <TextInput
            value={draft}
            onChangeText={onDraft}
            editable={editable}
            cursorColor={nb.ink}
            selectionColor={nb.ink}
            multiline
            submitBehavior="blurAndSubmit"
            returnKeyType="send"
            onSubmitEditing={onSubmit}
            style={{
              borderBottomWidth: 2, borderBottomColor: 'rgba(62,54,43,.45)',
              paddingVertical: 6, paddingHorizontal: 2, marginTop: 4,
              fontFamily: nbFonts.body, fontSize: 15, color: nb.ink, minHeight: 30,
            }}
          />
          {chips.length > 0 && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 }}>
              {chips.map((w) => (
                <Pressable key={w} testID="guided-word-chip" onPress={() => insert(w)} disabled={!editable} hitSlop={4}
                  style={{ borderWidth: 1.3, borderColor: nb.paperEdge, borderRadius: 3, paddingVertical: 2, paddingHorizontal: 7, backgroundColor: '#fff' }}>
                  <Text numberOfLines={1} style={{ fontFamily: nbFonts.mono, fontSize: 11, color: nb.ink }}>{w}</Text>
                </Pressable>
              ))}
              <View style={{ flex: 1 }} />
              <Text numberOfLines={1} style={nbText.hand(12.5, nb.soft)}>{t('guided.chipHint')}</Text>
            </View>
          )}
        </NbPaper>
      )}
    </View>
  );
}
