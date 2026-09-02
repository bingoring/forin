// Shared quiz chrome — the 근무 수첩 line (v30).
//
// The quiz used to be a cream card stapled onto a dark backdrop: a thing shown OVER the
// app. It is a page of the notebook now, with the same header every quiz type shares —
// a written ✕ 그만두기, the department, n/N printed, and one tilted ink stroke per
// question so the run is countable rather than estimated.
//
// The card is gone on purpose, not lost: what the staples and the 4pt border were doing
// was saying "this is a separate, formal thing", and on a page of the learner's own
// notebook that job belongs to the ruled paper itself.
//
// Each quiz type supplies its own body and footer. `Shadowed` is kept as a name and
// re-implemented as paper, because thirteen bodies import it — renaming it in all of them
// is a change with no reader.
import { type ReactNode, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { Stack } from 'expo-router';
import { NbIcon } from '@/components/nb/NbIcon';
import { NbMemo, NbSheet, NbTag, nbText } from '@/components/nb/NbUI';
import { nb, nbFonts, paperShadow } from '@/theme/nb';
import { playSfx } from '@/lib/sfx';
import { useT } from '@/i18n';

/** Ink. Exported because every quiz body draws its own borders with it. */
export const C = nb.ink;

/**
 * The lift under a card. Same call signature as the pixel version it replaces (offset and
 * shadowColor are accepted and ignored) so the thirteen bodies did not each need the same
 * edit on the same day.
 *
 * It carries ONLY the shadow — the card's own background and pen-weight border come from
 * the child, which is what those thirteen bodies already draw. Wrapping them in a full
 * NbPaper instead put a paper border around a paper border, visible as a double edge on
 * every card. The background here is not redundant either: iOS casts a shadow from what a
 * view PAINTS, so a transparent wrapper would cast nothing.
 */
export function Shadowed({ children, style }: {
  children?: ReactNode;
  offset?: number;
  shadowColor?: string;
  style?: StyleProp<ViewStyle>;
}) {
  return <View style={[{ backgroundColor: nb.paper }, paperShadow, style]}>{children}</View>;
}

// A multi-quiz sequence (a scenario with several quiz steps) shows "N/M" so the learner
// knows how many mini-quizzes remain before the scenario result.
export type QuizProgress = { cur: number; total: number };

export function QuizShell({ title, sub, zone, onExit, progress, children, footer }: {
  title: string; sub?: string; zone?: string; onExit: () => void;
  progress?: QuizProgress; children: ReactNode; footer: ReactNode;
}) {
  const t = useT();
  const total = progress?.total ?? 0;
  const cur = progress?.cur ?? 0;
  return (
    <NbSheet>
      <Stack.Screen options={{ headerShown: false, animation: 'fade' }} />

      <View style={styles.head}>
        <View style={styles.headRow}>
          {/* Written, not a button: leaving is always available and never the thing to
              do, so it is the quietest mark on the page. */}
          <Text
            onPress={() => { playSfx('back'); onExit(); }}
            suppressHighlighting
            style={styles.exit}
          >
            {t('quiz.exit')}
          </Text>
          <View style={{ flex: 1 }} />
          {!!zone && <NbTag color={nb.blue} rot={1}>{zone}</NbTag>}
          {total > 1 && <Text numberOfLines={1} style={styles.count}>{cur}/{total}</Text>}
        </View>

        {/* One stroke per question. A bar says "some of the way"; strokes say which one
            you are on out of how many. */}
        {total > 1 && (
          <View style={styles.strokes}>
            {Array.from({ length: total }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.stroke,
                  { backgroundColor: i < cur ? nb.ink : 'rgba(62,54,43,.15)', transform: [{ rotate: i % 2 ? '0.7deg' : '-0.7deg' }] },
                ]}
              />
            ))}
          </View>
        )}

        <Text style={[nbText.hand(24), styles.title]}>{title}</Text>
        {!!sub && <Text style={[nbText.body(11, nb.soft), { marginTop: 2 }]}>{sub}</Text>}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.body}>
        {children}
      </ScrollView>

      {/* The footer sits ON the page rather than in a bar: it is the next thing to write,
          not a toolbar. */}
      <View style={styles.footer}>{footer}</View>
    </NbSheet>
  );
}

