import yaml,re,collections,copy,json
SRC='or-minimally-invasive.yaml'; OUT='_reviewB_or-minimally-invasive_after.yaml'
d=yaml.safe_load(open(SRC)); d0=copy.deepcopy(d)
# 원본 오답 모양(칸별): f=사실문 d=같은 틀 세부 p=앞 단계 b=뒤 단계
ORIG={}
for k,v in {
'0':'df ff pf df pf df','1':'ff pf pf ff pf pf','2':'dd fd pf pf ff df','3':'pf pf ff ff pf ff',
'4':'dd ff pf pf dd pf','5':'ff dd fd df ff ff','6':'ff ff pf ff ff dd','7':'df ff ff df ff pf',
'8':'dd pf df df ff ff','9':'ff ff ff ff ff dd','10':'ff ff ff ff ff ff','11':'df ff pf pf ff ff',
'12':'df ff ff ff ff pf','13':'ff ff ff ff ff ff','14':'df ff pf pf df pf','15':'ff ff ff ff pf ff',
'16':'ff ff ff ff ff ff','17':'ff pf pf ff ff ff','18':'ff pf ff ff pf ff','19':'ff ff ff ff ff ff',
'20':'ff pf ff ff ff ff'}.items():
  for j,s in enumerate(v.split()): ORIG[(int(k),j)]=s
