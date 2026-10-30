# B 검토 제안값 (or-count) — 사본에 얹어 검사하기 위한 것. 원본은 건드리지 않는다.
DK = {
 '0.1': ["거즈, 기구, 바늘을 함께 꺼내요.", "거즈, 기구, 바늘을 함께 놔요."],
 '0.2': ["시작 전에 기저 계수를 공지해요.", None],
 '1.0': ["소리내어 하나씩 꺼내요.", "소리내어 하나씩 놔요."],
 '1.4': ["다음으로 넘어가기 전에 네 번 확인해요.", None],
 '2.0': [None, "기구를 계수 목록지대로 챙겨요."],
 '2.1': [None, "쟁반 위 포장지는 전부 목록과 일치해야 해요."],
 '3.0': ["사용한 바늘을 전부 판에 꽂아요.", None],
 '3.2': [None, "넘어가기 전에 하나씩 놔요."],
 '5.1': [None, "체강을 닫기 전에 모두 모아요."],
 '5.2': ["봉합 전에 모든 계수가 기록돼야 해요.", "봉합 전에 모든 계수가 보고돼야 해요."],
 '5.4': [None, "이제 모두 펼쳐 놔야 해요."],
 '6.1': ["필드에 들어가기 전에 이걸 세어 볼게요.", None],
 '6.3': ["새 포장을 열 때마다 매번 세어줘요.", "새 포장을 열 때마다 매번 적어줘요."],
 '7.0': ["제가 쉬러 가기 전에 전체 계수를 함께 해요.", "제가 나가기 전에 전체 계수를 함께 해요."],
 '7.1': ["제가 적을 수 있게 현재 총계를 보여줘요.", "인계가 빨라지게 현재 총계를 보여줘요."],
 '8.1': ["하나하나 방사선 불투과 표지가 있는지 보여 줄게요.", "하나하나 방사선 불투과 표지가 있는지 비춰 볼게요."],
 '8.2': ["탐지 안 되는 거즈는 필드 위에 두지 않아요.", "탐지 안 되는 거즈는 수술대 근처에 두지 않아요."],
 '8.3': ["사용하는 거즈는 전부 이 표지가 보여야 해요.", "필드의 거즈는 전부 이 표지가 있어야 해요."],
 '8.4': ["표지 없는 거즈는 영상에 안 보여요.", "표지 없는 거즈는 못 써요."],
 '9.0': ["이 기구의 부품을 하나씩 놔요.", None],
 '9.1': ["날카로운 부품들도 전부 셈에 넣어야 해요.", "작은 부품들도 전부 따로 모아야 해요."],
 '9.4': ["닫기 전에 조각이 하나라도 없으면 알려요.", "닫기 전에 조각을 전부 다시 맞춰 끼워요."],
 '10.1': ["계수를 마무리하기 전에 소독포를 펼쳐요.", None],
 '11.4': ["조각을 전부 확인할 때까지 서명할 수 없어요.", "조각을 전부 확인할 때까지 옮길 수 없어요."],
 '12.0': ["상황이 진정되면 첫 쟁반부터 계수를 다시 시작해요.", "상황이 진정되면 바늘부터 계수를 다시 시작해요."],
 '12.1': ["규정대로 전부 다시 세요.", "기록하게 전부 다시 세요."],
 '13.0': ["함께 세요 — 둘 다 숫자를 들어요.", "함께 세요 — 둘 다 각 물품을 만져요."],
 '13.1': ["당신이 소리 내어 읽으면 제가 확인할게요.", "당신이 소리 내어 세면 제가 따라 셀게요."],
 '13.4': [None, "같은 시간에 둘 다 쟁반을 짚어요."],
 '14.0': ["거즈마다 수기로 세기 전에 스캔돼요.", "거즈마다 무게를 재고 수기로도 계수돼요."],
 '14.1': ["게시판이 수기 총계와 일치해야 해요.", "포장 수량이 수기 총계와 일치해야 해요."],
 '14.2': [None, "스캔 계수를 게시판과 맞추려고 읽어요."],
 '14.4': ["두 숫자가 게시판에 있어야 해요.", "두 숫자가 정확히 적혀야 해요."],
 '15.0': ["계수 불일치를 선언할게요 — 봉합사를 내려놔요.", "계수 불일치를 선언할게요 — 이동을 멈춰요."],
 '15.2': ["계수가 맞을 때까지 봉합사를 건네지 않아요.", "계수가 맞을 때까지 퇴실하지 않아요."],
 '15.3': ["잠깐요 — 해결될 때까지 나갈 수 없어요.", "잠깐요 — 해결될 때까지 옮길 수 없어요."],
 '16.0': ["닫기 전에 엑스선을 읽어요.", "닫기 전에 엑스선 기사를 불러요."],
 '16.2': ["영상의학과에서 안에 아무것도 안 남았다고 하면 닫아요.", "영상의학과에서 안에 아무것도 안 남았는지 보려고 다시 찍어요."],
 '16.4': ["영상 결과가 나올 때까지 기다린 뒤 서명해요.", "영상 결과가 나올 때까지 기다린 뒤 퇴실해요."],
 '17.1': ["필드와 소독포, 바닥을 손전등으로 수색해요.", None],
 '17.2': ["찾을 때까지 아무도 나가지 않아요.", "찾을 때까지 아무것도 치우지 않아요."],
 '17.3': ["방 구석구석을 무릎 꿇고 확인해요.", "방 구석구석을 자석으로 확인해요."],
 '17.4': ["바늘이 나타날 때까지 모든 쓰레기를 그대로 둬요.", "바늘이 나타날 때까지 모든 문을 닫아 둬요."],
 '18.0': [None, "최종 계수가 틀렸어요 — 다시 세어야 할 수도 있어요."],
 '18.2': ["지금 바로 집도의에게 보고하려고 차트를 펼게요.", "지금 바로 보고하기 전에 한 번 셀게요."],
 '18.3': ["교대 후 숫자가 맞지 않아요.", "절개 후 숫자가 맞지 않아요."],
 '19.0': ["잔류 이물일 가능성이 있어요 — 한 번 더 셀게요.", "잔류 이물일 가능성이 있어요 — 소독포를 털어 볼게요."],
 '19.2': [None, "환자 존중이 우선이에요 — 이걸 보고할게요."],
 '19.3': ["잔류 물품에 대한 절차를 읽고 있어요.", "잔류 물품에 대한 절차를 팀에 알리고 있어요."],
 '19.4': ["환자를 위한 후속 스캔 결과를 알려줘요.", "환자를 위한 후속 스캔을 보여줘요."],
 '20.2': ["계수가 맞을 때까지 퇴실하지 않을게요.", "계수가 맞을 때까지 교대하지 않을게요."],
 '20.3': ["바쁘신 건 알지만 이건 건너뛰지 않을게요.", "피곤하신 건 알지만 이건 건너뛰지 않을게요."],
}
# 빈칸: (answer, options) — answer None이면 정답 유지
BL = {
 '1.1': ("confirm", ["confirm","measure","discard","restock"]),
 '1.3': (None, ["sponge","badge","mask","glove"]),
 '2.1': (None, ["tray","cabinet","ledge","counter"]),
 '2.3': ("instruments", ["instruments","patients","doses","clips"]),
 '3.0': (None, ["needle","cap","mask","bootie"]),
 '3.1': (None, ["magnet","bench","sink","wall"]),
 '4.1': (None, ["time","color","weight","size"]),
 '6.0': (None, ["sponges","gloves","caps","drapes"]),
 '6.2': (None, ["total","price","schedule","budget"]),
 '7.2': (None, ["handover","meeting","transport","rounds"]),
 '7.3': ("taking", ["taking","handing","reading","signing"]),
 '7.4': (None, ["exactly","roughly","vaguely","slowly"]),
 '8.0': (None, ["sponges","gowns","boots","blades"]),
 '8.4': (None, ["remove","fold","sort","label"]),
 '9.1': (None, ["accounted","paid","signed","asked"]),
 '10.3': (None, ["drape","sleeve","bag","pad"]),
 '11.4': (None, ["close","start","chart","restock"]),
 '12.0': (None, ["known","random","rough","later"]),
 '13.0': (None, ["together","alone","apart","separately"]),
 '13.3': (None, ["eyes","feet","hands","arms"]),
 '15.1': (None, ["short","over","late","early"]),
 '16.1': (None, ["retained","used","wet","damaged"]),
 '17.2': (None, ["until","after","because","since"]),
 '18.3': (None, ["numbers","signatures","times","colors"]),
 '18.4': (None, ["room","lobby","office","hallway"]),
 '19.3': (None, ["retained","damaged","loaned","borrowed"]),
 '19.4': (None, ["follow-up","dental","routine","private"]),
 '20.1': (None, ["properly","loosely","lightly","briefly"]),
 '20.3': (None, ["skip","repeat","rename","print"]),
}
DC = {
 '1.0': ", near the back table", '1.2': "each label", '4.0': "on the cart", '5.3': "in the hallway",
 '7.3': "your tray", '8.0': "this shelf", '8.2': "the doorway", '9.1': "the spare batteries",
 '9.3': "This drape", '9.4': "every label", '10.2': "in the basin", '11.2': "the scrub sink",
 '12.0': "the timer", '12.3': "at the start", '13.2': "the scan", '14.1': "our supply list",
 '14.4': "Both labels", '15.1': "one needle", '15.2': "No draping", '15.3': "until the alarm",
 '15.4': "the supply room", '16.2': "the portable unit", '16.4': "for the surgeon", '17.1': "quietly",
 '17.4': "until the cart", '18.1': "on discharge", '18.2': "the schedule", '18.4': "the lounge",
 '19.2': "Patient comfort", '19.3': "for a broken item", '19.4': "a follow-up call", '20.0': "a delay",
 '20.2': "until the chart",
}
# order: (situation, line index 0-based) -> (en, ko, note)
OL = {
 (0,2): ("Both of us got those same numbers.", "둘 다 그 숫자가 같았어요", "확인"),
 (2,3): ("Since they match, I'll confirm that total with you.", "일치하니 그 총계를 당신과 함께 확인할게요", "확인"),
 (3,3): ("Once that number is called out, I'll write it on the board.", "그 숫자를 부르면 게시판에 적을게요", "기록"),
 (4,2): ("Looking at that record, all totals match.", "그 기록을 보면 총계가 전부 일치해요", "일치"),
 (7,1): ("While we count, tell me exactly what's still open on the field.", "세는 동안 필드에 아직 열려 있는 게 뭔지 정확히 말해줘요", "요청"),
 (12,3): ("From there, we count every item in that group again.", "거기서부터 그 묶음을 전부 다시 세요", "재계수"),
 (15,2): ("Until it's found, we can't close.", "찾을 때까지 닫을 수 없어요", "정지"),
 (18,2): ("While we wait for the surgeon, let's image before deciding on re-exploration.", "집도의를 기다리는 동안 재개방 탐색을 결정하기 전에 영상부터 찍어요", "영상"),
 (18,3): ("Once the surgeon is back in the room, we decide together.", "집도의가 방으로 돌아오면 함께 결정해요", "결정"),
 (19,3): ("While that's being filed, please request a follow-up scan for the patient.", "그걸 제출하는 동안 환자 후속 스캔을 요청해줘요", "후속"),
 (20,3): ("Once it's resolved, we can close safely.", "해결되면 안전하게 닫을 수 있어요", "수정"),
}
if __name__ == '__main__':
    import yaml, sys, shutil, os, glob
    src = 'or-count.yaml'; out = sys.argv[1]
    d = yaml.safe_load(open(src))
    for si, s in enumerate(d['situations']):
        for i, x in enumerate(s['sentences']):
            k = f"{si}.{i}"
            if k in DK:
                x['distractorsKo'] = [n if n is not None else o for n, o in zip(DK[k], x['distractorsKo'])]
            if k in BL:
                a, opts = BL[k]
                if a: x['blank']['answer'] = a
                x['blank']['options'] = [{'en': o} for o in opts]
            if k in DC: x['decoy'] = DC[k]
        for (oi, li), (en, ko, note) in OL.items():
            if oi == si:
                s['order']['lines'][li].update({'en': en, 'ko': ko, 'note': note})
    yaml.safe_dump(d, open(out, 'w'), allow_unicode=True, sort_keys=False, width=1000)
    print("written", out)
