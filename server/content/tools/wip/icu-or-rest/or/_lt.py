import re,sys,yaml,json
sys.path.insert(0,'/Users/ywyeom/private/forin/server/content/tools')
import verify_lesson_content as v
base=yaml.safe_load(open('base-or-bleeding.yaml'))
def L(s): return len(re.sub(r'\s','',s))
def t(si,j,*opts):
    ko=base['situations'][si]['sentences'][j]['ko']
    print(si,j,L(ko),[ (L(o),'X' if v.length_tell(ko,o) else 'ok') for o in opts])
