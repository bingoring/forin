// GoalDeptSheet — 목표 부서 헤더를 눌러 여는 부서 고르기 시트. Task 18,
// frontend-components.md §2(GoalDeptBar의 `onChange`) · §5("목표 부서 바 탭 → 부서
// 고르기, 같은 PATCH 경로").
//
// 부서 목록은 여기서 만들지 않는다. `depts`는 호출부(`journey.tsx`)가 `GET /me/journey`
// 응답 하나에서 이미 뽑아 준 것 — `goalDept` + `freeRoam[].dept`의 합집합이다(J9 개정,
// Task 17: freeRoam은 이제 목표 부서만 빼고 나머지 전부를 층 조건 없이 낸다). 이 저장소에
// 부서 하드코딩 배열이 이미 둘 있었고(`WARDS`, 그리고 방금 지운 `INTERIOR_DEPTS`) 둘 다
// 콘텐츠와 어긋나는 문제를 반복했다 — 세 번째를 만들지 않는 것이 이 컴포넌트의 유일한
// 존재 이유다.
//
// 잠금 없음(J1): 아직 가 보지 않은 부서도 고를 수 있다. Station의 `far` 상태(§2)와 같은
// 원칙 — 자물쇠도 `disabled`도 쓰지 않는다. 자유 탐방 칩과 정확히 같은 경로를 탄다(J5,
// FreeRoamRow.tsx 참고) — `onPick(dept)`를 부르는 것 이상은 이 컴포넌트의 일이 아니고,
// `setGoalDept` 호출과 재요청은 호출부의 `pickDept()`가 맡는다(미리보기·확정 분리 없음).
import { Pressable, ScrollView, Text, View } from 'react-native';
import { BottomSheet } from '@/components/BottomSheet';
import { NbIcon } from '@/components/nb/NbIcon';
import { nbText } from '@/components/nb/NbUI';
import { deptNbIcon } from '@/data/campus';
import { nb } from '@/theme/nb';
import { useT } from '@/i18n';

function DeptRow({ dept, current, onPress }: { dept: string; current: boolean; onPress(): void }) {
  const t = useT();
  return (
    <Pressable
      testID={`goal-dept-row-${dept}`}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: current }}
      accessibilityLabel={t(`dept.${dept}`)}
      style={{
        flexDirection: 'row', alignItems: 'center', gap: 10,
        paddingVertical: 11, paddingHorizontal: 16,
        borderTopWidth: 1.3, borderTopColor: 'rgba(62,54,43,.14)', borderStyle: 'dashed',
        backgroundColor: current ? 'rgba(143,199,232,.22)' : 'transparent',
      }}
    >
      <NbIcon name={deptNbIcon(`SCN-${dept}-00001`)} size={18} />
      <Text numberOfLines={1} style={[nbText.hand(16), { flex: 1 }]}>{t(`dept.${dept}`)}</Text>
      {/* 지금 목표인 부서만 체크로 구별한다 — 목록 자체는 아무것도 잠그지 않는다(J1). */}
      {current && <View testID="goal-dept-current-mark"><NbIcon name="check" size={16} /></View>}
    </Pressable>
  );
}

export function GoalDeptSheet({ depts, current, inferred, onPick, onClose }: {
  /** 전체 부서 코드. 호출부가 이미 합쳐 만든 목록 — 이 컴포넌트는 스스로 부서를 알지 못한다. */
  depts: string[];
  current: string;
  /** 참이면 지금 목표가 아직 학습자의 선택이 아니라 서버 추론이다 — 문구를 권유형으로 바꾼다(§2). */
  inferred: boolean;
  onPick(dept: string): void;
  onClose(): void;
}) {
  const t = useT();
  return (
    <BottomSheet
      visible
      overlay
      size="tall"
      onClose={onClose}
      header={
        <View style={{ paddingTop: 2, paddingHorizontal: 20, paddingBottom: 10 }}>
          <Text numberOfLines={1} style={[nbText.hand(22), { lineHeight: 24 }]}>{t('journey.pickDeptTitle')}</Text>
          <Text style={[nbText.body(12, nb.soft), { marginTop: 2 }]}>
            {t(inferred ? 'journey.pickDeptInferredHint' : 'journey.pickDeptHint')}
          </Text>
        </View>
      }
    >
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        {depts.map((dept) => (
          <DeptRow key={dept} dept={dept} current={dept === current} onPress={() => onPick(dept)} />
        ))}
      </ScrollView>
    </BottomSheet>
  );
}
