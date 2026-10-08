from dklib import fixwords,fixblank
fixwords('chestpain',{
('w-rate','distractorsEn'):['heart rhythm','heart size'],
('w-oxygen','distractorsEn'):['nitrogen','helium'],
('w-stay','distractorsKo'):['(그 자리를) 떠나다','돌아오다'],
('w-lightheaded','distractorsKo'):['눈이 자꾸 감기는','메스꺼운'],
('w-confidential','distractorsKo'):['누구나 볼 수 있는','틀림없이 확실한'],
('w-viral','distractorsEn'):['vital','visual'],
('w-open','distractorsKo'):['(구멍을) 막다','(혈관을) 묶다'],
('w-episode','distractorsKo'):['(증상) 원인 하나','(증상) 반복 주기'],
})
fixblank('chestpain',{
'10.2':['pharmacist','technician','receptionist'],
'12.2':['embarrassing','complicated','disappointing'],
})
