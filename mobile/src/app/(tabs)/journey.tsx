// 일터 탭 = 여정 목록(P3-C, curriculum-v3-journey-ia/build-spec-index.md). 장소→부서→
// 시나리오였던 옛 탐험 모드의 깊이를 부서→주제→시나리오로 바꾼 자리이되, 이 화면 자체는
// 이제 지도를 그리지 않는다 — 부서 코어/부서 심화 두 묶음의 주제 목록이다(§5). 주제
// 사이를 잇는 길은 여기서 그리지 않는다(K1); 그 은유는 주제 안(2단계, `/journey/theme`
// 라우트)으로 내려갔다 — 난이도 계단이 실제로 잠기는 곳은 그쪽이다(§1).
//
// GET /me/journey 한 번이 이 화면이 여는 유일한 네트워크 호출이다(business-logic-model.md
// W1). 탭에 들어올 때마다 다시 부른다 — 진도는 다른 화면(인테리어·퀴즈)에서 움직일 수 있고,
// 목표 부서도 서버가 정본이라 화면은 아무것도 캐시하지 않는다.
import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { api, type JourneyView } from '@/api/client';
import { FreeRoamRow } from '@/components/journey/FreeRoamRow';
import { ThemeList } from '@/components/journey/ThemeList';
import { NbIcon } from '@/components/nb/NbIcon';
import { NbButton, NbTag, nbText } from '@/components/nb/NbUI';
import { deptNbIcon } from '@/data/campus';
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
  // 나눠 쓴다 — 자유 탐방 칩을 빠르게 두 번 누르면(또는 칩을 누른 직후 탭을 떠났다 돌아와
  // load()가 다시 불리면) 두 요청이 모두 날아가고, 응답은 "나중에 도착한 것"이 아니라
  // "나중에 시작한 것"이 이겨야 한다 — 안 그러면 방금 고른 부서가 아니라 그 전 부서의 응답이
  // 늦게 도착해 화면을 덮어쓸 수 있다.
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

  // 자유 탐방 칩과 상단 부서 표시는 같은 경로를 쓴다(J5) — 부서를 고르는 방법은 하나다.
  // 미리보기 없이 곧장 저장하고, 그 응답으로 경로를 다시 그린다(W3).
  const pickDept = (dept: string) => {
    if (!dept) return;
    const seq = ++seqRef.current;
    setState('loading');
    api.setGoalDept(dept)
      .then(() => api.journey())
      .then((v) => { if (seqRef.current !== seq) return; setView(v); setState('ok'); })
      .catch(() => { if (seqRef.current !== seq) return; setState('error'); });
  };

  // 카드를 누르면 2단계(주제 화면)로 민다. 2단계 화면은 이 태스크가 만들지 않는다 —
  // 여기서는 이동만 한다. 경로 모양은 이 저장소의 다른 동적 라우트(`/scenario/[id]`,
  // `/quiz/[id]`, `/interior/[id]`)와 같은 관례를 따르되, `/journey/pick-dept.tsx`가 이미
  // `journey/` 아래 화면을 두고 있으므로 그 아래 한 단을 더 두었다.
  const openTheme = (themeKey: string) => {
    if (!themeKey) return;
    router.push(`/journey/theme/${themeKey}`);
  };

  // 아직 한 번도 데이터를 받은 적이 없을 때만 화면 전체를 비운다 — 보여줄 목표 부서도
  // 자유 탐방 목록도 아직 없다. 그 뒤로는(§4) 로딩·오류를 지도 자리 하나로만 좁힌다: 목표
  // 부서 헤더와 자유 탐방 칩 줄은 이미 그릴 것이 있으므로 그대로 둔다 — 특히 `pickDept` 중에
  // 방금 누른 칩 줄까지 화면에서 사라지면 탭이 씹힌 것처럼 읽힌다.
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

  // 부서 목록은 새로 만들지 않는다(Task 18) — `GET /me/journey`가 이미 전체를 담고 있다.
  // `freeRoam`은 목표 부서만 빼고 나머지 전부를 층 조건 없이 낸다(Task 17, J9 개정)이므로
  // 이 둘을 합치면 그것이 곧 29개 부서 전체다. 서버가 이미 목표를 뺀 채 보내지만, 방어적으로
  // 한 번 더 걸러 중복을 막는다 — "새 목록을 만들지 마라"는 배열을 손으로 쓰지 말라는
  // 뜻이지, 합칠 때 중복을 허용하라는 뜻은 아니다.
  const freeRoamDepts = (view.freeRoam ?? []).map((e) => e.dept).filter((d): d is string => !!d);
  const allDepts = goalDept ? [goalDept, ...freeRoamDepts.filter((d) => d !== goalDept)] : freeRoamDepts;

  return (
    <Sheet>
      {!!goalDept && (
        <Pressable
          testID="journey-goal-dept-press"
          // 부서 고르기는 바텀시트가 아니라 밀려 들어오는 화면이다(2026-09-21 개정,
          // frontend-components.md GoalDeptBar 절) — 오른쪽 화살표가 "다른 화면으로
          // 간다"고 말하는데 시트가 올라오면 신호와 결과가 어긋났고, 부서 29개는 시트
          // 높이로 끝까지 보여줄 수 없었다(실기에서 마지막 두 부서가 잘렸다). 목록은
          // 새로 만들지 않고(J9) 이미 계산해 둔 allDepts를 화면으로 넘긴다 — 넘기는
          // 방법이 route param이 아니라 모듈 스토어인 이유는 journeyGoalPick.ts에.
          onPress={() => {
            offerGoalPick({ depts: allDepts, current: goalDept, inferred: !!view.inferred }, pickDept);
            router.push('/journey/pick-dept');
          }}
          accessibilityRole="button"
          accessibilityLabel={t('journey.pickDeptTitle')}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 20, paddingTop: TOP_INSET, paddingBottom: 6 }}>
            <NbIcon name={deptNbIcon(`SCN-${goalDept}-00001`)} size={22} />
            <Text testID="journey-goal-dept" numberOfLines={1} style={[nbText.hand(24), { flex: 1 }]}>{t(`dept.${goalDept}`)}</Text>
            {/* 추론된 목표는 저장되지 않는다(J4) — 학습자가 고르기 전까지는 그렇다는 티를 낸다. */}
            {!!view.inferred && <NbTag color={nb.soft}>{t('journey.inferredTag')}</NbTag>}
            <NbIcon name="chevronRight" size={16} />
          </View>
        </Pressable>
      )}

      <View style={{ flex: 1 }}>
        {state === 'error' ? (
          // 이미 한 번 받은 화면이 다음 새로고침(재포커스·목표 변경)에서만 실패한 경우 —
          // 헤더·칩은 지난번에 받은 값 그대로 두고, 목록 자리에서만 다시 시도를 권한다.
          <View testID="journey-topics-error" style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 14 }}>
            <Text style={[nbText.hand(17), { textAlign: 'center' }]}>{t('journey.loadFailed')}</Text>
            <NbButton variant="ink" onPress={load} icon="pencil" iconColor={nb.paper}>
              {t('common.retry')}
            </NbButton>
          </View>
        ) : state === 'loading' ? (
          // 목록 자리에 스켈레톤, 나머지는 비워 두지 않는다(§4와 같은 원칙) — 방금 고른
          // 목표 부서를 새로 그리는 동안에도 화면 전체가 아니라 이 자리만 비어 보인다.
          <View testID="journey-topics-loading" style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator color={nb.ink} />
          </View>
        ) : (
          // K1: 여기서는 길을 그리지 않는다 — 주제 사이를 잇는 선·화살표·순번이 없는
          // 목록이다. `ThemeList`가 부서 코어/부서 심화 두 묶음으로 나눠 그린다(K3).
          <ScrollView testID="journey-topics-scroll" contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}>
            <ThemeList curricula={curricula} onPress={openTheme} />
          </ScrollView>
        )}
      </View>

      <View style={{ paddingVertical: 10 }}>
        <FreeRoamRow entries={view.freeRoam ?? []} onPick={pickDept} />
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
