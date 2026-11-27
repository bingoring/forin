import re,sys
def n(s): return len(re.sub(r'\s','',s))
def ok(a,b): 
    x,y=n(a),n(b)
    return not (max(x,y)/min(x,y)>1.25 and abs(x-y)>3)
a=sys.argv[1]
print(n(a))
for o in sys.argv[2:]:
    print(n(o), ok(a,o), o)
