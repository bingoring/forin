# B 검토 새 값 — or-difficult-airway. 대상 파일은 건드리지 않고 사본을 만든다.
import yaml, sys, os
D=os.path.dirname(os.path.abspath(__file__))
src=os.path.join(D,'or-difficult-airway.yaml'); dst=os.path.join(D,'_reviewB_or-difficult-airway_after.yaml')
d=yaml.safe_load(open(src))
def O(*xs): return [{'en':x} for x in xs]
P={
# (상황, 문장): 필드
(0,1):{'blank':('predictors',O('predictors','complications','outcomes','treatments'))},
(0,3):{'blank':('difficult',O('difficult','routine','planned','smooth'))},
(0,5):{'blank':('history',O('history','schedule','consent','policy')),'decoy':'about his last meal'},
(1,3):{'blank':('tonsils',O('tonsils','teeth','lips','cheeks'))},
(2,0):{'dk':['어려운 기도 카트를 회복실로 가져오고 있어요.','어려운 기도 카트를 복도 쪽으로 가져오고 있어요.']},
(2,2):{'dk':['원하시면 카트는 준비되어 있어요.','필요하면 카트는 복도에 있어요.']},
(2,3):{'blank':('together',O('together','tomorrow','downstairs','overnight'))},
(2,4):{'dk':['윤상갑상막절개 키트는 밀봉되어 있고 기한이 포장에 적혀 있어요.','윤상갑상막절개 키트를 확인하려고 카트 서랍에서 꺼내요.']},
(3,1):{'blank':('size',O('size','color','brand','label'))},
(3,2):{'dk':['손 닿는 곳에 충전해 뒀어요.','당신 눈에 보이는 곳에 놓아 뒀어요.']},
(3,3):{'dk':['시야가 피로 흐려지면 흡인 팁을 건넬게요.','시야가 연기로 흐려지면 흡인할게요.'],'blank':('bloody',O('bloody','smoky','narrow','foggy'))},
(4,0):{'dk':['보조할 사람을 세 명 더 준비해 뒀어요.','보조할 사람을 한 명 더 찾고 있어요.'],'blank':('second',O('second','third','fourth','tenth'))},
(4,2):{'dk':['추가 장비가 대기 중이에요.','추가 인력이 교대 중이에요.'],'blank':('hands',O('hands','carts','beds','lights'))},
(4,3):{'blank':('cricoid',O('cricoid','drapes','linens','gowns'))},
(4,4):{'blank':('close',O('close','seated','outside','quiet'))},
(5,3):{'dk':['잠드는 동안 마스크가 새면 산소가 빠져나가요.','완전히 잠들 때까지 마스크 끈을 밀착시켜 두세요.']},
(6,2):{'dk':['모두가 백업 장비를 알고 있어야 해요.','모두가 백업 단계를 적어 두어야 해요.'],'blank':('know',O('know','sign','draw','print'))},
(6,3):{'blank':('wake',O('wake','cheer','warm','tidy'))},
(7,0):{'blank':('airway',O('airway','wound','skin','eye'))},
(7,1):{'why':'Let me로 내가 맡겠다고 알리고, through each step은 시작 때 한 번이 아니라 끝까지 계속한다는 뜻이에요. 각성 삽관은 환자가 깨어 있어서 말로 안심시켜야 협조가 이어져요.'},
(8,0):{'dk':['후두마스크를 건네려고 지금 바로 포장을 뜯을게요.','후두마스크를 건네주세요 — 산소포화도가 떨어져서요.']},
(8,1):{'blank':('quickly',O('quickly','quietly','neatly','formally'))},
(8,2):{'dk':['들어가면 흉곽을 보려고 커프를 채워요.','포장이 열리면 흉곽 상승을 확인할게요.'],'blank':('confirm',O('confirm','chart','print','sign'))},
(8,3):{'dk':['입안 흡인이 끝나서 지금 후두마스크를 넣고 있어요.','마스크로 환기가 안 돼서 후두마스크를 넣으려고 도움을 구해요.']},
(8,4):{'dk':['좋아요, 흉곽이 오르고 있고 체온이 돌아오고 있어요.','좋아요, 흉곽이 오르고 있고 혈압이 돌아오고 있어요.']},
(9,0):{'dk':['여기 부지요 — 끝이 휘어져 있는 거예요.','여기 부지요 — 튜브를 넣으려고 끝에 젤을 발라요.']},
(9,1):{'dk':['교환기를 네 개 준비해 뒀어요.','튜브 교환기를 소독하러 보냈어요.']},
(9,3):{'dk':['튜브를 밀어 넣는 동안 부지가 빠지지 않게 하려는 거예요.','튜브를 밀어 넣는 동안 부지를 쥐려고 손을 뻗을게요.'],'blank':('steady',O('steady','loose','slack','sideways'))},
(9,4):{'blank':('exchanger',O('exchanger','camera','monitor','catheter')),'decoy':'to the oral airway'},
(10,1):{'blank':('improve',O('improve','limit','block','measure'))},
(10,4):{'dk':['안전하게 자세를 잡으려면 베개가 더 필요해요.','안전하게 마스크를 잡으려면 도와줄 손이 더 필요해요.'],'blank':('safely',O('safely','flat','prone','later'))},
(11,1):{'dk':['다음 계획으로 넘어가려고 모여요.','그 다음엔 다음 환자로 넘어가요.']},
(11,3):{'blank':('loud',O('loud','quietly','later','privately'))},
(11,4):{'decoy':'and clean the blade','dk':['실패하면 계획을 바꾸려고 알고리즘을 봐요.','이번 시도도 실패하면 부종이 더 심해져요.']},
(12,0):{'blank':('bag',O('bag','tube','turn','move'))},
(12,1):{'blank':('attempt',O('attempt','dose','incision','transfer'))},
(12,2):{'dk':['우선순위는 수술이 아니라 산소예요.','산소를 우선하려고 튜브를 내려놓아요.'],'blank':('oxygen',O('oxygen','fluids','imaging','labs'))},
(12,3):{'dk':['삽관 시도를 멈추고 환기시키려고 백을 쥐어요.','삽관 시도를 멈추면 부종이 덜 생겨요.'],'blank':('intubate',O('intubate','sedate','transfer','extubate')),
        'why':'Stop trying은 하던 일을 끊으라는 명령이고, and 뒤에서 곧바로 할 일을 이어 줘요. now가 지금 이 순간을 못 박아요.'},
(12,4):{'blank':('saturating',O('saturating','talking','eating','walking')),'decoy':'wake him up'},
(13,3):{'dk':['흡인을 맡는 사람이 따로 있어야 시야가 안 가려져요.','저는 흡인 담당을 맡으려고 흡인기를 미리 켜 둘게요.'],'blank':('airway',O('airway','chart','phones','door'))},
(14,0):{'dk':['후두마스크, 부지, 윤상절개 키트가 모두 소독돼 준비돼 있어요.','후두마스크, 부지, 흡인 카테터가 모두 꺼내져 준비돼 있어요.']},
(14,4):{'decoy':'to any other case'},
(15,0):{'blank':('situation',O('situation','drill','simulation','lecture')),'decoy':'checklist'},
(15,1):{'dk':['응급 전경부 접근으로 넘어가려고 소리쳐요.','산소화가 안 되면 몇 분 안에 뇌가 손상돼요.'],'blank':('emergency',O('emergency','routine','elective','planned')),'decoy':'to scheduled'},
(15,2):{'dk':['윤상절개 키트를 열려고 봉인 띠를 당겨요.','윤상절개 키트를 열어야 산소 길이 생겨요.'],'blank':('help',O('help','water','tape','towels')),'decoy':'Get the door'},
(15,4):{'dk':['전경부 접근 프로토콜을 시작하려고 모두 불러요.','전경부 접근을 해야 산소가 들어가요.']},
(16,0):{'dk':['메스를 건네드리려고 손잡이를 단단히 잡아요.','윤상절개 키트가 열렸어요 — 포화도가 계속 떨어져요.'],'decoy':'the gauze'},
(16,1):{'dk':['후두를 찾으려고 손을 대요.','후두를 고정하면 막이 만져져요.'],'blank':('larynx',O('larynx','tongue','pelvis','ankle'))},
(16,2):{'dk':['막에 닿는 순간 말씀해 주세요.','막을 통과하는 순간 메스를 돌리세요.'],'decoy':'the skin'},
(16,3):{'dk':['키트가 왔고 메스를 준비해 뒀어요.','키트가 열렸고 메스는 아직 포장째예요.']},
(17,0):{'blank':('low',O('low','high','variable','elevated'))},
(17,1):{'decoy':'to reposition'},
(17,3):{'dk':['산소포화가 안 되고 있고 여전히 고열이에요.','산소포화가 안 되고 있고 여전히 저혈압이에요.']},
(17,4):{'dk':['산소를 밀어붙이려고 마스크를 눌러요.','코드 대응을 미리 준비해야 심정지 때 늦지 않아요.'],'blank':('oxygen',O('oxygen','the bed','the cart','the door')),'decoy':'and check the IV'},
(18,0):{'blank':('unanticipated',O('unanticipated','anticipated','expected','obvious'))},
(18,1):{'dk':['실패 기도 알고리즘으로 바꾸려고 카드를 펴요.','알고리즘을 따라야 시도를 되풀이하지 않아요.']},
(18,2):{'dk':['카트를 들여오려고 문을 잡으세요.','어려운 기도 카트에 백업 장비를 다 모아 둬요.'],'blank':('cart',O('cart','scale','chair','bed')),'decoy':'Get the crash cart'},
(18,3):{'blank':('view',O('view','noise','smell','lighting'))},
(18,4):{'dk':['모두 실패 기도 계획으로 넘어가려고 자리에 서요.','실패 기도 계획을 다 같이 따라야 혼선이 없어요.'],'decoy':'intubation drill'},
(19,0):{'decoy':'— no saline'},
(19,1):{'dk':['전경부로 가려고 목을 펴요.','완전 폐쇄면 위로는 길이 없어요.'],'blank':('access',O('access','x-ray','exam','massage')),'decoy':'dressing'},
(19,2):{'decoy':'for a consult'},
(19,3):{'blank':('air',O('air','saline','fluid','dust'))},
(19,4):{'dk':['윤상절개 키트로 가려고 몸을 돌려요.','완전 폐쇄라서 외과의 손이 꼭 필요해요.'],'blank':('cric',O('cric','lab','dental','suture')),'decoy':'to the code cart'},
(20,1):{'blank':('alert',O('alert','drill','lecture','survey')),'decoy':'in the newsletter'},
(20,2):{'blank':('history',O('history','schedule','supplies','costs'))},
(20,4):{'decoy':'IV access alert'},
}
for (si,i),f in P.items():
    x=d['situations'][si]['sentences'][i]
    if 'dk' in f: x['distractorsKo']=f['dk']
    if 'blank' in f: x['blank']={'answer':f['blank'][0],'options':f['blank'][1]}
    if 'decoy' in f: x['decoy']=f['decoy']
    if 'why' in f: x['why']=f['why']
