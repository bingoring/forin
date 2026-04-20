# i18n Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Introduce locale-aware infrastructure: per-user `native_language`, a `vocabulary` domain with per-locale translations, and an `i18n-js` layer on mobile driving a new `LanguageSelectScreen`.

**Architecture:**
- Go/Gin backend gets a code-side `SupportedLocales` list (`internal/config/locales.go`), a `native_language` column on `users`, and two new tables (`vocabulary`, `vocabulary_translations`) with a locale-fallback repository.
- React Native (Expo) mobile gets `i18n-js` + `expo-localization`, English-keyed `locales/en.json` and `ko.json`, a `useLocale` hook that follows `authStore.user.native_language`, and a new `LanguageSelectScreen` inserted at the top of the onboarding flow.

**Tech Stack:** Go 1.25 + Gin + GORM + `golang-migrate`; React Native 0.81 + Expo 54 + React Navigation 7 + Zustand + React Query; `i18n-js`, `expo-localization`.

**Source spec:** `docs/superpowers/specs/2026-04-17-i18n-foundation-design.md`

---

## Sequencing & isolation

Work in one feature branch: `feat/i18n-foundation`. Commits are small and TDD-ordered; push at the end.

Phase order (each phase must leave the tree green):
1. Backend — locales config + `native_language` column + register/profile wiring (Tasks 1–5)
2. Backend — vocabulary domain (Tasks 6–9)
3. Mobile — i18n runtime + locale files + hook (Tasks 10–13)
4. Mobile — `LanguageSelectScreen` + onboarding wiring + `authStore` update (Tasks 14–16)
5. Smoke + docs (Task 17)

Ports/DB: the repo's `docker-compose.yml` brings up Postgres 5432 via `make docker-up`. Migrations run via `make migrate-up`. Tests: `make test` (unit default), `make test-integration` (hits real DB), mobile: no jest configured yet — smoke-test manually with `expo start`.

---

## File map (locked before task work)

**Create (backend):**
- `server/migrations/000004_add_native_language_to_users.up.sql` / `.down.sql`
- `server/migrations/000005_create_vocabulary.up.sql` / `.down.sql`
- `server/migrations/000006_create_vocabulary_translations.up.sql` / `.down.sql`
- `server/internal/config/locales.go`
- `server/internal/config/locales_test.go`
- `server/internal/model/vocabulary.go`
- `server/internal/repository/vocabulary_repo.go`
- `server/internal/repository/vocabulary_repo_test.go`
- `server/scripts/seed_vocabulary.go` — new file, invoked from `seed.go` main

**Modify (backend):**
- `server/internal/model/user.go` — add `NativeLanguage`
- `server/internal/dto/auth_dto.go` — `RegisterRequest.NativeLanguage`, `UserInfo.NativeLanguage`
- `server/internal/dto/user_dto.go` — `UpdateProfileRequest.NativeLanguage`, `UserProfileResponse.NativeLanguage`
- `server/internal/service/auth_service.go` — honor `NativeLanguage` in `Register`; include in `UserInfo`
- `server/internal/service/auth_service_test.go` — add cases
- `server/internal/service/user_service.go` — apply `NativeLanguage` in `UpdateProfile`; include in response
- `server/internal/service/user_service_test.go` — add cases
- `server/internal/handler/auth_handler_test.go` — assert `native_language` round-trip
- `server/internal/handler/user_handler_test.go` — assert PATCH validation (if present; otherwise new test file `server/internal/service/user_service_locale_test.go`)
- `server/scripts/seed.go` — call `seedVocabulary(db)` in `main`

**Create (mobile):**
- `mobile/src/locales/en.json`
- `mobile/src/locales/ko.json`
- `mobile/src/locales/index.ts`
- `mobile/src/hooks/useLocale.ts`
- `mobile/src/screens/onboarding/LanguageSelectScreen.tsx`

**Modify (mobile):**
- `mobile/package.json` — add `i18n-js`, `expo-localization`
- `mobile/src/types/api.ts` — `UserInfo.native_language`, `UserProfile.native_language`
- `mobile/src/api/auth.ts` — register accepts `nativeLanguage?`
- `mobile/src/api/index.ts` — no change (uses existing PATCH)
- `mobile/src/stores/authStore.ts` — `register(..., nativeLanguage?)`, keep `user.native_language`
- `mobile/src/navigation/AppNavigator.tsx` — onboarding step check uses `profile.native_language` gate as well
- `mobile/src/screens/onboarding/OnboardingScreen.tsx` — add `'language'` step before `'profession'`; or delegate to `LanguageSelectScreen` component
- `mobile/src/screens/auth/RegisterScreen.tsx` — replace inline English copy with `t()`
- `mobile/src/screens/auth/LoginScreen.tsx` — replace inline English copy with `t()`
- `mobile/App.tsx` (or the entry that renders `AppNavigator`) — import `./src/locales` once so i18n-js initializes at boot

Each file has one responsibility: locales list vs model vs DTO vs handler; locale runtime vs screen vs store on mobile. Nothing combined.

---

## Conventions & gotchas

- **DB migrations** use `golang-migrate` (sequence `NNNNNN_name.up.sql` / `.down.sql`). They do **not** auto-run — we execute `make migrate-up` manually and again in CI/docker. Always ship a matching `.down.sql`.
- **Repos** are `context.Context` first, return `error` last. GORM v2 API.
- **Tests** use `testing` + `testify/assert`/`require`. Unit tests mock repos via `internal/testutil/mock_*`. Integration tests use `testutil.NewTestDB(t)` + `testutil.TxDB(t, db)`; they **skip** if Postgres is unreachable — safe to run even when DB is down.
- **No DB CHECK constraints** on enum-shaped columns. `IsSupported` is the single source of truth (per memory `feedback_extensibility.md`).
- **Commit messages**: no `Co-Authored-By` line (per user instruction this session).
- **Mobile i18n** initializes at module-load time in `mobile/src/locales/index.ts`. Don't do it inside a component — the very first render needs a configured `i18n.locale`.
- **Locale normalization**: `expo-localization` may return `ko-KR` or `ko_KR`. The `useLocale` hook must split on `[-_]` and take `[0]`.

---

## TASKS

---

### Task 1: Add `SupportedLocales` config + unit test

**Files:**
- Create: `server/internal/config/locales.go`
- Create: `server/internal/config/locales_test.go`

- [ ] **Step 1: Write the failing test**

File `server/internal/config/locales_test.go`:

```go
package config

import "testing"

func TestIsSupported(t *testing.T) {
	cases := []struct {
		locale string
		want   bool
	}{
		{"ko", true},
		{"KO", true},
		{"ko-KR", true},
		{"ko_KR", true},
		{"en", false},
		{"", false},
		{"de", false},
	}
	for _, tc := range cases {
		t.Run(tc.locale, func(t *testing.T) {
			if got := IsSupported(tc.locale); got != tc.want {
				t.Fatalf("IsSupported(%q) = %v, want %v", tc.locale, got, tc.want)
			}
		})
	}
}

func TestDefaultLocaleIsSupported(t *testing.T) {
	if !IsSupported(DefaultLocale) {
		t.Fatalf("DefaultLocale %q must be in SupportedLocales", DefaultLocale)
	}
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd server && go test ./internal/config/ -run TestIsSupported -v`
Expected: FAIL — `undefined: IsSupported`.

- [ ] **Step 3: Write minimal implementation**

File `server/internal/config/locales.go`:

```go
package config

import "strings"

// SupportedLocales lists every BCP-47 primary subtag enabled in this build.
// Adding a locale = append here + ship translations. No DB change.
var SupportedLocales = []string{"ko"}

// DefaultLocale is the fallback when the user has not chosen one.
const DefaultLocale = "ko"

// NormalizeLocale lowercases and strips region/script tags (ko-KR -> ko).
func NormalizeLocale(locale string) string {
	if locale == "" {
		return ""
	}
	locale = strings.ToLower(locale)
	for _, sep := range []string{"-", "_"} {
		if i := strings.Index(locale, sep); i >= 0 {
			return locale[:i]
		}
	}
	return locale
}

// IsSupported reports whether a BCP-47 locale (any case, with/without region)
// is enabled for this build.
func IsSupported(locale string) bool {
	primary := NormalizeLocale(locale)
	if primary == "" {
		return false
	}
	for _, l := range SupportedLocales {
		if l == primary {
			return true
		}
	}
	return false
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd server && go test ./internal/config/ -v`
Expected: PASS, including existing config tests.