# distractorsKo: (sit,sent,k): (new, reason, cls, shape)  cls S=안전 T=정답둘 F=기타 / shape f d p b
P={
# S0
(0,1,0):("모니터, 광원, 기복기가 꽂혀 있습니다.","둘 다 사실문(정답만 보고 모양) — 같은 보고 틀에서 '켜짐'만 '꽂힘'으로(해 없음, 다음 줄에서 작동 확인)","F","d"),
# S1
(1,0,0):("CO2 탱크는 가득 찼고 카트에 묶여 있습니다.","둘 다 사실문('단단한 금속 통' — 장면과 먼 사실) — 같은 틀에서 '연결'만 '카트에 묶임'으로","F","d"),
(1,1,0):("기복기 전원 스위치를 켭시다.","'설정 전에' — 정답 ko에 없는 전에 표지(몰림). 표지 없는 앞 단계로","F","p"),
(1,3,0):("탱크 밸브를 열고 압력 게이지를 봅니다.","둘 다 사실문 — 게이지를 읽는 바로 앞 단계(정상이라는 판정은 넣지 않음)","F","p"),
(1,4,0):("유량 속도를 기기에 입력합시다.","'먼저 읽어 봅시다' — 먼저 표지(정답 ko에 없음) + 유지를 읽기로 바꿈. 같은 틀에서 '유지'만 '입력'으로","F","d"),
(1,5,0):("전부 연결됐는지 손으로 확인할게요.","'연결 확인 전에' — 전에 표지(정답 ko에 없음). 확인은 남기고 '다시'만 '손으로'","F","d"),
# S2
(2,3,0):("화이트밸런스용 흰 거즈를 폅시다.","'확인 전에' — 전에 표지(정답 ko에 없음)","F","p"),
(2,4,0):("렌즈가 따뜻하고 준비된 것 같습니다.","2.2 오답2와 글자 그대로 같은 문장 + 둘 다 사실문 — 같은 틀에서 '깨끗'만 '따뜻'으로","F","d"),
# S3
(3,0,0):("로봇 앞 바닥을 비웁시다.","'먼저' 표지(정답 ko에 없음) — 표지만 뺀 앞 단계","F","p"),
(3,1,0):("팔에 멸균 덮개를 씌울게요.","'먼저' 표지(정답 ko에 없음) — 표지만 뺀 앞 단계","F","p"),
(3,2,0):("정렬을 확인한 카트를 밀게요.","둘 다 사실문('바퀴가 네 개' — 장면과 먼 사실) — 확인을 남긴 뒤 단계로","F","b"),
(3,3,1):("포트 자리와 일렬로 맞춘 카트를 천천히 밉니다.","둘 다 사실문 — 맞춘 다음 단계(같은 상황 3.4의 '바퀴 고정'은 피함)","F","b"),
(3,5,0):("여유 공간을 확인한 팔에 기구를 끼울게요.","둘 다 사실문 — 확인을 남긴 뒤 단계","F","b"),
# S4
(4,0,0):("어떤 트로카 크기를 먼저 열까요?","'먼저→나중에' 반대말 뒤집기(⑤) — 같은 틀에서 '원하다'만 '열다'로","F","d"),
(4,1,0):("5밀리미터와 12밀리미터를 주문해 뒀습니다.","둘 다 사실문 — 같은 틀에서 '준비'만 '주문'으로(같은 상황 4.5의 '세기'는 피함)","F","d"),
(4,3,0):("트로카 트레이를 테이블에 둘게요.","'열기 전에' — 전에 표지(정답 ko에 없음)","F","p"),
# S5
(5,0,0):("확인할 패드를 꺼냅시다.","둘 다 사실문 — 확인을 남긴 앞 단계","F","p"),
(5,1,0):("압박점에 댈 패드가 더 있나요?","'표시되고 있나요' — 보호 여부 확인을 표시 여부 확인으로 바꿈(확인 내용 바꾸기)","S","p"),
(5,1,1):("압박점은 뼈가 튀어나온 곳이에요.","'몇 군데인가요' — 보호 확인을 개수 질문으로 바꿈(빠뜨린 확인)","S","f"),
(5,3,0):("확인할 발뒤꿈치와 팔꿈치에서 담요를 걷어 냅시다.","'혈액순환을 위해' — 무엇을 보는지(패딩)를 다른 것으로 바꿈(확인 대상 바꾸기)","S","p"),
(5,4,1):("옆에 고정한 팔 위에 시트를 덮습니다.","둘 다 사실문 — 고정 다음 단계","F","b"),
(5,5,0):("안전 스트랩을 같이 확인할게요.","둘 다 사실문 — 확인은 남기고 '다시'만 '같이'로","F","d"),
# S6
(6,1,0):("높이 오르지 않게 경보음을 켭시다.","'과하게 차면' — 면 표지(정답 ko에 없음). 상한을 지키는 앞 단계로","F","p"),
(6,2,0):("팽팽한 복부는 압력이 높다는 신호예요.","'말씀하시기 전에 복부를 봐' — 알리기 전에 다시 보게 함(보고를 늦춤). 보고 요청은 바꿀 세부가 없어 사실문으로","S","f"),
(6,3,0):("압력 수치를 소리 내어 읽어 줄게요.","둘 다 사실문 — 감시는 남는 같은 틀(읽어 주기)","F","d"),
(6,4,0):("15 한계를 기기에 걸어 둡시다.","둘 다 사실문 — 15 아래 유지의 앞 단계(기기 한계 설정)","F","p"),
(6,5,0):("팽창은 기복 가스 때문이에요.","'복부 쪽 상태를 조금 확인합시다' — 상태 보고를 모호한 행동으로(뜻이 흐림)","F","f"),
(6,5,1):("복부가 조금 단단해진 것 같습니다.","'거즈가 조금 붙었습니다' — 팽창 경고를 가벼운 일로(잘못된 안심)","S","d"),
# S7
(7,0,0):("CO2를 주입하면서 EtCO2가 오르고 있습니다.","'EtCO2를 지켜보고 있습니다' — 상승 보고가 빠짐(잘못된 안심). 상승은 남기고 원인만","S","d"),
(7,1,0):("늘릴 환기량을 고릅시다.","둘 다 사실문 — 늘리기를 남긴 앞 단계","F","p"),
(7,2,0):("압력을 낮추는 시점을 집도의와 정해요.","둘 다 사실문 — 낮추기를 남긴 앞 단계","F","p"),
(7,2,1):("낮은 압력은 시야를 좁게 만듭니다.","'낮으면' — 면 표지(정답 ko에 없음) + 두 오답 모두 정답보다 김","F","f"),
(7,3,0):("EtCO2 수치가 갑자기 오르고 있습니다.","'지켜보고 있습니다' — 상승 보고가 빠짐(잘못된 안심). 상승은 남기고 '꾸준히'만","S","d"),
(7,4,0):("환기 설정을 크게 띄웁시다.","둘 다 사실문 — 감시하는 같은 틀","F","d"),
(7,5,0):("압력을 낮추는 일은 집도의가 결정해요.","'알리기 직전에 압력을 볼게요' — 보고 전에 다시 재기(보고를 늦춤) + 직전 표지","S","f"),
# S8
(8,1,0):("새 포트 자리를 간격 넓게 표시합시다.","'팔을 먼저 멈추고' — 먼저 표지 + 간격 두기가 빠짐(일부만). 간격을 남긴 앞 단계로","F","p"),
(8,1,1):("좁은 포트 간격은 충돌로 이어집니다.","'좁으면' — 면 표지(정답 ko에 없음)","F","f"),
(8,2,0):("콘솔에서 팔 위치를 조정할게요.","'팔 덮개를 조정' — 충돌을 막는 위치 조정 대신 다른 일. 조정은 남기고 장소만","S","d"),
(8,2,1):("팔 위치는 포트 자리에 맞춰요.","'카트 옆면 표시등' — 근거가 불확실한 사실","F","f"),
(8,3,0):("공간을 줄 팔을 짚어 봅시다.","'굵은 번호를 붙입시다' — 공간 확보 대신 다른 일","S","p"),
(8,4,0):("왼쪽 팔 클러치를 눌러 풀게요.","둘 다 사실문 — 각도를 다시 잡기 바로 앞 단계(쪽은 그대로)","F","p"),
(8,5,0):("팔 충돌은 두 팔이 겹칠 때 생겨요.","'겹치면' — 면 표지(정답 ko에 없음)","F","f"),
# S9
(9,0,0):("개방 세트를 카트에 둡시다.","둘 다 사실문 — 같은 틀에서 '대기'만 '카트에 두기'로(방 안, 해 없음)","F","d"),
(9,1,0):("필요하면 빠르게 세트를 열 수 있어요.","둘 다 사실문 — 같은 틀(필요하면 빠르게 ~할 수 있다)","F","d"),
(9,2,0):("개복술 트레이를 뒤 테이블에 둘게요.","둘 다 사실문 — 같은 틀에서 '준비 상태'만 '뒤 테이블'로(방 안)","F","d"),
(9,3,0):("확인한 개방 트레이는 그대로 둡시다.","둘 다 사실문 — 확인을 남긴 뒤 단계","F","b"),
# S10
(10,0,0):("지금 가파른 트렌델렌버그로 내리는 중입니다.","둘 다 사실문 — 같은 체위, '이미 들어감'만 '들어가는 중'으로","F","d"),
(10,1,0):("낮은 머리는 얼굴을 붓게 해요.","'머리가 낮으면' — 면 표지(정답 ko에 없음). 감시 대상이 둘이라 바꿀 세부가 없어 사실문으로","F","f"),
(10,2,0):("수평 맞추는 간격을 집도의와 의논합시다.","둘 다 사실문 — 수평 맞추기를 남긴 앞 단계","F","p"),
(10,3,0):("혈압은 체위 영향을 크게 받아요.","'바꾸면' — 면 표지(정답 ko에 없음)","F","f"),
(10,4,0):("얼굴과 눈을 자주 확인합시다.","둘 다 사실문 — 확인은 남기고 '면밀히'만 '자주'로","F","d"),
# S11
(11,1,0):("확인한 튜빙을 다시 꽂읍시다.","둘 다 사실문 — 확인을 남긴 뒤 단계","F","b"),
(11,2,0):("예비 유닛을 바로 꽂을게요.","'가져오기 직전에 문을 열게요' — 직전 표지","F","b"),
(11,3,0):("지금 고장 난 기복기 전원을 끕시다.","'교체하기 앞서' — 앞서 표지. 표지 없는 바로 앞 단계로","F","p"),
(11,4,1):("낮은 가스 압력은 복강을 덜 부풀게 합니다.","'낮으면' — 면 표지(정답 ko에 없음)","F","f"),
(11,5,0):("재설정 버튼을 기계 뒤쪽에서 찾을게요.","'재설정하면' — 면 표지 + 둘 다 사실문","F","p"),
# S12
(12,1,1):("렌즈를 데워서 얼룩을 없앱시다.","둘 다 사실문 — 같은 틀에서 '김서림'만 '얼룩'으로(같은 상황 다른 문장의 정답 '닦기'는 피함)","F","d"),
(12,2,0):("닦아서 천천히 다시 삽입할게요.","둘 다 사실문 — 같은 틀에서 '빠르게'만 '천천히'로(해 없음)","F","d"),
(12,2,1):("다시 삽입할 땐 시야가 잠깐 끊깁니다.","'삽입하면' — 면 표지(정답 ko에 없음)","F","f"),
(12,3,1):("시야가 자꾸 어두워집니다.","'흐리면' — 면 표지 + 둘 다 사실문. 같은 보고 틀(둘 다 스코프를 손볼 일)","F","d"),
(12,4,1):("워머 뚜껑을 미리 젖힙시다.","둘 다 사실문 — 담그기 바로 앞 단계","F","p"),
(12,5,0):("렌즈를 닦기 전에 김서림 방지액을 바를게요.","'장갑부터 바꿀게요' — 장갑 앞 단계가 주제에서 5번 되풀이(12.5·14.3·17.1·18.4·20.1) + 부터 표지","F","p"),
# S13
(13,0,0):("언도킹 절차서를 펼칩시다.","둘 다 사실문 — 검토 바로 앞 단계","F","p"),
(13,1,0):("전환해야 할 경우 모두 자기 위치를 알고 있습니다.","둘 다 사실문(같은 머리말에 사실만 붙임) — 같은 틀에서 '역할'만 '위치'로","F","d"),
(13,2,0):("카트에서 해제 레버를 찾을게요.","둘 다 사실문 — 같은 틀에서 '해제 준비'만 '레버 찾기'로","F","d"),
(13,3,0):("모두 언도킹 순서를 한 번 연습해 봅시다.","둘 다 사실문 — 같은 틀에서 '아는지 확인'만 '연습'으로(해 없음)","F","d"),
(13,4,0):("지금 해제 레버를 확인해 볼게요.","둘 다 사실문 — 같은 틀에서 '연습'만 '확인'으로","F","d"),
# S14
(14,1,0):("검체를 바로 용기에 담을게요.","둘 다 사실문 — 꺼낸 뒤 단계","F","b"),
(14,2,0):("확인할 검체를 놓을게요.","'확인에 앞서' — 앞서 표지(같은 상황 14.1의 '꺼내기'는 피함)","F","p"),
(14,3,0):("확인 전에 백 입구를 벌립시다.","'장갑부터 바꿉시다' — 장갑 앞 단계 되풀이 + 부터 표지","F","p"),
# S15
(15,3,1):("왼쪽으로 돌릴 환자 양옆에 사람을 세웁시다.","둘 다 사실문 — 돌리기를 남긴 바로 앞 단계(문장당 하나)","F","p"),
(15,4,0):("도움은 크고 분명하게 불러요.","'요청하기 직전에 위치를 외칠게요' — 직전 표지","F","f"),
(15,5,1):("높은 압력은 정맥 순환을 줄입니다.","'높으면' — 면 표지(정답 ko에 없음)","F","f"),
# S17
(17,0,1):("개복은 복강경보다 절개가 훨씬 큽니다.","'전환하면' — 면 표지(정답 ko에 없음)","F","f"),
(17,1,0):("개봉할 트레이를 바로 꺼내세요.","'개봉하기 직전에 장갑을 확인' — 직전 표지 + 장갑 되풀이","F","p"),
(17,2,0):("들여올 일손을 고릅시다.","'들여오기 앞서 문을 엽시다' — 앞서 표지","F","p"),
(17,3,0):("빠르게 움직이되 목소리를 낮춥시다.","'침착하면' — 면 표지 + 둘 다 사실문. 같은 틀에서 '침착'만 '목소리'로","F","d"),
# S18
(18,0,0):("로봇이 고장 나서 경고음을 내고 있습니다.","둘 다 사실문 — 같은 고장 보고, '반응 없음'만 '경고음'으로(대응 같음)","F","d"),
(18,1,0):("언도킹할 팔 순서를 부릅시다.","'언도킹하기 직전에 팔 위치를 읽읍시다' — 직전 표지","F","p"),
(18,2,0):("준비할 트레이를 가져오세요.","둘 다 사실문 — 준비를 남긴 바로 앞 단계","F","p"),
(18,4,0):("손으로 풀 레버를 찾읍시다.","'풀어내기 앞서 장갑을' — 앞서 표지 + 장갑 되풀이","F","p"),
# S19
(19,0,0):("얼굴까지 염발음이 퍼지고 있습니다.","둘 다 사실문 — 같은 보고, 범위를 더 무거운 쪽으로(대응 같음·잘못된 안심 아님)","F","d"),
(19,1,1):("높은 기도 압력은 폐에 부담을 줍니다.","'높으면' — 면 표지(정답 ko에 없음)","F","f"),
(19,2,0):("복강 내 가스를 빼는 일은 폐의 부담을 덜어 줍니다.","'빼면' — 면 표지(정답 ko에 없음)","F","f"),
(19,3,0):("피부 밑에서 뿌드득거리는 게 들립니다.","'눌러 보면' — 면 표지 + 둘 다 사실문. 같은 소견, '만져짐'만 '들림'으로","F","d"),
(19,4,1):("빠르게 오르는 기도 압력은 환기를 어렵게 만듭니다.","'오르면' — 면 표지(정답 ko에 없음)","F","f"),
(19,5,0):("가스를 천천히 빼는 까닭은 순환 때문이에요.","'빼면' — 면 표지(정답 ko에 없음)","F","f"),
# S20
(20,0,0):("피로 가득한 필드는 영상을 온통 붉게 만듭니다.","'잃으면' — 면 표지(정답 ko에 없음)","F","f"),
(20,1,0):("압박을 가할 큰 거즈를 바로 건넵시다.","'가하기 앞서 장갑을' — 앞서 표지 + 장갑 되풀이","F","p"),
(20,4,1):("압박을 계속 유지하는 것은 출혈을 줄입니다.","'유지하면' — 면 표지(정답 ko에 없음)","F","f"),
(0,5,0):("광원 선을 꽂을게요.","두 오답 모두 정답보다 김(길이로 정답이 드러남) — 앞 단계를 정답 길이 이하로","F","p"),
(1,2,1):("유량은 분당 리터로 읽어요.","두 오답 모두 정답보다 김 — 사실문을 짧게","F","f"),
(2,5,0):("스코프를 카메라에 이을게요.","두 오답 모두 정답보다 김 — 같은 앞 단계를 짧게","F","p"),
(4,5,0):("세기 전에 트레이를 폅시다.","두 오답 모두 정답보다 김 — 같은 앞 단계를 짧게(전에는 정답 ko에도 있음)","F","p"),
(6,0,0):("압력 단위는 mmHg예요.","두 오답 모두 정답보다 김 — 사실문을 짧게","F","f"),
(6,1,1):("수치는 화면 위쪽에 떠요.","두 오답 모두 정답보다 김 — 사실문을 짧게","F","f"),
(7,1,1):("환기량은 리터로 세요.","두 오답 모두 정답보다 김 — 사실문을 짧게","F","f"),
(8,0,0):("팔들이 너무 느려지고 있습니다.","두 오답 모두 정답보다 김 — 같은 보고 틀을 짧게","F","d"),
(14,0,1):("회수백은 크기가 여러 가지예요.","두 오답 모두 정답보다 김 — 사실문을 짧게","F","f"),
(14,4,0):("검체가 온전하고 깨끗해 보입니다.","두 오답 모두 정답보다 김 — 같은 보고 틀에서 '완전'만 '깨끗'으로","F","d"),
(15,5,0):("압력은 CO2로 오릅니다.","두 오답 모두 정답보다 김 — 사실문을 짧게","F","f"),
(16,1,1):("혈관 손상은 삽입 때 생겨요.","두 오답 모두 정답보다 김 — 사실문을 짧게","F","f"),
(17,5,0):("일손은 소리 내어 불러요.","두 오답 모두 정답보다 김 — 사실문을 짧게","F","f"),
(19,1,0):("기도 압력이 계속 높아요.","둘 다 사실문 — 같은 지표·같은 방향의 보고(오름→계속 높음, 잘못된 안심 아님)","F","d"),
(13,0,1):("언도킹 절차는 매뉴얼에 실려 있어요.","'다르다' 어간이 오답에만 7번(되풀이 상한)","F","f"),
(1,1,1):("압력 한계는 기복기 화면에서 골라요.","'정하다' 어간이 오답에만 6번(되풀이 상한)","F","f"),
}
# blank: (sit,sent): (answer, [options], reason, cls)
B={
(0,1):("light source",["light source","foot pedal","suction tubing","trocar tray"],"camera head — 타워 장비라 '켜져 있다'가 그대로 성립(정답 둘)","T"),
(0,2):("working",["working","labeled","unplugged","packed"],"sterile — '덮기 전에 멸균 확인'이 그대로 성립(정답 둘)","T"),
(0,3):("clear",["clear","blurry","grainy","hazy"],"dim·small — '어둡고 또렷'·'작고 또렷'도 보고로 성립해 ko 없이 못 정함. and sharp와 어긋나는 말로","T"),
(1,0):("full",["full","sterile","sharp","foggy"],"new — 새 탱크는 가득 찬 탱크(정답 둘), empty도 보고로 성립","T"),
(1,2):("flow",["flow","brightness","focus","color"],"color·weight·brand — 기복 장면과 동떨어진 말(파일럿 2번) → 같은 복강경 장비 쪽 틀린 말","F"),
(1,3):("gauge",["gauge","valve","hose","filter"],"high/low/zero — 계기 값 보고는 넷 다 성립해 ko 없이 못 정함 → reads가 맞는 명사 자리로","T"),
(2,5):("scope",["scope","label","cable","drape"],"camera — 스코프를 흔히 camera라 부름, trocar — '천천히 삽입'이 그대로 성립(정답 둘)","T"),
(3,2):("aligned",["aligned","tilted","folded","labeled"],"plugged in·parked — 카트 점검으로 그대로 성립(정답 둘)","T"),
(5,1):("protected",["protected","numbered","painted","sterile"],"reddened — 압박점이 붉어졌는지 묻는 피부 확인으로 성립(정답 둘)","T"),
(5,2):("table",["table","chair","wall","stool"],"bed — 수술대를 bed라고도 함, stretcher — 이송 중 고정으로 성립(정답 둘)","T"),
(6,0):("pressure",["pressure","tubing","button","cable"],"flow·rate — 기복 유량 15 L/min이 그대로 성립(정답 둘)","T"),
(6,1):("climb",["climb","drop","fall","sink"],"too fast·too early — '너무 빨리 오르지 않게'가 그대로 성립(정답 둘). 빈칸을 climb으로(too high와 어긋나는 동사)","T"),
(6,5):("abdomen",["abdomen","monitor","screen","cable"],"bruised·flattened — 복부 관찰 보고로 성립해 ko 없이 못 정함. 빈칸을 abdomen으로","T"),
(8,4):("port",["port","sponge","suture","glove"],"upper/lower/far — 방향어끼리는 ko 없이 못 정함. 빈칸을 port로","T"),
(10,2):("level",["level","wipe","label","lock"],"carefully·slowly — '조심히/천천히 수평'이 그대로 성립(정답 둘). 빈칸을 level로","T"),
(10,3):("pressure",["pressure","clock","drape","mirror"],"pulse·oxygen — 이 체위에서 맥박·산소가 낮다는 보고로 성립(정답 둘)","T"),
(10,4):("closely",["closely","rarely","loudly","later"],"ears·nose·lips — 트렌델렌버그 얼굴 부종 점검으로 성립(정답 넷). 빈칸을 closely로","T"),
(11,4):("pressure",["pressure","suction","sponge","staple"],"flow·volume·level — 같은 기복기 오류 장면에서 '가스 유량이 낮다'도 실제 경보라 ko 없이 못 정함 → gas와 어울리지 않는 같은 분야 명사로","T"),
(12,0):("scope",["scope","glove","bulb","badge"],"heating/lighting up — 'X up' 보고로 성립(정답 둘). 빈칸을 scope로","T"),
(12,1):("warm",["warm","chill","freeze","cover"],"rinse — '헹구고 김서림 제거'가 성립(정답 둘)","T"),
(12,3):("blurry",["blurry","clearer","sharper","steadier"],"dark·narrow — 시야 보고로 성립(정답 둘)","T"),
(12,4):("warmer",["warmer","cooler","dryer","freezer"],"basin — 따뜻한 식염수 대야에 담그는 방법으로 성립(정답 둘)","T"),
(13,4):("practice",["practice","polish","relabel","unplug"],"inspect — '해제 레버 점검'이 그대로 맞는 준비(정답 둘)","T"),
(14,4):("intact",["intact","frozen","striped","sticky"],"firm·dark·round — 검체 모양 보고로 성립해 ko 없이 못 정함","T"),
(15,4):("help",["help","gloves","a stool","a pen"],"a cart — 응급 카트(crash cart)를 부르는 말로 성립(정답 둘)","T"),
(15,5):("pressure",["pressure","camera","drape","light"],"volume·noise·light — 장면과 동떨어진 말 둘(파일럿 2번) → 같은 장비 쪽 틀린 말","F"),
(16,5):("suction",["suction","smoke","fog","noise"],"clamps·irrigation·cautery — 출혈 장면에서 그대로 필요한 것(정답 넷)","T"),
(17,5):("extra",["extra","idle","shaky","tired"],"sterile·clean — '멸균된 손(스크럽한 사람)이 필요'가 성립(정답 둘)","T"),
(19,0):("crepitus",["crepitus","redness","numbness","itching"],"swelling — 피하기종은 목까지 붓는 것으로도 보고됨(정답 둘)","T"),
(19,2):("ventilation",["ventilation","nutrition","hydration","digestion"],"circulation — 가스 해제 후 순환 지원도 성립(정답 둘)","T"),
(19,4):("pressures",["pressures","alarms","lights","tables"],"doors — 장면과 동떨어진 말(파일럿 2번)","F"),
(19,5):("airway",["airway","chart","clock","count"],"tubing·monitor — '회로·모니터 재확인'이 성립(정답 둘)","T"),
}
# decoy: (sit,sent): (new, reason, cls)
C={
(0,0):("unplug","the back table — '뒤 테이블을 세팅하자'가 이 장면에서 실제로 하는 다른 일(그대로 맞는 문장)","F"),
(0,5):("at the end","for you — 'I'll turn on the light source for you.'가 ko와 거의 같음(지금만 빠짐)","T"),
(2,2):("after closure","for the team — 'I'll defog the lens for the team.'이 ko에서 시점만 빠진 같은 행동 + 4.2와 같은 decoy","T"),
(3,4):("the drawers","on the cart — 'Let's lock the wheels on the cart.'가 ko에서 시점만 빠진 같은 행동","T"),
(4,2):("the gowns","for the team — 2.2와 같은 decoy, 'Let's confirm the ports for the team.'이 ko와 거의 같음","T"),
(5,5):("the sharps box","the arm boards — 체위 장면에서 실제로 하는 다른 확인(그대로 맞는 문장)","F"),
(8,2):("from the console","for the surgeon — 'I'll adjust the arm position for the surgeon.'이 ko에서 장소만 빠진 같은 행동","T"),
(8,5):("arm labels","on the screen — '화면에서 팔 충돌을 살피라'가 그대로 맞는 말","T"),
(9,4):("if the suction","is dark — '피가 검으면 전환' 같은 틀린 판단 기준을 조립하게 함","S"),
(10,1):("and the wall clock","and the blue drape — drape가 decoy에 6번(14.0·8.3·10.1·15.1·16.0·18.1) 몰림","F"),
(10,2):("the monitor","for anesthesia — 'Let's level the table for anesthesia.'가 '주기적으로'만 빠진 같은 행동","T"),
(11,5):("and the monitor","and write it down — 조립하면 '재설정하고 적어 둘게요' — 다시 확인을 기록으로 바꿈","S"),
(14,5):("the freezer","the cart — 'I'll label the cart'(검체 대신 카트에 라벨)를 조립하게 함","S"),
(15,1):("in tank pressure","a spare drape — drape 몰림 + 어느 자리에도 뜻이 안 맞음","F"),
(15,0):("the light cable","the camera cable — camera가 decoy에 4번(8.4·15.0·16.3·19.2) 몰림","F"),
(15,4):("for a count","the elevator — 위기 장면과 동떨어진 우스운 조각(모양으로 걸러짐)","F"),
(16,0):("a loose clamp","a loose drape — drape가 decoy에 6번 몰림","F"),
(16,4):("to the chart","to the lounge — 위기 장면과 동떨어진 우스운 조각","F"),
(17,0):("to robotic","to paper — 동떨어진 조각","F"),
(18,1):("all trays","all drapes — drape 몰림","F"),
(18,3):("The light source isn't","to the music — 동떨어진 우스운 조각","F"),
(18,4):("with the pedal","by phone — 동떨어진 우스운 조각","F"),
(19,0):("the waist","the ceiling — 동떨어진 우스운 조각","F"),
(20,0):("of smoke","of tape — 동떨어진 우스운 조각","F"),
}
# order: sit -> ({line_idx:(en,ko,note,icon)}, new why or None, reason, cls)
O={
4:({3:("After the count, the 5-millimeter port goes in first.","다 세고 나면 5밀리미터 포트가 먼저 들어가요","순서","pushpin")},
   "크기를 묻고, 준비한 두 크기를 답하고, 시작 전에 그 두 크기를 세고, 센 다음 5밀리미터 포트가 먼저 들어간다고 알리는 순서예요. 답변과 those two sizes, After the count가 앞 줄을 가리켜 순서가 하나로 정해져요.",
   "swap34 자연스러움 — 'Once we start, the 5-mm port goes in first. / Let's count those two sizes before we start.'로 읽어도 대화가 성립(those two sizes가 두 줄 앞을 가리켜도 통함)","F"),
5:({2:("Once those are padded, let's tuck the arms safely at the sides.","거기에 패딩하면 팔을 옆에 안전하게 고정해요",None,None)},None,
   "3줄 시제 — 'Once those are padded, the arms are tucked…'는 조건절 뒤에 이미 끝난 상태를 말해 어색함(청유로)","F"),
6:({3:("Besides my readings, tell me if the abdomen gets too tense.","제 수치와 별도로, 복부가 너무 팽팽해지면 말씀해 주세요",None,None)},
   "현재 압력을 보고하고, 너무 높이 오르지 않게 하자고 하고, 그러려고 수치를 지켜보며 읽어 주고, 그 수치와 별도로 복부가 팽팽해지면 알려 달라고 하는 순서예요. it과 my readings가 앞 줄을 가리켜 순서가 하나로 정해져요.",
   "4줄 시간 한정(TASK 10번) — 'After I call it out, tell me…'는 복부가 팽팽해진 것을 내가 수치를 읽어 준 뒤에만 알리게 해 보고를 늦춤","S"),
7:({2:("With the ventilation up, let's watch the EtCO2 closely.","환기를 늘렸으니 EtCO2를 면밀히 지켜봐요",None,None),
    3:("If it keeps climbing as we watch, we may need to lower the insufflation pressure.","지켜봐도 계속 오르면 기복 압력을 낮춰야 할 수 있어요",None,None)},
   "EtCO2 상승을 보고하고, 낮추려고 환기를 늘리고, 늘린 뒤 EtCO2를 지켜보고, 지켜봐도 계속 오르면 압력 인하를 예고하는 순서예요. it, With the ventilation up, as we watch가 앞 줄을 가리켜 순서가 하나로 정해져요.",
   "swap34 자연스러움 — '…increase minute ventilation. / If the numbers keep climbing, we may need to lower… / With the ventilation up, let's watch the settings.'가 그대로 성립(4줄이 3줄을 가리키지 않음)","F"),
10:({1:("To ease that steep tilt, let's level the table periodically.","가파른 기울기를 덜려고 주기적으로 테이블을 수평으로 맞춥시다",None,None),
     2:("Even with those breaks, watch the pressure and facial swelling.","그렇게 쉬어 가도 혈압과 얼굴 부종을 계속 지켜보세요",None,None)},
   "체위를 알리고, 그 기울기의 영향을 덜려고 테이블을 주기적으로 수평으로 맞추고, 그렇게 쉬어 가도 혈압과 얼굴 부종을 계속 지켜보고, 혈압이 더 떨어지면 알리는 순서예요. that steep tilt와 those breaks와 it이 앞 줄을 가리켜 순서가 하나로 정해져요.",
   "3줄 시간 한정(TASK 10번) — 'Between those, watch the pressure…'는 혈압·부종 감시를 수평 맞추기 사이에만 하게 만듦 + swap23('To ease that'이 부종을 가리켜도 통함)","S"),
15:({1:("On that suspicion, stop insufflation and release the pneumoperitoneum.","그 의심이 들면 기복을 멈추고 복강 가스를 빼요","중단","siren"),
     2:("With the gas off, left lateral, head down, and 100% oxygen.","가스를 끊었으면 왼쪽 측위, 머리 낮춤, 100% 산소","체위","siren"),
     3:("While we position him, I'll call for help right now.","체위를 잡는 동안 지금 바로 도움을 요청할게요","호출","pager")},
   "징후로 색전을 의심하면 원인인 기복부터 멈추고 가스를 빼고, 가스를 끊었으면 이미 들어간 가스에 왼쪽 측위·머리 낮춤·100% 산소를 하고, 체위를 잡는 동안 도움을 부르는 순서예요. On that suspicion, With the gas off, While we position him이 앞 줄을 가리켜 순서가 하나로 정해져요.",
   "임상 순서 — 가스 색전 의심 시 가장 먼저 할 일은 기복 중단·가스 해제(원인 제거)인데 카드는 호출을 2줄, 기복 중단을 3줄 'As I call'에 묶어 호출 뒤로 밀림 + swap34('Left lateral … for the gas already in' / 'As I call, stop insufflation')가 그대로 읽혀 순서가 못 박히지 않음(저작자 메모)","S"),
16:({2:("As we press, suspect a major vessel injury.","누르는 동안 주요 혈관 손상을 의심해요","의심","siren")},
   "출혈을 알리고, 가장 먼저 그 자리를 바로 압박하고, 누르는 그 순간 큰 혈관 손상을 의심하고, 그 의심으로 개복 전환 준비와 호출을 하는 순서예요. 지혈이 먼저이고 의심은 압박과 동시에 해요. that site, As we press, On that suspicion이 앞 줄을 가리켜 순서가 하나로 정해져요.",
   "swap23 자연스러움 — 'There's brisk bleeding. / At that rate, suspect a major vessel injury. / First, let's apply pressure… / On that suspicion, …'가 그대로 성립('At that rate'가 1줄을 가리킴, 저작자 메모)","F"),
17:({2:("With us both on that, let's get another set of hands in the room.","우리 둘이 그걸 맡는 동안 일손을 더 들입시다",None,None),
     3:(None,"이 모든 걸 하면서 빠르게, 침착하게 움직여요",None,None)},
   "전환을 알리고, 그 일로 나는 트레이를 열고 상대는 필드를 준비하고, 둘이 그걸 맡는 동안 일손을 더 들이고, 이 모든 일을 하면서 빠르게 움직이되 침착하라는 순서예요. For that, With us both on that, With all of that going on이 앞 줄을 가리켜 순서가 하나로 정해져요.",
   "swap23 자연스러움('On top of that'은 Also처럼 어느 줄 뒤에도 붙음) + 4줄 ko '일손이 오는 동안'이 en(With all of that going on)과 다르고 why의 'hands coming in'이 카드에 없음","F"),
20:({1:("With the view gone, let's apply pressure and prepare to convert.","시야가 없으니 압박하고 전환을 준비해요","압박","bandage"),
     2:("While we hold pressure, I'll call the surgeon back to the table.","압박하는 동안 집도의를 테이블로 다시 부를게요","호출","pager"),
     3:("With him on the way, suction and get more units in the room.","그가 오는 사이 흡인하고 혈액 팩을 더 들여요","흡인","siren")},
   "시야를 잃었다고 알리고, 그 즉시 압박하며 전환을 준비하고, 압박하는 동안 집도의를 다시 부르고, 그가 오는 사이 흡인하며 혈액 팩을 더 들이는 순서예요. 지혈이 먼저이고 호출은 압박과 동시에 해요. With the view gone, While we hold pressure, With him on the way가 앞 줄을 가리켜 순서가 하나로 정해져요.",
   "임상 순서·시간 한정(TASK 10번) — 'For when he's back, let's apply pressure…'는 압박을 집도의가 돌아올 때를 위한 대비로 읽혀 지혈을 늦추고, 카드가 호출을 지혈보다 먼저 가르침(S15와 같은 기준: 처치가 먼저, 호출은 처치와 동시에)","S"),
}
W={}
G={}

