# v47 설명 배제 3차 — 적용 목록 (2026-10-19)

근거: 핸드오프 v47 `07_NOTEBOOK_REDESIGN.md` "화면 문구 원칙 — 설명 배제"·"설명 배제 2차 정리"(0bf3b66), 화면 감사 3건(이 폴더 `audit/`).
사용자 지시(2026-10-19): 다른 화면도 돌아다니며 불필요한 설명·화면을 난잡하게 하는 설명은 제거. 판단은 원칙대로 — 핸드오프 reference에 아직 남은 문구(⚑)도
조작 안내·시스템 설명이면 지우고, 디자인 지시서에 "핸드오프도 맞춰 달라"로 적는다. 키는 `mobile/src/i18n/catalog/{ko,en,ja,de}.ts` 네 파일을 함께 고친다.

## A. 지우기 (렌더와 키 모두)
| 화면 | 키 / 위치 | 비고 |
|---|---|---|
| 게임 허브 | `games.noStudy`, `games.rankingSoon`, `games.sub` | 휴게실 카드로 들어오므로 부제도 겹침 |
| 농구 | `games.hoopsTapDunk`(hoops.tsx:505), `games.hoopsRuleLabel`·`games.hoopsRule`(규칙 박스째, 523-527) | "탭해서 시작"은 유지 |
| 은어 도감 | `slang.reward` 메모(달성 전) | 달성 축하 `slang.master`는 유지 |
| 발음 | `pron.drillSoon` | |
| 리뷰랩 | 복습 등급 접이식 블록째: `lab.gradeGuideQ`·`gradeGuideBody`·`againBody`·`hardBody`·`goodBody`·`easyBody`·`pipsHelp`; 히어로 보조줄 `lab.heroSub`; 카드 맥락 `lab.andYouAnswered` | pipsHelp는 문구도 틀림(■ vs 원형 점) |
| 리뷰·리뷰랩 판정 | `lab.againSub`·`hardSub`·`goodSub`·`easySub`가 그려지는 보조줄·토스트 보조줄 | 라벨(과 이미 있는 간격 표시)만 남김 |
| 말하기·모범답안 빈 상태 | `speak.listEmptyHint`, `list.emptyInDeptHint`, `model.emptyHint`, `speak.emptyHint` | 제목 한 줄만 |
| 라운지 | `lounge.emptyHint`, `lounge.emptyFilteredHint`, `lounge.deleteNote`, `lounge.composeSub` | |
| 동료 | `colleague.mentorSoon`(목록·상세 둘 다), `colleagueAdd.connectedBody`, `colleagueAdd.sentBody` | 알림은 제목만 |
| 나 | 리뷰랩 티저 카드(me.tsx:516-543, 하드코딩)째; `settings.language.appSubOn` ⚑, `settings.sound.on`·`off` ⚑, `settings.account.signOutSub` ⚑ | 로그아웃 확인 Alert는 유지 |
| 아바타 | `avatar.sub`, `avatar.subFirstTime`, `avatar.note` | |
| 학습 설정 | `learn.sub` | |
| 상황판 | `board.rotationNote`, `board.quietHint`, `board.midnight`, `board.emptyTomorrow` | 화면 입구는 없음(지시서에서 결정) |
| 목표 부서 고르기 | `journey.pickDeptHint` | |
| 학습 허브 | 레벨 설명 줄 `lesson.hub.levelA/B/C` ⚑; 건너뜀 안내 `lesson.hub.skipNote` → `lesson.step.skip`('건너뜀')로 | |
| 퀴즈 | `quiz.wordChips`(+ 주석 186-187), `quiz.matchHint` | |
| 대화 | `dialogue.tapMicAgain`, `dialogue.wrapUpBody`(본문만), `guided.chipHint` ⚑ | |
| 온보딩 | `onb.id.avaHint` ⚑, `onb.dest.sub` ⚑ | |

