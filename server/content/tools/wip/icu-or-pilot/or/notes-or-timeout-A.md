# or-timeout A — 검토가 판단할 것

## 쉬운 단어 태그를 못 뺐다 (결정 11)
combine_halves가 A·B의 문장 `words`가 같아야 합치므로 A는 문장 `words`를 건드리지 않았다. 공통 쉬운 단어 목록에 있고 지금도 태그된 말:
`patient · name · nurse · know · time · hour · go`. 목록 밖이지만 쉬운 말: `put · down · other · take · use · new · long · stay · need · give`.
이 단어들은 카드가 그대로 나간다. 뺀다면 합친 뒤 한 번에 문장 `words`와 `changes`를 고치고, 상황당 서로 다른 단어 8개(V3)가 남는지 본다.

## 단어 ko 정리 (changes-or-timeout.yaml, 5건)
check→점검하다(confirm과 같던 확인하다), start→착수하다(begin과 같던 시작하다), note→기재하다(document와 같던 기록하다),
align→(생각을) 맞추다(match 일치하다와 겹침), run→(수술이) 이어지다(proceed 진행하다와 겹침).

## 문장 쪽 메모 (고치지 않았다)
- `circulating`의 ko는 순회하는인데 문장 ko는 "순환 간호사"다. 한국 병원에서 둘 다 쓰지만 한 주제 안에서는 하나가 낫다.
- 문장 `Give me ten seconds for the critical checks.`는 "십 초"로 못 박았다. 응급에서 타임아웃을 짧게 하는 것은 맞지만 시간 제한은 병원 정책이 아니라 예시다.
- `Let's take thirty seconds — it's worth it.` / `It only takes thirty seconds…`도 같은 예시 수치다.
