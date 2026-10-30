import yaml
d=yaml.safe_load(open('or-tourniquet.yaml'))
en={w['id']:w['en'] for w in d['words']}
bank=set(w['en'].lower() for w in d['words'])
P={'w-smooth':'smoky,smug','w-underneath':'overhead,underway','w-safe':'sane,same','w-fine':'faint,fiery','w-first':'fast,last','w-well':'badly,wildly','w-small':'smart,stale','w-loose':'loud,lone','w-soon':'seldom,still','w-total':'tonal,tidal','w-long':'lone,lame','w-block':'bloc,flock','w-high':'shy,dry','w-low':'slow,raw','w-child':'chili,chain','w-short':'sharp,stout','w-period':'peril,pellet','w-troubleshoot':'overshoot,outsource','w-reperfusion':'repercussion,reinfusion','w-deficit':'deposit,default',
'w-base':'bake,chase','w-agree':'argue,accrue','w-wrinkle':'twinkle,winkle','w-apply':'reply,supply','w-check':'chuck,change','w-size':'sign,side','w-overlap':'overlook,overload','w-tight':'tidy,tough','w-warn':'warp,ward','w-reminder':'remainder,rejoinder','w-run':'rub,ruin','w-approach':'approve,reproach','w-release':'relate,relapse','w-proximal':'approximate,maximal','w-add':'aid,nod','w-whether':'whereas,whenever','w-flag':'flap,flash','w-pediatric':'podiatric,geriatric','w-appropriate':'approximate,proprietary','w-under':'until,upon','w-beneath':'between,beyond','w-interval':'interview,interior','w-allow':'allay,follow','w-closely':'clearly,coarsely','w-adequate':'accurate,adjacent','w-below':'beside,beyond','w-grab':'grin,grub','w-cause':'cease,coax','w-inform':'conform,deform','w-neuro':'neutral,natural','w-device':'advice,office','w-field':'fuel,feud','w-metabolic':'metallic,melodic','w-muscle':'mussel,muster','w-sign':'sigh,sight','w-damage':'dam,dosage','w-nerve':'nurse,verve','w-wide':'wild,wise'}
en['w-wide']='wide'
def L(x): return len(x.replace(' ',''))
for k,v in P.items():
    for x in v.split(','):
        a,b=L(en[k]),L(x)
        ok=max(a,b)<=1.25*min(a,b) or abs(a-b)<=3
        if not ok or x.lower() in bank: print(k,en[k],x,'LEN' if not ok else '','BANK' if x.lower() in bank else '')
print('done')
