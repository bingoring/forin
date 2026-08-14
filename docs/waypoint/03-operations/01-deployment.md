---
phase: 03-operations
stage: 01-deployment
status: AI_PROPOSED
updated: 2026-08-15
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

- [x] 모노레포 경로 필터 CI (mobile/server 독립 배포) — **서버 측 완료**(`server/**` 필터). 모바일 CI는 **완료**
- [x] 서버 배포 (호스팅 타깃·컨테이너·환경 변수·DB 마이그레이션) — **실배포 검증 완료(2026-08-13)**
- [x] 모바일 배포 (EAS Build/Submit, 환경 분리, OTA 업데이트 정책) — **배선 완료(2026-08-13~14)**.
      실제 빌드·제출은 Play 계정 신원확인 대기. **Apple 멤버십은 2026-08-15 승인돼 iOS 제출 절 배선 완료(§12.3)**
- [x] 계약 코드젠 검증을 릴리스 게이트에 포함 — `deploy.yml`의 `verify` job이 드리프트 검사를 돌린다
- [x] IaC — GCP 리소스 전부를 Terraform으로 (콘솔 수동 작업 배제) — 콘솔 클릭 0회로 66리소스 생성.
      자동화 못 한 경계는 §7에 명시(Upstash 가입·시크릿 값·Apple/Google 포털·GitHub Variables)

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
- **scale-to-zero**: 출시 전·초기 저트래픽 구간의 컴퓨트 비용이 사실상 0. **양 환경 모두 `min-instances=0`으로 시작한다**
  (2026-08-13 확정). 상시 켜진 prod 인스턴스는 Cloud SQL 옆의 **두 번째 고정비**인데 출시 전에는 사는 것이 없다 —
  콜드스타트를 아껴줄 "하루 첫 학습자"가 아직 없다. 실 테스터가 붙는 시점(Play 비공개 테스트 12명/14일 시계가
  시작될 때, §6.1)에 prod를 1로 올린다.
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
  `postgres://user:pass@/forin_prod?host=/cloudsql/<conn>` 형태. **인증 네트워킹(authorized networks)을 비워
  직접 TCP 접속을 전부 거부**하고, 커넥터가 IAM + 임시 인증서로만 붙는다.
  (초안은 "공인 IP를 열지 않는다"였으나 **구현 계획 수립 중 정정**: private-IP-only 인스턴스에는 커넥터가 닿을 경로가 없어
  VPC 네트워크 + private services access + Direct VPC egress가 함께 필요하다. 그건 나중 강화 단계이고 기본값이 아니다.)

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

**master push → staging 배포** (`deploy.yml` 신설)
1. **`verify`**: `go vet`·`go test`·`go build` + **계약 코드젠 드리프트 검사**. 배포 워크플로가 **자체적으로** 다시 돌린다 —
   `server.yml`·`contract.yml`이 같은 푸시에서 병렬로 도는 것은 **게이트가 아니다**(배포가 그 결과에 의존하지 않으면
   테스트가 빨간 커밋이 배포된다). 이 중복이 "계약 검증을 릴리스 게이트에 포함"을 사실로 만든다
2. 이미지 빌드 → Artifact Registry `asia-northeast3-docker.pkg.dev/forin-504711/forin/api:<sha>`
3. staging `migrate` Job 실행
4. staging Cloud Run 배포
5. **staging에 `e2e_smoke.sh` 57 assert 실행** — 실패하면 여기서 멈춘다. 스크립트가 `[ "$FAIL" -eq 0 ] || exit 1` 이므로
   **종료코드가 게이트**이고 출력 파싱이 없다
6. 승격에 쓸 이미지 SHA를 작업 요약에 출력한다

**prod 승격 = 별도 수동 워크플로** (`promote.yml` 신설, `workflow_dispatch` **전용**)
- **왜 분리했는가**(구현 리뷰에서 채택): `environment: production` 하나로는 부족하다 — 그 Environment가 **없으면 GitHub가
  보호 규칙 없이 즉석 생성**하고 실패하지 않는다. 즉 Variables만 먼저 등록하고 Environment 생성을 건너뛰면 다음 푸시가
  **승인 없이 prod를 배포**한다. 게이트가 리포 밖에만 있고 부재 시 기본값이 "게이트 없음"이었다.
  → **수동 트리거 전용으로 떼면 GitHub 설정이 어떻든 사람이 누르지 않으면 prod는 돌지 않는다.** `environment: production`은
  유지해 승인 게이트를 **2차** 방어로 얹는다. Task 4의 "설정 준수가 아니라 구조로"와 같은 해법이다.
- **`staging-verified-<sha>` 태그가 이 파이프라인에서 하중이 가장 큰 안전장치다.** `deploy.yml`은 staging 스모크
  (57 assert)를 통과한 뒤에만 이 태그를 붙이고, `promote.yml`은 입력받은 SHA를 **항상 그 태그로만** 해석한다
  (`api:staging-verified-<sha>`, 바로 `<sha>`가 아니다) — 태그가 붙지 않았다면 승격할 이미지 자체가 존재하지 않으므로
  `gcloud`가 여기서 fail-closed로 막힌다. **미검증 SHA는 배포할 이미지가 없다**는 뜻이고, 이 정본에 적어두지 않으면
  미래의 독자가 이 스텝을 "이미 워크플로 분리로 막았는데 중복"이라며 지울 수 있다 — 분리(사람이 눌러야 한다)와 이
  태그(누른 사람이 옳은 SHA를 눌렀는가)는 서로 다른 실패 모드를 막는다.
- 입력은 승격할 커밋 SHA(형식 검증). prod `migrate` Job → `--no-traffic --tag=candidate` 배포 →
  **후보 태그 URL에서 `/readyz` 200과 `/auth/dev` 404를 전환 전에 검증** → 트래픽 전환(+후보 태그 제거) → **전환
  후에도 같은 두 가지(`/readyz` 200 · `/auth/dev` 404)를 실제 서빙 URL에서 재확인**. 초안은 전환 **뒤에만** 불변식을
  검사해 "위반을 확인하고도 prod를 노출 상태로 남기는" 순서였다.
- 실패 시 `if: failure()` 스텝이 **실제 이전 리비전 이름을 넣은 복사 가능한 롤백 명령**을 남기되, 안내 문구는
  **트래픽 전환(Shift traffic) 스텝이 실제로 성공했는지로 분기한다** — 전환이 성공한 뒤 그 다음 스텝(전환 후 재확인)이
  실패했다면 트래픽은 이미 새 리비전에 있으므로 "즉시 되돌려라"가 먼저 나오고, 전환 전에 실패했다면 기존 문구(스키마는
  적용됐을 수 있음 / 트래픽은 이전 리비전에 안전하게 남아 있음 / 코드만 재배포하면 복구)를 쓴다. 초안은 `if: failure()`
  하나만 보고 **무조건** 후자를 출력해, 트래픽이 이미 넘어간 뒤 실패한 경우에 "prod는 안전하다"는 거짓을 말했다
  (구현 리뷰에서 정정 — 장애 중 잘못된 방향을 가리키는 문서는 사고를 키운다).
- 동시성 그룹을 `deploy-staging`/`deploy-prod`로 분리한다 — 하나로 두면 prod 승인 대기가 락을 쥐어 그사이 master 커밋들의
  **staging 배포·스모크가 조용히 취소**된다.

**인증**: Workload Identity Federation. 서비스 계정 JSON 키를 GitHub Secrets에 넣지 않는다 — 키는 유출되면 회수 시점을
알 수 없고 만료도 없다. GitHub Secrets에는 프로젝트 ID·WIF provider 경로만 둔다.

**시크릿**: Secret Manager에 두고 Cloud Run `--set-secrets`로 주입. 값은 리비전에 박히지 않고 참조로만 남는다.

### 3.1 환경은 셋이고, 그중 둘만 클라우드에 있다

| 환경 | 어디 | DB | 용도 |
|---|---|---|---|
| **dev** | 로컬 `docker-compose`(이미 있음) | 컨테이너 Postgres 16 + Redis 7 | 일상 개발·기능 검증. `ENV=dev`, `/auth/dev` 활성 |
| **staging** | Cloud Run(scale-to-zero) | 공유 인스턴스의 `forin_staging` | **Cloud Run 고유 설정** 검증 + 마이그레이션 리허설 + 스모크 |
| **prod** | Cloud Run(`min-instances=0`, 테스터 확보 시 1) | 공유 인스턴스의 `forin_prod` | 실사용 |

