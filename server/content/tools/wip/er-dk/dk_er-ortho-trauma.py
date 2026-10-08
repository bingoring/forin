import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from dk_lib_5 import run
P = os.path.join(os.path.dirname(os.path.abspath(__file__)), "base-er-ortho-trauma.yaml")
S = {
# 사지 손상 초기 사정
"I'm going to look at and gently check your arm.": ["다리를 살펴보고 부드럽게 확인해 볼게요.", "어깨를 살펴보고 부드럽게 확인해 볼게요."],
"Is there any open cut or just swelling and bruising?": ["벌어진 상처가 있나요, 아니면 붓고 열만 난 건가요?", "아문 상처가 있나요, 아니면 붓고 멍만 든 건가요?"],
"Tell me where it's most tender when I touch.": ["제가 만졌을 때 가장 가려운 곳을 말씀해 주세요.", "제가 만졌을 때 가장 뻣뻣한 곳을 말씀해 주세요."],
"Can you show me exactly where it hurts the most?": ["가장 부은 곳을 정확히 짚어 주시겠어요?", "가장 저린 곳을 정확히 짚어 주시겠어요?"],
"Your arm looks a little deformed compared to the other side.": ["반대쪽과 비교하면 팔이 조금 깨끗해 보여요.", "반대쪽과 비교하면 팔이 조금 차가워 보여요."],
# 신경혈관(5P) 확인
"Can you feel me touching your fingers?": ["손가락을 만지는 게 보이세요?", "손가락을 만지는 게 들리세요?"],
"Wiggle your fingers and toes for me if you can.": ["가능하면 손가락과 발가락을 톡톡 쳐 보세요.", "가능하면 손가락과 발가락을 접어 보세요."],
"I'm checking the pulse below your injury.": ["손상 부위 아래쪽 체온을 확인하고 있어요.", "손상 부위 아래쪽 크기를 확인하고 있어요."],
"Tell me if your skin color looks different from the other side.": ["피부결이 반대쪽과 다르게 보이면 말씀해 주세요.", "피부 냄새가 반대쪽과 다르게 느껴지면 말씀해 주세요."],
"Squeeze my fingers as hard as you can with both hands.": ["양손으로 제 손가락을 최대한 세게 밀어 보세요.", "양손으로 제 손가락을 최대한 세게 당겨 보세요."],
# 부목 고정 설명
"The splint keeps the bone still so it can heal.": ["부목이 뼈를 가만히 잡아 주어야 씻을 수 있어요.", "부목이 뼈를 가만히 잡아 주어야 쉬실 수 있어요."],
"Please don't move or put weight on this leg.": ["이 다리는 씻거나 체중을 싣지 마세요.", "이 다리는 문지르거나 체중을 싣지 마세요."],
"Tell me if the splint feels too tight or numb.": ["부목이 너무 무겁거나 저리면 말씀해 주세요.", "부목이 너무 뜨겁거나 저리면 말씀해 주세요."],
"We'll check your toes for color and warmth every hour.": ["한 시간마다 발가락 색과 냄새를 확인할게요.", "한 시간마다 손가락 색과 온기를 확인할게요."],
"Keep this leg raised and try not to put weight on it at home.": ["집에서도 이 다리를 감싸고 체중을 싣지 않도록 하세요.", "집에서도 이 다리를 닦고 체중을 싣지 않도록 하세요."],
# 통증 척도·기전 청취
"How did the injury happen exactly?": ["정확히 언제 다치신 건가요?", "정확히 어디서 다치신 건가요?"],
"On a scale of zero to ten, how bad is the pain?": ["0에서 10까지 중에 통증이 얼마나 오래되셨어요?", "0에서 10까지 중에 가려움이 얼마나 심하세요?"],
"Is the pain sharp, throbbing, or dull?": ["통증이 날카로운가요, 욱신거리나요, 아니면 시린가요?", "통증이 날카로운가요, 가려운가요, 아니면 둔한가요?"],
"Did you fall, or did something heavy land on it?": ["넘어지셨나요, 아니면 날카로운 것이 떨어졌나요?", "넘어지셨나요, 아니면 작은 것이 떨어졌나요?"],
"Tell me exactly how high you fell from.": ["정확히 얼마나 높은 곳에서 뛰어내렸는지 말씀해 주세요.", "정확히 얼마나 높은 곳에 올라가셨는지 말씀해 주세요."],
# RICE·거상 교육
"Keep the ankle raised above your heart when resting.": ["쉴 때는 손목을 심장보다 높게 들어올려 두세요.", "쉴 때는 무릎을 심장보다 높게 들어올려 두세요."],
"Use ice for twenty minutes at a time, a few times a day.": ["한 번에 20분씩 일주일에 몇 번 얼음찜질을 하세요.", "한 번에 20분씩 하루에 몇 번 얼음을 사 두세요."],
"Come back if the swelling or pain gets much worse.": ["붓기나 가려움이 훨씬 심해지면 다시 오세요.", "붓기나 멍이 훨씬 심해지면 다시 오세요."],
"Wrap it with a bandage, but not too tight.": ["수건으로 감싸시되 너무 조이지는 마세요.", "얼음으로 감싸시되 너무 조이지는 마세요."],
"Try to stay off your foot and rest it as much as you can.": ["발을 딛지 말고 최대한 자주 확인해 주세요.", "발을 딛지 말고 최대한 깨끗하게 해 주세요."],
# 개방골절 감염 예방
"We'll cover the wound with a sterile dressing right away.": ["바로 멸균 드레싱으로 상처를 기록할게요.", "바로 멸균 드레싱으로 상처를 설명할게요."],
"You'll get antibiotics to prevent infection.": ["통증을 예방하기 위해 항생제를 맞으실 거예요.", "감염을 예방하기 위해 진통제를 맞으실 거예요."],
"When was your last tetanus shot?": ["마지막 독감 주사는 언제 맞으셨나요?", "마지막 파상풍 검사는 언제 받으셨나요?"],
"We can see the bone, so we need to clean the wound well.": ["피가 보여서 상처를 잘 세척해야 해요.", "뼈가 보여서 상처를 잘 측정해야 해요."],
"The doctor will look at the bone before we close the skin.": ["피부를 닫기 전에 간호사 선생님이 뼈를 살펴보실 거예요.", "피부를 닫기 전에 의사 선생님이 혈관을 살펴보실 거예요."],
# 원위부 맥박 소실 골절
"I can't feel a pulse in your foot, so we must act quickly.": ["손에서 맥박이 안 느껴져서 빨리 움직여야 해요.", "발에서 열이 안 느껴져서 빨리 움직여야 해요."],
"The bone may be pressing on a blood vessel.": ["뼈가 신경을 누르고 있을 수 있어요.", "근육이 혈관을 누르고 있을 수 있어요."],
"We're going to realign it to restore blood flow.": ["통증을 줄이기 위해 뼈를 재정렬할 거예요.", "혈류를 되살리기 위해 뼈 사진을 다시 찍을 거예요."],
"Your foot feels cold, and the color looks pale.": ["발이 뜨겁고 색깔도 창백해 보여요.", "발이 차갑고 색깔도 붉어 보여요."],
"We'll numb the area and move quickly to fix the bone.": ["부위를 소독하고 빨리 뼈를 맞출게요.", "부위를 마취하고 빨리 뼈를 촬영할게요."],
# 관절 탈구 정복 준비
"We'll give you medicine to relax before putting it back.": ["제자리로 넣기 전에 열을 내려드릴 약을 드릴게요.", "제자리로 넣기 전에 긴장을 풀어드릴 음악을 틀어드릴게요."],
"After we reset it, I'll recheck your pulse and feeling.": ["다시 맞춘 뒤에 체중과 감각을 다시 확인할게요.", "다시 맞춘 뒤에 맥박과 키를 다시 확인할게요."],
"Try to stay relaxed — tensing makes it harder.": ["힘을 주면 더 힘드니 눈을 감아 보세요.", "힘을 주면 더 힘드니 기다려 보세요."],
"Your shoulder should slide back into place in a moment.": ["곧 어깨가 제자리로 굴러 들어갈 거예요.", "곧 어깨가 제자리로 튀어 들어갈 거예요."],
"Once you're sleepy, you won't remember the reset.": ["졸리게 되면 다시 맞추는 것을 설명하지 못하실 거예요.", "졸리게 되면 다시 맞추는 것을 즐기지 못하실 거예요."],
# 고관절 골절 고령
"We'll manage your pain while you wait for surgery.": ["수술을 기다리는 동안 일정을 관리해 드릴게요.", "수술을 기다리는 동안 통증을 기록해 드릴게요."],
"Do you know where you are and what day it is?": ["여기가 어디인지, 오늘이 몇 월인지 아세요?", "여기가 어디인지, 지금이 몇 시인지 아세요?"],
"We'll keep you oriented and comfortable tonight.": ["오늘 밤은 깨어 있게 하고 편안하게 해드릴게요.", "오늘 밤은 수분을 유지하고 편안하게 해드릴게요."],
"Your hip is broken, so we can't let you stand on it.": ["고관절이 부러져서 그 다리로 무릎 꿇게 할 수 없어요.", "고관절이 부러져서 그 다리에 기대게 할 수 없어요."],
"We're keeping you comfortable and checking on you often.": ["따뜻하게 해드리면서 자주 살펴볼게요.", "편안하게 해드리면서 자주 씻겨드릴게요."],
# 손가락 절단 이송
"We're keeping the finger cool and moist to protect it.": ["손가락을 보호하기 위해 시원하고 안전하게 보관하고 있어요.", "손가락을 보호하기 위해 시원하고 조용하게 보관하고 있어요."],
"The specialist may be able to reattach it.": ["전문의가 사진을 찍을 수 있을 거예요.", "전문의가 측정할 수 있을 거예요."],
"We'll control your bleeding while we prepare for the transfer.": ["이송을 준비하는 동안 출혈을 기록할게요.", "이송을 준비하는 동안 통증을 조절할게요."],
"Please don't put the finger directly on ice.": ["손가락을 열에 직접 닿게 하지 마세요.", "손가락을 소독약에 직접 닿게 하지 마세요."],
"We're calling the hand surgeon now to arrange the transfer.": ["이송을 준비하려고 지금 손 외과의를 방문하고 있어요.", "이송을 준비하려고 지금 손 외과의에게 서류를 쓰고 있어요."],
# 항응고제 골절 혈종
"Because you take a blood thinner, the swelling can grow.": ["수면제를 드시고 있어서 붓기가 커질 수 있어요.", "혈액 희석제를 드시고 있어서 열이 오를 수 있어요."],
"Which blood thinner do you take and when was the last dose?": ["어떤 혈액 희석제를 드시고, 마지막 검사는 언제였나요?", "어떤 혈액 희석제를 드시고, 마지막 방문은 언제였나요?"],
"We'll check the limb often for tightness and color.": ["사지를 자주 확인해서 건조함과 색깔을 볼게요.", "사지를 자주 확인해서 조임과 냄새를 볼게요."],
"The bruise is spreading and looks very dark.": ["멍이 퍼지고 있고 색이 아주 붉어 보여요.", "상처가 퍼지고 있고 색이 아주 짙어 보여요."],
"Tell us right away if the pain or swelling gets worse.": ["통증이나 가려움이 심해지면 바로 알려주세요.", "통증이나 어지러움이 심해지면 바로 알려주세요."],
# 소아 성장판 손상
"This injury is near the growth plate, so we watch it closely.": ["이 손상이 성장판 뒤쪽이라 자세히 지켜보고 있어요.", "이 손상이 성장판 아래쪽이라 자세히 지켜보고 있어요."],
"Most heal well, but follow-up is important for growth.": ["대부분 잘 낫지만, 성장을 위해 영양이 중요해요.", "대부분 잘 낫지만, 체중을 위해 추적 관찰이 중요해요."],
"The specialist will check the alignment over time.": ["전문의가 시간을 두고 체중을 확인할 거예요.", "전문의가 시간을 두고 색깔을 확인할 거예요."],
"It's normal to worry, but the plate often heals well.": ["묻고 싶은 게 당연하지만, 성장판은 대개 잘 낫습니다.", "울고 싶은 게 당연하지만, 성장판은 대개 잘 낫습니다."],
"We'll take an x-ray now and another one at the follow-up visit.": ["지금 초음파를 찍고 추적 관찰 때 한 번 더 찍을 거예요.", "지금 MRI를 찍고 추적 관찰 때 한 번 더 찍을 거예요."],
# 병적 골절 의심
"This break happened with very little force, which is unusual.": ["이 골절은 아주 약한 힘에도 생겼는데, 안타까워요.", "이 염증은 아주 약한 힘에도 생겼는데, 이례적이에요."],
"Do you have any history of cancer or bone disease?": ["암이나 피부 질환의 병력이 있으신가요?", "암이나 뼈 질환의 수술이 있으신가요?"],
"Have you had unexplained pain or weight loss recently?": ["최근에 원인 모를 통증이나 수면 부족이 있었나요?", "최근에 원인 모를 통증이나 탈모가 있었나요?"],
"A bone this weak can break without a big fall.": ["이렇게 약한 뼈는 크게 넘어지지 않아도 휘어질 수 있어요.", "이렇게 약한 뼈는 크게 넘어지지 않아도 붓기가 생길 수 있어요."],
"We'll order scans to see why this bone is weak.": ["왜 뼈가 약한지 보기 위해 깁스를 할 거예요.", "왜 뼈가 약한지 보기 위해 목발을 쓸 거예요."],
# 언어장벽 골절
"I'll get an interpreter so we understand each other.": ["서로 이해할 수 있도록 보조원을 부를게요.", "서로 이해할 수 있도록 구급대원을 부를게요."],
"Are you allergic to any medicines?": ["혹시 부작용이 있었던 약이 있나요?", "혹시 알레르기 때문에 드시는 약이 있나요?"],
"Point to where it hurts and show me how bad.": ["아픈 곳을 바라보고 얼마나 아픈지 보여주세요.", "아픈 곳을 가리키고 얼마나 아픈지 적어 주세요."],
"Nod if you understand what I'm asking.": ["제가 묻는 것을 이해하시면 손을 흔들어 주세요.", "제가 묻는 것을 이해하시면 눈을 깜빡여 주세요."],
"The interpreter will help us check your pain and history.": ["운전기사가 통증과 병력을 확인하는 걸 도와줄 거예요.", "접수 직원이 통증과 병력을 확인하는 걸 도와줄 거예요."],
# 석고붕대 후 교육
"Keep the cast dry and elevated to reduce swelling.": ["가려움을 줄이려면 깁스가 젖지 않게 하고 높이 두세요.", "붓기를 줄이려면 깁스가 젖지 않게 하고 덮어 두세요."],
"Come back if your fingers turn pale, numb, or very painful.": ["손가락이 창백해지거나 저리거나 많이 아프면 사진을 찍어 두세요.", "손가락이 창백해지거나 저리거나 많이 아프면 날짜를 적어 두세요."],
"Never push anything inside the cast to scratch.": ["긁으려고 깁스 안에 아무것도 붓지 마세요.", "긁으려고 깁스 안에 아무것도 뿌리지 마세요."],
"Keep the cast covered and dry when you shower.": ["샤워할 때는 깁스를 덮어서 높게 유지하세요.", "샤워할 때는 붕대를 덮어서 마르게 유지하세요."],
"You can move your fingers gently to keep them from getting stiff.": ["차가워지지 않도록 손가락을 부드럽게 움직여 주세요.", "더러워지지 않도록 손가락을 부드럽게 움직여 주세요."],
# 구획증후군 급속진행
"Pain out of proportion is a serious warning sign.": ["손상에 비해 심한 가려움은 심각한 경고 징후예요.", "손상에 비해 심한 부기는 심각한 경고 징후예요."],
"Does it hurt more when I stretch your fingers or toes?": ["제가 손가락이나 발가락을 쭉 접으면 더 아프세요?", "제가 손가락이나 발가락을 꾹 누르면 더 아프세요?"],
"We need surgery soon to relieve the pressure.": ["압박을 재기 위해 곧 수술이 필요해요.", "압박을 풀기 위해 곧 사진이 필요해요."],
"This pain is much worse than we'd expect from the injury.": ["이 손상치고는 붓기가 예상보다 훨씬 심해요.", "이 손상치고는 통증이 예상보다 훨씬 오래돼요."],
"The muscle feels very tight and hard to the touch.": ["만져보면 근육이 아주 가늘고 딱딱해요.", "만져보면 피부가 아주 팽팽하고 딱딱해요."],
# 골반골절 혈역학 불안정
"We're placing a binder to stabilize your pelvis and slow bleeding.": ["골반을 확인하고 출혈을 늦추기 위해 바인더를 적용할게요.", "골반을 고정하고 출혈을 늦추기 위해 바인더를 설명해 드릴게요."],
"You may be bleeding internally, so we're giving you blood.": ["외부 출혈이 있을 수 있어서 수혈을 해드리고 있어요.", "내부 감염이 있을 수 있어서 수혈을 해드리고 있어요."],
"Try to stay still while we stabilize you.": ["이동하는 동안 최대한 가만히 계셔 주세요.", "촬영하는 동안 최대한 가만히 계셔 주세요."],
"Your blood pressure is dropping, so we're moving quickly.": ["체온이 떨어지고 있어서 빠르게 움직이고 있어요.", "혈압이 떨어지고 있어서 조용히 움직이고 있어요."],
"We're giving you fluids and blood to keep your pressure up.": ["혈압을 유지하기 위해 수액과 혈액 이름표를 확인하고 있어요.", "혈압을 유지하기 위해 수액과 혈액 기록을 확인하고 있어요."],
# 대퇴골 골절 지방색전
"New shortness of breath after this fracture concerns us.": ["골절 후 새로 생긴 두통이 걱정돼요.", "골절 후 새로 생긴 어지러움이 걱정돼요."],
"I'm checking your oxygen and looking for a rash.": ["체온을 확인하고 발진이 있는지 보고 있어요.", "산소 수치를 확인하고 부기가 있는지 보고 있어요."],
"We're giving you oxygen and monitoring you closely.": ["수액을 드리고 자세히 관찰하고 있어요.", "산소를 드리고 자세히 설명하고 있어요."],
"Tell me if you feel confused or more short of breath.": ["어지럽거나 숨이 더 차면 말씀해 주세요.", "혼란스럽거나 기침이 더 나면 말씀해 주세요."],
"We're watching your oxygen closely after this kind of break.": ["이런 골절 후에는 산소 수치를 자세히 기록해요.", "이런 수술 후에는 산소 수치를 자세히 지켜봐요."],
# 다발 장골골절 출혈성 쇼크
"Broken long bones can hide a lot of blood loss.": ["작은 뼈가 부러지면 많은 출혈이 겉으로 안 보일 수 있어요.", "긴 뼈가 부러지면 많은 통증이 겉으로 안 보일 수 있어요."],
"Your pressure is low, so we're starting a transfusion.": ["혈압이 낮아서 촬영을 시작하고 있어요.", "혈압이 낮아서 조직검사를 시작하고 있어요."],
"We'll splint your legs and keep you warm.": ["다리를 부목으로 고정하고 조용하게 유지할게요.", "다리를 부목으로 고정하고 깨끗하게 유지할게요."],
"Both your legs are broken, so we're moving carefully.": ["양쪽 팔이 다 부러져서 조심스럽게 움직이고 있어요.", "양쪽 다리가 다 부러져서 조심스럽게 설명하고 있어요."],
"We're giving you blood quickly because you're losing a lot.": ["피를 많이 잃고 계셔서 빠르게 설명하고 있어요.", "땀을 많이 잃고 계셔서 빠르게 수혈하고 있어요."],
# 개방골절 SBAR 인계
"This is an open tibia fracture with a five-centimeter wound.": ["5센티미터 상처를 동반한 오래된 경골 골절입니다.", "5센티미터 상처를 동반한 감염된 경골 골절입니다."],
"Distal pulse is intact and sensation is normal.": ["원위부 맥박은 정상이고 색깔도 정상입니다.", "원위부 맥박은 정상이고 체온도 정상입니다."],
"Tetanus is updated and antibiotics were given at ten past.": ["파상풍은 확인됐고 항생제는 10분에 투여했습니다.", "파상풍은 갱신됐고 항생제는 10분에 설명했습니다."],
"Wound is clean, dressed, and splinted for transport.": ["상처는 세척, 드레싱했고 이송을 위해 깁스했습니다.", "상처는 세척, 드레싱했고 이송을 위해 촬영했습니다."],
"No other injuries noted, and pain is controlled.": ["다른 손상은 없고 구토는 조절되고 있습니다.", "다른 손상은 없고 출혈은 조절되고 있습니다."],
# 외상성 절단 지혈대 관리
"The tourniquet stops the bleeding and we noted the time.": ["지혈대가 출혈을 멈췄고 위치를 기록했어요.", "지혈대가 출혈을 줄였고 시각을 기록했어요."],
"We won't loosen it until it's safe to do so.": ["안전해질 때까지는 덮지 않을 거예요.", "안전해질 때까지는 만지지 않을 거예요."],
"Tell me if the pain or numbness changes.": ["통증이나 피로가 달라지면 말씀해 주세요.", "통증이나 가려움이 달라지면 말씀해 주세요."],
"We wrote down the exact time we put the tourniquet on.": ["지혈대를 채운 정확한 위치를 적어 두었어요.", "지혈대를 채운 정확한 시각을 사진으로 남겼어요."],
"Once it's safe, we'll slowly release the tourniquet and watch your leg.": ["안전해지면 천천히 지혈대를 풀면서 팔을 지켜볼게요.", "안전해지면 천천히 지혈대를 풀면서 설명해 드릴게요."],
}
W = {
 "w-wiggle": {"distractorsKo": ["구부리다", "쭉 펴다"]},
 "w-fix": {"distractorsKo": ["부러뜨리다", "(뼈를) 빼내다"]},
 "w-orient": {"distractorsKo": ["혼돈된", "졸음이 오는"]},
 "w-comfortable": {"distractorsEn": ["compatible", "controllable"]},
 "w-break": {"distractorsKo": ["(발목을) 삐다", "(뼈가) 빠지다"]},
 "w-transfer": {"distractorsKo": ["퇴원(병원에서 나감)", "입원(병원에 들어감)"]},
 "w-thinner": {"distractorsKo": ["혈압약(혈압을 낮춤)", "진통제(통증을 줄임)"]},
 "w-allergic": {"distractorsKo": ["내성이 있는", "중독 증상이 있는"]},
 "w-elevate": {"distractorsKo": ["(심장보다) 낮게 두다", "(심장보다) 꽉 조이다"]},
 "w-proportion": {"distractorsKo": ["(손상과) 비슷한", "(손상에) 점점 줄어드는"]},
 "w-stretch": {"distractorsKo": ["(깊이) 구부리다", "(꾹) 누르다·밀다"]},
 "w-pressure": {"distractorsKo": ["맥박(심장 박동)", "체온(몸의 온도)"]},
 "w-drop": {"distractorsKo": ["(혈압이) 오르다", "(혈압이) 버티다"]},
 "w-shortness": {"distractorsKo": ["흉통(가슴 통증)", "기침(마른기침)"]},
 "w-sensation": {"distractorsEn": ["sensibility", "circulation"]},
}
B = {
 "I'll get an interpreter so we understand each other.": ["pharmacist", "receptionist", "technician"],
}
run(P, S, W, B)
