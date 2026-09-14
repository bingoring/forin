---
build-spec: curriculum-v3-live
stage: 02-construction/06-screens-flows
status: AI_PROPOSED
depth: comprehensive
updated: 2026-09-14
supersedes: curriculum-v2 (런타임 소비 지점)
depends-on: curriculum-v3 (P1 엔진), curriculum-v3-audit (P2 콘텐츠)
---

# Build Spec — 커리큘럼 v3 · 라이브 엔진 전환 (P3-A)

> **구현 스펙(Build Spec)** = 코딩 전에 SoT를 라인 단위로 유도해 "다시 유도하지 않고 바로 구현 가능한"
> 수준으로 구체화한 것. (FRAMEWORK "구현 스펙")

## §0. 개요 & 범위

- **목표(한 줄):** 라이브 학습 경험(여정 목록·다음 시나리오·가이드 스캐폴딩·홈·인계)을 **v2 하드코딩
  커리큘럼 패키지(`internal/curriculum`)에서 데이터 기반 themed 엔진(`internal/curriculum/themed`)으로
  전환**하고, 그 소비 지점 전부를 **단일 도메인 포트** 뒤에 두어, 이후 어떤 기능을 붙이더라도 부품을
  끼웠다 뺐다 하듯 깔끔하게 확장되도록 구도를 정리한다. 전환이 끝나면 v2 패키지·하드코딩 카탈로그·
  `catalog_gen.go` 생성·가드 테스트를 **은퇴(삭제)**한다.
- **SoT:** 현재 코드(`internal/adapters/http/progress_handler.go`·`conversation_handler.go`·
  `home_handler.go`, `internal/curriculum/*`, `internal/curriculum/themed/*`) + P1/P2 스펙 + 사용자
  구술(2026-09-14): "확장이 가능해야 하고 누더기 코드를 남발하지 말 것, 추후 어떤 기능을 추가하더라도
  부품 붙였다 떼듯 구도가 깔끔할 것."
- **깊이 티어 & 사유:** `comprehensive` — 런타임 동작(다음 시나리오·가이드 레벨)이 바뀌고, 계약(API)과
  클라이언트 주 탭 소비가 바뀌며, 하나의 서브시스템(v2)을 삭제하고 다른 것(themed)으로 대체한다.

### 이 전환이 필요한 이유 (실측·구조)

| # | 결함 | 근거 |
|---|---|---|
| L-E1 | **부서를 seed 정본으로 전환할 때마다 v2 하드코딩 카탈로그가 깨진다.** gen 시나리오 id(`SCN-<D>-001xx`)를 스텝으로 직접 참조하는데, 정본 재발급이 그 id의 내용을 바꿔 `TestEveryStepNamesItsContent`가 실패한다. 이미 6개 부서에서 수동 재지정(커밋 `7b5c7ed`)이 필요했다 | `authored_annex2.go`가 `SCN-ONCO-001xx`·`SCN-GERI-001xx` 참조 |
| L-E2 | **두 엔진이 공존한다.** 라이브 `/me/curriculum`은 v2(`ResolvePasses`+`Group`), 여정 `/me/curriculum/tracks`는 themed. 같은 개념(진도·다음 단계)을 두 곳에서 계산한다 | `progress_handler.go:34,57` |
| L-E3 | **v2가 런타임 곳곳에 물려 있다.** 커리큘럼 화면뿐 아니라 대화 흐름(`NextScenarioAfter`·`GuideForScenario`), 홈, 인계, 시드가 v2 패키지에 의존한다. 핸들러가 구체 패키지를 직접 부른다(포트 없음) | `conversation_handler.go`·`home_handler.go`·`handoff.go`·`cmd/seed` |
| L-E4 | **하드코딩 카탈로그는 규모 한계다.** 부서 29개 × 주제 35 × 상황 21 규모에서 손저작 스텝 나열은 유지 불가. P2가 이미 조립으로 옮겼으나 라이브 소비가 아직 v2를 본다 | curriculum-v3 §0 E3 |

### 사용자 결정 (이 스펙의 전제)

