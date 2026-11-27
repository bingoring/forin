import yaml,re,collections,copy,json,sys
SRC='or-preop-checklist.yaml'; OUT='_reviewB_or-preop-checklist_after.yaml'
d=yaml.safe_load(open(SRC))
# distractorsKo: (sit,sent,slot): (new, why, kind)  kind: S=안전 T=정답둘 F=모양/되풀이
DK={
(1,0,1):("검사와 영상 결과가 전부 출력돼 있나요?","'몇 개'—몇 되풀이(주제 6) 줄이기","F"),
(1,1,0):("CBC와 type-and-screen 다 접수됐어요.","'인쇄돼 있어요'는 결과가 와 있다는 뜻을 품음","T"),
(1,1,1):("CBC와 type-and-screen 둘 다 채혈했어요.","'오전에 나왔어요'는 와 있다는 참인 말—나오 되풀이","T"),
(1,3,0):("차트를 한 번 더 새로고침해 볼게요.","확인→출력: 확인을 다른 일로","S"),
(1,4,0):("칼륨 채혈이 아직 안 됐네요.","'보통 늦게 나와요'—누락 보고를 정상으로 만드는 잘못된 안심","S"),
(1,4,1):("칼륨 결과가 아직 확정 전이네요.","'따로 나오는 거네요'—누락을 설명으로 덮는 잘못된 안심","S"),
(2,0,1):("IV 흐름을 보려고 클램프를 열고 있어요.","확인→기록: 확인을 기록으로(저작자 문의)","S"),
(2,3,1):("소매를 잠깐 걷을게요.","보기→고정: 관찰을 다른 처치로","S"),
(2,4,0):("느리게 흐르고 붓기는 없어요.","붓기→알람: 침윤 확인 대상을 바꿈(저작자 문의)","S"),
(2,4,1):("흐름과 붓기를 지금 살피고 있어요.","붓기→흔들림: 침윤 확인 대상을 바꿈","S"),
(2,2,0):("이 라인으로 수술 중에 수액과 영양제가 들어가요.","통째로 다른 문장(틀 유지 ①), '않아요' 부정","F"),
(2,2,1):("이 라인으로 회복실에서 수액과 약이 들어가요.","통째로 다른 문장(틀 유지 ①)","F"),
(3,0,0):("지금 반지나 피어싱, 틀니를 빼 두셨나요?","'가져오셨나요'는 착용 여부를 확인하지 못함","S"),
(3,0,1):("반지나 피어싱, 틀니는 다 빼셔야 돼요.","'불편하신가요'—착용 확인이 빠짐","S"),
(3,3,0):("반지와 피어싱을 여기 넣어 주시겠어요?","'뺄 때 알려'—정답 행동(빼기)을 품음","T"),
(3,3,1):("반지와 피어싱을 세 주시겠어요?","'빼며 앉아'—정답 행동+α","T"),
(4,0,1):("최근에 방광염이 있었나요?","'오늘' 비움은 '최근' 비움에 포함—정답 둘","T"),
(5,0,1):("수술 전 항생제는 약국에서 왔어요.","오답 둘 다 '~가 정해졌어요'—모양으로 걸러짐","F"),
(5,4,0):("집도의를 기다리며 약을 한 번 더 확인할게요.","투여 신호를 마취팀으로—처치 시점 바꿈(저작자 문의)","S"),
(5,4,1):("집도의가 손 씻는 동안 준비를 마칠게요.","그 순간 투여 대신 방법 맞추기","S"),
(6,0,0):("교차적합 검사가 아직 접수 전이에요.","미완료 보고가 정의문으로 바뀜(보고 빠짐)·오답 둘 다 사실문","S"),
(6,0,1):("교차적합 검체가 아직 안 갔어요.","미완료 보고가 정의문으로 바뀜(보고 빠짐)","S"),
(6,1,0):("보류할지 집도의께 여쭤볼까요?","'준비되면 시작해도'는 보류와 같은 뜻—정답 둘(새 값은 보류를 종속절에 남긴 앞 단계)","T"),
(6,1,1):("큰 출혈에 대비해 혈액을 미리 맞춰 둬요.","보류 제안→시간 질문(보류 빠짐)·몇","S"),
(6,2,1):("혈액은행은 교차적합이 끝나는 대로 보내요.","'~면' 오답 쏠림 줄이기","F"),
(6,3,0):("혈액이 준비되는 대로 바로 시작하게 방을 정리할게요.","'준비되면 시작할 수 있어요'—정답과 같은 조건(뒤집기)","T"),
(6,3,1):("이 건은 출혈이 많을 수 있는 수술이에요.","'교차적합이 끝나야'—정답과 같은 뜻","T"),
(6,4,0):("교차적합 건은 차트를 다시 열어 둘게요.","검사실로 가기—환자 곁을 떠남","S"),
(7,1,0):("보류할지 정하게 결과 시각을 알아볼까요?","'나오면 시작해도'는 보류와 같은 뜻—정답 둘·오답 둘 다 '~면'(새 값은 보류를 종속절에 남긴 앞 단계)","T"),
(7,1,1):("필수 검사는 점검표 항목이에요.","'없으면 시작하기 어려워요'—보류와 같은 뜻·'~면'","T"),
(7,2,0):("알릴 내용을 정리할게요.","'결과를 봐요'—알아서 볼 거라는 잘못된 안심(보고 빠짐)","S"),
(7,2,1):("집도의와 마취과가 진행을 결정해요.","오답 둘 다 '~봐요' 사실문—모양으로 걸러짐","F"),
(7,3,1):("이 동의서는 진행 전에 꼭 필요한 서류예요.","'몇 분이면 나오는'—몇·나오 되풀이, 사실도 부정확","F"),
(7,4,0):("몇 분마다 결과를 다시 확인해 볼게요.","확인→출력: 확인을 다른 일로","S"),
(7,4,1):("칼륨 결과는 진행 결정에 쓰여요.","'나오는 대로 차트에 올라와요'—다시 볼 필요가 없다는 잘못된 안심","S"),
(8,0,0):("심박동기나 다른 금속 이식물 카드가 있으신가요?","'설명 들으셨나요'—이식물 유무 확인이 빠짐","S"),
(8,0,1):("금속 이식물은 소작기 영향을 받아요.","'심박동기 점검'—금속 이식물 확인이 빠짐(나열 항목 하나 뺌)","S"),
(8,2,1):("기기 종류를 먼저 여쭤볼게요.","'브리핑에서 나눠요'—팀이 알아서 안다는 잘못된 안심(전달 빠짐)","S"),
(8,3,0):("인공관절도 금속이라 소작할 때 고려해요.","'다른 시술'—이식물 확인 대상을 바꿈","S"),
(8,4,1):("수술팀이 확실히 알도록 기기 카드를 찾을게요.","'목록을 먼저 봐요'—팀이 알아서 본다는 잘못된 안심","S"),
(9,0,0):("늦으면 항생제 효과가 줄어요.","'절개 때 들어가요'—틀린 투여 시점(사실 오류)","S"),
(9,0,1):("항생제가 아직 주사기에 안 담겼어요.","미투여 보고가 경로 사실문으로(보고 빠짐)·오답 둘 다 사실문","S"),
(9,1,0):("투여할 약 이름을 같이 확인할까요?","투여→섞기: 위급 순간 준비 동작","S"),
(9,1,1):("절개 전 투여라야 약효가 나요.","투여→준비: 위급 순간 준비 동작(오답 둘 같은 틀)","S"),
(9,4,1):("60분을 넘기지 않게 지금 바로 투여합시다.","'집도의가 기다리지 않게'≈'절개가 늦어지지 않게'—정답 둘(저작자 문의)","T"),
(11,1,1):("이름표를 붙여 보관했다가 보호자께 돌려드릴게요.","'이름표를 붙인 통'—정답+α","T"),
(11,2,0):("시술 후 짧은 시간 동안만이에요.","통째로 다른 문장(틀 유지 ①)","F"),
(11,2,1):("시술 중 한 시간 동안만이에요.","통째로 다른 문장(틀 유지 ①)","F"),
(12,1,0):("혈액희석제를 마지막으로 언제 받으셨나요?","'처방받으셨나요'—투여 여부를 확인하지 못함","S"),
(12,1,1):("출혈 위험 때문에 여쭙는 거예요.","'걱정되시나요'—투여 확인이 빠짐","S"),
(12,2,0):("VTE 예방 오더는 환자마다 달라요.","확인→인쇄: 확인을 다른 일로","S"),
(12,3,0):("들어가시기 전에 압박 슬리브 크기를 재 드릴게요.","슬리브→모자: 예방 처치를 다른 물건으로","S"),
(12,4,0):("오늘 아침에 어떤 혈액희석제를 드셨나요?","'맞으셨나요'—경로를 바꿔 복용 확인을 놓침","S"),
(12,4,1):("혈액희석제를 의사 지시로 며칠 끊기도 해요.","'복용을 적어 두셨나요'—복용 확인이 기록 확인으로","S"),
(13,0,0):("금식 중엔 혈당이 낮아져요.","'혈당 기록'—재기를 기록 보기로","S"),
(13,1,0):("오늘 아침에 인슐린이나 당뇨약을 얼마나 드셨나요?","'가져오셨나요'—복용 확인이 빠짐","S"),
(13,1,1):("금식 중에 인슐린 양을 줄이기도 해요.","'처방받으셨나요'—복용 확인이 빠짐","S"),
(13,2,0):("수치가 너무 높으면 상처 회복이 늦어요.","조절→표시: 처치를 기록으로","S"),
(13,3,1):("혈당이 높으면 감염 위험이 커져요.","'문자로 알릴게요'—정답+방법(정답 둘)","T"),
(14,1,0):("쪽 불일치는 잘못된 부위 수술로 이어져요.","'소리 내어'—정답+방법(정답 둘)","T"),
(14,1,1):("진행하기 전에 멈추고 대조할 서류를 모아야 해요.","'차트로'—정답+출처, 어긋난 기록 하나만 보게 됨","T"),
(14,2,1):("집도의가 맞는 쪽을 최종으로 정해요.","'차트에서 확인'—어긋난 기록 하나로 확인(정답+출처)","T"),
(14,4,1):("영상에 뜬 환자 이름부터 같이 확인해 봅시다.","'동의서와 맞춰'—정답+대조(정답 둘)","T"),
(15,0,0):("칼륨 수치 6.8은 부정맥을 부르는 수준이에요.","'방금 나왔어요'—위급이 빠진 보고(잘못된 안심)","S"),
(15,0,1):("위급값을 바로 보고하는 게 원칙이에요.","'검사실에서 나왔어요'—위급이 빠진 보고(잘못된 안심)","S"),
(15,1,0):("보류할지를 집도의와 마취과가 같이 정해야 해요.","'바로잡히면 다시 시작'—보류와 같은 뜻·오답 둘 다 '~면'","T"),
(15,1,1):("약물 치료로 칼륨을 바로잡아야 해요.","'시각을 다시 정해야'—보류를 품음(정답 둘)","T"),
(15,2,1):("집도의와 마취과에 전화할 번호를 지금 찾을게요.","오답 둘 다 사실문—선언 모양만 정답으로 남음(저작자 문의)","F"),
(15,4,1):("보통 반대쪽 팔에서 새로 채혈해 재검해요.","'합니다'—주제에서 유일한 합쇼체, 모양으로 걸러짐","F"),
(16,1,0):("다 들어가야 절개 때 약효가 제대로 나요.","보류 요청→시간 질문(보류 빠짐)·몇·'~면'","S"),
(16,1,1):("다 들어갈 때까지 얼마나 보류할 수 있을까요?","몇 되풀이 줄이기","F"),
(16,3,0):("덜 들어간 항생제로는 감염을 다 막지 못해요.","'마취는 유지돼요'—절개 금지가 빠짐(위기 옆 일, 저작자 문의)","S"),
(16,3,1):("항생제가 절개 부위 조직에 미리 닿아야 해요.","'라인을 유지해요'—절개 금지가 빠짐(위기 옆 일, 저작자 문의)","S"),
(17,0,0):("교차적합 검사가 아직 안 끝났어요.","'요청하면 와요'—곧 온다는 잘못된 안심","S"),
(17,1,1):("응급 혈액 방출은 누가 승인해 주실 수 있나요?","방출 요청→재고 질문·몇","S"),
(17,2,0):("혈액은행이 혈액을 묶음으로 계속 보내 줘요.","'대량수혈은'—오답에만 나오는 첫 어절(4회)","F"),
(17,2,1):("발동하려고 혈액은행 번호 찾을게요.","오답 둘 다 '대량수혈은 ~움직여요'—선언 모양만 정답으로 남음","F"),
(17,3,0):("심한 출혈은 혈압을 빠르게 떨어뜨려 위험해요.","'처치가 필요해요'—혈액을 포괄해 정답 둘(저작자 문의)","T"),
(17,4,0):("혈액은행에 알려야 프로토콜이 시작돼요.","'대량수혈은'—오답에만 나오는 첫 어절","F"),
(17,4,1):("출혈이 잡힌 뒤에 프로토콜을 해제해요.","'대량수혈은'—오답에만 나오는 첫 어절","F"),
(18,0,0):("이 환자는 심박동기가 있어서 패드 위치가 중요해요.","자석도 실제로 방해—참인 말(정답 둘), 위험 대상을 바꿈","T"),
(18,0,1):("이 환자는 심박동기가 있다고 수술 전에 알려 줬어요.","영상(MRI)도 실제로 방해—참인 말(정답 둘)","T"),
(18,2,0):("심장내과나 자석이 필요할지 설정부터 살필까요?","'필요한지 알아볼까요'≈'대기시켜야 할까요'—정답 둘","T"),
(18,3,0):("시작 전에 제조사부터 알아봅시다.","설정→제조사: 확인 대상을 바꿈","S"),
(18,4,1):("만약을 위해 패드 붙일 자리의 피부를 살필게요.","패드 멀리 두기→케이블 정리: 그 순간 다른 일","S"),
(19,0,1):("응급 상황에서도 타임아웃은 절개 직전에 해요.","'체크리스트는 여전히 필요해요'—참인 말(정답 둘)","T"),
(19,2,0):("환자, 부위, 시술—손을 멈춥시다.","'차트로'—정답+출처(정답 둘)","T"),
(19,2,1):("환자, 부위, 시술이 타임아웃의 세 가지예요.","'한 번 더'—정답+횟수(정답 둘)","T"),
(19,3,1):("생략된 타임아웃은 부위 착오로 이어지기 쉬워요.","O1을 품은 같은 틀 사실문(오답 둘이 겹침)—A가 ko를 고치면 둘 다 다시","F"),
(20,1,0):("가족에게 묻고 일단 MRI 비호환으로 가정합시다.","'크기를 재 봅시다'—MRI 비호환 가정이 빠짐","S"),
(20,1,1):("종류를 알게 된 뒤에 MRI 여부를 다시 따져요.","'종류를 적어 둡시다'—모르는 종류를 적음, 가정이 빠짐","S"),
(20,2,0):("가족이나 이전 기록보다 영상부터 찍을게요.","'직접 찾아볼게요'≈연락 시도—정답 둘","T"),
(20,2,1):("이식물 모델은 이전 기록지에 담겨요.","'확인해 볼게요'≈연락 시도—정답 둘","T"),
(20,3,0):("더 알기 전까지는 MRI 검사를 미뤄 둬요.","'가장 안전한 쪽으로 가정해 다뤄요'≈미상으로 다루기—정답 둘","T"),
(1,2,0):("아직 대기 중인 게 있으면 모아 둘게요.","오답 둘 다 정답보다 김—하나는 정답 길이 이하로","F"),
(2,1,0):("부위에 타는 느낌이 들면 손을 들어 주세요.","오답 둘 다 정답보다 김","F"),
(3,4,1):("잃어버리지 않게 가방에 표를 달아 둘게요.","오답 둘 다 정답보다 김","F"),
(5,3,0):("항생제는 미리 처방됐나요?","오답 둘 다 정답보다 김","F"),
(14,3,0):("해결되면 타임아웃을 다시 해요.","오답 둘 다 정답보다 김","F"),
(19,4,1):("환자, 부위, 시술을 차분히 확인합시다.","오답 둘 다 정답보다 김","F"),
(20,0,1):("이식물 정보는 카드에 적혀요.","오답 둘 다 정답보다 김","F"),
(20,4,1):("만약을 위해 심박동기와 MRI 기록을 따로 둡시다.","오답 둘 다 정답보다 김","F"),
}
DECOY={
(1,2):("already signed","r1 'flag each result still pending'이 ko와 같은 뜻—다른 정답 조립","T"),
(1,3):("with the surgeon","'from the top'≈'한 번 더'—다른 정답 조립, 0.3 'from the start'와 겹침","T"),
(2,3):("flush","'talk to your IV site'—우스워서 걸러짐","F"),
(2,4):("no redness","'much swelling'—정답 청크를 뒤집은 반대말","F"),
(3,2):("at the front desk","r2 'keep your belongings with a tag'≈이름표 붙인 가방—정답 가까움","T"),
(4,4):("than to ask","'than to nap'—우스워서 걸러짐","F"),
(6,2):("to ask about it","'to thank them'—우스워서 걸러짐","F"),
(6,4):("the platelet count","'the invoice'—장면 밖(청구서)","F"),
(7,0):("isn't normal","r1 'isn't clear yet'≈아직 안 나옴—정답 가까움","T"),
(7,2):("decide","r1 'let the whole room know'—집도의·마취과를 포함해 정답 둘(새 decoy는 보고 대상이 아닌 know 자리)","T"),
(7,3):("This form is required","'is on file'—어느 청크 자리에도 안 맞음(모양으로 걸러짐)","F"),
(8,0):("hearing aids","'or any glasses'—두 청크에 걸쳐 어느 자리에도 안 맞음","F"),
(8,1):("When and why","'and how long'—어느 자리에도 안 맞음","F"),
(8,3):("broken bones","'any broken bones'—'any'가 겹쳐 어느 자리에도 안 맞음","F"),
(9,1):("a label","r1 'give it right here'≈지금—정답 가까움","T"),
(9,4):("so we don't rush","'so we keep quiet'—자리에 안 맞고 우스움","F"),
(10,3):("a new blood draw","'near the bed'—어느 자리에도 안 맞음","F"),
(11,4):("you go home","'you smile'—우스워서 걸러짐","F"),
(13,3):("Your blood pressure","', so I'll text'—조립하면 'text the team know'로 문법이 깨짐","F"),
(13,4):("an extra pillow","r2 'give insulin with a pen before surgery'—'필요하면'이 빠진 무조건 인슐린 지시","S"),
(14,1):("and wait","'and relax'—우스워서 걸러짐","F"),
(14,3):("This alarm","'needs to be framed'—우스워서 걸러짐","F"),
(14,4):("the lab results","'the lunch order'—장면 밖","F"),
(15,0):("in the urine","r2 'critically high at this point'—6.8만 빠진 정답 가까운 문장","T"),
(15,2):("about the schedule","r2 'calling … from my phone'—'지금 바로'만 바뀐 정답 가까운 문장","T"),
(15,4):("a second opinion","'before we sit'—자리에 안 맞음","F"),
(16,0):("hasn't been mixed","9.0 'isn't labeled'와 같은 낱말 되풀이","F"),
(16,1):("the next case","'the music'—우스워서 걸러짐","F"),
(16,2):("and checking the line","'repeating the order'—자리에 안 맞음","F"),
(16,3):("labeled","'the monitor'—어느 자리에도 안 맞음(청크 'until the antibiotic' 자리에 넣으면 항생제 조건이 빠짐)","F"),
(16,4):("so we're not interrupted","'so we're not tired'—장면 밖","F"),
(17,1):("emergency platelets","'extra blankets'—장면 밖·우스움","F"),
(17,2):("the sepsis","'the safety protocol'—청크 자리에 안 맞음","F"),
(17,3):("breathing fast","r1 'patient is resting quietly'—잘못된 안심","S"),
(18,0):("with the monitor","'with us'—우스움","F"),
(18,1):("and place the cable","'and note the time'—자리에 안 맞음","F"),
(19,0):("a full drill","'in a simulation'—어느 자리에도 안 맞음","F"),
(19,3):("the paperwork","'even here'≈'even now'—다른 정답 조립","T"),
(20,2):("or the pharmacy","'or a phone book'—우스움","F"),
(20,4):(", just for today","', just for fun'—우스움","F"),
}
# blanks: (sit,sent): (answer, [options], why, kind)
BLANK={
(0,3):("checklist",["checklist","consent","medications","schedule"],"bill·receipt 장면 밖","F"),
(1,1):("here",["here","pending","missing","late"],"정답 CBC가 화면 ko에 그대로 보임(답 노출)","T"),
(1,4):("result",["result","order","sample","dose"],"(가르치는 말 result로 옮김) sodium·calcium·glucose 묶음이 15.0과 똑같고 potassium이 세 빈칸 정답—'potassium 고르기'가 됨(저작자 문의)","F"),
(2,4):("no",["no","some","mild","new"],"'there's big swelling'—문법으로 걸러짐","F"),
(3,2):("keep",["keep","carry","pack","check"],"mail 장면 밖","F"),
(4,3):("restroom",["restroom","blanket","pillow","wheelchair"],"charger 장면 밖","F"),
(5,4):("surgeon",["surgeon","patient","pharmacist","porter"],"clerk·driver 장면 밖","F"),
(6,2):("expedite",["expedite","describe","check","return"],"weigh·measure 장면 밖","F"),
(7,2):("surgeon",["surgeon","pharmacist","family","charge nurse"],"chaplain·dietitian·volunteer 장면 밖","F"),
(7,3):("proceed",["proceed","leave","enter","discharge"],"relax 장면 밖","F"),
(7,4):("again",["again","alone","myself","quickly"],"'always in a few minutes'·'easily'—문법으로 걸러짐","F"),
(8,0):("have",["have","need","want","feel"],"'hear a pacemaker' 우스움","F"),
(8,2):("surgical",["surgical","dental","recovery","imaging"],"billing·laundry 장면 밖","F"),
(8,3):("joint replacements",["joint replacements","dental fillings","heart stents","skin grafts"],"eye drops·hair dye는 'other implants'와 안 맞아 뜻으로 걸러짐","F"),
(9,3):("antibiotic",["antibiotic","sedative","X-ray","dressing"],"budget·quota·inventory 장면 밖(사무 낱말) — 가르치는 말 antibiotic으로 옮김","F"),
(12,1):("given",["given","offered","shown","prescribed"],"'taught a blood thinner'—문법으로 걸러짐","F"),
(12,3):("compression",["compression","insulated","cushioned","waterproof"],"charging 장면 밖","F"),
(13,0):("check",["check","write","chart","tape"],"sketch 장면 밖","F"),
(13,4):("needed",["needed","labeled","stored","packed"],"shipped 장면 밖","F"),
(14,0):("chart",["chart","wristband","calendar","badge"],"menu 장면 밖(주제에서 menu 3회)","F"),
(14,2):("surgeon",["surgeon","resident","porter","pharmacist"],"dentist·driver 장면 밖","F"),
(14,3):("mismatch",["mismatch","message","alarm","mark"],"menu 장면 밖","F"),
(14,4):("imaging",["imaging","calendar","schedule","labs"],"menu·radio 장면 밖","F"),
(15,0):("critically",["critically","slightly","mildly","barely"],"1.4와 같은 sodium·calcium·glucose 묶음(저작자 문의)—정도 낱말로 옮김","F"),
(15,2):("calling",["calling","emailing","visiting","thanking"],"greeting·copying 장면 밖","F"),
(16,4):("delayed",["delayed","rushed","blamed","crowded"],"tired·bored·hungry 장면 밖","F"),
(18,3):("settings",["settings","battery","brand","size"],"colors·sounds·logos 장면 밖","F"),
(19,0):("time-out",["time-out","scan","count","signature"],"tour·speech 장면 밖","F"),
(20,2):("reach",["reach","update","review","page"],"greet·pay 장면 밖","F"),
(20,4):("records",["records","photos","labels","forms"],"bills·menus 장면 밖","F"),
}
# order: (sit, line index 0-3): (en, ko, why-note) ; plus order-why replacement
ORDER={
(0,3):({"en":"Once they match, I'll explain each step as we go.","ko":"맞으면 진행하면서 각 단계를 설명할게요"},"3↔4: 'After that'이 2번 뒤에도 붙어 바꿔도 자연스러움"),
(3,2):({"en":"Once they're off, I'll keep them in a labeled bag with your name on it.","ko":"빼고 나면 성함을 적은 가방에 보관해 드릴게요","note":"보관","icon":"lock"},"3↔4: 'With them off'와 'Once they're off'가 같은 전제라 바꿔도 자연스러움"),
(3,3):({"en":"You'll get that bag back after surgery.","ko":"그 가방은 수술 뒤에 돌려드려요","note":"반환","icon":"handshake2"},""),
(5,2):({"en":"So I'll give it as soon as the surgeon is ready, inside that window.","ko":"그러니 그 시간 안에 집도의가 준비되는 대로 투여할게요"},"2↔3: 'So I'll give it…' 뒤에 'That has to be within 60 minutes'가 와도 자연스러움"),
(7,1):({"en":"Since this lab is critical, I'll let the surgeon and anesthesia know.","ko":"필수 검사라 집도의와 마취과에 알릴게요","note":"공유","icon":"pager"},"임상 순서: 집도의·마취과에 알리기 전에 보류를 물음(결정권자에게 먼저)"),
(7,2):({"en":"I'll ask them whether we hold the case until it results.","ko":"결과가 나올 때까지 보류할지 그분들께 여쭤볼게요","note":"질문","icon":"speech"},""),
(7,3):({"en":"Either way, I'll check on the result again in a few minutes.","ko":"어느 쪽이든 몇 분 뒤에 결과를 다시 확인할게요"},""),
(10,2):({"en":"You'll feel a small pinch in that arm.","ko":"그 팔에 작은 따끔함이 느껴질 거예요"},"2↔3: 'when I do'가 1번 뒤에도 붙어 바꿔도 자연스러움"),
(11,2):({"en":"During that short time, we'll keep them in a labeled case.","ko":"그 짧은 동안 이름표를 붙인 통에 보관할게요"},"2↔3: 'in the meantime'이 1번 뒤에도 붙어 바꿔도 자연스러움"),
(11,3):({"en":"You'll get that case back as soon as you wake up in recovery.","ko":"회복실에서 깨어나자마자 그 통을 돌려드릴게요"},"3↔4: 4줄이 3줄을 가리키지 않아 바꿔도 읽힘 — 3줄의 'labeled case'를 4줄이 받게"),
(19,2):({"en":"With only thirty seconds at stake, skipping it isn't worth the risk, even now.","ko":"30초밖에 안 걸리니 지금도 생략은 위험을 감수할 일이 아니에요"},"2↔3: 'Given how short that is'가 1줄(타임아웃) 뒤에도 읽힘"),
(12,2):({"en":"If those orders include sleeves, let's put these on before we go back.","ko":"그 오더에 슬리브가 있으면 들어가기 전에 착용할게요"},"2↔3: 'based on that'이 슬리브를 가리켜도 읽혀 바꿔도 자연스러움"),
(14,2):({"en":"While we're stopped, I'll get the surgeon to confirm the correct side.","ko":"멈춘 동안 집도의에게 맞는 쪽을 확인받을게요"},"2↔3: 'For that'이 1번(불일치) 뒤에도 붙음"),
(16,2):({"en":"While you decide, please give it now.","ko":"정하시는 동안 지금 투여해 주세요"},"임상: 'Either way, please push it now'는 절개를 보류하지 않아도 된다는 뜻—16.3 '다 들어갈 때까지 절개 불가'와 어긋남"),
(19,1):({"en":"That time-out only takes thirty seconds to confirm the essentials.","ko":"그 타임아웃은 필수 요소를 확인하는 데 30초밖에 안 걸려요"},"1↔2: 30초 문장이 먼저 와도 자연스러움"),
}
ORDER_WHY={
0:"이름과 생년월일, 시술을 차례로 묻고, 두 답을 차트와 대조한 뒤 맞으면 단계 설명을 약속하는 순서예요. First, Now, those answers, Once they match가 줄을 꿰어 순서가 하나로 정해져요.",
3:"착용 여부를 묻고, 있으면 빼 달라고 하고, 뺀 뒤 가방에 보관한다고 알리고, 그 가방을 돌려준다고 약속하는 순서예요. If so, Once they're off, that bag이 앞 줄을 가리켜 순서가 정해져요.",
5:"준비됐다고 알리고, 투여 시한을 말하고, 그 시간 안에 집도의가 준비되면 투여하고, 들어간 시각을 기록하는 순서예요. That, that window, Once it's in이 앞 줄을 가리켜 순서가 정해져요.",
7:"결과가 안 왔다고 알리고, 결정권자인 집도의와 마취과에 먼저 알린 뒤, 그분들께 보류를 여쭙고, 어느 쪽이든 결과를 다시 확인하는 순서예요. Since this lab, them, Either way가 줄을 꿰어 순서가 정해져요.",
10:"라인이 안 흐른다고 알리고, 반대쪽 팔에 새로 잡겠다고 하고, 그 팔이 따끔할 거라고 알리고, 잡히면 흐름이 나아진다고 말하는 순서예요. For that, that arm, Once it's in이 앞 줄을 가리켜 순서가 정해져요.",
11:"이유를 말하고, 잠깐이라고 안심시킨 뒤, 그 짧은 동안 이름표 붙인 통에 보관한다고 알리고, 깨어나면 그 통을 돌려준다고 약속하는 순서예요. It, that short time, that case가 앞 줄을 가리켜 순서가 정해져요.",
12:"투약 여부를 묻고, 그 답을 바탕으로 오더를 확인하고, 그 오더에 슬리브가 있으면 착용시키고, 슬리브가 하는 일을 설명하는 순서예요. based on that, those orders, They가 앞 줄을 가리켜 순서가 정해져요.",
14:"불일치를 알리고, 그러니 멈추고 확인하자고 하고, 멈춘 동안 집도의가 맞는 쪽을 확인하게 하고, 정리되면 시작한다고 하는 순서예요. That mismatch, While we're stopped, Once that's settled가 줄을 꿰어 순서가 정해져요.",
16:"아직 안 들어갔다고 멈춤을 외치고, 절개를 보류할 수 있는지 묻고, 그 답을 정하는 동안 투여해 달라고 하고, 다 들어가면 시각을 기록하는 순서예요. it, While you decide, Once it's fully in이 줄을 꿰어 순서가 정해져요.",
19:"응급에도 타임아웃이 필요하다고 말하고, 그 타임아웃은 30초면 된다고 알리고, 그 30초를 아끼려다 생기는 위험을 짚은 뒤, 세 가지를 함께 확인하자고 하는 순서예요. That time-out, only thirty seconds, So가 줄을 꿰어 순서가 정해져요.",
}
WHY={
(1,1):("are both here로 두 항목이 모두 도착했다고 한 번에 알려요. CBC와 type-and-screen은 수술 전에 흔히 내는 검사라 약어 그대로 말해요.","'수술 전 표준 검사'—type-and-screen은 출혈이 예상되는 수술에만 내므로 과장"),
(1,3):("Let me…로 내가 바로 하겠다고 부드럽게 알리고, one more time으로 이미 본 것도 놓치지 않게 다시 본다는 신중함을 보여요.","뜻풀이만 함(왜 그렇게 말하는지 없음)"),
(3,1):("so it doesn't…로 금속을 빼는 목적을 앞세워 지시가 아니라 이유로 들리게 해요. 금속은 소작 전류로 화상을 입히거나 장비 신호를 흐릴 수 있어요.","'장비를 지키는 이유'—금속 제거는 장비 보호가 아니라 화상·간섭 예방(사실 틀)"),
(14,2):("I'll get…to…로 집도의가 직접 확인하게 하겠다고 밝혀요. 쪽을 정하는 최종 책임은 집도의에게 있어 간호사가 대신 판단하지 않아요.","뜻풀이만 함('correct side는 쪽을 확인한다는 뜻')"),
(20,2):("I'll try to…로 닿지 않을 수도 있다고 솔직히 말하면서도 해 보겠다고 약속해요. reach는 전화든 기록 조회든 연락이 닿는 길을 아울러요.","뜻풀이만 함('reach는 연락이 닿는다는 뜻')"),
}
def stable(s):
    h=0
    for c in s: h=(h*131+ord(c))%1000003
    return h
