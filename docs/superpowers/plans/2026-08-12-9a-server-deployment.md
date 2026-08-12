# 9-A 서버 배포 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** forin 서버를 Cloud Run(서울)에 재현 가능·롤백 가능하게 배포하는 파이프라인을 만들고, staging에 스모크 57 assert가 통과하게 한다.

**Architecture:** 하나의 컨테이너 이미지가 세 엔트리포인트(`/api`·`/migrate`·`/seed`)를 담는다 — Cloud Run 서비스는 `/api`, Cloud Run Job이 나머지 둘을 **같은 다이제스트로** 실행하므로 스키마와 코드가 어긋날 수 없다. 마이그레이션은 `//go:embed`로 이미지에 고정되고 적용 지점은 DB의 `schema_migrations`가 기억한다. 인프라는 전량 Terraform이며 CI는 Workload Identity Federation으로 키 없이 배포한다.

**Tech Stack:** Go 1.26.2 (stdlib net/http, hexagonal) · golang-migrate v4 (라이브러리) · pgx v5 · Docker distroless · Terraform (google + upstash 프로바이더) · GitHub Actions · Cloud Run / Cloud SQL(PostgreSQL) / Artifact Registry / Secret Manager

**스펙:** `docs/dlc/projects/forin/03-operations/01-deployment.md` (§0–§10). 본 계획은 그 문서의 **9-A**만 다룬다. 9-B(모바일)는 별도 계획.

## Global Constraints

- Go 모듈 경로: `github.com/bingoring/forin/server` · Go 버전 `1.26.2`. 서버 명령은 모두 `server/` 디렉토리 기준.
- GCP 프로젝트 ID: `forin-504711` · 리전: `asia-northeast3` · Artifact Registry 이미지: `asia-northeast3-docker.pkg.dev/forin-504711/forin/api`
- Cloud SQL: **인스턴스 1개**에 데이터베이스 `forin_staging`·`forin_prod`, DB 사용자도 환경별 분리. 인스턴스 분리는 tfvar 하나로 전환 가능해야 한다.
- Redis: Upstash(도쿄), `rediss://` URL. 환경별 DB 2개.
- 커밋 메시지는 conventional-commit 한 줄(`feat(scope): …`), 한국어 본문. **`Co-Authored-By` 등 공동작업 트레일러 금지**, AI 서명 금지.
- **체크포인트마다 커밋 + 즉시 push.** 테스트 레드 상태로 커밋하지 않는다.
- 문서(`docs/dlc`)를 함께 고칠 때는 **서브모듈에서 먼저 커밋·push → 메인 repo에서 포인터 갱신 커밋·push**.
- 검증 명령: `cd server && go vet ./... && go test ./...` (현재 그린). 모바일은 9-A 범위 밖.
- `ENV=prod`에서 `/auth/dev`는 **등록되지 않아야 한다**(404). 이 불변식을 깨는 변경은 금지.

---

### Task 1: `cmd/migrate` — 마이그레이션을 이미지에 고정한 러너

**Files:**
- Create: `server/db/embed.go`
- Create: `server/db/embed_test.go`
- Create: `server/cmd/migrate/main.go`
- Modify: `server/go.mod`, `server/go.sum` (golang-migrate 추가)
- Modify: `server/Makefile` (로컬 편의 타깃)

**Interfaces:**
- Consumes: 없음 (첫 태스크)
- Produces:
  - `package db` (경로 `github.com/bingoring/forin/server/db`) → `var Migrations embed.FS` (루트에 `migrations/` 디렉토리를 담는다)
  - 바이너리 `/migrate`, CLI: `migrate up` (기본) · `migrate version` · `migrate force <version>`
  - 환경변수 `DATABASE_URL` 필수

> **왜 `server/db/embed.go`인가**: `//go:embed`는 `..` 상위 경로를 참조할 수 없다. `cmd/migrate/`에서 `../../db/migrations`를 임베드하는 것은 컴파일 에러이므로, 임베드 선언은 **`db/` 디렉토리 안**에 있어야 한다.

- [ ] **Step 1: golang-migrate 의존성 추가**

```bash
cd server
go get github.com/golang-migrate/migrate/v4@latest
go mod tidy
```

기대: `go.mod`의 `require`에 `github.com/golang-migrate/migrate/v4`가 추가된다. `lib/pq`는 쓰지 않는다 — 아래에서 pgx의 `database/sql` 드라이버를 등록해 재사용한다(의존성 하나 절약).

- [ ] **Step 2: 임베드 FS의 실패 테스트 작성**

Create `server/db/embed_test.go`:

```go
package db

import (
	"fmt"
	"strings"
	"testing"
)

// The binary must carry every migration. If embedding silently misses files, a
// Cloud Run Job would report "nothing to apply" on a schema it never applied.
//
// Deliberately no hardcoded file count: contiguous numbering plus an up/down
// pair per version already catches a glob that drops files, and it keeps
// working when migration 21 lands.
func TestEmbedCarriesEveryMigration(t *testing.T) {
	entries, err := Migrations.ReadDir("migrations")
	if err != nil {
		t.Fatalf("read embedded migrations: %v", err)
	}
	if len(entries) == 0 {
		t.Fatal("no migrations embedded")
	}

	// version prefix -> {up, down} seen
	ups := map[string]bool{}
	downs := map[string]bool{}
	for _, e := range entries {
		name := e.Name()
		version, _, ok := strings.Cut(name, "_")
		if !ok || len(version) != 6 {
			t.Fatalf("%q does not start with a 6-digit version prefix", name)
		}
		switch {
		case strings.HasSuffix(name, ".up.sql"):
			ups[version] = true
		case strings.HasSuffix(name, ".down.sql"):
			downs[version] = true
		default:
			t.Fatalf("%q is neither .up.sql nor .down.sql", name)
		}
	}

	for v := range ups {
		if !downs[v] {
			t.Errorf("version %s has an up but no down", v)
		}
	}
	for v := range downs {
		if !ups[v] {
			t.Errorf("version %s has a down but no up", v)
		}
	}

	// Contiguous from 000001: a gap means a file was dropped from the embed.
	for i := 1; i <= len(ups); i++ {
		want := fmt.Sprintf("%06d", i)
		if !ups[want] {
			t.Errorf("version %s is missing — numbering must be contiguous from 000001", want)
		}
	}
}
```

- [ ] **Step 3: 테스트가 실패하는 것을 확인**

Run: `cd server && go test ./db/...`
Expected: FAIL — `no Go files in .../server/db` (아직 패키지가 없다)

- [ ] **Step 4: 임베드 패키지 작성**

Create `server/db/embed.go`:

```go
// Package db embeds the SQL migrations so the binary carries them instead of
// depending on files next to the runner. A Cloud Run Job has no checkout.
package db

import "embed"

//go:embed migrations/*.sql
var Migrations embed.FS
```

- [ ] **Step 5: 테스트 통과 확인**

Run: `cd server && go test ./db/...`
Expected: PASS (`ok github.com/bingoring/forin/server/db`)

- [ ] **Step 6: `cmd/migrate` 작성**

Create `server/cmd/migrate/main.go`:

```go
// Command migrate applies the embedded SQL migrations to DATABASE_URL.
//
// Which migrations to apply is not a judgment call: golang-migrate keeps the
// last applied version in a schema_migrations table inside the target database
// and applies only the files above it. A fresh database gets all of them; an
// up-to-date one gets none and exits 0.
//
//	migrate            # same as `up`
//	migrate up         # apply everything pending
//	migrate version    # print current version and dirty flag
//	migrate force <v>  # clear a dirty flag after a manual repair
package main

import (
	"database/sql"
	"errors"
	"fmt"
	"os"
	"strconv"

	"github.com/golang-migrate/migrate/v4"
	migratepg "github.com/golang-migrate/migrate/v4/database/postgres"
	"github.com/golang-migrate/migrate/v4/source/iofs"
	_ "github.com/jackc/pgx/v5/stdlib" // registers the "pgx" database/sql driver

	"github.com/bingoring/forin/server/db"
)

func main() {
	if err := run(os.Args[1:]); err != nil {
		fmt.Fprintln(os.Stderr, "migrate:", err)
		os.Exit(1)
	}
}

func run(args []string) error {
	cmd := "up"
	if len(args) > 0 {
		cmd = args[0]
	}

	url := os.Getenv("DATABASE_URL")
	if url == "" {
		return errors.New("DATABASE_URL is required")
	}

	m, closeFn, err := open(url)
	if err != nil {
		return err
	}
	defer closeFn()

	report(m, "before")

	switch cmd {
	case "up":
		err = m.Up()
		if errors.Is(err, migrate.ErrNoChange) {
			fmt.Println("migrate: already up to date")
			err = nil
		}
	case "version":
		// report() already printed it.
	case "force":
		if len(args) < 2 {
			return errors.New("force needs a version: migrate force <version>")
		}
		v, convErr := strconv.Atoi(args[1])
		if convErr != nil {
			return fmt.Errorf("bad version %q: %w", args[1], convErr)
		}
		err = m.Force(v)
	default:
		return fmt.Errorf("unknown command %q (want up|version|force)", cmd)
	}
	if err != nil {
		report(m, "after (FAILED)")
		return err
	}
	report(m, "after")
	return nil
}

func open(url string) (*migrate.Migrate, func(), error) {
	src, err := iofs.New(db.Migrations, "migrations")
	if err != nil {
		return nil, nil, fmt.Errorf("embedded migrations: %w", err)
	}
	sqlDB, err := sql.Open("pgx", url)
	if err != nil {
		return nil, nil, fmt.Errorf("open db: %w", err)
	}
	if err := sqlDB.Ping(); err != nil {
		_ = sqlDB.Close()
		return nil, nil, fmt.Errorf("connect: %w", err)
	}
	drv, err := migratepg.WithInstance(sqlDB, &migratepg.Config{})
	if err != nil {
		_ = sqlDB.Close()
		return nil, nil, fmt.Errorf("postgres driver: %w", err)
	}
	m, err := migrate.NewWithInstance("iofs", src, "postgres", drv)
	if err != nil {
		_ = sqlDB.Close()
		return nil, nil, err
	}
	return m, func() { _ = sqlDB.Close() }, nil
}

// report prints the version and dirty flag. A failed migration leaves the
// database dirty and golang-migrate then refuses to run at all — that is
// deliberate, but it means the operator has to see WHERE it stopped.
func report(m *migrate.Migrate, when string) {
	v, dirty, err := m.Version()
	switch {
	case errors.Is(err, migrate.ErrNilVersion):
		fmt.Printf("migrate: %s version=none (fresh database)\n", when)
	case err != nil:
		fmt.Printf("migrate: %s version=unknown err=%v\n", when, err)
	default:
		fmt.Printf("migrate: %s version=%d dirty=%t\n", when, v, dirty)
	}
}
```

