import yaml,sys
d=yaml.safe_load(open('or-preop-verification.yaml'))
S=open('_reviewB_or-preop-verification_sent.txt','w');B=open('_reviewB_or-preop-verification_blank.txt','w')
D=open('_reviewB_or-preop-verification_decoy.txt','w');O=open('_reviewB_or-preop-verification_order.txt','w')
for i,s in enumerate(d['situations']):
    for f in (S,B,D): f.write(f"\n## S{i} {s['title']}\n")
    for j,x in enumerate(s['sentences']):
        dk=x.get('distractorsKo',[])
        S.write(f"{i}.{j} [{x.get('tag')}/{x.get('icon')}] {x['en']}\n   ko: {x['ko']} ({len(x['ko'])})\n   O1: {dk[0]} ({len(dk[0])})\n   O2: {dk[1]} ({len(dk[1])})\n   why: {x.get('why')}\n")
        bl=x['blank'];en=x['en'];a=bl['answer']
        B.write(f"{i}.{j} ans={a}\n")
        for o in bl['options']:
            B.write(f"   {'*' if o['en']==a else ' '} {en.replace(a,'['+o['en']+']',1)}\n")
        ch=x['chunks'];dc=x['decoy']
        D.write(f"{i}.{j} decoy={dc!r} | ko: {x['ko']}\n   chunks: {' / '.join(ch)}\n")
        for k in range(len(ch)):
            if ch[k] in '.?!,': continue
            D.write(f"   r{k}: {' '.join(ch[:k]+['['+dc+']']+ch[k+1:])}\n")
    o=s['order'];L=o['lines']
    O.write(f"\n## S{i} {s['title']} | ko: {o['ko']}\n   why: {o['why']}\n")
    for k,l in enumerate(L): O.write(f"   {k+1}. {l['en']} ({l.get('note')}/{l.get('icon')}) {l.get('ko')}\n")
    for a in range(3):
        LL=L[:];LL[a],LL[a+1]=LL[a+1],LL[a]
        O.write(f"   swap{a+1}{a+2}: "+' | '.join(l['en'] for l in LL)+"\n")
