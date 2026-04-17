import React, { useState, useMemo, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../theme';

interface Pair {
  term: string;
  definition: string;
}

interface Props {
  content: { pairs: Pair[] };
  onSubmit: (response: { total_time_seconds: number; mismatch_count: number }) => void;
}

interface Card {
  id: string;
  text: string;
  pairKey: string;
}

export function MeaningMatch({ content, onSubmit }: Props) {
  const startTime = useRef(Date.now());
  const [mismatchCount, setMismatchCount] = useState(0);
  const [flipped, setFlipped] = useState<Set<string>>(new Set());
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [firstCard, setFirstCard] = useState<Card | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const cards = useMemo(() => {
    const list: Card[] = [];
    content.pairs.forEach((pair, i) => {
      list.push({ id: `t${i}`, text: pair.term, pairKey: `p${i}` });
      list.push({ id: `d${i}`, text: pair.definition, pairKey: `p${i}` });
    });
    // Shuffle
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  }, [content.pairs]);

  const handleCardTap = (card: Card) => {
    if (isChecking || matched.has(card.id) || flipped.has(card.id)) return;

    const newFlipped = new Set(flipped);
    newFlipped.add(card.id);
    setFlipped(newFlipped);

    if (!firstCard) {
      setFirstCard(card);
      return;
    }

    // Check match
    setIsChecking(true);

    if (firstCard.pairKey === card.pairKey) {
      // Match!
      const newMatched = new Set(matched);
      newMatched.add(firstCard.id);
      newMatched.add(card.id);
      setMatched(newMatched);
      setFirstCard(null);
      setIsChecking(false);

      // Check if all matched
      if (newMatched.size === cards.length) {
        const elapsed = Math.floor((Date.now() - startTime.current) / 1000);
        setTimeout(() => onSubmit({ total_time_seconds: elapsed, mismatch_count: mismatchCount }), 300);
      }
    } else {
      // Mismatch
      setMismatchCount((c) => c + 1);
      setTimeout(() => {
        newFlipped.delete(firstCard.id);
        newFlipped.delete(card.id);
        setFlipped(new Set(newFlipped));
        setFirstCard(null);
        setIsChecking(false);
      }, 800);
    }
  };

  const cols = cards.length <= 12 ? 3 : 4;

  return (
    <View style={styles.container}>
      <Text style={styles.instruction}>Match each term with its definition</Text>

      <View style={styles.statsRow}>
        <Text style={styles.stat}>Pairs: {matched.size / 2}/{content.pairs.length}</Text>
        <Text style={styles.stat}>Misses: {mismatchCount}</Text>
      </View>

      <View style={[styles.grid, { gap: spacing.sm }]}>
        {cards.map((card) => {
          const isFlipped = flipped.has(card.id);
          const isMatched = matched.has(card.id);

          return (
            <TouchableOpacity
              key={card.id}
              style={[
                styles.card,
                { width: `${Math.floor(100 / cols) - 3}%` },
                isFlipped && styles.cardFlipped,
                isMatched && styles.cardMatched,
              ]}
              onPress={() => handleCardTap(card)}
              activeOpacity={0.8}
              disabled={isMatched}
            >
              <Text
                style={[
                  styles.cardText,
                  isFlipped && styles.cardTextFlipped,
                  isMatched && styles.cardTextMatched,
                ]}
                numberOfLines={3}
              >
                {isFlipped || isMatched ? card.text : '?'}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  instruction: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.sm },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md },
  stat: { ...typography.caption, color: colors.textMuted },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  card: {
    aspectRatio: 1,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xs,
  },
  cardFlipped: { backgroundColor: colors.white, borderWidth: 2, borderColor: colors.primary },
  cardMatched: { backgroundColor: '#ECFDF5', borderWidth: 2, borderColor: colors.success },
  cardText: { ...typography.small, color: colors.white, textAlign: 'center', fontWeight: '700' },
  cardTextFlipped: { color: colors.primary, fontWeight: '500' },
  cardTextMatched: { color: colors.success },
});
