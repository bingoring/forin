---
artifact: business-rules
build-spec: departments/er
status: IMPLEMENTED
updated: 2026-07-01
---

# Business Rules — 5g-a ER (통행·차단 규칙)

> 무엇이 벽이고 무엇이 통행 가능한가. 엔티티 데이터는 [`domain-entities.md`](domain-entities.md). 규칙은 결정적으로.

## 1. 규칙 표 (통행/차단 불변식)
| ID | 규칙 | 대상 | 위반 시 |
|---|---|---|---|
| R1 | 정적 벽은 통행 불가 | `collision[]` 직사각형 | 이동 차단 |
| R2 | 문/통로는 collision gap | door·threshold 좌표 | 통행 |
| R3 | glass는 정적 벽엔 없지만 objectCollision으로 차단 | `type:'glass'` (props.w/h) | 통행 불가(시야 투과) |
| R4 | 솔리드 오브젝트 footprint는 차단 | OBJECT_FOOTPRINT 등록 타입 | 통행 불가 |
| R5 | door/threshold/tint/icurtain/triageline/nursestation은 objectCollision skip | skip 목록 | 통행(ㄷwell 포함) |
| R6 | region bounds는 divider와 1칸 겹침 | regions[] | 항상 어떤 region으로 판정 |

## 2. collision (벽) — SoT `IWall` 1:1 (통로 = gap)
- **외벽**: 상단 `{0,0,4,1}{8,0,10,1}{22,0,18,1}`(앰뷸 x4-7·정문 x18-21 gap) · 좌우 `{0,1,1,58}{39,1,1,58}` · 하단 `{0,59,18,1}{22,59,12,1}{37,59,3,1}`(캠퍼스 x18-21·제염외부 x34-36 gap).
- **가로 divider**(통로 gap x5-7/x17-20/x31-33): y16 `{1,16,4,1}{8,16,9,1}{21,16,10,1}{34,16,5,1}` · y33·y49 동형.
- **세로 divider**(통로 gap y21-23/y38-40/y53-55): x13 `{13,17,1,4}{13,24,1,9}{13,34,1,4}{13,41,1,8}{13,50,1,3}{13,56,1,3}` · x26 동형.
- **ㄷ 너스스테이션 데스크**: `{14,23,10,2}{14,25,2,4}{22,25,2,4}` — 등판+양팔만 차단, well(x16-21 y25-28)은 통행(직원이 안에 섬).

## 3. threshold·door·glass (개폐/통행)
- **threshold**(통행, 검은 열린 통로): y16 `x5w3→소생실`·`x17w4→스테이션`·`x31w3→내과` / y33 `x5w3→격리`·`x17w4→처치실`·`x31w3→외상` / y49 `x5w3→정신과`·`x17w4→상담실`·`x31w3→제염실` / 세로 x13·x26 각 `y21w1h3`·`y38w1h3`·`y53w1h3` / 음압 전실 `x5 y38 w2 "격리실"`.
- **door**(auto, 통행): 앰뷸 `x4 y0 w4` · 정문 `x18 y0 w4` · 캠퍼스 `x18 y59 w4` · 제염외부 `x34 y59 w3`.
- **glass**(objectCollision **차단**): 약품실 `x19 y18 w1h4` · 음압 전실 `x1 y38 w4`·`x7 y38 w5`.

## 4. tint · triageline (비차단 오버레이/바닥선)
- **tint**: psych `1,50,11,8 #C7D6E8 .32` · quiet `14,50,12,8 #F1DCC0 .4` · decon `27,50,12,8 #BFD8DE .4`.
- **triageline**: 빨 `x6 y13 w1h3` · 노 `x18 y13 w2h3`(정문 통로 중앙) · 초 `x32 y13 w1h3`.

## 5. footprint (솔리드 차단 — `OBJECT_FOOTPRINT` / `objectCollision`)
차단 타입: bed·monitor·reception·vitals·ivpump·dressing·medfridge·scanner·chemdrum·ppestand·wastebin·gurney·defib·compcart·oxygen·suction·wheelchair·watercooler·ekg·sink·scale·boltedbed·ibed·imonitor·iiv·iplant·examstool·instrumenttray·castcart 등.
비차단(미등록): 벽걸이(anatomy·cctv·xrayviewbox·framedpic·walltv) · 바닥선(triageline) · ㄷwell(nursestation) · 커튼(icurtain).

## 6. 엣지케이스
| 케이스 | 조건 | 기대 동작 |
|---|---|---|
| 경계 통로 스폰 | 통로가 방 경계=뷰 가장자리 | 오브젝트 컬링 off로 항상 렌더 |
| playerStart 차단 | ㄷ데스크 안 | well을 skip 처리해 통행(스폰 OK) |
| 방 밖 판정 | divider 위 | region bounds 1칸 겹침으로 흡수(R6) |
