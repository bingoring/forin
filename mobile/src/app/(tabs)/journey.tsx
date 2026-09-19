// 일터 탭 = 여정 지도. 장소→부서→시나리오였던 옛 탐험 모드의 깊이를 부서→주제→시나리오로
// 바꾼다. 두 깊이 구조가 공존할 이유가 없었다 — 같은 콘텐츠에 이르는 길이 두 갈래였다.
//
// GET /me/journey 한 번이 이 화면이 여는 유일한 네트워크 호출이다(business-logic-model.md
// W1). 탭에 들어올 때마다 다시 부른다 — 진도는 다른 화면(인테리어·퀴즈)에서 움직일 수 있고,
// 목표 부서도 서버가 정본이라 화면은 아무것도 캐시하지 않는다.
import { useCallback, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { api, type JourneyStep, type JourneyView } from '@/api/client';
import { CurrentStationBar } from '@/components/journey/CurrentStationBar';
import { FreeRoamRow } from '@/components/journey/FreeRoamRow';
import { JourneyMap, type JourneyCurriculum } from '@/components/journey/JourneyMap';
import { StationSheet } from '@/components/journey/StationSheet';
import { NbIcon } from '@/components/nb/NbIcon';
import { NbButton, NbTag, nbText } from '@/components/nb/NbUI';
import { deptNbIcon } from '@/data/campus';
import { RULE_COLOR, RULE_H, TOP_INSET, nb } from '@/theme/nb';
import { useLocale, useT } from '@/i18n';

/**
 * The one entry the server flagged as the global resume target, RESCOPED into this
 * track (business-logic-model.md A2 — `rescopeCurrent`). Server-side, `resume` is set
 * on at most one curriculum in the whole track: on the `here` one if the global resume
 * point already lands inside this track, otherwise on the first non-passed one as a
 * substitute so the bar always has somewhere to point (J6). Nothing is invented here —
 * both the entry and its `state` are read straight off the payload, never fabricated
 * (J6/J7's "here를 지어내지 않는다" and "now도 지어내지 않는다").
 *
 * `kind` is 'resume' only when that entry's own state is 'here' — i.e. the global
 * continue point really is this station. Anything else means the server picked a
 * stand-in, and the bar reads "다음 정거장" instead of implying you were just here.
 */
export function pickCurrent(curricula: JourneyCurriculum[]): { station: JourneyCurriculum | null; kind: 'resume' | 'next' } {
  const found = curricula.find((c) => c.resume);
  if (!found) return { station: null, kind: 'next' }; // 트랙 전부 통과 — 가리킬 곳이 0개
  return { station: found, kind: found.state === 'here' ? 'resume' : 'next' };
}

export default function JourneyScreen() {
  const t = useT();
  const router = useRouter();
  const locale = useLocale();
  const [view, setView] = useState<JourneyView | null>(null);
  const [state, setState] = useState<'loading' | 'ok' | 'error'>('loading');
  const [openKey, setOpenKey] = useState<string | null>(null);

  const load = useCallback(() => {
    setState('loading');
    api.journey()
      .then((v) => { setView(v); setState('ok'); })
      .catch(() => setState('error'));
  }, []);

  // 탭을 떠나면 버린다: 진도가 다른 화면에서 움직일 수 있다. 목표 부서도 캐시하지
  // 않는다 — 서버가 정본이라, 이 탭에 들어올 때마다 다시 받는다.
  useFocusEffect(useCallback(() => { load(); }, [load, locale]));

  // 자유 탐방 칩과 상단 부서 표시는 같은 경로를 쓴다(J5) — 부서를 고르는 방법은 하나다.
  // 미리보기 없이 곧장 저장하고, 그 응답으로 경로를 다시 그린다(W3).
  const pickDept = (dept: string) => {
    if (!dept) return;
    setState('loading');
    api.setGoalDept(dept)
      .then(() => api.journey())
      .then((v) => { setView(v); setState('ok'); })
      .catch(() => setState('error'));
  };

  const openStep = (step: JourneyStep) => {
    const scn = step.scenarioId;
    if (!scn) return;
    setOpenKey(null);
    if (scn.startsWith('QZ-')) { router.push(`/quiz/${scn}`); return; }
    router.push(step.guide ? `/scenario/${scn}?guide=${step.guide}` : `/scenario/${scn}`);
  };

  if (state !== 'ok' || !view) {
    return (
      <Sheet>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 14 }}>
          {state === 'loading' ? (
            <ActivityIndicator color={nb.ink} />
          ) : (
            <>
              <Text style={[nbText.hand(17), { textAlign: 'center' }]}>{t('journey.loadFailed')}</Text>
              <NbButton variant="ink" onPress={load} icon="pencil" iconColor={nb.paper}>
                {t('common.retry')}
              </NbButton>
            </>
          )}
        </View>
      </Sheet>
    );
  }

  const goalDept = view.goalDept ?? '';
  const curricula = view.track?.curricula ?? [];
  const { station, kind } = pickCurrent(curricula);

  return (
    <Sheet>
      {!!goalDept && (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 20, paddingTop: TOP_INSET, paddingBottom: 6 }}>
          <NbIcon name={deptNbIcon(`SCN-${goalDept}-00001`)} size={22} />
          <Text numberOfLines={1} style={[nbText.hand(24), { flex: 1 }]}>{t(`dept.${goalDept}`)}</Text>
          {/* 추론된 목표는 저장되지 않는다(J4) — 학습자가 고르기 전까지는 그렇다는 티를 낸다. */}
          {!!view.inferred && <NbTag color={nb.soft}>{t('journey.inferredTag')}</NbTag>}
        </View>
      )}

      <View style={{ flex: 1 }}>
        <JourneyMap track={view.track} onStationPress={setOpenKey} />
        {/* 트랙 전부 통과면 station이 null이고, 열 정거장이 없다 — 탭해도 아무 일도 일어나지
            않는다(구간 시험·자유 탐방은 이 태스크가 조립할 조각이 아니다). 있으면 그 정거장의
            시트를 연다 — "바로 시나리오로 보내지 않는다, 어느 회차인지 고르게 한다"(§5). */}
        <CurrentStationBar
          station={station}
          kind={kind}
          onPress={() => { if (station?.themeKey) setOpenKey(station.themeKey); }}
        />
      </View>

      <View style={{ paddingVertical: 10 }}>
        <FreeRoamRow entries={view.freeRoam ?? []} onPick={pickDept} />
      </View>

      {!!openKey && (
        <StationSheet
          themeKey={openKey}
          onClose={() => setOpenKey(null)}
          onStepPress={openStep}
        />
      )}
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
