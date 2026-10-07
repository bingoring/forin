# er-shock 검토 결과 (Sonnet 신규 저작분 · 처음부터 검토)

대상: `wip/er-v45b-sonnet/er-shock.yaml` (단어 172 · 상황 22 · 뉘앙스 slider 22 / pair 2 / context 15 / swap 7 / reel 2). 검사기 `==> 통과` 확인.

## 항목별 점수

| # | 항목 | 점수 | 근거 |
|---|---|---|---|
| 1 | distractorsEn | 4 | 같은 분야·같은 품사로 잘 골랐다(IV→IM/IO, infection→inflammation/injection, cool→clammy/cold). `sign`의 `signal`은 정답으로도 읽힌다(아래). |
| 2 | distractorsKo | 4 | 정답의 다른 뜻을 넣은 것은 없음. 은행 안 같은 뜻 쌍이 몇 개 남았다(vomit/throw up, black/dark, hold/keep). |
| 3 | cue | 4 | 정답·파생형 누설 없음. `look`·`find`·`notify`·`call`은 ko를 거의 되풀이한다(가벼움). |
| 4 | chips/decoyChips | 5 | 형태소 단위로 잘 잘랐고 다른 경로로 정답이 재조립되는 것 없음. |
| 5 | 뉘앙스 사실성 | 4 | MAP 65·항생제 1시간·젖산 재측정·Beck 삼징·서맥 60·부신위기 hydrocortisone·IM 에피네프린 외측 허벅지·100.4℉·massive/submassive PE 모두 맞다. 흉통 저울 순서가 임상적으로 거꾸로(아래 심각). |
| 6 | 뉘앙스 설계 | 3 | pair 2개는 전 조합에서 유일. slider 둘이 정답이 둘(BP 98/62, might/can). swap 하나는 선택지를 넣으면 비문(cannulate a larger IV). |
| 7 | 결정 11 | 4 | 전부 허용 범위 안. 다만 손댄 단어가 31/183(17%)로 "1할 안쪽"을 넘고, 형제 주제 맞춤 ko 변경 5건은 꼭 필요하진 않았다(해는 없음). |

## 사실 오류·심각한 문제

1. **패혈증성 쇼크 급속 악화 번들 · 문장 0 "Fluids aren't holding — start norepinephrine now."** — 간호사가 승압제를 **개시 지시**하는 말이 된다. 입력의 역할은 colleague(동료 간호사)이고 brief는 "번들을 조율"이지, 의사 오더가 있다는 장면 설정이 없다. ko "지금 노르에피네프린을 시작하세요"가 이를 더 굳힌다. 영어는 못 고치므로 **ko를 오더 받은 것을 확인·실행하는 복창(closed-loop) 어조로**: `수액으로는 안 버텨요 — 노르에피네프린 지금 시작합니다.` 같은 문장을 예문으로 쓰는 **w-norepinephrine exKo도 같게**. 같은 상황 context 두 번째 장면(의사에게 보고 `She's still hypotensive after the fluids — starting norepi.`)도 간호사가 승압제 개시를 통보하는 말이라 `She's still hypotensive after the fluids — do you want to start norepi?`로.
   - 같은 상황 문장 1 "Get broad-spectrum antibiotics in within the hour."(오더 난 항생제를 시간 안에 **넣는** 것은 간호 업무)과 문장 2 "Recheck the lactate and keep the MAP above 65."(젖산 재측정과 MAP 목표 유지는 패혈증 번들·승압제 적정 파라미터로 간호사가 동료에게 하는 말)는 **문제 없음**.
