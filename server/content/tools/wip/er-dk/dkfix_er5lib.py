import sys,yaml
sys.path.insert(0,'/Users/ywyeom/private/forin/server/content/tools/wip/er-dk')
from dkfix_lib import fix, D
def run(theme,items):
    d=yaml.safe_load(open(D+f'base-er-{theme}.yaml'))
    idx={}
    for si,s in enumerate(d['situations']):
        for xi,x in enumerate(s['sentences']): idx.setdefault(x['en'],[]).append((si,xi))
    S={}
    for key,(a,b) in items.items():
        m=[v for e,vs in idx.items() if e.startswith(key) for v in vs]
        assert len(m)==1,(key,m)
        S[m[0]]=(a,b)
    fix('er-'+theme,S)
