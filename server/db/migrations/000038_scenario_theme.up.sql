-- 커리큘럼 v3: 시나리오에 주제 태그. 런타임이 DB에서 시나리오를 읽으므로
-- 조립기가 theme으로 GROUP BY 하려면 전용 컬럼이 필요하다(briefing JSON 파싱 회피).
-- '' 기본값 = 아직 미태그(P2 전수조사 진행 중); 조립은 미태그를 고아로 잡는다(R3).
ALTER TABLE scenarios ADD COLUMN theme text NOT NULL DEFAULT '';
ALTER TABLE scenarios ADD COLUMN collab_with text NOT NULL DEFAULT '';
CREATE INDEX idx_scenarios_theme ON scenarios (theme);
