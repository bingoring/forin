# core-family-er v44 수정 재검토

비교: 정본에서 새로 뽑은 base(고치기 전) ↔ `wip/er-v44fix/base-core-family-er.yaml`, `git diff changes/er/changes-core-family-er.yaml`.
목록 행 5개(3.4 ko, 10.4·14.2 ko, 10.3 en+swap, 18.3 en, 17.1~17.3 기증 흐름)를 모두 대조했습니다. 빠진 행 없음.
changes 항목은 실제로 바뀐 v44 키(문장 en/ko/chunks/words, 단어 example, 단어 추가 3·삭제 6)와 모두 맞습니다(exKo 기록은 v44 키가
아니라 남아도 무해). 검사: keyPhrase를 tsv 값으로 바꾼 스크래치 시드로 돌려 `==> 통과`, W14 0건.

## 수정자 판단에 대한 판정
- **3.4·10.4·14.2 ko, 10.3 `let me show you how`(swap options/answer/notes 포함), 18.3 `feel that way`:** 처방대로입니다. 18.3을 받는
  order L2 `tell me all of it`의 it은 그대로 분노·일을 받아 어긋나지 않습니다.
- **S17 기증 흐름(처방 없음, 17.1·17.2 keyPhrase, 17.3):** 문장 셋은 **수용**합니다. 미국은 CMS 조건(42 CFR 482.45)에 따라 병원이
  사망·임종 임박 환자를 OPO에 반드시 알리고, 가족에게 기증을 **청하는 사람은 OPO 담당자나 훈련받은 지정 요청자**여야 합니다.
  병상 간호사는 청하거나 설득하지 않고 연결만 한다는 새 문장(17.1 담당자가 온다, 17.2 저는 연결만, 17.3 등록 여부는 팀이 확인)이
  이 틀과 맞고, 등록 기증자면 본인 동의(1인칭 승인)가 우선이라 "전적으로 가족의 선택"을 뺀 것도 맞습니다. 15단어 이하, ko 일치.
  **다만 이 문장들은 "가족이 먼저 묻거나, OPO 연락 뒤 담당자가 오기로 한" 장면에서만 맞습니다.** 정본 시드는 아직 간호사가 기증을
  먼저 꺼내는 장면입니다(아래 고칠 것 1). 시드를 바꾸지 않으면 AI 대화가 학습자에게 기증을 먼저 꺼내게 해서 원래 지적이 되살아납니다.
- **단어 삭제(w-entirely·w-sensitive·w-option·w-mention·w-gently):** 파일 어디에도 남은 참조가 없습니다(문장·nuance·order 0건). 삭제 수용.
- **단어 추가(w-connect·w-register):** 새 문장의 핵심어라 수용. 은행 필드(ipa·icon·distractorsEn/Ko·chips)에 문제 없음.
- **w-choice cue "전적으로 가족의 몫", w-softly의 "아이":** 둘 다 고칩니다(고칠 것 4·5). 둘 다 v45 필드라 changes 기록은 필요 없습니다.

## 고칠 것

1. **S17 장기기증 대화 연계 — 정본 시드가 간호사가 먼저 기증을 꺼내는 장면** (사실·안전, 합칠 때 처리 — base 범위 밖)
   - 문제: `nurse/topics/er.yaml`의 이 상황 tagline `There's a sensitive option I'd like to gently mention.`(지운 문장),
     brief "뇌사 환자 가족에게 장기기증 대화를 민감하게 연계하세요", goals "애도를 우선하며 기증 대화를 조심스럽게 연다"가 모두
     간호사가 기증을 여는 흐름입니다. 새 문장·order와 어긋나고, 지정 요청자 규정에도 어긋납니다.
   - 처방(시드, merge-notes에 추가):
     - tagline: `"When you're ready, a donation specialist will come to talk with you."`
     - brief: `뇌사 환자 가족이 장기기증을 물을 때, 직접 권유하거나 설명하지 말고 기증 담당 팀(OPO)에 연결하세요.`
     - goals: `[애도를 우선하며 가족의 기증 질문을 존중해 받는다, 직접 권유하지 않고 OPO 기증 담당자에게 연결한다]`
     - persona speakingStyle `조심스레 질문함`은 그대로 두면 됩니다(형이 기증을 먼저 묻는 장면과 맞음). skills의 `민감한 접근`도 유지.

2. **S17 17.1 `decoy` — 정답 자리에 넣으면 맞는 영어** (문체)
   - 문제: `instead of me`가 `to talk with you` 자리에 들어가면 "When you're ready, a donation specialist will come instead of me."가 됩니다.
   - 처방: `decoy: talk about` (네 자리 모두 비문 확인)

3. **S17 nuance pair `decoys` — 정답이 둘** (문법·뜻)
   - 문제: `connecting you` + 디코이 `to the team` = "connecting you to the team"은 표준 영어입니다(connect A to B도 맞음).
     `why`의 "connect you with는…"도 with만 맞는 것처럼 읽힙니다.
   - 처방: `decoys: [at the team]`. `why` 첫 구절을 `connect you with(to)는 사람을 다른 사람·팀에 이어 주는 말이고,`로.

4. **w-choice `cue`** (뜻)
   - 문제: "전적으로 가족의 몫"은 S17에서 뺀 단정과 같은 말이고, 예문(S16 "There's no wrong choice — let's decide together.")의 함께 정하기와도 어긋납니다.
   - 처방: `cue: 여러 길 중 가족이 고르는 결정 — 틀린 답이 없다고 안심시킬 때 'no wrong ___'`

5. **S10 보호자 과잉 개입 — "아이"가 남은 v45 필드** (뜻; 10.4 ko 수정과 같은 취지)
   - 문제: 10.0~10.4 ko는 모두 "환자분"인데 예문의 exKo·cue·slider why에 "아이"가 남았습니다(persona는 50대 어머니, 소아 장면 아님).
   - 처방:
     - w-most·w-near·w-softly `exKo`: S10.2 ko 그대로 `머리 쪽 가까이 계시면서 부드럽게 말씀해 주시는 게 가장 도움이 돼요.`
     - w-safety·w-little `exKo`: S10.1 ko 그대로 `환자분의 안전을 위해 제가 처치할 공간이 조금 필요해요.`
     - w-softly `cue`: `불안한 환자 곁에서 목소리를 낮춰 — talk ___`
     - S10 nuance slider `why`의 `아이가 위험한 순간에만` → `환자가 위험한 순간에만`

6. **S10·S18 시드 tagline이 옛 문장** (문체, 합칠 때 처리)
   - S10 tagline `I know you want to help — let me guide how.` → `I know you want to help — let me show you how.`
   - S18 tagline `I hear your anger — you have every right to it.` → `I hear your anger — you have every right to feel that way.`

고칠 것 6건(사실·안전 1건: 1번).
