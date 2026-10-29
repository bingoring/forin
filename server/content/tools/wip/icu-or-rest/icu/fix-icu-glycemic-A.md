# icu-glycemic — A 검토 (v45 1~7 + 기계적 전수 확인 + context 핸드오프 모양·swap ko)

대상: `icu-glycemic.yaml`(A·B 합친 파일, `icu-glycemic.pre-fix.yaml`과 같음). 비교: base, changes(단어 ko 가르기 16·삭제 23·문장 태그 빼기 26), in-…json, notes-A·B.
단어 217개·문장 105개·뉘앙스 45문항을 스크립트(`review_icu-glycemic_A_dump.py`, `review_icu-glycemic_A_checks.py`, 출력은 `_rv_icu-glycemic/`)로 모두 뽑아 표로 놓고 판정했습니다.
확인한 것: chunks 전부, swap 이어 읽기 전부, distractorsEn 품사 전부, decoyChips 전부(민감어 목록 대조), 단어 길이 규칙(위반 0), context 세 장면에 `word`가 있는지(전부 있음, 활용형 포함), 은행 안 같은 ko(없음).
**pair 문항은 이 주제에 없습니다**(slider 21·context 21·swap 6). 그래서 pair 전 조합 확인은 해당이 없습니다.

## 항목별 점수

| # | 항목 | 점수 | 근거 |
|---|---|---|---|
| 1 | distractorsEn | 4 | 철자·소리가 닮은 오답이 대부분입니다. 품사가 다른 오답 8건(★), 정답으로도 맞는 오답 1건(progress↔proceed: ko '진행하다'가 그대로 맞음) |
| 2 | distractorsKo·길이 | 4 | 길이 규칙 위반 0건, 동의어 오답 없음. ko를 고칠 단어(stick·clear·flag)는 오답도 다시 써야 함 |
| 3 | cue | 4 | 정답 노출 없음. often의 cue가 ko '자주'를 되풀이함. flag·clear의 cue는 문장 속 쓰임과 뜻이 다름 |
| 4 | chips/decoyChips | 4 | 형태소에 맞춰 잘 잘랐음. `die`(diabetes), `rip`(rapid)는 ICU 장면에서 꺼림칙함. `sue`·`flesh`·`mad`·`smoke`는 가벼운 것 |
| 5 | 뉘앙스 사실 정확성 | 3 | ICU에서 신속대응팀(RRT) 호출, 담당의에게 알리는 것을 '부족한 조치'로 가르침, 경관영양 중단 때 포도당 선택지가 빠짐, 스테로이드 slider 방향 오류 |
| 6 | 뉘앙스 설계 | 3 | slider 정답 둘 2건(may/should, keep/lower), 순서가 깨진 slider 1건(stays flat→peaks→crashes), 뜻이 달라 어색한 context 1건(S16), 간호사가 의사에게 명령조로 말하는 `의사에게` 장면 3건 |
| 7 | 결정 11(v44 단어·문장) | 4 | 변경량은 적당함. 부사가 묶인 헤드워드(quick)와 구의 일부(away·double)가 남음. 뜻이 다른 태그 6건, 지킬 수 없는 약속·업무 범위 밖 문장 4건 |

## 저작자 변경 판정 (changes 65건)

**과하지 않습니다. 되돌릴 것은 없습니다.**
- 쉬운 단어 23개 삭제: 공통 목록 13개와 판단분 10개(상한 10)입니다. 모두 타당합니다.
- ko 가르기 16건: frequently '빈번하게', level '수준', number '숫자', sick '몸이 안 좋은', update '경과를 알리다', cut '확 줄이다', bump '한 칸 올리다', up/down '상승/하락', confirm '확정하다', verify '검증하다', document '문서로 남기다'는 근거가 있습니다. drive '좌우하다'는 조금 약하지만 받아들일 만합니다.
- **흠이 남은 것 2건(→ W1·W5)**: quick '재빠른'은 태그 6문장 중 4개가 quickly이고, 'quick pinch'에도 '재빠른'은 어색합니다. clear '분명한/가시다'는 keyPhrase 11.0 "kidneys clear insulin"(배출)을 덮지 못합니다.
- 문장 태그 빼기 26건은 모두 쉬운 단어 태그만 뺐습니다. 문제없습니다.

