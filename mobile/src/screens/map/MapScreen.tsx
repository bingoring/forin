import React, { useMemo, useRef, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Dimensions, Pressable } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { curriculumApi, gamificationApi } from '../../api';
import { FloorCanvas, HotspotSheet, FloorSwitcher } from '../../components/map';
import { MascotWithItems, type EquippedItem } from '../../components/mascot';
import { colors, borderRadius } from '../../theme';
import { t } from '../../locales';
import type { MapStackParamList } from '../../navigation/types';
import type { CurriculumUnit, StageOverview } from '../../types/api';

type Props = NativeStackScreenProps<MapStackParamList, 'MapMain'>;

const { width: SCREEN_W } = Dimensions.get('window');
const CANVAS_W = SCREEN_W;
const CANVAS_H = 560;

export function MapScreen({ navigation }: Props) {
  const { data, isLoading } = useQuery({
    queryKey: ['curriculum'],
    queryFn: async () => {
      const res = await curriculumApi.getCurriculum();
      return res.data.data;
    },
  });

  const { data: inventory } = useQuery({
    queryKey: ['inventory'],
    queryFn: async () => {
      const res = await gamificationApi.getInventory();
      return res.data.data;
    },
  });

  const equippedItems: EquippedItem[] = ((inventory as any)?.items ?? [])
    .filter((i: any) => i.is_equipped)
    .map((i: any) => ({ slot: i.slot, rarity: i.rarity, name: i.name }));

  const modules = useMemo(() => {
    if (!data?.modules) return [];
    return [...data.modules].sort((a, b) => a.floor_order - b.floor_order);
  }, [data]);

  const unlockedSet = useMemo(() => {
    return new Set(data?.unlocked_module_ids ?? []);
  }, [data]);

  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  // Default to the first unlocked module; fall back to the first module
  // overall so we still render something during the initial render where
  // `data` is undefined.
  const defaultActive = modules.find((m) => unlockedSet.has(m.id)) ?? modules[0] ?? null;
  const activeModule = modules.find((m) => m.id === activeModuleId) ?? defaultActive;

  const sheetRef = useRef<BottomSheetModal>(null);
  const [selectedUnit, setSelectedUnit] = useState<CurriculumUnit | null>(null);

  if (isLoading || !activeModule) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  // First unit containing any non-completed stage — where Moro stands.
  const currentUnit =
    activeModule.units.find((u) => u.stages.some((s) => s.progress?.status !== 'completed')) ??
    activeModule.units[0];

  const floorEntries = modules.map((m) => ({
    moduleId: m.id,
    floorOrder: m.floor_order,
    label: m.floor_label,
    icon: m.floor_icon,
    unlocked: unlockedSet.has(m.id),
  }));

  const openHotspot = (unit: CurriculumUnit) => {
    setSelectedUnit(unit);
    sheetRef.current?.present();
  };

  const onStagePress = (stage: StageOverview) => {
    sheetRef.current?.dismiss();
    navigation.navigate('StageIntro', { stageId: stage.id });
  };

  return (
    <View style={styles.container}>
      <FloorCanvas
        width={CANVAS_W}
        height={CANVAS_H}
        units={activeModule.units}
        floorLabel={activeModule.floor_label || t('map.floorBadge', { order: activeModule.floor_order })}
      />

      {/* Hotspot tap targets — absolute-positioned pressables overlaying
          the zones drawn by FloorCanvas */}
      {activeModule.units.map((u) => {
        const left = (u.map_x / 100) * CANVAS_W - 55;
        const top = (u.map_y / 100) * CANVAS_H - 35;
        return (
          <Pressable
            key={u.id}
            onPress={() => openHotspot(u)}
            style={[styles.hotspot, { left, top, width: 110, height: 70 }]}
          />
        );
      })}

      {/* Moro at the current in-progress unit, wearing equipped items. */}
      {currentUnit ? (
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: (currentUnit.map_x / 100) * CANVAS_W - 40,
            top: (currentUnit.map_y / 100) * CANVAS_H - 90,
          }}
        >
          <MascotWithItems pose="wave" size={80} items={equippedItems} />
        </View>
      ) : null}

      <FloorSwitcher
        floors={floorEntries}
        activeModuleId={activeModule.id}
        onSelect={setActiveModuleId}
      />

      <HotspotSheet ref={sheetRef} unit={selectedUnit} onStagePress={onStagePress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  hotspot: {
    position: 'absolute',
    borderRadius: borderRadius.md,
  },
});
