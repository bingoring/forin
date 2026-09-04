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
  보유: home hospital board lab me mic speaker siren scalpel baby monitor pill bandage bell star pencil magnify bulb trophy speech compass chartup shield handshake2 pushpin dice lock
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
| forin Notebook - Quiz Result.html | forin-notebook-session.jsx + forin-notebook-quiz2.jsx | A~F 기본 6유형(문장완성·잇기·객관식·받아쓰기·순서·안전체크) · G 바이탈 라벨링(QuizVitalsNb) · H ESI 판정 도장(QuizTriageNb) · I 용량 계산 연습장(QuizDosageNb) · J 신체부위 라벨링(QuizAnatomyNb) · K APGAR 채점표(QuizApgarNb) · L 라벨 오류찾기(QuizErrorNb) · M 결과 · N 복습 세션 |
| forin Notebook - Colleagues More.html | forin-notebook-social.jsx | A 동료 목록(ColleaguesNb) · B 동료 상세(ColleagueDetailNb) · C 길찾기(WayfindingNb) · D 스플래시(SplashNb) · E 로그인(LoginNb) |

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
- **여권 표지**: 딥그린 #2E4636 + 금색 이중 테두리 · "PASSPORT / forin" · 금장 이중원 엠블럼 안 손글씨 **f** · 하단 MRZ 2줄. 표지 = 로그인 화면: 소셜 3버튼(공식 브랜드 리소스: Google 공식 G 로고 SVG + 흰 버튼, Apple 검정 버튼, 카카오 공식 로그인 이미지 uploads/kakao_login_large_wide.png)만 — id·pw 없음, 기존 유저는 OAuth로 자동 로그인, 초기화는 프로필에서.
- **페이지 넘김(CurlOut)**: 24관절 중첩 3D 컬 — 베이스 회전(-128°, 끝까지 넘어가며 말미 페이드)과 관절 컬(48% 시점 최대 곡면 → 38%로 풀림) 2단 합성. 슬라이스 균일 명도 오버레이(인접 차 ~1%)로 줄무늬 없음, 오른쪽 끝부터 들림(관절당 4.5ms 딜레이), 1.25s. 다음 장 위로 그림자 스윕(nb-sweep).
- **목적지**: 카드 선택은 하이라이트만(자유 변경). **출국하기를 누르면** 옵션-버튼 사이 공간에 ADMITTED {나라} 도장이 쾅(nb-stamp) → 1.15s 후 여권 뒷면(CurlIn: 역방향 컬, BON VOYAGE)이 닫힘 → 1.7s 후 비행.
- **비행**: 구름 루프 + 점선 항로 + 비행기 nb-fly(2.3s) · 문구/공항코드는 DESTS[dest] 파생(ICN → JFK/SYD/YVR/LHR) · 2.7s 후 입국심사.
- **입국심사**: 배경 선준비(위 하늘/아래 종이) → 심사관이 몸(-13px 오버슈트)·머리(-30px, 지연)·모자(-84px 치솟아 회전 낙하) 관성 분리로 벌떡 등장 → 1.3s 후 영어 대사 타자기(34ms/자, 커서) + 한국어(24ms/자) → 완료 전 옵션 비활성(흐림).
- **전환 규칙**: 심사대 통과 = 좌측 슬라이드(0.6s, 종이 넘김 아님) · 첫 출근하기 = 출근 스플래시(낙서 캐릭터 워크 사이클: 다리 교차 nb-leg + 봉봉 nb-bob + 병원 목적지) 3.1s 후 리셋.
- **뒤로가기**: 직업/목적지 우상단 ‹ = **goBack(CurlIn으로 이전 장이 되돌아옴**, 표지는 그린 배경) · 입국심사 ‹ = **귀국 비행**(step 8: 반대 방향 비행, "{APT} → ICN · 다시 집으로") 2.7s 후 목적지 선택으로 복귀.

