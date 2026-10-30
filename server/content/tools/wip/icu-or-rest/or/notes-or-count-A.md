# or-count A — 검토가 판단할 것

## 문장 쪽 메모 (고치지 않았다)
- `We pick up exactly where we left off.`(계수 방해 응급 상황 4번)와 같은 상황 0번 `we restart the count from a known point`, 1번 `recount everything`가 서로 다른 말을 한다. 계수가 중단되면 어디서부터 다시 세는지는 병원 정책마다 다르고, 처음부터 다시 세는 쪽이 일반적인 안전 권고에 가깝다. "정확히 멈춘 지점부터"를 가르치는 문장이라 확신이 없다.
- `Please request a follow-up scan for the patient.`(이물 잔류 의심 보고 4번): 영상 검사 지시는 집도의 몫인데 누구에게 하는 말인지 불분명하다. 간호사가 단독으로 영상을 처방하는 것으로 읽힐 수 있다.
- `Let's get an X-ray before we close.`(X선 잔류 거즈 확인 0번), `We may need to reopen`·`re-exploration`(봉합 후 계수 오류): 영상 촬영·재개방 결정은 집도의가 한다. 간호사 입에서 제안으로 나오는 건 괜찮지만 "지시"처럼 읽히지 않는지 확인 필요.
- `Nobody moves until we find it.`(소실 바늘 필드 수색 2번): 방 전체를 멈추는 말로 실제 관행보다 강하다. 수색 중 이동을 줄이는 것은 맞지만 "아무도"는 과하다.
- `Ten additional sponges added`(추가 거즈 투입 기록 0번): 포장 단위(예: 10장)는 병원·제품마다 다르다. 예시 수치로 읽힌다.
- `I won't sign off until the count is correct.`(계수 불일치 은폐 압력 2번): 순환 간호사가 서명을 거부하는 말로, 병원 정책상 맞지만 상급자에게 보고하는 단계 없이 단독 거부로만 끝난다.

## 단어 정리 (결정 11, changes-or-count.yaml 48건)
- 쉬운 단어 제거 11개: time·see·room·patient·hand·know(공통 목록) + make·get·say·look·move(목록 밖 판단 5개). 은행에서 지웠다.
- 새 단어 1개: `w-done` — 바늘 회수 확인이 hand 태그를 빼면 단어 6개라 V3 미달이어서, 그 상황 문장(`as soon as you're done`)에 이미 있는 말을 태그했다. 이 말은 쉬운 편이라 검토가 더 나은 말(예: 같은 문장의 `as soon as` 구)이 있다고 보면 바꿔도 된다.
- 헤드워드 4개를 부사로(id 그대로): systematic→systematically, careful→carefully, immediate→immediately, proper→properly. 태그된 문장이 모두 부사였다.
- ko 12개: 같은 ko 끼리 정답이 둘/셋 되던 것을 가르거나(begin·check·verify·note·log·extra·call·fragment·component·pick) 틀린 것을 고침(match·retain).
- 아직 같은 ko를 공유하지만 그대로 둔 쌍: `loud`(큰 소리로)/`aloud`(소리 내어) — 뜻이 사실상 같아 듣고 뜻 고르기에서 헷갈릴 수 있다. loud의 태그 문장은 `out loud` 한 곳이다.
- `exact`는 형용사와 부사 문장이 섞여(`exact time`, `exactly where`) 헤드워드를 못 바꿨다. `manual`·`safe`도 비슷하다.

## 숫자 낱말
- `number`·`twice`·`half`·`total`·`short`는 계수 어휘이므로 남겼다(숫자 낱말 자체가 아니라 계수에서 가르칠 값이 있다).

## 뉘앙스 판단 거리
- 슬라이더 18개 중 정답 칸: 0번 6, 1번 7, 2번 5. 정답이 가장 긴 보기인 것 6개.
- 환자·가족 대상 어색한 장면(context)에서 간호사가 환자에게 직접 설명하는 설정을 몇 곳 썼다(incision·radiopaque·dual·retained·incident). 실제로는 집도의가 설명하는 일도 많아, `이물 잔류 의심 보고`의 fix는 "집도의가 직접 설명할 것"으로 썼다.
- 교대 인계 슬라이더는 문장 `Let's do a full count together before I take over`에 맞춰 "함께 센다"를 정답으로 했다.