| # | 결정 | 사유(사용자 구술) |
|---|---|---|
| L-U1 | **카탈로그 whack-a-mole은 부서별 패치가 아니라 라이브 전환으로 근본 해결한다** | AskUserQuestion(2026-09-14) "라이브 전환 먼저 (근본 해결)" |
| L-U2 | **확장성·깔끔한 seam이 최우선.** 부품을 붙였다 떼듯 구도가 깔끔해야 하며 누더기 코드를 남발하지 않는다 | "추후 어떤 기능을 추가하더라도 부품 붙였다 떼듯 구도가 깔끔하면 좋겠어" |
| L-U3 | **세부 설계는 설계자 판단에 위임** | "너가 옳다고 생각되는 방향으로 설계해봐" |

## §0.5 설계 원칙 (L-U2의 구체화)

1. **단일 포트, 단일 엔진.** 핸들러는 구체 패키지가 아니라 도메인 포트 하나(`learning.Journey`)에 의존한다.
   구현체는 themed 엔진 하나. 두 엔진 공존을 끝낸다(L-E2).
2. **모든 것은 (레지스트리 + 태그 + 진도)에서 파생되는 순수 함수.** 하드코딩 나열 0. 새 부서·주제·상황은
   데이터(themes.yaml + `theme` 태그)로 들어오고, 코드는 건드리지 않는다.
3. **정책은 교체 가능한 부품(strategy)으로 분리.** 가이드 스캐폴딩·티어 해금·주제 시험 규칙을 조립 로직에
   박지 않고 작은 순수 객체로 뺀다. 규칙 변경이 엔진 수술이 되지 않도록.
4. **확장 seam을 명시(S1~S6, §3).** 미래 기능(UGC 시나리오, 사용자 번들 커리큘럼, 새 트랙/스텝 종류)이
   붙는 자리를 지금 지정한다. seam은 "데이터가 더 들어오거나 부품이 하나 더 붙는" 형태이지, 기존 코드를
   고치는 형태가 아니다.
5. **은퇴는 삭제로 끝낸다.** 전환 후 v2 패키지·`catalog_gen.go` 생성·가드 테스트를 남기지 않는다. 죽은
   코드로 방치하지 않는다(누더기 방지).

## §1. 현재 결선 (as-is)

라이브가 v2 `internal/curriculum`를 소비하는 지점 (전환 대상):

| 소비자 | v2 호출 | 역할 |
|---|---|---|
| `progress_handler.curriculum` (`/me/curriculum`) | `ResolvePasses` → `Group` | 여정/건물 목록 뷰(BuildingGroup) |
| `progress_handler.curriculumTracks` (`/me/curriculum/tracks`) | (이미 themed `Catalog`) | 여정 트랙 뷰(TrackGroup) — 전환의 목표 형태 |
| `conversation_handler` | `NextScenarioAfter`, `GuideForScenario` | 다음 시나리오·가이드 레벨 |
| `home_handler` | (커리큘럼 상태 요약) | 홈 진척 |
| `handoff.go` | (참조) | 인계 맥락 |
| `cmd/seed`, `cmd/gencontent` | `ReferencedIDs`, `generateCurriculum`/`catalog_gen.go` | 시드 검증·카탈로그 생성 |

themed(v3)가 이미 제공: `Assemble(themes,tags)→[]Curriculum`·`Resolve(...)→[]TrackGroup`(states·tiers·
resume·milestone)·`Catalog`(부팅 캐시)·`Audit`. **공백**: 다음 시나리오·가이드 패스·resume-key/부서 매핑의
런타임 대응물이 themed에 아직 없다 → 이 스펙이 채운다.

## §2. 목표 구조 (to-be) — 도메인 포트 하나

핸들러가 의존하는 단일 포트를 `internal/domain/learning`에 둔다(상세 시그니처는 domain-entities.md):