- [ ] **Step 7: 빌드·vet 확인**

Run: `cd server && go vet ./... && go build ./cmd/migrate && go test ./...`
Expected: 전부 통과, `server/migrate` 바이너리 생성 (커밋 전 삭제: `rm -f migrate`)

- [ ] **Step 8: 로컬 DB에 실제로 적용해 확인**

Run:
```bash
cd server
docker compose up -d postgres
DATABASE_URL='postgres://forin:forin@localhost:5432/forin?sslmode=disable' go run ./cmd/migrate version
DATABASE_URL='postgres://forin:forin@localhost:5432/forin?sslmode=disable' go run ./cmd/migrate up
DATABASE_URL='postgres://forin:forin@localhost:5432/forin?sslmode=disable' go run ./cmd/migrate up
```
Expected:
1. `version` → `version=20 dirty=false` (이미 적용된 로컬 DB) 또는 `version=none` (초기화된 볼륨)
2. 첫 `up` → 미적용분 적용 후 `after version=20 dirty=false`
3. 두 번째 `up` → `migrate: already up to date` + 종료코드 0 (**멱등 확인**)

- [ ] **Step 9: Makefile에 타깃 추가**

`server/Makefile`의 `.PHONY` 줄에 `migrate-embed` 를 추가하고, `migrate-down` 아래에 삽입:

```makefile
migrate-embed: ## apply migrations with the embedded runner (same code path as prod)
	DATABASE_URL="$(DATABASE_URL)" go run ./cmd/migrate up

migrate-version: ## print current schema version + dirty flag
	DATABASE_URL="$(DATABASE_URL)" go run ./cmd/migrate version
```

기존 `migrate-up`(CLI)은 **삭제하지 않는다** — 로컬 개발용으로 남긴다.

- [ ] **Step 10: 커밋**

```bash
cd /Users/ywyeom/private/forin
git add server/db server/cmd/migrate server/go.mod server/go.sum server/Makefile
git commit -m "$(cat <<'EOF'
feat(deploy): 마이그레이션을 이미지에 고정하는 cmd/migrate

Cloud Run Job은 golang-migrate CLI를 설치할 자리가 없고, 런너의 로컬 파일에
의존하면 "어느 마이그레이션까지 든 이미지인가"가 배포마다 달라진다.

- db/embed.go가 //go:embed로 migrations/*.sql을 담는다. go:embed는 ..를 못 쓰므로
  선언이 db/ 안에 있어야 한다
- 적용 지점 판단은 DB의 schema_migrations가 한다 — 새 DB는 전부, 기존은 증분,
  재실행은 무해(ErrNoChange를 성공으로 처리)
- 실패 시 dirty가 남아 이후 실행이 거부된다. 자동 복구하지 않고 before/after
  버전을 로그로 남겨 어디서 멈췄는지 보이게 했다. force는 수동 복구용
- database/sql 드라이버는 pgx stdlib를 재사용(lib/pq 추가 안 함)

검증: go vet/test 0 · 로컬 DB에 up 2회 실행해 멱등 확인
EOF
)"
git push origin master
```

---

### Task 2: Dockerfile — 세 바이너리 + 콘텐츠 번들

**Files:**
- Modify: `server/Dockerfile`

**Interfaces:**
- Consumes: Task 1의 `./cmd/migrate`
- Produces: 이미지 하나에 `/api`(ENTRYPOINT)·`/migrate`·`/seed`, `/content` 디렉토리, `CONTENT_DIR=/content` 기본값

- [ ] **Step 1: Dockerfile 교체**

`server/Dockerfile` 전체를 다음으로 바꾼다:

```dockerfile
# Multi-stage build → small static image (dev=prod parity via Docker).
#
# One image, three entrypoints: the Cloud Run service runs /api and Cloud Run
# Jobs run /migrate and /seed from the SAME digest, so a schema and the code
# that needs it can never drift apart.
FROM golang:1.26-alpine AS build
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -trimpath -o /out/api     ./cmd/api  && \
    CGO_ENABLED=0 GOOS=linux go build -trimpath -o /out/migrate ./cmd/migrate && \
    CGO_ENABLED=0 GOOS=linux go build -trimpath -o /out/seed    ./cmd/seed

FROM gcr.io/distroless/static-debian12:nonroot
COPY --from=build /out/api     /api
COPY --from=build /out/migrate /migrate
COPY --from=build /out/seed    /seed
# Authored content travels with the image so the seed Job has no checkout.
COPY --from=build /src/content /content
ENV CONTENT_DIR=/content
EXPOSE 8080
USER nonroot:nonroot
ENTRYPOINT ["/api"]
```

- [ ] **Step 2: 이미지 빌드**

Run: `cd server && docker build -t forin-api:local .`
Expected: 빌드 성공. 마지막 줄에 이미지 태그가 표시된다.

- [ ] **Step 3: 세 엔트리포인트가 이미지 안에 있는지 확인**

Run:
```bash
docker run --rm --entrypoint /migrate forin-api:local version; echo "exit=$?"
```
Expected: `migrate: DATABASE_URL is required` + `exit=1` — 바이너리가 존재하고 실행되며 설정 부재를 정확히 보고한다는 뜻.

- [ ] **Step 4: 콘텐츠가 이미지에 담겼는지 확인**

Run:
```bash
docker run --rm --entrypoint /seed forin-api:local; echo "exit=$?"
```
Expected: `seed: DATABASE_URL is required` + `exit=1` (콘텐츠 로드보다 DB 검사가 먼저다). 콘텐츠 존재는 Task 3의 Step 8에서 실제 시드로 확인한다.

- [ ] **Step 5: 로컬 컨테이너에서 마이그레이션 실행**

Run:
```bash
cd server && docker compose up -d postgres
docker run --rm --network host -e DATABASE_URL='postgres://forin:forin@localhost:5432/forin?sslmode=disable' \
  --entrypoint /migrate forin-api:local up
```
Expected: `migrate: already up to date` 또는 적용 로그 + `after version=20 dirty=false`, 종료코드 0
(macOS Docker Desktop에서 `--network host`가 동작하지 않으면 `-e DATABASE_URL='postgres://forin:forin@host.docker.internal:5432/forin?sslmode=disable'` 로 대체)

- [ ] **Step 6: 커밋**

```bash
cd /Users/ywyeom/private/forin
git add server/Dockerfile
git commit -m "$(cat <<'EOF'
feat(deploy): 이미지 하나에 api·migrate·seed + 콘텐츠 번들

Cloud Run 서비스가 /api, Job이 /migrate·/seed를 같은 다이제스트로 실행한다.
이미지를 나누면 "어느 마이그레이션까지 적용된 DB에 어느 코드가 붙어 있는가"를
사람이 기억해야 한다.

- 콘텐츠 6.8MB를 /content로 담고 CONTENT_DIR 기본값을 그리로 — 시드 Job에는
  체크아웃이 없다
- distroless nonroot 유지

검증: docker build · /migrate version이 설정 부재를 정확히 보고 · 로컬 postgres에
컨테이너로 up 실행
EOF
)"
git push origin master
```

---

### Task 3: 콘텐츠 시드 가드 — ID가 줄어드는 배포를 막는다

**Files:**
- Create: `server/internal/curriculum/referenced.go`
- Create: `server/internal/curriculum/referenced_test.go`
- Create: `server/cmd/seed/guard.go`
- Create: `server/cmd/seed/guard_test.go`
- Modify: `server/cmd/seed/main.go`

**Interfaces:**
- Consumes: `content.Bundle{Scenarios []Scenario, Quizzes []Quiz}` (필드 `ID string`), `postgres.NewPool(ctx, url)`
- Produces:
  - `curriculum.ReferencedIDs() []string` — 카탈로그 전 챕터의 `Step.ScenarioID` (퀴즈 스텝의 `QZ-*` 포함)
  - `missingIDs(bundleIDs, referenced map[string]bool) []string` (cmd/seed 내부, 정렬된 결과)
  - 환경변수 `SEED_ALLOW_REMOVAL=1` — 의도적 콘텐츠 은퇴 시의 명시적 우회

> **가드가 검사하는 참조 출처**: 커리큘럼 카탈로그 + DB의 **영속적** 3곳 —
> `scenario_attempts.scenario_id`, `review_cards.scenario_id`, `conversation_sessions.scenario_id`.
> `user_presence.scenario_id`와 `user_daily_event_sets.scenario_ids`는 **일시적**(현재 위치·00:00 리셋되는 일일 풀)이라
> 제외한다 — 스쳐 지난 시나리오 때문에 콘텐츠 은퇴가 영구히 막히면 안 된다.

- [ ] **Step 1: `curriculum.ReferencedIDs`의 실패 테스트 작성**

Create `server/internal/curriculum/referenced_test.go`:

```go
package curriculum

import "testing"

// The seed guard needs every id the path points at — including quiz steps,
// whose ScenarioID holds a QZ-* id. Missing those would let a seed delete a
// quiz the curriculum still links to.
func TestReferencedIDsCoversEveryStep(t *testing.T) {
	ids := ReferencedIDs()
	if len(ids) < 100 {
		t.Fatalf("expected the whole path's ids, got %d", len(ids))
	}
	seen := map[string]bool{}
	for _, id := range ids {
		if id == "" {
			t.Fatal("empty id in referenced set")
		}
		if seen[id] {
			t.Fatalf("duplicate id %q — the set must be deduplicated", id)
		}
		seen[id] = true
	}
	var quizzes int
	for _, id := range ids {
		if len(id) >= 3 && id[:3] == "QZ-" {
			quizzes++
		}
	}
	if quizzes == 0 {
		t.Fatal("no QZ-* ids — quiz steps are being dropped")
	}
	for _, c := range catalog {
		for _, s := range c.Steps {
			if s.ScenarioID != "" && !seen[s.ScenarioID] {
				t.Errorf("%s / %s (%s) missing from ReferencedIDs", c.Name, s.Name, s.ScenarioID)
			}
		}
	}
}
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `cd server && go test ./internal/curriculum/ -run TestReferencedIDs -v`
Expected: FAIL — `undefined: ReferencedIDs`

- [ ] **Step 3: `ReferencedIDs` 구현**

Create `server/internal/curriculum/referenced.go`:

```go
package curriculum

