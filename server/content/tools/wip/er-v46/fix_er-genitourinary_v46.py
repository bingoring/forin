#!/usr/bin/env python3
"""er-genitourinary v46 검토 목록(fix-er-genitourinary-v46.md) 반영 — 대상 yaml을 제자리에서 고친다."""
import copy, yaml
D = '/Users/ywyeom/private/forin/server/content/tools/wip/er-v46/'
P = D + 'er-genitourinary.yaml'
d = yaml.safe_load(open(P, encoding='utf-8'))
base = yaml.safe_load(open(D + 'base-er-genitourinary.yaml', encoding='utf-8'))

def S(si, i): return d['situations'][si - 1]['sentences'][i - 1]

def blank(si, i, answer, others):
    s = S(si, i)
    pos = (si * 7 + i * 3) % 4
    ops = list(others); ops.insert(pos, answer)
    assert len(ops) == 4 and len(set(ops)) == 4
    s['blank'] = {'answer': answer, 'options': [{'en': o} for o in ops]}

def setf(si, i, **kw):
    for k, v in kw.items():
        assert k in S(si, i), k
        S(si, i)[k] = v

# ---- 빈칸 B1~B47 ----
blank(11, 6, 'until', ['unless', 'because', 'since'])
blank(12, 2, 'access', ['IV', 'cast', 'splint'])
blank(12, 5, 'arm', ['leg', 'foot', 'neck'])
blank(18, 1, 'oxygen', ['antibiotics', 'insulin', 'antacids'])
blank(20, 5, 'blood', ['urine', 'pus', 'dye'])
blank(12, 6, 'lungs', ['liver', 'bones', 'brain'])
blank(15, 5, 'salt', ['caffeine', 'sleep', 'naps'])
blank(7, 3, 'before', ['after', 'while', 'upon'])
blank(2, 3, 'inside', ['outside', 'label', 'bottom'])
blank(2, 4, 'before', ['after', 'once', 'while'])
blank(4, 6, 'lab', ['pharmacy', 'radiology', 'blood bank'])
blank(6, 3, 'arrange', ['cancel', 'skip', 'delay'])
blank(6, 6, 'comfortable', ['discharged', 'dressed', 'weighed'])
blank(7, 5, 'collected', ['labeled', 'sealed', 'ordered'])
blank(9, 5, 'ultrasound', ['X-ray', 'EKG', 'echo'])
blank(10, 3, 'change', ['flush', 'clamp', 'secure'])
blank(10, 6, 'comfortable', ['uncomfortable', 'painful', 'irritating'])
blank(13, 3, 'strain', ['hold', 'measure', 'flush'])
blank(14, 2, 'during', ['after', 'before', 'outside'])
blank(14, 3, 'wellbeing', ['position', 'size', 'weight'])
blank(14, 5, 'fever', ['weight', 'diet', 'sleep'])
blank(14, 6, 'hydrated', ['warm', 'active', 'seated'])
blank(15, 3, 'urologist', ['cardiologist', 'dermatologist', 'pharmacist'])
blank(15, 6, 'future', ['past', 'old', 'previous'])
blank(16, 5, 'dangerous', ['chronic', 'contagious', 'harmless'])
blank(16, 6, 'specialist', ['pharmacist', 'technician', 'chaplain'])
blank(18, 2, 'dialysis', ['surgery', 'suction', 'therapy'])
blank(18, 5, 'ease', ['raise', 'measure', 'double'])
blank(19, 2, 'time-sensitive', ['routine', 'minor', 'common'])
blank(19, 3, 'while', ['after', 'before', 'unless'])
blank(19, 6, 'urologist', ['pediatrician', 'anesthesiologist', 'radiologist'])
blank(20, 1, 'accident', ['surgery', 'X-ray', 'transfusion'])
blank(20, 6, 'repair', ['remove', 'replace', 'drain'])
blank(21, 2, 'doctor', ['chart', 'family', 'pharmacy'])
blank(21, 3, 'trend', ['intake', 'dose', 'diet'])
blank(21, 5, 'numbers', ['questions', 'forms', 'photos'])
blank(5, 6, 'almost', ['halfway', 'all', 'just'])
blank(5, 4, 'minutes', ['seconds', 'tries', 'hours'])
blank(8, 5, 'after', ['before', 'while', 'when'])
blank(17, 2, 'fast', ['slowly', 'quietly', 'calmly'])
blank(17, 6, 'closely', ['briefly', 'loosely', 'casually'])
blank(13, 5, 'fluids', ['food', 'pills', 'solids'])
blank(3, 1, 'able', ['asked', 'told', 'ready'])
blank(12, 1, 'dialysis', ['chemo', 'therapy', 'counseling'])
blank(19, 1, 'hours', ['minutes', 'days', 'weeks'])
blank(12, 4, 'days', ['hours', 'weeks', 'months'])
blank(14, 1, 'weeks', ['months', 'days', 'years'])
blank(3, 4, 'urinated', ['bled', 'drank', 'slept'])
blank(5, 1, 'pressure', ['itching', 'tingling', 'dizziness'])
blank(5, 3, 'discomfort', ['itching', 'nausea', 'burning'])
# 증상 묶음(권장 일부)
blank(9, 1, 'pain', ['swelling', 'nausea', 'vomiting'])
blank(16, 1, 'fever', ['cough', 'confusion', 'pain'])
blank(11, 2, 'pain', ['fever', 'itching', 'nausea'])
blank(19, 4, 'injury', ['headache', 'rash', 'nausea'])
# 경미·선택 중 한 건(같은 분야 말로)
blank(20, 3, 'trauma', ['dialysis', 'palliative', 'wound care'])

