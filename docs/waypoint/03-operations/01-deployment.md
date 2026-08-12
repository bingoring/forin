---
phase: 03-operations
stage: 01-deployment
status: AI_PROPOSED
updated: 2026-08-12
---

# [Stage 3-1] Deployment

## 목적

forin 서버(Go)와 모바일(RN/Expo)의 배포 파이프라인을 정의·구축한다. **재현 가능하고 롤백 가능하게**, 그리고
**GCP 콘솔을 클릭하지 않고**(IaC) 환경을 세울 수 있게 한다.

## 입력 (Inputs)

- 아키텍처 결정: [`../01-inception/03-architecture-decision.md`](../01-inception/03-architecture-decision.md)
- 기술 PRD 호스팅/배포 절: [`../prd-tech.md`](../prd-tech.md) — "최종 선택 게이트"였던 호스팅 타깃을 본 스테이지에서 확정
- Construction 산출물 (Phase 2) · 리뷰 게이트 통과분 (Phase R)
- 기존 자산: `server/Dockerfile`(distroless) · `.github/workflows/{server,contract}.yml` · `server/db/migrations`(20) ·
  `server/scripts/e2e_smoke.sh`(57 assert) · `mobile/eas.json`(프로필 3종, EAS 프로젝트 `78c4eab3…`)

## 체크리스트

- [ ] 모노레포 경로 필터 CI (mobile/server 독립 배포)
- [ ] 서버 배포 (호스팅 타깃·컨테이너·환경 변수·DB 마이그레이션)
- [ ] 모바일 배포 (EAS Build/Submit, 환경 분리, OTA 업데이트 정책)
- [ ] 계약 코드젠 검증을 릴리스 게이트에 포함
- [ ] IaC — GCP 리소스 전부를 Terraform으로 (콘솔 수동 작업 배제)

## AI 제안 (AI Proposal)

> ⚠️ 이 섹션은 AI가 작성합니다. 사람이 직접 수정하지 마세요.

### 0. 착수 전 감사 — 현재 실제 상태

설계 전에 코드로 확인한 사실들. 이 스테이지의 공백은 여기서 정의된다.

| 항목 | 현재 |
|---|---|
| 서버 CI | `server.yml`(vet·test·build) + `contract.yml`(계약 드리프트 게이트) — master/PR, 경로 필터 있음 |
| **모바일 CI** | **없음.** tsc·jest 213개가 로컬에서만 돈다 |
| 컨테이너 | `server/Dockerfile` 멀티스테이지 → distroless nonroot, 8080. 준비됨 |
| 배포 단계 | **없음.** CI는 검증까지만 하고 어디에도 올리지 않는다 |
| 마이그레이션 | 20개. `golang-migrate` **CLI** 의존(`make migrate-up`), `go.mod`에 라이브러리 없음 |
| 콘텐츠 | `server/content` 6.8MB, `cmd/seed`가 `CONTENT_DIR`에서 로드 |
| 설정 | 환경변수 16종. 그 중 **진짜 시크릿은 4종**(`JWT_SIGNING_KEY`·Anthropic·OpenAI·Azure Speech) + DB 비밀번호. 소셜 클라이언트 ID 3종은 공개 식별자이므로 시크릿으로 취급하지 않는다(앱 바이너리에도 들어 있다) |
| **Redis** | **경성 필수** — `config.go:85`에서 `REDIS_URL` 없으면 부팅 실패 |
| dev 백도어 | `/auth/dev`는 `router.go:50`에서 `Env == "dev"`로만 등록, 모바일 폴백도 `__DEV__` 가드(`client.ts:43`). **프로덕션 유출 경로 없음** — `ENV=prod`만 지키면 된다 |
| 헬스 | `GET /healthz`(live) · `GET /readyz`(ready) 이미 있음 |

### 1. 호스팅 타깃 — Cloud Run + Cloud SQL (asia-northeast3 서울)

`prd-tech.md`가 "Fly.io 또는 Render 권고, 최종 선택 게이트"로 남겨둔 것을 **Cloud Run + Cloud SQL(서울)** 로 확정한다.

