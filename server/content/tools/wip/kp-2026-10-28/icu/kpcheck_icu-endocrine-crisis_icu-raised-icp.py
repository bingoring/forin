"""정본 seed의 keyPhrases를 메모리 안에서만 새 문장으로 바꿔 verify_one_theme을 돌린다(정본은 건드리지 않음).
    python3 kpcheck_icu-endocrine-crisis_icu-raised-icp.py <주제>"""
import io, os, sys, yaml
HERE = os.path.dirname(os.path.abspath(__file__))
TOOLS = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
sys.path.insert(0, TOOLS)
import verify_one_theme as vot

KP = {
    'icu-endocrine-crisis': {
        "Check a stat glucose and push D50 now — he's unresponsive.":
            "Check a stat glucose, and if he's low, push D50 per protocol — he's unresponsive.",
        'Recheck the sugar in a few minutes and stay ready to repeat.':
            'Recheck the sugar in fifteen minutes and stay ready to repeat.',
        'We may need to slow the insulin if potassium keeps falling.':
            'We may need to hold the insulin if potassium falls below the protocol limit.',
        "Let's double-check the concentration and pump settings together.":
            "Let's each double-check the concentration and pump settings independently.",
        "We'll keep monitoring and give more if his stress level demands it.":
            "We'll keep monitoring and give more as ordered if his body needs it.",
        "Let's push the stress-dose steroid and start a pressor together now.":
            "Let's push the ordered stress-dose steroid and start the pressor together now.",
        'Call the intensivist — this is a true adrenal crisis.':
            'Call the intensivist — this looks like a true adrenal crisis.',
        'Bringing it down too fast can be risky, so we titrate carefully.':
            'Bringing it down too fast can be risky, so we adjust it carefully.',
        'We check your sugar, your ketones, and your blood acid every hour to keep you safe.':
            'We check your sugar every hour, and your ketones and blood acid often, to keep you safe.',
    },
    'icu-raised-icp': {
        'A blown pupil means herniation — give hypertonic and hyperventilate now.':
            'A blown pupil can mean herniation — give hypertonic and hyperventilate per protocol now.',
        "I'm draining the EVD and elevating his head immediately.":
            "I'm draining the EVD per parameters and elevating his head immediately.",
        'If it over-drained, we reposition and reassess immediately.':
            'If it over-drained, we clamp it, recheck the level, and notify neurosurgery immediately.',
        "I'm reversing any anticoagulation per protocol now.":
            "We're reversing any anticoagulation per protocol now.",
        'Its height is set to a reference point at his ear to drain correctly.':
            'Its height is set to a reference point near his ear, per protocol, so it drains correctly.',
        "One number is the pressure in his brain, the other is his brain's blood flow.":
            'One number is the pressure in his brain, the other is the pressure pushing blood into his brain.',
    },
}

theme = sys.argv[1]
mapping = KP[theme]
used = set()
_real = yaml.safe_load


def patched(stream):
    data = _real(stream)
    if isinstance(data, list) and data and isinstance(data[0], dict) and 'keyPhrases' in data[0]:
        for s in data:
            if s.get('theme') == theme:
                kps = s.get('keyPhrases', [])
                for i, k in enumerate(kps):
                    if k in mapping:
                        kps[i] = mapping[k]
                        used.add(k)
    return data


vot.yaml.safe_load = patched
rc = vot.main('icu', os.path.join(HERE, f'{theme}.yaml'))
missing = set(mapping) - used
print(f'  keyPhrase 치환 {len(used)}/{len(mapping)}건' + (f' — 못 찾음: {missing}' if missing else ''))
sys.exit(rc or (1 if missing else 0))
