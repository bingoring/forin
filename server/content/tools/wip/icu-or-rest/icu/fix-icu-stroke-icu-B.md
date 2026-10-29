# fix-icu-stroke-icu-B — 한 번에 저작 B 검토 (v46 절 1~6·8)

대상: `icu-stroke-icu.yaml`(A·B 합친 파일), 21상황 126문장 전수. 번호는 `상황-문장`(0부터).
뽑은 표: `_rvB_icu-stroke-icu_{sent,blank,decoy,order}.txt`, 되풀이 빈도 `_rvB_icu-stroke-icu_freq.py`,
아래 distractorsKo 고칠 값의 길이(V20)·되풀이(W19) 확인 `_rvB_icu-stroke-icu_prop.py`(고친 값 전부 넣으면 길이 위반 0, 어간 최다 5회 — 통과).

## 항목별 점수
| 항목 | 점수 | 근거 |
|---|---|---|
| 1 why | 4 | 말하는 방식의 이유를 대체로 잘 짚음. `재협착`(11-4·11-5) 용어만 부정확. |
| 2 빈칸 | 2 | 정답 둘 8, 위험한 처치를 보이는 선택지 5, 장면과 동떨어지거나 소리만 닮은 오답 31문장(re-·p-·c- 두운, thank/greet 묶음 4문장), 관사로 걸러지는 것 1(`an day`). |
| 3 decoy | 2 | 어느 청크 자리에도 안 맞는 조각 34(대부분 장소 구나 청크 둘을 합친 긴 구), 조립하면 ko에 맞거나 다른 맞는 행동이 되는 것 15, 조립하면 위험한 것 2. |
| 4 distractorsKo | 2 | ①②⑤는 대체로 지킴. ⑥ 안전에서 40문장이 실패. 저작자의 'X와 Y 곁가지' 판단이 대부분 틀렸다(비타민 K·흡인·라인·백밸브마스크·응급 약·NIHSS·FiO2는 곁가지가 아님). 감시·검사 대상 바꾸기(실패 1)와 처치를 확인·준비로 바꾸기(실패 3)도 남아 있다. |
| 5 order | 4 | 21장 중 19장은 순서가 하나로 정해진다. S3·S16만 3↔4를 바꿔도 자연스럽다. |
| 6 tag·icon | 4 | 태그가 역할을 말하고 상황 안에서 일관됨. order 아이콘은 전부 compass(무난함). |
| 8 파일럿 갈래 | 2 | 갈래 2(장면과 동떨어진 빈칸 오답)와 갈래 5(decoy·오답 뜻이 정답과 겹침)가 되풀이됨. 실패 7가지 중 1·3·6·7이 주제 전체에 퍼져 있다. |

되풀이 상한(어간, 현재 파일): 최다 4회(통증·감염·식사·수술·조명·기다·시력·침대·이송) — 통과. W18도 통과(최다 3회).

## 사실 오류·심각한 문제
1. **'X와 Y'에서 Y를 바꾼 오답 중 상당수가 안전 실패.** 10-0 비타민 K(와파린 역전의 필수 약 — AHA 2022 ICH 지침: 4F-PCC와 IV 비타민 K),
   18-0 흡인(삽관에 필수), 17-1 라인(이송 중 정맥로), 14-4 백밸브마스크·14-1 응급 약(중환 이송의 필수 물품), 17-5 NIHSS(LKW와 함께 시술 판단의 핵심),
   19-0 FiO2(저산소 대응 그 자체)는 곁가지가 아니다. 학습자가 오답대로 하면 그 물품·처치가 빠진다.
2. **검사·약·부위·경로를 바꾼 오답:** 10-1 응고 검사를 혈당·전해질로, 10-3 와파린을 헤파린으로·INR을 혈당으로, 19-4 ABG를 소변 검사·체중으로,
   9-3 튜브 끝을 '목까지'로·경로를 '입'으로, 1-2 혈압약을 진통제·해열제로, 12-2 항경련제를 식단으로, 15-1 수술을 휴식으로, 17-0 혈관조영을 수술·전원으로 바꿨다.