- **리전**: 사용자가 한국 간호사이므로 서울 리전이 반사 지역 최소(RTT ~10ms). 검증한 대안들은 아시아 커버가 부족했다 —
  **Fly.io는 도쿄(nrt)까지만**(서울 ICN 없음), **Render는 아시아가 싱가포르 단독**(~75ms).
- 다만 AI 대화는 LLM 제공자가 미국이라 어차피 태평양을 건넌다. 리전이 실제로 좌우하는 건 **홈 집계·커리큘럼·클리어 같은
  비-AI 왕복의 체감**이다. 이 근거로 리전을 고른 것이며 "AI가 빨라진다"고 기대해서가 아니다.
- **scale-to-zero**: 출시 전·초기 저트래픽 구간의 컴퓨트 비용이 사실상 0. 대신 콜드스타트가 있으므로 prod는
  `min-instances=1`로 두어 첫 사용자가 지연을 먹지 않게 한다(staging은 0).
- **Redis는 Memorystore가 아니라 Upstash(도쿄)**. 용도가 캐시·레이트리밋·일일 리셋·refresh 토큰이라 초단위 지연에 물리지
  않는데, Memorystore는 가장 작은 구성도 고정비가 붙고 Cloud Run이 VPC 커넥터를 거쳐야 한다. `redis.ParseURL`(go-redis v9)이
  `rediss://`를 그대로 파싱하므로 **코드 변경 없이** 붙는다.

### 2. 이미지 하나, 엔트리포인트 셋

`Dockerfile`이 `/api`·`/migrate`·`/seed` 세 바이너리를 빌드하고 `content/`를 담는다. Cloud Run **서비스**가 `/api`,
Cloud Run **Job** 2종이 `/migrate`·`/seed`를 **같은 이미지 다이제스트로** 실행한다.

- **왜 하나의 이미지인가**: 마이그레이션과 그 마이그레이션을 필요로 하는 코드가 원리적으로 어긋날 수 없다. 이미지 두 개로
  나누면 "어느 마이그레이션까지 적용된 DB에 어느 코드가 붙어 있는가"를 사람이 기억해야 한다.
- **`cmd/migrate` 신설**: `//go:embed`로 `db/migrations`를 이미지에 넣고 golang-migrate를 **라이브러리로** 쓴다. Cloud Run
  Job은 CLI를 설치할 자리가 없고, 임베드하면 마이그레이션 파일이 이미지에 고정되어 "런너의 로컬 파일"에 의존하지 않는다.
  `make migrate-up`(CLI)은 로컬 개발용으로 남긴다.
- **DB 연결**: Cloud Run의 Cloud SQL 연결(`--set-cloudsql-instances`)로 유닉스 소켓을 붙이고 `DATABASE_URL`은
  `postgres://user:pass@/forin_prod?host=/cloudsql/<conn>` 형태. DB에 공인 IP를 열지 않는다.

#### 2.1 "어떤 마이그레이션을 적용할지"는 사람이 판단하지 않는다

**DB가 스스로 기억한다.** golang-migrate는 대상 DB에 `schema_migrations(version, dirty)` 테이블을 만들고 마지막으로
적용한 버전을 적어둔다. `up`은 *그 버전보다 큰 파일만 번호순으로* 적용한다. 그래서:

- **새로 만든 prod DB**는 버전이 없으므로 **000001~000020을 순서대로 전부** 적용한다.
- 이미 20까지 적용된 DB에 000021이 추가되면 **000021만** 적용한다.
- 같은 Job을 두 번 돌려도 두 번째는 적용할 것이 없어 무해하다(멱등). 동시 실행은 드라이버가 Postgres **advisory lock**을
  잡으므로 둘이 겹쳐 적용되지 않는다.

번호는 000001~000020 연속이고 결번·중복이 없음을 확인했다(40파일 = up 20 + down 20). 데이터 이관이 들어 있는 000020도
빈 DB에서 안전하다 — `INSERT … SELECT FROM user_progress`가 0행을 옮기고, 드롭 대상 3컬럼은 000003이 만들어 둔다.