# 빈칸을 옮긴 문장의 why
setf(12, 5, why='that arm으로 앞서 말한 혈관통로 팔을 다시 가리켜요. 혈관통로가 있는 팔로 주사나 채혈을 하면 통로가 막히거나 손상될 수 있어서 반대쪽 팔을 써요.')
setf(12, 6, why='Your heart and lungs로 체액 때문에 부담을 받는 장기를 짚고, need…removed 수동 구조로 빼내야 한다고 말해요. 신장이 소변으로 내보내지 못한 체액은 투석으로 빼야 심장과 폐의 부담이 줄어요.')
setf(20, 5, why='for blood at the tip으로 무엇을 살피는지 짚고, before we place…로 순서를 밝혀요. 골반 외상에서 요도 끝에 피가 보이면 요도 손상일 수 있어서 도뇨관을 넣기 전에 먼저 확인해요.')
setf(15, 6, why='to catch…로 거름망의 목적을 말하고, any future stones로 앞으로 나올 결석을 가리켜요. 나온 결석을 잡아 검사하면 결석의 종류에 맞는 예방 계획을 세울 수 있어요.')
# W1~W5
setf(18, 1, why='to help you breathe로 조치의 목적을 알려요. 몸을 세우면 심장으로 돌아오는 피가 줄고 횡격막이 내려가 숨쉬기가 한결 편해져요.')
setf(2, 1, why='First로 순서의 시작을 알리고, with the wipe we give you로 필요한 물건을 병원이 준다고 말해요. 먼저 닦아야 피부의 균이 검체에 섞이는 것을 줄일 수 있어요.')
setf(6, 5, why='might로 두 양상을 모두 가능하다고 열어 두어, 환자가 자기 통증에 맞는 쪽을 말하기 쉬워요.')
setf(1, 5, why='열이 있으면 감염이 방광을 넘어 번졌을 수 있고, 아랫배 통증은 방광 자체의 염증 단서예요. any를 써서 둘 중 하나라도 있었는지 넓게 물어요.')
setf(18, 3, tag='안심')
setf(17, 4, icon='lab'); setf(20, 1, icon='magnify'); setf(11, 6, icon='pill')

