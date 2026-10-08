# er-shock v44 수정 재검토

목록 행 9개(9.1, 11.4, 19.2 ko, 21.3, 20.2·20.4, 21.4, 겹침 4쌍, 청크 5건)를 모두 대조했습니다. 빠진 행은 없습니다.
changes 항목(문장 16건, 단어 예문 9건, w-central 삭제)은 실제로 바뀐 키와 맞습니다(15.1의 `words`, 20.2·20.4의 `ko`는 적었지만
바뀌지 않았습니다. 더 적은 것이라 해는 없습니다). keyPhrases를 tsv 값으로 바꾼 스크래치 시드로 검사하면 위반 0건, 통과, W14 0건입니다.

## 판정
- **9.1·11.4·21.3·20.2·20.4·19.2 ko**: 처방대로 고쳤습니다. tsv 두 행(9.1, 20.2)이 en과 글자까지 같습니다. w-central은 다른 곳에서
  쓰지 않아 삭제가 맞습니다. 수용합니다.
- **3.4** `Call us before you stand up, because you may feel dizzy.`(11단어): 탈수로 인한 기립성 저혈압의 낙상 예방이라는 사실에
  맞고, 3.2(물 조금씩 마시기)와 겹치지 않습니다. 수용합니다.
- **7.4** `Tell me right away if the pressure in your chest gets worse.`: 심인성 쇼크 환자에게 맞는 말이고 7.2와 겹치지 않습니다. 수용합니다.
- **19.3** `He can't keep himself warm, so watch his temperature.`: 신경성 쇼크의 체온 조절 장애(poikilothermia)는 사실이고,
  동료에게 하는 말로 맞습니다. 수용합니다.
- **21.4** `We'll give hydrocortisone now to treat the crisis.`: 사실 오류(이미 위기인데 예방)는 바로잡았습니다. 다만 21.2와 겹치고
  order L2에 같은 오류가 남았습니다(아래 1·2).
- **16.4** `Don't rub his swollen leg, and keep it still.` 판정: **임상적으로 틀리지는 않지만 바꾸기를 권합니다.**
  DVT가 의심되는 다리를 주무르지 않는 것은 맞습니다. `keep it still`은 예전의 침상 안정 교육이고, 지금은 항응고를 시작하면
  일찍 움직이게 하는 것이 권고입니다. 해롭지는 않지만 근거가 약합니다. 장면도 맞지 않습니다. S16은 대량 폐색전으로 쇼크가 와서
  혈전용해를 준비하는 동료 간 장면인데, 다리 관리는 이 순간의 우선순위가 아닙니다. 게다가 빈칸 오답 `bend`·`lift`를 넣은
  `Don't bend his swollen leg, and keep it still.`도 맞는 말이라 정답이 둘입니다(아래 3).

## 고칠 것

1. **S21 부신위기 저혈압 order L2·why** (사실)
   - 문제: L2 `To help prevent that, we'll give hydrocortisone and fluids right away.`와 order why("그 위기를 막으려")가 21.4에서
     바로잡은 오류("이미 위기인데 예방")를 그대로 갖고 있습니다.
   - 처방:
     - L2 `en: That's what's happening now, so we'll give hydrocortisone and fluids right away.` / `ko: 지금 그 위기가 온 거라서 하이드로코르티손과 수액을 바로 드릴게요`
     - `why: 스테로이드를 끊은 사정을 묻고, 그것이 위험한 위기가 될 수 있다고 알리고, 지금 그 위기가 왔으니 바로 약을 준다고 하고, 약이 들어간 뒤 갑자기 끊지 말라고 교육해요. 'it'·'that'·'the hydrocortisone'이 앞 줄을 가리켜 순서가 하나예요.`

2. **S21 21.4: 21.2와 겹침, decoy** (문체 + 안전)
   - 문제: `We'll give hydrocortisone now to treat the crisis.`가 21.2 `We're giving hydrocortisone and fluids right away.`와 거의 같은
     말입니다. 겹침 4쌍을 고친 것과 같은 종류입니다. 또 `decoy: after the lab`은 `now` 자리에 넣으면
     `We'll give hydrocortisone after the lab to treat the crisis.`가 됩니다. 부신위기에서 검사를 기다리느라 투여를 늦추는 위험한 문장입니다
     (고치기 전에도 같았음).
   - 처방(문장을 새로 쓰고, 은행은 바꾸지 않음):
     ```yaml
     en: Hydrocortisone replaces the hormone your body is missing right now.
     ko: 하이드로코르티손은 지금 몸에 모자란 호르몬을 채워 줘요.
     chunks: [Hydrocortisone replaces, the hormone, your body, is missing, right now, .]
     words: [w-hydrocortisone, w-miss]
     tag: 약 설명
     icon: pill
     why: replaces the hormone …으로 약이 몸에 모자란 코르티솔을 채운다는 원리를 쉬운 말로 알려요. 이미 부신위기로 혈압이 떨어진 상태라 위기를 막는 게 아니라 모자란 호르몬을 바로 채워 치료해요.
     blank: {answer: missing, options: [{en: missing}, {en: making}, {en: storing}, {en: blocking}]}
     decoy: is optional
     distractorsKo: 그대로 (혈압을 15분마다 잴게요 / 가족분께 연락드릴게요)
     ```
     w-give·w-crisis는 21.1·21.2 등에서 계속 쓰입니다. changes: 문장 21.4 `fields: [en, ko, chunks, words]`(이미 있는 항목과 같음).
   - 문장을 그대로 둔다면 decoy만이라도 `is optional`로 바꾸세요.