def L(s): return len(re.sub(r'\s','',s))
def tell(a,b):
  x,y=L(a),L(b); return max(x,y)/min(x,y)>1.25 and abs(x-y)>3
S=d['situations']; old={}; bad=[]
for (i,j,k),(v,w,c,sh) in P.items():
  x=S[i]['sentences'][j]; old[(i,j,k)]=x['distractorsKo'][k]
  assert v!=old[(i,j,k)],(i,j,k)
  if tell(x['ko'],v): bad.append((i,j,k,L(x['ko']),L(v),v))
  x['distractorsKo'][k]=v
for (i,j,k) in P:
  x=S[i]['sentences'][j]
  assert x['distractorsKo'][0]!=x['distractorsKo'][1] and x['ko'] not in x['distractorsKo'],(i,j)
print('V20 bad',bad)
for i,s in enumerate(S):
  for j,x in enumerate(s['sentences']):
    if min(L(t) for t in x['distractorsKo'])>L(x['ko']): print('none<=',i,j,x['ko'],x['distractorsKo'])
alld=collections.Counter(t for s in S for x in s['sentences'] for t in x['distractorsKo'])
print('dup DK',[k for k,v in alld.items() if v>1])
oldB={};oldC={}
cur=collections.Counter()
for i2,s2 in enumerate(S):
  for j2,x2 in enumerate(s2['sentences']):
    if (i2,j2) not in B: cur[[o['en'] for o in x2['blank']['options']].index(x2['blank']['answer'])]+=1
