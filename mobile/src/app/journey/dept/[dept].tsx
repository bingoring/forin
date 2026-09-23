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
import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { Stack, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { api, type JourneyView } from '@/api/client';
import { DeptBinder } from '@/components/journey/DeptBinder';
import { NbIcon } from '@/components/nb/NbIcon';
import { NbButton, NbPaper, NbSheet, nbText } from '@/components/nb/NbUI';
import { deptNbIcon } from '@/data/campus';
import { TOP_INSET, nb } from '@/theme/nb';
import { PLACE_SCREEN } from '@/theme/transitions';
import { useT } from '@/i18n';

export default function DeptBinderScreen() {
  const t = useT();
  const router = useRouter();
  const { dept } = useLocalSearchParams<{ dept: string }>();
  const [view, setView] = useState<JourneyView | null>(null);
  const [state, setState] = useState<'loading' | 'ok' | 'error'>('loading');

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

  const curricula = view?.track?.curricula ?? [];

  return (
    <NbSheet>
      <Stack.Screen options={PLACE_SCREEN} />
      <View style={{ paddingTop: TOP_INSET, paddingHorizontal: 20, paddingBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Pressable testID="dept-binder-back" onPress={() => router.back()} hitSlop={10}>
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
    </NbSheet>
  );
}
