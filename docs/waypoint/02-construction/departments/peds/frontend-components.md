---
artifact: frontend-components
build-spec: departments/peds
status: DRAFT
updated: 2026-07-10
---

# Frontend Components — 5g-d Peds+NICU (렌더)

> 공통 파이프라인/디스패치는 [er/frontend-components.md](../er/frontend-components.md). **v13 규약**(README §): 통합 실루엣+상단면+seam+viewer-facing+**접지 그림자 타원**. `<text>`는 도형 블록으로.

## 1. 신규 카탈로그 `objects/pedsEquipment.tsx` (`PedsObjectView`)
**임상(peds2 소스 — 이미 v13 접지 그림자 포함, 그대로 포팅):**
- `incubator` — 베이스 캐비닛(top deck+front band+seam) + 반투명 아크릴 후드(occupied 시 아기) + 바퀴. viewBox 36×42, offY-8, 2×2 footprint.
- `phototherapy` — 청색광 LED 어레이 + **하향 빔**(zIndex1) → **OVERHEAD z**(surgicallight처럼). "UVB" 텍스트→블록. viewBox `${w*16}×30`.
- `metalcrib` — 철제 창살 크립(원경 rail+상단 매트리스+근경 foot rail+side rails+바퀴), occupied 아기, stuffie 이모지. viewBox 32×48, 2×3.
- `ivboard` — 별모양 부목판 + 테이프 IV. viewBox 10×10(탁상, 비차단).
- `babyscale` — 바구니형 체중계(top basin oval + front display "4.2kg"→블록). viewBox 24×24.
- `stadiometer` — 신장계(플랫폼+측정 기둥+헤드바+동물 얼굴 토퍼+"112cm"). viewBox 22×46, offY-20.
- `tonguejar` — 설압자 통(탁상). viewBox 8×10.
- `stickerroll` — 보상 스티커 롤(탁상). viewBox 8×8.
- `dosingchart` — 체중 기반 투약표(벽, 비차단). viewBox `${w*16}×18`.
- `milkfridge` — 모유 냉장고(유리문+젖병 선반+"4°"). viewBox 24×37, offY-5.

**놀이방(interior-peds.jsx 내부 정의 소스):**
- `smallslide` — 미끄럼틀(사다리+데크+슈트). viewBox 42×38, offY-6.
- `rockinghorse` — 흔들목마(bob 애니). viewBox 36×34, offY-6.
- `toychest` — 장난감 상자(open top+toys). viewBox 32×28, offY-4.
- `blocks` — 블록 무더기(div rects). ~1.2×0.8.
- `mural` — 벽화(div, 벽). 4×2.
- `balloon` — 풍선(bob 애니, 색 파라미터 c). viewBox 8×14.
- (`PedsBed` — 핸드오프의 주황/핑크 소아 침대. **§Q3**: `ibed variant='peds'`가 sharedEquipment에 있으면 그걸 사용, 없으면 여기 별도 `PedsBed`.)

## 2. 공용 프리미티브 (sharedEquipment / clinic)
clinicreception · ibed(ward/peds) · imonitor · ireception · ichair · iplant · sinkor · scrubdispenser · gownbox · nursedeski · ivpump · bpcuff · sanitizer.

## 3. 렌더 특이 (z-order / 애니)
- `phototherapy` = **OVERHEAD**(천장 광선치료기, 하향 빔) — surgicallight와 동일 z 처리(engine OVERHEAD set에 추가).
- `balloon`·`rockinghorse` = **bob 애니**(reanimated withRepeat, 인스턴스별 phase). 놀이방 생동감.
- `mural`·`dosingchart` = 벽(비차단). `incubator` 후드는 반투명(fillOpacity).
- v13 접지 그림자 타원은 각 바닥 오브젝트 첫 자식(peds2 소스에 이미 있음 → 그대로 포팅).

## 4. 디자인 SoT 매핑
`interior-objects-peds2.jsx`(임상 10) + `interior-peds.jsx`(놀이 7 + PedsBed) → §1 카탈로그 1:1. footprint는 business-rules §4.
