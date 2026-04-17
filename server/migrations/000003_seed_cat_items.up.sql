-- Seed cat items (20 items across 5 slots and 5 rarities)

INSERT INTO cat_items (name, description, slot, rarity, image_url, catnip_value, shop_price_catnip, profession_theme) VALUES
-- Hats (5)
('Nurse Cap', 'Classic white nurse cap', 'hat', 'common', '/items/hat_nurse_cap.png', 10, 50, 'nurse'),
('Stethoscope Headband', 'A stethoscope worn as a headband', 'hat', 'uncommon', '/items/hat_stethoscope.png', 20, 100, NULL),
('Surgical Cap', 'Blue surgical cap with fun patterns', 'hat', 'rare', '/items/hat_surgical.png', 40, 200, NULL),
('Crown', 'A golden crown for the best nurse', 'hat', 'epic', '/items/hat_crown.png', 80, 400, NULL),

-- Outfits (5)
('Basic Scrubs', 'Standard blue scrubs', 'outfit', 'common', '/items/outfit_scrubs_blue.png', 10, 50, 'nurse'),
('Pink Scrubs', 'Cute pink scrubs', 'outfit', 'uncommon', '/items/outfit_scrubs_pink.png', 20, 100, NULL),
('Lab Coat', 'Professional white lab coat', 'outfit', 'rare', '/items/outfit_lab_coat.png', 40, 200, NULL),
('Night Shift Scrubs', 'Dark scrubs with star pattern', 'outfit', 'epic', '/items/outfit_night_shift.png', 80, NULL, 'nurse'),

-- Accessories (4)
('Clipboard', 'A clinical clipboard', 'accessory', 'common', '/items/acc_clipboard.png', 10, 50, NULL),
('Stethoscope', 'A fancy stethoscope accessory', 'accessory', 'uncommon', '/items/acc_stethoscope.png', 20, 100, 'nurse'),
('Bandaged Paw', 'A cute bandaged paw', 'accessory', 'rare', '/items/acc_bandage.png', 40, 200, NULL),

-- Backgrounds (3)
('Hospital Room', 'A clean hospital room', 'background', 'common', '/items/bg_hospital.png', 10, 50, NULL),
('Park', 'A sunny park outside the hospital', 'background', 'uncommon', '/items/bg_park.png', 20, 100, NULL),
('Cherry Blossoms', 'Beautiful cherry blossom garden', 'background', 'rare', '/items/bg_cherry.png', 40, 200, NULL),

-- Expressions (3)
('Happy', 'A big happy smile', 'expression', 'common', '/items/expr_happy.png', 10, 50, NULL),
('Focused', 'Determined and focused look', 'expression', 'uncommon', '/items/expr_focused.png', 20, 100, NULL),
('Proud', 'Proud and confident expression', 'expression', 'rare', '/items/expr_proud.png', 40, 200, NULL)

ON CONFLICT DO NOTHING;
