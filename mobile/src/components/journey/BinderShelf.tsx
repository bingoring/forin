// BinderShelf — 일터 탭 부서 서가 (journey-binder-v42 Task G, build-spec-index.md §6·§8).
// 시각 참조: inputs/design-handoff_v42/reference/forin-notebook-journey2.jsx의
// `BinderShelf()`(304~390행) — 그 코드는 웹 프로토타입이라 옮겨 적지 않고 모양만 가져온다.
// `react-native-svg`는 쓰지 않는다(제약) — 전부 `View`의 테두리·배경으로 그린다.
//
// 이 화면이 하는 일: 목표 부서를 "책상에 펼쳐 둔 바인더"(맨 위 확장 카드)로, 나머지
// 부서 전부를 "책장에 꽂힌 바인더"(아래 서가, 한 줄 4개 + 선반)로 그린다.
//
// 참조 코드에서 뺀 것 셋(과제 지시서 §2-3, 스펙 X1):
//  · `공통 필수` 카드 — 우리 코어 주제는 부서마다 따로 있어서(`core-safety-er`,
//    `core-safety-icu` …) "어느 바인더에서 해도 한 번만"이 거짓이 된다. 공통 코어가
//    콘텐츠에 생기면 그때 넣는다.
//  · "마지막으로 보던 부서" 테이프 표식 — 어느 부서를 마지막으로 열었는지 기억해야
//    하는데 이 화면도 앱 전체도 그 상태를 보관하지 않는다. 앱을 껐다 켜면 잊는 표식은
//    없는 것만 못하다.
//  · 추천 순서 메모 — 부서 사이에는 권장 순서가 없다.
//
// `entries`가 이미 목표 부서를 뺀 나머지 전부다(V2 — 서버의 `freeRoam`은 목표를 빼고
// 온다). 그래서 목표 부서는 서가에 다시 그리지 않는다 — `내 부서` 카드 하나로 충분하고,
// 그대로 그리면 중복도 생기지 않는다. 그래도 journey.tsx가 `freeRoamDepts`를 합칠 때
// 쓰는 것과 같은 이유로 한 번 더 방어적으로 걸러 둔다: "새 목록을 만들지 마라"는 배열을
// 손으로 쓰지 말라는 뜻이지, 중복을 허용하라는 뜻은 아니다.
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { FreeRoamEntry } from '@/api/client';
import { NbIcon } from '@/components/nb/NbIcon';
import { NbButton, NbPaper, NbProgScale, NbTag, nbText } from '@/components/nb/NbUI';
import { deptNbIcon } from '@/data/campus';
import { nb } from '@/theme/nb';
import { useT } from '@/i18n';
import type { JourneyCurriculum } from './JourneyMap';

const ROW_SIZE = 4;
const ROW_GAP = 10;
const BINDER_H = 112;
const SPINE_W = 9;
const BAR_H = 5;
// 아직 서가 컨테이너의 onLayout이 한 번도 오지 않았을 때만 쓰는 자리표시 폭이다 — 화면
// 폭에서 여백을 빼는 상수가 아니라(과제 지시서가 막는 바로 그것), 실제 폭을 재기 전
// 첫 프레임에 칸이 찌그러지지 않게 하는 값일 뿐이다. DeptBinder.tsx의 `listHeight`
// 기본값(900)과 같은 종류의 자리표시다.
const SHELF_WIDTH_FALLBACK = 335;

const SHELF_COLORS = [nb.green, nb.blue, nb.red, nb.marker];

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

// ── 내 부서 — 책상에 펼쳐 둔 바인더 ──────────────────────────────────────────

