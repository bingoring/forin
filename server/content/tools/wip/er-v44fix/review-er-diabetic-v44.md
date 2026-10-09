# er-diabetic v44 수정 재검토

대조: 정본 export ↔ `base-er-diabetic.yaml`, changes 새 항목 15건.
목록 7행이 모두 반영됐다. changes는 실제 바뀐 v44 키와 맞는다(w-gap example 이동 포함). base 상황 `keyPhrases` 2곳은 정본 + tsv와 같다. V4 실패 2건은 정본 keyPhrase가 아직 옛것이라서 생기며, apply 뒤 사라진다.

## 판정 요청 항목
- **20.2 "Your labs still show a lot of acid, so I'm updating the doctor.":** 지적 두 가지가 풀렸다.
  - 환자에게 검사 용어를 쓰지 않는다.
  - `ko`에 남아 있던 영어 anion gap이 없어졌다.
  - 문장과 why가 S20 context의 고친 장면("the acid is building up again")과 맞는다.
  - nuance pair `a lot of / acid`는 굳은 표현은 아니지만 짝을 맞추는 데 문제는 없다.
  - 빈칸은 아래 1번.
- **15.1 "Do your legs or your arms feel weak?"(새로 씀):** 15.0 "Tell me about any muscle weakness or cramping."과 겹치지 않고 부위를 묻는 문장으로 갈렸다. 저칼륨 근력 저하는 다리부터 오는 일이 흔하다는 why도 맞다. 청크는 아래 2번.
- **17.3 "The fluids should bring her blood pressure back up."(새로 씀):** 17.2(수액을 빠르게 주는 중)와 겹치지 않고, should로 장담하지 않는 기대를 말한다. 가족에게 하는 말로 자연스럽다.
  - decoy `her temperature`를 넣은 조립 "…bring her temperature back up"은 영어로는 되지만 `ko`(혈압)와 어긋나고 위험하지 않다.

## 고칠 것
1. **20.2 빈칸 오답 `sugar`가 정답이 될 수 있음(문체·빈칸)**
   - 문제: DKA 장면에서 "Your labs still show a lot of sugar, so I'm updating the doctor."는 간호사가 실제로 할 수 있는 참인 말이다. `ko`의 "산"이 걸러 주기는 하지만 정답이 둘에 가깝다.
   - 처방: options의 `sugar`를 `protein`으로 바꾼다.
2. **15.1 청크 `feel / weak`이 술어를 끊음(문체)**
   - 문제: 낱말 8개라 3조각이면 충분한데 `feel`과 `weak`를 갈랐다.
   - 처방: `chunks: ["Do your legs", "or your arms", "feel weak", "?"]`. changes 항목(S15 index 1)에 chunks가 이미 있다.
3. **14.3 `ko`가 두 문장으로 갈리고 둘째가 어색함(문체)**
   - 문제: "어떻게 하실지 보여주시겠어요? 이해하셨는지 알 수 있어요."
   - 처방: `ko: 이해하셨는지 알 수 있게 어떻게 하실지 보여주시겠어요?` w-understand `exKo`도 같은 값으로 맞춘다(V17). exKo는 V44 단어 키가 아니므로 changes 항목은 늘지 않는다.

## 확인만
- 14.3 en은 처방("so I know it's clear") 대신 "so I know you understand"를 써서 w-understand를 살렸다. 맞는 선택이다.
  - 빈칸(understand / forget·refuse·miss)과 decoy(so you can)에 문제가 없다.
  - 14.4 "Please show me how you would draw up the dose."와 비슷하지만, 이 겹침은 고치기 전부터 있었다.
- 15.5 `ko`, 19.2 Are(order L2 Have까지), 4.5 청크는 처방대로 고쳤다.
- 참고(목록 밖, 보고만):
  - w-gap example이 20.3 "I'll report your pH and anion gap trend clearly."(keyPhrase)로 옮겨졌다.
  - 이 문장의 `ko` "pH와 anion gap 추이를"에도 20.2에서 지적한 것과 같이 영어 anion gap이 남아 있다.
  - 환자에게 하는 말이라는 점도 20.2와 같다.
  - 목록에 없으므로 이번에는 두되, 사용자 결정 목록에 올릴 만하다.
