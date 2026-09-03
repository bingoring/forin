// 글쓰기 / 대화 공유하기 (핸드오프 v31 07 · 라운지 B).
//
// One screen for all three kinds of post, because they are one act with one extra
// part: a share is a note with a conversation stapled to it. The kind row switches
// the staple on and off.
//
// The rule the screen exists to make visible: quoted turns must be CONSECUTIVE.
// A snippet with a hole reads as one exchange and is two, which misrepresents what
// the patient said — so a turn that would create a gap is drawn locked (✕) rather
// than silently accepted and rejected by the server later. The server enforces the
// same rule; this is where the learner can see it.
import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { LOUNGE_LIMITS, api, type LoungeKind } from '@/api/client';
import { NbIcon } from '@/components/nb/NbIcon';
import { NbButton, NbChip, NbMemo, NbPaper, nbText } from '@/components/nb/NbUI';
import { RULE_COLOR, RULE_H, TOP_INSET, nb, nbFonts } from '@/theme/nb';
import { PLACE_SCREEN } from '@/theme/transitions';
import { clearShareSource, shareSource } from '@/data/loungeShare';
import { useT } from '@/i18n';

const KINDS: LoungeKind[] = ['talk', 'question', 'share'];
const KIND_KEY: Record<LoungeKind, string> = {
  talk: 'lounge.kindTalk',
  question: 'lounge.kindQuestion',
  share: 'lounge.kindShare',
};

