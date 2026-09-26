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
        merged.append(s)

    missing = sorted(set(seeds_for_theme) - seen)
    viol, warn, _ = v.verify_dept(dept, {theme: bank}, merged, theme_filter=theme,
                                  raw_banks={theme: doc['words']})

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
