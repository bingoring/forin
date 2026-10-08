import yaml, copy
def load(p): return yaml.safe_load(open(p))
def save(d,p): open(p,'w').write(yaml.safe_dump(d,allow_unicode=True,sort_keys=False,width=100000))
class Fx:
    def __init__(s,path):
        s.path=path; s.d=load(path); s.changes=[]
        s.W={w['id']:w for w in s.d['words']}
    def sit(s,i): return s.d['situations'][i]
    def sent(s,i,j): return s.d['situations'][i]['sentences'][j]
    def set_sent(s,i,j,why,**kw):
        x=s.sent(i,j); changed=[]
        for k,v in kw.items():
            if x.get(k)!=v: x[k]=v; changed.append(k)
        order=['en','ko','chunks','words','goal']
        fields=[k for k in order if k in changed]
        if fields:
            s.changes.append({'kind':'sentence','situation':s.sit(i)['title'],'index':j,'fields':fields,'why':'v46 검토 결정 11 예외: '+why})
        return x
    def set_word(s,wid,why,**kw):
        w=s.W[wid]; changed=[]
        for k,v in kw.items():
            if w.get(k)!=v: w[k]=v; changed.append(k)
        if changed: s.changes.append({'kind':'word','id':wid,'fields':changed,'why':'v46 검토 결정 11 예외: '+why})
    def finish(s,changes_path):
        save(s.d,s.path)
        tail=yaml.safe_dump(s.changes,allow_unicode=True,sort_keys=False,width=100000)
        t=open(changes_path).read()
        if not t.endswith('\n'): t+='\n'
        open(changes_path,'w').write(t+tail)
        print(len(s.changes),'changes appended')
def _add_word(s,w,after,why):
    ids=[x['id'] for x in s.d['words']]
    s.d['words'].insert(ids.index(after)+1,w); s.W[w['id']]=w
    s.changes.append({'kind':'word-add','id':w['id'],'why':'v46 검토 결정 11 예외: '+why})
def _rm_word(s,wid,why):
    s.d['words']=[x for x in s.d['words'] if x['id']!=wid]; s.W.pop(wid,None)
    s.changes.append({'kind':'word-remove','id':wid,'why':'v46 검토 결정 11 예외: '+why})
Fx.add_word=_add_word; Fx.rm_word=_rm_word
