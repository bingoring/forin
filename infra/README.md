# infra — forin 서버 인프라 (Terraform)

Cloud Run + Cloud SQL(서울) + Upstash Redis. 설계 근거는
`docs/dlc/projects/forin/03-operations/01-deployment.md`.

## 최초 1회 (사람이 해야 하는 것)

IaC로 자동화할 수 없는 경계다. 나머지는 전부 Terraform이 만든다.

1. **Upstash 계정 가입 + API 키 발급** (https://console.upstash.com) →
   `terraform/terraform.tfvars`에 `upstash_email`·`upstash_api_key`
2. **로컬 자격 1회**: `gcloud auth application-default login`
3. **LLM·Azure 키 확보** (Anthropic / OpenAI / Azure Speech 콘솔) — `make secrets`로 주입
4. **소셜 로그인 클라이언트 ID 확보** (Google/Apple/Kakao 콘솔) →
   `terraform/terraform.tfvars`에 `google_client_ids`·`apple_client_ids`·
   `kakao_client_ids` (기본값 없음 — 비우면 apply가 멈춘다. 로그인 수단이
   0개인 채로 뜨는 것보다 낫다)

## 순서

```bash
make bootstrap                 # GCS 상태 버킷 (Terraform이 자기 백엔드를 만들 수는 없다)
make init
make secrets-containers        # Secret Manager 컨테이너만 먼저 만든다 (값은 아직 없음)
make secrets ANTHROPIC_KEY=... OPENAI_KEY=... AZURE_SPEECH_KEY=...
make plan                      # 검토
make apply
```

**왜 두 단계 apply인가**: Cloud Run 서비스/Job은 생성 시점에 각 시크릿의 `latest`
버전을 즉시 읽는다(runtime.tf). 컨테이너만 있고 버전이 0개면 그 시점에 리비전
생성이 실패한다. 그래서 `secrets-containers`로 컨테이너만 먼저 만들고, `secrets`로
값을 채운 뒤에야 서비스·Job을 포함한 전체 `apply`를 돌린다.

`make secrets`는 JWT 서명 키(스테이징·프로덕션 각각 별도 값)와 staging dev-auth
시크릿을 **여기서 생성**하고 출력하지 않는다.

## 상태(state)

GCS `gs://forin-504711-tfstate/server` + 버전 관리 활성. `*.tfvars`와
`*.tfstate*`는 git-ignore 대상이다.

## 마이그레이션이 실패했을 때 (dirty 복구 런북)

golang-migrate는 마이그레이션이 중간에 실패하면 `schema_migrations`를 dirty로
표시하고 **이후 모든 실행을 거부한다.** 자동 복구하지 않는 것이 의도다 — 반쯤
적용된 스키마 위에 다음 마이그레이션을 얹는 것보다 멈추는 게 낫다.

```bash
REGION=asia-northeast3
ENVN=staging   # or prod

# 1. 어디서 멈췄는지 확인 (Job 로그의 before/after version=, dirty= 를 본다)
gcloud run jobs executions list --job=forin-migrate-$ENVN --region=$REGION --limit=1
gcloud logging read \
  "resource.type=cloud_run_job AND resource.labels.job_name=forin-migrate-$ENVN" \
  --limit=50 --format='value(textPayload)'

# 2. 실패한 마이그레이션의 .up.sql을 읽고, 부분 적용된 변경을 손으로 되돌린다.
#    (Cloud SQL Studio 또는 cloud-sql-proxy + psql)

# 3. dirty를 해제한다 — <이전버전>은 실패 직전에 성공했던 버전이다
gcloud run jobs update forin-migrate-$ENVN --region=$REGION --args=force,<이전버전> --quiet
gcloud run jobs execute forin-migrate-$ENVN --region=$REGION --wait

# 4. args를 up으로 되돌린 뒤 재실행
gcloud run jobs update forin-migrate-$ENVN --region=$REGION --args=up --quiet
gcloud run jobs execute forin-migrate-$ENVN --region=$REGION --wait
```

**3번을 2번보다 먼저 하지 않는다.** dirty만 풀고 재실행하면 이미 적용된 DDL을
다시 실행해 "이미 존재함" 에러로 또 실패한다.

파이프라인이 staging → 스모크 → prod 순인 첫 번째 이유가 이 절차다 — prod에서
dirty를 만나는 것보다 staging에서 만나는 게 훨씬 싸다.
