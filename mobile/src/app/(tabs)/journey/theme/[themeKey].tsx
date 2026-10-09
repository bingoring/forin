// 2단계 — 주제 화면(정거장 뷰). curriculum-v3-journey-ia/build-spec-index.md §6~§7.
//
// 1단계(일터 탭)의 주제 카드를 누르면 여기로 온다. 지도(JourneyMap이 그리던 지그재그·
// 걸어가는 아바타·구간 시험 깃발)가 이 화면으로 내려왔다 — 1단계는 이제 길을 그리지
// 않는다(K1). 여기서는 정거장 하나가 스텝 하나이고(§6), `StationTrack`이 그 그림(K4:
// 점선·걷기·깃발)과 잠금 게이팅(K5)·모션 줄이기(K7)를 전부 쥔다. 이 파일이 하는 일은
// 셋뿐이다: 데이터를 받고, 헤더/로딩/오류를 그리고, 스텝을 눌렀을 때 실제로 어디로
// 갈지(퀴즈냐 시나리오냐) 정한다.
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { api, type JourneyStep, type StationDetail } from '@/api/client';
import { StationTrack } from '@/components/journey/StationTrack';
import { NbIcon } from '@/components/nb/NbIcon';
import { NbButton, NbPaper, NbProgScale, NbSheet, NbTag, nbText } from '@/components/nb/NbUI';
import { goBackToShelf } from '@/data/journeyBack';
import { TOP_INSET, nb } from '@/theme/nb';
import { PLACE_SCREEN } from '@/theme/transitions';
import { useT } from '@/i18n';

/**
 * 스텝을 눌렀을 때 실제로 어디로 갈지 — 1단계 이전에 이 화면(당시 `(tabs)/journey.tsx`)이
 * 이미 갖고 있던 규칙 그대로다(P3-C 착수 전 커밋 `d36bfa1`의 `openStep`). `scenarioId`가
 * 없으면(끝의 boss 스텝) 아무 데도 가지 않는다 — `StationTrack`이 그 스텝을 정거장이
 * 아니라 깃발로 그려 애초에 누를 수 없게 하지만, 방어적으로 한 번 더 막는다.
 */
function routeStep(router: ReturnType<typeof useRouter>, step: JourneyStep) {
  const scn = step.scenarioId;
  if (!scn) return;
  if (scn.startsWith('QZ-')) { router.push(`/quiz/${scn}`); return; }
  router.push(step.guide ? `/scenario/${scn}?guide=${step.guide}` : `/scenario/${scn}`);
}

export default function ThemeScreen() {
  const t = useT();
  const router = useRouter();
  const { themeKey } = useLocalSearchParams<{ themeKey: string }>();
  const [detail, setDetail] = useState<StationDetail | null>(null);
  const [state, setState] = useState<'loading' | 'ok' | 'error'>('loading');

  // 새로고침 순서 보호 — journey.tsx의 seqRef와 같은 이유(마지막에 "시작된" 요청이
  // 이겨야 한다). 이 화면은 themeKey가 바뀌는 경우가 실질적으로 없지만(라우트 파라미터가
  // 고정), 재시도 버튼이 다시 부르는 경우까지 한 번에 막아 둔다.
  const seqRef = useRef(0);
  const load = () => {
    const seq = ++seqRef.current;
    setState('loading');
    api.station(themeKey)
      .then((d) => { if (seqRef.current !== seq) return; setDetail(d); setState('ok'); })
      .catch(() => { if (seqRef.current !== seq) return; setState('error'); });
  };

  useEffect(() => { load(); }, [themeKey]);

  const station = detail?.station;
  const name = station?.name ?? themeKey;
  const done = station?.done ?? 0;
  const total = station?.total ?? 0;
  const track = station?.track;
  const steps = detail?.steps ?? [];

  return (
    <NbSheet>
      <Stack.Screen options={PLACE_SCREEN} />
      <View style={{ paddingTop: TOP_INSET, paddingHorizontal: 20, paddingBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Pressable testID="theme-back" onPress={() => goBackToShelf(router)} hitSlop={10}>
          <NbPaper rot={-1} style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}>
            <NbIcon name="chevronLeft" size={16} />
          </NbPaper>
        </Pressable>
        <View style={{ flex: 1, minWidth: 0 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text testID="theme-title" numberOfLines={1} style={[nbText.hand(22), { flex: 1, lineHeight: 24 }]}>{name}</Text>
            {!!track && <NbTag rot={-1}>{t(`journey.track.${track}`)}</NbTag>}
          </View>
          {total > 0 && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
              <NbProgScale done={done} total={total} />
              <Text style={nbText.body(10, nb.soft)}>{`${done}/${total}`}</Text>
            </View>
          )}
        </View>
      </View>

      {state === 'error' ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 14 }}>
          <Text style={[nbText.hand(17), { textAlign: 'center' }]}>{t('journey.loadFailed')}</Text>
          <NbButton variant="ink" onPress={load} icon="pencil" iconColor={nb.paper}>
            {t('common.retry')}
          </NbButton>
        </View>
      ) : state === 'loading' ? (
        <View testID="theme-loading" style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={nb.ink} />
        </View>
      ) : (
        <StationTrack steps={steps} onStepPress={(step) => routeStep(router, step)} />
      )}
    </NbSheet>
  );
}
