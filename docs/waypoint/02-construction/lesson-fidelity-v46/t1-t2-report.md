# T1·T2 보고 — 공용 부품·모션 기반 · 낱장 묶음

2026-10-07 · 브랜치 `feat/journey-ia` · 스펙 `build-spec-index.md` §4 T1·T2

## 커밋

| 커밋 | 내용 |
|---|---|
| `38dead1` feat(nb) | T1 — NbUI·nb.ts 공용 값, `nbMotion.tsx`, NbIcon `faceWorried`·`check` |
| `fad7e4b` feat(lesson) | T2 — `SheetStack.tsx`(낱장 묶음·뜯김 연출), 화면에는 아직 안 붙임 |

테스트: `npx tsc --noEmit` 0건 · `npx jest` 169 스위트 1202개 전부 통과(시작 때 165/1159). 새 동작마다 일부러 깨뜨려 실패를 확인함(구간 이징·opacity 단일 구간·모션 줄이기·하드 그림자·누름 전환·형광펜 55%·뜯김 순서·key 재마운트·뜯는 중 가드·dim 그림자).

## T3·T4가 쓸 것 — 이름과 쓰는 법

### `mobile/src/components/lesson/SheetStack.tsx`

```tsx
const stack = useRef<SheetStackHandle>(null);
<NbSheet>                                   {/* 줄노트 28px 배경은 화면의 NbSheet가 그린다 */}
  <SheetStack
    ref={stack}
    index={i} total={N} done={i >= N}
    top={172} bottom={182}                  // 기본값. 안전 영역에 맞춰 화면이 옮긴다(아래 '남은 일')
    renderSheet={(k, mode) => (            // mode: 'current' | 'next'(아래 깔린 dim) | 'tearing'(날아가는 복사본)
      <LessonSheet dim={mode === 'next'} tag={tag} typeLabel={label} n={k + 1} total={N}>
        <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center', marginTop: 14 }}>
          <SheetIconCircle icon={icon} />   {/* listen이면 tone="listen" onPress={play} */}
          …프롬프트…
        </View>
        …해설…
      </LessonSheet>
    )}
    renderDone={() => …DONE 도장·집계…}     // 완료 낱장(패딩 28/18/20·그림자·가운데)은 부품이 그린다
    onAdvance={() => setI((n) => n + 1)}    // 뜯김이 끝났을 때만 불린다
  />
</NbSheet>
stack.current?.tear('left' | 'right', onTorn?)  // 판정 버튼. 620ms 뒤 onTorn → onAdvance → 새 장 rise · 절취 조각 stub
stack.current?.shake()                           // 오답 확인 때
stack.current?.isTearing()                       // 뜯는 중 입력 막기
```

- 뜯는 동안 `renderSheet(i, 'tearing')`이 그려지므로 그 장의 답·결과 상태는 `onAdvance`에서 지운다(핸드오프와 같음).
- `LessonSheet`의 `tag`는 선택 — R3 대체(상황 짧은 이름)는 화면이 넣는다. `typeLabel`에 " · 해설"을 붙이는 것도 화면 몫. 문구는 전부 화면이 i18n으로.
- 내보낸 상수: `SHEET`(모든 숫자), `STUB_POINTS`(clip-path 16점).

### `mobile/src/components/nb/nbMotion.tsx`

| 이름 | 쓰는 법 |
|---|---|
| `<NbEnter kind="reveal" \| "ok" \| "rise" \| "stub" \| "swipeIn" \| "pop">` | 마운트하며 한 번. 다시 보려면 key를 바꾼다. `onEnd`, `style`, `testID`, `pointerEvents` |
| `useNbEnter(kind, onEnd?)` | 위와 같은 것을 스타일로 |
| `useNbShake()` → `{ style, shake(onEnd?) }` | 부를 때마다 처음부터 |
| `useNbTear(dir, onEnd?)` | 마운트하며 뜯겨 날아감(SheetStack이 씀) |
| `useNbSwipeOut()` → `{ style, onLayout, swipe(onEnd?) }` | 릴 장면 카드 — 폭을 재서 -120% |
| `useNbColorTransition(color)` | 진행 칸 `background .3s ease`(JS 드라이버) — `backgroundColor`에 그대로 |
| `useNbPress()` + `nbPressTransform(p, rot)` | `.nb-press` 0.06s. 보통은 `NbPressable`을 쓴다 |
| `useReduceMotion()` | 앱 전체 구독 하나. 켜져 있으면 모든 훅이 즉시 최종 상태 + 끝 콜백 |
| `NB_MOTION`, `swipeOutSpec`, `CSS_EASE`, `NB_PRESS`, `NB_CHIP_PRESS`, `NB_BAR_TRANSITION` | 명세 표(테스트가 참조 JSX의 `@keyframes`를 직접 읽어 대조) |

저울 점의 `transition: all .15s`(STEP 1 A10)는 전용 훅을 두지 않았다 — T3에서 `scale`(18→26 = 1.444)로 바꿔 `NbEnter`가 아닌 `Animated.timing`(150ms, `CSS_EASE.ease`, native)로 하면 된다.

### `mobile/src/components/nb/NbUI.tsx`

- `NbPressable({ rot, shadow, onPress, disabled, style, faceStyle })` — 누르는 수첩 요소 공용 래퍼. `shadow`: `hardShadow.*` · `'paper'` · `null`. `style`은 자리(flex·여백), `faceStyle`은 면(배경·테두리·패딩). 칩의 `1px 2px 0 .2`는 `shadow={hardShadow.chip}`.
- `NbDoubleRing({ color, radius })` — `3px double`의 안쪽 링. 도장(GOOD/RETRY 56, DONE 96)은 바깥 `borderWidth: 1` + 이것.
- `NbTag`에 `textStyle`(허브의 10.5pt 태그), `nbText.mono(size, color, tracking)`, `nbText.monoBold(size, color, tracking = 0)`.
- `nb.ts`: `hardShadow`(ink·yellow·danger·chip), `sheetShadow`(`0 4px 10px .16`).

