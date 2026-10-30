D = {}
D[14] = dict(s=[
["울혈 감시","magnify","looks congested가 눈으로 본 소견이고 대시 뒤 I'm watching for가 그래서 지켜보는 중이라는 행동이에요. venous pooling은 정맥에 피가 고이는 현상이에요.","relaxed","사지가 창백해 보여요 — 정맥 고임을 지켜보고 있어요.","사지가 차가워 보여요 — 정맥 고임을 지켜보고 있어요.","congested","pale","clean","relaxed"],
["거혈 확인","check","Let me check if …는 확인하겠다는 예고에 if절로 확인할 내용을 담아요. adequate는 충분하다는 평가어예요.","was audible","거혈이 빨랐는지 확인할게요.","거혈이 깨끗했는지 확인할게요.","adequate","loud","famous","annual"],
["색 변화 보고","pager","I'll report A to B는 A를 B에게 보고하겠다는 틀이에요. color changes는 피부색 변화라는 눈에 보이는 소견이에요.","the staff changes","온도 변화를 집도의에게 보고할게요.","맥박 변화를 집도의에게 보고할게요.","color","weather","menu","price"],
["다리 울혈","magnify","a bit이 정도를 약하게 낮춰 말하는 완화어예요. below the cuff가 소견이 보이는 위치를 정해요.","beside the bed","커프 아래 다리가 아주 울혈돼 보여요.","커프 아래 다리가 좀 창백해 보여요.","leg","room","wall","screen"],
["기록과 보고","pencil","documenting과 reporting을 and로 묶어 기록과 보고를 함께 한다는 뜻이에요. now가 지금 바로라는 점을 붙여요.","and rating it","지금 들리는 것을 기록하고 보고하고 있어요.","지금 느끼는 것을 기록하고 보고하고 있어요.","documenting","erasing","hiding","framing"],
], order=dict(tag="대화 흐름",icon="compass",ko="하지 정맥울혈 감시 4문장 순서",why="커프 아래 다리가 울혈돼 보인다고 말하고, 거혈이 충분했는지 확인하고, 보이는 것을 기록하고, 그 색 변화를 집도의에게 보고해요.",lines=[
["The leg looks a bit congested below the cuff.","magnify","커프 아래 다리가 좀 울혈돼 보여요","소견"],
["Let me check if exsanguination was adequate.","check","거혈이 충분했는지 확인할게요","확인"],
["I'm documenting what I see.","pencil","보이는 것을 기록하고 있어요","기록"],
["I'll report those color changes to the surgeon.","pager","그 색 변화를 집도의에게 보고할게요","보고"]]))

D[15] = dict(s=[
["지금 감압","siren","We're at …은 한계에 지금 와 있다는 현재 상태를 말해요. we need to … now는 선택이 아니라 지금 해야 하는 일이라는 뜻이에요.","the maximum tray size","점심 시간에 왔어요 — 지금 공기를 빼야 해요.","최대 안전 거리에 왔어요 — 지금 공기를 빼야 해요.","maximum","minimum","average","usual"],
["상급 보고","pager","escalate는 더 높은 책임자에게 올려 알린다는 뜻이에요. 쉼표 뒤 the limb is at risk가 그렇게 올리는 이유를 짧게 붙여요.","is on sale","이걸 상급 보고할게요, 사지가 차가워요.","이걸 상급 보고할게요, 사지가 부었어요.","escalating","cleaning","sorting","filing"],
["초과 불가","siren","Surgeon,으로 이름을 먼저 불러 누구에게 하는 말인지 분명히 해요. cannot exceed는 넘으면 안 된다는 강한 한계예요.","enter this room","집도의, 이 일정을 초과할 수 없어요.","집도의, 이 예산을 초과할 수 없어요.","exceed","enter","move","buy"],
["즉시 조치","siren","have to가 해야만 한다는 의무예요. right now와 짧은 명령 deflate it이 겹쳐 지금 바로라는 긴박감을 줘요.","We have to chart","지금 당장 교대해야 해요 — 공기를 빼세요.","지금 당장 이동해야 해요 — 공기를 빼세요.","act","sign","pay","vote"],
["더는 불가","siren","This is the maximum이 한계점을 한 문장으로 못 박아요. cannot go any longer가 더 이상은 안 된다는 뜻이에요.","go any louder","이게 평균이에요 — 더는 갈 수 없어요.","이게 첫 번째예요 — 더는 갈 수 없어요.","maximum","average","first","usual"],
], order=dict(tag="대화 흐름",icon="compass",ko="허용 시간 초과 임박 4문장 순서",why="최대 안전 시간에 왔다고 말하고, 집도의에게 올려 알리고, 그 한계를 넘을 수 없으니 지금 공기를 빼야 하고, 내려가면 그 시각을 적어요.",lines=[
["We're at the maximum safe time.","siren","최대 안전 시간에 왔어요","도달"],
["I'm escalating this to the surgeon right away.","pager","이걸 바로 집도의에게 올려 알릴게요","보고"],
["We cannot go past that limit, so we need to deflate now.","siren","그 한계를 넘을 수 없으니 지금 빼야 해요","감압"],
["Once it's down, I'll note that time.","pencil","내려가면 그 시각을 적을게요","기록"]]))

