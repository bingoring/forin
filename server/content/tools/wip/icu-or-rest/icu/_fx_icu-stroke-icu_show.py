import sys, yaml
d = yaml.safe_load(open('icu-stroke-icu.pre-fix.yaml' if len(sys.argv)>2 and sys.argv[2]=='pre' else 'icu-stroke-icu.yaml', encoding='utf-8'))
for a in sys.argv[1].split(','):
    s, _, i = a.partition('-')
    s = int(s)
    sit = d['situations'][s]
    if i == '':
        print('=== S%d %s' % (s, sit['title']))
        idxs = range(len(sit['sentences']))
    else:
        idxs = [int(i)]
    for i in idxs:
        x = sit['sentences'][i]
        print('[%d-%d] %s | %s' % (s, i, x['en'], x['ko']))
        print('   chunks', x['chunks'], x['words'], 'goal', x.get('goal'))
        print('   tag=%s icon=%s decoy=%r' % (x.get('tag'), x.get('icon'), x.get('decoy')))
        print('   why:', x.get('why'))
        print('   X:', x.get('distractorsKo'))
        b = x.get('blank')
        print('   blank:', b['answer'], [o['en'] for o in b['options']])