3. **S16 폐색전 폐쇄성 쇼크 16.4** (사실·장면, 낮음)
   - 처방(혈전용해 전에 정맥로를 확보하는 것은 표준이고, 투여 뒤에는 새로 찌른 자리에서 출혈 위험이 큼):
     ```yaml
     en: Get two large-bore IVs in before the thrombolytics start.
     ko: 혈전용해제를 시작하기 전에 굵은 정맥로를 두 개 잡아 주세요.
     chunks: [Get two, large-bore IVs in, before the thrombolytics, start, .]
     words: [w-large, w-bore, w-iv, w-thrombolytic, w-start]   # 18.1과 같은 태그 방식
     tag: 투여 전 준비
     icon: shield
     why: before the thrombolytics start로 순서를 못 박아요. 혈전용해제가 들어간 뒤에는 새로 찌른 자리에서 피가 잘 멎지 않아서, 필요한 정맥로와 채혈은 미리 해 둬요.
     blank: {answer: IVs, options: [{en: IVs}, {en: doses}, {en: scans}, {en: beds}]}
     decoy: is negative
     distractorsKo: [혈전용해제 용량을 다시 확인해 주세요, 다리 둘레를 재 주세요]
     ```
     빈칸을 `before`에 두지 마세요. 오답 `after`가 위험한 처치를 보여 줍니다. w-swell·w-leg는 16.0, w-still은 20.0에서 계속 쓰여 지울
     단어가 없습니다. changes: 문장 16.4 `fields: [en, ko, chunks, words]`(이미 있는 항목과 같음).

4. **S7 심인성 쇼크 감별 7.4 `blank`** (뜻, 정답 둘)
   - 문제: `…gets better`도 "나아지면 바로 알려 달라"는 말이 되어 맞는 문장으로 읽히고, `lighter`도 비슷합니다.
   - 처방: 빈칸을 옮깁니다. `blank: {answer: chest, options: [{en: chest}, {en: ears}, {en: eyes}, {en: sinuses}]}`

5. **7.4 `decoy: at night`** (뜻)
   - 문제: `in your chest` 자리에 넣으면 `Tell me right away if the pressure at night gets worse.`가 맞는 영어가 됩니다.
   - 처방: `decoy: than before`

6. **S3 탈수 관련 저혈압 교육 3.4 `decoy: at night`** (뜻)
   - 문제: `before you stand up` 자리에 넣으면 `Call us at night, because you may feel dizzy.`가 맞는 영어가 됩니다.
   - 처방: `decoy: the bathroom`

7. **S9 수액 반응성 평가 9.1 `decoy: every minute`** (뜻)
   - 문제: `your urine output` 자리에 넣으면 `We're watching every minute for signs that you're improving.`이 맞는 영어가 됩니다.
   - 처방: `decoy: as a good`

8. **S15 패혈증성 쇼크 급속 악화 번들 15.1 `decoy: by tomorrow`** (안전, 청크를 나눠서 생김)
   - 문제: 새 청크에서 `within the hour` 자리에 넣으면 `Get broad-spectrum antibiotics in by tomorrow.`가 됩니다. 패혈성 쇼크에서
     항생제를 늦추는 위험한 문장입니다. 고치기 전 청크(`in within` / `the hour`)에서는 조립되지 않았습니다.
   - 처방: `decoy: are optional`

9. **S21 21.3 `decoy: for a day`** (뜻, 청크를 나눠서 생김)
   - 문제: `suddenly` 자리에 넣으면 `You can't just stop steroids for a day without a plan.`이 맞는 영어가 됩니다.
   - 처방: `decoy: Steroids can't` (고치기 전의 틀린 주어)

10. **S20 다장기 악화 SBAR 20.2·20.4 decoy** (뜻, 낮음, 고치기 전부터 있던 것)
    - 문제: 20.2 `I recommend a short stay and close monitoring now.`, 20.4 `I think she needs close monitoring at home.`이 맞는 영어가 됩니다.
    - 처방: 20.2 `decoy: is stable`, 20.4 `decoy: she's stable`

11. **S0 저혈압 초기 활력 인지 0.3 `decoy: all day`** (뜻, 낮음)
    - 문제: `right now` 자리에 넣으면 `Your blood pressure is a little low all day.`가 맞는 영어가 됩니다.
    - 처방: `decoy: a little high`

12. **S19 신경성 쇼크 19.3 `blank` 오답 `pulse`** (뜻, 낮음)
    - 문제: 신경성 쇼크에서는 서맥 때문에 맥박도 지켜봐야 해서, `…so watch his pulse`도 맞는 지시로 읽힐 수 있습니다.
    - 처방: `blank.options: [{en: temperature}, {en: weight}, {en: diet}, {en: vision}]`

참고(고칠 것 아님): S7 order L3 `Thanks, that helps. Let's listen to your heart and lungs now.`는 지운 옛 7.4의 말이지만, 7.2(폐 소리
청진)와 이어져 장면에 맞으니 둡니다. 3.0 `decoy: the next day`(`Losing the next day can lower…`)와 18.0 `decoy: for the family`는 문장은
되지만 뜻이 통하지 않아 둡니다.

고칠 것 12건(사실·안전 4건: 1, 2, 3, 8).

처방한 새 문장·빈칸·단어 추가·삭제를 스크래치 사본에 넣고(keyPhrase는 tsv 값으로 바꾼 시드) 검사하면 위반 0건, 통과입니다.