D[16] = dict(s=[
["재관류 저혈압","siren","after release가 원인이 되는 시점을 붙여 푼 직후라는 걸 알려요. 대시 뒤 이름 reperfusion hypotension이 팀이 같은 현상으로 이해하게 해요.","reperfusion fever","혈압이 풀린 후 떨어지고 있어요 — 재관류 부정맥이에요.","혈압이 풀린 후 떨어지고 있어요 — 재관류 탈수예요.","dropping","rising","steady","flashing"],
["가져올까요","stetho","이름을 먼저 부르고 do you need me to …로 상대 뜻을 묻는 공손한 제안이에요. grab은 급히 집어 온다는 느낌의 동사예요.","me to bill","마취과, 제가 수액이나 담요를 가져올까요?","마취과, 제가 거즈나 승압제를 가져올까요?","grab","sign","spell","rename"],
["함께 감시","monitor","closely가 면밀히라는 부사로 감시의 강도를 알려요. with you가 혼자가 아니라 함께 본다는 점을 붙여요.","the window","수술 기사와 함께 모니터를 면밀히 지켜보고 있어요.","혼자 모니터를 면밀히 지켜보고 있어요.","monitor","window","ceiling","curtain"],
["빠른 하강","siren","Pressure's는 Pressure is의 줄임이고 dropping fast가 하강 속도를 부사로 알려요. right after deflation이 시점을 정해요.","inside the pump","공기를 뺀 직후 온도가 빠르게 떨어지고 있어요.","공기를 뺀 직후 속도가 빠르게 떨어지고 있어요.","dropping","rising","holding","freezing"],
["함께 대응","handshake2","Let's가 같이 하자는 제안이에요. and로 가져오기와 지켜보기 두 가지를 한 문장에 이어요.","snacks","함께 담요를 가져오고 모니터를 지켜봅시다.","함께 거즈를 가져오고 모니터를 지켜봅시다.","fluids","tape","pens","forms"],
], order=dict(tag="대화 흐름",icon="compass",ko="재관류 저혈압 발생 4문장 순서",why="푼 직후 압력이 빠르게 떨어진다고 말하고, 그것이 재관류 저혈압이라고 짚고, 마취과에 수액이나 승압제가 필요한지 묻고, 처치하는 동안 모니터를 함께 봐요.",lines=[
["Pressure's dropping fast right after deflation.","siren","공기를 뺀 직후 압력이 빠르게 떨어져요","하강"],
["That's reperfusion hypotension.","stetho","그건 재관류 저혈압이에요","판단"],
["Anesthesia, do you need me to grab fluids or pressors for that?","pager","마취과, 그것에 수액이나 승압제를 가져올까요","제안"],
["While you treat it, I'm watching the monitor closely with you.","monitor","처치하는 동안 함께 모니터를 지켜보고 있어요","감시"]]))

D[17] = dict(s=[
["신경 손상","siren","may have caused는 원인을 단정하지 않고 가능성으로만 말해요. 확인되기 전에 환자와 팀에게 쓰는 조심스러운 틀이에요.","bone density","갑작스러운 압박이 신경 손상을 일으켰을 수 있어요.","장시간 압박이 피부 손상을 일으켰을 수 있어요.","Prolonged","Gentle","Brief","Occasional"],
["기록과 알림","pencil","document와 inform을 and로 묶어 기록과 알림을 함께 한다는 뜻이에요. Let's로 같이 하자는 제안이 돼요.","the receipt","비용을 기록하고 집도의에게 알립시다.","일정을 기록하고 집도의에게 알립시다.","deficit","receipt","invoice","payroll"],
["수술 후 평가","stetho","We need a …는 필요한 것을 말하는 틀이에요. postoperatively가 수술 뒤라는 시점을 한 낱말 부사로 말해요.","a new schedule","수술 후에 신경학적 교육이 필요해요.","수술 후에 신경학적 서류가 필요해요.","assessment","schedule","textbook","invoice"],
["과도한 압박","bandage","was compressed too long은 수동태로 사지가 눌렸고 그 시간이 길었다는 사실을 말해요. this time이 이번 경우라는 점을 붙여요.","painted too bright","이번에는 사지가 너무 세게 압박됐어요.","이번에는 사지가 너무 자주 압박됐어요.","long","hard","often","early"],
["알림과 기록","pager","I'll inform A and document B는 알림과 기록을 한 문장에 맡는 틀이에요. the nerve deficit이 기록할 대상이에요.","the night shift","집도의에게 알리고 신경 점수를 기록할게요.","집도의에게 알리고 신경 위치를 기록할게요.","nerve","night","bank","cart"],
], order=dict(tag="대화 흐름",icon="compass",ko="지혈대 신경마비 손상 4문장 순서",why="장시간 압박이 신경 손상을 일으켰을 수 있다고 말하고, 집도의에게 알리며 결손을 기록하고, 수술 후 신경 평가가 필요하다고 하고, 그 평가가 회복 여부를 보여 준다고 마무리해요.",lines=[
["Prolonged pressure may have caused nerve injury.","siren","장시간 압박이 신경 손상을 일으켰을 수 있어요","원인"],
["I'll inform the surgeon and document the nerve deficit.","pager","집도의에게 알리고 신경 결손을 기록할게요","알림"],
["We'll need a neuro assessment postoperatively.","stetho","수술 후에 신경학적 평가가 필요할 거예요","평가"],
["That assessment will show whether the nerve recovers.","magnify","그 평가가 신경이 회복되는지 보여 줄 거예요","결과"]]))

