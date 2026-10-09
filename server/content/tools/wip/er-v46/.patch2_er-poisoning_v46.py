import re,glob
D='/Users/ywyeom/private/forin/server/content/tools/wip/er-v46/'
fs=sorted(glob.glob(D+'add_er-poisoning_v46_*.yaml'))
lines={f:open(f).read().split('\n') for f in fs}
idx={}  # (sit,sent)->(file,lineno)
si=-1
for f in fs:
    j=0
    for n,l in enumerate(lines[f]):
        if l.startswith('- title:'): si+=1; j=0
        elif l.startswith('  - {t:'): idx[(si,j)]=(f,n); j+=1
def edit(s,j,a,o,d=None):
    f,n=idx[(s,j)]; l=lines[f][n]
    m=re.search(r'a: "([^"]*)", o: \[([^\]]*)\]',l); assert m,(s,j)
    na=a if a is not None else m.group(1)
    no=', '.join(f'"{x}"' for x in o)
    l=l[:m.start()]+f'a: "{na}", o: [{no}]'+l[m.end():]
    lines[f][n]=l
E=[
(0,2,'along with',['instead of','in front of','away from']),
(1,5,None,['rarely','briefly','casually']),
(2,3,'okay',['wrong','bad','silly']),
(2,4,'Right now',['Last year','Next week','Every night']),
(2,5,'anyone' if False else 'also',['never','barely','hardly']),
(3,1,'eyes',['ears','teeth','shoes']),
(3,3,'mixing',['fire','fall','crash']),
(3,5,'right now',['last night','next week','yesterday']),
(4,0,'now',['yesterday','tomorrow','last week']),
(4,1,'find',['feed','wash','dress']),
(4,3,'bottle',['stove','toys','pool']),
(6,3,'breathing',['eating','walking','drinking']),
(8,0,'high',['low','normal','gone']),
(8,1,'clear',['raise','double','increase']),
(8,3,'Fast',['Slow','Noisy','Weak']),
(8,4,'bicarbonate',['oxygen','insulin','morphine']),
(9,0,'closely',['carelessly','casually','lazily']),
(9,1,'heart',['liver','lungs','stomach']),
(9,3,'quickly',['slowly','rarely','seldom']),
(9,4,'ready',['unable','afraid','unwilling']),
(9,5,'watch',['unplug','clean','cover']),
(10,0,'thin',['thick','heavy','clean']),
(10,2,'seeing',['hiding','feeling','wanting']),
(11,0,'hear',['doubt','ignore','forget']),
(11,1,'took',['saw','lost','made']),
(11,2,'whole',['first','next','last']),
(11,3,'know',['doubt','deny','forget']),
(11,4,'help',['blame','ignore','judge']),
(11,5,'Someone',['Nobody','Few','Most']),
(12,1,'drink',['spill','waste','borrow']),
(12,2,'keep',['stop','quit','forget']),
(12,4,'alertness',['appetite','hearing','taste']),
(13,2,'too',['twice','soon','first']),
(13,3,'Headaches',['Rashes','Bruises','Fevers']),
(14,0,'trouble',['debt','danger','pain']),
(14,1,'talk',['argue','joke','worry']),
(14,2,'between',['outside','beyond','against']),
(14,4,'here',['there','outside','tomorrow']),
(15,5,'stay with',['step away from','walk away from','let go of']),
(16,2,'wash',['cover','oil','powder']),
(16,3,'pesticide',['radiation','mold','asbestos']),
(17,2,'this week',['next week','tomorrow','tonight']),
(17,3,'stiff',['soft','loose','relaxed']),
(17,4,'cooling',['heat','blankets','warm fluids']),
(17,5,'stop',['start','add','double']),
(18,0,'mean',['prevent','treat','cure']),
(18,1,'urgent',['optional','routine','outpatient']),
(18,2,'drink',['spill','waste','lose']),
(19,0,'unstable',['stable','normal','regular']),
(19,1,'right away',['tomorrow','next week','sometime']),
(19,2,'widening',['narrowing','shortening','normal']),
(19,3,'new',['same','old','previous']),
(20,1,'talking',['unresponsive','seizing','intubated']),
(20,2,'gave',['held','stopped','declined']),
(20,5,'take over',['skip','delay','cancel']),
]
for s,j,a,o in E: edit(s,j,a,o)
for f in fs: open(f,'w').write('\n'.join(lines[f]))
print('ok')