export default function Compose() {
  const t = useT();
  const router = useRouter();
  // Read once, on mount: this is module state, and deriving it during render would
  // be computed once per instance and then go stale.
  const [source] = useState(() => shareSource());
  // Opened from the result screen with a conversation in hand, the kind the learner
  // came here for is 대화 공유 — landing on 일상 would make them pick it again.
  const { kind: wanted } = useLocalSearchParams<{ kind?: string }>();
  const [kind, setKind] = useState<LoungeKind>(
    KINDS.includes(wanted as LoungeKind) ? (wanted as LoungeKind) : 'talk',
  );
  const [body, setBody] = useState('');
  const [tagDraft, setTagDraft] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [picked, setPicked] = useState<number[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  // Memoised because `selectable` depends on it: a fresh [] every render would
  // recompute the lock set on every keystroke in the body field.
  const turns = useMemo(() => source?.turns ?? [], [source]);
  const sharing = kind === 'share' && !!source;

  /** Which turn indexes may still be tapped: the ends of the current run, or —
   *  with nothing picked yet — anything. */
  const selectable = useMemo(() => {
    if (picked.length === 0) return new Set(turns.map((turn) => turn.index));
    const lo = Math.min(...picked);
    const hi = Math.max(...picked);
    const ends = new Set<number>(picked); // tapping either end takes it back off
    if (picked.length < LOUNGE_LIMITS.turns) {
      ends.add(lo - 1);
      ends.add(hi + 1);
    }
    return ends;
  }, [picked, turns]);

  const toggleTurn = (index: number) => {
    setError('');
    setPicked((prev) => {
      if (!prev.includes(index)) return [...prev, index].sort((a, b) => a - b);
      // Taking one off keeps the run unbroken: only the ends can be removed, and
      // `selectable` is what makes the middle untappable in the first place.
      return prev.filter((i) => i !== index);
    });
  };

  const addTag = () => {
    const clean = tagDraft.trim().replace(/^#+/, '').trim();
    setTagDraft('');
    if (!clean || tags.includes(clean)) return;
    if (tags.length >= LOUNGE_LIMITS.tags) return;
    setTags((prev) => [...prev, clean.slice(0, LOUNGE_LIMITS.tagLen)]);
  };

  const canPost = body.trim().length > 0 && (!sharing || picked.length > 0) && !busy;

  const submit = async () => {
    if (!canPost) return;
    setBusy(true);
    setError('');
    try {
      await api.postToLounge({
        kind,
        body: body.trim(),
        tags,
        ...(sharing
          ? {
            scenarioId: source!.scenarioId,
            snippet: {
              title: source!.title,
              turns: picked.map((i) => turns.find((turn) => turn.index === i)!)
                .filter(Boolean)
                .map((turn) => ({ index: turn.index, role: turn.role, text: turn.text })),
            },
          }
          : {}),
      });
      // Consumed: opening 글쓰기 tomorrow must not staple yesterday's conversation
      // to a note about something else.
      if (sharing) clearShareSource();
      router.back();
    } catch (e) {
      // The server's own message names what is wrong with the draft (too long, too
      // many tags, daily limit) and every one of them is fixable by editing, so it
      // is shown rather than replaced with "실패".
      setError(messageOf(e) || t('lounge.postFailed'));
    } finally {
      setBusy(false);
    }
  };

  const left = LOUNGE_LIMITS.body - body.trim().length;

  return (
    <Page>
      <Stack.Screen options={PLACE_SCREEN} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 11 }}>
          <Pressable onPress={() => router.back()} hitSlop={10}>
            <NbPaper rot={-1} style={styles.back}><NbIcon name="chevronLeft" size={16} /></NbPaper>
          </Pressable>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text numberOfLines={1} style={nbText.hand(23)}>{sharing ? t('lounge.shareTitle') : t('lounge.composeTitle')}</Text>
            <Text numberOfLines={1} style={[nbText.body(11, nb.soft), { marginTop: 2 }]}>
              {sharing ? t('lounge.shareSub') : t('lounge.composeSub')}
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 7, marginTop: 14 }}>
          {KINDS.map((k, i) => (
            <NbChip key={k} on={kind === k} rot={i % 2 ? 0.8 : -0.8} onPress={() => { setKind(k); setError(''); }}>
              {t(KIND_KEY[k])}
            </NbChip>
          ))}
        </View>

        {/* 대화 공유 with nothing to quote. Said plainly instead of hiding the kind:
            the learner picked it on purpose, and where the button lives is the answer
            they need. */}
        {kind === 'share' && !source && (
          <NbMemo color={nb.red} rot={-0.3} style={{ marginTop: 12 }}>
            <Text style={nbText.hand(14)}>{t('lounge.shareNeedsConversation')}</Text>
          </NbMemo>
        )}

        {sharing && (
          <>
            <NbPaper rot={-0.4} style={styles.sourceCard}>
              <NbIcon name="speech" size={22} />
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text numberOfLines={2} style={nbText.hand(16)}>{source!.title}</Text>
                <Text numberOfLines={1} style={[nbText.body(10, nb.soft), { marginTop: 2 }]}>
                  {t('lounge.sourceTurns', { n: turns.length })}
                </Text>
              </View>
            </NbPaper>

            <NbMemo color={nb.blue} rot={-0.3} style={{ marginTop: 11 }}>
              <Text style={nbText.hand(13.5)}>{t('lounge.consecutiveRule')}</Text>
            </NbMemo>

            <NbPaper rot={0.3} style={{ marginTop: 12 }}>
              {turns.map((turn, i) => {
                const on = picked.includes(turn.index);
                const open = selectable.has(turn.index);
                return (
                  <Pressable
                    key={turn.index}
                    onPress={() => open && toggleTurn(turn.index)}
                    disabled={!open}
                    style={[
                      styles.turn,
                      i > 0 && styles.turnDivider,
                      on && styles.turnOn,
                      !open && styles.turnLocked,
                    ]}
                  >
                    <View style={[styles.box, { borderColor: on ? nb.green : open ? nb.soft : '#C9BFA8' }]}>
                      {on ? (
                        <Svg viewBox="0 0 24 24" width={17} height={17}>
                          <Path d="M5 12 L10 17 L20 5" fill="none" stroke={nb.green} strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round" />
                        </Svg>
                      ) : !open ? (
                        <NbIcon name="cross" size={10} color="#C9BFA8" />
                      ) : null}
                    </View>
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <Text style={{ fontFamily: nbFonts.monoBold, fontSize: 9, color: turn.role === 'user' ? nb.blue : nb.red }}>
                        {turn.role === 'user' ? t('lounge.roleMe') : t('lounge.roleOther')}
                      </Text>
                      <Text style={[nbText.body(12.5, nb.ink), { marginTop: 1, lineHeight: 17 }]}>{turn.text}</Text>
                    </View>
                  </Pressable>
                );
              })}
            </NbPaper>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 9 }}>
              <Text numberOfLines={1} style={nbText.hand(14, picked.length > 0 ? nb.green : nb.soft)}>
                {t('lounge.pickedTurns', { n: picked.length })}
              </Text>
              <View style={{ flex: 1 }} />
              <Text numberOfLines={1} style={nbText.hand(13, nb.soft)}>{t('lounge.maxTurns', { n: LOUNGE_LIMITS.turns })}</Text>
            </View>
          </>
        )}

        <Text style={[nbText.hand(16), { marginTop: 15 }]}>{sharing ? t('lounge.bodyWithShare') : t('lounge.bodyLabel')}</Text>
        <NbPaper rot={-0.3} style={styles.bodyCard}>
          <TextInput
            value={body}
            onChangeText={(v) => { setBody(v); setError(''); }}
            placeholder={t(kind === 'question' ? 'lounge.bodyHintQuestion' : 'lounge.bodyHint')}
            placeholderTextColor={nb.placeholder}
            multiline
            style={styles.bodyInput}
            maxLength={LOUNGE_LIMITS.body}
          />
        </NbPaper>
        <Text style={[nbText.mono(10, left < 40 ? nb.red : nb.soft), { alignSelf: 'flex-end', marginTop: 4 }]}>
          {`${body.trim().length} / ${LOUNGE_LIMITS.body}`}
        </Text>

        <View style={styles.tagRow}>
          {tags.map((tag) => (
            <Pressable key={tag} onPress={() => setTags((prev) => prev.filter((x) => x !== tag))} hitSlop={6}>
              <View style={styles.tagChip}>
                <Text numberOfLines={1} style={nbText.hand(13, nb.blue)}>{`#${tag}`}</Text>
                <NbIcon name="cross" size={9} color={nb.soft} />
              </View>
            </Pressable>
          ))}
          {tags.length < LOUNGE_LIMITS.tags && (
            <View style={styles.tagInputWrap}>
              <TextInput
                value={tagDraft}
                onChangeText={setTagDraft}
                onSubmitEditing={addTag}
                onBlur={addTag}
                placeholder={t('lounge.addTag')}
                placeholderTextColor={nb.placeholder}
                style={styles.tagInput}
                returnKeyType="done"
                maxLength={LOUNGE_LIMITS.tagLen + 1}
              />
            </View>
          )}
        </View>

        {!!error && (
          <Text style={[nbText.hand(14, nb.red), { marginTop: 12 }]}>{error}</Text>
        )}

        <View style={{ marginTop: 16 }}>
          <NbButton variant="ink" full icon="pushpin" iconColor={nb.paper} disabled={!canPost} onPress={submit}>
            {sharing ? t('lounge.pinShare') : t('lounge.pin')}
          </NbButton>
        </View>
        {busy && <ActivityIndicator color={nb.ink} style={{ marginTop: 12 }} />}
      </ScrollView>
    </Page>
  );
}