D[18] = dict(s=[
["출혈과 압력","siren","대시 앞은 관찰이고 뒤는 그래서 하겠다는 행동이에요. let me check는 곧 확인하겠다고 알리는 말이에요.","the cuff smell","출혈이 계속되고 있어요 — 커프 크기를 확인할게요.","출혈이 계속되고 있어요 — 장비 배터리를 확인할게요.","pressure","smell","price","brand"],
["폐색 불충분","siren","may not be가 그럴 수도 있다는 추측을 담아 단정을 피해요. occluding fully가 완전히 막지 못한다는 뜻이에요.","occupying space","지혈대가 완전히 미끄러지고 있는 것 같아요.","지혈대가 완전히 물에 젖고 있는 것 같아요.","occluding","heating","leaking","ringing"],
["장비 점검","gear","troubleshoot는 고장 원인을 찾아 고친다는 뜻의 동사예요. now로 지금 하고 있다는 점을 알려요.","the elevator","지금 전화 문제를 해결하고 있어요.","지금 조명 문제를 해결하고 있어요.","device","elevator","printer","phone"],
["필드 출혈","siren","still이 아직도라는 뜻이라 이미 계속된 상태를 알려요. under the cuff가 어디서 나는지 위치를 정해요.","still glowing","커프 아래 필드에서 처음으로 출혈이 있어요.","커프 아래 필드에서 여전히 통증이 있어요.","bleeding","swelling","clotting","healing"],
["장비와 압력","check","Let's check와 and confirm으로 점검을 두 단계로 나눠요. the pressure is correct가 맞는지 확인할 내용이에요.","the printout is crooked","장비를 확인하고 번호가 맞는지 확인합시다.","장비를 확인하고 날짜가 맞는지 확인합시다.","check","paint","move","pour"],
], order=dict(tag="대화 흐름",icon="compass",ko="압력 오류 지속 출혈 4문장 순서",why="커프 아래에서 출혈이 계속된다고 말하고, 지혈대가 완전히 막지 못하는 것 같다고 추정하고, 장비와 압력이 맞는지 확인하고, 원인이 나올 때까지 계속 해결해요.",lines=[
["There's continued bleeding under the cuff.","siren","커프 아래에서 출혈이 계속돼요","관찰"],
["That might mean it isn't occluding fully.","magnify","그건 완전히 막지 못한다는 뜻일 수 있어요","추정"],
["Let's check the device and confirm the pressure is correct.","gear","장비를 확인하고 압력이 맞는지 확인합시다","점검"],
["Whatever we find, I'll keep troubleshooting until the bleeding stops.","check","뭘 찾든 출혈이 멎을 때까지 계속 해결할게요","해결"]]))

