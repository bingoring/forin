import sys,glob
fs=sorted(glob.glob('add_or-massive-transfusion_B_*.txt'))
txt={f:open(f,encoding='utf-8').read() for f in fs}
for ln in sys.stdin:
    ln=ln.rstrip('\n')
    if '=>' not in ln: continue
    a,b=ln.split('=>',1)
    n=0
    for f in fs:
        if a in txt[f]: txt[f]=txt[f].replace(a,b); n+=1
    if not n: print('MISSING',a)
for f in fs: open(f,'w',encoding='utf-8').write(txt[f])