POS={}
for key in sorted(B):
  p0=min(range(4),key=lambda q:(cur[q],q)); POS[key]=p0; cur[p0]+=1
for (i,j),(a,o,r,c) in B.items():
  x=S[i]['sentences'][j]; oldB[(i,j)]=x['blank']
  n=len(re.findall(r'(?<![A-Za-z-])'+re.escape(a)+r'(?![A-Za-z-])',x['en'])); assert n==1,(i,j,a,n)
  assert len(set(o))==4 and a in o
  o=list(o); o.remove(a); pos=POS[(i,j)]; o.insert(pos,a)
  x['blank']={'answer':a,'options':[{'en':t} for t in o]}
for (i,j),(v,r,c) in C.items():
  x=S[i]['sentences'][j]; oldC[(i,j)]=x['decoy']
  assert v not in x['en'] and v not in x['chunks'],(i,j); x['decoy']=v
oldO={}
for i,(lines,why,r,c) in O.items():
  oldO[i]=copy.deepcopy(S[i]['order'])
  Ls=S[i]['order']['lines']
  for k,(en,ko,note,icon) in lines.items():
    if en: Ls[k]['en']=en; assert len(en.split())<=15,(i,k)
    if ko: Ls[k]['ko']=ko
    if note: Ls[k]['note']=note
    if icon: Ls[k]['icon']=icon
  if why: S[i]['order']['why']=why