**진짜 주의할 것은 `dirty` 플래그다.** 마이그레이션이 중간에 실패하면 golang-migrate는 버전을 dirty로 표시하고 **이후
모든 실행을 거부한다**. 자동 복구되지 않으므로 Job이 실패한 채 멈춘다 — 이건 **의도된 동작**이다(반쯤 적용된 스키마 위에
다음 마이그레이션을 얹는 것보다 멈추는 게 낫다). 대신 배포가 사람 개입 없이는 안 풀리므로 다음을 설계에 포함한다:

1. `/migrate`는 시작·종료 시 **현재 버전과 dirty 여부를 로그로 남긴다** — 실패 시 어디서 멈췄는지 즉시 보이게.
2. **복구 절차를 문서화한다**: 실패한 마이그레이션의 부분 적용분을 손으로 되돌린 뒤 `force <이전버전>`으로 dirty를 풀고
   재실행. 이 절차는 3-2 운영 문서에 런북으로 남긴다.
3. 그래서 **staging에서 먼저 돌린다** — prod에서 dirty를 만나는 것보다 staging에서 만나는 게 훨씬 싸다. 파이프라인이
   staging → 스모크 → prod 순인 첫 번째 이유가 이것이다.

### 3. 파이프라인 (GitHub Actions + Workload Identity Federation)

**PR 게이트** (경로 필터 유지)
- `server.yml` — vet · test · build *(기존)*
- `contract.yml` — 계약 재생성 후 드리프트 실패 *(기존, 릴리스 게이트로 승격)*
- **`mobile.yml` 신설** — tsc · jest 213. 지금은 모바일 검증이 CI에 전혀 없다.

**master push → 배포** (`deploy.yml` 신설)
1. 이미지 빌드 → Artifact Registry `asia-northeast3-docker.pkg.dev/forin-504711/forin/api:<sha>`
2. staging `migrate` Job 실행
3. staging Cloud Run 배포
4. **staging에 `e2e_smoke.sh` 57 assert 실행** — 실패하면 여기서 멈춘다
5. **prod 승격 = 수동 승인**(GitHub Environment). 솔로라도 스키마가 붙은 배포에는 사람 확인 한 번을 남긴다
6. prod `migrate` Job → prod `--no-traffic` 배포 → 트래픽 승격

**인증**: Workload Identity Federation. 서비스 계정 JSON 키를 GitHub Secrets에 넣지 않는다 — 키는 유출되면 회수 시점을
알 수 없고 만료도 없다. GitHub Secrets에는 프로젝트 ID·WIF provider 경로만 둔다.

**시크릿**: Secret Manager에 두고 Cloud Run `--set-secrets`로 주입. 값은 리비전에 박히지 않고 참조로만 남는다.

### 3.1 환경은 셋이고, 그중 둘만 클라우드에 있다

| 환경 | 어디 | DB | 용도 |
|---|---|---|---|
| **dev** | 로컬 `docker-compose`(이미 있음) | 컨테이너 Postgres 16 + Redis 7 | 일상 개발·기능 검증. `ENV=dev`, `/auth/dev` 활성 |
| **staging** | Cloud Run(scale-to-zero) | 공유 인스턴스의 `forin_staging` | **Cloud Run 고유 설정** 검증 + 마이그레이션 리허설 + 스모크 |
| **prod** | Cloud Run(`min-instances=1`) | 공유 인스턴스의 `forin_prod` | 실사용 |

**별도의 클라우드 "dev/test" 환경은 두지 않는다.** 로컬 compose가 이미 dev이고(prd-tech의 "개발=프로덕션 동일 환경"이
Docker로 달성된 지점), 세 번째 클라우드 환경은 staging과 역할이 겹친다. 대신 **경계를 분명히 해둔다**: 로컬에서
검증할 수 없는 것이 정확히 staging의 존재 이유다 — WIF 인증, Secret Manager 주입, Cloud SQL 유닉스 소켓 연결,
Cloud Run Job 실행, 콜드스타트·타임아웃. 이건 compose로 흉내낼 수 없다.

