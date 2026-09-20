package i18n

// Japanese names for the labels and the 24 floor headings.
//
// What this covers and what it does not: the keys the server actually looks up are
// the four situation tags, the milestone name, and `Building|Label` for a floor.
// curriculum_en.go also carries 89 three-part chapter keys (`본관|1F|prenatal`),
// but nothing builds those keys any more — they outlived the campus screen the
// journey map replaced — so translating them would be translating dead weight.
//
// Theme names and scenario titles live in theme_ja.go / content_ja.go. Anything
// missing falls back to the authored Korean, which is the fallback working as
// designed rather than a gap that breaks a screen.
//
// These name a US hospital's departments in Japanese. The learner's language is
// Japanese; the destination is still an American ward. So it is 救急センター for the
// American ER, not a Japanese hospital's 救急外来 — the place is American, the word
// is Japanese.
func init() {
	register("ja", map[string]string{
		// ── situation state labels ───────────────────────────────────────────
		"tag.cleared":   "完了",
		"tag.attempted": "挑戦済み",
		"tag.urgent":    "緊急",
		"tag.new":       "新着",

		// ── milestone flag (the journey map's track-end exam) ────────────────
		"milestone.name": "区間テスト",

		// ── floor headings (building|floor) ──────────────────────────────────
		"본관|1F": "本館1F・救急センター",
		"본관|2F": "本館2F・皮膚科センター",
		"본관|3F": "本館3F・手術室・PACU",
		"본관|4F": "本館4F・ICU",
		"본관|6F": "本館6F・整形外科病棟",
		"본관|7F": "本館7F・一般外科病棟",
		"본관|8F": "本館8F・一般内科病棟",
		"본관|P1": "本館P1・中央薬剤部",

		"별관 1|1F": "別館1 1F・小児科・産婦人科外来",
		"별관 1|2F": "別館1 2F・小児一般病棟",
		"별관 1|3F": "別館1 3F・家族分娩室・新生児室",
		"별관 1|4F": "別館1 4F・NICU・PICU",

		"별관 2|1F": "別館2 1F・リハビリテーション室",
		"별관 2|2F": "別館2 2F・精神科病棟",
		"별관 2|3F": "別館2 3F・腫瘍内科病棟・移植室",
		"별관 2|4F": "別館2 4F・緩和ケア・老年病棟",

		"별관 3|1F": "別館3 1F・放射線科",
		"별관 3|2F": "別館3 2F・専門外来",
		"별관 3|3F": "別館3 3F・外来点滴センター・透析室",
		"별관 3|4F": "別館3 4F・内視鏡室・心臓カテーテル室",

		"지원동|1F": "支援棟1F・中央材料室",
		"지원동|2F": "支援棟2F・スタッフラウンジ",
		"지원동|3F": "支援棟3F・シミュレーションラボ",
		"지원동|B1": "支援棟B1・霊安室",
	})
}
