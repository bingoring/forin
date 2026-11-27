import yaml,json,collections,sys
sys.path.insert(0,'.')
from importlib import import_module
P={};ORD={}
for m in ['_reviewB_core-safety-or_prop1','_reviewB_core-safety-or_prop2','_reviewB_core-safety-or_prop3']:
    mod=import_module(m); P.update(mod.P); ORD.update(mod.ORD)
src=yaml.safe_load(open('core-safety-or.yaml')); aft=yaml.safe_load(open('_reviewB_core-safety-or_after.yaml'))
T=import_module('_reviewB_core-safety-or_tags')
cnt=collections.Counter(); byfield=collections.defaultdict(collections.Counter)
L=[]
FN={'d0':'오답1','d1':'오답2','blank':'빈칸','decoy':'decoy','tag':'tag','why':'why'}
for si,s in enumerate(src['situations']):
    keys=[k for k in P if int(k.split('.')[0])==si]; keys.sort(key=lambda k:int(k.split('.')[1]))
    if not keys and str(si) not in ORD: continue
    L.append(f"\n### {si}. {s['title']}")
    for k in keys:
        j=int(k.split('.')[1]); x=s['sentences'][j]; y=aft['situations'][si]['sentences'][j]; v=P[k]
        L.append(f"- **{k}** `{x['en']}` — {x['ko']}  (모양 {T.BEFORE[k]}→{T.AFTER[k]})")
        for f in ('d0','d1','blank','decoy','tag','why'):
            if f not in v: continue
            cls,why=v['c'][f]; cnt[cls]+=1; byfield[FN[f]][cls]+=1
            if f in('d0','d1'):
                i=0 if f=='d0' else 1
                L.append(f"  - {FN[f]} [{cls}] \"{x['distractorsKo'][i]}\" — {why}\n    - 새 값: **\"{y['distractorsKo'][i]}\"**")
            elif f=='blank':
                ob=[o['en'] for o in x['blank']['options']]; nb=[o['en'] for o in y['blank']['options']]
                L.append(f"  - 빈칸 [{cls}] {' / '.join(ob)} (정답 {x['blank']['answer']}) — {why}\n    - 새 값: answer `{y['blank']['answer']}` · {' / '.join(nb)}")
            else:
                L.append(f"  - {FN[f]} [{cls}] `{x[f]}` — {why}\n    - 새 값: `{y[f]}`")
    if str(si) in ORD:
        v=ORD[str(si)]; cls,why=v['c']; cnt[cls]+=1; byfield['order'][cls]+=1
        L.append(f"- **order** [{cls}] {why}")
        for i,ch in sorted(v['lines'].items()):
            ol=s['order']['lines'][i]; nl=aft['situations'][si]['order']['lines'][i]
            L.append(f"  - {i+1}줄 \"{ol['en']}\" → **\"{nl['en']}\"** (ko: {nl.get('ko')}{', note: '+nl.get('note') if 'note' in ch else ''}{', icon: '+nl.get('icon') if 'icon' in ch else ''})")
        if 'why' in v: L.append(f"  - why → {v['why']}")
tot=sum(cnt.values())
head=f"## 고칠 것 — {tot}건 (안전 {cnt['안전']} · 정답 둘 {cnt['정답둘']} · 기타 {cnt['기타']})\n"
head+=' · '.join(f"{f} {sum(c.values())}(안전 {c['안전']} · 정답둘 {c['정답둘']} · 기타 {c['기타']})" for f,c in byfield.items())
head+=f"\n\n문장 {len(P)}개 · order {len(ORD)}장. 값은 전부 사본에 들어 있습니다. [안전]·[정답둘]·[기타]의 사유는 **원래 값**에 대한 것이고, 모양은 오답 두 칸(S 같은 틀·세부 / P 앞 단계 / N 뒤 단계 / F 사실) 전→후입니다. 빈칸 선택지 순서는 사본과 같고 정답 칸 자리는 원래와 같습니다."
open('_reviewB_core-safety-or_fixlist.md','w').write(head+'\n'+'\n'.join(L)+'\n')
print(head)