import "sort"

// ReferencedIDs returns every content id the learning path points at, scenarios
// and quizzes alike. The seed guard uses it to refuse a content bundle that
// would delete something the path still links to — a step pointing at a missing
// id is a dead end, and the home screen's "오늘의 한 가지" would hand the learner
// a broken link.
func ReferencedIDs() []string {
	seen := map[string]bool{}
	for _, c := range catalog {
		for _, s := range c.Steps {
			if s.ScenarioID != "" {
				seen[s.ScenarioID] = true
			}
		}
	}
	ids := make([]string, 0, len(seen))
	for id := range seen {
		ids = append(ids, id)
	}
	sort.Strings(ids)
	return ids
}
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `cd server && go test ./internal/curriculum/ -v`
Expected: PASS (기존 `TestCatalogIsGapless`·`TestEveryStepHasAScenario` 포함)

- [ ] **Step 5: 가드 순수 로직의 실패 테스트 작성**

Create `server/cmd/seed/guard_test.go`:

```go
package main

import (
	"reflect"
	"testing"
)

func TestMissingIDsReportsWhatWouldDisappear(t *testing.T) {
	bundle := map[string]bool{"SCN-ER-00001": true, "QZ-ER-00001": true}
	referenced := map[string]bool{
		"SCN-ER-00001":   true, // present
		"SCN-WARD-00101": true, // gone
		"QZ-WARD-00101":  true, // gone
	}
	got := missingIDs(bundle, referenced)
	want := []string{"QZ-WARD-00101", "SCN-WARD-00101"} // sorted
	if !reflect.DeepEqual(got, want) {
		t.Fatalf("got %v, want %v", got, want)
	}
}

func TestMissingIDsEmptyWhenBundleGrows(t *testing.T) {
	bundle := map[string]bool{"A": true, "B": true, "C": true}
	referenced := map[string]bool{"A": true, "B": true}
	if got := missingIDs(bundle, referenced); len(got) != 0 {
		t.Fatalf("a growing bundle must pass, got %v", got)
	}
}

// An empty referenced set means nothing is at risk — a first seed into a fresh
// database must not be blocked.
func TestMissingIDsAllowsFirstSeed(t *testing.T) {
	if got := missingIDs(map[string]bool{"A": true}, map[string]bool{}); len(got) != 0 {
		t.Fatalf("first seed must pass, got %v", got)
	}
}
```

- [ ] **Step 6: 테스트 실패 확인**

Run: `cd server && go test ./cmd/seed/ -v`
Expected: FAIL — `undefined: missingIDs`

- [ ] **Step 7: 가드 구현**

Create `server/cmd/seed/guard.go`:

```go
package main

import (
	"context"
	"sort"

	"github.com/jackc/pgx/v5/pgxpool"
)

// missingIDs returns the referenced ids the bundle does not carry, sorted.
// Content is supposed to grow; a bundle that shrinks is more likely an accident
// than an intentional retirement.
func missingIDs(bundle, referenced map[string]bool) []string {
	var missing []string
	for id := range referenced {
		if !bundle[id] {
			missing = append(missing, id)
		}
	}
	sort.Strings(missing)
	return missing
}

// referencedInDB collects content ids that durable learner state points at.
//
// Only durable state counts. user_presence.scenario_id (where someone is right
// now) and user_daily_event_sets.scenario_ids (regenerated at 00:00) are
// transient — blocking a retirement because someone walked past a scenario
// yesterday would make content impossible to retire.
func referencedInDB(ctx context.Context, pool *pgxpool.Pool) (map[string]bool, error) {
	const q = `
		SELECT DISTINCT scenario_id FROM scenario_attempts      WHERE scenario_id <> ''
		UNION
		SELECT DISTINCT scenario_id FROM review_cards           WHERE scenario_id <> ''
		UNION
		SELECT DISTINCT scenario_id FROM conversation_sessions  WHERE scenario_id <> ''`
	rows, err := pool.Query(ctx, q)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	ids := map[string]bool{}
	for rows.Next() {
		var id string
		if err := rows.Scan(&id); err != nil {
			return nil, err
		}
		ids[id] = true
	}
	return ids, rows.Err()
}
```

- [ ] **Step 8: 테스트 통과 확인**

Run: `cd server && go test ./cmd/seed/ -v`
Expected: PASS (3개 테스트)

- [ ] **Step 9: `cmd/seed/main.go`에 가드 배선**

`server/cmd/seed/main.go`의 `run()`에서, `postgres.NewPool` 직후·`Seed` 호출 **앞에** 가드를 넣는다. 아래 두 곳을 편집한다.

import 블록에 추가:

```go
	"github.com/bingoring/forin/server/internal/curriculum"
```

`pool` 생성 이후 `Seed` 호출 앞에 삽입:

```go
	// Seed replaces content wholesale (DELETE then INSERT in one transaction).
	// Learner progress survives — scenario_id columns carry no foreign key — but
	// dropping an id leaves those rows pointing at nothing. So refuse a bundle
	// that would remove anything the curriculum or durable learner state still
	// references.
	have := make(map[string]bool, len(bundle.Scenarios)+len(bundle.Quizzes))
	for _, s := range bundle.Scenarios {
		have[s.ID] = true
	}
	for _, q := range bundle.Quizzes {
		have[q.ID] = true
	}
	referenced := map[string]bool{}
	for _, id := range curriculum.ReferencedIDs() {
		referenced[id] = true
	}
	inUse, err := referencedInDB(ctx, pool)
	if err != nil {
		return fmt.Errorf("collect referenced ids: %w", err)
	}
	for id := range inUse {
		referenced[id] = true
	}
	if missing := missingIDs(have, referenced); len(missing) > 0 {
		if os.Getenv("SEED_ALLOW_REMOVAL") != "1" {
			fmt.Fprintf(os.Stderr, "seed would remove %d referenced id(s):\n", len(missing))
			for _, id := range missing {
				fmt.Fprintln(os.Stderr, "  -", id)
			}
			return fmt.Errorf("aborting: content shrank; set SEED_ALLOW_REMOVAL=1 to retire content on purpose")
		}
		fmt.Fprintf(os.Stderr, "seed: SEED_ALLOW_REMOVAL=1 — removing %d referenced id(s) anyway\n", len(missing))
	}
```

- [ ] **Step 10: 빌드·전체 테스트**

Run: `cd server && go vet ./... && go test ./...`
Expected: 전부 통과

- [ ] **Step 11: 로컬 DB에 실제 시드로 확인**

Run:
```bash
cd server && docker compose up -d postgres
DATABASE_URL='postgres://forin:forin@localhost:5432/forin?sslmode=disable' go run ./cmd/seed
```
Expected: `seeded content <version>: N departments, … ` — 현재 콘텐츠는 커리큘럼 173개 ID를 전부 포함하므로 가드를 통과해야 한다. **실패하면 그것 자체가 발견**이니 누락 ID 목록을 보고하고 멈춘다.

- [ ] **Step 12: 가드가 실제로 막는지 확인 (역방향 검증)**

Run:
```bash
cd server
mv content/nurse/scenarios/ward.yaml /tmp/ward.yaml.bak
DATABASE_URL='postgres://forin:forin@localhost:5432/forin?sslmode=disable' go run ./cmd/seed; echo "exit=$?"
mv /tmp/ward.yaml.bak content/nurse/scenarios/ward.yaml
```
Expected: `seed would remove N referenced id(s):` + `SCN-WARD-*` 목록 + `exit=1`.
(파일명이 다르면 `ls content/nurse/scenarios/` 로 병동 뱅크 파일을 확인해 대체한다. 마지막 `mv`로 **반드시 복원**한다.)

- [ ] **Step 13: 복원 확인 후 커밋**

```bash
cd /Users/ywyeom/private/forin
git status --short   # content/ 에 변경이 없어야 한다
git add server/internal/curriculum/referenced.go server/internal/curriculum/referenced_test.go \
        server/cmd/seed/guard.go server/cmd/seed/guard_test.go server/cmd/seed/main.go
git commit -m "$(cat <<'EOF'
feat(deploy): 콘텐츠가 줄어드는 시드를 거부하는 가드

Seed는 단일 트랜잭션 안에서 DELETE 6종 → INSERT, 즉 교체다. 진행도는 FK가 없어
cascade로 지워지지 않지만, ID가 사라지면 진행도·복습 카드가 없는 시나리오를
가리키게 된다.

- 커리큘럼 참조 ID(퀴즈 QZ-* 포함) + DB의 영속 참조 3곳(scenario_attempts·
  review_cards·conversation_sessions)을 합쳐 번들이 그 집합을 포함하는지 검사
- user_presence·daily_event_sets는 일시적이라 제외 — 스쳐 지난 시나리오 때문에
  콘텐츠 은퇴가 영구히 막히면 안 된다
- 의도적 은퇴는 SEED_ALLOW_REMOVAL=1로 명시
- 빈 참조 집합(첫 시드)은 통과

검증: 단위 3종 · 실제 시드 통과 · 병동 뱅크를 치우면 exit 1로 거부되는 역방향 확인
EOF
)"
git push origin master
```

---

### Task 4: staging에서 스모크를 돌릴 인증 경로 (프로덕션 백도어 없이)

**Files:**
- Create: `server/internal/adapters/http/devauth.go`
- Create: `server/internal/adapters/http/devauth_test.go`
- Modify: `server/internal/config/config.go`
- Modify: `server/internal/config/config_test.go`
- Modify: `server/internal/adapters/http/router.go`
- Modify: `server/internal/adapters/http/auth_handler.go`
- Modify: `server/cmd/api/main.go`
- Modify: `server/scripts/e2e_smoke.sh`

**Interfaces:**
- Consumes: `config.Config`, `httpadapter.Deps`
- Produces:
  - `Config.DevAuthSecret string` (환경변수 `DEV_AUTH_SECRET`)
  - `Deps.DevAuthSecret string`
  - `devAccessAllowed(env, secret, header string) bool` (http 패키지 내부, 순수)
  - 스모크 스크립트가 `DEV_AUTH_SECRET` 환경변수를 읽어 `X-Dev-Auth` 헤더로 전송

> **문제**: 스모크 57 assert는 `POST /auth/dev`로 인증하고 그 경로는 `Env == "dev"`에서만 등록된다. staging을 `ENV=dev`로 돌리면 **공개 URL에 인증 우회가 열린다**. `ENV=prod`로 돌리면 스모크가 인증할 수 없다.
> **해결**: 경로를 **시크릿이 설정된 환경에서만** 등록하고, `dev`가 아닐 때는 일치하는 `X-Dev-Auth` 헤더를 요구한다. prod는 시크릿을 주지 않으므로 **경로 자체가 없다**(404) — 스펙 §8의 불변식이 그대로 유지된다.

