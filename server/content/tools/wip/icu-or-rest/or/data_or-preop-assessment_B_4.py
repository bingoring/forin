D = {}
D[12] = dict(s=[
["마지막 시점","calendar","last를 두 번 반복해 담배와 술 각각의 마지막 시점을 따로 묻는다는 점을 분명히 해요. have는 smoke와 drink를 한 동사로 아울러 부담 없이 묻는 말이에요.","your last vacation","마지막으로 담배 끊으신 게, 그리고 마지막 술은 언제였어요?","마지막으로 담배 피우신 게, 그리고 마지막 술은 누구와였어요?","drink","snack","nap","visit"],
["이유 안내","bulb","This helps us…로 질문의 이유를 의료진이 준비하는 데 도움이 된다는 쪽으로 말해 캐묻는 느낌을 줄여요. airway and recovery 두 가지로 이유를 구체화해요.","decide on","이건 기도 관리와 퇴원 계획에 도움이 돼요.","이건 기도 관리와 식사 계획에 도움이 돼요.","plan","pay","vote","wait"],
["비난 아님","handshake2","I'm not judging을 먼저 말해 음주·흡연 이야기를 꺼리게 하는 부담을 덜어요. picture는 숫자가 아닌 전체 모습이라 정확한 답을 부담 없이 청하는 은유예요.","a quick","판단하는 거 아니에요, 그냥 간단한 그림이 필요해요.","판단하는 거 아니에요, 그냥 솔직한 사진이 필요해요.","judging","joking","rushing","guessing"],
["흡연량","speech","About이 대략의 수를 말해도 된다는 신호라 정확히 기억 못하는 환자의 부담을 덜어요. 하루 개비 수와 연수를 곱해 누적 흡연량(pack-year)을 가늠해요.","in a row","하루에 몇 개비 정도, 몇 달째 피우셨어요?","하루에 몇 갑 정도, 몇 년째 피우셨어요?","years","weeks","hours","minutes"],
["영향 설명","bulb","both make A B 틀로 두 습관이 똑같이 기도를 다루기 어렵게 한다는 점을 한 번에 말해요. a little이 위협이 아닌 조금의 차이라는 어조를 맞춰 줘요.","both keep","흡연과 음주 둘 다 수면 관리를 조금 더 어렵게 만들어요.","흡연과 음주 둘 다 식단 관리를 조금 더 어렵게 만들어요.","harder","cheaper","faster","lighter"],
["기록 약속","pencil","honestly를 동사 뒤에 붙여 환자가 말한 그대로 줄이거나 부풀리지 않고 적겠다는 약속을 해요. so recovery can plan으로 기록이 다음 팀의 계획에 쓰인다는 목적을 밝혀요.","can wave","회복팀이 이를 반영해 계획하도록 정중하게 기록할게요.","회복팀이 이를 반영해 계획하도록 조용하게 기록할게요.","honestly","quickly","briefly","neatly"],
], order=dict(tag="대화 흐름",icon="compass",ko="흡연·음주력 4문장 순서",why="마지막 흡연과 음주 시점을 묻고, 흡연량 숫자를 묻고, 판단이 아니라 솔직한 상황 파악이 목적이라고 안심시킨 뒤, 솔직하게 기록해 회복팀에 넘겨요.",lines=[
["When did you have your last cigarette and last drink?","calendar","마지막 담배와 마지막 술은 언제였어요?","시점"],
["For the smoking, about how many a day, and for how many years?","speech","담배는 하루에 몇 개비, 몇 년째세요?","양"],
["I'm not judging — I just need an honest picture of those numbers.","handshake2","판단하는 게 아니라 그 수치의 솔직한 모습이 필요해요","안심"],
["With that, I'll record this honestly so recovery can plan around it.","pencil","그걸 솔직하게 기록해 회복팀이 반영하게 할게요","기록"]]))
D[13] = dict(s=[
["검사 안내","check","routine과 for everyone이 특정인을 의심해서가 아니라 모두에게 하는 표준 절차임을 알려 불쾌감을 줄여요. who could be pregnant가 대상 범위를 정해요.","billing form","임신 가능성이 있는 모든 분께 하는 일상적인 수면 검사예요.","임신 가능성이 있는 모든 분께 하는 일상적인 시력 검사예요.","routine","rare","special","private"],
["이유 설명","bulb","can affect는 모든 경우가 아니라 영향을 줄 수 있다는 가능성만 말해 겁주지 않아요. so we always로 그래서 모두에게 같은 확인을 한다는 결론을 이어요.","wonder","마취가 식욕에 영향을 줄 수 있어서 항상 확인해요.","마취가 수면에 영향을 줄 수 있어서 항상 확인해요.","pregnancy","seizure","migraine","concussion"],
["비밀 보장","lock","stays confidential로 앞으로도 계속 비밀이 유지된다는 지속성을 나타내요. between you and the care team이 알 수 있는 사람의 범위를 정확히 한정해요.","between us","이 내용은 환자분과 진료팀 사이에서만 문서로 남아요.","이 내용은 환자분과 진료팀 사이에서만 천천히 정리돼요.","confidential","permanent","unlimited","uncertain"],
["생리·임신","calendar","last period와 any chance를 한 문장에 묶어 날짜와 가능성을 한꺼번에 물어요. any chance는 확신이 없어도 가능성만으로 답하라는 부드러운 틀이에요.","any reason","마지막 생리는 언제였고, 알레르기 가능성이 있으신가요?","마지막 생리는 언제였고, 출혈 가능성이 있으신가요?","chance","reason","need","fear"],
["공감 후 이유","faceWorried","I know…, but…으로 환자의 불편을 먼저 인정한 뒤 이유를 대는 순서예요. it keeps you safe로 질문의 목적을 환자 자신의 안전에 둬요.","silly","복잡하게 느껴지실 수 있지만, 마취 중 안전을 위한 거예요.","지루하게 느껴지실 수 있지만, 마취 중 안전을 위한 거예요.","personal","rushed","lonely","random"],
["비밀 안심","lock","No one…needs to know로 알 필요가 있는 사람만 알게 된다는 최소 공개 원칙을 쉬운 말로 풀어요. outside this room이 공개 범위의 경계를 눈에 보이는 장소로 줄여 줘요.","in your family","이 방 밖의 누구도 이유를 알 필요 없어요.","이 방 밖의 누구도 일정을 알 필요 없어요.","result","price","address","date"],
], order=dict(tag="대화 흐름",icon="compass",ko="임신 가능성 확인 4문장 순서",why="마취가 임신에 영향을 줄 수 있어 늘 확인한다고 이유를 말하고, 마지막 생리와 임신 가능성을 묻고, 개인적인 질문이라는 점을 인정하며 안전 때문이라고 한 뒤, 결과가 방 밖으로 나가지 않는다고 해요.",lines=[
["Anesthesia can affect a pregnancy, so we always confirm.","bulb","마취가 임신에 영향을 줄 수 있어서 항상 확인해요","이유"],
["For that, when was your last period, and is there any chance you're pregnant?","calendar","그래서 마지막 생리는 언제였고 임신 가능성이 있나요?","질문"],
["I know this feels personal, but it keeps you safe under anesthesia.","faceWorried","개인적으로 느껴지시겠지만 마취 중 안전을 위한 거예요","공감"],
["Because it's personal, no one outside this room needs to know the result.","lock","개인적인 일이니 이 방 밖에선 결과를 알 필요 없어요","비밀"]]))
D[14] = dict(s=[
["증상 시작","calendar","When did…start?는 증상이 시작된 시점을 묻는 기본 틀이에요. 기침과 코막힘을 한 문장에 묶어 상기도 증상의 시작을 함께 확인해요.","the rash","기침과 코막힘은 어디부터 시작됐어요?","기침과 코막힘은 누구부터 시작됐어요?","congestion","dizziness","swelling","soreness"],
["경고 증상","stetho","Any fever처럼 동사 없이 명사만 던지는 짧은 질문은 대화에서 빠르게 확인할 때 써요. colored mucus는 감염을 시사하는 신호라 일반 기침과 가르려고 물어요.","any sore throat","열은 있나요, 아니면 끈적한 가래가 나오나요?","열은 있나요, 아니면 냄새 나는 가래가 나오나요?","colored","thick","sticky","dry"],
["의견 요청","pager","weigh in은 판단에 참여해 의견을 보탠다는 구라 마취과에 결정을 넘기는 어감이에요. before we proceed가 진행 전에 거쳐야 하는 단계임을 밝혀요.","to step out","진행하기 전에 마취과 서명이 필요해요.","진행하기 전에 마취과 도장이 필요해요.","proceed","leave","arrive","finish"],
["기간 확인","calendar","How many days…?는 정확한 일수를 묻는 틀이라 When did…start보다 대답이 숫자 하나로 나와요. have you had로 지금까지 이어진 기간을 물어요.","the sore throat","기침과 코막힘이 몇 주째인가요?","기침과 코막힘이 몇 번째인가요?","days","weeks","months","times"],
["증상 비교","magnify","is different from으로 두 상태를 나란히 놓아 어느 쪽이 더 마취에 영향을 주는지 환자가 스스로 가늠하게 해요. simple과 bad가 정도를 가르는 형용사예요.","comes before","단순 콧물과 열을 동반한 심한 구토는 달라요.","단순 콧물과 열을 동반한 심한 복통은 달라요.","cough","headache","sneeze","stomachache"],
["증상 보고","pager","decide를 anesthesia의 행동으로 두어 간호사가 결정하지 않고 판단할 사람에게 정보를 올린다는 역할 경계를 밝혀요. report는 공식 보고를 뜻해요.","so anesthesia can sign","내일 수술 진행 여부를 마취과가 결정하도록 증상을 보고할게요.","다음 주 수술 진행 여부를 마취과가 결정하도록 증상을 보고할게요.","symptoms","forms","bills","photos"],
], order=dict(tag="대화 흐름",icon="compass",ko="최근 상기도 감염 4문장 순서",why="기침과 코막힘이 언제 시작됐는지 묻고, 열이나 색 있는 가래를 확인하고, 그 차이가 중요한 이유를 설명한 뒤, 마취과가 오늘 수술 여부를 정하도록 보고해요.",lines=[
["When did the cough and congestion start?","calendar","기침과 코막힘은 언제부터였어요?","시작"],
["Besides those, any fever, or coughing up any colored mucus?","stetho","그 밖에 열이 있거나 색깔 있는 가래가 나오나요?","확인"],
["That matters, because a simple runny nose is different from a fever with a bad cough.","magnify","단순 콧물은 열을 동반한 심한 기침과 달라서 중요해요","이유"],
["Because of that, I'll report your symptoms so anesthesia can decide about today's surgery.","pager","그래서 증상을 보고해 마취과가 오늘 수술을 결정하게 할게요","보고"]]))