2. **신경성 쇼크 척수손상 · 문장 2 "Give fluids and consider a pressor and atropine."** — "consider a pressor"는 치료 선택을 **결정하는** 사람의 말이라 간호사끼리의 지시로는 업무 범위를 넘는다. ko "승압제와 아트로핀도 고려하세요" → 의사에게 제안하는 어조로 `수액 주고 있고요 — 승압제랑 아트로핀도 고려해야 할 것 같아요.` w-consider·w-pressor·w-atropine의 exKo(같은 문장)도 같게.
3. **심인성 쇼크 감별 · slider `[mild ache, pressure, stabbing pain]`** — 세 말은 강도가 아니라 **양상**이라 약→강 저울이 안 된다. 더 문제는 순서가 가르치는 바: 찌르는 통증(stabbing)이 압박감(pressure)보다 "센" 쪽에 놓여 더 심각하게 읽히는데, 심장 원인 흉통은 압박·쥐어짜는 느낌이 전형이고 날카롭게 찌르는 통증은 오히려 덜 전형적이다. 같은 양상(심장성) 안의 강도 저울로 바꾼다: `scale: [a little discomfort, pressure, crushing pain]`, `answerAt: 1`, why: `무겁게 눌린다는 말은 'pressure'예요. 심장 원인의 흉통은 흔히 압박감·쥐어짜는 느낌으로 오고, 환자가 쓴 말 그대로 기록해요. 'crushing'은 그보다 훨씬 센 말이라 환자 말을 과장하게 돼요.`
4. **다장기 악화 SBAR·ICU 이송 · 문장 2·4 "central monitoring" ko '중심정맥 감시'** — 영어 "central monitoring"은 중심정맥(CVP) 감시를 뜻하지 않는다. 미국 병원에서는 중앙 모니터 스테이션에서 보는 **집중(중앙) 감시**이거나, 넓게 ICU급 침습 감시를 뜻한다. '중심정맥'은 영어에 없는 말을 보탠 번역이다. 문장 2 ko → `지금 중환자실 입원과 집중 감시를 권합니다.`, 문장 4 ko → `중환자실에서 집중 감시를 받아야 할 것 같아요.`, w-recommend·w-icu·w-admission·w-central·w-monitor exKo(문장 2)도 같게. w-central cue는 "목이나 쇄골 아래로 넣는 라인에 붙는 말"로 중심정맥관을 가리키고 있어 이 문장과 어긋난다 → `말단이 아니라 한가운데의 — 중앙 모니터 스테이션에서 보는 감시에도, 목·쇄골 아래 큰 혈관의 라인에도 붙는 말`.

나머지 저작자 보고 keyPhrase 판정(문제 없음): 폐색전 2 "Prepare thrombolytics and notify the team."(약 준비·팀 통보는 간호 업무), 심장압전 2 "Give a fluid bolus while we prepare the drain."(동료에게 오더 실행을 나누는 말; 압전에서 소량 볼루스는 표준적 임시 조치), 소화관 출혈 0 "Activate the massive transfusion protocol now."(MTP 발동 전화는 흔히 담당·책임 간호사가 건다), 소화관 출혈 2 "Call GI for emergent endoscopy."(협진 연락 전달은 간호 업무). 폐색전 1 "Get a bedside echo to look at the right heart."는 경계선 — 아래 고칠 것에 ko만.

## 고칠 것 — v45

- 폐색전 폐쇄성 쇼크 · 문장 1 ko · "심장초음파를 하세요"가 검사 지시로 읽힌다 · `우심장을 볼 수 있게 침상 초음파 준비해요.`(w-bedside·w-echo·w-look·w-right exKo도 같게)
- 저혈압 초기 활력 인지 · slider · cue "BP 98/62"는 수축기 정상 범위라 `normal`도 맞는 답이 된다 · cue를 `BP 88/54, she feels a little lightheaded. …`로(90 미만이면 normal은 틀리고, 의식 또렷하면 dangerously low는 과함). why의 "수축기 98" → "88"
- 노인 다약제 저혈압 · slider `[might, can, will definitely]` · `might`와 `can` 둘 다 가능성을 말해 정답이 둘 · `[can't, can, will definitely]`, answerAt 1, why에 "can't는 사실과 반대"로
- 대구경 정맥로·수액 설명 · swap · `cannulate a larger IV`는 비문(cannulate의 목적어는 정맥) · 선택지 `cannulate` → `initiate`(간호 기록 용어 "IV initiation"; 환자에게는 낯설다)로, before도 `cannulate` → `initiate`; 꼬리 ` a larger IV in your arm so we can…`은 `put in … in your arm`으로 in이 겹치니 ` a larger IV so we can give fluids quickly.`로
- w-sign · distractorsEn `signal` · "a good signal"도 영어로 맞아 정답이 둘 · `signal` → `symptom`(간호사가 실제로 헷갈리는 sign/symptom)
- 소화관 대량출혈 쇼크 · slider cue "coffee grounds" · 이 상황의 환자는 "vomiting bright red blood"(tagline·문장 3)라 장면과 어긋난다 · cue를 `He's vomiting bright red blood that keeps coming.`로, answerAt 2, why는 "선홍색은 지금 활발히 출혈 중일 수 있어 가장 급하다 — coffee-ground는 위산에 변한 오래된 피"로 순서만 바꿔 유지
- w-antibiotic · cue "패혈증은 한 시간 안에" · 1시간 기준은 **패혈성 쇼크**(의심 패혈증은 3시간 안 재평가) · `패혈성 쇼크는 한 시간 안에 넣어야 한다`
- w-emergent · cue "몇 분 안에 서둘러야 하는" · emergent endoscopy는 "지체 없이"지 분 단위가 아니다 · `당장 처치하지 않으면 위험해 미루지 않고 바로 해야 하는 — 시술 일정에 붙는 말`
- w-look · cue "'~을 보다', '~해 보이다' 모두" · ko '보다'를 그대로 되풀이 · `눈으로 어떤 쪽을 살필 때, 또는 안색이 어떠해 '보일' 때 — 두 뜻 다`
- w-find · cue "찾아낼 때" · ko 되풀이 · `검사로 숨은 이유를 알아낼 때 — 'to ___ the cause'`