def apply(d, reorder=True):
    a=copy.deepcopy(d)
    S=a['situations']
    for (i,j,k),(v,_,_) in DK.items(): S[i]['sentences'][j]['distractorsKo'][k]=v
    for (i,j),(v,_,_) in DECOY.items(): S[i]['sentences'][j]['decoy']=v
    for (i,j),(ans,opts,_,_) in BLANK.items():
        S[i]['sentences'][j]['blank']={'answer':ans,'options':[{'en':o} for o in opts]}
    for (i,k),(line,_) in ORDER.items():
        L=S[i]['order']['lines'][k]
        for kk,vv in line.items(): L[kk]=vv
    for i,w in ORDER_WHY.items(): S[i]['order']['why']=w
    for (i,j),(w,_) in WHY.items(): S[i]['sentences'][j]['why']=w
    if reorder:
        # 정답 위치: 저장 순서 그대로 그려짐(authoredBlank) — 0-1-2-3 순환을 깨고 고르게
        n=0
        for i,s in enumerate(S):
            for j,x in enumerate(s['sentences']):
                b=x['blank'];ans=b['answer'];wr=[o['en'] for o in b['options'] if o['en']!=ans]
                p=[0,2,3,1,3,0,1,2,2,1,0,3,1,3,2,0][stable(x['en'])%16]
                opts=wr[:]; opts.insert(p,ans); b['options']=[{'en':o} for o in opts]; n+=1
    return a
if __name__=='__main__':
    a=apply(d)
    yaml.safe_dump(a,open(OUT,'w'),allow_unicode=True,sort_keys=False,width=1000)
    import sys as _s; _s.path.insert(0,'../../..')
    from verify_lesson_content import length_tell,_ko_stems
    nsl=lambda t: len(re.sub(r'\s','',t))
    for (i,j,k),(v,_,_) in DK.items():
        x=a['situations'][i]['sentences'][j];ko=x['ko'];o=x['distractorsKo']
        if length_tell(ko,v): print('V20',i,j,k,nsl(ko),nsl(v),v)
    for i,s in enumerate(a['situations']):
        for j,x in enumerate(s['sentences']):
            ko=x['ko'];o=x['distractorsKo']
            if min(nsl(o[0]),nsl(o[1]))>nsl(ko): print('BOTH LONGER',i,j,nsl(ko),[nsl(t) for t in o])
    print('DK',len(DK),'sent',len({(i,j) for i,j,_ in DK}),collections.Counter(v[2] for v in DK.values()))
    print('DECOY',len(DECOY),collections.Counter(v[2] for v in DECOY.values()))
    print('BLANK',len(BLANK),collections.Counter(v[3] for v in BLANK.values()))
