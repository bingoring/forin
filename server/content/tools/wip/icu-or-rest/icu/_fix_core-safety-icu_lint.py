import sys, re, yaml, collections
sys.path.insert(0,'../../..')
import verify_lesson_content as v
d=yaml.safe_load(open('core-safety-icu.yaml'))
bad=0
seeds=[]
for i,s in enumerate(d['situations']):
    seeds.append({'title':s['title'],'sentences':s['sentences'],'nuance':s['nuance']})
    for k,t in enumerate(s['sentences']):
        for o in t['distractorsKo']:
            if v.length_tell(t['ko'],o): print('V20',i,k,len(re.sub(r'\s','',t['ko'])),len(re.sub(r'\s','',o)),o); bad+=1
        opts=[x['en'] for x in t['blank']['options']]
        for o in opts:
            if o!=t['blank']['answer'] and v.length_tell(t['blank']['answer'],o): pass
        # 오답 둘 중 하나는 정답 길이 이하
        L=lambda x: len(re.sub(r'\s','',x))
        if all(L(o)>L(t['ko']) for o in t['distractorsKo']): print('both longer',i,k)
for w in d['words']:
    for f,a in (('distractorsEn','en'),('distractorsKo','ko')):
        for o in w[f]:
            if v.length_tell(w[a],o): print('W16',w['id'],f,o,w[a])
for r in v.check_theme_repetition(seeds): print(r)
# marker counts: 오답 둘에만 표지
MK=re.compile(r'(려고|전에|때|면|도록|동안|뒤|후|한 뒤|나서)')
n=0
for i,s in enumerate(d['situations']):
    for k,t in enumerate(s['sentences']):
        if all(MK.search(o) and not MK.search(t['ko']) for o in t['distractorsKo']): print('both-marker',i,k); n+=1
print('both-marker',n)
# decoy first words, 반복
c=collections.Counter(t['decoy'].split()[0].lower() for s in d['situations'] for t in s['sentences'])
print(c.most_common(8))
cw=collections.Counter(w.lower() for s in d['situations'] for t in s['sentences'] for w in re.findall(r"[A-Za-z']+",t['decoy']))
print(cw.most_common(10))
