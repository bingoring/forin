---
artifact: domain-entities
build-spec: scenario-runtime
updated: 2026-07-18
---

# 시나리오 런타임 — Domain Entities

## `content.Scenario` 확장 (서버, 모두 optional → 기존 yaml 로드 호환)
기존: `id · profession · eventId · title · tagline · persona · goals · guardrails · keyPhrases · steps`.
추가:
```go
Briefing *Briefing `yaml:"briefing" json:"briefing,omitempty"`

type Briefing struct {
  Dept       string   // "ER · TRAUMA BAY #4"
  DeptColor  string   // "#DC2626"
  Brief      string   // SITUATION 단락
  Difficulty int      // 1..3 (EASY/MEDIUM/HARD)
  TimeLabel  string   // "약 5분"
  Skills     []string // 연습할 스킬 칩
  Rewards    []Reward // {Icon,Label,Value}
  Reqs       []Req    // {Label,Metric,Threshold} — met는 클라이언트 계산
  Tone       string   // 카드 톤 색
  Accent     string
}
type Reward struct { Icon, Label, Value string }
type Req    struct { Label string; Metric string; Threshold int }
```
`Persona` 확장(초상 표시용, optional): `Sub`("67y / Female") · `Hair`("#9A6B3F") · `HairStyle`("bob").
- AI 구동은 기존 필드(name·role·mood→expression·personality·speakingStyle) 그대로. 신규는 **표시 전용**.

## ER 파일럿 yaml — `SCN-ER-00002`
v16 `scenarios-data.jsx` + `screen-briefing.jsx`(er 프리셋)에서 완전 저작:
- id `SCN-ER-00002` · profession `nurse` · title "통증 사정 — Mrs. Hopkins" · tagline "It started about an hour ago…"
- persona: name "Mrs. Hopkins" · role patient · ageRange "60s" · sub "67y / Female" · hair "#9A6B3F" · hairStyle bob · mood pain · personality/speakingStyle(통증·불안, 짧고 끊기는 말투)
- goals: 통증 사정(PQRST) · 닥터 보고 정보 수집 / guardrails: 공감·의학용어 과용 금지
- keyPhrases: "On a scale of 0 to 10" · "Can you describe the pain?"
- briefing: dept "ER · TRAUMA BAY #4" · deptColor #DC2626 · brief(응급베이 도착·우측 팔 통증·활력 안정·PQRST 사정) · difficulty 2 · timeLabel "약 5분" · skills[통증 사정(PQRST)·청구 어휘·의문문 만들기] · rewards[⭐+120XP·❤환자만족도+6·🎖응급대응+1] · reqs[레벨 B1+·응급대응력 60+] · tone peach · accent peachShadow

## 모바일 타입 (렌더용)
`api.scenario(id)` 응답 = 서버 `Scenario`(JSON). 모바일에 `Scenario`/`Briefing`/`Reward`/`Req` 타입 미러(또는 `@engine` 확장). `reqs.met` = 클라이언트가 `/me`(레벨·스탯) 대조.

## 대화 세션 엔티티 (기존 서버)
`POST /scenarios/{id}/conversation` → `sessionId`. 메시지 = `{role: user|assistant, text}`. 스트리밍은 delta. 교정(`Correct`)은 별도 `Correction{original, fixed, notes}`.
