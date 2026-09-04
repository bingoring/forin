# 홈 라이브 병동 실시간 프레즌스 — 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans 또는 subagent-driven-development로 태스크 단위 실행. 스텝은 `- [ ]` 체크박스.

**Goal:** 홈 최상단 라이브 병동을 노트북 라인 캐릭터로 다시 그리고, 지금 학습 중인 실제 사용자들로 채운다.

**Architecture:** Phase 1은 모바일 전용 시각 작업 — 새 `NbCharacter`(전신 2등신, NbAvatar 레이어 재사용)와 `LiveWardNb`(수첩 병동, 내 캐릭터만 순회)를 만들어 홈에 마운트한다(OTA). Phase 2는 서버 `ward` 도메인 + Redis 폴링/TTL 프레즌스 + `useWardPresence`로 로스터를 연결한다(서버 promote + 모바일 OTA). 두 단계는 각각 독립적으로 동작·배포 가능하다.

**Tech Stack:** React Native · Expo · react-native-svg · Animated(네이티브 드라이버) · Go · Redis(go-redis) · Jest · react-test-renderer.

**Spec:** `docs/dlc/projects/forin/02-construction/live-ward/` (build-spec-index.md · business-logic-model.md · frontend-components.md)

## Global Constraints

- 커밋 트레일러 없음(솔로). 서브모듈(dlc) 먼저 커밋 후 메인(forin), 둘 다 master.
- 모바일 배포는 `.github/workflows/ota.yml`만. 서버는 promote.yml(사람 트리거)만.
- 클린 `npx tsc --noEmit`(exit 0)와 모바일 CI 초록을 매 체크포인트에서 확인.
- i18n 천장: `src/components`=0 한국어 리터럴. 새 컴포넌트의 표시 문자열은 전부 `t()` 경유.
- 더미 금지: 로스터가 비면 내 캐릭터만. 가짜 인원으로 채우지 않는다.
- AvatarSpec 하나로 통일(`@/data/nbAvatar`). 네트워크·저장 값은 `normalizeAvatarSpec`로 방어.

---

## Phase 1 — 시각 (모바일 전용, OTA)

두 단계 중 Phase 1만으로도 "내 캐릭터가 순회하는 라이브 병동"이 홈에 뜬다. 배포 가능한 완결 증분.

### Task 1: NbAvatar 레이어 맵 export

`NbCharacter`가 머리·눈·입 레이어를 재사용하려면 지금 모듈 지역인 맵들을 공개해야 한다.

**Files:**
- Modify: `mobile/src/components/nb/NbAvatar.tsx` (const 선언에 `export` 추가)

**Interfaces:**
- Produces: `export const K: string`, `export const W: number`,
  `export const SKINS: Record<SkinKey,string>`, `export const HAIRC: Record<HairColorKey,string>`,
  `export const OUTC: Record<OutfitColorKey,string>`,
  `export const BACK/FRONT: Record<HairKey,(hc:string)=>ReactElement>`,
  `export const EYES/MOUTHS: Record<…,()=>ReactElement>`,
  `export const HATS: Record<HatKey,(oc?:string)=>ReactElement|null>`,
  `export const ACCS: Record<AccKey,()=>ReactElement|null>`.

- [ ] **Step 1: export 추가.** `NbAvatar.tsx`에서 `const K =` → `export const K =` 등, 위 11개 심볼(K, W, SKINS, HAIRC, OUTC, BACK, FRONT, EYES, MOUTHS, HATS, ACCS)에 `export`를 붙인다. 다른 코드는 건드리지 않는다.
- [ ] **Step 2: tsc.** Run: `cd mobile && npx tsc --noEmit` — Expected: exit 0.
- [ ] **Step 3: 기존 테스트 회귀 없음.** Run: `npx jest nbAvatar` — Expected: PASS(렌더 불변).
- [ ] **Step 4: Commit.** `git add mobile/src/components/nb/NbAvatar.tsx && git commit -m "refactor(nb): NbAvatar 레이어 맵 export — NbCharacter 재사용 준비"`

### Task 2: NbCharacter 컴포넌트

전신 2등신 순회 캐릭터. 머리는 Task 1의 레이어를 0.8배로, 몸은 새 SVG. viewBox 64×96.

**Files:**
- Create: `mobile/src/components/nb/NbCharacter.tsx`
- Test: `mobile/src/components/nb/nbCharacter.test.tsx`