```
// learning.Journey — 라이브 학습 경험의 유일한 도메인 포트.
type Journey interface {
    Tracks(p Progress, locale string) []TrackGroup       // 여정 목록 (Group 대체)
    Next(p Progress, justFinished ScenarioID) StepRef     // 다음 시나리오 (NextScenarioAfter 대체)
    Resume(p Progress) StepRef                            // 이어하기 지점
    Guidance(s ScenarioID, p Progress) GuideLevel         // 가이드 레벨 (GuideForScenario 대체)
    Locate(s ScenarioID) (ThemeKey, StepRef, bool)        // 시나리오→주제/스텝 (KeyForScenario 대체)
}
```

- **구현체**: `themed.Engine` 하나가 이 포트를 구현. 부팅 시 `Catalog`(레지스트리+태그 조립)를 1회 캐시하고,
  요청마다 진도를 오버레이해 순수 계산.
- **주입**: 핸들러는 생성자에서 `learning.Journey`를 받는다. 구체 패키지 import 제거.
- **정책 부품**: `GuidancePolicy`·`TierUnlockPolicy`·`ExamPolicy`를 엔진이 주입받는다(기본 구현 제공, 교체 가능).

이 포트가 §0.5-1의 "단일 포트"이자 L-U2의 "부품 구도"의 중심이다. 미래 기능은 (a) 포트 뒤 구현에 데이터를
더 흘리거나, (b) 정책 부품을 갈아끼우거나, (c) 새 포트 메서드를 더하는 형태로 붙는다. 핸들러·클라이언트는
그대로다.

## §3. 확장 seam (부품이 붙는 자리 — L-U2·L-U3)

| seam | 지금 | 미래 기능이 붙는 방식 | 엔진 변경? |
|---|---|---|---|
| **S1 콘텐츠 소스** | 저작(SCN-*)·생성 시나리오의 `theme` 태그를 repo 포트로 읽음 | **UGC 시나리오(USR-*)**·공유 시나리오가 같은 태그 스트림으로 유입. source/visibility 필드는 P2 §0.6에서 이미 seam | 없음(행만 늘어남) |
| **S2 주제 레지스트리 소스** | `themes.yaml` 파일 1개 | **사용자 번들 커리큘럼** = 사용자 스코프 주제 엔트리를 DB에서 파일 레지스트리와 합침. 레지스트리는 `[]Theme` 제공자 포트(파일 제공자 + 미래 DB/사용자 제공자 합성) | 없음(제공자 하나 추가) |
| **S3 트랙 종류** | `track`: core/depth/collab (열린 문자열) | 새 종류(personal·shared·exam-prep)는 레지스트리 엔트리 + 그룹핑/라벨 규칙만. 그룹핑은 이미 `dept` 기준으로 일반화됨 | 없음(데이터+라벨) |
| **S4 스텝 종류** | `Step.Kind`: dlg/quiz/event/boss (열린 문자열) | 새 종류(video·reading·reflection)는 kind 상수 + 클라이언트 렌더러. 조립은 kind에 무관 | 없음(상수+렌더러) |
| **S5 정책** | GuidancePolicy·TierUnlockPolicy·ExamPolicy 기본 구현 | 규칙 변경(패스 수·해금 조건·시험 유무)은 정책 부품 교체 | 없음(부품 교체) |
| **S6 진도 소스** | ProgressRepo 포트 | 저장 방식 변경(캐시·집계)은 포트 구현 교체 | 없음 |

**seam 판정 기준(누더기 방지)**: 어떤 미래 기능이 위 표의 "데이터 유입/부품 교체/포트 추가" 중 하나로
안 붙고 조립·해석 로직 본문을 고쳐야 한다면, 그건 seam이 부족하다는 신호다 — 그 시점에 seam을 하나 더
뽑되, 임시 분기(if 부서명 == ...)로 때우지 않는다. (v2 D6의 프록시 추론 실패를 반복하지 않는다.)

## §4. 계약·클라이언트 이행 (flag-day 없이)

- **정본 형태 = TrackGroup**(여정). BuildingGroup(건물/층 그룹)은 캠퍼스 화면용 **프레젠터**로 강등한다 —
  dept→건물 매핑으로 TrackGroup을 건물별로 묶는 순수 매핑(부품). 두 번째 엔진이 아니다.
