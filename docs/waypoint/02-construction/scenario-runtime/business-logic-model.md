---
artifact: business-logic-model
build-spec: scenario-runtime
updated: 2026-07-18
---

# 시나리오 런타임 — Business Logic (플로우 · API · 상태)

## 관통 플로우 (ER 파일럿)
```
인테리어(ER) 퀘스트 핫스팟 o-tri-recep 탭
  → InteriorScreen.onEnterScenario(h.scenarioId='SCN-ER-00002')   [이미 동작]
  → router.push('/scenario/SCN-ER-00002')
  → 브리핑 화면: api.scenario('SCN-ER-00002')  →  GET /scenarios/{id}
        · reqs.met = /me 대조
        · [나중에] router.back()  |  [지금 진행] router.push('/scenario/{id}/dialogue')
  → 대화 화면: api.startConversation(id)  →  POST /scenarios/{id}/conversation → {sessionId}
        · free 모드 입력 → api.sendMessageStream(sessionId, text, onDelta)
              →  POST /conversation/{sessionId}/stream (SSE/청크)
        · NPC 응답 delta append → 말풍선/초상 표정(persona.mood)
```

## API 클라이언트 (mobile `api/client.ts` 추가)
- `scenario(id): Promise<Scenario>` — `GET /scenarios/{id}`
- `startConversation(scenarioId): Promise<{sessionId}>` — `POST /scenarios/{id}/conversation`
- `sendMessage(sessionId, text): Promise<{reply}>` — `POST /conversation/{sessionId}/message` (비스트리밍 fallback)
- `sendMessageStream(sessionId, text, onDelta): Promise<full>` — `POST /conversation/{sessionId}/stream` (fetch + ReadableStream/청크 파싱; RN fetch 스트리밍 제약 시 message 폴백)
- 모두 기존 axios 인스턴스(`http`)·토큰 인터셉터 재사용. 스트리밍은 별도 fetch(인터셉터 토큰 수동 첨부).

## 화면 상태
- **브리핑**: `useQuery`/로컬 fetch로 scenario. 로딩/에러/성공. reqs met 계산은 순수함수.
- **대화**: `sessionId`, `messages[]`, `pending`(전송중), `streamingText`. free 입력 텍스트. 힌트/마이크는 후속 상태.

## 시나리오→핫스팟 매핑
- ER 핫스팟 4곳 이미 배선(`SCN-ER-00002`·`er-anaphylaxis`·`er-chest-pain`·`er-mental-health`). 파일럿은 `SCN-ER-00002`만 서버 저작 → 나머지는 404 fallback(후속 저작).
