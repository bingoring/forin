# [tag, icon, why, decoy, d1, d2, ans, w1, w2, w3]
D = {}
D[3] = dict(s=[
["약 목록","pill","list는 하나씩 나열해 달라는 동사라 tell보다 빠뜨림 없는 답을 끌어내요. all이 처방약 밖의 약까지 포함시켜요.","you bought","매일 드시는 약을 전부 써 주시겠어요?","매일 드시는 약을 전부 보여 주시겠어요?","daily","weekly","monthly","yearly"],
["이름·용량","board","Do you know…?는 모른다고 답해도 부담이 없는 예·아니오 질문이에요. names와 doses를 한 문장에 묶어 두 정보가 다 필요하다는 점을 알려요.","the prices","약 색깔과 용량도 아세요?","약 이름과 제조사도 아세요?","doses","colors","brands","sizes"],
["당일 복용","pill","this morning으로 시점을 오늘 아침에 못 박아 마취 직전 복용 여부를 정확히 확인해요. blood pressure pill은 약 이름 대신 환자가 아는 말로 묻는 방식이에요.","this weekend","오늘 아침에 혈압약 사셨어요?","오늘 아침에 혈압약 섞으셨어요?","morning","evening","afternoon","month"],
["고위험 약","pill","be on은 계속 복용·사용 중인 약을 묻는 표현이에요. 항응고제·인슐린·흡입기는 수술 전에 꼭 알아야 하는 약이라 콕 집어 열거해요.","a heart pill","혈액 항응고제나 인슐린, 흡입기를 챙기셨나요?","혈액 항응고제나 인슐린, 흡입기를 사셨나요?","insulin","morphine","oxygen","iron"],
["주사 여부","pill","like로 예를 들면 injections가 무엇인지 환자가 바로 알아들어요. at home을 끝에 붙여 병원 밖 자가 투여를 묻는다는 범위를 밝혀요.","any infusions","집에서 비타민 주사 같은 걸 맞으세요?","약국에서 인슐린 주사 같은 걸 맞으세요?","injections","vaccines","tablets","patches"],
["마지막 복용","calendar","exactly를 need to know 바로 뒤에 둬 대충이 아니라 정확한 시각이 필요하다는 점을 강조해요. of each one으로 하나도 빼지 않는다는 범위를 밝혀요.","of that bottle","각 약을 마지막으로 언제 보관하셨는지 정확히 알아야 해요.","각 약을 마지막으로 언제 사셨는지 정확히 알아야 해요.","exactly","roughly","partly","vaguely"],
], order=dict(tag="대화 흐름",icon="compass",ko="복용 약물 확인 4문장 순서",why="약을 전부 말해 달라고 하고, 이름과 용량을 알고 있는지 묻고, 마지막 복용 시각이 필요하다고 짚은 뒤, 혈압약을 오늘 아침에 먹었는지 확인해요.",lines=[
["Can you list all the medications you take daily?","pill","매일 드시는 약을 전부 말씀해 주시겠어요?","목록"],
["Do you know their names and doses?","board","그 약들의 이름과 용량을 아세요?","이름"],
["Now for the timing — I need to know exactly when you took your last dose of each one.","calendar","이제 시각이요, 각 약을 마지막으로 언제 드셨는지 정확히 알아야 해요","시각"],
["For the blood pressure pill, was it this morning?","pill","혈압약은 오늘 아침이었나요?","확인"]]))
D[4] = dict(s=[
["측정 설명","monitor","I'm going to…로 하려는 동작을 먼저 알려 환자가 놀라지 않게 해요. to get a baseline은 지금 수치를 기준점으로 삼는다는 목적을 밝혀요.","your chart","체중을 확인하려고 활력징후를 잴게요.","시간을 확인하려고 활력징후를 잴게요.","baseline","diagnosis","signature","prescription"],
["수치 안내","check","for right now가 지금 시점이라는 단서라 앞으로 달라질 수 있음을 남겨 두는 신중한 안심이에요. look good은 단정 대신 보기에 그렇다는 완곡한 표현이에요.","for your age","지금 표정은 좋아 보여요.","지금 서류는 좋아 보여요.","numbers","labs","scans","charts"],
["긴장 공감","faceWorried","A little이 정도를 낮춰 긴장을 부끄러운 일이 아니라 흔한 일로 들리게 해요. completely normal은 환자가 스스로를 이상하게 여기지 않게 하는 안심의 말이에요.","for anyone","약간의 긴장감은 식사 전에 아주 정상이에요.","약간의 긴장감은 면회 전에 아주 정상이에요.","normal","unusual","unfair","unwise"],
["수치 설명","stetho","which가 앞 절 전체를 받아 빨리 뛰는 것이 흔한 일임을 덧붙여요. 수치를 숨기지 않고 말한 뒤 이유를 곁들이는 순서라 환자가 불안해지지 않아요.","which usually passes","심장이 조금 세게 뛰는데, 긴장하면 흔히 그래요.","심장이 조금 빨리 뛰는데, 흥분하면 흔히 그래요.","nervous","thirsty","sleepy","bored"],
["기록 안내","pencil","write down은 기록으로 남긴다는 구라 나중에 비교할 기준값이 생긴다는 뜻이 담겨요. 세 항목을 열거해 무엇을 재는지 미리 알려요.","your temperature","혈압과 맥박, 산소포화도를 복사할게요.","혈압과 맥박, 산소포화도를 인쇄할게요.","pulse","weight","height","age"],
["안심 설명","shield","for your body to react로 반응의 주체를 몸으로 돌려 환자 탓이 아닌 생리 현상으로 들리게 해요. like this가 방금 잰 수치를 가리켜 구체적인 안심이 돼요.","to rest","몸이 이런 소리에 반응하는 건 아주 정상이에요.","몸이 이런 추위에 반응하는 건 아주 정상이에요.","stress","noise","cold","light"],
], order=dict(tag="대화 흐름",icon="compass",ko="기저 활력징후 4문장 순서",why="활력징후를 재는 이유를 알리고, 심박이 빠른 것을 이유와 함께 말하고, 그 긴장이 정상이라고 안심시킨 뒤, 잰 값을 기록한다고 해요.",lines=[
["I'm going to check your vitals to get a baseline.","monitor","기준치를 확인하려고 활력징후를 잴게요","설명"],
["Your heart's beating a little fast, which often happens when people feel nervous.","stetho","심장이 조금 빨리 뛰는데 긴장하면 흔히 그래요","결과"],
["That kind of nervousness is completely normal before surgery.","faceWorried","그 정도 긴장은 수술 전에 아주 정상이에요","안심"],
["With that settled, I'll write down your blood pressure, pulse, and oxygen level.","pencil","그럼 혈압과 맥박, 산소포화도를 기록할게요","기록"]]))
D[5] = dict(s=[
["체중 이유","monitor","accurate로 짐작이 아닌 실측이 필요하다는 점을, for…dosing으로 그 이유가 용량 계산임을 한 문장에 밝혀요. Let's는 같이 한다는 어감이에요.","for your diet","약 보관을 위해 정확한 체중을 잴게요.","약 포장을 위해 정확한 체중을 잴게요.","accurate","rough","approximate","average"],
["체중 요청","me","Can you…for me?는 지시 대신 부탁으로 건네고 for me로 환자를 돕는 일처럼 말해 부담을 덜어요. step on은 올라서는 동작을 가리켜요.","on the mat","체중계 옆에 서 주시겠어요?","체중계를 들어 주시겠어요?","step","sit","lie","kneel"],
["이유 설명","pill","helps us give는 환자 한 사람 때문이 아니라 의료진이 더 정확해진다는 틀이라 협조를 끌어내기 좋아요. the exact right가 두 형용사를 붙여 정확성을 강조해요.","us show you","정확한 시간을 드리는 데 도움이 돼요.","정확한 설명을 드리는 데 도움이 돼요.","dose","size","brand","price"],
["키 측정","me","also가 방금 잰 체중에 키를 더한다는 것을 알려요. so we can record로 키를 재는 목적이 BMI 기록임을 이어 말해요. BMI는 체중과 키로 계산해요.","your signature","발도 재서 체질량지수를 기록할게요.","허리도 재서 체질량지수를 기록할게요.","height","foot","arm","chest"],
["실측 권유","check","Even…, but…으로 어림값을 인정하면서 실측이 낫다고 말해 환자가 모른다고 해도 위축되지 않게 해요. safer는 비교급이라 더 안전하다는 정도를 밝혀요.","the old number","대략의 추정치도 도움이 되지만, 실제 수치가 더 편해요.","대략의 추정치도 도움이 되지만, 실제 수치가 더 빨라요.","estimate","photo","report","label"],
["용량 원리","pill","by weight를 짧은 전치사구로 붙여 기준이 체중임을 밝혀요. keeps A safe and effective처럼 목적어 뒤 형용사 둘이 결과를 한 번에 알려요.","by hand","체중에 맞춰 용량을 정하면 약이 안전하고 저렴해요.","체중에 맞춰 용량을 정하면 약이 안전하고 간단해요.","effective","expensive","private","cheap"],
], order=dict(tag="대화 흐름",icon="compass",ko="체중·키 측정 4문장 순서",why="정확한 체중이 필요하다고 말하고, 체중계에 올라가 달라고 부탁하고, 그 수치가 용량에 쓰인다고 이유를 밝힌 뒤, 이어서 키를 재겠다고 해요.",lines=[
["Let's get an accurate weight for your medication dosing.","monitor","약 용량 계산을 위해 정확한 체중을 잴게요","이유"],
["For that, can you step on the scale for me?","me","그러려면 체중계에 올라가 주시겠어요?","요청"],
["That's the number we use to give you the exact right dose.","pill","그 수치로 정확한 용량을 드려요","설명"],
["Next, let's also measure your height so we can record your BMI.","me","다음엔 키도 재서 체질량지수를 기록할게요","키"]]))
D[6] = dict(s=[
["정확히 묻기","speech","Exactly를 맨 앞에 둬 어림짐작이 아닌 정확한 양을 요구하고, 질문을 둘로 이어 양과 시각을 한 번에 물어요. 추궁이 아니라 사실 수집으로 들려요.","did you pour","물을 정확히 얼마나, 몇 시에 사셨어요?","물을 정확히 얼마나, 몇 시에 데우셨어요?","water","coffee","juice","milk"],
["보고 안내","pager","need to는 내 재량이 아니라 해야 하는 절차라는 어감이라 환자가 불이익으로 느끼지 않게 해요. report는 책임 있는 사람에게 올리는 공식 보고를 뜻하는 동사예요.","I need to hand","이 서류를 마취팀에 보고해야 해요.","이 사진을 마취팀에 보고해야 해요.","need","hope","wish","like"],
["결정 주체","handshake2","They'll decide로 결정 권한이 마취팀에 있음을 분명히 해 간호사가 약속할 수 없는 부분을 선 긋고, to keep you safe로 조정의 목적이 환자 안전임을 밝혀요.","the lighting","시간 조정이 필요한지는 그쪽에서 결정할 거예요, 천천히요.","시간 조정이 필요한지는 그쪽에서 결정할 거예요, 공평하게요.","adjust","cancel","repeat","measure"],
["안심과 안내","calendar","isn't canceled를 먼저 말해 환자의 가장 큰 걱정을 풀고, but 뒤에 변동 가능성을 might로 낮춰 전해요. 나쁜 소식 앞에 안심을 두는 순서예요.","Your insurance isn't canceled","수술이 취소되는 건 아니지만, 장소가 조정될 수 있어요.","수술이 취소되는 건 아니지만, 순서가 조정될 수 있어요.","canceled","finished","scheduled","approved"],
["공감 설명","bulb","It's easy to forget…으로 환자의 실수를 개인 잘못이 아닌 흔한 일로 만들어요. counts as는 규정상 그렇게 분류한다는 표현이라 비난 없이 기준을 알려요.","of water means","물 한 모금도 금식 위반으로 친다는 걸 믿기 쉬워요.","물 한 모금도 금식 위반으로 친다는 걸 설명하기 쉬워요.","fast","diet","promise","record"],
["비난 아님","handshake2","I'm not upset을 먼저 말해 환자가 꾸중을 들을까 하는 걱정을 덜어요. just가 요구를 정확한 내용 하나로 좁히고, to keep you safe가 이유를 밝혀요.","the signed form","화내는 거 아니에요, 안전을 위해 정확한 이름만 필요해요.","화내는 거 아니에요, 안전을 위해 정확한 시각만 필요해요.","upset","tired","busy","lost"],
], order=dict(tag="대화 흐름",icon="compass",ko="금식 위반 확인 4문장 순서",why="마신 양과 시각을 정확히 묻고, 그 내용을 마취팀에 보고해야 한다고 알리고, 그쪽이 결정한다고 말한 뒤, 어느 쪽이든 수술이 취소되는 건 아니라고 안심시켜요.",lines=[
["Exactly how much water did you have, and at what time?","speech","물을 정확히 얼마나, 몇 시에 드셨어요?","질문"],
["I need to report this to the anesthesia team.","pager","이 내용을 마취팀에 보고해야 해요","보고"],
["They'll decide if we adjust the timing to keep you safe.","handshake2","시간 조정이 필요한지는 그쪽에서 안전하게 결정해요","결정"],
["Either way, your surgery isn't canceled.","check","어느 쪽이든 수술이 취소되는 건 아니에요","안심"]]))