3. **유량을 '보고값'으로 본 것:** 19-5 "15리터로 맞출게요"는 보고가 아니라 말하는 사람이 할 처치(용량)다. 20·25리터로 바꾸면 안 된다.
4. **빈칸·decoy가 위험한 행동을 보인다:** 2-4 `until`/`unless`는 삼킴 검사 전에 얼음 조각을 주라는 말이 된다. 5-2·3-3 `feed`는 의식이 처지거나 삼킴이 확인되지 않은 환자에게 먹이는 말이 된다.
   8-1 `flush`(혈관작용제 볼루스)·`clamp`(혈압 조절 중단), 10-0 `return`/`store`(역전제 보류). 12-2 decoy `with food`는 "may start with food"로 조립되고, 9-0 `from the kitchen`은 연하곤란 환자에게 일반식을 주는 말이 된다.
5. **⑤ 뒤집기:** 3-1 `가시면`·11-1 `사라지면`(악화 → 호전). 7-3 `밖의`도 반의어다.
6. (A 몫 문장 사실 — 참고만) 4-1 "This position also helps blood flow to your brain": 급성 허혈성 뇌졸중에서 머리를 올리면 뇌 혈류는 오히려 줄어드는 쪽이다(눕히면 혈류가 늘고, HeadPoST에서는 결과 차이가 없었다).
   두부 거상의 근거는 흡인 예방과 정맥 환류(두개내압)다. 3-4 "A little grogginess right after the medicine is normal"은 tPA 뒤라면 새 졸림이 출혈 신호라 '정상'이라고 하면 안 된다(혈전제거술 진정 뒤라면 맞음).
   — notes로 넘기거나 문장을 고칠지는 부르는 쪽이 결정.

## 저작자가 판정을 부탁한 곳
| 곳 | 판정 | 새 값 |
|---|---|---|
| 'X와 Y'의 Y 교체 | **대부분 실패.** Y가 진짜 곁가지일 때만 통과. 16-4(영상팀·약사)는 듣는 사람이 할 일(역전제 투여)이 그대로라 통과. 19-1(약국·영상팀)은 의사 연락이 남고 알릴 대상만 바뀌어 통과. 10-0·14-1·14-4·17-1·17-5·18-0·19-0은 실패(아래 표). | 아래 표 |
| 보고값 숫자(8-3 140~190, 19-3 70%대) | **통과.** 듣고 고르는 값이고 행동이 아니다. 목표 160·5분·1시간을 안 건드린 것도 맞음. **단 19-5 '15리터'는 보고값이 아니라 처치 → 실패.** | 19-5는 아래 표 |
| 3-0·3-2·7-2 often·closely → 꼼꼼히·차분히·조용히·멀리서·느긋하게 | **사정 간격을 바꾼 것은 아니다**(숫자가 아니라 부사). 다만 3-2 `멀리서`는 환자 곁을 떠나는 말(실패 3)이고, 7-2 `느긋하게`는 뇌탈출 감시를 느슨하게 하는 잘못된 안심이라 실패. 3-0 `꼼꼼히`·3-2/7-2 `조용히`는 통과. 그러나 3-0·3-2·7-2·8-1·12-1에서 방식 부사 바꾸기가 되풀이되어 모양으로 걸러진다(실패 5) — 하나씩 다른 틀로. | 3-0 X2, 3-2 X2, 7-2 X2 아래 표 |
| 8-1 slowly → 꼼꼼히·차분히 | **실패.** slowly는 적정 속도 지시(처치 방식)다. 빼면 급히 내려도 되는 말이 된다. | 아래 표 |
| 3-1·11-1 트리거만 다른 오답 | **실패.** `가시면`·`사라지면`은 뒤집기(⑤)다. 3-1 `생기면`은 이미 두통이 있는 환자에게 악화를 알릴 기준을 없애고, 11-1 `심해지면`은 재발을 알릴 기준을 없앤다(보고 시점 = 처치 시점). 트리거는 두고 '말해 주세요' 자리(들림)를 다른 알리는 방법으로. | 아래 표 |
| 6-1 확인 대상 → 차트·손목 밴드 | **실패**(실패 1·3). 출혈이 의심되는 순간 신경 검진 대신 차트를 보는 말이 된다. 검진은 두고 연락할 곳을 바꾼다. | 아래 표 |
| 16-4 영상팀·약사 / 19-1 약국·영상팀 | **통과**(위 설명). 그대로 둔다. | — |

## 고칠 것