## 바꾼 공용 값 (모든 수첩 화면에 적용 — 결정 9)

| 부품 | 전 | 후(핸드오프) | 출처 |
|---|---|---|---|
| NbButton ink | 흐린 paperShadow | `2.5px 2.5px 0 rgba(62,54,43,.3)` 하드 | ui.jsx L58 |
| NbButton yellow | 흐린 | `2px 2px 0 rgba(62,54,43,.25)` | L60 |
| NbButton danger | 흐린 | `2px 2px 0 rgba(199,81,70,.25)` | L62 |
| NbButton paper·dashed | 같음 | 같음(paper 흐림 유지, dashed 없음) | L59·L61 |
| 누름 | 즉시 | transform·그림자 0.06s ease, 양방향(native) | L17–18 |
| NbChip 누름 | 즉시 scale .94 | 0.06s ease | L19–20 |
| NbGauge | 1톤 .4 + 종이, 가로 간격 10 | 2톤 `66`/`3d`, 빈칸 없음, 가로 간격 10·√2, 오른쪽 아래에서 위상 | L105 |
| NbStamp | 1.4 + 2.2 안쪽 1.4 | 1 · 틈 1 · 1 (`3px double`), 아랫줄 lineHeight size·.32 | L87–89 |
| NbMark | 띠 50%~92%, r 1.5, 좌우 패딩 없음 | 55%~100%, 모서리 각짐, 좌우 2(첫 줄 시작·끝 줄 끝) | L94–96 |
| NbTag | paddingV 1 | paddingV 0, `textStyle` 추가 | L74 |
| NbTape | 그림자 없음 | `0 1px 2px rgba(0,0,0,.08)`(iOS) | L36 |
| NbSheet 줄 | 28–29 | 27–28 | L175 |
| nbText.mono | 자간 1 고정 | 자간 인자(기본 1 유지), `monoBold` 자간 0 | 감사 hub #34 등 |
| NbIcon check | 잉크 2.4 한 줄 | 초록 수채 밑칠 5 + 잉크 2.2(경로 참조 그대로) | nb.jsx L43 |
| NbIcon faceWorried | 없음(star 폴백) | 새로 그림 — faceAngry 규칙(r8 피치 얼굴·점 눈), 눈썹 안쪽이 올라감, 물결 입 | 결정 9 |

기존 테스트 중 옛 값을 박아 둔 것(`nbUI.test.tsx`의 버튼 그림자·도장 1.4×2·형광펜·칩)은 지우지 않고 새 값으로 고쳤다.

## 옮기지 못한 것·근사한 것

1. **모노 700, 도장 윗줄 800.** 앱에 `IBMPlexMono-Bold`·`Pretendard-ExtraBold` 자산이 없어 `monoBold`는 SemiBold(600), 도장은 Bold(700) 그대로다. 디스크에 후보가 있지만 넣지 않았다: IBM Plex Mono Bold는 다른 프로젝트 `node_modules/@ibm/plex`의 woff(v2.1, 글리프 851 — 저장소 SemiBold v2.3은 1033)라 IPA 등에서 글자 빠짐 위험이 있고, Pretendard ExtraBold TTF는 `alternative/` 판이다. 자산 추가는 사용자 결정(감사 step1 §4-14).
2. **nbText.mono 기본 자간 1은 유지.** 핸드오프는 쓰는 자리마다 자간을 정하고(키트 라벨·QUICK INFO는 1, STEP 라벨·n/N·IPA는 0), 감사가 보지 않은 화면 30여 곳이 기본값을 쓴다. 그래서 기본을 뒤집지 않고 인자로 열었다 — T3·T4·T6·T7은 0을 넘기거나 `monoBold`를 쓴다.
3. **paper 버튼의 흐린 그림자 전환(Android).** iOS는 같은 크기 판의 투명도로 0.06s 전환한다. Android는 elevation이 형제 순서를 바꿔 판을 쓸 수 없어 누르는 순간 그림자가 빠진다(전환 없음).
4. **테이프 그림자는 iOS만.** 반투명 띠 아래 Android elevation은 띠를 통해 비쳐 CSS(상자 밖에만 그림자)와 달라진다.
5. **CSS `dashed`의 점 길이.** CSS는 점선 무늬를 정하지 않는다. Chromium(핸드오프 캡처 환경)의 얇은 점선 = 선 굵기 ×3 점·×3 틈으로 그렸다(`SHEET.dash`). 시뮬레이터 대조(T8)에서 확인할 것.
6. **하드 그림자 모서리.** 면의 둥근 모서리(r3) 바깥 귀퉁이 1px 미만 틈은 그리지 않았다.

## 남은 일·주의(다음 작업자)

- **Android 층 순서**: 링·절취 조각·뜯기는 장은 `elevation` + 투명 그림자색으로 낱장(elevation 4) 위에 올렸다. Android 실기 확인 필요.
- **스크롤 영역 top 172**는 874 프레임·가짜 상태바 44 기준이다. 화면이 안전 영역과 헤더 실측으로 `top`을 넘겨야 한다(감사 step2 §5-11, step1 §4-13).
- **faceWorried가 NbIcon 이름에 들어감** — 서버 검사기가 NbIcon.tsx에서 이름을 읽으므로(커밋 8c2cbef) 이제 콘텐츠에 쓸 수 있다.
- `markInline`(문장 안 일부 단어 형광펜)은 아직 글자 상자 전체를 칠한다 — T4(릴 단어·C5 고친 문장)에서 따로 풀어야 한다.