## B. 줄이기 (새 한국어 값 — 다른 세 언어도 같은 뜻으로)
| 키 | 새 값 |
|---|---|
| `pron.recordHint` | 최대 10초 |
| `pron.notSaved` | 이번 시도는 저장되지 않았어요. |
| `pron.badRequest` | 요청을 처리할 수 없어요. |
| `pron.noSpeech` | 소리가 잘 안 잡혔어요. |
| `games.hoopsSub` | 클린샷 2점 · 연속 3점 |
| `games.circleSub` | 정확도 · 5초 |
| `games.planeSub` | 15초 |
| `games.penCapSub` | 10초 |
| `games.adCapReached` | 내일 다시 |
| `games.title` | 휴게실 (라운지 카드 `lounge.restRoom`과 이름 통일) |
| `slang.deckDone` | 지금 나온 카드는 다 모았어요. |
| `me.noColleagues` | 아직 동료가 없어요 |
| `colleague.emptyNb` | 아직 동료가 없어요 |
| `colleagueAdd.notFound` | 코드를 찾을 수 없어요. |
| `lab.allDone` | 모든 복습을 마쳤어요! |
| `lab.loadFailed`·`board.loadFailed`·`journey.loadFailed` | 괄호 "(로그인·서버 확인)"/"(서버 확인)" 삭제 |
| me.tsx:198 하드코딩 로드 실패 | 새 키 `me.loadFailed` = 프로필을 불러오지 못했어요. |
| `lounge.rules` | 신고된 글은 검토 후 조치돼요. |
| `lounge.shareNeedsConversation` | 공유할 대화가 없어요. |
| `lounge.bodyHintQuestion` | 무엇이 궁금한가요? |
| `settings.language.pickNote` | 번역이 없는 부분은 한국어로 보여요. |
| `profile.nameSheetWhy` | 동료에게 보이는 이름이에요. |
| `learn.carryNote` | 바꿔도 지금까지의 레벨·복습 노트·발음 기록은 그대로 이어져요. |
| `growth.goodToSeeYou` | 다시 만나 반가워요 |
| `handoff.empty` | 아직 온 쪽지가 없어요 |
| `sent.swapPick` | 바꿀 말 |
| `review.tryFirst` | 먼저 말해 보세요 |
| `lesson.hub.emptyNote` | 준비 중 |
| `sent.feelSaved` | 저장됨 |
| `guided.holdListening` · `dialogue.listening` | 듣는 중… |
| `dialogue.inputPlaceholder` | 영어로 답하기… |
| `dialogue.tapTranslate` | 번역 |
| `dialogue.hintNone` | 지금은 힌트 없음 |
| `dialogue.notesEmpty` | 아직 없어요 |
| `dialogue.notStartedBody` | 그냥 나갈까요? |
| `choice.pickIntent` | 어떻게 답할까요? |
| `result.filedToNotes` | 빨간펜 {n}곳 |
| `journey.pickDeptInferredHint` | 아직 추정이에요 |
| `quiz.tapToPlace` | {what} |
| `quiz.findTheWrongOne` | 잘못된 하나는? |
| `quiz.dialogueOrder` | 대화 순서 |
| `boot.waking` | 조금만 기다려 주세요 |
| `elevator.comingSoon` | 준비 중 |
| `onb.id.nameHint` | 영문 이름 권장 |

## C. 되살리기
- 듣고 뜻 고르기 파형 옆 **"다시 듣기 · {n}회"**(남은 횟수) — 1차 정리(59a1ef9)에서 `sent.replay`와 함께 사라졌으나 핸드오프는 유지. 새 키 `sent.replayLeft`.

## D. 함께 고치는 버그
- 온보딩 목적지의 뒤로 칩 `goBack('job')` → `goBack('id')`(passport.tsx:773, 지금 흐름의 여권 발급 페이지).
- 모범답안 목록이 불러오기 실패에도 빈 상태 문구를 띄움(ModelAnswerList.tsx:138·199) → `list.loadFailed` + 다시 시도(SpeakList 방식).

## E. 고아 키 정리 (코드 참조 0건을 grep으로 확인한 것만)
`onboarding.pickNative/pickDest/saveFailed/startNow/whereFrom/destNotReady`, `onb.cover.open`, `night.homeEntry*`, `games.runner*`, `list.emptyForQuery*`,
`speak.urgent`, `model.scenarioCount`, `title.hiddenHint`, `choice.finished`, `lab.startReview`, `lab.faceSuggestHint` — 그리고 A에서 지운 키.

## 이번에 하지 않는 것 (디자인 지시서로)
들어갈 길이 없는 화면(루트·나이트·내부/엘리베이터·상황판), 나 › 공개 섹션(라이브 병동 없음), 리뷰랩 헤더 7층·같은 숫자 반복, 결과 화면 카드 정리,
학습 허브 레벨 3중 표시, 서가·부서 바인더 진행 반복, 게임 허브 '준비 중' 행, 순서 시트 흐름 한 줄(데이터 필드 필요), 유지(⚑ 아님) 판정 문구.
