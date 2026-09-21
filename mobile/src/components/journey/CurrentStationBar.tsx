// CurrentStationBar — 화면 하단 고정 바. 핸드오프 v41 08_JOURNEY_RESOURCES.md §3,
// frontend-components.md §2·§5.
//
// 가리킬 곳은 정확히 하나다: 바 전체가 하나의 `Pressable`이고, 그 하나의 `onPress`만
// 그 정거장의 시트를 연다(§5 — "바로 시나리오로 보내지 않는다, 어느 회차인지 고르게 한다").
// `NbButton`을 CTA로 얹지 않는 것은 스타일 취향이 아니라 그 컴포넌트 자체가 내부에
// `Pressable`을 두르기 때문이다 — 안에 얹으면 눌린 자리에 따라 어느 핸들러가 반응하는지
// 갈리는, 바로 이 파일이 막으려는 "두 곳을 다음이라 부르는" 모양이 된다. 라벨은 같은 자리에
// 버튼처럼 그린 `Text`일 뿐, 독립된 터치 타깃이 아니다.
//
// `station`이 null이면(트랙 전부 통과) `kind`는 의미가 없다 — resume/next 어느 쪽으로도
// 읽지 않고 구간 시험이나 자유 탐방을 권하는 문구로 완전히 바뀐다.
//
// `JourneyCurriculum`은 계약 유래 타입이라 전 필드가 optional이다(Task 8) — `?.`와 기본값.
import { Pressable, Text, View } from 'react-native';
import { NbIcon } from '@/components/nb/NbIcon';
import { NbPaper, NbProgScale, nbText } from '@/components/nb/NbUI';
import { deptNbIcon } from '@/data/campus';
import { nb } from '@/theme/nb';
import { useT } from '@/i18n';
import type { JourneyCurriculum } from './JourneyMap';

// The boxes are the house's way of drawing progress and they stay. What could not stay
// was one box per course: a station has twenty-odd, so the row ran past its own width
// and drew over the Resume pill beside it. A fixed count keeps the look and drops the
// axis that grew — ten boxes whatever `total` is, filled by proportion, with the exact
// figure in the text next to them (nobody counts twenty-four boxes by eye anyway).
const PROGRESS_BOXES = 10;

function CtaPill({ label }: { label: string }) {
  return (
    <View style={{ backgroundColor: nb.ink, borderRadius: 3, paddingVertical: 6, paddingHorizontal: 12 }}>
      <Text numberOfLines={1} style={nbText.hand(14, nb.paper)}>{label}</Text>
    </View>
  );
}

export function CurrentStationBar({ station, kind, onPress }: {
  station: JourneyCurriculum | null;
  kind: 'resume' | 'next';
  onPress(): void;
}) {
  const t = useT();

  if (!station) {
    return (
      <View style={{ position: 'absolute', left: 16, right: 16, bottom: 16 }} testID="current-station-bar">
        <Pressable testID="current-station-press" onPress={onPress} accessibilityRole="button" accessibilityLabel={t('journey.trackClear')}>
          <NbPaper rot={-0.3} style={{ flexDirection: 'row', alignItems: 'center', gap: 11, padding: 13 }}>
            <NbIcon name="compass" size={22} />
            <Text style={[nbText.hand(15), { flex: 1 }]}>{t('journey.trackClear')}</Text>
          </NbPaper>
        </Pressable>
      </View>
    );
  }

  const dept = station.dept ?? '';
  const name = station.name ?? dept;
  const done = station.done ?? 0;
  const total = station.total ?? 0;
  const label = kind === 'resume' ? t('journey.resumeLabel') : t('journey.nextLabel');

  return (
    <View style={{ position: 'absolute', left: 16, right: 16, bottom: 16 }} testID="current-station-bar">
      <Pressable testID="current-station-press" onPress={onPress} accessibilityRole="button" accessibilityLabel={`${name} — ${label}`}>
        <NbPaper rot={-0.3} style={{ flexDirection: 'row', alignItems: 'center', gap: 11, padding: 13 }}>
          <NbIcon name={deptNbIcon(`SCN-${dept}-00001`)} size={22} />
          <View style={{ minWidth: 0, flex: 1 }}>
            <Text numberOfLines={1} style={nbText.hand(16.5)}>{name}</Text>
            {total > 0 && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 3 }}>
                <NbProgScale done={done} total={total} boxes={PROGRESS_BOXES} />
                <Text style={nbText.body(10, nb.soft)}>{`${Math.round((done / total) * 100)}%`}</Text>
              </View>
            )}
          </View>
          <CtaPill label={label} />
        </NbPaper>
      </Pressable>
    </View>
  );
}
