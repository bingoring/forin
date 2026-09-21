-- 학습자가 고른 목표 부서. 여정 지도가 그리는 트랙이 이 값으로 정해진다.
-- 빈 문자열 = 아직 고르지 않음 → 서버가 읽는 시점에 추론하되 저장하지 않는다(J4).
-- CHECK 제약을 걸지 않는 이유: 부서는 콘텐츠가 늘면 늘어나는 값이라, DB에 굳히면
-- 부서 하나를 더하는 일이 마이그레이션을 요구하게 된다. 허용 집합은 코드 쪽(campus.Of)이다.
ALTER TABLE profiles ADD COLUMN goal_dept text NOT NULL DEFAULT '';
