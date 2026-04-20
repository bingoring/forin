export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface ApiError {
  success: false;
  error: { code: string; message: string };
}

// Auth
export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: UserInfo;
}

export interface UserInfo {
  id: string;
  email: string;
  display_name: string;
  native_language: string;
  current_level: number;
  current_xp: number;
}

// Profile
export interface UserProfile {
  id: string;
  email: string;
  display_name: string;
  avatar_url: string | null;
  profession: { id: string; name: string; slug: string } | null;
  target_country: string | null;
  native_language: string;
  language_level: string;
  daily_goal: string;
  current_xp: number;
  xp_to_next_level: number;
  total_xp: number;
  current_level: number;
  level_title: string;
  lives: { current: number; max: number; seconds_to_next?: number };
  gems: number;
  catnip: number;
  is_premium: boolean;
  cat_name: string;
  streak: { current_streak: number; longest_streak: number; streak_shields: number };
  daily_progress: {
    goal_type: string;
    xp_target: number;
    xp_today: number;
    stages_completed: number;
    goal_met: boolean;
  };
  timezone: string;
}

// Curriculum
export interface CurriculumModule {
  id: string;
  title: string;
  description: string | null;
  order_index: number;
  min_level_required: number;
  progress: { status: string; completion_percentage: number } | null;
  units: CurriculumUnit[];
}

export interface CurriculumUnit {
  id: string;
  title: string;
  description: string | null;
  order_index: number;
  stages: StageOverview[];
}

export interface StageOverview {
  id: string;
  title: string;
  order_index: number;
  difficulty_level: number;
  estimated_duration_seconds: number;
  progress: { status: string; stars: number; best_score: number; attempts: number } | null;
}

export interface StageDetail {
  id: string;
  title: string;
  scenario_description: string;
  difficulty_level: number;
  estimated_duration_seconds: number;
  xp_base: number;
  exercises: Exercise[];
  progress: { status: string; stars: number; best_score: number; attempts: number } | null;
}

export interface Exercise {
  id: string;
  exercise_type: 'sentence_arrangement' | 'word_puzzle' | 'meaning_match' | 'conversation';
  order_index: number;
  xp_reward: number;
  content: any;
  difficulty_level: number;
  audio_url: string | null;
}

// Learning
export interface StartStageResponse {
  attempt_id: string;
  stage_id: string;
  started_at: string;
  lives: number;
}

export interface SubmitExerciseResponse {
  exercise_id: string;
  is_correct: boolean | null;
  score: number | null;
  xp_earned: number;
  lives_after: number;
  lives_lost: number;
  details: any;
}

export interface CompleteAttemptResponse {
  attempt_id: string;
  stage_id: string;
  total_score: number;
  stars_earned: number;
  xp_earned: number;
  mistakes_count: number;
  duration_seconds: number;
  level_up: { previous_level: number; new_level: number; new_title: string } | null;
  streak_update: { current_streak: number; was_extended: boolean; milestone_hit: number | null } | null;
  achievements: { id: string; slug: string; name: string }[];
  gift_box: { id: string; box_type: string } | null;
}

// Onboarding
export interface Profession {
  id: string;
  name: string;
  slug: string;
}

export interface Country {
  code: string;
  name: string;
  flag_url: string;
  accent: string;
}
