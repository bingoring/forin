// sort quiz — categorize chips into labeled buckets. 1:1 with the v17 handoff
// SORT format: a pool of chips + N buckets. Tap a chip to select, tap a bucket
// to drop it; submit checks every chip landed in its correct bucket.
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { QuizDetail } from '@/api/client';
import { colors, fonts, fs } from '@/theme/tokens';
import { QuizShell, type QuizProgress, Shadowed, ContextBox, HintRow, ResultBanner, C } from '@/components/quiz/QuizShell';
import { PixelButton } from '@/components/PixelButton';
import { t } from '@/i18n';

export function SortQuiz({ quiz, onExit, onComplete, progress }: { quiz: QuizDetail; onExit: () => void; onComplete: () => void; progress?: QuizProgress }) {
  const c = quiz.content!;
  const pool = c.pool ?? [];
  const buckets = c.buckets ?? [];
  const [placed, setPlaced] = useState<Record<string, number>>({}); // chip -> bucket index
  const [sel, setSel] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  const unplaced = pool.filter((p) => !(p in placed));
  const full = unplaced.length === 0 && pool.length > 0;
  const correctOf = (chip: string) => buckets[placed[chip]]?.items.includes(chip);
  const allCorrect = checked && pool.every((p) => correctOf(p));

  const drop = (bi: number) => {
    if (checked || sel === null) return;
    setPlaced({ ...placed, [sel]: bi }); setSel(null);
  };
  const pull = (chip: string) => { if (checked) return; const p = { ...placed }; delete p[chip]; setPlaced(p); };

  return (
    <QuizShell
      title={quiz.title} sub={c.sub} zone={c.zone} onExit={onExit} progress={progress}
      footer={
        checked && allCorrect
          ? <View style={{ flex: 1 }}><PixelButton label={t('quiz.finish')} bg={colors.mint} shadowColor={colors.mintShadow} onPress={onComplete} full /></View>
          : checked
            ? <View style={{ flex: 1 }}><PixelButton label={t('quiz.retry')} bg="#fff" shadowColor={C} onPress={() => { setChecked(false); setPlaced({}); setSel(null); }} full /></View>
            : <View style={{ flex: 1 }}><PixelButton label={t('quiz.submitSort')} bg={colors.mint} shadowColor={colors.mintShadow} disabled={!full} onPress={() => setChecked(true)} full /></View>
      }
    >
      {!!c.context && <ContextBox text={c.context} />}

      {/* pool */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12, minHeight: 24 }}>
        {unplaced.map((p) => (
          <Shadowed key={p} offset={2} shadowColor={sel === p ? C : colors.yellowShadow}>
            <Pressable onPress={() => setSel(sel === p ? null : p)} style={{ backgroundColor: sel === p ? colors.mint : colors.yellow, borderWidth: 2.5, borderColor: C, paddingVertical: 6, paddingHorizontal: 10 }}>
              <Text style={{ fontFamily: fonts.heading, fontSize: fs(11.5), color: C }}>{p}</Text>
            </Pressable>
          </Shadowed>
        ))}
        {unplaced.length === 0 && <Text style={{ fontFamily: fonts.body, fontSize: fs(10), color: colors.textFaint }}>모든 물품을 분류했어요</Text>}
      </View>

      {/* buckets */}
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {buckets.map((b, bi) => (
          <Pressable key={bi} onPress={() => drop(bi)} style={{ flex: 1 }}>
            <Shadowed offset={3}>
              <View style={{ backgroundColor: '#fff', borderWidth: 3, borderColor: C }}>
                <View style={{ backgroundColor: b.color || colors.paper, borderBottomWidth: 2, borderColor: C, paddingVertical: 5, alignItems: 'center' }}>
                  <Text style={{ fontFamily: fonts.heading, fontSize: fs(10.5), color: C, textAlign: 'center' }}>{b.name}</Text>
                </View>
                <View style={{ padding: 6, gap: 5, minHeight: 96 }}>
                  {pool.filter((p) => placed[p] === bi).map((chip) => {
                    const ok = checked && b.items.includes(chip);
                    const bad = checked && !b.items.includes(chip);
                    return (
                      <Pressable key={chip} onPress={() => pull(chip)} style={{ backgroundColor: ok ? colors.mint : bad ? '#FEE2E2' : '#fff', borderWidth: 2, borderColor: C, paddingVertical: 5, paddingHorizontal: 6 }}>
                        <Text style={{ fontFamily: fonts.body, fontSize: fs(10), color: C, textAlign: 'center' }}>{chip}{ok ? ' ✓' : bad ? ' ✕' : ''}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            </Shadowed>
          </Pressable>
        ))}
      </View>

      {checked && <ResultBanner correct={allCorrect} />}
      {!!c.hint && <HintRow text={c.hint} />}
    </QuizShell>
  );
}
