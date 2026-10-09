import yaml,sys,re,collections
d=yaml.safe_load(open(f'/Users/ywyeom/private/forin/server/content/tools/wip/er-dk/base-{sys.argv[1]}.yaml'))
c=collections.Counter()
for s in d['situations']:
    for x in s['sentences']:
        a=set(re.findall(r'[가-힣]{2,}',x['ko']))
        stem=lambda w:w[:2]
        astem={stem(w) for w in a}
        for o in x['distractorsKo']:
            for w in set(re.findall(r'[가-힣]{2,}',o)):
                if stem(w) not in astem: c[stem(w)]+=1
print([ (k,v) for k,v in c.most_common(25)])