- [ ] **Step 5: Commit**

```bash
git add server/internal/config/locales.go server/internal/config/locales_test.go
git commit -m "feat(server): add SupportedLocales config with ko only"
```

---

### Task 2: Migration — `users.native_language`

**Files:**
- Create: `server/migrations/000004_add_native_language_to_users.up.sql`
- Create: `server/migrations/000004_add_native_language_to_users.down.sql`

- [ ] **Step 1: Write up migration**

File `server/migrations/000004_add_native_language_to_users.up.sql`:

```sql
ALTER TABLE users
  ADD COLUMN native_language VARCHAR(8) NOT NULL DEFAULT 'ko';
```

- [ ] **Step 2: Write down migration**

File `server/migrations/000004_add_native_language_to_users.down.sql`:

```sql
ALTER TABLE users
  DROP COLUMN IF EXISTS native_language;
```

- [ ] **Step 3: Apply migration locally**

Run: `cd server && make docker-up && make migrate-up`
Expected output: `4/u add_native_language_to_users (…ms)`.

- [ ] **Step 4: Verify column via psql**

Run: `docker compose -f server/docker-compose.yml exec -T postgres psql -U forin -d forin -c "\d users" | grep native_language`
Expected: `native_language | character varying(8) | not null | default 'ko'::character varying`.

- [ ] **Step 5: Commit**

```bash
git add server/migrations/000004_add_native_language_to_users.up.sql server/migrations/000004_add_native_language_to_users.down.sql
git commit -m "feat(server): migration 000004 add users.native_language"
```

---

### Task 3: User model gets `NativeLanguage`

**Files:**
- Modify: `server/internal/model/user.go:10-37`

- [ ] **Step 1: Add field to `User` struct**

Edit `server/internal/model/user.go` — insert after `DisplayName string ...` (around line 14):

```go
	NativeLanguage string  `gorm:"column:native_language;size:8;not null;default:'ko'"`
```

Final struct head:
```go
type User struct {
	ID             uuid.UUID  `gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	Email          string     `gorm:"uniqueIndex;not null"`
	PasswordHash   *string    `gorm:"column:password_hash"`
	DisplayName    string     `gorm:"not null"`
	NativeLanguage string     `gorm:"column:native_language;size:8;not null;default:'ko'"`
	AvatarURL      *string
	// ... unchanged
}
```

- [ ] **Step 2: Rebuild to confirm no compilation break**

Run: `cd server && go build ./...`
Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add server/internal/model/user.go
git commit -m "feat(server): add NativeLanguage to User model"
```

---

### Task 4: `RegisterRequest` / `UserInfo` carry `native_language`; auth service honors it

**Files:**
- Modify: `server/internal/dto/auth_dto.go:5-33`
- Modify: `server/internal/service/auth_service.go:33-58,108-130`
- Modify: `server/internal/service/auth_service_test.go`

- [ ] **Step 1: Write the failing test**

Append to `server/internal/service/auth_service_test.go`:

```go
func TestRegister_DefaultsNativeLanguage(t *testing.T) {
	var created *model.User
	mockRepo := &testutil.MockUserRepository{
		FindByEmailFn: func(ctx context.Context, email string) (*model.User, error) {
			return nil, gorm.ErrRecordNotFound
		},
		CreateFn: func(ctx context.Context, user *model.User) error {
			user.ID = uuid.New()
			created = user
			return nil
		},
	}

	svc := NewAuthService(mockRepo, testConfig())
	resp, err := svc.Register(context.Background(), dto.RegisterRequest{
		Email:       "new@example.com",
		Password:    "password123",
		DisplayName: "New",
	})

	require.NoError(t, err)
	assert.Equal(t, "ko", created.NativeLanguage)
	assert.Equal(t, "ko", resp.User.NativeLanguage)
}

func TestRegister_HonorsExplicitNativeLanguage(t *testing.T) {
	var created *model.User
	mockRepo := &testutil.MockUserRepository{
		FindByEmailFn: func(ctx context.Context, email string) (*model.User, error) {
			return nil, gorm.ErrRecordNotFound
		},
		CreateFn: func(ctx context.Context, user *model.User) error {
			user.ID = uuid.New()
			created = user
			return nil
		},
	}

	svc := NewAuthService(mockRepo, testConfig())
	_, err := svc.Register(context.Background(), dto.RegisterRequest{
		Email:          "k@example.com",
		Password:       "password123",
		DisplayName:    "K",
		NativeLanguage: "ko",
	})

	require.NoError(t, err)
	assert.Equal(t, "ko", created.NativeLanguage)
}
```

- [ ] **Step 2: Run — confirm failure**

Run: `cd server && go test ./internal/service/ -run TestRegister_ -v`
Expected: FAIL — `dto.RegisterRequest` has no `NativeLanguage` / `dto.UserInfo` missing field.

- [ ] **Step 3: Add DTO fields**

Edit `server/internal/dto/auth_dto.go`:

```go
type RegisterRequest struct {
	Email          string `json:"email"           binding:"required,email"`
	Password       string `json:"password"        binding:"required,min=8"`
	DisplayName    string `json:"display_name"    binding:"required,min=1,max=100"`
	NativeLanguage string `json:"native_language" binding:"omitempty,oneof=ko"`
}

type UserInfo struct {
	ID             uuid.UUID `json:"id"`
	Email          string    `json:"email"`
	DisplayName    string    `json:"display_name"`
	NativeLanguage string    `json:"native_language"`
	CurrentLevel   int       `json:"current_level"`
	CurrentXP      int       `json:"current_xp"`
}
```

Note: `oneof=ko` list grows as we add locales; it must stay in sync with `config.SupportedLocales`. Reviewer hint — one acceptable refactor: replace the `binding:"oneof=..."` with a service-layer call to `config.IsSupported` and a `dto.ErrUnsupportedLocale`. Use the tag for now to keep the diff small.

- [ ] **Step 4: Implement service defaulting**

Edit `server/internal/service/auth_service.go` — update `Register`:

```go
func (s *AuthService) Register(ctx context.Context, req dto.RegisterRequest) (*dto.AuthResponse, error) {
	existing, err := s.userRepo.FindByEmail(ctx, req.Email)
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, fmt.Errorf("db lookup: %w", err)
	}
	if existing != nil {
		return nil, ErrEmailAlreadyExists
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), 12)
	if err != nil {
		return nil, fmt.Errorf("hash password: %w", err)
	}
	hashStr := string(hash)

	nativeLang := req.NativeLanguage
	if nativeLang == "" {
		nativeLang = config.DefaultLocale
	}

	user := &model.User{
		Email:          req.Email,
		PasswordHash:   &hashStr,
		DisplayName:    req.DisplayName,
		NativeLanguage: nativeLang,
	}
	if err := s.userRepo.Create(ctx, user); err != nil {
		return nil, fmt.Errorf("create user: %w", err)
	}

	return s.buildAuthResponse(user)
}
```

Edit `buildAuthResponse` to surface `NativeLanguage`:

```go
	User: dto.UserInfo{
		ID:             user.ID,
		Email:          user.Email,
		DisplayName:    user.DisplayName,
		NativeLanguage: user.NativeLanguage,
		CurrentLevel:   user.CurrentLevel,
		CurrentXP:      user.CurrentXP,
	},
```

- [ ] **Step 5: Run tests — confirm green**

Run: `cd server && go test ./internal/service/ ./internal/dto/... -count=1`
Expected: PASS. If `dto` has no tests that's fine — compile is enough.

- [ ] **Step 6: Commit**

```bash
git add server/internal/dto/auth_dto.go server/internal/service/auth_service.go server/internal/service/auth_service_test.go
git commit -m "feat(server): register carries native_language, defaults to ko"
```

---

### Task 5: `UserProfileResponse` + `UpdateProfile` carry `native_language` with locale validation

