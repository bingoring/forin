# icu-gi-bleed A — 문장 en·ko 관련 메모 (고치지 않고 적어 둠, 검토가 판단)

상황 번호는 0부터, 문장 번호도 0부터.

1. 재출혈 급변 소생 #6 "Stay with me, we're getting your blood pressure back up right now." ko "저랑 계속 계세요" — 역할이 뒤집힌 번역(TASK 7번). 환자에게는 "정신 놓지 마세요"가 맞다.
2. 출혈 병력·항응고 검토 #3 "…we're not stopping it because of blame." — 영어가 어색하다(문제 삼으려고 끊는 게 아니라는 뜻이면 "not stopping it to blame you" 정도). ko "문제 삼으려고 끊는 게 아니에요"도 어색.
3. 제한적 수혈 목표 판단 #3 "Seven point two is below eight…" — 암시되는 기준 8은 일반적인 제한적 기준(7 g/dL, 심혈관 질환 등에서 8)과 환자별로 다르다. 수치를 한 가지로 못 박은 문장이라 지침·처방 확인 필요. 이 때문에 nuance why에는 수치를 쓰지 않았다.
4. 제한적 수혈 목표 판단 #4 "We only transfuse if he drops further or becomes symptomatic." #0 "we usually hold to the restrictive target" — 간호사 단독 결정으로 들린다. 수혈 여부·기준은 처방대로라는 어조가 안전하다.
5. 정맥류 출혈 초기 관리 #0 "Yes, let's start the octreotide drip now." — 간호사가 약 시작을 정하는 어조. "as ordered"가 없다. (#1은 "as ordered"가 있음)
6. 대량출혈 쇼크 대량수혈 #0 "Activate MTP and get the cooler now." — MTP 발동은 보통 의사(또는 병원 지침의 지정자)가 한다. 간호사 명령형으로 들린다.
7. IR·내시경 이송 조율 #6 "I'll call report the moment we're wheels up." — "wheels up"은 항공 비유의 관용구라 ICU 이송에서 자연스러운지 불확실. ko "이동을 시작하는 순간"은 뜻은 맞음. 이 문장의 wheel 태그는 뺐다.
8. 하부출혈 감별·검사 #0 "Bright red blood usually points to lower down in the gut." — 선홍색 = 하부라는 일반화는 대량의 상부 출혈에도 선홍색이 나올 수 있어 "usually"로만 허용되는 문장. 사실상 맞지만 환자에게 단정으로 들리지 않게 주의.
9. 재출혈 감시·재평가 #5 "A little tiredness is normal, it's the blood loss catching up with him." — 환자에게 '정상'이라고 안심시키는 문장. 간호사가 쉬운 말로 설명하되 계속 확인한다는 뒷말이 #6에 있으므로 허용 범위이나, 단독 진단처럼 들릴 수 있다.
10. 토혈 기도흡인 위기 #5 "The doctor is on the way to place the breathing tube." ko "기관삽관" — breathing tube = 기관 튜브(삽관 튜브). 문제 없으나 'place'가 동사라 w-place 태그를 뺐다.
11. 출혈 불응 목표·예후 소통 #5 "Some families choose to keep fighting, others choose comfort, both are okay." — 가족에게 선택을 제시하는 말로 의사·긴급 상담 맥락을 전제한다. 간호사 단독으로 치료 중단을 권유하지 않는지 확인 필요.

## 판단 거리 (저작자 결정)
- w-breathe의 en이 `breathing`(ko 숨쉬는) — id는 그대로 두고 문장 "breathing tube"에 맞춰 분사형 형용사 헤드워드로 둠.
- w-hand(건네다)는 공통 쉬운 목록의 `hand`이지만 문장에서 `hand off`(인계하다) 구로만 쓰여 가르칠 값이 있어 남김.
- w-bank ko를 '혈액은행'으로, w-tips·w-mtp·w-cooler 같은 긴 ko는 오답을 비슷한 길이의 실제 시술명·절차명으로 맞춤.
- context의 word는 문장에서 세 장면이 자연스럽게 공유하는 말만 골랐다(vitals·line·confirm·trend·stomach·dose·airway·scope·transfuse·rate·coag·balloon·bowel·handoff·stat·suction·transport·reassess·clot·honest).
- 8번 문장 하나만 더: 제한적 수혈 상황의 slider/context why에는 수치를 쓰지 않았다(처방대로).

## 결정 11 정리 요약 (changes-icu-gi-bleed.yaml)
- 쉬운 말 15개(공통 목록: hour minute time now today morning name doctor family body know go see come good)와 판단분 10개(same here water eat want talk most lot okay still)를 태그에서 빼고 은행에서 지움.
- 헤드워드 ko 조정 31건(듣고 뜻 고르기 정답 겹침 해소 + 문장과 안 맞는 ko).
- 헤드워드와 뜻이 안 맞는 문장 태그 20건 안팎 제거(take·turn·right·pressure·rate·hold·wheel·repeat·place·clear·call·lab).
- 문장 en·ko·chunks는 손대지 않음.
