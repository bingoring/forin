import yaml,sys
d=yaml.safe_load(open('icu-endocrine-crisis.yaml'))
W={w['id']:w for w in d['words']}
for a in sys.argv[1:]:
    w=W['w-'+a]
    print(f"{w['id']}: en={w['en']} ipa={w['ipa']} ko={w['ko']} icon={w['icon']} tag={w.get('tag')}\n   ex={w['example']} | {w['exKo']}\n   cue={w['cue']}\n   dEn={w['distractorsEn']} dKo={w['distractorsKo']} chips={w['chips']} decoy={w['decoyChips']}")