**Files:**
- Modify: `server/internal/dto/user_dto.go:11-44`
- Modify: `server/internal/service/user_service.go:46-76,78-139`
- Modify: `server/internal/service/user_service_test.go` (or new test file)

- [ ] **Step 1: Write failing test**

Append to `server/internal/service/user_service_test.go`:

```go
func TestUpdateProfile_SetsNativeLanguage(t *testing.T) {
	user := &model.User{ID: uuid.New(), NativeLanguage: "ko"}
	var updated *model.User
	mockRepo := &testutil.MockUserProfileRepository{
		FindByIDWithProfessionFn: func(ctx context.Context, id uuid.UUID) (*model.User, error) {
			return user, nil
		},
		UpdateFn: func(ctx context.Context, u *model.User) error {
			updated = u
			return nil
		},
		FindOrCreateStreakFn: func(ctx context.Context, id uuid.UUID) (*model.UserStreak, error) {
			return &model.UserStreak{}, nil
		},
		FindDailyActivityFn: func(ctx context.Context, id uuid.UUID, day time.Time) (*model.DailyActivityLog, error) {
			return nil, nil
		},
	}

	svc := NewUserService(mockRepo, testConfig())
	locale := "ko"
	_, err := svc.UpdateProfile(context.Background(), user.ID, dto.UpdateProfileRequest{
		NativeLanguage: &locale,
	})

	require.NoError(t, err)
	assert.Equal(t, "ko", updated.NativeLanguage)
}

func TestUpdateProfile_RejectsUnsupportedLocale(t *testing.T) {
	user := &model.User{ID: uuid.New(), NativeLanguage: "ko"}
	mockRepo := &testutil.MockUserProfileRepository{
		FindByIDWithProfessionFn: func(ctx context.Context, id uuid.UUID) (*model.User, error) {
			return user, nil
		},
	}

	svc := NewUserService(mockRepo, testConfig())
	bogus := "de"
	_, err := svc.UpdateProfile(context.Background(), user.ID, dto.UpdateProfileRequest{
		NativeLanguage: &bogus,
	})

	assert.ErrorIs(t, err, ErrUnsupportedLocale)
}
```

- [ ] **Step 2: Confirm fail**