D[19] = dict(s=[
["대사 급증","lab","We're seeing …은 눈앞에서 지금 보이는 변화를 말하는 현재진행 틀이에요. after reperfusion이 변화가 일어난 시점을 붙여요.","a sudden storm","소독 후 대사성 급증이 보여요.","마취 후 대사성 급증이 보여요.","metabolic","dermal","dental","ocular"],
["검사와 치료제","stetho","이름을 먼저 부르고 do you need …?로 상대 필요를 묻는 공손한 제안이에요. drawn up은 주사기에 약을 뽑아 준비해 둔다는 뜻이에요.","drawn on","마취과, 서류나 치료제를 준비해 드릴까요?","마취과, 검사나 서류를 준비해 드릴까요?","labs","forms","badges","stamps"],
["도울 준비","handshake2","I'm ready to …는 바로 움직일 준비가 됐다는 뜻이에요. whatever you need가 범위를 상대가 필요한 모든 것으로 열어 둬요.","to arrive","필요한 건 뭐든 설명할 준비가 됐어요.","필요한 건 뭐든 기록할 준비가 됐어요.","assist","argue","arrive","apologize"],
["신속 조치","siren","This is …로 먼저 상황을 이름 붙이고 대시 뒤에 let's act quickly로 행동을 제안해요. quickly가 속도를 부사로 알려요.","politely","이건 대사성 급증이에요 — 함께 조치합시다.","이건 대사성 급증이에요 — 조용히 조치합시다.","surge","drop","loss","delay"],
["검사 필요 시","speech","Let me know if …는 필요하면 알려 달라는 열린 요청이에요. right now가 지금 바로라는 점을 붙여요.","forms printed","지금 번역이 필요하면 알려 주세요.","지금 휴식이 필요하면 알려 주세요.","labs","forms","badges","stamps"],
], order=dict(tag="대화 흐름",icon="compass",ko="재관류 대사 급변 4문장 순서",why="재관류 뒤 대사성 급증이 보인다고 알리고, 마취과에 검사나 치료제가 필요한지 묻고, 필요하면 바로 말해 달라고 하고, 어느 쪽이든 돕겠다고 해요.",lines=[
["We're seeing a metabolic surge after reperfusion.","lab","재관류 후 대사성 급증이 보여요","관찰"],
["Anesthesia, do you need labs or treatment drawn up for it?","stetho","마취과, 그것에 검사나 치료제를 준비해 드릴까요","질문"],
["If you do, let me know right now.","speech","필요하시면 지금 바로 알려 주세요","요청"],
["Either way, I'm ready to assist with whatever you need.","handshake2","어느 쪽이든 필요한 건 뭐든 도울 준비가 됐어요","준비"]]))

D[20] = dict(s=[
["근손상 우려","siren","With that ischemia time,으로 조건을 먼저 깔면 뒤의 우려가 왜 나오는지 바로 이어져요. is a concern은 확정이 아니라 걱정하는 단계라는 뜻이에요.","muscle tone","그 정도 허혈 시간이면 신장 손상이 우려돼요.","그 정도 허혈 시간이면 비용이 우려돼요.","muscle","liver","spleen","thyroid"],
["구획 징후","magnify","Let's watch for …는 앞으로 지켜볼 것을 같이 정하는 제안이에요. postoperatively가 수술 뒤라는 시점을 한 낱말로 말해요.","for compartment keys","수술 후에 구획 위치를 지켜봅시다.","수술 후에 구획 크기를 지켜봅시다.","compartment","dental","visual","financial"],
["총 시간 기록","pencil","I'll document가 곧 기록하겠다는 약속이에요. carefully가 방식을 부사로 덧붙여요.","cheerfully","총 지혈대 시간을 빠르게 기록할게요.","총 지혈대 개수를 조심스럽게 기록할게요.","total","average","daily","monthly"],
["근손상 평가","stetho","We need to …는 해야 할 일을 말하는 틀이에요. for muscle damage가 평가할 대상을 정해요.","for muscle gain","지금 신장 손상을 평가해야 해요.","지금 연골 손상을 평가해야 해요.","assess","reorder","resell","repaint"],
["기록과 보고","pencil","record와 report를 and로 묶어 기록과 보고를 함께 한다는 뜻이에요. 대상 it은 앞에 말한 허혈 시간을 받아요.","and recite it","예상 허혈 시간을 기록하고 보고할게요.","남은 허혈 시간을 기록하고 보고할게요.","report","recite","rename","resell"],
], order=dict(tag="대화 흐름",icon="compass",ko="장시간 허혈 근손상 4문장 순서",why="허혈 시간이 길어 근손상이 걱정된다고 말하고, 그래서 지금 근손상을 평가하고, 평가에 쓰도록 총 시간을 기록하고, 그 시간을 근거로 수술 후 구획 징후를 지켜봐요.",lines=[
["With that ischemia time, muscle injury is a concern.","siren","그 허혈 시간이면 근손상이 우려돼요","우려"],
["That's why we need to assess for muscle damage now.","stetho","그래서 지금 근손상을 평가해야 해요","평가"],
["I'll record the total tourniquet time for that assessment.","pencil","그 평가를 위해 총 지혈대 시간을 기록할게요","기록"],
["With those times on record, let's watch for compartment signs postoperatively.","magnify","그 시간을 기록했으니 수술 후 구획 징후를 지켜봅시다","관찰"]]))
