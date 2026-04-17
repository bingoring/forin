import type { CompleteAttemptResponse } from '../types/api';
import type { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type HomeStackParamList = {
  HomeMain: undefined;
  StageIntro: { stageId: string };
  Exercise: { stageId: string; attemptId: string };
  StageComplete: { result: CompleteAttemptResponse };
  GiftBox: { boxId: string; boxType: string };
};

export type ProfileStackParamList = {
  ProfileMain: undefined;
  Inventory: undefined;
  Shop: undefined;
  NotificationSettings: undefined;
};

export type TabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  LearnTab: undefined;
  AchievementsTab: undefined;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
};
