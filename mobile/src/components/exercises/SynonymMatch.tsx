import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { vocabularyApi } from '../../api';
import { colors, typography, spacing, borderRadius } from '../../theme';
import type { VocabularyItem } from '../../types/api';

interface Content {
  type: 'synonym_match';
  mode: 'pair';
  direction: 'native_to_target' | 'target_to_native';
  pairs: string[]; // vocabulary UUIDs
}

interface PairResult {
  vocab_id: string;
  correct: boolean;
}

interface Props {
  content: Content;
  onSubmit: (response: { pair_results: PairResult[] }) => void;
}

/**
 * Two-column tap-pair exercise.
 *
 * Left column: native-language cards (for direction=native_to_target).
 * Right column: shuffled target-language cards.
 *
 * Learner taps a left card, then a right card — if they belong to the
 * same vocabulary UUID, it's a hit. Wrong attempts count once per
 * vocab_id (matching the server's XP formula). On full resolution the
 * component reports pair_results to the parent.
 */
export function SynonymMatch({ content, onSubmit }: Props) {
  const [loading, setLoading] = useState(true);
  const [vocab, setVocab] = useState<VocabularyItem[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [resolved, setResolved] = useState<Set<string>>(new Set());
  const [firstAttemptWrong, setFirstAttemptWrong] = useState<Set<string>>(new Set());
  const [flash, setFlash] = useState<'none' | 'wrong'>('none');

  useEffect(() => {
    (async () => {
      try {
        const { data } = await vocabularyApi.lookup(content.pairs);
        setVocab(data.data.items);
      } finally {
        setLoading(false);
      }
    })();
  }, [content.pairs]);

  const leftItems = useMemo(() => {
    const byId = new Map(vocab.map((v) => [v.id, v]));
    return content.pairs
      .map((id) => byId.get(id))
      .filter((v): v is VocabularyItem => !!v);
  }, [content.pairs, vocab]);

  const rightItems = useMemo(() => {
    const copy = [...leftItems];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }, [leftItems]);

  const native = (v: VocabularyItem) => v.translation;
  const target = (v: VocabularyItem) => v.canonical_en;

  const leftLabel = content.direction === 'native_to_target' ? native : target;
  const rightLabel = content.direction === 'native_to_target' ? target : native;

  const onTapRight = (rightId: string) => {
    if (!selectedLeft) return;
    const hit = selectedLeft === rightId;
    if (hit) {
      setResolved((prev) => {
        const next = new Set(prev);
        next.add(rightId);
        return next;
      });
      setSelectedLeft(null);
    } else {
      if (!firstAttemptWrong.has(selectedLeft)) {
        setFirstAttemptWrong((prev) => new Set(prev).add(selectedLeft));
      }
      setFlash('wrong');
      setTimeout(() => setFlash('none'), 400);
      setSelectedLeft(null);
    }
  };

  useEffect(() => {
    if (vocab.length > 0 && resolved.size === vocab.length) {
      const pair_results: PairResult[] = vocab.map((v) => ({
        vocab_id: v.id,
        correct: !firstAttemptWrong.has(v.id),
      }));
      onSubmit({ pair_results });
    }
  }, [resolved, vocab, firstAttemptWrong, onSubmit]);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, flash === 'wrong' && styles.wrongFlash]}>
      <View style={styles.columns}>
        <View style={styles.column}>
          {leftItems.map((v) => {
            const isSelected = selectedLeft === v.id;
            const isResolved = resolved.has(v.id);
            return (
              <TouchableOpacity
                key={v.id}
                disabled={isResolved}
                onPress={() => setSelectedLeft(v.id)}
                style={[
                  styles.card,
                  isSelected && styles.cardSelected,
                  isResolved && styles.cardResolved,
                ]}
                activeOpacity={0.7}
              >
                <Text style={styles.cardText}>{leftLabel(v)}</Text>
                {isResolved ? <Text style={styles.check}>✓</Text> : null}
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={styles.column}>
          {rightItems.map((v) => {
            const isResolved = resolved.has(v.id);
            return (
              <TouchableOpacity
                key={v.id}
                disabled={isResolved || !selectedLeft}
                onPress={() => onTapRight(v.id)}
                style={[styles.card, isResolved && styles.cardResolved]}
                activeOpacity={0.7}
              >
                <Text style={styles.cardText}>{rightLabel(v)}</Text>
                {isResolved ? <Text style={styles.check}>✓</Text> : null}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.md },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  columns: { flexDirection: 'row', gap: spacing.md },
  column: { flex: 1, gap: spacing.sm },
  card: {
    minHeight: 64,
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.border,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardSelected: { borderColor: colors.accent, backgroundColor: colors.accent + '22' },
  cardResolved: { opacity: 0.5, borderColor: colors.success },
  cardText: { ...typography.bodyBold, color: colors.textPrimary, textAlign: 'center' },
  check: { position: 'absolute', top: 4, right: 8, color: colors.success, fontSize: 14 },
  wrongFlash: { backgroundColor: colors.heart + '22' },
});
