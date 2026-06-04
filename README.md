# forin

해외(우선 미국) 취업을 준비하는 의료 종사자(우선 간호사)를 위한, 픽셀아트 병원을
탐험하며 임상 영어를 연습하는 **모바일 게임형 언어 학습 앱**.

## 모노레포 구조

```
forin/
├── docs/dlc/            # Waypoint 서브모듈 — 프레임워크 + forin 기획 문서
│   └── projects/forin/  # PRD·도메인·아키텍처·운영 (기획 SoT)
├── mobile/              # React Native + Expo 앱
├── server/              # Go API 서버
└── packages/contract/   # openapi.yaml + 생성된 TS 클라이언트
```

## 개발 방식 — Waypoint

기획·개발은 [Waypoint](https://github.com/bingoring/waypoint) 프레임워크로 진행한다.
AI 제안 → 사람 승인 게이트 기반이며, 각 단계는 Markdown 문서가 단일 진실 공급원이다.

- **현재 상태:** [`docs/dlc/projects/forin/STATUS.md`](docs/dlc/projects/forin/STATUS.md)
- **제품 기획:** [`docs/dlc/projects/forin/prd.md`](docs/dlc/projects/forin/prd.md)
- **기술 방향:** [`docs/dlc/projects/forin/prd-tech.md`](docs/dlc/projects/forin/prd-tech.md)
- **디자인 핸드오프:** [`docs/dlc/projects/forin/inputs/design-handoff/`](docs/dlc/projects/forin/inputs/design-handoff/README.md)

> Construction(코드 스캐폴딩)은 Inception 단계가 `HUMAN_APPROVED`된 후 시작한다.
> `mobile/`·`server/`·`packages/contract/`는 그 전까지 비어 있다.

## 셋업

```bash
git clone --recurse-submodules https://github.com/bingoring/forin.git
# 이미 클론했다면:
git submodule update --init --recursive
```

## 기술 스택 (요약)

- **모바일:** React Native + Expo (expo-router, react-native-svg, expo-font, reanimated, Zustand)
- **서버:** Go (프레임워크는 아키텍처 게이트에서 확정)
- **API 계약:** Go-first — swaggo → `openapi.yaml` → `openapi-typescript`

## 히스토리

이전 forin 기획 자산(DB 스키마·API 스펙·기능 명세·콘텐츠)은 `archive/pre-waypoint`
브랜치에 보관되어 있다.
