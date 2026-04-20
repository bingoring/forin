import React, { useMemo, useRef, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Dimensions, Pressable } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { curriculumApi } from '../../api';
import { FloorCanvas, HotspotSheet, FloorSwitcher } from '../../components/map';
import { Mascot } from '../../components/mascot';
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

  const modules = useMemo(() => {
    if (!data?.modules) return [];
    return [...data.modules].sort((a, b) => a.floor_order - b.floor_order);
  }, [data]);

  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const activeModule = modules.find((m) => m.id === activeModuleId) ?? modules[0] ?? null;

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

  // Placeholder unlock state — all floors unlocked until the Quests/progress
  // query adds a dedicated "unlocked modules" endpoint. The server-side
  // unlock event already fires; surfacing it here is a Phase 2 refinement.
  const floorEntries = modules.map((m) => ({
    moduleId: m.id,
    floorOrder: m.floor_order,
    label: m.floor_label,
    icon: m.floor_icon,
    unlocked: true,
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

      {/* Moro at the current in-progress unit */}
      {currentUnit ? (
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: (currentUnit.map_x / 100) * CANVAS_W - 40,
            top: (currentUnit.map_y / 100) * CANVAS_H - 90,
          }}
        >
          <Mascot pose="wave" size={80} />
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
