// 자료 선반 — the old home Extras, shelved in the review lab (handoff v48 · lab.jsx L66~77).
//
// v47 took every door but one off the home; v48 put the two that are reading material —
// the patients' handoff notes and the slang deck — on a shelf under the 교정 노트 tab, as
// two icon tiles with a red NewDot (v49: wiggles once) when something new is waiting. The lab keeps its three
// index tabs; the shelf is not a fourth.
//
// Each count is read on its own and a failed read just draws no badge: the shelf is a
// door, and a door must not wait on a number.
import { useCallback, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { NbIcon, type NbIconName } from '@/components/nb/NbIcon';
import { NbPaper } from '@/components/nb/NbUI';
import { NewDot } from '@/components/nb/V48';
import { useV48Press } from '@/components/nb/nbMotion';
import { api } from '@/api/client';
import { useT } from '@/i18n';
import { nb, nbFonts } from '@/theme/nb';

/** 선반 한 칸 — 눌리면 아래 2·3px · -1°(`.v48-press`), 새 것이 있으면 NewDot(빨간 숫자 원, 처음 한 번 흔들림). */
function ShelfTile({ icon, label, n, bg, rot, go, id }: {
  icon: NbIconName; label: string; n: number; bg: string; rot: number; go: () => void; id: string;
}) {
  // 놓임 기울기 `rot`은 눌리면 `.v48-press`가 덮는다 — NbPaper가 아니라 이 바깥 래퍼가 돌아야 한다.
  const press = useV48Press('press', rot);
  return (
    <Pressable onPress={go} onPressIn={press.onPressIn} onPressOut={press.onPressOut} style={{ flex: 1 }} testID={`lab-shelf-${id}`}
      accessibilityRole="button" accessibilityLabel={n > 0 ? `${label} · ${n}` : label}>
      <Animated.View style={{ transform: press.transform }}>
        <NbPaper bg={bg} style={{ paddingTop: 10, paddingBottom: 8, alignItems: 'center' }}>
          <View>
            <NbIcon name={icon} size={28} />
            {n > 0 && (
              <View testID={`lab-shelf-${id}-badge`} pointerEvents="none" style={StyleSheet.absoluteFill}>
                <NewDot n={n} />
              </View>
            )}
          </View>
          <Text numberOfLines={1} style={{ fontFamily: nbFonts.hand, fontSize: 14.5, color: nb.ink, marginTop: 3 }}>{label}</Text>
        </NbPaper>
      </Animated.View>
    </Pressable>
  );
}

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
        <ShelfTile key={s.key} id={s.key} icon={s.icon} label={s.label} n={s.n} bg={s.bg} rot={s.rot} go={s.go} />
      ))}
    </View>
  );
}
