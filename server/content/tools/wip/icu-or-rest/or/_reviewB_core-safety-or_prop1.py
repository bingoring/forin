# core-safety-or B 검토 — 새 값 (S0~S6)
# 항목: d0/d1 = 새 distractorsKo, blank = (answer, [options]), decoy, tag, why
# c = {필드: (분류, 사유)}  분류: 안전 / 정답둘 / 기타
# 모양 태그(오답 두 칸): S 같은 틀·세부 / P 앞 단계 / N 뒤 단계 / F 사실
P = {}
ORD = {}

P['0.0'] = dict(decoy='raise the bed',
  c={'decoy': ('정답둘', "`raise a hand` — 'Anyone can raise a hand here'는 수술장 문화에서 손을 들어 말한다는 뜻이라 ko와 거의 같음")})
P['0.5'] = dict(blank=('wrong', ['busy', 'normal', 'slow', 'wrong']),
  c={'blank': ('정답둘', "funny — 'something feels funny'는 '뭔가 이상하다'는 관용 표현이라 wrong과 같은 뜻")})
ORD['0'] = dict(lines={3: dict(en="Knowing you'll be thanked, please speak up today if something feels wrong.",
                               ko="고맙다는 말을 들을 테니 오늘 뭔가 이상하면 말해 주세요")},
  why="우려를 다루는 방식을 소개하고, 누구나 제기할 수 있다고 한 뒤, 그러면 고마워한다고 알리고, 고마워할 테니 오늘 말해 달라고 청해요.",
  c=('기타', "3↔4 교환이 자연스러움('…please say so today if something feels wrong. When someone does, we thank them'). 4줄이 3줄의 '고마워함'을 가리키게"))

P['1.0'] = dict(blank=('marked', ['painted', 'draped', 'marked', 'warmed']),
  c={'blank': ('정답둘', "signed — 부위 표시는 집도의 이니셜로 하는 곳이 많아('Sign your site') 'Is the site signed?'도 맞음")})
P['1.1'] = dict(blank=('matches', ['replaces', 'matches', 'precedes', 'overrides']), decoy='the wall clock',
  c={'blank': ('기타', "hides·weighs·opens — 동의서와 엮으면 뜻이 안 되는 말이라 읽기만 해도 걸러짐(파일럿 2)"),
     'decoy': ('정답둘', "`the schedule` — 'Let's confirm it matches the schedule'도 실제 하는 대조(수술 일정표)라 그 장면에서 맞는 다른 행동")})
P['1.2'] = dict(d0='소독한 뒤에도 표시가 보여요.', d1='표시는 지워지지 않는 펜으로 그려요.',
  blank=('visible', ['dry', 'visible', 'hidden', 'smudged']),
  c={'d0': ('안전', "소독 자국이 보여요 — 보이는지 확인할 대상(표시)을 소독 자국으로 바꿈(상태 문장의 확인 대상 바꾸기)"),
     'd1': ('안전', "환자 이름이 보여요 — 같은 이유. 또 두 오답 모두 정답보다 김(길이 규칙)"),
     'blank': ('기타', "loose·warm — 표시에 붙지 않는 말이라 동떨어짐")})
P['1.3'] = dict(d0='보여 주실 표시 위의 드레이프를 걷을게요.',
  c={'d0': ('기타', "'~하는 동안' 틀이 오답에만 3번(1.3·1.5·4.3, 정답 ko 1번) — 같은 앞 단계를 다른 모양으로")})
P['1.5'] = dict(d1='부위 확인은 환자분이 깨어 계실 때 받아요.', decoy='to hold the pillow',
  c={'d1': ('정답둘', "본인이 직접 부위를 말씀하셔도 괜찮아요 — 환자가 직접 부위를 말하는 것은 정답 행동과 같음"),
     'decoy': ('안전', "`the intern` — 조립하면 'Let's ask the intern to confirm the side themselves' — 환자 대신 인턴에게 쪽 확인(확인 주체 바꾸기)")})

P['2.0'] = dict(d0='타임아웃을 위해 지금 팀이 모여요.', d1='타임아웃엔 다 참여해요.',
  c={'d0': ('기타', "'타임아웃 위해' — 조사가 빠진 비문"),
     'd1': ('기타', "타임아웃은 절개 직전에 진행돼요 — 2.4 오답1과 같은 사실 되풀이('직전'), 두 오답 모두 정답보다 김")})
P['2.1'] = dict(d0='동의를 물을 세 항목을 차례로 하나씩 불러요.', d1='부위는 영상과 표시로도 한 번 더 대조해요.', decoy='scrub',
  c={'d0': ('안전', "다들 들으셨나요 — 동의 확인을 '들었는지'로 바꿈(확인을 다른 질문으로)"),
     'd1': ('안전', "다들 준비되셨나요 — 동의 확인을 준비 여부로 바꿈"),
     'decoy': ('정답둘', "`ready` — 'Patient, procedure, and site—everyone ready?'가 그 장면에서 그대로 쓰는 질문이고 동의 확인을 준비 확인으로 바꿈")})