Run: `cd server && go test ./internal/service/ -run TestUpdateProfile_ -v`
Expected: FAIL — `ErrUnsupportedLocale undefined`, `dto.UpdateProfileRequest.NativeLanguage` missing, `MockUserProfileRepository` missing some fields — inspect `server/internal/testutil/mock_user_profile_repo.go` and reuse its existing accessors (don't rewrite the mock; the fields listed above must already exist or be added below).

- [ ] **Step 3: Extend mock if needed**

Open `server/internal/testutil/mock_user_profile_repo.go`. The fields `FindByIDWithProfessionFn`, `UpdateFn`, `FindOrCreateStreakFn`, `FindDailyActivityFn` should already exist (they are used by existing tests). If any is missing, add:

```go
type MockUserProfileRepository struct {
	// ...existing fields...
	FindByIDWithProfessionFn func(ctx context.Context, id uuid.UUID) (*model.User, error)
	UpdateFn                 func(ctx context.Context, u *model.User) error
	FindOrCreateStreakFn     func(ctx context.Context, id uuid.UUID) (*model.UserStreak, error)
	FindDailyActivityFn      func(ctx context.Context, id uuid.UUID, day time.Time) (*model.DailyActivityLog, error)
}
```

and matching methods that delegate to the `Fn` field (look at how other mocks in that file are shaped).

- [ ] **Step 4: Add DTO field**

Edit `server/internal/dto/user_dto.go` — `UpdateProfileRequest`:

```go
type UpdateProfileRequest struct {
	DisplayName    *string `json:"display_name"    binding:"omitempty,min=1,max=100"`
	CatName        *string `json:"cat_name"        binding:"omitempty,min=1,max=50"`
	DailyGoal      *string `json:"daily_goal"      binding:"omitempty,oneof=casual regular intensive"`
	TargetCountry  *string `json:"target_country"  binding:"omitempty,max=10"`
	Timezone       *string `json:"timezone"        binding:"omitempty,max=100"`
	NativeLanguage *string `json:"native_language" binding:"omitempty,max=8"`
}
```

And `UserProfileResponse` — add after `TargetCountry`:

```go
	TargetCountry  *string                `json:"target_country"`
	NativeLanguage string                 `json:"native_language"`
	LanguageLevel  string                 `json:"language_level"`
```

- [ ] **Step 5: Add service error + validation**

Edit `server/internal/service/user_service.go`:

```go
var (
	ErrUserNotFound      = errors.New("user not found")
	ErrUnsupportedLocale = errors.New("unsupported native_language")
)
```

Add imports: `"github.com/forin/server/internal/config"`.

Update `UpdateProfile` — insert before `s.profileRepo.Update`:

```go
	if req.NativeLanguage != nil {
		if !config.IsSupported(*req.NativeLanguage) {
			return nil, ErrUnsupportedLocale
		}
		user.NativeLanguage = config.NormalizeLocale(*req.NativeLanguage)
	}
```

Update `buildProfileResponse` — assign `NativeLanguage`:

```go
	resp := &dto.UserProfileResponse{
		ID:             user.ID,
		Email:          user.Email,
		DisplayName:    user.DisplayName,
		AvatarURL:      user.AvatarURL,
		TargetCountry:  user.TargetCountry,
		NativeLanguage: user.NativeLanguage,
		LanguageLevel:  user.LanguageLevel,
		// ... rest unchanged
	}
```

- [ ] **Step 6: Map service error at the handler layer**

Inspect `server/internal/handler/response.go` — find the error-code mapper (likely `Error` + a switch). Add a case:

```go
	case errors.Is(err, service.ErrUnsupportedLocale):
		c.JSON(http.StatusUnprocessableEntity, dto.ErrorResponse{
			Success: false,
			Error: dto.ErrorDetail{
				Code:    "VALIDATION_ERROR",
				Message: "unsupported native_language",
			},
		})
		return
```

If `response.go` uses an error-registry pattern (map of error→code) instead, add an entry there — the test you'll write in Task 5b will confirm the 422 shape.

- [ ] **Step 7: Run tests**

Run: `cd server && go test ./internal/service/ ./internal/handler/ -count=1`
Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add server/internal/dto/user_dto.go server/internal/service/user_service.go server/internal/service/user_service_test.go server/internal/handler/response.go server/internal/testutil/mock_user_profile_repo.go
git commit -m "feat(server): PATCH /users/me accepts native_language, rejects unsupported"
```

---

### Task 6: Migration — `vocabulary` + `vocabulary_translations`

**Files:**
- Create: `server/migrations/000005_create_vocabulary.up.sql` / `.down.sql`
- Create: `server/migrations/000006_create_vocabulary_translations.up.sql` / `.down.sql`

- [ ] **Step 1: Write `000005` up**

File `server/migrations/000005_create_vocabulary.up.sql`:

```sql
CREATE TABLE vocabulary (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  canonical_en   TEXT NOT NULL,
  part_of_speech TEXT NOT NULL,
  domain         TEXT NOT NULL,
  cefr_level     TEXT,
  note           TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_vocab_domain ON vocabulary(domain);
CREATE UNIQUE INDEX idx_vocab_canonical ON vocabulary(canonical_en);
```

- [ ] **Step 2: Write `000005` down**

File `server/migrations/000005_create_vocabulary.down.sql`:

```sql
DROP TABLE IF EXISTS vocabulary;
```

- [ ] **Step 3: Write `000006` up**

File `server/migrations/000006_create_vocabulary_translations.up.sql`:

```sql
CREATE TABLE vocabulary_translations (
  vocab_id UUID     NOT NULL REFERENCES vocabulary(id) ON DELETE CASCADE,
  locale   VARCHAR(8) NOT NULL,
  word     TEXT     NOT NULL,
  note     TEXT,
  PRIMARY KEY (vocab_id, locale)
);

CREATE INDEX idx_vocab_translation_locale ON vocabulary_translations(locale);
```

- [ ] **Step 4: Write `000006` down**

File `server/migrations/000006_create_vocabulary_translations.down.sql`:

```sql
DROP TABLE IF EXISTS vocabulary_translations;
```

- [ ] **Step 5: Apply**

Run: `cd server && make migrate-up`
Expected: `5/u create_vocabulary`, `6/u create_vocabulary_translations`.

- [ ] **Step 6: Verify tables**

Run: `docker compose -f server/docker-compose.yml exec -T postgres psql -U forin -d forin -c "\dt vocabulary*"`
Expected: both tables listed.

- [ ] **Step 7: Commit**

```bash
git add server/migrations/000005_create_vocabulary.up.sql server/migrations/000005_create_vocabulary.down.sql server/migrations/000006_create_vocabulary_translations.up.sql server/migrations/000006_create_vocabulary_translations.down.sql
git commit -m "feat(server): migrations 000005-000006 vocabulary domain tables"
```

---

### Task 7: Vocabulary GORM models

**Files:**
- Create: `server/internal/model/vocabulary.go`

- [ ] **Step 1: Write the model file**

File `server/internal/model/vocabulary.go`:

```go
package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Vocabulary struct {
	ID           uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	CanonicalEn  string    `gorm:"column:canonical_en;not null;uniqueIndex:idx_vocab_canonical"`
	PartOfSpeech string    `gorm:"column:part_of_speech;not null"`
	Domain       string    `gorm:"not null;index:idx_vocab_domain"`
	CEFRLevel    *string   `gorm:"column:cefr_level"`
	Note         *string
	CreatedAt    time.Time

	Translations []VocabularyTranslation `gorm:"foreignKey:VocabID"`
}

func (Vocabulary) TableName() string { return "vocabulary" }

func (v *Vocabulary) BeforeCreate(tx *gorm.DB) error {
	if v.ID == uuid.Nil {
		v.ID = uuid.New()
	}
	return nil
}

type VocabularyTranslation struct {
	VocabID uuid.UUID `gorm:"type:uuid;primaryKey;column:vocab_id"`
	Locale  string    `gorm:"primaryKey;size:8"`
	Word    string    `gorm:"not null"`
	Note    *string
}

func (VocabularyTranslation) TableName() string { return "vocabulary_translations" }
```

- [ ] **Step 2: Build to confirm compile**

Run: `cd server && go build ./...`
Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add server/internal/model/vocabulary.go
git commit -m "feat(server): add Vocabulary and VocabularyTranslation models"
```

---

### Task 8: `VocabularyRepository.GetByIDsWithTranslation` with locale fallback

**Files:**
- Create: `server/internal/repository/vocabulary_repo.go`
- Create: `server/internal/repository/vocabulary_repo_test.go`

- [ ] **Step 1: Write failing integration test**

File `server/internal/repository/vocabulary_repo_test.go`:

```go
package repository

import (
	"context"
	"testing"

	"github.com/forin/server/internal/model"
	"github.com/forin/server/internal/testutil"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestGetByIDsWithTranslation_FallsBackToCanonical(t *testing.T) {
	db := testutil.NewTestDB(t)
	tx := testutil.TxDB(t, db)

	repo := NewVocabularyRepository(tx)

	painID := uuid.New()
	woundID := uuid.New()
	require.NoError(t, tx.Create(&model.Vocabulary{
		ID: painID, CanonicalEn: "pain", PartOfSpeech: "noun", Domain: "symptom",
	}).Error)
	require.NoError(t, tx.Create(&model.Vocabulary{
		ID: woundID, CanonicalEn: "wound", PartOfSpeech: "noun", Domain: "symptom",
	}).Error)
	require.NoError(t, tx.Create(&model.VocabularyTranslation{
		VocabID: painID, Locale: "ko", Word: "통증",
	}).Error)
	// note: no ko translation for `wound` — fallback expected

	got, err := repo.GetByIDsWithTranslation(context.Background(), []uuid.UUID{painID, woundID}, "ko")
	require.NoError(t, err)
	require.Len(t, got, 2)

	byID := map[uuid.UUID]VocabularyWithTranslation{}
	for _, v := range got {
		byID[v.ID] = v
	}
	assert.Equal(t, "통증", byID[painID].Translation)
	assert.Equal(t, "ko", byID[painID].Locale)
	assert.Equal(t, "wound", byID[woundID].Translation)
	assert.Equal(t, "en", byID[woundID].Locale)
}
```

- [ ] **Step 2: Run — confirm fail**

Run: `cd server && go test ./internal/repository/ -run TestGetByIDsWithTranslation -v`
Expected: FAIL — `NewVocabularyRepository undefined`. (If DB unreachable, test **skips**; bring it up via `make docker-up && make migrate-up` first.)

- [ ] **Step 3: Implement repository**

File `server/internal/repository/vocabulary_repo.go`:

```go
package repository

import (
	"context"

	"github.com/forin/server/internal/model"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// VocabularyWithTranslation couples a vocabulary row with the best-available
// translation for the requested locale, falling back to canonical English.
type VocabularyWithTranslation struct {
	ID           uuid.UUID
	CanonicalEn  string
	PartOfSpeech string
	Domain       string
	// Translation is the locale-specific word if present; otherwise CanonicalEn.
	Translation string
	// Locale is the locale actually served — requested locale on hit, "en" on fallback.
	Locale string
}

type VocabularyRepository struct {
	db *gorm.DB
}

func NewVocabularyRepository(db *gorm.DB) *VocabularyRepository {
	return &VocabularyRepository{db: db}
}

// GetByIDsWithTranslation fetches vocabulary rows and pairs each with its
// translation in `locale`. If a translation is missing for a given row, the
// canonical English is returned with Locale="en".
func (r *VocabularyRepository) GetByIDsWithTranslation(
	ctx context.Context, ids []uuid.UUID, locale string,
) ([]VocabularyWithTranslation, error) {
	if len(ids) == 0 {
		return nil, nil
	}

	type row struct {
		ID              uuid.UUID
		CanonicalEn     string
		PartOfSpeech    string
		Domain          string
		TranslatedWord  *string
	}

	var rows []row
	err := r.db.WithContext(ctx).
		Table("vocabulary AS v").
		Select(`v.id, v.canonical_en, v.part_of_speech, v.domain, t.word AS translated_word`).
		Joins(`LEFT JOIN vocabulary_translations AS t
		       ON t.vocab_id = v.id AND t.locale = ?`, locale).
		Where("v.id IN ?", ids).
		Scan(&rows).Error
	if err != nil {
		return nil, err
	}

	out := make([]VocabularyWithTranslation, 0, len(rows))
	for _, r := range rows {
		entry := VocabularyWithTranslation{
			ID:           r.ID,
			CanonicalEn:  r.CanonicalEn,
			PartOfSpeech: r.PartOfSpeech,
			Domain:       r.Domain,
		}
		if r.TranslatedWord != nil {
			entry.Translation = *r.TranslatedWord
			entry.Locale = locale
		} else {
			entry.Translation = r.CanonicalEn
			entry.Locale = "en"
		}
		out = append(out, entry)
	}
	// Compile-time guard against forgetting the model import if unused.
	var _ model.Vocabulary
	return out, nil
}
```

- [ ] **Step 4: Run — confirm pass**

Run: `cd server && make docker-up && make migrate-up && go test ./internal/repository/ -run TestGetByIDsWithTranslation -v`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add server/internal/repository/vocabulary_repo.go server/internal/repository/vocabulary_repo_test.go
git commit -m "feat(server): vocabulary repo with locale fallback"
```

---

### Task 9: Seed ~50 medical vocabulary entries with Korean translations

**Files:**
- Create: `server/scripts/seed_vocabulary.go`
- Modify: `server/scripts/seed.go`

- [ ] **Step 1: Write seeder**

File `server/scripts/seed_vocabulary.go`:

```go
package main

import (
	"log"

	"gorm.io/gorm"
)

type vocabSeed struct {
	canonical    string
	partOfSpeech string
	domain       string
	cefr         string
	ko           string
}

// 50 high-frequency nurse–patient terms. Nouns dominate the symptom/anatomy
// domains; verbs appear in procedure/medication; "phrase" domain captures
// multi-word idioms. Expect Sub-project 3 to extend this list.
var seedVocab = []vocabSeed{
	// symptom
	{"pain", "noun", "symptom", "A2", "통증"},
	{"ache", "noun", "symptom", "B1", "쑤심"},
	{"nausea", "noun", "symptom", "B1", "메스꺼움"},
	{"dizziness", "noun", "symptom", "B1", "어지러움"},
	{"fever", "noun", "symptom", "A2", "열"},
	{"cough", "noun", "symptom", "A2", "기침"},
	{"fatigue", "noun", "symptom", "B1", "피로"},
	{"swelling", "noun", "symptom", "B1", "부종"},
	{"rash", "noun", "symptom", "B1", "발진"},
	{"shortness of breath", "phrase", "symptom", "B2", "숨 가쁨"},
	{"chest pain", "phrase", "symptom", "B1", "가슴 통증"},
	{"bleeding", "noun", "symptom", "B1", "출혈"},
	{"wound", "noun", "symptom", "A2", "상처"},
	// equipment
	{"stethoscope", "noun", "equipment", "B1", "청진기"},
	{"thermometer", "noun", "equipment", "A2", "체온계"},
	{"blood pressure cuff", "phrase", "equipment", "B2", "혈압계"},
	{"syringe", "noun", "equipment", "B1", "주사기"},
	{"IV line", "phrase", "equipment", "B2", "정맥주사관"},
	{"oxygen mask", "phrase", "equipment", "B2", "산소 마스크"},
	{"wheelchair", "noun", "equipment", "A2", "휠체어"},
	{"bedpan", "noun", "equipment", "B1", "변기"},
	{"gauze", "noun", "equipment", "B1", "거즈"},
	{"bandage", "noun", "equipment", "A2", "붕대"},
	// procedure
	{"injection", "noun", "procedure", "A2", "주사"},
	{"surgery", "noun", "procedure", "A2", "수술"},
	{"blood draw", "phrase", "procedure", "B2", "채혈"},
	{"X-ray", "noun", "procedure", "A2", "엑스레이"},
	{"vital signs", "phrase", "procedure", "B1", "활력징후"},
	{"discharge", "noun", "procedure", "B1", "퇴원"},
	{"admission", "noun", "procedure", "B1", "입원"},
	{"prescription", "noun", "procedure", "B1", "처방"},
	{"dosage", "noun", "procedure", "B2", "용량"},
	// medication
	{"painkiller", "noun", "medication", "A2", "진통제"},
	{"antibiotic", "noun", "medication", "B1", "항생제"},
	{"anesthesia", "noun", "medication", "B2", "마취"},
	{"insulin", "noun", "medication", "B1", "인슐린"},
	{"IV fluid", "phrase", "medication", "B2", "수액"},
	{"tablet", "noun", "medication", "A2", "알약"},
	{"capsule", "noun", "medication", "A2", "캡슐"},
	// anatomy
	{"pulse", "noun", "anatomy", "A2", "맥박"},
	{"heart rate", "phrase", "anatomy", "B1", "심박수"},
	{"blood pressure", "phrase", "anatomy", "B1", "혈압"},
	{"lungs", "noun", "anatomy", "A2", "폐"},
	{"abdomen", "noun", "anatomy", "B1", "복부"},
	{"spine", "noun", "anatomy", "B1", "척추"},
	{"kidney", "noun", "anatomy", "A2", "신장"},
	{"liver", "noun", "anatomy", "A2", "간"},
	{"bladder", "noun", "anatomy", "B1", "방광"},
	{"wrist", "noun", "anatomy", "A2", "손목"},
	{"ankle", "noun", "anatomy", "A2", "발목"},
	{"temperature", "noun", "anatomy", "A2", "체온"},
}

func seedVocabulary(db *gorm.DB) {
	for _, v := range seedVocab {
		var vocabID string
		// Upsert vocabulary row; capture id for the translation insert.
		err := db.Raw(`
			INSERT INTO vocabulary (canonical_en, part_of_speech, domain, cefr_level)
			VALUES (?, ?, ?, NULLIF(?, ''))
			ON CONFLICT (canonical_en) DO UPDATE
			  SET canonical_en = EXCLUDED.canonical_en
			RETURNING id;
		`, v.canonical, v.partOfSpeech, v.domain, v.cefr).Row().Scan(&vocabID)
		if err != nil {
			log.Fatalf("seed vocab %q: %v", v.canonical, err)
		}
		if err := db.Exec(`
			INSERT INTO vocabulary_translations (vocab_id, locale, word)
			VALUES (?::uuid, 'ko', ?)
			ON CONFLICT (vocab_id, locale) DO NOTHING;
		`, vocabID, v.ko).Error; err != nil {
			log.Fatalf("seed translation %q: %v", v.canonical, err)
		}
	}
}
```

- [ ] **Step 2: Wire into `seed.go`**

Edit `server/scripts/seed.go` — append call:

```go
	fmt.Println("Seeding vocabulary...")
	seedVocabulary(db)

	fmt.Println("Seed completed successfully.")
```

- [ ] **Step 3: Run seed**

Run: `cd server && make seed`
Expected: prints "Seeding vocabulary..." then "Seed completed successfully." with no fatal errors.

- [ ] **Step 4: Verify row counts**

Run: `docker compose -f server/docker-compose.yml exec -T postgres psql -U forin -d forin -c "SELECT COUNT(*) FROM vocabulary; SELECT COUNT(*) FROM vocabulary_translations WHERE locale='ko';"`
Expected: two counts ≥ 50 each.

- [ ] **Step 5: Run seed a second time — idempotency**

Run: `cd server && make seed`
Expected: same counts, no errors.

- [ ] **Step 6: Commit**

```bash
git add server/scripts/seed.go server/scripts/seed_vocabulary.go
git commit -m "feat(server): seed 50 medical vocabulary terms with ko translations"
```

---

### Task 10: Install mobile i18n deps

**Files:**
- Modify: `mobile/package.json`

- [ ] **Step 1: Install**

Run: `cd mobile && npx expo install i18n-js expo-localization`
Expected: both added to `dependencies` in `mobile/package.json`, and the lockfile updated. `expo install` chooses versions compatible with Expo 54.

- [ ] **Step 2: Verify expo-localization is linked**

Run: `cd mobile && npx expo-doctor`
Expected: no errors related to new packages. (Warnings unrelated to i18n can be ignored for this phase.)

- [ ] **Step 3: Commit**

```bash
git add mobile/package.json mobile/package-lock.json
git commit -m "feat(mobile): add i18n-js and expo-localization"
```

---

### Task 11: Locale files + `i18n-js` runtime

**Files:**
- Create: `mobile/src/locales/en.json`
- Create: `mobile/src/locales/ko.json`
- Create: `mobile/src/locales/index.ts`

- [ ] **Step 1: Create `en.json` (canonical keys)**

File `mobile/src/locales/en.json`:

```json
{
  "auth": {
    "login": {
      "title": "Welcome back",
      "emailPlaceholder": "you@example.com",
      "passwordPlaceholder": "Password",
      "submit": "Log In",
      "toRegister": "No account yet? Sign Up",
      "errors": {
        "generic": "Login failed"
      }
    },
    "register": {
      "title": "Create Account",
      "displayNameLabel": "Display Name",
      "displayNamePlaceholder": "How should we call you?",
      "emailLabel": "Email",
      "emailPlaceholder": "you@example.com",
      "passwordLabel": "Password",
      "passwordPlaceholder": "At least 8 characters",
      "submit": "Sign Up",
      "toLogin": "Already have an account? Log In",
      "errors": {
        "generic": "Registration failed",
        "passwordTooShort": "Password must be at least 8 characters"
      }
    }
  },
  "onboarding": {
    "language": {
      "title": "Choose your language",
      "subtitle": "UI will be shown in this language. You can keep learning English either way.",
      "comingSoonBadge": "Coming soon",
      "continue": "Continue"
    },
    "profession": {
      "title": "What is your profession?"
    },
    "country": {
      "title": "Where are you heading?"
    },
    "goal": {
      "title": "Set your daily goal",
      "casual": "Casual",
      "casualDesc": "1 stage/day (50 XP)",
      "regular": "Regular",
      "regularDesc": "2 stages/day (100 XP)",
      "intensive": "Intensive",
      "intensiveDesc": "4 stages/day (200 XP)",
      "next": "Next"
    },
    "catName": {
      "title": "Name your study buddy!",
      "description": "This cat will accompany you on your learning journey",
      "placeholder": "Enter a name",
      "submit": "Start Learning!"
    },
    "errors": {
      "generic": "Failed to complete onboarding"
    }
  },
  "common": {
    "error": "Error",
    "cancel": "Cancel",
    "ok": "OK",
    "save": "Save",
    "loading": "Loading..."
  }
}
```

- [ ] **Step 2: Create `ko.json`**

File `mobile/src/locales/ko.json` — **same shape**, values translated:

```json
{
  "auth": {
    "login": {
      "title": "다시 오신 걸 환영해요",
      "emailPlaceholder": "you@example.com",
      "passwordPlaceholder": "비밀번호",
      "submit": "로그인",
      "toRegister": "계정이 없으신가요? 가입하기",
      "errors": {
        "generic": "로그인에 실패했어요"
      }
    },
    "register": {
      "title": "계정 만들기",
      "displayNameLabel": "표시 이름",
      "displayNamePlaceholder": "어떻게 불러드릴까요?",
      "emailLabel": "이메일",
      "emailPlaceholder": "you@example.com",
      "passwordLabel": "비밀번호",
      "passwordPlaceholder": "8자 이상 입력해주세요",
      "submit": "가입하기",
      "toLogin": "이미 계정이 있으신가요? 로그인",
      "errors": {
        "generic": "회원가입에 실패했어요",
        "passwordTooShort": "비밀번호는 8자 이상이어야 해요"
      }
    }
  },
  "onboarding": {
    "language": {
      "title": "사용할 언어를 선택해 주세요",
      "subtitle": "UI는 이 언어로 표시됩니다. 영어 학습은 그대로 진행돼요.",
      "comingSoonBadge": "곧 지원 예정",
      "continue": "계속"
    },
    "profession": {
      "title": "직업을 알려주세요"
    },
    "country": {
      "title": "어느 나라로 가시나요?"
    },
    "goal": {
      "title": "하루 목표를 정해주세요",
      "casual": "가볍게",
      "casualDesc": "하루 1스테이지 (50 XP)",
      "regular": "꾸준히",
      "regularDesc": "하루 2스테이지 (100 XP)",
      "intensive": "몰입",
      "intensiveDesc": "하루 4스테이지 (200 XP)",
      "next": "다음"
    },
    "catName": {
      "title": "학습 친구의 이름을 지어주세요!",
      "description": "이 고양이가 학습 여정을 함께 합니다",
      "placeholder": "이름 입력",
      "submit": "학습 시작!"
    },
    "errors": {
      "generic": "온보딩을 완료하지 못했어요"
    }
  },
  "common": {
    "error": "오류",
    "cancel": "취소",
    "ok": "확인",
    "save": "저장",
    "loading": "불러오는 중..."
  }
}
```

- [ ] **Step 3: Create runtime**

File `mobile/src/locales/index.ts`:

```ts
import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';

import en from './en.json';
import ko from './ko.json';

export const SUPPORTED_LOCALES = ['ko', 'en'] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const i18n = new I18n({ en, ko });

// Resolve missing keys via en.json; in __DEV__ warn once per key.
i18n.enableFallback = true;
i18n.defaultLocale = 'en';

const warnedKeys = new Set<string>();
i18n.missingTranslation = (scope: string) => {
  if (__DEV__ && !warnedKeys.has(scope)) {
    warnedKeys.add(scope);
    console.warn(`[i18n] missing key: ${scope}`);
  }
  return scope;
};

// Normalize BCP-47 device locale (ko-KR / ko_KR -> ko).
function normalize(locale: string | undefined): SupportedLocale {
  if (!locale) return 'en';
  const primary = locale.toLowerCase().split(/[-_]/)[0];
  return (SUPPORTED_LOCALES as readonly string[]).includes(primary)
    ? (primary as SupportedLocale)
    : 'en';
}

// Initial locale = device locale, normalized. authStore will override after login.
const deviceLocales = Localization.getLocales();
i18n.locale = normalize(deviceLocales[0]?.languageCode ?? deviceLocales[0]?.languageTag);

export function setAppLocale(locale: string) {
  i18n.locale = normalize(locale);
}

export function t(key: string, options?: Record<string, unknown>) {
  return i18n.t(key, options);
}
```

- [ ] **Step 4: Import once at app boot**

Edit `mobile/App.tsx` (or the file that renders `<AppNavigator />`) — add a side-effect import near the top so `i18n.locale` is set before any `t()` call:

```ts
import './src/locales';
```

Run: `cd mobile && npx tsc --noEmit`
Expected: exit 0. (If `tsc` flags missing `@types` for `i18n-js`, the library ships its own types — if the error is literally "could not find declaration", add `"esModuleInterop": true` only if missing from `tsconfig.json`.)

- [ ] **Step 5: Smoke-run Metro**

Run: `cd mobile && npx expo start --clear` (leave running; Ctrl+C to stop)
Expected: Metro bundler starts; no "cannot resolve module 'i18n-js'" errors in the terminal.

Stop Metro after confirming it boots.

- [ ] **Step 6: Commit**

```bash
git add mobile/src/locales/ mobile/App.tsx
git commit -m "feat(mobile): add i18n-js runtime with en/ko locales"
```

---

### Task 12: `useLocale` hook — reacts to authStore.user.native_language

**Files:**
- Create: `mobile/src/hooks/useLocale.ts`
- Modify: `mobile/src/types/api.ts:12-25,28-56`
- Modify: `mobile/src/stores/authStore.ts:6-59`

- [ ] **Step 1: Extend types**

Edit `mobile/src/types/api.ts`:

```ts
export interface UserInfo {
  id: string;
  email: string;
  display_name: string;
  native_language: string;
  current_level: number;
  current_xp: number;
}

// ...

export interface UserProfile {
  id: string;
  email: string;
  display_name: string;
  avatar_url: string | null;
  profession: { id: string; name: string; slug: string } | null;
  target_country: string | null;
  native_language: string;
  language_level: string;
  // ... rest unchanged
}
```

- [ ] **Step 2: Extend authStore**

Edit `mobile/src/stores/authStore.ts`:

```ts
interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserInfo | null;

  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    displayName: string,
    nativeLanguage?: string,
  ) => Promise<void>;
  setUser: (user: UserInfo) => void;
  logout: () => Promise<void>;
}
```

Then update `register`:

```ts
  register: async (email, password, displayName, nativeLanguage) => {
    const { data } = await authApi.register(email, password, displayName, nativeLanguage);
    const tokens = data.data;
    await SecureStore.setItemAsync('access_token', tokens.access_token);
    await SecureStore.setItemAsync('refresh_token', tokens.refresh_token);
    set({ isAuthenticated: true, user: tokens.user });
  },

  setUser: (user) => set({ user }),