### A. distractorsKo — 안전(⑥, 실패 1~3) 40건
(빈칸 표시 = 그 오답은 그대로)
| 곳 | 문제 | 새 X1 | 새 X2 |
|---|---|---|---|
| 0-0 | X2 `한 손`: 양쪽 비교를 빠뜨림 | — | 감각을 확인할 테니 제 두 손을 꽉 쥐어 보세요. |
| 0-1 | `몇 시`·`몇 요일`: NIHSS 질문 대상을 바꿈(실패 1) | 여기가 어디인지, 지금 몇 월인지 적어 주시겠어요? | 여기가 어디인지, 지금 몇 월인지 떠올려 보시겠어요? |
| 0-2 | X2 `고개로만`: 검사 지시(눈만) 자체를 바꿈 | — | 눈으로만 제 볼펜을 따라와 주세요. |
| 1-2 | 혈압약을 진통제·해열제로(약 바꿔치기) | 혈압을 꾸준히 낮추는 약을 드리고 있어요. | 혈압을 부드럽게 낮추는 약을 방금 새로 달았어요. |
| 3-1 | 트리거 넓힘/뒤집기(위 판정) | 두통이 심해지면 바로 콜벨을 눌러 주세요. | 두통이 심해지면 바로 손을 흔들어 주세요. |
| 3-2 | X2 `멀리서`: 곁을 떠남 | — | 출혈 징후가 있는지 밤새 지켜보고 있어요. |
| 5-1 | X1 `계속 기다려`: 가족이 변화를 알리지 않게 됨 | 작은 변화도 중요하니까 간호사실에 알려주세요. | — |
| 5-4 | 명령 반응 항목을 바꿈(눈→입·팔, 실패 1) | 가족분 손을 꽉 쥐고 눈을 떠 보시라고 요청해 볼게요. | 제 손을 꽉 쥐고 눈을 떠 보시라고 크게 불러 볼게요. |
| 5-5 | 의식(깨우기) 기준을 호흡·말로 바꿈(실패 1) | 어제보다 깨우기 힘들어지면 바로 의사 선생님께 연락할게요. | 낮보다 깨우기 힘들어지면 바로 의사 선생님께 연락할게요. |
| 6-1 | 신경 검진 → 차트·손목 밴드(실패 1·3) | 신경학적 검진을 확인하고 지금 CT실에 연락드릴게요. | 신경학적 검진을 확인하고 지금 담당 간호사께 연락드릴게요. |
| 6-4 | X2 `동공과 맥박`: 나열 항목을 바꿈(실패 1) | — | 동공과 쥐는 힘 결과를 지금 바로 의사께 알릴게요.(뒤 단계) |
| 7-2 | X2 `느긋하게`: 잘못된 안심 | — | 동공과 반응을 둘이서 번갈아 지켜보고 있어요. |
| 8-0 | 목표 범위 확인 → 화면 밝기·알람 소리(확인을 빠뜨림) | 인계하기 전에 목표 범위부터 확인하죠. | 이송하기 전에 목표 범위부터 확인하죠.(확인은 두고 언제 하는지만 바꿈 — titrate가 들림) |
| 8-1 | slowly를 지움(위 판정) | 적정하기 전에 니카르디핀 펌프 설정부터 확인해 주세요. | 니카르디핀을 천천히 적정하는 동안 곁을 지켜 주세요. |
| 9-3 | 튜브 끝 `목까지`(부위)·`입을 통해`(경로) | 코에 넣은 뒤 테이프로 고정해요. | 코로 넣기 전에 길이를 재요. |
| 9-4 | X1 `시력 검사`: 검사 바꿔치기 | 며칠 뒤에 삼킴 연습을 다시 해 볼 거예요. | — |
| 9-5 | X1 `따뜻한 음식`: 식이 질감 지시가 사라짐(흡인) | 안전하다고 확인되면 부드러운 음식 목록을 드릴게요. | — |
| 10-0 | 비타민 K를 채혈 용지·이송 침대로(필수 약을 빠뜨림) | 네, 지금 역전제와 비타민 K를 투여하죠.(뒤 단계) | 네, 지금 역전제와 비타민 K를 처방받죠.(앞 단계) |
| 10-1 | 응고 검사 → 혈당·전해질(검사 바꿔치기) | 응고 검사를 채혈하고 그 자리를 꾹 눌러 주세요. | 응고 검사 튜브에 환자 라벨을 붙여 주세요. |
| 10-3 | 와파린 → 헤파린(약 이름), INR → 혈당(검사) | 와파린을 복용 중이라 INR 결과가 나오면 바로 알릴게요. | 와파린을 복용 중이라 마지막 복용 시각을 여쭤볼게요.(INR보다 먼저 하라는 뜻이 되지 않게 `부터`를 뺌) |
| 10-5 | 역전 뒤 재검을 몸무게·자세로(재검을 빠뜨림) | 투여하고 나면 한 시간 동안 반응을 지켜볼게요. | 투여하고 나면 주사 줄을 생리식염수로 씻을게요. |
| 11-1 | `심해지면`(재발 기준 없앰)·`사라지면`(⑤) | 위약감이 다시 생기면 바로 콜벨을 눌러 주세요. | 위약감이 다시 생기면 바로 손을 들어 주세요. |
| 12-1 | X1 `편하게 눕혀`·X2 `조용히 지켜봤고`: 안전 조치를 없앰 | 안전하게 조치했고, 지금 의사 선생님이 오고 계세요. | 안전하게 조치했고, 지금 담당 간호사께 알리고 있어요. |
| 12-2 | X1 `식단을 바꿀`: 항경련제를 식단으로 | 가족분과 함께 지켜보고, 더 생기지 않도록 약을 시작할 수도 있어요. | — |
| 13-1 | X2 `잠시`: 이동 중 지지를 줄임(낙상), X1 `안내`: 말로만 돕는 것으로 읽힘 | 천천히 할 거고, 끝나면 제가 의자에 앉혀 드릴게요. | 천천히 할 거고, 먼저 제가 보조 벨트를 채워 드릴게요. |
| 14-1 | 응급 약을 담요·차트로(필수 물품을 빠뜨림) | 휴대용 산소통이 가득 찼는지 먼저 볼게요. | 휴대용 산소와 응급 약은 침대 아래에 둘게요. |
| 14-4 | 백밸브마스크를 체온계·충전기로 | 이송용 모니터 배터리가 찼는지 볼게요. | 이송용 모니터와 백밸브마스크는 발치에 둘게요. |
| 15-1 | X1 `휴식을`: 처치 바꿔치기 | 압력을 완화하기 위해 수술 동의서를 받을 수도 있어요. | — |
| 16-0 | 역전 시작을 혈압 측정·라인 확인으로(실패 3) | tPA를 중단하고 역전 중에 활력징후를 재세요. | tPA를 중단하고 역전 중에 출혈 부위를 보세요.(중단은 두고 역전 뒤 단계로 — 가져오기·계산은 실패 3) |
| 16-2 | 혈압 조절을 의자·조명 조절로(처치가 사라짐) | 지금 바로 동맥관 수치를 띄우죠. | 지금 바로 혈압 커프를 바꾸죠. |
| 17-0 | 혈관조영 → 수술·전원(시술 바꿔치기) | 즉시 혈관조영을 위해 동의서를 받죠. | 즉시 혈관조영을 위해 이송팀을 부르죠. |
| 17-1 | 라인을 가운·차트로 | 이동하기 전에 기도와 라인부터 정리하세요. | 이동하기 전에 기도와 라인을 테이프로 고정하세요. |
| 17-3 | X1 `살짝`: 악화를 줄여 보고(잘못된 안심) | 지난 십 분 사이 왼쪽이 완전히 저렸어요. | — |
| 17-5 | LKW → 식사 시각, NIHSS → 보험(핵심 정보를 빠뜨림) | 마지막으로 멀쩡했던 시각과 NIHSS 점수를 화면으로 보여드릴게요. | 마지막으로 멀쩡했던 시각을 가족분께 다시 여쭤볼게요.(LKW 재확인 = 앞 단계. 질문으로 바꾼 꼴이라 경계선이니, 고치는 쪽이 더 나은 앞·뒤 단계를 찾으면 그쪽으로) |
| 18-0 | 흡인을 거즈·장갑으로 | 삽관 트레이와 흡인은 머리맡에 둘게요. | 삽관 트레이와 흡인은 다 쓰면 치워 둘게요. |
| 18-1 | 기도 위치 잡기를 조명·모니터로 | 사전 산소화하는 동안 흡인을 켜 두죠. | 사전 산소화하면서 마스크를 꼭 맞추죠. |
| 18-4 | 삽관 순간 튜브 대신 마스크·장갑을 건넴 | 준비되시면 튜브 커프부터 확인해 드릴게요. | 튜브를 건네기 전에 스타일렛을 넣어 둘게요. |
| 19-0 | FiO2 올리기를 침대·조명으로(산소 처치가 사라짐) | 기도를 흡인하고 흡인 통을 갈죠. | 기도를 흡인하고 산소 줄 연결을 보죠. |
| 19-4 | ABG → 소변 검사·체중 | 스탯으로 흉부 엑스레이 판을 등 뒤에 넣죠. | 스탯으로 흉부 엑스레이와 ABG 결과를 같이 보죠. |
| 19-5 | 유량 15 → 20·25 L(용량) | 비재호흡마스크로 바꾸고 백이 부푸는지 볼게요. | 맞는 크기의 비재호흡마스크로 바꾸고 백을 채울게요. |

