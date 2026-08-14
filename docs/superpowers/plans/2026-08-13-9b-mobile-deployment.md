# 9-B 모바일 배포 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 모바일 검증을 CI 게이트로 올리고, 빌드가 어느 환경을 가리키는지 명시적으로 만들고, OTA를 fingerprint 정책으로 안전하게 배선한다. 완료 판정 = **`mobile.yml`이 green** + **`eas config`가 프로필별로 올바른 API URL·채널·식별자를 해석** + **`eas fingerprint:generate`가 네이티브 소스에서 지문 해시를 계산**.

**Architecture:** 9-A가 서버 쪽에서 확립한 원칙을 모바일에 그대로 적용한다 — 조용한 폴백을 없애고(값이 없으면 로컬을 때리는 대신 빌드가 무엇을 가리키는지 파일에 적힌다), 위험한 경로에는 사람의 손이 필요하게 만든다(OTA는 스토어 심사를 우회하므로 prod 승격과 같은 수동 게이트). 네이티브 지문이 바뀌면 OTA가 자동 무효화되므로 구버전 바이너리에 맞지 않는 JS가 밀려들 수 없다.

**Tech Stack:** React Native + Expo SDK 56 · expo-router · TypeScript 6 · jest-expo (38 suites / 213 tests) · EAS CLI 21.8.0 · GitHub Actions

**스펙:** `docs/dlc/projects/forin/03-operations/01-deployment.md` §6·§6.1 — 정본이다. 9-A의 실측 기록은 §11.1·§11.2.

## Global Constraints

- 작업 디렉토리: `mobile/`. 패키지 매니저는 **npm**(`package-lock.json`) — CI는 `npm ci`
- 기준선(실측 2026-08-13): `npx tsc --noEmit` 출력 없음 · `npm test` **38 suites / 213 tests 통과**. 깨뜨리지 않는다
- **EAS 프로젝트는 이미 있다**: `app.json`의 `extra.eas.projectId = 78c4eab3-2e5c-4bf7-a411-127754f91079`. 새로 만들지 않는다
- **실 서버 URL**(9-A에서 배포·검증 완료, 양쪽 모두 콘텐츠 시드됨):
  - staging `https://forin-api-staging-5fqcohcf3q-du.a.run.app`
  - prod `https://forin-api-prod-5fqcohcf3q-du.a.run.app`
- 앱 식별자 `app.forin.mobile` (iOS `bundleIdentifier` / Android `package`) — 변경 금지
- 커밋 메시지는 conventional-commit 한 줄 + 한국어 본문. **`Co-Authored-By` 등 공동작업 트레일러 금지**, AI 서명 금지
- 브랜치는 `master`, 체크포인트마다 커밋 + 즉시 push. 문서(`docs/dlc`)는 **서브모듈 먼저 커밋·push → 메인에서 포인터 갱신**
- **실제 빌드·제출은 이 계획의 범위가 아니다**: Apple Developer 멤버십이 없고(iOS 제출 불가), Play 개발자 계정은 신원확인 중이다. 배선과 설정 해석까지가 범위이고, 실행은 자격증명이 준비된 뒤 별도로 한다

---

### Task 1: `mobile.yml` — tsc·jest를 CI 게이트로

**Files:**
- Create: `.github/workflows/mobile.yml`

**Interfaces:**
- Consumes: `mobile/package.json`(스크립트 `test`), `mobile/tsconfig.json`(`@contract/*` 경로 매핑)
- Produces: `mobile` 워크플로 — master push + PR에서 `mobile/**`·`packages/contract/**` 변경 시 tsc·jest 실행

> **왜 경로 필터에 `packages/contract/**`가 들어가는가**: `mobile/src/api/client.ts`가 `@contract/types`를 import한다(`tsconfig.json`의 `@contract/*` 매핑). 계약을 재생성하면 모바일 타입이 깨질 수 있으므로, 계약만 바뀐 푸시에서도 모바일 tsc가 돌아야 한다. `mobile/**`만 걸면 그 경로를 놓친다.
>
> **왜 지금 만드는가**: 9-A 착수 전 감사에서 확인된 그대로 **모바일 검증이 CI에 하나도 없다**. jest 213개가 로컬에서만 돌고 있고, 로컬에서만 도는 검증은 "누가 잊었는가"에 달려 있다.

- [ ] **Step 1: 기존 워크플로의 관례를 읽는다**

Run: `cat .github/workflows/server.yml`
확인할 것: `on.push.branches`·`paths` 형태 · `actions/checkout@v4` · setup 액션의 버전 핀 · `defaults.run.working-directory` 사용 여부 · `permissions` 명시 여부. **아래 워크플로는 그 관례를 따라야 한다** — 이 리포는 워크플로 3개가 이미 같은 규칙을 공유한다(9-A에서 리뷰가 그것을 강제했다).

