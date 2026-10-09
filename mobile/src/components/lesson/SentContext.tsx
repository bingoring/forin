// C5 같은 뜻, 다른 장면 — 정본(R1) design-handoff_v46/reference/forin-notebook-lesson-nuance.jsx (NU) L124-169.
//
//   NU:139-140 머리 — 태그 "STEP 2 · 문장 k/K" + "같은 뜻, 다른 장면", 칸(지난 잉크 · 지금 앰버),
//              제목 "{word(MONO)}가 [어색한 장면]은 어디일까요?"
//   NU:142     메모(파랑 -0.3°) "뜻은 셋 다 “악화되다” — 듣는 사람이 달라요"
//   NU:148-156 장면 카드 — NbPaper ±0.5°, 아이콘 타일 42, 누가(hand 13.5 soft), 문장(14/600).
//              고르면 잉크 2 링, 확인 뒤 정답 장면 초록 2.5 링·빨강 2 취소선·→ 고친 문장(형광펜, nb-reveal)·도장,
//              틀리게 고른 장면 빨강 2 링
//   NU:160     뉘앙스 메모(nb-reveal)
//   NU:162-165 확인하기 → [고친 문장 따라 말하기][다음 ›]
//
// R3: context `word`/`ko`가 없으면 제목의 단어 자리와 메모를 그리지 않는다.
// "k/K"는 이 상황의 C5·C6 화면 수 중 몇 번째인지다(핸드오프의 "2/5"는 v45 순번 — 감사 §1-2, 편차 로그).
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { NbInline } from '@/components/nb/NbInline';
import { NbButton, NbMemo, NbPaper, nbText } from '@/components/nb/NbUI';
import { NbEnter } from '@/components/nb/nbMotion';
import {
  BAR_TODO, HandArrow, HeadSub, IconTile, NuanceMemo, Step2Bar, Step2Head, Step2Stamp, Step2Title, countWord, frameTop,
} from '@/components/lesson/SentParts';
import { contextAnswer, subjectBatchim } from '@/data/sentenceDrill';
import type { LessonNuance } from '@/api/client';
import { useT } from '@/i18n';
import { usePronunciationEnabled } from '@/data/pronunciationFlag';
import { nb, nbFonts } from '@/theme/nb';

/** NU:140 · NU:186 — k slots before this one ink, this one amber. */
export const drillBar = (k: number, total: number) => Array.from({ length: total }, (_, j) => (j < k ? nb.ink : j === k ? nb.amber : BAR_TODO));