# ---- decoy ----
dec = {
 (2,2):'the first part', (19,2):'the pharmacist', (21,3):'and blood sugar trend', (18,3):'a seat',
 (7,3):'after antibiotics', (9,5):'a routine ultrasound', (17,6):'your blood sugar', (2,3):'the lid',
 (8,5):'like your stomach',
 # 돌려쓴 12개 -> 청크 변형
 (4,1):'when you walk', (6,5):'only at night', (6,6):'for your results', (7,2):'or a rash',
 (8,1):'or trouble sleeping', (8,3):'how much blood', (8,4):'trouble finishing', (8,6):'to measure the pressure',
 (9,1):'did the swelling', (9,2):', or in the back', (10,1):'has the tube', (10,3):'and check for bleeding',
 (10,4):'changed the bag', (10,5):'from the bag', (10,6):"once it's removed", (11,1):', and how much was',
 (11,2):'in your side', (11,5):'your oxygen levels', (11,6):'check your next dose', (12,1):'your first dialysis',
 (12,3):'in your arms', (13,1):'have you eaten', (13,2):'oxygen and medicine', (13,4):'any food down',
 (13,6):'to the pharmacy', (14,1):'weeks postpartum', (14,3):"on the mother's", (14,4):'or a fever',
 (14,5):'your blood pressure', (15,4):', only in hot weather', (16,3):'a routine procedure',
 (16,5):'dangerous slowly', (16,6):'the pressure', (17,2):'slightly high', (17,3):'need routine',
 (17,4):'without help', (17,5):'your kidney function', (18,2):'The extra salt', (18,5):'the strain on your lungs',
 (19,1):'getting worse', (19,3):'a warm blanket', (19,6):'the on-call surgeon', (20,1):'since you arrived',
 (20,2):'of your chest', (20,3):'the dialysis team', (20,4):'tap here', (20,5):'on the sheet',
 (20,6):'in the waiting room', (21,1):'have you drunk', (21,2):'the lab', (21,5):'the on-call nurse',
 (21,6):'and bowel movements',
 # 지연·위험 조립이 되는 decoy
 (16,2):'fluids and oxygen', (17,1):'a chest X-ray', (9,4):'an infection', (7,5):'the stool',
}
for (si, i), v in dec.items():
    setf(si, i, decoy=v)

# ---- distractorsKo ----
def dko(si, i, old, new):
    L = S(si, i)['distractorsKo']
    assert old in L, (si, i, old)
    L[L.index(old)] = new
dko(18,5,'몸을 눕혀서 쉬게 해 드릴게요','소변량을 계속 잴게요')
dko(18,6,'다리를 높이 올려 두세요','체중을 매일 재 보세요')
dko(18,6,'양말을 신으셔도 돼요','투석은 몇 시간 걸려요')
dko(14,3,'산모수첩을 가져오셨나요?','다니시는 산부인과가 어디세요?')
dko(19,5,'조직 검사를 할 거예요','소변은 보실 수 있나요?')
dko(19,6,'외과 의사를 부르고 있어요','혈압을 한 번 재 볼게요')
dko(21,3,'퇴원 서류를 준비할게요','칼륨을 낮추는 약이 나올 수 있어요')
dko(21,3,'차트에 기록만 해 둘게요','활력징후를 다시 잴게요')

# ---- order ----
def O(si): return d['situations'][si - 1]['order']
def line(si, k, en, icon, ko, note):
    O(si)['lines'][k - 1] = {'en': en, 'icon': icon, 'ko': ko, 'note': note}
def owhy(si, t): O(si)['why'] = t

line(1,4,"Thanks. A urine sample will help us find what's causing all that.",'lab','감사해요. 소변 검체로 이 모든 증상의 원인을 찾을 수 있어요','검체')
owhy(1,"먼저 시작 시점을 묻고, 그 뒤 얼마나 자주 가는지를 묻고, 그 빈번한 화장실 방문과 함께 온 열·복통을 확인한 뒤, 그 모든 증상의 원인을 소변 검체로 찾겠다고 마무리해요. 'it began'·'those trips'·'all that'이 앞 줄을 가리켜 순서가 하나예요.")

line(2,2,'First, clean the area with the wipe we give you.','bandage','먼저, 드리는 물티슈로 부위를 닦으세요','닦기')
owhy(2,"단계를 먼저 설명하고, 'First'로 첫 행동인 닦기를 시작하고, 닦은 부위로 소변을 받고, 채운 컵을 밀봉해 제출해요. 'First'가 앞 두 줄을 고정하고 'the area clean'·'just filled'가 앞 줄을 가리켜 순서가 하나예요.")

line(3,3,'Let me press gently on your lower belly to check for that fullness.','pushpin','그 팽만감을 확인하려고 아랫배를 부드럽게 눌러 볼게요','촉진')
line(3,4,"We'll confirm what I felt with a quick bladder scan.",'monitor','제가 만져 본 것을 빠른 방광 스캔으로 확인할게요','스캔')
owhy(3,"마지막 배뇨 시점을 묻고, 그 뒤 아랫배가 차 있는지 묻고, 그 팽만을 확인하려 눌러 보고, 눌러서 느낀 것을 방광 스캔으로 확인한다고 안내해요. 'since then'·'that fullness'·'what I felt'가 앞 줄을 가리켜 순서가 하나예요.")

