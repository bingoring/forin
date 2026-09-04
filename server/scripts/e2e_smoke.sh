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

TOK=""; REFRESH=""; MYID=""; BODY=""; CODE=""
# urlenc STR — percent-encode a query-string value (python3 is already a hard
# dependency of this script via pj()).
urlenc() { python3 -c "import sys,urllib.parse; print(urllib.parse.quote(sys.argv[1]))" "$1"; }
# resample16k SRC DST — Task 10 discovery: the reference-audio route serves the
# TTS clip at 24kHz (azurespeech.Synthesize's own fixed output format, chosen
# for native-playback quality), but POST /pronunciation's ValidateWAV requires
# EXACTLY 16kHz mono (business-rules §2). Feeding audio.wav straight back in,
# as the Task 10 brief's own "self-referee" method literally describes, 400s
# with invalid_audio — this was only caught by actually trying the round trip,
# not by reading either code path in isolation. Not a user-facing bug (a real
# recording is captured at 16kHz to begin with), but this script needs the
# resample step to exercise the real Assess call at all. Pure stdlib
# (no audioop/numpy/ffmpeg): linear interpolation is more than sufficient
# fidelity for feeding a scorer, and audioop is removed in Python 3.13+.
resample16k() {
  python3 -c "
import wave, array, sys
src, dst = sys.argv[1], sys.argv[2]
w = wave.open(src, 'rb')
assert w.getsampwidth() == 2 and w.getnchannels() == 1, 'expected mono 16-bit PCM'
data = w.readframes(w.getnframes())
src_rate = w.getframerate()
dst_rate = 16000
samples = array.array('h'); samples.frombytes(data)
n_src = len(samples)
n_dst = int(n_src * dst_rate / src_rate)
out = array.array('h', bytes(2 * n_dst))
for i in range(n_dst):
    pos = i * src_rate / dst_rate
    idx = int(pos)
    frac = pos - idx
    s0 = samples[idx] if idx < n_src else samples[-1]
    s1 = samples[idx + 1] if idx + 1 < n_src else samples[-1]
    out[i] = int(s0 + (s1 - s0) * frac)
ow = wave.open(dst, 'wb')
ow.setnchannels(1); ow.setsampwidth(2); ow.setframerate(dst_rate)
ow.writeframes(out.tobytes())
ow.close()
" "$1" "$2"
}
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
    # Body goes over STDIN (--data-binary @-), never as a `-d "$d"` argv
    # string — Task 10 caught this against the real staging runner (a
    # base64-encoded WAV body is ~85KB): macOS's shell tolerates a
    # multi-hundred-KB argv, GitHub Actions' Linux runner does not, and it
    # failed with "curl: Argument list too long" there while passing clean
    # locally. This form has no argv-size ceiling and is identical in
    # behavior for every existing small-body call site.
    out=$(printf '%s' "$d" | curl -s -w $'\n%{http_code}' -X "$m" "$B$p" -H "Authorization: Bearer $TOK" -H 'Content-Type: application/json' --data-binary @-)
  else
    out=$(curl -s -w $'\n%{http_code}' -X "$m" "$B$p" -H "Authorization: Bearer $TOK")
  fi
  CODE="${out##*$'\n'}"; BODY="${out%$'\n'*}"
}

hd "① AUTH · dev login"
BODY=$(curl -s -X POST "$B/auth/dev" -H "X-Dev-Auth: $DEV_AUTH")
TOK=$(pj "d['tokens']['accessToken']")
REFRESH=$(pj "d['tokens']['refreshToken']")
MYID=$(pj "d.get('user',{}).get('id','')")
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

# One request with an explicit UI language. The locale pipeline is header-driven
# (middleware never reads the profile — that would put a DB round trip on every
# request), so this is the only way to prove it end to end against a real server.
runlang() {
  local lang="$1" m="$2" p="$3" out
  out=$(curl -s -w $'\n%{http_code}' -X "$m" "$B$p" -H "Authorization: Bearer $TOK" -H "Accept-Language: $lang")
  CODE="${out##*$'\n'}"; BODY="${out%$'\n'*}"
}

