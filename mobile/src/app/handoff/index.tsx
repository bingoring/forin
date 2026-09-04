// 환자 인수인계 노트 (v38 HandoffNotes).
//
// The 'after' of a shift. When a learner clears a patient scenario well, that patient can
// send a short follow-up note the next day — a thank-you, an update, or a nudge back to a
// harder case. Notes are generated on the server (LLM, once per encounter) and arrive when
// the inbox is opened; here they read like paper slips left in a handover binder.
//
// Three kinds, three actions:
//   · gratitude → 답장 한마디 (a reply the patient answers back to, in English)
//   · followup  → 이어서 하기 (opens the next scenario the note points to)
//   · review    → 표현 보기 (opens the saved model answers)
import { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import { NbIcon } from '@/components/nb/NbIcon';
import { NbAvatar } from '@/components/nb/NbAvatar';
import { NbButton, NbMemo, NbPaper, NbSheet, NbTag, nbText } from '@/components/nb/NbUI';
import { avatarSpecFromSeed } from '@/data/nbAvatar';
import { TOP_INSET, nb } from '@/theme/nb';
import { api, type HandoffKind, type HandoffNote } from '@/api/client';
import { useT } from '@/i18n';

const KIND_COLOR: Record<HandoffKind, string> = {
  gratitude: nb.green,
  followup: nb.blue,
  review: nb.red,
};

/** How many whole days ago `iso` was, in the caller's timezone. Never negative. */
function daysAgo(iso: string): number {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return 0;
  const d = Math.floor((Date.now() - then) / 86_400_000);
  return d < 0 ? 0 : d;
}

export default function HandoffScreen() {
  const t = useT();
  const router = useRouter();
  const [notes, setNotes] = useState<HandoffNote[]>([]);
  const [ready, setReady] = useState(false);
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      void api.handoff().then((inbox) => {
        if (!alive) return;
        setNotes(inbox.notes);
        setReady(true);
        // Opening the inbox counts as reading: clear each note's unread mark on the server
        // (so the home badge drops) while keeping the local `read` flag as-is, so the NEW
        // slips stay visible for this visit and are gone on the next.
        for (const n of inbox.notes) {
          if (!n.read) void api.readHandoff(n.id).catch(() => {});
        }
      }).catch(() => { if (alive) setReady(true); });
      return () => { alive = false; };
    }, []),
  );

  const when = useMemo(() => (iso: string) => {
    const d = daysAgo(iso);
    if (d <= 0) return t('handoff.today');
    if (d === 1) return t('handoff.yesterday');
    return t('handoff.daysAgo', { n: d });
  }, [t]);

  const openReply = (id: string) => { setReplyingId(id); setDraft(''); };

  const send = async (note: HandoffNote) => {
    const text = draft.trim();
    if (!text || busy) return;
    setBusy(true);
    try {
      const updated = await api.replyHandoff(note.id, text);
      setNotes((cur) => cur.map((n) => (n.id === note.id ? updated : n)));
      setReplyingId(null);
      setDraft('');
    } catch { /* best-effort — the note stays open to try again */ } finally { setBusy(false); }
  };

  const act = (note: HandoffNote) => {
    void api.readHandoff(note.id).catch(() => {});
    if (note.kind === 'followup' && note.refScenarioId) router.push(`/scenario/${note.refScenarioId}`);
    else if (note.kind === 'review') router.push('/model-answers');
  };

  return (
    <NbSheet>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingTop: TOP_INSET, paddingHorizontal: 20, paddingBottom: 2 }}>
        <Pressable onPress={() => router.back()}>
          <NbPaper rot={-1} style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}>
            <NbIcon name="chevronLeft" size={16} />
          </NbPaper>
        </Pressable>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={nbText.hand(22)}>{t('handoff.title')}</Text>
          <Text numberOfLines={1} style={nbText.body(9.5, nb.soft)}>{t('handoff.sub')}</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: 44 }}>
        {ready && notes.length === 0 && (
          <NbMemo rot={0.3}>{t('handoff.empty')}</NbMemo>
        )}

        {notes.map((n, i) => {
          const replying = replyingId === n.id;
          return (
            <NbPaper key={n.id} rot={i % 2 ? -0.6 : 0.7} tape={!n.read} tapeLeft={140} style={{ padding: 15, marginBottom: 13 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 11 }}>
                <NbAvatar spec={avatarSpecFromSeed(n.id)} size={46} />
                <View style={{ flex: 1, minWidth: 0 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text numberOfLines={1} style={[nbText.hand(16), { flexShrink: 1 }]}>{n.patientName}</Text>
                    {!n.read && <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: nb.red }} />}
                  </View>
                  {!!n.patientSub && <Text numberOfLines={1} style={nbText.mono(10, nb.soft)}>{n.patientSub}</Text>}
                  <Text numberOfLines={1} style={[nbText.mono(9.5, nb.soft), { marginTop: 1 }]}>
                    {n.coord ? t('handoff.metAt', { when: when(n.metAt), coord: n.coord }) : when(n.metAt)}
                  </Text>
                </View>
                <NbTag color={KIND_COLOR[n.kind]} rot={i % 2 ? 1.5 : -1.5}>{t(`handoff.tag.${n.kind}`)}</NbTag>
              </View>

              <Text style={[nbText.hand(15.5), { marginTop: 11, lineHeight: 23 }]}>{n.body}</Text>

              {/* A reply already sent: show both lines as a little exchange. */}
              {n.replied && (
                <View style={{ marginTop: 11, gap: 7 }}>
                  <View style={{ alignSelf: 'flex-end', maxWidth: '85%', paddingVertical: 6, paddingHorizontal: 10, backgroundColor: 'rgba(74,111,165,.1)', borderWidth: 1.2, borderColor: nb.blue, borderRadius: 3 }}>
                    <Text style={nbText.body(12.5)}>{n.replyText}</Text>
                  </View>
                  {!!n.patientReply && (
                    <View style={{ alignSelf: 'flex-start', maxWidth: '85%', paddingVertical: 6, paddingHorizontal: 10, backgroundColor: 'rgba(95,141,90,.1)', borderWidth: 1.2, borderColor: nb.green, borderRadius: 3 }}>
                      <Text style={nbText.body(12.5)}>{n.patientReply}</Text>
                    </View>
                  )}
                </View>
              )}

              {/* The reply composer (gratitude, not yet replied). */}
              {replying && !n.replied && (
                <View style={{ marginTop: 11 }}>
                  <TextInput
                    value={draft}
                    onChangeText={setDraft}
                    placeholder={t('handoff.replyPlaceholder')}
                    placeholderTextColor={nb.soft}
                    multiline
                    maxLength={280}
                    style={[nbText.body(13), { minHeight: 46, borderWidth: 1.3, borderColor: nb.ink, borderRadius: 3, padding: 9, textAlignVertical: 'top' }]}
                  />
                  <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 }}>
                    <NbButton variant="ink" size="sm" disabled={busy || !draft.trim()} onPress={() => void send(n)}>{t('handoff.send')}</NbButton>
                  </View>
                </View>
              )}

              {/* The action for this kind, when there is nothing open yet. */}
              {!n.replied && !replying && (
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 11 }}>
                  {n.kind === 'gratitude'
                    ? <NbButton variant="yellow" size="sm" icon="pencil" onPress={() => openReply(n.id)}>{t('handoff.act.gratitude')}</NbButton>
                    : n.kind === 'followup'
                      ? <NbButton variant="ink" size="sm" iconRight="chevronRight" onPress={() => act(n)}>{t('handoff.act.followup')}</NbButton>
                      : <NbButton variant="paper" size="sm" icon="bulb" onPress={() => act(n)}>{t('handoff.act.review')}</NbButton>}
                </View>
              )}
            </NbPaper>
          );
        })}
      </ScrollView>
    </NbSheet>
  );
}
