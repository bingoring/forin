# (상황 번호, 문장 번호): {열 번호: 새 값}  열: 0 tag,1 icon,2 why,3 decoy,4 ko1,5 ko2,6 ans,7 w1,8 w2,9 w3
def W(*w): return dict(zip((7,8,9), w))
P = {}
def put(k, kw=None, **_):
    P.setdefault(k, {}).update(kw or {})
def blank(si,i,w1,w2,w3): put((si,i)); P[(si,i)].update(W(w1,w2,w3))
# blank wrongs
B = {
(0,0):('monitor','chart','stand'),(0,2):('size','brand','owner'),(0,3):('spare','clean','extra'),
(0,4):('drape','curtain','sheet'),(0,5):('fill','lift','tip'),(1,1):('alone','slowly','loudly'),
(1,3):('quickly','softly','slowly'),(1,4):('change','erase','mail'),(1,5):('separately','twice','later'),
(2,3):('gently','fully','partly'),(3,1):('copy','carry','mail'),(3,2):('weight','temperature','shape'),
(4,4):('tape','clamp','paper'),(5,1):('procedure','equipment','paperwork'),(5,4):('cut','leave','begin'),
(5,5):('dates','prices','names'),(6,0):('date','size','number'),(6,4):('lift','copy','turn'),
(6,5):('print','stamp','trace'),(7,2):('slide','ticket','memo'),(7,4):('quickly','safely','calmly'),
(8,1):('handle','base','neck'),(8,3):('tray','cup','bottle'),(8,5):('stain','report','dressing'),
(9,0):('count','sort','pack'),(9,2):('last','final','other'),(9,5):('new','extra','spare'),
(10,1):('absorbable','permanent','temporary'),(10,4):('ask','read','study'),(10,5):('neatly','loosely','lightly'),
(11,1):('containers','instruments','dressings'),(11,3):('measure','photograph','scan'),(11,4):('weight','shape','texture'),
(12,2):('price','budget','roster'),(12,3):('pack','open','tilt'),(13,3):('leak','tip','spill'),
(13,5):('upright','loose','sideways'),(14,0):('invoice','receipt','brochure'),(14,1):('date','name','type'),
(14,2):('signature','appointment','shipment'),(14,4):('side','number','type'),(14,5):('count','post','file'),
(15,2):('measure','photograph','sketch'),(16,4):('weigh','number','wrap'),(16,5):('haphazardly','frantically','recklessly'),
(18,1):('sort','mark','wrap'),(19,2):('order','budget','route'),(20,2):('again','early','quietly'),
(20,3):('stain','print','tear'),(20,4):('separately','twice','daily'),(20,5):('quickly','late','partly'),
}
for k,v in B.items(): blank(*k,*v)
# decoys
put((3,3),{3:'the date'}); put((5,4),{3:'the dressing'}); put((16,2),{3:'the count'})
# tags
put((14,4),{0:'부위 재확인'})
# distractors
D = {
(3,0):("지금 검체 두 개를 정리할게요.","지금 검체 두 개를 세어 볼게요."),
(7,0):("이 냉동절편은 지금 바로 라벨해야 해요.","이 냉동절편은 지금 바로 등록해야 해요."),
(9,0):("검체를 하나씩 순서대로 정렬해요.","검체를 하나씩 순서대로 꺼내요."),
(9,2):("다음 것이 나오기 전에 각각 옮길게요.","다음 것이 나오기 전에 각각 세어 볼게요."),
(15,5):("환자를 확인하는 대로 보관할게요.","환자를 확인하는 대로 정리할게요."),
(18,4):("새 키트로 신선한 검체를 다시 분류해요.","새 키트로 신선한 검체를 다시 접수해요."),
(19,2):("신원을 다시 확인하고 지금 다시 보관해요.","신원을 다시 확인하고 지금 다시 정리해요."),
(4,3):("이 냉동절편을 빨리 쟁반에 담아요.","이 냉동절편을 빨리 카트에 실어요."),
(6,3):("이 라벨이 환자 차트와 일치하지 않아요.","이 라벨이 검체 병과 일치하지 않아요."),
(14,0):("요청서가 검체 상자와 일치하나요?","요청서가 검체 크기와 일치하나요?"),
(14,3):("이 요청서가 환자 차트와 일치하지 않아요.","이 요청서가 검체 가방과 일치하지 않아요."),
(15,2):("지금 집도의와 함께 사진을 찍어요.","지금 집도의와 함께 뚜껑을 닫아요."),
(14,2):("보내기 전에 불일치를 표시할게요.","보내기 전에 불일치를 모아 볼게요."),
(8,5):("배양 검체를 바로 미생물검사실용 용기에 담을게요.","배양 검체를 바로 미생물검사실 일지에 적을게요."),
(12,2):("검사실에 지침을 보낼게요.","검사실에 지침을 건넬게요."),
(11,2):("서식에 크기와 무게를 기록할게요.","서식에 크기와 모양을 기록할게요."),
(11,1):("총 세 조각인지 물어봐요.","총 세 조각인지 적어 봐요."),
(12,0):("이 검체는 특수 포장이 필요해요.","이 검체는 특수 서식이 필요해요."),
(6,5):("이름을 정정하고 다시 붙일게요.","이름을 정정하고 다시 닫을게요."),
(7,1):("곧바로 병리과로 서류 가져다주세요.","곧바로 병리과로 상자 가져다주세요."),
(13,3):("이걸 쏟아지지 않을 용기를 골라요.","이걸 뒤집히지 않을 용기를 골라요."),
(16,1):("수술 시야와 용기들을 수색하려고 조명을 켜요.","수술 시야와 용기들을 수색하기 전에 장갑을 껴요."),
(16,3):("용기를 전부 수색하기 전에 불을 켜요.","수술 시야의 용기를 전부 세어야 해요."),
(17,5):("지금 더 넓은 절제를 위해 기록할게요.","지금 더 넓은 절제를 위해 정리할게요."),
(20,2):("제가 직접 가져가기 전에 차트를 챙길게요.","제가 직접 가져가려고 카트를 밀어요."),
}
for k,(a,b) in D.items(): put(k, {4:a,5:b})

put((10,1),{5:"방향 봉합사는 그대로 번호 매겨요."})
put((5,5),{4:"요청서에 절제연 세부 사항을 그릴게요.",5:"요청서에 절제연 세부 사항을 붙일게요."})
put((6,4),{4:"보내기 전에 라벨을 접어요.",5:"보내기 전에 라벨을 세어요."})
put((14,5),{4:"지금 바로 이 불일치를 기록할게요.",5:"지금 바로 이 불일치를 복사할게요."})
