# 도메인 엔티티 — 커리큘럼 v3 라이브 전환 (P3-A)

> build-spec-index.md §2·§3의 포트·부품을 라인 단위 시그니처로 확정한다. 패키지 배치와 의존 방향을 명시해
> "다시 유도하지 않고 바로 구현 가능"하게 한다.

## 1. 패키지 배치 & 의존 방향

```
internal/domain/learning        // 포트 + 순수 값 타입 (의존 없음, 다른 패키지가 여기에 의존)
  ports.go        Journey 인터페이스, Progress, StepRef, GuideLevel
  policy.go       GuidancePolicy·TierUnlockPolicy·ExamPolicy 인터페이스 + 기본 구현
internal/curriculum/themed      // 조립 엔진 = learning.Journey 구현체 (기존 P1 코드 확장)
  engine.go       Engine struct: Catalog + 정책 주입, Journey 메서드 구현
  (assemble.go·resolve.go·theme.go·catalog.go·audit.go 는 기존)
internal/adapters/http          // 핸들러: learning.Journey 를 주입받음 (구체 패키지 import 제거)
```

의존 방향: `http → domain/learning ← themed`. 핸들러도 엔진도 **포트(도메인)에 의존**하고, 서로를 직접
의존하지 않는다(헥사고날). 이것이 "부품 교체" 구도의 뼈대다 — 엔진을 갈아끼워도 핸들러 무변경.

## 2. 값 타입 (learning 패키지)

```go
type ScenarioID string
type ThemeKey   string

// Progress — 한 사용자의 진도 스냅샷. 저장 방식과 무관한 순수 입력.
type Progress struct {
    Cleared   map[ScenarioID]bool // 통과한 시나리오
    Attempted map[ScenarioID]bool // 시도한 시나리오
    Passes    ClearedPasses       // 가이드/자유 패스 카운트 (기존 curriculum.ClearedPasses 이관)
    Latest    ScenarioID          // 최근 시도 (resume/here 판정)
    Locale    string
}

// StepRef — 여정 상의 한 지점. "다음/이어하기"가 가리키는 대상.
type StepRef struct {
    Scenario ScenarioID
    Theme    ThemeKey
    Kind     string // dlg | quiz | event | boss (S4: 열린 문자열)
    Found    bool
}

type GuideLevel string // full | hint | free (기존 curriculum.GuideLevel 이관)
```

`TrackGroup`·`CurriculumState`·`TierCount`·`Milestone` 은 themed 패키지의 기존 타입을 그대로 응답에 쓴다
(계약 형태). learning 포트는 이들을 반환값으로 노출하되, themed 타입을 import하지 않도록 **여정 응답 타입도
learning으로 이관**하고 themed가 이를 채운다(도메인이 형태의 주인). — 구현 시 타입 이동은 L1 첫 커밋.

## 3. 포트 — learning.Journey

```go
// Journey — 라이브 학습 경험의 유일한 도메인 포트. 구현체는 themed.Engine 하나.
type Journey interface {
    // 여정 목록 (구 curriculum.Group + ResolvePasses 대체). CORE→부서 순, 부서별 코어가 트랙을 이끔.
    Tracks(p Progress) []TrackGroup

    // 방금 끝낸 시나리오 다음에 할 것 (구 NextScenarioAfter). 없으면 Found=false.
    Next(p Progress, justFinished ScenarioID) StepRef

    // 이어하기 지점 (구 resume 로직). 전부 통과면 Found=false.
    Resume(p Progress) StepRef

    // 시나리오의 가이드 레벨 (구 GuideForScenario). 정책 부품에 위임.
    Guidance(s ScenarioID, p Progress) GuideLevel

    // 시나리오 → 주제/스텝 매핑 (구 KeyForScenario·resume 매핑). 없으면 ok=false.
    Locate(s ScenarioID) (ref StepRef, ok bool)
}
```

- **순수성**: 모든 메서드는 부팅 캐시(`Catalog`)와 인자 `Progress`만으로 계산. I/O 없음. 테스트가 쉽고
  결정적(특성 테스트로 v2와 대조 가능 — §8 리스크).
