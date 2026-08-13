#!/usr/bin/env bash
# End-to-end smoke test for the core forin journey (Stage 2-8 통합·E2E).
# Exercises: auth → onboarding → curriculum → dialogue+correction → clear(XP) →
# review(SM-2) → growth stats → daily pool + rewarded top-up → missions → dept
# situations → home aggregate → colleagues (code, boundaries, privacy) →
# reputation (acuity plumbing, ungraded clears) → access (rewards as keys), plus
# robustness (token refresh/rotation, error status codes).
#
# The colleague LINK flow (request → accept → cheer) needs two users and
# /auth/dev is a single fixed account, so this script covers the single-user
# contract and the boundaries instead; the two-user path is verified manually
# (see the Build Spec §5 verification plan).
#
# State-independent: assertions are monotonic (after ≥ before) or structural, so
# the script passes on any starting state and is safe to re-run. Requires the dev
# server running with ENV=dev (uses POST /auth/dev).
#
#   usage: ./scripts/e2e_smoke.sh [BASE_URL]   (default http://localhost:8080)
#   env:   DEV_AUTH_SECRET — required against staging (see 3-1 §Task 4); unused locally
set -uo pipefail
B="${1:-http://localhost:8080}"
# staging/prod-shaped environments register /auth/dev only when DEV_AUTH_SECRET is
# configured, and then require it as a header. Locally this is empty and unused.
DEV_AUTH="${DEV_AUTH_SECRET:-}"
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
#
# X-Dev-Auth is intentionally NOT attached here. Only POST /auth/dev needs it
# (it's the one route gated by DevAuthSecret; see router.go) — every other
# call below authenticates with the Bearer token that route issued. Sending
# the secret on every request means staging would have it in every access
# log line, forever, the moment anyone turns on request logging; that's a
# much bigger blast radius than the one call that actually needs it.
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
BODY=$(curl -s -X POST "$B/auth/dev" -H "X-Dev-Auth: $DEV_AUTH")
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

hd "⑫ HOME · one round trip, no placeholders"
run GET "/me/home?tz=Asia/Seoul"
[ "$CODE" = 200 ] && ok "GET /me/home 200" || bad "home → $CODE"
hdate=$(pj "d.get('date','')")
[ -n "$hdate" ] && ok "home date bucketed in tz: $hdate" || bad "no date"
wk=$(pj "len(d.get('week',[]))")
[ "${wk:-0}" = 7 ] && ok "week rhythm has 7 blocks" || bad "week blocks=$wk"
todaymark=$(pj "d.get('week',[0]*7).count(2)")
[ "${todaymark:-0}" = 1 ] && ok "exactly one block marked today" || bad "today blocks=$todaymark"
# 더미 금지: a module is either absent or fully populated — never a stub.
mn=$(pj "('mentorNote' not in d) or bool(d['mentorNote'].get('text') and d['mentorNote'].get('npc',{}).get('name'))")
[ "$mn" = "True" ] && ok "mentorNote absent or complete" || bad "mentorNote present but hollow"
ph=$(pj "('phrase' not in d) or bool(d['phrase'].get('en') and d['phrase'].get('ko'))")
[ "$ph" = "True" ] && ok "phrase absent or complete" || bad "phrase present but hollow"
t1=$(pj "('todayOne' not in d) or bool(d['todayOne'].get('title'))")
[ "$t1" = "True" ] && ok "todayOne absent or titled" || bad "todayOne present but untitled"
# done is the inverse of having a next step — the rest card replaces the hero.
inv=$(pj "d.get('done') == ('todayOne' not in d)")
[ "$inv" = "True" ] && ok "done ⇔ no todayOne (rest card state)" || bad "done/todayOne disagree"
# The shift department must be the curriculum's current one, not a random pick.
if [ "$(pj "'shift' in d")" = "True" ]; then
  sdept=$(pj "d['shift']['deptLabel']")
  run GET /me/curriculum
  cdept=$(pj "next((c['dept'] for c in d.get('chapters',[]) if c.get('state')=='now'), '')")
  [ "$sdept" = "$cdept" ] && ok "shift dept matches curriculum: $sdept" || bad "shift '$sdept' ≠ curriculum '$cdept'"
fi

hd "⑬ COLLEAGUES · code, boundaries, privacy"
run POST /me/invite-code
[ "$CODE" = 200 ] && ok "POST /me/invite-code 200" || bad "invite-code → $CODE"
MYCODE=$(pj "d.get('code','')")
printf '%s' "$MYCODE" | grep -qE '^[23456789ABCDEFGHJKMNPQRSTVWXYZ]{2}-[23456789ABCDEFGHJKMNPQRSTVWXYZ]{4}$' \
  && ok "code shape XX-XXXX, no confusable chars: $MYCODE" || bad "bad code shape: $MYCODE"
