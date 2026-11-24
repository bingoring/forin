import yaml, itertools, re
D=yaml.safe_load(open('or-minimally-invasive.A.yaml'))
BAN="""ass arse anal anus butt cum cunt cock dick fag fuck homo jizz naff nig piss porn rape shit slut sux tit tits twat wank whore
bra bonzo dork dwarf flog grope hearse hell lust oriental slay sow stab strangle tomb tramp underwear witch nasty
ax fool diss cun kus mex fec pint rip pall kill crypt margin lit quack stiff ale missile dix spic nig tit arse
sex gun bomb beer wine rum gin vodka dead die damn crap fart poo pee urn grave coffin sin gay fat dumb stupid idiot hang hit shoot
whip drug crack weed pot booze brew lager mead cider ale bar pub wake kiss nude""".split()
for w in D['words']:
    en=w['en'].lower().replace(' ','').replace('-','')
    pool=[p.lower().replace('-','') for word in w['chips'] for p in word]+[d.lower().replace('-','') for d in w['decoyChips']]
    seen=set()
    for r in (1,2,3):
        for c in itertools.permutations(range(len(pool)),r):
            s=''.join(pool[i] for i in c)
            for b in BAN:
                if len(b)>=3 and b in s and b not in en and (s,b) not in seen:
                    seen.add((s,b)); print(w['id'],'combo',s,'has',b)
    for o in w['distractorsEn']:
        ol=o.lower()
        for b in BAN:
            if len(b)>=3 and b in ol and b not in en: print(w['id'],'dEn',o,'has',b)
