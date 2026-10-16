export const meta = {
  name: 'icu-or-onepass-rest',
  description: 'ICU·OR 나머지 66주제 한 번에 저작: Sonnet 저작 A‖B → 합치기 → Opus 검토 A‖B(+Fable 표본) → Sonnet 수정',
  phases: [
    { title: 'Author', detail: 'Sonnet 저작 A(단어·뉘앙스) ‖ B(문장 낱장·order)', model: 'sonnet' },
    { title: 'Combine', detail: 'combine_halves.py + verify_one_theme.py', model: 'sonnet' },
    { title: 'Review', detail: 'Opus 검토 A ‖ B, 부서마다 1주제 Fable 판정', model: 'opus' },
    { title: 'Fix', detail: 'Sonnet 수정 + 검사', model: 'sonnet' },
  ],
}

const ROOT = '/Users/ywyeom/private/forin/server/content/tools'
const items = args.topics

const common = (t) => `- <작업 폴더> = ${ROOT}/wip/icu-or-rest/${t.code} , <부서> = ${t.deptName} , <부서코드> = ${t.code} , <주제> = ${t.theme}
- 같은 폴더에서 다른 에이전트들이 동시에 일합니다. 파일 이름에 반드시 주제 이름(${t.theme})을 넣고, 다른 주제·다른 반쪽의 파일은 건드리지 마세요.
- 정본(server/content/nurse/...)은 수정하지 말고, git 커밋하지 마세요.`

const authorA = (t) => `당신은 forin(한국인 간호사가 미국 병원 영어를 배우는 앱) 학습 콘텐츠 저작자입니다. 지시서 ${ROOT}/pipeline/TASK.md 맨 아래 "한 번에 저작" 절의 **A — 단어·뉘앙스**를 맡습니다. 그 절이 가리키는 "보강 저작" 절 항목과 ${ROOT}/lesson_author_brief.md 의 해당 절을 먼저 읽으세요.
${common(t)}
- 입력: base-${t.theme}.yaml, in-${t.theme}.json. 출력: ${t.theme}.A.yaml (+ 필요하면 changes-${t.theme}.yaml, notes-${t.theme}-A.md).
- 뉘앙스 why·notes는 미국 병원 관행에 맞는 사실만, 확신 없는 수치는 쓰지 마세요. 오답 조각(decoyChips)에 비속어·성적인 말이 들어가면 V21 오류입니다. slider는 정답 칸을 섞고(가운데만 ✕) 보기 길이를 비슷하게(W20).
- 문장 en·ko가 틀렸거나 간호사가 지킬 수 없는 약속(단정적 위로 등)이면 고치지 말고 notes에 적으세요.
끝나면 지시서의 "돌려줄 말"을 한국어로 짧게.`

const authorB = (t) => `당신은 forin(한국인 간호사가 미국 병원 영어를 배우는 앱) 학습 콘텐츠 저작자입니다. 지시서 ${ROOT}/pipeline/TASK.md 맨 아래 "한 번에 저작" 절의 **B — 문장 낱장·순서**를 맡습니다. 그 절이 가리키는 "v46 보강" 절 항목과 ${ROOT}/lesson_author_brief.md 의 "v46 — 문장 낱장과 순서 배열 카드" 절 전부를 먼저 읽으세요.
${common(t)}
- 입력: base-${t.theme}.yaml, in-${t.theme}.json. 출력: ${t.theme}.B.yaml (+ 필요하면 notes-${t.theme}-B.md).
- 안전 시험을 특히 지키세요: 오답이 그 순간 정답 행동 대신 다른 일을 하게 만들면 안 되고(처치 지연), 호출 대상·확인 주체·확인 위치·용량·약·시점을 바꾸면 안 됩니다. 지시·처치 동사는 오답에도 남깁니다. 응급 문장일수록 조심하세요.
- 주제 단위 경고 W18~W21(같은 decoy·빈칸 오답 4번 이상, 오답 ko 어간 되풀이, 확인을 뒤집는 빈칸 오답)도 0건이 목표입니다.
끝나면 지시서의 "돌려줄 말"을 한국어로 짧게.`

const combine = (t) => `작업 폴더 ${ROOT}/wip/icu-or-rest/${t.code} 에서 주제 ${t.theme}의 두 반쪽을 합치고 검사합니다. 다른 파일은 건드리지 마세요.
1. cd ${ROOT} && python3 combine_halves.py wip/icu-or-rest/${t.code} ${t.theme}
2. python3 verify_one_theme.py ${t.code} wip/icu-or-rest/${t.code}/${t.theme}.yaml
합치기가 실패하면(상황·문장이 어긋남) 원인 한 줄을 적으세요. 고치지는 마세요. 결과를 구조화해서 돌려주세요.`

