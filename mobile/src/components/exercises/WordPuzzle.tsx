import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../theme';

interface Blank {
  index: number;
  correct_answer: string;
  options: string[];
}

interface Props {
  content: {
    dialogue_template: string;
    blanks: Blank[];
  };
  onSubmit: (response: { answers: { blank_index: number; selected_option: string }[] }) => void;
}

export function WordPuzzle({ content, onSubmit }: Props) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [activeBlank, setActiveBlank] = useState<number>(content.blanks[0]?.index ?? 0);

  const allFilled = content.blanks.every((b) => answers[b.index] !== undefined);

  const handleOptionSelect = (blankIndex: number, option: string) => {
    setAnswers({ ...answers, [blankIndex]: option });
    // Auto-advance to next blank
    const currentBlankIdx = content.blanks.findIndex((b) => b.index === blankIndex);
    if (currentBlankIdx < content.blanks.length - 1) {
      setActiveBlank(content.blanks[currentBlankIdx + 1].index);
    }
  };

  const handleSubmit = () => {
    const result = content.blanks.map((b) => ({
      blank_index: b.index,
      selected_option: answers[b.index] || '',
    }));
    onSubmit({ answers: result });
  };

  // Render dialogue with blanks
  const renderDialogue = () => {
    let text = content.dialogue_template;
    const parts: React.ReactNode[] = [];
    let lastIdx = 0;

    content.blanks.forEach((blank) => {
      const placeholder = `{{${blank.index}}}`;
      const pos = text.indexOf(placeholder, lastIdx);
      if (pos === -1) return;

      // Text before blank
      if (pos > lastIdx) {
        parts.push(
          <Text key={`t${blank.index}`} style={styles.dialogueText}>
            {text.slice(lastIdx, pos)}
          </Text>
        );
      }

      // Blank
      const answer = answers[blank.index];
      const isActive = activeBlank === blank.index;
      parts.push(
        <TouchableOpacity
          key={`b${blank.index}`}
          onPress={() => setActiveBlank(blank.index)}
          style={[styles.blank, isActive && styles.blankActive, answer && styles.blankFilled]}
        >
          <Text style={[styles.blankText, answer && styles.blankFilledText]}>
            {answer || '______'}
          </Text>
        </TouchableOpacity>
      );

      lastIdx = pos + placeholder.length;
    });

    // Remaining text
    if (lastIdx < text.length) {
      parts.push(
        <Text key="rest" style={styles.dialogueText}>
          {text.slice(lastIdx)}
        </Text>
      );
    }

    return parts;
  };

  const currentBlank = content.blanks.find((b) => b.index === activeBlank);

  return (
    <View style={styles.container}>
      <Text style={styles.instruction}>Fill in the blanks with the correct words</Text>

      {/* Dialogue */}
      <View style={styles.dialogueCard}>
        <Text style={styles.dialogueWrap}>{renderDialogue()}</Text>
      </View>

      {/* Options for active blank */}
      {currentBlank && (
        <View style={styles.optionsContainer}>
          <Text style={styles.optionLabel}>Choose for blank {currentBlank.index + 1}:</Text>
          <View style={styles.optionsGrid}>
            {currentBlank.options.map((option) => {
              const isSelected = answers[currentBlank.index] === option;
              return (
                <TouchableOpacity
                  key={option}
                  style={[styles.option, isSelected && styles.optionSelected]}
                  onPress={() => handleOptionSelect(currentBlank.index, option)}
                >
                  <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      <TouchableOpacity
        style={[styles.submitBtn, !allFilled && styles.submitBtnDisabled]}
        onPress={handleSubmit}
        disabled={!allFilled}
      >
        <Text style={styles.submitText}>Check Answer</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  instruction: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.md },
  dialogueCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dialogueWrap: { flexDirection: 'row', flexWrap: 'wrap' },
  dialogueText: { ...typography.body, color: colors.textPrimary },
  blank: {
    borderBottomWidth: 2,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.xs,
    marginHorizontal: 2,
  },
  blankActive: { borderBottomColor: colors.primary },
  blankFilled: { borderBottomColor: colors.success, backgroundColor: '#ECFDF5' },
  blankText: { ...typography.bodyBold, color: colors.textMuted },
  blankFilledText: { color: colors.success },
  optionsContainer: { marginBottom: spacing.lg },
  optionLabel: { ...typography.caption, color: colors.textSecondary, marginBottom: spacing.sm },
  optionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  option: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    minWidth: '45%',
    alignItems: 'center',
  },
  optionSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  optionText: { ...typography.bodyBold, color: colors.textPrimary },
  optionTextSelected: { color: colors.white },
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
