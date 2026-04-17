-- Seed curriculum: Module 1 & 2 for Nurse / Australia
-- 20 stages, ~80 exercises total

-- Module 1: Clinical Communication Fundamentals
INSERT INTO curriculum_modules (id, profession_id, target_country, title, description, order_index, min_level_required, is_published)
SELECT
  gen_random_uuid(),
  p.id,
  'AU',
  'Clinical Communication Fundamentals',
  'Master essential communication skills for Australian healthcare settings',
  1,
  1,
  true
FROM professions p WHERE p.slug = 'nurse'
ON CONFLICT DO NOTHING;

-- Module 2: Patient Assessment & Documentation
INSERT INTO curriculum_modules (id, profession_id, target_country, title, description, order_index, min_level_required, is_published)
SELECT
  gen_random_uuid(),
  p.id,
  'AU',
  'Patient Assessment & Documentation',
  'Learn to conduct and document patient assessments in Australian clinical settings',
  2,
  3,
  true
FROM professions p WHERE p.slug = 'nurse'
ON CONFLICT DO NOTHING;

-- Units for Module 1 (4 units)
DO $$
DECLARE
  mod1_id UUID;
  u1_id UUID := gen_random_uuid();
  u2_id UUID := gen_random_uuid();
  u3_id UUID := gen_random_uuid();
  u4_id UUID := gen_random_uuid();
