# judge — icu-post-arrest (A 검토 범위, Fable 독립 표본 판정)

대상 `icu-post-arrest.yaml` (단어 216 · 상황 21 · 문장 127 · 뉘앙스 42 = context 20 · slider 19 · pair 2 · swap 1).
비교 `base-icu-post-arrest.yaml`(단어 228) · `changes-icu-post-arrest.yaml` · `in-icu-post-arrest.json` · `notes-icu-post-arrest-A.md`.
fix-*.md는 열지 않았음. 단어 216개 전부·뉘앙스 42개 전부·chunks 127문장 전부·pair 2개 전 결합·swap 전 선택지를 스크립트로 뽑아 한 줄씩 봤음.

## 항목별 점수

| # | 항목 | 점수 | 근거 |
|---|---|---|---|
| 1 | distractorsEn | 3 | 철자·소리는 잘 닮게 골랐고 정답으로도 맞는 오답은 없음. 그러나 **정답과 품사가 다른 오답이 54개 단어**에서 나옴(아래 표). 브리프 "같은 품사로" 위반이 체계적. |
| 2 | distractorsKo·길이 | 5 | 정답 뜻과 겹치는 오답(동의어·다른 뜻) 없음. 길이 규칙 전부 통과. 다른 은행 단어의 ko를 오답으로 쓴 것(체온·맥박 등)은 뜻이 분명히 달라 문제 없음. |
| 3 | cue | 4 | 정답·파생형 노출 없음. 장면이 떠오르는 cue가 대부분. 흠: w-pressure "혈압의 뒤쪽 낱말"(blood pressure를 통해 사실상 노출), w-bedside·w-tomorrow는 ko 되풀이 수준. |
| 4 | chips/decoyChips | 4 | 형태소 단위로 잘 잘랐고 V21 금칙어는 없음. 판단 거리: quack(돌팔이)·slob·fool(×2)·troll·kiss 등 모욕·불쾌 뉘앙스 조각(아래). 문장 chunks는 비-keyPhrase 9문장에서 구 경계를 끊음. |
| 5 | 뉘앙스 사실 정확성 | 4 | MAP ≥65, SpO2 92~98%, PaCO2 35~45, 예후 판정은 정상체온 회복 후 72시간 이후, OPO 분리 접근, 떨림 프로토콜 단계(아세트아미노펜·부스피론→메페리딘) 모두 AHA 2020·미국 관행과 맞음. 틀린 곳 3: VT를 "irregular"로 설명, 32도를 "깊은 저체온"으로, "two physicians **must**"를 보편 규칙처럼. 재가온 속도 0.25~0.5도/h의 AHA 귀속은 확신 없음. |
| 6 | 뉘앙스 설계 | 3 | **pair 2개 모두 정답이 둘**(send a potassium / watch for hyperkalemia). swap 오답 하나가 관사로 걸러짐(a excellent). context 20개는 전부 핸드오프 모양(word·ko·3장면·ok:false 1장+fix)이고 "같은 뜻·안 맞는 자리" 원칙을 지킴. slider 19개는 전부 행동 선택형이라 강도 순서는 판정 대상이 없음(정답 자리는 모두 타당). swap ko 정확. |
| 7 | v44 정리(결정 11) | 4 | 쉬운 말 12개 제거는 타당. ko 가름 10건 중 w-tight(팽팽하게 — 뜻 틀림)·w-outcome(경과 ≠ outcome)·w-meds(약들 — 어색) 3건은 다시 손봐야 함. w-drip은 ko만 바꾸고 exKo를 안 맞춤. |

## 사실 오류·심각한 문제