### B. distractorsKo — 정답 둘(④·실패 4) 6건
| 곳 | 문제 | 새 값 |
|---|---|---|
| 4-4 X2 | `매트리스 머리 쪽` = 침대 머리 쪽 | 들것 머리 쪽을 약 삼십 도 정도 세워 둡니다. |
| 6-0 X2 | `통증이`가 두통을 포함함 | 가려움이 심해지는 건 저희가 아주 심각하게 받아들이는 신호예요. |
| 8-5 X1·X2 | `문자 드릴게요`·`전화로 알려드릴게요`가 모두 '알려 드린다'는 뜻(정답 행동을 품음) | X1 오 분 뒤에 혈압을 다시 확인하고 차트에 적을게요. / X2 오 분 뒤에 혈압을 다시 확인하고 펌프를 맞출게요. |
| 11-4 X2 | `막힐` ≈ 다시 좁아짐(재폐색) | 동맥은 다시 열렸지만, 또 부을 수도 있어요. |
| 19-2 X1 | `기다리는 동안` ≈ 준비하는 동안 | 의사 선생님이 오실 때까지 계속 백으로 호흡시켜 주세요. |
| 20-2 X1 | `좋아하셨을` ≈ 원하셨을 | 그분이 원하셨을 것에 대해 의사 선생님과 이야기해 봐요. |

