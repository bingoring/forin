# i18n Foundation — Design Spec

- **ID**: Sub-project 1 of 3 in the redesign initiative
- **Date**: 2026-04-17
- **Author**: forin team
- **Status**: Approved design, pending implementation plan
- **Master plan**: see [2026-04-17-redesign-master-plan.md](./2026-04-17-redesign-master-plan.md)

## 1. Purpose

Introduce locale-aware infrastructure across the user record, content domain, and mobile UI so that:

1. Each user carries a `native_language` value.
2. The UI chrome (buttons, menus, errors, onboarding, gamification labels) can be rendered in the user's native language.
3. A new **vocabulary domain** with per-locale translations exists in the database, enabling the upcoming synonym-matching exercise type (Sub-project 3) and future vocabulary features.

The English-only exercise content itself (scenario dialogues, sentence prompts) is intentionally **not** translated — the product's purpose is workplace English learning.

## 2. Non-goals

The following are explicitly out of scope for this sub-project:

- Profile-screen UI to change `native_language` after onboarding (only one supported language at launch).
- A separate `nationality` field independent of language.
- Vocabulary mastery tracking / SRS / flashcard features.
- Translation of `exercises.content` dialogues, scenarios, or prompts.
- Admin UI for managing vocabulary — seed scripts + SQL only.
- Multi-locale Profession / Country display names (handled by the UI layer's `t()` function using English canonical values as keys).

## 3. Scope decisions (traceability)

| # | Decision | Chosen |
|---|---|---|
| Q1 | Translation scope | **B** — UI strings + synonym-pair vocabulary. Exercise prose stays English. |
| Q2 | Launch language set | **A** — Korean (`ko`) only at MVP; schema supports N. |
| Q3 | Native language capture point | **A** — New onboarding step `LanguageSelect` before profession selection. |
| Q4 | Vocabulary data model | **B** — Dedicated `vocabulary` + `vocabulary_translations` tables. |
| Q5 | UI i18n stack | **A** — `i18n-js` + `expo-localization`, English canonical keys, locale fallback chain. |

## 4. Data model changes

### 4.1 `users` — add column

```sql
ALTER TABLE users
  ADD COLUMN native_language VARCHAR(8) NOT NULL DEFAULT 'ko';
```

- BCP-47 locale code.
- No database `CHECK` constraint; the allowed set lives in the Go layer (`internal/config/locales.go`) so adding a new language is a code-only change.

### 4.2 New table — `vocabulary`

```sql
CREATE TABLE vocabulary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  canonical_en TEXT NOT NULL,
  part_of_speech TEXT NOT NULL,   -- 'noun' | 'verb' | 'adjective' | 'phrase'
  domain TEXT NOT NULL,           -- 'symptom' | 'equipment' | 'procedure' | 'medication' | 'anatomy'
  cefr_level TEXT,                -- 'A2' | 'B1' | 'B2' | 'C1' (nullable)
  note TEXT,                      -- internal memo; never shown to users
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_vocab_domain ON vocabulary(domain);
CREATE UNIQUE INDEX idx_vocab_canonical ON vocabulary(canonical_en);
```

### 4.3 New table — `vocabulary_translations`

```sql
CREATE TABLE vocabulary_translations (
  vocab_id UUID NOT NULL REFERENCES vocabulary(id) ON DELETE CASCADE,
  locale VARCHAR(8) NOT NULL,
  word TEXT NOT NULL,
  note TEXT,
  PRIMARY KEY (vocab_id, locale)
);

CREATE INDEX idx_vocab_translation_locale ON vocabulary_translations(locale);
```

### 4.4 `exercises.content` — new sub-schema (reserved for Sub-project 3)

No schema change. The existing JSONB column will host the new `synonym_match` type whose payload references `vocabulary.id`:

```jsonc
{
  "type": "synonym_match",
  "direction": "native_to_target",  // or 'target_to_native'
  "pairs": ["<vocab-uuid>", "<vocab-uuid>", ...]
}
```

Existing exercise types (`sentence_arrangement`, `word_puzzle`, `meaning_match`, `conversation`) are untouched.

## 5. Backend (Go / Gin)

### 5.1 Config — allowed locales

New file `internal/config/locales.go`:

```go
var SupportedLocales = []string{"ko"}
var DefaultLocale = "ko"

// IsSupported returns whether a BCP-47 locale is enabled for this build.
func IsSupported(locale string) bool { ... }
```

Adding a language later means appending to this slice + seeding translations.

### 5.2 DTO / model changes

- `internal/model/user.go`: add `NativeLanguage string` (GORM column `native_language`, default `"ko"`).
- `internal/dto/auth.go::RegisterRequest`: add optional `NativeLanguage` with validator `omitempty,oneof=ko`. Defaulted to `"ko"` on empty.
- `internal/dto/user.go::UserResponse`: expose `native_language`.

### 5.3 Handlers

- `POST /v1/auth/register`: accepts `native_language`; falls back to `DefaultLocale` when absent.
- `GET /v1/users/me`: returns `native_language`.
- `PATCH /v1/users/me`: validates against `SupportedLocales` before update (rejects unsupported values with 422 `VALIDATION_ERROR`).

No new routes.

### 5.4 New domain — vocabulary

- `internal/model/vocabulary.go`: `Vocabulary` and `VocabularyTranslation` GORM models.
- `internal/repository/vocabulary_repo.go`: `GetByIDsWithTranslation(ctx, ids []uuid.UUID, locale string) ([]VocabularyWithTranslation, error)` — joins translation of the requested locale, falling back to canonical English if the locale row is missing (graceful degradation).
- Service/handler layer is **deferred to Sub-project 3**; the repo is the only runtime dependency added here.

## 6. Mobile (React Native / Expo)

### 6.1 Dependencies

Add:
- `i18n-js` (translation runtime)
- `expo-localization` (device-locale detection)

### 6.2 Directory layout

```
mobile/src/
├── locales/
│   ├── en.json         # canonical source; every key lives here first
│   ├── ko.json         # Korean translations
│   └── index.ts        # i18n-js init, `t()` export, locale switching
├── hooks/
│   └── useLocale.ts    # subscribes to authStore.user.native_language;
│                       # sets i18n.locale; returns current locale
```

### 6.3 Locale resolution (runtime precedence)

1. `authStore.user.native_language` (DB value; after login / registration)
2. `expo-localization.locale` (pre-login, anonymous state)
3. `"en"` (hard fallback)

Missing keys resolve against `en.json`; in `__DEV__`, emit `console.warn` once per missing key.

### 6.4 Key naming convention

`screen.section.element` — e.g., `auth.register.title`, `errors.networkUnavailable`, `gamification.xpLabel`. Keys are authored in `en.json` first; `ko.json` mirrors the shape.

### 6.5 Translation coverage

| Translated | Not translated |
|---|---|
| Navigation labels, button text, headings | Exercise dialogue / scenario prose |
| Onboarding copy & validation messages | Exercise word tiles (target language artifacts) |
| Error toasts and network-failure messages | |
| Gamification terms ("하트", "경험치", "스트릭") | |
| Shop / achievement / inventory names | |
| Settings screen labels and section titles | |

### 6.6 Types

```ts
// mobile/src/types/api.ts
export interface UserInfo {
  id: string;
  email: string;
  display_name: string;
  native_language: string;   // NEW — BCP-47
  current_level: number;
  current_xp: number;
  // ...
}
```

### 6.7 Auth store

`stores/authStore.ts` persists the received `native_language` in state; `useLocale` reacts by setting `i18n.locale`.

## 7. Onboarding flow

### 7.1 Flow change

Before: `Register → ProfessionSelect → CountrySelect → Assessment`

After: `Register → **LanguageSelect** → ProfessionSelect → CountrySelect → Assessment`

### 7.2 `LanguageSelectScreen` — new screen

- Title and subtitle displayed using `t()`, initially rendered in the device's pre-login locale (from `expo-localization`).
- Option list:
  - **한국어** — enabled, default-highlighted when device locale matches `ko*`.
  - English / Tiếng Việt / Filipino / 日本語 / 中文 — shown as greyed-out cards with a "Coming soon" badge, non-tappable.
- Selecting Korean triggers `PATCH /v1/users/me { native_language: "ko" }`, advances to `ProfessionSelect`.
- The screen exists even though MVP has one choice, because it establishes the per-user selection pattern and avoids a schema-UX mismatch later.

## 8. Migrations & seed

### 8.1 New migrations (server/migrations/)

1. `<seq>_add_native_language_to_users.up.sql`
2. `<seq>_create_vocabulary.up.sql`
3. `<seq>_create_vocabulary_translations.up.sql`

Each gets a matching `.down.sql`. Sequence numbers allocated at implementation time using the existing numbering pattern.

### 8.2 Seed data

`server/scripts/seed.go` extension:
- Insert **~50 medical vocabulary entries** commonly used in nurse–patient interactions (pain, wound, nausea, prescription, IV line, vital signs, discharge, pulse, …).
- Each entry includes its `ko` translation.
- Idempotent via `ON CONFLICT DO NOTHING` on `vocabulary.canonical_en` and on the `(vocab_id, locale)` primary key.
- The actual **authoring** of the 50-entry list is handled during implementation and may evolve in Sub-project 3; the seed wiring itself ships here.

## 9. Testing

- **Unit** — new `locales.IsSupported`; register/user handler defaults; vocabulary repo fallback to canonical English when translation missing.
- **Integration** — `/v1/auth/register` returns `native_language=ko` by default and accepts an explicit value; `PATCH /v1/users/me` rejects `native_language="de"` with 422.
- **Mobile** — smoke-test: onboarding shows `LanguageSelectScreen`; switching the device locale changes pre-login UI; selecting Korean persists to the backend.

## 10. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Missing translation key silently falls back and regresses UX | `__DEV__` warns on unknown keys; CI can lint `ko.json` for parity with `en.json` (phase-2 add-on). |
| Device locale string format variants (`ko`, `ko-KR`, `ko_KR`) | `useLocale` normalizes to 2-letter primary tag before lookup. |
| `vocabulary_translations` row missing for a user's locale | `GetByIDsWithTranslation` falls back to `canonical_en`; the synonym exercise UI in Sub-project 3 treats that case explicitly. |
| Onboarding step adds friction with only one choice | Page is short, single-tap; future value (explicit per-user preference) justifies keeping it. |

## 11. Implementation checklist (preview)

A full implementation plan is written separately via the `writing-plans` skill. High-level sequence:

1. Add `SupportedLocales` config + `native_language` column.
2. Create `vocabulary` + `vocabulary_translations` tables and GORM models.
3. Wire `RegisterRequest` / `UserResponse` to carry `native_language`.
4. Add `i18n-js` + `expo-localization`; author `en.json` / `ko.json` for existing screens.
5. Add `LanguageSelectScreen` and thread it into the onboarding navigator.
6. Seed 50 vocabulary entries with `ko` translations.
7. Tests (unit + integration + mobile smoke).
