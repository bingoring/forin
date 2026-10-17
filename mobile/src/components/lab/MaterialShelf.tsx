// 자료 선반 — the old home Extras, shelved in the review lab (handoff v48 · lab.jsx L66~77).
//
// v47 took every door but one off the home; v48 put the two that are reading material —
// the patients' handoff notes and the slang deck — on a shelf under the 교정 노트 tab, as
// two icon tiles with a red count when something new is waiting. The lab keeps its three
// index tabs; the shelf is not a fourth.
//
// Each count is read on its own and a failed read just draws no badge: the shelf is a
// door, and a door must not wait on a number.
import { useCallback, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { NbIcon, type NbIconName } from '@/components/nb/NbIcon';
import { NbPaper } from '@/components/nb/NbUI';
import { api } from '@/api/client';
import { useT } from '@/i18n';
import { nb, nbFonts } from '@/theme/nb';

export function MaterialShelf() {
  const t = useT();
  const router = useRouter();
  const [handoffNew, setHandoffNew] = useState(0);
  const [slangNew, setSlangNew] = useState(0);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      // Opening the inbox is what generates a waiting note; this reads the resulting
      // unread count, as the home badge used to.
      void Promise.resolve().then(() => api.handoff())
        .then((inbox) => { if (alive) setHandoffNew(inbox.unread); }).catch(() => {});
      // The slang deck drops one card a day: "new" is today's card not yet collected.
      void Promise.resolve().then(() => api.slang())
        .then((deck) => { if (alive) setSlangNew(deck.collectableToday ? 1 : 0); }).catch(() => {});
      return () => { alive = false; };
    }, []),
  );

  const tiles: { key: string; icon: NbIconName; label: string; n: number; bg: string; rot: number; go: () => void }[] = [
    { key: 'handoff', icon: 'board', label: t('lab.shelf.handoff'), n: handoffNew, bg: 'rgba(249,227,123,.38)', rot: -0.7, go: () => router.push('/handoff') },
    { key: 'slang', icon: 'speech', label: t('lab.shelf.slang'), n: slangNew, bg: 'rgba(95,141,90,.16)', rot: 0.7, go: () => router.push('/slang') },
  ];

  return (
    <View style={{ flexDirection: 'row', gap: 9 }}>
      {tiles.map((s) => (
        <Pressable key={s.key} onPress={s.go} style={{ flex: 1 }} testID={`lab-shelf-${s.key}`}
          accessibilityRole="button" accessibilityLabel={s.n > 0 ? `${s.label} · ${s.n}` : s.label}>
          <NbPaper rot={s.rot} bg={s.bg} style={{ paddingTop: 10, paddingBottom: 8, alignItems: 'center' }}>
            <View>
              <NbIcon name={s.icon} size={28} />
              {s.n > 0 && (
                <View testID={`lab-shelf-${s.key}-badge`}
                  style={{ position: 'absolute', right: -9, top: -5, minWidth: 16, height: 16, borderRadius: 8, paddingHorizontal: 3, backgroundColor: nb.red, borderWidth: 1.5, borderColor: nb.paper, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontFamily: nbFonts.bodyBold, fontSize: 9.5, color: '#fff' }}>{s.n}</Text>
                </View>
              )}
            </View>
            <Text numberOfLines={1} style={{ fontFamily: nbFonts.hand, fontSize: 14.5, color: nb.ink, marginTop: 3 }}>{s.label}</Text>
          </NbPaper>
        </Pressable>
      ))}
    </View>
  );
}
