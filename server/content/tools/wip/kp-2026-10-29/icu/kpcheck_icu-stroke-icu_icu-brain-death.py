"""정본 seed의 keyPhrases를 메모리 안에서만 새 문장으로 바꿔 verify_one_theme을 돌린다(정본은 건드리지 않음).
    python3 kpcheck_icu-stroke-icu_icu-brain-death.py <주제>"""
import io, os, sys, yaml
HERE = os.path.dirname(os.path.abspath(__file__))
TOOLS = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
sys.path.insert(0, TOOLS)
import verify_one_theme as vot

KP = {
    'icu-stroke-icu': {
        'This position also helps blood flow to your brain.':
            'This is the position your team ordered to keep you safe.',
        'Stop the tPA and start reversal immediately.':
            'Stop the tPA and get the reversal orders now.',
    },
    'icu-brain-death': {
        'Max the pressors and give volume now.':
            'Titrate the pressors to the ordered max and give volume as ordered.',
        'Start pressors and give a fluid bolus.':
            'Should we start pressors and give a fluid bolus?',
        'Give desmopressin now and start matching the losses.':
            'Can we get desmopressin ordered now and start matching the losses?',
        "Let's give desmopressin and match the fluid losses.":
            "Let's give the desmopressin as ordered and match the fluid losses.",
        "I'll give a fluid bolus and reassess.":
            "I'll give the ordered fluid bolus and reassess.",
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
