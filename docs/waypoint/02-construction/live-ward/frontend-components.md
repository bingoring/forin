# 프론트 컴포넌트 — NbCharacter · LiveWardNb · useWardPresence

## 1. `NbCharacter` (신규 · `src/components/nb/NbCharacter.tsx`)

전신 2등신 순회 캐릭터. 07 §NbCharacter 스펙.

- **머리**: `NbAvatar`의 FRONT 머리·눈·입 레이어를 0.8배로 재사용. props로 `skin` · `hair` ·
  `hairColor` · `eyes` · `mouth` · `outfitColor`를 공유(즉 AvatarSpec 호환).
- **몸**: 2등신. 옷색 몸통(V넥 선, y38에서 시작해 머리와 살짝 겹침) + 짧은 팔 2(끝에 살색 손) +
  짧은 다리 2(발 꺾임). viewBox 64×96, waddle 기준점 (32, 83).
- **걷기(`walking=true`)**: 아장아장. 몸 전체 waddle(±3.5°, 발끝 기준) + 팔·다리 교차 스윙
  (±22°, 약 0.42s alternate). RN `Animated`/reanimated 루프(네이티브 드라이버).
- **방향(`flip=true`)**: 좌우 반전.
- **props**: `{ spec: AvatarSpec, walking?: boolean, flip?: boolean, size?: number }`.
- 한국어 리터럴 0(순수 SVG·애니메이션). 천장 테스트 대상.

기존 픽셀 `SmoothSprite`와는 별개다. `SmoothSprite`는 픽셀 라인·타일맵용이고, NbCharacter는
수첩 라인·홈 병동용이다. 아바타 데이터는 `AvatarSpec`(nbAvatar.ts) 하나로 공유한다.

## 2. `LiveWardNb` (신규 · `src/components/home/LiveWardNb.tsx`)

수첩 낙서체 라이브 병동 씬. 기존 픽셀 `LiveWard.tsx`(고아 상태)를 대체하는 노트북 라인 버전.

- **무드**: `data/wardMood.ts`의 `moodAt()`로 기기 시간에서 DAY/EVENING/NIGHT 3무드. 하늘·오브젝트
  팔레트가 무드별로 바뀌고, 하단 **무드 바**가 시간대별 시나리오 출현 확률 변화를 한 줄로 설명
  (회진/SBAR/야간 호출). 카피는 i18n 키.
- **정적 배경**: 침대 3, 창문, 바이탈 모니터(파형 펄스 애니메이션), NIGHT엔 별 깜빡임 + 어둠 워시.
- **순회 호스트**: 내 캐릭터(항상) + 로스터(최대 9인) = 최대 10 NbCharacter가 좌우로 순회.
- 한국어 리터럴은 무드 바 카피뿐이며 전부 i18n 경유(천장 0 유지).

### 순회·등장·이탈 애니메이션

- **순회**: 각 캐릭터는 병동 바닥 폭 안에서 `translateX` 왕복 루프. 인스턴스별로 **랜덤**하게
  desync — 시작 x·초기 방향·주기(예: 3~6s)를 달리한다. 이동 방향에 맞춰 `flip`.
- **등장(접속)**: 새 uid는 x = -charWidth(좌측 밖)에서 시작해 병동 안 임의 지점으로 들어온 뒤
  순회 루프에 합류.
- **이탈(종료)**: 로스터에서 사라진 uid는 x = wardWidth + charWidth(우측 밖)로 빠져나간 뒤
  언마운트. 애니메이션이 끝날 때까지 노드를 유지해야 하므로 **leaving 세트**로 관리한다
  (입국심사 데스크 슬라이드아웃과 같은 패턴).
- **내 캐릭터**: 항상 렌더, 등장·이탈 없음. `useAvatar()` 대신 AvatarSpec 정본을 쓰되, 기존
  `useAvatar` 훅과의 호환은 구현 시 확인.
- **정체성 안정**: 순회 중 색·머리가 프레임마다 흔들리지 않도록 아바타 스펙을 uid로 고정
  (06 §"Stable identity while moving"의 seed 원칙과 동일).

## 3. `useWardPresence` (신규 · `src/lib/wardPresence.ts`)

프레즌스의 클라이언트 오케스트레이션. 스토어 + 훅.

- **하트비트 루프**: `AppState`가 `active`이고 인증됐고 옵트아웃이 아니면, 홈 포커스 시
  `GET /ward`(6s), 그 외 화면에선 `POST /ward/heartbeat`(15s)를 돌린다. `background`/`inactive`
  진입 시 정지하고 `POST /ward/leave`를 best-effort로 1회 보낸다.
- **로스터 폴링**: 홈 포커스 동안 `GET /ward` 응답의 `roster`를 스토어에 반영.
- **diff**: 이전 로스터 id 집합과 비교해 추가분은 등장 큐, 삭제분은 leaving 세트로 옮긴다.
  LiveWardNb는 이 스토어를 구독해 캐릭터를 마운트·언마운트한다.
- **저하**: 폴링 실패 시 마지막 로스터를 유지하고 다음 틱에 재시도. Redis 불가로 빈 로스터가
  와도 내 캐릭터는 항상 보인다.
- **홈 외 화면**: 로스터를 구독·렌더하지 않는다(병동이 안 보이므로). 하트비트만 지속.

## 4. 홈 마운트 (`src/app/(tabs)/index.tsx`)

`LiveWardNb`를 홈 최상단 모듈로 올린다(HomeV2 모듈 순서: 라이브 병동 → 오늘의 호출 → 오늘의
할 일 → …). 기존 주석("LiveWard is gone … a sprite on a paper page is the one thing 07
forbids")은 NbCharacter로 해결됐으므로 갱신한다. 나머지 모듈은 그대로 둔다.

## 5. API 클라이언트 (`src/api/client.ts`)

- `ward()` → `GET /ward` → `{ roster: WardMember[]; self?: AvatarSpec }`.
- `wardHeartbeat()` → `POST /ward/heartbeat` → 204.
- `wardLeave()` → `POST /ward/leave` → 204(best-effort).
- `WardMember = { id: string; avatar: AvatarSpec }`. 계약(openapi + TS) 갱신.