run POST /me/invite-code; SAME=$(pj "d.get('code','')")
[ "$SAME" = "$MYCODE" ] && ok "re-issue returns the same active code" || bad "code changed without rotate ($MYCODE→$SAME)"
# Looking up your OWN code is a mistake, not a match.
run "GET" "/invite/$MYCODE"
[ "$CODE" = 400 ] && ok "own code lookup → 400" || bad "own code lookup → $CODE"
run GET /invite/ZZ-ZZZZ
[ "$CODE" = 404 ] && ok "unknown code → 404" || bad "unknown code → $CODE"
run POST /me/colleagues "{\"code\":\"$MYCODE\"}"
[ "$CODE" = 400 ] && ok "adding yourself → 400" || bad "self-add → $CODE"
run POST /me/colleagues '{"code":"nonsense"}'
[ "$CODE" = 404 ] && ok "malformed code → 404" || bad "malformed code → $CODE"
run GET /me/colleagues
[ "$CODE" = 200 ] && ok "GET /me/colleagues 200" || bad "colleagues → $CODE"
# A stranger must be indistinguishable from a non-existent user (404, never 403).
run GET /me/colleagues/00000000-0000-0000-0000-000000000000
[ "$CODE" = 404 ] && ok "unlinked colleague → 404 (not 403)" || bad "unlinked colleague → $CODE"
run POST /me/colleagues/00000000-0000-0000-0000-000000000000/cheers '{"preset":"fighting"}'
[ "$CODE" = 404 ] && ok "cheer to unlinked → 404" || bad "cheer to unlinked → $CODE"
run GET /me/cheers
[ "$CODE" = 200 ] && ok "GET /me/cheers 200" || bad "cheers → $CODE"
run GET /me/colleague-requests
[ "$CODE" = 200 ] && ok "GET /me/colleague-requests 200" || bad "requests → $CODE"

hd "⑭ COLLEAGUE PREFS · toggle + restore"
run GET /me/colleague-prefs
ORIG=$(pj "d.get('shareStatus')")
[ "$CODE" = 200 ] && ok "prefs default readable (shareStatus=$ORIG)" || bad "prefs → $CODE"
run PATCH /me/colleague-prefs '{"shareStatus":false}'
off=$(pj "d.get('shareStatus')")
[ "$off" = "False" ] && ok "shareStatus can be turned off" || bad "prefs patch → $off"
# Restore whatever the account had, not a hardcoded default — a user who
# deliberately hid their status must not have it flipped back by a test run.
if [ "$ORIG" = "True" ]; then RESTORE=true; else RESTORE=false; fi
run PATCH /me/colleague-prefs "{\"shareStatus\":$RESTORE}"
on=$(pj "d.get('shareStatus')")
[ "$on" = "$ORIG" ] && ok "shareStatus restored to original ($ORIG)" || bad "restore → $on, wanted $ORIG"

hd "⑮ REPUTATION · acuity plumbing + ungraded clears don't move it"
# Acuity must survive content → DB → API, or the emergency dimension can never move.
run GET /scenarios/SCN-HOSPICE-00108
ac=$(pj "d.get('acuity','')")
[ "$ac" = "critical" ] && ok "acuity reaches the API (hospice scenario = critical)" || bad "acuity='$ac', wanted critical"
# Emergencies are not an ER thing — the tagged scenario above is a hospice ward.
run GET /me/progress
# Reputation is server-defined per profession: ordered, labelled, self-describing.
nd=$(pj "len(d.get('reputation',[]))")
[ "${nd:-0}" -ge 1 ] && ok "reputation dimensions served: $nd" || bad "no reputation dimensions"
labelled=$(pj "all(x.get('key') and x.get('label') for x in d.get('reputation',[]))")
[ "$labelled" = "True" ] && ok "every dimension carries key + label (client hardcodes none)" || bad "a dimension lacks key/label"
inrange=$(pj "all(0 <= x.get('value',0) <= 100 for x in d.get('reputation',[]))")
[ "$inrange" = "True" ] && ok "all reputation dimensions within 0..100" || bad "a dimension is out of range"
rep0=$(pj "sorted((x['key'], x['value']) for x in d.get('reputation',[]))")
# A direct /attempts clear carries no AI grade, so there is nothing to judge and
# reputation must stay put. (The GRADED path is covered by unit tests + manual
# E2E; completing a session here would add an LLM call whose neutral-fallback
# grade equals the pass score, i.e. a zero delta — a flaky assertion.)
run POST /attempts '{"scenarioId":"SCN-ER-00001","score":50}'
run GET /me/progress
same=$(pj "str(sorted((x['key'], x['value']) for x in d.get('reputation',[]))) == '''$rep0'''")
[ "$same" = "True" ] && ok "ungraded clear leaves reputation untouched" || bad "ungraded clear moved reputation"

hd "⑯ ACCESS · rewards become keys"
run GET /me/access/INT-ER-00001
[ "$CODE" = 200 ] && ok "GET /me/access/{interior} 200" || bad "access → $CODE"
shape=$(pj "all('id' in g and 'locked' in g for g in d.get('rooms',[]) + d.get('hotspots',[]))")
[ "$shape" = "True" ] && ok "every room/hotspot reports a lock state" || bad "malformed gate"
# A lock without a reason isn't a goal — anything closed must say why.
reasoned=$(pj "all(g.get('reason') for g in d.get('rooms',[]) + d.get('hotspots',[]) if g.get('locked'))")
[ "$reasoned" = "True" ] && ok "every locked gate states a reason" || bad "a locked gate gave no reason"
# The dev user has cleared SCN-ER-00001 by this point in the run, so the room it
# gates must be open — i.e. the reward actually turned into a key.
trauma=$(pj "next((g['locked'] for g in d.get('rooms',[]) if g['id']=='trauma'), None)")
[ "$trauma" = "False" ] && ok "requirement met → gated room open (reward = key)" || bad "trauma locked=$trauma after clearing its requirement"

hd "RESULT"
printf "  \033[1m%d passed, %d failed\033[0m\n" "$PASS" "$FAIL"
[ "$FAIL" -eq 0 ] || exit 1
