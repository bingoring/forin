---
build-spec: curriculum-v2
part: domain-entities
updated: 2026-08-18
---

# 도메인 엔티티 — 커리큘럼 v2

## §1. `Curriculum` (저작 단위)

`Chapter`를 대체한다. 층 하나에 3~4개가 놓인다.

```go
// Curriculum is one authored themed run of steps on one floor. It replaces the
// v19 Chapter: a floor used to be one chapter of 6 steps (leaving 4 of its 10
// topics reachable only from the department sheet), and now it is 3~4 curricula
// that between them use every topic on that floor.
type Curriculum struct {
    Key      string // 안정 식별자 — §3
    Name     string // 층별로 저작된 이름 ("접수와 트리아지"). 층 안에서 유일해야 한다
    Building string // "본관" — floors.go의 Building과 정확히 일치
    Floor    string // "1F"  — floors.go의 Label과 정확히 일치
    Where    string // "본관 1F 응급의료센터" — 엘리베이터 표기와 정확히 일치
    Steps    []Step
}
```

`Ch int`(전역 순번)은 **삭제한다**. 층 구조가 로드맵을 대체하므로 전역 번호가 가리킬 것이 없고,
번호가 남아 있으면 클라이언트가 다시 `CH.N`을 그리게 된다.

`Dept`(문자열 한 개)는 `Building`/`Floor`/`Where` 세 개로 쪼갠다. 지금은 `Dept: "본관 1F 응급의료센터"`
한 필드에 세 정보가 뭉쳐 있어 클라이언트가 층으로 묶을 수 없다 — 병합된 탭이 정확히 그것을 해야 한다.

## §2. `Step` (변경 없음 + 불변식 추가)

```go
type Step struct {
    Kind       string // dlg | quiz | event | boss
    Name       string
    ScenarioID string
}
```

**새 불변식 (D1이 생긴 이유):** `Name`은 `ScenarioID`가 가리키는 시나리오의 `title`과 **같은 것을 뜻해야
한다.** 완전 일치는 강제하지 않는다 — 시나리오 제목에는 페르소나 이름이 붙기 때문이다
(`"수술 동의 확인 — Mr. Garcia"`). 강제하는 것은 §business-rules R14의 접두 규칙이며, 테스트로 검증한다.

## §3. `Key` — 안정 식별자

```
<building>|<floor>|<slug>      예) "본관|1F|triage"
```

- `slug`는 저작 시 붙이는 ASCII 소문자 식별자다. **이름에서 생성하지 않는다** — 이름을 다듬으면 키가
  바뀌고, 홈의 이어하기가 가리키던 대상을 잃는다.
- 층 안에서 유일하면 충분하다(전역 유일은 `building|floor` 접두사가 보장한다).
- 이 키는 URL에 들어가지 않는다(딥링크는 `scenarioId`를 쓴다). 홈↔커리어 탭이 같은 커리큘럼을
  가리키는지 확인하는 용도다.

## §4. 해석된 상태

```go
type StepState struct {
    Kind, Name, ScenarioID string
    State    string // done | now | lock | optional
    Optional bool
}

type CurriculumState struct {
    Key, Name, Building, Floor, Where string
    Done, Total int
    State  string // done | doing | todo   ← lock 없음 (층 전부 열림)
    Next   string // 다음 필수 스텝 이름
    Resume bool   // 이어하기 대상. 전체에서 정확히 0개 또는 1개
    Steps  []StepState
}
```

`State`에서 `lock`이 사라진 것이 결정 1의 전부다. 커리큘럼 안의 `StepState`는 여전히 `lock`을 갖는다 —
순차는 스텝에만 남는다.

`Resume`을 **서버가 정한다.** 홈의 "오늘의 한 가지"와 커리어 탭의 이어하기 히어로가 같은 대상을 가리켜야
하고, 두 화면이 각자 계산하면 어긋난다. 판정은 §business-logic-model §3.

## §5. 응답 그룹

```go
type FloorGroup struct {
    Floor     string            `json:"floor"`
    Where     string            `json:"where"`
    Curricula []CurriculumState `json:"curricula"`
}

type BuildingGroup struct {
    Building string       `json:"building"`
    Floors   []FloorGroup `json:"floors"`
}
```

`GET /me/curriculum` → `{"buildings": [BuildingGroup...]}`.

**계약 파괴 변경이다.** 기존 응답은 `{"chapters": [...]}`였다. 이미 설치된 빌드는 `chapters`가 없으면
커리큘럼 탭이 빈 상태로 그려진다(클라이언트의 "필드가 없으면 그리지 않는다" 규율 덕에 크래시는 아니다).
따라서 **서버 배포와 모바일 OTA는 같이 나가야 한다** — 01-deployment.md에 기록한다.

## §6. 정렬

- 건물: `floors.go`의 첫 등장 순서 (= Tier 오름차순 그룹)
- 층: 그 건물 안에서 Tier 오름차순
- 커리큘럼: 저작 순서 (①②③)

세 정렬 전부 **맵 순회를 쓰지 않는다** — 카탈로그는 결정적이어야 한다(index §3 NFR).