1. **pair "체온·전해질 모니터"** — `send a` + `potassium` = "send a potassium"은 미국 ICU에서 실제로 쓰는 말(send a K). 정답이 둘.
2. **pair "재가온 단계 관리"** — `watch for` + `hyperkalemia` = "watch for hyperkalemia"는 완전히 자연스러운 영어. 정답이 둘. (`rebound` + `low blood pressure`도 뜻이 통함.)
3. **context "냉각 중 부정맥 위기"(rhythm) fix** — "His heartbeat became fast and **irregular**": 단형 VT(monomorphic VT)는 빠르고 **규칙적인** 리듬. 가족에게 틀린 설명을 가르침.
4. **context "뇌사 진행 평가 연계"(confirm) 장면 1** — "Two physicians **must** confirm brain death independently." 미국은 주·병원 정책 사항(AAN 2023은 대부분 주에서 자격 있는 검사자 1인 허용). 문장 s3은 `per policy`로 한정했는데 이 장면은 보편 규칙처럼 말함. fix 문장("Two doctors have examined him separately")도 같은 전제.
5. **slider "냉각 중 부정맥 위기" why** — "깊은 저체온에서는 서맥이…": 32도는 TTM 범위의 경도 저체온이지 깊은 저체온(<28도)이 아님. (keyPhrase의 "Deep hypothermia"와 같은 문제 — 그쪽은 사용자 결정.)
6. **swap "신경학적 예후 불량 가족 상담"** — 선택지 `excellent`를 넣으면 "a excellent chance"로 관사가 틀려 읽기만 해도 걸러짐.

## 고칠 것

### A. 뉘앙스
1. 체온·전해질 모니터 · pair · `send a`/`metabolic panel`이 `send a potassium`으로도 성립 · 왼쪽을 `comprehensive`로("comprehensive metabolic panel"; comprehensive temperature ✕, comprehensive potassium ✕, comprehensive the trend line ✕). why도 "send와 함께" 대신 "CMP(comprehensive metabolic panel)라 부른다"로.
2. 재가온 단계 관리 · pair · `watch for hyperkalemia`가 성립 · 셋째 짝을 `half a degree`/`per hour`로, 둘째 왼쪽을 `cause rebound`로(`rebound slowly`도 동사+부사로 읽힘). 결과: [rewarm, slowly] [cause rebound, hyperkalemia] [half a degree, per hour], decoys [the cooling]. 전 결합 확인: rewarm hyperkalemia ✕ · rewarm per hour ✕ · cause rebound slowly ✕ · cause rebound per hour ✕ · half a degree slowly ✕ · half a degree hyperkalemia ✕ · ×the cooling 전부 ✕.
3. 재가온 단계 관리 · pair why · "(AHA는 시간당 0.25~0.5도)" — AHA 2020은 "천천히 재가온·발열 예방"만 말하고 수치는 ERC/ESICM·병원 프로토콜 쪽. 확신 없는 귀속이니 "병원 프로토콜은 대개 시간당 0.25~0.5도"로.
4. 냉각 중 부정맥 위기 · context(rhythm) fix · "fast and irregular" · "His heartbeat went into a fast, dangerous rhythm, so we're treating it right away."
5. 냉각 중 부정맥 위기 · slider why · "깊은 저체온에서는" · "목표 하한(32도) 근처의 저체온에서도 서맥이 흔해요. 혈압이 떨어지거나 불안정하면…"
6. 뇌사 진행 평가 연계 · context(confirm) 장면 1 · 보편 규칙처럼 "must" · "Per policy, two physicians confirm brain death independently." fix도 "The doctors have examined him separately and confirmed that his brain has stopped working. I'm so sorry."
7. 신경학적 예후 불량 가족 상담 · swap · `excellent` → "a excellent" 관사 오류 · 선택지를 `very good`으로(notes 키도 같이). `zero`도 "a zero chance"가 어색하니 `no real`("a no real chance" ✕)은 안 되고 그대로 두거나 `tiny`로 바꾸면 정답과 겹침 — `zero`는 그대로 둠.
8. 재관류 PCI 이송·조율 · context(transport) 장면 2 · "I'll manage the airway during transport" — 저작자 메모가 문장 s5에서 지적한 것과 같은 업무범위 문제가 이 장면에도 있음 · "I'll bag him during transport if we need to"로(간호사가 하는 백밸브 보조로 한정). 문장 s5는 아래 "두어도 됨"에.
9. TTM 냉각 유도·유지 관리 · context(steady) 장면 3 · "thermoregulatory setpoint remains steady within the target band" — 설정점(setpoint)이 아니라 체온이 유지되는 것이라 개념이 틀린 문장(어색한 장면이긴 하나 틀린 말을 보여 줄 이유 없음) · "His core temperature remains steady within the target band on servo control."