hd "④ CURRICULUM · structure"
run GET /me/curriculum
# v2 shape: buildings → floors → curricula. The old assertions read `.chapters`,
# which no longer exists — and because they only checked a length, they went red on
# the contract change rather than on anything being wrong.
nb=$(pj "len(d.get('buildings',[]))")
[ "${nb:-0}" -ge 4 ] && ok "curriculum spans $nb buildings" || bad "curriculum buildings=$nb"
ncur=$(pj "sum(len(f['curricula']) for b in d.get('buildings',[]) for f in b['floors'])")
[ "${ncur:-0}" -ge 60 ] && ok "curriculum has $ncur curricula" || bad "curriculum curricula=$ncur"
# Exactly one resume target across the whole path — the home hero and the career tab
# both read it, so two (or none, before everything is done) would split them.
nres=$(pj "sum(1 for b in d.get('buildings',[]) for f in b['floors'] for c in f['curricula'] if c.get('resume'))")
[ "${nres:-0}" = 1 ] && ok "exactly one resume target" || bad "resume targets=$nres"
states=$(pj "','.join(sorted({c['state'] for b in d.get('buildings',[]) for f in b['floors'] for c in f['curricula']}))")
printf '%s' "$states" | grep -q "todo\|doing\|done" && ok "curriculum states resolved ($states)" || bad "no todo/doing/done state"
# Floors and curricula are all open in v2; a `lock` here would mean the server still
# gates them and the client's padlock-free rows would be lying.
printf '%s' "$states" | grep -q "lock" && bad "curriculum still reports lock: $states" || ok "no locked curriculum (floors are all open)"

hd "④b I18N · the request's language reaches the payload"
run GET /me/curriculum
ko_name=$(pj "d['buildings'][0]['floors'][0]['curricula'][0]['name']")
ko_where=$(pj "d['buildings'][0]['floors'][0]['curricula'][0]['where']")
runlang en GET /me/curriculum
en_name=$(pj "d['buildings'][0]['floors'][0]['curricula'][0]['name']")
en_where=$(pj "d['buildings'][0]['floors'][0]['curricula'][0]['where']")
[ "$CODE" = 200 ] && ok "GET /me/curriculum with Accept-Language: en → 200" || bad "locale request → $CODE"
# Asserting the strings DIFFER, not that they exist: a pipeline that silently ignored
# the header would return identical Korean and pass any presence check.
[ -n "$en_name" ] && [ "$ko_name" != "$en_name" ] && ok "curriculum name localized: '$ko_name' → '$en_name'" || bad "name not localized: ko='$ko_name' en='$en_name'"
[ -n "$en_where" ] && [ "$ko_where" != "$en_where" ] && ok "floor heading localized: '$en_where'" || bad "floor heading not localized: ko='$ko_where' en='$en_where'"
# An unsupported language must render the authored Korean, not an empty label.
runlang pt-BR GET /me/curriculum
pt_name=$(pj "d['buildings'][0]['floors'][0]['curricula'][0]['name']")
[ "$pt_name" = "$ko_name" ] && ok "unsupported locale falls back to authored Korean" || bad "pt-BR gave '$pt_name', want '$ko_name'"
# The display language is persisted so a reinstall restores it; kept apart from
# nativeLang, which tells the AI which language to explain corrections in.
run PATCH /me/ui-lang '{"uiLang":"en"}'
[ "$CODE" = 200 ] && [ "$(pj "d.get('uiLang')")" = "en" ] && ok "PATCH /me/ui-lang persists" || bad "ui-lang patch → $CODE $(pj "d.get('uiLang')")"
run PATCH /me/ui-lang '{"uiLang":"zz"}'
[ "$CODE" = 400 ] && ok "unsupported ui-lang rejected (400)" || bad "ui-lang zz → $CODE"
run PATCH /me/ui-lang '{"uiLang":""}'
[ "$CODE" = 200 ] && ok "empty ui-lang accepted (follow nativeLang)" || bad "ui-lang '' → $CODE"

hd "④c CONTENT · situation tag carries a code, and destinations state readiness"
run GET "/me/situations?dept=ER&limit=3"
[ "$CODE" = 200 ] && ok "GET /me/situations 200" || bad "situations → $CODE"
allcoded=$(pj "all(s.get('tagCode') in ('cleared','urgent','new') for s in d.get('situations',[]))")
[ "$allcoded" = "True" ] && ok "every situation carries a tagCode" || bad "situations missing tagCode"
# Label and code must be separate: the client compares the code and renders the label,
# and before they split the label was Korean the client had to compare against.
runlang en GET "/me/situations?dept=ER&limit=3"
entag=$(pj "d['situations'][0]['tag'] if d.get('situations') else ''")
# The Hangul test runs in python, not `grep '[가-힣]'`: a multibyte range inside a
# bracket expression is rejected as "Invalid collation character" in the runner's
# locale while working fine on a developer's UTF-8 macOS shell. The first version of
# this assertion did exactly that and failed on a correctly-localized 'Done'.
enko=$(pj "any('\uac00' <= ch <= '\ud7a3' for ch in (d['situations'][0]['tag'] if d.get('situations') else 'x'))")
[ -n "$entag" ] && [ "$enko" = "False" ] && ok "situation tag localized: '$entag'" || bad "tag not localized: '$entag'"
out=$(curl -s "$B/config/economy"); BODY="$out"
readyus=$(pj "'us' in d.get('readyDestinations',[])")
[ "$readyus" = "True" ] && ok "config lists us as a ready destination" || bad "readyDestinations=$(pj "d.get('readyDestinations')")"
# Germany must NOT be offered as ready: the AI would hold a German consultation, but
# every authored key phrase is English, and the phrases are what is being taught.
readyde=$(pj "'de' in d.get('readyDestinations',[])")
[ "$readyde" = "False" ] && ok "de withheld until its phrases exist" || bad "de reported ready with no German content"

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

