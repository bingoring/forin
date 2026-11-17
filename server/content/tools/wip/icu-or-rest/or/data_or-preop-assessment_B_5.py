D = {}
D[15] = dict(s=[
["전략 합의","siren","We should…로 지시가 아니라 제안하듯 말해 마취과와 합의하는 어조를 지켜요. — RSI it is는 앞 판단의 결론을 짧게 못 박는 구어체이고, RSI는 흡인 위험이 있을 때 쓰는 마취 유도 방식이에요.","— urgent","이 환자는 full stomach로 보고 RSI로 가려고 약을 챙길게요.","이 환자는 응급 수술 환자로 보고 RSI로 갈게요.","stomach","bladder","schedule","dose"],
["흡인기 준비","monitor","on and ready처럼 상태를 두 형용사로 이어 켜져 있고 쓸 수 있는 상태임을 한 번에 보고해요. at the head of the bed가 흡인기 위치를 정확히 알려요.","of the cart","흡인기를 켜기 전에 머리맡에 놓아 뒀어요.","흡인기를 켜서 이동 침대 머리맡에 준비해 뒀어요.","head","foot","corner","edge"],
["압박 대기","siren","whenever you call for it은 지시를 받는 즉시 할 수 있다는 대기 상태를 말해요. 윤상연골 압박은 부르는 쪽이 타이밍을 정하기 때문에 준비됐다고 알리는 문장이에요.","is safe","윤상연골 압박은 부르시기 전에 손을 올려요.","윤상연골 압박은 부르시면 바로 알려 드려요.","ready","painful","legal","quiet"],
["위험 정의","bulb","means로 용어를 바로 뜻풀이해 팀원이 같은 의미로 쓰게 해요. full stomach는 위에 내용물이 남아 구토·역류 때 기도로 넘어갈 위험이 큰 상태예요.","long delay","full stomach는 유도 중 출혈 위험이 크다는 뜻이에요.","full stomach는 유도 중 감염 위험이 크다는 뜻이에요.","aspiration","infection","bleeding","rejection"],
["카트 위치","gear","in case we need it fast로 가까이 두는 이유를 짧게 붙여요. keep…close는 손이 닿는 거리에 둔다는 뜻이에요.","clean","기도 카트를 가까이 두려고 바퀴 잠금을 풀게요.","빨리 필요할 수도 있으니 기도 카트를 점검할게요.","fast","later","twice","alone"],
["준비 완료","check","Everyone knows the plan으로 역할 공유가 끝났음을 보고하고, so we can move fast로 그 결과를 이어요. once you're ready는 시작 신호를 마취과에 둬요.","the rules","모두 계획을 알고 있으니 준비되면 바로 움직이려고 자리를 잡을게요.","모두 이름을 알고 있으니 준비되면 바로 움직일 수 있어요.","plan","patient","drug","room"],
], order=dict(tag="대화 흐름",icon="compass",ko="응급 환자 금식 위반 4문장 순서",why="먼저 full stomach로 보고 RSI로 간다고 정하고, 그 이유인 흡인 위험을 말하고, 흡인기를 준비했다고 보고한 뒤, 모두 계획을 알아 바로 움직일 수 있다고 마무리해요.",lines=[
["We should treat this as a full stomach — RSI it is.","siren","full stomach로 보고 RSI로 갑시다","결정"],
["That's because full stomach means high risk of aspiration during induction.","bulb","full stomach는 유도 중 흡인 위험이 크기 때문이에요","이유"],
["For that, I have suction on and ready at the head of the bed.","monitor","그래서 흡인기를 켜서 침대 머리맡에 준비해 뒀어요","흡인기"],
["With all of that in place, everyone knows the plan, so we can move fast once you're ready.","check","모두 계획을 아니 준비되면 바로 움직일 수 있어요","준비"]]))
D[16] = dict(s=[
["위험 표시","pushpin","That's a serious reaction으로 환자 경험을 가볍게 넘기지 않고 인정한 뒤, 대시 뒤에 구체적 조치를 이어요. marking A as B가 위험군 표시를 환자에게 투명하게 알려요.","for","그건 힘든 경험이네요, 고위험군으로 표시할게요.","그건 낯선 반응이네요, 고위험군으로 표시할게요.","serious","rare","strange","quiet"],
["응급약 준비","pill","We'll have A and B ready처럼 두 가지를 and로 묶고 ready로 끝내 곧바로 쓸 수 있는 상태를 말해요. 아나필락시스의 1차 약은 에피네프린이에요.","and spare gloves","에피네프린과 응급약 쓸 순서를 정해 둘게요.","에피네프린과 안내문을 준비해 둘게요.","epinephrine","morphine","insulin","heparin"],
["팀 공유","handshake2","The whole team will know로 모든 구성원이 알게 됨을 약속하고, before anything is given이 그 시점을 투여 전으로 못 박아요. is given은 누가 주는지보다 투여 자체에 초점을 둬요.","will vote","무엇이든 투여되기 전에 팀 전체가 올 거예요.","무엇이든 투여되기 전에 팀 전체가 모일 거예요.","given","sold","shipped","stored"],
["증상 열거","stetho","Exactly how did…feel로 느낌을 구체적으로 묻고, 대시 뒤에 tight·swollen·hard to breathe를 보기로 줘 환자가 말로 설명하기 어려워도 고를 수 있게 해요.","your hands feel","목이 정확히 어땠나요, 조이거나 붓거나 삼키기 어려웠나요?","목이 정확히 어땠나요, 조이거나 붓거나 말하기 어려웠나요?","tight","cold","sweet","loud"],
["원인 확인","magnify","I need to know exactly로 필요한 정보를 단도직입으로 요청해요. what medication or contrast가 약과 조영제를 함께 짚어 원인 후보를 넓게 열어 둬요.","what brand","정확히 어떤 약이나 조영제가 처음이었는지 알아야 해요.","정확히 어떤 약이나 조영제가 남았는지 알아야 해요.","contrast","food","latex","tape"],
["전체 알림","handshake2","I'll alert the whole team으로 알리는 대상이 팀 전체임을 분명히 하고, so everyone's ready로 알리는 목적을 이어요. before we give anything은 투여 앞이라는 시점을 지켜요.","so everyone's calm","무엇을 주기 전에 팀 전체가 정리되도록 알릴게요.","무엇을 주기 전에 팀 전체가 집중하도록 알릴게요.","alert","thank","bill","hire"],
], order=dict(tag="대화 흐름",icon="compass",ko="조영제 아나필락시스 병력 4문장 순서",why="증상을 구체적으로 묻고, 심각한 반응이라고 인정하며 고위험군으로 표시하고, 투여 전에 팀 전체에 알린 뒤, 알린 팀이 에피네프린과 응급약을 준비해요.",lines=[
["Exactly how did your throat feel — tight, swollen, or hard to breathe?","stetho","목이 정확히 어땠나요, 조이거나 붓거나 숨쉬기 어려웠나요?","질문"],
["That's a serious reaction — I'm marking you as high-risk.","pushpin","심각한 반응이네요, 고위험군으로 표시할게요","표시"],
["To prepare for that, I'll alert the whole team before we give anything.","handshake2","그에 대비해 투여 전에 팀 전체에 알릴게요","알림"],
["With everyone alerted, we'll have epinephrine and emergency meds ready.","pill","모두 알았으니 에피네프린과 응급약을 준비해 둘게요","준비"]]))
D[17] = dict(s=[
["투여 이력","magnify","Let's…로 함께 알아본다는 협력 어조라 환자가 추궁당한다고 느끼지 않아요. everything이 약뿐 아니라 수액·조영제·음식까지 넓게 떠올리게 해요.","everything you were wearing","그때 즈음 드신 모든 걸 파악해 봐요.","그때 즈음 투여된 모든 걸 비교해 봐요.","given","told","asked","shown"],
["임시 회피","shield","Until we know로 회피가 확정될 때까지의 임시 조치임을 밝혀요. likely culprits는 원인 후보를 범죄자에 빗댄 구어체예요.","the usual routine","확실해지기 전까지 의심되는 것들을 피하려고 메모해요.","확실해지기 전까지는 의심되는 걸 표시할게요.","culprits","visitors","routines","rumors"],
["응급약 대기","pill","on standby는 쓰지 않아도 바로 꺼낼 수 있게 대기시킨다는 뜻이에요. just in case가 지금 위험해서가 아니라 만약을 위한 준비라고 알려 환자를 안심시켜요.","on order","응급약을 바로 쓸 수 있게 서랍을 열게요.","만약을 대비해 응급 서류를 바로 쓸 수 있게 둘게요.","standby","loan","sale","trial"],
["붓기 묘사","speech","Can you describe…는 환자가 자기 말로 풀어 설명하게 하는 열린 요청이에요. exactly how가 어디서 어떻게 부었는지 순서와 모양까지 묻는 신호예요.","got dressed","얼굴과 몸이 정확히 어떻게 부었는지 그려 주시겠어요?","얼굴과 몸이 정확히 어떻게 부었는지 보여 주시겠어요?","face","hands","feet","legs"],
["위험 징후","siren","along with로 두 증상이 함께 나타나는 조합을 짚어요. can point to는 확정이 아니라 가리킨다는 신중한 표현이에요. 붓기와 어지러움이 함께면 아나필락시스를 의심해요.","can push","붓기와 함께 가려움이 있으면 심각한 반응일 수 있어요.","붓기와 함께 어지러움이 있으면 심각한 감염일 수 있어요.","Dizziness","Thirst","Hunger","Yawning"],
["관찰과 대기","stetho","watch you closely와 keep…within reach가 and로 이어져 지켜보는 일과 약을 가까이 두는 일을 함께 약속해요. within reach는 손이 닿는 거리라는 뜻이에요.","your belongings","가까이서 지켜보려고 의자를 당겨 앉을게요.","가까이서 지켜보면서 응급 서류를 손닿는 곳에 둘게요.","emergency","additional","expired","personal"],
], order=dict(tag="대화 흐름",icon="compass",ko="원인 미상 약물 반응 4문장 순서",why="그때 받은 것들을 함께 파악하자고 열고, 붓기를 구체적으로 묻고, 붓기와 어지러움이 심각한 반응을 가리킬 수 있다고 설명한 뒤, 그래서 가까이서 지켜보며 응급약을 곁에 둬요.",lines=[
["Let's figure out everything you were given around that time.","magnify","그때 즈음 투여된 모든 걸 파악해 봐요","시작"],
["For example, can you describe exactly how your face and body swelled up?","speech","예를 들어 얼굴과 몸이 어떻게 부었는지 말씀해 주시겠어요?","질문"],
["Dizziness along with swelling can point to a serious reaction.","siren","붓기와 어지러움이 함께면 심각한 반응일 수 있어요","설명"],
["Because of that, we'll watch you closely and keep emergency meds within reach.","stetho","그래서 가까이서 지켜보며 응급약을 곁에 둘게요","대비"]]))
D[18] = dict(s=[
["MH 의심","fire","could be는 확정이 아니라 가능성이라 환자를 겁주지 않으면서 중요성을 알려요. 악성 고열은 특정 마취제에 유전적으로 반응해 체온이 급상승하는 응급 상태예요.","very surprising","그건 악성 고열일 수 있어요, 아주 새로운 정보예요.","그건 악성 고열일 수 있어요, 아주 정확한 정보예요.","important","easy","funny","tiring"],
["가족력 확인","speech","Do you know if…?는 모를 수 있다는 걸 인정하는 질문이라 환자가 모른다고 답해도 괜찮아요. anyone else가 이미 말한 사람 말고 다른 가족을 묻는다는 점을 짚어요.","in the photo","가족 중에 이런 약을 쓰셨던 분이 계신지 아세요?","가족 중에 이런 입원을 하셨던 분이 계신지 아세요?","family","hospital","office","kitchen"],
["마취과 알림","handshake2","alert는 중요한 정보를 바로 알린다는 동사예요. so they can plan으로 알리는 목적을 마취과가 기법을 고르는 것에 둬요.","so they can print","새로운 기법을 계획하도록 마취과에 알릴게요.","빠른 기법을 계획하도록 마취과에 알릴게요.","alert","thank","bill","hire"],
["형제 병력","stetho","What exactly happened…로 막연한 답을 막고, 대시 뒤에 고열·근육 경직·더 심한 경우를 보기로 줘요. or worse가 보기에 없는 더 심한 증상도 말할 자리를 열어 둬요.","to your neighbor","자매분은 정확히 어땠나요, 고열이나 근육 경직, 혹은 더 심했나요?","형제분은 정확히 언제 그랬나요, 고열이나 근육 경직, 혹은 더 심했나요?","stiff","weak","sore","thin"],
["약물 선택","bulb","changes which…are safe for you로 가족력이 약 선택에 직접 영향을 준다는 인과를 보여요. 악성 고열 가족력이 있으면 유발 위험이 있는 마취제를 피하도록 계획을 바꿔요.","doubles","이런 가족력이 있으면 어떤 마취약이 비싼지가 달라져요.","이런 가족력이 있으면 어떤 마취약이 유명한지가 달라져요.","safe","cheap","famous","bitter"],
["즉시 전달","pager","right now, not after we start로 지금이라는 시점을 대조 구조로 못 박아요. 가족력은 마취 계획에 쓰이므로 시작 뒤에는 늦어요.","one by one","시작한 뒤가 아니라 지금 마취과에 전달할 수 있어요.","시작한 뒤가 아니라 지금 바로 마취과에 전달하려고 차트를 펼쳐요.","start","arrive","finish","wake"],
], order=dict(tag="대화 흐름",icon="compass",ko="마취 가족력 4문장 순서",why="형제의 증상을 구체적으로 묻고, 악성 고열 가능성을 알리고, 이런 가족력이 약 선택을 바꾼다고 설명한 뒤, 시작 전에 바로 마취과에 전달해요.",lines=[
["What exactly happened to your brother — high fever, stiff muscles, or worse?","stetho","형제분은 정확히 어땠나요, 고열이나 근육 경직인가요?","질문"],
["That could be malignant hyperthermia — very important to know.","fire","악성 고열일 수 있어요, 아주 중요한 정보예요","판단"],
["This kind of family history changes which anesthesia drugs are safe for you.","bulb","이런 가족력은 어떤 마취약이 안전한지를 바꿔요","설명"],
["Because of that, I need to send this to anesthesia right now, not after we start.","pager","그래서 시작한 뒤가 아니라 지금 바로 마취과에 전달해야 해요","전달"]]))
D[19] = dict(s=[
["약 확인","pill","Which…is it, and when…으로 약 이름과 마지막 복용 시점을 한 문장에 묻는 구조예요. 항응고제는 종류에 따라 끊어야 하는 기간이 달라서 두 가지를 같이 확인해요.","your last visit","어떤 항응고제이고, 마지막 복용량은 얼마죠?","어떤 항응고제이고, 마지막 병원 방문은 언제였나요?","dose","visit","meal","test"],
["보고 이유","pager","This changes…, so I need to…로 이유와 행동을 한 문장에 이어요. 항응고제는 출혈 위험을 바꾸므로 환자 곁에서 혼자 판단하지 않고 보고해요.","your insurance cost","치료 비용이 달라지니 지금 바로 보고해야 해요.","출혈 위험이 달라지니 보고하려고 차트를 펼쳐요.","bleeding","falling","sleeping","fainting"],
["팀 결정","handshake2","The team will decide로 결정권이 팀에 있음을 밝히고, whether to delay or proceed로 두 갈래 가능성을 열어 둬요. safely는 어느 쪽이든 안전이 기준이라는 부사예요.","or retire","지연할지 진행할지는 팀에서 신속하게 결정할 거예요.","지연할지 진행할지는 팀에서 공개적으로 결정할 거예요.","decide","argue","guess","wonder"],
["복용 확인","calendar","When exactly와 and how much를 이어 시각과 양을 함께 묻는 짧은 질문이에요. take는 약을 먹는다는 가장 흔한 동사라 환자가 바로 알아들어요.","did you find it","정확히 누가, 얼마나 드셨어요?","정확히 언제, 얼마나 만드셨어요?","take","buy","keep","lose"],
["자책 덜기","faceWorried","Nobody told you…으로 환자가 몰랐던 이유를 먼저 짚고, so this isn't your fault로 결론을 내려 죄책감을 덜어 줘요. 환자가 정직하게 말하도록 돕는 말이에요.","to hold it","아무도 가져오라고 말씀 안 드렸으니 환자분 잘못이 아니에요.","아무도 적으라고 말씀 안 드렸으니 환자분 잘못이 아니에요.","fault","plan","job","turn"],
["즉시 보고","pager","right away가 지연 없는 즉시 보고임을 알려요. so the team can reassess safely로 보고의 목적이 팀의 재평가임을 밝혀요.","with a form","팀이 안전하게 재정리하도록 지금 바로 보고할게요.","팀이 안전하게 재교육하도록 지금 바로 보고할게요.","reassess","rename","rebuild","reprint"],
], order=dict(tag="대화 흐름",icon="compass",ko="항응고제 미확인 도착 4문장 순서",why="약 이름과 마지막 복용을 묻고, 몰랐던 건 환자 잘못이 아니라고 안심시키고, 출혈 위험이 달라져 팀에 보고해야 한다고 알린 뒤, 팀이 지연 여부를 정한다고 해요.",lines=[
["Which blood thinner is it, and when was your last dose?","pill","어떤 항응고제이고 마지막 복용은 언제였나요?","질문"],
["Nobody told you to stop it, so this isn't your fault.","faceWorried","끊으라고 한 사람이 없으니 환자분 잘못이 아니에요","안심"],
["Even so, this changes your bleeding risk, so I need to report it to the team now.","pager","그래도 출혈 위험이 달라지니 팀에 지금 보고해야 해요","보고"],
["They'll decide whether to delay or proceed safely.","handshake2","지연할지 진행할지 그쪽에서 안전하게 결정해요","결정"]]))
D[20] = dict(s=[
["금식 불명","siren","We can't confirm…, so assume…로 확인이 안 될 때의 안전 쪽 가정을 짧게 말해요. 금식 여부를 모르면 위가 찼다고 보고 흡인에 대비해요.","his name tag","금식 여부를 확인할 수 없으니 full stomach로 기록할게요.","금식 여부를 확인할 수 없으니 full stomach로 설명할게요.","confirm","change","weigh","repeat"],
["흡인기 보고","monitor","Suction is set up과 I'm ready for RSI를 and로 이어 준비 상황을 두 가지로 나눠 보고해요. set up은 장비를 쓸 수 있게 갖춰 놓았다는 뜻이에요.","for rounds","흡인기는 준비됐고 RSI 약을 확인해요.","흡인기는 준비됐고 기록 준비도 됐어요.","RSI","MRI","EKG","CBC"],
["카트 위치","gear","Let's have A right here at B로 장비와 위치를 한 문장에 못 박아요. right here와 at the bedside가 겹쳐 지금 바로 손이 닿는 곳이라는 점을 강조해요.","over there","기도 카트를 두려고 잠금을 풀게요.","기도 카트 목록을 바로 침상 곁에 둘게요.","bedside","doorway","hallway","entrance"],
["일반 원칙","bulb","Unconscious patients를 주어로 일반 원칙을 말해 특정 환자에게 하는 결정이 아니라 표준 절차임을 알려요. every time이 예외가 없다는 뜻이에요.","on paper","의식 없는 환자는 매번 full stomach로 기록해요.","의식 없는 환자는 매번 full stomach로 설명해요.","Unconscious","Unmarried","Unpaid","Uninsured"],
["최악 가정","siren","assume the worst case는 불확실할 때 더 위험한 쪽으로 가정해 대비한다는 구예요. Nobody can confirm이 확인할 사람이 아무도 없다는 점을 밝혀요.","his insurance card","마지막 연락을 확인할 수 없으니 최악의 경우로 간주해요.","마지막 약속을 확인할 수 없으니 최악의 경우로 간주해요.","meal","visit","call","note"],
["준비 완료","check","Everything is ready로 상태를 먼저 보고하고, so we can move fast로 그 결과를 이어요. the moment he needs it은 필요한 바로 그 순간에 움직인다는 뜻이에요.","so we can chat","다 준비됐으니 필요한 순간 움직이려고 자리를 잡아요.","다 확인됐으니 필요한 순간 바로 움직일 수 있어요.","ready","late","empty","closed"],
], order=dict(tag="대화 흐름",icon="compass",ko="금식 확인 불가 4문장 순서",why="마지막 식사를 확인할 수 없어 최악의 경우로 보고, 그래서 의식 없는 환자는 매번 full stomach로 다루며, 그에 맞춰 흡인기와 RSI를 준비했다고 보고한 뒤, 모든 준비가 끝났다고 마무리해요.",lines=[
["Nobody can confirm his last meal, so we assume the worst case.","siren","마지막 식사를 확인할 수 없으니 최악의 경우로 간주해요","가정"],
["That's why unconscious patients get treated as a full stomach every time.","bulb","그래서 의식 없는 환자는 매번 full stomach로 처치해요","원칙"],
["For that, suction is set up and I'm ready for RSI.","monitor","그래서 흡인기와 RSI 준비가 됐어요","준비"],
["With all of that, everything is ready, so we can move fast the moment he needs it.","check","다 준비됐으니 필요한 순간 바로 움직일 수 있어요","마무리"]]))