line(4,3,'At those times, have you passed any clots with it?','magnify','그럴 때 덩어리도 같이 나온 적이 있나요?','혈전')
line(4,4,"Thank you. We'll send your urine to the lab to look at all of that.",'lab','감사해요. 그 모든 걸 보도록 소변을 검사실로 보낼게요','검사')
owhy(4,"붉은 색을 처음 본 때를 묻고, 그 뒤 피가 나오는 양상을 묻고, 그 피와 함께 덩어리가 나왔는지 묻고, 그 모든 것을 보도록 소변을 검사실로 보낸다고 마무리해요. 'Since then'·'those times'·'all of that'이 앞 줄을 가리켜 순서가 하나예요.")

line(5,3,"If that pressure ever feels sharp, tell me and I'll go slowly.",'speech','그 압박감이 혹시 날카롭게 느껴지면 말씀해 주세요, 천천히 할게요','요청')
line(5,4,"That's it — it's in. You did great.",'star','다 됐어요, 들어갔어요. 잘하셨어요','격려')
owhy(5,"넣는다고 알리며 무균을 말하고, 그 관 때문에 느낄 압박감을 예고하고, 혹시 날카롭게 아프면 알리라며 천천히 하겠다고 하고, 다 들어갔다고 격려로 마무리해요. 'it'·'that pressure'·'it's in'이 앞 줄을 가리켜 순서가 하나예요.")

line(6,3,'Wherever it goes, how bad is it right now, one to ten?','chartup','어디로 퍼지든, 지금 얼마나 심한가요, 1부터 10까지로요?','강도')
line(6,4,"We'll give you pain medicine and recheck that number after.",'pill','진통제를 드리고 그 점수를 그 뒤에 다시 확인할게요','계획')
owhy(6,"통증의 양상을 묻고, 그 통증이 내려가는 경로를 묻고, 어디로 가든 지금의 강도를 점수로 묻고, 그 점수를 진통제 뒤에 다시 비교한다고 해요. 'that pain'·'Wherever it goes'·'that number'가 앞 줄을 가리켜 순서가 하나예요.")

line(7,2,'Pain there is common with a kidney infection.','bulb','그 부위의 통증은 신장 감염에서 흔해요','설명')
line(7,3,"To find the germ behind that infection, we'll get a urine culture before antibiotics.",'lab','그 감염의 원인균을 찾으려고 항생제 전에 소변 배양을 할게요','배양')
owhy(7,"등을 두드려 통증을 확인하고, 그 부위의 통증이 신장 감염에서 흔하다고 설명하고, 원인균을 찾으려 항생제 전에 배양을 하고, 검체가 모이는 대로 항생제를 시작해요. 'Pain there'·'that infection'·'it'이 앞 줄을 가리켜 순서가 하나예요.")

line(8,4,"If it shows a full bladder, we'll pass a catheter to drain it.",'gear','방광이 가득 차 있으면 카테터를 넣어 비울게요','도뇨')
owhy(8,"증상을 묻고, 얼마나 오래됐는지 묻고, 그 병력을 바탕으로 방광 스캔을 안내하고, 스캔에서 방광이 차 있으면 도뇨한다고 알려요. 'that'·'that history'·'it shows'가 앞 줄을 가리켜 순서가 하나예요.")

line(9,2,'Is the pain only on one side, or on both sides?','pushpin','통증이 한쪽에만 있나요, 아니면 양쪽 다 있나요?','편측')
line(9,3,'On whichever side hurts, any swelling or redness?','magnify','아픈 쪽이 어디든 붓거나 붉은 곳이 있나요?','외관')
line(9,4,"With all of that, this can be an emergency — we're moving fast.",'siren','그 모든 걸 보면 응급일 수 있어서 빠르게 움직이고 있어요','조치')
owhy(9,"통증이 시작된 때를 묻고, 그 뒤 한쪽인지 양쪽인지 묻고, 아픈 쪽의 붓기와 발적을 확인하고, 그 모든 소견으로 응급일 수 있어 빠르게 움직인다고 알려요. 'On whichever side'·'all of that'이 앞 줄을 가리켜 순서가 하나예요.")