**별도의 클라우드 "dev/test" 환경은 두지 않는다.** 로컬 compose가 이미 dev이고(prd-tech의 "개발=프로덕션 동일 환경"이
Docker로 달성된 지점), 세 번째 클라우드 환경은 staging과 역할이 겹친다. 대신 **경계를 분명히 해둔다**: 로컬에서
검증할 수 없는 것이 정확히 staging의 존재 이유다 — WIF 인증, Secret Manager 주입, Cloud SQL 유닉스 소켓 연결,
Cloud Run Job 실행, 콜드스타트·타임아웃. 이건 compose로 흉내낼 수 없다.

### 3.2 staging↔prod 분리 수준 — 논리적으로 완전, 물리적으로 공유

같은 Cloud SQL **인스턴스**의 **다른 데이터베이스**(`forin_staging` / `forin_prod`)다. 데이터베이스 사용자도
환경별로 따로 만들지만(`forin_staging`/`forin_prod`), **DB 수준 GRANT/REVOKE로 서로의 데이터베이스 접근을 막지는
않았다** — Terraform(`database.tf`)에 `GRANT`/`REVOKE`가 0건이다. Postgres는 새 데이터베이스에 `CONNECT`를
PUBLIC에 기본 부여하고, Cloud SQL Admin API로 만든 사용자는 `cloudsqlsuperuser` 역할의 멤버다 — 즉
**`forin_staging` 자격증명으로 `forin_prod`에 접속·조회하는 것이 기술적으로는 가능하다.** (구현 리뷰에서 정정: 초안은
"staging 사용자는 `forin_prod`에 붙을 수 없다"고 단언했으나 이를 강제하는 코드가 없었다.)

**분리는 대신 두 층에서 온다: 환경별 DSN 시크릿 + 환경별 IAM 스코프.** `DATABASE_URL`이 시크릿별로 분리돼 있고
(`secrets.tf`), 런타임 서비스 계정도 환경별로 따로 있어(`runtime.tf`) staging 코드가 prod의 `DATABASE_URL`을 얻을
경로가 없다. **애플리케이션이 자기 코드 경로로 반대편 데이터를 건드릴 경로는 없다** — 이건 실제로 참이다. 다만 이건
"자격증명이 새지 않게 막는다"와 "DB가 스스로 접근을 거부한다"의 차이다. 여기서 확보한 건 전자뿐이고, 후자는 하지
않았다 — 그 잔여 위험은 아래 4번에 있다.

**완전히 분리되는 것**
- 데이터 저장 위치. Postgres의 database 경계는 단단하다 — 자격증명 없이 다른 데이터베이스의 테이블을 조회할 방법은 없다.
- 시크릿·서비스 계정·Cloud Run 리비전·Redis(Upstash DB 2개 분리).

**공유되어 남는 것 (이게 이 선택의 실제 대가다)**
1. **컴퓨트·커넥션.** staging이 인스턴스 CPU/메모리/커넥션을 먹으면 prod가 느려진다. 완화: staging은 스모크만 돌고
   상시 트래픽이 없으며, 커넥션 풀 상한을 낮게 고정한다. 부하 테스트는 **이 인스턴스에서 하지 않는다**(하려면 별도 인스턴스).
2. **백업·PITR 단위가 인스턴스다.** prod만 특정 시점으로 되돌리려면 "새 인스턴스로 복원 → `forin_prod`만 덤프해서
   적재"가 된다. 복구는 가능하지만 절차가 한 단계 길다.
3. **인프라 변경을 staging에서 먼저 볼 수 없다.** Postgres 메이저 업그레이드·머신 타입 변경·유지보수 창은 인스턴스 단위라
   두 환경에 동시에 적용된다. 그걸 미리 리허설하려면 인스턴스가 둘이어야 한다.
4. **DB 수준 접근 격리가 없다.** staging의 DSN(자격증명)이 유출되면 그 자격증명으로 같은 인스턴스의 `forin_prod`에도
   접속할 수 있다 — DB 자신은 이를 거부하지 않는다. 이 잔여 위험을 닫는 건 위 "환경별 DSN 시크릿"이 새지 않는 것뿐이다
   (Secret Manager 참조 주입이라 값이 리비전에 박히지 않는다는 것 이상의 방어는 DB 쪽에 없다).

**판단**: 지금은 prod 트래픽이 0이고 검증하려는 건 스키마와 Cloud Run 배선이므로 공유가 맞다. 위 3번이 문제가 되는
시점(실사용자 + DB 버전 업그레이드)에 인스턴스를 분리한다 — Terraform에서 **tfvar 하나**로 전환되도록 모듈을 쓴다.

### 3.3 비용 — staging의 증분은 사실상 0, 고정비는 Cloud SQL이 전부

| 항목 | staging 증분 |
|---|---|
| Cloud Run(staging) | scale-to-zero. 스모크 실행 시간만 과금 → **월 $1 미만** |
| Cloud SQL | **+$0 고정비** — 인스턴스를 공유하므로 늘어나는 건 데이터베이스 하나의 **스토리지**뿐(수백 MB 규모 → 센트 단위) |
| Upstash Redis(staging) | 요청량 과금. 스모크 수준이면 무료 구간 |
| Artifact Registry | 같은 이미지를 두 환경이 공유 → **+$0** (단, 아래 각주) |

> **Artifact Registry의 "+$0"은 장기적으로는 사실이 아니다.** 매 배포가 ~80MB 이미지를 새 태그로 쌓기만 하고 지우지
> 않으면 스토리지가 배포 수에 비례해 계속 늘어난다. 그래서 `cleanup_policies`를 걸었다 — `staging-verified-<sha>`
> 태그가 붙은 이미지는 무기한 보존(KEEP)하고, 그렇지 않은(승격되지 않았거나 스모크를 통과하지 못한) 이미지는 30일
> 후 삭제(DELETE)한다. 위 표의 "+$0"은 이 정리 정책이 있다는 전제에서만 유지된다.

즉 **staging을 두는 대가는 월 1~2달러 수준**이고, **양 환경이 `min-instances=0`인 지금 이 설계의 고정비는 사실상
`Cloud SQL 인스턴스 하나`뿐이다**(2026-08-13 확정 — §1).

**서울 실단가 확정(2026-08-13)** — GCP Cloud Billing Catalog API(`services/9662-B51E-5089/skus`)로 직접 조회했다.
공식 계산기 대신 카탈로그를 쓴 이유: 계산기 페이지는 JS 렌더라 프로그램으로 대조할 수 없고, 카탈로그는 실제 과금 SKU다.

| 항목 | 서울 단가 | 월 환산 |
|---|---|---|
| `db-f1-micro` 인스턴스 (Zonal) | $0.0137 / hour | **~$10.00** |
| SSD 스토리지 10GB (Zonal Standard) | ~$0.221 / GiB·month | **~$2.21** |
| 백업·PITR | 사용량 과금(WAL + 백업 스토리지) | 초기엔 수 달러 이하 |

**≈ 월 $12~14** 가 이 스테이지의 상시 고정비다. 스펙 초안의 "$8~10 구간" 추정보다 **서울이 조금 비싸다**.

> 단가 도출 근거를 남긴다: 카탈로그에 `PostgreSQL: Zonal - Micro instance in Seoul` SKU가 **없고**
> `MySQL: Zonal - Micro instance in Seoul`($0.0137)과 `PostgreSQL: Regional - Micro instance in Seoul`($0.0273)만
> 있다. Regional은 2존이므로 정확히 2배이고, 공유 코어는 엔진 간 단가가 같다는 문서 설명과 맞아떨어진다 —
> 따라서 Zonal PostgreSQL micro = $0.0137/hour. 스토리지도 같은 방식(Regional Standard $0.442의 절반)이며
> `SQL Server: Zonal - Standard storage in Seoul`이 실제로 $0.221로 나와 교차 확인된다.
> `disk_autoresize = true`이므로 스토리지 줄은 데이터가 늘면 따라 오르고 **줄어들지는 않는다.**

> ⚠️ **에디션을 명시하지 않으면 이 단가가 성립하지 않는다**(첫 실제 apply에서 발견). 새 Postgres 인스턴스는
> `ENTERPRISE_PLUS`로 기본 생성되고, 그 에디션은 공유 코어 티어를 **아예 거부**한다
> (`Invalid Tier (db-f1-micro) for (ENTERPRISE_PLUS) Edition` — `db-perf-optimized-N-*`만 허용, 이 예산의 자릿수를
> 넘는다). `settings { edition = "ENTERPRISE" }`를 명시해야 한다.