### B. 문장 chunks(비-keyPhrase, 구 경계를 끊은 것)
10. K 전해질 변동 관리 s3 · `at three / point two` 숫자를 끊음 · `His last potassium / came back / at three point two / .`
11. K 전해질 변동 관리 s5 · `one more / time` · `Once he's rewarmed / , I'll recheck potassium / one more time / .`
12. TTM 냉각 유도·유지 관리 s4 · `to maintenance / mode` · `Once we hit target / , I'll switch / to maintenance mode / .`
13. TTM 냉각 유도·유지 관리 s5 · `for the last / two hours` · `Temperature is steady / within range / for the last two hours / .`
14. 발작·경련 감시 s4 · `for the next / twenty-four hours` · `Neurology wants / continuous EEG / for the next twenty-four hours / .`
15. 재가온 단계 관리 s3 · `about half / a degree` · `We're rewarming him / about half a degree / per hour / .`
16. 진정·통증 관리 기초 s3 · `before we reposition / him` · `I'll sedate him / a little more / before we reposition him / .`
17. 진정·통증 관리 기초 s4 · `looks / controlled` 한 낱말 조각 둘 · `His pain score / looks controlled / on the current dose / .`
18. 체온·전해질 모니터 s5 · `it / now` · `Potassium came back low / , so we're replacing it / now / .`

### C. distractorsEn 품사 불일치(54개 단어) — 정답 `en`의 품사 기준. 대체안은 같은 품사·닮은 철자·길이 규칙 안에서 고른 것; "닮은 말로"만 적은 것은 수정자가 고름.
| id | en(품사) | 문제 오답 | 어떻게 |
|---|---|---|---|
| w-breathe | breathe(v) | breadth(n) | → breach |
| w-adequate | adequate(adj) | advocate(n/v) | → delicate |
| w-equal | equal(adj) | equip(v), equate(v) | → [even, unequal] |
| w-document | document(v) | doctor(n) | → discount |
| w-initial | initial(adj) | initiate(v) | → impartial |
| w-activate | activate(v) | activity(n) | → actuate |
| w-continuous | continuous(adj) | continent(n) | → contentious |
| w-maximal | maximal(adj) | maxima(n) | → marginal |
| w-choose | choose(v) | loose(adj) | → chase |
| w-drop | drop(v) | drug(n) | → dip |
| w-transport | transport(n) | transfuse(v) | → transfer |
| w-harm | harm(v) | farm(n), hard(adj) | → [hurt, charm] |
| w-point | point(v) | pint(n) | → pinch |
| w-poor | poor(adj) | pour(v), power(n) | → [pure, pale] |
| w-wake | wake(v) | wage(n) | → wane |
| w-rush | rush(v) | rash(n/adj) | → brush |
| w-clear | clear(v) | clerk(n) | → cheer |
| w-crash | crash(v) | brash(adj) | → crack |
| w-slow | slow(v) | slot(n) | → stow |
| w-warm | warm(v) | worm(n), farm(n) | → [swarm, warn] |
| w-treat | treat(v) | threat(n) | → trace |
| w-convert | convert(v) | convent(n) | → convict |
| w-fight | fight(v) | flight(n), fright(n) | → [fetch, flinch] |
| w-avoid | avoid(v) | devoid(adj) | → evade |
| w-honor | honor(v) | horror(n), honey(n) | → [hone, harbor] |
| w-trend | trend(n) | tread(v), tend(v) | → [trench, blend] |
| w-arrest | arrest(n) | resist(v), wrest(v) | → [unrest, crest] |
| w-stable | stable(adj) | staple(n) | → stately |
| w-subtle | subtle(adj) | subtitle(n) | → subdued |
| w-soon | soon(adv) | sun(n), soap(n) | → [seldom, sorely] |
| w-dose | dose(n) | doze(v) | → dough |
| w-pump | pump(n) | jump(v) | → pulp |
| w-lower | lower(v) | power(n), tower(n) | → [lessen, loosen] |
| w-gather | gather(v) | rather(adv), bather(n) | → [garner, lather] |
| w-follow | follow(v) | fellow(n), hollow(adj) | → [swallow, bellow] |
| w-result | result(n) | reset(v), resolve(v) | → [receipt, insult] |
| w-probe | probe(n) | prove(v), prone(adj) | → [prod, prong] |
| w-cell | cell(n) | sell(v) | → sill |
| w-serum | serum(n) | serene(adj), severe(adj) | → [sermon, syrup] |
| w-shift | shift(n) | sift(v) | → drift |
| w-rate | rate(n) | rare(adj) | → ratio |
| w-team | team(n) | tame(adj/v) | → beam |
| w-comfort | comfort(n) | comport(v) | → conflict |
| w-meds | meds(n) | meets(v), mends(v) | → [beds, mats] |
| w-approach | approach(v) | apparatus(n) | → reproach |
| w-focus | focus(v) | locus(n) | → force |
| w-belong | belong(v) | beyond(prep) | → prolong |
| w-rebound | rebound(n) | profound(adj), rebuild(v) | → [refund, rebate] |
| w-multiple | multiple(adj) | multiply(v) | → municipal |
| w-imaging | imaging(n) | imagine(v) | → mapping |
| w-neurologic | neurologic(adj) | neurologist(n) | → neurotic |
| w-steady | steady(adj) | study(n/v) | → stealthy |
| w-bedside | bedside(n) | besides(adv) | → bedsheet |
| w-reposition | reposition(v) | repetition(n) | → repossess |
(같은 품사 읽기가 있어 넘긴 것: label/table(v), care/cure, change/charge, drip/drop, secure/secret, shiver/shaver — shiver는 en이 동사·ko가 명사라 품사 기준이 갈림.)

