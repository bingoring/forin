# Build Spec — v49 "홈 v47 풍 맞추기" (2026-10-19)

> 정본 입력: 핸드오프 v49 `inputs/design-handoff_v49/` — 07 문서 "v48 — 홈 v47 풍 맞추기" 절, reference `forin-notebook-v48-{kit,journey,lab,games,profile}.jsx`
> (보기: `forin Notebook - v48.html`). 개정 지시서(`design-brief.md`)에 대한 디자이너 응답이다. **배치는 그대로, 신호만 맞춘다.** 1:1(연출·애니메이션·선택 상태 포함).
> 브랜치 `feat/v49-home-style`(PR #22 `fix/copy-declutter-v47` 위에 쌓음).

## §1 범위
| 묶음 | reference | 앱 대상 |
|---|---|---|
| T0 정리(사용자 결정 2026-10-19) | — | 입구 없는 화면 삭제(상황판·루트·나이트·내부/엘리베이터 라우트·온보딩 옛 lang/job 페이지), 나 › 공개 섹션 숨김(값·키 보존) |
| T1 신호 키트 | v48-kit.jsx (`window.V48`) | `components/nb/V48.tsx`(새) + `nbMotion` 키프레임 |
| T2 일터 | v48-journey.jsx (G·E·H·I) | `components/journey/BinderShelf·BuildingTabs·DeptBinder·StationTrack`, `app/(tabs)/journey/**` |
| T3 리뷰랩 | v48-lab.jsx (LabNotes·LabSpeak·LabModel) | `app/(tabs)/lab.tsx`, `components/lab/**`, `components/speak/SpeakList`, `components/model/ModelAnswerList`, `app/review.tsx`(등급 버튼) |
| T4 휴게실 | v48-games.jsx (GameHub·CircleGame·BasketGame·SlangDeck·HandoffNotes) | `app/games/{index,circle,hoops}.tsx`, `app/slang`, `app/handoff` — 앱에 없는 게임(종이비행기·달리기)은 Locked 칩만 |
| T5 나 | v48-profile.jsx | `app/(tabs)/me.tsx`, `components/me/**` |

## §2 키트 대응 (T1) — 새로 짓지 말고 기존 것을 뽑아 쓴다
| V48 | 뜻 | 앱에서 가져올 것 |
|---|---|---|
| `Go`(노란 ▶ 원 + 숨 쉬는 후광 `.v48-go`) | 지금 할 것 | `components/home/HomeCal.tsx` '이어서' 바의 ▶ 원·후광 애니메이션 |
| `GoBar`(잉크 바 + 노란 ▶) | 화면당 하나 | HomeCal '이어서' 바 자체 |
| `Ring`(노란 링, r21·4.5) | 진행 중 | HomeCal 진행 링 |
| `Done`(2.5px double 초록 + 체크, 1.15→1 `v48-stamp`) | 끝냈다 | NbUI 도장(이중선) + 새 stamp 키프레임 |
| `Locked`(1.6 dashed 원 + 자물쇠, opacity .55) | 아직 못 한다 | 새로(NbIcon `lock` 있음) |
| `IconDot`(1.7 테두리 원, ±3~6°) | 아이콘 원 | 새로 |
| `NewDot`(빨간 숫자 원, `v48-wiggle` 1회 .4s 지연) | 새로 온 것 | MaterialShelf 배지 + wiggle |
| `Pill`(아이콘 + Gaegu 19 숫자) | 수치 | 홈 불꽃 알약 |
| `Chev`(⌄, 펼치면 180°) | 펼침 | NbIcon `chevronDown` |
| `.v48-press`(눌리면 +2,+3·-1°) / `.v48-lift`(-3px·-2°) / `.v48-pop` / `.v48-tap` | 누를 수 있다·들림·톡·손가락 | `.nb-press`(nbMotion) 값 맞춤 + 새 키프레임 |
- 키프레임(`v48-breathe·pop·stamp·wiggle·tap`)은 `nbMotion`에 넣고 **참조 CSS를 직접 대조하는 기존 테스트(nbMotion.test)를 늘린다.** 반복 애니메이션은 `isReduceMotionEnabled`면 멈춘다(Wave와 같은 방식).
- 아이콘: v48 파일이 쓰는 이름 중 NbIcon에 없는 것은 `run`뿐(게임 타일). 키트 단계에서 추가. 리뷰랩 등급 얼굴은 v48-lab `Face` 컴포넌트(자체 SVG) — T3에서 그대로 옮김.

## §3 화면별 변화 (07 문서 그대로)
- **T2 일터** G: 내 부서 '이어서' → Go 원, '내 부서' 태그 삭제, 목표 바꾸기 → 연필 IconDot, 바인더 lift, 패널 보조 요약 삭제. E: 주제 메타 줄 삭제, 범례 → 숫자 없는 색 칩 3 + d/t, 진행 주제 = Ring + Go(진행중 태그 삭제), 완료 = Done, 잠김 = Locked, 다음 = › 원. H: 진행 태그·'실 n번째' 삭제, 지금 우표 후광, 하단 카드 → GoBar. I(날아오기) 유지.
- **T3 리뷰랩** 헤더 보조 카운트 삭제, 히어로 → GoBar(왼쪽 '오늘 n장' 빨간 도장), MiniStat 3칸 → Pill 2(📒 저장 · ⭐ 마스터) — **'복습 대기'가 저장과 같은 값(`cards.length`)인 버그는 원인을 고친다**(저장 = 실제 총 카드 수 소스 확인), 카드 맥락 = 출처 줄 끝 Chev, 숙련 점 채움 stamp, 듣기/말하기 = 파랑/잉크 원, 등급 4버튼 = 얼굴 글리프(찡그림·보통·웃음·신남) + 모노 간격, 누르면 카드가 그 방향으로 기울며 넘어감, 선반 배지 wiggle. 말하기·모범답안 탭도 v48-lab의 LabSpeak·LabModel대로.
- **T4 휴게실** 행 → 2×2 타일(큰 아이콘 원 기울임 + 🏆 최고점 모노 + Go), 오늘 남은 판 = 노란 점 m개 중 n, 준비 중(종이비행기·펜 뚜껑) = Locked 칩, 랭킹 도전 = 페이저 원(서버 랭킹 없음 — 그리지 않거나 Locked; 앱 판단 시 묻기). 원·농구·은어 도감·인계 노트는 v48-games의 해당 함수와 지금 앱을 대조해 바뀐 것만.
- **T5 나** 아바타 = 홈 같은 원(2px), 연속 = 불꽃 Pill, LV 칩 중복 삭제(게이지 하나), 성장 리포트 행 = IconDot + 제목 + ›(보조줄 삭제), 동료 빈 상태 = 점선 원 + 한 줄, 추가 = 노란 + 원, 칭호·히든 미션 = 같은 원 격자(얻음 Done+아이콘 / 잠김 Locked), 설정 행 = IconDot + 제목 + 값, 효과음 = 🔊/🔇 Pill.

## §4 진행 방식
T0 → T1(키트·아이콘·모션, 단독) → T2·T3·T4·T5 병렬(각자 파일 범위, i18n은 자기 접두어만 — 겹치면 부르는 쪽이 합침) → 시뮬레이터 대조 → PR.

## §5 검증
tsc 0 · jest 전체 · nbMotion 참조 대조 테스트 · 화면마다 시뮬레이터 스크린샷을 reference 아트보드와 나란히(보고서) · reduce-motion에서 반복 애니메이션 정지.

## §6 결정 기록
- (사용자 2026-10-19) 입구 없는 화면 삭제, 라이브 병동 공개 섹션 숨김 — 살리면 git 기록에서.
- 엔진(`src/map/**` 등)은 이번에 지우지 않음 — 고아 크기만 보고, 삭제는 따로.