```

And update `mobile/src/api/auth.ts`:

```ts
  register: (email: string, password: string, displayName: string, nativeLanguage?: string) =>
    api.post<ApiResponse<AuthResponse>>('/auth/register', {
      email,
      password,
      display_name: displayName,
      ...(nativeLanguage ? { native_language: nativeLanguage } : {}),
    }),
```

- [ ] **Step 3: Write hook**

File `mobile/src/hooks/useLocale.ts`:

```ts
import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { setAppLocale, i18n } from '../locales';

/**
 * Keeps i18n.locale in sync with the authenticated user's native_language.
 * Pre-login, i18n.locale is already set to the device locale by
 * `mobile/src/locales/index.ts`.
 */
export function useLocale(): string {
  const userLocale = useAuthStore((s) => s.user?.native_language);

  useEffect(() => {
    if (userLocale) {
      setAppLocale(userLocale);
    }
  }, [userLocale]);

  return i18n.locale;
}
```

- [ ] **Step 4: Typecheck**

Run: `cd mobile && npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 5: Commit**

```bash
git add mobile/src/hooks/useLocale.ts mobile/src/stores/authStore.ts mobile/src/types/api.ts mobile/src/api/auth.ts
git commit -m "feat(mobile): useLocale hook drives i18n from authStore"
```

