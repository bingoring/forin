import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { AudioPlayer, Button, Icon, type HeroIconName } from '../common';

interface Props {
  content: {
    ai_character_name: string;
    ai_character_role: string;
    opening_line: string;
    ideal_responses?: string[];
    min_passing_score?: number;
  };
  audioUrl?: string | null;
  exerciseId?: string;
  onSubmit: (response: { user_response_text: string }) => void;
}

function characterIconFor(role: string): HeroIconName {
  const r = role.toLowerCase();
  if (r.includes('patient')) return 'heart';
  if (r.includes('doctor')) return 'doctor';
  if (r.includes('nurse') || r.includes('peer')) return 'nurse';
  return 'pin';
}

export function ConversationPractice({ content, audioUrl, exerciseId, onSubmit }: Props) {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    if (text.trim().length === 0) return;
    onSubmit({ user_response_text: text.trim() });
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <AudioPlayer
        audioUrl={audioUrl}
        fallbackText={content.opening_line}
        exerciseId={exerciseId}
      />
      <Text style={styles.instruction}>Respond to the patient appropriately</Text>

      {/* Character */}
      <View style={styles.characterCard}>
        <View style={styles.characterHeader}>
          <View style={styles.characterIcon}>
            <Icon
              name={characterIconFor(content.ai_character_role)}
              size={36}
              color={colors.primary}
            />
          </View>
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
  characterIcon: { marginRight: spacing.sm },
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