## 저작자가 짚은 문장·단어 판정

| 대상 | KP | 판정 |
|---|---|---|
| 2.6 "You won't need this insulin forever, and we'll stop it as you improve." | 아님 | **타당, 고침(S1)**. 원래 당뇨가 있는 환자는 주입을 끊어도 피하 인슐린으로 이어 갑니다(S10이 바로 그 장면). '이 주입'으로 한정하고 "주사로 바꾸거나 멈춘다"로 고칩니다 |
| 15.2 "Recheck in five minutes…" | **KP** | **사용자 결정 — 바꿈 권고**. 아래 KP 표 1 |
| 16.1 "…start dextrose if he's dropping." | **KP** | **사용자 결정 — 바꿈 권고(약함)**. KP 표 2 |
| 18.1 "Start dextrose and recheck…" | **KP** | **사용자 결정 — 유지 권고**. 실제 저혈당 상황이고, 간호사가 시행하는 저혈당 프로토콜(standing order) 범위입니다. B 검토에서 why에 "프로토콜대로"를 넣으면 충분합니다 |
| 14.3 "When they don't match, I trust the lab value." | 아님 | **타당, 안전, 고침(S6)**. 정맥 검사실 값이 기준이라는 원칙은 맞습니다. 다만 "검사실 값을 믿는다"로 끝나면, 증상이 있는 저혈당에서 검사실 결과를 기다리며 처치를 미루는 쪽으로 읽힙니다. chunks도 `the lab / value`로 복합명사를 끊었습니다 |
| stick | — | **타당, 고침(W4)**. 두 문장 모두 명사 "finger stick"인데 ko는 동사 '찌르다'입니다 |
| quick | — | **타당, 고침(W1)**. 헤드워드를 quickly로 바꾸고, 형용사로 쓴 1.4·3.4에서는 태그를 뺍니다 |
| drop | — | **유지**. '한 방울/떨어지다'가 1.1(명사)과 6.3·8.2·9.3·16.1(동사)을 모두 덮습니다 |
| clear | — | **타당, 고침(W5)**. 11.0(배출)·19.3(분명)·13.4(가시다) 세 뜻입니다. ko를 '배출하다/분명한'으로 하고 13.4에서는 태그를 뺍니다 |
| 같은 ko를 가르며 어색해진 ko | — | quick '재빠른'(W1)만 고칩니다. 나머지는 위 변경 판정대로 받아들일 만합니다 |
| 3.2 오답(의사/약사), 15.0·15.2·16.1·18.1 빈칸 오답 | — | v46 필드는 B 검토 몫이라 판정하지 않았습니다 |

## 사실 오류·심각한 문제

1. **15.4 "Call the rapid response team now."와 S15 slider "call RRT now"**(안전). 신속대응팀은 대부분 병원에서 일반 병동 환자를 위한 팀입니다. 중환자실에서는 담당 중환자 의사나 담당의를 병상으로 바로 부릅니다. slider why "바로 신속대응팀을 불러야 해요"도 같은 오류입니다(S7·N8). B 몫인 S15 order 1줄도 같습니다.
2. **14.3 "I trust the lab value."**(안전): 증상이 있는 저혈당이면 검사실 확인을 기다리지 않고 프로토콜대로 먼저 처치해야 하는데, 문장은 그 반대로 읽힐 수 있습니다(S6).
3. **S17 slider [recheck later, tell the provider, escalate now]**(안전·업무 범위): 간호사에게 DKA 의심 때의 escalation은 곧 담당의에게 알리는 일입니다. 그런데 why가 "알리기만 하면 시간을 잃어요"라고 해서, 간호사가 직접 치료를 올려야 한다는 오해를 부릅니다(N10).
4. **S4 slider(경관영양 중단 + 인슐린 주입 중)**(안전): 많은 병원 프로토콜이 "영양이 멈추면 같은 속도로 D10을 시작한다"고 정해 둡니다. 그런 병원에서는 `keep the rate`(속도 유지)도 정답입니다. why에 포도당 선택지가 없습니다(N2).
5. **S7 slider [stays flat, peaks, crashes]**: crashes는 떨어지는 쪽이라 '약함→강함' 순서가 깨집니다(N4).
6. **18.4 "I'm building that alert into the flow sheet now."**(업무 범위): 전자기록 알람을 만드는 것은 정보팀 일입니다. 간호사는 요청합니다(S8).