BEGIN
  SELECT cm.id INTO mod1_id FROM curriculum_modules cm
    JOIN professions p ON cm.profession_id = p.id
    WHERE p.slug = 'nurse' AND cm.target_country = 'AU' AND cm.order_index = 1;

  IF mod1_id IS NULL THEN RETURN; END IF;

  -- Unit 1: Self-Introduction & Patient Greetings
  INSERT INTO units (id, module_id, title, description, order_index, is_published)
  VALUES (u1_id, mod1_id, 'Self-Introduction & Patient Greetings', 'Introduce yourself professionally and greet patients', 1, true);

  -- Unit 2: Taking Patient History
  INSERT INTO units (id, module_id, title, description, order_index, is_published)
  VALUES (u2_id, mod1_id, 'Taking Patient History', 'Ask about symptoms, medical history, and medications', 2, true);

  -- Unit 3: Vital Signs Communication
  INSERT INTO units (id, module_id, title, description, order_index, is_published)
  VALUES (u3_id, mod1_id, 'Vital Signs Communication', 'Explain procedures and results for vital sign measurements', 3, true);

  -- Unit 4: Patient Rights & Difficult Conversations
  INSERT INTO units (id, module_id, title, description, order_index, is_published)
  VALUES (u4_id, mod1_id, 'Patient Rights & Difficult Conversations', 'Handle patient autonomy, consent, and sensitive topics', 4, true);

  -- =============================================
  -- STAGES + EXERCISES
  -- =============================================

  -- === Unit 1: Self-Introduction (3 stages, 12 exercises) ===

  -- Stage 1.1: Meeting a New Patient
  INSERT INTO stages (id, unit_id, title, scenario_description, order_index, difficulty_level, estimated_duration_seconds, xp_base, is_published)
  VALUES (gen_random_uuid(), u1_id, 'Meeting a New Patient', 'You are starting your shift and meeting Mrs. Thompson for the first time.', 1, 1, 300, 50, true);

  INSERT INTO exercises (stage_id, exercise_type, order_index, xp_reward, content)
  SELECT s.id, 'sentence_arrangement', 1, 10,
    '{"target_sentence":"Good morning Mrs. Thompson, my name is Sarah and I will be your nurse today.","word_tiles":["Good","morning","Mrs.","Thompson,","my","name","is","Sarah","and","I","will","be","your","nurse","today.","doctor","evening"],"distractor_indices":[15,16],"hint_remove_count":2}'::jsonb
  FROM stages s WHERE s.title = 'Meeting a New Patient';

  INSERT INTO exercises (stage_id, exercise_type, order_index, xp_reward, content)
  SELECT s.id, 'word_puzzle', 2, 10,
    '{"dialogue_template":"I will be looking after you during my {{0}}. Please let me know if you need {{1}}.","blanks":[{"index":0,"correct_answer":"shift","options":["shift","break","lunch","nap"]},{"index":1,"correct_answer":"anything","options":["anything","nothing","medicine","sleep"]}]}'::jsonb
  FROM stages s WHERE s.title = 'Meeting a New Patient';

  INSERT INTO exercises (stage_id, exercise_type, order_index, xp_reward, content)
  SELECT s.id, 'meaning_match', 3, 10,
    '{"pairs":[{"term":"RN","definition":"Registered Nurse"},{"term":"EN","definition":"Enrolled Nurse"},{"term":"NUM","definition":"Nurse Unit Manager"},{"term":"CNS","definition":"Clinical Nurse Specialist"},{"term":"AIN","definition":"Assistant in Nursing"},{"term":"DON","definition":"Director of Nursing"}]}'::jsonb
  FROM stages s WHERE s.title = 'Meeting a New Patient';

  INSERT INTO exercises (stage_id, exercise_type, order_index, xp_reward, content)
  SELECT s.id, 'conversation', 4, 10,
    '{"ai_character_name":"Mrs. Thompson","ai_character_role":"patient","opening_line":"Oh hello dear, are you my new nurse? I have been waiting quite a while.","ideal_responses":["Good morning Mrs. Thompson. I apologise for the wait. My name is Sarah and I am your registered nurse for today. How are you feeling this morning?"],"evaluation_rubric":{"vocabulary_keywords":["registered nurse","apologise","morning"],"tone_keywords":["sorry","understand","how are you"],"required_content_points":["introduce yourself","acknowledge wait","ask about wellbeing"]},"min_passing_score":40}'::jsonb
  FROM stages s WHERE s.title = 'Meeting a New Patient';

  -- Stage 1.2: Handover Introduction
  INSERT INTO stages (id, unit_id, title, scenario_description, order_index, difficulty_level, estimated_duration_seconds, xp_base, is_published)
  VALUES (gen_random_uuid(), u1_id, 'Handover Introduction', 'You are taking over from the previous nurse and introducing yourself to the patient.', 2, 1, 300, 50, true);

  INSERT INTO exercises (stage_id, exercise_type, order_index, xp_reward, content)
  SELECT s.id, 'sentence_arrangement', 1, 10,
    '{"target_sentence":"I am taking over from Nurse Kim for the evening shift.","word_tiles":["I","am","taking","over","from","Nurse","Kim","for","the","evening","shift.","morning","Dr."],"distractor_indices":[11,12],"hint_remove_count":2}'::jsonb
  FROM stages s WHERE s.title = 'Handover Introduction';

  INSERT INTO exercises (stage_id, exercise_type, order_index, xp_reward, content)
  SELECT s.id, 'word_puzzle', 2, 10,
    '{"dialogue_template":"The previous nurse has given me a thorough {{0}} about your {{1}}.","blanks":[{"index":0,"correct_answer":"handover","options":["handover","message","letter","email"]},{"index":1,"correct_answer":"condition","options":["condition","problem","issue","complaint"]}]}'::jsonb
  FROM stages s WHERE s.title = 'Handover Introduction';

  INSERT INTO exercises (stage_id, exercise_type, order_index, xp_reward, content)
  SELECT s.id, 'meaning_match', 3, 10,
    '{"pairs":[{"term":"Handover","definition":"Transfer of patient care between staff"},{"term":"Shift","definition":"A scheduled period of work"},{"term":"Obs","definition":"Observations (vital signs)"},{"term":"Ward","definition":"Hospital department for patient care"}]}'::jsonb
  FROM stages s WHERE s.title = 'Handover Introduction';

  INSERT INTO exercises (stage_id, exercise_type, order_index, xp_reward, content)
  SELECT s.id, 'conversation', 4, 10,
    '{"ai_character_name":"Mr. Lee","ai_character_role":"patient","opening_line":"Another new nurse? I have had three different nurses today!","ideal_responses":["I understand that can be frustrating, Mr. Lee. My name is Sarah and I will be your nurse for the rest of the evening. I have been fully briefed on your care plan."],"evaluation_rubric":{"vocabulary_keywords":["nurse","evening","care plan","briefed"],"tone_keywords":["understand","frustrating","sorry"],"required_content_points":["acknowledge frustration","introduce yourself","reassure continuity of care"]},"min_passing_score":40}'::jsonb
  FROM stages s WHERE s.title = 'Handover Introduction';

  -- Stage 1.3: Phone Introduction
  INSERT INTO stages (id, unit_id, title, scenario_description, order_index, difficulty_level, estimated_duration_seconds, xp_base, is_published)
  VALUES (gen_random_uuid(), u1_id, 'Phone Introduction', 'You need to call a doctor about a patient concern using ISBAR.', 3, 2, 300, 50, true);

  INSERT INTO exercises (stage_id, exercise_type, order_index, xp_reward, content)
  SELECT s.id, 'sentence_arrangement', 1, 10,
    '{"target_sentence":"Good evening Doctor, this is Sarah calling from Ward 3B regarding Mr. Lee.","word_tiles":["Good","evening","Doctor,","this","is","Sarah","calling","from","Ward","3B","regarding","Mr.","Lee.","about","Nurse"],"distractor_indices":[13,14],"hint_remove_count":2}'::jsonb
  FROM stages s WHERE s.title = 'Phone Introduction';

  INSERT INTO exercises (stage_id, exercise_type, order_index, xp_reward, content)
  SELECT s.id, 'meaning_match', 2, 10,
    '{"pairs":[{"term":"ISBAR","definition":"Identify, Situation, Background, Assessment, Recommendation"},{"term":"Escalation","definition":"Reporting concerns to a senior clinician"},{"term":"MET call","definition":"Medical Emergency Team activation"},{"term":"Rapid response","definition":"Urgent clinical review"}]}'::jsonb
  FROM stages s WHERE s.title = 'Phone Introduction';

  INSERT INTO exercises (stage_id, exercise_type, order_index, xp_reward, content)
  SELECT s.id, 'word_puzzle', 3, 10,
    '{"dialogue_template":"I am calling to {{0}} a change in Mr. Lee''s {{1}}. His blood pressure has {{2}} significantly.","blanks":[{"index":0,"correct_answer":"report","options":["report","tell","say","speak"]},{"index":1,"correct_answer":"condition","options":["condition","mood","bed","room"]},{"index":2,"correct_answer":"dropped","options":["dropped","risen","stayed","changed"]}]}'::jsonb
  FROM stages s WHERE s.title = 'Phone Introduction';

  INSERT INTO exercises (stage_id, exercise_type, order_index, xp_reward, content)
  SELECT s.id, 'conversation', 4, 10,
    '{"ai_character_name":"Dr. Patel","ai_character_role":"doctor","opening_line":"Yes, go ahead nurse. What is the situation?","ideal_responses":["Dr. Patel, this is Sarah, RN on Ward 3B. I am calling about Mr. Lee in bed 4. His blood pressure has dropped from 130/80 to 90/60 over the past hour and he is reporting dizziness."],"evaluation_rubric":{"vocabulary_keywords":["blood pressure","dropped","dizziness","ward","bed"],"tone_keywords":["calling about","reporting","concerned"],"required_content_points":["identify yourself","state patient location","describe vital sign change","report symptoms"]},"min_passing_score":40}'::jsonb
  FROM stages s WHERE s.title = 'Phone Introduction';

  -- === Unit 2: Taking Patient History (3 stages) ===

  INSERT INTO stages (id, unit_id, title, scenario_description, order_index, difficulty_level, estimated_duration_seconds, xp_base, is_published)
  VALUES (gen_random_uuid(), u2_id, 'Asking About Symptoms', 'Ask a patient about their presenting complaint and symptoms.', 1, 2, 300, 50, true);

  INSERT INTO exercises (stage_id, exercise_type, order_index, xp_reward, content)
  SELECT s.id, 'sentence_arrangement', 1, 10,
    '{"target_sentence":"Can you tell me when the pain first started?","word_tiles":["Can","you","tell","me","when","the","pain","first","started?","stopped","how"],"distractor_indices":[9,10],"hint_remove_count":2}'::jsonb
  FROM stages s WHERE s.title = 'Asking About Symptoms';

  INSERT INTO exercises (stage_id, exercise_type, order_index, xp_reward, content)
  SELECT s.id, 'word_puzzle', 2, 10,
    '{"dialogue_template":"On a scale of one to {{0}}, how would you rate your {{1}} right now?","blanks":[{"index":0,"correct_answer":"ten","options":["ten","five","hundred","three"]},{"index":1,"correct_answer":"pain","options":["pain","day","mood","appetite"]}]}'::jsonb
  FROM stages s WHERE s.title = 'Asking About Symptoms';

  INSERT INTO exercises (stage_id, exercise_type, order_index, xp_reward, content)
  SELECT s.id, 'meaning_match', 3, 10,
    '{"pairs":[{"term":"Onset","definition":"When the symptom started"},{"term":"Duration","definition":"How long the symptom lasts"},{"term":"Severity","definition":"How bad the symptom is"},{"term":"Radiating","definition":"Pain spreading to other areas"},{"term":"Aggravating","definition":"What makes it worse"},{"term":"Alleviating","definition":"What makes it better"}]}'::jsonb
  FROM stages s WHERE s.title = 'Asking About Symptoms';

  INSERT INTO exercises (stage_id, exercise_type, order_index, xp_reward, content)
  SELECT s.id, 'conversation', 4, 10,
    '{"ai_character_name":"Mrs. Chen","ai_character_role":"patient","opening_line":"I have been having this terrible chest pain since this morning.","ideal_responses":["I am sorry to hear that, Mrs. Chen. I need to ask you a few questions about the pain. Can you describe exactly where you feel the pain and whether it spreads anywhere else?"],"evaluation_rubric":{"vocabulary_keywords":["chest pain","describe","where","spreads","radiating"],"tone_keywords":["sorry","understand","need to ask"],"required_content_points":["acknowledge pain","ask location","ask radiation","systematic approach"]},"min_passing_score":40}'::jsonb
  FROM stages s WHERE s.title = 'Asking About Symptoms';

  INSERT INTO stages (id, unit_id, title, scenario_description, order_index, difficulty_level, estimated_duration_seconds, xp_base, is_published)
  VALUES (gen_random_uuid(), u2_id, 'Medical History Review', 'Review a patient''s past medical history and current medications.', 2, 2, 300, 50, true);

  INSERT INTO exercises (stage_id, exercise_type, order_index, xp_reward, content)
  SELECT s.id, 'sentence_arrangement', 1, 10,
    '{"target_sentence":"Do you have any allergies to medications or food?","word_tiles":["Do","you","have","any","allergies","to","medications","or","food?","injuries","sports"],"distractor_indices":[9,10],"hint_remove_count":2}'::jsonb
  FROM stages s WHERE s.title = 'Medical History Review';

  INSERT INTO exercises (stage_id, exercise_type, order_index, xp_reward, content)
  SELECT s.id, 'word_puzzle', 2, 10,
    '{"dialogue_template":"Are you currently taking any {{0}} medications or {{1}}?","blanks":[{"index":0,"correct_answer":"prescription","options":["prescription","expensive","foreign","new"]},{"index":1,"correct_answer":"supplements","options":["supplements","snacks","vitamins","drinks"]}]}'::jsonb
  FROM stages s WHERE s.title = 'Medical History Review';

  INSERT INTO exercises (stage_id, exercise_type, order_index, xp_reward, content)
  SELECT s.id, 'meaning_match', 3, 10,
    '{"pairs":[{"term":"PMH","definition":"Past Medical History"},{"term":"Hx","definition":"History"},{"term":"Dx","definition":"Diagnosis"},{"term":"Rx","definition":"Prescription/Treatment"},{"term":"Allergy","definition":"Adverse immune reaction"},{"term":"Contraindication","definition":"Reason not to give a treatment"}]}'::jsonb
  FROM stages s WHERE s.title = 'Medical History Review';

  INSERT INTO exercises (stage_id, exercise_type, order_index, xp_reward, content)
  SELECT s.id, 'conversation', 4, 10,
    '{"ai_character_name":"Mr. Singh","ai_character_role":"patient","opening_line":"I take a few tablets but I cannot remember all the names.","ideal_responses":["That is perfectly fine, Mr. Singh. Do you happen to have a medication list with you, or would you like me to check our records? It is important we have an accurate list of everything you are taking."],"evaluation_rubric":{"vocabulary_keywords":["medication list","records","accurate","taking"],"tone_keywords":["fine","perfectly","important","like me to"],"required_content_points":["reassure patient","offer alternatives","explain importance"]},"min_passing_score":40}'::jsonb
  FROM stages s WHERE s.title = 'Medical History Review';

  INSERT INTO stages (id, unit_id, title, scenario_description, order_index, difficulty_level, estimated_duration_seconds, xp_base, is_published)
  VALUES (gen_random_uuid(), u2_id, 'Family & Social History', 'Gather family history and social background sensitively.', 3, 3, 360, 50, true);

  INSERT INTO exercises (stage_id, exercise_type, order_index, xp_reward, content)
  SELECT s.id, 'sentence_arrangement', 1, 10,
    '{"target_sentence":"I need to ask some questions about your family health history.","word_tiles":["I","need","to","ask","some","questions","about","your","family","health","history.","personal","financial"],"distractor_indices":[11,12],"hint_remove_count":2}'::jsonb
  FROM stages s WHERE s.title = 'Family & Social History';

  INSERT INTO exercises (stage_id, exercise_type, order_index, xp_reward, content)
  SELECT s.id, 'word_puzzle', 2, 10,
    '{"dialogue_template":"Does anyone in your family have a history of {{0}} disease or {{1}}?","blanks":[{"index":0,"correct_answer":"heart","options":["heart","skin","eye","hair"]},{"index":1,"correct_answer":"diabetes","options":["diabetes","headaches","allergies","colds"]}]}'::jsonb
  FROM stages s WHERE s.title = 'Family & Social History';

  INSERT INTO exercises (stage_id, exercise_type, order_index, xp_reward, content)
  SELECT s.id, 'meaning_match', 3, 10,
    '{"pairs":[{"term":"NOK","definition":"Next of Kin"},{"term":"ADL","definition":"Activities of Daily Living"},{"term":"ATSI","definition":"Aboriginal and Torres Strait Islander"},{"term":"CALD","definition":"Culturally and Linguistically Diverse"}]}'::jsonb
  FROM stages s WHERE s.title = 'Family & Social History';

  INSERT INTO exercises (stage_id, exercise_type, order_index, xp_reward, content)
  SELECT s.id, 'conversation', 4, 10,
    '{"ai_character_name":"Ms. Williams","ai_character_role":"patient","opening_line":"Why do you need to know about my family? That is quite personal.","ideal_responses":["I completely understand your concern, Ms. Williams. We ask about family history because some conditions can run in families, and it helps us provide you with the best possible care. You do not have to answer anything you are not comfortable with."],"evaluation_rubric":{"vocabulary_keywords":["family history","conditions","run in families","care"],"tone_keywords":["understand","concern","comfortable","do not have to"],"required_content_points":["validate concern","explain reason","reassure autonomy"]},"min_passing_score":40}'::jsonb
  FROM stages s WHERE s.title = 'Family & Social History';

  -- === Unit 3: Vital Signs (2 stages) ===

  INSERT INTO stages (id, unit_id, title, scenario_description, order_index, difficulty_level, estimated_duration_seconds, xp_base, is_published)
  VALUES (gen_random_uuid(), u3_id, 'Blood Pressure Check', 'Explain and perform a blood pressure measurement.', 1, 2, 300, 50, true);

  INSERT INTO exercises (stage_id, exercise_type, order_index, xp_reward, content)
  SELECT s.id, 'sentence_arrangement', 1, 10,
    '{"target_sentence":"I am going to check your blood pressure now, is that okay?","word_tiles":["I","am","going","to","check","your","blood","pressure","now,","is","that","okay?","temperature","later"],"distractor_indices":[12,13],"hint_remove_count":2}'::jsonb
  FROM stages s WHERE s.title = 'Blood Pressure Check';

  INSERT INTO exercises (stage_id, exercise_type, order_index, xp_reward, content)
  SELECT s.id, 'word_puzzle', 2, 10,
    '{"dialogue_template":"Your blood pressure reading is {{0}} over {{1}}, which is within the normal range.","blanks":[{"index":0,"correct_answer":"120","options":["120","200","80","50"]},{"index":1,"correct_answer":"80","options":["80","120","60","40"]}]}'::jsonb
  FROM stages s WHERE s.title = 'Blood Pressure Check';

  INSERT INTO exercises (stage_id, exercise_type, order_index, xp_reward, content)
  SELECT s.id, 'meaning_match', 3, 10,
    '{"pairs":[{"term":"BP","definition":"Blood Pressure"},{"term":"Systolic","definition":"Pressure when heart beats"},{"term":"Diastolic","definition":"Pressure between heartbeats"},{"term":"Hypertension","definition":"High blood pressure"},{"term":"Hypotension","definition":"Low blood pressure"}]}'::jsonb
  FROM stages s WHERE s.title = 'Blood Pressure Check';

  INSERT INTO exercises (stage_id, exercise_type, order_index, xp_reward, content)
  SELECT s.id, 'conversation', 4, 10,
    '{"ai_character_name":"Mr. Johnson","ai_character_role":"patient","opening_line":"What does 150 over 95 mean? Is that bad?","ideal_responses":["Your blood pressure is a bit higher than we would like, Mr. Johnson. The top number shows the pressure when your heart pumps, and the bottom number is when it rests. We will monitor it closely and the doctor may want to discuss some options with you."],"evaluation_rubric":{"vocabulary_keywords":["blood pressure","higher","pumps","rests","monitor","doctor"],"tone_keywords":["we would like","closely","discuss","options"],"required_content_points":["explain the numbers","indicate concern without alarm","mention monitoring","reference doctor follow-up"]},"min_passing_score":40}'::jsonb
  FROM stages s WHERE s.title = 'Blood Pressure Check';

  INSERT INTO stages (id, unit_id, title, scenario_description, order_index, difficulty_level, estimated_duration_seconds, xp_base, is_published)
  VALUES (gen_random_uuid(), u3_id, 'Temperature & Pulse', 'Check and explain temperature and pulse readings.', 2, 2, 300, 50, true);

  INSERT INTO exercises (stage_id, exercise_type, order_index, xp_reward, content)
  SELECT s.id, 'sentence_arrangement', 1, 10,
    '{"target_sentence":"Your temperature is slightly elevated at 38.2 degrees.","word_tiles":["Your","temperature","is","slightly","elevated","at","38.2","degrees.","normal","low"],"distractor_indices":[8,9],"hint_remove_count":2}'::jsonb
  FROM stages s WHERE s.title = 'Temperature & Pulse';

  INSERT INTO exercises (stage_id, exercise_type, order_index, xp_reward, content)
  SELECT s.id, 'word_puzzle', 2, 10,
    '{"dialogue_template":"A normal resting heart rate is between {{0}} and {{1}} beats per minute.","blanks":[{"index":0,"correct_answer":"60","options":["60","20","100","150"]},{"index":1,"correct_answer":"100","options":["100","60","200","80"]}]}'::jsonb
  FROM stages s WHERE s.title = 'Temperature & Pulse';

  INSERT INTO exercises (stage_id, exercise_type, order_index, xp_reward, content)
  SELECT s.id, 'meaning_match', 3, 10,
    '{"pairs":[{"term":"Febrile","definition":"Having a fever"},{"term":"Afebrile","definition":"Without fever"},{"term":"Tachycardia","definition":"Heart rate above 100 bpm"},{"term":"Bradycardia","definition":"Heart rate below 60 bpm"}]}'::jsonb
  FROM stages s WHERE s.title = 'Temperature & Pulse';

  INSERT INTO exercises (stage_id, exercise_type, order_index, xp_reward, content)
  SELECT s.id, 'conversation', 4, 10,
    '{"ai_character_name":"Mrs. Park","ai_character_role":"patient","opening_line":"I feel hot and my heart is racing. Is something wrong?","ideal_responses":["I can see you are feeling unwell, Mrs. Park. Your temperature is 38.5 degrees which is a mild fever, and your heart rate is 105 which is slightly fast. This can happen with a fever. I am going to let the doctor know and we will make sure you are comfortable."],"evaluation_rubric":{"vocabulary_keywords":["temperature","fever","heart rate","doctor"],"tone_keywords":["unwell","comfortable","make sure","can see"],"required_content_points":["acknowledge symptoms","state readings","explain connection","reassure and escalate"]},"min_passing_score":40}'::jsonb
  FROM stages s WHERE s.title = 'Temperature & Pulse';

  -- === Unit 4: Patient Rights (2 stages) ===

  INSERT INTO stages (id, unit_id, title, scenario_description, order_index, difficulty_level, estimated_duration_seconds, xp_base, is_published)
  VALUES (gen_random_uuid(), u4_id, 'Patient Wants to Leave', 'A patient wants to leave before test results are available.', 1, 3, 360, 50, true);

  INSERT INTO exercises (stage_id, exercise_type, order_index, xp_reward, content)
  SELECT s.id, 'sentence_arrangement', 1, 10,
    '{"target_sentence":"I completely understand that you want to go home, Mr. Johnson.","word_tiles":["I","completely","understand","that","you","want","to","go","home,","Mr.","Johnson.","must","stay"],"distractor_indices":[11,12],"hint_remove_count":2}'::jsonb
  FROM stages s WHERE s.title = 'Patient Wants to Leave';

  INSERT INTO exercises (stage_id, exercise_type, order_index, xp_reward, content)
  SELECT s.id, 'word_puzzle', 2, 10,
    '{"dialogue_template":"We are waiting for your {{0}} results, which check for heart {{1}}.","blanks":[{"index":0,"correct_answer":"troponin","options":["troponin","urine","blood sugar","X-ray"]},{"index":1,"correct_answer":"damage","options":["damage","pressure","rate","rhythm"]}]}'::jsonb
  FROM stages s WHERE s.title = 'Patient Wants to Leave';

  INSERT INTO exercises (stage_id, exercise_type, order_index, xp_reward, content)
  SELECT s.id, 'meaning_match', 3, 10,
    '{"pairs":[{"term":"AMA","definition":"Against Medical Advice"},{"term":"Informed consent","definition":"Patient agrees after understanding risks"},{"term":"Autonomy","definition":"Patient right to make own decisions"},{"term":"Troponin","definition":"Protein released when heart muscle is damaged"},{"term":"NPO","definition":"Nothing by mouth"},{"term":"PRN","definition":"As needed"}]}'::jsonb
  FROM stages s WHERE s.title = 'Patient Wants to Leave';

  INSERT INTO exercises (stage_id, exercise_type, order_index, xp_reward, content)
  SELECT s.id, 'conversation', 4, 10,
    '{"ai_character_name":"Mr. Johnson","ai_character_role":"patient","opening_line":"I feel fine and I am going home now. You cannot stop me.","ideal_responses":["You are absolutely right that I cannot stop you, Mr. Johnson. But I want to make sure you have all the information you need. We are still waiting on your troponin results which test for heart muscle damage. Leaving before we get those results means we cannot rule out a serious heart condition. The results should be ready within two hours."],"evaluation_rubric":{"vocabulary_keywords":["troponin","heart muscle","damage","results","hours"],"tone_keywords":["absolutely right","cannot stop","want to make sure","information"],"required_content_points":["acknowledge patient autonomy","explain pending test","state specific risk","offer timeline"]},"min_passing_score":40}'::jsonb
  FROM stages s WHERE s.title = 'Patient Wants to Leave';

  INSERT INTO stages (id, unit_id, title, scenario_description, order_index, difficulty_level, estimated_duration_seconds, xp_base, is_published)
  VALUES (gen_random_uuid(), u4_id, 'Breaking Bad News', 'Communicate difficult information to a patient with empathy.', 2, 4, 420, 60, true);

  INSERT INTO exercises (stage_id, exercise_type, order_index, xp_reward, content)
  SELECT s.id, 'sentence_arrangement', 1, 10,
    '{"target_sentence":"I am afraid the test results show some concerning findings.","word_tiles":["I","am","afraid","the","test","results","show","some","concerning","findings.","great","happy"],"distractor_indices":[10,11],"hint_remove_count":2}'::jsonb
  FROM stages s WHERE s.title = 'Breaking Bad News';

  INSERT INTO exercises (stage_id, exercise_type, order_index, xp_reward, content)
  SELECT s.id, 'word_puzzle', 2, 10,
    '{"dialogue_template":"The doctor would like to {{0}} the results with you and discuss your {{1}} options.","blanks":[{"index":0,"correct_answer":"review","options":["review","hide","ignore","forget"]},{"index":1,"correct_answer":"treatment","options":["treatment","payment","discharge","parking"]}]}'::jsonb
  FROM stages s WHERE s.title = 'Breaking Bad News';

  INSERT INTO exercises (stage_id, exercise_type, order_index, xp_reward, content)
  SELECT s.id, 'meaning_match', 3, 10,
    '{"pairs":[{"term":"SPIKES","definition":"Framework for breaking bad news"},{"term":"Prognosis","definition":"Expected course of a disease"},{"term":"Palliative","definition":"Comfort-focused care"},{"term":"Empathy","definition":"Understanding another person feelings"}]}'::jsonb
  FROM stages s WHERE s.title = 'Breaking Bad News';

  INSERT INTO exercises (stage_id, exercise_type, order_index, xp_reward, content)
  SELECT s.id, 'conversation', 4, 10,
    '{"ai_character_name":"Mrs. Chen","ai_character_role":"patient","opening_line":"What did the tests show? Please just tell me straight.","ideal_responses":["Mrs. Chen, I want to be honest with you. The test results have come back and they show some abnormalities that the doctor needs to discuss with you in detail. I know this must be worrying, and I want you to know that we are here to support you through this. Would you like me to arrange for the doctor to come and speak with you now?"],"evaluation_rubric":{"vocabulary_keywords":["test results","abnormalities","doctor","discuss","support"],"tone_keywords":["honest","worrying","know","here for you","support"],"required_content_points":["be direct but gentle","mention results","offer doctor consultation","show support"]},"min_passing_score":40}'::jsonb
  FROM stages s WHERE s.title = 'Breaking Bad News';

