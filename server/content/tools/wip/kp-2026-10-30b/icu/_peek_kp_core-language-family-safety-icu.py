"""작업 확인용: 문장 몇 개의 en·chunks·decoy·blank와 keyPhrase 여부를 보여 준다. 사용: <주제> 10.0 14.0 ..."""
import sys, yaml, io, json
t = sys.argv[1]
doc = yaml.safe_load(io.open(f'base-{t}.yaml', encoding='utf-8'))
inj = json.load(io.open(f'in-{t}.json', encoding='utf-8'))
for a in sys.argv[2:]:
    i, j = map(int, a.split('.'))
    s = doc['situations'][i]; se = s['sentences'][j]
    kp = se['en'] in inj['situations'][i]['keyPhrases']
    print(f"{a} KP={kp} {se['en']}\n   chunks={se['chunks']}\n   decoy={se['decoy']!r} blank={se['blank']['answer']!r} opts={[o['en'] for o in se['blank']['options']]}\n   ko={se['ko']}")
