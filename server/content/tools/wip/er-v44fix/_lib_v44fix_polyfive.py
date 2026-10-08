import yaml, copy, json, os
BASE='/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix/base-%s.yaml'
CHG='/Users/ywyeom/private/forin/server/content/tools/changes/er/changes-%s.yaml'
VXKP='/private/tmp/claude-501/-Users-ywyeom-private-forin/4f761496-057c-44fb-9edf-c2b06d77c247/scratchpad/vx/nurse/topics/er.yaml'
CANON='/Users/ywyeom/private/forin/server/content/nurse/topics/er.yaml'
R='v46 검토 결정 11 예외: '
class Fx:
    def __init__(s,theme):
        s.theme=theme; s.P=BASE%theme; s.C=CHG%theme
        s.d=yaml.safe_load(open(s.P)); s.S=s.d['situations']; s.Wl=s.d['words']; s.W={w['id']:w for w in s.Wl}
        s.chg=[]; s.kp=[]; s.ex0={w['id']:(w['example'],w['exKo']) for w in s.Wl}
        s.canon=[x for x in yaml.safe_load(open(CANON)) if x['theme']==theme]
        s.sw=[]
    def sit(s,title):
        r=[i for i,x in enumerate(s.S) if x['title']==title]; assert len(r)==1,title; return r[0]
    def sent(s,n,title,idx,old,reason,**kw):
        sit=s.S[n]; assert sit['title']==title,(n,sit['title'])
        t=sit['sentences'][idx]; assert t['en']==old,(t['en'])
        f=[k for k in ('en','ko','chunks','words','goal') if k in kw and kw[k]!=t[k]]
        oldko=t['ko']; t.update(kw)
        if 'en' in f:
            keep=[(w,w['example'],w['exKo']) for w in s.Wl if w['example']==old and w['id'] not in t['words']]
            s.sweep(s.d,old,t['en'],'en')
            for w,e,k in keep:
                w['example']=e; w['exKo']=k; print('NEEDS OWN EXAMPLE (word no longer in sentence):',w['id'],'|',e)
                s.needs=getattr(s,'needs',[])+[w['id']]
            if old in (s.canon[n].get('keyPhrases') or []): s.kp.append((title,old,t['en']))
        if 'ko' in f:
            keep=[(w,w['exKo']) for w in s.Wl if w['exKo']==oldko and w['id'] not in t['words']]
            s.sweep(s.d,oldko,t['ko'],'exKo')
            for w,k in keep: w['exKo']=k
        if f: s.chg.append({'kind':'sentence','situation':title,'index':idx,'fields':f,'why':R+reason})
        return t
    def sweep(s,x,old,new,mode):
        keys=('en','example') if mode=='en' else ('exKo',)
        if isinstance(x,dict):
            for k,v in x.items():
                if isinstance(v,str):
                    if v==old and k in keys: x[k]=new; s.sw.append(k)
                else: s.sweep(v,old,new,mode)
        elif isinstance(x,list):
            for v in x: s.sweep(v,old,new,mode)
    def word(s,wid,why,**kw):
        w=s.W[wid]; w.update(kw); s.wwhy=getattr(s,'wwhy',{}); s.wwhy[wid]=why
    def add_word(s,w,after,why):
        ids=[x['id'] for x in s.Wl]; s.Wl.insert(ids.index(after)+1,w); s.W[w['id']]=w
        s.chg.append({'kind':'word-add','id':w['id'],'why':R+why})
    def rm_word(s,wid,why):
        s.d['words']=s.Wl=[x for x in s.Wl if x['id']!=wid]; s.W.pop(wid,None)
        s.chg.append({'kind':'word-remove','id':wid,'why':R+why})
    def finish(s):
        for wid,(e,k) in s.ex0.items():
            if wid in s.W and (s.W[wid]['example']!=e):
                s.chg.append({'kind':'word','id':wid,'fields':['example'],'why':R+getattr(s,'wwhy',{}).get(wid,'예문이 고친 문장 en과 같아 새 en으로 맞춤')})
        yaml.safe_dump(s.d,open(s.P,'w'),allow_unicode=True,sort_keys=False,width=10000)
        c=yaml.safe_load(open(s.C)); c['changes'].extend(s.chg)
        yaml.safe_dump(c,open(s.C,'w'),allow_unicode=True,sort_keys=False,width=10000)
        if s.kp:
            seeds=yaml.safe_load(open(VXKP))
            for title,old,new in s.kp:
                hit=[x for x in seeds if x['theme']==s.theme and x['title']==title]; assert len(hit)==1
                kps=hit[0]['keyphrases'] if 'keyphrases' in hit[0] else hit[0]['keyPhrases']
                (kps.__setitem__(kps.index(old),new) if old in kps else None)
            yaml.safe_dump(seeds,open(VXKP,'w'),allow_unicode=True,sort_keys=False,width=10000)
        print(len(s.chg),'changes appended; swept',len(s.sw))
        print('KEYPHRASES:')
        for title,old,new in s.kp: print(f'{s.theme} · {title} · {old} → {new}')
        json.dump(s.kp,open('/private/tmp/claude-501/-Users-ywyeom-private-forin/4f761496-057c-44fb-9edf-c2b06d77c247/scratchpad/kp-%s.json'%s.theme,'w'),ensure_ascii=False)