## 고칠 것 — 문장 (keyPhrase 아님)

문장 en을 바꾸면 `chunks`·`words`도 아래대로 바꾸고, **그 문장의 v46 필드(tag·icon·why·decoy·distractorsKo 둘·blank)를 새 문장에 맞춰 새로 쓰세요.** ko만 바꾸는 문장은 distractorsKo 둘을 새 ko에 맞춰 다시 씁니다.

| ID | 어디 | 문제 | 고칠 것 |
|---|---|---|---|
| S1 | S2 인슐린 주입 프로토콜 이해 · 2.6 | 지킬 수 없는 약속: 원래 당뇨가 있으면 인슐린이 계속됩니다 | en `You won't be on this drip forever, and we'll switch or stop it as you improve.` / ko `이 주입을 평생 맞는 건 아니고, 호전되면 주사로 바꾸거나 중단할 거예요.` / chunks `You won't be / on this drip forever / , and we'll switch or stop it / as you improve / .` / words `[w-drip, w-forever, w-stop, w-improve]` / v46 필드 새로 쓰기. B 몫인 S2 order 4줄 "Once you improve, we'll stop it."도 같이 고칩니다 |
| S2 | S4 영양 연계 혈당 관리 · 4.3 | "lower the insulin rate first"는 간호사가 순서를 정하는 것처럼 읽히고, 프로토콜마다 다릅니다(주입은 혈당에 따라 조정, 피하 인슐린은 식사 인슐린을 보류) | en `If a scan means you skip a meal, we adjust your insulin to match.` / ko `검사 때문에 식사를 거르면 그에 맞춰 인슐린을 조정해요.` / chunks `If a scan / means you skip a meal / , we adjust / your insulin to match / .` / words `[w-scan, w-mean, w-skip, w-meal, w-adjust, w-insulin, w-match]` / v46 필드 새로 쓰기(현재 why "먹지 않을 때는 인슐린도 줄이는 것이 기본"도 함께) |
| S3 | S5 혈당 경향 보고 · 5.4 (ko만) | flag는 '표시해 두다'가 아니라 '문제로 짚어 팀에 알리다'입니다(tagline "should we flag it?") | ko `더 오르기 전에 지금 짚어서 알릴게요.` / distractorsKo를 다시 쓰세요. 지금 오답 "지금 알려둘게요"는 새 정답과 뜻이 같습니다. why의 "'flag'는 눈에 띄게 표시한다는 뜻"도 고칩니다 |
| S4 | S10 주입에서 피하 전환 관리 · 10.4 | "we'll remove the IV line"은 지킬 수 없는 약속입니다. 중환자실 환자는 다른 약 때문에 정맥 라인을 유지합니다 | en `Once you're stable on shots, we'll check your sugar less often.` / ko `주사로 안정되면 혈당 확인 횟수를 줄일게요.` / chunks `Once you're stable / on shots / , we'll check your sugar / less often / .` / words `[w-stable, w-shot, w-check, w-often]`(w-less는 '더 적은' 형용사 뜻이라 'less often'에 태그하지 않음) / v46 필드 새로 쓰기(tag `라인 제거`도). **w-remove·w-line은 어느 문장도 태그하지 않게 되니 은행에서 지우고(word-remove) changes에 적으세요** |
| S5 | S13 패혈증 · 13.3 (선택) | "This isn't his baseline diabetes."는 당뇨가 있다고 전제한 뒤 원인이 아니라고 단정합니다. chunks가 `driving it / up`으로 구동사를 끊었습니다 | en `This is more than his baseline diabetes. The illness is driving it up.` / ko `원래 있던 당뇨만으로 오르는 게 아니에요. 병이 혈당을 끌어올리고 있어요.` / chunks `This is more than / his baseline diabetes / . The illness / is driving it up / .` / words 그대로 / v46 필드 새로 쓰기 |
| S6 ★안전 | S14 POC·정맥혈당 불일치 · 14.3 | "I trust the lab value"는 저혈당 처치를 미루라는 말로 읽힐 수 있습니다. chunks `the lab / value`는 복합명사를 끊었습니다 | en `When they don't match, the lab value is usually more accurate.` / ko `값이 안 맞으면 대개 검사실 수치가 더 정확해요.` / chunks `When they don't match / , the lab value / is usually / more accurate / .` / words `[w-match, w-lab, w-value, w-accurate]` / v46 필드 새로 쓰기. why에 "증상이 있는 저혈당이면 검사실 결과를 기다리지 않고 프로토콜대로 먼저 처치"를 넣으세요. **w-trust는 은행에서 지웁니다(word-remove)** |
| S7 ★안전 | S15 심한 저혈당 의식저하 · 15.4 | 중환자실에서는 신속대응팀을 부르지 않습니다. chunks `Call the rapid response / team`도 구를 끊었습니다 | en `Call the provider to the bedside now.` / ko `지금 담당의를 병상으로 불러 주세요.` / chunks `Call the provider / to the bedside / now / .` / words `[w-call, w-provider]` / v46 필드 새로 쓰기. **w-rapid·w-response는 은행에서 지우고**, S15 slider `words`를 `[w-call]`로 바꿉니다(N8). B 몫인 S15 order 1줄도 고칩니다 |
| S8 | S18 급식 중단 후 저혈당 · 18.4 | 간호사가 기록 시스템에 알람을 직접 만드는 것은 업무 범위 밖입니다 | en `I'll ask to add that alert to the flow sheet.` / ko `그 알람을 흐름표에 넣어 달라고 요청할게요.` / chunks `I'll ask / to add / that alert / to the flow sheet / .` / words `[w-add, w-alert, w-flow, w-sheet]` / v46 필드 새로 쓰기(why "building … into"도) |
| S9 | S12 혈당 변동성 · 12.4 (ko + chunks) | ko "더 낫게 작용해요"가 어색합니다. chunks `Smaller / , steadier changes`는 명사구를 끊었습니다 | ko `작고 꾸준한 변화가 큰 급변보다 더 효과적이에요.` / chunks `Smaller, steadier changes / work better / than big jumps / .` / distractorsKo 둘을 새 ko 틀로 다시 쓰기 |
| S10 | 16.3 chunks | `before we give / it`가 동사와 목적어를 끊었습니다 | `We always / double-check / the dose / before we give it / .` |
| S11 | 18.3 chunks | `that the pump stopped / feeding`이 'stopped feeding'을 끊었습니다 | `Someone missed / that the pump / stopped feeding / an hour ago / .` |
| S12 | 10.3 chunks | `before the drip / stops`가 절을 끊었습니다 | `The shot / needs time / to start working / before the drip stops / .` |
| S13 | 17.4 chunks (선택) | `from getting / worse` | `We're moving / quickly / to keep this / from getting worse / .` |