- [ ] **Step 1: 순수 판정 함수의 실패 테스트 작성**

Create `server/internal/adapters/http/devauth_test.go`:

```go
package http

import "testing"

func TestDevAccessAllowed(t *testing.T) {
	cases := []struct {
		name   string
		env    string
		secret string
		header string
		want   bool
	}{
		{"local dev needs nothing", "dev", "", "", true},
		{"prod without a secret is closed", "prod", "", "", false},
		{"prod ignores a guessed header when no secret is set", "prod", "", "anything", false},
		{"staging with the right secret", "staging", "s3cret", "s3cret", true},
		{"staging with the wrong secret", "staging", "s3cret", "nope", false},
		{"staging with no header", "staging", "s3cret", "", false},
		{"an empty secret never matches an empty header", "staging", "", "", false},
	}
	for _, c := range cases {
		if got := devAccessAllowed(c.env, c.secret, c.header); got != c.want {
			t.Errorf("%s: devAccessAllowed(%q,%q,%q) = %v, want %v", c.name, c.env, c.secret, c.header, got, c.want)
		}
	}
}
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `cd server && go test ./internal/adapters/http/ -v`
Expected: FAIL — `undefined: devAccessAllowed`

- [ ] **Step 3: 판정 함수 구현**

Create `server/internal/adapters/http/devauth.go`:

```go
package http

import "crypto/subtle"

// devAccessAllowed decides whether the dev-login bypass may be used.
//
// Local development needs no ceremony. Anywhere else the caller must present a
// secret that was deliberately configured for that environment — production
// leaves DEV_AUTH_SECRET unset, so the route is never even registered and this
// function would refuse anyway. An empty secret matches nothing: otherwise a
// misconfigured staging would accept a missing header.
func devAccessAllowed(env, secret, header string) bool {
	if env == "dev" {
		return true
	}
	if secret == "" {
		return false
	}
	return subtle.ConstantTimeCompare([]byte(secret), []byte(header)) == 1
}
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `cd server && go test ./internal/adapters/http/ -v`
Expected: PASS (7 케이스)

- [ ] **Step 5: config에 시크릿 추가**

`server/internal/config/config.go` — `Config` 구조체의 `JWTIssuer` 아래에 추가:

```go
	// DevAuthSecret gates POST /auth/dev outside local development. Empty in
	// production, so the route is not registered there at all.
	DevAuthSecret string
```

`Load()`의 필드 초기화에서 `JWTIssuer` 다음 줄에 추가:

```go
		DevAuthSecret:            os.Getenv("DEV_AUTH_SECRET"),
```

- [ ] **Step 6: config 테스트에 케이스 추가**

`server/internal/config/config_test.go` 끝에 추가:

```go
func TestLoadReadsDevAuthSecret(t *testing.T) {
	t.Setenv("DATABASE_URL", "postgres://x/y")
	t.Setenv("REDIS_URL", "redis://localhost:6379/0")
	t.Setenv("JWT_SIGNING_KEY", "0123456789abcdef")
	t.Setenv("DEV_AUTH_SECRET", "staging-only")
	c, err := Load()
	if err != nil {
		t.Fatalf("Load: %v", err)
	}
	if c.DevAuthSecret != "staging-only" {
		t.Fatalf("DevAuthSecret = %q, want %q", c.DevAuthSecret, "staging-only")
	}
}

// Production must not carry the bypass secret.
func TestLoadDevAuthSecretDefaultsEmpty(t *testing.T) {
	t.Setenv("DATABASE_URL", "postgres://x/y")
	t.Setenv("REDIS_URL", "redis://localhost:6379/0")
	t.Setenv("JWT_SIGNING_KEY", "0123456789abcdef")
	t.Setenv("DEV_AUTH_SECRET", "")
	c, err := Load()
	if err != nil {
		t.Fatalf("Load: %v", err)
	}
	if c.DevAuthSecret != "" {
		t.Fatalf("DevAuthSecret = %q, want empty", c.DevAuthSecret)
	}
}
```

Run: `cd server && go test ./internal/config/ -v`
Expected: PASS. 실패하면 기존 `config_test.go`가 어떤 환경변수를 세팅하는지 읽고 필수 3종(`DATABASE_URL`·`REDIS_URL`·`JWT_SIGNING_KEY`)을 그 방식에 맞춘다.

- [ ] **Step 7: router·handler 배선**

`server/internal/adapters/http/router.go`:

1. `Deps` 구조체의 `Env` 필드 아래에 추가:
```go
	DevAuthSecret string // gates POST /auth/dev outside dev; empty in prod
```
2. 인증 라우트 등록부를 교체:
```go
	ah := &authHandler{svc: d.AuthSvc, log: d.Log, env: d.Env, devSecret: d.DevAuthSecret}
	mux.HandleFunc("POST /auth/social", ah.social)
	mux.HandleFunc("POST /auth/refresh", ah.refresh)
	// Registered only where the bypass is deliberately enabled: local dev, or an
	// environment that was given DEV_AUTH_SECRET (staging, for the smoke test).
	// Production sets neither, so the route does not exist there.
	if d.Env == "dev" || d.DevAuthSecret != "" {
		mux.HandleFunc("POST /auth/dev", ah.dev)
	}
```

`server/internal/adapters/http/auth_handler.go`:

3. `authHandler` 구조체에 필드 추가 (`svc`/`log` 옆):
```go
	env       string
	devSecret string
```
4. `dev` 핸들러 본문 맨 앞에 게이트 추가하고 주석을 갱신:
```go
// @Summary Dev login (no provider). Registered only in dev or where DEV_AUTH_SECRET is set.
// @Tags auth
// @Produce json
// @Success 200 {object} loginResp
// @Router /auth/dev [post]
func (h *authHandler) dev(w http.ResponseWriter, r *http.Request) {
	// 404, not 401: outside dev this route should look like it does not exist.
	if !devAccessAllowed(h.env, h.devSecret, r.Header.Get("X-Dev-Auth")) {
		httpx.Error(w, http.StatusNotFound, "not found")
		return
	}
	pair, u, err := h.svc.DevLogin(r.Context())
	...
```

`server/cmd/api/main.go` — `httpadapter.Deps{...}` 리터럴에서 `Env:` 옆에 추가:
```go
		DevAuthSecret: cfg.DevAuthSecret,
```

- [ ] **Step 8: 빌드·전체 테스트**

Run: `cd server && go vet ./... && go test ./...`
Expected: 전부 통과

- [ ] **Step 9: 스모크 스크립트가 헤더를 보내게 수정**

`server/scripts/e2e_smoke.sh`의 `run()` 함수에서 두 `curl` 호출에 헤더를 추가한다. `B=` 줄 아래에 추가:

```bash
# staging/prod-shaped environments register /auth/dev only when DEV_AUTH_SECRET is
# configured, and then require it as a header. Locally this is empty and unused.
DEV_AUTH="${DEV_AUTH_SECRET:-}"
```

그리고 `run()` 안의 두 curl 명령에 `-H "X-Dev-Auth: $DEV_AUTH"` 를 각각 추가한다:

```bash
  if [ -n "$d" ]; then
    out=$(curl -s -w $'\n%{http_code}' -X "$m" "$B$p" -H "Authorization: Bearer $TOK" -H "X-Dev-Auth: $DEV_AUTH" -H 'Content-Type: application/json' -d "$d")
  else
    out=$(curl -s -w $'\n%{http_code}' -X "$m" "$B$p" -H "Authorization: Bearer $TOK" -H "X-Dev-Auth: $DEV_AUTH")
  fi
```

또한 사용법 주석을 갱신한다:
```bash
#   usage: ./scripts/e2e_smoke.sh [BASE_URL]   (default http://localhost:8080)
#   env:   DEV_AUTH_SECRET — required against staging (see 3-1 §Task 4); unused locally
```

- [ ] **Step 10: 로컬 스모크 재통과 확인 (회귀 없음)**

Run:
```bash
cd server
docker compose up -d
# 서버가 준비될 때까지 기다린 뒤 (readyz 200)
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:8080/readyz
./scripts/e2e_smoke.sh
```
Expected: `57/0` (또는 현재 기준선). **어느 assert도 새로 실패하지 않아야 한다** — 로컬은 `ENV=dev`라 게이트가 통과하고, 빈 `X-Dev-Auth` 헤더는 무해하다.

- [ ] **Step 11: 계약 재생성 (swag 주석이 바뀜)**

Run: `cd server && make contract && cd .. && git diff --stat packages/contract`
Expected: `/auth/dev`의 summary 문구만 바뀐다. 경로 수가 줄어들면 안 된다 — `git diff packages/contract/openapi.yaml | grep '^-.*:$'` 로 확인한다.

- [ ] **Step 12: 커밋**

```bash
cd /Users/ywyeom/private/forin
git add server/internal/adapters/http server/internal/config server/cmd/api/main.go \
        server/scripts/e2e_smoke.sh packages/contract
git commit -m "$(cat <<'EOF'
feat(deploy): staging 스모크용 인증 경로 — 프로덕션 백도어는 만들지 않고

스모크 57 assert는 POST /auth/dev로 인증하는데 그 경로는 ENV=dev에서만 등록된다.
staging을 ENV=dev로 돌리면 공개 URL에 인증 우회가 열리고, ENV=prod로 돌리면
스모크가 인증할 수 없다.

- DEV_AUTH_SECRET이 설정된 환경에서만 경로를 등록하고, dev가 아니면 일치하는
  X-Dev-Auth 헤더를 요구한다. prod는 시크릿을 주지 않으므로 경로 자체가 없다
- 404로 응답한다(401 아님) — 밖에서는 존재하지 않는 것처럼 보여야 한다
- 빈 시크릿은 빈 헤더와도 일치하지 않는다. 오설정된 staging이 문을 열지 않게
- 비교는 constant-time

검증: 순수 판정 7케이스 · config 2케이스 · go vet/test 0 · 로컬 스모크 회귀 없음
EOF
)"
git push origin master
```

---

### Task 5: Terraform — 부트스트랩 + 데이터 계층

