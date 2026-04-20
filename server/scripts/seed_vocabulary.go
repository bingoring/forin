package main

import (
	"log"

	"gorm.io/gorm"
)

type vocabSeed struct {
	canonical    string
	partOfSpeech string
	domain       string
	cefr         string
	ko           string
}

// 50 high-frequency nurse–patient terms. Nouns dominate symptom/anatomy;
// verbs/phrases show up in procedure and medication. Sub-project 3 extends
// this list when the synonym_match exercise ships.
var seedVocab = []vocabSeed{
	// symptom
	{"pain", "noun", "symptom", "A2", "통증"},
	{"ache", "noun", "symptom", "B1", "쑤심"},
	{"nausea", "noun", "symptom", "B1", "메스꺼움"},
	{"dizziness", "noun", "symptom", "B1", "어지러움"},
	{"fever", "noun", "symptom", "A2", "열"},
	{"cough", "noun", "symptom", "A2", "기침"},
	{"fatigue", "noun", "symptom", "B1", "피로"},
	{"swelling", "noun", "symptom", "B1", "부종"},
	{"rash", "noun", "symptom", "B1", "발진"},
	{"shortness of breath", "phrase", "symptom", "B2", "숨 가쁨"},
	{"chest pain", "phrase", "symptom", "B1", "가슴 통증"},
	{"bleeding", "noun", "symptom", "B1", "출혈"},
	{"wound", "noun", "symptom", "A2", "상처"},
	// equipment
	{"stethoscope", "noun", "equipment", "B1", "청진기"},
	{"thermometer", "noun", "equipment", "A2", "체온계"},
	{"blood pressure cuff", "phrase", "equipment", "B2", "혈압계"},
	{"syringe", "noun", "equipment", "B1", "주사기"},
	{"IV line", "phrase", "equipment", "B2", "정맥주사관"},
	{"oxygen mask", "phrase", "equipment", "B2", "산소 마스크"},
	{"wheelchair", "noun", "equipment", "A2", "휠체어"},
	{"bedpan", "noun", "equipment", "B1", "변기"},
	{"gauze", "noun", "equipment", "B1", "거즈"},
	{"bandage", "noun", "equipment", "A2", "붕대"},
	// procedure
	{"injection", "noun", "procedure", "A2", "주사"},
	{"surgery", "noun", "procedure", "A2", "수술"},
	{"blood draw", "phrase", "procedure", "B2", "채혈"},
	{"X-ray", "noun", "procedure", "A2", "엑스레이"},
	{"vital signs", "phrase", "procedure", "B1", "활력징후"},
	{"discharge", "noun", "procedure", "B1", "퇴원"},
	{"admission", "noun", "procedure", "B1", "입원"},
	{"prescription", "noun", "procedure", "B1", "처방"},
	{"dosage", "noun", "procedure", "B2", "용량"},
	// medication
	{"painkiller", "noun", "medication", "A2", "진통제"},
	{"antibiotic", "noun", "medication", "B1", "항생제"},
	{"anesthesia", "noun", "medication", "B2", "마취"},
	{"insulin", "noun", "medication", "B1", "인슐린"},
	{"IV fluid", "phrase", "medication", "B2", "수액"},
	{"tablet", "noun", "medication", "A2", "알약"},
	{"capsule", "noun", "medication", "A2", "캡슐"},
	// anatomy
	{"pulse", "noun", "anatomy", "A2", "맥박"},
	{"heart rate", "phrase", "anatomy", "B1", "심박수"},
	{"blood pressure", "phrase", "anatomy", "B1", "혈압"},
	{"lungs", "noun", "anatomy", "A2", "폐"},
	{"abdomen", "noun", "anatomy", "B1", "복부"},
	{"spine", "noun", "anatomy", "B1", "척추"},
	{"kidney", "noun", "anatomy", "A2", "신장"},
	{"liver", "noun", "anatomy", "A2", "간"},
	{"bladder", "noun", "anatomy", "B1", "방광"},
	{"wrist", "noun", "anatomy", "A2", "손목"},
	{"ankle", "noun", "anatomy", "A2", "발목"},
	{"temperature", "noun", "anatomy", "A2", "체온"},
}

func seedVocabulary(db *gorm.DB) {
	for _, v := range seedVocab {
		var vocabID string
		// Upsert vocabulary row; RETURNING id gives us the UUID to attach the translation to.
		err := db.Raw(`
			INSERT INTO vocabulary (canonical_en, part_of_speech, domain, cefr_level)
			VALUES (?, ?, ?, NULLIF(?, ''))
			ON CONFLICT (canonical_en) DO UPDATE
			  SET canonical_en = EXCLUDED.canonical_en
			RETURNING id;
		`, v.canonical, v.partOfSpeech, v.domain, v.cefr).Row().Scan(&vocabID)
		if err != nil {
			log.Fatalf("seed vocab %q: %v", v.canonical, err)
		}
		if err := db.Exec(`
			INSERT INTO vocabulary_translations (vocab_id, locale, word)
			VALUES (?::uuid, 'ko', ?)
			ON CONFLICT (vocab_id, locale) DO NOTHING;
		`, vocabID, v.ko).Error; err != nil {
			log.Fatalf("seed translation %q: %v", v.canonical, err)
		}
	}
}
