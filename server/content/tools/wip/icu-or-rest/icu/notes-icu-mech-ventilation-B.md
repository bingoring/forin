# icu-mech-ventilation B 메모 (검토용)

## 판단이 어려웠던 안전 시험 (distractorsKo)
- 응급 명령문(DOPE 감별 1·2, 완전 고장 0·1·5, 자가발관 0·1, 기흉 1)은 "한 군데"로 고를 수 있는 곳이 처치·대상·시점뿐이라, 말하는 쪽/행동 주체(~하세요 → ~할게요·~합시다), 곁가지 절(while 절·이유절), 약어 이름(DOPE → ABC·FAST), 보고 내용으로만 바꿨다. 정답 둘로 읽힐 여지가 있는 곳: 완전 고장 0(할게요·합시다), 자가발관 1(가져올게요·가져옵시다), 완전 고장 5(해 주세요), 난치성 1(희망·고민 어조).
- 그래도 아래는 검토가 한 번 더 봐야 한다: DOPE 감별 1 오답2(백 환기 → 마스크 환기), 기흉 1 오답2(바늘 감압을 준비 → 설명), 완전 고장 1 오답2(예비 인공호흡기 → 예비 가습기), 자가발관 4 오답(재삽관을 확인하세요), 심한 부조화 1 오답(확신해요·같으세요? — 약 이름은 그대로).
- 빈칸 오답은 호출 대상·약 이름·시점 낱말을 쓰지 않았다(물건·장소·무관 동사 위주).

## base 문장에서 본 것(수정 안 함)
- 회로 연결·습화 4 "This water in the tubing is just moisture from his breath, not a problem." — 분비물이 섞인 물이면 단정이 과하다(응축수 맥락 한정).
- 기도내압 경보 3 "This alarm isn't an emergency" — 경보 일반에 대한 안심으로 읽힐 수 있다(keyPhrase면 사용자 결정).
- 심한 부조화 2 "while you draw up the medication" — 처방 확인 전에 약을 뽑는 것으로 읽힐 수 있다.
- 폐보호 3 ko "고평부압"은 일반적인 한국어 표기가 아니라 "고원압/plateau 압력"이 흔하다(ko는 안 바꿈).

## 규칙 적용
- order는 모든 상황에서 `And/Also/Then`을 쓰지 않고 앞 줄을 가리키는 말(that·it·they·So·Once·Either way·Whatever)로 묶었다. 조건 줄(`If`·`Once`)은 임상적으로 조건이 맞는 것(원인 확인, 준비 완료 뒤 전환)만 두었다.
- 파일: add_icu-mech-ventilation_B_1~4.yaml, build_icu-mech-ventilation_B.py → icu-mech-ventilation.B.yaml
