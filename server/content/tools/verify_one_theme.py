#!/usr/bin/env python3
"""주제 하나의 산출물 파일을 검사한다. verify_lesson_content.py의 판정 함수를 그대로 쓴다.

부서 정본에 합치기 전, 저작자(서브에이전트)가 스스로 돌려 보는 문이다. 합친 뒤에는
verify_lesson_content.py 를 부서 단위로 돌린다.

    python3 verify_one.py <부서코드> <주제파일.yaml>

예) python3 verify_one.py er /tmp/lesson-er/er-chestpain.yaml

파일 모양(한 파일에 은행과 상황이 함께 있다):

    theme: core-safety-er
    words:
      - {id: w-x, en: ..., ipa: ..., ko: ..., icon: ..., example: "..."}
    situations:
      - title: 환자 2인 확인
        sentences:
          - {en: ..., ko: ..., chunks: [...], words: [...], goal: 1}
        nuance:                      # v45 (build-spec §11-3)
          - {kind: slider, words: [...], ...}

정본(lexicon/<부서>.yaml)에 이 주제가 이미 있으면 보강 패스로 보고 V16도 검사한다.
같은 폴더에 changes-<주제>.yaml 이 있으면 거기 적힌 v44 변경만 허용한다(결정 11).
"""
import io, os, sys, yaml
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import verify_lesson_content as v


def main(dept: str, path: str) -> int:
    seeds_path = os.path.join(
        os.path.dirname(os.path.abspath(__file__)), '..', 'nurse', 'topics', f'{dept}.yaml'
    )
    SEEDS = yaml.safe_load(io.open(seeds_path, encoding='utf-8'))
    doc = yaml.safe_load(io.open(path, encoding='utf-8'))
    theme = doc['theme']
    bank = {w['id']: w for w in doc['words']}
    seeds_for_theme = {s['title']: s for s in SEEDS if s['theme'] == theme}

    # 원본 시드에 생성된 sentences를 얹어 검사기에 넘긴다.
    merged = []
    seen = set()
    for sit in doc.get('situations', []):
        title = sit['title']
        if title not in seeds_for_theme:
            print(f'  [X] 원본에 없는 상황 제목: {title!r}')
            return 2
        seen.add(title)
        s = dict(seeds_for_theme[title])
        s['sentences'] = sit['sentences']
        if sit.get('nuance'):
            s['nuance'] = sit['nuance']
        merged.append(s)

    missing = sorted(set(seeds_for_theme) - seen)
    viol, warn, _ = v.verify_dept(dept, {theme: bank}, merged, theme_filter=theme,
                                  raw_banks={theme: doc['words']})

    # V16 — 정본에 이 주제의 v44 콘텐츠가 이미 있으면 이것은 보강 패스다. 정본이 곧 보강 전
    # 상태이므로, 새 필드만 더했는지(v44 필드를 한 글자도 안 바꿨는지) 정본과 비교한다.
    base_bank = v.load_lexicon_raw(dept).get(theme)
    if base_bank:
        base_seeds = [sd for sd in SEEDS if sd.get('theme') == theme]
        # 결정 11 — 같은 폴더의 changes-<주제>.yaml 에 적힌 v44 변경만 허용한다.
        chg_path = os.path.join(os.path.dirname(os.path.abspath(path)), f'changes-{theme}.yaml')
        changes = {}
        if os.path.exists(chg_path):
            t, lst = v.load_changes(io.open(chg_path, encoding='utf-8').read())
            changes = {theme: lst}
            print(f'  변경 목록 {len(lst)}건: {os.path.basename(chg_path)}')
        viol += v.check_backfill(dept, {theme: base_bank}, base_seeds, {theme: doc['words']}, merged, changes)

    print(f'{theme}: 상황 {len(merged)}/{len(seeds_for_theme)} · 단어 {len(bank)}개')
    if missing:
        print(f'  [X] 빠진 상황 {len(missing)}건: {missing[:5]}{" ..." if len(missing) > 5 else ""}')
    for x in viol:
        print('  [X]', x)
    for x in warn:
        print('  [!]', x)
    ok = not viol and not missing
    print('  ==> ' + ('통과' if ok else '실패'))
    return 0 if ok else 1


if __name__ == '__main__':
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    sys.exit(main(sys.argv[1], sys.argv[2]))