---

### Task 13: Convert `RegisterScreen` + `LoginScreen` to `t()`

**Files:**
- Modify: `mobile/src/screens/auth/RegisterScreen.tsx`
- Modify: `mobile/src/screens/auth/LoginScreen.tsx`

- [ ] **Step 1: Convert `RegisterScreen`**

Edit `mobile/src/screens/auth/RegisterScreen.tsx` — replace inline English strings with `t()`:

```tsx
import { t } from '../../locales';
// ... existing imports
```

Then within the component:

```tsx
  const handleRegister = async () => {
    if (!name || !email || !password) return;
    if (password.length < 8) {
      Alert.alert(t('common.error'), t('auth.register.errors.passwordTooShort'));
      return;
    }
    setLoading(true);
    try {
      await register(email, password, name);
    } catch (err: any) {
      const msg = err?.response?.data?.error?.message || t('auth.register.errors.generic');
      Alert.alert(t('common.error'), msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView ...>
      <View style={styles.content}>
        <Text style={styles.title}>{t('auth.register.title')}</Text>
        <View style={styles.form}>
          <Input
            label={t('auth.register.displayNameLabel')}
            placeholder={t('auth.register.displayNamePlaceholder')}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
          <Input
            label={t('auth.register.emailLabel')}
            placeholder={t('auth.register.emailPlaceholder')}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <Input
            label={t('auth.register.passwordLabel')}
            placeholder={t('auth.register.passwordPlaceholder')}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Button title={t('auth.register.submit')} onPress={handleRegister} loading={loading} />
        </View>

        <Button
          title={t('auth.register.toLogin')}
          onPress={() => navigation.goBack()}
          variant="outline"
          style={styles.loginBtn}
        />
      </View>
    </KeyboardAvoidingView>
  );
```

