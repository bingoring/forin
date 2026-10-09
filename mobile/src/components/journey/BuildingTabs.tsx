// BuildingTabs — 서가의 건물 간지(인덱스 탭). binder-shelf-buildings-v45 §F·§R.
// 시각 참조: inputs/design-handoff_v45/reference/forin-notebook-journey2.jsx `BinderShelf`의 탭 줄.
//
// 건물은 서버가 정한다(R1) — 서가 항목마다 `building`이 실려 오고, 이 파일은 그 순서대로 묶기만
// 한다. 부서 코드로 건물을 추측하지 않는다. 캠퍼스 지도(엘리베이터)와 같은 서버 표에서 오므로
// 서가와 지도가 같은 병원을 그린다.
import { Pressable, Text, View } from 'react-native';
import type { FreeRoamEntry } from '@/api/client';
import { BUILDING_STYLE, DEFAULT_BUILDING_STYLE } from '@/data/campus';
import { nbText } from '@/components/nb/NbUI';
import { nb, nbFonts } from '@/theme/nb';
import { useT } from '@/i18n';

export type ShelfBuilding = { building: string; entries: FreeRoamEntry[]; passed: number; total: number };

/** 서가 항목을 건물로 묶는다. 순서는 서버가 보낸 항목의 첫 등장 순서(서버가 캠퍼스 표 순서로
 *  보낸다). 목표 부서는 빼고 묶는다 — 서가에 다시 꽂지 않으므로(R3), 목표 하나뿐인 건물은
 *  탭이 생기지 않는다(R4). 건물 값이 없거나 처음 보는 이름이어도 묶음을 하나 만든다 —
 *  부서를 버리지 않는다(R7). */
export function shelfBuildings(entries: FreeRoamEntry[], goalDept: string): ShelfBuilding[] {
  const out: ShelfBuilding[] = [];
  for (const e of entries) {
    if ((e.dept ?? '') === goalDept) continue;
    const key = e.building ?? '';
    let b = out.find((x) => x.building === key);
    if (!b) { b = { building: key, entries: [], passed: 0, total: 0 }; out.push(b); }
    b.entries.push(e);
    b.passed += e.passed ?? 0;
    b.total += e.total ?? 0;
  }
  return out;
}

/** 탭에 쓰는 짧은 이름. 처음 보는 건물은 서버 이름 그대로, 이름조차 없으면 '기타'. */
export function useBuildingLabel(): (building: string) => string {
  const t = useT();
  return (building) => {
    const style = BUILDING_STYLE[building];
    if (style) return t(style.shortKey);
    return building || t('building.other.short');
  };
}

export function buildingAccent(building: string): string {
  return (BUILDING_STYLE[building] ?? DEFAULT_BUILDING_STYLE).accent;
}

export function BuildingTabs({ tabs, active, onPick }: {
  tabs: ShelfBuilding[];
  active: string;
  onPick(building: string): void;
}) {
  const label = useBuildingLabel();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 3, marginTop: 12, paddingHorizontal: 2 }}>
      {tabs.map((b, i) => {
        const on = b.building === active;
        const col = buildingAccent(b.building);
        const pct = b.total > 0 ? Math.min(100, (b.passed / b.total) * 100) : 0;
        return (
          <Pressable
            key={b.building || `other-${i}`}
            testID={`binder-shelf-tab-${b.building}`}
            onPress={() => onPick(b.building)}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            accessibilityLabel={label(b.building)}
            style={{
              flex: on ? 1.5 : 1, minWidth: 0, position: 'relative',
              backgroundColor: on ? nb.paper : `${col}22`,
              borderWidth: 1.5, borderColor: on ? nb.ink : 'rgba(62,54,43,.35)',
              borderBottomColor: on ? nb.paper : 'rgba(62,54,43,.35)',
              borderTopLeftRadius: 7, borderTopRightRadius: 7,
              paddingTop: on ? 7 : 5, paddingBottom: on ? 6 : 4, paddingRight: on ? 6 : 4, paddingLeft: on ? 6 : 4,
              marginBottom: -1.5, zIndex: on ? 2 : 1,
              transform: [{ rotate: `${on ? 0 : i % 2 ? 0.6 : -0.6}deg` }],
            }}
          >
            {/* 왼쪽 색 띠 — 건물 색(캠퍼스 지도와 같은 accent). */}
            <View style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 5, backgroundColor: col, borderTopLeftRadius: 6 }} />
            <Text
              numberOfLines={1}
              style={[nbText.hand(on ? 14 : 12, on ? nb.ink : nb.soft), { paddingLeft: 6, lineHeight: on ? 16 : 14 }]}
            >
              {label(b.building)}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingLeft: 6, marginTop: 3 }}>
              <View style={{ flex: 1, height: 4, borderWidth: 1, borderColor: 'rgba(62,54,43,.35)', borderRadius: 2, overflow: 'hidden' }}>
                {pct > 0 && <View style={{ width: `${pct}%`, height: '100%', backgroundColor: col }} />}
              </View>
              {/* 숫자는 활성 탭에만(R5) — 다섯 개가 다 숫자를 달면 탭이 읽히지 않는다. */}
              {on && (
                <Text style={{ fontFamily: nbFonts.monoBold, fontSize: 8.5, color: nb.soft }}>{`${b.passed}/${b.total}`}</Text>
              )}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}
