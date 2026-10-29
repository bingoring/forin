"""메모리 안에서 정본 seed keyPhrases를 새 문장으로 바꿔 넣고 verify_one_theme를 돌린다(파일은 안 바꿈)."""
import sys, yaml
sys.path.insert(0, '/Users/ywyeom/private/forin/server/content/tools')
SWAP = {
 'icu-gi-bleed': {
  "Yes, let's start the octreotide drip now.": "Yes, I'll start the octreotide drip as ordered.",
  "Activate MTP and get the cooler now.": "MTP is activated — I'll get the cooler now.",
  "Open the fluids wide and call for blood now.": "Let's run the ordered fluids and call for blood now.",
 },
 'icu-liver-failure': {
  "Let's correct with products just before the procedure.": "If products are ordered, we'll give them just before the procedure.",
  "We adjust it carefully based on your ammonia.": "We adjust it carefully based on your needs.",
  "Give the hypertonic saline and elevate his head.": "Give the hypertonic saline as ordered and elevate his head.",
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
