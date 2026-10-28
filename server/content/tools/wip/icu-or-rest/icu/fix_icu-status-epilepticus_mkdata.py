# 검토 B의 표(chk·blank 스크립트의 사전)를 상황 제목+옛 en 키로 바꿔 데이터 파일로 만든다 (한 번 실행)
import ast,yaml
d=yaml.safe_load(open('icu-status-epilepticus.pre-fix.yaml'))
def grab(fn,name):
    t=ast.parse(open(fn).read())
    for n in t.body:
        if isinstance(n,ast.Assign) and getattr(n.targets[0],'id',None)==name:
            return ast.literal_eval(n.value)
NEW=grab('chk_icu-status-epilepticus_B.py','NEW')
B=grab('blank_icu-status-epilepticus_B.py','B')
out={'dk':[],'blank':[]}
for (s,j,k),v in sorted(NEW.items()):
    x=d['situations'][s]['sentences'][j]
    out['dk'].append({'sit':d['situations'][s]['title'],'en':x['en'],'k':k,'v':v})
for (s,j),v in sorted(B.items()):
    x=d['situations'][s]['sentences'][j]
    if v.startswith('@'):
        opts=v[1:].split('|'); ans=opts[0]; rest=opts[1:]
    else:
        ans=x['blank']['answer']; rest=v.split('|')
    out['blank'].append({'sit':d['situations'][s]['title'],'en':x['en'],'answer':ans,'wrong':rest})
yaml.safe_dump(out,open('fix_icu-status-epilepticus_data_2.yaml','w'),allow_unicode=True,sort_keys=False,width=200)
print(len(out['dk']),len(out['blank']))
