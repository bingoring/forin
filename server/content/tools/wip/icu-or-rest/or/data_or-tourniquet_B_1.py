# [tag, icon, why, decoy, o1, o2, ans, w1, w2, w3]
D = {}
D[0] = dict(s=[
["압력 설정","gear","based on 뒤에 기준을 말해 압력이 임의로 정해지는 게 아니라 측정값에서 나온다는 점을 알려요. 진행형 I'm setting은 지금 하는 중이라는 뜻이에요.","the cuff alarm","사지압을 기준으로 커프 경보를 설정하고 있어요.","사지압을 기준으로 커프 크기를 설정하고 있어요.","occlusion","venous","atmospheric","hydrostatic"],
["조건부 설정","chartup","For an arm으로 조건을 먼저 깔고 we typically로 항상은 아니라는 여지를 남겨요. 상황에 따라 값이 달라지는 설정이라 조건부터 말하는 순서예요.","a louder setting","팔이면 매번 더 낮게 설정해요.","팔이면 보통 더 낮게 저장해요.","setting","volume","brightness","speed"],
["압력 확인","check","Let me …는 곧 하겠다고 미리 알리는 정중한 틀이에요. with you가 혼자가 아니라 같이 맞춰 본다는 점을 분명히 해요.","with the label","올리기 전에 압력을 간호사와 확인할게요.","올리기 전에 압력을 큰 소리로 확인할게요.","inflation","discharge","transfer","extubation"],
["사전 계산","chartup","always를 동사 앞에 두면 예외 없는 습관으로 들려요. before we inflate로 계산이 올리기 앞에 온다는 순서를 못 박아요.","the dose","올리기 전에 항상 이걸 소독해요.","올리기 전에 항상 이걸 주문해요.","calculate","sterilize","restock","relabel"],
["설정 일치","check","matches 한 낱말로 대조 결과를 짧게 보고해요. what we agreed on은 '합의한 것'을 한 덩어리 명사처럼 만드는 관계절이에요.","when we agreed","이 설정값은 우리가 주문한 것과 일치해요.","이 알람값은 우리가 합의한 것과 일치해요.","matches","exceeds","contradicts","replaces"],
], order=dict(tag="대화 흐름",icon="compass",ko="지혈대 압력 설정 4문장 순서",why="먼저 사지를 기준으로 압력을 정하고, 그 값이 팔에서는 보통 낮다는 점을 말한 뒤, 올리기 전에 그 설정을 같이 확인하고, 합의가 되면 올립니다.",lines=[
["I'm setting the cuff pressure based on the limb.","gear","사지를 기준으로 커프 압력을 설정해요","설정"],
["For an arm, that usually means a lower setting.","chartup","팔이면 보통 더 낮은 설정이에요","조건"],
["Let me confirm that setting with you before inflation.","check","올리기 전에 그 설정을 같이 확인할게요","확인"],
["Now that we agree, we can inflate.","handshake2","합의했으니 올릴 수 있어요","합의"]]))

D[1] = dict(s=[
["시각 기록","pencil","Tourniquet up처럼 동사를 줄이면 현장에서 한눈에 알아듣게 짧아요. 대시 뒤에 I'm recording it을 붙여 올린 시각을 바로 적는다고 알려요.","at this table","이 시각에 지혈대를 가져왔어요 — 기록할게요.","이 시각에 지혈대를 풀었어요 — 기록할게요.","time","height","angle","weight"],
["게시판 표시","board","Let's로 시작하면 지시가 아니라 같이 하자는 제안이에요. on the board는 팀 모두가 볼 수 있는 곳이라는 점을 짚어요.","on the wall","올린 시각을 달력에 표시합시다.","올린 시각을 모니터에 표시합시다.","board","floor","ceiling","bed"],
["허혈 추적","calendar","I'll로 내가 맡겠다는 뜻을 밝혀요. from now가 추적을 시작하는 기준점을 지금으로 못 박아요.","the case number","지금부터 허혈 징후를 추적할게요.","지금부터 출혈 시간을 추적할게요.","track","erase","reset","cancel"],
["항상 기록","pencil","always를 동사 앞에 두면 예외 없는 습관으로 들려요. we go up은 지혈대를 올리는 순간을 팀 말투로 줄인 말이에요.","we go home","푼 시각은 항상 기록해요.","올린 사람은 항상 기록해요.","time","size","color","price"],
["허혈 시작점","magnify","Ischemia time을 주어로 세워 시간이 어디서 시작하는지에 초점을 둬요. from this point가 시작점을 한 점으로 가리켜요.","from this angle","허혈 시간은 이 시점부터 표시되기 시작해요.","허혈 시간은 이 시점부터 울리기 시작해요.","starts","stops","ends","pauses"],
], order=dict(tag="대화 흐름",icon="compass",ko="적용 시각 기록 4문장 순서",why="지혈대가 올라갔다고 알린 뒤 그 시각을 적고, 적은 것을 게시판에 올려 팀이 보게 하고, 허혈 시간은 그 시각부터 센다고 마무리해요.",lines=[
["The tourniquet is up now.","bell","지혈대가 지금 올라갔어요","알림"],
["I'm writing that time down.","pencil","그 시각을 적고 있어요","기록"],
["Now let's post what I wrote on the board.","board","제가 적은 걸 게시판에 올립시다","게시"],
["Ischemia time counts from the time on the board.","calendar","허혈 시간은 게시판의 그 시각부터 세요","시작"]]))

