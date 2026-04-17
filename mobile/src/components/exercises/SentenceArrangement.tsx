import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../theme';

interface Props {
  content: {
    target_sentence: string;
    word_tiles: string[];
    distractor_indices: number[];
  };
  onSubmit: (response: { answer: string[] }) => void;
}

export function SentenceArrangement({ content, onSubmit }: Props) {
  const [selected, setSelected] = useState<number[]>([]);

  const shuffledTiles = useMemo(() => {
    const tiles = content.word_tiles.map((word, idx) => ({ word, idx }));
    // Shuffle
    for (let i = tiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    }
    return tiles;
  }, [content.word_tiles]);

  const handleTileTap = (originalIdx: number) => {
    if (selected.includes(originalIdx)) {
      setSelected(selected.filter((i) => i !== originalIdx));
    } else {
      setSelected([...selected, originalIdx]);
    }
  };

  const handleSubmit = () => {
    const answer = selected.map((idx) => content.word_tiles[idx]);
    onSubmit({ answer });
  };

  const selectedWords = selected.map((idx) => content.word_tiles[idx]);

  return (
    <View style={styles.container}>
      <Text style={styles.instruction}>Arrange the words to form a correct sentence</Text>

      {/* Answer area */}
      <View style={styles.answerArea}>
        {selected.length > 0 ? (
          <Text style={styles.answerText}>{selectedWords.join(' ')}</Text>
        ) : (
          <Text style={styles.answerPlaceholder}>Tap tiles below to build the sentence</Text>
        )}
      </View>

      {/* Word tiles */}
      <View style={styles.tilesContainer}>
        {shuffledTiles.map((tile) => {
          const isSelected = selected.includes(tile.idx);
          return (
            <TouchableOpacity
              key={tile.idx}
              style={[styles.tile, isSelected && styles.tileSelected]}
              onPress={() => handleTileTap(tile.idx)}
              activeOpacity={0.7}
            >
              <Text style={[styles.tileText, isSelected && styles.tileTextSelected]}>
                {tile.word}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Submit */}
      <TouchableOpacity
        style={[styles.submitBtn, selected.length === 0 && styles.submitBtnDisabled]}
        onPress={handleSubmit}
        disabled={selected.length === 0}
      >
        <Text style={styles.submitText}>Check Answer</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  instruction: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.md },
  answerArea: {
    minHeight: 80,
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    padding: spacing.md,
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  answerText: { ...typography.body, color: colors.textPrimary },
  answerPlaceholder: { ...typography.body, color: colors.textMuted, textAlign: 'center' },
  tilesContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg },
  tile: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  tileSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  tileText: { ...typography.bodyBold, color: colors.textPrimary },
  tileTextSelected: { color: colors.white },
  submitBtn: {
    backgroundColor: colors.primary,
    height: 52,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitBtnDisabled: { opacity: 0.4 },
  submitText: { ...typography.button, color: colors.white },
});
