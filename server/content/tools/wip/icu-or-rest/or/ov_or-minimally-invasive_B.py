# (dk1, dk2) overrides; None keeps. key "sit.idx"
DK={
'0.0':(None,"복강경 타워는 바퀴가 달렸습니다."),
'0.1':("모니터, 광원, 기복기는 타워에 모입니다.","모니터, 광원, 기복기는 전원이 따로예요."),
'0.3':(None,"모니터 화면은 영상 크기를 바꿀 수 있습니다."),
'0.5':("지금 광원 선을 꽂을게요.","광원은 앞면 스위치예요."),
'1.0':("CO2 탱크는 가스를 압축해 담습니다.","CO2 탱크는 보통 한 통씩 씁니다."),
'1.1':("설정 전에 전원을 켭시다.",None),
'1.3':("탱크 압력 게이지는 탱크 위에 달립니다.","탱크 압력 게이지는 바늘로 보여 줍니다."),
'1.4':(None,"유량 속도는 분당 리터로 셉니다."),
'2.1':("광원 세기는 손잡이로 조절합니다.",None),
'2.3':("화이트밸런스 확인 전에 흰 거즈를 폅시다.",None),
'2.4':("렌즈는 스코프 맨 끝에 붙습니다.",None),
'2.5':("스코프는 광케이블에 이어집니다.","스코프는 길고 가느다란 관입니다."),
'3.0':("로봇은 문 옆 구석에 보관합니다.","로봇은 카트와 콘솔입니다."),
'3.1':("트로카는 환자 복부에 꽂습니다.","로봇팔에는 관절이 여럿 있습니다."),
'3.2':("카트는 바퀴가 네 개 달렸어요.","카트는 정렬 표시선을 따라 섭니다."),
'3.3':("포트 자리는 복부에 미리 정합니다.",None),
'3.4':("고정 전에 카트를 정렬합시다.","바퀴 잠금 레버는 아래쪽에 달려요."),
'3.5':("각 팔 끝에는 번호표가 하나씩 붙습니다.","각 팔은 관절이 여러 마디로 나뉘어요."),
'5.0':("패딩은 젤 소재로 만들어집니다.","패딩은 눌림 방지용으로 씁니다."),
'5.2':("환자 몸은 테이블에 맞춰 눕힙니다.",None),
'5.3':("혈액순환을 위해 발뒤꿈치와 팔꿈치를 확인합시다.",None),
'5.4':("팔은 몸 옆선을 따라 놓습니다.","팔은 얇은 담요 한 장으로 덮습니다."),
'5.5':("안전 스트랩은 허벅지 위에 둘러요.","안전 스트랩은 환자 몸을 잡아 줍니다."),
'6.0':("기복 압력은 mmHg로 읽어요.",None),
'6.3':("압력 수치는 숫자와 막대로 나와요.","압력 수치는 기복기 화면에 뜹니다."),
'6.4':("15는 눈금에 빨간 선으로 보여요.","기복 압력은 낮게 시작하기도 합니다."),
'7.4':("환기 설정은 마취과가 맡습니다.","환기 설정에는 호흡수가 들어갑니다."),
'8.4':("각도는 팔 관절에서 정해집니다.","포트는 복벽을 뚫고 들어갑니다."),
'13.4':("해제 레버는 응급 전용입니다.","레버 연습은 시뮬레이션으로도 합니다."),
'14.0':("포트를 지나가기 위해 회수백을 사용합시다.",None),
'14.3':("확인 전에 장갑부터 바꿉시다.",None),
'14.5':("라벨을 붙이기 전에 펜을 챙길게요.",None),
}
# blank overrides: (ans,w1,w2,w3)
BL={
'6.4':("keep","log","mark","read"),
'10.3':("pressure","pulse","oxygen","glucose"),
'10.5':("drops","swells","clears","freezes"),
'20.0':("lost","found","kept","moved"),
'16.5':("suction","irrigation","cautery","clamps"),
'15.0':("insufflation","dissection","retraction","stapling"),
'17.5':("extra","clean","sterile","wet"),
'17.2':("hands","tables","stools","carts"),
'14.0':("retrieval","biohazard","drainage","laundry"),
'16.4':("field","chart","cart","stool"),
'9.3':("tray","bag","bin","gown"),
'15.2':("oxygen","humidity","brightness","speed"),
'11.0':("showing","hiding","sending","erasing"),
'16.3':("site","cart","bed","door"),
'20.3':("way","floor","desk","wall"),
}
DECOY={'20.3':'in the fridge'}
ORDER={
2:("카메라·광원 준비 4문장 순서","광원 세기를 먼저 맞추고, 그 불빛에서 카메라 화이트밸런스를 맞추고, 맞춘 뒤 삽입 전에 김서림을 없애고, 렌즈가 깨끗하면 천천히 삽입하는 순서예요. 각 줄이 앞 줄의 결과를 이어받아 순서가 하나로 정해져요.",[
 ("The light source is at the right intensity.","bulb","광원이 적절한 세기로 맞춰져 있어요","보고"),
 ("With the light set, let's white-balance the camera.","magnify","광원이 맞으니 카메라를 맞춥시다","맞춤"),
 ("Once it's balanced, I'll defog the lens before insertion.","magnify","맞춰지면 삽입 전에 김서림을 없앨게요","김서림"),
 ("The lens looks clean and ready, so I'll insert the scope slowly.","scalpel","렌즈가 깨끗하니 스코프를 천천히 삽입할게요","삽입")]),
7:("CO2 흡수 EtCO2 상승 4문장 순서","EtCO2 상승을 보고하고, 낮추려고 환기를 늘리고, 그 뒤 환기 설정을 면밀히 지켜보고, 수치가 계속 오르면 압력 인하를 예고하는 순서예요. 각 줄이 앞 줄을 가리켜 순서가 하나로 정해져요.",[
 ("The EtCO2 is rising as we absorb CO2.","chartup","CO2를 흡수하면서 EtCO2가 올라요","보고"),
 ("To bring it down, let's increase minute ventilation.","gear","낮추려고 분당 환기량을 늘립시다","환기"),
 ("With that done, let's watch the ventilation settings closely.","monitor","늘렸으니 환기 설정을 면밀히 지켜봅시다","감시"),
 ("If the numbers keep climbing, we may need to lower the insufflation pressure.","gear","수치가 계속 오르면 압력을 낮춰야 할 수 있어요","예고")]),
15:("기복 가스 색전 4문장 순서","징후를 보고 색전을 의심하고, 가장 먼저 도움을 요청하고, 기복을 멈추고 가스를 빼고, 이미 들어간 가스에는 왼쪽 측위와 순수 산소를 하는 순서예요. First와 그 가스 같은 말이 앞 줄을 가리켜 순서가 정해져요.",[
 ("Sudden drop in EtCO2 with hypotension—suspect gas embolism.","siren","저혈압과 EtCO2 하락이면 가스 색전을 의심해요","의심"),
 ("First, I'll call for help right now.","pager","먼저 지금 바로 도움을 요청할게요","호출"),
 ("Stop insufflation so no more gas goes in, and release the pneumoperitoneum.","siren","가스가 더 안 들어가게 멈추고 복강 가스를 빼요","중단"),
 ("Left lateral, head down, and 100% oxygen for the gas already in.","siren","이미 들어간 가스에는 왼쪽 측위, 머리 낮춤, 100% 산소","체위")]),
16:("트로카 혈관 손상 4문장 순서","출혈을 알리고, 가장 먼저 바로 압박하고, 그 출혈 속도로 큰 혈관 손상을 의심하고, 그 의심으로 개복 전환 준비와 호출을 하는 순서예요. First와 At that rate, On that suspicion이 앞 줄을 가리켜 순서가 하나로 정해져요.",[
 ("There's brisk bleeding at the trocar.","siren","트로카 부위에서 출혈이 빨라요","보고"),
 ("First, let's apply pressure at the site right away.","bandage","먼저 지금 바로 부위를 압박합시다","압박"),
 ("At that rate, suspect a major vessel injury.","siren","그 속도면 주요 혈관 손상을 의심해요","의심"),
 ("On that suspicion, let's prep for open conversion and call for help.","pager","그 의심으로 개복 준비하고 도움을 부릅시다","전환")]),
17:None,
18:("로봇 고장 긴급 언도킹 4문장 순서","고장을 알리고, 가장 먼저 팀을 불러 응급 절차를 시작하고, 그 절차를 위해 팔을 언도킹하고, 언도킹하는 동안 개복 전환을 준비하는 순서예요. First와 those steps, As we undock이 앞 줄을 가리켜 순서가 하나로 정해져요.",[
 ("The robot has faulted and won't respond.","siren","로봇이 고장 나서 반응하지 않아요","보고"),
 ("First, I'll call the team to start the emergency steps.","pager","먼저 응급 절차를 시작하도록 팀을 부를게요","호출"),
 ("For those steps, let's emergency undock all arms now.","siren","그 절차로 지금 모든 팔을 응급 언도킹해요","언도킹"),
 ("As we undock, prep for open conversion immediately.","siren","언도킹하면서 즉시 개복 전환을 준비해요","준비")]),
19:("피하기종 호흡 위기 4문장 순서","염발음이 목까지 퍼진 것을 알리고, 거기에 기도 압력이 오른다고 더하고, 압력이 오르니 가스를 빼고 환기를 지원하고, 그다음 천천히 빼며 기도를 다시 확인하는 순서예요. On top of that과 After that이 앞 줄을 가리켜 순서가 하나로 정해져요.",[
 ("There's crepitus up to the neck.","siren","목까지 염발음이 퍼지고 있어요","보고"),
 ("On top of that, the airway pressures are climbing.","monitor","게다가 기도 압력이 오르고 있어요","압력"),
 ("With pressures climbing, let's release the pneumoperitoneum and support ventilation.","siren","압력이 오르니 가스를 빼고 환기를 지원해요","해제"),
 ("After that, we'll deflate slowly and recheck the airway.","check","그다음 천천히 빼며 기도를 다시 확인해요","재확인")]),
}
ORDER4={17:"With all of that going on, let's move quickly and stay calm."}

