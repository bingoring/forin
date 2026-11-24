import glob
DK={
'3.3':("반지와 피어싱을 뺄 때 알려 주시겠어요?","반지와 피어싱은 수술 중에 빼 둬요."),
'5.4':("마취팀이 준비되는 대로 바로 투여할게요.","집도의가 준비되는 대로 라인을 열어 둘게요."),
'7.3':("칼륨 이상은 심장 리듬에 영향을 줘요.","이 검사는 채혈 후 몇 분이면 나와요."),
'13.2':("혈당은 수술 중에도 계속 확인해요.","너무 높거나 낮으면 마취에 영향을 줘요."),
'15.4':("더 진행하기 전에 수치를 두 번 더 재 봅시다.","재검은 보통 새로 채혈해서 합니다."),
'17.3':("출혈이 심하면 혈압이 크게 떨어질 수 있어요.","심한 출혈에는 혈액과 혈장을 함께 써야 해요."),
'18.1':("양극성 소작은 전류가 두 끝 사이로만 흘러요.","패드는 피부에 빈틈없이 완전히 붙어야 해요."),
}
BL={
'0.0':("confirm","tag","pack","wrap"),
'3.3':("take off","show","sort","clean"),
'6.2':("expedite","describe","measure","weigh"),
'14.1':("verify","photograph","translate","repeat"),
'17.1':("release","sort","weigh","store"),
'19.0':("time-out","scan","tour","speech"),
'9.4':("give","mix","warm","chill"),
'15.4':("level","form","photo","sheet"),
'13.4':("needed","shipped","stored","packed"),
'15.1':("corrected","filed","printed","copied"),
'16.0':("given","shown","sealed","wrapped"),
'17.4':("started","booked","stored","printed"),
'13.0':("check","write","sketch","tape"),
'16.1':("hold","mark","plan","sketch"),
'4.2':("comfortable","unsettled","overheated","exhausted"),
'11.3':("uncomfortable","unfamiliar","uncertain","unpredictable"),
}
for f in sorted(glob.glob('add_or-preop-checklist_B_*.txt')):
    sit=None; idx=0; out=[]
    for ln in open(f,encoding='utf-8').read().split('\n'):
        if ln.startswith('## '): sit=int(ln[3:]); idx=0
        elif ln.startswith('S|'):
            k=f'{sit}.{idx}'; idx+=1
            p=ln.split('|')
            if k in DK: p[5],p[6]=DK[k]
            if k in BL: p[7],p[8],p[9],p[10]=BL[k]
            ln='|'.join(p)
        out.append(ln)
    open(f,'w',encoding='utf-8').write('\n'.join(out))
