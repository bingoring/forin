// 일터 탭 = 부서 서가(journey-binder-v42 Task G, build-spec-index.md §1·§6·§8). 이 화면은
// 더 이상 목표 부서의 주제 목록을 곧바로 그리지 않는다 — 그 목록(`DeptBinder`)은
// `journey/dept/[dept].tsx`(부서 간지)로 내려갔고, 이 화면은 그 앞에 낀 한 단이다:
// 목표 부서를 "책상에 펼쳐 둔 바인더"로, 나머지 29부서를 "책장에 꽂힌 바인더" 서가로
// 보여주는 것(`BinderShelf`)만 한다.
//
//     (tabs)/journey.tsx        = 부서 서가            ← 이 화면
//     journey/dept/[dept].tsx   = 부서 간지
//     journey/theme/[themeKey]  = 주제 화면
//     journey/pick-dept.tsx     = 목표 부서 바꾸기
//
// GET /me/journey 한 번이 이 화면이 여는 유일한 네트워크 호출이다(V3) — `goalDept` +
// `freeRoam[]`이 29부서 전부와 진행도를 이미 담으므로 부서마다 요청을 내지 않는다. 탭에
// 들어올 때마다 다시 부른다 — 진도는 다른 화면(부서 간지·퀴즈·시나리오)에서 움직일 수
// 있고, 목표 부서도 서버가 정본이라 화면은 아무것도 캐시하지 않는다.
//
// 상단 목표 부서 바(화살표 달린 헤더)와 자유 탐방 칩 줄(`FreeRoamRow`)은 뗐다(J5) —
// 목표 부서는 이제 `BinderShelf`의 `내 부서` 카드가 말하고, 목표를 바꾸는 동작도 그
// 카드 하나뿐이다. 헤더에는 화면 이름만 남는다.
import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { api, type JourneyView } from '@/api/client';
import { BinderShelf } from '@/components/journey/BinderShelf';
import { NbButton, nbText } from '@/components/nb/NbUI';
import { offerGoalPick } from '@/data/journeyGoalPick';
import { RULE_COLOR, RULE_H, TOP_INSET, nb } from '@/theme/nb';
import { useLocale, useT } from '@/i18n';

