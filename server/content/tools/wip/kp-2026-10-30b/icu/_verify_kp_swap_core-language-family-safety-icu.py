"""메모리 안에서 정본 seed keyPhrases를 새 문장으로 바꿔 넣고 verify_one_theme를 돌린다(파일은 안 바꿈)."""
import sys, yaml
sys.path.insert(0, '/Users/ywyeom/private/forin/server/content/tools')
SWAP = {
 'core-language-icu': {
  'The interpreter will explain the procedure fully.': 'The doctor will explain the procedure fully, through the interpreter.',
  'Blink twice for yes, once for no — is that okay?': 'Blink once for yes, twice for no — is that okay?',
  'The interpreter and ethics team can help us find common ground.': 'With the interpreter, the ethics team can help us find common ground.',
 },
 'core-family-icu': {
  "We'll involve the ethics committee to decide in his best interest.": "We'll involve the ethics committee to help decide what's in his best interest.",
  'Nothing is being hidden — let me go through everything with you.': "I'm not hiding anything from you — let me go through what I know with you.",
  'His condition is serious, and the next days are critical.': 'His condition is serious, and the next few days are critical.',
 },
 'core-safety-icu': {
  "Let's verify the drug, dose, rate, and pump settings together.": "Let's each verify the drug, dose, rate, and pump settings, then compare.",
  'Call for the rapid response and start oxygen.': 'Call the ICU physician now and increase his oxygen.',
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
