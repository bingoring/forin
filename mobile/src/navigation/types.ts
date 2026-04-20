import type { CompleteAttemptResponse } from '../types/api';
import type { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MapStackParamList = {
  MapMain: undefined;
  StageIntro: { stageId: string };
  Exercise: { stageId: string; attemptId: string };
  StageComplete: { result: CompleteAttemptResponse };
  GiftBox: { boxId: string; boxType: string };
};

// Transitional alias — existing screens reference HomeStackParamList.
// Task 21 removes HomeMain and the alias entirely when the tab navigator
// is rewired to the new Map + Quests + Profile structure.
export type HomeStackParamList = MapStackParamList & {
  HomeMain: undefined;
};

export type QuestsStackParamList = {
  QuestsMain: undefined;
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
  MapTab: NavigatorScreenParams<MapStackParamList>;
  QuestsTab: NavigatorScreenParams<QuestsStackParamList>;
  AchievementsTab: undefined;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
  // Transitional — Task 21 swaps AppNavigator to the new tab set and
  // removes these aliases.
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  LearnTab: undefined;
};
