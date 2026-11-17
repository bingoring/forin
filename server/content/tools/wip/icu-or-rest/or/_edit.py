import pprint,importlib,sys
sys.path.insert(0,'.')
import ovr_or_bleeding_B as o
def save():
    with open('ovr_or_bleeding_B.py','w') as f:
        for n in ('DK','BL','DECOY','ORDER','ORDER_WHY'):
            f.write(f"{n} = "+pprint.pformat(getattr(o,n),width=200)+"\n")
def dk(si,j,a=None,b=None):
    x=list(o.DK.get((si,j)) or ["",""])
    if a: x[0]=a
    if b: x[1]=b
    o.DK[(si,j)]=tuple(x)
