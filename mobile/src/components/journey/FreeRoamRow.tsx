// FreeRoamRow — 자유 탐방 칩 줄. 핸드오프 v41 08_JOURNEY_RESOURCES.md §3, frontend-components.md §2.
//
// 서버는 부서 이름을 보내지 않는다 — `FreeRoamEntry`는 `{dept, passed, total}`뿐이다
// (progress.md Ruling P3). 이름은 클라이언트가 이미 가진 `dept.<CODE>` 번역 라벨에서 오고,
// 아이콘도 같은 방식으로 고른다 — `deptNbIcon`을 콘텐츠 id 대신 순수 부서 코드로 부르는
// 선례는 이미 `campus.test.ts`(`deptNbIcon(\`SCN-${code}-00001\`)`)에 있다.
//
// 잠금 없음(J5): 칩은 문이지, 문의 예고가 아니다. 누르면 곧장 목표 부서가 바뀐다 — 미리보기와
// 확정을 나누면 학습자가 "지금 보는 게 내 목표인가"를 매번 판단해야 한다.
//
// 계약 유래 타입이라 `dept`·`passed`·`total` 모두 optional이다(Task 8 확정 사실) — 실제로는
// 항상 채워지지만 `?.`와 기본값을 건다.
import { Pressable, ScrollView, Text } from 'react-native';
import { NbIcon } from '@/components/nb/NbIcon';
import { NbPaper, nbText } from '@/components/nb/NbUI';
import { deptNbIcon } from '@/data/campus';
import { nb } from '@/theme/nb';
import { useT } from '@/i18n';
import type { FreeRoamEntry } from '@/api/client';

function FreeRoamChip({ entry, rot, onPress }: {
  entry: FreeRoamEntry;
  rot: number;
  onPress(): void;
}) {
  const t = useT();
  const dept = entry.dept ?? '';
  const passed = entry.passed ?? 0;
  return (
    <Pressable
      testID={`chip-${dept}`}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={t(`dept.${dept}`)}
    >
      <NbPaper rot={rot} style={{ flexDirection: 'row', alignItems: 'center', gap: 7, paddingVertical: 8, paddingHorizontal: 12 }}>
        <NbIcon name={deptNbIcon(`SCN-${dept}-00001`)} size={17} />
        <Text style={nbText.hand(14)}>{t(`dept.${dept}`)}</Text>
        {/* 도장은 통과한 정거장 수(=passed)다 — 시나리오 수(total)가 아니다. 0이면 아직
            가지 않은 곳이라 도장 자체를 그리지 않는다(핸드오프 데이터 모델의 `stamps`). */}
        {passed > 0 && <Text style={nbText.mono(9, nb.green)}>{passed}</Text>}
      </NbPaper>
    </Pressable>
  );
}

export function FreeRoamRow({ entries, onPick }: {
  entries: FreeRoamEntry[];
  onPick(dept: string): void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8, paddingHorizontal: 20 }}
    >
      {entries.map((entry, i) => (
        <FreeRoamChip
          key={entry.dept ?? i}
          entry={entry}
          rot={i % 2 ? 0.8 : -0.8}
          onPress={() => onPick(entry.dept ?? '')}
        />
      ))}
    </ScrollView>
  );
}