END $$;

-- Units for Module 2 (similar pattern, abbreviated for migration size)
DO $$
DECLARE
  mod2_id UUID;
  u5_id UUID := gen_random_uuid();
  u6_id UUID := gen_random_uuid();
  u7_id UUID := gen_random_uuid();
  u8_id UUID := gen_random_uuid();
BEGIN
  SELECT cm.id INTO mod2_id FROM curriculum_modules cm
    JOIN professions p ON cm.profession_id = p.id
    WHERE p.slug = 'nurse' AND cm.target_country = 'AU' AND cm.order_index = 2;

  IF mod2_id IS NULL THEN RETURN; END IF;

  INSERT INTO units (id, module_id, title, description, order_index, is_published) VALUES
    (u5_id, mod2_id, 'Head-to-Toe Assessment', 'Systematic physical assessment terminology', 1, true),
    (u6_id, mod2_id, 'Pain Assessment', 'Assess and document pain using standard tools', 2, true),
    (u7_id, mod2_id, 'Wound Assessment', 'Describe and document wound characteristics', 3, true),
    (u8_id, mod2_id, 'Clinical Documentation', 'Write accurate and concise clinical notes', 4, true);

  -- Stage per unit (10 more stages for Module 2 = 10 stages × 4 exercises = 40 exercises)
  -- Unit 5: 3 stages
  INSERT INTO stages (id, unit_id, title, scenario_description, order_index, difficulty_level, estimated_duration_seconds, xp_base, is_published) VALUES
    (gen_random_uuid(), u5_id, 'Neurological Assessment', 'Assess a patient''s neurological status using GCS.', 1, 3, 300, 50, true),
    (gen_random_uuid(), u5_id, 'Respiratory Assessment', 'Assess breathing patterns and oxygen saturation.', 2, 3, 300, 50, true),
    (gen_random_uuid(), u5_id, 'Cardiovascular Assessment', 'Assess heart sounds and peripheral circulation.', 3, 3, 300, 50, true);

  -- Unit 6: 2 stages
  INSERT INTO stages (id, unit_id, title, scenario_description, order_index, difficulty_level, estimated_duration_seconds, xp_base, is_published) VALUES
    (gen_random_uuid(), u6_id, 'Pain Scale Communication', 'Explain and use pain assessment tools with patients.', 1, 2, 300, 50, true),
    (gen_random_uuid(), u6_id, 'Chronic Pain Discussion', 'Discuss chronic pain management options sensitively.', 2, 3, 360, 50, true);

  -- Unit 7: 2 stages
  INSERT INTO stages (id, unit_id, title, scenario_description, order_index, difficulty_level, estimated_duration_seconds, xp_base, is_published) VALUES
    (gen_random_uuid(), u7_id, 'Describing a Wound', 'Document wound characteristics using clinical terminology.', 1, 3, 300, 50, true),
    (gen_random_uuid(), u7_id, 'Wound Care Instructions', 'Explain wound care to a patient being discharged.', 2, 3, 360, 50, true);

  -- Unit 8: 3 stages
  INSERT INTO stages (id, unit_id, title, scenario_description, order_index, difficulty_level, estimated_duration_seconds, xp_base, is_published) VALUES
    (gen_random_uuid(), u8_id, 'Progress Notes', 'Write accurate clinical progress notes.', 1, 3, 300, 50, true),
    (gen_random_uuid(), u8_id, 'Incident Reporting', 'Complete an incident report for a patient fall.', 2, 4, 360, 50, true);

  -- Exercises for Module 2 stages (4 exercises each for the 10 stages)
  -- Using a compact format for the remaining stages

  -- Neurological Assessment
  INSERT INTO exercises (stage_id, exercise_type, order_index, xp_reward, content)
  SELECT s.id, type_name, idx, 10, content_json::jsonb FROM stages s,
  (VALUES
    ('sentence_arrangement', 1, '{"target_sentence":"Can you squeeze my hands and push against my palms?","word_tiles":["Can","you","squeeze","my","hands","and","push","against","my","palms?","feet","pull"],"distractor_indices":[10,11],"hint_remove_count":2}'),
    ('meaning_match', 2, '{"pairs":[{"term":"GCS","definition":"Glasgow Coma Scale"},{"term":"PEARL","definition":"Pupils Equal And Reactive to Light"},{"term":"LOC","definition":"Level of Consciousness"},{"term":"CVA","definition":"Cerebrovascular Accident (Stroke)"}]}'),
    ('word_puzzle', 3, '{"dialogue_template":"The patient''s GCS is {{0}}, which indicates a {{1}} level of consciousness.","blanks":[{"index":0,"correct_answer":"15","options":["15","3","8","20"]},{"index":1,"correct_answer":"normal","options":["normal","low","critical","absent"]}]}'),
    ('conversation', 4, '{"ai_character_name":"Mr. Brown","ai_character_role":"patient","opening_line":"Why do you keep asking me to squeeze your fingers?","ideal_responses":["That is a great question, Mr. Brown. These hand squeezes help me check your neurological function, which means I am testing how well your brain and nerves are communicating with your muscles."],"evaluation_rubric":{"vocabulary_keywords":["neurological","brain","nerves","muscles","function"],"tone_keywords":["great question","help me check"],"required_content_points":["explain purpose","use simple language"]},"min_passing_score":40}')
  ) AS ex(type_name, idx, content_json)
  WHERE s.title = 'Neurological Assessment';

  -- Respiratory Assessment
  INSERT INTO exercises (stage_id, exercise_type, order_index, xp_reward, content)
  SELECT s.id, type_name, idx, 10, content_json::jsonb FROM stages s,
  (VALUES
    ('sentence_arrangement', 1, '{"target_sentence":"I am going to listen to your chest with my stethoscope.","word_tiles":["I","am","going","to","listen","to","your","chest","with","my","stethoscope.","back","thermometer"],"distractor_indices":[11,12],"hint_remove_count":2}'),
    ('meaning_match', 2, '{"pairs":[{"term":"SpO2","definition":"Blood oxygen saturation level"},{"term":"Dyspnoea","definition":"Difficulty breathing"},{"term":"Tachypnoea","definition":"Rapid breathing rate"},{"term":"Crackles","definition":"Abnormal lung sounds like crackling"}]}'),
    ('word_puzzle', 3, '{"dialogue_template":"Your oxygen saturation is {{0}} percent, which is {{1}} the normal range.","blanks":[{"index":0,"correct_answer":"98","options":["98","50","110","75"]},{"index":1,"correct_answer":"within","options":["within","below","above","outside"]}]}'),
    ('conversation', 4, '{"ai_character_name":"Mrs. Adams","ai_character_role":"patient","opening_line":"I am having trouble breathing. What is that clip on my finger?","ideal_responses":["That clip is called a pulse oximeter, Mrs. Adams. It measures the oxygen level in your blood without any needles. Your reading is showing 94 percent which is a little lower than we would like, so I am going to keep monitoring you and let the doctor know."],"evaluation_rubric":{"vocabulary_keywords":["pulse oximeter","oxygen","blood","percent","monitoring"],"tone_keywords":["called","without","keep","let the doctor know"],"required_content_points":["explain device","state reading","indicate concern","plan action"]},"min_passing_score":40}')
  ) AS ex(type_name, idx, content_json)
  WHERE s.title = 'Respiratory Assessment';

  -- Remaining stages get simplified exercises (2 per stage to reach ~80 total)
  -- Cardiovascular, Pain Scale, Chronic Pain, Wound Description, Wound Care, Progress Notes, Incident Report

  INSERT INTO exercises (stage_id, exercise_type, order_index, xp_reward, content)
  SELECT s.id, 'sentence_arrangement', 1, 10,
    '{"target_sentence":"I need to listen to your heart sounds with my stethoscope.","word_tiles":["I","need","to","listen","to","your","heart","sounds","with","my","stethoscope.","watch","back"],"distractor_indices":[11,12],"hint_remove_count":2}'::jsonb
  FROM stages s WHERE s.title = 'Cardiovascular Assessment';

  INSERT INTO exercises (stage_id, exercise_type, order_index, xp_reward, content)
  SELECT s.id, 'meaning_match', 2, 10,
    '{"pairs":[{"term":"HR","definition":"Heart Rate"},{"term":"Murmur","definition":"Abnormal heart sound"},{"term":"Oedema","definition":"Swelling from fluid retention"},{"term":"CRT","definition":"Capillary Refill Time"}]}'::jsonb
  FROM stages s WHERE s.title = 'Cardiovascular Assessment';

  INSERT INTO exercises (stage_id, exercise_type, order_index, xp_reward, content)
  SELECT s.id, 'word_puzzle', 3, 10,
    '{"dialogue_template":"Please rate your pain on a scale of {{0}} to {{1}}.","blanks":[{"index":0,"correct_answer":"zero","options":["zero","one","five","minus"]},{"index":1,"correct_answer":"ten","options":["ten","five","hundred","twenty"]}]}'::jsonb
  FROM stages s WHERE s.title = 'Pain Scale Communication';

  INSERT INTO exercises (stage_id, exercise_type, order_index, xp_reward, content)
  SELECT s.id, 'meaning_match', 2, 10,
    '{"pairs":[{"term":"NRS","definition":"Numeric Rating Scale"},{"term":"VAS","definition":"Visual Analogue Scale"},{"term":"Acute pain","definition":"Short-term pain with clear cause"},{"term":"Chronic pain","definition":"Pain lasting more than 3 months"}]}'::jsonb
  FROM stages s WHERE s.title = 'Pain Scale Communication';

  INSERT INTO exercises (stage_id, exercise_type, order_index, xp_reward, content)
  SELECT s.id, 'conversation', 1, 10,
    '{"ai_character_name":"Mrs. Lopez","ai_character_role":"patient","opening_line":"The pain never goes away. I have tried everything.","ideal_responses":["I hear you, Mrs. Lopez, and I am sorry you have been dealing with this for so long. Chronic pain can be very challenging. Let us work together to review your current pain management plan and see if there are any adjustments we can make."],"evaluation_rubric":{"vocabulary_keywords":["chronic pain","management plan","adjustments"],"tone_keywords":["hear you","sorry","challenging","work together"],"required_content_points":["validate experience","acknowledge duration","offer collaborative approach"]},"min_passing_score":40}'::jsonb
  FROM stages s WHERE s.title = 'Chronic Pain Discussion';

  INSERT INTO exercises (stage_id, exercise_type, order_index, xp_reward, content)
  SELECT s.id, 'meaning_match', 2, 10,
    '{"pairs":[{"term":"Slough","definition":"Yellow/white dead tissue"},{"term":"Granulation","definition":"Red healing tissue"},{"term":"Exudate","definition":"Fluid leaking from a wound"},{"term":"Necrotic","definition":"Dead/black tissue"}]}'::jsonb
  FROM stages s WHERE s.title = 'Describing a Wound';

  INSERT INTO exercises (stage_id, exercise_type, order_index, xp_reward, content)
  SELECT s.id, 'sentence_arrangement', 1, 10,
    '{"target_sentence":"You will need to change the dressing every two days.","word_tiles":["You","will","need","to","change","the","dressing","every","two","days.","bandage","weekly"],"distractor_indices":[10,11],"hint_remove_count":2}'::jsonb
  FROM stages s WHERE s.title = 'Wound Care Instructions';

  INSERT INTO exercises (stage_id, exercise_type, order_index, xp_reward, content)
  SELECT s.id, 'word_puzzle', 1, 10,
    '{"dialogue_template":"Patient alert and oriented. Vital signs {{0}}. No new {{1}} reported.","blanks":[{"index":0,"correct_answer":"stable","options":["stable","missing","unknown","high"]},{"index":1,"correct_answer":"complaints","options":["complaints","visitors","medications","meals"]}]}'::jsonb
  FROM stages s WHERE s.title = 'Progress Notes';

  INSERT INTO exercises (stage_id, exercise_type, order_index, xp_reward, content)
  SELECT s.id, 'meaning_match', 1, 10,
    '{"pairs":[{"term":"SOAP","definition":"Subjective, Objective, Assessment, Plan"},{"term":"Rounding","definition":"Regular patient checks"},{"term":"Charting","definition":"Recording patient information"},{"term":"Incident report","definition":"Documentation of unexpected events"}]}'::jsonb
  FROM stages s WHERE s.title = 'Incident Reporting';

END $$;
