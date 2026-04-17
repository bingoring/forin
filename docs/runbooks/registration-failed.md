# "Registration failed" on iOS Simulator Signup

- **발생 일자**: 2026-04-17
- **영향 범위**: 로컬 개발 환경, iOS 시뮬레이터 Create Account 화면
- **심각도**: 개발 진행 차단 (로컬 로그인/회원가입 불가)

---

## 1. 증상

iOS 시뮬레이터에서 forin 앱을 실행하고 Create Account 화면에서 이메일·비밀번호·닉네임을 입력한 뒤 "Sign Up" 버튼을 누르면, 다음과 같은 네이티브 알림이 표시됩니다.

> **Error**
> Registration failed

이메일 형식이 올바르고 비밀번호가 8자 이상이어도 동일 증상이 재현됩니다.

---

## 2. 근본 원인

**로컬 Go 백엔드 서버(`localhost:8080`)가 실행되고 있지 않음.**

데이터 흐름을 따라 추적하면:

```
RegisterScreen.tsx
  └─ useAuthStore.register(email, password, name)            // stores/authStore.ts:43
       └─ authApi.register(...)                              // api/auth.ts:5
            └─ axios.post('http://localhost:8080/v1/auth/register', ...) // api/client.ts:4-12
                 └─ TCP connect → ECONNREFUSED (서버 미기동)
```

axios가 네트워크 레벨에서 실패하면 `error.response`가 `undefined` 상태로 reject됩니다. `RegisterScreen.tsx:35` 의 fallback 로직이 작동하면서 "Registration failed" 문자열이 표시됩니다.

```ts
// mobile/src/screens/auth/RegisterScreen.tsx:35
const msg = err?.response?.data?.error?.message || 'Registration failed';
Alert.alert('Error', msg);
```

즉, **이 메시지는 "서버가 거절했다"가 아니라 "서버와 통신할 수 없었다"** 의 fallback이라는 점이 진단의 핵심입니다.

### 왜 서버만 꺼져 있었는가

`docker compose`로 뜨는 Postgres/Redis 컨테이너는 재부팅 후에도 살아남지만, `make run`으로 띄우는 Go 프로세스는 별도로 실행되어야 합니다. 터미널을 닫거나 IDE를 재시작하면 자동으로 내려갑니다.

---

## 3. 진단 절차

증상 발생 시 다음 순서로 확인합니다.

### 3-1. API 베이스 URL 확인

```bash
grep -nR "BASE_URL" mobile/src/api/
```

개발 모드(`__DEV__`)에서는 `http://localhost:8080/v1` 로 고정되어 있습니다 (`mobile/src/api/client.ts:4-6`).

### 3-2. 각 레이어 상태 점검

```bash
# (1) 백엔드 서버가 포트 8080에서 LISTEN 중인가
lsof -iTCP:8080 -sTCP:LISTEN -P

# (2) Postgres / Redis 컨테이너가 살아있는가
docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'

# (3) Go 서버에서 /v1/health 응답이 내려오는가
curl -sS -m 5 http://localhost:8080/v1/health
# 기대 응답: {"success":true,"data":{"postgres":"ok","redis":"ok","status":"ok"}}
```

| 결과 | 원인 |
|------|------|
| (1) 비어 있음 | **본 이슈 — Go 서버 미기동** |
| (1) 있지만 (2) 없음 | DB/캐시 누락 → `cd server && make docker-up` |
| (1)(2) 정상인데 (3) 비정상 | 서버 부팅 실패 → 서버 로그 확인 |

### 3-3. 증상 재현 (connection refused)

서버 다운 상태에서 모바일 앱과 동일한 페이로드로 요청을 보내면, 시뮬레이터가 맞닥뜨린 것과 동일한 네트워크 에러를 확인할 수 있습니다.

```bash
curl -sS -m 3 -w '\nHTTP %{http_code}\n' http://localhost:8080/v1/auth/register \
  -X POST -H 'Content-Type: application/json' \
  -d '{"email":"probe@example.com","password":"probepass123","display_name":"Probe"}'
# 출력: curl: (7) Failed to connect to localhost port 8080
```

### 3-4. 정상 경로 검증

서버를 띄운 뒤 동일 요청을 다시 보내면 201과 토큰이 내려와야 합니다.

```bash
curl -sS -m 5 -w '\nHTTP %{http_code}\n' http://localhost:8080/v1/auth/register \
  -X POST -H 'Content-Type: application/json' \
  -d "{\"email\":\"probe+$(date +%s)@example.com\",\"password\":\"probepass123\",\"display_name\":\"Probe\"}"
# 기대: HTTP 201 + {"success":true,"data":{"access_token":...}}
```