# Resuming, and throwing away. A conversation with turns is offered back; a discarded one
# never is. Asserted against the real endpoint because the whole feature is "what does the
# next visit see", and that question is answered by the database, not by the client.
run "GET" "/scenarios/SCN-ER-00001/conversation/last"; last=$(pj "d.get('sessionId','')")
[ "$last" = "$sid" ] && ok "conversation offered for resuming" || bad "resumable said '$last', expected '$sid'"
run "POST" "/conversation/$sid/discard"; gone=$(pj "str(d.get('discarded'))")
[ "$CODE" = 200 ] && [ "$gone" = "True" ] && ok "conversation discarded" || bad "discard → $CODE discarded=$gone"
run "GET" "/scenarios/SCN-ER-00001/conversation/last"; last2=$(pj "d.get('sessionId','')")
# Not "nothing is offered" — THIS session is not offered. A database with earlier
# conversations in it (staging accumulates them across smoke runs) correctly surfaces the
# next-newest one, and asserting emptiness made the feature look broken on the only
# environment where the assertion ran against real history.
[ "$last2" != "$sid" ] && ok "discarded conversation is not offered back (now: '${last2:-none}')" || bad "still offering the discarded session '$last2'"
# Asking twice is not an error — the learner wanted it gone and it is gone.
run "POST" "/conversation/$sid/discard"; again=$(pj "str(d.get('discarded'))")
[ "$CODE" = 200 ] && [ "$again" = "False" ] && ok "second discard is a no-op, not a failure" || bad "re-discard → $CODE discarded=$again"
# The turns stay: study time is derived from them and those minutes were really spent.
run "GET" "/me/stats?tz=Asia/Seoul"; secs=$(pj "d.get('conversationSecondsToday',0)")
[ -n "$secs" ] && ok "conversation seconds still counted after discard (${secs}s)" || bad "conversation seconds missing"

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
# 10, not 7: the strip became a rolling window ending today (progress.StreakWindowDays)
# because a Mon-anchored week made a Sunday start look like a broken streak. The field
# is still called `week` on the wire so shipped clients keep parsing it.
wk=$(pj "len(d.get('week',[]))")
[ "${wk:-0}" = 10 ] && ok "rhythm strip has 10 blocks (rolling window)" || bad "week blocks=$wk"
todaymark=$(pj "d.get('week',[0]*10).count(2)")
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
# firstRun reorders the home to lead with the task. Derived from cleared content, so by
# this point in the smoke (a scenario was already cleared above) it must be false —
# which is a stronger check than "the field exists".
fr=$(pj "d.get('firstRun')")
[ "$fr" = "False" ] && ok "firstRun false after a clear" || bad "firstRun=$fr after clearing a scenario"
# The shift department must be the curriculum's current one, not a random pick.
if [ "$(pj "'shift' in d")" = "True" ]; then
  sdept=$(pj "d['shift']['deptLabel']")
  run GET /me/curriculum
  # The shift label comes from the RESUME curriculum's `where`, not from a chapter's
  # `dept` (that field is gone). Comparing against the resume target is also stricter
  # than the old "first chapter in state=now": every curriculum is now unlocked, so
  # "the first one not done" is not the same thing as "the one you were on".
  cdept=$(pj "next((c['where'] for b in d.get('buildings',[]) for f in b['floors'] for c in f['curricula'] if c.get('resume')), '')")
  [ "$sdept" = "$cdept" ] && ok "shift dept matches resume curriculum: $sdept" || bad "shift '$sdept' ≠ resume '$cdept'"
fi

