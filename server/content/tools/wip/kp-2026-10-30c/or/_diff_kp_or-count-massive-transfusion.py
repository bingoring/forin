import yaml,sys
def walk(a,b,p=''):
    if isinstance(a,dict) and isinstance(b,dict):
        for k in list(a)+[k for k in b if k not in a]:
            walk(a.get(k),b.get(k),f'{p}.{k}')
    elif isinstance(a,list) and isinstance(b,list) and len(a)==len(b):
        for i,(x,y) in enumerate(zip(a,b)): walk(x,y,f'{p}[{i}]')
    elif a!=b:
        print(p,'\n   -',a,'\n   +',b)
for t in sys.argv[1:]:
    print('=====',t)
    a=yaml.safe_load(open(f'base-{t}.yaml')); b=yaml.safe_load(open(f'{t}.yaml'))
    walk(a,b)