P['2.2'] = dict(decoy='Any visitors',
  c={'decoy': ('정답둘', "`Any changes` — 'Any changes before we start?'는 타임아웃에서 실제 묻는 말")})
P['2.3'] = dict(blank=('hear', ['sign', 'hear', 'copy', 'file']),
  c={'blank': ('기타', "chant·sing — 장면과 동떨어진 말, shout도 read 자리에서 문법·뜻이 겹침. 빈칸을 가르치는 말 hear(w-hear)로")})
P['2.4'] = dict(blank=('time-out', ['time-out', 'handoff', 'turnover', 'dressing']),
  c={'blank': ('안전', "finishes·repeats·doubles — 넣어 읽으면 '타임아웃 동안 하던 일을 마저 끝낸다/두 배로 한다' — 멈추지 않는 문장. 동사 자리는 무엇을 넣어도 멈춤이 빠지므로 빈칸을 time-out(w-timeout)으로")})
P['2.5'] = dict(d0='불편한 게 있다면 지금이 말할 순간이에요.', d1='불분명한 점이 풀릴 때까지 절개하지 않아요.',
  blank=('unclear', ['routine', 'sterile', 'unclear', 'ready']), decoy='the reason',
  c={'d0': ('안전', "말할 사람을 지금 정해요 — 지금 말하기를 사람 정하기로 미룸(우려 표현을 다른 일로)"),
     'd1': ('정답둘', "작은 일도 환영이에요 — 말해 달라는 정답과 같은 초대, '작다'는 2.2·6.0 오답과 되풀이"),
     'blank': ('기타', "heavy·empty·thin — 동떨어진 말"),
     'decoy': ('정답둘', "`the place` — 'this is the place to say it'은 ko와 같은 뜻의 다른 문장")})

P['3.0'] = dict(d1='바늘은 상자에 꽂아요.',
  c={'d1': ('기타', "두 오답 모두 정답(11자)보다 김 — 하나는 정답 길이 이하로")})
P['3.1'] = dict(d1='소리 내면 숫자가 귀에 남아요.', blank=('count', ['read', 'guess', 'count', 'think']),
  c={'d1': ('기타', "두 오답 모두 정답보다 김"),
     'blank': ('기타', "stack·wrap·tie — 'out loud'와 함께 쓸 수 없는 동사라 문법으로 걸러짐")})
P['3.2'] = dict(d0='초기 계수는 늦습니다.',
  c={'d0': ('기타', "두 오답 모두 정답(10자)보다 김")})
P['3.3'] = dict(d1='계수는 시작할 때와 봉합 때 해요.', blank=('hear', ['hear', 'add', 'guess', 'round']), decoy='each label',
  c={'d1': ('정답둘', "함께 셀 때는 숫자를 소리 내어 말해요 — 숫자를 듣겠다는 정답과 같은 요청"),
     'blank': ('정답둘', "echo(되받아 말하기)·write(순환간호사가 숫자를 적음)는 계수 장면에서 그대로 맞음"),
     'decoy': ('정답둘', "`your voice` — 'I want to hear your voice as we count together'는 ko와 거의 같은 뜻")})
P['3.5'] = dict(d0='아무것도 놓치지 않도록 항목마다 두 번씩 말할게요.', d1='계수하는 중에는 잡담으로 흐름을 끊지 않아요.', decoy='every shelf',
  c={'d0': ('기타', "'~할 항목마다 번호를 붙일게요' — 2.3 오답1과 같은 틀 돌려쓰기"),
     'd1': ('정답둘', "또박또박 한 번씩 부르면 빠지는 게 줄어요 — 정답 문장을 풀어 쓴 같은 주장"),
     'decoy': ('정답둘', "`every number` — 'I'll say every number clearly…'는 계수 장면에서 ko와 같은 뜻")})

P['4.0'] = dict(decoy='the door sign',
  c={'decoy': ('정답둘', "`the order sheet` — 'Let's read the order sheet together'는 라벨 대조에서 실제 함께 읽는 서류(그 장면에서 맞는 다른 행동)")})
P['4.2'] = dict(d0='확인되면 검체를 내보낼게요.', decoy='the tray',
  c={'d0': ('기타', "'확인할 검체를 들어요' — 4.1 오답1('볼 검체를 들어요')과 같은 틀, 두 오답 모두 정답보다 김. 뒤 단계로"),
     'decoy': ('안전', "`the floor` — 'before it leaves the floor' — 확인 시점을 방을 나간 뒤로 늦춤")})
