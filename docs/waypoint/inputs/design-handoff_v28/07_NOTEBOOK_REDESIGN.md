# 07 — forin Notebook 리디자인 (근무 수첩 그림체)

> 2026-09 확정: 사용자 만족도 비교용 **디자인 개편 라인**. 기존 픽셀 라인과 병행.
> 후보 탐색(카툰CN풍·클레이·에디토리얼·레트로OS) 끝에 **"간호사 근무 수첩(스크랩북)"** 방향 채택.
> 카툰 라인(forin Cartoon - Home.html / forin-cartoon.jsx)은 보조 후보로 보관.

## 그림체 규칙 (NB 토큰)
- 배경: 크림 종이 #F1EBDD + 줄노트(27px 반복 라인) / 카드 종이 #FFFdf4 + 1px #E0D6C0 테두리 + 부드러운 그림자
- 잉크 #3E362B · 보조 #9A8F7C · 빨강 #C75146 · 파랑 #4A6FA5 · 초록 #5F8D5A
- 폰트: 손글씨 Gaegu(제목·라벨) + Pretendard(본문) + IBM Plex Mono(코드·시각·IPA)
- 소품 문법: 마스킹테이프(하늘색 반투명) · 이중선 원형 도장(통과/근무중/연속출근) · 빨간펜 취소선 → 화살표 교정 · 형광펜 mark(투명 55%→#F9E37B) · 점선 메모 박스 · 카드 ±0.3~0.8° 기울임 · 비스듬한 입체 압정(라운지)
- 아이콘: **NbIcon** (forin-notebook.jsx, 24×24 펜 낙서 — 1.7px 스트로크 + 옅은 수채 필). UI 이모지 금지(사용자 콘텐츠 제외).
  보유: home hospital board lab me mic speaker siren scalpel baby monitor pill bandage bell star pencil magnify bulb trophy speech compass chartup shield handshake2 pushpin lock
- 폰 프레임: 402×874, boxSizing border-box, 하단 탭 5개(홈·일터·라운지·리뷰랩·나)

## 워딩 확정
- 캠퍼스/커리어 탭 → **일터** (직업군 확장 대응)
- 상황판 탭 → **라운지** (스태프 라운지 커뮤니티로 개편)

## 화면 인벤토리 (파일 → 아트보드)
| 페이지 | 컴포넌트 파일 | 아트보드 |
|---|---|---|
| forin Notebook - Home.html | forin-notebook.jsx + forin-notebook-career.jsx | A 홈(HomeScrapbook) · B 일터 목록(CareerScrapbook) · C 층 바텀시트(FloorSheetScrapbook) · D 상황 준비(BriefingScrapbook) |
| forin Notebook - Dialogue.html | forin-notebook-dialogue.jsx | A 직접 말하기(DialogueSpeak) · B 보기 중 선택(DialogueOptions) |
| forin Notebook - Review Lab.html | forin-notebook-lab.jsx | A 교정 노트(LabNotes) · B 말하기(LabSpeak) · C 모범답안(LabModel) |
| forin Notebook - Profile.html | forin-notebook-profile.jsx | A 프로필(ProfileScrapbook) · B 성장 리포트(GrowthScrapbook) · C 동료 추가(ColleagueAddScrapbook) |
| forin Notebook - Pronunciation.html | forin-notebook-pron.jsx | A 대기(PronReady) · B 녹음중(PronRecording) · C 채점(PronScore) |
| forin Notebook - Lounge.html | forin-notebook-lounge.jsx | A 피드(LoungeFeed) · B 대화 공유 작성(LoungeShare) · C 상대 프로필(LoungeProfile) |

## 화면별 핵심 결정
- **홈**: 오늘의 할 일(테이프 종이) · 호출 쪽지(!! 점선) · 과별 출근 카드 · 오늘의 문장(형광펜) · 연속출근 도장.
- **일터**: 실구현 구조 이식 — 검색 밑줄 → ★즐겨찾기 쪽지 → 건물 아코디언(층 행: 잉크 층스탬프 + 진행 네모칸 + 별) → 탐험 모드 점선 버튼. 층 탭 → **바텀시트**: 스탯 2칩 + 이 층의 커리큘럼(완료=취소선·통과 / 진행=노란 테두리 + 스텝: 대화speech·퀴즈pencil·시험trophy, ✓/다시/lock) + 커리큘럼 밖 상황(완료=복습 / 긴급=빨간 쪽지 시작!).
- **상황 준비**: 폴라로이드 초상 + 위치/레벨 태그 + 감정 메모(빨간 점선) + 미션 ☐ 4 + 보상/커리큘럼 좌표 + 잉크 CTA + 보기모드 링크.
- **대화**: 초상화 무대(테이프 폴라로이드 + 이름 스탬프[nowrap 필수] + 감정 태그) / 영역 조절 grabber 3곳(무대·메시지·옵션) / QUICK INFO 칩 / 직접 말하기(SPEAK FREELY 모노 라벨 + 마이크 종이함) vs 보기 선택(옵션 카드 + 노란 말하기 탭 + 접기 + 직접 입력 링크).
- **리뷰랩**: **견출지(인덱스 스티커) 탭** 3분할이 최상단 — 비활성 = 파스텔 견출지(핑크/블루/그린)가 살짝 기울어져 뒤에 꽂힘, 활성 = 종이색으로 크게 앞으로 나와 본문과 경계선 없이 이어짐 + 탭 위 테이프 조각. (NbUI.NbIndexTabs 동일 스타일) 교정 카드 = 맥락 ✎ → 빨간펜 취소선 → → 형광펜 교정 + 듣기 → 왜?(파란 점선) → 숙련 점 3 → SRS 4버튼(다시<1분/어려움10분/알맞음1일/쉬움4일).
- **프로필**: 사원증(이름 밑줄 필기란 + RANK 타자체 + 빗금 연필 레벨 게이지) · CAREER PATH(체크→HERE) · 칭호 4열(잠김 ??? 반투명, 장착=보라 테두리+태그) · 히든 미션 · 설정(잉크 토글). **성장 리포트**: 근무대 달력(데이/이브닝/나이트 색만, 셀 이모지 금지) + 선택일 상세 + 4스탯(시나리오·새표현·대화시간·레벨). 스티커보드·연속스트립 **삭제 확정**.
- **동료 추가**: 그린 코드 쪽지(대형 타자체 코드 + 복사/공유) + "또는" 점선 + 받은 코드 필기란(노란 포커스) + 비활성 요청 버튼 + 안내 메모.
- **발음**: 문장 카드(IPA 타자체 + 지난 약점 음소 형광 표시 + 원어민 칩 + 회차) → 주의 메모 → 원형 낙서 녹음 버튼("꾹!") → 회차 점수(빗금 게이지 + 상승 코멘트). 녹음중 = 다크 잉크 배경 + 밝은 문장 쪽지 + REC 파형 + 기울어진 형광 눈금. 채점 = 총점/3지표 → 음절 스탬프 칩(좋아요그린/애매옐로/다시핑크) → 속도 비교 다크 패널 → 교정 포인트(음소 스탬프 + 팁 + 듣기) → 다시 녹음/다음 문장 + 드릴 예고.
- **라운지(상황판 개편)**: 코르크보드 은유 — 모든 피드 카드에 **비스듬한 입체 압정**(색·위치 랜덤). 글 3종: AI 대화 공유(출처 헤더 + "연속 N턴" + 말풍선 스니펫), 현지 근무자 글(그린 뱃지), 질문 글. 대화 공유 작성: **연속 턴만 선택 가능**(건너뛰면 ✕ 잠김) + 최대 6턴 + 한마디/태그. 상대 프로필 시트: 현지 근무중 뱃지 + 스탯 + 최근 글 + 동료 요청(handshake2)/응원 — 멘토·멘티 확장 진입점.

## 알려진 규칙(재발 방지)
- 모든 pill/라벨/스탯 텍스트에 whiteSpace:'nowrap' (한글 임의 줄바꿈 방지).
- 폰 프레임 boxSizing:'border-box' 필수.
- NbIcon에 없는 이름은 별(star)로 폴백됨 — 새 아이콘 쓰기 전 반드시 세트에 추가.
- design-canvas.jsx: 가벼운 페이지는 DCArtboard eager={true}로 즉시 마운트(스로틀 환경 레이지 마운트 실패 대응).

## NbUI 공용 컴포넌트 킷 (forin-notebook-ui.jsx · window.NbUI)
중복되던 소품을 컴포넌트화. 모든 버튼·칩은 **누름 인터랙션 내장**(.nb-press: 눌리면 1.5~2px 가라앉고 그림자 소멸 / .nb-chip: scale .94).
- NbFrame(폰 프레임+하단 탭, dark 지원) · NbPaper(rot/tape/pinned) · NbTape · NbPin(입체 압정)
- NbButton(variant: ink/paper/yellow/dashed/danger · size sm/md/lg · icon) · NbChip(필터 토글) · NbTag(필)
- NbInkStamp(층표) · NbStamp(이중선 원형 도장) · NbMark(형광펜) · NbMemo(점선 메모)
- NbGauge(빗금 연필 게이지) · NbCheck(체크박스) · NbProgSquares(진행 네모칸) · NbSearchLine · NbIndexTabs(견출지 스타일) · NbGrabber
- 카탈로그: forin Notebook - Home.html → "Z · NbUI 컴포넌트 킷" 아트보드 (직접 눌러볼 수 있음)
- 마이그레이션 방침: 기존 화면은 렌더 결과 동일하므로 그대로 두고, **신규/수정 화면부터 NbUI 사용**.

## 온보딩 인터랙티브 플로우 스펙 (forin-notebook-onboarding-flow.jsx · OnbFlow)
여정: 표지(여권) → 직업 → 목적지 → 여권 닫힘 → 비행 → 입국심사 → 입국 승인 → 출근 스플래시 → (루프)
- **여권 표지**: 딥그린 #2E4636 + 금색 이중 테두리 · "PASSPORT / forin" · 금장 이중원 엠블럼 안 손글씨 **f** · 하단 MRZ 2줄.
- **페이지 넘김(CurlOut)**: 24관절 중첩 3D 컬 — 베이스 회전(-128°, 끝까지 넘어가며 말미 페이드)과 관절 컬(48% 시점 최대 곡면 → 38%로 풀림) 2단 합성. 슬라이스 균일 명도 오버레이(인접 차 ~1%)로 줄무늬 없음, 오른쪽 끝부터 들림(관절당 4.5ms 딜레이), 1.25s. 다음 장 위로 그림자 스윕(nb-sweep).
- **목적지**: 카드 선택은 하이라이트만(자유 변경). **출국하기를 누르면** 옵션-버튼 사이 공간에 ADMITTED {나라} 도장이 쾅(nb-stamp) → 1.15s 후 여권 뒷면(CurlIn: 역방향 컬, BON VOYAGE)이 닫힘 → 1.7s 후 비행.
- **비행**: 구름 루프 + 점선 항로 + 비행기 nb-fly(2.3s) · 문구/공항코드는 DESTS[dest] 파생(ICN → JFK/SYD/YVR/LHR) · 2.7s 후 입국심사.
- **입국심사**: 배경 선준비(위 하늘/아래 종이) → 심사관이 몸(-13px 오버슈트)·머리(-30px, 지연)·모자(-84px 치솟아 회전 낙하) 관성 분리로 벌떡 등장 → 1.3s 후 영어 대사 타자기(34ms/자, 커서) + 한국어(24ms/자) → 완료 전 옵션 비활성(흐림).
- **전환 규칙**: 심사대 통과 = 좌측 슬라이드(0.6s, 종이 넘김 아님) · 첫 출근하기 = 출근 스플래시(낙서 캐릭터 워크 사이클: 다리 교차 nb-leg + 봉봉 nb-bob + 병원 목적지) 3.1s 후 리셋.
- **뒤로가기**: 직업/목적지 우상단 ‹ = **goBack(CurlIn으로 이전 장이 되돌아옴**, 표지는 그린 배경) · 입국심사 ‹ = **귀국 비행**(step 8: 반대 방향 비행, "{APT} → ICN · 다시 집으로") 2.7s 후 목적지 선택으로 복귀.