D[2] = dict(s=[
["패딩 먼저","bandage","before applying으로 순서를 못 박아요. 패딩이 먼저고 커프가 나중이에요. We pad는 습관적인 절차를 현재형으로 말해요.","the sheet","커프를 감기 전에 사지에 소독포를 대요.","커프를 감기 전에 눈에 패딩을 대요.","applying","removing","cutting","folding"],
["손상 예방","shield","Smooth를 주어 앞에 붙여 매끄러운 상태가 보호의 조건임을 알려요. prevents는 일어나지 않게 막는다는 뜻이에요.","cuff noise","매끄러운 패딩이 피부 건조를 막아요.","매끄러운 패딩이 커프 미끄러짐을 막아요.","smooth","rough","wet","folded"],
["주름 확인","magnify","Let me …는 곧 하겠다고 미리 알리는 정중한 틀이에요. there are no wrinkles는 문제가 없는지 확인할 때 쓰는 부정 확인 틀이에요.","no pen nearby","밑에 이물이 없는지 확인할게요.","밑에 물기가 없는지 확인할게요.","underneath","overhead","outside","nearby"],
["부위 패딩","bandage","this area로 어느 부위인지 가리키며 지금 하는 일을 진행형으로 말해요. before we apply anything이 패딩이 모든 것의 앞 단계임을 알려요.","this pillow","뭘 대기 전에 이 부위에 먼저 거즈를 대고 있어요.","뭘 대기 전에 이 부위에 먼저 끈을 대고 있어요.","area","table","room","chart"],
["피부 안전","shield","Good padding을 조건처럼 앞에 두어 패딩의 질이 결과를 정한다고 말해요. keeps A safe는 A를 안전한 상태로 지킨다는 틀이에요.","inside the glove","패딩이 좋으면 커프 아래 피부가 따뜻해요.","패딩이 좋으면 커프 아래 피부가 촉촉해요.","safe","warm","pale","wet"],
], order=dict(tag="대화 흐름",icon="compass",ko="하부 패딩 적용 4문장 순서",why="패딩을 먼저 대고, 그 안에 주름이 없는지 확인하고, 매끄러워졌으면 커프를 감고, 그런 패딩이 피부를 지킨다는 설명으로 마무리해요.",lines=[
["First, I'm padding the limb.","bandage","먼저 사지에 패딩을 대고 있어요","패딩"],
["Let me check there are no wrinkles in it.","magnify","그 안에 주름이 없는지 확인할게요","확인"],
["With the padding smooth, we can apply the cuff.","check","패딩이 매끄러우니 커프를 감을 수 있어요","감기"],
["Smooth padding like that keeps the skin safe underneath.","shield","그렇게 매끄러운 패딩이 아래 피부를 지켜요","효과"]]))

