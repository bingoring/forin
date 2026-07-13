---
artifact: business-logic-model
build-spec: departments/pharma
updated: 2026-07-12
---

# Pharmacy — Business Logic (진입 · 이동 · 마커)

## 진입 2경로 (Q1 = 둘 다)
1. **엘리베이터 타워 P1층** — `ELEVATOR_BUILDINGS.tower`에 신설:
   ```
   { f: 'P1', depts: ['중앙 약제부 · 원내 약국','IV 무균조제실','마약류 보관고'],
     icon: '💊', sdepts: ['PHARMA'], interior: 'INT-PHARMA-00001', entry: { x: 16, y: 40 } }
   ```
   1F(ER 로비) 아래에 배치. 선택 후 이동 → `interior/INT-PHARMA-00001?via=elevator&…&ex=16&ey=40` (캠퍼스문 바로 안쪽 스폰) → DoorReveal 층 티커(P1) → 완전 렌더 후 개방.
2. **ER 약품실(PYXIS) portal** — `ER_INTERIOR.hotspots`:
   ```
   { id:'hs-pharma', kind:'portal', x:18, y:20, label:'→ 원내 약국',
     target:'INT-PHARMA-00001', entry:{ x:9, y:9 } }
   ```
   `Hotspot`에 `target`/`entry` 필드 추가(`engine/types.ts`). 마커 글리프 `→`(HotspotMarker: `kind==='portal' → '→'`), 색 `#A7F3D0`(HS_COLORS.portal).

## portal 라우팅 (`app/interior/[id].tsx`)
`onEnterScenario` 분기 추가:
```
else if (h.kind === 'portal' && h.target) {
  const at = h.entry ? `?ex=${h.entry.x}&ey=${h.entry.y}` : '';
  router.push(`/interior/${h.target}${at}`);   // push → 뒤로가기 시 ER 복귀
}
```
- 엘리베이터(`router.replace` + via=elevator + DoorReveal)와 달리 portal은 **일반 push**(문 통과 = 좌우 슬라이드 전환, 엘리베이터 연출 없음). 뒤로가기로 ER로 돌아옴.
- 목적지 스폰은 `?ex&ey`(spawned playerStart 오버라이드). portal entry `{9,9}`(수령창구 로비).

## 이동 / 스폰
- 기본 playerStart `{9,9}`(수령창구). 엘리베이터 도착 `{16,40}`(캠퍼스문 안쪽, 조제실 하단). portal 도착 `{9,9}`.
- fixture-first 로딩(`FIXTURES['INT-PHARMA-00001']` 동기) — 서버 왕복 없음. 엘리베이터 재진입 시 오브젝트 소실 방지(StaticWorld 격리 + 오브젝트 1프레임 지연 마운트, [[project-elevator-transition]] 참조).

## 마커 (라벨만, Q2)
- 오브젝트 속성: atcmachine(info 자동 조제)·검수대(quest 처방 더블체크)·narcoticsvault(info 마약류 관리 대장)·sanitizer(info 방진복·에어샤워)·bsc1(quest 항암제 믹스)·wallphone(urgent STAT 콜).
- standalone 핫스팟: 누락 약 확인(quest)·캡슐 송수신(info).
- `scenarioId` 미연결 — 서있고 A 눌러도 no-op(시나리오 콘텐츠 후 연결). 약제 시나리오 후보: 누락약 더블체크, 항암 BSC 조제, 마약류 대장.