FIX={
'1.0.1':"CO2 탱크는 단단한 금속 통이에요.",'1.0.2':"CO2 탱크는 바닥 쪽에 세워요.",
'1.2.2':"기복 전 유량은 모니터에서 읽어요.",'1.3.2':"탱크 압력 게이지는 바늘로 가리켜요.",
'1.4.1':"유량 눈금을 먼저 읽어 봅시다.",
'2.1.2':"광원이 광케이블에 이어져 있습니다.",'2.3.2':"화이트밸런스 버튼은 헤드 쪽에 달립니다.",
'2.5.1':"스코프를 광케이블에 이을게요.",
'3.0.1':"로봇 앞 바닥을 먼저 비웁시다.",'3.1.1':"팔 덮개를 먼저 펼게요.",
'4.1.2':"5밀리미터와 12밀리미터는 길이가 달라요.",
'5.0.2':"패딩은 눌림 방지용이에요.",'5.5.2':"안전 스트랩은 환자 몸을 붙잡아요.",
'6.1.1':"과하게 차면 복부가 팽팽해집니다.",'6.1.2':"수치는 모니터 위쪽에서 읽어요.",
'6.2.2':"복부가 팽팽해지면 많이 찬 거예요.",'6.3.2':"압력 수치는 기기 위쪽에 뜹니다.",
'6.4.2':"기복 압력은 낮게 시작할 수 있어요.",'6.5.1':"복부 쪽 상태를 조금 확인합시다.",
'7.3.2':"EtCO2 수치는 날숨에서 잽니다.",'7.4.2':"환기 설정에는 호흡수가 포함돼요.",
'8.3.1':"팔에 더 굵은 번호를 붙입시다.",'8.4.2':"포트는 복벽을 뚫고 지나갑니다.",
'8.5.1':"팔 충돌은 두 팔이 겹치면 생겨요.",'8.5.2':"팔 충돌은 간격과 관련이 깊습니다.",
'9.0.2':"개방 세트는 묶음으로 나옵니다.",'9.2.1':"개복술 트레이에는 긴 기구가 담깁니다.",
'9.3.2':"개방 트레이는 개복술에 쓰입니다.",'9.5.2':"기구를 깨끗한 포 위에 둘게요.",
'10.0.2':"가파른 각도는 골반 수술에 쓰입니다.",
'11.0.2':"기복기는 유량을 조절합니다.",'11.1.1':"튜빙은 기복기와 환자를 이어요.",
'11.3.1':"예비 기복기는 같은 CO2 라인에 이어요.",'11.3.2':"예비 기복기도 한계를 다시 설정합니다.",
'11.4.1':"오류 코드는 숫자와 글자로 나옵니다.",'11.4.2':"압력이 낮으면 복강이 덜 부풀어요.",
'12.0.2':"스코프는 빛과 영상을 전합니다.",'12.2.2':"삽입하면 시야가 순간 끊깁니다.",
'12.3.1':"시야는 영상으로 확인합니다.",'12.5.2':"렌즈 거즈는 한 장씩 나옵니다.",
'13.0.1':"응급 언도킹은 집도의 지시를 따라요.",'13.4.2':"레버 연습은 시뮬레이션으로도 해요.",
'13.5.2':"언도킹은 팔을 떼어 내는 일입니다.",
'14.0.1':"포트 통과를 위해 회수백을 사용합시다.",'14.1.2':"큰 검체는 절개를 넓혀 꺼내기도 해요.",
'14.2.1':"검체가 빠지면 진단이 어렵습니다.",
'15.0.2':"가스 색전은 혈관을 막는 상태입니다.",
'15.1.1':"가스 색전증은 드물지만 매우 위험한 합병증입니다.",
'15.1.2':"가스 색전증은 혈관을 막아 순환을 흔드는 상태입니다.",
'15.2.1':"왼쪽 측위는 공기가 심장 위쪽에 모이게 합니다.",
'15.2.2':"100% 산소는 몸속 질소를 줄여 흡수를 돕습니다.",
'15.4.1':"도움 요청은 호출 버튼으로 해요.",'15.5.1':"압력은 CO2 주입으로 오릅니다.",
'16.1.1':"주요 혈관 손상은 출혈이 많습니다.",'16.1.2':"트로카 손상은 삽입 중에 생겨요.",
'16.2.2':"도움 요청은 위급 호출 번호로 해요.",'16.3.1':"압박은 출혈을 줄여 시간을 얻어요.",
'16.5.2':"흡인은 석션 팁으로 해요.",
'17.0.1':"개복 전환은 팀 모두가 알아야 해요.",'17.0.2':"전환하면 절개가 커져요.",
'17.1.1':"개복술 트레이는 기구가 묵직합니다.",'17.1.2':"트레이는 깨끗한 상태로 열어야 해요.",
'17.3.2':"침착하면 실수가 많이 줄어듭니다.",
'17.4.2':"트레이는 겉 포장을 벗겨 엽니다.",'17.5.1':"일손 요청은 소리 내어 해요.",'17.5.2':"일손은 역할이 정해져야 해요.",
'18.4.1':"클램프는 팔을 제자리에 붙잡아요.",'18.4.2':"수동 해제는 고장 상황용이에요.",
'18.5.2':"팀을 부르는 건 소리 내어 해요.",
'19.0.2':"피하기종은 피부 밑이 부풀어요.",'19.2.1':"복강 내 가스를 빼면 폐가 편해집니다.",
'19.3.1':"피부 밑 공기는 눌러 보면 느껴집니다.",'19.5.2':"기도 확인은 호흡음과 수치로 봅니다.",
'20.0.1':"시야를 잃으면 영상이 온통 붉게 보입니다.",'20.0.2':"복강경 시야는 영상으로만 확보합니다.",
'20.3.2':"대량 출혈에는 혈액 팩이 계속 쓰입니다.",
}
BL.update({
'0.4':("cables","filters","lenses","gloves"),
'4.2':("ports","bags","labels","folders"),
'1.1':("limit","button","filter","timer"),
'4.3':("open","cover","move","flip"),
'4.5':("count","tag","stack","sort"),
'12.1':("warm","wrap","rinse","mark"),
'15.3':("flat","tall","calm","warm"),
'17.3':("calm","still","seated","tired"),
})
FIX.pop('17.3.2',None)
FIX.update({
'17.3.1':"침착하면 실수가 많이 줄어듭니다.",
'15.1.1':"가스 색전증은 드물지만 수술 중 위험한 합병증입니다.",
'15.1.2':"가스 색전증은 혈관을 막아 순환을 크게 흔드는 위험한 상태입니다.",
'1.0.2':"CO2 탱크는 바닥 가까이에 세워요.",
'17.0.2':"전환하면 절개가 훨씬 커져요.",
'18.5.2':"팀을 부르는 일은 소리 내어 하는 편이에요.",
'14.1.2':"큰 검체는 절개를 넓혀 꺼내기도 합니다.",
'15.4.1':"도움 요청은 호출 버튼을 씁니다.",
'16.2.2':"도움 요청은 위급 호출 번호를 씁니다.",
'17.5.1':"일손 요청은 소리 내어 합니다.",
'17.1.2':"트레이는 깨끗한 상태로 열어야 합니다.",
'12.3.1':"시야는 모니터로 확인합니다.",
'20.0.2':"복강경 시야는 렌즈로만 확보합니다.",
})