D[3] = dict(s=[
["피부 살핌","magnify","Let me inspect는 곧 눈으로 살피겠다고 미리 알리는 말이에요. before we apply the cuff가 살피는 일이 감기 앞에 온다고 정해요.","the gown","패드를 감기 전에 피부를 살필게요.","드레이프를 덮기 전에 피부를 살필게요.","skin","tubing","screen","label"],
["온전한 상태","check","looks로 눈에 보이는 상태를 보고해요. with no breakdown이 피부가 무너진 곳이 없다는 소견을 뒤에 붙여요.","with no wires","사지는 부종 없이 온전해 보여요.","사지는 손상 없이 따뜻해 보여요.","intact","swollen","bruised","pale"],
["기저 기록","pencil","I'm noting은 지금 적고 있다는 진행형이에요. baseline은 나중 상태와 견줄 처음 기준이라는 뜻이에요.","the average","기저 체온 상태를 기록하고 있어요.","기저 신경 상태를 기록하고 있어요.","baseline","final","ideal","average"],
["위치 피부","check","where the cuff will sit이 아직 감기 전이라 미래형(will)으로 자리를 가리켜요. looks fine은 이상이 안 보인다는 가벼운 소견이에요.","where the wires","커프가 위치할 자리의 피부는 건조해 보여요.","커프가 위치할 자리의 피부는 차가워 보여요.","fine","cold","rough","dry"],
["항상 먼저 기록","pencil","always와 first가 겹쳐 순서가 늘 같다는 규칙으로 들려요. 상태를 먼저 적어 두어야 나중에 변화를 알아볼 수 있어요.","by phone","최종 상태를 항상 먼저 기록해요.","기저 호흡을 항상 먼저 기록해요.","baseline","final","average","random"],
], order=dict(tag="대화 흐름",icon="compass",ko="부착부 상태 확인 4문장 순서",why="감기 전에 피부를 살피고, 이상이 없다고 말한 뒤, 그 상태를 기저로 적고, 기록이 끝났으니 커프를 감아요.",lines=[
["Let me inspect the skin before the cuff goes on.","magnify","커프가 감기 전에 피부를 살필게요","살핌"],
["The skin looks fine, with no breakdown.","check","피부는 손상 없이 괜찮아 보여요","소견"],
["I'll record that condition as the baseline.","pencil","그 상태를 기저로 기록할게요","기록"],
["With the baseline recorded, we can apply the cuff.","bandage","기저를 기록했으니 커프를 감을 수 있어요","감기"]]))

D[4] = dict(s=[
["크기 선택","bandage","right로 아무 것이나가 아니라 맞는 것이라는 기준을 세워요. for this limb이 이 환자의 이 사지에 맞춘다는 점을 붙여요.","for this bed","이 사지에 맞는 커프 색깔을 고를게요.","이 사지에 맞는 커프 소재를 고를게요.","limb","room","shift","chart"],
["겹침과 조임","check","should로 지켜야 할 기준을 말해요. without being too tight가 겹치되 너무 조이지 않는다는 한계선을 그어요.","too heavy","커프는 너무 길지 않게 제대로 겹쳐야 해요.","커프는 너무 두껍지 않게 제대로 겹쳐야 해요.","overlap","slip","tear","rotate"],
["둘레 맞춤","magnify","fits … well이 맞는 정도를 부사 하나로 평가해요. circumference는 사지 둘레라는 정확한 용어예요.","the pad weight","이 크기가 길이에 잘 맞아요.","이 크기가 무게에 잘 맞아요.","circumference","weight","color","temperature"],
["가장 작은 것","bandage","the smallest … that still fits는 맞는 것들 가운데 가장 작은 것을 고르는 틀이에요. 최상급 뒤 관계절이 조건을 한정해요.","that still beeps","그래도 맞는 것 중 가장 깨끗한 커프를 골라요.","그래도 맞는 것 중 가장 싼 커프를 골라요.","smallest","cheapest","newest","oldest"],
["조임 확인","check","isn't too tight or too loose가 양쪽 한계를 한 문장에 묶어요. Let's로 둘이 같이 확인하자는 제안이에요.","or too warm","커프가 너무 조이거나 너무 길지 않은지 확인합시다.","커프가 너무 조이거나 너무 더럽지 않은지 확인합시다.","loose","noisy","shiny","dirty"],
], order=dict(tag="대화 흐름",icon="compass",ko="커프 크기 선택 4문장 순서",why="사지에 맞는 크기를 고르겠다고 하고, 맞으면서 가장 작은 커프를 꺼내고, 그 커프가 겹침과 조임이 알맞은지 보고, 느슨한지도 확인해요.",lines=[
["Let me choose the right cuff size for this limb.","bandage","이 사지에 맞는 커프 크기를 고를게요","선택"],
["Here is the smallest cuff that still fits.","check","그래도 맞는 가장 작은 커프예요","후보"],
["That one should overlap properly without being too tight.","magnify","그건 너무 조이지 않게 겹쳐야 해요","조건"],
["Let's confirm it isn't too loose either.","handshake2","너무 느슨하지도 않은지 확인합시다","확인"]]))

