-- 오늘의 호출: 수락과 응답을 분리한다.
--
-- answered_at 하나로는 "지금 응답"을 누른 것과 실제로 그 상황을 한 것을 구분할 수
-- 없었다. 눌러놓고 시나리오에서 바로 나와도 "응답 완료 · 보너스 +40 XP"가 떴는데,
-- 그건 하지 않은 일을 했다고 말하는 것이다. 호출에 응답한다는 건 가는 것이지
-- 수락 버튼을 누르는 것이 아니다.
--
-- accepted_at = 버튼을 누른 시각(카운트다운이 멈추는 지점),
-- answered_at = 그 시나리오를 실제로 시작한 것이 확인된 시각(보너스가 지급되는 지점).
ALTER TABLE daily_pages ADD COLUMN IF NOT EXISTS accepted_at timestamptz;
-- 이미 answered로 기록된 행은 수락도 한 것으로 본다(그때의 의미가 그랬다).
UPDATE daily_pages SET accepted_at = answered_at WHERE accepted_at IS NULL AND answered_at IS NOT NULL;
