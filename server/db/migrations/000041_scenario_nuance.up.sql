-- 상황 학습 v45: 상황마다 뉘앙스 문항(저울·콜로케이션·문장 릴·같은 뜻 다른 장면·한 단어 바꾸기).
-- 문장처럼 상황에 딸린 값이라 시나리오 행에 둔다. kind 의 허용 집합은 코드 쪽(content.NuanceKinds).
ALTER TABLE scenarios ADD COLUMN nuance jsonb NOT NULL DEFAULT '[]';
