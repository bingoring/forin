// 복습 등급 네 버튼 — 핸드오프 v49 `forin-notebook-v48-lab.jsx`의 `Face` + `btns` 1:1.
//
// 글 없이 얼굴로 말한다: 찡그림(다시) · 보통(어려움) · 웃음(알맞음) · 신남(쉬움). 아래에는 모노 간격
// (<1분 / 10분 / 1일 / 4일)만 — 이름은 접근성 라벨로 갈 뿐 화면에 쓰지 않는다. 리뷰랩 카드와 복습 세션이
// 같은 모양을 쓴다(둘 다 같은 판단이므로).
import { Animated, Pressable, Text, View } from 'react-native';
import Svg, { Circle, G, Path } from 'react-native-svg';
import { useV48Press } from '@/components/nb/nbMotion';
import { nb, nbFonts } from '@/theme/nb';
import { useT } from '@/i18n';
import type { ReviewGrade } from '@/api/client';

const INK = nb.ink;

/** 수첩 얼굴 글리프(다시 → 쉬움). viewBox 24 · 지름 18 · 선 1.7. */
export function Face({ k, col }: { k: 0 | 1 | 2 | 3; col: string }) {
  const P = { fill: 'none', stroke: INK, strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
  return (
    <Svg viewBox="0 0 24 24" width={26} height={26} testID={`grade-face-${k}`}>
      <Circle cx={12} cy={12} r={9} {...P} fill={col} />
      {k === 0 && (
        <G>
          <Path d="M7.5 9 L10 10.2 M16.5 9 L14 10.2" {...P} />
          <Path d="M8.5 16.5 Q12 13.5 15.5 16.5" {...P} />
        </G>
      )}
      {k === 1 && (
        <G>
          <Circle cx={9} cy={10} r={1} fill={INK} />
          <Circle cx={15} cy={10} r={1} fill={INK} />
          <Path d="M9 15.5 H15" {...P} />
        </G>
      )}
      {k === 2 && (
        <G>
          <Circle cx={9} cy={10} r={1} fill={INK} />
          <Circle cx={15} cy={10} r={1} fill={INK} />
          <Path d="M8.5 14 Q12 17.5 15.5 14" {...P} />
        </G>
      )}
      {k === 3 && (
        <G>
          <Path d="M7 9.5 Q9 7.8 11 9.5 M13 9.5 Q15 7.8 17 9.5" {...P} />
          <Path d="M7.5 13.5 Q12 19 16.5 13.5 Z" {...P} fill="#fff" />
        </G>
      )}
    </Svg>
  );
}

// 키 이름이 아니라 키 자체 — 모듈 평가 때 t()를 부르지 않는다(i18n/module-scope.test).
// 색 = 그 대답을 쓰는 펜(다시 빨강 · 어려움 호박 · 알맞음 파랑 · 쉬움 초록), fill = 얼굴 바탕.
export const GRADE_FACES: { g: ReviewGrade; labelKey: string; etaKey: string; color: string; fill: string }[] = [
  { g: 'again', labelKey: 'lab.again', etaKey: 'lab.etaAgain', color: nb.red, fill: 'rgba(199,81,70,.22)' },
  { g: 'hard', labelKey: 'lab.hard', etaKey: 'lab.etaHard', color: '#C77E2E', fill: 'rgba(233,150,100,.3)' },
  { g: 'good', labelKey: 'lab.good', etaKey: 'lab.etaGood', color: nb.blue, fill: 'rgba(169,196,224,.45)' },
  { g: 'easy', labelKey: 'lab.easy', etaKey: 'lab.etaEasy', color: nb.green, fill: 'rgba(185,211,174,.55)' },
];

function GradeButton({ index, onPress, disabled }: { index: 0 | 1 | 2 | 3; onPress: () => void; disabled?: boolean }) {
  const t = useT();
  const { g, labelKey, etaKey, color, fill } = GRADE_FACES[index];
  // 놓임 기울기 = `rotate(j%2 ? .8 : -.8)`, 눌리면 `.v48-press`(아래 2·3 · -1°).
  const press = useV48Press('press', index % 2 ? 0.8 : -0.8);
  return (
    <Pressable
      onPress={onPress} onPressIn={press.onPressIn} onPressOut={press.onPressOut} disabled={disabled}
      accessibilityRole="button" accessibilityLabel={t(labelKey)} testID={`grade-${g}`}
      style={{ flex: 1 }}
    >
      <Animated.View
        style={{
          alignItems: 'center', gap: 3, paddingTop: 7, paddingBottom: 5, borderRadius: 6,
          borderWidth: 1.6, borderColor: color, backgroundColor: nb.paper, transform: press.transform,
        }}
      >
        <Face k={index} col={fill} />
        <Text numberOfLines={1} style={{ fontFamily: nbFonts.monoBold, fontSize: 10, color }}>{t(etaKey)}</Text>
      </Animated.View>
    </Pressable>
  );
}

/** 얼굴 4버튼. `onGrade(grade, index)` — index 0·1은 왼쪽(다시·어려움), 2·3은 오른쪽. */
export function GradeRow({ onGrade, disabled, gap = 6, style }: {
  onGrade: (g: ReviewGrade, index: number) => void;
  disabled?: boolean;
  gap?: number;
  style?: object;
}) {
  return (
    <View testID="grade-row" style={[{ flexDirection: 'row', gap }, style]}>
      {GRADE_FACES.map((f, i) => (
        <GradeButton key={f.g} index={i as 0 | 1 | 2 | 3} disabled={disabled} onPress={() => onGrade(f.g, i)} />
      ))}
    </View>
  );
}