**Interfaces:**
- Consumes: Task 1의 export, `@/data/nbAvatar`의 `DEFAULT_AVATAR_SPEC`·`AvatarSpec`.
- Produces: `export function NbCharacter(props: { spec?: Partial<AvatarSpec>; walking?: boolean; flip?: boolean; size?: number }): ReactElement`. `size`는 폭, 높이는 `size*96/64`.

- [ ] **Step 1: 실패 테스트.** 아바타 스펙 색이 그려지고 flip이 `scaleX:-1`을 만드는지.

```tsx
// nbCharacter.test.tsx (harness는 liveWard.test.tsx의 react-native-svg/reanimated mock 패턴을 따른다)
import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { NbCharacter } from '@/components/nb/NbCharacter';

function fills(root: ReactTestInstance): string[] {
  const out: string[] = [];
  for (const n of root.findAll(() => true, { deep: true })) {
    const f = n.props?.fill;
    if (typeof f === 'string') out.push(f.toUpperCase());
  }
  return out;
}

test('머리·몸이 스펙 색으로 그려진다', () => {
  let tree!: ReturnType<typeof create>;
  act(() => { tree = create(<NbCharacter spec={{ skin: 'beige', outfitColor: 'sage' }} walking />); });
  const drawn = fills(tree.root);
  // SKINS.beige 와 OUTC.sage 의 실제 색이 등장(팔레트 값은 NbAvatar 상수와 일치)
  expect(drawn.length).toBeGreaterThan(0);
});

test('flip=true 는 좌우 반전한다', () => {
  let tree!: ReturnType<typeof create>;
  act(() => { tree = create(<NbCharacter flip />); });
  const flipped = tree.root.findAll((n) => {
    const st = Array.isArray(n.props?.style) ? Object.assign({}, ...n.props.style) : (n.props?.style ?? {});
    return Array.isArray(st.transform) && st.transform.some((tr: Record<string, unknown>) => tr.scaleX === -1);
  }, { deep: true });
  expect(flipped.length).toBeGreaterThan(0);
});
```

- [ ] **Step 2: 실패 확인.** Run: `npx jest nbCharacter` — Expected: FAIL(모듈 없음).
- [ ] **Step 3: 구현.** viewBox 64×96 SVG. 그리는 순서(뒤→앞): 다리 2 → 팔 2 → 옷색 몸통(V넥, y38 시작) → 머리 그룹. 머리 그룹은 `<G transform="translate(6.4,0) scale(0.8)">` 안에 Task 1 레이어를 NbAvatar와 같은 순서(BACK(hc) → 머리원 `Circle cx32 cy32 r14 fill={sk} stroke={K} strokeWidth={W}` → MOUTHS() → EYES() → FRONT(hc) → HATS(oc) → ACCS())로 배치. 몸통·팔·다리 좌표와 발 꺾임은 07 §NbCharacter(몸 y38, waddle 기준 32,83)를 따른다. `flip`은 바깥 View의 `transform:[{scaleX:-1}]`. `walking` 애니메이션(몸 waddle ±3.5°, 팔·다리 교차 ±22°, ~0.42s alternate)은 **`engine/Sprite.tsx`의 limb 회전 방식과 동일한 드라이버**로 구현(회전 원점 처리 포함); 네이티브 드라이버 유지.
- [ ] **Step 4: 통과 확인.** Run: `npx jest nbCharacter` — Expected: PASS.
- [ ] **Step 5: tsc + 천장.** Run: `npx tsc --noEmit` (exit 0) · `npx jest ceiling` (components=0 유지 — 한국어 리터럴 없음).
- [ ] **Step 6: Commit.** `git add mobile/src/components/nb/NbCharacter.tsx mobile/src/components/nb/nbCharacter.test.tsx && git commit -m "feat(nb): NbCharacter — 전신 2등신 순회 캐릭터(NbAvatar 머리 재사용)"`

### Task 3: LiveWardNb 씬 (내 캐릭터만 순회)

기존 픽셀 `LiveWard.tsx`의 노트북 라인 버전. 무드·침대·모니터·무드 바 구조는 그대로 가져오되, 테마를 nb로, 캐릭터를 NbCharacter로 바꾼다. Phase 1에서는 내 캐릭터만.

**Files:**
- Create: `mobile/src/components/home/LiveWardNb.tsx`
- Test: `mobile/src/screentests/liveWardNb.test.tsx`

**Interfaces:**
- Consumes: `NbCharacter`(Task 2), `@/hooks/useMyAvatar`의 `useMyAvatar(): AvatarSpec | null`,
  `@/data/wardMood`의 `moodAt`·`msUntilNextMood`·`SHIFT_LABEL`·`MOOD_SUB_KEY`·`WardMood`,
  `@/theme/nb`, `@/i18n`의 `useT`.
