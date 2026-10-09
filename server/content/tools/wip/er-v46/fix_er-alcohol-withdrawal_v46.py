import yaml
P='/Users/ywyeom/private/forin/server/content/tools/wip/er-v46/er-alcohol-withdrawal.yaml'
d=yaml.safe_load(open(P))
S=d['situations']
def sen(a,b): return S[a]['sentences'][b]
def setv(obj,key,old,new):
    assert obj[key]==old,(key,obj[key],old)
    obj[key]=new
def blank(a,b,ans_old,ans_new,opts):
    s=sen(a,b); bl=s['blank']
    assert bl['answer']==ans_old,(a,b,bl['answer'])
    assert ans_new in s['en'] and s['en'].count(ans_new)==1,(a,b)
    assert ans_new in opts
    bl['answer']=ans_new; bl['options']=[{'en':o} for o in opts]

# why
setv(sen(3,4),'why',sen(3,4)['why'],"always로 습관처럼 지키는 순서라고 알려요. 알코올 관련 환자에게는 포도당 수액 전에 티아민을 줘요 — 다만 저혈당이면 포도당을 미루지 않고 티아민을 함께 줘요.")
sen(16,2)['why']="If로 다음 단계를 미리 말해 두면 팀이 준비해요. 벤조로 멈추지 않으면 2차 약으로 올리고, 그때 기도를 지키려고 삽관을 준비해요."
sen(10,2)['why']="두 가지를 한 번에 물어 머리 부상 가능성을 빨리 가려요. 넘어진 순간이 기억나지 않으면 의식을 잃었을 수 있다는 단서예요."
sen(19,2)['why']="Keep him on으로 지금 하는 감시를 끊지 말라고 하고, call … back in으로 이미 봤던 의사를 다시 부른다는 걸 분명히 해요. 진정을 늘리는 중이라 감시와 호출을 한 문장에 묶어요."
sen(19,5)['why']="going으로 감시를 멈추지 말라고 하고, 문장 끝의 now로 호출이 미룰 일이 아님을 못 박아요. 급변 중에는 지시를 짧게 둘로 나눠 말해요."

# blanks
blank(0,4,'everyone','everyone',['everyone','someone','nobody','only you'])
blank(8,4,'unusual','unusual',['unusual','normal','familiar','pleasant'])
blank(17,4,'reversed','reversed',['ordered','reversed','repeated','measured'])
blank(7,3,'exactly','seeing',['seeing','eating','reading','drinking'])
blank(14,2,'mornings','mornings',['mornings','afternoons','evenings','summers'])
blank(18,5,'pain','pain',['pain','relief','sleepiness','hunger'])
blank(5,1,'dose','dose',['dose','label','brand','wristband'])
blank(10,5,'withdrawal','withdrawal',['withdrawal','discharge','transfer','visit'])
blank(13,2,'psychiatry','psychiatry',['psychiatry','dental','radiology','physical therapy'])
blank(13,5,'psychiatry','psychiatry',['psychiatry','dermatology','orthopedic','urology'])
blank(15,3,'heart rate','heart rate',['heart rate','oxygen level','urine output','weight'])
blank(16,4,'cart','cart',['cart','chart','sign','bed'])
blank(19,1,'storm','storm',['storm','fever','bleeding','cough'])
blank(5,0,'high','medication',['medication','a snack','a blanket','a brochure'])
blank(5,3,'high','medication',['medication','tests','blankets','visitors'])
blank(4,5,'fifteen','fifteen',['fifteen','five','two','ten'])
blank(8,3,'unsteady','unsteady',['unsteady','steady','strong','fast'])
blank(13,4,'safe','safe',['rested','safe','warm','dressed'])
blank(20,2,'tremulous','tremulous',['talkative','cheerful','tremulous','sleepy'])

# decoy
setv(sen(2,1),'decoy','once a day','about your job')
setv(sen(10,3),'decoy','you can treat at home','you can see in a mirror')
# distractorsKo
dk=sen(15,0)['distractorsKo']; assert dk[1]=='지금 혈압과 심박수가 높아요'; dk[1]='1:1 안전 관리가 필요해요'
dk=sen(0,5)['distractorsKo']; assert dk[1]=='보통 얼마나 드세요?'; dk[1]='혼자만 여쭤보는 게 아니에요'
# tag
setv(sen(4,4),'tag','호출 요청','낙상 예방')
setv(sen(8,0),'tag','소견 보고','소견 설명')

# order
def line(a,i,en,ko,note,icon=None):
    l=S[a]['order']['lines'][i]
    l['en']=en; l['ko']=ko; l['note']=note
    if icon: l['icon']=icon
