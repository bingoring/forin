import yaml
a = yaml.safe_load(open('or-count.pre-fix.yaml')); b = yaml.safe_load(open('or-count.yaml'))
def walk(x, y, path):
    if isinstance(x, dict) and isinstance(y, dict):
        for k in list(x) + [k for k in y if k not in x]:
            walk(x.get(k), y.get(k), path + [k])
    elif isinstance(x, list) and isinstance(y, list) and len(x) == len(y):
        for i, (p, q) in enumerate(zip(x, y)): walk(p, q, path + [i])
    elif x != y:
        print('/'.join(map(str, path)), '::', x, '=>', y)
wa = {w['id']: w for w in a['words']}; wb = {w['id']: w for w in b['words']}
for i in wa:
    if i not in wb: print('REMOVED word', i)
for i in wb:
    if i in wa: walk(wa[i], wb[i], ['word', i])
for si, (s, t) in enumerate(zip(a['situations'], b['situations'])):
    walk(s, t, ['sit', si])
