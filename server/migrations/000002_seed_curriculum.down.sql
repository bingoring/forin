-- Remove all seeded curriculum data
DELETE FROM exercises WHERE stage_id IN (
  SELECT s.id FROM stages s
  JOIN units u ON s.unit_id = u.id
  JOIN curriculum_modules cm ON u.module_id = cm.id
  JOIN professions p ON cm.profession_id = p.id
  WHERE p.slug = 'nurse' AND cm.target_country = 'AU'
);

DELETE FROM stages WHERE unit_id IN (
  SELECT u.id FROM units u
  JOIN curriculum_modules cm ON u.module_id = cm.id
  JOIN professions p ON cm.profession_id = p.id
  WHERE p.slug = 'nurse' AND cm.target_country = 'AU'
);

DELETE FROM units WHERE module_id IN (
  SELECT cm.id FROM curriculum_modules cm
  JOIN professions p ON cm.profession_id = p.id
  WHERE p.slug = 'nurse' AND cm.target_country = 'AU'
);

DELETE FROM curriculum_modules WHERE profession_id IN (
  SELECT id FROM professions WHERE slug = 'nurse'
) AND target_country = 'AU';