**Files:**
- Create: `infra/terraform/versions.tf`
- Create: `infra/terraform/variables.tf`
- Create: `infra/terraform/main.tf` (프로젝트 서비스 활성화, Artifact Registry)
- Create: `infra/terraform/database.tf` (Cloud SQL 인스턴스·DB·사용자, Upstash Redis)
- Create: `infra/terraform/secrets.tf` (Secret Manager 컨테이너)
- Create: `infra/terraform/terraform.tfvars.example`
- Create: `infra/Makefile`
- Create: `infra/README.md`
- Modify: `.gitignore` (`*.tfvars`, `.terraform/`, `*.tfstate*`)

**Interfaces:**
- Consumes: 없음 (인프라 계층의 시작)
- Produces (Task 6이 참조):
  - `local.envs = ["staging", "prod"]`
  - `google_sql_database_instance.pg` · `google_sql_database.db[env]` · `google_sql_user.app[env]`
  - `upstash_redis_database.cache[env]`
  - `google_secret_manager_secret.app[key]` — 키: `jwt-signing-key`, `anthropic-key`, `openai-key`, `azure-speech-key`, `db-password-staging`, `db-password-prod`, `redis-url-staging`, `redis-url-prod`, `dev-auth-secret-staging`
  - `google_artifact_registry_repository.forin`
  - 변수 `var.split_sql_instances` (기본 `false`) — 인스턴스 분리 전환 스위치

- [ ] **Step 1: `.gitignore`에 Terraform 산출물 추가**

루트 `.gitignore` 끝에 추가:

```gitignore
# Terraform
.terraform/
*.tfstate
*.tfstate.*
*.tfvars
!*.tfvars.example
.terraform.lock.hcl
```

- [ ] **Step 2: 프로바이더·백엔드 선언**

Create `infra/terraform/versions.tf`:

```hcl
terraform {
  required_version = ">= 1.9"

  # State lives in GCS. The bucket is created by `make -C infra bootstrap`
  # before the first init — a remote backend cannot create its own bucket.
  backend "gcs" {
    bucket = "forin-504711-tfstate"
    prefix = "server"
  }

  required_providers {
    google  = { source = "hashicorp/google", version = "~> 6.0" }
    upstash = { source = "upstash/upstash", version = "~> 1.5" }
    random  = { source = "hashicorp/random", version = "~> 3.6" }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# Account signup and API-key creation are manual (Upstash has no IaC for those);
# everything after that is declared here.
provider "upstash" {
  email   = var.upstash_email
  api_key = var.upstash_api_key
}
```

- [ ] **Step 3: 변수 선언**

Create `infra/terraform/variables.tf`:

```hcl
variable "project_id" {
  description = "GCP project id"
  type        = string
  default     = "forin-504711"
}

variable "region" {
  description = "GCP region. Seoul keeps the non-AI round trips short for Korean users."
  type        = string
  default     = "asia-northeast3"
}

variable "sql_tier" {
  description = "Cloud SQL machine tier. Shared-core is cheapest but carries no SLA."
  type        = string
  default     = "db-f1-micro"
}

# One instance holds forin_staging and forin_prod: the fixed cost is the
# instance, so a second database is nearly free. What stays shared is compute,
# connection limits, backup granularity and maintenance windows — flip this when
# real traffic makes that unacceptable.
variable "split_sql_instances" {
  description = "Give each environment its own Cloud SQL instance"
  type        = bool
  default     = false
}

variable "upstash_email" {
  description = "Upstash account email (manual signup)"
  type        = string
}

variable "upstash_api_key" {
  description = "Upstash API key (manual creation in the Upstash console)"
  type        = string
  sensitive   = true
}

variable "github_repo" {
  description = "owner/name of the repo allowed to deploy via Workload Identity Federation"
  type        = string
  default     = "bingoring/forin"
}
```

Create `infra/terraform/terraform.tfvars.example`:

```hcl
# Copy to terraform.tfvars (git-ignored) and fill in.
upstash_email   = "you@example.com"
upstash_api_key = "..."
```

- [ ] **Step 4: 프로젝트 서비스 + Artifact Registry**

Create `infra/terraform/main.tf`:

```hcl
locals {
  envs = ["staging", "prod"]
}

resource "google_project_service" "required" {
  for_each = toset([
    "run.googleapis.com",
    "sqladmin.googleapis.com",
    "secretmanager.googleapis.com",
    "artifactregistry.googleapis.com",
    "iamcredentials.googleapis.com",
    "iam.googleapis.com",
    "cloudresourcemanager.googleapis.com",
  ])
  service = each.value
  # Keep the APIs on if this config is ever destroyed — turning them off would
  # break anything else in the project that uses them.
  disable_on_destroy = false
}

resource "google_artifact_registry_repository" "forin" {
  location      = var.region
  repository_id = "forin"
  format        = "DOCKER"
  description   = "forin server images (one image, three entrypoints)"

  depends_on = [google_project_service.required]
}
```

- [ ] **Step 5: 데이터 계층**

Create `infra/terraform/database.tf`:

```hcl
# Instance keys: one shared instance by default, or one per environment when
# var.split_sql_instances flips. Keeping this in a for_each means the switch is
# a variable change rather than a rewrite.
locals {
  sql_instances = var.split_sql_instances ? local.envs : ["shared"]
  sql_owner     = { for e in local.envs : e => var.split_sql_instances ? e : "shared" }
}

resource "google_sql_database_instance" "pg" {
  for_each         = toset(local.sql_instances)
  name             = "forin-pg-${each.value}"
  database_version = "POSTGRES_16"
  region           = var.region

  settings {
    tier              = var.sql_tier
    availability_type = "ZONAL"
    disk_size         = 10
    disk_autoresize   = true

    backup_configuration {
      enabled                        = true
      point_in_time_recovery_enabled = true
      start_time                     = "18:00" # 03:00 KST
    }

    ip_configuration {
      # The instance has an IP but no authorized networks, so direct TCP from
      # anywhere is refused. Cloud Run reaches it through the Cloud SQL
      # connector, which authenticates with IAM and an ephemeral certificate
      # over a unix socket.
      #
      # Turning ipv4_enabled off instead would require a VPC network, private
      # services access and Direct VPC egress — the connector has no path to a
      # private-IP-only instance without them. That is a later hardening step,
      # not a default.
      ipv4_enabled       = true
      authorized_networks = [] # explicit: nothing may connect directly
    }
  }

  # Leave this on until launch is behind us; flipping it to false is a
  # deliberate act, not a default.
  deletion_protection = true

  depends_on = [google_project_service.required]
}

resource "google_sql_database" "db" {
  for_each = toset(local.envs)
  name     = "forin_${each.value}"
  instance = google_sql_database_instance.pg[local.sql_owner[each.value]].name
}

resource "random_password" "db" {
  for_each = toset(local.envs)
  length   = 32
  special  = false # keep it URL-safe: the password goes into DATABASE_URL
}

resource "google_sql_user" "app" {
  for_each = toset(local.envs)
  name     = "forin_${each.value}"
  instance = google_sql_database_instance.pg[local.sql_owner[each.value]].name
  password = random_password.db[each.value].result
}

# Redis is not a cache here: RefreshStore keeps refresh-token hashes with a
# 30-day TTL, so losing it logs everyone out. Serverless Redis in Tokyo — the
# workload (cache, rate limit, daily reset, token store) is not latency-critical
# at the millisecond level, and Memorystore would add fixed cost plus a VPC
# connector.
resource "upstash_redis_database" "cache" {
  for_each      = toset(local.envs)
  database_name = "forin-${each.value}"
  region        = "global"
  primary_region = "ap-northeast-1"
  tls           = true
}
```

- [ ] **Step 6: 시크릿 컨테이너**

Create `infra/terraform/secrets.tf`:

```hcl
# Containers only — values are pushed by `make -C infra secrets` (gcloud), never
# by Terraform, so no secret material lands in state.
#
# Social client IDs are deliberately absent: they are public identifiers that
# already ship inside the app binary.
locals {
  shared_secrets = [
    "jwt-signing-key",
    "anthropic-key",
    "openai-key",
    "azure-speech-key",
  ]
  per_env_secrets = flatten([
    for e in local.envs : ["db-password-${e}", "redis-url-${e}"]
  ])
  # Only staging gets the dev-login bypass secret. Production leaves it unset so
  # the route is never registered there.
  extra_secrets = ["dev-auth-secret-staging"]
}

resource "google_secret_manager_secret" "app" {
  for_each  = toset(concat(local.shared_secrets, local.per_env_secrets, local.extra_secrets))
  secret_id = "forin-${each.value}"

  replication {
    auto {}
  }

  depends_on = [google_project_service.required]
}

# The DB password and Redis URL are generated/known here, so Terraform can fill
# these two in. The LLM and Azure keys come from a human via `make secrets`.
resource "google_secret_manager_secret_version" "db_password" {
  for_each    = toset(local.envs)
  secret      = google_secret_manager_secret.app["db-password-${each.value}"].id
  secret_data = random_password.db[each.value].result
}

resource "google_secret_manager_secret_version" "redis_url" {
  for_each    = toset(local.envs)
  secret      = google_secret_manager_secret.app["redis-url-${each.value}"].id
  secret_data = "rediss://default:${upstash_redis_database.cache[each.value].password}@${upstash_redis_database.cache[each.value].endpoint}:${upstash_redis_database.cache[each.value].port}"
}
```

- [ ] **Step 7: 부트스트랩·시크릿 주입 Makefile**

Create `infra/Makefile`:

```makefile
.PHONY: bootstrap init plan apply secrets
PROJECT ?= forin-504711
REGION  ?= asia-northeast3
BUCKET  ?= $(PROJECT)-tfstate

bootstrap:  ## create the GCS state bucket (the one thing Terraform cannot create for itself)
	gcloud storage buckets describe gs://$(BUCKET) --project=$(PROJECT) >/dev/null 2>&1 || \
	  gcloud storage buckets create gs://$(BUCKET) --project=$(PROJECT) --location=$(REGION) --uniform-bucket-level-access
	gcloud storage buckets update gs://$(BUCKET) --versioning

init:
	cd terraform && terraform init

plan:
	cd terraform && terraform plan

apply:
	cd terraform && terraform apply

secrets:   ## push secret VALUES that Terraform must not hold. usage: make secrets ANTHROPIC_KEY=... OPENAI_KEY=... AZURE_SPEECH_KEY=...
	@test -n "$(ANTHROPIC_KEY)" || (echo "ANTHROPIC_KEY is required"; exit 1)
	@printf '%s' '$(ANTHROPIC_KEY)'    | gcloud secrets versions add forin-anthropic-key    --project=$(PROJECT) --data-file=-
	@printf '%s' '$(OPENAI_KEY)'       | gcloud secrets versions add forin-openai-key       --project=$(PROJECT) --data-file=-
	@printf '%s' '$(AZURE_SPEECH_KEY)' | gcloud secrets versions add forin-azure-speech-key --project=$(PROJECT) --data-file=-
	@openssl rand -hex 32 | gcloud secrets versions add forin-jwt-signing-key        --project=$(PROJECT) --data-file=-
	@openssl rand -hex 32 | gcloud secrets versions add forin-dev-auth-secret-staging --project=$(PROJECT) --data-file=-
	@echo "pushed. JWT signing key and staging dev-auth secret were generated here — they are never printed."
```