- **`/me/curriculum`**(구 BuildingGroup 형태)은 전환 직후 한 릴리스 동안 엔진 위 **얇은 어댑터**로 유지 →
  클라이언트가 tracks로 이행한 뒤 삭제. 이중 엔진 없이 어댑터(제거 가능한 부품) 하나만 존재.
- 계약 재생성(`make` swag)은 사용자님이 고정한 swag 버전(`50798a3`)을 따른다. 계약 드리프트 게이트 통과 필수.

## §5. v2 은퇴 (전환 완료의 정의)

전환이 "끝났다"의 정의:
1. `internal/curriculum`(authored_*.go·catalog_gen.go·curriculum.go·guide.go·resume.go) **삭제**.
2. `cmd/gencontent`의 `generateCurriculum`/`catalog_gen.go` 쓰기 **제거**.
3. 가드 테스트 `TestEveryStepNamesItsContent`(하드코딩 카탈로그 전제) **삭제** → 엔진 불변식으로 대체:
   저작(SCN-*) 고아 0 · 모든 주제 ≥ 임계 · 모든 스텝이 실재 시나리오·제목으로 해석됨(`Audit` 확장).
4. 이후 **어떤 부서를 seed로 전환해도 카탈로그 수동 재지정이 영원히 불필요**(L-E1 종결).

## §6. 프로그램 위치 & 의존

- P1(curriculum-v3): 주제 스키마 + themed 조립 엔진 — **완료**.
- P2(curriculum-v3-audit): 콘텐츠 정본 fan-out — **진행 중(11/29 + ONCO/GERI 대기)**.
- **P3-A(이 스펙): 라이브 엔진 전환** — v2 은퇴, 단일 포트.
- P3-B: 여정 지도 UI(클라이언트) — 이 전환의 tracks 형태를 소비.
- **콘텐츠 fan-out과의 관계**: L-U1(부서별 패치 금지) 때문에, ONCO 이후 부서 콘텐츠의 green 착지는
  P3-A의 L1~L2 + L4(가드 테스트 은퇴)에 **게이트**된다. 즉 이 전환이 콘텐츠 fan-out을 다시 풀어준다.

## §7. 단계 (요약 — 상세는 implementation-plan.md)

| 단계 | 산출물 | green 게이트 |
|---|---|---|
| L1 | `learning.Journey` 포트 + themed 구현(Next/Resume/Guidance/Locate) + 정책 부품 분리 | 엔진 단위 테스트(추가), 기존 테스트 무회귀 |
| L2 | 핸들러 컷오버(progress·conversation·home·handoff가 포트 주입) + `/me/curriculum` 어댑터 + 계약 재생성 | 서버·모바일 테스트, 계약 드리프트 0 |
| L3 | 클라이언트 여정/홈이 tracks 형태 소비(P3-B와 합류) | 모바일 테스트, 실기기 스모크 |
| L4 | v2 패키지·catalog_gen 생성·가드 테스트 삭제 + 엔진 불변식 테스트 | 전체 테스트, 잔존 v2 참조 0 |
| L5 | DB 시드(themes/tags) + 승격(promote) | staging 스모크, prod 시드 |

## §8. 리스크 & 완화

| 리스크 | 완화 |
|---|---|
| 다음 시나리오·가이드 레벨의 런타임 동작이 미묘하게 바뀜(기존 사용자 체감) | L1에서 v2와 themed의 Next/Guidance 출력을 **동일 입력으로 대조하는 특성 테스트**를 먼저 두고, 의도된 차이만 남긴다 |
| 클라이언트 계약 변경으로 구버전 앱 깨짐 | `/me/curriculum` 어댑터를 한 릴리스 유지(§4), OTA/네이티브 이행 후 삭제 |
| v2 삭제가 숨은 참조를 끊음 | L4 전 `grep internal/curriculum"` 잔존 0 확인, 컴파일러가 미참조 보증 |
| 진도 리셋 체감(정본 재발급 누적) | P2 R-P2-8 정본 재발급 결정과 동일 선상 — 별도 공지 불필요, STATUS에 기록 |
