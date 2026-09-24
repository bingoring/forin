// 부서 간지 — 서가((tabs)/journey.tsx)에서 바인더를 열면 오는 화면
// (journey-binder-v42 Task G, build-spec-index.md §5·§8). 서가와 주제 화면
// (journey/theme/[themeKey].tsx) 사이에 낀 가운데 단이다.
//
//     (tabs)/journey.tsx        = 부서 서가
//     journey/dept/[dept].tsx   = 부서 간지            ← 이 화면
//     journey/theme/[themeKey]  = 주제 화면
//
// `GET /me/journey?dept=<코드>`를 이 화면이 포커스를 얻을 때마다 한 번 부른다(V4) —
// `useFocusEffect`를 쓰는 이유는 journey.tsx와 같다: 주제 화면에서 진도가 움직인 뒤
// 뒤로 돌아오면 그 진도가 갱신되어 보여야 한다. **저장된 목표(`goalDept`)는 이 화면이
// 건드리지 않는다** — `api.journey(dept)`는 보기만 할 뿐 목표를 바꾸지 않는다(V2).
//
// `view.goalDept`는 화면에 쓰지 않는다(과제 지시서) — 이 화면은 지금 보고 있는 부서만
// 말한다. "이 부서가 내 목표다"라는 표식은 서가의 `내 부서` 카드에만 있다.
//
// 서버가 400을 주면(저작된 주제가 없는 부서 코드) 빈 바인더를 지어내지 않는다 — 오류
// 상태를 보여주고, 헤더의 뒤로 가기가 서가로 돌아갈 길이다.
//
// 핸드오프 v43(journey-binder-v42 Task I) — 서가에서 바인더를 눌러 왔다면, 이 화면은
// 그 바인더가 눌린 자리에서 날아와 표지가 펼쳐지는 연출로 시작하고, 뒤로 갈 때는
// 거꾸로 닫힌다. 데이터 요청(`load`)은 그 연출과 무관하게 이 화면이 서는 즉시
// 나간다(§2 point 4) — 표지가 날아오고 펼쳐지는 동안 응답이 오는 것이 의도다.
//
// Task J(journey-binder-v42, task-J-brief.md) — 표지가 닫힌 뒤 날아 돌아가는 마지막
// 단계(⑤)는 더 이상 이 화면이 쥐지 않는다. 이 화면은 `requestClose`로 닫기(④)만
// 시작하고, `useBinderCoverFlight`의 `onCoverClosed`가 ④가 끝나는 그 자리에서
// `journeyBinderExit`에 표지를 넘기고 곧바로 이 화면을 뜬다(`goBackToShelf`) — ⑤는
// `BinderExitOverlay`(journey/_layout.tsx)가 이 화면이 사라진 뒤에도 이어서 그린다.
import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Pressable, ScrollView, Text, View } from 'react-native';
import { Stack, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { api, type JourneyView } from '@/api/client';
import { isTopicDone } from '@/components/journey/BinderShelf';
import { BinderCoverFace } from '@/components/journey/BinderCoverFace';
import { DeptBinder } from '@/components/journey/DeptBinder';
import { CLOSE_CURL_MS, useBinderCoverFlight } from '@/components/journey/useBinderCoverFlight';
import { NbIcon } from '@/components/nb/NbIcon';
import { NbButton, NbPaper, NbSheet, nbText } from '@/components/nb/NbUI';
import { PageCurl } from '@/components/nb/PageCurl';
import { deptNbIcon } from '@/data/campus';
import { goBackToShelf } from '@/data/journeyBack';
import { TOP_INSET, nb } from '@/theme/nb';
import { FLOWN_SCREEN, PLACE_SCREEN } from '@/theme/transitions';
import { useT } from '@/i18n';

export default function DeptBinderScreen() {
  const t = useT();
  const router = useRouter();
  const { dept } = useLocalSearchParams<{ dept: string }>();
  const [view, setView] = useState<JourneyView | null>(null);
  const [state, setState] = useState<'loading' | 'ok' | 'error'>('loading');

  const curricula = view?.track?.curricula ?? [];
  // 표지의 진행 바가 쓸 숫자(§3) — 서가와 같은 "주제 완료" 셈법(BinderShelf.tsx의
  // isTopicDone), 서가의 passed/total이 아니다(이 화면은 그 값을 받지 않는다 —
  // BinderCoverFace.tsx 주석 참고). 데이터가 아직 안 왔으면 0/0 — 빈 바다.
  const coverDone = curricula.filter(isTopicDone).length;
  const coverTotal = curricula.length;

  // 뒤로 가는 유일한 실제 동작 — ④(닫기)가 끝나면 곧바로 부른다(⑤를 기다리지
  // 않는다 — task-J-brief.md). 돌아갈 화면이 없으면(딥링크로 곧장 들어온 경우)
  // 서가로 보낸다(`goBackToShelf`). 기기 뒤로 가기(안드로이드 하드웨어
  // 버튼·스와이프)는 이 훅을 아예 거치지 않는다(§6) — 그 경로는 항상 기본 라우팅
  // 그대로다. 이 화면의 `Stack.Screen`을 `FLOWN_SCREEN`(전환 없음)으로 두는 것이 그
  // 경로에서도 이중 모션이 생기지 않게 한다.
  const { owningArrival, hasCover, phase, flightTransform, scrim, requestClose, onCoverOpened, onCoverClosed } =
    useBinderCoverFlight(dept ?? '', () => goBackToShelf(router), { doneTopics: coverDone, totalTopics: coverTotal });

  // journey.tsx의 seqRef·load()와 같은 이유의 요청 순서 보호 — 재시도 버튼과 포커스
  // 재진입이 겹쳐도 "나중에 시작한 것"이 이긴다.
  const seqRef = useRef(0);
  const load = useCallback(() => {
    if (!dept) return;
    const seq = ++seqRef.current;
    setState('loading');
    api.journey(dept)
      .then((v) => { if (seqRef.current !== seq) return; setView(v); setState('ok'); })
      .catch(() => { if (seqRef.current !== seq) return; setState('error'); });
  }, [dept]);

  // 탭에서 하듯(V4의 "간지는 요청 한 번"은 한 번 여는 순간의 얘기다) 포커스를 다시
  // 얻을 때마다 새로 받는다 — 주제 화면을 다녀온 뒤 진도가 여기 반영되어야 한다.
  useFocusEffect(useCallback(() => { load(); }, [load]));

  const openTheme = (themeKey: string) => {
    if (!themeKey) return;
    router.push(`/journey/theme/${themeKey}`);
  };

  const coverFace = <BinderCoverFace dept={dept ?? ''} doneTopics={coverDone} totalTopics={coverTotal} />;

  return (
    <NbSheet>
      {/* 이 화면이 자기 도착 연출을 쥐고 있는 동안에만 기본 밀기를 끈다. 서가를 거치지
          않고 들어오면(딥링크, 측정이 안 닿은 경우) 평소의 밀기가 그대로 있어야 하고,
          도착이 끝난 뒤에도 꺼 두면 왼쪽 가장자리 스와이프로 뒤로 가는 동작이 죽는다
          (useBinderCoverFlight의 `owningArrival` 주석). */}
      <Stack.Screen options={owningArrival ? FLOWN_SCREEN : PLACE_SCREEN} />
      <View style={{ paddingTop: TOP_INSET, paddingHorizontal: 20, paddingBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Pressable testID="dept-binder-back" onPress={requestClose} hitSlop={10}>
          <NbPaper rot={-1} style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}>
            <NbIcon name="chevronLeft" size={16} />
          </NbPaper>
        </Pressable>
        <NbIcon name={deptNbIcon(`SCN-${dept}-00001`)} size={22} />
        <Text testID="dept-binder-title" numberOfLines={1} style={[nbText.hand(22), { flex: 1 }]}>
          {t(`dept.${dept}`)}
        </Text>
      </View>

      {state === 'error' ? (
        <View testID="dept-binder-error" style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 14 }}>
          <Text style={[nbText.hand(17), { textAlign: 'center' }]}>{t('journey.loadFailed')}</Text>
          <NbButton variant="ink" onPress={load} icon="pencil" iconColor={nb.paper}>
            {t('common.retry')}
          </NbButton>
        </View>
      ) : state === 'loading' ? (
        <View testID="dept-binder-loading" style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={nb.ink} />
        </View>
      ) : (
        <ScrollView testID="dept-binder-scroll" contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}>
          <DeptBinder curricula={curricula} onPress={openTheme} />
        </ScrollView>
      )}

      {/* 표지 레이어(§3) — 스토어에 좌표가 있고 모션 줄이기가 꺼져 있을 때만 선다
          (useBinderCoverFlight가 그 둘을 이미 걸렀다: hasCover는 phase가 'settled'를
          벗어난 동안만 참이다). */}
      {hasCover && (
        <>
          {phase === 'entering' && (
            <Animated.View
              testID="binder-cover-scrim"
              pointerEvents="none"
              style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, zIndex: 11, backgroundColor: nb.ink, opacity: scrim }}
            />
          )}

          {phase === 'entering' && (
            <Animated.View
              testID="binder-cover-flight"
              pointerEvents="none"
              style={{
                position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, zIndex: 12,
                shadowColor: nb.ink, shadowOpacity: 0.35, shadowRadius: 24,
                shadowOffset: { width: 0, height: 12 }, elevation: 16,
                transform: flightTransform,
              }}
            >
              {coverFace}
            </Animated.View>
          )}

          {phase === 'opening' && (
            <PageCurl dir="out" onDone={onCoverOpened}>{coverFace}</PageCurl>
          )}
          {phase === 'closing' && (
            <PageCurl dir="in" durationMs={CLOSE_CURL_MS} onDone={onCoverClosed}>{coverFace}</PageCurl>
          )}
        </>
      )}
    </NbSheet>
  );
}
