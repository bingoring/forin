# 구현 계획 — 커리큘럼 v3 라이브 전환 (P3-A)

> build-spec-index.md §7 단계를 작업 단위로 전개한다. 각 단계는 독립적으로 green(빌드·테스트 통과)이며
> 커밋 가능하다. TDD·작은 커밋. 서브모듈(waypoint) 먼저 → 부모(forin) 순.

## 전제 & 순서 근거

- ONCO·GERI(및 이후 부서) 콘텐츠의 green 착지는 **L1→L2→L4**에 게이트된다(L-U1: 부서별 카탈로그 패치 금지).
  따라서 순서는 "전환 먼저, 그다음 콘텐츠 재개"다. 단 L1은 additive라 기존 라이브 무영향으로 먼저 안전하게 쌓는다.
- 각 단계 끝에 `go build ./... && go test ./...` + (해당 시) 계약 드리프트 0 + 모바일 tsc/jest.

---

## L1 — 도메인 포트 + 엔진 구현 (additive, 라이브 무영향)

**파일**
- 생성: `internal/domain/learning/ports.go`, `internal/domain/learning/policy.go`
- 이동: `curriculum.ClearedPasses`·`GuideLevel` → learning (구 파일에는 별칭 임시 유지 X — 참조를 옮긴다)
- 생성: `internal/curriculum/themed/engine.go`
- 이동: 여정 응답 타입(TrackGroup·CurriculumState·TierCount·Milestone)을 learning으로 옮기고 themed가 채움
- 테스트: `internal/curriculum/themed/engine_test.go`, `internal/domain/learning/policy_test.go`

**단계**
- [x] L1.1 learning 값 타입·`Journey` 포트·`Journeys`(직업군 조회, S7)·정책 인터페이스 작성(domain-entities.md §2~4). 컴파일만.
- [x] L1.2 기본 정책(`DefaultGuidance`·`DefaultTierUnlock`·`DefaultExam`)을 구 guide.go 동작 1:1로 이식 + 단위 테스트.
- [x] L1.3 `themed.Engine`: 부팅 시 역인덱스 구축, `Tracks`(=기존 Resolve 위임)·`Resume`·`Locate` 구현 + 테스트.
  `themed.Registry`(직업군→Engine, `learning.Journeys` 구현)도 이때 작성(현재는 nurse 하나 등록, S7).
- [x] L1.4 `Engine.Next(p, justFinished)`: 역인덱스로 주제·티어 위치 찾고 학습 순서상 다음 미통과 스텝 반환 + 테스트.
- [x] L1.5 `Engine.Guidance` = 정책 위임 + 테스트.
- [ ] **특성 테스트(R-L11)**: 동일 `Progress` 입력에 대해 v2 `NextScenarioAfter`/`GuideForScenario`와
  `Engine.Next`/`Guidance` 출력을 대조. 차이가 나는 케이스를 표로 남기고 "의도된 차이"만 승인.
- [x] L1.6 커밋: `feat(learning): 도메인 포트 + themed 엔진(Next/Resume/Guidance/Locate) — additive`.

**green 게이트**: 신규 테스트 통과, 기존 전체 테스트 무회귀, 라이브 동작 무변경(아직 핸들러 미배선).

---

## L2 — 핸들러 컷오버 + `/me/curriculum` 어댑터 + 계약

**파일**
- 수정: `internal/adapters/http/progress_handler.go`(curriculum·curriculumTracks가 `learning.Journey` 사용)
- 수정: `conversation_handler.go`(Next/Guidance를 포트로), `home_handler.go`·`content_handler.go`(참조 이전)
- 수정: `internal/domain/handoff/handoff.go`(포트 참조)
- 수정: DI 조립부(핸들러 생성자에 `learning.Journey` 주입)
- 생성: `internal/adapters/http/curriculum_legacy.go`(TrackGroup→BuildingGroup 순수 매핑 어댑터)
- 재생성: 계약(swag, 고정 버전)