- [ ] **Step 8: README 작성**

Create `infra/README.md`:

```markdown
# infra — forin 서버 인프라 (Terraform)

Cloud Run + Cloud SQL(서울) + Upstash Redis. 설계 근거는
`docs/dlc/projects/forin/03-operations/01-deployment.md`.

## 최초 1회 (사람이 해야 하는 것)

IaC로 자동화할 수 없는 경계다. 나머지는 전부 Terraform이 만든다.

1. **Upstash 계정 가입 + API 키 발급** (https://console.upstash.com) →
   `terraform/terraform.tfvars`에 `upstash_email`·`upstash_api_key`
2. **로컬 자격 1회**: `gcloud auth application-default login`
3. **LLM·Azure 키 확보** (Anthropic / OpenAI / Azure Speech 콘솔)

## 순서

```bash
make bootstrap                 # GCS 상태 버킷 (Terraform이 자기 백엔드를 만들 수는 없다)
make init
make plan                      # 검토
make apply
make secrets ANTHROPIC_KEY=... OPENAI_KEY=... AZURE_SPEECH_KEY=...
```

`make secrets`는 JWT 서명 키와 staging dev-auth 시크릿을 **여기서 생성**하고 출력하지 않는다.

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
```

- [ ] **Step 9: 포맷·검증**

Run:
```bash
cd infra/terraform
terraform fmt -recursive
terraform init -backend=false    # 백엔드 없이 프로바이더/문법만 검증
terraform validate
```
Expected: `Success! The configuration is valid.`
(`terraform` CLI가 없으면 `brew install terraform` 또는 tfenv로 설치)

- [ ] **Step 10: 커밋 (apply는 아직)**

```bash
cd /Users/ywyeom/private/forin
git add .gitignore infra
git commit -m "$(cat <<'EOF'
feat(infra): Terraform 데이터 계층 — Cloud SQL·Upstash·시크릿 컨테이너

콘솔 클릭 없이 환경을 세우기 위한 첫 절반. 단일 루트 모듈이 staging·prod를 함께
선언한다 — 공유 Cloud SQL 인스턴스가 실제로 하나이므로 상태를 환경별로 쪼개면
그 공유물의 소유자가 애매해진다.

- 인스턴스 1개 + DB 2개 + 사용자 2명. split_sql_instances tfvar 하나로 분리 전환
- 공인 IP 없음(Cloud SQL 커넥터 유닉스 소켓) · PITR 켬 · 삭제 보호 켬
- 시크릿은 컨테이너만 선언하고 값은 make secrets(gcloud)로 주입 — state에
  시크릿 원문이 남지 않게. DB 비밀번호·Redis URL은 여기서 알기에 예외
- Redis는 Upstash 도쿄. RefreshStore가 refresh 토큰을 들고 있어 캐시가 아니다
- 상태 버킷은 make bootstrap이 만든다(백엔드는 자기 버킷을 만들 수 없다)

검증: terraform fmt · validate 통과. apply는 다음 태스크에서 런타임 계층과 함께
EOF
)"
git push origin master
```

---

### Task 6: Terraform — 런타임 계층 + 무키 CI 자격 (apply 포함)

**Files:**
- Create: `infra/terraform/runtime.tf` (서비스 계정·IAM·Cloud Run 서비스·Job)
- Create: `infra/terraform/wif.tf` (Workload Identity Federation)
- Create: `infra/terraform/outputs.tf`

**Interfaces:**
- Consumes: Task 5의 `google_sql_database_instance.pg`, `google_sql_user.app`, `google_secret_manager_secret.app`, `google_artifact_registry_repository.forin`, `local.envs`
- Produces (Task 7이 참조):
  - Cloud Run 서비스 `forin-api-staging` · `forin-api-prod`
  - Cloud Run Job `forin-migrate-staging|prod` · `forin-seed-staging|prod`
  - 배포 서비스 계정 `forin-deployer@forin-504711.iam.gserviceaccount.com`
  - Terraform 출력: `wif_provider`, `deployer_sa`, `service_urls`, `image_repo`

- [ ] **Step 1: 런타임 계층 작성**

Create `infra/terraform/runtime.tf`:

```hcl
# Runtime identity is per-environment so staging can never read production's
# secrets, and a leaked staging identity cannot reach the production database.
resource "google_service_account" "runtime" {
  for_each     = toset(local.envs)
  account_id   = "forin-api-${each.value}"
  display_name = "forin ${each.value} runtime"
}

resource "google_project_iam_member" "runtime_sql" {
  for_each = toset(local.envs)
  project  = var.project_id
  role     = "roles/cloudsql.client"
  member   = "serviceAccount:${google_service_account.runtime[each.value].email}"
}

# Secret access is granted per secret, not project-wide: staging is bound only
# to the secrets whose names end in -staging plus the shared keys.
locals {
  secret_bindings = merge(
    { for pair in setproduct(local.envs, local.shared_secrets) :
      "${pair[0]}-${pair[1]}" => { env = pair[0], secret = pair[1] } },
    { for e in local.envs : "${e}-db" => { env = e, secret = "db-password-${e}" } },
    { for e in local.envs : "${e}-redis" => { env = e, secret = "redis-url-${e}" } },
    { "staging-devauth" = { env = "staging", secret = "dev-auth-secret-staging" } },
  )
}

resource "google_secret_manager_secret_iam_member" "runtime" {
  for_each  = local.secret_bindings
  secret_id = google_secret_manager_secret.app[each.value.secret].id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.runtime[each.value.env].email}"
}

locals {
  image = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.forin.repository_id}/api"

  # A unix socket, so the database needs no public IP.
  db_url = { for e in local.envs :
    e => "postgres://forin_${e}:${random_password.db[e].result}@/forin_${e}?host=/cloudsql/${google_sql_database_instance.pg[local.sql_owner[e]].connection_name}"
  }

  # Production leaves min_instances at 1 so the day's first learner does not pay
  # for a cold start; staging scales to zero because only the smoke test calls it.
  min_instances = { staging = 0, prod = 1 }
}

resource "google_cloud_run_v2_service" "api" {
  for_each = toset(local.envs)
  name     = "forin-api-${each.value}"
  location = var.region

  # Deployments are driven by the CI pipeline; Terraform owns the shape of the
  # service, not which image revision is live.
  lifecycle {
    ignore_changes = [template[0].containers[0].image, client, client_version]
  }

  template {
    service_account = google_service_account.runtime[each.value].email
    scaling {
      min_instance_count = local.min_instances[each.value]
      max_instance_count = 4
    }

    volumes {
      name = "cloudsql"
      cloud_sql_instance {
        instances = [google_sql_database_instance.pg[local.sql_owner[each.value]].connection_name]
      }
    }

    containers {
      image = "${local.image}:bootstrap"
      ports { container_port = 8080 }

      volume_mounts {
        name       = "cloudsql"
        mount_path = "/cloudsql"
      }

      # ENV=prod is what keeps POST /auth/dev unregistered in production.
      env {
        name  = "ENV"
        value = each.value
      }
      env {
        name  = "DATABASE_URL"
        value = local.db_url[each.value]
      }
      dynamic "env" {
        for_each = {
          REDIS_URL          = "redis-url-${each.value}"
          JWT_SIGNING_KEY    = "jwt-signing-key"
          ANTHROPIC_API_KEY  = "anthropic-key"
          OPENAI_API_KEY     = "openai-key"
          AZURE_SPEECH_KEY   = "azure-speech-key"
        }
        content {
          name = env.key
          value_source {
            secret_key_ref {
              secret  = google_secret_manager_secret.app[env.value].secret_id
              version = "latest"
            }
          }
        }
      }
      # Only staging carries the smoke-test bypass secret.
      dynamic "env" {
        for_each = each.value == "staging" ? [1] : []
        content {
          name = "DEV_AUTH_SECRET"
          value_source {
            secret_key_ref {
              secret  = google_secret_manager_secret.app["dev-auth-secret-staging"].secret_id
              version = "latest"
            }
          }
        }
      }

      startup_probe {
        http_get { path = "/readyz" }
        initial_delay_seconds = 5
        period_seconds        = 5
        failure_threshold     = 12
      }
      liveness_probe {
        http_get { path = "/healthz" }
        period_seconds = 30
      }
    }
  }

  depends_on = [google_secret_manager_secret_version.redis_url]
}

# Public: the mobile app calls these directly and does its own auth.
resource "google_cloud_run_v2_service_iam_member" "public" {
  for_each = toset(local.envs)
  name     = google_cloud_run_v2_service.api[each.value].name
  location = var.region
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# Jobs run /migrate and /seed from the same image digest as the service.
locals {
  jobs = merge(
    { for e in local.envs : "migrate-${e}" => { env = e, cmd = "/migrate", args = ["up"] } },
    { for e in local.envs : "seed-${e}" => { env = e, cmd = "/seed", args = [] } },
  )
}

resource "google_cloud_run_v2_job" "ops" {
  for_each = local.jobs
  name     = "forin-${each.key}"
  location = var.region

  lifecycle {
    ignore_changes = [template[0].template[0].containers[0].image, client, client_version]
  }

  template {
    template {
      service_account = google_service_account.runtime[each.value.env].email
      max_retries     = 0 # a failed migration must stop, not retry onto a dirty schema

      volumes {
        name = "cloudsql"
        cloud_sql_instance {
          instances = [google_sql_database_instance.pg[local.sql_owner[each.value.env]].connection_name]
        }
      }

      containers {
        image   = "${local.image}:bootstrap"
        command = [each.value.cmd]
        args    = each.value.args

        volume_mounts {
          name       = "cloudsql"
          mount_path = "/cloudsql"
        }

        env {
          name  = "ENV"
          value = each.value.env
        }
        env {
          name  = "DATABASE_URL"
          value = local.db_url[each.value.env]
        }
      }
    }
  }
}
```

