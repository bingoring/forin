import sys; sys.path.insert(0,'/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix')
from fixlib_v44 import *
R='/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix/'
F=Fx(R+'base-core-language-er.yaml')
OLD="We'll check with the interpreter if he truly understands."
NEW="We'll use the interpreter to check if he truly understands."
t=F.sit(15); assert t['title']=='동의능력 언어 복합'
x=t['sentences'][1]; assert x['en']==OLD
x['en']=NEW; x['chunks']=["We'll use the interpreter",'to check','if he truly','understands','.']
F.W['w-check']['example']=NEW   # 기존 changes 항목(w-check example·exKo, 15.1 en·ko·chunks)이 이미 있어 중복 기록 안 함
# decoys
x=F.sent(6,5); assert x['decoy']=='for a doctor'; x['decoy']='at your dialect'
x=F.sent(10,0); assert x['decoy']=='for the family'; x['decoy']='by lip'
x=F.sent(12,0); assert x['decoy']=='Tell me'; x['decoy']='Tell me about'
save(F.d,F.path)
# keyphrases.tsv + keyphrase-seed-changes
p=R+'keyphrases.tsv'; s=open(p).read(); a=f"core-language-er\tThe interpreter will check if he truly understands.\t{OLD}"
assert a in s; open(p,'w').write(s.replace(a,a.replace(OLD,NEW)))
p=R+'keyphrase-seed-changes-core-language-er.yaml'; s=open(p).read(); assert OLD in s; open(p,'w').write(s.replace(OLD,NEW))