---

## 4. 해결 (즉시 복구)

```bash
# 1. 의존 컨테이너 확인 (필요 시 기동)
cd server
docker ps | grep -E 'forin-postgres|forin-redis' || make docker-up

# 2. Go 서버 실행
make run          # 포그라운드 실행
# or
make dev          # air 핫리로드 (개발 중 권장)
```

기동 후 로그에 다음 줄이 보이면 준비 완료입니다.

```
INFO	api/main.go:99	server starting	{"service": "forin-api", "port": "8080"}
```

그 상태에서 시뮬레이터의 Sign Up 버튼을 다시 눌러 회원가입이 성공하는지 확인합니다.

---

## 5. 재발 방지

### 5-1. 개발 세션 시작 체크리스트

- [ ] `docker ps` 로 `forin-postgres`, `forin-redis` 모두 `healthy` 확인
- [ ] `lsof -iTCP:8080 -sTCP:LISTEN` 로 서버 살아있는지 확인
- [ ] `curl http://localhost:8080/v1/health` 이 `postgres:ok, redis:ok` 반환
- [ ] (선택) `cd server && make dev` 를 별도 터미널 탭에 상주

### 5-2. 스모크 테스트 원커맨드

회귀 점검용 간단 스크립트. 서버 기동 후 실행하면 3-3/3-4 단계를 한 번에 검증합니다.

```bash
HEALTH=$(curl -sS -m 3 http://localhost:8080/v1/health)
if ! echo "$HEALTH" | grep -q '"status":"ok"'; then
  echo "[FAIL] health: $HEALTH"; exit 1
fi
EMAIL="smoke+$(date +%s)@example.com"
REG=$(curl -sS -m 5 http://localhost:8080/v1/auth/register \
  -X POST -H 'Content-Type: application/json' \
  -d "{\"email\":\"$EMAIL\",\"password\":\"smokepass123\",\"display_name\":\"smoke\"}")
echo "$REG" | grep -q '"access_token"' && echo "[OK] signup returns tokens" || {
  echo "[FAIL] signup: $REG"; exit 1
}
```

### 5-3. 클라이언트 에러 메시지 개선 후보 (선택)

현재 `RegisterScreen.tsx:35` 의 fallback은 네트워크 실패와 서버 거절을 구분하지 않습니다. 장기적으로는 아래와 같이 네트워크 에러를 분리하여 메시지를 노출하면 동일 이슈의 진단이 더 빨라집니다.

```ts
let msg = err?.response?.data?.error?.message;
if (!msg) {
  msg = err?.code === 'ERR_NETWORK'
    ? 'Cannot reach the server. Please check that the backend is running.'
    : 'Registration failed';
}
Alert.alert('Error', msg);
```

동일 패턴이 로그인·리프레시 등 다른 인증 화면에도 존재하므로 일괄 리팩터링 시 고려할 것.

### 5-4. Android 시뮬레이터 주의 사항

Android 에뮬레이터(AVD)에서는 호스트의 `localhost` 가 에뮬레이터 내부 loopback을 가리키므로 `http://localhost:8080` 대신 `http://10.0.2.2:8080` 로 접근해야 합니다. 현재 `mobile/src/api/client.ts` 의 `BASE_URL` 은 플랫폼 분기 없이 `localhost` 하드코딩이므로, Android 지원 시점에 `Platform.OS === 'android' ? '10.0.2.2' : 'localhost'` 처리를 추가해야 합니다.

---

## 관련 코드

| 파일 | 역할 |
|------|------|
| `mobile/src/screens/auth/RegisterScreen.tsx` | 회원가입 화면 + 에러 메시지 fallback |
| `mobile/src/stores/authStore.ts` | zustand 인증 스토어, 토큰 저장 |
| `mobile/src/api/auth.ts` | `/auth/*` 엔드포인트 wrapper |
| `mobile/src/api/client.ts` | axios 인스턴스, `BASE_URL` 정의 |
| `server/cmd/api/main.go` | 서버 진입점 (`port 8080` 기동) |
| `server/internal/handler/auth_handler.go` | `POST /v1/auth/register` 핸들러 |
| `server/internal/handler/response.go` | 표준 에러 응답 포맷 |

## 참고

- 백엔드 에러 응답 규격: [`docs/07_api_spec.md`](../07_api_spec.md)
- 서버 실행/환경변수: [`server/README.md`](../../server/README.md)
- Rate limit: 회원가입 3회/분/IP — 진단 중 429 발생 시 잠시 대기 후 재시도
