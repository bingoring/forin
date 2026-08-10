-- Scenario acuity: how urgent the situation is, declared by the content itself.
-- Drives which reputation dimension a clear moves (domain/reputation).
-- Deliberately NOT derived from a department: wards, theatres and pharmacies all
-- produce emergencies, and department vocabulary doesn't survive a new profession.
ALTER TABLE scenarios ADD COLUMN acuity text NOT NULL DEFAULT '';
