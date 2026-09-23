// BinderShelf — 일터 탭 부서 서가 (journey-binder-v42 Task G, build-spec-index.md §6·§8).
// 시각 참조: inputs/design-handoff_v42/reference/forin-notebook-journey2.jsx의
// `BinderShelf()`(304~390행). 이 파일은 그 도안을 값 단위로 옮긴 것이다 — 바인더 78×118,
// 등 9px, 라벨 카드 left 16/right 6/top 8, 아이콘 top 52, 진행 바 bottom 9 높이 7,
// 숫자 bottom 18, 선반 높이 6에 #C9B99A, 줄 간격 16/26까지 참조의 값 그대로다.
// `react-native-svg`는 쓰지 않는다 — 전부 `View`의 테두리·배경으로 그린다.
//
// 이 화면이 하는 일: 목표 부서를 "책상에 펼쳐 둔 바인더"(맨 위 확장 카드)로, 나머지
// 부서 전부를 "책장에 꽂힌 바인더"(아래 서가, 한 줄 4개 + 선반)로 그린다.
//
// 참조에서 뺀 것 셋:
//  · `공통 필수` 카드 — 우리 코어 주제는 부서마다 따로 있어서(`core-safety-er`,
//    `core-safety-icu` …) "어느 바인더에서 해도 한 번만"이 거짓이 된다(스펙 X1).
//  · "읽던 곳" 파란 테이프 — 어느 부서를 마지막으로 열었는지 기억해야 하는데 이 화면도
//    앱 전체도 그 상태를 보관하지 않는다. 앱을 껐다 켜면 잊는 표식은 없는 것만 못하다.
//  · 부서 추천 메모 — 부서 사이에는 권장 순서가 없다.
//
// 참조에 없지만 둔 것 하나: `내 부서` 카드 아래의 "목표 바꾸기". 목표를 바꾸는 자리는
// 앱 전체에 하나뿐이어야 하는데(V2·J5) 이 화면이 그 유일한 입구다. `이어서`와 헷갈리지
// 않도록 채워진 버튼이 아니라 밑줄 친 작은 링크로 둔다.
//
// `entries`가 이미 목표 부서를 뺀 나머지 전부다 — 서버의 `freeRoam`은 목표를 빼고 온다.
// 그래서 목표 부서는 서가에 다시 그리지 않는다. 그래도 방어적으로 한 번 더 걸러 둔다.
import { useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { FreeRoamEntry } from '@/api/client';
import { NbIcon } from '@/components/nb/NbIcon';
import { NbButton, NbPaper, NbTag, nbText } from '@/components/nb/NbUI';
import { deptNbIcon, deptSpineColor } from '@/data/campus';
import type { BinderRect } from '@/data/journeyBinderFly';
import { nb, nbFonts } from '@/theme/nb';
import { type Translate, useT } from '@/i18n';
import type { JourneyCurriculum } from './JourneyMap';
import { measureBinderRect } from './measureBinderRect';

const ROW_SIZE = 4;
const ROW_GAP = 10;
/** 참조의 바인더는 78×118이다. 폭은 줄을 4등분해 정하고 높이는 그 비율을 지킨다 —
 *  기기 폭이 390이면 80×121로, 참조와 거의 같은 크기가 나온다. */
const BINDER_RATIO = 118 / 78;
const SPINE_W = 9;
/** 등을 뺀 라벨·아이콘·진행 바가 쓰는 안쪽 열. 참조의 `left:16, right:6`. */
const INNER_LEFT = 16;
const INNER_RIGHT = 6;
/** 책은 조금씩 삐뚤게 꽂힌다 — 참조의 네 각을 순환시킨다. */
const BINDER_TILT = [-1.5, 1, -0.5, 1.5];
/** 선반 널의 나뭇결 색(참조 `#C9B99A`). */
const SHELF_WOOD = '#C9B99A';
/** 목표 부서를 감싸는 호박색 테(참조의 `c.amber`). `nb.marker`는 형광펜 노랑이라 테로
 *  쓰면 번져 보인다. */
const GOAL_RING = '#C77E2E';
/** 아직 서가 컨테이너의 onLayout이 오기 전 첫 프레임에만 쓰는 자리표시 폭이다. */
const SHELF_WIDTH_FALLBACK = 335;
/** 목표 부서 카드의 주제 막대 — 한 줄에 이만큼 넣고 넘치면 접는다. 주제가 15~35개라
 *  참조처럼 한 줄에 전부 늘어놓으면 막대가 획보다 얇아진다(V5·V6). */
const SEG_PER_ROW = 12;

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

/** 주제 하나가 끝났는지 — 그 주제 자신의 done/total로 센다. total이 0인(아직 상황이
 *  없는) 주제를 완료로 잘못 세지 않는다. */
export function isTopicDone(c: JourneyCurriculum): boolean {
  return (c.total ?? 0) > 0 && (c.done ?? 0) >= (c.total ?? 0);
}

// ── 내 부서 — 책상에 펼쳐 둔 바인더 ──────────────────────────────────────────

/** 참조의 `주제 2/6 완료 · 지금 '중증 응대' 13/34` 한 줄. 진행 중인 주제가 없으면
 *  뒷부분을 지어내지 않고 앞부분만 낸다. */
function goalSubline(t: Translate, curricula: JourneyCurriculum[]): string {
  const done = curricula.filter(isTopicDone).length;
  const head = t('journey.goalTopics', { done, total: curricula.length });
  const cur = curricula.find((c) => c.resume);
  if (!cur) return head;
  return `${head} · ${t('journey.goalNow', {
    name: cur.name ?? cur.themeKey ?? '',
    done: cur.done ?? 0,
    total: cur.total ?? 0,
  })}`;
}

/** 주제 하나짜리 잉크 막대. 참조의 `height:7, border 1.2, radius 2, rotate ±.8`. */
function TopicSegment({ c, index }: { c: JourneyCurriculum; index: number }) {
  const total = c.total ?? 0;
  const done = c.done ?? 0;
  const pct = total > 0 ? Math.min(100, Math.max(0, (done / total) * 100)) : 0;
  return (
    <View
      testID="goal-topic-segment"
      style={{
        flex: 1, height: 7, borderWidth: 1.2, borderColor: nb.ink, borderRadius: 2,
        overflow: 'hidden', transform: [{ rotate: `${index % 2 ? 0.8 : -0.8}deg` }],
      }}
    >
      {pct > 0 && (
        <View style={{ width: `${pct}%`, height: '100%', backgroundColor: isTopicDone(c) ? nb.green : GOAL_RING }} />
      )}
    </View>
  );
}

function GoalDeptCard({ goalDept, goalCurricula, inferred, onOpen, onChangeGoal }: {
  goalDept: string;
  goalCurricula: JourneyCurriculum[];
  inferred?: boolean;
  onOpen(dept: string): void;
  onChangeGoal(): void;
}) {
  const t = useT();
  const spine = deptSpineColor(goalDept);
  const rows = chunk(goalCurricula, SEG_PER_ROW);

  return (
    <NbPaper
      testID="binder-shelf-goal-card"
      rot={-0.4}
      tape
      tapeLeft={130}
      style={{
        paddingHorizontal: 14, paddingVertical: 12,
        borderColor: GOAL_RING, borderWidth: 2,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        {/* 아이콘 액자 — 부서 색을 옅게 깐다(참조: rgba(199,81,70,.12)를 ER 색에서 뽑았다). */}
        <View style={{
          width: 44, height: 44, borderWidth: 1.6, borderColor: nb.ink,
          backgroundColor: `${spine}1F`, alignItems: 'center', justifyContent: 'center',
          transform: [{ rotate: '-3deg' }],
        }}>
          <NbIcon name={deptNbIcon(`SCN-${goalDept}-00001`)} size={26} />
        </View>

        <View style={{ flex: 1, minWidth: 0 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text numberOfLines={1} style={[nbText.hand(19), { flexShrink: 1 }]}>
              {t('journey.goalBinder', { dept: t(`dept.short.${goalDept}`) })}
            </Text>
            <NbTag color={GOAL_RING} rot={-2}>{t('journey.mineTag')}</NbTag>
            {/* 추론된 목표는 저장되지 않는다(J4) — 학습자가 고르기 전까지는 티를 낸다. */}
            {!!inferred && <NbTag color={nb.soft}>{t('journey.inferredTag')}</NbTag>}
          </View>
          <Text numberOfLines={1} style={[nbText.body(10.5, nb.soft), { marginTop: 2 }]}>
            {goalSubline(t, goalCurricula)}
          </Text>
        </View>

        <NbButton variant="ink" size="sm" iconRight="chevronRight" iconColor={nb.paper} onPress={() => onOpen(goalDept)}>
          {t('journey.resumeAction')}
        </NbButton>
      </View>

      {/* 주제 막대 — 주제 하나당 하나, 한 줄 12개씩 접는다. */}
      {rows.map((row, ri) => (
        <View key={ri} testID="goal-topic-row" style={{ flexDirection: 'row', gap: 4, marginTop: 10 }}>
          {row.map((c, i) => <TopicSegment key={c.themeKey || `${ri}-${i}`} c={c} index={ri * SEG_PER_ROW + i} />)}
        </View>
      ))}

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
    <View testID="binder-shelf-board" style={{ marginTop: 4 }}>
      <View style={{ height: 6, backgroundColor: SHELF_WOOD, borderWidth: 1.4, borderColor: nb.ink, borderRadius: 2 }} />
      {/* 참조의 `boxShadow: 0 4px 0` — RN에는 오프셋 그림자가 없어 널 아래 띠로 그린다. */}
      <View style={{ height: 4, backgroundColor: 'rgba(62,54,43,.12)', marginHorizontal: 1 }} />
    </View>
  );
}

function Binder({ entry, index, width, onOpen }: {
  entry: FreeRoamEntry;
  index: number;
  width: number;
  onOpen(dept: string, rect?: BinderRect): void;
}) {
  const t = useT();
  const dept = entry.dept ?? '';
  const passed = entry.passed ?? 0;
  const total = entry.total ?? 0;
  // 0으로 나누지 않는다 — total이 0이면 빈 바로 그린다.
  const pct = total > 0 ? Math.min(100, Math.max(0, (passed / total) * 100)) : 0;
  const spine = deptSpineColor(dept);
  const height = width * BINDER_RATIO;

  // 표지 날아오기 연출(journey-binder-v42 Task I)이 쓸 화면 좌표. **누를 때마다 다시
  // 잰다** — 서가가 스크롤되므로 마운트 때 잰 값은 아래쪽 줄에서 거짓이 된다
  // (`measureBinderRect.ts`의 주석). 좌표가 늦거나 안 오면 연출 없이 그냥 연다.
  const viewRef = useRef<View>(null);

  const onPress = () => {
    measureBinderRect(viewRef, (rect) => {
      // `rect`가 없을 때 `onOpen(dept, undefined)`로 부르지 않는다 — 두 번째 인자
      // 자체가 없는 호출과 "값이 undefined인 두 번째 인자"는 호출부(및 이 화면의
      // 테스트)에게 다른 신호다.
      if (rect) onOpen(dept, rect); else onOpen(dept);
    });
  };

  return (
    <Pressable
      ref={viewRef}
      testID={`binder-shelf-card-${dept}`}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={t(`dept.${dept}`)}
      style={{ width, height, transform: [{ rotate: `${BINDER_TILT[index % BINDER_TILT.length]}deg` }] }}
    >
      {/* 바인더 몸통 — 오른쪽 모서리만 더 둥글다(참조: 3px 6px 6px 3px). */}
      <View style={{
        position: 'absolute', left: 0, top: 0, right: 0, bottom: 0,
        backgroundColor: nb.paper, borderWidth: 1.6, borderColor: nb.ink,
        borderTopLeftRadius: 3, borderBottomLeftRadius: 3,
        borderTopRightRadius: 6, borderBottomRightRadius: 6,
      }} />
      {/* 색 등 */}
      <View testID="binder-spine" style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: SPINE_W,
        backgroundColor: spine, borderRightWidth: 1.4, borderRightColor: nb.ink,
        borderTopLeftRadius: 3, borderBottomLeftRadius: 3,
      }} />
      {/* 등 라벨 — 부서 코드와 이름 */}
      <View style={{
        position: 'absolute', left: INNER_LEFT, right: INNER_RIGHT, top: 8,
        backgroundColor: '#fff', borderWidth: 1, borderColor: nb.paperEdge,
        paddingTop: 4, paddingHorizontal: 4, paddingBottom: 3, alignItems: 'center',
      }}>
        <Text numberOfLines={1} style={{ fontFamily: nbFonts.monoBold, fontSize: 9, color: nb.ink, letterSpacing: 0.5 }}>
          {dept}
        </Text>
        <Text numberOfLines={1} style={[nbText.hand(11.5), { marginTop: 1 }]}>
          {t(`dept.short.${dept}`)}
        </Text>
      </View>
      {/* 부서 두들 */}
      <View style={{ position: 'absolute', left: INNER_LEFT, right: INNER_RIGHT, top: 52, alignItems: 'center' }}>
        <NbIcon name={deptNbIcon(`SCN-${dept}-00001`)} size={24} />
      </View>
      {/* 주제 진행 — 숫자가 위, 잉크 바가 아래(참조의 bottom 18 / bottom 9) */}
      <Text style={{
        position: 'absolute', left: INNER_LEFT, right: INNER_RIGHT, bottom: 18,
        textAlign: 'center', fontFamily: nbFonts.monoBold, fontSize: 8.5, color: nb.soft,
      }}>
        {`${passed}/${total}`}
      </Text>
      <View style={{
        position: 'absolute', left: INNER_LEFT, right: INNER_RIGHT, bottom: 9, height: 7,
        borderWidth: 1.2, borderColor: nb.ink, borderRadius: 2, overflow: 'hidden',
      }}>
        {pct > 0 && <View style={{ width: `${pct}%`, height: '100%', backgroundColor: spine }} />}
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
  /** `rect` is only ever handed up from a shelf binder (Task I) — the 내 부서 카드의
   *  이어서 button calls this with the department code alone, same as before. */
  onOpen(dept: string, rect?: BinderRect): void;
  onChangeGoal(): void;
}) {
  const t = useT();
  const [shelfWidth, setShelfWidth] = useState(SHELF_WIDTH_FALLBACK);

  const shelfEntries = entries.filter((e) => (e.dept ?? '') !== goalDept);
  const rows = chunk(shelfEntries, ROW_SIZE);
  const binderWidth = Math.max(40, (shelfWidth - ROW_GAP * (ROW_SIZE - 1)) / ROW_SIZE);

  return (
    <View testID="binder-shelf">
      {!!goalDept && (
        <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
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
        <Text style={[nbText.hand(16), { marginTop: 4 }]}>{t('journey.shelfHeading')}</Text>
        <Text style={[nbText.body(10.5, nb.soft), { marginTop: 2 }]}>{t('journey.shelfHint')}</Text>

        {/* 이 View 자신은 패딩이 없다 — onLayout이 재는 폭이 곧 바인더가 나눠 가질 폭이다. */}
        <View testID="binder-shelf-rows" onLayout={(e) => setShelfWidth(e.nativeEvent.layout.width)}>
          {rows.map((row, ri) => (
            <View key={ri} testID="binder-shelf-row" style={{ marginTop: ri ? 26 : 16 }}>
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
