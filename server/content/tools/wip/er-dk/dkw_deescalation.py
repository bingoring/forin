from dklib import fixwords,fixblank
fixwords('deescalation',{
('w-line','distractorsKo'):['명단','칸(구획)'],
('w-got','distractorsKo'):['없다(잃다)','주다(건네다)'],
('w-second','distractorsKo'):['한 시간(꽤 오래)','하루(아주 길게)'],
('w-get','distractorsKo'):['내려놓다·~해 두다','버리다·~해 버리다'],
('w-hurt','distractorsKo'):['가렵다·간지럽다','붓다·부어오르다'],
('w-way','distractorsKo'):['끝(마지막)','이유'],
('w-while','distractorsKo'):['끝까지 · ~하는 내내','전부 · 모든 시간 동안'],
('w-work','distractorsKo'):['실패하다·효과를 잃다','쉬다·휴식을 취하다'],
('w-charge','distractorsKo'):['차례(순서 정하기)','휴식(잠깐 쉼)'],
('w-exactly','distractorsEn'):['extremely','eventually'],
('w-temperature','distractorsEn'):['temperance','temperament'],
('w-eye','distractorsEn'):['ear','eyelid'],
})
fixblank('deescalation',{
'0.1':['long-standing','life-changing','long-lasting'],
'2.1':['embarrassing','overwhelming','frightening'],
'3.0':['organize','recommend','purchase'],
'9.0':['impatiently','aggressively','dishonestly'],
'10.2':['overwhelmed','embarrassed','disappointed'],
'11.0':['next','last','whole'],
})