def why(a,t): S[a]['order']['why']=t
line(0,2,"Whatever the amount, when was your last drink?","양이 얼마든, 마지막으로 드신 건 언제예요?","시점")
why(0,"문진을 열며 비난이 아니라고 밝히고, 하루 음주량을 묻고, 그 양이 얼마든 마지막 음주 시각을 묻고, 그 시각이 무엇을 지켜볼지 정한다고 닫아요. 'the amount'·'that time'이 앞 줄을 가리켜 순서가 하나예요.")
line(1,1,"Depending on that time, the shaking and sweating may be early withdrawal.","그 시각에 따라 떨림과 땀은 금단 초기일 수 있어요","설명")
why(1,"마지막 음주 시각을 먼저 묻고, 그 시각에 따라 떨림·발한이 금단 초기일 수 있다고 설명하고, 그것을 추적할 도구를 소개한 뒤, 그 도구로 자주 점수를 적겠다고 해요. 'that time'·'it'·'that checklist'가 앞 줄을 가리켜 순서가 하나예요.")
line(3,2,"Because you may be low, we give it before any sugar or glucose fluids.","모자랄 수 있어서 당분이나 포도당 수액보다 먼저 드려요","순서")
why(3,"약이 무엇인지 먼저 소개하고, 왜 이 환자에게 흔한지 설명하고, 모자랄 수 있어서 당분보다 먼저 준다고 이은 뒤, 그 순서가 손상을 막는다고 닫아요. 'it'·'you may be low'·'that order'가 앞 줄을 가리켜 순서가 하나예요.")
line(4,2,"Even while you're resting there, I'll be checking on you often.","거기서 쉬고 계셔도 자주 와서 확인할게요","확인")
line(4,3,"That means every fifteen minutes, until you're more awake.","십오 분마다, 더 깨실 때까지 그렇게 할게요","간격")
why(4,"침대 머리를 올리는 이유를 알리고, 그 자세로 침대에 머물러 달라고 부탁하고, 거기서 쉬는 동안에도 자주 확인하겠다고 하며, 그 확인이 십오 분마다라고 닫아요. 'like that'·'there'·'That means'가 앞 줄을 가리켜 순서가 하나예요.")
line(5,2,"If you start to see or feel things that aren't there, tell me right away.","없는 게 보이거나 느껴지기 시작하면 바로 말씀해 주세요","요청","bell")
line(5,3,"Whatever you notice, I'll check again and adjust the dose each time.","무엇을 알아채시든 제가 다시 확인하고 매번 용량을 맞출게요","조절","gear")
why(5,"점수가 높아 약을 준다고 이유를 밝히고, 그 약이 진정시키는 효과를 알리고, 없는 것이 보이거나 느껴지면 바로 알려 달라고 청한 뒤, 무엇을 알리든 다시 확인하고 용량을 맞춘다고 닫아요. 환각은 용량 변화의 결과가 아니라 금단이 심해지는 신호라서 알려 달라고 해요. 'It'·'Whatever you notice'가 앞 줄을 가리켜 순서가 하나예요.")
line(8,3,"While I watch, how long has he been confused, and has he eaten?","지켜보는 동안 묻는데, 언제부터 혼란스러웠고 식사는 하셨어요?","문진")
why(8,"세 징후가 티아민 결핍을 가리킨다고 알리고, 그 때문에 응급으로 보고 바로 티아민을 주고, 반응을 보려고 눈을 지켜보고, 지켜보는 동안 시작 시점과 식사를 묻는 순서예요. 'Because of that'·'it'·'While I watch'가 앞 줄을 가리켜 순서가 하나예요.")
line(9,2,"As those go in, we're watching your heart rhythm on the monitor.","그게 들어가는 동안 모니터로 심장 리듬을 지켜보고 있어요","감시")
why(9,"과음이 두근거림의 원인이라고 설명하고, 그걸 바로잡으려고 수치를 확인해 IV로 보충하고, 그것이 들어가는 동안 모니터로 리듬을 보고, 보충이 끝나면 다시 확인한다고 닫아요. 'To fix that'·'those'·'the replacement'가 앞 줄을 가리켜 순서가 하나예요.")
line(11,1,"That goes for every visit, even if you've been here before.","오실 때마다 마찬가지예요, 전에 오신 적이 있어도요","공감")
why(11,"방문을 반기며 시작하고, 그 마음이 매번 마찬가지라고 이전 방문과 상관없다고 잇고, 오늘 돌봄 너머로 준비되면 도움을 연결할 수 있다고 제안하고, 그 제안은 부담 없이 열려 있다고 닫아요. 'That goes for'·'Beyond today's care'·'that offer'가 앞 줄을 가리켜 순서가 하나예요.")
line(12,3,"Because of that risk, we'll treat the withdrawal carefully and support your liver.","그 위험 때문에 금단을 조심스럽게 치료하면서 간을 지지할게요","계획")
why(12,"피부가 노란 이유를 먼저 설명하고, 부기도 같은 원인이라고 잇고, 두 징후를 합쳐 출혈 위험이 높다고 알린 뒤, 그 위험 때문에 금단 치료와 간 지지를 같이 한다고 닫아요. 'the same thing'·'both of those signs'·'that risk'가 앞 줄을 가리켜 순서가 하나예요.")
line(14,0,"I'm going to ask you something, and whatever you tell me is fine.","하나 여쭤볼게요, 뭐라고 말씀하셔도 괜찮아요","안심")
why(14,"질문을 예고하며 어떤 대답도 괜찮다고 안심시키고, 아침에 이런 느낌이 있었는지 묻고, 그 대답이 무엇이든 떨림이 금단 초기일 수 있다고 설명하고, 그런 징후가 적게 마셨다고 느끼는 사람에게도 나타난다고 닫아요. 'Whatever the answer'·'Those signs'가 앞 줄을 가리켜 순서가 하나예요.")
line(15,1,"On top of that, CIWA is off the scale — please come now.","게다가 CIWA가 척도를 벗어났어요 — 지금 와 주세요","호출")
line(15,2,"With that score, please order aggressive benzo sedation and one-to-one safety.","그 점수라면 적극적인 벤조 진정과 1:1 안전 관리를 오더해 주세요","요청")
why(15,"상태를 먼저 보고하고, 점수가 척도를 벗어났다며 의사에게 지금 와 달라고 이어 부르고, 그 모든 걸 근거로 필요한 오더를 요청하고, 그 진정에도 반응이 없으면 ICU 병상이 필요할 수 있다고 닫아요. 줄마다 듣는 사람은 의사예요. 'On top of that'·'that score'·'that sedation'이 앞 줄을 가리켜 순서가 하나예요.")
line(17,1,"From what you describe, he's filling memory gaps with stories — not on purpose.","말씀하신 걸 보면 기억의 빈틈을 이야기로 채우고 있어요 — 일부러가 아니에요","작화","speech")
line(17,2,"That pattern suggests the thiamine deficiency has advanced.","그런 양상은 티아민 결핍이 진행됐다는 뜻이에요","소견","stetho")
line(17,3,"Because it has advanced, we're giving urgent high-dose thiamine, though some damage may be lasting.","진행됐기 때문에 긴급히 고용량 티아민을 드리고 있어요, 다만 일부 손상은 남을 수 있어요","치료")
why(17,"기억이 언제부터 그랬는지 묻고, 그 설명에 비추어 기억의 빈틈을 일부러가 아닌 이야기로 채우는 것이라고 풀고, 그런 양상이 결핍의 진행을 뜻한다고 짚고, 그래서 서둘러 티아민을 준다고 닫아요. 'what you describe'·'That pattern'·'it has advanced'가 앞 줄을 가리켜 순서가 하나예요.")
line(19,3,"Call the physician back in now and report what that monitoring shows.","지금 의사를 다시 불러서 그 감시가 보여 주는 걸 알려 주세요","호출")
why(19,"수치가 다시 치솟는 것을 알리고, 그걸 조절하려고 진정을 늘려야 한다고 이으며, 진정이 호흡을 늦출 수 있으니 연속 감시를 유지하고, 그 감시가 보여 주는 것을 의사에게 알리며 다시 부르는 순서예요. 'it'·'that'·'that monitoring'이 앞 줄을 가리켜 순서가 하나예요.")