**단계**
- [x] L2.1 핸들러 생성자 시그니처에 `learning.Journeys` 추가, DI에서 themed.Registry 주입. 요청마다 사용자
  직업군으로 `journeys.For(prof)`. **`cmd/api`의 themed Catalog `"nurse"` 하드코딩(현 `main.go:117`)을
  `content/<prof>/` 순회로 대체**(S7·R-L16) — 현재는 nurse 하나지만 순회 구조로 둔다.
- [x] L2.2 `curriculumTracks`를 포트의 `Tracks`로 전환(themed 직접 호출 제거).
- [x] L2.3 `conversation_handler`의 `NextScenarioAfter`→`journey.Next`, `GuideForScenario`→`journey.Guidance`.
  특성 테스트(L1.5)가 동작 보존을 보증.
- [x] L2.4 `/me/curriculum`을 어댑터(TrackGroup→BuildingGroup)로 재구현. 구 `ResolvePasses`/`Group` 호출 제거.
- [x] L2.5 home·content·handoff의 v2 참조를 포트/Locate로 이전.
- [x] L2.6 계약 재생성 + 드리프트 0 확인. 모바일 tsc/jest.
- [x] L2.7 커밋: `refactor(curriculum): 라이브 소비를 learning 포트로 컷오버 + /me/curriculum 어댑터`.

**green 게이트**: 서버·모바일 테스트, 계약 드리프트 0, `grep 'internal/curriculum"' internal/adapters` = 0
(cmd/seed·gencontent는 L4에서 정리).

> ✅ **L2 완료(2026-09-20).** 게이트 전부 통과 — adapters의 v2 import 0건 · `go vet`·`test -count=1 ./...`
> 그린 · 계약 무드리프트(구 형태 필드 전부 동일) · 모바일 tsc 0 · jest 907/907.
>
> 계획서가 정하지 않아 진행 중 결정한 것 넷:
> 1. **포트에 `Steps(theme, p)`를 더했다.** `TrackGroup`은 난이도별 개수만 담는데 라이브 클라이언트의 층
>    시트가 `steps`·`next`를 그리고 있어, 문구대로 매핑하면 한 릴리스 동안 스텝 목록이 빈 채 나간다.
>    이 메서드는 P3-B의 정거장 시트가 쓸 지연 로드와 같은 것이라 버려지지 않는다(사용자 결정).
> 2. **층 지도를 `internal/domain/campus`로 옮겼다.** `cmd/gencontent`(package main) 안에 있어 임포트할 수
>    없었다. 손저작 4개 층(본관 1F·P1·3F·4F)을 더해 24개 층 전체를 담고, gencontent는 `Authored`로 거른다.
> 3. **주제 이름 955개를 영어로 번역했다.** v2는 커리큘럼 이름 89개가 번역돼 있었는데 v3 주제는 0개라
>    컷오버가 영어 커버리지를 줄이는 상황이었다. `themes.yaml`의 `nameKey`는 i18n 키로 쓸 수 없다 —
>    `theme.core.safety` 하나가 29부서의 서로 다른 이름을 가리켜 한 문자열이면 28개가 틀린다. **주제 키**로
>    키잉했다(`internal/i18n/theme_en.go`).
> 4. **캠퍼스 뷰의 이어하기 폴백.** 엔진의 이어하기가 층이 없는 부서(GEN)에 떨어지면 이 화면은 그 자리를
>    그릴 수 없다. 엔진의 답은 그대로 두고 화면이 보여 줄 수 있는 첫 자리로 포인터만 옮긴다.
>
> 요청마다의 직업군 해석은 `journeyFor` 한 곳으로 모으되 오늘은 `"nurse"`를 돌려준다. 직업군은 토큰이
> 아니라 사용자 행에 있어 매 요청 읽으면 대화 채점·시나리오 조회 같은 뜨거운 경로에 질의가 하나 더 붙는데,
> 아직 답이 달라질 수 없다. 두 번째 직업군이 실리면 토큰에 `job`을 실어 이 함수에서 읽는다.

---

## L3 — 클라이언트 여정/홈 이행 (P3-B와 합류)