허용(바꾸지 않음): 3.4 `a quick / finger stick`, 6.4 `I bump / it up`은 낱말 9개라 4조각 규칙 때문에 더 묶을 수 없습니다.

## 고칠 것 — keyPhrase 문장 ko (결정 11 범위)

| ID | 문장 | 문제 | 고칠 것 |
|---|---|---|---|
| K1 | 17.2 "We'll escalate your treatment quickly if it's progressing to DKA." | ko "치료를 빨리 상향할게요"는 한국어로 어색합니다 | ko `DKA로 진행되고 있으면 치료 단계를 빨리 올릴게요.` distractorsKo 둘을 새 ko 틀로 다시 쓰기(지금 오답은 "DKA 치료를 시작하면…"으로 틀이 다름) |
| K2 | 20.2 "Either way, I'm escalating this change to the team." | ko의 "바로"는 en에 없습니다. 20.4 ko와 거의 같아집니다 | ko `어느 쪽이든 이 변화를 팀에 보고할게요.` |

## 고칠 것 — 단어 (결정 11·v45)

| ID | 단어 | 문제 | 고칠 것 |
|---|---|---|---|
| W1 | w-quick | 태그 6문장 중 4개가 quickly(1.5·3.2·17.2·17.4)입니다. '재빠른'은 'quick pinch'에도 어색합니다 | en `quickly`, ipa `/ˈkwɪkli/`, ko `신속하게`, example `I'll treat it quickly if your sugar is low.`, chips `[[quick, ly]]`, distractorsEn `[quietly, thickly]`, distractorsKo `[느긋하게, 얌전하게]`. 형용사로 쓴 1.4·3.4에서는 `words`의 w-quick 태그를 뺍니다 |
| W2 | w-away | 헤드워드 'away'에 ko '즉시(right away)' — 가르치는 것은 구 'right away'입니다(4문장 모두) | en `right away`, ipa `/raɪt əˈweɪ/`, chips `[[right], [a, way]]`, ko `바로`(w-immediately가 이미 `즉시`라 같은 ko가 되지 않게; 은행에 `바로`인 단어 없음 확인), distractorsKo `[나중에, 천천히]`, distractorsEn `[far away, right behind]`, decoyChips `[rite]` |
| W3 | w-double | "double-check"의 'double'만 떼어 '두 번의'로 가르칩니다. 인슐린은 고위험 약이라 이중 확인이 핵심입니다 | en `double-check`, ipa `/ˌdʌbəl ˈtʃɛk/`, ko `이중 확인하다`, chips `[[dou, ble-, check]]`, distractorsEn `[double-book, double-park]`, distractorsKo `[한 번 훑다, 나중에 보다]`, cue `투여 전에 두 사람이 따로 용량을 맞춰 볼 때`. 16.3에서 w-check 태그는 뺍니다("check"를 두 단어가 함께 가리키지 않게) |
| W4 | w-stick | 두 문장 모두 명사 "finger stick"인데 ko는 동사 '찌르다'입니다 | ko `찌르기(손끝 채혈)`, distractorsKo `[누르기(지혈)`, `닦기(소독)]`, example은 그대로 |
| W5 | w-clear | ko '분명한/가시다'는 keyPhrase 11.0 "kidneys clear insulin"(배출)을 덮지 못합니다 | ko `배출하다/분명한`, cue `몸이 약을 걸러 내보내거나, 패턴이 흐릿함 없이 드러날 때`, distractorsKo `[흡수하다/흐릿한, 저장하다/모호한]`. 13.4 "infection clears"에서는 태그를 뺍니다 |
| W6 | w-flag | ko·cue가 '표시를 달다'인데, 5.4와 tagline의 flag는 '문제로 짚어 알리다'입니다 | ko `짚어 알리다`, cue `수치가 심상치 않다고 담당자에게 먼저 꺼내 말할 때`, distractorsKo `[덮어 두다, 미뤄 두다]` |
| W7 | w-set | 2.3 "a set of rules"는 명사 '묶음'인데 ko는 '설정하다'입니다 | 2.3에서 태그 빼기 |
| W8 | w-level | 12.1 "level out"은 동사 '고르게 하다'인데 ko는 '수준'입니다 | 12.1에서 태그 빼기 |
| W9 | w-sick · w-feeling | 17.3 "Feeling sick to your stomach"는 '메스껍다'이고, feeling은 동명사입니다 | 17.3에서 두 태그 빼기(w-stomach가 그 뜻을 맡습니다) |
| W10 | w-bring | 8.3 "bring your sugar up"은 '올리다'인데 ko는 '가져오다'입니다 | 8.3에서 태그 빼기(19.4는 그대로) |
| W11 | w-chart | 14.4 "on the chart"는 환자 기록인데 ko·cue는 '기준표'입니다 | 14.4에서 태그 빼기 |
| W12 | w-regimen (선택) | '처방'은 order/prescription에 가깝고, regimen은 '투여 계획(요법)'입니다 | ko `투여 계획` |

