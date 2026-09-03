// 학습 설정 — the three answers onboarding asked for, changeable (Build Spec
// learning-tracks P1).
//
// Until this screen existed there was no way to change them at all: `PATCH /me/profile`
// has always accepted job / destination / level, and nothing after onboarding called it.
// Somebody whose plan changed — a different job, a different country — was stuck with
// the answers they gave on their first day.
//
// The same lists the passport uses (data/onboardingChoices), because a second copy is
// the one nobody updates, and here it would offer a destination the curriculum does not
// have.
//
// What this screen does NOT do yet: give each subject its own progress. That is P2 of
// the spec (learning tracks). Until it lands, changing your subject carries your level
// and your review notes with it, and the note at the bottom says so — the sentence has
// to change in the same commit that makes it false.
import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import { api } from '@/api/client';
import { NbIcon } from '@/components/nb/NbIcon';
import { NbButton, NbCheck, NbMark, NbMemo, NbPaper, NbTag, nbText } from '@/components/nb/NbUI';
import { RULE_COLOR, RULE_H, TOP_INSET, nb } from '@/theme/nb';
import { PLACE_SCREEN } from '@/theme/transitions';
import { DESTS, JOBS, LEVELS } from '@/data/onboardingChoices';
import { isDestinationReady } from '@/data/destinations';
import { playSfx } from '@/lib/sfx';
import { useT } from '@/i18n';

type Answers = { job: string; destination: string; targetLevel: string };