/**
 * A written section heading with the rule DRAWN.
 *
 * These were ━━━ runs — a box-drawing glyph pretending to be a line, at the type's weight
 * and nothing else's baseline (theme/glyphs.test.ts bans the family). A dashed 1.5pt rule
 * is the same mark a pen makes.
 */
export function QuizSection({ label, right }: { label: string; right?: ReactNode }) {
  return (
    <View style={styles.section}>
      <Text numberOfLines={1} style={nbText.hand(15, nb.soft)}>{label}</Text>
      <View style={styles.sectionRule} />
      {right}
    </View>
  );
}

/** The situation the question is asked inside. */
export function ContextBox({ text }: { text: string }) {
  return (
    <NbMemo color={nb.blue} rot={-0.3} style={{ marginBottom: 14 }}>
      <Text style={nbText.hand(14.5)}>{text}</Text>
    </NbMemo>
  );
}

/** A hint, in pencil beside a drawn bulb — quieter than the question and never confusable
 *  with it. */
export function HintRow({ text }: { text: string }) {
  return (
    <View style={styles.hint}>
      <NbIcon name="bulb" size={16} color="#C99A1E" />
      <Text style={[nbText.hand(14, nb.soft), { flex: 1, minWidth: 0 }]}>{text}</Text>
    </View>
  );
}

export function ResultBanner({ correct }: { correct: boolean }) {
  const t = useT();
  // The verdict sound lives here rather than in each quiz's submit handler: this banner is
  // exactly the moment a submit-style quiz reveals its answer, so the quizzes that render
  // it get audio feedback from one place. Keyed on `correct` so a retry that flips the
  // verdict re-sounds.
  useEffect(() => {
    playSfx(correct ? 'confirm' : 'wrong');
  }, [correct]);

  return (
    <View style={[styles.verdict, { backgroundColor: correct ? 'rgba(168,217,151,.4)' : '#FFF0EC', borderColor: correct ? nb.green : '#E4B4A6' }]}>
      <NbIcon name={correct ? 'check' : 'cross'} size={17} color={correct ? nb.green : nb.red} />
      <Text style={nbText.hand(17)}>{correct ? t('quiz.correct') : t('quiz.wrong')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  head: { paddingTop: 52, paddingHorizontal: 20, paddingBottom: 4 },
  headRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  exit: {
    fontFamily: nbFonts.hand, fontSize: 15, color: nb.ink,
    borderWidth: 1.5, borderColor: nb.ink, borderRadius: 3,
    paddingVertical: 1, paddingHorizontal: 9,
    transform: [{ rotate: '-1deg' }],
  },
  count: { fontFamily: nbFonts.monoBold, fontSize: 12, color: nb.soft },
  strokes: { flexDirection: 'row', gap: 5, marginTop: 10 },
  stroke: { flex: 1, height: 5, borderRadius: 2 },
  title: { marginTop: 13, lineHeight: 29 },
  body: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20 },
  footer: { flexDirection: 'row', gap: 9, paddingHorizontal: 20, paddingTop: 10, paddingBottom: 26 },
  hint: { marginTop: 16, flexDirection: 'row', alignItems: 'center', gap: 7 },
  section: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 16, marginBottom: 6 },
  sectionRule: { flex: 1, borderTopWidth: 1.5, borderStyle: 'dashed', borderTopColor: 'rgba(62,54,43,.25)' },
  verdict: {
    marginTop: 16, flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingVertical: 9, paddingHorizontal: 12,
    borderWidth: 1.5, borderStyle: 'dashed', transform: [{ rotate: '-0.4deg' }],
  },
});
