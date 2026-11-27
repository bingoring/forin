"""메모리 안에서 정본 seed keyPhrases를 새 문장으로 바꿔 넣고 verify_one_theme를 돌린다(파일은 안 바꿈)."""
import sys, yaml
sys.path.insert(0, '/Users/ywyeom/private/forin/server/content/tools')
SWAP = {
 'or-difficult-airway': {
  "Let's define plan A, B, and C before induction.": "Let's go over plan A, B, and C before induction.",
  "Oxygenation comes before intubation — let's bag him.": 'Oxygenation comes before intubation — can we bag him?',
  "Let's switch to the failed airway algorithm now.": 'Should we switch to the failed airway algorithm now?',
  'We move to emergency front-of-neck access now.': "Understood — we're moving to emergency front-of-neck access now.",
  'We go straight to front-of-neck access.': "Understood — we're going straight to front-of-neck access.",
  "I'll stabilize the larynx for you.": "I'll stabilize his head and neck for you.",
  'Push the airway rescue and prep for code.': "I'm prepping for a code — the crash cart is coming.",
  "Hand me the LMA — we're rescuing the airway.": "Here's the LMA — we're rescuing the airway.",
 },
 'or-preop-assessment': {
  'We should treat this as a full stomach — RSI it is.': "We should treat this as a full stomach — I'll set up for RSI.",
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