/** The server's message, when it sent one. Axios buries it two levels down, and the
 *  generic "Request failed with status code 400" is worse than nothing here. */
function messageOf(e: unknown): string {
  const r = (e as { response?: { data?: { error?: string; message?: string } } })?.response?.data;
  return r?.error || r?.message || '';
}

function Page({ children }: { children: React.ReactNode }) {
  const [h, setH] = useState(900);
  return (
    <View style={{ flex: 1, backgroundColor: nb.cream }} onLayout={(e) => setH(e.nativeEvent.layout.height)}>
      <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, overflow: 'hidden' }}>
        {Array.from({ length: Math.ceil(h / RULE_H) }).map((_, i) => (
          <View key={i} style={{ position: 'absolute', left: 0, right: 0, top: (i + 1) * RULE_H, height: 1, backgroundColor: RULE_COLOR }} />
        ))}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingTop: TOP_INSET, paddingHorizontal: 20, paddingBottom: 48 },
  back: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  sourceCard: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12, paddingVertical: 10, paddingHorizontal: 13 },
  turn: { flexDirection: 'row', alignItems: 'flex-start', gap: 9, paddingVertical: 8, paddingHorizontal: 10 },
  turnDivider: { borderTopWidth: 1.3, borderStyle: 'dashed', borderTopColor: 'rgba(62,54,43,.13)' },
  turnOn: { backgroundColor: 'rgba(168,217,151,.3)' },
  turnLocked: { backgroundColor: 'rgba(62,54,43,.05)', opacity: 0.55 },
  box: { width: 19, height: 19, flexShrink: 0, marginTop: 2, borderWidth: 1.7, borderRadius: 4, alignItems: 'center', justifyContent: 'center' },
  bodyCard: { marginTop: 7, paddingVertical: 6, paddingHorizontal: 13 },
  bodyInput: {
    fontFamily: nbFonts.hand, fontSize: 15.5, color: nb.ink, lineHeight: 22,
    minHeight: 96, paddingTop: 8, paddingBottom: 8, textAlignVertical: 'top',
  },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 6, marginTop: 10 },
  tagChip: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  tagInputWrap: {
    borderWidth: 1.3, borderStyle: 'dashed', borderColor: nb.soft, borderRadius: 2,
    paddingHorizontal: 7, minWidth: 92,
  },
  tagInput: { fontFamily: nbFonts.hand, fontSize: 13, color: nb.ink, paddingVertical: 3 },
});