- [ ] **Step 2: WIF 작성**

Create `infra/terraform/wif.tf`:

```hcl
# CI deploys without a key. A service-account JSON key would have no expiry and
# no way to know when it leaked; a federated token is minted per workflow run and
# is only issuable by this one repository.
resource "google_iam_workload_identity_pool" "github" {
  workload_identity_pool_id = "github"
  display_name              = "GitHub Actions"

  depends_on = [google_project_service.required]
}

resource "google_iam_workload_identity_pool_provider" "github" {
  workload_identity_pool_id          = google_iam_workload_identity_pool.github.workload_identity_pool_id
  workload_identity_pool_provider_id = "github-oidc"

  attribute_mapping = {
    "google.subject"       = "assertion.sub"
    "attribute.repository" = "assertion.repository"
  }
  # Without this condition ANY GitHub repository could mint tokens for this pool.
  attribute_condition = "assertion.repository == \"${var.github_repo}\""

  oidc {
    issuer_uri = "https://token.actions.githubusercontent.com"
  }
}

resource "google_service_account" "deployer" {
  account_id   = "forin-deployer"
  display_name = "forin CI deployer"
}

resource "google_service_account_iam_member" "deployer_wif" {
  service_account_id = google_service_account.deployer.name
  role               = "roles/iam.workloadIdentityUser"
  member             = "principalSet://iam.googleapis.com/${google_iam_workload_identity_pool.github.name}/attribute.repository/${var.github_repo}"
}

resource "google_project_iam_member" "deployer" {
  for_each = toset([
    "roles/run.developer",             # deploy revisions, execute jobs
    "roles/artifactregistry.writer",   # push images
    "roles/iam.serviceAccountUser",    # act as the runtime service accounts
    "roles/secretmanager.secretAccessor", # read the staging smoke secret
  ])
  project = var.project_id
  role    = each.value
  member  = "serviceAccount:${google_service_account.deployer.email}"
}
```

- [ ] **Step 3: 출력 작성**

Create `infra/terraform/outputs.tf`:

```hcl
output "image_repo" {
  description = "Artifact Registry image path (tag with the commit sha)"
  value       = local.image
}

output "wif_provider" {
  description = "google-github-actions/auth workload_identity_provider value"
  value       = google_iam_workload_identity_pool_provider.github.name
}

output "deployer_sa" {
  description = "google-github-actions/auth service_account value"
  value       = google_service_account.deployer.email
}

output "service_urls" {
  description = "Cloud Run URLs per environment"
  value       = { for e in local.envs : e => google_cloud_run_v2_service.api[e].uri }
}

output "sql_connection_names" {
  value = { for e in local.envs : e => google_sql_database_instance.pg[local.sql_owner[e]].connection_name }
}
```

- [ ] **Step 4: 포맷·검증**

Run:
```bash
cd infra/terraform && terraform fmt -recursive && terraform init -backend=false && terraform validate
```
Expected: `Success! The configuration is valid.`

- [ ] **Step 5: 사람이 해야 하는 선행 작업 (자동화 불가 경계)**

이 단계는 사람이 직접 한다:

1. Upstash 가입 + API 키 발급 → `infra/terraform/terraform.tfvars` 작성 (`terraform.tfvars.example` 복사)
2. `gcloud auth application-default login`
3. `gcloud config set project forin-504711`

- [ ] **Step 6: 부트스트랩 + apply**

Run:
```bash
cd infra
make bootstrap
make init
make plan     # 검토: 삭제(destroy)가 0건이어야 한다
make apply
```
Expected: apply 성공. `terraform output`에 `wif_provider`·`deployer_sa`·`service_urls`가 표시된다.
Cloud Run 서비스는 존재하지만 아직 `:bootstrap` 태그를 가리켜 **리비전이 뜨지 않는다** — 정상이다(첫 실제 이미지는 Task 7이 올린다).

- [ ] **Step 7: 시크릿 값 주입**

Run:
```bash
cd infra
make secrets ANTHROPIC_KEY='...' OPENAI_KEY='...' AZURE_SPEECH_KEY='...'
gcloud secrets versions list forin-jwt-signing-key --project=forin-504711
```
Expected: 각 시크릿에 버전 1이 생긴다.

- [ ] **Step 8: 커밋**

```bash
cd /Users/ywyeom/private/forin
git add infra
git commit -m "$(cat <<'EOF'
feat(infra): Cloud Run 런타임 + 무키 CI 자격(WIF)

- 런타임 서비스 계정을 환경별로 분리하고 시크릿 접근을 시크릿 단위로 바인딩 —
  staging이 prod 시크릿을 읽을 경로가 없다
- ENV를 환경 이름으로 고정. prod에 DEV_AUTH_SECRET을 주지 않으므로 /auth/dev는
  등록되지 않는다
- Job의 max_retries=0: 실패한 마이그레이션은 재시도가 아니라 정지여야 한다
  (dirty 스키마 위에 다음 걸 얹지 않게)
- 이미지 태그는 lifecycle ignore_changes — 리비전은 CI가 소유하고 Terraform은
  서비스의 형태만 소유한다
- WIF attribute_condition으로 이 리포만 토큰을 발급받게 제한. 서비스 계정 키는
  만들지 않는다(유출 시점을 알 수 없고 만료도 없다)
- prod min_instances=1 / staging 0

검증: terraform validate · apply 성공 · output에 wif_provider·deployer_sa·URL
EOF
)"
git push origin master
```

---

### Task 7: `deploy.yml` — staging 자동 → 스모크 → prod 수동 승격

**Files:**
- Create: `.github/workflows/deploy.yml`
- Modify: `docs/dlc/projects/forin/03-operations/01-deployment.md` (체크리스트 체크)

**Interfaces:**
- Consumes: Task 6의 `wif_provider`·`deployer_sa`·`image_repo`·`service_urls`, Task 2의 이미지, Task 4의 `DEV_AUTH_SECRET`
- Produces: `master` push마다 staging 배포 + 스모크, `production` GitHub Environment 승인 후 prod 배포

- [ ] **Step 1: GitHub 리포 설정 (사람)**

1. Settings → Environments → **`production`** 생성 → *Required reviewers*에 본인 추가
2. Settings → Secrets and variables → Actions → **Variables** 에 추가:
   - `GCP_PROJECT_ID` = `forin-504711`
   - `GCP_WIF_PROVIDER` = `terraform output -raw wif_provider` 값
   - `GCP_DEPLOYER_SA` = `terraform output -raw deployer_sa` 값

시크릿이 아니라 **Variables**에 두는 이유: 프로젝트 ID와 WIF provider 경로는 비밀이 아니고, 비밀이 아닌 것을 시크릿에 두면 로그가 불필요하게 마스킹된다.

- [ ] **Step 2: 워크플로 작성**

Create `.github/workflows/deploy.yml`:

```yaml
name: deploy

# Deploys happen from master only. staging is automatic; production waits for a
# human because a schema change rides along with it.
on:
  push:
    branches: [master]
    paths:
      - 'server/**'
      - '.github/workflows/deploy.yml'
  workflow_dispatch:

concurrency:
  group: deploy
  cancel-in-progress: false

env:
  PROJECT_ID: ${{ vars.GCP_PROJECT_ID }}
  REGION: asia-northeast3

jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      id-token: write   # required to mint the WIF token
    outputs:
      image: ${{ steps.meta.outputs.image }}
    steps:
      - uses: actions/checkout@v4

      - uses: google-github-actions/auth@v2
        with:
          workload_identity_provider: ${{ vars.GCP_WIF_PROVIDER }}
          service_account: ${{ vars.GCP_DEPLOYER_SA }}

      - uses: google-github-actions/setup-gcloud@v2

      - name: Configure docker for Artifact Registry
        run: gcloud auth configure-docker ${{ env.REGION }}-docker.pkg.dev --quiet

      - id: meta
        run: echo "image=${{ env.REGION }}-docker.pkg.dev/${{ env.PROJECT_ID }}/forin/api:${{ github.sha }}" >> "$GITHUB_OUTPUT"

      - name: Build and push
        working-directory: server
        run: |
          docker build -t "${{ steps.meta.outputs.image }}" .
          docker push "${{ steps.meta.outputs.image }}"

  staging:
    needs: build
    runs-on: ubuntu-latest
    permissions:
      contents: read
      id-token: write
    steps:
      - uses: actions/checkout@v4

      - uses: google-github-actions/auth@v2
        with:
          workload_identity_provider: ${{ vars.GCP_WIF_PROVIDER }}
          service_account: ${{ vars.GCP_DEPLOYER_SA }}

      - uses: google-github-actions/setup-gcloud@v2

      # Migrations first: the new code may need the new schema. Which migrations
      # to apply is decided by the schema_migrations table in the database, not
      # by this workflow.
      - name: Migrate staging
        run: |
          gcloud run jobs update forin-migrate-staging \
            --region="$REGION" --image="${{ needs.build.outputs.image }}" --quiet
          gcloud run jobs execute forin-migrate-staging --region="$REGION" --wait

      - name: Deploy staging
        run: |
          gcloud run deploy forin-api-staging \
            --region="$REGION" --image="${{ needs.build.outputs.image }}" --quiet

      # The script ends with `[ "$FAIL" -eq 0 ] || exit 1`, so its exit code is
      # the gate — no output parsing needed. A non-zero exit fails this job and
      # the production job never starts.
      - name: Smoke test staging
        run: |
          URL=$(gcloud run services describe forin-api-staging --region="$REGION" --format='value(status.url)')
          DEV_AUTH_SECRET=$(gcloud secrets versions access latest --secret=forin-dev-auth-secret-staging)
          export DEV_AUTH_SECRET
          chmod +x server/scripts/e2e_smoke.sh
          server/scripts/e2e_smoke.sh "$URL"

  production:
    needs: [build, staging]
    runs-on: ubuntu-latest
    environment: production   # required reviewer gate lives here
    permissions:
      contents: read
      id-token: write
    steps:
      - uses: actions/checkout@v4

      - uses: google-github-actions/auth@v2
        with:
          workload_identity_provider: ${{ vars.GCP_WIF_PROVIDER }}
          service_account: ${{ vars.GCP_DEPLOYER_SA }}

      - uses: google-github-actions/setup-gcloud@v2

      - name: Migrate production
        run: |
          gcloud run jobs update forin-migrate-prod \
            --region="$REGION" --image="${{ needs.build.outputs.image }}" --quiet
          gcloud run jobs execute forin-migrate-prod --region="$REGION" --wait

      # Land the revision without traffic first, then shift. This is what makes
      # rollback a traffic change rather than a rebuild.
      - name: Deploy production without traffic
        id: rev
        run: |
          gcloud run deploy forin-api-prod \
            --region="$REGION" --image="${{ needs.build.outputs.image }}" --no-traffic --quiet
          REV=$(gcloud run services describe forin-api-prod --region="$REGION" \
                --format='value(status.latestCreatedRevisionName)')
          echo "revision=$REV" >> "$GITHUB_OUTPUT"

      - name: Verify the new revision is ready
        run: |
          gcloud run revisions describe "${{ steps.rev.outputs.revision }}" \
            --region="$REGION" --format='value(status.conditions[0].status)' | grep -q True

      - name: Shift traffic
        run: |
          gcloud run services update-traffic forin-api-prod \
            --region="$REGION" --to-revisions="${{ steps.rev.outputs.revision }}=100" --quiet

      - name: Confirm production health and that the dev bypass is absent
        run: |
          URL=$(gcloud run services describe forin-api-prod --region="$REGION" --format='value(status.url)')
          curl -fsS "$URL/readyz" >/dev/null
          CODE=$(curl -s -o /dev/null -w '%{http_code}' -X POST "$URL/auth/dev")
          test "$CODE" = "404" || { echo "/auth/dev answered $CODE, expected 404"; exit 1; }
          echo "rollback if needed: gcloud run services update-traffic forin-api-prod --region=$REGION --to-revisions=<PREV>=100"
```

