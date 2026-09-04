// 나이트 근무 라디오 (v38 NightRadio).
//
// A dark, quiet channel for the night shift. Two parts: a lo-fi radio (night-only ambiance)
// and 오늘 밤의 이야기 — a short night-shift story that ends in one English line to practice.
// Stories are server content (rotating daily; 다음 이야기 pages by offset), so the story is
// readable any time; the radio player only "opens" between 10pm and 5am.
//
// Audio: the app bundles sounds via require() (Metro resolves them statically), so a track
// file cannot be referenced until it exists. Until a royalty-free lo-fi track is added to
// assets/audio, the play button shows 준비 중 — the EQ bars still animate as decoration.
import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, ScrollView, Text, View } from 'react-native';
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import { createAudioPlayer, type AudioPlayer } from 'expo-audio';
import { NbIcon } from '@/components/nb/NbIcon';
import { NbButton, NbMemo, NbPaper, NbSheet, NbTag, nbText } from '@/components/nb/NbUI';
import { TOP_INSET, nb } from '@/theme/nb';
import { api, type NightRadio as NightRadioT } from '@/api/client';
import { useT } from '@/i18n';

// A calm, quiet ambient loop, synthesized for the night channel (scripts/make_lofi.py). Swap
// this file to change the track — it just has to be a bundled audio asset.
const TRACK = require('../../../assets/audio/lofi-night-shift.wav');

const STARS: [number, number][] = [[0.08, 20], [0.24, 44], [0.5, 14], [0.7, 38], [0.88, 24], [0.95, 56]];

/** One equaliser bar, breathing on its own clock. */
function EqBar({ i, on }: { i: number; on: boolean }) {
  const v = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    if (!on) { v.stopAnimation(); v.setValue(0.4); return; }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(v, { toValue: 1, duration: 380 + i * 70, easing: Easing.inOut(Easing.quad), useNativeDriver: false }),
        Animated.timing(v, { toValue: 0.35, duration: 380 + i * 70, easing: Easing.inOut(Easing.quad), useNativeDriver: false }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [v, i, on]);
  const h = v.interpolate({ inputRange: [0, 1], outputRange: [3, 14] });
  return <Animated.View style={{ width: 3.5, height: h, backgroundColor: nb.green }} />;
}