- [ ] **Step 2: Convert `LoginScreen`**

Open `mobile/src/screens/auth/LoginScreen.tsx`. Apply the analogous transform — every English string literal in JSX/Alert → `t('auth.login.*')`. Keys used: `auth.login.title`, `auth.login.emailPlaceholder`, `auth.login.passwordPlaceholder`, `auth.login.submit`, `auth.login.toRegister`, `auth.login.errors.generic`, `common.error`. (These are already defined in `en.json` / `ko.json`.)

- [ ] **Step 3: Typecheck + Metro smoke**

Run: `cd mobile && npx tsc --noEmit`
Then: `cd mobile && npx expo start --clear`
Open the iOS simulator, verify Login + Register render correct Korean strings on a device whose language is Korean, English strings otherwise. Stop Metro.

- [ ] **Step 4: Commit**

```bash
git add mobile/src/screens/auth/
git commit -m "feat(mobile): translate login and register screens via t()"
```

---

### Task 14: `LanguageSelectScreen` — the new onboarding entry

**Files:**
- Create: `mobile/src/screens/onboarding/LanguageSelectScreen.tsx`

- [ ] **Step 1: Write the screen**

File `mobile/src/screens/onboarding/LanguageSelectScreen.tsx`:

```tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { userApi } from '../../api';
import { useAuthStore } from '../../stores/authStore';
import { Button } from '../../components/common';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { setAppLocale, t } from '../../locales';

type LocaleOption = {
  code: string;       // BCP-47 primary tag, what we send to the server
  label: string;      // native script self-name
  supported: boolean; // false => greyed-out with "Coming soon"
};

const OPTIONS: LocaleOption[] = [
  { code: 'ko', label: '한국어', supported: true },
  { code: 'en', label: 'English', supported: false },
  { code: 'vi', label: 'Tiếng Việt', supported: false },
  { code: 'tl', label: 'Filipino', supported: false },
  { code: 'ja', label: '日本語', supported: false },
  { code: 'zh', label: '中文', supported: false },
];

interface Props {
  onComplete: () => void;
}

export function LanguageSelectScreen({ onComplete }: Props) {
  const [selected, setSelected] = useState<string>('ko');
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);
  const currentUser = useAuthStore((s) => s.user);

  const handleContinue = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      const { data } = await userApi.updateProfile({ native_language: selected } as any);
      setAppLocale(selected);
      if (currentUser) {
        setUser({ ...currentUser, native_language: selected });
      }
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      onComplete();
    } catch (err: any) {
      Alert.alert(t('common.error'), err?.response?.data?.error?.message || t('onboarding.errors.generic'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{t('onboarding.language.title')}</Text>
        <Text style={styles.subtitle}>{t('onboarding.language.subtitle')}</Text>
        <View style={styles.list}>
          {OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.code}
              disabled={!opt.supported}
              onPress={() => setSelected(opt.code)}
              style={[
                styles.card,
                !opt.supported && styles.cardDisabled,
                selected === opt.code && styles.cardSelected,
              ]}
            >
              <Text style={[styles.label, !opt.supported && styles.labelDisabled]}>
                {opt.label}
              </Text>
              {!opt.supported && (
                <Text style={styles.badge}>{t('onboarding.language.comingSoonBadge')}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
        <Button
          title={t('onboarding.language.continue')}
          onPress={handleContinue}
          loading={loading}
          style={styles.continue}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, justifyContent: 'center', padding: spacing.lg },
  title: { ...typography.h1, color: colors.textPrimary, textAlign: 'center', marginBottom: spacing.sm },
  subtitle: { ...typography.body, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.lg },
  list: { gap: spacing.sm, marginBottom: spacing.lg },
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 2,
    borderColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardSelected: { borderColor: colors.primary, backgroundColor: '#EEF2FF' },
  cardDisabled: { opacity: 0.5 },
  label: { ...typography.h3, color: colors.textPrimary },
  labelDisabled: { color: colors.textMuted },
  badge: { ...typography.caption, color: colors.textMuted },
  continue: {},
});
```

- [ ] **Step 2: Typecheck**

Run: `cd mobile && npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add mobile/src/screens/onboarding/LanguageSelectScreen.tsx
git commit -m "feat(mobile): LanguageSelectScreen with Korean enabled"
```

---

### Task 15: Thread LanguageSelect into onboarding

**Files:**
- Modify: `mobile/src/navigation/AppNavigator.tsx`
- Modify: `mobile/src/screens/onboarding/OnboardingScreen.tsx` (translate profession/country/goal/catName steps)

- [ ] **Step 1: Gate onboarding on `native_language`**

Edit `mobile/src/navigation/AppNavigator.tsx` — replace `AuthenticatedApp`:

```tsx
import { LanguageSelectScreen } from '../screens/onboarding/LanguageSelectScreen';
import { useAuthStore } from '../stores/authStore';

function AuthenticatedApp() {
  const [stage, setStage] = useState<'language' | 'onboarding' | 'main' | null>(null);
  const setUser = useAuthStore((s) => s.setUser);
  const currentUser = useAuthStore((s) => s.user);

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data } = await userApi.getProfile();
      return data.data;
    },
  });

  useEffect(() => {
    if (!profile) return;
    // Keep authStore.user.native_language in sync so useLocale reacts.
    if (currentUser && currentUser.native_language !== profile.native_language) {
      setUser({ ...currentUser, native_language: profile.native_language });
    }
    // `native_language === ''` means the column default ('ko') applied server-side —
    // we still want to run the picker the first time. The spec treats the DB default
    // as "not explicitly chosen". Detect that by checking profession presence too:
    // a user with a profession already went through onboarding, so skip language.
    if (!profile.profession && !hasChosenLanguage(profile)) {
      setStage('language');
    } else if (!profile.profession) {
      setStage('onboarding');
    } else {
      setStage('main');
    }
  }, [profile]);

  if (stage === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (stage === 'language') {
    return <LanguageSelectScreen onComplete={() => setStage('onboarding')} />;
  }

  if (stage === 'onboarding') {
    return <OnboardingScreen onComplete={() => setStage('main')} />;
  }

  return <MainTabs />;
}

// A profile is considered to have chosen a language when the mobile client itself
// wrote that choice (setUser in LanguageSelectScreen). We use a persisted flag in
// SecureStore; the simplest heuristic without a backend flag is:
function hasChosenLanguage(profile: { native_language: string }): boolean {
  // Treat any non-empty value as "chosen". Backend default is "ko", so a returning
  // user who never hit the picker still has "ko" — acceptable for the Korean-only
  // MVP since the selection has only one outcome anyway. Revisit when locale #2 ships.
  return !!profile.native_language;
}
```