### C. distractorsKo — 모양 2건
- 3-0 X2 `차분히`: 방식 부사 바꾸기가 3-0·3-2·7-2·8-1·12-1에 되풀이됨(실패 5) → `새로운 위약감이나 두통이 있으면 바로 보고할게요.`(뒤 단계). X1 `꼼꼼히`는 그대로.
- 7-3 X2 `밖의`: 반의어(⑤) → `통증은 두개골 안의 압력을 높여요.`

### D. 빈칸 — 안전 5건
| 곳 | 문제 | 새 값 |
|---|---|---|
| 2-4 | `until`·`unless`는 검사 전에(또는 검사에 떨어져도) 얼음을 준다는 말 | 빈칸 `once`는 두고 오답을 `because`·`although`·`whereas`로(어느 것도 검사 전 섭취를 지시하지 않음) |
| 3-3 | `feed`: 삼킴을 확인하지 않은 환자에게 매시간 먹임 | `feed` → `turn` |
| 5-2 | `feed`: 의식이 처진 환자에게 먹임 | `feed` → `weigh` |
| 8-1 | `flush`(볼루스)·`clamp`(혈압 조절 중단) | `flush` → `label`, `clamp` → `chart`(`hang`은 그대로) |
| 10-0 | `store`·`return`: 역전제를 보류함 | `store` → `warm`, `return` → `scan` |

### E. 빈칸 — 정답 둘 8건
| 곳 | 문제 | 새 값 |
|---|---|---|
| 1-1 | `screen`도 맞는 말("The screen just means we're watching") | `screen` → `pump` |
| 7-3 | `volume`: 부종은 두개 안 부피도 올림(참) | `volume` → `oxygen` |
| 8-0 | `floor`: 혈압 하한(target floor)으로 쓰는 말 | `floor` → `room` |
| 15-1 | `therapy`: 삼투 요법도 압력을 낮추는 치료 | `therapy` → `bedrest` |
| 15-2 | `anything`: "doing anything we can"이 같은 뜻 | 빈칸을 `brain`으로 옮기고 오답 `heart`·`lungs`·`kidneys` |
| 15-3 | `time`: "no time to swell safely"가 뜻이 통함, `money`·`patience`는 동떨어짐 | 빈칸을 `swell`로 옮기고 오답 `grow`·`drain`·`breathe`(`move`는 뇌 이동으로 읽혀 피함) |
| 20-1 | `sudden`·`recent`도 참인 말 | `sudden`·`recent`·`unusual` → `mild`·`small`·`simple` |
| 20-3 | `afraid of`가 성립(가족이 듣고 싶은 참인 말), `angry of`·`alone of`는 문법으로 걸러짐 | `afraid`·`angry`·`alone` → `proud`·`fond`·`tired` |

