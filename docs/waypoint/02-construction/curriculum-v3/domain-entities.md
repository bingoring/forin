---
build-spec: curriculum-v3
part: domain-entities
updated: 2026-09-09
---

# 도메인 엔티티 — 커리큘럼 v3

## §1. 시나리오 태그 스키마 (조립의 입력)

각 상황(`content/nurse/scenarios/*.yaml`)에 조립용 태그를 둔다. `dept`는 id에서 파생되고
(`SCN-<DEPT>-*`), `difficulty`는 이미 `briefing.difficulty`(1·2·3)에 있으므로 **신규는 `theme` 한
개(+ 협업이면 `collabWith`)뿐**이다.

```yaml
# 최상위에 추가 (briefing 밖)
theme: er-pain-assessment      # 주제 키. themes.yaml의 key와 정확히 일치. 필수(태그 안 된 상황은 고아)
collabWith: ICU                # track=collab인 주제의 상황에만. "이 상황을 내 부서 시점에서 접하는 상대 부서"
```

- **한 상황은 정확히 한 주제에 속한다** — 주제=학습 단위이므로 상황이 두 곳에 나오면 진도 계산이 겹친다.
- `theme`이 없는 상황은 조립에서 빠진다. P2 완료 후 테스트가 "태그 없는 상황 0"을 강제한다(R3).
- `difficulty`는 주제 안 난이도 계단(Lv1/2/3)의 축이다. 태그가 아니라 기존 필드를 그대로 읽는다.

## §2. `Theme` (주제 레지스트리 항목)

`content/nurse/themes.yaml`이 주제의 진실이다. 상황 태그는 어느 주제에 속하는지만 말하고, 주제의
**이름·트랙·순서·시험**은 레지스트리가 정한다. curriculum-v2의 `Curriculum`(저작 단위)을 대체한다.

```yaml
# themes.yaml (발췌 — 실제 목록은 P2 산출물)
- key: er-pain-assessment       # 안정 식별자. 상황의 theme 태그가 이 값을 참조. 이름에서 생성하지 않는다
  name: 통증 사정               # 표시 이름(층/트랙 안에서 유일)
  nameKey: theme.er.pain        # i18n 키(다국어는 후속). 없으면 name을 폴백
  track: depth                  # core | depth | collab
  dept: ER                      # depth·collab일 때 필수. core는 부서 무관이므로 생략
  order: 20                     # 트랙 안 정렬(작을수록 먼저). 맵 순회 대신 이 값으로 결정적 정렬
  exam: true                    # 주제 끝 '주제 시험' 마일스톤 유무(기본 true)
```

```go
type Theme struct {
    Key, Name, NameKey string
    Track  string // core | depth | collab
    Dept   string // depth·collab: 부서 코드. core: "" (전 부서 공유)
    Order  int
    Exam   bool
}
```

**트랙 3계층(U3):**

- `core` — 전 부서 공유 주제(SBAR 인계·낙상 예방·감염 관리·환자 교육·가족 소통 등). 부서 트랙마다
  중복 저작하지 않고 **한 번** 정의해 모든 부서 트랙 앞단(공통 코어 관문)에 참조된다.
- `depth` — 부서 고유 심화 주제(ER 통증 사정·트리아지·소생 등). `dept`로 부서에 매인다.
- `collab` — 타 부서 접점을 **내 부서 시점의 상황**으로 다루는 주제(ER→ICU 인계 등). `dept`=내 부서,
  상황의 `collabWith`=상대 부서. v41의 "협업 정거장"(파란 점선 링 + "협업 · A→B").

## §3. `Curriculum` (조립 결과 — 저작이 아니라 파생)

v2에서 `Curriculum`은 손저작 단위였다. v3에서는 **주제 하나가 곧 커리큘럼**이며, 태그된 상황을 모아
**조립**된다(저작 아님). 여정 지도의 정거장 1개에 대응한다.

```go
// Curriculum is one theme, assembled from every scenario tagged with its key.
// It is not authored as a list of steps; it is the group of situations that
// declared this theme, ordered into difficulty tiers.
type Curriculum struct {
    Theme  Theme
    Tiers  []Tier // 난이도 계단. 보통 Lv1/Lv2/Lv3 (해당 난이도 상황이 있을 때만)
}

type Tier struct {
    Difficulty int      // 1 | 2 | 3
    Steps      []Step   // 이 난이도의 상황들 (조립 시 id 오름차순으로 결정적 정렬)
}

type Step struct {
    Kind       string // dlg | quiz | event | boss(주제 시험) — 기존 값 유지
    Name       string // 상황 title에서 파생(페르소나 접미 제거). 손저작 불필요 → v2 R15 결함 원천 소거
    ScenarioID string
}
```

