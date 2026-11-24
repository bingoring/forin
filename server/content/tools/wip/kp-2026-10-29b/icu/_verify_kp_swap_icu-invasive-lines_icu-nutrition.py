"""메모리 안에서 정본 seed keyPhrases를 새 문장으로 바꿔 넣고 verify_one_theme를 돌린다(파일은 안 바꿈)."""
import sys, yaml
sys.path.insert(0, '/Users/ywyeom/private/forin/server/content/tools')
SWAP = {
 'icu-invasive-lines': {
  "His pressure is dropping — I'm activating the rapid response.": "His pressure is dropping — I need the physician at the bedside now.",
  "This looks like an air embolism — I'm calling the code team.": "This looks like an air embolism — I need the physician here now.",
  "I'll milk the tubing gently and reassess.": "I'll check the tubing for clots and kinks and reassess.",
  "Full barrier precautions are ready — gown, gloves, mask, drape.": "Full barrier precautions are ready — cap, mask, gown, gloves, drape.",
 },
 'icu-nutrition': {
  "We'll adjust insulin coverage as needed.": "We'll give insulin coverage as ordered.",
  "Let's adjust the insulin and recheck the glucose.": "Let's get the insulin adjusted and recheck the glucose.",
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
