// ThemeList — 일터 탭 1단계: 부서의 주제 목록 (P3-C 여정 지도 2단 구조,
// curriculum-v3-journey-ia/build-spec-index.md §5).
//
// 왜 지도가 아니라 목록인가(§1): 길이라는 형태는 순서를 뜻하는데, 주제 사이에는 그
// 순서를 강제하는 규칙이 없다(J1·J3) — 형태가 규칙보다 강하게 말했다. 그래서 이 파일은
// 주제를 잇는 선·화살표·순번을 **절대 그리지 않는다**(K1) — Svg도, PathSegment도 쓰지
// 않는다. `JourneyMap`이 하던 자리를 대신하지만 같은 것을 그리지는 않는다.
//
// 권장 순서 자체는 실재하고(§2, themes.yaml의 order) 버리지 않는다 — 다만 사슬이
// 아니라 서버가 지목한 단 하나의 점으로만 말한다(K2): `resume`가 참인 주제 카드 하나만
// 표시를 받는다. 서버가 트랙당 0개 또는 1개를 보장하므로(business-rules R15~R18) 이
// 파일은 그 값을 그대로 옮길 뿐 스스로 "다음"을 계산하지 않는다 — 옛 CurrentStationBar가
// 하던 resume/next 구분(state==='here')은 여기서 다시 만들지 않는다: 그 구분은 "이어할
// 곳이 방금 여기였는지"를 가렸지만, 카드 목록에서 권유는 이미 하나뿐이므로 구분할
// 두 번째 대상이 없다.
//
// 묶음은 `curricula[].track`을 따른다(K3) — 부서 코어 먼저, 부서 심화 다음. 지금
// 콘텐츠는 'core'|'depth' 두 값만 쓰지만(server/internal/curriculum/themed 카탈로그),
// 세 번째 값(예: 'collab', 콘텐츠 0건 — business-rules.md)이 생겨도 이분법이 깨지지
// 않도록 "core가 아니면 심화"로 잡는다 — 코어를 먼저 하라는 권유는 이미 묶음 순서만으로
// 전달되고, 세 번째 묶음을 새로 만들 근거가 없다.
//
// 잠금 없음(J1): 카드는 `disabled`를 두지 않는다 — Station.tsx의 `far`가 그렇듯, 아직
// 가지 않은 주제도 눌린다.
import { Pressable, Text, View } from 'react-native';
import { NbPaper, NbProgScale, NbTag, nbText } from '@/components/nb/NbUI';
import { nb } from '@/theme/nb';
import { useT } from '@/i18n';
import type { JourneyCurriculum } from './JourneyMap';

/** 서버가 주는 `track` 문자열로 두 묶음을 가른다(K3). 'core'만 코어, 나머지는 전부
 *  심화 — 'depth'는 물론, 아직 콘텐츠가 없는 'collab'이나 빈 문자열도 심화로 떨어진다.
 *  세 번째 묶음을 만들지 않는 것이 이 함수의 핵심 결정이다. */
export function groupByTrack(curricula: JourneyCurriculum[]): {
  core: JourneyCurriculum[];
  depth: JourneyCurriculum[];
} {
  const core: JourneyCurriculum[] = [];
  const depth: JourneyCurriculum[] = [];
  for (const c of curricula) {
    if (c.track === 'core') core.push(c); else depth.push(c);
  }
  return { core, depth };
}

function SectionLabel({ children }: { children: string }) {
  return (
    <Text style={[nbText.hand(15, nb.soft), { marginTop: 18, marginBottom: 8 }]}>
      {children}
    </Text>
  );
}

function ThemeCard({ c, onPress }: { c: JourneyCurriculum; onPress(): void }) {
  const t = useT();
  const themeKey = c.themeKey ?? '';
  const name = c.name ?? themeKey;
  const done = c.done ?? 0;
  const total = c.total ?? 0;
  return (
    <Pressable
      testID={`theme-card-${themeKey}`}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={name}
      style={{ marginBottom: 10 }}
    >
      <NbPaper rot={-0.3} style={{ padding: 13, flexDirection: 'row', alignItems: 'center', gap: 11 }}>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text numberOfLines={2} style={nbText.hand(16.5)}>{name}</Text>
          {total > 0 && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
              <NbProgScale done={done} total={total} />
              <Text style={nbText.body(10, nb.soft)}>{`${done}/${total}`}</Text>
            </View>
          )}
        </View>
        {/* 권유는 하나뿐(K2) — resume가 참인 카드에만 붙는다. 나머지 카드는 순서를
            암시하는 어떤 표시도 갖지 않는다(지어내지 않는다, §8 검증표). */}
        {!!c.resume && (
          <View testID="theme-resume-badge">
            <NbTag color={nb.ink} fill>{t('journey.resumeLabel')}</NbTag>
          </View>
        )}
      </NbPaper>
    </Pressable>
  );
}

export function ThemeList({ curricula, onPress }: {
  curricula: JourneyCurriculum[];
  onPress(themeKey: string): void;
}) {
  const t = useT();
  const { core, depth } = groupByTrack(curricula);
  return (
    <View testID="theme-list">
      {core.length > 0 && (
        <>
          <SectionLabel>{t('journey.track.core')}</SectionLabel>
          {core.map((c, i) => (
            <ThemeCard key={c.themeKey || `core-${i}`} c={c} onPress={() => onPress(c.themeKey ?? '')} />
          ))}
        </>
      )}
      {depth.length > 0 && (
        <>
          <SectionLabel>{t('journey.track.depth')}</SectionLabel>
          {depth.map((c, i) => (
            <ThemeCard key={c.themeKey || `depth-${i}`} c={c} onPress={() => onPress(c.themeKey ?? '')} />
          ))}
        </>
      )}
    </View>
  );
}