### distractorsEn — 품사가 다른 것 전부 (★ = 꼭 바꿀 것)

| 단어(품사) | 오답 | 오답 품사 | 바꿀 것 |
|---|---|---|---|
| ★ number (명사) | nurture | 주로 동사 | `lumber` |
| ★ forever (부사) | however | 접속부사 | `never` 또는 `wherever` |
| ★ add (동사) | odd | 형용사 | `pad` |
| ★ skip (동사) | skin | 명사 | `skim` |
| ★ often (부사) | after | 전치사·접속사 | `seldom` |
| ★ kidney (명사) | kidnap | 동사(범죄 연상) | `spleen` |
| ★ stat (형용사·부사) | stay | 동사 | `stale` |
| ★ progress (동사) | proceed | 동사지만 **정답으로도 맞음**(ko '진행하다') | `regress` |
| up (명사 ups) | out, over | 부사·전치사 | 대체가 어려워 유지 가능 |
| down (명사 downs) | over | 부사·전치사 | 유지 가능 |
| count (동사) | amount | 주로 명사 | 선택: `mount`는 두고 `account` |
| fresh (형용사) | flush | 주로 동사·명사 | 유지 가능(flush는 형용사 뜻도 있음) |
| several (한정사) | seventh | 서수 | 유지 가능 |
| warning (명사) | warming, waiting | 동명사 | 유지 가능 |
| clear (동사·형용사) | clever, clumsy | 형용사(동사 뜻 없음) | W5 뒤 형용사 뜻이 남으니 유지 가능 |