### 2026-09 추가 화면 결정
- **퀴즈 6유형**: 공통 헤더 = ✕ 그만두기 쪽지 + 과 태그 + n/6 + 기울어진 잉크 진행 바. ① 문장완성 = 빈칸 밑줄 + 낱말 칩 종이. ② 용어 잇기 = 좌우 종이 카드 + 펜 선(확정 실선 그린/진행 점선 블루). ③ 객관식 = 원형 낙서 라디오(✓그린/✕레드) + 선택지별 손글씨 해설 + 왜? 메모. ④ 받아쓰기 = 스피커 쪽지(파형 낙서+배속) + 필기란 3줄(깜빡 커서). ⑤ 순서 배열 = 번호 원 + 확정/미정(점선) 카드 + ↕ 끌기. ⑥ 안전 체크 = 손그림 체크박스 복수 선택 + '위험' 태그.
- **결과**: PASSED 근무 완료 도장(그린) → 근무 요약 4스탯 종이 → 미션 체크리스트(미달성=태그 '다음에!') → 빨간펜 교정 프리뷰 + '복습 노트에 저장됨' → 다시 보기/다음 근무.
- **복습 세션**: 카드 스택(뒤 2장 겹침) + D+3 태그 + 앞면 한국어 상황 → 뒤집기 + '먼저 말해보고 확인' 마이크 → 하단 SRS 4버튼(종이 버튼).
- **동료**: 목록 = 폴라로이드 아바타 + 현지 근무중 그린 필 + 연속/출근 여부 + 응원 버튼, 상단 코드 맺기 쪽지(RN-JIMIN) + 이번 주 함께 목표(빗금 게이지). 상세 = 폴라로이드 헤더 + 3스탯 + 최근 라운지 글(압정) + 응원/멘토 요청(현지 근무자만).
- **길찾기**: 손그림 약도 종이(방 = 옅은 워시 사각 + Gaegu 라벨) + 빨간펜 점선 경로/화살표 + 현재 위치 블루 점 + 목적지 ★ 점선 원 + 단계 3스텝('지금 여기' 태그).
- **스플래시/로그인**: 스플래시 = 여권 그린 + 금장 f 엠블럼 + FORIN 자간 로고 + 점 로더. 로그인 = f 잉크 엠블럼 + '다시 출근할 시간이에요' + 소셜 로그인 3종이 카드만(Google 종이/Apple 잉크/카카오 옐로 — id·pw 입력 없음) + 약관 동의 문구.

### 병동 특화 퀴즈 6종 (forin-notebook-quiz2.jsx · 픽셀 라인 유형 이식)
- **바이탈 라벨링(ER)** = 종이 위 다크 모니터 낙서 + 수치별 라벨 쪽지 드래그(확정 = 흰 쪽지 ✓, 미정 = 점선 ?) + 쇼크 징후 주의 메모.
- **ESI 판정(ER)** = 환자 메모 종이 → 1~5 이중선 도장 중 하나를 찍기(선택 = 링 + 워시) + 기준 메모.
- **용량 계산(약국)** = 처방전 종이 + 연습장(파란 손글씨 계산 + 빨간 동그라미 답) + 답 필기란 + 숫자 쪽지 키패드.
- **신체부위 라벨링(병동)** = 낙서 인체 종이 + 색 화살표 ①②③ + 부위별 답 쪽지/필기란 + 어휘 쪽지.
- **APGAR 채점표(NICU)** = 5항목 × 0/1/2 원 선택(확정 = 이중선 그린) + 누적 점수 도장 + 기준 메모.
- **라벨 오류찾기(약국)** = 처방전 vs 조제 라벨 나란히 + 오류에 빨간 동그라미(10배 용량·복용 시점) + 찾은 오류 카운터.

### 병동 특화 퀴즈 II (forin-notebook-quiz3.jsx · 12종, O~Z)
- **ICU 벤트 알람**(MCQ) = 다크 알람 패널(HIGH PRESSURE) + DOPE 원칙 해설.
- **ICU 승압제 적정**(게이지) = 지시 종이(Target MAP) + 펌프 게이지 바(목표선 점선) + ±0.02 버튼.
- **OR 기구 매칭** = 기구 낙서 3종 카드 + 기구 노트(forceps/retractor/hemostat).
- **OR 타임아웃**(말하며 체크) = 체크리스트 + 항목별 영어 대사 이탤릭 + 마이크로 체크.
- **분만실 FHR 판독**(스트립 MCQ) = 손그림 CTG(FHR 실선 + UC 점선) + early/late/variable.
- **소아과 쉬운 말**(용어→보호자 말 잇기) = NPO/febrile/IV/antipyretic + teach-back 팁.
- **정신과 위험 신호**(복수 선별) = 환자 발화 이탤릭 쪽지 + '보고' 태그 + 경고신호 해설.
- **재활 이동 보조**(순서) = 게이트벨트→앉히기→건측 배치→구령 기립 + 건측 힌트.
- **투석 수분 계산**(연습장) = 체중 3칩 + 손글씨 계산 + UF Goal 필기란 + 영어 문장.
- **내시경 NPO**(문장 완성) = midnight 확정 + clear liquids 칩 + 흡인 위험 해설.
- **정형외과 CMS**(판정 MCQ) = C/M/S 3행 판정 태그(정상/주의/위험) + 구획증후군 보고 문장.
- **감염관리 PPE**(순서 그리드) = 착용 4단계 아이콘 카드(미정 점선) + donning/doffing 암기 메모.

퀴즈 유형 라이브러리 현황: 공통 6 + 특화 I 6 + 특화 II 12 = **24유형**. 병동별 10~20개 목표는 공통 유형(문장완성·잇기·객관식·받아쓰기·순서·체크)을 병동 콘텐츠로 돌려쓰기 + 특화 유형 조합으로 충족.