### 3.2 staging↔prod 분리 수준 — 논리적으로 완전, 물리적으로 공유

같은 Cloud SQL **인스턴스**의 **다른 데이터베이스**(`forin_staging` / `forin_prod`)이고, **DB 사용자도 환경별로 따로**
두어 각자 자기 데이터베이스에만 권한을 준다.

**완전히 분리되는 것**
- 데이터. Postgres의 database 경계는 단단하다 — 다른 데이터베이스의 테이블은 조회 자체가 불가능하다(FDW를 일부러 걸지 않는 한).
- 접근 권한. staging 사용자는 `forin_prod`에 붙을 수 없다. **애플리케이션 버그가 반대편 환경 데이터를 건드릴 경로는 없다.**
- 시크릿·서비스 계정·Cloud Run 리비전·Redis(Upstash DB 2개 분리).

**공유되어 남는 것 (이게 이 선택의 실제 대가다)**
1. **컴퓨트·커넥션.** staging이 인스턴스 CPU/메모리/커넥션을 먹으면 prod가 느려진다. 완화: staging은 스모크만 돌고
   상시 트래픽이 없으며, 커넥션 풀 상한을 낮게 고정한다. 부하 테스트는 **이 인스턴스에서 하지 않는다**(하려면 별도 인스턴스).
2. **백업·PITR 단위가 인스턴스다.** prod만 특정 시점으로 되돌리려면 "새 인스턴스로 복원 → `forin_prod`만 덤프해서
   적재"가 된다. 복구는 가능하지만 절차가 한 단계 길다.
3. **인프라 변경을 staging에서 먼저 볼 수 없다.** Postgres 메이저 업그레이드·머신 타입 변경·유지보수 창은 인스턴스 단위라
   두 환경에 동시에 적용된다. 그걸 미리 리허설하려면 인스턴스가 둘이어야 한다.

**판단**: 지금은 prod 트래픽이 0이고 검증하려는 건 스키마와 Cloud Run 배선이므로 공유가 맞다. 위 3번이 문제가 되는
시점(실사용자 + DB 버전 업그레이드)에 인스턴스를 분리한다 — Terraform에서 **tfvar 하나**로 전환되도록 모듈을 쓴다.

### 3.3 비용 — staging의 증분은 사실상 0, 고정비는 Cloud SQL이 전부

| 항목 | staging 증분 |
|---|---|
| Cloud Run(staging) | scale-to-zero. 스모크 실행 시간만 과금 → **월 $1 미만** |
| Cloud SQL | **+$0 고정비** — 인스턴스를 공유하므로 늘어나는 건 데이터베이스 하나의 **스토리지**뿐(수백 MB 규모 → 센트 단위) |
| Upstash Redis(staging) | 요청량 과금. 스모크 수준이면 무료 구간 |
| Artifact Registry | 같은 이미지를 두 환경이 공유 → **+$0** |

즉 **staging을 두는 대가는 월 1~2달러 수준**이고, 이 설계의 고정비는 사실상 **Cloud SQL 인스턴스 하나 + prod의
`min-instances=1`** 둘이다. 공유 코어(`db-f1-micro`급) 인스턴스는 일반적으로 월 $8~10 구간으로 알려져 있으나
**서울 리전 실단가는 확인하지 않았다** — 스토리지·백업·이그레스가 별도 과금이고, 공유 코어는 SLA 대상이 아니라는
점도 함께 감안해야 한다. `terraform plan` 전에 공식 가격 계산기로 확정할 항목으로 남긴다(§10).

> **prod `min-instances=1`이 두 번째 고정비**라는 점은 의식적인 선택이다. 0으로 두면 컴퓨트가 거의 무료지만 하루 첫
> 사용자가 콜드스타트를 먹는다. 실사용자가 생기기 전까지는 0으로 두고, 베타 테스터를 받는 시점에 1로 올리는 것도 방법이다.

