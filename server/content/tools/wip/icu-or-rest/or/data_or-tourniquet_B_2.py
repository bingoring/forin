D = {}
D[7] = dict(s=[
["풀기 예고","pager","I'm about to로 곧 할 일을 예고하고, 대시 뒤 everyone ready?로 팀의 준비를 바로 물어요. 푸는 순간 혈역학이 변하니 미리 알리는 거예요.","— everyone seated","붕대를 곧 풀 거예요 — 다들 준비됐나요?","브레이크를 곧 풀 거예요 — 다들 준비됐나요?","release","tighten","label","order"],
["마취과 대비","stetho","이름을 먼저 부르고 쉼표 뒤에 요청을 말하면 누구에게 하는 말인지 분명해요. be prepared for는 일어날 일에 미리 대비하라는 틀이에요.","for color changes","마취과는 체위 변화에 대비해 주세요.","마취과는 온도 변화에 대비해 주세요.","reperfusion","staffing","billing","menu"],
["감압 알림","siren","Deflating now처럼 -ing 한 낱말로 지금 하는 일을 짧게 알려요. watch가 대시 뒤에서 지켜볼 대상을 명령으로 건네요.","the corridor","곧 공기를 빼요 — 혈압을 지켜보세요.","천천히 공기를 빼요 — 혈압을 지켜보세요.","blood","tire","water","air"],
["빼기 전 고지","pager","I'm letting A know는 A에게 지금 알리는 중이라는 진행형이에요. before we deflate로 알림이 빼기 앞에 온다고 정해요.","the printer","수술을 시작하기 전에 팀에 알리고 있어요.","교대하기 전에 팀에 알리고 있어요.","deflate","inflate","leave","eat"],
["모두 준비","check","Everyone needs to …가 예외 없이 모두의 몫이라는 뜻이에요. before I release it이 푸는 일이 준비 뒤에 온다고 정해요.","to be paid","제가 풀기 전에 모두 서명해야 해요.","제가 풀기 전에 모두 모여야 해요.","ready","tired","paid","seated"],
], order=dict(tag="대화 흐름",icon="compass",ko="재관류 전 팀 고지 4문장 순서",why="곧 풀겠다고 알려 준비를 묻고, 마취과에 뒤따를 변화를 대비시키고, 공기를 빼면서 혈압을 지켜보게 하고, 내려간 뒤 변화가 있으면 말하게 해요.",lines=[
["I'm about to release the tourniquet — everyone ready?","pager","지혈대를 곧 풀 거예요 — 다들 준비됐나요","예고"],
["Anesthesia, be prepared for the changes that will bring.","stetho","마취과는 그로 인한 변화에 대비해 주세요","대비"],
["Deflating now — watch the blood pressure.","siren","지금 공기를 빼요 — 혈압을 지켜보세요","감압"],
["Tell me if anything changes after it's down.","speech","내려간 뒤 변화가 있으면 말해 주세요","보고"]]))

D[8] = dict(s=[
["기록과 공유","board","is now recorded and shared는 두 동사를 and로 묶어 기록과 공유가 모두 끝났다는 완료 상태를 알려요. Total이 합계라는 점을 앞에 세워요.","and priced","평균 허혈 시간이 이제 기록되고 공유됐어요.","남은 허혈 시간이 이제 기록되고 공유됐어요.","shared","hidden","sealed","locked"],
["정기 호명","speaker","I'll call out은 곧 하겠다는 약속이고 call out은 소리 내어 알린다는 구동사예요. every fifteen minutes가 반복 간격을 알려요.","the date","십오 분마다 시간을 문자로 알릴게요.","십오 분마다 시간을 방송으로 알릴게요.","time","price","menu","color"],
["모두 알기","speech","Everyone should know로 시작하면 누구 한 사람의 일이 아니라 팀 전체가 알아야 할 일이라는 느낌이 나요. how long이 길이를 묻는 의문사예요.","how loud","커프가 얼마나 높이 올라가 있었는지 모두 알아야 해요.","커프가 얼마나 단단히 올라가 있었는지 모두 알아야 해요.","long","high","tight","loud"],
["정기 안내","speaker","announce는 여러 사람이 듣게 알린다는 뜻이에요. the total time이 알리는 내용이고 every fifteen minutes가 반복 간격이에요.","the total cost","십오 분마다 총 인원을 알려요.","십오 분마다 남은 시간을 알려요.","announce","hide","erase","mute"],
["팀과 공유","handshake2","I'm sharing은 지금 나누는 중이라는 진행형이에요. with the whole team의 whole이 범위가 모두라는 점을 힘줘요.","building","점심 시간을 팀 전체와 공유하고 있어요.","마취 시간을 팀 전체와 공유하고 있어요.","sharing","hiding","selling","storing"],
], order=dict(tag="대화 흐름",icon="compass",ko="허혈 시간 소통 4문장 순서",why="모두가 커프가 얼마나 올라가 있었는지 알아야 한다고 말하고, 십오 분마다 시간을 부르고, 부른 뒤 그 합계를 게시판에 적고, 그 숫자를 팀이 보게 해요.",lines=[
["Let's make sure everyone knows how long the cuff has been up.","speech","커프가 얼마나 올라가 있었는지 모두 알게 합시다","목표"],
["I'll call out the time every fifteen minutes, starting now.","speaker","지금부터 십오 분마다 시간을 부를게요","호명"],
["After each call-out, I'll write that total on the board.","board","부를 때마다 그 합계를 게시판에 적을게요","기록"],
["That way the whole team can see the number.","handshake2","그러면 팀 전체가 그 숫자를 볼 수 있어요","공유"]]))

