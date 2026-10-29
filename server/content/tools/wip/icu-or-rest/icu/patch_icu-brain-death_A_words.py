import glob, re, sys, yaml
# usage: python3 patch... < lines   (stdin: full replacement lines "- {id: x, ...}")
new = {}
for ln in sys.stdin.read().splitlines():
    ln = ln.strip()
    if not ln.startswith('- {id:'): continue
    e = yaml.safe_load(ln)[0]
    new[e['id']] = ln
done = set()
for f in sorted(glob.glob('add_icu-brain-death_A_words_*.yaml')):
    lines = open(f, encoding='utf-8').read().split('\n')
    ch = False
    for i, l in enumerate(lines):
        m = re.match(r'- \{id: ([\w-]+),', l)
        if m and m.group(1) in new:
            lines[i] = new[m.group(1)]; done.add(m.group(1)); ch = True
    if ch: open(f, 'w', encoding='utf-8').write('\n'.join(lines))
miss = set(new) - done
if miss:
    # append unseen ids to words_9 (new words)
    with open('add_icu-brain-death_A_words_9.yaml', 'a', encoding='utf-8') as g:
        for k in sorted(miss): g.write(new[k] + '\n')
    print('appended', sorted(miss))
print('patched', sorted(done))