FIX.update({'1.2.1':None})
FIX.pop('1.2.1')
FIX.update({'12.5.1':None}); FIX.pop('12.5.1')
FIX.update({
'15.1.1':"가스 색전증은 드물지만 수술 중에 아주 위험한 합병증입니다.",
'1.2.2':"기복 전 유량은 기기에서 읽어요.",
'12.5.2':"렌즈 거즈는 한 장씩 따로 쓰입니다.",
})
FIX.update({
'11.2.1':"가져오기 직전에 문을 열게요.",
'11.3.1':"교체하기 앞서 전원을 끕시다.",
'15.4.1':"요청하기 직전에 위치를 외칠게요.",
'17.1.1':"개봉하기 직전에 장갑을 확인하세요.",
'17.2.1':"들여오기 앞서 문을 엽시다.",
'18.1.1':"언도킹하기 직전에 팔 위치를 읽읍시다.",
'18.4.1':"풀어내기 앞서 장갑을 낍시다.",
'20.1.1':"압박을 가하기 앞서 장갑을 낍시다.",
'14.2.1':"확인 직전에 백을 열게요.",
})
FIX['14.2.1']="확인에 앞서 백을 열게요."
ORDER[5]=("체위 조정 확인 4문장 순서","체위와 패딩을 먼저 확인하자고 하고, 발뒤꿈치와 팔꿈치부터 보고, 패딩 뒤에 팔을 옆에 고정하고, 팔이 자리 잡으면 안전 스트랩을 다시 확인하는 순서예요. First와 those와 with the arms in place가 앞 줄을 가리켜 순서가 하나로 정해져요.",[
 ("First, let's confirm the positioning and padding.","check","먼저 체위와 패딩을 확인합시다","확인"),
 ("Let's start with the heels and elbows for padding.","check","패딩을 위해 발뒤꿈치와 팔꿈치부터 봐요","부위"),
 ("Once those are padded, the arms are tucked safely at the sides.","shield","거기에 패딩하고 팔을 옆에 안전하게 고정해요","팔"),
 ("With the arms in place, I'll double-check the safety straps.","lock","팔이 자리 잡으면 스트랩을 다시 확인할게요","스트랩")])
