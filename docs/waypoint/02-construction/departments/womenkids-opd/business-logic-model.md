---
artifact: business-logic-model
build-spec: departments/womenkids-opd
updated: 2026-07-18
---

# Women & Kids OPD — Business Logic (진입 · 이동 · 마커)

## 진입 · peds 교체
- **엘리베이터 WOMEN(여성소아 센터) 1F** — `ELEVATOR_BUILDINGS.women` 1F의 `interior`를 `INT-PEDS-00001` → **`INT-WOMENKIDS-OPD-00001`로 교체**, entry `{13,1}`(상단 캠퍼스 문). depts 라벨(소아·산부인과 외래·키즈광장)·sdepts `['PEDS']` 유지.
- **근거**: v16 핸드오프가 monolithic peds 센터(외래+병동+NICU)를 **층별 분리**(OPD→1F womenkids-opd · 병동→2F 소아 일반 병동 · NICU→4F). 사용자 지시로 1F를 정식 교체(피부과 2F 선례).
- **peds 잔존**: `INT-PEDS-00001`은 FIXTURES에 유지 → 병동/NICU 부분은 Phase 2에서 2F(소아 일반 병동)·4F(NICU)로 정식 분리될 때까지 딥링크로 접근 가능. 정식 분리 후 peds의 해당 구역은 각 정식 인테리어가 대체.
- **상단 캠퍼스 문**(x12-14 y0). 도착 시 문 안쪽 `{13,1}` 스폰 → 로비/놀이/외래/초음파.

## 이동 / 스폰
- playerStart `{4,8}`(로비). fixture-first 로딩(`FIXTURES['INT-WOMENKIDS-OPD-00001']` 동기) → 엘리베이터 재진입 안정([[project-elevator-transition]]).
- 룸 포커스 마스크: `regionAt` 최소면적 규칙. [[reference-sim-verification]]로 5구역 확인.

## 마커 (라벨만)
- 5개 standalone 핫스팟. 대표: 영유아 성장 계측(quest, 로비 — missionText), 소아 진찰·성장상담(quest, 소아 외래), 산전 진찰·상담(quest, 산부인과), 태아 초음파(info, 초음파실).
- `scenarioId` 미연결 — 소아/산과 외래 시나리오 콘텐츠 후 연결. 후보: 영유아 성장 계측·백분위(로비), 소아 진찰·성장상담(소아 외래), 산전 진찰·태아 심박 확인(산부인과/초음파).
