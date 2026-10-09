-- 학습 화면 v46(결정 8): 상황마다 따로 저작하는 순서 배열 카드 한 장 — 대화 4줄과 머리말·해설.
-- 문장·뉘앙스처럼 상황에 딸린 값이라 시나리오 행에 둔다. NULL = 저작 전(화면이 그 장을 건너뛴다).
-- `order`는 SQL 예약어라 lesson_order. 모양 규칙은 코드 쪽(content.ValidateOrder, V19).
ALTER TABLE scenarios ADD COLUMN lesson_order jsonb;