function GoalDeptCard({ goalDept, goalCurricula, inferred, onOpen, onChangeGoal }: {
  goalDept: string;
  goalCurricula: JourneyCurriculum[];
  inferred?: boolean;
  onOpen(dept: string): void;
  onChangeGoal(): void;
}) {
  const t = useT();
  // 고정 개수 진행도(과제 지시서) — 상황이 아니라 "완료한 주제 수 / 전체 주제 수"다.
  // 주제 하나가 완료로 세는 조건은 그 주제 자신의 done/total이지, 서버가 이미 계산해
  // 보내는 요약 숫자가 아니다 — 그래야 total이 0인(아직 상황이 없는) 주제를 완료로
  // 잘못 세지 않는다.
  const total = goalCurricula.length;
  const done = goalCurricula.filter((c) => (c.total ?? 0) > 0 && (c.done ?? 0) >= (c.total ?? 0)).length;

  return (
    <NbPaper testID="binder-shelf-goal-card" rot={-0.4} tape tapeLeft={130} style={{ padding: 14 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <NbPaper rot={-3} style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
          <NbIcon name={deptNbIcon(`SCN-${goalDept}-00001`)} size={24} />
        </NbPaper>
        <View style={{ flex: 1, minWidth: 0 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text numberOfLines={1} style={[nbText.hand(19), { flexShrink: 1 }]}>
              {t(`dept.${goalDept}`)}
            </Text>
            {/* 추론된 목표는 저장되지 않는다(J4) — 학습자가 고르기 전까지는 그렇다는 티를 낸다. */}
            {!!inferred && <NbTag color={nb.soft}>{t('journey.inferredTag')}</NbTag>}
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 }}>
            <NbProgScale done={done} total={total} />
            <Text style={nbText.mono(10, nb.soft)}>{`${done}/${total}`}</Text>
          </View>
        </View>
        <NbButton variant="ink" size="sm" onPress={() => onOpen(goalDept)}>
          {t('journey.resumeAction')}
        </NbButton>
      </View>
      {/* 목표를 바꾸는 유일한 자리(V2) — `이어서`와 뚜렷이 구분되도록 채워진 버튼이
          아니라 밑줄 친 텍스트 링크로 둔다. */}
      <Pressable
        testID="binder-shelf-change-goal"
        onPress={onChangeGoal}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={t('journey.changeGoal')}
        style={{ alignSelf: 'flex-start', marginTop: 10 }}
      >
        <Text style={[nbText.body(12, nb.blue), { textDecorationLine: 'underline' }]}>
          {t('journey.changeGoal')}
        </Text>
      </Pressable>
    </NbPaper>
  );
}

// ── 서가 — 책장에 꽂힌 바인더 ────────────────────────────────────────────────

function ShelfBoard() {
  return (
    <View testID="binder-shelf-board" style={{ marginTop: 6 }}>
      <View style={{ height: 2, backgroundColor: nb.ink, borderRadius: 1 }} />
      <View style={{ height: 3, backgroundColor: 'rgba(62,54,43,.15)', marginTop: 2 }} />
    </View>
  );
}

function Binder({ entry, index, width, onOpen }: {
  entry: FreeRoamEntry;
  index: number;
  width: number;
  onOpen(dept: string): void;
}) {
  const t = useT();
  const dept = entry.dept ?? '';
  const passed = entry.passed ?? 0;
  const total = entry.total ?? 0;
  // 0으로 나누지 않는다 — total이 0이면 빈 바로 그린다.
  const pct = total > 0 ? Math.min(100, Math.max(0, (passed / total) * 100)) : 0;
  const color = SHELF_COLORS[index % SHELF_COLORS.length];

  return (
    <Pressable
      testID={`binder-shelf-card-${dept}`}
      onPress={() => onOpen(dept)}
      accessibilityRole="button"
      accessibilityLabel={t(`dept.${dept}`)}
      style={{ width, height: BINDER_H }}
    >
      <View style={{ flex: 1, borderWidth: 1.6, borderColor: nb.ink, borderRadius: 4, backgroundColor: nb.paper, overflow: 'hidden' }}>
        {/* 색 등 — 부서 순서로 순환한다(내 부서 카드를 뺀 화면 전체 인덱스). */}
        <View style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: SPINE_W, backgroundColor: color, borderRightWidth: 1.4, borderRightColor: nb.ink }} />
        <View style={{ flex: 1, paddingLeft: SPINE_W + 6, paddingRight: 6, paddingTop: 9, alignItems: 'center' }}>
          <NbIcon name={deptNbIcon(`SCN-${dept}-00001`)} size={22} />
          <Text numberOfLines={2} style={[nbText.hand(12), { marginTop: 4, textAlign: 'center' }]}>
            {t(`dept.${dept}`)}
          </Text>
        </View>
        {/* 바닥 잉크 진행 바 — 그 아래에 done/total. */}
        <View style={{ position: 'absolute', left: SPINE_W + 6, right: 6, bottom: 17, height: BAR_H, borderWidth: 1.2, borderColor: nb.ink, borderRadius: 2, overflow: 'hidden' }}>
          {pct > 0 && (
            <View style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${pct}%`, backgroundColor: color }} />
          )}
        </View>
        <Text style={[nbText.mono(9, nb.soft), { position: 'absolute', left: SPINE_W + 6, right: 6, bottom: 5, textAlign: 'center' }]}>
          {`${passed}/${total}`}
        </Text>
      </View>
    </Pressable>
  );
}

// ── 조립 ─────────────────────────────────────────────────────────────────

export function BinderShelf({ goalDept, goalCurricula, entries, inferred, onOpen, onChangeGoal }: {
  goalDept: string;
  goalCurricula: JourneyCurriculum[];
  entries: FreeRoamEntry[];
  inferred?: boolean;
  onOpen(dept: string): void;
  onChangeGoal(): void;
}) {
  const [shelfWidth, setShelfWidth] = useState(SHELF_WIDTH_FALLBACK);

  // 방어적 중복 제거 — 위 파일 코멘트 참고.
  const shelfEntries = entries.filter((e) => (e.dept ?? '') !== goalDept);
  const rows = chunk(shelfEntries, ROW_SIZE);
  const binderWidth = Math.max(40, (shelfWidth - ROW_GAP * (ROW_SIZE - 1)) / ROW_SIZE);

  return (
    <View testID="binder-shelf">
      {!!goalDept && (
        <View style={{ paddingHorizontal: 20, marginBottom: 18 }}>
          <GoalDeptCard
            goalDept={goalDept}
            goalCurricula={goalCurricula}
            inferred={inferred}
            onOpen={onOpen}
            onChangeGoal={onChangeGoal}
          />
        </View>
      )}

      <View style={{ paddingHorizontal: 20 }}>
        {/* 이 View 자신은 패딩이 없다 — onLayout이 재는 폭이 곧 바인더가 실제로 나눠
            가질 폭이라서, 화면 폭에서 여백 상수를 따로 빼지 않아도 된다. */}
        <View testID="binder-shelf-rows" onLayout={(e) => setShelfWidth(e.nativeEvent.layout.width)}>
          {rows.map((row, ri) => (
            <View key={ri} testID="binder-shelf-row" style={{ marginTop: ri ? 20 : 0 }}>
              <View style={{ flexDirection: 'row', gap: ROW_GAP, alignItems: 'flex-end' }}>
                {row.map((entry, i) => (
                  <Binder
                    key={entry.dept ?? `${ri}-${i}`}
                    entry={entry}
                    index={ri * ROW_SIZE + i}
                    width={binderWidth}
                    onOpen={onOpen}
                  />
                ))}
              </View>
              <ShelfBoard />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
