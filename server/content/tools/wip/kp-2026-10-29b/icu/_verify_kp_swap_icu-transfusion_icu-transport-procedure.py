"""메모리 안에서 정본 seed keyPhrases를 새 문장으로 바꿔 넣고 verify_one_theme를 돌린다(파일은 안 바꿈)."""
import sys, yaml
sys.path.insert(0, '/Users/ywyeom/private/forin/server/content/tools')
SWAP = {
 'icu-transfusion': {
  "I'm opening fluids wide and calling the code team.": "I'm starting a fluid bolus and calling the ICU doctor now.",
  "Stop the transfusion — this is TRALI, not overload.": "Stop the transfusion — this looks like TRALI, not overload.",
  "He's bleeding from every puncture site — this is DIC.": "He's bleeding from every puncture site — this looks like DIC.",
  "For mild hives, I'll pause and give an antihistamine.": "For mild hives, I'll pause it and ask the provider about an antihistamine.",
  "FFP replaces clotting factors, platelets treat thrombocytopenia.": "FFP replaces clotting factors, and platelets treat thrombocytopenia.",
 },
 'icu-transport-procedure': {
  "Start compressions the moment we clear the magnet.": "Start compressions now and keep going as we move her out.",
  "Bleeding is brisk — apply pressure and open fluids wide.": "Bleeding is brisk — apply pressure and get blood hanging.",
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