line(10,3,'Either way, has your urine become cloudy or foul-smelling?','magnify','교체했든 아니든, 소변이 뿌옇거나 악취가 났나요?','소변')
line(10,4,"We'll send a sample of it from the catheter port for culture.",'lab','카테터 포트에서 소변 검체를 배양으로 보낼게요','배양')
owhy(10,"카테터를 넣은 기간을 묻고, 그것을 교체한 적을 묻고, 교체 여부와 상관없이 소변이 뿌옇거나 악취가 났는지 묻고, 그 소변의 검체를 포트에서 배양으로 보내요. 'it'·'Either way'·'of it'이 앞 줄을 가리켜 순서가 하나예요.")

line(11,2,'Since that dose, have you had any injury or a catheter?','board','그 복용 이후 부상이나 카테터가 있었나요?','병력')
line(11,3,"Either way, we'll check your blood levels to see how thin your blood is now.",'lab','어느 쪽이든 지금 혈액이 얼마나 묽은지 수치를 확인할게요','검사')
line(11,4,'Until those results are back, we may need to hold your next dose.','pill','그 결과가 나올 때까지 다음 복용을 보류해야 할 수도 있어요','보류')
owhy(11,"약 이름과 마지막 복용을 묻고, 그 복용 이후 외상이나 도뇨관이 있었는지 묻고, 어느 쪽이든 혈액 수치로 얼마나 묽은지 확인하고, 결과가 나올 때까지 다음 복용을 보류할 수 있다고 해요. 'that dose'·'Either way'·'those results'가 앞 줄을 가리켜 순서가 하나예요.")

line(12,1,'First, which arm has your access, so we avoid it for blood pressure?','shield','먼저, 혈관통로가 어느 팔인가요? 혈압 측정은 그 팔을 피할게요','팔 확인')
line(12,2,'How many days has it been since your last treatment?','calendar','마지막 치료 이후 며칠이 지났나요?','일수')
line(12,3,'Over those days, any trouble breathing or swelling in your legs?','stetho','그 며칠 동안 숨이 차거나 다리가 붓지 않았나요?','증상')
line(12,4,'If so, dialysis can remove that extra fluid safely.','hospital','그렇다면 투석으로 여분의 체액을 안전하게 뺄 수 있어요','투석')
owhy(12,"먼저 혈관통로가 있는 팔을 확인해 혈압 측정을 피하고, 마지막 치료 뒤 며칠인지 묻고, 그 며칠 동안 체액이 쌓인 증상을 묻고, 그렇다면 투석으로 안전하게 뺄 수 있다고 알려요. 'First'·'those days'·'If so'가 앞 줄을 가리켜 순서가 하나예요.")

line(13,3,"Either way, we'll give you fluids and medicine to settle your stomach.",'pill','어느 쪽이든 속을 가라앉힐 수액과 약을 드릴게요','치료')
owhy(13,"구토 횟수를 묻고, 그만큼 토한 뒤에도 물을 넘기는지 묻고, 넘기든 아니든 수액과 약을 주겠다고 하고, 그 수액과 함께 소변을 걸러 결석을 잡으라고 해요. 'that much vomiting'·'Either way'·'those fluids'가 앞 줄을 가리켜 순서가 하나예요.")

line(14,2,'That far along, have you had any bleeding or contractions?','stetho','그 정도 주수라면 출혈이나 수축이 있었나요?','증상')
line(14,3,"With that in mind, we'll check on the baby's wellbeing.",'baby','그 점을 염두에 두고 아기가 잘 있는지 확인할게요','태아')
owhy(14,"임신 주수를 묻고, 그 시기에 출혈이나 수축이 있었는지 묻고, 그 점을 염두에 두고 아기도 살피겠다고 하고, 결과가 어떻든 안전한 항생제를 고른다고 마무리해요. 'That far along'·'that in mind'·'Whatever we find'가 앞 줄을 가리켜 순서가 하나예요.")

