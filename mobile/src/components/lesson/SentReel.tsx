// C0 문장 릴 — 정본(R1) design-handoff_v46/reference/forin-notebook-lesson-nuance.jsx (NU) L53-122.
//
//   NU:73-74   머리 — 태그 "STEP 2 · 워밍업" + "30초", 장면 수만큼 파란 진행 칸, 제목 "외우지 말고 [다섯 장면]에서 …"
//   NU:75-81   본문(top 176) — MONO 24 단어 + 스피커 16(baseline) · MONO 11 n / N
//   NU:82-99   카드 영역 높이 300 — 뒷카드 두 장(2° · -1.2°, 남은 장면 수만큼), 장면 카드(테이프 130, minHeight 240,
//              보호자용 장면은 앰버 점선), 탭 → nb-swipe-out 380ms → 다음 장면 nb-swipe-in
//   NU:100-114 장면을 다 넘기면 감상 카드(swipe-in) — 칩은 다시 고를 수 있고, 고르면 뉘앙스 메모가 펼쳐진다(nb-reveal)
//   NU:117-119 CTA "STEP 2 · 문장 학습 시작 ›" — 감상 전 점선 .5, 감상 뒤 잉크
//
// 감상 저장(스펙 2-9 §11-8)은 v45 그대로: 처음 고른 칩 하나를 노트에 남기고(서버도 단어당 한 장),
// 화면의 선택은 핸드오프처럼 바꿀 수 있다.
import { useEffect, useState } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import * as Speech from 'expo-speech';
import { NbIcon } from '@/components/nb/NbIcon';
import { NbInline, type InlinePart } from '@/components/nb/NbInline';
import { NbButton, NbPaper, NbTag, nbText } from '@/components/nb/NbUI';
import { NbEnter, useNbSwipeOut } from '@/components/nb/nbMotion';
import { BAR_TODO, HeadSub, countWord, NuanceMemo, Step2Bar, Step2Head, Step2Title, frameTop } from '@/components/lesson/SentParts';
import type { LessonNuance, LessonNuanceScene } from '@/api/client';
import { useT } from '@/i18n';
import { nb, nbFonts } from '@/theme/nb';

const say = (en: string) => Speech.speak(en, { language: 'en-US', rate: 0.9 });
const escapeRe = (x: string) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** NU:71 — the word (and its inflections) marked in the scene line. */
export function reelParts(en: string, word: string): InlinePart[] {
  if (!word) return [{ text: en }];
  return en.split(new RegExp(`(${escapeRe(word)}\\w*)`, 'i')).filter(Boolean).map((p) => ({ text: p, mark: new RegExp(`^${escapeRe(word)}`, 'i').test(p) }));
}

export function SentReel({ item, feel, feelSave, onFeel, onStart, onExit }: {
  item: LessonNuance;
  feel: string | null;
  feelSave: 'idle' | 'saved' | 'failed';
  onFeel: (f: string) => void;
  onStart: () => void;
  onExit: () => void;
}) {
  const t = useT();
  const scenes = item.scenes ?? [];
  const word = item.word ?? '';
  const feels = item.feels ?? [];
  const n = scenes.length;
  const [i, setI] = useState(0);
  const [out, setOut] = useState(false);
  const done = i >= n;
  // R3: a reel without 감상 chips (older content) ends on its last scene.
  const last = feels.length === 0 && i === n - 1;
  const ready = feels.length > 0 ? done && feel != null : i >= n - 1;
  const next = () => {
    if (out || done || last) return;
    setOut(true);
  };
  const s = scenes[i];
  return (
    <View style={{ flex: 1 }}>
      <View style={{ paddingTop: 6, paddingHorizontal: 24 }}>
        <Step2Head tag={t('sent.tagReel')} right={<HeadSub>{t('sent.reelSub')}</HeadSub>} onExit={onExit} exitLabel={t('sent.exit')} />
        <Step2Bar colors={scenes.map((_, k) => (k < i ? nb.blue : BAR_TODO))} />
        <Step2Title text={t('sent.reelTitle', { n: countWord(t, 'counter', n) })} />
      </View>

      <View style={{ position: 'absolute', left: 24, right: 24, top: frameTop(176) }}>
        {/* NU:76 `align-items: baseline` — the speaker (no text) sits on the word's baseline by its bottom edge. */}
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
          <Text style={{ fontFamily: nbFonts.monoBold, fontSize: 24, color: nb.ink }}>{word}</Text>
          <Pressable testID="sent-reel-say" onPress={() => say(word)} hitSlop={8}><NbIcon name="speaker" size={16} /></Pressable>
          <View style={{ flex: 1 }} />
          <Text testID="sent-reel-count" style={nbText.monoBold(11, nb.soft)}>{`${Math.min(i + 1, n)} / ${n}`}</Text>
        </View>
        <View style={{ position: 'relative', height: 300, marginTop: 14 }}>
          {!done && i + 2 < n && <BackCard testID="sent-reel-back2" inset={8} rot={2} bg="#F7F1E1" />}
          {!done && i + 1 < n && <BackCard testID="sent-reel-back1" inset={4} rot={-1.2} bg="#FBF6E8" />}
          {!done && !!s && (
            <SceneCard key={i} scene={s} word={word} out={out} showNext={!last}
              nextLabel={t('sent.reelNext')} onPress={next}
              onOut={() => { setOut(false); setI((k) => k + 1); }} />
          )}
          {done && feels.length > 0 && (
            <NbEnter kind="swipeIn" testID="sent-feel-card">
              <NbPaper rot={-0.5} style={{ paddingTop: 16, paddingHorizontal: 16, paddingBottom: 14 }}>
                <FeelAsk text={t('sent.feelAsk', { n: countWord(t, 'counter', n), word: '\u0001' })} word={word} />
                <Text style={[nbText.body(11, nb.soft), { marginTop: 3 }]}>{t('sent.feelHint')}</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
                  {feels.map((f, k) => {
                    const on = feel === f;
                    return (
                      <Pressable key={f} testID={`sent-feel-${k}`} onPress={() => onFeel(f)} accessibilityRole="button" accessibilityState={{ selected: on }}
                        style={{
                          paddingHorizontal: 12, paddingVertical: 7, borderWidth: 1.6, borderColor: on ? nb.ink : 'rgba(62,54,43,.35)',
                          backgroundColor: on ? nb.ink : nb.paper, transform: [{ rotate: `${k % 2 ? 0.8 : -0.8}deg` }],
                        }}>
                        <Text numberOfLines={1} style={nbText.hand(14.5, on ? nb.paper : nb.ink)}>{f}</Text>
                      </Pressable>
                    );
                  })}
                </View>
                {feel != null && (
                  <NbEnter kind="reveal" style={{ marginTop: 12 }}>
                    <NuanceMemo testID="sent-feel-note" head={t('sent.feelNote')}>
                      {item.why ? `${item.why} ` : ''}
                      {feelSave === 'failed'
                        ? <Text testID="sent-feel-failed" style={{ color: nb.red }}>{t('sent.feelFailed')}</Text>
                        : feelSave === 'saved' ? <Text testID="sent-feel-saved">{t('sent.feelSaved')} </Text> : null}
                      {feelSave === 'saved' && <NbIcon name="pencil" size={13} />}
                    </NuanceMemo>
                  </NbEnter>
                )}
              </NbPaper>
            </NbEnter>
          )}
        </View>
      </View>

      <View testID="sent-start" style={{ position: 'absolute', left: 24, right: 24, bottom: 34, opacity: ready ? 1 : 0.5 }}>
        <NbButton variant={ready ? 'ink' : 'dashed'} size="lg" full icon="speech" iconRight="chevronRight" iconColor={ready ? nb.paper : undefined}
          onPress={() => ready && onStart()}>
          {t('sent.startSheets')}
        </NbButton>
      </View>
    </View>
  );
}