export default function JourneyScreen() {
  const t = useT();
  const router = useRouter();
  const locale = useLocale();
  const [view, setView] = useState<JourneyView | null>(null);
  const [state, setState] = useState<'loading' | 'ok' | 'error'>('loading');

  // 이어달리는 요청 중 마지막 것만 이긴다. `load()`와 `pickDept()`는 둘 다 이 하나의 카운터를
  // 나눠 쓴다 — pick-dept 화면에서 빠르게 두 번 고르면(또는 고른 직후 탭을 떠났다 돌아와
  // load()가 다시 불리면) 두 요청이 모두 날아가고, 응답은 "나중에 도착한 것"이 아니라
  // "나중에 시작한 것"이 이겨야 한다.
  //
  // 이 카운터가 막는 것은 거기까지다. `(tabs)/index.tsx`의 `alive` 플래그와 달리 언마운트
  // 이후를 따로 막지는 않는다 — 언마운트 직전에 시작된 마지막 요청은 자기 번호가 여전히
  // 최신이라 가드를 통과한다. 그 경우가 안전한 것은 React가 언마운트된 함수형 컴포넌트의
  // 상태 갱신을 조용히 무시하기 때문이지 이 카운터 덕이 아니다.
  const seqRef = useRef(0);

  const load = useCallback(() => {
    const seq = ++seqRef.current;
    setState('loading');
    api.journey()
      .then((v) => { if (seqRef.current !== seq) return; setView(v); setState('ok'); })
      .catch(() => { if (seqRef.current !== seq) return; setState('error'); });
  }, []);

  // 탭을 떠나면 버린다: 진도가 다른 화면에서 움직일 수 있다. 목표 부서도 캐시하지
  // 않는다 — 서버가 정본이라, 이 탭에 들어올 때마다 다시 받는다.
  useFocusEffect(useCallback(() => { load(); }, [load, locale]));

  // `pick-dept` 화면(및 그 화면을 여는 `내 부서` 카드의 `onChangeGoal`)이 부르는 그 하나의
  // 자리(J5) — 부서를 고르는 방법은 하나다. 미리보기 없이 곧장 저장하고, 그 응답으로 화면을
  // 다시 그린다(W3).
  const pickDept = (dept: string) => {
    if (!dept) return;
    const seq = ++seqRef.current;
    setState('loading');
    api.setGoalDept(dept)
      .then(() => api.journey())
      .then((v) => { if (seqRef.current !== seq) return; setView(v); setState('ok'); })
      .catch(() => { if (seqRef.current !== seq) return; setState('error'); });
  };

  // 바인더를 열면(목표 부서든 서가의 다른 부서든) 부서 간지로 민다 — 저장된 목표는
  // 건드리지 않는다(V2).
  const openDept = (dept: string) => {
    if (!dept) return;
    router.push(`/journey/dept/${dept}`);
  };

  // 아직 한 번도 데이터를 받은 적이 없을 때만 화면 전체를 비운다. 그 뒤로는 목록 자리
  // 하나만 로딩·오류로 좁힌다 — 헤더는 이미 그릴 것(화면 이름)이 있으므로 그대로 둔다.
  if (!view) {
    return (
      <Sheet>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 14 }}>
          {state === 'error' ? (
            <>
              <Text style={[nbText.hand(17), { textAlign: 'center' }]}>{t('journey.loadFailed')}</Text>
              <NbButton variant="ink" onPress={load} icon="pencil" iconColor={nb.paper}>
                {t('common.retry')}
              </NbButton>
            </>
          ) : (
            <ActivityIndicator color={nb.ink} />
          )}
        </View>
      </Sheet>
    );
  }

  const goalDept = view.goalDept ?? '';
  const curricula = view.track?.curricula ?? [];

  // 부서 목록은 새로 만들지 않는다 — `GET /me/journey`가 이미 전체를 담고 있다. `freeRoam`은
  // 목표 부서만 빼고 나머지 전부를 낸다(J9)이므로 이 둘을 합치면 그것이 곧 29개 부서 전체다.
  // 서버가 이미 목표를 뺀 채 보내지만, 방어적으로 한 번 더 걸러 중복을 막는다.
  const freeRoamDepts = (view.freeRoam ?? []).map((e) => e.dept).filter((d): d is string => !!d);

  const allDepts = goalDept ? [goalDept, ...freeRoamDepts.filter((d) => d !== goalDept)] : freeRoamDepts;

  // 머리줄의 두 숫자. 바인더 수는 `allDepts`가 이미 센 것과 같은 값이라 따로 세지
  // 않는다. 통과한 주제 수는 자유 탐방의 `passed`(주제 단위)와 목표 부서에서 끝난
  // 주제 수를 더한 것이다 — 자유 탐방이 상황 단위 숫자를 주지 않으므로 이 화면은
  // 우표(상황)가 아니라 주제를 센다. 갖고 있지 않은 숫자를 우표라고 부르지 않는다.
  const binderCount = allDepts.length;
  const passedTopics = (view.freeRoam ?? []).reduce((a, e) => a + (e.passed ?? 0), 0)
    + curricula.filter((c) => (c.total ?? 0) > 0 && (c.done ?? 0) >= (c.total ?? 0)).length;

  // 목표를 바꾸는 유일한 입구(V2) — `BinderShelf`의 `내 부서` 카드가 이 함수를 부른다.
  // 목록은 이 화면이 만들지 않고(allDepts) 넘기는 방법은 route param이 아니라 모듈
  // 스토어다(journeyGoalPick.ts) — 29개 부서 코드는 URL이 옮길 데이터가 아니다.
  const onChangeGoal = () => {
    offerGoalPick({ depts: allDepts, current: goalDept, inferred: !!view.inferred }, pickDept);
    router.push('/journey/pick-dept');
  };

  return (
    <Sheet>
      {/* 참조(v42 BinderShelf)의 머리 — 화면 이름은 왼쪽에 크게, 그 옆에 서가 규모를
          한 줄로. 개수는 응답에서 센다: 바인더 수는 목표 부서 + 자유 탐방이고, 우표는
          목표 부서의 완료 상황 수와 나머지 부서가 통과한 주제 수의 합이 아니라 —
          자유 탐방 항목이 주제 단위로만 오므로 — 목표 부서만 상황 단위로 셀 수 있다.
          그래서 두 번째 숫자는 '우표'가 아니라 통과한 주제 수다. 갖고 있지 않은 숫자를
          우표라고 부르지 않는다. */}
      <View style={{ flexDirection: 'row', alignItems: 'baseline', paddingHorizontal: 20, paddingTop: TOP_INSET, paddingBottom: 6 }}>
        <Text style={nbText.hand(28)}>{t('journey.shelfTitle')}</Text>
        <View style={{ flex: 1 }} />
        <Text testID="journey-shelf-summary" style={nbText.hand(13.5, nb.soft)}>
          {t('journey.shelfSummary', { binders: binderCount, topics: passedTopics })}
        </Text>
      </View>

      <View style={{ flex: 1 }}>
        {state === 'error' ? (
          // 이미 한 번 받은 화면이 다음 새로고침(재포커스·목표 변경)에서만 실패한 경우 —
          // 헤더는 그대로 두고, 서가 자리에서만 다시 시도를 권한다.
          <View testID="journey-shelf-error" style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 14 }}>
            <Text style={[nbText.hand(17), { textAlign: 'center' }]}>{t('journey.loadFailed')}</Text>
            <NbButton variant="ink" onPress={load} icon="pencil" iconColor={nb.paper}>
              {t('common.retry')}
            </NbButton>
          </View>
        ) : state === 'loading' ? (
          <View testID="journey-shelf-loading" style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator color={nb.ink} />
          </View>
        ) : (
          <ScrollView testID="journey-shelf-scroll" contentContainerStyle={{ paddingBottom: 24 }}>
            <BinderShelf
              goalDept={goalDept}
              goalCurricula={curricula}
              entries={view.freeRoam ?? []}
              inferred={!!view.inferred}
              onOpen={openDept}
              onChangeGoal={onChangeGoal}
            />
          </ScrollView>
        )}
      </View>
    </Sheet>
  );
}

/** The ruled page everything is written on — same convention as the other tabs
 *  (index.tsx, lounge.tsx each keep their own copy rather than share one). */
function Sheet({ children }: { children: React.ReactNode }) {
  const [h, setH] = useState(900);
  return (
    <View style={{ flex: 1, backgroundColor: nb.cream }} onLayout={(e) => setH(e.nativeEvent.layout.height)}>
      <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, overflow: 'hidden' }}>
        {Array.from({ length: Math.ceil(h / RULE_H) }).map((_, i) => (
          <View key={i} style={{ position: 'absolute', left: 0, right: 0, top: (i + 1) * RULE_H, height: 1, backgroundColor: RULE_COLOR }} />
        ))}
      </View>
      {children}
    </View>
  );
}
