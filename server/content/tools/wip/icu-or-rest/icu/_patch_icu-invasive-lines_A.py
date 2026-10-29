import sys,glob
# usage: python3 _patch... patchfile ; patchfile lines: id|de|dk|decoys  (빈 칸은 그대로)
def apply(patchfile):
    P={}
    for l in open(patchfile,encoding='utf-8').read().splitlines():
        if l.strip(): p=l.split('|'); P[p[0]]=p[1:]
    seen=set()
    for fn in glob.glob('/Users/ywyeom/private/forin/server/content/tools/wip/icu-or-rest/icu/add_icu-invasive-lines_A_words_*.txt'):
        out=[]
        for l in open(fn,encoding='utf-8').read().splitlines():
            p=l.split('|')
            if p[0] in P:
                de,dk,dc=(P[p[0]]+['','',''])[:3]
                if de: p[3]=de
                if dk: p[4]=dk
                if dc: p[6]=dc
                seen.add(p[0]); l='|'.join(p)
            out.append(l)
        open(fn,'w',encoding='utf-8').write('\n'.join(out)+'\n')
    print('unmatched',set(P)-seen)
apply(sys.argv[1])