### F. 빈칸 — 문법·관사 1건
- 10-5 `an [day/week/month]`가 관사로 걸러짐 → 빈칸을 `labs`로 옮기고 오답 `weight`·`dressing`·`diet`.

### G. 빈칸 — 장면과 동떨어지거나 소리만 닮은 오답(실패 6) 31건
| 곳 | 지금 | 새 오답 |
|---|---|---|
| 0-5 | arm/foot/shoulder ("stand on your right arm") | 빈칸을 `right`로 옮기고 `left`·`far`·`near` |
| 1-2 | blanket/pillow/snack | `blanket`·`bath`·`drink` |
| 1-3 | budget/bill/order | `baseline`·`schedule`·`order` |
| 2-2 | cut ("cut your lips") | `cut` → `numb` |
| 6-5 | angry/empty/hungry | `late`·`up`·`warm`(`away`는 가족을 내보내는 반대말이라 피함) |
| 7-4 | thank/greet/wave | `follow`·`relieve`·`thank` |
| 8-5 | remove/refill/replace (re- 두운) | `predict`·`estimate`·`announce` |
| 9-0 | loud | `loud` → `stiff` |
| 9-2 | repair/rename/remove | `cancel`·`photograph`·`reschedule` |
| 10-2 | refill/rinse/rename (re- 두운) | `document`·`explain`·`photograph` |
| 11-0 | loudly/rarely/lazily | `briefly`·`remotely`·`rarely` |
| 11-2 | loud/cold/bright | `fast`·`slow`·`thick` |
| 11-5 | repeat/reveal/remove (re- 두운) | `cause`·`predict`·`measure` |
| 12-1 | thanking/greeting/visiting | `relieving`·`following`·`thanking` |
| 12-2 | loudly/politely/lazily | `briefly`·`remotely`·`rarely` |
| 13-1 | praise/thank/greet | `praise`·`time`·`quiz` |
| 14-2 | angry/happy/sorry | `late`·`full`·`closed` |
| 14-4 | garden/hotel/kitchen monitor | `fetal`·`baby`·`glucose` |
| 14-5 | eat/nap | `eat` → `rest`, `nap` → `pack` |
| 16-2 | cover/copy/clean (c- 두운) | `chart`·`discuss`·`print` |
| 16-4 | thank/greet/visit | `follow`·`relieve`·`thank` (thank는 7-4·12-1·13-1 정리 뒤 주제 3회 이하) |
| 17-0 | tired/hungry/shy | `dressed`·`seated`·`washed` |
| 17-1 | eat/nap/shower | `document`·`talk`·`sign` |
| 17-4 | painting | `painting` → `inspecting` |
| 17-5 | price/shade/height | `card`·`form`·`sticker` |
| 18-1 | polish/paint/praise (p- 두운) | `describe`·`document`·`photograph` |
| 18-2 | tired/hungry/shy ("tired to assist"는 문법으로도 걸러짐) | `late`·`scheduled`·`assigned`(`unable`·`afraid`는 보조 거부 = 반대말) |
| 18-5 | loose/dizzy/funny | `low`·`high`·`short` |
| 19-0 | rinse/rename/relax (r- 두운) | `read`·`note`·`print` |
| 19-5 | miles/pounds/inches | `percent`·`drops`·`milliliters` |
| 20-2 | eaten/worn/owned (임종 결정 장면에서 가볍게 들림) | `feared`·`regretted`·`earned` |
- 위 D~G 새 오답을 전부 넣은 W18 계산(`_rvB_icu-stroke-icu_blankprop.py`): 최다 3회(chart·label·weigh·photograph·late 등) — 통과.
- 묶음 되풀이(참고): 시간 단위 묶음(0-1 minute/second/decade, 10-1 daily/weekly/monthly, 12-4·15-5 hours/days/weeks)이 4문장. 12-4나 15-5 하나는 다른 축으로 바꾸기를 권함(예: 15-5 `minutes` → `beeps`·`steps`·`pages`).