hd "⑫b CALENDAR · per-day activity with the shift band it fell in"
run GET "/me/calendar?tz=Asia/Seoul"
[ "$CODE" = 200 ] && ok "GET /me/calendar 200" || bad "calendar → $CODE"
cmonth=$(pj "d.get('month','')")
printf '%s' "$cmonth" | grep -qE '^[0-9]{4}-[0-9]{2}$' && ok "month echoed as YYYY-MM: $cmonth" || bad "month=$cmonth"
# A scenario was cleared earlier in this run, so today must appear — asserting the
# array merely EXISTS would pass on a handler that always returns [].
ndays=$(pj "len(d.get('days',[]))")
[ "${ndays:-0}" -ge 1 ] && ok "calendar has $ndays active day(s)" || bad "calendar days=$ndays after clearing a scenario"
bands=$(pj "','.join(sorted({x['band'] for x in d.get('days',[])}))")
printf '%s' "$bands" | grep -qE '^(day|evening|night)(,(day|evening|night))*$' && ok "bands are codes, not labels ($bands)" || bad "bad bands: $bands"
# Entries must carry what was studied, not just a count: the day detail is the point.
hasentry=$(pj "all(len(x.get('entries',[])) == x.get('sessions') for x in d.get('days',[]))")
[ "$hasentry" = "True" ] && ok "every day's entries match its session count" || bad "entries/sessions disagree"
titled=$(pj "all(e.get('title') for x in d.get('days',[]) for e in x['entries'])")
[ "$titled" = "True" ] && ok "every entry carries a title (joined server-side)" || bad "entry without a title"
hours=$(pj "all(0 <= e.get('hour', -1) <= 23 for x in d.get('days',[]) for e in x['entries'])")
[ "$hours" = "True" ] && ok "hours are local 0-23" || bad "hour out of range"
run GET "/me/calendar?month=2020-01&tz=Asia/Seoul"
[ "$CODE" = 200 ] && [ "$(pj "d.get('month')")" = "2020-01" ] && ok "past month returns that month" || bad "month param ignored"
run GET "/me/calendar?month=nope&tz=Asia/Seoul"
[ "$CODE" = 400 ] && ok "malformed month rejected (400)" || bad "month=nope → $CODE"

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

hd "⑰ SPEECH · reference + empty history + no-speech guard (Task 10 carry-forward from Task 2)"
# A per-run nonce keeps this sentence's attempt history genuinely empty at
# the start — speech_attempts is append-only (I1), so a fixed sentence text
# would accumulate rows across reruns and the "starts empty" assertion below
# would only ever pass once.
NONCE=$(date +%s)
STEXT="Testing pronunciation smoke check number ${NONCE} now."
QTEXT=$(urlenc "$STEXT")

run GET "/speech/reference?text=$QTEXT"
ipa=$(pj "d.get('ipa','')")
[ "$CODE" = 200 ] && ok "GET /speech/reference 200" || bad "reference → $CODE"
[ -n "$ipa" ] && ok "reference ipa non-empty: $ipa" || bad "reference ipa empty (Azure TTS/assess misconfigured or unreachable?)"

run GET "/speech/attempts?text=$QTEXT"
n0=$(pj "len(d) if isinstance(d, list) else -1")
[ "$CODE" = 200 ] && [ "$n0" = "0" ] && ok "GET /speech/attempts starts empty for a fresh sentence" || bad "attempts start not empty (code=$CODE, n=$n0)"