const reviewA = (t) => `당신은 forin 학습 콘텐츠의 검토자입니다. 지시서 ${ROOT}/pipeline/REVIEW.md 맨 아래 "한 번에 저작 검토" 절의 **A 검토**를 합니다(그 절이 가리키는 v45 절 1~7·기계적 전수 확인 전부와 v46 절 7번).
${common(t)}
- 대상: ${t.theme}.yaml(A·B 합친 파일). 비교: base-${t.theme}.yaml, changes-${t.theme}.yaml(있으면), in-${t.theme}.json, 저작자 메모 notes-${t.theme}-A.md·-B.md(있으면).
- decoyChips 전부를 비속어·불쾌한 조각 관점에서도 보세요. 품사가 다른 distractorsEn은 전부 표로.
- keyPhrase 문장(in-…json의 keyPhrases)의 en은 고칠 대상이 아니라 '사용자 결정 필요'로 따로 보고합니다(ko만 고치는 것은 결정 11 범위라 고칠 것에 넣어도 됨). keyPhrase가 아닌 문장의 사실 오류·지킬 수 없는 약속은 고칠 en·ko·chunks를 구체적으로 적고, 그 문장의 v46 필드도 새로 쓰라고 적으세요.
- 결과를 fix-${t.theme}-A.md로 저장하세요. 대상 파일은 수정하지 마세요.
돌려줄 말: 고칠 것 개수, 심각한 문제, keyPhrase 결정 필요 목록을 구조화해서.`

const reviewB = (t) => `당신은 forin 학습 콘텐츠의 검토자입니다. 지시서 ${ROOT}/pipeline/REVIEW.md 맨 아래 "한 번에 저작 검토" 절의 **B 검토**를 합니다(그 절이 가리키는 v46 절 1~6·8 전부, distractorsKo ①~⑥과 되풀이 상한 — 어간 기준).
${common(t)}
- 대상: ${t.theme}.yaml(A·B 합친 파일). 기준: ${ROOT}/lesson_author_brief.md "v46 — 문장 낱장과 순서 배열 카드" 절 전부.
- 문장 전수입니다. 스크립트로 \`en | ko | 오답1 | 오답2\`, 빈칸 네 줄, order 인접 교환을 전부 뽑아 한 줄씩 판정하세요.
- 안전 판정 기준: 오답이 정답 행동의 앞·뒤 단계면 통과, 그 순간 정답 행동 대신 하는 일이면 실패. 호출 대상·확인 주체·확인 위치·용량·약·시점 바꾸기, 처치를 늦추는 decoy, 넣어 읽으면 위험한 지시가 되는 빈칸 선택지는 실패.
- 저작자 메모 notes-${t.theme}-B.md가 있으면 그 질문도 판정하세요.
- 결과를 fix-${t.theme}-B.md로 저장하세요. 대상 파일은 수정하지 마세요.
돌려줄 말: 고칠 것 개수와 그중 안전·정답 둘 개수, 심각한 문제를 구조화해서.`

const judge = (t, half) => `당신은 forin 학습 콘텐츠의 독립 판정자입니다. 지시서 ${ROOT}/pipeline/REVIEW.md 맨 아래 "Fable 표본 판정" 절을 따라, 같은 파일의 "한 번에 저작 검토" **${half} 검토** 범위를 독립적으로 전수 검토합니다.
${common(t)}
- 대상: ${t.theme}.yaml. **fix-*.md 파일은 열지 마세요**(독립성이 이 판정의 목적입니다).
- 오답 조각 비속어, 품사 불일치, 한국어 오역, 어간 단위 되풀이, order가 하나로 못 박히는지, 안전 시험을 특히 보세요. keyPhrase en은 '사용자 결정 필요'로 따로.
- 결과를 judge-${t.theme}-${half}.md로 저장하세요. 대상 파일은 수정하지 마세요.
돌려줄 말: 고칠 것 개수와 그중 안전 개수, 심각한 문제를 구조화해서.`