### 4. 롤백 정책 — 코드는 즉시, 스키마는 전진만

- **코드**: Cloud Run 리비전이 남으므로 `gcloud run services update-traffic --to-revisions=<PREV>=100`으로 즉시 복귀.
  재빌드·재배포가 필요 없다.
- **스키마는 자동 롤백하지 않는다.** down 마이그레이션이 20개 전부 대칭으로 있지만, 롤백은 장애 중에 실행되는 절차이고
  down은 데이터를 지울 수 있다. 무엇을 잃는지 판단할 여유가 없는 시점에 파괴적 작업을 자동화하지 않는다.
- 대신 **정책으로 막는다: 마이그레이션은 하위호환으로만 쓴다.** 컬럼 추가는 nullable → 백필 → *다음* 릴리스에서 NOT NULL/제거.
  그러면 이전 리비전 코드가 새 스키마에서 항상 동작하므로 **코드 롤백만으로 복구가 완결된다.** 이것이 스키마 롤백을
  포기하는 대가로 얻는 불변식이다.

### 5. 콘텐츠 시드 가드

`ContentRepo.Seed`는 단일 트랜잭션 안에서 `DELETE` 6종 → `INSERT`, 즉 **교체(replace)** 의미다.

- 사용자 진행도는 안전하다: `user_progress`·`review_cards`·`conversation_sessions`의 `scenario_id`가 **FK 없는 `text`**
  (`000003_progress.up.sql:21`)라 콘텐츠 삭제가 cascade하지 않는다. 이는 감사로 확인했다.
- 그러나 시드가 ID를 **없애면** 진행도·복습 카드가 dangling 참조가 된다. 그래서 **시드 전 게이트**를 둔다:
  새 번들의 시나리오 ID 집합이 **(커리큘럼이 참조하는 173개 ∪ DB에 실재하는 `scenario_id`)를 포함**하는지 검사하고,
  아니면 실패시킨다. 콘텐츠는 늘어나기만 하는 게 정상이고, 줄어드는 배포는 사고일 확률이 높다.
- 시드는 배포 파이프라인의 자동 단계가 **아니다.** 콘텐츠 변경 시 수동 트리거(`workflow_dispatch`)로 돌린다 — 코드 배포마다
  전체 콘텐츠를 교체할 이유가 없다.

### 6. 모바일 — 환경 분리 + OTA

- **`eas.json` 환경 분리**: `preview` → `EXPO_PUBLIC_API_URL`=staging, 채널 `preview` / `production` → prod, 채널 `production`.
  현재 `client.ts:10`이 `EXPO_PUBLIC_API_URL ?? 'http://localhost:8080'`이라 프로필에 값이 없으면 **localhost로 조용히
  폴백한다** — 스토어 빌드에서 이건 즉시 전면 실패다. 프로필별 명시 주입으로 막는다.
- **`expo-updates` 도입 + `runtimeVersion: { policy: "fingerprint" }`**. 카카오 SDK·애플 인증·expo-audio 등 네이티브 모듈이
  있으므로 `appVersion` 정책은 위험하다 — 네이티브 의존이 바뀐 JS를 구버전 바이너리에 밀어넣을 수 있다. fingerprint는
  네이티브 지문이 변하면 OTA를 자동 무효화한다.
- **OTA 정책**: JS-only 수정만 `eas update`. 네이티브 변경은 새 빌드. OTA도 prod 승격과 **같은 승인 게이트**로 취급한다 —
  스토어 심사를 우회하는 경로이므로 오히려 더 조심해야 한다.
- **테스트 트랙까지가 본 스테이지 범위**: `eas build --profile production` + `eas submit`. 스토어 **본심사**·메타데이터·
  개인정보 라벨은 3-1에서 제외한다 — 실제 출시 사정에 묶이면 이 스테이지가 끝나지 않는다.

#### 6.1 정식 출시 전 다른 사람에게 앱을 주는 것 — 가능하고, Android는 사실상 **필수**다