그 밖에(선택): give의 오답 `grieve`는 장례·애도 연상이 있어 `live`로, bring의 오답 `brew`(술 빚기)는 `brag`로.

### cue

| ID | 단어 | 문제 | 고칠 것 |
|---|---|---|---|
| C1 | w-often | cue "자주 여러 번 되풀이되는…"이 ko '자주'를 되풀이합니다 | `평소보다 확인 간격을 좁혀 여러 번 재야 할 때` |
| (W5·W6) | clear·flag | 문장 속 뜻과 다른 cue | 위 W5·W6 |

### decoyChips (비속어·불쾌·술·장례 관점에서 전부 확인)

| ID | 단어 | 조각 | 고칠 것 |
|---|---|---|---|
| D1 | w-diabetes | `die` | `dee` (ICU 장면에서 '죽다') |
| D2 | w-rapid | `rip` | 'R.I.P.'(장례) 연상. S7을 반영하면 단어째 없어집니다. 남기면 `rap`→`rep` |
| D3 (선택) | w-insulin `sue`(인슐린 사고 주제에서 소송), w-fresh `flesh`, w-immediately `mad`, w-smooth `smoke`, w-gently `lie` | — | `sun`, `flash`, `mid`, `smock`, `lee` |
| 확인함 | `bar`(number), `lost`(last), `loss`(less), `cry`(critically), `dump`(bump·jump 오답) | — | 맥락상 문제없음, 유지 |

## 고칠 것 — 뉘앙스