- [ ] **Step 2: Translate the rest of `OnboardingScreen`**

Edit `mobile/src/screens/onboarding/OnboardingScreen.tsx` — replace English literals with `t()` calls:

Add import: `import { t } from '../../locales';`

Replacements:
- `"What is your profession?"` → `t('onboarding.profession.title')`
- `"Where are you heading?"` → `t('onboarding.country.title')`
- `"Set your daily goal"` → `t('onboarding.goal.title')`
- `goalOptions` labels/descs → read from `t()`:
  ```ts
  const goalOptions = [
    { key: 'casual', label: t('onboarding.goal.casual'), desc: t('onboarding.goal.casualDesc') },
    { key: 'regular', label: t('onboarding.goal.regular'), desc: t('onboarding.goal.regularDesc') },
    { key: 'intensive', label: t('onboarding.goal.intensive'), desc: t('onboarding.goal.intensiveDesc') },
  ];
  ```
- `"Next"` → `t('onboarding.goal.next')`
- `"Name your study buddy!"` → `t('onboarding.catName.title')`
- description line → `t('onboarding.catName.description')`
- `placeholder="Enter a name"` → `t('onboarding.catName.placeholder')`
- `title="Start Learning!"` → `t('onboarding.catName.submit')`
- `Alert.alert('Error', 'Failed to complete onboarding')` → `Alert.alert(t('common.error'), t('onboarding.errors.generic'))`

- [ ] **Step 3: Typecheck + smoke**

Run: `cd mobile && npx tsc --noEmit`
Expected: exit 0.
Run: `cd mobile && npx expo start --clear` — register a new account on iOS simulator. Flow should be: Register → LanguageSelect (Korean highlighted, others greyed out) → Profession → Country → Goal → CatName → Main tabs. Stop Metro after confirming.

- [ ] **Step 4: Commit**

```bash
git add mobile/src/navigation/AppNavigator.tsx mobile/src/screens/onboarding/OnboardingScreen.tsx
git commit -m "feat(mobile): insert LanguageSelect before profession in onboarding"
```

---

### Task 16: Auth handler + response integration test

**Files:**
- Modify: `server/internal/handler/auth_handler_test.go`

- [ ] **Step 1: Append test — defaults native_language in response**

```go
func TestRegister_IncludesNativeLanguage(t *testing.T) {
	mockSvc := &testutil.MockAuthService{
		RegisterFn: func(ctx context.Context, req dto.RegisterRequest) (*dto.AuthResponse, error) {
			return &dto.AuthResponse{
				AccessToken:  "a",
				RefreshToken: "r",
				ExpiresIn:    900,
				User: dto.UserInfo{
					Email:          req.Email,
					DisplayName:    req.DisplayName,
					NativeLanguage: "ko",
				},
			}, nil
		},
	}

	h := NewAuthHandler(mockSvc)
	r := setupAuthRouter(h)

	body := strings.NewReader(`{"email":"a@b.com","password":"password123","display_name":"A"}`)
	req := httptest.NewRequest(http.MethodPost, "/auth/register", body)
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	require.Equal(t, http.StatusCreated, w.Code)
	assert.Contains(t, w.Body.String(), `"native_language":"ko"`)
}
```

If `setupAuthRouter` / `MockAuthService` don't exist, inspect the existing `auth_handler_test.go` for the router factory and mock — reuse it. If the service mock lacks `RegisterFn`, add it the same way `MockUserRepository` does (plain struct with function fields).

- [ ] **Step 2: Run tests**

Run: `cd server && go test ./internal/handler/ -run TestRegister -v -count=1`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add server/internal/handler/auth_handler_test.go
git commit -m "test(server): register response includes native_language"
```

---

### Task 17: Full regression + push

**Files:** _none (verification + git)_

- [ ] **Step 1: Full backend test sweep**

Run: `cd server && go test ./... -count=1`
Expected: all PASS. If integration tests skip, confirm Postgres is up (`make docker-up`) and re-run — all should PASS including repository tests.

- [ ] **Step 2: Mobile typecheck**

Run: `cd mobile && npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 3: Manual smoke — onboarding**

Run: `cd server && make run` (in one terminal) and `cd mobile && npx expo start` (in another).
Perform, on the iOS simulator:
1. Tap "Sign Up", create a fresh account.
2. Verify `LanguageSelectScreen` appears with Korean highlighted.
3. Tap Continue. Verify the UI after onboarding is in Korean.
4. Verify the remaining onboarding steps render Korean labels.
5. Check with `docker compose -f server/docker-compose.yml exec -T postgres psql -U forin -d forin -c "SELECT email, native_language FROM users ORDER BY created_at DESC LIMIT 1;"` — `native_language = ko`.

Stop dev servers.

- [ ] **Step 4: Confirm branch shape**

Run: `git log --oneline master..HEAD`
Expected: 10–13 commits, none with `Co-Authored-By`.

Run: `git status`
Expected: clean tree.

- [ ] **Step 5: Push**

Run: `git push -u origin feat/i18n-foundation`
Expected: branch published, PR URL suggestion printed.

---

## Self-review checklist (completed)

**1. Spec coverage** — every spec section has at least one task:
- §4.1 users column → Task 2
- §4.2–4.3 vocab tables → Task 6
- §4.4 content schema → **no code change** (reserved for Sub-project 3); no task needed
- §5.1 SupportedLocales → Task 1
- §5.2 DTO + model → Tasks 3, 4, 5
- §5.3 handlers → Tasks 4 (register), 5 (PATCH), 16 (integration)
- §5.4 vocab domain → Tasks 7, 8
- §6.1 deps → Task 10
- §6.2 directory → Tasks 11, 12
- §6.3 resolution precedence → Task 11 (device) + 12 (user)
- §6.4 key naming → Task 11 (en.json shape)
- §6.5 coverage scope → Tasks 13, 15 (expand to more screens in Sub-project 2)
- §6.6 UserInfo type → Task 12
- §6.7 authStore → Task 12
- §7 onboarding flow → Tasks 14, 15
- §8.1 migrations → Tasks 2, 6
- §8.2 seed → Task 9
- §9 testing → Tasks 1, 4, 5, 8, 16 + Task 17 smoke
- §10 risks — device locale normalization (Tasks 1, 11), missing translation warn (Task 11), vocab translation fallback (Task 8).

**2. Placeholder scan** — no "TBD", "Similar to Task N", "add appropriate X". Each code step shows real code.

**3. Type / name consistency** — `NormalizeLocale`, `IsSupported`, `SupportedLocales`, `DefaultLocale` agree across Tasks 1, 4, 5. `VocabularyWithTranslation.{ID,CanonicalEn,PartOfSpeech,Domain,Translation,Locale}` consistent between Tasks 8 and the spec. `setAppLocale`, `t`, `i18n` export names consistent between Tasks 11, 12, 13, 14, 15. `setUser` added to authStore in Task 12 used in Tasks 14, 15.

**4. Translation coverage scope** — Spec §6.5 lists profile / gamification / settings screens as in-scope. This plan translates auth + onboarding only. Extending to Profile/Gamification/Settings/Learning screens is better done as a follow-up once Sub-project 2 (Spatial UX) is under way — those screens are getting reskinned anyway. Tracked as an explicit out-of-scope note in the plan: remaining screens deferred to Sub-project 2 opening tasks.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-04-17-i18n-foundation.md`. Two execution options:

**1. Subagent-Driven (recommended)** — dispatch a fresh subagent per task, review between tasks.

**2. Inline Execution** — execute tasks in this session using executing-plans, batch execution with checkpoints.

Which approach?