> **prod를 1로 올리는 시점은 정해져 있다**: 실 테스터가 붙을 때(Play 비공개 테스트 12명/14일 시계가 시작될 때, §6.1).
> 그때 콜드스타트를 먹는 사람이 처음 생기고, 그 전까지 상시 인스턴스는 아무것도 사지 않는다. 변경은 `runtime.tf`의
> `local.min_instances` 맵 한 줄이지만 **Terraform 템플릿 변경은 0% 트래픽 리비전에 실리므로 다음 승격에 반영된다**(§11).

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

- 사용자 진행도는 안전하다: `scenario_attempts`·`review_cards`·`conversation_sessions`의 `scenario_id`가 **FK 없는
  `text`**(`000003_progress.up.sql:21`)라 콘텐츠 삭제가 cascade하지 않는다. 이는 감사로 확인했다. (구현 리뷰에서
  정정: 초안은 이 셋 중 하나를 `user_progress`라고 적었는데, `user_progress`에는 `scenario_id` 컬럼이 없다 — 실제
  가드 쿼리(`cmd/seed/guard.go`)가 참조하는 건 `scenario_attempts`다.)
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
- **확정(2026-08-12): 개인 계정이다 → 이 요건이 적용된다.** 따라서 Android 출시 경로에는 **비공개 테스트 12명 × 14일이
  선행 조건으로 확정**됐다. 조직 계정이면 면제였겠지만 해당되지 않는다.

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
  `promote.yml`이 이를 검사한다 — **매 배포 끝에가 아니라, 트래픽을 옮기기 전에** 후보 리비전의 전용 URL
  (`--tag=candidate`)에서 먼저 `/auth/dev`가 **404**임을 확인하고(§3에서 정정한 순서 — 위반을 확인한 채로 prod를
  노출시키지 않는다), **트래픽 전환 뒤에도 실제 서빙 URL에서 같은 것을 한 번 더 재확인한다.** (구현 리뷰에서 정정:
  초안은 "매 배포 끝에" 검사한다고 적었는데, 실제로는 전환 *전* 후보 URL 검사가 원 검증이고 그게 더 나은 설계다 —
  전환 뒤 재확인은 그 위에 얹은 이중 확인이다.)
- **staging 스모크의 인증 경로**(구현 계획 수립 중 발견한 공백). 스모크 57 assert는 `POST /auth/dev`로 인증하는데 그 경로는
  `Env == "dev"`에서만 등록된다. staging을 `ENV=dev`로 돌리면 **공개 URL에 인증 우회가 열리고**, `ENV=prod`로 돌리면
  스모크가 인증할 수 없다. → **`DEV_AUTH_SECRET`이 설정된 환경에서만 경로를 등록하고, `dev`가 아니면 일치하는
  `X-Dev-Auth` 헤더를 요구**한다. 응답은 401이 아니라 **404** — 밖에서는 없는 것처럼 보여야 한다. 빈 시크릿은 빈 헤더와도
  일치하지 않으며(오설정된 staging이 문을 열지 않게) 비교는 constant-time이다.
- **prod 불변식은 설정이 아니라 구조로 보장한다**(구현 리뷰에서 채택). 초안은 "prod에는 시크릿을 주지 않으므로 경로가 없다"였는데,
  그건 **배포 설정 규율에 의존**한다 — 시크릿 매니저 항목 하나나 env 블록 복사 한 번으로 prod에 `DEV_AUTH_SECRET`이 새면
  공개 URL에 인증 우회가 열린다. 그래서 `devAccessAllowed`가 `env == "prod"`를 **가장 먼저 거부**하고 라우터 등록 조건도
  `Env != "prod" &&`로 조인다. **두 층이 각각 독립적으로 prod를 닫으므로** 한쪽이 나중에 수정돼도 즉시 우회가 열리지 않는다.
- **양 환경 `min-instances=0`** — 출시 전에는 상시 인스턴스가 아무것도 사지 않는다. 실 테스터가 붙는 시점에 prod를 1로
  올려 콜드스타트를 첫 사용자에게 전가하지 않는다(§1·§3.3).
- 콘텐츠 6.8MB가 이미지에 들어가므로 이미지 크기·빌드 캐시를 확인한다(distroless + 정적 링크라 여유 있음).

### 9. 구현 분해

한 번에 다 하지 않는다. 두 덩어리로 나누면 각각 독립적으로 검증 가능하다.

- **9-A 서버 배포**: `cmd/migrate`(임베드) → Dockerfile 3바이너리 → `infra/terraform`(+ 부트스트랩·시크릿 주입) →
  `deploy.yml`(verify → build → staging 자동 → 스모크) + `promote.yml`(prod 승격, 수동 트리거 전용) → 시드 가드.
  완료 판정 = **staging에 스모크 57/0**.
- **9-B 모바일 배포**: `mobile.yml`(tsc·jest 게이트) → `eas.json` 환경 분리 → `expo-updates` + fingerprint 정책 →
  테스트 트랙 제출(§6.1). 완료 판정 = **`preview` 설치본이 staging API에 붙어 동작**.

> **9-A 구현 중 얻은 교훈**(리뷰가 잡은 결함의 성격): 검증 도구의 통과가 정책의 정합성을 뜻하지 않는다. `terraform validate`가
> 통과한 구성에 **staging이 prod 토큰을 위조할 수 있는 경로**와 **prod에 로그인 수단이 0개**인 상태가 함께 있었고,
> `go test`가 전부 그린인 상태에서 **폰트가 조용히 폴백**하고 있었던 것(2026-08-11)과 같은 종류다. 그래서 이 스테이지의
> 검증은 "명령이 성공했는가"가 아니라 **"의도한 성질이 실제로 성립하는가"**를 묻는다 — 바인딩 그래프를 손으로 전개하고,
> 프로브 행을 넣어 가드가 막는지 보고, `ENV=prod`에 시크릿을 일부러 흘려 404를 확인하는 식으로.

9-A가 먼저다 — 9-B의 `EXPO_PUBLIC_API_URL`이 9-A가 만드는 staging URL을 필요로 한다.

**Android 12명/14일 요건(§6.1)이 확정 적용**되므로(개인 계정), **9-B 직후 비공개 테스트를 열어 시계를 먼저 돌려놓고**
그 2주 동안 3-2 모니터링을 진행한다. 이 2주는 줄일 수 없으므로 일정의 임계 경로로 취급한다.

### 10. 미해결 질문

- 커스텀 도메인(`api.forin.app` 등)을 3-1에서 붙일지, Cloud Run 기본 URL로 시작할지 — 도메인 보유 여부에 달려 있다.
- GitHub Environment 승인 규칙 자체를 Terraform GitHub 프로바이더로 관리할지(PAT 필요) 또는 리포 설정으로 둘지.
- ~~Google Play 개발자 계정 유형~~ → **해소(2026-08-12): 개인 계정.** §6.1의 12명/14일 요건 적용 확정.
- ~~Cloud SQL 서울 리전 실단가~~ → **해소(2026-08-13): 월 ≈$12~14**(인스턴스 ~$10 + 10GB SSD ~$2.21 + 백업).
  Cloud Billing Catalog API로 직접 조회했다 — 도출 근거와 에디션 함정은 §3.3.
- ~~prod `min-instances`를 처음부터 1로 둘지~~ → **해소(2026-08-13): 0으로 시작**한다. 결제 계정을 여는 시점에
  고정비를 최소화하고, 실 테스터가 붙을 때(§6.1의 12명/14일 시계) 1로 올린다. 결정 근거는 §1·§3.3.

### 11. 9-A 구현 완료 — 첫 apply 전 남은 것 + 이연 항목

**코드·설정은 마감됐다**(21커밋, 8태스크 각각 컨텍스트 분리 리뷰 통과, 전체 브랜치 최종 리뷰 통과).
로컬 검증: `go vet`·`go test` 그린 · `terraform validate` Success · 워크플로 5개 YAML 파싱 · **로컬 스모크 57/0**.

### 11.1 첫 apply·첫 배포 실측 (2026-08-13) — 정적 검증이 잡을 수 없던 결함 3종

