---
build-spec: scenario-runtime
stage: 02-construction / 06-screens-flows (시나리오 런타임 · ER 파일럿)
status: IN_PROGRESS
depth: comprehensive
updated: 2026-07-18
---

# Build Spec — 시나리오 런타임 (브리핑 → AI 다이얼로그) · ER 파일럿

핸드오프 인테리어(5g-*)까지 완성된 지금, 퀘스트 핫스팟을 **실제 시나리오 → AI 롤플레이 대화**로 연결하는 런타임을 붙인다. Go/FastAPI 결정에서 **Go 유지** 확정(대화 엔진·스트리밍·교정·발음이 이미 Go로 구현됨). 착수 전략은 **버티컬 슬라이스** — ER 시나리오 1개를 A→B→C 끝까지 관통시켜 파이프라인을 검증하고, 이후 부서·콘텐츠로 확장.

| | |
|---|---|
| 파일럿 시나리오 | `er-hopkins-pain` (통증 사정 — Mrs. Hopkins, ER Trauma Bay #4) |
| SoT(핸드오프) | `design-handoff_v16` `scenarios-data.jsx` · `screen-briefing.jsx` · `screens-dialogue.jsx` |
| 진입점 | `fixtures/er.ts` 핫스팟 `o-tri-recep` (이미 `scenarioId: 'er-hopkins-pain'` 배선됨) |

## §0. 현재 상태 지도 (착수 시점)
```
✅ 서버 대화 엔진   conversation/{engine,strategy}.go — StartSession·SendMessage·SendMessageStream·Correct
✅ LLM 어댑터       anthropic.go · openai.go (ports.LLMMessage 추상화) · azurespeech(발음)
✅ 엔드포인트       GET /scenarios/{id} · POST /scenarios/{id}/conversation · /conversation/{sid}/message|stream
✅ 콘텐츠 파이프    yaml → contentfile.Load → ContentRepo.Seed → Postgres
✅ 모바일 라우팅    interior/[id] onEnterScenario → router.push(/scenario/{scenarioId})  (이미 동작)
✅ Hotspot.scenarioId 타입 + ER 핫스팟 4곳 배선 (er-hopkins-pain 등)
⚠️ scenario/[id].tsx  스텁 ("Stage 2-6에서 구현")
⚠️ api/client.ts      interior()만 — scenario/conversation 메서드 없음
⚠️ content.Scenario   브리핑 표시필드(brief·difficulty·skills·rewards·npc-sub) 없음
⚠️ ID 스킴 불일치     모바일=케밥(er-hopkins-pain) vs 서버 seed=SCN-ER-00001 → 케밥으로 정렬
```

## §1. 핵심 결정
- **D1 · 스택**: **Go 유지.** 대화 필요(단일 페르소나 롤플레이+스트리밍+교정)는 API glue이며 이미 구현됨. LangChain/LangGraph는 forin의 현 요구를 초과. 향후 RAG/에이전트 그래프 필요 시 **파이썬 사이드카**로 분리(재작성 아님).
- **D2 · 콘텐츠 SoT**: **서버 단일 SoT.** 브리핑이 요구하는 추가 필드를 `content.Scenario`에 **optional**로 확장 → v16 소스에서 완전 저작 → seed. 모바일은 렌더만. `reqs.met`은 `/me` 프로필로 클라이언트 계산.
- **D3 · ID 컨벤션 (수정됨)**: 서버 검증기가 콘텐츠 ID를 `^[A-Z]+(-[A-Z]+)*-\d{5,}$`(예 `SCN-ER-00002`)로 강제 — 인테리어(`INT-*`)·부서(`DEPT-*`)·이벤트(`EVT-*`)와 동일 컨벤션. 모바일 인테리어도 이미 `INT-*` 사용. 따라서 **서버 `SCN-*` 컨벤션 채택**, 파일럿 = `SCN-ER-00002`(Mrs. Hopkins). 핸드오프의 비공식 케밥(`er-hopkins-pain`)은 이 스킴으로 정렬. ER 핫스팟 `o-tri-recep` → `SCN-ER-00002`로 갱신. 나머지 케밥 핫스팟 3건은 후속 저작 시 정렬.
- **D4 · 착수**: **버티컬 슬라이스**(ER 1개 관통). 대화 화면 1:1 포팅. free 모드(텍스트) 실제 AI 연결이 슬라이스의 증명 목표; 힌트모드·마이크STT·결과화면·발음채점은 슬라이스 내 후속.

## §2. 아티팩트 매니페스트
| [domain-entities](domain-entities.md) · [business-rules](business-rules.md) · [business-logic-model](business-logic-model.md) · [frontend-components](frontend-components.md) |
|---|

## §3. 분해 (버티컬 슬라이스)
| # | 단위 | 파일 |
|---|---|---|
| A | Scenario 모델 브리핑 필드 확장 + ER yaml 저작 + seed | `server/internal/domain/content/content.go` · `server/content/nurse/scenarios/er-hopkins-pain.yaml` |
| B | 모바일 API 클라이언트 scenario/conversation | `mobile/src/api/client.ts` |
| C1 | 브리핑 화면 1:1 포팅 | `mobile/src/app/scenario/[id].tsx` (스텁 교체) |
| C2 | 대화 화면 1:1 포팅 + AI 연결 | `mobile/src/app/scenario/[id]/dialogue.tsx` (신규) |
| V | 시뮬레이터 E2E 관통 + 커밋 | — |

## §4. 체크리스트
- [x] A: 모델 확장(optional Briefing·Persona 표시필드)·`SCN-ER-00002.yaml`·마이그레이션 9(briefing jsonb)·seed·**`GET /scenarios/SCN-ER-00002` 실서버 briefing 왕복 확인**·기존 SCN-* 로드 호환(contentfile 로드 테스트)
- [x] B: api.scenario/startConversation/sendMessage/sendMessageStream(XHR SSE 파서)·토큰 인터셉터 재사용·tsc 0
- [x] C1: 브리핑 1:1(리본·NPC 초상·SITUATION·스킬·보상·조건·footer)·**시뮬레이터 실데이터 렌더 확인**
- [x] C2: 대화 1:1(방 배경·초상 프레임·MISSION·스피커탭·free 입력)·**시뮬레이터 세션 오픈+오프닝 렌더 확인**
- [x] V: **실 스택 E2E — DB seed→`GET /scenarios`→devtoken→`POST conversation`→`message`(페르소나 응답)→`stream`(SSE) 관통**; 브리핑/대화 시뮬레이터 화면단위 확인; go test·tsc 0·jest 208/208

> **검증 결과:** 백엔드 파이프라인(yaml→seed→DB→GetScenario→StartSession→persona 프롬프트→LLM(openai)→스트리밍)이 실 엔드포인트로 관통. NPC(Mrs. Hopkins) 페르소나 응답 확인("It's sharp... stabbing me in the side", "I'd say... an 8"). 스트리밍 SSE 형식이 모바일 파서와 일치. 브리핑 화면은 시뮬레이터에서 실서버 데이터로 렌더, 대화 화면은 유효 세션으로 오프닝·초상·미션 렌더. (대화 화면의 시뮬레이터 happy-path는 실 로그인 세션 필요 — 검증 시 임시 devtoken 주입 후 원복.)

## §5. 후속 (슬라이스 밖)
힌트모드(선택지·번역)·마이크 STT·발음 채점(azurespeech)·결과/리워드 화면(컨페티)·미니퀴즈 8종·나머지 시나리오 저작(ER 8→OR/PEDS/ICU/PHARMA→신규 20부서)·`scenarios.ts` Dept 타입 20부서 확장·레거시 SCN-* 정렬.
