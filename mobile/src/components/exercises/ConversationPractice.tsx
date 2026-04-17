import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { Button } from '../common';

interface Props {
  content: {
    ai_character_name: string;
    ai_character_role: string;
    opening_line: string;
    ideal_responses?: string[];
    min_passing_score?: number;
  };
  onSubmit: (response: { user_response_text: string }) => void;
}

export function ConversationPractice({ content, onSubmit }: Props) {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    if (text.trim().length === 0) return;
    onSubmit({ user_response_text: text.trim() });
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.instruction}>Respond to the patient appropriately</Text>

      {/* Character */}
      <View style={styles.characterCard}>
        <View style={styles.characterHeader}>
          <Text style={styles.characterEmoji}>
            {content.ai_character_role === 'patient' ? '🏥' : '👨‍⚕️'}
          </Text>
          <View>
            <Text style={styles.characterName}>{content.ai_character_name}</Text>
            <Text style={styles.characterRole}>{content.ai_character_role}</Text>
          </View>
        </View>
        <View style={styles.speechBubble}>
          <Text style={styles.speechText}>"{content.opening_line}"</Text>
        </View>
      </View>

      {/* User input */}
      <Text style={styles.inputLabel}>Your response:</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Type your response here..."
        placeholderTextColor={colors.textMuted}
        value={text}
        onChangeText={setText}
        multiline
        textAlignVertical="top"
      />

      <Text style={styles.hint}>
        Tip: Use appropriate clinical vocabulary and show empathy
      </Text>

      <Button
        title="Submit Response"
        onPress={handleSubmit}
        disabled={text.trim().length === 0}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  instruction: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.md },
  characterCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  characterHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  characterEmoji: { fontSize: 32 },
  characterName: { ...typography.bodyBold, color: colors.textPrimary },
  characterRole: { ...typography.small, color: colors.textMuted, textTransform: 'capitalize' },
  speechBubble: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  speechText: { ...typography.body, color: colors.textPrimary, fontStyle: 'italic' },
  inputLabel: { ...typography.caption, color: colors.textSecondary, marginBottom: spacing.xs },
  textInput: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    minHeight: 120,
    ...typography.body,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  hint: { ...typography.small, color: colors.textMuted, marginBottom: spacing.lg, textAlign: 'center' },
});
