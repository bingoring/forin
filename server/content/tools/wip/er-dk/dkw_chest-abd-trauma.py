from dklib import fixwords,fixblank
fixwords('chest-abd-trauma',{
('w-even','distractorsEn'):['easily','heavily'],
('w-rate','distractorsKo'):['(분당) 리듬','(분당) 체온'],
('w-tape','distractorsKo'):['실과 바늘로 꿰매다','붕대로 감싸 두다'],
('w-mild','distractorsEn'):['mean','wild'],
('w-allergic','distractorsKo'):['내성이 있는','약물에 중독된'],
})
fixblank('chest-abd-trauma',{
'2.3':['embarrassed','impatient','disappointed'],
'11.0':['photograph','measure','organize'],
'12.5':['temperature','appointments','vaccinations'],
'13.0':['interrupt','introduce','encourage'],
})