## 고칠 것 — 결정 11 (v44 단어·문장)

- w-vomit ko '구토하다' / w-throw up ko '토하다(구토)' · 뜻이 같아 듣고 뜻 고르기에서 정답이 둘 · w-vomit → `구토하다(의학어)`, w-throw up → `토하다(일상어)`; changes-er-shock.yaml에 기록
- w-dark ko '어두운·검은' / w-black ko '검은' · '검은'이 겹친다 · w-dark → `짙은·어두운`(dark stools = 짙은 변); 문장 ko는 그대로
- w-hold ko '(수치를) 유지시키다' / w-keep ko '유지하다·계속하다' · 저작자가 hold를 바꿨지만 '유지'가 여전히 겹친다 · w-hold → `(혈압을) 받쳐 주다·버티다`(tagged 문장 "raise and hold", "Fluids aren't holding" 둘 다 맞음)
- w-activate ko '개시하다' / w-start ko '시작하다' · 같은 뜻 · w-activate → `(프로토콜을) 발동하다`
- w-crash ko '급격히 나빠지다' · 유일한 태그 문장이 명사(`the swollen leg and crash`) · `급변(급격한 악화)`로, 또는 그대로 두되 reel에서 동사로 보충되므로 저우선
- w-give ko '주다·투여하다' / w-run ko '진행하다·투여하다' · '투여하다' 겹침 · w-run → `(펌프로) 돌아가다·진행하다`(tagged 문장 running labs / it's running / pressors running / lines running 모두 자동사)

저작자 변경 목록(54건) 판정: 전부 타당. 공통 목록 7건(hand·today·head·see·come·minute·hour) + 판단분 6건(yes·no·eat·begin·big·through)은 상한 10개 안이고 각각 근거가 맞다(yes/no는 keyPhrase "Yes or no?"에서 가르칠 값 없음, begin은 start와 ko 중복, through는 go through 구로 흡수). 헤드워드 6건(throw up·concerned·closely·go through·water pill·swollen)은 모두 태그 문장과 맞춘 것. 형제 주제 맞춤 ko 5건(draw·culture·rate·septic·climb)은 꼭 필요하진 않았으나 해 없음. 문장 ko 3건(드릴게요·드셨거나 복용하셨나요·예/아니요 표기) 맞음. 저작자가 따로 둔 ko 중 w-take(재다·복용하다)·w-get(가져오다·구하다)·w-cause(원인)·w-keep·w-look은 태그 문장과 맞다.

## 종합

사실 오류는 흉통 저울 하나, 번역 과잉은 central monitoring 하나, 업무 범위는 승압제 개시·pressor 고려 두 문장의 ko가 문제다. 위 목록(심각 4 + v45 10 + 결정 11 6)을 반영하면 내보내도 된다. 뉘앙스의 나머지(MAP·항생제·젖산·Beck·서맥·부신위기·IM 에피네프린·melena·submassive)는 미국 관행과 맞고, 환자 안전을 오도하는 해설은 없다.