ORDER[6]=("기복 압력 감시 4문장 순서","현재 압력을 보고하고, 너무 높이 오르지 않게 하자고 하고, 그러려고 수치를 감시하며 읽어 주고, 읽어 준 뒤 복부가 팽팽해지면 알려 달라고 하는 순서예요. it과 call it out이 앞 줄을 가리켜 순서가 하나로 정해져요.",[
 ("The insufflation pressure is at 15.","monitor","기복 압력이 15에 있어요","보고"),
 ("Let's not let it climb too high.","shield","너무 높이 오르지 않게 합시다","상한"),
 ("To keep it down, I'll watch the pressure number closely and call it out.","monitor","그러려고 압력 수치를 지켜보며 읽어 줄게요","감시"),
 ("After I call it out, tell me if the abdomen gets too tense.","speech","읽어 준 뒤 복부가 팽팽해지면 말씀해 주세요","요청")])
_o7=list(ORDER[7]); _o7[2]=list(_o7[2]); _o7[2][2]=("With the ventilation up, let's watch the ventilation settings closely.","monitor","환기를 늘렸으니 환기 설정을 면밀히 지켜봐요","감시"); ORDER[7]=(_o7[0],_o7[1],_o7[2])
_o15=list(ORDER[15][2]); _o15[1]=("On that suspicion, I'll call for help right now.","pager","그 의심으로 지금 바로 도움을 요청할게요","호출"); _o15[2]=("As I call, stop insufflation so no more gas goes in, and release the pneumoperitoneum.","siren","제가 부르는 동안 기복을 멈추고 복강 가스를 빼요","중단")
ORDER[15]=("기복 가스 색전 4문장 순서","징후를 보고 색전을 의심하고, 그 의심으로 바로 도움을 요청하고, 부르는 동안 기복을 멈추고 가스를 빼고, 이미 들어간 가스에는 왼쪽 측위와 순수 산소를 하는 순서예요. On that suspicion과 As I call이 앞 줄을 가리켜 순서가 정해져요.",_o15)
_o16=list(ORDER[16][2]); _o16[1]=("First, let's apply pressure at that site right away.","bandage","먼저 그 부위를 지금 바로 압박합시다","압박")
ORDER[16]=(ORDER[16][0],ORDER[16][1],_o16)
ORDER[17]=("긴급 개복 전환 4문장 순서","전환을 알리고, 그러려고 트레이를 열고 필드를 준비하고, 거기에 더해 일손을 더 들이고, 일손이 들어오는 동안 빠르게 움직이되 침착하라는 순서예요. For that과 On top of that과 hands coming in이 앞 줄을 가리켜 순서가 하나로 정해져요.",[
 ("We're converting to open now.","siren","지금 개복으로 전환하고 있어요","선언"),
 ("For that, I'll open the tray while you prep the field.","scalpel","그러려고 필드 준비 동안 트레이를 열게요","분담"),
 ("On top of that, let's get another set of hands in the room.","handshake2","거기에 방에 일손을 더 들입시다","인력"),
 ("With hands coming in, let's move quickly and stay calm.","shield","일손이 오는 동안 빠르게 움직이되 침착해요","침착")])
ORDER[18]=("로봇 고장 긴급 언도킹 4문장 순서","고장을 알리고, 그 일로 가장 먼저 팀을 불러 응급 절차를 시작하고, 그 절차로 팔을 언도킹하고, 언도킹하는 동안 개복 전환을 준비하는 순서예요. For that과 those steps와 As we undock이 앞 줄을 가리켜 순서가 하나로 정해져요.",[
 ("The robot has faulted and won't respond.","siren","로봇이 고장 나서 반응하지 않아요","보고"),
 ("For that, first I'll call the team to start the emergency steps.","pager","그래서 먼저 응급 절차를 시작하도록 팀을 부를게요","호출"),
 ("For those steps, let's emergency undock all arms now.","siren","그 절차로 지금 모든 팔을 응급 언도킹해요","언도킹"),
 ("As we undock, prep for open conversion immediately.","siren","언도킹하면서 즉시 개복 전환을 준비해요","준비")])
BL['18.3']=("console","tablet","camera","cart")
BL['18.3']=("console","tablet","speaker","printer")