def L(en,ko,note,icon): return {'en':en,'icon':icon,'ko':ko,'note':note}
S=d['situations']
o=S[9]['order']; o['lines'][3]=L("If it still won't pass, we move to the next plan.","그래도 안 들어가면 다음 계획으로 넘어가요",'대안','compass')
o['why']='부지를 건네며 기관 클릭이 느껴지는지 묻고, 느껴지면 튜브를 밀어 넣으라 하고, 그동안 부지를 잡아 주겠다고 하고, 그래도 안 되면 다음 계획으로 넘어간다고 해요.'
o=S[12]['order']; o['lines'][2]=L("While you bag him, let's get his saturation up before another attempt.","백을 짜는 동안 다음 시도 전에 산소포화도를 올려요",'회복','monitor')
o=S[13]['order']; o['lines'][2]=L("If anyone's unsure of that split, ask before we start.","그 분담이 확실하지 않으면 시작 전에 물어보세요",'질문','bulb')
o=S[14]['order']
o['lines'][1]=L("That puts the LMA, bougie, and cric kit out and ready.","그러면 후두마스크, 부지, 윤상절개 키트가 꺼내져 준비돼요",'보고','check')
o['lines'][2]=L("I've checked that all three are within reach.","셋 다 손 닿는 곳에 있는지 확인했어요",'확인','pushpin')
o['lines'][3]=L("So we're ready to move to any backup plan quickly.","그래서 어떤 백업 계획으로든 빨리 넘어갈 수 있어요",'선언','shield')
o=S[16]['order']; o['lines'][3]=L("As soon as you say so, I'll hand you the bougie.","말씀하시는 즉시 부지를 건네드릴게요",'지원','handshake2')
o['why']='키트가 열렸고 메스를 건넨다고 하고, 메스를 쥔 동안 후두를 잡아 준다고 하고, 후두가 고정되면 막을 통과하는 순간을 말해 달라 하고, 말하는 즉시 부지를 건넨다고 해요(메스 → 부지 → 튜브 순서).'
o=S[19]['order']; o['lines'][3]=L("Start the cric now — the surgeon can take over on arrival.","지금 윤상절개를 시작하고, 외과의가 오면 넘겨요",'시작','scalpel')
o['why']='완전 폐쇄를 선언하고, 그래서 전경부 접근으로 간다고 하고, 그러려면 키트로 가서 외과의를 부르라 하고, 외과의를 기다리지 말고 지금 시작한다고 해요.'
yaml.safe_dump(d,open(dst,'w'),allow_unicode=True,sort_keys=False,width=1000)
print('wrote',dst)
