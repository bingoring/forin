---
build-spec: curriculum-v2
part: frontend-components
updated: 2026-08-18
---

# 프런트엔드 — 병합된 커리어 탭 (#4)

## §1. 지금의 구조와 문제

```
campus.tsx (470줄)
├ 세그먼트 [커리큘럼] [건물·층]
├ Curriculum()  — 이어하기 히어로 + 챕터 타임라인 + 전체 로드맵 25행
└ Buildings()   — 건물 아코디언 → 층 → 부서 시트
```

- 같은 대상을 두 언어로 두 번 보여준다: 로드맵의 `CH.3`과 층 목록의 `CH.3` 칩.
- 층 목록은 **클라이언트 픽스처**(`data/campus.ts`)에서 오고 서버 `Floors`와 이미 어긋났다(D4).
- 세그먼트를 고르는 일이 첫 행동이 된다 — 홈이 정확히 그 압박을 피하려고 만들어졌는데(`index.tsx:3`)
  커리어 탭은 그대로 남아 있다.

## §2. v2 구조

```
campus.tsx
├ ResumeHero        ← 서버가 Resume=true로 표시한 커리큘럼 하나
└ BuildingList
   └ Building (아코디언, 서버 buildings[])
      └ Floor (행: 층 라벨 + 부서명 + 커리큘럼 진도 점)
         └ Curriculum (행: 이름 + done/total + 상태)
            └ 탭 → StepSheet (BottomSheet — #18에서 만든 것을 재사용)
```

- **세그먼트 삭제. 전체 로드맵 삭제.** 계층이 로드맵이다 (결정 3).
- 층 목록은 **서버 응답**에서 온다. `data/campus.ts`의 `floors` 배열은 삭제하고, 건물의 표시값
  (`icon`/`accent`/`id`)만 **건물명으로 조회하는 맵**으로 남긴다 — 딥링크(엘리베이터·인테리어)가 `id`를
  쓰기 때문이다. 서버에 없는 건물명이 오면 기본 색으로 그린다(빠뜨리지 않는다).
- `CH.N` 칩은 전부 제거 (R16). `DeptSheet`의 `['커리큘럼', 'CH.N']` 타일도 커리큘럼 **이름**으로 바꾼다.

## §3. 상태 표기

| 상태 | 커리큘럼 행 | 근거 |
|---|---|---|
| `done` | 민트 배경 + 체크 | 기존 어휘 유지 |
| `doing` | 종이색 배경 + `3/4` | — |
| `todo` | 흰 배경 + `0/4` | **자물쇠를 그리지 않는다** (R9) — 전부 열려 있다 |
| `Resume` | 노란 테두리 + `NOW` 배지 | 홈의 "오늘의 한 가지"와 같은 대상 |

`todo`에 자물쇠를 그리면 결정 1이 화면에서 거짓이 된다. 지금 코드의 `lock` 분기(회색 + `PixelIcon lock`)는
**커리큘럼 행에서 제거하고 스텝 행에만 남긴다.**

## §4. 파일 분할

`campus.tsx`가 470줄이고 여기서 더 커진다. `Buildings`/`DeptSheet`를 꺼낸다:

| 파일 | 책임 |
|---|---|
| `app/(tabs)/campus.tsx` | 헤더 + ResumeHero + 목록 조립 (약 150줄) |
| `components/campus/FloorList.tsx` | 건물·층·커리큘럼 행 (약 200줄) |
| `components/campus/StepSheet.tsx` | 커리큘럼의 스텝 타임라인 (약 150줄) |
| `components/campus/DeptSheet.tsx` | 기존 부서 상세 시트 이동 (변경 최소) |

## §5. 폰트·아이콘 규율 (기존 커밋 유지)

- 새 텍스트는 전부 `fs()`를 통과한다 (#19, `762bb6a` 이후 규율)
- 이모지를 그리지 않는다 (`762bb6a`). `data/campus.ts`의 건물 `icon: '🏢'`은 `PixelIcon` 이름으로 바꾼다 —
  `EMOJI_ICON` 브리지에 이미 매핑이 있으므로 브리지를 통과시키거나 직접 아이콘 이름을 쓴다
- 커리큘럼 행 탭 → `playSfx('tap')`은 `PixelButton`이 아닌 `Pressable`이므로 **자동으로 안 붙는다.**
  행 탭에는 소리를 붙이지 않는다 — 목록 스크롤 중 오탭이 잦은 표면이다 (#16의 "tap은 가장 자주 울린다" 판단)
