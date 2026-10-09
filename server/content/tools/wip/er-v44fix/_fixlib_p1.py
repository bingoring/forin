import yaml, io
ROOT='/Users/ywyeom/private/forin/server/content/tools'
class Fix:
    def __init__(self, theme):
        self.theme=theme
        self.path=f'{ROOT}/wip/er-v44fix/base-{theme}.yaml'
        self.chg=f'{ROOT}/changes/er/changes-{theme}.yaml'
        import subprocess
        self.d=yaml.safe_load(io.open(f'/private/tmp/claude-501/scr/orig-{theme[3:]}.yaml',encoding='utf-8'))
        self.chg0=subprocess.check_output(['git','show',f'HEAD:server/content/tools/changes/er/changes-{theme}.yaml'],cwd=ROOT).decode()
        self.changes=[]
    def sit(self,i): return self.d['situations'][i]
    def sent(self,si,k): return self.sit(si)['sentences'][k]
    def word(self,wid):
        return next(w for w in self.d['words'] if w['id']==wid)
    def set_sentence(self,si,k,why,**kw):
        s=self.sent(si,k); fields=[]
        old_en,old_ko=s['en'],s['ko']
        for key,v in kw.items():
            if s.get(key)!=v: s[key]=v; fields.append(key)
        # canonical field order en,ko,chunks,words,goal
        order=[f for f in ['en','ko','chunks','words','goal'] if f in fields]
        for w in self.d['words']:
            if w.get('example')==old_en and ('en' in fields or 'ko' in fields):
                new_en=s['en']; wf=[]
                if 'en' in fields: w['example']=new_en; wf.append('example')
                if 'ko' in fields: w['exKo']=s['ko']
                if 'ko' in fields and not wf: pass
                if wf: self.changes.append({'kind':'word','id':w['id'],'fields':wf,'why':'v46 검토 결정 11 예외: 예문 문장 en을 바꿨으므로 example도 새 문장으로'})
        self.changes.append({'kind':'sentence','situation':self.sit(si)['title'],'index':k,'fields':order,
                             'why':'v46 검토 결정 11 예외: '+why})
    def set_word(self,wid,why,**kw):
        w=self.word(wid); fields=[]
        for key,v in kw.items():
            if w.get(key)!=v: w[key]=v; fields.append(key)
        lf=[f for f in ['en','ko','ipa','icon','example'] if f in fields]
        if lf: self.changes.append({'kind':'word','id':wid,'fields':lf,'why':'v46 검토 결정 11 예외: '+why})
    def remove_word(self,wid,why):
        self.d['words']=[w for w in self.d['words'] if w['id']!=wid]
        self.changes.append({'kind':'word-remove','id':wid,'why':'v46 검토 결정 11 예외: '+why})
    def save(self):
        io.open(self.path,'w',encoding='utf-8').write(yaml.dump(self.d,allow_unicode=True,sort_keys=False,width=1000))
        s=self.chg0
        if not s.endswith('\n'): s+='\n'
        s+=yaml.dump(self.changes,allow_unicode=True,sort_keys=False,width=1000)
        io.open(self.chg,'w',encoding='utf-8').write(s)
