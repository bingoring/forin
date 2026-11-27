---
build-spec: curriculum-v3
part: business-logic-model
updated: 2026-09-09
---

# 비즈니스 로직 모델 — 커리큘럼 v3

## §1. 조립 알고리즘 (태그 → 주제 → 트랙)

입력: `themes.yaml`(주제 레지스트리) + 태그된 시나리오(각 `theme`, 파생 `dept`, `briefing.difficulty`,
collab이면 `collabWith`). 출력: `[]TrackGroup`(domain §5). 순수 함수 — I/O 없음, 결정적.

```
1. 주제별 상황 수집
   byTheme: map[themeKey][]Scenario   // 각 상황을 자기 theme 태그로 그룹핑
   태그 없는 상황 → orphans[]          // R3: 비어 있어야 함(테스트가 강제)

2. 각 주제를 Curriculum으로 조립
   for theme in themes.yaml (order 순):
       steps = byTheme[theme.key]
       tiers = groupByDifficulty(steps)          // Lv1/2/3, 빈 티어 생략 (R8)
       각 티어 내부 정렬 = ScenarioID 오름차순     // (R22 결정성)
       theme.Exam 이면 마지막에 boss(주제 시험) 스텝 추가 (R10)

3. 트랙으로 묶기
   core = track==core 주제들 (부서 무관, order 순) → "CORE" 트랙
   for dept in floors.go의 Tier 오름차순:
       track = [core 관문 참조]                    // 공통 코어를 앞단에 참조(중복 저작 아님, R13)
             + (track==depth && dept 일치, order 순)
             + (track==collab && dept 일치, order 순)
       track.Milestone = 부서 시험                  // R14
   결과: [CORE 트랙, 부서 트랙들...]                 // (domain §6 정렬)
```

**핵심 불변식(테스트):** ① `orphans`는 빈 슬라이스여야 한다(R3). ② 모든 상황은 정확히 한 트랙 경로에서
한 번 나온다(core는 참조로 공유되므로 진도 계산 시 1회만 카운트, §3). ③ 조립은 `theme` 태그만 읽고
`acuity`/`difficulty`로 **주제를 유추하지 않는다**(R7). ④ 같은 입력 → 같은 출력(R22).

## §2. 주제 레지스트리 씨앗 — `briefing.skills`에서 주제로 (P2 방법, P1은 형식만)

P1은 `themes.yaml`의 **형식**만 정한다. 실제 약 100개 주제 목록은 P2 산출물이며, 다음 방법으로 유도한다
(여기 적는 이유: P1 스키마가 P2를 지탱할 수 있는지 검증하기 위해).

- 상황은 이미 `briefing.skills`(444종, 예: 흉통 PQRST·SBAR·인계·낙상 예방·공감)를 갖는다. 이것이
  주제의 **씨앗**이다.
- P2 1단계 = **분포 실측**: (부서 × skill × difficulty) 교차표를 만들어 어떤 skill 묶음이 20개 이상
  상황을 갖는지 본다. 20개 이상 = 독립 주제 후보, 미만 = 인접 skill과 병합 또는 보강 생성 대상.
- 범용 skill(SBAR·낙상·감염·환자 교육·가족 소통)은 부서 교차로 나타나므로 `track: core`로 승격.
- 부서 고유 skill(ER 트리아지·ICU 승압제)은 `track: depth`.
- 타 부서 접점(인계·전화·이송)은 `track: collab` + `collabWith`.
- 결과를 `themes.yaml`로 확정하고, 각 상황에 `theme` 태그를 역으로 부여한다(반자동 매핑 후 검수).

> P1 검증 포인트: 스키마(theme 태그 + track/dept/order 레지스트리)가 이 씨앗 방법을 온전히 표현하는가?
> — core/depth/collab 3계층과 difficulty 계단이 skills 분포를 손실 없이 담는다. ✅

## §3. 진행 파생 (정거장·티어 상태)

신규 테이블 없음. `scenario_attempts`(state: cleared|attempted) + `LatestAttemptScenarioID`에서 파생한다
(curriculum-v2와 동일 원천, 주제 단위로 재계산).

