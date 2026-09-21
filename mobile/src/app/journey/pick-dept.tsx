// 부서 고르기 — 일터 탭(GoalDeptBar)의 오른쪽 화살표를 눌러 들어오는 화면.
//
// 2026-09-21 개정: GoalDeptSheet.tsx(바텀시트)를 화면으로 옮겼다. 오른쪽 화살표는
// "다른 화면으로 간다"고 말하는데 시트가 올라오면 신호와 결과가 어긋났고, 부서가
// 29개라 시트 높이로는 끝까지 보여줄 수 없었다 — 실기에서 `Simulation lab`·`General`
// 두 부서가 스크롤해도 가려져 있었다(frontend-components.md GoalDeptBar 절). 전체
// 화면이면 그 높이 제약이 없다. 뒤로 가면 일터 탭으로 돌아간다(PLACE_SCREEN —
// slide_from_right로 들어와서 되짚어 나간다).
//
// 부서 목록은 여기서 만들지 않는다. journey.tsx가 `GET /me/journey` 응답에서 이미
// 뽑은 `goalDept` + `freeRoam[].dept`의 합집합을 이 화면으로 넘어오기 직전
// `journeyGoalPick.ts`에 실어 둔다 — URL 파라미터가 아니라 모듈 스토어인 이유는
// loungeShare.ts와 같다(29개 부서 코드는 URL이 옮길 데이터가 아니다).
//
// 고르는 것도 새로 만들지 않는다(J5, 부서를 고르는 방법은 하나). `pickGoalDept`는
// journey.tsx의 `pickDept()`를 그대로 부른다 — 그 함수가 쥔 요청 순서 카운터까지
// 그대로 따라온다. journey.tsx는 이 화면 아래 계속 마운트돼 있다(React Navigation은
// push된 화면 아래를 언마운트가 아니라 blur만 한다).
//
// 잠금 없음(J1): Station의 `far` 상태와 같은 원칙 — 아직 가 보지 않은 부서도 그냥
// 눌린다. 자물쇠도 `disabled`도 쓰지 않는다.
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { NbIcon } from '@/components/nb/NbIcon';
import { NbPaper, NbSheet, nbText } from '@/components/nb/NbUI';
import { deptNbIcon } from '@/data/campus';
import { goalPickOffer, pickGoalDept } from '@/data/journeyGoalPick';
import { TOP_INSET, nb } from '@/theme/nb';
import { PLACE_SCREEN } from '@/theme/transitions';
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
        paddingVertical: 13, paddingHorizontal: 20,
        borderTopWidth: 1.3, borderTopColor: 'rgba(62,54,43,.14)', borderStyle: 'dashed',
        backgroundColor: current ? 'rgba(143,199,232,.22)' : 'transparent',
      }}
    >
      <NbIcon name={deptNbIcon(`SCN-${dept}-00001`)} size={19} />
      <Text numberOfLines={1} style={[nbText.hand(17), { flex: 1 }]}>{t(`dept.${dept}`)}</Text>
      {/* 지금 목표인 부서만 체크로 구별한다 — 목록 자체는 아무것도 잠그지 않는다(J1). */}
      {current && <View testID="goal-dept-current-mark"><NbIcon name="check" size={17} /></View>}
    </Pressable>
  );
}

export default function PickDept() {
  const t = useT();
  const router = useRouter();
  // 한 번만 읽는다 — loungeShare.ts의 shareSource()와 같은 이유: 이 화면이 열려
  // 있는 동안 목록이 학습자의 엄지 아래에서 바뀌면 안 된다.
  const [offer] = useState(() => goalPickOffer());
  const depts = offer?.depts ?? [];
  const current = offer?.current ?? '';
  const inferred = !!offer?.inferred;

  const onPick = (dept: string) => {
    // journey.tsx의 pickDept()를 그대로 부른다(J5) — 요청 순서 카운터까지 그 함수
    // 안에 있다. 여기서는 부르고 돌아가는 것 이상을 하지 않는다.
    pickGoalDept(dept);
    router.back();
  };

  return (
    <NbSheet>
      <Stack.Screen options={PLACE_SCREEN} />
      <View style={{ paddingTop: TOP_INSET, paddingHorizontal: 20, paddingBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Pressable testID="pick-dept-back" onPress={() => router.back()} hitSlop={10}>
          <NbPaper rot={-1} style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}>
            <NbIcon name="chevronLeft" size={16} />
          </NbPaper>
        </Pressable>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text numberOfLines={1} style={nbText.hand(24)}>{t('journey.pickDeptTitle')}</Text>
          {/* inferred가 참이면 아직 학습자의 선택이 아니라 서버 추론이다 — 문구를
              권유형으로 바꾼다(§2). */}
          <Text numberOfLines={1} style={[nbText.body(12, nb.soft), { marginTop: 2 }]}>
            {t(inferred ? 'journey.pickDeptInferredHint' : 'journey.pickDeptHint')}
          </Text>
        </View>
      </View>

      {/* `flex: 1`이 핵심이다 — 없으면 ScrollView가 그냥 View처럼 콘텐츠 크기만큼
          자라 스스로 경계를 갖지 못하고, 29개 중 마지막 몇 개가 화면 아래로 잘려
          나간 채 스크롤할 방법이 없어진다(GoalDeptSheet.tsx가 겪은 것과 같은
          함정 — StationSheet.tsx의 같은 코멘트 참고). 여기서는 위의 헤더가 고정
          높이이고 이 ScrollView가 남은 화면을 전부 채우도록 스스로 경계를 갖는다. */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }}>
        {depts.length === 0 ? (
          // 건네받은 목록이 없을 때. 정상 경로(일터 탭 → 화살표)로는 오지 않지만, 딥링크로
          // 곧장 열리거나 앱이 되살아나며 이 라우트로 복원되면 실제로 여기에 온다 — 그때
          // 빈 화면을 내놓으면 학습자는 부서가 하나도 없다고 읽는다. 목록은 이 화면이
          // 만들지 않으므로(J9 — 서버가 준 것만 쓴다) 여기서 채울 방법은 없고, 있는 그대로
          // 말한 뒤 목록을 가진 화면으로 돌려보내는 것이 할 수 있는 전부다.
          <View style={{ paddingHorizontal: 20, paddingTop: 24, gap: 12 }}>
            <Text style={nbText.body(14, nb.soft)}>{t('journey.pickDeptEmpty')}</Text>
            <Pressable testID="pick-dept-empty-back" onPress={() => router.back()} hitSlop={8}>
              <NbPaper rot={-0.6} style={{ alignSelf: 'flex-start', paddingVertical: 8, paddingHorizontal: 14 }}>
                <Text style={nbText.hand(15)}>{t('journey.pickDeptEmptyBack')}</Text>
              </NbPaper>
            </Pressable>
          </View>
        ) : depts.map((dept) => (
          <DeptRow key={dept} dept={dept} current={dept === current} onPress={() => onPick(dept)} />
        ))}
      </ScrollView>
    </NbSheet>
  );
}