# context
def ctx(a,word):
    n=[x for x in S[a]['nuance'] if x.get('kind')=='context']; assert len(n)==1 and n[0]['word']==word; return n[0]
c=ctx(4,'fall')
c['scenes'][2]['en']="Your Morse score makes you a high fall risk. Remain in bed."
c['scenes'][2]['fix']="Call me before you get up, and I'll walk with you so you don't fall."
c['why']="Morse 점수 같은 평가 이름과 명령조 remain은 환자에게 딱딱하게 들려요. 넘어질까 걱정하는 이유와 함께 부탁해요."
c=ctx(0,'drink'); c['ko']='술(한 잔)'
c=ctx(9,'magnesium')
c['scenes'][2]['en']="Your magnesium and potassium are low, so you're having ventricular ectopy on tele."
c['why']="ectopy·tele 같은 말은 의료진끼리의 말이에요. 환자에게는 '칼륨·마그네슘이 낮아서 심장이 두근거릴 수 있어요'처럼 풀어 말해요."
c=ctx(20,'benzo')
c['scenes'][1]['en']="CIWA 12 to 22 despite benzo x3 (lorazepam 2 mg IV since 0200)."

yaml.safe_dump(d,open(P,'w'),allow_unicode=True,sort_keys=False,width=1000)