## NbAvatar 아바타 에셋 시스템 (forin-notebook-avatar.jsx · forin Notebook - Avatar.html)
프로필 초상화 그림체(2px 잉크 외곽선 + 플랫 파스텔 필 + 점눈/선입, 64×70 흉상) 기반의 레이어 조합 컴포넌트.
- **레이어 순서**: 배경 → 뒷머리 → 옷 → 얼굴(피부) → 입 → 눈 → 앞머리 → 모자 → 액세서리.
- **props**: skin·hair·hairColor·eyes·mouth·outfit·outfitColor·hat·hatColor·bg·acc·size (키 또는 hex 직접 지정 가능).
- **에셋 수**: 피부 8 · 머리 스타일 19 · 머리색 12 · 눈 15 · 입 14 · 옷 18 · 옷색 12 · 모자 12 · 배경 10 · 액세서리 16 — 조합 수십억.
- **NPC 통합 원칙**: NPC 전용 풀은 없다 — 환자복·구급대원·보안 제복·정장·가디건·방호복(후드는 얼굴 뒤 원으로 표현), 지친/걱정/화남 눈, 통증/이 악묾 입, 콧수염·턱수염·주름·산소 캐뉼라·페이스실드 액세서리, 보안 정모까지 전부 공용 풀에 있고 사용자도 착용 가능. 초상화 NPC는 이 풀의 조합 프리셋(쇼케이스 'NPC 프리셋' 12종: 환자·노인 환자·의사·수간호사·보안요원·구급대원·보호자·약사·방호복 간호사·원목·통증 환자·외과의)으로 만든다.
- **머리 스타일 19종**: short·part·midPart(중간 가르마)·buzz·curlyShort·bob·ponytail·bun·twintails·longStraight·curlyLong·wavyMid·wavyLong·fringe·spiky·afro·braid·baldFringe(탈모: 테두리 안쪽 얇은 원호 옆머리 + 정수리 가닥 2줄)·bald.
- **두상 곡률 규칙(중요)**: 모든 머리·모자 돔은 얼굴 원(중심 32,32 · r14)과 **동심 원호**로 그린다 — 앞머리 r13.7, buzz r13.7, 뒷머리 r15.2 (외곽 스트로크 포함 얼굴 원 안쪽 안착). 납작한 Q커브 돔 금지.
- **긴 머리 규칙**: longStraight·curlyLong·wavyMid/Long 뒷머리는 목 뒤 중앙까지 채운 통 커튼(중앙 공백 금지 — 갈라지면 양갈래로 오독). 양갈래(twintails)·포니테일 꼬리·braid는 얼굴 원 밖으로 3px 이상 떨어뜨린다.
- 사진→아바타 매핑을 위한 커버리지 설계: 피부 8단계 명도 스케일, 머리색에 염색 포인트(red/pink/mint) 포함, 마스크는 착용(maskOn)/턱걸침(maskChin) 2종.
- 키 목록은 window.NbAvatarAssets로 노출 — 랜덤/매핑 생성에 사용.

## 온보딩 플로우 2 — "여권 발급" (forin-notebook-onboarding-flow2.jsx · OnbFlow2)
신분(ID) 페이지의 빈칸을 순서대로 채워 여권을 발급하는 대안 플로우 (★★ 아트보드).
- **ID 페이지**: 여권 신분 페이지 레이아웃 — 사진 칸(96×118 점선) + NATIVE LANGUAGE·OCCUPATION·GIVEN NAME 필드 + 하단 MRZ 2줄(채운 값이 실시간 반영: 이름 대문자·직업/언어 코드).
- **채우기 순서 고정**: 사용 언어 → 직업 → 사진(아바타) → 이름. 다음 빈칸이 노란 점선+‘여기를 채워요 ✎’ 깜빡임으로 활성화되고, 그 칸 위치를 transform-origin으로 **선택지가 화면 중앙으로 확대**(nb2-zoom, 배경 딤) → 고르면 줄어들며 칸이 nb2-fill 팝으로 채워짐 → 0.6s 후 다음 픽커 자동 오픈.
- **픽커 4종**: 언어 6개 국기 그리드 / 직업 4행(간호사만 활성) / 아바타 NbAvatar 프리셋 6종 3열(“나중에 프로필에서 꾸미기” 힌트) / 이름 필기란 input(Enter 또는 ‘이렇게 적을게요 ✎’).
- **수정 가능**: 채워진 칸을 탭하면 해당 픽커 재오픈.
- **이후**: 4/4 완료 → ‘다음 장 넘기기’(CurlOut) → 목적지 페이지(이름 호명 “OO 님, 어디로 떠나나요?”) → 도장 쾅 → 출국하기 → CurlIn 뒷면 커버(“OO 님의 여권이 발급됐어요”) → 리셋 루프.
- **플로우 1에도 이름 추가**: 직업 페이지 하단 ‘여권에 쓸 이름’ 필기란 → 입국 승인 사원증에 RN · {이름} 반영.
- CurlOut/CurlIn/Gutter는 flow1이 window.NbOnbFX로 export — flow2가 재사용 (중복 정의 금지).