### H. decoy — 조립하면 위험 2건
- 12-2 `with food` → "may start with food"(발작 직후 식사) → `an ice pack`
- 9-0 `from the kitchen` → "give nutrition from the kitchen"(연하곤란 환자에게 일반식) → `her pillow`

### I. decoy — 조립하면 ko에 맞거나 다른 맞는 행동이 됨 15건
| 곳 | 조립 결과 | 새 decoy |
|---|---|---|
| 0-3 | "no rush to explain" — ko에 '대답'이 없어 그대로 맞음 | `Take your seat` |
| 6-0 | "…very seriously at this hospital" = here | `A mild headache` |
| 6-2 | "a chest X-ray" — ko '영상 촬영'에 맞음 | `a urine test` |
| 8-0 | "confirm the pump settings before we titrate" — 맞는 다른 행동 | `the diet order` |
| 10-1 | "and label it stat" — 맞는 다른 행동 | `and freeze it` |
| 10-3 | "check his last dose" — 맞는 다른 행동 | `his glucose first` |
| 12-3 | "…bump into to the corner" = 치워 뒀어요 | `lean on` |
| 16-3 | "— point it out now" ≈ 보고 | `His right eyelid` |
| 17-1 | "airway and wristband" — 맞는 다른 확인 | `and glasses` |
| 17-2 | "I'll call from the bedside to the … team" ≈ 연락 | `to the front desk` |
| 18-0 | "intubation tray and tape" — 맞는 다른 준비 | `and lunch ready` |
| 20-0 | "I'll be honest about all this" — 같은 뜻 | `quick` |
| 20-2 | "about what he would have said"(청크 둘을 합친 구) — 같은 뜻 | `you would have` |
| 20-3 | "around the bed" = 주변 | `in the hallway` |
| 20-5 | "Take whatever time with your family" ≈ 같은 뜻 | `Take whatever food` |

### J. decoy — 어느 청크 자리에도 안 맞음(실패 7) 34건
각각 정답 청크 하나와 같은 자리·같은 모양의 틀린 구로 바꾼다.
| 곳 | 지금 | 새 decoy(대신하는 청크) |
|---|---|---|
| 0-2 | my badge | `Follow my badge` (Follow my finger) |
| 1-1 | to the doctor | `your meals` (your numbers) |
| 1-2 | through the line | `a warm blanket` (a medicine) |
| 1-5 | than we would for a fever | `for a fever` (for a clot) |
| 2-0 | from a cup | `you eat` (you drink) |
| 2-4 | in a small cup | `a popsicle` (ice chips) |
| 3-1 | if you feel cold | `if your back` (if your headache) |
| 3-4 | from the IV | `the procedure` (the medicine) |
| 4-2 | if you get cold | `any draft` (any discomfort) |
| 4-4 | at the monitor | `the side rails` (the head of the bed) |
| 5-1 | about the room | `letting him` (letting me) |
| 5-2 | to the light | `sleeps` (responds) |
| 6-5 | by the window | `fix the bed` (sort this out) |
| 7-4 | with the pager | `the pharmacy` (the doctor) |
| 8-3 | on the monitor | `one-twenty and one-fifty` (숫자 청크) |
| 8-4 | right now | `This is a fall` (This is a bleed) |
| 10-2 | to limit the delay | `the swelling` (the bleeding) |
| 11-1 | if you feel itchy | `if any itching` (if any weakness) |
| 11-5 | your temperature | `Keeping your temperature` (Keeping your pressure) |
| 12-4 | or so | `two seconds` (two minutes) |
| 14-2 | to ask about parking (실패 6의 parking 그대로) | `for lunch` (for us) |
| 14-4 | and the extra pillow | `the extra pillow` (the bag-valve mask) |
| 14-5 | with the porter | `to call` (to leave) |
| 16-1 | and getting him a blanket | `a blanket` (to CT) |
| 16-4 | the saline flush | `page pharmacy` (page neurosurgery) |
| 17-3 | all by itself | `Her left hand` (Her left side) |
| 17-5 | and her room number(병실 번호) | `and her pain` (and her NIHSS) |
| 18-1 | and clean his glasses | `his IV pole` (his airway) |
| 18-2 | and the light is bright | `to sign` (to assist) |
| 18-3 | so we need to stay calm | `his left arm anymore` (his airway anymore) |
| 18-4 | with both hands | `the gloves` (the tube) |
| 19-0 | and let's clean the bed | `the lights` (the FiO2) |
| 19-3 | after the shift change | `into the nineties` (into the seventies) |
| 19-5 | at the bedside | `to the cardiac monitor` (to the non-rebreather) |