const fix = (t) => `당신은 forin 학습 콘텐츠의 수정 담당입니다. 지시서 ${ROOT}/pipeline/FIX.md(맨 위 공통 절, "v46 보강 수정" 절, 맨 아래 "한 번에 저작 수정" 절)를 읽으세요. 기준은 ${ROOT}/lesson_author_brief.md 의 v45 두 절·v46 절·결정 11 절·수정 모드 절입니다.
${common(t)}
- 고칠 파일: ${t.theme}.yaml (제자리에서 스크립트 fix_${t.theme}.py와 데이터 파일 fix_${t.theme}_data_N.yaml로).
- 검토 목록: fix-${t.theme}-A.md, fix-${t.theme}-B.md${t.fable ? `, 그리고 Fable 독립 판정 judge-${t.theme}-A.md·judge-${t.theme}-B.md(Opus 목록에 없는 것만 더 반영; 같은 자리에 다른 값이면 안전한 쪽, 그다음 Opus 쪽)` : ''}. 번호 체계가 목록마다 다를 수 있으니 상황 제목과 문장 en으로 위치를 맞추세요.
- 우선순위: 비속어 조각 → 안전 → 사실 오류 → 정답 둘 → 나머지 전부. 틀렸다고 판단한 항목만 이유를 적고 건너뛰세요.
- **keyPhrase 문장의 en·chunks는 절대 바꾸지 마세요**(사용자 결정 대기). ko만 고치는 것은 됩니다. 문장 ko·en을 바꾸면 그 문장의 v46 필드와 그 문장을 example로 쓰는 단어의 example·exKo를 맞추고 changes-${t.theme}.yaml에 적으세요. 결정 11로 단어를 지우면 상황마다 서로 다른 단어 8개(V3)를 확인하세요.
- 끝나면 \`ko | 오답1 | 오답2\`와 오답 전용 낱말 빈도(어간 기준)를 다시 확인하고, python3 ${ROOT}/verify_one_theme.py ${t.code} ${ROOT}/wip/icu-or-rest/${t.code}/${t.theme}.yaml 로 위반 0건 \`==> 통과\`까지 고치세요. W18~W21 경고도 가능한 한 0으로.
돌려줄 말을 구조화해서.`

const COMBINE_SCHEMA = { type: 'object', properties: { combined: { type: 'boolean' }, verifyPass: { type: 'boolean' }, violations: { type: 'integer' }, note: { type: 'string' } }, required: ['combined', 'verifyPass'] }
const REVIEW_SCHEMA = { type: 'object', properties: { fixCount: { type: 'integer' }, safety: { type: 'integer' }, serious: { type: 'array', items: { type: 'string' } }, keyPhraseDecisions: { type: 'array', items: { type: 'string' } } }, required: ['fixCount', 'safety'] }
const FIX_SCHEMA = { type: 'object', properties: { verifyPass: { type: 'boolean' }, fixed: { type: 'integer' }, skipped: { type: 'array', items: { type: 'string' } }, changesCount: { type: 'integer' }, warnings: { type: 'integer' }, note: { type: 'string' } }, required: ['verifyPass', 'fixed'] }

const results = await pipeline(items,
  // t.haveA / t.haveB: 그 반쪽이 이미 끝나 <주제>.A.yaml / .B.yaml 이 있으면 저작을 건너뛴다(2026-10-16 중단분 이어 가기).
  (t) => parallel([
    () => t.haveA ? Promise.resolve('skip A') : agent(authorA(t), { label: `A:${t.theme}`, phase: 'Author', model: 'sonnet' }),
    () => t.haveB ? Promise.resolve('skip B') : agent(authorB(t), { label: `B:${t.theme}`, phase: 'Author', model: 'sonnet' }),
  ]).then(r => { if (!r[0] || !r[1]) throw new Error('author failed ' + t.theme); return r }),
  (authored, t) => agent(combine(t), { label: `combine:${t.theme}`, phase: 'Combine', model: 'sonnet', effort: 'low', schema: COMBINE_SCHEMA })
    .then(c => { if (!c || !c.combined) throw new Error('combine failed ' + t.theme + ': ' + (c && c.note)); return c }),
  (c, t) => parallel([
    () => agent(reviewA(t), { label: `revA:${t.theme}`, phase: 'Review', model: 'opus', schema: REVIEW_SCHEMA }),
    () => agent(reviewB(t), { label: `revB:${t.theme}`, phase: 'Review', model: 'opus', schema: REVIEW_SCHEMA }),
    ...(t.fable ? [
      () => agent(judge(t, 'A'), { label: `judgeA:${t.theme}`, phase: 'Review', model: 'fable', schema: REVIEW_SCHEMA }),
      () => agent(judge(t, 'B'), { label: `judgeB:${t.theme}`, phase: 'Review', model: 'fable', schema: REVIEW_SCHEMA }),
    ] : []),
  ]),
  (reviews, t) => agent(fix(t), { label: `fix:${t.theme}`, phase: 'Fix', model: 'sonnet', schema: FIX_SCHEMA })
    .then(f => ({ theme: t.theme, code: t.code, reviews, fix: f })),
)

const done = results.filter(Boolean)
log(`${done.length}/${items.length} topics finished; ${done.filter(r => r.fix && r.fix.verifyPass).length} pass verify`)
const failed = items.filter((t, i) => !results[i]).map(t => t.theme)
return { done, failed }