export default function LearningSettings() {
  const t = useT();
  const router = useRouter();
  const [saved, setSaved] = useState<Answers | null>(null);
  const [draft, setDraft] = useState<Answers | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  // Read on focus, keep the draft: coming back from anywhere must not throw away a
  // change the learner has made but not saved.
  useFocusEffect(useCallback(() => {
    let alive = true;
    void api.me()
      .then((me) => {
        if (!alive) return;
        const p = (me as { profile?: Partial<Answers> } | null)?.profile;
        const next: Answers = {
          job: p?.job || 'nurse',
          destination: p?.destination || 'us',
          targetLevel: p?.targetLevel || 'B1',
        };
        setSaved(next);
        setDraft((cur) => cur ?? next);
      })
      .catch(() => { if (alive) setError(t('learn.loadFailed')); });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []));

  const pick = (patch: Partial<Answers>) => {
    playSfx('tap');
    setError('');
    setDraft((cur) => (cur ? { ...cur, ...patch } : cur));
  };

  const dirty = !!draft && !!saved && JSON.stringify(draft) !== JSON.stringify(saved);

  const save = async () => {
    if (!draft || busy) return;
    setBusy(true);
    setError('');
    try {
      // targetLang travels with the destination, exactly as the passport does it: every
      // open destination is English-speaking, and the profile needs both.
      await api.updateProfile({ ...draft, targetLang: 'en' });
      setSaved(draft);
      playSfx('confirm');
      router.back();
    } catch {
      setError(t('learn.saveFailed'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Page>
      <Stack.Screen options={PLACE_SCREEN} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 11 }}>
          <Pressable onPress={() => router.back()} hitSlop={10}>
            <NbPaper rot={-1} style={styles.back}><NbIcon name="chevronLeft" size={16} /></NbPaper>
          </Pressable>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text numberOfLines={1} style={nbText.hand(23)}>{t('learn.title')}</Text>
            <Text numberOfLines={1} style={[nbText.body(11, nb.soft), { marginTop: 2 }]}>{t('learn.sub')}</Text>
          </View>
        </View>

        {!draft ? (
          <View style={{ paddingVertical: 40, alignItems: 'center' }}>
            {error ? <Text style={nbText.hand(15, nb.red)}>{error}</Text> : <ActivityIndicator color={nb.ink} />}
          </View>
        ) : (
          <>
            <Text style={[nbText.hand(17), { marginTop: 20 }]}>{t('learn.job')}</Text>
            {JOBS.map((j) => (
              <Row
                key={j.code}
                icon={j.icon}
                title={t(j.nameKey)}
                sub={t(j.subKey)}
                on={draft.job === j.code}
                soon={!j.ready}
                rot={j.rot}
                onPress={() => pick({ job: j.code })}
              />
            ))}

            <Text style={[nbText.hand(17), { marginTop: 22 }]}>{t('learn.dest')}</Text>
            {DESTS.map((d) => (
              <Row
                key={d.id}
                title={t(d.nameKey)}
                sub={d.sub}
                stamp={d.stampCode}
                on={draft.destination === d.id}
                soon={!isDestinationReady(d.id)}
                rot={d.rot}
                onPress={() => pick({ destination: d.id })}
              />
            ))}

            <Text style={[nbText.hand(17), { marginTop: 22 }]}>{t('learn.level')}</Text>
            {LEVELS.map((l) => (
              <Row
                key={l.id}
                title={t(l.titleKey)}
                sub={t(l.subKey)}
                stamp={l.cefr}
                on={draft.targetLevel === l.cefr}
                rot={l.rot}
                onPress={() => pick({ targetLevel: l.cefr })}
              />
            ))}

            {/* Said BEFORE the save, not after: what happens to three weeks of work is
                the thing somebody wants to know before they tap. */}
            <NbMemo color={nb.blue} rot={-0.3} style={{ marginTop: 20 }}>
              <Text style={nbText.hand(13.5)}>{t('learn.carryNote')}</Text>
            </NbMemo>

            {!!error && <Text style={[nbText.hand(14, nb.red), { marginTop: 12 }]}>{error}</Text>}

            <View style={{ marginTop: 18 }}>
              <NbButton variant="ink" full icon="check" iconColor={nb.paper} disabled={!dirty || busy} onPress={save}>
                {t('learn.save')}
              </NbButton>
            </View>
            {busy && <ActivityIndicator color={nb.ink} style={{ marginTop: 12 }} />}
          </>
        )}
      </ScrollView>
    </Page>
  );
}

/** One answer. The same paper row the passport uses, minus its page furniture. */
function Row({ icon, title, sub, stamp, on, soon, rot, onPress }: {
  icon?: React.ComponentProps<typeof NbIcon>['name'];
  title: string;
  sub: string;
  stamp?: string;
  on: boolean;
  soon?: boolean;
  rot: number;
  onPress: () => void;
}) {
  const t = useT();
  return (
    <Pressable onPress={soon ? undefined : onPress} disabled={soon}>
      <NbPaper
        rot={rot}
        style={[styles.row, on ? styles.chosen : null, soon ? { opacity: 0.5 } : null]}
      >
        {!!icon && <NbIcon name={icon} size={26} />}
        {!!stamp && <Text style={nbText.mono(10, nb.soft)}>{stamp}</Text>}
        <View style={{ flex: 1, minWidth: 0 }}>
          {on
            ? <NbMark textStyle={{ fontSize: 17 }}>{title}</NbMark>
            : <Text numberOfLines={1} style={[nbText.hand(17), { lineHeight: 20 }]}>{title}</Text>}
          <Text numberOfLines={1} style={[nbText.body(10.5, nb.soft), { marginTop: 2 }]}>{sub}</Text>
        </View>
        {/* 준비중 is a fact about the CONTENT, not about the learner's choice — so it
            replaces the checkbox rather than sitting next to one that cannot be ticked. */}
        {soon ? <NbTag color={nb.soft} rot={2}>{t('onb.soon')}</NbTag> : <NbCheck done={on} />}
      </NbPaper>
    </Pressable>
  );
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
  scroll: { paddingTop: TOP_INSET, paddingHorizontal: 20, paddingBottom: 44 },
  back: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  row: { marginTop: 9, paddingVertical: 11, paddingHorizontal: 13, flexDirection: 'row', alignItems: 'center', gap: 11 },
  chosen: { borderWidth: 2.5, borderColor: '#E9C45A' },
});