```
clearedSet = ClearedScenarioIDs(uid)            // set[scenarioID]
latest     = LatestAttemptScenarioID(uid)

주제(Curriculum) 상태:
    total = 주제의 필수 스텝 수(quiz 제외; core는 참조여도 1회만)
    done  = 그중 clearedSet에 든 수
    state = passed(done==total) | here(latest가 이 주제) | open
티어 상태:
    앞 티어의 필수 스텝이 전부 cleared면 다음 티어 unlock, 아니면 다음 티어 스텝 = lock (R9)
    티어 안 스텝: cleared→done, 첫 미완료→now, 그 뒤→(같은 티어면 열림 / 다음 티어면 lock)
이어하기(Resume): R15~R18 순서로 정확히 1개 주제에 표시
부서 시험(Milestone): 트랙의 필수 주제 전부 passed → open
```

**core 이중 계산 방지:** 공통 코어 주제는 여러 부서 트랙에서 **참조**되지만 진도(XP·완료 수)는 주제
1개로만 센다. 트랙 응답에는 참조로 실리되, 완료 집계는 주제 키 기준 유일.

## §4. 페이로드 산정

- 문제: 주제 약 100개 × 상황 20~30개의 스텝 메타를 전부 실으면 2,000~3,000개 항목 → 과대.
- 해법(§3 NFR): `GET /me/curriculum`은 **트랙 + 주제 요약**만 싣는다. 주제 요약 = `{themeKey, name,
  track, dept, collabWith, done, total, state, tierCounts:[{difficulty, done, total}]}`. 상황(스텝) 개별
  목록은 **정거장 시트를 열 때** `GET /me/curriculum/theme/{key}`로 지연 로드.
- 산정: 주제 100개 × 요약 약 180B ≈ 18KB(압축 전). 현행(66커리큘럼 × 스텝 전량 ≈ 40KB)보다 작다. ✅
- 시트 지연 로드: 주제 1개 30스텝 × 약 120B ≈ 3.6KB/요청. 정거장 탭 시 1회.

## §5. 마이그레이션·배포

- **진도 마이그레이션 없음**(진도는 `scenario_attempts`에서 파생). 단 **콘텐츠 스키마 마이그레이션 1건**:
  `scenarios` 테이블에 `theme`·`collab_with` 컬럼 + `theme` 인덱스 추가(domain §1). 런타임이 DB에서
  시나리오를 읽으므로 조립기가 `theme`으로 그룹핑하려면 컬럼이 필요하다.
- `themes.yaml`(레지스트리)는 로드 시점 인메모리(하드코딩 카탈로그를 대체). 시나리오 `theme`/`collabWith`
  태그는 YAML → `cmd/seed` → DB 컬럼으로 실린다(기존 seed 경로에 컬럼만 추가).
- 계약 파괴(`buildings`→`tracks`, 신규 `/theme/{key}`): 서버 promote + 모바일 OTA 동시(01-deployment).
- 롤아웃 순서: (1) P2 태깅 완료·`themes.yaml` 확정 → (2) 조립·핸들러·계약 → (3) 클라이언트 소비.
  P1 코드는 **태그가 비어도 안전**해야 한다(태그 없으면 그 부서 트랙이 비고 테스트가 R3로 잡는다) —
  P2와 병행 개발 가능.

## §6. P2·P3 인터페이스 (P1이 노출하는 계약)

- **P2 ← P1:** `themes.yaml` 스키마(domain §2) + 시나리오 `theme`/`collabWith` 태그 스키마(domain §1) +
  불변식(R2 최소 20, R3 고아 0). P2는 이 형식을 채운다.
- **P3 ← P1:** `GET /me/curriculum` = `{tracks:[TrackGroup]}`(domain §5) + `GET /me/curriculum/theme/{key}`
  = `{tiers:[TierState]}`. 여정 지도는 정거장=주제, 트랙=부서, 상태=passed/here/open, 협업=collabWith,
  마일스톤=부서 시험을 이 계약에서 그린다(v41 08 §4 매핑).