P['4.4'] = dict(d1='누구든 용기를 만지기 전에 둘이 함께 읽어요.',
  c={'d1': ('안전', "장갑을 먼저 껴요 — 둘이 함께 읽기(대조)를 장갑 끼기로 바꿈. 새 값은 읽기를 남기고 기준 물건만 용기로")})

P['5.0'] = dict(d0='불은 산소·연료·열로 나요.',
  c={'d0': ('안전', "화재 경보기를 살펴요 — 살필 대상(화재 삼각형)을 경보기로 바꿈")})
P['5.1'] = dict(d1='소작기 끝은 쓰지 않을 때 꼭 홀스터에 넣어 둬요.',
  c={'d1': ('정답둘', "산소와 소독용 알코올은 불꽃을 키우는 편이에요 — '함께 있으면 위험하다'는 정답과 같은 주장")})
P['5.2'] = dict(blank=('dry', ['freeze', 'dry', 'expire', 'cool']),
  c={'blank': ('기타', "glow — 동떨어진 말")})
P['5.3'] = dict(d0='소화기가 있는 곳은 화재 훈련 때 다 같이 익혀요.',
  c={'d0': ('안전', "소화기가 어디 있는지 늘 알고 있어요 — 위치를 알아 둘 대상(화재 세 요소)을 소화기로 바꿈")})
P['5.5'] = dict(d0='산소 유량이 높아 보이면 말할게요.', blank=('high', ['high', 'low', 'stable', 'normal']),
  c={'d0': ('안전', "말할 산소 농도를 농도판에서 봐요 — 말하기 대신 다시 보기('보고 대신 다시 재기'), '농도판'은 없는 말. 새 값은 말할 일(유량)만 바꾼 같은 틀"),
     'blank': ('기타', "loud·dim·dark — 농도에 붙지 않는 말이라 동떨어짐")})

P['6.0'] = dict(d0='제기해야 할 우려가 두 가지 있어요.',
  c={'d0': ('안전', "제기할 우려를 적을 종이가 있어요 — 우려 말하기를 적기로 바꿈")})
P['6.1'] = dict(d0='잠시 멈추고 저걸 다시 확인할 수 있을까요?', decoy='and restock',
  c={'d0': ('안전', "다시 확인할 이걸 잠시 펼칠 수 있을까요 — 멈춤이 빠짐, 문장도 어색"),
     'decoy': ('정답둘', "`that tray` — 'Can we pause and double-check that tray?'는 ko('이걸 다시 확인')와 그대로 맞음")})
P['6.2'] = dict(d0='불편하다는 말은 멈추자는 신호예요.', d1='불편함은 근거가 없어도 말해요.', decoy='sitting',
  c={'d0': ('안전', "서두르기 편하지 않아요 — 진행 거부를 '서두르지만 말자'로 좁힘(멈춤 범위 좁히기)"),
     'd1': ('안전', "서명하기 편하지 않아요 — 진행 거부를 서명만 멈추기로 좁힘"),
     'decoy': ('안전', "`signing` — 조립하면 'I'm not comfortable signing yet' — 같은 멈춤 범위 좁히기")})
P['6.4'] = dict(d1='더 나아가기 전에 모두가 손을 멈춰야 해요.', blank=('hear', ['hear', 'sign', 'approve', 'initial']), decoy='to sit down',
  c={'d1': ('기타', "가져가야 해요 — 장면에서 뜻이 서지 않는 말, 두 오답 모두 정답보다 김"),
     'blank': ('기타', "vote — 'vote this'는 on이 빠진 비문이라 문법으로 걸러짐. approve는 문법이 맞고 장면에서 틀려 통과"),
     'decoy': ('정답둘', "`to read this` — 'I need everyone to read this'는 그 장면에서 맞는 다른 요청")})
ORD['6'] = dict(lines={2: dict(en="Since I'm not comfortable, can we pause and double-check this?",
                               ko="편하지 않으니 잠시 멈추고 이걸 다시 확인할 수 있을까요"),
                       3: dict(en="Even if pausing is a hassle, I'd rather ask now than stay quiet.",
                               ko="멈추는 게 번거로워도 조용히 있기보다 지금 물을게요")},
  why="우려가 있다고 알리고, 그 우려가 진행이 편하지 않다는 것임을 밝히고, 편하지 않으니 멈추고 확인하자고 청하고, 멈추는 게 번거로워도 묻겠다고 해요.",
  c=('기타', "2↔3('I have a concern. Because of that, can we pause…? It's that…')과 3↔4가 자연스럽게 읽힘. 3줄이 2줄의 '편하지 않음'을, 4줄이 3줄의 '멈춤'을 가리키게"))