**iOS (TestFlight)**
- **내부 테스터 최대 100명**: 심사 없이 즉시 설치. 단 **App Store Connect 계정 사용자여야** 해서 지인·간호사 지망생에게
  주기엔 번거롭다. 본인 기기 여러 대엔 이게 가장 빠르다.
- **외부 테스터 최대 10,000명**: 공개 링크로 뿌릴 수 있어 실사용자 베타에 적합하다. 대신 **각 버전의 첫 빌드가
  Beta App Review를 통과**해야 한다(하루 정도 여유를 봐야 함). 빌드는 **90일 후 만료**된다.

**Android (Play Console)**
- **내부 테스트 최대 100명**: 심사 대기 거의 없이 배포.
- ⚠️ **여기에 중요한 제약이 있다.** 새로 만든 **개인(personal) 개발자 계정**은 프로덕션 접근 권한을 얻으려면
  **비공개(closed) 테스트에서 12명 이상의 옵트인 테스터를 14일간** 유지해야 한다. **내부 테스트는 이 요건에 카운트되지
  않는다.** 즉 Android는 "테스터에게 나눠주기"가 선택이 아니라 **출시 경로의 필수 관문**이고, 최소 2주의 리드타임이 붙는다.
- 계정이 조직(organization) 계정이거나 이 요건 시행 이전 계정이면 해당되지 않는다 → **계정 유형 확인이 필요하다**(§10).

**설계에 미치는 영향**: 이 요건 때문에 테스터 배포는 "3-1이 끝난 뒤의 별도 일"이 아니라 **3-1의 출력물**로 다룬다.
`eas submit`이 두 트랙(TestFlight 외부 그룹 / Play 비공개 테스트)에 올릴 수 있게 배선하고, 테스터가 붙는 빌드는
**staging이 아니라 prod API**를 가리켜야 한다(실데이터·실LLM 비용이 붙는다는 뜻이므로 3-2 모니터링의 비용 계측이
그 전에 필요하다). 반대로 `preview` 프로필(staging API)은 **본인·내부 확인용**으로 남긴다.

### 7. IaC — `infra/terraform/`

**단일 루트 모듈**이 staging·prod를 함께 선언한다. 공유 Cloud SQL 인스턴스가 실제로 하나이므로 상태를 환경별로 쪼개면
그 공유물의 소유자가 애매해진다.

Terraform이 만드는 것:
- 프로젝트 API 활성화(run·sqladmin·secretmanager·artifactregistry·iam)
- Artifact Registry 리포지토리
- **Cloud SQL 인스턴스 1개 + 데이터베이스 2개**(`forin_staging`·`forin_prod`) + 사용자 2명 — 고정비를 인스턴스 하나로 묶고
  환경 분리는 데이터베이스 경계로 얻는다(분리 수준과 대가는 §3.2). **인스턴스 분리 전환은 tfvar 하나**로 되게 모듈화한다
- Secret Manager 시크릿 **컨테이너**(값 제외)
- Cloud Run 서비스 2개 · Cloud Run Job 4개(migrate·seed × 2환경)
- 서비스 계정 + 최소 IAM: 런타임 SA(Cloud SQL client·secret accessor)와 배포 SA를 분리
- **WIF 풀/프로바이더 + GitHub 리포 바인딩** — CI가 키 없이 배포할 수 있게
- Upstash Redis 2개(`upstash/upstash` 프로바이더, 도쿄)

**부트스트랩 치킨-에그**: 원격 상태 버킷이 Terraform 이전에 있어야 한다 → `make infra-bootstrap`이 GCS 버킷 **하나만**
gcloud로 만들고, 그 이후 전부 Terraform. 자격은 로컬 1회 `gcloud auth application-default login`(CLI, 콘솔 아님) →
`terraform apply`가 WIF까지 만들고 이후 CI는 무키 배포.