인프라는 올라왔다(Cloud Run 서비스 2 · Job 4 · Cloud SQL 1 + DB 2 · Upstash 2 · 시크릿 10 · WIF · Artifact Registry).
`verify`(계약 드리프트 포함) → `build` → staging `migrate` → staging 배포까지 통과했다. 그 과정에서 **계획 리뷰도,
`terraform validate`도, YAML 파싱도, 로컬 스모크 57/0도 잡을 수 없던 결함 세 개**가 드러났다. 셋 다 실제 리소스에
명령을 쏴봐야만 보이는 부류다 — 이 절이 §11의 "첫 실행 관측" 체크리스트가 존재한 이유의 증거다.

**① Cloud SQL 에디션** (§3.3에 상세) — 새 Postgres 인스턴스가 `ENTERPRISE_PLUS`로 기본 생성돼 공유 코어 티어를 **아예
거부**했다. `edition = "ENTERPRISE"` 명시로 해결. 이걸 놓치면 월 예산이 자릿수째 달라진다.

**② gcloud 프로젝션 4곳** — JSON에는 데이터가 다 있었고 `--format='value(...)'` 문법이 문제였다.
- **`:` 는 부분 문자열 매칭이다.** `filter("type:Ready")`가 `ContainerReady`까지 잡아 `['True','True']`를 반환하고
  deprecation 경고까지 냈다 → `filter("type=Ready")`.
- **`extract()`는 필터된 리스트를 `['name']` 형태로 감싼다.** 그 값을 `gcloud run revisions describe`에 넘기면 실패하므로
  `promote.yml`의 준비 확인은 **항상 빈 값을 받아 모든 승격이 실패할 상태**였다 → `.flatten()` 추가.
- 안쪽에 `'Ready'`처럼 인용부호를 넣으면 셸의 단일 인용부호가 그 자리에서 닫힌다 → 인용부호 없는 `type=Ready` 형태.

**③ 시크릿에 후행 개행이 저장돼 dev-auth 게이트가 항상 거부했다** — 첫 staging 스모크가 **15/56**으로 떨어졌고 거의 모든
assert가 401이었다. 원인은 게이트가 아니라 시크릿이었다: `openssl rand -hex 32`이 개행을 붙여 출력하고 그게 그대로
저장돼 **65바이트**가 됐는데, 호출측의 `$(gcloud secrets versions access)`는 후행 개행을 떼어 **64바이트** 헤더를 보낸다
→ `ConstantTimeCompare`가 길이에서 실패 → 404 → 이후 모든 요청 401.
- **진단을 가른 것은 응답의 형태였다**: Go 기본 평문 `404 page not found`가 아니라 핸들러의 JSON
  `{"error":{"message":"not found"}}`가 돌아왔다 → **경로는 등록됐고 게이트가 거부했다**는 뜻. R-2 리뷰가 "staging에서
  오시크릿 응답이 JSON이라 Go 기본 404와 구별된다"를 Minor로 이연했는데, 그 구별이 여기서 진단 도구가 됐다.
- 수정: `infra/Makefile`의 `openssl` 출력에 `tr -d '\n'`, 그리고 `config.go`가 `DEV_AUTH_SECRET`을 `TrimSpace`한다
  (콘솔에서 값을 붙여넣다 개행이 다시 들어오는 경로가 현실적이라 서버 쪽에서도 견디게 했다).
- **`printf '%s'`로 밀은 시크릿(LLM·Azure 키)은 개행이 없었다** — 문제는 `openssl` 파이프 세 곳에만 있었다.

**관측 결과 ①(hello 이미지가 `/readyz` 프로브를 통과하는가)**: ✅ 통과. 양 서비스 리비전이 Ready이고 트래픽 100%였다.

**verified 태그 게이트가 설계대로 작동했다**: 스모크가 실패하자 `Tag the image as staging-verified`가 `skipped`됐고,
따라서 그 SHA는 승격할 이미지가 없다. 실패한 빌드가 prod로 갈 경로가 실제로 닫혀 있음이 첫 실행에서 확인됐다.

### 11.2 완료 판정 달성 — staging 스모크 57/0 (2026-08-13)

