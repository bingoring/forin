---
artifact: frontend-components
build-spec: scenario-runtime
updated: 2026-07-18
---

# 시나리오 런타임 — Frontend Components (화면 · 포팅 · 재사용)

## 브리핑 화면 `app/scenario/[id].tsx` (스텁 교체, 1:1 포팅)
SoT: `screen-briefing.jsx`. 어두운 배경 위 크림 카드(4px 보더·6px 그림자·코너 스테이플).
- **리본 헤더**: dept 태그(deptColor) · "❗ NEW SCENARIO" · title · tagline(이탤릭) · bob 애니 `!` 마커.
- **NPC 스트립**: BriefingPortrait(초상 프레임 90×102, persona role→Derp*·hair·mood→expression) · name · sub · DifficultyStars(Pips filled/total 3·EASY/MEDIUM/HARD) · ⏱ timeLabel.
- **SITUATION** 박스(라벨 탭) · **연습할 스킬** mint 칩 · **완료 시 보상** 행(icon·label·value) · **입장 조건** 칩(met→mint/✓, 미충족→red/✗).
- **footer**: [나중에 하기] → back · [▶ 지금 진행](+XP 뱃지) → dialogue.
- 재사용: `PixelBox`·`PixelButton`·`RoleFace`/Derp 초상(@engine)·`theme/tokens`(peach·mint·yellow·cream). RN 변환: div→View, box-shadow→그림자 프리미티브(기존 PixelBox 규약), 웹폰트→앱 fonts.

## 대화 화면 `app/scenario/[id]/dialogue.tsx` (신규, 1:1 포팅)
SoT: `screens-dialogue.jsx`(free 모드 우선). 어두운 배경 + DialogueBackdrop.
- **PortraitFrame**(L 환자 / R 간호사, name·status·hue) + 표정(persona.mood).
- **스피커 탭** + 말풍선(누적 messages·streamingText).
- **free 모드**: 텍스트 입력 필드 + 전송 · [🎤 직접 말하기](후속 STT) · [💡 힌트](후속).
- **hint 모드**(후속): ChoiceRow 선택지(suggested/risky)·번역 행.
- **결과 화면**(후속): `ScreenDialogueResult`(컨페티·RewardRow).
- 재사용: 초상(@engine)·PixelBox/Button·tokens. AI 연결: `api.startConversation`→`sendMessageStream(onDelta)`.

## 공유/토큰
- 색: `theme/tokens`(peach/peachShadow·mint/mintShadow·yellow·cream·paper·ink·textSoft). 핸드오프 `ForinTokens`와 1:1 대응 확인.
- 폰트: 제목 DungGeunMo→`fonts.heading`, 본문 Galmuri→`fonts.body`(기존 앱 매핑 준수).

## 미포팅(후속) 명시
힌트모드 선택지·번역·마이크 STT·발음 채점·결과/컨페티·미니퀴즈 — 슬라이스 밖([build-spec-index](build-spec-index.md) §5). 화면엔 버튼만 두고 비활성/후속 표기.
