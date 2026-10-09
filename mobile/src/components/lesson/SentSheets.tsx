// STEP 2 문장장 화면 — 정본(R1) design-handoff_v46/reference/forin-notebook-lesson-sent-live.jsx (SL) L149-263.
//
//   SL:186-198 머리 — "‹ 나가기" · 태그 "STEP 2 · 문장" + MONO n / N · 장마다 진행 칸(지난 장 잉크, 헷갈린 장 빨강,
//              background .3s) · 제목 "{상황} — 뜻을 보고 [문장을 만들어]보세요"
//   SL:200-231 낱장 묶음(SheetStack) — 현재 장 · 아래 다음 장 · 뜯김 · DONE 장
//   SL:170-176 확인 — 맞으면 바로 맞힘, 틀리면 흔들림(nb-shake) + 헷갈림
//   SL:177-181 판정 — 아직 헷갈려요(왼쪽 뜯김) / 외웠어요·이제 알겠어요(오른쪽 뜯김), 620ms 뒤 다음 장
//   SL:233-260 아래 — 확인하기/판정 버튼(핸드오프 bottom 98 → 34, 사용자 결정) · 다음 화면 버튼(bottom 34). 핸드오프는 이 버튼을 진행 중에도
//              점선 .5로 늘 보이지만, 눌러도 아무 일이 없어서 DONE 장에서만 잉크로 보인다(T8 사용자 결정 — §7).
//
// 헷갈림(빨강 칸 · "틀림 → 노트")은 틀린 장과 '아직 헷갈려요'를 누른 장이다. 노트에 남기는 것은 단어장과
// 같은 규칙으로 '아직 헷갈려요'를 누른 문장(R5) — 화면이 onConfused로 서버에 보낸다.
import { useRef, useState } from 'react';
import { View } from 'react-native';
import * as Speech from 'expo-speech';
import { NbButton } from '@/components/nb/NbUI';
import { LessonSheet, SheetStack, type SheetMode, type SheetStackHandle } from '@/components/lesson/SheetStack';
import { JudgeButtons, REPLAYS, SentDoneSheet, SentReveal, SentSheetBody, type Voice } from '@/components/lesson/SentPrompt';
import { BAR_TODO, HeadCount, Step2Bar, Step2Head, Step2Title, frameTop } from '@/components/lesson/SentParts';
import { hasSheetAnswer, isSheetRight, sheetLine, type SheetAnswer, type SheetCard } from '@/data/sentenceDrill';
import { useT } from '@/i18n';
import { nb } from '@/theme/nb';

const say = (en: string) => Speech.speak(en, { language: 'en-US', rate: 0.9 });
// 핸드오프는 확인/판정 버튼을 bottom 98에, 다음 화면 버튼을 34에 둔다. 다음 화면 버튼은 DONE 장에서만 보이므로(T8 결정)
// 진행 중에는 98 아래가 비었다 — 사용자 결정(2026-10-09)으로 확인/판정 버튼을 맨 아래(34)로 내리고, 묶음 아래 끝도
// 같이 내린다(핸드오프 182 = 98 + 버튼 52 + 32 → 34 + 52 + 32 = 118).
const ACTIONS_BOTTOM = 34;

