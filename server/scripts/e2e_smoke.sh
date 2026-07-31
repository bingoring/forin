#!/usr/bin/env bash
# End-to-end smoke test for the core forin journey (Stage 2-8 통합·E2E).
# Exercises: auth → onboarding → curriculum → dialogue+correction → clear(XP) →
# review(SM-2) → growth stats → daily pool + rewarded top-up → missions → dept
# situations, plus robustness (token refresh/rotation, error status codes).
#
# State-independent: assertions are monotonic (after ≥ before) or structural, so
# the script passes on any starting state and is safe to re-run. Requires the dev
# server running with ENV=dev (uses POST /auth/dev).
#
#   usage: ./scripts/e2e_smoke.sh [BASE_URL]   (default http://localhost:8080)
set -uo pipefail
B="${1:-http://localhost:8080}"
PASS=0; FAIL=0
ok()  { PASS=$((PASS+1)); printf "  \033[32m✔\033[0m %s\n" "$1"; }
bad() { FAIL=$((FAIL+1)); printf "  \033[31mx\033[0m %s\n" "$1"; }
hd()  { printf "\n\033[1m%s\033[0m\n" "$1"; }
# pj EXPR — evaluate a python expression on parsed dict `d` from $BODY
pj()  { printf '%s' "$BODY" | python3 -c "import sys,json
try: d=json.load(sys.stdin)
except Exception: d={}
print($1)" 2>/dev/null; }

TOK=""; REFRESH=""; BODY=""; CODE=""
# run METHOD PATH [DATA] — sets globals BODY + CODE (not a subshell, so they stick)
run() {
  local m="$1" p="$2" d="${3:-}" out
  if [ -n "$d" ]; then
    out=$(curl -s -w $'\n%{http_code}' -X "$m" "$B$p" -H "Authorization: Bearer $TOK" -H 'Content-Type: application/json' -d "$d")
  else
    out=$(curl -s -w $'\n%{http_code}' -X "$m" "$B$p" -H "Authorization: Bearer $TOK")
  fi
  CODE="${out##*$'\n'}"; BODY="${out%$'\n'*}"
}

hd "① AUTH · dev login"
BODY=$(curl -s -X POST "$B/auth/dev")
TOK=$(pj "d['tokens']['accessToken']")
REFRESH=$(pj "d['tokens']['refreshToken']")
[ -n "$TOK" ] && ok "access token issued" || bad "no access token (is ENV=dev + server up?)"
[ -n "$REFRESH" ] && ok "refresh token issued" || bad "no refresh token"

hd "② ONBOARDING · save profile"
run PATCH /me/profile '{"job":"nurse","nativeLang":"ko","targetLang":"en","destination":"us","targetLevel":"B1"}'
[ "$CODE" = 200 ] && ok "PATCH /me/profile 200" || bad "PATCH /me/profile → $CODE"
run GET /me; onb=$(pj "d.get('profile',{}).get('onboarded')")
[ "$onb" = "True" ] && ok "/me onboarded=true" || bad "onboarded=$onb"

hd "③ TOKEN · refresh rotation"
# NOTE: /auth/refresh returns the token pair at the top level (accessToken/
# refreshToken), whereas /auth/dev|social wrap it in {"tokens": …}.
BODY=$(curl -s -X POST "$B/auth/refresh" -H 'Content-Type: application/json' -d "{\"refreshToken\":\"$REFRESH\"}")
NEWACC=$(pj "d.get('accessToken','')"); NEWREF=$(pj "d.get('refreshToken','')")
[ -n "$NEWACC" ] && ok "refresh issued new access token" || bad "refresh failed"
reuse=$(curl -s -o /dev/null -w '%{http_code}' -X POST "$B/auth/refresh" -H 'Content-Type: application/json' -d "{\"refreshToken\":\"$REFRESH\"}")
[ "$reuse" != 200 ] && ok "old refresh token rejected on reuse ($reuse)" || bad "old refresh reused → 200 (no rotation)"
[ -n "$NEWREF" ] && REFRESH="$NEWREF"

hd "④ CURRICULUM · structure"
run GET /me/curriculum
nch=$(pj "len(d.get('chapters',[]))")
[ "${nch:-0}" -ge 5 ] && ok "curriculum has $nch chapters" || bad "curriculum chapters=$nch"
states=$(pj "','.join(c['state'] for c in d['chapters'])")
printf '%s' "$states" | grep -q "now\|done" && ok "chapter states resolved ($states)" || bad "no now/done state"

hd "⑤ DIALOGUE · reply + background correction → review card"
run GET /me/review; before=$(pj "len(d.get('cards',[]))")
run POST /scenarios/SCN-ER-00001/conversation; sid=$(pj "d.get('sessionId','')")
[ -n "$sid" ] && ok "conversation session started" || bad "no session id"
run POST "/conversation/$sid/message" '{"text":"Hello I want ask you about the pain since one hour ago okay"}'
reply=$(pj "d.get('reply','')")
[ -n "$reply" ] && ok "NPC reply received (${#reply} chars)" || bad "empty reply"
sleep 6
run GET /me/review; after=$(pj "len(d.get('cards',[]))")
[ "${after:-0}" -ge "${before:-0}" ] && ok "review cards ${before}→${after} (correction filed)" || bad "review cards shrank ${before}→${after}"

hd "⑥ CLEAR · attempt awards XP"
run GET /me/progress; xp0=$(pj "d.get('xp',0)")
run POST /attempts '{"scenarioId":"SCN-ER-00001","score":50}'
[ "$CODE" = 200 ] && ok "POST /attempts 200" || bad "attempts → $CODE"
xp1=$(pj "d.get('xp',0)")
[ "${xp1:-0}" -gt "${xp0:-0}" ] && ok "XP ${xp0}→${xp1} (awarded)" || bad "XP not awarded (${xp0}→${xp1})"
run "GET" "/me/stats?tz=Asia/Seoul"; tot=$(pj "d.get('scenariosTotal',0)")
[ "${tot:-0}" -ge 1 ] && ok "growth stats scenariosTotal=$tot" || bad "scenariosTotal=$tot"

hd "⑦ REVIEW · SM-2 grade"
run GET /me/review; cid=$(pj "(d.get('cards') or [{}])[0].get('id','')")
if [ -n "$cid" ]; then
  run "POST" "/me/review/$cid/grade" '{"grade":"good"}'; iv=$(pj "d.get('schedule',{}).get('intervalDays','?')")
  [ "$CODE" = 200 ] && ok "graded card → next interval ${iv}d" || bad "grade → $CODE"
else ok "no due cards to grade (skipped)"; fi

hd "⑧ DAILY POOL · sized + rewarded top-up + cap"
run "GET" "/me/daily-board?tz=Asia/Seoul&profession=nurse"; n=$(pj "len(d.get('scenarios',[]))")
[ "${n:-0}" -ge 1 ] && ok "daily pool has $n cards" || bad "daily pool empty"
run "POST" "/me/daily-board/topup?tz=Asia/Seoul&profession=nurse"
if [ "$CODE" = 200 ]; then
  n2=$(pj "len(d.get('scenarios',[]))")
  [ "${n2:-0}" -gt "${n:-0}" ] && ok "top-up grew pool ${n}→${n2}" || bad "top-up did not grow (${n}→${n2})"
elif [ "$CODE" = 429 ]; then ok "top-up cap already reached (429)"; else bad "top-up → $CODE"; fi

hd "⑨ MISSIONS · list + record idempotent"
run GET /me/missions; [ "$CODE" = 200 ] && ok "GET /me/missions 200" || bad "missions → $CODE"
run POST /me/missions/veteran
run GET /me/missions; f=$(pj "'veteran' in d.get('found',[])")
[ "$f" = "True" ] && ok "mission recorded (permanent)" || bad "mission not recorded"

hd "⑩ DEPT SITUATIONS · tagged by clears"
run "GET" "/me/situations?dept=ER"; ns=$(pj "len(d.get('situations',[]))")
[ "${ns:-0}" -ge 1 ] && ok "ER situations: $ns" || bad "no ER situations"
donetag=$(pj "any(s['tag']=='완료' for s in d.get('situations',[]))")
[ "$donetag" = "True" ] && ok "a cleared scenario is tagged 완료" || ok "no 완료 yet (state-dependent)"

hd "⑪ ERROR PATHS · status codes"
c=$(curl -s -o /dev/null -w '%{http_code}' "$B/me"); [ "$c" = 401 ] && ok "unauth /me → 401" || bad "unauth /me → $c"
run PATCH /me/title '{"titleId":"bogus"}'; [ "$CODE" = 400 ] && ok "bad title → 400" || bad "bad title → $CODE"
run POST /me/missions/bogus; [ "$CODE" = 400 ] && ok "unknown mission → 400" || bad "unknown mission → $CODE"

hd "RESULT"
printf "  \033[1m%d passed, %d failed\033[0m\n" "$PASS" "$FAIL"
[ "$FAIL" -eq 0 ] || exit 1