D[9] = dict(s=[
["근위 먼저","bandage","first가 순서를 못 박아 근위 커프가 먼저라는 점이 분명해요. for the block은 왜 이 순서인지 목적을 덧붙여요.","for the photo","검사를 위해 근위 커프부터 먼저 올려요.","촬영을 위해 근위 커프부터 먼저 올려요.","inflate","remove","label","cancel"],
["원위 전환","gear","Once it's established는 앞 일이 자리 잡은 뒤라는 조건절이에요. we switch to가 다음 단계로 옮겨 간다는 뜻이에요.","monitor","블록이 확립되면 원위 커프를 점검해요.","블록이 확립되면 원위 커프도 올려요.","established","cleaned","signed","labeled"],
["순서 확인","check","Let me confirm이 곧 확인하겠다는 예고예요. with anesthesia가 순서를 같이 맞출 상대를 밝혀요.","with the cart","일정을 마취과와 확인할게요.","장비를 마취과와 확인할게요.","sequence","invoice","menu","ticket"],
["항상 확인","check","We always confirm이 예외 없는 습관으로 들려요. which cuff goes up first는 의문사절이 확인할 내용을 한 덩어리로 담아요.","gets cleaned","어느 커프가 먼저 내려가는지 항상 확인해요.","어느 침대가 먼저 올라가는지 항상 확인해요.","confirm","clean","buy","wash"],
["비어 블록","bandage","The proximal cuff is for …는 장비의 용도를 알려 주는 틀이에요. Bier block이 그 용도가 되는 마취 방법의 이름이에요.","the nerve map","근위 커프는 비어 블록 검사를 위한 거예요.","근위 커프는 비어 블록 교육을 위한 거예요.","sequence","recipe","invoice","diet"],
], order=dict(tag="대화 흐름",icon="compass",ko="이중 커프 부위마취 4문장 순서",why="마취과와 순서를 확인하고, 그 순서대로 근위 커프를 먼저 올리고, 블록이 듣기 시작하면 원위 커프가 이어받고, 매번 같은 순서를 따라요.",lines=[
["Let me confirm the sequence with anesthesia.","check","순서를 마취과와 확인할게요","확인"],
["Per that sequence, the proximal cuff goes up first.","bandage","그 순서대로 근위 커프가 먼저 올라가요","근위"],
["After the block is working, the distal cuff takes over.","gear","블록이 듣기 시작하면 원위 커프가 이어받아요","원위"],
["We follow that same order every time.","calendar","매번 그 같은 순서를 따라요","반복"]]))