line(17,2,"It can affect your heart rhythm, so we're getting an ECG now.",'monitor','심장 리듬에 영향을 줄 수 있어서 지금 심전도를 찍고 있어요','심전도')
line(17,3,'While it runs, have you been able to urinate at all today?','calendar','심전도가 도는 동안 오늘 소변을 조금이라도 볼 수 있었나요?','소변량')
line(17,4,"Either way, we'll keep watching your heart monitor closely.",'monitor','어느 쪽이든 심장 모니터를 계속 면밀히 지켜볼게요','관찰')
owhy(17,"칼륨이 위험하게 높을 수 있다고 알리고, 높은 칼륨이 심장 리듬에 줄 영향 때문에 심전도를 바로 찍고, 심전도가 도는 동안 소변을 볼 수 있었는지 묻고, 어느 쪽이든 모니터를 계속 지켜요. 'It'·'While it runs'·'Either way'가 앞 줄을 가리켜 순서가 하나예요.")

line(18,2,"It's from extra fluid, which may need urgent dialysis to remove.",'hospital','여분의 체액 때문이에요, 긴급 투석으로 빼야 할 수도 있어요','투석')
owhy(18,"산소와 자세로 숨쉬기를 돕는다고 알리고, 그 호흡곤란이 여분의 체액 때문이며 투석이 필요할 수 있다고 하고, 그 체액이 빠지면 다리 부종이 나아진다고 하고, 그 모든 일 동안 곁에 있다고 해요. \"It's from\"·'that fluid'·'all of that'이 앞 줄을 가리켜 순서가 하나예요.")

line(19,2,'Every hour of that raises the risk to the tissue.','bulb','그 시간이 한 시간씩 쌓일수록 조직의 위험이 커져요','위험')
line(19,3,"Because of that risk, we're calling the on-call urologist right away.",'bell','그 위험 때문에 지금 바로 당직 비뇨기과 전문의를 부르고 있어요','호출')
owhy(19,"몇 시간째인지 묻고, 그 시간이 길수록 조직 위험이 커진다고 설명하고, 그 위험 때문에 당직 비뇨의학과를 바로 부르고, 전문의가 오는 동안 통증을 줄여 준다고 해요. 'that'·'that risk'·'the urologist'가 앞 줄을 가리켜 순서가 하나예요.")

line(20,2,"Before a tube helps with that, I'll check the tip for blood.",'magnify','그걸 돕는 관 전에 끝부분에 피가 있는지 확인할게요','요도')
line(20,3,'If I see blood, a special X-ray of the urethra comes first.','monitor','피가 보이면 요도 특수 엑스레이를 먼저 해요','요도조영')
line(20,4,'Once the urethra is clear, a bladder X-ray will show any tear.','monitor','요도가 괜찮으면 방광 엑스레이로 찢어진 곳을 확인해요','방광조영')
owhy(20,"사고 후 소변을 봤는지 묻고, 관을 넣기 전에 끝의 피를 살피고, 피가 보이면 요도 특수 엑스레이(역행성 요도조영)를 먼저 하고, 요도가 괜찮으면 방광 엑스레이로 파열을 확인해요. 'that'·'If I see blood'·'Once the urethra is clear'가 앞 줄을 가리켜 순서가 하나예요.")

# ---- context ----
def ctx(si):
    n = [x for x in d['situations'][si - 1]['nuance'] if x['kind'] == 'context'][0]
    b = [x for x in base['situations'][si - 1]['nuance'] if x['kind'] == 'context'][0]
    return n, b
for si, word, ko, revert in [
    (2, 'midstream', '중간뇨', ['scenes', 'why']),
    (9, 'torsion', '염전', ['scenes', 'why']),
    (14, 'fetal heart tones', '태아 심음', ['scenes']),
    (17, 'peaked T waves', '뾰족한 T파', ['scenes', 'why']),
    (19, 'priapism', '지속발기증', ['scenes']),
]:
    n, b = ctx(si)
    n['word'] = word; n['ko'] = ko
    for k in revert: n[k] = copy.deepcopy(b[k])
# C6, C7: fix만 base로
n, b = ctx(15); n['scenes'][2]['fix'] = b['scenes'][2]['fix']
n, b = ctx(20); n['scenes'][2]['fix'] = b['scenes'][2]['fix']

yaml.safe_dump(d, open(P, 'w', encoding='utf-8'), allow_unicode=True, sort_keys=False, width=1000)
print('written')