### K. order 2건
- **S3 재관류 후 감시:** 3↔4를 바꿔도 자연스럽다("…watching for bleeding." → "A little grogginess … is normal, though."). 3줄을 2줄의 call button에 묶는다:
  3줄 `If you feel groggier than you do now, that's when to press it.`(ko `지금보다 더 몽롱해지면 그때 누르시면 돼요`, note `기준`) — 4줄로 옮기면 `it`이 가리킬 것이 없고, 2줄 앞으로 가도 마찬가지다.
  order `why`도 "…호출 기준을 알려 준 뒤, 이 모두에 더해 출혈을 지켜본다고 맺어요"로 고친다(3-4 '몽롱함은 정상'이 tPA 뒤에는 위험한 안심이라는 사실 문제도 함께 피함).
- **S16 tPA 후 대량 뇌출혈:** 3·4줄이 둘 다 `Alongside …`로 시작해 3↔4가 바뀌어도 맞다(파일럿 갈래 3). →
  3줄 `While reversal runs, let's control his blood pressure right now.` /
  4줄 `With reversal and pressure underway, I'm calling neurosurgery and getting him to CT stat.`

### L. why·tag 1건
- 11-4 tag `재협착 설명`, 11-5 why "앞 문장의 재협착" — 혈전제거술 직후 문제는 재협착(수개월 뒤 생기는 내막 증식)이 아니라 **재폐색**이다. → tag `재폐색 설명`, why는 "앞 문장의 다시 좁아짐(재폐색)을 가리켜요"로.

### 고치는 쪽에 남길 말
- W19 여유: 위 A~C를 다 넣으면 `이송` 어간이 정확히 5회(상한)다. 더 쓰지 말 것. `전에`는 3회로 줄었다.
- decoy 새 값(H~J)은 스크립트로 V18(청크와 같지 않음·`en` 안에 없음)을 보지 않았다. `Follow my badge`·`Keeping your temperature`처럼 `en`과 앞부분이 같은 것이 있으니 반영 뒤 verify를 꼭 다시 돌릴 것.
- 고칠 값은 처치를 안 건드리면서 ko 틀을 되도록 남기는 쪽으로 골랐다. 그래도 틀이 많이 바뀐 줄(예: 9-3·14-4 X1)은 고치는 쪽이 같은 뜻으로 틀을 더 살려도 된다. 단 앞·뒤 단계·장소·방법 말고 다른 것을 바꾸지 말 것.

### 참고(고칠 것 아님 — chunks는 B 몫이 아님, 보고만)
구 경계에서 끊긴 청크: 11-4 `once / more`, 19-3 `after he / aspirated`, 14-3 `for a safe / transfer`, 13-1 `the whole / time`, 5-2 `how he / responds`, 5-1 `letting me / know`.

## 고칠 것 개수
- 합계 **147** = distractorsKo 48(안전 40 · 정답 둘 6 · 모양 2) + 빈칸 45(안전 5 · 정답 둘 8 · 문법 1 · 실패 6 31) + decoy 51(위험 2 · 정답 둘/맞는 다른 문장 15 · 자리 없음 34) + order 2 + why/tag 1
- 그중 **안전 47**(distractorsKo 40 · 빈칸 5 · decoy 2), **정답 둘 29**(distractorsKo 6 · 빈칸 8 · decoy 15)

## 종합
아직 내보내면 안 된다. 'X와 Y 곁가지' 방식이 필수 물품·처치(비타민 K·흡인·라인·BVM·응급 약·FiO2·NIHSS)를 지우는 오답을 만들었고,
검사·약·경로·유량을 바꾼 오답도 남아 있다. 위 A~L을 반영한 뒤 verify를 다시 돌리고, 바뀐 오답만 다시 보면 된다.