- [ ] **Step 2: 워크플로 작성**

Create `.github/workflows/mobile.yml`:

```yaml
name: mobile

# The mobile side had no CI at all until now: tsc and 213 jest tests ran only on
# whoever remembered to run them. `packages/contract/**` is in the path filter
# because src/api/client.ts imports @contract/types — regenerating the contract
# can break mobile types, and a contract-only push must still be type-checked.
on:
  push:
    branches: [master]
    paths:
      - 'mobile/**'
      - 'packages/contract/**'
      - '.github/workflows/mobile.yml'
  pull_request:
    paths:
      - 'mobile/**'
      - 'packages/contract/**'
      - '.github/workflows/mobile.yml'

jobs:
  check:
    runs-on: ubuntu-latest
    permissions:
      contents: read
    defaults:
      run:
        working-directory: mobile
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: npm
          cache-dependency-path: mobile/package-lock.json

      # `npm ci` (not install): the lockfile is the contract, and a CI run that
      # silently resolves different versions than the developer had is not a gate.
      - run: npm ci

      - name: Type-check
        run: npx tsc --noEmit

      - name: Test
        run: npm test
```

- [ ] **Step 3: YAML 파싱 확인**

Run:
```bash
cd /Users/ywyeom/private/forin
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/mobile.yml')); print('yaml ok')"
```
Expected: `yaml ok`

- [ ] **Step 4: 로컬에서 CI가 돌릴 것과 같은 명령을 확인**

Run:
```bash
cd /Users/ywyeom/private/forin/mobile
npx tsc --noEmit; echo "tsc exit=$?"
npm test 2>&1 | tail -5
```
Expected: `tsc exit=0`(출력 없음) · `38 passed, 38 total` / `213 passed, 213 total`

- [ ] **Step 5: 커밋·푸시**

```bash
cd /Users/ywyeom/private/forin
git add .github/workflows/mobile.yml
git commit -m "$(cat <<'EOF'
feat(ci): 모바일 tsc·jest를 CI 게이트로

착수 전 감사에서 확인된 그대로 모바일 검증이 CI에 하나도 없었다 — jest 213개가
로컬에서만 돌았고, 로컬에서만 도는 검증은 "누가 잊었는가"에 달려 있다.

경로 필터에 packages/contract/**를 넣었다: src/api/client.ts가 @contract/types를
import하므로 계약 재생성이 모바일 타입을 깨는 경로가 있고, mobile/** 만 걸면
그 푸시를 놓친다.

npm ci를 쓴다(install 아님) — 락파일이 계약이고, 개발자와 다른 버전을 조용히
해석하는 CI 실행은 게이트가 아니다.

검증: yaml 파싱 · 로컬에서 tsc 0 · jest 38 suites/213 tests
EOF
)"
git push origin master
```

- [ ] **Step 6: CI가 실제로 green인지 확인 (이 태스크의 완료 판정)**

Run:
```bash
sleep 20
gh run list --workflow=mobile.yml --limit 1 --json status,conclusion,headSha \
  --template '{{range .}}{{.status}} / {{.conclusion}} ({{slice .headSha 0 7}}){{end}}'
```
`in_progress`면 `gh run watch <id> --exit-status`로 기다린다.
Expected: `completed / success`. 실패하면 `gh run view <id> --log-failed`로 원인을 보고, **로컬과 CI가 갈리는 지점**(노드 버전·락파일·환경변수 부재)을 좁힌다.

---

### Task 2: `eas.json` — 프로필별 환경 분리와 공개 식별자 주입

**Files:**
- Modify: `mobile/eas.json`

**Interfaces:**
- Consumes: 9-A가 배포한 실 URL 2개
- Produces: `preview` 프로필 → staging API + 채널 `preview` / `production` 프로필 → prod API + 채널 `production`. 두 프로필 모두 소셜 로그인 식별자를 명시적으로 받는다

> **이 태스크가 막는 두 개의 조용한 실패**
>
> ① `mobile/src/api/client.ts:10`이 `process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080'`이다. 프로필에 값이 없으면 **빌드된 앱이 localhost를 때린다** — 개발자 기기에서는 서버가 떠 있어 동작하는 것처럼 보이고, 테스터 기기에서는 전면 실패한다.
>
> ② `mobile/.env`가 **gitignore돼 있다**(`mobile/.gitignore:35`). `src/lib/auth.ts`가 `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID` 등을 읽고 없으면 `''`로 폴백하는데, EAS 빌드는 그 파일을 받지 못하므로 **빌드된 앱에서 소셜 로그인이 전부 실패한다.** 로컬 `expo start`는 `.env`를 읽어 잘 되므로 ①과 똑같이 "로컬에서만 되는" 함정이다.
>
> **왜 `eas.json`에 커밋해도 되는가**: 스펙 §0이 이미 판정했다 — 소셜 클라이언트 ID는 **공개 식별자이며 앱 바이너리에도 들어 있다**. 공개 식별자를 숨기는 것은 보안이 아니라 "빌드가 무엇을 받는지 리포만 봐서는 알 수 없음"일 뿐이다. 진짜 시크릿(LLM·Azure 키·JWT 서명 키)은 여기 오지 않는다 — 그것들은 서버의 Secret Manager에 있다.

- [ ] **Step 1: 현재 `.env`의 식별자 값을 읽는다 (값을 출력하지 않는다)**

Run:
```bash
cd /Users/ywyeom/private/forin/mobile
python3 - <<'PY'
def envmap(p):
    m={}
    for ln in open(p):
        ln=ln.strip()
        if not ln or ln.startswith('#') or '=' not in ln: continue
        k,v=ln.split('=',1); m[k.strip()]=v.strip().strip('"').strip("'")
    return m
m=envmap('.env')
for k in ['EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID','EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID',
          'EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID','EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY']:
    v=m.get(k,'')
    print(f"{k}: {'채워짐 ('+str(len(v))+'자)' if v else '비어있음'}")
PY
```
Expected: iOS·Android·Kakao는 채워짐, **Web은 비어있음**(네이티브 플로우가 Web ID를 쓰지 않는다 — 2026-08-13 확인). 비어 있는 키는 `eas.json`에 **넣지 않는다**. 빈 문자열을 넣으면 "설정했는데 동작 안 함"이 되어 진단이 어려워진다.

- [ ] **Step 2: `eas.json` 교체**

`mobile/eas.json`을 다음으로 바꾼다. **`<...>` 자리에는 Step 1에서 읽은 실제 값**을 넣는다(공개 식별자이므로 커밋한다):

```json
{
  "cli": {
    "version": ">= 21.6.0",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "preview": {
      "distribution": "internal",
      "channel": "preview",
      "android": {
        "buildType": "apk"
      },
      "env": {
        "EXPO_PUBLIC_API_URL": "https://forin-api-staging-5fqcohcf3q-du.a.run.app",
        "EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID": "<iOS client id>",
        "EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID": "<Android client id>",
        "EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY": "<Kakao native app key>"
      }
    },
    "production": {
      "autoIncrement": true,
      "channel": "production",
      "env": {
        "EXPO_PUBLIC_API_URL": "https://forin-api-prod-5fqcohcf3q-du.a.run.app",
        "EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID": "<iOS client id>",
        "EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID": "<Android client id>",
        "EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY": "<Kakao native app key>"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

`development` 프로필에는 **일부러 `env`를 두지 않는다** — 로컬 개발은 `mobile/.env`를 읽고, 그것이 개발자가 값을 바꿔볼 수 있는 유일한 자리다.

- [ ] **Step 3: JSON 파싱 + 값이 실제로 들어갔는지 확인**

Run:
```bash
cd /Users/ywyeom/private/forin/mobile
python3 - <<'PY'
import json
d=json.load(open('eas.json'))
for p in ['preview','production']:
    b=d['build'][p]
    env=b.get('env',{})
    print(f"[{p}] channel={b.get('channel')}")
    for k,v in env.items():
        assert v and not v.startswith('<'), f"{p}.{k} 자리표시자가 남아 있다"
        print(f"   {k}: 채워짐 ({len(v)}자)")
print("development에 env 없음:", 'env' not in d['build']['development'])
PY
```
Expected: 두 프로필 모두 `channel`과 4개 env가 채워짐, 자리표시자 없음, `development`에 `env` 없음

- [ ] **Step 4: EAS가 프로필을 실제로 그렇게 해석하는지 확인 (이 태스크의 완료 판정)**

Run:
```bash
cd /Users/ywyeom/private/forin/mobile
npx eas-cli@21.8.0 config --profile preview --platform android 2>&1 | grep -iE "EXPO_PUBLIC_API_URL|channel" | head -5
npx eas-cli@21.8.0 config --profile production --platform android 2>&1 | grep -iE "EXPO_PUBLIC_API_URL|channel" | head -5
```
Expected: `preview`가 **staging** URL과 채널 `preview`, `production`이 **prod** URL과 채널 `production`을 보인다.
`eas config`의 출력 형태가 달라 grep이 비면 `--json`을 붙여 파싱하고, **어떤 형태로 확인했는지 보고서에 적어라**. 확인하지 못했으면 통과로 적지 마라.

- [ ] **Step 5: 커밋·푸시**

```bash
cd /Users/ywyeom/private/forin
git add mobile/eas.json
git commit -m "$(cat <<'EOF'
feat(mobile): EAS 프로필별 환경 분리 — 조용한 폴백 두 개를 막는다

① client.ts가 EXPO_PUBLIC_API_URL ?? 'http://localhost:8080' 이라, 프로필에
값이 없으면 빌드된 앱이 localhost를 때린다. 개발자 기기에서는 서버가 떠 있어
동작하는 것처럼 보이고 테스터 기기에서는 전면 실패한다.

② mobile/.env가 gitignore돼 EAS 빌드에 전달되지 않는다. auth.ts가 소셜
클라이언트 ID를 읽고 없으면 ''로 폴백하므로 빌드된 앱의 로그인이 전부
실패하는데, 로컬 expo start는 .env를 읽어 잘 된다 — ①과 같은 부류의 함정.

소셜 클라이언트 ID를 eas.json에 커밋한다: 스펙 §0이 이미 공개 식별자로
판정했고(앱 바이너리에도 들어 있다), 숨기는 것은 보안이 아니라 "빌드가 무엇을
받는지 리포만 봐서는 알 수 없음"일 뿐이다. 진짜 시크릿은 서버 Secret Manager에
있고 여기 오지 않는다.

값이 빈 Web 클라이언트 ID는 넣지 않았다 — 빈 문자열은 "설정했는데 동작 안 함"이
되어 진단을 어렵게 만든다. 네이티브 플로우는 Web ID를 쓰지 않는다.

development 프로필에는 일부러 env를 두지 않는다(로컬은 .env가 유일한 자리).

검증: JSON 파싱 · 자리표시자 없음 · eas config가 프로필별로 올바른 URL·채널 해석
EOF
)"
git push origin master
```

---

### Task 3: `expo-updates` + fingerprint runtimeVersion

**Files:**
- Modify: `mobile/package.json`, `mobile/package-lock.json` (expo-updates 추가)
- Modify: `mobile/app.json` (`updates`·`runtimeVersion`)

**Interfaces:**
- Consumes: `app.json`의 `extra.eas.projectId` = `78c4eab3-2e5c-4bf7-a411-127754f91079`
- Produces: `updates.url` = `https://u.expo.dev/78c4eab3-2e5c-4bf7-a411-127754f91079` · `runtimeVersion = { "policy": "fingerprint" }`

> **왜 `fingerprint`이고 `appVersion`이 아닌가**(스펙 §6): 이 앱은 카카오 SDK·애플 인증·expo-audio 같은 **네이티브 모듈**을 쓴다. `appVersion` 정책은 앱 버전만 같으면 OTA를 받아들이므로, **네이티브 의존이 바뀐 JS를 구버전 바이너리에 밀어넣을 수 있다** — 그 조합은 런타임에 깨지고, 사용자는 앱이 이유 없이 죽는 것을 본다. `fingerprint`는 네이티브 지문이 바뀌면 런타임 버전이 달라져 **OTA가 자동으로 무효화**된다. 그래서 "JS만 고쳤을 때만 OTA, 네이티브가 바뀌면 새 빌드"라는 정책이 사람의 기억이 아니라 도구로 강제된다.

- [ ] **Step 1: `expo-updates` 설치**

Run:
```bash
cd /Users/ywyeom/private/forin/mobile
npx expo install expo-updates
```
Expected: `package.json`의 `dependencies`에 `expo-updates`가 추가된다(`expo install`이 SDK 56에 맞는 버전을 고른다 — `npm install`로 최신을 끌어오지 마라).

- [ ] **Step 2: 설치 확인**

Run:
```bash
cd /Users/ywyeom/private/forin/mobile
python3 -c "
import json;d=json.load(open('package.json'))
v=d['dependencies'].get('expo-updates');print('expo-updates:', v or '설치 안 됨')"
```
Expected: 버전 문자열이 출력된다

- [ ] **Step 3: `app.json`에 `updates`·`runtimeVersion` 추가**

`mobile/app.json`의 `expo` 객체에 다음 두 키를 추가한다. `"version": "1.0.0"` 바로 뒤가 자연스럽다:

```json
    "runtimeVersion": {
      "policy": "fingerprint"
    },
    "updates": {
      "url": "https://u.expo.dev/78c4eab3-2e5c-4bf7-a411-127754f91079",
      "fallbackToCacheTimeout": 0
    },
```

`fallbackToCacheTimeout: 0`인 이유: 앱 시작 시 업데이트를 기다리지 않고 **캐시된 번들로 즉시 뜬 뒤 백그라운드로 받는다.** 학습 앱에서 시작 지연은 이탈로 이어지고, OTA는 다음 실행에 적용돼도 충분하다.

- [ ] **Step 4: 설정이 유효한지 확인**

Run:
```bash
cd /Users/ywyeom/private/forin/mobile
python3 -c "
import json;d=json.load(open('app.json'))['expo']
print('runtimeVersion:', d.get('runtimeVersion'))
print('updates:', d.get('updates'))
assert d['runtimeVersion']=={'policy':'fingerprint'}
assert d['updates']['url'].endswith(d['extra']['eas']['projectId'])
print('projectId가 updates.url과 일치')"
npx expo-doctor 2>&1 | tail -8
```
Expected: 두 키가 올바르고 projectId가 일치. `expo-doctor`는 통과이거나, 남은 경고가 **이 변경과 무관한 기존 경고**임을 보고서에 적는다

- [ ] **Step 5: fingerprint가 실제로 계산되는지 확인 (이 태스크의 완료 판정)**

> ⚠️ **`eas config`로는 확인할 수 없다**(구현 중 실측으로 정정). 그 명령은 `app.json`·`eas.json`을 **표시**할 뿐이고
> `--json`을 붙여도 `{"policy":"fingerprint"}` 문자열을 그대로 돌려준다 — 지문을 계산하지 않는다.

Run:
```bash
cd /Users/ywyeom/private/forin/mobile
npx eas-cli@21.8.0 fingerprint:generate --build-profile production --platform android --non-interactive
```
Expected: **40자 지문 해시**가 출력되고 `accounts/<account>/projects/forin/fingerprints/<hash>` URL이 따라온다 —
이것이 정책이 실제로 네이티브 소스를 읽어 지문을 만든다는 증거다.

**증명 범위를 정확히 적어라**: 이 명령은 "이 프로젝트에서 지문 계산이 동작한다"를 증명한다. **`eas build`/`eas update`가
`app.json`의 `runtimeVersion.policy`를 소비해 그 해시를 바이너리에 박는지는 실제 빌드가 있어야 알 수 있고 이 태스크
범위 밖이다.** 리포트 결론을 그 범위로 좁히고, 빌드 시 소비 여부는 **첫 실제 빌드에서 확인할 항목**으로 남겨라
(9-A의 "첫 실행 관측" 체크리스트가 값을 한 것과 같은 이유다).

- [ ] **Step 6: 기준선이 깨지지 않았는지 확인**

Run:
```bash
cd /Users/ywyeom/private/forin/mobile
npx tsc --noEmit; echo "tsc exit=$?"
npm test 2>&1 | tail -5
```
Expected: `tsc exit=0` · `38 passed` / `213 passed`. `expo-updates`가 타입이나 테스트를 깨면 그것 자체가 발견이니 보고하라

- [ ] **Step 7: 커밋·푸시**

```bash
cd /Users/ywyeom/private/forin
git add mobile/package.json mobile/package-lock.json mobile/app.json
git commit -m "$(cat <<'EOF'
feat(mobile): expo-updates + fingerprint runtimeVersion

OTA 정책을 사람의 기억이 아니라 도구로 강제한다. 이 앱은 카카오 SDK·애플
인증·expo-audio 같은 네이티브 모듈을 쓰는데, appVersion 정책은 앱 버전만 같으면
OTA를 받아들이므로 네이티브 의존이 바뀐 JS를 구버전 바이너리에 밀어넣을 수
있다 — 그 조합은 런타임에 깨지고 사용자는 앱이 이유 없이 죽는 것을 본다.
fingerprint는 네이티브 지문이 바뀌면 런타임 버전이 달라져 OTA가 자동
무효화된다.

fallbackToCacheTimeout=0: 시작 시 업데이트를 기다리지 않고 캐시 번들로 즉시
뜬 뒤 백그라운드로 받는다. 학습 앱에서 시작 지연은 이탈이고 OTA는 다음
실행에 적용돼도 충분하다.

expo install을 썼다(npm install 아님) — SDK 56에 맞는 버전을 고르게.

검증: projectId와 updates.url 일치 · eas fingerprint:generate가 네이티브 소스에서
40자 해시를 계산(eas config는 정책 문자열만 표시하므로 확인 수단이 아니다) ·
tsc 0 · jest 213. 빌드 시 소비 여부는 첫 실제 빌드에서 확인할 항목이다.
EOF
)"
git push origin master
```

---

### Task 4: OTA 배포 워크플로 — prod 승격과 같은 승인 게이트

**Files:**
- Create: `.github/workflows/ota.yml`

**Interfaces:**
- Consumes: Task 2의 채널(`preview`·`production`), Task 3의 `expo-updates` 설정, GitHub 시크릿 `EXPO_TOKEN`
- Produces: `workflow_dispatch` 전용 OTA 워크플로. `production` 채널은 `production` Environment 승인 게이트를 지난다

> **왜 OTA에 승인 게이트가 붙는가**(스펙 §6): OTA는 **스토어 심사를 우회하는 경로**다. 새 빌드는 Apple·Google의 검토를 거치는데 `eas update`는 즉시 모든 사용자에게 JS를 밀어넣는다. 즉 배포 경로 중 가장 빠르고 가장 되돌리기 어려운 것이므로, prod 승격보다 느슨할 이유가 없다.
>
> 9-A가 `promote.yml`에서 확립한 형태를 그대로 쓴다: **`workflow_dispatch` 전용**(설정이 어떻든 사람이 눌러야 돈다) + `environment: production`(설정돼 있으면 승인자가 2차 방어). 9-A의 첫 승격에서 이 조합이 실제로 승인 대기를 만들어 작동을 확인했다.

- [ ] **Step 1: `EXPO_TOKEN`이 필요하다는 것을 확인 (사람 작업)**

`eas update`는 CI에서 로봇 토큰이 필요하다. 이 태스크는 워크플로를 배선하고, **토큰 등록은 사람이 한다**:
- [expo.dev](https://expo.dev) → Account settings → Access tokens → 새 토큰 발급
- GitHub 리포 → Settings → Secrets and variables → Actions → **Secrets**(Variables 아님 — 이건 진짜 시크릿이다) → `EXPO_TOKEN`

이 단계는 실행하지 말고, 보고서에 "사람 작업으로 남김"이라고 적어라.

- [ ] **Step 2: 워크플로 작성**

Create `.github/workflows/ota.yml`:

```yaml
name: ota

# OTA bypasses store review: `eas update` pushes JS to every user immediately,
# while a new build goes through Apple/Google. It is the fastest and least
# reversible path we have, so it gets the same gate as promoting production —
# manual dispatch only (no GitHub setting can make this fire on its own) plus
# the production environment's reviewer as a second layer.
#
# The fingerprint runtimeVersion policy (app.json) is what makes this safe at
# all: if native dependencies changed, the fingerprint changes and this update
# simply will not be offered to the old binary.
on:
  workflow_dispatch:
    inputs:
      channel:
        description: Which channel to publish to
        type: choice
        options: [preview, production]
        required: true
      message:
        description: Update message (shown in the EAS dashboard)
        type: string
        required: true

concurrency:
  group: ota-${{ inputs.channel }}
  cancel-in-progress: false

jobs:
  update:
    runs-on: ubuntu-latest
    # Only the production channel needs the reviewer gate; preview is internal.
    environment: ${{ inputs.channel == 'production' && 'production' || 'preview' }}
    permissions:
      contents: read
    defaults:
      run:
        working-directory: mobile
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: npm
          cache-dependency-path: mobile/package-lock.json

      - run: npm ci

      # Publishing a bundle that does not type-check or pass tests would reach
      # users faster than any other path in this repo. Re-verify here rather
      # than trusting that mobile.yml ran on this commit.
      - name: Type-check
        run: npx tsc --noEmit

      - name: Test
        run: npm test

      - name: Publish update
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
          CHANNEL: ${{ inputs.channel }}
          MESSAGE: ${{ inputs.message }}
        run: npx eas-cli@21.8.0 update --channel "$CHANNEL" --message "$MESSAGE" --non-interactive
```

- [ ] **Step 3: 검증**

Run:
```bash
cd /Users/ywyeom/private/forin
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/ota.yml')); print('yaml ok')"
grep -n "^  push:\|^  pull_request:\|^  schedule:\|^  workflow_run:" .github/workflows/ota.yml || echo "자동 트리거 없음 ✅"
grep -n 'inputs\.' .github/workflows/ota.yml
```
Expected: `yaml ok` · **자동 트리거 없음** · `${{ inputs.* }}`가 `run:` 본문에 없고 `env:`·`concurrency`·`environment` 키에만 있다(9-A에서 확립한 관례 — 운영자 입력을 셸에 직접 보간하지 않는다)

또한 모든 `run:` 블록의 셸 문법을 확인한다:
```bash
python3 - <<'PY'
import yaml,subprocess
d=yaml.safe_load(open('.github/workflows/ota.yml'))
bad=0
for jn,j in d['jobs'].items():
    for i,st in enumerate(j.get('steps',[])):
        r=st.get('run')
        if not r: continue
        p=subprocess.run(['bash','-n'],input=r,text=True,capture_output=True)
        if p.returncode: bad+=1; print('✗',jn,i,st.get('name'),p.stderr.strip()[:100])
print('모든 run: 블록 bash -n 통과' if not bad else f'{bad}곳 실패')
PY
```
Expected: 전부 통과

- [ ] **Step 4: 커밋·푸시**

```bash
cd /Users/ywyeom/private/forin
git add .github/workflows/ota.yml
git commit -m "$(cat <<'EOF'
feat(deploy): OTA 워크플로 — prod 승격과 같은 승인 게이트

OTA는 스토어 심사를 우회한다. 새 빌드는 Apple·Google 검토를 거치는데
eas update는 즉시 모든 사용자에게 JS를 밀어넣는다 — 배포 경로 중 가장 빠르고
가장 되돌리기 어려우므로 prod 승격보다 느슨할 이유가 없다.

9-A의 promote.yml이 확립한 형태를 그대로 쓴다: workflow_dispatch 전용(설정이
어떻든 사람이 눌러야 돈다) + production Environment 승인이 2차 방어.
preview 채널은 내부용이라 preview 환경으로 갈린다.

번들을 밀기 전에 tsc·jest를 다시 돌린다 — 타입이 깨진 번들이 이 리포의 어떤
경로보다 빠르게 사용자에게 닿는다. mobile.yml이 이 커밋에 돌았기를 믿지 않는다.

운영자 입력은 env 경유로만 셸에 들어간다(9-A에서 확립한 관례).

EXPO_TOKEN 등록은 사람 작업으로 남긴다.

검증: yaml 파싱 · 자동 트리거 없음 · inputs가 run: 본문에 없음 · bash -n
EOF
)"
git push origin master
```

---

### Task 5: Android 제출 배선 + 스펙·STATUS 갱신

**Files:**
- Modify: `mobile/eas.json` (`submit` 절)
- Modify: `docs/dlc/projects/forin/03-operations/01-deployment.md` (§6 체크리스트·§11 갱신)
- Modify: `docs/dlc/projects/forin/STATUS.md`

**Interfaces:**
- Consumes: Task 2의 프로필, Play 개발자 계정(신원확인 중 — **실행은 이 태스크 범위 밖**)
- Produces: `eas submit --profile production --platform android`가 어느 트랙에 올릴지 선언된 상태 + 9-B 완료 기록

> **트랙 선택이 중요하다**(스펙 §6.1): 개인 Play 계정은 프로덕션 접근을 얻기 위해 **비공개(closed) 테스트에서 12명 이상 옵트인 테스터를 14일간** 유지해야 하고, **내부(internal) 테스트는 그 요건에 카운트되지 않는다.** 따라서 기본 트랙은 `internal`이 아니라 **비공개 테스트**여야 한다 — 아니면 2주 시계가 시작되지 않는다.

- [ ] **Step 1: `eas.json`의 `submit` 절 작성**

`mobile/eas.json`의 `"submit"`을 다음으로 바꾼다:

```json
  "submit": {
    "production": {
      "android": {
        "track": "alpha",
        "releaseStatus": "draft"
      }
    }
  }
```

`track: "alpha"`가 Play의 **비공개(closed) 테스트**에 해당한다 — `internal`을 쓰면 12명/14일 요건에 카운트되지 않아 2주 시계가 시작되지 않는다(§6.1). `releaseStatus: "draft"`로 두어 **업로드와 공개를 분리**한다: 올라간 빌드를 Play Console에서 확인한 뒤 사람이 공개한다.

iOS는 **의도적으로 비워 둔다** — Apple Developer 멤버십이 없어 제출 경로가 없다(2026-08-13 확인). 멤버십 확보 후 `"ios": { "ascAppId": "..." }`를 추가한다.

- [ ] **Step 2: JSON 파싱 + Task 2의 설정이 살아 있는지 확인**

Run:
```bash
cd /Users/ywyeom/private/forin/mobile
python3 - <<'PY'
import json
d=json.load(open('eas.json'))
s=d['submit']['production']
print('android track:', s['android']['track'], '/ releaseStatus:', s['android']['releaseStatus'])
assert s['android']['track']=='alpha', 'internal은 12명/14일에 카운트되지 않는다'
print('ios 절 없음(멤버십 없음):', 'ios' not in s)
# Task 2가 넣은 것이 그대로인지
for p in ['preview','production']:
    b=d['build'][p]; assert b.get('channel') and b.get('env',{}).get('EXPO_PUBLIC_API_URL')
print('build 프로필의 channel·API URL 유지됨')
PY
```
Expected: 전부 통과

- [ ] **Step 3: 스펙 갱신 — 체크리스트와 9-B 기록**

`docs/dlc/projects/forin/03-operations/01-deployment.md`:

1. 체크리스트의 모바일 항목을 갱신한다:
```markdown
- [x] 모바일 배포 (EAS Build/Submit, 환경 분리, OTA 업데이트 정책) — **배선 완료(2026-08-13)**.
      실제 빌드·제출은 Play 계정 신원확인·Apple 멤버십 대기
```
   그리고 첫 항목의 "모바일 CI는 9-B"를 "**완료**"로 바꾼다.

2. §11 뒤에 `### 12. 9-B 모바일 배포 (2026-08-13)` 절을 추가하고 다음을 적는다:
   - `mobile.yml` 신설 — 착수 전 감사에서 확인된 "모바일 검증이 CI에 하나도 없음"을 닫았다. 경로 필터에 `packages/contract/**`를 포함한 이유(계약 재생성이 모바일 타입을 깨는 경로)
   - **조용한 폴백 두 개를 막았다**: `client.ts`의 localhost 폴백과 **gitignore된 `mobile/.env` 때문에 EAS 빌드에 소셜 클라이언트 ID가 전달되지 않던 것**. 후자는 로컬 `expo start`에서는 동작하므로 §11.1의 결함들과 같은 부류다 — "도구가 통과시키는 구성"
   - `expo-updates` + fingerprint 정책, `fallbackToCacheTimeout: 0`의 근거
   - OTA에 `promote.yml`과 같은 게이트를 붙인 이유
   - **제출 트랙을 `alpha`(비공개)로 둔 이유** — `internal`은 12명/14일에 카운트되지 않는다
   - **미실행으로 남은 것**: Apple 멤버십 없음(iOS 제출 불가) · Play 계정 신원확인 중 · `EXPO_TOKEN` 미등록 · 실제 `eas build`/`eas submit` 미실행

3. frontmatter의 `updated:`를 `2026-08-13`으로 유지(이미 그 날짜)

- [ ] **Step 4: STATUS 갱신**

`docs/dlc/projects/forin/STATUS.md`의 3-1 행에 9-B 배선 완료를 덧붙이고, "AI 진입점"의 다음 지점을 **3-2 모니터링**으로 옮긴다. 단 **9-B의 실행 잔여**(Apple 멤버십·Play 신원확인·`EXPO_TOKEN`·실제 빌드·제출)를 명시해 "배선 완료 ≠ 배포 완료"임이 드러나게 한다.

- [ ] **Step 5: 커밋·푸시 (서브모듈 먼저)**

```bash
cd /Users/ywyeom/private/forin/docs/dlc
git add -A
git commit -m "$(cat <<'EOF'
docs(3-1): 9-B 모바일 배포 배선 완료 (§12)

mobile.yml로 모바일 검증을 CI 게이트에 올렸고(경로 필터에 packages/contract/**
포함 — 계약 재생성이 모바일 타입을 깨는 경로), EAS 프로필별 환경 분리로 조용한
폴백 두 개를 막았다.

두 번째 폴백이 §11.1의 결함들과 같은 부류다: mobile/.env가 gitignore돼 EAS
빌드에 소셜 클라이언트 ID가 전달되지 않는데 로컬 expo start는 잘 된다 —
도구가 통과시키는 구성.

expo-updates는 fingerprint 정책으로 네이티브 지문이 바뀌면 OTA가 자동
무효화되게 했고, OTA 자체는 스토어 심사를 우회하므로 promote.yml과 같은
수동 게이트를 붙였다.

제출 트랙은 alpha(비공개)다 — internal은 개인 계정의 12명/14일 요건에
카운트되지 않아 2주 시계가 시작되지 않는다.

미실행: Apple 멤버십 없음 · Play 신원확인 중 · EXPO_TOKEN 미등록 · 실제
빌드·제출. 배선 완료는 배포 완료가 아니다.
EOF
)"
git push origin master

cd /Users/ywyeom/private/forin
git add mobile/eas.json docs/dlc
git commit -m "feat(mobile): Android 제출 트랙을 비공개(alpha)로 배선 + 9-B 기록"
git push origin master
```

- [ ] **Step 6: 최종 확인**

Run:
```bash
cd /Users/ywyeom/private/forin
git status --short && echo "(비어있으면 클린)"
gh run list --workflow=mobile.yml --limit 1 --json status,conclusion --template '{{range .}}mobile.yml: {{.status}}/{{.conclusion}}{{end}}'
```
Expected: 작업 트리 클린 · `mobile.yml`이 `completed/success`

---

## 완료 판정 (9-B 배선)

- [ ] `mobile.yml`이 CI에서 **green** (tsc 0 · jest 38 suites / 213 tests)
- [ ] `eas config`가 `preview`→staging URL·채널 `preview`, `production`→prod URL·채널 `production`으로 **해석**
- [ ] **`eas fingerprint:generate`가 40자 지문 해시를 계산**(`eas config`는 정책 문자열만 표시하므로 확인 수단이 아니다 — 실측으로 확인된 사실). 빌드 시 소비 여부는 첫 실제 빌드 관측 항목
- [ ] `ota.yml`에 자동 트리거가 없고 `inputs`가 `run:` 본문에 없음
- [ ] 제출 트랙이 `alpha`(비공개) — `internal`이 아님
- [ ] 스펙 §12·STATUS 갱신, 작업 트리 클린

## 9-B가 다루지 않는 것 (자격증명 대기)

- **Apple Developer 멤버십 없음** → iOS 제출 경로 없음. 빌드 검증도 멤버십이 필요한 서명 단계에서 막힐 수 있다
- **Play 개발자 계정 신원확인 중** → 앱(`app.forin.mobile`) 생성 전이므로 `eas submit` 불가
- **`EXPO_TOKEN` 미등록** → `ota.yml` 실행 불가
- 실제 `eas build` 미실행 — 첫 빌드는 네이티브 의존(카카오 SDK·애플 인증)이 EAS 빌더에서 처음 컴파일되는 지점이라 **새로운 종류의 실패가 나올 수 있다.** 9-A의 교훈대로 "배선이 맞다"와 "실제로 돈다"는 다른 사건이다
