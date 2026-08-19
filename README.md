# forin

해외(우선 미국) 취업을 준비하는 의료 종사자(우선 간호사)를 위한, 픽셀아트 병원을
탐험하며 임상 영어를 연습하는 **모바일 게임형 언어 학습 앱**.

교재를 읽는 앱이 아니다. 병동을 걸어 들어가 환자·동료와 **AI 역할극으로 실제 대화**하고,
말한 문장을 발음 채점받고, 틀린 표현이 자동으로 복습 카드가 되어 돌아온다.

**현재 상태:** iOS TestFlight 내부 배포 중 (build 2, 2026-08-19). 서버는 Cloud Run prod 가동.
자세한 진행 상황은 [`STATUS.md`](docs/dlc/projects/forin/STATUS.md).

## 무엇이 들어 있나

| | 규모 |
|---|---|
| 병원 | 5개 건물 · **24개 층** · 걸어 다닐 수 있는 부서 인테리어 **27곳** |
| 학습 경로 | 층별 테마 **커리큘럼 89개** (부서당 3~4개, 주제 290개를 전부 사용) |
| 콘텐츠 | 시나리오 **3,203편** · 퀴즈 **993개** (29개 부서 뱅크에서 생성 + 손저작 57편) |
| 화면 | 24개 라우트 · 퀴즈 유형 14종 |
| 언어 | UI 4개 언어(한국어·English·日本語·Deutsch), 미번역은 한국어로 폴백 |
| 서버 | Go · 라우트 59개 · 마이그레이션 23개 |
| 검증 | 모바일 **298** 테스트 · 서버 20 패키지 · 스테이징 E2E 스모크 **98 단정** |

### 학습 루프

```
홈: 오늘의 한 가지  →  브리핑  →  AI 역할극 대화  →  교정  →  클리어(XP·평판)
                                      ↓                 ↓
                                 발음 채점        복습 카드(SM-2)
                                (음절·음소)         → 리뷰랩
```

- **AI 역할극** — 시나리오의 페르소나(이름·나이·기분·말투)로 LLM이 환자를 연기한다.
  학습자의 모국어와 목표 언어가 프롬프트에 들어가므로 교정 설명은 모국어로, 대화는 목표 언어로.
- **발음** — Azure Speech Pronunciation Assessment(음절·음소 단위 + 억양). 원어민 참조 음성은
  TTS로 만들어 캐시하고, 환자 대사는 역할·성별·연령대에 맞는 목소리로 읽어준다.
- **복습** — 대화 중 AI가 교정한 문장이 SM-2 간격 반복 카드로 자동 등록된다.

## 모노레포 구조

```
forin/
├── docs/dlc/            # Waypoint 서브모듈 — 프레임워크 + forin 기획 문서
│   └── projects/forin/  # PRD·도메인·아키텍처·운영 (기획 SoT)
├── mobile/              # React Native + Expo 앱
├── server/              # Go API 서버
├── packages/contract/   # openapi.yaml + 생성된 TS 클라이언트
└── infra/               # Terraform (GCP)
```

## 기술 스택

- **모바일** — React Native + Expo SDK 56 (expo-router, react-native-svg, reanimated, Zustand,
  expo-audio, expo-camera). 캐릭터·타일맵·UI 전부 SVG 픽셀아트로 직접 그린다.
- **서버** — Go, 표준 `net/http`, 헥사고날 ports/adapters. Postgres(pgx + **sqlc**),
  마이그레이션은 golang-migrate를 바이너리에 임베드.
- **AI** — OpenAI(대화·교정·채점), Azure Speech(발음 평가·TTS).
- **인프라** — GCP Cloud Run + Cloud SQL + Secret Manager, 전부 Terraform.
- **API 계약** — Go-first: swaggo → `openapi.yaml` → `openapi-typescript`. CI가 드리프트를 막는다.

## 개발 방식 — Waypoint

기획·개발은 [Waypoint](https://github.com/bingoring/waypoint) 프레임워크로 진행한다.
AI 제안 → 사람 승인 게이트 기반이며, 각 단계는 Markdown 문서가 단일 진실 공급원이다.

- **현재 상태:** [`STATUS.md`](docs/dlc/projects/forin/STATUS.md)
- **결정 로그(감사 추적):** [`DECISIONS.md`](docs/dlc/projects/forin/DECISIONS.md) — 결정마다 근거와
  **탈락한 대안**, 미검증 항목을 남긴다
- **제품 기획:** [`prd.md`](docs/dlc/projects/forin/prd.md) · **기술 방향:** [`prd-tech.md`](docs/dlc/projects/forin/prd-tech.md)
- **구현 스펙(Build Spec):** 구현이 무거운 단계는 코딩 전에 스펙을 쓴다 —
  [발음](docs/dlc/projects/forin/02-construction/pronunciation/build-spec-index.md) ·
  [커리큘럼 v2](docs/dlc/projects/forin/02-construction/curriculum-v2/build-spec-index.md) ·
  [다국어](docs/dlc/projects/forin/02-construction/i18n/build-spec-index.md)

## 셋업

```bash
git clone --recurse-submodules https://github.com/bingoring/forin.git
# 이미 클론했다면:
git submodule update --init --recursive
```

### 서버

```bash
cd server
docker compose up -d          # postgres + redis
make migrate-embed            # 프로덕션과 같은 코드 경로로 마이그레이션
make seed                     # content/ 검증 + 적재 (참조 무결성 가드 포함)
make run                      # :8080
```

`make test` · `make vet` · `make sqlc` (쿼리 생성) · `make contract` (openapi + TS 타입 재생성).

### 모바일

```bash
cd mobile
npm install
npx expo start                # Expo Go 또는 dev client
npm test && npx tsc --noEmit
```

### 콘텐츠·번역 도구

```bash
cd mobile
python3 scripts/i18n-matrix.py   # 번역표 HTML 생성 (언어 × 문자열, 브라우저에서 편집·내보내기)
python3 scripts/gen-sfx.py       # 효과음 6종 WAV 생성 (칩튠, 재현 가능)
cd ../server
go run ./cmd/gencontent          # 주제 뱅크 → 시나리오·퀴즈·이벤트 생성
```

## 배포

`master`에 서버 변경이 푸시되면 **스테이징까지 자동**(빌드 → 마이그레이션 → 배포 → E2E 스모크).
프로덕션은 **사람이 승인해야만** 나간다.

```
push → deploy.yml (staging + 스모크) → staging-verified-<sha> 태그
                                            ↓
                        promote.yml (workflow_dispatch + 승인 게이트)
                        → 마이그레이션 → 무트래픽 배포 → 후보 검증 → 트래픽 전환
```

`promote.yml`은 `workflow_dispatch` 트리거만 갖고, `staging-verified-<sha>` 태그가 붙은 SHA만
받는다. 스모크를 통과하지 않은 커밋은 배포할 이미지 자체가 없다.

모바일은 JS만 바뀌면 OTA(`ota.yml`), 네이티브 모듈이 바뀌면 EAS 빌드 + 제출.

## 히스토리

이전 forin 기획 자산(DB 스키마·API 스펙·기능 명세·콘텐츠)은 `archive/pre-waypoint`
브랜치에 보관되어 있다.
