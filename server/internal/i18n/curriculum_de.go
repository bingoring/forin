package i18n

// German names for the labels and the 24 floor headings.
//
// What this covers and what it does not: the keys the server actually looks up are
// the four situation tags, the milestone name, and `Building|Label` for a floor.
// curriculum_en.go also carries 89 three-part chapter keys (`본관|1F|prenatal`),
// but nothing builds those keys any more — they outlived the campus screen the
// journey map replaced — so translating them would be translating dead weight.
//
// Theme names and scenario titles live in theme_de.go / content_de.go. Anything
// missing falls back to the authored Korean, which is the fallback working as
// designed rather than a gap that breaks a screen.
//
// These name a US hospital's departments in German. The learner's language is
// German; the destination is still an American ward. So it is Notaufnahme for the
// American ER — the place is American, the word is German.
//
// German compounds run long and these strings are mobile labels, so the department
// name is kept to one or two words where a longer, more literal rendering would push
// the line past the card.
func init() {
	register("de", map[string]string{
		// ── situation state labels ───────────────────────────────────────────
		"tag.cleared":   "Erledigt",
		"tag.attempted": "Versucht",
		"tag.urgent":    "Dringend",
		"tag.new":       "Neu",

		// ── milestone flag (the journey map's track-end exam) ────────────────
		"milestone.name": "Abschnittsprüfung",

		// ── floor headings (building|floor) ──────────────────────────────────
		"본관|1F": "Haupthaus 1F · Notaufnahme",
		"본관|2F": "Haupthaus 2F · Dermatologie",
		"본관|3F": "Haupthaus 3F · OP · Aufwachraum",
		"본관|4F": "Haupthaus 4F · Intensivstation",
		"본관|6F": "Haupthaus 6F · Orthopädie",
		"본관|7F": "Haupthaus 7F · Allgemeinchirurgie",
		"본관|8F": "Haupthaus 8F · Innere Medizin",
		"본관|P1": "Haupthaus P1 · Zentralapotheke",

		"별관 1|1F": "Nebengebäude 1 1F · Kinder- und Frauenambulanz",
		"별관 1|2F": "Nebengebäude 1 2F · Kinderstation",
		"별관 1|3F": "Nebengebäude 1 3F · Kreißsaal · Neugeborenenzimmer",
		"별관 1|4F": "Nebengebäude 1 4F · Neonatologie · Kinderintensiv",

		"별관 2|1F": "Nebengebäude 2 1F · Physiotherapie",
		"별관 2|2F": "Nebengebäude 2 2F · Psychiatrie",
		"별관 2|3F": "Nebengebäude 2 3F · Onkologie · Transplantation",
		"별관 2|4F": "Nebengebäude 2 4F · Palliativstation · Geriatrie",

		"별관 3|1F": "Nebengebäude 3 1F · Radiologie",
		"별관 3|2F": "Nebengebäude 3 2F · Spezialambulanzen",
		"별관 3|3F": "Nebengebäude 3 3F · Infusionsambulanz · Dialyse",
		"별관 3|4F": "Nebengebäude 3 4F · Endoskopie · Herzkatheterlabor",

		"지원동|1F": "Versorgungstrakt 1F · Zentralsterilisation",
		"지원동|2F": "Versorgungstrakt 2F · Personalraum",
		"지원동|3F": "Versorgungstrakt 3F · Simulationslabor",
		"지원동|B1": "Versorgungstrakt B1 · Leichenhalle",
	})
}