for (i,j),(v,r) in W.items(): S[i]['sentences'][j]['why']=v
for (i,j),(v,r) in G.items(): assert len(v)<=10; S[i]['sentences'][j]['tag']=v
BF={'tag','icon','why','decoy','distractorsKo','blank'}
assert d['words']==d0['words']
for s,s0 in zip(S,d0['situations']):
  assert {k:v for k,v in s.items() if k not in('order','sentences')}=={k:v for k,v in s0.items() if k not in('order','sentences')}
  for x,x0 in zip(s['sentences'],s0['sentences']):
    for k in set(x)|set(x0):
      if k not in BF: assert x.get(k)==x0.get(k),k
yaml.safe_dump(d,open(OUT,'w'),allow_unicode=True,sort_keys=False)
cnt=collections.Counter(c for v,w,c,sh in P.values())
print('DK counts S/T/F',dict(cnt),'cells',len(P),'sentences',len({(i,j) for i,j,k in P}))
print('blank',dict(collections.Counter(c for *_,c in B.values())),'decoy',dict(collections.Counter(c for *_,c in C.values())),'order',dict(collections.Counter(c for *_,c in O.values())))
# 사실문 둘(전→후)
NEW={k:ORIG[k] for k in ORIG}
for (i,j,k),(v,w,c,sh) in P.items():
  s=list(NEW[(i,j)]); s[k]=sh; NEW[(i,j)]=''.join(s)
ffb=[f'{i}.{j}' for (i,j),v in sorted(ORIG.items()) if v=='ff']; ffa=[f'{i}.{j}' for (i,j),v in sorted(NEW.items()) if v=='ff']
print('ff before',len(ffb),'after',len(ffa),ffa)
print('cell shapes before',dict(collections.Counter(''.join(ORIG.values()))),'after',dict(collections.Counter(''.join(NEW.values()))))
json.dump({'P':{f'{i}.{j}.{k}':[old[(i,j,k)],v,w,c,sh] for (i,j,k),(v,w,c,sh) in P.items()},
           'B':{f'{i}.{j}':[[o['en'] for o in oldB[(i,j)]['options']],oldB[(i,j)]['answer'],a,o,r,c] for (i,j),(a,o,r,c) in B.items()},
           'C':{f'{i}.{j}':[oldC[(i,j)],v,r,c] for (i,j),(v,r,c) in C.items()},
           'ORIG':{f'{i}.{j}':v for (i,j),v in ORIG.items()},'NEW':{f'{i}.{j}':v for (i,j),v in NEW.items()}},
          open('_reviewB_or-minimally-invasive_proposal.json','w'),ensure_ascii=False,indent=0)
