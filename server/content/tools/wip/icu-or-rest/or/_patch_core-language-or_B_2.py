import glob
R=[
("이게 무슨 뜻인지 말씀해 주시려고 한 번 읽어 보세요.","이게 무슨 뜻인지 말씀해 주시려고 먼저 숨을 쉬세요."),
("직접 다시 설명하려고 한 번 읽어 주세요.","직접 다시 설명하려고 잠깐 쉬어 주세요."),
("편하신 만큼만 읽어 주시면 돼요.","편하신 만큼만 보여 주시면 돼요."),
("더 쉬운 말로 읽어 드릴게요.","더 쉬운 말로 보여 드릴게요."),
("방금 환자분이 쓴 글을 다시 읽어 주세요.","방금 환자분이 쓴 글을 다시 가져다 주세요."),
("응급 상황을 기록하려고 시각을 확인합시다.","응급 상황을 기록하려고 시각을 봅시다."),
("통역사 없이 진행하는 이유를 확인해야 해요.","통역사 없이 진행하는 이유를 점검해야 해요."),
("아픈 곳을 가리키려고 앉으세요.","아픈 곳을 가리키려고 먼저 앉으세요."),
]
fs=sorted(glob.glob("add_core-language-or_B_*.yaml"))
txt={f:open(f,encoding='utf-8').read() for f in fs}
for old,new in R:
    n=sum(t.count(old) for t in txt.values())
    if n!=1: print("COUNT",n,old)
    for f in fs: txt[f]=txt[f].replace(old,new)
for f in fs: open(f,'w',encoding='utf-8').write(txt[f])