- **v2 D1/R15 결함 소거:** 스텝 이름을 손으로 안 쓰고 시나리오 `title`에서 파생하므로, "스텝 이름이
  실제 시나리오와 무관"할 여지가 없다.
- **주제 시험:** `Theme.Exam`이면 마지막 티어 뒤에 `boss` 스텝(주제 시험)이 붙는다. 부서 트랙 전체의
  '부서 시험'은 트랙 레벨 마일스톤(§5)이며 주제 시험과 별개다.
- 클라이언트에 보이는 실제 플레이 수는 기존과 동일하게 `dlg`/`event`가 guided+free 2패스로 확장된다
  (`guide.go`/`Runs()`). "상황 20~30개"는 authored 상황 수 기준이고, 런은 그 약 2배다.

## §4. 해석된 상태 (진행 파생)

```go
type StepState struct {
    Kind, Name, ScenarioID string
    State    string // done | now | lock | optional
    Optional bool   // quiz
}

type TierCount struct { // 목록 응답에 실리는 티어 요약(스텝 없음 — 페이로드 절약, §NFR)
    Difficulty  int
    Done, Total int
    Unlocked    bool // 앞 티어 통과로 열렸는지(R9)
}

type CurriculumState struct { // = 정거장 요약(목록 응답). 스텝 개별은 지연 로드
    ThemeKey, Name, Track, Dept string
    CollabWith string      // track=collab일 때 상대 부서(여정의 "협업 · A→B" 라벨)
    Done, Total int        // 필수 스텝 기준(quiz 제외)
    State  string          // passed | here | open   ← lock 없음(트랙/주제는 전부 열림, R9)
    Tiers  []TierCount     // 난이도 계단 요약(카운트만)
    Resume bool            // 이어하기 대상. 전체에서 0 또는 1 (R14)
}

// 정거장 시트를 열 때만: GET /me/curriculum/theme/{key} → 스텝 개별 상태
type TierState struct {
    Difficulty  int
    Done, Total int
    Unlocked    bool
    Steps       []StepState
}
type ThemeDetail struct {
    ThemeKey, Name string
    Tiers []TierState
}
```

- **정거장 상태 매핑(v41):** `passed`=PASSED 이중선 도장(주제의 모든 필수 스텝 done), `here`=HERE
  깃발(이어하기가 가리키는 주제), `open`=열린 원(아직 손 안 댐, 잠기지 않음). v41의 `locked`는 **주제
  레벨엔 없다**(R9) — 잠금은 주제 안 난이도 계단(앞 티어 미통과 시 다음 티어 `lock`)에만 존재.
- 진행은 `scenario_attempts`에서 파생(신규 테이블 없음). 주제 완료 = 그 주제 태그를 가진 필수 상황이
  전부 cleared.

## §5. 응답 그룹 (트랙 계층)

```go
type TrackGroup struct { // 부서(또는 공통 코어) 하나의 여정 트랙
    Dept       string            `json:"dept"`       // "ER" · 공통 코어는 "CORE"
    Building   string            `json:"building"`   // 여정↔캠퍼스 위치 연결(floors.go 기준)
    Floor      string            `json:"floor"`
    Where      string            `json:"where"`
    Curricula  []CurriculumState `json:"curricula"`  // [코어 관문 참조] → depth들 → collab들, order 순
    Milestone  *Milestone        `json:"milestone,omitempty"` // 트랙 끝 '부서 시험'
}

type Milestone struct {
    Name  string `json:"name"`   // "ER 구간 시험"
    State string `json:"state"`  // passed | open (트랙의 필수 주제 전부 passed면 open→응시 가능)
}
```

`GET /me/curriculum` → `{"tracks": [TrackGroup...]}`. **계약 파괴 변경**(기존 `{"buildings":[...]}` →
`{"tracks":[...]}`): 서버 promote + 모바일 OTA 동시 배포.

## §6. 정렬 (전부 결정적, 맵 순회 없음)

- 트랙: 공통 코어(CORE) 먼저, 그다음 부서 트랙을 `floors.go`의 Tier 오름차순.
- 트랙 안 주제: `core 관문 참조 → depth → collab`, 각 그룹 안에서 `Theme.Order` 오름차순.
- 주제 안 티어: `Difficulty` 오름차순.
- 티어 안 스텝: `ScenarioID` 오름차순.