export function SentSheets({ sheets, name, fallbackIcon, onConfused, onRepeat, onDone, onExit }: {
  sheets: SheetCard[];
  /** The situation's short name — the title, and the tag fallback (R3). */
  name: string;
  /** R3: the department's icon, for a sheet without its own. */
  fallbackIcon: string;
  onConfused: (card: SheetCard) => void;
  onRepeat: (line: string) => void;
  onDone: () => void;
  onExit: () => void;
}) {
  const t = useT();
  const N = sheets.length;
  const stack = useRef<SheetStackHandle>(null);
  const [i, setI] = useState(0);
  const [answer, setAnswer] = useState<SheetAnswer | null>(null);
  const [result, setResult] = useState<'right' | 'wrong' | null>(null);
  const [plays, setPlays] = useState(0);
  const [voice, setVoice] = useState<Voice>({ speaking: false, beat: 0 });
  const [fuzzy, setFuzzy] = useState<number[]>([]);
  const [known, setKnown] = useState<number[]>([]);
  const done = i >= N;
  const card = sheets[i];

  const check = () => {
    if (!card || result || !hasSheetAnswer(card, answer)) return;
    if (isSheetRight(card, answer)) {
      setResult('right');
      setKnown((k) => [...k, i]);
    } else {
      setResult('wrong');
      setFuzzy((f) => [...f, i]);
      stack.current?.shake();
    }
  };
  const judge = (dir: 'left' | 'right') => {
    if (!card || !result || stack.current?.isTearing()) return;
    if (dir === 'left') {
      setKnown((k) => k.filter((x) => x !== i));
      setFuzzy((f) => (f.includes(i) ? f : [...f, i]));
      onConfused(card);
    }
    stack.current?.tear(dir);
  };
  const advance = () => {
    setI((n) => n + 1);
    setAnswer(null);
    setResult(null);
    setPlays(0);
    Speech.stop();
    setVoice({ speaking: false, beat: 0 });
  };
  const play = (c: SheetCard) => {
    if (plays > REPLAYS) return;
    setPlays((p) => p + 1);
    const quiet = () => setVoice((v) => ({ ...v, speaking: false }));
    Speech.speak(sheetLine(c), {
      language: 'en-US', rate: 0.9,
      onStart: () => setVoice((v) => ({ speaking: true, beat: v.beat + 1 })),
      onBoundary: () => setVoice((v) => ({ speaking: true, beat: v.beat + 1 })),
      onDone: quiet, onStopped: quiet, onError: quiet,
    });
  };

  const renderSheet = (k: number, mode: SheetMode) => {
    const c = sheets[k];
    if (!c) return null;
    const live = mode !== 'next';
    const r = live ? result : null;
    const typeName = t(`sent.type.${c.kind === 'order' ? 'order' : c.type}`);
    const tag = c.kind === 'order' ? c.order.tag : c.sentence.tag;
    const icon = (c.kind === 'order' ? c.order.icon : c.sentence.icon) || fallbackIcon;
    return (
      <LessonSheet testID={`sent-sheet-${k}-${mode}`} dim={mode === 'next'} tag={tag || name}
        typeLabel={r ? t('sent.explained', { type: typeName }) : typeName} n={k + 1} total={N}>
        <SentSheetBody card={c} icon={icon} answer={live ? answer : null} onAnswer={setAnswer} result={r}
          plays={live ? plays : 0} onPlay={() => play(c)} interactive={mode === 'current'}
          voice={mode === 'current' ? voice : undefined} />
        {!!r && <SentReveal card={c} result={r} onSay={() => say(sheetLine(c))} onRepeat={() => onRepeat(sheetLine(c))} />}
      </LessonSheet>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ paddingTop: 6, paddingHorizontal: 24 }}>
        <Step2Head tag={t('sent.title')} right={<HeadCount n={Math.min(i + 1, N)} total={N} />} onExit={onExit} exitLabel={t('sent.exit')} />
        <Step2Bar colors={sheets.map((_, k) => (k < i ? (fuzzy.includes(k) ? nb.red : nb.ink) : BAR_TODO))} />
        <Step2Title text={t('sent.sheetTitle', { name })} />
      </View>

      <SheetStack ref={stack} index={i} total={N} done={done} top={frameTop(172)} bottom={ACTIONS_BOTTOM + 84}
        renderSheet={renderSheet} onAdvance={advance}
        renderDone={() => <SentDoneSheet known={known.length} fuzzy={fuzzy.length} />} />

      <View testID="sent-actions" style={{ position: 'absolute', left: 24, right: 24, bottom: ACTIONS_BOTTOM }}>
        {!done && !result && (
          <View testID="sent-check" style={{ opacity: card && hasSheetAnswer(card, answer) ? 1 : 0.4 }}>
            <NbButton variant="ink" size="lg" full icon="pencil" iconColor={nb.paper} onPress={check}>{t('recall.check')}</NbButton>
          </View>
        )}
        {!done && !!result && <JudgeButtons result={result} onFuzzy={() => judge('left')} onKnown={() => judge('right')} />}
      </View>
      {done && (
        <View testID="sent-sheets-next" style={{ position: 'absolute', left: 24, right: 24, bottom: 34 }}>
          <NbButton variant="ink" size="lg" full icon="speech" iconRight="chevronRight" iconColor={nb.paper} onPress={onDone}>
            {t('sent.next')}
          </NbButton>
        </View>
      )}
    </View>
  );
}