**파이프라인 전 단계 성공**([run 31681540633](https://github.com/bingoring/forin/actions/runs/31681540633)):
`verify`(vet·test·build + 계약 드리프트) → `build` → staging `migrate` → 배포 → **`Smoke test staging` 성공** →
`Tag the image as staging-verified` 성공. 스펙 §9의 완료 판정을 실경로에서 받았다.

스모크가 통과했다는 것은 **Cloud SQL 유닉스 소켓 · Secret Manager 주입 · Upstash TLS · WIF 무키 인증 ·
`DEV_AUTH_SECRET` 게이트 · SM-2 복습 · 평판 긴급도 · access 게이트가 전부 실경로로 엮여 동작한다**는 뜻이다.

**콘텐츠 시드는 별도 수동 워크플로로 먼저 돌려야 했다.** 배포만으로는 DB가 비어 있어(`/departments` = `[]`) 다이얼로그·
부서 상황·홈 풀·access가 실패했다(첫 통과 시도 49/57). `seed.yml`을 staging에 돌린 뒤 57/0이 됐다 — 시드를 배포에서
분리한 설계(§5)의 실제 귀결이며, **첫 환경 구축 순서는 배포 → 시드 → 스모크**임을 기록해 둔다.

**verified 태그 게이트가 양방향으로 확인됐다**: 스모크가 실패한 두 번의 실행에서는 태그 스텝이 `skipped`돼 그 SHA에
승격할 이미지가 없었고, 통과한 실행에서 `staging-verified-99bccfd…`가 붙었다. 실패한 빌드가 prod로 갈 경로가 실제로
닫혀 있고 통과한 빌드는 열린다.

**관측④(첫 배포 후 `terraform plan`의 `traffic` diff)**: ✅ **diff 없음** — `ignore_changes`가 작동해 §11 이연 항목 4의
위험(무관한 apply가 롤백을 되돌리는 것)이 실측으로 닫혔다. 대신 **`scaling` 블록의 영구 diff**가 새로 드러났다
(`runtime.tf`에 KNOWN PERPETUAL DIFF로 못박음): API가 `manual_instance_count`를 항상 0으로 보고하는데 서비스 레벨
`scaling` 스키마가 그 인자를 받지 않고 `ignore_changes`도 그 중첩 깊이에 닿지 못한다. 블록을 통째로 무시하면 문서화한
"prod를 1로 올리기"가 조용히 무력화되므로 Terraform 소유권을 지키고 **이 diff는 대기 중 변경이 아니라는 것**을 코드
옆에 적었다 — 서비스 plan에 그 밖의 것이 보이면 그건 진짜다.

**남은 것**: 첫 **승격**(`promote.yml`)과 첫 **prod 시드**는 아직 돌지 않았다. prod는 여전히 hello 플레이스홀더를
서빙한다 — 실사용자가 없으니 급하지 않고, 승격은 사람이 눌러야 도는 구조다(§3). 9-B(모바일)는 §12에서 배선을
완료했고, 다음은 3-2(모니터링)다.

**이연 항목**(최종 리뷰의 fix 웨이브가 새로 만든 Minor 4건. 전부 load-bearing 아님으로 판정됨):
1. `promote.yml`의 실패 안내가 **"shift 실패"와 "shift 미실행"을 한 문장으로 합친다.** `update-traffic`은 경로를 바꾼
   뒤 Ready를 기다리므로 PATCH 성공 후 대기 실패면 트래픽이 이미 넘어간 상태일 수 있고, 그 경우 "코드만 재배포하면
   복구"가 거짓이다. C1과 같은 부류지만 롤백 명령은 그 분기에도 출력된다 → 세 번째 분기 추가로 닫힌다.
2. `cleanup_policies`가 **스모크 실패한 staging 리비전의 이미지**를 30일 후 삭제할 수 있다(verified 태그가 없으므로).
   다음 배포가 오면 무해해지고 staging 한정이다.
3. `cmd/seed`의 10분 컨텍스트가 Cloud Run Job 기본 태스크 타임아웃 600초와 **정확히 같아 여유가 0** — 의도한
   `context deadline exceeded` 메시지가 나올 수 없다(실패는 여전히 실패로 드러나므로 진단 품질만 손해).
4. `traffic`을 `ignore_changes`에 넣은 대가로 **"Terraform 템플릿 변경(예: `DB_MAX_CONNS`)은 다음 승격까지 prod에
   반영되지 않는다"** — I1의 의도된 대가인데 어디에도 적혀 있지 않다.

**그 외 관찰**: `if: failure()`는 job 취소에는 발동하지 않는다(`failure() || cancelled()`가 더 넓다) · 양 환경이 동시에
최대 스케일아웃하면 커넥션 합이 `db-f1-micro`의 ~25를 넘는다(예상 부하에서는 안전) · `apply`가 seed Job의
`SEED_ALLOW_REMOVAL`을 벗기지만 워크플로가 매 실행 다시 세팅한다.

### 12. 9-B 모바일 배포 (2026-08-13~14)

**범위**: `mobile.yml`(CI) · EAS 프로필 환경 분리 · `expo-updates`+fingerprint 정책 · `ota.yml` · 제출 트랙. **5태스크
11커밋**(`d51e1b7`~`87660a9`) — 최종 리뷰가 잡은 카운트 오류를 정정한다: 초안은 "4태스크 7커밋(`d51e1b7`~`ec8a411`)"이라
적었는데 바로 아래 ①~⑤가 다섯 개이고 ⑤(`87660a9`)가 그 범위 밖이었다. 전부 컨텍스트 분리 리뷰 통과. **9-A와 달리
착수 시점엔 실제 배포가 없었으나, §12.1에서 첫 실제 OTA 발행까지 갔다** — 아래 ①~⑤는 배선과 로컬/CI 검증이고,
첫 `eas build`/`eas submit`은 여전히 §11의 "첫 실행 관측"과 같은 성격의 미결 항목으로 남는다.

**① `mobile.yml` 신설**(`d51e1b7`) — 착수 전 감사(§0)가 확인한 공백("모바일 검증이 CI에 하나도 없음")을 닫았다.
경로 필터에 `mobile/**`뿐 아니라 `packages/contract/**`도 넣었다: `client.ts`가 `@contract/types`를 임포트하므로
계약 재생성만으로 모바일 타입이 깨질 수 있는데, `mobile/**` 단독 필터면 그 푸시는 CI를 안 탄다. 실행 확인:
[run 31692228156](https://github.com/bingoring/forin/actions/runs/31692228156) `completed/success`, 38 suites/213 tests. (그 시점 수치다. 최종 리뷰 픽스 웨이브 이후 **39 suites/219 tests**이고 `mobile.yml`에 typed-routes 생성 스텝이 하나 늘었다 — [run 31778313338](https://github.com/bingoring/forin/actions/runs/31778313338)에서 실 러너 green 확인 — typegen 스텝도 `success`이고, 그 스텝은 `router.d.ts`가 30초 안에 없으면 `::error::`로 실패하므로 green은 파일이 실제로 생성됐다는 뜻이다. §12.2.)

**② 조용한 폴백 두 개**(`527caf3`) — §11.1이 잡은 "정적 검증이 못 잡는 결함"과 같은 부류가 모바일에도 있었다.
`client.ts:10`의 `EXPO_PUBLIC_API_URL ?? 'http://localhost:8080'`은 프로필에 값이 없으면 빌드된 앱이 조용히
localhost를 때린다. 그리고 **`mobile/.env`가 gitignore돼 EAS 빌드에 전달되지 않는다** — 소셜 클라이언트 ID를
못 읽으면 로그인이 전부 실패하는데, **로컬 `expo start`는 `.env`를 읽어 멀쩡히 동작한다.** "로컬에서만 되는" 함정이
서버 쪽(§11.1)과 똑같은 모양으로 모바일에도 있었던 셈이다. `eas.json`의 `preview`/`production` 프로필에 `env`
블록으로 명시 주입해 막았다. 값 자체는 공개 식별자(§0 판정, 앱 바이너리에도 박힘)라 커밋해도 안전하다.

**③ `expo-updates ~56.0.24` + `runtimeVersion: { policy: "fingerprint" }`**(`010826a`) — 카카오 SDK·애플 인증 같은
네이티브 모듈이 있어 `appVersion` 정책은 위험하다(네이티브 의존이 바뀐 JS를 구버전 바이너리에 밀어넣을 수 있음).
fingerprint는 네이티브 지문이 바뀌면 런타임 버전이 달라져 그 OTA를 자동 무효화한다. `fallbackToCacheTimeout: 0`은
시작 시 업데이트를 기다리지 않고 캐시 번들로 즉시 뜨게 한다 — 학습 앱에서 시작 지연은 이탈이고, OTA는 다음 실행에
적용돼도 충분하다.

같은 커밋이 **검증 수단 자체의 결함**도 하나 냈다가 `e5f1444`로 정정했다: 최초 커밋 메시지는 "`eas config`가
runtimeVersion을 계산된 지문으로 해석함을 확인"이라 적었는데, `eas config`는 `app.json`/`eas.json`을 그대로 표시할
뿐 `--json`을 붙여도 `{"policy":"fingerprint"}` 문자열만 돌려준다 — **지문을 계산하지 않는다.** 실제 확인 수단은
`eas fingerprint:generate --build-profile production --platform android`였고, 이게 네이티브 소스 100개를 해시해
`3d77aa757221a5949f1db0809572350798d54ae0`(40자)을 산출하고 `accounts/forin/projects/forin`에 등록됐음을 보여줬다.
하지 않은 검사를 했다고 적힌 이력은 나중에 그 검사를 다시 하지 않게 만들기 때문에, 코드 변경 없이 이력만 정정했다.

**④ `ota.yml`**(`38c8b89`+`67158b4`+`ec8a411`) — OTA는 스토어 심사를 우회하는 경로다: `eas update`는 JS를 전 사용자에게
즉시 밀고, 새 빌드는 Apple/Google 심사를 거친다. 가장 빠르고 가장 되돌리기 어려운 경로이므로 `promote.yml`의 prod
승격과 **같은 승인 게이트**(`environment: production`)를 붙였다. `summarize`(게이트 없음, 채널·SHA·메시지를 승인 전에
노출) → `update`(`needs: summarize`, 게이트) 구조로 나눈 이유는 `environment` 게이트가 **그 job의 모든 스텝**을 승인
전까지 막기 때문이다 — 같은 job 안에 "승인 전에 보여줄" 스텝을 둘 수 없다. `production` 채널은 `master` 브랜치에서만
돈다(`workflow_dispatch`는 임의 브랜치를 고를 수 있어 별도 가드가 필요).

이 태스크가 이 세션 최고의 발견 세 개를 냈고, 셋 다 **같은 종류**다 — 9-A(§11.1)는 "도구가 통과시키는 구성"
(기본값 `ENTERPRISE_PLUS`가 걸린 Cloud SQL, 개행 섞인 시크릿)을 잡았는데, 9-B는 그게 한 층 올라간 사례를 냈다.
**구성이 아니라 검증 자체가 틀렸는데 그 검증 도구가 그린을 찍었다.**

- **`eas update`는 `eas.json`의 빌드 프로필 `env`를 읽지 않는다.** `--build-profile` 플래그가 없고, `--environment`는
  서버측 EAS 환경변수만 로드하는데 이 프로젝트엔 등록된 게 없다(`eas env:list`가 양쪽 환경 모두 빈 목록). 고치지
  않았다면 OTA 번들이 `localhost:8080`을 가리키고 로그인이 죽은 앱이 **모든 사용자에게** 밀렸을 것이다. `eas build`는
  멀쩡하다 — `--environment` 플래그가 없고 `buildProfile.env`가 그대로 해석된다. 해법: `ota.yml`이 `eas.json`에서
  값을 읽어 `$GITHUB_ENV`에 주입해, `eas.json`을 단일 진상으로 유지한다.
  - **이 해법의 전제("process env가 실제로 번들에 반영되는가")를 대조군/실험군 `expo export`로 실측했는데, 그 실측
    수단 자체가 처음엔 틀린 답을 냈다.** 1차 시도는 `EXPO_PUBLIC_API_URL` 유무만 바꿔 두 번 export했는데 두 산출물의
    바이트코드가 거의 동일했다 — **Metro 번들러 캐시가 두 실행 사이에 재사용돼 env 값이 반영되지 않은 것.**
    `--clear`로 캐시를 지우고 재실행하자 실험군에만 staging URL이 리터럴로 박히고 `localhost` 폴백은 상수 폴딩으로
    사라졌다. 캐시를 지우지 않은 검증이 "차이 없음"이라는, 실제와 반대되는 결론으로 이어질 뻔한 사례다. GitHub
    Actions `ubuntu-latest`는 잡마다 새 VM이라(Metro 캐시를 잡 간에 영속화하지 않음) CI 경로엔 이 위험이 없지만,
    로컬에서 반복 검증할 땐 `--clear` 없이는 검증자가 스스로를 속일 수 있다.
- **`GROUPS`는 bash 특수변수**(호출자의 supplementary group id)라 요약 스텝의 대입이 조용히 no-op이었다. 구현자가
  로컬에서 **zsh로 검증**해 정상 동작하는 것처럼 보였고(zsh는 `GROUPS`를 특별 취급하지 않음), **GitHub Actions는
  bash로 돈다** — 그대로였다면 요약에 런너의 gid가 찍히고 runtimeVersion 줄이 사라지고 롤백 명령이 엉뚱한 id를
  가리켰을 것이다. `UPD_GROUPS`로 개명해 닫았다. 로컬 셸에서 통과한 검증이 CI 셸에서는 다른 결과를 낸 사례다.
- **`| tee`가 실패를 삼켰다.** GitHub Actions 기본 셸(`shell:` 미지정)은 pipefail이 꺼진 `bash -e`라, 파이프 왼쪽이
  실패해도 오른쪽(`tee`)의 종료 코드로 스텝 전체가 판정된다 — `eas update`가 실패해도 "OTA update published"를
  찍고 런이 green으로 끝난다. **침묵 실패를 고치는 수정(env 주입 스텝 추가)이 그 스텝을 파이프로 만들면서 새 침묵
  실패를 만든 사례**다. `update` job의 `defaults.run`에 `shell: bash`를 명시해 pipefail을 켰다. 원인을 추적하니
  `promote.yml`의 기존 주석이 "이 리포에 pipefail이 켜져 있다"고 전제하고 있었다(9-A에서 작성) — 그 잘못된 전제가
  이번 버그의 origin이었다는 것도 같은 커밋(`ec8a411`)에서 정정했다.

세 사례의 공통점: **검증한 사람 자신의 셸·캐시가 검증 결과를 왜곡할 수 있다.** `terraform validate`나 `go test`가
그린이어도 실제 구성이 틀릴 수 있다는 게 9-A의 교훈이었다면, 9-B의 교훈은 **검증 스크립트 자체가 다른 셸·다른
캐시 상태에서 다른 답을 낼 수 있다**는 것이다 — 재현 환경(어떤 셸로 돌 것인가, 캐시를 지웠는가)을 실행 대상과
맞추지 않은 검증은 검증이 아니다.

**⑤ 제출 트랙 — `alpha`(비공개), `internal` 아님** — 개인 Play 개발자 계정은 프로덕션 접근을 얻기 위해 §6.1의
**비공개 테스트에서 12명 이상 옵트인 테스터를 14일간** 유지해야 하고, **내부 테스트는 이 요건에 카운트되지 않는다.**
`internal`로 뒀다면 배선은 맞아 보여도 2주 시계가 영영 시작되지 않았을 것이다. `releaseStatus: "draft"`로 업로드와
공개를 분리해, 빌드가 Play Console에 올라간 뒤 사람이 확인하고 공개하게 한다. **다만 `draft`는 그 자체로 `alpha`를
고른 목적(12명/14일 시계)을 무효화할 수 있다** — draft는 롤아웃되지 않으므로 사람이 Console에서 공개 버튼을 누를
때까지 그 시계가 시작되지 않는다. 업로드가 끝났다고 시계가 도는 게 아니라, **공개까지 사람이 확인해야** 한다. iOS는
작성 시점(2026-08-13)에 Apple Developer 멤버십이 없어 의도적으로 비웠다 — **2026-08-15에 멤버십이 승인돼 배선했다(§12.3).**

**미실행으로 남은 것**: Play 개발자 계정 신원확인 진행 중(앱 미생성) ·
**Google Play 서비스 계정 JSON 키(Play Developer API용) 미발급** — `eas submit --platform android`가 요구하는
자격증명이고, `eas.json`의 `submit.production.android`에도 아직 없다. Play 신원확인이 끝나도 이건 별개로 막는
항목이다. 관련해서 **"최초 Android 릴리스는 Play Console 수동 업로드가 선행해야 하는가"는 실측 전이라 미확정으로
남긴다** — §7의 "`eas submit` 자격증명은 1회 수동, 이후 자동"이라는 전제와 상충할 수 있다(신규 앱은 API 제출 전에
콘솔 수동 업로드가 한 번 필요하다는 보고가 있으나 이 프로젝트에서 확인한 사실은 아니다) · 실제 `eas build`/
`eas submit`은 단 한 번도 실행되지 않았다 — 첫 빌드는 카카오 SDK·애플 인증 같은 네이티브 의존이 **EAS 빌더에서
처음 컴파일되는 지점**이라 새로운 종류의 실패가 나올 수 있다. 9-A의 교훈대로 "배선이 맞다"와 "실제로 돈다"는
다른 사건이다. (`EXPO_TOKEN`은 §12.1에서 등록 완료 — 더 이상 `ota.yml` 실행을 막지 않는다.)

### 12.1 첫 실제 OTA 발행 (2026-08-14) — fingerprint의 실제 성질

`EXPO_TOKEN` 등록 후 **`preview` 채널로 첫 OTA를 실제 발행했다**(설치본 0개라 위험 없음, run 31775392399).
전 단계 통과: `summarize`(승인 전 요약) → `npm ci` → tsc → jest → `Load EXPO_PUBLIC_*` → `Publish update` → 요약.
로그에서 확인된 것: 스텝 셸이 **`bash --noprofile --norc -e -o pipefail`** 로 뜨고(`shell: bash` 수정이 실제로
pipefail을 켠다), `env:`에 4개 값이 **staging URL과 함께** 주입됐다.

**Task 3이 증명하지 못한 채 남긴 질문이 여기서 닫혔다.** 리뷰가 "`fingerprint:generate`는 지문 계산이 동작함을
증명하지만 `eas update`가 `app.json`의 정책을 소비하는지는 실제 발행 없이 알 수 없다"고 범위를 좁혀 **첫 실제 빌드
관측 항목**으로 남겼던 것이다. 결과:

- 발행된 업데이트의 `runtimeVersion`이 정책 문자열도 `1.0.0`(appVersion)도 아닌 **40자 지문 해시**다. 로컬
  `fingerprint:generate`가 같은 시점에 계산한 값과 **정확히 일치**한다
  → **`eas update`는 fingerprint 정책을 실제로 소비한다.** 설계 의도가 성립한다

> **정정 (2026-08-15)**: 위 문장을 처음 쓸 때 `runtimeVersion`을 **단수로** 적고 `d45c0fe4…` 하나만 인용했다.
> 실제로는 **지문이 플랫폼별로 다르고**, 이 발행은 업데이트 그룹을 **둘** 만들었다(`eas update:list --branch preview`로 확인):
> `android` = `d45c0fe445c43a091a8c9bfcfd4e5d432936a856`, `ios` = `51033673f568246cd175b114b986f16df363f816`.
> Task 3의 대조 명령이 `--platform android`였으므로(§12.1 위) **대조된 것은 android 한쪽뿐이고 ios 값은 비교조차
> 하지 않았는데, 문장은 양쪽에 대한 결론처럼 읽혔다.** 결론 자체("`eas update`가 정책을 소비한다")는 android 실측으로
> 유효하지만, 근거의 범위는 한 플랫폼이었다. `ota.yml`의 요약과 빌드 대조는 원래부터 `(platform, runtimeVersion)`
> 쌍을 순회하므로 **코드는 옳았고 문서의 서술만 틀렸다.** 이 브랜치가 반복해서 잡아낸 실패 모드를 문서 작성자가
> 다시 밟은 사례로 남긴다 — 한 플랫폼에서 확인한 것을 "일치한다"로 일반화하지 않는다.

**그리고 예상보다 중요한 성질이 드러났다.** Task 3 당시의 지문은 `3d77aa75…`였는데 지금은 `d45c0fe4…`다. 원인을 좁혀
확인했다:

- `preview`와 `production` 프로필의 지문이 **지금은 동일**하다 → 프로필별 `env`는 지문 입력이 **아니다**
- 지문 입력 100개 중 하나가 **`eas.json` 파일 자체**다(`{type: file, filePath: eas.json, reasons: [easBuild]}`)
- Task 3 이후 바뀐 것은 **Task 5가 고친 `eas.json`의 `submit` 절** — 네이티브 코드와 아무 상관이 없다

즉 **무언 실패의 트리거가 "네이티브 의존이 바뀔 때"보다 훨씬 넓다.** 제출 트랙을 추가하는 것 같은 평범한 설정 편집이
지문을 바꾸고, 그 뒤 발행한 OTA는 **그 전에 빌드된 바이너리에 도달하지 않으면서 런은 green으로 끝난다.**

**운영 규칙으로 남긴다**: `eas.json`이나 `app.json`을 고쳤다면 **OTA로 그 변경을 전달할 수 없다** — 새 빌드가 필요하다.
`ota.yml`의 요약이 "런타임이 맞는 설치본에만 도달한다 / 네이티브가 바뀌었다면 0명일 수 있다"를 찍는 이유가 이것이고,
그 경고는 생각보다 **자주** 해당된다. 발행 후 요약의 `runtimeVersion`이 **현재 배포된 빌드의 것과 같은지** 확인하는
것이 OTA가 실제로 누구에게든 닿았는지 아는 유일한 방법이다.

> 이 발견 자체가 §12의 관통 주제의 또 한 사례다 — 배선은 처음부터 맞았고(정책이 소비된다), **실제로 돌려보고서야
> 그 정책의 대가가 무엇인지 알았다.**

**운영 규칙 추가 (최종 리뷰 반영, 2026-08-14)**:

- **`eas update`를 로컬에서 실행하지 않는다.** `mobile/.env`에는 `EXPO_PUBLIC_API_URL`이 없다(Google/Kakao 키
  4개뿐). 로컬에서 `npx eas-cli update`를 치면 Metro가 `.env`를 읽고 `client.ts:10`의
  `?? 'http://localhost:8080'` 폴백이 번들에 확정돼, **localhost를 가리키는 번들이 승인·브랜치 가드·tsc·jest를
  전부 우회하고 채널에 그대로 발행된다.** OTA를 발행하는 유일한 경로는 `ota.yml`이다(`mobile/package.json`의
  `ota` 스크립트가 이 실수를 막는 스텁이다 — 실행하면 이유를 출력하고 종료코드 1).
- **production OTA를 발행하기 전에 서버를 그 SHA로 먼저 승격한다(`promote.yml`).** `master`의 JS는 `master`의
  계약으로 타입체크되지만 **prod 서버는 사람이 마지막으로 승격한 이미지를 돈다.** 순서를 반대로 하면(서버 승격
  전에 OTA부터 발행) production 번들이 아직 없는 엔드포인트를 호출해 전원 404를 만들 수 있다.
- **"닫혔다"의 범위는 `eas update` 한정이다.** 위에서 실증된 건 `eas update`가 fingerprint 정책을 소비한다는
  것뿐이다. **`eas build`가 그 해시를 바이너리에 실제로 박는지는 아직 실측하지 않았다** — OTA가 어디에 도달하는지는
  그쪽이 결정하므로, 이건 첫 실제 `eas build` 때 확인할 항목으로 남긴다(하지 않은 검증을 했다고 적지 않는다).

### 12.2 CI의 `tsc`가 라우트 오타를 놓치던 공백 (최종 리뷰 반영, 2026-08-14)

`tsconfig.json:29`가 `.expo/types/**/*.ts`를 include하는데 그 디렉터리는 `.expo/`로 gitignore돼 있다. 이 생성
파일(`router.d.ts`)이 `expo-router`의 `Href`를 실제 라우트 리터럴 유니온으로 좁히는 역할을 한다 — 없으면 `Href`가
`string | HrefObject`로 퇴화해 `router.push('/typoo')` 같은 라우트 오타가 타입 에러 없이 통과한다. 라우트 오타는
JS-only 버그, 즉 **OTA로 밀 수 있는 부류**인데, 하필 그 게이트가 못 보는 걸 OTA로 밀게 되는 셈이었다.

**실행으로 확인**(`--help`가 아니라 실제로 지우고 돌려봄): `.expo/types`를 삭제한 뒤 `npx expo customize
tsconfig.json`·`npx expo export`는 그 디렉터리를 건드리지 않았다. **`npx expo start`만 재생성한다** —
`@expo/cli`의 타입 생성(`startTypescriptTypeGenerationAsync`)이 Metro 개발 서버(`MetroBundlerDevServer`)에만
연결돼 있고 `export`는 그 서버를 띄우지 않기 때문이다(`expo start` 소스 확인). `expo start`는 스스로 종료하지
않는 대화형 서버이므로, CI 스텝은 백그라운드로 띄우고 `router.d.ts` 생성을 폴링한 뒤 프로세스를 죽이는 방식으로
`mobile.yml`·`ota.yml`의 `tsc` 앞에 추가했다.

**직접 재현해 검증**: `router.push('/review')`를 `router.push('/typoo')`로 임시로 바꾼 뒤 — `.expo/types`가 있으면
`tsc --noEmit`이 `TS2345`로 실패, 없으면 같은 코드가 **종료코드 0으로 통과**함을 확인했다(원복 완료). CI에 넣은
스텝이 실제로 이 차이를 메운다.

### 12.3 iOS 제출 절 배선 (2026-08-15) — Apple 멤버십 승인 후

Play 개발자 계정 신원확인이 지연돼 **Apple을 먼저 진행했다.** TestFlight에는 §6.1의 12명/14일 요건이 없어(내부
테스트는 심사 없이 즉시, 외부 테스트만 가벼운 Beta App Review) iOS가 먼저 실기기 배포에 도달할 가능성이 높다.

**개인(Individual) 등록을 골랐다.** 조직(Organization) 등록은 D-U-N-S 번호가 선행 요건이고 그것만 1~2주라, Play를
기다리는 상황을 하나 더 만든다. Play도 개인 계정이므로 두 스토어의 개발자명이 일관된다. 대가는 App Store 판매자명이
법인명이 아닌 **본인 법적 이름**이 되는 것이고, 나중에 조직으로 바꾸려면 별도 요청과 앱 이관이 필요하다.

**포털 등록에서 켠 capability는 `Sign In with Apple` 하나뿐이다.** 추측이 아니라 prebuild가 생성한
`ios/forin/forin.entitlements`를 읽어 정했다 — entitlement가 `com.apple.developer.applesignin` = `Default`
하나다. `expo-notifications`가 의존성에 없으므로 Push Notifications는 켜지 않았고, 마이크는 capability가 아니라
Info.plist 사유 문구 사안이라(`expo-audio` 플러그인이 한국어 문구를 주입하고 생성된 Info.plist에서 확인됨) 포털에서
할 일이 없다. **필요 없는 capability를 켜면 프로비저닝 프로파일이 entitlements와 어긋나 빌드가 깨진다.**

Apple 심사 지침 4.8(소셜 로그인 제공 앱은 Sign in with Apple을 제공해야 함)은 **이미 충족돼 있었다** — 클라이언트
(`mobile/src/lib/auth.ts`, `isProviderConfigured('apple')`가 네이티브라 무조건 `true`)와 서버(`APPLE_CLIENT_ID` →
`cfg.AppleClientIDs`) 양쪽 배선이 되어 있고, 배포된 prod에 `APPLE_CLIENT_ID = app.forin.mobile`이 주입돼 있다
(Terraform `runtime.tf:131` — 수동 설정이 아니라 IaC 소관). 네이티브 Apple 로그인 id_token의 audience는 번들 ID이므로
값도 맞다.

**배선한 것**: `eas.json`의 `submit.production.ios.ascAppId = "6801582391"`. **이 한 필드뿐이다.**

- `ascAppId`는 `eas.json`에서 선택이지만 **비대화형에서는 필수**이고, **환경변수 보간 대상이 아니라서**(보간되는 건
  `ascApiKeyPath`·`ascApiKeyId`·`ascApiKeyIssuerId` 셋뿐) 리터럴로 파일에 있어야 한다. 공개 식별자라 커밋해도 된다
- ASC API 키는 **EAS credentials 서비스**에 올린다 → `eas.json`에 비밀이 하나도 안 들어간다. 9-A/9-B에서 세운
  "실제 비밀은 관리형 저장소, `eas.json`/git에는 절대 안 넣는다" 원칙 그대로다
- `appleTeamId`·`appleId`·`language`·`companyName`도 스키마가 허용함을 실측했지만 **넣지 않았다.** 비대화형 제출에
  필요한 건 `ascAppId`이고, 팀이 하나라 모호성이 없다. 리터럴이 적을수록 드리프트할 것도 적다.
  (참고: Team ID = App ID Prefix = `Y92U46899J`)

**`eas config`가 잡는 것과 못 잡는 것을 실측으로 갈랐다.**

- 못 쓰는 키는 **거부한다**: `submit.production.ios.totallyBogusField`를 넣으면 `eas config`·`eas submit` 모두
  `"...is not allowed"`로 로드 자체를 실패시킨다. 즉 오타 난 **키**는 로컬에서 잡힌다
- **값의 형식은 검증하지 않는다**: eas-cli가 문서상 `ascAppId`에 `/^\d+$/`(30자 이하)를 걸어두는데, `"680158239a"`를
  넣고 `eas config`를 돌리면 **깨끗하게 통과한다.** 즉 **App ID 오타는 모든 로컬 검사를 통과하고, 빌드를 하나 다 쓴
  뒤 실제 `eas submit`이 Apple에 닿을 때야 드러난다**

그래서 그 공백을 §12의 M1 테스트(`mobile/src/config/deployConfig.test.ts`)에 넣었다 — `ascAppId`가 숫자 전용·30자
이하인지, 그리고 **모든 `submit` 프로필이 같은 이름의 `build` 프로필을 갖는지**(짝이 없으면 제출되는 바이너리가
이름과 다른 프로필로 설정된 것이다) push 시점에 검사한다. 39 suites / **221 tests**.

**순서가 중요했다: `eas.json`을 먼저 확정하고 그 다음에 빌드한다.** §12.1에서 밝혀진 대로 `eas.json`은 파일 해시로
지문 입력이므로, 빌드부터 하고 나중에 `ascAppId`를 넣으면 그 빌드의 `runtimeVersion`이 이후 OTA와 어긋나
**TestFlight에 나간 빌드가 OTA 수정을 영영 못 받는다.** iOS·Android 빌드가 아직 하나도 없어 지금 확정하는 비용은 0이다.
이 편집으로 지문은 실제로 바뀌었고, **첫 빌드가 가질 값**은 다음이다(플랫폼별로 다르다):

| 플랫폼 | 편집 전(발행된 OTA) | 편집 후(첫 빌드가 가질 값) |
|---|---|---|
| ios | `51033673f568246cd175b114b986f16df363f816` | **`4a432b4847a1fc7ff1e56412a98cafbef42b396f`** |
| android | `d45c0fe445c43a091a8c9bfcfd4e5d432936a856` | **`9ef5e7accb9fd39a5b351c833f82c9015a33b922`** |

즉 §12.1에서 발행한 preview OTA는 **이제 어떤 빌드에도 도달하지 않는다.** 서빙할 빌드가 애초에 없었으므로 손실은
없지만, 이것이 §12.1의 운영 규칙("`eas.json`을 고쳤으면 OTA로 전달할 수 없다 — 새 빌드가 필요하다")이 실제로
발동한 첫 사례다.

**남은 미실행**: **ASC API 키(.p8) 미발급** — App Store Connect → Users and Access → Integrations에서 App Manager
역할로 발급하고 `.p8`은 한 번만 다운로드된다. **리포에 두지 않고 `eas credentials`로 EAS에 올린다.** 그리고 **첫
`eas build --platform ios`는 반드시 대화형이어야 한다** — eas-cli 소스에서 확인: 비대화형 모드는 Distribution
Certificate를 **생성할 수 없고**(`MissingCredentialsNonInteractiveError`) 기존 인증서 재사용만 된다. 즉 첫 빌드는
Apple 로그인 + 2FA가 필요해 사람이 직접 실행해야 하고, CI에서 돌릴 수 없다. 이후 빌드는 비대화형으로 재사용된다.

### 12.4 첫 실제 iOS 빌드 (2026-08-15) — `eas build`가 지문 입력을 스스로 바꾼다

**첫 `eas build --platform ios --profile production`이 성공했다**(build `8cb53bfa-a43a-4683-b248-6ff7d41a5fea`,
`FINISHED`/`STORE`, appVersion `1.0.0`·buildNumber `1`, 커밋 `0967981`). 카카오 SDK·애플 인증 같은 네이티브 의존이
EAS 빌더에서 처음 컴파일된 지점을 통과했고, IPA가 나왔다.

**§12.1이 남긴 마지막 미증명 항목이 여기서 닫혔다.** `build:list --json`이 그 빌드에 대해
`runtimeVersion = fingerprintHash = 020e92a8a257ed09cdb48f18d0275d66938d30a1`을 보고한다 → **`eas build`는 지문
해시를 실제로 바이너리의 런타임 버전으로 박는다.** 정책은 발행(§12.1)과 빌드(여기) 양쪽에서 소비된다.

**그런데 그 해시가 git 어디에도 없었다.** 대화형 빌드가 수출 규정 준수 프롬프트에서 `app.json`에
`ios.infoPlist.ITSAppUsesNonExemptEncryption = false`를 **추가하고**, 그 상태의 트리로 빌드를 올렸다. 그 편집은
커밋되지 않았다. `app.json`은 지문 입력이므로:

| | ios | android |
|---|---|---|
| `master`(그 필드 없음) | `4a432b4847a1fc7ff1e56412a98cafbef42b396f` | `9ef5e7accb9fd39a5b351c833f82c9015a33b922` |
| 작업 트리(그 필드 있음) = **출시된 IPA** | **`020e92a8a257ed09cdb48f18d0275d66938d30a1`** | `969286d7266eb4efe6eefc335e50265219c9932d` |

즉 **커밋 전에 `ota.yml`로 OTA를 발행하면**(워크플로는 `master`에서 돈다) `4a432b48…`이 계산돼 **출시된 IPA에
도달하지 않으면서 런은 green으로 끝난다.** §12.1이 규칙으로만 적어둔 무언 실패가 실제로 발생 가능한 상태였다.
`fix(mobile): eas build가 추가한 수출규정 필드를 커밋`(`0adfdc9`)으로 닫았고, `fingerprint:compare --build-id`가
이제 **일치**를 보고한다.

**위 §12.3 표를 정정한다.** 거기 적은 `4a432b48…`/`9ef5e7ac…`는 그 시점 `master`에 대해서는 맞았지만 "첫 빌드가
가질 값"으로는 틀렸다 — 빌드 자체가 지문 입력을 바꿔버리기 때문에, 빌드 전에 예측한 값이 빌드 후에도 유효하다는
보장이 없다. **지문은 빌드 전에 예측할 것이 아니라 빌드 후에 대조할 것이다.**

그리고 처음 이 불일치를 봤을 때 **`--build-profile` 플래그 누락을 원인으로 의심한 것은 오진이었다.** 실측 결과
`--build-profile`은 지문에 영향이 없다(`production`과 `preview`가 같은 값). 차이는 오직 `app.json`의 그 한 줄이었다.

**운영 규칙으로 추가한다**:

- **대화형 `eas build` 직후 반드시 `git status`를 확인하고, 생긴 변경을 커밋한다.** `eas build`는 읽기 전용이
  아니다 — 프롬프트 응답을 `app.json`에 기록하며, 그것이 곧 지문 입력이다
- **OTA 발행 전 대조 명령은 `eas fingerprint:compare --build-id <채널의 최신 완료 빌드>`다.** §12.1이 "발행 후
  요약의 `runtimeVersion`이 배포된 빌드의 것과 같은지 확인하는 것이 유일한 방법"이라고 했던 그 확인의 실제 명령이며,
  **발행 후 경고가 아니라 발행 전 차단**이 가능하다. `ota.yml`의 현재 사후 경고(§12 I4)보다 강하다 —
  다음 개선 항목으로 남긴다
- 지문 계산은 `fingerprint:generate` 단독보다 `fingerprint:compare`가 안전하다. 후자는 무엇과 비교하는지가
  명시되므로 "어떤 트리의 값인가"를 착각할 여지가 적다

**ASC API 키 발급 완료**: Key ID `SF3K6F73B6`, Issuer ID `4a44f9e0-8563-424d-8879-bada2ed8eba1`(둘 다 비밀이
아니라 식별자다 — 비밀은 `.p8` 개인키뿐이고 리포 밖에 있다). `.p8`은 `eas.json`에 경로를 박지 않고 첫
`eas submit` 때 EAS credentials에 올려 이후 제출·CI가 재사용하게 한다.

**남은 미실행**: `eas submit --platform ios`(TestFlight) · Android 전량(Play 신원확인·서비스 계정 키).

## 검토 게이트 (Human Gate)

- [ ] 배포 절차가 재현 가능하고 롤백 가능한가?
- [ ] 시크릿·환경 분리가 안전하게 구성되었는가?

## 다음 단계

승인 후 → `STATUS.md` 갱신 → `02-monitoring.md`로 이동
