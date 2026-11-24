# 되풀이 상한(어간)·길이 규칙 재확인 — fix_icu-invasive-lines.py 결과 점검용
import yaml,sys,collections
sys.path.insert(0,'/Users/ywyeom/private/forin/server/content/tools')
import verify_lesson_content as v
d=yaml.safe_load(open('icu-invasive-lines.yaml'))
n=lambda s:len(s.replace(' ',''))
cnt=collections.Counter(); where=collections.defaultdict(list)
bad=[];over=[]
for si,s in enumerate(d['situations']):
    for j,x in enumerate(s['sentences']):
        L=n(x['ko']); ds=[n(t) for t in x['distractorsKo']]
        if min(ds)>L: bad.append((si,j,L,ds))
        for t in x['distractorsKo']:
            if v.length_tell(x['ko'],t): over.append((si,j,t))
            for st in v._ko_stems(t)-v._ko_stems(x['ko']): cnt[st]+=1; where[st].append(f"{si}.{j}")
print('최다 어간:',cnt.most_common(8))
print('상한(5, 의문사·숫자 7) 초과:',[(k,c) for k,c in cnt.items() if c>(7 if v._KO_QUESTION_OR_NUMBER.match(k) else 5)])
print('오답 둘 다 정답보다 긺:',bad)
print('길이 규칙(1.25배·3자) 위반:',over)