- [ ] **Step 3: 워크플로 문법 확인**

Run: `cd /Users/ywyeom/private/forin && python3 -c "import yaml,sys; yaml.safe_load(open('.github/workflows/deploy.yml')); print('yaml ok')"`
Expected: `yaml ok`

- [ ] **Step 4: 실제 배포로 검증**

커밋·푸시하면 워크플로가 돈다. Actions 탭에서 확인한다.

Expected:
1. `build` 통과 — 이미지가 Artifact Registry에 올라간다
2. `staging` 통과 — migrate Job 로그에 `migrate: before version=none (fresh database)` → `after version=20 dirty=false`, 이어서 **스모크 57/0**
3. `production`이 **승인 대기** 상태로 멈춘다 → 승인 → migrate → `--no-traffic` 배포 → 트래픽 전환 → `/readyz` 200 · `/auth/dev` **404**

실패 시: 마이그레이션 Job 로그의 `version=`·`dirty=` 값을 먼저 본다. dirty가 true면 `infra/README.md`의 복구 절차(부분 적용분 수동 되돌림 → `force <이전버전>`)를 따른다.

- [ ] **Step 5: 스테이지 문서 체크리스트 갱신 + 커밋**

`docs/dlc/projects/forin/03-operations/01-deployment.md`의 체크리스트에서 9-A에 해당하는 항목을 체크한다:

```markdown
- [x] 모노레포 경로 필터 CI (mobile/server 독립 배포)  ← server 측 완료, mobile은 9-B
- [x] 서버 배포 (호스팅 타깃·컨테이너·환경 변수·DB 마이그레이션)
- [ ] 모바일 배포 (EAS Build/Submit, 환경 분리, OTA 업데이트 정책)
- [x] 계약 코드젠 검증을 릴리스 게이트에 포함
- [x] IaC — GCP 리소스 전부를 Terraform으로 (콘솔 수동 작업 배제)
```

서브모듈 먼저:
```bash
cd /Users/ywyeom/private/forin/docs/dlc
git add -A && git commit -m "docs(3-1): 9-A 서버 배포 완료 — 체크리스트 갱신" && git push origin master
```

그다음 메인:
```bash
cd /Users/ywyeom/private/forin
git add .github/workflows/deploy.yml docs/dlc
git commit -m "$(cat <<'EOF'
feat(deploy): staging 자동 → 스모크 → prod 수동 승격 파이프라인

- WIF로 인증(서비스 계정 키 없음) · 이미지는 커밋 sha로 태그
- 마이그레이션 Job을 먼저 돌린다. 무엇을 적용할지는 DB의 schema_migrations가
  판단하므로 워크플로가 버전을 알 필요가 없다
- staging 스모크가 통과하지 않으면 승격 자체가 없다
- prod는 --no-traffic으로 리비전을 먼저 착지시키고 준비 확인 후 트래픽 전환 —
  롤백이 재빌드가 아니라 트래픽 변경이 되는 이유
- 배포 끝에 /auth/dev가 404임을 검사한다. ENV가 새면 인증 우회가 열리므로
  이건 매 배포 확인할 불변식이다

검증: 실제 배포로 staging 스모크 57/0 · prod 승인 게이트 정지 확인 · 트래픽
전환 후 /readyz 200 · /auth/dev 404
EOF
)"
git push origin master
```

---

### Task 8: `seed.yml` — 콘텐츠 시드는 수동 트리거

**Files:**
- Create: `.github/workflows/seed.yml`

**Interfaces:**
- Consumes: Task 6의 Cloud Run Job `forin-seed-staging|prod`, Task 3의 가드
- Produces: `workflow_dispatch`로 환경을 골라 실행하는 콘텐츠 시드

> 코드 배포마다 6.8MB 콘텐츠를 전량 교체할 이유가 없고, 시드는 **교체**라 위험도가 배포와 다르다. 그래서 별도 워크플로 + 수동 트리거로 분리한다.

- [ ] **Step 1: 워크플로 작성**

Create `.github/workflows/seed.yml`:

```yaml
name: seed

# Content seeding replaces the whole catalog in one transaction, so it is not
# part of every deploy. Run it when content changes.
on:
  workflow_dispatch:
    inputs:
      environment:
        description: Which environment to seed
        type: choice
        options: [staging, prod]
        required: true
      allow_removal:
        description: "Allow removing referenced content ids (intentional retirement)"
        type: boolean
        default: false

env:
  PROJECT_ID: ${{ vars.GCP_PROJECT_ID }}
  REGION: asia-northeast3

jobs:
  seed:
    runs-on: ubuntu-latest
    # Seeding production goes through the same reviewer gate as deploying it.
    environment: ${{ inputs.environment == 'prod' && 'production' || '' }}
    permissions:
      contents: read
      id-token: write
    steps:
      - uses: actions/checkout@v4

      - uses: google-github-actions/auth@v2
        with:
          workload_identity_provider: ${{ vars.GCP_WIF_PROVIDER }}
          service_account: ${{ vars.GCP_DEPLOYER_SA }}

      - uses: google-github-actions/setup-gcloud@v2

      # Seed from the image the target service is actually running, so the
      # content bundle matches the code that will read it.
      - name: Seed from the live image
        run: |
          IMAGE=$(gcloud run services describe forin-api-${{ inputs.environment }} \
                  --region="$REGION" --format='value(spec.template.spec.containers[0].image)')
          echo "seeding ${{ inputs.environment }} from $IMAGE"
          ARGS=()
          if [ "${{ inputs.allow_removal }}" = "true" ]; then
            ARGS+=(--update-env-vars=SEED_ALLOW_REMOVAL=1)
          else
            ARGS+=(--remove-env-vars=SEED_ALLOW_REMOVAL)
          fi
          gcloud run jobs update forin-seed-${{ inputs.environment }} \
            --region="$REGION" --image="$IMAGE" "${ARGS[@]}" --quiet
          gcloud run jobs execute forin-seed-${{ inputs.environment }} --region="$REGION" --wait
```

- [ ] **Step 2: 문법 확인**

Run: `cd /Users/ywyeom/private/forin && python3 -c "import yaml; yaml.safe_load(open('.github/workflows/seed.yml')); print('yaml ok')"`
Expected: `yaml ok`

- [ ] **Step 3: 커밋·푸시**

```bash
cd /Users/ywyeom/private/forin
git add .github/workflows/seed.yml
git commit -m "$(cat <<'EOF'
feat(deploy): 콘텐츠 시드 워크플로 (수동 트리거)

시드는 교체(단일 트랜잭션 DELETE→INSERT)라 배포와 위험도가 다르고, 코드 배포마다
6.8MB를 전량 교체할 이유가 없다.

- workflow_dispatch로 환경 선택. prod는 배포와 같은 승인 게이트를 지난다
- 대상 서비스가 실제 돌리고 있는 이미지로 시드해 콘텐츠와 읽는 코드를 맞춘다
- SEED_ALLOW_REMOVAL은 입력으로만 켜지고, 켜지 않으면 명시적으로 제거한다
  (이전 실행의 값이 남아 있지 않게)
EOF
)"
git push origin master
```

- [ ] **Step 4: staging에 실제 시드 실행**

GitHub Actions → `seed` → Run workflow → environment=`staging`, allow_removal=off

Expected: Job 로그에 `seeded content <version>: N departments, … M scenarios, …`. 가드가 막으면 누락 ID 목록이 찍히며 실패한다 — 그 경우 **가드가 옳고 콘텐츠가 문제**이므로 콘텐츠를 먼저 고친다.

- [ ] **Step 5: staging 스모크 재확인**

Run:
```bash
URL=$(gcloud run services describe forin-api-staging --region=asia-northeast3 --format='value(status.url)')
DEV_AUTH_SECRET=$(gcloud secrets versions access latest --secret=forin-dev-auth-secret-staging) \
  server/scripts/e2e_smoke.sh "$URL"
```
Expected: **57/0** — 콘텐츠가 실린 뒤에도 전 여정이 통과한다. 이것이 9-A의 완료 판정이다.

---

## 완료 판정 (9-A)

- [ ] `go vet ./... && go test ./...` 그린 (신규 테스트: 임베드 1 · 커리큘럼 참조 1 · 시드 가드 3 · devauth 1(7케이스) · config 2)
- [ ] `docker build` 성공, 이미지에 `/api`·`/migrate`·`/seed`·`/content` 존재
- [ ] `terraform validate` + `apply` 성공, `terraform output`에 URL·WIF·SA
- [ ] master push → staging 자동 배포 → **스모크 57/0**
- [ ] prod가 승인 게이트에서 멈추고, 승인 후 트래픽 전환 · `/readyz` 200 · **`/auth/dev` 404**
- [ ] `seed` 워크플로로 staging 시드 성공, 이후 스모크 재통과

## 9-A가 다루지 않는 것

- 모바일(`mobile.yml`·EAS 환경 분리·OTA) → **9-B**
- 커스텀 도메인, 모니터링·알림·비용 계측 → **3-2**
- Android 비공개 테스트 12명/14일 → 9-B 직후 착수 (임계 경로)
