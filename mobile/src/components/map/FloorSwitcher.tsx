import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon, type HeroIconName, type IconName } from '../common';
import { colors, typography, spacing, borderRadius } from '../../theme';

interface FloorEntry {
  moduleId: string;
  floorOrder: number;
  label: string;
  icon: string;
  unlocked: boolean;
}

interface Props {
  floors: FloorEntry[];
  activeModuleId: string;
  onSelect: (moduleId: string) => void;
}

export function FloorSwitcher({ floors, activeModuleId, onSelect }: Props) {
  return (
    <View style={styles.container}>
      {floors.map((f) => {
        const isActive = f.moduleId === activeModuleId;
        const iconName: IconName = f.unlocked ? (f.icon as HeroIconName) : 'elevator';
        return (
          <TouchableOpacity
            key={f.moduleId}
            disabled={!f.unlocked}
            onPress={() => onSelect(f.moduleId)}
            style={[styles.btn, isActive && styles.btnActive, !f.unlocked && styles.btnLocked]}
            activeOpacity={0.7}
          >
            <Icon
              name={iconName}
              size={22}
              color={isActive ? colors.accent : f.unlocked ? colors.primary : colors.textMuted}
            />
            <Text style={[styles.num, !f.unlocked && styles.numLocked]}>{f.floorOrder}F</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: spacing.sm,
    top: '25%',
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs,
  },
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
    borderRadius: borderRadius.sm,
  },
  btnActive: { backgroundColor: colors.accent + '22' },
  btnLocked: { opacity: 0.4 },
  num: { ...typography.small, color: colors.textPrimary, marginTop: 2 },
  numLocked: { color: colors.textMuted },
});
