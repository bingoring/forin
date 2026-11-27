# T6 보고 — 상황 허브 1:1

2026-10-08 · 브랜치 `feat/journey-ia` · 스펙 `build-spec-index.md` §4 T6 · 감사 `audit/audit-hub-dialogue.md` 허브 행(#1~#74, 애니메이션 A1) + StepTrack(#75~#89)

## 커밋

| 커밋 | 내용 |
|---|---|
| `a322f6d` feat(lesson) | 서버 — `GET /me/lesson`에 `course{dept, theme, index, total}`(허브 부제 커리큘럼 좌표, 감사 #8). 여정과 같은 journey(Locate → Tracks의 주제 이름·부서 → Steps에서 상황 순번/전체, 한 상황 두 회차는 한 번, 주제 시험·보너스 퀴즈 제외). 주제 없는 상황은 키를 뺌. 계약 재생성 |
| `a2e0af2` feat(content) | 서버 — 선택 필드 `briefing.line`(허브 한 줄, `[[형광펜]]` 정확히 한 군데). 적재 검사 `ValidateHubLine`(번들 Validate). 없으면 허브는 brief를 형광펜 없이(§R3). 계약 재생성 |
| `189002e` feat(lesson) | 공용 조각 — `NbTag icon`(레벨 shield·위치 siren 11), `NbStamp topIcon`(완료 ✓), `NbIcon redo`(↺), 감정어 `lesson.hub.mood.*` 13개 × 4개 언어, `노트 자동저장`, `data/lessonHub`(부제·XP·한 줄 나누기), StepTrack 연결선·빗금·굵기 |
| (HUB) feat(lesson) | 허브 화면 — 아래 표 |

## 감사 허브 행 — 고친 것

| # | 고친 값 (출처 lesson.jsx) |
|---|---|
| 3 | 줄노트 27·55·… — 허브의 자체 줄 대신 `NbSheet`(ui.jsx L164) |
| 7 | 제목 lineHeight 1.1(23.1) (L55) |
| 8 | 부제 `ER · 주제 · n/N`(서버 `course`), marginTop 2, 자체 lineHeight 없음 (L56·L110). 좌표가 없으면 `briefing.dept` |
| 9 | 레벨 태그 10.5 + shield 11 (L110) |
| 15 | 폴라로이드 = `NbAvatar size 72`(72×78.75) 그대로, 84 상자 제거 (L116) |
| 19·20·21 | 위치 태그 red 10.5 + siren 11, Lv 태그·시간 태그 10.5 (L122–124) |
| 22 | NbTag 글자 크기는 `textStyle`로(T1), 아이콘은 `icon` |
| 23 | 한 줄 상황 형광펜 — `briefing.line`의 `[[…]]`을 `NbInline`(T4의 낱말 단위 형광펜, 55%→100% 띠·양 끝 2)로. Gaegu 15 soft, marginTop 8, lineHeight 21 (L126) |
| 26 | worried → `faceWorried`(새 아이콘, 결정 9). 나머지는 승인된 대체 그대로 |
| 27 | 감정 칩 한국어 감정어: 기분 13개 → 라벨 표(`짜증남`·`아픔`·`걱정됨`…, 4개 언어) (L131, 결정 9) |
| 28 | `+60 XP` — 콘텐츠의 `+ 120 XP`·`+60XP`를 `+{n} XP` 한 꼴로 (L131) |
| 29 | `노트 자동저장`(4개 언어) (L131) |
| 33·45·55 | 10.5 soft 문구에 자체 lineHeight 없음(`nbText.body`의 1.55 뺌) (L84·L100·L143) |
| 34·42·52 | `STEP n`·`done/total` 모노 굵게 자간 0(`nbText.monoBold`) (L82·L96·L145) |
| 40 | 건너뜀 카드 빗금 `-45deg rgba(62,54,43,.05) 0 4px, transparent 4px 9px` — 굵기 4, 행 방향 간격 9·√2, 오른쪽 아래에서 위상 (L79). 준비 중(empty) 카드는 빗금 없음(결정 3) |
| 41 | 건너뜀 아이콘 타일 flexShrink 0 |
| 43 | `STEP n`과 라벨 사이 공백 두 칸 → 별도 글자 marginLeft 6 (L83) |
| 49 | 진행 중 티켓 — 테두리 교체 대신 1px 종이 가장자리·그림자 유지 + 바깥 2.5px 링(절대 위치 −3.5, 모서리 0) (L90) |
| 54 | 메타 행 gap 6, 줄바꿈 없음 (L99) |
| 60 | 완료 도장 윗줄 ✓ — `NbIcon check`(도장 색, size·.17×1.25: 글리프 ✓가 em의 .75를, 아이콘 틱이 상자의 14/24를 칠하므로) (L103, 결정 4) |
| 70·71 | CTA `STEP n 이어서 ›` → `iconRight chevronRight`, `다시 풀기 ↺` → 새 `NbIcon redo` (L154, 결정 4) |
| 72·A1 | (T1에서 공용으로 고침 — 하드 그림자·`.nb-press` 0.06s) |
| 81 | StepTrack 건너뜀 빗금 굵기 3, 간격 7·√2 (L36) |
| 86 | StepTrack 진행 중 라벨 `Gaegu-Bold`(굵기 합성 아님) (L41) |
| 87 | **StepTrack 연결선: 실제로 끝낸(done) 단계 뒤만 초록 실선** — 건너뛴·준비 중 단계 뒤는 점선 (L43 `i < done`) |

## 감사 허브 행 — 남은 차이(행 번호와 이유)

| # | 남은 것 | 이유 |
|---|---|---|
| 1·2·67 | 탭바 없음, CTA bottom 30 | 결정 3(허브의 결정 4 유지) |
| 4 | 상태바 목업 | 구현 대상 아님 |
| 6·63·84 | `←`·`›`·`✓` 글리프 → NbIcon | 결정 4 |
| 8 | 부제가 네 토막이 아니라 세 토막(`ER · 주제 · n/N`) | 우리 커리큘럼에 '소주제' 층이 없다(주제 → 난이도 단계뿐). 핸드오프 예시의 `투약 안전 · 오류 예방`은 주제 이름 한 개(`환자 안전·오류 예방`)에 해당. 순번/전체 = 주제 안 상황 순번(여정 순서) |
| 10 | 레벨 판정이 온보딩 a/b/c가 아니라 CEFR | 서버 `levelSkips`와 같은 규칙(A* → 기초, B1 → 중급, 그 외 → 실전)이라 skip 집합과 어긋나지 않음. 바꿀 것 없음 |
| 17·34·42·52 | 모노 700 → SemiBold 600 | 글꼴 자산 없음 — T1 편차(사용자 결정 대기) |
| 19 | 위치 태그 내용이 `ER BAY 2`가 아니라 `ER · TRAUMA BAY #4` | 콘텐츠에 `room` 필드가 없고 `briefing.dept`가 이미 '부서 · 위치' 문자열이다. 꼴을 바꾸려면 29부서 브리핑 재저작 — 하지 않음 |
| 23 | 형광펜 한 줄이 실제로 보이려면 `briefing.line` 저작이 필요 | 결정 7: 화면 먼저. 지금 콘텐츠엔 `line`이 없어 brief(긴 문단)를 형광펜 없이 쓴다. ER 저작 때 함께(형식: `“환자 말” — 상황 [[할 일]] 설명하기`). 낱말 사이에서만 줄이 바뀐다(NbInline 규칙) |
| 24 | 칩 개수 가변(기분·XP 없으면 생략) | §R3 — 지어낸 문구 없음 |
| 26 | 기분별 아이콘 대체(pain→bandage, panic→siren, 그 외 speech) | 승인된 편차(v44 결정 4) |
| 30 | 칩 글자 넘치면 말줄임(CSS는 nowrap으로 넘침) | RN에서 줄바꿈 없이 넘치게 하는 확실한 방법이 없음. 사소 |
| 35·47·58·59·66 | 분모에서 empty 제외, 준비 중 카드, XP 대신 목표 개수, 서버 상태 판정 | 승인된 편차(v44 결정 3·4) |
| 65 | 카드 전체 탭 | 우리가 더한 것 — 유지(§0) |
| 75 | StepTrack 입력이 개수가 아니라 단계별 상태 | 구조(서버가 단계마다 판정). 결과는 핸드오프 규칙과 같음 |
| 82 | StepTrack empty가 todo 모양 | 승인된 편차(v44 결정 3) |
| 88 | StepTrack 점선이 4×2 조각 12개 | iOS는 한쪽만 점선 테두리를 못 그림(T1 §5 근사와 같은 사정). T8에서 대조 |
| 89 | StepTrack을 대화 화면에 둘지 | 결정 1 — STEP 화면에서 뺀다. **허브 아트보드에도 StepTrack은 없다**(lesson.jsx LessonHub) — 허브에 새로 넣지 않았다. 지금 쓰는 곳: `words.tsx`·`SentPassed.tsx`(T3·T4가 뺄 예정). 다 빠지면 호출처 0 — 지울지 사용자 확인 |

## 테스트

- 모바일: `lessonHub.test.tsx` 21개(새 13), `stepTrack.test.tsx` 10개(연결선 규칙 뒤집음, 빗금·굵기 새로), `nbUI.test.tsx` 태그 아이콘·도장 윗줄, `data/lessonHub.test.ts` 7개.
  새 동작마다 일부러 깨뜨려 실패 확인 — 허브 화면 변이 17종 전부 잡힘, NbTag 공백·topIcon 빼기 잡힘, StepTrack은 구현 전 4개 실패 확인.
- 서버: `TestLesson_carriesCourseCoordinate`(중복 제거를 빼면 4/6으로 실패 확인), `TestValidateHubLine`·`TestBundleChecksTheHubLine`(빈 구간 검사 빼면 실패 확인). `go test -count=1 ./...` 그린.
- (RESULT)

## 시뮬레이터로 확인할 것 (T8)

1. 진행 중 티켓의 바깥 링 — 종이 1px 가장자리가 링 안쪽에 남는지, 회전(±0.5°)과 함께 도는지, Android에서 링이 elevation 그림자 위에 그려지는지.
2. 태그 아이콘(shield·siren 11)의 세로 위치 — CSS는 인라인 svg가 글자 기준선에 앉아 약간 위로 뜬다. 우리는 가운데 정렬.
3. 완료 도장 ✓ 크기(8.5) — 핸드오프 캡처와 나란히.
4. 건너뜀 카드 빗금 밀도·위상(레벨 b/c 계정), StepTrack 건너뜀 원 빗금.
5. 부제 `ER · 환자 안전·오류 예방 · 3/34` 같은 좌표가 실제 서버에서 나오는지(개발 DB 재시드 불필요 — 응답 필드만), 긴 주제 이름의 말줄임.
6. `briefing.line`을 한 상황에 임시로 넣고 형광펜 띠(55%→100%, 양 끝 2)와 두 줄 줄바꿈.
7. `다시 풀기 ↺` 아이콘 모양(새로 그림) — 핸드오프 ↺ 글리프와 비교.
8. 감정 칩 문구 4개 언어(특히 de `Schmerzen`·`Konzentriert` 길이 — 칩 폭에서 말줄임 나는지).

## 다음 작업자에게

- ER 저작(T5 파이프라인)에 `briefing.line` 한 줄을 더해야 #23이 화면에 보인다. 규칙: `[[…]]` 정확히 한 군데, 비지 않음(Go `content/hubline.go`). 파이썬 검사기는 상황 브리핑을 읽지 않는다 — 브리핑은 시나리오 YAML에 직접 적는다.
- `NbIcon redo`를 새로 그렸다(파이썬 검사기 대체 목록에도 넣음).
