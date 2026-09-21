// 탐험 모드 — 부서 인테리어(홈의 과별 출근 카드 → /interior/INT-<code>-00001)를 켜고 끌 수
// 있는 기기 로컬 설정. 인테리어는 지금 간호사 커리큘럼에만 있고 다른 직업군에 언제 붙을지
// 미정이라, 데모에서 껐다 켜 볼 수 있는 스위치가 필요해서 생겼다.
//
// 기기 로컬이다 — 마이그레이션도 서버 계약 변경도 없다. 기본값은 켬.
//
// 저장은 SecureStore로 한다: 값이 'on'/'off' 한 글자짜리 플래그라 새 의존성을 더할 이유가
// 없고, 이 앱은 이미 lib/onboardingDraft.ts·lib/gameScores.ts에서 같은 키체인 헬퍼로 기기
// 로컬 값을 다루고 있다. 값이 딱히 비밀도 아니라 SecureStore를 쓰는 이유는 보안이 아니라
// "이미 있는 헬퍼를 재사용한다"는 것뿐이다.
//
// 모듈 스코프 상태 + useSyncExternalStore로 구독한다(lib/wardPresence.ts와 같은 모양): 설정
// 탭에서 끄면 홈 탭이 다시 포커스되지 않고도 즉시 반영되어야 한다. 컴포넌트 렌더 중에 모듈
// 변수를 직접 읽기만 하면 React Compiler가 인스턴스당 한 번만 계산해 버려 이후 갱신을 못 잡는
// 다는 것이 이 브랜치의 서 있는 교훈이라, 반드시 useSyncExternalStore를 거쳐 읽는다.
//
// SecureStore는 비동기다: 켬/끔이 기기에 이미 저장돼 있어도 그 값은 첫 렌더 "이후"에야
// 도착한다. 그 사이 잠깐 기본값(켬)이 보이는 것은 받아들인다 — 데모용 스위치가 감수할
// 정도의 깜빡임이고, 계약(enabled/setEnabled)은 동기 버전과 같다.
import { useCallback, useEffect, useSyncExternalStore } from 'react';
import * as SecureStore from 'expo-secure-store';

const KEY = 'forin.exploreMode';

let enabled = true;
let hydrated = false;
let hydrating: Promise<void> | null = null;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function getSnapshot() {
  return enabled;
}

/** Reads the stored flag once per app run. Storage that throws (private mode, blocked
 *  data) leaves the in-memory default (on) standing — a screen must never fail to render
 *  because a preference could not be read. */
function hydrate(): Promise<void> {
  if (hydrating) return hydrating;
  hydrating = (async () => {
    try {
      const v = await SecureStore.getItemAsync(KEY);
      if (v != null) {
        enabled = v === '1';
        emit();
      }
    } catch {
      // blocked storage: keep the default
    } finally {
      hydrated = true;
    }
  })();
  return hydrating;
}

export type ExploreMode = { enabled: boolean; setEnabled: (v: boolean) => void };

export function useExploreMode(): ExploreMode {
  const value = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  useEffect(() => {
    if (!hydrated) void hydrate();
  }, []);

  const setEnabled = useCallback((v: boolean) => {
    enabled = v; // memory first — the switch must not wait on a write that may never land
    emit();
    SecureStore.setItemAsync(KEY, v ? '1' : '0').catch(() => {
      // blocked storage: this run keeps the change, the next launch reverts to the default
    });
  }, []);

  return { enabled: value, setEnabled };
}
