---
build-spec: curriculum-v3-audit
part: business-logic-model
updated: 2026-09-09
---

# 비즈니스 로직 모델 — P2 전수조사 파이프라인

## §1. 7단계 파이프라인

부서 단위로 순회한다(vertical slice: ER을 끝까지 먼저 → 파이프라인 검증 → 나머지 28개 팬아웃).

```
1. 측정(Measure)      audit 도구로 (부서 × Topic × 난이도) 분포 + 손저작 목록 실측
2. 묶음 초안(Cluster) Topic 2~3개를 주제로 묶어 ≥20 자연 묶음 도출 → themes.yaml 초안
3. 배정(Assign)       depts*.go의 각 Topic에 Theme 배정 + 생성기가 theme emit
4. 손저작 태깅(Tag)   scn-*.yaml 303개에 theme 부여(반자동 매핑 후 검수)
5. 정리(Prune)        중복·비현실·저품질 제거 후보 → 부서 검수 승인 → 반영
6. 보강·세분화(Fill)  thin(<20) 주제는 인접 병합 또는 Topic/페르소나 추가; 과광범위는 분할
7. 검증(Validate)     재생성 + seed + 게이트: 고아 0(R3) & 주제당 ≥20(R2) 그린
```

각 단계는 부서별로 독립 커밋 가능하며, 미완 부서는 P1 조립에서 빈 트랙으로 남는다(부분 태깅 안전).

## §2. audit 도구 (`cmd/audit`)

콘텐츠를 읽어(파일 또는 DB) 사람이 큐레이션에 쓸 리포트를 낸다. **읽기 전용, 콘텐츠를 바꾸지 않는다.**

출력(부서별):
- **분포표**: Topic별 (시나리오 수 · 난이도 스프레드 · skills). 20 넘는 자연 묶음 후보 하이라이트.
- **고아 목록**: `theme=''`인 시나리오 id(초기엔 전량; 진행에 따라 줄어듦).
- **중복 후보**: 동일/근접 제목(Topic 간, 손저작↔생성 간). v2 D7 재점검.
- **thin 리포트**: 배정 후 20 미만인 주제.
- **커버리지**: 주제 없는 Topic, 레지스트리에 없는 theme 값(정합성).

구현: `contentfile.Load(dir)` 또는 `ListScenarioTags`를 재사용. 출력은 사람이 읽는 표 + 머신용 JSON(선택).

## §3. 자동 태깅 경로 (생성 시나리오 ≈2,741)

`Topic`에 `Theme string` 추가 → 각 Topic에 소속 주제 key 배정 → `generateDept`가 시나리오 생성 시
`sc.Theme = t.Theme` (+ collab Topic이면 `sc.CollabWith = t.CollabWith`) emit → `gen-*.yaml` 재생성.

```go
// banks.go
type Topic struct {
    Title, Tagline, Room, Brief, Role string
    Diff int
    Skills, Phrases, Goals, Guard []string
    Moods []string
    Acuity string
    Theme  string // ← 신규: 이 Topic이 속한 주제 key (themes.yaml의 key)
    CollabWith string // ← track=collab Topic에만: 상대 부서 코드
}

// main.go generateDept 내부, 시나리오 생성부
scns = append(scns, content.Scenario{
    // ...기존 필드...
    Theme:      t.Theme,
    CollabWith: t.CollabWith,
})
```

불변식 테스트(`gencontent`): ① 모든 Topic에 `Theme != ""`. ② 모든 Topic.Theme가 themes.yaml에 존재.
③ collab Topic만 CollabWith 있음. 이 셋이 그린이면 생성 시나리오는 고아가 없다.

## §4. 수동 태깅 경로 (손저작 303)

`scn-*.yaml`은 생성기를 거치지 않으므로 파일에 직접 `theme:` 추가. 규모가 작아(303) 반자동으로:

1. audit가 각 손저작 시나리오의 제목·skills를 가장 가까운 Topic/주제와 매칭해 **후보 theme**를 제안.
2. 사람이 부서별로 검수·확정(제목 접두사가 대개 Topic과 일치하므로 대부분 자명).
3. 미매칭은 새 주제 후보로 올리거나(레지스트리 추가) 정리 대상(§5)으로 분류.

손저작 태그는 **파일에 커밋되는 유일한 수동 산출물**이다(생성분은 코드에서 파생).

## §5. 정리(Prune) — 무엇을 제거하나

제거는 **규칙으로 후보를 뽑고, 부서 검수에서 승인**한다(R-P2-7). 후보 규칙:
- **중복**: 제목·persona·difficulty가 사실상 동일한 시나리오(생성기 혼합기수 이전 잔여, v2 D7 유형).
- **주제 미귀속**: 어떤 주제로도 자연스럽게 묶이지 않고 20 묶음을 못 이루는 고립 Topic.
- **비현실/저품질**: 임상적으로 발생 개연이 낮거나 학습 가치가 없는 것(도메인 판단 — 사용자 승인).

제거는 **Topic 레벨에서** 한다(해당 Topic을 depts*.go에서 조정) → 재생성으로 시나리오에 반영. 손저작은
파일 삭제.

## §6. 시나리오 id 안정성 — 진도 보존의 핵심 제약

진도는 `scenario_attempts.scenario_id`에서 파생된다(P1 R21). 생성기는 시나리오를 **위치 순번**으로
번호매긴다(`main.go` `id := SCN-<Code>-<idStart+idx>`). 따라서 **Topic을 목록 중간에서 제거·재배치하면
그 뒤 모든 id가 밀려**, 기존 사용자의 cleared 기록이 다른 상황을 가리키게 된다.

정책(R-P2-8) — **정본 재발급으로 확정(사용자 결정 2026-09-09):**
- 정리·보강 후 전체를 **정본 재생성**하며 시나리오 id를 새로 매긴다. append-우선 제약을 두지 않으므로
  Topic을 자유롭게 재배치·제거·추가한다.
- **진도 리셋을 수용한다.** 현재 스토어 미출시·TestFlight 내부(`project_ios_testflight_pending`)라 영향이
  작다. 라이브 전환(P3) 배포 노트에 "커리큘럼 v3 정본 전환 — 진도 초기화"를 명시한다.
- 재생성 후 **id 매핑 diff를 audit로 출력**해 무엇이 어디로 갔는지 확인한다(품질 점검용, 진도 보존용이
  아님).

## §7. 검증 게이트 (P2 완료 정의)

전체 부서 완료 후:
- `TestNoOrphans_fullContent`(R3): themes.yaml + 태그된 전 시나리오로 Assemble → `orphans == 0`.
- `TestThemeDepth`(R2): 모든 주제의 시나리오 수 ≥ 20(예외는 명시 허용 목록에만).
- `gencontent` 불변식(§3): 모든 Topic에 유효 Theme.
- audit 리포트: 중복 0(또는 승인된 잔여만), thin 0.

이 게이트가 그린이면 P1 조립이 실제 여정을 낸다 → P3(UI) + 라이브 전환으로 진행.

## §8. P1·P3 인터페이스

- **P1 ← P2:** themes.yaml(레지스트리 형식은 P1 domain §2)와 시나리오 `theme`/`collabWith` 태그를 채운다.
  P1 조립·엔드포인트는 무변경 — 데이터만 채워지면 트랙이 나온다.
- **P3 ← P2:** 태깅 완료로 `/me/curriculum/tracks`가 실데이터를 반환하게 되어 여정 지도가 그릴 대상이
  생긴다.