export function SentContext({ item, k, total, onRepeat, onNext, onExit }: {
  item: LessonNuance; k: number; total: number;
  onRepeat: (line: string) => void; onNext: () => void; onExit: () => void;
}) {
  const t = useT();
  const pronOn = usePronunciationEnabled();
  const scenes = item.scenes ?? [];
  const wrongAt = contextAnswer(item);
  const [pick, setPick] = useState<number | null>(null);
  const [res, setRes] = useState<'right' | 'wrong' | null>(null);
  const check = () => { if (pick != null && !res) setRes(pick === wrongAt ? 'right' : 'wrong'); };
  const fix = scenes[wrongAt]?.fix ?? '';
  const titleKey = item.word ? (subjectBatchim(item.word) ? 'sent.ctxTitle.c' : 'sent.ctxTitle.v') : 'sent.ctxTitleBare';
  return (
    <View style={{ flex: 1 }}>
      <View style={{ paddingTop: 6, paddingHorizontal: 24 }}>
        <Step2Head tag={t('sent.tagDrill', { k: k + 1, n: total })} right={<HeadSub>{t('sent.ctxSub')}</HeadSub>} onExit={onExit} exitLabel={t('sent.exit')} />
        <Step2Bar colors={drillBar(k, total)} animate={false} />
        <Step2Title text={t(titleKey, item.word ? { word: '\u0001' } : undefined)} word={item.word} />
      </View>

      <View style={{ position: 'absolute', left: 24, right: 24, top: frameTop(176) }}>
        {!!item.word && !!item.ko && (
          <View testID="sent-ctx-memo">
            {/* ui.jsx L99: hand 14, line 1.45 (NbMemo's own string style is 13.5) */}
            <NbMemo rot={-0.3} color={nb.blue}>
              <Text style={[nbText.hand(14), { lineHeight: 20.3 }]}>{t('sent.ctxMemo', { n: countWord(t, 'noun', scenes.length), ko: item.ko })}</Text>
            </NbMemo>
          </View>
        )}
        {scenes.map((s, i) => {
          const on = pick === i;
          const isAns = i === wrongAt;
          const ok = !!res && isAns;
          const bad = !!res && on && !isAns;
          // NU:148 `box-shadow: 0 0 0 Npx color` — a ring outside the card, drawn as a border box around it.
          const ring = ok ? { w: 2.5, c: nb.green } : bad ? { w: 2, c: nb.red } : on ? { w: 2, c: nb.ink } : null;
          return (
            <Pressable key={i} testID={`sent-scene-${i}`} disabled={!!res} onPress={() => setPick(i)}
              accessibilityRole="button" accessibilityState={{ selected: on }} style={{ marginTop: 11 }}>
              <NbPaper rot={i % 2 ? 0.5 : -0.5} style={{ paddingVertical: 11, paddingHorizontal: 12, flexDirection: 'row', gap: 11, alignItems: 'flex-start' }}>
                {!!ring && (
                  <View testID="sent-scene-ring" pointerEvents="none" style={{
                    position: 'absolute', left: -1 - ring.w, right: -1 - ring.w, top: -1 - ring.w, bottom: -1 - ring.w,
                    borderWidth: ring.w, borderColor: ring.c,
                  }} />
                )}
                <IconTile icon={s.icon || 'speech'} size={42} iconSize={24} color={nb.blue} wash={`${nb.blue}18`} rot={i % 2 ? 2 : -2} />
                <View style={{ minWidth: 0, flex: 1 }}>
                  <Text style={nbText.hand(13.5, nb.soft)}>{s.who}</Text>
                  <NbInline style={{ marginTop: 2 }} textStyle={{ fontFamily: nbFonts.bodyMid, fontSize: 14, lineHeight: 21, color: ok ? nb.soft : nb.ink }}
                    parts={[{ text: s.en, strike: ok ? { color: nb.red, width: 2 } : undefined }]} />
                  {ok && !!fix && (
                    <NbEnter kind="reveal" testID="sent-ctx-fix" style={{ marginTop: 6 }}>
                      <NbInline textStyle={{ fontFamily: nbFonts.bodyBold, fontSize: 13.5, lineHeight: 20.25, color: nb.ink }}
                        parts={[{ node: <View style={{ marginRight: 4 }}><HandArrow /></View>, key: 'arrow' }, { text: fix, mark: true }]} />
                    </NbEnter>
                  )}
                </View>
                {!!res && isAns && <Step2Stamp ok={res === 'right'} good={t('recall.good')} retry={t('recall.retry')} />}
              </NbPaper>
            </Pressable>
          );
        })}
        {!!res && !!item.why && (
          <NbEnter kind="reveal" style={{ marginTop: 12 }}>
            <NuanceMemo testID="sent-ctx-why" head={t('sent.feelNote')}>{item.why}</NuanceMemo>
          </NbEnter>
        )}
      </View>

      <View style={{ position: 'absolute', left: 24, right: 24, bottom: 34 }}>
        {!res ? (
          <View testID="sent-check" style={{ opacity: pick == null ? 0.4 : 1 }}>
            <NbButton variant="ink" size="lg" full icon="pencil" iconColor={nb.paper} onPress={check}>{t('recall.check')}</NbButton>
          </View>
        ) : (
          <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'flex-end' }}>
            {pronOn && (
              <View testID="sent-drill-repeat" style={{ flex: 1 }}>
                <NbButton variant="paper" size="lg" full icon="mic" onPress={() => fix && onRepeat(fix)}>{t('sent.ctxRepeat')}</NbButton>
              </View>
            )}
            <View testID="sent-drill-next">
              <NbButton variant="ink" size="lg" icon="speech" iconRight="chevronRight" iconColor={nb.paper} onPress={onNext}>{t('sent.next')}</NbButton>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