D[5] = dict(s=[
["경고 설정","bell","is set to + 동사는 장비에 미리 맞춰 둔 동작이라는 뜻이에요. warn us at the limit은 한계에 닿을 때 소리로 알린다는 그림이에요.","to call them","멸균기 알람은 한계에서 경고하도록 설정돼 있어요.","혈압 알람은 한계에서 경고하도록 설정돼 있어요.","warn","greet","train","charge"],
["알람 작동","check","Let me confirm이 곧 확인하겠다는 예고예요. is active는 켜져서 지금 작동 중인 상태를 가리켜요.","is expired","알람 소리가 큰지 확인할게요.","알람 배터리가 충분한지 확인할게요.","active","expired","yellow","silent"],
["들리는 알림","bell","audible은 눈이 아니라 귀로 알아차리는 알림이라는 말이에요. before max time이 알림이 최대 시간보다 앞선다고 정해요.","a printed receipt","최대 시간 전에 깜빡이는 알림을 받을 거예요.","최대 시간 전에 인쇄된 알림을 받을 거예요.","audible","invisible","expensive","private"],
["알람 설정","bell","I'm setting이 지금 맞추는 중이라는 진행형이에요. for sixty minutes는 알람이 울리기까지의 길이를 한 구로 말해요.","the curtain","소독 타이머를 육십 분으로 설정하고 있어요.","마취 타이머를 육십 분으로 설정하고 있어요.","alarm","curtain","bed","door"],
["타이머 점검","check","Check that …은 확인을 명령형으로 시키는 틀이에요. before we start로 확인이 시작 앞에 온다고 정해요.","before we eat","시작하기 전에 타이머가 충전 중인지 확인하세요.","시작하기 전에 타이머가 연결됐는지 확인하세요.","running","charging","expired","frozen"],
], order=dict(tag="대화 흐름",icon="compass",ko="시간 알람 확인 4문장 순서",why="시작 전에 타이머가 돌고 있는지 확인하고, 그 알림이 켜져 있는지 보고, 켜져 있으면 최대 시간 전에 들리는 알림이 오고, 그 알림이 한계에서 경고해요.",lines=[
["Check that the timer is running before we start.","check","시작하기 전에 타이머가 작동 중인지 확인하세요","타이머"],
["Now let me confirm its alert is active.","bell","이제 그 알람이 작동 중인지 확인할게요","알람"],
["With it active, we'll get an audible reminder before max time.","speaker","켜져 있으면 최대 시간 전에 들리는 알림이 와요","알림"],
["That reminder will warn us at the limit.","siren","그 알림이 한계에서 경고해 줄 거예요","경고"]]))

D[6] = dict(s=[
["한계 도달","siren","We're at …은 한계에 지금 와 있다는 현재 상태를 말해요. 대시 뒤 I'm alerting the team이 바로 알리는 중이라는 행동을 붙여요.","the door","교대 시간 한계에 왔어요 — 팀에 알리고 있어요.","안전 시간 한계를 넘었어요 — 팀에 알리고 있어요.","safe","lunch","visiting","shift"],
["최대 근접","chartup","is getting close to는 서서히 다가가는 중이라는 진행형이에요. the maximum이 한계점을 가리켜요.","to the entrance","허혈 시간이 평균에 가까워지고 있어요.","마취 시간이 최대치에 가까워지고 있어요.","maximum","average","entrance","window"],
["감압 질문","pager","Do we need to …?는 하자고 단정하지 않고 필요한지 묻는 질문이에요. soon으로 시점이 가깝다는 것을 덧붙여요.","upstairs","다시 공기를 빼야 할까요?","천천히 공기를 빼야 할까요?","deflate","inflate","reposition","replace"],
["한계 접근","chartup","approaching은 아직 닿지 않았지만 가까워지는 중이라는 진행형 말이에요. now가 지금 상태라는 점을 붙여요.","the red door","지금 안전 구역에 다가가고 있어요.","지금 최대 속도에 다가가고 있어요.","approaching","leaving","painting","ordering"],
["집도의 알림","pager","I'll let A know는 A에게 알리겠다는 가벼운 약속 틀이에요. we're close to the limit이 알리는 내용이에요.","to the closet","한계에 도달했다고 집도의에게 알릴게요.","봉합에 가까워졌다고 집도의에게 알릴게요.","limit","exit","corner","elevator"],
], order=dict(tag="대화 흐름",icon="compass",ko="최대 허용 시간 관리 4문장 순서",why="최대에 가까워진다고 말하고, 집도의에게 알려 주고, 한계에 닿았으면 팀에 알리고, 닿았으니 곧 공기를 빼야 하는지 물어요.",lines=[
["Ischemia time is getting close to the maximum.","chartup","허혈 시간이 최대치에 가까워지고 있어요","접근"],
["I'll let the surgeon know how close we are.","pager","얼마나 가까운지 집도의에게 알릴게요","알림"],
["Now we've reached the limit, so I'm alerting the team.","siren","이제 한계에 닿아서 팀에 알리고 있어요","도달"],
["Since we're there, do we need to deflate soon?","speech","거기까지 왔으니 곧 공기를 빼야 할까요","질문"]]))
