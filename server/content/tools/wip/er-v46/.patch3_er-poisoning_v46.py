import re,glob
D='/Users/ywyeom/private/forin/server/content/tools/wip/er-v46/'
fs=sorted(glob.glob(D+'add_er-poisoning_v46_*.yaml'))
txt={f:open(f).read() for f in fs}
def rep(old,new):
    n=sum(t.count(old) for t in txt.values()); assert n==1,(old,n)
    for f in fs:
        if old in txt[f]: txt[f]=txt[f].replace(old,new)
def line(old_en,new_en,new_ko):
    # replace en and ko of the order line whose en == old_en
    for f in fs:
        pat=re.compile(r'(- \{en: )"'+re.escape(old_en)+r'"(, icon: \w+, ko: )"[^"]*"')
        m=pat.search(txt[f])
        if m:
            txt[f]=pat.sub(lambda mm: f'{mm.group(1)}"{new_en}"{mm.group(2)}"{new_ko}"',txt[f],count=1); return
    raise Exception(old_en)
def why(sit_title,new):
    for f in fs:
        i=txt[f].find('- title: '+sit_title+'\n')
        if i<0: continue
        j=txt[f].find('    why: "',i); k=txt[f].find('\n',j)
        txt[f]=txt[f][:j]+'    why: "'+new+'"'+txt[f][k:]; return
    raise Exception(sit_title)