> 이 단계는 P3-B(여정 지도 UI) 스펙과 합류한다. 여기서는 계약 소비 전환만 규정.

- [ ] L3.1 모바일 여정/홈이 tracks 형태(TrackGroup)를 소비하도록 화면 배선. 구 `/me/curriculum` 의존 제거.
- [ ] L3.2 실기기 스모크(여정 진입·이어하기·다음 시나리오·가이드 레벨).
- [ ] L3.3 커밋 + OTA(preview 채널).

**green 게이트**: 모바일 테스트, 실기기 스모크. 이후 구 `/me/curriculum` 어댑터 삭제 가능 상태 도달.

---

## L4 — v2 은퇴 (삭제) + 엔진 불변식

**파일**
- 삭제: `internal/curriculum/`(authored_*.go·catalog_gen.go·curriculum.go·guide.go·resume.go·
  catalog_content_test.go 등 v2 전량)
- 수정: `cmd/gencontent/main.go`·`curriculum.go`(generateCurriculum·catalog_gen 쓰기 제거)
- 수정: `cmd/seed`(v2 ReferencedIDs 대신 엔진/Audit 기반 검증)
- 생성/확장: `internal/curriculum/themed/audit.go` 불변식 테스트(R-L14)

**단계**
- [ ] L4.1 `cmd/gencontent`에서 catalog 생성 제거, 관련 파일 삭제.
- [ ] L4.2 v2 패키지 삭제. 컴파일러가 잔존 참조를 잡음 → 전부 포트로 이관 확인.
- [ ] L4.3 구 가드 테스트 삭제, 엔진 불변식 테스트 추가(고아 0·주제≥임계·스텝 해석·부서 코어 리드).
- [ ] L4.4 `/me/curriculum` 어댑터 삭제(L3 이행 완료 시) 또는 deprecation 주석.
- [ ] L4.5 커밋: `refactor(curriculum): v2 하드코딩 카탈로그 은퇴 — 엔진 단일화`.

**green 게이트**: 전체 테스트, `grep -rn 'internal/curriculum"'` = 0, gencontent가 catalog_gen 미생성.
**이 지점부터 어떤 부서 seed 전환도 카탈로그 수동 재지정 불필요(R-L15).**

---

## L5 — DB 시드 + 승격

- [ ] L5.1 themes/tags를 DB에 시드(`cmd/seed` 확장) — 마이그레이션 000038 컬럼 활용.
      ⚠️ **L2가 이 단계의 선행 조건을 앞당겨 드러냈다.** 컷오버 뒤 라이브 캠퍼스 화면이 DB 태그에
      의존하므로, **시드 없이는 스테이징도 prod도 커리어 탭이 통째로 빈다.** `deploy.yml`은
      마이그레이션만 돌리고 시드는 수동(`seed.yml`)이다. 2026-09-20 현재 스테이징 미실행 · 배포 레드.
- [ ] L5.2 staging 배포 + 스모크(여정·다음·가이드 실경로).
- [ ] L5.3 prod 승격(수동 게이트) + prod 시드.
- [ ] L5.4 커밋 + STATUS 기록.

---

## 콘텐츠 fan-out 재개 지점

- **L4 완료 직후**, 대기 중이던 ONCO·GERI(및 남은 부서)를 seed 정본으로 커밋하면 **카탈로그 충돌 없이 green**.
  즉 라이브 전환이 콘텐츠 파이프라인을 다시 열어준다. (ONCO·GERI seeds는 이미 생성 완료·품질 검증됨.)

## 자체 점검 (스펙↔계획)

- 포트/타입: domain-entities.md의 시그니처가 L1 작업과 1:1 — OK.
- 규칙 커버리지: R-L1·L2(L2), R-L5·L6·L7(L1), R-L8~L10(seam, 상시), R-L11(특성테스트 L1.5), R-L13~L15(L4) — 전부 단계에 배정됨.
- 순서 의존: 콘텐츠 게이트(L1→L2→L4)를 §전제에 명시 — OK.
