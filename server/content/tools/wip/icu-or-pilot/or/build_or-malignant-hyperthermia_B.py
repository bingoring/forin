import yaml, glob, copy, re, collections
D = '/Users/ywyeom/private/forin/server/content/tools/wip/icu-or-pilot/or/'
T = 'or-malignant-hyperthermia'
base = yaml.safe_load(open(D + f'base-{T}.yaml'))
add = {}
for f in sorted(glob.glob(D + f'add_{T}_B_*.yaml')):
    for k, v in yaml.safe_load(open(f)).items():
        assert k not in add, k
        add[k] = v
out = copy.deepcopy(base)
miss = []
for si, sit in enumerate(out['situations']):
    a = add.get(si)
    if a is None:
        miss.append(si); continue
    assert len(a['s']) == len(sit['sentences']), (si, len(a['s']))
    for j, (sent, n) in enumerate(zip(sit['sentences'], a['s'])):
        sent['tag'] = n['tag']; sent['icon'] = n['icon']; sent['why'] = n['why']
        sent['decoy'] = n['decoy']; sent['distractorsKo'] = list(n['d'])
        opts = [{'en': n['a']}] + [{'en': e} for e in n['o']]
        assert len(opts) == 4, (si, j)
        r = (si + j) % 4
        opts = opts[-r:] + opts[:-r] if r else opts
        sent['blank'] = {'answer': n['a'], 'options': opts}
    o = a['order']
    sit['order'] = {'tag': o['tag'], 'icon': o['icon'], 'ko': o['ko'], 'why': o['why'],
                    'lines': [dict(l) for l in o['lines']]}
if miss: print('아직 없음:', miss)
yaml.safe_dump(out, open(D + f'{T}.B.yaml', 'w'), allow_unicode=True, sort_keys=False, width=1000)
print('written')

# 자기 점검 표
if not miss:
    L = lambda s: len(re.sub(r'\s', '', s))
    rows = []; cnt = collections.Counter()
    for si, sit in enumerate(out['situations']):
        for j, s in enumerate(sit['sentences']):
            ko = s['ko']; dk = s['distractorsKo']
            rows.append(f"{si}.{j} {ko} | {dk[0]} | {dk[1]}  [{L(ko)},{L(dk[0])},{L(dk[1])}] min={'ok' if min(L(x) for x in dk)<=L(ko) else 'NOSHORT'}")
            kw = set(re.findall(r'[가-힣A-Za-z0-9]+', ko))
            kws = {re.sub(r'(은|는|이|가|을|를|에|에서|의|도|과|와|로|으로|만|에게|께)$', '', w) for w in kw}
            for d in dk:
                for w in set(re.findall(r'[가-힣A-Za-z0-9]+', d)):
                    w2 = re.sub(r'(은|는|이|가|을|를|에|에서|의|도|과|와|로|으로|만|에게|께)$', '', w)
                    if w2 not in kws and w not in kw: cnt[w2] += 1
    open('/private/tmp/claude-501/-Users-ywyeom-private-forin/4f761496-057c-44fb-9edf-c2b06d77c247/scratchpad/mh-B-table.txt', 'w').write('\n'.join(rows))
    open('/private/tmp/claude-501/-Users-ywyeom-private-forin/4f761496-057c-44fb-9edf-c2b06d77c247/scratchpad/mh-B-freq.txt', 'w').write('\n'.join(f'{c} {w}' for w, c in cnt.most_common(60)))