line("Was there anything else along with them?","Was there anything else along with that amount?","그 양과 함께 먹은 다른 게 있나요?")
line("Do you have the bottle for all of that with you?","Do you have the bottle for everything you've told me about?","말씀하신 모든 것의 병을 가지고 계신가요?")
why("복용 약물·시간 문진","무엇을 먹었는지 묻고, 그 약의 개수와 시각을 묻고, 그 양과 함께 먹은 것을 확인한 뒤, 말한 모든 것의 병을 가져왔는지 물어요. 'those pills'·'that amount'·'everything you've told me about'이 앞 줄을 가리켜 순서가 하나예요.")
line("Thank you for telling me — I won't judge you for it.","Thank you for telling me — I won't judge you, and I'm keeping you safe.","말해 줘서 고마워요, 판단하지 않고 안전하게 지켜 드릴게요")
line("Is anyone at home in danger from any of this?","Is there anyone else at home who might be in danger?","집에 위험할 수 있는 다른 분이 계신가요?")
why("의도성 여부 초기 사정","민감한 질문임을 알리고, 직접 묻고, 말해 준 것에 감사하며 안심시킨 뒤, 집에 위험한 다른 사람이 있는지 물어요. 'Thank you for telling me'가 앞 줄의 답을 가리키고 'anyone else'가 앞 줄의 'you'를 가리켜 순서가 하나예요.")
line("Which products did you mix? I want to know what you breathed in.","With that answer, I need to know which products you mixed.","그 답을 듣고 어떤 제품을 섞으셨는지 알아야 해요")
why("가정 화학물질 노출","숨 쉬는 데 문제가 있는지 먼저 확인하고, 그 답을 듣고 섞은 제품을 묻고, 그 제품으로 독극물센터에 전화하고, 센터가 알려 줄 처치 시간을 말해요. 'that answer'·'those products'·'They'가 앞 줄을 가리켜 순서가 하나예요.")
line("How many pills are left in the bottle she had?","How many pills were in the bottle at that time, and how many are left?","그때 병에 알약이 몇 개 있었고 지금 몇 개 남았나요?")
line("You did the right thing bringing her in after that.","You did the right thing bringing her in with the bottle.","병을 가지고 아이를 데려오신 건 잘하신 거예요")
why("소아 우발 섭취","발견한 시각을 묻고, 그때의 알약 수를 묻고, 병을 들고 데려온 것을 인정하고, 이제부터 맡겠다고 닫아요. 'that time'·'the bottle'·'From here'가 앞 줄을 가리켜 순서가 하나예요.")
line("That's why we'll check your acetaminophen level at the right time.","That's why we'll check your acetaminophen level and the exact time you took it.","그래서 아세트아미노펜 수치와 드신 정확한 시각을 확인할게요")
line("We'll start NAC now so your liver has the best chance.","Using both of those, we'll start NAC now so your liver has the best chance.","그 둘을 바탕으로 간이 가장 좋은 기회를 갖도록 지금 NAC를 시작할게요")
why("아세트아미노펜 과다","지금 괜찮아도 나중에 위험할 수 있다고 알리고, 그래서 수치와 먹은 시각을 확인하고, 그 둘을 바탕으로 NAC를 시작하고, 단계마다 설명하겠다고 닫아요. 'That's why'·'both of those'·'it'이 앞 줄을 가리켜 순서가 하나예요.")
line("It can wear off, so we'll keep watching him closely.","Even when it improves, it can wear off, so we'll keep watching him closely.","나아져도 효과가 떨어질 수 있어서 계속 가까이서 지켜볼게요")
why("오피오이드 과다","호흡을 먼저 지지하고, 호흡이 지지된 상태에서 날록손을 투여하고, 호흡이 나아지는 것을 알리고, 나아져도 효과가 떨어질 수 있어 계속 지켜본다고 닫아요. 'his breathing'·'it improves'가 앞 줄을 가리켜 순서가 하나예요.")
line("The ringing in your ears is a clue that the level is high.","With that many, the ringing in your ears is a clue the level is high.","그만큼 드셨으면 귀 울림은 수치가 높다는 단서예요")
line("We'll keep checking your breathing and blood levels closely.","We'll keep checking your breathing and blood levels to see it work.","그것이 듣는지 보도록 호흡과 혈액 수치를 계속 확인할게요")
why("살리실산 중독","먹은 양과 기간을 묻고, 그만큼이면 귀 울림이 수치가 높다는 단서라고 알리고, 그 수치를 내리는 치료를 설명하고, 치료가 듣는지 계속 확인한다고 닫아요. 'that many'·'that level'·'it'이 앞 줄을 가리켜 순서가 하나예요.")
line("To keep the monitor reading clearly, stay still for me.","The monitor will show us if it's working, so please stay still for me.","모니터가 그게 듣는지 보여 줄 거라서 가만히 계세요")
why("TCA 과다","심장 리듬을 지켜본다고 알리고, 그 이유를 설명하고, 이유에 이어 보호 치료를 알리고, 모니터가 효과를 보여 주도록 움직이지 말라고 요청해요. 'That's because'·'that'·'it'이 앞 줄을 가리켜 순서가 하나예요.")
line("There's a reversal medicine we can give if the bleeding gets worse.","If what you're seeing gets worse, there's a reversal medicine we can give.","지금 보이는 게 심해지면 드릴 수 있는 역전제가 있어요")
why("항응고제 과다","INR로 혈액이 얼마나 묽은지 확인하고, 그만큼 묽은 상태에서 어디에 출혈이 있는지 묻고, 보이는 것이 심해지면 쓸 역전제를 알리고, 그래서 새 출혈을 지켜본다고 닫아요. 'that thin'·'what you're seeing'·'That's why'가 앞 줄을 가리켜 순서가 하나예요.")
line("Can you tell me each thing you took so we can keep you safe?","To help with that pain, can you tell me each thing you took?","그 고통을 돕기 위해 드신 것을 하나하나 말씀해 주시겠어요?")
why("자살시도 다약제","고통에 먼저 공감하고, 그 고통을 돕기 위해 먹은 것을 빠짐없이 묻고, 그 정보를 상담사와 나누겠다고 알리고, 그 과정 내내 곁에 있다고 닫아요. 'that pain'·'all of that'·'that'이 앞 줄을 가리켜 순서가 하나예요.")
line("With that in mind, I'll check your oxygen and alertness every few minutes.","With that amount in mind, I'll check your oxygen and alertness every few minutes.","그 양을 감안해 산소와 각성 상태를 몇 분마다 확인할게요")
why("알코올+약물 혼합","호흡이 느려질 위험을 알리고, 그래서 먹은 양을 묻고, 그 양을 바탕으로 확인 주기를 알리고, 그 확인 사이에 깨어 있게 부탁해요. 'That's why'·'that amount'·'those checks'가 앞 줄을 가리켜 순서가 하나예요.")
line("You're on high-flow oxygen to clear it from your blood.","Whatever the test shows, you're on high-flow oxygen to clear it from your blood.","검사 결과가 어떻든 혈액에서 씻어내도록 고유량 산소를 드려요")
why("일산화탄소 중독","일반 산소 수치가 정상처럼 보일 수 있다고 알리고, 그래서 특별한 검사를 쓰고, 검사 결과와 무관하게 일산화탄소를 씻어 내는 산소를 주고, 그 산소를 수치가 안전해질 때까지 이어요. 'That's why'·'the test'·'it'이 앞 줄을 가리켜 순서가 하나예요.")
line("Some of your signs tell me your body reacted to something.","Still, some of your signs tell me your body reacted to something.","그래도 몇 가지 징후를 보면 몸이 뭔가에 반응한 것 같아요")
line("Your care team just wants to understand what happened, not to blame you.","Beyond that, your care team just wants to understand what happened, not to blame you.","그 밖에 의료팀은 탓하려는 게 아니라 무슨 일인지 이해하고 싶은 거예요")
why("약물 은폐 환자","처벌하러 온 게 아니라고 먼저 말하고, 그래도 몸의 징후를 근거로 대화를 열고, 그 이야기의 비밀 범위를 알리고, 그 밖에 팀이 이해하려는 목적으로 닫아요. 'Still'·'it'·'Beyond that'이 앞 줄을 가리켜 순서가 하나예요.")
line("Can you take report while I stay with the airway?","With naloxone requested, can you take report while I stay with the airway?","날록손을 요청했으니, 제가 기도를 맡는 동안 인계 받으실 수 있나요?")
why("미상 물질 의식불명","동공과 호흡수를 보고하고, 그것이 톡시드롬 같아 기도를 보호한다고 알리고, 기도가 보호된 상태에서 날록손을 요청하고, 요청한 뒤 기도를 맡은 채 인계를 부탁해요. 'That'·'With the airway protected'·'With naloxone requested'가 앞 줄을 가리켜 순서가 하나예요.")
line("With the trigger stopped, we're cooling you down to calm your body.","Cooling you down helps calm your body from what the trigger caused.","식혀 드리면 유발 원인이 일으킨 반응에서 몸이 진정돼요")
why("세로토닌 증후군","씰룩임과 고열이 약물 상호작용을 시사한다고 알리고, 그 약 가운데 새 것을 묻고, 의심되는 약을 모두 멈추고, 식혀서 원인이 일으킨 반응을 가라앉힌다고 닫아요. 'those medications'·'every one'·'the trigger'가 앞 줄을 가리켜 순서가 하나예요.")
line("There's an antidote we're giving now, and you may need urgent dialysis.","For that, there's an antidote we're giving now, and you may need urgent dialysis.","그에 대해 지금 드리는 해독제가 있고 긴급 투석이 필요할 수도 있어요")
why("청산/메탄올 중독","마신 양과 시점을 묻고, 그 뒤의 시야 문제가 메탄올 중독일 수 있다고 알리고, 그에 대한 해독제와 투석을 설명하고, 그래서 서두른다고 닫아요. 'that'·'For that'·'That's why'가 앞 줄을 가리켜 순서가 하나예요.")
line("Stay with me and tell me if your heart races or skips.","Stay with me, and tell me if that rhythm makes your heart race or skip.","정신 놓지 마시고, 그 리듬 때문에 심장이 빨리 뛰거나 건너뛰면 말씀해 주세요")
why("과다복용 심정지 전조","리듬이 불안정하다고 알리고, 그 리듬 때문에 느껴지는 변화를 바로 말하게 하고, 모니터로 새 변화를 지켜본다고 알리고, 그래서 팀이 준비됐다고 닫아요. 'that rhythm'·'Whatever you feel'·'That's why'가 앞 줄을 가리켜 순서가 하나예요.")
for f in fs: open(f,'w').write(txt[f])
print('ok')