D[10] = dict(s=[
["PVD 위험","siren","With PVD,로 조건을 먼저 내세우고 쉼표 뒤에 결과를 말하는 틀이에요. carries added risk는 위험을 더 짊어진다는 정형 표현이에요.","added weight","말초혈관질환이 있으면 지혈대는 비용을 더해요.","말초혈관질환이 있으면 지혈대는 시간을 더해요.","risk","cost","noise","color"],
["안전 논의","speech","Let's discuss는 결정을 내리자가 아니라 같이 이야기해 보자는 제안이에요. whether는 예와 아니오 중 어느 쪽인지를 묻는 접속사예요.","whether it's tight","이 사지에 편한지 논의합시다.","이 사지에 통증이 있는지 논의합시다.","safe","heavy","warm","early"],
["병력 알림","pager","flag는 눈에 띄게 알려 둔다는 뜻이에요. to the surgeon으로 알릴 대상을 밝혀요.","the visitor list","가족 병력을 집도의에게 알릴게요.","수술 병력을 집도의에게 알릴게요.","vascular","dental","visitor","billing"],
["높은 위험","siren","PVD patients를 주어로 세워 어떤 환자들 이야기인지부터 밝혀요. a higher risk의 비교급이 일반 환자보다 높다는 뜻이에요.","with elevators","말초혈관질환 환자는 지혈대에서 비용이 더 높아요.","말초혈관질환 환자는 지혈대에서 시간이 더 걸려요.","carry","avoid","hide","lack"],
["집도의에게 질문","speech","Let's ask는 같이 물어보자는 제안이에요. if this is still safe가 물을 내용을 절로 담아요.","still loud","이게 여전히 필요한지 집도의에게 물어봅시다.","이게 여전히 편한지 집도의에게 물어봅시다.","safe","loud","warm","early"],
], order=dict(tag="대화 흐름",icon="compass",ko="말초혈관질환 주의 4문장 순서",why="위험이 더해진다고 알리고, 이 사지에 안전한지 논의하자고 하고, 혈관 병력을 집도의에게 알리고, 그 병력을 바탕으로 집도의의 생각을 물어요.",lines=[
["With PVD, the tourniquet carries added risk.","siren","말초혈관질환이 있으면 지혈대는 위험을 더해요","위험"],
["So let's discuss whether it's safe for this limb.","speech","그러니 이 사지에 안전한지 논의합시다","논의"],
["I'll flag the vascular history to the surgeon.","pager","혈관 병력을 집도의에게 알릴게요","알림"],
["Let's ask the surgeon what they think about that.","speech","그것에 대해 집도의 생각을 물어봅시다","질문"]]))

D[11] = dict(s=[
["소아 압력","baby","need로 필요를 말하고 lower가 일반 성인보다 낮은 값이라는 비교를 담아요. Pediatric limbs를 주어로 세워 대상부터 밝혀요.","avoid","소아 사지는 더 낮은 흡입 압력이 필요해요.","소아 사지는 더 낮은 관류 압력이 필요해요.","occlusion","osmotic","ambient","barometric"],
["다시 계산","chartup","Let me recalculate가 다시 계산하겠다는 예고예요. based on 뒤에 기준이 와서 계산이 체구에서 나온다고 알려요.","the child's shirt","아이의 나이를 기준으로 다시 계산할게요.","아이의 키를 기준으로 다시 계산할게요.","size","mood","toy","shirt"],
["작은 커프","bandage","the smallest appropriate cuff가 알맞은 것 가운데 가장 작은 것이라는 최상급이에요. We use는 늘 그렇게 쓰는 방침을 말해요.","the brightest","적절한 것 중 가장 싼 커프를 써요.","적절한 것 중 가장 가벼운 커프를 써요.","smallest","brightest","loudest","cheapest"],
["낮은 설정","baby","This child needs …는 이 아이에게 필요한 것을 말하는 틀이에요. a lower pressure setting에서 lower가 성인보다 낮다는 비교를 담아요.","pressure sticker","이 아이는 더 낮은 조명 설정이 필요해요.","이 아이는 더 낮은 속도 설정이 필요해요.","pressure","volume","temperature","brightness"],
["소아 커프 크기","bandage","Let's choose가 같이 고르자는 제안이에요. the most appropriate는 가장 알맞은 것이라는 최상급이에요.","the most famous","가장 적절한 소아 커프 색깔을 고릅시다.","가장 적절한 소아 커프 브랜드를 고릅시다.","appropriate","colorful","expensive","popular"],
], order=dict(tag="대화 흐름",icon="compass",ko="소아 압력 조정 4문장 순서",why="소아 사지는 더 낮은 압력이 필요하다고 말하고, 아이 체구로 다시 계산하고, 새 값에 맞춰 가장 작은 알맞은 커프를 고르고, 그 선택을 올리기 전에 함께 확인해요.",lines=[
["Pediatric limbs need a lower occlusion pressure.","baby","소아 사지는 더 낮은 폐색 압력이 필요해요","원칙"],
["So let me recalculate based on the child's size.","chartup","그러니 아이 체구로 다시 계산할게요","계산"],
["With the new number in hand, I'll choose the smallest appropriate cuff.","bandage","새 값이 있으니 가장 작은 알맞은 커프를 고를게요","선택"],
["We'll confirm that choice together before inflation.","check","올리기 전에 그 선택을 함께 확인할게요","확인"]]))