function FeelAsk({ text, word }: { text: string; word: string }) {
  const [a, b = ''] = text.split('\u0001');
  return (
    <Text style={nbText.hand(18)}>
      {a}<Text style={{ fontFamily: nbFonts.monoBold }}>{word}</Text>{b}
    </Text>
  );
}

/** NU:84-85 — the cards still to come, peeking out behind. */
function BackCard({ inset, rot, bg, testID }: { inset: number; rot: number; bg: string; testID: string }) {
  return (
    <View testID={testID} pointerEvents="none" style={{
      position: 'absolute', top: 0, left: inset, right: -inset, height: 240, backgroundColor: bg,
      borderWidth: 1, borderColor: '#E0D6C0', transform: [{ rotate: `${rot}deg` }],
    }} />
  );
}

/** NU:86-98 — one scene: in with nb-swipe-in on mount (key = i), out with nb-swipe-out when `out`. */
function SceneCard({ scene, word, out, showNext, nextLabel, onPress, onOut }: {
  scene: LessonNuanceScene; word: string; out: boolean; showNext: boolean; nextLabel: string;
  onPress: () => void; onOut: () => void;
}) {
  const swipe = useNbSwipeOut();
  useEffect(() => {
    if (out) swipe.swipe(onOut);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [out]);
  const tone = scene.swap ? nb.amber : nb.blue;
  return (
    <Animated.View onLayout={swipe.onLayout} pointerEvents={out ? 'none' : 'auto'} style={[{ position: 'absolute', left: 0, right: 0, top: 0 }, swipe.style]}>
      <NbEnter kind="swipeIn">
        <Pressable testID="sent-reel-card" onPress={onPress}>
          <NbPaper rot={0} tape tapeLeft={130} style={[
            { paddingTop: 18, paddingHorizontal: 16, paddingBottom: 16, minHeight: 240 },
            scene.swap ? { borderWidth: 1.5, borderStyle: 'dashed', borderColor: nb.amber } : null,
          ]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <NbTag color={tone} rot={-1}>{scene.who}</NbTag>
              <View style={{ flex: 1 }} />
              {!!scene.tone && (
                <View style={{ borderWidth: 1.3, borderColor: 'rgba(62,54,43,.3)', borderRadius: 2, paddingHorizontal: 6 }}>
                  <Text numberOfLines={1} style={nbText.hand(12.5, nb.soft)}>{scene.tone}</Text>
                </View>
              )}
            </View>
            <NbInline testID="sent-reel-line" style={{ marginTop: 16 }}
              textStyle={{ fontFamily: nbFonts.bodyMid, fontSize: 17, color: nb.ink, lineHeight: 27.2 }}
              parts={reelParts(scene.en, word)} />
            {!!scene.ko && <Text style={[nbText.hand(14.5, nb.soft), { marginTop: 10, lineHeight: 20.3 }]}>{scene.ko}</Text>}
            {showNext && <Text testID="sent-reel-next" style={[nbText.hand(12.5, nb.soft), { position: 'absolute', right: 14, bottom: 12 }]}>{nextLabel}</Text>}
          </NbPaper>
        </Pressable>
      </NbEnter>
    </Animated.View>
  );
}