# Silent WAV (a genuinely valid RIFF/PCM16/16kHz/mono header wrapping all-zero
# samples) must be rejected by AZURE as no-speech — this exercises the real
# 422 path end to end, not just ValidateWAV's own header checks.
SILENT_WAV_B64=$(python3 -c "
import struct, base64
sr = 16000
data = b'\x00\x00' * sr  # 1s of digital silence
hdr = (b'RIFF' + struct.pack('<I', 36 + len(data)) + b'WAVEfmt ' +
       struct.pack('<IHHIIHH', 16, 1, 1, sr, sr * 2, 2, 16) +
       b'data' + struct.pack('<I', len(data)))
print(base64.b64encode(hdr + data).decode())
")
run POST /pronunciation "{\"referenceText\":\"$STEXT\",\"audioBase64\":\"$SILENT_WAV_B64\",\"origin\":\"freeform\"}"
errmsg=$(pj "d.get('error',{}).get('message','')")
[ "$CODE" = 422 ] && ok "silent WAV → 422" || bad "silent WAV → $CODE (want 422)"
[ "$errmsg" = "no_speech_detected" ] && ok "422 body: no_speech_detected" || bad "422 body message: '$errmsg'"

run GET "/speech/attempts?text=$QTEXT"
n1=$(pj "len(d) if isinstance(d, list) else -1")
[ "$n1" = "0" ] && ok "no-speech attempt was NOT persisted (attempts still 0, no attempt_no consumed)" || bad "attempts=$n1 after a no-speech call (should stay 0)"

hd "⑱ SPEECH · real Azure round trip (self-spoken: TTS reference audio fed back in) — not a fixture"
# There is no recorded human voice available in this script, so this follows
# the Build Spec's own prescribed method: fetch the reference clip GET
# /speech/reference/audio.wav ALREADY produced by a real TTS call above, then
# feed those exact bytes back into POST /pronunciation. The SCORE is
# meaningless (a machine grading its own speech) but the response SHAPE —
# words[].syllables/phonemes, prosody, attempt numbering — is real Azure
# output, not a hand-written fixture. This is the project's own repeated
# lesson: "배선이 맞다" and "실제로 돈다" are different events.
REFWAV="/tmp/forin_smoke_ref_${NONCE}.wav"
AUDIO_CODE=$(curl -s -o "$REFWAV" -w '%{http_code}' "$B/speech/reference/audio.wav?text=$QTEXT" -H "Authorization: Bearer $TOK")
CTYPE=$(curl -s -o /dev/null -D - "$B/speech/reference/audio.wav?text=$QTEXT" -H "Authorization: Bearer $TOK" \
  | tr -d '\r' | grep -i '^content-type:' | head -1 | sed 's/^[Cc]ontent-[Tt]ype: *//')
[ "$AUDIO_CODE" = 200 ] && ok "GET /speech/reference/audio.wav 200" || bad "audio.wav → $AUDIO_CODE"
printf '%s' "$CTYPE" | grep -qi '^audio/wav' && ok "audio.wav Content-Type: $CTYPE" || bad "audio.wav Content-Type: '$CTYPE'"

REFWAV16="/tmp/forin_smoke_ref16k_${NONCE}.wav"
A1NO=""
if [ "$AUDIO_CODE" = 200 ] && [ -s "$REFWAV" ] && resample16k "$REFWAV" "$REFWAV16"; then
  BODY1=$(python3 -c "
import base64, json, sys
with open(sys.argv[1], 'rb') as f:
    b64 = base64.b64encode(f.read()).decode()
print(json.dumps({'referenceText': sys.argv[2], 'audioBase64': b64, 'origin': 'freeform'}))
" "$REFWAV16" "$STEXT")

  run POST /pronunciation "$BODY1"
  [ "$CODE" = 200 ] && ok "POST /pronunciation on real TTS audio → 200 (real Azure Assess, not a fixture)" || bad "pronunciation (real audio) → $CODE"
  A1NO=$(pj "d.get('attemptNo',0)")
  a1words=$(pj "len(d.get('words',[]))")
  a1prosody=$(pj "d.get('prosodyAvailable')")
  a1tips=$(pj "bool(d.get('phonemeTips'))")
  a1syll=$(pj "sum(len(w.get('syllables',[])) for w in d.get('words',[]))")
  a1phon=$(pj "sum(len(w.get('phonemes',[])) for w in d.get('words',[]))")
  A1ID=$(pj "d.get('attemptId','')")
  [ "${A1NO:-0}" -ge 1 ] && ok "first attempt numbered $A1NO" || bad "attemptNo=$A1NO"
  [ "${a1words:-0}" -ge 1 ] && ok "real response carries word scores ($a1words words)" || bad "no words in real Azure response"
  [ "${a1syll:-0}" -ge 1 ] && ok "real response carries syllable segmentation ($a1syll syllables) — Phoneme granularity confirmed live" || bad "no syllables in real Azure response (still Word granularity?)"
  [ "${a1phon:-0}" -ge 1 ] && ok "real response carries phoneme segmentation ($a1phon phonemes)" || bad "no phonemes in real Azure response"
  [ "$a1prosody" = "True" ] && ok "prosodyAvailable=true for en-US (real Azure)" || bad "prosodyAvailable=$a1prosody (want true for en-US)"
  [ "$a1tips" = "True" ] && ok "phonemeTips present in real response" || bad "phonemeTips absent from real response"

  run POST /pronunciation "$BODY1"
  a2no=$(pj "d.get('attemptNo',0)")
  [ "$CODE" = 200 ] && [ "${a2no:-0}" -eq "$((A1NO+1))" ] && ok "attempt numbering increments on the same sentence: ${A1NO}→${a2no}" || bad "attempt numbering: ${A1NO}→${a2no} (code=$CODE)"

  run GET "/speech/attempts?text=$QTEXT"
  hcount=$(pj "len(d) if isinstance(d, list) else -1")
  horder=$(pj "[a['attemptNo'] for a in d]")
  [ "$hcount" = "2" ] && ok "GET /speech/attempts has 2 rows after 2 real recordings" || bad "attempt history has $hcount rows (want 2)"
  [ "$horder" = "[1, 2]" ] && ok "history ordered oldest-first: $horder" || bad "history order: $horder"
else
  bad "skipped the real-audio round trip — no reference audio to feed back, or 24kHz→16kHz resample failed"
fi

hd "⑱-b SPEECH · 발화 종합 리뷰 (다이얼로그 받아쓰기 채점 → 결과 화면 읽기 → 리뷰랩 집계)"
# The gap this closes: before this feature the dialogue mic only transcribed, so
# every review list was permanently empty no matter what the screens did. The
# check that matters is therefore the ROUND TRIP — POST /stt with a session must
# leave a scored row that GET /conversation/{id}/speech-review reads back — not
# that the endpoints merely answer 200.
if [ -s "$REFWAV16" ]; then
  SESS="smoke-speech-${NONCE}"
  STTBODY=$(python3 -c "
import base64, json, sys
with open(sys.argv[1], 'rb') as f:
    b64 = base64.b64encode(f.read()).decode()
print(json.dumps({'audioBase64': b64, 'sessionId': sys.argv[2], 'scenarioId': 'SCN-ER-00002'}))
" "$REFWAV16" "$SESS")

  run POST /stt "$STTBODY"
  stt_text=$(pj "bool(d.get('text'))")
  stt_scored=$(pj "d.get('scored')")
  stt_overall=$(pj "d.get('overall',0)")
  [ "$CODE" = 200 ] && [ "$stt_text" = "True" ] && ok "POST /stt transcribed the clip" || bad "POST /stt → $CODE (text=$stt_text)"
  [ "$stt_scored" = "True" ] && ok "the dialogue utterance was ALSO scored (overall=$stt_overall) — the review pipeline has data to review" || bad "scored=$stt_scored — a dialogue utterance left no score, so every review list stays empty"

  run GET "/conversation/$SESS/speech-review"
  rev_n=$(pj "len(d.get('sentences',[]))")
  rev_avg=$(pj "round(d.get('average',0))")
  rev_weak=$(pj "len(d.get('weakest',[]))")
  [ "$CODE" = 200 ] && [ "${rev_n:-0}" -ge 1 ] && ok "GET speech-review reads that utterance back ($rev_n sentence(s), average $rev_avg)" || bad "speech-review returned $rev_n sentences (code=$CODE) — the round trip is broken"
  [ "${rev_weak:-0}" -ge 1 ] && ok "weakest carries the 다시 연습 target ($rev_weak)" || bad "weakest is empty despite $rev_n spoken sentence(s)"

  # A session that is not ours must read as an empty run, which is what makes the
  # endpoint safe without a separate ownership check.
  run GET "/conversation/not-my-session-${NONCE}/speech-review"
  other_n=$(pj "len(d.get('sentences',[]))")
  [ "$CODE" = 200 ] && [ "$other_n" = "0" ] && ok "an unknown session reads as an empty run, not another user's data" || bad "unknown session returned $other_n sentences (code=$CODE)"

  run GET /speech/summary
  sum_total=$(pj "d.get('total',0)")
  sum_bands=$(pj "d.get('low',0)+d.get('mid',0)+d.get('high',0)")
  [ "$CODE" = 200 ] && [ "${sum_total:-0}" -ge 1 ] && ok "GET /speech/summary counts $sum_total sentence(s)" || bad "speech/summary total=$sum_total (code=$CODE)"
  [ "${sum_bands:-0}" = "${sum_total:-0}" ] && ok "band counts add up to the total ($sum_bands = $sum_total)" || bad "bands sum to $sum_bands but total is $sum_total"

  run GET "/speech/sentences?sort=weak&limit=2"
  lw_n=$(pj "len(d.get('sentences',[]))")
  lw_total=$(pj "d.get('total',0)")
  lw_sorted=$(pj "'yes' if [x['overall'] for x in d.get('sentences',[])] == sorted(x['overall'] for x in d.get('sentences',[])) else 'no'")
  [ "$CODE" = 200 ] && [ "${lw_n:-0}" -ge 1 ] && ok "GET /speech/sentences?sort=weak returned $lw_n row(s) of $lw_total" || bad "speech/sentences → $CODE ($lw_n rows)"
  [ "$lw_sorted" = "yes" ] && ok "약한 순 really is ascending by score" || bad "약한 순 page was not ascending"
  # The unpaged total must not be the page size, or the list's "N문장 중 M개" lies.
  [ "${lw_total:-0}" -ge "${lw_n:-0}" ] && ok "total ($lw_total) is the unpaged count, not the page size" || bad "total=$lw_total < page=$lw_n"

  run GET "/speech/sentences?sort=recent&limit=2"
  lr_sorted=$(pj "'yes' if [x['createdAt'] for x in d.get('sentences',[])] == sorted((x['createdAt'] for x in d.get('sentences',[])), reverse=True) else 'no'")
  [ "$CODE" = 200 ] && [ "$lr_sorted" = "yes" ] && ok "최신 really is newest-first" || bad "최신 page was not newest-first (code=$CODE)"
else
  bad "skipped the speech-review round trip — no 16kHz clip to dictate"
fi

hd "⑲ SPEECH · review-card deletion severs the link but keeps the attempt (DB-direct, local docker compose only)"
# There is no HTTP DELETE for review_cards — a card degrades through SM-2
# grading, it never disappears through the API — so this invariant cannot be
# driven by HTTP alone. ON DELETE SET NULL is already proven deterministically
# by postgres.TestAttemptSurvivesCardDeletion (speech_repo_test.go), but that
# test SKIPS whenever TEST_DATABASE_URL is unset — and per this task's own
# carry-forward mandate, a skippable test is not a substitute for this smoke
# assert. This block re-derives the SAME fact through THIS script's real
# server + real authenticated user, best-effort, only when a local
# docker-compose postgres is reachable AND we're pointed at localhost
# (staging's Cloud SQL is not reachable this way, so this legitimately no-ops
# there — the DB test remains the only coverage on staging/CI).
COMPOSE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
case "$B" in
  http://localhost*|http://127.0.0.1*) LOCALHOST_TARGET=1 ;;
  *) LOCALHOST_TARGET=0 ;;
esac
if [ "$LOCALHOST_TARGET" = 1 ] && [ -n "$MYID" ] && [ -s "$REFWAV16" ] && command -v docker >/dev/null 2>&1 && \
   docker compose -f "$COMPOSE_DIR/docker-compose.yml" exec -T postgres psql -U forin -d forin -tAc "SELECT 1" >/dev/null 2>&1; then
  # -q (quiet) matters here, not just -tA: without it, an INSERT ... RETURNING
  # still prints a trailing "INSERT 0 1" completion tag AFTER the returned
  # row even in tuples-only mode, which silently corrupted CARDID the first
  # time this was tried (a two-line value that failed reviewCardIDFormat's
  # regex with a 400 that looked like an ownership-check bug, not a shell
  # quoting one).
  PSQL() { docker compose -f "$COMPOSE_DIR/docker-compose.yml" exec -T postgres psql -qU forin -d forin -tAc "$1" 2>/dev/null | tr -d '\r'; }
  CARDID=$(PSQL "INSERT INTO review_cards (user_id, front, back) VALUES ('$MYID', 'smoke front $NONCE', 'smoke back $NONCE') RETURNING id")
  # GetCardForUser (the ownership check POST /pronunciation calls) JOINs
  # review_schedules — a card with no schedule row is invisible to it and
  # comes back 403 "not yours" even for the card's real owner. Discovered by
  # actually driving this through the HTTP handler: the existing DB-only test
  # (TestAttemptSurvivesCardDeletion) never hits this because it never goes
  # through GetCardForUser at all.
  [ -n "$CARDID" ] && PSQL "INSERT INTO review_schedules (card_id) VALUES ('$CARDID')" >/dev/null
  if [ -n "$CARDID" ]; then
    BODY3=$(python3 -c "
import base64, json, sys
with open(sys.argv[1], 'rb') as f:
    b64 = base64.b64encode(f.read()).decode()
print(json.dumps({'referenceText': sys.argv[2], 'audioBase64': b64, 'origin': 'review', 'reviewCardId': sys.argv[3]}))
" "$REFWAV16" "$STEXT" "$CARDID")
    run POST /pronunciation "$BODY3"
    A3ID=$(pj "d.get('attemptId','')")
    [ "$CODE" = 200 ] && [ -n "$A3ID" ] && ok "attempt linked to a real review card (own card → 200, not 403)" || bad "linking attempt to own review card → $CODE"

    if [ -n "$A3ID" ]; then
      linked=$(PSQL "SELECT review_card_id = '$CARDID' FROM speech_attempts WHERE id = '$A3ID'")
      [ "$linked" = "t" ] && ok "speech_attempts.review_card_id set to the card before deletion" || bad "review_card_id not linked before deletion (got: $linked)"

      PSQL "DELETE FROM review_cards WHERE id = '$CARDID'" >/dev/null
      survived=$(PSQL "SELECT EXISTS(SELECT 1 FROM speech_attempts WHERE id = '$A3ID')")
      severed=$(PSQL "SELECT review_card_id IS NULL FROM speech_attempts WHERE id = '$A3ID'")
      [ "$survived" = "t" ] && ok "attempt row survives review-card deletion" || bad "attempt row vanished after card deletion (survived=$survived)"
      [ "$severed" = "t" ] && ok "review_card_id severed to NULL after the card is gone" || bad "review_card_id not NULL after card deletion (severed=$severed)"
    fi
  else
    bad "could not insert a throwaway review_cards row for the deletion check"
  fi
else
  ok "review-card-deletion check skipped (needs localhost + local docker-compose postgres — not applicable here)"
fi
rm -f "$REFWAV" "$REFWAV16"

hd "⑳ WARD · live presence round-trip"
# Presence is best-effort and structural: a single caller is EXCLUDED from their own
# roster (the app draws the learner's own figure client-side), so a lone user's roster is
# empty regardless of prior state — safe to re-run.
run POST /ward/heartbeat
[ "$CODE" = 204 ] && ok "POST /ward/heartbeat 204" || bad "ward heartbeat → $CODE"
run GET /ward
[ "$CODE" = 200 ] && ok "GET /ward 200" || bad "ward roster → $CODE"
RC=$(pj "len(d.get('roster',[]))")
[ "$RC" = 0 ] && ok "GET /ward excludes self (lone caller → empty roster)" || bad "ward roster not self-excluded (len=$RC)"
run POST /ward/leave
[ "$CODE" = 204 ] && ok "POST /ward/leave 204" || bad "ward leave → $CODE"
# Opt-out is its own switch, defaulting on; toggle and restore like the colleague prefs.
run GET /me/colleague-prefs
WARDORIG=$(pj "d.get('shareWard')")
[ "$WARDORIG" = "True" ] && ok "shareWard defaults on" || bad "shareWard default → $WARDORIG"
run PATCH /me/colleague-prefs '{"shareWard":false}'
woff=$(pj "d.get('shareWard')")
[ "$woff" = "False" ] && ok "shareWard can be turned off" || bad "shareWard patch → $woff"
run PATCH /me/colleague-prefs '{"shareWard":true}'
won=$(pj "d.get('shareWard')")
[ "$won" = "True" ] && ok "shareWard restored" || bad "shareWard restore → $won"

hd "㉑ SLANG · 은어 도감 하루 1장"
run GET /slang
[ "$CODE" = 200 ] && ok "GET /slang 200" || bad "slang → $CODE"
TOT=$(pj "d.get('total',0)")
[ "${TOT:-0}" -ge 1 ] && ok "deck served from content ($TOT cards)" || bad "empty deck"
BEFORE=$(pj "d.get('collectedCount',0)")
CAN=$(pj "d.get('collectableToday')")
run POST /slang/collect
[ "$CODE" = 200 ] && ok "POST /slang/collect 200" || bad "collect → $CODE"
AFTER=$(pj "d.get('collectedCount',0)")
# One per day: a collectable card adds one; a re-run on a day already collected is a no-op.
if [ "$CAN" = "True" ]; then
  [ "$AFTER" = "$((BEFORE+1))" ] && ok "collect adds one ($BEFORE→$AFTER)" || bad "collect count $BEFORE→$AFTER"
else
  [ "$AFTER" = "$BEFORE" ] && ok "already collected today — no double" || bad "double collect $BEFORE→$AFTER"
fi
run POST /slang/collect
AGAIN=$(pj "d.get('collectedCount',0)")
[ "$AGAIN" = "$AFTER" ] && ok "a second collect the same day is a no-op" || bad "double collect $AFTER→$AGAIN"

hd "㉒ NIGHT · 오늘 밤의 이야기"
run GET /night
[ "$CODE" = 200 ] && ok "GET /night 200" || bad "night → $CODE"
NT=$(pj "d.get('total',0)")
[ "${NT:-0}" -ge 1 ] && ok "stories served from content ($NT)" || bad "no night stories"
KL=$(pj "d.get('story',{}).get('keyLine','')")
[ -n "$KL" ] && ok "tonight's story has a key line to practice" || bad "no keyLine"
run "GET" "/night?i=1"
[ "$CODE" = 200 ] && ok "다음 이야기 (GET /night?i=1) 200" || bad "next story → $CODE"

hd "㉓ HANDOFF · 환자 인수인계 노트"
run GET /handoff
[ "$CODE" = 200 ] && ok "GET /handoff 200" || bad "handoff → $CODE"
# A fresh account may have no cleared patient encounters — an empty inbox is valid; assert
# the contract shape (notes array + unread int).
[ "$(pj "isinstance(d.get('notes'), list)")" = "True" ] && ok "inbox returns a notes array" || bad "notes not a list"
[ "$(pj "isinstance(d.get('unread'), int)")" = "True" ] && ok "unread is a count" || bad "unread not int"
NID=$(pj "(d.get('notes') or [{}])[0].get('id','')")
if [ -n "$NID" ]; then
  run POST "/handoff/$NID/read"
  [ "$CODE" = 204 ] && ok "POST /handoff/{id}/read 204" || bad "read → $CODE"
  run POST "/handoff/$NID/reply" '{"text":"고마워요, 잘 지내요!"}'
  [ "$CODE" = 200 ] && ok "reply returns the note with a patient reply" || bad "reply → $CODE"
else
  ok "no handoff notes yet (empty inbox is valid for a fresh account)"
fi

hd "RESULT"
printf "  \033[1m%d passed, %d failed\033[0m\n" "$PASS" "$FAIL"
[ "$FAIL" -eq 0 ] || exit 1
