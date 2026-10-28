import re
def L(s): return len(re.sub(r'\s','',s))
def ok(a,b):
    la,lb=L(a),L(b); return max(la,lb)<=1.25*min(la,lb) or abs(la-lb)<=3
P={'adequate':['adept','adjacent'],'closely':['coldly','slowly'],'calm':['clammy','balmy'],'free':['frail','fresh'],'quiet':['quick','quaint'],
'cough':['trough','cuff'],'startle':['startup','starter'],'soft':['short','swift'],'best':['bent','bleak'],'loud':['loose','proud'],'bright':['brisk','blind'],
'first':['forth','fully'],'regularly':['rarely','readily'],'urine':['urea','saline'],'dry':['dewy','dire'],'high':['shy','hot'],'block':['blot','bloat'],
'climb':['cling','clip'],'imaging':['staging','paging'],'deep':['deaf','damp'],'real':['rare','regal'],'bedside':['bedtime','bedroom'],'fast':['last','fairly'],
'speak':['sneak','squeak'],'visit':['vision','visa'],'activity':['acidity','captivity'],'between':['beneath','beyond'],'trend':['tend','tread'],
'response':['resource','residue'],'fluctuation':['function','flotation'],'frequently':['fluently','fervently'],'continuous':['contiguous','conspicuous'],
'subtle':['supple','sublime'],'reposition':['repossess','recondition'],'restrict':['restore','constrict'],'show':['shove','shoo'],'wait':['wade','waive'],
'organ':['argon','orbit'],'try':['fry','pry'],'could':['should','must'],'may':['must','shall'],'call':['fall','cull'],'med':['meal','mud'],'osmotic':['exotic','hypnotic'],
'mean':['mend','moan'],'well':['ill','still'],'cut':['cure','coat'],'deficit':['deposit','decibel'],'target':['tablet','tarot'],'bottom':['button','bottle'],
'touch':['couch','torch'],'cluster':['clutter','muster'],'add':['aid','adopt'],'possibility':['possibly','positivity'],'ensure':['endorse','endure'],
'crackle':['cackle','crinkle'],'window':['willow','winter'],'SIADH':['SIRS','SADD'],'slowly':['slightly','solely'],'weight':['height','freight']}
for k,v in P.items():
    for d in v:
        if not ok(k,d): print('LEN',k,d)
print('done')