| ID | 어디 | 문제 | 고칠 것 |
|---|---|---|---|
| N1 | S1 slider(pinch) why | "별것 아니라고 부풀려 말하지도 마세요"는 앞뒤 뜻이 엇갈립니다(축소가 문제인데 '부풀려') | `…sharp pain이라고 하면 겁을 주고, 하나도 안 아프다고 말하지도 마세요.` |
| N2 ★안전 | S4 slider(skip) | 영양이 멈춘 뒤 D10을 같은 속도로 시작하는 프로토콜이면 `keep the rate`도 정답입니다. why에 포도당 선택지가 없습니다 | cue `Tube feeding is held for a scan, the insulin drip is still running, and no dextrose is ordered.` / why에 "병원 프로토콜에 따라 인슐린을 줄이거나 멈추고, 포도당 수액을 시작하기도 해요"를 넣으세요 / example `If your feeding is held, we lower the rate per protocol.` |
| N3 | S6 slider(drop) | 210→120 두 시간(시간당 45)은 많은 프로토콜에서 '빠른 하락' 기준 밖입니다. `dropping`과 정답이 둘이 됩니다 | cue `His sugar fell from 250 to 120 in one hour.` |
| N4 | S7 slider(peak) | `[stays flat, peaks, crashes]`: crashes는 반대 방향이라 약함→강함 순서가 아닙니다 | scale `[stays flat, drifts up, peaks]`, answerAt 2. why "오후에 가장 높아졌다가 밤에 내려오니 peaks예요. drifts up은 조금씩 오르기만 할 때예요." 아침에 맞는 스테로이드(prednisone)라는 단서를 why에 넣으면 더 정확합니다 |
| N5 | S7 context(steroid) 장면 3 | `corticosteroid-induced`는 낱말 steroid가 아닙니다(합성어 안의 글자) | `Your steroid-induced hyperglycemia reflects peripheral insulin resistance.` |
| N6 | S9 context(dextrose) 장면 1 | who `의사에게`인데 간호사가 의사에게 "Start dextrose…"라고 지시합니다 | who `의사 지시`(icon speech)로 |
| N7 | S13 slider(settle) | 단서 "Nobody can promise it."만으로는 `may settle`도 맞습니다(정답 둘) | cue `His son asks if the sugars will calm down. The team expects them to improve as the infection clears, but nobody can promise it.` |
| N8 ★안전 | S15 slider(call·rapid) | 중환자실에서 RRT 호출은 사실과 다릅니다 | scale `[bring it up at rounds, page the team later, call the provider now]`, words `[w-call]`, why `반응이 없고 혈당이 매우 낮으면 프로토콜대로 바로 처치하면서 담당의를 병상으로 불러요. 중환자실은 신속대응팀이 아니라 담당 의사를 바로 부르는 곳이에요. 라운드까지 기다리거나 나중에 호출하면 늦어요.`, example `Call the provider to the bedside now.`, exKo `지금 담당의를 병상으로 불러 주세요.` |
| N9 | S16 context(document) 장면 3 | "Document whose fault this was"는 듣는 사람이 맞지 않아서가 아니라 **뜻이 달라서** 어색합니다(v46 7번 위반) | 장면 3을 `{who: 환자에게, icon: me, en: "I'm documenting your POC glucose and the D50 administration in the MAR.", ok: false, fix: "I'm writing down your sugar results and the medicine I gave you."}`로, why `MAR·POC는 의료진끼리의 말이에요. 환자에게는 무엇을 적는지 쉬운 말로 알려 주세요.`로. context ko는 은행과 맞춰 `문서로 남기다`로 |
| N10 ★안전 | S17 slider(escalate) | `tell the provider`를 부족한 조치로 가르칩니다. 간호사의 escalation이 곧 담당의 보고입니다 | scale `[recheck later, mention it at rounds, escalate now]`, why `DKA가 의심되면 바로 담당의에게 알려 치료를 올리게 해야 해서 escalate now예요. 나중에 재확인하거나 라운드까지 기다리면 진행되는 동안 시간을 잃어요.`, example `I'm escalating this to the provider now.`, exKo `지금 담당의에게 바로 보고할게요.` |
| N11 | S18 slider(immediately) | 단서가 "his sugar is low"뿐이라 `quickly`와 갈리지 않습니다 | cue `…and his sugar is 48 and still falling.` |
| N12 | S18 context(alert) 장면 2 | who `의사에게`인데 간호사가 의사에게 "Add an alert…"라고 지시합니다. 알람 만들기도 정보팀 일입니다 | en `Can we request an alert on the flow sheet whenever feeding is held?` (who 그대로) |
| N13 | S20 context(check) 장면 1 | who `의사에게`인데 의사에게 "Check his sugar first"라고 지시합니다 | who `의사 지시`로 |
| N14 | S20 slider(confusion) | 장소를 모르는 것(지남력 장애)은 '가벼운 혼란'으로 단정하기 어렵습니다. `deep confusion`과 갈리지 않습니다 | cue `He knows his name and where he is, but keeps asking the same question.` |

