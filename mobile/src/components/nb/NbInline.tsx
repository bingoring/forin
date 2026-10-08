// 한 줄 안의 일부만 칠하는 형광펜·취소선 — 낱말 단위로 깐 글줄.
//
// 핸드오프는 문장 중간의 낱말에 `<mark style="background: linear-gradient(transparent 55%, #F9E37B 55%);
// padding: 0 2px">`를 건다(nuance.jsx L71 릴 단어 · L153 C5 고친 문장, sent-live L197 제목,
// ui.jsx L94–96 NbMark). 글자 상자의 **아래 45%**만 노랗다. RN의 Text backgroundColor는 줄 상자
// 전체를 칠하고(옛 markInline), onTextLayout은 줄은 주지만 줄 안의 부분 문자열 위치는 주지 않는다.
//
// 그래서 글줄을 낱말 조각으로 깐다: 낱말마다 자기 상자(높이 = lineHeight)를 갖는 flex-wrap 줄.
// 칠할 낱말은 그 상자의 55%~100%에 띠를 깔고, 띠가 이어지는 동안은 낱말 사이 빈칸까지 칠한다.
// `<mark>`의 padding 0 2px는 칠한 구간의 양 끝에서만(box-decoration-break: slice) 띠를 2 넓히고
// 글자를 2 민다. 취소선(C5 정답 장면 `line-through 2px red`)도 같은 상자에 그린 선이다 —
// iOS만 textDecorationColor를 받고 두께는 둘 다 못 받는다.
//
// 낱말 사이에서만 줄이 바뀐다(영어 문장, 띄어 쓴 한국어 제목에 맞는 규칙).
import type { ReactNode } from 'react';
import { Text, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import { MARK } from './NbUI';
import { nb } from '@/theme/nb';

export type InlinePart =
  | { text: string; mark?: boolean; strike?: { color: string; width: number }; style?: StyleProp<TextStyle> }
  | { node: ReactNode; key: string };

/** `*…*` in a catalog string marks the highlighted run: '외우지 말고 *다섯 장면*에서 …'. */
export function markParts(s: string, style?: StyleProp<TextStyle>): InlinePart[] {
  return s.split('*').map((text, i) => ({ text, mark: i % 2 === 1, style })).filter((p) => p.text !== '');
}

type Tok =
  | { kind: 'word'; text: string; space: boolean; part: Extract<InlinePart, { text: string }>; first: boolean; last: boolean; joinNext: boolean; strikeNext: boolean }
  | { kind: 'node'; node: ReactNode; key: string; space: boolean };

function tokenize(parts: InlinePart[]): Tok[] {
  const out: Tok[] = [];
  parts.forEach((p, pi) => {
    if ('node' in p) {
      out.push({ kind: 'node', node: p.node, key: p.key, space: false });
      return;
    }
    // Words with the space that follows each; a leading space belongs to the token before.
    const lead = /^\s/.test(p.text);
    if (lead && out.length) out[out.length - 1].space = true;
    const words = p.text.trim().split(/\s+/).filter(Boolean);
    const trailing = /\s$/.test(p.text);
    words.forEach((w, wi) => {
      const lastOfPart = wi === words.length - 1;
      out.push({
        kind: 'word', text: w, part: p, space: !lastOfPart || trailing,
        first: wi === 0 && !(pi > 0 && sameRun(parts[pi - 1], p, 'mark')),
        last: lastOfPart && !(pi + 1 < parts.length && sameRun(p, parts[pi + 1], 'mark')),
        joinNext: false, strikeNext: false,
      });
    });
  });
  // A mark or strike runs on through the space only when the next word carries it too.
  out.forEach((t, i) => {
    if (t.kind !== 'word') return;
    const n = out[i + 1];
    t.joinNext = !!(t.space && n && n.kind === 'word' && t.part.mark && n.part.mark);
    t.strikeNext = !!(t.space && n && n.kind === 'word' && t.part.strike && n.part.strike);
  });
  return out;
}

function sameRun(a: InlinePart, b: InlinePart, k: 'mark'): boolean {
  return !('node' in a) && !('node' in b) && !!a[k] && !!b[k] && !/\s$/.test(a.text) && !/^\s/.test(b.text);
}

/**
 * A wrapped line of words. `textStyle` must carry fontSize and lineHeight — every word's box
 * is one line tall, which is what the band's 55% is measured on.
 */
export function NbInline({ parts, textStyle, style, testID }: {
  parts: InlinePart[];
  textStyle: TextStyle;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}) {
  const toks = tokenize(parts);
  const space = <Text style={textStyle}>{' '}</Text>;
  return (
    <View testID={testID} style={[{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-end' }, style]}>
      {toks.map((t, i) => {
        if (t.kind === 'node') {
          return (
            <View key={`n${t.key}`} style={{ flexDirection: 'row', alignItems: 'center', height: textStyle.lineHeight }}>
              {t.node}
              {t.space && space}
            </View>
          );
        }
        const mark = !!t.part.mark;
        const padL = mark && t.first ? MARK.padX : 0;
        const padR = mark && t.last ? MARK.padX : 0;
        const st = t.part.strike;
        return (
          <View key={i} style={{ flexDirection: 'row' }}>
            <View style={{ position: 'relative', marginLeft: padL, marginRight: padR }}>
              {mark && <Band testID="nb-inline-mark" left={padL ? -padL : 0} right={padR ? -padR : 0} />}
              {!!st && <Strike color={st.color} width={st.width} />}
              <Text style={[textStyle, t.part.style]}>{t.text}</Text>
            </View>
            {t.space && (
              <View style={{ position: 'relative' }}>
                {t.joinNext && <Band testID="nb-inline-mark-gap" left={0} right={0} />}
                {t.strikeNext && !!st && <Strike color={st.color} width={st.width} />}
                <Text style={[textStyle, t.part.style]}>{' '}</Text>
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}

/** ui.jsx L94–96: 55% → 100% of the line box, square, the marker yellow. */
function Band({ left, right, testID }: { left: number; right: number; testID: string }) {
  return (
    <View
      testID={testID}
      pointerEvents="none"
      style={{ position: 'absolute', left, right, top: `${Math.round(MARK.from * 100)}%`, bottom: 0, backgroundColor: nb.marker }}
    />
  );
}

/** CSS line-through sits about half an x-height above the baseline: a little below the box's middle. */
function Strike({ color, width }: { color: string; width: number }) {
  return (
    <View
      testID="nb-inline-strike"
      pointerEvents="none"
      style={{ position: 'absolute', left: 0, right: 0, top: '54%', height: width, marginTop: -width / 2, backgroundColor: color, zIndex: 1 }}
    />
  );
}

