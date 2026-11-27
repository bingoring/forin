# or-preop-checklist A 메모 (검토 판단용)

## 1. keyPhrase 충돌 — 꼭 확인
- 상황 "교차혈액 없이 출혈 수술"의 keyPhrase **"I'm activating the massive transfusion protocol."**는 or-bleeding에서 사용자가 "I'm calling the blood bank to activate the massive transfusion protocol."로 바꾸기로 한 문장과 같은 문장입니다. 대량수혈 프로토콜 발동은 집도의·마취과의 판단이고 간호사는 혈액은행에 전화해 가동·준비를 맡는 역할이라, 이 주제에도 같은 교체가 필요합니다. keyPhrase는 en을 바꾸면 안 되므로 A는 건드리지 않았고, nuance swap의 정답을 새 문장("calling the blood bank to activate the massive transfusion protocol")으로 써 두었습니다(오답으로 "activating … myself"를 둠). ko는 "혈액은행에 전화해서 대량수혈 프로토콜을 가동할게요"가 맞습니다.

## 2. 문장이 간호사의 업무 범위를 넘는 것 (고치지 않고 적음)
- 당뇨 환자 혈당 조절 [4] "We can give a small dose of insulin if it's needed before surgery." — 인슐린 투여는 지시·프로토콜이 있어야 하는데 간호사가 먼저 약속하는 말로 읽힙니다. [2] "We'll adjust if the number is too high or low."도 같습니다(조절은 지시에 따라).
- 항생제 미투여 절개 임박 [4] "Please push it now so we're not delayed any further." — 항생제에 따라 급속 정주가 안 되는 약이 있고(예: 반코마이신은 천천히 주입), 수술실에서는 보통 마취과가 투여합니다. [3] "We can't cut until the antibiotic is fully in."도 '완전히 다 들어갈 때까지'는 약마다 기준이 달라 과한 단정입니다(보통은 절개 전 일정 시간 안에 투여 시작·완료).
- 예방적 항생제 준비 [1] "We need it in within 60 minutes before incision." — 60분은 세파졸린 등 흔한 약의 기준이고 반코마이신·플루오로퀴놀론은 120분까지 허용됩니다. 문장은 일반론이라 그대로 두되 약에 따라 다르다는 점을 A의 slider 해설에 넣었습니다.
- 항생제 투여 시각 지연 [2] "I'll adjust the timing and document it." — 투여 시점 조정은 지시·마취과와 함께 정할 일이라 간호사가 단독으로 조정하는 말이 되지 않게 주의.
- 검사 이상치 수술 지연 [1] "We should hold the case until this is corrected." / [4] "Let's get a repeat level…" — 보류와 재검 오더는 집도의·마취과가 정합니다(제안으로는 허용 범위).
- 혈액형·교차적합 미완료 [1]·[3] "Should we hold…" / "We can't start this case without blood ready." — 교차적합이 필수인지는 수술 종류와 병원 정책에 따라 다릅니다(type-and-screen만으로 시작하는 건도 있음).
- 심박동기 환자 소작 위험 [1]·[2] — 쌍극/단극 소작, 패드 위치, 자석 사용 결정은 집도의·마취과(필요하면 심장내과)가 합니다. 질문·제안 형태라 허용 범위로 보았습니다.
- 교차혈액 없이 출혈 수술 [1] "Can we release emergency O-negative now?" — 혈액 불출은 의사 요청이 있어야 합니다. 질문 형태라 허용.

## 3. 문장 ko·en 판단 거리
- 교차혈액 없이 출혈 수술 [1] ko "방출할 수 있을까요" — 혈액은행이 혈액을 내줄 때는 "불출"이 맞는 말입니다(w-release의 ko는 "불출하다"로 고침).
- 의치·보청기 제거 거부 — 상황 제목은 "보청기"인데 문장은 틀니(denture)만 다룹니다. 문장·제목은 그대로 둠.
- 필수 검사 결과 누락 [3] "This lab is critical" — ko "꼭 필요한 수치"는 맞음. 단 w-critical 카드의 ko는 "위중한"이 아니라 "중대한"으로 고침.

## 4. 결정 11 정리 요약
- 쉬운 단어 태그 뺌 17개(공통 목록 9: name·today·time·minute·morning·patient·family·know·go / 판단 8: both·help·high·low·short·left·right·second), 단어도 은행에서 삭제.
- 헤드워드: w-heavy를 문장(bleeding heavily)에 맞춰 heavily(부사)로. id는 그대로.
- ko 정리 24건(같은 ko 가르기: check/confirm, flag/label, run/flow, level/number/value, push/give/infuse, cut/incision, record/document, prevent/prevention, risk/dangerous, critical/critically 등). 괄호 설명이 길어 보기 길이 W16에 걸릴 것은 줄임.
- 문장 태그 1건 더: 검사 이상치 수술 지연 [1]의 w-correct("corrected", 동사)는 '맞는'(형용사) 카드와 맞지 않아 태그에서 뺌.
- 문장 en·ko·chunks는 하나도 바꾸지 않음.