swap 6문항: 선택지마다 이어 읽었고 문법은 모두 맞습니다. 정답이 하나뿐이고 swap `ko`도 바꾼 문장의 뜻과 맞습니다.
context 21문항: 세 장면 모두에 `word`가 있고(활용형 포함), 어색한 장면은 N9를 빼고 모두 '같은 뜻을 환자·가족에게 전문어로' 말한 장면입니다. 핸드오프 모양에 맞습니다.

## keyPhrase — 사용자 결정 필요 (en은 고치지 않음)

| # | 현재 en | 문제 | 대안 en | 권고 |
|---|---|---|---|---|
| 1 | 15.2 "Recheck in five minutes and repeat if he's still low." | 표준은 D50을 준 뒤 15분에 다시 잽니다(ADA·대부분 병원 저혈당 프로토콜). 같은 주제의 KP 8.0은 "fifteen minutes"라 숫자가 둘로 갈립니다 | "Recheck in fifteen minutes and repeat if he's still low." | **바꿈** (S15 order 3줄 "Recheck in five minutes."도 함께, B 몫) |
| 2 | 16.1 "Check his sugar now and start dextrose if he's dropping." | 인슐린 과다 투여 뒤 포도당 수액은 지시나 프로토콜로 시작합니다. 간호사가 혼자 판단해 시작하는 것처럼 읽히고, 조건도 '낮으면'이 아니라 '떨어지는 중이면'입니다 | "Check his sugar now and get dextrose ready if he's dropping." | **바꿈(약함)**. 유지하려면 why에 "지시·프로토콜에 따라"를 넣으세요. S16 order 2줄도 같습니다 |
| 3 | 18.1 "Start dextrose and recheck his sugar immediately." | 간호사 단독 판단으로 읽힐 수 있음 | "Follow the low protocol and recheck his sugar immediately." | **유지**. 이미 저혈당이 진행 중이라 간호사 시행 저혈당 프로토콜 범위입니다 |
| 4 | 9.1 "I may start some dextrose to keep your sugar steady." | 같은 갈래(포도당 시작) | — | **유지**. 'may'로 조건을 달았고, 영양 중단 때 D10 시작은 흔한 프로토콜 항목입니다 |
| 5 | 19.0 "Three lows means we need to review…" | 수 일치(mean)가 구어식입니다 | "Three lows mean we need to review…" | **유지**. '세 번이라는 사실'을 주어로 보는 구어로 자연스럽습니다 |
| 6 | chunks만 구 경계를 끊은 KP(보고만): 3.0 `Those shaky / , sweaty feelings`, 5.1 `over the last / several checks together`, 10.0 `We give your first / long-acting shot`, 10.1 `keeps your sugar / covered during / the switch`, 12.1 `the ups / and downs`, 14.1 `with a venous / sample`, 20.0 `, since a low / or high` | KP 문장이라 고치지 않음 | — | 사용자 판단(chunks는 en을 바꾸지 않고도 고칠 수 있음) |

## 종합

고칠 것 **53건**(문장 13·KP ko 2·단어 12·distractorsEn ★8·cue 1·decoyChips 2·뉘앙스 14·선택 1 = D3 묶음), 그중 **안전 5건**(S6·S7·N2·N8·N10). 선택 항목 4건(S5·S13·W12·D3)은 개수에 넣었지만 빼도 됩니다. 품사표의 '유지 가능'과 grieve·brew 같은 '그 밖에(선택)'는 개수에 넣지 않았습니다.
가장 무거운 것은 중환자실 RRT 호출(15.4·S15 slider), "검사실 값을 믿는다"(14.3), DKA slider의 escalation 틀입니다. 이것들과 KP 결정 1(5분→15분)을 반영하면 내보내도 됩니다.
