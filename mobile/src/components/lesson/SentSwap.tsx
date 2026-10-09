// C6 한 단어 바꾸기 — 정본(R1) design-handoff_v46/reference/forin-notebook-lesson-nuance.jsx (NU) L171-234.
//
//   NU:185-186 머리 — 태그 "STEP 2 · 문장 k/K" + "한 단어 바꾸기", 칸(지난 잉크 · 지금 앰버),
//              제목 "밑줄 친 말을 [더 어울리는 말]로 바꿔요"
//   NU:188-202 카드 — NbPaper -0.5° 테이프 130: 앰버 타일 40 + 앰버 태그(누가) · 문장 19/600 줄 1.7 ·
//              대상 낱말에 빨강 2.5 밑줄(offset 5) → 확인 뒤 취소선 + soft · 고른 말이 그 위(-26)에
//              손글씨 17로 얹힘(-3°, 파랑 → 결과색, 종이 바탕, 아래 1.5 같은 색 줄, nb-reveal) ·
//              한국어 줄 "{ko} — 라고 전해야 해요"
//   NU:203-209 "바꿀 말 — 하나만 골라 위에 얹어요" · 후보 칩(MONO 13.5, ±1°, 고르면 노랑 .5, 결과색, 하드 그림자)
//   NU:210-224 확인 뒤(nb-reveal) — 후보마다 온도 해설(MONO 11.5 폭 84 + hand 13) · 도장 · 뉘앙스 메모
//   NU:227-231 확인하기 → [바꾼 문장 따라 말하기][다음 ›]
//
// R3: swap `ko`가 없으면 한국어 줄을 그리지 않는다. 확인 전에는 다른 후보로 바꿀 수 있다(핸드오프와 같음).
import { useRef, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { NbInline } from '@/components/nb/NbInline';
import { NbButton, NbPaper, NbTag, nbText } from '@/components/nb/NbUI';
import { NbEnter } from '@/components/nb/nbMotion';
import {
  BAD_BG, ChipShadow, HeadSub, IconTile, NuanceMemo, OK_BG, Step2Bar, Step2Head, Step2Stamp, Step2Title, frameTop,
} from '@/components/lesson/SentParts';
import { drillBar } from '@/components/lesson/SentContext';
import type { LessonNuance } from '@/api/client';
import { useT } from '@/i18n';
import { usePronunciationEnabled } from '@/data/pronunciationFlag';
import { nb, nbFonts } from '@/theme/nb';

const LINE = 32.3; // 19 × 1.7
// 바꿀 말이 둘째 줄 이후에 있으면 위(-26)에 얹은 고른 말이 윗줄 글자를 덮는다(핸드오프 예시는 한 줄이라 드러나지 않음).
// 그 줄만 이만큼 띄워 고른 말이 들어갈 틈을 만든다 — 사용자 결정(T8, §7).
const ROOM = 22;

export function SentSwap({ item, k, total, onRepeat, onNext, onExit }: {
  item: LessonNuance; k: number; total: number;
  onRepeat: (line: string) => void; onNext: () => void; onExit: () => void;
}) {
  const t = useT();
  const pronOn = usePronunciationEnabled();
  const [before, target, after] = item.before ?? ['', '', ''];
  const options = item.options ?? [];
  const [pick, setPick] = useState<string | null>(null);
  const [res, setRes] = useState<'right' | 'wrong' | null>(null);
  const check = () => { if (pick && !res) setRes(pick === item.answer ? 'right' : 'wrong'); };
  const swapped = `${before}${item.answer ?? ''}${after}`;
  const overColor = res ? (res === 'right' ? nb.green : nb.red) : nb.blue;
  const [below, setBelow] = useState(false);
  const room = below && pick ? ROOM : 0; // 고르기 전에는 핸드오프 줄 간격 그대로
  const [barH, setBarH] = useState(52);
  const scroll = useRef<ScrollView>(null);

  // The target word, inline-block: its red underline (struck once checked) and the pick written above it.
  const targetNode = (
    <View testID="sent-swap-target" style={{ height: LINE + room, paddingTop: room, justifyContent: 'flex-start' }}>
      <Text style={{ fontFamily: nbFonts.bodyMid, fontSize: 19, lineHeight: LINE, color: res ? nb.soft : nb.ink }}>{target}</Text>
      {/* NU:196 — CSS underline 2.5 at offset 5 below the baseline; line-through at mid x-height. Drawn: iOS
          alone honours textDecorationColor, and neither platform the thickness or offset. */}
      <View testID={res ? 'sent-swap-strike' : 'sent-swap-underline'} pointerEvents="none" style={{
        position: 'absolute', left: 0, right: 0, height: 2.5, backgroundColor: nb.red, top: room + (res ? 16.5 : 27.6),
      }} />
      {!!pick && (
        <NbEnter kind="reveal" testID="sent-swap-over" pointerEvents="none"
          style={{ position: 'absolute', top: room - 26, left: -200, right: -200, alignItems: 'center' }}>
          <View style={{ transform: [{ rotate: '-3deg' }], backgroundColor: nb.paper, paddingHorizontal: 4, borderBottomWidth: 1.5, borderColor: overColor }}>
            <Text numberOfLines={1} style={nbText.hand(17, overColor)}>{pick}</Text>
          </View>
        </NbEnter>
      )}
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={{ paddingTop: 6, paddingHorizontal: 24 }}>
        <Step2Head tag={t('sent.tagDrill', { k: k + 1, n: total })} right={<HeadSub>{t('sent.swapSub')}</HeadSub>} onExit={onExit} exitLabel={t('sent.exit')} />
        <Step2Bar colors={drillBar(k, total)} animate={false} />
        <Step2Title text={t('sent.swapTitle')} />
      </View>

      {/* 본문은 버튼 위까지 스크롤된다 — 실제 문장은 후보·해설이 길어 판정 뒤 버튼 밑으로 넘친다. 사용자 결정(T8, §7).
          테이프·기울기가 잘리지 않게 14만큼 위로 연다. */}
      <ScrollView ref={scroll} testID="sent-swap-scroll" showsVerticalScrollIndicator={false}
        style={{ position: 'absolute', left: 0, right: 0, top: frameTop(176) - 14, bottom: 34 + barH + 10 }}
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 14, paddingBottom: 4 }}
        onContentSizeChange={() => { if (res) scroll.current?.scrollToEnd({ animated: true }); }}>
        <NbPaper rot={-0.5} tape tapeLeft={130} style={{ paddingTop: 16, paddingHorizontal: 16, paddingBottom: 14 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <IconTile icon={item.icon || 'me'} size={40} iconSize={22} color={nb.amber} wash={`${nb.amber}22`} />
            {!!item.who && <NbTag color={nb.amber} rot={-1}>{item.who}</NbTag>}
          </View>
          <NbInline testID="sent-swap-line" style={{ marginTop: 14 }}
            textStyle={{ fontFamily: nbFonts.bodyMid, fontSize: 19, lineHeight: LINE, color: nb.ink }}
            parts={[...(before ? [{ text: before }] : []),
              { node: targetNode, key: 'target', grow: true, onLayout: (e) => setBelow(e.nativeEvent.layout.y > 1) },
              ...(after ? [{ text: after }] : [])]} />
          {!!item.ko && <Text testID="sent-swap-ko" style={[nbText.hand(13.5, nb.soft), { marginTop: 8 }]}>{t('sent.swapKo', { ko: item.ko })}</Text>}
        </NbPaper>
        <Text style={[nbText.hand(14.5, nb.soft), { marginTop: 14 }]}>{t('sent.swapPick')}</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
          {options.map((o, i) => {
            const on = pick === o;
            const ok = !!res && o === item.answer;
            const bad = !!res && on && !ok;
            return (
              <Pressable key={o} testID={`sent-swap-opt-${i}`} disabled={!!res} onPress={() => setPick(o)}
                accessibilityRole="button" accessibilityState={{ selected: on }}
                style={{ transform: [{ rotate: `${i % 2 ? 1 : -1}deg` }] }}>
                {!on && <ChipShadow />}
                <View style={{
                  paddingVertical: 8, paddingHorizontal: 14, borderWidth: 1.6, borderColor: ok ? nb.green : bad ? nb.red : nb.ink,
                  backgroundColor: ok ? OK_BG : bad ? BAD_BG : on ? 'rgba(249,227,123,.5)' : nb.paper,
                }}>
                  <Text style={{ fontFamily: nbFonts.monoBold, fontSize: 13.5, color: nb.ink }}>{o}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>
        {!!res && (
          <NbEnter kind="reveal" testID="sent-swap-notes" style={{ marginTop: 14 }}>
            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
              <View style={{ flex: 1 }}>
                {options.map((o) => (
                  <View key={o} style={{ flexDirection: 'row', gap: 7, alignItems: 'baseline', marginTop: 4 }}>
                    <Text style={{ fontFamily: nbFonts.monoBold, fontSize: 11.5, color: o === item.answer ? nb.green : nb.soft, width: 84, flexShrink: 0 }}>{o}</Text>
                    <Text style={[nbText.hand(13), { lineHeight: 17.55, flex: 1 }]}>{item.notes?.[o] ?? ''}</Text>
                  </View>
                ))}
              </View>
              <Step2Stamp ok={res === 'right'} good={t('recall.good')} retry={t('recall.retry')} />
            </View>
            {!!item.why && <NuanceMemo testID="sent-swap-why" head={t('sent.feelNote')} style={{ marginTop: 10 }}>{item.why}</NuanceMemo>}
          </NbEnter>
        )}
      </ScrollView>

      <View onLayout={(e) => setBarH(e.nativeEvent.layout.height)} style={{ position: 'absolute', left: 24, right: 24, bottom: 34 }}>
        {!res ? (
          <View testID="sent-check" style={{ opacity: pick ? 1 : 0.4 }}>
            <NbButton variant="ink" size="lg" full icon="pencil" iconColor={nb.paper} onPress={check}>{t('recall.check')}</NbButton>
          </View>
        ) : (
          <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'flex-end' }}>
            {pronOn && (
              <View testID="sent-drill-repeat" style={{ flex: 1 }}>
                <NbButton variant="paper" size="lg" full icon="mic" onPress={() => onRepeat(swapped)}>{t('sent.swapRepeat')}</NbButton>
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