### D. cue·decoyChips·v45 필드
19. w-pressure · cue "혈압의 뒤쪽 낱말"이 blood pressure를 통해 정답을 사실상 드러냄 · "혈관 벽을 누르는 힘, 커프로 재는 그 값"으로.
20. w-drip · ko를 '지속주입(드립)'으로 바꿨는데 exKo는 "모든 수액이…" 그대로 · exKo "모든 지속주입 약이 펌프에 걸려 있고 표시도 명확해요"(문장 ko는 v44라 아래 결정 11에).
21. w-tight · exKo "체온을 팽팽하게 안정적으로" — tightly stable은 '엄격히·빈틈없이' · exKo "도달하면 체온을 빈틈없이 안정적으로 유지합니다"(ko는 결정 11에).
22. decoyChips 판단 거리(V21 통과, 저우선) · w-quickly `quack`(돌팔이 의사 — 병원 앱에 부적절) → `quick`은 정답 조각이라 ✕, `quark`로 · w-slow `slob`(모욕) → `slot` · w-meaningful `fool` → `full`은 정답 조각 ✕, `foal` · w-carefully `fool` → `foil` · w-control `troll` → `trail` · w-focus `kiss` → `fuss` · w-electrolyte `lick` → `lock` · w-answer `sewer` → `sower`. (nuts·sap·sob·gin·pray는 그대로 둬도 됨.)
23. w-uncomfortable·w-pain·w-comfort tag=약물, w-organ·w-procurement tag=신경 · 분류가 어긋남 · 앞 셋은 `진정`(또는 `사정`), 뒤 둘은 `가족`이나 `일반`으로(10개 안팎 집합 유지).

