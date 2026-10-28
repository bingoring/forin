import yaml,re,itertools
d=yaml.safe_load(open('icu-brain-death.yaml'))
for w in d['words']:
    if re.search(r'[A-Za-z]',w['cue']): print('CUE-EN',w['id'],w['cue'])
    # decoy reassembly: can decoys + chips form en another way / form distractor
    pieces=[p for wd in w['chips'] for p in wd]
    allp=pieces+w['decoyChips']
    tgt=w['en'].replace(' ','')
    for r in range(1,len(pieces)+1):
        for combo in itertools.permutations(allp,r):
            s=''.join(combo)
            if s==tgt and list(combo)!=pieces and any(c in w['decoyChips'] for c in combo): print('REASM',w['id'],combo)
for i,s in enumerate(d['situations']):
    for n in s.get('nuance',[]):
        if n['kind']=='context':
            w=n['word']
            for sc in n['scenes']:
                if not re.search(r'\b'+re.escape(w),sc['en'],re.I): print('CTX-MISS',i,w,sc['en'])
            print('CTX',i,w,n['ko'],[sc['who'] for sc in n['scenes']],[sc['ok'] for sc in n['scenes']])
