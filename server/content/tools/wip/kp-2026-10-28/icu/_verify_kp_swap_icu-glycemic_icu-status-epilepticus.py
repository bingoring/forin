"""메모리 안에서 정본 seed keyPhrases를 새 문장으로 바꿔 넣고 verify_one_theme를 돌린다(파일은 안 바꿈)."""
import sys, yaml
sys.path.insert(0, '/Users/ywyeom/private/forin/server/content/tools')
SWAP = {
 'icu-glycemic': {
  "Recheck in five minutes and repeat if he's still low.": "Recheck in fifteen minutes and repeat if he's still low.",
  "Check his sugar now and start dextrose if he's dropping.": "Check his sugar now and get dextrose ready if he's dropping.",
  "Start dextrose and recheck his sugar immediately.": "Follow the hypoglycemia protocol and recheck his sugar immediately.",
  "Three lows means we need to review the whole regimen with the team.": "Three lows mean we need to review the whole regimen with the team.",
 },
 'icu-status-epilepticus': {
  "Start a pressor and give fluid to support his pressure.": "Let's start the ordered pressor and give fluid to support his pressure.",
  "Let's keep his pressure supported as we deepen the infusion.": "Let's keep his pressure supported as we deepen the sedation.",
  "If we find a cause, we correct it immediately.": "If we find a cause, we start correcting it right away.",
 },
}
orig = yaml.safe_load
n = [0]
def patched(stream, *a, **k):
    r = orig(stream, *a, **k)
    if isinstance(r, list) and r and isinstance(r[0], dict) and 'keyPhrases' in r[0]:
        for s in r:
            m = SWAP.get(s.get('theme'), {})
            kp = s.get('keyPhrases') or []
            for i, x in enumerate(kp):
                if x in m:
                    kp[i] = m[x]; n[0] += 1
    return r
yaml.safe_load = patched
import verify_one_theme
rc = verify_one_theme.main(sys.argv[1], sys.argv[2])
print('바꿔 넣은 keyPhrase', n[0])
sys.exit(rc)
