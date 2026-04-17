import type { CompleteAttemptResponse } from '../types/api';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type HomeStackParamList = {
  HomeMain: undefined;
  StageIntro: { stageId: string };
  Exercise: { stageId: string; attemptId: string };
  StageComplete: { result: CompleteAttemptResponse };
};

export type LearnStackParamList = {
  CurriculumMap: undefined;
};

export type AchievementsStackParamList = {
  AchievementList: undefined;
};

export type ProfileStackParamList = {
  ProfileMain: undefined;
};

export type TabParamList = {
  HomeTab: undefined;
  LearnTab: undefined;
  AchievementsTab: undefined;
  ProfileTab: undefined;
};
