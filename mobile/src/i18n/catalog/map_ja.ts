// Interior signage, keyed by the authored Korean (see map/localize.ts).
//
// Only the navigation labels are filled in. The clinical signage of 본관 1F is in
// map_en.ts because English is what a US-bound learner reads on those signs; for a
// Japanese or German interface the ward names still need a native-speaker pass, and
// guessing them would be exactly the machine-translated filler this feature was told
// not to produce. Untranslated keys fall through to the authored Korean.
export const mapJa: Record<string, string> = {
  '← 엘리베이터': '← エレベーター',
  '↓ 커리어로': '↓ キャリアへ',
  '← 커리어로': '← キャリアへ',
  '→ 복도': '→ 廊下',
  '진료': '診療',
  '접수': '受付',
  '접수·대기': '受付 · 待合',
  '간호 스테이션': 'ナースステーション',
  '중앙 간호 스테이션': '中央ナースステーション',
  '진료실 1': '診察室 1',
  '진료실 2': '診察室 2',
  '대기실': '待合室',
  '등록': '登録',
};
