CREATE TABLE vocabulary_translations (
  vocab_id UUID       NOT NULL REFERENCES vocabulary(id) ON DELETE CASCADE,
  locale   VARCHAR(8) NOT NULL,
  word     TEXT       NOT NULL,
  note     TEXT,
  PRIMARY KEY (vocab_id, locale)
);

CREATE INDEX idx_vocab_translation_locale ON vocabulary_translations(locale);