D[12] = dict(s=[
["끼임 확인","magnify","Make sure …는 꼭 확인하라고 시키는 명령형 틀이에요. isn't pinched는 피부가 끼어 눌려 있지 않은 상태를 부정으로 말해요.","isn't painted","커프 아래에서 튜브가 조이지 않는지 확인하세요.","커프 아래에서 피부가 미끄러지지 않는지 확인하세요.","pinched","painted","dyed","framed"],
["액체 고임","magnify","No fluid가 주어에 부정을 바로 붙여 아무 액체도 안 된다는 강한 금지로 들려요. should pool은 고이면 안 된다는 뜻의 규칙이에요.","behind the curtain","지혈대 밑에 먼지가 쌓이면 안 돼요.","지혈대 밑에 액체가 새면 안 돼요.","fluid","dust","light","noise"],
["압박 손상","shield","Smooth padding이 주어이고 prevents가 막아 준다는 효과 동사예요. pressure injury는 눌려서 생기는 피부 손상이라는 용어예요.","pressure sound","매끄러운 패딩이 압박 통증을 막아요.","매끄러운 패딩이 압박 감염을 막아요.","injury","sound","color","smell"],
["조임 확인","magnify","Check that …은 확인을 명령형으로 시키는 틀이에요. anywhere가 어디에서도라는 범위를 모두로 넓혀요.","inside the gown","커프 아래 어디서도 튜브가 꼬이지 않는지 확인하세요.","커프 아래 어디서도 피부가 마르지 않는지 확인하세요.","skin","sticker","label","marker"],
["시작 전 확인","check","Let's make sure …는 같이 확인하자는 제안이에요. before we start가 확인이 시작 앞에 온다고 정해요.","inside the cooler","시작 전에 커프 아래 먼지가 쌓이지 않았는지 확인합시다.","시작 전에 커프 아래 접착제가 묻지 않았는지 확인합시다.","fluid","glue","ink","dust"],
], order=dict(tag="대화 흐름",icon="compass",ko="압흔 손상 예방 4문장 순서",why="패딩을 먼저 매끄럽게 대고, 커프 밑에서 피부가 끼지 않는지 확인하고, 거기에 액체가 고이지 않았는지도 확인한 뒤, 모두 확인되면 시작해요.",lines=[
["Padding goes on first, and it has to be smooth.","bandage","패딩을 먼저 대고 그건 매끄러워야 해요","패딩"],
["Make sure the skin isn't pinched under the cuff once it's on.","magnify","커프가 감긴 뒤 피부가 끼지 않았는지 확인하세요","끼임"],
["Check that no fluid has pooled beneath it either.","magnify","그 밑에 액체가 고이지 않았는지도 확인하세요","액체"],
["With all of that confirmed, we can start.","check","그걸 다 확인했으니 시작할 수 있어요","시작"]]))

D[13] = dict(s=[
["재적용 시간","calendar","After reperfusion,이 기준 시점을 먼저 깔아요. resets shorter에서 shorter가 이전보다 짧다는 비교를 담아요.","resets alone","재관류 후에는 안전한 재적용 시간이 더 짧게 표시돼요.","재관류 후에는 안전한 재적용 시간이 더 짧게 기록돼요.","resets","expires","freezes","vanishes"],
["새 간격","magnify","Let me track이 곧 추적하겠다는 예고예요. carefully가 방식을 부사로 덧붙여요.","a loud","새 간격을 빠르게 추적할게요.","새 간격을 조용히 추적할게요.","interval","diet","menu","route"],
["휴식 기간","calendar","We allow는 기간을 두도록 허용한다는 방침이에요. before reinflating이 다시 올리기 앞에 온다고 정해요.","a long story","다시 올리기 전에 점검 기간을 둬요.","다시 올리기 전에 소독 기간을 둬요.","rest","lunch","speech","vote"],
["전보다 짧음","calendar","This time,이 지난번과 대비하는 시점을 알려요. as long as before가 이전과 같은 길이라는 비교예요.","as loud","이번에는 전만큼 멀리 갈 수 없어요.","이번에는 전만큼 빨리 갈 수 없어요.","long","far","fast","high"],
["간격 추적","magnify","I'm tracking은 지금 하고 있다는 진행형이에요. closely가 방식을 부사로 덧붙여요.","briefly","재적용 간격을 혼자 추적하고 있어요.","재적용 간격을 따로 추적하고 있어요.","closely","rarely","gently","loudly"],
], order=dict(tag="대화 흐름",icon="compass",ko="재적용 시간 관리 4문장 순서",why="재관류 뒤 안전한 시간이 짧아진다고 말하고, 그래서 전만큼 오래 못 간다고 하고, 다시 올리기 전에 휴식을 두고, 그 시점부터 새 간격을 추적해요.",lines=[
["After reperfusion, the safe reinflation time resets shorter.","calendar","재관류 후 안전한 재적용 시간은 더 짧게 재설정돼요","원칙"],
["That means we can't go as long as before.","calendar","그건 전만큼 오래 갈 수 없다는 뜻이에요","결과"],
["We allow a rest period before reinflating.","calendar","다시 올리기 전에 휴식 기간을 둬요","휴식"],
["I'll track the new interval from that point on.","magnify","그 시점부터 새 간격을 추적할게요","추적"]]))
