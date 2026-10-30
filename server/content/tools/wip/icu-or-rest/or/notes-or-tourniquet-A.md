# or-tourniquet A — 검토가 판단할 것

## 문장 쪽 메모 (고치지 않았다)
- `We choose the smallest cuff that still fits.`(커프 크기 선택 3번), `We use the smallest appropriate cuff.`(소아 압력 조정 2번): 지혈대 커프는 사지에 맞고 겹침이 적절한 범위에서 "가능한 가장 넓은 커프"를 권하는 쪽이 일반적이다(넓을수록 낮은 압력으로 지혈). "가장 작은 커프"는 확신이 없다. 뉘앙스에는 이 말을 쓰지 않았다.
- `After reperfusion, the safe reinflation time resets shorter.`(재적용 시간 관리 0번), `This time, we can't go as long as before.`(3번): 재팽창 허용 시간이 "더 짧아진다"는 일반 규칙은 확신이 없다. 시간은 집도의와 병원 정책이 정한다.
- `Surgeon, we cannot exceed this time.`(허용 시간 초과 임박 2번), `We have to act right now — deflate it.`(3번), `We're at the maximum safe time — we need to deflate now.`(0번): 풀지 말지는 집도의가 정한다. 간호사가 "초과할 수 없다/빼세요"라고 단정하면 업무 범위 밖으로 읽힌다. 알리고 지시를 구하는 말로 보는 것이 맞다.
- `I'm setting the alarm for sixty minutes.`(시간 알람 확인 3번): 알람 시간은 집도의·병원 정책에 따른 값이다. 예시 수치로 읽힌다.
- `I'll call out the time every fifteen minutes.` / `I announce the total time every fifteen minutes.`(허혈 시간 소통): 간격은 병원 정책마다 다르다. 예시 수치로 읽힌다.
- `Let me recalculate based on the child's size.`(소아 압력 조정 1번), `We always calculate this before we inflate.`(압력 설정 3번): 압력 결정은 집도의 몫이고 간호사는 기계 값과 지시를 대조·기록한다. "계산한다"가 간호사의 단독 결정처럼 읽힐 수 있다.
- `The proximal cuff is for the Bier block sequence.`(이중 커프 4번): 정맥 부위마취는 두 커프를 순서대로 쓰는 것이라 "근위 커프는 Bier block 순서를 위한 것"은 설명이 부족하다.
- `I'm escalating this, the limb is at risk.`(허용 시간 초과 임박 1번): 간호사가 "사지가 위험하다"고 판단하는 말이라 보고 형태("The limb may be at risk")가 안전하다.
- `Do you need labs or treatment drawn up?`(재관류 대사 급변 1번): 처치 준비는 마취과 지시가 있어야 한다. 지시 전에 먼저 묻는 말이라 괜찮지만 약 준비를 간호사가 미리 제안하는 것으로 읽힐 수 있다.

## 단어 정리 (결정 11, changes-or-tourniquet.yaml 89건)
- 쉬운 단어 16개 제거: time·now·go·know·minute·patient(공통 목록) + get·make·see·let·cannot·ask·need·new·every·after(목록 밖 판단 10개). 모두 어느 문장도 태그하지 않게 됐고 은행에서 지웠다. 모든 상황이 단어 10개 이상 유지(V3).
- ko 22개: 같은 ko로 정답이 둘 이상이던 것을 가름(check/confirm, record/note/document, injury/damage, underneath/below, call/announce/flag/inform, right/correct, alarm/alert, max/maximum, run/active) + 뜻이 흐린 것(sit·pinch·field·block).
- 헤드워드 2개를 분사형으로(id 그대로): congest→congested, prolong→prolonged. 태그된 문장이 모두 그 형태의 형용사다.
- 같은 뜻으로 남은 쌍: `under`/`beneath`(아래/밑에), `tight`/`pinch`(조이는/끼이다), `alert`/`reminder`(경고 알림/알림), `escalate`/`report`(상급 보고/보고). 모두 ko가 달라 정답이 둘이 되지는 않지만 뜻이 가깝다. 서로의 오답으로는 쓰지 않았다.
- `w-up`(tourniquet up의 up)은 쉬운 말이지만 "지혈대가 올라가 있다"는 구의 일부라 남겼다. `w-first`·`w-always`도 같은 이유로 남겼다.

## 뉘앙스 판단 거리
- 슬라이더 21개 중 정답 칸: 0번 6, 1번 7, 2번 8. 종류: slider 21, swap 17, context 4.
- 업무 범위를 시험하는 swap(압력 임의 변경·단독 감압·승압제 시작 등)을 오답으로 여러 개 썼다(압력 설정·최대 시간·저혈압·출혈 지속·대사 급변·말초혈관질환). 정답은 모두 "알리고 지시를 기다린다" 쪽이다.
- 환자 대상 어색한 장면 context 3곳(baseline·call·document·deficit 중 환자 설정)은 의식 있는 환자가 듣는 상황으로 썼다. 수술방 현실상 집도의가 설명하는 일이 많아, deficit의 fix는 "집도의가 이야기할 것"으로 썼다.
- `표시·기록` slider에서 "수술 뒤에 기록" 보기는 올린 시각을 놓친다는 이유로 오답 처리했다. 정식 차팅 시점은 병원 정책마다 다를 수 있다.
