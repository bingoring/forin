import yaml,sys,re
t=sys.argv[1]; ids=sys.argv[2:]
d=yaml.safe_load(open(f'base-{t}.yaml'))
for w in d['words']:
    if w['id'] in ids: print(w['id'],'|',w['en'],'|',w['ko'],'| En:',w['distractorsEn'],'| Ko:',w['distractorsKo'],'|',w.get('cue'))
