# 화면 감사 (2026-10-19)

읽기 전용 에이전트 3개가 코드 기준으로 감사했다(파일:행·i18n 키·원문·판정). 범위:
1. 일터·학습 흐름 — journey, scenario 허브·STEP, dialogue, result, quiz, review, speak/model 목록
2. 라운지·리뷰랩·나 — lab, lounge(+compose), me, colleagues, growth, avatar, settings, handoff, slang, board
3. 온보딩·게임·기타 — passport, games(허브·원·농구), pronunciation, slang, route, night, interior/elevator, boot splash

결과는 두 문서로 합쳤다:
- 문구로 끝나는 것 → `../apply-list.md`(앱에 적용)
- 화면 구성·결정이 필요한 것, 핸드오프 reference를 앱에 맞춰 달라는 것(⚑) → `../design-brief.md`

감사가 짚은 기능 문제(문구 밖): 리뷰랩 '저장된 카드'='복습 대기'(둘 다 `cards.length`), 모범답안 오류 시 빈 상태 문구(→ 고침),
온보딩 목적지 뒤로 `goBack('job')`(→ 고침), 나 › 공개 토글이 아무것도 안 바꿈(라이브 병동 미사용), 상황판 '완료' 0 고정, 입구 없는 화면 4묶음,
1차 정리에서 사라진 '다시 듣기 · n회'(→ 되살림).
