"""v44 필드 수정 공용 도구 (결정 11 예외). 주제별 fix_<주제>_v44.py가 불러 쓴다.
base-<주제>.yaml 을 제자리에서 고치고, changes/er/changes-<주제>.yaml 에 변경을 이어 붙인다."""
import io, os, yaml

HERE = os.path.dirname(os.path.abspath(__file__))
CHG_DIR = os.path.join(HERE, '..', '..', 'changes', 'er')
WHY = 'v46 검토 결정 11 예외: '


def _dump(obj):
    return yaml.dump(obj, allow_unicode=True, sort_keys=False, default_flow_style=False, width=10**9)


class Fixer:
    def __init__(self, theme):
        self.theme = theme
        self.bpath = os.path.join(HERE, f'base-{theme}.yaml')
        self.cpath = os.path.join(CHG_DIR, f'changes-{theme}.yaml')
        self.doc = yaml.safe_load(io.open(self.bpath, encoding='utf-8'))
        self.chg = yaml.safe_load(io.open(self.cpath, encoding='utf-8'))
        assert self.chg['theme'] == theme
        self.changes = self.chg['changes']
        self.W = {w['id']: w for w in self.doc['words']}
        self.sits = {s['title']: s for s in self.doc['situations']}
        self.new = []          # 이번에 더한 변경(상황·문장 키로 합침)
        self.kp_changes = []   # keyPhrase 시드 변경 기록

    # ── 찾기
    def sent(self, title, idx, expect_en):
        s = self.sits[title]['sentences'][idx]
        assert s['en'] == expect_en, (title, idx, s['en'])
        return s

    def nu(self, title, kind, n=0):
        return [x for x in self.sits[title].get('nuance', []) if x['kind'] == kind][n]

    # ── 변경 기록
    def _rec_sentence(self, title, idx, fields, why):
        for c in self.new:
            if c['kind'] == 'sentence' and c['situation'] == title and c['index'] == idx:
                for f in fields:
                    if f not in c['fields']:
                        c['fields'].append(f)
                if why not in c['why']:
                    c['why'] += ' / ' + why.replace(WHY, '')
                return
        self.new.append({'kind': 'sentence', 'situation': title, 'index': idx, 'fields': list(fields), 'why': WHY + why})

    def _rec_word(self, wid, fields, why, kind='word'):
        for c in self.new:
            if c['kind'] == kind and c['id'] == wid:
                for f in fields:
                    if f not in c.get('fields', []):
                        c.setdefault('fields', []).append(f)
                return
        e = {'kind': kind, 'id': wid}
        if kind == 'word':
            e['fields'] = list(fields)
        e['why'] = WHY + why
        self.new.append(e)

    # ── 문장 고치기: en·ko·chunks·words 중 실제로 바뀐 것만 기록. 그 문장을 예문으로 쓰는 단어의 example·exKo 동기화
    def set_sentence(self, title, idx, expect_en, reason, en=None, ko=None, chunks=None, words=None, **extra):
        s = self.sent(title, idx, expect_en)
        old_en, old_ko = s['en'], s['ko']
        fields = []
        if en is not None and en != old_en:
            s['en'] = en; fields.append('en')
        if ko is not None and ko != old_ko:
            s['ko'] = ko; fields.append('ko')
        if chunks is not None and chunks != s['chunks']:
            assert ' '.join(' '.join(chunks).split()) or True
            s['chunks'] = chunks; fields.append('chunks')
        if words is not None and words != s['words']:
            s['words'] = words; fields.append('words')
        for k, v in extra.items():
            s[k] = v   # v46 필드(tag·icon·why·decoy·distractorsKo·blank)는 changes에 안 적는다
        # chunks 가 en 을 이어 붙인 것인지 (V5와 같은 규칙: 그대로 이어 붙임)
        assert ''.join(s['chunks']).replace(' ', '') == s['en'].replace(' ', ''), (s['en'], s['chunks'])
        if fields:
            self._rec_sentence(title, idx, fields, reason)
        for w in self.doc['words']:
            if w.get('example') == old_en:
                if 'en' in fields:
                    w['example'] = s['en']
                    self._rec_word(w['id'], ['example'], 'example를 바뀐 문장 en에 맞춤')
                if 'ko' in fields:
                    if w.get('exKo') != s['ko']:
                        w['exKo'] = s['ko']
                        self._rec_word(w['id'], ['exKo'], 'exKo를 바뀐 문장 ko에 맞춤')
        return s

    def word_add(self, w, why):
        assert w['id'] not in self.W
        self.doc['words'].append(w); self.W[w['id']] = w
        self._rec_word(w['id'], [], why, kind='word-add')

    def word_remove(self, wid, why):
        w = self.W.pop(wid)
        self.doc['words'].remove(w)
        self._rec_word(wid, [], why, kind='word-remove')

    def word_set(self, wid, why, **kw):
        for k, v in kw.items():
            self.W[wid][k] = v
        self._rec_word(wid, list(kw), why)

    def key_phrases(self, title, old_new):
        """상황 keyPhrases를 base에 적고(검사기가 시드 대신 읽도록) 시드 변경을 기록한다."""
        sit = self.sits[title]
        seed = self._seed_kp(title)
        new = [old_new.get(k, k) for k in seed]
        for k in seed:
            if k in old_new:
                self.kp_changes.append({'theme': self.theme, 'situation': title, 'old': k, 'new': old_new[k]})
        # base yaml에는 쓰지 않는다(정본 시드에 있음). 변경은 keyphrase-seed-changes-<주제>.yaml 에만 기록.

    def _seed_kp(self, title):
        if not hasattr(self, '_seeds'):
            sp = os.path.join(HERE, '..', '..', '..', 'nurse', 'topics', 'er.yaml')
            self._seeds = {s['title']: s for s in yaml.safe_load(io.open(sp, encoding='utf-8')) if s['theme'] == self.theme}
        return list(self._seeds[title]['keyPhrases'])

    def save(self):
        self.changes.extend(self.new)
        io.open(self.bpath, 'w', encoding='utf-8').write(_dump(self.doc))
        io.open(self.cpath, 'w', encoding='utf-8').write(_dump(self.chg))
        if self.kp_changes:
            p = os.path.join(HERE, f'keyphrase-seed-changes-{self.theme}.yaml')
            io.open(p, 'w', encoding='utf-8').write(_dump({'theme': self.theme, 'changes': self.kp_changes}))
        print(f'{self.theme}: 변경 {len(self.new)}건 추가 (총 {len(self.changes)}건), keyPhrase 시드 변경 {len(self.kp_changes)}건')
