// 초상화 만들기 — the NbAvatar picker (핸드오프 v32).
//
// The handoff ships the asset system and a gallery of every key; it does not ship a
// picker, so this is the screen for it. Three decisions worth naming:
//
//  · The preview is PINNED above the axes. Every tap changes that face, and a preview
//    you have to scroll back to is a preview nobody uses.
//  · Every option cell is a real NbAvatar wearing the learner's own current face with
//    only that one axis changed. A swatch of colour cannot show what `wavyMid` is, and
//    a generic model wearing it answers a question nobody asked.
//  · 저장 is explicit, and leaving without it keeps the old face. The picker is ten
//    axes deep; auto-saving each tap would mean a stray tap on 배경 is permanent, and
//    "주사위" would overwrite a face somebody built.
import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import { NbAvatar } from '@/components/nb/NbAvatar';
import { NbIcon } from '@/components/nb/NbIcon';
import { NbButton, NbIndexTabs, NbMemo, NbPaper, nbText } from '@/components/nb/NbUI';
import { RULE_COLOR, RULE_H, TOP_INSET, nb, nbFonts } from '@/theme/nb';
import { PLACE_SCREEN } from '@/theme/transitions';
import { AVATAR_AXES, DEFAULT_AVATAR_SPEC, randomAvatarSpec, type AvatarSpec } from '@/data/nbAvatar';
import { hasChosenAvatar, myAvatar, saveAvatar } from '@/lib/nbAvatar';
import { useMyAvatar } from '@/hooks/useMyAvatar';
import { playSfx } from '@/lib/sfx';
import { useT } from '@/i18n';

export default function AvatarPicker() {
  const t = useT();
  const router = useRouter();
  const stored = useMyAvatar();
  // The face being edited. Seeded from the store ONCE, on focus, so the screen does
  // not snap back under the learner's finger every time the store settles.
  const [draft, setDraft] = useState<AvatarSpec | null>(null);
  const [axis, setAxis] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useFocusEffect(useCallback(() => {
    setDraft((cur) => cur ?? myAvatar() ?? DEFAULT_AVATAR_SPEC);
  }, []));

  const face = draft ?? stored ?? DEFAULT_AVATAR_SPEC;
  const current = AVATAR_AXES[axis];
  const dirty = JSON.stringify(face) !== JSON.stringify(stored ?? DEFAULT_AVATAR_SPEC);

  const pick = (key: string) => {
    playSfx('tap');
    setError('');
    setDraft({ ...face, [current.key]: key } as AvatarSpec);
  };

  const shuffle = () => {
    playSfx('tap');
    setError('');
    setDraft(randomAvatarSpec());
  };

  const save = async () => {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      await saveAvatar(face);
      playSfx('confirm');
      router.back();
    } catch {
      setError(t('avatar.saveFailed'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Page>
      <Stack.Screen options={PLACE_SCREEN} />

      {/* The pinned half: the face, and what the two buttons do to it. */}
      <View style={styles.head}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 11 }}>
          <Pressable onPress={() => router.back()} hitSlop={10}>
            <NbPaper rot={-1} style={styles.back}><NbIcon name="chevronLeft" size={16} /></NbPaper>
          </Pressable>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text numberOfLines={1} style={nbText.hand(23)}>{t('avatar.title')}</Text>
            <Text numberOfLines={1} style={[nbText.body(11, nb.soft), { marginTop: 2 }]}>
              {hasChosenAvatar() ? t('avatar.sub') : t('avatar.subFirstTime')}
            </Text>
          </View>
        </View>

        <View style={styles.previewRow}>
          {/* A print, not a bare drawing: the white margin is what lets a picture sit
              on a paper page. */}
          <NbPaper rot={-1.5} style={styles.print}>
            <NbAvatar spec={face} size={104} />
          </NbPaper>
          <View style={{ flex: 1, minWidth: 0, gap: 8 }}>
            <NbButton variant="paper" full icon="star" onPress={shuffle}>{t('avatar.shuffle')}</NbButton>
            <NbButton
              variant="ink"
              full
              icon="check"
              iconColor={nb.paper}
              disabled={!dirty || busy}
              onPress={save}
            >
              {t('avatar.save')}
            </NbButton>
            {busy && <ActivityIndicator color={nb.ink} />}
            {!!error && <Text style={nbText.hand(13, nb.red)}>{error}</Text>}
          </View>
        </View>
      </View>

      {/* Ten axes as index tabs — the same control the review lab uses for its
          sections, because this is the same act: one list, many faces of it. */}
      <NbIndexTabs
        tabs={AVATAR_AXES.map((a) => [t(a.labelKey)] as [string])}
        active={axis}
        onSelect={setAxis}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.grid}>
        {current.options.map((key) => {
          const on = face[current.key] === key;
          return (
            <Pressable key={key} onPress={() => pick(key)} style={styles.cell}>
              <NbPaper
                rot={on ? -1.2 : 0.5}
                bg={on ? 'rgba(168,217,151,.35)' : undefined}
                style={[styles.cellPaper, on ? { borderColor: nb.green, borderWidth: 1.8 } : null]}
              >
                {/* The learner's own face with ONE axis swapped: what changes is the
                    only thing that differs between the cells. */}
                <NbAvatar spec={{ ...face, [current.key]: key } as AvatarSpec} size={54} />
                {on && (
                  <View style={styles.tick}><NbIcon name="check" size={11} color={nb.green} /></View>
                )}
              </NbPaper>
              <Text numberOfLines={1} style={styles.cellLabel}>{key}</Text>
            </Pressable>
          );
        })}

        <NbMemo color={nb.blue} rot={-0.3} style={{ marginTop: 6 }}>
          <Text style={nbText.hand(13.5)}>{t('avatar.note')}</Text>
        </NbMemo>
      </ScrollView>
    </Page>
  );
}

/** The ruled page. */
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
  head: { paddingTop: TOP_INSET, paddingHorizontal: 20, paddingBottom: 10 },
  back: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  previewRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 13 },
  print: { paddingTop: 5, paddingHorizontal: 5, paddingBottom: 5 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 40 },
  cell: { width: 72, alignItems: 'center' },
  cellPaper: { padding: 5, alignItems: 'center' },
  cellLabel: { fontFamily: nbFonts.mono, fontSize: 8, color: nb.soft, marginTop: 3, letterSpacing: 0.3 },
  tick: {
    position: 'absolute', top: -5, right: -5, backgroundColor: nb.paper,
    borderWidth: 1.4, borderColor: nb.green, borderRadius: 3, width: 17, height: 17,
    alignItems: 'center', justifyContent: 'center',
  },
});