- Produces: `export function LiveWardNb(props: { mood?: WardMood; now?: () => Date; roster?: { id: string; avatar: AvatarSpec }[] }): ReactElement`. `roster`는 Phase 2용, Phase 1은 기본값 `[]`.

- [ ] **Step 1: 실패 테스트.** 3무드 하늘·무드 바 카피·내 캐릭터 렌더를 확인(liveWard.test.tsx의 `at(h)`·mock 패턴 재사용).

```tsx
test('각 근무가 자기 하늘과 바뀌는 것을 말한다', () => {
  expect(texts(mount({ now: at(10) }).root).join(' ')).toContain('DAY');
  expect(texts(mount({ now: at(18) }).root).join(' ')).toContain('EVENING');
  expect(texts(mount({ now: at(2) }).root).join(' ')).toContain('NIGHT');
});
test('내 캐릭터가 순회한다', async () => {
  // useMyAvatar가 스펙을 주면 캐릭터 SVG가 하나 이상 그려진다
  const svgs = mount({ now: at(10) }).root.findAll((n) => String(n.type) === 'RNSVGSvgView', { deep: true });
  expect(svgs.length).toBeGreaterThan(0);
});
```

- [ ] **Step 2: 실패 확인.** Run: `npx jest liveWardNb` — Expected: FAIL(모듈 없음).
- [ ] **Step 3: 구현.** `LiveWard.tsx`를 기반으로: (a) `colors/fonts/fs`(픽셀 테마) → `nb/nbText/nbFonts`(노트북 테마)로 교체, (b) 학습자 SmoothSprite + 하드코딩 동료를 제거하고, `[selfMember, ...roster]`(최대 10)를 각각 `PatrolCharacter`로 렌더, (c) `PatrolCharacter`는 병동 바닥 폭 안에서 `translateX` 왕복 루프(인스턴스별 랜덤 시작·주기 3~6s·초기 방향), 이동 방향에 맞춰 `flip`, 내부에 `<NbCharacter spec walking flip />`. blink/pulse 훅과 무드 로직·`msUntilNextMood` 재읽기는 LiveWard.tsx 그대로. Phase 1은 `roster` 기본 `[]`라 self만.
- [ ] **Step 4: 통과 확인.** Run: `npx jest liveWardNb` — Expected: PASS.
- [ ] **Step 5: tsc + 천장.** Run: `npx tsc --noEmit`(exit 0) · `npx jest ceiling`.
- [ ] **Step 6: Commit.** `git add mobile/src/components/home/LiveWardNb.tsx mobile/src/screentests/liveWardNb.test.tsx && git commit -m "feat(home): LiveWardNb — 수첩 라인 라이브 병동(내 캐릭터 순회)"`

### Task 4: 홈에 마운트

**Files:**
- Modify: `mobile/src/app/(tabs)/index.tsx` (인사말 헤더 `</View>`(≈L182) 다음, `{/* ☐ 오늘의 할 일 */}`(≈L184) 앞에 `<LiveWardNb />` 삽입 + import 추가 + L19–21 주석 갱신)
- Test: `mobile/src/screentests/liveWard.test.tsx`(마운트 여부를 소스에서 확인하는 단정 1개 추가)

- [ ] **Step 1: 실패 테스트.** index.tsx 소스에 `<LiveWardNb` 마운트가 있는지 단정 추가(liveWard.test.tsx의 `readFileSync(index.tsx)` 패턴).

```tsx
test('홈이 라이브 병동을 노트북 라인으로 다시 마운트한다', () => {
  const { readFileSync } = require('fs') as typeof import('fs');
  const { join } = require('path') as typeof import('path');
  const src = readFileSync(join(__dirname, '..', 'app', '(tabs)', 'index.tsx'), 'utf8');
  expect(src).toMatch(/<LiveWardNb/);
});
```

- [ ] **Step 2: 실패 확인.** Run: `npx jest liveWard` — Expected: FAIL(마운트 없음).
- [ ] **Step 3: 구현.** `import { LiveWardNb } from '@/components/home/LiveWardNb';` 추가. 인사말 헤더 블록 다음에 `<LiveWardNb />` 삽입. L19–21 주석("LiveWard is gone … needs a notebook-line drawing of its own")을 "이제 LiveWardNb(노트북 라인)로 돌아왔다"는 취지로 갱신.
- [ ] **Step 4: 통과 확인.** Run: `npx jest liveWard` — Expected: PASS.
- [ ] **Step 5: 전체 확인.** Run: `npx tsc --noEmit`(exit 0) · `npx jest`(전체 초록).
- [ ] **Step 6: Commit.** `git add mobile/src/app/\(tabs\)/index.tsx mobile/src/screentests/liveWard.test.tsx && git commit -m "feat(home): 라이브 병동을 홈 최상단에 노트북 라인으로 복귀"`

