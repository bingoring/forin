import yaml,collections
d=yaml.safe_load(open('icu-stroke-icu.yaml'))
# sid -> (new_answer or None, {old:new} or full list)
P={'2-4':('ice',['potato','corn','tortilla']),'3-3':(None,{'feed':'turn'}),'5-2':(None,{'feed':'weigh'}),
'8-1':(None,{'flush':'label','clamp':'chart'}),'10-0':(None,{'store':'warm','return':'scan'}),
'1-1':(None,{'screen':'pump'}),'7-3':(None,{'volume':'oxygen'}),'8-0':(None,{'floor':'room'}),
'15-1':(None,{'therapy':'bedrest'}),'15-2':('brain',['heart','lungs','kidneys']),
'15-3':(None,{'time':'fluid','money':'sugar','patience':'blood'}),
'20-1':(None,{'sudden':'mild','recent':'small','unusual':'simple'}),
'20-3':(None,{'afraid':'proud','angry':'fond','alone':'tired'}),
'10-5':('labs',['weight','dressing','diet']),
'0-5':('right',['left','far','near']),'1-2':(None,{'pillow':'bath','snack':'drink'}),
'1-3':(None,{'budget':'baseline','bill':'schedule'}),'2-2':(None,{'cut':'numb'}),
'6-5':(None,{'angry':'away','empty':'late','hungry':'up'}),
'7-4':(None,{'greet':'follow','wave':'relieve'}),
'8-5':(None,{'remove':'predict','refill':'estimate','replace':'announce'}),
'9-0':(None,{'loud':'stiff'}),'9-2':(None,{'repair':'cancel','rename':'photograph','remove':'reschedule'}),
'10-2':(None,{'refill':'document','rinse':'explain','rename':'photograph'}),
'11-0':(None,{'loudly':'briefly','lazily':'remotely'}),'11-2':(None,{'loud':'fast','cold':'slow','bright':'thick'}),
'11-5':(None,{'repeat':'cause','reveal':'predict','remove':'measure'}),
'12-1':(None,{'greeting':'relieving','visiting':'following'}),
'12-2':(None,{'loudly':'briefly','politely':'remotely','lazily':'rarely'}),
'13-1':(None,{'thank':'time','greet':'quiz'}),
'14-2':(None,{'angry':'late','happy':'full','sorry':'closed'}),
'14-4':(None,{'garden':'fetal','hotel':'baby','kitchen':'glucose'}),
'14-5':(None,{'eat':'rest','nap':'pack'}),
'16-2':(None,{'cover':'chart','copy':'discuss','clean':'print'}),
'16-4':(None,{'greet':'follow','visit':'relieve'}),
'17-0':(None,{'tired':'dressed','hungry':'seated','shy':'washed'}),
'17-1':(None,{'eat':'document','nap':'talk','shower':'sign'}),
'17-4':(None,{'painting':'inspecting'}),'17-5':(None,{'price':'card','shade':'form','height':'sticker'}),
'18-1':(None,{'polish':'describe','paint':'document','praise':'photograph'}),
'18-2':(None,{'tired':'unable','hungry':'afraid','shy':'late'}),
'18-5':(None,{'loose':'low','dizzy':'high','funny':'short'}),
'19-0':(None,{'rinse':'read','rename':'note','relax':'print'}),
'19-5':(None,{'miles':'percent','pounds':'drops','inches':'milliliters'}),
'20-2':(None,{'eaten':'feared','worn':'regretted','owned':'earned'}),
}
c=collections.Counter(); w=collections.defaultdict(list)
for si,s in enumerate(d['situations']):
  for j,x in enumerate(s['sentences']):
    sid=f"{si}-{j}"; b=x['blank']; ans=b['answer']; opts=[o['en'] for o in b['options'] if o['en']!=ans]
    if sid in P:
      na,ch=P[sid]
      if na: ans=na; opts=ch
      else:
        for k in ch: assert k in opts,(sid,k)
        opts=[ch.get(o,o) for o in opts]
    for o in opts: c[o.lower()]+=1; w[o.lower()].append(sid)
for o,n in c.most_common(12): print(o,n,w[o])
