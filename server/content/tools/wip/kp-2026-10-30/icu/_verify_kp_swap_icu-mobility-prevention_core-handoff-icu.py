"""메모리 안에서 정본 seed keyPhrases를 새 문장으로 바꿔 넣고 verify_one_theme를 돌린다(파일은 안 바꿈)."""
import sys, yaml
sys.path.insert(0, '/Users/ywyeom/private/forin/server/content/tools')
SWAP = {
 'icu-mobility-prevention': {
  "I'm giving high-flow oxygen and calling the rapid response.": "I'm giving high-flow oxygen and calling the provider to the bedside.",
 },
 'core-handoff-icu': {
  "Repeat her chest X-ray was ordered for placement.": "A repeat chest X-ray was ordered to rule out a pneumothorax.",
  "If two go off at once, call for help early.": "If two of them crash at once, call for help early.",
  "If his MAP drops below sixty-five, start pressors and call me.": "If his MAP drops below sixty-five, start pressors per the order and call me.",
  "Labs are due at four, and he's on a two-hourly neuro check.": "Labs are due at four, and he's on neuro checks every two hours.",
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
