import re
files=['add_or-emergency-open_B_1.txt','add_or-emergency-open_B_2.txt','add_or-emergency-open_B_3.txt','add_or-emergency-open_B_order.txt']
txt={f:open(f,encoding='utf-8').read() for f in files}
def R(a,b,cnt=1):
    n=0
    for f in files:
        c=txt[f].count(a)
        if c: txt[f]=txt[f].replace(a,b); n+=c
    assert n==cnt,(a,n)
# dk fixes
R("|혈액은행과 연락선을 열어 두고 기다릴게요.|","|혈액은행과 연락선을 열어 두고 대기할게요.|")
R("|연락선을 열려고 혈액은행 번호를 봐요.|","|혈액은행 연락처를 적어 둘게요.|")
R("|봉합 전에 거즈 계수를 확인하려고 목록 가져올게요.|","|봉합 전에 거즈 계수를 한 번 더 적어 둘게요.|")
R("|필요할 경우를 대비해 백업 트레이를 열려고 장갑을 낄게요.|","|필요할 경우를 대비해 백업 램프를 켜 둘게요.|")
R("|혹시 몰라서 용량을 뽑으려고 라벨 써요.|","|혹시 몰라서 여분의 용량을 적고 있어요.|")
R("|들어가는 팩 하나하나를 추적하려고 시간을 봐요.|","|들어가는 팩 하나하나를 세고 있어요.|")
R("|산과 대량수혈 프로토콜을 개시하려고 목록을 열어요.|","|소아 대량수혈 프로토콜을 개시하고 있어요.|")
R("|자궁수축제는 투여됐고 혈액을 더 요청하려고 전화를 들어요.|","|자궁수축제는 준비됐고 혈액을 더 요청하고 있어요.|")
R("|말씀만 하시면 윤상연골 압박을 가하려고 손올릴게요.|","|말씀만 하시면 윤상연골 압박을 가할 준비를 할게요.|")
R("|말씀만 하시면 윤상연골 압박을 가할 자세를 잡을게요.|","|말씀만 하시면 윤상연골 압박을 계속 가할게요.|")
R("|가장 깊은 출혈 부위부터 처치해요.|","|가장 큰 출혈 부위부터 처치하러 가요.|")
R("|팩 하나하나와 들어간 시각을 확인할게요.|","|팩 하나하나와 들어간 시각을 외워 둘게요.|")
R("|지금 바로 신생아팀 문 앞에서 요청할게요.|","|한 번 더 신생아팀을 요청할게요.|")
R("|백밸브마스크를 가져오고 흡인을 켤게요.|","|백밸브마스크를 가져오고 흡인을 정리할게요.|")
R("|흡인기 두 대를 연결해서 준비해 뒀어요.|","|흡인기 두 대를 꽂아서 준비해 뒀어요.|")
R("|말씀만 하시면 두 대를 더 연결해 둘게요.|","|말씀만 하시면 두 대를 더 꽂아 둘게요.|")
R("|영아 워머는 연결돼 있고 준비됐어요.|","|영아 워머는 세워져 있고 준비됐어요.|")
R("|영아 워머는 켜져 있고 세워져 있어요.|","|영아 워머는 켜져 있고 정돈됐어요.|")
R("|이번 것이 끝나면 다음 쿨러가 연결돼 있어요.|","|이번 것이 끝나면 다음 쿨러가 열려 있어요.|")
R("|백밸브마스크는 준비됐고 흡인도 연결됐어요.|","|백밸브마스크는 준비됐고 흡인도 켜졌어요.|")
R("|흡인이 연결됐고 윤상연골 압박도 준비됐어요.|","|흡인이 설치됐고 윤상연골 압박도 준비됐어요.|")
R("|흡인이 켜졌고 윤상연골 압박도 확인됐어요.|","|흡인이 켜졌고 윤상연골 압박도 점검됐어요.|")
R("|속도가 빨라도 진행 중인 계수는 확인되고 있어요.|","|속도가 빨라도 진행 중인 계수는 정리되고 있어요.|")
R("|속도와 상관없이 계수를 계속 확인합시다.|","|속도와 상관없이 계수를 계속 점검합시다.|")
R("|혈액은행이 대량수혈용 팩을 확인하고 있어요.|","|혈액은행이 대량수혈용 팩을 세고 있어요.|")
R("|혈액은행이 제제를 확인하고 있어요.|","|혈액은행이 제제를 정리하고 있어요.|")
R("|선생님이 기도를 맡으시면 저는 수혈을 확인할게요.|","|선생님이 기도를 맡으시면 저는 수혈을 점검할게요.|")
R("|선생님이 출혈을 처치하시는 동안 저는 기도를 확인할게요.|","|선생님이 출혈을 처치하시는 동안 저는 기도를 점검할게요.|")
R("|혈액은행에서 몇 분 안에 더 확인할 수 있어요.|","|혈액은행에서 몇 분 안에 더 보관할 수 있어요.|")
# decoys
R("|by the afternoon|","|for a few patients|")
R("|at the front desk|","|right away|")
R("|with the front desk|","|with the pump|")
R("|and sign the log|","|the old log|")
R("|at the handoff|","|with the radio|")
R("|before the incision|","|the drape pack|")
R("|and the charge desk|","|and the coffee machine|")
R("|the clamps|","|the gowns|")
R("|for more plasma|","|for more tape|")
R("|and the irrigation|","|the music|")
R("|to wait outside|","|to bring snacks|")
R("|for postpartum pain|","|for the schedule|")
R("|the smallest tear|","|the next patient|")
R("|for the pediatric floor|","|for the coffee|")
R("|and close now|","|and wash now|")
R("|and verified|","|and bagged|")
R("|a second table|","|a second sink|")
# 17 decoys: ready to leave x2
t=txt['add_or-emergency-open_B_3.txt']
i=t.index('|ready to leave|'); t=t[:i]+'|waiting to eat|'+t[i+len('|ready to leave|'):]
i=t.index('|ready to leave|'); t=t[:i]+'|ready to rehearse|'+t[i+len('|ready to leave|'):]
txt['add_or-emergency-open_B_3.txt']=t
# blanks
R("|resuscitation|laundry|billing|visitor","|Neonatal|Elderly|Dental|Bariatric")
R("|resuscitation|weighing|bathing|feeding","|starting|finishing|refusing|rejecting")
R("|documented|hidden|erased|torn","|documented|discarded|disguised|distorted")
R("|temporary|brief|quick|small","|pack|clamp|cut|stitch")
R("|ready|loud|empty|broken","|ready|loud|cold|broken")
R("|ready|empty|locked|full","|ready|stale|locked|full")
R("|time|size|brand|label","|time|size|brand|cost")
R("|pack|count|photograph|label","|pack|count|photograph|measure")
R("|first|twice|alone|often","|first|alone|often|quietly")
for f in files: open(f,'w',encoding='utf-8').write(txt[f])
print('ok')
