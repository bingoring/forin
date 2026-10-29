import yaml,sys
d=yaml.safe_load(open(sys.argv[1] if sys.argv[1].endswith('.yaml') else 'icu-endocrine-crisis.yaml'))
args=[a for a in sys.argv[1:] if not a.endswith('.yaml')]
for a in args:
    si,i=map(int,a.split('.'))
    x=d['situations'][si]['sentences'][i]
    print(f"[{a}] {x['en']} | {x['ko']}\n  chunks={x['chunks']} words={x['words']} goal={x.get('goal')} tag={x.get('tag')} icon={x.get('icon')}\n  why={x['why']}\n  decoy={x['decoy']} dk={x['distractorsKo']} blank={x['blank']['answer']}:{[o['en'] for o in x['blank']['options']]}")