**IaC로 자동화할 수 없는 경계** (콘솔 클릭 0은 불가능하므로 명시한다):
1. **Upstash 계정 가입 + API 키 발급**(웹) — 그 뒤 DB 2개는 Terraform
2. **시크릿 값** — Terraform은 컨테이너만 만들고 값은 `make secrets`(gcloud CLI)로 주입. LLM·Azure 키 자체는 사람이 가져온다
3. **Apple App Store Connect API 키 · Google Play 서비스 계정** — Apple/Google 포털엔 IaC가 없다. `eas submit` 자격증명은 1회 수동
4. GCP 프로젝트 `forin-504711`은 이미 존재 — 프로젝트·결제 생성 단계는 불필요

### 8. NFR / 운영 주의

- **Redis는 로그인 경로의 경성 의존**이다. `RefreshStore`가 refresh 토큰 해시를 TTL 30일로 들고 있어(`redis/redis.go`),
  Redis 소실 = 전 사용자 재로그인. 캐시로 착각하지 않는다. Upstash의 영속성 옵션을 켜고, 3-2 모니터링에서 가용성을 계측 대상에 넣는다.
- **`ENV=prod` 필수**. 이 값이 `dev`로 새면 `/auth/dev` 인증 우회가 공개된다. Terraform이 Cloud Run env에 고정하고,
  스모크가 prod에서 `/auth/dev`가 **404**임을 검사한다.
- prod `min-instances=1` — 콜드스타트를 첫 사용자에게 전가하지 않는다. staging은 0.
- 콘텐츠 6.8MB가 이미지에 들어가므로 이미지 크기·빌드 캐시를 확인한다(distroless + 정적 링크라 여유 있음).

### 9. 구현 분해

한 번에 다 하지 않는다. 두 덩어리로 나누면 각각 독립적으로 검증 가능하다.

- **9-A 서버 배포**: `cmd/migrate`(임베드) → Dockerfile 3바이너리 → `infra/terraform`(+ 부트스트랩·시크릿 주입) →
  `deploy.yml`(staging 자동 → 스모크 → prod 수동 승격) → 시드 가드. 완료 판정 = **staging에 스모크 57/0**.
- **9-B 모바일 배포**: `mobile.yml`(tsc·jest 게이트) → `eas.json` 환경 분리 → `expo-updates` + fingerprint 정책 →
  테스트 트랙 제출(§6.1). 완료 판정 = **`preview` 설치본이 staging API에 붙어 동작**.

9-A가 먼저다 — 9-B의 `EXPO_PUBLIC_API_URL`이 9-A가 만드는 staging URL을 필요로 한다.

**Android 12명/14일 요건(§6.1)은 리드타임이 2주**이므로, 이 요건에 해당하는 계정이면 **9-B 직후 비공개 테스트를 열어
시계를 먼저 돌려놓고** 그 2주 동안 3-2 모니터링을 진행하는 편이 낫다.

### 10. 미해결 질문

- 커스텀 도메인(`api.forin.app` 등)을 3-1에서 붙일지, Cloud Run 기본 URL로 시작할지 — 도메인 보유 여부에 달려 있다.
- GitHub Environment 승인 규칙 자체를 Terraform GitHub 프로바이더로 관리할지(PAT 필요) 또는 리포 설정으로 둘지.
- **Google Play 개발자 계정이 개인(personal)인지 조직인지** — 개인이면 §6.1의 비공개 테스트 12명/14일 요건이 걸리고
  출시 일정에 2주가 선행 조건으로 붙는다.
- **Cloud SQL 서울 리전 실단가**(머신 타입·스토리지·백업) — §3.3의 고정비 추정을 `terraform plan` 전에 공식 계산기로 확정.
- prod `min-instances`를 처음부터 1로 둘지, 베타 테스터를 받는 시점에 0→1로 올릴지.

## 검토 게이트 (Human Gate)

- [ ] 배포 절차가 재현 가능하고 롤백 가능한가?
- [ ] 시크릿·환경 분리가 안전하게 구성되었는가?

## 다음 단계

승인 후 → `STATUS.md` 갱신 → `02-monitoring.md`로 이동