export default function NightRadio() {
  const t = useT();
  const router = useRouter();
  const [radio, setRadio] = useState<NightRadioT | null>(null);
  const [offset, setOffset] = useState(0);
  const [playing, setPlaying] = useState(false);
  const player = useRef<AudioPlayer | null>(null);

  const hour = new Date().getHours();
  const open = hour >= 22 || hour < 5; // the radio's night window

  // The looping track is created once and cleaned up on leave; playback stops when the
  // screen loses focus so it never plays on in the background.
  useEffect(() => {
    const p = createAudioPlayer(TRACK);
    p.loop = true;
    player.current = p;
    return () => { try { p.remove(); } catch { /* already gone */ } };
  }, []);
  useFocusEffect(
    useCallback(() => () => {
      try { player.current?.pause(); } catch { /* ignore */ }
      setPlaying(false);
    }, []),
  );

  const toggle = () => {
    const p = player.current;
    if (!p) return;
    try {
      if (playing) { p.pause(); setPlaying(false); }
      else { p.play(); setPlaying(true); }
    } catch { /* audio hiccup — leave the button as it was */ }
  };

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      void api.night(offset).then((r) => { if (alive) setRadio(r); }).catch(() => {});
      return () => { alive = false; };
    }, [offset]),
  );

  const story = radio?.story;
  const follow = () => {
    if (!story) return;
    router.push({
      pathname: '/pronunciation/[sentenceKey]',
      params: { sentenceKey: story.keyLine.slice(0, 40), referenceText: story.keyLine, origin: 'night' },
    });
  };

  return (
    <NbSheet dark>
      <Stack.Screen options={{ headerShown: false }} />
      {STARS.map(([fx, top], i) => (
        <View key={i} style={{ position: 'absolute', left: `${fx * 100}%`, top, width: 3, height: 3, borderRadius: 2, backgroundColor: '#F5ECC8', opacity: 0.7 }} />
      ))}

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingTop: TOP_INSET, paddingHorizontal: 20, paddingBottom: 2 }}>
        <Pressable onPress={() => router.back()}>
          <NbPaper rot={-1} style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}>
            <NbIcon name="chevronLeft" size={16} />
          </NbPaper>
        </Pressable>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={nbText.hand(21, nb.cream)}>{t('night.title')}</Text>
          <Text numberOfLines={1} style={nbText.body(10, 'rgba(243,230,200,.65)')}>{t('night.sub')}</Text>
        </View>
        <NbTag color="#D4B46A" rot={2}>{t('night.onair')}</NbTag>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 40 }}>
        {/* 라디오 */}
        <NbPaper rot={-0.5} tape tapeLeft={140} style={{ padding: 15, backgroundColor: nb.paper }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={{ width: 58, height: 40, backgroundColor: '#E3AEB4', borderWidth: 2, borderColor: nb.ink, borderRadius: 7, alignItems: 'center', justifyContent: 'center' }}>
              <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: '#FFFdf4', borderWidth: 2, borderColor: nb.ink, alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: '#E9C45A' }} />
              </View>
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={nbText.mono(10, nb.ink)}>{t('night.freq')}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 2.5, height: 14, marginTop: 6 }}>
                {[0, 1, 2, 3, 4].map((i) => <EqBar key={i} i={i} on={playing} />)}
              </View>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12 }}>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text numberOfLines={1} style={nbText.hand(15)}>{t('night.trackTitle')}</Text>
              <Text numberOfLines={1} style={nbText.body(9.5, nb.soft)}>{t('night.trackSub')}</Text>
            </View>
            {open
              ? <NbButton variant="ink" size="sm" icon="speaker" onPress={toggle}>{playing ? t('night.pause') : t('night.play')}</NbButton>
              : <NbTag color={nb.soft} rot={1}>{t('night.closedShort')}</NbTag>}
          </View>
        </NbPaper>

        {/* 오늘 밤의 이야기 */}
        {story ? (
          <NbPaper rot={0.4} style={{ marginTop: 14, padding: 15, backgroundColor: nb.paper }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <NbTag color={nb.blue} rot={-2}>{t('night.storyTag')}</NbTag>
              <Text style={nbText.body(9.5, nb.soft)}>{t('night.storyMeta')}</Text>
            </View>
            <Text style={[nbText.hand(19), { marginTop: 9 }]}>{story.title}</Text>
            <Text style={[nbText.body(13), { marginTop: 7 }]}>{story.body}</Text>
            {/* 핵심 문장 — 형광펜 */}
            <View style={{ marginTop: 10, paddingVertical: 7, paddingHorizontal: 10, backgroundColor: 'rgba(249,227,123,.5)', borderWidth: 1.3, borderStyle: 'dashed', borderColor: nb.blue }}>
              <Text style={[nbText.body(13), { fontWeight: '700' }]}>{story.keyLine}</Text>
              {!!story.keyGloss && <Text style={[nbText.body(10.5, nb.soft), { marginTop: 3 }]}>{story.keyGloss}</Text>}
            </View>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
              <View style={{ flex: 1 }}>
                <NbButton variant="yellow" size="md" full icon="mic" onPress={follow}>{t('night.follow')}</NbButton>
              </View>
              <NbButton variant="paper" size="md" onPress={() => setOffset((n) => n + 1)}>{t('night.next')}</NbButton>
            </View>
          </NbPaper>
        ) : (
          <NbMemo rot={0.3} style={{ marginTop: 14 }}>{t('night.empty')}</NbMemo>
        )}

        <NbMemo color="#D4B46A" rot={-0.3} style={{ marginTop: 13 }}>{t('night.bonus')}</NbMemo>
      </ScrollView>
    </NbSheet>
  );
}
