"""정본 seed(nurse/topics/or.yaml)의 keyPhrases를 메모리에서만 새 문장으로 바꿔 verify_one_theme를 돌린다(파일은 안 바꿈).
    python3 _verify_kp_core-family-or-or-emergency-open.py <주제.yaml>"""
import os, sys, yaml
sys.path.insert(0, '/Users/ywyeom/private/forin/server/content/tools')
import verify_one_theme as vot

D = '—'
KP = {
    'core-family-or': {
        'There was a complication during the surgery.': 'The surgeon wants to talk with you in person about the surgery.',
        "The team is managing it and she's stable right now.": "The team told me she's stable right now.",
        f"Let's sit down together {D} I have some difficult news.": f"Let's sit down together {D} the surgeon is coming to talk with you.",
        'I want to be honest with you about what happened.': "I'll be honest with you about what I know.",
        'Let me explain the options as clearly as I can.': "I'll make sure the options are explained as clearly as possible.",
        'Think about what he would have wanted.': 'Think about what he would want.',
    },
    'or-emergency-open': {
        "Let's pack and do a temporary closure.": f"Got it {D} we're packing and doing a temporary closure.",
        'I need FFP, platelets, and cryo now.': 'Do you want FFP, platelets, and cryo now?',
        f"She's oozing everywhere {D} this is DIC.": f"She's oozing everywhere {D} are we treating this as DIC?",
        'Activating the OB massive transfusion protocol.': 'Calling the blood bank to activate the OB massive transfusion protocol.',
        "You take the airway, I'll manage the transfusion.": "You take the airway, I'll coordinate the transfusion.",
        'Blood bank can send more within minutes.': 'Blood bank says they can send more within minutes.',
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
