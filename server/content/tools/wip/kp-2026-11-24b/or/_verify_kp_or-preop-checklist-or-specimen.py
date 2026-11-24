"""정본 seed(nurse/topics/or.yaml)의 keyPhrases를 메모리에서만 새 문장으로 바꿔 verify_one_theme를 돌린다(파일은 안 바꿈).
    python3 _verify_kp_or-preop-checklist-or-specimen.py <주제.yaml>"""
import os, sys, yaml
sys.path.insert(0, '/Users/ywyeom/private/forin/server/content/tools')
import verify_one_theme as vot

KP = {
    'or-preop-checklist': {
        "I'm activating the massive transfusion protocol.": "I'm calling the blood bank to activate the massive transfusion protocol.",
        "I'm giving it now and documenting the time.": "Anesthesia is giving it now, and I'll document the time.",
        "I'm calling the surgeon and anesthesia right now.": "I'm calling the surgeon right now.",
        "I'll let the surgeon and anesthesia know.": "I'll let the surgeon know.",
        "I'll adjust the timing and document it.": "Let's adjust the timing, and I'll document it.",
    },
    'or-specimen': {
        "I'll hand-carry it to pathology myself.": "I'll make sure it's hand-carried to pathology.",
        "I'll fix any discrepancy before sending.": "We'll fix any discrepancy before sending.",
        "Let's re-verify identity and relabel now.": "Let's re-verify identity, report it, and then relabel.",
        'Call me the moment you have a result.': 'Call the room the moment you have a result.',
        'This is gallbladder, correct?': 'This is the gallbladder, correct?',
        'Does it go on ice or in a specific media?': 'Does it go on ice or in specific media?',
    },
}


_orig = vot.yaml.safe_load
hits = {}


def patched(stream):
    data = _orig(stream)
    if isinstance(data, list) and data and isinstance(data[0], dict) and 'keyPhrases' in data[0]:
        for s in data:
            m = KP.get(s.get('theme'))
            if not m:
                continue
            s['keyPhrases'] = [m.get(k, k) for k in s['keyPhrases']]
            for k in s['keyPhrases']:
                if k in m.values():
                    hits[(s['theme'], k)] = True
    return data


class Shim:
    def __getattr__(self, n):
        return getattr(yaml, n)
    safe_load = staticmethod(patched)


vot.yaml = Shim()
rc = vot.main('or', sys.argv[1])
theme = yaml.safe_load(open(sys.argv[1]))['theme']
print(f'  (메모리에서 바꿔 넣은 keyPhrase {sum(1 for t, _ in hits if t == theme)}/{len(KP[theme])}건)')
sys.exit(rc)