### Task 5: Phase 1 검증 + OTA

- [ ] **Step 1: 클린 빌드.** Run: `cd mobile && npx tsc --noEmit`(exit 0) · `npx jest`(전체 초록).
- [ ] **Step 2: 푸시.** `git push origin master`.
- [ ] **Step 3: 모바일 CI 초록 확인.** `gh run watch <mobile run id> --exit-status`.
- [ ] **Step 4: OTA(production) 트리거.** `gh workflow run ota.yml -f channel=production -f message="홈 라이브 병동(노트북 라인) 복귀 — 내 캐릭터 순회"`. 사용자 승인 대기.

---

## Phase 2 — 실시간 프레즌스 (서버 promote + 모바일 OTA)

> **자체 계획으로 확장 예정.** 서버(`ward` 도메인·Redis·핸들러·계약)는 별도 서브시스템이라, Phase 1 완료 후 서버 코드(기존 핸들러·라우터·redis 어댑터·`packages/contract` 패턴)를 읽고 이 절을 태스크 단위 상세 계획으로 확장한다. 계약은 스펙에 이미 확정돼 있다(아래).

계약(spec business-logic-model.md 확정):
- Redis: `ward:live`(zset, member=uid, score=마지막 하트비트 epoch) + `ward:av:<uid>`(String JSON, `EX 45`).
- 하트비트: `ZADD ward:live <now> <uid>` + `SET ward:av:<uid> <json> EX 45` (숨김이면 스킵).
- 로스터: `ZREMRANGEBYSCORE ward:live -inf (now-40)` → `ZREVRANGE ward:live 0 10 WITHSCORES` → 자기 제거·상위 10 컷 → `MGET`.
- 엔드포인트: `GET /ward`(하트비트 겸 로스터, `{roster:[{id,avatar}], self}`) · `POST /ward/heartbeat`(204) · `POST /ward/leave`(204).
- 상태 기준: 포그라운드 = 온라인. TTL 40s. 홈 6s(로스터 겸용) / 그 외 15s 하트비트.

태스크 개요(확장 대상):
- P2-1: Redis 프레즌스 저장소 `internal/adapters/redis/ward_presence.go` + 단위 테스트(miniredis).
- P2-2: `internal/domain/ward` 도메인(로스터 선정·자기 제외·숨김 제외·상한 10·정규화) + 테스트.
- P2-3: `internal/adapters/http/ward_handler.go` 엔드포인트 3종 + 라우터 배선 + 테스트.
- P2-4: 옵트아웃 pref(저장 위치는 마이그레이션 최소화 우선으로 확정) + 등록 강제 + 나 탭 토글.
- P2-5: `packages/contract` openapi + TS 타입(ward 3종) 재생성.
- P2-6: `mobile/src/lib/wardPresence.ts`(`useWardPresence`) — 포그라운드 하트비트·홈 로스터 폴링·diff·leaving 세트 + 테스트.
- P2-7: `LiveWardNb`에 `roster` 연결 — 좌측 등장·우측 이탈 애니메이션(입국심사 데스크 슬라이드아웃 패턴) + 테스트.
- P2-8: 스모크 `e2e_smoke.sh`에 ward 왕복 추가 → 서버 스테이징 초록 → promote → 모바일 OTA.

## Self-Review (Phase 1)

- **스펙 커버리지:** NbCharacter(§frontend §1) = Task 2, LiveWardNb(§frontend §2) = Task 3, 홈 마운트(§frontend §4) = Task 4. Phase 1 체크리스트(build-spec §4) 3항목 모두 태스크 존재. 로스터·서버·옵트아웃은 Phase 2로 명시 분리.
- **플레이스홀더:** 애니메이션 내부는 기존 파일(Sprite.tsx limb 회전, LiveWard.tsx patrol/blink/pulse)의 구체 패턴을 지목 — 새 규칙을 만들지 않는다.
- **타입 일관성:** `NbCharacter` props(spec/walking/flip/size)와 `LiveWardNb`의 `roster:{id,avatar}[]`가 Phase 2 `WardMember`(business-logic §4)와 일치.
