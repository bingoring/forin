"""메모리 안에서 정본 seed keyPhrases를 새 문장으로 바꿔 넣고 verify_one_theme를 돌린다(파일은 안 바꿈)."""
import sys, yaml
sys.path.insert(0, '/Users/ywyeom/private/forin/server/content/tools')
SWAP = {
 'or-tourniquet': {
  'We use the smallest appropriate cuff.': 'We use the widest appropriate cuff.',
  'After reperfusion, the safe reinflation time resets shorter.': 'After reperfusion, we reset the timer for reinflation.',
  "We're at the maximum safe time — we need to deflate now.": "We're at the maximum safe time — do we deflate now?",
  'Surgeon, we cannot exceed this time.': "Surgeon, we're about to exceed this time.",
  'Anesthesia, do you need labs or treatment drawn up?': 'Anesthesia, do you need labs drawn or meds drawn up?',
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