- **부서/주제 확장**: 메서드 시그니처는 부서 수·주제 수와 무관. 새 부서는 데이터로만 들어온다.

## 4. 정책 부품 (learning 패키지, 교체 가능 — S5)

정책을 조립·해석 본문에서 떼어 작은 인터페이스로 둔다. 엔진은 생성 시 주입받고, 기본 구현을 제공한다.

```go
// GuidancePolicy — 패스 수에 따른 스캐폴딩 레벨. (구 guide.go: Passes/GuideForPass)
type GuidancePolicy interface {
    Level(clearedGuided, clearedFree bool) GuideLevel
}

// TierUnlockPolicy — 난이도 티어 해금 조건. (구 resolve.go: prevTierDone)
type TierUnlockPolicy interface {
    Unlocked(prevTierDone bool) bool
}

// ExamPolicy — 주제 시험(boss) 부여 규칙. (구 Theme.ExamOn 기본 true)
type ExamPolicy interface {
    HasExam(t Theme) bool
}
```

기본 구현(`DefaultGuidance`·`DefaultTierUnlock`·`DefaultExam`)은 현행 동작을 1:1 재현한다. 규칙을 바꾸고
싶으면 새 구현을 주입 — 엔진 코드 무수정(L-U2).

## 5. 구현체 — themed.Engine

```go
type Engine struct {
    cat    *Catalog          // 부팅 시 Assemble 결과 캐시 (레지스트리 + 태그)
    guide  learning.GuidancePolicy
    unlock learning.TierUnlockPolicy
    exam   learning.ExamPolicy
    index  map[ScenarioID]StepRef // Locate/Next 용 역인덱스 (부팅 시 1회 구축)
}

func NewEngine(cat *Catalog, opts ...Option) *Engine // 기본 정책 주입, opts로 교체

func (e *Engine) Tracks(p) []TrackGroup     // = Resolve(cat.Curricula, deptOrder, ...)
func (e *Engine) Next(p, justFinished) StepRef  // 역인덱스로 justFinished의 주제/티어 찾고, 그 학습 순서상 다음 미통과 스텝
func (e *Engine) Resume(p) StepRef          // = setResume 로직을 StepRef로 노출
func (e *Engine) Guidance(s, p) GuideLevel  // = e.guide.Level(...)
func (e *Engine) Locate(s) (StepRef, bool)  // = e.index[s]
```

- **역인덱스**(`index`)가 Next/Locate의 핵심. Assemble 직후 모든 스텝을 순회해 `ScenarioID→StepRef`를 만든다.
  이로써 "방금 끝낸 시나리오의 주제·티어·위치"를 O(1)로 찾고, 같은 주제 학습 순서상 다음 미통과 스텝을 준다.
- **부팅 캐시 무효화**: 콘텐츠/레지스트리는 부팅 시 로드(기존 Catalog). UGC(S1)로 런타임 추가가 필요해지면
  Catalog에 증분 반영 훅을 두되(그 자체가 seam), 이번 스펙 범위는 부팅 캐시로 한정.

## 6. 삭제 대상 (전환 완료 시 — §5)

| 파일/심볼 | 대체 |
|---|---|
| `internal/curriculum/curriculum.go` (Resolve·Group·NextScenarioAfter·ResolvePasses) | learning.Journey / themed.Engine |
| `internal/curriculum/guide.go` (GuideForScenario·Passes·GuideForPass) | GuidancePolicy |
| `internal/curriculum/resume.go` (KeyForScenario·CoveredDeptCodes) | Engine.Locate / Catalog |
| `internal/curriculum/authored_*.go` (하드코딩 89 커리큘럼) | 레지스트리+태그 조립 |
| `internal/curriculum/catalog_gen.go` + `cmd/gencontent/curriculum.go` | 삭제(생성 안 함) |
| `internal/curriculum/catalog_content_test.go` (TestEveryStepNamesItsContent) | 엔진 불변식(Audit 확장) |

이관/삭제 후 `grep -r 'internal/curriculum"'` 잔존 0(컴파일러가 보증). `ClearedPasses`·`GuideLevel` 등
재사용 타입은 learning 패키지로 **이동**(복제 아님 — 누더기 방지).
