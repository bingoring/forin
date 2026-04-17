# forin — 서비스 문서 인덱스

직장인 대상 직업 특화 언어 학습 앱 **forin**의 스펙 및 기획 문서.

---

## 문서 목록

| 번호 | 문서 | 내용 |
|------|------|------|
| 01 | [서비스 개요 및 비전](./01_service_overview.md) | 미션, 문제 정의, 경쟁 분석, 성공 지표 |
| 02 | [사용자 페르소나](./02_user_personas.md) | 간호사/의사/약사 페르소나, 사용자 여정 맵 |
| 03 | [핵심 기능 상세 스펙](./03_feature_spec.md) | 온보딩, 4가지 문제 유형, 게임화, 알림 |
| 04 | [커리큘럼 콘텐츠 구조](./04_content_architecture.md) | 간호사(호주) 커리큘럼 전체, 스테이지 예시 |
| 05 | [기술 아키텍처](./05_technical_architecture.md) | 시스템 구성, NestJS 모듈, React Native 선택 근거 |
| 06 | [데이터베이스 스키마](./06_database_schema.md) | PostgreSQL ERD, 전체 테이블 DDL, JSONB 스키마 |
| 07 | [REST API 명세](./07_api_spec.md) | 전체 엔드포인트, 요청/응답 예시 |
| 08 | [사용자 플로우](./08_user_flows.md) | 온보딩, 학습, 보상, 레벨업 ASCII 플로우 |
| 09 | [개발 로드맵](./09_development_roadmap.md) | 10주 MVP 일정, Phase 2/3 계획, 리스크 |

## 운영/개발 런북

| 문서 | 내용 |
|------|------|
| [runbooks/](./runbooks/README.md) | 개발 중 마주친 이슈의 진단 절차와 재발 방지 가이드 |

---

## 핵심 결정 사항

| 항목 | 결정 | 근거 |
|------|------|------|
| 모바일 | React Native (Expo) | 단일 코드베이스, OTA 업데이트 |
| 백엔드 | Go + Gin + GORM | 고성능, 낮은 리소스 사용량, goroutine 기반 동시성, 서비스 규모 확장 시 gRPC 마이크로서비스로 점진 분리 |
| DB | PostgreSQL 16+ | JSONB 지원 (문제 콘텐츠 유연성), 성숙한 생태계 |
| 마이그레이션 | golang-migrate (SQL 파일) | 명시적 SQL 관리, 롤백 지원 |
| AI 채점 | Claude API + anthropic-sdk-go (폴백: 키워드 매칭) | 대화 연습 채점 품질 |
| 1차 타겟 | 간호사 / 호주 영어 | 최다 해외 취업 수요, 명확한 페인포인트 |

---

## MVP 핵심 숫자

- **10주** 개발 기간 (Foundation → QA)
- **20개** 스테이지 (Module 1 + 2, 간호사/호주)
- **4가지** 문제 유형
- **20개** 고양이 아이템 (3슬롯)
- **5개** 기본 업적
