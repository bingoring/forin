# B 검토 제안 decoy — V18 모양 확인 + 들어갈 자리에 넣어 출력 (대상 파일 수정 안 함)
import yaml
D={ # id: (새 decoy, 대신할 청크 번호)
'0.1':("how hungry",1),'0.2':("more hungry",2),'0.3':("against his lab results",2),'0.5':("when you forget",1),
'1.1':("the fever",2),'1.2':("if you're sleeping",2),'1.3':("your blood can flow",3),'1.4':("because the kidney cells",2),'1.5':("these meals",1),
'2.1':("hard stools",2),'2.2':("of clearing the bleeding",2),'2.3':("by pulling sugar",1),'2.5':("get too cold",1),
'3.0':("Your kidney makes",0),'3.1':("for any freckles",1),'3.3':("more wrinkles",1),'3.4':("an electric razor",1),'3.5':("your shoes",1),
'4.0':("Let's warm",0),'4.1':("her visitors",1),'4.2':("in the fridge",3),'4.3':("to the blue",2),'4.4':("her breathing",1),'4.5':("for the chaplain",1),
'5.0':("can cause",1),'5.1':("a dental tap",2),'5.2':("the cafeteria",1),'5.3':("to 98.6",1),'5.4':("times three",2),'5.5':("a dental X-ray",1),
'6.0':("or allergies",1),'6.1':("for the doctor",1),'6.2':("and other tests",1),'6.3':("of bleeding",1),'6.4':(", or a cold drink",2),'6.5':(", his skin usually clears",2),
'7.0':("with fluids",1),'7.1':("and hold the tray",1),'7.2':("the menu",1),'7.3':("ice",2),'7.4':("at the wrist",1),'7.5':("Sodium is",0),
'8.0':("his hairline",1),'8.1':("in noise",3),'8.2':("the chaplain",1),'8.3':("compared to his ear",3),'8.4':("and avoid tight wrist lines",3),'8.5':("a family matter",3),
'9.0':("his hair growth",1),'9.1':("and new glasses",2),'9.2':("the cashier",1),'9.3':("His lungs",0),'9.4':("if the labs",2),'9.5':("the walking challenge",1),
'10.0':("with the family",3),'10.1':("helps lower",1),'10.2':("with the billing",1),'10.3':("he'll get a bill",2),'10.5':("your calls",1),
'11.0':("per his wish",3),'11.1':("the diet",1),'11.2':("the kidneys",1),'11.3':("His ammonia level",0),'11.4':("his diet",1),'11.5':("his kidney does",3),
'12.0':("and room care",3),'12.1':("his meals",1),'12.2':("We'll start vitamins",0),'12.3':("and nails",1),'12.4':("Let's change his gown",0),'12.5':("to start rounds",3),
'13.0':("your bones",3),'13.1':("your weight",2),'13.2':("A pharmacist",0),'13.3':("your bones",2),'13.4':("your sodium",1),'13.5':("with your family",2),
'14.0':("need cold storage",2),'14.1':("on the teeth",3),'14.2':("any vitamins",1),'14.3':("these foods",1),'14.4':("his shoes",3),'14.5':("meals",1),
'15.0':("and wash",2),'15.1':("for the family",2),'15.2':("his diet",1),'15.3':("brighter",1),'15.4':("a hearing test",3),'15.5':("his lights steady",1),
'16.0':(", and saline now",2),'16.1':("and keep him calm",2),'16.2':("with the menu",2),'16.3':("from the nose",1),'16.4':("another culture",1),'16.5':("the coffee",1),
'17.0':("the dressing tray",1),'17.2':("Music is",0),'17.3':("His appetite",0),'17.4':("the pediatric airway cart",1),'17.5':("chest pressure",1),
'18.0':("his diet",1),'18.1':("to the family",1),'18.2':("and a new bed",2),'18.3':(", and skin are",2),'18.4':("for more chairs",3),'18.5':("every family",1),
'19.0':("for immediate discharge",2),'19.1':("a full refund",1),'19.2':("and his family",1),'19.3':("as status 2A",1),'19.4':("the cleaning team",1),'19.5':("the pump closely",1),
'20.0':("a cheap option",2),'20.1':("to keep him awake",3),'20.2':("most to us",3),'20.3':("good news",1),'20.4':("on his diet",1),'20.5':("as little",2),
}
d=yaml.safe_load(open('icu-liver-failure.yaml'));S=d['situations']
for k,(dc,slot) in D.items():
  i,j=map(int,k.split('.')); t=S[i]['sentences'][j]; ch=t['chunks']
  err=[]
  if dc.lower() in t['en'].lower(): err.append('en 안에 있음')
  if dc in ch: err.append('청크와 같음')
  if slot>=len(ch) or ch[slot] in '.?!': err.append('자리 없음')
  asm=' '.join(ch[:slot]+[dc]+ch[slot+1:]).replace(' .','.').replace(' ,',',').replace(' ?','?')
  print(k,'|',t['decoy'],'->',dc,'|',asm,'|',' '.join(err))
print(len(D))