## 결정 11(v44 단어·문장) — 따로
24. w-tight · ko "단단히(팽팽하게)"는 뜻이 틀림 · ko "엄격히(빈틈없이)". changes-yaml에 fields [ko] 추가.
25. w-outcome · ko "경과(결과)" — 경과는 course, outcome은 최종 결과·예후 · ko "최종 결과(예후)".
26. w-meds · ko "약들"이 어색 · ko "약(구어)" 또는 "투약 약(meds)".
27. w-crash · ko "무너지다(크래시)"인데 문장은 타동("crashing his pressure") · ko "무너뜨리다(크래시)".
28. w-tomorrow · 공통 쉬운 말 목록의 today·morning과 같은 급 · 태그 제거·은행 삭제(연명과 중단 윤리 갈등은 10→9로 V3 유지). w-team·w-brain도 간호사가 아는 말이라 같은 처리를 권하나 "확실한 것만" 기준에서는 tomorrow만 확실.
29. 재관류 PCI 이송·조율 s3 ko "모든 수액이 펌프에…" · w-drip ko를 바꿨으니 문장 ko도 "모든 지속주입 약이 펌프에 걸려 있고 표시도 명확해요"로(비-keyPhrase, en·chunks 불변).
30. w-pressor/w-vasopressor 가름 · "승압제" vs "혈관수축성 승압제"는 뜻이 실제로 갈리지 않음(vasopressor가 곧 승압제) · 저우선. 듣기 문제에서 둘이 같이 나오지 않으면 실해 없음. 굳이 가르려면 pressor를 "승압제(구어 pressor)"로.
- 저작자 변경 목록 중 과하거나 틀린 것: 없음(12개 제거 타당, 헤드워드 tight→tightly·neurological→neurologically 타당).

## keyPhrase 문장 — 사용자 결정 필요(en은 고칠 대상 아님)
- 냉각 중 부정맥 위기 s0 "Deep hypothermia is causing bradycardia and now VT." — TTM 32~36도는 경도 저체온. "deep"은 사실과 어긋남.
- 냉각 중 부정맥 위기 s2 "Cold hearts resist drugs, so temperature matters here." — 약물·제세동 저항은 주로 30도 미만에서 뚜렷. TTM 범위에서는 과장.
- TTM 냉각 유도·유지 관리 s1 "Once there, we hold the temperature tightly stable." — 영어가 어색(hold it tightly controlled / keep it steady). 문장 ko "팽팽하게"도 뜻이 틀림(ko만이라도 "빈틈없이"로 바꿀지 결정).
- chunks 구 경계(보고만): 12유도 s1 `Send troponin / and / a full…`, ROSC 후 환기 s1 `Keep his CO2 / in / the normal range`, TTM 냉각 유도 s2 `Avoid overshooting / below / the target range`, K 전해질 s1 `Rewarming can cause / rebound / hyperkalemia`, 재가온 단계 s2 `Controlled rewarming / protects his / recovery`, 체온·전해질 s2 `Watch for trends / , not just / single values`, 재가온 중 혈압 붕괴 s2 `Slow the rewarming rate / while we stabilize / him`.

## 두어도 됨(저작자 메모 항목에 대한 판단)
- "Target is thirty-six degrees" 단위 없음 — 미국 TTM은 섭씨가 기본이라 실무 발화로 자연스러움. 그대로.
- "I bumped the pressor" — 처방 범위 안 적정은 미국 ICU 간호사의 일상 업무이고 구어로 자연스러움. 그대로(context 장면 아님).
- "I'll manage the airway during transport"(문장 s5) — 업무범위는 병원마다 다름(RT 동행이 흔함). 문장은 두되 context 장면(고칠 것 8)만 백밸브 보조로 좁힘.
- "we'll support whatever you choose" — 미국 가족 면담에서 흔한 말. 그대로.
- 뇌사 s3 "Two physicians … per policy" — 한정돼 있어 그대로.

## 종합
사실 오류는 가족 설명 한 줄(VT=irregular)·보편화된 뇌사 규칙·"깊은 저체온" 세 군데로 작고, 뉘앙스 why의 수치는 AHA 2020과 맞음. 그러나 **pair 2개가 모두 정답이 둘**이고 distractorsEn 품사 불일치가 54개로 체계적이라 그대로 내보내면 안 됨. 위 A·B·D 23건 + 품사 표 54건 + 결정 11 7건을 반영하면 내보내도 됨. keyPhrase 3문장(Deep hypothermia·Cold hearts·tightly stable)은 사용자 결정.
