import glob, re, sys
new = dict(l.split('|',1) for l in sys.stdin.read().strip().splitlines())
done=set()
for f in sorted(glob.glob('add_icu-brain-death_A_words_*.yaml')):
    lines = open(f, encoding='utf-8').read().split('\n'); ch=False
    for i,l in enumerate(lines):
        m = re.match(r'- \{id: ([\w-]+),', l)
        if m and m.group(1) in new:
            lines[i] = re.sub(r'en2: \[[^\]]*\]', lambda _: 'en2: [%s]' % new[m.group(1)], l, count=1); done.add(m.group(1)); ch=True
    if ch: open(f,'w',encoding='utf-8').write('\n'.join(lines))
print('missing', sorted(set(new)-done))
