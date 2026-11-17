"""메모리 안에서 정본 seed keyPhrases를 새 문장으로 바꿔 넣고 verify_one_theme를 돌린다(파일은 안 바꿈)."""
import sys, yaml
sys.path.insert(0, '/Users/ywyeom/private/forin/server/content/tools')
SWAP = {
 'core-language-or': {
  'The interpreter will explain the consent in your language.': 'The surgeon will explain the consent through the interpreter.',
  'The interpreter will go over your fasting instructions.': "I'll go over your fasting instructions through the interpreter.",
  'The interpreter will explain how the anesthesia works.': 'The anesthesia team will explain how it works through the interpreter.',
  'Patient safety justifies proceeding under emergency provisions.': 'The surgeon says patient safety justifies proceeding under emergency provisions.',
  'Keep it simple so nothing is misunderstood.': "I'll keep it simple so nothing is misunderstood.",
  'Can you confirm the patient understood that correctly?': "Let's use teach-back to confirm she understood that correctly.",
 },
 'or-bleeding': {
  "I'm activating the massive transfusion protocol.": "I'm calling the blood bank to activate the massive transfusion protocol.",
  'Pressure has crashed — pushing pressors now.': 'Pressure has crashed — anesthesia is pushing pressors now.',
  "I've got fluids running wide open if we need it.": "I've got fluids ready to run wide open if we need it.",
  "He's coagulopathic — I need FFP and platelets now.": "He looks coagulopathic — do you want FFP and platelets now?",
  "Let's pack and shift to damage control.": 'Should we pack and shift to damage control?',
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

